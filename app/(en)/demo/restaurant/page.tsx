import type { Metadata } from "next";
import SupportWorkspace, { type WorkspaceConfig } from "@/components/support/SupportWorkspace";
import { pageMetadata } from "@/app/metadata";
import {
  restaurantCapabilities,
  restaurantIntegrationTools,
  restaurantSecondaryPrompts,
  restaurantStarterPrompts,
} from "@/data/restaurant-demo";

export const metadata: Metadata = {
  ...pageMetadata(
    "Saray Sofrasi Restaurant Demo",
    "Ask about the menu in Turkish, Arabic, or English and book a real table through the TQEN restaurant workspace.",
    "/demo/restaurant",
  ),
};

export const restaurantWorkspaceConfig: WorkspaceConfig = {
  brandName: "Saray Sofrasi",
  assistantName: "Saray Assistant",
  headerTitle: "Saray Sofrasi",
  headerSubtext: "AI-powered guest service and reservations",
  workspaceTitle: "Saray Sofrasi — Restaurant Demo",
  emptyTitle: "Ask about the menu or book a table to start a live TQEN Engine session.",
  emptyDescription: "Ask in Turkish, Arabic, or English. Confirmed reservations create real calendar events.",
  prompts: restaurantStarterPrompts,
  secondaryPrompts: restaurantSecondaryPrompts,
  capabilityGroups: restaurantCapabilities,
  integrationTools: restaurantIntegrationTools,
  composerPlaceholder: "Ask about the menu, hours, or book a table…",
  composerLabel: "Message Saray Sofrasi",
  endpoint: "/api/demo/restaurant",
  sessionNamespace: "restaurant",
  unavailableMessage: "The restaurant demo could not complete that request. Please try again.",
};

export default function RestaurantDemoPage() {
  return <SupportWorkspace config={restaurantWorkspaceConfig} />;
}
