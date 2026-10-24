"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/lib/toast";

type Props = { title: string; variant?: "detail" | "mini" };

const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

/** زر مشاركة: يستخدم المشاركة الأصلية للجهاز عند توفرها وإلا ينسخ الرابط */
export function ShareButton({ title, variant = "detail" }: Props) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        return; // ألغى المستخدم المشاركة
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast("نُسخ رابط الصفحة إلى الحافظة", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("تعذر نسخ الرابط — انسخه من شريط العنوان", "error");
    }
  }

  return (
    <button type="button" className={`share-btn ${variant} ${copied ? "copied" : ""}`} onClick={share}
      aria-label={`مشاركة ${title}`} title={canNativeShare ? "مشاركة" : "نسخ الرابط"}>
      {copied ? <Check size={16} aria-hidden /> : <Share2 size={16} aria-hidden />}
      <span>{copied ? "تم النسخ" : "مشاركة"}</span>
    </button>
  );
}
