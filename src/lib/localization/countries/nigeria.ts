/**
 * Nigeria Country Configuration
 * Second country in the SmartClass24 platform
 * 
 * @module localization/countries/nigeria
 * @version 1.0.0
 */

import type { CountryConfig } from '../country-config';
import { DEFAULT_LOCALIZATION_RULES } from '../country-config';

/**
 * Complete Nigeria configuration
 * Most populous African nation with 36 states
 */
export const nigeriaConfig: CountryConfig = {
  // ============================================================================
  // BASIC INFORMATION
  // ============================================================================
  id: 'nigeria',
  name: 'Nigeria',
  flag: '🇳🇬',
  iso2: 'NG',
  iso3: 'NGA',

  // ============================================================================
  // GEOGRAPHIC
  // ============================================================================
  regions: [
    'Lagos',
    'Kano',
    'Rivers',
    'Oyo',
    'Kaduna',
    'Abuja (FCT)',
    'Ogun',
    'Katsina',
    'Borno',
    'Delta',
    'Imo',
    'Plateau',
    'Edo',
    'Anambra',
    'Bauchi',
    'Jigawa',
    'Benue',
    'Adamawa',
    'Niger',
    'Akwa Ibom',
    'Ondo',
    'Sokoto',
    'Osun',
    'Kogi',
    'Zamfara',
    'Enugu',
    'Kebbi',
    'Cross River',
    'Kwara',
    'Gombe',
    'Abia',
    'Bayelsa',
    'Taraba',
    'Yobe',
    'Ebonyi',
    'Nasarawa',
  ],
  capital: 'Abuja', // Administrative capital
  majorCities: ['Lagos', 'Kano', 'Ibadan', 'Port Harcourt', 'Benin City', 'Abuja'],
  timezone: 'Africa/Lagos', // UTC+1

  // ============================================================================
  // CURRENCY
  // ============================================================================
  currency: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    subunit: 'kobo',
    subunitValue: 100,
  },

  // ============================================================================
  // EDUCATION SYSTEM
  // ============================================================================
  examSystem: {
    primary: 'JSCE', // Junior School Certificate Examination
    secondary: 'WASSCE', // Also NECO (National Examinations Council)
    tertiary: 'JAMB', // Joint Admissions and Matriculation Board
    conductor: 'WAEC, NECO (National Examinations Council)',
  },

  academicStructure: {
    primary: {
      name: 'Primary',
      officialName: 'Primary School',
      levels: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
      duration: 6,
      ageRange: '6-12 years',
    },
    juniorSecondary: {
      name: 'JSS',
      officialName: 'Junior Secondary School',
      levels: ['JSS 1', 'JSS 2', 'JSS 3'],
      duration: 3,
      ageRange: '12-15 years',
    },
    seniorSecondary: {
      name: 'SSS',
      officialName: 'Senior Secondary School',
      levels: ['SSS 1', 'SSS 2', 'SSS 3'],
      duration: 3,
      ageRange: '15-18 years',
    },
  },

  educationBoard: {
    name: 'Nigerian Educational Research and Development Council',
    abbreviation: 'NERDC',
    website: 'https://nerdc.gov.ng',
    description: 'Responsible for educational curriculum development in Nigeria',
  },

  // ============================================================================
  // LANGUAGE
  // ============================================================================
  language: {
    primary: 'English',
    official: ['English'],
    local: [
      'Hausa',
      'Yoruba',
      'Igbo',
      'Fulfulde',
      'Kanuri',
      'Ibibio',
      'Tiv',
      'Ijaw',
      'Edo',
      'Efik',
    ],
    examLanguages: ['English', 'Nigerian Language (Hausa/Yoruba/Igbo)'],
  },

  // ============================================================================
  // BUSINESS CONTEXT
  // ============================================================================
  businessContext: {
    publicCompanies: [
      'Dangote Cement',
      'MTN Nigeria',
      'Nestlé Nigeria',
      'Nigerian Breweries',
      'Guaranty Trust Bank (GTBank)',
      'Zenith Bank',
      'Access Bank',
      'First Bank of Nigeria',
      'Seplat Energy',
      'BUA Cement',
      'Flourmill Nigeria',
    ],
    banks: [
      'Guaranty Trust Bank (GTBank)',
      'Zenith Bank',
      'Access Bank',
      'First Bank of Nigeria',
      'United Bank for Africa (UBA)',
      'Ecobank Nigeria',
      'Fidelity Bank Nigeria',
      'Stanbic IBTC Bank',
    ],
    stockExchange: 'Nigerian Exchange Group (NGX), formerly Nigerian Stock Exchange',
    taxAuthority: 'Federal Inland Revenue Service (FIRS)',
    companiesAct: 'Companies and Allied Matters Act (CAMA) 2020',
    recordRetention: '6 years',
    adjective: 'Nigerian',
    demonym: 'Nigerians',
    
    // Nigeria-specific regulations
    regulations: {
      annualReturnDeadline: 'Within 6 months after year-end',
      auditRequirement: {
        threshold: 'All companies except small companies (turnover < ₦120M and assets < ₦60M)',
        description: 'Public companies and large private companies must conduct annual statutory audits by qualified auditors'
      },
      taxFilingDeadline: '6 months after year-end for companies',
      minimumCapital: {
        privateCompany: '₦100,000 minimum share capital',
        publicCompany: '₦2,000,000 minimum share capital'
      },
      vatRegistrationThreshold: '₦25,000,000 annual turnover',
      corporateTaxRate: '30% for large companies, 20% for medium companies (turnover ₦25M-₦100M), 0% for small companies (turnover < ₦25M)',
      withholdingTaxRate: '10% on dividends, 10% on services, 5% on contracts'
    }
  },

  // ============================================================================
  // CULTURAL CONTEXT
  // ============================================================================
  culturalContext: {
    festivals: [
      {
        name: 'Eyo Festival',
        description: 'Traditional Lagos masquerade festival',
        period: 'Varies (commemorative occasions)',
      },
      {
        name: 'Argungu Fishing Festival',
        description: 'Annual fishing competition in Kebbi State',
        period: 'February-March',
      },
      {
        name: 'Osun-Osogbo Festival',
        description: 'Yoruba festival celebrating the goddess Osun',
        period: 'August',
      },
      {
        name: 'Durbar Festival',
        description: 'Celebrated in Northern Nigeria, featuring horse parades',
        period: 'Eid celebrations',
      },
      {
        name: 'New Yam Festival',
        description: 'Igbo harvest festival celebrating the yam harvest',
        period: 'August-October',
      },
      {
        name: 'Calabar Carnival',
        description: 'Africa\'s biggest street party in Cross River State',
        period: 'December',
      },
    ],

    landmarks: [
      {
        name: 'Zuma Rock',
        location: 'Niger State (near Abuja)',
        significance: 'Iconic monolith, symbol of Nigeria',
        type: 'natural',
      },
      {
        name: 'Yankari National Park',
        location: 'Bauchi State',
        significance: 'Largest wildlife park with warm water springs',
        type: 'natural',
      },
      {
        name: 'Olumo Rock',
        location: 'Abeokuta, Ogun State',
        significance: 'Historic fortress used by the Egba people',
        type: 'historical',
      },
      {
        name: 'Kainji Lake',
        location: 'Niger State',
        significance: 'Largest man-made lake in Nigeria, hydroelectric dam',
        type: 'modern',
      },
      {
        name: 'Sukur Cultural Landscape',
        location: 'Adamawa State',
        significance: 'UNESCO World Heritage site',
        type: 'historical',
      },
      {
        name: 'National Theatre',
        location: 'Lagos',
        significance: 'Premier arts and culture center',
        type: 'modern',
      },
      {
        name: 'Aso Rock',
        location: 'Abuja',
        significance: 'Presidential Villa location, symbol of government',
        type: 'modern',
      },
    ],

    historicalFigures: [
      {
        name: 'Nnamdi Azikiwe',
        achievement: 'First President of Nigeria, nationalist leader',
        period: '1904-1996',
        significance: 'Led Nigeria to independence, father of Nigerian nationalism',
      },
      {
        name: 'Obafemi Awolowo',
        achievement: 'Premier of Western Region, political leader',
        period: '1909-1987',
        significance: 'Introduced free primary education in Western Nigeria',
      },
      {
        name: 'Funmilayo Ransome-Kuti',
        achievement: 'Women\'s rights activist and political leader',
        period: '1900-1978',
        significance: 'First woman in Nigeria to drive a car, fought against colonialism',
      },
      {
        name: 'Wole Soyinka',
        achievement: 'First African Nobel Prize winner in Literature',
        period: '1934-present',
        significance: 'Renowned playwright, poet, and activist',
      },
      {
        name: 'Queen Amina of Zazzau',
        achievement: 'Warrior queen who expanded Zazzau territory',
        period: '1533-1610',
        significance: 'Symbol of female leadership and military prowess',
      },
    ],

    commonFoods: [
      'Jollof Rice',
      'Pounded Yam (with Egusi Soup)',
      'Fufu (with Ogbono Soup)',
      'Suya (Spicy Grilled Meat)',
      'Moi Moi (Steamed Bean Pudding)',
      'Akara (Bean Cakes)',
      'Eba (Garri) with Soup',
      'Pepper Soup',
      'Boli (Roasted Plantain)',
      'Chin Chin (Fried Pastry)',
    ],

    institutions: [
      {
        name: 'Central Bank of Nigeria',
        abbreviation: 'CBN',
        type: 'economic',
        description: 'Nigeria\'s central bank managing monetary policy',
      },
      {
        name: 'National Bureau of Statistics',
        abbreviation: 'NBS',
        type: 'government',
        description: 'National statistics office',
      },
      {
        name: 'Nigerian National Petroleum Corporation',
        abbreviation: 'NNPC',
        type: 'economic',
        description: 'State oil corporation',
      },
      {
        name: 'Joint Admissions and Matriculation Board',
        abbreviation: 'JAMB',
        type: 'educational',
        description: 'Conducts university entrance examinations',
      },
      {
        name: 'National Agency for Food and Drug Administration and Control',
        abbreviation: 'NAFDAC',
        type: 'government',
        description: 'Regulates food, drugs, and consumables',
      },
      {
        name: 'Nigerian Communications Commission',
        abbreviation: 'NCC',
        type: 'government',
        description: 'Regulates telecommunications sector',
      },
      {
        name: 'Nigerian Ports Authority',
        abbreviation: 'NPA',
        type: 'economic',
        description: 'Manages seaports',
      },
    ],

    resources: [
      {
        name: 'Crude Oil',
        type: 'energy',
        regions: ['Rivers', 'Delta', 'Bayelsa', 'Akwa Ibom'],
        significance: 'Major export commodity, backbone of Nigerian economy',
      },
      {
        name: 'Natural Gas',
        type: 'energy',
        regions: ['Rivers', 'Delta', 'Bayelsa'],
        significance: 'Significant reserves, export and domestic use',
      },
      {
        name: 'Palm Oil',
        type: 'agricultural',
        regions: ['Edo', 'Delta', 'Imo', 'Cross River'],
        significance: 'Major agricultural export, cooking oil',
      },
      {
        name: 'Cocoa',
        type: 'agricultural',
        regions: ['Ondo', 'Cross River', 'Osun'],
        significance: 'Important cash crop for export',
      },
      {
        name: 'Coal',
        type: 'mineral',
        regions: ['Enugu', 'Benue', 'Kogi'],
        significance: 'Energy resource, industrial use',
      },
      {
        name: 'Tin',
        type: 'mineral',
        regions: ['Plateau', 'Bauchi'],
        significance: 'Historical mining importance',
      },
    ],

    traditionalDress: [
      'Agbada (Yoruba)',
      'Kaftan (Northern Nigeria)',
      'George Wrapper (Igbo)',
      'Iro and Buba (Yoruba)',
      'Wrapper and Blouse',
    ],

    music: [
      'Afrobeats',
      'Highlife',
      'Juju Music',
      'Fuji Music',
      'Hip-Hop',
      'Traditional Drumming',
    ],

    sports: [
      'Football (Soccer)',
      'Basketball',
      'Athletics',
      'Boxing',
      'Wrestling',
      'Table Tennis',
    ],
  },

  // ============================================================================
  // LOCALIZATION RULES
  // ============================================================================
  localizationRules: {
    ...DEFAULT_LOCALIZATION_RULES,
    phoneFormat: '+234 XXX XXX XXXX',
    addressFormat: ['house_number', 'street', 'area', 'lga', 'state', 'nigeria'],
  },

  // ============================================================================
  // CURRICULUM ADJUSTMENTS
  // ============================================================================
  curriculumAdjustments: {
    // Exam information
    examBoard: 'WAEC Nigeria / NECO',
    hasCountrySpecificQuestions: true,
    
    // Nigeria-specific topics in WASSCE/NECO
    countrySpecificTopics: [
      'nigeria-constitution',
      'nigeria-federal-structure',
      'nigeria-oil-economy',
      'nigeria-political-system',
    ],
    
    renamedSubjects: {
      'JHS': 'JSS',
      'SHS': 'SSS',
    },
    additionalTopics: [
      'Nigerian Constitution 1999',
      'Federal Structure of Nigeria',
      'Nigerian Independence Movement',
      'Oil and Gas Industry in Nigeria',
      'JAMB Preparation',
      'NECO Examination',
    ],
    emphasizedTopics: [
      'Nigerian History',
      'Nigerian Government System',
      'Natural Resources of Nigeria',
      'Economic Activities in Nigeria',
      'States of Nigeria',
      'Nigerian Federalism',
    ],
    
    // Subject-specific adjustments
    subjectAdjustments: {
      'financial-accounting': {
        additionalContent: [
          'nigeria-tax-system',
          'cama-2020-provisions',
          'nigeria-banking-sector',
          'firs-regulations'
        ],
        weightage: {
          'theory-of-accounts': 20,
          'financial-statements': 25,
          'company-accounts': 20,
          'financial-analysis': 15,
          'computerized-accounting': 10,
          'nigeria-specific-regulations': 10
        }
      },
      'economics': {
        additionalContent: [
          'nigeria-economy-structure',
          'oil-revenue-management',
          'naira-exchange-rate'
        ]
      },
      'government': {
        additionalContent: [
          'nigeria-constitution-1999',
          'nigeria-electoral-system',
          'nigeria-federal-system'
        ]
      }
    }
  },

  // ============================================================================
  // STATUS & METADATA
  // ============================================================================
  status: 'beta',
  launchDate: '2026-01-15', // Target launch
  priority: 2, // Second priority after Ghana
  supportEmail: 'nigeria@smartclass24.com',
  supportPhone: '+234 XXX XXX XXXX',

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

/**
 * Export as default for easy import
 */
export default nigeriaConfig;
