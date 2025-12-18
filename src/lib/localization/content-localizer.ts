/**
 * Content Localization Utility
 * Recursively processes objects and arrays to localize all template variables
 */

import type { CountryConfig } from './country-config';

/**
 * Recursively localizes all string values in an object or array
 * Processes template variables like {{country}}, {{currency}}, etc.
 */
export function localizeObject<T>(obj: T, country: CountryConfig): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => localizeObject(item, country)) as T;
  }

  // Handle objects
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = localizeObject((obj as any)[key], country);
      }
    }
    return result as T;
  }

  // Handle strings - apply localization
  if (typeof obj === 'string') {
    return localizeString(obj, country) as T;
  }

  // Return primitives as-is
  return obj;
}

/**
 * Localizes a single string by replacing template variables
 */
export function localizeString(text: string, country: CountryConfig): string {
  if (!text || typeof text !== 'string') return text;

  let result = text;

  // Handle country-specific choice syntax: {{country:ghana=X|nigeria=Y|default=Z}}
  const countryChoiceRegex = /\{\{country:([^}]+)\}\}/gi;
  result = result.replace(countryChoiceRegex, (match, choices) => {
    // Parse choices like "ghana=Integrated Science|nigeria=Basic Science|default=Basic Science"
    const choiceMap: Record<string, string> = {};
    const parts = choices.split('|');
    
    parts.forEach((part: string) => {
      const [key, value] = part.split('=');
      if (key && value) {
        choiceMap[key.trim().toLowerCase()] = value.trim();
      }
    });
    
    // Try to find match for current country
    const countryId = country.id.toLowerCase();
    if (choiceMap[countryId]) {
      return choiceMap[countryId];
    }
    
    // Fall back to default if specified
    if (choiceMap['default']) {
      return choiceMap['default'];
    }
    
    // If no match and no default, return first value
    return Object.values(choiceMap)[0] || match;
  });

  // Country basic info
  result = result.replace(/\{\{country\}\}/gi, country.name);
  result = result.replace(/\{\{country:name\}\}/gi, country.name);
  result = result.replace(/\{\{country:capital\}\}/gi, country.capital);
  result = result.replace(/\{\{country:flag\}\}/gi, country.flag);
  result = result.replace(/\{\{country:adjective\}\}/gi, country.businessContext.adjective);
  result = result.replace(/\{\{country:demonym\}\}/gi, country.businessContext.demonym);

  // Currency
  result = result.replace(/\{\{currency\}\}/gi, country.currency.symbol);
  result = result.replace(/\{\{currency:symbol\}\}/gi, country.currency.symbol);
  result = result.replace(/\{\{currency:code\}\}/gi, country.currency.code);
  result = result.replace(/\{\{currency:name\}\}/gi, country.currency.name);
  result = result.replace(/\{\{currency:subunit\}\}/gi, country.currency.subunit);

  // Exam systems
  result = result.replace(/\{\{exam:primary\}\}/gi, country.examSystem.primary);
  result = result.replace(/\{\{exam:secondary\}\}/gi, country.examSystem.secondary);
  result = result.replace(/\{\{exam:conductor\}\}/gi, country.examSystem.conductor);

  // Academic levels
  result = result.replace(/\{\{level:primary\}\}/gi, country.academicStructure.primary.name);
  result = result.replace(/\{\{level:junior\}\}/gi, country.academicStructure.juniorSecondary.name);
  result = result.replace(/\{\{level:senior\}\}/gi, country.academicStructure.seniorSecondary.name);

  // Business context
  result = result.replace(/\{\{business:tax-authority\}\}/gi, country.businessContext.taxAuthority);
  result = result.replace(/\{\{business:companies-act\}\}/gi, country.businessContext.companiesAct);
  result = result.replace(/\{\{business:record-retention\}\}/gi, country.businessContext.recordRetention);
  result = result.replace(/\{\{business:stock-exchange\}\}/gi, country.businessContext.stockExchange);
  
  // Regulatory requirements
  result = result.replace(/\{\{regulation:annual-return-deadline\}\}/gi, country.businessContext.regulations.annualReturnDeadline);
  result = result.replace(/\{\{regulation:audit-threshold\}\}/gi, country.businessContext.regulations.auditRequirement.threshold || '');
  result = result.replace(/\{\{regulation:audit-description\}\}/gi, country.businessContext.regulations.auditRequirement.description);
  result = result.replace(/\{\{regulation:tax-filing-deadline\}\}/gi, country.businessContext.regulations.taxFilingDeadline);
  result = result.replace(/\{\{regulation:min-capital-private\}\}/gi, country.businessContext.regulations.minimumCapital.privateCompany);
  result = result.replace(/\{\{regulation:min-capital-public\}\}/gi, country.businessContext.regulations.minimumCapital.publicCompany);
  result = result.replace(/\{\{regulation:vat-threshold\}\}/gi, country.businessContext.regulations.vatRegistrationThreshold);
  result = result.replace(/\{\{regulation:corporate-tax-rate\}\}/gi, country.businessContext.regulations.corporateTaxRate);
  result = result.replace(/\{\{regulation:withholding-tax\}\}/gi, country.businessContext.regulations.withholdingTaxRate);
  
  // Business examples (random selection for variety)
  if (country.businessContext.publicCompanies.length > 0) {
    // For template like {{business:company}} or {{business:company:1}}, {{business:company:2}}
    const companyMatches = result.match(/\{\{business:company(?::(\d+))?\}\}/gi);
    if (companyMatches) {
      companyMatches.forEach((match) => {
        const indexMatch = match.match(/:(\d+)/);
        const index = indexMatch ? parseInt(indexMatch[1]) - 1 : 0;
        const company = country.businessContext.publicCompanies[index % country.businessContext.publicCompanies.length];
        result = result.replace(match, company);
      });
    }
  }
  
  if (country.businessContext.banks.length > 0) {
    const bankMatches = result.match(/\{\{business:bank(?::(\d+))?\}\}/gi);
    if (bankMatches) {
      bankMatches.forEach((match) => {
        const indexMatch = match.match(/:(\d+)/);
        const index = indexMatch ? parseInt(indexMatch[1]) - 1 : 0;
        const bank = country.businessContext.banks[index % country.businessContext.banks.length];
        result = result.replace(match, bank);
      });
    }
  }

  // Regions (first region as example, or handle differently)
  if (country.regions && country.regions.length > 0) {
    result = result.replace(/\{\{region:example\}\}/gi, country.regions[0]);
  }

  // Cities (capital or first major city)
  if (country.majorCities && country.majorCities.length > 0) {
    result = result.replace(/\{\{city:major\}\}/gi, country.majorCities[0]);
  }

  return result;
}

/**
 * Deep clone and localize a lesson object
 * Use this when retrieving lesson data to ensure all content is localized
 */
export function localizeLesson(lesson: any, country: CountryConfig): any {
  // Deep clone first to avoid mutating the original
  const cloned = JSON.parse(JSON.stringify(lesson));
  
  // Recursively localize all content
  return localizeObject(cloned, country);
}

/**
 * Batch localize multiple lessons
 */
export function localizeLessons(lessons: any[], country: CountryConfig): any[] {
  return lessons.map(lesson => localizeLesson(lesson, country));
}
