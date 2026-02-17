/**
 * Curriculum Mapping – types
 * One content base, map to any curriculum (Ghana WASSCE, US Common Core, UK GCSE, etc.)
 */

/** Curriculum identifier (e.g. ghana-wassce, us-common-core, uk-gcse) */
export type CurriculumId = string;

/** Education level for filtering (Primary, JHS, SHS or Grade 7, Grade 10, etc.) */
export type EducationLevelKey = string;

/**
 * Canonical topic – universal concept, curriculum-agnostic
 * Content is written once and mapped to many curricula
 */
export interface CanonicalTopic {
  id: string;
  slug: string;
  subjectSlug: string;
  title: string;
  /** Optional: align to external standards for cross-curriculum mapping */
  alignments?: { system: string; code: string }[];
}

/**
 * Mapping from canonical topic to a specific curriculum
 * Same topic can appear in different curricula at different grade levels
 */
export interface CurriculumMappingEntry {
  curriculumId: CurriculumId;
  /** Canonical topic slug (or topic id) */
  topicSlug: string;
  subjectSlug: string;
  /** Grade level in this curriculum (e.g. "SHS 2", "Grade 10", "Year 11") */
  gradeLevel: string;
  /** Optional: curriculum-specific topic id (e.g. WAEC code, CCSS code) */
  localTopicId?: string;
  /** Optional: exam weightage percentage */
  weightage?: number;
  /** If true, this topic is not in this curriculum */
  excluded?: boolean;
}

/**
 * Curriculum metadata for display and filtering
 */
export interface CurriculumMeta {
  id: CurriculumId;
  name: string;
  description?: string;
  /** Level keys this curriculum uses (e.g. ["SHS 1", "SHS 2", "SHS 3"] or ["Grade 9", "Grade 10", ...]) */
  levels: string[];
  /** Country or region (e.g. "ghana", "us", "global") */
  region?: string;
}

/**
 * Resolved topic for a curriculum + level (for UI)
 */
export interface ResolvedTopic {
  topicSlug: string;
  subjectSlug: string;
  title: string;
  gradeLevel: string;
  localTopicId?: string;
  weightage?: number;
}
