import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { siteConfig } from "@/app/site-config";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined,
  icons: {
    icon: [{ url: "/icon.png", sizes: "512x512", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f0" },
    { media: "(prefers-color-scheme: dark)", color: "#090A0C" },
  ],
  colorScheme: "light dark",
};

export default function ArabicRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
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
