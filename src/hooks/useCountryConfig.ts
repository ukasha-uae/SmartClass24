/**
 * useCountryConfig Hook
 * Quick access to country configuration
 * 
 * @module hooks/useCountryConfig
 * @version 1.0.0
 */

'use client';

import { useLocalization } from './useLocalization';
import type { CountryConfig } from '@/lib/localization/country-config';
import { getGlobalConfig } from '@/lib/localization/countries';

/**
 * Hook to access the current country configuration
 * 
 * @returns Current country configuration
 * 
 * @example
 * ```typescript
 * function ExamPrep() {
 *   const country = useCountryConfig();
 *   
 *   return (
 *     <div>
 *       <h1>Prepare for {country.examSystem.primary}</h1>
 *       <p>Currency: {country.currency.symbol}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCountryConfig(): CountryConfig {
  const { country } = useLocalization();
  return country ?? getGlobalConfig();
}

/**
 * Hook to access specific country properties
 * 
 * @returns Object with commonly used country properties
 * 
 * @example
 * ```typescript
 * function Component() {
 *   const { currencySymbol, primaryExam, capital } = useCountryProperties();
 *   
 *   return <p>{currencySymbol} - {primaryExam} - {capital}</p>;
 * }
 * ```
 */
export function useCountryProperties() {
  const { country } = useLocalization();
  const resolvedCountry = country ?? getGlobalConfig();
  
  return {
    countryName: resolvedCountry.name,
    countryFlag: resolvedCountry.flag,
    currencySymbol: resolvedCountry.currency.symbol,
    currencyCode: resolvedCountry.currency.code,
    currencyName: resolvedCountry.currency.name,
    primaryExam: resolvedCountry.examSystem.primary,
    secondaryExam: resolvedCountry.examSystem.secondary,
    tertiaryExam: resolvedCountry.examSystem.tertiary,
    capital: resolvedCountry.capital,
    regions: resolvedCountry.regions,
    majorCities: resolvedCountry.majorCities,
    jhsName: resolvedCountry.academicStructure.juniorSecondary.name,
    shsName: resolvedCountry.academicStructure.seniorSecondary.name,
    primaryName: resolvedCountry.academicStructure.primary.name,
  };
}

/**
 * Hook to access cultural context
 * 
 * @returns Cultural context of current country
 * 
 * @example
 * ```typescript
 * function CulturalSection() {
 *   const { festivals, landmarks, foods } = useCulturalContext();
 *   
 *   return (
 *     <div>
 *       <h2>Festivals</h2>
 *       {festivals.map(f => <p key={f.name}>{f.name}</p>)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCulturalContext() {
  const { country } = useLocalization();
  return (country ?? getGlobalConfig()).culturalContext;
}
