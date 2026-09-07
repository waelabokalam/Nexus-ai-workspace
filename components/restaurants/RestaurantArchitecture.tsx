const sources = ["POS", "Delivery", "WhatsApp", "Reservations", "Reviews"] as const;
const outcomes = ["Manager decisions", "Staff follow-up", "Customer actions"] as const;

function Connector({ direction = "down" }: { direction?: "down" | "right" }) {
  return (
    <div aria-hidden="true" className={direction === "right" ? "hidden items-center justify-center lg:flex" : "flex h-12 items-center justify-center lg:hidden"}>
      <span className={direction === "right" ? "h-px w-10 bg-[var(--nexus-border-strong)]" : "h-8 w-px bg-[var(--nexus-border-strong)]"} />
    </div>
  );
}

export default function RestaurantArchitecture() {
  return (
    <div className="nexus-frame rounded-[var(--nexus-radius-surface)] p-1">
      <div className="nexus-surface rounded-[calc(var(--nexus-radius-surface)-0.3rem)] p-5 sm:p-8 lg:p-10">
        <div className="grid items-stretch lg:grid-cols-[1fr_auto_1.1fr_auto_1fr]">
          <section aria-labelledby="restaurant-tools-title" className="nexus-control rounded-[var(--nexus-radius-control)] p-5">
            <p className="nexus-subtle text-[10px] font-medium uppercase tracking-[0.16em]">Existing systems</p>
            <h3 className="nexus-heading mt-2 text-base font-medium" id="restaurant-tools-title">The tools already running the restaurant</h3>
            <div className="mt-5 grid grid-cols-2 gap-2">{sources.map((source) => <span className="rounded-xl border border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-3 py-3 text-center text-xs text-[var(--nexus-text-muted)] last:col-span-2" key={source}>{source}</span>)}</div>
          </section>
          <Connector direction="right" /><Connector />
          <section aria-labelledby="restaurant-nexus-title" className="rounded-[var(--nexus-radius-control)] border border-[var(--nexus-border-strong)] bg-[var(--nexus-surface-raised)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
            <p className="nexus-subtle text-[10px] font-medium uppercase tracking-[0.18em]">Intelligence layer</p>
            <h3 className="nexus-heading mt-2 font-heading text-2xl font-medium tracking-[-0.04em]" id="restaurant-nexus-title">Nexus</h3>
            <ul className="nexus-copy mt-5 space-y-3 text-xs leading-5"><li>Understands intent and operating context</li><li>Routes work to the right system or person</li><li>Applies automation and approval policy</li><li>Creates one visible operational record</li></ul>
          </section>
          <Connector direction="right" /><Connector />
          <section aria-labelledby="restaurant-actions-title" className="nexus-control rounded-[var(--nexus-radius-control)] p-5">
            <p className="nexus-subtle text-[10px] font-medium uppercase tracking-[0.16em]">Coordinated outcomes</p>
            <h3 className="nexus-heading mt-2 text-base font-medium" id="restaurant-actions-title">Work reaches the right destination</h3>
            <div className="mt-5 space-y-2">{outcomes.map((outcome) => <div className="rounded-xl border border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-4 py-3 text-xs font-medium text-[var(--nexus-text)]" key={outcome}>{outcome}</div>)}</div>
          </section>
        </div>
        <p className="nexus-copy mt-6 border-t border-[var(--nexus-border)] pt-5 text-center text-xs leading-5">Nexus coordinates enabled systems. It does not replace the restaurant&apos;s POS, marketplace, accounting, or reservation platform.</p>
      </div>
    </div>
  );
}
