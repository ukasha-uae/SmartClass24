import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

const sources = {
  correct: require('../../assets/sounds/correct.wav'),
  wrong: require('../../assets/sounds/wrong.wav'),
  complete: require('../../assets/sounds/complete.wav'),
};

export type SoundName = keyof typeof sources;

const players: Partial<Record<SoundName, AudioPlayer>> = {};
let modeSet = false;

let muted = false;
export const isSoundMuted = () => muted;
export const setSoundMuted = (value: boolean) => {
  muted = value;
};

export function playSound(name: SoundName): void {
  if (muted) return;
  try {
    if (!modeSet) {
      modeSet = true;
      setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
    }
    const player = (players[name] ??= createAudioPlayer(sources[name]));
    player.seekTo(0);
    player.play();
  } catch {
    // Sound is a nicety; never break the game over it.
  }
}
