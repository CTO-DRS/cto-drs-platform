import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Github, Star, GitFork, CircleDot, Code2, History, Scale, BadgeCheck } from "lucide-react";
import { apps, appName, appSummary, appDescription, validHttpUrl, categoryLabel, relatedApps, statusLabels } from "@/lib/catalog";
import { parseGithubRepo, fetchRepoStats, compactNumber, formatDateAr } from "@/lib/github";
import { ViewTracker } from "@/components/view-tracker";
import { ShareButton } from "@/components/share-button";
import { FavoriteButton } from "@/components/favorite-button";
import { BackButton } from "@/components/back-button";
import type { Metadata } from "next";

export function generateStaticParams() { return apps.map(app => ({ slug: app.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const app = apps.find(item => item.slug === slug);
  if (!app) return { title: "التطبيق" };
  return {
    title: appName(app),
    description: appSummary(app),
    openGraph: { title: `${appName(app)} | CTO-DRS`, description: appSummary(app), type: "website" },
  };
}

export default async function AppDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const app = apps.find(item => item.slug === slug); if (!app) notFound();
  const links = app.downloads.filter(link => validHttpUrl(link.url));
  const related = relatedApps(app, 3);
  /* التنقل التسلسلي داخل الكتالوق: التطبيق السابق والتالي بنفس ترتيب الملف */
  const appIndex = apps.findIndex(item => item.slug === app.slug);
  const prevApp = appIndex > 0 ? apps[appIndex - 1] : null;
  const nextApp = appIndex >= 0 && appIndex < apps.length - 1 ? apps[appIndex + 1] : null;
  const repoRef = parseGithubRepo(app.repository);
  const repoStats = repoRef ? await fetchRepoStats(repoRef) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name.ar,
    alternateName: app.name.en,
    description: appDescription(app),
    applicationCategory: categoryLabel(app.category),
    operatingSystem: app.platforms.join(", "),
    ...(app.version ? { softwareVersion: app.version } : {}),
    ...(app.releaseDate ? { datePublished: app.releaseDate } : {}),
    author: { "@type": "Organization", name: "CTO-DRS" },
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cto-drs.com";
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "التطبيقات", item: `${siteUrl}/apps` },
      { "@type": "ListItem", position: 3, name: appName(app), item: `${siteUrl}/apps/${app.slug}` },
    ],
  };

  return <main className="container page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    <ViewTracker slug={app.slug} />
    <div className="breadcrumbs-row">
      <div className="breadcrumbs"><Link href="/">الرئيسية</Link> / <Link href="/apps">التطبيقات</Link> / <span aria-current="page">{appName(app)}</span></div>
      <BackButton fallback="/apps" label="عودة للتطبيقات" />
    </div>
    <section className="detail-hero">
      <div className="app-icon large">{app.name.en.slice(0,1)}</div>
      <div className="detail-title">
        <span className={`status ${app.status}`}>{statusLabels[app.status]}</span>
        <h1>{appName(app)}</h1>
        <p>{appSummary(app)}</p>
        <div className="meta-row"><span className="cat-tag"><b>الفئة:</b> {categoryLabel(app.category)}</span><span>المنصات: {app.platforms.join("، ")}</span><span>الإصدار: {app.version || "لم يحدد بعد"}</span><span>تاريخ الإصدار: {app.releaseDate || "لم يحدد بعد"}</span>{app.verified && <span className="tag verified" title="بيانات موثقة من مستودع GitHub الرسمي"><BadgeCheck size={13} aria-hidden /> بيانات موثقة من GitHub</span>}</div>
        <div className="detail-actions">
          <ShareButton title={appName(app)} />
          <FavoriteButton slug={app.slug} name={appName(app)} variant="detail" />
        </div>
      </div>
    </section>
    <div className="detail-columns"><section className="panel"><h2>عن التطبيق</h2><p>{appDescription(app)}</p><h2>المميزات</h2>{app.features.length ? <ul>{app.features.map((f,i)=><li key={i}>{f.ar}</li>)}</ul> : <p className="muted">لم تُضف مميزات مؤكدة بعد.</p>}<h2>متطلبات التشغيل</h2>{app.requirements.length ? <ul>{app.requirements.map((r,i)=><li key={i}>{r}</li>)}</ul> : <p className="muted">لم تُحدد المتطلبات بعد.</p>}</section>
    <aside className="panel download-panel"><h2>التنزيل والروابط</h2>{links.length ? links.map((item,i)=><a className="button primary full" href={item.url} key={i} target="_blank" rel="noreferrer">{item.label.ar} ↗</a>) : <div className="empty-download"><b>لا توجد تنزيلات مؤكدة بعد</b><p>سيظهر رابط التنزيل هنا بعد نشر إصدار رسمي وإضافة رابطه في ملف الكتالوج.</p></div>}
      {repoRef && (
        <section className="gh-repo-card" aria-label="مستودع GitHub">
          <div className="gh-repo-head">
            <span className="gh-repo-icon"><Github size={19} aria-hidden /></span>
            <div className="gh-repo-title">
              <b>مفتوح المصدر على GitHub</b>
              <span dir="ltr">{repoRef.owner}/{repoRef.repo}</span>
            </div>
            <a className="gh-repo-btn" href={repoRef.url} target="_blank" rel="noreferrer">زيارة المستودع <span aria-hidden>↗</span></a>
          </div>
          {repoStats ? (
            <>
              <div className="gh-repo-stats">
                <span className="gh-stat"><Star size={14} aria-hidden /> {compactNumber(repoStats.stars)} نجمة</span>
                <span className="gh-stat"><GitFork size={14} aria-hidden /> {compactNumber(repoStats.forks)} نسخة</span>
                <span className="gh-stat"><CircleDot size={14} aria-hidden /> {compactNumber(repoStats.openIssues)} قضية مفتوحة</span>
                {repoStats.language && <span className="gh-stat"><Code2 size={14} aria-hidden /> {repoStats.language}</span>}
                {repoStats.license && repoStats.license !== "NOASSERTION" && <span className="gh-stat"><Scale size={14} aria-hidden /> {repoStats.license}</span>}
                {repoStats.pushedAt && <span className="gh-stat"><History size={14} aria-hidden /> آخر تطوير: {formatDateAr(repoStats.pushedAt)}</span>}
              </div>
              {repoStats.description && <p className="gh-repo-desc">{repoStats.description}</p>}
            </>
          ) : (
            <p className="gh-repo-desc muted">يتوفر الكود المصدري لهذا التطبيق علنًا على GitHub.</p>
          )}
        </section>
      )}
      {app.repository && !repoRef && validHttpUrl(app.repository) && <a className="button secondary full" href={app.repository} target="_blank" rel="noreferrer">المستودع البرمجي ↗</a>}
      {app.website && validHttpUrl(app.website) && <a className="button secondary full" href={app.website} target="_blank" rel="noreferrer">الموقع الرسمي ↗</a>}
      {app.privacyPolicy && validHttpUrl(app.privacyPolicy) && <a className="text-link" href={app.privacyPolicy} target="_blank" rel="noreferrer">سياسة الخصوصية</a>}
      <Link className="button secondary full report-link" href={`/support?app=${encodeURIComponent(app.name.ar)}`}>بلاغ عن مشكلة في هذا التطبيق</Link>
    </aside></div>
    <section className="panel changelog"><h2>سجل التحديثات</h2>{app.changelog.length ? app.changelog.map((item,i)=><div key={i}><b>{item.version}</b><span className="muted"> · {item.date}</span><ul>{item.notes.map((n,j)=><li key={j}>{n.ar}</li>)}</ul></div>) : <p className="muted">لا يوجد سجل تحديثات منشور بعد.</p>}</section>
    {(prevApp || nextApp) && (
      <nav className="pn-nav" aria-label="التنقل بين تطبيقات الكتالوق">
        {prevApp ? (
          <Link className="pn-card prev" href={`/apps/${prevApp.slug}`}>
            <span className="pn-dir"><ArrowRight size={14} aria-hidden /> السابق</span>
            <b>{appName(prevApp)}</b>
          </Link>
        ) : <span className="pn-card ghost" aria-hidden />}
        {nextApp ? (
          <Link className="pn-card next" href={`/apps/${nextApp.slug}`}>
            <span className="pn-dir">التالي <ArrowLeft size={14} aria-hidden /></span>
            <b>{appName(nextApp)}</b>
          </Link>
        ) : <span className="pn-card ghost" aria-hidden />}
      </nav>
    )}
    {related.length > 0 && <section className="related-section"><div className="section-heading"><div><div className="eyebrow">من الكتالوج</div><h2>تطبيقات ذات صلة</h2></div><Link className="text-link" href="/apps">عرض الكل <ArrowLeft size={16}/></Link></div><div className="app-grid">{related.map(rel => <article className="app-card compact" key={rel.slug}><div className="app-icon">{rel.name.en.slice(0,1)}</div><div className="app-card-body"><div className="app-title-row"><h3>{appName(rel)}</h3><span className={`status ${rel.status}`}>{statusLabels[rel.status]}</span></div><p>{appSummary(rel)}</p><div className="app-card-bottom"><span className="cat-tag">{categoryLabel(rel.category)}</span><Link href={`/apps/${rel.slug}`}>التفاصيل ←</Link></div></div></article>)}</div></section>}
  </main>;
}
