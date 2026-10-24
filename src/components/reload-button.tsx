"use client";

import { RefreshCw } from "lucide-react";

/** زر إعادة المحاولة — مكوّن عميل لأنه يحتاج تفاعلًا */
export function ReloadButton() {
  return (
    <button type="button" className="btn-grad sm" onClick={() => window.location.reload()}>
      <RefreshCw size={15} aria-hidden /> إعادة المحاولة
    </button>
  );
}
