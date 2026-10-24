/* Service Worker لبوابة DRS — عمل بلا اتصال وتحميل أسرع
   الاستراتيجية: الشبكة أولًا للصفحات (يتحديث الموقع فورًا)،
   والتخزين أولًا للأصول الثابتة المميزة بهاش، وصفحة /offline كبديل آمن. */

const CACHE = "drs-cache-v1";
const PRECACHE = ["/offline", "/icon.svg", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE).catch(() => undefined)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // طلبات خارجية (GitHub API...) تبقى شبكة فقط
  if (url.pathname.startsWith("/_next/webpack-hmr")) return; // اتصال التطوير الحي

  /* تنقل الصفحات: الشبكة أولًا ثم التخزين ثم صفحة العمل بلا اتصال */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match("/offline") || Response.error();
        })
    );
    return;
  }

  /* الأصول الثابتة (ملفات JS/CSS المميزة بهاش والأيقونات): التخزين أولًا مع تحديث بالخلفية */
  const isStatic =
    url.pathname.startsWith("/_next/static/") ||
    /\.(?:svg|png|jpg|jpeg|webp|ico|woff2?)$/.test(url.pathname);

  if (isStatic) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
            }
            return response;
          })
          .catch(() => cached || Response.error());
        return cached || network;
      })
    );
    return;
  }

  /* بقية الطلبات (بيانات RSC والـ API الداخلي): الشبكة أولًا مع بديل مخزن عند الفشل */
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && request.headers.get("accept")?.includes("text")) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || Response.error()))
  );
});
