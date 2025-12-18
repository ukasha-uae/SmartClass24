/**
 * Sierra Leone Country Configuration
 * Defines educational system, cultural context, and localization settings
 * 
 * @module localization/countries/sierra-leone
 * @version 1.0.0
 */

import type { CountryConfig } from '../country-config';
import { DEFAULT_LOCALIZATION_RULES } from '../country-config';

export const sierraLeone: CountryConfig = {
  // ============================================================================
  // BASIC INFORMATION
  // ============================================================================
  id: 'sierra-leone',
  name: 'Sierra Leone',
  flag: '🇸🇱',
  iso2: 'SL',
  iso3: 'SLE',
  
  // ============================================================================
  // GEOGRAPHIC
  // ============================================================================
  regions: [
    'Eastern Province',
    'Northern Province',
    'Southern Province',
    'Western Area',
  ],
  capital: 'Freetown',
  majorCities: ['Freetown', 'Bo', 'Kenema', 'Makeni', 'Koidu'],
  timezone: 'Africa/Freetown', // UTC+0
  
  // ============================================================================
  // CURRENCY
  // ============================================================================
  currency: {
    code: 'SLL',
    symbol: 'Le',
    name: 'Sierra Leonean Leone',
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
      levels: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'],
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
    name: 'Ministry of Basic and Senior Secondary Education',
    abbreviation: 'MBSSE',
    website: 'https://mbsse.gov.sl',
    description: 'Responsible for curriculum development and education policy in Sierra Leone',
  },

  // ============================================================================
  // LANGUAGE
  // ============================================================================
  language: {
    primary: 'English',
    official: ['English'],
    local: [
      'Krio',
      'Mende',
      'Temne',
      'Limba',
      'Kono',
      'Sherbro',
      'Loko',
      'Susu',
      'Fula',
    ],
    examLanguages: ['English'],
  },

  // ============================================================================
  // BUSINESS CONTEXT
  // ============================================================================
  businessContext: {
    publicCompanies: [
      'Sierra Leone Commercial Bank',
      'National Telecommunications Commission',
      'Sierra Leone Electricity Distribution Company',
      'Sierra Rutile Limited',
      'Koidu Holdings',
      'Sierra Leone Brewery Limited',
    ],
    banks: [
      'Sierra Leone Commercial Bank',
      'Ecobank Sierra Leone',
      'United Bank for Africa (UBA) Sierra Leone',
      'Guaranty Trust Bank Sierra Leone',
      'First International Bank',
      'Rokel Commercial Bank',
    ],
    stockExchange: 'None (Banking sector dominant)',
    taxAuthority: 'National Revenue Authority (NRA)',
    companiesAct: 'Companies Act 2009',
    recordRetention: '6 years',
    adjective: 'Sierra Leonean',
    demonym: 'Sierra Leoneans',
    
    regulations: {
      annualReturnDeadline: 'Within 12 months after year-end',
      auditRequirement: {
        threshold: 'All companies registered under Companies Act 2009',
        description: 'Annual statutory audit required for registered companies'
      },
      taxFilingDeadline: '4 months after year-end for companies',
      minimumCapital: {
        privateCompany: 'Le 100,000 (nominal capital)',
        publicCompany: 'Le 500,000 minimum stated capital'
      },
      vatRegistrationThreshold: 'Le 200,000,000 annual turnover',
      corporateTaxRate: '30% (standard rate)',
      withholdingTaxRate: '10% on dividends, 5% on services'
    }
  },

  // ============================================================================
  // CULTURAL CONTEXT
  // ============================================================================
  culturalContext: {
    festivals: [
      {
        name: 'Independence Day',
        description: 'Celebration of Sierra Leone\'s independence from Britain',
        period: 'April 27',
      },
      {
        name: 'Bintumani Festival',
        description: 'Cultural festival celebrating Sierra Leone\'s diverse heritage',
        period: 'November',
      },
      {
        name: 'Lantern Festival',
        description: 'Freetown\'s traditional Christmas Eve parade',
        period: 'December 24',
      },
      {
        name: 'Ramadan and Eid',
        description: 'Islamic holy month and celebration',
        period: 'Based on Islamic calendar',
      },
    ],

    landmarks: [
      {
        name: 'Cotton Tree',
        location: 'Freetown',
        significance: 'Historic symbol of Freetown, over 200 years old',
        type: 'historical',
      },
      {
        name: 'Bunce Island',
        location: 'Sierra Leone River',
        significance: 'Former slave trading post, UNESCO World Heritage Site candidate',
        type: 'historical',
      },
      {
        name: 'Tacugama Chimpanzee Sanctuary',
        location: 'Western Area',
        significance: 'Wildlife conservation center for endangered chimpanzees',
        type: 'natural',
      },
      {
        name: 'Outamba-Kilimi National Park',
        location: 'Northern Province',
        significance: 'Protected wildlife area with elephants and hippos',
        type: 'natural',
      },
      {
        name: 'Tiwai Island Wildlife Sanctuary',
        location: 'Southern Province',
        significance: 'Biodiversity hotspot with rare primates',
        type: 'natural',
      },
    ],

    historicalFigures: [
      {
        name: 'Sengbe Pieh (Joseph Cinqué)',
        achievement: 'Leader of the Amistad slave ship rebellion',
        period: '1814-1879',
        significance: 'Symbol of resistance against slavery',
      },
      {
        name: 'Bai Bureh',
        achievement: 'Temne war chief who resisted British colonialism',
        period: '1840-1908',
        significance: 'National hero of Sierra Leone',
      },
      {
        name: 'Sir Milton Margai',
        achievement: 'First Prime Minister of Sierra Leone',
        period: '1895-1964',
        significance: 'Led the country to independence in 1961',
      },
      {
        name: 'Ahmad Tejan Kabbah',
        achievement: 'President who led reconciliation after civil war',
        period: '1932-2014',
        significance: 'Brought peace and stability post-conflict',
      },
    ],

    commonFoods: [
      'Cassava Leaves (Cassava Leaf Stew)',
      'Jollof Rice',
      'Groundnut Soup',
      'Fufu with Palava Sauce',
      'Fried Plantain',
      'Akara (Bean Cakes)',
      'Pepper Soup',
      'Rice and Stew',
    ],

    institutions: [
      {
        name: 'Bank of Sierra Leone',
        abbreviation: 'BSL',
        type: 'economic',
        description: 'Central bank responsible for monetary policy',
      },
      {
        name: 'Statistics Sierra Leone',
        abbreviation: 'Stats SL',
        type: 'government',
        description: 'National statistics office',
      },
      {
        name: 'National Minerals Agency',
        abbreviation: 'NMA',
        type: 'government',
        description: 'Regulates mining sector',
      },
      {
        name: 'National Revenue Authority',
        abbreviation: 'NRA',
        type: 'government',
        description: 'Tax collection and revenue management',
      },
      {
        name: 'Sierra Leone Maritime Administration',
        abbreviation: 'SLMA',
        type: 'government',
        description: 'Regulates maritime affairs',
      },
    ],

    resources: [
      {
        name: 'Diamonds',
        type: 'mineral',
        regions: ['Eastern Province', 'Southern Province'],
        significance: 'Major export commodity, internationally renowned',
      },
      {
        name: 'Rutile (Titanium Ore)',
        type: 'mineral',
        regions: ['Southern Province'],
        significance: 'One of the world\'s largest rutile producers',
      },
      {
        name: 'Iron Ore',
        type: 'mineral',
        regions: ['Northern Province'],
        significance: 'Significant reserves at Tonkolili',
      },
      {
        name: 'Bauxite',
        type: 'mineral',
        regions: ['Southern Province'],
        significance: 'Major aluminum ore deposits',
      },
      {
        name: 'Cocoa and Coffee',
        type: 'agricultural',
        regions: ['Eastern Province', 'Southern Province'],
        significance: 'Important cash crops for export',
      },
      {
        name: 'Fisheries',
        type: 'agricultural',
        regions: ['Western Area', 'Coastal regions'],
        significance: 'Atlantic coast provides fishing resources',
      },
    ],

    traditionalDress: [
      'Gara (Tie-dye fabric)',
      'Country Cloth',
      'Kente',
      'Dashiki',
      'Wrapper and Blouse',
    ],

    music: [
      'Palm Wine Music',
      'Maringa',
      'Bubu Music',
      'Afrobeat',
      'Gospel',
      'Reggae',
    ],

    sports: [
      'Football (Soccer)',
      'Basketball',
      'Athletics',
      'Cricket',
      'Volleyball',
    ],
  },

  // ============================================================================
  // LOCALIZATION RULES
  // ============================================================================
  localizationRules: {
    ...DEFAULT_LOCALIZATION_RULES,
    phoneFormat: '+232 XX XXX XXXX',
    addressFormat: ['house_number', 'street', 'area', 'city', 'district', 'sierra-leone'],
  },

  // ============================================================================
  // STATUS & METADATA
  // ============================================================================
  status: 'active',
  launchDate: '2025-12-18', // Launch date
  priority: 3, // Third country after Ghana and Nigeria
  supportEmail: 'support@smartclass24.com',
  supportPhone: '+232 XX XXX XXXX', // Sierra Leone phone code

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

export const sierraLeoneConfig = sierraLeone;
export default sierraLeone;
