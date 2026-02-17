/**
 * Answer validation – generic, arena-agnostic
 * Matches ArenaQuestion type to user answer.
 */

import type { ArenaQuestion } from './types';

export function checkArenaAnswer(question: ArenaQuestion, answer: unknown): boolean {
  if (question.type === 'mcq') {
    const correct = question.correctAnswer;
    if (typeof answer === 'number' && question.options) {
      return question.options[answer] === correct;
    }
    return String(answer).toLowerCase().trim() === String(correct).toLowerCase().trim();
  }

  if (question.type === 'truefalse') {
    const correctBool = String(question.correctAnswer).toLowerCase().trim() === 'true';
    const userBool =
      typeof answer === 'boolean'
        ? answer
        : String(answer).toLowerCase().trim() === 'true';
    return userBool === correctBool;
  }

  if (question.type === 'number_input') {
    const correct = Number(question.correctAnswer);
    const user = Number(answer);
    return !Number.isNaN(user) && Math.abs(user - correct) < 0.01;
  }

  return false;
}
