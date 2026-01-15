'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';
import { startVersionCheck } from '@/lib/version-check';

/**
 * Update Notification Component
 * Detects when a new service worker version is available
 * and prompts user to refresh for the latest features
 */
export function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') {
      return;
    }

    // Start version checking (works even without service workers)
    const stopVersionCheck = startVersionCheck(() => {
      console.log('[Update] New version detected via version check');
      setUpdateAvailable(true);
    });

    // If service workers are supported, also use service worker detection
    if ('serviceWorker' in navigator) {
      // Check for updates every 60 seconds
      const checkForUpdates = async () => {
        try {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) {
            reg.update();
          }
        } catch (error) {
          console.error('Error checking for updates:', error);
        }
      };

      // Initial check
      checkForUpdates();
      
      // Periodic checks
      const interval = setInterval(checkForUpdates, 60000); // Check every 60 seconds

      // Listen for service worker updates
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Listen for new service worker waiting to activate
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is installed but waiting to activate
                console.log('New version available!');
                setUpdateAvailable(true);
              }
            });
          }
        });

        // Check if there's already a waiting service worker
        if (reg.waiting) {
          console.log('Update already waiting');
          setUpdateAvailable(true);
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATED') {
          console.log('Service worker updated message received');
          setUpdateAvailable(true);
        }
      });

      // Listen for controller change (new service worker activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Controller changed, reloading...');
        window.location.reload();
      });

      return () => {
        clearInterval(interval);
        stopVersionCheck();
      };
    }

    // Cleanup version check if no service workers
    return () => {
      stopVersionCheck();
    };
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      // Tell the waiting service worker to skip waiting and activate immediately
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      // Force reload to get the latest version
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setUpdateAvailable(false);
  };

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-2xl p-4 max-w-sm border border-white/20">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">
              🎉 New Update Available!
            </h3>
            <p className="text-xs text-white/90 mb-3">
              We've added new features and improvements. Refresh to get the latest version.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 h-8 text-xs font-semibold bg-white text-blue-600 hover:bg-white/90"
                onClick={handleUpdate}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Update Now
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-white hover:bg-white/20"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
