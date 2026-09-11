import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  Building2,
  CheckCircle2,
  FileSearch,
  History,
  MessageSquareWarning,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import RestaurantProductPreview from "@/components/marketing/RestaurantProductPreview";
import SectionReveal from "@/components/marketing/SectionReveal";

const built = [
  "Manager Command Center",
  "Daily Manager Brief",
  "Attention and approval workflows",
  "Reputation intelligence",
  "Supplier invoice intelligence",
  "Automatic invoice extraction",
  "Multi-branch roles",
  "Activity and audit history",
] as const;

const integrationNext = ["POS providers", "Delivery platforms", "WhatsApp manager delivery", "Other external restaurant systems"] as const;

const pilotChecks = [
  "Management time spent checking systems",
  "Operational issues surfaced for review",
  "Repetitive work that can be handled safely",
  "Supplier and cost changes caught",
  "Recurring customer issues detected",
] as const;

export function RestaurantHero() {
  return (
    <section className="px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-14">
        <SectionReveal>
          <span className="nexus-status inline-flex rounded-full px-3 py-1 text-xs font-medium">TQEN Restaurant · Pilot ready</span>
          <h1 className="nexus-heading mt-6 font-heading text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-6xl">
            <span className="block">Run every location without</span>
            <span className="block">carrying every location in your head.</span>
          </h1>
          <p className="nexus-copy mt-6 max-w-xl text-lg leading-8">A command center for attention, approvals, reputation, supplier costs and the daily decisions that need management.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="nexus-button-primary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/contact?industry=restaurant&intent=pilot">Apply for a 30-day pilot</Link>
            <Link className="nexus-button-secondary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="#command-center">See the command center</Link>
          </div>
        </SectionReveal>
        <SectionReveal delay={0.08}><RestaurantProductPreview /></SectionReveal>
      </div>
    </section>
  );
}

export function RestaurantManagementStory() {
  return (
    <section className="border-y border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-20 sm:px-8 sm:py-28" id="command-center">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="max-w-3xl"><h2 className="nexus-heading font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">One place to see what changed, what matters, and who should act.</h2><p className="nexus-copy mt-5 max-w-2xl text-base leading-7">TQEN Restaurant turns persisted operational events into a daily management view. It watches operations and surfaces the exceptions that deserve attention: what changed, what is abnormal, what TQEN can handle, what needs a manager, and what needs the owner. It does not replace judgment or hide important work.</p></SectionReveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <SectionReveal className="nexus-surface rounded-[var(--nexus-radius-surface)] p-6 sm:p-8">
            <div className="flex items-center gap-3"><Activity aria-hidden="true" className="nexus-heading size-5" strokeWidth={1.5} /><h3 className="nexus-heading text-lg font-medium">Daily Manager Brief</h3></div>
            <p className="nexus-copy mt-4 max-w-2xl text-sm leading-6">Each business day begins with the current operational picture: high-priority attention, pending approvals, human escalations and work already handled by TQEN.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {["Needs attention", "Waiting for approval", "Handled by TQEN"].map((item) => <div className="nexus-control rounded-[var(--nexus-radius-control)] p-4" key={item}><p className="nexus-heading text-sm font-medium">{item}</p><p className="nexus-subtle mt-2 text-xs leading-5">Only persisted operational events appear here.</p></div>)}
            </div>
          </SectionReveal>
          <SectionReveal className="nexus-surface flex flex-col rounded-[var(--nexus-radius-surface)] p-6 sm:p-8" delay={0.05}>
            <AlertTriangle aria-hidden="true" className="nexus-heading size-6" strokeWidth={1.5} />
            <h3 className="nexus-heading mt-8 text-xl font-medium">Exception-first management</h3>
            <p className="nexus-copy mt-3 text-sm leading-6">Owners and managers review the work that needs a decision instead of repeatedly checking every source system.</p>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

export function RestaurantIntelligence() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="max-w-3xl"><h2 className="nexus-heading font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Operational intelligence that leads to reviewable work.</h2></SectionReveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionReveal className="nexus-surface rounded-[var(--nexus-radius-surface)] p-6 sm:p-8">
            <MessageSquareWarning aria-hidden="true" className="nexus-heading size-6" strokeWidth={1.5} />
            <h3 className="nexus-heading mt-8 text-2xl font-medium tracking-[-0.035em]">Reputation intelligence</h3>
            <p className="nexus-copy mt-4 text-sm leading-6">Reviews are normalized into sentiment, topics and severity. Repeated negative themes become visible, while high-risk issues remain human decisions.</p>
          </SectionReveal>
          <SectionReveal className="nexus-surface rounded-[var(--nexus-radius-surface)] p-6 sm:p-8" delay={0.05}>
            <FileSearch aria-hidden="true" className="nexus-heading size-6" strokeWidth={1.5} />
            <h3 className="nexus-heading mt-8 text-2xl font-medium tracking-[-0.035em]">Supplier cost intelligence</h3>
            <p className="nexus-copy mt-4 max-w-2xl text-sm leading-6">Reviewed invoices build supplier and item price history. Material changes, mismatched totals, currency changes and ambiguous items stay visible for manager review.</p>
          </SectionReveal>
          <SectionReveal className="nexus-surface grid gap-8 rounded-[var(--nexus-radius-surface)] p-6 sm:p-8 lg:col-span-2 lg:grid-cols-[auto_1fr_1fr] lg:items-center">
            <ArrowDownToLine aria-hidden="true" className="nexus-heading size-7" strokeWidth={1.5} />
            <div><h3 className="nexus-heading text-2xl font-medium tracking-[-0.035em]">Automatic invoice extraction</h3><p className="nexus-copy mt-3 text-sm leading-6">Private invoice files are extracted into an editable draft. A manager reviews and corrects the draft before it enters the supplier intelligence workflow.</p></div>
            <div className="nexus-control rounded-[var(--nexus-radius-control)] p-4"><p className="nexus-heading text-sm font-medium">Review before persistence</p><p className="nexus-subtle mt-2 text-xs leading-5">Extraction does not authorize purchasing, accounting, payment or menu-price changes.</p></div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

export function RestaurantControlAndScope() {
  return (
    <section className="border-y border-[var(--nexus-border)] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal>
          <div className="flex items-center gap-3"><UsersRound aria-hidden="true" className="nexus-heading size-5" strokeWidth={1.5} /><h2 className="nexus-heading font-heading text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Built for real organizations.</h2></div>
          <p className="nexus-copy mt-5 text-base leading-7">Organizations, branches, owner, manager and staff roles, authenticated access, and row-level data boundaries are part of the product today.</p>
          <div className="mt-8 flex items-center gap-3"><Building2 aria-hidden="true" className="nexus-subtle size-5" strokeWidth={1.5} /><p className="nexus-heading text-sm font-medium">Multi-branch context stays explicit in the workspace.</p></div>
          <div className="mt-4 flex items-center gap-3"><History aria-hidden="true" className="nexus-subtle size-5" strokeWidth={1.5} /><p className="nexus-heading text-sm font-medium">Activity history records operational decisions.</p></div>
        </SectionReveal>
        <SectionReveal>
          <div className="flex items-center gap-3"><ShieldCheck aria-hidden="true" className="nexus-heading size-5" strokeWidth={1.5} /><h2 className="nexus-heading font-heading text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Humans remain in control.</h2></div>
          <dl className="mt-7 grid gap-3">
            {[["AUTO", "Safe, deterministic work can complete automatically."], ["APPROVAL", "Sensitive work waits for an authorized decision."], ["HUMAN", "High-risk issues move directly to people."]].map(([term, detail]) => <div className="grid grid-cols-[6rem_1fr] gap-4 border-b border-[var(--nexus-border)] pb-4" key={term}><dt className="nexus-heading text-xs font-semibold tracking-[0.04em]">{term}</dt><dd className="nexus-copy text-sm leading-6">{detail}</dd></div>)}
          </dl>
        </SectionReveal>
      </div>
    </section>
  );
}

export function RestaurantIntegrationBoundary() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="max-w-3xl"><h2 className="nexus-heading font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Built product, clear integration boundaries.</h2><p className="nexus-copy mt-5 max-w-2xl text-base leading-7">TQEN can connect existing restaurant systems through provider adapters. We do not claim integrations before they are configured and verified.</p></SectionReveal>
        <div className="mt-12 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <SectionReveal className="nexus-surface rounded-[var(--nexus-radius-surface)] p-6 sm:p-8"><h3 className="nexus-heading text-xl font-medium">Built and pilot ready</h3><ul className="mt-6 grid gap-3 sm:grid-cols-2">{built.map((item) => <li className="nexus-copy flex gap-2.5 text-sm leading-6" key={item}><CheckCircle2 aria-hidden="true" className="nexus-heading mt-1 size-4 shrink-0" strokeWidth={1.5} />{item}</li>)}</ul></SectionReveal>
          <SectionReveal className="nexus-surface rounded-[var(--nexus-radius-surface)] p-6 sm:p-8" delay={0.05}><h3 className="nexus-heading text-xl font-medium">Integration dependent</h3><p className="nexus-copy mt-3 text-sm leading-6">These connections are implemented only after access, scope and provider behavior are confirmed.</p><ul className="mt-6 space-y-3">{integrationNext.map((item) => <li className="nexus-control rounded-lg px-3 py-2.5 text-sm nexus-copy" key={item}>{item}</li>)}</ul></SectionReveal>
        </div>
      </div>
    </section>
  );
}

export function RestaurantPilot() {
  return (
    <section className="border-t border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] px-5 py-20 sm:px-8 sm:py-28" id="restaurant-pilot">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-16">
        <SectionReveal><h2 className="nexus-heading font-heading text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Run TQEN with your restaurant for 30 days.</h2><p className="nexus-copy mt-5 max-w-2xl text-base leading-7">The pilot establishes a focused operational baseline and shows where the product can remove checking, surface issues, and support better decisions.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link className="nexus-button-primary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/contact?industry=restaurant&intent=pilot">Apply for a pilot</Link><Link className="nexus-button-secondary nexus-focus inline-flex min-h-12 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href="/restaurant/login">Existing pilot access</Link></div></SectionReveal>
        <SectionReveal className="nexus-surface rounded-[var(--nexus-radius-surface)] p-6 sm:p-8"><h3 className="nexus-heading text-sm font-medium">What the pilot examines</h3><ul className="mt-6 space-y-4">{pilotChecks.map((item) => <li className="nexus-copy flex gap-3 text-sm leading-6" key={item}><CheckCircle2 aria-hidden="true" className="nexus-heading mt-1 size-4 shrink-0" strokeWidth={1.5} />{item}</li>)}</ul></SectionReveal>
      </div>
    </section>
  );
}
