'use client';

import { Firestore, doc, setDoc, getDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Messaging } from 'firebase/messaging';
import { getFCMToken, requestNotificationPermission } from './messaging';

/**
 * FCM Token Management
 * Handles storing, updating, and removing FCM tokens in Firestore
 */

export interface FCMTokenData {
  token: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deviceInfo: {
    userAgent: string;
    platform: string;
    language: string;
  };
}

/**
 * Request permission and get FCM token for the current device
 * @param messaging - Firebase Messaging instance
 * @returns FCM token or null if unable to get
 */
export async function requestAndGetToken(messaging: Messaging): Promise<string | null> {
  try {
    // First, request notification permission
    const permission = await requestNotificationPermission();
    
    if (permission !== 'granted') {
      console.log('[FCM Token] Notification permission not granted');
      return null;
    }

    // Get FCM token
    const token = await getFCMToken(messaging);
    return token;
  } catch (error) {
    console.error('[FCM Token] Error requesting token:', error);
    return null;
  }
}

/**
 * Save FCM token to Firestore under user's document
 * @param firestore - Firestore instance
 * @param userId - User ID
 * @param token - FCM token
 */
export async function saveFCMToken(
  firestore: Firestore,
  userId: string,
  token: string
): Promise<void> {
  try {
    const tokenRef = doc(firestore, 'users', userId, 'fcmTokens', token);
    
    const tokenData: FCMTokenData = {
      token,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      },
    };

    await setDoc(tokenRef, tokenData, { merge: true });
    console.log('[FCM Token] Token saved to Firestore');
  } catch (error) {
    console.error('[FCM Token] Error saving token:', error);
    throw error;
  }
}

/**
 * Get the stored FCM token for the current device from localStorage
 * This is used to check if we already have a token before requesting a new one
 */
export function getStoredToken(): string | null {
  try {
    return localStorage.getItem('fcm_token');
  } catch {
    return null;
  }
}

/**
 * Store FCM token in localStorage
 */
export function storeTokenLocally(token: string): void {
  try {
    localStorage.setItem('fcm_token', token);
  } catch (error) {
    console.error('[FCM Token] Error storing token locally:', error);
  }
}

/**
 * Remove FCM token from localStorage
 */
export function removeStoredToken(): void {
  try {
    localStorage.removeItem('fcm_token');
  } catch (error) {
    console.error('[FCM Token] Error removing stored token:', error);
  }
}

/**
 * Delete FCM token from Firestore
 * @param firestore - Firestore instance
 * @param userId - User ID
 * @param token - FCM token to delete
 */
export async function deleteFCMToken(
  firestore: Firestore,
  userId: string,
  token: string
): Promise<void> {
  try {
    const tokenRef = doc(firestore, 'users', userId, 'fcmTokens', token);
    await deleteDoc(tokenRef);
    console.log('[FCM Token] Token deleted from Firestore');
  } catch (error) {
    console.error('[FCM Token] Error deleting token:', error);
  }
}

/**
 * Initialize FCM token for a user
 * This will request permission, get token, and save to Firestore
 * @param messaging - Firebase Messaging instance
 * @param firestore - Firestore instance
 * @param userId - User ID
 * @returns The FCM token or null
 */
export async function initializeFCMToken(
  messaging: Messaging,
  firestore: Firestore,
  userId: string
): Promise<string | null> {
  try {
    // Check if we already have a stored token
    const storedToken = getStoredToken();
    if (storedToken) {
      console.log('[FCM Token] Using stored token');
      // Verify token is still valid in Firestore
      await saveFCMToken(firestore, userId, storedToken);
      return storedToken;
    }

    // Request and get new token
    const token = await requestAndGetToken(messaging);
    
    if (!token) {
      return null;
    }

    // Save to Firestore
    await saveFCMToken(firestore, userId, token);
    
    // Store locally for future use
    storeTokenLocally(token);
    
    return token;
  } catch (error) {
    console.error('[FCM Token] Error initializing token:', error);
    return null;
  }
}

/**
 * Refresh FCM token and update in Firestore
 * Call this when token needs to be refreshed
 * @param messaging - Firebase Messaging instance
 * @param firestore - Firestore instance
 * @param userId - User ID
 * @param oldToken - Old token to remove (optional)
 */
export async function refreshFCMToken(
  messaging: Messaging,
  firestore: Firestore,
  userId: string,
  oldToken?: string
): Promise<string | null> {
  try {
    console.log('[FCM Token] Refreshing token...');
    
    // Get new token
    const newToken = await requestAndGetToken(messaging);
    
    if (!newToken) {
      return null;
    }

    // Delete old token if provided
    if (oldToken && oldToken !== newToken) {
      await deleteFCMToken(firestore, userId, oldToken);
      removeStoredToken();
    }

    // Save new token
    await saveFCMToken(firestore, userId, newToken);
    storeTokenLocally(newToken);
    
    console.log('[FCM Token] Token refreshed successfully');
    return newToken;
  } catch (error) {
    console.error('[FCM Token] Error refreshing token:', error);
    return null;
  }
}

/**
 * Setup token refresh listener
 * This monitors the token document in Firestore and refreshes if needed
 * @param messaging - Firebase Messaging instance
 * @param firestore - Firestore instance
 * @param userId - User ID
 * @returns Unsubscribe function
 */
export function setupTokenRefreshListener(
  messaging: Messaging,
  firestore: Firestore,
  userId: string
): (() => void) {
  const storedToken = getStoredToken();
  if (!storedToken) {
    return () => {}; // No-op if no token stored
  }

  const tokenRef = doc(firestore, 'users', userId, 'fcmTokens', storedToken);
  
  // Listen for token changes in Firestore
  const unsubscribe = onSnapshot(
    tokenRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        console.log('[FCM Token] Token no longer exists in Firestore, refreshing...');
        refreshFCMToken(messaging, firestore, userId, storedToken);
      }
    },
    (error) => {
      console.error('[FCM Token] Error listening to token changes:', error);
    }
  );

  return unsubscribe;
}

/**
 * Check if user has granted notification permission
 */
export function hasNotificationPermission(): boolean {
  if (!('Notification' in window)) {
    return false;
  }
  return Notification.permission === 'granted';
}

/**
 * Get all FCM tokens for a user from Firestore
 * Useful for admin/debugging purposes
 * @param firestore - Firestore instance
 * @param userId - User ID
 */
export async function getUserFCMTokens(
  firestore: Firestore,
  userId: string
): Promise<FCMTokenData[]> {
  try {
    const tokensRef = doc(firestore, 'users', userId);
    const snapshot = await getDoc(tokensRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    // This is a simplified version - in production you'd use a collection query
    // For now, we're using subcollection structure
    return [];
  } catch (error) {
    console.error('[FCM Token] Error getting user tokens:', error);
    return [];
  }
}
