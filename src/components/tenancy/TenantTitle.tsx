/**
 * TenantTitle Component
 * Updates document title dynamically based on tenant branding
 * 
 * @module components/tenancy/TenantTitle
 * @version 1.0.0
 */

'use client';

import { useEffect } from 'react';
import { useTenant } from '@/hooks/useTenant';

/**
 * Client component that dynamically updates document title
 * based on current tenant's branding
 * 
 * @example
 * ```tsx
 * // In layout or page
 * <TenantTitle />
 * ```
 */
export function TenantTitle() {
  const { branding, tenantId } = useTenant();
  
  useEffect(() => {
    if (typeof document === 'undefined') return;
    // White-label tenants: show only their name (no "Smart Learning" / S24 in title bar)
    if (tenantId && tenantId !== 'smartclass24' && branding?.name) {
      document.title = `${branding.name} - Smart Learning Platform`;
    } else {
      document.title = branding?.name || 'SmartClass24';
    }
  }, [branding, tenantId]);
  
  return null;
}
