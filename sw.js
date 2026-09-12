const CACHE_NAME = 'roleta-mix-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './js/roleta.js',
  './assets/icons/presente.png',
  './assets/icons/cupom.png',
  './assets/icons/caneta.png',
  './assets/icons/sacola.png',
  './assets/icons/gire.png',
  './assets/icons/casa.png',
  './assets/icons/camera.png',
  './assets/icons/porcentagem.png'
];

// Instalação do Service Worker e gravação do cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepta requisições e serve do cache se offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});