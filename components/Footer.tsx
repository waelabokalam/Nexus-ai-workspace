import Link from "next/link";
import NexusCore from "@/components/ui/NexusCore";

const groups = [
  { title: "Product", links: [{ href: "/features", label: "Features" }, { href: "/pricing", label: "Pricing" }, { href: "/demo", label: "Demo" }] },
  { title: "Resources", links: [{ href: "/docs", label: "Documentation" }, { href: "/docs#api-reference", label: "API" }, { href: "/docs#quick-start", label: "Guides" }] },
  { title: "Company", links: [{ href: "/about", label: "About" }, { href: "/contact", label: "Contact" }, { href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }] },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.08]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link className="nexus-focus inline-flex items-center gap-2.5 rounded-lg text-sm font-semibold text-white" href="/">
            <NexusCore size={27} /> Nexus
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-400">AI operating system for business communication.</p>
        </div>
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">{group.title}</h2>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.label}><Link className="nexus-focus text-sm text-zinc-300 transition-colors hover:text-white" href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-white/[0.06] px-5 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} Nexus. All rights reserved.</p>
        <p>Early access product.</p>
      </div>
    </footer>
  );
}
