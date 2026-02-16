import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTenantByHost } from '@/tenancy/registry';

export function middleware(request: NextRequest) {
  // Resolve tenant: 1) ?tenant= query (preview), 2) hostname (e.g. learn.wisdomwarehouseuae.com)
  // so PWA and layout get correct manifest/branding for Wisdom and other domain-based tenants.
  const tenantFromQuery = request.nextUrl.searchParams.get('tenant');
  const tenantFromHost = getTenantByHost(request.nextUrl.hostname)?.id ?? null;
  const tenant = tenantFromQuery ?? tenantFromHost;

  const requestHeaders = new Headers(request.headers);
  if (tenant) {
    requestHeaders.set('x-tenant', tenant);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (tenant) {
    response.cookies.set('tenant', tenant, {
      path: '/',
      sameSite: 'lax',
    });
  } else {
    response.cookies.delete('tenant');
  }

  return response;
}

// Apply middleware to all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (Next.js internals: static, image, RSC/Flight, HMR, etc.)
     * - favicon.ico (favicon file)
     * - public assets (images, fonts, etc.)
     */
    '/((?!api|_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
};
