/**
 * Country Configuration System
 * Defines the structure and interfaces for multi-country support
 * 
 * @module localization/country-config
 * @version 1.0.0
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Represents a festival or celebration in a country
 */
export interface Festival {
  name: string;
  description: string;
  period?: string; // e.g., "March", "Rainy Season"
}

/**
 * Represents a landmark or notable location
 */
export interface Landmark {
  name: string;
  location: string; // City or region
  significance: string;
  type: 'natural' | 'historical' | 'modern';
}

/**
 * Represents a historical figure
 */
export interface HistoricalFigure {
  name: string;
  achievement: string;
  period: string; // e.g., "1900-1972"
  significance: string;
}

/**
 * Represents an institution (government, educational, etc.)
 */
export interface Institution {
  name: string;
  abbreviation?: string;
  type: 'government' | 'educational' | 'economic' | 'health' | 'cultural';
  description?: string;
}

/**
 * Represents a natural resource
 */
export interface NaturalResource {
  name: string;
  type: 'mineral' | 'agricultural' | 'energy' | 'forest';
  regions?: string[]; // Where it's found
  significance?: string;
}

/**
 * Currency configuration
 */
export interface CurrencyConfig {
  code: string;        // ISO 4217 code (GHS, NGN)
  symbol: string;      // Currency symbol (₵, ₦)
  name: string;        // Full name (Cedis, Naira)
  subunit: string;     // Smallest unit (pesewas, kobo)
  subunitValue: number; // Subunits in main unit (100)
}

/**
 * Exam system configuration
 */
export interface ExamSystem {
  primary: string;      // Primary/JHS exit exam (BECE, JSCE)
  secondary: string;    // Secondary school exit exam (WASSCE, NECO)
  tertiary?: string;    // University entrance exam (JAMB, etc.)
  conductor: string;    // Exam conducting body (WAEC, NECO)
}

/**
 * Academic level configuration
 */
export interface AcademicLevel {
  name: string;         // Display name (Primary, JHS, JSS)
  officialName: string; // Official government name
  levels: string[];     // Year/class names
  duration: number;     // Years
  ageRange: string;     // Typical age range
}

/**
 * Academic structure for a country
 */
export interface AcademicStructure {
  primary: AcademicLevel;
  juniorSecondary: AcademicLevel;
  seniorSecondary: AcademicLevel;
}

/**
 * Language configuration
 */
export interface LanguageConfig {
  primary: string;      // Primary language of instruction
  official: string[];   // Official languages
  local: string[];      // Major local/indigenous languages
  examLanguages: string[]; // Languages available for exams
}

/**
 * Education board/ministry configuration
 */
export interface EducationBoard {
  name: string;
  abbreviation: string;
  website?: string;
  description?: string;
}

/**
 * Business and legal context for a country
 */
export interface BusinessContext {
  publicCompanies: string[];      // Listed companies for examples (MTN Nigeria, Dangote Cement, etc.)
  banks: string[];                // Major banks
  stockExchange: string;          // Stock exchange name
  taxAuthority: string;           // Tax authority name and abbreviation
  companiesAct: string;           // Companies Act reference
  recordRetention: string;        // Legal record retention period
  adjective: string;              // Country adjective (Ghanaian, Nigerian)
  demonym: string;                // People name (Ghanaians, Nigerians)
  
  // Regulatory requirements
  regulations: {
    annualReturnDeadline: string;      // e.g., "6 months after year-end"
    auditRequirement: {
      threshold?: string;               // e.g., "All companies", "Companies with turnover > ₦10M"
      description: string;
    };
    taxFilingDeadline: string;         // e.g., "6 months after year-end"
    minimumCapital: {
      privateCompany: string;           // e.g., "₦100,000"
      publicCompany: string;            // e.g., "₦2,000,000"
    };
    vatRegistrationThreshold: string;  // e.g., "₦25,000,000 annual turnover"
    corporateTaxRate: string;          // e.g., "30%"
    withholdingTaxRate: string;        // e.g., "10% on dividends"
  };
}

/**
 * Cultural context for a country
 */
export interface CulturalContext {
  festivals: Festival[];
  landmarks: Landmark[];
  historicalFigures: HistoricalFigure[];
  commonFoods: string[];
  institutions: Institution[];
  resources: NaturalResource[];
  traditionalDress?: string[];
  music?: string[]; // Music genres/styles
  sports?: string[]; // Popular sports
}

/**
 * Localization formatting rules
 */
export interface LocalizationRules {
  dateFormat: string;     // DD/MM/YYYY, MM/DD/YYYY
  timeFormat: '12h' | '24h';
  numberFormat: {
    decimalSeparator: '.' | ',';
    thousandsSeparator: ',' | '.' | ' ';
  };
  phoneFormat: string;    // +233 XX XXX XXXX
  addressFormat: string[]; // Order of address components
}

/**
 * Curriculum adjustments specific to a country
 */
export interface CurriculumAdjustments {
  // Syllabus variations
  excludedTopics?: string[];           // Topic slugs not in this country's curriculum
  additionalTopics?: string[];         // Topic slugs unique to this country
  renamedSubjects?: Record<string, string>; // Subject name mappings
  emphasizedTopics?: string[];         // Topics with more emphasis
  
  // Exam-specific content
  examBoard: string;                   // e.g., "WAEC Nigeria", "WAEC Ghana"
  hasCountrySpecificQuestions: boolean; // Does exam have country-specific sections?
  countrySpecificTopics?: string[];    // Topics that appear only in this country's exam
  
  // Content filters
  applicableCountries?: string[];      // If set, content only shows for these countries
  excludedCountries?: string[];        // If set, content hidden for these countries
  
  // Subject-specific adjustments
  subjectAdjustments?: {
    [subjectSlug: string]: {
      topicsOrder?: string[];          // Custom topic ordering
      additionalContent?: string[];    // Extra lessons/topics
      removedContent?: string[];       // Lessons/topics not taught
      weightage?: {                    // Exam weightage differences
        [topicSlug: string]: number;   // Percentage of exam
      };
    };
  };
}

/**
 * Main country configuration interface
 */
export interface CountryConfig {
  // Basic Information
  id: string;                    // Unique identifier (ghana, nigeria)
  name: string;                  // Full country name
  flag: string;                  // Flag emoji (🇬🇭)
  iso2: string;                  // ISO 3166-1 alpha-2 (GH)
  iso3: string;                  // ISO 3166-1 alpha-3 (GHA)
  
  // Geographic
  regions: string[];             // States/provinces/regions
  capital: string;               // Capital city
  majorCities: string[];         // Major cities
  timezone: string;              // Primary timezone (Africa/Accra)
  
  // Currency
  currency: CurrencyConfig;
  
  // Education System
  examSystem: ExamSystem;
  academicStructure: AcademicStructure;
  educationBoard: EducationBoard;
  
  // Language
  language: LanguageConfig;
  
  // Business Context
  businessContext: BusinessContext;
  
  // Cultural Context
  culturalContext: CulturalContext;
  
  // Localization Rules
  localizationRules: LocalizationRules;
  
  // Curriculum
  curriculumAdjustments?: CurriculumAdjustments;
  
  // Status & Metadata
  status: 'active' | 'beta' | 'coming_soon' | 'maintenance';
  launchDate: string;           // ISO date string
  priority: number;             // 1 = highest priority
  supportEmail?: string;
  supportPhone?: string;
  
  // Features
  features: {
    challengeArena: boolean;
    socialFeatures: boolean;
    offlineMode: boolean;
    parentMonitoring: boolean;
    aiTutor: boolean;
  };
}

// ============================================================================
// TEMPLATE VARIABLE TYPES
// ============================================================================

/**
 * Available template variable categories
 */
export type TemplateCategory =
  | 'currency'
  | 'exam'
  | 'landmark'
  | 'city'
  | 'business'
  | 'institution'
  | 'food'
  | 'festival'
  | 'figure'
  | 'resource'
  | 'level';

/**
 * Template variable with optional fallback
 */
export interface TemplateVariable {
  category: TemplateCategory;
  subcategory?: string; // e.g., 'primary', 'capital', 'lake'
  fallback?: string;
}

/**
 * Parsed template result
 */
export interface ParsedTemplate {
  original: string;
  variables: TemplateVariable[];
  hasVariables: boolean;
}

// ============================================================================
// LOCALIZATION LEVEL ENUM
// ============================================================================

/**
 * Defines how much localization a piece of content needs
 */
export enum LocalizationLevel {
  NONE = 0,           // No localization needed (universal formulas)
  LIGHT = 1,          // Only examples need localization
  MODERATE = 2,       // Context-aware localization
  HEAVY = 3,          // Significant country-specific content
  COMPLETE = 4        // Entirely country-specific content
}

// ============================================================================
// HELPER TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a country config is valid
 */
export function isValidCountryConfig(config: any): config is CountryConfig {
  return (
    config &&
    typeof config.id === 'string' &&
    typeof config.name === 'string' &&
    typeof config.flag === 'string' &&
    config.currency &&
    typeof config.currency.code === 'string' &&
    config.examSystem &&
    config.academicStructure &&
    config.status
  );
}

/**
 * Type guard to check if a country is active
 */
export function isActiveCountry(config: CountryConfig): boolean {
  return config.status === 'active' || config.status === 'beta';
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default localization rules (West African standard)
 */
export const DEFAULT_LOCALIZATION_RULES: LocalizationRules = {
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  numberFormat: {
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
  phoneFormat: '+XXX XX XXX XXXX',
  addressFormat: ['street', 'city', 'region', 'country'],
};

/**
 * Template variable regex pattern
 */
export const TEMPLATE_VARIABLE_PATTERN = /\{\{([^}]+)\}\}/g;

/**
 * Supported template categories
 */
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  'currency',
  'exam',
  'landmark',
  'city',
  'institution',
  'food',
  'festival',
  'figure',
  'resource',
  'level',
];
