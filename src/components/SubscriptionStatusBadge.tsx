'use client';

import { Badge } from '@/components/ui/badge';
import { Crown, Sparkles } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { 
  isPremiumUser, 
  hasVirtualLabAccess, 
  hasFullBundle,
  getUserSubscription,
  setUserSubscription
} from '@/lib/monetization';
import { useMemo, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTenantLink } from '@/hooks/useTenantLink';
import { useLocalization } from '@/hooks/useLocalization';
import { useTenant } from '@/hooks/useTenant';

interface SubscriptionStatusBadgeProps {
  userId?: string;
  showUpgrade?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export function SubscriptionStatusBadge({ 
  userId, 
  showUpgrade = false,
  variant = 'default',
  className = ''
}: SubscriptionStatusBadgeProps) {
  const { user, firestore, auth } = useFirebase();
  const addTenantParam = useTenantLink();
  const { country } = useLocalization();
  const { features } = useTenant();
  const [mounted, setMounted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Ensure we only access localStorage after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync subscription from Firestore when user logs in or changes
  useEffect(() => {
    if (mounted && user?.uid && firestore) {
      import('@/lib/monetization').then(({ syncSubscriptionFromFirestore }) => {
        syncSubscriptionFromFirestore(user.uid, firestore, auth).then(() => {
          // Trigger re-render after sync
          setRefreshKey(prev => prev + 1);
        }).catch(err => {
          console.warn('Failed to sync subscription:', err);
        });
      });
    }
  }, [mounted, user?.uid, firestore, auth]);

  // Listen for storage changes (in case subscription is updated in another tab)
  useEffect(() => {
    if (!mounted) return;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userSubscriptions') {
        setRefreshKey(prev => prev + 1);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [mounted]);
  
  // Try multiple user ID sources
  const targetUserId = useMemo(() => {
    if (userId) return userId;
    if (user?.uid) return user.uid;
    // Fallback to localStorage currentUserId (used by challenge system)
    // Only access localStorage after mount to prevent hydration mismatch
    if (mounted && typeof window !== 'undefined') {
      const currentUserId = localStorage.getItem('currentUserId');
      if (currentUserId) return currentUserId;
    }
    return '';
  }, [userId, user?.uid, mounted]);
  
  const subscriptionStatus = useMemo(() => {
    // During SSR or before mount, return null to prevent hydration mismatch
    if (!mounted) {
      return null;
    }
    
    // Priority: Firebase user.uid > targetUserId > currentUserId
    // Always prioritize Firebase user.uid if available
    const primaryUserId = user?.uid || targetUserId || (typeof window !== 'undefined' ? localStorage.getItem('currentUserId') : null);
    
    if (!primaryUserId) {
      // If we have a user but no ID, return free status
      if (user || userId) {
        return {
          hasBundle: false,
          isPremium: false,
          hasVirtualLab: false,
          subscription: null,
          isFree: true
        };
      }
      return null;
    }
    
    // Get all possible user IDs to check (for migration/sync purposes)
    const userIdsToCheck: string[] = [primaryUserId];
    if (user?.uid && !userIdsToCheck.includes(user.uid)) userIdsToCheck.push(user.uid);
    if (targetUserId && !userIdsToCheck.includes(targetUserId)) userIdsToCheck.push(targetUserId);
    if (typeof window !== 'undefined') {
      const currentUserId = localStorage.getItem('currentUserId');
      if (currentUserId && !userIdsToCheck.includes(currentUserId)) userIdsToCheck.push(currentUserId);
    }
    
    // Check subscription status with all possible user IDs
    let finalHasBundle = false;
    let finalIsPremium = false;
    let finalHasVirtualLab = false;
    let finalSubscription: ReturnType<typeof getUserSubscription> = null;
    
    // First, check with primary user ID (Firebase user.uid if available)
    const primaryHasBundle = hasFullBundle(primaryUserId);
    const primaryIsPremium = isPremiumUser(primaryUserId);
    const primaryHasVL = hasVirtualLabAccess(primaryUserId);
    const primarySubscription = getUserSubscription(primaryUserId);
    
    finalHasBundle = primaryHasBundle;
    finalIsPremium = primaryIsPremium;
    finalHasVirtualLab = primaryHasVL;
    finalSubscription = primarySubscription;
    
    // If no subscription found with primary ID, check other IDs (for migration)
    if (!finalSubscription && !finalHasBundle && !finalIsPremium && !finalHasVirtualLab) {
      for (const uid of userIdsToCheck) {
        if (uid === primaryUserId) continue; // Already checked
        
        const hasBundle = hasFullBundle(uid);
        const isPremium = isPremiumUser(uid);
        const hasVL = hasVirtualLabAccess(uid);
        const subscription = getUserSubscription(uid);
        
        if (hasBundle || isPremium || hasVL || subscription) {
          finalHasBundle = finalHasBundle || hasBundle;
          finalIsPremium = finalIsPremium || isPremium;
          finalHasVirtualLab = finalHasVirtualLab || hasVL;
          if (subscription && !finalSubscription) {
            finalSubscription = subscription;
            // Sync subscription to primary user ID if found under different ID
            if (primaryUserId && uid !== primaryUserId && typeof window !== 'undefined') {
              setUserSubscription(primaryUserId, subscription);
            }
          }
        }
      }
    }
    
    // Debug logging (remove in production if needed)
    if (process.env.NODE_ENV === 'development') {
      console.log('SubscriptionStatusBadge Debug:', {
        primaryUserId,
        userIdsToCheck,
        targetUserId,
        firebaseUid: user?.uid,
        currentUserId: typeof window !== 'undefined' ? localStorage.getItem('currentUserId') : null,
        hasBundle: finalHasBundle,
        isPremium: finalIsPremium,
        hasVirtualLab: finalHasVirtualLab,
        subscription: finalSubscription,
        allSubscriptions: typeof window !== 'undefined' ? localStorage.getItem('userSubscriptions') : null
      });
    }
    
    return {
      hasBundle: finalHasBundle,
      isPremium: finalIsPremium,
      hasVirtualLab: finalHasVirtualLab,
      subscription: finalSubscription,
      isFree: !finalHasBundle && !finalIsPremium && !finalHasVirtualLab
    };
  }, [targetUserId, user?.uid, mounted, refreshKey]);
  
  // During SSR or before mount, show a placeholder that matches what will be rendered
  // This prevents hydration mismatch
  if (!mounted) {
    // Show a consistent placeholder during SSR
    if (variant === 'compact') {
      return (
        <div className={`flex items-center gap-1 ${className}`}>
          <Badge variant="outline" className="border-gray-300 dark:border-gray-700 text-[10px] px-1.5 py-0.5">
            Free
          </Badge>
        </div>
      );
    }
    if (variant === 'detailed') {
      return (
        <div className={`space-y-2 ${className}`}>
          <Badge variant="outline" className="border-gray-300 dark:border-gray-700">
            Free User
          </Badge>
        </div>
      );
    }
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant="outline" className="border-gray-300 dark:border-gray-700">
          Free
        </Badge>
      </div>
    );
  }
  
  // Always show something if we have user context (even if subscriptionStatus is null)
  // This ensures the badge is visible for debugging
  if (!subscriptionStatus) {
    // If we have a user but no subscription status, show "Free"
    if (user || userId || targetUserId) {
      if (variant === 'compact') {
        return (
          <div className={`flex items-center gap-1 ${className}`}>
            <Badge variant="outline" className="border-gray-300 dark:border-gray-700 text-[10px] px-1.5 py-0.5">
              Free
            </Badge>
          </div>
        );
      }
      if (variant === 'detailed') {
        return (
          <div className={`space-y-2 ${className}`}>
            <Badge variant="outline" className="border-gray-300 dark:border-gray-700">
              Free User
            </Badge>
            <div className="flex flex-wrap gap-2">
              {features.enableReferrals && (
                <Link href="/redeem-codes">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-purple-500/10 border-purple-500/50 hover:border-purple-500 transition-colors bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Earn Premium Free
                  </Badge>
                </Link>
              )}
              {showUpgrade && (
                <Link href={addTenantParam(country ? '/pricing' : '/pricing/global')}>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10 border-primary/50 hover:border-primary transition-colors"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Buy Premium
                  </Badge>
                </Link>
              )}
            </div>
          </div>
        );
      }
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <Badge variant="outline" className="border-gray-300 dark:border-gray-700">
            Free
          </Badge>
        </div>
      );
    }
    // No user context at all - don't show anything
    return null;
  }
  
  const { hasBundle, isPremium, hasVirtualLab, subscription, isFree } = subscriptionStatus;
  
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {hasBundle ? (
          <Badge className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white text-[10px] px-1.5 py-0.5">
            <Crown className="h-2.5 w-2.5 mr-0.5" />
            Bundle
          </Badge>
        ) : isPremium ? (
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] px-1.5 py-0.5">
            <Crown className="h-2.5 w-2.5 mr-0.5" />
            Premium
          </Badge>
        ) : hasVirtualLab ? (
          <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 text-white text-[10px] px-1.5 py-0.5">
            <Crown className="h-2.5 w-2.5 mr-0.5" />
            VL
          </Badge>
        ) : (
          <Badge variant="outline" className="border-gray-300 dark:border-gray-700 text-[10px] px-1.5 py-0.5">
            Free
          </Badge>
        )}
      </div>
    );
  }
  
  if (variant === 'detailed') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2">
          {hasBundle ? (
            <Badge className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white">
              <Crown className="h-3 w-3 mr-1" />
              Full Bundle Premium
            </Badge>
          ) : isPremium ? (
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <Crown className="h-3 w-3 mr-1" />
              Challenge Arena Premium
            </Badge>
          ) : hasVirtualLab ? (
            <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
              <Crown className="h-3 w-3 mr-1" />
              Virtual Lab Premium
            </Badge>
          ) : (
            <Badge variant="outline" className="border-gray-300 dark:border-gray-700">
              Free User
            </Badge>
          )}
        </div>
        
        {subscription && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Plan: {subscription.planId || 'N/A'}</p>
            {subscription.endDate && (
              <p>Expires: {new Date(subscription.endDate).toLocaleDateString()}</p>
            )}
          </div>
        )}
        
        {isFree && (
          <div className="flex flex-wrap gap-2">
            {features.enableReferrals && (
              <Link href="/redeem-codes">
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-purple-500/10 border-purple-500/50 hover:border-purple-500 transition-colors bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Earn Premium Free
                </Badge>
              </Link>
            )}
            {showUpgrade && (
              <Link href={addTenantParam(country ? '/pricing' : '/pricing/global')}>
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary/10 border-primary/50 hover:border-primary transition-colors"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Buy Premium
                </Badge>
              </Link>
            )}
          </div>
        )}
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {hasBundle ? (
        <Badge className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white">
          <Crown className="h-3 w-3 mr-1" />
          Full Bundle
        </Badge>
      ) : isPremium ? (
        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <Crown className="h-3 w-3 mr-1" />
          Premium
        </Badge>
      ) : hasVirtualLab ? (
        <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
          <Crown className="h-3 w-3 mr-1" />
          Virtual Lab
        </Badge>
      ) : (
        <Badge variant="outline" className="border-gray-300 dark:border-gray-700">
          Free
        </Badge>
      )}
      
      {isFree && showUpgrade && (
        <Link href={addTenantParam(country ? '/pricing' : '/pricing/global')}>
          <Badge 
            variant="outline" 
            className="cursor-pointer hover:bg-primary/10 border-primary/50 hover:border-primary transition-colors text-xs"
          >
            Upgrade
          </Badge>
        </Link>
      )}
    </div>
  );
}

