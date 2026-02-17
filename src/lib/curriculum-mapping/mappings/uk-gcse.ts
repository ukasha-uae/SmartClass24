/**
 * UK GCSE – curriculum mapping (sample)
 * Maps to existing content slugs where aligned; extend as UK-specific content is added
 */

import type { CurriculumMappingEntry, CurriculumMeta } from '../types';

export const UK_GCSE_META: CurriculumMeta = {
  id: 'uk-gcse',
  name: 'UK GCSE',
  description: 'General Certificate of Secondary Education (England, Wales, Northern Ireland)',
  levels: ['Year 10', 'Year 11'],
  region: 'uk',
};

/**
 * Sample mappings: GCSE Maths and Science aligned to existing topics
 */
const MATH_MAPPINGS: CurriculumMappingEntry[] = [
  { curriculumId: 'uk-gcse', topicSlug: 'shs1-types-of-numbers', subjectSlug: 'core-mathematics', gradeLevel: 'Year 10' },
  { curriculumId: 'uk-gcse', topicSlug: 'shs1-fractions-decimals-percentages', subjectSlug: 'core-mathematics', gradeLevel: 'Year 10' },
  { curriculumId: 'uk-gcse', topicSlug: 'shs1-linear-equations-inequalities', subjectSlug: 'core-mathematics', gradeLevel: 'Year 10' },
  { curriculumId: 'uk-gcse', topicSlug: 'shs2-algebraic-factorization', subjectSlug: 'core-mathematics', gradeLevel: 'Year 10' },
  { curriculumId: 'uk-gcse', topicSlug: 'shs3-quadratic-equations', subjectSlug: 'core-mathematics', gradeLevel: 'Year 11' },
  { curriculumId: 'uk-gcse', topicSlug: 'shs3-sequences-series', subjectSlug: 'core-mathematics', gradeLevel: 'Year 11' },
  { curriculumId: 'uk-gcse', topicSlug: 'shs2-trigonometry-ratios', subjectSlug: 'core-mathematics', gradeLevel: 'Year 11' },
];

const SCIENCE_MAPPINGS: CurriculumMappingEntry[] = [
  { curriculumId: 'uk-gcse', topicSlug: 'diversity-of-matter', subjectSlug: 'integrated-science', gradeLevel: 'Year 10' },
  { curriculumId: 'uk-gcse', topicSlug: 'cycles', subjectSlug: 'integrated-science', gradeLevel: 'Year 10' },
  { curriculumId: 'uk-gcse', topicSlug: 'energy', subjectSlug: 'integrated-science', gradeLevel: 'Year 11' },
  { curriculumId: 'uk-gcse', topicSlug: 'phy-shs1-mech-kinematics', subjectSlug: 'physics', gradeLevel: 'Year 11' },
];

export const UK_GCSE_MAPPINGS: CurriculumMappingEntry[] = [
  ...MATH_MAPPINGS,
  ...SCIENCE_MAPPINGS,
];
