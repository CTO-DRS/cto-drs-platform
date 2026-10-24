"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;            // مثل "+50K" أو "20" أو "100%"
  className?: string;
  duration?: number;        // مدة العد بالمللي ثانية
};

/** يفكك قيمة إحصائية إلى (بادئة، رقم، لاحقة) — يرجع null إن لم يوجد رقم */
function parseStat(value: string): { prefix: string; target: number; suffix: string } | null {
  const match = value.match(/^([^\d.,-]*)([\d.,]+)\s*(.*)$/);
  if (!match) return null;
  const numeric = parseFloat(match[2].replace(/,/g, ""));
  if (!Number.isFinite(numeric)) return null;
  return { prefix: match[1], target: numeric, suffix: match[3] };
}

function format(n: number, suffix: string): string {
  if (suffix.toUpperCase().startsWith("K")) return `${n >= 100 ? Math.round(n) : n.toFixed(1).replace(/\.0$/, "")}K`;
  if (suffix.toUpperCase().startsWith("M")) return `${n.toFixed(1).replace(/\.0$/, "")}M`;
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/** عدّاد رقمي متحرك يبدأ عند ظهوره في الشاشة — يحترم تقليل الحركة */
export function AnimatedCounter({ value, className, duration = 1300 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string | null>(null);
  const parsed = parseStat(value);

  useEffect(() => {
    if (!parsed || !ref.current) return;
    const node = ref.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let observer: IntersectionObserver | null = null;

    const finish = () => setDisplay(format(parsed.target, parsed.suffix));

    if (reduced || typeof IntersectionObserver === "undefined") {
      raf = requestAnimationFrame(finish); // بدون حركة: القيمة النهائية مباشرة
      return () => cancelAnimationFrame(raf);
    }

    observer = new IntersectionObserver(
      entries => {
        if (!entries.some(e => e.isIntersecting)) return;
        observer?.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3); // تباطؤ ناعم في النهاية
          if (t < 1) {
            setDisplay(format(parsed.target * eased, parsed.suffix));
            raf = requestAnimationFrame(tick);
          } else {
            finish();
          }
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [parsed, value, duration]);

  if (!parsed) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className}>
      {parsed.prefix}
      {display ?? "0"}
      {parsed.suffix}
    </span>
  );
}
