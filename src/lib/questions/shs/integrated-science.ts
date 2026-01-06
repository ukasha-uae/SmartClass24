// Integrated Science Questions for SHS
// Initial batch of questions migrated to modular ChallengeQuestion format
// NOTE: These are practice-style WASSCE-level questions, not yet tagged as verified past questions.

import type { ChallengeQuestion } from '../types';

export const integratedScienceQuestions: ChallengeQuestion[] = [
  // ============================================
  // MCQ Questions (Initial Batch)
  // ============================================

  // Integrated Science - Physics & Measurement
  {
    id: 'shs-intsci-001',
    type: 'mcq',
    question: 'Which instrument is used to measure temperature in a science laboratory?',
    options: ['Voltmeter', 'Thermometer', 'Barometer', 'Ammeter'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Measurement',
    explanation: 'A thermometer is used to measure temperature.',
    source: 'practice',
  },
  {
    id: 'shs-intsci-002',
    type: 'mcq',
    question: 'Which quantity is a vector?',
    options: ['Mass', 'Speed', 'Velocity', 'Temperature'],
    correctAnswer: 2,
    subject: 'Integrated Science',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Motion',
    explanation: 'Velocity has both magnitude and direction, so it is a vector quantity.',
    source: 'practice',
  },

  // Integrated Science - Biology: Cells & Systems
  {
    id: 'shs-intsci-003',
    type: 'mcq',
    question: 'Which of the following is NOT a living cell?',
    options: ['Red blood cell', 'Onion epidermal cell', 'Bacterial cell', 'Sand grain'],
    correctAnswer: 3,
    subject: 'Integrated Science',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Cells',
    explanation: 'Sand grain is non-living; the others are examples of cells.',
    source: 'practice',
  },
  {
    id: 'shs-intsci-004',
    type: 'mcq',
    question: 'Which organ system is responsible for transporting oxygen and nutrients in humans?',
    options: ['Digestive system', 'Respiratory system', 'Circulatory system', 'Nervous system'],
    correctAnswer: 2,
    subject: 'Integrated Science',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Human Biology',
    explanation: 'The circulatory system (blood, heart, vessels) transports oxygen and nutrients.',
    source: 'practice',
  },

  // Integrated Science - Chemistry: Matter & Changes
  {
    id: 'shs-intsci-005',
    type: 'mcq',
    question: 'Which of the following is a chemical change?',
    options: ['Melting of ice', 'Boiling of water', 'Rusting of iron', 'Breaking of glass'],
    correctAnswer: 2,
    subject: 'Integrated Science',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Matter and Changes',
    explanation: 'Rusting of iron forms a new substance (iron oxide), so it is a chemical change.',
    source: 'practice',
  },
  {
    id: 'shs-intsci-006',
    type: 'mcq',
    question: 'Which state of matter has a definite volume but no definite shape?',
    options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'States of Matter',
    explanation: 'Liquids have definite volume but take the shape of their container.',
    source: 'practice',
  },

  // Integrated Science - Ecology & Environment
  {
    id: 'shs-intsci-007',
    type: 'mcq',
    question: 'Which of the following is a renewable source of energy?',
    options: ['Coal', 'Petroleum', 'Natural gas', 'Solar energy'],
    correctAnswer: 3,
    subject: 'Integrated Science',
    difficulty: 'easy',
    classLevel: 'SHS 2',
    level: 'SHS',
    topic: 'Energy and Environment',
    explanation: 'Solar energy can be replenished naturally and is therefore renewable.',
    source: 'practice',
  },
  {
    id: 'shs-intsci-008',
    type: 'mcq',
    question: 'Which of the following is a primary consumer in a food chain?',
    options: ['Grass', 'Goat', 'Lion', 'Vulture'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Ecology',
    explanation: 'Primary consumers feed directly on producers (plants); a goat feeds on grass.',
    source: 'practice',
  },

  // Integrated Science - Earth Science & Astronomy
  {
    id: 'shs-intsci-009',
    type: 'mcq',
    question: 'The imaginary line that divides the Earth into Northern and Southern Hemispheres is called the:',
    options: ['Prime meridian', 'Equator', 'Tropic of Cancer', 'International Date Line'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Earth and Space',
    explanation: 'The equator divides the Earth into Northern and Southern Hemispheres.',
    source: 'practice',
  },
  {
    id: 'shs-intsci-010',
    type: 'mcq',
    question: 'Which planet is known as the “Red Planet”?',
    options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    correctAnswer: 1,
    subject: 'Integrated Science',
    difficulty: 'easy',
    classLevel: 'SHS 1',
    level: 'SHS',
    topic: 'Solar System',
    explanation: 'Mars appears reddish due to iron oxide on its surface, hence the “Red Planet”.',
    source: 'practice',
  },
];


