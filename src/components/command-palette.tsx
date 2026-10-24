"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import {
  LayoutGrid, Newspaper, FolderGit2, Headphones, FileText, UserRound, Home, Globe,
  Search, CornerDownLeft, ArrowUpDown, Heart,
} from "lucide-react";
import { apps, categoryLabel, statusLabels, normalizeSearch, appSummary } from "@/lib/catalog";
import { posts, formatDate } from "@/lib/blog";

const PAGES = [
  { href: "/", label: "الصفحة الرئيسية", icon: Home },
  { href: "/apps", label: "كتالوج التطبيقات", icon: LayoutGrid },
  { href: "/projects", label: "المشاريع المفتوحة", icon: FolderGit2 },
  { href: "/blog", label: "المدونة", icon: Newspaper },
  { href: "/docs", label: "الوثائق والأسئلة الشائعة", icon: FileText },
  { href: "/support", label: "الدعم الفني", icon: Headphones },
  { href: "/account", label: "حسابي والمفضلة", icon: UserRound },
  { href: "/en", label: "English Version", icon: Globe },
];

export const OPEN_PALETTE_EVENT = "drs:open-palette";

export function openCommandPalette() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(OPEN_PALETTE_EVENT));
}

/** لوحة أوامر البحث السريع (Ctrl+K) — تطبيقات وصفحات ومقالات في مكان واحد */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(v => !v);
      } else if (e.key === "/" && !open) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName?.toLowerCase();
        if (tag !== "input" && tag !== "textarea" && target?.isContentEditable !== true) {
          e.preventDefault();
          setOpen(true);
        }
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, [open]);

  const go = useCallback((href: string) => {
    setOpen(false);
    router.push(href);
  }, [router]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="cp-overlay" aria-hidden="true" />
        <Dialog.Content className="cp-content" aria-describedby={undefined}>
          <Dialog.Title className="cp-sr-title">البحث السريع في الموقع</Dialog.Title>
          <Command className="cp-root" loop>
            <div className="cp-input-row">
              <Search size={17} aria-hidden className="cp-input-icon" />
              <Command.Input className="cp-input" placeholder="ابحث عن تطبيق، صفحة، أو مقال…" />
              <kbd className="cp-esc">ESC</kbd>
            </div>
      <Command.List className="cp-list">
        <Command.Empty className="cp-empty">
          <Search size={22} aria-hidden />
          <b>لا توجد نتائج مطابقة</b>
          <span>جرّب كلمة أخرى مثل «مالي» أو «لوحة مفاتيح»</span>
        </Command.Empty>

        <Command.Group heading="التطبيقات" className="cp-group">
          {apps.map(app => (
            <Command.Item
              key={`app-${app.slug}`}
              value={`app ${app.slug} ${normalizeSearch(`${app.name.ar} ${app.name.en} ${app.summary.ar} ${categoryLabel(app.category)}`)}`}
              onSelect={() => go(`/apps/${app.slug}`)}
              className="cp-item"
            >
              <span className="cp-item-icon"><LayoutGrid size={14} aria-hidden /></span>
              <span className="cp-item-text"><b>{app.name.ar}</b><small>{appSummary(app).slice(0, 46)}…</small></span>
              <span className="cp-item-badge">{statusLabels[app.status]}</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="صفحات الموقع" className="cp-group">
          {PAGES.map(page => (
            <Command.Item
              key={`page-${page.href}`}
              value={`page ${normalizeSearch(page.label)} ${page.href}`}
              onSelect={() => go(page.href)}
              className="cp-item"
            >
              <span className="cp-item-icon"><page.icon size={14} aria-hidden /></span>
              <span className="cp-item-text"><b>{page.label}</b></span>
              <kbd className="cp-kbd">{page.href}</kbd>
            </Command.Item>
          ))}
          <Command.Item
            value="page favorites favorites-filter favorites-filter"
            onSelect={() => go("/apps?fav=1")}
            className="cp-item"
          >
            <span className="cp-item-icon"><Heart size={14} aria-hidden /></span>
            <span className="cp-item-text"><b>تطبيقاتي المفضلة</b></span>
            <kbd className="cp-kbd">/apps?fav=1</kbd>
          </Command.Item>
        </Command.Group>

        <Command.Group heading="من المدونة" className="cp-group">
          {posts.map(post => (
            <Command.Item
              key={`post-${post.slug}`}
              value={`post ${normalizeSearch(`${post.title.ar} ${post.excerpt.ar}`)} ${post.slug}`}
              onSelect={() => go(`/blog/${post.slug}`)}
              className="cp-item"
            >
              <span className="cp-item-icon"><Newspaper size={14} aria-hidden /></span>
              <span className="cp-item-text"><b>{post.title.ar}</b><small>{formatDate(post.date)}</small></span>
              <span className="cp-item-badge post">{post.readingMinutes} د</span>
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
      <div className="cp-footer" aria-hidden>
        <span><ArrowUpDown size={12} aria-hidden /> للتنقل</span>
        <span><CornerDownLeft size={12} aria-hidden /> للفتح</span>
        <span><kbd className="cp-kbd">Ctrl</kbd> + <kbd className="cp-kbd">K</kbd> في أي وقت</span>
      </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
