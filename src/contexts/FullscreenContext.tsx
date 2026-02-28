'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface FullscreenContextType {
  isFullscreen: boolean;
  setFullscreen: (value: boolean, options?: { lockScroll?: boolean }) => void;
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined);

export function FullscreenProvider({ children }: { children: React.ReactNode }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const setFullscreen = (value: boolean, options?: { lockScroll?: boolean }) => {
    setIsFullscreen(value);
    // Preserve old behavior by default (lock scroll), but allow immersive pages
    // to hide chrome while keeping scroll enabled.
    if (value && (options?.lockScroll ?? true)) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  return (
    <FullscreenContext.Provider value={{ isFullscreen, setFullscreen }}>
      {children}
    </FullscreenContext.Provider>
  );
}

export function useFullscreen() {
  const context = useContext(FullscreenContext);
  if (context === undefined) {
    throw new Error('useFullscreen must be used within a FullscreenProvider');
  }
  return context;
}

