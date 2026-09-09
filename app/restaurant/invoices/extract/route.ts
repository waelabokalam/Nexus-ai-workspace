import { NextResponse } from "next/server";
import { z } from "zod";

import { requireRestaurantAccess } from "@/lib/restaurant/auth";
import { validateInvoiceFile } from "@/lib/restaurant/invoices";
import { PaddleSupplierInvoiceExtractor } from "@/lib/restaurant/paddle-invoice";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const requestSchema = z.object({
  organizationId: z.uuid(),
  languageHint: z.enum(["auto", "en", "ar", "mixed"]),
  defaultCurrency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/),
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("invoiceFile");
    if (!(file instanceof File)) throw new Error("Select an invoice file.");
    const input = requestSchema.parse({
      organizationId: formData.get("organizationId"),
      languageHint: formData.get("languageHint"),
      defaultCurrency: formData.get("defaultCurrency"),
    });
    validateInvoiceFile(file);
    const database = await createSupabaseServerClient();
    await requireRestaurantAccess(input.organizationId, ["owner", "manager"], database);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const extraction = await new PaddleSupplierInvoiceExtractor().extract({
      filename: file.name,
      mimeType: file.type,
      bytes,
      languageHint: input.languageHint,
      defaultCurrency: input.defaultCurrency,
    });
    return NextResponse.json({ extraction }, {
      headers: { "cache-control": "private, no-store, max-age=0" },
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Automatic extraction failed safely.",
    }, {
      status: 422,
      headers: { "cache-control": "private, no-store, max-age=0" },
    });
  }
}
