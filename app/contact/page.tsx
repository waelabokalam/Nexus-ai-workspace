import type { Metadata } from "next";
import Link from "next/link";
import MarketingPage from "@/components/MarketingPage";
import ContactEmailActions from "@/components/ContactEmailActions";
import { pageMetadata } from "@/app/metadata";
import { siteConfig } from "@/app/site-config";

export const metadata: Metadata = pageMetadata("Contact", "Contact Nexus about an early-access business communication workflow.", "/contact");

export default function ContactPage() {
  const contactEmail = siteConfig.contactEmail;

  return (
    <MarketingPage>
      <section className="mx-auto max-w-4xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">Contact</p>
        <h1 className="mt-5 font-heading text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl">Start with the workflow.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">For pilots, custom plans, partnerships and product questions, begin with the customer conversation, business knowledge and action you want Nexus to support.</p>

        <div className="nexus-surface mt-10 max-w-2xl rounded-[var(--nexus-radius-surface)] p-6 sm:p-7">
          {contactEmail ? (
            <>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">Public contact</p>
              <a className="nexus-focus mt-3 inline-block break-all text-lg font-medium text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white" href={`mailto:${contactEmail}`}>{contactEmail}</a>
              <p className="mt-4 text-sm leading-6 text-zinc-400">Share the communication workflow you want to improve, and the team can discuss the right early-access scope.</p>
              <ContactEmailActions email={contactEmail} />
            </>
          ) : (
            <>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">{siteConfig.isProduction ? "Contact unavailable" : "Development configuration"}</p>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{siteConfig.isProduction ? "A public contact address has not been configured yet. Please return when this page has been updated." : "Set NEXT_PUBLIC_CONTACT_EMAIL to enable the public email actions. No contact address is displayed until a real address is configured."}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="nexus-focus inline-flex min-h-11 items-center rounded-[var(--nexus-radius-control)] bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200" href="/demo">Open the Demo Hub</Link>
                <Link className="nexus-focus inline-flex min-h-11 items-center rounded-[var(--nexus-radius-control)] border border-white/[0.12] px-4 text-sm font-medium text-white transition hover:bg-white/[0.06]" href="/docs">Read the documentation</Link>
              </div>
            </>
          )}
        </div>
      </section>
    </MarketingPage>
  );
}
