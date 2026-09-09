"use client";

import { useActionState, useState } from "react";
import { FileUp } from "lucide-react";

import {
  uploadSupplierInvoiceAction,
  type InvoiceUploadActionState,
} from "@/app/restaurant/actions";

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
  const inputClass = "nexus-focus min-h-10 rounded-xl border border-white/[0.1] bg-white/[0.035] px-3 text-sm text-zinc-100 light:border-black/[0.12] light:bg-white light:text-zinc-900";

  return (
    <details className="mt-4 rounded-2xl border border-white/[0.09] bg-black/10 p-4 light:border-black/[0.1] light:bg-black/[0.02]">
      <summary className="nexus-focus flex cursor-pointer list-none items-center gap-2 rounded-lg text-sm font-medium text-violet-300 light:text-violet-700 [&::-webkit-details-marker]:hidden">
        <FileUp aria-hidden="true" className="size-4" />
        Upload supplier invoice
      </summary>
      <form action={action} className="mt-5 grid gap-4 sm:grid-cols-2">
        <input name="organizationId" type="hidden" value={organizationId} />
        <label className="grid gap-1.5 text-xs text-zinc-400 sm:col-span-2">
          Private invoice file
          <input
            accept="application/pdf,image/jpeg,image/png,image/webp"
            className={`${inputClass} py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-400/10 file:px-3 file:py-1.5 file:text-xs file:text-violet-300`}
            name="invoiceFile"
            onChange={(event) => setFilename(event.currentTarget.files?.[0]?.name ?? "")}
            required
            type="file"
          />
          <span className="text-[10px] text-zinc-600">{filename ? `${filename} selected` : "PDF, JPEG, PNG, or WebP · maximum 10 MB"}</span>
        </label>
        <label className="grid gap-1.5 text-xs text-zinc-400">
          Supplier name
          <input className={inputClass} maxLength={160} name="supplierName" required />
        </label>
        <label className="grid gap-1.5 text-xs text-zinc-400">
          Branch
          <select className={inputClass} defaultValue={selectedBranchId ?? ""} name="branchId">
            <option value="">Organization-wide purchasing</option>
            {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
          </select>
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
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button className="nexus-focus nexus-button-primary min-h-10 rounded-xl px-4 text-sm font-medium disabled:cursor-wait disabled:opacity-60" disabled={pending} type="submit">
            {pending ? "Uploading and processing…" : "Upload and process"}
          </button>
          <p aria-live="polite" className={`text-xs ${state.status === "error" ? "text-red-300 light:text-red-700" : "text-emerald-300 light:text-emerald-700"}`}>
            {state.message}
          </p>
        </div>
      </form>
      <p className="mt-4 border-t border-white/[0.07] pt-3 text-[10px] leading-4 text-zinc-600 light:border-black/[0.08]">
        Extraction mode: validated manual structured entry. The uploaded source remains private; no accounting, ordering, or payment action is performed.
      </p>
    </details>
  );
}
