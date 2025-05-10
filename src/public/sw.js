const CACHE_NAME = "pwa-cache-v1";
const IMAGE_CACHE = "pwa-image-cache-v1";

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
            .filter((key) => key !== CACHE_NAME && key !== IMAGE_CACHE)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
  const req = evt.request;
  const url = new URL(req.url);

  if (req.mode === "navigate") {
    evt.respondWith(fetch(req).catch(() => caches.match("/offline.html")));
    return;
  }

  if (ASSETS.includes(url.pathname)) {
    evt.respondWith(caches.match(req).then((cached) => cached || fetch(req)));
    return;
  }

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
        .catch(() => caches.match("/offline.html"))
    );
    return;
  }

  if (req.destination === "image") {
    evt.respondWith(
      caches.open(IMAGE_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req).then((res) => {
            if (res && res.status === 200) {
              cache.put(req, res.clone());
            }
            return res;
          });
        })
      )
    );
    return;
  }
});

self.addEventListener("push", (event) => {
  let data = { title: "Story Dicoding", options: {} };
  if (event.data) data = event.data.json();
  event.waitUntil(self.registration.showNotification(data.title, data.options));
});
