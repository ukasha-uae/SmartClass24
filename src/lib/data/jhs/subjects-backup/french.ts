import { BookOpen } from 'lucide-react';
import type { Subject } from "@/types/subjects";

/**
 * French Curriculum Data
 * Extracted from jhs-data.ts as part of data architecture refactoring
 * 
 * Lines 8712-8890 from original file
 */

export const frenchSubject: Subject = {
    id: '10',
    slug: 'french',
    name: 'French',
    icon: BookOpen,
    description: 'Explore the French language and culture (Optional).',
    curriculum: [
      {
        level: 'JHS 1',
        topics: [
          {
            id: 'fr101',
            slug: 'oral-communication-1',
            title: 'Oral Communication',
            lessons: [
              { id: 'fr101-1', slug: 'alphabet-pronunciation', title: 'Alphabet & pronunciation', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr101-2', slug: 'greetings-introductions', title: 'Greetings, introductions, asking names & ages', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr101-3', slug: 'numbers-1-100', title: 'Numbers (1-100)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr101-4', slug: 'days-months-time', title: 'Days of the week, months, telling the time', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr101-5', slug: 'classroom-expressions', title: 'Classroom expressions', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'fr102',
            slug: 'reading-comprehension-1',
            title: 'Reading Comprehension',
            lessons: [
              { id: 'fr102-1', slug: 'short-dialogues', title: 'Short dialogues and passages', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr102-2', slug: 'identifying-familiar-words', title: 'Identifying familiar words and phrases', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr102-3', slug: 'answering-simple-questions', title: 'Answering simple questions', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'fr103',
            slug: 'writing-1',
            title: 'Writing',
            lessons: [
              { id: 'fr103-1', slug: 'writing-basic-sentences', title: 'Copying and writing basic sentences', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr103-2', slug: 'writing-about-self', title: 'Writing about self (name, age, nationality)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr103-3', slug: 'guided-writing-ma-famille', title: 'Guided writing (e.g., "Ma famille")', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'fr104',
            slug: 'grammar-1',
            title: 'Grammar',
            lessons: [
              { id: 'fr104-1', slug: 'nouns-articles', title: 'Nouns & articles (le, la, les / un, une, des)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr104-2', slug: 'gender-of-nouns', title: 'Gender of nouns (masculine/feminine)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr104-3', slug: 'present-tense-common-verbs', title: 'Present tense of common verbs (être, avoir, aller, faire)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr104-4', slug: 'subject-pronouns', title: 'Subject pronouns', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'fr105',
            slug: 'culture-1',
            title: 'Culture',
            lessons: [
              { id: 'fr105-1', slug: 'francophonie', title: 'French-speaking countries (La Francophonie)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr105-2', slug: 'simple-songs-rhymes', title: 'Simple songs and rhymes', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ];
      },
      {
        level: 'JHS 2',
        topics: [
          {
            id: 'fr201',
            slug: 'oral-communication-2',
            title: 'Oral Communication',
            lessons: [
              { id: 'fr201-1', slug: 'daily-routines', title: 'Talking about daily routines', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr201-2', slug: 'asking-giving-directions', title: 'Asking & giving directions', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr201-3', slug: 'shopping-expressions', title: 'Shopping expressions', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr201-4', slug: 'expressing-likes-dislikes', title: 'Expressing likes/dislikes', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'fr202',
            slug: 'reading-comprehension-2',
            title: 'Reading Comprehension',
            lessons: [
              { id: 'fr202-1', slug: 'short-stories-dialogues', title: 'Short stories and dialogues', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr202-2', slug: 'extracting-main-ideas', title: 'Extracting main ideas & vocabulary', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr202-3', slug: 'answering-questions-in-french', title: 'Answering comprehension questions in simple French', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'fr203',
            slug: 'writing-2',
            title: 'Writing',
            lessons: [
              { id: 'fr203-1', slug: 'describing-people-places-objects', title: 'Describing people, places, and objects', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr203-2', slug: 'writing-simple-paragraphs', title: 'Writing simple paragraphs', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr203-3', slug: 'informal-letter-writing', title: 'Informal letter writing', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'fr204',
            slug: 'grammar-2',
            title: 'Grammar',
            lessons: [
              { id: 'fr204-1', slug: 'regular-verbs-conjugation', title: 'Regular verbs (-er, -ir, -re conjugations)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr204-2', slug: 'negative-sentences', title: 'Negative sentences (ne … pas)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr204-3', slug: 'possessive-adjectives', title: 'Possessive adjectives', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr204-4', slug: 'prepositions', title: 'Prepositions', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'fr205',
            slug: 'culture-2',
            title: 'Culture',
            lessons: [
              { id: 'fr205-1', slug: 'french-festivals-food', title: 'French festivals, food, and traditions', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr205-2', slug: 'short-french-poems-songs', title: 'Short French poems and songs', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ],
      },
      {
        level: 'JHS 3',
        topics: [
          {
            id: 'fr301',
            slug: 'oral-communication-3',
            title: 'Oral Communication',
            lessons: [
              { id: 'fr301-1', slug: 'expressing-opinions', title: 'Expressing opinions', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr301-2', slug: 'talking-about-past-events', title: 'Talking about past events', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr301-3', slug: 'talking-about-future-plans', title: 'Talking about future plans', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr301-4', slug: 'holding-short-conversations', title: 'Holding short conversations', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'fr302',
            slug: 'reading-comprehension-3',
            title: 'Reading Comprehension',
            lessons: [
              { id: 'fr302-1', slug: 'longer-texts', title: 'Longer texts (letters, stories, short articles)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr302-2', slug: 'translation-practice', title: 'Translation practice (French ↔ English)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr302-3', slug: 'summarizing-main-ideas', title: 'Summarizing main ideas', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'fr303',
            slug: 'writing-3',
            title: 'Writing',
            lessons: [
              { id: 'fr303-1', slug: 'narrative-essays', title: 'Narrative essays', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr303-2', slug: 'formal-letter-writing', title: 'Formal letter writing', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr303-3', slug: 'guided-essay', title: 'Guided essay (30-60 words, as per BECE standard)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'fr304',
            slug: 'grammar-3',
            title: 'Grammar',
            lessons: [
              { id: 'fr304-1', slug: 'past-tense-passe-compose', title: 'Past tense (passé composé with avoir/être)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr304-2', slug: 'future-tense-futur-proche', title: 'Future tense (futur proche: je vais + infinitive)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr304-3', slug: 'reflexive-verbs', title: 'Reflexive verbs', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr304-4', slug: 'relative-pronouns', title: 'Relative pronouns (qui, que)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
          {
            id: 'fr305',
            slug: 'culture-3',
            title: 'Culture',
            lessons: [
              { id: 'fr305-1', slug: 'francophone-literature', title: 'Francophone literature (short excerpts)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr305-2', slug: 'proverbs-sayings-in-french', title: 'Proverbs and sayings in French', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'fr305-3', slug: 'role-of-french-in-ecowas', title: 'Role of French in ECOWAS & African integration', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ],
          },
        ];
      },
    ];
  },
