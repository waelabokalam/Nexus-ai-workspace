import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TQEN",
    short_name: "TQEN",
    description: "Intelligent systems for real business operations.",
    start_url: "/",
    display: "standalone",
    background_color: "#090A0C",
    theme_color: "#090A0C",
    icons: [
      { src: "/tqen-icon.png", sizes: "1254x1254", type: "image/png" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
