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

const timeFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" });

/** سجل الإشعارات المرئي: كل إصدار أبلغ عنه المتصفح يظهر هنا مع وقته —
 *  يُحدَّث حيًا عبر حدث drs:notify-changed وعبر تبويبات المتصفح (storage). */
export function NotifyLog() {
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
          <h2 id="nl-title">سجل الإشعارات</h2>
          <p className="muted">آخر إصدارات تطبيقاتك المفضلة التي نبّهك عنها المتصفح — محفوظة على جهازك فقط.</p>
        </div>
        {ready && unread > 0 && <span className="nl-unread" aria-label={`${unread} إشعارات غير مقروءة`}>{unread} جديد</span>}
      </div>

      {!ready ? (
        <p className="muted">جارٍ تحميل السجل…</p>
      ) : log.length === 0 ? (
        <div className="nl-empty">
          <b>لا إشعارات بعد</b>
          <p>
            فعّل «إشعارات الإصدارات» أعلاه وأضف تطبيقات إلى المفضلة — وعند صدور إصدار جديد لأيٍّ منها ستجد
            التنبيه مسجلًا هنا مع رقم الإصدار ووقته.
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
                      {e.name} — إصدار <code dir="ltr">{e.tag}</code>
                    </b>
                  )}
                  <span className="nl-time">{safeFormat(e.time)}</span>
                </div>
                {e.slug !== "notifications-test" && (
                  <Link className="nl-link" href={`/apps/${e.slug}`} aria-label={`فتح صفحة ${e.name}`}>
                    التطبيق ←
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="nl-actions">
            {unread > 0 && (
              <button type="button" className="nl-readbtn" onClick={markNotifyAllRead}>
                <CheckCheck size={14} aria-hidden /> تحديد الكل كمقروء
              </button>
            )}
            <button type="button" className="nl-clear" onClick={clearNotifyLog}>
              <Trash2 size={13} aria-hidden /> مسح السجل
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function safeFormat(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return timeFmt.format(d);
  } catch {
    return "—";
  }
}
