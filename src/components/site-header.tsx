"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, LayoutGrid, Newspaper, Headphones, UserRound, Search, Globe, ChevronDown, Menu, X, Check, Heart,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { openCommandPalette } from "@/components/command-palette";
import { useFavorites } from "@/lib/favorites";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { favorites } = useFavorites();

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

        <button
          type="button"
          className="nav-search as-button"
          onClick={openCommandPalette}
          aria-label="فتح البحث السريع (Ctrl+K)"
          aria-keyshortcuts="Control+K"
        >
          <Search size={15} aria-hidden className="nav-search-icon" />
          <span className="nav-search-placeholder">ابحث عن تطبيقاتك المفضلة…</span>
          <kbd className="nav-kbd" aria-hidden>Ctrl K</kbd>
        </button>

        <div className="nav-end">
          <Link
            href="/account#favorites"
            className={`nav-fav ${favorites.length > 0 ? "has-items" : ""}`}
            aria-label={`المفضلة${favorites.length ? ` (${favorites.length} تطبيق)` : ""}`}
            title="المفضلة"
          >
            <Heart size={16} aria-hidden />
            {favorites.length > 0 && <span className="nav-fav-badge">{favorites.length}</span>}
          </Link>
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
          <button
            type="button"
            className="mobile-link search-entry"
            onClick={() => { setMenuOpen(false); openCommandPalette(); }}
          >
            <Search size={16} aria-hidden /> البحث السريع <kbd className="nav-kbd">Ctrl K</kbd>
          </button>
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
