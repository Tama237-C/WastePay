create table if not exists public.website_sections (
  id uuid primary key default gen_random_uuid(),
  page_key text not null
    check (page_key in ('home', 'impact', 'about', 'programs', 'contact')),
  section_key text not null,
  eyebrow text,
  title text not null,
  body text,
  image_path text,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (page_key, section_key)
);

alter table public.website_sections enable row level security;

grant select on public.website_sections to anon, authenticated;
grant insert, update, delete on public.website_sections to service_role;

insert into public.website_sections
  (page_key, section_key, eyebrow, title, body, sort_order)
values
  ('home', 'how-it-works', 'How WastePay works', 'From pickup to verified value', 'Explain the collection journey.', 10),
  ('home', 'recovery-network', 'Recovery network', 'Built for measurable recovery', 'Explain depots, drivers, and collectors.', 20),
  ('home', 'impact-preview', 'Environmental impact', 'Every kilogram tells a story', 'Preview impact reporting on the homepage.', 30),
  ('home', 'call-to-action', 'Join the network', 'Make plastic worth recovering', 'Invite visitors to request collection.', 40),
  ('impact', 'recovery', 'Verified recovery', 'Plastic recovery with evidence', 'Explain verified weights and photos.', 10),
  ('impact', 'communities', 'Community reach', 'Recovery that includes communities', 'Explain household and collector participation.', 20),
  ('impact', 'depots', 'Depot network', 'Accountable recovery depots', 'Explain depot operations.', 30),
  ('impact', 'future', 'Next milestone', 'Measure more, recover more', 'Explain the next impact goals.', 40),
  ('about', 'mission', 'Our mission', 'A circular economy built for Cameroon', 'Explain the WastePay mission.', 10),
  ('about', 'network', 'Our network', 'People and infrastructure working together', 'Explain the network.', 20),
  ('about', 'trust', 'Trust and accountability', 'Designed for transparent operations', 'Explain safeguards.', 30),
  ('about', 'future', 'Our future', 'Growing recovery responsibly', 'Explain future direction.', 40),
  ('programs', 'households', 'Households', 'Home collection made practical', 'Explain household programs.', 10),
  ('programs', 'businesses', 'Businesses', 'Recovery programs for organizations', 'Explain business programs.', 20),
  ('programs', 'brands', 'Brands', 'Campaigns with measurable recovery', 'Explain brand campaigns.', 30),
  ('programs', 'depots', 'Recovery depots', 'Infrastructure for circular value', 'Explain depot programs.', 40),
  ('contact', 'collection', 'Collection', 'Request a pickup', 'Explain how to request a pickup.', 10),
  ('contact', 'partnerships', 'Partnerships', 'Build a recovery partnership', 'Explain partnership opportunities.', 20),
  ('contact', 'support', 'Support', 'WastePay support', 'Explain how support works.', 30),
  ('contact', 'locations', 'Locations', 'Find the right recovery route', 'Explain service locations.', 40)
on conflict (page_key, section_key) do nothing;
