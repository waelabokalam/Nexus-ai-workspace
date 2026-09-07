import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata } from "@/app/metadata";
import MarketingPage from "@/components/MarketingPage";
import CraveItSystemMap from "@/components/restaurants/CraveItSystemMap";
import RestaurantArchitecture from "@/components/restaurants/RestaurantArchitecture";
import RestaurantModules from "@/components/restaurants/RestaurantModules";

export const metadata: Metadata = pageMetadata(
  "Restaurant Operating Systems",
  "Nexus builds connected restaurant software spanning digital presence, customer journeys, operations, CRM, AI assistance and automation.",
  "/restaurants",
);

const fragmentedTools = ["Website", "WhatsApp", "Instagram", "Ordering service", "Spreadsheets", "Delivery", "Customer messages", "Admin work"] as const;

const liveFlows = [
  { flow: "Customer asks a menu question → Nexus Agent → grounded answer", status: "Live" },
  { flow: "Reservation is confirmed → Calendar event → team visibility", status: "Live" },
  { flow: "Large-party inquiry → lead capture → staff follow-up", status: "Live" },
  { flow: "Future CRM or order integrations → connected system updates", status: "Expandable / Planned" },
] as const;

const comparison = [
  ["Customer experience", "A standalone website", "Connected to the operating workflow"],
  ["Messages", "Handled manually across channels", "Grounded agent support with enabled actions"],
  ["Customer information", "Scattered across tools", "Structured around a shared customer context"],
  ["Operations", "Multiple disconnected products", "Designed as one restaurant system"],
  ["Automation", "Added tool by tool", "Configured across the system"],
] as const;

const futureModules = ["Loyalty", "Marketing automation", "Demand forecasting", "Inventory intelligence", "Delivery integrations", "POS integrations", "Advanced analytics", "Kitchen intelligence"] as const;

export default function RestaurantsPage() {
  return (
    <MarketingPage>
      <section className="px-5 pb-24 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <div>
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.17em]">Nexus for restaurants</p>
            <h1 className="nexus-heading mt-5 max-w-4xl font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-[4.5rem]">
              Run your restaurant from one intelligent system.
            </h1>
            <p className="nexus-copy mt-7 max-w-2xl text-lg leading-8">
              Bring your digital presence, customer journey, communication, operations and business data into one connected platform built around your restaurant.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="nexus-button-primary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/contact">Book a demo <span aria-hidden="true" className="ml-2">→</span></Link>
              <Link className="nexus-button-secondary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/case-studies/crave-it">See Crave It</Link>
            </div>
          </div>

          <aside className="nexus-frame rounded-[var(--nexus-radius-surface)] p-1">
            <div className="nexus-surface rounded-[calc(var(--nexus-radius-surface)-0.3rem)] p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.15em]">Restaurant system</p>
                <span className="nexus-status rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em]">Industry layer</span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2">
                {["Digital presence", "Customer journey", "Operations", "Customer CRM", "Nexus Agent", "Automation"].map((item) => <div className="nexus-control flex min-h-20 items-end rounded-xl p-3 text-xs font-medium text-[var(--nexus-text)]" key={item}>{item}</div>)}
              </div>
              <p className="nexus-copy mt-5 text-xs leading-5">Configured around the restaurant’s offering, service model and operating workflow.</p>
            </div>
          </aside>

          <div className="nexus-copy col-span-full flex flex-wrap gap-x-6 gap-y-3 border-t border-white/[0.08] pt-5 text-sm">
            {['Website', 'Ordering', 'Operations', 'CRM', 'AI', 'Automation'].map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-white/[0.018] px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">The operational problem</p>
            <h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Your restaurant should not need six disconnected systems to run online.</h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="nexus-card rounded-[var(--nexus-radius-surface)] p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2.5">
                {fragmentedTools.map((tool, index) => (
                  <div className="contents" key={tool}>
                    <span className="nexus-control rounded-xl px-3.5 py-3 text-sm text-[var(--nexus-text-muted)]">{tool}</span>
                    {index < fragmentedTools.length - 1 ? <span aria-hidden="true" className="nexus-subtle text-xs">×</span> : null}
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t border-white/[0.08] pt-6">
                <p className="nexus-subtle text-xs uppercase tracking-[0.14em]">The result</p>
                <p className="nexus-heading mt-2 font-heading text-2xl font-medium tracking-[-0.035em]">Fragmented operations and repeated manual work.</p>
              </div>
            </div>
            <div className="nexus-frame rounded-[var(--nexus-radius-surface)] p-1">
              <div className="nexus-surface flex h-full flex-col justify-between rounded-[calc(var(--nexus-radius-surface)-0.3rem)] p-6 sm:p-8">
                <p className="nexus-subtle text-xs uppercase tracking-[0.14em]">The Nexus model</p>
                <p className="nexus-heading mt-12 font-heading text-3xl font-medium tracking-[-0.045em]">One customer journey. One operational system.</p>
                <p className="nexus-copy mt-4 text-sm leading-6">Nexus connects the experience customers see with the work the restaurant team needs to complete.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32" id="restaurant-system">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Nexus Restaurant System</p>
            <h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Everything customers touch, connected to the operation behind it.</h2>
            <p className="nexus-copy mt-5 max-w-2xl text-base leading-7">The exact scope is configured per restaurant. The modules below show how Nexus structures the system without claiming unsupported third-party integrations.</p>
          </div>
          <div className="mt-12"><RestaurantModules /></div>
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-white/[0.018] px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Visible automation</p><h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">From customer intent to restaurant action.</h2></div>
          <div className="mt-12 grid gap-3 lg:grid-cols-2">
            {liveFlows.map((item, index) => (
              <article className="nexus-card rounded-[var(--nexus-radius-control)] p-5 sm:p-6" key={item.flow}>
                <div className="flex items-start justify-between gap-5"><span className="nexus-subtle text-xs tabular-nums">0{index + 1}</span><span className="nexus-status rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em]">{item.status}</span></div>
                <p className="nexus-heading mt-8 text-sm font-medium leading-6">{item.flow}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">System architecture</p><h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Nexus sits between the customer and the operation.</h2></div>
          <RestaurantArchitecture />
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-white/[0.018] px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Why Nexus is different</p><h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">One system designed around the restaurant workflow.</h2></div>
          <div className="nexus-card mt-12 overflow-hidden rounded-[var(--nexus-radius-surface)]">
            <div className="hidden grid-cols-[0.7fr_1fr_1fr] border-b border-white/[0.08] px-6 py-4 text-xs font-medium uppercase tracking-[0.12em] text-[var(--nexus-text-subtle)] md:grid"><span>Area</span><span>Traditional approach</span><span>Nexus approach</span></div>
            {comparison.map(([area, traditional, nexus]) => (
              <div className="grid gap-3 border-b border-white/[0.07] px-5 py-5 last:border-0 md:grid-cols-[0.7fr_1fr_1fr] md:items-center md:px-6" key={area}>
                <p className="nexus-heading text-sm font-medium">{area}</p>
                <p className="nexus-copy text-sm"><span className="nexus-subtle mr-2 text-[10px] uppercase tracking-[0.1em] md:hidden">Separate</span>{traditional}</p>
                <p className="nexus-heading text-sm"><span className="nexus-subtle mr-2 text-[10px] uppercase tracking-[0.1em] md:hidden">Nexus</span>{nexus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div><span className="nexus-status inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em]">Expandable / Planned</span><h2 className="nexus-heading mt-5 font-heading text-4xl font-semibold tracking-[-0.055em]">Built to evolve with the restaurant.</h2><p className="nexus-copy mt-5 text-base leading-7">These modules describe the longer-term system direction. They are not presented as available integrations today.</p></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {futureModules.map((module) => <div className="nexus-card flex min-h-28 items-end rounded-[var(--nexus-radius-control)] p-4 text-sm font-medium text-[var(--nexus-text)]" key={module}>{module}</div>)}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-white/[0.018] px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
          <div>
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Crave It proof</p>
            <h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">See what this looks like in a real system.</h2>
            <p className="nexus-copy mt-5 text-base leading-7">Crave It is a digital food-business platform built by Nexus. It connects the customer experience, operational workflow, administration and underlying system as one product.</p>
            <Link className="nexus-button-primary nexus-focus mt-8 inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/case-studies/crave-it">Explore Crave It case study <span aria-hidden="true" className="ml-2">→</span></Link>
          </div>
          <CraveItSystemMap />
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="nexus-frame mx-auto max-w-7xl rounded-[var(--nexus-radius-surface)] p-1">
          <div className="nexus-surface rounded-[calc(var(--nexus-radius-surface)-0.3rem)] px-6 py-16 text-center sm:px-10 sm:py-20">
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Nexus for restaurants</p>
            <h2 className="nexus-heading mx-auto mt-5 max-w-4xl font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Your restaurant already has a workflow. Nexus turns it into software.</h2>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link className="nexus-button-primary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/contact">Talk to Nexus <span aria-hidden="true" className="ml-2">→</span></Link><Link className="nexus-button-secondary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/case-studies/crave-it">View Crave It</Link></div>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
