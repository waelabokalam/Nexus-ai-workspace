import type { Metadata } from "next";
import Link from "next/link";
import MarketingPage from "@/components/MarketingPage";
import ContactEmailActions from "@/components/ContactEmailActions";
import { arPageMetadata } from "@/app/metadata";
import { siteConfig } from "@/app/site-config";
import { contactAr } from "@/lib/i18n/contact";
import { localeHref } from "@/lib/i18n/routing";

export const metadata: Metadata = arPageMetadata(contactAr.metadataTitle, contactAr.metadataDescription, "/contact");

export default function ArabicContactPage() {
  const contactEmail = siteConfig.contactEmail;

  return (
    <MarketingPage locale="ar">
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">{contactAr.eyebrow}</p>
            <h1 className="nexus-heading mt-5 font-heading text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">{contactAr.title}</h1>
            <p className="nexus-copy mt-6 max-w-2xl text-lg leading-8">{contactAr.intro}</p>
            <div className="mt-12 border-t border-[var(--nexus-border)]">
              {contactAr.options.map((option) => (
                <div className="border-b border-[var(--nexus-border)] py-5" key={option.title}>
                  <p className="nexus-heading text-sm font-semibold">{option.title}</p>
                  <p className="nexus-copy mt-1.5 text-sm leading-6">{option.description}</p>
                </div>
              ))}
            </div>
          </div>

        <div className="nexus-surface h-fit rounded-[var(--nexus-radius-surface)] p-6 sm:p-8">
          {contactEmail ? (
            <>
              <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">{contactAr.directLabel}</p>
              <a className="nexus-heading nexus-focus mt-3 inline-block break-all text-lg font-medium underline decoration-current/30 underline-offset-4 transition hover:decoration-current" dir="ltr" href={`mailto:${contactEmail}`}>{contactEmail}</a>
              <p className="nexus-copy mt-4 text-sm leading-6">{contactAr.emailHint}</p>
              <ContactEmailActions copiedLabel={contactAr.copied} copyLabel={contactAr.copyEmail} email={contactEmail} sendLabel={contactAr.sendEmail} />
            </>
          ) : (
            <>
              <p className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">{siteConfig.isProduction ? contactAr.prodTitle : contactAr.devTitle}</p>
              <p className="nexus-copy mt-3 text-sm leading-6">{siteConfig.isProduction ? contactAr.prodCopy : contactAr.devCopy}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="nexus-button-primary nexus-focus inline-flex min-h-11 items-center rounded-[var(--nexus-radius-control)] px-4 text-sm font-medium" href={localeHref(contactAr.agentHref, "ar")}>{contactAr.agentCta}</Link>
                <Link className="nexus-button-secondary nexus-focus inline-flex min-h-11 items-center rounded-[var(--nexus-radius-control)] px-4 text-sm font-medium" href={localeHref(contactAr.featuresHref, "ar")}>{contactAr.featuresCta}</Link>
              </div>
            </>
          )}
        </div>
        </div>
      </section>
    </MarketingPage>
  );
}
