"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, SlidersHorizontal } from "lucide-react";
import type { AppEntry } from "@/lib/catalog";
import { categoryLabel } from "@/lib/catalog";
import type { CatalogStatsMap } from "@/lib/github";
import { AppStoreCard } from "@/components/store-app-card";

export function HomeAppsSection({ apps, statsMap }: { apps: AppEntry[]; statsMap?: CatalogStatsMap }) {
  const [activeCat, setActiveCat] = useState("all");

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const app of apps) map.set(app.category, (map.get(app.category) || 0) + 1);
    return Array.from(map.keys());
  }, [apps]);

  const visible = useMemo(
    () => (activeCat === "all" ? apps : apps.filter(a => a.category === activeCat)),
    [apps, activeCat]
  );

  return (
    <div className="store-section">
      <div className="store-head">
        <div className="store-head-title">
          <LayoutGrid size={22} aria-hidden className="store-head-icon" />
          <div>
            <h2>تطبيقاتي</h2>
            <p>جميع التطبيقات التي تمت تطويرها</p>
          </div>
        </div>
        <SlidersHorizontal size={18} aria-hidden className="store-filter-hint" />
      </div>

      <div className="store-tabs" role="tablist" aria-label="تصفية التطبيقات حسب الفئة">
        <button
          type="button"
          role="tab"
          aria-selected={activeCat === "all"}
          className={`store-tab ${activeCat === "all" ? "active" : ""}`}
          onClick={() => setActiveCat("all")}
        >
          الكل
        </button>
        {categories.map(cat => (
          <button
            type="button"
            key={cat}
            role="tab"
            aria-selected={activeCat === cat}
            className={`store-tab ${activeCat === cat ? "active" : ""}`}
            onClick={() => setActiveCat(cat)}
          >
            {categoryLabel(cat)}
          </button>
        ))}
      </div>

      <div className="store-grid">
        {visible.map(app => (
          <AppStoreCard key={app.slug} app={app} live={statsMap?.[app.slug]} />
        ))}
      </div>

      {visible.length === 0 && (
        <div className="empty-state">
          <b>لا توجد تطبيقات في هذه الفئة بعد</b>
          <p>تُضاف المشاريع الجديدة هنا فور تسجيلها في الكتالوج الرسمي.</p>
        </div>
      )}
    </div>
  );
}
