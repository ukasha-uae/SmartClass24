'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Hash, Infinity, Divide, Calculator, Trophy, Play, Pause, Volume2, VolumeX, GraduationCap, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonIntroProps {
  onComplete?: () => void;
}

const TypesOfNumbersIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  
  // Interactive state for demonstrations
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [numberType, setNumberType] = useState<'natural' | 'whole' | 'integer' | 'rational' | 'irrational' | 'real' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [numberLinePosition, setNumberLinePosition] = useState(0);
  
  // Fixed positions for floating elements to prevent re-render issues
  const floatingPositions = useRef([
    { x: [20, 150], y: [10, 80] },
    { x: [80, 250], y: [30, 120] },
    { x: [150, 280], y: [50, 100] },
    { x: [200, 320], y: [20, 90] },
    { x: [250, 350], y: [40, 110] }
  ]);
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  // Number examples for each type
  const numberExamples = {
    natural: [1, 2, 3, 5, 10, 15, 20, 50, 100],
    whole: [0, 1, 2, 3, 5, 10, 15, 20, 50],
    integer: [-10, -5, -3, -2, -1, 0, 1, 2, 3, 5, 10],
    rational: [-2.5, -1, -0.5, 0, 0.5, 0.75, 1, 1.5, 2, 3.5],
    irrational: ['π', '√2', '√3', '√5', 'e', 'φ'],
    real: ['All numbers on the number line']
  };

  const stages = [
    {
      title: "🔢 The World of Numbers!",
      content: "Numbers are everywhere in Ghana - from counting oranges at the market to measuring distances!",
      narration: "Welcome to the fascinating world of numbers! Every day in Ghana, we use numbers - counting oranges at the market, measuring distances between cities, managing money in cedis, and calculating prices. But did you know numbers come in different types? Just like we classify animals into mammals, birds, and reptiles, we classify numbers into natural, whole, integers, rational, irrational, and real numbers. Understanding these types is like learning the alphabet before reading - it's the foundation of all mathematics!",
      highlightWords: ['numbers', 'Ghana', 'market', 'cedis', 'classify', 'natural', 'whole', 'integers', 'rational', 'irrational', 'real', 'foundation']
    },
    {
      title: "1️⃣ Natural Numbers - Counting Numbers",
      content: "Natural numbers start from 1 and go on forever! Click numbers to see examples.",
      narration: "Natural numbers are the counting numbers we use every day! They start from 1 and go on forever: 1, 2, 3, 4, 5, and so on. In Ghana, you use natural numbers when counting students in your class, counting oranges at the market, or counting the number of goats on a farm. Natural numbers are positive whole numbers - no negatives, no fractions, no decimals, and traditionally no zero. They're called natural because they come naturally to us - even young children learn to count using natural numbers!",
      highlightWords: ['natural numbers', 'counting', '1', 'forever', 'positive', 'whole numbers', 'no negatives', 'no fractions']
    },
    {
      title: "0️⃣ Whole Numbers - Adding Zero",
      content: "Whole numbers include zero! This is important for representing 'nothing'.",
      narration: "Whole numbers are natural numbers plus zero! So we have 0, 1, 2, 3, 4, 5, and so on. Zero is special - it represents nothing, emptiness, or the absence of something. In Ghana, if you have zero cedis in your wallet, that's a whole number! If you have zero oranges left at the market, that's also a whole number. Zero is crucial in mathematics - it's the starting point on a number line, and it's essential for place value in our number system. Without zero, we couldn't write numbers like 10, 100, or 1000!",
      highlightWords: ['whole numbers', 'zero', '0', 'nothing', 'emptiness', 'starting point', 'place value']
    },
    {
      title: "➕➖ Integers - Positive and Negative",
      content: "Integers include negative numbers! Perfect for temperatures, debts, and elevations.",
      narration: "Integers include all whole numbers plus their negative counterparts! So we have negative 5, negative 3, negative 2, negative 1, zero, 1, 2, 3, 5, and so on. In Ghana, integers are everywhere! When the temperature drops below zero during harmattan season, we use negative integers. If you owe someone 10 cedis, that's negative 10. If you're in a building 5 floors below ground level, that's negative 5. Integers help us represent opposites - above and below sea level, profit and loss, credit and debt!",
      highlightWords: ['integers', 'negative', 'positive', 'temperature', 'harmattan', 'debt', 'opposites', 'below sea level']
    },
    {
      title: "📊 Rational Numbers - Fractions & Decimals",
      content: "Rational numbers can be written as fractions! Click to see examples.",
      narration: "Rational numbers are numbers that can be written as a fraction - where the top number (numerator) and bottom number (denominator) are both integers, and the denominator is not zero. This includes fractions like one-half, three-quarters, and two-thirds. It also includes decimals that terminate like 0.5, 0.25, or 0.75, and decimals that repeat like 0.333... which equals one-third. In Ghana, rational numbers appear everywhere - half a loaf of bread costs 2.5 cedis, three-quarters of a tank of fuel, or 0.75 of your monthly salary. If you can write it as p over q where q is not zero, it's rational!",
      highlightWords: ['rational numbers', 'fraction', 'numerator', 'denominator', 'terminate', 'repeat', '0.333', 'one-third', 'p over q']
    },
    {
      title: "∞ Irrational Numbers - Never-Ending",
      content: "Irrational numbers cannot be written as simple fractions! They go on forever.",
      narration: "Irrational numbers are numbers that cannot be written as a simple fraction of two integers. Their decimal representation goes on forever without repeating! The most famous irrational number is pi, approximately 3.14159... which never ends and never repeats. Another is the square root of 2, approximately 1.41421... which also goes on forever. In Ghana, irrational numbers appear in real life - when calculating the circumference of a circular well using pi, or when finding the diagonal of a square field using square root of 2. These numbers are essential in engineering, architecture, and science!",
      highlightWords: ['irrational numbers', 'cannot be written', 'fraction', 'forever', 'never repeats', 'pi', '3.14159', 'square root of 2', 'circumference']
    },
    {
      title: "📏 Real Numbers - The Complete Picture",
      content: "Real numbers include everything on the number line - rationals and irrationals!",
      narration: "Real numbers are the complete set - they include all rational numbers and all irrational numbers together! Every point on a number line represents a real number. From negative infinity to positive infinity, every number you can think of is a real number. In Ghana, when you measure anything - the height of a building, the distance to Accra, the weight of cocoa beans, or the temperature - you're using real numbers. The number line is complete with real numbers - there are no gaps! Real numbers form the foundation for all advanced mathematics including algebra, calculus, and beyond.",
      highlightWords: ['real numbers', 'complete set', 'rational', 'irrational', 'number line', 'negative infinity', 'positive infinity', 'no gaps', 'foundation']
    },
    {
      title: "🎯 WASSCE Success - Classify Numbers!",
      content: "WASSCE loves asking you to classify numbers! Practice with these examples.",
      narration: "WASSCE examinations frequently test your ability to classify numbers! Here are key tips: Is 0.333... rational? Yes - it equals one-third, which is a fraction! Is the square root of 9 irrational? No - it equals 3, which is a rational number! Is zero a natural number? No - natural numbers start from 1. Is negative 5 an integer? Yes - integers include negatives! Remember: rational numbers can be written as fractions, irrational numbers cannot. Natural numbers start from 1, whole numbers include zero, integers include negatives. Master these classifications and you'll score easy marks in WASSCE!",
      highlightWords: ['WASSCE', 'classify', '0.333', 'rational', 'square root of 9', 'irrational', 'zero', 'natural number', 'negative 5', 'integer', 'easy marks']
    }
  ];

  // Auto-animate number line on stage 6
  useEffect(() => {
    if (stage === 6 && isAnimating) {
      let direction = 1;
      const interval = setInterval(() => {
        setNumberLinePosition(prev => {
          if (prev >= 10) direction = -1;
          if (prev <= -10) direction = 1;
          return prev + direction;
        });
      }, 800); // Faster movement
      return () => clearInterval(interval);
    }
  }, [stage, isAnimating]);

  // Speak the current stage narration
  const speakNarration = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis || isMuted) return;
    
    window.speechSynthesis.cancel();
    
    const narration = stages[stage].narration;
    const utterance = new SpeechSynthesisUtterance(narration);
    
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google'))
    ) || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    let wordIndex = 0;
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentWordIndex(wordIndex);
        wordIndex++;
      }
    };
    
    utterance.onstart = () => { setIsSpeaking(true); setIsPaused(false); };
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); setCurrentWordIndex(-1); };
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false); };
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [stage, isMuted, stages]);

  useEffect(() => {
    if (!hasSpokenRef.current.has(stage) && !isMuted) {
      const timer = setTimeout(() => {
        speakNarration();
        hasSpokenRef.current.add(stage);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stage, speakNarration, isMuted]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const togglePause = () => {
    if (!window.speechSynthesis) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
    } else {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      setIsMuted(true);
    }
  };

  const replayNarration = () => {
    hasSpokenRef.current.delete(stage);
    speakNarration();
  };

  const handleStageChange = (newStage: number) => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setCurrentWordIndex(-1);
    setStage(newStage);
    // Reset demos
    setSelectedNumber(null);
    setNumberType(null);
    setIsAnimating(false);
    setNumberLinePosition(0);
  };

  const renderNarrationText = () => {
    const words = stages[stage].narration.split(/\s+/);
    const highlightWords = stages[stage].highlightWords;
    
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:'"]/g, '').toLowerCase();
      const isHighlightWord = highlightWords.some(hw => 
        cleanWord.includes(hw.toLowerCase()) || hw.toLowerCase().includes(cleanWord)
      );
      const isCurrentWord = index === currentWordIndex;
      
      return (
        <span
          key={index}
          className={`transition-all duration-150 ${
            isCurrentWord 
              ? 'bg-blue-400/40 text-white font-semibold px-0.5 rounded' 
              : isHighlightWord 
                ? 'text-blue-300 font-medium'
                : 'text-gray-300'
          }`}
        >
          {word}{' '}
        </span>
      );
    });
  };

  const classifyNumber = (num: number | string): 'natural' | 'whole' | 'integer' | 'rational' | 'irrational' | 'real' => {
    if (typeof num === 'string') return 'irrational';
    if (num > 0 && Number.isInteger(num)) return 'natural';
    if (num === 0) return 'whole';
    if (Number.isInteger(num)) return 'integer';
    return 'rational';
  };

  // Helper to render text with square root symbol properly
  const renderWithSqrt = (text: string) => {
    const parts = text.split(/(√\d+)/g);
    return parts.map((part, i) => {
      if (part.match(/^√\d+$/)) {
        const num = part.substring(1);
        return (
          <span key={i}>
            <span style={{ textDecoration: 'overline' }}>{num}</span>
            <span style={{ fontSize: '0.7em', verticalAlign: 'super' }}>√</span>
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-opacity {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.4; }
        }
        .float-anim-0 { animation: float-opacity 4s ease-in-out 0s infinite; }
        .float-anim-1 { animation: float-opacity 4s ease-in-out 1.5s infinite; }
        .float-anim-2 { animation: float-opacity 4s ease-in-out 3s infinite; }
        .float-anim-3 { animation: float-opacity 4s ease-in-out 4.5s infinite; }
        .float-anim-4 { animation: float-opacity 4s ease-in-out 6s infinite; }
      `}} />
      <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-900/30 via-gray-900 to-purple-900/30 rounded-2xl p-4 sm:p-6 md:p-8 pb-20 sm:pb-28 overflow-hidden">
        {/* Floating number elements - simplified static display */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['1', '2', '3', 'π', '√'].map((symbol, i) => {
            const pos = floatingPositions.current[i] || { x: [20, 150], y: [10, 80] };
            return (
              <div
                key={i}
                className={`absolute text-2xl text-blue-400/30 float-anim-${i}`}
                style={{
                  left: `${pos.x[0]}px`,
                  top: `${pos.y[0]}px`
                }}
              >
                {symbol}
              </div>
            );
          })}
        </div>

      {/* Header */}
      <motion.div 
        className="text-center mb-4 sm:mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
          <Hash className="w-6 h-6 sm:w-10 sm:h-10 text-blue-400" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Types of Numbers
          </h2>
          <Calculator className="w-6 h-6 sm:w-10 sm:h-10 text-blue-300" />
        </div>
        <p className="text-blue-200 text-sm sm:text-lg">Natural, Whole, Integer, Rational, Irrational & Real</p>
      </motion.div>

      {/* Teacher Avatar & Narration */}
      <motion.div 
        className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-700/50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-start gap-2 sm:gap-4">
          <div className="flex-shrink-0">
            <div 
              className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-all ${
                isSpeaking && !isPaused ? 'ring-2 sm:ring-4 ring-blue-400/50 animate-pulse' : ''
              }`}
            >
              <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            </div>
            <p className="text-center text-[10px] sm:text-xs text-blue-300 mt-1 hidden sm:block">Teacher</p>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm leading-relaxed max-h-16 sm:max-h-24 overflow-y-auto pr-1 sm:pr-2">
              {renderNarrationText()}
            </div>
          </div>

          <div className="flex flex-col gap-1 sm:gap-2">
            {isSpeaking ? (
              <button onClick={togglePause} className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors" title={isPaused ? "Resume" : "Pause"}>
                {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
              </button>
            ) : (
              <button onClick={replayNarration} className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors" title="Play narration">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            )}
            <button
              onClick={toggleMute}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${isMuted ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-600 hover:bg-gray-500'}`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
            </button>
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
          className="bg-gray-800/80 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h3 className="text-lg sm:text-2xl font-bold text-blue-400 mb-2 sm:mb-3">{stages[stage].title}</h3>
          <p className="text-gray-200 text-sm sm:text-lg mb-3 sm:mb-4">{stages[stage].content}</p>

          {/* Stage 1-3: Number Examples */}
          {(stage >= 1 && stage <= 3) && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-blue-900/50 to-purple-900/50 rounded-lg p-4 mb-4">
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {numberExamples[stage === 1 ? 'natural' : stage === 2 ? 'whole' : 'integer'].map((num, i) => (
                    <motion.button
                      key={i}
                      onClick={() => {
                        setSelectedNumber(typeof num === 'number' ? num : null);
                        setNumberType(classifyNumber(num));
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-lg sm:text-xl font-bold transition-all ${
                        selectedNumber === num
                          ? 'bg-blue-600 text-white ring-4 ring-blue-400'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      }`}
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>
                {selectedNumber !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-blue-600/30 rounded-lg border border-blue-500"
                  >
                    <p className="text-blue-200 text-sm sm:text-base">
                      <strong>{selectedNumber}</strong> is a <strong className="text-white">{numberType}</strong> number!
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Stage 4: Rational Numbers Demo */}
          {stage === 4 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-green-900/50 to-blue-900/50 rounded-lg p-4 mb-4">
                <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Click to see fraction form:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { decimal: 0.5, fraction: '½' },
                    { decimal: 0.25, fraction: '¼' },
                    { decimal: 0.75, fraction: '¾' },
                    { decimal: 0.333, fraction: '⅓' },
                    { decimal: 1.5, fraction: '3/2' },
                    { decimal: 2.5, fraction: '5/2' }
                  ].map((item, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedNumber(item.decimal);
                        setNumberType('rational');
                      }}
                      className={`p-3 rounded-lg text-center transition-all ${
                        selectedNumber === item.decimal
                          ? 'bg-green-600 ring-4 ring-green-400'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <div className="text-white font-bold text-lg sm:text-xl">{item.decimal}</div>
                      <div className="text-gray-300 text-sm sm:text-base mt-1">= {item.fraction}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stage 5: Irrational Numbers Demo */}
          {stage === 5 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-purple-900/50 to-pink-900/50 rounded-lg p-4 mb-4">
                <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">These numbers go on forever:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {numberExamples.irrational.map((symbol, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="p-3 bg-gray-700 rounded-lg text-center"
                    >
                      <div className="text-white font-bold text-lg sm:text-xl">
                        {symbol.startsWith('√') ? (
                          <span style={{ fontFamily: 'serif' }}>{String.fromCharCode(8730)}{symbol.slice(1)}</span>
                        ) : (
                          symbol
                        )}
                      </div>
                      <div className="text-gray-400 text-xs sm:text-sm mt-1">
                        {symbol === 'π' && '≈ 3.14159...'}
                        {symbol === '√2' && '≈ 1.41421...'}
                        {symbol === '√3' && '≈ 1.73205...'}
                        {symbol === '√5' && '≈ 2.23607...'}
                        {symbol === 'e' && '≈ 2.71828...'}
                        {symbol === 'φ' && '≈ 1.61803...'}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <p className="text-center text-purple-300 text-xs sm:text-sm mt-3">
                  These decimals never end and never repeat!
                </p>
              </div>
            </div>
          )}

          {/* Stage 6: Number Line Visualization */}
          {stage === 6 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-indigo-900/50 to-blue-900/50 rounded-lg p-4 mb-4">
                <p className="text-center text-gray-200 mb-4 text-sm sm:text-base">The Complete Number Line:</p>
                <div className="relative h-32 sm:h-40 bg-gray-800 rounded-lg overflow-hidden border-2 border-indigo-700">
                  {/* Number line */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-1 bg-gradient-to-r from-red-600 via-yellow-500 via-green-500 to-blue-600"></div>
                  </div>
                  
                  {/* Numbers with highlighting */}
                  {Array.from({ length: 21 }, (_, i) => i - 10).map((num) => {
                    const distance = Math.abs(num - numberLinePosition);
                    const isNear = distance <= 1;
                    const isAt = num === numberLinePosition;
                    
                    return (
                      <div
                        key={num}
                        className={`absolute top-1/2 transform -translate-y-1/2 transition-all ${
                          isAt && isAnimating ? 'animate-pulse scale-110' : isNear && isAnimating ? 'scale-105' : ''
                        }`}
                        style={{ left: `${((num + 10) / 20) * 100}%` }}
                      >
                        <div 
                          className={`w-1 h-6 sm:h-8 transition-colors ${
                            isAt ? 'bg-yellow-400' : isNear ? 'bg-blue-400' : 'bg-gray-400'
                          }`}
                        />
                        <div 
                          className={`text-xs sm:text-sm mt-1 transform -translate-x-1/2 font-bold transition-colors ${
                            isAt ? 'text-yellow-300 scale-125' : isNear ? 'text-blue-300' : 'text-gray-300'
                          }`}
                          style={{ marginLeft: '50%' }}
                        >
                          {num}
                        </div>
                        {isAt && (
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full whitespace-nowrap animate-fade-in">
                            <div className="bg-yellow-500 text-gray-900 text-[10px] sm:text-xs px-2 py-1 rounded font-bold">
                              Real Number
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Moving indicator with glow effect - using CSS animations */}
                  <div
                    className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all ${
                      isAnimating ? 'animate-bounce' : ''
                    }`}
                    style={{ left: `${((numberLinePosition + 10) / 20) * 100}%` }}
                  >
                    {/* Glow effect - only animate when active */}
                    {isAnimating && (
                      <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-50 animate-ping" />
                    )}
                    {/* Main indicator */}
                    <div className="relative w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full border-2 border-white shadow-lg">
                      {isAnimating && (
                        <div className="absolute inset-0 bg-blue-300 rounded-full opacity-75 animate-pulse" />
                      )}
                    </div>
                    {/* Trail effect */}
                    {isAnimating && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-500 rounded-full opacity-20 animate-ping" />
                    )}
                  </div>
                  
                  {/* Labels for number types */}
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] sm:text-xs text-gray-400">
                    <span>Negative Integers</span>
                    <span>Zero</span>
                    <span>Positive Integers</span>
                  </div>
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-all ${
                      isAnimating 
                        ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/50' 
                        : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/50'
                    }`}
                  >
                    {isAnimating ? '⏹ Stop Animation' : '▶ Start Animation'}
                  </button>
                  <button
                    onClick={() => setNumberLinePosition(0)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium"
                  >
                    Reset to 0
                  </button>
                </div>
                <p className="text-center text-indigo-300 text-xs sm:text-sm mt-3">
                  {isAnimating 
                    ? '✨ Watch the indicator move along the number line - every point is a real number!' 
                    : 'Every point on this line is a real number - rational and irrational!'}
                </p>
              </div>
            </div>
          )}

          {/* Stage 7: WASSCE Practice */}
          {stage === 7 && (
            <div className="mt-3 sm:mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { q: 'Is 0.333... rational?', a: 'Yes! It equals ⅓', type: 'rational' },
                  { q: 'Is √9 irrational?', a: 'No! It equals 3 (rational)', type: 'rational' },
                  { q: 'Is 0 a natural number?', a: 'No! Natural numbers start from 1', type: 'whole' },
                  { q: 'Is -5 an integer?', a: 'Yes! Integers include negatives', type: 'integer' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-lg p-3 sm:p-4 border border-yellow-700"
                  >
                    <div className="text-yellow-300 font-bold text-sm sm:text-base mb-2">
                      {item.q.includes('√9') ? (
                        <>Is <span style={{ fontFamily: 'serif' }}>{String.fromCharCode(8730)}9</span> irrational?</>
                      ) : (
                        item.q
                      )}
                    </div>
                    <div className="text-white text-xs sm:text-sm">{item.a}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Quick facts */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-blue-900/50 rounded-lg p-2 sm:p-3 text-center border border-blue-700">
          <Hash className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-blue-300 text-[10px] sm:text-sm">Natural</p>
          <p className="text-white font-mono text-xs sm:text-base">1, 2, 3...</p>
        </div>
        <div className="bg-green-900/50 rounded-lg p-2 sm:p-3 text-center border border-green-700">
          <Divide className="w-4 h-4 sm:w-6 sm:h-6 text-green-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-green-300 text-[10px] sm:text-sm">Rational</p>
          <p className="text-white font-mono text-xs sm:text-base">p/q</p>
        </div>
        <div className="bg-purple-900/50 rounded-lg p-2 sm:p-3 text-center border border-purple-700">
          <Infinity className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-purple-300 text-[10px] sm:text-sm">Irrational</p>
          <p className="text-white font-mono text-xs sm:text-base">
            π, <span style={{ fontFamily: 'serif' }}>{String.fromCharCode(8730)}2</span>
          </p>
        </div>
      </div>

      {/* Fixed Navigation - Compact mobile design */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/98 backdrop-blur-md px-2 sm:px-6 py-1.5 sm:py-4 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] sm:pb-4 border-t border-gray-700/50 z-[9999] shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-0">
          {/* Stage indicators - compact on mobile */}
          <div className="flex gap-1 sm:gap-2 overflow-x-auto flex-1 min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {stages.map((_, i) => (
              <button
                key={i}
                onClick={() => handleStageChange(i)}
                className={`flex-shrink-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                  i === stage ? 'bg-blue-400 ring-1 ring-blue-300' : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to stage ${i + 1}`}
              />
            ))}
          </div>
          
          {/* Navigation buttons - compact on mobile */}
          <div className="flex gap-1.5 sm:gap-3 flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStageChange(stage - 1)}
              disabled={stage === 0}
              className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-base transition-all flex items-center justify-center ${
                stage === 0 
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white active:bg-gray-500'
              }`}
              aria-label="Previous stage"
            >
              <ChevronLeft className="w-4 h-4 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline ml-1">Back</span>
            </motion.button>
            
            {stage < stages.length - 1 ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStageChange(stage + 1)}
                className="px-2 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-400 rounded-lg text-white text-xs sm:text-base font-medium flex items-center justify-center shadow-lg shadow-blue-500/30"
                aria-label="Next stage"
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="w-4 h-4 sm:w-4 sm:h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  onComplete?.();
                }}
                className="px-2 py-1.5 sm:px-6 sm:py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-400 rounded-lg text-white text-xs sm:text-base font-medium flex items-center justify-center shadow-lg shadow-blue-500/30"
                aria-label="Start learning"
              >
                <span className="hidden sm:inline mr-1">Start Learning!</span>
                <Trophy className="w-4 h-4 sm:w-4 sm:h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default TypesOfNumbersIntro;
