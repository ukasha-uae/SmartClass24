/**
 * Service Worker Registration Component
 * Registers /pwa-sw.js so the site is installable: Install button → click → native install (no 3-dots).
 * In dev, /pwa-sw.js is served via rewrite to /api/pwa-sw so Turbopack serves it correctly.
 * Skipped by default in dev — the route's force-dynamic/no-store response combined with
 * Fast Refresh remounts causes the browser to race SW update jobs, throwing InvalidStateError.
 * Opt in locally via localStorage.setItem('enable-sw-dev', 'true') to test install flows.
 */

'use client';

import { useEffect, useState } from 'react';

export function ServiceWorkerRegistration() {
  const [status, setStatus] = useState<string>('init');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setStatus('mounted');

    const isDev = process.env.NODE_ENV === 'development';
    const devOptIn = isDev && typeof window !== 'undefined' && window.localStorage.getItem('enable-sw-dev') === 'true';

    if (!('serviceWorker' in navigator) || process.env.NODE_ENV === 'test' || (isDev && !devOptIn)) {
      setStatus('not-supported');
      // Clean up any SW registered by an earlier dev session so the browser
      // stops racing update jobs against it (source of the InvalidStateError).
      if (isDev && 'serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister().catch(() => {});
          });
        }).catch(() => {});
      }
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
