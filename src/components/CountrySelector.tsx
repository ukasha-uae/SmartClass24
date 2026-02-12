'use client';

import { useState, useEffect } from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { getActiveCountries } from '@/lib/localization/countries';
import type { CountryConfig } from '@/lib/localization/country-config';
import { FlagIcon } from './FlagIcon';
import { cn } from '@/lib/utils';

interface CountrySelectorProps {
  onSelect?: (countryId: string) => void;
  variant?: 'default' | 'compact' | 'card';
  showSearch?: boolean;
  className?: string;
  autoApply?: boolean; // If true, selecting a country immediately updates the global context
  selectedCountryId?: string; // Allow external control of selected country
}

export default function CountrySelector({
  onSelect,
  variant = 'default',
  showSearch = true,
  className = '',
  autoApply = true,
  selectedCountryId,
}: CountrySelectorProps) {
  const { countryId, setCountry } = useLocalization();
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // Use selectedCountryId prop if provided, otherwise use global countryId
  // Ensure value is always a string to avoid React warnings
  const currentCountryId = selectedCountryId ?? countryId ?? '';
  
  const countries = getActiveCountries();
  
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCountrySelect = (country: CountryConfig | null) => {
    if (autoApply) {
      setCountry(country?.id ?? null);
    }
    onSelect?.(country?.id ?? '');
  };

  if (variant === 'compact') {
    return (
      <select
        value={currentCountryId}
        onChange={(e) => {
          const value = e.target.value;
          if (value === '') {
            handleCountrySelect(null);
          } else {
            handleCountrySelect(countries.find(c => c.id === value) ?? null);
          }
        }}
        className={cn(
          'px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
          className
        )}
        suppressHydrationWarning
      >
        <option value="">🌍 Global Platform</option>
        {countries.map((country) => (
          <option key={country.id} value={country.id}>
            {country.flag} {country.name}
          </option>
        ))}
      </select>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`space-y-4 ${className}`}>
        {showSearch && (
          <input
            type="text"
            placeholder="Search countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Global Platform Option */}
          <button
            onClick={() => handleCountrySelect(null)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              currentCountryId === null
                ? 'border-primary bg-primary/10 shadow-lg'
                : 'border-border hover:border-primary/50 hover:shadow-md hover:bg-primary/5 dark:hover:bg-primary/10'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-4xl">🌍</span>
              {currentCountryId === null && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Selected
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-foreground">Global Platform</h3>
            
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>World-class learning for all regions</p>
              <p className="text-xs mt-2">Select a country below for localized content</p>
            </div>
          </button>
          
          {filteredCountries.map((country) => (
            <button
              key={country.id}
              onClick={() => handleCountrySelect(country)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                currentCountryId === country.id
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border hover:border-primary/50 hover:shadow-md hover:bg-primary/5 dark:hover:bg-primary/10'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <FlagIcon countryCode={country.iso2} size="xl" />
                {currentCountryId === country.id && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Selected
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-foreground">{country.name}</h3>
              
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold">Currency:</span> {country.currency.symbol} {country.currency.code}
                </p>
                <p>
                  <span className="font-semibold">Primary Exam:</span> {country.examSystem.primary}
                </p>
                <p>
                  <span className="font-semibold">Capital:</span> {country.capital}
                </p>
                <p>
                  <span className="font-semibold">Regions:</span> {country.regions.length}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default variant - button grid
  return (
    <div className={`space-y-4 ${className}`}>
      {showSearch && countries.length > 4 && (
        <input
          type="text"
          placeholder="Search countries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Global Platform Option */}
        <button
          onClick={() => handleCountrySelect(null)}
          className={`p-4 rounded-lg border-2 transition-all ${
            currentCountryId === null
              ? 'border-primary bg-primary/10 shadow-md'
              : 'border-border hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10'
          }`}
        >
          <div className="text-4xl mb-2 flex items-center justify-center">
            🌍
          </div>
          <div className="text-sm font-semibold text-foreground">Global Platform</div>
          <div className="text-xs text-muted-foreground mt-1">
            International
          </div>
        </button>
        
        {filteredCountries.map((country) => (
          <button
            key={country.id}
            onClick={() => handleCountrySelect(country)}
            className={`p-4 rounded-lg border-2 transition-all ${
              currentCountryId === country.id
                ? 'border-primary bg-primary/10 shadow-md'
                : 'border-border hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10'
            }`}
          >
            <div className="text-4xl mb-2 flex items-center justify-center">
              <FlagIcon countryCode={country.iso2} size="xl" />
            </div>
            <div className="text-sm font-semibold text-foreground">{country.name}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {country.currency.symbol} {country.examSystem.primary}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
