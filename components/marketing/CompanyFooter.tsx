import Link from "next/link";
import TqMonogram from "@/components/ui/TqMonogram";
import { localeHref, type Locale } from "@/lib/i18n/routing";
import { siteEn, type FooterCopy } from "@/lib/i18n/site";

export default function CompanyFooter({
  t = siteEn.footer,
  locale = siteEn.locale,
}: {
  t?: FooterCopy;
  locale?: Locale;
}) {
  return (
    <footer className="relative z-10 border-t border-[var(--nexus-border)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.35fr_repeat(3,1fr)]">
        <div>
          <Link aria-label={t.homeLabel} className="nexus-heading nexus-focus inline-flex items-center gap-3 rounded-lg text-sm font-semibold tracking-[-0.03em]" href={localeHref("/", locale)}><TqMonogram size={30} /> TQEN</Link>
          <p className="nexus-copy mt-4 max-w-xs text-sm leading-6">{t.tagline}</p>
          <Link className="nexus-heading nexus-focus mt-6 inline-flex text-sm font-medium underline decoration-current/20 underline-offset-4 hover:decoration-current" href={localeHref(t.contactPath, locale)}>{t.contactCta}</Link>
        </div>
        {t.groups.map((group) => <section key={group.title}><h2 className="nexus-subtle text-xs font-medium">{group.title}</h2><ul className="mt-4 space-y-3">{group.links.map((link) => <li key={`${group.title}-${link.label}`}><Link className="nexus-copy nexus-focus text-sm transition-colors hover:text-[var(--nexus-text)]" href={localeHref(link.path, locale)}>{link.label}</Link></li>)}</ul></section>)}
      </div>
      <div className="nexus-subtle mx-auto flex max-w-7xl flex-col gap-2 border-t border-[var(--nexus-border)] px-5 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} TQEN. {t.rights}</p>
        <p>{t.motto}</p>
      </div>
    </footer>
  );
}
