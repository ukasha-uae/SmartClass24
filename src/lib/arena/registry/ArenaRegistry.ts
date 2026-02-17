/**
 * Arena Registry – pluggable arenas, no hardcoded logic
 * Usage: ArenaRegistry.register("light-your-city", LightCityArena)
 */

import type { ArenaModule } from '../core/types';

const registry = new Map<string, ArenaModule>();

export const ArenaRegistry = {
  register(id: string, module: ArenaModule): void {
    if (registry.has(id)) {
      console.warn(`[ArenaRegistry] Overwriting arena: ${id}`);
    }
    registry.set(id, module);
  },

  get(id: string): ArenaModule | undefined {
    return registry.get(id);
  },

  has(id: string): boolean {
    return registry.has(id);
  },

  list(): string[] {
    return Array.from(registry.keys());
  },

  /** Clear all (for tests) */
  clear(): void {
    registry.clear();
  },
};
