'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Hash, Calculator, Target, Lightbulb, Trophy, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, ArrowRight, GraduationCap, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '@/hooks/useLocalization';

interface LessonIntroProps {
  onComplete?: () => void;
}

const TypesOfNumbersIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const { country } = useLocalization();
  const [stage, setStage] = useState(0);
  
  // Interactive state for demonstrations
  const [selectedNumberType, setSelectedNumberType] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  // Number types data
  const numberTypes = [
    { name: 'Natural', emoji: '🔢', color: 'bg-blue-500', examples: ['1', '2', '3', '100'], desc: 'Counting numbers' },
    { name: 'Whole', emoji: '⭕', color: 'bg-green-500', examples: ['0', '1', '2', '50'], desc: 'Natural + zero' },
    { name: 'Integer', emoji: '➕➖', color: 'bg-purple-500', examples: ['-5', '0', '3', '100'], desc: 'Positive, negative, zero' },
    { name: 'Rational', emoji: '📊', color: 'bg-yellow-500', examples: ['½', '0.5', '2.75', '-3/4'], desc: 'Fractions & decimals' },
    { name: 'Irrational', emoji: '∞', color: 'bg-red-500', examples: ['π', '√2', '√3', 'e'], desc: 'Cannot be fraction' },
    { name: 'Real', emoji: '🌐', color: 'bg-indigo-500', examples: ['All numbers'], desc: 'All number types' },
  ];

  const stages = [
    {
      title: "🔢 Welcome to Number Types!",
      content: "Numbers are everywhere - from market prices to phone numbers. Let's explore the different types!",
      narration: "Welcome to the fascinating world of numbers! Every day, we use numbers - counting items at the market, measuring distances, managing money, and calculating prices. But did you know numbers come in different types? Understanding these types is like learning the alphabet before reading - it's the foundation of all mathematics! In this lesson, you'll discover natural numbers, whole numbers, integers, rational numbers, irrational numbers, and real numbers. This knowledge is essential for your exam success!",
      highlightWords: ['numbers', 'market', 'foundation', 'mathematics', 'exam']
    },
    {
      title: "🔢 Natural & Whole Numbers",
      content: "Natural numbers are counting numbers (1, 2, 3...). Whole numbers include zero!",
      narration: "Let's start with the basics! Natural numbers are counting numbers starting from one - like counting students in your class or items at the market. They go: 1, 2, 3, 4, 5, and so on forever. Whole numbers are natural numbers plus zero. So whole numbers are: 0, 1, 2, 3, 4, 5... When you count your change at the market, you're using natural numbers. When you have zero money, that's a whole number! Try clicking on different number types to see examples!",
      highlightWords: ['natural numbers', 'counting', 'whole numbers', 'zero', 'market']
    },
    {
      title: "➕➖ Integers",
      content: "Integers include positive numbers, negative numbers, and zero!",
      narration: "Now let's explore integers! Integers include all positive numbers, all negative numbers, and zero. Think of a number line: positive numbers go to the right, negative numbers go to the left, and zero is in the middle. We use integers for temperatures - like when it's 25 degrees Celsius or minus 5 degrees. We also use them for elevations - mountains are above sea level, while some areas are below sea level. Debts and credits in banking are also integers! Click through the examples to see how integers work!",
      highlightWords: ['integers', 'positive', 'negative', 'zero', 'temperature', 'elevation', 'banking']
    },
    {
      title: "📊 Rational Numbers",
      content: "Rational numbers are fractions and decimals that can be written as a ratio!",
      narration: "Rational numbers are numbers that can be written as a fraction of two integers. This includes all fractions like one-half, three-quarters, and all decimals that either terminate or repeat. In markets, prices are often rational numbers - like 2.50 for a loaf of bread, or 15.75 for a kilogram of rice. When you share a pizza equally among friends, you're using rational numbers! Even whole numbers are rational because you can write them as fractions - like 5 equals 5 over 1. Try the interactive examples!",
      highlightWords: ['rational numbers', 'fractions', 'decimals', 'prices', 'market', 'share']
    },
    {
      title: "∞ Irrational & Real Numbers",
      content: "Irrational numbers can't be written as fractions. Real numbers include everything!",
      narration: "Irrational numbers are special - they cannot be written as a fraction of two integers. Famous examples include pi, which is approximately 3.14159 and goes on forever without repeating, and the square root of 2, which is about 1.414. These numbers appear in circles, waves, and many scientific calculations. Real numbers include ALL number types - natural, whole, integer, rational, and irrational numbers. When engineers design buildings or scientists calculate growth patterns, they use real numbers. Understanding this complete number system is crucial for advanced mathematics and your exam success!",
      highlightWords: ['irrational', 'pi', 'square root', 'real numbers', 'engineers', 'exam']
    },
    {
      title: "🎯 Why This Matters",
      content: "Understanding number types helps you solve problems correctly and excel in your exams!",
      narration: "Why does understanding number types matter? In commerce, you need whole numbers to count items, rational numbers for prices, and integers for temperatures or elevations. In science and engineering, irrational numbers appear in calculations involving circles, waves, and growth patterns. Understanding number types helps you choose the right number for each situation, solve problems correctly, and build a strong foundation for algebra, calculus, and your exam success. This knowledge is power - master it today!",
      highlightWords: ['commerce', 'prices', 'science', 'engineering', 'solve problems', 'exam', 'success']
    }
  ];

  // Speak the current stage narration (simplified like Integrated Science)
  const speakNarration = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis || isMuted) return;
    
    window.speechSynthesis.cancel();
    
    const narration = stages[stage]?.narration;
    if (!narration) return;

    const utterance = new SpeechSynthesisUtterance(narration);
    
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to get a better voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v && v.lang && v.lang.startsWith('en') && v.name && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google'))
    ) || voices.find(v => v && v.lang && v.lang.startsWith('en'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      hasSpokenRef.current.add(stage);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
    };
    
    utterance.onerror = () => {
      // Silently handle errors - user can manually play if needed
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
    };
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [stage, isMuted, stages]);

  // Auto-play narration on mount and stage change (same pattern as Integrated Science)
  useEffect(() => {
    if (!hasSpokenRef.current.has(stage) && !isMuted) {
      const timer = setTimeout(() => {
        speakNarration();
        hasSpokenRef.current.add(stage);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stage, speakNarration, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleNext = () => {
    if (stage < stages.length - 1) {
      setStage(stage + 1);
      setCurrentWordIndex(-1);
      hasSpokenRef.current.delete(stage + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (stage > 0) {
      setStage(stage - 1);
      setCurrentWordIndex(-1);
      hasSpokenRef.current.delete(stage - 1);
    }
  };

  const togglePlayPause = () => {
    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      hasSpokenRef.current.delete(stage);
      speakNarration();
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      hasSpokenRef.current.delete(stage);
      speakNarration();
    } else {
      window.speechSynthesis?.cancel();
      setIsMuted(true);
      setIsSpeaking(false);
    }
  };

  const renderNarrationText = () => {
    const currentStage = stages[stage];
    if (!currentStage) return '';

    const words = currentStage.narration.split(' ');
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:]/g, '').toLowerCase();
      const isHighlighted = currentStage.highlightWords?.some(hw => 
        cleanWord.includes(hw.toLowerCase()) || hw.toLowerCase().includes(cleanWord)
      );
      
      return (
        <span
          key={index}
          className={isHighlighted ? 'text-yellow-300 font-semibold' : 'text-white'}
        >
          {word}{' '}
        </span>
      );
    });
  };

  const currentStage = stages[stage];

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-900/30 via-gray-900 to-purple-900/30 rounded-2xl p-4 sm:p-6 md:p-8 pb-24 sm:pb-28 overflow-hidden">
      {/* Floating number elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🔢', '➕', '➖', '📊', '∞'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              x: [Math.random() * 100, Math.random() * 300],
              y: [Math.random() * 50, Math.random() * 200]
            }}
            transition={{ 
              duration: 4,
              delay: i * 1.5,
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.div 
        className="text-center mb-4 sm:mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1" />
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-1">
            <Hash className="w-6 h-6 sm:w-10 sm:h-10 text-blue-400" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Types of Numbers
            </h2>
            <Calculator className="w-6 h-6 sm:w-10 sm:h-10 text-purple-300" />
          </div>
          <div className="flex-1 flex justify-end">
            {onComplete && (
              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  if (onComplete) onComplete();
                }}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium bg-red-600/80 hover:bg-red-600 text-white transition-all text-xs sm:text-sm"
                title="Skip Intro"
              >
                <SkipForward className="w-4 h-4" />
                <span className="hidden sm:inline">Skip Intro</span>
              </button>
            )}
          </div>
        </div>
        <p className="text-blue-200 text-sm sm:text-lg">Understanding Number Systems</p>
      </motion.div>

      {/* Teacher Avatar & Narration */}
      <motion.div 
        className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-xl p-2 sm:p-4 mb-3 sm:mb-6 border border-blue-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="flex-shrink-0">
            <motion.div 
              className={`bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-2 sm:p-3 flex items-center justify-center ${
                isSpeaking && !isPaused ? 'ring-2 sm:ring-4 ring-blue-400/50' : ''
              }`}
              animate={isSpeaking && !isPaused ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </motion.div>
            <p className="text-center text-[10px] sm:text-xs text-blue-300 mt-1 hidden sm:block">Teacher</p>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1 sm:mb-2">
              <h3 className="text-white font-semibold text-xs sm:text-base">Your Math Teacher</h3>
              <div className="flex items-center gap-1">
                {isSpeaking ? (
                  <button
                    onClick={togglePlayPause}
                    className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                    aria-label={isPaused ? 'Resume' : 'Pause'}
                    title={isPaused ? 'Resume' : 'Pause'}
                  >
                    {isPaused ? (
                      <Play className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    ) : (
                      <Pause className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={togglePlayPause}
                    className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                    aria-label="Play"
                    title="Play narration"
                  >
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </button>
                )}
                <button
                  onClick={toggleMute}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                    isMuted ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  ) : (
                    <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  )}
                </button>
              </div>
            </div>
            <div className="text-[11px] sm:text-sm leading-relaxed max-h-16 sm:max-h-24 overflow-y-auto pr-1 sm:pr-2">
              {renderNarrationText()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stage Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 text-center">
            {currentStage.title}
          </h3>
          <p className="text-white/80 text-sm sm:text-base text-center mb-4 sm:mb-6">
            {currentStage.content}
          </p>

          {/* Interactive Number Types Display */}
          {stage >= 1 && stage <= 4 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4">
              {numberTypes.slice(0, stage === 1 ? 2 : stage === 2 ? 3 : stage === 3 ? 4 : stage === 4 ? 6 : 6).map((type, idx) => (
                <motion.button
                  key={type.name}
                  onClick={() => setSelectedNumberType(selectedNumberType === type.name ? null : type.name)}
                  className={`p-2 sm:p-4 rounded-lg border-2 transition-all text-center ${
                    selectedNumberType === type.name
                      ? `${type.color} border-white scale-105`
                      : 'bg-white/10 border-white/20 hover:border-white/40'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-xl sm:text-3xl mb-1">{type.emoji}</div>
                  <div className="text-white font-semibold text-[10px] sm:text-sm">{type.name}</div>
                  <div className="text-white/70 text-[9px] sm:text-xs mt-0.5 sm:mt-1">{type.desc}</div>
                  {selectedNumberType === type.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 sm:mt-2 text-[9px] sm:text-xs text-white"
                    >
                      <div className="font-semibold mb-0.5 sm:mb-1">Examples:</div>
                      <div className="flex flex-wrap gap-0.5 sm:gap-1">
                        {type.examples.map((ex, i) => (
                          <span key={i} className="bg-white/20 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-[8px] sm:text-xs">
                            {ex}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-1 sm:gap-4">
        <button
          onClick={handlePrevious}
          disabled={stage === 0}
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-base ${
            stage === 0
              ? 'bg-white/10 text-white/30 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-0.5 sm:gap-2 flex-1 justify-center max-w-[200px] sm:max-w-none overflow-x-auto">
          {stages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setStage(idx);
                setCurrentWordIndex(-1);
                hasSpokenRef.current.delete(idx);
              }}
              className={`h-1.5 sm:h-3 rounded-full transition-all flex-shrink-0 ${
                idx === stage ? 'bg-white w-6 sm:w-8' : 'bg-white/30 w-1.5 sm:w-3'
              }`}
              aria-label={`Go to stage ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white transition-all text-xs sm:text-base"
        >
          <span className="hidden sm:inline">
            {stage === stages.length - 1 ? 'Start Lesson' : 'Next'}
          </span>
          <span className="sm:hidden">{stage === stages.length - 1 ? 'Start' : 'Next'}</span>
          {stage === stages.length - 1 ? (
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TypesOfNumbersIntro;
