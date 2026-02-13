"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { useHasMounted } from '@/hooks/use-has-mounted';
import { useTenant } from '@/hooks/useTenant';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const hasMounted = useHasMounted();
  const { branding } = useTenant();

  useEffect(() => {
    console.log('[PWA] Initializing install prompt...');
    
    // Check if user has previously dismissed
    const hasDissmissed = localStorage.getItem('pwa-prompt-dismissed');
    if (hasDissmissed) {
      console.log('[PWA] Prompt was previously dismissed');
      setDismissed(true);
      return;
    }

    // Check if already installed
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    if (isPWA) {
      console.log('[PWA] App already installed');
      return;
    }

    console.log('[PWA] Listening for beforeinstallprompt event...');

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      console.log('[PWA] beforeinstallprompt event fired!');
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 3 seconds (reduced from 10)
      console.log('[PWA] Will show prompt in 3 seconds...');
      setTimeout(() => {
        console.log('[PWA] Showing install prompt now!');
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Add a manual trigger for testing
    (window as any).__showPWAPrompt = () => {
      console.log('[PWA] Manual trigger activated!');
      setShowPrompt(true);
    };

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!hasMounted || !showPrompt || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[100] animate-in slide-in-from-bottom-5">
      <Card className="border-2 border-violet-500 shadow-2xl bg-card">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Download className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base mb-1">Install {branding.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Get quick access and work offline!
              </p>
              <div className="flex gap-2 mt-2">
                <Button 
                  onClick={handleInstall}
                  size="default"
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium"
                >
                  Install Now
                </Button>
                <Button 
                  onClick={handleDismiss}
                  size="default"
                  variant="outline"
                  className="flex-1 font-medium"
                >
                  Later
                </Button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PWAUpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const hasMounted = useHasMounted();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
        
        // Check for updates every 60 seconds
        setInterval(() => {
          reg.update();
        }, 60000);

        // Listen for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdate(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  if (!hasMounted || !showUpdate) {
    return null;
  }

  return (
    <div className="fixed top-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-top-5">
      <Card className="border-2 border-blue-500 shadow-2xl bg-blue-50 dark:bg-blue-950">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                <Download className="h-5 w-5 text-white animate-bounce" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base mb-1">Update Available</h3>
              <p className="text-sm text-muted-foreground mb-3">
                A new version of S24 is ready!
              </p>
              <div className="flex gap-2 mt-2">
                <Button 
                  onClick={handleUpdate}
                  size="default"
                  className="flex-1 font-medium"
                >
                  Update Now
                </Button>
                <Button 
                  onClick={() => setShowUpdate(false)}
                  size="default"
                  variant="outline"
                  className="flex-1 font-medium"
                >
                  Later
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
