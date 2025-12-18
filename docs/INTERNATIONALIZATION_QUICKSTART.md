# 🚀 Quick Start Guide - Internationalization

> **For Developers**: Get started with the internationalization system in 5 minutes

---

## 📋 Overview

SmartClass24 now supports multiple West African countries with automatic content localization. This guide shows you how to use the system.

---

## 🎯 Quick Reference

### Template Variables

Use these in your content to automatically localize:

```typescript
// Currency
"{{currency}}"           → ₵ (Ghana) | ₦ (Nigeria)
"{{currency:code}}"      → GHS | NGN
"{{currency:name}}"      → Cedis | Naira

// Exams
"{{exam:primary}}"       → BECE (Ghana) | JSCE (Nigeria)
"{{exam:secondary}}"     → WASSCE | WASSCE/NECO
"{{exam:tertiary}}"      → University Entrance | JAMB

// Academic Levels
"{{level:jhs}}"          → JHS (Ghana) | JSS (Nigeria)
"{{level:shs}}"          → SHS | SSS
"{{level:jhs:1}}"        → JHS 1 | JSS 1

// Locations
"{{city:capital}}"       → Accra | Lagos
"{{city:second}}"        → Kumasi | Kano
"{{landmark:lake}}"      → Lake Volta | Kainji Lake
"{{landmark:natural}}"   → Kakum National Park | Yankari National Park

// Cultural
"{{food:staple}}"        → Fufu | Pounded Yam
"{{festival:harvest}}"   → Homowo | Argungu Fishing Festival
"{{institution:central_bank}}" → Bank of Ghana | Central Bank of Nigeria

// Resources
"{{resource:mineral}}"   → Gold | Oil
"{{resource:agricultural}}" → Cocoa | Palm Oil
```

---

## 💻 For Developers

### 1. Reading Country Configuration

```typescript
import { ghanaConfig } from '@/lib/localization/countries/ghana';

// Access any country property
const currencySymbol = ghanaConfig.currency.symbol; // ₵
const primaryExam = ghanaConfig.examSystem.primary;  // BECE
const capital = ghanaConfig.capital;                 // Accra
const festivals = ghanaConfig.culturalContext.festivals;
```

### 2. Using Localization (Coming Soon - Day 2)

```typescript
// In your component
import { useLocalization } from '@/hooks/useLocalization';

function MyComponent() {
  const { country, formatCurrency, localizeText } = useLocalization();
  
  return (
    <div>
      <p>Price: {formatCurrency(100)}</p>
      {/* Renders: Price: ₵100 (Ghana) or Price: ₦100 (Nigeria) */}
      
      <p>Prepare for {country.examSystem.primary}</p>
      {/* Renders: Prepare for BECE (Ghana) or JSCE (Nigeria) */}
      
      <p>{localizeText("Study at {{city:capital}}")}</p>
      {/* Renders: Study at Accra (Ghana) or Lagos (Nigeria) */}
    </div>
  );
}
```

### 3. Creating Localized Content

#### Example 1: Math Word Problem

```typescript
const question = {
  text: `
    A trader bought goods for {{currency}}500 and sold them at
    {{city:capital}} market for {{currency}}650. Calculate the profit.
  `,
  // Will automatically render with local currency and city
};
```

#### Example 2: Science Lesson

```typescript
const lessonIntro = `
  {{landmark:natural}} is a perfect example of biodiversity.
  Located in the {{region:forest}} region, it demonstrates
  the importance of ecosystem conservation in {{country}}.
`;
// Ghana: "Kakum National Park is a perfect example..."
// Nigeria: "Yankari National Park is a perfect example..."
```

#### Example 3: Social Studies

```typescript
const content = {
  ghana: `The {{institution:central_bank}} manages monetary policy...`,
  nigeria: `The {{institution:central_bank}} manages monetary policy...`,
};
// Automatically uses correct institution name per country
```

---

## 📝 For Content Creators

### Writing Localizable Lessons

#### ✅ DO:
```typescript
// Use template variables
"If you buy items for {{currency}}100..."

// Use country-neutral concepts
"The central bank manages monetary policy"

// Provide country-specific variants when needed
content: {
  base: "Every country has a constitution",
  ghana: "Ghana's 1992 Constitution...",
  nigeria: "Nigeria's 1999 Constitution...",
}
```

#### ❌ DON'T:
```typescript
// Don't hardcode currency
"If you buy items for ₵100..." // BAD

// Don't hardcode locations
"Lake Volta is the largest lake..." // BAD - use {{landmark:lake}}

// Don't assume exam names
"Prepare for BECE" // BAD - use {{exam:primary}}
```

---

## 🎨 Content Localization Levels

### Level 1: Universal (No Localization)
Pure concepts that work everywhere:
- Mathematical formulas
- Scientific laws
- Grammar rules

```typescript
"The area of a circle = πr²" // Same everywhere
```

### Level 2: Light Localization (Examples Only)
Concept is universal, examples are local:

```typescript
"Percentage calculation: If an item costs {{currency}}100 and
you get a 20% discount, you save {{currency}}20"
```

### Level 3: Moderate Localization (Context-Aware)
Needs cultural/regional context:

```typescript
"{{landmark:natural}} attracts thousands of tourists annually,
contributing to {{country}}'s economy"
```

### Level 4: Heavy Localization (Country-Specific)
Significantly different per country:

```typescript
// Completely different content per country
history: {
  ghana: "Ghana gained independence on March 6, 1957...",
  nigeria: "Nigeria gained independence on October 1, 1960...",
}
```

### Level 5: Complete Separation (Entirely Different)
No shared content:

```typescript
// Different topics entirely
civics: {
  ghana: ["16 Regions", "District Assemblies", "Chieftaincy"],
  nigeria: ["36 States", "Local Governments", "Traditional Rulers"],
}
```

---

## 🔧 Utilities Reference

### Country Configuration

```typescript
import { isValidCountryConfig, isActiveCountry } from '@/lib/localization/country-config';

// Check if config is valid
if (isValidCountryConfig(config)) {
  // Use config
}

// Check if country is active
if (isActiveCountry(ghanaConfig)) {
  // Country is available to users
}
```

### Template Variables

```typescript
import { TEMPLATE_VARIABLE_PATTERN, TEMPLATE_CATEGORIES } from '@/lib/localization/country-config';

// Find all template variables in text
const text = "Price: {{currency}}100 at {{city:capital}}";
const matches = text.match(TEMPLATE_VARIABLE_PATTERN);
// Returns: ["{{currency}}", "{{city:capital}}"]

// All available categories
console.log(TEMPLATE_CATEGORIES);
// ['currency', 'exam', 'landmark', 'city', 'institution', ...]
```

---

## 🧪 Testing

### Test Your Content

```typescript
import { ghanaConfig } from '@/lib/localization/countries/ghana';
import { nigeriaConfig } from '@/lib/localization/countries/nigeria';

// Test lesson with both countries
const lesson = {
  text: "Visit {{landmark:lake}} in {{city:capital}}"
};

// Ghana
localizeLesson(lesson, ghanaConfig);
// "Visit Lake Volta in Accra"

// Nigeria
localizeLesson(lesson, nigeriaConfig);
// "Visit Kainji Lake in Lagos"
```

---

## 📚 Country Data Reference

### Ghana Quick Facts
- **Currency**: ₵ (GHS)
- **Primary Exam**: BECE
- **Secondary Exam**: WASSCE
- **Levels**: Primary, JHS, SHS
- **Regions**: 16
- **Capital**: Accra

### Nigeria Quick Facts (Coming Soon)
- **Currency**: ₦ (NGN)
- **Primary Exam**: JSCE
- **Secondary Exam**: WASSCE/NECO
- **Levels**: Primary, JSS, SSS
- **States**: 36
- **Capital**: Abuja (Administrative), Lagos (Commercial)

---

## 🐛 Common Issues

### Issue: Template not replacing
**Problem**: `{{currency}}` showing as-is
**Solution**: Ensure you're using `localizeText()` or content adapter

### Issue: Wrong currency symbol
**Problem**: Showing ₵ for Nigerian content
**Solution**: Check user's country setting in localization context

### Issue: Content not updating after country switch
**Problem**: Cached content still showing old country
**Solution**: Clear localized content cache on country change

---

## 📞 Need Help?

- **Documentation**: See [`INTERNATIONALIZATION_STRATEGY.md`](./INTERNATIONALIZATION_STRATEGY.md)
- **Examples**: Check lesson intro components in `src/components/lesson-intros/`
- **Issues**: Report in #internationalization Slack channel
- **Questions**: Ask the development team

---

## 🎯 Next Steps

1. **Read**: Full strategy document
2. **Explore**: Ghana configuration file
3. **Practice**: Create a localized component
4. **Test**: Try with different countries
5. **Contribute**: Add content or improve configs

---

## ✅ Checklist for New Content

- [ ] Used template variables for currency
- [ ] Used template variables for exam names
- [ ] Used template variables for locations
- [ ] Tested with Ghana configuration
- [ ] Tested with Nigeria configuration (when available)
- [ ] No hardcoded country-specific references
- [ ] Content makes sense in all target countries
- [ ] Cultural sensitivity reviewed

---

**Last Updated**: December 18, 2025  
**Version**: 1.0.0  
**Status**: Active Development

---

*Making education relevant for every West African student.* 🌍
