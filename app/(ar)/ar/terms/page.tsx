import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { arPageMetadata } from "@/app/metadata";
import { termsAr } from "@/lib/i18n/legal";

export const metadata: Metadata = arPageMetadata(termsAr.metadataTitle, termsAr.metadataDescription, "/terms");

export default function ArabicTermsPage() {
  return <LegalPage appliesNote={termsAr.appliesNote} eyebrow={termsAr.eyebrow} intro={termsAr.intro} locale="ar" title={termsAr.title} sections={termsAr.sections.map((section) => ({ title: section.title, content: <p>{section.body}</p> }))} />;
}
