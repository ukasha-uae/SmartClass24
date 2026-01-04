/**
 * Monetization System for Challenge Arena
 * Handles premium subscriptions, coin purchases, and feature unlocks
 */

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
    icon: '👹',
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
 */
export function isPremiumUser(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const subscription = getUserSubscription(userId);
  return (subscription?.tier === 'premium' || subscription?.tier === 'full_bundle') && subscription?.isActive === true;
}

/**
 * Check if user has Virtual Lab subscription
 */
export function hasVirtualLabAccess(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const subscription = getUserSubscription(userId);
  return (subscription?.tier === 'virtual_lab' || subscription?.tier === 'full_bundle') && subscription?.isActive === true;
}

/**
 * Check if user has Full Bundle subscription (both Challenge Arena and Virtual Lab)
 */
export function hasFullBundle(userId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const subscription = getUserSubscription(userId);
  return subscription?.tier === 'full_bundle' && subscription?.isActive === true;
}

/**
 * Get user subscription
 */
export function getUserSubscription(userId: string): UserSubscription | null {
  if (typeof window === 'undefined') return null;
  
  const subscriptions = localStorage.getItem('userSubscriptions');
  if (!subscriptions) return null;
  
  const allSubscriptions: Record<string, UserSubscription> = JSON.parse(subscriptions);
  return allSubscriptions[userId] || null;
}

/**
 * Set user subscription
 */
export function setUserSubscription(userId: string, subscription: UserSubscription): void {
  if (typeof window === 'undefined') return;
  
  const subscriptions = localStorage.getItem('userSubscriptions');
  const allSubscriptions: Record<string, UserSubscription> = subscriptions 
    ? JSON.parse(subscriptions) 
    : {};
  
  allSubscriptions[userId] = subscription;
  localStorage.setItem('userSubscriptions', JSON.stringify(allSubscriptions));
}

/**
 * Check if user has access to a premium feature
 */
export function hasPremiumFeature(userId: string, feature: PremiumFeature): boolean {
  const subscription = getUserSubscription(userId);
  if (!subscription || !subscription.isActive) return false;
  
  return subscription.features.includes(feature);
}

/**
 * Get all premium features for user
 */
export function getUserPremiumFeatures(userId: string): PremiumFeature[] {
  const subscription = getUserSubscription(userId);
  if (!subscription || !subscription.isActive) return [];
  
  return subscription.features;
}

/**
 * Add a new subscription
 */
export function addSubscription(
  userId: string,
  planId: string,
  duration: 'monthly' | 'annual',
  subscriptionType: 'challengeArena' | 'virtualLab' | 'fullBundle' = 'challengeArena'
): UserSubscription {
  if (typeof window === 'undefined') {
    throw new Error('Cannot add subscription on server side');
  }

  const now = new Date();
  const endDate = duration === 'monthly'
    ? new Date(now.setMonth(now.getMonth() + 1)).toISOString()
    : new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();

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

  setUserSubscription(userId, subscription);

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
export function initializePremiumSubscription(userId: string, tier: SubscriptionTier = 'premium'): void {
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
  
  setUserSubscription(userId, subscription);
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
 * Free users: Limited question bank (e.g., 10 questions per subject - they see same questions repeating)
 * Premium users: Full question bank (all available questions for their level/subject)
 * 
 * @param userId - User ID to check premium status
 * @param freeBankLimit - Maximum questions in bank for free users (default: 10 per subject)
 * @returns Maximum number of questions available in the bank for this user
 */
export function getQuestionBankLimit(
  userId: string,
  freeBankLimit: number = 10
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

