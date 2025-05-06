const CACHE_NAME = "pwa-cache-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/favicon.png",
  "/styles/styles.css",
  "/scripts/index.js",
  "/icons/icon_1746498619.png",
  "/icons/icon_1746498670_512x512.png"
];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
  const req = evt.request;
  const url = new URL(req.url);

  // 1) Navigasi (refresh/direct URL) → fallback ke offline.html saat offline
  if (req.mode === "navigate") {
    evt.respondWith(fetch(req).catch(() => caches.match("/offline.html")));
    return;
  }

  // 2) Asset statis yang sudah kita precache → cache-first
  if (ASSETS.includes(url.pathname)) {
    evt.respondWith(caches.match(req).then((cached) => cached || fetch(req)));
    return;
  }

  // 3) Dynamic caching untuk same-origin lain (JS/CSS hashed, gambar, etc.)
  if (url.origin === self.location.origin) {
    evt.respondWith(
      caches
        .match(req)
        .then((cached) => {
          if (cached) return cached;
          return fetch(req).then((res) => {
            if (!res || res.status !== 200 || res.type !== "basic") {
              return res;
            }
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
            return res;
          });
        })
        // jika semua gagal, fallback ke offline.html agar UI tidak blank
        .catch(() => caches.match("/offline.html"))
    );
  }

  // request cross-origin (API eksternal, CDN, chrome-extension) dibiarkan browser handle
});

self.addEventListener("push", (event) => {
  let data = { title: "Story Dicoding", options: {} };
  if (event.data) data = event.data.json();
  event.waitUntil(self.registration.showNotification(data.title, data.options));
});
