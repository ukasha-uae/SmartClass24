/**
 * CURRICULUM CONTENT ADAPTER
 * Purpose: Transform curriculum content based on tenant context
 * Use Case: Allow whitelabel tenants (e.g., Wisdom Warehouse) to use base content with localized terminology
 *
 * Design Principles:
 * - Config-driven: rules from tenant.branding.contentTransformationRules
 * - Runtime transformation (doesn't modify source data)
 * - Scalable: add new tenants by adding rules to registry
 * - Secure: no data leakage between tenants
 */

import type { Lesson, Quiz, Topic, Subject } from '@/lib/types';
import type { TenantConfig } from '@/tenancy/types';

/**
 * Built-in regex rules applied when tenant has contentTransformationRules
 * Handles word boundaries and case variations
 */
const NEUTRALIZATION_REGEX = [
  { pattern: /\bin Ghana\b/gi, replacement: 'locally' },
  { pattern: /\bacross Ghana\b/gi, replacement: 'in your region' },
  { pattern: /\bJHS\s*1\b/g, replacement: 'Grade 7' },
  { pattern: /\bJHS\s*2\b/g, replacement: 'Grade 8' },
  { pattern: /\bJHS\s*3\b/g, replacement: 'Grade 9' },
  { pattern: /\bSHS\s*1\b/g, replacement: 'Grade 10' },
  { pattern: /\bSHS\s*2\b/g, replacement: 'Grade 11' },
  { pattern: /\bSHS\s*3\b/g, replacement: 'Grade 12' },
];

// =========================================================================
// TRANSFORMATION FUNCTIONS
// =========================================================================

/**
 * Transform text content using tenant's contentTransformationRules
 * Applies regex first, then string replacements (longest keys first to avoid partial matches)
 */
function transformText(text: string, tenant: TenantConfig): string {
  if (!text) return text;

  const rules = tenant.branding.contentTransformationRules;
  if (!rules || Object.keys(rules).length === 0) {
    return text;
  }

  let transformed = text;

  // 1. Apply tenant string rules first – longest keys first to avoid partial matches
  const entries = Object.entries(rules).sort((a, b) => b[0].length - a[0].length);
  for (const [original, replacement] of entries) {
    transformed = transformed.split(original).join(replacement);
  }

  // 2. Apply built-in regex for remaining phrases (e.g. "in Ghana" if not in tenant rules)
  for (const { pattern, replacement } of NEUTRALIZATION_REGEX) {
    transformed = transformed.replace(pattern, replacement);
  }

  return transformed;
}

/**
 * Transform a lesson object for tenant context
 * Applies transformations when tenant has contentTransformationRules
 */
export function adaptLessonForTenant(lesson: Lesson, tenant: TenantConfig): Lesson {
  if (!tenant.branding.contentTransformationRules) {
    return lesson;
  }

  return {
    ...lesson,
    title: transformText(lesson.title, tenant),
    introduction: transformText(lesson.introduction, tenant),
    objectives: lesson.objectives.map(obj => transformText(obj, tenant)),
    keyConcepts: lesson.keyConcepts.map(concept => ({
      ...concept,
      title: transformText(concept.title, tenant),
      content: transformText(concept.content, tenant),
    })),
    summary: transformText(lesson.summary, tenant),
    pastQuestions: lesson.pastQuestions.map(pq => ({
      ...pq,
      question: transformText(pq.question, tenant),
      solution: pq.solution ? transformText(pq.solution, tenant) : undefined,
    })),
    // Transform quiz questions
    endOfLessonQuiz: lesson.endOfLessonQuiz?.map(quiz => adaptQuizForTenant(quiz, tenant)),
    // Preserve metadata (curriculumId remains 'west-african' in data layer)
  };
}

/**
 * Transform a quiz question for tenant context
 */
export function adaptQuizForTenant(quiz: Quiz, tenant: TenantConfig): Quiz {
  if (!tenant.branding.contentTransformationRules) {
    return quiz;
  }

  if (quiz.type === 'mcq') {
    return {
      ...quiz,
      question: transformText(quiz.question, tenant),
      options: quiz.options.map(opt => transformText(opt, tenant)),
      explanation: transformText(quiz.explanation, tenant),
    };
  } else if (quiz.type === 'image_mcq') {
    return {
      ...quiz,
      question: transformText(quiz.question, tenant),
      options: quiz.options.map(opt => transformText(opt, tenant)),
      explanation: quiz.explanation ? transformText(quiz.explanation, tenant) : undefined,
    };
  } else if (quiz.type === 'truefalse') {
    return {
      ...quiz,
      statement: transformText(quiz.statement, tenant),
      reason: quiz.reason ? transformText(quiz.reason, tenant) : undefined,
    };
  } else if (quiz.type === 'fillblank') {
    return {
      ...quiz,
      sentence: transformText(quiz.sentence, tenant),
      explanation: quiz.explanation ? transformText(quiz.explanation, tenant) : undefined,
    };
  } else if (quiz.type === 'shortanswer') {
    return {
      ...quiz,
      question: transformText(quiz.question, tenant),
      explanation: quiz.explanation ? transformText(quiz.explanation, tenant) : undefined,
    };
  } else if (quiz.type === 'matching') {
    return {
      ...quiz,
      question: quiz.question ? transformText(quiz.question, tenant) : undefined,
      pairs: quiz.pairs.map(pair => ({
        left: transformText(pair.left, tenant),
        right: transformText(pair.right, tenant),
      })),
      explanation: quiz.explanation ? transformText(quiz.explanation, tenant) : undefined,
    };
  } else if (quiz.type === 'ordering') {
    return {
      ...quiz,
      items: quiz.items.map(item => transformText(item, tenant)),
    };
  } else if (quiz.type === 'multiple_select' || quiz.type === 'multiselect') {
    return {
      ...quiz,
      question: transformText(quiz.question, tenant),
      options: quiz.options.map(opt => transformText(opt, tenant)),
      explanation: quiz.explanation ? transformText(quiz.explanation, tenant) : undefined,
    };
  } else if (quiz.type === 'flashcard') {
    return {
      ...quiz,
      front: transformText(quiz.front, tenant),
      back: transformText(quiz.back, tenant),
    };
  }
  
  // Fallback for unknown types
  return quiz;
}

/**
 * Transform a topic for tenant context
 */
export function adaptTopicForTenant(topic: Topic, tenant: TenantConfig): Topic {
  if (!tenant.branding.contentTransformationRules) {
    return topic;
  }

  return {
    ...topic,
    title: transformText(topic.title, tenant),
    lessons: topic.lessons.map(lesson => adaptLessonForTenant(lesson, tenant)),
  };
}

/**
 * Transform a subject for tenant context
 */
export function adaptSubjectForTenant(subject: Subject, tenant: TenantConfig): Subject {
  if (!tenant.branding.contentTransformationRules) {
    return subject;
  }

  return {
    ...subject,
    name: transformText(subject.name, tenant),
    description: transformText(subject.description, tenant),
    curriculum: subject.curriculum.map(yearGroup => ({
      ...yearGroup,
      level: transformText(yearGroup.level, tenant),
      topics: yearGroup.topics.map(topic => adaptTopicForTenant(topic, tenant)),
    })),
  };
}

/**
 * Get curriculum label for tenant
 */
export function getCurriculumLabel(tenant: TenantConfig): string {
  if (tenant.branding.contentTransformationRules) {
    return tenant.content?.curriculumLabel ?? 'International Standards-Aligned Curriculum';
  }
  return tenant.content?.curriculumLabel ?? 'Standard Curriculum';
}

/**
 * Get grade level label for display (tenant-aware)
 */
export function getGradeLevelLabel(level: string, tenant: TenantConfig): string {
  const rules = tenant.branding.contentTransformationRules;
  if (!rules) return level;

  // Use tenant rules for grade levels (e.g. JHS 1 → Grade 7)
  const gradeMap: Record<string, string> = {
    'JHS 1': rules['JHS 1'] ?? 'Grade 7',
    'JHS 2': rules['JHS 2'] ?? 'Grade 8',
    'JHS 3': rules['JHS 3'] ?? 'Grade 9',
    'SHS 1': rules['SHS 1'] ?? 'Grade 10',
    'SHS 2': rules['SHS 2'] ?? 'Grade 11',
    'SHS 3': rules['SHS 3'] ?? 'Grade 12',
  };
  return gradeMap[level] ?? level;
}

// =========================================================================
// UTILITY FUNCTIONS
// =========================================================================

/**
 * Check if content adaptation is needed for tenant
 */
export function requiresContentAdaptation(tenant: TenantConfig): boolean {
  return !!(tenant.branding.contentTransformationRules && Object.keys(tenant.branding.contentTransformationRules).length > 0);
}

/**
 * Get transformation rules for debugging/testing
 */
export function getTransformationRules(tenant: TenantConfig): Record<string, string> | null {
  return tenant.branding.contentTransformationRules ?? null;
}

/**
 * Preview transformation (for testing)
 */
export function previewTransformation(text: string, tenant: TenantConfig): {
  original: string;
  transformed: string;
  changesCount: number;
} {
  const transformed = transformText(text, tenant);
  const changesCount = transformed !== text ? 1 : 0;
  
  return {
    original: text,
    transformed,
    changesCount,
  };
}

// =========================================================================
// EXPORT ALL
// =========================================================================

export const contentAdapter = {
  adaptLessonForTenant,
  adaptQuizForTenant,
  adaptTopicForTenant,
  adaptSubjectForTenant,
  getCurriculumLabel,
  getGradeLevelLabel,
  transformText,
  requiresContentAdaptation,
  getTransformationRules,
  previewTransformation,
};
