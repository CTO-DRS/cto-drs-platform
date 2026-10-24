import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutGrid, FolderGit2, Star, Languages, History, Rocket,
  ArrowLeft, Boxes, CircleAlert,
} from "lucide-react";
import { apps, catalogStats, categoriesWithCounts, categoryLabel } from "@/lib/catalog";
import {
  fetchOrgRepos, fetchLatestReleases, parseGithubRepo, fetchRepoReleaseSummary,
  compactNumber, formatDateAr, openSourceCount,
} from "@/lib/github";
import { AnimatedCounter } from "@/components/animated-counter";
import { BackButton } from "@/components/back-button";
import { Download, TrendingUp } from "lucide-react";

export const revalidate = 3600; // بيانات حية مُخزنة لمدة ساعة مثل بقية البوابة

export const metadata: Metadata = {
  title: "لوحة المؤشرات",
  description: "أرقام حية من GitHub والكتالوق: المستودعات، النجوم، الفوركات، توزيع اللغات، وأحدث الإصدارات — تُحدَّث كل ساعة.",
};

const GITHUB_OWNER = "CTO-DRS";

export default async function StatsPage() {
  const [org, releases] = await Promise.all([
    fetchOrgRepos(GITHUB_OWNER, 100),
    fetchLatestReleases(
      apps.map(a => parseGithubRepo(a.repository)).filter(r => r !== null),
      6
    ),
  ]);

  const totalStars = org.reduce((sum, r) => sum + r.stars, 0);
  const langMap = new Map<string, number>();
  for (const repo of org) {
    if (repo.language) langMap.set(repo.language, (langMap.get(repo.language) || 0) + 1);
  }
  const languages = Array.from(langMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxLang = languages[0]?.[1] ?? 1;
  const recentlyPushed = [...org]
    .sort((a, b) => (b.pushedAt ?? "").localeCompare(a.pushedAt ?? ""))
    .slice(0, 5);
  const categories = categoriesWithCounts();

  /* إجمالي التنزيلات الحقيقية من إصدارات الكتالوق على GitHub */
  const catalogRefs = apps.map(a => parseGithubRepo(a.repository)).filter(r => r !== null);
  const releaseSummaries = await Promise.all(
    catalogRefs.map(async ref => ({ repo: ref.repo, slug: apps.find(a => parseGithubRepo(a.repository)?.url === ref.url)?.slug ?? ref.repo, ...await fetchRepoReleaseSummary(ref) }))
  );
  const totalDownloads = releaseSummaries.reduce((sum, r) => sum + r.downloads, 0);
  const downloadRanking = [...releaseSummaries].filter(r => r.downloads > 0).sort((a, b) => b.downloads - a.downloads);
  const maxDownloads = downloadRanking[0]?.downloads ?? 1;

  const cells = [
    { icon: LayoutGrid, value: String(catalogStats.total), label: "تطبيقات في الكتالوج" },
    { icon: FolderGit2, value: String(org.length), label: "مستودع عام على GitHub" },
    { icon: Star, value: compactNumber(totalStars), label: "إجمالي النجوم" },
    { icon: Download, value: compactNumber(totalDownloads), label: "تحميل حقيقي من GitHub" },
  ];

  return (
    <main className="container page">
      <BackButton fallback="/" label="رجوع" />
      <div className="page-intro">
        <div className="eyebrow">شفافية كاملة</div>
        <h1>لوحة المؤشرات</h1>
        <p>
          أرقام حية تجلب مباشرة من GitHub API ومسح الكتالوق المحلي — بلا أي تقديرات أو أرقام مختلقة،
          وتُحدَّث تلقائيًا كل ساعة مثل بقية بيانات المنصة.
        </p>
      </div>

      <section className="stats-bar" aria-label="المؤشرات الرئيسية">
        {cells.map(cell => (
          <div className="stat-cell" key={cell.label}>
            <span className="stat-chip"><cell.icon size={17} /></span>
            <div className="stat-text">
              <b><AnimatedCounter value={cell.value} /></b>
              <span>{cell.label}</span>
            </div>
          </div>
        ))}
      </section>

      {org.length === 0 && (
        <div className="notice" role="status">
          <CircleAlert size={15} aria-hidden style={{ verticalAlign: "-3px" }} />{" "}
          تعذر جلب بيانات GitHub لحظة التحميل (تقييد الطلبات أو انقطاع مؤقت) — ستعود الأرقام الحية تلقائيًا
          عند نجاح الجلب القادم، وأرقام الكتالوق أدناه محلية ودقيقة دائمًا.
        </div>
      )}

      <div className="stats-columns">
        <section className="panel" aria-labelledby="langs-title">
          <h2 id="langs-title"><Languages size={17} aria-hidden /> لغات البرمجة في المستودعات</h2>
          {languages.length > 0 ? (
            <div className="lang-bars">
              {languages.map(([lang, count]) => (
                <div className="lang-bar-row" key={lang}>
                  <span className="lang-name" dir="ltr">{lang}</span>
                  <span className="lang-track" role="img" aria-label={`${lang}: ${count} مستودع`}>
                    <span style={{ width: `${Math.max(8, Math.round((count / maxLang) * 100))}%` }} />
                  </span>
                  <b className="lang-count">{count}</b>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">لا توجد بيانات لغات متاحة الآن.</p>
          )}

          <h2><History size={17} aria-hidden /> أحدث التطويرات</h2>
          {recentlyPushed.length > 0 ? (
            <ul className="stats-list">
              {recentlyPushed.map(repo => (
                <li key={repo.url}>
                  <a href={repo.url} target="_blank" rel="noreferrer" dir="ltr">{repo.name}</a>
                  <span className="muted">آخر تطوير: {formatDateAr(repo.pushedAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">لا توجد بيانات متاحة الآن.</p>
          )}
        </section>

        <section className="panel" aria-labelledby="dl-title">
          <h2 id="dl-title"><TrendingUp size={17} aria-hidden /> التحميلات الحقيقية لكل تطبيق</h2>
          {downloadRanking.length > 0 ? (
            <div className="lang-bars dl-bars">
              {downloadRanking.map(r => (
                <div className="lang-bar-row" key={r.repo}>
                  <span className="lang-name" dir="ltr">{r.repo}</span>
                  <span className="lang-track dl" role="img" aria-label={`${r.repo}: ${r.downloads} تحميل`}>
                    <span style={{ width: `${Math.max(4, Math.round((r.downloads / maxDownloads) * 100))}%` }} />
                  </span>
                  <b className="lang-count">{compactNumber(r.downloads)}</b>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">لم تُسجّل تنزيلات عبر GitHub Releases بعد — ستظهر الأرقام الحقيقية هنا تلقائيًا مع أول تحميل.</p>
          )}
          <p className="muted stats-note">
            الإجمالي {compactNumber(totalDownloads)} تحميلًا حقيقيًا من أصول الإصدارات الرسمية على GitHub — بلا أي تقدير.
          </p>

          <h2 id="rel-title"><Rocket size={17} aria-hidden /> أحدث الإصدارات من تطبيقات الكتالوج</h2>
          {releases.length > 0 ? (
            <ul className="stats-list">
              {releases.map(rel => (
                <li key={rel.url}>
                  <a href={rel.url} target="_blank" rel="noreferrer" dir="ltr">
                    {rel.repo} · {rel.tag}
                  </a>
                  <span className="muted">
                    {rel.publishedAt ? formatDateAr(rel.publishedAt) : "تاريخ غير محدد"}
                    {rel.prerelease ? " · إصدار مبدئي" : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">
              لم تُنشر إصدارات رسمية بعد في مستودعات الكتالوق — ستفهرس هنا تلقائيًا فور أول Release على GitHub.
            </p>
          )}

          <h2><Boxes size={17} aria-hidden /> الكتالوق حسب الفئة</h2>
          <div className="chips" role="list" aria-label="توزيع التطبيقات على الفئات">
            {categories.map(cat => (
              <span className="chip" role="listitem" key={cat.id}>
                {categoryLabel(cat.id)} <small>{cat.count}</small>
              </span>
            ))}
          </div>
          <p className="muted stats-note">
            {openSourceCount(apps)} من أصل {catalogStats.total} تطبيقات الكتالوج مربوطة بمستودعات عامة،
            و{catalogStats.inDevelopment} منها قيد التطوير النشط.
          </p>
          <Link className="text-link" href="/projects">تصفح المستودعات الحية كاملة <ArrowLeft size={14} aria-hidden /></Link>
        </section>
      </div>
    </main>
  );
}
