import type { Metadata } from "next";
import Link from "next/link";
import MarketingPage from "@/components/MarketingPage";
import { pageMetadata } from "@/app/metadata";

export const metadata: Metadata = pageMetadata("Pricing", "Early-access Nexus plans for business communication workflows.", "/pricing");

const plans = [
  {
    name: "Starter",
    price: "$79",
    audience: "A focused website assistant for a single business communication workflow.",
    availability: "Current website scope",
    recommended: false,
    items: [
      ["Website assistant", "Available"],
      ["Business knowledge", "Available"],
      ["English, Arabic and Turkish", "Available"],
      ["Adaptive communication style", "Available"],
      ["Basic conversation history", "Available"],
    ],
  },
  {
    name: "Growth",
    price: "$149",
    audience: "For teams preparing a broader operational support workflow.",
    availability: "Early-access expansion",
    recommended: true,
    items: [
      ["Everything in Starter", "Included"],
      ["Lead capture", "Planned"],
      ["Google Calendar scheduling", "Configured workflows"],
      ["Business notifications", "Planned"],
      ["Human handoff", "Planned"],
      ["Basic analytics", "Planned"],
    ],
  },
  {
    name: "Custom",
    price: "From $249",
    audience: "For a business workflow that needs dedicated configuration and rollout planning.",
    availability: "Scoped with your team",
    recommended: false,
    items: [
      ["Custom workflows", "Early access"],
      ["Integrations", "Scoped"],
      ["Multiple locations", "Scoped"],
      ["Higher usage", "Scoped"],
      ["Managed onboarding", "Early access"],
    ],
  },
] as const;

export default function PricingPage() {
  return (
    <MarketingPage>
      <section className="mx-auto max-w-7xl px-5 pb-28 pt-20 sm:px-8 sm:pt-28">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">Nexus early access</p>
          <h1 className="mt-5 font-heading text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl">A clear starting point for the work behind every customer reply.</h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400">Choose the business communication scope that fits today, then shape the workflow deliberately as Nexus expands with your team.</p>
        </div>

        <div className="mt-14 grid items-start gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article className={`relative flex min-h-[430px] flex-col rounded-[var(--nexus-radius-surface)] p-6 transition-transform duration-300 hover:-translate-y-1 ${plan.recommended ? "nexus-surface-raised border-white/[0.22]" : "nexus-surface"}`} key={plan.name}>
              {plan.recommended && <span className="absolute right-6 top-6 rounded-full border border-white/[0.16] px-2.5 py-1 text-[11px] font-medium text-zinc-200">Recommended</span>}
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">{plan.availability}</p>
              <h2 className="mt-4 font-heading text-2xl font-medium tracking-[-0.04em] text-white">{plan.name}</h2>
              <p className="mt-4 font-heading text-4xl font-medium tracking-[-0.05em] text-white">{plan.price}<span className="ml-1 text-base font-normal tracking-normal text-zinc-400">/month</span></p>
              <p className="mt-4 min-h-12 text-sm leading-6 text-zinc-400">{plan.audience}</p>
              <ul className="mt-7 space-y-3 border-t border-white/[0.08] pt-2 text-sm leading-6">
                {plan.items.map(([item, state]) => (
                  <li className="flex items-start justify-between gap-4 border-b border-white/[0.07] py-3" key={item}>
                    <span className="text-zinc-300">{item}</span>
                    <span className="shrink-0 text-xs text-zinc-500">{state}</span>
                  </li>
                ))}
              </ul>
              <Link className={`nexus-focus mt-auto inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] px-4 text-sm font-medium transition ${plan.recommended ? "bg-white text-zinc-950 hover:bg-zinc-200" : "border border-white/[0.12] text-white hover:bg-white/[0.06]"}`} href="/contact">Discuss {plan.name}</Link>
            </article>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-6 text-zinc-500">Early-access pricing. Usage limits, onboarding requirements, and custom integrations may affect final pricing.</p>
      </section>
    </MarketingPage>
  );
}
