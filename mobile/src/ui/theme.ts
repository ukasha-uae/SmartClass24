export const theme = {
  bg: '#FBF1E8',
  card: '#FCFAF6',
  tile: '#F4F1EC',
  border: '#E6DFD5',
  ink: '#3B2417',
  muted: '#7A6F66',
  primary: '#5A3825',
  primaryDisabled: '#B5A397',
  blue: '#3B5BDB',
  green: '#16A34A',
  amber: '#D97706',
  red: '#DC2626',
  purple: '#7C3AED',
  gold: '#F5B301',
  radius: 14,
} as const;

export const classLevelColor = (classLevel: string): string => {
  const n = Number(classLevel.match(/\d+$/)?.[0] ?? 1);
  return n <= 2 ? theme.green : n <= 4 ? theme.amber : theme.red;
};
