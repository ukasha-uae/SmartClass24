'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFirebase } from '@/firebase/provider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * ReferralHandler - Captures referral links and prompts login for unauthenticated users
 * 
 * When a user clicks a referral link (?ref=userId):
 * - If logged in: stores referrer and processes normally
 * - If anonymous: prompts to create account to claim referral reward
 */
export function ReferralHandler() {
  const searchParams = useSearchParams();
  const { user } = useFirebase();
  const router = useRouter();
  const [showReferralPrompt, setShowReferralPrompt] = useState(false);
  const [referrerUid, setReferrerUid] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams?.get('ref');
    
    if (ref) {
      setReferrerUid(ref);
      
      // Check if user is logged in (authenticated user, not anonymous)
      if (!user || user.isAnonymous) {
        // Store referrer for after signup
        localStorage.setItem('pendingReferrerUid', ref);
        // Show prompt to sign up
        setShowReferralPrompt(true);
      } else {
        // User is already logged in - store referrer for processing
        localStorage.setItem('pendingReferrerUid', ref);
        // The Firebase provider will handle creating the referral record
      }
    }
  }, [searchParams, user]);

  const handleSignup = () => {
    // Keep the referrer in localStorage and redirect to signup
    setShowReferralPrompt(false);
    router.push('/signup');
  };

  const handleDismiss = () => {
    // User declined - clear the referrer
    localStorage.removeItem('pendingReferrerUid');
    setShowReferralPrompt(false);
    // Remove ref parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('ref');
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <Dialog open={showReferralPrompt} onOpenChange={setShowReferralPrompt}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl">
            You've Been Invited!
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            A friend invited you to join SmartClass24. Create an account to:
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <div className="flex items-start gap-3 rounded-lg bg-violet-50 dark:bg-violet-950/30 p-4 border-2 border-violet-200 dark:border-violet-800">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white font-bold">
              1
            </div>
            <div>
              <p className="font-semibold text-sm">Track Your Progress</p>
              <p className="text-xs text-muted-foreground">Save your quiz scores and achievements</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 p-4 border-2 border-indigo-200 dark:border-indigo-800">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-sm">Help Your Friend Earn Premium</p>
              <p className="text-xs text-muted-foreground">Your signup counts toward their free premium month</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 rounded-lg bg-green-50 dark:bg-green-950/30 p-4 border-2 border-green-200 dark:border-green-800">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-white font-bold">
              3
            </div>
            <div>
              <p className="font-semibold text-sm">Earn Premium Yourself</p>
              <p className="text-xs text-muted-foreground">Share with 10 friends to get 1 month premium FREE</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button 
            onClick={handleSignup}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
            size="lg"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Create Free Account
          </Button>
          <Button 
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
          >
            Maybe Later
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Already have an account? <button onClick={handleSignup} className="text-violet-600 hover:underline">Sign in</button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
