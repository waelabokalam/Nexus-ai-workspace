import { createDemoProxy, validateBrowserDemoPayload } from "@/lib/server-demo-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const validateBrowserSupportPayload = validateBrowserDemoPayload;

export const POST = createDemoProxy({
  tenantId: "demo-tenant",
  businessId: "support-demo",
  unavailableMessage: "The support demo is temporarily unavailable. Please try again.",
});
