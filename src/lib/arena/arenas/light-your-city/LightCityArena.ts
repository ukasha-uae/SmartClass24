/**
 * Light Your City – Arena module
 * Maps engine advantage (0–100) to city power for renderer.
 * First team to 100% powered city wins.
 */

import type { ArenaModule, ArenaState, TeamId } from '../../core/types';
import { LIGHT_CITY_CONFIG } from './lightCityConfig';

export const LightCityArena: ArenaModule = {
  id: LIGHT_CITY_CONFIG.id,
  name: LIGHT_CITY_CONFIG.name,
  config: LIGHT_CITY_CONFIG,

  /** Map engine advantage (0-100 per team) to renderer input */
  getVisualState(state: ArenaState): Record<string, number> {
    return {
      powerLeft: Math.min(100, state.teams.left.advantage),
      powerRight: Math.min(100, state.teams.right.advantage),
    };
  },

  /** First team to 100% wins */
  checkWin(state: ArenaState): TeamId | null {
    const left = state.teams.left.advantage;
    const right = state.teams.right.advantage;

    if (left >= 100) return 'left';
    if (right >= 100) return 'right';
    return null;
  },
};
