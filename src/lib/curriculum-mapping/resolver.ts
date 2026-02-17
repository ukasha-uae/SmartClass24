/**
 * Curriculum mapping resolver
 * getTopicsForCurriculum(curriculumId, level) → topics for that curriculum and level
 */

import type { CurriculumId, CurriculumMappingEntry, CurriculumMeta, ResolvedTopic } from './types';
import { GHANA_WASSCE_META, GHANA_WASSCE_MAPPINGS } from './mappings/ghana-wassce';
import { US_COMMON_CORE_META, US_COMMON_CORE_MAPPINGS } from './mappings/us-common-core';
import { UK_GCSE_META, UK_GCSE_MAPPINGS } from './mappings/uk-gcse';

const CURRICULA: Record<CurriculumId, CurriculumMeta> = {
  'ghana-wassce': GHANA_WASSCE_META,
  'us-common-core': US_COMMON_CORE_META,
  'uk-gcse': UK_GCSE_META,
};

const MAPPINGS_BY_CURRICULUM: Record<CurriculumId, CurriculumMappingEntry[]> = {
  'ghana-wassce': GHANA_WASSCE_MAPPINGS,
  'us-common-core': US_COMMON_CORE_MAPPINGS,
  'uk-gcse': UK_GCSE_MAPPINGS,
};

/** Map display level (e.g. SHS 1, High School 1) to curriculum-specific level (e.g. Grade 9, Year 10) */
const LEVEL_ALIASES: Record<CurriculumId, Record<string, string>> = {
  'ghana-wassce': {}, // SHS 1/2/3 already match
  'us-common-core': {
    'SHS 1': 'Grade 9',
    'SHS 2': 'Grade 10',
    'SHS 3': 'Grade 11',
    'High School 1': 'Grade 9',
    'High School 2': 'Grade 10',
    'High School 3': 'Grade 11',
  },
  'uk-gcse': {
    'SHS 1': 'Year 10',
    'SHS 2': 'Year 11',
    'SHS 3': 'Year 11',
    'High School 1': 'Year 10',
    'High School 2': 'Year 11',
    'High School 3': 'Year 11',
  },
};

/**
 * Get curriculum metadata by id
 */
export function getCurriculumMeta(curriculumId: CurriculumId): CurriculumMeta | null {
  return CURRICULA[curriculumId] ?? null;
}

/**
 * Get all registered curriculum ids
 */
export function getCurriculumIds(): CurriculumId[] {
  return Object.keys(CURRICULA);
}

/**
 * Get topic mappings for a curriculum and level
 * Returns resolved topics (topicSlug, subjectSlug, title, gradeLevel) for the given level
 */
export function getTopicsForCurriculum(
  curriculumId: CurriculumId,
  level: string
): ResolvedTopic[] {
  const mappings = MAPPINGS_BY_CURRICULUM[curriculumId];
  if (!mappings) return [];

  const normalizedLevel = level.trim();
  const entries = mappings.filter(
    (e) => !e.excluded && e.gradeLevel.trim() === normalizedLevel
  );

  return entries.map((e) => ({
    topicSlug: e.topicSlug,
    subjectSlug: e.subjectSlug,
    title: e.topicSlug.replace(/-/g, ' '), // MVP: derive title from slug; can be replaced with canonical topic title lookup
    gradeLevel: e.gradeLevel,
    localTopicId: e.localTopicId,
    weightage: e.weightage,
  }));
}

/**
 * Get subject slugs that have mapped topics for this curriculum and level
 */
export function getSubjectSlugsForCurriculum(
  curriculumId: CurriculumId,
  level: string
): string[] {
  const topics = getTopicsForCurriculum(curriculumId, level);
  const set = new Set(topics.map((t) => t.subjectSlug));
  return Array.from(set);
}

/**
 * Check if a topic (by slug) is in the given curriculum and level
 */
export function isTopicInCurriculum(
  curriculumId: CurriculumId,
  level: string,
  topicSlug: string,
  subjectSlug?: string
): boolean {
  const mappings = MAPPINGS_BY_CURRICULUM[curriculumId];
  if (!mappings) return false;

  const normalizedLevel = level.trim();
  return mappings.some(
    (e) =>
      !e.excluded &&
      e.gradeLevel.trim() === normalizedLevel &&
      e.topicSlug === topicSlug &&
      (subjectSlug == null || e.subjectSlug === subjectSlug)
  );
}

/**
 * Whether the given curriculum has any mapped topics for this subject and level
 */
export function hasMappedTopicsForSubject(
  curriculumId: CurriculumId,
  level: string,
  subjectSlug: string
): boolean {
  const topics = getTopicsForCurriculum(curriculumId, level);
  return topics.some((t) => t.subjectSlug === subjectSlug);
}

/**
 * Curriculum id for a country (for wiring; extend when adding more regions)
 */
export function getCurriculumIdForCountry(countryId: string): CurriculumId | null {
  if (countryId === 'ghana') return 'ghana-wassce';
  return null;
}

/**
 * Resolve display level to curriculum-specific level (e.g. SHS 1 → Grade 9 for US Common Core)
 */
export function resolveCurriculumLevel(curriculumId: CurriculumId, displayLevel: string): string {
  const aliases = LEVEL_ALIASES[curriculumId];
  if (aliases && aliases[displayLevel]) return aliases[displayLevel];
  return displayLevel;
}

/**
 * Resolve effective curriculum id: prefer tenant's curriculumId, then country-based
 * @param tenant - Tenant config (e.g. from useTenant()); can be undefined
 * @param countryId - Current country id (e.g. from useLocalization()); can be undefined
 */
export function resolveCurriculumId(
  tenant: { curriculum?: { curriculumId?: string } } | null | undefined,
  countryId: string | null | undefined
): CurriculumId | null {
  const tenantId = tenant?.curriculum?.curriculumId;
  if (tenantId && CURRICULA[tenantId]) return tenantId;
  if (countryId) return getCurriculumIdForCountry(countryId);
  return null;
}
