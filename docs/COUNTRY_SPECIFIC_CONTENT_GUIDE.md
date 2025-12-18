# Country-Specific Content System - Implementation Guide

## ✅ System Status: ACTIVE

The country-specific content filtering system is now **fully integrated and operational**. Content tagged with availability metadata will automatically be filtered based on the user's selected country.

---

## 🎯 How It Works

### 1. **Automatic Filtering**
When a student accesses content:
1. `useLocalizedLesson()` retrieves the lesson
2. Checks if `lesson.availability` exists
3. Calls `isContentAvailableForCountry(lesson.availability, country.id)`
4. Returns `null` if lesson is not available for current country
5. Otherwise, localizes and returns the lesson

### 2. **Components Updated**
- ✅ `src/lib/types.ts` - Added `ContentAvailability` interface to `Lesson` type
- ✅ `src/hooks/useLocalizedLesson.ts` - Integrated filtering logic
- ✅ `src/components/ui/CountrySpecificBadge.tsx` - Created badge component
- ✅ `src/content/country-specific-lessons-examples.ts` - Example lessons

---

## 📝 Creating Country-Specific Content

### Method 1: Single Country (Nigeria-Only)

```typescript
import { createCountrySpecificContent } from '@/lib/localization/content-availability';

const nigeriaLesson: Lesson = {
  id: 'nigeria-oil-economy',
  slug: 'nigeria-oil-economy',
  title: "Nigeria's Oil Industry",
  availability: createCountrySpecificContent('nigeria'), // 🔴 KEY LINE
  objectives: [...],
  introduction: "...",
  // ... rest of lesson
};
```

**Result:** Only Nigerian students see this lesson. Ghanaian students won't see it in their lesson list.

### Method 2: Multiple Countries (Ghana + Nigeria)

```typescript
import { createMultiCountryContent } from '@/lib/localization/content-availability';

const multiCountryLesson: Lesson = {
  id: 'ecowas-trade',
  slug: 'ecowas-trade',
  title: "ECOWAS Regional Trade",
  availability: createMultiCountryContent(['ghana', 'nigeria']), // 🔴 MULTI-COUNTRY
  // ... rest of lesson
};
```

**Result:** Ghana and Nigeria students see it. Sierra Leone, Liberia, Gambia students don't.

### Method 3: Exclude Specific Countries

```typescript
import { createExcludedContent } from '@/lib/localization/content-availability';

const excludedLesson: Lesson = {
  id: 'coastal-economics',
  slug: 'coastal-economics',
  title: "Coastal Economic Activities",
  availability: createExcludedContent(['sierra-leone']), // 🔴 EXCLUDE
  // ... rest of lesson
};
```

**Result:** All countries except Sierra Leone see this lesson.

### Method 4: Manual Availability Object

```typescript
const customLesson: Lesson = {
  id: 'custom-lesson',
  slug: 'custom-lesson',
  title: "Custom Availability",
  availability: {
    isCountrySpecific: true,
    countrySpecificTo: 'ghana',
    applicableCountries: ['ghana'],
    examRelevance: 'country-specific',
    examBoards: ['WAEC Ghana']
  },
  // ... rest of lesson
};
```

---

## 🎨 Using the Badge Component

### In Lesson Cards

```tsx
import { CountrySpecificBadge } from '@/components/ui/CountrySpecificBadge';

function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <div>
      <h3>{lesson.title}</h3>
      <CountrySpecificBadge availability={lesson.availability} />
    </div>
  );
}
```

**Displays:**
- 🇳🇬 Nigeria-Specific (for Nigerian-only content)
- 🇬🇭 Ghana-Specific (for Ghana-only content)
- 📝 Country-Specific Exam (for exam-specific content)

### Warning Badge (Content Not Available)

```tsx
import { ContentNotAvailableBadge } from '@/components/ui/CountrySpecificBadge';

<ContentNotAvailableBadge countryName="Nigeria" />
```

### Available In Badge

```tsx
import { AvailableInBadge } from '@/components/ui/CountrySpecificBadge';

<AvailableInBadge countries={['Ghana', 'Nigeria']} />
```

---

## 📚 Example Lessons Created

See `src/content/country-specific-lessons-examples.ts` for three complete examples:

1. **Ghana's Cocoa Industry** - Ghana-specific
   - COCOBOD, cocoa exports, farmer challenges
   - Only visible to Ghanaian students

2. **Nigeria's Oil Economy** - Nigeria-specific
   - NNPC, petroleum exports, economic diversification
   - Only visible to Nigerian students

3. **ECOWAS Trade** - Multi-country (Ghana + Nigeria)
   - Regional integration, cross-border trade
   - Visible to both Ghanaian and Nigerian students

---

## 🔗 Integrating Example Lessons

To add these examples to your curriculum:

```typescript
// In your main lessons data file
import { countrySpecificLessonsExamples } from '@/content/country-specific-lessons-examples';
import { financialAccountingSHS1Lessons } from '@/content/financial-accounting-shs1-lessons-data';

export const allFinancialAccountingLessons = [
  ...financialAccountingSHS1Lessons,
  ...countrySpecificLessonsExamples
];
```

---

## 🧪 Testing the System

### Test Scenario 1: Ghana User
1. Switch country to Ghana (in app settings)
2. Navigate to economics/business lessons
3. ✅ Should see: "Ghana's Cocoa Industry"
4. ✅ Should see: "ECOWAS Trade"
5. ❌ Should NOT see: "Nigeria's Oil Economy"

### Test Scenario 2: Nigeria User
1. Switch country to Nigeria
2. Navigate to economics/business lessons
3. ✅ Should see: "Nigeria's Oil Economy"
4. ✅ Should see: "ECOWAS Trade"
5. ❌ Should NOT see: "Ghana's Cocoa Industry"

### Console Logging
When a lesson is filtered, you'll see:
```
Lesson "Nigeria's Oil Economy" not available for Ghana
```

---

## 📋 Tagging Existing Lessons

### Priority Lessons to Tag

**Ghana-Specific:**
- Any lesson mentioning COCOBOD, Ghana's cocoa industry
- Ghana Revenue Authority (GRA) specific regulations
- Companies Act 2019 (Act 992) - Ghana version
- Ghana's bauxite/gold mining industry
- Bank of Ghana monetary policy

**Nigeria-Specific:**
- NNPC, Nigerian oil industry
- FIRS (Federal Inland Revenue Service) regulations
- CAMA 2020 (Companies and Allied Matters Act)
- Nigerian Stock Exchange (NSE)
- Central Bank of Nigeria policies
- Nigerian constitution/government structure

**Multi-Country (Keep as is):**
- General accounting principles (IFRS, double-entry)
- Universal economic concepts (supply/demand, inflation)
- Pan-African topics (AU, AfCFTA)
- ECOWAS-related content

### Tagging Workflow

1. **Identify** country-specific references in existing lessons
2. **Add availability field** to lesson object
3. **Test** by switching countries
4. **Add badge** in lesson list UI

---

## ⚠️ Important Notes

### Lesson Visibility
- Lessons without `availability` field → **visible to all countries**
- Lessons with `availability` → **filtered based on rules**
- Filtered lessons return `null` from `useLocalizedLesson()`

### Progress Tracking
If a student:
1. Completes a lesson in Ghana
2. Switches to Nigeria
3. That lesson disappears if Ghana-specific

**Recommendation:** Track progress with country context, or show warning when switching.

### Performance
- Filtering happens in `useMemo()` hook - very fast
- No API calls needed
- Pure client-side filtering

---

## 🚀 Next Steps

### Phase 1: Core Integration (✅ COMPLETE)
- ✅ Add ContentAvailability to Lesson type
- ✅ Integrate filtering in useLocalizedLesson
- ✅ Create badge components
- ✅ Create example lessons

### Phase 2: Content Tagging (IN PROGRESS)
- ⏳ Tag obvious country-specific lessons
- ⏳ Add badges to lesson cards
- ⏳ Test across both countries

### Phase 3: Enhanced Features (PLANNED)
- 🔲 Admin preview mode (see all lessons regardless of country)
- 🔲 Country switch warning modal
- 🔲 Progress tracking with country context
- 🔲 Analytics for country-specific content usage

### Phase 4: Expansion (FUTURE)
- 🔲 Sierra Leone specific content
- 🔲 Liberia specific content
- 🔲 Gambia specific content
- 🔲 Curriculum comparison tool

---

## 🆘 Troubleshooting

### Lesson Not Filtering?
**Check:**
1. Does lesson have `availability` field?
2. Is `country.id` matching expected value? (e.g., 'ghana', not 'Ghana')
3. Check console for filtering logs

### Badge Not Showing?
**Check:**
1. Did you import and use `<CountrySpecificBadge />` component?
2. Is `availability` prop passed correctly?
3. Is lesson actually country-specific?

### TypeScript Errors?
**Check:**
1. Run: `npm run build` to check for type errors
2. Ensure `ContentAvailability` is imported from `@/lib/types`
3. Clear `.next` cache: `Remove-Item -Recurse -Force .next`

---

## 📞 Support

For questions or issues:
1. Check `LOCALIZATION_TEMPLATE_GUIDE.md` for template variable usage
2. Review example lessons in `country-specific-lessons-examples.ts`
3. Test with console.log() to debug filtering

---

**System Status:** 🟢 **OPERATIONAL** - Filtering is active and working!
