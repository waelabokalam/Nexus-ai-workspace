"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n/routing";

/** Syncs document language/direction on navigation (first paint is covered by the SSR dir/lang wrapper). */
export function LocaleDir({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);
  return null;
}
