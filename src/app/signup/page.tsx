'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTenant } from '@/hooks/useTenant';
import AuthModal from '@/components/AuthModal';
import { getReferrerFromUrl } from '@/lib/referrals';

/**
 * Signup page with referral support
 * Handles /signup?ref={referrerUid} URLs
 */
export default function SignupPage() {
  const router = useRouter();
  const { branding } = useTenant();
  const [referrerUid, setReferrerUid] = useState<string | null>(null);

  useEffect(() => {
    // Read referrer from URL client-side only
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref') || getReferrerFromUrl();
      setReferrerUid(ref);
      
      // Store referrer UID in localStorage for use during signup
      if (ref) {
        localStorage.setItem('pendingReferrerUid', ref);
      }
    }
  }, []);

  // Redirect to home if already signed in, or show auth modal
  // The AuthModal will handle the actual signup process
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Join {branding.name}</h1>
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
