-- The server-side Supabase client uses service_role exclusively. Existing
-- pre-migration tables may have revoked table grants, which prevents trusted
-- server actions from reading site configuration even though RLS is bypassed.
grant usage on schema public to service_role;
grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
