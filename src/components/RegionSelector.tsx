'use client';

import { useState } from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { useCountryConfig } from '@/hooks/useCountryConfig';

interface RegionSelectorProps {
  onSelect?: (region: string) => void;
  variant?: 'dropdown' | 'list' | 'grid';
  showSearch?: boolean;
  className?: string;
}

export default function RegionSelector({
  onSelect,
  variant = 'dropdown',
  showSearch = false,
  className = '',
}: RegionSelectorProps) {
  const { userRegion, setRegion } = useLocalization();
  const country = useCountryConfig();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRegions = country.regions.filter((r) =>
    r.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRegionSelect = (region: string) => {
    setRegion(region);
    onSelect?.(region);
  };

  if (variant === 'dropdown') {
    return (
      <div className={className}>
        <label className="block text-sm font-semibold mb-2">
          Select Your Region
        </label>
        <select
          value={userRegion || ''}
          onChange={(e) => handleRegionSelect(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Regions</option>
          {country.regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`space-y-4 ${className}`}>
        {showSearch && (
          <input
            type="text"
            placeholder="Search regions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <button
            onClick={() => handleRegionSelect('')}
            className={`p-3 rounded-lg border-2 transition-all ${
              !userRegion
                ? 'border-blue-500 bg-blue-50 font-semibold'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            All Regions
          </button>
          
          {filteredRegions.map((r) => (
            <button
              key={r}
              onClick={() => handleRegionSelect(r)}
              className={`p-3 rounded-lg border-2 transition-all ${
                userRegion === r
                  ? 'border-blue-500 bg-blue-50 font-semibold'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // List variant
  return (
    <div className={`space-y-3 ${className}`}>
      {showSearch && (
        <input
          type="text"
          placeholder="Search regions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      )}
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <button
          onClick={() => handleRegionSelect('')}
          className={`w-full p-3 rounded-lg text-left transition-all ${
            !userRegion
              ? 'bg-blue-50 border-2 border-blue-500 font-semibold'
              : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          All Regions
        </button>
        
        {filteredRegions.map((r) => (
          <button
            key={r}
            onClick={() => handleRegionSelect(r)}
            className={`w-full p-3 rounded-lg text-left transition-all ${
              userRegion === r
                ? 'bg-blue-50 border-2 border-blue-500 font-semibold'
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
