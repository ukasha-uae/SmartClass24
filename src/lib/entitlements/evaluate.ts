import type { TenantConfig } from '@/tenancy/types';
import type {
  EntitlementEvaluationInput,
  EntitlementEvaluationResult,
  SubscriptionSnapshot,
} from './types';

function isSubscriptionActive(subscription: SubscriptionSnapshot | null, now: Date): boolean {
  if (!subscription?.isActive) return false;
  if (!subscription.endDate) return true;

  const end = new Date(subscription.endDate);
  if (Number.isNaN(end.getTime())) return false;
  return end >= now;
}

function isTenantLicenseActive(tenant: TenantConfig, now: Date): boolean {
  if (!(tenant.status === 'active' || tenant.status === 'trial')) return false;
  if (!tenant.license.expiresAt) return true;

  const expiresAt = new Date(tenant.license.expiresAt);
  if (Number.isNaN(expiresAt.getTime())) return false;
  return expiresAt >= now;
}

export function evaluateEntitlements(input: EntitlementEvaluationInput): EntitlementEvaluationResult {
  const now = new Date(input.nowIso ?? new Date().toISOString());

  const subscriptionActive = isSubscriptionActive(input.subscription, now);
  const tier = input.subscription?.tier ?? 'free';
  const subscriptionHasPremium = subscriptionActive && (tier === 'premium' || tier === 'full_bundle');
  const subscriptionHasVirtualLabs =
    subscriptionActive && (tier === 'virtual_lab' || tier === 'full_bundle');

  const tenantLicenseActive = isTenantLicenseActive(input.tenant, now);
  // Temporary business hotfix:
  // Wisdom Warehouse is a paid institution and needs uninterrupted access while
  // key-onboarding is being finalized for all users.
  const bypassTenantClaimForTrustedTenant = input.tenant.id === 'wisdomwarehouse';
  const tenantLicenseEligible =
    (bypassTenantClaimForTrustedTenant ||
      (input.user.hasTenantClaim &&
        !!input.user.claimsTenantId &&
        input.user.claimsTenantId === input.tenant.id)) &&
    tenantLicenseActive;

  const challengeArenaPremium = tenantLicenseEligible || subscriptionHasPremium;
  const virtualLabsPremium = tenantLicenseEligible || subscriptionHasVirtualLabs;

  const reasons: string[] = [];
  if (tenantLicenseEligible) {
    reasons.push('Access granted by active tenant license.');
  } else if (subscriptionHasPremium || subscriptionHasVirtualLabs) {
    reasons.push('Access granted by individual subscription.');
  } else {
    reasons.push('No active tenant license match or qualifying subscription.');
  }

  if (!input.user.hasTenantClaim && input.tenant.id !== 'smartclass24' && !bypassTenantClaimForTrustedTenant) {
    reasons.push('User has no tenant claim; institution license cannot be trusted yet.');
  }
  if (bypassTenantClaimForTrustedTenant) {
    reasons.push('Temporary override: Wisdom Warehouse tenant license bypasses per-user claim checks.');
  }

  return {
    access: {
      challenge_arena_premium: challengeArenaPremium,
      arena_tournaments: challengeArenaPremium,
      arena_boss_battle: challengeArenaPremium,
      arena_school_battle: challengeArenaPremium,
      virtual_labs_premium: virtualLabsPremium,
    },
    sources: {
      tenantLicense: tenantLicenseEligible,
      individualSubscription: subscriptionHasPremium,
      virtualLabSubscription: subscriptionHasVirtualLabs,
    },
    reasons,
  };
}
