create extension if not exists pgcrypto;

create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists setup_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  business_name text not null,
  review_url text not null,
  notes text not null default '',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists change_link_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  taprater_id text not null,
  new_review_url text not null,
  notes text not null default '',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  sku text not null unique,
  category_slug text not null,
  base_price_cents integer not null check (base_price_cents >= 0),
  sale_price_cents integer check (sale_price_cents >= 0),
  stock_status text not null check (stock_status in ('instock', 'outofstock')),
  short_description text not null default '',
  description text not null default '',
  seo_title text,
  seo_description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  src text not null,
  alt text not null default '',
  sort_order integer not null default 0
);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  label text not null,
  sku text not null unique,
  stock_status text not null check (stock_status in ('instock', 'outofstock'))
);

create table if not exists site_content (
  key text primary key,
  type text not null check (type in ('homepage', 'page', 'section', 'redirect', 'seo')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_content_type_status_idx on site_content(type, status);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  src text not null,
  alt text not null default '',
  asset_type text not null default 'image',
  created_at timestamptz not null default now()
);
