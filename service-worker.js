// 🔹 ປ່ຽນຄ່ານີ້ທຸກເທື່ອທີ່ອັບເດດລະບົບ
const APP_VERSION = 'v2026.02.09';

// 🔹 cache name = app name + version
const CACHE_NAME = `ຄຳນວນເງີນເດືອນ-${APP_VERSION}`;

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@300;400;500;600;700&family=Phetsarath&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://html2canvas.hertzen.com/dist/html2canvas.min.js',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

// ================= INSTALL =================
self.addEventListener('install', (event) => {
    self.skipWaiting(); // ໃຫ້ version ໃໝ່ເຮັດວຽກທັນທີ
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// ================= FETCH (Cache First) =================
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// ================= ACTIVATE =================
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    // 🔥 ລົບ cache ເກົ່າທີ່ບໍ່ກົງ version
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
