import type { TenantConfig } from './types';
import { TENANT_REGISTRY } from './registry-data';

const DEFAULT_TENANT_ID = 'smartclass24';

export { TENANT_REGISTRY };

export function getDefaultTenant(): TenantConfig {
  return TENANT_REGISTRY[DEFAULT_TENANT_ID];
}

export function getTenantById(tenantId?: string | null): TenantConfig | null {
  if (!tenantId) {
    return null;
  }
  return TENANT_REGISTRY[tenantId] ?? null;
}

export function getTenantByHost(hostname?: string | null): TenantConfig | null {
  if (!hostname) {
    return null;
  }

  const normalizedHost = hostname.replace(/^www\./, '').toLowerCase();
  const match = Object.values(TENANT_REGISTRY).find(
    tenant => tenant.branding.domain.toLowerCase() === normalizedHost,
  );

  return match ?? null;
}
