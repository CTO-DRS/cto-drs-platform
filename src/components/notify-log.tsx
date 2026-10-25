"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BellRing, CheckCheck, Trash2 } from "lucide-react";
import {
  clearNotifyLog,
  getNotifyLog,
  markNotifyAllRead,
  NOTIFY_EVENT,
  type NotifyEntry,
} from "@/lib/notifications";

const T = {
  ar: {
    title: "سجل الإشعارات",
    sub: "آخر إصدارات تطبيقاتك المفضلة التي نبّهك عنها المتصفح — محفوظة على جهازك فقط.",
    unreadAria: "إشعارات غير مقروءة",
    unread: "جديد",
    loading: "جارٍ تحميل السجل…",
    emptyTitle: "لا إشعارات بعد",
    emptyBody:
      "فعّل «إشعارات الإصدارات» أعلاه وأضف تطبيقات إلى المفضلة — وعند صدور إصدار جديد لأيٍّ منها ستجد التنبيه مسجلًا هنا مع رقم الإصدار ووقته.",
    release: "إصدار",
    openAria: "فتح صفحة",
    open: "التطبيق",
    markRead: "تحديد الكل كمقروء",
    clear: "مسح السجل",
    locale: "ar" as const,
  },
  en: {
    title: "Notification log",
    sub: "The latest releases of your favorite apps the browser alerted you about — stored on your device only.",
    unreadAria: "unread notifications",
    unread: "new",
    loading: "Loading the log…",
    emptyTitle: "No notifications yet",
    emptyBody:
      "Enable “Release notifications” above and add apps to your favorites — when a new release ships for any of them you'll find the alert logged here with its version and time.",
    release: "release",
    openAria: "Open page of",
    open: "App",
    markRead: "Mark all as read",
    clear: "Clear log",
    locale: "en" as const,
  },
} as const;

const timeFmtAr = new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" });
const timeFmtEn = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

/** سجل الإشعارات المرئي: كل إصدار أبلغ عنه المتصفح يظهر هنا مع وقته ومقتطف ملاحظاته —
 *  يُحدَّث حيًا عبر حدث drs:notify-changed وعبر تبويبات المتصفح (storage). */
export function NotifyLog({ lang = "ar" }: { lang?: "ar" | "en" }) {
  const t = T[lang];
  const [log, setLog] = useState<NotifyEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => setLog(getNotifyLog());
    load();
    setReady(true);
    window.addEventListener(NOTIFY_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(NOTIFY_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const unread = log.filter(e => !e.read).length;

  return (
    <section className="panel notify-log" id="notify-log" aria-labelledby="nl-title">
      <div className="nl-head">
        <span className="account-avatar bell"><BellRing size={22} aria-hidden /></span>
        <div>
          <h2 id="nl-title">{t.title}</h2>
          <p className="muted">{t.sub}</p>
        </div>
        {ready && unread > 0 && <span className="nl-unread" aria-label={`${unread} ${t.unreadAria}`}>{unread} {t.unread}</span>}
      </div>

      {!ready ? (
        <p className="muted">{t.loading}</p>
      ) : log.length === 0 ? (
        <div className="nl-empty">
          <b>{t.emptyTitle}</b>
          <p>
            {t.emptyBody}
          </p>
        </div>
      ) : (
        <>
          <ul className="nl-list">
            {log.map(e => (
              <li className={`nl-item ${e.read ? "read" : ""}`} key={e.id}>
                <span className="nl-dot" aria-hidden />
                <div className="nl-body">
                  {e.slug === "notifications-test" ? (
                    <b>{e.name}</b>
                  ) : (
                    <b>
                      {e.name} — {t.release} <code dir="ltr">{e.tag}</code>
                    </b>
                  )}
                  {e.notes && <span className="nl-notes">{e.notes}</span>}
                  <span className="nl-time">{safeFormat(e.time, t.locale)}</span>
                </div>
                {e.slug !== "notifications-test" && (
                  <Link className="nl-link" href={`/apps/${e.slug}`} aria-label={`${t.openAria} ${e.name}`}>
                    {t.open} {lang === "en" ? "→" : "←"}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="nl-actions">
            {unread > 0 && (
              <button type="button" className="nl-readbtn" onClick={markNotifyAllRead}>
                <CheckCheck size={14} aria-hidden /> {t.markRead}
              </button>
            )}
            <button type="button" className="nl-clear" onClick={clearNotifyLog}>
              <Trash2 size={13} aria-hidden /> {t.clear}
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function safeFormat(iso: string, locale: "ar" | "en"): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return (locale === "ar" ? timeFmtAr : timeFmtEn).format(d);
  } catch {
    return "—";
  }
}
