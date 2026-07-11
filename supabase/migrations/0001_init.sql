-- Viarnex Mall — initial schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.

-- ─────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────
create type user_role as enum ('customer', 'supplier', 'admin');
create type verification_status as enum ('pending', 'verified', 'rejected', 'suspended');
create type approval_status as enum ('pending', 'approved', 'rejected');
create type supplier_badge as enum ('verified', 'factory', 'top-seller', 'fast-dispatch', 'trusted-supplier');
create type order_status as enum (
  'pending_payment', 'payment_received', 'supplier_notified', 'preparing',
  'shipped_to_warehouse', 'warehouse_confirmed', 'supplier_paid',
  'international_shipment', 'arrived_nigeria', 'out_for_delivery',
  'delivered', 'completed'
);
create type quotation_status as enum ('open', 'responded', 'accepted', 'rejected');

-- ─────────────────────────────────────────────
-- Profiles — one row per auth.users, carries the role
-- ─────────────────────────────────────────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'customer',
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Suppliers
-- ─────────────────────────────────────────────
create table suppliers (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  company_name text not null,
  factory_name text,
  business_registration_url text,
  business_license_url text,
  identity_doc_url text,
  company_address text,
  business_phone text,
  business_email text,
  bank_details jsonb,
  alipay_details jsonb,
  verification_status verification_status not null default 'pending',
  performance_score integer not null default 100,
  badges supplier_badge[] not null default '{}',
  country text not null default 'China',
  created_at timestamptz not null default now()
);

create index idx_suppliers_owner on suppliers(owner_id);
create index idx_suppliers_status on suppliers(verification_status);

-- ─────────────────────────────────────────────
-- Products
-- ─────────────────────────────────────────────
create table products (
  id uuid primary key default uuid_generate_v4(),
  supplier_id uuid not null references suppliers(id) on delete cascade,
  name_en text not null,
  name_zh text,
  description_en text,
  description_zh text,
  category text not null,
  brand text,
  sku text not null,
  images text[] not null default '{}',
  moq integer not null default 1,
  base_price_yuan numeric(12,2) not null,
  -- shipping profile, kept as jsonb since it's a fixed sub-object
  shipping jsonb not null default '{
    "netWeightKg": 0, "grossWeightKg": 0,
    "lengthCm": 0, "widthCm": 0, "heightCm": 0,
    "countryOfOrigin": "China",
    "sensitiveGoods": {"battery": false, "liquid": false, "magnetic": false, "fragile": false}
  }'::jsonb,
  approval_status approval_status not null default 'pending',
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_products_supplier on products(supplier_id);
create index idx_products_approval on products(approval_status);
create index idx_products_category on products(category);

create table product_pricing_tiers (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  min_qty integer not null,
  unit_price_yuan numeric(12,2) not null
);

create table product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  attributes jsonb not null default '{}', -- e.g. {"color": "Black", "size": "XL"}
  stock integer not null default 0
);

-- ─────────────────────────────────────────────
-- Exchange rate / commission config (admin-editable, single row per active config)
-- ─────────────────────────────────────────────
create table platform_config (
  id uuid primary key default uuid_generate_v4(),
  official_rate_ngn_per_yuan numeric(10,4) not null,
  viarnex_rate_ngn_per_yuan numeric(10,4) not null,
  platform_fee_percent numeric(5,2) not null default 10,
  shipping_markup_percent numeric(5,2) not null default 0,
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Orders — one FulfillmentOrder per supplier per checkout
-- ─────────────────────────────────────────────
create table fulfillment_orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references profiles(id),
  supplier_id uuid not null references suppliers(id),
  status order_status not null default 'pending_payment',
  checkout_group_id uuid not null, -- ties multiple supplier orders to one payment
  created_at timestamptz not null default now()
);

create index idx_orders_customer on fulfillment_orders(customer_id);
create index idx_orders_supplier on fulfillment_orders(supplier_id);
create index idx_orders_checkout_group on fulfillment_orders(checkout_group_id);

create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references fulfillment_orders(id) on delete cascade,
  product_id uuid not null references products(id),
  variant_id uuid references product_variants(id),
  quantity integer not null,
  unit_price_naira numeric(12,2) not null
);

-- ─────────────────────────────────────────────
-- Wallets — one per supplier
-- ─────────────────────────────────────────────
create table wallets (
  id uuid primary key default uuid_generate_v4(),
  supplier_id uuid not null unique references suppliers(id) on delete cascade,
  available numeric(14,2) not null default 0,
  pending numeric(14,2) not null default 0,
  frozen numeric(14,2) not null default 0
  -- withdrawable is derived (available - frozen), computed in application/view, not stored
);

create table wallet_transactions (
  id uuid primary key default uuid_generate_v4(),
  wallet_id uuid not null references wallets(id) on delete cascade,
  order_id uuid references fulfillment_orders(id),
  amount numeric(14,2) not null,
  type text not null check (type in ('credit_pending', 'release_available', 'freeze', 'withdrawal', 'penalty')),
  note text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Quotations
-- ─────────────────────────────────────────────
create table quotation_requests (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id),
  customer_id uuid not null references profiles(id),
  requested_qty integer not null,
  status quotation_status not null default 'open',
  created_at timestamptz not null default now()
);

create table quotation_responses (
  id uuid primary key default uuid_generate_v4(),
  quotation_request_id uuid not null references quotation_requests(id) on delete cascade,
  discounted_price_yuan numeric(12,2) not null,
  custom_moq integer not null,
  shipping_estimate_naira numeric(12,2),
  lead_time_days integer,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Reviews — verified buyers only, enforced in RLS below
-- ─────────────────────────────────────────────
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  customer_id uuid not null references profiles(id),
  order_item_id uuid not null references order_items(id),
  rating smallint not null check (rating between 1 and 5),
  comment text,
  photos text[] default '{}',
  videos text[] default '{}',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
alter table profiles enable row level security;
alter table suppliers enable row level security;
alter table products enable row level security;
alter table product_pricing_tiers enable row level security;
alter table product_variants enable row level security;
alter table fulfillment_orders enable row level security;
alter table order_items enable row level security;
alter table wallets enable row level security;
alter table wallet_transactions enable row level security;
alter table quotation_requests enable row level security;
alter table quotation_responses enable row level security;
alter table reviews enable row level security;
alter table platform_config enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin() returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- Helper: does the current user own this supplier row?
create or replace function owns_supplier(sup_id uuid) returns boolean as $$
  select exists (
    select 1 from suppliers where id = sup_id and owner_id = auth.uid()
  );
$$ language sql security definer stable;

-- profiles: users read/update their own row; admins read all
create policy "profiles_self_select" on profiles for select using (id = auth.uid() or is_admin());
create policy "profiles_self_update" on profiles for update using (id = auth.uid());

-- suppliers: public can read verified suppliers; owner + admin get full access
create policy "suppliers_public_read_verified" on suppliers for select using (
  verification_status = 'verified' or owner_id = auth.uid() or is_admin()
);
create policy "suppliers_owner_write" on suppliers for insert with check (owner_id = auth.uid());
create policy "suppliers_owner_update" on suppliers for update using (owner_id = auth.uid() or is_admin());

-- products: public can read approved products; owning supplier + admin get full access
create policy "products_public_read_approved" on products for select using (
  approval_status = 'approved' or owns_supplier(supplier_id) or is_admin()
);
create policy "products_owner_write" on products for insert with check (owns_supplier(supplier_id));
create policy "products_owner_update" on products for update using (owns_supplier(supplier_id) or is_admin());

-- pricing tiers / variants follow the parent product's visibility
create policy "tiers_read" on product_pricing_tiers for select using (
  exists (select 1 from products p where p.id = product_id and (p.approval_status = 'approved' or owns_supplier(p.supplier_id) or is_admin()))
);
create policy "tiers_write" on product_pricing_tiers for all using (
  exists (select 1 from products p where p.id = product_id and owns_supplier(p.supplier_id))
);
create policy "variants_read" on product_variants for select using (
  exists (select 1 from products p where p.id = product_id and (p.approval_status = 'approved' or owns_supplier(p.supplier_id) or is_admin()))
);
create policy "variants_write" on product_variants for all using (
  exists (select 1 from products p where p.id = product_id and owns_supplier(p.supplier_id))
);

-- orders: visible to the customer who placed them, the fulfilling supplier, and admins
create policy "orders_read" on fulfillment_orders for select using (
  customer_id = auth.uid() or owns_supplier(supplier_id) or is_admin()
);
create policy "orders_customer_insert" on fulfillment_orders for insert with check (customer_id = auth.uid());
create policy "orders_supplier_update" on fulfillment_orders for update using (owns_supplier(supplier_id) or is_admin());

create policy "order_items_read" on order_items for select using (
  exists (select 1 from fulfillment_orders o where o.id = order_id and (o.customer_id = auth.uid() or owns_supplier(o.supplier_id) or is_admin()))
);

-- wallets: supplier owner + admin only — never public
create policy "wallets_owner_read" on wallets for select using (owns_supplier(supplier_id) or is_admin());
create policy "wallet_tx_owner_read" on wallet_transactions for select using (
  exists (select 1 from wallets w where w.id = wallet_id and (owns_supplier(w.supplier_id) or is_admin()))
);

-- quotations: visible to the requesting customer, the product's supplier, and admin
create policy "quotation_requests_read" on quotation_requests for select using (
  customer_id = auth.uid()
  or exists (select 1 from products p where p.id = product_id and owns_supplier(p.supplier_id))
  or is_admin()
);
create policy "quotation_requests_insert" on quotation_requests for insert with check (customer_id = auth.uid());
create policy "quotation_responses_read" on quotation_responses for select using (
  exists (
    select 1 from quotation_requests q join products p on p.id = q.product_id
    where q.id = quotation_request_id and (q.customer_id = auth.uid() or owns_supplier(p.supplier_id) or is_admin())
  )
);
create policy "quotation_responses_supplier_write" on quotation_responses for insert with check (
  exists (
    select 1 from quotation_requests q join products p on p.id = q.product_id
    where q.id = quotation_request_id and owns_supplier(p.supplier_id)
  )
);

-- reviews: public read; only the verified buyer (order_item owner) can insert
create policy "reviews_public_read" on reviews for select using (true);
create policy "reviews_verified_buyer_insert" on reviews for insert with check (
  customer_id = auth.uid()
  and exists (
    select 1 from order_items oi join fulfillment_orders o on o.id = oi.order_id
    where oi.id = order_item_id and o.customer_id = auth.uid() and o.status = 'completed'
  )
);

-- platform_config: readable by everyone (needed to price products client-side), writable by admin only
create policy "platform_config_read" on platform_config for select using (true);
create policy "platform_config_admin_write" on platform_config for all using (is_admin());
