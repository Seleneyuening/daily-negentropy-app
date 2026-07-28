const CACHE_NAME = 'selene-editorial-v8';
const APP_SHELL = [
  './',
  './index.html',
  './style.css?v=archive1',
  './selene-garden.css?v=light6',
  './magazine-editorial.css?v=editorial8',
  './app.js?v=light6',
  './manifest.webmanifest',
  './assets/archive-paper.jpg',
  './assets/archive-journal.jpg',
  './assets/archive-tulips.jpg',
  './assets/archive-window.jpg',
  './assets/selene-garden-morning.jpg',
  './assets/selene-sunset-portrait.jpg',
  './assets/editorial-hero-portrait.png',
  './assets/editorial-evening.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    }))
  );
});
