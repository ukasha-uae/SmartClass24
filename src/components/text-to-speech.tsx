"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTextForSpeech, splitSentencesForSpeech } from '@/lib/text/format-for-speech';

interface TextToSpeechProps {
  textToSpeak: string;
  onSentenceChange?: (index: number) => void;
  onStart?: () => void;
  onEnd?: () => void;
  className?: string;
  autoPlay?: boolean;
}

// Sanitize text for clean speech output
function sanitizeForSpeech(text: string): string {
  return text
    // Remove markdown formatting
    .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
    .replace(/\*(.+?)\*/g, '$1') // Italic
    .replace(/_(.+?)_/g, '$1') // Underscore italic
    .replace(/~~(.+?)~~/g, '$1') // Strikethrough
    .replace(/`(.+?)`/g, '$1') // Inline code
    .replace(/#{1,6}\s+/g, '') // Headers
    // Convert list markers to natural pauses
    .replace(/^\s*[-*+]\s+/gm, '') // Bullet points
    .replace(/^\s*\d+\.\s+/gm, '') // Numbered lists
    // Clean special characters
    .replace(/[_~`|]/g, '') // Remaining special chars
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links [text](url) -> text
    // Normalize whitespace
    .replace(/\n\n+/g, '. ') // Multiple newlines to sentence breaks
    .replace(/\n/g, ', ') // Single newlines to pauses
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .trim();
}

export function TextToSpeech({
  textToSpeak,
  onSentenceChange,
  onStart,
  onEnd,
  className,
  autoPlay = false,
}: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentSentenceRef = useRef(0);

  useEffect(() => {
    // Check if speech synthesis is supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }

    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (autoPlay && isSupported && textToSpeak) {
      handleSpeak();
    }
  }, [autoPlay, isSupported, textToSpeak]);

  const handleSpeak = () => {
    if (!isSupported || !textToSpeak) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Sanitize text before speaking
    const cleanText = sanitizeForSpeech(textToSpeak);

    // Split text into sentences without breaking decimals (e.g. 29.5)
    const sentences = splitSentencesForSpeech(cleanText);
    currentSentenceRef.current = 0;

    const speakSentence = (index: number) => {
      if (index >= sentences.length) {
        setIsPlaying(false);
        onEnd?.();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(formatTextForSpeech(sentences[index].trim()));
      utteranceRef.current = utterance;

      // Configure speech settings
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        if (index === 0) {
          onStart?.();
        }
        onSentenceChange?.(index);
      };

      utterance.onend = () => {
        currentSentenceRef.current = index + 1;
        speakSentence(index + 1);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    setIsPlaying(true);
    setIsPaused(false);
    speakSentence(0);
  };

  const handlePause = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    currentSentenceRef.current = 0;
    onEnd?.();
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!isPlaying && !isPaused && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleSpeak}
          className="gap-2"
          title="Read aloud"
        >
          <Volume2 className="h-4 w-4" />
          <span className="hidden sm:inline">Read Aloud</span>
        </Button>
      )}

      {isPlaying && (
        <Button
          size="sm"
          variant="outline"
          onClick={handlePause}
          className="gap-2"
          title="Pause"
        >
          <Pause className="h-4 w-4" />
          <span className="hidden sm:inline">Pause</span>
        </Button>
      )}

      {isPaused && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleSpeak}
          className="gap-2"
          title="Resume"
        >
          <Play className="h-4 w-4" />
          <span className="hidden sm:inline">Resume</span>
        </Button>
      )}

      {(isPlaying || isPaused) && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleStop}
          className="gap-2"
          title="Stop"
        >
          <VolumeX className="h-4 w-4" />
          <span className="hidden sm:inline">Stop</span>
        </Button>
      )}
    </div>
  );
}
