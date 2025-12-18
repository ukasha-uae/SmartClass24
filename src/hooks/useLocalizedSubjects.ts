/**
 * Hook for accessing country-specific subjects
 * Automatically filters and localizes subjects based on user's country
 * 
 * @module hooks/useLocalizedSubjects
 */

'use client';

import { useMemo } from 'react';
import { useLocalization } from './useLocalization';
import {
  getSubjectsForCountry,
  getLocalizedSubjectName,
  getLocalizedSubjectDescription,
  getRequiredSubjects,
  getOptionalSubjects,
  type SubjectConfig,
} from '@/lib/localization/subject-config';

/**
 * Get subjects available for the current country
 * Automatically filters based on user's selected country
 */
export function useLocalizedSubjects(level: 'primary' | 'jss' | 'sss' = 'jss') {
  const { country } = useLocalization();

  return useMemo(() => {
    if (!country) return [];
    
    const subjects = getSubjectsForCountry(country.id, level);
    
    // Localize each subject
    return subjects.map(subject => ({
      ...subject,
      name: getLocalizedSubjectName(subject.slug, country.id) || subject.defaultName,
      description: getLocalizedSubjectDescription(subject.slug, country.id) || subject.countryDescriptions?.[country.id],
    }));
  }, [country, level]);
}

/**
 * Get only required/core subjects for current country
 */
export function useRequiredSubjects() {
  const { country } = useLocalization();

  return useMemo(() => {
    if (!country) return [];
    
    const subjects = getRequiredSubjects(country.id);
    
    return subjects.map(subject => ({
      ...subject,
      name: getLocalizedSubjectName(subject.slug, country.id) || subject.defaultName,
      description: getLocalizedSubjectDescription(subject.slug, country.id),
    }));
  }, [country]);
}

/**
 * Get only optional/elective subjects for current country
 */
export function useOptionalSubjects() {
  const { country } = useLocalization();

  return useMemo(() => {
    if (!country) return [];
    
    const subjects = getOptionalSubjects(country.id);
    
    return subjects.map(subject => ({
      ...subject,
      name: getLocalizedSubjectName(subject.slug, country.id) || subject.defaultName,
      description: getLocalizedSubjectDescription(subject.slug, country.id),
    }));
  }, [country]);
}

/**
 * Get localized name for a specific subject
 */
export function useLocalizedSubjectName(subjectSlug: string): string {
  const { country } = useLocalization();

  return useMemo(() => {
    if (!country) return subjectSlug;
    return getLocalizedSubjectName(subjectSlug, country.id);
  }, [subjectSlug, country]);
}

/**
 * Check if a subject is available in current country
 */
export function useSubjectAvailability(subjectSlug: string): boolean {
  const { country } = useLocalization();

  return useMemo(() => {
    if (!country) return false;
    const subjects = getSubjectsForCountry(country.id);
    return subjects.some(s => s.slug === subjectSlug);
  }, [subjectSlug, country]);
}
