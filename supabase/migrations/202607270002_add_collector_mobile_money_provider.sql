alter table public.profiles
  add column if not exists mobile_money_provider public.mobile_money_provider;
