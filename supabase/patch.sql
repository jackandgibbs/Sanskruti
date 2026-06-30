-- =============================================================================
-- Sanskruti — Missing Schema Patch
-- Run this in your Supabase SQL Editor to fix the missing tables and functions.
-- =============================================================================

-- 1. ADDRESSES TABLE
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text,
  full_name text,
  phone text,
  street text not null,
  city text,
  state text,
  zip text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.addresses enable row level security;

drop policy if exists "addresses_select_own" on public.addresses;
create policy "addresses_select_own" on public.addresses for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "addresses_insert_own" on public.addresses;
create policy "addresses_insert_own" on public.addresses for insert with check (auth.uid() = user_id);

drop policy if exists "addresses_update_own" on public.addresses;
create policy "addresses_update_own" on public.addresses for update using (auth.uid() = user_id);

drop policy if exists "addresses_delete_own" on public.addresses;
create policy "addresses_delete_own" on public.addresses for delete using (auth.uid() = user_id);

-- 2. UPDATES TO ORDERS & ORDER_ITEMS
alter table public.orders add column if not exists payment_method text;
alter table public.orders add column if not exists payment_status text default 'PENDING';
alter table public.orders add column if not exists ship_name text;
alter table public.orders add column if not exists ship_phone text;
alter table public.orders add column if not exists ship_street text;
alter table public.orders add column if not exists ship_city text;
alter table public.orders add column if not exists ship_state text;
alter table public.orders add column if not exists ship_zip text;

alter table public.order_items add column if not exists size text;

-- 3. PLACE ORDER RPC
create or replace function public.place_order(
  p_items jsonb,
  p_total numeric,
  p_payment_method text,
  p_payment_ref text,
  p_ship jsonb
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  new_order public.orders;
  item jsonb;
  prod_row record;
begin
  -- 1. Create the order
  insert into public.orders (
    user_id,
    total_amount,
    status,
    payment_method,
    payment_status,
    ship_name,
    ship_phone,
    ship_street,
    ship_city,
    ship_state,
    ship_zip
  ) values (
    auth.uid(),
    p_total,
    'PENDING',
    p_payment_method,
    case when p_payment_method = 'COD' then 'PENDING' else 'PAID' end,
    p_ship->>'name',
    p_ship->>'phone',
    p_ship->>'street',
    p_ship->>'city',
    p_ship->>'state',
    p_ship->>'zip'
  ) returning * into new_order;

  -- 2. Decrement stock & insert items
  for item in select * from jsonb_array_elements(p_items) loop
    -- Optional stock check if product exists in our DB
    begin
      select * into prod_row from public.products where id = (item->>'product_id')::uuid;
      if found and prod_row.in_stock then
         if prod_row.stock_count < (item->>'quantity')::int then
            raise exception 'INSUFFICIENT_STOCK';
         end if;
         
         update public.products 
         set stock_count = stock_count - (item->>'quantity')::int,
             in_stock = (stock_count - (item->>'quantity')::int) > 0
         where id = prod_row.id;
      end if;
    exception when invalid_text_representation then
      -- If product_id is not a valid UUID (e.g. mock products), ignore stock logic
    end;

    insert into public.order_items (
      order_id,
      product_id,
      name,
      image,
      price,
      quantity,
      size
    ) values (
      new_order.id,
      item->>'product_id',
      item->>'name',
      item->>'image',
      (item->>'price')::numeric,
      (item->>'quantity')::int,
      item->>'size'
    );
  end loop;

  return new_order;
end;
$$;

-- 4. SET ORDER STATUS RPC
create or replace function public.set_order_status(
  p_order_id uuid,
  p_status text
)
returns void
language sql
security definer
set search_path = public
as $$
  update public.orders set status = p_status, updated_at = now() where id = p_order_id;
$$;
