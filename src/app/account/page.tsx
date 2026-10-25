import type { Metadata } from "next";
import Link from "next/link";
import { UserRound, Github, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { apps, site, appName } from "@/lib/catalog";
import { fetchCatalogRepoStats, fetchRecentReleasesFeed, parseGithubRepo } from "@/lib/github";
import { FavoritesSection } from "@/components/favorites-section";
import { ReleaseAlerts, type ReleaseWatchApp } from "@/components/release-alerts";
import { NotifyLog } from "@/components/notify-log";
import { BackButton } from "@/components/back-button";

export const metadata: Metadata = {
  title: "الحساب",
  description: "بوابة حسابات منصة DRS — مفضلتك وإشعارات الإصدارات وسجل التنبيهات، كلها محفوظة على جهازك.",
};

export default async function AccountPage() {
  const { cto } = site;

  /* بيانات الإصدارات الحية لكل التطبيقات (تُحدّث كل ساعة) + أحدث ملاحظات إصدار لكل مستودع،
     كي يتضمن إشعار المتصفح مقتطفًا من ملاحظات الإصدار الجديد. */
  const repoRefs = apps
    .map(a => parseGithubRepo(a.repository))
    .filter((r): r is NonNullable<typeof r> => r !== null);
  const [statsMap, feed] = await Promise.all([
    fetchCatalogRepoStats(apps),
    fetchRecentReleasesFeed(repoRefs, 1, 20),
  ]);

  /* أحدث ملاحظات لكل تطبيق (من إصداره الأحدث) — تُطابق بالوسم عبر latestTag داخل المكوّن */
  const notesBySlug = new Map<string, string | null>();
  for (const a of apps) {
    const ref = parseGithubRepo(a.repository);
    if (!ref) continue;
    const rel = feed.find(r => r.repo === ref.repo);
    notesBySlug.set(a.slug, rel?.notes ?? null);
  }

  const watchApps: ReleaseWatchApp[] = apps.map(a => ({
    slug: a.slug,
    name: appName(a),
    latestTag: statsMap[a.slug]?.latestTag ?? null,
    releasedAt: statsMap[a.slug]?.releasedAt ?? null,
    notes: notesBySlug.get(a.slug) ?? null,
  }));

  return (
    <main className="container page narrow">
      <BackButton fallback="/" label="رجوع" />
      <div className="page-intro">
        <div className="eyebrow">مساحتك الخاصة</div>
        <h1>حسابي</h1>
        <p>بوابة موحدة لمتابعة تطبيقاتك المفضلة وإشعارات إصداراتها — بلا تسجيل، وكل بياناتك على جهازك فقط.</p>
      </div>
      <FavoritesSection />
      <ReleaseAlerts apps={watchApps} />
      <NotifyLog />
      <section className="panel account-card">
        <span className="account-avatar"><UserRound size={30} aria-hidden /></span>
        <h2>بوابة الحسابات قيد الإعداد</h2>
        <p>نجهّز حاليًا نظام حسابات آمنًا يتيح متابعة تطبيقاتك المفضلة وسجل تحديثاتها. لا تشارك بياناتك مع أي جهة باسم المنصة قبل إعلان الإطلاق رسميًا من هذه الصفحة.</p>
        <ul className="account-points">
          <li><ShieldCheck size={15} aria-hidden /> ستُبنى بوابة الحسابات على معايير خصوصية صارمة.</li>
          <li><Sparkles size={15} aria-hidden /> مزامنة المفضلة والإشعارات عند توفر الإصدارات.</li>
        </ul>
        <div className="blog-links">
          <a className="btn-grad sm" href="https://github.com/CTO-DRS" target="_blank" rel="noreferrer">
            <Github size={15} aria-hidden /> تابع التطوير على GitHub
          </a>
          <Link className="btn-dark sm" href="/support">
            <Mail size={15} aria-hidden /> تواصل مع الدعم
          </Link>
        </div>
        <p className="account-cta-note">للاستفسار المباشر: <a href={`mailto:${cto.email}`}>{cto.email}</a></p>
      </section>
    </main>
  );
}
