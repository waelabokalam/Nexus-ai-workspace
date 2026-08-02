import type { MetadataRoute } from "next";
import { absoluteSiteUrl } from "@/app/site-config";

const routes = ["", "/features", "/pricing", "/docs", "/demo", "/demo/support", "/about", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes
    .map((route) => absoluteSiteUrl(route || "/"))
    .filter((url): url is string => Boolean(url))
    .map((url) => ({ url }));
}
