'use client';

// Disable static generation to allow useSearchParams
export const dynamic = 'force-dynamic';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import { getReferrerFromUrl } from '@/lib/referrals';

/**
 * Signup page with referral support
 * Handles /signup?ref={referrerUid} URLs
 */
function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referrerUid = searchParams?.get('ref') || getReferrerFromUrl();

  useEffect(() => {
    // Store referrer UID in localStorage for use during signup
    if (referrerUid) {
      localStorage.setItem('pendingReferrerUid', referrerUid);
    }
  }, [referrerUid]);

  // Redirect to home if already signed in, or show auth modal
  // The AuthModal will handle the actual signup process
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Join SmartClass24</h1>
          <p className="text-muted-foreground">
            Create your account to start learning
          </p>
          {referrerUid && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              You were invited by a friend!
            </p>
          )}
        </div>
        <AuthModal />
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
