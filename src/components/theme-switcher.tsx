"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Monitor, Palette, Check } from "lucide-react";

const ACCENTS = [
  { id: "violet", color: "#7c5cff", label: "بنفسجي" },
  { id: "cyan", color: "#0e74a4", label: "سماوي" },
  { id: "emerald", color: "#059669", label: "زمردي" },
  { id: "amber", color: "#d97706", label: "ذهبي" },
] as const;

type Theme = "dark" | "light" | "auto";

const THEME_META: Record<Theme, { next: Theme; icon: React.ReactNode; label: string; title: string }> = {
  dark: { next: "light", icon: <Sun size={16} aria-hidden />, label: "التبديل إلى المظهر الفاتح", title: "المظهر الفاتح" },
  light: { next: "auto", icon: <Monitor size={16} aria-hidden />, label: "التبديل إلى المظهر التلقائي (حسب النظام)", title: "تلقائي حسب النظام" },
  auto: { next: "dark", icon: <Moon size={16} aria-hidden />, label: "التبديل إلى المظهر الداكن", title: "المظهر الداكن" },
};

/** مبدّل المظهر (داكن/فاتح/تلقائي حسب النظام) + لون التمييز — يُطبّق فورًا ويُحفظ محليًا بلا وميض */
export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [accent, setAccent] = useState<string>("violet");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  /* القراءة الأولية بعد التركيب — سكربت الـ boot في body طبّق القيم مسبقًا */
  useEffect(() => {
    const root = document.documentElement;
    let saved: string | null = null;
    try { saved = localStorage.getItem("drs-theme"); } catch {}
    setTheme(saved === "light" || saved === "auto" ? (saved as Theme) : "dark");
    setAccent(ACCENTS.some(a => a.id === root.dataset.accent) ? (root.dataset.accent as string) : "violet");
  }, []);

  /* في الوضع التلقائي: تتبّع تغيّر تفضيل النظام حيًّا */
  useEffect(() => {
    if (theme !== "auto" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      document.documentElement.dataset.theme = mql.matches ? "light" : "dark";
      const root = document.documentElement;
      root.classList.add("theme-anim");
      window.setTimeout(() => root.classList.remove("theme-anim"), 420);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [theme]);

  /* إغلاق قائمة الألوان بالنقر خارجها أو بـ Escape */
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  function animate() {
    const root = document.documentElement;
    root.classList.add("theme-anim");
    window.setTimeout(() => root.classList.remove("theme-anim"), 420);
  }

  function applyTheme(next: Theme) {
    setTheme(next);
    try { localStorage.setItem("drs-theme", next); } catch {}
    const systemLight = typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: light)").matches;
    document.documentElement.dataset.theme = next === "auto" ? (systemLight ? "light" : "dark") : next;
    animate();
  }

  function applyAccent(next: string) {
    setAccent(next);
    try { localStorage.setItem("drs-accent", next); } catch {}
    document.documentElement.dataset.accent = next;
    animate();
    setOpen(false);
  }

  return (
    <div className="theme-wrap" ref={wrapRef}>
      <button
        type="button"
        className="theme-btn"
        onClick={() => applyTheme(THEME_META[theme].next)}
        aria-label={THEME_META[theme].label}
        title={THEME_META[theme].title}
      >
        {THEME_META[theme].icon}
      </button>
      <button
        type="button"
        className="theme-btn"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="لون التمييز"
        title="لون التمييز"
      >
        <Palette size={16} aria-hidden />
      </button>
      {open && (
        <div className="accent-menu" role="menu" aria-label="اختيار لون التمييز">
          {ACCENTS.map(a => (
            <button
              key={a.id}
              type="button"
              role="menuitemradio"
              aria-checked={accent === a.id}
              className={`accent-opt ${accent === a.id ? "active" : ""}`}
              onClick={() => applyAccent(a.id)}
            >
              <span className="accent-dot" style={{ background: a.color }} aria-hidden />
              {a.label}
              {accent === a.id && <Check size={13} aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
