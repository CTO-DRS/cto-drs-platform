"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { toast } from "@/lib/toast";

type Props = {
  slug: string;
  name: string;
  variant?: "card" | "detail";
};

/** زر قلب المفضلة — يعمل محليًا على جهاز المستخدم دون تسجيل */
export function FavoriteButton({ slug, name, variant = "card" }: Props) {
  const { has, toggle, ready } = useFavorites();
  const active = ready && has(slug);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const now = toggle(slug);
    toast(now ? `أُضيف «${name}» إلى المفضلة` : `أُزيل «${name}» من المفضلة`, now ? "success" : "info");
  }

  return (
    <button
      type="button"
      className={`fav-btn ${variant} ${active ? "active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? `إزالة ${name} من المفضلة` : `إضافة ${name} إلى المفضلة`}
      title={active ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
    >
      <Heart size={variant === "detail" ? 17 : 15} aria-hidden />
    </button>
  );
}
