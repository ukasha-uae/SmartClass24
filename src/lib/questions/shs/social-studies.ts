// Social Studies Questions for SHS
// Initial batch of questions migrated to modular ChallengeQuestion format
// NOTE: These are practice-style WASSCE-level questions, not yet tagged as verified past questions.

import type { ChallengeQuestion } from '../types';

export const socialStudiesQuestions: ChallengeQuestion[] = [
  // ============================================
  // MCQ Questions (Initial Batch)
  // ============================================

  // Social Studies - Citizenship & Governance
  {
    id: 'shs-soc-001',
    type: 'mcq',
    question: 'Which of the following is a responsibility of a good citizen?',
    options: [
      'Evading taxes',
      'Obeying the laws of the country',
      'Destroying public property',
      'Refusing to vote in elections',
    ],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Citizenship',
    explanation: 'Good citizens obey the laws, pay taxes, and protect public property.',
    source: 'practice',
  },
  {
    id: 'shs-soc-002',
    type: 'mcq',
    question: 'Democracy is best described as a system of government in which:',
    options: [
      'Power belongs to a single ruler',
      'Power belongs to the wealthy',
      'Power belongs to the people',
      'Power belongs to the military',
    ],
    correctAnswer: 2,
    subject: 'Social Studies',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Governance',
    explanation: 'Democracy is “government of the people, by the people, and for the people”.',
    source: 'practice',
  },

  // Social Studies - Culture & Socialization
  {
    id: 'shs-soc-003',
    type: 'mcq',
    question: 'Culture can best be defined as:',
    options: [
      'The way of life of a people',
      'Only the food people eat',
      'Only the clothes people wear',
      'Only the language people speak',
    ],
    correctAnswer: 0,
    subject: 'Social Studies',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Culture',
    explanation: 'Culture includes beliefs, customs, values, language, food, dress, and more.',
    source: 'practice',
  },
  {
    id: 'shs-soc-004',
    type: 'mcq',
    question: 'Which of the following agents of socialization is usually the first a child encounters?',
    options: ['School', 'Peer group', 'Family', 'Mass media'],
    correctAnswer: 2,
    subject: 'Social Studies',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Socialization',
    explanation: 'The family is the primary agent of socialization for every child.',
    source: 'practice',
  },

  // Social Studies - Environment & Sustainable Development
  {
    id: 'shs-soc-005',
    type: 'mcq',
    question: 'Which of the following practices best promotes environmental sustainability?',
    options: ['Bush burning', 'Improper waste disposal', 'Afforestation', 'Overgrazing'],
    correctAnswer: 2,
    subject: 'Social Studies',
    difficulty: 'easy',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'Environment',
    explanation: 'Afforestation (planting trees) helps protect soil, climate, and biodiversity.',
    source: 'practice',
  },
  {
    id: 'shs-soc-006',
    type: 'mcq',
    question: 'Sustainable development means:',
    options: [
      'Using resources carelessly to meet today’s needs',
      'Using resources in a way that meets present needs without harming future generations',
      'Avoiding the use of natural resources completely',
      'Focusing only on economic growth',
    ],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'medium',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'Sustainable Development',
    explanation: 'Sustainable development balances current use of resources with protection for future generations.',
    source: 'practice',
  },

  // Social Studies - National Economy & Work
  {
    id: 'shs-soc-007',
    type: 'mcq',
    question: 'Which of the following is a factor of production?',
    options: ['Money', 'Land', 'Finished goods', 'Consumers'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'easy',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'Economy',
    explanation: 'The main factors of production are land, labour, capital and entrepreneurship.',
    source: 'practice',
  },
  {
    id: 'shs-soc-008',
    type: 'mcq',
    question: 'The major reason for paying tax is to:',
    options: [
      'Punish citizens',
      'Finance government projects and services',
      'Discourage people from working',
      'Make people poor',
    ],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'easy',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'National Economy',
    explanation: 'Taxes are used to finance public goods and services like roads, schools, and hospitals.',
    source: 'practice',
  },

  // Social Studies - Peace, Conflict & National Integration
  {
    id: 'shs-soc-009',
    type: 'mcq',
    question: 'Which of the following is the BEST way to resolve conflict peacefully in a community?',
    options: ['Violence', 'Dialogue and mediation', 'Gossip', 'Intimidation'],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'medium',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'Conflict Resolution',
    explanation: 'Dialogue and mediation help parties understand each other and reach agreement peacefully.',
    source: 'practice',
  },
  {
    id: 'shs-soc-010',
    type: 'mcq',
    question: 'National integration is mainly aimed at:',
    options: [
      'Dividing people into ethnic groups',
      'Promoting unity among different groups in a country',
      'Encouraging discrimination',
      'Supporting only one region',
    ],
    correctAnswer: 1,
    subject: 'Social Studies',
    difficulty: 'medium',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'National Integration',
    explanation: 'National integration promotes unity and cooperation among diverse groups within a country.',
    source: 'practice',
  },
];


