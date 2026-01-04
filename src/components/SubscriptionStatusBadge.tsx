'use client';

import { Badge } from '@/components/ui/badge';
import { Crown, Sparkles } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { 
  isPremiumUser, 
  hasVirtualLabAccess, 
  hasFullBundle,
  getUserSubscription 
} from '@/lib/monetization';
import { useMemo } from 'react';
import Link from 'next/link';

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
  const { user } = useFirebase();
  
  // Try multiple user ID sources
  const targetUserId = useMemo(() => {
    if (userId) return userId;
    if (user?.uid) return user.uid;
    // Fallback to localStorage currentUserId (used by challenge system)
    if (typeof window !== 'undefined') {
      const currentUserId = localStorage.getItem('currentUserId');
      if (currentUserId) return currentUserId;
    }
    return '';
  }, [userId, user?.uid]);
  
  const subscriptionStatus = useMemo(() => {
    // Get all possible user IDs to check
    const userIdsToCheck: string[] = [];
    if (targetUserId) userIdsToCheck.push(targetUserId);
    if (user?.uid && !userIdsToCheck.includes(user.uid)) userIdsToCheck.push(user.uid);
    if (typeof window !== 'undefined') {
      const currentUserId = localStorage.getItem('currentUserId');
      if (currentUserId && !userIdsToCheck.includes(currentUserId)) userIdsToCheck.push(currentUserId);
    }
    
    // If no user IDs found, return a default "free" status if user exists
    if (userIdsToCheck.length === 0) {
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
    
    // Check subscription status with all possible user IDs
    let finalHasBundle = false;
    let finalIsPremium = false;
    let finalHasVirtualLab = false;
    let finalSubscription: ReturnType<typeof getUserSubscription> = null;
    
    for (const uid of userIdsToCheck) {
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
        }
      }
    }
    
    // Debug logging (remove in production if needed)
    if (process.env.NODE_ENV === 'development') {
      console.log('SubscriptionStatusBadge Debug:', {
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
  }, [targetUserId, user?.uid]);
  
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
            {showUpgrade && (
              <Link href="/pricing">
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary/10 border-primary/50 hover:border-primary transition-colors"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Upgrade to Premium
                </Badge>
              </Link>
            )}
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
        
        {isFree && showUpgrade && (
          <Link href="/pricing">
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary/10 border-primary/50 hover:border-primary transition-colors"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Upgrade to Premium
            </Badge>
          </Link>
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
        <Link href="/pricing">
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

