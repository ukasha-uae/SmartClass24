import type { CountryConfig } from '../country-config';
import { DEFAULT_LOCALIZATION_RULES } from '../country-config';

/**
 * GAMBIA 🇬🇲
 * The Gambia - "The Smiling Coast of Africa"
 * Smallest country in mainland Africa
 * 
 * Educational System:
 * - Primary: 6 years (Lower Basic - Grades 1-6)
 * - JSS: 3 years (Upper Basic - Grades 7-9)
 * - SSS: 3 years (Senior Secondary - Grades 10-12)
 * - Exams: GABECE (Basic), WASSCE (Secondary)
 * 
 * Currency: Gambian Dalasi (GMD) - D
 * Capital: Banjul
 * Language: English (official), Mandinka, Wolof, Fula
 */

export const gambia: CountryConfig = {
  id: 'gambia',
  name: 'The Gambia',
  flag: '🇬🇲',
  iso2: 'GM',
  iso3: 'GMB',

  // ============================================================================
  // GEOGRAPHY
  // ============================================================================
  regions: [
    'Banjul',
    'Kanifing',
    'Brikama',
    'Mansakonko',
    'Kerewan',
    'Kuntaur',
    'Janjanbureh',
    'Basse',
  ],
  capital: 'Banjul',
  majorCities: [
    'Serekunda',
    'Brikama',
    'Bakau',
    'Farafenni',
    'Lamin',
    'Sukuta',
    'Basse Santa Su',
    'Gunjur',
  ],
  timezone: 'Africa/Banjul',

  // ============================================================================
  // CURRENCY
  // ============================================================================
  currency: {
    code: 'GMD',
    symbol: 'D',
    name: 'Gambian Dalasi',
    subunit: 'butut',
    subunitValue: 100,
  },

  // ============================================================================
  // EXAM SYSTEM
  // ============================================================================
  examSystem: {
    primary: 'GABECE',        // Gambia Basic Education Certificate Examination
    secondary: 'WASSCE',      // West African Senior School Certificate Examination
    conductor: 'WAEC',        // West African Examinations Council
  },

  // ============================================================================
  // ACADEMIC STRUCTURE
  // ============================================================================
  academicStructure: {
    primary: {
      name: 'Primary',
      officialName: 'Lower Basic Education',
      levels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
      duration: 6,
      ageRange: '7-12 years',
    },
    juniorSecondary: {
      name: 'JSS',
      officialName: 'Upper Basic Education',
      levels: ['Grade 7', 'Grade 8', 'Grade 9'],
      duration: 3,
      ageRange: '13-15 years',
    },
    seniorSecondary: {
      name: 'SSS',
      officialName: 'Senior Secondary Education',
      levels: ['Grade 10', 'Grade 11', 'Grade 12'],
      duration: 3,
      ageRange: '16-18 years',
    },
  },

  // ============================================================================
  // EDUCATION BOARD
  // ============================================================================
  educationBoard: {
    name: 'Ministry of Basic and Secondary Education',
    abbreviation: 'MoBSE',
    website: 'https://www.edugambia.gm',
    description: 'Responsible for basic and secondary education policy, curriculum development, and school management in The Gambia',
  },

  // ============================================================================
  // LANGUAGE
  // ============================================================================
  language: {
    primary: 'English',
    official: ['English'],
    local: [
      'Mandinka',
      'Wolof',
      'Fula',
      'Jola',
      'Serahuli',
      'Serer',
      'Aku',
      'Manjago',
      'Bambara',
    ],
    examLanguages: ['English'],
  },

  // ============================================================================
  // BUSINESS CONTEXT
  // ============================================================================
  businessContext: {
    publicCompanies: [
      'Gambia Groundnut Corporation',
      'Social Security and Housing Finance Corporation (SSHFC)',
      'Gambia Ports Authority',
      'National Water and Electricity Company (NAWEC)',
      'Trust Bank Limited',
      'Standard Chartered Bank Gambia',
      'Guaranty Trust Bank Gambia',
      'Gambia International Airlines',
    ],
    banks: [
      'Central Bank of The Gambia',
      'Trust Bank Limited',
      'Standard Chartered Bank Gambia',
      'Guaranty Trust Bank Gambia',
      'Ecobank Gambia',
      'First International Bank',
      'Zenith Bank Gambia',
      'Access Bank Gambia',
    ],
    stockExchange: 'None',
    taxAuthority: 'Gambia Revenue Authority (GRA)',
    companiesAct: 'Companies Act 2013',
    recordRetention: '7 years',
    adjective: 'Gambian',
    demonym: 'Gambians',

    regulations: {
      annualReturnDeadline: 'Within 6 months after year-end',
      auditRequirement: {
        threshold: 'All limited liability companies',
        description: 'Annual statutory audit required for all limited companies registered in The Gambia',
      },
      taxFilingDeadline: '3 months after year-end for companies',
      minimumCapital: {
        privateCompany: 'D 1,000 minimum share capital',
        publicCompany: 'D 10,000 minimum share capital',
      },
      vatRegistrationThreshold: 'D 1,000,000 annual turnover',
      corporateTaxRate: '27% (standard rate)',
      withholdingTaxRate: '10% on dividends and interest, 15% on services',
    },
  },

  // ============================================================================
  // CULTURAL CONTEXT
  // ============================================================================
  culturalContext: {
    festivals: [
      {
        name: 'Independence Day',
        description: 'Celebrates independence from Britain in 1965',
        period: 'February 18',
      },
      {
        name: 'Koriteh (Eid al-Fitr)',
        description: 'End of Ramadan fasting period, one of the biggest Islamic celebrations',
        period: 'Based on Islamic calendar',
      },
      {
        name: 'Tobaski (Eid al-Adha)',
        description: 'Festival of Sacrifice, major Islamic celebration',
        period: 'Based on Islamic calendar',
      },
      {
        name: 'Roots Homecoming Festival',
        description: 'Celebrates Gambian heritage and connection to the African diaspora',
        period: 'May-June',
      },
      {
        name: 'Christmas',
        description: 'Christian celebration observed nationwide',
        period: 'December 25',
      },
    ],

    landmarks: [
      {
        name: 'Arch 22',
        location: 'Banjul',
        significance: 'Commemorates the 1994 military coup, 35m high arch with observation deck and museum',
        type: 'historical',
      },
      {
        name: 'Kachikally Crocodile Pool',
        location: 'Bakau',
        significance: 'Sacred crocodile pool believed to have fertility powers, important cultural site',
        type: 'historical',
      },
      {
        name: 'Kunta Kinteh Island (James Island)',
        location: 'Gambia River',
        significance: 'UNESCO World Heritage Site, former slave trading post from "Roots"',
        type: 'historical',
      },
      {
        name: 'Stone Circles of Senegambia',
        location: 'Central River Region',
        significance: 'UNESCO World Heritage Site, megalithic stone circles dating to 3rd century BC',
        type: 'historical',
      },
      {
        name: 'Abuko Nature Reserve',
        location: 'Western Division',
        significance: 'First official nature reserve in The Gambia, diverse wildlife and ecosystems',
        type: 'natural',
      },
      {
        name: 'Bijilo Forest Park',
        location: 'Coastal region',
        significance: 'Wildlife sanctuary known for monkey population',
        type: 'natural',
      },
    ],

    historicalFigures: [
      {
        name: 'Sir Dawda Kairaba Jawara',
        achievement: 'First President and independence leader of The Gambia',
        period: '1924-2019',
        significance: 'Led The Gambia to independence in 1965, served as Prime Minister then President for 30 years',
      },
      {
        name: 'Kunta Kinteh',
        achievement: 'Symbol of resistance against slavery',
        period: '18th century',
        significance: 'Enslaved African whose life story was told in Alex Haley\'s "Roots", representing millions affected by slave trade',
      },
      {
        name: 'Adama Barrow',
        achievement: 'Current President, led democratic transition',
        period: '1965-present',
        significance: 'Elected 2016, ended 22-year authoritarian rule peacefully through democratic process',
      },
      {
        name: 'Bai Bureh',
        achievement: 'Legendary warrior chief',
        period: '1840-1908',
        significance: 'Resisted British colonialism in Sierra Leone, remembered in Gambian history',
      },
    ],

    commonFoods: [
      'Domoda (Peanut Stew)',
      'Benachin (Jollof Rice)',
      'Yassa (Onion and Lemon Chicken or Fish)',
      'Superkanja (Okra Stew)',
      'Plasas (Cassava Leaf Stew)',
      'Afra (Grilled Meat)',
      'Tapalapa (Local Bread)',
      'Thieboudienne (Fish and Rice)',
    ],

    institutions: [
      {
        name: 'Central Bank of The Gambia',
        abbreviation: 'CBG',
        type: 'economic',
        description: 'Central bank responsible for monetary policy and currency issuance',
      },
      {
        name: 'Gambia Revenue Authority',
        abbreviation: 'GRA',
        type: 'government',
        description: 'Tax collection and revenue management authority',
      },
      {
        name: 'Gambia Bureau of Statistics',
        abbreviation: 'GBoS',
        type: 'government',
        description: 'National statistics office providing economic and social data',
      },
      {
        name: 'Ministry of Basic and Secondary Education',
        abbreviation: 'MoBSE',
        type: 'government',
        description: 'Oversees education policy, curriculum, and school management',
      },
      {
        name: 'University of The Gambia',
        abbreviation: 'UTG',
        type: 'educational',
        description: 'National university providing tertiary education',
      },
    ],

    resources: [
      {
        name: 'Groundnuts (Peanuts)',
        type: 'agricultural',
        regions: ['Central River', 'Upper River', 'North Bank'],
        significance: 'Historically main export crop, still major agricultural product for rural income',
      },
      {
        name: 'Tourism',
        type: 'agricultural',
        regions: ['Coastal areas', 'Banjul', 'Bakau'],
        significance: 'Known as "Smiling Coast of Africa", major foreign exchange earner with beaches and wildlife',
      },
      {
        name: 'Fisheries',
        type: 'agricultural',
        regions: ['Atlantic coast', 'Gambia River'],
        significance: 'Important for food security and export, employs significant coastal population',
      },
      {
        name: 'Re-export Trade',
        type: 'agricultural',
        regions: ['Banjul port', 'Border regions'],
        significance: 'Transit trade to Senegal and wider West Africa, important revenue source',
      },
      {
        name: 'Cashew Nuts',
        type: 'agricultural',
        regions: ['Central River', 'Upper River'],
        significance: 'Growing export crop diversifying from groundnuts',
      },
    ],

    traditionalDress: [
      'Grand Boubou',
      'Tie-dye fabric',
      'Kaftan',
      'Wrapper and Headtie',
      'Dashiki',
    ],

    music: [
      'Mbalax',
      'Afrobeat',
      'Kora Music (traditional)',
      'Reggae',
      'Hip-hop',
      'Gospel',
    ],

    sports: [
      'Football (Soccer)',
      'Wrestling',
      'Basketball',
      'Athletics',
      'Volleyball',
    ],
  },

  // ============================================================================
  // LOCALIZATION RULES
  // ============================================================================
  localizationRules: {
    ...DEFAULT_LOCALIZATION_RULES,
    phoneFormat: '+220 XXX XXXX',
    addressFormat: ['house_number', 'street', 'area', 'city', 'region', 'the-gambia'],
  },

  // ============================================================================
  // STATUS & METADATA
  // ============================================================================
  status: 'active',
  launchDate: '2025-12-18',
  priority: 5, // Fifth country after Ghana, Nigeria, Sierra Leone, and Liberia
  supportEmail: 'support@smartclass24.com',
  supportPhone: '+220 XXX XXXX', // The Gambia phone code

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

export const gambiaConfig = gambia;
export default gambia;
