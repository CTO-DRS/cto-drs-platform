/* نظام إشعارات مصغر متوافق مع تصميم الموقع وRTL — بلا تبعيات خارجية */

import { useSyncExternalStore } from "react";

export type ToastKind = "info" | "success" | "error";
export type ToastItem = { id: number; message: string; kind: ToastKind };

const TOAST_EVENT = "drs:toast";
let counter = 0;

export function toast(message: string, kind: ToastKind = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { id: ++counter, message, kind } }));
}

/* ===== مضيف الإشعارات (يُركب مرة واحدة في التخطيط) ===== */

let listeners: ((items: ToastItem[]) => void) | null = null;
let items: ToastItem[] = [];
const timers = new Map<number, ReturnType<typeof setTimeout>>();

function emit() {
  listeners?.(items);
}

function push(detail: { id: number; message: string; kind: ToastKind }) {
  items = [...items.slice(-2), detail]; // 3 إشعارات كحد أقصى ظاهرة
  emit();
  const t = setTimeout(() => dismiss(detail.id), 3200);
  timers.set(detail.id, t);
}

function dismiss(id: number) {
  const t = timers.get(id);
  if (t) clearTimeout(t);
  timers.delete(id);
  items = items.filter(i => i.id !== id);
  emit();
}

function subscribe(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(TOAST_EVENT, handler);
  listeners = handler;
  return () => {
    window.removeEventListener(TOAST_EVENT, handler);
    if (listeners === handler) listeners = null;
  };
}

function getSnapshot(): ToastItem[] {
  return items;
}

const EMPTY: ToastItem[] = [];

export function useToasts(): { items: ToastItem[]; dismiss: (id: number) => void } {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  return { items: snapshot, dismiss };
}
