import type { Metadata } from "next";
import Link from "next/link";
import MarketingPage from "@/components/MarketingPage";
import ContactEmailActions from "@/components/ContactEmailActions";
import { pageMetadata } from "@/app/metadata";
import { siteConfig } from "@/app/site-config";

export const metadata: Metadata = pageMetadata("Contact", "Tell Nexus how your business works and discuss the right operational system, pilot or product scope.", "/contact");

export default function ContactPage() {
  const contactEmail = siteConfig.contactEmail;

  return (
    <MarketingPage>
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Talk to Nexus</p>
            <h1 className="nexus-heading mt-5 font-heading text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">Tell us how your business works.</h1>
            <p className="nexus-copy mt-6 max-w-2xl text-lg leading-8">Describe the work that repeats, the tools involved and the decisions your team still needs to make. We can identify what may be worth automating, connecting or rebuilding.</p>
            <div className="mt-12 border-t border-[var(--nexus-border)]">
              {[
                ["Restaurant pilot", "Run the current operational product with a real restaurant for 30 days."],
                ["Custom system", "Scope an application, platform, agent, automation or connected workflow."],
                ["Retail direction", "Discuss operational intelligence or loss-prevention needs while the vertical is in development."],
              ].map(([title, description]) => (
                <div className="border-b border-[var(--nexus-border)] py-5" key={title}>
                  <p className="nexus-heading text-sm font-semibold">{title}</p>
                  <p className="nexus-copy mt-1.5 text-sm leading-6">{description}</p>
                </div>
              ))}
            </div>
          </div>

        <div className="nexus-surface h-fit rounded-[var(--nexus-radius-surface)] p-6 sm:p-8">
          {contactEmail ? (
            <>
              <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">Direct contact</p>
              <a className="nexus-heading nexus-focus mt-3 inline-block break-all text-lg font-medium underline decoration-current/30 underline-offset-4 transition hover:decoration-current" href={`mailto:${contactEmail}`}>{contactEmail}</a>
              <p className="nexus-copy mt-4 text-sm leading-6">Include your industry, current process, the main bottleneck and the result you want. A useful first reply can then focus on scope rather than a generic sales call.</p>
              <ContactEmailActions email={contactEmail} />
            </>
          ) : (
            <>
              <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">{siteConfig.isProduction ? "Contact route" : "Development configuration"}</p>
              <p className="nexus-copy mt-3 text-sm leading-6">{siteConfig.isProduction ? "Direct email is being configured. You can still explore the live product experiences or review the current system capabilities." : "Set NEXT_PUBLIC_CONTACT_EMAIL to enable the public email actions. No contact address is displayed until a real address is configured."}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="nexus-button-primary nexus-focus inline-flex min-h-11 items-center rounded-[var(--nexus-radius-control)] px-4 text-sm font-medium" href="/demo/support">Talk to the Nexus Agent</Link>
                <Link className="nexus-button-secondary nexus-focus inline-flex min-h-11 items-center rounded-[var(--nexus-radius-control)] px-4 text-sm font-medium" href="/features">Explore what we build</Link>
              </div>
            </>
          )}
        </div>
        </div>
      </section>
    </MarketingPage>
  );
}
