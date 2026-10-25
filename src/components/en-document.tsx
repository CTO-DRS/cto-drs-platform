"use client";

import type { ReactNode } from "react";
import { useLayoutEffect } from "react";

/** يضبط <html> على (en, ltr) أثناء تواجد المستخدم في النسخة الإنجليزية،
 *  ويخفي واجهة الهيدر/الفوتر العربية عبر كلاس، ويعيد كل شيء عند المغادرة.
 *  يستخدم useLayoutEffect ليعمل قبل الرسم فلا يظهر وميض للواجهة العربية.
 *  يقبل children اختياريًا ليعمل كغلاف (Wrapper) أو عنصرًا مستقلًا <EnDocument />. */
export function EnDocument({ children }: { children?: ReactNode }) {
  useLayoutEffect(() => {
    const html = document.documentElement;
    const prevLang = html.lang;
    const prevDir = html.dir;
    html.lang = "en";
    html.dir = "ltr";
    html.classList.add("en-doc");
    return () => {
      html.lang = prevLang;
      html.dir = prevDir;
      html.classList.remove("en-doc");
    };
  }, []);
  return <>{children}</>;
}
