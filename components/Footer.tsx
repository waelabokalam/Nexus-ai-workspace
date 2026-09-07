import Link from "next/link";
import NexusCore from "@/components/ui/NexusCore";
import TrackedContactLink from "@/components/contact/TrackedContactLink";

const groups = [
  { title: "Systems", links: [{ href: "/#industries", label: "Industries" }, { href: "/#nexus-core", label: "Nexus Core" }, { href: "/demo", label: "AI Lab" }] },
  { title: "Resources", links: [{ href: "/features", label: "Capabilities" }, { href: "/pricing", label: "Pricing" }, { href: "/docs", label: "Documentation" }] },
  { title: "Company", links: [{ href: "/about", label: "About" }, { href: "/contact", label: "Contact" }, { href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }] },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.08]">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 border-b border-white/[0.08] px-5 py-12 sm:px-8 md:flex-row md:items-end">
        <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Start with the industry</p><h2 className="mt-3 font-heading text-2xl font-medium tracking-[-0.04em] text-white">What should work better in your operation?</h2></div>
        <TrackedContactLink className="nexus-button-primary nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] px-4 text-sm font-medium">Talk to Nexus <span aria-hidden="true" className="ml-2">→</span></TrackedContactLink>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link className="nexus-focus inline-flex items-center gap-2.5 rounded-lg text-sm font-semibold text-white" href="/">
            <NexusCore size={27} /> Nexus
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-400">Intelligent systems built around the realities of each industry.</p>
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
      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-white/[0.06] px-5 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} Nexus. All rights reserved.</p>
        <p>Software · AI · Automation · Vision</p>
      </div>
    </footer>
  );
}
