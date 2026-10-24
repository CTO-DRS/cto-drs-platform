import Link from "next/link";
import { Compass } from "lucide-react";
import { apps, appName } from "@/lib/catalog";
import { PaletteTriggerButton } from "@/components/palette-trigger-button";

export default function NotFound() {
  const suggestions = apps.slice(0, 3);

  return (
    <main className="container page narrow">
      <section className="panel notfound-panel">
        <div className="notfound-code" aria-hidden>404</div>
        <h1>الصفحة غير موجودة</h1>
        <p>قد يكون الرابط غير صحيح أو أن المشروع غير منشور في الكتالوج. جرّب البحث السريع، أو ابدأ من أحد الاقتراحات أدناه.</p>
        <div className="hero-actions">
          <PaletteTriggerButton label="ابحث في الموقع" />
          <Link className="button primary" href="/apps">تصفح التطبيقات</Link>
          <Link className="button secondary" href="/">الصفحة الرئيسية</Link>
        </div>

        {suggestions.length > 0 && (
          <div className="nf-suggestions" aria-label="تطبيقات مقترحة">
            <span className="nf-suggest-label"><Compass size={14} aria-hidden /> ربما تبحث عن:</span>
            <div className="nf-apps">
              {suggestions.map(app => (
                <Link key={app.slug} className="nf-app" href={`/apps/${app.slug}`}>
                  <span className="app-icon">{app.name.en.slice(0, 1)}</span>
                  <b>{appName(app)}</b>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
