alter table public.ecologix_scans
  add column if not exists quantity integer not null default 1
    check (quantity between 1 and 200),
  add column if not exists tags text[] not null default '{}',
  add column if not exists photo_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ecologix-scan-photos',
  'ecologix-scan-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Contributors and active staff can view scan photos"
  on storage.objects;
create policy "Contributors and active staff can view scan photos"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'ecologix-scan-photos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role in ('admin', 'manager', 'collector', 'driver', 'agent')
          and is_active
      )
    )
  );
