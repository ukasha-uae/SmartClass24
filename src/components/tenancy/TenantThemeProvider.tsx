'use client';

import { useEffect, useMemo } from 'react';
import { resolveTenantFromWindow } from '@/tenancy/resolveTenant';
import { applyTenantTheme } from '@/tenancy/theme';
import type { TenantConfig } from '@/tenancy/types';

interface TenantThemeProviderProps {
  children: React.ReactNode;
}

export function TenantThemeProvider({ children }: TenantThemeProviderProps) {
  const tenant = useMemo<TenantConfig>(() => resolveTenantFromWindow(), []);

  useEffect(() => {
    applyTenantTheme(tenant);
  }, [tenant]);

  return <>{children}</>;
}
