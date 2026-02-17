/**
 * Light Your City – Arena config
 * Two teams, power 0–100, first to 100% powered wins.
 */

import type { ArenaConfig } from '../../core/types';

export const LIGHT_CITY_CONFIG: ArenaConfig = {
  id: 'light-your-city',
  name: 'Light Your City',
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
