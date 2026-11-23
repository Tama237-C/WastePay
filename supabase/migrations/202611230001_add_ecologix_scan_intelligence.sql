do $$ begin
  create type public.ecologix_scan_source as enum (
    'COMMUNITY',
    'AUDIT',
    'DEPOT'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.ecologix_audit_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area_type text not null check (area_type in ('MARKET', 'STREET', 'BEACH', 'NEIGHBOURHOOD', 'CUSTOM')),
  description text,
  center_location geography(Point, 4326),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.ecologix_scans (
  id uuid primary key default gen_random_uuid(),
  barcode_number text references public.barcodes(barcode_number) on delete set null,
  scanner_profile_id uuid references public.profiles(id) on delete set null,
  audit_area_id uuid references public.ecologix_audit_areas(id) on delete set null,
  audit_area_name text,
  product_name text not null,
  brand_name text not null,
  manufacturer_name text not null,
  product_volume text,
  material_type public.material_type not null,
  country_of_manufacture text,
  seller_name text,
  scanned_location geography(Point, 4326),
  scan_source public.ecologix_scan_source not null default 'COMMUNITY',
  latitude numeric,
  longitude numeric,
  scanned_at timestamptz not null default now()
);

create index if not exists ecologix_scans_barcode_idx
  on public.ecologix_scans(barcode_number, scanned_at desc);
create index if not exists ecologix_scans_brand_idx
  on public.ecologix_scans(brand_name, scanned_at desc);
create index if not exists ecologix_scans_location_idx
  on public.ecologix_scans using gist(scanned_location);
create index if not exists ecologix_scans_audit_idx
  on public.ecologix_scans(audit_area_id, scanned_at desc);

alter table public.ecologix_audit_areas enable row level security;
alter table public.ecologix_scans enable row level security;

grant select, insert, update on public.ecologix_audit_areas to authenticated;
grant select, insert on public.ecologix_scans to authenticated;

do $$ begin
  create policy "Active staff can manage ECOLOGIX audit areas"
    on public.ecologix_audit_areas
    for all
    to authenticated
    using (
      exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role in ('admin', 'manager')
          and is_active
      )
    )
    with check (
      exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role in ('admin', 'manager')
          and is_active
      )
    );
exception when duplicate_object then null;
end $$;
