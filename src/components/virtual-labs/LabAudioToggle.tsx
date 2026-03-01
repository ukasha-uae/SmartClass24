'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSoundEffects } from '@/hooks/use-sound-effects';

interface LabAudioToggleProps {
  compact?: boolean;
}

export function LabAudioToggle({ compact = false }: LabAudioToggleProps) {
  const { isMuted, toggleMute } = useSoundEffects();

  return (
    <Button
      type="button"
      variant="outline"
      size={compact ? 'sm' : 'default'}
      onClick={toggleMute}
      aria-label={isMuted ? 'Enable lab sound effects' : 'Mute lab sound effects'}
      title={isMuted ? 'Enable lab sound effects' : 'Mute lab sound effects'}
      className={compact ? 'h-8 px-2 text-xs' : 'gap-2'}
    >
      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      <span>{isMuted ? 'Sound Off' : 'Sound On'}</span>
    </Button>
  );
}

