'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTenant } from '@/hooks/useTenant';
import { usePWAInstall } from '@/contexts/PWAInstallContext';
import { Download, Share2, MoreVertical, Plus, ChevronRight, CheckCircle } from 'lucide-react';

type Platform = 'ios' | 'android' | 'desktop';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  const isIPad = /iPad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (/iPhone|iPod/.test(ua) || isIPad) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

/**
 * Simple, visual, step-by-step install guide for non–tech-savvy users.
 * Shows one step at a time with big icons and short text (e.g. Wisdom Warehouse).
 */
export function PWAInstallInstructionsDialog() {
  const pwa = usePWAInstall();
  const { branding } = useTenant();
  const open = pwa?.showInstructions ?? false;
  const onClose = () => pwa?.setShowInstructions(false);

  const platform = useMemo(() => detectPlatform(), [open]);
  const [step, setStep] = useState(1);

  const steps = useMemo(() => {
    const appName = branding.name;
    if (platform === 'ios') {
      return [
        { num: 1, icon: Share2, text: 'Tap the Share button at the bottom of the screen.', sub: 'It looks like a box with an arrow pointing up.' },
        { num: 2, icon: Plus, text: "Scroll down and tap 'Add to Home Screen'.", sub: 'Then tap Add in the top right.' },
      ];
    }
    if (platform === 'android') {
      return [
        { num: 1, icon: MoreVertical, text: 'Tap the three dots ⋮ at the top right of the screen.', sub: 'They are in the browser bar.' },
        { num: 2, icon: Download, text: "Tap 'Install app' or 'Add to Home screen'.", sub: `The app will be called ${appName}.` },
      ];
    }
    // desktop (Chrome, Edge, etc.)
    return [
      { num: 1, icon: MoreVertical, text: 'Click the three dots ⋮ in the top right of the browser.', sub: 'In the same row as the address bar.' },
      { num: 2, icon: Download, text: `Click 'Install ${appName}' or 'Install app'.`, sub: 'The app will open in its own window.' },
    ];
  }, [platform, branding.name]);

  const current = steps[step - 1];
  const isLastStep = step === steps.length;

  const handleNext = () => {
    if (isLastStep) onClose();
    else setStep((s) => s + 1);
  };

  const handleOpen = (o: boolean) => {
    if (!o) {
      onClose();
      setStep(1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Download className="h-6 w-6 text-violet-500 shrink-0" />
            Install {branding.name}
          </DialogTitle>
        </DialogHeader>

        <div className="pt-2 pb-4">
          {/* Step indicator */}
          <div className="flex gap-2 justify-center mb-6">
            {steps.map((s) => (
              <div
                key={s.num}
                className={`h-2 rounded-full flex-1 max-w-16 ${step >= s.num ? 'bg-violet-500' : 'bg-muted'}`}
                aria-hidden
              />
            ))}
          </div>

          {/* One big step */}
          <div className="rounded-xl bg-violet-50 dark:bg-violet-950/40 border-2 border-violet-200 dark:border-violet-800 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-2xl bg-violet-500 flex items-center justify-center text-white">
                {current && <current.icon className="h-8 w-8" />}
              </div>
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">
              Step {current?.num} of {steps.length}
            </p>
            <p className="text-base text-foreground mb-1">{current?.text}</p>
            {current?.sub && (
              <p className="text-sm text-muted-foreground">{current.sub}</p>
            )}
          </div>

          {/* Single primary action */}
          <Button
            onClick={handleNext}
            className="w-full mt-6 h-12 text-base font-semibold"
            size="lg"
          >
            {isLastStep ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Got it
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-5 w-5 ml-1" />
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            {platform === 'desktop' && 'If you don’t see Install, try refreshing the page.'}
            {platform !== 'desktop' && 'If you don’t see these options, try opening this page in a normal (non-private) tab.'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
