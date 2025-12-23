import { Languages } from 'lucide-react';
import type { Subject } from "@/types/subjects";

/**
 * Local Language Curriculum Data
 * Extracted from jhs-data.ts as part of data architecture refactoring
 * 
 * Lines 8538-8711 from original file
 */

export const localLanguageSubject: Subject = {
    id: '9',
    slug: 'local-language',
    name: '{{country}} Language',
    icon: Languages,
    description: 'Learn to read, write, and speak a {{country}} language.',
    curriculum: [
      {
        level: 'JHS 1',
        topics: [
          {
            id: 'gl101',
            slug: 'oral-listening-1',
            title: 'Oral Literature & Listening Skills',
            lessons: [
              { id: 'gl101-1', slug: 'greetings-expressions', title: 'Greetings and common expressions', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl101-2', slug: 'listening-stories', title: 'Listening and responding to short stories or dialogues', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl101-3', slug: 'folktales-riddles', title: 'Folk tales and riddles', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ];
          },
          {
            id: 'gl102',
            slug: 'reading-comprehension-1',
            title: 'Reading & Comprehension',
            lessons: [
              { id: 'gl102-1', slug: 'reading-aloud', title: 'Reading short passages aloud with correct intonation', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl102-2', slug: 'comprehension-questions', title: 'Comprehension questions (main idea, vocabulary, moral lessons)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ];
          },
          {
            id: 'gl103',
            slug: 'writing-1',
            title: 'Writing',
            lessons: [
              { id: 'gl103-1', slug: 'sentence-building', title: 'Sentence building and paragraph writing', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl103-2', slug: 'personal-letters', title: 'Writing personal letters (to a friend/parent)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl103-3', slug: 'guided-composition', title: 'Guided composition (e.g., "My Family", "Market Day")', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ];
          },
          {
            id: 'gl104',
            slug: 'grammar-1',
            title: 'Grammar & Structure',
            lessons: [
              { id: 'gl104-1', slug: 'parts-of-speech', title: 'Nouns, pronouns, verbs, adjectives', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl104-2', slug: 'sentence-types', title: 'Sentence types (simple, compound)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl104-3', slug: 'tenses', title: 'Tenses (present, past, future)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ];
          },
          {
            id: 'gl105',
            slug: 'literature-culture-1',
            title: 'Literature & Cultural Values',
            lessons: [
              { id: 'gl105-1', slug: 'folktales', title: 'Introduction to folktales (Ananse stories, moonlight stories)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl105-2', slug: 'proverbs', title: 'Simple proverbs and meanings', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl105-3', slug: 'songs-poems', title: 'Songs and traditional poems', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ];
          },
        ];
      },
      {
        level: 'JHS 2',
        topics: [
          {
            id: 'gl201',
            slug: 'oral-listening-2',
            title: 'Oral & Listening',
            lessons: [
              { id: 'gl201-1', slug: 'storytelling', title: 'Storytelling (retelling a folk story in your own words)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl201-2', slug: 'oral-poetry', title: 'Oral poetry and performance', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl201-3', slug: 'listening-comprehension', title: 'Listening comprehension (longer passages, questions)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ];
          },
          {
            id: 'gl202',
            slug: 'reading-comprehension-2',
            title: 'Reading & Comprehension',
            lessons: [
              { id: 'gl202-1', slug: 'reading-texts', title: 'Reading narrative and descriptive texts', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl202-2', slug: 'identifying-elements', title: 'Identifying main characters, themes, and settings', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl202-3', slug: 'critical-thinking', title: 'Critical thinking (compare two characters, predict endings)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ];
          },
          {
            id: 'gl203',
            slug: 'writing-2',
            title: 'Writing',
            lessons: [
              { id: 'gl203-1', slug: 'narrative-composition', title: 'Narrative composition (story writing, e.g., "A Visit to My Village")', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl203-2', slug: 'formal-letters', title: 'Formal letters (to Headmaster, local authority, etc.)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl203-3', slug: 'descriptive-writing', title: 'Descriptive writing (e.g., "My Favourite Festival")', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ];
          },
          {
            id: 'gl204',
            slug: 'grammar-2',
            title: 'Grammar & Structure',
            lessons: [
              { id: 'gl204-1', slug: 'subject-verb-agreement', title: 'Sentence agreement (subject-verb)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl204-2', slug: 'complex-sentences', title: 'Complex sentences (conjunctions, clauses)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl204-3', slug: 'reported-speech', title: 'Direct and reported speech', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ];
          },
          {
            id: 'gl205',
            slug: 'literature-culture-2',
            title: 'Literature & Proverbs',
            lessons: [
              { id: 'gl205-1', slug: 'folk-plays', title: 'Folk plays (drama)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl205-2', slug: 'poetry-intro', title: 'Introduction to selected poems', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl205-3', slug: 'proverbs-in-context', title: 'Proverbs in context (apply to real-life situations)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ];
          },
        ];
      },
      {
        level: 'JHS 3',
        topics: [
          {
            id: 'gl301',
            slug: 'oral-listening-3',
            title: 'Oral & Listening',
            lessons: [
              { id: 'gl301-1', slug: 'listening-speeches', title: 'Listening to speeches and summarizing', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl301-2', slug: 'oral-debate', title: 'Oral debate and discussions (expressing opinions clearly)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl301-3', slug: 'storytelling-morals', title: 'Storytelling with moral lessons', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ];
          },
          {
            id: 'gl302',
            slug: 'reading-comprehension-3',
            title: 'Reading & Comprehension',
            lessons: [
              { id: 'gl302-1', slug: 'advanced-comprehension', title: 'Advanced comprehension passages (narrative, expository, argumentative)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl302-2', slug: 'critical-analysis', title: 'Critical analysis (theme, mood, author\'s intention)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl302-3', slug: 'translation', title: 'Translation (short passages from English to Ghanaian Language and vice versa)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ];
          },
          {
            id: 'gl303',
            slug: 'writing-3',
            title: 'Writing',
            lessons: [
              { id: 'gl303-1', slug: 'argumentative-essays', title: 'Argumentative essays (e.g., "Education is better than money")', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl303-2', slug: 'expository-essays', title: 'Expository essays (e.g., "The Importance of Clean Water")', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl303-3', slug: 'letter-writing', title: 'Letter writing (formal, informal, official applications)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ];
          },
          {
            id: 'gl304',
            slug: 'grammar-3',
            title: 'Grammar & Structure',
            lessons: [
              { id: 'gl304-1', slug: 'advanced-tenses', title: 'Advanced tenses and aspect', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl304-2', slug: 'idiomatic-expressions', title: 'Idiomatic expressions and figurative language', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl304-3', slug: 'error-detection', title: 'Error detection and correction in sentences', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ];
          },
          {
            id: 'gl305',
            slug: 'literature-culture-3',
            title: 'Literature & Proverbs',
            lessons: [
              { id: 'gl305-1', slug: 'prescribed-prose', title: 'Study of prescribed prose (novel or short story)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl305-2', slug: 'selected-drama', title: 'Study of selected drama (play excerpts)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl305-3', slug: 'poetry-analysis', title: 'Poetry analysis (themes, imagery, sound devices)', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
              { id: 'gl305-4', slug: 'advanced-proverbs', title: 'Advanced use of proverbs in essays', objectives: [], introduction: '', keyConcepts: [], activities: { type: 'quiz', questions: [] }, pastQuestions: [], summary: '' },
            ];
          },
        ];
      },
    ];
  },
