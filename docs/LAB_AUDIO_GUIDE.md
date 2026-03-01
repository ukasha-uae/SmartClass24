# Lab Audio Guide

This guide standardizes sound effects (SFX) for Virtual Labs and science simulations.

## Goal

- Keep audio cues educational, subtle, and consistent.
- Give each lab a unique "audio identity" without copy-pasting logic.
- Scale by configuration (profile map) instead of per-component custom code.

## Architecture

- Core sound engine: `src/hooks/use-sound-effects.ts`
- Sound profile registry: `src/lib/lab-sound-profiles.ts`
- Profile hook for labs: `src/hooks/use-lab-sound-profile.ts`

Use `useLabSoundProfile(labSlug)` inside lab components:

```ts
const { playLabSound } = useLabSoundProfile('projectile-motion');
playLabSound('launch');
```

## Event Naming Convention

Use event names by meaning (not by tone):

- `start`
- `collect`
- `all-collected`
- `launch`
- `impact`
- `hint`
- `answer-correct`
- `answer-wrong`
- `quiz-perfect`
- `quiz-partial`
- `quiz-retry`
- `complete`

For lab-specific identity events, prefix with context:

- Solar: `planet-select`, `tour-advance`, `tour-complete`
- Future chemistry examples: `reaction-start`, `color-change`

## Sound Design Rules

- Keep tones short (typically < 200ms except celebration).
- Avoid harsh/continuous loops.
- Do not fire sounds on every animation frame.
- Trigger on meaningful learner actions and milestones only.
- Respect global mute preference (`soundMuted`).

## Current Labs With Profiles

- `projectile-motion`
- `photosynthesis-oxygen-production`
- `ammonia-test`
- `maths-equation-animation`
- `solar-system`

## Add SFX to a New Lab (Checklist)

1. Pick the lab slug.
2. Add/extend event mapping in `src/lib/lab-sound-profiles.ts`.
3. In lab component, use:
   - `const { playLabSound } = useLabSoundProfile('<lab-slug>')`
4. Trigger event-based sounds at key points:
   - start, interaction, feedback, completion
5. Run lint and validate on desktop + mobile.
6. Verify mute toggle behavior from:
   - `Virtual Labs` page
   - individual lab page

## QA Quick Pass

- Sound plays after user interaction (browser autoplay constraints).
- Mute persists across labs and page refresh.
- Cues do not overlap excessively in fast interactions.
- Same event gives consistent cue within a lab.
- Lab-specific identity events are distinct across lab categories.

