# SmartClass24 - AI Agent Instructions

## Project Overview
SmartClass24 is a Next.js 16 (App Router) progressive web app providing personalized learning for JHS & SHS students across West Africa, with a focus on Ghana. Built with TypeScript, Firebase, and Tailwind CSS.

## Critical Architectural Patterns

### Campus-Based Architecture
- **Multi-level system**: Supports JHS, SHS, and extensible for Primary/University
- **Dynamic routing**: `/campus/[campusType]/*` handles all campus types dynamically
- **Central config**: All campus settings in `src/lib/campus-config.ts` - add new campuses here, NOT in routes
- **Feature flags**: `src/lib/featureFlags.ts` controls carousel mode, virtual labs, and per-subject/level features
- **Legacy routes**: `src/app/shs-campus/*` is deprecated; use dynamic campus routes instead

### Carousel Lesson System (CRITICAL)
**MUST read before modifying lessons:**
- `docs/CAROUSEL_LESSONS_GUIDE.md` - Official implementation pattern
- `docs/CAROUSEL_MIGRATION_TRACKER.md` - Migration progress
- `docs/CAROUSEL_MIGRATION_STRATEGY.md` - Overall strategy

**Anti-pattern**: NEVER add `carouselTeachingMethod` property to lessons (doesn't exist in system)
**Correct pattern**: Use `IntelligentLessonIntro` component with standard lesson data structure

Example lesson intro: `src/components/lesson-intros/integrated-science/shs2/WaterCycleIntro.tsx`

### Localization System
- **Multi-country support**: Ghana, Nigeria, Sierra Leone, Liberia, Gambia
- **Template variables**: `{{currency}}`, `{{exam:primary}}`, `{{city:capital}}` auto-localize content
- **Config location**: `src/lib/localization/countries/*.ts`
- **Context hook**: `useLocalization()` provides formatters and localizers
- See `src/lib/localization/README.md` for complete template variable reference

### Firebase Architecture
**Anonymous-first auth pattern:**
1. Users sign in anonymously on first visit (instant access)
2. Can upgrade to email/password account (links anonymous session)
3. Quiz attempts migrate from localStorage to Firestore on sign-in
4. Profile data stored at `students/{uid}` in Firestore

**Key files:**
- `src/firebase/provider.tsx` - Context provider with user state
- `src/firebase/non-blocking-login.tsx` - Auth helpers (anonymous, link, migrate)
- `firestore.rules` - Security rules (owner-only read/write for profiles and quiz attempts)

**IMPORTANT**: Use `useFirebase()` hook for auth/firestore, NOT direct Firebase imports

## Data Structure

### Lesson Data (JHS/SHS)
- **JHS**: `src/lib/jhs-data.ts` (9000+ lines, comprehensive curriculum)
- **SHS**: Subject-specific files (e.g., `src/lib/integrated-science-shs1-lessons-data.ts`)
- **Structure**: `subjects → topics → lessons`
- **Quiz data**: Separate files (`jhs-questions.ts`, `shs-questions.ts`)

**Lesson schema:**
```typescript
{
  id, slug, title, subject,
  objectives: string[],
  introduction: string,
  keyConcepts: { title, content }[],
  activities: { questions: {...}[] },
  pastQuestions: { question, solution }[],
  summary: string,
  endOfLessonQuiz: Quiz[],
  defaultQuizStyle?: 'classic' | 'card' | 'compact' | 'timed' | 'visual' | 'rapid'
}
```

## Development Workflow

### Running the App
```powershell
npm run dev          # Start dev server on port 9002 with Turbopack
npm run dev:fresh    # Clear cache + start dev
npm run build        # Production build
npm run typecheck    # TypeScript check (build ignores errors via next.config.ts)
```

**Note**: Dev server allocates 8GB memory (`--max-old-space-size=8192`) due to large data files

### State Management
- **Zustand stores**: `src/stores/` (lab-progress-store.ts, lab-notes-store.ts)
- **Context API**: Firebase, Localization
- **Local storage**: Quiz attempts (fallback when not authenticated)

### Component Structure
```
src/components/
├── lesson-intros/          # Subject-specific carousel intros
├── lesson-wrappers/        # Carousel lesson containers
├── virtual-labs/           # Interactive science simulations
├── ui/                     # Shadcn components
└── [feature-specific].tsx
```

## Common Patterns & Conventions

### Path Aliases
Use `@/` for all imports: `import { useFirebase } from '@/firebase'`

### Icon Library
Lucide React for all icons: `import { Book, Calculator } from 'lucide-react'`

### Styling
- Tailwind CSS only (no CSS modules)
- `tailwind.config.ts` has custom animations (`tailwindcss-animate`)
- Use `clsx` or `cn` utility for conditional classes

### Form Handling
- React Hook Form + Zod for validation
- Radix UI primitives for form components

### Quiz Styles
Set per-lesson or per-question:
```typescript
lesson.defaultQuizStyle = 'card'; // Lesson-wide
quiz.style = 'image-first';       // Per-question override
```

## Firebase Integration Checklist

When modifying auth/profile features:
1. Check `firestore.rules` for security implications
2. Test with anonymous user first
3. Test linking anonymous → email account
4. Verify quiz attempt migration works
5. Check localStorage fallback for offline scenarios

## Critical Files Reference

| Purpose | File Path |
|---------|-----------|
| Campus config | `src/lib/campus-config.ts` |
| Feature flags | `src/lib/featureFlags.ts` |
| JHS curriculum | `src/lib/jhs-data.ts` |
| Carousel guide | `docs/CAROUSEL_LESSONS_GUIDE.md` |
| Localization config | `src/lib/localization/countries/*.ts` |
| Firebase provider | `src/firebase/provider.tsx` |
| Auth helpers | `src/firebase/non-blocking-login.tsx` |
| Security rules | `firestore.rules` |

## When Making Changes

**Adding a new campus:**
1. Update `src/lib/campus-config.ts` (NOT routes)
2. Add curriculum data file (follow jhs-data.ts structure)
3. Update feature flags if needed

**Adding a carousel lesson:**
1. Read `docs/CAROUSEL_LESSONS_GUIDE.md` first
2. Create intro component in `src/components/lesson-intros/[subject]/[level]/`
3. Use standard lesson data structure (no special carousel properties)
4. Update `src/lib/featureFlags.ts` to enable carousel for the lesson

**Adding localization:**
1. Use template variables: `{{currency}}`, `{{exam:primary}}`, etc.
2. Add country-specific data to `src/lib/localization/countries/[country].ts`
3. Test with `LocalizationDemo` component

**Modifying auth/profiles:**
1. Consider anonymous users vs. authenticated users
2. Update `firestore.rules` if changing data structure
3. Test quiz attempt migration flow

## TypeScript Notes
- `ignoreBuildErrors: true` in `next.config.ts` - fix errors but build won't fail
- Use strict mode (`tsconfig.json`)
- Type definitions in `src/types/` for shared types

## PWA Configuration
- `@ducanh2912/next-pwa` package
- Disabled in development, enabled in production
- Service worker registered in `public/`
