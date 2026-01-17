/**
 * Ghana Country Configuration
 * Baseline configuration for the Smartclass24 platform
 * 
 * @module localization/countries/ghana
 * @version 1.0.0
 */

import type { CountryConfig } from '../country-config';
import { DEFAULT_LOCALIZATION_RULES } from '../country-config';

/**
 * Complete Ghana configuration
 * This serves as the baseline for all other West African countries
 */
export const ghanaConfig: CountryConfig = {
  // ============================================================================
  // BASIC INFORMATION
  // ============================================================================
  id: 'ghana',
  name: 'Ghana',
  flag: '🇬🇭',
  iso2: 'GH',
  iso3: 'GHA',

  // ============================================================================
  // GEOGRAPHIC
  // ============================================================================
  regions: [
    'Greater Accra',
    'Ashanti',
    'Western',
    'Western North',
    'Eastern',
    'Central',
    'Northern',
    'Upper East',
    'Upper West',
    'Volta',
    'Oti',
    'Bono',
    'Bono East',
    'Ahafo',
    'Savannah',
    'North East',
  ],
  capital: 'Accra',
  majorCities: ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast', 'Sunyani'],
  timezone: 'Africa/Accra', // UTC+0

  // ============================================================================
  // CURRENCY
  // ============================================================================
  currency: {
    code: 'GHS',
    symbol: '₵',
    name: 'Ghana Cedi',
    subunit: 'pesewas',
    subunitValue: 100,
  },

  // ============================================================================
  // EDUCATION SYSTEM
  // ============================================================================
  examSystem: {
    primary: 'BECE',
    secondary: 'WASSCE',
    tertiary: 'WASSCE / University Entrance',
    conductor: 'WAEC (West African Examinations Council)',
  },

  academicStructure: {
    primary: {
      name: 'Primary',
      officialName: 'Primary School',
      levels: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'],
      duration: 6,
      ageRange: '6-12 years',
    },
    juniorSecondary: {
      name: 'JHS',
      officialName: 'Junior High School',
      levels: ['JHS 1', 'JHS 2', 'JHS 3'],
      duration: 3,
      ageRange: '12-15 years',
    },
    seniorSecondary: {
      name: 'SHS',
      officialName: 'Senior High School',
      levels: ['SHS 1', 'SHS 2', 'SHS 3'],
      duration: 3,
      ageRange: '15-18 years',
    },
  },

  educationBoard: {
    name: 'Ghana Education Service',
    abbreviation: 'GES',
    website: 'https://ges.gov.gh',
    description: 'The implementing agency for pre-tertiary education policies in Ghana',
  },

  // ============================================================================
  // LANGUAGE
  // ============================================================================
  language: {
    primary: 'English',
    official: ['English'],
    local: [
      'Akan (Twi, Fante)',
      'Ewe',
      'Ga',
      'Dagbani',
      'Dagaare',
      'Dangme',
      'Hausa',
      'Gonja',
      'Kasem',
    ],
    examLanguages: ['English', 'Ghanaian Language (Choice of local language)'],
  },

  // ============================================================================
  // BUSINESS CONTEXT
  // ============================================================================
  businessContext: {
    publicCompanies: [
      'MTN Ghana',
      'GCB Bank',
      'Ecobank Ghana',
      'AngloGold Ashanti',
      'Tullow Oil Ghana',
      'Unilever Ghana',
      'Fan Milk Ghana',
      'PZ Cussons Ghana',
      'Ghana Oil Company (GOIL)',
    ],
    banks: [
      'GCB Bank',
      'Ecobank Ghana',
      'Stanbic Bank Ghana',
      'Standard Chartered Bank Ghana',
      'Absa Bank Ghana',
      'Fidelity Bank Ghana',
      'Zenith Bank Ghana',
    ],
    stockExchange: 'Ghana Stock Exchange (GSE)',
    taxAuthority: 'Ghana Revenue Authority (GRA)',
    companiesAct: 'Companies Act 2019 (Act 992)',
    recordRetention: '6 years',
    adjective: 'Ghanaian',
    demonym: 'Ghanaians',
    
    // Ghana-specific regulations
    regulations: {
      annualReturnDeadline: 'Within 12 months after year-end',
      auditRequirement: {
        threshold: 'All companies registered under Companies Act 2019',
        description: 'Annual statutory audit is mandatory for all registered companies, conducted by a qualified auditor registered with ICAG'
      },
      taxFilingDeadline: '4 months after year-end for companies',
      minimumCapital: {
        privateCompany: '₵1.00 (nominal capital)',
        publicCompany: '₵50,000 minimum stated capital'
      },
      vatRegistrationThreshold: '₵200,000 annual turnover',
      corporateTaxRate: '25% (standard rate) or 1% (for companies with turnover below ₵500,000)',
      withholdingTaxRate: '8% on dividends, 5% on services'
    }
  },

  // ============================================================================
  // CULTURAL CONTEXT
  // ============================================================================
  culturalContext: {
    festivals: [
      {
        name: 'Homowo',
        description: 'Harvest festival celebrated by the Ga people',
        period: 'August-September',
      },
      {
        name: 'Aboakyir',
        description: 'Deer hunting festival in Winneba',
        period: 'May',
      },
      {
        name: 'Hogbetsotso',
        description: 'Festival of the Anlo Ewe people',
        period: 'November',
      },
      {
        name: 'Odwira',
        description: 'Purification festival of the Akan people',
        period: 'September-October',
      },
      {
        name: 'Damba',
        description: 'Festival celebrated in Northern Ghana',
        period: 'Based on Islamic calendar',
      },
      {
        name: 'Kundum',
        description: 'Harvest festival in the Western Region',
        period: 'September',
      },
    ],

    landmarks: [
      {
        name: 'Lake Volta',
        location: 'Volta Basin',
        significance: 'Largest man-made lake in the world by surface area',
        type: 'natural',
      },
      {
        name: 'Kakum National Park',
        location: 'Central Region',
        significance: 'Famous for canopy walkway and rainforest biodiversity',
        type: 'natural',
      },
      {
        name: 'Cape Coast Castle',
        location: 'Cape Coast',
        significance: 'UNESCO World Heritage site, significant in transatlantic slave trade',
        type: 'historical',
      },
      {
        name: 'Elmina Castle',
        location: 'Elmina',
        significance: 'Oldest European building in sub-Saharan Africa',
        type: 'historical',
      },
      {
        name: 'Kwame Nkrumah Mausoleum',
        location: 'Accra',
        significance: 'Memorial to Ghana\'s first president',
        type: 'historical',
      },
      {
        name: 'Mole National Park',
        location: 'Northern Region',
        significance: 'Largest wildlife refuge in Ghana',
        type: 'natural',
      },
      {
        name: 'Akosombo Dam',
        location: 'Eastern Region',
        significance: 'Hydroelectric power generation on Lake Volta',
        type: 'modern',
      },
    ],

    historicalFigures: [
      {
        name: 'Kwame Nkrumah',
        achievement: 'First President of Ghana and Pan-African leader',
        period: '1909-1972',
        significance: 'Led Ghana to independence in 1957, first African country south of the Sahara',
      },
      {
        name: 'Yaa Asantewaa',
        achievement: 'Queen Mother who led the Ashanti rebellion against British colonialism',
        period: '1840-1921',
        significance: 'Symbol of female leadership and resistance',
      },
      {
        name: 'J.B. Danquah',
        achievement: 'Nationalist leader and founding father',
        period: '1895-1965',
        significance: 'Played key role in Ghana\'s independence movement',
      },
      {
        name: 'Kofi Annan',
        achievement: 'Seventh Secretary-General of the United Nations',
        period: '1938-2018',
        significance: 'Nobel Peace Prize laureate, global diplomat',
      },
      {
        name: 'Ama Ata Aidoo',
        achievement: 'Renowned author and playwright',
        period: '1942-2023',
        significance: 'Pioneer of African feminist literature',
      },
    ],

    commonFoods: [
      'Fufu (with Light Soup, Groundnut Soup)',
      'Banku (with Okro Stew, Tilapia)',
      'Kenkey (with Fried Fish, Shitor)',
      'Jollof Rice',
      'Waakye (with Shito, Wele)',
      'Red Red (Bean Stew with Fried Plantain)',
      'Tuo Zaafi (Northern Ghana)',
      'Kelewele (Spicy Fried Plantain)',
      'Konkonte (Cocoyam dish)',
      'Omotuo (Rice Balls)',
    ],

    institutions: [
      {
        name: 'Bank of Ghana',
        abbreviation: 'BoG',
        type: 'economic',
        description: 'Central bank responsible for monetary policy',
      },
      {
        name: 'Ghana Statistical Service',
        abbreviation: 'GSS',
        type: 'government',
        description: 'National statistics office',
      },
      {
        name: 'Minerals Commission',
        abbreviation: 'MinCom',
        type: 'government',
        description: 'Regulates mining and minerals sector',
      },
      {
        name: 'Ghana Health Service',
        abbreviation: 'GHS',
        type: 'health',
        description: 'Manages public health services',
      },
      {
        name: 'Council for Scientific and Industrial Research',
        abbreviation: 'CSIR',
        type: 'educational',
        description: 'Leading scientific research organization',
      },
      {
        name: 'Food and Drugs Authority',
        abbreviation: 'FDA',
        type: 'government',
        description: 'Regulates food, drugs, and cosmetics',
      },
      {
        name: 'National Communications Authority',
        abbreviation: 'NCA',
        type: 'government',
        description: 'Regulates telecommunications',
      },
    ],

    resources: [
      {
        name: 'Gold',
        type: 'mineral',
        regions: ['Ashanti', 'Western', 'Eastern'],
        significance: 'Major export commodity, Ghana is a top global producer',
      },
      {
        name: 'Cocoa',
        type: 'agricultural',
        regions: ['Ashanti', 'Western', 'Eastern', 'Central'],
        significance: 'Second largest cocoa producer in the world',
      },
      {
        name: 'Bauxite',
        type: 'mineral',
        regions: ['Ashanti', 'Eastern'],
        significance: 'Significant reserves for aluminum production',
      },
      {
        name: 'Oil and Gas',
        type: 'energy',
        regions: ['Western (offshore)'],
        significance: 'Jubilee and TEN fields contribute to energy sector',
      },
      {
        name: 'Timber',
        type: 'forest',
        regions: ['Ashanti', 'Western', 'Central', 'Eastern'],
        significance: 'Tropical hardwoods including mahogany and teak',
      },
      {
        name: 'Shea Butter',
        type: 'agricultural',
        regions: ['Northern', 'Upper East', 'Upper West'],
        significance: 'Important export product from shea nuts',
      },
    ],

    traditionalDress: [
      'Kente Cloth',
      'Smock (Fugu)',
      'Batakari',
      'Agbada',
      'Kaba and Slit',
    ],

    music: [
      'Highlife',
      'Hiplife',
      'Gospel',
      'Azonto',
      'Afrobeats',
      'Traditional Drumming',
    ],

    sports: [
      'Football (Soccer)',
      'Boxing',
      'Athletics',
      'Basketball',
      'Volleyball',
    ],
  },

  // ============================================================================
  // LOCALIZATION RULES
  // ============================================================================
  localizationRules: {
    ...DEFAULT_LOCALIZATION_RULES,
    phoneFormat: '+970589549030',
    addressFormat: ['house_number', 'street', 'area', 'city', 'region', 'ghana'],
  },

  // ============================================================================
  // CURRICULUM ADJUSTMENTS
  // ============================================================================
  curriculumAdjustments: {
    // Exam information
    examBoard: 'WAEC Ghana',
    hasCountrySpecificQuestions: true,
    
    // Ghana-specific topics in WASSCE
    countrySpecificTopics: [
      'ghana-constitution',
      'ghana-local-government',
      'ghana-natural-resources',
      'ghana-economic-development',
    ],
    
    // Emphasized topics
    emphasizedTopics: [
      'Ghana History',
      'Ghanaian Government',
      'Natural Resources of Ghana',
      'Economic Activities in Ghana',
      'Regions of Ghana',
    ],
    
    // Subject-specific adjustments
    subjectAdjustments: {
      'financial-accounting': {
        additionalContent: [
          'ghana-tax-system',
          'ghana-company-law',
          'ghana-banking-regulations'
        ],
        weightage: {
          'theory-of-accounts': 20,
          'financial-statements': 25,
          'company-accounts': 20,
          'financial-analysis': 15,
          'computerized-accounting': 10,
          'ghana-specific-regulations': 10
        }
      },
      'social-studies': {
        additionalContent: [
          'ghana-government-structure',
          'ghana-economic-systems'
        ]
      }
    }
  },

  // ============================================================================
  // STATUS & METADATA
  // ============================================================================
  status: 'active',
  launchDate: '2024-01-01', // Original launch
  priority: 1, // Highest priority (baseline country)
  supportEmail: 'support@smartclass24.com',
  supportPhone: '+970589549030',

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
export default ghanaConfig;
