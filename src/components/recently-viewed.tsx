"use client";

import Link from "next/link";
import { History } from "lucide-react";
import { apps, appSummary, categoryLabel, statusLabels } from "@/lib/catalog";
import { useRecentlyViewed, useFavorites } from "@/lib/favorites";
import { FavoriteButton } from "@/components/favorite-button";
import { AppGlyph } from "@/components/app-glyph";

/** شريط «شوهد مؤخرًا» في الرئيسية — يظهر فقط بعد زيارة صفحة تطبيق واحد على الأقل */
export function RecentlyViewed() {
  const { recent, ready } = useRecentlyViewed();
  const { favorites } = useFavorites();
  if (!ready || recent.length === 0) return null;

  const items = recent
    .map(slug => apps.find(a => a.slug === slug))
    .filter((a): a is (typeof apps)[number] => Boolean(a));

  if (items.length === 0) return null;

  return (
    <section className="container" aria-labelledby="recent-title">
      <div className="home-blog-head">
        <h2 id="recent-title"><History size={19} aria-hidden className="recent-ico" /> شاهدت مؤخرًا</h2>
        {favorites.length > 0 && (
          <Link className="text-link" href="/apps?fav=1">كل المفضلة ({favorites.length}) ←</Link>
        )}
      </div>
      <div className="recent-row" role="list">
        {items.map(app => (
          <article className="recent-card" role="listitem" key={app.slug}>
            <FavoriteButton slug={app.slug} name={app.name.ar} />
            <Link href={`/apps/${app.slug}`} className="recent-link" aria-label={`فتح صفحة ${app.name.ar}`}>
              <span className={`store-icon sm tint-${app.tint || "nexus"}`}><AppGlyph appIcon={app.appIcon} letter={app.name.en.slice(0, 1)} /></span>
              <b className="recent-name">{app.name.ar}</b>
              <span className="recent-cat">{categoryLabel(app.category)} · {statusLabels[app.status]}</span>
              <p className="recent-desc">{appSummary(app).slice(0, 64)}…</p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
