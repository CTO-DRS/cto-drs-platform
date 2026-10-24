"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Download, WifiOff, X } from "lucide-react";
import { toast } from "@/lib/toast";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
const DISMISS_KEY = "drs:install-dismissed";
const DISMISS_EVENT = "drs:install-dismissed-changed";

/* حالة عدم الاتصال كمخزن خارجي (متوافق مع قواعد React 19) */
function subscribeOnline(callback: () => void): () => void {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}
const isOffline = () => !navigator.onLine;
const notOffline = () => false;

function subscribeDismissed(callback: () => void): () => void {
  window.addEventListener(DISMISS_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(DISMISS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
let dismissedCache: boolean | null = null;
const getDismissed = () => {
  if (dismissedCache === null) {
    try { dismissedCache = localStorage.getItem(DISMISS_KEY) === "1"; } catch { dismissedCache = false; }
  }
  return dismissedCache;
};
const notDismissed = () => false;

/** طبقة PWA: تسجيل Service Worker + زر تثبيت التطبيق + شريط عدم الاتصال */
export function PwaLayer() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const offline = useSyncExternalStore(subscribeOnline, isOffline, notOffline);
  const dismissed = useSyncExternalStore(subscribeDismissed, getDismissed, notDismissed);

  useEffect(() => {
    /* تسجيل خدمة العمل بلا اتصال */
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        /* الفشل لا يعطل الموقع — يعمل الموقع كالمعتاد دون PWA */
      });
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstallEvent(null);
      toast("ثُبّت تطبيق DRS على جهازك بنجاح", "success");
    };
    const goOnline = () => toast("عاد الاتصال بالإنترنت", "success");

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  function dismissInstall() {
    dismissedCache = true;
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch { /* تجاهل */ }
    window.dispatchEvent(new CustomEvent(DISMISS_EVENT));
  }

  const install = useCallback(async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "dismissed") dismissInstall();
    setInstallEvent(null);
  }, [installEvent]);

  const showChip = Boolean(installEvent) && !dismissed;

  return (
    <>
      {showChip && (
        <div className="install-chip" role="region" aria-label="تثبيت التطبيق">
          <span className="install-chip-icon"><Download size={16} aria-hidden /></span>
          <div className="install-chip-text">
            <b>ثبّت تطبيق DRS</b>
            <small>وصول أسرع وعمل بلا اتصال</small>
          </div>
          <button type="button" className="install-chip-btn" onClick={install}>تثبيت</button>
          <button type="button" className="install-chip-x" onClick={dismissInstall} aria-label="إخفاء إشعار التثبيت">
            <X size={14} aria-hidden />
          </button>
        </div>
      )}
      {offline && (
        <div className="offline-banner" role="status">
          <WifiOff size={15} aria-hidden />
          <span>أنت غير متصل بالإنترنت — تُعرض الآن نسخة مخزنة من آخر زيارة.</span>
        </div>
      )}
    </>
  );
}
