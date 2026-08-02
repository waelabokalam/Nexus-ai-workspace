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
    <section className="relative border-y border-white/[0.08] bg-white/[0.018] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">The operating layer</p>
        <div className="mt-7 grid gap-x-12 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {principles.map(([title, description]) => (
            <article key={title}>
              <h2 className="font-heading text-lg font-medium tracking-[-0.025em] text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
