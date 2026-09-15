import type { Metadata } from "next";
import MarketingPage from "@/components/MarketingPage";
import { pageMetadata } from "@/app/metadata";

export const metadata: Metadata = pageMetadata("About", "TQEN builds serious operational technology around how businesses actually work.", "/about");

export default function AboutPage() {
  return (
    <MarketingPage>
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">About TQEN</p>
            <h1 className="nexus-heading mt-5 font-heading text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">Build around the operation.</h1>
          </div>
          <p className="nexus-copy max-w-2xl text-lg leading-8 lg:justify-self-end">
            TQEN builds intelligent operational systems that understand business context, handle repetitive work and bring people the decisions that need their judgment.
          </p>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-[var(--nexus-radius-surface)] bg-[var(--nexus-border)] md:grid-cols-2">
          {[
            ["Software first", "The product must solve the workflow even when AI is not the right tool for every step."],
            ["AI where useful", "Agents, retrieval and automation are applied where they create a clearer or faster operating path."],
            ["People stay in control", "Safe routine work can move automatically. Sensitive decisions can require approval or human handling."],
            ["Industry context matters", "Useful systems reflect the language, roles, constraints and exceptions of the business using them."],
            ["Connect before replacing", "Where reliable interfaces exist, TQEN can work with existing tools instead of demanding a complete replacement."],
            ["Proof over theatre", "We distinguish what is built, what is in development and what is planned without invented scale or performance claims."],
          ].map(([title, description]) => (
            <article className="bg-[var(--nexus-surface)] p-6 sm:p-8" key={title}>
              <h2 className="nexus-heading font-heading text-2xl font-semibold tracking-[-0.04em]">{title}</h2>
              <p className="nexus-copy mt-4 max-w-lg text-sm leading-6">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-20 grid gap-8 border-t border-[var(--nexus-border)] pt-10 lg:grid-cols-[0.7fr_1.3fr]">
          <h2 className="nexus-heading font-heading text-3xl font-semibold tracking-[-0.045em]">Where the work stands</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div><p className="nexus-heading text-sm font-semibold">TQEN Restaurant</p><p className="nexus-copy mt-2 text-sm leading-6">A real, pilot-ready operational product.</p></div>
            <div><p className="nexus-heading text-sm font-semibold">TQEN Retail</p><p className="nexus-copy mt-2 text-sm leading-6">Operational intelligence and loss-prevention work in development.</p></div>
            <div><p className="nexus-heading text-sm font-semibold">TQEN Vision</p><p className="nexus-copy mt-2 text-sm leading-6">A planned vision-intelligence direction, not a released product.</p></div>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
