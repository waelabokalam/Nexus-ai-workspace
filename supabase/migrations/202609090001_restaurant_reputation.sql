-- Nexus Restaurant V1 Phase 2.2: provider-neutral reviews and reputation intelligence.
-- External provider connections and response publishing are intentionally out of scope.

create type public.restaurant_review_sentiment as enum ('positive', 'neutral', 'negative');
create type public.restaurant_review_topic as enum (
  'food_quality', 'service', 'speed', 'delivery', 'cleanliness',
  'staff', 'price', 'reservation', 'atmosphere', 'other'
);
create type public.restaurant_review_response_status as enum (
  'none', 'pending', 'approved', 'rejected'
);

create table public.restaurant_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.restaurant_organizations(id) on delete cascade,
  branch_id uuid,
  event_id uuid not null,
  source text not null check (source ~ '^[a-z][a-z0-9_]{0,79}$'),
  external_review_id text check (
    external_review_id is null or char_length(btrim(external_review_id)) between 1 and 240
  ),
  customer_display_name text check (
    customer_display_name is null or char_length(btrim(customer_display_name)) between 1 and 160
  ),
  rating smallint not null check (rating between 1 and 5),
  review_text text not null check (char_length(btrim(review_text)) between 1 and 10000),
  reviewed_at timestamptz not null,
  language text check (language is null or char_length(btrim(language)) between 2 and 35),
  sentiment public.restaurant_review_sentiment not null,
  topics public.restaurant_review_topic[] not null check (
    cardinality(topics) between 1 and 10 and array_position(topics, null) is null
  ),
  severity public.restaurant_severity not null check (severity <> 'info'),
  response_status public.restaurant_review_response_status not null default 'none',
  proposed_response text check (
    proposed_response is null or char_length(btrim(proposed_response)) between 1 and 4000
  ),
  approved_response text check (
    approved_response is null or char_length(btrim(approved_response)) between 1 and 4000
  ),
  dedupe_key text not null check (char_length(btrim(dedupe_key)) between 1 and 240),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint restaurant_reviews_id_organization_key unique (id, organization_id),
  constraint restaurant_reviews_event_key unique (event_id),
  constraint restaurant_reviews_dedupe_key unique (organization_id, dedupe_key),
  constraint restaurant_reviews_branch_organization_fk
    foreign key (branch_id, organization_id)
    references public.restaurant_branches(id, organization_id) on delete restrict,
  constraint restaurant_reviews_event_organization_fk
    foreign key (event_id, organization_id)
    references public.restaurant_events(id, organization_id) on delete restrict,
  constraint restaurant_reviews_response_state_check check (
    (response_status = 'none' and proposed_response is null and approved_response is null)
    or (response_status = 'pending' and proposed_response is not null and approved_response is null)
    or (response_status = 'approved' and proposed_response is not null and approved_response is not null)
    or (response_status = 'rejected' and proposed_response is not null and approved_response is null)
  )
);

create unique index restaurant_reviews_provider_external_key
  on public.restaurant_reviews (organization_id, source, external_review_id)
  where external_review_id is not null;
create index restaurant_reviews_recent_idx
  on public.restaurant_reviews (organization_id, reviewed_at desc);
create index restaurant_reviews_branch_recent_idx
  on public.restaurant_reviews (organization_id, branch_id, reviewed_at desc);
create index restaurant_reviews_negative_topics_idx
  on public.restaurant_reviews using gin (topics) where sentiment = 'negative';

create trigger restaurant_reviews_set_updated_at before update on public.restaurant_reviews
for each row execute function public.set_restaurant_updated_at();

create or replace function public.is_valid_restaurant_structured_data(p_data jsonb)
returns boolean language sql immutable set search_path = '' as $$
  select coalesce(
    jsonb_typeof(p_data) = 'object'
    and octet_length(p_data::text) <= 12288
    and not exists (
      select 1 from jsonb_object_keys(p_data) as item(key)
      where item.key not in (
        'channel', 'demo', 'allergen', 'party_size', 'guest_reference',
        'language', 'action_type', 'proposed_action', 'review_id', 'rating',
        'sentiment', 'topics', 'provider', 'trend_count', 'rolling_days'
      )
    )
    and (not p_data ? 'channel' or (
      jsonb_typeof(p_data->'channel') = 'string'
      and p_data->>'channel' in ('web_chat', 'email', 'sms', 'phone', 'internal')
    ))
    and (not p_data ? 'demo' or jsonb_typeof(p_data->'demo') = 'boolean')
    and (not p_data ? 'allergen' or (
      jsonb_typeof(p_data->'allergen') = 'string'
      and char_length(btrim(p_data->>'allergen')) between 1 and 120
    ))
    and (not p_data ? 'party_size' or (
      jsonb_typeof(p_data->'party_size') = 'number'
      and (p_data->>'party_size')::numeric between 1 and 100
      and trunc((p_data->>'party_size')::numeric) = (p_data->>'party_size')::numeric
    ))
    and (not p_data ? 'guest_reference' or (
      jsonb_typeof(p_data->'guest_reference') = 'string'
      and char_length(btrim(p_data->>'guest_reference')) between 1 and 240
    ))
    and (not p_data ? 'language' or (
      jsonb_typeof(p_data->'language') = 'string'
      and char_length(btrim(p_data->>'language')) between 2 and 35
    ))
    and (not p_data ? 'action_type' or (
      jsonb_typeof(p_data->'action_type') = 'string'
      and p_data->>'action_type' in (
        'manager_review', 'customer_response', 'reservation_change',
        'reservation_cancellation', 'refund', 'compensation'
      )
    ))
    and (not p_data ? 'proposed_action' or public.is_valid_restaurant_proposed_action(
      coalesce(p_data->>'action_type', 'manager_review'), p_data->'proposed_action'
    ))
    and (not p_data ? 'review_id' or (
      jsonb_typeof(p_data->'review_id') = 'string'
      and (p_data->>'review_id') ~
        '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$'
    ))
    and (not p_data ? 'rating' or (
      jsonb_typeof(p_data->'rating') = 'number'
      and (p_data->>'rating')::numeric between 1 and 5
      and trunc((p_data->>'rating')::numeric) = (p_data->>'rating')::numeric
    ))
    and (not p_data ? 'sentiment' or (
      jsonb_typeof(p_data->'sentiment') = 'string'
      and p_data->>'sentiment' in ('positive', 'neutral', 'negative')
    ))
    and (not p_data ? 'topics' or (
      jsonb_typeof(p_data->'topics') = 'array'
      and jsonb_array_length(p_data->'topics') between 1 and 10
      and not exists (
        select 1 from jsonb_array_elements_text(p_data->'topics') as topic(value)
        where topic.value not in (
          'food_quality', 'service', 'speed', 'delivery', 'cleanliness',
          'staff', 'price', 'reservation', 'atmosphere', 'other'
        )
      )
    ))
    and (not p_data ? 'provider' or (
      jsonb_typeof(p_data->'provider') = 'string'
      and p_data->>'provider' ~ '^[a-z][a-z0-9_]{0,79}$'
    ))
    and (not p_data ? 'trend_count' or (
      jsonb_typeof(p_data->'trend_count') = 'number'
      and (p_data->>'trend_count')::numeric between 2 and 10000
      and trunc((p_data->>'trend_count')::numeric) = (p_data->>'trend_count')::numeric
    ))
    and (not p_data ? 'rolling_days' or (
      jsonb_typeof(p_data->'rolling_days') = 'number'
      and (p_data->>'rolling_days')::numeric between 1 and 365
      and trunc((p_data->>'rolling_days')::numeric) = (p_data->>'rolling_days')::numeric
    )),
    false
  );
$$;

alter table public.restaurant_reviews enable row level security;
create policy restaurant_reviews_select_member on public.restaurant_reviews
for select to authenticated using (public.is_restaurant_member(organization_id));

create function public.ingest_restaurant_review(
  p_actor_id uuid,
  p_organization_id uuid,
  p_branch_id uuid,
  p_reviewed_at timestamptz,
  p_source text,
  p_external_review_id text,
  p_customer_display_name text,
  p_rating smallint,
  p_review_text text,
  p_language text,
  p_sentiment public.restaurant_review_sentiment,
  p_topics public.restaurant_review_topic[],
  p_severity public.restaurant_severity,
  p_dedupe_key text,
  p_proposed_response text
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_review public.restaurant_reviews%rowtype;
  v_review_id uuid := gen_random_uuid();
  v_event_result jsonb;
  v_trend_result jsonb;
  v_existing_trend_event_id uuid;
  v_trend_event_ids uuid[] := '{}';
  v_topic public.restaurant_review_topic;
  v_topic_count integer;
  v_structured_data jsonb;
  v_title text;
  v_summary text;
  v_handling_mode public.restaurant_handling_mode;
  v_event_status public.restaurant_event_status;
  v_attention_priority public.restaurant_severity;
  v_approval_required boolean;
  v_response_status public.restaurant_review_response_status;
  v_trend_dedupe_key text;
begin
  perform public.assert_restaurant_service_role();
  if p_actor_id is null or not exists (
    select 1 from public.restaurant_members
    where organization_id = p_organization_id and user_id = p_actor_id
  ) then
    raise exception using errcode = '42501', message = 'The review ingestion actor is not a restaurant member.';
  end if;
  perform public.assert_restaurant_branch(p_organization_id, p_branch_id);

  if p_reviewed_at is null
    or p_source is null or p_source !~ '^[a-z][a-z0-9_]{0,79}$'
    or p_rating is null or p_rating not between 1 and 5
    or p_review_text is null or char_length(btrim(p_review_text)) not between 1 and 10000
    or p_sentiment is null or p_topics is null or cardinality(p_topics) not between 1 and 10
    or array_position(p_topics, null) is not null
    or p_severity is null or p_severity = 'info'
    or p_dedupe_key is null or char_length(btrim(p_dedupe_key)) not between 1 and 240
    or (p_external_review_id is not null and char_length(btrim(p_external_review_id)) not between 1 and 240)
    or (p_customer_display_name is not null and char_length(btrim(p_customer_display_name)) not between 1 and 160)
    or (p_language is not null and char_length(btrim(p_language)) not between 2 and 35)
    or (p_proposed_response is not null and char_length(btrim(p_proposed_response)) not between 1 and 4000)
  then
    raise exception using errcode = '22023', message = 'The normalized restaurant review is invalid.';
  end if;
  if (p_sentiment = 'negative' and p_severity not in ('medium', 'high', 'critical'))
    or (p_sentiment <> 'negative' and p_severity <> 'low')
    or (p_severity in ('high', 'critical') and p_proposed_response is not null)
    or (p_sentiment = 'negative' and p_severity = 'medium' and p_proposed_response is null)
    or (p_sentiment <> 'negative' and p_proposed_response is not null)
  then
    raise exception using errcode = '22023', message = 'Review classification and response decision are inconsistent.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(
    p_organization_id::text || ':' || btrim(p_dedupe_key), 0
  ));
  select * into v_review from public.restaurant_reviews
  where organization_id = p_organization_id and dedupe_key = btrim(p_dedupe_key);
  if v_review.id is null and p_external_review_id is not null then
    select * into v_review from public.restaurant_reviews
    where organization_id = p_organization_id and source = p_source
      and external_review_id = btrim(p_external_review_id);
  end if;
  if v_review.id is not null then
    if v_review.branch_id is distinct from p_branch_id
      or v_review.source is distinct from p_source
      or v_review.external_review_id is distinct from nullif(btrim(p_external_review_id), '')
      or v_review.customer_display_name is distinct from nullif(btrim(p_customer_display_name), '')
      or v_review.rating is distinct from p_rating
      or v_review.review_text is distinct from btrim(p_review_text)
      or v_review.reviewed_at is distinct from p_reviewed_at
      or v_review.language is distinct from nullif(btrim(p_language), '')
      or v_review.sentiment is distinct from p_sentiment
      or v_review.topics is distinct from p_topics
      or v_review.severity is distinct from p_severity
      or v_review.dedupe_key is distinct from btrim(p_dedupe_key)
      or v_review.proposed_response is distinct from nullif(btrim(p_proposed_response), '')
    then
      raise exception using errcode = '23505', message = 'A review idempotency key was reused for different content.';
    end if;
    return jsonb_build_object(
      'review_id', v_review.id,
      'event_id', v_review.event_id,
      'attention_item_id', (select id from public.manager_attention_items where event_id = v_review.event_id),
      'approval_id', (select id from public.manager_approvals where event_id = v_review.event_id),
      'trend_event_ids', '[]'::jsonb,
      'created', false
    );
  end if;

  v_handling_mode := case
    when p_severity in ('high', 'critical') then 'human'::public.restaurant_handling_mode
    when p_proposed_response is not null then 'approval'::public.restaurant_handling_mode
    else 'auto'::public.restaurant_handling_mode
  end;
  v_event_status := case v_handling_mode
    when 'human' then 'escalated'::public.restaurant_event_status
    when 'approval' then 'waiting_approval'::public.restaurant_event_status
    else 'handled'::public.restaurant_event_status
  end;
  v_attention_priority := case when v_handling_mode = 'auto' then null else p_severity end;
  v_approval_required := v_handling_mode = 'approval';
  v_response_status := case when v_approval_required
    then 'pending'::public.restaurant_review_response_status
    else 'none'::public.restaurant_review_response_status
  end;
  v_title := p_rating::text || '-star ' || p_sentiment::text || ' review from '
    || coalesce(nullif(btrim(p_customer_display_name), ''), p_source);
  v_summary := left(btrim(p_review_text), 2000);
  v_structured_data := jsonb_build_object(
    'review_id', v_review_id,
    'rating', p_rating,
    'sentiment', p_sentiment,
    'topics', to_jsonb(p_topics),
    'provider', p_source
  );
  if v_approval_required then
    v_structured_data := v_structured_data || jsonb_build_object(
      'action_type', 'customer_response',
      'proposed_action', jsonb_build_object(
        'message', btrim(p_proposed_response),
        'tone', 'apologetic'
      )
    );
  end if;

  v_event_result := public.ingest_restaurant_event(
    p_actor_id, p_organization_id, p_branch_id, p_reviewed_at, p_source,
    'review_received', 'reputation', v_title, v_summary, p_severity,
    v_handling_mode, v_event_status, nullif(btrim(p_external_review_id), ''),
    'restaurant_review', v_review_id::text, v_structured_data, 1,
    v_handling_mode <> 'auto', btrim(p_dedupe_key), v_attention_priority,
    v_approval_required, case when v_approval_required then 'customer_response' else null end,
    case when v_approval_required then v_structured_data->'proposed_action' else '{}'::jsonb end
  );

  insert into public.restaurant_reviews (
    id, organization_id, branch_id, event_id, source, external_review_id,
    customer_display_name, rating, review_text, reviewed_at, language,
    sentiment, topics, severity, response_status, proposed_response,
    approved_response, dedupe_key
  ) values (
    v_review_id, p_organization_id, p_branch_id, (v_event_result->>'event_id')::uuid,
    p_source, nullif(btrim(p_external_review_id), ''),
    nullif(btrim(p_customer_display_name), ''), p_rating, btrim(p_review_text),
    p_reviewed_at, nullif(btrim(p_language), ''), p_sentiment, p_topics,
    p_severity, v_response_status, nullif(btrim(p_proposed_response), ''),
    null, btrim(p_dedupe_key)
  ) returning * into v_review;

  if p_sentiment = 'negative' then
    foreach v_topic in array p_topics loop
      continue when v_topic = 'other';
      perform pg_advisory_xact_lock(hashtextextended(
        'review-trend:' || p_organization_id::text || ':'
          || coalesce(p_branch_id::text, 'all') || ':' || v_topic::text,
        0
      ));
      select count(*) into v_topic_count from public.restaurant_reviews
      where organization_id = p_organization_id
        and branch_id is not distinct from p_branch_id
        and sentiment = 'negative'
        and v_topic = any(topics)
        and reviewed_at >= p_reviewed_at - interval '7 days'
        and reviewed_at <= p_reviewed_at;
      if v_topic_count >= 4 then
        select e.id into v_existing_trend_event_id
        from public.restaurant_events e
        join public.manager_attention_items i on i.event_id = e.id
        where e.organization_id = p_organization_id
          and e.branch_id is not distinct from p_branch_id
          and e.event_type = 'review_trend_detected'
          and e.subject_type = 'reputation_topic'
          and e.subject_id = v_topic::text
          and i.status in ('open', 'assigned')
        order by e.occurred_at desc
        limit 1;
        if v_existing_trend_event_id is null then
          v_trend_dedupe_key := 'review_trend:' || coalesce(p_branch_id::text, 'all')
            || ':' || v_topic::text || ':' || v_review_id::text;
          v_trend_result := public.ingest_restaurant_event(
            p_actor_id, p_organization_id, p_branch_id, p_reviewed_at,
            'reputation_engine', 'review_trend_detected', 'reputation',
            'Repeated ' || replace(v_topic::text, '_', ' ') || ' complaints',
            v_topic_count::text || ' negative reviews mentioned '
              || replace(v_topic::text, '_', ' ') || ' in the last 7 days.',
            'medium', 'human', 'escalated', null, 'reputation_topic',
            v_topic::text, jsonb_build_object(
              'topics', jsonb_build_array(v_topic::text),
              'trend_count', v_topic_count,
              'rolling_days', 7,
              'provider', 'reputation_engine'
            ), 1, true, v_trend_dedupe_key, 'medium', false, null, '{}'::jsonb
          );
          v_existing_trend_event_id := (v_trend_result->>'event_id')::uuid;
        end if;
        v_trend_event_ids := array_append(v_trend_event_ids, v_existing_trend_event_id);
      end if;
      v_existing_trend_event_id := null;
    end loop;
  end if;

  return v_event_result || jsonb_build_object(
    'review_id', v_review.id,
    'trend_event_ids', to_jsonb(v_trend_event_ids)
  );
end;
$$;

create function public.sync_restaurant_review_response()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.status = old.status and new.proposed_action is not distinct from old.proposed_action then
    return new;
  end if;
  if new.status in ('approved', 'edited') then
    update public.restaurant_reviews
    set response_status = 'approved',
        proposed_response = new.proposed_action->>'message',
        approved_response = new.proposed_action->>'message'
    where organization_id = new.organization_id and event_id = new.event_id;
  elsif new.status = 'rejected' then
    update public.restaurant_reviews
    set response_status = 'rejected', approved_response = null
    where organization_id = new.organization_id and event_id = new.event_id;
  end if;
  return new;
end;
$$;

create trigger manager_approval_sync_review_response
after update of status, proposed_action on public.manager_approvals
for each row execute function public.sync_restaurant_review_response();

revoke all on function public.ingest_restaurant_review(
  uuid, uuid, uuid, timestamptz, text, text, text, smallint, text, text,
  public.restaurant_review_sentiment, public.restaurant_review_topic[],
  public.restaurant_severity, text, text
) from public, anon, authenticated, service_role;
grant execute on function public.ingest_restaurant_review(
  uuid, uuid, uuid, timestamptz, text, text, text, smallint, text, text,
  public.restaurant_review_sentiment, public.restaurant_review_topic[],
  public.restaurant_severity, text, text
) to service_role;

revoke insert, update, delete, truncate, references, trigger
  on public.restaurant_reviews from anon, authenticated;
grant select on public.restaurant_reviews to authenticated;

comment on table public.restaurant_reviews is
  'Provider-neutral Restaurant V1 review history. External response publishing is intentionally absent.';
comment on function public.ingest_restaurant_review(
  uuid, uuid, uuid, timestamptz, text, text, text, smallint, text, text,
  public.restaurant_review_sentiment, public.restaurant_review_topic[],
  public.restaurant_severity, text, text
) is 'Atomically persists a classified review, operational workflow, and duplicate-safe 7-day topic alerts.';
