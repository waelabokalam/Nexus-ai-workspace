export type Locale = "en" | "ar";

/** English-form public routes that have an Arabic counterpart. */
const AR_ROUTES = new Set([
  "/",
  "/restaurants",
  "/features",
  "/pricing",
  "/about",
  "/contact",
  "/demo",
  "/demo/support",
  "/demo/restaurant",
  "/demo/pgpara",
  "/docs",
  "/case-studies/crave-it",
  "/privacy",
  "/terms",
]);

export function stripAr(pathname: string): string {
  if (pathname === "/ar") return "/";
  if (pathname.startsWith("/ar/")) return pathname.slice(3) || "/";
  return pathname;
}

/** Map any current pathname to its equivalent in the target locale. */
export function localePath(pathname: string, locale: Locale): string {
  const base = stripAr(pathname);
  if (locale === "ar") {
    if (!AR_ROUTES.has(base)) return "/ar";
    return base === "/" ? "/ar" : `/ar${base}`;
  }
  return base || "/";
}

/** English-form path for sitemap/hreflang pairing. */
export function arRoutePath(enPath: string): string {
  return enPath === "/" ? "/ar" : `/ar${enPath}`;
}

/** Localize an internal href (supports "#section" anchors). External/mailto pass through. */
export function localeHref(href: string, locale: Locale): string {
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  const hashIndex = href.indexOf("#");
  const path = (hashIndex >= 0 ? href.slice(0, hashIndex) : href) || "/";
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const mapped = locale === "ar" ? arRoutePath(path) : path;
  return `${mapped}${hash}`;
}

export { AR_ROUTES };
