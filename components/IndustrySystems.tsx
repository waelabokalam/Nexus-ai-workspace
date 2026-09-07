import Link from "next/link";

const industries = [
  {
    number: "01",
    title: "Restaurants",
    status: "Live",
    description: "Ordering, operations, customer experience and AI in one connected system.",
    capabilities: ["Digital ordering", "Delivery", "Customer CRM", "Admin operations", "AI customer agent", "Automation"],
    action: "Explore restaurant systems",
    href: "/restaurants",
    featured: true,
  },
  {
    number: "02",
    title: "Retail",
    status: "In development",
    description: "Connect inventory, pricing, customers, analytics and intelligent monitoring.",
    capabilities: ["Inventory intelligence", "CRM", "Smart pricing", "Computer vision", "Shelf systems", "Analytics"],
    action: "Discuss the retail roadmap",
    href: "/contact?industry=retail&source_page=%2F",
    featured: false,
  },
  {
    number: "03",
    title: "Fitness",
    status: "Planned",
    description: "Membership operations enhanced by automation and intelligent access.",
    capabilities: ["Memberships", "CRM", "Smart access", "Attendance", "AI receptionist", "Retention intelligence"],
    action: "Discuss fitness systems",
    href: "/contact?industry=fitness&source_page=%2F",
    featured: false,
  },
] as const;

export default function IndustrySystems() {
  return (
    <section className="relative border-y border-white/[0.08] bg-white/[0.018] py-20 sm:py-24" id="industries">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Industry systems</p>
            <h2 className="nexus-heading mt-4 max-w-xl font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              Built for your industry.
            </h2>
          </div>
          <p className="nexus-copy max-w-2xl text-base leading-7 lg:justify-self-end">
            The core technology is shared. The workflows, interfaces and operational logic are shaped around the people and constraints of each industry.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {industries.map((industry) => (
            <article
              className={`nexus-card flex min-h-[31rem] flex-col rounded-[var(--nexus-radius-surface)] p-6 sm:p-7 ${industry.featured ? "lg:-translate-y-2" : ""}`}
              key={industry.title}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="nexus-subtle text-xs font-medium tabular-nums">{industry.number}</span>
                <span className="nexus-status rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em]">{industry.status}</span>
              </div>

              <div className="mt-12">
                <h3 className="nexus-heading font-heading text-3xl font-medium tracking-[-0.045em]">{industry.title}</h3>
                <p className="nexus-copy mt-4 text-sm leading-6">{industry.description}</p>
              </div>

              <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-4 border-t border-white/[0.08] pt-6">
                {industry.capabilities.map((capability) => (
                  <li className="nexus-copy flex items-start gap-2 text-xs leading-5" key={capability}>
                    <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-current opacity-50" />
                    {capability}
                  </li>
                ))}
              </ul>

              <Link
                className={industry.featured
                  ? "nexus-button-primary nexus-focus mt-auto inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] px-4 text-sm font-medium"
                  : "nexus-button-secondary nexus-focus mt-auto inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] px-4 text-sm font-medium"}
                href={industry.href}
              >
                {industry.action} <span aria-hidden="true" className="ml-2">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
