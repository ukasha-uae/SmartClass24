import { NextRequest, NextResponse } from 'next/server';
import { TENANT_REGISTRY } from '@/tenancy/registry';

/**
 * Dynamic PWA Manifest API Route
 * Generates tenant-specific manifest.json for PWA installation
 * 
 * Usage: /api/manifest?tenant=wisdomwarehouse
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tenantParam = searchParams.get('tenant');
  
  // Get tenant from cookie if not in query
  const cookieTenant = request.cookies.get('tenant')?.value;
  const tenantId = tenantParam || cookieTenant || 'smartclass24';
  
  // Get tenant config or fallback to default
  const tenant = TENANT_REGISTRY[tenantId] || TENANT_REGISTRY.smartclass24;
  
  // Generate tenant-specific manifest
  const manifest = {
    name: `${tenant.branding.name} - Smart Learning Platform`,
    short_name: tenant.branding.name,
    id: tenantId !== 'smartclass24' ? `/?tenant=${tenantId}` : '/',
    description: generateDescription(tenant),
    start_url: tenantId !== 'smartclass24' ? `/?tenant=${tenantId}` : '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: tenant.branding.primaryColor || '#7c3aed',
    orientation: 'portrait',
    icons: generateIcons(tenant),
    categories: ['education', 'productivity'],
    lang: 'en',
    dir: 'ltr',
    scope: tenantId !== 'smartclass24' ? `/?tenant=${tenantId}` : '/',
  };
  
  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
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

/**
 * Generate tenant-specific icons
 * Uses properly sized PWA icons for each tenant
 */
function generateIcons(tenant: any): any[] {
  const tenantId = tenant.id || tenant.slug;
  
  // Check if tenant has dedicated PWA icons
  // Wisdom Warehouse has: /icons/wisdom-warehouse-192.png and /icons/wisdom-warehouse-512.png
  if (tenantId === 'wisdomwarehouse') {
    return [
      {
        src: '/icons/wisdom-warehouse-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/wisdom-warehouse-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/wisdom-warehouse-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/wisdom-warehouse-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ];
  }
  
  // Fallback to default SmartClass24 icons (PNG for better PWA support)
  // TODO: Convert default icons to PNG as well
  return [
    {
      src: '/icons/icon-192x192.svg',
      sizes: '192x192',
      type: 'image/svg+xml',
      purpose: 'any'
    },
    {
      src: '/icons/icon-512x512.svg',
      sizes: '512x512',
      type: 'image/svg+xml',
      purpose: 'any'
    },
    {
      src: '/icons/icon-192x192.svg',
      sizes: '192x192',
      type: 'image/svg+xml',
      purpose: 'maskable'
    },
    {
      src: '/icons/icon-512x512.svg',
      sizes: '512x512',
      type: 'image/svg+xml',
      purpose: 'maskable'
    }
  ];
}
