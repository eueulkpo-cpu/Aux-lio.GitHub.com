const CACHE_NAME = 'sielzada-engine-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(['/', '/index.html', '/style.css', '/engine.js', '/main.js']);
        })
    );
});

// Mantém a engine rápida mesmo se a internet oscilar
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((res) => res || fetch(event.request))
    );
});
