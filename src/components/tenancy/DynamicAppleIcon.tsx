/**
 * DynamicAppleIcon Component
 * Updates Apple Touch Icon dynamically based on tenant
 * 
 * @module components/tenancy/DynamicAppleIcon
 * @version 1.0.0
 */

'use client';

import { useEffect } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { getTenantPwaIconUrls, getProductionSafeIconUrl } from '@/tenancy/pwa';

/**
 * Updates Apple Touch Icon from current tenant's PWA icon
 * so each tenant gets their own logo when adding to iOS home screen.
 */
export function DynamicAppleIcon() {
  const { tenantId, branding } = useTenant();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    let appleIconLink = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
    if (!appleIconLink) {
      appleIconLink = document.createElement('link');
      appleIconLink.rel = 'apple-touch-icon';
      document.head.appendChild(appleIconLink);
    }

    const urls = getTenantPwaIconUrls(tenantId ?? '', branding);
    appleIconLink.href = getProductionSafeIconUrl(tenantId ?? '', urls.icon192);
  }, [tenantId, branding]);

  return null;
}
