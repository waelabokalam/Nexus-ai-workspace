const customerFlow = ["Discover", "Choose", "Submit", "Continue"] as const;
const operationFlow = ["Receive", "Review", "Manage", "Fulfil"] as const;

export default function CraveItSystemMap() {
  return (
    <div className="nexus-frame rounded-[var(--nexus-radius-surface)] p-1">
      <div className="nexus-surface overflow-hidden rounded-[calc(var(--nexus-radius-surface)-0.3rem)]">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--nexus-border)] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="nexus-control grid size-9 place-items-center rounded-xl text-sm font-semibold">C</span>
            <div>
              <p className="nexus-heading text-sm font-semibold">Crave It</p>
              <p className="nexus-subtle text-[10px] uppercase tracking-[0.12em]">Connected product system</p>
            </div>
          </div>
          <span className="nexus-status rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em]">Built</span>
        </div>

        <div className="grid gap-px bg-[var(--nexus-border)] sm:grid-cols-2">
          <div className="bg-[var(--nexus-surface)] p-5 sm:p-6">
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">Customer journey</p>
            <ol className="mt-5 space-y-2.5">
              {customerFlow.map((step, index) => (
                <li className="nexus-control flex min-h-12 items-center gap-3 rounded-xl px-4" key={step}>
                  <span className="nexus-subtle text-[10px] tabular-nums">0{index + 1}</span>
                  <span className="nexus-heading text-sm font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-[var(--nexus-surface)] p-5 sm:p-6">
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">Business operation</p>
            <ol className="mt-5 space-y-2.5">
              {operationFlow.map((step, index) => (
                <li className="nexus-control flex min-h-12 items-center gap-3 rounded-xl px-4" key={step}>
                  <span className="nexus-subtle text-[10px] tabular-nums">0{index + 1}</span>
                  <span className="nexus-heading text-sm font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <p className="nexus-copy border-t border-[var(--nexus-border)] px-5 py-4 text-xs leading-5 sm:px-6">
          One data and workflow layer connects the public experience to the work behind it.
        </p>
      </div>
    </div>
  );
}
