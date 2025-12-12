
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Repeat, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

type ReadAloudProps = {
  textId: string;
};

// Shared state to track the active player
let activePlayerId: string | null = null;
const listeners = new Set<(id: string | null) => void>();

const setActivePlayer = (id: string | null) => {
  activePlayerId = id;
  listeners.forEach(listener => listener(id));
};

const useActivePlayer = (id: string) => {
  const [isActive, setIsActive] = useState(activePlayerId === id);

  useEffect(() => {
    const listener = (currentId: string | null) => {
      setIsActive(currentId === id);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, [id]);

  return isActive;
};


const ReadAloud: React.FC<ReadAloudProps> = ({ textId }) => {
  const [isClient, setIsClient] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState('1.0');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [repeatCount, setRepeatCount] = useState("0");
  const repetitionCounterRef = useRef(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();
  const isActivePlayer = useActivePlayer(textId);
  const sentencesRef = useRef<string[]>([]);
  const sentenceElementsRef = useRef<HTMLSpanElement[]>([]);
  const highlightedElementRef = useRef<HTMLElement | null>(null);
  const playWhenReadyRef = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
      if (!isActivePlayer && (isReading || isPaused)) {
          stopReading(true);
      }
  }, [isActivePlayer, isReading, isPaused]);

  const loadVoices = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      setVoices(availableVoices);
    }
  };

  useEffect(() => {
    if (!isClient) return;
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    const handleBeforeUnload = () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      if (speechSynthesis.speaking && isActivePlayer) {
        speechSynthesis.cancel();
        setActivePlayer(null);
      }
      window.speechSynthesis.onvoiceschanged = null;
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isClient, isActivePlayer]);
  
   useEffect(() => {
    if (voices.length > 0 && playWhenReadyRef.current) {
        playWhenReadyRef.current = false;
        playText();
    }
  }, [voices]);

  const getSimpleVoice = () => {
    if (voices.length === 0) return null;
    const preferredVoices = [
        'Google UK English Female',
        'Microsoft Zira - English (United States)',
        'Google US English',
        'en-GB',
        'en-US'
    ];
    for (const name of preferredVoices) {
        const voice = voices.find(v => v.name === name || v.lang === name);
        if (voice) return voice;
    }
    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  }

  const playText = () => {
    if (voices.length === 0) {
        playWhenReadyRef.current = true;
        loadVoices(); // Attempt to load voices again
        return;
    }

    if (speechSynthesis.speaking && isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsReading(true);
      return;
    }

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setActivePlayer(textId);

    const element = document.getElementById(textId);
    if (!element) {
      toast({
        title: "Error",
        description: "Could not find text to read.",
        variant: "destructive",
      });
      return;
    }

    // Process text only if it hasn't been processed yet
    if (element.dataset.processed !== 'true') {
        // Clone the element to work with it
        const clonedElement = element.cloneNode(true) as HTMLElement;
        
        // Remove elements marked to skip TTS (animations, interactive components)
        const skipElements = clonedElement.querySelectorAll('[data-skip-tts="true"]');
        skipElements.forEach(el => el.remove());
        
        // Remove animation blocks, code blocks with JSON
        const codeBlocks = clonedElement.querySelectorAll('pre, code');
        codeBlocks.forEach(block => {
          const text = block.textContent || '';
          // Remove if it looks like JSON or animation config
          if (text.includes('"type"') || text.includes('```animation') || 
              text.startsWith('{') || text.includes('"a":') || text.includes('"b":')) {
            block.remove();
          }
        });
        
        const text = clonedElement.textContent || "";
        sentencesRef.current = text.match(/[^.!?]+[.!?\s]*|[^.!?]+$/g) || [text];
        sentencesRef.current = sentencesRef.current.filter(s => s.trim().length > 0);

        element.innerHTML = ''; // Clear original text
        sentenceElementsRef.current = sentencesRef.current.map(sentence => {
            const span = document.createElement('span');
            span.textContent = sentence;
            span.className = 'tts-sentence';
            element.appendChild(span);
            return span;
        });
        element.dataset.processed = 'true';
    }

    repetitionCounterRef.current = 0;
    speakSentence(0);
    setIsReading(true);
    setIsPaused(false);
  };

  const handlePlaybackEnd = () => {
    const totalRepeats = repeatCount === "Infinity" ? Infinity : parseInt(repeatCount, 10);
    if (repetitionCounterRef.current < totalRepeats) {
        repetitionCounterRef.current++;
        speakSentence(0);
    } else {
        stopReading();
    }
  };

  const speakSentence = (index: number) => {
    if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove('tts-highlight');
    }

    if (index >= sentencesRef.current.length) {
      handlePlaybackEnd();
      return;
    }

    const voice = getSimpleVoice();
    if (!voice) {
        toast({
            title: "Audio Error",
            description: "No text-to-speech voices are available on this device.",
            variant: "destructive",
        });
        stopReading();
        return;
    }

    const currentElement = sentenceElementsRef.current[index];
    if (currentElement) {
        currentElement.classList.add('tts-highlight');
        highlightedElementRef.current = currentElement;
    }

    const sentence = sentencesRef.current[index];
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = parseFloat(playbackRate);

    utterance.onend = () => {
      if (utteranceRef.current === utterance && (isReading || !isPaused)) {
        const nextIndex = index + 1;
        speakSentence(nextIndex);
      }
    };

    utterance.onerror = (event) => {
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          toast({
              title: "Audio Error",
              description: "Could not play the audio. Please try again.",
              variant: "destructive",
          });
        }
        stopReading();
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const pauseReading = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      setIsPaused(true);
      setIsReading(false);
    }
  };

  const stopReading = (silent = false) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        utteranceRef.current = null;
        window.speechSynthesis.cancel();
    }
    if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove('tts-highlight');
        highlightedElementRef.current = null;
    }

    if (isActivePlayer && !silent) {
      setActivePlayer(null);
    }

    setIsReading(false);
    setIsPaused(false);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isReading) {
      pauseReading();
    } else {
      playText();
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
       <Button onClick={handleButtonClick} variant="outline" size="icon" className="h-8 w-8">
        {isReading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Wind className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={playbackRate} onValueChange={setPlaybackRate}>
            <DropdownMenuRadioItem value="0.75">0.75x</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="1.0">Normal</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="1.25">1.25x</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
           <Button variant="outline" size="icon" className="h-8 w-8 relative">
              <Repeat className="h-4 w-4" />
              {parseInt(repeatCount, 10) > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {repeatCount === 'Infinity' ? '∞' : repeatCount}
                </span>
              )}
           </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuLabel>Repeat Text</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={repeatCount} onValueChange={setRepeatCount}>
            <DropdownMenuRadioItem value="0">No Repeat</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="1">1 Time</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="2">2 Times</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="3">3 Times</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Infinity">Continuously</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ReadAloud;
