export type MathConceptId =
  | 'sets.operations.union'
  | 'sets.operations.intersection'
  | 'sets.operations.complement'
  | 'algebra.linear.solve'
  | 'algebra.quadratic.factorization'
  | 'algebra.quadratic.discriminant';

export type MathBandId = 'middle_school' | 'high_school';

export type MathBandMeta = {
  id: MathBandId;
  globalLabel: string;
  aliases: string[];
};

export const MATH_BANDS: Record<MathBandId, MathBandMeta> = {
  middle_school: {
    id: 'middle_school',
    globalLabel: 'Middle School',
    aliases: ['JHS', 'JSS', 'Middle School'],
  },
  high_school: {
    id: 'high_school',
    globalLabel: 'High School',
    aliases: ['SHS', 'SSS', 'High School'],
  },
};

export function getMathBandFromLegacyLevel(level: string): MathBandId {
  const normalized = level.trim().toLowerCase();
  if (normalized === 'shs' || normalized === 'high school') {
    return 'high_school';
  }
  return 'middle_school';
}

export function getMathBandLabel(
  band: MathBandId,
  labels?: { jhs?: string; shs?: string }
): string {
  if (band === 'middle_school') {
    return labels?.jhs ?? MATH_BANDS.middle_school.globalLabel;
  }
  return labels?.shs ?? MATH_BANDS.high_school.globalLabel;
}
