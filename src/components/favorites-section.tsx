"use client";

import Link from "next/link";
import { Heart, FolderOpen, ArrowLeft } from "lucide-react";
import { apps, appSummary, categoryLabel, statusLabels } from "@/lib/catalog";
import { useFavorites } from "@/lib/favorites";
import { FavoriteButton } from "@/components/favorite-button";

/** قائمة تطبيقات المفضلة في صفحة الحساب — محفوظة محليًا على جهاز المستخدم */
export function FavoritesSection() {
  const { favorites, ready } = useFavorites();
  const items = favorites
    .map(slug => apps.find(a => a.slug === slug))
    .filter((a): a is (typeof apps)[number] => Boolean(a));

  return (
    <section className="panel account-card" id="favorites" aria-labelledby="fav-title">
      <div className="fav-head">
        <span className="account-avatar heart"><Heart size={24} aria-hidden /></span>
        <div>
          <h2 id="fav-title">تطبيقاتي المفضلة</h2>
          <p className="muted">محفوظة على جهازك فقط — لا تُرسل لأي خادم وتنتظر حتى الإطلاق لمزامنتها عبر أجهزتك.</p>
        </div>
      </div>

      {!ready ? (
        <p className="muted">جارٍ تحميل المفضلة…</p>
      ) : items.length === 0 ? (
        <div className="fav-empty">
          <b>لم تختر أي تطبيق مفضلاً بعد</b>
          <p>اضغط أيقونة القلب ♥ على أي بطاقة تطبيق لتجمعها هنا وتصل إليها بسرعة في كل زيارة.</p>
          <Link className="btn-grad sm" href="/apps">تصفح الكتالوج <ArrowLeft size={15} aria-hidden /></Link>
        </div>
      ) : (
        <>
          <div className="fav-grid">
            {items.map(app => (
              <article className="fav-item" key={app.slug}>
                <FavoriteButton slug={app.slug} name={app.name.ar} />
                <Link href={`/apps/${app.slug}`} className="fav-item-link">
                  <span className={`store-icon sm tint-${app.tint || "nexus"}`}><b>{app.name.en.slice(0, 1)}</b></span>
                  <b className="fav-name">{app.name.ar}</b>
                  <span className="fav-meta"><FolderOpen size={12} aria-hidden /> {categoryLabel(app.category)} · {statusLabels[app.status]}</span>
                  <p className="fav-desc">{appSummary(app)}</p>
                </Link>
              </article>
            ))}
          </div>
          <Link className="text-link" href="/apps?fav=1">عرضها في الكتالوج مع الفلاتر ←</Link>
        </>
      )}
    </section>
  );
}
