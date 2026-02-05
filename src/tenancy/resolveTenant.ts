import type { TenantConfig } from './types';
import { getDefaultTenant, getTenantByHost, getTenantById } from './registry';

/**
 * Resolve tenant with priority order
 * 1. Preview mode (?tenant=xyz) - for demos/QA
 * 2. Environment variable (NEXT_PUBLIC_TENANT_ID)
 * 3. Domain matching (smartclass24.app, learn.wisdomwarehouse.com)
 * 4. Default tenant (smartclass24)
 */
export function resolveTenant({
  tenantId,
  hostname,
  previewTenant,
}: {
  tenantId?: string | null;
  hostname?: string | null;
  previewTenant?: string | null;
}): TenantConfig {
  // Priority 1: Preview mode (for demos, QA, onboarding)
  if (previewTenant) {
    const tenant = getTenantById(previewTenant);
    if (tenant) {
      console.log('[Tenant] Preview mode:', previewTenant);
      return tenant;
    }
  }

  // Priority 2: Environment variable
  if (tenantId) {
    const tenant = getTenantById(tenantId);
    if (tenant) {
      console.log('[Tenant] Environment:', tenantId);
      return tenant;
    }
  }

  // Priority 3: Domain matching
  if (hostname) {
    const tenant = getTenantByHost(hostname);
    if (tenant) {
      console.log('[Tenant] Domain:', hostname);
      return tenant;
    }
  }

  // Priority 4: Default
  console.log('[Tenant] Default');
  return getDefaultTenant();
}

/**
 * Resolve tenant from browser window
 * Includes preview mode support via ?tenant=xyz
 */
export function resolveTenantFromWindow(): TenantConfig {
  if (typeof window === 'undefined') {
    return getDefaultTenant();
  }

  // Check for preview mode
  const urlParams = new URLSearchParams(window.location.search);
  const previewTenant = urlParams.get('tenant');

  const hostname = window.location.hostname;
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID ?? null;

  return resolveTenant({ tenantId, hostname, previewTenant });
}
