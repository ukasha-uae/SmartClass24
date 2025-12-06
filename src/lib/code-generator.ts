/**
 * Code Generator Utility
 * Converts lesson data to properly formatted TypeScript code for jhs-data.ts
 */

import type { Lesson, Quiz } from './types';

/**
 * Escapes special characters in strings for TypeScript
 */
function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/'/g, "\\'")     // Escape single quotes
    .replace(/\n/g, '\\n')    // Escape newlines
    .replace(/\r/g, '\\r')    // Escape carriage returns
    .replace(/\t/g, '\\t');   // Escape tabs
}

/**
 * Formats an array of strings as TypeScript array
 */
function formatStringArray(items: string[], indent: number = 10): string {
  const spacing = ' '.repeat(indent);
  if (items.length === 0) return '[]';
  
  const formattedItems = items.map(item => `'${escapeString(item)}'`).join(',\n' + spacing);
  return `[\n${spacing}${formattedItems},\n${spacing.slice(0, -2)}]`;
}

/**
 * Formats quiz questions as TypeScript
 */
function formatQuestions(questions: Quiz[], indent: number = 12): string {
  const spacing = ' '.repeat(indent);
  
  return questions.map(q => {
    const parts: string[] = [
      `${spacing}{`,
      `${spacing}  type: '${q.type}',`
    ];

    // Add question field for types that have it
    if ('question' in q && q.question) {
      parts.push(`${spacing}  question: '${escapeString(q.question)}',`);
    }

    // Type-specific formatting
    switch (q.type) {
      case 'mcq':
      case 'image_mcq':
        if ('options' in q && 'answer' in q) {
          parts.push(`${spacing}  options: ${formatStringArray(q.options, indent + 4)},`);
          parts.push(`${spacing}  answer: '${escapeString(q.answer)}',`);
          if (q.type === 'image_mcq' && 'imageUrl' in q) {
            parts.push(`${spacing}  imageUrl: '${escapeString(q.imageUrl)}',`);
          }
        }
        break;

      case 'truefalse':
        if ('answer' in q) {
          parts.push(`${spacing}  answer: '${q.answer}',`);
        }
        break;

      case 'multiple_select':
        if ('options' in q && 'answers' in q && q.answers) {
          parts.push(`${spacing}  options: ${formatStringArray(q.options, indent + 4)},`);
          parts.push(`${spacing}  answers: ${formatStringArray(q.answers, indent + 4)},`);
        }
        break;

      case 'fillblank':
        if ('sentence' in q && 'answer' in q) {
          parts.push(`${spacing}  sentence: '${escapeString(q.sentence)}',`);
          parts.push(`${spacing}  answer: '${escapeString(q.answer)}',`);
          if ('alternatives' in q && q.alternatives && q.alternatives.length > 0) {
            parts.push(`${spacing}  alternatives: ${formatStringArray(q.alternatives, indent + 4)},`);
          }
        }
        break;

      case 'matching':
        if ('pairs' in q) {
          parts.push(`${spacing}  pairs: [`);
          q.pairs.forEach((pair, idx) => {
            const comma = idx < q.pairs.length - 1 ? ',' : '';
            parts.push(`${spacing}    { left: '${escapeString(pair.left)}', right: '${escapeString(pair.right)}' }${comma}`);
          });
          parts.push(`${spacing}  ],`);
        }
        break;

      case 'ordering':
        if ('items' in q) {
          parts.push(`${spacing}  items: ${formatStringArray(q.items, indent + 4)},`);
        }
        break;

      case 'shortanswer':
        if ('answer' in q) {
          parts.push(`${spacing}  answer: '${escapeString(q.answer)}',`);
        }
        break;
    }

    // Add explanation if present
    if ('explanation' in q && q.explanation) {
      parts.push(`${spacing}  explanation: '${escapeString(q.explanation)}',`);
    }

    // Add media if present
    if ('media' in q && q.media) {
      parts.push(`${spacing}  media: ${formatMedia(q.media, indent + 2)},`);
    }

    parts.push(`${spacing}}`);
    return parts.join('\n');
  }).join(',\n');
}

/**
 * Formats media object as TypeScript
 */
function formatMedia(media: any, indent: number = 10): string {
  const spacing = ' '.repeat(indent);
  const parts = [
    `{`,
    `  type: '${media.type}',`,
    `  url: '${escapeString(media.url)}'`
  ];
  
  if (media.caption) {
    parts.push(`  caption: '${escapeString(media.caption)}'`);
  }
  if (media.fileName) {
    parts.push(`  fileName: '${escapeString(media.fileName)}'`);
  }
  
  parts.push(`}`);
  return parts.join('\n' + spacing);
}

/**
 * Formats key concepts as TypeScript
 */
function formatKeyConcepts(concepts: Array<{ title: string; content: string; media?: any }>, indent: number = 10): string {
  const spacing = ' '.repeat(indent);
  
  return concepts.map(concept => {
    const parts = [
      `${spacing}{`,
      `${spacing}  title: '${escapeString(concept.title)}',`,
      `${spacing}  content: '${escapeString(concept.content)}'`
    ];
    
    if (concept.media) {
      parts.push(`${spacing}  media: ${formatMedia(concept.media, indent + 2)},`);
    }
    
    parts.push(`${spacing}}`);
    return parts.join('\n');
  }).join(',\n');
}

/**
 * Generates complete TypeScript code for a lesson
 */
export function generateLessonCode(lesson: Partial<Lesson>): string {
  const parts: string[] = [];

  // Start object
  parts.push('                {');
  
  // Basic fields
  if (lesson.id) parts.push(`                  id: '${lesson.id}',`);
  if (lesson.slug) parts.push(`                  slug: '${lesson.slug}',`);
  if (lesson.title) parts.push(`                  title: '${escapeString(lesson.title)}',`);

  // Objectives
  if (lesson.objectives && lesson.objectives.length > 0) {
    parts.push(`                  objectives: ${formatStringArray(lesson.objectives, 20)},`);
  }

  // Introduction
  if (lesson.introduction) {
    parts.push(`                  introduction: '${escapeString(lesson.introduction)}',`);
  }

  // Introduction Media
  if ((lesson as any).introductionMedia) {
    parts.push(`                  introductionMedia: ${formatMedia((lesson as any).introductionMedia, 18)},`);
  }

  // Key Concepts
  if (lesson.keyConcepts && lesson.keyConcepts.length > 0) {
    parts.push('                  keyConcepts: [');
    parts.push(formatKeyConcepts(lesson.keyConcepts, 20));
    parts.push('                  ],');
  }

  // Activities
  if (lesson.activities && 'questions' in lesson.activities && lesson.activities.questions && lesson.activities.questions.length > 0) {
    parts.push('                  activities: {');
    parts.push(`                    type: '${lesson.activities.type || 'exercises'}',`);
    parts.push('                    questions: [');
    parts.push(formatQuestions(lesson.activities.questions, 22));
    parts.push('                    ]');
    parts.push('                  },');
  }

  // Past Questions
  if (lesson.pastQuestions && lesson.pastQuestions.length > 0) {
    parts.push('                  pastQuestions: [');
    parts.push(lesson.pastQuestions.map(pq => {
      return [
        '                    {',
        `                      question: '${escapeString(pq.question)}',`,
        `                      solution: '${escapeString(pq.solution || '')}'`,
        '                    }'
      ].join('\n');
    }).join(',\n'));
    parts.push('                  ],');
  }

  // End of Lesson Quiz
  if (lesson.endOfLessonQuiz && lesson.endOfLessonQuiz.length > 0) {
    parts.push('                  endOfLessonQuiz: [');
    parts.push(formatQuestions(lesson.endOfLessonQuiz, 20));
    parts.push('                  ],');
  }

  // Summary
  if (lesson.summary) {
    parts.push(`                  summary: '${escapeString(lesson.summary)}',`);
  }

  // Summary Media
  if ((lesson as any).summaryMedia) {
    parts.push(`                  summaryMedia: ${formatMedia((lesson as any).summaryMedia, 18)},`);
  }

  // End object
  parts.push('                },');

  return parts.join('\n');
}

/**
 * Generates a preview summary of the lesson
 */
export function generateLessonSummary(lesson: Partial<Lesson>): string {
  const activitiesCount = lesson.activities && 'questions' in lesson.activities ? lesson.activities.questions?.length || 0 : 0;
  
  const lines: string[] = [
    `Lesson: ${lesson.title || 'Untitled'}`,
    `ID: ${lesson.id || 'Not set'}`,
    `Slug: ${lesson.slug || 'Not set'}`,
    '',
    'Content Summary:',
    `- Objectives: ${lesson.objectives?.length || 0}`,
    `- Key Concepts: ${lesson.keyConcepts?.length || 0}`,
    `- Practice Activities: ${activitiesCount}`,
    `- Past Questions: ${lesson.pastQuestions?.length || 0}`,
    `- End of Lesson Quiz: ${lesson.endOfLessonQuiz?.length || 0}`,
    '',
    'Total Practice Items: ' + (
      activitiesCount +
      (lesson.pastQuestions?.length || 0) +
      (lesson.endOfLessonQuiz?.length || 0)
    )
  ];

  return lines.join('\n');
}

/**
 * Validates lesson data before generation
 */
export function validateLessonData(lesson: Partial<Lesson>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!lesson.id) errors.push('Lesson ID is required');
  if (!lesson.slug) errors.push('Lesson slug is required');
  if (!lesson.title) errors.push('Lesson title is required');

  // ID format validation
  if (lesson.id && !/^[a-z]{3}\d{3}-\d+$/.test(lesson.id)) {
    errors.push('Lesson ID must be in format: eng104-1 (3 letters + 3 digits + dash + number)');
  }

  // Slug format validation
  if (lesson.slug && !/^[a-z0-9-]+$/.test(lesson.slug)) {
    errors.push('Lesson slug must contain only lowercase letters, numbers, and hyphens');
  }

  // Content validation
  if (lesson.objectives && lesson.objectives.length === 0) {
    errors.push('At least one objective is recommended');
  }

  // Question validation
  if (lesson.activities && 'questions' in lesson.activities && lesson.activities.questions) {
    lesson.activities.questions.forEach((q: Quiz, idx: number) => {
      if ('question' in q && (!q.question || q.question.trim() === '')) {
        errors.push(`Activity question ${idx + 1} is empty`);
      }
      if (q.type === 'mcq' && 'options' in q && (!q.options || q.options.length < 2)) {
        errors.push(`Activity question ${idx + 1} (MCQ) needs at least 2 options`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
