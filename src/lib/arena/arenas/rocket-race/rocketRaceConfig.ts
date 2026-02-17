/**
 * Rocket Race – Arena config
 * Two rockets, fuel 0–100%; first to 100% wins.
 * Correct answers = fuel up, wrong = burn fuel.
 */

import type { ArenaConfig } from '../../core/types';

export const ROCKET_RACE_CONFIG: ArenaConfig = {
  id: 'rocket-race',
  name: 'Rocket Race',
  winCondition: {
    type: 'first_to',
    value: 100,
  },
  maxQuestions: 20,
  difficulty: 'medium',
  comebackAssist: true,
  basePointsPerCorrect: 5,
  speedBonusMaxMs: 8000,
  streakBonusThreshold: 3,
};
