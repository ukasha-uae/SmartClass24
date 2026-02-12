/**
 * CURRICULUM CONTENT ADAPTER
 * Purpose: Transform curriculum content based on tenant context
 * Use Case: Allow Wisdom Warehouse to use West African content with localized terminology
 * 
 * Design Principles:
 * - Runtime transformation (doesn't modify source data)
 * - Tenant-aware (applies rules based on tenant config)
 * - Scalable (easy to add new rules and tenants)
 * - Maintainable (centralized transformation logic)
 * - Secure (no data leakage between tenants)
 */

import type { Lesson, Quiz, Topic, Subject } from '@/lib/types';
import type { TenantConfig } from '@/tenancy/types';

// =========================================================================
// TRANSFORMATION RULES
// =========================================================================

/**
 * Content transformation rules for Wisdom Warehouse (UAE)
 * Maps West African terminology → Neutral/US terminology
 */
const WISDOM_WAREHOUSE_RULES = {
  // Country references
  'Ghana': 'your country',
  'Ghanaian': 'local',
  'Nigerian': 'local',
  'Nigeria': 'your region',
  'Accra': 'the capital',
  'Lagos': 'the capital',
  'Kumasi': 'a major city',
  'Cape Coast': 'a coastal city',
  
  // Currency and units
  'cedis': 'dollars',
  'cedi': 'dollar',
  'GH₵': '$',
  '₵': '$',
  'pesewas': 'cents',
  
  // Exam systems
  'BECE': 'assessment',
  'WASSCE': 'final exam',
  'NECO': 'standardized test',
  'West African Examinations Council': 'examination board',
  'WAEC': 'examination board',
  
  // Educational structure
  'JHS': 'Junior School',
  'JHS 1': 'Grade 7',
  'JHS 2': 'Grade 8',
  'JHS 3': 'Grade 9',
  'SHS': 'Senior School',
  'SHS 1': 'Grade 10',
  'SHS 2': 'Grade 11',
  'SHS 3': 'Grade 12',
  'Form 1': 'Grade 10',
  'Form 2': 'Grade 11',
  'Form 3': 'Grade 12',
  'Primary School': 'Elementary School',
  
  // Cultural references
  'tro-tro': 'bus',
  'chop bar': 'restaurant',
  'lorry park': 'bus station',
  'kenkey': 'traditional food',
  'banku': 'traditional food',
  'fufu': 'traditional dish',
  'jollof rice': 'rice dish',
  'groundnuts': 'peanuts',
  
  // Government and institutions
  'Ghana Education Service': 'Department of Education',
  'Ministry of Education (Ghana)': 'Department of Education',
  'National Service': 'community service',
  
  // Common phrases
  'in Ghana': 'locally',
  'across Ghana': 'in your region',
  'Ghanaians': 'people',
  'in West Africa': 'in your region',
  'West African': 'regional',
  'across West Africa': 'regionally',
};

/**
 * Regex patterns for dynamic replacements
 * Handles variations in capitalization and context
 */
const REGEX_RULES = [
  // Ghana variations
  { pattern: /\bGhana\b/, replacement: 'your country' },
  { pattern: /\bGhanaian\b/, replacement: 'local' },
  { pattern: /\bin Ghana\b/gi, replacement: 'locally' },
  { pattern: /\bacross Ghana\b/gi, replacement: 'in your region' },
  
  // Exam systems
  { pattern: /\bBECE\b/g, replacement: 'assessment' },
  { pattern: /\bWASSCE\b/g, replacement: 'final exam' },
  { pattern: /\bNECO\b/g, replacement: 'standardized test' },
  
  // Grade levels
  { pattern: /\bJHS\s*1\b/g, replacement: 'Grade 7' },
  { pattern: /\bJHS\s*2\b/g, replacement: 'Grade 8' },
  { pattern: /\bJHS\s*3\b/g, replacement: 'Grade 9' },
  { pattern: /\bSHS\s*1\b/g, replacement: 'Grade 10' },
  { pattern: /\bSHS\s*2\b/g, replacement: 'Grade 11' },
  { pattern: /\bSHS\s*3\b/g, replacement: 'Grade 12' },
  
  // Currency
  { pattern: /GH₵/g, replacement: '$' },
  { pattern: /₵/g, replacement: '$' },
  { pattern: /\bcedis\b/g, replacement: 'dollars' },
  { pattern: /\bcedi\b/g, replacement: 'dollar' },
];

// =========================================================================
// TRANSFORMATION FUNCTIONS
// =========================================================================

/**
 * Transform text content based on tenant rules
 * Applies all relevant transformations while preserving context
 */
function transformText(text: string, tenantId: string): string {
  if (!text || tenantId !== 'wisdomwarehouse') {
    return text;
  }
  
  let transformed = text;
  
  // Apply regex-based transformations
  for (const rule of REGEX_RULES) {
    transformed = transformed.replace(rule.pattern, rule.replacement);
  }
  
  // Apply simple string replacements (as fallback)
  for (const [original, replacement] of Object.entries(WISDOM_WAREHOUSE_RULES)) {
    const regex = new RegExp(original, 'g');
    transformed = transformed.replace(regex, replacement);
  }
  
  return transformed;
}

/**
 * Transform a lesson object for tenant context
 * Applies transformations to all text fields
 */
export function adaptLessonForTenant(lesson: Lesson, tenant: TenantConfig): Lesson {
  if (tenant.id !== 'wisdomwarehouse') {
    return lesson; // No transformation needed for other tenants
  }
  
  return {
    ...lesson,
    title: transformText(lesson.title, tenant.id),
    introduction: transformText(lesson.introduction, tenant.id),
    objectives: lesson.objectives.map(obj => transformText(obj, tenant.id)),
    keyConcepts: lesson.keyConcepts.map(concept => ({
      ...concept,
      title: transformText(concept.title, tenant.id),
      content: transformText(concept.content, tenant.id),
    })),
    summary: transformText(lesson.summary, tenant.id),
    pastQuestions: lesson.pastQuestions.map(pq => ({
      ...pq,
      question: transformText(pq.question, tenant.id),
      solution: pq.solution ? transformText(pq.solution, tenant.id) : undefined,
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
  if (tenant.id !== 'wisdomwarehouse') {
    return quiz;
  }
  
  // Type-specific transformations with proper type guards
  if (quiz.type === 'mcq') {
    return {
      ...quiz,
      question: transformText(quiz.question, tenant.id),
      options: quiz.options.map(opt => transformText(opt, tenant.id)),
      explanation: transformText(quiz.explanation, tenant.id),
    };
  } else if (quiz.type === 'image_mcq') {
    return {
      ...quiz,
      question: transformText(quiz.question, tenant.id),
      options: quiz.options.map(opt => transformText(opt, tenant.id)),
      explanation: quiz.explanation ? transformText(quiz.explanation, tenant.id) : undefined,
    };
  } else if (quiz.type === 'truefalse') {
    return {
      ...quiz,
      statement: transformText(quiz.statement, tenant.id),
      reason: quiz.reason ? transformText(quiz.reason, tenant.id) : undefined,
    };
  } else if (quiz.type === 'fillblank') {
    return {
      ...quiz,
      sentence: transformText(quiz.sentence, tenant.id),
      explanation: quiz.explanation ? transformText(quiz.explanation, tenant.id) : undefined,
    };
  } else if (quiz.type === 'shortanswer') {
    return {
      ...quiz,
      question: transformText(quiz.question, tenant.id),
      explanation: quiz.explanation ? transformText(quiz.explanation, tenant.id) : undefined,
    };
  } else if (quiz.type === 'matching') {
    return {
      ...quiz,
      question: quiz.question ? transformText(quiz.question, tenant.id) : undefined,
      pairs: quiz.pairs.map(pair => ({
        left: transformText(pair.left, tenant.id),
        right: transformText(pair.right, tenant.id),
      })),
      explanation: quiz.explanation ? transformText(quiz.explanation, tenant.id) : undefined,
    };
  } else if (quiz.type === 'ordering') {
    return {
      ...quiz,
      items: quiz.items.map(item => transformText(item, tenant.id)),
    };
  } else if (quiz.type === 'multiple_select' || quiz.type === 'multiselect') {
    return {
      ...quiz,
      question: transformText(quiz.question, tenant.id),
      options: quiz.options.map(opt => transformText(opt, tenant.id)),
      explanation: quiz.explanation ? transformText(quiz.explanation, tenant.id) : undefined,
    };
  } else if (quiz.type === 'flashcard') {
    return {
      ...quiz,
      front: transformText(quiz.front, tenant.id),
      back: transformText(quiz.back, tenant.id),
    };
  }
  
  // Fallback for unknown types
  return quiz;
}

/**
 * Transform a topic for tenant context
 */
export function adaptTopicForTenant(topic: Topic, tenant: TenantConfig): Topic {
  if (tenant.id !== 'wisdomwarehouse') {
    return topic;
  }
  
  return {
    ...topic,
    title: transformText(topic.title, tenant.id),
    lessons: topic.lessons.map(lesson => adaptLessonForTenant(lesson, tenant)),
  };
}

/**
 * Transform a subject for tenant context
 */
export function adaptSubjectForTenant(subject: Subject, tenant: TenantConfig): Subject {
  if (tenant.id !== 'wisdomwarehouse') {
    return subject;
  }
  
  return {
    ...subject,
    name: transformText(subject.name, tenant.id),
    description: transformText(subject.description, tenant.id),
    curriculum: subject.curriculum.map(yearGroup => ({
      ...yearGroup,
      level: transformText(yearGroup.level, tenant.id),
      topics: yearGroup.topics.map(topic => adaptTopicForTenant(topic, tenant)),
    })),
  };
}

/**
 * Get curriculum label for tenant (hides 'West African' for Wisdom Warehouse)
 */
export function getCurriculumLabel(tenant: TenantConfig): string {
  if (tenant.id === 'wisdomwarehouse') {
    return 'International Standards-Aligned Curriculum';
  }
  
  return tenant.content.curriculumLabel || 'Standard Curriculum';
}

/**
 * Get grade level label for display (tenant-aware)
 */
export function getGradeLevelLabel(level: string, tenant: TenantConfig): string {
  if (tenant.id !== 'wisdomwarehouse') {
    return level;
  }
  
  // Transform grade levels for Wisdom Warehouse
  const gradeMap: Record<string, string> = {
    'JHS 1': 'Grade 7',
    'JHS 2': 'Grade 8',
    'JHS 3': 'Grade 9',
    'SHS 1': 'Grade 10',
    'SHS 2': 'Grade 11',
    'SHS 3': 'Grade 12',
  };
  
  return gradeMap[level] || level;
}

// =========================================================================
// UTILITY FUNCTIONS
// =========================================================================

/**
 * Check if content adaptation is needed for tenant
 */
export function requiresContentAdaptation(tenantId: string): boolean {
  return tenantId === 'wisdomwarehouse';
}

/**
 * Get transformation rules for debugging/testing
 */
export function getTransformationRules(tenantId: string): Record<string, string> | null {
  if (tenantId === 'wisdomwarehouse') {
    return WISDOM_WAREHOUSE_RULES;
  }
  return null;
}

/**
 * Preview transformation (for testing)
 */
export function previewTransformation(text: string, tenantId: string): {
  original: string;
  transformed: string;
  changesCount: number;
} {
  const transformed = transformText(text, tenantId);
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
