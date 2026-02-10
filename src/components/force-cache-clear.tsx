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

          // Unregister ALL service workers
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(
            registrations.map(registration => {
              console.log('Unregistering service worker:', registration.scope);
              return registration.unregister();
            })
          );

          console.log('✅ All caches cleared and service workers unregistered');
          
          // Force reload from network (only once per session)
          if (!sessionStorage.getItem('cache-cleared')) {
            sessionStorage.setItem('cache-cleared', 'true');
            window.location.reload();
          }
        } catch (error) {
          console.error('Error clearing cache:', error);
        }
      }
    };

    clearCache();
  }, []);

  return null;
}
