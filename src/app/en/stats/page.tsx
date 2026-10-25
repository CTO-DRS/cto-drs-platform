import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutGrid, FolderGit2, Star, Languages, History, Rocket,
  ArrowRight, Boxes, CircleAlert, Download, TrendingUp,
} from "lucide-react";
import { apps, catalogStats, categoriesWithCounts, categoryLabelEn } from "@/lib/catalog";
import {
  fetchOrgRepos, fetchLatestReleases, parseGithubRepo, fetchRepoReleaseSummary,
  compactNumber, formatDateLocalized, openSourceCount,
} from "@/lib/github";
import { AnimatedCounter } from "@/components/animated-counter";
import { EnDocument } from "@/components/en-document";
import { EnTopbar, EnFooterNote } from "@/components/en-page-shell";

export const revalidate = 3600; // live data cached for an hour like the rest of the portal

export const metadata: Metadata = {
  title: "Metrics dashboard — CTO-DRS",
  description:
    "Live numbers from GitHub and the catalog: repositories, stars, forks, language distribution and the latest releases — refreshed every hour.",
  alternates: { languages: { ar: "/stats", en: "/en/stats" } },
};

const GITHUB_OWNER = "CTO-DRS";

export default async function EnglishStatsPage() {
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

  const catalogRefs = apps.map(a => parseGithubRepo(a.repository)).filter(r => r !== null);
  const releaseSummaries = await Promise.all(
    catalogRefs.map(async ref => ({ repo: ref.repo, slug: apps.find(a => parseGithubRepo(a.repository)?.url === ref.url)?.slug ?? ref.repo, ...await fetchRepoReleaseSummary(ref) }))
  );
  const totalDownloads = releaseSummaries.reduce((sum, r) => sum + r.downloads, 0);
  const downloadRanking = [...releaseSummaries].filter(r => r.downloads > 0).sort((a, b) => b.downloads - a.downloads);
  const maxDownloads = downloadRanking[0]?.downloads ?? 1;

  const cells = [
    { icon: LayoutGrid, value: String(catalogStats.total), label: "Apps in the catalog" },
    { icon: FolderGit2, value: String(org.length), label: "Public repos on GitHub" },
    { icon: Star, value: compactNumber(totalStars), label: "Total stars" },
    { icon: Download, value: compactNumber(totalDownloads), label: "Real downloads from GitHub" },
  ];

  return (
    <EnDocument>
      <main className="container page en-page" lang="en" dir="ltr">
        <EnTopbar arHref="/stats" />
        <div className="page-intro">
          <div className="eyebrow">Full transparency</div>
          <h1>Metrics dashboard</h1>
          <p>
            Live numbers pulled directly from the GitHub API and a local catalog scan — no estimates or invented
            figures, refreshed automatically every hour like the rest of the platform&apos;s data.
          </p>
        </div>

        <section className="stats-bar" aria-label="Key metrics">
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
            Couldn&apos;t fetch GitHub data at load time (rate limiting or a temporary outage) — the live numbers
            will return automatically on the next successful fetch, and the catalog numbers below are local and
            always accurate.
          </div>
        )}

        <div className="stats-columns">
          <section className="panel" aria-labelledby="langs-title">
            <h2 id="langs-title"><Languages size={17} aria-hidden /> Programming languages across the repos</h2>
            {languages.length > 0 ? (
              <div className="lang-bars">
                {languages.map(([lang, count]) => (
                  <div className="lang-bar-row" key={lang}>
                    <span className="lang-name" dir="ltr">{lang}</span>
                    <span className="lang-track" role="img" aria-label={`${lang}: ${count} repositories`}>
                      <span style={{ width: `${Math.max(8, Math.round((count / maxLang) * 100))}%` }} />
                    </span>
                    <b className="lang-count">{count}</b>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">No language data available right now.</p>
            )}

            <h2><History size={17} aria-hidden /> Latest development activity</h2>
            {recentlyPushed.length > 0 ? (
              <ul className="stats-list">
                {recentlyPushed.map(repo => (
                  <li key={repo.url}>
                    <a href={repo.url} target="_blank" rel="noreferrer" dir="ltr">{repo.name}</a>
                    <span className="muted">Last push: {formatDateLocalized(repo.pushedAt, "en")}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No data available right now.</p>
            )}
          </section>

          <section className="panel" aria-labelledby="dl-title">
            <h2 id="dl-title"><TrendingUp size={17} aria-hidden /> Real downloads per app</h2>
            {downloadRanking.length > 0 ? (
              <div className="lang-bars dl-bars">
                {downloadRanking.map(r => (
                  <div className="lang-bar-row" key={r.repo}>
                    <span className="lang-name" dir="ltr">{r.repo}</span>
                    <span className="lang-track dl" role="img" aria-label={`${r.repo}: ${r.downloads} downloads`}>
                      <span style={{ width: `${Math.max(4, Math.round((r.downloads / maxDownloads) * 100))}%` }} />
                    </span>
                    <b className="lang-count">{compactNumber(r.downloads)}</b>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">No downloads recorded through GitHub Releases yet — the real numbers will appear here automatically with the first download.</p>
            )}
            <p className="muted stats-note">
              {compactNumber(totalDownloads)} real downloads in total from official release assets on GitHub — no estimates.
            </p>

            <h2 id="rel-title"><Rocket size={17} aria-hidden /> Latest releases from catalog apps</h2>
            {releases.length > 0 ? (
              <ul className="stats-list">
                {releases.map(rel => (
                  <li key={rel.url}>
                    <a href={rel.url} target="_blank" rel="noreferrer" dir="ltr">
                      {rel.repo} · {rel.tag}
                    </a>
                    <span className="muted">
                      {rel.publishedAt ? formatDateLocalized(rel.publishedAt, "en") : "Unknown date"}
                      {rel.prerelease ? " · pre-release" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">
                No official releases published in the catalog repos yet — they&apos;ll be indexed here automatically after the first Release on GitHub.
              </p>
            )}

            <h2><Boxes size={17} aria-hidden /> The catalog by category</h2>
            <div className="chips" role="list" aria-label="Apps distributed across categories">
              {categories.map(cat => (
                <span className="chip" role="listitem" key={cat.id}>
                  {categoryLabelEn(cat.id)} <small>{cat.count}</small>
                </span>
              ))}
            </div>
            <p className="muted stats-note">
              {openSourceCount(apps)} of the {catalogStats.total} catalog apps are linked to public repositories,
              and {catalogStats.inDevelopment} of them are under active development.
            </p>
            <Link className="text-link" href="/en/projects">Browse all the live repositories <ArrowRight size={14} aria-hidden /></Link>
          </section>
        </div>

        <EnFooterNote />
      </main>
    </EnDocument>
  );
}
