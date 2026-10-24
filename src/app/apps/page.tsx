import type { Metadata } from "next";
import { Download, Braces } from "lucide-react";
import { apps } from "@/lib/catalog";
import { fetchCatalogRepoStats } from "@/lib/github";
import { CatalogExplorer } from "@/components/catalog-explorer";

export const metadata: Metadata = {
  title: "التطبيقات",
  description: "تصفح كتالوج تطبيقات CTO-DRS مع بحث فوري وتصفية حسب الفئة والحالة.",
};

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function AppsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = firstParam(params.q).slice(0, 80);
  const cat = firstParam(params.cat);
  const status = firstParam(params.status);
  const sort = firstParam(params.sort);
  const fav = firstParam(params.fav) === "1";
  const statsMap = await fetchCatalogRepoStats(apps);

  return (
    <main className="container page">
      <div className="page-intro">
        <div className="eyebrow">المكتبة الرسمية</div>
        <h1>التطبيقات</h1>
        <p>اقرأ وصف كل تطبيق، واعرف حالة المشروع، وافتح روابط الإصدار عندما يضيفها المطور ويتحقق منها.</p>
        <div className="export-row" aria-label="تصدير بيانات الكتالوق">
          <span className="export-label"><Braces size={13} aria-hidden /> واجهة البيانات:</span>
          <a className="export-link" href="/api/apps?format=csv" download="drs-apps.csv">
            <Download size={13} aria-hidden /> تصدير CSV
          </a>
          <a className="export-link" href="/api/apps" target="_blank" rel="noreferrer">
            <Braces size={13} aria-hidden /> JSON
          </a>
        </div>
      </div>
      <div className="notice">
        <b>مهم:</b> حالة «قيد التطوير» تعني أن صفحة المشروع لا تؤكد توفر تنزيل عام. لا تظهر أزرار تنزيل إلا عند إضافة روابط رسمية موثوقة.
      </div>
      <CatalogExplorer
        apps={apps}
        initialQuery={q}
        initialCategory={cat || "all"}
        initialStatus={status || "all"}
        initialSort={["default", "newest", "downloads", "name", "status"].includes(sort) ? sort : "default"}
        initialFavOnly={fav}
        statsMap={statsMap}
      />
    </main>
  );
}
