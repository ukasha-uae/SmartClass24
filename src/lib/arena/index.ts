/**
 * Arena Engine – core exports and registry setup
 */

export * from './core/types';
export * from './core/ArenaState';
export * from './core/ScoringEngine';
export * from './core/answerValidator';
export { ArenaEngine } from './core/ArenaEngine';
export { ArenaRegistry } from './registry/ArenaRegistry';
export { LightCityArena } from './arenas/light-your-city/LightCityArena';
export { LIGHT_CITY_CONFIG } from './arenas/light-your-city/lightCityConfig';
export { RocketRaceArena } from './arenas/rocket-race/RocketRaceArena';
export { ROCKET_RACE_CONFIG } from './arenas/rocket-race/rocketRaceConfig';
export { MOCK_QUESTIONS } from './mock-data';

// Register built-in arenas
import { ArenaRegistry } from './registry/ArenaRegistry';
import { LightCityArena } from './arenas/light-your-city/LightCityArena';
import { RocketRaceArena } from './arenas/rocket-race/RocketRaceArena';

ArenaRegistry.register('light-your-city', LightCityArena);
ArenaRegistry.register('rocket-race', RocketRaceArena);
