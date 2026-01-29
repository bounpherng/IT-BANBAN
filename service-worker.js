// 1. ປ່ຽນຊື່ເວີຊັ້ນທຸກຄັ້ງທີ່ມີການອັບເດດ (ສຳຄັນຫຼາຍ)
const CACHE_NAME = 'it-banban-v2.8'; 

const urlsToCache = [
  './',
  './index.html',
  './Calculator/index.html',
  './Calculator/Salary.html',
  './Calculator/Publicsector.html',
  './Calculator/Enterprise.html',
  './Calculator/Search.html'
];

// Install: ເກັບໄຟລ໌ລົງ Cache ແລະ ບັງຄັບໃຫ້ SW ໃໝ່ທຳງານທັນທີ
self.addEventListener('install', event => {
  // skipWaiting ຈະບັງຄັບໃຫ້ SW ໂຕໃໝ່ Active ທັນທີ ບໍ່ຕ້ອງຖ້າໃຫ້ປິດແອັບແລ້ວເປີດໃໝ່
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate: ລົບ Cache ເກົ່າຖິ້ມ (v2.5, v2.4...) ເພື່ອບໍ່ໃຫ້ໜັກເຄື່ອງ ແລະ ບໍ່ໃຫ້ຈື່ຄ່າເກົ່າ
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // ສັ່ງໃຫ້ SW ຄວບຄຸມທຸກໜ້າເວັບທັນທີ
  return self.clients.claim(); 
});

// Fetch: ໃຊ້ສູດ Network First (ໂຫຼດຈາກເນັດກ່ອນ -> ຖ້າເນັດຫຼຸດຄ່ອຍເອົາ Cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // ຖ້າໂຫຼດຈາກເນັດໄດ້, ໃຫ້ອັບເດດ Cache ໂຕໃໝ່ລ່າສຸດເກັບໄວ້ເລີຍ
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        return response;
      })
      .catch(() => {
        // ຖ້າເນັດຫຼຸດ ຫຼື ໂຫຼດບໍ່ໄດ້, ໃຫ້ໄປດຶງຈາກ Cache ມາສະແດງ
        return caches.match(event.request);
      })
  );
});

