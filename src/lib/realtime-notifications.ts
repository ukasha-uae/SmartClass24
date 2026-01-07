import { initializeFirebase } from '@/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

// Firestore-backed user notifications (cross-device, realtime via onSnapshot)

export type NotificationType =
  | 'challenge_invite'
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
  const { firestore } = initializeFirebase();
  return collection(firestore, 'users', userId, 'notifications');
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
  if (!userId) return;
  const colRef = getNotificationsCollection(userId);
  
  // Remove all undefined values - Firestore doesn't accept undefined
  const cleanedPayload = removeUndefinedValues({
    ...payload,
    read: false,
    createdAt: serverTimestamp(),
  });
  
  await addDoc(colRef, cleanedPayload);
}

export async function markUserNotificationAsRead(
  userId: string,
  notificationId: string
) {
  if (!userId || !notificationId) return;
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
  const { firestore } = initializeFirebase();
  const ref = doc(firestore, 'users', userId, 'notifications', notificationId);
  await deleteDoc(ref);
}


