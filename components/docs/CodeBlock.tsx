"use client";

import { useState } from "react";

export default function CodeBlock({ code, label = "Example" }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="overflow-hidden rounded-[var(--nexus-radius-control)] border border-white/[0.1] bg-black/35">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        <button className="nexus-focus min-h-8 rounded-md px-2 text-xs text-zinc-300 transition hover:bg-white/[0.07] hover:text-white" onClick={() => void copy()} type="button">{copied ? "Copied" : "Copy"}</button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-6 text-zinc-300"><code>{code}</code></pre>
    </div>
  );
}
