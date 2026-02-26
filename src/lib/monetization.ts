/**
 * Monetization System for Challenge Arena
 * Handles premium subscriptions, coin purchases, and feature unlocks
 * 
 * IMPORTANT: Subscriptions are stored in BOTH Firestore (for cross-device sync) 
 * and localStorage (for offline access). Firestore is the source of truth.
 * 
 * NOTE:
 * Tenant-wide premium access is enforced by server-side entitlements, not by client URL/tenant state.
 */

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export type SubscriptionTier = 'free' | 'premium' | 'virtual_lab' | 'full_bundle';
export type PremiumFeature = 
  | 'boss_battle' 
  | 'tournaments' 
  | 'school_battle' 
  | 'custom_challenges'
  | 'advanced_analytics'
  | 'ad_free'
  | 'double_coins'
  | 'priority_matchmaking'
  | 'unlimited_practice'
  | 'daily_bonus'
  | 'virtual_labs'
  | 'challenge_arena';

export interface UserSubscription {
  userId: string;
  tier: SubscriptionTier;
  startDate: string;
  endDate?: string; // undefined for lifetime
  isActive: boolean;
  features: PremiumFeature[];
  planId?: string; // e.g., 'premium_monthly', 'premium_annual', 'virtual_lab_monthly', 'full_bundle_monthly'
}

export interface CoinPurchase {
  packageId: string;
  name: string;
  coins: number;
  price: number; // in GHS
  currency: string;
  bonus?: number; // bonus coins
}

// Import from payments.ts to avoid duplication
export { COIN_PACKAGES_GHS as COIN_PACKAGES } from './payments';

export const PREMIUM_FEATURES: Record<PremiumFeature, {
  name: string;
  description: string;
  icon: string;
}> = {
  boss_battle: {
    name: 'Boss Battle',
    description: 'Challenge AI bosses and earn exclusive rewards',
    icon: '🤖',
  },
  tournaments: {
    name: 'Tournaments',
    description: 'Compete in weekly and monthly tournaments',
    icon: '🏆',
  },
  school_battle: {
    name: 'School Battle',
    description: 'Compete against other schools',
    icon: '🏫',
  },
  custom_challenges: {
    name: 'Custom Challenges',
    description: 'Create and share custom challenges',
    icon: '🎯',
  },
  advanced_analytics: {
    name: 'Advanced Analytics',
    description: 'Detailed performance reports and insights',
    icon: '📊',
  },
  ad_free: {
    name: 'Ad-Free Experience',
    description: 'No ads during gameplay',
    icon: '🚫',
  },
  double_coins: {
    name: 'Double Coins',
    description: 'Earn 2x coins from all challenges',
    icon: '💰',
  },
  priority_matchmaking: {
    name: 'Priority Matchmaking',
    description: 'Faster opponent matching',
    icon: '⚡',
  },
  unlimited_practice: {
    name: 'Unlimited Practice',
    description: 'No daily limits on practice mode',
    icon: '♾️',
  },
  daily_bonus: {
    name: 'Daily Bonus',
    description: 'Extra coins and XP daily',
    icon: '🎁',
  },
  virtual_labs: {
    name: 'Virtual Labs',
    description: 'Access to all interactive science experiments',
    icon: '🧪',
  },
  challenge_arena: {
    name: 'Challenge Arena',
    description: 'Unlimited questions and all Challenge Arena features',
    icon: '⚔️',
  },
};

/**
 * Check if user has premium subscription (Challenge Arena Premium)
 * Automatically validates expiration date
 */
export function isPremiumUser(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const subscription = getUserSubscription(userId);
  if (!subscription) return false;
  
  // Double-check expiration (getUserSubscription already validates, but be extra safe)
  if (subscription.endDate && subscription.isActive) {
    const endDate = new Date(subscription.endDate);
    const now = new Date();
    if (now > endDate) {
      return false; // Expired
    }
  }
  
  return (subscription.tier === 'premium' || subscription.tier === 'full_bundle') && subscription.isActive === true;
}

/**
 * Check if user has Virtual Lab subscription
 * Automatically validates expiration date
 */
export function hasVirtualLabAccess(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const subscription = getUserSubscription(userId);
  if (!subscription) return false;
  
  // Double-check expiration (getUserSubscription already validates, but be extra safe)
  if (subscription.endDate && subscription.isActive) {
    const endDate = new Date(subscription.endDate);
    const now = new Date();
    if (now > endDate) {
      return false; // Expired
    }
  }
  
  return (subscription.tier === 'virtual_lab' || subscription.tier === 'full_bundle') && subscription.isActive === true;
}

/**
 * Check if user has Full Bundle subscription (both Challenge Arena and Virtual Lab)
 * Automatically validates expiration date
 */
/**
 * Check if user has Full Bundle subscription
 */
export function hasFullBundle(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const subscription = getUserSubscription(userId);
  if (!subscription) return false;
  
  // Double-check expiration (getUserSubscription already validates, but be extra safe)
  if (subscription.endDate && subscription.isActive) {
    const endDate = new Date(subscription.endDate);
    const now = new Date();
    if (now > endDate) {
      return false; // Expired
    }
  }
  
  return subscription.tier === 'full_bundle' && subscription.isActive === true;
}

/**
 * Get user subscription with automatic expiration validation
 */
export function getUserSubscription(userId: string): UserSubscription | null {
  if (typeof window === 'undefined') return null;
  
  const subscriptions = localStorage.getItem('userSubscriptions');
  if (!subscriptions) return null;
  
  const allSubscriptions: Record<string, UserSubscription> = JSON.parse(subscriptions);
  const subscription = allSubscriptions[userId];
  
  if (!subscription) return null;
  
  // Validate expiration date - automatically deactivate if expired
  if (subscription.endDate && subscription.isActive) {
    const endDate = new Date(subscription.endDate);
    const now = new Date();
    
    if (now > endDate) {
      // Subscription has expired - deactivate it
      subscription.isActive = false;
      allSubscriptions[userId] = subscription;
      localStorage.setItem('userSubscriptions', JSON.stringify(allSubscriptions));
    }
  }
  
  return subscription;
}

/**
 * Set user subscription
 * Saves to BOTH Firestore (for cross-device sync) and localStorage (for offline access)
 */
export function setUserSubscription(userId: string, subscription: UserSubscription, firestore?: any): void {
  if (typeof window === 'undefined') return;
  
  // Save to localStorage first (for immediate access)
  const subscriptions = localStorage.getItem('userSubscriptions');
  const allSubscriptions: Record<string, UserSubscription> = subscriptions 
    ? JSON.parse(subscriptions) 
    : {};
  
  allSubscriptions[userId] = subscription;
  localStorage.setItem('userSubscriptions', JSON.stringify(allSubscriptions));
  
  // Also save to Firestore (for cross-device sync) - do this in background
  if (firestore) {
    import('firebase/firestore').then(({ doc, setDoc }) => {
      const subscriptionRef = doc(firestore, 'subscriptions', userId);
      setDoc(subscriptionRef, subscription, { merge: true }).catch((error) => {
        console.warn('Failed to save subscription to Firestore:', error);
      });
    });
  }
}

/**
 * Bidirectional sync: Firestore <-> localStorage
 * Call this when user logs in to sync subscription across devices
 * - If subscription exists in Firestore: sync to localStorage (Firestore is source of truth)
 * - If subscription exists in localStorage but not Firestore: upload to Firestore (migration)
 */
export async function syncSubscriptionFromFirestore(userId: string, firestore: any, auth?: any): Promise<void> {
  if (typeof window === 'undefined' || !firestore) {
    console.log('[Subscription Sync] Skipped - window or firestore not available');
    return;
  }
  
  // Check if user is authenticated
  if (auth) {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== userId) {
      console.warn('[Subscription Sync] User not authenticated or user ID mismatch');
      console.warn('[Subscription Sync] Current user:', currentUser?.uid, 'Requested userId:', userId);
      // Still try to proceed - might be using anonymous auth
    }
  }
  
  try {
    const { doc, getDoc, setDoc } = await import('firebase/firestore');
    const subscriptionRef = doc(firestore, 'subscriptions', userId);
    const subscriptionSnap = await getDoc(subscriptionRef);
    
    // Check localStorage for existing subscription
    const subscriptions = localStorage.getItem('userSubscriptions');
    const allSubscriptions: Record<string, UserSubscription> = subscriptions 
      ? JSON.parse(subscriptions) 
      : {};
    const localSubscription = allSubscriptions[userId];
    
    console.log('[Subscription Sync] User ID:', userId);
    console.log('[Subscription Sync] Firestore has subscription:', subscriptionSnap.exists());
    console.log('[Subscription Sync] localStorage has subscription:', !!localSubscription);
    
    if (subscriptionSnap.exists()) {
      // Firestore has subscription - use it as source of truth
      const subscription = subscriptionSnap.data() as UserSubscription;
      console.log('[Subscription Sync] Found in Firestore:', subscription.tier, subscription.isActive);
      
      // Validate expiration
      if (subscription.endDate && subscription.isActive) {
        const endDate = new Date(subscription.endDate);
        const now = new Date();
        
        if (now > endDate) {
          subscription.isActive = false;
          // Update in Firestore
          await setDoc(subscriptionRef, subscription, { merge: true });
          console.log('[Subscription Sync] Subscription expired, deactivated');
        }
      }
      
      // Sync to localStorage
      allSubscriptions[userId] = subscription;
      localStorage.setItem('userSubscriptions', JSON.stringify(allSubscriptions));
      console.log('[Subscription Sync] Synced from Firestore to localStorage');
    } else if (localSubscription) {
      // No subscription in Firestore, but exists in localStorage - upload it (migration)
      console.log('[Subscription Sync] Found in localStorage only, uploading to Firestore:', localSubscription.tier);
      
      // Validate expiration before uploading
      if (localSubscription.endDate && localSubscription.isActive) {
        const endDate = new Date(localSubscription.endDate);
        const now = new Date();
        
        if (now > endDate) {
          localSubscription.isActive = false;
          console.log('[Subscription Sync] Local subscription expired');
        }
      }
      
      // Upload to Firestore
      try {
        await setDoc(subscriptionRef, localSubscription, { merge: true });
        console.log('[Subscription Sync] ✅ Successfully migrated subscription from localStorage to Firestore');
      } catch (writeError: any) {
        console.warn('[Subscription Sync] ⚠️ Failed to write to Firestore (will continue with localStorage only):', writeError.message);
        if (writeError.code === 'permission-denied') {
          console.warn('[Subscription Sync] Permission denied - Firestore rules may not be deployed yet.');
          console.warn('[Subscription Sync] Subscription will work locally but won\'t sync across devices until rules are deployed.');
          // Don't throw - allow app to continue with localStorage only
        } else {
          // For other errors, also don't throw - just log
          console.warn('[Subscription Sync] Error details:', writeError.code, writeError.message);
        }
        // Don't throw - gracefully degrade to localStorage only
      }
    } else {
      console.log('[Subscription Sync] No subscription found in either Firestore or localStorage');
    }
  } catch (error: any) {
    // Only log errors, don't break the app
    if (error.code === 'permission-denied') {
      console.warn('[Subscription Sync] ⚠️ Permission denied - Firestore rules may not be deployed.');
      console.warn('[Subscription Sync] App will continue using localStorage only.');
      console.warn('[Subscription Sync] To enable cross-device sync, deploy Firestore rules.');
    } else {
      console.warn('[Subscription Sync] ⚠️ Sync error (non-critical):', error.message || error);
    }
    // Don't throw - gracefully degrade to localStorage only
  }
}

/**
 * Check if user has access to a premium feature
 * Automatically validates expiration date
 */
/**
 * Check if user has specific premium feature
 */
export function hasPremiumFeature(userId: string, feature: PremiumFeature): boolean {
  const subscription = getUserSubscription(userId);
  if (!subscription || !subscription.isActive) return false;
  
  // Double-check expiration
  if (subscription.endDate) {
    const endDate = new Date(subscription.endDate);
    const now = new Date();
    if (now > endDate) {
      return false; // Expired
    }
  }
  
  return subscription.features.includes(feature);
}

/**
 * Get all premium features for user
 * Automatically validates expiration date
 */
/**
 * Get list of premium features user has access to
 */
export function getUserPremiumFeatures(userId: string): PremiumFeature[] {
  const subscription = getUserSubscription(userId);
  if (!subscription || !subscription.isActive) return [];
  
  // Double-check expiration
  if (subscription.endDate) {
    const endDate = new Date(subscription.endDate);
    const now = new Date();
    if (now > endDate) {
      return []; // Expired
    }
  }
  
  return subscription.features;
}

/**
 * Add a new subscription
 */
export function addSubscription(
  userId: string,
  planId: string,
  duration: 'monthly' | 'annual',
  subscriptionType: 'challengeArena' | 'virtualLab' | 'fullBundle' = 'challengeArena',
  firestore?: any
): UserSubscription {
  if (typeof window === 'undefined') {
    throw new Error('Cannot add subscription on server side');
  }

  const now = new Date();
  // Create a new date object to avoid mutating the original
  const endDate = duration === 'monthly'
    ? (() => {
        const date = new Date(now);
        date.setMonth(date.getMonth() + 1);
        return date.toISOString();
      })()
    : (() => {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() + 1);
        return date.toISOString();
      })();

  // Determine tier and features based on subscription type
  let tier: SubscriptionTier;
  let features: PremiumFeature[];

  if (subscriptionType === 'fullBundle') {
    tier = 'full_bundle';
    features = Object.keys(PREMIUM_FEATURES) as PremiumFeature[];
  } else if (subscriptionType === 'virtualLab') {
    tier = 'virtual_lab';
    features = ['virtual_labs'];
  } else {
    tier = 'premium';
    features = Object.keys(PREMIUM_FEATURES).filter(f => f !== 'virtual_labs' && f !== 'challenge_arena') as PremiumFeature[];
    features.push('challenge_arena');
  }

  const subscription: UserSubscription = {
    userId,
    tier,
    startDate: new Date().toISOString(),
    endDate,
    isActive: true,
    features,
    planId,
  };

  setUserSubscription(userId, subscription, firestore);

  // Update player profile
  try {
    const { getPlayerProfile, createOrUpdatePlayer } = require('./challenge');
    const player = getPlayerProfile(userId);
    if (player) {
      createOrUpdatePlayer({ ...player, isPremium: true });
    }
  } catch (error) {
    console.warn('Could not update player profile:', error);
  }

  return subscription;
}

/**
 * Initialize premium subscription (for testing/demo)
 */
export function initializePremiumSubscription(userId: string, tier: SubscriptionTier = 'premium', firestoreInstance?: any): void {
  const subscription: UserSubscription = {
    userId,
    tier,
    startDate: new Date().toISOString(),
    isActive: true,
    features: tier === 'premium' 
      ? Object.keys(PREMIUM_FEATURES) as PremiumFeature[]
      : [],
    planId: 'premium_monthly', // Default for demo
  };
  
  setUserSubscription(userId, subscription, firestoreInstance);
}

/**
 * Update subscription status
 */
export function updateSubscription(
  userId: string,
  planId: string,
  isActive: boolean
): void {
  if (typeof window === 'undefined') return;
  
  const subscription = getUserSubscription(userId);
  if (!subscription) return;
  
  // Update subscription status
  const updatedSubscription: UserSubscription = {
    ...subscription,
    isActive,
    endDate: !isActive ? new Date().toISOString() : subscription.endDate,
  };
  
  setUserSubscription(userId, updatedSubscription);
  
  // Update player profile if needed
  if (typeof window !== 'undefined') {
    try {
      const { getPlayerProfile, createOrUpdatePlayer } = require('./challenge');
      const player = getPlayerProfile(userId);
      if (player) {
        createOrUpdatePlayer({ ...player, isPremium: isActive });
      }
    } catch (error) {
      // Silently fail if challenge module not available
      console.warn('Could not update player profile:', error);
    }
  }
}

/**
 * Calculate coin multiplier based on subscription
 */
export function getCoinMultiplier(userId: string): number {
  if (hasPremiumFeature(userId, 'double_coins')) {
    return 2.0;
  }
  return 1.0;
}

/**
 * Get question bank limit based on premium status
 * Free users: Limited question bank (e.g., 20 questions per subject - they see same questions repeating)
 * Premium users: Full question bank (all available questions for their level/subject)
 * 
 * @param userId - User ID to check premium status
 * @param freeBankLimit - Maximum questions in bank for free users (default: 20 per subject)
 * @returns Maximum number of questions available in the bank for this user
 */
export function getQuestionBankLimit(
  userId: string,
  freeBankLimit: number = 20
): number {
  const isPremium = isPremiumUser(userId);
  // Premium users get unlimited (return a very large number to indicate full access)
  // Free users get limited bank
  return isPremium ? 999999 : freeBankLimit;
}

/**
 * Check if user has premium access to full question bank
 */
export function hasFullQuestionBank(userId: string): boolean {
  return isPremiumUser(userId);
}

/**
 * @deprecated Use getQuestionBankLimit instead
 * Kept for backward compatibility
 */
export function getQuestionLimit(
  userId: string,
  defaultLimit: number = 10,
  freeLimit: number = 5
): number {
  const isPremium = isPremiumUser(userId);
  return isPremium ? defaultLimit : Math.min(freeLimit, defaultLimit);
}

