/**
 * Arena Mock Data – demo mode, presentations, testing
 */

import type { ArenaQuestion } from './core/types';

export const MOCK_QUESTIONS: ArenaQuestion[] = [
  {
    id: 'q1',
    question: 'What is 7 × 8?',
    type: 'number_input',
    correctAnswer: 56,
    points: 10,
  },
  {
    id: 'q2',
    question: 'Which planet is known as the Red Planet?',
    type: 'mcq',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars',
    points: 10,
  },
  {
    id: 'q3',
    question: 'Water boils at 100°C at sea level.',
    type: 'truefalse',
    correctAnswer: true,
    points: 10,
  },
  {
    id: 'q4',
    question: 'What is the chemical symbol for gold?',
    type: 'mcq',
    options: ['Go', 'Au', 'Gd', 'Ag'],
    correctAnswer: 'Au',
    points: 10,
  },
  {
    id: 'q5',
    question: '12 + 15 = ?',
    type: 'number_input',
    correctAnswer: 27,
    points: 10,
  },
  {
    id: 'q6',
    question: 'The Earth orbits the Sun.',
    type: 'truefalse',
    correctAnswer: true,
    points: 10,
  },
  {
    id: 'q7',
    question: 'Which gas do plants absorb for photosynthesis?',
    type: 'mcq',
    options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
    correctAnswer: 'Carbon dioxide',
    points: 10,
  },
  {
    id: 'q8',
    question: '100 ÷ 5 = ?',
    type: 'number_input',
    correctAnswer: 20,
    points: 10,
  },
  {
    id: 'q9',
    question: 'Humans have 206 bones in their body.',
    type: 'truefalse',
    correctAnswer: true,
    points: 10,
  },
  {
    id: 'q10',
    question: 'Which continent is the largest by area?',
    type: 'mcq',
    options: ['Africa', 'Europe', 'Asia', 'North America'],
    correctAnswer: 'Asia',
    points: 10,
  },
];

/** Simulate an answer for auto-play / demo mode */
export function simulateAnswer(
  question: ArenaQuestion,
  teamId: 'left' | 'right',
  isCorrect: boolean,
  timeTakenMs: number
): { teamId: 'left' | 'right'; answer: string | number | boolean; timeTakenMs: number } {
  let answer: string | number | boolean;

  if (question.type === 'mcq' && question.options) {
    answer = isCorrect
      ? question.correctAnswer
      : question.options[question.options.indexOf(String(question.correctAnswer)) + 1] ?? question.options[0];
  } else if (question.type === 'truefalse') {
    answer = isCorrect ? question.correctAnswer : !question.correctAnswer;
  } else {
    answer = isCorrect ? question.correctAnswer : (Number(question.correctAnswer) + 1);
  }

  return { teamId, answer, timeTakenMs };
}
