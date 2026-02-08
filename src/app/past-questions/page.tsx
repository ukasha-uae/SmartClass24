'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, Trophy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useTenantLink } from '@/hooks/useTenantLink';

export default function PastQuestionsPage() {
  const router = useRouter();
  const addTenantParam = useTenantLink();

  useEffect(() => {
    // Redirect to Challenge Arena for V1
    // Past Questions standalone page is V2
    // Past questions are already accessible through Challenge Arena
    router.replace(addTenantParam('/challenge-arena/ghana'));
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-amber-500" />
            <CardTitle>Past Questions Coming in V2</CardTitle>
          </div>
          <CardDescription>
            Past questions are already accessible through Challenge Arena. 
            The standalone browsing page will be available in V2.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Past Questions Now</AlertTitle>
            <AlertDescription>
              You can practice past questions through Challenge Arena's Practice Mode, 
              Quick Match, and other game modes. Past questions are integrated into the 
              Challenge Arena question bank.
            </AlertDescription>
          </Alert>
          <Link href={addTenantParam('/challenge-arena/ghana')}>
            <Button className="w-full">
              Go to Challenge Arena
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
