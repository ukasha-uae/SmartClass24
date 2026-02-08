'use client';

import { useEffect, useState } from 'react';
import { applyTenantTheme } from '@/tenancy/theme';
import { useTenant } from '@/hooks/useTenant';

interface TenantThemeProviderProps {
  children: React.ReactNode;
}

function TenantThemeProviderInner({ children }: TenantThemeProviderProps) {
  const { tenant } = useTenant();

  useEffect(() => {
    applyTenantTheme(tenant);
  }, [tenant]);

  return <>{children}</>;
}

export function TenantThemeProvider({ children }: TenantThemeProviderProps) {
  return <TenantThemeProviderInner>{children}</TenantThemeProviderInner>;
}
