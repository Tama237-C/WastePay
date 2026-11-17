-- Allow authenticated application roles to use tables only through the RLS
-- scopes below. service_role remains the sole bypass for trusted server actions.
grant usage on schema public to authenticated;
grant select on public.profiles, public.depots, public.collection_requests, public.transactions, public.transaction_items, public.barcodes, public.pricing_rules to authenticated;
grant update on public.collection_requests to authenticated;
grant insert on public.collection_request_events to authenticated;

do $$ begin
  create policy "Drivers can read assigned collection requests" on public.collection_requests for select to authenticated using (
    assigned_driver_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'driver' and is_active)
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Drivers can update assigned collection requests" on public.collection_requests for update to authenticated using (
    assigned_driver_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'driver' and is_active)
  ) with check (assigned_driver_id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Depot agents can read depot collection requests" on public.collection_requests for select to authenticated using (
    assigned_depot_id = (select assigned_depot_id from public.profiles where id = auth.uid()) and exists (select 1 from public.profiles where id = auth.uid() and role = 'agent' and is_active)
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Depot agents can complete depot collection requests" on public.collection_requests for update to authenticated using (
    assigned_depot_id = (select assigned_depot_id from public.profiles where id = auth.uid()) and exists (select 1 from public.profiles where id = auth.uid() and role = 'agent' and is_active)
  ) with check (assigned_depot_id = (select assigned_depot_id from public.profiles where id = auth.uid()));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Managers can read depot operational records" on public.collection_requests for select to authenticated using (
    assigned_depot_id = (select assigned_depot_id from public.profiles where id = auth.uid()) and exists (select 1 from public.profiles where id = auth.uid() and role = 'manager' and is_active)
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Managers can read depot transactions" on public.transactions for select to authenticated using (
    depot_id = (select assigned_depot_id from public.profiles where id = auth.uid()) and exists (select 1 from public.profiles where id = auth.uid() and role = 'manager' and is_active)
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Agents can read their own transactions" on public.transactions for select to authenticated using (agent_profile_id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Staff can read their assigned depot" on public.depots for select to authenticated using (
    id = (select assigned_depot_id from public.profiles where id = auth.uid())
  );
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Authenticated staff can read barcode catalog" on public.barcodes for select to authenticated using (exists (select 1 from public.profiles where id = auth.uid() and is_active));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Authenticated staff can read active pricing" on public.pricing_rules for select to authenticated using (status = 'ACTIVE' and exists (select 1 from public.profiles where id = auth.uid() and is_active));
exception when duplicate_object then null; end $$;
