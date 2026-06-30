-- =============================================================================
-- Sanskruti — "real e-commerce" upgrade migration
-- Run AFTER schema.sql. Paste into Supabase Dashboard → SQL Editor → Run.
-- Safe to re-run (IF NOT EXISTS / CREATE OR REPLACE / DROP ... IF EXISTS).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. ORDERS: capture the shipping address + payment info on each order.
-- ---------------------------------------------------------------------------
alter table public.orders add column if not exists payment_method text not null default 'COD';
alter table public.orders add column if not exists payment_status text not null default 'PENDING';
alter table public.orders add column if not exists payment_ref    text;
alter table public.orders add column if not exists ship_name   text;
alter table public.orders add column if not exists ship_phone  text;
alter table public.orders add column if not exists ship_street text;
alter table public.orders add column if not exists ship_city   text;
alter table public.orders add column if not exists ship_state  text;
alter table public.orders add column if not exists ship_zip    text;

-- order_items: remember the chosen size in the snapshot.
alter table public.order_items add column if not exists size text;

-- ---------------------------------------------------------------------------
-- 2. PLACE ORDER (atomic): validate + decrement stock, create order + items.
--    Runs as one transaction so two shoppers can't oversell the last piece.
--    Stock is only enforced for real product rows (uuid ids); demo/mock ids
--    are accepted as-is so the sample catalog still checks out.
-- ---------------------------------------------------------------------------
create or replace function public.place_order(
  p_items          jsonb,                       -- [{product_id, quantity, price, name, image, size}]
  p_total          numeric,
  p_payment_method text  default 'COD',
  p_payment_ref    text  default null,
  p_ship           jsonb default '{}'::jsonb    -- {name, phone, street, city, state, zip}
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid     uuid := auth.uid();
  v_order   public.orders;
  v_item    jsonb;
  v_pid     text;
  v_qty     int;
  v_is_uuid boolean;
begin
  if v_uid is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'EMPTY_CART';
  end if;

  -- Validate & decrement stock for real product rows.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_pid := v_item->>'product_id';
    v_qty := coalesce((v_item->>'quantity')::int, 1);

    begin
      perform 1 from public.products where id = v_pid::uuid;
      v_is_uuid := found;
    exception when invalid_text_representation then
      v_is_uuid := false;   -- mock/demo id, skip stock enforcement
    end;

    if v_is_uuid then
      update public.products
         set stock_count = stock_count - v_qty
       where id = v_pid::uuid
         and in_stock = true
         and stock_count >= v_qty;
      if not found then
        raise exception 'INSUFFICIENT_STOCK:%', v_pid;
      end if;
      update public.products
         set in_stock = false
       where id = v_pid::uuid and stock_count <= 0;
    end if;
  end loop;

  insert into public.orders (
    user_id, total_amount, payment_method, payment_status, payment_ref,
    ship_name, ship_phone, ship_street, ship_city, ship_state, ship_zip
  )
  values (
    v_uid, p_total, coalesce(p_payment_method, 'COD'),
    case when p_payment_method = 'COD' then 'PENDING' else 'PAID' end,
    p_payment_ref,
    p_ship->>'name', p_ship->>'phone', p_ship->>'street',
    p_ship->>'city', p_ship->>'state', p_ship->>'zip'
  )
  returning * into v_order;

  insert into public.order_items (order_id, product_id, name, image, price, quantity, size)
  select v_order.id, e->>'product_id', e->>'name', e->>'image',
         (e->>'price')::numeric, coalesce((e->>'quantity')::int, 1), e->>'size'
  from jsonb_array_elements(p_items) e;

  return v_order;
end;
$$;

grant execute on function public.place_order(jsonb, numeric, text, text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 3. ADMIN: update an order's status (PENDING|PAID|SHIPPED|DELIVERED|CANCELLED)
-- ---------------------------------------------------------------------------
create or replace function public.set_order_status(p_order_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'NOT_AUTHORIZED';
  end if;
  update public.orders
     set status = p_status, updated_at = now()
   where id = p_order_id;
end;
$$;

grant execute on function public.set_order_status(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. PRODUCT REVIEWS  (one review per user per product)
-- ---------------------------------------------------------------------------
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  product_id text not null,          -- storefront id (uuid or mock id)
  user_id    uuid not null references public.profiles (id) on delete cascade,
  author     text,                   -- snapshot of display name
  rating     int  not null check (rating between 1 and 5),
  title      text,
  body       text,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);
create index if not exists reviews_product_idx on public.reviews (product_id);

alter table public.reviews enable row level security;

drop policy if exists "reviews_select_all" on public.reviews;
create policy "reviews_select_all" on public.reviews
  for select using (true);

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own" on public.reviews
  for insert with check (auth.uid() = user_id);

drop policy if exists "reviews_update_own" on public.reviews;
create policy "reviews_update_own" on public.reviews
  for update using (auth.uid() = user_id);

drop policy if exists "reviews_delete_own" on public.reviews;
create policy "reviews_delete_own" on public.reviews
  for delete using (auth.uid() = user_id or public.is_admin());

-- ---------------------------------------------------------------------------
-- 5. ADDRESSES  (multiple per customer)
-- ---------------------------------------------------------------------------
create table if not exists public.addresses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  label      text,                   -- 'Home' | 'Work' | ...
  full_name  text,
  phone      text,
  street     text not null,
  city       text,
  state      text,
  zip        text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists addresses_user_idx on public.addresses (user_id);

alter table public.addresses enable row level security;

drop policy if exists "addresses_all_own" on public.addresses;
create policy "addresses_all_own" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 6. LOOKBOOKS / WISHLIST  (server-side so they follow the account)
-- ---------------------------------------------------------------------------
create table if not exists public.lookbooks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);
create index if not exists lookbooks_user_idx on public.lookbooks (user_id);

create table if not exists public.lookbook_items (
  id          uuid primary key default gen_random_uuid(),
  lookbook_id uuid not null references public.lookbooks (id) on delete cascade,
  product_id  text not null,
  product     jsonb not null,        -- snapshot for display
  created_at  timestamptz not null default now(),
  unique (lookbook_id, product_id)
);

alter table public.lookbooks      enable row level security;
alter table public.lookbook_items enable row level security;

drop policy if exists "lookbooks_all_own" on public.lookbooks;
create policy "lookbooks_all_own" on public.lookbooks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "lookbook_items_all_own" on public.lookbook_items;
create policy "lookbook_items_all_own" on public.lookbook_items
  for all using (
    exists (select 1 from public.lookbooks l where l.id = lookbook_id and l.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.lookbooks l where l.id = lookbook_id and l.user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- 7. SECURITY: only admins may write products (was: any authenticated user).
--    Reads stay public.
-- ---------------------------------------------------------------------------
drop policy if exists "products_write_auth" on public.products;
drop policy if exists "products_write_admin" on public.products;
create policy "products_write_admin" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- ORDERS: allow admins to update status (customers still can't).
drop policy if exists "orders_update_admin" on public.orders;
create policy "orders_update_admin" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- =============================================================================
-- Done.
-- =============================================================================
