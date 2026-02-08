'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { setupForegroundMessageListener } from '@/firebase/messaging';
import { X } from 'lucide-react';
import { useTenantLink } from '@/hooks/useTenantLink';

/**
 * Simple toast notification for foreground messages
 * Fallback for when sonner is not installed
 */
interface ToastNotification {
  id: string;
  title: string;
  body: string;
  type: string;
  data: any;
}

let toastCounter = 0;

function SimpleToast({ 
  notification, 
  onDismiss,
  onAction 
}: { 
  notification: ToastNotification;
  onDismiss: () => void;
  onAction?: (action: string) => void;
}) {
  const bgColor = notification.type === 'arena_challenge_invite' 
    ? 'bg-gradient-to-r from-purple-600 to-blue-600'
    : notification.type === 'arena_challenge_accepted'
    ? 'bg-gradient-to-r from-green-600 to-emerald-600'
    : 'bg-gradient-to-r from-blue-600 to-indigo-600';

  return (
    <div
      className={`${bgColor} text-white rounded-lg shadow-2xl p-4 border border-white/20 max-w-md animate-slide-in-right`}
    >
      <div className="flex items-start gap-3">
        <div className="bg-white/20 p-2 rounded-lg text-2xl">
          {notification.type === 'arena_challenge_invite' ? '⚔️' :
           notification.type === 'arena_challenge_accepted' ? '🎮' : '🔔'}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{notification.title}</h3>
          <p className="text-sm text-white/90 mb-3">{notification.body}</p>
          
          {notification.type === 'arena_challenge_invite' && (
            <div className="flex gap-2">
              <button
                onClick={() => onAction?.('accept')}
                className="px-3 py-1.5 bg-white text-purple-600 text-sm font-medium rounded-lg hover:bg-purple-50 transition-colors"
              >
                Accept Challenge
              </button>
              <button
                onClick={() => onAction?.('view')}
                className="px-3 py-1.5 bg-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-colors"
              >
                View
              </button>
            </div>
          )}
          
          {notification.type === 'arena_challenge_accepted' && (
            <button
              onClick={() => onAction?.('start')}
              className="px-3 py-1.5 bg-white text-green-600 text-sm font-medium rounded-lg hover:bg-green-50 transition-colors"
            >
              Start Game
            </button>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-white/80 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/**
 * NotificationHandler Component
 * Handles foreground notifications and routing when user clicks notifications
 * 
 * This component should be added to your root layout to handle notifications globally
 */
export function NotificationHandler() {
  const router = useRouter();
  const { firebaseApp, user } = useFirebase();
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const addTenantParam = useTenantLink();

  useEffect(() => {
    // Only setup if user is authenticated
    if (!firebaseApp || !user) {
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const setupNotifications = async () => {
      try {
        // Dynamically import messaging
        const { initializeMessaging } = await import('@/firebase/messaging');
        
        const messaging = await initializeMessaging(firebaseApp);
        if (!messaging) {
          return; // Messaging not supported
        }

        // Setup foreground message listener
        unsubscribe = setupForegroundMessageListener(messaging, (payload) => {
          console.log('[NotificationHandler] Foreground message received:', payload);
          
          // Show in-app notification toast
          handleForegroundNotification(payload);
        });
      } catch (error) {
        console.error('[NotificationHandler] Error setting up notifications:', error);
      }
    };

    setupNotifications();

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [firebaseApp, user]);

  // Listen for notification clicks from service worker
  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NOTIFICATION_CLICK') {
        console.log('[NotificationHandler] Notification clicked:', event.data);
        
        // Navigate to the target URL
        if (event.data.url) {
          router.push(event.data.url);
        }
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
      
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      };
    }
  }, [router]);

  /**
   * Handle foreground notifications (when app is open)
   */
  const handleForegroundNotification = (payload: any) => {
    const title = payload.notification?.title || 'SmartClass24';
    const body = payload.notification?.body || 'You have a new notification';
    const data = payload.data || {};

    // Create toast notification
    const notification: ToastNotification = {
      id: `toast-${toastCounter++}`,
      title,
      body,
      type: data.type || 'general',
      data,
    };

    setToasts(prev => [...prev, notification]);

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      dismissToast(notification.id);
    }, 10000);

    // Play notification sound (optional)
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Ignore errors if audio can't play (autoplay restrictions)
      });
    } catch {
      // Ignore audio errors
    }
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleToastAction = (notification: ToastNotification, action: string) => {
    dismissToast(notification.id);
    
    if (action === 'accept') {
      router.push(addTenantParam(`/arena?accept=${notification.data.challengeId}`));
    } else if (action === 'start') {
      router.push(addTenantParam(`/arena?start=${notification.data.challengeId}`));
    } else if (action === 'view') {
      router.push(addTenantParam('/arena'));
    }
  };

  // Render toasts
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map(notification => (
        <SimpleToast
          key={notification.id}
          notification={notification}
          onDismiss={() => dismissToast(notification.id)}
          onAction={(action) => handleToastAction(notification, action)}
        />
      ))}
    </div>
  );
}

/**
 * Add this animation to your global CSS or tailwind.config.ts:
 * 
 * @keyframes slide-in-right {
 *   from {
 *     transform: translateX(100%);
 *     opacity: 0;
 *   }
 *   to {
 *     transform: translateX(0);
 *     opacity: 1;
 *   }
 * }
 * 
 * .animate-slide-in-right {
 *   animation: slide-in-right 0.3s ease-out;
 * }
 * 
 * Note: If using sonner toast library, install it:
 * npm install sonner
 * 
 * Then replace SimpleToast with sonner's toast component for better UX
 */
