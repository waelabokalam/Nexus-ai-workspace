import { belongsToBranch } from "@/lib/restaurant/summary";
import type {
  RestaurantSupplierInvoiceItemRow,
  RestaurantSupplierInvoiceRow,
} from "@/lib/supabase/database.types";

export type SupplierInvoiceBriefFacts = {
  supplierInvoiceReviewCount: number;
  supplierInvoiceMismatchCount: number;
  materialSupplierIncreaseCount: number;
  supplierInvoiceEventIds: ReadonlySet<string>;
};

export function getSupplierInvoiceBriefFacts(input: {
  invoices: RestaurantSupplierInvoiceRow[];
  invoiceItems: RestaurantSupplierInvoiceItemRow[];
  startsAt: string;
  endsAt: string;
  branchId?: string | null;
}): SupplierInvoiceBriefFacts {
  const start = Date.parse(input.startsAt);
  const end = Date.parse(input.endsAt);
  const invoices = input.invoices.filter((invoice) =>
    belongsToBranch(invoice, input.branchId),
  );
  const pendingInvoices = invoices.filter(
    (invoice) => invoice.review_status === "pending",
  );
  const invoiceIdsProcessedToday = new Set(
    invoices
      .filter((invoice) => {
        const createdAt = Date.parse(invoice.created_at);
        return createdAt >= start && createdAt < end;
      })
      .map((invoice) => invoice.id),
  );

  return {
    supplierInvoiceReviewCount: pendingInvoices.length,
    supplierInvoiceMismatchCount: pendingInvoices.filter((invoice) =>
      invoice.anomalies.includes("invoice_total_mismatch"),
    ).length,
    materialSupplierIncreaseCount: input.invoiceItems.filter(
      (item) =>
        invoiceIdsProcessedToday.has(item.invoice_id) &&
        item.anomalies.includes("price_increase") &&
        (item.percentage_change ?? 0) >= 10,
    ).length,
    supplierInvoiceEventIds: new Set(invoices.map((invoice) => invoice.event_id)),
  };
}
