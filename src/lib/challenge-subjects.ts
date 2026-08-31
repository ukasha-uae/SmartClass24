/**
 * Lightweight subject helpers for Arena/community UIs.
 * Keep this module free from question-bank imports to avoid large client bundles.
 */

export type EducationLevel = 'Primary' | 'JHS' | 'SHS';

const GLOBAL_ARENA_EXCLUDED_SUBJECTS = new Set([
  'Social Studies',
  'RME',
  'History',
  'Geography',
  'Government',
  'Christian Religious Studies',
  'Islamic Religious Studies',
]);

export function getAvailableSubjects(level: EducationLevel): string[] {
  if (level === 'Primary') {
    return [
      'Mixed',
      'Mathematics',
      'English Language',
      'Science',
      'Social Studies',
    ];
  }

  if (level === 'JHS') {
    return [
      'Mixed',
      'Mathematics',
      'English Language',
      'Science',
      'Social Studies',
      'RME',
      'ICT',
      'Creative Arts',
      'French',
      'Arabic',
    ];
  }

  return [
    'Mixed',
    'Core Mathematics',
    'English Language',
    'Integrated Science',
    'Social Studies',
    'Physics',
    'Chemistry',
    'Biology',
    'Elective Mathematics',
    'Literature in English',
    'History',
    'Geography',
    'Economics',
    'Government',
    'Christian Religious Studies',
    'Islamic Religious Studies',
    'Accounting',
    'Business Management',
    'Cost Accounting',
    'General Knowledge in Art',
    'Textiles',
    'Graphic Design',
    'Food and Nutrition',
    'Management in Living',
    'Clothing and Textiles',
    'Agricultural Science',
    'Crop Husbandry',
    'Animal Husbandry',
    'Technical Drawing',
    'Building Construction',
    'Woodwork',
    'Metalwork',
    'Electronics',
    'Auto Mechanics',
  ];
}

export function getAvailableSubjectsForGlobalArena(level: EducationLevel): string[] {
  return getAvailableSubjects(level).filter((subject) => !GLOBAL_ARENA_EXCLUDED_SUBJECTS.has(subject));
}
