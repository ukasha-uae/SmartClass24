'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Slice, Calculator, Percent, ArrowLeftRight, Trophy, Play, Pause, Volume2, VolumeX, GraduationCap, ChevronLeft, ChevronRight, Divide, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountryProperties } from '@/hooks/useCountryConfig';

interface LessonIntroProps {
  onComplete?: () => void;
}

const FractionsDecimalsPercentagesIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const { currencyName } = useCountryProperties();
  const [stage, setStage] = useState(0);
  
  // Interactive state for demonstrations
  const [selectedFraction, setSelectedFraction] = useState<{ num: number; den: number } | null>(null);
  const [fractionParts, setFractionParts] = useState(4);
  const [shadedParts, setShadedParts] = useState(3);
  const [decimalValue, setDecimalValue] = useState(0.75);
  const [percentValue, setPercentValue] = useState(75);
  const [conversionType, setConversionType] = useState<'fraction' | 'decimal' | 'percent'>('fraction');
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  // Common fractions for quick selection
  const commonFractions = [
    { num: 1, den: 2, label: '½', decimal: 0.5, percent: 50 },
    { num: 1, den: 4, label: '¼', decimal: 0.25, percent: 25 },
    { num: 3, den: 4, label: '¾', decimal: 0.75, percent: 75 },
    { num: 1, den: 3, label: '⅓', decimal: 0.333, percent: 33.33 },
    { num: 2, den: 3, label: '⅔', decimal: 0.667, percent: 66.67 },
    { num: 1, den: 5, label: '⅕', decimal: 0.2, percent: 20 },
    { num: 2, den: 5, label: '⅖', decimal: 0.4, percent: 40 },
    { num: 3, den: 5, label: '⅗', decimal: 0.6, percent: 60 },
  ];

  const stages = [
    {
      title: "🍕 Fractions, Decimals & Percentages!",
      content: "Three ways to express the same thing - parts of a whole!",
      narration: `Welcome to fractions, decimals, and percentages! We use these every single day - when you buy half a loaf of bread at the market, that's a fraction! When you see a price tag showing 2.50 ${currencyName}, that's a decimal! When you get 25% off during a sale, that's a percentage! These are three different ways to express the same concept: parts of a whole. Understanding how to convert between them is essential for shopping, cooking, banking, and most importantly, for your WASSCE examinations!`,
      highlightWords: ['fractions', 'decimals', 'percentages', 'market', '25%', 'WASSCE', 'convert']
    },
    {
      title: "🍰 Understanding Fractions",
      content: "Fractions show parts of a whole! Click to see different fractions.",
      narration: "A fraction represents parts of a whole! The top number is called the numerator - it tells you how many parts you have. The bottom number is the denominator - it tells you the total number of equal parts. For example, three-quarters means you have 3 parts out of 4 equal parts. Fractions are everywhere - half a loaf of bread, quarter tank of fuel, three-quarters of your monthly salary! Fractions help us share things fairly, measure ingredients in cooking, and understand proportions in recipes. The key is that all parts must be equal!",
      highlightWords: ['fraction', 'numerator', 'denominator', 'parts', 'whole', 'three-quarters', 'equal parts', 'share', 'proportions']
    },
    {
      title: "🔢 Decimals - Another Language",
      content: "Decimals are fractions written differently! Click to convert.",
      narration: `Decimals are just another way to write fractions! One-half equals 0.5. One-quarter equals 0.25. Three-quarters equals 0.75. To convert a fraction to a decimal, simply divide the numerator by the denominator! So three-quarters? Divide 3 by 4 to get 0.75! Decimals are especially useful for money - prices like 2.50 ${currencyName}, 15.75 ${currencyName}, or 0.50 ${currencyName} are all decimals. They're also used in measurements - 0.5 meters, 1.25 liters, 2.75 kilograms. Decimals make calculations easier, especially when using calculators!`,
      highlightWords: ['decimals', 'fractions', '0.5', '0.25', '0.75', 'divide', 'numerator', 'denominator', 'money', 'calculators']
    },
    {
      title: "% Percentages - Per Hundred",
      content: "Percentages mean 'out of 100'! Perfect for discounts and sales!",
      narration: "Percentages mean 'per hundred' or 'out of 100'! 50% means 50 out of 100, which equals one-half. 25% means 25 out of 100, which equals one-quarter. To convert a decimal to a percent, multiply by 100! So 0.75 times 100 equals 75 percent. Easy! Percentages are everywhere - 15% VAT on purchases, 25% discount during sales, 10% interest on savings, 50% off during clearance! Understanding percentages helps you calculate discounts, understand interest rates, and make smart financial decisions. They're also essential for WASSCE questions on percentage increase and decrease!",
      highlightWords: ['percentages', 'per hundred', 'out of 100', '50%', '25%', 'multiply by 100', 'VAT', 'discount', 'interest', 'percentage increase', 'decrease']
    },
    {
      title: "🔄 Master All Conversions!",
      content: "Convert between fractions, decimals, and percentages easily!",
      narration: "Master all three conversions! Fraction to decimal: divide numerator by denominator. Decimal to percent: multiply by 100. Percent to fraction: write the percent over 100 and simplify. For example, 25% equals 25 over 100, which simplifies to one-quarter! Here's a trick: remember that 1 equals 100%, so half equals 50%, quarter equals 25%, and three-quarters equals 75%! Practice these conversions until they become automatic. In WASSCE, you'll need to convert quickly and accurately. Create a mental conversion triangle: fraction at the top, decimal on the left, percent on the right!",
      highlightWords: ['conversions', 'divide', 'multiply by 100', 'simplify', '25%', 'one-quarter', '50%', '75%', 'automatic', 'conversion triangle']
    },
    {
      title: "💰 Real-World Applications",
      content: "See how fractions, decimals, and percentages are used daily!",
      narration: `These concepts are used everywhere! In COMMERCE, shopkeepers calculate discounts - if something costs 100 ${currencyName} and there's a 20% discount, you save 20 ${currencyName}! In COOKING, recipes use fractions - half a cup of flour, quarter teaspoon of salt, three-quarters cup of water. In FINANCE, banks use percentages for interest rates - if you save 1000 ${currencyName} at 10% interest, you earn 100 ${currencyName}! In MEASUREMENTS, we convert between units - 0.5 meters equals half a meter equals 50% of a meter. Even in SPORTS, we use percentages - if a football team wins 3 out of 4 games, that's 75% win rate!`,
      highlightWords: ['commerce', 'discounts', 'cooking', 'recipes', 'finance', 'interest rates', 'measurements', 'sports', 'win rate']
    },
    {
      title: "🎯 WASSCE Success Tips!",
      content: "Master these for guaranteed marks in your examinations!",
      narration: "WASSCE tests these conversions every single year! You'll be asked to calculate percentage increase or decrease, find fractions of amounts, convert between all three forms, and solve word problems. Always show your working - write each conversion step clearly. For percentage increase, use: new value minus old value, divided by old value, times 100. For percentage decrease, same formula but the answer will be negative. Practice with real examples: if a price increases from 50 cedis to 60 cedis, that's a 20% increase! These are guaranteed marks if you practice regularly!",
      highlightWords: ['WASSCE', 'percentage increase', 'percentage decrease', 'conversions', 'word problems', 'show your working', 'guaranteed marks', 'practice']
    }
  ];

  // Auto-update related values when one changes
  useEffect(() => {
    if (selectedFraction) {
      const decimal = selectedFraction.num / selectedFraction.den;
      const percent = decimal * 100;
      setDecimalValue(decimal);
      setPercentValue(percent);
    }
  }, [selectedFraction]);

  useEffect(() => {
    if (fractionParts > 0 && shadedParts >= 0 && shadedParts <= fractionParts) {
      const decimal = shadedParts / fractionParts;
      const percent = decimal * 100;
      setDecimalValue(decimal);
      setPercentValue(percent);
      setSelectedFraction({ num: shadedParts, den: fractionParts });
    }
  }, [fractionParts, shadedParts]);

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
    // Reset demos only if not staying on stage 3
    if (newStage !== 3) {
      setSelectedFraction(null);
      setFractionParts(4);
      setShadedParts(3);
      setDecimalValue(0.75);
      setPercentValue(75);
    }
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
              ? 'bg-orange-400/40 text-white font-semibold px-0.5 rounded' 
              : isHighlightWord 
                ? 'text-orange-300 font-medium'
                : 'text-gray-300'
          }`}
        >
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-orange-900/30 via-gray-900 to-yellow-900/30 rounded-2xl p-4 sm:p-6 md:p-8 pb-20 sm:pb-28 overflow-visible sm:overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['½', '¼', '¾', '%', '0.5'].map((symbol, i) => {
          const x1 = Math.random() * 100;
          const x2 = Math.random() * 300;
          const y1 = Math.random() * 50;
          const y2 = Math.random() * 200;
          return (
            <motion.div
              key={i}
              className="absolute text-2xl text-orange-400/30"
              initial={{ opacity: 0, x: x1, y: y1 }}
              animate={{ 
                opacity: [0, 0.4, 0],
                x: [x1, x2],
                y: [y1, y2]
              }}
              transition={{ 
                duration: 4,
                delay: i * 1.5,
                repeat: Infinity as number,
                repeatType: "loop" as const,
                repeatDelay: 2,
                ease: "easeInOut"
              }}
            >
              {symbol}
            </motion.div>
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
          <Slice className="w-6 h-6 sm:w-10 sm:h-10 text-orange-400" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Fractions, Decimals & Percentages
          </h2>
          <Percent className="w-6 h-6 sm:w-10 sm:h-10 text-orange-300" />
        </div>
        <p className="text-orange-200 text-sm sm:text-lg">Three Ways to Express Parts of a Whole</p>
      </motion.div>

      {/* Teacher Avatar & Narration */}
      <motion.div 
        className="bg-gradient-to-r from-orange-900/40 to-yellow-900/40 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-orange-700/50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-start gap-2 sm:gap-4">
          <div className="flex-shrink-0">
            <motion.div 
              className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center ${
                isSpeaking && !isPaused ? 'ring-2 sm:ring-4 ring-orange-400/50' : ''
              }`}
              animate={isSpeaking && !isPaused ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={isSpeaking && !isPaused ? { 
                duration: 0.5, 
                repeat: Infinity as number, 
                repeatType: "loop" as const,
                ease: "easeInOut"
              } : { duration: 0.2 }}
            >
              <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            </motion.div>
            <p className="text-center text-[10px] sm:text-xs text-orange-300 mt-1 hidden sm:block">Teacher</p>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm leading-relaxed max-h-16 sm:max-h-24 overflow-y-auto pr-1 sm:pr-2">
              {renderNarrationText()}
            </div>
          </div>

          <div className="flex flex-col gap-1 sm:gap-2">
            {isSpeaking ? (
              <button onClick={togglePause} className="p-1.5 sm:p-2 bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors" title={isPaused ? "Resume" : "Pause"}>
                {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
              </button>
            ) : (
              <button onClick={replayNarration} className="p-1.5 sm:p-2 bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors" title="Play narration">
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
          className="bg-gray-800/80 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 overflow-visible"
        >
          <h3 className="text-lg sm:text-2xl font-bold text-orange-400 mb-2 sm:mb-3">{stages[stage].title}</h3>
          <p className="text-gray-200 text-sm sm:text-lg mb-3 sm:mb-4">{stages[stage].content}</p>

          {/* Stage 1: Fraction Visualization */}
          {stage === 1 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-orange-900/50 to-yellow-900/50 rounded-lg p-4 mb-4">
                <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Interactive Fraction Visualizer:</p>
                
                {/* Fraction selector */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4">
                  {commonFractions.slice(0, 6).map((frac, i) => (
                    <motion.button
                      key={i}
                      onClick={() => {
                        setSelectedFraction({ num: frac.num, den: frac.den });
                        setFractionParts(frac.den);
                        setShadedParts(frac.num);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-lg sm:text-xl font-bold transition-all ${
                        selectedFraction?.num === frac.num && selectedFraction?.den === frac.den
                          ? 'bg-orange-600 text-white ring-4 ring-orange-400'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      }`}
                    >
                      {frac.label}
                    </motion.button>
                  ))}
                </div>

                {/* Visual fraction representation */}
                {selectedFraction && (
                  <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                    <div className="text-center mb-3">
                      <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        {selectedFraction.num}/{selectedFraction.den}
                      </div>
                      <div className="text-sm sm:text-base text-gray-300">
                        = {decimalValue.toFixed(2)} = {percentValue.toFixed(1)}%
                      </div>
                    </div>
                    
                    {/* Circle visualization */}
                    <div className="flex justify-center mb-4">
                      <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {Array.from({ length: selectedFraction.den }).map((_, i) => {
                            const angle = (360 / selectedFraction.den) * i;
                            const isShaded = i < selectedFraction.num;
                            return (
                              <path
                                key={i}
                                d={`M 50,50 L 50,0 A 50,50 0 ${angle + (360 / selectedFraction.den) > 180 ? 1 : 0},1 ${50 + 50 * Math.cos((angle + 360 / selectedFraction.den) * Math.PI / 180)},${50 + 50 * Math.sin((angle + 360 / selectedFraction.den) * Math.PI / 180)} Z`}
                                fill={isShaded ? '#f97316' : '#4b5563'}
                                stroke="#1f2937"
                                strokeWidth="1"
                                transform={`rotate(${angle} 50 50)`}
                              />
                            );
                          })}
                        </svg>
                      </div>
                    </div>

                    {/* Bar visualization */}
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex gap-1 h-8 sm:h-10">
                        {Array.from({ length: selectedFraction.den }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`flex-1 rounded ${
                              i < selectedFraction.num ? 'bg-orange-500' : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-center text-xs sm:text-sm text-gray-400 mt-2">
                        {selectedFraction.num} out of {selectedFraction.den} parts shaded
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom fraction builder */}
                <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4">
                  <p className="text-center text-gray-300 text-xs sm:text-sm mb-3">Build your own fraction:</p>
                  <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                    <div className="flex flex-col items-center">
                      <label className="text-xs sm:text-sm text-gray-400 mb-1">Shaded</label>
                      <input
                        type="range"
                        min="0"
                        max={fractionParts}
                        value={shadedParts}
                        onChange={(e) => setShadedParts(parseInt(e.target.value))}
                        className="w-20 sm:w-32"
                      />
                      <span className="text-white font-bold text-sm sm:text-base mt-1">{shadedParts}</span>
                    </div>
                    <Divide className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    <div className="flex flex-col items-center">
                      <label className="text-xs sm:text-sm text-gray-400 mb-1">Total</label>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        value={fractionParts}
                        onChange={(e) => {
                          const newParts = parseInt(e.target.value);
                          setFractionParts(newParts);
                          if (shadedParts > newParts) setShadedParts(newParts);
                        }}
                        className="w-20 sm:w-32"
                      />
                      <span className="text-white font-bold text-sm sm:text-base mt-1">{fractionParts}</span>
                    </div>
                  </div>
                  {fractionParts > 0 && (
                    <div className="text-center text-lg sm:text-xl font-bold text-orange-400">
                      {shadedParts}/{fractionParts} = {decimalValue.toFixed(3)} = {percentValue.toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stage 2: Decimal Conversion */}
          {stage === 2 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-blue-900/50 to-cyan-900/50 rounded-lg p-4 mb-4">
                <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Click to see decimal conversions:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {commonFractions.map((frac, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedFraction({ num: frac.num, den: frac.den });
                        setDecimalValue(frac.decimal);
                        setPercentValue(frac.percent);
                      }}
                      className={`p-3 rounded-lg text-center transition-all ${
                        selectedFraction?.num === frac.num && selectedFraction?.den === frac.den
                          ? 'bg-blue-600 ring-4 ring-blue-400'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <div className="text-white font-bold text-lg sm:text-xl">{frac.label}</div>
                      <div className="text-gray-300 text-xs sm:text-sm mt-1">= {frac.decimal}</div>
                    </motion.button>
                  ))}
                </div>
                {selectedFraction && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-blue-600/30 rounded-lg border border-blue-500"
                  >
                    <div className="text-center">
                      <div className="text-blue-200 text-sm sm:text-base">
                        <strong>{selectedFraction.num} ÷ {selectedFraction.den}</strong> = <strong className="text-white">{decimalValue.toFixed(3)}</strong>
                      </div>
                      <div className="text-blue-300 text-xs sm:text-sm mt-1">
                        To convert: Divide numerator by denominator
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Stage 3: Percentage Conversion */}
          {stage === 3 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-green-900/50 to-emerald-900/50 rounded-lg p-4 mb-4">
                <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Click to see percentage conversions:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                  {commonFractions.map((frac, i) => {
                    const isSelected = selectedFraction?.num === frac.num && selectedFraction?.den === frac.den;
                    return (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const newFraction = { num: frac.num, den: frac.den };
                          setSelectedFraction(newFraction);
                          setPercentValue(frac.percent);
                          setDecimalValue(frac.decimal);
                          // Force re-render and scroll on mobile
                          setTimeout(() => {
                            const conversionEl = document.getElementById('percentage-conversion-result');
                            if (conversionEl) {
                              conversionEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                            }
                          }, 200);
                        }}
                        className={`p-2 sm:p-3 rounded-lg text-center transition-all touch-manipulation active:scale-95 ${
                          isSelected
                            ? 'bg-green-600 ring-2 sm:ring-4 ring-green-400'
                            : 'bg-gray-700 hover:bg-gray-600 active:bg-gray-600'
                        }`}
                      >
                        <div className="text-white font-bold text-base sm:text-lg sm:text-xl">{frac.label}</div>
                        <div className="text-gray-300 text-[10px] sm:text-xs sm:text-sm mt-0.5 sm:mt-1">= {frac.percent}%</div>
                      </button>
                    );
                  })}
                </div>
                {selectedFraction && (
                  <motion.div
                    id="percentage-conversion-result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 sm:mt-4 p-3 sm:p-4 bg-green-600/30 rounded-lg border-2 border-green-500 z-10 relative"
                  >
                    <div className="text-center">
                      <div className="text-green-200 text-xs sm:text-sm sm:text-base break-words font-semibold">
                        <strong className="text-white">{decimalValue.toFixed(2)}</strong> × 100 = <strong className="text-white text-lg">{percentValue.toFixed(1)}%</strong>
                      </div>
                      <div className="text-green-300 text-[10px] sm:text-xs sm:text-sm mt-2 sm:mt-2">
                        To convert: Multiply decimal by 100
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Stage 4: Conversion Triangle */}
          {stage === 4 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-purple-900/50 to-pink-900/50 rounded-lg p-4 mb-4">
                <p className="text-center text-gray-200 mb-4 text-sm sm:text-base">Conversion Triangle:</p>
                <div className="flex flex-col items-center">
                  {/* Triangle visualization */}
                  <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-4">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* Triangle */}
                      <polygon points="100,20 180,160 20,160" fill="#4b5563" stroke="#f97316" strokeWidth="3" />
                      {/* Labels */}
                      <text x="100" y="35" textAnchor="middle" className="text-white font-bold text-lg sm:text-xl" fill="white">Fraction</text>
                      <text x="50" y="140" textAnchor="middle" className="text-white font-bold text-lg sm:text-xl" fill="white">Decimal</text>
                      <text x="150" y="140" textAnchor="middle" className="text-white font-bold text-lg sm:text-xl" fill="white">Percent</text>
                      {/* Arrows */}
                      <path d="M 100,50 L 60,130" stroke="#f97316" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                      <path d="M 100,50 L 140,130" stroke="#f97316" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                      <path d="M 60,130 L 140,130" stroke="#f97316" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                          <polygon points="0 0, 10 3, 0 6" fill="#f97316" />
                        </marker>
                      </defs>
                    </svg>
                  </div>
                  
                  {/* Conversion rules */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-orange-400 font-bold text-sm sm:text-base mb-2">F → D</div>
                      <div className="text-gray-300 text-xs sm:text-sm">Divide numerator by denominator</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-orange-400 font-bold text-sm sm:text-base mb-2">D → %</div>
                      <div className="text-gray-300 text-xs sm:text-sm">Multiply by 100</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-orange-400 font-bold text-sm sm:text-base mb-2">% → F</div>
                      <div className="text-gray-300 text-xs sm:text-sm">Write over 100, simplify</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage 5: Real-World Examples */}
          {stage === 5 && (
            <div className="mt-3 sm:mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { 
                    title: '🛒 Commerce', 
                    examples: ['20% discount = 0.20 = ⅕', '15% VAT = 0.15 = 3/20', '50% off = 0.50 = ½'],
                    color: 'from-blue-900/50 to-cyan-900/50',
                    border: 'border-blue-700'
                  },
                  { 
                    title: '👨‍🍳 Cooking', 
                    examples: ['½ cup = 0.5 cup = 50%', '¼ tsp = 0.25 tsp = 25%', '¾ cup = 0.75 cup = 75%'],
                    color: 'from-orange-900/50 to-red-900/50',
                    border: 'border-orange-700'
                  },
                  { 
                    title: '💰 Finance', 
                    examples: ['10% interest = 0.10 = 1/10', '5% savings = 0.05 = 1/20', '25% profit = 0.25 = ¼'],
                    color: 'from-green-900/50 to-emerald-900/50',
                    border: 'border-green-700'
                  },
                  { 
                    title: '📏 Measurements', 
                    examples: ['0.5m = ½m = 50%', '0.25L = ¼L = 25%', '0.75kg = ¾kg = 75%'],
                    color: 'from-purple-900/50 to-pink-900/50',
                    border: 'border-purple-700'
                  }
                ].map((category, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-gradient-to-br ${category.color} rounded-lg p-3 sm:p-4 border ${category.border}`}
                  >
                    <div className="text-white font-bold text-sm sm:text-base mb-2">{category.title}</div>
                    <ul className="space-y-1">
                      {category.examples.map((ex, j) => (
                        <li key={j} className="text-gray-300 text-xs sm:text-sm">• {ex}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 6: WASSCE Practice */}
          {stage === 6 && (
            <div className="mt-3 sm:mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { 
                    q: 'Price: 100₵ → 120₵', 
                    a: '20% increase', 
                    calc: '(120-100)/100 × 100 = 20%',
                    type: 'increase'
                  },
                  { 
                    q: 'Price: 80₵ → 60₵', 
                    a: '25% decrease', 
                    calc: '(80-60)/80 × 100 = 25%',
                    type: 'decrease'
                  },
                  { 
                    q: 'Convert ¾ to %', 
                    a: '75%', 
                    calc: '3 ÷ 4 = 0.75, 0.75 × 100 = 75%',
                    type: 'conversion'
                  },
                  { 
                    q: 'Convert 0.6 to fraction', 
                    a: '3/5', 
                    calc: '0.6 = 6/10 = 3/5 (simplified)',
                    type: 'conversion'
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-lg p-3 sm:p-4 border border-yellow-700"
                  >
                    <div className="text-yellow-300 font-bold text-sm sm:text-base mb-2">{item.q}</div>
                    <div className="text-white text-xs sm:text-sm mb-1">{item.a}</div>
                    <div className="text-gray-400 text-[10px] sm:text-xs">{item.calc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Quick facts */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-orange-900/50 rounded-lg p-2 sm:p-3 text-center border border-orange-700">
          <Slice className="w-4 h-4 sm:w-6 sm:h-6 text-orange-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-orange-300 text-[10px] sm:text-sm">Fraction</p>
          <p className="text-white font-mono text-xs sm:text-base">a/b</p>
        </div>
        <div className="bg-blue-900/50 rounded-lg p-2 sm:p-3 text-center border border-blue-700">
          <Calculator className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-blue-300 text-[10px] sm:text-sm">Decimal</p>
          <p className="text-white font-mono text-xs sm:text-base">0.XX</p>
        </div>
        <div className="bg-green-900/50 rounded-lg p-2 sm:p-3 text-center border border-green-700">
          <Percent className="w-4 h-4 sm:w-6 sm:h-6 text-green-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-green-300 text-[10px] sm:text-sm">Percent</p>
          <p className="text-white font-mono text-xs sm:text-base">XX%</p>
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
                  i === stage ? 'bg-orange-400 ring-1 ring-orange-300' : 'bg-gray-600 hover:bg-gray-500'
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
                className="px-2 py-1.5 sm:px-4 sm:py-2 bg-orange-600 hover:bg-orange-500 active:bg-orange-400 rounded-lg text-white text-xs sm:text-base font-medium flex items-center justify-center shadow-lg shadow-orange-500/30"
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
                className="px-2 py-1.5 sm:px-6 sm:py-2 bg-orange-600 hover:bg-orange-500 active:bg-orange-400 rounded-lg text-white text-xs sm:text-base font-medium flex items-center justify-center shadow-lg shadow-orange-500/30"
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
  );
};

export default FractionsDecimalsPercentagesIntro;
