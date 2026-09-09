-- DEV-ONLY Restaurant V1 demo seed.
--
-- This file is inert unless the caller explicitly enables it, identifies the
-- allowed seed target, and supplies an existing Supabase Auth user.
-- Example for a disposable local database:
--
--   psql "$LOCAL_DATABASE_URL" \
--     --command "set nexus.allow_restaurant_demo_seed = 'on'" \
--     --command "set nexus.restaurant_seed_target = 'local'" \
--     --command "set nexus.restaurant_seed_user_id = '<auth-user-uuid>'" \
--     --file supabase/seed.sql
--
-- The only hosted target accepted by this V1 seed is the dedicated Nexus
-- Restaurant development project. Never add a production project ref here.

do $restaurant_seed$
declare
  v_user_id uuid;
  v_seed_target text;
  v_hosted_development_project_ref constant text := 'ovloyniqxpuqkwrpoafp';
  v_org_id constant uuid := '10000000-0000-4000-8000-000000000001';
  v_branch_central constant uuid := '20000000-0000-4000-8000-000000000001';
  v_branch_marina constant uuid := '20000000-0000-4000-8000-000000000002';
  v_review record;
  v_invoice_result jsonb;
  v_supplier_id uuid;
  v_supplier_item_id uuid;
begin
  if coalesce(current_setting('nexus.allow_restaurant_demo_seed', true), 'off') <> 'on' then
    raise notice 'Restaurant demo seed skipped. Set nexus.allow_restaurant_demo_seed=on explicitly to run it.';
    return;
  end if;

  v_seed_target := current_setting('nexus.restaurant_seed_target', true);
  if v_seed_target is null
    or v_seed_target not in ('local', v_hosted_development_project_ref)
  then
    raise exception 'Restaurant seed target is not an approved development environment.';
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

  -- Phase 2.2 reputation fixtures use the same trusted ingestion boundary that
  -- future provider adapters will call. Existing dedupe keys keep seed reruns inert.
  perform set_config('request.jwt.claim.role', 'service_role', true);
  for v_review in
    select * from (values
      ('positive-food', v_branch_central, 5::smallint,
        'The food was delicious and beautifully presented.',
        'positive'::public.restaurant_review_sentiment,
        array['food_quality']::public.restaurant_review_topic[],
        'low'::public.restaurant_severity, null::text, interval '5 hours'),
      ('positive-service', v_branch_marina, 4::smallint,
        'Friendly staff and thoughtful service throughout dinner.',
        'positive'::public.restaurant_review_sentiment,
        array['service','staff']::public.restaurant_review_topic[],
        'low'::public.restaurant_severity, null::text, interval '8 hours'),
      ('slow-1', v_branch_central, 3::smallint,
        'The service was slow and we waited too long for our mains.',
        'negative'::public.restaurant_review_sentiment,
        array['service','speed']::public.restaurant_review_topic[],
        'medium'::public.restaurant_severity,
        'Thank you for the feedback. We are sorry about the slow service and are reviewing the delay with our team.',
        interval '6 days'),
      ('slow-2', v_branch_central, 3::smallint,
        'Good flavours, but service was delayed and the wait was disappointing.',
        'negative'::public.restaurant_review_sentiment,
        array['food_quality','service','speed']::public.restaurant_review_topic[],
        'medium'::public.restaurant_severity,
        'Thank you for telling us. We are sorry about the delay and are working with the team to improve service speed.',
        interval '4 days'),
      ('slow-3', v_branch_central, 2::smallint,
        'Very slow service. We waited nearly an hour.',
        'negative'::public.restaurant_review_sentiment,
        array['service','speed']::public.restaurant_review_topic[],
        'medium'::public.restaurant_severity,
        'We are sorry you experienced such a long wait. The team is reviewing what caused the service delay.',
        interval '2 days'),
      ('slow-4', v_branch_central, 3::smallint,
        'The staff were polite but service was slow again tonight.',
        'negative'::public.restaurant_review_sentiment,
        array['service','speed','staff']::public.restaurant_review_topic[],
        'medium'::public.restaurant_severity,
        'Thank you for your feedback. We are sorry the service was slow and are following up with the team.',
        interval '1 day'),
      ('cold-food', v_branch_marina, 2::smallint,
        'Our food arrived cold and the meal was disappointing.',
        'negative'::public.restaurant_review_sentiment,
        array['food_quality']::public.restaurant_review_topic[],
        'medium'::public.restaurant_severity,
        'We are sorry your meal arrived cold. We are reviewing the food-temperature issue with the kitchen team.',
        interval '3 hours'),
      ('serious-safety', v_branch_marina, 1::smallint,
        'I had an allergic reaction and was hospitalized after the meal.',
        'negative'::public.restaurant_review_sentiment,
        array['food_quality']::public.restaurant_review_topic[],
        'critical'::public.restaurant_severity, null::text, interval '90 minutes')
    ) as fixture(
      suffix, branch_id, rating, review_text, sentiment, topics,
      severity, proposed_response, age
    )
  loop
    if not exists (
      select 1 from public.restaurant_reviews
      where organization_id = v_org_id and dedupe_key = 'demo:review:' || v_review.suffix
    ) then
      perform public.ingest_restaurant_review(
        v_user_id, v_org_id, v_review.branch_id, now() - v_review.age,
        'direct_feedback', 'demo-' || v_review.suffix,
        'Demo guest', v_review.rating, v_review.review_text, 'en',
        v_review.sentiment, v_review.topics, v_review.severity,
        'demo:review:' || v_review.suffix, v_review.proposed_response
      );
    end if;
  end loop;

  -- Phase 2.3 supplier-cost fixtures use placeholder private storage paths.
  -- The live verifier exercises actual private-object upload and signed access.
  v_invoice_result := public.ingest_supplier_invoice(
    v_user_id, v_org_id, v_branch_central,
    jsonb_build_object(
      'supplier_name', 'Bosporus Foods LLC', 'supplier_normalized_name', 'bosporus foods',
      'tax_identifier', 'TR-DEMO-1001', 'supplier_id', null,
      'supplier_match_confidence', 1, 'supplier_requires_review', false,
      'invoice_number', 'DEV-SUP-1001', 'invoice_date', (current_date - 21)::text,
      'currency', 'AED', 'subtotal', 180, 'tax_total', 9, 'total', 189,
      'source_type', 'manual_upload', 'extractor', 'manual_structured_v1',
      'original_filename', 'dev-first-invoice.pdf',
      'storage_path', v_org_id::text || '/dev-seed/dev-first-invoice.pdf',
      'file_hash', repeat('1', 64), 'raw_extraction', jsonb_build_object('demo', true),
      'confidence', 1, 'anomalies', '[]'::jsonb
    ),
    jsonb_build_array(jsonb_build_object(
      'raw_description', 'Chicken Breast 5KG', 'normalized_name', 'chicken breast 5 kg',
      'quantity', 10, 'unit', 'kg', 'unit_price', 18, 'line_total', 180,
      'extraction_confidence', 1, 'matched_supplier_item_id', null,
      'match_confidence', 1, 'requires_review', false,
      'previous_unit_price', null, 'absolute_change', null, 'percentage_change', null,
      'severity', 'none', 'anomaly', null, 'anomalies', '[]'::jsonb
    ))
  );
  v_supplier_id := (v_invoice_result->>'supplier_id')::uuid;
  select id into v_supplier_item_id from public.restaurant_supplier_items
  where organization_id = v_org_id and supplier_id = v_supplier_id
    and normalized_name = 'chicken breast 5 kg' and unit = 'kg';

  perform public.ingest_supplier_invoice(
    v_user_id, v_org_id, v_branch_central,
    jsonb_build_object(
      'supplier_name', 'Bosporus Foods L.L.C.', 'supplier_normalized_name', 'bosporus foods',
      'tax_identifier', 'TR-DEMO-1001', 'supplier_id', v_supplier_id,
      'supplier_match_confidence', 1, 'supplier_requires_review', false,
      'invoice_number', 'DEV-SUP-1002', 'invoice_date', (current_date - 14)::text,
      'currency', 'AED', 'subtotal', 181, 'tax_total', 9.05, 'total', 190.05,
      'source_type', 'manual_upload', 'extractor', 'manual_structured_v1',
      'original_filename', 'dev-stable-invoice.pdf',
      'storage_path', v_org_id::text || '/dev-seed/dev-stable-invoice.pdf',
      'file_hash', repeat('2', 64), 'raw_extraction', jsonb_build_object('demo', true),
      'confidence', 1, 'anomalies', '[]'::jsonb
    ),
    jsonb_build_array(jsonb_build_object(
      'raw_description', 'Chicken Breast - 5 kg', 'normalized_name', 'chicken breast 5 kg',
      'quantity', 10, 'unit', 'kg', 'unit_price', 18.1, 'line_total', 181,
      'extraction_confidence', 1, 'matched_supplier_item_id', v_supplier_item_id,
      'match_confidence', 1, 'requires_review', false,
      'previous_unit_price', 18, 'absolute_change', 0.1, 'percentage_change', 0.56,
      'severity', 'none', 'anomaly', null, 'anomalies', '[]'::jsonb
    ))
  );

  perform public.ingest_supplier_invoice(
    v_user_id, v_org_id, v_branch_central,
    jsonb_build_object(
      'supplier_name', 'Bosporus Foods LLC', 'supplier_normalized_name', 'bosporus foods',
      'tax_identifier', 'TR-DEMO-1001', 'supplier_id', v_supplier_id,
      'supplier_match_confidence', 1, 'supplier_requires_review', false,
      'invoice_number', 'DEV-SUP-1003', 'invoice_date', (current_date - 7)::text,
      'currency', 'AED', 'subtotal', 216, 'tax_total', 10.8, 'total', 226.8,
      'source_type', 'manual_upload', 'extractor', 'manual_structured_v1',
      'original_filename', 'dev-price-increase.pdf',
      'storage_path', v_org_id::text || '/dev-seed/dev-price-increase.pdf',
      'file_hash', repeat('3', 64), 'raw_extraction', jsonb_build_object('demo', true),
      'confidence', 1, 'anomalies', '[]'::jsonb
    ),
    jsonb_build_array(jsonb_build_object(
      'raw_description', 'Chicken Breast 5KG', 'normalized_name', 'chicken breast 5 kg',
      'quantity', 10, 'unit', 'kg', 'unit_price', 21.6, 'line_total', 216,
      'extraction_confidence', 1, 'matched_supplier_item_id', v_supplier_item_id,
      'match_confidence', 1, 'requires_review', true,
      'previous_unit_price', 18.1, 'absolute_change', 3.5, 'percentage_change', 19.34,
      'severity', 'medium', 'anomaly', 'price_increase',
      'anomalies', jsonb_build_array('price_increase')
    ))
  );

  perform public.ingest_supplier_invoice(
    v_user_id, v_org_id, v_branch_central,
    jsonb_build_object(
      'supplier_name', 'Bosporus Foods LLC', 'supplier_normalized_name', 'bosporus foods',
      'supplier_id', v_supplier_id, 'supplier_match_confidence', 1,
      'supplier_requires_review', false, 'invoice_number', 'DEV-SUP-1004',
      'invoice_date', (current_date - 5)::text, 'currency', 'AED',
      'subtotal', 90, 'tax_total', 4.5, 'total', 94.5,
      'source_type', 'manual_upload', 'extractor', 'manual_structured_v1',
      'original_filename', 'dev-unit-mismatch.pdf',
      'storage_path', v_org_id::text || '/dev-seed/dev-unit-mismatch.pdf',
      'file_hash', repeat('4', 64), 'raw_extraction', jsonb_build_object('demo', true),
      'confidence', 1, 'anomalies', '[]'::jsonb
    ),
    jsonb_build_array(jsonb_build_object(
      'raw_description', 'Chicken Breast 5KG', 'normalized_name', 'chicken breast 5 kg',
      'quantity', 1, 'unit', 'box', 'unit_price', 90, 'line_total', 90,
      'extraction_confidence', 1, 'matched_supplier_item_id', null,
      'match_confidence', 0, 'requires_review', true,
      'previous_unit_price', 21.6, 'absolute_change', null, 'percentage_change', null,
      'severity', 'medium', 'anomaly', 'unit_mismatch',
      'anomalies', jsonb_build_array('unit_mismatch')
    ))
  );

  perform public.ingest_supplier_invoice(
    v_user_id, v_org_id, v_branch_marina,
    jsonb_build_object(
      'supplier_name', 'Bosporus Foods LLC', 'supplier_normalized_name', 'bosporus foods',
      'supplier_id', v_supplier_id, 'supplier_match_confidence', 1,
      'supplier_requires_review', false, 'invoice_number', 'DEV-SUP-1005',
      'invoice_date', (current_date - 3)::text, 'currency', 'AED',
      'subtotal', 100, 'tax_total', 5, 'total', 130,
      'source_type', 'manual_upload', 'extractor', 'manual_structured_v1',
      'original_filename', 'dev-total-mismatch.pdf',
      'storage_path', v_org_id::text || '/dev-seed/dev-total-mismatch.pdf',
      'file_hash', repeat('5', 64), 'raw_extraction', jsonb_build_object('demo', true),
      'confidence', 1, 'anomalies', jsonb_build_array('invoice_total_mismatch')
    ),
    jsonb_build_array(jsonb_build_object(
      'raw_description', 'Mozzarella 2KG', 'normalized_name', 'mozzarella 2 kg',
      'quantity', 5, 'unit', 'kg', 'unit_price', 20, 'line_total', 100,
      'extraction_confidence', 1, 'matched_supplier_item_id', null,
      'match_confidence', 1, 'requires_review', false,
      'previous_unit_price', null, 'absolute_change', null, 'percentage_change', null,
      'severity', 'none', 'anomaly', null, 'anomalies', '[]'::jsonb
    ))
  );

  perform public.ingest_supplier_invoice(
    v_user_id, v_org_id, v_branch_central,
    jsonb_build_object(
      'supplier_name', 'Bosporus Fresh Foods', 'supplier_normalized_name', 'bosporus fresh foods',
      'supplier_id', null, 'supplier_match_confidence', 0.67,
      'supplier_requires_review', true, 'invoice_number', 'DEV-SUP-1006',
      'invoice_date', (current_date - 2)::text, 'currency', 'AED',
      'subtotal', 100, 'tax_total', 5, 'total', 105,
      'source_type', 'manual_upload', 'extractor', 'manual_structured_v1',
      'original_filename', 'dev-uncertain-supplier.pdf',
      'storage_path', v_org_id::text || '/dev-seed/dev-uncertain-supplier.pdf',
      'file_hash', repeat('6', 64), 'raw_extraction', jsonb_build_object('demo', true),
      'confidence', 0.72, 'anomalies', jsonb_build_array('uncertain_supplier_match')
    ),
    jsonb_build_array(jsonb_build_object(
      'raw_description', 'Premium Chicken Breast 5KG',
      'normalized_name', 'premium chicken breast 5 kg', 'quantity', 5, 'unit', 'kg',
      'unit_price', 20, 'line_total', 100, 'extraction_confidence', 0.72,
      'matched_supplier_item_id', null, 'match_confidence', 0.8,
      'requires_review', true, 'previous_unit_price', null,
      'absolute_change', null, 'percentage_change', null, 'severity', 'medium',
      'anomaly', 'uncertain_item_match',
      'anomalies', jsonb_build_array('uncertain_item_match', 'low_extraction_confidence')
    ))
  );

  begin
    perform public.ingest_supplier_invoice(
      v_user_id, v_org_id, v_branch_central,
      jsonb_build_object(
        'supplier_name', 'Bosporus Foods LLC', 'supplier_normalized_name', 'bosporus foods',
        'supplier_id', v_supplier_id, 'supplier_match_confidence', 1,
        'supplier_requires_review', false, 'invoice_number', 'DEV-SUP-1001',
        'invoice_date', current_date::text, 'currency', 'AED', 'total', 189,
        'source_type', 'manual_upload', 'extractor', 'manual_structured_v1',
        'original_filename', 'dev-duplicate-reference.pdf',
        'storage_path', v_org_id::text || '/dev-seed/dev-duplicate-reference.pdf',
        'file_hash', repeat('7', 64), 'raw_extraction', jsonb_build_object('demo', true),
        'confidence', 1, 'anomalies', '[]'::jsonb
      ),
      jsonb_build_array(jsonb_build_object(
        'raw_description', 'Chicken Breast 5KG', 'normalized_name', 'chicken breast 5 kg',
        'quantity', 10, 'unit', 'kg', 'unit_price', 18, 'line_total', 180,
        'extraction_confidence', 1, 'matched_supplier_item_id', v_supplier_item_id,
        'match_confidence', 1, 'requires_review', false, 'previous_unit_price', 18,
        'absolute_change', 0, 'percentage_change', 0, 'severity', 'none',
        'anomaly', null, 'anomalies', '[]'::jsonb
      ))
    );
    raise exception 'Duplicate supplier invoice fixture unexpectedly succeeded.';
  exception when unique_violation then
    raise notice 'Duplicate supplier invoice fixture was prevented as expected.';
  end;

  raise notice 'Restaurant V1 demo seeded for auth user %.', v_user_id;
end;
$restaurant_seed$;
