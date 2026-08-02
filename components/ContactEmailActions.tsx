"use client";

import { useState } from "react";

export default function ContactEmailActions({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1_800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <a className="nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200" href={`mailto:${email}`}>
        Send email
      </a>
      <button aria-live="polite" className="nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] border border-white/[0.12] px-4 text-sm font-medium text-white transition hover:bg-white/[0.06]" onClick={() => void copyEmail()} type="button">
        {copied ? "Email copied" : "Copy email"}
      </button>
    </div>
  );
}
