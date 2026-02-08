'use client';

import { createContext } from 'react';

export const TenantParamContext = createContext<string | null>(null);

export function TenantParamProvider({
  initialTenantId,
  children,
}: {
  initialTenantId: string | null;
  children: React.ReactNode;
}) {
  return (
    <TenantParamContext.Provider value={initialTenantId}>
      {children}
    </TenantParamContext.Provider>
  );
}
