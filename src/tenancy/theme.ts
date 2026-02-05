import type { TenantConfig } from './types';

/**
 * Apply tenant branding theme (v1 - Simplified)
 * Sets 2 colors: primary and accent
 * 
 * @param tenant - Tenant configuration
 */
export function applyTenantTheme(tenant: TenantConfig) {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;

  // Set primary color (main brand color)
  root.style.setProperty('--tenant-primary', tenant.branding.primaryColor);
  
  // Set accent color (secondary/CTA color)
  root.style.setProperty('--tenant-accent', tenant.branding.accentColor);

  // Set tenant identifier for CSS selectors
  root.dataset.tenant = tenant.slug;

  // Update theme-color meta tag
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute('content', tenant.branding.primaryColor);
  }

  // Update page title
  document.title = tenant.branding.name;

  // Log for debugging (includes tenantId)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Theme] Applied tenant branding:', {
      tenantId: tenant.id,
      primaryColor: tenant.branding.primaryColor,
      accentColor: tenant.branding.accentColor,
    });
  }
}

