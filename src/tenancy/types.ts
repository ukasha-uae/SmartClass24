export type TenantTier = 'standard' | 'premium' | 'enterprise';
export type TenantStatus = 'active' | 'trial' | 'suspended';
export type TenantMarket = 'us' | 'global' | 'ghana' | 'west-africa' | 'middle-east' | 'other';

/**
 * Simplified Branding Configuration
 * v1: Logo + 2 colors + domain
 */
/** Optional PWA install icons (192x192 and 512x512). Use PNG for best compatibility. */
export interface TenantPwaIcons {
  icon192: string;  // e.g. '/icons/acme-192.png'
  icon512: string;  // e.g. '/icons/acme-512.png'
}

export interface TenantBranding {
  name: string;
  logoUrl?: string;
  primaryColor: string;   // Main brand color
  accentColor: string;   // Secondary/accent color
  domain: string;
  supportEmail: string;
  supportPhone?: string;
  supportLocation?: string;
  /** Optional: PWA install icons (home screen / splash). If omitted, uses /icons/{tenantId}-192.png and -512.png when present. */
  pwaIcons?: TenantPwaIcons;
  
  // Education level labels (optional, for non-Ghana markets)
  educationLevelLabels?: EducationLevelLabels;

  /** Content transformation rules (find → replace) for whitelabel tenants */
  contentTransformationRules?: Record<string, string>;

  countryLabel?: string;  // e.g., "Country", "Region", "Location" (defaults to based on country)
  
  // Footer customization (optional)
  footer?: {
    tagline?: string;          // Short description/mission statement
    emoji?: string;            // Brand emoji (defaults to 🎓)
    showSocialMedia?: boolean; // Show social media links (defaults to true)
    socialLinks?: {            // Optional custom social links
      facebook?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
      linkedin?: string;
    };
  };
}

/**
 * Feature Flags (v1 scope)
 * Simple boolean toggles for campus and feature access
 */
export interface TenantFeatures {
  // Campus access
  enableJHSCampus: boolean;
  enableSHSCampus: boolean;
  enableUniversityCampus: boolean;
  
  // Core features
  enableVirtualLabs: boolean;
  enableArenaChallenge: boolean;
  
  // Optional features (disabled by default)
  enableLocalization?: boolean;
  enableParentDashboard?: boolean;
  enableOfflineMode?: boolean;
  enableReferrals?: boolean;
  
  // Pricing & Monetization
  enablePublicPricing?: boolean;  // Show pricing page for individual student subscriptions
  enableB2BOnly?: boolean;        // Tenant sells to schools/institutions only (no individual pricing)
}

/**
 * Content Selection (v1 scope)
 * Simple subject whitelist, no complex strategy
 */
export interface TenantContent {
  subjectsEnabled: string[];  // 'all' or specific subjects
  curriculumLabel?: string;   // Optional display label (e.g., "Common Core", "IGCSE")
}

/**
 * Education Level Labels
 * Custom naming for education levels per tenant
 */
export interface EducationLevelLabels {
  primary?: string;   // e.g., "Primary School", "Elementary"
  jhs?: string;       // e.g., "Middle School", "Junior High"
  shs?: string;       // e.g., "High School", "Senior High"
}

/**
 * Curriculum Configuration (v1.5)
 * Explicit curriculum system declaration
 */
export interface CurriculumConfig {
  system: string;          // 'west-african' | 'us-common-core' | 'uk-national' | 'ib' | 'alternative-holistic'
  examSystems: string[];   // ['BECE', 'WASSCE', 'NECO'] or ['SAT', 'ACT'] or [] for no exams
  gradeLevels: string[];   // ['Primary', 'JHS', 'SHS'] or ['K-12'] or ['Elementary', 'Middle', 'High']
  countries?: string[];    // Optional: specific countries using this curriculum (e.g., West African countries)
  description?: string;    // Optional: human-readable description
  /** Optional: curriculum mapping id for topic filtering (e.g. 'ghana-wassce', 'us-common-core', 'uk-gcse'). When set, topic lists are filtered by this mapping. */
  curriculumId?: string;
}

/**
 * License Configuration
 */
export interface TenantLicense {
  tier: TenantTier;
  maxStudents: number;
  expiresAt?: string;  // ISO date string
}

/**
 * Minimal Tenant Configuration (v1)
 * Optimized for fast onboarding and simplicity
 */
export interface TenantConfig {
  // Identity
  id: string;
  slug: string;
  name: string;
  market: TenantMarket;  // Target market/region
  
  // Branding (v1 scope)
  branding: TenantBranding;
  
  // Feature Flags (v1 scope)
  features: TenantFeatures;
  
  // Content Selection (v1 scope)
  content: TenantContent;
  
  // Curriculum Configuration (REQUIRED v2.0+ for multi-curriculum)
  curriculum: CurriculumConfig;  // Explicit curriculum system declaration - MUST be set
  
  // License
  license: TenantLicense;
  
  // Status
  status: TenantStatus;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Legacy interfaces for backwards compatibility
 * @deprecated Use simplified TenantConfig instead
 */
export interface TenantLimits {
  maxStudents: number;
  maxTeachers: number;
  maxCampuses: number;
}

export interface TenantLicensing {
  tier: TenantTier;
  status: TenantStatus;
  seatsPurchased: number;
  seatsUsed: number;
  renewalDate?: string;
  billingEmail?: string;
  limits: TenantLimits;
}

export interface TenantFeaturesFull {
  enableParentDashboard: boolean;
  enableOfflineMode: boolean;
  enableCustomContent: boolean;
  enableReferrals: boolean;
}
