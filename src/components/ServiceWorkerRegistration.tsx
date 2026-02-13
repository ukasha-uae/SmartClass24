/**
 * Service Worker Registration Component
 * Manually registers service worker since @ducanh2912/next-pwa doesn't auto-register with Turbopack
 */

'use client';

import { useEffect, useState } from 'react';

export function ServiceWorkerRegistration() {
  const [status, setStatus] = useState<string>('init');

  useEffect(() => {
    console.log('[SW Registration] Component mounted, checking service worker support...');
    setStatus('mounted');
    
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV !== 'test'
    ) {
      console.log('[SW Registration] Service worker supported, registering...');
      setStatus('registering');
      
      // Register service worker
      navigator.serviceWorker
        .register('/pwa-sw.js', {
          scope: '/',
          updateViaCache: 'none', // Always check for updates
        })
        .then((registration) => {
          console.log('[SW] ✅ Service Worker registered successfully:', registration.scope);
          setStatus('registered');
          
          // Check for updates
          registration.update();
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('[SW] Update found, installing new service worker...');
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[SW] New service worker installed, page reload available');
                  setStatus('update-available');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[SW] ❌ Service Worker registration failed:', error);
          setStatus('error');
        });

      // Handle controller change (new service worker activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[SW] Controller changed, new service worker activated');
        setStatus('activated');
      });
    } else {
      console.log('[SW Registration] Service worker not supported or in test mode');
      setStatus('not-supported');
    }
  }, []);

  // Hidden dev indicator (only visible when you inspect the DOM or check React DevTools)
  if (process.env.NODE_ENV === 'development') {
    return <div data-sw-status={status} data-component="ServiceWorkerRegistration" style={{ display: 'none' }} />;
  }

  return null;
}
