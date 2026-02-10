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
 * Client component that dynamically updates PWA manifest
 * based on current tenant's branding
 * 
 * @example
 * ```tsx
 * // In layout head
 * <DynamicManifest />
 * ```
 */
export function DynamicManifest() {
  const { tenantId } = useTenant();
  
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    // Find or create manifest link element
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }
    
    // Update manifest URL with tenant parameter
    const manifestUrl = tenantId && tenantId !== 'smartclass24' 
      ? `/api/manifest?tenant=${tenantId}`
      : '/api/manifest';
    
    manifestLink.href = manifestUrl;
    
    // Update theme color meta tag
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta && tenantId === 'wisdomwarehouse') {
      themeColorMeta.setAttribute('content', '#1e40af'); // Wisdom Warehouse blue
    }
  }, [tenantId]);
  
  return null; // This component doesn't render anything
}
