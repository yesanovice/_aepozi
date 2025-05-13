const CACHE_NAME = 'aepozi-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.htm',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png'
  // Add other critical assets you want cached
];

// Install: Pre-cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

// Fetch: Serve from cache first, then update in background
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (event.request.url.startsWith(self.location.origin)) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse); // Fallback to cache if offline

        return cachedResponse || fetchPromise;
      })
    )
  );
});
