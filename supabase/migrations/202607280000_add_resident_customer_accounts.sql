alter type public.staff_role add value if not exists 'resident';

alter table public.collection_requests
  add column if not exists resident_profile_id uuid references public.profiles(id) on delete set null;

create index if not exists collection_requests_resident_profile_idx
  on public.collection_requests(resident_profile_id, requested_at desc);

alter table public.collection_requests enable row level security;

grant select on public.collection_requests to authenticated;

drop policy if exists "Residents can read own collection requests" on public.collection_requests;
create policy "Residents can read own collection requests"
  on public.collection_requests
  for select
  to authenticated
  using (resident_profile_id = auth.uid());
