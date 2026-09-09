-- Ensure manager review confirmations preserve future supplier-item price history.

create or replace function public.review_supplier_invoice(
  p_organization_id uuid,
  p_invoice_id uuid,
  p_decision text
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_invoice public.restaurant_supplier_invoices%rowtype;
  v_item public.restaurant_supplier_invoice_items%rowtype;
  v_supplier_item_id uuid;
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

  if p_decision = 'reviewed' then
    if v_invoice.supplier_id is null then
      insert into public.restaurant_suppliers (
        organization_id, name, normalized_name
      ) values (
        p_organization_id, v_invoice.supplier_name, v_invoice.supplier_normalized_name
      ) on conflict (organization_id, normalized_name) do update
        set name = excluded.name
      returning id into v_invoice.supplier_id;
    end if;
    update public.restaurant_supplier_invoices
    set supplier_id = v_invoice.supplier_id,
        supplier_requires_review = false,
        supplier_match_confidence = 1
    where id = v_invoice.id;

    for v_item in
      select * from public.restaurant_supplier_invoice_items
      where invoice_id = v_invoice.id and organization_id = p_organization_id
      for update
    loop
      v_supplier_item_id := v_item.matched_supplier_item_id;
      if v_supplier_item_id is null then
        insert into public.restaurant_supplier_items (
          organization_id, supplier_id, canonical_name, normalized_name, unit
        ) values (
          p_organization_id, v_invoice.supplier_id, v_item.raw_description,
          v_item.normalized_name, v_item.unit
        ) on conflict (organization_id, supplier_id, normalized_name, unit) do update
          set canonical_name = public.restaurant_supplier_items.canonical_name
        returning id into v_supplier_item_id;
      end if;
      update public.restaurant_supplier_invoice_items
      set matched_supplier_item_id = v_supplier_item_id,
          match_confidence = 1,
          requires_review = false
      where id = v_item.id;
    end loop;
  end if;

  v_attention_status := case when p_decision = 'reviewed'
    then 'resolved'::public.restaurant_attention_status
    else 'dismissed'::public.restaurant_attention_status end;
  v_event_status := case when p_decision = 'reviewed'
    then 'handled'::public.restaurant_event_status
    else 'dismissed'::public.restaurant_event_status end;
  update public.restaurant_supplier_invoices
  set review_status = p_decision::public.supplier_invoice_review_status,
      reviewed_at = v_now, reviewed_by = auth.uid()
  where id = v_invoice.id returning * into v_invoice;
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
    case when p_decision = 'reviewed'
      then 'Manager confirmed the supplier invoice data and matches.'
      else 'Manager dismissed the supplier invoice alert.' end,
    jsonb_build_object('event_id', v_invoice.event_id, 'supplier_id', v_invoice.supplier_id)
  ) returning id into v_activity_id;
  return jsonb_build_object(
    'invoice_id', v_invoice.id, 'review_status', v_invoice.review_status,
    'supplier_id', v_invoice.supplier_id, 'event_id', v_invoice.event_id,
    'event_status', v_event_status, 'activity_id', v_activity_id
  );
end;
$$;
