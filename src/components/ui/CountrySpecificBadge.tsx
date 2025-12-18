'use client';

import { Badge } from '@/components/ui/badge';
import { useLocalization } from '@/hooks/useLocalization';
import type { ContentAvailability } from '@/lib/types';

interface CountrySpecificBadgeProps {
  availability?: ContentAvailability;
  showForAll?: boolean; // If true, show badge even for multi-country content
  className?: string;
}

/**
 * Badge component that displays when content is country-specific
 * Shows the country flag and name for country-specific content
 * 
 * Usage:
 * <CountrySpecificBadge availability={lesson.availability} />
 */
export function CountrySpecificBadge({ 
  availability, 
  showForAll = false,
  className = '' 
}: CountrySpecificBadgeProps) {
  const { country } = useLocalization();

  if (!availability) {
    return null;
  }

  // Only show for country-specific content
  if (!showForAll && !availability.isCountrySpecific) {
    return null;
  }

  // If it's country-specific, show which country
  if (availability.isCountrySpecific && availability.countrySpecificTo) {
    const countryName = availability.countrySpecificTo.charAt(0).toUpperCase() + 
                       availability.countrySpecificTo.slice(1);
    
    return (
      <Badge variant="outline" className={`ml-2 text-xs ${className}`}>
        {country?.flag} {countryName}-Specific
      </Badge>
    );
  }

  // Show exam board if specified
  if (availability.examBoards && availability.examBoards.length > 0) {
    return (
      <Badge variant="secondary" className={`ml-2 text-xs ${className}`}>
        {availability.examBoards.join(', ')}
      </Badge>
    );
  }

  // Show exam relevance indicator
  if (availability.examRelevance === 'country-specific') {
    return (
      <Badge variant="outline" className={`ml-2 text-xs ${className}`}>
        📝 Country-Specific Exam
      </Badge>
    );
  }

  return null;
}

/**
 * Warning badge for when content is not available in current country
 * Used when switching countries or previewing content
 */
export function ContentNotAvailableBadge({ 
  countryName,
  className = '' 
}: { 
  countryName: string;
  className?: string;
}) {
  return (
    <Badge variant="destructive" className={`ml-2 text-xs ${className}`}>
      ⚠️ Not available in {countryName}
    </Badge>
  );
}

/**
 * Info badge showing which countries can access this content
 */
export function AvailableInBadge({ 
  countries,
  className = '' 
}: { 
  countries: string[];
  className?: string;
}) {
  if (countries.length === 0) {
    return null;
  }

  const displayText = countries.length === 1 
    ? countries[0] 
    : `${countries.length} countries`;

  return (
    <Badge variant="secondary" className={`ml-2 text-xs ${className}`}>
      ✓ Available in {displayText}
    </Badge>
  );
}
