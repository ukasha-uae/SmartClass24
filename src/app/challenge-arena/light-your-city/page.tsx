'use client';

/**
 * Light Your City – Large-screen Arena Demo
 * Two teams power up their city; first to 100% wins.
 */

import { useTenant } from '@/hooks/useTenant';
import { useTenantLink } from '@/hooks/useTenantLink';
import { ArenaScreen } from '@/components/arena/ArenaScreen';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function LightYourCityPage() {
  const { hasArenaChallenge } = useTenant();
  const addTenantParam = useTenantLink();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Back link */}
      <div className="absolute top-4 left-4 z-10">
        <Link href={addTenantParam('/challenge-arena')}>
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Arena
          </Button>
        </Link>
      </div>

      {!hasArenaChallenge ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
          <p className="text-muted-foreground mb-4">Arena Challenge is not available for your school.</p>
          <Link href={addTenantParam('/challenge-arena')}>
            <Button>Return to Arena</Button>
          </Link>
        </div>
      ) : (
        <ArenaScreen
          arenaId="light-your-city"
          autoPlay={false}
          leftColor="#f59e0b"
          rightColor="#3b82f6"
        />
      )}
    </div>
  );
}
