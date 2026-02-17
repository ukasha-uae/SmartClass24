/**
 * Arena State – initial state factory and state shape
 * Engine-agnostic; only teams, scores, advantage.
 */

import type { ArenaState as ArenaStateType, TeamId, ArenaQuestion } from './types';

export function createInitialArenaState(
  questions: ArenaQuestion[],
  currentQuestionIndex = 0
): ArenaStateType {
  const left: ArenaStateType['teams']['left'] = {
    teamId: 'left',
    score: 0,
    advantage: 0,
    streak: 0,
  };
  const right: ArenaStateType['teams']['right'] = {
    teamId: 'right',
    score: 0,
    advantage: 0,
    streak: 0,
  };

  const currentQuestion =
    questions.length > 0 && currentQuestionIndex < questions.length
      ? questions[currentQuestionIndex]
      : null;

  return {
    phase: currentQuestion ? 'question' : 'idle',
    teams: { left, right },
    currentQuestionIndex,
    currentQuestion,
    totalQuestions: questions.length,
    winner: null,
    events: [],
  };
}
