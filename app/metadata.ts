import type { Metadata } from "next";
import { absoluteSiteUrl, siteConfig } from "@/app/site-config";

const socialImage = absoluteSiteUrl("/social-image");

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const fullTitle = `${title} | Nexus`;

  return {
    title,
    description,
    alternates: siteConfig.siteUrl ? { canonical: path } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      url: absoluteSiteUrl(path),
      siteName: "Nexus",
      images: socialImage ? [{ url: socialImage, width: 1200, height: 630, alt: "Nexus — AI Operating System for Business Communication" }] : undefined,
    },
    twitter: socialImage ? { card: "summary_large_image", title: fullTitle, description, images: [socialImage] } : undefined,
  };
}

export const resolvedSiteUrl = siteConfig.siteUrl;
