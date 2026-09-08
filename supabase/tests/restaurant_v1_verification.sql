-- Transaction-only verification for a disposable local database after applying
-- the migration and explicitly running supabase/seed.sql. It always rolls back.
--
-- Example:
--   psql "$LOCAL_DATABASE_URL" \
--     --set ON_ERROR_STOP=1 \
--     --command "set nexus.restaurant_seed_user_id = '<auth-user-uuid>'" \
--     --file supabase/tests/restaurant_v1_verification.sql

begin;

do $preflight$
declare
  v_user_id uuid;
begin
  begin
    v_user_id := current_setting('nexus.restaurant_seed_user_id', true)::uuid;
  exception when others then
    raise exception 'Set nexus.restaurant_seed_user_id to the user used by the explicit demo seed.';
  end;
  if v_user_id is null or not exists (
    select 1 from public.restaurant_members
    where organization_id = '10000000-0000-4000-8000-000000000001'
      and user_id = v_user_id
  ) then
    raise exception 'The configured verification user is not a member of the seeded restaurant.';
  end if;
  if (select count(*) from public.restaurant_members
      where organization_id = '10000000-0000-4000-8000-000000000001'
        and role = 'owner') <> 1 then
    raise exception 'Verification requires the freshly seeded single-owner fixture.';
  end if;

  -- The explicit seed must describe coherent pending and completed workflows.
  if not exists (
      select 1 from public.manager_approvals a
      join public.restaurant_events e on e.id = a.event_id
      join public.manager_attention_items i on i.event_id = e.id
      where a.id = '60000000-0000-4000-8000-000000000001'
        and a.status = 'pending' and e.status = 'waiting_approval'
        and i.status in ('open', 'assigned')
    ) or not exists (
      select 1 from public.manager_approvals a
      join public.restaurant_events e on e.id = a.event_id
      join public.manager_attention_items i on i.event_id = e.id
      where a.id = '60000000-0000-4000-8000-000000000002'
        and a.status = 'approved' and e.status = 'handled' and i.status = 'resolved'
    ) then
    raise exception 'Seeded pending/completed workflow state is inconsistent.';
  end if;
end;
$preflight$;

-- A second organization and branch exist only inside this rolled-back test.
insert into public.restaurant_organizations (id, name, slug, timezone, default_currency, default_locale)
values ('90000000-0000-4000-8000-000000000001', 'Isolation Fixture', 'isolation-fixture', 'UTC', 'USD', 'en');
insert into public.restaurant_branches (id, organization_id, name, timezone)
values (
  '90000000-0000-4000-8000-000000000002',
  '90000000-0000-4000-8000-000000000001',
  'Hidden Branch',
  'UTC'
);

select set_config('request.jwt.claim.sub', current_setting('nexus.restaurant_seed_user_id'), true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

do $authenticated_security$
declare
  v_failed_as_expected boolean;
begin
  if (select count(*) from public.restaurant_organizations) <> 1
    or exists (
      select 1 from public.restaurant_organizations
      where id = '90000000-0000-4000-8000-000000000001'
    )
    or (select count(*) from public.restaurant_branches) <> 2
  then
    raise exception 'RLS organization/branch isolation failed.';
  end if;

  if exists (
      select 1 from pg_proc where pronamespace = 'public'::regnamespace
        and proname in ('ingest_restaurant_event', 'write_restaurant_activity')
        and has_function_privilege('authenticated', oid, 'EXECUTE')
    ) or not exists (
      select 1 from pg_proc where pronamespace = 'public'::regnamespace
        and proname = 'manage_restaurant_member'
        and pronargs = 4
        and has_function_privilege('authenticated', oid, 'EXECUTE')
    )
  then
    raise exception 'RPC execution grants do not enforce the trusted-write boundary.';
  end if;
  if has_table_privilege('authenticated', 'public.restaurant_members', 'INSERT')
    or has_table_privilege('authenticated', 'public.restaurant_members', 'UPDATE')
    or has_table_privilege('authenticated', 'public.restaurant_members', 'DELETE')
  then
    raise exception 'Authenticated users have broad direct member DML privileges.';
  end if;

  v_failed_as_expected := false;
  begin
    perform public.manage_restaurant_member(
      '10000000-0000-4000-8000-000000000001', auth.uid(), 'upsert', 'staff'
    );
  exception when object_not_in_prerequisite_state then
    v_failed_as_expected := true;
  end;
  if not v_failed_as_expected then
    raise exception 'Last-owner demotion guard failed.';
  end if;

  v_failed_as_expected := false;
  begin
    perform public.manage_restaurant_member(
      '10000000-0000-4000-8000-000000000001', auth.uid(), 'remove', null
    );
  exception when object_not_in_prerequisite_state then
    v_failed_as_expected := true;
  end;
  if not v_failed_as_expected then
    raise exception 'Last-owner removal guard failed.';
  end if;
end;
$authenticated_security$;

reset role;
select set_config('request.jwt.claim.role', 'service_role', true);
set local role service_role;

do $trusted_ingestion$
declare
  v_actor_id uuid := current_setting('nexus.restaurant_seed_user_id')::uuid;
  v_result jsonb;
  v_retry jsonb;
  v_failed_as_expected boolean;
begin
  v_failed_as_expected := false;
  begin
    perform public.ingest_restaurant_event(
      v_actor_id, '90000000-0000-4000-8000-000000000001', null, now(), 'demo',
      'customer_question', 'customer', 'Forbidden event', 'Must not be persisted.',
      'info', 'auto', 'handled', null, null, null, '{"demo":true}'::jsonb, null,
      false, 'verify:forbidden', null, false, null, '{}'::jsonb
    );
  exception when insufficient_privilege then
    v_failed_as_expected := true;
  end;
  if not v_failed_as_expected then
    raise exception 'Trusted ingest accepted an actor outside the organization.';
  end if;

  v_result := public.ingest_restaurant_event(
    v_actor_id, '10000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001', now(), 'demo',
    'customer_question', 'customer', 'Verification auto event', 'Handled deterministically.',
    'info', 'auto', 'handled', 'verify-auto-source', null, null,
    '{"demo":true}'::jsonb, 1, false, 'verify:auto', null, false, null, '{}'::jsonb
  );
  v_retry := public.ingest_restaurant_event(
    v_actor_id, '10000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001', now(), 'demo',
    'customer_question', 'customer', 'Verification auto event', 'Handled deterministically.',
    'info', 'auto', 'handled', 'verify-auto-source', null, null,
    '{"demo":true}'::jsonb, 1, false, 'verify:auto', null, false, null, '{}'::jsonb
  );
  if not (v_result->>'created')::boolean
    or (v_retry->>'created')::boolean
    or v_result->>'event_id' <> v_retry->>'event_id'
  then
    raise exception 'Event idempotency verification failed.';
  end if;

  perform public.ingest_restaurant_event(
    v_actor_id, '10000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000002', now(), 'demo',
    'customer_handoff', 'customer', 'Verification handoff', 'Needs a manager.',
    'high', 'human', 'escalated', 'verify-human-source', null, null,
    '{"demo":true}'::jsonb, 1, true, 'verify:human', 'high', false, null, '{}'::jsonb
  );
  perform public.ingest_restaurant_event(
    v_actor_id, '10000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001', now(), 'demo',
    'complaint', 'reputation', 'Verification approval', 'Manager decision required.',
    'medium', 'approval', 'waiting_approval', 'verify-approval-source', null, null,
    '{"demo":true}'::jsonb, 0.9, true, 'verify:approval', 'medium', true,
    'customer_response', '{"channel":"email"}'::jsonb
  );
end;
$trusted_ingestion$;

reset role;
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

do $manager_workflows$
declare
  v_attention_id uuid;
  v_approval_id uuid;
  v_event_id uuid;
  v_failed_as_expected boolean;
begin
  select id into v_attention_id from public.manager_attention_items
  where event_id = (select id from public.restaurant_events where dedupe_key = 'verify:human');
  perform public.update_manager_attention_item(
    '10000000-0000-4000-8000-000000000001', v_attention_id, 'assigned', auth.uid(), true
  );
  perform public.update_manager_attention_item(
    '10000000-0000-4000-8000-000000000001', v_attention_id, 'resolved', null, false
  );
  if not exists (
    select 1 from public.manager_attention_items
    where id = v_attention_id and status = 'resolved' and resolved_at is not null
  ) then
    raise exception 'Attention workflow did not reach resolved.';
  end if;

  select e.id, i.id, a.id into v_event_id, v_attention_id, v_approval_id
  from public.restaurant_events e
  join public.manager_attention_items i on i.event_id = e.id
  join public.manager_approvals a on a.event_id = e.id
  where e.dedupe_key = 'verify:approval';

  v_failed_as_expected := false;
  begin
    perform public.update_manager_attention_item(
      '10000000-0000-4000-8000-000000000001', v_attention_id, 'resolved', null, false
    );
  exception when object_not_in_prerequisite_state then
    v_failed_as_expected := true;
  end;
  if not v_failed_as_expected then
    raise exception 'Pending-approval attention guard failed.';
  end if;

  v_failed_as_expected := false;
  begin
    perform public.process_manager_approval(
      '10000000-0000-4000-8000-000000000001', v_approval_id,
      'edited', 'Malformed edit.', '{"unexpected":"payload"}'::jsonb
    );
  exception when invalid_parameter_value then
    v_failed_as_expected := true;
  end;
  if not v_failed_as_expected then
    raise exception 'Edited-approval payload validation failed.';
  end if;

  perform public.process_manager_approval(
    '10000000-0000-4000-8000-000000000001', v_approval_id,
    'edited', 'Verification approval.', '{"channel":"email","tone":"warm"}'::jsonb
  );
  if not exists (select 1 from public.restaurant_events where id = v_event_id and status = 'handled')
    or not exists (select 1 from public.manager_approvals where id = v_approval_id and status = 'edited')
    or not exists (select 1 from public.manager_attention_items where id = v_attention_id and status = 'resolved')
    or not exists (
      select 1 from public.restaurant_activity_log
      where entity_id = v_approval_id and action = 'approval_edited'
    )
  then
    raise exception 'Approval workflow did not update all related state atomically.';
  end if;

  v_failed_as_expected := false;
  begin
    perform public.process_manager_approval(
      '10000000-0000-4000-8000-000000000001', v_approval_id,
      'rejected', 'Stale retry.', null
    );
  exception when object_not_in_prerequisite_state then
    v_failed_as_expected := true;
  end;
  if not v_failed_as_expected then
    raise exception 'Approval stale-decision guard failed.';
  end if;
end;
$manager_workflows$;

reset role;
select set_config('request.jwt.claim.role', 'service_role', true);
set local role service_role;

do $trusted_activity$
declare
  v_activity_id uuid;
  v_event_id uuid;
begin
  select id into v_event_id from public.restaurant_events where dedupe_key = 'verify:approval';
  v_activity_id := public.write_restaurant_activity(
    current_setting('nexus.restaurant_seed_user_id')::uuid,
    '10000000-0000-4000-8000-000000000001', null, 'manager_note_added',
    'restaurant_event', v_event_id, 'Verification activity.',
    '{"reason":"SQL rollback verification","source":"manager_command_center"}'::jsonb
  );
  if not exists (
    select 1 from public.restaurant_activity_log
    where id = v_activity_id and actor_type = 'user'
      and actor_id = current_setting('nexus.restaurant_seed_user_id')::uuid
  ) then
    raise exception 'Explicit activity attribution failed.';
  end if;
  raise notice 'Restaurant V1 database verification passed; transaction will roll back.';
end;
$trusted_activity$;

reset role;
rollback;
