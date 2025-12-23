'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, Skull, Droplets, Wind, Leaf, AlertTriangle, Recycle, ChevronRight } from 'lucide-react';
import { useLocalization } from '@/hooks/useLocalization';
import { localizeString } from '@/lib/localization/content-localizer';
import type { CountryConfig } from '@/lib/localization/country-config';

interface LessonIntroProps {
  onComplete?: () => void;
}

const getStages = (country?: CountryConfig) => [
  {
    icon: AlertTriangle,
    title: "The Pollution Crisis",
    content: country ? localizeString("Look around {{country}} today - our rivers once crystal clear now run brown with mining waste. Air fills with vehicle exhaust. Plastic litters beaches and streets. This is POLLUTION - the introduction of harmful substances into our environment at levels that threaten health, ecosystems, and our future.", country as CountryConfig) : "Pollution threatens our rivers, air, and environment. The introduction of harmful substances creates serious health and ecological crises.",
    color: "from-red-500 to-orange-500"
  },
  {
    icon: Wind,
    title: "Air Pollution - Breathing Poison",
    content: "Every breath in busy traffic exposes you to carbon monoxide, nitrogen oxides, and particulate matter from vehicles. Industrial emissions, burning waste, and dust contribute to air pollution. These pollutants cause respiratory diseases, heart problems, and contribute to global warming through the greenhouse effect.",
    color: "from-gray-400 to-blue-400"
  },
  {
    icon: Droplets,
    title: "Water Pollution - Poisoning Our Rivers",
    content: country ? localizeString("Illegal mining has devastated {{country}}'s rivers. Miners use mercury to extract gold, poisoning local waterways. Untreated sewage, plastic waste, and industrial discharge contaminate water sources. Waterborne diseases like cholera and typhoid claim thousands of lives annually, especially children.", country as CountryConfig) : "Illegal mining has devastated rivers with mercury contamination. Untreated sewage, plastic waste, and industrial discharge create deadly waterborne diseases.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Leaf,
    title: "Soil Pollution - Poisoning the Ground",
    content: country ? localizeString("{{country}}'s soil faces threats from agricultural chemicals, mining waste, and plastic accumulation. Open burning of e-waste releases toxic heavy metals into soil and air. These pollutants enter the food chain, contaminating crops and accumulating in our bodies through bioaccumulation and biomagnification.", country as CountryConfig) : "Soil faces threats from agricultural chemicals, mining waste, and e-waste burning. Toxic pollutants contaminate crops and accumulate in our bodies.",
    color: "from-green-600 to-emerald-500"
  },
  {
    icon: Skull,
    title: "Health and Environmental Impacts",
    content: "Pollution's toll is devastating - respiratory diseases, mercury poisoning, contaminated food, dead rivers, degraded farmland. Children suffer most: lead exposure damages developing brains, dirty water causes diarrhea, air pollution triggers asthma. Ecosystems collapse as eutrophication creates dead zones and acid rain damages forests.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Recycle,
    title: country ? localizeString("Solutions - A Cleaner {{country}}", country as CountryConfig) : "Solutions - Clean Environment",
    content: country ? localizeString("{{country}} can fight pollution! Individual actions matter: reduce plastic use, properly dispose waste, use public transport, plant trees. Communities must organize clean-ups and recycling. Government must enforce laws, build treatment plants, promote renewable energy. Prevention is cheaper than cleanup - act now to protect {{country}}'s environment!", country as CountryConfig) : "Everyone can fight pollution! Individual actions matter: reduce plastic, dispose waste properly, use public transport. Communities and governments must work together to prevent pollution.",
    color: "from-green-500 to-teal-500"
  }
];

export default function EnvironmentalChemistryPollutionIntro({ onComplete }: LessonIntroProps) {
  const { country } = useLocalization();
  const stages = useMemo(() => getStages(country), [country]);
  const [currentStage, setCurrentStage] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState<number>(-1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wordsRef = useRef<string[]>([]);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      
      // Store words for highlighting
      wordsRef.current = text.split(' ');
      
      // Configure voice
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to use a preferred voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && (voice.name.includes('Female') || voice.name.includes('Google'))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Word boundary event for highlighting
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const charIndex = event.charIndex;
          const wordIndex = text.substring(0, charIndex).split(' ').length - 1;
          setHighlightedWord(wordIndex);
        }
      };

      utterance.onstart = () => {
        setIsSpeaking(true);
        setHighlightedWord(0);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setHighlightedWord(-1);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setHighlightedWord(-1);
      };

      window.speechSynthesis.speak(utterance);
    }
  }, [isMuted]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setHighlightedWord(-1);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    if (!isMuted) {
      stopSpeaking();
    }
  }, [isMuted, stopSpeaking]);

  const togglePlayPause = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(stages[currentStage].content);
    }
  }, [isSpeaking, currentStage, speak, stopSpeaking]);

  useEffect(() => {
    // Auto-play narration when stage changes (unless muted)
    if (!isMuted) {
      speak(stages[currentStage].content);
    }

    return () => {
      stopSpeaking();
    };
  }, [currentStage, speak, stopSpeaking, isMuted]);

  // Load voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const goToStage = (index: number) => {
    stopSpeaking();
    setCurrentStage(index);
  };

  const nextStage = () => {
    if (currentStage < stages.length - 1) {
      goToStage(currentStage + 1);
    }
  };

  const prevStage = () => {
    if (currentStage > 0) {
      goToStage(currentStage - 1);
    }
  };

  const currentStageData = stages[currentStage];
  const Icon = currentStageData.icon;

  // Split content into words for highlighting
  const words = currentStageData.content.split(' ');

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute text-6xl opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ top: '10%', left: '5%' }}
        >
          ☣️
        </motion.div>
        <motion.div
          className="absolute text-5xl opacity-10"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ top: '60%', right: '10%' }}
        >
          🏭
        </motion.div>
        <motion.div
          className="absolute text-7xl opacity-10"
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ bottom: '15%', left: '15%' }}
        >
          💧
        </motion.div>
        <motion.div
          className="absolute text-5xl opacity-10"
          animate={{
            x: [0, -70, 0],
            y: [0, -40, 0],
            rotate: [0, 90, 180]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ top: '40%', left: '50%' }}
        >
          🌍
        </motion.div>
        <motion.div
          className="absolute text-6xl opacity-10"
          animate={{
            x: [0, 90, 0],
            y: [0, 70, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ top: '20%', right: '20%' }}
        >
          ♻️
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl w-full"
          >
            {/* Icon and title */}
            <motion.div
              className="flex flex-col items-center mb-4 sm:mb-6 md:mb-8"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${currentStageData.color} flex items-center justify-center mb-3 sm:mb-4 shadow-2xl`}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255,255,255,0.3)',
                    '0 0 40px rgba(255,255,255,0.5)',
                    '0 0 20px rgba(255,255,255,0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent px-4">
                {currentStageData.title}
              </h2>
            </motion.div>

            {/* Content with word highlighting */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-100">
                {words.map((word, index) => (
                  <span
                    key={index}
                    className={`transition-all duration-200 ${
                      index === highlightedWord
                        ? 'bg-yellow-400/40 text-yellow-100 font-semibold px-1 rounded'
                        : ''
                    }`}
                  >
                    {word}{' '}
                  </span>
                ))}
              </p>
            </motion.div>

            {/* Audio controls */}
            <motion.div
              className="flex justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={togglePlayPause}
                className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
                aria-label={isSpeaking ? "Pause narration" : "Play narration"}
              >
                {isSpeaking ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          className="mt-6 sm:mt-8 md:mt-12 w-full px-4 sm:px-6 md:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Progress dots - centered above buttons */}
            <div className="flex justify-center gap-2">
              {stages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStage(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    index === currentStage
                      ? 'bg-white w-6 sm:w-8'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to stage ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation buttons - full width */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={prevStage}
                disabled={currentStage === 0}
                className="flex-1 max-w-[140px] px-4 py-2.5 sm:px-6 sm:py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/5 disabled:cursor-not-allowed rounded-lg transition-colors backdrop-blur-sm font-semibold text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>

              {/* Stage counter in the middle */}
              <div className="text-white/70 font-medium text-sm sm:text-base">
                {currentStage + 1} / {stages.length}
              </div>

              {currentStage === stages.length - 1 ? (
                <button
                  onClick={onComplete}
                  className="flex-1 max-w-[140px] flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-6 sm:py-3 bg-green-600 hover:bg-green-500 rounded-lg transition-colors backdrop-blur-sm font-semibold shadow-lg text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Start Lesson</span>
                  <span className="sm:hidden">Start</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              ) : (
                <button
                  onClick={nextStage}
                  className="flex-1 max-w-[140px] px-4 py-2.5 sm:px-6 sm:py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm font-semibold text-sm sm:text-base"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stage counter removed from bottom since it's now in navigation */}
      </div>
    </div>
  );
}
