import { initializeFirebase } from '@/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firestore-backed user notifications (cross-device, realtime via onSnapshot)

export type NotificationType =
  | 'challenge_invite'
  | 'challenge_declined'
  | 'friend_request'
  | 'achievement_unlock'
  | 'system_message'
  | 'challenge_result';

export interface UserNotificationPayload {
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  actionUrl?: string;
}

export interface UserNotification extends UserNotificationPayload {
  read: boolean;
  createdAt: string | Date;
}

function getNotificationsCollection(userId: string) {
  try {
    const { firestore } = initializeFirebase();
    if (!firestore) {
      throw new Error('Firestore is not initialized');
    }
    return collection(firestore, 'users', userId, 'notifications');
  } catch (error) {
    console.error('[Notification] Failed to get notifications collection for user:', userId, error);
    throw error;
  }
}

// Helper function to remove undefined values recursively
function removeUndefinedValues(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefinedValues(item)).filter(item => item !== undefined);
  }
  
  if (typeof obj === 'object' && obj.constructor === Object) {
    const cleaned: any = {};
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (value !== undefined) {
        cleaned[key] = removeUndefinedValues(value);
      }
    });
    return cleaned;
  }
  
  return obj;
}

export async function createUserNotification(
  userId: string,
  payload: UserNotificationPayload
) {
  console.log('[Notification] createUserNotification called with userId:', userId, 'payload:', payload);
  
  if (!userId) {
    console.warn('[Notification] Cannot create notification: userId is empty');
    return;
  }
  
  // Check if user is authenticated before attempting write
  const { auth } = initializeFirebase();
  const currentUser = auth?.currentUser;
  
  if (!currentUser) {
    console.warn('[Notification] Skipping notification: user not authenticated');
    return null;
  }
  
  console.log('[Notification] User authenticated:', currentUser.uid);
  
  try {
    console.log('[Notification] Getting notifications collection for user:', userId);
    const colRef = getNotificationsCollection(userId);
    console.log('[Notification] Collection reference obtained');
    
    // Remove all undefined values - Firestore doesn't accept undefined
    const cleanedPayload = removeUndefinedValues({
      ...payload,
      read: false,
      createdAt: serverTimestamp(),
    });
    
    console.log('[Notification] Creating notification for user:', userId, 'Payload:', cleanedPayload);
    console.log('[Notification] Collection path:', colRef.path);
    console.log('[Notification] Current user creating notification:', currentUser.uid, currentUser.isAnonymous ? '(anonymous)' : '(email)');
    console.log('[Notification] Target user ID:', userId);
    console.log('[Notification] Note: Target user must be signed in with this exact Firebase Auth UID to receive the notification');
    
    // Try to write directly without timeout first to see the actual error
    try {
      console.log('[Notification] Attempting Firestore write...');
      const startTime = Date.now();
      const docRef = await addDoc(colRef, cleanedPayload);
      const duration = Date.now() - startTime;
      console.log('[Notification] ✅ Notification created successfully:', docRef.id, 'for user:', userId, `(took ${duration}ms)`);
      
      // Verify the notification was actually written
      try {
        const { getDoc } = await import('firebase/firestore');
        const { firestore } = initializeFirebase();
        const verifyRef = doc(firestore, 'users', userId, 'notifications', docRef.id);
        const verifySnap = await getDoc(verifyRef);
        if (verifySnap.exists()) {
          console.log('[Notification] ✅ Verified: Notification exists in Firestore');
        } else {
          console.warn('[Notification] ⚠️ Warning: Notification was created but not found on verification');
        }
      } catch (verifyErr) {
        console.warn('[Notification] Could not verify notification (non-critical):', verifyErr);
      }
      
      return docRef.id;
    } catch (addDocError: any) {
      // Log the specific error from addDoc
      console.error('[Notification] addDoc failed:', {
        code: addDocError?.code,
        message: addDocError?.message,
        name: addDocError?.name,
        stack: addDocError?.stack
      });
      
      // Provide context based on error type
      if (addDocError?.code === 'permission-denied') {
        console.warn('[Notification] Permission denied - skipping notification write');
        return null;
      } else if (addDocError?.code === 'unavailable') {
        console.error('[Notification] Firestore service unavailable - check network connection');
      } else if (addDocError?.code === 'unauthenticated') {
        console.error('[Notification] User not authenticated - this should not happen as we checked earlier');
      } else {
        console.error('[Notification] Unknown error - full details:', addDocError);
      }
      
      return null;
    }
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      console.warn('[Notification] Permission denied - notification suppressed');
      return null;
    }
    console.error('[Notification] ❌ Failed to create notification for user:', userId, 'Error:', error);
    return null;
  }
}

export async function markUserNotificationAsRead(
  userId: string,
  notificationId: string
) {
  if (!userId || !notificationId) return;
  const { auth } = initializeFirebase();
  if (!auth?.currentUser) return;
  const { firestore } = initializeFirebase();
  const ref = doc(firestore, 'users', userId, 'notifications', notificationId);
  await updateDoc(ref, { read: true });
}

export async function markAllUserNotificationsAsRead(userId: string) {
  // Optional: can be implemented with a Cloud Function or batched writes
  // For now we rely on client marking individual notifications as read.
  void userId;
}

export async function deleteUserNotification(
  userId: string,
  notificationId: string
) {
  if (!userId || !notificationId) return;
  const { auth } = initializeFirebase();
  if (!auth?.currentUser) return;
  const { firestore } = initializeFirebase();
  const ref = doc(firestore, 'users', userId, 'notifications', notificationId);
  await deleteDoc(ref);
}


