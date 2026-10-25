import type { Metadata } from "next";
import Link from "next/link";
import { GitCompareArrows, Languages } from "lucide-react";
import { apps, relatedApps } from "@/lib/catalog";
import { fetchCatalogRepoStats } from "@/lib/github";
import { CompareClient, type CompareLive } from "@/components/compare-client";
import { BackButton } from "@/components/back-button";

export const metadata: Metadata = {
  title: "قارن التطبيقات جنبًا إلى جنب",
  description:
    "اختر تطبيقين أو ثلاثة من كتالوق DRS وقارن حالتها وفئاتها وأحدث إصداراتها الحية من GitHub ونجومها وتنزيلاتها في جدول واحد — روابط مقارنة قابلة للمشاركة.",
  alternates: { languages: { ar: "/compare", en: "/en/compare" } },
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string; c?: string }>;
}) {
  const sp = await searchParams;
  const statsMap = await fetchCatalogRepoStats(apps);
  const live: Record<string, CompareLive> = {};
  for (const [slug, st] of Object.entries(statsMap)) {
    live[slug] = { latestTag: st.latestTag, releasedAt: st.releasedAt, downloads: st.downloads, stars: st.stars, pushedAt: st.pushedAt };
  }

  const findBySlug = (s?: string) => (s ? apps.find(x => x.slug === s) ?? null : null);
  const a = findBySlug(sp.a);
  const b = findBySlug(sp.b);
  const c = findBySlug(sp.c);
  /* عند وصول الزائر من صفحة تطبيق واحد (?a=slug) نعرض مقارنة فورية باقتراح ذكي من نفس الفئة */
  const initial: [string | null, string | null, string | null] = [
    a?.slug ?? null,
    b?.slug ?? (a ? relatedApps(a, 3)[0]?.slug ?? null : apps[0]?.slug ?? null),
    c?.slug ?? null,
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cto-drs.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "مقارنة تطبيقات DRS جنبًا إلى جنب",
    url: `${siteUrl}/compare`,
    inLanguage: "ar",
    description: "قارن تطبيقات كتالوق DRS في جدول واحد: الحالة والفئة وأحدث الإصدارات الحية ونجوم GitHub.",
  };

  return (
    <main className="container page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="breadcrumbs-row">
        <div className="breadcrumbs"><Link href="/">الرئيسية</Link> / <span aria-current="page">مقارنة التطبيقات</span></div>
        <BackButton fallback="/apps" label="عودة للتطبيقات" />
      </div>

      <div className="page-intro">
        <div className="eyebrow"><GitCompareArrows size={14} aria-hidden /> بيانات حية من GitHub كل ساعة</div>
        <h1>قارن التطبيقات</h1>
        <p>
          حيرة في الاختيار؟ ضع تطبيقين أو ثلاثة جنبًا إلى جنب وقارن حالتها وأحدث إصداراتها وتنزيلاتها ونجوم
          مستودعاتها في جدول واحد — ثم شارك رابط المقارنة مع من تحب.
        </p>
        <p className="about-langrow">
          <Link className="lang-cross" href="/en/compare" lang="en" dir="ltr">
            <Languages size={13} aria-hidden /> English version
          </Link>
        </p>
      </div>

      <CompareClient live={live} lang="ar" initial={initial} />
    </main>
  );
}
