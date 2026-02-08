/**
 * Arena Challenge Notification System
 * Server-side functions to send push notifications for Arena challenges
 * 
 * NOTE: These functions should be called from Firebase Cloud Functions or your backend
 * They are NOT meant to be called directly from the client
 */

import { Firestore, collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Notification payload types
 */
export type ArenaNotificationType = 
  | 'arena_challenge_invite'
  | 'arena_challenge_accepted'
  | 'arena_challenge_declined'
  | 'arena_challenge_completed';

export interface ArenaNotificationData {
  type: ArenaNotificationType;
  challengeId: string;
  challengerName: string;
  challengerUid: string;
  subject?: string;
  level?: string;
  url?: string;
  requireInteraction?: boolean;
}

/**
 * Get all FCM tokens for a user
 * @param firestore - Firestore instance
 * @param userId - User ID to get tokens for
 * @returns Array of FCM tokens
 */
export async function getUserFCMTokens(
  firestore: Firestore,
  userId: string
): Promise<string[]> {
  try {
    const tokensQuery = query(
      collection(firestore, 'users', userId, 'fcmTokens')
    );
    
    const snapshot = await getDocs(tokensQuery);
    const tokens: string[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.token) {
        tokens.push(data.token);
      }
    });
    
    return tokens;
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.warn('[Arena Notifications] Permission denied - cannot access FCM tokens');
      return [];
    }
    console.error('[Arena Notifications] Error getting user tokens:', error);
    return [];
  }
}

/**
 * Build notification payload for Arena challenges
 * @param data - Notification data
 * @returns Formatted notification payload
 */
export function buildArenaNotificationPayload(data: ArenaNotificationData) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  let title = '';
  let body = '';
  
  switch (data.type) {
    case 'arena_challenge_invite':
      title = '⚔️ Arena Challenge!';
      body = `${data.challengerName} challenges you to an Arena battle${data.subject ? ` in ${data.subject}` : ''}!`;
      break;
      
    case 'arena_challenge_accepted':
      title = '🎮 Challenge Accepted!';
      body = `${data.challengerName} accepted your challenge. Time to battle!`;
      break;
      
    case 'arena_challenge_declined':
      title = '😔 Challenge Declined';
      body = `${data.challengerName} declined your challenge.`;
      break;
      
    case 'arena_challenge_completed':
      title = '🏆 Challenge Complete!';
      body = `Your Arena battle with ${data.challengerName} is complete. Check the results!`;
      break;
  }
  
  return {
    notification: {
      title,
      body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
    },
    data: {
      type: data.type,
      challengeId: data.challengeId,
      challengerUid: data.challengerUid,
      challengerName: data.challengerName,
      subject: data.subject || '',
      level: data.level || '',
      url: data.url || `${baseUrl}/arena`,
      requireInteraction: data.requireInteraction ? 'true' : 'false',
      clickAction: `${baseUrl}/arena`,
    },
    webpush: {
      fcmOptions: {
        link: data.url || `${baseUrl}/arena`,
      },
    },
  };
}

/**
 * CLIENT-SIDE HELPER: Send notification via Firestore trigger
 * 
 * This creates a notification document that a Cloud Function can process
 * and send via FCM. This is the recommended approach for client-side code.
 * 
 * @param firestore - Firestore instance
 * @param recipientUid - User ID to send notification to
 * @param data - Notification data
 */
export async function sendArenaNotificationViaFirestore(
  firestore: Firestore,
  recipientUid: string,
  data: ArenaNotificationData
): Promise<void> {
  try {
    const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
    const { getAuth } = await import('firebase/auth');
    
    // Check if user is authenticated
    const auth = getAuth();
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
      console.warn('[Arena Notifications] Skipping notification: user not authenticated');
      return;
    }
    
    const notificationsRef = collection(firestore, 'users', recipientUid, 'notifications');
    
    await addDoc(notificationsRef, {
      type: data.type,
      challengeId: data.challengeId,
      challengerName: data.challengerName,
      challengerUid: data.challengerUid,
      subject: data.subject || '',
      level: data.level || '',
      read: false,
      sentAt: serverTimestamp(),
      // This will be picked up by a Cloud Function to send push notification
      pendingPush: true,
    });
    
    console.log('[Arena Notifications] Notification queued for delivery');
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.warn('[Arena Notifications] Permission denied - skipping notification write');
      return;
    }
    console.error('[Arena Notifications] Error queueing notification:', error);
    // Don't re-throw - allow app to continue
  }
}

/**
 * EXAMPLE: Cloud Function to send push notifications
 * 
 * This should be deployed as a Firebase Cloud Function that triggers
 * when a new notification document is created.
 * 
 * Deploy this to Firebase Functions (functions/index.ts):
 * 
 * ```typescript
 * import * as functions from 'firebase-functions';
 * import * as admin from 'firebase-admin';
 * 
 * admin.initializeApp();
 * 
 * export const sendArenaPushNotification = functions.firestore
 *   .document('users/{userId}/notifications/{notificationId}')
 *   .onCreate(async (snapshot, context) => {
 *     const notificationData = snapshot.data();
 *     
 *     // Only process if it's a pending push notification
 *     if (!notificationData.pendingPush) {
 *       return null;
 *     }
 *     
 *     const userId = context.params.userId;
 *     
 *     // Get user's FCM tokens
 *     const tokensSnapshot = await admin.firestore()
 *       .collection('users')
 *       .doc(userId)
 *       .collection('fcmTokens')
 *       .get();
 *     
 *     const tokens = tokensSnapshot.docs.map(doc => doc.data().token);
 *     
 *     if (tokens.length === 0) {
 *       console.log('No FCM tokens found for user:', userId);
 *       return null;
 *     }
 *     
 *     // Build notification payload
 *     const payload = buildArenaNotificationPayload({
 *       type: notificationData.type,
 *       challengeId: notificationData.challengeId,
 *       challengerName: notificationData.challengerName,
 *       challengerUid: notificationData.challengerUid,
 *       subject: notificationData.subject,
 *       level: notificationData.level,
 *     });
 *     
 *     // Send to all user's devices
 *     const response = await admin.messaging().sendToDevice(tokens, payload);
 *     
 *     // Mark as sent
 *     await snapshot.ref.update({ pendingPush: false, sentAt: admin.firestore.FieldValue.serverTimestamp() });
 *     
 *     console.log('Push notification sent:', response);
 *     return null;
 *   });
 * ```
 */

/**
 * Example usage in Arena challenge flow:
 * 
 * ```typescript
 * // When creating a challenge
 * async function createArenaChallenge(
 *   firestore: Firestore,
 *   challengerUid: string,
 *   challengerName: string,
 *   opponentUid: string,
 *   subject: string
 * ) {
 *   // 1. Create challenge document
 *   const challengeRef = await addDoc(collection(firestore, 'challenges'), {
 *     challengerUid,
 *     opponentUid,
 *     subject,
 *     status: 'pending',
 *     createdAt: serverTimestamp(),
 *   });
 *   
 *   // 2. Send notification to opponent
 *   await sendArenaNotificationViaFirestore(firestore, opponentUid, {
 *     type: 'arena_challenge_invite',
 *     challengeId: challengeRef.id,
 *     challengerName,
 *     challengerUid,
 *     subject,
 *     requireInteraction: true,
 *   });
 *   
 *   return challengeRef.id;
 * }
 * 
 * // When accepting a challenge
 * async function acceptArenaChallenge(
 *   firestore: Firestore,
 *   challengeId: string,
 *   acceptorUid: string,
 *   acceptorName: string,
 *   challengerUid: string
 * ) {
 *   // 1. Update challenge status
 *   await updateDoc(doc(firestore, 'challenges', challengeId), {
 *     status: 'accepted',
 *     acceptedAt: serverTimestamp(),
 *   });
 *   
 *   // 2. Notify challenger
 *   await sendArenaNotificationViaFirestore(firestore, challengerUid, {
 *     type: 'arena_challenge_accepted',
 *     challengeId,
 *     challengerName: acceptorName,
 *     challengerUid: acceptorUid,
 *     requireInteraction: true,
 *   });
 * }
 * ```
 */

/**
 * Smart notification throttling
 * Prevents spam by limiting notifications per user
 */
export async function shouldSendNotification(
  firestore: Firestore,
  userId: string,
  type: ArenaNotificationType,
  maxPerHour: number = 10
): Promise<boolean> {
  try {
    const { collection, query, where, getDocs, Timestamp } = await import('firebase/firestore');
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentNotificationsQuery = query(
      collection(firestore, 'users', userId, 'notifications'),
      where('type', '==', type),
      where('sentAt', '>=', Timestamp.fromDate(oneHourAgo))
    );
    
    const snapshot = await getDocs(recentNotificationsQuery);
    
    return snapshot.size < maxPerHour;
  } catch (error) {
    console.error('[Arena Notifications] Error checking throttle:', error);
    // Allow notification on error to avoid blocking legitimate notifications
    return true;
  }
}
