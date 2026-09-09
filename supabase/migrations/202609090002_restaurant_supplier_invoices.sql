-- Nexus Restaurant V1 Phase 2.3: supplier invoice and cost intelligence.
-- Files remain private; extraction is provider-neutral and all persistence is transactional.

create type public.supplier_invoice_extraction_status as enum ('processed', 'failed');
create type public.supplier_invoice_review_status as enum ('pending', 'reviewed', 'dismissed');
create type public.supplier_invoice_source_type as enum ('manual_upload', 'provider_import');

create table public.restaurant_suppliers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.restaurant_organizations(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 2 and 160),
  normalized_name text not null check (char_length(btrim(normalized_name)) between 2 and 160),
  tax_identifier text check (tax_identifier is null or char_length(btrim(tax_identifier)) between 2 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint restaurant_suppliers_id_organization_key unique (id, organization_id),
  constraint restaurant_suppliers_normalized_key unique (organization_id, normalized_name)
);

create table public.restaurant_supplier_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.restaurant_organizations(id) on delete cascade,
  supplier_id uuid not null,
  canonical_name text not null check (char_length(btrim(canonical_name)) between 1 and 500),
  normalized_name text not null check (char_length(btrim(normalized_name)) between 1 and 500),
  unit text not null check (unit in ('kg', 'g', 'l', 'ml', 'unit', 'box', 'case', 'pack')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint restaurant_supplier_items_id_organization_key unique (id, organization_id),
  constraint restaurant_supplier_items_supplier_fk
    foreign key (supplier_id, organization_id)
    references public.restaurant_suppliers(id, organization_id) on delete cascade,
  constraint restaurant_supplier_items_normalized_key
    unique (organization_id, supplier_id, normalized_name, unit)
);

create table public.restaurant_supplier_invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.restaurant_organizations(id) on delete cascade,
  branch_id uuid,
  supplier_id uuid,
  event_id uuid not null,
  supplier_name text not null check (char_length(btrim(supplier_name)) between 2 and 160),
  supplier_normalized_name text not null check (char_length(btrim(supplier_normalized_name)) between 2 and 160),
  invoice_number text check (invoice_number is null or char_length(btrim(invoice_number)) between 1 and 120),
  invoice_date date not null,
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  subtotal numeric(14,4) check (subtotal is null or subtotal >= 0),
  tax_total numeric(14,4) check (tax_total is null or tax_total >= 0),
  total numeric(14,4) not null check (total > 0),
  extraction_status public.supplier_invoice_extraction_status not null default 'processed',
  review_status public.supplier_invoice_review_status not null,
  source_type public.supplier_invoice_source_type not null,
  extractor text not null check (extractor ~ '^[a-z][a-z0-9_]{0,79}$'),
  original_filename text not null check (char_length(btrim(original_filename)) between 1 and 255),
  storage_path text not null check (char_length(btrim(storage_path)) between 1 and 1024),
  file_hash text not null check (file_hash ~ '^[a-f0-9]{64}$'),
  raw_extraction jsonb not null default '{}'::jsonb check (
    jsonb_typeof(raw_extraction) = 'object' and octet_length(raw_extraction::text) <= 65536
  ),
  confidence double precision not null check (confidence between 0 and 1),
  supplier_match_confidence double precision not null check (supplier_match_confidence between 0 and 1),
  supplier_requires_review boolean not null default false,
  anomalies text[] not null default '{}' check (
    cardinality(anomalies) <= 30 and array_position(anomalies, null) is null
  ),
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint restaurant_supplier_invoices_id_organization_key unique (id, organization_id),
  constraint restaurant_supplier_invoices_event_key unique (event_id),
  constraint restaurant_supplier_invoices_file_key unique (organization_id, file_hash),
  constraint restaurant_supplier_invoices_branch_fk
    foreign key (branch_id, organization_id)
    references public.restaurant_branches(id, organization_id) on delete restrict,
  constraint restaurant_supplier_invoices_supplier_fk
    foreign key (supplier_id, organization_id)
    references public.restaurant_suppliers(id, organization_id) on delete restrict,
  constraint restaurant_supplier_invoices_event_fk
    foreign key (event_id, organization_id)
    references public.restaurant_events(id, organization_id) on delete restrict,
  constraint restaurant_supplier_invoices_reviewer_fk
    foreign key (reviewed_by, organization_id)
    references public.restaurant_members(user_id, organization_id) on delete restrict,
  constraint restaurant_supplier_invoices_review_state_check check (
    (review_status = 'pending' and reviewed_at is null and reviewed_by is null)
    or (review_status in ('reviewed', 'dismissed') and reviewed_at is not null and reviewed_by is not null)
  )
);

create unique index restaurant_supplier_invoices_reference_key
  on public.restaurant_supplier_invoices (organization_id, supplier_id, invoice_number)
  where supplier_id is not null and invoice_number is not null;
create index restaurant_supplier_invoices_recent_idx
  on public.restaurant_supplier_invoices (organization_id, invoice_date desc, created_at desc);
create index restaurant_supplier_invoices_branch_recent_idx
  on public.restaurant_supplier_invoices (organization_id, branch_id, invoice_date desc);

create table public.restaurant_supplier_invoice_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.restaurant_organizations(id) on delete cascade,
  invoice_id uuid not null,
  matched_supplier_item_id uuid,
  raw_description text not null check (char_length(btrim(raw_description)) between 1 and 500),
  normalized_name text not null check (char_length(btrim(normalized_name)) between 1 and 500),
  quantity numeric(14,4) not null check (quantity > 0),
  unit text not null check (unit in ('kg', 'g', 'l', 'ml', 'unit', 'box', 'case', 'pack')),
  unit_price numeric(14,4) not null check (unit_price >= 0),
  line_total numeric(14,4) not null check (line_total >= 0),
  extraction_confidence double precision not null check (extraction_confidence between 0 and 1),
  match_confidence double precision not null check (match_confidence between 0 and 1),
  requires_review boolean not null default false,
  previous_unit_price numeric(14,4) check (previous_unit_price is null or previous_unit_price >= 0),
  absolute_change numeric(14,4),
  percentage_change numeric(12,4),
  anomalies text[] not null default '{}' check (
    cardinality(anomalies) <= 20 and array_position(anomalies, null) is null
  ),
  created_at timestamptz not null default now(),
  constraint restaurant_supplier_invoice_items_id_organization_key unique (id, organization_id),
  constraint restaurant_supplier_invoice_items_invoice_fk
    foreign key (invoice_id, organization_id)
    references public.restaurant_supplier_invoices(id, organization_id) on delete cascade,
  constraint restaurant_supplier_invoice_items_supplier_item_fk
    foreign key (matched_supplier_item_id, organization_id)
    references public.restaurant_supplier_items(id, organization_id) on delete restrict
);

create index restaurant_supplier_invoice_items_invoice_idx
  on public.restaurant_supplier_invoice_items (invoice_id);
create index restaurant_supplier_invoice_items_history_idx
  on public.restaurant_supplier_invoice_items (organization_id, matched_supplier_item_id, created_at desc)
  where matched_supplier_item_id is not null;

create trigger restaurant_suppliers_set_updated_at before update on public.restaurant_suppliers
for each row execute function public.set_restaurant_updated_at();
create trigger restaurant_supplier_items_set_updated_at before update on public.restaurant_supplier_items
for each row execute function public.set_restaurant_updated_at();
create trigger restaurant_supplier_invoices_set_updated_at before update on public.restaurant_supplier_invoices
for each row execute function public.set_restaurant_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'restaurant-supplier-invoices', 'restaurant-supplier-invoices', false, 10485760,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

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
        'sentiment', 'topics', 'provider', 'trend_count', 'rolling_days',
        'invoice_id', 'supplier_id', 'anomaly_count',
        'material_price_change_count', 'currency', 'invoice_total'
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
      and (p_data->>'review_id') ~ '^[0-9a-fA-F-]{36}$'
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
    ))
    and (not p_data ? 'invoice_id' or (
      jsonb_typeof(p_data->'invoice_id') = 'string'
      and (p_data->>'invoice_id') ~ '^[0-9a-fA-F-]{36}$'
    ))
    and (not p_data ? 'supplier_id' or (
      jsonb_typeof(p_data->'supplier_id') = 'string'
      and (p_data->>'supplier_id') ~ '^[0-9a-fA-F-]{36}$'
    ))
    and (not p_data ? 'anomaly_count' or (
      jsonb_typeof(p_data->'anomaly_count') = 'number'
      and (p_data->>'anomaly_count')::numeric between 0 and 1000
      and trunc((p_data->>'anomaly_count')::numeric) = (p_data->>'anomaly_count')::numeric
    ))
    and (not p_data ? 'material_price_change_count' or (
      jsonb_typeof(p_data->'material_price_change_count') = 'number'
      and (p_data->>'material_price_change_count')::numeric between 0 and 1000
      and trunc((p_data->>'material_price_change_count')::numeric) = (p_data->>'material_price_change_count')::numeric
    ))
    and (not p_data ? 'currency' or (
      jsonb_typeof(p_data->'currency') = 'string' and p_data->>'currency' ~ '^[A-Z]{3}$'
    ))
    and (not p_data ? 'invoice_total' or (
      jsonb_typeof(p_data->'invoice_total') = 'number'
      and (p_data->>'invoice_total')::numeric > 0
      and (p_data->>'invoice_total')::numeric <= 100000000
    )),
    false
  );
$$;

alter table public.restaurant_suppliers enable row level security;
alter table public.restaurant_supplier_items enable row level security;
alter table public.restaurant_supplier_invoices enable row level security;
alter table public.restaurant_supplier_invoice_items enable row level security;

create policy restaurant_suppliers_select_member on public.restaurant_suppliers
for select to authenticated using (public.is_restaurant_member(organization_id));
create policy restaurant_supplier_items_select_member on public.restaurant_supplier_items
for select to authenticated using (public.is_restaurant_member(organization_id));
create policy restaurant_supplier_invoices_select_member on public.restaurant_supplier_invoices
for select to authenticated using (public.is_restaurant_member(organization_id));
create policy restaurant_supplier_invoice_items_select_member on public.restaurant_supplier_invoice_items
for select to authenticated using (public.is_restaurant_member(organization_id));

create function public.ingest_supplier_invoice(
  p_actor_id uuid,
  p_organization_id uuid,
  p_branch_id uuid,
  p_invoice jsonb,
  p_items jsonb
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_invoice public.restaurant_supplier_invoices%rowtype;
  v_invoice_id uuid := gen_random_uuid();
  v_supplier_id uuid;
  v_supplier_item_id uuid;
  v_event_result jsonb;
  v_item jsonb;
  v_item_anomalies text[];
  v_invoice_anomalies text[];
  v_requires_review boolean;
  v_material_changes integer := 0;
  v_severity public.restaurant_severity;
  v_title text;
  v_summary text;
  v_structured_data jsonb;
begin
  perform public.assert_restaurant_service_role();
  if p_actor_id is null or not exists (
    select 1 from public.restaurant_members
    where organization_id = p_organization_id and user_id = p_actor_id
  ) then
    raise exception using errcode = '42501', message = 'The invoice ingestion actor is not a restaurant member.';
  end if;
  perform public.assert_restaurant_branch(p_organization_id, p_branch_id);
  if jsonb_typeof(p_invoice) <> 'object' or jsonb_typeof(p_items) <> 'array'
    or jsonb_array_length(p_items) not between 1 and 250
    or coalesce(p_invoice->>'supplier_name', '') = ''
    or coalesce(p_invoice->>'supplier_normalized_name', '') = ''
    or coalesce(p_invoice->>'invoice_date', '') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    or coalesce(p_invoice->>'currency', '') !~ '^[A-Z]{3}$'
    or coalesce((p_invoice->>'total')::numeric, 0) <= 0
    or coalesce(p_invoice->>'source_type', '') not in ('manual_upload', 'provider_import')
    or coalesce(p_invoice->>'extractor', '') !~ '^[a-z][a-z0-9_]{0,79}$'
    or coalesce(p_invoice->>'file_hash', '') !~ '^[a-f0-9]{64}$'
    or coalesce(p_invoice->>'storage_path', '') = ''
    or coalesce(p_invoice->>'original_filename', '') = ''
    or (p_invoice->>'confidence')::double precision not between 0 and 1
    or (p_invoice->>'supplier_match_confidence')::double precision not between 0 and 1
    or jsonb_typeof(coalesce(p_invoice->'raw_extraction', '{}'::jsonb)) <> 'object'
    or jsonb_typeof(coalesce(p_invoice->'anomalies', '[]'::jsonb)) <> 'array'
  then
    raise exception using errcode = '22023', message = 'The normalized supplier invoice is invalid.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(
    p_organization_id::text || ':supplier-invoice:' || (p_invoice->>'file_hash'), 0
  ));
  select * into v_invoice from public.restaurant_supplier_invoices
  where organization_id = p_organization_id and file_hash = p_invoice->>'file_hash';
  if v_invoice.id is not null then
    return jsonb_build_object(
      'invoice_id', v_invoice.id, 'event_id', v_invoice.event_id,
      'attention_item_id', (select id from public.manager_attention_items where event_id = v_invoice.event_id),
      'supplier_id', v_invoice.supplier_id, 'created', false
    );
  end if;

  v_supplier_id := nullif(p_invoice->>'supplier_id', '')::uuid;
  if v_supplier_id is not null and not exists (
    select 1 from public.restaurant_suppliers
    where id = v_supplier_id and organization_id = p_organization_id
  ) then
    raise exception using errcode = '23503', message = 'The matched supplier is outside this restaurant organization.';
  end if;
  if v_supplier_id is null and not (p_invoice->>'supplier_requires_review')::boolean then
    insert into public.restaurant_suppliers (
      organization_id, name, normalized_name, tax_identifier
    ) values (
      p_organization_id, btrim(p_invoice->>'supplier_name'),
      btrim(p_invoice->>'supplier_normalized_name'), nullif(btrim(p_invoice->>'tax_identifier'), '')
    ) on conflict (organization_id, normalized_name) do update
      set name = excluded.name,
          tax_identifier = coalesce(public.restaurant_suppliers.tax_identifier, excluded.tax_identifier)
    returning id into v_supplier_id;
  end if;

  if v_supplier_id is not null and nullif(btrim(p_invoice->>'invoice_number'), '') is not null
    and exists (
      select 1 from public.restaurant_supplier_invoices
      where organization_id = p_organization_id and supplier_id = v_supplier_id
        and invoice_number = nullif(btrim(p_invoice->>'invoice_number'), '')
    )
  then
    raise exception using errcode = '23505', message = 'This supplier invoice number already exists.';
  end if;

  select coalesce(array_agg(value), '{}') into v_invoice_anomalies
  from jsonb_array_elements_text(coalesce(p_invoice->'anomalies', '[]'::jsonb));
  v_requires_review := (p_invoice->>'supplier_requires_review')::boolean
    or cardinality(v_invoice_anomalies) > 0;
  for v_item in select value from jsonb_array_elements(p_items) loop
    if jsonb_typeof(v_item) <> 'object'
      or coalesce(v_item->>'raw_description', '') = ''
      or coalesce(v_item->>'normalized_name', '') = ''
      or coalesce(v_item->>'unit', '') not in ('kg', 'g', 'l', 'ml', 'unit', 'box', 'case', 'pack')
      or coalesce((v_item->>'quantity')::numeric, 0) <= 0
      or coalesce((v_item->>'unit_price')::numeric, -1) < 0
      or coalesce((v_item->>'line_total')::numeric, -1) < 0
      or (v_item->>'extraction_confidence')::double precision not between 0 and 1
      or (v_item->>'match_confidence')::double precision not between 0 and 1
      or jsonb_typeof(coalesce(v_item->'anomalies', '[]'::jsonb)) <> 'array'
    then
      raise exception using errcode = '22023', message = 'A normalized supplier invoice item is invalid.';
    end if;
    v_requires_review := v_requires_review or (v_item->>'requires_review')::boolean
      or jsonb_array_length(coalesce(v_item->'anomalies', '[]'::jsonb)) > 0;
    if coalesce(v_item->>'percentage_change', '') <> ''
      and abs((v_item->>'percentage_change')::numeric) >= 10
      and coalesce(v_item->>'anomaly', '') in ('price_increase', 'suspicious_price_decrease')
    then
      v_material_changes := v_material_changes + 1;
    end if;
  end loop;

  v_severity := case
    when exists (
      select 1 from jsonb_array_elements(p_items) item
      where item->>'severity' = 'high'
    ) then 'high'::public.restaurant_severity
    when v_requires_review then 'medium'::public.restaurant_severity
    else 'low'::public.restaurant_severity
  end;
  v_title := case when v_requires_review then 'Supplier invoice needs review' else 'Supplier invoice processed' end;
  v_summary := btrim(p_invoice->>'supplier_name') || ' invoice '
    || coalesce(nullif(btrim(p_invoice->>'invoice_number'), ''), '(no reference)')
    || ' totals ' || (p_invoice->>'total') || ' ' || (p_invoice->>'currency') || '.';
  v_structured_data := jsonb_build_object(
    'invoice_id', v_invoice_id,
    'anomaly_count', cardinality(v_invoice_anomalies),
    'material_price_change_count', v_material_changes,
    'currency', p_invoice->>'currency',
    'invoice_total', (p_invoice->>'total')::numeric
  );
  if v_supplier_id is not null then
    v_structured_data := v_structured_data || jsonb_build_object('supplier_id', v_supplier_id);
  end if;
  v_event_result := public.ingest_restaurant_event(
    p_actor_id, p_organization_id, p_branch_id, (p_invoice->>'invoice_date')::date::timestamptz,
    'supplier_invoice',
    case when v_requires_review then 'supplier_invoice_anomaly' else 'supplier_invoice_processed' end,
    'operations', v_title, v_summary, v_severity,
    case when v_requires_review then 'human'::public.restaurant_handling_mode else 'auto'::public.restaurant_handling_mode end,
    case when v_requires_review then 'escalated'::public.restaurant_event_status else 'handled'::public.restaurant_event_status end,
    p_invoice->>'file_hash', 'supplier_invoice', v_invoice_id::text,
    v_structured_data, (p_invoice->>'confidence')::double precision, v_requires_review,
    'supplier_invoice:' || (p_invoice->>'file_hash'),
    case when v_requires_review then v_severity else null end,
    false, null, '{}'::jsonb
  );

  insert into public.restaurant_supplier_invoices (
    id, organization_id, branch_id, supplier_id, event_id, supplier_name,
    supplier_normalized_name, invoice_number, invoice_date, currency, subtotal,
    tax_total, total, review_status, source_type, extractor, original_filename,
    storage_path, file_hash, raw_extraction, confidence, supplier_match_confidence,
    supplier_requires_review, anomalies, reviewed_at, reviewed_by
  ) values (
    v_invoice_id, p_organization_id, p_branch_id, v_supplier_id,
    (v_event_result->>'event_id')::uuid, btrim(p_invoice->>'supplier_name'),
    btrim(p_invoice->>'supplier_normalized_name'), nullif(btrim(p_invoice->>'invoice_number'), ''),
    (p_invoice->>'invoice_date')::date, p_invoice->>'currency',
    nullif(p_invoice->>'subtotal', '')::numeric, nullif(p_invoice->>'tax_total', '')::numeric,
    (p_invoice->>'total')::numeric,
    case when v_requires_review then 'pending'::public.supplier_invoice_review_status else 'reviewed'::public.supplier_invoice_review_status end,
    (p_invoice->>'source_type')::public.supplier_invoice_source_type,
    p_invoice->>'extractor', btrim(p_invoice->>'original_filename'), p_invoice->>'storage_path',
    p_invoice->>'file_hash', coalesce(p_invoice->'raw_extraction', '{}'::jsonb),
    (p_invoice->>'confidence')::double precision,
    (p_invoice->>'supplier_match_confidence')::double precision,
    (p_invoice->>'supplier_requires_review')::boolean, v_invoice_anomalies,
    case when v_requires_review then null else clock_timestamp() end,
    case when v_requires_review then null else p_actor_id end
  ) returning * into v_invoice;

  for v_item in select value from jsonb_array_elements(p_items) loop
    v_supplier_item_id := nullif(v_item->>'matched_supplier_item_id', '')::uuid;
    if v_supplier_item_id is not null and not exists (
      select 1 from public.restaurant_supplier_items
      where id = v_supplier_item_id and organization_id = p_organization_id
        and supplier_id = v_supplier_id
    ) then
      raise exception using errcode = '23503', message = 'The matched supplier item is invalid.';
    end if;
    if v_supplier_item_id is null and v_supplier_id is not null
      and not (v_item->>'requires_review')::boolean
    then
      insert into public.restaurant_supplier_items (
        organization_id, supplier_id, canonical_name, normalized_name, unit
      ) values (
        p_organization_id, v_supplier_id, btrim(v_item->>'raw_description'),
        btrim(v_item->>'normalized_name'), v_item->>'unit'
      ) on conflict (organization_id, supplier_id, normalized_name, unit) do update
        set canonical_name = public.restaurant_supplier_items.canonical_name
      returning id into v_supplier_item_id;
    end if;
    select coalesce(array_agg(value), '{}') into v_item_anomalies
    from jsonb_array_elements_text(coalesce(v_item->'anomalies', '[]'::jsonb));
    insert into public.restaurant_supplier_invoice_items (
      organization_id, invoice_id, matched_supplier_item_id, raw_description,
      normalized_name, quantity, unit, unit_price, line_total,
      extraction_confidence, match_confidence, requires_review,
      previous_unit_price, absolute_change, percentage_change, anomalies
    ) values (
      p_organization_id, v_invoice.id, v_supplier_item_id,
      btrim(v_item->>'raw_description'), btrim(v_item->>'normalized_name'),
      (v_item->>'quantity')::numeric, v_item->>'unit', (v_item->>'unit_price')::numeric,
      (v_item->>'line_total')::numeric, (v_item->>'extraction_confidence')::double precision,
      (v_item->>'match_confidence')::double precision, (v_item->>'requires_review')::boolean,
      nullif(v_item->>'previous_unit_price', '')::numeric,
      nullif(v_item->>'absolute_change', '')::numeric,
      nullif(v_item->>'percentage_change', '')::numeric, v_item_anomalies
    );
  end loop;

  return v_event_result || jsonb_build_object(
    'invoice_id', v_invoice.id, 'supplier_id', v_invoice.supplier_id,
    'review_status', v_invoice.review_status
  );
end;
$$;

create function public.review_supplier_invoice(
  p_organization_id uuid,
  p_invoice_id uuid,
  p_decision text
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_invoice public.restaurant_supplier_invoices%rowtype;
  v_attention_status public.restaurant_attention_status;
  v_event_status public.restaurant_event_status;
  v_activity_id uuid;
  v_now timestamptz := clock_timestamp();
begin
  perform public.assert_restaurant_role(
    p_organization_id, array['owner', 'manager']::public.restaurant_member_role[]
  );
  if p_decision not in ('reviewed', 'dismissed') then
    raise exception using errcode = '22023', message = 'Invoice review decision is invalid.';
  end if;
  select * into v_invoice from public.restaurant_supplier_invoices
  where id = p_invoice_id and organization_id = p_organization_id for update;
  if v_invoice.id is null then
    raise exception using errcode = 'P0002', message = 'Supplier invoice was not found.';
  end if;
  if v_invoice.review_status <> 'pending' then
    raise exception using errcode = '55000', message = 'The supplier invoice review is stale.';
  end if;
  v_attention_status := case when p_decision = 'reviewed' then 'resolved'::public.restaurant_attention_status else 'dismissed'::public.restaurant_attention_status end;
  v_event_status := case when p_decision = 'reviewed' then 'handled'::public.restaurant_event_status else 'dismissed'::public.restaurant_event_status end;
  update public.restaurant_supplier_invoices
  set review_status = p_decision::public.supplier_invoice_review_status,
      reviewed_at = v_now, reviewed_by = auth.uid()
  where id = v_invoice.id returning * into v_invoice;
  update public.restaurant_supplier_invoice_items
  set requires_review = false
  where invoice_id = v_invoice.id and organization_id = p_organization_id;
  update public.manager_attention_items
  set status = v_attention_status, resolved_at = v_now
  where event_id = v_invoice.event_id and organization_id = p_organization_id
    and status in ('open', 'assigned');
  update public.restaurant_events set status = v_event_status
  where id = v_invoice.event_id and organization_id = p_organization_id
    and status = 'escalated';
  insert into public.restaurant_activity_log (
    organization_id, branch_id, actor_type, actor_id, action, entity_type,
    entity_id, description, metadata
  ) values (
    p_organization_id, v_invoice.branch_id, 'user', auth.uid(),
    'supplier_invoice_' || p_decision, 'supplier_invoice', v_invoice.id,
    case when p_decision = 'reviewed' then 'Manager reviewed the supplier invoice.'
      else 'Manager dismissed the supplier invoice alert.' end,
    jsonb_build_object('event_id', v_invoice.event_id)
  ) returning id into v_activity_id;
  return jsonb_build_object(
    'invoice_id', v_invoice.id, 'review_status', v_invoice.review_status,
    'event_id', v_invoice.event_id, 'event_status', v_event_status,
    'activity_id', v_activity_id
  );
end;
$$;

revoke all on function public.ingest_supplier_invoice(uuid, uuid, uuid, jsonb, jsonb)
  from public, anon, authenticated, service_role;
grant execute on function public.ingest_supplier_invoice(uuid, uuid, uuid, jsonb, jsonb)
  to service_role;
revoke all on function public.review_supplier_invoice(uuid, uuid, text)
  from public, anon, authenticated, service_role;
grant execute on function public.review_supplier_invoice(uuid, uuid, text)
  to authenticated;

revoke insert, update, delete, truncate, references, trigger
  on public.restaurant_suppliers, public.restaurant_supplier_items,
  public.restaurant_supplier_invoices, public.restaurant_supplier_invoice_items
  from anon, authenticated;
grant select on public.restaurant_suppliers, public.restaurant_supplier_items,
  public.restaurant_supplier_invoices, public.restaurant_supplier_invoice_items
  to authenticated;
