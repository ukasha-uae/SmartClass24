/**
 * @deprecated - Use /past-questions instead
 * This route redirects to /past-questions for global compatibility
 * Maintained for backward compatibility only
 */
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function WASSCEQuestionsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new globally-appropriate route
    router.replace('/past-questions');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Redirecting to Past Questions...</p>
      </div>
    </div>
  );
}

