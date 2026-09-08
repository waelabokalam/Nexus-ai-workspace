import type { Metadata } from "next";
import Link from "next/link";
import MarketingPage from "@/components/MarketingPage";
import ProductStatus from "@/components/ui/ProductStatus";
import { pageMetadata } from "@/app/metadata";

export const metadata: Metadata = pageMetadata("Engagements", "Scoped Nexus implementations shaped around real operational workflows, access requirements, and implementation depth.", "/pricing");

const engagements = [
  {
    name: "Restaurant Intelligence",
    status: "building" as const,
    audience: "For restaurant teams that need clearer management across existing systems.",
    outcome: "A focused operating layer configured around your current tools, policies, and highest-value workflow.",
    items: ["System and workflow mapping", "Manager Command Center scope", "Nexus Guest Agent where appropriate", "Approval and handoff policy", "Integration assessment", "Managed implementation"],
    href: "/contact?industry=restaurants&source_page=%2Fpricing",
  },
  {
    name: "Nexus Direct",
    status: "live" as const,
    audience: "For cloud kitchens, meal plans, subscriptions, catering, and businesses building a direct customer channel.",
    outcome: "A scoped customer and operations product designed around the direct-commerce model.",
    items: ["Customer experience", "Plan or order journey", "Account context", "Admin workflow", "Fulfilment coordination", "Deployment and handover"],
    href: "/contact?industry=restaurants&source_page=%2Fpricing",
  },
  {
    name: "Custom Integration",
    status: "next" as const,
    audience: "For businesses with a defined operational problem that spans software, automation, AI, or vision.",
    outcome: "A discovery-led implementation with scope, access requirements, risk controls, and rollout agreed before build.",
    items: ["Operational discovery", "Technical feasibility", "Custom workflow", "Existing-system connection", "Human control model", "Phased rollout plan"],
    href: "/contact?source_page=%2Fpricing",
  },
] as const;

export default function PricingPage() {
  return <MarketingPage><section className="mx-auto max-w-7xl px-5 pb-28 pt-20 sm:px-8 sm:pt-28">
    <div className="max-w-4xl"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Scoped engagements</p><h1 className="nexus-heading mt-5 font-heading text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">Start with the operation—not a software tier.</h1><p className="nexus-copy mt-6 max-w-3xl text-lg leading-8">Nexus work is priced around the systems involved, workflow risk, integration access, and implementation depth. We do not publish a fixed subscription before those facts are known.</p></div>
    <div className="mt-14 grid items-stretch gap-4 lg:grid-cols-3">{engagements.map((engagement) => <article className="nexus-card flex min-h-[34rem] flex-col rounded-[var(--nexus-radius-surface)] p-6 sm:p-7" key={engagement.name}><div className="flex items-start justify-between gap-4"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">Implementation area</p><ProductStatus status={engagement.status} /></div><h2 className="nexus-heading mt-8 font-heading text-2xl font-medium tracking-[-0.04em]">{engagement.name}</h2><p className="nexus-copy mt-4 text-sm leading-6">{engagement.audience}</p><p className="nexus-heading mt-6 border-t border-[var(--nexus-border)] pt-6 text-sm leading-6">{engagement.outcome}</p><ul className="nexus-copy mt-6 space-y-3 text-xs leading-5">{engagement.items.map((item) => <li className="flex gap-2" key={item}><span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-current opacity-50" />{item}</li>)}</ul><Link className="nexus-button-secondary nexus-focus mt-auto inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] px-4 text-sm font-medium" href={engagement.href}>Discuss scope <span aria-hidden="true" className="ms-2">→</span></Link></article>)}</div>
    <div className="nexus-control mt-8 rounded-[var(--nexus-radius-control)] p-5 sm:flex sm:items-center sm:justify-between sm:gap-8"><div><p className="nexus-heading text-sm font-medium">Pricing follows discovery.</p><p className="nexus-copy mt-2 max-w-3xl text-sm leading-6">Every proposal states the agreed scope, dependencies, implementation stages, and any recurring infrastructure or support costs. No artificial discounts or assumed usage tiers.</p></div><Link className="nexus-button-primary nexus-focus mt-5 inline-flex min-h-11 shrink-0 items-center justify-center rounded-[var(--nexus-radius-control)] px-4 text-sm font-medium sm:mt-0" href="/contact?source_page=%2Fpricing">Talk to Nexus</Link></div>
  </section></MarketingPage>;
}
