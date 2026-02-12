// Example integration for homepage or first-time user experience

'use client';

import { useState, useEffect } from 'react';
import { IntelligentWelcome } from '@/components/IntelligentWelcome';
import { useRouter } from 'next/navigation';

export function useWelcomeExperience(user: { 
  name: string; 
  campus: 'JHS' | 'SHS' | 'Primary';
  isFirstLogin?: boolean;
}) {
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logging in for the first time
    // or hasn't seen the welcome yet
    if (typeof window !== 'undefined') {
      // Check for force-show query parameter (for testing)
      const urlParams = new URLSearchParams(window.location.search);
      const forceWelcome = urlParams.get('welcome') === 'true';
      const resetWelcome = urlParams.get('welcome') === 'reset';
      
      // Reset flag if requested
      if (resetWelcome) {
        localStorage.removeItem('hasSeenWelcome');
        console.log('[useWelcomeExperience] Welcome flag reset');
        window.history.replaceState({}, '', window.location.pathname);
      }
      
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      
      // Show welcome for:
      // 1. First-time login
      // 2. Force show via query param
      // 3. Never seen welcome before
      const shouldShow = forceWelcome || user.isFirstLogin || !hasSeenWelcome;
      
      if (shouldShow) {
        console.log('[useWelcomeExperience] Showing welcome:', { 
          forceWelcome, 
          isFirstLogin: user.isFirstLogin, 
          hasSeenWelcome 
        });
        setShowWelcome(true);
      }
    }
  }, [user.isFirstLogin]);

  const handleWelcomeComplete = () => {
    // Mark welcome as seen
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
    
    // Navigate to appropriate page
    if (user.campus === 'Primary') {
      router.push('/campus/primary');
    } else if (user.campus === 'JHS') {
      router.push('/campus/jhs');
    } else {
      router.push('/campus/shs');
    }
  };

  const WelcomeComponent = showWelcome ? (
    <IntelligentWelcome
      studentName={user.name}
      campus={user.campus}
      onComplete={handleWelcomeComplete}
    />
  ) : null;

  return { showWelcome, WelcomeComponent, handleWelcomeComplete };
}

// Helper function to reset welcome in dev/testing
export function resetWelcome() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('hasSeenWelcome');
    console.log('✅ Welcome reset! Reload the page to see it again.');
  }
}

// Usage in a page component:
// 
// export default function HomePage() {
//   const { user } = useAuth();
//   const { WelcomeComponent } = useWelcomeExperience(user);
// 
//   return (
//     <>
//       {WelcomeComponent}
//       {/* Your page content */}
//     </>
//   );
// }

/**
 * TESTING THE WELCOME EXPERIENCE:
 * 
 * Method 1 - Query Parameter (Force Show):
 *   Add ?welcome=true to any URL
 *   Example: http://localhost:9002/?welcome=true
 * 
 * Method 2 - Query Parameter (Reset Flag):
 *   Add ?welcome=reset to reset and show on next page load
 *   Example: http://localhost:9002/?welcome=reset
 * 
 * Method 3 - Console Command:
 *   Open browser console and type:
 *   localStorage.removeItem('hasSeenWelcome')
 *   Then reload the page
 * 
 * Method 4 - Helper Function:
 *   Import: import { resetWelcome } from '@/hooks/useWelcomeExperience'
 *   Call: resetWelcome()
 *   Then reload
 * 
 * Method 5 - Private/Incognito:
 *   Open a NEW private/incognito window (not a new tab)
 *   Each new window starts fresh
 * 
 * Note: In private mode, localStorage persists within the same window/tab session
 */
//       {WelcomeComponent}
//       <MainContent />
//     </>
//   );
// }
