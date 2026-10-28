import type { TenantConfig, TenantLicensing } from './types';

export function hasActiveLicense(licensing: TenantLicensing) {
  return licensing.status === 'active' || licensing.status === 'trial';
}

export function hasSeatAvailability(licensing: TenantLicensing) {
  return licensing.seatsPurchased === 0 || licensing.seatsUsed < licensing.seatsPurchased;
}

export function getTenantEntitlements(tenant: TenantConfig) {
  const licensing = tenant.licensing ?? {
    tier: tenant.license.tier,
    status: tenant.status,
    seatsPurchased: tenant.license.maxStudents,
    seatsUsed: 0,
    limits: {
      maxStudents: tenant.license.maxStudents,
      maxTeachers: 0,
      maxCampuses: 0,
    },
  };

  return {
    canAccessContent: hasActiveLicense(licensing),
    canInviteStudents: hasActiveLicense(licensing) && hasSeatAvailability(licensing),
    canUseCustomContent: tenant.features.enableCustomContent ?? false,
    maxStudents: licensing.limits.maxStudents,
    maxTeachers: licensing.limits.maxTeachers,
    maxCampuses: licensing.limits.maxCampuses,
  };
}
