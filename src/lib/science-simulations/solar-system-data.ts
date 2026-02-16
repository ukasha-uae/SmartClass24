/**
 * Solar System simulation content — K-12 aligned, scalable, i18n-ready.
 * Facts can be extended by grade band (e.g. cycle1, cycle2, cycle3 for UAE).
 */

export type GradeBand = 'all' | 'primary' | 'middle' | 'secondary';

export interface PlanetFact {
  /** Short headline for info panel */
  headline: string;
  /** 1–2 sentences; age-appropriate */
  description: string;
  /** Optional grade band (e.g. UAE cycles) */
  gradeBand?: GradeBand;
}

export interface PlanetData {
  id: string;
  name: string;
  /** Relative size for 3D (viewable scale; not true scale) */
  radius: number;
  /** Relative orbital radius (units) */
  orbitRadius: number;
  /** Orbital period in arbitrary units (1 = Earth year); for animation speed */
  orbitPeriod: number;
  /** Human-readable orbit period for UI (e.g. "88 days", "1 year") */
  orbitLabel?: string;
  /** Hex color for sphere */
  color: string;
  /** Facts for different bands; first is default */
  facts: PlanetFact[];
  /** Optional URL for "Learn more" (e.g. NASA Solar System Exploration) */
  learnMoreUrl?: string;
}

/** Solar system content — single source of truth for simulation + copy */
export const SOLAR_SYSTEM_PLANETS: PlanetData[] = [
  {
    id: 'sun',
    name: 'Sun',
    radius: 2.2,
    orbitRadius: 0,
    orbitPeriod: 0,
    orbitLabel: 'Center',
    color: '#fbbf24',
    learnMoreUrl: 'https://science.nasa.gov/sun/',
    facts: [
      {
        headline: 'The Sun is a star',
        description: 'It is at the center of our solar system. All planets orbit around it. It gives us light and heat.',
        gradeBand: 'all',
      },
      {
        headline: 'The Sun and life on Earth',
        description: 'Without the Sun, there would be no life on Earth. Plants use sunlight to make food, and we depend on that.',
        gradeBand: 'primary',
      },
    ],
  },
  {
    id: 'mercury',
    name: 'Mercury',
    radius: 0.28,
    orbitRadius: 4,
    orbitPeriod: 0.24,
    orbitLabel: '88 Earth days',
    color: '#a8a29e',
    learnMoreUrl: 'https://science.nasa.gov/mercury/',
    facts: [
      {
        headline: 'Closest planet to the Sun',
        description: 'Mercury is the smallest planet and the closest to the Sun. A year on Mercury is only 88 Earth days.',
        gradeBand: 'all',
      },
    ],
  },
  {
    id: 'venus',
    name: 'Venus',
    radius: 0.7,
    orbitRadius: 6,
    orbitPeriod: 0.62,
    orbitLabel: '225 Earth days',
    color: '#eab308',
    learnMoreUrl: 'https://science.nasa.gov/venus/',
    facts: [
      {
        headline: 'Earth’s twin?',
        description: 'Venus is similar in size to Earth but has a very thick, hot atmosphere. It is the hottest planet.',
        gradeBand: 'all',
      },
    ],
  },
  {
    id: 'earth',
    name: 'Earth',
    radius: 0.75,
    orbitRadius: 8,
    orbitPeriod: 1,
    orbitLabel: '1 year',
    color: '#3b82f6',
    learnMoreUrl: 'https://science.nasa.gov/earth/',
    facts: [
      {
        headline: 'Our home planet',
        description: 'Earth has liquid water and an atmosphere that supports life. It takes one year to orbit the Sun.',
        gradeBand: 'all',
      },
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    radius: 0.4,
    orbitRadius: 10,
    orbitPeriod: 1.88,
    orbitLabel: '1.9 Earth years',
    color: '#ef4444',
    learnMoreUrl: 'https://science.nasa.gov/mars/',
    facts: [
      {
        headline: 'The Red Planet',
        description: 'Mars is red because of iron in its soil. Scientists send rovers to look for signs of past water and life.',
        gradeBand: 'all',
      },
    ],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    radius: 1.4,
    orbitRadius: 14,
    orbitPeriod: 11.86,
    orbitLabel: '11.9 Earth years',
    color: '#d97706',
    learnMoreUrl: 'https://science.nasa.gov/jupiter/',
    facts: [
      {
        headline: 'The largest planet',
        description: 'Jupiter is a gas giant. It has a famous Great Red Spot—a huge storm. It has many moons.',
        gradeBand: 'all',
      },
    ],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    radius: 1.2,
    orbitRadius: 18,
    orbitPeriod: 29.46,
    orbitLabel: '29.5 Earth years',
    color: '#fcd34d',
    learnMoreUrl: 'https://science.nasa.gov/saturn/',
    facts: [
      {
        headline: 'Planet with rings',
        description: 'Saturn’s rings are made of ice and rock. It is a gas giant like Jupiter.',
        gradeBand: 'all',
      },
    ],
  },
  {
    id: 'uranus',
    name: 'Uranus',
    radius: 0.85,
    orbitRadius: 22,
    orbitPeriod: 84,
    orbitLabel: '84 Earth years',
    color: '#67e8f9',
    learnMoreUrl: 'https://science.nasa.gov/uranus/',
    facts: [
      {
        headline: 'An ice giant',
        description: 'Uranus is made mostly of ices and gas. It rotates on its side compared to other planets.',
        gradeBand: 'all',
      },
    ],
  },
  {
    id: 'neptune',
    name: 'Neptune',
    radius: 0.82,
    orbitRadius: 26,
    orbitPeriod: 164.8,
    orbitLabel: '165 Earth years',
    color: '#6366f1',
    learnMoreUrl: 'https://science.nasa.gov/neptune/',
    facts: [
      {
        headline: 'The windiest planet',
        description: 'Neptune has very strong winds and storms. It was discovered using math before it was seen with a telescope.',
        gradeBand: 'all',
      },
    ],
  },
];

export function getPlanetById(id: string): PlanetData | undefined {
  return SOLAR_SYSTEM_PLANETS.find((p) => p.id === id);
}

export function getFactForPlanet(planetId: string, gradeBand?: GradeBand): PlanetFact | undefined {
  const planet = getPlanetById(planetId);
  if (!planet || !planet.facts.length) return undefined;
  const band = gradeBand || 'all';
  return planet.facts.find((f) => f.gradeBand === band) ?? planet.facts[0];
}
