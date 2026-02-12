import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Persist preview tenant from query string and make it available to SSR.
  // Note: the cookie set on the response is NOT visible to SSR for this same request,
  // so we also forward it via a request header.
  const tenant = request.nextUrl.searchParams.get('tenant');

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
    // Set tenant cookie when tenant parameter is present
    response.cookies.set('tenant', tenant, {
      path: '/',
      sameSite: 'lax',
    });
  } else {
    // Clear tenant cookie when no tenant parameter (return to default tenant)
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
