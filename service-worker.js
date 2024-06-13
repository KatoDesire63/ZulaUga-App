const cacheName = 'zulauga-app-v1';
const assets = [
    '/',
    '/index.html',
    '/attractions.html',
    '/gallery.html',
    '/booking.html',
    '/styles.css',
    '/scripts.js',
    '/images'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(assets);
            })
            .catch(error => {
                console.error('Failed to cache assets', error);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [cacheName];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (!cacheWhitelist.includes(cache)) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});