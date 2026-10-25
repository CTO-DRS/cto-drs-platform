/* إشعارات الإصدارات — تعمل بالكامل على جهاز المستخدم (Notification API + localStorage)
   بلا خوادم ولا تتبع: نراقب إصدارات التطبيقات المفضلة عند كل زيارة للمنصة،
   ونقارن أحدث وسم منشور بآخر وسم رأيناه، ثم نطلق إشعار متصفح حقيقي ونسجله في السجل. */

export type NotifyEntry = {
  id: string;
  slug: string;
  name: string;
  tag: string;
  /** مقتطف ملاحظات الإصدار المرافق للتنبيه (اختياري — للسجلات الأقدم قد يغيب) */
  notes?: string;
  time: string; // ISO
  read: boolean;
};

const LOG_KEY = "drs:notify-log";
const SEEN_KEY = "drs:notify-seen";
export const NOTIFY_EVENT = "drs:notify-changed";
const LOG_LIMIT = 40;

/* ===== قراءة/كتابة آمنة ===== */

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return parsed === null ? fallback : (parsed as T);
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* التخزين ممتلئ أو محجوب — نتجاهل بأمان */
  }
}

function emitChange() {
  try {
    window.dispatchEvent(new CustomEvent(NOTIFY_EVENT));
  } catch {
    /* بيئة بلا أحداث — نتجاهل */
  }
}

/* ===== سجل الإشعارات (الأحدث أولًا، بحد 40 عنصرًا) ===== */

export function getNotifyLog(): NotifyEntry[] {
  const list = readJSON<unknown>(LOG_KEY, []);
  if (!Array.isArray(list)) return [];
  return (list as Record<string, unknown>[])
    .filter(
      e =>
        e &&
        typeof e.slug === "string" &&
        typeof e.name === "string" &&
        typeof e.tag === "string" &&
        typeof e.time === "string",
    )
    .map(e => ({
      id: typeof e.id === "string" ? e.id : `${e.slug}-${e.time}`,
      slug: e.slug as string,
      name: e.name as string,
      tag: e.tag as string,
      notes: typeof e.notes === "string" && e.notes.trim() ? e.notes : undefined,
      time: e.time as string,
      read: e.read === true,
    }));
}

export function addNotifyEntry(entry: { slug: string; name: string; tag: string; notes?: string }): NotifyEntry | null {
  const full: NotifyEntry = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    time: new Date().toISOString(),
    read: false,
    ...entry,
  };
  const next = [full, ...getNotifyLog().filter(e => !(e.slug === entry.slug && e.tag === entry.tag))].slice(0, LOG_LIMIT);
  writeJSON(LOG_KEY, next);
  emitChange();
  return full;
}

export function markNotifyAllRead(): void {
  const next = getNotifyLog().map(e => (e.read ? e : { ...e, read: true }));
  writeJSON(LOG_KEY, next);
  emitChange();
}

export function clearNotifyLog(): void {
  writeJSON(LOG_KEY, []);
  emitChange();
}

/* ===== آخر وسوم رأيناها لكل تطبيق (خط الأساس للمقارنة) ===== */

export function getSeenTags(): Record<string, string> {
  const map = readJSON<unknown>(SEEN_KEY, {});
  if (!map || typeof map !== "object" || Array.isArray(map)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(map as Record<string, unknown>)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

export function writeSeenTags(map: Record<string, string>): void {
  writeJSON(SEEN_KEY, map);
}

/* ===== صلاحيات وإطلاق الإشعارات ===== */

export type NotifyPermission = "granted" | "denied" | "default" | "unsupported";

export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function currentNotifyPermission(): NotifyPermission {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission;
}

/** إطلاق إشعار متصفح حقيقي — النقر عليه يفتح صفحة التطبيق. يعيد false عند أي فشل. */
export function fireAppNotification(title: string, body: string, slug: string): boolean {
  if (!notificationsSupported() || Notification.permission !== "granted") return false;
  try {
    const icon = `${window.location.origin}/icon-192.png`;
    const n = new Notification(title, { body, tag: `drs-${slug}`, icon, badge: icon });
    n.onclick = () => {
      try {
        window.focus();
        window.location.assign(`/apps/${slug}`);
        n.close();
      } catch {
        /* تجاهل */
      }
    };
    return true;
  } catch {
    return false;
  }
}

/* ===== مقارنة إصدارات دلالية مبسطة (نسخة عميل مطابقة لمنطق lib/github) =====
   تعيد 1 إذا a أحدث، -1 إذا b أحدث، 0 إن تكافأا، وnull إذا تعذر التحليل. */
export function compareSemver(a: string, b: string): number | null {
  const clean = (v: string) => v.trim().replace(/^v/i, "").split(/[-+]/)[0];
  const parse = (v: string): number[] | null => {
    const parts = clean(v).split(".").map(p => Number.parseInt(p, 10));
    if (!parts.length || parts.some(p => !Number.isFinite(p))) return null;
    return parts;
  };
  const pa = parse(a);
  const pb = parse(b);
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
