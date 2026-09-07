import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata } from "@/app/metadata";
import MarketingPage from "@/components/MarketingPage";
import AutomationControlModel from "@/components/restaurants/AutomationControlModel";
import CraveItSystemMap from "@/components/restaurants/CraveItSystemMap";
import ManagerCommandCenter from "@/components/restaurants/ManagerCommandCenter";
import RestaurantArchitecture from "@/components/restaurants/RestaurantArchitecture";
import RestaurantWorkflowDemo from "@/components/restaurants/RestaurantWorkflowDemo";
import ProductStatus from "@/components/ui/ProductStatus";

export const metadata: Metadata = pageMetadata(
  "Restaurant Intelligence",
  "Nexus connects the systems a restaurant already uses, turns activity into manager intelligence, and routes approved work to people and tools.",
  "/restaurants",
);

const nextCapabilities = ["Supplier invoices", "Supplier price changes", "Waste tracking", "Menu profitability", "Inventory variance", "Suggested purchasing"] as const;

type RestaurantsPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };
function firstValue(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }
function restaurantContactHref(params: Record<string, string | string[] | undefined>) {
  const contactParams = new URLSearchParams({ industry: "restaurants", source_page: "/restaurants" });
  for (const key of ["utm_source", "utm_medium", "utm_campaign"] as const) { const value = firstValue(params[key])?.slice(0, 100); if (value) contactParams.set(key, value); }
  return `/contact?${contactParams.toString()}`;
}

export default async function RestaurantsPage({ searchParams }: RestaurantsPageProps) {
  const contactHref = restaurantContactHref(await searchParams);
  return <MarketingPage>
    <section className="px-5 pb-24 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:gap-16">
        <div>
          <div className="flex flex-wrap items-center gap-3"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.17em]">Nexus for restaurants</p><ProductStatus status="building" /></div>
          <h1 className="nexus-heading mt-5 max-w-5xl font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-[4.5rem]">Your restaurant already has software. Nexus makes it work together.</h1>
          <p className="nexus-copy mt-7 max-w-2xl text-lg leading-8">Nexus sits above the tools you already use—understanding activity, coordinating approved workflows, and giving managers one clear view of what needs attention.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link className="nexus-button-primary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href={contactHref}>Discuss your operation <span aria-hidden="true" className="ms-2">→</span></Link><Link className="nexus-button-secondary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/demo/restaurant">Try the live Guest Agent</Link></div>
        </div>
        <aside className="nexus-frame rounded-[var(--nexus-radius-surface)] p-1"><div className="nexus-surface rounded-[calc(var(--nexus-radius-surface)-0.3rem)] p-6 sm:p-7"><div className="flex items-center justify-between border-b border-[var(--nexus-border)] pb-5"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.15em]">Manager view</p><span className="nexus-subtle text-[10px] uppercase tracking-[0.12em]">One operating layer</span></div><div className="mt-6 space-y-2">{[["Needs attention", "02"], ["Waiting for approval", "01"], ["Nexus handled", "08"]].map(([label, count]) => <div className="nexus-control flex min-h-16 items-center justify-between rounded-xl px-4" key={label}><span className="nexus-heading text-sm font-medium">{label}</span><span className="nexus-subtle text-xs tabular-nums">{count}</span></div>)}</div><p className="nexus-copy mt-5 text-xs leading-5">Illustrative product direction. Connected sources and available actions are configured per restaurant.</p></div></aside>
      </div>
    </section>

    <section className="border-y border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl"><div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end"><div><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">The operating model</p><h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">An intelligence layer above the tools you keep.</h2></div><p className="nexus-copy max-w-2xl text-base leading-7 lg:justify-self-end">Restaurant teams do not need another isolated inbox. They need existing activity translated into clear decisions, controlled automation, and visible follow-through.</p></div><div className="mt-12"><RestaurantArchitecture /></div></div>
    </section>

    <section className="px-5 py-24 sm:px-8 sm:py-32" id="operating-flow">
      <div className="mx-auto max-w-7xl"><div className="max-w-4xl"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">One operating flow</p><h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">From outside activity to the right next action.</h2><p className="nexus-copy mt-5 max-w-2xl text-base leading-7">Choose a scenario to see how Nexus understands the signal, applies policy, and routes the result. Live and concept flows are labeled separately.</p></div><div className="mt-12"><RestaurantWorkflowDemo /></div></div>
    </section>

    <section className="border-y border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl"><div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end"><div><div className="flex items-center gap-3"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Manager Command Center</p><ProductStatus status="building" /></div><h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Know what needs attention before it becomes noise.</h2></div><p className="nexus-copy max-w-2xl text-base leading-7 lg:justify-self-end">The command center is designed to combine a daily brief, an approval inbox, work Nexus handled, and a traceable activity log. The preview below uses illustrative data.</p></div><div className="mt-12"><ManagerCommandCenter /></div></div>
    </section>

    <section className="px-5 py-24 sm:px-8 sm:py-32"><div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Control by design</p><h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Automation should earn trust.</h2><p className="nexus-copy mt-5 text-base leading-7">Every workflow gets an explicit operating mode. Managers decide what Nexus may handle, what needs approval, and what belongs with a person.</p></div><div className="mt-12"><AutomationControlModel /></div></div></section>

    <section className="border-y border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-24 sm:px-8 sm:py-28"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start"><div><div className="flex items-center gap-3"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Nexus Guest Agent</p><ProductStatus status="live" /></div><h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em]">One live module inside the larger system.</h2><p className="nexus-copy mt-5 text-base leading-7">The current restaurant workspace demonstrates grounded business answers in English, Arabic, and Turkish, conversation memory, and the verified Calendar reservation flow.</p><Link className="nexus-button-primary nexus-focus mt-8 inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/demo/restaurant">Open the live restaurant demo <span aria-hidden="true" className="ms-2">→</span></Link></div><div className="grid gap-3 sm:grid-cols-2">{["Grounded guest answers", "Three supported languages", "Conversation memory", "Calendar reservations"].map((item) => <div className="nexus-card flex min-h-32 items-end rounded-[var(--nexus-radius-control)] p-5 text-sm font-medium text-[var(--nexus-text)]" key={item}>{item}</div>)}</div></div></section>

    <section className="px-5 py-24 sm:px-8 sm:py-32"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start"><div><ProductStatus status="next" /><h2 className="nexus-heading mt-5 font-heading text-4xl font-semibold tracking-[-0.055em]">The next operating layer.</h2><p className="nexus-copy mt-5 text-base leading-7">These modules are product direction, not available integrations today. They extend the same manager-first model into cost and inventory decisions.</p></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{nextCapabilities.map((item) => <div className="nexus-card flex min-h-28 items-end rounded-[var(--nexus-radius-control)] p-4 text-sm font-medium text-[var(--nexus-text)]" key={item}>{item}</div>)}</div></div></section>

    <section className="border-y border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-24 sm:px-8 sm:py-32"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16"><div><div className="flex items-center gap-3"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Nexus Direct</p><ProductStatus status="live" /></div><h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">A direct-commerce system for the businesses that need one.</h2><p className="nexus-copy mt-5 text-base leading-7">Crave It demonstrates a focused Nexus Direct implementation for food plans, subscriptions, ordering, fulfilment, and administration. It does not replace the general-purpose systems of every dine-in restaurant.</p><Link className="nexus-button-primary nexus-focus mt-8 inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/case-studies/crave-it">Explore the Nexus Direct case study <span aria-hidden="true" className="ms-2">→</span></Link></div><CraveItSystemMap /></div></section>

    <section className="px-5 py-24 sm:px-8 sm:py-32"><div className="nexus-frame mx-auto max-w-7xl rounded-[var(--nexus-radius-surface)] p-1"><div className="nexus-surface rounded-[calc(var(--nexus-radius-surface)-0.3rem)] px-6 py-16 text-center sm:px-10 sm:py-20"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Start with the operation</p><h2 className="nexus-heading mx-auto mt-5 max-w-4xl font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Show us where work gets stuck.</h2><p className="nexus-copy mx-auto mt-5 max-w-2xl text-base leading-7">We will map the systems you already use, the decisions managers repeat, and the safest first workflow for Nexus.</p><Link className="nexus-button-primary nexus-focus mt-9 inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href={contactHref}>Discuss your restaurant <span aria-hidden="true" className="ms-2">→</span></Link></div></div></section>
  </MarketingPage>;
}
