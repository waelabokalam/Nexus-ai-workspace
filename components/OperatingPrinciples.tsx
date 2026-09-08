const principles = [
  ["AI Agents", "AI that understands customers, employees and business knowledge—and can move approved workflows forward."],
  ["Automation", "Remove repetitive checking, routing, follow-up and administrative work from daily operations."],
  ["Business Systems", "Focused software built around a real workflow instead of forcing the business into a generic tool."],
  ["Computer Vision", "Turn camera activity into operational signals and intelligent monitoring for people to review."],
] as const;

export default function OperatingPrinciples() {
  return (
    <section className="relative border-y border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] py-20 sm:py-24" id="what-we-build">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">What we build</p><h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Four capabilities. Applied where they matter.</h2></div>
        <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {principles.map(([title, description], index) => (
            <article className="nexus-card min-h-64 rounded-[var(--nexus-radius-control)] p-6" key={title}>
              <span className="nexus-subtle text-xs font-medium tabular-nums">0{index + 1}</span>
              <h3 className="nexus-heading mt-12 font-heading text-xl font-medium tracking-[-0.025em]">{title}</h3>
              <p className="nexus-copy mt-3 max-w-xl text-sm leading-6">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
