import { useCallback } from 'react';
import { useSoundEffects } from '@/hooks/use-sound-effects';
import { resolveLabSound, type LabSoundEvent } from '@/lib/lab-sound-profiles';

export function useLabSoundProfile(labSlug: string) {
  const { playSound, isMuted, toggleMute } = useSoundEffects();

  const playLabSound = useCallback(
    (event: LabSoundEvent) => {
      playSound(resolveLabSound(labSlug, event));
    },
    [labSlug, playSound]
  );

  return { playLabSound, isMuted, toggleMute };
}

