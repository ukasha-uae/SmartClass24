export type TenantTier = 'standard' | 'premium' | 'enterprise';
export type TenantStatus = 'active' | 'trial' | 'suspended';
export type TenantMarket = 'us' | 'global' | 'ghana' | 'west-africa' | 'middle-east' | 'other';

/**
 * Simplified Branding Configuration
 * v1: Logo + 2 colors + domain
 */
export interface TenantBranding {
  name: string;
  logoUrl?: string;
  primaryColor: string;   // Main brand color
  accentColor: string;    // Secondary/accent color
  domain: string;
  supportEmail: string;
  
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
