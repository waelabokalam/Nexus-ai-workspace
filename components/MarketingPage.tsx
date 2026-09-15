import type { ReactNode } from "react";
import CompanyFooter from "@/components/marketing/CompanyFooter";
import CompanyHeader from "@/components/marketing/CompanyHeader";
import { LocaleDir } from "@/components/LocaleDir";
import { siteCopy, type SiteCopy } from "@/lib/i18n/site";
import type { Locale } from "@/lib/i18n/routing";

type MarketingPageProps = {
  children: ReactNode;
  locale?: Locale;
  copy?: SiteCopy;
};

export default function MarketingPage({ children, locale = "en", copy }: MarketingPageProps) {
  const t = copy ?? siteCopy(locale);
  return (
    <main className="nexus-page min-h-screen overflow-x-hidden text-white">
      <LocaleDir locale={t.locale} />
      <a className="nexus-skip-link" href="#main-content">{t.skipLink}</a>
      <CompanyHeader locale={t.locale} t={t.header} />
      <div className="relative z-10" id="main-content">{children}</div>
      <CompanyFooter locale={t.locale} t={t.footer} />
    </main>
  );
}
