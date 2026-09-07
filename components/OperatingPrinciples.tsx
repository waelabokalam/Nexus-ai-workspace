const principles = [
  ["Business systems", "Focused operational products designed around the workflows, people and constraints of a specific industry.", "Software"],
  ["AI agents", "Customer service, sales, scheduling, knowledge and internal agents connected to approved business context.", "Intelligence"],
  ["Automation", "Workflows that connect messaging, CRM, operations, approvals and external services without hiding execution.", "Operations"],
  ["Computer vision", "Camera activity translated into useful operational signals and alerts for people to review where appropriate.", "Vision"],
] as const;

export default function OperatingPrinciples() {
  return (
    <section className="relative border-y border-white/[0.08] bg-white/[0.018] py-20 sm:py-24" id="systems">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">What Nexus builds</p><h2 className="nexus-heading mt-4 font-heading text-3xl font-medium tracking-[-0.045em] sm:text-4xl">Four disciplines. One applied intelligence partner.</h2><p className="nexus-copy mt-4 max-w-2xl text-base leading-7">Nexus brings product engineering and applied intelligence together around the parts of an operation where context, decisions, and repeated work need to connect.</p></div>
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {principles.map(([title, description, status], index) => (
            <article className="nexus-card group min-h-56 rounded-[var(--nexus-radius-control)] p-6 transition-transform hover:-translate-y-0.5" key={title}>
              <div className="flex items-center justify-between gap-3"><span className="nexus-subtle text-xs font-medium tabular-nums">0{index + 1}</span><span className="nexus-status rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em]">{status}</span></div>
              <h3 className="nexus-heading mt-10 font-heading text-xl font-medium tracking-[-0.025em]">{title}</h3>
              <p className="nexus-copy mt-3 max-w-xl text-sm leading-6">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
