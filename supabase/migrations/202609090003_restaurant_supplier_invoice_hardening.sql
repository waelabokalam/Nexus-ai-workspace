-- Phase 2.3 post-verification hardening from Supabase database advisors.

-- Trigger helpers are not application RPCs and must not be externally executable.
revoke all on function public.sync_restaurant_review_response()
  from public, anon, authenticated, service_role;

-- Cover the composite foreign-key access paths used by organization-scoped cleanup
-- and referential checks. Existing read-path indexes remain in place.
create index restaurant_supplier_items_supplier_fk_idx
  on public.restaurant_supplier_items (supplier_id, organization_id);
create index restaurant_supplier_invoices_branch_fk_idx
  on public.restaurant_supplier_invoices (branch_id, organization_id)
  where branch_id is not null;
create index restaurant_supplier_invoices_supplier_fk_idx
  on public.restaurant_supplier_invoices (supplier_id, organization_id)
  where supplier_id is not null;
create index restaurant_supplier_invoices_event_fk_idx
  on public.restaurant_supplier_invoices (event_id, organization_id);
create index restaurant_supplier_invoices_reviewer_fk_idx
  on public.restaurant_supplier_invoices (reviewed_by, organization_id)
  where reviewed_by is not null;
create index restaurant_supplier_invoice_items_invoice_fk_idx
  on public.restaurant_supplier_invoice_items (invoice_id, organization_id);
create index restaurant_supplier_invoice_items_supplier_item_fk_idx
  on public.restaurant_supplier_invoice_items (matched_supplier_item_id, organization_id)
  where matched_supplier_item_id is not null;
