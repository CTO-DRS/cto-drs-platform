import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck, Bell, Code2, GitCompareArrows, Github, Globe, Heart, Languages, Mail,
  RefreshCw, ShieldCheck, Smartphone, Sparkles, Target,
} from "lucide-react";
import { apps, site, catalogStats } from "@/lib/catalog";
import { openSourceCount } from "@/lib/github";
import { EnDocument } from "@/components/en-document";

export const metadata: Metadata = {
  title: "About the platform — CTO-DRS",
  description:
    "Meet the CTO-DRS platform: an open-source Arabic catalog that brings DRS apps together in one place with live GitHub stats, full privacy and a real PWA experience.",
  alternates: { languages: { ar: "/about", en: "/en/about" } },
};

export default function EnglishAboutPage() {
  const { cto, brand } = site;
  const oss = openSourceCount(apps);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cto-drs.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About the DRS platform",
    url: `${siteUrl}/en/about`,
    inLanguage: "en",
    mainEntity: {
      "@type": "Organization",
      name: "CTO-DRS",
      url: "https://github.com/CTO-DRS",
      email: cto.email,
      description: "An open-source platform that catalogs DRS apps in one place with live GitHub statistics.",
    },
  };

  const offers = [
    {
      icon: Smartphone,
      title: "A trustworthy official catalog",
      text: "Every app gets a full profile: description, features, requirements, changelog and direct download links — no redirects, no shady shorteners.",
    },
    {
      icon: RefreshCw,
      title: "Live releases from GitHub",
      text: "The “What’s new” page pulls the latest releases from official repositories every hour, with per-release notes, dates and an update checker for your installed version.",
    },
    {
      icon: GitCompareArrows,
      title: "Side-by-side comparison",
      text: "A dedicated comparison page puts two or three apps in one table: status, category, latest live release, downloads and repo stars — with shareable comparison links.",
    },
    {
      icon: Bell,
      title: "Release notifications",
      text: "Enable browser notifications and get alerted whenever a new release ships for any app in your favorites, with a clear log of every alert — all stored on your device.",
    },
    {
      icon: Heart,
      title: "Local favorites, full privacy",
      text: "Organizing favorites and recently-viewed apps happens locally in your browser’s storage — no sign-up, and nothing is ever sent to a server.",
    },
    {
      icon: Globe,
      title: "A real installable app",
      text: "The platform is a progressive web app (PWA): install it to your home screen, browse with partial offline support, and share app links with custom OG images and QR codes.",
    },
  ];

  const values = [
    {
      icon: Code2,
      title: "Open source as a principle, not a badge",
      text: "Every listed app links to its public repository — read the code, browse the issues, and follow development line by line.",
    },
    {
      icon: ShieldCheck,
      title: "Privacy before everything",
      text: "No forced accounts, no ad tracking: your favorites, theme and notifications stay local, and what little analytics we collect is non-identifying.",
    },
    {
      icon: BadgeCheck,
      title: "Real numbers, never inflated",
      text: "Stars, downloads and releases are pulled straight from the GitHub API and refresh hourly — we never show a number we can’t verify.",
    },
    {
      icon: Target,
      title: "Arabic first, global reach",
      text: "A native RTL Arabic experience built to world-class standards, with an English layer for wider reach.",
    },
  ];

  return (
    <>
      <EnDocument />
      <main className="container page en-page" lang="en" dir="ltr">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="en-topbar">
          <span className="en-brand">
            <span className="brand-grad">DRS</span> APPS &amp; MORE
          </span>
          <div className="en-top-actions">
            <Link href="/about" className="gh-btn" lang="ar" dir="rtl">
              <Languages size={14} aria-hidden /> العربية
            </Link>
            <a className="gh-btn" href="https://github.com/CTO-DRS" target="_blank" rel="noreferrer">
              <Github size={14} aria-hidden /> GitHub <span aria-hidden>↗</span>
            </a>
          </div>
        </div>

        <div className="page-intro">
          <div className="eyebrow"><Sparkles size={13} aria-hidden /> {brand.name} — {brand.tagline}</div>
          <h1>About the platform</h1>
          <p className="about-lead">
            The DRS platform is the official web home of CTO-DRS apps: an open-source Arabic catalog that gathers
            Android apps and web tools in one place and presents them with full transparency — from each app’s
            description and changelog to its public source repository and live statistics. The project was born
            from a simple belief: Arabic-speaking users deserve to browse apps with the same polish as global
            stores, in their own language.
          </p>
          <p className="about-lead">
            Today the catalog lists {catalogStats.total} real apps across {catalogStats.categories} categories,
            all linked to public GitHub repositories ({oss} with actively maintained repos), plus an hourly
            release feed, an update checker and on-device release notifications. And this is just the beginning —
            the roadmap includes a bigger catalog, cross-device favorite syncing, and more.
          </p>
        </div>

        <div className="stats-bar" aria-label="Platform facts">
          <div className="stat-cell">
            <span className="stat-chip"><Smartphone size={17} aria-hidden /></span>
            <div className="stat-text"><b>{catalogStats.total}</b><span>Apps in the catalog</span></div>
          </div>
          <div className="stat-cell">
            <span className="stat-chip"><Code2 size={17} aria-hidden /></span>
            <div className="stat-text"><b>{catalogStats.categories}</b><span>Categories covered</span></div>
          </div>
          <div className="stat-cell">
            <span className="stat-chip"><Github size={17} aria-hidden /></span>
            <div className="stat-text"><b>{oss}</b><span>Apps with live repos</span></div>
          </div>
          <div className="stat-cell">
            <span className="stat-chip"><RefreshCw size={17} aria-hidden /></span>
            <div className="stat-text"><b>100%</b><span>Open source on GitHub</span></div>
          </div>
        </div>

        <section className="about-section" aria-labelledby="en-about-offers">
          <div className="section-heading">
            <div>
              <div className="eyebrow">What the platform offers</div>
              <h2 id="en-about-offers">Everything around your apps, in one place</h2>
            </div>
          </div>
          <div className="offer-list">
            {offers.map(o => (
              <article className="offer-card" key={o.title}>
                <span className="offer-ico"><o.icon size={20} aria-hidden /></span>
                <b>{o.title}</b>
                <p>{o.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" aria-labelledby="en-about-values">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Our values</div>
              <h2 id="en-about-values">The principles behind every page</h2>
            </div>
          </div>
          <div className="value-grid">
            {values.map(v => (
              <article className="value-card" key={v.title}>
                <v.icon size={20} aria-hidden />
                <b>{v.title}</b>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel about-person-panel" aria-labelledby="en-about-person">
          <div className="about-person">
            <span className="account-avatar" aria-hidden><Github size={26} aria-hidden /></span>
            <div className="about-person-body">
              <div className="eyebrow">The person behind the platform</div>
              <h2 id="en-about-person">{cto.name} — Chief Technology Officer</h2>
              <p>
                Building every app from idea to release: design, code, testing and documentation — then opening
                everything on GitHub so development stays visible and reviewable by anyone.
              </p>
              <div className="about-cta">
                <a className="btn-grad sm" href="https://github.com/CTO-DRS" target="_blank" rel="noreferrer">
                  <Github size={15} aria-hidden /> Follow development on GitHub
                </a>
                <Link className="btn-dark sm" href="/projects">Open-source projects</Link>
                <a className="text-link" href={`mailto:${cto.email}`}><Mail size={14} aria-hidden /> {cto.email}</a>
              </div>
            </div>
          </div>
        </section>

        <section className="panel about-start" aria-labelledby="en-about-start">
          <h2 id="en-about-start"><Sparkles size={17} aria-hidden /> Start here</h2>
          <p>Ready to explore? These are the fastest paths in:</p>
          <div className="about-links-grid">
            <Link className="about-link-card" href="/apps">
              <Smartphone size={18} aria-hidden /><b>Browse the catalog</b><span>Search and filter {catalogStats.total} apps</span>
            </Link>
            <Link className="about-link-card" href="/en/compare">
              <GitCompareArrows size={18} aria-hidden /><b>Compare apps</b><span>Put up to 3 apps side by side</span>
            </Link>
            <Link className="about-link-card" href="/updates">
              <RefreshCw size={18} aria-hidden /><b>What’s new</b><span>Live releases straight from GitHub</span>
            </Link>
            <Link className="about-link-card" href="/account">
              <Bell size={18} aria-hidden /><b>Favorites &amp; notifications</b><span>Watch for new releases on your device</span>
            </Link>
          </div>
        </section>

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
