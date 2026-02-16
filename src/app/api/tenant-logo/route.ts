/**
 * Serves tenant logo image so production can show it even when static public/ is not deployed.
 * GET /api/tenant-logo?tenant=wisdomwarehouse
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { TENANT_REGISTRY } from '@/tenancy/registry';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_EXT = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];

export async function GET(request: NextRequest) {
  const tenantId = request.nextUrl.searchParams.get('tenant');
  if (!tenantId || typeof tenantId !== 'string') {
    return NextResponse.json({ error: 'Missing tenant' }, { status: 400 });
  }

  const tenant = TENANT_REGISTRY[tenantId];
  const logoUrl = tenant?.branding?.logoUrl;
  if (!logoUrl || !logoUrl.startsWith('/logos/')) {
    return NextResponse.json({ error: 'No logo for tenant' }, { status: 404 });
  }

  const filename = logoUrl.replace(/^\/logos\//, '').replace(/^\.\.\//, '');
  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) {
    return NextResponse.json({ error: 'Invalid logo path' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'logos', filename);
    const body = await readFile(filePath);
    const contentType =
      ext === '.svg' ? 'image/svg+xml' : ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Logo not found' }, { status: 404 });
  }
}
