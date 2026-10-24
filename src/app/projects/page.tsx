import Link from "next/link";
import { FolderOpen, Github, Star, GitFork, CircleDot, ExternalLink, Code2, Rocket, Tag } from "lucide-react";
import { apps, appName, appSummary, categoryLabel, catalogStats, statusLabels } from "@/lib/catalog";
import { compactNumber, fetchOrgRepos, fetchLatestReleases, formatDateAr, parseGithubRepo } from "@/lib/github";
import { BackButton } from "@/components/back-button";
import { AppGlyph } from "@/components/app-glyph";

export const metadata = { title: "المشاريع", description: "تابع مشاريع CTO-DRS وحالتها وفئاتها التقنية." };

const GITHUB_OWNER = process.env.GITHUB_OWNER || "CTO-DRS";

export default async function ProjectsPage() {
  const repos = await fetchOrgRepos(GITHUB_OWNER, 12);
  const linkedRepos = apps
    .map(a => parseGithubRepo(a.repository))
    .filter((r): r is NonNullable<typeof r> => r !== null);
  const releases = await fetchLatestReleases(linkedRepos, 6);

  return (
    <main className="container page">
      <BackButton fallback="/" label="رجوع" />
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
            <div className="app-icon"><AppGlyph appIcon={app.appIcon} letter={app.name.en.slice(0, 1)} /></div>
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

      {/* ===== أحدث الإصدارات المنشورة ===== */}
      {releases.length > 0 && (
        <section className="repos-section top-margin" aria-labelledby="releases-heading">
          <div className="section-head">
            <h2 id="releases-heading">
              <Rocket size={20} aria-hidden className="head-icon" /> أحدث الإصدارات المنشورة
            </h2>
            <p>آخر إصدار رسمي من كل مستودع تطبيق مربوط بالكتالوج — مباشرة من GitHub.</p>
          </div>
          <div className="releases-grid">
            {releases.map(rel => (
              <article className="release-card" key={rel.repo}>
                <div className="release-head">
                  <span className="release-tag"><Tag size={12} aria-hidden /> {rel.tag}</span>
                  {rel.prerelease && <span className="release-pre">تجريبي</span>}
                  <a className="release-open" href={rel.url} target="_blank" rel="noreferrer" aria-label={`فتح إصدار ${rel.repo}`}>
                    <ExternalLink size={13} aria-hidden />
                  </a>
                </div>
                <b className="release-name" dir="auto">{rel.name || rel.repo}</b>
                <span className="release-repo" dir="ltr">{rel.repo}</span>
                {rel.notes && <p className="release-notes" dir="auto">{rel.notes}</p>}
                <span className="release-date">نُشر: {formatDateAr(rel.publishedAt)}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ===== المستودعات الحية من GitHub ===== */}
      <section className="repos-section top-margin" aria-labelledby="repos-heading">
        <div className="section-head">
          <h2 id="repos-heading">
            <Github size={20} aria-hidden className="head-icon" /> المستودعات المفتوحة على GitHub
          </h2>
          <p>أحدث المستودعات العامة لحساب <b dir="ltr">{GITHUB_OWNER}</b> مرتبة بتاريخ آخر تطوير — بيانات حية تُحدَّث كل ساعة.</p>
        </div>

        {repos.length > 0 ? (
          <>
            <div className="repo-grid">
              {repos.map(repo => (
                <article className="repo-card" key={repo.name}>
                  <div className="repo-card-head">
                    <span className="repo-avatar"><Github size={16} aria-hidden /></span>
                    <a className="repo-name" href={repo.url} target="_blank" rel="noreferrer" dir="ltr">{repo.name}</a>
                    <a className="repo-open" href={repo.url} target="_blank" rel="noreferrer" aria-label={`فتح ${repo.name} على GitHub`}>
                      <ExternalLink size={13} aria-hidden />
                    </a>
                  </div>
                  {repo.description && <p className="repo-desc" dir="auto">{repo.description}</p>}
                  <div className="repo-meta">
                    {repo.language && (
                      <span className="gh-stat"><Code2 size={12} aria-hidden /> {repo.language}</span>
                    )}
                    <span className="gh-stat"><Star size={12} aria-hidden /> {compactNumber(repo.stars)}</span>
                    <span className="gh-stat"><GitFork size={12} aria-hidden /> {compactNumber(repo.forks)}</span>
                    <span className="gh-stat"><CircleDot size={12} aria-hidden /> {formatDateAr(repo.pushedAt)}</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="repos-more">
              <a className="gh-btn" href={`https://github.com/${GITHUB_OWNER}?tab=repositories`} target="_blank" rel="noreferrer">
                عرض جميع المستودعات على GitHub <span aria-hidden>↗</span>
              </a>
            </div>
          </>
        ) : (
          <div className="notice">
            <b>تعذر جلب المستودعات الآن.</b> يمكنك دائمًا تصفحها مباشرة على{" "}
            <a href={`https://github.com/${GITHUB_OWNER}`} target="_blank" rel="noreferrer">github.com/{GITHUB_OWNER}</a>.
          </div>
        )}
      </section>

      <div className="notice top-margin">
        <b>للمطورين:</b> يُدار هذا الكتالوج من ملف <code>content/apps.json</code> داخل مستودع GitHub، وكل تعديل يمر بمراجعة عبر طلبات السحب.
      </div>
    </main>
  );
}
