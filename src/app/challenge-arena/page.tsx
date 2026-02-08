'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocalization } from '@/hooks/useLocalization';
import { Loader2 } from 'lucide-react';

export default function ChallengeArenaPage() {
  const { country } = useLocalization();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Redirect to the localized challenge arena page, preserving education level and tenant
    const countryId = country?.id || 'ghana';
    
    // Get saved education level from localStorage to preserve user's selection
    let levelParam = '';
    if (typeof window !== 'undefined') {
      const savedLevel = localStorage.getItem('userEducationLevel');
      if (savedLevel && (savedLevel === 'Primary' || savedLevel === 'JHS' || savedLevel === 'SHS')) {
        levelParam = `?level=${savedLevel}`;
      }
    }
    const tenantParam = searchParams?.get('tenant');
    const separator = levelParam ? '&' : '?';
    const tenantSuffix = tenantParam ? `${separator}tenant=${tenantParam}` : '';

    router.replace(`/challenge-arena/${countryId}${levelParam}${tenantSuffix}`);
  }, [country, router, searchParams]);

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
