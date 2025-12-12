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
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    
    if (user.isFirstLogin || !hasSeenWelcome) {
      setShowWelcome(true);
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

// Usage in a page component:
// 
// export default function HomePage() {
//   const { user } = useAuth();
//   const { WelcomeComponent } = useWelcomeExperience(user);
// 
//   return (
//     <>
//       {WelcomeComponent}
//       <MainContent />
//     </>
//   );
// }
