'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export default function StudyGroupsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Challenge Arena for V1
    // Study Groups is a V2 feature
    router.replace('/challenge-arena/ghana');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <AlertCircle className="h-8 w-8 text-amber-500 mb-4" />
          <CardTitle>Study Groups Coming in V2</CardTitle>
          <CardDescription>
            Study Groups is a social feature that will be available in V2.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTitle>V1 Focus</AlertTitle>
            <AlertDescription>
              For V1, we're focusing on Challenge Arena and Virtual Labs. 
              Study Groups and other social features will be available in V2.
            </AlertDescription>
          </Alert>
          <Link href="/challenge-arena/ghana">
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
