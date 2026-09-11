import Link from "next/link";
import TqMonogram from "@/components/ui/TqMonogram";

const groups = [
  { title: "Products", links: [{ href: "/restaurants", label: "TQEN Restaurant" }, { href: "/#industries", label: "TQEN Retail" }, { href: "/#industries", label: "TQEN Vision" }] },
  { title: "Explore", links: [{ href: "/#solutions", label: "Solutions" }, { href: "/#work", label: "Work" }, { href: "/demo", label: "Demos" }, { href: "/docs", label: "Agent docs" }] },
  { title: "Company", links: [{ href: "/about", label: "About" }, { href: "/contact", label: "Contact" }, { href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }] },
] as const;

export default function CompanyFooter() {
  return (
    <footer className="relative z-10 border-t border-[var(--nexus-border)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.35fr_repeat(3,1fr)]">
        <div>
          <Link aria-label="TQEN home" className="nexus-heading nexus-focus inline-flex items-center gap-3 rounded-lg text-sm font-semibold tracking-[-0.03em]" href="/"><TqMonogram size={30} /> TQEN</Link>
          <p className="nexus-copy mt-4 max-w-xs text-sm leading-6">Intelligent systems for real business operations.</p>
          <Link className="nexus-heading nexus-focus mt-6 inline-flex text-sm font-medium underline decoration-current/20 underline-offset-4 hover:decoration-current" href="/contact">Tell us how your business works</Link>
        </div>
        {groups.map((group) => <section key={group.title}><h2 className="nexus-subtle text-xs font-medium">{group.title}</h2><ul className="mt-4 space-y-3">{group.links.map((link) => <li key={`${group.title}-${link.label}`}><Link className="nexus-copy nexus-focus text-sm transition-colors hover:text-[var(--nexus-text)]" href={link.href}>{link.label}</Link></li>)}</ul></section>)}
      </div>
      <div className="nexus-subtle mx-auto flex max-w-7xl flex-col gap-2 border-t border-[var(--nexus-border)] px-5 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} TQEN. All rights reserved.</p>
        <p>Software first. AI where it improves the work.</p>
      </div>
    </footer>
  );
}
