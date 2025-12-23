import { BookOpen } from 'lucide-react';
import type { Subject } from "@/types/subjects";

/**
 * Arabic Curriculum Data
 * Extracted from jhs-data.ts as part of data architecture refactoring
 * 
 * Lines 8891-9001 from original file
 */

export const arabicSubject: Subject = {
    id: '11',
    slug: 'arabic',
    name: 'Arabic',
    icon: BookOpen,
    description: 'Learn the Arabic language (Optional).',
    curriculum: [
      {
        level: 'JHS 1',
        topics: [
          {
            id: 'ar101',
            slug: 'alphabet-reading-1',
            title: 'The Arabic Alphabet',
            lessons: [
              { id: 'ar101-1', slug: 'arabic-alphabets-1', title: 'Arabic Alphabets and Pronounciations', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ar101-2', slug: 'alphabet-reading-1', title: 'Arabic Alphabet Reading', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
       },
       {
        level: 'JHS 2',
        topics: [
           {
            id: 'ar201',
            slug: 'reading-2',
            title: 'Reading of Common Words',
            lessons: [
              { id: 'ar201-1', slug: 'reading-quran', title: 'Reading of Quran and Sunnah', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ar201-2', slug: 'simple-words', title: 'Reading of Simple Words', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
       },
      {
        level: 'JHS 3',
        topics: [
          {
            id: 'ar301',
            slug: 'listening-speaking-3',
            title: 'Listening & Speaking',
            lessons: [
              { id: 'ar301-1', slug: 'expressing-opinions', title: 'Expressing opinions', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ar301-2', slug: 'talking-about-past-events', title: 'Talking about past events', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ar301-3', slug: 'talking-about-future-plans', title: 'Talking about future plans', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'ar302',
            slug: 'reading-comprehension-3',
            title: 'Reading & Comprehension',
            lessons: [
              { id: 'ar302-1', slug: 'longer-passages', title: 'Longer passages (stories, articles, Qur\'anic verses)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ar302-2', slug: 'comprehension-summary', title: 'Comprehension and summary', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ar302-3', slug: 'translation-practice', title: 'Translation practice Arabic ↔ English', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'ar303',
            slug: 'writing-3',
            title: 'Writing',
            lessons: [
              { id: 'ar303-1', slug: 'narrative-essays', title: 'Narrative essays (e.g., "رحلة إلى المدينة" - A trip to town)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ar303-2', slug: 'formal-letter-writing', title: 'Formal letter writing', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ar303-3', slug: 'guided-essay', title: 'Guided essay (50-80 words, BECE standard)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'ar304',
            slug: 'grammar-vocabulary-3',
            title: 'Grammar & Vocabulary',
            lessons: [
              { id: 'ar304-1', slug: 'tenses-past-present-future', title: 'Past, present, and future tense verbs', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ar304-2', slug: 'relative-pronouns', title: 'Relative pronouns (الذي، التي)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ar304-3', slug: 'complex-sentences', title: 'Complex sentences with conjunctions', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [] , summary: ''},
              { id: 'ar304-4', slug: 'reflexive-imperative-verbs', title: 'Reflexive & imperative verbs', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'ar305',
            slug: 'islamic-culture-3',
            title: 'Islamic Culture',
            lessons: [
              { id: 'ar305-1', slug: 'quranic-themes', title: 'Selected Qur\'anic themes (justice, honesty, kindness)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ar305-2', slug: 'life-of-prophet-muhammad', title: 'Life of Prophet Muhammad (Seerah basics)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'ar305-3', slug: 'islamic-proverbs', title: 'Islamic proverbs and sayings', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
      },
    ],
  };