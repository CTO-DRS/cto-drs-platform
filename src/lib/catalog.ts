import rawApps from "../content/apps.json";
import rawSiteConfig from "../content/site-config.json";

export type Localized = { ar: string; en: string };
export type DownloadLink = { label: Localized; url: string; kind: "apk" | "store" | "release" | "website" };
export type AppEntry = {
  slug: string; name: Localized; category: string; status: "released" | "in-development" | "archived";
  summary: Localized; description: Localized; platforms: string[]; version: string | null;
  releaseDate: string | null; icon: string; tint?: string; pricing?: "free" | "paid"; features: Localized[]; requirements: string[];
  /** مسار أيقونة التطبيق الحقيقية (مستخرجة من APK أو المستودع) — يُعرض الحرف المتدرج حين تغيب */
  appIcon?: string | null;
  downloads: DownloadLink[]; repository: string | null; website: string | null;
  privacyPolicy: string | null; changelog: { version: string; date: string; notes: Localized[] }[];
  verified: boolean;
};
export type Announcement = { id: string; text: string; href?: string; active: boolean };
export type SiteConfig = {
  brand: { name: string; tagline: string };
  stats: { icon: string; value: string; label: string }[];
  cto: { name: string; role: string; bio: string; email: string };
  social: { id: string; url: string }[];
  announcements?: Announcement[];
};
export const apps = rawApps as AppEntry[];
export const site = rawSiteConfig as SiteConfig;

/** الإعلانات النشطة فقط — يعرضها الشريط أعلى الصفحات حتى يغلقها المستخدم */
export function activeAnnouncements(): Announcement[] {
  return (site.announcements ?? []).filter(a => a.active && a.text.trim());
}
export function appName(app: AppEntry, lang: "ar" | "en" = "ar") { return app.name[lang] || app.name.en; }
export function appSummary(app: AppEntry, lang: "ar" | "en" = "ar") { return app.summary[lang] || app.summary.en; }
export function appDescription(app: AppEntry, lang: "ar" | "en" = "ar") { return app.description[lang] || app.description.en; }
export function validHttpUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }
}

/* ===== إضافات التحسين: فئات عربية، إحصاءات حقيقية، بحث ===== */

export const categoryLabels: Record<string, string> = {
  education: "التعليم",
  tools: "الأدوات",
  business: "الأعمال",
  communication: "التواصل",
  media: "الوسائط",
  games: "الترفيه",
  web: "الويب",
};

export const statusLabels: Record<AppEntry["status"], string> = {
  released: "متاح",
  "in-development": "قيد التطوير",
  archived: "مؤرشف",
};

export function categoryLabel(category: string): string {
  return categoryLabels[category] || category;
}

/** تسميات إنجليزية للفئات (تُستخدم في صفحة /en) */
export const categoryLabelsEn: Record<string, string> = {
  education: "Education",
  tools: "Tools",
  business: "Business",
  communication: "Communication",
  media: "Media",
  games: "Games",
  web: "Web",
};

export function categoryLabelEn(category: string): string {
  return categoryLabelsEn[category] || category;
}

/** فئات فعلية موجودة في الكتالوج مع عدد مشاريعها (بدون اختلاق بيانات) */
export function categoriesWithCounts() {
  const map = new Map<string, number>();
  for (const app of apps) map.set(app.category, (map.get(app.category) || 0) + 1);
  return Array.from(map.entries()).map(([id, count]) => ({ id, label: categoryLabel(id), count }));
}

export const catalogStats = {
  total: apps.length,
  categories: new Set(apps.map(a => a.category)).size,
  released: apps.filter(a => a.status === "released").length,
  inDevelopment: apps.filter(a => a.status === "in-development").length,
  platforms: Array.from(new Set(apps.flatMap(a => a.platforms))),
};

/** تطبيقات ذات صلة: نفس الفئة أولاً ثم الأحدث، بحد أقصى 3 */
export function relatedApps(current: AppEntry, limit = 3): AppEntry[] {
  const sameCategory = apps.filter(a => a.slug !== current.slug && a.category === current.category);
  const others = apps.filter(a => a.slug !== current.slug && a.category !== current.category);
  return [...sameCategory, ...others].slice(0, limit);
}

/** تطبيع بسيط للبحث العربي/اللاتيني: إزالة التشكيل وتوحيد الألف والتاء المربوطة */
export function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .trim();
}

export function searchApps(list: AppEntry[], query: string): AppEntry[] {
  const q = normalizeSearch(query);
  if (!q) return list;
  const terms = q.split(/\s+/).filter(Boolean);
  return list.filter(app => {
    const haystack = normalizeSearch([
      app.name.ar, app.name.en,
      app.summary.ar, app.summary.en,
      app.description.ar, app.description.en,
      categoryLabel(app.category),
      app.platforms.join(" "),
    ].join(" "));
    return terms.every(term => haystack.includes(term));
  });
}

export function filterByCategory(list: AppEntry[], category: string | null): AppEntry[] {
  if (!category || category === "all") return list;
  return list.filter(a => a.category === category);
}

export function filterByStatus(list: AppEntry[], status: string | null): AppEntry[] {
  if (!status || status === "all") return list;
  return list.filter(a => a.status === status);
}

export function platformLabel(platform: string): string {
  const map: Record<string, string> = { Android: "أندرويد", Web: "ويب", iOS: "iOS", Windows: "ويندوز" };
  return map[platform] || platform;
}

/** أول رابط تنزيل صالح للتطبيق، إن وجد */
export function firstDownload(app: AppEntry): DownloadLink | null {
  return app.downloads.find(d => validHttpUrl(d.url)) || null;
}
