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
  const { branding } = useTenant();
  
  useEffect(() => {
    // Update document title when tenant changes
    if (typeof document !== 'undefined') {
      document.title = branding?.name || 'SmartClass24';
    }
  }, [branding]);
  
  return null; // This component doesn't render anything
}
