alter table public.collection_requests
  add column if not exists driver_reported_weight_kg numeric,
  add column if not exists driver_collection_photo_path text,
  add column if not exists driver_collected_at timestamptz;

alter table public.collection_requests
  drop constraint if exists collection_requests_driver_reported_weight_check;
alter table public.collection_requests
  add constraint collection_requests_driver_reported_weight_check
  check (driver_reported_weight_kg is null or driver_reported_weight_kg > 0);

do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Drivers can upload pickup evidence') then
    create policy "Drivers can upload pickup evidence" on storage.objects for insert to authenticated with check (
      bucket_id = 'pickup-photos' and exists (select 1 from public.profiles where id = auth.uid() and role = 'driver' and is_active = true)
    );
  end if;
end $$;
