import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Download, Tag, Rss, Activity, Clock, Flame, ArrowRight } from "lucide-react";
import { apps, appName, firstDownload } from "@/lib/catalog";
import { parseGithubRepo, fetchCatalogRepoStats, fetchRecentReleasesFeed, formatDateLocalized, isFreshRelease } from "@/lib/github";
import { UpdateChecker, type CheckerApp } from "@/components/update-checker";
import { ReleaseAlerts } from "@/components/release-alerts";
import { EnDocument } from "@/components/en-document";
import { EnTopbar, EnFooterNote } from "@/components/en-page-shell";
import { AppGlyph } from "@/components/app-glyph";

export const metadata: Metadata = {
  title: "What's new — latest live releases",
  description:
    "A live feed from GitHub: the newest releases of all DRS apps in chronological order with per-release notes, plus an update checker that compares your installed version against the latest published tag.",
  alternates: { languages: { ar: "/updates", en: "/en/updates" } },
};

/** Latest releases of every catalog app straight from GitHub (hourly refresh) + update checker */
export default async function EnglishUpdatesPage() {
  const repoRefs: { owner: string; repo: string; url: string }[] = [];
  for (const a of apps) {
    const ref = parseGithubRepo(a.repository);
    if (ref) repoRefs.push(ref);
  }
  const [feed, statsMap] = await Promise.all([
    fetchRecentReleasesFeed(repoRefs, 3, 14),
    fetchCatalogRepoStats(apps),
  ]);

  const now = Date.now();
  const last30 = feed.filter(r => r.publishedAt && now - Date.parse(r.publishedAt) < 30 * 24 * 60 * 60 * 1000).length;
  const perRepo = new Map<string, number>();
  for (const r of feed) perRepo.set(r.repo, (perRepo.get(r.repo) || 0) + 1);
  const topRepo = Array.from(perRepo.entries()).sort((a, b) => b[1] - a[1])[0];
  const topApp = topRepo ? apps.find(a => parseGithubRepo(a.repository)?.repo === topRepo[0]) ?? null : null;

  const checkerApps: CheckerApp[] = apps
    .map(a => {
      const st = statsMap[a.slug];
      const dl = firstDownload(a);
      return {
        slug: a.slug,
        name: appName(a, "en"),
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
    name: "What's new — latest DRS app releases",
    url: `${siteUrl}/en/updates`,
    inLanguage: "en",
    description: "A live log of the latest DRS app releases from the official GitHub repositories.",
  };

  return (
    <EnDocument>
      <main className="container page en-page" lang="en" dir="ltr">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <EnTopbar arHref="/updates" />

        <div className="page-intro">
          <div className="eyebrow"><Sparkles size={13} aria-hidden /> Hourly refresh from GitHub</div>
          <h1>What&apos;s new?</h1>
          <p>
            A live log that gathers the newest releases of every catalog app from the official GitHub
            repositories — each release&apos;s notes, date and download link in one place.
          </p>
        </div>

        <div className="updates-layout">
          <section className="updates-feed" aria-label="Live release feed">
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
                              <b>{appName(app, "en")}</b>
                            </Link>
                          )}
                          <span className="feed-tag" dir="ltr"><Tag size={12} aria-hidden /> {rel.tag}</span>
                          {rel.prerelease && <span className="tag pre">Preview</span>}
                          {isFreshRelease(rel.publishedAt) && <span className="tag new-badge"><Sparkles size={11} aria-hidden /> New</span>}
                        </header>
                        {rel.name && rel.name !== rel.tag && <p className="feed-title">{rel.name}</p>}
                        <time className="feed-date" dateTime={rel.publishedAt ?? undefined}>
                          <Clock size={12} aria-hidden /> {formatDateLocalized(rel.publishedAt, "en")}
                        </time>
                        {rel.notes && <p className="feed-notes" dir="auto">{rel.notes}</p>}
                        <footer className="feed-actions">
                          {apkUrl && (
                            <a className="button primary sm" href={apkUrl} target="_blank" rel="noreferrer">
                              <Download size={13} aria-hidden /> Download APK
                            </a>
                          )}
                          {app && <Link className="button secondary sm" href={`/apps/${app.slug}`}>App page</Link>}
                          <a className="text-link" href={rel.url} target="_blank" rel="noreferrer">
                            Release on GitHub <span aria-hidden>↗</span>
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
                <b>No releases to show right now</b>
                <p>Couldn&apos;t fetch the feed from GitHub at this moment — please try again shortly.</p>
              </div>
            )}
          </section>

          <aside className="updates-side">
            <section className="panel updates-pulse" aria-label="Release pulse">
              <h2><Activity size={16} aria-hidden /> Release pulse</h2>
              <div className="pulse-grid">
                <div className="pulse-cell">
                  <b>{feed.length}</b>
                  <span>releases in the log</span>
                </div>
                <div className="pulse-cell">
                  <b>{last30}</b>
                  <span>in the last 30 days</span>
                </div>
                {topApp && topRepo && (
                  <div className="pulse-cell wide">
                    <b><Flame size={14} aria-hidden /> {appName(topApp, "en")}</b>
                    <span>Most active ({topRepo[1]} releases shown)</span>
                  </div>
                )}
              </div>
            </section>

            <ReleaseAlerts apps={checkerApps} lang="en" />

            <UpdateChecker apps={checkerApps} lang="en" />

            <section className="panel" aria-label="Follow releases">
              <h2><Rss size={16} aria-hidden /> Follow the releases</h2>
              <p>
                Add any app&apos;s feed to your RSS reader to get releases first-hand, or visit the account-wide
                releases page on GitHub.
              </p>
              <a className="button secondary full" href="https://github.com/CTO-DRS/releases" target="_blank" rel="noreferrer">
                All account releases <span aria-hidden>↗</span>
              </a>
              <Link className="text-link" href="/en/apps">
                Browse the full catalog <ArrowRight size={14} aria-hidden />
              </Link>
            </section>
          </aside>
        </div>

        <EnFooterNote />
      </main>
    </EnDocument>
  );
}
