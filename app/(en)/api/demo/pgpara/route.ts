import { createDemoProxy } from "@/lib/server-demo-proxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = createDemoProxy({
  tenantId: "pgpara-demo",
  businessId: "pgpara-assistant",
  unavailableMessage: "The PGPara prototype is temporarily unavailable. Please try again.",
});
