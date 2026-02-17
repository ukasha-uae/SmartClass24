/**
 * Ghana WASSCE curriculum mapping
 * Maps canonical topic slugs to SHS 1 / SHS 2 / SHS 3
 * Derived from existing NaCCA/WASSCE-aligned content (shs-data)
 */

import type { CurriculumMappingEntry, CurriculumMeta } from '../types';

export const GHANA_WASSCE_META: CurriculumMeta = {
  id: 'ghana-wassce',
  name: 'Ghana WASSCE',
  description: 'West African Senior School Certificate Examination (WASSCE) – Ghana',
  levels: ['SHS 1', 'SHS 2', 'SHS 3'],
  region: 'ghana',
};

/**
 * Normalise gradeLevel string to "SHS 1" | "SHS 2" | "SHS 3"
 */
function toLevel(s: string): string {
  if (/SHS\s*1|JHS\s*3/i.test(s)) return 'SHS 1';
  if (/SHS\s*2/i.test(s)) return 'SHS 2';
  if (/SHS\s*3/i.test(s)) return 'SHS 3';
  return 'SHS 1';
}

/**
 * Core Mathematics – sample mapping (MVP)
 * Full set can be generated from shs-data topic lists
 */
const CORE_MATH_MAPPINGS: CurriculumMappingEntry[] = [
  { curriculumId: 'ghana-wassce', topicSlug: 'shs1-types-of-numbers', subjectSlug: 'core-mathematics', gradeLevel: 'SHS 1' },
  { curriculumId: 'ghana-wassce', topicSlug: 'shs1-fractions-decimals-percentages', subjectSlug: 'core-mathematics', gradeLevel: 'SHS 1' },
  { curriculumId: 'ghana-wassce', topicSlug: 'sets-venn-diagrams', subjectSlug: 'core-mathematics', gradeLevel: 'SHS 1' },
  { curriculumId: 'ghana-wassce', topicSlug: 'shs1-linear-equations-inequalities', subjectSlug: 'core-mathematics', gradeLevel: 'SHS 1' },
  { curriculumId: 'ghana-wassce', topicSlug: 'shs2-number-bases', subjectSlug: 'core-mathematics', gradeLevel: 'SHS 2' },
  { curriculumId: 'ghana-wassce', topicSlug: 'shs2-algebraic-factorization', subjectSlug: 'core-mathematics', gradeLevel: 'SHS 2' },
  { curriculumId: 'ghana-wassce', topicSlug: 'shs2-trigonometry-ratios', subjectSlug: 'core-mathematics', gradeLevel: 'SHS 2' },
  { curriculumId: 'ghana-wassce', topicSlug: 'shs3-quadratic-equations', subjectSlug: 'core-mathematics', gradeLevel: 'SHS 3' },
  { curriculumId: 'ghana-wassce', topicSlug: 'shs3-sequences-series', subjectSlug: 'core-mathematics', gradeLevel: 'SHS 3' },
  { curriculumId: 'ghana-wassce', topicSlug: 'shs3-functions-relations', subjectSlug: 'core-mathematics', gradeLevel: 'SHS 3' },
];

/**
 * Integrated Science – sample mapping
 */
const INTEGRATED_SCIENCE_MAPPINGS: CurriculumMappingEntry[] = [
  { curriculumId: 'ghana-wassce', topicSlug: 'diversity-of-matter', subjectSlug: 'integrated-science', gradeLevel: 'SHS 1' },
  { curriculumId: 'ghana-wassce', topicSlug: 'cycles', subjectSlug: 'integrated-science', gradeLevel: 'SHS 1' },
  { curriculumId: 'ghana-wassce', topicSlug: 'systems', subjectSlug: 'integrated-science', gradeLevel: 'SHS 2' },
  { curriculumId: 'ghana-wassce', topicSlug: 'energy', subjectSlug: 'integrated-science', gradeLevel: 'SHS 2' },
  { curriculumId: 'ghana-wassce', topicSlug: 'interactions', subjectSlug: 'integrated-science', gradeLevel: 'SHS 3' },
];

/**
 * Physics – sample mapping
 */
const PHYSICS_MAPPINGS: CurriculumMappingEntry[] = [
  { curriculumId: 'ghana-wassce', topicSlug: 'phy-shs1-mech-kinematics', subjectSlug: 'physics', gradeLevel: 'SHS 1' },
  { curriculumId: 'ghana-wassce', topicSlug: 'phy-shs1-mech-work-energy-power', subjectSlug: 'physics', gradeLevel: 'SHS 1' },
  { curriculumId: 'ghana-wassce', topicSlug: 'phy-shs2-elecmag-current-electricity', subjectSlug: 'physics', gradeLevel: 'SHS 2' },
  { curriculumId: 'ghana-wassce', topicSlug: 'phy-shs3-elec-logic-gates', subjectSlug: 'physics', gradeLevel: 'SHS 3' },
];

export const GHANA_WASSCE_MAPPINGS: CurriculumMappingEntry[] = [
  ...CORE_MATH_MAPPINGS,
  ...INTEGRATED_SCIENCE_MAPPINGS,
  ...PHYSICS_MAPPINGS,
];

export { toLevel };
