# SmartClass24

SmartClass24 is a global, multi-tenant, AI-powered learning platform built with Next.js and Firebase. It supports K-12 learning journeys (including WAEC-oriented flows), interactive virtual labs, challenge arena experiences, localized pricing, and tenant-aware branding/access.

## Education Level Naming

The platform supports multiple naming conventions for equivalent stages:

- `Primary` = elementary/basic foundational years
- `Middle School` = `JHS/JSS` (West African context)
- `High School` = `SHS/SSS` (West African context)

Use region-appropriate naming in user-facing copy:

- Global/default audiences: `Primary, Middle School, High School`
- WAEC-oriented audiences: `Primary, JHS/JSS, SHS/SSS`

## Overview

- **Frontend**: Next.js 16 App Router + React
- **Backend services**: Firebase Auth, Firestore, Cloud Functions, Hosting/App Hosting
- **Core product areas**:
  - Curriculum-driven lessons and quizzes
  - Challenge Arena (practice, tournaments, battles)
  - Virtual Labs (interactive science simulations)
  - Tenant-aware experiences (branding, feature gating, pricing)
  - Admin operations (users, subscriptions, pricing policies/promotions)

Start from `src/app/page.tsx` for the main product entry point.

## Development Setup

Prerequisites:

- Node.js 20+
- npm
- Firebase CLI (for emulator/deploy workflows)

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Type check:

```bash
npm run typecheck
```

## Auth, Profiles, and Quiz Persistence

- Users may start anonymously for fast onboarding.
- Users can create/link email accounts via Firebase Auth.
- Student profile data is stored under `students/{uid}`.
- End-of-lesson quiz attempts for authenticated users are stored under `users/{uid}/quizAttempts`.
- Local fallback is used when users are not signed in; migration to Firestore occurs after authenticated session linkage.

Security is enforced by `firestore.rules` (owner-based access patterns for profile and quiz attempt paths).

## Tenant and Access Model

- Tenant context is resolved from trusted sources (host/middleware path).
- Public UI customization can be tenant-aware.
- Paid feature access uses entitlement checks and soft-gating where applicable.
- Admins can manage pricing policies, campaigns, and tenant-related controls from admin routes.

## Contributor Notes

Before editing lesson/carousel implementations, review:

- `docs/CAROUSEL_LESSONS_GUIDE.md`
- `docs/CAROUSEL_MIGRATION_TRACKER.md`
- `docs/CAROUSEL_MIGRATION_STRATEGY.md`

For product/domain context, useful references include:

- `docs/SCIENCE_SIMULATIONS.md`
- `docs/MULTI_TENANT_IMPLEMENTATION_GUIDE.md`
- `docs/PRICING_FEATURES_STATUS.md`

## Local Firebase Testing

For local secure testing, use emulators:

```bash
firebase emulators:start --only auth,firestore
```

If permissions errors appear during local testing, verify:

- you are authenticated
- emulator or project rules are correctly deployed
- document IDs match authenticated `uid` for owner-scoped writes

## Operations (Deploy & Rollback)

### Standard Release Flow

1. Verify local build succeeds:

```bash
npm run build
```

2. Commit and push to `master`.
3. Confirm App Hosting rollout status in Firebase Console (`smartclass24-backend`).
4. Validate critical paths after rollout (home, pricing, admin dashboard, tenant-specific pages).

### If Deployment Appears Stuck

- Check App Hosting rollouts/builds for queued or failed items.
- Cancel stale queued builds if a queue lock occurs.
- Trigger a fresh rollout from the latest `master` commit.
- Use build logs to identify exact failing import/export or runtime build errors.

### Rollback Strategy

- Roll back by deploying a known-good commit hash through App Hosting rollout selection.
- Prefer small hotfix commits for urgent production fixes.

