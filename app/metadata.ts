import type { Metadata } from "next";
import { absoluteSiteUrl, siteConfig } from "@/app/site-config";

const socialImage = absoluteSiteUrl("/social-image");

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const fullTitle = `${title} | TQEN`;
  const arPath = path === "/" ? "/ar" : `/ar${path}`;

  return {
    title,
    description,
    alternates: {
      ...(siteConfig.siteUrl ? { canonical: path } : {}),
      languages: { en: path || "/", ar: arPath },
    },
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      url: absoluteSiteUrl(path),
      siteName: "TQEN",
      images: socialImage ? [{ url: socialImage, width: 1200, height: 630, alt: "TQEN intelligent systems for real business operations" }] : undefined,
    },
    twitter: socialImage ? { card: "summary_large_image", title: fullTitle, description, images: [socialImage] } : undefined,
  };
}

/** Metadata for an Arabic route: Arabic copy, ar canonical, en/ar alternates. */
export function arPageMetadata(title: string, description: string, enPath: string): Metadata {
  const path = enPath === "/" ? "/ar" : `/ar${enPath}`;
  const fullTitle = `${title} | TQEN`;

  return {
    title,
    description,
    alternates: {
      ...(siteConfig.siteUrl ? { canonical: path } : {}),
      languages: { en: enPath || "/", ar: path },
    },
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      url: absoluteSiteUrl(path),
      siteName: "TQEN",
      locale: "ar_AR",
      images: socialImage ? [{ url: socialImage, width: 1200, height: 630, alt: "TQEN intelligent systems for real business operations" }] : undefined,
    },
    twitter: socialImage ? { card: "summary_large_image", title: fullTitle, description, images: [socialImage] } : undefined,
  };
}

export const resolvedSiteUrl = siteConfig.siteUrl;
