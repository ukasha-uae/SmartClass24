/**
 * Liberia Country Configuration
 * Defines educational system, cultural context, and localization settings
 * 
 * @module localization/countries/liberia
 * @version 1.0.0
 */

import type { CountryConfig } from '../country-config';
import { DEFAULT_LOCALIZATION_RULES } from '../country-config';

export const liberia: CountryConfig = {
  // ============================================================================
  // BASIC INFORMATION
  // ============================================================================
  id: 'liberia',
  name: 'Liberia',
  flag: '🇱🇷',
  iso2: 'LR',
  iso3: 'LBR',
  
  // ============================================================================
  // GEOGRAPHIC
  // ============================================================================
  regions: [
    'Bong County',
    'Bomi County',
    'Grand Bassa County',
    'Grand Cape Mount County',
    'Grand Gedeh County',
    'Grand Kru County',
    'Lofa County',
    'Margibi County',
    'Maryland County',
    'Montserrado County',
    'Nimba County',
    'River Cess County',
    'River Gee County',
    'Sinoe County',
    'Gbarpolu County',
  ],
  capital: 'Monrovia',
  majorCities: ['Monrovia', 'Gbarnga', 'Buchanan', 'Ganta', 'Kakata', 'Zwedru'],
  timezone: 'Africa/Monrovia', // UTC+0
  
  // ============================================================================
  // CURRENCY
  // ============================================================================
  currency: {
    code: 'LRD',
    symbol: 'L$',
    name: 'Liberian Dollar',
    subunit: 'cent',
    subunitValue: 100,
  },

  // ============================================================================
  // EXAMINATION SYSTEM
  // ============================================================================
  examSystem: {
    primary: 'NPSE',
    secondary: 'WASSCE',
    tertiary: 'WASSCE / University Entrance',
    conductor: 'WAEC (West African Examinations Council)',
  },

  // ============================================================================
  // ACADEMIC STRUCTURE
  // ============================================================================
  academicStructure: {
    primary: {
      name: 'Primary',
      officialName: 'Primary School',
      levels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
      duration: 6,
      ageRange: '6-11 years',
    },
    juniorSecondary: {
      name: 'JSS',
      officialName: 'Junior Secondary School',
      levels: ['JSS 1', 'JSS 2', 'JSS 3'],
      duration: 3,
      ageRange: '12-14 years',
    },
    seniorSecondary: {
      name: 'SSS',
      officialName: 'Senior Secondary School',
      levels: ['SSS 1', 'SSS 2', 'SSS 3'],
      duration: 3,
      ageRange: '15-17 years',
    },
  },

  // ============================================================================
  // EDUCATION BOARD
  // ============================================================================
  educationBoard: {
    name: 'Ministry of Education',
    abbreviation: 'MOE',
    website: 'https://moe.gov.lr',
    description: 'Responsible for education policy, curriculum development, and school management in Liberia',
  },

  // ============================================================================
  // LANGUAGE
  // ============================================================================
  language: {
    primary: 'English',
    official: ['English'],
    local: [
      'Bassa',
      'Kpelle',
      'Gio',
      'Mano',
      'Kru',
      'Grebo',
      'Krahn',
      'Vai',
      'Gola',
      'Mandingo',
      'Kissi',
      'Gbandi',
    ],
    examLanguages: ['English'],
  },

  // ============================================================================
  // BUSINESS CONTEXT
  // ============================================================================
  businessContext: {
    publicCompanies: [
      'Liberia Telecommunications Corporation',
      'National Port Authority',
      'Liberia Electricity Corporation',
      'ArcelorMittal Liberia',
      'Firestone Liberia',
      'Liberian Bank for Development and Investment',
    ],
    banks: [
      'Central Bank of Liberia',
      'Ecobank Liberia',
      'United Bank for Africa (UBA) Liberia',
      'Guaranty Trust Bank Liberia',
      'International Bank Liberia',
      'First International Bank',
    ],
    stockExchange: 'None (Banking sector dominant)',
    taxAuthority: 'Liberia Revenue Authority (LRA)',
    companiesAct: 'Business Corporation Act 1977',
    recordRetention: '7 years',
    adjective: 'Liberian',
    demonym: 'Liberians',
    
    regulations: {
      annualReturnDeadline: 'Within 90 days after fiscal year-end',
      auditRequirement: {
        threshold: 'All registered companies',
        description: 'Annual statutory audit required for all registered companies'
      },
      taxFilingDeadline: '3 months after fiscal year-end',
      minimumCapital: {
        privateCompany: 'L$10,000 (nominal capital)',
        publicCompany: 'L$100,000 minimum stated capital'
      },
      vatRegistrationThreshold: 'L$3,000,000 annual turnover',
      corporateTaxRate: '25% (standard rate)',
      withholdingTaxRate: '15% on dividends, 10% on services'
    }
  },

  // ============================================================================
  // CULTURAL CONTEXT
  // ============================================================================
  culturalContext: {
    festivals: [
      {
        name: 'Independence Day',
        description: 'Celebration of Liberia\'s independence - Africa\'s first republic',
        period: 'July 26',
      },
      {
        name: 'Thanksgiving Day',
        description: 'National day of thanksgiving',
        period: 'First Thursday in November',
      },
      {
        name: 'National Flag Day',
        description: 'Celebration of the Liberian flag',
        period: 'August 24',
      },
      {
        name: 'Pioneers\' Day',
        description: 'Honors the freed slaves who founded Liberia',
        period: 'January 7',
      },
    ],

    landmarks: [
      {
        name: 'Providence Island',
        location: 'Monrovia',
        significance: 'Landing site of freed American slaves in 1822',
        type: 'historical',
      },
      {
        name: 'Ducor Palace Hotel',
        location: 'Monrovia',
        significance: 'Historic landmark overlooking the city',
        type: 'historical',
      },
      {
        name: 'Sapo National Park',
        location: 'Sinoe County',
        significance: 'Largest protected rainforest in West Africa',
        type: 'natural',
      },
      {
        name: 'Mount Nimba',
        location: 'Nimba County',
        significance: 'UNESCO World Heritage Site, biodiversity hotspot',
        type: 'natural',
      },
      {
        name: 'Robertsport Beach',
        location: 'Grand Cape Mount County',
        significance: 'Famous surfing destination',
        type: 'natural',
      },
    ],

    historicalFigures: [
      {
        name: 'Joseph Jenkins Roberts',
        achievement: 'First President of Liberia',
        period: '1809-1876',
        significance: 'Led Liberia to become Africa\'s first republic in 1847',
      },
      {
        name: 'Ellen Johnson Sirleaf',
        achievement: 'First female elected head of state in Africa',
        period: '1938-present',
        significance: 'Nobel Peace Prize laureate, President 2006-2018',
      },
      {
        name: 'William Tubman',
        achievement: 'Longest-serving president of Liberia',
        period: '1895-1971',
        significance: 'Modernized Liberia and promoted economic development',
      },
      {
        name: 'George Weah',
        achievement: 'Former professional footballer and current president',
        period: '1966-present',
        significance: 'Only African to win FIFA World Player of the Year',
      },
    ],

    commonFoods: [
      'Dumboy (Cassava Fufu)',
      'Jollof Rice',
      'Pepper Soup',
      'Palava Sauce',
      'Groundnut Soup',
      'Fufu',
      'Fried Plantain',
      'Palm Butter',
    ],

    institutions: [
      {
        name: 'Central Bank of Liberia',
        abbreviation: 'CBL',
        type: 'economic',
        description: 'Central bank responsible for monetary policy',
      },
      {
        name: 'Liberia Institute of Statistics and Geo-Information Services',
        abbreviation: 'LISGIS',
        type: 'government',
        description: 'National statistics office',
      },
      {
        name: 'Liberia Revenue Authority',
        abbreviation: 'LRA',
        type: 'government',
        description: 'Tax collection and revenue management',
      },
      {
        name: 'National Bureau of Concessions',
        abbreviation: 'NBC',
        type: 'government',
        description: 'Regulates concession agreements',
      },
      {
        name: 'Liberia Maritime Authority',
        abbreviation: 'LMA',
        type: 'government',
        description: 'Manages ship registration (major revenue source)',
      },
    ],

    resources: [
      {
        name: 'Iron Ore',
        type: 'mineral',
        regions: ['Nimba County', 'Bong County', 'Grand Bassa County'],
        significance: 'Major export commodity, significant reserves',
      },
      {
        name: 'Gold',
        type: 'mineral',
        regions: ['Lofa County', 'Nimba County'],
        significance: 'Important mining sector',
      },
      {
        name: 'Diamonds',
        type: 'mineral',
        regions: ['Lofa County', 'Bong County'],
        significance: 'Valuable export commodity',
      },
      {
        name: 'Rubber',
        type: 'agricultural',
        regions: ['Margibi County', 'Grand Bassa County'],
        significance: 'Firestone plantation - world\'s largest rubber plantation',
      },
      {
        name: 'Timber',
        type: 'forest',
        regions: ['Multiple counties'],
        significance: 'Tropical hardwoods for export',
      },
      {
        name: 'Palm Oil',
        type: 'agricultural',
        regions: ['Multiple counties'],
        significance: 'Important agricultural product',
      },
    ],

    traditionalDress: [
      'Lappa (Wrapper)',
      'Country Cloth',
      'Dashiki',
      'Buba and Sokoto',
      'Kente',
    ],

    music: [
      'Hipco (Liberian Hip-Hop)',
      'Gbema',
      'Afrobeat',
      'Gospel',
      'Traditional Tribal Music',
      'Reggae',
    ],

    sports: [
      'Football (Soccer)',
      'Basketball',
      'Athletics',
      'Volleyball',
      'Kickball',
    ],
  },

  // ============================================================================
  // LOCALIZATION RULES
  // ============================================================================
  localizationRules: {
    ...DEFAULT_LOCALIZATION_RULES,
    phoneFormat: '+231 XX XXX XXXX',
    addressFormat: ['house_number', 'street', 'area', 'city', 'county', 'liberia'],
  },

  // ============================================================================
  // STATUS & METADATA
  // ============================================================================
  status: 'active',
  launchDate: '2025-12-18',
  priority: 4,
  supportEmail: 'support@smartclass24.com',
  supportPhone: '+231 XX XXX XXXX',

  // ============================================================================
  // FEATURES
  // ============================================================================
  features: {
    challengeArena: true,
    socialFeatures: true,
    offlineMode: true,
    parentMonitoring: true,
    aiTutor: true,
  },
};

export const liberiaConfig = liberia;
export default liberia;
