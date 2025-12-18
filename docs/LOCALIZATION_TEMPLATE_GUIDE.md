# Scalable Localization Template Variables Guide

## Overview
This guide documents all available template variables for creating country-agnostic content that automatically adapts to each West African country (Ghana, Nigeria, Sierra Leone, Liberia, Gambia).

## How It Works
Template variables like `{{country}}` or `{{currency}}` are automatically replaced with country-specific values when content is retrieved using `useLocalizedLesson` hook. The `content-localizer` utility recursively processes all strings in lesson objects.

---

## Template Variable Categories

### 1. Basic Country Information

| Template Variable | Ghana Example | Nigeria Example | Description |
|------------------|---------------|-----------------|-------------|
| `{{country}}` | Ghana | Nigeria | Country name |
| `{{country:name}}` | Ghana | Nigeria | Same as {{country}} |
| `{{country:flag}}` | 🇬🇭 | 🇳🇬 | Flag emoji |
| `{{country:capital}}` | Accra | Abuja | Capital city |
| `{{country:adjective}}` | Ghanaian | Nigerian | Country adjective |
| `{{country:demonym}}` | Ghanaians | Nigerians | People name |

### 2. Currency

| Template Variable | Ghana Example | Nigeria Example | Description |
|------------------|---------------|-----------------|-------------|
| `{{currency}}` | ₵ | ₦ | Currency symbol |
| `{{currency:symbol}}` | ₵ | ₦ | Same as {{currency}} |
| `{{currency:code}}` | GHS | NGN | ISO 4217 code |
| `{{currency:name}}` | Ghana Cedi | Nigerian Naira | Full currency name |
| `{{currency:subunit}}` | pesewas | kobo | Smallest unit name |

### 3. Exam Systems

| Template Variable | Ghana Example | Nigeria Example | Description |
|------------------|---------------|-----------------|-------------|
| `{{exam:primary}}` | BECE | JSCE | Primary/Junior exit exam |
| `{{exam:secondary}}` | WASSCE | WASSCE | Secondary exit exam |
| `{{exam:conductor}}` | WAEC | WAEC, NECO | Exam body |

### 4. Academic Levels

| Template Variable | Ghana Example | Nigeria Example | Description |
|------------------|---------------|-----------------|-------------|
| `{{level:primary}}` | Primary | Primary | Primary school level |
| `{{level:junior}}` | JHS | JSS | Junior secondary |
| `{{level:senior}}` | SHS | SSS | Senior secondary |

### 5. Business & Legal Context

| Template Variable | Ghana Example | Nigeria Example | Description |
|------------------|---------------|-----------------|-------------|
| `{{business:tax-authority}}` | Ghana Revenue Authority (GRA) | Federal Inland Revenue Service (FIRS) | Tax authority name |
| `{{business:companies-act}}` | Companies Act 2019 (Act 992) | Companies and Allied Matters Act (CAMA) 2020 | Companies legislation |
| `{{business:record-retention}}` | 6 years | 6 years | Legal record keeping period |
| `{{business:stock-exchange}}` | Ghana Stock Exchange (GSE) | Nigerian Exchange Group (NGX) | Stock exchange name |

### 6. Business Examples (Dynamic Selection)

| Template Variable | Ghana Example | Nigeria Example | Description |
|------------------|---------------|-----------------|-------------|
| `{{business:company:1}}` | MTN Ghana | Dangote Cement | First public company |
| `{{business:company:2}}` | GCB Bank | MTN Nigeria | Second public company |
| `{{business:company:3}}` | Ecobank Ghana | Nestlé Nigeria | Third public company |
| `{{business:bank:1}}` | GCB Bank | Guaranty Trust Bank (GTBank) | First major bank |
| `{{business:bank:2}}` | Ecobank Ghana | Zenith Bank | Second major bank |

**Note:** The `:1`, `:2`, `:3` notation selects which company/bank from the country's list. Without a number, `:1` is used by default.

### 7. Regulatory Requirements (NEW!)

| Template Variable | Ghana Example | Nigeria Example | Description |
|------------------|---------------|-----------------|-------------|
| `{{regulation:annual-return-deadline}}` | Within 12 months after year-end | Within 6 months after year-end | Annual return filing deadline |
| `{{regulation:audit-threshold}}` | All companies registered under Companies Act 2019 | All companies except small companies (turnover < ₦120M) | Who must conduct audits |
| `{{regulation:audit-description}}` | Annual statutory audit mandatory for all registered companies | Public companies and large private companies must conduct annual audits | Full audit requirement description |
| `{{regulation:tax-filing-deadline}}` | 4 months after year-end for companies | 6 months after year-end for companies | Tax return filing deadline |
| `{{regulation:min-capital-private}}` | ₵1.00 (nominal capital) | ₦100,000 minimum share capital | Minimum capital for private companies |
| `{{regulation:min-capital-public}}` | ₵50,000 minimum stated capital | ₦2,000,000 minimum share capital | Minimum capital for public companies |
| `{{regulation:vat-threshold}}` | ₵200,000 annual turnover | ₦25,000,000 annual turnover | VAT registration threshold |
| `{{regulation:corporate-tax-rate}}` | 25% (standard) or 1% (turnover < ₵500K) | 30% for large, 20% for medium, 0% for small | Corporate income tax rates |
| `{{regulation:withholding-tax}}` | 8% on dividends, 5% on services | 10% on dividends, 10% on services, 5% on contracts | Withholding tax rates |

---

## Usage Examples

### Example 1: Currency in Sentences
```typescript
content: "A laptop costs {{currency}}5,000 in {{country}}."
```
**Ghana:** "A laptop costs ₵5,000 in Ghana."  
**Nigeria:** "A laptop costs ₦5,000 in Nigeria."

### Example 2: Exam References
```typescript
content: "Students take the {{exam:primary}} at the end of {{level:junior}}."
```
**Ghana:** "Students take the BECE at the end of JHS."  
**Nigeria:** "Students take the JSCE at the end of JSS."

### Example 3: Business/Legal Context
```typescript
content: "The {{business:companies-act}} requires businesses to keep records for {{business:record-retention}}."
```
**Ghana:** "The Companies Act 2019 (Act 992) requires businesses to keep records for 6 years."  
**Nigeria:** "The Companies and Allied Matters Act (CAMA) 2020 requires businesses to keep records for 6 years."

### Example 4: Tax Authority
```typescript
content: "{{business:tax-authority}} audits companies to ensure tax compliance."
```
**Ghana:** "Ghana Revenue Authority (GRA) audits companies to ensure tax compliance."  
**Nigeria:** "Federal Inland Revenue Service (FIRS) audits companies to ensure tax compliance."

### Example 5: Stock Market Examples
```typescript
content: "Before investing in {{business:company:1}} or {{business:bank:1}} on the {{business:stock-exchange}}, analyze their annual reports."
```
**Ghana:** "Before investing in MTN Ghana or GCB Bank on the Ghana Stock Exchange (GSE), analyze their annual reports."  
**Nigeria:** "Before investing in Dangote Cement or Guaranty Trust Bank (GTBank) on the Nigerian Exchange Group (NGX), analyze their annual reports."

### Example 6: Country-Specific Scenarios
```typescript
content: "A {{country:adjective}} supplier wants to export goods to China. They need proper accounting records."
```
**Ghana:** "A Ghanaian supplier wants to export goods to China. They need proper accounting records."  
**Nigeria:** "A Nigerian supplier wants to export goods to China. They need proper accounting records."

### Example 7: Regulatory Requirements (NEW!)
```typescript
content: "{{country:flag}} {{country}} Requirement:\nCompanies must file annual returns {{regulation:annual-return-deadline}}."
```
**Ghana:** "🇬🇭 Ghana Requirement:  
Companies must file annual returns within 12 months after year-end."  

**Nigeria:** "🇳🇬 Nigeria Requirement:  
Companies must file annual returns within 6 months after year-end."

### Example 8: Audit Requirements
```typescript
content: "In {{country}}, {{regulation:audit-description}}. The threshold is: {{regulation:audit-threshold}}."
```
**Ghana:** "In Ghana, annual statutory audit is mandatory for all registered companies, conducted by a qualified auditor registered with ICAG. The threshold is: All companies registered under Companies Act 2019."

**Nigeria:** "In Nigeria, public companies and large private companies must conduct annual statutory audits by qualified auditors. The threshold is: All companies except small companies (turnover < ₦120M and assets < ₦60M)."

### Example 9: Tax and Capital Requirements
```typescript
content: "To start a private company in {{country}}, you need minimum capital of {{regulation:min-capital-private}}. Corporate tax rate is {{regulation:corporate-tax-rate}}."
```
**Ghana:** "To start a private company in Ghana, you need minimum capital of ₵1.00 (nominal capital). Corporate tax rate is 25% (standard rate) or 1% (for companies with turnover below ₵500,000)."

**Nigeria:** "To start a private company in Nigeria, you need minimum capital of ₦100,000 minimum share capital. Corporate tax rate is 30% for large companies, 20% for medium companies (turnover ₦25M-₦100M), 0% for small companies (turnover < ₦25M)."

---

## Best Practices

### ✅ DO:
- Use template variables for all country-specific content
- Use `{{business:company:1}}`, `{{business:company:2}}` for variety in examples
- Test content in multiple countries before publishing
- Use `{{country:adjective}}` for "Ghanaian", "Nigerian" etc.
- Use `{{business:tax-authority}}` instead of hardcoding "GRA" or "FIRS"

### ❌ DON'T:
- Hardcode company names like "MTN Ghana" or "GCB Bank"
- Hardcode laws like "Companies Act 2019 (Act 992)"
- Use country-specific acronyms like "GRA", "FIRS" directly
- Assume all countries use the same exam names
- Use flags directly (🇬🇭, 🇳🇬) - use `{{country:flag}}` instead

---

## Adding New Countries

To add support for a new country (e.g., Sierra Leone):

1. **Create country config** in `src/lib/localization/countries/sierra-leone.ts`
2. **Add business context:**
   ```typescript
   businessContext: {
     publicCompanies: ['Rokel Commercial Bank', 'Sierra Leone Commercial Bank', ...],
     banks: ['Sierra Leone Commercial Bank', 'Rokel Commercial Bank', ...],
     stockExchange: 'Sierra Leone Stock Exchange',
     taxAuthority: 'National Revenue Authority (NRA)',
     companiesAct: 'Companies Act 2009',
     recordRetention: '7 years',
     adjective: 'Sierra Leonean',
     demonym: 'Sierra Leoneans',
   }
   ```
3. **No changes needed to lesson content!** All template variables will automatically work.

---

## Technical Implementation

### 1. Content Localizer (`content-localizer.ts`)
Recursively processes objects/arrays to replace template variables:
```typescript
export function localizeLesson(lesson: any, country: CountryConfig): any {
  const cloned = JSON.parse(JSON.stringify(lesson));
  return localizeObject(cloned, country);
}
```

### 2. Localized Lesson Hook (`useLocalizedLesson.ts`)
Automatically localizes lessons when retrieved:
```typescript
export function useLocalizedLesson(subjectSlug, topicSlug, lessonSlug) {
  const { country } = useLocalization();
  return useMemo(() => {
    const lesson = getSHSLesson(subjectSlug, topicSlug, lessonSlug);
    if (!lesson || !country) return lesson;
    return localizeLesson(lesson, country);
  }, [subjectSlug, topicSlug, lessonSlug, country]);
}
```

### 3. Usage in Pages
```typescript
const lesson = useLocalizedLesson(subjectSlug, topicSlug, lessonSlug);
// lesson content is already localized!
```

---

## Verification Checklist

Before publishing content, verify:
- [ ] No hardcoded country names (use `{{country}}`)
- [ ] No hardcoded currency symbols (use `{{currency}}`)
- [ ] No hardcoded exam names (use `{{exam:primary}}`, `{{exam:secondary}}`)
- [ ] No hardcoded company/bank names (use `{{business:company:*}}`, `{{business:bank:*}}`)
- [ ] No hardcoded laws (use `{{business:companies-act}}`)
- [ ] No hardcoded tax authorities (use `{{business:tax-authority}}`)
- [ ] No country flags (use `{{country:flag}}`)
- [ ] Test content switches when country changes in settings

---

## Support

For questions about localization or adding new template variables:
1. Check `src/lib/localization/content-localizer.ts` for available replacements
2. See `src/lib/localization/country-config.ts` for data structure
3. Review existing country configs in `src/lib/localization/countries/`

Last updated: December 18, 2025

---

## Country-Specific Content & Curriculum Variations

### Understanding Curriculum Differences

Even though Ghana and Nigeria both use WASSCE (West African Senior School Certificate Examination), they have:
- **Different syllabi** with country-specific topics
- **Country-specific exam questions** (e.g., "For Nigerian candidates only")
- **Different emphasis** on certain topics
- **Additional/excluded topics** based on national curriculum

### Marking Content as Country-Specific

**Method 1: Using Availability Metadata**

```typescript
import { createCountrySpecificContent } from '@/lib/localization/content-availability';

const nigeriaOnlyLesson = {
  slug: 'nigeria-constitution-1999',
  title: 'Nigerian Constitution 1999',
  availability: createCountrySpecificContent('nigeria'),
  // ... rest of lesson
};
```

**Method 2: Multiple Countries**

```typescript
import { createMultiCountryContent } from '@/lib/localization/content-availability';

const ghanaAndNigeriaLesson = {
  slug: 'west-african-trade',
  title: 'West African Trade Bloc',
  availability: createMultiCountryContent(['ghana', 'nigeria']),
  // ... rest of lesson
};
```

**Method 3: Exclude Specific Countries**

```typescript
import { createExcludedContent } from '@/lib/localization/content-availability';

const notForSierraLeone = {
  slug: 'coastal-economy',
  title: 'Coastal Economic Activities',
  availability: createExcludedContent(['sierra-leone']),
  // ... rest of lesson
};
```

### Filtering Lessons by Country

```typescript
import { filterLessonsByCountry } from '@/lib/localization/content-availability';
import { useLocalization } from '@/lib/localization/localization-context';

function SubjectPage() {
  const { country } = useLocalization();
  const allLessons = getAllLessons();
  
  // Only show lessons applicable to current country
  const visibleLessons = filterLessonsByCountry(allLessons, country);
  
  return (
    <div>
      {visibleLessons.map(lesson => (
        <LessonCard key={lesson.slug} lesson={lesson} />
      ))}
    </div>
  );
}
```

### Subject-Specific Adjustments

Each country can have subject-specific curriculum adjustments:

```typescript
// In country config
subjectAdjustments: {
  'financial-accounting': {
    additionalContent: [
      'nigeria-tax-system',
      'cama-2020-provisions',
    ],
    weightage: {
      'theory-of-accounts': 20,
      'financial-statements': 25,
      'nigeria-specific-regulations': 10
    }
  }
}
```

### Exam Board Labels

```typescript
import { getExamBoardLabel, hasCountrySpecificQuestions } from '@/lib/localization/content-availability';

// Ghana: "WAEC Ghana"
// Nigeria: "WAEC Nigeria / NECO"
const examBoard = getExamBoardLabel(country);

// Check if exam has country-specific sections
if (hasCountrySpecificQuestions(country)) {
  // Show note: "This exam includes country-specific questions"
}
```

### Practical Examples

**Example 1: Nigeria-Only Lesson**

```typescript
{
  slug: 'nigeria-oil-economy',
  title: 'Nigeria\'s Oil Economy',
  availability: {
    isCountrySpecific: true,
    countrySpecificTo: 'nigeria',
    applicableCountries: ['nigeria'],
    examRelevance: 'country-specific'
  },
  introduction: 'Nigeria is the largest oil producer in Africa...',
  keyConcepts: [
    // Content specific to Nigeria
  ]
}
```

**Example 2: Ghana-Only Lesson**

```typescript
{
  slug: 'ghana-cocoa-industry',
  title: 'Ghana\'s Cocoa Industry',
  availability: {
    isCountrySpecific: true,
    countrySpecificTo: 'ghana',
    applicableCountries: ['ghana'],
    examRelevance: 'country-specific'
  },
  introduction: 'Ghana is the world\'s second-largest cocoa producer...',
  // ...
}
```

**Example 3: Common Lesson with Country-Specific Sections**

```typescript
{
  slug: 'company-law-basics',
  title: 'Introduction to Company Law',
  // Available to all countries
  keyConcepts: [
    {
      title: 'Universal Concepts',
      content: 'All countries follow these principles...'
    },
    {
      title: '{{country:flag}} {{country}}-Specific Regulations',
      content: 
        **{{business:companies-act}}:**
        - Companies must file annual returns {{regulation:annual-return-deadline}}
        - Minimum capital: {{regulation:min-capital-private}}
        
        **{{country}} Specific Requirements:**
        {{regulation:audit-description}}
      
    }
  ]
}
```

### Best Practices

 **DO:**
- Mark country-specific lessons with proper availability metadata
- Use template variables for country-specific details
- Filter lessons before display
- Show exam board labels clearly
- Indicate when questions are country-specific

 **DON'T:**
- Show Nigerian-only content to Ghanaian students
- Hardcode country-specific topics without filtering
- Forget to test content visibility in both countries
- Mix country-specific and general content without clear labels
