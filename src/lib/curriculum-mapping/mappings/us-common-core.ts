/**
 * US Common Core State Standards – curriculum mapping (sample)
 * Maps to existing content slugs where aligned; extend as US-specific content is added
 */

import type { CurriculumMappingEntry, CurriculumMeta } from '../types';

export const US_COMMON_CORE_META: CurriculumMeta = {
  id: 'us-common-core',
  name: 'US Common Core State Standards',
  description: 'Common Core State Standards for Mathematics and English Language Arts (High School)',
  levels: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
  region: 'us',
};

/**
 * Sample mappings: High School math aligned to existing Core Mathematics topics
 * Grade 9 ≈ Algebra I, Grade 10–11 ≈ Geometry / Algebra II, Grade 12 ≈ Precalculus
 */
const MATH_MAPPINGS: CurriculumMappingEntry[] = [
  { curriculumId: 'us-common-core', topicSlug: 'shs1-types-of-numbers', subjectSlug: 'core-mathematics', gradeLevel: 'Grade 9' },
  { curriculumId: 'us-common-core', topicSlug: 'shs1-linear-equations-inequalities', subjectSlug: 'core-mathematics', gradeLevel: 'Grade 9' },
  { curriculumId: 'us-common-core', topicSlug: 'sets-venn-diagrams', subjectSlug: 'core-mathematics', gradeLevel: 'Grade 9' },
  { curriculumId: 'us-common-core', topicSlug: 'shs2-algebraic-factorization', subjectSlug: 'core-mathematics', gradeLevel: 'Grade 10' },
  { curriculumId: 'us-common-core', topicSlug: 'shs2-trigonometry-ratios', subjectSlug: 'core-mathematics', gradeLevel: 'Grade 10' },
  { curriculumId: 'us-common-core', topicSlug: 'shs3-quadratic-equations', subjectSlug: 'core-mathematics', gradeLevel: 'Grade 11' },
  { curriculumId: 'us-common-core', topicSlug: 'shs3-sequences-series', subjectSlug: 'core-mathematics', gradeLevel: 'Grade 11' },
  { curriculumId: 'us-common-core', topicSlug: 'shs3-functions-relations', subjectSlug: 'core-mathematics', gradeLevel: 'Grade 12' },
];

/**
 * Science: map to Integrated Science / Physics where aligned
 */
const SCIENCE_MAPPINGS: CurriculumMappingEntry[] = [
  { curriculumId: 'us-common-core', topicSlug: 'diversity-of-matter', subjectSlug: 'integrated-science', gradeLevel: 'Grade 9' },
  { curriculumId: 'us-common-core', topicSlug: 'systems', subjectSlug: 'integrated-science', gradeLevel: 'Grade 10' },
  { curriculumId: 'us-common-core', topicSlug: 'energy', subjectSlug: 'integrated-science', gradeLevel: 'Grade 10' },
  { curriculumId: 'us-common-core', topicSlug: 'phy-shs1-mech-kinematics', subjectSlug: 'physics', gradeLevel: 'Grade 11' },
  { curriculumId: 'us-common-core', topicSlug: 'phy-shs2-elecmag-current-electricity', subjectSlug: 'physics', gradeLevel: 'Grade 12' },
];

export const US_COMMON_CORE_MAPPINGS: CurriculumMappingEntry[] = [
  ...MATH_MAPPINGS,
  ...SCIENCE_MAPPINGS,
];
