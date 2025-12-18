/**
 * Localization Context
 * Provides country configuration and localization utilities throughout the app
 * 
 * @module localization/localization-context
 * @version 1.0.0
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CountryConfig } from './country-config';
import { getCountryConfig, DEFAULT_COUNTRY, ghanaConfig } from './countries';
import { localizeText, localizeObject } from './content-adapter';

// ============================================================================
// CONTEXT TYPES
// ============================================================================

interface LocalizationContextValue {
  // Current country
  country: CountryConfig;
  countryId: string;
  
  // User preferences
  userRegion: string | null;
  
  // Setters
  setCountry: (countryId: string) => void;
  setRegion: (region: string) => void;
  
  // Localization utilities
  localizeContent: (text: string) => string;
  localizeObject: <T extends Record<string, any>>(obj: T) => T;
  
  // Formatting utilities
  formatCurrency: (amount: number, includeCode?: boolean) => string;
  formatDate: (date: Date) => string;
  formatPhoneNumber: (phone: string) => string;
  
  // Quick access helpers
  getCurrencySymbol: () => string;
  getPrimaryExam: () => string;
  getSecondaryExam: () => string;
  getCapital: () => string;
  getJuniorSecondaryName: () => string;
  getSeniorSecondaryName: () => string;
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const LocalizationContext = createContext<LocalizationContextValue | undefined>(undefined);

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
  COUNTRY_ID: 'user-country-id',
  REGION: 'user-region',
  PREFERENCES: 'user-localization-preferences',
} as const;

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface LocalizationProviderProps {
  children: React.ReactNode;
  defaultCountry?: string;
}

export function LocalizationProvider({ 
  children,
  defaultCountry = DEFAULT_COUNTRY 
}: LocalizationProviderProps) {
  const [countryId, setCountryIdState] = useState<string>(defaultCountry);
  const [country, setCountryState] = useState<CountryConfig>(ghanaConfig);
  const [userRegion, setUserRegionState] = useState<string | null>(null);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    // Load saved preferences from localStorage
    if (typeof window !== 'undefined') {
      const savedCountryId = localStorage.getItem(STORAGE_KEYS.COUNTRY_ID);
      const savedRegion = localStorage.getItem(STORAGE_KEYS.REGION);

      if (savedCountryId) {
        const config = getCountryConfig(savedCountryId);
        if (config) {
          setCountryIdState(savedCountryId);
          setCountryState(config);
        }
      }

      if (savedRegion) {
        setUserRegionState(savedRegion);
      }
    }
  }, []);

  // ============================================================================
  // SETTERS
  // ============================================================================

  const setCountry = useCallback((newCountryId: string) => {
    const config = getCountryConfig(newCountryId);
    
    if (config) {
      setCountryIdState(newCountryId);
      setCountryState(config);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.COUNTRY_ID, newCountryId);
      }
      
      // Emit custom event for other components to react
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('country-changed', { 
          detail: { countryId: newCountryId, country: config } 
        }));
      }
    }
  }, []);

  const setRegion = useCallback((region: string) => {
    setUserRegionState(region);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.REGION, region);
    }
  }, []);

  // ============================================================================
  // LOCALIZATION UTILITIES
  // ============================================================================

  const localizeContent = useCallback((text: string): string => {
    return localizeText(text, country);
  }, [country]);

  const localizeObjectUtil = useCallback(<T extends Record<string, any>>(obj: T): T => {
    return localizeObject(obj, country);
  }, [country]);

  // ============================================================================
  // FORMATTING UTILITIES
  // ============================================================================

  const formatCurrency = useCallback((amount: number, includeCode = false): string => {
    const formatted = `${country.currency.symbol}${amount.toLocaleString()}`;
    return includeCode ? `${formatted} ${country.currency.code}` : formatted;
  }, [country]);

  const formatDate = useCallback((date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    // Use country's date format
    return country.localizationRules.dateFormat
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year.toString());
  }, [country]);

  const formatPhoneNumber = useCallback((phone: string): string => {
    // Basic formatting based on country pattern
    // TODO: Implement more sophisticated phone formatting
    return phone;
  }, [country]);

  // ============================================================================
  // QUICK ACCESS HELPERS
  // ============================================================================

  const getCurrencySymbol = useCallback(() => country.currency.symbol, [country]);
  const getPrimaryExam = useCallback(() => country.examSystem.primary, [country]);
  const getSecondaryExam = useCallback(() => country.examSystem.secondary, [country]);
  const getCapital = useCallback(() => country.capital, [country]);
  const getJuniorSecondaryName = useCallback(() => country.academicStructure.juniorSecondary.name, [country]);
  const getSeniorSecondaryName = useCallback(() => country.academicStructure.seniorSecondary.name, [country]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: LocalizationContextValue = {
    country,
    countryId,
    userRegion,
    setCountry,
    setRegion,
    localizeContent,
    localizeObject: localizeObjectUtil,
    formatCurrency,
    formatDate,
    formatPhoneNumber,
    getCurrencySymbol,
    getPrimaryExam,
    getSecondaryExam,
    getCapital,
    getJuniorSecondaryName,
    getSeniorSecondaryName,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to access localization context
 * 
 * @throws Error if used outside LocalizationProvider
 * @returns Localization context value
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { country, formatCurrency, localizeContent } = useLocalization();
 *   
 *   return (
 *     <div>
 *       <p>{country.name}</p>
 *       <p>{formatCurrency(100)}</p>
 *       <p>{localizeContent("Study at {{city:capital}}")}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useLocalization(): LocalizationContextValue {
  const context = useContext(LocalizationContext);
  
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  
  return context;
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { LocalizationContextValue };
export default LocalizationContext;
