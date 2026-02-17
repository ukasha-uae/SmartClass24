/**
 * Challenge Questions API
 * Simple re-exports with explicit type imports
 */

// Import everything explicitly
import { 
  getChallengeQuestions as _getChallengeQuestions,
  getAvailableSubjects as _getAvailableSubjects,
  getAvailableSubjectsForGlobalArena as _getAvailableSubjectsForGlobalArena,
  getQuestionBankSize as _getQuestionBankSize,
  type EducationLevel,
  type ClassLevel,
  type QuestionDifficulty,
  type ChallengeQuestion
} from './challenge-questions';

// Re-export with wrapper functions to ensure proper binding
export function getChallengeQuestions(
  level: EducationLevel,
  subject: string,
  difficulty: QuestionDifficulty | ClassLevel,
  count: number = 10,
  userId: string = 'guest'
): ChallengeQuestion[] {
  return _getChallengeQuestions(level, subject, difficulty, count, userId);
}

export function getAvailableSubjects(level: EducationLevel): string[] {
  return _getAvailableSubjects(level);
}

export function getAvailableSubjectsForGlobalArena(level: EducationLevel): string[] {
  return _getAvailableSubjectsForGlobalArena(level);
}

export function getQuestionBankSize(level: EducationLevel): number {
  return _getQuestionBankSize(level);
}

// Export types
export type { EducationLevel, ClassLevel, QuestionDifficulty, ChallengeQuestion };
