const CACHE_NAME = "pwa-cache-v1";
const IMAGE_CACHE = "pwa-image-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/favicon.png",
  // static icons
  "/icons/icon_1746498619.png",
  "/icons/icon_1746498670_512x512.png"
];

// Install: cache static assets and offline page
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
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
      .then(() => self.clients.claim())
  );
});

// Fetch: handle navigation, static, assets/, images, and fallback
self.addEventListener("fetch", (evt) => {
  const req = evt.request;
  const url = new URL(req.url);

  // 1) Navigation requests → network first, fallback to offline.html
  if (req.mode === "navigate") {
    evt.respondWith(
      fetch(req)
        .then((res) => res)
        .catch(() => caches.match("/offline.html"))
    );
    return;
  }

  // 2) Static assets from STATIC_ASSETS → cache-first
  if (STATIC_ASSETS.includes(url.pathname)) {
    evt.respondWith(caches.match(req).then((cached) => cached || fetch(req)));
    return;
  }

  // 3) Built assets under /assets/ → cache-first then cache dynamic
  if (
    url.origin === self.location.origin &&
    url.pathname.startsWith("/assets/")
  ) {
    evt.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          // only cache valid responses
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // 4) API calls to same origin (e.g., /api/) → network-first, then cache
  if (url.origin === self.location.origin && url.pathname.startsWith("/api/")) {
    evt.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // 5) Images (any origin) → image-specific cache
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

  // 6) All other requests → network first, fallback to offline.html
  evt.respondWith(
    fetch(req)
      .then((res) => res)
      .catch(() => caches.match("/offline.html"))
  );
});

// Push notifications
self.addEventListener("push", (event) => {
  let data = { title: "Story Dicoding", options: {} };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: event.data.text(), options: {} };
    }
  }
  event.waitUntil(self.registration.showNotification(data.title, data.options));
});
