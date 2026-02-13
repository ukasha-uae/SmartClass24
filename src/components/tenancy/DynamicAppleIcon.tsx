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

/**
 * Client component that dynamically updates Apple Touch Icon
 * based on current tenant's branding (for iOS devices)
 * 
 * @example
 * ```tsx
 * // In layout head
 * <DynamicAppleIcon />
 * ```
 */
export function DynamicAppleIcon() {
  const { tenantId, branding } = useTenant();
  
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    // Find or create apple-touch-icon link element
    let appleIconLink = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
    
    if (!appleIconLink) {
      appleIconLink = document.createElement('link');
      appleIconLink.rel = 'apple-touch-icon';
      document.head.appendChild(appleIconLink);
    }
    
    // Use tenant-specific PWA icon for iOS home screen (better than logo)
    // Wisdom Warehouse: /icons/wisdom-warehouse-192.png
    let iconUrl = '/icons/icon-192x192.svg'; // default
    
    if (tenantId === 'wisdomwarehouse') {
      iconUrl = '/icons/wisdom-warehouse-192.png';
    }
    
    appleIconLink.href = iconUrl;
  }, [tenantId, branding]);
  
  return null; // This component doesn't render anything
}
