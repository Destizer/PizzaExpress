const CACHE_NAME = 'pizzaexpress-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/menu.html',
    '/cart.html',
    '/orders.html',
    '/contacts.html',
    '/profile.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/menu.js',
    '/js/cart.js',
    '/manifest.json'
];

// Установка Service Worker
self.addEventListener('install', event => {
    console.log('[SW] Установка Service Worker');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Кэширование файлов');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', event => {
    console.log('[SW] Активация Service Worker');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Удаление старого кэша:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Перехват запросов
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Возвращаем кэшированный ответ, если он есть
                if (response) {
                    console.log('[SW] Загрузка из кэша:', event.request.url);
                    return response;
                }

                // Иначе выполняем сетевой запрос
                console.log('[SW] Загрузка из сети:', event.request.url);
                return fetch(event.request).then(response => {
                    // Проверяем валидность ответа
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Клонируем ответ
                    const responseToCache = response.clone();

                    // Кэшируем новый ответ
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                });
            })
            .catch(() => {
                // Возвращаем офлайн страницу при отсутствии сети
                return caches.match('/index.html');
            })
    );
});

// Push уведомления
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Новое уведомление от PizzaExpress',
        icon: '/img/icon-192.png',
        badge: '/img/badge-72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Открыть',
                icon: '/img/check.png'
            },
            {
                action: 'close',
                title: 'Закрыть',
                icon: '/img/cross.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('PizzaExpress', options)
    );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', event => {
    console.log('[SW] Клик по уведомлению');
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Синхронизация в фоне
self.addEventListener('sync', event => {
    console.log('[SW] Фоновая синхронизация');
    if (event.tag === 'sync-orders') {
        event.waitUntil(syncOrders());
    }
});

async function syncOrders() {
    try {
        // Здесь можно синхронизировать заказы с сервером
        console.log('[SW] Синхронизация заказов');
    } catch (error) {
        console.error('[SW] Ошибка синхронизации:', error);
    }
}