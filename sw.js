const CACHE_NAME = 'kallpa-cache-v1';
const assetsToCache = [
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './imagen.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(assetsToCache);
            })
    );
});

// Activación y limpieza de cachés antiguos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// Interceptación de peticiones para soporte offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});