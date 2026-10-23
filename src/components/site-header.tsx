import Link from "next/link";
export function SiteHeader() {
  return <header className="header"><div className="container nav">
    <Link className="brand" href="/" aria-label="CTO-DRS الرئيسية"><span className="brand-mark">D</span><span><b>CTO-DRS</b><small>APPS & PROJECTS</small></span></Link>
    <nav aria-label="التنقل الرئيسي"><Link href="/">الرئيسية</Link><Link href="/apps">التطبيقات</Link><Link href="/projects">المشاريع</Link><Link href="/docs">التوثيق</Link><Link href="/support">الدعم</Link></nav>
    <a className="nav-cta" href="https://github.com/CTO-DRS" target="_blank" rel="noreferrer">GitHub ↗</a>
  </div></header>;
}
