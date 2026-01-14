// @ts-nocheck
/**
 * Firebase Cloud Functions for SmartClass24 Push Notifications
 * 
 * ⚠️ THIS IS AN EXAMPLE FILE - NOT COMPILED WITH MAIN PROJECT
 * Copy this to your functions/src/index.ts after initializing Firebase Functions
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 
 * 1. Initialize Firebase Functions (if not already done):
 *    npm install -g firebase-tools
 *    firebase init functions
 * 
 * 2. Install dependencies in functions folder:
 *    cd functions
 *    npm install firebase-admin firebase-functions
 * 
 * 3. Copy this file to functions/src/index.ts
 * 
 * 4. Deploy:
 *    firebase deploy --only functions
 * 
 * 5. Verify in Firebase Console:
 *    https://console.firebase.google.com/project/smartclass24-5e590/functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

/**
 * Send push notification when a new notification document is created
 * Triggers on: users/{userId}/notifications/{notificationId}
 */
export const sendArenaPushNotification = functions.firestore
  .document('users/{userId}/notifications/{notificationId}')
  .onCreate(async (snapshot: FirebaseFirestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    const notificationData = snapshot.data();
    const userId = context.params.userId;
    
    // Only process if it's marked for push delivery
    if (!notificationData.pendingPush) {
      console.log(`Notification ${context.params.notificationId} not marked for push, skipping`);
      return null;
    }
    
    try {
      // Get all FCM tokens for this user
      const tokensSnapshot = await admin.firestore()
        .collection('users')
        .doc(userId)
        .collection('fcmTokens')
        .get();
      
      if (tokensSnapshot.empty) {
        console.log(`No FCM tokens found for user ${userId}`);
        await snapshot.ref.update({ 
          pendingPush: false,
          pushError: 'No FCM tokens found',
          processedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return null;
      }
      
      const tokens = tokensSnapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => doc.data().token).filter(Boolean);
      
      if (tokens.length === 0) {
        console.log(`All tokens empty for user ${userId}`);
        return null;
      }
      
      // Build notification payload based on type
      const { title, body } = buildNotificationContent(notificationData);
      
      const payload = {
        notification: {
          title,
          body,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          clickAction: 'https://smartclass24-5e590.web.app/arena', // Update with your domain
        },
        data: {
          type: notificationData.type || 'general',
          challengeId: notificationData.challengeId || '',
          challengerUid: notificationData.challengerUid || '',
          challengerName: notificationData.challengerName || '',
          subject: notificationData.subject || '',
          url: '/arena',
        },
      };
      
      // Send to all user's devices
      console.log(`Sending notification to ${tokens.length} device(s) for user ${userId}`);
      const response = await admin.messaging().sendToDevice(tokens, payload);
      
      // Check for failures and remove invalid tokens
      const failedTokens: string[] = [];
      response.results.forEach((result: admin.messaging.MessagingDevicesResponse, index: number) => {
        if (result.error) {
          console.error(`Error sending to token ${tokens[index]}:`, result.error);
          // Remove invalid tokens
          if (
            result.error.code === 'messaging/invalid-registration-token' ||
            result.error.code === 'messaging/registration-token-not-registered'
          ) {
            failedTokens.push(tokens[index]);
          }
        }
      });
      
      // Clean up invalid tokens
      if (failedTokens.length > 0) {
        console.log(`Removing ${failedTokens.length} invalid token(s)`);
        const deletePromises = failedTokens.map(token =>
          admin.firestore()
            .collection('users')
            .doc(userId)
            .collection('fcmTokens')
            .doc(token)
            .delete()
        );
        await Promise.all(deletePromises);
      }
      
      // Mark notification as sent
      await snapshot.ref.update({ 
        pendingPush: false,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        sentToDevices: tokens.length,
        failedDevices: failedTokens.length,
      });
      
      console.log(`Successfully sent notification to user ${userId}:`, {
        success: response.successCount,
        failure: response.failureCount,
      });
      
      return null;
    } catch (error) {
      console.error('Error sending push notification:', error);
      
      // Mark as failed
      await snapshot.ref.update({ 
        pendingPush: false,
        pushError: (error as Error).message || 'Unknown error',
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      return null;
    }
  });

/**
 * Build notification title and body based on notification type
 */
function buildNotificationContent(data: any): { title: string; body: string } {
  const challengerName = data.challengerName || 'Someone';
  const subject = data.subject || 'a subject';
  
  switch (data.type) {
    case 'arena_challenge_invite':
      return {
        title: '⚔️ Arena Challenge!',
        body: `${challengerName} challenges you to battle in ${subject}!`,
      };
      
    case 'arena_challenge_accepted':
      return {
        title: '🎮 Challenge Accepted!',
        body: `${challengerName} accepted your challenge. Game on!`,
      };
      
    case 'arena_challenge_declined':
      return {
        title: 'Challenge Declined',
        body: `${challengerName} declined your challenge.`,
      };
      
    case 'arena_challenge_completed':
      return {
        title: '🏆 Battle Complete!',
        body: `Your battle with ${challengerName} is finished. Check the results!`,
      };
      
    case 'friend_request':
      return {
        title: '👋 Friend Request',
        body: `${challengerName} wants to be your friend!`,
      };
      
    default:
      return {
        title: 'SmartClass24',
        body: data.message || 'You have a new notification',
      };
  }
}

/**
 * Clean up old notifications (optional)
 * Runs daily to remove read notifications older than 30 days
 */
export const cleanupOldNotifications = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context: functions.EventContext) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const usersSnapshot = await admin.firestore().collection('users').get();
    
    let totalDeleted = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const notificationsQuery = admin.firestore()
        .collection('users')
        .doc(userDoc.id)
        .collection('notifications')
        .where('read', '==', true)
        .where('sentAt', '<', admin.firestore.Timestamp.fromDate(thirtyDaysAgo));
      
      const notificationsSnapshot = await notificationsQuery.get();
      
      if (!notificationsSnapshot.empty) {
        const batch = admin.firestore().batch();
        notificationsSnapshot.docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        totalDeleted += notificationsSnapshot.size;
      }
    }
    
    console.log(`Cleaned up ${totalDeleted} old notifications`);
    return null;
  });

/**
 * Clean up orphaned FCM tokens (optional)
 * Removes tokens that haven't been updated in 90 days
 */
export const cleanupOrphanedTokens = functions.pubsub
  .schedule('every 7 days')
  .onRun(async (context: functions.EventContext) => {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const usersSnapshot = await admin.firestore().collection('users').get();
    
    let totalDeleted = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const tokensQuery = admin.firestore()
        .collection('users')
        .doc(userDoc.id)
        .collection('fcmTokens')
        .where('updatedAt', '<', admin.firestore.Timestamp.fromDate(ninetyDaysAgo));
      
      const tokensSnapshot = await tokensQuery.get();
      
      if (!tokensSnapshot.empty) {
        const batch = admin.firestore().batch();
        tokensSnapshot.docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        totalDeleted += tokensSnapshot.size;
      }
    }
    
    console.log(`Cleaned up ${totalDeleted} orphaned FCM tokens`);
    return null;
  });
