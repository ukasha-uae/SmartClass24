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

