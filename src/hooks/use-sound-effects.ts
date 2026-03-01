import { useCallback, useRef, useEffect, useState } from 'react';

export type SoundType =
  | 'correct'
  | 'wrong'
  | 'click'
  | 'complete'
  | 'tick'
  | 'matchFound'
  | 'warning'
  | 'launch'
  | 'impact'
  | 'planetSelect'
  | 'tourAdvance';

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Initialize AudioContext on user interaction if possible, or lazily
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    if (AudioContextClass) {
      audioContextRef.current = new AudioContextClass();
    }
    
    // Load mute preference
    const savedMute = localStorage.getItem('soundMuted');
    if (savedMute) {
      setIsMuted(JSON.parse(savedMute));
    }

    return () => {
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newValue = !prev;
      localStorage.setItem('soundMuted', JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (isMuted || !audioContextRef.current) return;

    // Resume context if suspended (browser policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'correct':
        // High pitched pleasant chime (C5 -> E5)
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, now); // C5
        oscillator.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case 'wrong':
        // Low pitched buzz (A2 -> G2)
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(110.00, now); // A2
        oscillator.frequency.linearRampToValueAtTime(98.00, now + 0.2); // G2
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case 'click':
        // Short high blip
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, now);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        oscillator.start(now);
        oscillator.stop(now + 0.05);
        break;

      case 'complete':
        // Victory fanfare (C4 - E4 - G4 - C5)
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gn = ctx.createGain();
          osc.connect(gn);
          gn.connect(ctx.destination);
          
          osc.type = 'triangle';
          osc.frequency.value = freq;
          
          const startTime = now + (i * 0.1);
          gn.gain.setValueAtTime(0.1, startTime);
          gn.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
          
          osc.start(startTime);
          osc.stop(startTime + 0.4);
        });
        break;
        
      case 'tick':
        // Woodblock tick
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, now);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        oscillator.start(now);
        oscillator.stop(now + 0.03);
        break;

      case 'matchFound':
        // Match found celebration (ascending notes)
        const matchNotes = [392.00, 493.88, 523.25, 659.25]; // G4, B4, C5, E5
        matchNotes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gn = ctx.createGain();
          osc.connect(gn);
          gn.connect(ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.value = freq;
          
          const startTime = now + (i * 0.08);
          gn.gain.setValueAtTime(0.15, startTime);
          gn.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
          
          osc.start(startTime);
          osc.stop(startTime + 0.2);
        });
        break;

      case 'warning':
        // Warning beep (low to high)
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.15);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      case 'launch':
        // Quick "whoosh"-like sweep for projectile launch
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(220, now);
        oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gainNode.gain.setValueAtTime(0.07, now);
        gainNode.gain.exponentialRampToValueAtTime(0.004, now + 0.16);
        oscillator.start(now);
        oscillator.stop(now + 0.16);
        break;

      case 'impact':
        // Soft impact thud cue
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(140, now);
        oscillator.frequency.exponentialRampToValueAtTime(90, now + 0.08);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.003, now + 0.12);
        oscillator.start(now);
        oscillator.stop(now + 0.12);
        break;

      case 'planetSelect':
        // Distinct "space ping" for celestial object selection
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(520, now);
        oscillator.frequency.exponentialRampToValueAtTime(780, now + 0.08);
        gainNode.gain.setValueAtTime(0.06, now);
        gainNode.gain.exponentialRampToValueAtTime(0.004, now + 0.12);
        oscillator.start(now);
        oscillator.stop(now + 0.12);
        break;

      case 'tourAdvance':
        // Soft upward cue when guided tour moves to next planet
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(330, now);
        oscillator.frequency.exponentialRampToValueAtTime(494, now + 0.1);
        gainNode.gain.setValueAtTime(0.055, now);
        gainNode.gain.exponentialRampToValueAtTime(0.003, now + 0.14);
        oscillator.start(now);
        oscillator.stop(now + 0.14);
        break;
    }
  }, [isMuted]);

  return { playSound, isMuted, toggleMute };
};
