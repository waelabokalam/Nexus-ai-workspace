import type { Metadata } from "next";
import SupportWorkspace from "@/components/support/SupportWorkspace";
import { pageMetadata } from "@/app/metadata";

export const metadata: Metadata = pageMetadata("TQEN Agent", "Try the live TQEN Agent workspace with real workflow visibility.", "/demo/support");

export default function SupportDemoPage() {
  return <SupportWorkspace />;
}
