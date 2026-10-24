import Link from "next/link";
import { Github, Youtube, Send, Heart, LayoutGrid, Compass, BarChart3 } from "lucide-react";
import { site } from "@/lib/catalog";
import { BrandLogo } from "@/components/brand-logo";

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.9 3H21l-6.8 7.8L22.2 21h-6.3l-4.9-6.1L5.4 21H2.2l7.3-8.3L2 3h6.4l4.4 5.6L17.9 3zm-1.1 16.1h1.7L7.6 4.8H5.8l11 14.3z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: <Github size={16} aria-hidden />,
  youtube: <Youtube size={17} aria-hidden />,
  x: <XIcon size={15} />,
  telegram: <Send size={16} aria-hidden />,
};

const SOCIAL_LABELS: Record<string, string> = {
  github: "GitHub",
  youtube: "YouTube",
  x: "X",
  telegram: "Telegram",
};

const EXPLORE_LINKS = [
  { href: "/apps", label: "تصفح التطبيقات" },
  { href: "/projects", label: "المشاريع المفتوحة" },
  { href: "/stats", label: "لوحة المؤشرات" },
  { href: "/blog", label: "المدونة" },
];

const PLATFORM_LINKS = [
  { href: "/support", label: "الدعم الفني" },
  { href: "/docs", label: "الوثائق" },
  { href: "/account", label: "حسابي والمفضلة" },
  { href: "/en", label: "English Version" },
];

function FooterCol({ title, icon: Icon, links }: { title: string; icon: React.ComponentType<{ size?: number }>; links: { href: string; label: string }[] }) {
  return (
    <nav className="footer-col" aria-label={title}>
      <h3>
        <Icon size={14} aria-hidden /> {title}
      </h3>
      <ul>
        {links.map(l => (
          <li key={l.href}>
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <BrandLogo />
          <p className="footer-desc">
            منصة عربية تجمع تطبيقات DRS في مكان واحد — كتالوق رسمي مفتوح المصدر،
            بإحصاءات حية من GitHub وتجربة تصفح سريعة على الجوال والحاسوب.
          </p>
          <div className="footer-social" aria-label="الشبكات الاجتماعية">
            {site.social.map(s =>
              s.url ? (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer" aria-label={SOCIAL_LABELS[s.id] || s.id} title={SOCIAL_LABELS[s.id] || s.id} className="social-btn">
                  {SOCIAL_ICONS[s.id]}
                </a>
              ) : (
                <span key={s.id} className="social-btn muted" aria-hidden title="قريباً">
                  {SOCIAL_ICONS[s.id]}
                </span>
              )
            )}
          </div>
        </div>

        <FooterCol title="استكشف" icon={Compass} links={EXPLORE_LINKS} />
        <FooterCol title="المنصة" icon={LayoutGrid} links={PLATFORM_LINKS} />
      </div>

      <div className="container footer-bottom">
        <p className="footer-copy">© {year} DRS — {site.cto.name}. جميع الحقوق محفوظة</p>
        <p className="footer-tagline">
          <Heart size={13} aria-hidden /> نصنع نحو مستقبل رقمي أفضل
        </p>
        <p className="footer-oss">
          <BarChart3 size={13} aria-hidden /> مبني بـ Next.js — الكتالوق مفتوح المصدر على GitHub
        </p>
      </div>
    </footer>
  );
}
