import Link from "next/link";
import {
  Sparkles, ShieldCheck, Download, Headphones, RefreshCw, ArrowLeft,
  Crown, Mail, Star, Users, Shield, LayoutGrid, Github,
} from "lucide-react";
import { apps, site } from "@/lib/catalog";
import { openSourceCount } from "@/lib/github";
import { HeroPhones } from "@/components/hero-phones";
import { HomeAppsSection } from "@/components/home-apps-section";

const STAT_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  shield: Shield,
  users: Users,
  star: Star,
  download: Download,
};

const HERO_FEATURES = [
  { icon: ShieldCheck, label: "أمن وموثوق" },
  { icon: Download, label: "تحميل مباشر" },
  { icon: Headphones, label: "دعم فني" },
  { icon: RefreshCw, label: "تحديثات مستمرة" },
];

export default function HomePage() {
  const { cto } = site;
  const ossCount = openSourceCount(apps);

  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="hero-v2">
        <div className="container hero-v2-grid">
          <div className="hero-v2-copy">
            <p className="welcome-line">
              <Sparkles size={16} aria-hidden className="sparkle" /> مرحبًا بك في
            </p>
            <h1 className="hero-v2-title">
              منصة تطبيقاتي <span className="brand-grad">DRS</span>
            </h1>
            <p className="hero-v2-sub">
              <b>جميع تطبيقاتك في مكان واحد ..</b>
              <br />
              تصميم مركّز على تفاصيل كل تطبيق، وتطبيقات احترافية مصممة بعناية، من أجل تجربة أفضل.
            </p>
            <ul className="hero-feats">
              {HERO_FEATURES.map(f => (
                <li key={f.label}>
                  <f.icon size={19} aria-hidden />
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
            <div className="hero-v2-actions">
              <Link className="btn-grad" href="/apps">
                تحميل التطبيقات <ArrowLeft size={17} aria-hidden />
              </Link>
              <Link className="btn-dark" href="/support">تعرف على الفريق</Link>
            </div>
          </div>

          <HeroPhones />

          <aside className="cto-card" aria-label="بطاقة مسؤول التقنية">
            <span className="cto-crown"><Crown size={26} aria-hidden /></span>
            <b className="cto-name">DRS</b>
            <span className="cto-role">{cto.role}</span>
            <p className="cto-bio">{cto.bio}</p>
            <p className="cto-signature">{cto.name}</p>
            <span className="cto-brand">CTO-DRS</span>
            <a className="cto-mail" href={`mailto:${cto.email}`}>
              <Mail size={13} aria-hidden /> {cto.email}
            </a>
          </aside>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section className="container" aria-label="أرقام المنصة">
        <div className="stats-bar">
          {site.stats.map(s => {
            const IconComp = STAT_ICONS[s.icon] || Star;
            return (
              <div className="stat-cell" key={s.label}>
                <span className="stat-chip"><IconComp size={17} /></span>
                <div className="stat-text">
                  <b>{s.value}</b>
                  <span>{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== Apps ===== */}
      <section className="container" id="apps">
        <HomeAppsSection apps={apps} />
      </section>

      {/* ===== CTA band ===== */}
      <section className="container">
        <div className="cta-band">
          <div className="cta-art" aria-hidden>
            <div className="cta-mini-phone" />
            <div className="cta-mini-phone small" />
          </div>
          <div className="cta-copy">
            <h2>كل تطبيقاتي .. في مكان واحد</h2>
            <p>خطوات، رؤية، واستعداد لتجربة فريدة.</p>
            <Link className="btn-grad sm" href="/apps">
              استكشف جميع التطبيقات <ArrowLeft size={15} aria-hidden />
            </Link>
          </div>
          <aside className="gh-card">
            <span className="gh-globe"><Github size={22} aria-hidden /></span>
            <b>تابعنا على GitHub</b>
            <p>الإصدارات والمستودعات مفتوحة للجميع.</p>
            {ossCount > 0 && <span className="gh-count"><b>{ossCount}</b> من تطبيقات الكتالوج مفتوحة المصدر</span>}
            <a className="gh-btn" href="https://github.com/CTO-DRS" target="_blank" rel="noreferrer">
              زيارة الحساب <span aria-hidden>↗</span>
            </a>
          </aside>
        </div>
      </section>
    </main>
  );
}
