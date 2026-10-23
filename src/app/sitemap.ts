import type { MetadataRoute } from "next";
import { apps } from "@/lib/catalog";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cto-drs.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/apps`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/projects`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/docs`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/support`, changeFrequency: "monthly", priority: 0.5 },
  ];
  const appRoutes: MetadataRoute.Sitemap = apps.map(app => ({
    url: `${baseUrl}/apps/${app.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...staticRoutes, ...appRoutes];
}
