import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTenantByHost } from '@/tenancy/registry';
import { rateLimitMiddleware, RateLimitPresets } from '@/lib/security/rate-limiter';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const rateLimitResponse = applyRateLimiting(request, pathname);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }
  
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

  if (tenantFromHost && tenant) {
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

/**
 * Apply rate limiting based on API endpoint
 */
function applyRateLimiting(request: NextRequest, pathname: string): NextResponse | null {
  // Webhook endpoints - moderate limit (100/min)
  if (pathname.startsWith('/api/payments/webhook')) {
    const limiter = rateLimitMiddleware(RateLimitPresets.webhook);
    return limiter(request);
  }
  
  // Admin endpoints - strict limit (5/min)
  if (pathname.startsWith('/api/admin/')) {
    const limiter = rateLimitMiddleware(RateLimitPresets.auth);
    return limiter(request);
  }
  
  // Entitlements endpoints - standard limit (60/min)
  if (pathname.startsWith('/api/entitlements/')) {
    const limiter = rateLimitMiddleware(RateLimitPresets.standard);
    return limiter(request);
  }
  
  // Public data endpoints - relaxed limit (120/min)
  if (pathname.startsWith('/api/exchange-rates') || 
      pathname.startsWith('/api/tenant-logo') ||
      pathname.startsWith('/api/manifest') ||
      pathname.startsWith('/api/pwa-sw')) {
    const limiter = rateLimitMiddleware(RateLimitPresets.public);
    return limiter(request);
  }
  
  // All other API endpoints - standard limit (60/min)
  const limiter = rateLimitMiddleware(RateLimitPresets.standard);
  return limiter(request);
}

// Apply middleware to all routes including API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next (Next.js internals: static, image, RSC/Flight, HMR, etc.)
     * - favicon.ico (favicon file)
     * - public assets (images, fonts, etc.)
     * 
     * Note: API routes are now INCLUDED for rate limiting
     */
    '/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
};
