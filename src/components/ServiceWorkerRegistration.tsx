/**
 * Service Worker Registration Component
 * Registers /pwa-sw.js so the site is installable: Install button → click → native install (no 3-dots).
 * In dev, /pwa-sw.js is served via rewrite to /api/pwa-sw so Turbopack serves it correctly.
 */

'use client';

import { useEffect, useState } from 'react';

export function ServiceWorkerRegistration() {
  const [status, setStatus] = useState<string>('init');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setStatus('mounted');

    if (!('serviceWorker' in navigator) || process.env.NODE_ENV === 'test') {
      setStatus('not-supported');
      return;
    }

    setStatus('registering');
    navigator.serviceWorker
      .register('/pwa-sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      .then((registration) => {
        setStatus('registered');
        registration.update();
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setStatus('update-available');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('[SW] Service Worker registration failed:', error);
        setStatus('error');
      });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      setStatus('activated');
    });
  }, []);

  return null;
}
