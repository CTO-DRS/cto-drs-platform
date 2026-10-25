import type { MetadataRoute } from "next";
import { apps } from "@/lib/catalog";
import { posts } from "@/lib/blog";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cto-drs.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/en`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/apps`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/updates`, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/projects`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/stats`, changeFrequency: "daily", priority: 0.5 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/compare`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/en/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/en/compare`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/en/apps`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/en/updates`, changeFrequency: "daily", priority: 0.6 },
    { url: `${baseUrl}/en/projects`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/en/stats`, changeFrequency: "daily", priority: 0.4 },
    { url: `${baseUrl}/en/support`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/en/account`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/account`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/docs`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/support`, changeFrequency: "monthly", priority: 0.5 },
  ];
  const appRoutes: MetadataRoute.Sitemap = apps.map(app => ({
    url: `${baseUrl}/apps/${app.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  const blogRoutes: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...staticRoutes, ...appRoutes, ...blogRoutes];
}
