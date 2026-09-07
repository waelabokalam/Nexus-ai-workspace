import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/app/metadata";

export const metadata: Metadata = pageMetadata("Privacy", "Nexus privacy information for the public website and demo.", "/privacy");

export default function PrivacyPage() {
  return <LegalPage title="Privacy" intro="This page describes the current public Nexus website and demo at a high level. It is not a claim of a completed enterprise privacy programme." sections={[
    { title: "Sales requests", content: <p>When you request a conversation, Nexus receives the contact details, business information, selected operational interests and optional problem description you provide. Basic source-page and campaign parameters may also be stored so the team can understand how the request reached Nexus. This information is used to review and follow up on that request.</p> },
    { title: "Information in the demo", content: <p>Messages submitted to the support demo are sent through the Nexus website proxy to the configured development engine so a response can be generated. Avoid entering sensitive, confidential, regulated or personal information in the public demo.</p> },
    { title: "Session identifiers", content: <p>The demo creates conversation and customer identifiers in your browser session storage to keep messages in the same session together. They are not designed as an account or identity system.</p> },
    { title: "Privacy questions", content: <p>Use the <Link className="nexus-focus text-white underline decoration-white/30 underline-offset-4" href="/contact">contact page</Link> when a public contact address is configured. Specific retention, processing and deployment terms should be agreed before a production deployment, including a verified route for privacy requests.</p> },
  ]} />;
}
