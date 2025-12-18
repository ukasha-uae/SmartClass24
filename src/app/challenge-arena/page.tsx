'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalization } from '@/hooks/useLocalization';
import { Loader2 } from 'lucide-react';

export default function ChallengeArenaPage() {
  const { country } = useLocalization();
  const router = useRouter();

  useEffect(() => {
    // Redirect to the localized challenge arena page
    const countryId = country?.id || 'ghana';
    router.replace(`/challenge-arena/${countryId}`);
  }, [country, router]);

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
