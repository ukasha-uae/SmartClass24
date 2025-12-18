# 🌍 Localization System

> **Multi-country support for SmartClass24** - Serving students across West Africa with culturally relevant, automatically localized educational content.

---

## 📚 Quick Start

### 1. Wrap Your App

```typescript
import { LocalizationProvider } from '@/lib/localization/localization-context';

export default function RootLayout({ children }) {
  return (
    <LocalizationProvider defaultCountry="ghana">
      {children}
    </LocalizationProvider>
  );
}
```

### 2. Use in Components

```typescript
import { useLocalization } from '@/hooks/useLocalization';

function MyComponent() {
  const { country, formatCurrency, localizeContent } = useLocalization();
  
  return (
    <div>
      <p>{country.flag} {country.name}</p>
      <p>{formatCurrency(100)}</p>
      <p>{localizeContent("Study at {{city:capital}}")}</p>
    </div>
  );
}
```

---

## 📁 Directory Structure

```
src/lib/localization/
├── country-config.ts          # Type definitions & interfaces
├── content-adapter.ts         # Template variable system
├── localization-context.tsx   # React context provider
└── countries/
    ├── index.ts              # Country manager utilities
    ├── ghana.ts              # Ghana configuration
    ├── nigeria.ts            # Nigeria configuration
    └── ... (more countries)
```

---

## 🎯 Template Variables

Use these in your content for automatic localization:

| Category | Example | Ghana | Nigeria |
|----------|---------|-------|---------|
| Currency | `{{currency}}` | ₵ | ₦ |
| Exam | `{{exam:primary}}` | BECE | JSCE |
| Level | `{{level:jhs}}` | JHS | JSS |
| City | `{{city:capital}}` | Accra | Lagos |
| Landmark | `{{landmark:lake}}` | Lake Volta | Kainji Lake |
| Food | `{{food:staple}}` | Fufu | Pounded Yam |
| Festival | `{{festival:harvest}}` | Homowo | New Yam Festival |
| Institution | `{{institution:central_bank}}` | Bank of Ghana | Central Bank of Nigeria |
| Resource | `{{resource:mineral}}` | Gold | Crude Oil |
| Figure | `{{figure:leader}}` | Kwame Nkrumah | Nnamdi Azikiwe |

---

## 🔧 API Reference

### Hooks

#### `useLocalization()`
Main hook providing full localization utilities.

```typescript
const {
  country,              // Current CountryConfig
  countryId,            // Current country ID
  setCountry,           // Change country
  formatCurrency,       // Format currency
  localizeContent,      // Localize text
  getPrimaryExam,       // Get primary exam name
  getSecondaryExam,     // Get secondary exam name
  getCapital,           // Get capital city
} = useLocalization();
```

#### `useCountryConfig()`
Direct access to country configuration.

```typescript
const country = useCountryConfig();
// Access: country.currency.symbol, country.examSystem.primary, etc.
```

#### `useCountryProperties()`
Shortcut to commonly used properties.

```typescript
const {
  currencySymbol,
  primaryExam,
  capital,
  jhsName,
  shsName,
} = useCountryProperties();
```

#### `useCulturalContext()`
Access cultural context.

```typescript
const {
  festivals,
  landmarks,
  historicalFigures,
  commonFoods,
  resources,
} = useCulturalContext();
```

---

### Functions

#### `localizeText(text, country)`
Localize a single string.

```typescript
import { localizeText } from '@/lib/localization/content-adapter';
import { ghanaConfig } from '@/lib/localization/countries';

const result = localizeText("Price: {{currency}}100", ghanaConfig);
// "Price: ₵100"
```

#### `localizeObject(obj, country)`
Localize all strings in an object.

```typescript
const localized = localizeObject({
  title: "Welcome to {{city:capital}}",
  price: "{{currency}}50",
}, nigeriaConfig);
// { title: "Welcome to Lagos", price: "₦50" }
```

#### `getCountryConfig(id)`
Get a specific country configuration.

```typescript
import { getCountryConfig } from '@/lib/localization/countries';

const nigeria = getCountryConfig('nigeria');
console.log(nigeria.currency.symbol); // ₦
```

#### `getAllCountries()`
Get all country configurations.

```typescript
const countries = getAllCountries();
// Array of all CountryConfig objects
```

#### `getActiveCountries()`
Get only active countries.

```typescript
const active = getActiveCountries();
// Array of countries with status 'active' or 'beta'
```

---

## 📝 Adding a New Country

### Step 1: Create Config File

```typescript
// src/lib/localization/countries/sierra-leone.ts

import type { CountryConfig } from '../country-config';

export const sierraLeoneConfig: CountryConfig = {
  id: 'sierra-leone',
  name: 'Sierra Leone',
  flag: '🇸🇱',
  iso2: 'SL',
  iso3: 'SLE',
  
  currency: {
    code: 'SLL',
    symbol: 'Le',
    name: 'Leone',
    subunit: 'cents',
    subunitValue: 100,
  },
  
  examSystem: {
    primary: 'NPSE',
    secondary: 'WASSCE',
    conductor: 'WAEC',
  },
  
  // ... (fill in rest of config)
};

export default sierraLeoneConfig;
```

### Step 2: Register Country

```typescript
// src/lib/localization/countries/index.ts

import sierraLeoneConfig from './sierra-leone';

export const COUNTRIES: Record<string, CountryConfig> = {
  ghana: ghanaConfig,
  nigeria: nigeriaConfig,
  'sierra-leone': sierraLeoneConfig, // Add here
};
```

### Step 3: Test

```typescript
const sl = getCountryConfig('sierra-leone');
console.log(sl.currency.symbol); // Le
```

Done! ✅

---

## 🧪 Testing

### Unit Tests

```typescript
import { localizeText } from '@/lib/localization/content-adapter';
import { ghanaConfig, nigeriaConfig } from '@/lib/localization/countries';

test('localizes currency', () => {
  const text = "Price: {{currency}}100";
  
  expect(localizeText(text, ghanaConfig)).toBe("Price: ₵100");
  expect(localizeText(text, nigeriaConfig)).toBe("Price: ₦100");
});
```

### Integration Tests

```typescript
import { render } from '@testing-library/react';
import { LocalizationProvider } from '@/lib/localization/localization-context';

test('provides localization context', () => {
  const { getByText } = render(
    <LocalizationProvider defaultCountry="nigeria">
      <TestComponent />
    </LocalizationProvider>
  );
  
  expect(getByText(/₦/)).toBeInTheDocument();
});
```

---

## 🎨 Examples

### Math Word Problem

```typescript
const problem = localizeContent(`
  A trader in {{city:capital}} buys goods for {{currency}}500
  and sells them for {{currency}}750. Calculate:
  
  a) The profit
  b) The profit percentage
  
  This type of question appears in {{exam:primary}}.
`);

// Ghana output:
// "A trader in Accra buys goods for ₵500 and sells them for ₵750..."
// "This type of question appears in BECE."

// Nigeria output:
// "A trader in Lagos buys goods for ₦500 and sells them for ₦750..."
// "This type of question appears in JSCE."
```

### Science Lesson

```typescript
const lesson = localizeContent(`
  {{landmark:natural}} demonstrates the importance of biodiversity.
  Located in {{country}}, it's home to numerous species including
  those used in {{resource:agricultural}} production.
`);

// Ghana: "Kakum National Park demonstrates... including those used in Cocoa production."
// Nigeria: "Yankari National Park demonstrates... including those used in Palm Oil production."
```

### Social Studies

```typescript
const content = localizeContent(`
  The {{institution:central_bank}} manages {{country}}'s monetary policy.
  It regulates the value of the {{currency:code}} to ensure economic stability.
  
  Students in {{level:shs:3}} should understand how this affects
  {{resource:mineral}} exports and {{resource:agricultural}} trade.
`);

// Automatically localizes all placeholders based on user's country
```

---

## 🔍 Best Practices

### ✅ DO

```typescript
// Use template variables
"Price: {{currency}}100"

// Use country-neutral concepts
"The central bank manages monetary policy"

// Provide fallbacks
const example = country.culturalContext.landmarks[0]?.name || "the landmark";
```

### ❌ DON'T

```typescript
// Don't hardcode currency
"Price: ₵100"

// Don't hardcode locations
"Lake Volta is the largest..."

// Don't assume exam names
"Prepare for BECE"
```

---

## 📊 Available Countries

| Country | Flag | Status | Currency | Exam | Launch Date |
|---------|------|--------|----------|------|-------------|
| Ghana | 🇬🇭 | Active | ₵ GHS | BECE/WASSCE | 2024-01-01 |
| Nigeria | 🇳🇬 | Beta | ₦ NGN | JSCE/WASSCE | 2026-01-15 |
| Sierra Leone | 🇸🇱 | Coming Soon | Le SLL | NPSE/WASSCE | TBD |
| Liberia | 🇱🇷 | Coming Soon | $ LRD | NHSSE/WASSCE | TBD |
| Gambia | 🇬🇲 | Coming Soon | D GMD | GABECE/WASSCE | TBD |

---

## 🐛 Troubleshooting

### Template not replacing?

**Problem**: `{{currency}}` showing as-is  
**Solution**: Ensure you're using `localizeContent()` or content adapter

### Wrong currency symbol?

**Problem**: Showing ₵ for Nigerian content  
**Solution**: Check user's country setting in localization context

### Country not found?

**Problem**: `getCountryConfig()` returns null  
**Solution**: Verify country ID is correct and country is registered in `countries/index.ts`

---

## 📞 Support

- **Documentation**: `/docs/INTERNATIONALIZATION_*.md`
- **Examples**: `src/components/LocalizationDemo.tsx`
- **Issues**: GitHub Issues or #internationalization Slack
- **Questions**: Development team

---

## 📖 Further Reading

- [Full Strategy Document](../../docs/INTERNATIONALIZATION_STRATEGY.md)
- [Implementation Roadmap](../../docs/INTERNATIONALIZATION_ROADMAP.md)
- [Quick Start Guide](../../docs/INTERNATIONALIZATION_QUICKSTART.md)
- [Progress Tracker](../../docs/INTERNATIONALIZATION_PROGRESS.md)

---

**Version**: 1.0.0  
**Last Updated**: December 18, 2025  
**Status**: Production Ready ✅

---

*Making education relevant for every West African student.* 🌍
