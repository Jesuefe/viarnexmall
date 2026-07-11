-- Optional demo data — run this in the SQL Editor after 0001_init.sql
-- to see real products on the storefront instead of an empty grid.
-- Safe to skip in production; delete these rows before going live.

-- Exchange rate / commission config (required for any price to calculate)
insert into platform_config (official_rate_ngn_per_yuan, viarnex_rate_ngn_per_yuan, platform_fee_percent, shipping_markup_percent)
values (190, 210, 10, 8);

-- A demo supplier. In production this row is created when a real
-- supplier registers (owner_id must reference an actual auth.users row —
-- since there's no logged-in supplier yet, this uses a NULL-safe insert
-- by temporarily disabling the FK check is NOT done here; instead, sign
-- up one supplier account first via Supabase Auth, then replace
-- OWNER_ID_HERE below with that user's id from the auth.users table.

-- 1) Create a user: Authentication -> Add user -> note the UUID
-- 2) Replace 'OWNER_ID_HERE' below with that UUID, then run this block.

/*
insert into profiles (id, role, full_name)
values ('OWNER_ID_HERE', 'supplier', 'Demo Factory Ltd');

insert into suppliers (owner_id, company_name, factory_name, verification_status, country)
values ('OWNER_ID_HERE', 'Demo Factory Ltd', 'Guangzhou Precision Works', 'verified', 'China')
returning id; -- copy this id, use it as SUPPLIER_ID_HERE below

insert into products (
  supplier_id, name_en, name_zh, description_en, category, sku,
  images, moq, base_price_yuan, approval_status
) values (
  'SUPPLIER_ID_HERE',
  'Wireless Bluetooth Earbuds - Pro Series',
  '无线蓝牙耳机 - 专业系列',
  'Noise-cancelling wireless earbuds with 30-hour battery case, IPX5 water resistance, and touch controls.',
  'Electronics',
  'WBE-PRO-001',
  array['https://images.unsplash.com/photo-1590658268037-6bf12165a8df'],
  20,
  85.00,
  'approved'
) returning id; -- copy this id, use it as PRODUCT_ID_HERE below

insert into product_pricing_tiers (product_id, min_qty, unit_price_yuan) values
  ('PRODUCT_ID_HERE', 20, 85.00),
  ('PRODUCT_ID_HERE', 100, 78.00),
  ('PRODUCT_ID_HERE', 500, 70.00);

insert into product_variants (product_id, attributes, stock) values
  ('PRODUCT_ID_HERE', '{"color": "Black"}', 500),
  ('PRODUCT_ID_HERE', '{"color": "White"}', 300);
*/
