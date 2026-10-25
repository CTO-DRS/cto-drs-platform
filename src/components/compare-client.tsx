"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, ExternalLink, Github, Plus, Share2, Sparkles, X } from "lucide-react";
import { apps, categoryLabel, categoryLabelEn, platformLabel, firstDownload, validHttpUrl, type AppEntry } from "@/lib/catalog";
import { buildCompareImage, shareOrDownloadImage, type CompareImageEntry } from "@/lib/compare-image";
import { toast } from "@/lib/toast";
import { AppGlyph } from "@/components/app-glyph";
import { FavoriteButton } from "@/components/favorite-button";

export type CompareLive = {
  latestTag: string | null;
  releasedAt: string | null;
  downloads: number;
  stars: number;
  pushedAt: string | null;
};

type Slot = string | null;

const STATUS_EN: Record<AppEntry["status"], string> = {
  released: "Available",
  "in-development": "In development",
  archived: "Archived",
};

const LABELS = {
  ar: {
    feature: "المواصفة",
    desc: "اختر تطبيقين أو ثلاثة من كتالوق DRS لتقارن حالتها وفئتها وأحدث إصداراتها الحية ونجوم GitHub في جدول واحد — البيانات حقيقية ومباشرة.",
    pick: "اختر تطبيقًا…",
    addThird: "إضافة تطبيق ثالث",
    remove: "إزالة هذا العمود",
    pickHint: "اختر تطبيقًا من القائمة أعلاه لتظهر بياناته هنا.",
    status: "الحالة",
    category: "الفئة",
    platforms: "المنصات",
    version: "إصدار الكتالوق",
    latest: "أحدث إصدار حي",
    downloads: "تنزيلات الإصدارات",
    stars: "نجوم GitHub",
    pushed: "آخر تطوير",
    summary: "نبذة",
    actions: "روابط",
    notSet: "لم يُحدد بعد",
    noReleases: "لا إصدارات منشورة",
    noRepo: "غير مربوط بمستودع",
    fresh: "جديد",
    best: "الأحدث هنا",
    dl: "تحميل",
    repo: "المستودع",
    page: "صفحة التطبيق",
    dlUnit: "تحميل",
    starUnit: "نجمة",
    share: "مشاركة كصورة",
    shareBusy: "جارٍ توليد الصورة…",
    sharedToast: "أُرسلت صورة المقارنة إلى نافذة المشاركة",
    savedToast: "حُفظت صورة المقارنة في تنزيلاتك",
    failToast: "تعذر توليد الصورة — جرّب متصفحًا حديثًا",
    shareTitle: "مقارنة تطبيقات DRS",
    shareText: "مقارنة جنبًا إلى جنب من متجر DRS",
    locale: "ar" as const,
  },
  en: {
    feature: "Feature",
    desc: "Pick two or three apps from the DRS catalog and compare their status, category, latest live releases and GitHub stars in one table — real, live data only.",
    pick: "Choose an app…",
    addThird: "Add a third app",
    remove: "Remove this column",
    pickHint: "Pick an app from the dropdown above to see its data here.",
    status: "Status",
    category: "Category",
    platforms: "Platforms",
    version: "Catalog version",
    latest: "Latest live release",
    downloads: "Release downloads",
    stars: "GitHub stars",
    pushed: "Last activity",
    summary: "Summary",
    actions: "Links",
    notSet: "Not set yet",
    noReleases: "No published releases",
    noRepo: "No linked repository",
    fresh: "New",
    best: "Newest here",
    dl: "Download",
    repo: "Repository",
    page: "App page",
    dlUnit: "downloads",
    starUnit: "stars",
    share: "Share as image",
    shareBusy: "Rendering image…",
    sharedToast: "The comparison image was sent to the share sheet",
    savedToast: "The comparison image was saved to your downloads",
    failToast: "Couldn't render the image — try a modern browser",
    shareTitle: "DRS apps comparison",
    shareText: "Side-by-side comparison from the DRS store",
    locale: "en" as const,
  },
};

function fmtDate(iso: string | null, locale: "ar" | "en"): string | null {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }).format(new Date(iso));
  } catch {
    return null;
  }
}

function isFresh(iso: string | null): boolean {
  if (!iso) return false;
  const t = Date.parse(iso);
  return Number.isFinite(t) && Date.now() - t < 21 * 24 * 60 * 60 * 1000;
}

function fmtCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

/** مقارنة التطبيقات جنبًا إلى جنب: حتى 3 أعمدة مع روابط تعميقة (?a=&b=&c=) وبيانات حية من GitHub */
export function CompareClient({
  live,
  lang,
  initial,
}: {
  live: Record<string, CompareLive>;
  lang: "ar" | "en";
  initial: [Slot, Slot, Slot];
}) {
  const t = LABELS[lang];
  const router = useRouter();
  const [slots, setSlots] = useState<[Slot, Slot, Slot]>(initial);
  const [third, setThird] = useState(Boolean(initial[2]));
  const [shareBusy, setShareBusy] = useState(false);
  const firstRun = useRef(true);

  /* مزامنة الرابط مع الأعمدة المختارة (روابط قابلة للمشاركة) */
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const base = lang === "en" ? "/en/compare" : "/compare";
    const chosen = (third ? slots : slots.slice(0, 2)).filter((s): s is string => Boolean(s));
    const params = new URLSearchParams();
    chosen.forEach((s, i) => params.set(["a", "b", "c"][i], s));
    const qs = params.toString();
    router.replace(qs ? `${base}?${qs}` : base, { scroll: false });
  }, [slots, third, lang, router]);

  const bySlug = useMemo(() => new Map(apps.map(a => [a.slug, a])), []);
  const picked = slots.map(s => (s ? bySlug.get(s) ?? null : null));
  const filled = picked.filter(Boolean) as AppEntry[];
  const activeCount = third ? 3 : 2;

  function setSlot(index: number, slug: Slot) {
    setSlots(prev => {
      const next = [...prev] as [Slot, Slot, Slot];
      next[index] = slug || null;
      /* منع تكرار نفس التطبيق في عمودين: نزيله من الأعمدة الأخرى */
      for (let i = 0; i < next.length; i++) if (i !== index && slug && next[i] === slug) next[i] = null;
      return next;
    });
  }

  /* الكشف عن "الأفضل" في كل صف (فقط عند اكتمال عمودين على الأقل) */
  const best = useMemo(() => {
    const res: { latest: string | null; downloads: string | null; stars: string | null } = {
      latest: null,
      downloads: null,
      stars: null,
    };
    if (filled.length < 2) return res;
    const dates = filled.map(a => live[a.slug]?.releasedAt ?? "").filter(Boolean);
    if (dates.length >= 2) {
      const sorted = [...dates].sort();
      const maxDate = sorted[sorted.length - 1];
      const winner = filled.find(a => (live[a.slug]?.releasedAt ?? "") === maxDate);
      if (winner) res.latest = winner.slug;
    }
    const maxDl = Math.max(0, ...filled.map(a => live[a.slug]?.downloads ?? 0));
    if (maxDl > 0) res.downloads = filled.find(a => (live[a.slug]?.downloads ?? 0) === maxDl)?.slug ?? null;
    const maxStars = Math.max(0, ...filled.map(a => live[a.slug]?.stars ?? 0));
    if (maxStars > 0) res.stars = filled.find(a => (live[a.slug]?.stars ?? 0) === maxStars)?.slug ?? null;
    return res;
  }, [filled, live]);

  const cell = (app: AppEntry | null, content: React.ReactNode, isWin = false, key?: string) => (
    <td key={key} className={isWin ? "cmp-win" : undefined}>
      {app ? content : <span className="cmp-dash" aria-hidden>—</span>}
    </td>
  );

  const rows: { label: string; render: (a: AppEntry) => React.ReactNode; win?: string | null }[] = [
    {
      label: t.status,
      render: a => <span className={`status ${a.status}`}>{lang === "ar" ? { released: "متاح", "in-development": "قيد التطوير", archived: "مؤرشف" }[a.status] : STATUS_EN[a.status]}</span>,
    },
    {
      label: t.category,
      render: a => <span className="cat-tag">{lang === "ar" ? categoryLabel(a.category) : categoryLabelEn(a.category)}</span>,
    },
    {
      label: t.platforms,
      render: a => <span>{a.platforms.map(p => (lang === "ar" ? platformLabel(p) : p)).join(lang === "ar" ? "، " : ", ")}</span>,
    },
    {
      label: t.version,
      render: a => (a.version ? <code dir="ltr">{a.version}</code> : <span className="cmp-dash">{t.notSet}</span>),
    },
    {
      label: t.latest,
      win: best.latest,
      render: a => {
        const lv = live[a.slug];
        if (!lv) return <span className="cmp-dash">{t.noRepo}</span>;
        if (!lv.latestTag) return <span className="cmp-dash">{t.noReleases}</span>;
        return (
          <span className="cmp-live">
            <b dir="ltr">{lv.latestTag}</b>
            {lv.releasedAt && <span className="muted">{fmtDate(lv.releasedAt, t.locale)}</span>}
            {isFresh(lv.releasedAt) && <span className="tag new-badge"><Sparkles size={11} aria-hidden /> {t.fresh}</span>}
            {best.latest === a.slug && <span className="cmp-best">{t.best}</span>}
          </span>
        );
      },
    },
    {
      label: t.downloads,
      win: best.downloads,
      render: a => {
        const dl = live[a.slug]?.downloads ?? 0;
        return dl > 0 ? <b>{fmtCompact(dl)} {t.dlUnit}</b> : <span className="cmp-dash">—</span>;
      },
    },
    {
      label: t.stars,
      win: best.stars,
      render: a => {
        const st = live[a.slug]?.stars ?? 0;
        return <span className="cmp-stars"><Github size={13} aria-hidden /> {fmtCompact(st)} {t.starUnit}</span>;
      },
    },
    {
      label: t.pushed,
      render: a => {
        const d = fmtDate(live[a.slug]?.pushedAt ?? null, t.locale);
        return d ? <span>{d}</span> : <span className="cmp-dash">—</span>;
      },
    },
    {
      label: t.summary,
      render: a => <p className="cmp-summary">{a.summary[lang] || a.summary.en}</p>,
    },
    {
      label: t.actions,
      render: a => {
        const dl = firstDownload(a);
        return (
          <span className="cmp-actions">
            {dl && validHttpUrl(dl.url) && (
              <a className="button primary sm" href={dl.url} target="_blank" rel="noreferrer">
                <Download size={13} aria-hidden /> {t.dl} {(dl.label[lang] || dl.label.en).replace(/^تحميل\s*/, "").replace(/^Download\s*/i, "")}
              </a>
            )}
            {a.repository && validHttpUrl(a.repository) && (
              <a className="button secondary sm" href={a.repository} target="_blank" rel="noreferrer">
                <Github size={13} aria-hidden /> {t.repo} <ExternalLink size={11} aria-hidden />
              </a>
            )}
            <Link className="text-link" href={`/apps/${a.slug}`}>{t.page} ←</Link>
          </span>
        );
      },
    },
  ];

  /** مشاركة المقارنة كصورة: توليد PNG من الجدول الحالي ثم Web Share (أو تنزيل) */
  async function shareAsImage() {
    if (!filled.length || shareBusy) return;
    setShareBusy(true);
    try {
      const entries: CompareImageEntry[] = filled.map(a => {
        const lv = live[a.slug];
        const dl = lv?.downloads ?? 0;
        const st = lv?.stars ?? 0;
        return {
          name: lang === "ar" ? a.name.ar : a.name.en,
          iconPath: typeof a.appIcon === "string" ? a.appIcon : null,
          letter: a.name.en.slice(0, 1),
          status: lang === "ar"
            ? { released: "متاح", "in-development": "قيد التطوير", archived: "مؤرشف" }[a.status]
            : STATUS_EN[a.status],
          category: lang === "ar" ? categoryLabel(a.category) : categoryLabelEn(a.category),
          latest: lv ? (lv.latestTag ?? t.noReleases) : t.noRepo,
          latestDate: fmtDate(lv?.releasedAt ?? null, t.locale),
          downloads: dl > 0 ? `${fmtCompact(dl)} ${t.dlUnit}` : "—",
          stars: `${fmtCompact(st)} ${t.starUnit}`,
        };
      });
      const blob = await buildCompareImage(entries, {
        lang,
        url: typeof window !== "undefined" ? window.location.href : "cto-drs-store.vercel.app",
      });
      const result = await shareOrDownloadImage(blob, `drs-compare-${Date.now()}.png`, t.shareTitle, t.shareText);
      if (result === "shared") toast(t.sharedToast, "success");
      else if (result === "downloaded") toast(t.savedToast, "success");
      else toast(t.failToast, "error");
    } catch {
      toast(t.failToast, "error");
    } finally {
      setShareBusy(false);
    }
  }

  return (
    <div className="cmp-wrap">
      <p className="cmp-desc">{t.desc}</p>

      <div className="cmp-scroll" role="region" aria-label={lang === "ar" ? "جدول مقارنة التطبيقات" : "App comparison table"} tabIndex={0}>
        <table className="cmp-table">
          <caption className="sr-only">{t.desc}</caption>
          <thead>
            <tr>
              <th scope="col" className="cmp-rowlabel">{t.feature}</th>
              {Array.from({ length: activeCount }).map((_, i) => {
                const app = picked[i];
                return (
                  <th scope="col" key={i} className={app ? "" : "cmp-th-empty"}>
                    <div className="cmp-apphead">
                      {app && (
                        <span className="app-icon cmp-mini" aria-hidden>
                          <AppGlyph appIcon={app.appIcon} letter={app.name.en.slice(0, 1)} />
                        </span>
                      )}
                      <div className="cmp-apphead-body">
                        <label className="sr-only" htmlFor={`cmp-slot-${i}`}>{lang === "ar" ? `العمود ${i + 1}` : `Column ${i + 1}`}</label>
                        <select
                          id={`cmp-slot-${i}`}
                          className="cmp-select"
                          value={slots[i] ?? ""}
                          onChange={e => setSlot(i, e.target.value || null)}
                        >
                          <option value="">{t.pick}</option>
                          {apps.map(a => (
                            <option key={a.slug} value={a.slug}>{lang === "ar" ? a.name.ar : a.name.en}</option>
                          ))}
                        </select>
                        {app && (
                          <div className="cmp-apphead-name">
                            <b dir="auto">{lang === "ar" ? app.name.ar : app.name.en}</b>
                            <FavoriteButton slug={app.slug} name={lang === "ar" ? app.name.ar : app.name.en} />
                          </div>
                        )}
                      </div>
                      {app && (
                        <button
                          type="button"
                          className="cmp-remove"
                          onClick={() => setSlot(i, null)}
                          title={t.remove}
                          aria-label={t.remove}
                        >
                          <X size={13} aria-hidden />
                        </button>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.label}>
                <th scope="row" className="cmp-rowlabel">{row.label}</th>
                {Array.from({ length: activeCount }).map((_, i) => {
                  const app = picked[i];
                  if (!app) return cell(null, null, false, `${row.label}-${i}`);
                  return cell(app, row.render(app), row.win === app.slug, `${row.label}-${i}`);
                })}
              </tr>
            ))}
            {filled.length === 0 && (
              <tr className="cmp-hintrow">
                <td colSpan={activeCount + 1} className="cmp-hint">{t.pickHint}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!third && (
        <button type="button" className="cmp-add" onClick={() => setThird(true)}>
          <Plus size={14} aria-hidden /> {t.addThird}
        </button>
      )}

      {filled.length > 0 && (
        <button type="button" className="cmp-add cmp-share" onClick={shareAsImage} disabled={shareBusy}>
          <Share2 size={14} aria-hidden /> {shareBusy ? t.shareBusy : t.share}
        </button>
      )}
    </div>
  );
}
