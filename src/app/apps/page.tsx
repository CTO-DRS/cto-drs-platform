import type { Metadata } from "next";
import { apps } from "@/lib/catalog";
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

  return (
    <main className="container page">
      <div className="page-intro">
        <div className="eyebrow">المكتبة الرسمية</div>
        <h1>التطبيقات</h1>
        <p>اقرأ وصف كل تطبيق، واعرف حالة المشروع، وافتح روابط الإصدار عندما يضيفها المطور ويتحقق منها.</p>
      </div>
      <div className="notice">
        <b>مهم:</b> حالة «قيد التطوير» تعني أن صفحة المشروع لا تؤكد توفر تنزيل عام. لا تظهر أزرار تنزيل إلا عند إضافة روابط رسمية موثوقة.
      </div>
      <CatalogExplorer
        apps={apps}
        initialQuery={q}
        initialCategory={cat || "all"}
        initialStatus={status || "all"}
        initialSort={["default", "newest", "name", "status"].includes(sort) ? sort : "default"}
        initialFavOnly={fav}
      />
    </main>
  );
}
