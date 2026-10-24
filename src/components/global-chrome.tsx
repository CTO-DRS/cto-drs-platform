"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { ToastHost } from "@/components/toast-host";

/** عناصر واجهة عامة: شريط تقدم القراءة أعلى الصفحة + زر العودة للأعلى + الإشعارات */
export function GlobalChrome() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(value);
      setShowTop(window.scrollY > 640);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden>
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      {showTop && (
        <button
          type="button"
          className="back-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="العودة إلى أعلى الصفحة"
          title="العودة للأعلى"
        >
          <ArrowUp size={18} aria-hidden />
        </button>
      )}
      <ToastHost />
    </>
  );
}
