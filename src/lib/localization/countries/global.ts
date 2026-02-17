/**
 * Global / Neutral Country Configuration
 * Used when no country is selected (country === null)
 * Provides neutral, internationally understood values for template resolution
 *
 * @module localization/countries/global
 * @version 1.0.0
 */

import type { CountryConfig } from '../country-config';
import { DEFAULT_LOCALIZATION_RULES } from '../country-config';

/**
 * Global configuration – neutral values for international audience
 * Currency: USD, Exams: assessment/standardized exam, Levels: Primary/Middle School/High School
 */
export const globalConfig: CountryConfig = {
  id: 'global',
  name: 'Global',
  flag: '🌍',
  iso2: 'XX',
  iso3: 'GLO',

  regions: [],
  capital: 'the capital',
  majorCities: ['a major city'],
  timezone: 'UTC',

  currency: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    subunit: 'cents',
    subunitValue: 100,
  },

  examSystem: {
    primary: 'assessment',
    secondary: 'standardized exam',
    tertiary: 'university entrance exam',
    conductor: 'examination board',
  },

  academicStructure: {
    primary: {
      name: 'Primary',
      officialName: 'Primary School',
      levels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
      duration: 6,
      ageRange: '6–12 years',
    },
    juniorSecondary: {
      name: 'Middle School',
      officialName: 'Middle School',
      levels: ['Grade 7', 'Grade 8', 'Grade 9'],
      duration: 3,
      ageRange: '12–15 years',
    },
    seniorSecondary: {
      name: 'High School',
      officialName: 'High School',
      levels: ['Grade 10', 'Grade 11', 'Grade 12'],
      duration: 3,
      ageRange: '15–18 years',
    },
  },

  educationBoard: {
    name: 'Education Board',
    abbreviation: 'N/A',
    description: 'General education standards',
  },

  language: {
    primary: 'English',
    official: ['English'],
    local: [],
    examLanguages: ['English'],
  },

  businessContext: {
    publicCompanies: ['Tech Company', 'Retail Corp', 'Bank Inc'],
    banks: ['National Bank', 'Global Finance'],
    stockExchange: 'Stock Exchange',
    taxAuthority: 'Tax Authority',
    companiesAct: 'Companies Act',
    recordRetention: '6 years',
    adjective: 'local',
    demonym: 'people',
    regulations: {
      annualReturnDeadline: 'Within 12 months after year-end',
      auditRequirement: {
        description: 'Annual audit required for registered companies',
      },
      taxFilingDeadline: 'Within 6 months after year-end',
      minimumCapital: {
        privateCompany: 'varies by jurisdiction',
        publicCompany: 'varies by jurisdiction',
      },
      vatRegistrationThreshold: 'varies by jurisdiction',
      corporateTaxRate: 'varies by jurisdiction',
      withholdingTaxRate: 'varies by jurisdiction',
    },
  },

  culturalContext: {
    festivals: [{ name: 'local festival', description: 'A cultural celebration', period: 'annually' }],
    landmarks: [
      { name: 'a local landmark', location: 'city', significance: 'notable site', type: 'modern' },
    ],
    historicalFigures: [
      { name: 'historical figure', achievement: 'significant contribution', period: 'various', significance: 'notable' },
    ],
    commonFoods: ['rice', 'bread', 'local cuisine'],
    institutions: [
      { name: 'Local Institution', type: 'educational', description: 'Educational institution' },
    ],
    resources: [{ name: 'natural resource', type: 'mineral', significance: 'economic importance' }],
  },

  localizationRules: DEFAULT_LOCALIZATION_RULES,

  status: 'active',
  launchDate: '2025-01-01T00:00:00Z',
  priority: 0,

  features: {
    challengeArena: true,
    socialFeatures: true,
    offlineMode: true,
    parentMonitoring: true,
    aiTutor: true,
  },
};
