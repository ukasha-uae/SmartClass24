/**
 * Content Availability and Curriculum Filtering
 * Utilities for showing/hiding content based on country-specific curriculum
 */

import type { CountryConfig } from './country-config';

/**
 * Metadata for country-specific content
 */
export interface ContentAvailability {
  // Which countries can access this content
  applicableCountries?: string[];  // e.g., ['ghana', 'nigeria'] - if set, only these countries see it
  excludedCountries?: string[];    // e.g., ['liberia'] - if set, these countries don't see it
  
  // Tagging
  isCountrySpecific?: boolean;     // Is this content specific to one country?
  countrySpecificTo?: string;      // Which country? e.g., 'nigeria'
  
  // Exam relevance
  examBoards?: string[];           // e.g., ['WAEC Ghana', 'WAEC Nigeria', 'NECO']
  examRelevance?: 'all' | 'country-specific' | 'optional';
  
  // Additional metadata
  priority?: number;               // Display priority (higher = more important)
  tags?: string[];                // Additional classification tags
}

/**
 * Check if content is available for a given country
 */
export function isContentAvailableForCountry(
  availability: ContentAvailability | undefined,
  country: CountryConfig
): boolean {
  // If no availability metadata, content is available to all
  if (!availability) return true;
  
  // Check excluded countries first
  if (availability.excludedCountries?.includes(country.id)) {
    return false;
  }
  
  // If applicableCountries is set, only show to those countries
  if (availability.applicableCountries && availability.applicableCountries.length > 0) {
    return availability.applicableCountries.includes(country.id);
  }
  
  // If countrySpecificTo is set, only show to that country
  if (availability.countrySpecificTo) {
    return availability.countrySpecificTo === country.id;
  }
  
  // Default: available to all
  return true;
}

/**
 * Check if a topic is in the country's curriculum
 */
export function isTopicInCurriculum(
  topicSlug: string,
  country: CountryConfig
): boolean {
  const adjustments = country.curriculumAdjustments;
  if (!adjustments) return true;
  
  // Check if explicitly excluded
  if (adjustments.excludedTopics?.includes(topicSlug)) {
    return false;
  }
  
  // Topic is in curriculum
  return true;
}

/**
 * Filter lessons based on country curriculum
 */
export function filterLessonsByCountry<T extends { slug: string; availability?: ContentAvailability }>(
  lessons: T[],
  country: CountryConfig
): T[] {
  return lessons.filter(lesson => {
    // Check availability metadata
    if (!isContentAvailableForCountry(lesson.availability, country)) {
      return false;
    }
    
    // Check curriculum adjustments
    return isTopicInCurriculum(lesson.slug, country);
  });
}

/**
 * Get country-specific exam board label
 */
export function getExamBoardLabel(country: CountryConfig): string {
  return country.curriculumAdjustments?.examBoard || country.examSystem.conductor;
}

/**
 * Check if exam has country-specific questions
 */
export function hasCountrySpecificQuestions(country: CountryConfig): boolean {
  return country.curriculumAdjustments?.hasCountrySpecificQuestions || false;
}

/**
 * Get subject-specific adjustments for a country
 */
export function getSubjectAdjustments(
  subjectSlug: string,
  country: CountryConfig
) {
  return country.curriculumAdjustments?.subjectAdjustments?.[subjectSlug];
}

/**
 * Mark content as country-specific
 */
export function createCountrySpecificContent(countryId: string): ContentAvailability {
  return {
    isCountrySpecific: true,
    countrySpecificTo: countryId,
    applicableCountries: [countryId],
    examRelevance: 'country-specific'
  };
}

/**
 * Mark content as available to multiple countries
 */
export function createMultiCountryContent(countryIds: string[]): ContentAvailability {
  return {
    applicableCountries: countryIds,
    examRelevance: 'all'
  };
}

/**
 * Mark content as excluded from specific countries
 */
export function createExcludedContent(excludedCountryIds: string[]): ContentAvailability {
  return {
    excludedCountries: excludedCountryIds,
    examRelevance: 'optional'
  };
}
