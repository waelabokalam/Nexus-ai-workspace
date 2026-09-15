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
import { arPageMetadata } from "@/app/metadata";
import { homeAr } from "@/lib/i18n/home";
import { restaurantMetaAr, restaurantsAr } from "@/lib/i18n/restaurants";

export const metadata: Metadata = arPageMetadata(
  restaurantMetaAr.title,
  restaurantMetaAr.description,
  "/restaurants",
);

export default function ArabicRestaurantsPage() {
  return (
    <MarketingPage locale="ar">
      <RestaurantHero locale="ar" preview={homeAr.productPreview} t={restaurantsAr.hero} />
      <RestaurantManagementStory t={restaurantsAr.management} />
      <RestaurantIntelligence t={restaurantsAr.intelligence} />
      <RestaurantControlAndScope t={restaurantsAr.control} />
      <RestaurantIntegrationBoundary t={restaurantsAr.integration} />
      <RestaurantPilot locale="ar" t={restaurantsAr.pilot} />
    </MarketingPage>
  );
}
