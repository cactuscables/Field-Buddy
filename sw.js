// Service Worker for Tech Portal PWA
// This file makes the app work offline by caching resources

const CACHE_NAME = 'tech-portal-v2';

// Files to cache for offline use
const ASSETS_TO_CACHE = [
  '/',
  '/index.html'
];

// When the service worker is first installed, cache our app files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Activate immediately instead of waiting
  self.skipWaiting();
});

// When activated, clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Intercept network requests — serve from cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Try network first, fall back to cache
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for future offline use
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Network failed — try serving from cache
        return caches.match(event.request);
      })
  );
});
