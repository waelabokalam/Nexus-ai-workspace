import type { MetadataRoute } from "next";
import { absoluteSiteUrl } from "@/app/site-config";
import { arRoutePath } from "@/lib/i18n/routing";

const routes = [
  "",
  "/features",
  "/pricing",
  "/docs",
  "/demo",
  "/demo/support",
  "/demo/restaurant",
  "/restaurants",
  "/case-studies/crave-it",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) => {
    const enPath = route || "/";
    const en = absoluteSiteUrl(enPath);
    const ar = absoluteSiteUrl(arRoutePath(enPath));
    if (!en || !ar) return [];
    const languages = { en, ar };
    return [
      { url: en, alternates: { languages } },
      { url: ar, alternates: { languages } },
    ];
  });
}
