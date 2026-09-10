"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import NexusCore from "@/components/ui/NexusCore";
import ThemeToggle from "@/components/ThemeToggle";

type MenuName = "industries" | "solutions";

const industries = [
  { href: "/restaurants", label: "Restaurants", meta: "Pilot ready" },
  { href: "/#industries", label: "Retail", meta: "In development" },
  { href: "/#industries", label: "Fitness", meta: "Planned" },
] as const;

const solutions = [
  { href: "/features#ai-automation", label: "AI and automation" },
  { href: "/features#business-systems", label: "Apps and platforms" },
  { href: "/features#websites", label: "Websites" },
  { href: "/features#integrations", label: "Integrations" },
  { href: "/features#computer-vision", label: "Computer vision" },
  { href: "/features#custom-systems", label: "Custom systems" },
] as const;

export default function CompanyHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuName | null>(null);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const closeMobileMenu = useCallback((restoreFocus = false) => {
    setMobileOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const focusable = mobileNavigationRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileMenu(true);
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
  }, [closeMobileMenu, mobileOpen]);

  const menuButton = (name: MenuName, label: string) => (
    <button aria-expanded={openMenu === name} aria-haspopup="true" className="nexus-focus inline-flex min-h-9 items-center rounded-lg px-3 text-sm text-[var(--nexus-text-muted)] transition-colors hover:bg-[var(--nexus-surface-soft)] hover:text-[var(--nexus-text)]" onClick={() => setOpenMenu((current) => current === name ? null : name)} type="button">
      {label}<ChevronDown aria-hidden="true" className={`ml-1.5 size-3.5 transition-transform ${openMenu === name ? "rotate-180" : ""}`} strokeWidth={1.6} />
    </button>
  );

  return (
    <header className="sticky top-0 z-50 mx-auto w-full max-w-7xl px-5 pt-4 sm:px-8 sm:pt-5" ref={headerRef}>
      <div className="nexus-frame relative flex min-h-14 items-center justify-between rounded-[var(--nexus-radius-frame)] bg-[var(--nexus-surface)] px-4 backdrop-blur-xl sm:px-5">
        <Link aria-label="Nexus home" className="nexus-heading nexus-focus inline-flex items-center gap-2.5 rounded-lg text-sm font-semibold tracking-[-0.02em]" href="/"><NexusCore size={27} /><span>Nexus</span></Link>

        <nav aria-label="Primary navigation" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 text-sm lg:flex">
          <div className="relative">
            {menuButton("industries", "Industries")}
            {openMenu === "industries" && <div className="nexus-surface absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 rounded-[var(--nexus-radius-control)] p-2">{industries.map((item) => <Link className="nexus-focus flex min-h-12 items-center justify-between rounded-lg px-3 text-sm transition hover:bg-[var(--nexus-surface-soft)]" href={item.href} key={`${item.label}-${item.meta}`} onClick={() => setOpenMenu(null)}><span className="nexus-heading font-medium">{item.label}</span><span className="nexus-subtle text-[11px]">{item.meta}</span></Link>)}</div>}
          </div>

          <div className="relative">
            {menuButton("solutions", "Solutions")}
            {openMenu === "solutions" && <div className="nexus-surface absolute left-1/2 top-full mt-2 grid w-[29rem] -translate-x-1/2 grid-cols-2 gap-1 rounded-[var(--nexus-radius-control)] p-2">{solutions.map((item) => <Link className="nexus-heading nexus-focus min-h-11 rounded-lg px-3 py-3 text-sm transition hover:bg-[var(--nexus-surface-soft)]" href={item.href} key={item.label} onClick={() => setOpenMenu(null)}>{item.label}</Link>)}</div>}
          </div>

          <Link className="nexus-focus min-h-9 rounded-lg px-3 py-2 text-[var(--nexus-text-muted)] transition-colors hover:bg-[var(--nexus-surface-soft)] hover:text-[var(--nexus-text)]" href="/#work">Work</Link>
          <Link aria-current={pathname === "/about" ? "page" : undefined} className={`nexus-focus min-h-9 rounded-lg px-3 py-2 transition-colors ${pathname === "/about" ? "bg-[var(--nexus-surface-soft)] text-[var(--nexus-text)]" : "text-[var(--nexus-text-muted)] hover:bg-[var(--nexus-surface-soft)] hover:text-[var(--nexus-text)]"}`} href="/about">About</Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link className="nexus-button-primary nexus-focus hidden min-h-9 items-center rounded-lg px-4 text-sm font-medium sm:inline-flex" href="/contact">Talk to us <span aria-hidden="true" className="ml-1.5">→</span></Link>
          <button aria-controls="site-navigation-mobile" aria-expanded={mobileOpen} className="nexus-button-secondary nexus-focus inline-flex min-h-10 items-center rounded-lg px-3 text-sm lg:hidden" onClick={() => (mobileOpen ? closeMobileMenu(true) : setMobileOpen(true))} ref={menuButtonRef} type="button">{mobileOpen ? "Close" : "Menu"}</button>
        </div>
      </div>

      {mobileOpen && (
        <nav aria-label="Mobile navigation" className="nexus-surface mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-[var(--nexus-radius-control)] p-2 lg:hidden" id="site-navigation-mobile" ref={mobileNavigationRef}>
          <p className="nexus-subtle px-3 pb-2 pt-2 text-xs font-medium">Industries</p>
          {industries.map((item) => <Link className="nexus-focus flex min-h-11 items-center justify-between rounded-lg px-3 text-sm hover:bg-[var(--nexus-surface-soft)]" href={item.href} key={`${item.label}-mobile`} onClick={() => closeMobileMenu(false)}><span className="nexus-heading">{item.label}</span><span className="nexus-subtle text-[11px]">{item.meta}</span></Link>)}
          <p className="nexus-subtle mt-2 border-t border-[var(--nexus-border)] px-3 pb-2 pt-4 text-xs font-medium">Company</p>
          <Link className="nexus-heading nexus-focus block min-h-11 rounded-lg px-3 py-3 text-sm hover:bg-[var(--nexus-surface-soft)]" href="/#solutions" onClick={() => closeMobileMenu(false)}>Solutions</Link>
          <Link className="nexus-heading nexus-focus block min-h-11 rounded-lg px-3 py-3 text-sm hover:bg-[var(--nexus-surface-soft)]" href="/#work" onClick={() => closeMobileMenu(false)}>Work</Link>
          <Link className="nexus-heading nexus-focus block min-h-11 rounded-lg px-3 py-3 text-sm hover:bg-[var(--nexus-surface-soft)]" href="/about" onClick={() => closeMobileMenu(false)}>About</Link>
          <Link className="nexus-button-primary nexus-focus mt-2 flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-medium" href="/contact" onClick={() => closeMobileMenu(false)}>Talk to us</Link>
        </nav>
      )}
    </header>
  );
}
