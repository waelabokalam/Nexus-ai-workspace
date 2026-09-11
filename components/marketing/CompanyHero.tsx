import Link from "next/link";
import CompanyOperatingModel from "@/components/marketing/CompanyOperatingModel";
import SectionReveal from "@/components/marketing/SectionReveal";

export default function CompanyHero() {
  return (
    <section className="px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)] lg:items-center lg:gap-16">
        <SectionReveal className="max-w-4xl">
          <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">TQEN · Intelligent systems for real business operations</p>
          <h1 className="nexus-heading mt-5 font-heading text-5xl font-semibold leading-[0.94] tracking-[-0.062em] sm:text-6xl lg:text-[4.75rem]">
            <span className="block">Intelligent systems.</span>
            <span className="block">Built around your operation.</span>
          </h1>
          <p className="nexus-copy mt-7 max-w-2xl text-lg leading-8">
            TQEN connects software, AI, automation, data intelligence, integrations and computer vision to handle repetitive work and bring the right decisions to your team.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link className="nexus-button-primary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="#solutions">
              Explore what we build <span aria-hidden="true" className="ml-2">→</span>
            </Link>
            <Link className="nexus-button-secondary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/restaurants">
              Explore TQEN Restaurant
            </Link>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.08}>
          <CompanyOperatingModel />
        </SectionReveal>
      </div>
    </section>
  );
}
