"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

/** زر رجوع ذكي: يعود للصفحة السابقة إن كان التنقل داخليًا، وإلا ينتقل لمسار بديل آمن. */
export function BackButton({ fallback = "/", label = "رجوع" }: { fallback?: string; label?: string }) {
  const router = useRouter();

  const goBack = () => {
    const internal =
      typeof window !== "undefined" &&
      window.history.length > 1 &&
      (document.referrer === "" || document.referrer.startsWith(window.location.origin));
    if (internal) router.back();
    else router.push(fallback);
  };

  return (
    <button type="button" className="back-chip" onClick={goBack}>
      <ArrowRight size={15} aria-hidden /> {label}
    </button>
  );
}
