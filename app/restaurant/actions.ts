"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  processManagerApproval,
  updateManagerAttentionItem,
} from "@/lib/restaurant/services";
import { isRestaurantMutationAlreadyApplied } from "@/lib/restaurant/errors";
import {
  processSupplierInvoice,
  reviewSupplierInvoice,
} from "@/lib/restaurant/invoice-services";
import { parseManualInvoiceItems } from "@/lib/restaurant/invoices";
import { ReviewedPaddleDraftSupplierInvoiceExtractor } from "@/lib/restaurant/paddle-invoice";

const attentionActionSchema = z.object({
  organizationId: z.uuid(),
  attentionId: z.uuid(),
  status: z.enum(["open", "assigned", "resolved", "dismissed"]),
  assignedTo: z.uuid().nullable().optional(),
});

const approvalActionSchema = z.object({
  organizationId: z.uuid(),
  approvalId: z.uuid(),
  decision: z.enum(["approved", "edited", "rejected"]),
  reviewerNote: z.string().trim().max(2_000).nullable(),
  editedActionJson: z.string().max(12_000).nullable(),
  editedMessage: z.string().trim().max(4_000).nullable(),
});

const invoiceReviewActionSchema = z.object({
  organizationId: z.uuid(),
  invoiceId: z.uuid(),
  decision: z.enum(["reviewed", "dismissed"]),
});

export type InvoiceUploadActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

function optionalNumber(value: FormDataEntryValue | null) {
  return value === null || value === "" ? null : Number(value);
}

function automaticRawExtraction(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.length > 60_000) {
    throw new Error("The automatic extraction evidence is invalid. Extract the invoice again.");
  }
  const parsed = JSON.parse(value) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("The automatic extraction evidence is invalid. Extract the invoice again.");
  }
  return parsed;
}

export async function uploadSupplierInvoiceAction(
  _previousState: InvoiceUploadActionState,
  formData: FormData,
): Promise<InvoiceUploadActionState> {
  try {
    const file = formData.get("invoiceFile");
    if (!(file instanceof File)) throw new Error("Select an invoice file.");
    const branchValue = formData.get("branchId");
    const extractionMode = formData.get("extractionMode") === "manual" ? "manual" : "automatic";
    if (extractionMode === "automatic" && formData.get("automaticDraft") !== "reviewed") {
      throw new Error("Extract and review the automatic draft before processing it.");
    }
    const manualExtraction = {
      supplierName: formData.get("supplierName"),
      taxIdentifier: formData.get("taxIdentifier") || null,
      invoiceNumber: formData.get("invoiceNumber") || null,
      invoiceDate: formData.get("invoiceDate"),
      currency: formData.get("currency"),
      subtotal: optionalNumber(formData.get("subtotal")),
      taxTotal: optionalNumber(formData.get("taxTotal")),
      total: Number(formData.get("total")),
      confidence: extractionMode === "automatic" ? Number(formData.get("extractionConfidence")) : 1,
      lineItems: parseManualInvoiceItems(String(formData.get("lineItems") ?? "")),
      rawExtraction: extractionMode === "automatic"
        ? automaticRawExtraction(formData.get("rawExtraction"))
        : { mode: "manual_structured_v1" },
    };
    await processSupplierInvoice({
      organizationId: formData.get("organizationId"),
      branchId: branchValue || null,
      file,
      manualExtraction,
      languageHint: extractionMode === "automatic" ? formData.get("languageHint") : "auto",
      defaultCurrency: extractionMode === "automatic" ? formData.get("currencyHint") : undefined,
    }, extractionMode === "automatic"
      ? { extractor: new ReviewedPaddleDraftSupplierInvoiceExtractor() }
      : undefined);
    revalidatePath("/restaurant");
    return {
      status: "success",
      message: extractionMode === "automatic"
        ? "Reviewed automatic draft validated and processed. Check any remaining price or match flags below."
        : "Invoice uploaded and processed with manual structured entry.",
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Invoice processing failed safely.";
    return {
      status: "error",
      message: `${detail} The source was not persisted; use manual fallback if needed.`,
    };
  }
}

export async function reviewSupplierInvoiceAction(formData: FormData) {
  const input = invoiceReviewActionSchema.parse({
    organizationId: formData.get("organizationId"),
    invoiceId: formData.get("invoiceId"),
    decision: formData.get("decision"),
  });
  try {
    await reviewSupplierInvoice(input);
  } catch (error) {
    if (!isRestaurantMutationAlreadyApplied(error)) throw error;
  }
  revalidatePath("/restaurant");
}

export async function updateAttentionAction(formData: FormData) {
  const status = formData.get("status");
  const assignedToValue = formData.get("assignedTo");
  const candidate: Record<string, unknown> = {
    organizationId: formData.get("organizationId"),
    attentionId: formData.get("attentionId"),
    status,
  };

  if (status === "assigned") candidate.assignedTo = assignedToValue;
  if (status === "open") candidate.assignedTo = null;

  const input = attentionActionSchema.parse(candidate);
  try {
    await updateManagerAttentionItem(input);
  } catch (error) {
    if (!isRestaurantMutationAlreadyApplied(error)) throw error;
  }
  revalidatePath("/restaurant");
}

export async function processApprovalAction(formData: FormData) {
  const parsed = approvalActionSchema.parse({
    organizationId: formData.get("organizationId"),
    approvalId: formData.get("approvalId"),
    decision: formData.get("decision"),
    reviewerNote: formData.get("reviewerNote") || null,
    editedActionJson: formData.get("editedActionJson") || null,
    editedMessage: formData.get("editedMessage") || null,
  });

  let editedAction: unknown = null;
  if (parsed.decision === "edited") {
    const original = parsed.editedActionJson
      ? (JSON.parse(parsed.editedActionJson) as unknown)
      : {};
    if (!original || typeof original !== "object" || Array.isArray(original)) {
      throw new Error("The proposed action cannot be edited in its current format.");
    }
    editedAction = {
      ...original,
      ...(parsed.editedMessage ? { message: parsed.editedMessage } : {}),
    };
  }

  try {
    await processManagerApproval({
      organizationId: parsed.organizationId,
      approvalId: parsed.approvalId,
      decision: parsed.decision,
      reviewerNote: parsed.reviewerNote,
      editedAction,
    });
  } catch (error) {
    if (!isRestaurantMutationAlreadyApplied(error)) throw error;
  }
  revalidatePath("/restaurant");
}
