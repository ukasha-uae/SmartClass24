# 🚀 Quick Start: Carousel Migration

**Before starting ANY carousel work, read this checklist!**

---

## ✅ Pre-Flight Checklist

- [ ] Read [CAROUSEL_LESSONS_GUIDE.md](./CAROUSEL_LESSONS_GUIDE.md) - Know the patterns
- [ ] Check [CAROUSEL_MIGRATION_TRACKER.md](./CAROUSEL_MIGRATION_TRACKER.md) - See what's done
- [ ] Review gold standard: `src/components/intros/NatureAndScopeOfChemistryIntro.tsx`
- [ ] Verify lesson data structure in `src/lib/integrated-science-shs1-lessons-data.ts`

---

## ❌ Common Mistakes (DO NOT DO)

1. **❌ Adding `carouselTeachingMethod` property** - This does NOT exist
2. **❌ Creating custom intro without voice** - Use `IntelligentLessonIntro`
3. **❌ Using JSX for icons** - Use component reference: `Icon`, not `<Icon />`
4. **❌ Skipping Ghana context** - Always include local examples

---

## ✅ Correct Pattern (3 Steps)

### Step 1: Add to Feature Flags
```typescript
// src/lib/featureFlags.ts
CAROUSEL_MODE: {
  enabled: true,
  autostart: true,
  subjects: ['integrated-science'],
  lessons: [
    'existing-lesson-1',
    'your-new-lesson-slug',  // ✅ ADD HERE
  ],
}
```

### Step 2: Create Intro Component
```typescript
// src/components/intros/shs/integrated-science/YourLessonIntro.tsx
'use client';

import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Icon1, Icon2 } from 'lucide-react';

const YourLessonIntro = ({ onComplete }: { onComplete?: () => void }) => {
  const scenes = [
    {
      id: 0,
      icon: Icon1,  // ✅ Component ref, not JSX
      narration: "Welcome! [spoken text]",
      visualContent: "Visual Heading",
      highlightWords: ['key', 'words'],
      teacherTip: "Teaching tip"
    },
    // 3-5 scenes total
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Your Lesson Title"
      subject="Integrated Science"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default YourLessonIntro;
```

### Step 3: Test Checklist
- [ ] Console shows: `🚀 AUTO-STARTING CAROUSEL MODE`
- [ ] Voice narration plays on intro scenes
- [ ] All carousel slides display (objectives, concepts, summary, past questions, quiz)
- [ ] Quiz works at the end
- [ ] Mobile responsive
- [ ] No console errors

---

## 📊 Standard Lesson Data Structure

**NO special carousel properties needed! Use standard structure:**

```typescript
{
  id: 'lesson-id',
  slug: 'lesson-slug',
  title: 'Lesson Title',
  objectives: ['Objective 1', 'Objective 2'],
  introduction: 'Intro text',
  keyConcepts: [
    { title: 'Concept 1', content: 'Explanation' },
    { title: 'Concept 2', content: 'Explanation' }
  ],
  activities: {
    questions: [
      { question: 'Q', answer: 'A' }
    ]
  },
  pastQuestions: [
    {
      year: 2020,
      question: 'WASSCE Q',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 'A',
      explanation: 'Why'
    }
  ],
  summary: 'Summary text',
  endOfLessonQuiz: [
    {
      question: 'Quiz Q',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 'A',
      explanation: 'Why'
    }
  ]
}
```

---

## 🎓 Ghana Context Template

Include in every intro:
- **Local examples**: Volta Lake, Obuasi mines, kenkey, cassava, shea butter
- **Seasons**: Harmattan, rainy season
- **Institutions**: Crops Research Institute, Minerals Commission
- **Exam focus**: WASSCE, BECE
- **Career connections**: Local professions using the concepts

---

## � Table Formatting (CRITICAL)

### ❌ NEVER use markdown tables:
```markdown
| Col 1 | Col 2 |
|-------|-------|
| Data  | Data  |
```

### ✅ ALWAYS use styled HTML tables:
```html
<h4 style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1f2937; padding: 0.75rem 1rem; border-radius: 8px 8px 0 0; margin: 1.5rem 0 0 0; font-weight: 600;">📊 TABLE TITLE</h4>
<table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; background: #fffbeb; border-radius: 0 0 8px 8px; overflow: hidden; margin-bottom: 1.5rem;">
<thead>
<tr style="background: #fef3c7;">
<th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #f59e0b; font-weight: 600;">Column</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom: 1px solid #fcd34d;">
<td style="padding: 0.75rem;">Data</td>
</tr>
</tbody>
</table>
```

**Color Themes:**
- 🟡 Yellow/Amber: Energy, Fat-soluble (`#fbbf24 → #f59e0b`)
- 🔵 Blue: Water, Processes (`#60a5fa → #3b82f6`)
- 🟣 Purple: Major items (`#a78bfa → #8b5cf6`)
- 🟠 Orange: Trace, Minor (`#fb923c → #f97316`)
- 🟢 Green cards: Ghana context, Tips
- 🔴 Red cards: Warnings, Deficiencies

**See full templates in [CAROUSEL_LESSONS_GUIDE.md](./CAROUSEL_LESSONS_GUIDE.md)**

---

## �🔍 Debugging Quick Reference

| Issue | Check |
|-------|-------|
| Carousel not activating | Slug in `featureFlags.ts`? |
| No voice narration | Using `IntelligentLessonIntro`? |
| Validation fails | `keyConcepts` have title + content? |
| Console errors | Check lesson data structure |

---

## 📚 Reference Files

**Gold Standard Example**:
- `src/components/intros/NatureAndScopeOfChemistryIntro.tsx` ⭐

**Completed Lessons** (copy these patterns):
- `src/components/intros/shs/integrated-science/StatesAndChangesOfMatterIntro.tsx`
- `src/components/intros/shs/integrated-science/CellStructureFunctionIntro.tsx`
- `src/components/intros/shs/integrated-science/CellDivisionIntro.tsx`
- `src/components/intros/shs/integrated-science/RocksTypesFormationIntro.tsx`

**Core Components**:
- `src/components/CarouselLesson.tsx`
- `src/components/IntelligentLessonIntro.tsx`
- `src/lib/featureFlags.ts`

---

## 💡 Pro Tips

1. **Copy, don't create from scratch** - Use completed lessons as templates
2. **Test voice early** - Make sure narration sounds natural
3. **Ghana first** - Always include local context
4. **Mobile matters** - Test on actual devices
5. **Update tracker** - Mark progress in CAROUSEL_MIGRATION_TRACKER.md
6. **Quality over speed** - Each lesson should be excellent

---

## 🎯 Success Criteria

A lesson is complete when:
- ✅ Voice narration works perfectly
- ✅ All carousel slides display
- ✅ Quiz functionality works
- ✅ Mobile responsive
- ✅ Ghana context included
- ✅ No console errors
- ✅ Validation passes
- ✅ User tested (if possible)

---

## 📞 Need Help?

1. **First**: Check [CAROUSEL_LESSONS_GUIDE.md](./CAROUSEL_LESSONS_GUIDE.md)
2. **Second**: Compare to gold standard lesson
3. **Third**: Review completed lessons for patterns
4. **Last**: Document the issue for future reference

---

**Remember**: Every future AI agent should read this before starting carousel work!

---

**Current Status** (Dec 14, 2025):
- ✅ Phase 1 Complete: 5 lessons migrated
- 🎯 Next: Choose from Priority 1 list in CAROUSEL_MIGRATION_TRACKER.md
- 📊 Progress: ~0.5-0.6% of total lessons
