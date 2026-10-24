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
};

type Verdict =
  | { kind: "update"; }
  | { kind: "latest"; }
  | { kind: "newer"; }
  | { kind: "unknown"; }
  | { kind: "invalid"; };

/** فاحص التحديثات: يقارن نسخة المستخدم بأحدث إصدار حي من GitHub.
 *  المقارنة دلالية مبسطة (v4.8.0) — البيانات كلها حقيقية من إصدارات المستودعات. */
export function UpdateChecker({ apps }: { apps: CheckerApp[] }) {
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
      <h2 id="uc-title"><SearchCheck size={18} aria-hidden /> فاحص التحديثات</h2>
      <p className="uc-desc">
        اختر التطبيق واكتب رقم الإصدار المثبّت عندك (تجده في «حول التطبيق») لنخبرك إن كان تحديث متاحًا.
      </p>

      <div className="uc-form">
        <label className="uc-field">
          <span>التطبيق</span>
          <select value={slug} onChange={e => { setSlug(e.target.value); setSubmitted(""); }} aria-label="اختر التطبيق">
            {apps.map(a => (
              <option key={a.slug} value={a.slug}>
                {a.name}{a.latestTag ? ` — أحدث إصدار ${a.latestTag}` : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="uc-field">
          <span>نسختك المثبّتة</span>
          <input
            type="text"
            inputMode="text"
            dir="ltr"
            value={installed}
            onChange={e => { setInstalled(e.target.value); setSubmitted(""); }}
            onKeyDown={e => { if (e.key === "Enter") setSubmitted(installed); }}
            placeholder="مثال: 4.7.0"
            maxLength={24}
            aria-label="رقم الإصدار المثبت لديك"
          />
        </label>
        <button
          type="button"
          className="button primary full"
          onClick={() => setSubmitted(installed)}
          disabled={!installed.trim()}
        >
          <SearchCheck size={15} aria-hidden /> فحص الآن
        </button>
      </div>

      {verdict && selected && (
        <div className={`uc-result ${verdict.kind}`} role="status" aria-live="polite">
          {verdict.kind === "update" && (
            <>
              <span className="uc-ico"><ArrowUpCircle size={26} aria-hidden /></span>
              <div className="uc-body">
                <b>تحديث متاح!</b>
                <p>نسختك <code dir="ltr">{submitted}</code> أقدم من أحدث إصدار <code dir="ltr">{selected.latestTag}</code>.</p>
                {selected.apkUrl ? (
                  <a className="button primary sm" href={selected.apkUrl} target="_blank" rel="noreferrer">
                    <Download size={14} aria-hidden /> تحميل {selected.latestTag} مباشرة
                  </a>
                ) : (
                  <Link className="button primary sm" href={`/apps/${selected.slug}`}>صفحة التطبيق</Link>
                )}
              </div>
            </>
          )}
          {verdict.kind === "latest" && (
            <>
              <span className="uc-ico ok"><CheckCircle2 size={26} aria-hidden /></span>
              <div className="uc-body">
                <b>أنت على أحدث إصدار</b>
                <p>نسختك <code dir="ltr">{submitted}</code> مطابقة لأحدث إصدار منشور <code dir="ltr">{selected.latestTag}</code>. لا حاجة لأي إجراء.</p>
              </div>
            </>
          )}
          {verdict.kind === "newer" && (
            <>
              <span className="uc-ico info"><Sparkles size={26} aria-hidden /></span>
              <div className="uc-body">
                <b>نسختك أحدث من المنشور</b>
                <p>يبدو أنك تستخدم نسخة معاينة (<code dir="ltr">{submitted}</code>) أحدث من آخر إصدار مستقر <code dir="ltr">{selected.latestTag}</code>.</p>
              </div>
            </>
          )}
          {verdict.kind === "unknown" && (
            <>
              <span className="uc-ico info"><HelpCircle size={26} aria-hidden /></span>
              <div className="uc-body">
                <b>لا يوجد إصدار منشور بعد</b>
                <p>لم يُنشر أي إصدار رسمي لهذا التطبيق على GitHub حتى الآن، لذا لا يمكن المقارنة.</p>
              </div>
            </>
          )}
          {verdict.kind === "invalid" && (
            <>
              <span className="uc-ico info"><HelpCircle size={26} aria-hidden /></span>
              <div className="uc-body">
                <b>رقم إصدار غير مفهوم</b>
                <p>اكتب الرقم بصيغة رقمية مثل <code dir="ltr">1.2.0</code> أو <code dir="ltr">v4.8</code>.</p>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
