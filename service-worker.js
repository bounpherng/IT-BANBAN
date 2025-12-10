const CACHE_NAME = 'it-banban-v1';
const urlsToCache = [
  './',
  './index.html',
  './Calculator/index.html',
  './Calculator/Salary.html',
  './Calculator/Publicsector.html',
  './Calculator/Enterprise.html',
  './Calculator/Search.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});