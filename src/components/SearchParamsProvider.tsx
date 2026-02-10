'use client';

import { Suspense, ReactNode } from 'react';

/**
 * SearchParamsProvider
 * Wraps children in a Suspense boundary to safely handle useSearchParams
 * Use this wrapper for any component that uses useSearchParams hook
 */
export function SearchParamsProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      {children}
    </Suspense>
  );
}

/**
 * SearchParamsProviderSilent
 * Same as SearchParamsProvider but with no fallback UI (null)
 * Use for components where loading state shouldn't be shown
 */
export function SearchParamsProviderSilent({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      {children}
    </Suspense>
  );
}
