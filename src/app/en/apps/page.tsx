import type { Metadata } from "next";
import { Download, Braces } from "lucide-react";
import { apps } from "@/lib/catalog";
import { fetchCatalogRepoStats } from "@/lib/github";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { EnDocument } from "@/components/en-document";
import { EnTopbar, EnFooterNote } from "@/components/en-page-shell";

export const metadata: Metadata = {
  title: "Apps — CTO-DRS",
  description:
    "Browse the CTO-DRS app catalog with instant search and filtering by category and status — live GitHub stars and download counts on every card.",
  alternates: { languages: { ar: "/apps", en: "/en/apps" } },
};

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function EnglishAppsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = firstParam(params.q).slice(0, 80);
  const cat = firstParam(params.cat);
  const status = firstParam(params.status);
  const sort = firstParam(params.sort);
  const fav = firstParam(params.fav) === "1";
  const statsMap = await fetchCatalogRepoStats(apps);

  return (
    <EnDocument>
      <main className="container page en-page" lang="en" dir="ltr">
        <EnTopbar arHref="/apps" />
        <div className="page-intro">
          <div className="eyebrow">The official library</div>
          <h1>Apps</h1>
          <p>
            Read each app's description, check the project status, and open release links as soon as the
            developer publishes and verifies them. Every card shows live GitHub stars and real release downloads.
          </p>
          <div className="export-row" aria-label="Catalog data export">
            <span className="export-label"><Braces size={13} aria-hidden /> Data API:</span>
            <a className="export-link" href="/api/apps?format=csv" download="drs-apps.csv">
              <Download size={13} aria-hidden /> Export CSV
            </a>
            <a className="export-link" href="/api/apps" target="_blank" rel="noreferrer">
              <Braces size={13} aria-hidden /> JSON
            </a>
          </div>
        </div>
        <div className="notice">
          <b>Important:</b> the “In development” status means the project page doesn't confirm a public download
          yet. Download buttons only appear once trusted official links are added.
        </div>
        <CatalogExplorer
          apps={apps}
          initialQuery={q}
          initialCategory={cat || "all"}
          initialStatus={status || "all"}
          initialSort={["default", "newest", "downloads", "name", "status"].includes(sort) ? sort : "default"}
          initialFavOnly={fav}
          statsMap={statsMap}
          lang="en"
        />
        <EnFooterNote />
      </main>
    </EnDocument>
  );
}
