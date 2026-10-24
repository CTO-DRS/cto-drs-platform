import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "DRS | منصة التطبيقات",
    short_name: "DRS",
    description: "منصة DRS الرسمية للتطبيقات والمشاريع — جميع التطبيقات في مكان واحد.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#050a14",
    theme_color: "#050a14",
    dir: "rtl",
    lang: "ar",
    categories: ["utilities", "productivity", "education"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "كتالوج التطبيقات",
        short_name: "التطبيقات",
        url: "/apps",
        description: "تصفح جميع التطبيقات مع البحث والتصفية",
      },
      {
        name: "تطبيقاتي المفضلة",
        short_name: "المفضلة",
        url: "/apps?fav=1",
        description: "التطبيقات التي أضفتها إلى المفضلة على جهازك",
      },
      {
        name: "المشاريع المفتوحة",
        short_name: "المشاريع",
        url: "/projects",
        description: "المستودعات والإصدارات على GitHub",
      },
    ],
  };
}
