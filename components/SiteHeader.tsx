"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import NexusCore from "@/components/ui/NexusCore";

const navigation = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/demo", label: "Demo" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;

    const navigation = mobileNavigationRef.current;
    const focusable = navigation?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }
      if (event.key !== "Tab" || !first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeMenu, open]);

  return (
    <header className="sticky top-0 z-50 mx-auto w-full max-w-6xl px-5 pt-4 sm:px-8 sm:pt-5">
      <div className="nexus-surface relative flex min-h-14 items-center justify-between rounded-[var(--nexus-radius-control)] bg-zinc-950/90 px-4 backdrop-blur-xl sm:px-5">
        <Link aria-label="Nexus home" className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-[-0.02em] text-white" href="/">
          <NexusCore size={27} />
          <span>Nexus</span>
        </Link>

        <nav aria-label="Primary navigation" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 text-sm md:flex">
          {navigation.map((item) => (
            <Link aria-current={pathname === item.href ? "page" : undefined} className={`nexus-focus rounded-lg px-3 py-2 transition-colors ${pathname === item.href ? "bg-white/[0.07] text-white" : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"}`} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link className="nexus-focus hidden rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 sm:inline-flex" href="/demo">
            Try Nexus
          </Link>
          <button
            aria-controls="site-navigation-mobile"
            aria-expanded={open}
            className="nexus-focus inline-flex min-h-10 items-center rounded-lg border border-white/[0.12] px-3 text-sm text-zinc-200 transition hover:bg-white/[0.06] md:hidden"
            onClick={() => (open ? closeMenu(true) : setOpen(true))}
            ref={menuButtonRef}
            type="button"
          >
            Menu
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Mobile navigation" className="nexus-surface mt-2 rounded-[var(--nexus-radius-control)] bg-zinc-950/95 p-2 backdrop-blur-xl md:hidden" id="site-navigation-mobile" ref={mobileNavigationRef}>
          {navigation.map((item) => (
            <Link aria-current={pathname === item.href ? "page" : undefined} className={`nexus-focus block min-h-11 rounded-lg px-4 py-3 text-sm transition ${pathname === item.href ? "bg-white/[0.08] text-white" : "text-zinc-300 hover:bg-white/[0.06] hover:text-white"}`} href={item.href} key={item.href} onClick={() => closeMenu(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
