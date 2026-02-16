/**
 * Serves the PWA service worker script at /pwa-sw.js (via rewrite).
 * Ensures the SW is fetchable in dev (Turbopack) and in production (serverless),
 * where reading from public/ may fail. Falls back to inline minimal SW so install always works.
 */

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Minimal SW so install works when public/pwa-sw.js is not readable (e.g. serverless). */
const FALLBACK_SW = `self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',(e)=>e.waitUntil(self.clients.claim()));`;

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
  } catch {
    return new NextResponse(FALLBACK_SW, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Service-Worker-Allowed': '/',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
}
