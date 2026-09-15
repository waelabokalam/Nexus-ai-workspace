import type { Metadata } from "next";
import SupportWorkspace from "@/components/support/SupportWorkspace";
import { arPageMetadata } from "@/app/metadata";
import { supportArWorkspace, supportMetaAr } from "@/lib/i18n/demo";

export const metadata: Metadata = arPageMetadata(supportMetaAr.title, supportMetaAr.description, "/demo/support");

export default function ArabicSupportDemoPage() {
  return <SupportWorkspace config={supportArWorkspace} />;
}
