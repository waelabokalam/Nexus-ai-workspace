import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import RestaurantProductPreview from "@/components/marketing/RestaurantProductPreview";
import SectionReveal from "@/components/marketing/SectionReveal";

const builtCapabilities = [
  "Daily Manager Brief",
  "Attention and approval queues",
  "Reputation intelligence",
  "Supplier invoice intelligence",
  "Automatic invoice extraction",
  "Multi-branch roles and activity history",
] as const;

export default function RestaurantFlagship() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28" id="restaurant-flagship">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <span className="nexus-status inline-flex rounded-full px-3 py-1 text-xs font-medium">TQEN Restaurant · Pilot ready</span>
            <h2 className="nexus-heading mt-5 font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl">Run every location without carrying every location in your head.</h2>
            <p className="nexus-copy mt-5 max-w-xl text-base leading-7">The Manager Command Center brings operational exceptions, approvals, reputation signals and supplier costs into one review surface. TQEN watches operations and surfaces what changed, what is abnormal, and what needs a manager, an owner, or no one.</p>
          </div>
          <RestaurantProductPreview />
        </SectionReveal>

        <SectionReveal className="mt-8 grid gap-6 border-t border-[var(--nexus-border)] pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2" aria-label="Built Restaurant V1 capabilities">
            {builtCapabilities.map((item) => <li className="nexus-copy flex items-start gap-2.5 text-sm leading-6" key={item}><CheckCircle2 aria-hidden="true" className="nexus-heading mt-1 size-4 shrink-0" strokeWidth={1.55} />{item}</li>)}
          </ul>
          <Link className="nexus-button-primary nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/restaurants">Explore TQEN Restaurant <ArrowRight aria-hidden="true" className="ml-2 size-4" strokeWidth={1.6} /></Link>
        </SectionReveal>
      </div>
    </section>
  );
}
