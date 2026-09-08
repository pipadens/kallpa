
const CACHE_NAME = 'kallpa-cache-v4';
const urlsToCache = [
  '/kallpa/',
  '/kallpa/index.html',
  '/kallpa/style.css',
  '/kallpa/app.js',
  '/kallpa/imagen.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});