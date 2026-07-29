alter table public.collection_requests
  add column if not exists preferred_pickup_start timestamptz,
  add column if not exists preferred_pickup_end timestamptz;

alter table public.collection_requests
  drop constraint if exists collection_requests_pickup_window_check;

alter table public.collection_requests
  add constraint collection_requests_pickup_window_check
  check (
    preferred_pickup_start is null
    or preferred_pickup_end is null
    or preferred_pickup_end > preferred_pickup_start
  );
