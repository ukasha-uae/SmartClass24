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
  return country;
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
  
  return {
    countryName: country.name,
    countryFlag: country.flag,
    currencySymbol: country.currency.symbol,
    currencyCode: country.currency.code,
    currencyName: country.currency.name,
    primaryExam: country.examSystem.primary,
    secondaryExam: country.examSystem.secondary,
    tertiaryExam: country.examSystem.tertiary,
    capital: country.capital,
    regions: country.regions,
    majorCities: country.majorCities,
    jhsName: country.academicStructure.juniorSecondary.name,
    shsName: country.academicStructure.seniorSecondary.name,
    primaryName: country.academicStructure.primary.name,
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
  return country.culturalContext;
}
