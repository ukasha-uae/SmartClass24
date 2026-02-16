"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { useHasMounted } from '@/hooks/use-has-mounted';
import { useTenant } from '@/hooks/useTenant';
import { usePWAInstall } from '@/contexts/PWAInstallContext';

/** Delay before showing the install card when we have native prompt (quick path). */
const PROMPT_DELAY_FAST_MS = 1500;
/** Delay before showing the install card when we don't have native prompt (Wisdom & others – same visible prompt as S24). */
const PROMPT_DELAY_FALLBACK_MS = 6000;

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const hasMounted = useHasMounted();
  const { branding } = useTenant();
  const pwa = usePWAInstall();
  const deferredPrompt = pwa?.deferredPrompt ?? null;

  // Show the same install card for ALL tenants (S24 and Wisdom). If the browser fired
  // beforeinstallprompt we show sooner; otherwise we show after a short delay so everyone sees it.
  useEffect(() => {
    if (!hasMounted || !pwa) return;
    if (pwa.isStandalone) return;
    if (localStorage.getItem('pwa-prompt-dismissed')) {
      setDismissed(true);
      return;
    }
    const delayMs = deferredPrompt ? PROMPT_DELAY_FAST_MS : PROMPT_DELAY_FALLBACK_MS;
    const t = setTimeout(() => setShowPrompt(true), delayMs);
    return () => clearTimeout(t);
  }, [hasMounted, pwa, deferredPrompt]);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setShowPrompt(false));
    } else {
      pwa?.triggerInstall();
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!hasMounted || !showPrompt || dismissed || pwa?.isStandalone) {
    return null;
  }

  const themeColor = branding?.primaryColor || '#7c3aed';

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[100] animate-in slide-in-from-bottom-5">
      <Card className="border-2 shadow-2xl bg-card" style={{ borderColor: themeColor }}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: themeColor }}
              >
                <Download className="h-6 w-6" />
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
                  className="flex-1 text-white font-medium border-0"
                  style={{ backgroundColor: themeColor }}
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
