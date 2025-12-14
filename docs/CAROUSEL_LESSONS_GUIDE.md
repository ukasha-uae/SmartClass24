# Carousel Lessons Implementation Guide

**Last Updated**: December 14, 2025  
**Status**: Production-ready pattern established  
**Migration Tracker**: [CAROUSEL_MIGRATION_TRACKER.md](./CAROUSEL_MIGRATION_TRACKER.md)  
**Strategy Document**: [CAROUSEL_MIGRATION_STRATEGY.md](./CAROUSEL_MIGRATION_STRATEGY.md)

## 🎯 Purpose

This document defines the **official pattern** for implementing carousel-mode lessons with intelligent voice narration. Any future modifications MUST follow this pattern to maintain consistency.

---

## ⚠️ CRITICAL: What NOT to Do

### ❌ DO NOT add `carouselTeachingMethod` property to lessons
```typescript
// WRONG - This property does not exist in the system
const lesson = {
  // ... other properties
  carouselTeachingMethod: {  // ❌ DELETE THIS - NOT PART OF SYSTEM
    teachingMethod: 'carousel',
    phases: [...],
  }
};
```

**Why**: The carousel system uses standard lesson data structure. No special properties needed.

### ❌ DO NOT create custom intro components with manual state management
```typescript
// WRONG - Old pattern without voice narration
export default function CustomIntro({ onComplete }) {
  const [currentScene, setCurrentScene] = useState(0);
  // ... manual scene navigation
  // ❌ This lacks intelligent voice narration
}
```

**Why**: Use `IntelligentLessonIntro` component for consistent voice narration experience.

---

## ✅ Correct Implementation Pattern

### 1. Lesson Data Structure (NO special properties)

Location: `src/lib/integrated-science-shs1-lessons-data.ts`

```typescript
{
  id: 'lesson-id',
  slug: 'lesson-slug',
  title: 'Lesson Title',
  subject: 'Integrated Science',
  // Standard lesson properties
  objectives: ['Objective 1', 'Objective 2'],
  introduction: 'Intro text',
  keyConcepts: [
    { title: 'Concept 1', content: 'Explanation...' },
    { title: 'Concept 2', content: 'Explanation...' }
  ],
  activities: {
    questions: [
      { question: 'Q1', answer: 'A1' },
      { question: 'Q2', answer: 'A2' }
    ]
  },
  pastQuestions: [
    {
      year: 2020,
      question: 'WASSCE question',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 'A',
      explanation: 'Why A is correct'
    }
  ],
  summary: 'Summary text',
  endOfLessonQuiz: [
    {
      question: 'Quiz question',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 'A',
      explanation: 'Explanation'
    }
  ]
}
// ✅ That's it! No carouselTeachingMethod or special carousel properties
```

### 2. Feature Flag Configuration

Location: `src/lib/featureFlags.ts`

```typescript
CAROUSEL_MODE: {
  enabled: true,
  autostart: true,  // ✅ Automatically activates carousel mode
  subjects: ['integrated-science'],
  lessons: [
    'is-dm-matter-states-properties',
    'is-cells-structure-function',
    'is-cells-division-mitosis-meiosis',
    'is-rocks-types-formation',
    // Add more lesson slugs here
  ],
},
```

### 3. Intro Component Pattern (WITH voice narration)

Location: `src/components/intros/shs/integrated-science/[LessonName]Intro.tsx`

```typescript
'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Icon1, Icon2, Icon3 } from 'lucide-react';

const LessonNameIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Icon1,  // ✅ Component reference, not JSX
      narration: "Text that will be spoken by the AI voice narrator. Make it conversational and engaging!",
      visualContent: "Main heading shown on screen",
      highlightWords: ['key', 'terms', 'to', 'emphasize'],
      teacherTip: "Pedagogical suggestion for teachers"
    },
    {
      id: 1,
      icon: Icon2,
      narration: "Scene 2 narration...",
      visualContent: "Scene 2 heading",
      highlightWords: ['more', 'keywords'],
      teacherTip: "Another teaching tip"
    },
    // Add 3-5 scenes total
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Full Lesson Title"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default LessonNameIntro;
```

**Key Points**:
- ✅ Use `IntelligentLessonIntro` component
- ✅ Icons are component references (not JSX like `<Icon />`)
- ✅ `narration` is the text spoken aloud by AI voice
- ✅ `visualContent` is the heading displayed
- ✅ `highlightWords` array contains keywords to emphasize
- ✅ `teacherTip` provides pedagogical guidance

---

## 🔄 How Carousel Mode Activates

### Automatic Activation
```typescript
// src/app/subjects/[level]/[subjectSlug]/[topicSlug]/[lessonSlug]/page.tsx

// 1. Check feature flags
const carouselConfig = FEATURE_FLAGS.CAROUSEL_MODE;

// 2. Auto-start if conditions met
if (carouselConfig.enabled && 
    carouselConfig.autostart &&
    carouselConfig.subjects.includes(subjectSlug) &&
    carouselConfig.lessons.includes(lessonSlug)) {
  setIsCarouselMode(true);  // ✅ Automatically activated
}
```

### What Gets Rendered
```typescript
// If carousel mode active:
<CarouselLesson
  lesson={lesson}
  levelSlug={levelSlug}
  subjectSlug={subjectSlug}
  localQuizzes={localQuizzes}
/>

// CarouselLesson renders these slides in order:
// 1. Intro (IntelligentLessonIntro component)
// 2. Objectives
// 3. Key Concepts (each concept = 1 slide)
// 4. Summary
// 5. WASSCE Past Questions
// 6. Practice Questions (from activities)
// 7. End of Lesson Quiz
```

---

## 📚 Reference Examples

### ✅ Perfect Reference Lessons (FOLLOW THESE)

1. **Chemistry - Nature and Scope**
   - URL: `/subjects/shs/integrated-science/chem-shs1-intro-scientific-methods-safety/chem-shs1-intro-scientific-methods-safety`
   - Intro: `src/components/intros/NatureAndScopeOfChemistryIntro.tsx`
   - ✅ Has intelligent voice narration
   - ✅ Uses IntelligentLessonIntro component
   - ✅ Carousel content flows perfectly

2. **States and Changes of Matter**
   - URL: `/subjects/shs/integrated-science/is-dm-matter-states-properties/is-dm-matter-states-properties`
   - Intro: `src/components/intros/shs/integrated-science/StatesAndChangesOfMatterIntro.tsx`
   - ✅ Migrated to new pattern

3. **Cell Structure and Function**
   - Intro: `src/components/intros/shs/integrated-science/CellStructureFunctionIntro.tsx`
   - ✅ Migrated to new pattern

4. **Cell Division**
   - Intro: `src/components/intros/shs/integrated-science/CellDivisionIntro.tsx`
   - ✅ Migrated to new pattern

5. **Rocks Types and Formation**
   - Intro: `src/components/intros/shs/integrated-science/RocksTypesFormationIntro.tsx`
   - ✅ Migrated to new pattern

---

## 🚀 Adding a New Carousel Lesson

### Step 1: Prepare Lesson Data
- Use standard lesson structure (see section 1)
- NO special carousel properties
- Ensure all sections are complete: objectives, keyConcepts, activities, pastQuestions, summary, endOfLessonQuiz

### Step 2: Add to Feature Flags
```typescript
// src/lib/featureFlags.ts
CAROUSEL_MODE: {
  enabled: true,
  autostart: true,
  subjects: ['integrated-science'],
  lessons: [
    // ... existing lessons
    'new-lesson-slug',  // ✅ Add here
  ],
}
```

### Step 3: Create Intro Component
```typescript
// src/components/intros/shs/integrated-science/NewLessonIntro.tsx
'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Icon1, Icon2 } from 'lucide-react';

const NewLessonIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Icon1,
      narration: "Engaging spoken introduction...",
      visualContent: "Visual heading",
      highlightWords: ['key', 'words'],
      teacherTip: "Teaching suggestion"
    },
    // 3-5 scenes total
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="New Lesson Title"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default NewLessonIntro;
```

### Step 4: Test
1. Navigate to lesson URL
2. Verify console shows: `🚀 AUTO-STARTING CAROUSEL MODE`
3. Verify intro has voice narration
4. Verify all carousel slides display correctly
5. Verify quiz at end works

---

## 🔍 Debugging Carousel Issues

### Issue: Carousel not activating
**Check**:
1. ✅ Lesson slug in `featureFlags.ts` CAROUSEL_MODE.lessons array?
2. ✅ Subject slug in CAROUSEL_MODE.subjects array?
3. ✅ `autostart: true` in feature flags?
4. ✅ Console shows "🚀 AUTO-STARTING CAROUSEL MODE"?

### Issue: Intro has no voice narration
**Check**:
1. ✅ Using `IntelligentLessonIntro` component?
2. ✅ Scenes have `narration` property?
3. ✅ Icons are component references (not JSX)?

### Issue: Carousel validation fails
**Check**:
1. ✅ Lesson has `keyConcepts` array?
2. ✅ Each concept has `title` and `content`?
3. ✅ Lesson has `summary` property?
4. ✅ Check console for validation errors

---

## 📖 Architecture Overview

```
User navigates to lesson
         ↓
page.tsx checks feature flags
         ↓
Is carousel enabled for this lesson?
    ↓ YES                    ↓ NO
CarouselLesson         Traditional LessonContent
         ↓
Intro → Objectives → Key Concepts → Summary → Past Q's → Practice → Quiz
         ↓
All slides use standard lesson data
(NO special carousel properties needed)
```

---

## 🎓 Ghana-Specific Context

**Always include**:
- Local examples (Volta Lake, Obuasi mines, kenkey, cassava)
- Career connections (Minerals Commission, Crops Research Institute)
- Cultural relevance (harmattan, rainy season, local foods)
- WASSCE exam focus

---

## � Table Formatting Standards

### ⚠️ CRITICAL: NO Markdown Tables

**DO NOT use markdown dash-dash tables:**
```markdown
❌ WRONG - Never use this format:
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
```

### ✅ Use Styled HTML Tables

All tables MUST be rendered using proper HTML with inline styles for beautiful, color-coded presentation:

```html
<h4 style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1f2937; padding: 0.75rem 1rem; border-radius: 8px 8px 0 0; margin: 1.5rem 0 0 0; font-weight: 600;">🧈 TABLE TITLE</h4>
<table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; background: #fffbeb; border-radius: 0 0 8px 8px; overflow: hidden; margin-bottom: 1.5rem;">
<thead>
<tr style="background: #fef3c7;">
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b; font-weight: 600;">Column 1</th>
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b; font-weight: 600;">Column 2</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom: 1px solid #fcd34d;">
<td style="padding: 0.75rem; font-weight: 600;">Row 1 Data</td>
<td style="padding: 0.75rem;">Row 1 Value</td>
</tr>
<tr style="border-bottom: 1px solid #fcd34d; background: #fef9e7;">
<td style="padding: 0.75rem; font-weight: 600;">Row 2 Data</td>
<td style="padding: 0.75rem;">Row 2 Value</td>
</tr>
</tbody>
</table>
```

### 🎨 Color Theme Reference

Use these color themes for different table categories:

**Yellow/Amber** (Energy, Fat-soluble, Primary):
- Header gradient: `#fbbf24 → #f59e0b`
- Background: `#fffbeb`
- Border: `#f59e0b`

**Blue** (Water, Processes, Secondary):
- Header gradient: `#60a5fa → #3b82f6`
- Background: `#eff6ff`
- Border: `#3b82f6`

**Purple** (Major items, Important):
- Header gradient: `#a78bfa → #8b5cf6`
- Background: `#f5f3ff`
- Border: `#8b5cf6`

**Orange** (Trace, Minor, Supporting):
- Header gradient: `#fb923c → #f97316`
- Background: `#fff7ed`
- Border: `#f97316`

**Green** (Ghanaian context, Tips, Success):
- Background: `linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)`
- Border-left: `#22c55e`

**Red** (Warnings, Deficiencies, Diseases):
- Background: `linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)`
- Border-left: `#ef4444`

### 📦 Info Card Templates

**Ghana Context Card (Green):**
```html
<div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 12px; padding: 1.25rem; border-left: 4px solid #22c55e; margin: 1.5rem 0;">
<h4 style="color: #166534; margin: 0 0 1rem 0; font-weight: 600;">🇬🇭 GHANAIAN CONTEXT</h4>
<div style="display: grid; gap: 0.75rem;">
<div style="background: white; padding: 0.75rem 1rem; border-radius: 8px;">
Content here...
</div>
</div>
</div>
```

**Warning/Disease Card (Red):**
```html
<div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 12px; padding: 1.25rem; border-left: 4px solid #ef4444; margin: 1.5rem 0;">
<h4 style="color: #991b1b; margin: 0 0 1rem 0; font-weight: 600;">⚠️ WARNING TITLE</h4>
<div style="display: grid; gap: 0.75rem;">
<div style="background: white; padding: 0.75rem 1rem; border-radius: 8px;">
<strong style="color: #dc2626;">Item:</strong><br/>
Description here
</div>
</div>
</div>
```

**Highlight Box (Blue):**
```html
<div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); border-radius: 12px; padding: 1.25rem; margin: 1rem 0; border-left: 4px solid #0ea5e9;">
<p style="margin: 0; font-size: 1.1rem;"><strong>Important Point</strong> - explanation here</p>
</div>
```

### ✅ Table Best Practices

1. **Always use alternating row colors** for readability
2. **Bold the first column** (usually the item name)
3. **Color-code deficiency/warning columns** with appropriate colors
4. **Add emojis** to table headers for visual appeal
5. **Include margin-bottom** on tables for spacing
6. **Use border-radius** for modern rounded corners

---

## �📝 Update History

- **Dec 14, 2025**: Established official pattern, removed `carouselTeachingMethod` property, migrated 4 science lessons to IntelligentLessonIntro
- **Future updates**: Document changes here with date

---

## 💡 For Future AI Agents

**READ THIS FIRST** before modifying carousel lessons:

1. ✅ Carousel uses **standard lesson data structure**
2. ✅ NO special `carouselTeachingMethod` property
3. ✅ Intro components MUST use `IntelligentLessonIntro`
4. ✅ Follow reference examples (Chemistry lessons)
5. ✅ Test voice narration after changes
6. ⚠️ If user says "intro looks different" → check if using IntelligentLessonIntro
7. ⚠️ If user says "no voice narrator" → check narration property in scenes

**When in doubt**: Compare to `NatureAndScopeOfChemistryIntro.tsx` - it's the gold standard.
