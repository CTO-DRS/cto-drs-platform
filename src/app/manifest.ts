import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CTO-DRS | التطبيقات والمشاريع",
    short_name: "CTO-DRS",
    description: "البوابة الرسمية لتطبيقات ومشاريع CTO-DRS.",
    start_url: "/",
    display: "standalone",
    background_color: "#050a14",
    theme_color: "#050a14",
    dir: "rtl",
    lang: "ar",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
