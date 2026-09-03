/**
 * User Presence System
 * Tracks user online status for challenge targeting
 */

import { initializeFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export interface UserPresence {
  userId: string;
  isOnline: boolean;
  lastSeen: Date | null;
  status?: 'online' | 'away' | 'offline';
}

const PRESENCE_TIMEOUT = 90 * 1000; // 90 seconds - generous buffer for network jitter and browser tab throttling
const HEARTBEAT_INTERVAL = 25 * 1000; // Update presence every 25 seconds (comfortably under the timeout)

async function waitForAuthenticatedUser(timeoutMs: number = 5000): Promise<boolean> {
  const { auth } = initializeFirebase();
  if (!auth) return false;

  if (auth.currentUser) return true;

  return new Promise<boolean>((resolve) => {
    const timeoutId = window.setTimeout(() => {
      cleanup();
      resolve(!!auth.currentUser);
    }, timeoutMs);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        cleanup();
        resolve(true);
      }
    });

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      unsubscribe();
    };
  });
}

/**
 * Update user's presence (last seen timestamp)
 * Stores lastSeen directly in the students collection.
 */
export async function updateUserPresence(userId: string, tenantId?: string): Promise<void> {
  try {
    const { firestore, auth } = initializeFirebase();
    if (!firestore || !userId) return;
    
    const currentUser = auth?.currentUser;
    if (!currentUser) {
      return;
    }
    
    // Store lastSeen directly in the student document so the deployed rules keep working
    const studentRef = doc(firestore, 'students', userId);
    const currentName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Student';
    const updateData: any = {
      userId,
      userName: currentName,
      lastSeen: serverTimestamp(),
      isOnline: true,
    };
    
    // Include tenantId for all users (authenticated and anonymous). Always fall back to the
    // default tenant instead of omitting the field entirely — a student doc with no tenantId
    // is invisible to tenant-scoped "online now" queries (Challenge Arena quick-match) even
    // though security rules would otherwise allow reading it.
    updateData.tenantId = tenantId || 'smartclass24';
    
    await setDoc(studentRef, updateData, { merge: true });
    
    console.log('[Presence] Updated presence for user:', userId);
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
export async function markUserOffline(userId: string, tenantId?: string): Promise<void> {
  try {
    const { firestore, auth } = initializeFirebase();
    if (!firestore || !userId) return;
    
    const currentUser = auth?.currentUser;
    if (!currentUser) {
      return;
    }
    
    const studentRef = doc(firestore, 'students', userId);
    const updateData: any = {
      lastSeen: new Date(Date.now() - PRESENCE_TIMEOUT - 1000), // Set to past timestamp to mark as offline
      isOnline: false,
    };
    
    if (tenantId && !currentUser.isAnonymous) {
      updateData.tenantId = tenantId;
    }
    
    await setDoc(studentRef, updateData, { merge: true });
    
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
 *
 * Design note: this deliberately does NOT mark the user offline on tab-hide, pagehide,
 * beforeunload, or component unmount. Those events fire constantly for reasons that don't
 * mean "the student left" (backgrounding a mobile browser to check a notification,
 * navigating between pages that each mount their own heartbeat, etc.), and were previously
 * causing real online students to be marked offline within moments of matchmaking — which is
 * why only the always-online Sarah bot ever appeared as an opponent. Presence is instead a
 * pure TTL: a student is "online" as long as `lastSeen` is fresher than PRESENCE_TIMEOUT, and
 * naturally expires on its own once heartbeats stop.
 */
export function startPresenceHeartbeat(userId: string, tenantId?: string): () => void {
  if (!userId) return () => {};
  
  console.log('[Presence] Starting heartbeat for:', userId, tenantId ? `(tenant: ${tenantId})` : '');

  let stopped = false;

  // Wait briefly for auth hydration before the first write.
  (async () => {
    const hasAuthenticatedUser = await waitForAuthenticatedUser();
    if (stopped || !hasAuthenticatedUser) return;
    await updateUserPresence(userId, tenantId);
  })();
  
  // Keep sending heartbeats even while the tab is backgrounded — browsers throttle (but rarely
  // fully stop) timers in hidden tabs, and a student who merely switched apps briefly is still
  // "online" for matchmaking purposes.
  const interval = setInterval(() => {
    if (stopped) return;
    updateUserPresence(userId, tenantId);
  }, HEARTBEAT_INTERVAL);
  
  // Refresh immediately when the tab regains focus, so presence recovers instantly rather than
  // waiting for the next interval tick.
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      updateUserPresence(userId, tenantId);
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Cleanup function: just stop this heartbeat timer. Do NOT mark the user offline here —
  // another heartbeat (e.g. the app-wide one in FirebaseProvider) may still be running for
  // them, and even if not, presence should simply expire via the TTL rather than being
  // force-cleared the instant one page/component unmounts.
  return () => {
    stopped = true;
    console.log('[Presence] Stopping heartbeat for:', userId);
    clearInterval(interval);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
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


