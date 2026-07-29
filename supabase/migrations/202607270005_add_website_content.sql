create table if not exists public.website_content (
  id boolean primary key default true check (id = true),
  homepage_hero_title text not null default 'Plastic waste becomes value.',
  homepage_hero_description text not null default 'WastePay connects communities, recovery depots, and transparent recycling value.',
  homepage_footer_title text not null default 'Build a cleaner circular economy.',
  homepage_footer_text text not null default 'Every verified collection helps turn discarded plastic into measurable economic value.',
  homepage_hero_image_path text,
  homepage_footer_image_path text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.website_content (id)
values (true)
on conflict (id) do nothing;

alter table public.website_content enable row level security;

grant select on public.website_content to anon, authenticated;
grant insert, update on public.website_content to service_role;

insert into storage.buckets (id, name, public)
values ('website-images', 'website-images', true)
on conflict (id) do nothing;
