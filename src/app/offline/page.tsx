import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff, LayoutGrid } from "lucide-react";
import { ReloadButton } from "@/components/reload-button";

export const metadata: Metadata = {
  title: "غير متصل",
  description: "لا يوجد اتصال بالإنترنت — تُعرض نسخة مخزنة من بوابة DRS.",
  robots: { index: false },
};

/** صفحة العمل بلا اتصال — يعرضها Service Worker عند تعذر الوصول للشبكة */
export default function OfflinePage() {
  return (
    <main className="container page narrow offline-page">
      <div className="offline-card">
        <span className="offline-icon"><WifiOff size={34} aria-hidden /></span>
        <h1>أنت غير متصل بالإنترنت</h1>
        <p>
          تعذر الوصول إلى الشبكة، لكن يمكنك متابعة تصفح الصفحات التي زرتها سابقًا —
          وهي مخزنة على جهازك. بمجرد عودة الاتصال سيحدث الموقع نفسه تلقائيًا.
        </p>
        <div className="offline-actions">
          <ReloadButton />
          <Link className="btn-dark sm" href="/apps">
            <LayoutGrid size={15} aria-hidden /> تصفح التطبيقات المخزنة
          </Link>
        </div>
        <p className="offline-hint">نصيحة: ثبّت بوابة DRS كتطبيق على جهازك لتجربة أسرع تعمل حتى بلا اتصال.</p>
      </div>
    </main>
  );
}
