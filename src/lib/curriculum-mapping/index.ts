/**
 * Curriculum mapping – one content base, map to any curriculum
 * Use for: filtering topics by curriculum/level, future US/UK mappings
 */

export type {
  CanonicalTopic,
  CurriculumId,
  CurriculumMappingEntry,
  CurriculumMeta,
  EducationLevelKey,
  ResolvedTopic,
} from './types';

export {
  getCurriculumMeta,
  getCurriculumIds,
  getTopicsForCurriculum,
  getSubjectSlugsForCurriculum,
  isTopicInCurriculum,
  hasMappedTopicsForSubject,
  getCurriculumIdForCountry,
  resolveCurriculumLevel,
  resolveCurriculumId,
} from './resolver';

export { GHANA_WASSCE_META, GHANA_WASSCE_MAPPINGS } from './mappings/ghana-wassce';
export { US_COMMON_CORE_META, US_COMMON_CORE_MAPPINGS } from './mappings/us-common-core';
export { UK_GCSE_META, UK_GCSE_MAPPINGS } from './mappings/uk-gcse';
