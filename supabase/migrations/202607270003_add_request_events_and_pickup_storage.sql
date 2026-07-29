create table if not exists public.collection_request_events (
  id uuid primary key default gen_random_uuid(),
  collection_request_id uuid not null
    references public.collection_requests(id)
    on delete restrict,
  previous_status public.collection_request_status,
  new_status public.collection_request_status not null,
  reason text,
  actor_id uuid references public.profiles(id)
    on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists collection_request_events_request_idx
  on public.collection_request_events(collection_request_id, created_at);

alter table public.collection_request_events enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'collection_request_events'
      and policyname = 'Staff can record collection request events'
  ) then
    create policy "Staff can record collection request events"
      on public.collection_request_events
      for insert
      to authenticated
      with check (
        actor_id = auth.uid()
        and exists (
          select 1
          from public.profiles
          where profiles.id = auth.uid()
            and profiles.is_active = true
            and profiles.role in ('agent', 'driver', 'manager', 'admin')
        )
      );
  end if;
end
$$;

insert into storage.buckets (id, name, public, file_size_limit)
values ('pickup-photos', 'pickup-photos', false, 52428800)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Depot agents can upload pickup photos'
  ) then
    create policy "Depot agents can upload pickup photos"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'pickup-photos'
        and exists (
          select 1
          from public.profiles
          where profiles.id = auth.uid()
            and profiles.role = 'agent'
            and profiles.is_active = true
        )
      );
  end if;
end
$$;
