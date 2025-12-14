# Carousel Migration: Quick Reference Card

## 🎯 Current Status
**Phase 1 Complete** | Infrastructure Ready | 1 Pilot Lesson Live

---

## 📁 New Files Created

```
src/lib/
├── featureFlags.ts       ← Control what's enabled
├── lessonValidator.ts    ← Check lesson quality  
└── analytics.ts          ← Track usage & errors

src/app/admin/
└── carousel-config/
    └── page.tsx          ← Admin control panel

scripts/
└── audit-lessons.js      ← Scan all lessons

docs/
├── CAROUSEL_MIGRATION_STRATEGY.md  ← Full plan
└── PHASE_1_COMPLETE.md             ← This milestone
```

---

## 🚀 Quick Commands

```bash
# Check lesson readiness
node scripts/audit-lessons.js

# View detailed report  
cat CAROUSEL_READINESS_REPORT.json

# Access admin panel
# Navigate to: /admin/carousel-config

# Check current config
console.log(getCarouselConfig())
```

---

## 🎛️ Feature Flag Control

### Current Configuration
```typescript
{
  enabled: true,
  subjects: ['mathematics'],
  levels: ['shs3'],  
  topics: ['algebra'],
  lessons: ['quadratic-equations'] // ← Only this works now
}
```

### How to Enable More Lessons

**Option 1: Admin UI** (Easiest)
1. Go to `/admin/carousel-config`
2. Type lesson name
3. Press Enter
4. Done!

**Option 2: Code** (More control)
```typescript
// src/lib/featureFlags.ts
lessons: [
  'quadratic-equations',
  'factorization',        // ← Add these
  'completing-the-square',
  'quadratic-formula'
]
```

**Option 3: Rollout Phase** (Quickest)
```typescript
// Apply Phase 2 (all SHS3 math)
applyRolloutPhase('PHASE_2_SHS3_ALL_MATH');
```

---

## ✅ Lesson Requirements

For carousel to appear, lesson MUST have:

```typescript
{
  objectives: ['...'],     // ← Required
  content: [               // ← Required  
    { title: '...', text: '...' }
  ],
  summary: {               // ← Recommended
    keyPoints: ['...']
  },
  pastQuestions: [...]     // ← Recommended
}
```

**Optimal Slide Count**: 8-15 slides  
**Warning Threshold**: > 20 slides (too long)

---

## 🎨 Creating New Intro

```typescript
// src/components/intros/FactorizationIntro.tsx
import IntelligentLessonIntro from '@/components/IntelligentLessonIntro';
import { Rocket, Target, Lightbulb, Trophy } from 'lucide-react';

export default function FactorizationIntro({ onComplete }) {
  const scenes = [
    {
      icon: Rocket,
      title: "Welcome to Factorization",
      narration: "Today we'll learn how to break down expressions...",
      teacherTip: "This builds on basic algebra."
    },
    // Add 3-4 scenes total
  ];

  return (
    <IntelligentLessonIntro
      lessonTitle="Factorization of Quadratics"
      subject="Mathematics"
      scenes={scenes}
      onComplete={onComplete}
    />
  );
}
```

---

## 📊 Rollout Timeline

| Phase | Scope | Lessons | Target |
|-------|-------|---------|--------|
| **1** ✅ | SHS3 Algebra Core | 4 | Week 4 |
| **2** | All SHS3 Math | ~30 | Week 5 |
| **3** | All SHS Math | ~100 | Week 6 |
| **4** | All Math (JHS+SHS) | ~200 | Week 7 |
| **5** | Math + Eng + Sci | ~400 | Week 8 |
| **6** | All Subjects | 800+ | Week 12 |

**We are here**: Phase 1 infrastructure complete

---

## 🔍 Testing Checklist

Before enabling a new lesson:

- [ ] Run audit script to validate structure
- [ ] Create intelligent intro component
- [ ] Test on mobile (3+ devices)
- [ ] Verify voice narration works
- [ ] Check all navigation buttons
- [ ] Test quiz integration
- [ ] Monitor console for errors
- [ ] Add to feature flags
- [ ] Update documentation

---

## 🛡️ Safety Features

**Kill Switches** (in order of severity)
1. Environment variable: `NEXT_PUBLIC_ENABLE_CAROUSEL=false`
2. Global toggle: `FEATURE_FLAGS.CAROUSEL_MODE.enabled = false`
3. Remove from lesson list: Delete from `lessons: [...]`

**Automatic Fallbacks**
- Validation fails → Traditional view
- Missing intro → Skip intro, show carousel
- Any error → Log and show traditional view

---

## 📈 Analytics Events

Auto-tracked (ready for Firebase):
```typescript
// Navigation
trackCarouselUsage({ action: 'next', slideIndex: 2 })
trackCarouselUsage({ action: 'previous', slideIndex: 1 })

// Completion  
trackCarouselUsage({ action: 'complete' })

// Errors
trackCarouselError({ error: 'validation_failed', ... })

// Sessions
CarouselSessionTracker.endSession()
```

View in console: `[Carousel Analytics]` prefix

---

## 💡 Quick Tips

**For Developers**
- Always use `isCarouselEnabled()` to check eligibility
- Validate lessons before carousel render
- Track errors with context for debugging
- Test mobile-first (primary use case)

**For Content Creators**
- Keep text blocks 300-500 characters
- Aim for 8-15 slides per lesson
- Add 2-3 past questions minimum
- Write natural narration (lowercase!)

**For Admins**
- Start with Phase 1 (safest)
- Monitor analytics weekly
- Collect user feedback after 3 lessons
- Rollback quickly if issues arise

---

## 🎯 Success Metrics

**Technical** ✅
- 0 TypeScript errors
- Mobile optimized (48px targets)
- Smooth 60fps animations

**Content** (In Progress)
- 1/4 Phase 1 intros complete
- 0/800 total lessons ready
- 5 lessons found, 5 need work

**User** (Coming Soon)
- Completion rate: Target +15%
- Satisfaction: Target >80%
- Quiz scores: Target +5%

---

## 📞 Need Help?

**Issue**: Carousel not showing
**Fix**: Check `/admin/carousel-config` → Verify lesson in list

**Issue**: Validation failing
**Fix**: Run `node scripts/audit-lessons.js` → Review errors

**Issue**: Voice not working
**Fix**: Check lowercase narration → Test on different browser

**Issue**: Performance slow
**Fix**: Check slide count → Split lesson if >20

---

## 🎉 What's Next?

**This Week**:
1. Create 3 more intros (Factorization, Completing Square, Quadratic Formula)
2. Test on 5+ mobile devices
3. Set up Firebase Analytics

**Next Week**:
1. Expand to all SHS3 algebra
2. Collect student feedback
3. Optimize based on data

**Month 2**:
1. Roll out to all SHS3 math
2. Begin SHS1-2 content creation
3. Add swipe gestures

---

**Remember**: Slow and steady wins the race. Quality over speed! 🐢🏆
