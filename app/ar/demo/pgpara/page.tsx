import type { Metadata } from "next";
import SupportWorkspace from "@/components/support/SupportWorkspace";
import { arPageMetadata } from "@/app/metadata";
import { pgparaArWorkspace, pgparaMetaAr } from "@/lib/i18n/demo";

export const metadata: Metadata = {
  ...arPageMetadata(pgparaMetaAr.title, pgparaMetaAr.description, "/demo/pgpara"),
  robots: { index: false, follow: false },
};

export default function ArabicPGParaDemoPage() {
  return <SupportWorkspace config={pgparaArWorkspace} />;
}
