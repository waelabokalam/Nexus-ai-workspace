"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  processManagerApproval,
  updateManagerAttentionItem,
} from "@/lib/restaurant/services";

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
  await updateManagerAttentionItem(input);
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

  await processManagerApproval({
    organizationId: parsed.organizationId,
    approvalId: parsed.approvalId,
    decision: parsed.decision,
    reviewerNote: parsed.reviewerNote,
    editedAction,
  });
  revalidatePath("/restaurant");
}
