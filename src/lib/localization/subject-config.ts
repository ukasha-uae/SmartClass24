/**
 * Country-Specific Subject Configuration
 * Handles different curricula across countries (Ghana JHS vs Nigeria JSS)
 * 
 * @module localization/subject-config
 * @version 1.0.0
 */

/**
 * Subject availability and naming per country
 */
export interface SubjectConfig {
  id: string;                          // Universal subject ID
  slug: string;                        // Universal slug
  defaultName: string;                 // Default subject name
  countryNames?: Record<string, string>; // Country-specific names
  countryDescriptions?: Record<string, string>; // Country-specific descriptions
  availability: {
    countries: string[];               // Which countries teach this subject
    required?: boolean;                // Is it mandatory?
    level?: 'primary' | 'jss' | 'sss' | 'all'; // Which level?
  };
}

/**
 * Complete curriculum configuration for Junior Secondary level
 * Handles differences between Ghana JHS and Nigeria JSS
 */
export interface JuniorSecondaryCurriculum {
  // Core subjects (common to most countries)
  coreSubjects: string[];              // Subject slugs taught everywhere
  
  // Country-specific subjects
  countrySubjects: {
    [countryId: string]: {
      included: string[];              // Additional subjects for this country
      excluded: string[];              // Subjects NOT taught in this country
      renamed: Record<string, string>; // Subject name overrides
    };
  };
  
  // Subject metadata
  subjects: SubjectConfig[];
}

/**
 * Nigerian JSS (Junior Secondary School) Subjects
 * Based on Nigerian Educational Research and Development Council (NERDC) curriculum
 */
export const NIGERIA_JSS_SUBJECTS: SubjectConfig[] = [
  {
    id: '1',
    slug: 'core-mathematics',
    defaultName: 'Mathematics',
    availability: { countries: ['ghana', 'nigeria', 'sierra-leone', 'liberia', 'gambia'], required: true, level: 'jss' }
  },
  {
    id: '2',
    slug: 'english-language',
    defaultName: 'English Language',
    availability: { countries: ['ghana', 'nigeria', 'sierra-leone', 'liberia', 'gambia'], required: true, level: 'jss' }
  },
  {
    id: '3',
    slug: 'integrated-science',
    defaultName: 'Basic Science',
    countryNames: {
      'ghana': 'Integrated Science',
      'nigeria': 'Basic Science',
    },
    countryDescriptions: {
      'ghana': 'Explore biology, chemistry, and physics concepts.',
      'nigeria': 'Study basic concepts in biology, chemistry, and physics.',
    },
    availability: { countries: ['ghana', 'nigeria', 'sierra-leone', 'liberia', 'gambia'], required: true, level: 'jss' }
  },
  {
    id: '4',
    slug: 'social-studies',
    defaultName: 'Social Studies',
    countryDescriptions: {
      'ghana': 'Understand Ghana culture, history, and governance.',
      'nigeria': 'Understand Nigeria culture, history, and governance.',
    },
    availability: { countries: ['ghana', 'nigeria', 'sierra-leone', 'liberia', 'gambia'], required: true, level: 'jss' }
  },
  {
    id: '5',
    slug: 'rme',
    defaultName: 'Religious and Moral Education',
    countryNames: {
      'ghana': 'Religious and Moral Education (RME)',
      'nigeria': 'Christian Religious Studies',
    },
    countryDescriptions: {
      'ghana': 'Learn about different religions and moral principles.',
      'nigeria': 'Study Christian religious knowledge and moral values.',
    },
    availability: { countries: ['ghana', 'nigeria'], required: false, level: 'jss' }
  },
  {
    id: '6',
    slug: 'creative-arts-design',
    defaultName: 'Creative Arts & Design',
    countryNames: {
      'ghana': 'Creative Arts & Design',
      'nigeria': 'Creative Arts',
    },
    countryDescriptions: {
      'ghana': 'Unleash your creativity through visual arts and design.',
      'nigeria': 'Express yourself through music, art, and drama.',
    },
    availability: { countries: ['ghana', 'nigeria', 'sierra-leone'], required: true, level: 'jss' }
  },
  {
    id: '7',
    slug: 'career-technology',
    defaultName: 'Basic Technology',
    countryNames: {
      'nigeria': 'Basic Technology',
      'ghana': 'Career Technology',
    },
    availability: { countries: ['ghana', 'nigeria'], required: true, level: 'jss' }
  },
  {
    id: '8',
    slug: 'computing',
    defaultName: 'Information Technology',
    countryNames: {
      'nigeria': 'Computer Studies',
      'ghana': 'Computing',
    },
    countryDescriptions: {
      'ghana': 'Learn the fundamentals of computers and ICT.',
      'nigeria': 'Develop computer literacy and ICT skills.',
    },
    availability: { countries: ['ghana', 'nigeria', 'sierra-leone', 'liberia', 'gambia'], required: true, level: 'jss' }
  },
  {
    id: '9',
    slug: 'local-language',
    defaultName: 'Local Language',
    countryNames: {
      'ghana': 'Ghanaian Language',
      'nigeria': 'Nigerian Language',
      'sierra-leone': 'Sierra Leonean Language',
    },
    countryDescriptions: {
      'ghana': 'Learn to read, write, and speak a Ghanaian language.',
      'nigeria': 'Learn Hausa, Yoruba, or Igbo language.',
    },
    availability: { countries: ['ghana', 'nigeria', 'sierra-leone'], required: false, level: 'jss' }
  },
  {
    id: '10',
    slug: 'french',
    defaultName: 'French',
    countryDescriptions: {
      'ghana': 'Explore the French language and culture (Optional).',
      'nigeria': 'Learn French language and Francophone culture (Optional).',
    },
    availability: { countries: ['ghana', 'nigeria', 'sierra-leone', 'liberia', 'gambia'], required: false, level: 'jss' }
  },
  {
    id: '11',
    slug: 'arabic',
    defaultName: 'Arabic',
    availability: { countries: ['ghana', 'nigeria'], required: false, level: 'jss' }
  },
  {
    id: '14',
    slug: 'home-economics',
    defaultName: 'Home Economics',
    availability: { countries: ['nigeria'], required: false, level: 'jss' }
  },
  {
    id: '15',
    slug: 'agricultural-science',
    defaultName: 'Agricultural Science',
    availability: { countries: ['nigeria', 'ghana'], required: false, level: 'jss' }
  },
  {
    id: '16',
    slug: 'business-studies',
    defaultName: 'Business Studies',
    availability: { countries: ['nigeria'], required: false, level: 'jss' }
  },
  {
    id: '17',
    slug: 'physical-health-education',
    defaultName: 'Physical and Health Education',
    availability: { countries: ['nigeria'], required: true, level: 'jss' }
  },
];

/**
 * Get subjects for a specific country and level
 */
export function getSubjectsForCountry(
  countryId: string,
  level: 'primary' | 'jss' | 'sss' = 'jss'
): SubjectConfig[] {
  return NIGERIA_JSS_SUBJECTS.filter(
    subject =>
      subject.availability.countries.includes(countryId) &&
      (subject.availability.level === level || subject.availability.level === 'all')
  );
}

/**
 * Get localized subject name for a country
 */
export function getLocalizedSubjectName(
  subjectSlug: string,
  countryId: string
): string {
  const subject = NIGERIA_JSS_SUBJECTS.find(s => s.slug === subjectSlug);
  if (!subject) return subjectSlug;
  
  return subject.countryNames?.[countryId] || subject.defaultName;
}

/**
 * Get localized subject description for a country
 */
export function getLocalizedSubjectDescription(
  subjectSlug: string,
  countryId: string
): string | undefined {
  const subject = NIGERIA_JSS_SUBJECTS.find(s => s.slug === subjectSlug);
  if (!subject) return undefined;
  
  return subject.countryDescriptions?.[countryId];
}

/**
 * Check if a subject is available in a country
 */
export function isSubjectAvailableInCountry(
  subjectSlug: string,
  countryId: string
): boolean {
  const subject = NIGERIA_JSS_SUBJECTS.find(s => s.slug === subjectSlug);
  if (!subject) return false;
  
  return subject.availability.countries.includes(countryId);
}

/**
 * Get required subjects for a country
 */
export function getRequiredSubjects(countryId: string): SubjectConfig[] {
  return NIGERIA_JSS_SUBJECTS.filter(
    subject =>
      subject.availability.countries.includes(countryId) &&
      subject.availability.required === true
  );
}

/**
 * Get optional/elective subjects for a country
 */
export function getOptionalSubjects(countryId: string): SubjectConfig[] {
  return NIGERIA_JSS_SUBJECTS.filter(
    subject =>
      subject.availability.countries.includes(countryId) &&
      subject.availability.required === false
  );
}
