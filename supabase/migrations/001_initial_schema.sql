-- ==========================================
-- TABBY EATS
-- Initial Database Schema
-- PostgreSQL / Supabase
-- ==========================================

create extension if not exists pgcrypto;

-- 1. CUSTOMER PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text unique,
  email text,
  role text not null default 'customer'
    check (role in ('customer', 'admin', 'chef')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Automatically create customer profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.phone
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();


-- 2. FOOD CATEGORIES
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);


-- 3. MEALS
create table public.meals (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id),
  name text not null,
  slug text unique not null,
  description text,
  ingredients text[],
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  preparation_time integer default 30,
  is_available boolean default true,
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


-- 4. READY-TO-COOK MEAL KITS
create table public.meal_kits (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  ingredients jsonb default '[]'::jsonb,
  recipe_steps jsonb default '[]'::jsonb,
  price numeric(10,2) not null check (price >= 0),
  servings integer default 2,
  preparation_time integer default 30,
  difficulty text default 'easy'
    check (difficulty in ('easy', 'medium', 'hard')),
  stock_quantity integer default 0 check (stock_quantity >= 0),
  image_url text,
  is_available boolean default true,
  created_at timestamptz default now()
);


-- 5. NAIROBI DELIVERY ZONES
create table public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  estate_name text unique not null,
  delivery_fee numeric(10,2) not null default 0,
  estimated_minutes integer,
  is_active boolean default true,
  created_at timestamptz default now()
);


-- 6. CUSTOMER ORDERS
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid not null references public.profiles(id),
  delivery_zone_id uuid references public.delivery_zones(id),
  delivery_address text not null,
  customer_phone text not null,
  subtotal numeric(10,2) not null check (subtotal >= 0),
  delivery_fee numeric(10,2) not null default 0,
  total_amount numeric(10,2) not null check (total_amount >= 0),
  payment_method text not null
    check (payment_method in ('mpesa', 'cash')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  order_status text not null default 'pending'
    check (order_status in (
      'pending', 'accepted', 'preparing',
      'on_the_way', 'delivered', 'cancelled'
    )),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


-- 7. ORDER ITEMS
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  meal_id uuid references public.meals(id),
  meal_kit_id uuid references public.meal_kits(id),
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  line_total numeric(10,2) not null check (line_total >= 0),
  check (
    (meal_id is not null and meal_kit_id is null)
    or
    (meal_id is null and meal_kit_id is not null)
  )
);


-- 8. PRIVATE CHEF BOOKINGS
create table public.chef_bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  booking_date date not null,
  booking_time time not null,
  guest_count integer not null check (guest_count > 0),
  occasion text not null,
  location text not null,
  budget numeric(10,2),
  special_requests text,
  booking_status text not null default 'pending'
    check (booking_status in (
      'pending', 'confirmed', 'rejected',
      'completed', 'cancelled'
    )),
  created_at timestamptz default now()
);


-- 9. PAYMENT TRANSACTIONS
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id),
  provider text not null check (provider in ('mpesa', 'cash')),
  amount numeric(10,2) not null check (amount >= 0),
  transaction_reference text unique,
  checkout_request_id text,
  merchant_request_id text,
  phone_number text,
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'successful', 'failed')),
  paid_at timestamptz,
  created_at timestamptz default now()
);


-- 10. INVENTORY
create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  item_name text not null unique,
  quantity numeric(10,2) not null default 0,
  unit text not null,
  reorder_level numeric(10,2) default 0,
  updated_at timestamptz default now()
);


-- INDEXES
create index idx_meals_category
on public.meals(category_id);

create index idx_meals_available
on public.meals(is_available);

create index idx_orders_customer
on public.orders(customer_id);

create index idx_orders_status
on public.orders(order_status);

create index idx_bookings_customer
on public.chef_bookings(customer_id);

create index idx_orders_created
on public.orders(created_at desc);


-- ENABLE ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.meals enable row level security;
alter table public.meal_kits enable row level security;
alter table public.delivery_zones enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.chef_bookings enable row level security;
alter table public.payments enable row level security;
alter table public.inventory enable row level security;


-- PUBLIC CATALOG ACCESS
create policy "Public can view active categories"
on public.categories for select
to anon, authenticated
using (is_active = true);

create policy "Public can view available meals"
on public.meals for select
to anon, authenticated
using (is_available = true);

create policy "Public can view available meal kits"
on public.meal_kits for select
to anon, authenticated
using (is_available = true);

create policy "Public can view active delivery zones"
on public.delivery_zones for select
to anon, authenticated
using (is_active = true);


-- CUSTOMER PROFILE ACCESS
create policy "Customers can view own profile"
on public.profiles for select
to authenticated
using (id = (select auth.uid()));


-- CUSTOMER ORDER ACCESS
create policy "Customers can view own orders"
on public.orders for select
to authenticated
using (customer_id = (select auth.uid()));

create policy "Customers can view own order items"
on public.order_items for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
    and orders.customer_id = (select auth.uid())
  )
);


-- CUSTOMER BOOKING ACCESS
create policy "Customers can create own bookings"
on public.chef_bookings for insert
to authenticated
with check (customer_id = (select auth.uid()));

create policy "Customers can view own bookings"
on public.chef_bookings for select
to authenticated
using (customer_id = (select auth.uid()));


-- CUSTOMER PAYMENT ACCESS
create policy "Customers can view own payments"
on public.payments for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = payments.order_id
    and orders.customer_id = (select auth.uid())
  )
);
