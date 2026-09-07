import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata } from "@/app/metadata";
import MarketingPage from "@/components/MarketingPage";
import CraveItSystemMap from "@/components/restaurants/CraveItSystemMap";

export const metadata: Metadata = pageMetadata(
  "Crave It Case Study",
  "How Nexus Direct shaped Crave It into a connected direct-commerce system spanning customer experience, fulfilment workflows and administration.",
  "/case-studies/crave-it",
);

const solutionFlow = [
  "Customer experience",
  "Plan / order flow",
  "Customer data",
  "Request / order management",
  "Admin operations",
  "Communication / delivery workflow",
] as const;

const builtScope = [
  ["Customer experience", "A mobile-aware front end for presenting the offering and guiding the customer into the right next step."],
  ["Plan / product workflow", "A structured journey for selecting or configuring the food-business offering."],
  ["Account / customer layer", "Customer information and context carried into the operational workflow."],
  ["Admin operations", "A dedicated environment for receiving, reviewing and managing business activity."],
  ["Request / order workflow", "The connection between customer submission and the team's operational work."],
  ["Communication / delivery", "The information flow needed to continue the request beyond the initial customer interaction."],
  ["Underlying system", "The product foundation that keeps the customer and operational layers connected."],
] as const;

const reusableFoundation = ["Industry workflow", "Nexus core system", "Brand configuration", "Business rules", "Deployment"] as const;

export default function CraveItCaseStudyPage() {
  return (
    <MarketingPage>
      <section className="px-5 pb-24 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-3"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.17em]">Nexus Direct case study</p><span className="nexus-status rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em]">Live</span></div>
            <h1 className="nexus-heading mt-5 font-heading text-6xl font-semibold tracking-[-0.065em] sm:text-7xl">Crave It</h1>
            <p className="nexus-heading mt-5 max-w-xl font-heading text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-3xl">A direct-commerce system for a food business.</p>
            <p className="nexus-copy mt-6 max-w-xl text-base leading-7">Crave It is a specific Nexus Direct implementation connecting a customer journey for food plans and orders to fulfilment, administration, and communication.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link className="nexus-button-primary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/contact?industry=restaurants&source_page=%2Fcase-studies%2Fcrave-it">Talk to Nexus <span aria-hidden="true" className="ml-2">→</span></Link><Link className="nexus-button-secondary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/restaurants">Restaurant intelligence</Link></div>
          </div>
          <CraveItSystemMap />
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-white/[0.018] px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">The challenge</p><h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">A food business needs more than a promotional website.</h2><p className="nexus-copy mt-5 max-w-2xl text-base leading-7">The customer journey and the business workflow have to meet. Otherwise every digital interaction becomes another manual handoff for the team.</p></div>
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            <article className="nexus-card rounded-[var(--nexus-radius-surface)] p-6 sm:p-8"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">Customers need to</p><ul className="mt-6 space-y-4">{["Understand the offering", "Select or configure a plan or product", "Provide delivery information", "Communicate requests", "Move through the experience smoothly on mobile"].map((item, index) => <li className="nexus-heading flex items-center gap-3 text-sm" key={item}><span className="nexus-subtle text-[10px] tabular-nums">0{index + 1}</span>{item}</li>)}</ul></article>
            <article className="nexus-card rounded-[var(--nexus-radius-surface)] p-6 sm:p-8"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">The business needs to</p><ul className="mt-6 space-y-4">{["Receive requests", "Manage customers", "Review submissions", "Approve and manage workflows", "Update business information", "Operate from an admin environment"].map((item, index) => <li className="nexus-heading flex items-center gap-3 text-sm" key={item}><span className="nexus-subtle text-[10px] tabular-nums">0{index + 1}</span>{item}</li>)}</ul></article>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">The solution</p><h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">One connected path from customer intent to business operation.</h2></div>
          <ol className="mt-12 grid gap-3 lg:grid-cols-6">
            {solutionFlow.map((step, index) => (
              <li className="relative" key={step}>
                <div className="nexus-card flex min-h-36 flex-col justify-between rounded-[var(--nexus-radius-control)] p-4"><span className="nexus-subtle text-[10px] tabular-nums">0{index + 1}</span><span className="nexus-heading text-sm font-medium leading-5">{step}</span></div>
                {index < solutionFlow.length - 1 ? <span aria-hidden="true" className="nexus-subtle block py-2 text-center text-sm lg:absolute lg:-right-2.5 lg:top-1/2 lg:z-10 lg:-translate-y-1/2 lg:py-0"><span className="lg:hidden">↓</span><span className="hidden lg:inline">→</span></span> : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-white/[0.018] px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.76fr_1.24fr] lg:items-end"><div><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Nexus Direct model</p><h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Customer experience and fulfilment, designed together.</h2></div><p className="nexus-copy max-w-2xl text-base leading-7 lg:justify-self-end">This implementation fits businesses whose direct customer channel—such as meal plans, subscriptions, catering, or cloud-kitchen ordering—is itself a core operating workflow.</p></div>
          <CraveItSystemMap className="mt-12" />
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl"><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">What Nexus built</p><h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">A product system—not a collection of pages.</h2></div>
          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {builtScope.map(([title, description], index) => <article className={`nexus-card min-h-52 rounded-[var(--nexus-radius-control)] p-5 ${index === builtScope.length - 1 ? "lg:col-span-3" : ""}`} key={title}><span className="nexus-subtle text-xs tabular-nums">0{index + 1}</span><h3 className="nexus-heading mt-8 text-base font-medium">{title}</h3><p className="nexus-copy mt-3 max-w-2xl text-sm leading-6">{description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-white/[0.018] px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div><p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Reusable foundation</p><h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em]">One direct channel, adaptable foundation.</h2><p className="nexus-copy mt-5 text-base leading-7">Crave It demonstrates the Nexus Direct model: build a strong direct-commerce core, then configure it around the business offering and fulfilment workflow. It is not a claim that Nexus replaces every dine-in system.</p></div>
          <div className="nexus-frame rounded-[var(--nexus-radius-surface)] p-1"><ol className="nexus-surface rounded-[calc(var(--nexus-radius-surface)-0.3rem)] p-5 sm:p-7">{reusableFoundation.map((step, index) => <li className="flex items-center gap-4 border-b border-white/[0.08] py-4 first:pt-0 last:border-0 last:pb-0" key={step}><span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/[0.1] text-[10px] text-[var(--nexus-text-muted)]">0{index + 1}</span><span className="nexus-heading text-sm font-medium">{step}</span>{index < reusableFoundation.length - 1 ? <span aria-hidden="true" className="nexus-subtle ml-auto">↓</span> : null}</li>)}</ol></div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="nexus-frame mx-auto max-w-7xl rounded-[var(--nexus-radius-surface)] p-1">
          <div className="nexus-surface rounded-[calc(var(--nexus-radius-surface)-0.3rem)] px-6 py-16 text-center sm:px-10 sm:py-20">
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Build with Nexus</p>
            <h2 className="nexus-heading mx-auto mt-5 max-w-4xl font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Is a direct channel central to your business?</h2>
            <p className="nexus-copy mx-auto mt-5 max-w-xl text-base leading-7">Nexus Direct can be scoped around the customer journey and operational workflow that make that channel work.</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link className="nexus-button-primary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/contact?industry=restaurants&source_page=%2Fcase-studies%2Fcrave-it">Talk to Nexus <span aria-hidden="true" className="ml-2">→</span></Link><Link className="nexus-button-secondary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/restaurants">Explore restaurant intelligence</Link></div>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
