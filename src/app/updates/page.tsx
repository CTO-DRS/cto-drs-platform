import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Download, Tag, Rss, Activity, Clock, Flame, ArrowLeft } from "lucide-react";
import { apps, appName, firstDownload } from "@/lib/catalog";
import { parseGithubRepo, fetchCatalogRepoStats, fetchRecentReleasesFeed, formatDateAr, isFreshRelease } from "@/lib/github";
import { UpdateChecker, type CheckerApp } from "@/components/update-checker";
import { ReleaseAlerts } from "@/components/release-alerts";
import { BackButton } from "@/components/back-button";
import { AppGlyph } from "@/components/app-glyph";

export const metadata: Metadata = {
  title: "ما الجديد — أحدث الإصدارات الحية",
  description: "تغذية حية من GitHub: أحدث إصدارات جميع تطبيقات DRS مرتبة زمنيًا مع ملاحظات كل إصدار وفاحص تحديثات لمقارنة نسختك بأحدث وسم منشور.",
};

/** أحدث إصدارات كل تطبيقات الكتالوج مباشرة من GitHub (تُحدّث كل ساعة) + فاحص تحديثات */
export default async function UpdatesPage() {
  /* مراجع مستودعات الكتالوق لجلب التغذية المجمعة */
  const repoRefs: { owner: string; repo: string; url: string }[] = [];
  for (const a of apps) {
    const ref = parseGithubRepo(a.repository);
    if (ref) repoRefs.push(ref);
  }
  const [feed, statsMap] = await Promise.all([
    fetchRecentReleasesFeed(repoRefs, 3, 14),
    fetchCatalogRepoStats(apps),
  ]);

  /* إحصاءات حقيقية مشتقة من التغذية فقط */
  const now = Date.now();
  const last30 = feed.filter(r => r.publishedAt && now - Date.parse(r.publishedAt) < 30 * 24 * 60 * 60 * 1000).length;
  const perRepo = new Map<string, number>();
  for (const r of feed) perRepo.set(r.repo, (perRepo.get(r.repo) || 0) + 1);
  const topRepo = Array.from(perRepo.entries()).sort((a, b) => b[1] - a[1])[0];
  const topApp = topRepo ? apps.find(a => parseGithubRepo(a.repository)?.repo === topRepo[0]) ?? null : null;

  /* خيارات فاحص التحديثات: كل التطبيقات مرتبة بأحدث إصدار */
  const checkerApps: CheckerApp[] = apps
    .map(a => {
      const st = statsMap[a.slug];
      const dl = firstDownload(a);
      return {
        slug: a.slug,
        name: appName(a),
        latestTag: st?.latestTag ?? null,
        releasedAt: st?.releasedAt ?? null,
        apkUrl: dl && dl.kind === "apk" ? dl.url : null,
      };
    })
    .sort((a, b) => (b.releasedAt ?? "").localeCompare(a.releasedAt ?? ""));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cto-drs.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ما الجديد — أحدث إصدارات تطبيقات DRS",
    url: `${siteUrl}/updates`,
    inLanguage: "ar",
    description: "سجل حي لأحدث إصدارات تطبيقات DRS من مستودعات GitHub الرسمية.",
  };

  return (
    <main className="container page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="breadcrumbs-row">
        <div className="breadcrumbs"><Link href="/">الرئيسية</Link> / <span aria-current="page">ما الجديد</span></div>
        <BackButton fallback="/" label="رجوع" />
      </div>

      <div className="page-intro">
        <div className="eyebrow"><Sparkles size={13} aria-hidden /> تحديث كل ساعة من GitHub</div>
        <h1>ما الجديد؟</h1>
        <p>
          سجل حي يجمع أحدث إصدارات جميع تطبيقات الكتالوج من مستودعات GitHub الرسمية — ملاحظات كل إصدار
          وتاريخه ورابط تحميله في مكان واحد.
        </p>
      </div>

      <div className="updates-layout">
        <section className="updates-feed" aria-label="تغذية الإصدارات الحية">
          {feed.length > 0 ? (
            <ol className="feed-list">
              {feed.map(rel => {
                const app = apps.find(a => parseGithubRepo(a.repository)?.repo === rel.repo) ?? null;
                const apk = app ? firstDownload(app) : null;
                const apkUrl = apk && apk.kind === "apk" ? apk.url : null;
                return (
                  <li className="feed-item" key={`${rel.repo}-${rel.tag}`}>
                    <span className="feed-dot" aria-hidden />
                    <article className="feed-card">
                      <header className="feed-head">
                        {app && (
                          <Link className="feed-app" href={`/apps/${app.slug}`}>
                            <span className="app-icon mini"><AppGlyph appIcon={app.appIcon} letter={app.name.en.slice(0, 1)} /></span>
                            <b>{appName(app)}</b>
                          </Link>
                        )}
                        <span className="feed-tag" dir="ltr"><Tag size={12} aria-hidden /> {rel.tag}</span>
                        {rel.prerelease && <span className="tag pre">معاينة</span>}
                        {isFreshRelease(rel.publishedAt) && <span className="tag new-badge"><Sparkles size={11} aria-hidden /> جديد</span>}
                      </header>
                      {rel.name && rel.name !== rel.tag && <p className="feed-title">{rel.name}</p>}
                      <time className="feed-date" dateTime={rel.publishedAt ?? undefined}>
                        <Clock size={12} aria-hidden /> {formatDateAr(rel.publishedAt)}
                      </time>
                      {rel.notes && <p className="feed-notes">{rel.notes}</p>}
                      <footer className="feed-actions">
                        {apkUrl && (
                          <a className="button primary sm" href={apkUrl} target="_blank" rel="noreferrer">
                            <Download size={13} aria-hidden /> تحميل APK
                          </a>
                        )}
                        {app && <Link className="button secondary sm" href={`/apps/${app.slug}`}>صفحة التطبيق</Link>}
                        <a className="text-link" href={rel.url} target="_blank" rel="noreferrer">
                          الإصدار على GitHub <span aria-hidden>↗</span>
                        </a>
                      </footer>
                    </article>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="empty-state">
              <Rss size={34} aria-hidden />
              <b>لا توجد إصدارات معروضة الآن</b>
              <p>تعذر جلب التغذية من GitHub في هذه اللحظة — أعد المحاولة بعد قليل.</p>
            </div>
          )}
        </section>

        <aside className="updates-side">
          <section className="panel updates-pulse" aria-label="نبض الإصدارات">
            <h2><Activity size={16} aria-hidden /> نبض الإصدارات</h2>
            <div className="pulse-grid">
              <div className="pulse-cell">
                <b>{feed.length}</b>
                <span>إصدارًا في السجل</span>
              </div>
              <div className="pulse-cell">
                <b>{last30}</b>
                <span>خلال آخر 30 يومًا</span>
              </div>
              {topApp && topRepo && (
                <div className="pulse-cell wide">
                  <b><Flame size={14} aria-hidden /> {appName(topApp)}</b>
                  <span>الأكثر نشاطًا ({topRepo[1]} إصدارات معروضة)</span>
                </div>
              )}
            </div>
          </section>

          <ReleaseAlerts apps={checkerApps} />

          <UpdateChecker apps={checkerApps} />

          <section className="panel" aria-label="متابعة الإصدارات">
            <h2><Rss size={16} aria-hidden /> تابع الإصدارات</h2>
            <p>أضف تغذية أي تطبيق إلى قارئ RSS لديك لتصلك الإصدارات أولًا بأول، أو زر صفحة الإصدارات المجمعة على GitHub.</p>
            <a className="button secondary full" href="https://github.com/CTO-DRS/releases" target="_blank" rel="noreferrer">
              كل إصدارات الحساب <span aria-hidden>↗</span>
            </a>
            <Link className="text-link" href="/apps">
              تصفح الكتالوق كاملًا <ArrowLeft size={14} aria-hidden />
            </Link>
          </section>
        </aside>
      </div>
    </main>
  );
}
