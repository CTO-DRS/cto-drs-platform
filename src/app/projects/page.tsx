import Link from "next/link";
import { apps, appName, appSummary } from "@/lib/catalog";
export default function ProjectsPage() {
  return <main className="container page"><div className="page-intro"><div className="eyebrow">مساحة التطوير</div><h1>المشاريع</h1><p>تابع المشاريع وحالتها وروابط المستودعات التي يتم توثيقها رسميًا.</p></div><div className="app-grid">{apps.map(app=><article className="app-card" key={app.slug}><div className="app-icon">{app.name.en.slice(0,1)}</div><div className="app-card-body"><div className="app-title-row"><h3>{appName(app)}</h3><span className={`status ${app.status}`}>{app.status === "released" ? "منشور" : app.status === "archived" ? "مؤرشف" : "قيد التطوير"}</span></div><p>{appSummary(app)}</p><div className="app-card-bottom"><span>مشروع CTO-DRS</span><Link href={`/apps/${app.slug}`}>تفاصيل المشروع ←</Link></div></div></article>)}</div></main>;
}
