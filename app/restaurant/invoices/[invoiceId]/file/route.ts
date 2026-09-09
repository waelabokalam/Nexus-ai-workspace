import { NextResponse } from "next/server";

import { createSupplierInvoiceDownloadUrl } from "@/lib/restaurant/invoice-services";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ invoiceId: string }> },
) {
  try {
    const { invoiceId } = await context.params;
    const database = await createSupabaseServerClient();
    const signedUrl = await createSupplierInvoiceDownloadUrl(invoiceId, database);
    return NextResponse.redirect(signedUrl);
  } catch {
    return NextResponse.json({ error: "Invoice file was not found." }, { status: 404 });
  }
}
