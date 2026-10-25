import Link from "next/link";
import { Github, Languages } from "lucide-react";

/** الشريط العلوي الموحد لصفحات النسخة الإنجليزية: هوية مختصرة + تبديل للعربية + GitHub */
export function EnTopbar({ arHref = "/" }: { arHref?: string }) {
  return (
    <div className="en-topbar">
      <span className="en-brand">
        <span className="brand-grad">DRS</span> APPS &amp; MORE
      </span>
      <div className="en-top-actions">
        <Link href={arHref} className="gh-btn" lang="ar" dir="rtl">
          <Languages size={14} aria-hidden /> العربية
        </Link>
        <a className="gh-btn" href="https://github.com/CTO-DRS" target="_blank" rel="noreferrer">
          <Github size={14} aria-hidden /> GitHub <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  );
}

/** تذييل النسخة الإنجليزية: حقوق + رابط النسخة العربية الكاملة */
export function EnFooterNote() {
  return (
    <div className="en-footer-note">
      <span>© {new Date().getFullYear()} DRS — CTO.DRS. All rights reserved.</span>
      <span>
        Full experience in Arabic: <Link href="/">النسخة العربية</Link>
      </span>
    </div>
  );
}
