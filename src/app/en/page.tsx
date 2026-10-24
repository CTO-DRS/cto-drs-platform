import Link from "next/link";
import { Github, Star, ExternalLink, ArrowRight, Languages, ShieldCheck, Headphones, RefreshCw, Download, Code2 } from "lucide-react";
import { apps, appSummary, catalogStats, categoryLabelEn } from "@/lib/catalog";
import { compactNumber, fetchOrgRepos, openSourceCount } from "@/lib/github";
import { EnDocument } from "@/components/en-document";
import { AppGlyph } from "@/components/app-glyph";

export const metadata = {
  title: "DRS Apps & More — Android apps, tools and open-source projects",
  description:
    "The official DRS catalog: Android apps and web tools in one place, with live open-source repositories on GitHub. English overview of the CTO-DRS platform.",
  alternates: { languages: { ar: "/", en: "/en" } },
};

const GITHUB_OWNER = process.env.GITHUB_OWNER || "CTO-DRS";

const STATUS_EN: Record<string, string> = {
  released: "Available",
  "in-development": "In development",
  archived: "Archived",
};

const EN_FEATURES = [
  { icon: ShieldCheck, label: "Secure & reliable" },
  { icon: Download, label: "Direct downloads" },
  { icon: Headphones, label: "Technical support" },
  { icon: RefreshCw, label: "Continuous updates" },
];

export default async function EnglishPage() {
  const oss = openSourceCount(apps);
  const repos = await fetchOrgRepos(GITHUB_OWNER, 6);
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  const starText = totalStars === 1 ? "1 star" : `${compactNumber(totalStars)} stars`;

  return (
    <>
      <EnDocument />
      <main className="container page en-page" lang="en" dir="ltr">
      {/* ===== Top bar ===== */}
      <div className="en-topbar">
        <span className="en-brand">
          <span className="brand-grad">DRS</span> APPS &amp; MORE
        </span>
        <div className="en-top-actions">
          <Link href="/" className="gh-btn" lang="ar" dir="rtl">
            <Languages size={14} aria-hidden /> العربية
          </Link>
          <a className="gh-btn" href={`https://github.com/${GITHUB_OWNER}`} target="_blank" rel="noreferrer">
            <Github size={14} aria-hidden /> GitHub <span aria-hidden>↗</span>
          </a>
        </div>
      </div>

      {/* ===== Hero ===== */}
      <section className="en-hero">
        <h1>
          All your apps, <span className="brand-grad">one place</span>
        </h1>
        <p className="lead">
          The official DRS catalog — carefully crafted Android apps and web tools, documented projects,
          and open-source repositories you can actually explore. Built with a focus on detail and a better
          user experience.
        </p>
        <ul className="hero-feats" dir="ltr">
          {EN_FEATURES.map(f => (
            <li key={f.label}>
              <f.icon size={19} aria-hidden />
              <span>{f.label}</span>
            </li>
          ))}
        </ul>
        <div className="en-actions">
          <Link className="btn-grad" href="/apps">
            Browse the catalog <ArrowRight size={17} aria-hidden />
          </Link>
          <Link className="btn-dark" href="/support">Get support</Link>
        </div>
      </section>

      {/* ===== Honest stats ===== */}
      <div className="stats-bar" aria-label="Catalog facts">
        <div className="stat-cell">
          <span className="stat-chip"><Code2 size={17} /></span>
          <div className="stat-text"><b>{catalogStats.total}</b><span>Apps in the catalog</span></div>
        </div>
        <div className="stat-cell">
          <span className="stat-chip"><Code2 size={17} /></span>
          <div className="stat-text"><b>{catalogStats.categories}</b><span>Categories</span></div>
        </div>
        <div className="stat-cell">
          <span className="stat-chip"><Code2 size={17} /></span>
          <div className="stat-text"><b>{catalogStats.platforms.join(" · ")}</b><span>Platforms</span></div>
        </div>
        <div className="stat-cell">
          <span className="stat-chip"><Github size={17} /></span>
          <div className="stat-text"><b>{oss}</b><span>Open-source apps</span></div>
        </div>
      </div>

      {/* ===== Catalog ===== */}
      <div className="en-section-title">
        <h2>The catalog</h2>
        <Link href="/apps">Full catalog with search &amp; filters →</Link>
      </div>
      <div className="en-app-list">
        {apps.map(app => (
          <article className="en-app-row" key={app.slug}>
            <span className="app-icon" aria-hidden><AppGlyph appIcon={app.appIcon} letter={app.name.en.slice(0, 1)} /></span>
            <div>
              <h3>{app.name.en}</h3>
              <p>{appSummary(app, "en")}</p>
            </div>
            <div className="row-side">
              <span className={`status ${app.status}`}>{STATUS_EN[app.status]}</span>
              <span className="cat-tag">{categoryLabelEn(app.category)}</span>
              <Link className="en-row-link" href={`/apps/${app.slug}`}>Details →</Link>
            </div>
          </article>
        ))}
      </div>

      {/* ===== GitHub band ===== */}
      <section className="en-gh-band" aria-labelledby="en-gh-title">
        <div>
          <b id="en-gh-title">Open development on GitHub</b>
          <p>
            {repos.length > 0
              ? `${repos.length}+ active public repositories${totalStars > 0 ? ` · ${starText}` : ""} — browse the source, report issues, and follow releases.`
              : "Browse the source code, report issues, and follow releases for every DRS app."}
          </p>
        </div>
        <div className="en-gh-actions">
          {repos.slice(0, 3).map(r => (
            <a key={r.name} className="gh-btn" href={r.url} target="_blank" rel="noreferrer" dir="ltr">
              <Star size={12} aria-hidden /> {r.name}
            </a>
          ))}
          <a className="btn-grad sm" href={`https://github.com/${GITHUB_OWNER}?tab=repositories`} target="_blank" rel="noreferrer">
            All repositories <ExternalLink size={14} aria-hidden />
          </a>
        </div>
      </section>

      {/* ===== Footer note ===== */}
      <div className="en-footer-note">
        <span>© {new Date().getFullYear()} DRS — CTO.DRS. All rights reserved.</span>
        <span>
          Full experience in Arabic: <Link href="/">النسخة العربية</Link>
        </span>
      </div>
    </main>
    </>
  );
}
