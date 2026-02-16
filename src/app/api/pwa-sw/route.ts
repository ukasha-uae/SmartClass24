/**
 * Serves the PWA service worker script at /pwa-sw.js (via rewrite).
 * Ensures the SW is fetchable in dev (Turbopack) so the native install prompt can work:
 * Install button → click → browser shows "Install" and installs (no 3-dots needed).
 */

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'pwa-sw.js');
    const body = await readFile(filePath, 'utf-8');
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Service-Worker-Allowed': '/',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err) {
    console.error('[pwa-sw] Failed to serve service worker:', err);
    return new NextResponse('Service worker not found', { status: 404 });
  }
}
