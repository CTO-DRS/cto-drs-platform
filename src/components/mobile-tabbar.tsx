"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, FolderGit2, UserRound } from "lucide-react";
import { openCommandPalette } from "@/components/command-palette";

/** شريط تنقل سفلي للجوال — يظهر تحت 1024px عبر CSS، ويُخفى في صفحة /en وصفحة العمل بلا اتصال. */
export function MobileTabBar() {
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav className="mobile-tabbar" aria-label="التنقل السريع">
      <Link href="/" className={`tabbar-item ${isActive("/") ? "active" : ""}`} aria-current={isActive("/") ? "page" : undefined}>
        <span className="tabbar-icon"><Home size={19} aria-hidden /></span>
        <span className="tabbar-label">الرئيسية</span>
      </Link>
      <Link href="/apps" className={`tabbar-item ${isActive("/apps") ? "active" : ""}`} aria-current={isActive("/apps") ? "page" : undefined}>
        <span className="tabbar-icon"><LayoutGrid size={19} aria-hidden /></span>
        <span className="tabbar-label">التطبيقات</span>
      </Link>
      <button type="button" className="tabbar-item" onClick={openCommandPalette} aria-label="البحث السريع (Ctrl+K)">
        <span className="tabbar-icon tabbar-search"><Search size={19} aria-hidden /></span>
        <span className="tabbar-label">البحث</span>
      </button>
      <Link href="/projects" className={`tabbar-item ${isActive("/projects") ? "active" : ""}`} aria-current={isActive("/projects") ? "page" : undefined}>
        <span className="tabbar-icon"><FolderGit2 size={19} aria-hidden /></span>
        <span className="tabbar-label">المشاريع</span>
      </Link>
      <Link href="/account" className={`tabbar-item ${isActive("/account") ? "active" : ""}`} aria-current={isActive("/account") ? "page" : undefined}>
        <span className="tabbar-icon"><UserRound size={19} aria-hidden /></span>
        <span className="tabbar-label">حساب</span>
      </Link>
    </nav>
  );
}
