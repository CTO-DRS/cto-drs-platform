"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, SlidersHorizontal, FolderOpen, Github, ArrowUpDown, Heart, LayoutGrid, Rows3 } from "lucide-react";
import type { AppEntry } from "@/lib/catalog";
import { categoryLabel, filterByCategory, filterByStatus, searchApps, statusLabels, validHttpUrl } from "@/lib/catalog";
import { useFavorites } from "@/lib/favorites";
import { FavoriteButton } from "@/components/favorite-button";

type Props = {
  apps: AppEntry[];
  initialQuery?: string;
  initialCategory?: string;
  initialStatus?: string;
  initialSort?: string;
  initialFavOnly?: boolean;
};

const STATUSES: AppEntry["status"][] = ["released", "in-development", "archived"];

const SORTS = [
  { id: "default", label: "الافتراضي" },
  { id: "newest", label: "الأحدث إصدارًا" },
  { id: "name", label: "الاسم (أ – ي)" },
  { id: "status", label: "المتاح أولًا" },
] as const;

export function CatalogExplorer({ apps, initialQuery = "", initialCategory = "all", initialStatus = "all", initialSort = "default", initialFavOnly = false }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState(initialStatus);
  const [sort, setSort] = useState(initialSort);
  const [favOnly, setFavOnly] = useState(initialFavOnly);
  const [view, setView] = useState<"grid" | "list">("grid");
  const { favorites, ready } = useFavorites();

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const app of apps) map.set(app.category, (map.get(app.category) || 0) + 1);
    return Array.from(map.entries()).map(([id, count]) => ({ id, label: categoryLabel(id), count }));
  }, [apps]);

  const results = useMemo(() => {
    let list = filterByStatus(filterByCategory(searchApps(apps, query), category), status);
    if (favOnly) list = list.filter(app => favorites.includes(app.slug));
    const sorted = [...list];
    switch (sort) {
      case "newest":
        sorted.sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? ""));
        break;
      case "name":
        sorted.sort((a, b) => a.name.ar.localeCompare(b.name.ar, "ar"));
        break;
      case "status":
        sorted.sort((a, b) => {
          const rank: Record<AppEntry["status"], number> = { released: 0, "in-development": 1, archived: 2 };
          return rank[a.status] - rank[b.status];
        });
        break;
    }
    return sorted;
  }, [apps, query, category, status, sort, favOnly, favorites]);

  const hasFilters = query !== "" || category !== "all" || status !== "all" || sort !== "default" || favOnly;

  function reset() {
    setQuery("");
    setCategory("all");
    setStatus("all");
    setSort("default");
    setFavOnly(false);
    window.history.replaceState(null, "", "/apps");
  }

  function update(next: { query?: string; category?: string; status?: string; sort?: string; favOnly?: boolean }) {
    const params = new URLSearchParams();
    const q = next.query ?? query;
    const c = next.category ?? category;
    const s = next.status ?? status;
    const so = next.sort ?? sort;
    const f = next.favOnly ?? favOnly;
    if (q) params.set("q", q);
    if (c && c !== "all") params.set("cat", c);
    if (s && s !== "all") params.set("status", s);
    if (so && so !== "default") params.set("sort", so);
    if (f) params.set("fav", "1");
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
        <span className="search-hint" aria-hidden>اضغط <kbd className="nav-kbd">Ctrl K</kbd> للبحث الشامل</span>
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
          {ready && (
            <button
              type="button"
              className={`chip fav-chip ${favOnly ? "active" : ""}`}
              aria-pressed={favOnly}
              onClick={() => { const next = !favOnly; setFavOnly(next); update({ favOnly: next }); }}
              title="عرض تطبيقاتك المفضلة المحفوظة على جهازك"
            >
              <Heart size={12} aria-hidden className={favOnly ? "filled" : ""} /> المفضلة <small>{favorites.length}</small>
            </button>
          )}
        </div>
      </div>

      <div className="results-meta">
        <span aria-live="polite">عرض <b>{results.length}</b> من أصل {apps.length} مشروع</span>
        <div className="results-controls">
          <label className="sort-wrap">
            <ArrowUpDown size={13} aria-hidden />
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); update({ sort: e.target.value }); }}
              aria-label="ترتيب النتائج"
            >
              {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
          <div className="view-toggle" role="group" aria-label="طريقة العرض">
            <button type="button" className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-pressed={view === "grid"} title="عرض شبكي">
              <LayoutGrid size={14} aria-hidden />
            </button>
            <button type="button" className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-pressed={view === "list"} title="عرض قائمة">
              <Rows3 size={14} aria-hidden />
            </button>
          </div>
          {hasFilters && <button type="button" className="text-link" onClick={reset}>إعادة الضبط <X size={14} aria-hidden /></button>}
        </div>
      </div>

      {results.length > 0 ? (
        <div className={`app-grid ${view === "list" ? "as-list" : ""}`}>
          {results.map(app => (
            <article className="app-card" key={app.slug}>
              <FavoriteButton slug={app.slug} name={app.name.ar} />
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
          {favOnly ? <Heart size={34} aria-hidden /> : <Search size={34} aria-hidden />}
          <b>{favOnly ? "قائمة المفضلة فارغة" : "لا توجد نتائج مطابقة"}</b>
          <p>
            {favOnly
              ? "اضغط أيقونة القلب ♥ على أي بطاقة تطبيق لتجمعها هنا."
              : "جرّب كلمات بحث مختلفة أو أعد ضبط عوامل التصفية."}
          </p>
          {hasFilters && <button type="button" className="button primary" onClick={reset}>إعادة ضبط التصفية</button>}
        </div>
      )}
    </div>
  );
}
