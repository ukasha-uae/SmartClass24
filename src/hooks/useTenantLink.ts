'use client';

import { useCallback } from 'react';
import { useTenant } from '@/hooks/useTenant';

/**
 * Safe function to get tenant from URL without triggering errors
 */
function getSafeTenantFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return new URLSearchParams(window.location.search).get('tenant');
  } catch {
    return null;
  }
}

/**
 * useTenantLink
 * Preserves the current tenant query param in internal links.
 */
export function useTenantLink() {
  const { tenantId } = useTenant();

  return useCallback(
    (href: string) => {
      // If the link already includes a tenant param, never append another.
      if (/[?&]tenant=/.test(href)) return href;

      const tenantFromUrl = getSafeTenantFromUrl();
      const tenant = tenantFromUrl || tenantId;
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('[useTenantLink]', {
          href,
          tenant,
          searchParams: typeof window !== 'undefined' ? window.location.search.replace(/^\?/, '') : '',
          willAddParam: !!(tenant && tenant !== 'smartclass24')
        });
      }
      
      if (!tenant || tenant === 'smartclass24') return href;
      const separator = href.includes('?') ? '&' : '?';
      const result = `${href}${separator}tenant=${tenant}`;
      
      // Debug result
      if (process.env.NODE_ENV === 'development') {
        console.log('[useTenantLink] Result:', result);
      }
      
      return result;
    },
    [tenantId],
  );
}
