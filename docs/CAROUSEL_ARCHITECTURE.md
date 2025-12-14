# Carousel System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SMARTJHS CAROUSEL SYSTEM                     │
│                         Phase 1 Complete                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        CONTROL LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐      ┌──────────────────┐                │
│  │  Feature Flags   │      │  Admin Panel     │                │
│  │  featureFlags.ts │ ←──→ │  /admin/carousel │                │
│  │                  │      │  -config         │                │
│  │  • subjects []   │      │                  │                │
│  │  • levels []     │      │  Quick Toggles:  │                │
│  │  • topics []     │      │  ✓ Phase 1-6     │                │
│  │  • lessons []    │      │  ✓ Add/Remove    │                │
│  │  • enabled: bool │      │  ✓ Live Preview  │                │
│  └──────────────────┘      └──────────────────┘                │
│           │                                                      │
│           │ Check Eligibility                                   │
│           ▼                                                      │
│  ┌──────────────────┐                                          │
│  │ isCarouselEnabled()                                         │
│  │ ✓ Level check                                               │
│  │ ✓ Subject check                                             │
│  │ ✓ Topic check                                               │
│  │ ✓ Lesson check                                              │
│  └──────────────────┘                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      VALIDATION LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐      ┌──────────────────┐                │
│  │ Lesson Validator │      │  Audit Script    │                │
│  │ lessonValidator  │      │  audit-lessons.js│                │
│  │      .ts         │      │                  │                │
│  │                  │      │  Scans:          │                │
│  │  Checks:         │      │  • All content/  │                │
│  │  ✓ Objectives    │      │  • Validates all │                │
│  │  ✓ Content       │      │  • Reports:      │                │
│  │  ✓ Summary       │      │    - Ready       │                │
│  │  ✓ Questions     │      │    - Needs work  │                │
│  │  ✓ Slide count   │      │  • JSON export   │                │
│  │                  │      │                  │                │
│  │  Returns:        │      │  Run:            │                │
│  │  • isValid       │      │  node scripts/   │                │
│  │  • errors []     │      │    audit...      │                │
│  │  • warnings []   │      │                  │                │
│  │  • slideCount    │      └──────────────────┘                │
│  │  • recommend []  │                                           │
│  └──────────────────┘                                          │
│           │                                                      │
│           │ Valid?                                              │
│           ▼                                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      RENDERING LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Lesson Page (page.tsx)                      │   │
│  │                                                          │   │
│  │  useEffect(() => {                                       │   │
│  │    if (isCarouselEnabled() && validationPassed) {        │   │
│  │      setCarouselEligible(true)                          │   │
│  │    }                                                     │   │
│  │  })                                                      │   │
│  │                                                          │   │
│  │  Render:                                                 │   │
│  │  {carouselEligible ? <CarouselLesson /> : <Traditional>}│   │
│  └─────────────────────────────────────────────────────────┘   │
│                      │                                          │
│         ┌────────────┴────────────┐                            │
│         ▼                          ▼                            │
│  ┌─────────────┐          ┌──────────────┐                    │
│  │  Carousel   │          │ Traditional  │                    │
│  │  Mode       │          │ Scrolling    │                    │
│  │             │          │ View         │                    │
│  │ Components: │          │              │                    │
│  │ • Intro     │          │ (Fallback)   │                    │
│  │ • Carousel  │          └──────────────┘                    │
│  │ • Nav       │                                               │
│  └─────────────┘                                              │
│         │                                                      │
│         ▼                                                      │
│  ┌─────────────────────────────────────────────────────┐     │
│  │         IntelligentLessonIntro                       │     │
│  │                                                      │     │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   │     │
│  │  │Scene 1 │→ │Scene 2 │→ │Scene 3 │→ │Scene 4 │   │     │
│  │  │Rocket  │  │Target  │  │Bulb    │  │Trophy  │   │     │
│  │  └────────┘  └────────┘  └────────┘  └────────┘   │     │
│  │       ↓           ↓           ↓           ↓        │     │
│  │    Voice      Voice      Voice      Voice         │     │
│  │  Narration   Narration  Narration  Narration      │     │
│  │                                                      │     │
│  │  Controls: [Prev] [Play/Pause] [Next] [Reset]      │     │
│  └─────────────────────────────────────────────────────┘     │
│         │                                                      │
│         ▼                                                      │
│  ┌─────────────────────────────────────────────────────┐     │
│  │            CarouselLesson                            │     │
│  │                                                      │     │
│  │  Slide 1: Objectives                                │     │
│  │  Slide 2-N: Content (concepts)                      │     │
│  │  Slide N+1: Summary                                 │     │
│  │  Slide N+2-M: Past Questions                        │     │
│  │  Slide M+1: Quiz                                    │     │
│  │                                                      │     │
│  │  Navigation: [← Prev] [• • •] [Next →]             │     │
│  │                                                      │     │
│  │  Mobile Optimized:                                  │     │
│  │  • 48px touch targets                               │     │
│  │  • Responsive text                                  │     │
│  │  • Stacked layouts                                  │     │
│  │  • Abbreviated labels                               │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      ANALYTICS LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              analytics.ts                                 │  │
│  │                                                           │  │
│  │  trackCarouselUsage()        trackCarouselError()        │  │
│  │  • Slide views               • Validation errors         │  │
│  │  • Navigation actions        • Render errors             │  │
│  │  • Time spent                • Audio errors              │  │
│  │  • Completions               • Context capture           │  │
│  │                                                           │  │
│  │  CarouselSessionTracker                                  │  │
│  │  • Session ID                                            │  │
│  │  • Start/end time                                        │  │
│  │  • Slides viewed []                                      │  │
│  │  • Navigation pattern []                                 │  │
│  │  • Voice used: bool                                      │  │
│  │  • Completed: bool                                       │  │
│  │  • Quiz score                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │                              │                        │
│         ▼                              ▼                        │
│  ┌─────────────┐              ┌─────────────┐                 │
│  │  Console    │              │  Firebase    │                 │
│  │  (Dev mode) │              │  Analytics   │                 │
│  │             │              │  (TODO)      │                 │
│  └─────────────┘              └─────────────┘                 │
│                                       │                         │
│                                       ▼                         │
│                              ┌─────────────┐                  │
│                              │   Sentry    │                  │
│                              │   Errors    │                  │
│                              │   (TODO)    │                  │
│                              └─────────────┘                  │
│                                                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      DATA FLOW                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User Navigates to Lesson                                       │
│         │                                                        │
│         ▼                                                        │
│  Check Feature Flags ──→ Not Eligible ──→ Traditional View     │
│         │                                                        │
│         ▼ Eligible                                              │
│  Validate Lesson ──→ Invalid ──→ Log Error ──→ Traditional     │
│         │                                                        │
│         ▼ Valid                                                 │
│  Show Carousel Banner                                           │
│         │                                                        │
│         ▼ User Clicks "Start Carousel Mode"                    │
│  Render IntelligentLessonIntro                                 │
│         │                                                        │
│         ▼ Voice plays, scenes advance                           │
│  Create CarouselSessionTracker                                 │
│         │                                                        │
│         ▼ User completes intro                                  │
│  Render CarouselLesson                                         │
│         │                                                        │
│         ▼ User navigates slides                                 │
│  Track each: view, next, previous, jump                        │
│         │                                                        │
│         ▼ User completes lesson                                 │
│  Track completion, quiz score                                   │
│         │                                                        │
│         ▼                                                        │
│  End session, send analytics                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      ROLLBACK FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Issue Detected                                                 │
│         │                                                        │
│         ├──→ Single Lesson Issue                               │
│         │    └─→ Remove from lessons []                        │
│         │                                                        │
│         ├──→ Topic-Wide Issue                                  │
│         │    └─→ Remove from topics []                         │
│         │                                                        │
│         └──→ Critical Bug                                       │
│              ├─→ Set enabled: false                            │
│              └─→ Or NEXT_PUBLIC_ENABLE_CAROUSEL=false          │
│                                                                  │
│  All users immediately see traditional view                     │
│  (No app restart needed)                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXPANSION PATH                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 1 (Current) ──→ Phase 2 ──→ Phase 3 ──→ ... ──→ Phase 6│
│     4 lessons         30 lessons   100 lessons      800+ lessons│
│                                                                  │
│  For each phase:                                                │
│  1. Create intros for new lessons                               │
│  2. Run audit script                                            │
│  3. Fix validation errors                                       │
│  4. Update feature flags                                        │
│  5. Test on mobile                                              │
│  6. Monitor analytics                                           │
│  7. Collect feedback                                            │
│  8. Iterate                                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Legend:
  ┌─────┐
  │ Box │  = Component / Module
  └─────┘
     │     = Data flow
     ▼     = Process direction
     ─→    = Alternative path
     ✓     = Feature / Check
