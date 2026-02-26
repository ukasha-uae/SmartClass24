import type { TenantConfig } from '@/tenancy/types';

export type EntitlementFeature =
  | 'challenge_arena_premium'
  | 'arena_tournaments'
  | 'arena_boss_battle'
  | 'arena_school_battle'
  | 'virtual_labs_premium';

export interface SubscriptionSnapshot {
  tier?: 'free' | 'premium' | 'virtual_lab' | 'full_bundle' | string;
  isActive?: boolean;
  endDate?: string;
  features?: string[];
}

export interface EntitlementUserContext {
  uid: string | null;
  email?: string | null;
  claimsTenantId?: string | null;
  claimsRole?: string | null;
  hasTenantClaim: boolean;
}

export interface EntitlementEvaluationInput {
  tenant: TenantConfig;
  user: EntitlementUserContext;
  subscription: SubscriptionSnapshot | null;
  nowIso?: string;
}

export interface EntitlementEvaluationResult {
  access: Record<EntitlementFeature, boolean>;
  sources: {
    tenantLicense: boolean;
    individualSubscription: boolean;
    virtualLabSubscription: boolean;
  };
  reasons: string[];
}
