const customerJourney = [
  "Discover the offering",
  "Select a plan or product",
  "Provide delivery details",
  "Submit a request",
] as const;

const businessWorkflow = [
  "Receive the request",
  "Review customer context",
  "Manage the workflow",
  "Continue communication",
] as const;

export default function CraveItSystemMap({ className = "" }: { className?: string }) {
  return (
    <div className={`nexus-frame rounded-[var(--nexus-radius-surface)] p-1 ${className}`}>
      <div className="nexus-surface overflow-hidden rounded-[calc(var(--nexus-radius-surface)-0.3rem)]">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--nexus-border)] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="nexus-control grid size-8 place-items-center rounded-lg text-xs font-semibold text-[var(--nexus-text)]">C</span>
            <div>
              <p className="nexus-heading text-sm font-semibold">Crave It</p>
              <p className="nexus-subtle text-[10px] uppercase tracking-[0.12em]">Product system map</p>
            </div>
          </div>
          <span className="nexus-status rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em]">Built by Nexus</span>
        </div>

        <div className="grid gap-px bg-[var(--nexus-border)] lg:grid-cols-2">
          <section className="bg-[var(--nexus-surface)] p-5 sm:p-6">
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.15em]">Customer experience</p>
            <ol className="mt-5 space-y-3">
              {customerJourney.map((step, index) => (
                <li className="nexus-control flex min-h-12 items-center gap-3 rounded-xl px-3.5 py-3" key={step}>
                  <span className="nexus-subtle text-[10px] tabular-nums">0{index + 1}</span>
                  <span className="nexus-heading text-xs font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="bg-[var(--nexus-surface)] p-5 sm:p-6">
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.15em]">Business operations</p>
            <ol className="mt-5 space-y-3">
              {businessWorkflow.map((step, index) => (
                <li className="nexus-control flex min-h-12 items-center gap-3 rounded-xl px-3.5 py-3" key={step}>
                  <span className="nexus-subtle text-[10px] tabular-nums">0{index + 1}</span>
                  <span className="nexus-heading text-xs font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="grid gap-3 border-t border-[var(--nexus-border)] p-5 sm:grid-cols-3 sm:p-6">
          {[
            ["Customer layer", "Website · Accounts"],
            ["Operational layer", "Requests · Administration"],
            ["System layer", "Data · Communication"],
          ].map(([label, value]) => (
            <div className="nexus-control rounded-xl p-3.5" key={label}>
              <p className="nexus-subtle text-[10px] uppercase tracking-[0.1em]">{label}</p>
              <p className="nexus-heading mt-1.5 text-xs font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
