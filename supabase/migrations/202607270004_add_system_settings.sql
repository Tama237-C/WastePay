create table if not exists public.system_settings (
  id boolean primary key default true check (id = true),
  minimum_pickup_weight_kg numeric not null default 15
    check (minimum_pickup_weight_kg > 0),
  maximum_schedule_days integer not null default 30
    check (maximum_schedule_days between 1 and 90),
  pickup_photo_max_mb integer not null default 5
    check (pickup_photo_max_mb between 1 and 20),
  default_currency text not null default 'XAF'
    check (default_currency = 'XAF'),
  require_manager_payout_approval boolean not null default true,
  public_collection_requests_enabled boolean not null default true,
  payout_queue_enabled boolean not null default true,
  maintenance_message text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.system_settings (id)
values (true)
on conflict (id) do nothing;

alter table public.system_settings enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'system_settings'
      and policyname = 'Administrators can read system settings'
  ) then
    create policy "Administrators can read system settings"
      on public.system_settings
      for select
      to authenticated
      using (
        exists (
          select 1
          from public.profiles
          where profiles.id = auth.uid()
            and profiles.role = 'admin'
            and profiles.is_active = true
        )
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'system_settings'
      and policyname = 'Administrators can update system settings'
  ) then
    create policy "Administrators can update system settings"
      on public.system_settings
      for update
      to authenticated
      using (
        exists (
          select 1
          from public.profiles
          where profiles.id = auth.uid()
            and profiles.role = 'admin'
            and profiles.is_active = true
        )
      )
      with check (
        exists (
          select 1
          from public.profiles
          where profiles.id = auth.uid()
            and profiles.role = 'admin'
            and profiles.is_active = true
        )
      );
  end if;
end
$$;
