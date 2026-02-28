'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { hasVirtualLabAccess, isPremiumUser } from '@/lib/monetization';
import { useFirebase } from '@/firebase/provider';
import type { EntitlementFeature } from '@/lib/entitlements/types';

type EntitlementsApiResponse = {
  access: Record<EntitlementFeature, boolean>;
  tenant: { id: string; name: string };
  user: { uid: string | null; claimsTenantId: string | null; claimsRole: string | null };
  sources: {
    tenantLicense: boolean;
    individualSubscription: boolean;
    virtualLabSubscription: boolean;
  };
  reasons: string[];
};

async function postEntitlementAudit(payload: Record<string, unknown>) {
  try {
    await fetch('/api/entitlements/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Ignore telemetry failures.
  }
}

export function useEntitlements() {
  const { user, isUserLoading } = useFirebase();
  const [data, setData] = useState<EntitlementsApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mismatchLoggedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const headers: Record<string, string> = {};
        if (user) {
          const token = await user.getIdToken();
          headers.Authorization = `Bearer ${token}`;
        }

        let endpoint = '/api/entitlements/me';
        if (typeof window !== 'undefined') {
          const tenantPreview = new URLSearchParams(window.location.search).get('tenant');
          if (tenantPreview) {
            endpoint = `/api/entitlements/me?tenant=${encodeURIComponent(tenantPreview)}`;
          }
        }
        if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
          const host = window.location.hostname;
          const tenantPreview = new URLSearchParams(window.location.search).get('tenant');
          const isLocalDevHost = host === 'localhost' || host === '127.0.0.1';
          if (isLocalDevHost && tenantPreview) {
            endpoint = `/api/entitlements/me?devPreviewTenant=${encodeURIComponent(tenantPreview)}`;
          }
        }

        const res = await fetch(endpoint, {
          method: 'GET',
          headers,
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`Entitlements request failed (${res.status})`);
        }

        const payload = (await res.json()) as EntitlementsApiResponse;
        if (!cancelled) {
          setData(payload);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load entitlements');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    if (!isUserLoading) {
      load();
    }

    return () => {
      cancelled = true;
    };
  }, [user, isUserLoading]);

  useEffect(() => {
    if (!data || mismatchLoggedRef.current) return;
    if (!user?.uid) return;

    const legacyPremium = isPremiumUser(user.uid);
    const legacyVirtualLabs = hasVirtualLabAccess(user.uid);
    const serverPremium = data.access.challenge_arena_premium;
    const serverVirtualLabs = data.access.virtual_labs_premium;

    if (legacyPremium !== serverPremium || legacyVirtualLabs !== serverVirtualLabs) {
      mismatchLoggedRef.current = true;
      postEntitlementAudit({
        event: 'dual_read_mismatch',
        uid: user.uid,
        tenantId: data.tenant.id,
        legacyPremium,
        serverPremium,
        legacyVirtualLabs,
        serverVirtualLabs,
      });
    }
  }, [data, user]);

  const canAccess = useMemo(() => {
    const access = data?.access;
    return {
      challengeArenaPremium: !!access?.challenge_arena_premium,
      tournaments: !!access?.arena_tournaments,
      bossBattle: !!access?.arena_boss_battle,
      schoolBattle: !!access?.arena_school_battle,
      virtualLabsPremium: !!access?.virtual_labs_premium,
      byFeature(feature: EntitlementFeature) {
        return !!access?.[feature];
      },
    };
  }, [data]);

  return {
    isLoading,
    error,
    data,
    canAccess,
    isResolved: !isUserLoading && !isLoading,
  };
}
