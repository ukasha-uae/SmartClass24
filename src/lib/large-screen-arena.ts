/**
 * Shared helpers for Large Screen Arena: level/class/subject selection
 * and question bank access. Class display names adapt for global (Grade X,
 * Middle School X, High School X) vs West Africa (Primary X, JHS X, SHS X).
 */

import { getChallengeQuestions, type ChallengeQuestion, type EducationLevel as BankEducationLevel } from '@/lib/challenge-questions-exports';
import type { ArenaQuestion } from '@/lib/arena/core/types';

export type EducationLevel = 'Primary' | 'JHS' | 'SHS';

const ARENA_DEFAULT_POINTS = 10;
const MAX_ARENA_QUESTIONS = 25;

export interface ClassLevelOption {
  id: string;
  name: string;
}

export function getClassLevelOptions(
  educationLevel: EducationLevel,
  isGlobal: boolean
): ClassLevelOption[] {
  if (educationLevel === 'Primary') {
    return isGlobal
      ? [
          { id: 'Primary 1', name: 'Grade 1' },
          { id: 'Primary 2', name: 'Grade 2' },
          { id: 'Primary 3', name: 'Grade 3' },
          { id: 'Primary 4', name: 'Grade 4' },
          { id: 'Primary 5', name: 'Grade 5' },
          { id: 'Primary 6', name: 'Grade 6' },
        ]
      : [
          { id: 'Primary 1', name: 'Primary 1' },
          { id: 'Primary 2', name: 'Primary 2' },
          { id: 'Primary 3', name: 'Primary 3' },
          { id: 'Primary 4', name: 'Primary 4' },
          { id: 'Primary 5', name: 'Primary 5' },
          { id: 'Primary 6', name: 'Primary 6' },
        ];
  }
  if (educationLevel === 'JHS') {
    return isGlobal
      ? [
          { id: 'JHS 1', name: 'Middle School 1' },
          { id: 'JHS 2', name: 'Middle School 2' },
          { id: 'JHS 3', name: 'Middle School 3' },
        ]
      : [
          { id: 'JHS 1', name: 'JHS 1' },
          { id: 'JHS 2', name: 'JHS 2' },
          { id: 'JHS 3', name: 'JHS 3' },
        ];
  }
  // SHS / High School
  return isGlobal
    ? [
        { id: 'SHS 1', name: 'High School 1' },
        { id: 'SHS 2', name: 'High School 2' },
        { id: 'SHS 3', name: 'High School 3' },
      ]
    : [
        { id: 'SHS 1', name: 'SHS 1' },
        { id: 'SHS 2', name: 'SHS 2' },
        { id: 'SHS 3', name: 'SHS 3' },
      ];
}

/**
 * Map a ChallengeQuestion (question bank format) to ArenaQuestion (arena engine format).
 * Bank uses options[] + correctAnswer as index; arena uses options + correctAnswer as value.
 */
function mapChallengeToArenaQuestion(cq: ChallengeQuestion): ArenaQuestion {
  const options = cq.options ?? [];
  const idx = typeof cq.correctAnswer === 'number' ? cq.correctAnswer : 0;
  const correctValue = options[idx] ?? options[0] ?? '';
  return {
    id: cq.id,
    question: cq.question,
    type: 'mcq',
    options,
    correctAnswer: correctValue,
    points: ARENA_DEFAULT_POINTS,
  };
}

/**
 * Load questions from the challenge question bank, mapped to arena format.
 * Uses level, subject, and classLevel so content is properly mapped to the selected class and subject.
 * Falls back to empty array if bank returns none (caller can then use mock questions).
 */
export function getArenaQuestionsForLargeScreen(
  level: EducationLevel,
  subject: string,
  classLevel: string,
  count: number = MAX_ARENA_QUESTIONS,
  userId: string = 'guest'
): ArenaQuestion[] {
  if (!subject?.trim() || !classLevel?.trim()) {
    return [];
  }
  const bank = getChallengeQuestions(
    level as BankEducationLevel,
    subject,
    classLevel as Parameters<typeof getChallengeQuestions>[2],
    count,
    userId
  );
  return bank.map(mapChallengeToArenaQuestion);
}
