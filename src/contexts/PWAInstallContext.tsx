'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

/** BeforeInstallPromptEvent from the browser */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallContextValue {
  /** Native install prompt if browser has fired beforeinstallprompt (not fired in incognito) */
  deferredPrompt: BeforeInstallPromptEvent | null;
  /** True when running as installed PWA (standalone) – hide all install UI */
  isStandalone: boolean;
  /** True when we can show install UI (not standalone, secure context) */
  canShowInstall: boolean;
  showInstructions: boolean;
  setShowInstructions: (show: boolean) => void;
  /** Trigger install: runs native prompt() only (no instruction popups). */
  triggerInstall: () => void;
}

const PWAInstallContext = createContext<PWAInstallContextValue | null>(null);

export function usePWAInstall(): PWAInstallContextValue | null {
  return useContext(PWAInstallContext);
}

export function PWAInstallProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(display-mode: standalone)');
    const update = () => setIsStandalone(mq.matches);
    update();
    mq.addEventListener('change', update);
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => {
      mq.removeEventListener('change', update);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const triggerInstall = useCallback(() => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    }
    // When no native prompt: do nothing (no 3-dots instruction popups)
  }, [deferredPrompt]);

  const canShowInstall = !isStandalone && typeof window !== 'undefined' && window.isSecureContext;

  const value: PWAInstallContextValue = {
    deferredPrompt,
    isStandalone,
    canShowInstall,
    showInstructions,
    setShowInstructions,
    triggerInstall,
  };

  return (
    <PWAInstallContext.Provider value={value}>
      {children}
    </PWAInstallContext.Provider>
  );
}
