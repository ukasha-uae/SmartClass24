export interface EarthMoonFact {
  id: string;
  title: string;
  description: string;
}

export interface EarthMoonConfig {
  /** Days in one lunar month (approximate) */
  lunarMonthDays: number;
  /** Tilt of Earth's axis in degrees */
  earthTiltDegrees: number;
  /** Relative distances for viewable scale (not true scale) */
  earthOrbitRadius: number;
  moonOrbitRadius: number;
}

export const EARTH_MOON_CONFIG: EarthMoonConfig = {
  lunarMonthDays: 29.5,
  earthTiltDegrees: 23.5,
  earthOrbitRadius: 12,
  moonOrbitRadius: 3,
};

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
      'Eclipses do not happen every month because the Moon’s orbit is tilted. Most of the time, the Moon passes slightly above or below the direct line between the Sun and Earth.',
  },
  {
    id: 'tides',
    title: 'Moon and tides',
    description:
      'The Moon’s gravity pulls on Earth’s oceans, causing high and low tides. The position of the Moon relative to the Sun and Earth changes how strong the tides are.',
  },
];

