import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import RestaurantProductPreview from "@/components/marketing/RestaurantProductPreview";
import SectionReveal from "@/components/marketing/SectionReveal";
import { localeHref, type Locale } from "@/lib/i18n/routing";
import { homeEn, type FlagshipCopy, type ProductPreviewCopy } from "@/lib/i18n/home";

export default function RestaurantFlagship({
  t = homeEn.flagship,
  preview,
  locale = "en",
}: {
  t?: FlagshipCopy;
  preview?: ProductPreviewCopy;
  locale?: Locale;
}) {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28" id="restaurant-flagship">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <span className="nexus-status inline-flex rounded-full px-3 py-1 text-xs font-medium">{t.status}</span>
            <h2 className="nexus-heading mt-5 font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl">{t.title}</h2>
            <p className="nexus-copy mt-5 max-w-xl text-base leading-7">{t.copy}</p>
          </div>
          <RestaurantProductPreview t={preview} />
        </SectionReveal>

        <SectionReveal className="mt-8 grid gap-6 border-t border-[var(--nexus-border)] pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2" aria-label={t.status}>
            {t.capabilities.map((item) => <li className="nexus-copy flex items-start gap-2.5 text-sm leading-6" key={item}><CheckCircle2 aria-hidden="true" className="nexus-heading mt-1 size-4 shrink-0" strokeWidth={1.55} />{item}</li>)}
          </ul>
          <Link className="nexus-button-primary nexus-focus inline-flex min-h-11 items-center justify-center rounded-[var(--nexus-radius-control)] px-5 text-sm font-medium" href={localeHref("/restaurants", locale)}>{t.link} <ArrowRight aria-hidden="true" className="ms-2 inline-block size-4 rtl:-scale-x-100" strokeWidth={1.6} /></Link>
        </SectionReveal>
      </div>
    </section>
  );
}
