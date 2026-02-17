'use client';

import { useMemo } from 'react';
import { getSHSLesson as getOriginalSHSLesson } from '@/lib/shs-data';
import { useLocalization } from './useLocalization';
import { localizeLesson } from '@/lib/localization/content-localizer';
import { getGlobalConfig } from '@/lib/localization/countries';
import { isContentAvailableForCountry } from '@/lib/localization/content-availability';
import type { Lesson } from '@/lib/types';

/**
 * Hook that wraps getSHSLesson and automatically localizes the content
 * Use this in client components instead of calling getSHSLesson directly
 * When country is null (global mode), uses global config for template resolution
 */
export function useLocalizedLesson(
  subjectSlug: string,
  topicSlug: string,
  lessonSlug: string
): Lesson | null {
  const { country } = useLocalization();
  const config = country ?? getGlobalConfig();

  return useMemo(() => {
    const lesson = getOriginalSHSLesson(subjectSlug, topicSlug, lessonSlug);
    
    if (!lesson) {
      return null;
    }

    // Check if lesson is available for current country/global
    if (lesson.availability && !isContentAvailableForCountry(lesson.availability, config)) {
      return null; // Hide lesson if not available for this country
    }

    // Localize all content in the lesson (uses global config when country is null)
    return localizeLesson(lesson, config);
  }, [subjectSlug, topicSlug, lessonSlug, config]);
}

/**
 * Alternative: Direct function for when hooks can't be used
 * Requires passing country config manually
 */
export function getLocalizedSHSLesson(
  subjectSlug: string,
  topicSlug: string,
  lessonSlug: string,
  country: any
): Lesson | null {
  const lesson = getOriginalSHSLesson(subjectSlug, topicSlug, lessonSlug);
  
  if (!lesson || !country) {
    return lesson;
  }

  // Check if lesson is available for current country
  if (lesson.availability && !isContentAvailableForCountry(lesson.availability, country)) {
    return null; // Hide lesson if not available for this country
  }

  return localizeLesson(lesson, country);
}
