import type { SoundType } from '@/hooks/use-sound-effects';

export type LabSoundEvent = string;

type LabSoundProfile = {
  defaultSound: SoundType;
  events: Record<LabSoundEvent, SoundType>;
};

const LAB_SOUND_PROFILES: Record<string, LabSoundProfile> = {
  'projectile-motion': {
    defaultSound: 'click',
    events: {
      launch: 'launch',
      impact: 'impact',
      'mission-success': 'matchFound',
      'quiz-perfect': 'complete',
      'quiz-partial': 'warning',
      'quiz-retry': 'wrong',
    },
  },
  'photosynthesis-oxygen-production': {
    defaultSound: 'click',
    events: {
      start: 'click',
      collect: 'tick',
      'all-collected': 'correct',
      'select-intensity': 'launch',
      'observation-complete': 'impact',
      'quiz-perfect': 'complete',
      'quiz-partial': 'warning',
      'quiz-retry': 'wrong',
    },
  },
  'ammonia-test': {
    defaultSound: 'click',
    events: {
      start: 'click',
      collect: 'tick',
      'all-collected': 'correct',
      'continue-setup': 'click',
      'heat-start': 'launch',
      'gas-produced': 'impact',
      'litmus-result': 'matchFound',
      'quiz-perfect': 'complete',
      'quiz-partial': 'warning',
      'quiz-retry': 'wrong',
    },
  },
  'maths-equation-animation': {
    defaultSound: 'click',
    events: {
      'track-switch': 'click',
      'checkpoint-start': 'click',
      hint: 'tick',
      'answer-correct': 'correct',
      'answer-wrong': 'wrong',
      complete: 'complete',
      restart: 'click',
    },
  },
  'solar-system': {
    defaultSound: 'click',
    events: {
      'planet-select': 'planetSelect',
      'play-all-start': 'launch',
      'play-all-stop': 'click',
      'tour-advance': 'tourAdvance',
      'tour-complete': 'complete',
      'playback-toggle': 'click',
    },
  },
};

export function resolveLabSound(labSlug: string, event: LabSoundEvent): SoundType {
  const profile = LAB_SOUND_PROFILES[labSlug];
  if (!profile) return 'click';
  return profile.events[event] ?? profile.defaultSound;
}

