import Link from "next/link";

const systemModules = [
  { label: "Customer experience", detail: "Website, account and ordering flow" },
  { label: "Order operations", detail: "Planning, fulfilment and delivery workflow" },
  { label: "Business control", detail: "Admin tools and operational management" },
  { label: "Communication", detail: "Customer messaging and automation" },
] as const;

export default function CraveItSpotlight() {
  return (
    <section className="relative border-y border-white/[0.08] bg-white/[0.018] px-5 py-24 sm:px-8 sm:py-32" id="crave-it">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.84fr_1.16fr] lg:items-center lg:gap-16">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Built by Nexus</p>
            <span className="nexus-status rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.11em]">Restaurant system</span>
          </div>
          <h2 className="nexus-heading mt-5 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Crave It</h2>
          <p className="nexus-heading mt-4 max-w-xl font-heading text-xl font-medium tracking-[-0.025em] sm:text-2xl">
            A complete digital operations platform for food businesses.
          </p>
          <p className="nexus-copy mt-6 max-w-xl text-base leading-7">
            Crave It shows how Nexus turns an industry workflow into one connected business system: the customer experience, ordering, accounts, delivery operations, administration and communication working together.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-white/[0.08] py-6 text-sm">
            <div><p className="nexus-subtle text-xs">Customer layer</p><p className="nexus-heading mt-1 font-medium">Website & accounts</p></div>
            <div><p className="nexus-subtle text-xs">Operations layer</p><p className="nexus-heading mt-1 font-medium">Orders & delivery</p></div>
            <div><p className="nexus-subtle text-xs">Control layer</p><p className="nexus-heading mt-1 font-medium">Admin workflows</p></div>
            <div><p className="nexus-subtle text-xs">Intelligence layer</p><p className="nexus-heading mt-1 font-medium">AI & automation</p></div>
          </div>

          <Link className="nexus-button-primary nexus-focus mt-8 inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/case-studies/crave-it">
            View Crave It case study <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>

        <div className="nexus-frame rounded-[var(--nexus-radius-surface)] p-1">
          <div className="nexus-surface rounded-[calc(var(--nexus-radius-surface)-0.3rem)] p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
              <div>
                <p className="nexus-subtle text-[10px] font-medium uppercase tracking-[0.15em]">Crave It system</p>
                <p className="nexus-heading mt-1 text-sm font-semibold">Restaurant operations</p>
              </div>
              <span className="nexus-status rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.1em]">Connected</span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {systemModules.map((module, index) => (
                <article className="nexus-control min-h-40 rounded-[var(--nexus-radius-control)] p-5" key={module.label}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="nexus-subtle text-xs tabular-nums">0{index + 1}</span>
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--nexus-text-muted)]" />
                  </div>
                  <h3 className="nexus-heading mt-7 text-sm font-medium">{module.label}</h3>
                  <p className="nexus-copy mt-2 text-xs leading-5">{module.detail}</p>
                </article>
              ))}
            </div>

            <div className="nexus-control mt-3 flex flex-col gap-3 rounded-[var(--nexus-radius-control)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="nexus-copy text-xs">One operational model across customer and team workflows.</p>
              <p className="nexus-heading text-xs font-medium">Nexus industry system</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
