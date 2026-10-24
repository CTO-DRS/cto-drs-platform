import Link from "next/link";
import { Download, Github, Star, Sparkles, BadgeCheck } from "lucide-react";
import type { AppEntry } from "@/lib/catalog";
import { appSummary, categoryLabel, firstDownload, platformLabel, validHttpUrl } from "@/lib/catalog";
import type { CardLive } from "@/lib/github";
import { compactNumber, formatDateAr, isFreshRelease } from "@/lib/github";
import { FavoriteButton } from "@/components/favorite-button";
import { AppGlyph } from "@/components/app-glyph";

export function AppStoreCard({ app, live }: { app: AppEntry; live?: CardLive }) {
  const link = firstDownload(app);

  return (
    <article className="store-card">
      <FavoriteButton slug={app.slug} name={app.name.ar} />
      <div className="store-card-head">
        <span className={`store-icon tint-${app.tint || "nexus"}`}>
          <AppGlyph appIcon={app.appIcon} letter={app.icon.startsWith("letter-") ? app.icon.replace("letter-", "") : app.name.en.slice(0, 1)} />
        </span>
        <div className="store-card-title">
          <h3>
            {app.name.ar}
            {isFreshRelease(live?.releasedAt) && (
              <span className="tag new-badge" title="أحدث إصدار نُشر خلال الأسابيع الثلاثة الماضية">
                <Sparkles size={11} aria-hidden /> جديد
              </span>
            )}
          </h3>
          <span>{categoryLabel(app.category)}</span>
        </div>
      </div>
      <p className="store-card-desc">{appSummary(app)}</p>
      <div className="store-tags">
        {app.platforms.map(p => (
          <span className="tag outline" key={p}>{platformLabel(p)}</span>
        ))}
        <span className="tag fill">{app.pricing === "paid" ? "مدفوع" : "مجاني"}</span>
        {app.verified && (
          <span className="tag verified" title="بيانات هذا التطبيق موثقة من مستودع GitHub الرسمي">
            <BadgeCheck size={12} aria-hidden /> موثّق
          </span>
        )}
        {validHttpUrl(app.repository) && (
          <a className="tag gh" href={app.repository!} target="_blank" rel="noreferrer" title="الكود المصدري على GitHub">
            <Github size={12} aria-hidden /> مفتوح المصدر
          </a>
        )}
        {live && (
          <span className="tag live" title={live.pushedAt ? `آخر تطوير: ${formatDateAr(live.pushedAt)}` : "إحصاءات حية من GitHub"}>
            <Star size={12} aria-hidden /> {compactNumber(live.stars)}
          </span>
        )}
        {live && live.downloads > 0 && (
          <span className="tag dl-count" title="إجمالي التنزيلات من إصدارات GitHub الرسمية">
            <Download size={12} aria-hidden /> {compactNumber(live.downloads)} تحميل
          </span>
        )}
        {live?.latestTag && (
          <span className="tag ver" dir="ltr" title="أحدث إصدار منشور على GitHub">
            {live.latestTag}
          </span>
        )}
      </div>
      {link ? (
        <a className="store-download" href={link.url} target="_blank" rel="noreferrer">
          <Download size={15} aria-hidden /> تحميل الآن
        </a>
      ) : (
        <Link className="store-download soon" href={`/apps/${app.slug}`} title="التطبيق قيد التطوير — افتح الصفحة لمتابعة الإصدار">
          <Download size={15} aria-hidden /> تحميل الآن
        </Link>
      )}
      <Link className="store-details" href={`/apps/${app.slug}`}>
        عرض التفاصيل <span aria-hidden>←</span>
      </Link>
    </article>
  );
}

export function DownloadIconHint() {
  return <Download size={14} aria-hidden />;
}
