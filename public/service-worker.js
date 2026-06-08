// service-worker.js - PWA с оффлайн-доступом (без ошибок CORS)

const CACHE_NAME = 'pwa-cache-v3';
const OFFLINE_URL = '/offline.html';

// Ресурсы для кэширования при установке
const urlsToCache = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/src/main.jsx',
  '/src/index.css',
  '/images/Group.svg'
];

// Функция проверки - нужно ли обрабатывать запрос
function shouldHandleRequest(request) {
  const url = new URL(request.url);
  
  // Пропускаем запросы от самого SW
  if (request.headers.get('X-SW-Fetch') === 'true') {
    return false;
  }
  
  // Пропускаем не-GET запросы
  if (request.method !== 'GET') {
    return false;
  }
  
  // Пропускаем запросы к API серверу (json-server)
  if (url.port === '3001' || url.hostname.includes('localhost') && url.port === '3001') {
    return false;
  }
  
  // Пропускаем запросы к сторонним ресурсам (Google Fonts, FontAwesome, и т.д.)
  if (url.hostname !== self.location.hostname) {
    return false;
  }
  
  // Пропускаем запросы с режимом no-cors (обычно это сторонние ресурсы)
  if (request.mode === 'no-cors') {
    return false;
  }
  
  return true;
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      try {
        await cache.addAll(urlsToCache);
      } catch (e) {
        console.log('Некоторые ресурсы не закэшированы:', e);
      }
      await cache.add(OFFLINE_URL);
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаляем старый кэш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  
  // Проверяем, нужно ли обрабатывать этот запрос
  if (!shouldHandleRequest(request)) {
    return; // Пропускаем запрос, SW не вмешивается
  }
  
  // Для навигационных запросов (страницы) — стратегия "сначала сеть, потом кэш"
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }
  
  // Для статических ресурсов — стратегия "кэш с обновлением"
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      const fetchRequest = new Request(request, {
        headers: new Headers({
          'X-SW-Fetch': 'true'
        })
      });
      
      const fetchPromise = fetch(fetchRequest)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return cachedResponse;
        });
      
      return cachedResponse || fetchPromise;
    })
  );
});