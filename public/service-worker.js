const CACHE_NAME = 'brave-academy-v1';
const urlsToCache = [
  '/',
  '/index.html'
];

// تنصيب التطبيق وتخزين الملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// تشغيل التطبيق وجلب البيانات (Cache First Strategy)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // إذا وجد الملف مخزناً، ارجعه، وإلا اطلبه من الانترنت
        return response || fetch(event.request);
      })
  );
});