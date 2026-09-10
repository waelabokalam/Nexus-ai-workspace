import Link from "next/link";
import { Dumbbell, ScanSearch, UtensilsCrossed } from "lucide-react";
import SectionReveal from "@/components/marketing/SectionReveal";

const secondaryIndustries = [
  {
    title: "Retail",
    status: "In development",
    description: "Operational alerts, loss prevention, pricing, inventory and customer workflows for multi-location retail.",
    icon: ScanSearch,
    href: "/contact?industry=retail",
    action: "Discuss retail operations",
  },
  {
    title: "Fitness",
    status: "Planned",
    description: "Membership, access, attendance, retention and service workflows designed around the member journey.",
    icon: Dumbbell,
    href: "/contact?industry=fitness",
    action: "Share a fitness workflow",
  },
] as const;

export default function IndustrySystems() {
  return (
    <section className="border-y border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-20 sm:px-8 sm:py-24" id="industries">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="max-w-3xl">
          <h2 className="nexus-heading font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl">Industry depth where operations demand it.</h2>
          <p className="nexus-copy mt-5 max-w-2xl text-base leading-7">We package repeatable operational intelligence by industry, starting with Restaurant.</p>
        </SectionReveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <SectionReveal className="nexus-surface relative flex min-h-[26rem] flex-col rounded-[var(--nexus-radius-surface)] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <UtensilsCrossed aria-hidden="true" className="nexus-heading size-7" strokeWidth={1.5} />
              <span className="nexus-status rounded-full px-3 py-1 text-xs font-medium">Pilot ready</span>
            </div>
            <div className="mt-auto max-w-2xl pt-16">
              <h3 className="nexus-heading font-heading text-4xl font-semibold tracking-[-0.05em]">Restaurant</h3>
              <p className="nexus-copy mt-4 max-w-xl text-base leading-7">A manager command center for daily priorities, approvals, reputation, supplier costs and operational history.</p>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <span className="nexus-subtle">Daily brief</span>
                <span className="nexus-subtle">Attention queues</span>
                <span className="nexus-subtle">Supplier intelligence</span>
              </div>
              <Link className="nexus-heading nexus-focus mt-8 inline-flex min-h-11 items-center rounded-[var(--nexus-radius-control)] text-sm font-medium underline decoration-current/25 underline-offset-4 transition hover:decoration-current" href="/restaurants">
                Explore Nexus Restaurant <span aria-hidden="true" className="ml-2">→</span>
              </Link>
            </div>
          </SectionReveal>

          <div className="grid gap-4">
            {secondaryIndustries.map(({ title, status, description, icon: Icon, href, action }, index) => (
              <SectionReveal className="rounded-[var(--nexus-radius-surface)] border border-[var(--nexus-border)] p-6" delay={0.05 * (index + 1)} key={title}>
                <div className="flex items-start justify-between gap-4">
                  <Icon aria-hidden="true" className="nexus-subtle size-6" strokeWidth={1.5} />
                  <span className="nexus-subtle text-xs font-medium">{status}</span>
                </div>
                <h3 className="nexus-heading mt-10 font-heading text-2xl font-medium tracking-[-0.04em]">{title}</h3>
                <p className="nexus-copy mt-3 text-sm leading-6">{description}</p>
                <Link className="nexus-heading nexus-focus mt-6 inline-flex min-h-10 items-center text-sm font-medium underline decoration-current/20 underline-offset-4 hover:decoration-current" href={href}>{action}</Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
