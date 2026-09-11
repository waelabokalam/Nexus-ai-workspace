import type { Metadata } from "next";
import Link from "next/link";
import MarketingPage from "@/components/MarketingPage";
import { pageMetadata } from "@/app/metadata";

export const metadata: Metadata = pageMetadata(
  "Engagements",
  "Explore how TQEN scopes restaurant pilots and custom operational systems around real business workflows.",
  "/pricing",
);

const engagements = [
  {
    label: "Flagship industry system",
    title: "Restaurant pilot",
    timing: "30-day operating pilot",
    description: "Run the current TQEN Restaurant system with a real restaurant operation and evaluate what it surfaces for managers.",
    includes: ["Command Center setup", "Branch and role configuration", "Daily Brief and work queues", "Reputation and supplier workflows", "Pilot review"],
    href: "/restaurants#restaurant-pilot",
    cta: "Explore the pilot",
  },
  {
    label: "Purpose-built technology",
    title: "Custom system",
    timing: "Scoped after discovery",
    description: "For an operational problem that needs dedicated software, automation, an agent, an application or a connected workflow.",
    includes: ["Workflow discovery", "System and interaction design", "Build plan and delivery scope", "Integration assessment", "Launch and handover plan"],
    href: "/contact?intent=custom-system",
    cta: "Discuss your operation",
  },
] as const;

export default function PricingPage() {
  return (
    <MarketingPage>
      <section className="mx-auto max-w-7xl px-5 pb-28 pt-20 sm:px-8 sm:pt-28">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Ways to work with TQEN</p>
            <h1 className="nexus-heading mt-5 font-heading text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">Scope first. Price the real work.</h1>
          </div>
          <p className="nexus-copy max-w-2xl text-lg leading-8 lg:justify-self-end">
            TQEN does not force different businesses into a fixed software package. We define the workflow, integrations and level of operational responsibility before proposing a commercial scope.
          </p>
        </div>

        <div className="mt-20 grid gap-5 lg:grid-cols-2">
          {engagements.map((engagement, index) => (
            <article className={`flex min-h-[34rem] flex-col rounded-[var(--nexus-radius-surface)] p-6 sm:p-8 ${index === 0 ? "nexus-frame" : "nexus-surface"}`} key={engagement.title}>
              <div className="flex items-start justify-between gap-6">
                <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">{engagement.label}</p>
                <span className="nexus-status shrink-0 rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em]">{engagement.timing}</span>
              </div>
              <h2 className="nexus-heading mt-10 font-heading text-4xl font-semibold tracking-[-0.05em]">{engagement.title}</h2>
              <p className="nexus-copy mt-5 max-w-xl text-base leading-7">{engagement.description}</p>
              <ul className="mt-10 border-t border-[var(--nexus-border)]">
                {engagement.includes.map((item) => (
                  <li className="nexus-heading flex items-center gap-3 border-b border-[var(--nexus-border)] py-3.5 text-sm" key={item}>
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--nexus-text-muted)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link className="nexus-button-primary nexus-focus mt-auto inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href={engagement.href}>
                {engagement.cta} <span aria-hidden="true" className="ml-2">→</span>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 border-t border-[var(--nexus-border)] pt-8 md:grid-cols-[0.7fr_1.3fr]">
          <h2 className="nexus-heading font-heading text-2xl font-semibold tracking-[-0.04em]">What shapes the scope</h2>
          <div className="grid gap-5 text-sm leading-6 sm:grid-cols-2">
            <p className="nexus-copy">Locations, users, data sources, workflows, integration access, deployment constraints and ongoing support all affect delivery.</p>
            <p className="nexus-copy">Any estimate is a proposal for a defined scope, not a generic monthly price or a promise that every external system can be connected.</p>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
