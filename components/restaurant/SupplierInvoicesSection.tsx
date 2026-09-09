import {
  CheckCircle2,
  ChevronDown,
  ReceiptText,
  TrendingUp,
} from "lucide-react";

import { reviewSupplierInvoiceAction } from "@/app/restaurant/actions";
import RestaurantInvoiceUpload from "@/components/RestaurantInvoiceUpload";
import RestaurantSubmitButton from "@/components/RestaurantSubmitButton";
import {
  branchLabel,
  EmptyState,
  formatMoney,
  humanize,
  priorityStyles,
  type CommandCenterData,
} from "@/components/restaurant/command-center-presentation";

export default function SupplierInvoicesSection({
  canManage,
  data,
}: {
  canManage: boolean;
  data: CommandCenterData;
}) {
  const { organization } = data;

  return (
    <section
      aria-labelledby="supplier-invoices-heading"
      className="nexus-card mt-7 rounded-[var(--nexus-radius-surface)] p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">Supplier-cost intelligence</p>
          <h2 className="mt-1.5 text-lg font-semibold tracking-[-0.025em] text-white light:text-zinc-950" id="supplier-invoices-heading">Recent supplier invoices</h2>
          <p className="mt-1 text-xs text-zinc-500">Private files · Deterministic matching and price comparisons</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/[0.09] px-3 py-1.5 text-xs text-zinc-400 light:border-black/[0.1] light:text-zinc-600">
          <ReceiptText aria-hidden="true" className="size-3.5" />
          {data.invoices.length} invoices
        </div>
      </div>

      {canManage ? (
        <RestaurantInvoiceUpload
          branches={data.branches.map((branch) => ({ id: branch.id, name: branch.name }))}
          organizationId={organization.id}
          selectedBranchId={data.selectedBranchId}
        />
      ) : (
        <p className="mt-4 rounded-xl border border-white/[0.08] p-3 text-xs text-zinc-500 light:border-black/[0.09]">Managers can upload and review supplier invoices.</p>
      )}

      <div className="mt-4 space-y-3">
        {data.invoices.length ? data.invoices.map((invoice) => {
          const items = data.invoiceItems.filter((item) => item.invoice_id === invoice.id);
          const flaggedItems = items.filter((item) => item.requires_review || item.anomalies.length > 0);
          const materialChanges = items.filter((item) => item.anomalies.includes("price_increase"));
          const hasStoredSource = !invoice.storage_path.includes("/dev-seed/");
          return (
            <details className="group rounded-2xl border border-white/[0.085] bg-white/[0.025] p-4 open:bg-white/[0.04] light:border-black/[0.09] light:bg-black/[0.018]" key={invoice.id}>
              <summary className="nexus-focus -m-1 flex cursor-pointer list-none flex-col justify-between gap-3 rounded-lg p-1 [&::-webkit-details-marker]:hidden sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.09em] ${invoice.review_status === "pending" ? priorityStyles.medium : "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300 light:text-emerald-700"}`}>{humanize(invoice.review_status)}</span>
                    <span className="text-[11px] text-zinc-500">{branchLabel(data.branches, invoice.branch_id)}</span>
                    {flaggedItems.length + invoice.anomalies.length > 0 ? <span className="text-[11px] text-orange-300 light:text-orange-700">{flaggedItems.length + invoice.anomalies.length} flags</span> : null}
                  </div>
                  <h3 className="mt-2.5 font-medium text-zinc-100 light:text-zinc-900">{invoice.supplier_name}</h3>
                  <p className="mt-1 text-xs text-zinc-500">Invoice {invoice.invoice_number ?? "without reference"} · {invoice.invoice_date}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-white light:text-zinc-950">{formatMoney(invoice.total, invoice.currency, organization.default_locale)}</p>
                    <p className="mt-1 text-[10px] text-zinc-500">Confidence {Math.round(invoice.confidence * 100)}%</p>
                  </div>
                  <ChevronDown aria-hidden="true" className="size-4 text-zinc-500 transition-transform group-open:rotate-180" />
                </div>
              </summary>

              <div className="mt-4 border-t border-white/[0.07] pt-4 light:border-black/[0.08]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {[...new Set([...invoice.anomalies, ...items.flatMap((item) => item.anomalies)])].map((anomaly) => (
                      <span className="rounded-md border border-orange-400/15 bg-orange-400/[0.06] px-2 py-1 text-[10px] text-orange-300 light:text-orange-700" key={anomaly}>{humanize(anomaly)}</span>
                    ))}
                    {!invoice.anomalies.length && !flaggedItems.length ? <span className="text-xs text-emerald-300 light:text-emerald-700">No material anomalies detected</span> : null}
                  </div>
                  {hasStoredSource ? (
                    <a className="nexus-focus rounded-lg text-xs font-medium text-violet-300 hover:text-violet-200 light:text-violet-700" href={`/restaurant/invoices/${invoice.id}/file`} rel="noreferrer" target="_blank">Open private source file</a>
                  ) : (
                    <span className="text-[10px] text-zinc-600">DEV fixture metadata · no source binary</span>
                  )}
                </div>

                <div className="mt-4 overflow-x-auto rounded-xl border border-white/[0.08] light:border-black/[0.09]">
                  <table className="w-full min-w-[760px] text-left text-xs">
                    <thead className="bg-black/15 text-[10px] uppercase tracking-[0.1em] text-zinc-500 light:bg-black/[0.025]">
                      <tr><th className="px-3 py-2.5">Item</th><th className="px-3 py-2.5">Quantity</th><th className="px-3 py-2.5">Current</th><th className="px-3 py-2.5">Previous</th><th className="px-3 py-2.5">Change</th><th className="px-3 py-2.5">Match</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.07] light:divide-black/[0.08]">
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-3 py-3"><p className="font-medium text-zinc-200 light:text-zinc-800">{item.raw_description}</p><p className="mt-1 text-[10px] text-zinc-600">Line {formatMoney(item.line_total, invoice.currency, organization.default_locale)}</p></td>
                          <td className="px-3 py-3 text-zinc-400">{item.quantity} {item.unit}</td>
                          <td className="px-3 py-3 text-zinc-300 light:text-zinc-700">{formatMoney(item.unit_price, invoice.currency, organization.default_locale)}/{item.unit}</td>
                          <td className="px-3 py-3 text-zinc-500">{item.previous_unit_price === null ? "First price" : `${formatMoney(item.previous_unit_price, invoice.currency, organization.default_locale)}/${item.unit}`}</td>
                          <td className={`px-3 py-3 ${item.percentage_change && item.percentage_change > 0 ? "text-orange-300 light:text-orange-700" : "text-zinc-500"}`}>{item.percentage_change === null ? "—" : `${item.percentage_change > 0 ? "+" : ""}${item.percentage_change.toFixed(1)}%`}</td>
                          <td className="px-3 py-3 text-zinc-500">{item.requires_review ? "Needs review" : item.matched_supplier_item_id ? "Matched" : "New item"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {materialChanges.length ? <p className="mt-3 flex items-center gap-2 text-xs text-orange-300 light:text-orange-700"><TrendingUp aria-hidden="true" className="size-3.5" />{materialChanges.length} material price {materialChanges.length === 1 ? "increase" : "increases"} detected.</p> : null}
                {invoice.review_status === "pending" && canManage ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <form action={reviewSupplierInvoiceAction}>
                      <input name="organizationId" type="hidden" value={organization.id} />
                      <input name="invoiceId" type="hidden" value={invoice.id} />
                      <input name="decision" type="hidden" value="reviewed" />
                      <RestaurantSubmitButton className="border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300 hover:bg-emerald-400/[0.14] light:text-emerald-700" pendingLabel="Confirming review…"><CheckCircle2 aria-hidden="true" className="mr-1.5 size-3.5" />Confirm data and matches</RestaurantSubmitButton>
                    </form>
                    <form action={reviewSupplierInvoiceAction}>
                      <input name="organizationId" type="hidden" value={organization.id} />
                      <input name="invoiceId" type="hidden" value={invoice.id} />
                      <input name="decision" type="hidden" value="dismissed" />
                      <RestaurantSubmitButton pendingLabel="Dismissing alert…">Dismiss false positive</RestaurantSubmitButton>
                    </form>
                  </div>
                ) : null}
              </div>
            </details>
          );
        }) : <EmptyState>No supplier invoices recorded for this view.</EmptyState>}
      </div>
    </section>
  );
}
