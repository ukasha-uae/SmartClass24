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
import { getCountryConfig, getGlobalConfig, DEFAULT_COUNTRY } from './countries';
import { localizeText, localizeObject } from './content-adapter';

// ============================================================================
// CONTEXT TYPES
// ============================================================================

interface LocalizationContextValue {
  // Current country (null if no country selected)
  country: CountryConfig | null;
  countryId: string | null;
  
  // User preferences
  userRegion: string | null;
  
  // Setters
  setCountry: (countryId: string | null) => void;
  setRegion: (region: string) => void;
  clearCountry: () => void;
  
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

const defaultLocalizationContext: LocalizationContextValue = {
  country: null,
  countryId: null,
  userRegion: null,
  setCountry: () => {},
  setRegion: () => {},
  clearCountry: () => {},
  localizeContent: (text: string) => text,
  localizeObject: <T extends Record<string, any>>(obj: T) => obj,
  formatCurrency: (amount: number, includeCode = false) => {
    const formatted = `$${amount.toLocaleString()}`;
    return includeCode ? `${formatted} USD` : formatted;
  },
  formatDate: (date: Date) => date.toLocaleDateString('en-US'),
  formatPhoneNumber: (phone: string) => phone,
  getCurrencySymbol: () => '$',
  getPrimaryExam: () => 'primary exams',
  getSecondaryExam: () => 'secondary exams',
  getCapital: () => '',
  getJuniorSecondaryName: () => 'Junior Secondary',
  getSeniorSecondaryName: () => 'Senior Secondary',
};

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
  // Start with null country for true global platform (user must select)
  const [countryId, setCountryIdState] = useState<string | null>(null);
  const [country, setCountryState] = useState<CountryConfig | null>(null);
  const [userRegion, setUserRegionState] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    // Load saved preferences from localStorage
    if (typeof window !== 'undefined') {
      const savedCountryId = localStorage.getItem(STORAGE_KEYS.COUNTRY_ID);
      const savedRegion = localStorage.getItem(STORAGE_KEYS.REGION);

      if (savedCountryId) {
        // User has previously selected a country - use it
        const config = getCountryConfig(savedCountryId);
        if (config) {
          setCountryIdState(savedCountryId);
          setCountryState(config);
        }
      }
      // Note: If no saved country, we leave it as null (global platform)
      // Users can select their country if needed

      if (savedRegion) {
        setUserRegionState(savedRegion);
      }
      
      setIsInitialized(true);
    }
  }, []);

  // ============================================================================
  // SETTERS
  // ============================================================================

  const setCountry = useCallback((newCountryId: string | null) => {
    if (newCountryId === null) {
      // Clear country selection - return to global platform
      setCountryIdState(null);
      setCountryState(null);
      
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.COUNTRY_ID);
      }
      
      // Emit custom event for other components to react
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('country-changed', { 
          detail: { countryId: null, country: null } 
        }));
      }
      return;
    }
    
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

  const clearCountry = useCallback(() => {
    setCountry(null);
  }, [setCountry]);

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
    if (!country) return text; // No localization if no country selected
    return localizeText(text, country);
  }, [country]);

  const localizeObjectUtil = useCallback(<T extends Record<string, any>>(obj: T): T => {
    if (!country) return obj; // No localization if no country selected
    return localizeObject(obj, country);
  }, [country]);

  // ============================================================================
  // FORMATTING UTILITIES
  // ============================================================================

  const formatCurrency = useCallback((amount: number, includeCode = false): string => {
    if (!country) {
      // Global default - use USD
      const formatted = `$${amount.toLocaleString()}`;
      return includeCode ? `${formatted} USD` : formatted;
    }
    const formatted = `${country.currency.symbol}${amount.toLocaleString()}`;
    return includeCode ? `${formatted} ${country.currency.code}` : formatted;
  }, [country]);

  const formatDate = useCallback((date: Date): string => {
    if (!country) {
      // Global default - use ISO format
      return date.toLocaleDateString('en-US');
    }
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

  const getCurrencySymbol = useCallback(() => (country ?? getGlobalConfig()).currency.symbol, [country]);
  const getPrimaryExam = useCallback(() => (country ?? getGlobalConfig()).examSystem.primary, [country]);
  const getSecondaryExam = useCallback(() => (country ?? getGlobalConfig()).examSystem.secondary, [country]);
  const getCapital = useCallback(() => (country ?? getGlobalConfig()).capital, [country]);
  const getJuniorSecondaryName = useCallback(() => (country ?? getGlobalConfig()).academicStructure.juniorSecondary.name, [country]);
  const getSeniorSecondaryName = useCallback(() => (country ?? getGlobalConfig()).academicStructure.seniorSecondary.name, [country]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: LocalizationContextValue = {
    country,
    countryId,
    userRegion,
    setCountry,
    setRegion,
    clearCountry,
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
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn('[Localization] Missing LocalizationProvider. Falling back to default country config.');
    }
    return defaultLocalizationContext;
  }
  
  return context;
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { LocalizationContextValue };
export default LocalizationContext;
