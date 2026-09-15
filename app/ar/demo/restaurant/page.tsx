import type { Metadata } from "next";
import SupportWorkspace from "@/components/support/SupportWorkspace";
import { arPageMetadata } from "@/app/metadata";
import { restaurantArWorkspace, restaurantMetaAr } from "@/lib/i18n/demo";

export const metadata: Metadata = arPageMetadata(restaurantMetaAr.title, restaurantMetaAr.description, "/demo/restaurant");

export default function ArabicRestaurantDemoPage() {
  return <SupportWorkspace config={restaurantArWorkspace} />;
}
