# SHS Navigation Architecture

## Problem Statement

Previously, when students selected SHS from the home page, they were taken directly to `/subjects/shs`, which only showed **Core Subjects** (Math, English, Integrated Science, Social Studies). This created two issues:

1. **Missing Programme Context**: SHS students need to choose an academic programme (Science, Business, Arts, etc.) to access programme-specific elective subjects
2. **Incomplete Learning Path**: Students couldn't access electives without knowing about the separate `/shs-programmes` route

## Scalable Solution

Created a **centralized SHS Hub** (`/shs`) that serves as the main landing page for all SHS students, providing:

### 1. Unified Entry Point
- **Route**: `/shs` (new dedicated hub)
- **Purpose**: Single landing page that presents both core subjects AND programmes
- **User Flow**: Home → SHS Card → SHS Hub → Choose Core Subject OR Choose Programme

### 2. Two-Path Architecture

#### Path A: Core Subjects
- **What**: 4 required subjects for all SHS students
  - Mathematics (SHS 1-3)
  - English Language (SHS 1-3)
  - Integrated Science (SHS 1-3)
  - Social Studies (SHS 1-3)
- **Route**: `/shs` → `/subjects/shs/[subject-slug]`
- **Purpose**: Universal content required regardless of programme choice

#### Path B: Programmes & Electives
- **What**: 8 academic programmes with specialized electives
  1. General Science (Physics, Chemistry, Biology, Elective Math)
  2. General Arts (Literature, History, Geography, Government, Economics)
  3. Business (Financial Accounting, Business Management, Economics)
  4. Agricultural Science (Crop Production, Animal Production, etc.)
  5. Visual Arts (Graphics Design, Sculpture, etc.)
  6. Home Economics (Food & Nutrition, Clothing & Textiles, etc.)
  7. Technical Studies (Technical Drawing, Electronics, etc.)
  8. ICT/Computing (Programming, Networks, etc.)
- **Route**: `/shs` → `/shs-programmes` → `/shs-programmes/[programme-slug]` → `/shs-programmes/[programme-slug]/[subject-slug]`
- **Purpose**: Career-aligned elective subjects based on student's programme

### 3. Navigation Flow

```
┌─────────────┐
│   Home      │
│  Page       │
└──────┬──────┘
       │ Click "Enter SHS Campus"
       ↓
┌─────────────────────────────────┐
│      SHS Hub (/shs)             │
├─────────────────────────────────┤
│  • Hero & Stats                 │
│  • Core Subjects Section        │
│    (4 cards → core subjects)    │
│  • Programmes Section           │
│    (8 cards → electives)        │
│  • Quick Links                  │
│    (NSMQ, Labs, Past Q's, etc.) │
└────┬─────────────────┬──────────┘
     │                 │
     ↓                 ↓
┌────────────┐   ┌──────────────┐
│Core Subject│   │  Programme   │
│  Detail    │   │   Browser    │
│ /subjects/ │   │/shs-programmes│
│  shs/math  │   └──────┬───────┘
└────────────┘          │
                        ↓
                 ┌──────────────┐
                 │  Programme   │
                 │   Detail     │
                 │/shs-programmes│
                 │/general-science│
                 └──────┬───────┘
                        │
                        ↓
                 ┌──────────────┐
                 │   Elective   │
                 │   Subject    │
                 │  /shs-programmes│
                 │/general-science│
                 │   /physics   │
                 └──────────────┘
```

## Implementation Details

### Files Modified

#### 1. `src/app/page.tsx`
**Change**: Updated SHS campus card href
- **Before**: `href: '/subjects/shs'`
- **After**: `href: '/shs'`
- **Impact**: Home page now directs to SHS Hub instead of core subjects

#### 2. `src/app/shs/page.tsx` (NEW FILE)
**Purpose**: Centralized SHS landing page
**Features**:
- Hero section with SHS branding
- Quick stats (4 core, 8 programmes, WASSCE focus)
- **Core Subjects Section**:
  - 4 cards for Math, English, Science, Social Studies
  - Links to `/subjects/shs/[subject-slug]`
  - Visual indicators (icons, colors)
- **Programmes Section**:
  - 6 programme cards displayed (top programmes)
  - Badge previews of elective subjects
  - "View All Programmes" button for remaining
  - Links to `/shs-programmes/[programme-slug]`
- **Quick Links Section**:
  - NSMQ Battles
  - Virtual Labs
  - Past Questions
  - Study Groups

#### 3. `src/app/subjects/[level]/page.tsx`
**Changes**: Added contextual banner for SHS
- **New Alert Banner**: Informs users they're viewing core subjects only
- **Call-to-Action**: "Go to SHS Hub" button to see programmes
- **Updated Title**: "SHS Core Subjects" (instead of generic "SHS Subjects")
- **Updated Description**: Clarifies these are required for all programmes
- **Imports**: Added `Info`, `Home` icons and `Alert` component

### User Experience Benefits

1. **Clarity**: Students immediately understand the distinction between core (universal) and electives (programme-specific)
2. **Guidance**: Clear visual hierarchy guides students through proper academic path
3. **Flexibility**: Direct access to core subjects OR programme exploration
4. **Discoverability**: Students can explore programmes before committing
5. **Context**: Alert banner on `/subjects/shs` redirects lost users back to hub

### Backward Compatibility

- **Old Route Still Works**: `/subjects/shs` continues to function
- **Banner Notice**: Users landing on old route see guidance to visit SHS Hub
- **No Breaking Changes**: All existing lesson links remain functional
- **Migration Path**: Banner gently encourages users to use new hub

## Scalability for Future Features

### Programme Personalization
```typescript
// Future: Store selected programme in user profile
const userProgramme = await getUserProgramme(userId);
// Show personalized dashboard with:
// - Core subjects progress
// - Programme-specific electives progress
// - Recommended study path
```

### Smart Routing
```typescript
// If user has selected programme, show relevant electives on hub
if (userProgramme) {
  const relevantElectives = getElectivesForProgramme(userProgramme);
  // Highlight these on SHS Hub
}
```

### Programme Onboarding
```typescript
// First-time SHS users:
// 1. Welcome to SHS
// 2. Choose your programme (stored in profile)
// 3. View personalized dashboard
// 4. Start with core subjects OR electives
```

## Data Architecture Support

### Existing Infrastructure
Already supports this navigation:

1. **Core Subjects**: Defined in `shs-data.ts` → `coreSubjects` array
2. **Programmes**: Defined in `shs-data.ts` → `shsProgrammes` array
3. **Elective Subjects**: Nested within each programme's `electiveSubjects`
4. **Topics**: Each elective has topic structure (awaiting lesson content)

### Next Steps for Content Creation

1. **Immediate**: Core subjects already have lessons (Math SHS1-3, Science SHS1-3, English SHS1)
2. **Phase 1**: Create flagship elective lessons for General Science programme
   - Physics SHS1: "Ohm's Law and Electrical Circuits"
   - Chemistry SHS2: "Organic Chemistry - Hydrocarbons"
   - Biology SHS2: "Cell Division and Genetics"
3. **Phase 2**: Expand to Business programme electives
4. **Phase 3**: Complete remaining programmes

## Testing Checklist

- [x] Home page → SHS card → `/shs` (hub loads)
- [x] SHS Hub → Core subject card → `/subjects/shs/[subject]` (subject loads)
- [x] SHS Hub → Programme card → `/shs-programmes/[programme]` (programme loads)
- [x] Direct access to `/subjects/shs` shows banner with "Go to SHS Hub" button
- [x] Banner button navigates to `/shs`
- [x] All lesson links remain functional
- [ ] Test on mobile (responsive design)
- [ ] Test with user profile data (programme selection)

## Visual Design Elements

### Color Scheme
- **SHS Branding**: Violet/Purple gradient (`from-violet-600 to-purple-600`)
- **Core Subjects**: Consistent violet theme across all 4 subjects
- **Programmes**: Individual gradients per programme
  - General Science: Blue-Cyan
  - General Arts: Purple-Pink
  - Business: Green-Emerald
  - Technical: Gray-Dark
  - etc.

### Layout Structure
- **Hero**: Full-width, centered, prominent
- **Core Section**: 4-column grid (responsive to 2 cols on tablet, 1 on mobile)
- **Divider**: Visual separator between core and programmes
- **Programme Section**: 3-column grid (responsive)
- **Quick Links**: 4-column grid for additional features

## Summary

This architecture provides a **scalable, user-friendly navigation system** that:
✅ Clearly separates core subjects (universal) from programmes (specialized)
✅ Provides single entry point for all SHS content
✅ Maintains backward compatibility with existing routes
✅ Supports future personalization and onboarding flows
✅ Scales naturally as we add elective subject lesson content
✅ Aligns with Ghana's SHS academic structure (core + programme-based electives)

The implementation is complete and ready for user testing.
