import type { Metadata } from "next";
import MarketingPage from "@/components/MarketingPage";
import {
  RestaurantControlAndScope,
  RestaurantHero,
  RestaurantIntegrationBoundary,
  RestaurantIntelligence,
  RestaurantManagementStory,
  RestaurantPilot,
} from "@/components/marketing/RestaurantMarketing";
import { pageMetadata } from "@/app/metadata";

export const metadata: Metadata = pageMetadata(
  "Restaurant Operations",
  "Nexus Restaurant is a pilot-ready Manager Command Center for attention, approvals, reputation, supplier costs, invoice extraction and multi-branch operations.",
  "/restaurants",
);

export default function RestaurantsPage() {
  return (
    <MarketingPage>
      <RestaurantHero />
      <RestaurantManagementStory />
      <RestaurantIntelligence />
      <RestaurantControlAndScope />
      <RestaurantIntegrationBoundary />
      <RestaurantPilot />
    </MarketingPage>
  );
}
