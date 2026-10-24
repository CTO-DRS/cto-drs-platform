"use client";

import { useState } from "react";

/** أيقونة التطبيق: صورة حقيقية من APK/المستودع إن توفرت، وإلا الحرف الأول بخلفية متدرجة.
 *  صورة مكسورة (مثلًا 404) تخفى تلقائيًا فيظهر الحرف بدلها. */
export function AppGlyph({
  appIcon,
  letter,
  className,
  imgClassName,
}: {
  appIcon?: string | null;
  letter: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (appIcon && !failed) {
    return (
      <img
        src={appIcon}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={() => setFailed(true)}
        className={`app-glyph-img ${imgClassName ?? ""}`}
      />
    );
  }
  return <b aria-hidden>{letter}</b>;
}
