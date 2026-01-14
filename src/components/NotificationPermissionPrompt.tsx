'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellOff, X } from 'lucide-react';
import { getNotificationPermission, requestNotificationPermission } from '@/firebase/messaging';

interface NotificationPermissionPromptProps {
  /**
   * Delay before showing the prompt (in milliseconds)
   * Default: 3000 (3 seconds)
   */
  delay?: number;
  
  /**
   * Callback when user grants permission
   */
  onGranted?: () => void;
  
  /**
   * Callback when user denies permission
   */
  onDenied?: () => void;
  
  /**
   * Custom styling for the prompt container
   */
  className?: string;
}

/**
 * Non-blocking notification permission prompt
 * Shows a friendly banner to request push notification permission
 * 
 * Usage:
 * <NotificationPermissionPrompt delay={5000} onGranted={() => console.log('Granted!')} />
 */
export function NotificationPermissionPrompt({
  delay = 3000,
  onGranted,
  onDenied,
  className = ''
}: NotificationPermissionPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check current permission status
    const currentPermission = getNotificationPermission();
    setPermission(currentPermission);

    // Don't show prompt if already granted or denied
    if (currentPermission !== 'default') {
      return;
    }

    // Check if user has previously dismissed the prompt
    const dismissed = localStorage.getItem('notification_prompt_dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Show prompt after delay
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleEnableNotifications = async () => {
    setIsRequesting(true);

    try {
      const newPermission = await requestNotificationPermission();
      setPermission(newPermission);

      if (newPermission === 'granted') {
        setShowPrompt(false);
        onGranted?.();
      } else {
        onDenied?.();
        // Save dismissal time
        localStorage.setItem('notification_prompt_dismissed', Date.now().toString());
      }
    } catch (error) {
      console.error('[NotificationPrompt] Error requesting permission:', error);
      onDenied?.();
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('notification_prompt_dismissed', Date.now().toString());
  };

  // Don't render if permission already granted/denied or prompt is hidden
  if (permission !== 'default' || !showPrompt) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up ${className}`}
      role="dialog"
      aria-labelledby="notification-prompt-title"
      aria-describedby="notification-prompt-description"
    >
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-2xl p-4 border border-purple-400/30">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <h3
              id="notification-prompt-title"
              className="font-semibold text-lg"
            >
              Stay in the Arena!
            </h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Dismiss notification prompt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p
          id="notification-prompt-description"
          className="text-white/90 text-sm mb-4"
        >
          Get notified when friends challenge you to Arena battles, even when SmartClass24 is closed!
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleEnableNotifications}
            disabled={isRequesting}
            className="flex-1 bg-white text-purple-600 font-semibold py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRequesting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Requesting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Bell className="w-4 h-4" />
                Enable Notifications
              </span>
            )}
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-white/80 hover:text-white font-medium transition-colors"
          >
            Not Now
          </button>
        </div>

        {/* Privacy note */}
        <p className="text-xs text-white/60 mt-3 text-center">
          You can change this anytime in your browser settings
        </p>
      </div>
    </div>
  );
}

/**
 * Simple notification permission indicator
 * Shows current permission status as an icon
 */
export function NotificationPermissionIndicator() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  if (permission === 'default') {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {permission === 'granted' ? (
        <>
          <Bell className="w-4 h-4 text-green-500" />
          <span className="text-gray-600">Notifications enabled</span>
        </>
      ) : (
        <>
          <BellOff className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500">Notifications disabled</span>
        </>
      )}
    </div>
  );
}

/**
 * Compact notification permission button
 * Can be placed in settings or profile areas
 */
export function NotificationPermissionButton() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  const handleRequest = async () => {
    setIsRequesting(true);
    try {
      const newPermission = await requestNotificationPermission();
      setPermission(newPermission);
    } finally {
      setIsRequesting(false);
    }
  };

  if (permission === 'granted') {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <Bell className="w-4 h-4" />
        <span>Notifications enabled</span>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <BellOff className="w-4 h-4" />
        <span>Enable in browser settings</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleRequest}
      disabled={isRequesting}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
    >
      <Bell className="w-4 h-4" />
      {isRequesting ? 'Requesting...' : 'Enable Notifications'}
    </button>
  );
}
