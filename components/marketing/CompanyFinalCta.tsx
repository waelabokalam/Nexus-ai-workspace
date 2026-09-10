import Link from "next/link";
import SectionReveal from "@/components/marketing/SectionReveal";

export default function CompanyFinalCta() {
  return (
    <section className="border-t border-[var(--nexus-border)] px-5 py-20 sm:px-8 sm:py-24">
      <SectionReveal className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="nexus-heading max-w-3xl font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl">Tell us how your business works.</h2>
          <p className="nexus-copy mt-4 max-w-xl text-base leading-7">We will identify a focused place to automate, connect or improve.</p>
        </div>
        <Link className="nexus-button-primary nexus-focus inline-flex min-h-12 shrink-0 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/contact">Talk to Nexus <span aria-hidden="true" className="ml-2">→</span></Link>
      </SectionReveal>
    </section>
  );
}
