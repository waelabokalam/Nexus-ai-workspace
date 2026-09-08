-- Nexus Restaurant V1 persistence, authorization, and atomic workflows.
-- This migration is intentionally schema-only. Demo data lives in the explicit,
-- guarded supabase/seed.sql script and is never run automatically.

create type public.restaurant_member_role as enum ('owner', 'manager', 'staff');
create type public.restaurant_severity as enum ('info', 'low', 'medium', 'high', 'critical');
create type public.restaurant_handling_mode as enum ('auto', 'approval', 'human');
create type public.restaurant_event_status as enum (
  'new', 'processing', 'waiting_approval', 'handled', 'escalated', 'dismissed', 'failed'
);
create type public.restaurant_attention_status as enum ('open', 'assigned', 'resolved', 'dismissed');
create type public.restaurant_approval_status as enum ('pending', 'approved', 'edited', 'rejected', 'expired');
create type public.restaurant_actor_type as enum ('nexus', 'user', 'system');

create table public.restaurant_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  slug text not null unique check (slug ~ '^[a-z][a-z0-9-]{0,79}$'),
  timezone text not null default 'UTC' check (char_length(btrim(timezone)) between 1 and 100),
  default_currency text not null default 'USD' check (default_currency ~ '^[A-Z]{3}$'),
  default_locale text not null default 'en' check (char_length(btrim(default_locale)) between 2 and 35),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.restaurant_branches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.restaurant_organizations(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 160),
  city text check (city is null or char_length(btrim(city)) between 1 and 120),
  country text check (country is null or char_length(btrim(country)) between 1 and 120),
  timezone text not null check (char_length(btrim(timezone)) between 1 and 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint restaurant_branches_id_organization_key unique (id, organization_id),
  constraint restaurant_branches_organization_name_key unique (organization_id, name)
);

create table public.restaurant_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.restaurant_organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.restaurant_member_role not null,
  created_at timestamptz not null default now(),
  constraint restaurant_members_organization_user_key unique (organization_id, user_id),
  constraint restaurant_members_user_organization_key unique (user_id, organization_id)
);

create table public.restaurant_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.restaurant_organizations(id) on delete cascade,
  branch_id uuid,
  created_at timestamptz not null default now(),
  occurred_at timestamptz not null,
  source text not null check (source ~ '^[a-z][a-z0-9_]{0,79}$'),
  event_type text not null check (event_type ~ '^[a-z][a-z0-9_]{0,79}$'),
  category text not null check (
    category in ('customer', 'reservations', 'reputation', 'operations', 'sales', 'system')
  ),
  title text not null check (char_length(btrim(title)) between 1 and 180),
  summary text not null check (char_length(btrim(summary)) between 1 and 2000),
  severity public.restaurant_severity not null default 'info',
  handling_mode public.restaurant_handling_mode not null,
  status public.restaurant_event_status not null,
  source_reference text check (source_reference is null or char_length(btrim(source_reference)) between 1 and 240),
  subject_type text check (subject_type is null or subject_type ~ '^[a-z][a-z0-9_]{0,79}$'),
  subject_id text check (subject_id is null or char_length(btrim(subject_id)) between 1 and 240),
  structured_data jsonb not null default '{}'::jsonb check (jsonb_typeof(structured_data) = 'object'),
  confidence double precision check (confidence is null or confidence between 0 and 1),
  requires_attention boolean not null default false,
  dedupe_key text check (dedupe_key is null or char_length(btrim(dedupe_key)) between 1 and 240),
  updated_at timestamptz not null default now(),
  constraint restaurant_events_id_organization_key unique (id, organization_id),
  constraint restaurant_events_branch_organization_fk
    foreign key (branch_id, organization_id)
    references public.restaurant_branches(id, organization_id)
    on delete restrict
);

create unique index restaurant_events_organization_dedupe_key
  on public.restaurant_events (organization_id, dedupe_key) where dedupe_key is not null;
create unique index restaurant_events_organization_source_reference
  on public.restaurant_events (organization_id, source, source_reference) where source_reference is not null;

create table public.manager_attention_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.restaurant_organizations(id) on delete cascade,
  branch_id uuid,
  event_id uuid,
  title text not null check (char_length(btrim(title)) between 1 and 180),
  summary text not null check (char_length(btrim(summary)) between 1 and 2000),
  priority public.restaurant_severity not null,
  category text not null check (
    category in ('customer', 'reservations', 'reputation', 'operations', 'sales', 'system')
  ),
  status public.restaurant_attention_status not null default 'open',
  assigned_to uuid,
  due_at timestamptz,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint manager_attention_items_id_organization_key unique (id, organization_id),
  constraint manager_attention_items_resolution_check check (
    (status in ('open', 'assigned') and resolved_at is null)
    or (status in ('resolved', 'dismissed') and resolved_at is not null)
  ),
  constraint manager_attention_items_assignment_check check (
    (status = 'assigned' and assigned_to is not null) or status <> 'assigned'
  ),
  constraint manager_attention_items_branch_organization_fk
    foreign key (branch_id, organization_id)
    references public.restaurant_branches(id, organization_id) on delete restrict,
  constraint manager_attention_items_event_organization_fk
    foreign key (event_id, organization_id)
    references public.restaurant_events(id, organization_id) on delete restrict,
  constraint manager_attention_items_assignee_organization_fk
    foreign key (assigned_to, organization_id)
    references public.restaurant_members(user_id, organization_id) on delete restrict
);

create unique index manager_attention_items_one_per_event
  on public.manager_attention_items (event_id) where event_id is not null;

create table public.manager_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.restaurant_organizations(id) on delete cascade,
  branch_id uuid,
  event_id uuid,
  action_type text not null check (action_type ~ '^[a-z][a-z0-9_]{0,79}$'),
  title text not null check (char_length(btrim(title)) between 1 and 180),
  summary text not null check (char_length(btrim(summary)) between 1 and 2000),
  proposed_action jsonb not null default '{}'::jsonb check (jsonb_typeof(proposed_action) = 'object'),
  status public.restaurant_approval_status not null default 'pending',
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid,
  reviewer_note text check (reviewer_note is null or char_length(reviewer_note) <= 2000),
  updated_at timestamptz not null default now(),
  constraint manager_approvals_id_organization_key unique (id, organization_id),
  constraint manager_approvals_review_check check (
    (status = 'pending' and reviewed_at is null and reviewed_by is null)
    or (status in ('approved', 'edited', 'rejected') and reviewed_at is not null and reviewed_by is not null)
    or (status = 'expired' and reviewed_at is not null)
  ),
  constraint manager_approvals_branch_organization_fk
    foreign key (branch_id, organization_id)
    references public.restaurant_branches(id, organization_id) on delete restrict,
  constraint manager_approvals_event_organization_fk
    foreign key (event_id, organization_id)
    references public.restaurant_events(id, organization_id) on delete restrict,
  constraint manager_approvals_reviewer_organization_fk
    foreign key (reviewed_by, organization_id)
    references public.restaurant_members(user_id, organization_id) on delete restrict
);

create unique index manager_approvals_one_per_event
  on public.manager_approvals (event_id) where event_id is not null;

create table public.restaurant_activity_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.restaurant_organizations(id) on delete cascade,
  branch_id uuid,
  actor_type public.restaurant_actor_type not null,
  actor_id uuid,
  action text not null check (action ~ '^[a-z][a-z0-9_]{0,79}$'),
  entity_type text not null check (entity_type ~ '^[a-z][a-z0-9_]{0,79}$'),
  entity_id uuid,
  description text not null check (char_length(btrim(description)) between 1 and 2000),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  constraint restaurant_activity_log_actor_check check (
    (actor_type = 'user' and actor_id is not null)
    or (actor_type in ('nexus', 'system') and actor_id is null)
  ),
  constraint restaurant_activity_log_branch_organization_fk
    foreign key (branch_id, organization_id)
    references public.restaurant_branches(id, organization_id) on delete restrict
);

create index restaurant_branches_organization_active_name_idx
  on public.restaurant_branches (organization_id, is_active, name);
create index restaurant_members_user_idx on public.restaurant_members (user_id, created_at);
create index restaurant_events_organization_occurred_idx
  on public.restaurant_events (organization_id, occurred_at desc);
create index restaurant_events_organization_branch_occurred_idx
  on public.restaurant_events (organization_id, branch_id, occurred_at desc);
create index restaurant_events_command_center_idx
  on public.restaurant_events (organization_id, status, occurred_at desc);
create index manager_attention_items_open_idx
  on public.manager_attention_items (organization_id, branch_id, created_at desc)
  where status in ('open', 'assigned');
create index manager_approvals_pending_idx
  on public.manager_approvals (organization_id, branch_id, requested_at desc)
  where status = 'pending';
create index restaurant_activity_log_timeline_idx
  on public.restaurant_activity_log (organization_id, branch_id, created_at desc);
create index restaurant_activity_log_entity_idx
  on public.restaurant_activity_log (organization_id, entity_type, entity_id, created_at desc);

create function public.set_restaurant_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = clock_timestamp();
  return new;
end;
$$;

create trigger restaurant_organizations_set_updated_at before update on public.restaurant_organizations
for each row execute function public.set_restaurant_updated_at();
create trigger restaurant_branches_set_updated_at before update on public.restaurant_branches
for each row execute function public.set_restaurant_updated_at();
create trigger restaurant_events_set_updated_at before update on public.restaurant_events
for each row execute function public.set_restaurant_updated_at();
create trigger manager_attention_items_set_updated_at before update on public.manager_attention_items
for each row execute function public.set_restaurant_updated_at();
create trigger manager_approvals_set_updated_at before update on public.manager_approvals
for each row execute function public.set_restaurant_updated_at();

create function public.is_restaurant_member(p_organization_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.restaurant_members
    where organization_id = p_organization_id and user_id = auth.uid()
  );
$$;

create function public.has_restaurant_role(
  p_organization_id uuid,
  p_roles public.restaurant_member_role[]
)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.restaurant_members
    where organization_id = p_organization_id
      and user_id = auth.uid()
      and role = any(p_roles)
  );
$$;

create function public.assert_restaurant_role(
  p_organization_id uuid,
  p_roles public.restaurant_member_role[] default null
)
returns public.restaurant_member_role
language plpgsql stable security definer set search_path = '' as $$
declare
  v_role public.restaurant_member_role;
begin
  if auth.uid() is null then
    raise exception using errcode = '42501', message = 'Authentication is required.';
  end if;
  select role into v_role from public.restaurant_members
  where organization_id = p_organization_id and user_id = auth.uid();
  if v_role is null or (p_roles is not null and not (v_role = any(p_roles))) then
    raise exception using errcode = '42501', message = 'Insufficient restaurant organization access.';
  end if;
  return v_role;
end;
$$;

create function public.assert_restaurant_branch(p_organization_id uuid, p_branch_id uuid)
returns void language plpgsql stable security definer set search_path = '' as $$
begin
  if p_branch_id is not null and not exists (
    select 1 from public.restaurant_branches
    where id = p_branch_id and organization_id = p_organization_id and is_active
  ) then
    raise exception using errcode = '23503',
      message = 'The branch is not active in this restaurant organization.';
  end if;
end;
$$;

create function public.assert_restaurant_service_role()
returns void language plpgsql stable security definer set search_path = '' as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    raise exception using errcode = '42501',
      message = 'This operation requires the trusted service role.';
  end if;
end;
$$;

create function public.is_valid_restaurant_timestamp(p_value text)
returns boolean language plpgsql immutable set search_path = '' as $$
begin
  if p_value is null or p_value !~
    '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[+-][0-9]{2}:[0-9]{2})$'
  then
    return false;
  end if;
  perform p_value::timestamptz;
  return true;
exception when others then
  return false;
end;
$$;

create function public.is_valid_restaurant_proposed_action(
  p_action_type text,
  p_action jsonb
)
returns boolean language sql immutable set search_path = '' as $$
  select coalesce(
    p_action_type in (
      'manager_review', 'customer_response', 'reservation_change',
      'reservation_cancellation', 'refund', 'compensation'
    )
    and jsonb_typeof(p_action) = 'object'
    and octet_length(p_action::text) <= 8192
    and not exists (
      select 1 from jsonb_object_keys(p_action) as item(key)
      where item.key not in (
        'channel', 'message', 'tone', 'offer', 'reservation_id',
        'requested_time', 'reason', 'amount', 'currency'
      )
    )
    and (not p_action ? 'channel' or (
      jsonb_typeof(p_action->'channel') = 'string'
      and p_action->>'channel' in ('web_chat', 'email', 'sms', 'phone', 'internal')
    ))
    and (not p_action ? 'message' or (
      jsonb_typeof(p_action->'message') = 'string'
      and char_length(btrim(p_action->>'message')) between 1 and 4000
    ))
    and (not p_action ? 'tone' or (
      jsonb_typeof(p_action->'tone') = 'string'
      and p_action->>'tone' in ('warm', 'neutral', 'concise', 'apologetic')
    ))
    and (not p_action ? 'offer' or (
      jsonb_typeof(p_action->'offer') = 'string'
      and p_action->>'offer' in ('none', 'dessert_on_next_visit', 'discount', 'refund')
    ))
    and (not p_action ? 'reservation_id' or (
      jsonb_typeof(p_action->'reservation_id') = 'string'
      and char_length(btrim(p_action->>'reservation_id')) between 1 and 240
    ))
    and (not p_action ? 'requested_time' or (
      jsonb_typeof(p_action->'requested_time') = 'string'
      and public.is_valid_restaurant_timestamp(p_action->>'requested_time')
      and (p_action->>'requested_time')::timestamptz is not null
    ))
    and (not p_action ? 'reason' or (
      jsonb_typeof(p_action->'reason') = 'string'
      and char_length(btrim(p_action->>'reason')) between 1 and 500
    ))
    and (not p_action ? 'amount' or (
      jsonb_typeof(p_action->'amount') = 'number'
      and (p_action->>'amount')::numeric between 0 and 1000000
    ))
    and (not p_action ? 'currency' or (
      jsonb_typeof(p_action->'currency') = 'string'
      and p_action->>'currency' ~ '^[A-Z]{3}$'
    )),
    false
  );
$$;

create function public.is_valid_restaurant_structured_data(p_data jsonb)
returns boolean language sql immutable set search_path = '' as $$
  select coalesce(
    jsonb_typeof(p_data) = 'object'
    and octet_length(p_data::text) <= 12288
    and not exists (
      select 1 from jsonb_object_keys(p_data) as item(key)
      where item.key not in (
        'channel', 'demo', 'allergen', 'party_size', 'guest_reference',
        'language', 'action_type', 'proposed_action'
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
    )),
    false
  );
$$;

alter table public.restaurant_events
  add constraint restaurant_events_structured_data_check
  check (public.is_valid_restaurant_structured_data(structured_data));
alter table public.manager_approvals
  add constraint manager_approvals_action_check
  check (public.is_valid_restaurant_proposed_action(action_type, proposed_action));

alter table public.restaurant_organizations enable row level security;
alter table public.restaurant_branches enable row level security;
alter table public.restaurant_members enable row level security;
alter table public.restaurant_events enable row level security;
alter table public.manager_attention_items enable row level security;
alter table public.manager_approvals enable row level security;
alter table public.restaurant_activity_log enable row level security;

create policy restaurant_organizations_select_member on public.restaurant_organizations
for select to authenticated using (public.is_restaurant_member(id));
create policy restaurant_organizations_update_owner on public.restaurant_organizations
for update to authenticated
using (public.has_restaurant_role(id, array['owner']::public.restaurant_member_role[]))
with check (public.has_restaurant_role(id, array['owner']::public.restaurant_member_role[]));
create policy restaurant_branches_select_member on public.restaurant_branches
for select to authenticated using (public.is_restaurant_member(organization_id));
create policy restaurant_branches_insert_manager on public.restaurant_branches
for insert to authenticated
with check (public.has_restaurant_role(organization_id, array['owner', 'manager']::public.restaurant_member_role[]));
create policy restaurant_branches_update_manager on public.restaurant_branches
for update to authenticated
using (public.has_restaurant_role(organization_id, array['owner', 'manager']::public.restaurant_member_role[]))
with check (public.has_restaurant_role(organization_id, array['owner', 'manager']::public.restaurant_member_role[]));
create policy restaurant_members_select_member on public.restaurant_members
for select to authenticated using (public.is_restaurant_member(organization_id));
create policy restaurant_events_select_member on public.restaurant_events
for select to authenticated using (public.is_restaurant_member(organization_id));
create policy manager_attention_items_select_member on public.manager_attention_items
for select to authenticated using (public.is_restaurant_member(organization_id));
create policy manager_approvals_select_member on public.manager_approvals
for select to authenticated using (public.is_restaurant_member(organization_id));
create policy restaurant_activity_log_select_member on public.restaurant_activity_log
for select to authenticated using (public.is_restaurant_member(organization_id));

create function public.ingest_restaurant_event(
  p_actor_id uuid,
  p_organization_id uuid,
  p_branch_id uuid,
  p_occurred_at timestamptz,
  p_source text,
  p_event_type text,
  p_category text,
  p_title text,
  p_summary text,
  p_severity public.restaurant_severity,
  p_handling_mode public.restaurant_handling_mode,
  p_event_status public.restaurant_event_status,
  p_source_reference text,
  p_subject_type text,
  p_subject_id text,
  p_structured_data jsonb,
  p_confidence double precision,
  p_requires_attention boolean,
  p_dedupe_key text,
  p_attention_priority public.restaurant_severity,
  p_approval_required boolean,
  p_approval_action_type text,
  p_proposed_action jsonb
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_event public.restaurant_events%rowtype;
  v_source_event_id uuid;
  v_attention_id uuid;
  v_approval_id uuid;
  v_activity_id uuid;
  v_actor_type public.restaurant_actor_type;
  v_activity_action text;
  v_activity_description text;
  v_created boolean := false;
begin
  perform public.assert_restaurant_service_role();
  if p_actor_id is null or not exists (
    select 1 from public.restaurant_members
    where organization_id = p_organization_id and user_id = p_actor_id
  ) then
    raise exception using errcode = '42501', message = 'The ingestion actor is not a restaurant member.';
  end if;
  perform public.assert_restaurant_branch(p_organization_id, p_branch_id);

  if p_occurred_at is null
    or p_source is null or p_source !~ '^[a-z][a-z0-9_]{0,79}$'
    or p_event_type is null or p_event_type !~ '^[a-z][a-z0-9_]{0,79}$'
    or p_category is null or p_category not in (
      'customer', 'reservations', 'reputation', 'operations', 'sales', 'system'
    )
    or p_title is null or char_length(btrim(p_title)) not between 1 and 180
    or p_summary is null or char_length(btrim(p_summary)) not between 1 and 2000
    or p_severity is null or p_handling_mode is null or p_event_status is null
    or not public.is_valid_restaurant_structured_data(p_structured_data)
    or p_requires_attention is null or p_approval_required is null
  then
    raise exception using errcode = '22023', message = 'The normalized restaurant event is invalid.';
  end if;
  if p_confidence is not null and (p_confidence < 0 or p_confidence > 1) then
    raise exception using errcode = '22023', message = 'Event confidence must be between zero and one.';
  end if;
  if p_requires_attention <> (p_handling_mode in ('approval', 'human'))
    or (p_requires_attention and p_attention_priority is null)
    or (not p_requires_attention and p_attention_priority is not null)
    or (p_handling_mode = 'auto' and (p_event_status <> 'handled' or p_approval_required))
    or (p_handling_mode = 'approval' and (
      p_event_status <> 'waiting_approval' or not p_approval_required
      or p_approval_action_type is null or p_approval_action_type !~ '^[a-z][a-z0-9_]{0,79}$'
      or not public.is_valid_restaurant_proposed_action(p_approval_action_type, p_proposed_action)
    ))
    or (p_handling_mode = 'human' and (p_event_status <> 'escalated' or p_approval_required))
    or (not p_approval_required and (
      p_approval_action_type is not null or p_proposed_action is distinct from '{}'::jsonb
    ))
    or (not p_approval_required and (
      p_approval_action_type is not null or p_proposed_action is distinct from '{}'::jsonb
    ))
  then
    raise exception using errcode = '22023', message = 'Event handling decision is inconsistent.';
  end if;

  if p_dedupe_key is not null then
    select * into v_event from public.restaurant_events
    where organization_id = p_organization_id and dedupe_key = p_dedupe_key;
  end if;
  if p_source_reference is not null then
    select id into v_source_event_id from public.restaurant_events
    where organization_id = p_organization_id and source = p_source
      and source_reference = p_source_reference;
    if v_event.id is not null and v_source_event_id is not null and v_event.id <> v_source_event_id then
      raise exception using errcode = '23505', message = 'Dedupe key and source reference identify different events.';
    elsif v_event.id is null and v_source_event_id is not null then
      select * into v_event from public.restaurant_events where id = v_source_event_id;
    end if;
  end if;

  if v_event.id is null then
    insert into public.restaurant_events (
      organization_id, branch_id, occurred_at, source, event_type, category, title, summary,
      severity, handling_mode, status, source_reference, subject_type, subject_id,
      structured_data, confidence, requires_attention, dedupe_key
    ) values (
      p_organization_id, p_branch_id, p_occurred_at, p_source, p_event_type, p_category,
      btrim(p_title), btrim(p_summary), p_severity, p_handling_mode, p_event_status,
      p_source_reference, p_subject_type, p_subject_id, p_structured_data, p_confidence,
      p_requires_attention, p_dedupe_key
    ) on conflict do nothing returning * into v_event;
    v_created := v_event.id is not null;
    if not v_created and p_dedupe_key is not null then
      select * into v_event from public.restaurant_events
      where organization_id = p_organization_id and dedupe_key = p_dedupe_key;
    end if;
    if not v_created and v_event.id is null and p_source_reference is not null then
      select * into v_event from public.restaurant_events
      where organization_id = p_organization_id and source = p_source
        and source_reference = p_source_reference;
    end if;
    if v_event.id is null then
      raise exception using errcode = '23505', message = 'The event conflicts with an existing event.';
    end if;
  end if;

  if not v_created then
    if v_event.branch_id is distinct from p_branch_id
      or v_event.occurred_at is distinct from p_occurred_at
      or v_event.source is distinct from p_source
      or v_event.event_type is distinct from p_event_type
      or v_event.category is distinct from p_category
      or v_event.title is distinct from btrim(p_title)
      or v_event.summary is distinct from btrim(p_summary)
      or v_event.severity is distinct from p_severity
      or v_event.handling_mode is distinct from p_handling_mode
      or v_event.source_reference is distinct from p_source_reference
      or v_event.subject_type is distinct from p_subject_type
      or v_event.subject_id is distinct from p_subject_id
      or v_event.structured_data is distinct from p_structured_data
      or v_event.confidence is distinct from p_confidence
      or v_event.requires_attention is distinct from p_requires_attention
      or v_event.dedupe_key is distinct from p_dedupe_key
      or (p_handling_mode = 'auto' and p_event_status <> 'handled')
      or (p_handling_mode = 'approval' and p_event_status <> 'waiting_approval')
      or (p_handling_mode = 'human' and p_event_status <> 'escalated')
    then
      raise exception using errcode = '23505', message = 'An idempotency key was reused for a different event.';
    end if;
    select id into v_attention_id from public.manager_attention_items where event_id = v_event.id;
    select id into v_approval_id from public.manager_approvals where event_id = v_event.id;
    if (p_requires_attention and not exists (
        select 1 from public.manager_attention_items
        where event_id = v_event.id and priority = p_attention_priority and category = p_category
      ))
      or (not p_requires_attention and v_attention_id is not null)
      or (p_approval_required and not exists (
        select 1 from public.manager_approvals
        where event_id = v_event.id and action_type = p_approval_action_type
      ))
      or (not p_approval_required and v_approval_id is not null)
    then
      raise exception using errcode = '23505', message = 'An idempotency key was reused with a different handling decision.';
    end if;
    return jsonb_build_object(
      'event_id', v_event.id, 'attention_item_id', v_attention_id,
      'approval_id', v_approval_id, 'created', false
    );
  end if;

  if p_requires_attention then
    insert into public.manager_attention_items (
      organization_id, branch_id, event_id, title, summary, priority, category
    ) values (
      p_organization_id, p_branch_id, v_event.id, btrim(p_title), btrim(p_summary),
      p_attention_priority, p_category
    ) returning id into v_attention_id;
  end if;
  if p_approval_required then
    insert into public.manager_approvals (
      organization_id, branch_id, event_id, action_type, title, summary, proposed_action
    ) values (
      p_organization_id, p_branch_id, v_event.id, p_approval_action_type, btrim(p_title),
      btrim(p_summary), p_proposed_action
    ) returning id into v_approval_id;
  end if;

  v_actor_type := case when p_source = 'nexus_agent' or p_handling_mode = 'auto'
    then 'nexus'::public.restaurant_actor_type else 'system'::public.restaurant_actor_type end;
  v_activity_action := case p_event_status
    when 'handled' then 'event_handled'
    when 'waiting_approval' then 'approval_requested'
    when 'escalated' then 'event_escalated'
    else 'event_ingested'
  end;
  v_activity_description := case p_event_status
    when 'handled' then 'Nexus handled ' || btrim(p_title) || '.'
    when 'waiting_approval' then btrim(p_title) || ' is waiting for manager approval.'
    when 'escalated' then btrim(p_title) || ' was escalated for human attention.'
    else btrim(p_title) || ' was recorded.'
  end;
  insert into public.restaurant_activity_log (
    organization_id, branch_id, actor_type, actor_id, action, entity_type,
    entity_id, description, metadata
  ) values (
    p_organization_id, p_branch_id, v_actor_type, null, v_activity_action,
    'restaurant_event', v_event.id, v_activity_description,
    jsonb_build_object('event_type', p_event_type, 'source', p_source, 'severity', p_severity)
  ) returning id into v_activity_id;

  return jsonb_build_object(
    'event_id', v_event.id, 'attention_item_id', v_attention_id, 'approval_id', v_approval_id,
    'activity_id', v_activity_id, 'created', true
  );
end;
$$;

create function public.update_manager_attention_item(
  p_organization_id uuid,
  p_attention_id uuid,
  p_status public.restaurant_attention_status,
  p_assigned_to uuid,
  p_assigned_to_is_set boolean
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_item public.manager_attention_items%rowtype;
  v_previous_status public.restaurant_attention_status;
  v_activity_id uuid;
  v_now timestamptz := clock_timestamp();
  v_next_assigned_to uuid;
begin
  perform public.assert_restaurant_role(
    p_organization_id, array['owner', 'manager']::public.restaurant_member_role[]
  );
  select * into v_item from public.manager_attention_items
  where id = p_attention_id and organization_id = p_organization_id for update;
  if v_item.id is null then
    raise exception using errcode = 'P0002', message = 'Manager attention item was not found.';
  end if;
  if p_status is null then
    raise exception using errcode = '22023', message = 'Attention status is required.';
  end if;
  if p_assigned_to_is_set is null then
    raise exception using errcode = '22023', message = 'Assignee presence is required.';
  end if;
  v_next_assigned_to := case
    when p_assigned_to_is_set then p_assigned_to
    else v_item.assigned_to
  end;
  if v_item.status in ('resolved', 'dismissed') then
    raise exception using errcode = '55000', message = 'The attention item is already in a terminal state.';
  end if;
  if p_status = v_item.status and not (
    p_status = 'assigned' and v_next_assigned_to is distinct from v_item.assigned_to
  ) then
    raise exception using errcode = '55000', message = 'The attention item transition is stale.';
  end if;
  if p_status = 'assigned' and v_next_assigned_to is null then
    raise exception using errcode = '22023', message = 'Assigned attention requires an assignee.';
  end if;
  if p_status = 'open' and v_next_assigned_to is not null then
    raise exception using errcode = '22023', message = 'Open attention cannot retain an assignee.';
  end if;
  if v_next_assigned_to is not null and not exists (
    select 1 from public.restaurant_members
    where organization_id = p_organization_id and user_id = v_next_assigned_to
  ) then
    raise exception using errcode = '23503', message = 'The assignee is not a member of this restaurant.';
  end if;
  if p_status in ('resolved', 'dismissed') and v_item.event_id is not null and exists (
    select 1 from public.manager_approvals
    where organization_id = p_organization_id
      and event_id = v_item.event_id
      and status = 'pending'
  ) then
    raise exception using errcode = '55000',
      message = 'Resolve the pending approval before closing manager attention.';
  end if;

  v_previous_status := v_item.status;
  update public.manager_attention_items
  set status = p_status,
      assigned_to = v_next_assigned_to,
      resolved_at = case when p_status in ('resolved', 'dismissed') then v_now else null end
  where id = v_item.id returning * into v_item;
  if v_item.event_id is not null and p_status in ('resolved', 'dismissed') then
    update public.restaurant_events
    set status = case when p_status = 'resolved' then 'handled'::public.restaurant_event_status
      else 'dismissed'::public.restaurant_event_status end
    where id = v_item.event_id and organization_id = p_organization_id
      and status in ('new', 'processing', 'escalated');
  end if;
  insert into public.restaurant_activity_log (
    organization_id, branch_id, actor_type, actor_id, action, entity_type,
    entity_id, description, metadata
  ) values (
    p_organization_id, v_item.branch_id, 'user', auth.uid(), 'attention_' || p_status::text,
    'manager_attention_item', v_item.id,
    case p_status
      when 'assigned' then 'Manager attention was assigned.'
      when 'resolved' then 'Manager attention was resolved.'
      when 'dismissed' then 'Manager attention was dismissed.'
      else 'Manager attention was reopened.'
    end,
    jsonb_build_object('previous_status', v_previous_status, 'assigned_to', v_next_assigned_to)
  ) returning id into v_activity_id;
  return jsonb_build_object(
    'attention_id', v_item.id, 'status', v_item.status,
    'assigned_to', v_item.assigned_to, 'activity_id', v_activity_id
  );
end;
$$;

create function public.process_manager_approval(
  p_organization_id uuid,
  p_approval_id uuid,
  p_decision text,
  p_reviewer_note text,
  p_edited_action jsonb
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_approval public.manager_approvals%rowtype;
  v_activity_id uuid;
  v_now timestamptz := clock_timestamp();
  v_new_status public.restaurant_approval_status;
  v_event_status public.restaurant_event_status;
  v_attention_status public.restaurant_attention_status;
begin
  perform public.assert_restaurant_role(
    p_organization_id, array['owner', 'manager']::public.restaurant_member_role[]
  );
  if p_decision is null or p_decision not in ('approved', 'edited', 'rejected') then
    raise exception using errcode = '22023', message = 'Approval decision is invalid.';
  end if;
  if p_reviewer_note is not null and char_length(p_reviewer_note) > 2000 then
    raise exception using errcode = '22023', message = 'Reviewer note is too long.';
  end if;
  if p_decision <> 'edited' and p_edited_action is not null then
    raise exception using errcode = '22023', message = 'Only an edited decision may replace the proposed action.';
  end if;

  select * into v_approval from public.manager_approvals
  where id = p_approval_id and organization_id = p_organization_id for update;
  if v_approval.id is null then
    raise exception using errcode = 'P0002', message = 'Manager approval was not found.';
  end if;
  if v_approval.status <> 'pending' then
    raise exception using errcode = '55000', message = 'The approval decision is stale.';
  end if;
  if p_decision = 'edited' and not coalesce(public.is_valid_restaurant_proposed_action(
    v_approval.action_type, p_edited_action
  ), false) then
    raise exception using errcode = '22023',
      message = 'The edited proposed action is invalid for this approval.';
  end if;
  if v_approval.event_id is not null then
    perform 1 from public.restaurant_events
    where id = v_approval.event_id and organization_id = p_organization_id
      and status = 'waiting_approval' for update;
    if not found then
      raise exception using errcode = '55000', message = 'The related event is no longer waiting for approval.';
    end if;
  end if;

  v_new_status := p_decision::public.restaurant_approval_status;
  v_event_status := case when p_decision = 'rejected' then 'dismissed'::public.restaurant_event_status
    else 'handled'::public.restaurant_event_status end;
  v_attention_status := case when p_decision = 'rejected' then 'dismissed'::public.restaurant_attention_status
    else 'resolved'::public.restaurant_attention_status end;
  update public.manager_approvals
  set status = v_new_status,
      proposed_action = case when p_decision = 'edited' then p_edited_action else proposed_action end,
      reviewed_at = v_now,
      reviewed_by = auth.uid(),
      reviewer_note = nullif(btrim(p_reviewer_note), '')
  where id = v_approval.id returning * into v_approval;
  if v_approval.event_id is not null then
    update public.restaurant_events set status = v_event_status
    where id = v_approval.event_id and organization_id = p_organization_id;
    update public.manager_attention_items
    set status = v_attention_status, resolved_at = v_now
    where event_id = v_approval.event_id and organization_id = p_organization_id
      and status in ('open', 'assigned');
  end if;
  insert into public.restaurant_activity_log (
    organization_id, branch_id, actor_type, actor_id, action, entity_type,
    entity_id, description, metadata
  ) values (
    p_organization_id, v_approval.branch_id, 'user', auth.uid(), 'approval_' || p_decision,
    'manager_approval', v_approval.id,
    case p_decision
      when 'approved' then 'Manager approved the proposed action.'
      when 'edited' then 'Manager edited and approved the proposed action.'
      else 'Manager rejected the proposed action.'
    end,
    jsonb_build_object('event_id', v_approval.event_id, 'reviewer_note', v_approval.reviewer_note)
  ) returning id into v_activity_id;
  return jsonb_build_object(
    'approval_id', v_approval.id, 'status', v_approval.status,
    'event_id', v_approval.event_id, 'event_status', v_event_status,
    'activity_id', v_activity_id
  );
end;
$$;

create function public.manage_restaurant_member(
  p_organization_id uuid,
  p_user_id uuid,
  p_operation text,
  p_role public.restaurant_member_role
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_member public.restaurant_members%rowtype;
  v_previous_role public.restaurant_member_role;
  v_activity_id uuid;
  v_action text;
begin
  perform public.assert_restaurant_role(
    p_organization_id, array['owner']::public.restaurant_member_role[]
  );

  -- Serialize owner-count checks for every membership change in this organization.
  perform 1 from public.restaurant_organizations
  where id = p_organization_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Restaurant organization was not found.';
  end if;
  if p_user_id is null
    or p_operation is null
    or p_operation not in ('upsert', 'remove')
    or (p_operation = 'upsert' and p_role is null)
    or (p_operation = 'remove' and p_role is not null)
  then
    raise exception using errcode = '22023', message = 'Membership operation is invalid.';
  end if;

  select * into v_member from public.restaurant_members
  where organization_id = p_organization_id and user_id = p_user_id
  for update;
  v_previous_role := v_member.role;

  if p_operation = 'remove' then
    if v_member.id is null then
      raise exception using errcode = 'P0002', message = 'Restaurant member was not found.';
    end if;
    if v_member.role = 'owner' and (
      select count(*) from public.restaurant_members
      where organization_id = p_organization_id and role = 'owner'
    ) <= 1 then
      raise exception using errcode = '55000',
        message = 'The last restaurant owner cannot be removed.';
    end if;
    delete from public.restaurant_members where id = v_member.id;
    v_action := 'member_removed';
  else
    if v_member.id is not null and v_member.role = p_role then
      raise exception using errcode = '55000', message = 'The membership update is stale.';
    end if;
    if v_member.id is not null and v_member.role = 'owner' and p_role <> 'owner' and (
      select count(*) from public.restaurant_members
      where organization_id = p_organization_id and role = 'owner'
    ) <= 1 then
      raise exception using errcode = '55000',
        message = 'The last restaurant owner cannot be demoted.';
    end if;
    if v_member.id is null then
      insert into public.restaurant_members (organization_id, user_id, role)
      values (p_organization_id, p_user_id, p_role)
      returning * into v_member;
      v_action := 'member_added';
    else
      update public.restaurant_members set role = p_role
      where id = v_member.id returning * into v_member;
      v_action := 'member_role_updated';
    end if;
  end if;

  insert into public.restaurant_activity_log (
    organization_id, branch_id, actor_type, actor_id, action, entity_type,
    entity_id, description, metadata
  ) values (
    p_organization_id, null, 'user', auth.uid(), v_action, 'restaurant_member',
    v_member.id,
    case v_action
      when 'member_added' then 'Restaurant member was added.'
      when 'member_role_updated' then 'Restaurant member role was updated.'
      else 'Restaurant member was removed.'
    end,
    jsonb_build_object(
      'user_id', p_user_id,
      'previous_role', v_previous_role,
      'role', case when p_operation = 'remove' then null else p_role end
    )
  ) returning id into v_activity_id;

  return jsonb_build_object(
    'member_id', v_member.id,
    'user_id', p_user_id,
    'operation', p_operation,
    'role', case when p_operation = 'remove' then null else p_role end,
    'activity_id', v_activity_id
  );
end;
$$;

create function public.write_restaurant_activity(
  p_actor_id uuid,
  p_organization_id uuid,
  p_branch_id uuid,
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_description text,
  p_metadata jsonb
)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_activity_id uuid;
begin
  perform public.assert_restaurant_service_role();
  if p_actor_id is null or not exists (
    select 1 from public.restaurant_members
    where organization_id = p_organization_id and user_id = p_actor_id
  ) then
    raise exception using errcode = '42501', message = 'The activity actor is not a restaurant member.';
  end if;
  perform public.assert_restaurant_branch(p_organization_id, p_branch_id);
  if p_action is null or p_action not in (
      'manager_note_added', 'restaurant_settings_updated', 'branch_settings_updated'
    )
    or p_entity_type is null or p_entity_type not in (
      'restaurant_organization', 'restaurant_branch', 'restaurant_event',
      'manager_attention_item', 'manager_approval'
    )
    or p_description is null or char_length(btrim(p_description)) not between 1 and 2000
    or p_metadata is null or jsonb_typeof(p_metadata) <> 'object'
    or octet_length(p_metadata::text) > 2048
    or exists (
      select 1 from jsonb_object_keys(p_metadata) as item(key)
      where item.key not in ('reason', 'source')
    )
    or (p_metadata ? 'reason' and (
      jsonb_typeof(p_metadata->'reason') <> 'string'
      or char_length(p_metadata->>'reason') not between 1 and 500
    ))
    or (p_metadata ? 'source' and (
      jsonb_typeof(p_metadata->'source') <> 'string'
      or p_metadata->>'source' not in ('manager_command_center', 'settings')
    ))
  then
    raise exception using errcode = '22023', message = 'Activity input is invalid.';
  end if;
  insert into public.restaurant_activity_log (
    organization_id, branch_id, actor_type, actor_id, action, entity_type,
    entity_id, description, metadata
  ) values (
    p_organization_id, p_branch_id, 'user', p_actor_id, p_action, p_entity_type,
    p_entity_id, btrim(p_description), p_metadata
  ) returning id into v_activity_id;
  return v_activity_id;
end;
$$;

revoke all on function public.set_restaurant_updated_at() from public, anon, authenticated, service_role;
revoke all on function public.is_restaurant_member(uuid) from public, anon, authenticated, service_role;
revoke all on function public.has_restaurant_role(uuid, public.restaurant_member_role[]) from public, anon, authenticated, service_role;
revoke all on function public.assert_restaurant_role(uuid, public.restaurant_member_role[]) from public, anon, authenticated, service_role;
revoke all on function public.assert_restaurant_branch(uuid, uuid) from public, anon, authenticated, service_role;
revoke all on function public.assert_restaurant_service_role() from public, anon, authenticated, service_role;
revoke all on function public.is_valid_restaurant_timestamp(text) from public, anon, authenticated, service_role;
revoke all on function public.is_valid_restaurant_proposed_action(text, jsonb) from public, anon, authenticated, service_role;
revoke all on function public.is_valid_restaurant_structured_data(jsonb) from public, anon, authenticated, service_role;
revoke all on function public.ingest_restaurant_event(
  uuid, uuid, uuid, timestamptz, text, text, text, text, text,
  public.restaurant_severity, public.restaurant_handling_mode, public.restaurant_event_status,
  text, text, text, jsonb, double precision, boolean, text,
  public.restaurant_severity, boolean, text, jsonb
) from public, anon, authenticated, service_role;
revoke all on function public.update_manager_attention_item(
  uuid, uuid, public.restaurant_attention_status, uuid, boolean
) from public, anon, authenticated, service_role;
revoke all on function public.process_manager_approval(uuid, uuid, text, text, jsonb) from public, anon, authenticated, service_role;
revoke all on function public.manage_restaurant_member(
  uuid, uuid, text, public.restaurant_member_role
) from public, anon, authenticated, service_role;
revoke all on function public.write_restaurant_activity(
  uuid, uuid, uuid, text, text, uuid, text, jsonb
) from public, anon, authenticated, service_role;

grant execute on function public.is_restaurant_member(uuid) to authenticated;
grant execute on function public.has_restaurant_role(uuid, public.restaurant_member_role[]) to authenticated;
grant execute on function public.ingest_restaurant_event(
  uuid, uuid, uuid, timestamptz, text, text, text, text, text,
  public.restaurant_severity, public.restaurant_handling_mode, public.restaurant_event_status,
  text, text, text, jsonb, double precision, boolean, text,
  public.restaurant_severity, boolean, text, jsonb
) to service_role;
grant execute on function public.update_manager_attention_item(
  uuid, uuid, public.restaurant_attention_status, uuid, boolean
) to authenticated;
grant execute on function public.process_manager_approval(uuid, uuid, text, text, jsonb) to authenticated;
grant execute on function public.manage_restaurant_member(
  uuid, uuid, text, public.restaurant_member_role
) to authenticated;
grant execute on function public.write_restaurant_activity(
  uuid, uuid, uuid, text, text, uuid, text, jsonb
) to service_role;

revoke insert, update, delete, truncate, references, trigger
  on public.restaurant_organizations, public.restaurant_branches,
  public.restaurant_members, public.restaurant_events, public.manager_attention_items,
  public.manager_approvals, public.restaurant_activity_log
  from anon, authenticated;

grant select on public.restaurant_organizations, public.restaurant_branches,
  public.restaurant_members, public.restaurant_events, public.manager_attention_items,
  public.manager_approvals, public.restaurant_activity_log to authenticated;
grant update on public.restaurant_organizations to authenticated;
grant insert, update on public.restaurant_branches to authenticated;

comment on function public.ingest_restaurant_event(
  uuid, uuid, uuid, timestamptz, text, text, text, text, text,
  public.restaurant_severity, public.restaurant_handling_mode, public.restaurant_event_status,
  text, text, text, jsonb, double precision, boolean, text,
  public.restaurant_severity, boolean, text, jsonb
) is 'Atomically persists a normalized event and deterministic attention, approval, and activity records. Idempotent by organization/dedupe_key or organization/source/source_reference.';
comment on table public.restaurant_activity_log is
  'Append-only Restaurant V1 audit history. Application roles receive SELECT only; writes use vetted RPCs.';
