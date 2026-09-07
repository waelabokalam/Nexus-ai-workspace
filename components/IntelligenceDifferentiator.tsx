const traditionalSoftware = [
  "Records orders",
  "Stores customer data",
  "Tracks inventory",
  "Shows dashboards",
] as const;

const nexusSystem = [
  "Understands operational activity",
  "Detects patterns that need attention",
  "Automates connected workflows",
  "Communicates with customers",
  "Connects software, vision and hardware",
] as const;

export default function IntelligenceDifferentiator() {
  return (
    <section className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">The difference</p>
          <h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
            Software should do more than store data.
          </h2>
          <p className="nexus-copy mt-5 max-w-2xl text-base leading-7">
            Traditional tools describe the business after work happens. Nexus is designed to help the business understand activity and move the right work forward.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <article className="nexus-card rounded-[var(--nexus-radius-surface)] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
              <h3 className="nexus-heading text-sm font-medium">Traditional business software</h3>
              <span className="nexus-subtle text-xs">Records</span>
            </div>
            <ul className="mt-4 divide-y divide-white/[0.07]">
              {traditionalSoftware.map((item, index) => (
                <li className="nexus-copy flex min-h-14 items-center gap-4 py-3 text-sm" key={item}>
                  <span className="nexus-subtle text-xs tabular-nums">0{index + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="nexus-frame rounded-[var(--nexus-radius-surface)] p-1">
            <div className="nexus-surface h-full rounded-[calc(var(--nexus-radius-surface)-0.3rem)] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                <h3 className="nexus-heading text-sm font-medium">A Nexus industry system</h3>
                <span className="nexus-heading text-xs">Understands & acts</span>
              </div>
              <ul className="mt-4 divide-y divide-white/[0.07]">
                {nexusSystem.map((item, index) => (
                  <li className="nexus-heading flex min-h-14 items-center gap-4 py-3 text-sm" key={item}>
                    <span className="grid size-6 shrink-0 place-items-center rounded-full border border-white/[0.1] text-[10px] tabular-nums text-[var(--nexus-text-muted)]">0{index + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
