"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, LayoutGrid, Newspaper, Headphones, UserRound, Search, Globe, ChevronDown, Menu, X, Check,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const NAV = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/apps", label: "التطبيقات", icon: LayoutGrid },
  { href: "/blog", label: "المدونة", icon: Newspaper },
  { href: "/support", label: "الدعم", icon: Headphones },
  { href: "/account", label: "حساب", icon: UserRound },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/apps?q=${encodeURIComponent(q)}` : "/apps");
    setMenuOpen(false);
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="site-header">
      <div className="container site-nav">
        <BrandLogo />

        <nav className="main-nav" aria-label="التنقل الرئيسي">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`nav-link ${isActive(item.href) ? "active" : ""}`}>
              <item.icon size={15} aria-hidden /> {item.label}
              {isActive(item.href) && <span className="nav-underline" aria-hidden />}
            </Link>
          ))}
        </nav>

        <form className="nav-search" role="search" onSubmit={submitSearch}>
          <Search size={15} aria-hidden className="nav-search-icon" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ابحث عن تطبيقاتك المفضلة…"
            aria-label="ابحث في الموقع"
          />
        </form>

        <div className="nav-end">
          <div className="lang-wrap">
            <button type="button" className="lang-pill" onClick={() => setLangOpen(v => !v)} aria-expanded={langOpen} aria-haspopup="listbox" title="English version: /en">
              <Globe size={14} aria-hidden /> AR <ChevronDown size={13} aria-hidden />
            </button>
            {langOpen && (
              <div className="lang-menu" role="listbox" aria-label="اختيار اللغة">
                <button type="button" className="lang-opt active" role="option" aria-selected="true" onClick={() => setLangOpen(false)}>
                  العربية (AR) <Check size={14} aria-hidden />
                </button>
                <button type="button" className="lang-opt" role="option" aria-selected="false" onClick={() => { setLangOpen(false); router.push("/en"); }} title="English">
                  English (EN) <small>جديد</small>
                </button>
              </div>
            )}
          </div>
          <button type="button" className="nav-burger" onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen} aria-label="القائمة">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`mobile-link ${isActive(item.href) ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
              <item.icon size={16} aria-hidden /> {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
