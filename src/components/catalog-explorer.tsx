"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, SlidersHorizontal, FolderOpen, Github, ArrowUpDown, Heart, LayoutGrid, Rows3, Star, Download, Sparkles, Dices, History } from "lucide-react";
import type { AppEntry } from "@/lib/catalog";
import { categoryLabel, categoryLabelEn, filterByCategory, filterByStatus, searchApps, statusLabels, validHttpUrl } from "@/lib/catalog";
import type { CatalogStatsMap } from "@/lib/github";
import { compactNumber, isFreshRelease } from "@/lib/github";
import { useFavorites } from "@/lib/favorites";
import { FavoriteButton } from "@/components/favorite-button";
import { AppGlyph } from "@/components/app-glyph";

type Props = {
  apps: AppEntry[];
  initialQuery?: string;
  initialCategory?: string;
  initialStatus?: string;
  initialSort?: string;
  initialFavOnly?: boolean;
  statsMap?: CatalogStatsMap;
  lang?: "ar" | "en";
};

const STATUSES: AppEntry["status"][] = ["released", "in-development", "archived"];

const RECENT_KEY = "drs:recent-searches";

/* آخر عمليات البحث (محليًا): تُحفظ عند الضغط على Enter وتظهر كوسوم سريعة */
function readRecent(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((item): item is string => typeof item === "string").slice(0, 5) : [];
  } catch { return []; }
}

function writeRecent(list: string[]) {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 5))); } catch {}
}

const SORTS = {
  ar: [
    { id: "default", label: "الافتراضي" },
    { id: "newest", label: "الأحدث إصدارًا" },
    { id: "downloads", label: "الأكثر تحميلًا" },
    { id: "name", label: "الاسم (أ – ي)" },
    { id: "status", label: "المتاح أولًا" },
  ],
  en: [
    { id: "default", label: "Default" },
    { id: "newest", label: "Newest release" },
    { id: "downloads", label: "Most downloaded" },
    { id: "name", label: "Name (A – Z)" },
    { id: "status", label: "Available first" },
  ],
} as const;

const L = {
  ar: {
    searchPh: "ابحث بالاسم أو الوصف أو الفئة…",
    searchAria: "البحث في التطبيقات",
    clearAria: "مسح البحث",
    searchHintPre: "اضغط ",
    searchHintPost: " للبحث الشامل",
    recentLabel: "آخر عمليات البحث:",
    recentAria: "آخر عمليات البحث",
    recentClear: "مسح سجل البحث",
    catAria: "تصفية حسب الفئة",
    catLabel: "الفئة:",
    all: "الكل",
    statusAria: "تصفية حسب الحالة",
    statusLabel: "الحالة:",
    favTitle: "عرض تطبيقاتك المفضلة المحفوظة على جهازك",
    fav: "المفضلة",
    showingPre: "عرض ",
    showingMid: " من أصل ",
    showingPost: " مشروع",
    sortAria: "ترتيب النتائج",
    viewAria: "طريقة العرض",
    viewGrid: "عرض شبكي",
    viewList: "عرض قائمة",
    lucky: "اكتشف",
    luckyTitle: "خذني إلى تطبيق عشوائي من الكتالوق",
    luckyAria: "اكتشف تطبيقًا عشوائيًا",
    reset: "إعادة الضبط",
    fresh: "جديد",
    freshTitle: "أحدث إصدار نُشر خلال الأسابيع الثلاثة الماضية",
    starsTitle: "عدد النجوم الحي من GitHub",
    dlTitle: "إجمالي التنزيلات من إصدارات GitHub الرسمية",
    ghTitle: "الكود المصدري على GitHub",
    details: "عرض التفاصيل",
    emptyFav: "قائمة المفضلة فارغة",
    emptyNo: "لا توجد نتائج مطابقة",
    emptyFavP: "اضغط أيقونة القلب ♥ على أي بطاقة تطبيق لتجمعها هنا.",
    emptyNoP: "جرّب كلمات بحث مختلفة أو أعد ضبط عوامل التصفية.",
    resetFilters: "إعادة ضبط التصفية",
  },
  en: {
    searchPh: "Search by name, description or category…",
    searchAria: "Search the apps",
    clearAria: "Clear search",
    searchHintPre: "Press ",
    searchHintPost: " for global search",
    recentLabel: "Recent searches:",
    recentAria: "Recent searches",
    recentClear: "Clear search history",
    catAria: "Filter by category",
    catLabel: "Category:",
    all: "All",
    statusAria: "Filter by status",
    statusLabel: "Status:",
    favTitle: "Show your favorites saved on this device",
    fav: "Favorites",
    showingPre: "Showing ",
    showingMid: " of ",
    showingPost: " projects",
    sortAria: "Sort results",
    viewAria: "View mode",
    viewGrid: "Grid view",
    viewList: "List view",
    lucky: "Discover",
    luckyTitle: "Take me to a random app from the catalog",
    luckyAria: "Discover a random app",
    reset: "Reset",
    fresh: "New",
    freshTitle: "Latest release published within the last three weeks",
    starsTitle: "Live GitHub star count",
    dlTitle: "Total downloads from official GitHub releases",
    ghTitle: "Source code on GitHub",
    details: "View details",
    emptyFav: "Your favorites list is empty",
    emptyNo: "No matching results",
    emptyFavP: "Tap the heart ♥ icon on any app card to collect it here.",
    emptyNoP: "Try different keywords or reset the filters.",
    resetFilters: "Reset filters",
  },
};

const STATUS_EN: Record<AppEntry["status"], string> = {
  released: "Available",
  "in-development": "In development",
  archived: "Archived",
};

export function CatalogExplorer({ apps, initialQuery = "", initialCategory = "all", initialStatus = "all", initialSort = "default", initialFavOnly = false, statsMap, lang = "ar" }: Props) {
  const t = L[lang];
  const sorts = SORTS[lang];
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState(initialStatus);
  const [sort, setSort] = useState(initialSort);
  const [favOnly, setFavOnly] = useState(initialFavOnly);
  const [view, setView] = useState<"grid" | "list">("grid");
  const { favorites, ready } = useFavorites();
  const [recent, setRecent] = useState<string[]>([]);

  /* قراءة سجل البحث بعد التركيب (تفادي اختلاف الترطيب بين الخادم والمتصفح) */
  useEffect(() => { setRecent(readRecent()); }, []);

  function saveRecent(value: string) {
    const v = value.trim();
    if (v.length < 2) return;
    setRecent(prev => {
      const next = [v, ...prev.filter(item => item !== v)].slice(0, 5);
      writeRecent(next);
      return next;
    });
  }

  function clearRecent() {
    setRecent([]);
    try { localStorage.removeItem(RECENT_KEY); } catch {}
  }

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const app of apps) map.set(app.category, (map.get(app.category) || 0) + 1);
    return Array.from(map.entries()).map(([id, count]) => ({ id, label: lang === "en" ? categoryLabelEn(id) : categoryLabel(id), count }));
  }, [apps, lang]);

  const results = useMemo(() => {
    let list = filterByStatus(filterByCategory(searchApps(apps, query), category), status);
    if (favOnly) list = list.filter(app => favorites.includes(app.slug));
    const sorted = [...list];
    switch (sort) {
      case "newest":
        sorted.sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? ""));
        break;
      case "downloads":
        sorted.sort((a, b) => (statsMap?.[b.slug]?.downloads ?? 0) - (statsMap?.[a.slug]?.downloads ?? 0));
        break;
      case "name":
        sorted.sort((a, b) => a.name[lang].localeCompare(b.name[lang], lang));
        break;
      case "status":
        sorted.sort((a, b) => {
          const rank: Record<AppEntry["status"], number> = { released: 0, "in-development": 1, archived: 2 };
          return rank[a.status] - rank[b.status];
        });
        break;
    }
    return sorted;
  }, [apps, query, category, status, sort, favOnly, favorites, statsMap]);

  const hasFilters = query !== "" || category !== "all" || status !== "all" || sort !== "default" || favOnly;

  function reset() {
    setQuery("");
    setCategory("all");
    setStatus("all");
    setSort("default");
    setFavOnly(false);
    const base = lang === "en" ? "/en/apps" : "/apps";
    window.history.replaceState(null, "", base);
  }

  /* اكتشاف عشوائي: قفزة مباشرة إلى صفحة تطبيق عشوائي من الكتالوق */
  function luckyApp() {
    if (!apps.length) return;
    const pick = apps[Math.floor(Math.random() * apps.length)];
    router.push(`/apps/${pick.slug}`);
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
    const base = lang === "en" ? "/en/apps" : "/apps";
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `${base}?${qs}` : base);
  }

  return (
    <div className="catalog-tools">
      <div className="search-bar" role="search">
        <Search size={18} className="search-icon" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={e => { setQuery(e.target.value); update({ query: e.target.value }); }}
          onKeyDown={e => { if (e.key === "Enter") saveRecent(query); }}
          placeholder={t.searchPh}
          aria-label={t.searchAria}
        />
        {query && (
          <button type="button" className="clear-btn" onClick={() => { setQuery(""); update({ query: "" }); }} aria-label={t.clearAria}>
            <X size={15} />
          </button>
        )}
        <span className="search-hint" aria-hidden>{t.searchHintPre}<kbd className="nav-kbd">Ctrl K</kbd>{t.searchHintPost}</span>
      </div>

      {query === "" && recent.length > 0 && (
        <div className="recent-searches" role="group" aria-label={t.recentAria}>
          <span className="rs-label"><History size={13} aria-hidden /> {t.recentLabel}</span>
          {recent.map(item => (
            <button
              type="button"
              key={item}
              className="rs-chip"
              onClick={() => { setQuery(item); update({ query: item }); }}
            >
              {item}
            </button>
          ))}
          <button type="button" className="rs-clear" onClick={clearRecent} aria-label={t.recentClear} title={t.recentClear}>
            <X size={12} aria-hidden />
          </button>
        </div>
      )}

      <div className="filters-row">
        <div className="chips" role="group" aria-label={t.catAria}>
          <span className="chips-label"><SlidersHorizontal size={14} aria-hidden /> {t.catLabel}</span>
          <button type="button" className={`chip ${category === "all" ? "active" : ""}`} onClick={() => { setCategory("all"); update({ category: "all" }); }}>{t.all}</button>
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

        <div className="chips" role="group" aria-label={t.statusAria}>
          <span className="chips-label">{t.statusLabel}</span>
          <button type="button" className={`chip ${status === "all" ? "active" : ""}`} onClick={() => { setStatus("all"); update({ status: "all" }); }}>{t.all}</button>
          {STATUSES.map(s => (
            <button
              type="button"
              key={s}
              className={`chip ${status === s ? "active" : ""}`}
              onClick={() => { const next = status === s ? "all" : s; setStatus(next); update({ status: next }); }}
            >
              {lang === "en" ? STATUS_EN[s] : statusLabels[s]}
            </button>
          ))}
          {ready && (
            <button
              type="button"
              className={`chip fav-chip ${favOnly ? "active" : ""}`}
              aria-pressed={favOnly}
              onClick={() => { const next = !favOnly; setFavOnly(next); update({ favOnly: next }); }}
              title={t.favTitle}
            >
              <Heart size={12} aria-hidden className={favOnly ? "filled" : ""} /> {t.fav} <small>{favorites.length}</small>
            </button>
          )}
        </div>
      </div>

      <div className="results-meta">
        <span aria-live="polite">{t.showingPre}<b>{results.length}</b>{t.showingMid}{apps.length}{t.showingPost}</span>
        <div className="results-controls">
          <label className="sort-wrap">
            <ArrowUpDown size={13} aria-hidden />
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); update({ sort: e.target.value }); }}
              aria-label={t.sortAria}
            >
              {sorts.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
          <div className="view-toggle" role="group" aria-label={t.viewAria}>
            <button type="button" className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-pressed={view === "grid"} title={t.viewGrid}>
              <LayoutGrid size={14} aria-hidden />
            </button>
            <button type="button" className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-pressed={view === "list"} title={t.viewList}>
              <Rows3 size={14} aria-hidden />
            </button>
          </div>
          <button type="button" className="lucky-btn" onClick={luckyApp} title={t.luckyTitle} aria-label={t.luckyAria}>
            <Dices size={14} aria-hidden /> {t.lucky}
          </button>
          {hasFilters && <button type="button" className="text-link" onClick={reset}>{t.reset} <X size={14} aria-hidden /></button>}
        </div>
      </div>

      {results.length > 0 ? (
        <div className={`app-grid ${view === "list" ? "as-list" : ""}`}>
          {results.map(app => (
            <article className="app-card" key={app.slug}>
              <FavoriteButton slug={app.slug} name={app.name[lang]} />
              <div className="app-icon"><AppGlyph appIcon={app.appIcon} letter={app.name.en.slice(0, 1)} /></div>
              <div className="app-card-body">
                <div className="app-title-row">
                  <h3>
                    {app.name[lang]}
                    {statsMap?.[app.slug] && isFreshRelease(statsMap[app.slug].releasedAt) && (
                      <span className="tag new-badge" title={t.freshTitle}>
                        <Sparkles size={11} aria-hidden /> {t.fresh}
                      </span>
                    )}
                  </h3>
                  <span className={`status ${app.status}`}>{lang === "en" ? STATUS_EN[app.status] : statusLabels[app.status]}</span>
                </div>
                <p>{app.summary[lang] || app.summary.en}</p>
                <div className="app-card-bottom">
                  <span className="cat-tag"><FolderOpen size={13} aria-hidden /> {lang === "en" ? categoryLabelEn(app.category) : categoryLabel(app.category)}</span>
                  {statsMap?.[app.slug] && (
                    <span className="mini-live" title={t.starsTitle}>
                      <Star size={12} aria-hidden /> {compactNumber(statsMap[app.slug].stars)}
                    </span>
                  )}
                  {statsMap?.[app.slug] && statsMap[app.slug].downloads > 0 && (
                    <span className="mini-live hot" title={t.dlTitle}>
                      <Download size={12} aria-hidden /> {compactNumber(statsMap[app.slug].downloads)}
                    </span>
                  )}
                  {validHttpUrl(app.repository) && (
                    <a className="mini-gh" href={app.repository!} target="_blank" rel="noreferrer" title={t.ghTitle}>
                      <Github size={13} aria-hidden /> GitHub
                    </a>
                  )}
                  <Link href={`/apps/${app.slug}`}>{t.details} {lang === "en" ? "→" : "←"}</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          {favOnly ? <Heart size={34} aria-hidden /> : <Search size={34} aria-hidden />}
          <b>{favOnly ? t.emptyFav : t.emptyNo}</b>
          <p>
            {favOnly ? t.emptyFavP : t.emptyNoP}
          </p>
          {hasFilters && <button type="button" className="button primary" onClick={reset}>{t.resetFilters}</button>}
        </div>
      )}
    </div>
  );
}
