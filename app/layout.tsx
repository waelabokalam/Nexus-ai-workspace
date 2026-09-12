import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { absoluteSiteUrl, siteConfig } from "@/app/site-config";
import "./globals.css";

const socialImage = absoluteSiteUrl("/social-image");

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined,
  title: {
    default: "TQEN | Intelligent Systems for Real Business Operations",
    template: "%s | TQEN",
  },
  description: "TQEN builds intelligent operational systems — software, AI, automation, data intelligence, integrations and computer vision — around how companies actually work.",
  applicationName: "TQEN",
  openGraph: {
    type: "website",
    siteName: "TQEN",
    title: "TQEN | Intelligent Systems for Real Business Operations",
    description: "Software, automation and AI designed around the real operation.",
    url: siteConfig.siteUrl,
    images: socialImage ? [{ url: socialImage, width: 1200, height: 630, alt: "TQEN intelligent systems for real business operations" }] : undefined,
  },
  twitter: {
    card: socialImage ? "summary_large_image" : "summary",
    title: "TQEN | Intelligent Systems for Real Business Operations",
    description: "Software, automation and AI designed around the real operation.",
    images: socialImage ? [socialImage] : undefined,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f0" },
    { media: "(prefers-color-scheme: dark)", color: "#090A0C" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased light"
      suppressHydrationWarning
    >
      <Script
        dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem("nexus-theme");if(t!=="dark"&&t!=="light"){t="light"}document.documentElement.classList.remove("dark","light");document.documentElement.classList.add(t)}catch(e){document.documentElement.classList.add("light")}`,
        }}
        id="tqen-theme-init"
        strategy="beforeInteractive"
      />
      <body className="min-h-full flex flex-col bg-[#090A0C] text-white">
        {children}
      </body>
    </html>
  );
}
