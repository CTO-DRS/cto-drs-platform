import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { apps, appName, appSummary, categoryLabel, catalogStats, statusLabels } from "@/lib/catalog";

export const metadata = { title: "المشاريع", description: "تابع مشاريع CTO-DRS وحالتها وفئاتها التقنية." };

export default function ProjectsPage() {
  return (
    <main className="container page">
      <div className="page-intro">
        <div className="eyebrow">مساحة التطوير</div>
        <h1>المشاريع</h1>
        <p>تابع المشاريع وحالتها وروابط المستودعات التي يتم توثيقها رسميًا. هذا العرض مخصص لمتابعة التطوير، وللتنزيل انتقل إلى صفحة التطبيقات.</p>
      </div>
      <div className="stats-band inline-stats" aria-label="ملخص الكتالوج">
        <div className="stat"><b>{catalogStats.total}</b><span>مشروع</span></div>
        <div className="stat"><b>{catalogStats.categories}</b><span>فئة</span></div>
        <div className="stat"><b>{catalogStats.inDevelopment}</b><span>قيد التطوير</span></div>
      </div>
      <div className="app-grid">
        {apps.map(app => (
          <article className="app-card" key={app.slug}>
            <div className="app-icon">{app.name.en.slice(0, 1)}</div>
            <div className="app-card-body">
              <div className="app-title-row">
                <h3>{appName(app)}</h3>
                <span className={`status ${app.status}`}>{statusLabels[app.status]}</span>
              </div>
              <p>{appSummary(app)}</p>
              <div className="app-card-bottom">
                <span className="cat-tag"><FolderOpen size={13} aria-hidden /> {categoryLabel(app.category)}</span>
                <Link href={`/apps/${app.slug}`}>تفاصيل المشروع ←</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="notice top-margin">
        <b>للمطورين:</b> يُدار هذا الكتالوج من ملف <code>content/apps.json</code> داخل مستودع GitHub، وكل تعديل يمر بمراجعة عبر طلبات السحب.
      </div>
    </main>
  );
}
