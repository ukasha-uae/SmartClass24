'use client';

import { createContext } from 'react';

export const TenantParamContext = createContext<string | null>(null);
