import Link from "next/link";
import { ArrowUpRight, Bot, PanelsTopLeft, UtensilsCrossed } from "lucide-react";
import SectionReveal from "@/components/marketing/SectionReveal";

const work = [
  {
    title: "Restaurant V1",
    description: "A real multi-branch operational command center for attention, approvals, reputation and supplier intelligence.",
    proof: "Built product",
    href: "/restaurants",
    action: "View the product",
    icon: UtensilsCrossed,
  },
  {
    title: "Crave It",
    description: "An end-to-end customer, subscription and operational system built as one connected business workflow.",
    proof: "System case study",
    href: "/case-studies/crave-it",
    action: "Read the case study",
    icon: PanelsTopLeft,
  },
  {
    title: "Nexus Agent",
    description: "A live multilingual agent with business knowledge, memory, intent routing and scheduling workflows.",
    proof: "Live experience",
    href: "/demo/support",
    action: "Talk to the agent",
    icon: Bot,
  },
] as const;

export default function WorkProof() {
  return (
    <section className="border-y border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-20 sm:px-8 sm:py-28" id="work">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="max-w-3xl">
          <h2 className="nexus-heading font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Proof across products and systems.</h2>
          <p className="nexus-copy mt-5 max-w-2xl text-base leading-7">Current work shows the range: operational software, end-to-end business platforms, and a live company agent.</p>
        </SectionReveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.25fr_0.875fr_0.875fr]">
          {work.map(({ title, description, proof, href, action, icon: Icon }, index) => (
            <SectionReveal className={`nexus-surface flex min-h-72 flex-col rounded-[var(--nexus-radius-surface)] p-6 ${index === 0 ? "lg:min-h-96" : ""}`} delay={index * 0.05} key={title}>
              <div className="flex items-start justify-between gap-4"><Icon aria-hidden="true" className="nexus-heading size-6" strokeWidth={1.5} /><span className="nexus-subtle text-xs">{proof}</span></div>
              <div className="mt-auto pt-12">
                <h3 className="nexus-heading font-heading text-2xl font-semibold tracking-[-0.035em]">{title}</h3>
                <p className="nexus-copy mt-3 text-sm leading-6">{description}</p>
                <Link className="nexus-heading nexus-focus mt-6 inline-flex min-h-10 items-center rounded-lg text-sm font-medium underline decoration-current/20 underline-offset-4 hover:decoration-current" href={href}>{action}<ArrowUpRight aria-hidden="true" className="ml-2 size-4" strokeWidth={1.6} /></Link>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
