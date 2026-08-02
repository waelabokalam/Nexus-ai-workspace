import type { Metadata } from "next";
import { absoluteSiteUrl, siteConfig } from "@/app/site-config";
import "./globals.css";

const socialImage = absoluteSiteUrl("/social-image");

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined,
  title: {
    default: "Nexus | AI Operating System for Business Communication",
    template: "%s | Nexus",
  },
  description: "Nexus brings adaptive communication, business knowledge, memory, workflows and live execution visibility into one business communication operating system.",
  applicationName: "Nexus",
  openGraph: {
    type: "website",
    siteName: "Nexus",
    title: "Nexus | AI Operating System for Business Communication",
    description: "Adaptive, multilingual business communication with knowledge, memory and live workflow visibility.",
    url: siteConfig.siteUrl,
    images: socialImage ? [{ url: socialImage, width: 1200, height: 630, alt: "Nexus — AI Operating System for Business Communication" }] : undefined,
  },
  twitter: {
    card: socialImage ? "summary_large_image" : "summary",
    title: "Nexus | AI Operating System for Business Communication",
    description: "Adaptive, multilingual business communication with knowledge, memory and live workflow visibility.",
    images: socialImage ? [socialImage] : undefined,
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
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
    >
      <body className="min-h-full flex flex-col bg-[#09090B] text-white">
        {children}
      </body>
    </html>
  );
}
