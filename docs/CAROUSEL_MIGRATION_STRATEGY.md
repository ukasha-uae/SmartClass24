# Carousel Migration Strategy
*Safe conversion plan for transforming SmartJHS to carousel-based learning*

**Last Updated**: December 14, 2025  
**Status**: Phase 1 Complete - Chemistry & Integrated Science Migrated

---

## 🎯 Overview

Transform the entire lesson system from vertical scrolling to horizontal carousel navigation while maintaining app stability and user experience.

## 📊 Current State Assessment

### ✅ Completed (Production Ready)
- **CarouselLesson** component (fully mobile-optimized)
- **IntelligentLessonIntro** component (voice-narrated)
- **Feature Flag System** with autostart capability
- **Lesson Validation** system
- Carousel/Traditional toggle system
- Mobile-first responsive design

### ✅ Completed Lessons (5 Total)
1. **Chemistry - Nature and Scope** (`chem-shs1-intro-scientific-methods-safety`)
2. **Integrated Science - States and Changes of Matter** (`is-dm-matter-states-properties`)
3. **Integrated Science - Cell Structure and Function** (`is-cells-structure-function`)
4. **Integrated Science - Cell Division** (`is-cells-division-mitosis-meiosis`)
5. **Integrated Science - Rocks Types and Formation** (`is-rocks-types-formation`)

### 📍 Scope
- **Total Subjects**: ~15+ (JHS: Mathematics, English, Science, ICT, etc.)
- **Total Topics**: ~200+ across all levels
- **Total Lessons**: ~800-1000+ individual lessons
- **Current Format**: Vertical scrolling with sections
- **Target Format**: Horizontal carousel with bite-sized slides

---

## 🛡️ Safety-First Approach

### Phase 1: Foundation (Week 1-2)
**Goal**: Establish infrastructure without breaking existing functionality

#### 1.1 Feature Flag System
```typescript
// src/lib/featureFlags.ts
export const FEATURE_FLAGS = {
  CAROUSEL_MODE: {
    enabled: true,
    subjects: ['mathematics'], // Start with one subject
    levels: ['shs3'], // Start with one level
    topics: ['algebra'], // Start with one topic
    lessons: ['quadratic-equations'] // Currently tested
  }
}

export function isCarouselEnabled(
  level: string,
  subject: string,
  topic?: string,
  lesson?: string
): boolean {
  if (!FEATURE_FLAGS.CAROUSEL_MODE.enabled) return false;
  
  // Granular control
  if (lesson && !FEATURE_FLAGS.CAROUSEL_MODE.lessons.includes(lesson)) return false;
  if (topic && !FEATURE_FLAGS.CAROUSEL_MODE.topics.includes(topic)) return false;
  if (!FEATURE_FLAGS.CAROUSEL_MODE.levels.includes(level)) return false;
  if (!FEATURE_FLAGS.CAROUSEL_MODE.subjects.includes(subject)) return false;
  
  return true;
}
```

**Actions**:
- ✅ Create `featureFlags.ts` with granular controls
- ✅ Update `page.tsx` to use feature flag instead of hardcoded slug check
- ✅ Add environment variable support (`NEXT_PUBLIC_ENABLE_CAROUSEL`)
- ✅ Create admin toggle in settings for teachers/admins to enable beta features

#### 1.2 Lesson Content Validator
```typescript
// src/lib/lessonValidator.ts
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  slideCount: number;
}

export function validateLessonForCarousel(lesson: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check required fields
  if (!lesson.objectives || lesson.objectives.length === 0) {
    errors.push('No learning objectives defined');
  }
  
  if (!lesson.content || lesson.content.length === 0) {
    errors.push('No content sections defined');
  }
  
  // Check content suitability
  lesson.content?.forEach((section: any, index: number) => {
    if (section.text && section.text.length > 500) {
      warnings.push(`Section ${index + 1} has lengthy text (${section.text.length} chars). Consider breaking down.`);
    }
    
    if (!section.title) {
      warnings.push(`Section ${index + 1} missing title`);
    }
  });
  
  // Check past questions
  if (!lesson.pastQuestions || lesson.pastQuestions.length === 0) {
    warnings.push('No past questions available');
  }
  
  // Calculate estimated slides
  const slideCount = calculateSlideCount(lesson);
  
  if (slideCount > 20) {
    warnings.push(`High slide count (${slideCount}). Consider splitting lesson.`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    slideCount
  };
}

function calculateSlideCount(lesson: any): number {
  let count = 1; // Objectives
  count += lesson.content?.length || 0; // Concepts
  count += 1; // Summary
  count += lesson.pastQuestions?.length || 0; // Past questions
  count += lesson.activities?.length || 0; // Activities
  count += 1; // Quiz
  return count;
}
```

**Actions**:
- ✅ Create validation utility
- ✅ Add validation check before rendering carousel
- ✅ Fallback to traditional view if validation fails
- ✅ Log validation results for content improvement

#### 1.3 Analytics & Monitoring
```typescript
// src/lib/analytics.ts
export function trackCarouselUsage(data: {
  lessonSlug: string;
  slideIndex: number;
  action: 'view' | 'next' | 'previous' | 'jump' | 'complete';
  timeSpent?: number;
}) {
  // Track to Firebase Analytics or your analytics service
  console.log('[Carousel Analytics]', data);
  // TODO: Implement actual tracking
}

export function trackCarouselError(data: {
  lessonSlug: string;
  error: string;
  context: string;
}) {
  console.error('[Carousel Error]', data);
  // TODO: Implement error tracking (Sentry, etc.)
}
```

---

### Phase 2: Content Preparation (Week 2-4)
**Goal**: Prepare existing lessons for carousel format

#### 2.1 Content Audit Script
```javascript
// scripts/audit-lessons.js
const fs = require('fs');
const path = require('path');

function auditAllLessons() {
  const contentDir = path.join(__dirname, '../src/content');
  const report = {
    total: 0,
    carouselReady: 0,
    needsWork: 0,
    lessons: []
  };
  
  // Recursively scan content directory
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (file.endsWith('.ts') || file.endsWith('.json')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const validation = validateLesson(content);
        
        report.total++;
        if (validation.isValid && validation.warnings.length < 3) {
          report.carouselReady++;
        } else {
          report.needsWork++;
        }
        
        report.lessons.push({
          path: fullPath,
          validation
        });
      }
    });
  }
  
  scanDirectory(contentDir);
  
  // Generate report
  fs.writeFileSync(
    path.join(__dirname, '../CAROUSEL_READINESS_REPORT.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log(`Total Lessons: ${report.total}`);
  console.log(`Carousel Ready: ${report.carouselReady}`);
  console.log(`Needs Work: ${report.needsWork}`);
}

auditAllLessons();
```

**Actions**:
- ✅ Run audit script to identify all lessons
- ✅ Categorize lessons by readiness level
- ✅ Prioritize high-traffic lessons (Mathematics SHS3)
- ✅ Create backlog of content improvements needed

#### 2.2 Intelligent Intro Creation Plan

**Priority 1 (SHS3 Mathematics - WASSCE Focus)**:
- ✅ Quadratic Equations (DONE)
- ⬜ Factorization of Quadratic Expressions
- ⬜ Completing the Square
- ⬜ Quadratic Formula
- ⬜ Simultaneous Equations
- ⬜ Inequalities
- ⬜ Indices and Logarithms
- ⬜ Trigonometry

**Priority 2 (SHS1-2 Mathematics)**:
- ⬜ Algebra Basics
- ⬜ Number Systems
- ⬜ Geometry
- ⬜ Statistics

**Priority 3 (JHS Mathematics)**:
- ⬜ Fractions
- ⬜ Percentages
- ⬜ Basic Algebra

**Template for Creating Intros**:
```typescript
// src/components/intros/[LessonName]Intro.tsx
import React from 'react';
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { BookOpen, Target, Lightbulb, Trophy } from 'lucide-react';

const [LessonName]Intro = ({ onComplete }: { onComplete: () => void }) => {
  const scenes = [
    {
      icon: BookOpen,
      title: "Welcome to [Topic]",
      narration: "Welcome to our lesson on [topic]. Today, we'll explore...",
      teacherTip: "This is a crucial WASSCE topic."
    },
    {
      icon: Target,
      title: "Real-World Application",
      narration: "You'll find [topic] used in...",
      teacherTip: "Help students see practical relevance."
    },
    {
      icon: Lightbulb,
      title: "Key Concepts",
      narration: "We'll cover three main ideas...",
      teacherTip: "These concepts build on previous knowledge."
    },
    {
      icon: Trophy,
      title: "Your Goal",
      narration: "By the end, you'll be able to...",
      teacherTip: "Reinforce learning objectives."
    }
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="[Lesson Title]"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
};

export default [LessonName]Intro;
```

---

### Phase 3: Gradual Rollout (Week 4-8)
**Goal**: Enable carousel for more lessons systematically

#### 3.1 Rollout Schedule

**Week 4**: SHS3 Mathematics (Core WASSCE Topics)
```typescript
FEATURE_FLAGS.CAROUSEL_MODE = {
  enabled: true,
  subjects: ['mathematics'],
  levels: ['shs3'],
  topics: ['algebra', 'geometry', 'trigonometry'],
  lessons: [
    'quadratic-equations',
    'factorization',
    'completing-the-square',
    'quadratic-formula'
  ]
}
```

**Week 5**: Full SHS3 Mathematics
```typescript
topics: ['algebra', 'geometry', 'trigonometry', 'statistics', 'calculus']
lessons: ['*'] // All lessons in enabled topics
```

**Week 6**: SHS1-2 Mathematics
```typescript
levels: ['shs1', 'shs2', 'shs3']
```

**Week 7**: All Mathematics Levels
```typescript
levels: ['jhs1', 'jhs2', 'jhs3', 'shs1', 'shs2', 'shs3']
```

**Week 8**: Expand to Other Subjects
```typescript
subjects: ['mathematics', 'english', 'science']
```

#### 3.2 Testing Protocol

**Before Each Rollout Phase**:
1. ✅ **Functionality Test**
   - All navigation buttons work
   - Voice narration plays correctly
   - Slides transition smoothly
   - Previous/Next disabled states correct

2. ✅ **Mobile Test**
   - Test on 3-4 different phone models
   - Test on slow 3G connection
   - Verify touch targets work
   - Check text readability

3. ✅ **Content Test**
   - All lesson content displays properly
   - Images/diagrams render correctly
   - Formulas/math symbols display
   - Past questions format correctly

4. ✅ **Performance Test**
   - Load time < 3 seconds
   - Smooth animations (60fps)
   - Memory usage acceptable
   - No console errors

5. ✅ **Accessibility Test**
   - Screen reader compatibility
   - Keyboard navigation works
   - Color contrast sufficient
   - Font sizes readable

#### 3.3 User Feedback Collection

**In-App Survey After Carousel Lesson**:
```typescript
// Show after completing 3 carousel lessons
{
  question: "How do you find the new carousel lesson format?",
  options: [
    "Love it! Much better",
    "Good, but needs improvement",
    "Prefer the old format",
    "Having technical issues"
  ]
}
```

**Metrics to Track**:
- Lesson completion rate (carousel vs traditional)
- Time spent per lesson
- Navigation patterns (how often Previous is used)
- Drop-off points (which slides students abandon)
- Quiz scores (compare carousel vs traditional)
- Voice narration usage (play/pause/skip rates)

---

### Phase 4: Optimization (Week 8-10)
**Goal**: Refine based on feedback and data

#### 4.1 Performance Optimizations

**Lazy Load Slide Content**:
```typescript
// Only render current slide + adjacent slides
const visibleSlides = [
  currentSlideIndex - 1,
  currentSlideIndex,
  currentSlideIndex + 1
];

{slides.map((slide, index) => {
  if (!visibleSlides.includes(index)) {
    return <div key={index} />; // Placeholder
  }
  return renderSlide(slide, index);
})}
```

**Preload Voice Audio**:
```typescript
// Preload narration for next slide
useEffect(() => {
  if (currentSlideIndex < slides.length - 1) {
    const nextSlide = slides[currentSlideIndex + 1];
    if (nextSlide.narration) {
      preloadAudio(nextSlide.narration);
    }
  }
}, [currentSlideIndex]);
```

**Optimize Images**:
- Compress lesson images (WebP format)
- Use responsive images (`<Image>` component)
- Lazy load images in future slides

#### 4.2 Content Improvements

**Break Down Long Lessons**:
- Lessons with > 20 slides → split into multiple lessons
- Add "Part 1", "Part 2" naming
- Create lesson series/sequences

**Enhance Interactivity**:
- Add more activities slides (not just content)
- Inline quick checks (1-question quizzes between concepts)
- Interactive diagrams with annotations

**Better Visual Design**:
- Custom icons for different lesson types
- Subject-specific color schemes
- Animated transitions between concepts

---

### Phase 5: Full Migration (Week 10-12)
**Goal**: Make carousel the default, remove traditional view

#### 5.1 Deprecation Plan

**Week 10**: Carousel Default for All Lessons
```typescript
// page.tsx - reverse the toggle logic
const [useTraditionalView, setUseTraditionalView] = useState(false);

// Show banner: "Switch to classic view"
```

**Week 11**: Hide Traditional Toggle for New Users
- Existing users keep toggle (grandfather clause)
- New signups see carousel only
- Collect feedback on any issues

**Week 12**: Remove Traditional View Code
```typescript
// Clean up old code
// Remove traditional lesson rendering
// Remove toggle UI components
// Update documentation
```

#### 5.2 Migration Checklist

- [ ] All lessons have intelligent intros created
- [ ] All lessons validated for carousel format
- [ ] All past questions formatted correctly
- [ ] All images optimized and displaying
- [ ] All formulas rendering properly
- [ ] Voice narration tested on all devices
- [ ] Performance metrics acceptable
- [ ] User feedback overwhelmingly positive (>80%)
- [ ] No critical bugs in issue tracker
- [ ] Documentation updated
- [ ] Teachers trained on new format
- [ ] Parent communication sent
- [ ] Backup plan documented

---

## 🔄 Rollback Strategy

### If Issues Arise

**Level 1: Single Lesson Issue**
- Disable carousel for that lesson only
- Add to feature flag exclusion list
- Fix content/code issue
- Re-enable after testing

**Level 2: Topic-Wide Issue**
- Disable carousel for entire topic
- Investigate common pattern
- Fix and test thoroughly
- Gradual re-enable lesson by lesson

**Level 3: Critical Bug**
- Disable carousel globally via feature flag
- All lessons revert to traditional view
- Emergency fix and hotfix deployment
- Gradual re-enable by level

**Emergency Rollback Command**:
```typescript
// Set in environment variable
NEXT_PUBLIC_ENABLE_CAROUSEL=false

// Or in featureFlags.ts
FEATURE_FLAGS.CAROUSEL_MODE.enabled = false;
```

---

## 📋 Implementation Checklist

### Infrastructure
- [ ] Create feature flag system
- [ ] Add lesson validator utility
- [ ] Set up analytics tracking
- [ ] Create audit script
- [ ] Add error monitoring

### Content Creation
- [ ] Audit all existing lessons (run script)
- [ ] Create intro components for Priority 1 lessons (8 lessons)
- [ ] Create intro components for Priority 2 lessons (15 lessons)
- [ ] Create intro components for Priority 3 lessons (20 lessons)
- [ ] Review and optimize content for carousel format

### Testing
- [ ] Set up testing checklist template
- [ ] Test on Android devices (3+ models)
- [ ] Test on iOS devices (2+ models)
- [ ] Test on slow network conditions
- [ ] Test with screen readers
- [ ] Test with keyboard navigation

### Rollout
- [ ] Week 4: Enable for 4 SHS3 Math lessons
- [ ] Week 5: Enable for all SHS3 Math
- [ ] Week 6: Enable for SHS1-2 Math
- [ ] Week 7: Enable for all Math levels
- [ ] Week 8: Enable for English & Science
- [ ] Collect feedback after each phase

### Optimization
- [ ] Implement lazy loading for slides
- [ ] Preload voice audio
- [ ] Optimize images
- [ ] Break down long lessons
- [ ] Add more interactive elements

### Migration
- [ ] Make carousel default (Week 10)
- [ ] Hide toggle for new users (Week 11)
- [ ] Remove traditional view code (Week 12)
- [ ] Update all documentation
- [ ] Communicate changes to stakeholders

---

## 🎓 Training Materials Needed

### For Teachers
- Video tutorial on carousel navigation
- Guide to creating effective lesson intros
- Best practices for bite-sized content
- How to monitor student progress in carousel mode

### For Students
- Welcome video showing new format
- Tips for using voice narration effectively
- How to navigate lessons efficiently
- FAQ document

### For Parents
- Email explaining new learning format
- Benefits of carousel/bite-sized learning
- How to support children using the app
- Contact for feedback/issues

---

## ⚡ Quick Start Commands

```bash
# Run lesson audit
node scripts/audit-lessons.js

# Enable carousel for testing (add to .env.local)
NEXT_PUBLIC_ENABLE_CAROUSEL=true

# Test specific lesson
# Navigate to lesson → Check feature flag → Verify carousel appears

# Monitor errors
# Check browser console, Firebase Analytics, error tracking service

# Rollback if needed
# Set NEXT_PUBLIC_ENABLE_CAROUSEL=false or modify featureFlags.ts
```

---

## 📊 Success Metrics

**Target KPIs**:
- **Lesson Completion Rate**: +15% improvement
- **Time on Task**: -10% (more efficient learning)
- **Quiz Scores**: +5% improvement
- **Student Satisfaction**: >80% positive feedback
- **Mobile Usage**: +20% increase
- **Voice Narration Usage**: >60% of students use it

**Monitor Weekly**:
- Bug reports (target: < 5 critical bugs per week)
- Performance metrics (target: 95% of loads < 3s)
- User feedback sentiment (target: >80% positive)
- Completion rates by subject/level

---

## 🎯 Final Notes

This is a **marathon, not a sprint**. Prioritize:
1. **Safety**: Don't break existing functionality
2. **Quality**: Each lesson should be excellent, not just converted
3. **Feedback**: Listen to students and teachers
4. **Iteration**: Improve based on data, not assumptions

The carousel format is proven successful with Quadratic Equations. Now, systematically expand it while maintaining the quality and safety that students depend on.
