// Service worker ringkas: cukup untuk app boleh di-install.
// Data sentiasa diambil terus dari Google (tiada cache data).
const VERSI = 'lg-v2';
const FAIL = ['./', './index.html', './logo.png', './icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(FAIL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(n => n !== VERSI).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // Google: terus ke internet
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
