import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/app/metadata";

export const metadata: Metadata = pageMetadata("Terms", "Terms for using the Nexus public website and demo.", "/terms");

export default function TermsPage() {
  return <LegalPage title="Terms" intro="These terms apply to the current public Nexus website and early-access demo." sections={[
    { title: "Demo use", content: <p>The demo is provided for evaluation. Do not rely on demo output as legal, medical, financial or other professional advice, and do not submit information that should not be used in a public evaluation environment.</p> },
    { title: "Early-access product", content: <p>Features, availability and plan descriptions may change. A production deployment, support commitment, data-processing terms or commercial subscription requires a separate written agreement.</p> },
    { title: "Acceptable use", content: <p>Do not use the website or demo to abuse services, probe for credentials, interfere with availability, submit unlawful content or attempt to access systems or data without permission.</p> },
  ]} />;
}
