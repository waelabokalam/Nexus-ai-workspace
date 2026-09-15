import { createDemoProxy, validateBrowserDemoPayload } from "@/lib/server-demo-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const validateBrowserRestaurantPayload = validateBrowserDemoPayload;

export const POST = createDemoProxy({
  tenantId: "demo-tenant",
  businessId: "restaurant-demo",
  unavailableMessage: "The restaurant demo is temporarily unavailable. Please try again.",
});
