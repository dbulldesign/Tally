/* Tally service worker — deliberately conservative, plain ES5-style.
 * No URL/searchParams, no optional chaining, everything guarded.
 *
 * Navigation is NETWORK-FIRST: online you always get the freshly deployed
 * index.html, so a new release can never get stuck behind an old cache.
 * Cache is the offline fallback only.
 */
var VERSION = (function () {
  try {
    var m = String(self.location.search || '').match(/[?&]v=([^&]+)/);
    return m ? m[1] : 'dev';
  } catch (e) { return 'dev'; }
})();
var CACHE = 'tally-' + VERSION;
var SHELL = 'index.html';

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.add(SHELL); })
      .catch(function () { /* never block install */ })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          return k === CACHE ? null : caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
      .catch(function () {})
  );
});

self.addEventListener('message', function (e) {
  if (e && e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (!req || req.method !== 'GET') return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        try {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(SHELL, copy); }).catch(function () {});
        } catch (err) {}
        return res;
      }).catch(function () {
        return caches.match(SHELL).then(function (hit) { return hit || caches.match('./'); });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        try {
          if (res && res.status === 200 && res.type === 'basic') {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
          }
        } catch (err) {}
        return res;
      }).catch(function () { return hit; });
    })
  );
});
