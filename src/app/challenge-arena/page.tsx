'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalization } from '@/hooks/useLocalization';
import { useTenant } from '@/hooks/useTenant';
import { useTenantLink } from '@/hooks/useTenantLink';
import { Loader2 } from 'lucide-react';

export default function ChallengeArenaPage() {
  const { country } = useLocalization();
  const { hasArenaChallenge, hasLocalization, market, tenantId } = useTenant();
  const router = useRouter();
  const addTenantParam = useTenantLink();

  useEffect(() => {
    // Check if tenant has arena challenge enabled
    if (!hasArenaChallenge) {
      // Redirect to home page if arena is not available for this tenant
      router.replace(addTenantParam('/'));
      return;
    }

    // Redirect to the global challenge arena page
    // The [country] page will handle tenant-specific routing and localization
    const countryId = 'global';
    
    // Get saved education level from localStorage to preserve user's selection
    let levelParam = '';
    if (typeof window !== 'undefined') {
      const savedLevel = localStorage.getItem('userEducationLevel');
      if (savedLevel && (savedLevel === 'Primary' || savedLevel === 'JHS' || savedLevel === 'SHS')) {
        levelParam = `?level=${savedLevel}`;
      }
    }
    const separator = levelParam ? '&' : '?';
    const tenantSuffix = tenantId && tenantId !== 'smartclass24' ? `${separator}tenant=${tenantId}` : '';

    router.replace(`/challenge-arena/${countryId}${levelParam}${tenantSuffix}`);
  }, [country, router, hasArenaChallenge, market, tenantId, addTenantParam]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to Challenge Arena...</p>
        </div>
      </div>
    </div>
  );
}
