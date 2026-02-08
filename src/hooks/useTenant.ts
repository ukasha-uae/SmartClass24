/**
 * useTenant Hook
 * Provides access to current tenant configuration
 * 
 * @module hooks/useTenant
 * @version 1.0.0 (Simplified)
 */

'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { resolveTenantFromParams } from '@/tenancy/resolveTenant';
import type { TenantConfig } from '@/tenancy/types';
import { TenantParamContext } from '@/components/tenancy/TenantParamProvider';



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
  const initialTenantParam = useContext(TenantParamContext);
  // Track URL search params to re-resolve tenant when ?tenant= changes
  const [tenantParam, setTenantParam] = useState<string | null>(() => {
    if (initialTenantParam) return initialTenantParam;
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('tenant');
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const readTenantParam = () => {
      const params = new URLSearchParams(window.location.search);
      setTenantParam(params.get('tenant'));
    };

    const notifyLocationChange = () => readTenantParam();

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function pushState(...args) {
      const result = originalPushState.apply(this, args as unknown as [any, any, any]);
      window.dispatchEvent(new Event('locationchange'));
      return result;
    };

    window.history.replaceState = function replaceState(...args) {
      const result = originalReplaceState.apply(this, args as unknown as [any, any, any]);
      window.dispatchEvent(new Event('locationchange'));
      return result;
    };

    window.addEventListener('popstate', notifyLocationChange);
    window.addEventListener('locationchange', notifyLocationChange);

    readTenantParam();

    return () => {
      window.removeEventListener('popstate', notifyLocationChange);
      window.removeEventListener('locationchange', notifyLocationChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);
  
  const tenant = useMemo<TenantConfig>(() => {
    // Use the new resolveTenantFromParams that accepts tenant directly
    const resolved = resolveTenantFromParams(tenantParam);
    
    // Log tenant for debugging (includes tenantId in all logs)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[useTenant] Resolved:', {
        tenantId: resolved.id,
        name: resolved.name,
        market: resolved.market,
        domain: resolved.branding.domain,
        fromURL: tenantParam,
      });
    }
    
    return resolved;
  }, [tenantParam]);
  
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

