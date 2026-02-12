/**
 * Global Navigation Configuration
 * Separates platform-wide features from regional/localized content
 * 
 * @module lib/navigation-config
 * @version 2.0.0 (Week 2 - Global Positioning)
 */

import type { CountryConfig } from './localization/country-config';
import type { TenantConfig } from '@/tenancy/types';
import { Trophy, FlaskConical, GraduationCap, BookOpen, Users, Target, Briefcase } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  hoverBorder: string;
  textGradient: string;
  showBadge?: boolean;
  badgeText?: string;
  badgeColor?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
  show: boolean;
  description?: string;
}

// ============================================================================
// PLATFORM NAVIGATION (Always Available)
// ============================================================================

/**
 * Core platform features available to all users regardless of country/tenant
 * These are the competitive differentiators of SmartClass24
 */
export function getPlatformNav(tenant: TenantConfig): NavItem[] {
  const items: NavItem[] = [];
  
  // Challenge Arena - Competitive Learning
  if (tenant.features.enableArenaChallenge) {
    items.push({
      label: 'Challenge Arena',
      href: '/challenge-arena',
      icon: Trophy,
      description: 'Compete with classmates in timed quiz battles',
      gradient: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
      iconBg: 'from-amber-500/20 to-orange-500/20 group-hover:from-amber-500/30 group-hover:to-orange-500/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-200/50 dark:border-amber-800/50',
      hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
      textGradient: 'group-hover:from-amber-600 group-hover:to-orange-600',
    });
  }
  
  // Virtual Labs - Interactive Science
  if (tenant.features.enableVirtualLabs) {
    items.push({
      label: 'Virtual Labs',
      href: '/virtual-labs',
      icon: FlaskConical,
      description: 'Hands-on science experiments online',
      gradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30',
      iconBg: 'from-blue-500/20 to-indigo-500/20 group-hover:from-blue-500/30 group-hover:to-indigo-500/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200/50 dark:border-blue-800/50',
      hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
      textGradient: 'group-hover:from-blue-600 group-hover:to-indigo-600',
    });
  }
  
  return items;
}

// ============================================================================
// REGIONAL NAVIGATION (Country-Specific)
// ============================================================================

/**
 * Navigation items that appear when a user has selected a country
 * These link to localized content and curriculum-aligned resources
 */
export function getRegionalNav(
  country: CountryConfig | null, 
  tenant: TenantConfig
): NavItem[] {
  if (!country) return [];
  
  const items: NavItem[] = [];
  
  // Primary/JHS Campus
  if (tenant.features.enableJHSCampus) {
    items.push({
      label: `${country.academicStructure.juniorSecondary.name} Campus`,
      href: `/campus/jhs`,
      icon: BookOpen,
      description: `${country.examSystem.primary} preparation`,
      gradient: 'from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30',
      iconBg: 'from-purple-500/20 to-violet-500/20 group-hover:from-purple-500/30 group-hover:to-violet-500/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-200/50 dark:border-purple-800/50',
      hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
      textGradient: 'group-hover:from-purple-600 group-hover:to-violet-600',
      showBadge: true,
      badgeText: country.examSystem.primary,
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    });
  }
  
  // Secondary/SHS Campus
  if (tenant.features.enableSHSCampus) {
    items.push({
      label: `${country.academicStructure.seniorSecondary.name} Campus`,
      href: `/campus/shs`,
      icon: GraduationCap,
      description: `${country.examSystem.secondary} preparation`,
      gradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30',
      iconBg: 'from-emerald-500/20 to-teal-500/20 group-hover:from-emerald-500/30 group-hover:to-teal-500/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-200/50 dark:border-emerald-800/50',
      hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
      textGradient: 'group-hover:from-emerald-600 group-hover:to-teal-600',
      showBadge: true,
      badgeText: country.examSystem.secondary,
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    });
  }
  
  // Past Questions (exam-specific)
  items.push({
    label: 'Past Questions',
    href: '/past-questions',
    icon: Target,
    description: `Practice ${country.examSystem.secondary} past papers`,
    gradient: 'from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30',
    iconBg: 'from-rose-500/20 to-pink-500/20 group-hover:from-rose-500/30 group-hover:to-pink-500/30',
    iconColor: 'text-rose-600 dark:text-rose-400',
    borderColor: 'border-rose-200/50 dark:border-rose-800/50',
    hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
    textGradient: 'group-hover:from-rose-600 group-hover:to-pink-600',
  });
  
  return items;
}

// ============================================================================
// GLOBAL NAVIGATION (No Country Selected)
// ============================================================================

/**
 * Navigation items shown when user hasn't selected a country
 * Emphasizes exploration and platform capabilities
 */
export function getGlobalNav(tenant: TenantConfig): NavItem[] {
  const items: NavItem[] = [];
  
  // Explore Curriculums
  items.push({
    label: 'Explore Curriculums',
    href: '/#campuses',
    icon: BookOpen,
    description: 'Discover learning paths for your region',
    gradient: 'from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30',
    iconBg: 'from-indigo-500/20 to-blue-500/20 group-hover:from-indigo-500/30 group-hover:to-blue-500/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    borderColor: 'border-indigo-200/50 dark:border-indigo-800/50',
    hoverBorder: 'hover:border-indigo-300 dark:hover:border-indigo-700',
    textGradient: 'group-hover:from-indigo-600 group-hover:to-blue-600',
  });
  
  // For Schools/Institutions (B2B)
  if (tenant.id === 'smartclass24') { // Only show for main tenant
    items.push({
      label: 'For Schools',
      href: '/partners',
      icon: Briefcase,
      description: 'White-label solutions for institutions',
      gradient: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
      iconBg: 'from-green-500/20 to-emerald-500/20 group-hover:from-green-500/30 group-hover:to-emerald-500/30',
      iconColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-200/50 dark:border-green-800/50',
      hoverBorder: 'hover:border-green-300 dark:hover:border-green-700',
      textGradient: 'group-hover:from-green-600 group-hover:to-emerald-600',
      showBadge: true,
      badgeText: 'B2B',
      badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    });
  }
  
  return items;
}

// ============================================================================
// UTILITY NAVIGATION (Account, Pricing, etc.)
// ============================================================================

/**
 * Utility links that don't fit in platform/regional categories
 */
export function getUtilityNav(tenant: TenantConfig): NavItem[] {
  const items: NavItem[] = [];
  
  // Pricing - Only for tenants with public pricing
  if (tenant.features.enablePublicPricing !== false) {
    items.push({
      label: 'Pricing',
      href: '/pricing',
      icon: Target, // Reusing Target, could add a Dollar icon
      description: 'View subscription plans',
      gradient: 'from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30',
      iconBg: 'from-slate-500/20 to-gray-500/20 group-hover:from-slate-500/30 group-hover:to-gray-500/30',
      iconColor: 'text-slate-600 dark:text-slate-400',
      borderColor: 'border-slate-200/50 dark:border-slate-800/50',
      hoverBorder: 'hover:border-slate-300 dark:hover:border-slate-700',
      textGradient: 'group-hover:from-slate-600 group-hover:to-gray-600',
    });
  }
  
  return items;
}

// ============================================================================
// COMPLETE NAVIGATION BUILDER
// ============================================================================

export interface CompleteNav {
  platform: NavSection;
  regional: NavSection;
  global: NavSection;
  utility: NavSection;
}

/**
 * Builds complete navigation structure based on country and tenant
 * This is the main function to use in components
 */
export function buildNavigation(
  country: CountryConfig | null,
  tenant: TenantConfig
): CompleteNav {
  const platformItems = getPlatformNav(tenant);
  const regionalItems = getRegionalNav(country, tenant);
  const globalItems = getGlobalNav(tenant);
  const utilityItems = getUtilityNav(tenant);
  
  return {
    platform: {
      title: 'Platform Features',
      items: platformItems,
      show: platformItems.length > 0,
      description: 'Core learning tools available everywhere',
    },
    regional: {
      title: country ? `${country.name} Resources` : 'Regional Resources',
      items: regionalItems,
      show: regionalItems.length > 0 && country !== null,
      description: country ? `Curriculum-aligned content for ${country.name}` : '',
    },
    global: {
      title: 'Explore',
      items: globalItems,
      show: globalItems.length > 0 && country === null,
      description: 'Start your learning journey',
    },
    utility: {
      title: 'More',
      items: utilityItems,
      show: utilityItems.length > 0,
      description: '',
    },
  };
}
