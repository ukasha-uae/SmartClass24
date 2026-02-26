import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTenantByHost } from '@/tenancy/registry';

export function middleware(request: NextRequest) {
  // Security hardening:
  // - Authorization context must come from trusted host mapping, not ?tenant query.
  // - Query param remains preview/presentation-only for UI customization.
  const tenantFromQuery = request.nextUrl.searchParams.get('tenant');
  const tenantFromHost = getTenantByHost(request.nextUrl.hostname)?.id ?? null;
  const tenant = tenantFromHost;

  const requestHeaders = new Headers(request.headers);
  if (tenant) {
    requestHeaders.set('x-tenant', tenant);
  }
  if (tenantFromQuery) {
    requestHeaders.set('x-tenant-preview', tenantFromQuery);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (tenantFromHost) {
    // Persist only host-derived tenant as trusted tenant context.
    response.cookies.set('tenant', tenant, {
      path: '/',
      sameSite: 'lax',
    });
  } else {
    response.cookies.delete('tenant');
  }

  // Keep preview selection isolated from auth context.
  if (tenantFromQuery) {
    response.cookies.set('tenant_preview', tenantFromQuery, {
      path: '/',
      sameSite: 'lax',
    });
  } else {
    response.cookies.delete('tenant_preview');
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
