import type { Metadata } from "next";
import Link from "next/link";
import { GitCompareArrows, Languages } from "lucide-react";
import { apps, relatedApps } from "@/lib/catalog";
import { fetchCatalogRepoStats } from "@/lib/github";
import { CompareClient, type CompareLive } from "@/components/compare-client";
import { EnDocument } from "@/components/en-document";

export const metadata: Metadata = {
  title: "Compare apps side by side — DRS",
  description:
    "Pick two or three apps from the DRS catalog and compare their status, category, latest live GitHub releases, downloads and stars in one table — shareable comparison links.",
  alternates: { languages: { ar: "/compare", en: "/en/compare" } },
};

export default async function EnglishComparePage({
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
  const initial: [string | null, string | null, string | null] = [
    a?.slug ?? null,
    b?.slug ?? (a ? relatedApps(a, 3)[0]?.slug ?? null : apps[0]?.slug ?? null),
    c?.slug ?? null,
  ];

  return (
    <>
      <EnDocument />
      <main className="container page en-page" lang="en" dir="ltr">
        <div className="en-topbar">
          <span className="en-brand">
            <span className="brand-grad">DRS</span> APPS &amp; MORE
          </span>
          <div className="en-top-actions">
            <Link href="/compare" className="gh-btn" lang="ar" dir="rtl">
              <Languages size={14} aria-hidden /> العربية
            </Link>
          </div>
        </div>

        <div className="page-intro">
          <div className="eyebrow"><GitCompareArrows size={14} aria-hidden /> Live GitHub data, refreshed hourly</div>
          <h1>Compare apps</h1>
          <p>
            Can&apos;t decide? Put two or three DRS apps side by side and compare their status, latest releases,
            download counts and GitHub stars in one table — then share the comparison link with anyone.
          </p>
        </div>

        <CompareClient live={live} lang="en" initial={initial} />
      </main>
    </>
  );
}
