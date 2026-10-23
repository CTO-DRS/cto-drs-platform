"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, SlidersHorizontal, FolderOpen, Github } from "lucide-react";
import type { AppEntry } from "@/lib/catalog";
import { categoryLabel, filterByCategory, filterByStatus, searchApps, statusLabels, validHttpUrl } from "@/lib/catalog";

type Props = {
  apps: AppEntry[];
  initialQuery?: string;
  initialCategory?: string;
  initialStatus?: string;
};

const STATUSES: AppEntry["status"][] = ["released", "in-development", "archived"];

export function CatalogExplorer({ apps, initialQuery = "", initialCategory = "all", initialStatus = "all" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState(initialStatus);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const app of apps) map.set(app.category, (map.get(app.category) || 0) + 1);
    return Array.from(map.entries()).map(([id, count]) => ({ id, label: categoryLabel(id), count }));
  }, [apps]);

  const results = useMemo(
    () => filterByStatus(filterByCategory(searchApps(apps, query), category), status),
    [apps, query, category, status]
  );

  const hasFilters = query !== "" || category !== "all" || status !== "all";

  function reset() {
    setQuery("");
    setCategory("all");
    setStatus("all");
    window.history.replaceState(null, "", "/apps");
  }

  function update(next: { query?: string; category?: string; status?: string }) {
    const params = new URLSearchParams();
    const q = next.query ?? query;
    const c = next.category ?? category;
    const s = next.status ?? status;
    if (q) params.set("q", q);
    if (c && c !== "all") params.set("cat", c);
    if (s && s !== "all") params.set("status", s);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/apps?${qs}` : "/apps");
  }

  return (
    <div className="catalog-tools">
      <div className="search-bar" role="search">
        <Search size={18} className="search-icon" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={e => { setQuery(e.target.value); update({ query: e.target.value }); }}
          placeholder="ابحث بالاسم أو الوصف أو الفئة…"
          aria-label="البحث في التطبيقات"
        />
        {query && (
          <button type="button" className="clear-btn" onClick={() => { setQuery(""); update({ query: "" }); }} aria-label="مسح البحث">
            <X size={15} />
          </button>
        )}
      </div>

      <div className="filters-row">
        <div className="chips" role="group" aria-label="تصفية حسب الفئة">
          <span className="chips-label"><SlidersHorizontal size={14} aria-hidden /> الفئة:</span>
          <button type="button" className={`chip ${category === "all" ? "active" : ""}`} onClick={() => { setCategory("all"); update({ category: "all" }); }}>الكل</button>
          {categories.map(cat => (
            <button
              type="button"
              key={cat.id}
              className={`chip ${category === cat.id ? "active" : ""}`}
              onClick={() => { const next = category === cat.id ? "all" : cat.id; setCategory(next); update({ category: next }); }}
            >
              {cat.label} <small>{cat.count}</small>
            </button>
          ))}
        </div>

        <div className="chips" role="group" aria-label="تصفية حسب الحالة">
          <span className="chips-label">الحالة:</span>
          <button type="button" className={`chip ${status === "all" ? "active" : ""}`} onClick={() => { setStatus("all"); update({ status: "all" }); }}>الكل</button>
          {STATUSES.map(s => (
            <button
              type="button"
              key={s}
              className={`chip ${status === s ? "active" : ""}`}
              onClick={() => { const next = status === s ? "all" : s; setStatus(next); update({ status: next }); }}
            >
              {statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="results-meta" aria-live="polite">
        <span>عرض <b>{results.length}</b> من أصل {apps.length} مشروع</span>
        {hasFilters && <button type="button" className="text-link" onClick={reset}>إعادة ضبط التصفية <X size={14} aria-hidden /></button>}
      </div>

      {results.length > 0 ? (
        <div className="app-grid">
          {results.map(app => (
            <article className="app-card" key={app.slug}>
              <div className="app-icon">{app.name.en.slice(0, 1)}</div>
              <div className="app-card-body">
                <div className="app-title-row">
                  <h3>{app.name.ar}</h3>
                  <span className={`status ${app.status}`}>{statusLabels[app.status]}</span>
                </div>
                <p>{app.summary.ar}</p>
                <div className="app-card-bottom">
                  <span className="cat-tag"><FolderOpen size={13} aria-hidden /> {categoryLabel(app.category)}</span>
                  {validHttpUrl(app.repository) && (
                    <a className="mini-gh" href={app.repository!} target="_blank" rel="noreferrer" title="الكود المصدري على GitHub">
                      <Github size={13} aria-hidden /> GitHub
                    </a>
                  )}
                  <Link href={`/apps/${app.slug}`}>عرض التفاصيل ←</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={34} aria-hidden />
          <b>لا توجد نتائج مطابقة</b>
          <p>جرّب كلمات بحث مختلفة أو أعد ضبط عوامل التصفية.</p>
          {hasFilters && <button type="button" className="button primary" onClick={reset}>إعادة ضبط التصفية</button>}
        </div>
      )}
    </div>
  );
}
