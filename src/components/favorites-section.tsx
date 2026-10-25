"use client";

import Link from "next/link";
import { Heart, FolderOpen, ArrowLeft, ArrowRight } from "lucide-react";
import { apps, appSummary, categoryLabel, categoryLabelEn, statusLabels } from "@/lib/catalog";
import { useFavorites } from "@/lib/favorites";
import { FavoriteButton } from "@/components/favorite-button";
import { AppGlyph } from "@/components/app-glyph";

const T = {
  ar: {
    title: "تطبيقاتي المفضلة",
    sub: "محفوظة على جهازك فقط — لا تُرسل لأي خادم وتنتظر حتى الإطلاق لمزامنتها عبر أجهزتك.",
    loading: "جارٍ تحميل المفضلة…",
    emptyTitle: "لم تختر أي تطبيق مفضلاً بعد",
    emptyBody: "اضغط أيقونة القلب ♥ على أي بطاقة تطبيق لتجمعها هنا وتصل إليها بسرعة في كل زيارة.",
    browse: "تصفح الكتالوق",
    inCatalog: "عرضها في الكتالوق مع الفلاتر",
    arrow: "←",
  },
  en: {
    title: "My favorite apps",
    sub: "Saved on your device only — never sent to any server, and ready to sync across devices once we launch it.",
    loading: "Loading favorites…",
    emptyTitle: "You haven't picked any favorite app yet",
    emptyBody: "Tap the heart ♥ icon on any app card to collect it here and reach it quickly on every visit.",
    browse: "Browse the catalog",
    inCatalog: "Open them in the catalog with filters",
    arrow: "→",
  },
} as const;

const STATUS_EN: Record<string, string> = {
  released: "Available",
  "in-development": "In development",
  archived: "Archived",
};

/** قائمة تطبيقات المفضلة في صفحة الحساب — محفوظة محليًا على جهاز المستخدم */
export function FavoritesSection({ lang = "ar" }: { lang?: "ar" | "en" }) {
  const t = T[lang];
  const { favorites, ready } = useFavorites();
  const items = favorites
    .map(slug => apps.find(a => a.slug === slug))
    .filter((a): a is (typeof apps)[number] => Boolean(a));
  const backArrow = lang === "en" ? <ArrowRight size={15} aria-hidden /> : <ArrowLeft size={15} aria-hidden />;

  return (
    <section className="panel account-card" id="favorites" aria-labelledby="fav-title">
      <div className="fav-head">
        <span className="account-avatar heart"><Heart size={24} aria-hidden /></span>
        <div>
          <h2 id="fav-title">{t.title}</h2>
          <p className="muted">{t.sub}</p>
        </div>
      </div>

      {!ready ? (
        <p className="muted">{t.loading}</p>
      ) : items.length === 0 ? (
        <div className="fav-empty">
          <b>{t.emptyTitle}</b>
          <p>{t.emptyBody}</p>
          <Link className="btn-grad sm" href={lang === "en" ? "/en/apps" : "/apps"}>
            {t.browse} {backArrow}
          </Link>
        </div>
      ) : (
        <>
          <div className="fav-grid">
            {items.map(app => (
              <article className="fav-item" key={app.slug}>
                <FavoriteButton slug={app.slug} name={app.name[lang]} />
                <Link href={`/apps/${app.slug}`} className="fav-item-link">
                  <span className={`store-icon sm tint-${app.tint || "nexus"}`}><AppGlyph appIcon={app.appIcon} letter={app.name.en.slice(0, 1)} /></span>
                  <b className="fav-name">{app.name[lang]}</b>
                  <span className="fav-meta">
                    <FolderOpen size={12} aria-hidden />
                    {" "}
                    {lang === "en" ? categoryLabelEn(app.category) : categoryLabel(app.category)}
                    {" · "}
                    {lang === "en" ? STATUS_EN[app.status] : statusLabels[app.status]}
                  </span>
                  <p className="fav-desc">{appSummary(app, lang)}</p>
                </Link>
              </article>
            ))}
          </div>
          <Link className="text-link" href={lang === "en" ? "/en/apps?fav=1" : "/apps?fav=1"}>
            {t.inCatalog} {t.arrow}
          </Link>
        </>
      )}
    </section>
  );
}
