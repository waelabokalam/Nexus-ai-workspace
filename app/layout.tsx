import type { Metadata, Viewport } from "next";
import { absoluteSiteUrl, siteConfig } from "@/app/site-config";
import "./globals.css";

const socialImage = absoluteSiteUrl("/social-image");

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined,
  title: {
    default: "Nexus | Intelligent Systems Built Around Your Industry",
    template: "%s | Nexus",
  },
  description: "Nexus combines business software, AI, automation, analytics and intelligent operations to build systems around how an industry actually works.",
  applicationName: "Nexus",
  openGraph: {
    type: "website",
    siteName: "Nexus",
    title: "Nexus | Intelligent Systems Built Around Your Industry",
    description: "Intelligent systems built around real business operations, from AI agents and automation to focused software and vision products.",
    url: siteConfig.siteUrl,
    images: socialImage ? [{ url: socialImage, width: 1200, height: 630, alt: "Nexus — Intelligent systems for real business operations" }] : undefined,
  },
  twitter: {
    card: socialImage ? "summary_large_image" : "summary",
    title: "Nexus | Intelligent Systems Built Around Your Industry",
    description: "Intelligent systems built around real business operations, from AI agents and automation to focused software and vision products.",
    images: socialImage ? [socialImage] : undefined,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f0" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#09090B] text-white">
        {children}
      </body>
    </html>
  );
}
