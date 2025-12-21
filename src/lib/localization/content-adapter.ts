/**
 * Content Adapter
 * Transforms base content to localized versions based on country configuration
 * 
 * @module localization/content-adapter
 * @version 1.0.0
 */

import type { CountryConfig, TemplateCategory, ParsedTemplate } from './country-config';
import { TEMPLATE_VARIABLE_PATTERN } from './country-config';

// ============================================================================
// TEMPLATE PARSING
// ============================================================================

/**
 * Parse template variables from text
 * 
 * @param text - Text containing template variables
 * @returns Parsed template information
 * 
 * @example
 * ```typescript
 * const result = parseTemplateVariables("Cost: {{currency}}100");
 * // { original: "...", variables: [...], hasVariables: true }
 * ```
 */
export function parseTemplateVariables(text: string): ParsedTemplate {
  const matches = text.match(TEMPLATE_VARIABLE_PATTERN) || [];
  
  const variables = matches.map((match) => {
    // Remove {{ and }}
    const content = match.slice(2, -2).trim();
    const [category, subcategory] = content.split(':');
    
    return {
      category: category as TemplateCategory,
      subcategory: subcategory || undefined,
      fallback: undefined,
    };
  });
  
  return {
    original: text,
    variables,
    hasVariables: variables.length > 0,
  };
}

// ============================================================================
// CONTENT LOCALIZATION
// ============================================================================

/**
 * Localize text by replacing template variables with country-specific values
 * 
 * @param text - Text with template variables
 * @param country - Country configuration
 * @returns Localized text
 * 
 * @example
 * ```typescript
 * const text = "Price: {{currency}}100 at {{city:capital}}";
 * const localized = localizeText(text, ghanaConfig);
 * // "Price: {{currency}}100 at {{city:capital}}"
 * ```
 */
export function localizeText(text: string, country: CountryConfig): string {
  if (!text) return text;
  
  return text.replace(TEMPLATE_VARIABLE_PATTERN, (match) => {
    const content = match.slice(2, -2).trim();
    const [category, subcategory] = content.split(':');
    
    return resolveTemplateVariable(category as TemplateCategory, subcategory, country);
  });
}

/**
 * Resolve a single template variable to its country-specific value
 * 
 * @param category - Template category (currency, exam, etc.)
 * @param subcategory - Optional subcategory (e.g., 'primary', 'capital')
 * @param country - Country configuration
 * @returns Resolved value or original placeholder if not found
 */
export function resolveTemplateVariable(
  category: TemplateCategory,
  subcategory: string | undefined,
  country: CountryConfig
): string {
  switch (category) {
    case 'currency':
      return resolveCurrency(subcategory, country);
    
    case 'exam':
      return resolveExam(subcategory, country);
    
    case 'level':
      return resolveLevel(subcategory, country);
    
    case 'city':
      return resolveCity(subcategory, country);
    
    case 'business':
      return resolveBusiness(subcategory, country);
    
    case 'landmark':
      return resolveLandmark(subcategory, country);
    
    case 'institution':
      return resolveInstitution(subcategory, country);
    
    case 'food':
      return resolveFood(subcategory, country);
    
    case 'festival':
      return resolveFestival(subcategory, country);
    
    case 'figure':
      return resolveHistoricalFigure(subcategory, country);
    
    case 'resource':
      return resolveResource(subcategory, country);
    
    default:
      return `{{${category}${subcategory ? ':' + subcategory : ''}}}`;
  }
}

// ============================================================================
// CATEGORY RESOLVERS
// ============================================================================

/**
 * Resolve currency template
 */
function resolveCurrency(subcategory: string | undefined, country: CountryConfig): string {
  switch (subcategory) {
    case 'code':
      return country.currency.code;
    case 'name':
      return country.currency.name;
    case 'subunit':
      return country.currency.subunit;
    default:
      return country.currency.symbol;
  }
}

/**
 * Resolve exam template
 */
function resolveExam(subcategory: string | undefined, country: CountryConfig): string {
  switch (subcategory) {
    case 'primary':
      return country.examSystem.primary;
    case 'secondary':
      return country.examSystem.secondary;
    case 'tertiary':
      return country.examSystem.tertiary || 'University Entrance';
    case 'conductor':
      return country.examSystem.conductor;
    default:
      return country.examSystem.secondary; // Default to main exam
  }
}

/**
 * Resolve academic level template
 */
function resolveLevel(subcategory: string | undefined, country: CountryConfig): string {
  if (!subcategory) return country.academicStructure.juniorSecondary.name;
  
  const [level, year] = subcategory.split(':');
  
  switch (level) {
    case 'primary':
      return year 
        ? country.academicStructure.primary.levels[parseInt(year) - 1] || country.academicStructure.primary.name
        : country.academicStructure.primary.name;
    
    case 'jhs':
    case 'jss':
      return year
        ? country.academicStructure.juniorSecondary.levels[parseInt(year) - 1] || country.academicStructure.juniorSecondary.name
        : country.academicStructure.juniorSecondary.name;
    
    case 'shs':
    case 'sss':
      return year
        ? country.academicStructure.seniorSecondary.levels[parseInt(year) - 1] || country.academicStructure.seniorSecondary.name
        : country.academicStructure.seniorSecondary.name;
    
    default:
      return country.academicStructure.juniorSecondary.name;
  }
}

/**
 * Resolve city template
 */
function resolveCity(subcategory: string | undefined, country: CountryConfig): string {
  switch (subcategory) {
    case 'capital':
      return country.capital;
    case 'second':
    case '2nd':
      return country.majorCities[1] || country.majorCities[0];
    case 'major':
      return country.majorCities[Math.floor(Math.random() * country.majorCities.length)];
    default:
      return country.capital;
  }
}

/**
 * Resolve business template
 */
function resolveBusiness(subcategory: string | undefined, country: CountryConfig): string {
  if (!subcategory) {
    return country.businessContext.publicCompanies[0] || 'Business';
  }
  
  const [type, index] = subcategory.split(':');
  const idx = index ? parseInt(index) - 1 : 0;
  
  switch (type) {
    case 'tax-authority':
      return country.businessContext.taxAuthority;
    
    case 'companies-act':
      return country.businessContext.companiesAct;
    
    case 'record-retention':
      return country.businessContext.recordRetention;
    
    case 'stock-exchange':
      return country.businessContext.stockExchange;
    
    case 'company':
      return country.businessContext.publicCompanies[idx % country.businessContext.publicCompanies.length] || 'Company';
    
    case 'bank':
      return country.businessContext.banks[idx % country.businessContext.banks.length] || 'Bank';
    
    case 'accounting-body':
      return country.id === 'ghana' ? 'ICAG' :
             country.id === 'nigeria' ? 'ICAN' :
             country.id === 'kenya' ? 'ICPAK' :
             'Professional Accounting Body';
    
    case 'audit-firm':
      return 'KPMG'; // Big 4 firms are global
    
    case 'accounting-standards':
      return 'IFRS'; // International Financial Reporting Standards
    
    default:
      return country.businessContext.publicCompanies[0] || 'Business';
  }
}

/**
 * Resolve landmark template
 */
function resolveLandmark(subcategory: string | undefined, country: CountryConfig): string {
  const landmarks = country.culturalContext.landmarks;
  
  if (!subcategory) {
    return landmarks[0]?.name || country.capital;
  }
  
  // Filter by type
  const filtered = landmarks.filter((l) => l.type === subcategory);
  
  if (filtered.length > 0) {
    return filtered[0].name;
  }
  
  // Special cases
  switch (subcategory) {
    case 'lake':
      const lake = landmarks.find((l) => l.name.toLowerCase().includes('lake'));
      return lake?.name || landmarks[0]?.name || 'the lake';
    
    case 'park':
      const park = landmarks.find((l) => l.name.toLowerCase().includes('park'));
      return park?.name || landmarks[0]?.name || 'the park';
    
    case 'famous':
      return landmarks[0]?.name || country.capital;
    
    default:
      return landmarks[0]?.name || country.capital;
  }
}

/**
 * Resolve institution template
 */
function resolveInstitution(subcategory: string | undefined, country: CountryConfig): string {
  const institutions = country.culturalContext.institutions;
  
  if (!subcategory) {
    return institutions[0]?.name || 'the institution';
  }
  
  // Filter by type or search by name
  const found = institutions.find(
    (i) => i.type === subcategory || i.abbreviation?.toLowerCase() === subcategory.toLowerCase()
  );
  
  if (found) {
    return found.name;
  }
  
  // Special cases
  switch (subcategory) {
    case 'central_bank':
    case 'bank':
      const bank = institutions.find((i) => i.name.toLowerCase().includes('bank'));
      return bank?.name || 'Central Bank';
    
    case 'statistics':
    case 'stats':
      const stats = institutions.find((i) => i.name.toLowerCase().includes('statistic'));
      return stats?.name || 'Statistics Office';
    
    default:
      return institutions[0]?.name || 'the institution';
  }
}

/**
 * Resolve food template
 */
function resolveFood(subcategory: string | undefined, country: CountryConfig): string {
  const foods = country.culturalContext.commonFoods;
  
  if (!subcategory) {
    return foods[0] || 'local cuisine';
  }
  
  // Search for matching food
  const found = foods.find((f) => f.toLowerCase().includes(subcategory.toLowerCase()));
  
  if (found) {
    return found;
  }
  
  // Fallback to first or random
  switch (subcategory) {
    case 'staple':
    case 'main':
      return foods[0] || 'local cuisine';
    case 'random':
      return foods[Math.floor(Math.random() * foods.length)];
    default:
      return foods[0] || 'local cuisine';
  }
}

/**
 * Resolve festival template
 */
function resolveFestival(subcategory: string | undefined, country: CountryConfig): string {
  const festivals = country.culturalContext.festivals;
  
  if (!subcategory) {
    return festivals[0]?.name || 'the festival';
  }
  
  // Search for matching festival
  const found = festivals.find((f) => 
    f.name.toLowerCase().includes(subcategory.toLowerCase()) ||
    f.description.toLowerCase().includes(subcategory.toLowerCase())
  );
  
  return found?.name || festivals[0]?.name || 'the festival';
}

/**
 * Resolve historical figure template
 */
function resolveHistoricalFigure(subcategory: string | undefined, country: CountryConfig): string {
  const figures = country.culturalContext.historicalFigures;
  
  if (!subcategory) {
    return figures[0]?.name || 'historical figure';
  }
  
  // Search for matching figure
  const found = figures.find((f) =>
    f.name.toLowerCase().includes(subcategory.toLowerCase()) ||
    f.achievement.toLowerCase().includes(subcategory.toLowerCase())
  );
  
  return found?.name || figures[0]?.name || 'historical figure';
}

/**
 * Resolve resource template
 */
function resolveResource(subcategory: string | undefined, country: CountryConfig): string {
  const resources = country.culturalContext.resources;
  
  if (!subcategory) {
    return resources[0]?.name || 'natural resource';
  }
  
  // Filter by type
  const filtered = resources.filter((r) => r.type === subcategory);
  
  if (filtered.length > 0) {
    return filtered[0].name;
  }
  
  // Search by name
  const found = resources.find((r) => 
    r.name.toLowerCase().includes(subcategory.toLowerCase())
  );
  
  return found?.name || resources[0]?.name || 'natural resource';
}

// ============================================================================
// BATCH LOCALIZATION
// ============================================================================

/**
 * Localize multiple text strings at once
 * 
 * @param texts - Array of texts to localize
 * @param country - Country configuration
 * @returns Array of localized texts
 */
export function localizeTexts(texts: string[], country: CountryConfig): string[] {
  return texts.map((text) => localizeText(text, country));
}

/**
 * Localize an object with template variables in its string values
 * 
 * @param obj - Object with string values
 * @param country - Country configuration
 * @returns New object with localized values
 */
export function localizeObject<T extends Record<string, any>>(
  obj: T,
  country: CountryConfig
): T {
  const result: any = {};
  
  for (const key in obj) {
    const value = obj[key];
    
    if (typeof value === 'string') {
      result[key] = localizeText(value, country);
    } else if (Array.isArray(value)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result[key] = value.map((item: any) =>
        typeof item === 'string' ? localizeText(item, country) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      result[key] = localizeObject(value, country);
    } else {
      result[key] = value;
    }
  }
  
  return result as T;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate that all template variables in text can be resolved
 * 
 * @param text - Text to validate
 * @param country - Country configuration
 * @returns Object with validation result and any errors
 */
export function validateTemplateVariables(
  text: string,
  country: CountryConfig
): { valid: boolean; errors: string[] } {
  const parsed = parseTemplateVariables(text);
  const errors: string[] = [];
  
  for (const variable of parsed.variables) {
    const resolved = resolveTemplateVariable(
      variable.category,
      variable.subcategory,
      country
    );
    
    // Check if resolution failed (returned placeholder)
    if (resolved.startsWith('{{') && resolved.endsWith('}}')) {
      errors.push(`Cannot resolve: ${resolved}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  parseTemplateVariables,
  localizeText,
  localizeTexts,
  localizeObject,
  resolveTemplateVariable,
  validateTemplateVariables,
};
