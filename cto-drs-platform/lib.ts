import rawApps from "./content/apps.json";

export type Localized = { ar: string; en: string };
export type DownloadLink = { label: Localized; url: string; kind: "apk" | "store" | "release" | "website" };
export type AppEntry = {
  slug: string; name: Localized; category: string; status: "released" | "in-development" | "archived";
  summary: Localized; description: Localized; platforms: string[]; version: string | null;
  releaseDate: string | null; icon: string; features: Localized[]; requirements: string[];
  downloads: DownloadLink[]; repository: string | null; website: string | null;
  privacyPolicy: string | null; changelog: { version: string; date: string; notes: Localized[] }[];
  verified: boolean;
};
export const apps = rawApps as AppEntry[];
export function appName(app: AppEntry, lang: "ar" | "en" = "ar") { return app.name[lang] || app.name.en; }
export function appSummary(app: AppEntry, lang: "ar" | "en" = "ar") { return app.summary[lang] || app.summary.en; }
export function appDescription(app: AppEntry, lang: "ar" | "en" = "ar") { return app.description[lang] || app.description.en; }
export function validHttpUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }
}
