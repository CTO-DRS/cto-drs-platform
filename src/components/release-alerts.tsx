"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell, BellOff, BellRing, HelpCircle, Info } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { toast } from "@/lib/toast";
import {
  addNotifyEntry,
  compareSemver,
  currentNotifyPermission,
  fireAppNotification,
  getSeenTags,
  writeSeenTags,
  type NotifyPermission,
} from "@/lib/notifications";

export type ReleaseWatchApp = {
  slug: string;
  name: string;
  latestTag: string | null;
  releasedAt: string | null;
  /** ملاحظات أحدث إصدار (منسّقة ومقتطعة مسبقًا من الخادم) — تُدمج في نص الإشعار عند توفرها */
  notes?: string | null;
};

const T = {
  ar: {
    title: "إشعارات الإصدارات",
    unsupported:
      "متصفحك الحالي لا يدعم إشعارات المتصفح — جرّب متصفحًا حديثًا كي يصلك تنبيه عند صدور إصدار جديد لأي تطبيق من مفضلتك.",
    enableNote:
      "فعّل الإشعارات لينبّهك المتصفح فور صدور إصدار جديد لأي تطبيق أضفته إلى المفضلة — الفحص يجري عند كل زيارة للمنصة، وتظل بياناتك على جهازك ولا نرسل شيئًا لأي خادم.",
    enable: "تفعيل إشعارات الإصدارات",
    busy: "بانتظار موافقتك…",
    enabled: "الإشعارات مفعّلة — نراقب حاليًا",
    oneFav: "تطبيقًا مفضلاً",
    manyFav: "تطبيقات مفضلة",
    noFav: "مفضلتك (أضف تطبيقات لتبدأ المراقبة)",
    lastCheck: "آخر فحص",
    test: "تجربة إشعار",
    viewLog: "عرض سجل الإشعارات",
    blocked:
      "أُغلق إذن الإشعارات في هذا المتصفح. لتفعيله: افتح إعدادات الموقع (أيقونة القفل بجانب العنوان) واسمح بالإشعارات ثم أعد تحميل الصفحة.",
    foot: "البيانات حية من مستودعات GitHub وتتحدث كل ساعة — جرّب أيضًا",
    footLink: "فاحص التحديثات",
    enabledToast: "تم تفعيل الإشعارات — سنراقب إصدارات مفضلتك",
    deniedToast: "رُفض إذن الإشعارات — يمكنك تفعيله من إعدادات المتصفح",
    enTitle: "الإشعارات مفعّلة",
    enBody: "سنعلمك عند صدور إصدار جديد لأي تطبيق من مفضلتك.",
    testTitle: "إشعار تجريبي",
    testBody: "هكذا سيصلك التنبيه — مع مقتطف من ملاحظات الإصدار الجديد عند توفرها.",
    testLoggedName: "إشعار تجريبي",
    sentToast: "أُرسل الإشعار التجريبي وسُجّل في السجل",
    failToast: "تعذر إرسال الإشعار — تحقق من صلاحيات المتصفح",
    /* نصوص إشعار الإصدار الجديد */
    relTitle: "إصدار جديد",
    relBodyAvail: "متاح الآن للتحميل.",
    relBodyTap: "اضغط لعرض صفحة التطبيق.",
    /* عنوان الساعة */
    hourLocale: "ar",
  },
  en: {
    title: "Release notifications",
    unsupported:
      "Your current browser doesn't support web notifications — try a modern browser to get alerted when any of your favorite apps ships a new release.",
    enableNote:
      "Turn on notifications and the browser will alert you the moment a new release ships for any app in your favorites — checked on every visit, with all data kept on your device.",
    enable: "Enable release notifications",
    busy: "Waiting for your approval…",
    enabled: "Notifications are on — currently watching",
    oneFav: "favorite app",
    manyFav: "favorite apps",
    noFav: "your favorites (add apps to start watching)",
    lastCheck: "Last check",
    test: "Test notification",
    viewLog: "View notification log",
    blocked:
      "Notification permission is blocked in this browser. To enable it: open the site settings (the lock icon next to the address), allow notifications, then reload the page.",
    foot: "Data is live from GitHub repositories and refreshes hourly — also try the",
    footLink: "update checker",
    enabledToast: "Notifications enabled — we'll watch your favorite apps' releases",
    deniedToast: "Notification permission was denied — you can enable it in browser settings",
    enTitle: "Notifications enabled",
    enBody: "We'll let you know when a new release ships for any of your favorite apps.",
    testTitle: "Test notification",
    testBody: "This is how alerts will look — including an excerpt of the release notes when available.",
    testLoggedName: "Test notification",
    sentToast: "Test notification sent and logged",
    failToast: "Couldn't send the notification — check browser permissions",
    relTitle: "New release",
    relBodyAvail: " is available for download now.",
    relBodyTap: "Tap to open the app page.",
    hourLocale: "en",
  },
} as const;

/** مُنبّه الإصدارات: يراقب تطبيقات المفضلة ويطلق إشعار متصفح عند صدور إصدار جديد.
 *  نص الإشعار يتضمن مقتطفًا من ملاحظات الإصدار عند توفرها — بيانات الإصدارات حقيقية من GitHub (تُحدّث كل ساعة). */
export function ReleaseAlerts({
  apps,
  title,
  lang = "ar",
}: {
  apps: ReleaseWatchApp[];
  title?: string;
  lang?: "ar" | "en";
}) {
  const t = T[lang];
  const [permission, setPermission] = useState<NotifyPermission>("default");
  const [busy, setBusy] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const { favorites, ready } = useFavorites();

  useEffect(() => {
    setPermission(currentNotifyPermission());
  }, []);

  /** فحص إصدارات المفضلة: أول مشاهدة تُسجَّل كخط أساس بصمت، وأي إصدار أحدث يُطلق إشعارًا (بملاحظاته) ويُسجَّل في السجل */
  const checkReleases = useCallback(() => {
    if (currentNotifyPermission() !== "granted") return;
    const seen = getSeenTags();
    let changed = false;
    let fired = 0;
    for (const app of apps) {
      if (!favorites.includes(app.slug) || !app.latestTag) continue;
      const prev = seen[app.slug];
      if (!prev) {
        seen[app.slug] = app.latestTag; // خط أساس أول زيارة دون إزعاج بالإصدارات القديمة
        changed = true;
        continue;
      }
      if ((compareSemver(app.latestTag, prev) ?? 0) > 0) {
        const ok = fireAppNotification(
          `${t.relTitle}: ${app.name}`,
          releaseBody(app.latestTag, app.notes, t),
          app.slug,
        );
        if (ok) {
          addNotifyEntry({ slug: app.slug, name: app.name, tag: app.latestTag, notes: app.notes ?? undefined });
          fired++;
        }
        seen[app.slug] = app.latestTag;
        changed = true;
      }
    }
    if (changed) writeSeenTags(seen);
    setLastCheck(new Date());
    return fired;
  }, [apps, favorites, t]);

  /* فحص عند تفعيل الصلاحية وعند كل عودة للتبويب */
  useEffect(() => {
    if (permission !== "granted") return;
    checkReleases();
    const onVisible = () => {
      if (document.visibilityState === "visible") checkReleases();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [permission, checkReleases]);

  async function enable() {
    if (!("Notification" in window)) return;
    setBusy(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotifyPermission);
      if (result === "granted") {
        toast(t.enabledToast, "success");
        fireAppNotification(t.enTitle, t.enBody, "notifications-enabled");
      } else if (result === "denied") {
        toast(t.deniedToast, "error");
      }
    } finally {
      setBusy(false);
    }
  }

  function testNotification() {
    const ok = fireAppNotification(t.testTitle, t.testBody, "notifications-test");
    if (ok) {
      addNotifyEntry({ slug: "notifications-test", name: t.testLoggedName, tag: "test" });
      toast(t.sentToast, "success");
    } else {
      toast(t.failToast, "error");
    }
  }

  const watched = ready ? favorites.length : 0;

  return (
    <section className="panel notify-panel" aria-labelledby="ra-title">
      <h2 id="ra-title">
        {permission === "granted" ? <BellRing size={17} aria-hidden /> : permission === "denied" ? <BellOff size={17} aria-hidden /> : <Bell size={17} aria-hidden />}
        {title ?? t.title}
      </h2>

      {permission === "unsupported" ? (
        <p className="notify-note">
          <HelpCircle size={14} aria-hidden /> {t.unsupported}
        </p>
      ) : permission === "default" ? (
        <>
          <p className="notify-note">
            {t.enableNote}
          </p>
          <button type="button" className="button primary full" onClick={enable} disabled={busy}>
            <Bell size={15} aria-hidden /> {busy ? t.busy : t.enable}
          </button>
        </>
      ) : permission === "granted" ? (
        <>
          <p className="notify-note ok">
            <BellRing size={14} aria-hidden /> {t.enabled}{" "}
            <b>{watched > 0 ? `${watched} ${watched === 1 ? t.oneFav : t.manyFav}` : t.noFav}</b>
            {lastCheck && <> · {t.lastCheck} {lastCheck.toLocaleTimeString(t.hourLocale, { hour: "2-digit", minute: "2-digit" })}</>}
          </p>
          <div className="notify-row">
            <button type="button" className="button secondary sm" onClick={testNotification}>
              <BellRing size={14} aria-hidden /> {t.test}
            </button>
            <Link className="text-link" href={lang === "en" ? "/en/account#notify-log" : "/account#notify-log"}>
              {t.viewLog} {lang === "en" ? "→" : "←"}
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="notify-note blocked">
            <BellOff size={14} aria-hidden /> {t.blocked}
          </p>
        </>
      )}

      <p className="notify-foot">
        <Info size={12} aria-hidden /> {t.foot}{" "}
        <Link href={lang === "en" ? "/en/updates" : "/updates"}>{t.footLink}</Link>.
      </p>
    </section>
  );
}

/** نص إشعار الإصدار: الوسم + مقتطف ملاحظات الإصدار عند توفره */
function releaseBody(tag: string, notes: string | null | undefined, t: (typeof T)["ar"] | (typeof T)["en"]): string {
  const head = `${tag} ${t.relBodyAvail}`;
  const excerpt = notes ? `\n${notes.slice(0, 140).trim()}${notes.length > 140 ? "…" : ""}` : "";
  const tail = notes ? "" : t.relBodyTap;
  return `${head}${excerpt}${tail}`;
}
