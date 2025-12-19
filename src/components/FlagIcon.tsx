'use client';

import React from 'react';

interface FlagIconProps {
  countryCode: string; // ISO 3166-1 alpha-2 code (e.g., 'GH', 'NG')
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * FlagIcon component that displays country flags using SVG from CDN
 * Ensures consistent flag display across all platforms (Windows, Mac, Android, iOS)
 */
export function FlagIcon({ countryCode, size = 'md', className = '' }: FlagIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  // Using flagcdn.com for reliable SVG flags
  const flagUrl = `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;

  return (
    <img
      src={flagUrl}
      alt={`${countryCode} flag`}
      className={`inline-block rounded-sm ${sizeClasses[size]} ${className}`}
      loading="lazy"
      onError={(e) => {
        // Fallback to emoji if image fails to load
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const fallback = document.createElement('span');
        fallback.textContent = getFlagEmoji(countryCode);
        fallback.className = 'text-2xl';
        target.parentNode?.insertBefore(fallback, target);
      }}
    />
  );
}

/**
 * Convert country code to flag emoji
 */
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
