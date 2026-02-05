/**
 * useTenant Hook
 * Provides access to current tenant configuration
 * 
 * @module hooks/useTenant
 * @version 1.0.0 (Simplified)
 */

'use client';

import { useMemo } from 'react';
import { resolveTenantFromWindow } from '@/tenancy/resolveTenant';
import type { TenantConfig } from '@/tenancy/types';

export interface UseTenantResult {
  tenant: TenantConfig;
  tenantId: string;
  market: TenantConfig['market'];
  branding: TenantConfig['branding'];
  features: TenantConfig['features'];
  content: TenantConfig['content'];
  
  // Computed properties
  isEnterprise: boolean;
  isPremium: boolean;
  hasActiveLicense: boolean;
  
  // Feature helpers
  hasVirtualLabs: boolean;
  hasArenaChallenge: boolean;
  hasJHSCampus: boolean;
  hasSHSCampus: boolean;
  hasUniversityCampus: boolean;
  hasLocalization: boolean;
}

/**
 * Hook to access current tenant configuration
 * Automatically resolves tenant from domain, preview mode, or environment
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { tenant, branding, features, hasVirtualLabs } = useTenant();
 *   
 *   return (
 *     <div>
 *       <h1>{branding.name}</h1>
 *       {hasVirtualLabs && <VirtualLabsLink />}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example Preview mode
 * ```
 * // URL: https://smartclass24.app?tenant=wisdomwarehouse
 * const { tenant } = useTenant();
 * console.log(tenant.name); // "Wisdom Warehouse"
 * ```
 */
export function useTenant(): UseTenantResult {
  // Track URL search params to re-resolve tenant when ?tenant= changes
  const searchParams = typeof window !== 'undefined' ? window.location.search : '';
  
  const tenant = useMemo<TenantConfig>(() => {
    const resolved = resolveTenantFromWindow();
    
    // Log tenant for debugging (includes tenantId in all logs)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[useTenant] Resolved:', {
        tenantId: resolved.id,
        name: resolved.name,
        market: resolved.market,
        domain: resolved.branding.domain,
      });
    }
    
    return resolved;
  }, [searchParams]);
  
  return {
    tenant,
    tenantId: tenant.id,
    market: tenant.market,
    branding: tenant.branding,
    features: tenant.features,
    content: tenant.content,
    
    // Computed properties
    isEnterprise: tenant.license.tier === 'enterprise',
    isPremium: tenant.license.tier === 'premium' || tenant.license.tier === 'enterprise',
    hasActiveLicense: tenant.status === 'active' || tenant.status === 'trial',
    
    // Feature helpers (for cleaner component code)
    hasVirtualLabs: tenant.features.enableVirtualLabs,
    hasArenaChallenge: tenant.features.enableArenaChallenge,
    hasJHSCampus: tenant.features.enableJHSCampus,
    hasSHSCampus: tenant.features.enableSHSCampus,
    hasUniversityCampus: tenant.features.enableUniversityCampus,
    hasLocalization: tenant.features.enableLocalization ?? false,
  };
}

