/**
 * Scoring Engine – correctness, speed bonus, streak bonus
 * Output: ScoreResult (deltaScore, deltaAdvantage, streakMultiplier)
 */

import type { ArenaQuestion, AnswerPayload, ScoreResult, ArenaConfig } from './types';
import { checkArenaAnswer } from './answerValidator';

export interface ScoringEngineConfig {
  basePointsPerCorrect: number;
  speedBonusMaxMs: number; // Answer faster than this gets max speed bonus
  streakBonusThreshold: number; // Streak needed for multiplier
  comebackAssist: boolean; // Optional: boost losing team slightly
}

const DEFAULT_CONFIG: ScoringEngineConfig = {
  basePointsPerCorrect: 10,
  speedBonusMaxMs: 5000,
  streakBonusThreshold: 3,
  comebackAssist: false,
};

export function calculateScore(
  question: ArenaQuestion,
  payload: AnswerPayload,
  currentStreak: number,
  config: Partial<ScoringEngineConfig> = {}
): ScoreResult {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const isCorrect = checkArenaAnswer(question, payload.answer);

  // Base delta for correct/incorrect (advantage = power for Light Your City)
  let deltaScore = isCorrect ? cfg.basePointsPerCorrect : 0;
  let deltaAdvantage = isCorrect ? 12 : -5; // Correct: +power; wrong: blackout
  let streakMultiplier = 1;
  let timeBonus = 0;

  if (isCorrect) {
    // Speed bonus: faster = more points (0-50% extra)
    const speedRatio = Math.max(0, 1 - payload.timeTakenMs / cfg.speedBonusMaxMs);
    timeBonus = Math.round(deltaScore * 0.5 * speedRatio);

    // Streak bonus
    if (currentStreak >= cfg.streakBonusThreshold) {
      streakMultiplier = 1 + Math.min(0.5, (currentStreak - cfg.streakBonusThreshold) * 0.1);
    }

    deltaScore = Math.round((deltaScore + timeBonus) * streakMultiplier);
    deltaAdvantage = Math.round(deltaAdvantage * streakMultiplier);
  }

  return {
    isCorrect,
    deltaScore,
    deltaAdvantage,
    streakMultiplier,
    timeBonus,
  };
}
