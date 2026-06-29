-- =============================================================================
-- Sanskruti — Supabase schema
-- Paste this whole file into the Supabase Dashboard → SQL Editor → Run.
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE / DROP ... IF EXISTS).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. PROFILES  (extends Supabase's built-in auth.users)
--    auth.users stores email + the bcrypt-hashed password (encrypted_password).
--    Everything else about a customer lives here.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  customer_id     text unique,
  first_name      text,
  last_name       text,
  username        text unique,
  dob             date,
  gender          text,            -- 'Male' | 'Female' | 'Other'
  phone           text,
  email           text,
  avatar_url      text,
  address_street  text,
  address_city    text,
  address_state   text,
  address_zip     text,
  is_admin        boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Sequence powering the human-friendly customer id (SK-10001, SK-10002, ...)
create sequence if not exists public.customer_id_seq start 10001;

-- ---------------------------------------------------------------------------
-- 2. PRODUCTS  (mirror of the old Prisma Product model)
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  description    text,
  category       text not null,
  sku            text unique,
  barcode        text,
  price          numeric not null,
  mrp            numeric,
  cost_price     numeric,
  tax_rate       numeric not null default 0,
  sizes          text,            -- "XS,S,M,L" or JSON string
  color          text,
  in_stock       boolean not null default true,
  stock_count    integer not null default 0,
  fabric         text,
  craft_type     text,
  wash_care      text,
  weight_grams   integer,
  dispatch_days  text,
  best_seller    boolean not null default false,
  new_arrival    boolean not null default false,
  tags           text,
  meta_title     text,
  meta_desc      text,
  image          text not null,
  hover_image    text,
  gallery_images text,            -- JSON array string
  rating         numeric not null default 0,
  reviews        integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. ORDERS + ORDER ITEMS
--    order_items keep a *snapshot* of the product (name/image/price) and a
--    plain-text product_id, so orders still work while the public storefront
--    serves hard-coded mock products (no foreign key to products needed).
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles (id) on delete cascade,
  status       text not null default 'PENDING',  -- PENDING|PAID|SHIPPED|DELIVERED
  total_amount numeric not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders (id) on delete cascade,
  product_id text,                -- storefront id (may be a mock id); not an FK
  name       text,                -- snapshot
  image      text,                -- snapshot
  price      numeric not null,    -- snapshot at purchase time
  quantity   integer not null
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists orders_user_id_idx on public.orders (user_id);

-- ---------------------------------------------------------------------------
-- 4. SITE SETTINGS  (key/value: hero video url, heritage image, festive banner)
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 5. NEW-USER TRIGGER
--    Runs whenever Supabase Auth creates a user (email signup OR Google).
--    Copies the metadata we passed at signUp() into a profiles row and mints
--    a customer id. Google users arrive with name metadata but no username/dob;
--    they fill those in later from the profile page.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (
    id, customer_id, first_name, last_name, username, dob, gender, phone, email, avatar_url
  )
  values (
    new.id,
    'SK-' || nextval('public.customer_id_seq'),
    coalesce(meta->>'first_name', split_part(coalesce(meta->>'full_name', meta->>'name', ''), ' ', 1)),
    coalesce(meta->>'last_name',  nullif(split_part(coalesce(meta->>'full_name', meta->>'name', ''), ' ', 2), '')),
    nullif(meta->>'username', ''),
    (nullif(meta->>'dob', ''))::date,
    nullif(meta->>'gender', ''),
    nullif(meta->>'phone', ''),
    new.email,
    coalesce(meta->>'avatar_url', meta->>'picture')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 6. USERNAME -> EMAIL LOOKUP
--    Supabase signs in with email+password. To support "username + password"
--    login, the client first resolves the username to an email via this RPC.
--    SECURITY DEFINER so the anon role can call it without read access to the
--    profiles table itself.
-- ---------------------------------------------------------------------------
create or replace function public.email_for_username(uname text)
returns text
language sql
security definer
set search_path = public
as $$
  select email from public.profiles where lower(username) = lower(uname) limit 1;
$$;

grant execute on function public.email_for_username(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 6b. IS-ADMIN HELPER
--    SECURITY DEFINER so it can read profiles.is_admin without tripping RLS
--    (a plain subquery inside a profiles policy would recurse infinitely).
--    Flag yourself admin once:  update public.profiles set is_admin = true
--                               where username = 'your_username';
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.profiles      enable row level security;
alter table public.products      enable row level security;
alter table public.orders        enable row level security;
alter table public.order_items   enable row level security;
alter table public.site_settings enable row level security;

-- PROFILES: a user sees and edits only their own row; admins can read all.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- (Insert is handled by the SECURITY DEFINER trigger, so no insert policy needed.)

-- PRODUCTS: readable by everyone; writable by authenticated users (admin panel).
drop policy if exists "products_select_all" on public.products;
create policy "products_select_all" on public.products
  for select using (true);

drop policy if exists "products_write_auth" on public.products;
create policy "products_write_auth" on public.products
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ORDERS: a user reads/creates only their own orders; admins can read all.
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id);

-- ORDER ITEMS: scoped through the parent order's owner.
drop policy if exists "order_items_select_own" on public.order_items;
create policy "order_items_select_own" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

drop policy if exists "order_items_insert_own" on public.order_items;
create policy "order_items_insert_own" on public.order_items
  for insert with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- SITE SETTINGS: readable by everyone; writable by authenticated users (admin).
drop policy if exists "site_settings_select_all" on public.site_settings;
create policy "site_settings_select_all" on public.site_settings
  for select using (true);

drop policy if exists "site_settings_write_auth" on public.site_settings;
create policy "site_settings_write_auth" on public.site_settings
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =============================================================================
-- Done. Next: enable the Google provider in Authentication → Providers,
-- then add your Supabase URL + anon key (and Cloudinary vars) to .env.
-- See SETUP.md for the full walkthrough.
-- =============================================================================
