export type ScienceSimulationMeta = {
  id: string;
  slug: string;
  title: string;
  /** Short one-line description for homepage cards */
  description: string;
  /** Subject tag to display on the card, e.g. 'Science' */
  subject: 'Science';
  /** Label for badge, e.g. '3D' */
  badge?: string;
  /** Whether this should be highlighted as the main feature */
  featured?: boolean;
};

/**
 * Lightweight registry for science simulations used on the homepage.
 *
 * This intentionally does NOT import React components or Three.js so that
 * the homepage bundle stays small. The actual lab components are registered
 * in `virtual-labs-data.ts` and rendered via `/virtual-labs/[labSlug]`.
 */
export const SCIENCE_SIMULATIONS: ScienceSimulationMeta[] = [
  {
    id: 'sci-sim-1',
    slug: 'solar-system',
    title: 'Solar System 3D',
    description: 'Explore the Sun and planets in 3D. Click each body to learn facts and speed up time to watch orbits.',
    subject: 'Science',
    badge: '3D',
    featured: true,
  },
  // Add more simulations here as you build them, e.g.:
  // {
  //   id: 'sci-sim-2',
  //   slug: 'earth-moon-system',
  //   title: 'Moon Phases & Eclipses',
  //   description: 'See how the positions of the Earth, Moon, and Sun create moon phases and eclipses.',
  //   subject: 'Science',
  //   badge: '3D',
  // },
];

