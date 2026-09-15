import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { arPageMetadata } from "@/app/metadata";
import { privacyAr } from "@/lib/i18n/legal";
import { localeHref } from "@/lib/i18n/routing";

export const metadata: Metadata = arPageMetadata(privacyAr.metadataTitle, privacyAr.metadataDescription, "/privacy");

export default function ArabicPrivacyPage() {
  return <LegalPage appliesNote={privacyAr.appliesNote} eyebrow={privacyAr.eyebrow} intro={privacyAr.intro} locale="ar" title={privacyAr.title} sections={[
    { title: privacyAr.infoTitle, content: <p>{privacyAr.infoBody}</p> },
    { title: privacyAr.sessionTitle, content: <p>{privacyAr.sessionBody}</p> },
    { title: privacyAr.questionsTitle, content: <p>{privacyAr.questionsBefore}<Link className="nexus-focus text-white underline decoration-white/30 underline-offset-4" href={localeHref(privacyAr.contactHref, "ar")}>{privacyAr.questionsLinkLabel}</Link>{privacyAr.questionsAfter}</p> },
  ]} />;
}
