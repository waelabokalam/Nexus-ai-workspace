import Link from "next/link";
import {
  Blocks,
  Bot,
  Cable,
  Eye,
  PanelsTopLeft,
  Route,
  Smartphone,
  Workflow,
} from "lucide-react";
import SectionReveal from "@/components/marketing/SectionReveal";

const capabilities = [
  { title: "AI agents", description: "Conversation systems grounded in business knowledge and real workflows.", icon: Bot },
  { title: "Workflow automation", description: "Repeatable work handled with clear approval and escalation boundaries.", icon: Workflow },
  { title: "Business systems", description: "Operational software built around the way the team already works.", icon: Blocks },
  { title: "Apps and platforms", description: "Customer portals, internal tools, web apps and mobile products.", icon: Smartphone },
  { title: "Websites", description: "Premium public experiences connected to the operation behind them.", icon: PanelsTopLeft },
  { title: "Integrations", description: "Existing tools connected through stable, provider-neutral boundaries.", icon: Cable },
  { title: "Computer vision", description: "Operational monitoring designed around review, evidence and human control.", icon: Eye },
  { title: "Custom systems", description: "Focused software for workflows that do not fit an off-the-shelf product.", icon: Route },
] as const;

export default function SolutionsOverview() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28" id="solutions">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="max-w-3xl">
          <h2 className="nexus-heading font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl">Systems designed around the operation.</h2>
          <p className="nexus-copy mt-5 max-w-2xl text-base leading-7">We start with the work, then choose the software, automation and intelligence needed to improve it.</p>
        </SectionReveal>

        <div className="mt-12 grid gap-x-10 gap-y-0 border-y border-[var(--nexus-border)] md:grid-cols-2">
          {capabilities.map(({ title, description, icon: Icon }, index) => (
            <SectionReveal className="grid min-h-36 grid-cols-[2.5rem_1fr] gap-4 border-b border-[var(--nexus-border)] py-6 md:[&:nth-last-child(-n+2)]:border-b-0" delay={(index % 2) * 0.04} key={title}>
              <span className="nexus-control grid size-10 place-items-center rounded-[var(--nexus-radius-control)]">
                <Icon aria-hidden="true" className="nexus-heading size-[1.125rem]" strokeWidth={1.55} />
              </span>
              <div>
                <h3 className="nexus-heading font-heading text-lg font-medium tracking-[-0.025em]">{title}</h3>
                <p className="nexus-copy mt-2 max-w-md text-sm leading-6">{description}</p>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="nexus-copy max-w-2xl text-sm leading-6">A website or app is one part of the system. The value comes from how it connects to the work behind it.</p>
          <Link className="nexus-button-secondary nexus-focus inline-flex min-h-11 shrink-0 items-center justify-center rounded-[var(--nexus-radius-control)] px-4 text-sm font-medium" href="/features">Explore capabilities</Link>
        </SectionReveal>
      </div>
    </section>
  );
}
