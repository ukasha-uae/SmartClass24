/**
 * Country Configuration Index
 * Central registry of all country configurations
 * 
 * @module localization/countries
 * @version 1.0.0
 */

import type { CountryConfig } from '../country-config';
import { isValidCountryConfig, isActiveCountry } from '../country-config';
import ghanaConfig from './ghana';
import nigeriaConfig from './nigeria';
import sierraLeoneConfig from './sierra-leone';
import liberiaConfig from './liberia';
import gambiaConfig from './gambia';

// ============================================================================
// COUNTRY REGISTRY
// ============================================================================

/**
 * All available country configurations
 */
export const COUNTRIES: Record<string, CountryConfig> = {
  ghana: ghanaConfig,
  nigeria: nigeriaConfig,
  'sierra-leone': sierraLeoneConfig,
  liberia: liberiaConfig,
  gambia: gambiaConfig,
};

/**
 * Default country (used for new users)
 */
export const DEFAULT_COUNTRY = 'ghana';

// ============================================================================
// COUNTRY RETRIEVAL FUNCTIONS
// ============================================================================

/**
 * Get country configuration by ID
 * 
 * @param countryId - Country identifier
 * @returns Country configuration or null if not found
 * 
 * @example
 * ```typescript
 * const nigeria = getCountryConfig('nigeria');
 * console.log(nigeria.currency.symbol); // ₦
 * ```
 */
export function getCountryConfig(countryId: string): CountryConfig | null {
  const config = COUNTRIES[countryId.toLowerCase()];
  return config && isValidCountryConfig(config) ? config : null;
}

/**
 * Get all country configurations
 * 
 * @returns Array of all country configurations
 */
export function getAllCountries(): CountryConfig[] {
  return Object.values(COUNTRIES);
}

/**
 * Get only active countries (available for users)
 * 
 * @returns Array of active country configurations
 */
export function getActiveCountries(): CountryConfig[] {
  return getAllCountries().filter(isActiveCountry);
}

/**
 * Get countries by status
 * 
 * @param status - Country status to filter by
 * @returns Array of countries with specified status
 */
export function getCountriesByStatus(
  status: CountryConfig['status']
): CountryConfig[] {
  return getAllCountries().filter((country) => country.status === status);
}

/**
 * Get countries sorted by priority
 * 
 * @returns Array of countries sorted by priority (1 = highest)
 */
export function getCountriesByPriority(): CountryConfig[] {
  return getAllCountries().sort((a, b) => a.priority - b.priority);
}

/**
 * Check if a country ID is valid
 * 
 * @param countryId - Country identifier to check
 * @returns True if country exists
 */
export function isValidCountryId(countryId: string): boolean {
  return countryId.toLowerCase() in COUNTRIES;
}

// ============================================================================
// COUNTRY COMPARISON FUNCTIONS
// ============================================================================

/**
 * Get countries that share the same exam system
 * 
 * @param examType - Type of exam ('primary' or 'secondary')
 * @param examName - Name of the exam (e.g., 'WASSCE')
 * @returns Array of countries with that exam
 */
export function getCountriesByExam(
  examType: 'primary' | 'secondary' | 'tertiary',
  examName: string
): CountryConfig[] {
  return getAllCountries().filter((country) => {
    const exam = country.examSystem[examType];
    return exam?.includes(examName) ?? false;
  });
}

/**
 * Get countries by currency
 * 
 * @param currencyCode - ISO currency code (e.g., 'GHS', 'NGN')
 * @returns Country configuration or null
 */
export function getCountryByCurrency(currencyCode: string): CountryConfig | null {
  return (
    getAllCountries().find(
      (country) => country.currency.code === currencyCode.toUpperCase()
    ) || null
  );
}

/**
 * Get countries in the same timezone
 * 
 * @param timezone - Timezone identifier (e.g., 'Africa/Accra')
 * @returns Array of countries in that timezone
 */
export function getCountriesByTimezone(timezone: string): CountryConfig[] {
  return getAllCountries().filter((country) => country.timezone === timezone);
}

// ============================================================================
// COUNTRY METADATA
// ============================================================================

/**
 * Get list of all country IDs
 * 
 * @returns Array of country IDs
 */
export function getCountryIds(): string[] {
  return Object.keys(COUNTRIES);
}

/**
 * Get list of all country names
 * 
 * @returns Array of country names
 */
export function getCountryNames(): string[] {
  return getAllCountries().map((country) => country.name);
}

/**
 * Get country options for UI selectors
 * 
 * @returns Array of objects with id, name, and flag
 */
export function getCountryOptions(): Array<{
  id: string;
  name: string;
  flag: string;
  status: CountryConfig['status'];
}> {
  return getAllCountries().map((country) => ({
    id: country.id,
    name: country.name,
    flag: country.flag,
    status: country.status,
  }));
}

/**
 * Get active country options (for user selection)
 * 
 * @returns Array of active country options
 */
export function getActiveCountryOptions(): Array<{
  id: string;
  name: string;
  flag: string;
}> {
  return getActiveCountries().map((country) => ({
    id: country.id,
    name: country.name,
    flag: country.flag,
  }));
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Get statistics about available countries
 * 
 * @returns Object with country statistics
 */
export function getCountryStats(): {
  total: number;
  active: number;
  beta: number;
  comingSoon: number;
  totalRegions: number;
  totalLandmarks: number;
} {
  const all = getAllCountries();
  
  return {
    total: all.length,
    active: all.filter((c) => c.status === 'active').length,
    beta: all.filter((c) => c.status === 'beta').length,
    comingSoon: all.filter((c) => c.status === 'coming_soon').length,
    totalRegions: all.reduce((sum, c) => sum + c.regions.length, 0),
    totalLandmarks: all.reduce(
      (sum, c) => sum + c.culturalContext.landmarks.length,
      0
    ),
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Export individual country configs for direct access
 */
export { ghanaConfig, nigeriaConfig };
export { sierraLeoneConfig } from './sierra-leone';
export { liberiaConfig } from './liberia';
export { gambiaConfig } from './gambia';

/**
 * Export default as country registry
 */
export default COUNTRIES;
