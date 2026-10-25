import type { Metadata } from "next";
import Link from "next/link";
import { UserRound, Github, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { apps, site, appName } from "@/lib/catalog";
import { fetchCatalogRepoStats, fetchRecentReleasesFeed, parseGithubRepo } from "@/lib/github";
import { FavoritesSection } from "@/components/favorites-section";
import { ReleaseAlerts, type ReleaseWatchApp } from "@/components/release-alerts";
import { NotifyLog } from "@/components/notify-log";
import { EnDocument } from "@/components/en-document";
import { EnTopbar, EnFooterNote } from "@/components/en-page-shell";

export const metadata: Metadata = {
  title: "Account — CTO-DRS",
  description:
    "The DRS platform account hub — your favorites, release notifications and the alert log, all stored on your device.",
  alternates: { languages: { ar: "/account", en: "/en/account" } },
};

export default async function EnglishAccountPage() {
  const { cto } = site;

  /* Live release stats for every app (hourly) + the latest release notes per repo,
     so browser notifications can include an excerpt of the release notes. */
  const repoRefs = apps
    .map(a => parseGithubRepo(a.repository))
    .filter((r): r is NonNullable<typeof r> => r !== null);
  const [statsMap, feed] = await Promise.all([
    fetchCatalogRepoStats(apps),
    fetchRecentReleasesFeed(repoRefs, 1, 20),
  ]);

  /* أحدث ملاحظات لكل مستودع (من إصداره الأحدث) — تُطابق بالوسم داخل المكوّن عبر latestTag */
  const notesBySlug = new Map<string, string | null>();
  for (const a of apps) {
    const ref = parseGithubRepo(a.repository);
    if (!ref) continue;
    const rel = feed.find(r => r.repo === ref.repo);
    notesBySlug.set(a.slug, rel?.notes ?? null);
  }

  const watchApps: ReleaseWatchApp[] = apps.map(a => ({
    slug: a.slug,
    name: appName(a, "en"),
    latestTag: statsMap[a.slug]?.latestTag ?? null,
    releasedAt: statsMap[a.slug]?.releasedAt ?? null,
    notes: notesBySlug.get(a.slug) ?? null,
  }));

  return (
    <EnDocument>
      <main className="container page narrow en-page" lang="en" dir="ltr">
        <EnTopbar arHref="/account" />
        <div className="page-intro">
          <div className="eyebrow">Your personal space</div>
          <h1>My account</h1>
          <p>
            One hub to follow your favorite apps and their release notifications — no sign-up, and all of your
            data stays on your device only.
          </p>
        </div>
        <FavoritesSection lang="en" />
        <ReleaseAlerts apps={watchApps} lang="en" />
        <NotifyLog lang="en" />
        <section className="panel account-card">
          <span className="account-avatar"><UserRound size={30} aria-hidden /></span>
          <h2>The accounts portal is in the works</h2>
          <p>
            We&apos;re currently building a secure accounts system that lets you follow your favorite apps and
            their update history. Don&apos;t share your data with anyone in the platform&apos;s name before the
            launch is officially announced from this page.
          </p>
          <ul className="account-points">
            <li><ShieldCheck size={15} aria-hidden /> The accounts portal will be built on strict privacy standards.</li>
            <li><Sparkles size={15} aria-hidden /> Favorites and notification syncing once the releases are available.</li>
          </ul>
          <div className="blog-links">
            <a className="btn-grad sm" href="https://github.com/CTO-DRS" target="_blank" rel="noreferrer">
              <Github size={15} aria-hidden /> Follow development on GitHub
            </a>
            <Link className="btn-dark sm" href="/en/support">
              <Mail size={15} aria-hidden /> Contact support
            </Link>
          </div>
          <p className="account-cta-note">For direct inquiries: <a href={`mailto:${cto.email}`}>{cto.email}</a></p>
        </section>
        <EnFooterNote />
      </main>
    </EnDocument>
  );
}
