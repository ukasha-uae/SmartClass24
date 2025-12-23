/**
 * JHS Data Access Layer
 * 
 * This module provides optimized access to JHS curriculum data with:
 * - Lazy loading for better performance
 * - Backward compatibility with existing code
 * - Efficient data access patterns
 * 
 * MIGRATION GUIDE:
 * 
 * OLD (loads all data immediately):
 * ```typescript
 * import { subjects } from '@/lib/jhs-data';
 * const english = subjects.find(s => s.slug === 'english-language');
 * ```
 * 
 * NEW (loads data on-demand):
 * ```typescript
 * import { getSubjectBySlug } from '@/lib/data/jhs';
 * const english = await getSubjectBySlug('english-language');
 * ```
 */

import type { Subject, Topic, Lesson } from '@/lib/types';
import {
  JHS_SUBJECTS_METADATA,
  loadSubject,
  loadSubjects,
  getSubjectMetadata,
  type SubjectMetadata,
} from './loader';

/**
 * Get lightweight subject list for navigation/display
 * This replaces the need to load full subject data just for listings
 * 
 * @example
 * ```typescript
 * // OLD: Load 8MB of data just to show subject names
 * import { subjects } from '@/lib/jhs-data';
 * const names = subjects.map(s => s.name);
 * 
 * // NEW: Load only 5KB of metadata
 * import { getSubjectsList } from '@/lib/data/jhs';
 * const subjects = getSubjectsList();
 * const names = subjects.map(s => s.name);
 * ```
 */
export function getSubjectsList(): SubjectMetadata[] {
  return JHS_SUBJECTS_METADATA;
}

/**
 * Get full subject data by slug
 * Data is loaded on-demand and cached
 * 
 * @param slug - Subject slug (e.g., 'english-language')
 * @returns Promise resolving to Subject data or null if not found
 */
export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  return loadSubject(slug);
}

/**
 * Get full subject data by ID
 * 
 * @param id - Subject ID
 * @returns Promise resolving to Subject data or null if not found
 */
export async function getSubjectById(id: string): Promise<Subject | null> {
  const metadata = JHS_SUBJECTS_METADATA.find(s => s.id === id);
  if (!metadata) return null;
  return loadSubject(metadata.slug);
}

/**
 * Get all topics for a subject by slug
 * More efficient than loading full subject if you only need topics list
 * 
 * @param subjectSlug - Subject slug
 * @param level - JHS level (optional, filters topics by level)
 * @returns Promise resolving to array of topics
 */
export async function getTopicsForSubject(
  subjectSlug: string,
  level?: 'JHS 1' | 'JHS 2' | 'JHS 3'
): Promise<Topic[]> {
  const subject = await loadSubject(subjectSlug);
  if (!subject) return [];

  if (level) {
    const curriculum = subject.curriculum.find(c => c.level === level);
    return curriculum?.topics || [];
  }

  // Return all topics across all levels
  return subject.curriculum.flatMap(c => c.topics);
}

/**
 * Get a specific lesson by subject slug, topic slug, and lesson slug
 * Most efficient way to load a single lesson
 * 
 * @param subjectSlug - Subject slug
 * @param topicSlug - Topic slug  
 * @param lessonSlug - Lesson slug
 * @returns Promise resolving to Lesson data or null if not found
 */
export async function getLesson(
  subjectSlug: string,
  topicSlug: string,
  lessonSlug: string
): Promise<Lesson | null> {
  const subject = await loadSubject(subjectSlug);
  if (!subject) return null;

  for (const curriculum of subject.curriculum) {
    const topic = curriculum.topics.find(t => t.slug === topicSlug);
    if (topic) {
      const lesson = topic.lessons.find(l => l.slug === lessonSlug);
      if (lesson) return lesson;
    }
  }

  return null;
}

/**
 * Get lesson by ID (searches across all subjects)
 * Note: This is less efficient as it may need to load multiple subjects
 * 
 * @param lessonId - Lesson ID
 * @returns Promise resolving to { lesson, subject, topic } or null
 */
export async function getLessonById(lessonId: string): Promise<{
  lesson: Lesson;
  subject: Subject;
  topic: Topic;
} | null> {
  // Try loading subjects one by one until we find the lesson
  for (const metadata of JHS_SUBJECTS_METADATA) {
    const subject = await loadSubject(metadata.slug);
    if (!subject) continue;

    for (const curriculum of subject.curriculum) {
      for (const topic of curriculum.topics) {
        const lesson = topic.lessons.find(l => l.id === lessonId);
        if (lesson) {
          return { lesson, subject, topic };
        }
      }
    }
  }

  return null;
}

/**
 * Search lessons across all subjects
 * 
 * @param query - Search query
 * @param options - Search options
 * @returns Promise resolving to array of matching lessons with context
 */
export async function searchLessons(
  query: string,
  options?: {
    subjectSlug?: string;
    level?: 'JHS 1' | 'JHS 2' | 'JHS 3';
    limit?: number;
  }
): Promise<Array<{
  lesson: Lesson;
  subject: Subject;
  topic: Topic;
  matchScore: number;
}>> {
  const results: Array<{
    lesson: Lesson;
    subject: Subject;
    topic: Topic;
    matchScore: number;
  }> = [];

  const queryLower = query.toLowerCase();
  const subjectsToSearch = options?.subjectSlug
    ? [options.subjectSlug]
    : JHS_SUBJECTS_METADATA.map(s => s.slug);

  for (const subjectSlug of subjectsToSearch) {
    const subject = await loadSubject(subjectSlug);
    if (!subject) continue;

    for (const curriculum of subject.curriculum) {
      if (options?.level && curriculum.level !== options.level) continue;

      for (const topic of curriculum.topics) {
        for (const lesson of topic.lessons) {
          let matchScore = 0;

          // Check title match
          if (lesson.title.toLowerCase().includes(queryLower)) {
            matchScore += 10;
          }

          // Check objectives match
          if (lesson.objectives.some(obj => obj.toLowerCase().includes(queryLower))) {
            matchScore += 5;
          }

          // Check introduction match
          if (lesson.introduction.toLowerCase().includes(queryLower)) {
            matchScore += 3;
          }

          // Check summary match
          if (lesson.summary?.toLowerCase().includes(queryLower)) {
            matchScore += 2;
          }

          if (matchScore > 0) {
            results.push({ lesson, subject, topic, matchScore });
          }

          if (options?.limit && results.length >= options.limit) {
            break;
          }
        }
      }
    }
  }

  // Sort by match score descending
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Get curriculum structure for a subject (without full lesson content)
 * Useful for navigation/tree views
 * 
 * @param subjectSlug - Subject slug
 * @returns Promise resolving to simplified curriculum structure
 */
export async function getSubjectCurriculumStructure(subjectSlug: string): Promise<Array<{
  level: string;
  topics: Array<{
    id: string;
    slug: string;
    title: string;
    lessonCount: number;
    lessonTitles: string[];
  }>;
}> | null> {
  const subject = await loadSubject(subjectSlug);
  if (!subject) return null;

  return subject.curriculum.map(curriculum => ({
    level: curriculum.level,
    topics: curriculum.topics.map(topic => ({
      id: topic.id,
      slug: topic.slug,
      title: topic.title,
      lessonCount: topic.lessons.length,
      lessonTitles: topic.lessons.map(l => l.title),
    })),
  }));
}

/**
 * BACKWARD COMPATIBILITY: Legacy exports
 * 
 * WARNING: These load ALL subjects immediately (8MB+)
 * Only use for:
 * - Migration period
 * - Admin/seeding operations
 * - Quick prototypes
 * 
 * For production code, use the async functions above
 */

// Lazy-loaded fallback for legacy code
let legacySubjectsCache: Subject[] | null = null;

/**
 * @deprecated Use getSubjectsList() for metadata or loadSubjects() for full data
 * This loads all 8MB+ of JHS data immediately
 */
export async function getAllSubjectsLegacy(): Promise<Subject[]> {
  if (legacySubjectsCache) return legacySubjectsCache;

  const slugs = JHS_SUBJECTS_METADATA.map(s => s.slug);
  legacySubjectsCache = await loadSubjects(slugs);
  return legacySubjectsCache;
}

/**
 * Helper to convert async operations to sync for legacy code
 * NOTE: This will cause loading delays - refactor to async when possible
 */
export function createLegacySubjectsProxy(): Subject[] {
  const proxy: any = [];
  
  // Load in background
  getAllSubjectsLegacy().then(subjects => {
    proxy.push(...subjects);
  });

  console.warn(
    'Using legacy synchronous subjects array. ' +
    'Migrate to async getSubjectBySlug() for better performance.'
  );

  return proxy;
}
