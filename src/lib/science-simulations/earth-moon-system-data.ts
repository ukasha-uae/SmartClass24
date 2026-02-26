export interface EarthMoonFact {
  id: string;
  title: string;
  description: string;
}

export interface EarthMoonConfig {
  /** Days in one synodic (phase) lunar month (new moon to new moon). Actual average ~29.53 days. */
  lunarMonthDays: number;
  /** Tilt of Earth's axis in degrees (seasons). Actual ~23.4°. */
  earthTiltDegrees: number;
  /** Moon's orbit tilt to ecliptic in degrees. Actual ~5.1°; used in scene for eclipse explanation. */
  moonOrbitTiltDegrees?: number;
  /** Relative distances for viewable scale (not true scale) */
  earthOrbitRadius: number;
  moonOrbitRadius: number;
}

export const EARTH_MOON_CONFIG: EarthMoonConfig = {
  lunarMonthDays: 29.5,
  earthTiltDegrees: 23.5,
  moonOrbitTiltDegrees: 5.1,
  earthOrbitRadius: 12,
  moonOrbitRadius: 3,
};

/** One-sentence "why we see this shape" per phase (index 0–7). Shown when student focuses on the Moon. */
export const PHASE_WHY: string[] = [
  'The Moon is between Earth and the Sun, so we see its unlit side.',
  'The Moon is just east of the Sun; we see a small sliver of the sunlit side.',
  'The Moon is 90° from the Sun, so we see half of its sunlit half (the right side).',
  'The Moon is more than 90° from the Sun, so more than half of its sunlit side faces us.',
  'The Moon is opposite the Sun, so we see the full sunlit half.',
  'The Moon is past full; we still see most of the sunlit side, but it is shrinking.',
  'The Moon is 90° west of the Sun, so we see half of its sunlit half (the left side).',
  'The Moon is almost between us and the Sun again; we see a small sliver on the left.',
];

export interface CheckQuestion {
  phaseIndex: number;
  question: string;
  options: string[];
  correctIndex: number;
  correctFeedback: string;
  incorrectFeedback: string;
}

/** Check-for-understanding questions shown during auto-play at these phases. */
export const MOON_LAB_CHECK_QUESTIONS: CheckQuestion[] = [
  {
    phaseIndex: 1,
    question: 'Why do we see only a sliver of the Moon in this phase?',
    options: [
      'The Moon is between Earth and the Sun, so we see only a small part of its sunlit side.',
      'The Moon is hiding part of itself.',
      'Earth blocks the light.',
    ],
    correctIndex: 0,
    correctFeedback: 'Right! The Moon is just east of the Sun, so we see a small sliver of the lit side.',
    incorrectFeedback: "Not quite. The Moon doesn't change shape—we see a sliver because only a small part of its sunlit half faces Earth.",
  },
  {
    phaseIndex: 4,
    question: 'Why do we see a Full Moon when the Moon is on the opposite side of Earth from the Sun?',
    options: [
      'The Moon makes its own light.',
      'We see the full sunlit half of the Moon because sunlight is lighting the side facing us.',
      'The Sun moves to the other side.',
    ],
    correctIndex: 1,
    correctFeedback: 'Correct! The Sun lights the half of the Moon facing it; when that half faces us, we see a full moon.',
    incorrectFeedback: "The Moon doesn't make its own light. Sunlight lights the side facing the Sun; when that whole side faces Earth, we see a full moon.",
  },
  {
    phaseIndex: 6,
    question: 'Why do we see exactly half the Moon lit at First or Last Quarter?',
    options: [
      'Half the Moon is in shadow by chance.',
      'The Moon is about 90° from the Sun, so half of its sunlit hemisphere faces Earth.',
      'The Moon is closest to Earth.',
    ],
    correctIndex: 1,
    correctFeedback: 'Yes! At 90° we see half of the Moon’s sunlit half—so it looks like a half moon.',
    incorrectFeedback: "Think about the angle: when the Moon is 90° from the Sun, exactly half of its sunlit side faces us.",
  },
];

export const EARTH_MOON_FACTS: EarthMoonFact[] = [
  {
    id: 'phases-basics',
    title: 'Why the Moon has phases',
    description:
      'The Moon does not change shape. We see different phases because we only see the sunlit half of the Moon, and our viewing angle from Earth changes as the Moon orbits us.',
  },
  {
    id: 'lunar-month',
    title: 'Length of a lunar month',
    description:
      'It takes about 29.5 days for the Moon to go from one new moon to the next. This is called a lunar month and is the basis of many traditional calendars.',
  },
  {
    id: 'eclipses-rare',
    title: 'Why eclipses are rare',
    description:
      'Eclipses do not happen every month because the Moon’s orbit is tilted about 5° to Earth’s orbit around the Sun. Most of the time at New Moon or Full Moon, the Moon passes slightly above or below the straight line between the Sun and Earth. A lunar eclipse (Earth’s shadow on the Moon) can only happen at Full Moon when the Moon crosses that line; a solar eclipse (Moon blocking the Sun) can only happen at New Moon when the Moon crosses that line. The orange line in the simulation shows where the Moon’s orbit crosses the Sun–Earth plane (the line of nodes).',
  },
  {
    id: 'tides',
    title: 'Moon and tides',
    description:
      'The Moon’s gravity pulls on Earth’s oceans, causing high and low tides. When the Sun, Earth, and Moon are in line (New or Full Moon), we get stronger “spring” tides; when the Moon is at right angles to the Sun–Earth line (First or Last Quarter), we get weaker “neap” tides.',
  },
];

