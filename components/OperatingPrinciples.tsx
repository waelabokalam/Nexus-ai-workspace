const principles = [
  ["Adaptive communication", "Responses can adapt their style while keeping the business answer intact."],
  ["English, Arabic & Turkish", "Supported conversations stay in the customer’s language."],
  ["Grounded business knowledge", "Qdrant-backed retrieval brings relevant business context into the response."],
  ["Conversation memory", "Context carries across messages instead of resetting with every turn."],
  ["Workflows & actions", "Intent can route a request toward response, retrieval or scheduling work."],
  ["Channel-neutral by design", "The public website workspace is live today; other channels are released deliberately."],
] as const;

export default function OperatingPrinciples() {
  return (
    <section className="relative border-y border-white/[0.08] bg-white/[0.018] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl"><p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">The operating layer</p><h2 className="mt-4 font-heading text-3xl font-medium tracking-[-0.045em] text-white sm:text-4xl">Every reply has context, not just a prompt.</h2></div>
        <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {principles.map(([title, description], index) => (
            <article className="group rounded-[var(--nexus-radius-control)] border border-white/[0.08] bg-white/[0.018] p-5 transition-colors hover:border-white/[0.15] hover:bg-white/[0.035]" key={title}>
              <span className="text-xs font-medium tabular-nums text-zinc-600">0{index + 1}</span>
              <h3 className="mt-6 font-heading text-lg font-medium tracking-[-0.025em] text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
