import Link from "next/link";
import { apps, appName, appSummary } from "@/lib";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "التطبيقات" };
export default function AppsPage() {
  return <main className="container page"><div className="page-intro"><div className="eyebrow">المكتبة الرسمية</div><h1>التطبيقات</h1><p>اقرأ وصف كل تطبيق، واعرف حالة المشروع، وافتح روابط الإصدار عندما يضيفها المطور ويتحقق منها.</p></div>
    <div className="notice"><b>مهم:</b> حالة «قيد التطوير» تعني أن صفحة المشروع لا تؤكد توفر تنزيل عام. لا تظهر أزرار تنزيل إلا عند إضافة روابط رسمية موثوقة.</div>
    <div className="app-grid">{apps.map(app => <article className="app-card" key={app.slug}><div className="app-icon">{app.name.en.slice(0,1)}</div><div className="app-card-body"><div className="app-title-row"><h3>{appName(app)}</h3><span className={`status ${app.status}`}>{app.status === "released" ? "متاح" : app.status === "archived" ? "مؤرشف" : "قيد التطوير"}</span></div><p>{appSummary(app)}</p><div className="app-card-bottom"><span>{app.platforms.join(" · ")}</span><Link href={`/apps/${app.slug}`}>عرض التفاصيل ←</Link></div></div></article>)}</div>
  </main>;
}
