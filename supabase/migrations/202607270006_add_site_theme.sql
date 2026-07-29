create table if not exists public.site_theme (
  id boolean primary key default true check (id = true),
  primary_color text not null default '#00d6a3',
  secondary_color text not null default '#172554',
  accent_color text not null default '#facc15',
  background_color text not null default '#020617',
  surface_color text not null default '#0f172a',
  text_color text not null default '#f8fafc',
  muted_text_color text not null default '#94a3b8',
  font_family text not null default 'Inter',
  base_font_size_px integer not null default 16 check (base_font_size_px between 12 and 22),
  heading_scale numeric not null default 1 check (heading_scale between 0.8 and 1.4),
  border_radius_px integer not null default 24 check (border_radius_px between 0 and 48),
  logo_path text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.site_theme (id)
values (true)
on conflict (id) do nothing;

alter table public.site_theme enable row level security;

grant select on public.site_theme to anon, authenticated;
grant insert, update on public.site_theme to service_role;

insert into storage.buckets (id, name, public)
values ('website-branding', 'website-branding', true)
on conflict (id) do nothing;
