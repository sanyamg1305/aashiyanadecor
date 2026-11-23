/* ==========================================================================
   AASHIYANA DECOR - SERVICE WORKER
   PWA offline caching for core pages and assets
   ========================================================================== */

const CACHE_NAME = 'aashiyana-cache-v1';
const CORE_PRECACHE = [
  '/',
  '/css/style.css',
  '/js/main.js',
  '/logo.svg',
  '/stone-tile-calculator-jaipur',
  '/sitemap'
];

/* Install: Pre-cache essential offline shell assets */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_PRECACHE);
    }).then(() => self.skipWaiting())
  );
});

/* Activate: Clean up any old caches */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

/* Fetch: Network-first for HTML pages with cache fallback; Cache-first for static assets */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests or external analytics/third-party domains
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Skip Vercel analytics endpoint
  if (url.pathname.startsWith('/_vercel/')) {
    return;
  }

  // HTML Navigation: Network first, fall back to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // Static Assets (CSS, JS, Fonts, Images): Cache first, fall back to network
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
  }
});
