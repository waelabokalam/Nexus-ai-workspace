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
      <a className="nexus-button-primary nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] px-4 text-sm font-medium" href={`mailto:${email}`}>
        Send email
      </a>
      <button aria-live="polite" className="nexus-button-secondary nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] px-4 text-sm font-medium" onClick={() => void copyEmail()} type="button">
        {copied ? "Email copied" : "Copy email"}
      </button>
    </div>
  );
}
