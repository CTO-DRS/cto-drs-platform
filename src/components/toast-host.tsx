"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToasts } from "@/lib/toast";

const ICONS = {
  success: CheckCircle2,
  info: Info,
  error: XCircle,
} as const;

/** مضيف الإشعارات — يُركب مرة واحدة في التخطيط الجذري */
export function ToastHost() {
  const { items, dismiss } = useToasts();
  if (items.length === 0) return null;
  return (
    <div className="toast-host" role="status" aria-live="polite">
      {items.map(item => {
        const Icon = ICONS[item.kind];
        return (
          <div className={`toast-item ${item.kind}`} key={item.id}>
            <Icon size={16} aria-hidden />
            <span>{item.message}</span>
            <button type="button" onClick={() => dismiss(item.id)} aria-label="إغلاق الإشعار">
              <X size={13} aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
}
