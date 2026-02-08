/**
 * Referral System
 * Allows students to earn 1 month premium access by inviting 10 friends
 * Users can continue earning - every 10 validated referrals = 1 additional month
 * 
 * Rules:
 * - 10 valid referral codes = 1 month premium
 * - After redeeming 10, counter resets and user can earn another month
 * - Codes only become valid after referred user completes profile and activity
 * - No self-referrals
 * - One-time use only
 * - Each code tied to unique user
 * - Existing premium users can earn extensions
 */

import { initializeFirebase } from '@/firebase';
import { addSubscription, type UserSubscription } from './monetization';

export interface Referral {
  code: string;
  referrerUid: string;
  referredUid: string | null;
  isUsed: boolean;
  isValidated: boolean; // True after referred user completes profile + activity
  isRedeemed?: boolean; // True after referrer has redeemed these 10 codes for premium
  createdAt: string;
  validatedAt?: string;
  redeemedAt?: string;
}

export interface UserReferralStats {
  referralCount: number; // Unredeemed validated referrals (toward next premium month)
  totalReferrals: number; // All referrals (including unvalidated)
  codesRedeemed: number; // Codes this user has redeemed
  premiumEarned: boolean; // Whether premium was ever earned via referrals
  referralRedemptions?: number; // How many times user has earned premium (each = 1 month)
}

/**
 * Generate a unique referral code for a user
 * Format: REF-{first 8 chars of UID}-{random 4 chars}
 */
export function generateReferralCode(userId: string): string {
  const uidPrefix = userId.substring(0, 8).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `REF-${uidPrefix}-${randomSuffix}`;
}

/**
 * Get user's referral link
 */
export function getReferralLink(referrerUid: string): string {
  if (typeof window === 'undefined') {
    return `https://smartclass24.com/signup?ref=${referrerUid}`;
  }
  const baseUrl = window.location.origin;
  return `${baseUrl}/signup?ref=${referrerUid}`;
}

/**
 * Extract referrer UID from URL parameter
 */
export function getReferrerFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('ref');
}

/**
 * Create a referral code for a new user after signup
 * This code can be shared by the new user to invite others
 */
export async function createUserReferralCode(
  userId: string,
  referrerUid: string | null
): Promise<string | null> {
  try {
    const { firestore, auth } = initializeFirebase();
    if (!firestore) {
      console.error('[Referrals] Firestore not available');
      return null;
    }
    const currentUser = auth?.currentUser;
    if (!currentUser || currentUser.isAnonymous) {
      console.warn('[Referrals] Skipping referral code creation for anonymous user');
      return null;
    }

    const { doc, setDoc, getDoc } = await import('firebase/firestore');
    
    // Generate unique code for this user
    const code = generateReferralCode(userId);
    
    // Check if code already exists (shouldn't happen, but safety check)
    const codeRef = doc(firestore, 'referrals', code);
    const codeSnap = await getDoc(codeRef);
    
    if (codeSnap.exists()) {
      // Code collision - try again with different random suffix
      const newCode = generateReferralCode(userId + Date.now().toString());
      const newCodeRef = doc(firestore, 'referrals', newCode);
      await setDoc(newCodeRef, {
        code: newCode,
        referrerUid: userId,
        referredUid: null,
        isUsed: false,
        isValidated: false,
        createdAt: new Date().toISOString(),
      });
      return newCode;
    }
    
    // Create the referral code document
    await setDoc(codeRef, {
      code,
      referrerUid: userId, // This user can share this code
      referredUid: null, // Will be set when someone uses this code
      isUsed: false,
      isValidated: false,
      createdAt: new Date().toISOString(),
    });
    
    // If user signed up via referral link, create the referral record
    if (referrerUid && referrerUid !== userId) {
      await createReferralRecord(referrerUid, userId, code);
    }
    
    return code;
  } catch (error: any) {
    const isPermissionDenied =
      error?.code === 'permission-denied' ||
      (typeof error?.message === 'string' && error.message.includes('Missing or insufficient permissions'));
    if (isPermissionDenied) {
      console.warn('[Referrals] Permission denied - cannot create referral code');
      return null;
    }
    console.error('[Referrals] Error creating referral code:', error);
    return null;
  }
}

/**
 * Create a referral record when user signs up via referral link
 */
export async function createReferralRecord(
  referrerUid: string,
  referredUid: string,
  code: string
): Promise<void> {
  try {
    const { firestore, auth } = initializeFirebase();
    if (!firestore) return;
    const currentUser = auth?.currentUser;
    if (!currentUser || currentUser.isAnonymous) {
      console.warn('[Referrals] Skipping referral record creation for anonymous user');
      return;
    }

    const { collection, addDoc, query, where, getDocs } = await import('firebase/firestore');
    const referralsRef = collection(firestore, 'referrals');
    
    // Check if this referral already exists (prevent duplicates)
    const existingQuery = query(
      referralsRef,
      where('referrerUid', '==', referrerUid),
      where('referredUid', '==', referredUid)
    );
    const existingSnapshot = await getDocs(existingQuery);
    
    if (!existingSnapshot.empty) {
      // Referral already exists
      return;
    }
    
    // Create referral record (use auto-generated ID to allow multiple referrals per referrer)
    await addDoc(referralsRef, {
      referrerUid,
      referredUid,
      code,
      isUsed: true,
      isValidated: false,
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.warn('[Referrals] Permission denied - cannot create referral record');
      return;
    }
    console.error('[Referrals] Error creating referral record:', error);
  }
}

/**
 * Validate a referral (mark as validated after user completes activity)
 * Called after user completes profile setup and at least one quiz/lesson
 */
export async function validateReferral(
  referredUserId: string
): Promise<boolean> {
  try {
    const { firestore } = initializeFirebase();
    if (!firestore) return false;

    const { collection, query, where, getDocs, setDoc, doc } = await import('firebase/firestore');
    const referralsRef = collection(firestore, 'referrals');
    
    // Find referral where this user is the referred user
    const q = query(
      referralsRef,
      where('referredUid', '==', referredUserId),
      where('isUsed', '==', true),
      where('isValidated', '==', false)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return false; // No referral to validate
    }
    
    // Validate the referral
    const referralDoc = querySnapshot.docs[0];
    await setDoc(referralDoc.ref, {
      isValidated: true,
      validatedAt: new Date().toISOString(),
    }, { merge: true });
    
    // Update referrer's referral count
    const referralData = referralDoc.data() as Referral;
    await updateReferralCount(referralData.referrerUid);
    
    return true;
  } catch (error: any) {
    console.error('[Referrals] Error validating referral:', error);
    return false;
  }
}

/**
 * Get user's referral statistics
 */
export async function getUserReferralStats(userId: string): Promise<UserReferralStats | null> {
  try {
    const { firestore } = initializeFirebase();
    if (!firestore) return null;

    const { collection, query, where, getDocs, doc, getDoc } = await import('firebase/firestore');
    const referralsRef = collection(firestore, 'referrals');
    
    // Get validated but NOT YET REDEEMED referrals (counts toward NEXT premium)
    // This allows users to keep earning after they've already redeemed 10
    const validatedQuery = query(
      referralsRef,
      where('referrerUid', '==', userId),
      where('isValidated', '==', true)
    );
    const validatedSnapshot = await getDocs(validatedQuery);
    
    // Filter out redeemed referrals
    const unredeemedReferrals = validatedSnapshot.docs.filter(
      doc => !(doc.data() as any).isRedeemed
    );
    const referralCount = unredeemedReferrals.length;
    
    // Get total referrals (all referrals by this user)
    const totalQuery = query(
      referralsRef,
      where('referrerUid', '==', userId)
    );
    const totalSnapshot = await getDocs(totalQuery);
    const totalReferrals = totalSnapshot.size;
    
    // Get codes redeemed by this user
    const redeemedQuery = query(
      referralsRef,
      where('referredUid', '==', userId),
      where('isUsed', '==', true)
    );
    const redeemedSnapshot = await getDocs(redeemedQuery);
    const codesRedeemed = redeemedSnapshot.size;
    
    // Check how many times user has earned premium from referrals
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    const referralRedemptions = userSnap.exists() ? (userSnap.data().referralRedemptions || 0) : 0;
    
    // premiumEarned is true if they've ever earned premium via referrals
    const premiumEarned = referralRedemptions > 0;
    
    return {
      referralCount,
      totalReferrals,
      codesRedeemed,
      premiumEarned,
      referralRedemptions, // How many times they've earned premium (each = 1 month)
    };
  } catch (error: any) {
    console.error('[Referrals] Error getting referral stats:', error);
    return null;
  }
}

/**
 * Update referral count for a user
 * Checks if threshold reached and grants premium if needed
 * Users can earn multiple times - every 10 validated referrals = 1 month premium
 */
async function updateReferralCount(userId: string): Promise<void> {
  try {
    const stats = await getUserReferralStats(userId);
    if (!stats) return;
    
    // Grant premium for every 10 unredeemed validated referrals
    // This allows users to keep earning even if they already have premium
    if (stats.referralCount >= 10) {
      await grantPremiumFromReferrals(userId);
    }
  } catch (error: any) {
    console.error('[Referrals] Error updating referral count:', error);
  }
}

/**
 * Grant 1 month premium access from referrals
 */
async function grantPremiumFromReferrals(userId: string): Promise<boolean> {
  try {
    const { firestore } = initializeFirebase();
    if (!firestore) return false;

    const { getUserSubscription } = await import('./monetization');
    const existingSub = getUserSubscription(userId);
    
    const now = new Date();
    let startDate: Date;
    let endDate: Date;
    
    // If user has active premium, extend from their current end date
    // Otherwise, start from now
    if (existingSub && existingSub.isActive && existingSub.endDate && new Date(existingSub.endDate) > now) {
      startDate = new Date(existingSub.endDate); // Start extension from current expiry
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1); // Add 1 month to their existing subscription
    } else {
      // No active premium, start fresh
      startDate = now;
      endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 1);
    }
    
    const subscription: UserSubscription = {
      userId,
      tier: existingSub?.tier || 'premium', // Keep their existing tier if they have one
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: true,
      features: existingSub?.features || ['boss_battle', 'tournaments', 'school_battle', 'challenge_arena'],
      planId: 'referral_premium',
    };
    
    const { setUserSubscription } = await import('./monetization');
    await setUserSubscription(userId, subscription, firestore);
    
    // Mark this batch of 10 referrals as redeemed
    // We'll create a new field to track how many times they've earned premium
    const { doc, setDoc, getDoc, updateDoc, increment } = await import('firebase/firestore');
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    const currentRedemptions = userSnap.exists() ? (userSnap.data().referralRedemptions || 0) : 0;
    
    await setDoc(userRef, {
      referralRedemptions: currentRedemptions + 1, // Track how many times they've redeemed
      lastReferralRedemptionAt: now.toISOString(),
    }, { merge: true });
    
    // Archive the 10 referrals that were just redeemed
    // Mark them as redeemed so they don't count toward the next 10
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const referralsRef = collection(firestore, 'referrals');
    const validatedQuery = query(
      referralsRef,
      where('referrerUid', '==', userId),
      where('isValidated', '==', true),
      where('isRedeemed', '!=', true) // Only get unredeemed validated referrals
    );
    const validatedSnapshot = await getDocs(validatedQuery);
    
    // Mark first 10 as redeemed
    let count = 0;
    for (const docRef of validatedSnapshot.docs) {
      if (count >= 10) break;
      await updateDoc(docRef.ref, {
        isRedeemed: true,
        redeemedAt: now.toISOString(),
      });
      count++;
    }
    
    return true;
  } catch (error: any) {
    console.error('[Referrals] Error granting premium:', error);
    return false;
  }
}

/**
 * Redeem a referral code (manual entry)
 */
export async function redeemReferralCode(
  userId: string,
  code: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { firestore } = initializeFirebase();
    if (!firestore) {
      return { success: false, message: 'System error. Please try again.' };
    }

    const { doc, getDoc, collection, query, where, getDocs } = await import('firebase/firestore');
    
    // Check if code exists (codes are stored as documents in referrals collection)
    const codeRef = doc(firestore, 'referrals', code);
    const codeSnap = await getDoc(codeRef);
    
    if (!codeSnap.exists()) {
      return { success: false, message: 'Invalid code. Please check and try again.' };
    }
    
    const codeData = codeSnap.data() as Referral;
    
    // Check if user is trying to use their own code
    if (codeData.referrerUid === userId) {
      return { success: false, message: 'You cannot use your own referral code.' };
    }
    
    // Check if user has already used this code (check for existing referral record)
    const referralsRef = collection(firestore, 'referrals');
    const existingQuery = query(
      referralsRef,
      where('referrerUid', '==', codeData.referrerUid),
      where('referredUid', '==', userId)
    );
    const existingSnapshot = await getDocs(existingQuery);
    if (!existingSnapshot.empty) {
      return { success: false, message: 'You have already used this code.' };
    }
    
    // Create referral record (code is now used by this user)
    const { addDoc } = await import('firebase/firestore');
    await addDoc(referralsRef, {
      referrerUid: codeData.referrerUid,
      referredUid: userId,
      code: code,
      isUsed: true,
      isValidated: false, // Will be validated after user completes activity
      createdAt: new Date().toISOString(),
    });
    
    return { 
      success: true, 
      message: 'Code redeemed! Complete your profile and finish your first activity to activate it.' 
    };
  } catch (error: any) {
    console.error('[Referrals] Error redeeming code:', error);
    return { success: false, message: 'Error redeeming code. Please try again.' };
  }
}
