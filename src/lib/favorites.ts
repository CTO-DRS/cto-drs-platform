/* مخزن المفضلة والمشاهدة الأخيرة — يعمل بالكامل على جهاز المستخدم (localStorage)
   بدون أي خادم أو تتبع، مع مزامنة فورية بين المكونات وعبر تبويبات المتصفح.
   يعتمد useSyncExternalStore لمطابقة React 19 وقواعد الـ lint الصارمة. */

import { useCallback, useSyncExternalStore } from "react";

const FAV_KEY = "drs:favorites";
const RECENT_KEY = "drs:recent";
export const FAV_EVENT = "drs:favorites-changed";
export const RECENT_EVENT = "drs:recent-changed";
const RECENT_LIMIT = 8;

/* ===== طبقة القراءة مع ذاكرة مرجعية ثابتة (شرط useSyncExternalStore) ===== */

function readList(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

let favSnapshot: string[] = [];
let recentSnapshot: string[] = [];
let initialized = false;

function refreshSnapshots() {
  favSnapshot = readList(FAV_KEY);
  recentSnapshot = readList(RECENT_KEY);
  initialized = true;
}

function getFavSnapshot(): string[] {
  if (!initialized) refreshSnapshots();
  return favSnapshot;
}

function getRecentSnapshot(): string[] {
  if (!initialized) refreshSnapshots();
  return recentSnapshot;
}

function subscribe(callback: () => void): () => void {
  const handler = () => {
    refreshSnapshots();
    callback();
  };
  window.addEventListener(FAV_EVENT, handler);
  window.addEventListener(RECENT_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(FAV_EVENT, handler);
    window.removeEventListener(RECENT_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

function writeKey(key: string, value: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* التخزين ممتلئ أو محجوب — نتجاهل بأمان */
  }
  if (key === FAV_KEY) favSnapshot = value;
  else recentSnapshot = value;
  window.dispatchEvent(new CustomEvent(key === FAV_KEY ? FAV_EVENT : RECENT_EVENT));
}

/* ===== المفضلة ===== */

export function getFavorites(): string[] {
  return getFavSnapshot();
}

/** يبدّل حالة مفضلة تطبيق ويعيد الحالة الجديدة (true = أصبح مفضلاً) */
export function toggleFavorite(slug: string): boolean {
  const current = getFavSnapshot();
  const next = current.includes(slug) ? current.filter(s => s !== slug) : [slug, ...current];
  writeKey(FAV_KEY, next);
  return next.includes(slug);
}

const serverFavorites: string[] = [];
const serverReady = () => false;
const clientReady = () => true;

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getFavSnapshot, () => serverFavorites);
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);

  const toggle = useCallback((slug: string) => toggleFavorite(slug), []);
  const has = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  return { favorites, ready, toggle, has };
}

/* ===== المشاهد حديثًا ===== */

export function getRecentlyViewed(): string[] {
  return getRecentSnapshot();
}

/** يسجل تطبيقًا كمشاهد حديثًا (الأحدث أولًا، بلا تكرار، بحد 8 عناصر) */
export function pushRecentlyViewed(slug: string) {
  const current = getRecentSnapshot().filter(s => s !== slug);
  writeKey(RECENT_KEY, [slug, ...current].slice(0, RECENT_LIMIT));
}

const serverRecent: string[] = [];

export function useRecentlyViewed() {
  const recent = useSyncExternalStore(subscribe, getRecentSnapshot, () => serverRecent);
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  return { recent, ready };
}
