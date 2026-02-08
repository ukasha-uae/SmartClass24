/**
 * User Presence System
 * Tracks user online status for challenge targeting
 */

import { initializeFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';

export interface UserPresence {
  userId: string;
  isOnline: boolean;
  lastSeen: Date | null;
  status?: 'online' | 'away' | 'offline';
}

const PRESENCE_TIMEOUT = 30 * 1000; // 30 seconds - user is considered online if lastSeen is within this time
const HEARTBEAT_INTERVAL = 20 * 1000; // Update presence every 20 seconds
const OFFLINE_GRACE_PERIOD = 5 * 1000; // 5 seconds - grace period before marking user as offline

/**
 * Update user's presence (last seen timestamp)
 * Stores lastSeen directly in the students collection for simplicity
 */
export async function updateUserPresence(userId: string): Promise<void> {
  try {
    const { firestore, auth } = initializeFirebase();
    if (!firestore || !userId) return;
    
    // Skip for unauthenticated users
    const currentUser = auth?.currentUser;
    if (!currentUser || currentUser.isAnonymous) {
      return;
    }
    
    // Store lastSeen directly in students document
    const studentRef = doc(firestore, 'students', userId);
    await setDoc(studentRef, {
      lastSeen: serverTimestamp(),
    }, { merge: true });
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.warn('[Presence] Permission denied - user not authenticated');
      return;
    }
    console.error('Failed to update user presence:', error);
  }
}

/**
 * Get user's presence status from students collection
 */
export async function getUserPresence(userId: string): Promise<UserPresence | null> {
  try {
    const { firestore } = initializeFirebase();
    if (!firestore || !userId) return null;
    
    const studentRef = doc(firestore, 'students', userId);
    const snapshot = await getDoc(studentRef);
    
    if (!snapshot.exists()) return null;
    
    const data = snapshot.data();
    const lastSeen = data.lastSeen?.toDate?.() || null;
    const isOnline = isUserOnline(lastSeen);
    
    return {
      userId,
      isOnline,
      lastSeen,
      status: isOnline ? 'online' : 'offline',
    };
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.warn('[Presence] Permission denied - skipping presence check');
      return null;
    }
    console.error('Failed to get user presence:', error);
    return null;
  }
}

/**
 * Mark user as offline immediately
 */
export async function markUserOffline(userId: string): Promise<void> {
  try {
    const { firestore, auth } = initializeFirebase();
    if (!firestore || !userId) return;
    
    // Skip for unauthenticated users
    const currentUser = auth?.currentUser;
    if (!currentUser || currentUser.isAnonymous) {
      return;
    }
    
    const studentRef = doc(firestore, 'students', userId);
    await setDoc(studentRef, {
      lastSeen: new Date(Date.now() - PRESENCE_TIMEOUT - 1000), // Set to past timestamp to mark as offline
      isOnline: false,
    }, { merge: true });
    
    console.log('[Presence] User marked offline:', userId);
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.warn('[Presence] Permission denied - user not authenticated');
      return;
    }
    console.error('[Presence] Failed to mark user offline:', error);
  }
}

/**
 * Start heartbeat to keep user presence active
 * Returns cleanup function to stop heartbeat
 */
export function startPresenceHeartbeat(userId: string): () => void {
  if (!userId) return () => {};
  
  console.log('[Presence] Starting heartbeat for:', userId);
  
  // Update immediately
  updateUserPresence(userId);
  
  // Then update periodically
  const interval = setInterval(() => {
    if (!document.hidden) { // Only update when tab is visible
      updateUserPresence(userId);
    }
  }, HEARTBEAT_INTERVAL);
  
  // Update on page visibility change
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Tab hidden - mark last activity
      console.log('[Presence] Tab hidden');
    } else {
      // Tab visible again - update presence immediately
      console.log('[Presence] Tab visible - updating presence');
      updateUserPresence(userId);
    }
  };
  
  // Mark user offline when closing/leaving page
  const handleBeforeUnload = () => {
    console.log('[Presence] Page unloading - marking offline');
    // Use navigator.sendBeacon for reliability on page unload
    markUserOffline(userId);
  };
  
  // Handle mobile app going to background
  const handlePageHide = () => {
    console.log('[Presence] Page hidden (mobile background)');
    markUserOffline(userId);
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('pagehide', handlePageHide);
  
  // Cleanup function
  return () => {
    console.log('[Presence] Stopping heartbeat for:', userId);
    clearInterval(interval);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('pagehide', handlePageHide);
    
    // Mark offline on cleanup
    markUserOffline(userId);
  };
}

/**
 * Check if a user is online based on lastSeen timestamp
 */
export function isUserOnline(lastSeen: Date | null | undefined): boolean {
  if (!lastSeen) return false;
  const now = new Date();
  return (now.getTime() - lastSeen.getTime()) < PRESENCE_TIMEOUT;
}

/**
 * Validate if a user is currently online before creating a challenge
 * Returns {isOnline: boolean, lastSeenMinutesAgo: number}
 */
export async function validateUserOnlineForChallenge(userId: string): Promise<{
  isOnline: boolean;
  lastSeenMinutesAgo: number | null;
  message: string;
}> {
  const presence = await getUserPresence(userId);
  
  if (!presence || !presence.lastSeen) {
    return {
      isOnline: false,
      lastSeenMinutesAgo: null,
      message: 'User has never been online',
    };
  }
  
  const minutesAgo = Math.floor((Date.now() - presence.lastSeen.getTime()) / 60000);
  
  if (presence.isOnline) {
    return {
      isOnline: true,
      lastSeenMinutesAgo: minutesAgo,
      message: 'User is online now',
    };
  } else {
    return {
      isOnline: false,
      lastSeenMinutesAgo: minutesAgo,
      message: `User was last seen ${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`,
    };
  }
}


