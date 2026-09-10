import type { Metadata, Viewport } from "next";
import { absoluteSiteUrl, siteConfig } from "@/app/site-config";
import "./globals.css";

const socialImage = absoluteSiteUrl("/social-image");

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined,
  title: {
    default: "Nexus | Intelligent Systems for Business Operations",
    template: "%s | Nexus",
  },
  description: "Nexus builds intelligent business systems, automation, applications and operational technology around how companies actually work.",
  applicationName: "Nexus",
  openGraph: {
    type: "website",
    siteName: "Nexus",
    title: "Nexus | Intelligent Systems for Business Operations",
    description: "Software, automation and AI designed around the real operation.",
    url: siteConfig.siteUrl,
    images: socialImage ? [{ url: socialImage, width: 1200, height: 630, alt: "Nexus intelligent systems for business operations" }] : undefined,
  },
  twitter: {
    card: socialImage ? "summary_large_image" : "summary",
    title: "Nexus | Intelligent Systems for Business Operations",
    description: "Software, automation and AI designed around the real operation.",
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
