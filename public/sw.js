var cacheName   = 'top-explorer-cache-v1';
var offlineUrl  = '/no-connection';

// Install
self.addEventListener('install', function(event) {

  // Cache assets
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        return cache.addAll([
          offlineUrl,
          '/assets/style.css',
          '/assets/enhancements.js',
          '/assets/iconfont.woff',
          '/assets/heart.svg'
        ]);
      })
  );
});

// Fetch
self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);

  // Only do stuff with our own urls
  if(requestUrl.origin !== location.origin) {
    return;
  }

  // Always check cache for assets
  if(requestUrl.pathname.startsWith('/assets/')) {
    checkCacheFirst(event);
    return;
  }

  // If we navigate to a page
  if(event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)

        // Cache the latest response for certain pages
        .then(function(response) {
          if(requestUrl.pathname === '/') {
            caches.open(cacheName).then(function(cache) {
              cache.put(event.request, response.clone());
            });
          }
          return response;
        })

        // If it fails
        .catch(function() {

          // Try and return cached version
          return caches.match(event.request)
              .then(function(response) {
                if (response) {
                  return response;
                }

                // If we don't have a cached version
                // show pretty offline page
                return caches.match(offlineUrl);
              });
        })
    );
  }
});

// Try cache first, if we don't have it make the request
function checkCacheFirst(event) {
  return event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
}