'use client';

import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { FirebaseApp } from 'firebase/app';

/**
 * Firebase Cloud Messaging setup and utilities
 * Handles web push notifications for SmartClass24
 */

let messagingInstance: Messaging | null = null;

/**
 * Initialize Firebase Cloud Messaging
 * Safe to call multiple times - will return cached instance
 */
export async function initializeMessaging(firebaseApp: FirebaseApp): Promise<Messaging | null> {
  try {
    // Skip FCM initialization in development (service worker issues with Next.js dev server)
    if (process.env.NODE_ENV === 'development') {
      console.log('[FCM] Skipping messaging in development mode');
      return null;
    }

    // Check if push notifications are supported by the browser
    const supported = await isSupported();
    if (!supported) {
      console.log('[FCM] Push notifications not supported in this browser');
      return null;
    }

    // Check if we're in a secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      console.warn('[FCM] Push notifications require HTTPS');
      return null;
    }

    // Return cached instance if already initialized
    if (messagingInstance) {
      return messagingInstance;
    }

    // Initialize messaging
    messagingInstance = getMessaging(firebaseApp);
    console.log('[FCM] Messaging initialized successfully');
    
    return messagingInstance;
  } catch (error) {
    console.error('[FCM] Error initializing messaging:', error);
    return null;
  }
}

/**
 * Get the current FCM token for this device
 * @param messaging - Firebase Messaging instance
 * @returns FCM token string or null if unable to get token
 */
export async function getFCMToken(messaging: Messaging): Promise<string | null> {
  try {
    // Get VAPID key from environment variables
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    
    if (!vapidKey) {
      console.error('[FCM] VAPID key not found in environment variables');
      console.log('[FCM] Add NEXT_PUBLIC_FIREBASE_VAPID_KEY to .env.local');
      return null;
    }

    // Request token from FCM
    const token = await getToken(messaging, { vapidKey });
    
    if (token) {
      console.log('[FCM] Token generated successfully');
      return token;
    } else {
      console.log('[FCM] No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (error) {
    console.error('[FCM] Error getting token:', error);
    return null;
  }
}

/**
 * Setup listener for foreground messages (when app is open)
 * @param messaging - Firebase Messaging instance
 * @param callback - Function to call when a message is received
 * @returns Unsubscribe function
 */
export function setupForegroundMessageListener(
  messaging: Messaging,
  callback: (payload: any) => void
): (() => void) {
  const unsubscribe = onMessage(messaging, (payload) => {
    console.log('[FCM] Foreground message received:', payload);
    callback(payload);
  });

  return unsubscribe;
}

/**
 * Check if the browser supports push notifications
 */
export async function checkPushNotificationSupport(): Promise<boolean> {
  try {
    // Check for required APIs
    const hasNotificationAPI = 'Notification' in window;
    const hasServiceWorkerAPI = 'serviceWorker' in navigator;
    const isFCMSupported = await isSupported();

    const hasSupport = hasNotificationAPI && hasServiceWorkerAPI && isFCMSupported;
    
    if (!hasSupport) {
      console.log('[FCM] Push notification support check:', {
        hasNotificationAPI,
        hasServiceWorkerAPI,
        isFCMSupported
      });
    }

    return hasSupport;
  } catch (error) {
    console.error('[FCM] Error checking push support:', error);
    return false;
  }
}

/**
 * Get the current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Request notification permission from the user
 * Returns the permission status after request
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('[FCM] Notification API not available');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    console.log('[FCM] Notification permission previously denied');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('[FCM] Notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('[FCM] Error requesting notification permission:', error);
    return 'denied';
  }
}
