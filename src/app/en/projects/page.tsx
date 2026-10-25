import type { Metadata } from "next";
import Link from "next/link";
import { FolderOpen, Github, Star, GitFork, CircleDot, ExternalLink, Code2, Rocket, Tag } from "lucide-react";
import { apps, appName, appSummary, categoryLabelEn, catalogStats } from "@/lib/catalog";
import { compactNumber, fetchOrgRepos, fetchLatestReleases, formatDateLocalized, parseGithubRepo } from "@/lib/github";
import { EnDocument } from "@/components/en-document";
import { EnTopbar, EnFooterNote } from "@/components/en-page-shell";
import { AppGlyph } from "@/components/app-glyph";

export const metadata: Metadata = {
  title: "Projects — CTO-DRS",
  description: "Follow CTO-DRS projects, their status and their technical categories, plus the latest releases and live repositories.",
  alternates: { languages: { ar: "/projects", en: "/en/projects" } },
};

const GITHUB_OWNER = process.env.GITHUB_OWNER || "CTO-DRS";

const STATUS_EN: Record<string, string> = {
  released: "Available",
  "in-development": "In development",
  archived: "Archived",
};

export default async function EnglishProjectsPage() {
  const repos = await fetchOrgRepos(GITHUB_OWNER, 12);
  const linkedRepos = apps
    .map(a => parseGithubRepo(a.repository))
    .filter((r): r is NonNullable<typeof r> => r !== null);
  const releases = await fetchLatestReleases(linkedRepos, 6);

  return (
    <EnDocument>
      <main className="container page en-page" lang="en" dir="ltr">
        <EnTopbar arHref="/projects" />
        <div className="page-intro">
          <div className="eyebrow">The development space</div>
          <h1>Projects</h1>
          <p>
            Follow the projects, their status and the repository links being officially documented. This view is
            for following development — for downloads head to the apps catalog.
          </p>
        </div>
        <div className="stats-band inline-stats" aria-label="Catalog summary">
          <div className="stat"><b>{catalogStats.total}</b><span>projects</span></div>
          <div className="stat"><b>{catalogStats.categories}</b><span>categories</span></div>
          <div className="stat"><b>{catalogStats.inDevelopment}</b><span>in development</span></div>
        </div>
        <div className="app-grid">
          {apps.map(app => (
            <article className="app-card" key={app.slug}>
              <div className="app-icon"><AppGlyph appIcon={app.appIcon} letter={app.name.en.slice(0, 1)} /></div>
              <div className="app-card-body">
                <div className="app-title-row">
                  <h3>{appName(app, "en")}</h3>
                  <span className={`status ${app.status}`}>{STATUS_EN[app.status]}</span>
                </div>
                <p>{appSummary(app, "en")}</p>
                <div className="app-card-bottom">
                  <span className="cat-tag"><FolderOpen size={13} aria-hidden /> {categoryLabelEn(app.category)}</span>
                  <Link href={`/apps/${app.slug}`}>Project details →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ===== Latest published releases ===== */}
        {releases.length > 0 && (
          <section className="repos-section top-margin" aria-labelledby="releases-heading">
            <div className="section-head">
              <h2 id="releases-heading">
                <Rocket size={20} aria-hidden className="head-icon" /> Latest published releases
              </h2>
              <p>The newest official release from every catalog-linked app repository — straight from GitHub.</p>
            </div>
            <div className="releases-grid">
              {releases.map(rel => (
                <article className="release-card" key={rel.repo}>
                  <div className="release-head">
                    <span className="release-tag"><Tag size={12} aria-hidden /> {rel.tag}</span>
                    {rel.prerelease && <span className="release-pre">Pre-release</span>}
                    <a className="release-open" href={rel.url} target="_blank" rel="noreferrer" aria-label={`Open the ${rel.repo} release`}>
                      <ExternalLink size={13} aria-hidden />
                    </a>
                  </div>
                  <b className="release-name" dir="auto">{rel.name || rel.repo}</b>
                  <span className="release-repo" dir="ltr">{rel.repo}</span>
                  {rel.notes && <p className="release-notes" dir="auto">{rel.notes}</p>}
                  <span className="release-date">Published: {formatDateLocalized(rel.publishedAt, "en")}</span>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ===== Live repositories from GitHub ===== */}
        <section className="repos-section top-margin" aria-labelledby="repos-heading">
          <div className="section-head">
            <h2 id="repos-heading">
              <Github size={20} aria-hidden className="head-icon" /> Open repositories on GitHub
            </h2>
            <p>
              The latest public repositories of the <b dir="ltr">{GITHUB_OWNER}</b> account sorted by last push —
              live data refreshed every hour.
            </p>
          </div>

          {repos.length > 0 ? (
            <>
              <div className="repo-grid">
                {repos.map(repo => (
                  <article className="repo-card" key={repo.name}>
                    <div className="repo-card-head">
                      <span className="repo-avatar"><Github size={16} aria-hidden /></span>
                      <a className="repo-name" href={repo.url} target="_blank" rel="noreferrer" dir="ltr">{repo.name}</a>
                      <a className="repo-open" href={repo.url} target="_blank" rel="noreferrer" aria-label={`Open ${repo.name} on GitHub`}>
                        <ExternalLink size={13} aria-hidden />
                      </a>
                    </div>
                    {repo.description && <p className="repo-desc" dir="auto">{repo.description}</p>}
                    <div className="repo-meta">
                      {repo.language && (
                        <span className="gh-stat"><Code2 size={12} aria-hidden /> {repo.language}</span>
                      )}
                      <span className="gh-stat"><Star size={12} aria-hidden /> {compactNumber(repo.stars)}</span>
                      <span className="gh-stat"><GitFork size={12} aria-hidden /> {compactNumber(repo.forks)}</span>
                      <span className="gh-stat"><CircleDot size={12} aria-hidden /> {formatDateLocalized(repo.pushedAt, "en")}</span>
                    </div>
                  </article>
                ))}
              </div>
              <div className="repos-more">
                <a className="gh-btn" href={`https://github.com/${GITHUB_OWNER}?tab=repositories`} target="_blank" rel="noreferrer">
                  View all repositories on GitHub <span aria-hidden>↗</span>
                </a>
              </div>
            </>
          ) : (
            <div className="notice">
              <b>Couldn&apos;t fetch the repositories right now.</b> You can always browse them directly at{" "}
              <a href={`https://github.com/${GITHUB_OWNER}`} target="_blank" rel="noreferrer">github.com/{GITHUB_OWNER}</a>.
            </div>
          )}
        </section>

        <div className="notice top-margin">
          <b>For developers:</b> this catalog is managed from a <code>content/apps.json</code> file inside the GitHub
          repository, and every change goes through pull-request review.
        </div>

        <EnFooterNote />
      </main>
    </EnDocument>
  );
}
