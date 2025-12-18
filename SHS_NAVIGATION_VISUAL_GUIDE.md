# SHS Navigation - Quick Visual Guide

## Before vs After

### ❌ BEFORE (Old Flow)
```
Home Page
  └─ Click "SHS Campus"
       └─ /subjects/shs
            └─ Only Core Subjects (Math, English, Science, Social)
            └─ NO access to Programmes/Electives
            └─ Users didn't know about /shs-programmes
```

**Problems**:
- Dead-end navigation
- Missing programme electives
- Poor discoverability

---

### ✅ AFTER (New Flow)
```
Home Page
  └─ Click "SHS Campus"
       └─ /shs (NEW HUB)
            ├─ Section 1: CORE SUBJECTS (4 cards)
            │    ├─ Mathematics → /subjects/shs/mathematics
            │    ├─ English Language → /subjects/shs/english-language
            │    ├─ Integrated Science → /subjects/shs/integrated-science
            │    └─ Social Studies → /subjects/shs/social-studies
            │
            ├─ Section 2: PROGRAMMES (8 cards)
            │    ├─ General Science → /shs-programmes/general-science
            │    │                      └─ Physics, Chemistry, Biology, Elective Math
            │    ├─ General Arts → /shs-programmes/general-arts
            │    │                   └─ Literature, History, Geography, Government
            │    ├─ Business → /shs-programmes/business
            │    │              └─ Accounting, Management, Economics
            │    └─ [5 more programmes...]
            │
            └─ Section 3: QUICK LINKS
                 ├─ NSMQ Battles
                 ├─ Virtual Labs
                 ├─ Past Questions
                 └─ Study Groups
```

**Benefits**:
- ✅ Single source of truth
- ✅ Clear core vs elective distinction
- ✅ Programme discovery built-in
- ✅ Multiple entry points to content

---

## Page Layouts

### 1. SHS Hub (`/shs`)
```
┌─────────────────────────────────────────┐
│   🎓 SHS CAMPUS                         │
│   Master core subjects and explore      │
│   programme-specific electives          │
│   [4 Core] [8 Programmes] [WASSCE Prep]│
└─────────────────────────────────────────┘

┌──── CORE SUBJECTS (Required for All) ───┐
│  [Mathematics]  [English]               │
│  [Science]      [Social Studies]        │
└─────────────────────────────────────────┘
           ↓ Divider ↓
┌──── PROGRAMMES (Choose Your Path) ───────┐
│  [Gen Science]  [Gen Arts]    [Business] │
│  [Agriculture]  [Visual Arts] [Home Ec]  │
│  [Technical]    [ICT]                    │
│                                           │
│  [View All 8 Programmes Button]          │
└─────────────────────────────────────────┘
           ↓
┌──── SHS RESOURCES & FEATURES ────────────┐
│  [NSMQ]  [Labs]  [Past Q's]  [Groups]   │
└─────────────────────────────────────────┘
```

### 2. Core Subjects Page (`/subjects/shs`)
```
┌─────────────────────────────────────────┐
│  ℹ️ ALERT: Core Subjects Only           │
│  Looking for electives?                 │
│  [Go to SHS Hub Button]                 │
└─────────────────────────────────────────┘

       SHS CORE SUBJECTS
Essential subjects for all students

┌─────────────────────────────────────────┐
│  [Mathematics]  [English Language]      │
│  [Int. Science] [Social Studies]        │
└─────────────────────────────────────────┘
```

### 3. Programme Detail (`/shs-programmes/general-science`)
```
       GENERAL SCIENCE PROGRAMME
For students pursuing STEM careers

┌──── ELECTIVE SUBJECTS ───────────────────┐
│  [Physics]                               │
│  [Chemistry]                             │
│  [Biology]                               │
│  [Elective Mathematics]                  │
└─────────────────────────────────────────┘

Each subject shows:
- Number of topics
- Grade levels (SHS1, SHS2, SHS3)
- Progress tracking
```

---

## User Journeys

### Journey 1: New SHS Student
```
1. Land on Home Page
2. Click "Enter SHS Campus" button
3. Arrive at SHS Hub (/shs)
4. See both Core Subjects AND Programmes
5. Decision Point:
   A) Click Core Subject → Start learning immediately
   B) Browse Programmes → Explore electives → Choose programme
```

### Journey 2: Returning Student (Has Programme)
```
1. Land on Home Page
2. Click "Enter SHS Campus"
3. Arrive at SHS Hub
4. Hub shows personalized view:
   - Core subjects with progress
   - Selected programme highlighted
   - Recommended next lessons
```

### Journey 3: Direct Link to Core Subject
```
1. Click link to /subjects/shs/mathematics
2. See banner: "Core Subjects Only - Visit SHS Hub for electives"
3. Option to continue with Math OR go to hub
4. User stays informed about full SHS offerings
```

### Journey 4: Exploring Programmes
```
1. SHS Hub
2. Click "View All Programmes" button
3. /shs-programmes (Programme Browser)
4. See all 8 programmes with descriptions
5. Click programme (e.g., Business)
6. /shs-programmes/business
7. See electives: Accounting, Management, Economics
8. Click elective → Start learning
```

---

## Mobile Experience

### Responsive Breakpoints

**Desktop (1024px+)**
- 4-column core subjects
- 3-column programmes
- Full descriptions visible

**Tablet (768px - 1023px)**
- 2-column core subjects
- 2-column programmes
- Shortened descriptions

**Mobile (<768px)**
- 1-column stacked cards
- Larger touch targets
- Collapsible sections
- Priority: Core subjects on top

---

## Color Coding

### Core Subjects Theme
- **Color**: Violet/Purple gradient
- **Hex**: #7c3aed → #9333ea
- **Purpose**: Consistent branding for universal content

### Programme Themes
| Programme          | Gradient                 | Hex                      |
|--------------------|--------------------------|--------------------------|
| General Science    | Blue → Cyan              | #3b82f6 → #06b6d4       |
| General Arts       | Purple → Pink            | #a855f7 → #ec4899       |
| Business           | Green → Emerald          | #10b981 → #059669       |
| Agriculture        | Yellow → Orange          | #eab308 → #f97316       |
| Visual Arts        | Rose → Red               | #f43f5e → #ef4444       |
| Home Economics     | Pink → Rose              | #ec4899 → #f43f5e       |
| Technical Studies  | Gray → Dark Gray         | #4b5563 → #1f2937       |
| ICT/Computing      | Indigo → Blue            | #6366f1 → #3b82f6       |

---

## Component Structure

### SHS Hub Page Components
```tsx
<SHSHubPage>
  <HeroSection>
    <Title />
    <Description />
    <QuickStats />
  </HeroSection>

  <CoreSubjectsSection>
    <SectionHeader badge="Required for All" />
    <SubjectGrid cols={4}>
      {coreSubjects.map(subject => (
        <SubjectCard />
      ))}
    </SubjectGrid>
  </CoreSubjectsSection>

  <Divider text="Choose Your Academic Path" />

  <ProgrammesSection>
    <SectionHeader badge="Choose Your Path" />
    <ProgrammeGrid cols={3}>
      {programmes.slice(0,6).map(prog => (
        <ProgrammeCard />
      ))}
    </ProgrammeGrid>
    {programmes.length > 6 && <ViewAllButton />}
  </ProgrammesSection>

  <QuickLinksSection>
    <ResourceCards />
  </QuickLinksSection>
</SHSHubPage>
```

---

## Testing Scenarios

### ✅ Navigation Tests
- [ ] Home → SHS Hub: URL is `/shs`
- [ ] SHS Hub → Math: URL is `/subjects/shs/mathematics`
- [ ] SHS Hub → General Science: URL is `/shs-programmes/general-science`
- [ ] Direct `/subjects/shs`: Shows alert banner
- [ ] Alert banner button: Navigates to `/shs`

### ✅ Content Tests
- [ ] 4 core subjects display correctly
- [ ] 8 programmes display correctly (6 visible, 2 require "View All")
- [ ] Quick links functional (NSMQ, Labs, Past Q's, Study Groups)
- [ ] Icons render properly
- [ ] Gradients apply correctly

### ✅ Responsive Tests
- [ ] Desktop: 4-column core, 3-column programmes
- [ ] Tablet: 2-column layout
- [ ] Mobile: 1-column stacked, no horizontal scroll

### ✅ Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Screen reader announces sections correctly
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators visible

---

## Key Advantages

### For Students
1. **Clarity**: Immediately understand SHS structure
2. **Discovery**: Easy to explore all available content
3. **Guidance**: Clear path from core to electives
4. **Context**: Understand why core subjects are universal

### For Educators
1. **Content Organization**: Logical separation of core vs electives
2. **Scalability**: Easy to add new programmes or electives
3. **Analytics**: Track which programmes are popular
4. **Curriculum Alignment**: Matches Ghana NaCCA structure

### For Developers
1. **Maintainability**: Single hub to update
2. **Extensibility**: Easy to add features (programme onboarding, recommendations)
3. **Consistency**: Unified navigation pattern
4. **Performance**: Efficient routing, no redundant pages

---

## Future Enhancements

### Phase 2: Personalization
```typescript
// Store user's selected programme
const userProgramme = 'general-science';

// SHS Hub adapts:
// 1. Highlight selected programme
// 2. Show progress in electives
// 3. Recommend next lessons
// 4. Quick access to programme dashboard
```

### Phase 3: Onboarding Flow
```typescript
// First-time SHS users see:
// 1. "Welcome to SHS" overlay
// 2. "Choose your programme" wizard
// 3. Brief explanation of core vs electives
// 4. Personalized hub after selection
```

### Phase 4: Smart Recommendations
```typescript
// Based on:
// - Completed core subject lessons
// - Programme selection
// - Peer performance data
// Recommend:
// - Next core lesson to study
// - Elective topic to start
// - WASSCE past questions to practice
```

---

## Summary

The new SHS Hub (`/shs`) provides:
✅ **Unified entry point** for all SHS content
✅ **Clear navigation** between core and electives
✅ **Programme discovery** built into first experience
✅ **Backward compatibility** with existing routes
✅ **Scalable architecture** for future features

**Result**: Students can now easily find both required core subjects AND programme-specific electives from a single, well-organized landing page.
