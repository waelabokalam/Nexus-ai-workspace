"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePath, type Locale } from "@/lib/i18n/routing";
import { siteCopy as copyFor } from "@/lib/i18n/site";

export default function LocaleSwitcher({ locale, className = "" }: { locale: Locale; className?: string }) {
  const pathname = usePathname();
  const target = locale === "ar" ? "en" : "ar";
  return (
    <Link
      aria-label={copyFor(locale).switcherLabel}
      className={`nexus-focus inline-flex min-h-9 items-center justify-center rounded-lg border border-[var(--nexus-border-strong)] px-3 text-sm font-semibold text-[var(--nexus-text)] transition-colors hover:bg-[var(--nexus-surface-soft)] ${className}`}
      href={localePath(pathname, target)}
    >
      {copyFor(locale).switcherTarget}
    </Link>
  );
}

// Re-export for callers that only need the helper barrel.
export { localePath };
export type { Locale };
