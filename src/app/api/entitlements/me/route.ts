import { NextRequest, NextResponse } from 'next/server';
import { evaluateEntitlements } from '@/lib/entitlements/evaluate';
import type { SubscriptionSnapshot } from '@/lib/entitlements/types';
import { getDefaultTenant, getTenantByHost, getTenantById } from '@/tenancy/registry';

type VerifiedToken = {
  uid: string;
  email: string | null;
  claimsTenantId: string | null;
  claimsRole: string | null;
};

function parseBearerToken(request: NextRequest): string | null {
  const header = request.headers.get('authorization');
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

function parseFirestoreString(field: any): string | undefined {
  if (!field || typeof field !== 'object') return undefined;
  if (typeof field.stringValue === 'string') return field.stringValue;
  return undefined;
}

function parseFirestoreBoolean(field: any): boolean | undefined {
  if (!field || typeof field !== 'object') return undefined;
  if (typeof field.booleanValue === 'boolean') return field.booleanValue;
  return undefined;
}

function parseFirestoreArray(field: any): string[] | undefined {
  const values = field?.arrayValue?.values;
  if (!Array.isArray(values)) return undefined;
  return values.map((v: any) => v?.stringValue).filter((v: unknown): v is string => typeof v === 'string');
}

async function verifyFirebaseIdToken(idToken: string): Promise<VerifiedToken | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ idToken }),
    }
  );

  if (!response.ok) return null;

  const payload = (await response.json()) as {
    users?: Array<{ localId?: string; email?: string; customAttributes?: string }>;
  };
  const user = payload.users?.[0];
  if (!user?.localId) return null;

  let claimsTenantId: string | null = null;
  let claimsRole: string | null = null;

  if (user.customAttributes) {
    try {
      const claims = JSON.parse(user.customAttributes) as Record<string, unknown>;
      if (typeof claims.tenantId === 'string') claimsTenantId = claims.tenantId;
      if (typeof claims.role === 'string') claimsRole = claims.role;
    } catch {
      // Ignore malformed claim payload.
    }
  }

  return {
    uid: user.localId,
    email: user.email ?? null,
    claimsTenantId,
    claimsRole,
  };
}

async function fetchSubscriptionSnapshot(
  uid: string,
  idToken: string
): Promise<SubscriptionSnapshot | null> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    projectId
  )}/databases/(default)/documents/subscriptions/${encodeURIComponent(uid)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    cache: 'no-store',
  });

  if (response.status === 404) return null;
  if (!response.ok) return null;

  const payload = (await response.json()) as { fields?: Record<string, any> };
  const fields = payload.fields ?? {};

  return {
    tier: parseFirestoreString(fields.tier),
    isActive: parseFirestoreBoolean(fields.isActive),
    endDate: parseFirestoreString(fields.endDate),
    features: parseFirestoreArray(fields.features),
  };
}

function resolveRequestTenant(request: NextRequest) {
  const headerTenant = request.headers.get('x-tenant');
  const hostname = request.headers.get('host')?.split(':')[0] ?? null;
  const hostTenant = getTenantByHost(hostname)?.id ?? null;

  const tenantFromTrustedRequest = headerTenant ?? hostTenant;
  return getTenantById(tenantFromTrustedRequest) ?? getDefaultTenant();
}

export async function GET(request: NextRequest) {
  let requestTenant = resolveRequestTenant(request);
  const bearerToken = parseBearerToken(request);

  let verified: VerifiedToken | null = null;
  let subscription: SubscriptionSnapshot | null = null;

  if (bearerToken) {
    verified = await verifyFirebaseIdToken(bearerToken);
    if (verified?.uid) {
      subscription = await fetchSubscriptionSnapshot(verified.uid, bearerToken);
    }
  }

  // Local-only testing helper:
  // allows QA to simulate tenant-claim access on localhost without weakening production.
  const devPreviewTenant = request.nextUrl.searchParams.get('devPreviewTenant');
  if (process.env.NODE_ENV !== 'production' && devPreviewTenant) {
    const previewTenant = getTenantById(devPreviewTenant);
    if (previewTenant) {
      requestTenant = previewTenant;
    }
  }

  const evaluated = evaluateEntitlements({
    tenant: requestTenant,
    user: {
      uid: verified?.uid ?? null,
      email: verified?.email ?? null,
      claimsTenantId: verified?.claimsTenantId ?? null,
      claimsRole: verified?.claimsRole ?? null,
      hasTenantClaim: !!verified?.claimsTenantId,
    },
    subscription,
  });

  return NextResponse.json(
    {
      tenant: {
        id: requestTenant.id,
        name: requestTenant.name,
      },
      user: {
        uid: verified?.uid ?? null,
        claimsTenantId: verified?.claimsTenantId ?? null,
        claimsRole: verified?.claimsRole ?? null,
      },
      access: evaluated.access,
      sources: evaluated.sources,
      reasons: evaluated.reasons,
      rollout: {
        mode: 'enforce',
      },
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
