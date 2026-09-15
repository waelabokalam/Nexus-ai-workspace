import { createDemoProxy, validateBrowserDemoPayload } from "@/lib/server-demo-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const validateBrowserSupportPayload = validateBrowserDemoPayload;

export const POST = createDemoProxy({
  tenantId: "tqen",
  businessId: "tqen-agent",
  unavailableMessage: "The TQEN Agent is temporarily unavailable. Please try again.",
});
