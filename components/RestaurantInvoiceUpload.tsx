"use client";

import { useActionState, useState } from "react";
import { FileUp } from "lucide-react";

import {
  uploadSupplierInvoiceAction,
  type InvoiceUploadActionState,
} from "@/app/restaurant/actions";
import type { NormalizedInvoiceExtraction } from "@/lib/restaurant/invoices";

const initialState: InvoiceUploadActionState = { status: "idle", message: "" };

export default function RestaurantInvoiceUpload({
  organizationId,
  branches,
  selectedBranchId,
}: {
  organizationId: string;
  branches: { id: string; name: string }[];
  selectedBranchId: string | null;
}) {
  const [state, action, pending] = useActionState(uploadSupplierInvoiceAction, initialState);
  const [filename, setFilename] = useState("");
  const [extractionMode, setExtractionMode] = useState<"automatic" | "manual">("automatic");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [languageHint, setLanguageHint] = useState<"auto" | "en" | "ar" | "mixed">("auto");
  const [currencyHint, setCurrencyHint] = useState("AED");
  const [draft, setDraft] = useState<NormalizedInvoiceExtraction | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState("");
  const inputClass = "nexus-focus min-h-10 rounded-xl border border-white/[0.1] bg-white/[0.035] px-3 text-sm text-zinc-100 light:border-black/[0.12] light:bg-white light:text-zinc-900";

  async function extractAutomaticDraft() {
    if (!selectedFile) {
      setExtractionError("Select an invoice file first.");
      return;
    }
    setExtracting(true);
    setExtractionError("");
    setDraft(null);
    try {
      const payload = new FormData();
      payload.set("organizationId", organizationId);
      payload.set("invoiceFile", selectedFile);
      payload.set("languageHint", languageHint);
      payload.set("defaultCurrency", currencyHint);
      const response = await fetch("/restaurant/invoices/extract", {
        method: "POST",
        body: payload,
        cache: "no-store",
      });
      const result = await response.json() as {
        extraction?: NormalizedInvoiceExtraction;
        error?: string;
      };
      if (!response.ok || !result.extraction) {
        throw new Error(result.error ?? "Automatic extraction failed safely.");
      }
      setDraft(result.extraction);
    } catch (error) {
      setExtractionError(error instanceof Error ? error.message : "Automatic extraction failed safely.");
    } finally {
      setExtracting(false);
    }
  }

  const draftItems = draft?.lineItems.map((item) => [
    item.rawDescription,
    item.quantity,
    item.unit,
    item.unitPrice,
    item.lineTotal,
    item.extractionConfidence,
  ].join(" | ")).join("\n") ?? "";

  return (
    <details className="mt-4 rounded-2xl border border-white/[0.09] bg-black/10 p-4 light:border-black/[0.1] light:bg-black/[0.02]">
      <summary className="nexus-focus flex cursor-pointer list-none items-center gap-2 rounded-lg text-sm font-medium text-violet-300 light:text-violet-700 [&::-webkit-details-marker]:hidden">
        <FileUp aria-hidden="true" className="size-4" />
        Upload supplier invoice
      </summary>
      <form action={action} className="mt-5 grid gap-4 sm:grid-cols-2">
        <input name="organizationId" type="hidden" value={organizationId} />
        <label className="grid gap-1.5 text-xs text-zinc-400">
          Extraction mode
          <select
            className={inputClass}
            name="extractionMode"
            onChange={(event) => {
              setExtractionMode(event.currentTarget.value === "manual" ? "manual" : "automatic");
              setDraft(null);
              setExtractionError("");
            }}
            value={extractionMode}
          >
            <option value="automatic">Automatic · PaddleOCR</option>
            <option value="manual">Manual structured fallback</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-xs text-zinc-400">
          Branch
          <select className={inputClass} defaultValue={selectedBranchId ?? ""} name="branchId">
            <option value="">Organization-wide purchasing</option>
            {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-xs text-zinc-400 sm:col-span-2">
          Private invoice file
          <input
            accept="application/pdf,image/jpeg,image/png,image/webp"
            className={`${inputClass} py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-400/10 file:px-3 file:py-1.5 file:text-xs file:text-violet-300`}
            name="invoiceFile"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0] ?? null;
              setSelectedFile(file);
              setFilename(file?.name ?? "");
              setDraft(null);
              setExtractionError("");
            }}
            required
            type="file"
          />
          <span className="text-[10px] text-zinc-600">{filename ? `${filename} selected` : "PDF, JPEG, PNG, or WebP · maximum 10 MB"}</span>
        </label>
        {extractionMode === "automatic" ? (
          <>
            <label className="grid gap-1.5 text-xs text-zinc-400">
              Invoice language
              <select
                className={inputClass}
                name="languageHint"
                onChange={(event) => {
                  setLanguageHint(event.currentTarget.value as typeof languageHint);
                  setDraft(null);
                }}
                value={languageHint}
              >
                <option value="auto">Auto / configured default</option>
                <option value="en">English</option>
                <option value="ar">Arabic</option>
                <option value="mixed">Arabic + English</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-xs text-zinc-400">
              Currency fallback
              <input
                className={inputClass}
                maxLength={3}
                minLength={3}
                name="currencyHint"
                onChange={(event) => {
                  setCurrencyHint(event.currentTarget.value.toUpperCase());
                  setDraft(null);
                }}
                pattern="[A-Za-z]{3}"
                required
                value={currencyHint}
              />
            </label>
            {draft ? (
              <>
                <input name="automaticDraft" type="hidden" value="reviewed" />
                <input name="extractionConfidence" type="hidden" value={draft.confidence} />
                <input name="rawExtraction" type="hidden" value={JSON.stringify(draft.rawExtraction)} />
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3 text-xs leading-5 text-emerald-200 sm:col-span-2 light:text-emerald-800">
                  Automatic draft ready · {Math.round(draft.confidence * 100)}% overall confidence. Compare these values with the selected source, correct anything uncertain, then process the reviewed draft.
                </div>
                <label className="grid gap-1.5 text-xs text-zinc-400">
                  Extracted supplier
                  <input className={inputClass} defaultValue={draft.supplierName} maxLength={160} name="supplierName" required />
                </label>
                <label className="grid gap-1.5 text-xs text-zinc-400">
                  Invoice number
                  <input className={inputClass} defaultValue={draft.invoiceNumber ?? ""} maxLength={120} name="invoiceNumber" />
                </label>
                <label className="grid gap-1.5 text-xs text-zinc-400">
                  Invoice date
                  <input className={inputClass} defaultValue={draft.invoiceDate} name="invoiceDate" required type="date" />
                </label>
                <label className="grid gap-1.5 text-xs text-zinc-400">
                  Currency
                  <input className={inputClass} defaultValue={draft.currency} maxLength={3} minLength={3} name="currency" pattern="[A-Za-z]{3}" required />
                </label>
                <label className="grid gap-1.5 text-xs text-zinc-400">
                  Total
                  <input className={inputClass} defaultValue={draft.total} min="0.01" name="total" required step="0.01" type="number" />
                </label>
                <label className="grid gap-1.5 text-xs text-zinc-400">
                  Subtotal <span className="text-zinc-600">(optional)</span>
                  <input className={inputClass} defaultValue={draft.subtotal ?? ""} min="0" name="subtotal" step="0.01" type="number" />
                </label>
                <label className="grid gap-1.5 text-xs text-zinc-400">
                  Tax total <span className="text-zinc-600">(optional)</span>
                  <input className={inputClass} defaultValue={draft.taxTotal ?? ""} min="0" name="taxTotal" step="0.01" type="number" />
                </label>
                <label className="grid gap-1.5 text-xs text-zinc-400 sm:col-span-2">
                  Tax/VAT identifier <span className="text-zinc-600">(optional)</span>
                  <input className={inputClass} defaultValue={draft.taxIdentifier ?? ""} maxLength={80} name="taxIdentifier" />
                </label>
                <label className="grid gap-1.5 text-xs text-zinc-400 sm:col-span-2">
                  Extracted line items
                  <textarea className={`${inputClass} min-h-28 py-3 font-mono text-xs`} defaultValue={draftItems} name="lineItems" required />
                  <span className="text-[10px] leading-4 text-zinc-600">Description | quantity | unit | unit price | line total | OCR confidence. Edit values only; keep six columns.</span>
                </label>
              </>
            ) : (
              <div className="rounded-xl border border-violet-400/15 bg-violet-400/[0.05] p-3 text-xs leading-5 text-zinc-400 sm:col-span-2 light:text-zinc-600">
                PP-StructureV3 extracts document layout, tables, and text without persisting the file. Review and correct the normalized draft before it enters the existing matching, history, and anomaly workflow.
              </div>
            )}
          </>
        ) : (
          <>
            <label className="grid gap-1.5 text-xs text-zinc-400">
              Supplier name
              <input className={inputClass} maxLength={160} name="supplierName" required />
            </label>
            <label className="grid gap-1.5 text-xs text-zinc-400">
              Invoice number
              <input className={inputClass} maxLength={120} name="invoiceNumber" />
            </label>
            <label className="grid gap-1.5 text-xs text-zinc-400">
              Invoice date
              <input className={inputClass} name="invoiceDate" required type="date" />
            </label>
            <label className="grid gap-1.5 text-xs text-zinc-400">
              Currency
              <input className={inputClass} defaultValue="AED" maxLength={3} minLength={3} name="currency" pattern="[A-Za-z]{3}" required />
            </label>
            <label className="grid gap-1.5 text-xs text-zinc-400">
              Total
              <input className={inputClass} min="0.01" name="total" required step="0.01" type="number" />
            </label>
            <label className="grid gap-1.5 text-xs text-zinc-400">
              Subtotal <span className="text-zinc-600">(optional)</span>
              <input className={inputClass} min="0" name="subtotal" step="0.01" type="number" />
            </label>
            <label className="grid gap-1.5 text-xs text-zinc-400">
              Tax total <span className="text-zinc-600">(optional)</span>
              <input className={inputClass} min="0" name="taxTotal" step="0.01" type="number" />
            </label>
            <label className="grid gap-1.5 text-xs text-zinc-400 sm:col-span-2">
              Tax/VAT identifier <span className="text-zinc-600">(optional)</span>
              <input className={inputClass} maxLength={80} name="taxIdentifier" />
            </label>
            <label className="grid gap-1.5 text-xs text-zinc-400 sm:col-span-2">
              Extracted line items
              <textarea
                className={`${inputClass} min-h-28 py-3 font-mono text-xs`}
                name="lineItems"
                placeholder={"Chicken Breast 5KG | 10 | kg | 18.00 | 180.00\nCooking Oil | 4 | case | 92.00 | 368.00"}
                required
              />
              <span className="text-[10px] leading-4 text-zinc-600">One item per line: description | quantity | unit | unit price | line total</span>
            </label>
          </>
        )}
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          {extractionMode === "automatic" && !draft ? (
            <button
              className="nexus-focus nexus-button-primary min-h-10 rounded-xl px-4 text-sm font-medium disabled:cursor-wait disabled:opacity-60"
              disabled={extracting || !selectedFile}
              onClick={extractAutomaticDraft}
              type="button"
            >
              {extracting ? "Extracting draft…" : "Extract automatic draft"}
            </button>
          ) : (
            <button className="nexus-focus nexus-button-primary min-h-10 rounded-xl px-4 text-sm font-medium disabled:cursor-wait disabled:opacity-60" disabled={pending} type="submit">
              {pending ? "Validating and processing…" : (extractionMode === "automatic" ? "Process reviewed draft" : "Upload manual details")}
            </button>
          )}
          <p aria-live="polite" className={`text-xs ${extractionError || state.status === "error" ? "text-red-300 light:text-red-700" : "text-emerald-300 light:text-emerald-700"}`}>
            {extractionError || state.message}
          </p>
        </div>
      </form>
      <p className="mt-4 border-t border-white/[0.07] pt-3 text-[10px] leading-4 text-zinc-600 light:border-black/[0.08]">
        Automatic extraction is server-side and provider-isolated. Manual structured entry remains available as a fallback. The uploaded source remains private; no accounting, ordering, or payment action is performed.
      </p>
    </details>
  );
}
