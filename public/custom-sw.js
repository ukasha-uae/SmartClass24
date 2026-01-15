/**
 * Custom Service Worker Extension for SmartClass24
 * Handles update notifications and skip waiting
 */

// Listen for SKIP_WAITING message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[ServiceWorker] SKIP_WAITING received, activating new version');
    self.skipWaiting();
  }
});

// Notify clients when service worker is activated
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activated new version');
  
  // Notify all clients about the update
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'SW_UPDATED',
          message: 'Service worker updated and activated'
        });
      });
    })
  );
  
  // Take control of all pages immediately
  return self.clients.claim();
});

// Log when service worker is installed
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] New version installed');
  // Don't wait for old service worker to finish
  self.skipWaiting();
});
