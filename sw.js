/**
 * Dada Milktea - Service Worker (Offline-First Cache)
 * Hỗ trợ chơi game 100% ngoại tuyến (offline) & Tối ưu hóa PWA
 */

const CACHE_NAME = 'dada-milktea-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './css/img.css',
  
  // Icons
  './favicon.ico',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',

  // Core JS Modules
  './js/main.js',
  './js/art.js',
  './js/audio.js',
  './js/backup.js',
  './js/clean.js',
  './js/cloud.js',
  './js/data.js',
  './js/economy.js',
  './js/errors.js',
  './js/fx.js',
  './js/gift.js',
  './js/journey.js',
  './js/joyup.js',
  './js/lb.js',
  './js/native.js',
  './js/net.js',
  './js/orient.js',
  './js/progress.js',
  './js/regs.js',
  './js/reviews.js',
  './js/state.js',
  './js/story.js',
  './js/text.js',
  './js/tour.js',

  // UI Modules
  './js/ui/account.js',
  './js/ui/ach.js',
  './js/ui/auth.js',
  './js/ui/crew.js',
  './js/ui/drama.js',
  './js/ui/gift.js',
  './js/ui/journey.js',
  './js/ui/life.js',
  './js/ui/onboard.js',
  './js/ui/outer.js',
  './js/ui/prep.js',
  './js/ui/rank.js',
  './js/ui/regs.js',
  './js/ui/report.js',
  './js/ui/sell.js',
  './js/ui/shell.js',
  './js/ui/shop.js',
  './js/ui/splash.js',
  './js/ui/star.js',
  './js/ui/story.js',
  './js/ui/street.js',
  './js/ui/tour.js',

  // Images & Sprites
  './img/dada_logo.svg',
  './img/dada_mascot.svg',
  './img/cust_anh2.webp',
  './img/cust_anh3.webp',
  './img/cust_ba2.webp',
  './img/cust_boy.webp',
  './img/cust_boy2.webp',
  './img/cust_boy3.webp',
  './img/cust_chi2.webp',
  './img/cust_chi3.webp',
  './img/cust_chu2.webp',
  './img/cust_co.webp',
  './img/cust_girl.webp',
  './img/cust_girl2.webp',
  './img/cust_girl3.webp',
  './img/cust_grandma.webp',
  './img/cust_office.webp',
  './img/cust_ong.webp',
  './img/cust_uncle.webp',
  './img/cust_woman.webp',
  './img/pet_cat.webp',
  './img/pet_dog.webp',
  './img/pet_ham.webp',
  './img/staff_buoi.svg',
  './img/staff_chom.webp',
  './img/staff_hau.webp',
  './img/staff_man.webp',
  './img/staff_mit.webp',
  './img/staff_na.webp',
  './img/staff_oi.svg',
  './img/star_khang.svg',
  './img/star_meo.svg',
  './img/star_phong.svg',
  './img/star_rap.svg',
  './img/star_tra.svg',
  './img/star_vyvy.svg',

  // Audio Music BGM
  './music/carefree.mp3',
  './music/easy-lemon.mp3',
  './music/life-of-riley.mp3',
  './music/monkeys-spinning-monkeys.mp3',
  './music/merry-go.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Nạp bộ nhớ đệm tất cả tài nguyên tĩnh quan trọng
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Chiến lược Cache-First cho toàn bộ tài nguyên game cục bộ
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback về trang chủ nếu là request chuyển trang (navigation)
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
