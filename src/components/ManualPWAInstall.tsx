'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTenant } from '@/hooks/useTenant';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function ManualPWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { branding } = useTenant();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Listen for the install prompt (if Chrome fires it)
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // ALWAYS show after 2 seconds - don't wait for Chrome
    setTimeout(() => setShowButton(true), 2000);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Chrome fired the event - use it!
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setShowButton(false);
      }
      setDeferredPrompt(null);
    } else {
      // Show friendly instructions
      setShowInstructions(true);
    }
  };

  if (!showButton) return null;

  return (
    <>
      {/* Floating Install Button */}
      <div className="fixed bottom-20 right-4 z-50 md:bottom-4">
        <Button
          onClick={handleInstall}
          size="lg"
          className="shadow-2xl gap-2 animate-pulse hover:animate-none transition-all"
          style={{ backgroundColor: branding.primaryColor }}
        >
          <Download className="w-5 h-5" />
          Install App
        </Button>
      </div>

      {/* Install Instructions Dialog */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Install {branding.name}
            </DialogTitle>
            <DialogDescription>
              Follow these simple steps to add {branding.name} to your device
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Desktop Instructions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  On Desktop (Chrome, Edge, Brave)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
                  <div className="font-semibold mb-2 text-amber-900 dark:text-amber-100">📱 Quick Bookmark Method (Works Now!)</div>
                  <div className="space-y-2 text-amber-800 dark:text-amber-200">
                    <div className="flex items-start gap-2">
                      <span className="font-bold">1.</span>
                      <span>Click the <strong>⭐ Star icon</strong> in the address bar</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold">2.</span>
                      <span>Click <strong>"Done"</strong> to save the bookmark</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold">3.</span>
                      <span>Access it anytime from your bookmarks!</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground p-3 bg-muted rounded">
                  <strong>Alternative (after visiting 2-3 times):</strong>
                  <div className="mt-1">Look in browser menu (⋮) → "Save and share" → You may see "Install app" or "Create shortcut" option after using the site a few times.</div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Instructions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  On Mobile (Android/iOS)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                  <div className="font-semibold mb-2 text-green-900 dark:text-green-100">📱 Android (Chrome):</div>
                  <div className="space-y-2 text-green-800 dark:text-green-200">
                    <div className="flex items-start gap-2">
                      <span className="font-bold">1.</span>
                      <span>Tap menu <strong>⋮</strong> at top right</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold">2.</span>
                      <span>Tap <strong>"Add to Home screen"</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold">3.</span>
                      <span>Tap <strong>"Add"</strong> - App appears on home screen!</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                  <div className="font-semibold mb-2 text-blue-900 dark:text-blue-100">🍎 iPhone (Safari):</div>
                  <div className="space-y-2 text-blue-800 dark:text-blue-200">
                    <div className="flex items-start gap-2">
                      <span className="font-bold">1.</span>
                      <span>Tap the <strong>Share button (□↑)</strong> at the bottom</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold">2.</span>
                      <span>Scroll and tap <strong>"Add to Home Screen"</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold">3.</span>
                      <span>Tap <strong>"Add"</strong> - Now on your home screen!</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => setShowInstructions(false)} variant="default">
                Got it!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
