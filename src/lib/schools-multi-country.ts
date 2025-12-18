/**
 * Multi-Country Schools System
 * Extends schools.ts with country-specific functionality for Challenge Arena
 */

import { School, GHANA_SCHOOLS, INDEPENDENT_LEARNER } from './schools';

// Update School interface to include country (using type extension)
export interface MultiCountrySchool extends School {
  country: 'ghana' | 'nigeria' | 'sierra-leone' | 'liberia' | 'gambia';
}

// Wrap existing Ghana schools with country field
const ENHANCED_GHANA_SCHOOLS: MultiCountrySchool[] = GHANA_SCHOOLS.map(school => ({
  ...school,
  country: 'ghana' as const,
}));

// Nigeria Schools
export const NIGERIA_SCHOOLS: MultiCountrySchool[] = [
  {
    id: 'kings-college-lagos',
    name: 'King\'s College Lagos',
    type: 'SHS',
    country: 'nigeria',
    region: 'Lagos',
    district: 'Lagos Island',
    town: 'Lagos',
    verified: true,
    studentCount: 0,
    colors: { primary: '#000080', secondary: '#FFD700' },
    founded: 1909,
    motto: 'Magna est Veritas'
  },
  {
    id: 'queens-college-lagos',
    name: 'Queen\'s College Lagos',
    type: 'SHS',
    country: 'nigeria',
    region: 'Lagos',
    district: 'Yaba',
    town: 'Lagos',
    verified: true,
    studentCount: 0,
    colors: { primary: '#800080', secondary: '#FFFFFF' },
    founded: 1927,
    motto: 'In Labore Fidelis'
  },
  {
    id: 'government-college-ibadan',
    name: 'Government College Ibadan',
    type: 'SHS',
    country: 'nigeria',
    region: 'Oyo',
    district: 'Ibadan',
    town: 'Ibadan',
    verified: true,
    studentCount: 0,
    founded: 1927,
  },
  {
    id: 'fggc-lagos',
    name: 'Federal Government Girls\' College Lagos',
    type: 'SHS',
    country: 'nigeria',
    region: 'Lagos',
    town: 'Lagos',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'ijanikin-jss-lagos',
    name: 'Ijanikin Junior Secondary School',
    type: 'JHS',
    country: 'nigeria',
    region: 'Lagos',
    town: 'Lagos',
    verified: true,
    studentCount: 0,
  },
];

// Sierra Leone Schools
export const SIERRA_LEONE_SCHOOLS: MultiCountrySchool[] = [
  {
    id: 'prince-of-wales-school',
    name: 'Prince of Wales School',
    type: 'SHS',
    country: 'sierra-leone',
    region: 'Western Area',
    town: 'Freetown',
    verified: true,
    studentCount: 0,
    founded: 1925,
  },
  {
    id: 'albert-academy',
    name: 'Albert Academy',
    type: 'SHS',
    country: 'sierra-leone',
    region: 'Western Area',
    town: 'Freetown',
    verified: true,
    studentCount: 0,
    founded: 1904,
  },
  {
    id: 'annie-walsh-memorial',
    name: 'Annie Walsh Memorial School',
    type: 'SHS',
    country: 'sierra-leone',
    region: 'Western Area',
    town: 'Freetown',
    verified: true,
    studentCount: 0,
    founded: 1849,
  },
  {
    id: 'bo-government-school',
    name: 'Bo Government Secondary School',
    type: 'SHS',
    country: 'sierra-leone',
    region: 'Southern Province',
    town: 'Bo',
    verified: true,
    studentCount: 0,
  },
];

// Liberia Schools
export const LIBERIA_SCHOOLS: MultiCountrySchool[] = [
  {
    id: 'booker-washington-institute',
    name: 'Booker Washington Institute',
    type: 'SHS',
    country: 'liberia',
    region: 'Montserrado County',
    town: 'Kakata',
    verified: true,
    studentCount: 0,
    founded: 1929,
  },
  {
    id: 'ricks-institute',
    name: 'Ricks Institute',
    type: 'SHS',
    country: 'liberia',
    region: 'Montserrado County',
    town: 'Virginia',
    verified: true,
    studentCount: 0,
    founded: 1887,
  },
  {
    id: 'st-patricks-high-school',
    name: 'St. Patrick\'s High School',
    type: 'SHS',
    country: 'liberia',
    region: 'Montserrado County',
    town: 'Monrovia',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'monrovia-jss',
    name: 'Monrovia Central JSS',
    type: 'JHS',
    country: 'liberia',
    region: 'Montserrado County',
    town: 'Monrovia',
    verified: true,
    studentCount: 0,
  },
];

// Gambia Schools
export const GAMBIA_SCHOOLS: MultiCountrySchool[] = [
  {
    id: 'gambia-high-school',
    name: 'Gambia High School',
    type: 'SHS',
    country: 'gambia',
    region: 'Banjul',
    town: 'Banjul',
    verified: true,
    studentCount: 0,
    founded: 1958,
  },
  {
    id: 'nusrat-high-school',
    name: 'Nusrat Senior Secondary School',
    type: 'SHS',
    country: 'gambia',
    region: 'Banjul',
    town: 'Banjul',
    verified: true,
    studentCount: 0,
    founded: 1981,
  },
  {
    id: 'st-augustines-high',
    name: 'St. Augustine\'s High School',
    type: 'SHS',
    country: 'gambia',
    region: 'Kanifing',
    town: 'Bakau',
    verified: true,
    studentCount: 0,
  },
  {
    id: 'serekunda-jss',
    name: 'Serekunda Upper Basic School',
    type: 'JHS',
    country: 'gambia',
    region: 'Kanifing',
    town: 'Serekunda',
    verified: true,
    studentCount: 0,
  },
];

// All schools combined
export function getAllMultiCountrySchools(): MultiCountrySchool[] {
  return [
    ...ENHANCED_GHANA_SCHOOLS,
    ...NIGERIA_SCHOOLS,
    ...SIERRA_LEONE_SCHOOLS,
    ...LIBERIA_SCHOOLS,
    ...GAMBIA_SCHOOLS,
  ];
}

// Get schools by country
export function getSchoolsByCountry(country: 'ghana' | 'nigeria' | 'sierra-leone' | 'liberia' | 'gambia'): MultiCountrySchool[] {
  switch (country) {
    case 'ghana':
      return ENHANCED_GHANA_SCHOOLS;
    case 'nigeria':
      return NIGERIA_SCHOOLS;
    case 'sierra-leone':
      return SIERRA_LEONE_SCHOOLS;
    case 'liberia':
      return LIBERIA_SCHOOLS;
    case 'gambia':
      return GAMBIA_SCHOOLS;
    default:
      return ENHANCED_GHANA_SCHOOLS;
  }
}

// Get school by ID (multi-country aware)
export function getMultiCountrySchoolById(id: string): MultiCountrySchool | undefined {
  return getAllMultiCountrySchools().find(school => school.id === id);
}

// Search schools by country
export function searchMultiCountrySchools(query: string, country?: 'ghana' | 'nigeria' | 'sierra-leone' | 'liberia' | 'gambia'): MultiCountrySchool[] {
  const lowerQuery = query.toLowerCase().trim();
  const schools = country ? getSchoolsByCountry(country) : getAllMultiCountrySchools();
  
  if (!lowerQuery) return schools;
  
  return schools.filter(school =>
    school.name.toLowerCase().includes(lowerQuery) ||
    school.region.toLowerCase().includes(lowerQuery) ||
    school.town?.toLowerCase().includes(lowerQuery)
  );
}

// Get schools by type and country
export function getMultiCountrySchoolsByType(
  type: School['type'],
  country?: 'ghana' | 'nigeria' | 'sierra-leone' | 'liberia' | 'gambia'
): MultiCountrySchool[] {
  const schools = country ? getSchoolsByCountry(country) : getAllMultiCountrySchools();
  return schools.filter(school => school.type === type);
}
