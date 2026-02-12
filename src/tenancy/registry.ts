import type { TenantConfig } from './types';

const DEFAULT_TENANT_ID = 'smartclass24';

/**
 * Tenant Registry (v1 - Simplified)
 * Fast onboarding: ~1 hour to add new tenant
 */
export const TENANT_REGISTRY: Record<string, TenantConfig> = {
  // Default tenant (Global platform with multi-country support)
  smartclass24: {
    id: 'smartclass24',
    slug: 'smartclass24',
    name: 'SmartClass24',
    market: 'global',
    branding: {
      name: 'SmartClass24',
      logoUrl: undefined,  // Uses default S24 logo
      primaryColor: '#7c3aed',  // Purple
      accentColor: '#ec4899',   // Pink
      domain: 'smartclass24.app',
      supportEmail: 'support@smartclass24.app',
    },
    // Explicit curriculum configuration (V1.5)
    curriculum: {
      system: 'west-african',
      examSystems: ['BECE', 'WASSCE', 'NECO'],
      gradeLevels: ['Primary', 'JHS', 'SHS'],
      countries: ['ghana', 'nigeria', 'sierra-leone', 'liberia', 'gambia'],
    },
    features: {
      enableJHSCampus: true,
      enableSHSCampus: true,
      enableUniversityCampus: true,
      enableVirtualLabs: true,
      enableArenaChallenge: true,
      enableLocalization: true,  // Show country selector for B2C users
      enableParentDashboard: true,
      enableOfflineMode: true,
      enableReferrals: true,
      enablePublicPricing: true, // Show pricing for individual students
      enableB2BOnly: false,      // B2C model - sells to individual students
    },
    content: {
      subjectsEnabled: ['all'],  // All subjects available
      curriculumLabel: 'West African Curriculum (BECE/WASSCE/NECO)',
    },
    license: {
      tier: 'enterprise',
      maxStudents: 100000,
    },
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-02-12T00:00:00Z',
  },

  // Wisdom Warehouse (Dubai, UAE - Alternative education for diverse learners)
  wisdomwarehouse: {
    id: 'wisdomwarehouse',
    slug: 'wisdomwarehouse',
    name: 'Wisdom Warehouse',
    market: 'middle-east',
    branding: {
      name: 'Wisdom Warehouse',
      logoUrl: '/logos/wisdom-warehouse.png',  // Downloaded from wisdomwarehouseuae.com
      primaryColor: '#1e40af',  // Deep blue (professional, trustworthy)
      accentColor: '#f59e0b',   // Warm amber (creativity, growth)
      domain: 'learn.wisdomwarehouseuae.com',
      supportEmail: 'admin@wisdomwarehousedubai.com',  // Verified from wisdomwarehouseuae.com
      footer: {
        tagline: 'Empowering curious, creative, and developing young minds through alternative, holistic education rooted in real-world learning, emotional resilience, and individual potential.',
        emoji: '🧠',  // Brain emoji - representing wisdom and learning
        showSocialMedia: true,
        socialLinks: {
          instagram: 'https://www.instagram.com/wisdomwarehousedubai/',
          // Facebook and LinkedIn links not provided on their website
        },
      },
    },
    // Explicit curriculum configuration (V1.5)
    curriculum: {
      system: 'alternative-holistic',  // Custom alternative education model
      examSystems: [],  // No standardized exams - focuses on skills & personal development
      gradeLevels: ['K-12'],
      description: 'Project-based, hands-on learning focused on emotional resilience and individual potential',
    },
    features: {
      enableJHSCampus: true,       // Support for diverse age groups
      enableSHSCampus: true,       // Alternative high school learning
      enableUniversityCampus: false,
      enableVirtualLabs: true,     // Hands-on learning aligned with their values
      enableArenaChallenge: true,  // ✅ Challenge Arena enabled for gamified learning
      enableLocalization: false,   // No country selector - Dubai-based, custom curriculum
      enableParentDashboard: true, // Critical - parents are key stakeholders
      enableOfflineMode: false,
      enableReferrals: false,      // Wisdom Warehouse handles enrollment directly
      enablePublicPricing: false,  // B2B only - no public pricing page
      enableB2BOnly: true,         // Sells to schools/institutions, not individual students
    },
    content: {
      subjectsEnabled: [
        'Mathematics',
        'Science',
        'English',
        'Computer Science',
        'Creative Arts',
        'Life Skills',
        'Social Studies',
      ],
      curriculumLabel: 'Holistic & Personalized Learning',
    },
    license: {
      tier: 'enterprise',
      maxStudents: 500,  // Boutique, personalized approach
      expiresAt: '2027-02-01T00:00:00Z',
    },
    status: 'active',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-02T00:00:00Z',
  },

  // Demo tenant (for testing/preview)
  demo: {
    id: 'demo',
    slug: 'demo',
    name: 'Demo Academy',
    market: 'global',
    branding: {
      name: 'Demo Academy',
      logoUrl: undefined,
      primaryColor: '#0ea5e9',  // Sky blue
      accentColor: '#8b5cf6',   // Violet
      domain: 'demo.smartclass24.app',
      supportEmail: 'demo@smartclass24.app',
    },
    features: {
      enableJHSCampus: true,
      enableSHSCampus: true,
      enableUniversityCampus: true,
      enableVirtualLabs: true,
      enableArenaChallenge: true,
      enableLocalization: false,
    },
    content: {
      subjectsEnabled: ['all'],
      curriculumLabel: 'Global',
    },
    license: {
      tier: 'standard',
      maxStudents: 500,
      expiresAt: '2026-12-31T00:00:00Z',
    },
    status: 'trial',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-02T00:00:00Z',
  },
};

export function getDefaultTenant(): TenantConfig {
  return TENANT_REGISTRY[DEFAULT_TENANT_ID];
}

export function getTenantById(tenantId?: string | null): TenantConfig | null {
  if (!tenantId) {
    return null;
  }
  return TENANT_REGISTRY[tenantId] ?? null;
}

export function getTenantByHost(hostname?: string | null): TenantConfig | null {
  if (!hostname) {
    return null;
  }

  const normalizedHost = hostname.replace(/^www\./, '').toLowerCase();
  const match = Object.values(TENANT_REGISTRY).find(
    tenant => tenant.branding.domain.toLowerCase() === normalizedHost,
  );

  return match ?? null;
}
