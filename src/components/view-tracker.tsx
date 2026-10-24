"use client";

import { useEffect } from "react";
import { pushRecentlyViewed } from "@/lib/favorites";

/** يسجل زيارة صفحة التطبيق في قائمة «شوهد مؤخرًا» (محليًا على جهاز المستخدم) */
export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    pushRecentlyViewed(slug);
  }, [slug]);
  return null;
}
