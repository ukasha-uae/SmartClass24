'use client';

import type { User } from 'firebase/auth';
import { callCallableFunction } from '@/lib/callable-functions';

export type TenantAccessKeySummary = {
  keyHash: string;
  tenantId: string | null;
  label: string;
  uses: number;
  maxUses: number | null;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string | null;
  createdBy: string | null;
};

export type TenantBillingSummary = {
  tenantId: string;
  userCount: number;
  activeKeys: number;
  totalKeys: number;
};

export async function redeemTenantAccessKey(user: User, accessKey: string): Promise<{ tenantId: string }> {
  return callCallableFunction<{ accessKey: string }, { success: boolean; tenantId: string }>(
    'redeemTenantAccessKey',
    { accessKey },
    user
  );
}

export async function createTenantAccessKey(
  user: User,
  params: { tenantId: string; label: string; expiresAt?: string; maxUses?: number }
): Promise<{ accessKey: string; keyHash: string; tenantId: string }> {
  return callCallableFunction<
    { tenantId: string; label: string; expiresAt?: string; maxUses?: number },
    { success: boolean; accessKey: string; keyHash: string; tenantId: string }
  >('createTenantAccessKey', params, user);
}

export async function listTenantAccessKeys(user: User): Promise<TenantAccessKeySummary[]> {
  const res = await callCallableFunction<Record<string, never>, { success: boolean; keys: TenantAccessKeySummary[] }>(
    'listTenantAccessKeys',
    {},
    user
  );
  return res.keys || [];
}

export async function revokeTenantAccessKey(user: User, keyHash: string): Promise<void> {
  await callCallableFunction<{ keyHash: string }, { success: boolean }>('revokeTenantAccessKey', { keyHash }, user);
}

export async function listTenantBillingOverview(user: User): Promise<TenantBillingSummary[]> {
  const res = await callCallableFunction<Record<string, never>, { success: boolean; tenants: TenantBillingSummary[] }>(
    'listTenantBillingOverview',
    {},
    user
  );
  return res.tenants || [];
}

export async function rotateTenantAccessKey(
  user: User,
  params: { tenantId: string; label: string; expiresAt?: string; maxUses?: number }
): Promise<{ accessKey: string; keyHash: string; tenantId: string; revokedCount: number }> {
  return callCallableFunction<
    { tenantId: string; label: string; expiresAt?: string; maxUses?: number },
    { success: boolean; accessKey: string; keyHash: string; tenantId: string; revokedCount: number }
  >('rotateTenantAccessKey', params, user);
}

export async function updateTenantAccessKeyMaxUses(
  user: User,
  params: { keyHash: string; maxUses: number | null }
): Promise<void> {
  await callCallableFunction<{ keyHash: string; maxUses: number | null }, { success: boolean }>(
    'updateTenantAccessKeyMaxUses',
    params,
    user
  );
}
