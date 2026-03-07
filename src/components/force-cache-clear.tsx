'use client';

import { useEffect } from 'react';

/**
 * Force clear service worker cache and reload if stale version detected
 * This runs on every page load to ensure users always get fresh content
 */
export function ForceCacheClear() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    const clearCache = async () => {
      // Only run once per browser session to avoid repeated SW unregistrations
      // which cause InvalidStateError when next-pwa tries to call update() on a
      // stale/dead registration reference.
      if (sessionStorage.getItem('cache-cleared')) return;

      if ('serviceWorker' in navigator && 'caches' in window) {
        try {
          // Get all cache names
          const cacheNames = await caches.keys();
          
          // Delete ALL caches
          await Promise.all(
            cacheNames.map(cacheName => {
              console.log('Deleting cache:', cacheName);
              return caches.delete(cacheName);
            })
          );

          // Unregister ALL service workers (once per session — prevents InvalidStateError
          // on subsequent navigations where next-pwa tries to update a dead SW reference)
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(
            registrations.map(registration => {
              console.log('Unregistering service worker:', registration.scope);
              return registration.unregister().catch(() => {
                // Silently ignore — SW may already be in invalid state
              });
            })
          );

          console.log('✅ All caches cleared and service workers unregistered');
          
          // Mark as done for this session, then force a fresh network load
          sessionStorage.setItem('cache-cleared', 'true');
          window.location.reload();
        } catch (error) {
          console.error('Error clearing cache:', error);
        }
      }
    };

    clearCache();
  }, []);

  return null;
}
