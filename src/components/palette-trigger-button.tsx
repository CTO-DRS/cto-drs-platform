"use client";

import { Search } from "lucide-react";
import { openCommandPalette } from "@/components/command-palette";

/** زر فتح لوحة البحث السريع — يُستخدم في صفحة 404 وغيرها */
export function PaletteTriggerButton({ label = "بحث سريع" }: { label?: string }) {
  return (
    <button type="button" className="button secondary" onClick={openCommandPalette}
      aria-keyshortcuts="Control+K" title="فتح البحث السريع">
      <Search size={15} aria-hidden /> {label} <kbd className="nav-kbd" aria-hidden>Ctrl K</kbd>
    </button>
  );
}
