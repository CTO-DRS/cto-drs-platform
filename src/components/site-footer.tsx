import Link from "next/link";
import { Github, Youtube, Send, Heart } from "lucide-react";
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

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <BrandLogo />
        <p className="footer-copy">© {year} DRS. جميع الحقوق محفوظة</p>
        <div className="footer-social" aria-label="الشبكات الاجتماعية">
          {site.social.map(s =>
            s.url ? (
              <a key={s.id} href={s.url} target="_blank" rel="noreferrer" aria-label={s.id} className="social-btn">
                {SOCIAL_ICONS[s.id]}
              </a>
            ) : (
              <span key={s.id} className="social-btn muted" aria-hidden title="قريباً">
                {SOCIAL_ICONS[s.id]}
              </span>
            )
          )}
        </div>
        <p className="footer-tagline">
          <Heart size={13} aria-hidden /> نصنع نحو مستقبل رقمي أفضل
        </p>
        <nav className="footer-links" aria-label="روابط سريعة">
          <Link href="/projects">المشاريع</Link>
          <span aria-hidden>·</span>
          <Link href="/stats">لوحة المؤشرات</Link>
          <span aria-hidden>·</span>
          <Link href="/docs">الوثائق</Link>
          <span aria-hidden>·</span>
          <Link href="/en">English</Link>
        </nav>
      </div>
    </footer>
  );
}
