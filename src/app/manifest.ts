import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DRS | منصة التطبيقات",
    short_name: "DRS",
    description: "منصة DRS الرسمية للتطبيقات والمشاريع — جميع التطبيقات في مكان واحد.",
    start_url: "/",
    display: "standalone",
    background_color: "#050a14",
    theme_color: "#050a14",
    dir: "rtl",
    lang: "ar",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
