-- WastePay baseline schema. This migration is intentionally self-contained so
-- clean Supabase projects do not depend on an untracked production schema.
create extension if not exists pgcrypto;
create extension if not exists postgis;

do $$ begin
  create type public.staff_role as enum ('admin', 'manager', 'agent', 'driver', 'collector', 'resident');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.collection_request_status as enum ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ASSIGNED', 'IN_TRANSIT', 'UNREACHABLE', 'COLLECTED_PENDING_DEPOT', 'COMPLETED', 'RESCHEDULED', 'CANCELLED');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.transaction_status as enum ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PAYOUT_PROCESSING', 'PAID', 'PAYOUT_FAILED', 'APPROVED_OFFLINE');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.material_type as enum ('PET_CLEAR', 'PET_COLORED', 'HDPE', 'PP');
exception when duplicate_object then null; end $$;

create table if not exists public.depots (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  depot_code text not null unique,
  region text not null,
  city text not null,
  address text not null,
  latitude numeric,
  longitude numeric,
  phone_number text,
  maximum_storage_capacity_kg numeric not null default 0 check (maximum_storage_capacity_kg >= 0),
  mtn_float_balance_cfa bigint not null default 0 check (mtn_float_balance_cfa >= 0),
  orange_float_balance_cfa bigint not null default 0 check (orange_float_balance_cfa >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone_number text unique,
  role public.staff_role not null default 'collector',
  is_active boolean not null default true,
  must_change_password boolean not null default false,
  assigned_depot_id uuid references public.depots(id) on delete set null,
  active_location_zone text,
  mobile_money_provider text check (mobile_money_provider in ('MTN_MOMO', 'ORANGE_MONEY') or mobile_money_provider is null),
  created_by_administrator_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collection_requests (
  id uuid primary key default gen_random_uuid(),
  requester_type text not null check (requester_type in ('RESIDENT', 'SCHOOL', 'OFFICE', 'HOTEL')),
  requester_name text not null,
  phone_number text not null,
  neighbourhood text not null,
  estimated_bag_count integer not null check (estimated_bag_count > 0),
  estimated_weight_kg numeric not null check (estimated_weight_kg > 0),
  pickup_location geography(Point, 4326) not null,
  status public.collection_request_status not null default 'PENDING_REVIEW',
  assigned_depot_id uuid references public.depots(id) on delete set null,
  assigned_driver_id uuid references public.profiles(id) on delete set null,
  rejection_reason text,
  actual_weight_kg numeric check (actual_weight_kg > 0),
  completion_photo_path text,
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists collection_requests_status_idx on public.collection_requests(status, requested_at desc);
create index if not exists collection_requests_location_idx on public.collection_requests using gist(pickup_location);

create table if not exists public.barcodes (
  barcode_number text primary key,
  product_name text not null,
  brand_name text not null,
  manufacturer_name text not null,
  product_volume text,
  material_type public.material_type not null,
  country_of_manufacture text,
  verification_status text not null default 'UNVERIFIED' check (verification_status in ('UNVERIFIED', 'VERIFIED', 'ARCHIVED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pricing_rules (
  id uuid primary key default gen_random_uuid(),
  material_type public.material_type not null,
  base_rate_cfa numeric not null check (base_rate_cfa >= 0),
  regional_multiplier numeric not null default 1 check (regional_multiplier >= 0),
  campaign_bonus_cfa numeric not null default 0 check (campaign_bonus_cfa >= 0),
  status text not null default 'DRAFT' check (status in ('DRAFT', 'ACTIVE', 'ARCHIVED')),
  start_date timestamptz not null default now(),
  end_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  receipt_code text not null unique,
  collector_profile_id uuid not null references public.profiles(id) on delete restrict,
  agent_profile_id uuid not null references public.profiles(id) on delete restrict,
  depot_id uuid not null references public.depots(id) on delete restrict,
  payout_provider text not null check (payout_provider in ('MTN_MOMO', 'ORANGE_MONEY')),
  payout_phone_number text not null,
  total_weight_kg numeric not null check (total_weight_kg > 0),
  total_payout_cfa bigint not null check (total_payout_cfa >= 0),
  status public.transaction_status not null default 'DRAFT',
  provider_reference text unique,
  rejection_reason text,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists transactions_collector_idx on public.transactions(collector_profile_id, created_at desc);
create index if not exists transactions_depot_idx on public.transactions(depot_id, status, created_at desc);

create table if not exists public.transaction_items (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions(id) on delete restrict,
  barcode_number text references public.barcodes(barcode_number) on delete set null,
  material_type public.material_type not null,
  weight_kg numeric not null check (weight_kg > 0),
  base_rate_cfa numeric not null check (base_rate_cfa >= 0),
  regional_multiplier numeric not null default 1 check (regional_multiplier >= 0),
  campaign_bonus_cfa numeric not null default 0 check (campaign_bonus_cfa >= 0),
  item_payout_cfa bigint not null check (item_payout_cfa >= 0),
  created_at timestamptz not null default now()
);

-- Service-role actions perform privileged writes. Authenticated users can only
-- read their own profile; operational access is mediated by server actions.
alter table public.profiles enable row level security;
alter table public.collection_requests enable row level security;
alter table public.transactions enable row level security;
alter table public.transaction_items enable row level security;
alter table public.barcodes enable row level security;
alter table public.pricing_rules enable row level security;
alter table public.depots enable row level security;

do $$ begin
  create policy "Users can read their own profile" on public.profiles for select to authenticated using (id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Collectors can read own transactions" on public.transactions for select to authenticated using (collector_profile_id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Collectors can read own transaction items" on public.transaction_items for select to authenticated using (exists (select 1 from public.transactions t where t.id = transaction_id and t.collector_profile_id = auth.uid()));
exception when duplicate_object then null; end $$;
