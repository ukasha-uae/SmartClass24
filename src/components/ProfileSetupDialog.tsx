"use client";

import { useEffect, useState } from 'react';
import { useFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import StudentProfileSetup from './StudentProfileSetup';

/**
 * ProfileSetupDialog - Shows profile setup dialog when user signs in but has no profile
 * This component should be placed in the root layout to show globally
 */
export default function ProfileSetupDialog() {
  const { user, firestore } = useFirebase();
  const [open, setOpen] = useState(false);
  
  const profileRef = useMemo(() => 
    (user && firestore && !(user as any).isAnonymous) 
      ? doc(firestore, `students/${user.uid}`) 
      : null, 
    [user, firestore]
  );
  
  const { data: profile, isLoading } = useDoc<any>(profileRef as any);

  useEffect(() => {
    // Show dialog if:
    // 1. User is signed in (not anonymous)
    // 2. Profile is loaded (not loading)
    // 3. Profile doesn't exist or is incomplete (no studentName)
    const isAnonymous = (user as any)?.isAnonymous;
    if (user && !isAnonymous && !isLoading && profileRef) {
      const hasProfile = profile && profile.studentName;
      if (!hasProfile) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  }, [user, profile, isLoading, profileRef]);

  const handleSave = () => {
    setOpen(false);
  };

  // Don't show for anonymous users
  const isAnonymous = (user as any)?.isAnonymous;
  if (!user || isAnonymous) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Let's set up your student profile to get started. This will help us personalize your learning experience.
          </DialogDescription>
        </DialogHeader>
        <StudentProfileSetup onSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
}

