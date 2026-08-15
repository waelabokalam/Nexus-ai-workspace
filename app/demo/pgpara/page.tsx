import type { Metadata } from "next";
import SupportWorkspace, { type WorkspaceConfig } from "@/components/support/SupportWorkspace";
import { pageMetadata } from "@/app/metadata";
import {
  pgparaCapabilities,
  pgparaIntegrationTools,
  pgparaSecondaryPrompts,
  pgparaStarterPrompts,
} from "@/data/pgpara-demo";

export const metadata: Metadata = {
  ...pageMetadata(
    "PGPara AI Assistant Prototype",
    "A concept demo of multilingual product and customer assistance for PGPara.",
    "/demo/pgpara",
  ),
  robots: { index: false, follow: false },
};

export const pgparaWorkspaceConfig: WorkspaceConfig = {
  assistantName: "PGPara AI Assistant",
  headerTitle: "PGPara AI Assistant",
  headerSubtext: "AI-powered product and customer assistance",
  prototypeLabel: "PGPara prototype · Concept demo",
  workspaceTitle: "PGPara AI Assistant",
  emptyTitle: "Explore PGPara products and merchant support with a real AI assistance flow.",
  emptyDescription: "Ask in Turkish, Arabic, or English. This concept demo provides product guidance and safe support responses; it does not access account or transaction data.",
  prompts: pgparaStarterPrompts,
  secondaryPrompts: pgparaSecondaryPrompts,
  capabilityGroups: pgparaCapabilities,
  integrationTools: pgparaIntegrationTools,
  composerPlaceholder: "Ask about PGPara products, transfers, or merchant services…",
  composerLabel: "Message PGPara AI Assistant",
  endpoint: "/api/demo/pgpara",
  sessionNamespace: "pgpara",
  unavailableMessage: "The PGPara prototype could not complete that request. Please try again.",
};

export default function PGParaDemoPage() {
  return <SupportWorkspace config={pgparaWorkspaceConfig} />;
}
