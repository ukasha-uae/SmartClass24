/**
 * Service Worker for PWA Installability
 * Provides offline capability for Chrome's install prompt
 */

const CACHE_VERSION = 'v1.0.1';
const CACHE_NAME = `smartclass24-pwa-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Assets to cache on install (required for offline functionality)
const CRITICAL_ASSETS = [
  '/',
  '/offline.html',
];

console.log('[SW] Initializing service worker...');

/**
 * Install Event - Cache critical assets
 * This MUST succeed for PWA install prompt to appear
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker version', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Opened cache:', CACHE_NAME);
        console.log('[SW] Caching critical assets:', CRITICAL_ASSETS);
        
        // Try to cache critical assets, but don't fail install if they fail
        return cache.addAll(CRITICAL_ASSETS)
          .catch((error) => {
            console.warn('[SW] Failed to cache some assets:', error);
            // Cache at least offline page
            return cache.add(OFFLINE_URL).catch((e) => {
              console.error('[SW] Failed to cache offline page:', e);
            });
          });
      })
      .then(() => {
        console.log('[SW] Installation complete, activating immediately...');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Install failed:', error);
      })
  );
});

/**
 * Activate Event - Cleanup old caches and take control
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('smartclass24-pwa-') && name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      }),
      // Take control of all pages immediately
      self.clients.claim()
    ])
    .then(() => {
      console.log('[SW] Service worker activated and controlling all pages');
    })
  );
});

/**
 * Fetch Event - Network-first with cache fallback
 * This is REQUIRED for PWA offline capability
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip non-HTTP(S) requests (chrome-extension, etc.)
  if (!request.url.startsWith('http')) {
    return;
  }

  // Network-first strategy with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone response for caching
        const responseClone = response.clone();
        
        // Cache document, script, style, and image responses
        const destination = request.destination;
        if (
          destination === 'document' ||
          destination === 'script' ||
          destination === 'style' ||
          destination === 'image'
        ) {
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(request, responseClone))
            .catch((error) => {
              console.warn('[SW] Failed to cache:', request.url, error);
            });
        }

        return response;
      })
      .catch((error) => {
        console.log('[SW] Network failed for:', request.url, '- falling back to cache');
        
        // Try to return cached version
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[SW] Serving from cache:', request.url);
              return cachedResponse;
            }

            // For navigation requests, show offline page
            if (request.destination === 'document') {
              return caches.match(OFFLINE_URL)
                .then((offlinePage) => {
                  if (offlinePage) {
                    return offlinePage;
                  }
                  // Last resort: generic offline response
                  return new Response('Offline', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: { 'Content-Type': 'text/plain' }
                  });
                });
            }

            // For other resources, return generic offline response
            return new Response('Resource not available offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

/**
 * Message Event - Handle commands from clients
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }
});

console.log('[SW] Service worker script loaded and ready');
