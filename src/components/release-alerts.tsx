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
};

/** مُنبّه الإصدارات: يراقب تطبيقات المفضلة ويطلق إشعار متصفح عند صدور إصدار جديد.
 *  الفحص يجري عند كل زيارة/عودة للتبويب — بيانات الإصدارات حقيقية من GitHub (تُحدّث كل ساعة). */
export function ReleaseAlerts({ apps, title = "إشعارات الإصدارات" }: { apps: ReleaseWatchApp[]; title?: string }) {
  const [permission, setPermission] = useState<NotifyPermission>("default");
  const [busy, setBusy] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const { favorites, ready } = useFavorites();

  useEffect(() => {
    setPermission(currentNotifyPermission());
  }, []);

  /** فحص إصدارات المفضلة: أول مشاهدة تُسجَّل كخط أساس بصمت، وأي إصدار أحدث يُطلق إشعارًا ويُسجَّل في السجل */
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
          `إصدار جديد: ${app.name}`,
          `توفر ${app.latestTag} الآن للتحميل — اضغط لعرض صفحة التطبيق.`,
          app.slug,
        );
        if (ok) {
          addNotifyEntry({ slug: app.slug, name: app.name, tag: app.latestTag });
          fired++;
        }
        seen[app.slug] = app.latestTag;
        changed = true;
      }
    }
    if (changed) writeSeenTags(seen);
    setLastCheck(new Date());
    return fired;
  }, [apps, favorites]);

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
        toast("تم تفعيل الإشعارات — سنراقب إصدارات مفضلتك", "success");
        fireAppNotification(
          "الإشعارات مفعّلة",
          "سنعلمك عند صدور إصدار جديد لأي تطبيق من مفضلتك.",
          "notifications-enabled",
        );
      } else if (result === "denied") {
        toast("رُفض إذن الإشعارات — يمكنك تفعيله من إعدادات المتصفح", "error");
      }
    } finally {
      setBusy(false);
    }
  }

  function testNotification() {
    const ok = fireAppNotification(
      "إشعار تجريبي",
      "هكذا سيصلك التنبيه عند صدور إصدار جديد لأي تطبيق من المفضلة.",
      "notifications-test",
    );
    if (ok) {
      addNotifyEntry({ slug: "notifications-test", name: "إشعار تجريبي", tag: "test" });
      toast("أُرسل الإشعار التجريبي وسُجّل في السجل", "success");
    } else {
      toast("تعذر إرسال الإشعار — تحقق من صلاحيات المتصفح", "error");
    }
  }

  const watched = ready ? favorites.length : 0;

  return (
    <section className="panel notify-panel" aria-labelledby="ra-title">
      <h2 id="ra-title">
        {permission === "granted" ? <BellRing size={17} aria-hidden /> : permission === "denied" ? <BellOff size={17} aria-hidden /> : <Bell size={17} aria-hidden />}
        {title}
      </h2>

      {permission === "unsupported" ? (
        <p className="notify-note">
          <HelpCircle size={14} aria-hidden /> متصفحك الحالي لا يدعم إشعارات المتصفح — جرّب متصفحًا حديثًا كي يصلك
          تنبيه عند صدور إصدار جديد لأي تطبيق من مفضلتك.
        </p>
      ) : permission === "default" ? (
        <>
          <p className="notify-note">
            فعّل الإشعارات لينبّهك المتصفح فور صدور إصدار جديد لأي تطبيق أضفته إلى المفضلة — الفحص يجري عند كل
            زيارة للمنصة، وتظل بياناتك على جهازك ولا نرسل شيئًا لأي خادم.
          </p>
          <button type="button" className="button primary full" onClick={enable} disabled={busy}>
            <Bell size={15} aria-hidden /> {busy ? "بانتظار موافقتك…" : "تفعيل إشعارات الإصدارات"}
          </button>
        </>
      ) : permission === "granted" ? (
        <>
          <p className="notify-note ok">
            <BellRing size={14} aria-hidden /> الإشعارات مفعّلة — نراقب حاليًا{" "}
            <b>{watched > 0 ? `${watched} ${watched === 1 ? "تطبيقًا مفضلاً" : "تطبيقات مفضلة"}` : "مفضلتك (أضف تطبيقات لتبدأ المراقبة)"}</b>
            {lastCheck && <> · آخر فحص {lastCheck.toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}</>}
          </p>
          <div className="notify-row">
            <button type="button" className="button secondary sm" onClick={testNotification}>
              <BellRing size={14} aria-hidden /> تجربة إشعار
            </button>
            <Link className="text-link" href="/account#notify-log">
              عرض سجل الإشعارات ←
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="notify-note blocked">
            <BellOff size={14} aria-hidden /> أُغلق إذن الإشعارات في هذا المتصفح. لتفعيله: افتح إعدادات الموقع
            (أيقونة القفل بجانب العنوان) واسمح بالإشعارات ثم أعد تحميل الصفحة.
          </p>
        </>
      )}

      <p className="notify-foot">
        <Info size={12} aria-hidden /> البيانات حية من مستودعات GitHub وتتحدث كل ساعة — جرّب أيضًا{" "}
        <Link href="/updates">فاحص التحديثات</Link>.
      </p>
    </section>
  );
}
