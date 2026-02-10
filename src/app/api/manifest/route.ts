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
    description: generateDescription(tenant),
    start_url: tenantId !== 'smartclass24' ? `/?tenant=${tenantId}` : '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: tenant.branding.primaryColor || '#7c3aed',
    orientation: 'portrait',
    icons: generateIcons(tenant),
    screenshots: [
      {
        src: '/screenshots/home.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide'
      },
      {
        src: '/screenshots/mobile.png',
        sizes: '720x1280',
        type: 'image/png',
        form_factor: 'narrow'
      }
    ],
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
  
  if (tenant.market === 'ghana') {
    return 'Smart learning platform for JHS & SHS students across Ghana. Learn, practice, and excel together.';
  }
  
  if (tenant.market === 'nigeria') {
    return 'Smart learning platform for JSS & SSS students across Nigeria. Learn, practice, and excel together.';
  }
  
  return `${tenant.branding.name} - Empowering students with smart, interactive learning experiences.`;
}

/**
 * Generate tenant-specific icons
 * Falls back to tenant logo if custom PWA icons don't exist
 */
function generateIcons(tenant: any): any[] {
  const logoUrl = tenant.branding.logoUrl;
  
  // If tenant has a logo, use it as PWA icon
  if (logoUrl && logoUrl !== '/icons/logo.svg') {
    return [
      {
        src: logoUrl,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: logoUrl,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: logoUrl,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: logoUrl,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ];
  }
  
  // Fallback to default icons
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
