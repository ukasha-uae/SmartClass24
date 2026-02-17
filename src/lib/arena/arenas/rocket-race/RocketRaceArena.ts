/**
 * Rocket Race – Arena module
 * Maps engine advantage (0–100) to rocket fuel for renderer.
 * First team to 100% fuel wins.
 */

import type { ArenaModule, ArenaState, TeamId } from '../../core/types';
import { ROCKET_RACE_CONFIG } from './rocketRaceConfig';

export const RocketRaceArena: ArenaModule = {
  id: ROCKET_RACE_CONFIG.id,
  name: ROCKET_RACE_CONFIG.name,
  config: ROCKET_RACE_CONFIG,

  getVisualState(state: ArenaState): Record<string, number> {
    return {
      fuelLeft: Math.min(100, state.teams.left.advantage),
      fuelRight: Math.min(100, state.teams.right.advantage),
    };
  },

  checkWin(state: ArenaState): TeamId | null {
    if (state.teams.left.advantage >= 100) return 'left';
    if (state.teams.right.advantage >= 100) return 'right';
    return null;
  },
};
