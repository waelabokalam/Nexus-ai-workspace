-- DEV-ONLY Restaurant V1 demo seed.
--
-- This file is inert unless the caller explicitly enables it and supplies an
-- existing Supabase Auth user. Example for a disposable local database only:
--
--   psql "$LOCAL_DATABASE_URL" \
--     --command "set nexus.allow_restaurant_demo_seed = 'on'" \
--     --command "set nexus.restaurant_seed_user_id = '<auth-user-uuid>'" \
--     --file supabase/seed.sql
--
-- Never enable this guard for a linked or production database.

do $restaurant_seed$
declare
  v_user_id uuid;
  v_org_id constant uuid := '10000000-0000-4000-8000-000000000001';
  v_branch_central constant uuid := '20000000-0000-4000-8000-000000000001';
  v_branch_marina constant uuid := '20000000-0000-4000-8000-000000000002';
begin
  if coalesce(current_setting('nexus.allow_restaurant_demo_seed', true), 'off') <> 'on' then
    raise notice 'Restaurant demo seed skipped. Set nexus.allow_restaurant_demo_seed=on explicitly to run it.';
    return;
  end if;

  begin
    v_user_id := current_setting('nexus.restaurant_seed_user_id', true)::uuid;
  exception when others then
    raise exception 'Set nexus.restaurant_seed_user_id to an existing local auth.users UUID.';
  end;

  if v_user_id is null or not exists (select 1 from auth.users where id = v_user_id) then
    raise exception 'Restaurant seed user % does not exist in auth.users.', v_user_id;
  end if;

  insert into public.restaurant_organizations (
    id, name, slug, timezone, default_currency, default_locale
  ) values (
    v_org_id, 'Juniper Table', 'juniper-table-demo', 'Europe/Istanbul', 'TRY', 'en-GB'
  )
  on conflict (id) do update set
    name = excluded.name,
    timezone = excluded.timezone,
    default_currency = excluded.default_currency,
    default_locale = excluded.default_locale;

  insert into public.restaurant_branches (
    id, organization_id, name, city, country, timezone, is_active
  ) values
    (v_branch_central, v_org_id, 'Karakoy', 'Istanbul', 'Türkiye', 'Europe/Istanbul', true),
    (v_branch_marina, v_org_id, 'Fenerbahce', 'Istanbul', 'Türkiye', 'Europe/Istanbul', true)
  on conflict (id) do update set
    name = excluded.name,
    city = excluded.city,
    country = excluded.country,
    timezone = excluded.timezone,
    is_active = excluded.is_active;

  insert into public.restaurant_members (organization_id, user_id, role)
  values (v_org_id, v_user_id, 'owner')
  on conflict (organization_id, user_id) do nothing;

  insert into public.restaurant_events (
    id, organization_id, branch_id, occurred_at, source, event_type, category,
    title, summary, severity, handling_mode, status, source_reference,
    structured_data, confidence, requires_attention, dedupe_key
  ) values
    (
      '40000000-0000-4000-8000-000000000001', v_org_id, v_branch_central,
      now() - interval '28 minutes', 'nexus_agent', 'customer_question', 'customer',
      'Opening-hours question answered',
      'Nexus answered a guest asking whether the kitchen is open late tonight.',
      'info', 'auto', 'handled', 'demo-chat-101',
      '{"channel":"web_chat","demo":true}'::jsonb, 0.98, false, 'demo:auto:101'
    ),
    (
      '40000000-0000-4000-8000-000000000002', v_org_id, v_branch_central,
      now() - interval '21 minutes', 'demo', 'complaint', 'reputation',
      'Guest reported a delayed main course',
      'A returning guest waited 42 minutes and asked the restaurant to follow up.',
      'medium', 'approval', 'waiting_approval', 'demo-review-202',
      '{"demo":true,"action_type":"customer_response","proposed_action":{"channel":"email","tone":"warm","offer":"dessert_on_next_visit"}}'::jsonb,
      0.91, true, 'demo:approval:202'
    ),
    (
      '40000000-0000-4000-8000-000000000003', v_org_id, v_branch_marina,
      now() - interval '14 minutes', 'nexus_agent', 'customer_handoff', 'customer',
      'Allergy question needs a manager',
      'A guest asked for confirmation about cross-contact that Nexus cannot safely provide.',
      'high', 'human', 'escalated', 'demo-chat-303',
      '{"channel":"web_chat","allergen":"sesame","demo":true}'::jsonb, 0.99, true, 'demo:human:303'
    ),
    (
      '40000000-0000-4000-8000-000000000004', v_org_id, v_branch_marina,
      now() - interval '9 minutes', 'reservation', 'reservation_confirmed', 'reservations',
      'Dinner reservation recorded',
      'A table for four was confirmed for this evening at the Fenerbahce branch.',
      'info', 'auto', 'handled', 'demo-reservation-404',
      '{"party_size":4,"demo":true}'::jsonb, 1, false, 'demo:reservation:404'
    ),
    (
      '40000000-0000-4000-8000-000000000005', v_org_id, null,
      now() - interval '2 hours', 'demo', 'approval_resolved', 'customer',
      'Earlier response draft approved',
      'The manager approved a concise response to a guest enquiry.',
      'low', 'approval', 'handled', 'demo-approval-history-505',
      '{"demo":true,"action_type":"customer_response","proposed_action":{"channel":"email"}}'::jsonb,
      0.95, true, 'demo:resolved:505'
    )
  on conflict (id) do nothing;

  insert into public.manager_attention_items (
    id, organization_id, branch_id, event_id, title, summary, priority,
    category, status, assigned_to, created_at, resolved_at
  ) values
    (
      '50000000-0000-4000-8000-000000000001', v_org_id, v_branch_central,
      '40000000-0000-4000-8000-000000000002', 'Guest reported a delayed main course',
      'Review the proposed recovery response before it is recorded as approved.',
      'medium', 'reputation', 'open', null, now() - interval '21 minutes', null
    ),
    (
      '50000000-0000-4000-8000-000000000002', v_org_id, v_branch_marina,
      '40000000-0000-4000-8000-000000000003', 'Allergy question needs a manager',
      'Confirm the kitchen cross-contact process directly with the guest.',
      'high', 'customer', 'assigned', v_user_id, now() - interval '14 minutes', null
    ),
    (
      '50000000-0000-4000-8000-000000000003', v_org_id, null,
      '40000000-0000-4000-8000-000000000005', 'Earlier response draft approved',
      'Historical resolved attention item for timeline and status demonstrations.',
      'low', 'customer', 'resolved', v_user_id, now() - interval '2 hours', now() - interval '110 minutes'
    )
  on conflict (id) do nothing;

  insert into public.manager_approvals (
    id, organization_id, branch_id, event_id, action_type, title, summary,
    proposed_action, status, requested_at, reviewed_at, reviewed_by, reviewer_note
  ) values
    (
      '60000000-0000-4000-8000-000000000001', v_org_id, v_branch_central,
      '40000000-0000-4000-8000-000000000002', 'customer_response',
      'Approve guest recovery response',
      'Nexus prepared a warm acknowledgement and a dessert offer for the next visit.',
      '{"channel":"email","tone":"warm","offer":"dessert_on_next_visit"}'::jsonb,
      'pending', now() - interval '20 minutes', null, null, null
    ),
    (
      '60000000-0000-4000-8000-000000000002', v_org_id, null,
      '40000000-0000-4000-8000-000000000005', 'customer_response',
      'Earlier response draft approved',
      'Historical approval demonstrates a completed manager decision.',
      '{"channel":"email","tone":"concise"}'::jsonb,
      'approved', now() - interval '2 hours', now() - interval '110 minutes', v_user_id,
      'Approved as drafted.'
    )
  on conflict (id) do nothing;

  insert into public.restaurant_activity_log (
    id, organization_id, branch_id, actor_type, actor_id, action, entity_type,
    entity_id, description, metadata, created_at
  ) values
    (
      '70000000-0000-4000-8000-000000000001', v_org_id, null, 'user', v_user_id,
      'approval_approved', 'manager_approval', '60000000-0000-4000-8000-000000000002',
      'Manager approved the earlier guest-response draft.', '{"demo":true}'::jsonb,
      now() - interval '110 minutes'
    ),
    (
      '70000000-0000-4000-8000-000000000002', v_org_id, v_branch_central, 'nexus', null,
      'event_handled', 'restaurant_event', '40000000-0000-4000-8000-000000000001',
      'Nexus answered the guest opening-hours question.', '{"demo":true}'::jsonb,
      now() - interval '28 minutes'
    ),
    (
      '70000000-0000-4000-8000-000000000003', v_org_id, v_branch_central, 'system', null,
      'approval_requested', 'restaurant_event', '40000000-0000-4000-8000-000000000002',
      'Guest recovery response is waiting for manager approval.', '{"demo":true}'::jsonb,
      now() - interval '21 minutes'
    ),
    (
      '70000000-0000-4000-8000-000000000004', v_org_id, v_branch_marina, 'nexus', null,
      'event_escalated', 'restaurant_event', '40000000-0000-4000-8000-000000000003',
      'Nexus escalated the allergy question for human attention.', '{"demo":true}'::jsonb,
      now() - interval '14 minutes'
    ),
    (
      '70000000-0000-4000-8000-000000000005', v_org_id, v_branch_marina, 'nexus', null,
      'event_handled', 'restaurant_event', '40000000-0000-4000-8000-000000000004',
      'Nexus recorded the confirmed dinner reservation.', '{"demo":true}'::jsonb,
      now() - interval '9 minutes'
    )
  on conflict (id) do nothing;

  raise notice 'Restaurant V1 demo seeded for auth user %.', v_user_id;
end;
$restaurant_seed$;
