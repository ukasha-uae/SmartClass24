# Content Adapter Integration Guide

## Integration Checklist

This guide shows **exactly where** to integrate the curriculum content adapter into existing components.

## Priority Integration Points

### ✅ 1. Main Lesson Display Component (CRITICAL)
**File:** `src/app/subjects/[level]/[subjectSlug]/[topicSlug]/[lessonSlug]/page.tsx`

**Location:** Lines ~323-377 (inside the `useMemo` block)

**Current Code:**
```typescript
const lesson = useMemo(() => {
  const baseLesson = localLesson || jhsLesson || firestoreLesson;
  
  // For Primary and SHS lessons without full content...
  if ((educationLevel === 'Primary' || educationLevel === 'SHS') && baseLesson && !baseLesson.introduction) {
    return {
      ...baseLesson,
      // placeholder content generation...
    };
  }
  
  return baseLesson;
}, [localLesson, firestoreLesson, educationLevel, localTopic?.name, subjectInfo?.name]);
```

**NEW CODE (Add Content Adapter):**
```typescript
import { contentAdapter } from '@/lib/curriculum-content-adapter';
import { getCurrentTenant } from '@/tenancy/context';

// ... inside component ...

const lesson = useMemo(() => {
  const baseLesson = localLesson || jhsLesson || firestoreLesson;
  
  // For Primary and SHS lessons without full content...
  if ((educationLevel === 'Primary' || educationLevel === 'SHS') && baseLesson && !baseLesson.introduction) {
    const placeholder = {
      ...baseLesson,
      // placeholder content generation...
    };
    
    // ✨ APPLY CONTENT ADAPTER FOR TENANT
    const tenant = getCurrentTenant();
    return contentAdapter.adaptLessonForTenant(placeholder, tenant);
  }
  
  // ✨ APPLY CONTENT ADAPTER FOR TENANT
  if (baseLesson) {
    const tenant = getCurrentTenant();
    return contentAdapter.adaptLessonForTenant(baseLesson, tenant);
  }
  
  return baseLesson;
}, [localLesson, firestoreLesson, educationLevel, localTopic?.name, subjectInfo?.name]);
```

**Impact:** 🎯 **HIGH** - All lesson content automatically localized for Wisdom Warehouse

---

### ✅ 2. Quiz Display Component
**File:** `src/components/LessonCompleteQuiz.tsx`

**Current Code:** (search for where quiz questions are mapped)
```typescript
{lesson.endOfLessonQuiz?.map((quiz, idx) => (
  <QuizQuestion key={idx} quiz={quiz} />
))}
```

**NEW CODE:**
```typescript
import { contentAdapter } from '@/lib/curriculum-content-adapter';
import { getCurrentTenant } from '@/tenancy/context';

// Inside component
const tenant = getCurrentTenant();

{lesson.endOfLessonQuiz?.map((quiz, idx) => {
  const adaptedQuiz = contentAdapter.adaptQuizForTenant(quiz, tenant);
  return <QuizQuestion key={idx} quiz={adaptedQuiz} />;
})}
```

**Impact:** 🎯 **HIGH** - Quiz questions/answers localized

---

### ✅ 3. Subject List Page
**File:** `src/app/subjects/[level]/[subjectSlug]/page.tsx`

**Current Code:** (search for subject display logic)
```typescript
const subject = getSubjectBySlug(subjectSlug);
```

**NEW CODE:**
```typescript
import { contentAdapter } from '@/lib/curriculum-content-adapter';
import { getCurrentTenant } from '@/tenancy/context';

const tenant = getCurrentTenant();
const rawSubject = getSubjectBySlug(subjectSlug);
const subject = rawSubject ? contentAdapter.adaptSubjectForTenant(rawSubject, tenant) : null;
```

**Impact:** 🎯 **MEDIUM** - Subject descriptions and topic titles localized

---

### ✅ 4. Grade Level Selector Component
**File:** Search for components that display "JHS 1", "JHS 2", etc.

**Likely files:**
- `src/components/LevelSelector.tsx`
- `src/app/subjects/page.tsx`
- Any navigation components

**Current Code:**
```typescript
<button>{level}</button> // Shows "JHS 1", "JHS 2", etc.
```

**NEW CODE:**
```typescript
import { getGradeLevelLabel } from '@/lib/curriculum-content-adapter';
import { getCurrentTenant } from '@/tenancy/context';

const tenant = getCurrentTenant();
<button>{getGradeLevelLabel(level, tenant)}</button> // Shows "Grade 7" for Wisdom Warehouse
```

**Impact:** 🎯 **MEDIUM** - Grade level labels localized throughout app

---

### ✅ 5. Curriculum Label Display
**File:** Any component showing "West African Curriculum"

**Likely locations:**
- Header/navbar
- Dashboard
- About page
- Marketing pages

**Current Code:**
```typescript
<h1>West African Curriculum</h1>
```

**NEW CODE:**
```typescript
import { getCurriculumLabel } from '@/lib/curriculum-content-adapter';
import { getCurrentTenant } from '@/tenancy/context';

const tenant = getCurrentTenant();
<h1>{getCurriculumLabel(tenant)}</h1> 
// Wisdom Warehouse sees: "International Standards-Aligned Curriculum"
// SmartClass24 sees: "West African Curriculum"
```

**Impact:** 🎯 **HIGH** - Removes "West African" branding for Wisdom Warehouse

---

## Detailed Integration Example

### Complete Lesson Page Integration

**File:** `src/app/subjects/[level]/[subjectSlug]/[topicSlug]/[lessonSlug]/page.tsx`

**STEP 1: Add imports at top of file**
```typescript
import { contentAdapter } from '@/lib/curriculum-content-adapter';
import { getCurrentTenant } from '@/tenancy/context'; // ✅ Assumes this exists
```

**STEP 2: Modify useMemo block (around line 323)**

```typescript
const lesson = useMemo(() => {
  const baseLesson = localLesson || jhsLesson || firestoreLesson;
  
  // Get current tenant for content adaptation
  const tenant = getCurrentTenant();
  
  // For Primary and SHS lessons without full content, generate placeholder content
  if ((educationLevel === 'Primary' || educationLevel === 'SHS') && baseLesson && !baseLesson.introduction) {
    const levelText = educationLevel === 'Primary' ? 'primary school' : 'Senior High School';
    const placeholderLesson = {
      ...baseLesson,
      introduction: `Welcome to **${baseLesson.title}**! In this ${levelText} lesson, you will learn important concepts that will help you understand ${localTopic?.name || 'this topic'} better. Let's explore together!`,
      objectives: [
        `Understand the key concepts of ${baseLesson.title}`,
        `Apply ${baseLesson.title} principles to solve problems`,
        `Develop critical thinking skills in this area`,
        `Practice and master the fundamental techniques`,
      ],
      keyConcepts: [
        {
          title: `Introduction to ${baseLesson.title}`,
          explanation: `${baseLesson.title} is a fundamental concept in ${subjectInfo?.name}. This topic builds on your previous knowledge and introduces new ideas that are essential for your ${educationLevel} studies.`,
        },
        {
          title: 'Key Principles',
          explanation: `Understanding the core principles of ${baseLesson.title} will help you excel in ${subjectInfo?.name}. Pay attention to the definitions, formulas, and examples provided.`,
        },
        {
          title: 'Practical Applications',
          explanation: `${baseLesson.title} has many real-world applications. As you study, think about how these concepts apply to everyday situations and other subjects you're learning.`,
        },
        {
          title: 'Study Tips',
          explanation: 'Take notes, practice regularly, and don\'t hesitate to ask questions. Review this lesson multiple times to strengthen your understanding.',
        }
      ],
      summary: `Congratulations on completing this lesson on ${baseLesson.title}! You've learned important concepts that will help you succeed in ${subjectInfo?.name}. Remember to review regularly and practice with examples. ${educationLevel === 'SHS' ? `These skills will be valuable for your ${country?.examSystem?.secondary || 'WASSCE'} preparation.` : 'Keep up the great work!'}`,
      additionalResources: [
        {
          title: 'Practice Exercises',
          description: 'Additional practice materials and exercises',
          type: 'worksheet' as const
        },
        {
          title: 'Video Tutorials',
          description: 'Visual explanations and demonstrations',
          type: 'video' as const
        },
        {
          title: 'Interactive Quiz',
          description: 'Test your understanding with practice questions',
          type: 'quiz' as const
        }
      ]
    };
    
    // ✨ APPLY CONTENT ADAPTER TO PLACEHOLDER LESSON
    return contentAdapter.adaptLessonForTenant(placeholderLesson, tenant);
  }
  
  // ✨ APPLY CONTENT ADAPTER TO REAL LESSON
  if (baseLesson) {
    return contentAdapter.adaptLessonForTenant(baseLesson, tenant);
  }
  
  return baseLesson;
}, [localLesson, firestoreLesson, educationLevel, localTopic?.name, subjectInfo?.name]);
```

**STEP 3: Test locally**
```powershell
npm run dev
# Visit: http://localhost:9002/?tenant=wisdomwarehouse
# Navigate to any lesson
# Verify Ghana references are replaced
```

---

## Testing Workflow

### 1. Test with SmartClass24 (Control Group)
```
URL: http://localhost:9002/
Expected: See "Ghana", "cedis", "JHS", "BECE" in lessons
Result: ✅ No changes (adapter skips smartclass24 tenant)
```

### 2. Test with Wisdom Warehouse (Treatment Group)
```
URL: http://localhost:9002/?tenant=wisdomwarehouse
Expected: See "your country", "dollars", "Grade 7", "assessment" in lessons
Result: ✅ Content transformed (adapter applies transformations)
```

### 3. Visual Comparison

**Before (Current State):**
```
Title: Understanding Ghana's Economy
Introduction: In Ghana, people use cedis (GH₵) to buy goods at the market. 
Students take the BECE exam in JHS 3.

Objectives:
- Understand how the cedi is used in Ghana
- Learn about trade in Accra and Kumasi
- Prepare for BECE economics questions
```

**After (With Adapter):**
```
Title: Understanding your country's Economy
Introduction: Locally, people use dollars ($) to buy goods at the market. 
Students take the assessment in Grade 9.

Objectives:
- Understand how the dollar is used locally
- Learn about trade in the capital and major cities
- Prepare for assessment economics questions
```

---

## Rollout Strategy

### Phase 1: Core Lesson Display (Week 1 - NOW)
- ✅ Create adapter module
- ✅ Create test file
- ✅ Create documentation
- 🔄 Integrate into main lesson page
- 🔄 Test locally
- 🔄 Commit changes

### Phase 2: Quiz & Topic Pages (Week 1)
- Integrate into quiz components
- Integrate into topic list pages
- Integrate into subject pages
- Test all quiz styles

### Phase 3: Navigation & Labels (Week 1)
- Update grade level selectors
- Update curriculum label displays
- Update breadcrumbs
- Update navigation menus

### Phase 4: Edge Cases (Week 2)
- Handle past questions
- Handle markdown content
- Handle image alt text
- Handle PDF downloads

### Phase 5: Production Deployment (Week 2)
- Code review
- Final testing
- Deploy to production
- Monitor Wisdom Warehouse feedback
- Iterate based on feedback

---

## Performance Monitoring

### Add Performance Tracking

```typescript
import { contentAdapter } from '@/lib/curriculum-content-adapter';
import { getCurrentTenant } from '@/tenancy/context';

const lesson = useMemo(() => {
  const startTime = performance.now();
  const baseLesson = localLesson || jhsLesson || firestoreLesson;
  
  if (baseLesson) {
    const tenant = getCurrentTenant();
    const adapted = contentAdapter.adaptLessonForTenant(baseLesson, tenant);
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Log slow transformations in development
    if (process.env.NODE_ENV === 'development' && duration > 10) {
      console.warn(`⚠️ Slow content adaptation: ${duration.toFixed(2)}ms for lesson ${baseLesson.id}`);
    }
    
    return adapted;
  }
  
  return baseLesson;
}, [localLesson, firestoreLesson]);
```

---

## Troubleshooting

### Issue: Transformations not appearing
**Solution:** Check that tenant context is correctly set
```typescript
const tenant = getCurrentTenant();
console.log('Current tenant:', tenant.id); // Should be 'wisdomwarehouse'
```

### Issue: Some Ghana references still visible
**Solution:** Add missing transformation rule to `curriculum-content-adapter.ts`
```typescript
const WISDOM_WAREHOUSE_RULES = {
  // Add new rule
  'Ghana Immigration Service': 'immigration authorities',
  // ...
};
```

### Issue: Performance degradation
**Solution:** Add memoization to transformed lesson
```typescript
const adaptedLesson = useMemo(
  () => contentAdapter.adaptLessonForTenant(baseLesson, tenant),
  [baseLesson?.id, tenant.id]
);
```

### Issue: TypeScript errors
**Solution:** Ensure `getCurrentTenant()` function exists and returns `TenantConfig`
```typescript
// Create if missing: src/tenancy/context.tsx
export function getCurrentTenant(): TenantConfig {
  // Implementation...
}
```

---

## Success Criteria

### Lesson Display
- ✅ No "Ghana" references visible to Wisdom Warehouse
- ✅ Currency shows as "dollars" not "cedis"
- ✅ Grade levels show as "Grade 7-12" not "JHS 1-3, SHS 1-3"
- ✅ BECE/WASSCE replaced with "assessment"/"final exam"
- ✅ SmartClass24 sees original content (no changes)

### Quiz Questions
- ✅ All quiz questions adapted
- ✅ Multiple choice options adapted
- ✅ Explanations adapted
- ✅ Question images alt text adapted (if applicable)

### Navigation
- ✅ Breadcrumbs use adapted labels
- ✅ Subject/topic lists use adapted text
- ✅ Grade level dropdowns show adapted labels

### Performance
- ✅ Page load time < 2 seconds
- ✅ Content adaptation < 10ms per lesson
- ✅ No visible UI flicker or delay
- ✅ React DevTools shows minimal re-renders

---

## Next Steps After Integration

1. **Test Real Lesson Data**
   ```bash
   npm run dev
   # Navigate to: http://localhost:9002/?tenant=wisdomwarehouse
   # Test multiple lessons from jhs-data.ts
   ```

2. **User Acceptance Testing**
   - Share with Wisdom Warehouse contact
   - Gather feedback on terminology
   - Adjust transformation rules based on feedback

3. **Documentation**
   - Update tenant onboarding guide
   - Document how to add new transformation rules
   - Create video demo for stakeholders

4. **Monitor & Iterate**
   - Track user engagement metrics
   - Monitor error logs for transformation issues
   - Refine rules based on real-world usage

---

## Related Files

- **Adapter:** `src/lib/curriculum-content-adapter.ts`
- **Tests:** `src/lib/curriculum-content-adapter.test.ts`
- **Guide:** `CURRICULUM_CONTENT_ADAPTER_GUIDE.md`
- **Main Lesson Page:** `src/app/subjects/[level]/[subjectSlug]/[topicSlug]/[lessonSlug]/page.tsx`
- **Tenant Registry:** `src/tenancy/registry.ts`
- **Tenant Types:** `src/tenancy/types.ts`
