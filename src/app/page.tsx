import Link from "next/link";
import { ArrowLeft, ArrowDownToLine, ShieldCheck, BookOpen, Github, Search, Boxes, FolderOpen } from "lucide-react";
import { apps, appName, appSummary, categoriesWithCounts, catalogStats, categoryLabel, statusLabels } from "@/lib/catalog";
import { HeroSearch } from "@/components/hero-search";

export default function HomePage() {
  const featured = apps.slice(0, 6);
  const categories = categoriesWithCounts();

  return <main>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-copy"><div className="eyebrow"><span className="pulse"/> البوابة الرسمية للمشاريع التقنية</div>
        <h1>كل مشاريعك.<br/><span>في مكان واحد.</span></h1>
        <p>اكتشف تطبيقات CTO-DRS، اقرأ تفاصيل كل مشروع، وتابع الإصدارات والتوثيق وروابط التنزيل الرسمية عندما تكون متاحة.</p>
        <HeroSearch />
        <div className="hero-actions"><Link className="button primary" href="/apps">استكشف التطبيقات <ArrowLeft size={18}/></Link><Link className="button secondary" href="/projects">اكتشف المشاريع</Link></div>
        <div className="trust-row"><span><ShieldCheck size={17}/> روابط موثقة عند النشر</span><span><BookOpen size={17}/> تفاصيل وتوثيق</span><span><Github size={17}/> شفافية GitHub</span></div>
      </div>
      <div className="hero-art" aria-label="لوحة بصرية لهوية CTO-DRS"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="core-logo">D<span>RS</span><small>TECHNOLOGY HUB</small></div><div className="float-card card-top"><Boxes size={18}/> تطبيقات ومشاريع</div><div className="float-card card-bottom"><ArrowDownToLine size={18}/> تنزيلات رسمية</div></div>
    </div></section>

    <section className="container section">
      <div className="section-heading"><div><div className="eyebrow">كتالوج المنصة</div><h2>اكتشف التطبيقات</h2><p>المشاريع المسجلة في الكتالوج. قد تكون بعض البطاقات قيد التطوير.</p></div><Link className="text-link" href="/apps">عرض الكل <ArrowLeft size={16}/></Link></div>
      <div className="app-grid">{featured.map(app => <article className="app-card" key={app.slug}><div className="app-icon">{app.name.en.slice(0,1)}</div><div className="app-card-body"><div className="app-title-row"><h3>{appName(app)}</h3><span className={`status ${app.status}`}>{statusLabels[app.status]}</span></div><p>{appSummary(app)}</p><div className="app-card-bottom"><span className="cat-tag"><FolderOpen size={13} aria-hidden/> {categoryLabel(app.category)}</span><Link href={`/apps/${app.slug}`}>التفاصيل <ArrowLeft size={14}/></Link></div></div></article>)}</div>
    </section>

    <section className="container stats-band" aria-label="إحصاءات الكتالوج الحقيقية">
      <div className="stat"><b>{catalogStats.total}</b><span>مشاريع مسجلة</span></div>
      <div className="stat"><b>{catalogStats.categories}</b><span>فئات تقنية</span></div>
      <div className="stat"><b>{catalogStats.inDevelopment}</b><span>قيد التطوير النشط</span></div>
      <div className="stat"><b>{catalogStats.released}</b><span>إصدارات منشورة</span></div>
    </section>

    <section className="container section">
      <div className="section-heading"><div><div className="eyebrow">استعرض حسب الاهتمام</div><h2>فئات الكتالوج</h2><p>انتقل مباشرة إلى المشاريع في مجالك.</p></div></div>
      <div className="category-grid">
        {categories.map(cat => (
          <Link key={cat.id} className="category-card" href={`/apps?cat=${cat.id}`}>
            <FolderOpen size={20} aria-hidden/>
            <div><b>{cat.label}</b><small>{cat.count === 1 ? "مشروع واحد" : `${cat.count} مشاريع`}</small></div>
            <ArrowLeft size={16} className="cat-arrow" aria-hidden/>
          </Link>
        ))}
      </div>
    </section>

    <section className="feature-band"><div className="container feature-grid"><div><div className="eyebrow">مصمم للمطورين والمستخدمين</div><h2>من صفحة المشروع إلى الإصدار الرسمي</h2><p>صفحات تفاصيل، سجل تحديثات، متطلبات تشغيل، توثيق، دعم، وروابط موثوقة دون اختلاق أرقام تنزيل أو روابط غير مؤكدة.</p></div><div className="feature-list"><div><ShieldCheck/><span><b>مصدر موثوق</b><small>روابط إصدار مرتبطة بمصدرها</small></span></div><div><BookOpen/><span><b>معلومات واضحة</b><small>الحالة والإصدار والمتطلبات</small></span></div><div><Search/><span><b>بحث وتصنيف</b><small>اعثر على المشروع المناسب</small></span></div></div></div></section>
  </main>;
}
