import Link from "next/link";
import NexusCore from "@/components/ui/NexusCore";

const groups = [
  { title: "Nexus", links: [{ href: "/#industries", label: "Industries" }, { href: "/#what-we-build", label: "What We Build" }, { href: "/demo", label: "Demo" }] },
  { title: "Resources", links: [{ href: "/features", label: "Capabilities" }, { href: "/pricing", label: "Pricing" }, { href: "/docs", label: "Documentation" }] },
  { title: "Company", links: [{ href: "/about", label: "About" }, { href: "/contact", label: "Contact" }, { href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }] },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--nexus-border)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link className="nexus-heading nexus-focus inline-flex items-center gap-2.5 rounded-lg text-sm font-semibold" href="/">
            <NexusCore size={27} /> Nexus
          </Link>
          <p className="nexus-copy mt-4 max-w-xs text-sm leading-6">Intelligent systems built around the realities of each industry.</p>
        </div>
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="nexus-subtle text-xs font-medium uppercase tracking-[0.16em]">{group.title}</h2>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.label}><Link className="nexus-copy nexus-focus text-sm transition-colors hover:text-[var(--nexus-text)]" href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="nexus-subtle mx-auto flex max-w-7xl flex-col gap-2 border-t border-[var(--nexus-border)] px-5 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} Nexus. All rights reserved.</p>
        <p>Software · AI · Automation · Vision</p>
      </div>
    </footer>
  );
}
