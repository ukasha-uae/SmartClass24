import { NextRequest, NextResponse } from 'next/server';
import { TENANT_REGISTRY } from '@/tenancy/registry';
import { getTenantPwaIconUrls, buildManifestIcons } from '@/tenancy/pwa';

/**
 * Dynamic PWA Manifest API Route
 * Generates tenant-specific manifest.json for PWA installation with tenant name and icons.
 *
 * Usage: /api/manifest?tenant=wisdomwarehouse
 * Each tenant can install the PWA with their own logo (add pwaIcons in registry or /icons/{tenantId}-192.png and -512.png).
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tenantParam = searchParams.get('tenant');

  const cookieTenant = request.cookies.get('tenant')?.value;
  const tenantId = tenantParam || cookieTenant || 'smartclass24';

  const tenant = TENANT_REGISTRY[tenantId] || TENANT_REGISTRY.smartclass24;
  const branding = tenant.branding;

  const iconUrls = getTenantPwaIconUrls(tenantId, branding);
  const icons = buildManifestIcons(iconUrls);

  const basePath = tenantId !== 'smartclass24' ? `/?tenant=${tenantId}` : '/';
  const manifest = {
    name: `${branding.name} - Smart Learning Platform`,
    short_name: branding.name,
    id: basePath,
    description: generateDescription(tenant),
    start_url: basePath,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: branding.primaryColor || '#7c3aed',
    orientation: 'portrait',
    icons,
    categories: ['education', 'productivity'],
    lang: 'en',
    dir: 'ltr',
    scope: basePath,
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

/**
 * Generate tenant-specific description
 */
function generateDescription(tenant: any): string {
  if (tenant.id === 'wisdomwarehouse') {
    return 'Empowering curious, creative, and developing young minds through alternative, holistic education rooted in real-world learning.';
  }
  
  // Generic description for global platform
  return `${tenant.branding?.name || 'SmartClass24'} - Master your curriculum with interactive lessons, virtual labs, and gamified learning.`;
}

