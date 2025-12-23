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
  
  // Additional business context tokens (with smart fallbacks)
  result = result.replace(/\{\{business:accounting-body\}\}/gi, 
    country.id === 'ghana' ? 'ICAG' :
    country.id === 'nigeria' ? 'ICAN' :
    country.id === 'kenya' ? 'ICPAK' :
    'Professional Accounting Body'
  );
  result = result.replace(/\{\{business:audit-firm\}\}/gi, 
    'KPMG' // Big 4 firms are global
  );
  result = result.replace(/\{\{business:accounting-standards\}\}/gi, 
    'IFRS' // International Financial Reporting Standards are used across West Africa
  );
  
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

  // Cities
  result = result.replace(/\{\{city:capital\}\}/gi, country.capital);
  if (country.majorCities && country.majorCities.length > 0) {
    result = result.replace(/\{\{city:major\}\}/gi, country.majorCities[0]);
  }

  // Foods (common foods from cultural context)
  if (country.culturalContext?.commonFoods && country.culturalContext.commonFoods.length > 0) {
    const foods = country.culturalContext.commonFoods;
    // Replace {{food:rice}}, {{food:staple}}, {{food:popular}} with actual foods
    const foodMatches = result.match(/\{\{food:([^}]+)\}\}/gi);
    if (foodMatches) {
      const foodMap: Record<string, number> = {};
      foodMatches.forEach((match) => {
        const typeMatch = match.match(/\{\{food:([^}]+)\}\}/i);
        if (typeMatch) {
          const type = typeMatch[1].toLowerCase();
          if (!foodMap[type]) {
            foodMap[type] = 0;
          }
          const index = (foodMap[type]++) % foods.length;
          result = result.replace(match, foods[index], 'g');
        }
      });
    }
  }

  // Festivals (cultural celebrations)
  if (country.culturalContext?.festivals && country.culturalContext.festivals.length > 0) {
    const festivals = country.culturalContext.festivals;
    const festivalMatches = result.match(/\{\{festival:([^}]+)\}\}/gi);
    if (festivalMatches) {
      festivalMatches.forEach((match) => {
        const typeMatch = match.match(/\{\{festival:([^}]+)\}\}/i);
        if (typeMatch) {
          const type = typeMatch[1].toLowerCase();
          // Find a festival that matches the type or use random one
          const festival = festivals.find(f => 
            f.name.toLowerCase().includes(type) || 
            f.description.toLowerCase().includes(type) ||
            (type === 'harvest' && f.description.toLowerCase().includes('harvest')) ||
            (type === 'independence' && f.name.toLowerCase().includes('independence'))
          ) || festivals[Math.floor(Math.random() * festivals.length)];
          result = result.replace(match, festival.name);
        }
      });
    }
  }

  // Landmarks
  if (country.culturalContext?.landmarks && country.culturalContext.landmarks.length > 0) {
    const landmarks = country.culturalContext.landmarks;
    const landmarkMatches = result.match(/\{\{landmark:([^}]+)\}\}/gi);
    if (landmarkMatches) {
      landmarkMatches.forEach((match) => {
        const typeMatch = match.match(/\{\{landmark:([^}]+)\}\}/i);
        if (typeMatch) {
          const type = typeMatch[1].toLowerCase();
          // Find a landmark that matches the type or use first one
          const landmark = landmarks.find(l => 
            l.type === type || 
            l.name.toLowerCase().includes(type) ||
            l.significance.toLowerCase().includes(type)
          ) || landmarks[0];
          result = result.replace(match, landmark.name);
        }
      });
    }
  }

  // Resources (natural resources, minerals, agricultural products)
  if (country.culturalContext?.resources && country.culturalContext.resources.length > 0) {
    const resources = country.culturalContext.resources;
    const resourceMatches = result.match(/\{\{resource:([^}]+)\}\}/gi);
    if (resourceMatches) {
      const resourceMap: Record<string, number> = {};
      resourceMatches.forEach((match) => {
        const typeMatch = match.match(/\{\{resource:([^}]+)\}\}/i);
        if (typeMatch) {
          const type = typeMatch[1].toLowerCase();
          // Map common resource keys to actual resources
          let selectedResource;
          switch (type) {
            case 'mineral':
              selectedResource = resources.find(r => r.type === 'mineral') || resources[0];
              break;
            case 'agricultural':
            case 'agricultural_product':
            case 'cash_crop':
              selectedResource = resources.find(r => r.type === 'agricultural') || resources[0];
              break;
            case 'energy':
              selectedResource = resources.find(r => r.type === 'energy') || resources[0];
              break;
            case 'forest':
            case 'timber':
              selectedResource = resources.find(r => r.type === 'forest') || resources[0];
              break;
            default:
              // Find resource matching the type name or use random
              if (!resourceMap[type]) {
                resourceMap[type] = 0;
              }
              const index = (resourceMap[type]++) % resources.length;
              selectedResource = resources[index];
          }
          result = result.replace(match, selectedResource.name);
        }
      });
    }
  }

  // Historical figures
  if (country.culturalContext?.historicalFigures && country.culturalContext.historicalFigures.length > 0) {
    const figures = country.culturalContext.historicalFigures;
    const figureMatches = result.match(/\{\{figure:([^}]+)\}\}/gi);
    if (figureMatches) {
      figureMatches.forEach((match) => {
        // Extract the type from {{figure:independence}}
        const typeMatch = match.match(/\{\{figure:([^}]+)\}\}/i);
        if (typeMatch) {
          const type = typeMatch[1].toLowerCase();
          // Find a figure that matches the type or use first one
          const figure = figures.find(f => 
            f.significance.toLowerCase().includes(type) || 
            f.achievement.toLowerCase().includes(type)
          ) || figures[0];
          result = result.replace(match, figure.name);
        }
      });
    }
  }

  // Institutions
  if (country.culturalContext?.institutions && country.culturalContext.institutions.length > 0) {
    const institutions = country.culturalContext.institutions;
    const institutionMatches = result.match(/\{\{institution:([^}]+)\}\}/gi);
    if (institutionMatches) {
      institutionMatches.forEach((match) => {
        const typeMatch = match.match(/\{\{institution:([^}]+)\}\}/i);
        if (typeMatch) {
          const type = typeMatch[1].toLowerCase();
          // Find an institution that matches the type or use first one
          const institution = institutions.find(i => 
            i.type === type || 
            i.name.toLowerCase().includes(type) ||
            i.abbreviation?.toLowerCase().includes(type)
          ) || institutions[0];
          result = result.replace(match, institution.name);
        }
      });
    }
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
