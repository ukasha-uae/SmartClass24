/**
 * JHS Data Loader - Dynamic Import System
 * 
 * This module provides lazy-loading functionality for JHS subject data
 * to reduce initial bundle size and improve performance.
 */

import type { Subject } from '@/lib/types';

/**
 * Subject metadata for navigation and display
 * Lightweight alternative to loading full subject data
 */
export interface SubjectMetadata {
  id: string;
  slug: string;
  name: string;
  icon: any; // Lucide icon component
  description: string;
  topicCount: number;
  lessonCount: number;
}

/**
 * Registry of all JHS subjects with metadata
 * Used for listings, navigation, and lazy loading triggers
 */
export const JHS_SUBJECTS_METADATA: SubjectMetadata[] = [
  {
    id: '1',
    slug: 'english-language',
    name: 'English Language',
    icon: 'Book',
    description: 'Master grammar, comprehension, and literature.',
    topicCount: 8,
    lessonCount: 45,
  },
  {
    id: '2',
    slug: 'mathematics',
    name: 'Mathematics',
    icon: 'Calculator',
    description: 'Build strong mathematical foundations.',
    topicCount: 10,
    lessonCount: 60,
  },
  {
    id: '3',
    slug: 'integrated-science',
    name: 'Integrated Science',
    icon: 'FlaskConical',
    description: 'Explore the natural world through science.',
    topicCount: 12,
    lessonCount: 55,
  },
  {
    id: '4',
    slug: 'social-studies',
    name: 'Social Studies',
    icon: 'Globe',
    description: 'Understand society, history, and geography.',
    topicCount: 8,
    lessonCount: 40,
  },
  {
    id: '5',
    slug: 'religious-moral-education',
    name: 'Religious & Moral Education',
    icon: 'Users',
    description: 'Develop ethical values and understanding.',
    topicCount: 6,
    lessonCount: 30,
  },
  {
    id: '6',
    slug: 'creative-arts',
    name: 'Creative Arts',
    icon: 'Palette',
    description: 'Express yourself through art and creativity.',
    topicCount: 5,
    lessonCount: 25,
  },
  {
    id: '7',
    slug: 'career-technology',
    name: 'Career Technology',
    icon: 'Briefcase',
    description: 'Prepare for your future career path.',
    topicCount: 6,
    lessonCount: 30,
  },
  {
    id: '8',
    slug: 'ict',
    name: 'Information & Communication Technology',
    icon: 'Computer',
    description: 'Master digital literacy and technology.',
    topicCount: 7,
    lessonCount: 35,
  },
  {
    id: '9',
    slug: 'french',
    name: 'French',
    icon: 'Languages',
    description: 'Learn the French language and culture.',
    topicCount: 6,
    lessonCount: 30,
  },
  {
    id: '10',
    slug: 'ghanaian-language',
    name: 'Ghanaian Language',
    icon: 'BookOpen',
    description: 'Study your local Ghanaian language.',
    topicCount: 5,
    lessonCount: 25,
  },
];

/**
 * Cache for loaded subject data to avoid re-importing
 */
const subjectCache = new Map<string, Subject>();

/**
 * Load full subject data dynamically by slug
 * Uses dynamic imports to reduce initial bundle size
 * 
 * @param slug - Subject slug (e.g., 'english-language')
 * @returns Promise resolving to full Subject data
 */
export async function loadSubject(slug: string): Promise<Subject | null> {
  // Check cache first
  if (subjectCache.has(slug)) {
    return subjectCache.get(slug)!;
  }

  try {
    // Dynamic import based on slug
    // Note: These files need to be created/extracted from jhs-data.ts
    let subjectData: Subject;

        switch (slug) {
      case 'english-language':
        const english = await import('./subjects/english-language');
        subjectData = english.englishLanguageSubject;
        break;
      case 'core-mathematics':
        const math = await import('./subjects/core-mathematics');
        subjectData = math.mathematicsSubject;
        break;
      case 'integrated-science':
        const science = await import('./subjects/integrated-science');
        subjectData = science.integratedScienceSubject;
        break;
      case 'social-studies':
        const social = await import('./subjects/social-studies');
        subjectData = social.socialStudiesSubject;
        break;
      case 'rme':
        const rme = await import('./subjects/rme');
        subjectData = rme.rmeSubject;
        break;
      case 'creative-arts-design':
        const arts = await import('./subjects/creative-arts-design');
        subjectData = arts.creativeArtsSubject;
        break;
      case 'career-technology':
        const career = await import('./subjects/career-technology');
        subjectData = career.careerTechnologySubject;
        break;
      case 'computing':
        const comp = await import('./subjects/computing');
        subjectData = comp.computingSubject;
        break;
      case 'local-language':
        const local = await import('./subjects/local-language');
        subjectData = local.localLanguageSubject;
        break;
      case 'french':
        const french = await import('./subjects/french');
        subjectData = french.frenchSubject;
        break;
      case 'arabic':
        const arabic = await import('./subjects/arabic');
        subjectData = arabic.arabicSubject;
        break;
      default:
        console.warn(`No subject data found for slug: ${slug}`);
        return null;
    }

    // Cache the loaded subject
    subjectCache.set(slug, subjectData);
    return subjectData;
  } catch (error) {
    console.error(`Error loading subject ${slug}:`, error);
    return null;
  }
}

/**
 * Load multiple subjects in parallel
 * 
 * @param slugs - Array of subject slugs to load
 * @returns Promise resolving to array of loaded subjects
 */
export async function loadSubjects(slugs: string[]): Promise<Subject[]> {
  const promises = slugs.map(slug => loadSubject(slug));
  const results = await Promise.all(promises);
  return results.filter(Boolean) as Subject[];
}

/**
 * Get subject metadata by slug (synchronous)
 * 
 * @param slug - Subject slug
 * @returns Subject metadata or undefined
 */
export function getSubjectMetadata(slug: string): SubjectMetadata | undefined {
  return JHS_SUBJECTS_METADATA.find(s => s.slug === slug);
}

/**
 * Load all subjects (use sparingly - defeats lazy loading purpose)
 * Only use for admin/seeding operations
 */
export async function loadAllSubjects(): Promise<Subject[]> {
  const slugs = JHS_SUBJECTS_METADATA.map(s => s.slug);
  return loadSubjects(slugs);
}

/**
 * Clear the subject cache (useful for development/hot reload)
 */
export function clearSubjectCache(): void {
  subjectCache.clear();
}

/**
 * Get cache statistics (for monitoring)
 */
export function getCacheStats() {
  return {
    cachedSubjects: Array.from(subjectCache.keys()),
    cacheSize: subjectCache.size,
    totalSubjects: JHS_SUBJECTS_METADATA.length,
  };
}
