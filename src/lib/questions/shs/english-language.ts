// English Language Questions for SHS
// Initial batch of questions migrated to modular ChallengeQuestion format
// NOTE: These are practice-style WASSCE-level questions, not yet tagged as verified past questions.

import type { ChallengeQuestion } from '../types';

export const englishLanguageQuestions: ChallengeQuestion[] = [
  // ============================================
  // MCQ Questions (Initial Batch)
  // ============================================

  // English Language - Grammar (Tenses & Agreement)
  {
    id: 'shs-eng-001',
    type: 'mcq',
    question: 'Choose the correct option to complete the sentence: "She _____ to school every day."',
    options: ['go', 'goes', 'going', 'gone'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Present Simple Tense',
    explanation: 'In the simple present tense, we add -es for third person singular: She goes.',
    source: 'practice',
  },
  {
    id: 'shs-eng-002',
    type: 'mcq',
    question: 'Choose the correctly punctuated sentence.',
    options: [
      'its raining heavily outside.',
      "It's raining heavily outside.",
      "Its' raining heavily outside.",
      'Its raining heavily outside.',
    ],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Apostrophes & Contractions',
    explanation: 'The correct contraction of \"it is\" is \"it\'s\" with an apostrophe before s.',
    source: 'practice',
  },

  // English Language - Vocabulary & Word Choice
  {
    id: 'shs-eng-003',
    type: 'mcq',
    question: 'Which word best completes the sentence: "He is very _____; he never wastes money."',
    options: ['generous', 'thrifty', 'careless', 'wasteful'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Vocabulary',
    explanation: '“Thrifty” means careful with money and not wasteful.',
    source: 'practice',
  },
  {
    id: 'shs-eng-004',
    type: 'mcq',
    question: 'Choose the word that is opposite in meaning to "scarce".',
    options: ['few', 'rare', 'plentiful', 'little'],
    correctAnswer: 2,
    subject: 'English Language',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Antonyms',
    explanation: 'The opposite of “scarce” is “plentiful”.',
    source: 'practice',
  },

  // English Language - Sentence Structure & Clauses
  {
    id: 'shs-eng-005',
    type: 'mcq',
    question: 'Which of the following is a complex sentence?',
    options: [
      'He came, he saw, he conquered.',
      'She went home and slept.',
      'Although it was raining, we went to school.',
      'The boy ran quickly.',
    ],
    correctAnswer: 2,
    subject: 'English Language',
    difficulty: 'medium',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'Sentence Types',
    explanation: 'A complex sentence has one main clause and at least one subordinate clause, e.g. “Although it was raining, we went to school.”',
    source: 'practice',
  },
  {
    id: 'shs-eng-006',
    type: 'mcq',
    question: 'Identify the subordinate clause in the sentence: "I will call you when I arrive."',
    options: ['I will call you', 'when I arrive', 'I will', 'call you'],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'medium',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'Clauses',
    explanation: '“when I arrive” is the subordinate (dependent) clause; it cannot stand alone.',
    source: 'practice',
  },

  // English Language - Comprehension Skills (short item-based)
  {
    id: 'shs-eng-007',
    type: 'mcq',
    question: 'In comprehension, the main idea of a paragraph is usually found in the:',
    options: ['first or last sentence', 'middle sentence only', 'shortest sentence', 'longest sentence'],
    correctAnswer: 0,
    subject: 'English Language',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Comprehension',
    explanation: 'Writers often place the main idea in the first or last sentence of a paragraph.',
    source: 'practice',
  },
  {
    id: 'shs-eng-008',
    type: 'mcq',
    question: 'A passage that tells a story is mainly:',
    options: ['descriptive', 'expository', 'narrative', 'argumentative'],
    correctAnswer: 2,
    subject: 'English Language',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Comprehension / Genres',
    explanation: 'A story-telling passage is narrative.',
    source: 'practice',
  },

  // English Language - Idioms & Figures of Speech
  {
    id: 'shs-eng-009',
    type: 'mcq',
    question: 'The expression "break the ice" means:',
    options: [
      'to smash something',
      'to make people feel more relaxed in a new situation',
      'to cause trouble',
      'to end a relationship',
    ],
    correctAnswer: 1,
    subject: 'English Language',
    difficulty: 'medium',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'Idioms',
    explanation: '“Break the ice” means to make people feel more comfortable or start a friendly conversation.',
    source: 'practice',
  },
  {
    id: 'shs-eng-010',
    type: 'mcq',
    question: 'Which figure of speech is used in the sentence: "The stars danced in the sky"?',
    options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'],
    correctAnswer: 2,
    subject: 'English Language',
    difficulty: 'medium',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'Figures of Speech',
    explanation: 'Giving human action “danced” to non-human “stars” is personification.',
    source: 'practice',
  },
];


