"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, X } from "lucide-react";
import type { Announcement } from "@/lib/catalog";

const keyOf = (id: string) => `drs-ann-dismissed-${id}`;

function firstUndismissed(items: Announcement[]): Announcement | null {
  for (const item of items) {
    try {
      if (localStorage.getItem(keyOf(item.id))) continue;
    } catch {
      // تخزين غير متاح (وضع خاص) — نعرض الإعلان دون حفظ الإغلاق
    }
    return item;
  }
  return null;
}

/** شريط إعلانات إداري — يقرأ الإعلان النشط من site-config.json ويبقى مخفيًا بعد إغلاقه */
export function AnnouncementBar({ items }: { items: Announcement[] }) {
  const [current, setCurrent] = useState<Announcement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCurrent(firstUndismissed(items));
    setMounted(true);
  }, [items]);

  if (!mounted || !current) return null;

  function dismiss() {
    if (!current) return;
    try {
      localStorage.setItem(keyOf(current.id), "1");
    } catch {
      // لا شيء — سيظهر الإعلان مجددًا في الزيارة القادمة فقط
    }
    setCurrent(null);
  }

  return (
    <div className="announce-bar" role="region" aria-label="إعلان المنصة">
      <div className="container announce-inner">
        <span className="announce-icon" aria-hidden><Megaphone size={15} /></span>
        <p className="announce-text">{current.text}</p>
        {current.href && (
          <Link className="announce-cta" href={current.href}>
            عرض <span aria-hidden>←</span>
          </Link>
        )}
        <button type="button" className="announce-close" onClick={dismiss} aria-label="إغلاق الإعلان">
          <X size={15} aria-hidden />
        </button>
      </div>
    </div>
  );
}
