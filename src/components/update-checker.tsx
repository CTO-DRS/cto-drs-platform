"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowUpCircle, HelpCircle, Download, Sparkles, SearchCheck } from "lucide-react";

export type CheckerApp = {
  slug: string;
  name: string;
  latestTag: string | null;
  releasedAt: string | null;
  apkUrl: string | null;
  /** ملاحظات أحدث إصدار — تمرَّر لتنبيهات الإصدارات، لا يستخدمها الفاحص نفسه */
  notes?: string | null;
};

type Verdict =
  | { kind: "update"; }
  | { kind: "latest"; }
  | { kind: "newer"; }
  | { kind: "unknown"; }
  | { kind: "invalid"; };

const T = {
  ar: {
    title: "فاحص التحديثات",
    desc: "اختر التطبيق واكتب رقم الإصدار المثبّت عندك (تجده في «حول التطبيق») لنخبرك إن كان تحديث متاحًا.",
    app: "التطبيق",
    appAria: "اختر التطبيق",
    latestSuffix: "أحدث إصدار",
    installed: "نسختك المثبّتة",
    installedAria: "رقم الإصدار المثبت لديك",
    ph: "مثال: 4.7.0",
    check: "فحص الآن",
    updTitle: "تحديث متاح!",
    updBodyPre: "نسختك ",
    updBodyMid: " أقدم من أحدث إصدار ",
    updDl: "تحميل ",
    updDlPost: " مباشرة",
    updPage: "صفحة التطبيق",
    latTitle: "أنت على أحدث إصدار",
    latBodyPre: "نسختك ",
    latBodyMid: " مطابقة لأحدث إصدار منشور ",
    latBodyPost: ". لا حاجة لأي إجراء.",
    newTitle: "نسختك أحدث من المنشور",
    newBodyPre: "يبدو أنك تستخدم نسخة معاينة (",
    newBodyMid: ") أحدث من آخر إصدار مستقر ",
    unkTitle: "لا يوجد إصدار منشور بعد",
    unkBody: "لم يُنشر أي إصدار رسمي لهذا التطبيق على GitHub حتى الآن، لذا لا يمكن المقارنة.",
    invTitle: "رقم إصدار غير مفهوم",
    invBodyPre: "اكتب الرقم بصيغة رقمية مثل ",
    invBodyMid: " أو ",
  },
  en: {
    title: "Update checker",
    desc: "Pick an app and type your installed version (find it in “About the app”) to know whether an update is available.",
    app: "App",
    appAria: "Choose the app",
    latestSuffix: "latest release",
    installed: "Your installed version",
    installedAria: "Your installed version number",
    ph: "e.g. 4.7.0",
    check: "Check now",
    updTitle: "Update available!",
    updBodyPre: "Your version ",
    updBodyMid: " is older than the latest release ",
    updDl: "Download ",
    updDlPost: " directly",
    updPage: "App page",
    latTitle: "You're on the latest release",
    latBodyPre: "Your version ",
    latBodyMid: " matches the latest published release ",
    latBodyPost: ". No action needed.",
    newTitle: "Your version is newer than published",
    newBodyPre: "Looks like you're running a preview version (",
    newBodyMid: ") newer than the latest stable release ",
    unkTitle: "No published release yet",
    unkBody: "No official release has been published for this app on GitHub so far, so there is nothing to compare against.",
    invTitle: "Unrecognized version number",
    invBodyPre: "Type the number in numeric form like ",
    invBodyMid: " or ",
  },
} as const;

/** فاحص التحديثات: يقارن نسخة المستخدم بأحدث إصدار حي من GitHub.
 *  المقارنة دلالية مبسطة (v4.8.0) — البيانات كلها حقيقية من إصدارات المستودعات. */
export function UpdateChecker({ apps, lang = "ar" }: { apps: CheckerApp[]; lang?: "ar" | "en" }) {
  const t = T[lang];
  const [slug, setSlug] = useState(apps[0]?.slug ?? "");
  const [installed, setInstalled] = useState("");
  const [submitted, setSubmitted] = useState("");

  const selected = useMemo(() => apps.find(a => a.slug === slug) ?? null, [apps, slug]);

  const verdict: Verdict | null = useMemo(() => {
    if (!submitted) return null;
    if (!selected?.latestTag) return { kind: "unknown" };
    const cmp = compareClient(submitted, selected.latestTag);
    if (cmp === null) return { kind: "invalid" };
    if (cmp > 0) return { kind: "newer" };
    if (cmp < 0) return { kind: "update" };
    return { kind: "latest" };
  }, [submitted, selected]);

  function compareClient(installed: string, latest: string): number | null {
    // نفس منطق compareVersions في lib/github (نسخة عميل بدون استيراد سيرفر)
    const clean = (v: string) => v.trim().replace(/^v/i, "").split(/[-+]/)[0];
    const parse = (v: string): number[] | null => {
      const parts = clean(v).split(".").map(p => Number.parseInt(p, 10));
      if (!parts.length || parts.some(p => !Number.isFinite(p))) return null;
      return parts;
    };
    const pa = parse(installed);
    const pb = parse(latest);
    if (!pa || !pb) return null;
    const len = Math.max(pa.length, pb.length);
    for (let i = 0; i < len; i++) {
      const x = pa[i] ?? 0;
      const y = pb[i] ?? 0;
      if (x > y) return 1;
      if (x < y) return -1;
    }
    return 0;
  }

  if (!apps.length) return null;

  return (
    <section className="panel update-checker" aria-labelledby="uc-title">
      <h2 id="uc-title"><SearchCheck size={18} aria-hidden /> {t.title}</h2>
      <p className="uc-desc">
        {t.desc}
      </p>

      <div className="uc-form">
        <label className="uc-field">
          <span>{t.app}</span>
          <select value={slug} onChange={e => { setSlug(e.target.value); setSubmitted(""); }} aria-label={t.appAria}>
            {apps.map(a => (
              <option key={a.slug} value={a.slug}>
                {a.name}{a.latestTag ? ` — ${t.latestSuffix} ${a.latestTag}` : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="uc-field">
          <span>{t.installed}</span>
          <input
            type="text"
            inputMode="text"
            dir="ltr"
            value={installed}
            onChange={e => { setInstalled(e.target.value); setSubmitted(""); }}
            onKeyDown={e => { if (e.key === "Enter") setSubmitted(installed); }}
            placeholder={t.ph}
            maxLength={24}
            aria-label={t.installedAria}
          />
        </label>
        <button
          type="button"
          className="button primary full"
          onClick={() => setSubmitted(installed)}
          disabled={!installed.trim()}
        >
          <SearchCheck size={15} aria-hidden /> {t.check}
        </button>
      </div>

      {verdict && selected && (
        <div className={`uc-result ${verdict.kind}`} role="status" aria-live="polite">
          {verdict.kind === "update" && (
            <>
              <span className="uc-ico"><ArrowUpCircle size={26} aria-hidden /></span>
              <div className="uc-body">
                <b>{t.updTitle}</b>
                <p>{t.updBodyPre}<code dir="ltr">{submitted}</code>{t.updBodyMid}<code dir="ltr">{selected.latestTag}</code>.</p>
                {selected.apkUrl ? (
                  <a className="button primary sm" href={selected.apkUrl} target="_blank" rel="noreferrer">
                    <Download size={14} aria-hidden /> {t.updDl}{selected.latestTag}{t.updDlPost}
                  </a>
                ) : (
                  <Link className="button primary sm" href={`/apps/${selected.slug}`}>{t.updPage}</Link>
                )}
              </div>
            </>
          )}
          {verdict.kind === "latest" && (
            <>
              <span className="uc-ico ok"><CheckCircle2 size={26} aria-hidden /></span>
              <div className="uc-body">
                <b>{t.latTitle}</b>
                <p>{t.latBodyPre}<code dir="ltr">{submitted}</code>{t.latBodyMid}<code dir="ltr">{selected.latestTag}</code>{t.latBodyPost}</p>
              </div>
            </>
          )}
          {verdict.kind === "newer" && (
            <>
              <span className="uc-ico info"><Sparkles size={26} aria-hidden /></span>
              <div className="uc-body">
                <b>{t.newTitle}</b>
                <p>{t.newBodyPre}<code dir="ltr">{submitted}</code>{t.newBodyMid}<code dir="ltr">{selected.latestTag}</code>.</p>
              </div>
            </>
          )}
          {verdict.kind === "unknown" && (
            <>
              <span className="uc-ico info"><HelpCircle size={26} aria-hidden /></span>
              <div className="uc-body">
                <b>{t.unkTitle}</b>
                <p>{t.unkBody}</p>
              </div>
            </>
          )}
          {verdict.kind === "invalid" && (
            <>
              <span className="uc-ico info"><HelpCircle size={26} aria-hidden /></span>
              <div className="uc-body">
                <b>{t.invTitle}</b>
                <p>{t.invBodyPre}<code dir="ltr">1.2.0</code>{t.invBodyMid}<code dir="ltr">v4.8</code>.</p>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
