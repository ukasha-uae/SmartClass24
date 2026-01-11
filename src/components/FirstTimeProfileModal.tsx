'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import StudentProfileSetup from './StudentProfileSetup';
import { UserPlus } from 'lucide-react';

/**
 * FirstTimeProfileModal - Shows profile setup form to new users after login
 * 
 * This modal appears when:
 * - User is authenticated (signed in)
 * - User's student profile doesn't exist or is incomplete (no studentName)
 * - User hasn't dismissed this modal yet (stored in localStorage)
 */
export default function FirstTimeProfileModal() {
  const { user, firestore } = useFirebase();
  const [open, setOpen] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  const profileDocRef = useMemo(() => 
    (firestore && user ? doc(firestore, `students/${user.uid}`) : null), 
    [firestore, user]
  );
  const { data: profile, isLoading } = useDoc<any>(profileDocRef as any);

  useEffect(() => {
    // Don't do anything while still loading or if no auth
    if (!user || !firestore) {
      return;
    }

    // CRITICAL: Only show modal for authenticated (non-anonymous) users
    // Anonymous users should not be prompted to complete profile
    if (user.isAnonymous) {
      setOpen(false);
      return;
    }

    // Wait for profile to finish loading before making decisions
    if (isLoading) {
      return;
    }

    // Check if user has already completed their profile at least once
    const completedKey = `profileCompleted_${user.uid}`;
    const hasCompletedBefore = typeof window !== 'undefined' && localStorage.getItem(completedKey) === 'true';

    // Check if profile exists and is complete (has studentName)
    const profileExists = profile && profile.studentName && profile.studentName.trim().length > 0;
    
    console.log('[Profile Modal] Checking conditions:', {
      userId: user.uid,
      isAnonymous: user.isAnonymous,
      hasCompletedBefore,
      profileExists,
      studentName: profile?.studentName,
      willShowModal: !hasCompletedBefore && !profileExists
    });
    
    // If profile is complete, mark it as completed (for future checks) and close modal
    if (profileExists) {
      setProfileComplete(true);
      if (!hasCompletedBefore) {
        localStorage.setItem(completedKey, 'true');
      }
      setOpen(false);
      return;
    }

    // Profile is incomplete - check if we should show the modal
    setProfileComplete(false);
    
    // Show modal if user hasn't completed profile before
    // For new users or users who haven't filled their profile yet
    if (!hasCompletedBefore) {
      console.log('[Profile Modal] Opening modal for new/incomplete user');
      setOpen(true);
    }
  }, [user, firestore, profile, isLoading]);


  const handleClose = () => {
    setOpen(false);
    // Don't do anything special - if they close without saving, modal can show again later
  };

  const handleSave = () => {
    // Profile was saved, close the modal and mark as completed permanently
    setOpen(false);
    if (user?.uid && typeof window !== 'undefined') {
      // Mark profile as completed - this prevents the modal from showing again
      localStorage.setItem(`profileCompleted_${user.uid}`, 'true');
    }
  };

  // Don't render modal if:
  // - No user
  // - User is anonymous
  // - Still loading profile data
  if (!user || user.isAnonymous || isLoading) {
    return null;
  }

  // Only render when modal should be open
  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        handleClose();
      }
    }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Complete Your Profile</DialogTitle>
              <DialogDescription className="text-base mt-1">
                Set up your student profile to personalize your experience and see your name throughout the app
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 px-6">
          <StudentProfileSetup onSave={handleSave} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
