/**
 * TENANT CONTEXT PROVIDER
 * Purpose: Provide tenant configuration to all components via React Context
 * 
 * Usage:
 * 1. Wrap app with <TenantProvider> in root layout
 * 2. Use getCurrentTenant() or useTenant() hook in any component
 * 3. Tenant is automatically resolved from URL parameters
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { resolveTenantFromParams, resolveTenantFromWindow } from './resolveTenant';
import type { TenantConfig } from './types';

// =========================================================================
// CONTEXT DEFINITION
// =========================================================================

interface TenantContextValue {
  tenant: TenantConfig;
  isLoading: boolean;
  previewMode: boolean; // True if ?tenant= param is present
}

const TenantContext = createContext<TenantContextValue | null>(null);

// =========================================================================
// PROVIDER COMPONENT
// =========================================================================

interface TenantProviderProps {
  children: React.ReactNode;
  /**
   * Initial tenant configuration (for SSR)
   * If not provided, tenant is resolved client-side
   */
  initialTenant?: TenantConfig;
}

export function TenantProvider({ children, initialTenant }: TenantProviderProps) {
  const searchParams = useSearchParams();
  const tenantParam = searchParams?.get('tenant') ?? null;
  
  const [isLoading, setIsLoading] = useState(!initialTenant);
  const [tenant, setTenant] = useState<TenantConfig | null>(initialTenant ?? null);
  const [previewMode, setPreviewMode] = useState(!!tenantParam);
  
  // Resolve tenant when params change
  useEffect(() => {
    const resolved = resolveTenantFromParams(tenantParam);
    setTenant(resolved);
    setPreviewMode(!!tenantParam);
    setIsLoading(false);
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('[TenantContext] Resolved:', {
        id: resolved.id,
        name: resolved.name,
        previewMode: !!tenantParam,
      });
    }
  }, [tenantParam]);
  
  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      tenant: tenant!,
      isLoading,
      previewMode,
    }),
    [tenant, isLoading, previewMode]
  );
  
  // Wait for tenant to be resolved before rendering children
  if (!tenant || isLoading) {
    return null; // Or return a loading spinner
  }
  
  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

// =========================================================================
// HOOKS
// =========================================================================

/**
 * Hook to access current tenant configuration
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { tenant, previewMode } = useTenant();
 *   return <div>Tenant: {tenant.name}</div>;
 * }
 * ```
 */
export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);
  
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  
  return context;
}

/**
 * Hook to get just the tenant config (for convenience)
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const tenant = useTenantConfig();
 *   return <div>{tenant.name}</div>;
 * }
 * ```
 */
export function useTenantConfig(): TenantConfig {
  const { tenant } = useTenant();
  return tenant;
}

// =========================================================================
// UTILITY FUNCTIONS (Non-Hook)
// =========================================================================

/**
 * Get current tenant without using React hooks
 * NOTE: This should only be used in non-component code or during SSR
 * For components, use useTenant() or useTenantConfig() instead
 * 
 * @example
 * ```typescript
 * // In API route or server component
 * const tenant = getCurrentTenant();
 * const label = getCurriculumLabel(tenant);
 * ```
 */
export function getCurrentTenant(): TenantConfig {
  // Try to get from window (client-side)
  if (typeof window !== 'undefined') {
    return resolveTenantFromWindow();
  }
  
  // Fallback to environment variable or default (server-side)
  const { getDefaultTenant, getTenantById } = require('./registry');
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  
  if (tenantId) {
    const tenant = getTenantById(tenantId);
    if (tenant) return tenant;
  }
  
  return getDefaultTenant();
}

/**
 * Get tenant ID from current context
 * Convenience function for quick checks
 */
export function getCurrentTenantId(): string {
  return getCurrentTenant().id;
}

/**
 * Check if current tenant matches a specific ID
 * 
 * @example
 * ```typescript
 * if (isTenant('wisdomwarehouse')) {
 *   // Show special features for Wisdom Warehouse
 * }
 * ```
 */
export function isTenant(tenantId: string): boolean {
  return getCurrentTenantId() === tenantId;
}

/**
 * Check if currently in preview mode (?tenant= param)
 * Only works client-side
 */
export function isPreviewMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  const urlParams = new URLSearchParams(window.location.search);
  return !!urlParams.get('tenant');
}

// =========================================================================
// EXPORTS
// =========================================================================

export default TenantContext;
