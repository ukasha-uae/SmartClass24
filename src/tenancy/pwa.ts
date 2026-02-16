/**
 * Tenant PWA helpers
 * Shared logic for tenant-specific manifest icons and install branding.
 */

import type { TenantBranding } from './types';

const DEFAULT_ICON_192 = '/icons/icon-192x192.svg';
const DEFAULT_ICON_512 = '/icons/icon-512x512.svg';
const DEFAULT_ICON_TYPE = 'image/svg+xml';

export interface TenantPwaIconUrls {
  icon192: string;
  icon512: string;
  type: 'image/png' | 'image/svg+xml';
}

/**
 * Resolve PWA icon URLs for a tenant.
 * Uses branding.pwaIcons if set, otherwise convention: /icons/{tenantId}-192.png, /icons/{tenantId}-512.png.
 * Convention uses PNG; default S24 icons are SVG.
 */
export function getTenantPwaIconUrls(
  tenantId: string,
  branding: TenantBranding | undefined
): TenantPwaIconUrls {
  if (branding?.pwaIcons?.icon192 && branding?.pwaIcons?.icon512) {
    return {
      icon192: branding.pwaIcons.icon192,
      icon512: branding.pwaIcons.icon512,
      type: 'image/png',
    };
  }
  // Convention: /icons/{tenantId}-192.png and /icons/{tenantId}-512.png
  // (Tenant adds these files to public/icons; we can't check existence at runtime in client.)
  if (tenantId && tenantId !== 'smartclass24') {
    return {
      icon192: `/icons/${tenantId}-192.png`,
      icon512: `/icons/${tenantId}-512.png`,
      type: 'image/png',
    };
  }
  return {
    icon192: DEFAULT_ICON_192,
    icon512: DEFAULT_ICON_512,
    type: DEFAULT_ICON_TYPE as 'image/svg+xml',
  };
}

/**
 * Build manifest icons array for a tenant (any + maskable).
 */
export function buildManifestIcons(urls: TenantPwaIconUrls): Array<{ src: string; sizes: string; type: string; purpose: string }> {
  const { icon192, icon512, type } = urls;
  return [
    { src: icon192, sizes: '192x192', type, purpose: 'any' },
    { src: icon512, sizes: '512x512', type, purpose: 'any' },
    { src: icon192, sizes: '192x192', type, purpose: 'maskable' },
    { src: icon512, sizes: '512x512', type, purpose: 'maskable' },
  ];
}
