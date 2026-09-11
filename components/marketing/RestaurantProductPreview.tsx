import { AlertTriangle, Building2, FileCheck2, MessageSquareWarning, ShieldCheck } from "lucide-react";
import TqMonogram from "@/components/ui/TqMonogram";

const attentionItems = [
  { title: "Supplier invoice needs review", detail: "A material price change is waiting for a manager.", icon: FileCheck2 },
  { title: "Service issue is recurring", detail: "Reputation signals show the same theme across recent feedback.", icon: MessageSquareWarning },
] as const;

export default function RestaurantProductPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className="restaurant-product-preview nexus-surface overflow-hidden rounded-[var(--nexus-radius-surface)]" aria-label="Sample TQEN Restaurant Manager Command Center interface">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--nexus-border)] px-5 py-4">
        <div className="flex items-center gap-3"><TqMonogram size={28} /><div><p className="nexus-heading text-sm font-semibold">TQEN Restaurant</p><p className="nexus-subtle mt-0.5 text-[11px]">Manager Command Center</p></div></div>
        <span className="nexus-status rounded-full px-3 py-1 text-[11px] font-medium">Sample workspace</span>
      </div>

      <div className={compact ? "p-5" : "p-5 sm:p-6"}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="nexus-subtle text-xs">Daily Manager Brief</p><h3 className="nexus-heading mt-2 font-heading text-2xl font-semibold tracking-[-0.04em]">Start with what needs attention.</h3></div>
          <div className="nexus-control flex items-center gap-2 rounded-lg px-3 py-2 text-xs nexus-copy"><Building2 aria-hidden="true" className="size-4" strokeWidth={1.5} />All branches</div>
        </div>

        <div className={`mt-5 grid gap-3 ${compact ? "" : "md:grid-cols-[1.2fr_0.8fr]"}`}>
          <div className="rounded-[var(--nexus-radius-control)] border border-[var(--nexus-border)] p-4">
            <div className="flex items-center gap-2"><AlertTriangle aria-hidden="true" className="nexus-heading size-4" strokeWidth={1.55} /><p className="nexus-heading text-sm font-medium">Needs attention</p></div>
            <div className="mt-4 space-y-3">
              {attentionItems.map(({ title, detail, icon: Icon }) => (
                <div className="grid grid-cols-[2rem_1fr] gap-3 rounded-xl bg-[var(--nexus-surface-soft)] p-3" key={title}>
                  <Icon aria-hidden="true" className="nexus-subtle mt-0.5 size-4" strokeWidth={1.5} />
                  <div><p className="nexus-heading text-xs font-medium">{title}</p><p className="nexus-subtle mt-1 text-[11px] leading-4">{detail}</p></div>
                </div>
              ))}
            </div>
          </div>

          {!compact && (
            <div className="rounded-[var(--nexus-radius-control)] border border-[var(--nexus-border)] p-4">
              <div className="flex items-center gap-2"><ShieldCheck aria-hidden="true" className="nexus-heading size-4" strokeWidth={1.55} /><p className="nexus-heading text-sm font-medium">Decision routing</p></div>
              <dl className="mt-4 grid gap-2">
                {[
                  ["AUTO", "Safe work completed"],
                  ["APPROVAL", "Manager review required"],
                  ["HUMAN", "Escalated for judgment"],
                ].map(([term, detail]) => <div className="nexus-control rounded-xl px-3 py-3" key={term}><dt className="nexus-heading text-[11px] font-semibold tracking-[0.04em]">{term}</dt><dd className="nexus-subtle mt-1 text-[11px]">{detail}</dd></div>)}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
