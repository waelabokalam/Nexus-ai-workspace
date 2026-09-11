import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/app/metadata";
import MarketingPage from "@/components/MarketingPage";
import CraveItSystemMap from "@/components/marketing/CraveItSystemMap";
import SectionReveal from "@/components/marketing/SectionReveal";

export const metadata: Metadata = pageMetadata(
  "Crave It Case Study",
  "How TQEN connected a customer-facing food experience with the operational workflow required to run it.",
  "/case-studies/crave-it",
);

const builtScope = [
  ["Customer experience", "A mobile-aware path for understanding the offering and choosing the right next step."],
  ["Plan and order flow", "Structured capture of the information required to move a customer request forward."],
  ["Customer context", "Account and request information carried into the operational side of the system."],
  ["Admin operations", "A dedicated environment for receiving, reviewing and managing business activity."],
  ["Workflow continuity", "A connected path from the public experience into fulfilment and communication."],
] as const;

export default function CraveItCaseStudyPage() {
  return (
    <MarketingPage>
      <section className="px-5 pb-24 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-20">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Case study</p>
              <span className="nexus-status rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em]">Built system</span>
            </div>
            <h1 className="nexus-heading mt-5 font-heading text-6xl font-semibold tracking-[-0.065em] sm:text-7xl">Crave It</h1>
            <p className="nexus-heading mt-5 max-w-xl font-heading text-2xl font-medium leading-tight tracking-[-0.04em] sm:text-3xl">
              A direct-commerce system designed with the operation behind it.
            </p>
            <p className="nexus-copy mt-6 max-w-xl text-base leading-7">
              Crave It connects a customer journey for food plans and orders with the administrative, fulfilment and communication work required after submission.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="nexus-button-primary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/contact?source=crave-it">
                Discuss a custom system <span aria-hidden="true" className="ml-2">→</span>
              </Link>
              <Link className="nexus-button-secondary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/features#business-systems">
                Explore what we build
              </Link>
            </div>
          </div>
          <CraveItSystemMap />
        </div>
      </section>

      <section className="border-y border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <SectionReveal>
            <div>
              <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">The problem</p>
              <h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
                A polished website was only half the job.
              </h2>
            </div>
          </SectionReveal>
          <SectionReveal>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="nexus-heading text-base font-semibold">For the customer</h3>
                <p className="nexus-copy mt-3 text-sm leading-6">The offering needed to be easy to understand, configure and submit from a phone.</p>
              </div>
              <div>
                <h3 className="nexus-heading text-base font-semibold">For the business</h3>
                <p className="nexus-copy mt-3 text-sm leading-6">Every submission needed to arrive with enough context for the team to review, manage and continue the work.</p>
              </div>
              <p className="nexus-heading border-l-2 border-[var(--nexus-text)] pl-5 text-lg leading-8 sm:col-span-2">
                The product had to connect intent on the front end with operational clarity on the back end.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">What TQEN built</p>
            <h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              One system across both sides of the experience.
            </h2>
          </div>
          <div className="mt-14 border-t border-[var(--nexus-border)]">
            {builtScope.map(([title, description], index) => (
              <SectionReveal key={title}>
                <article className="grid gap-4 border-b border-[var(--nexus-border)] py-7 sm:grid-cols-[4rem_0.65fr_1.35fr] sm:items-start sm:gap-8">
                  <span className="nexus-subtle text-xs tabular-nums">0{index + 1}</span>
                  <h3 className="nexus-heading text-base font-semibold">{title}</h3>
                  <p className="nexus-copy max-w-2xl text-sm leading-6">{description}</p>
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">The proof</p>
              <h2 className="nexus-heading mt-4 font-heading text-4xl font-semibold tracking-[-0.055em]">A useful digital channel must include the work after the click.</h2>
            </div>
            <p className="nexus-copy max-w-2xl text-base leading-7 lg:justify-self-end">
              Crave It demonstrates how TQEN approaches custom systems: understand the customer path, understand fulfilment, then design one product around both. No performance metrics are claimed here; the proof is the connected system itself.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="nexus-frame mx-auto max-w-7xl rounded-[var(--nexus-radius-surface)] p-1">
          <div className="nexus-surface rounded-[calc(var(--nexus-radius-surface)-0.3rem)] px-6 py-16 text-center sm:px-10 sm:py-20">
            <h2 className="nexus-heading mx-auto max-w-4xl font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">What should your system connect?</h2>
            <p className="nexus-copy mx-auto mt-5 max-w-xl text-base leading-7">Tell us where customer intent, internal work and existing tools stop lining up.</p>
            <Link className="nexus-button-primary nexus-focus mt-9 inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/contact?source=crave-it">
              Talk to TQEN <span aria-hidden="true" className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
