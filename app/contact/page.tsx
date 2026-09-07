import type { Metadata } from "next";
import MarketingPage from "@/components/MarketingPage";
import ContactEmailActions from "@/components/ContactEmailActions";
import SalesLeadForm from "@/components/contact/SalesLeadForm";
import { pageMetadata } from "@/app/metadata";
import { siteConfig } from "@/app/site-config";
import { industries, type Industry } from "@/lib/sales-lead";

export const metadata: Metadata = pageMetadata(
  "Talk to Nexus",
  "Tell Nexus how your restaurant or business works and request a focused system conversation.",
  "/contact",
);

type ContactPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function industryValue(value: string | string[] | undefined): Industry {
  const candidate = firstValue(value);
  return candidate && industries.includes(candidate as Industry) ? candidate as Industry : "restaurants";
}

function safeSourcePage(value: string | string[] | undefined) {
  const candidate = firstValue(value);
  return candidate?.startsWith("/") && !candidate.startsWith("//") ? candidate.slice(0, 300) : "/contact";
}

function safeAttribution(value: string | string[] | undefined) {
  return firstValue(value)?.slice(0, 100) || null;
}

const preparationPoints = [
  ["Your current workflow", "Where customer requests arrive and how the team handles them today."],
  ["The operational friction", "The handoffs, repeated work or disconnected tools that slow the business down."],
  ["The right starting scope", "A focused first system that can expand as the workflow proves its value."],
] as const;

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const selectedIndustry = industryValue(params.industry);
  const initialAttribution = {
    industry: selectedIndustry,
    source_page: safeSourcePage(params.source_page),
    utm_source: safeAttribution(params.utm_source),
    utm_medium: safeAttribution(params.utm_medium),
    utm_campaign: safeAttribution(params.utm_campaign),
  };

  return (
    <MarketingPage>
      <section className="px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Build with Nexus</p>
            <h1 className="nexus-heading mt-5 max-w-xl font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-6xl">Tell us how your {selectedIndustry === "restaurants" ? "restaurant" : "business"} works.</h1>
            <p className="nexus-copy mt-6 max-w-xl text-lg leading-8">Nexus systems are configured around the actual workflow of the business. Give us enough context to make the first conversation useful.</p>

            <ol className="mt-10 space-y-0 border-y border-[var(--nexus-border)]">
              {preparationPoints.map(([title, description], index) => (
                <li className="grid grid-cols-[2rem_1fr] gap-3 border-b border-[var(--nexus-border)] py-5 last:border-0" key={title}>
                  <span className="nexus-subtle pt-0.5 text-[10px] tabular-nums">0{index + 1}</span>
                  <div><h2 className="nexus-heading text-sm font-medium">{title}</h2><p className="nexus-copy mt-2 text-sm leading-6">{description}</p></div>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-[var(--nexus-radius-control)] border border-[var(--nexus-border)] bg-[var(--nexus-surface-soft)] p-4">
              <p className="nexus-heading text-sm font-medium">What happens next</p>
              <p className="nexus-copy mt-2 text-sm leading-6">The Nexus team reviews the business context before following up. No response time or implementation scope is promised by this form.</p>
            </div>

            {siteConfig.contactEmail ? (
              <div className="mt-8">
                <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.14em]">Prefer email?</p>
                <a className="nexus-heading nexus-focus mt-3 inline-block break-all text-sm font-medium underline decoration-current/30 underline-offset-4 hover:decoration-current" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
                <ContactEmailActions email={siteConfig.contactEmail} />
              </div>
            ) : null}
          </div>

          <SalesLeadForm contactEmail={siteConfig.contactEmail} initialAttribution={initialAttribution} />
        </div>
      </section>
    </MarketingPage>
  );
}
