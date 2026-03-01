"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { normalizeMathText } from '@/lib/text/normalize-math-text';
import { formatTextForSpeech } from '@/lib/text/format-for-speech';

interface UseSpeechSynthesisProps {
  text: string;
  autoPlay?: boolean;
  rate?: number;
  pitch?: number;
  volume?: number;
  onBoundary?: (charIndex: number) => void;
}

interface UseSpeechSynthesisReturn {
  speak: () => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  currentCharIndex: number;
}

export function useSpeechSynthesis({
  text,
  autoPlay = false,
  rate = 1,
  pitch = 1,
  volume = 1,
  onBoundary,
}: UseSpeechSynthesisProps): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasStartedRef = useRef(false);
  const normalizedText = normalizeMathText(text || '');
  const speechText = formatTextForSpeech(normalizedText);

  // Check if browser supports speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  // Browsers may block speech until a user gesture occurs.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const markInteracted = () => setHasUserInteracted(true);
    window.addEventListener('pointerdown', markInteracted, { passive: true });
    window.addEventListener('keydown', markInteracted, { passive: true });
    window.addEventListener('touchstart', markInteracted, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', markInteracted);
      window.removeEventListener('keydown', markInteracted);
      window.removeEventListener('touchstart', markInteracted);
    };
  }, []);

  const speak = useCallback(() => {
    if (!isSupported || !speechText) {
      console.log('🔊 Speech not available:', { isSupported, hasText: !!speechText });
      return;
    }
    if (!hasUserInteracted) {
      console.warn('🔊 Waiting for user interaction before speaking');
      return;
    }

    // Don't restart if already speaking
    if (window.speechSynthesis.speaking) {
      console.log('🔊 Already speaking, skipping');
      return;
    }

    console.log('🔊 Starting speech:', speechText.substring(0, 50) + '...');
    hasStartedRef.current = true;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    setCurrentCharIndex(0);

    // Wait for voices to load
    const voices = window.speechSynthesis.getVoices();
    console.log('🔊 Available voices:', voices.length);
    
    if (voices.length === 0) {
      // Voices not loaded yet, wait for them
      console.log('🔊 Waiting for voices to load...');
      window.speechSynthesis.onvoiceschanged = () => {
        const newVoices = window.speechSynthesis.getVoices();
        console.log('🔊 Voices loaded:', newVoices.length);
        speakWithVoice(speechText);
      };
      // Also try speaking anyway (some browsers work without explicit voice loading)
      speakWithVoice(speechText);
    } else {
      speakWithVoice(speechText);
    }
  }, [speechText, rate, pitch, volume, isSupported, onBoundary, hasUserInteracted]);

  const speakWithVoice = useCallback((textToSpeak: string) => {
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = 'en-GB'; // British English (can be changed to 'en-US' for American)

    // Try to use a high-quality female English voice (clearer for education)
    const voices = window.speechSynthesis.getVoices();
    
    // Priority order: Google UK Female > Microsoft Female > Any Female > Any English
    const preferredVoice = 
      voices.find(v => v.name.includes('Google') && v.name.includes('UK') && v.name.includes('Female')) ||
      voices.find(v => v.name.includes('Google') && v.lang.startsWith('en-') && v.name.includes('Female')) ||
      voices.find(v => v.name.includes('Zira') || v.name.includes('Hazel')) || // Microsoft Female voices
      voices.find(v => v.lang.startsWith('en-') && v.name.toLowerCase().includes('female')) ||
      voices.find(v => v.lang.startsWith('en-GB')) ||
      voices.find(v => v.lang.startsWith('en-'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log('🔊 Using voice:', preferredVoice.name, '(Female:', !preferredVoice.name.toLowerCase().includes('male') || preferredVoice.name.toLowerCase().includes('female'), ')');
    } else {
      console.log('🔊 Using default voice');
    }

    utterance.onstart = () => {
      console.log('🔊 Speech started');
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      console.log('🔊 Speech ended');
      setIsSpeaking(false);
      setCurrentCharIndex(0);
    };
    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      // "interrupted" is expected when navigating away or stopping speech - just a warning
      if (event.error === 'interrupted') {
        console.warn('🔊 Speech interrupted (normal when navigating)');
      } else if (event.error === 'not-allowed') {
        console.warn('🔊 Speech blocked until user interaction (autoplay policy)');
      } else {
        console.error('🔊 Speech error:', event.error);
      }
      setIsSpeaking(false);
      setCurrentCharIndex(0);
    };

    // Track word boundaries for highlighting
    utterance.onboundary = (event) => {
      if (event.charIndex !== undefined) {
        console.log('🔊 Boundary:', event.charIndex);
        setCurrentCharIndex(event.charIndex);
        onBoundary?.(event.charIndex);
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    console.log('🔊 Speech utterance queued');
  }, [rate, pitch, volume, onBoundary]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentCharIndex(0);
      hasStartedRef.current = false;
    }
  }, [isSupported]);

  // Auto-play when text changes
  useEffect(() => {
    if (autoPlay && speechText && hasUserInteracted && !hasStartedRef.current) {
      // Small delay to ensure proper rendering
      const timer = setTimeout(() => {
        speak();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [speechText, autoPlay, hasUserInteracted, speak]);

  // Reset hasStarted when text changes
  useEffect(() => {
    hasStartedRef.current = false;
  }, [speechText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported, currentCharIndex };
}
