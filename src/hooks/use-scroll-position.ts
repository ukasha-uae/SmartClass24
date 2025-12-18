"use client";

import { useEffect, useState } from 'react';

/**
 * Custom hook to track scroll position
 * @param threshold - Scroll threshold in pixels to trigger state change
 * @returns boolean indicating if scrolled past threshold
 */
export function useScrollPosition(threshold: number = 10): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > threshold;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Check initial position
    handleScroll();

    // Add scroll listener with passive flag for performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled, threshold]);

  return scrolled;
}
