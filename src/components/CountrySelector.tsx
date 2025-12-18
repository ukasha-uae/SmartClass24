'use client';

import { useState } from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { getActiveCountries } from '@/lib/localization/countries';
import type { CountryConfig } from '@/lib/localization/country-config';

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
  
  // Use selectedCountryId prop if provided, otherwise use global countryId
  const currentCountryId = selectedCountryId ?? countryId;
  
  const countries = getActiveCountries();
  
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountrySelect = (country: CountryConfig) => {
    if (autoApply) {
      setCountry(country.id);
    }
    onSelect?.(country.id);
  };

  if (variant === 'compact') {
    return (
      <select
        value={currentCountryId}
        onChange={(e) => handleCountrySelect(countries.find(c => c.id === e.target.value)!)}
        className={`px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-accent hover:text-accent-foreground transition-colors ${className}`}
      >
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
          {filteredCountries.map((country) => (
            <button
              key={country.id}
              onClick={() => handleCountrySelect(country)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                currentCountryId === country.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-5xl">{country.flag}</span>
                {currentCountryId === country.id && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Selected
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-2">{country.name}</h3>
              
              <div className="space-y-1 text-sm text-gray-600">
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
        {filteredCountries.map((country) => (
          <button
            key={country.id}
            onClick={() => handleCountrySelect(country)}
            className={`p-4 rounded-lg border-2 transition-all ${
              currentCountryId === country.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-4xl mb-2">{country.flag}</div>
            <div className="text-sm font-semibold">{country.name}</div>
            <div className="text-xs text-gray-500 mt-1">
              {country.currency.symbol} {country.examSystem.primary}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
