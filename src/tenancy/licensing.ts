import type { TenantConfig, TenantLicensing } from './types';

export function hasActiveLicense(licensing: TenantLicensing) {
  return licensing.status === 'active' || licensing.status === 'trial';
}

export function hasSeatAvailability(licensing: TenantLicensing) {
  return licensing.seatsPurchased === 0 || licensing.seatsUsed < licensing.seatsPurchased;
}

export function getTenantEntitlements(tenant: TenantConfig) {
  return {
    canAccessContent: hasActiveLicense(tenant.licensing),
    canInviteStudents: hasActiveLicense(tenant.licensing) && hasSeatAvailability(tenant.licensing),
    canUseCustomContent: tenant.features.enableCustomContent,
    maxStudents: tenant.licensing.limits.maxStudents,
    maxTeachers: tenant.licensing.limits.maxTeachers,
    maxCampuses: tenant.licensing.limits.maxCampuses,
  };
}
