/**
 * DynamicManifest Component
 * Updates PWA manifest link dynamically based on tenant
 * 
 * @module components/tenancy/DynamicManifest
 * @version 1.0.0
 */

'use client';

import { useEffect } from 'react';
import { useTenant } from '@/hooks/useTenant';

/**
 * Client component that dynamically updates PWA manifest and theme-color
 * based on current tenant so each tenant gets their own branded PWA install.
 */
export function DynamicManifest() {
  const { tenantId, branding } = useTenant();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }

    // API manifest for all non-default tenants (Wisdom included) so icons work in production
    const manifestUrl =
      tenantId && tenantId !== 'smartclass24'
        ? `/api/manifest?tenant=${tenantId}`
        : '/manifest.json';

    manifestLink.href = manifestUrl;

    // Theme color for any tenant (PWA task bar / status bar)
    const themeColor = branding?.primaryColor || '#7c3aed';
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', themeColor);
    }
  }, [tenantId, branding?.primaryColor]);

  return null;
}
