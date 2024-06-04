const cacheName  'zulauga-app-v1';
const assets = [
	'/',
	'/index.html',
	'/attractions.html',
	'/gallery.html',
	'/book-now.html',
	'/css/styles.css',
	'/js/scripts.js',
	'/images',
];

self.addEventListener('install', event => {
	event.waitUnit(
		caches.open(cacheName)
		.then(cache => {
			return cache.addAll(assets);
		})
    );
});

self.addEventListener('fetch',event => {
	event.respondWith(
		caches.match(event.request)
		.then(response => {
			return response || fetch(event.request);
		})
	);
});