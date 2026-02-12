# Curriculum Content Adapter - Usage Guide

## Overview
The Curriculum Content Adapter enables **runtime content localization** for multi-tenant deployments. It transforms curriculum content (lessons, quizzes, topics) based on tenant context without modifying source data.

**Primary Use Case:** Allow Wisdom Warehouse (UAE) to use West African curriculum content with localized terminology suitable for international audiences.

## Core Principles

1. **Runtime Transformation** - Source data remains unchanged
2. **Tenant-Aware** - Transformations apply only when needed
3. **Scalable** - Easy to add new tenants and transformation rules
4. **Maintainable** - Centralized logic in single module
5. **Secure** - Tenant isolation maintained, no data leakage

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Source Data Layer                      │
│  (jhs-data.ts, shs-lessons-data.ts)                     │
│  - curriculumId: 'west-african'                         │
│  - Contains Ghana/West Africa terminology               │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│           Curriculum Content Adapter                    │
│  (curriculum-content-adapter.ts)                        │
│  - Applies tenant-specific transformation rules         │
│  - Ghana → Neutral/US terminology                       │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                     │
│  (Lesson components, Quiz displays)                     │
│  - Shows localized content to end users                 │
└─────────────────────────────────────────────────────────┘
```

## Transformation Rules

### Country References
| Original | Transformed |
|----------|-------------|
| Ghana | your country |
| Accra | the capital |
| Kumasi | a major city |
| Nigerian | local |

### Currency
| Original | Transformed |
|----------|-------------|
| cedis | dollars |
| GH₵ | $ |
| pesewas | cents |

### Education System
| Original | Transformed |
|----------|-------------|
| JHS | Junior School |
| JHS 1 | Grade 7 |
| JHS 2 | Grade 8 |
| JHS 3 | Grade 9 |
| SHS 1 | Grade 10 |
| SHS 2 | Grade 11 |
| SHS 3 | Grade 12 |
| BECE | assessment |
| WASSCE | final exam |

### Cultural References
| Original | Transformed |
|----------|-------------|
| tro-tro | bus |
| chop bar | restaurant |
| jollof rice | rice dish |
| groundnuts | peanuts |

## Usage Examples

### 1. Transform a Lesson

```typescript
import { adaptLessonForTenant } from '@/lib/curriculum-content-adapter';
import { getCurrentTenant } from '@/tenancy/context';

// In your lesson component
function LessonDisplay({ lesson }: { lesson: Lesson }) {
  const tenant = getCurrentTenant();
  const adaptedLesson = adaptLessonForTenant(lesson, tenant);
  
  return (
    <div>
      <h1>{adaptedLesson.title}</h1>
      <p>{adaptedLesson.introduction}</p>
      {/* Rest of lesson display */}
    </div>
  );
}
```

### 2. Transform a Quiz

```typescript
import { adaptQuizForTenant } from '@/lib/curriculum-content-adapter';

function QuizQuestion({ quiz, tenant }: { quiz: Quiz; tenant: TenantConfig }) {
  const adaptedQuiz = adaptQuizForTenant(quiz, tenant);
  
  return (
    <div>
      <p>{adaptedQuiz.question}</p>
      {adaptedQuiz.options.map((option, idx) => (
        <button key={idx}>{option}</button>
      ))}
    </div>
  );
}
```

### 3. Transform a Subject

```typescript
import { adaptSubjectForTenant } from '@/lib/curriculum-content-adapter';

function SubjectCurriculum({ subject, tenant }: Props) {
  const adaptedSubject = adaptSubjectForTenant(subject, tenant);
  
  return (
    <div>
      <h2>{adaptedSubject.name}</h2>
      <p>{adaptedSubject.description}</p>
      {adaptedSubject.curriculum.map(yearGroup => (
        <YearGroupDisplay key={yearGroup.level} data={yearGroup} />
      ))}
    </div>
  );
}
```

### 4. Get Curriculum Label

```typescript
import { getCurriculumLabel } from '@/lib/curriculum-content-adapter';

function CurriculumHeader({ tenant }: { tenant: TenantConfig }) {
  const label = getCurriculumLabel(tenant);
  // For Wisdom Warehouse: "International Standards-Aligned Curriculum"
  // For SmartClass24: "West African Curriculum"
  
  return <h1>{label}</h1>;
}
```

### 5. Transform Grade Level Labels

```typescript
import { getGradeLevelLabel } from '@/lib/curriculum-content-adapter';

function GradeSelector({ tenant }: { tenant: TenantConfig }) {
  const levels = ['JHS 1', 'JHS 2', 'JHS 3'];
  
  return (
    <select>
      {levels.map(level => (
        <option key={level} value={level}>
          {getGradeLevelLabel(level, tenant)}
          {/* Wisdom Warehouse sees: "Grade 7", "Grade 8", "Grade 9" */}
          {/* SmartClass24 sees: "JHS 1", "JHS 2", "JHS 3" */}
        </option>
      ))}
    </select>
  );
}
```

## Integration Pattern

### Before (Without Adapter)
```typescript
// Component shows raw data with Ghana references
function LessonPage({ lessonData }) {
  return (
    <div>
      <h1>{lessonData.title}</h1>
      <p>{lessonData.introduction}</p>
      {/* Shows: "In Ghana, the BECE exam..." */}
    </div>
  );
}
```

### After (With Adapter)
```typescript
// Component shows adapted content for tenant
import { adaptLessonForTenant } from '@/lib/curriculum-content-adapter';
import { getCurrentTenant } from '@/tenancy/context';

function LessonPage({ lessonData }) {
  const tenant = getCurrentTenant();
  const lesson = adaptLessonForTenant(lessonData, tenant);
  
  return (
    <div>
      <h1>{lesson.title}</h1>
      <p>{lesson.introduction}</p>
      {/* Wisdom Warehouse sees: "Locally, the assessment..." */}
      {/* SmartClass24 sees: "In Ghana, the BECE exam..." */}
    </div>
  );
}
```

## Performance Considerations

### 1. Component-Level Caching
```typescript
import { useMemo } from 'react';

function LessonDisplay({ lesson, tenant }) {
  const adaptedLesson = useMemo(
    () => adaptLessonForTenant(lesson, tenant),
    [lesson.id, tenant.id]
  );
  
  return <div>{/* Use adaptedLesson */}</div>;
}
```

### 2. Early Return for Non-Target Tenants
All adapter functions check tenant ID first:
```typescript
if (tenant.id !== 'wisdomwarehouse') {
  return lesson; // No transformation, instant return
}
```

### 3. Transformation Cost
- **Regex operations:** ~10-20 per text field
- **Lesson transformation:** < 5ms (typical)
- **Subject transformation:** < 50ms (100+ lessons)
- **Negligible impact on page load**

## Testing

### 1. Unit Test Transformations
```typescript
import { previewTransformation } from '@/lib/curriculum-content-adapter';

const result = previewTransformation(
  'Students in Ghana use cedis to buy items at the chop bar.',
  'wisdomwarehouse'
);

console.log(result.original);
// "Students in Ghana use cedis to buy items at the chop bar."

console.log(result.transformed);
// "Students locally use dollars to buy items at the restaurant."

console.log(result.changesCount);
// 3 (Ghana → locally, cedis → dollars, chop bar → restaurant)
```

### 2. Visual Inspection
```typescript
import { getTransformationRules } from '@/lib/curriculum-content-adapter';

const rules = getTransformationRules('wisdomwarehouse');
console.table(rules);
// Displays all transformation rules in console
```

### 3. Component Testing
```typescript
// Test that SmartClass24 sees original content
const tenant1 = { id: 'smartclass24' };
const lesson1 = adaptLessonForTenant(originalLesson, tenant1);
expect(lesson1.introduction).toContain('Ghana');

// Test that Wisdom Warehouse sees adapted content
const tenant2 = { id: 'wisdomwarehouse' };
const lesson2 = adaptLessonForTenant(originalLesson, tenant2);
expect(lesson2.introduction).toContain('your country');
expect(lesson2.introduction).not.toContain('Ghana');
```

## Adding New Transformation Rules

### 1. Edit `WISDOM_WAREHOUSE_RULES` Object
```typescript
const WISDOM_WAREHOUSE_RULES = {
  // Add new entry
  'Tema': 'the port city',
  'Ashanti Region': 'the central region',
  // ...
};
```

### 2. Add Regex Pattern (for complex rules)
```typescript
const REGEX_RULES = [
  // Add new pattern
  { pattern: /\bGES\b/g, replacement: 'Department of Education' },
  // ...
];
```

### 3. Test Thoroughly
```bash
npm run dev
# Visit: http://localhost:9002/?tenant=wisdomwarehouse
# Check transformed content in lessons/quizzes
```

## Extending to New Tenants

### Example: Add US Tenant with UK Content Localization

**Step 1: Define transformation rules**
```typescript
const US_TENANT_RULES = {
  'colour': 'color',
  'metre': 'meter',
  'litre': 'liter',
  'maths': 'math',
};
```

**Step 2: Update transformation function**
```typescript
function transformText(text: string, tenantId: string): string {
  if (tenantId === 'wisdomwarehouse') {
    // Apply Wisdom Warehouse rules
  } else if (tenantId === 'us-school-district') {
    // Apply US tenant rules
  }
  
  return text;
}
```

**Step 3: Update all adapter functions**
```typescript
export function adaptLessonForTenant(lesson: Lesson, tenant: TenantConfig): Lesson {
  if (tenant.id !== 'wisdomwarehouse' && tenant.id !== 'us-school-district') {
    return lesson; // No transformation
  }
  
  // Apply transformations...
}
```

## Maintenance Guidelines

### DO:
✅ Centralize all transformation rules in this module
✅ Add comments for cultural context (e.g., "tro-tro = Ghana minibus")
✅ Test transformations with real lesson content
✅ Use early returns for non-target tenants (performance)
✅ Keep rules simple and readable

### DON'T:
❌ Modify source data files (jhs-data.ts, etc.)
❌ Add tenant-specific logic to React components
❌ Over-complicate regex patterns (use simple string match when possible)
❌ Transform technical terms (keep math/science concepts unchanged)
❌ Remove educational context (localize, don't delete)

## Security Considerations

1. **Tenant Isolation:** Transformations only apply to target tenant
2. **Data Integrity:** Source data never modified
3. **No User Input:** All rules are hardcoded (no injection risk)
4. **Type Safety:** TypeScript ensures correct usage

## Rollback Plan

If issues arise:

1. **Disable for specific tenant:**
   ```typescript
   if (tenant.id === 'wisdomwarehouse' && DISABLE_ADAPTER) {
     return lesson; // Show original content
   }
   ```

2. **Remove adapter integration:**
   - Comment out `adaptLessonForTenant()` calls in components
   - Revert to showing original lesson data
   - Deploy to production

3. **Debug specific transformation:**
   ```typescript
   const preview = previewTransformation(problematicText, 'wisdomwarehouse');
   console.log('Before:', preview.original);
   console.log('After:', preview.transformed);
   // Identify problematic rule and fix
   ```

## Future Enhancements

### Phase 1 (Current)
- ✅ Wisdom Warehouse transformations (Ghana → Neutral/US)
- ✅ Runtime content adaptation
- ✅ Zero impact on other tenants

### Phase 2 (Next Quarter)
- 📋 Add US curriculum (native content, no transformation needed)
- 📋 UK tenant localization (US content → UK terminology)
- 📋 Australia tenant localization

### Phase 3 (Future)
- 📋 AI-powered content suggestions
- 📋 Curriculum alignment reporting
- 📋 Multi-language support (Arabic, French, etc.)

## Support

For questions or issues:
1. Check transformation rules in `curriculum-content-adapter.ts`
2. Use `previewTransformation()` for debugging
3. Test locally with `?tenant=wisdomwarehouse` parameter
4. Review this guide for integration patterns

## Related Documentation
- [Tenant Configuration](../tenancy/README.md)
- [Multi-Curriculum Architecture](../../docs/MULTI_CURRICULUM_IMPLEMENTATION.md)
- [Localization System](./localization/README.md)
