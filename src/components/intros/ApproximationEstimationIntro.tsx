'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Target, Ruler, Sigma, Calculator, Trophy, Play, Pause, Volume2, VolumeX, GraduationCap, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountryProperties } from '@/hooks/useCountryConfig';

interface LessonIntroProps {
  onComplete?: () => void;
}

const ApproximationEstimationIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const { currencyName } = useCountryProperties();
  const [stage, setStage] = useState(0);
  
  // Interactive state for demonstrations
  const [roundingNumber, setRoundingNumber] = useState<string>('3487');
  const [roundingTo, setRoundingTo] = useState<'whole' | '10' | '100' | '1000'>('10');
  const [roundedResult, setRoundedResult] = useState<number | null>(null);
  
  const [decimalNumber, setDecimalNumber] = useState<string>('12.4738');
  const [decimalPlaces, setDecimalPlaces] = useState<number>(2);
  const [decimalResult, setDecimalResult] = useState<string | null>(null);
  
  const [sigFigNumber, setSigFigNumber] = useState<string>('0.004582');
  const [sigFigCount, setSigFigCount] = useState<number>(2);
  const [sigFigResult, setSigFigResult] = useState<string | null>(null);
  
  const [standardFormNumber, setStandardFormNumber] = useState<string>('45000');
  const [standardFormResult, setStandardFormResult] = useState<string | null>(null);
  
  const [estimationNum1, setEstimationNum1] = useState<string>('48.7');
  const [estimationNum2, setEstimationNum2] = useState<string>('21.3');
  const [estimationOperation, setEstimationOperation] = useState<'multiply' | 'divide' | 'add' | 'subtract'>('multiply');
  const [estimationResult, setEstimationResult] = useState<number | null>(null);
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  const stages = [
    {
      title: "🎯 Approximation & Estimation - Close Enough!",
      content: "Sometimes close enough is perfect! Rounding makes numbers easier to work with.",
      narration: `Welcome to approximation and estimation! In real life, we don't always need exact numbers. Sometimes, an approximate value is good enough or even better because it's easier to remember and work with. Think about money: if a car costs ${currencyName}149,950, we say "about ${currencyName}150,000". Think about population: we say "about 33 million" instead of the exact number. Think about shopping: estimating your total bill before you get to the cashier to ensure you have enough money. Approximation is finding a value that is close enough to the right answer. Estimation is making a rough calculation to check if an answer makes sense. These skills are tested in almost every WASSCE Core Mathematics paper!`,
      highlightWords: ['approximation', 'estimation', 'close enough', 'rounding', 'money', 'population', 'WASSCE']
    },
    {
      title: "🔢 Rounding - The 5 Rule!",
      content: "5 or more, round up! 4 or less, round down! Try it yourself.",
      narration: `Rounding follows a simple rule! Look at the digit to the right of where you want to round. If it's 5 or more - that's 5, 6, 7, 8, or 9 - you round UP. If it's 4 or less - that's 0, 1, 2, 3, or 4 - you round DOWN. For example, rounding to the nearest 10: 47 rounds to 50 because 7 is 5 or more. 43 rounds to 40 because 3 is 4 or less. Rounding to the nearest 100: 3487 rounds to 3500 because the tens digit is 8, which is 5 or more. Rounding to the nearest 1000: 3487 rounds to 3000 because the hundreds digit is 4, which is 4 or less. Remember the rhyme: "5 or more, raise the score; 4 or less, let it rest!"`,
      highlightWords: ['rounding', '5 or more', 'round up', '4 or less', 'round down', 'nearest 10', 'nearest 100', 'nearest 1000']
    },
    {
      title: "📐 Decimal Places - Count After the Point!",
      content: "Decimal places count digits after the decimal point. Try rounding decimals!",
      narration: `Decimal places count digits after the decimal point! To round to a certain number of decimal places, count that many digits after the point, then look at the next digit to decide whether to round up or stay. For example, rounding 12.4738 to 2 decimal places: count 2 digits after the point - that's 4 and 7. Look at the next digit - that's 3. Since 3 is 4 or less, we keep 7. Answer: 12.47. Rounding to 1 decimal place: count 1 digit - that's 4. Look at the next digit - that's 7. Since 7 is 5 or more, we round up 4 to 5. Answer: 12.5. Special case: if you round up a 9, it becomes 10, so you write 0 and carry 1 to the left. For example, 3.197 to 2 decimal places becomes 3.20!`,
      highlightWords: ['decimal places', 'after the point', 'count digits', 'round up', 'round down', 'carry']
    },
    {
      title: "🔍 Significant Figures - Meaningful Digits!",
      content: "Significant figures count meaningful digits from the first non-zero!",
      narration: `Significant figures measure the precision of a number starting from the first non-zero digit! Non-zero digits are always significant. Zeros between non-zero digits are significant. Leading zeros - zeros at the start - are never significant. They just place the decimal. Trailing zeros - zeros at the end of a decimal number - are significant. For example, 0.00347 has 3 significant figures: 3, 4, and 7. The leading zeros don't count! 4500 to 2 significant figures is 4500 or 4.5 times 10 to the power 3. When rounding to significant figures, start counting from the first non-zero digit. For example, 0.004582 to 2 significant figures: first is 4, second is 5, next is 8, so round up to 0.0046!`,
      highlightWords: ['significant figures', 'meaningful digits', 'non-zero', 'leading zeros', 'trailing zeros', 'precision']
    },
    {
      title: "📊 Standard Form - Big & Small Numbers!",
      content: "Standard form makes huge and tiny numbers easy to write!",
      narration: `Standard form writes numbers as A times 10 to the power n, where A is between 1 and 10! For big numbers, move the decimal point to the left until one digit remains before it, and count the jumps. For example, 45,000: move the point 4 places left to get 4.5, so it's 4.5 times 10 to the power 4. For small numbers, move the decimal point to the right until one non-zero digit is before it, and count the jumps as negative. For example, 0.00056: move the point 4 places right to get 5.6, so it's 5.6 times 10 to the power negative 4. Standard form is used in science for very large numbers like distances in space, and very small numbers like the size of atoms!`,
      highlightWords: ['standard form', 'A times 10', 'power n', 'big numbers', 'small numbers', 'move decimal', 'science']
    },
    {
      title: "🧮 Estimation - Quick Mental Checks!",
      content: "Estimate before calculating to check if your answer makes sense!",
      narration: `Estimation is making a rough calculation to check if an answer makes sense! To estimate, round each number to 1 significant figure first, then perform the operation. For example, estimate 48.7 times 21.3: round 48.7 to 50, round 21.3 to 20, multiply 50 times 20 equals 1000. The actual answer should be close to 1000! If you calculate and get 10,000, you know something is wrong. Estimation helps you catch calculator errors and check your work. Always estimate before calculating, especially in WASSCE examinations. It's a quick way to verify your answers make logical sense!`,
      highlightWords: ['estimation', 'rough calculation', '1 significant figure', 'check', 'verify', 'calculator errors', 'WASSCE']
    },
    {
      title: "🏆 WASSCE Success - Master All Forms!",
      content: "WASSCE tests all forms of approximation! Practice makes perfect!",
      narration: `WASSCE examinations test rounding, significant figures, and standard form every year! Here are key tips: Read the question carefully - does it ask for decimal places or significant figures? These are different! Always give the degree of accuracy requested. When rounding, watch out for special cases like rounding up a 9. For standard form, make sure A is between 1 and 10. Use estimation to verify your calculated answers - if your estimate is 1000 and your answer is 10, you know something's wrong! Practice converting between different forms of approximation. Master these skills and you'll score easy marks in WASSCE!`,
      highlightWords: ['WASSCE', 'decimal places', 'significant figures', 'standard form', 'degree of accuracy', 'verify', 'practice']
    }
  ];

  // Calculate rounding result
  useEffect(() => {
    if (roundingNumber && !isNaN(parseFloat(roundingNumber))) {
      const num = parseFloat(roundingNumber);
      let result: number;
      
      switch (roundingTo) {
        case 'whole':
          result = Math.round(num);
          break;
        case '10':
          result = Math.round(num / 10) * 10;
          break;
        case '100':
          result = Math.round(num / 100) * 100;
          break;
        case '1000':
          result = Math.round(num / 1000) * 1000;
          break;
        default:
          result = num;
      }
      setRoundedResult(result);
    }
  }, [roundingNumber, roundingTo]);

  // Calculate decimal places result
  useEffect(() => {
    if (decimalNumber && !isNaN(parseFloat(decimalNumber))) {
      const num = parseFloat(decimalNumber);
      const multiplier = Math.pow(10, decimalPlaces);
      const rounded = Math.round(num * multiplier) / multiplier;
      setDecimalResult(rounded.toFixed(decimalPlaces));
    }
  }, [decimalNumber, decimalPlaces]);

  // Calculate significant figures result
  useEffect(() => {
    if (sigFigNumber && !isNaN(parseFloat(sigFigNumber)) && sigFigCount > 0) {
      const num = parseFloat(sigFigNumber);
      if (num === 0) {
        setSigFigResult('0');
        return;
      }
      
      const magnitude = Math.floor(Math.log10(Math.abs(num)));
      const factor = Math.pow(10, sigFigCount - magnitude - 1);
      const rounded = Math.round(num * factor) / factor;
      
      // Format to show correct number of significant figures
      if (Math.abs(rounded) >= 1) {
        setSigFigResult(rounded.toPrecision(sigFigCount));
      } else {
        const decimals = sigFigCount - magnitude - 1;
        setSigFigResult(rounded.toFixed(decimals));
      }
    }
  }, [sigFigNumber, sigFigCount]);

  // Calculate standard form result
  useEffect(() => {
    if (standardFormNumber && !isNaN(parseFloat(standardFormNumber))) {
      const num = parseFloat(standardFormNumber);
      if (num === 0) {
        setStandardFormResult('0');
        return;
      }
      
      const magnitude = Math.floor(Math.log10(Math.abs(num)));
      const coefficient = num / Math.pow(10, magnitude);
      setStandardFormResult(`${coefficient.toPrecision(3)} × 10^${magnitude}`);
    }
  }, [standardFormNumber]);

  // Calculate estimation result
  useEffect(() => {
    if (estimationNum1 && estimationNum2 && !isNaN(parseFloat(estimationNum1)) && !isNaN(parseFloat(estimationNum2))) {
      const num1 = parseFloat(estimationNum1);
      const num2 = parseFloat(estimationNum2);
      
      // Round to 1 significant figure
      const roundTo1SF = (n: number): number => {
        if (n === 0) return 0;
        const magnitude = Math.floor(Math.log10(Math.abs(n)));
        const factor = Math.pow(10, 1 - magnitude - 1);
        return Math.round(n * factor) / factor;
      };
      
      const est1 = roundTo1SF(num1);
      const est2 = roundTo1SF(num2);
      
      let result: number;
      switch (estimationOperation) {
        case 'multiply':
          result = est1 * est2;
          break;
        case 'divide':
          result = est2 !== 0 ? est1 / est2 : 0;
          break;
        case 'add':
          result = est1 + est2;
          break;
        case 'subtract':
          result = est1 - est2;
          break;
        default:
          result = 0;
      }
      setEstimationResult(result);
    }
  }, [estimationNum1, estimationNum2, estimationOperation]);

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
              ? 'bg-purple-400/40 text-white font-semibold px-0.5 rounded' 
              : isHighlightWord 
                ? 'text-purple-300 font-medium'
                : 'text-gray-300'
          }`}
        >
          {word}{' '}
        </span>
      );
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
      <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-900/30 via-gray-900 to-pink-900/30 rounded-2xl p-4 sm:p-6 md:p-8 pb-20 sm:pb-28 overflow-hidden">
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['≈', '~', '0', '×', '10'].map((symbol, i) => {
            const pos = [
              { x: 20, y: 10 },
              { x: 80, y: 30 },
              { x: 150, y: 50 },
              { x: 200, y: 20 },
              { x: 250, y: 40 }
            ][i] || { x: 20, y: 10 };
            return (
              <div
                key={i}
                className={`absolute text-2xl text-purple-400/30 float-anim-${i}`}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`
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
            <Target className="w-6 h-6 sm:w-10 sm:h-10 text-purple-400" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Approximation & Estimation
            </h2>
            <Calculator className="w-6 h-6 sm:w-10 sm:h-10 text-purple-300" />
          </div>
          <p className="text-purple-200 text-sm sm:text-lg">Rounding, Significant Figures & Standard Form</p>
        </motion.div>

        {/* Teacher Avatar & Narration */}
        <motion.div 
          className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-purple-700/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-start gap-2 sm:gap-4">
            <div className="flex-shrink-0">
              <div 
                className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center transition-all ${
                  isSpeaking && !isPaused ? 'ring-2 sm:ring-4 ring-purple-400/50 animate-pulse' : ''
                }`}
              >
                <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
              </div>
              <p className="text-center text-[10px] sm:text-xs text-purple-300 mt-1 hidden sm:block">Teacher</p>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm leading-relaxed max-h-16 sm:max-h-24 overflow-y-auto pr-1 sm:pr-2">
                {renderNarrationText()}
              </div>
            </div>

            <div className="flex flex-col gap-1 sm:gap-2">
              {isSpeaking ? (
                <button onClick={togglePause} className="p-1.5 sm:p-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors" title={isPaused ? "Resume" : "Pause"}>
                  {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                </button>
              ) : (
                <button onClick={replayNarration} className="p-1.5 sm:p-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors" title="Play narration">
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
            <h3 className="text-lg sm:text-2xl font-bold text-purple-400 mb-2 sm:mb-3">{stages[stage].title}</h3>
            <p className="text-gray-200 text-sm sm:text-lg mb-3 sm:mb-4">{stages[stage].content}</p>

            {/* Stage 1: Rounding Interactive */}
            {stage === 1 && (
              <div className="mt-3 sm:mt-4">
                <div className="bg-gradient-to-b from-blue-900/50 to-indigo-900/50 rounded-lg p-4 mb-4">
                  <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Try Rounding:</p>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <input
                        type="text"
                        value={roundingNumber}
                        onChange={(e) => setRoundingNumber(e.target.value)}
                        className="w-full sm:w-32 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                        placeholder="Enter number"
                      />
                      <span className="text-white font-bold">to nearest</span>
                      <select
                        value={roundingTo}
                        onChange={(e) => setRoundingTo(e.target.value as typeof roundingTo)}
                        className="px-3 py-2 bg-gray-700 text-white rounded-lg"
                      >
                        <option value="whole">Whole Number</option>
                        <option value="10">10</option>
                        <option value="100">100</option>
                        <option value="1000">1000</option>
                      </select>
                    </div>
                    {roundedResult !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-blue-600/30 rounded-lg border border-blue-500"
                      >
                        <p className="text-blue-200 text-sm sm:text-base text-center">
                          <strong>{roundingNumber}</strong> rounded to nearest <strong>{roundingTo === 'whole' ? 'whole number' : roundingTo}</strong> = <strong className="text-white">{roundedResult}</strong>
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stage 2: Decimal Places Interactive */}
            {stage === 2 && (
              <div className="mt-3 sm:mt-4">
                <div className="bg-gradient-to-b from-green-900/50 to-teal-900/50 rounded-lg p-4 mb-4">
                  <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Try Decimal Places:</p>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <input
                        type="text"
                        value={decimalNumber}
                        onChange={(e) => setDecimalNumber(e.target.value)}
                        className="w-full sm:w-32 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                        placeholder="Enter decimal"
                      />
                      <span className="text-white font-bold">to</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={decimalPlaces}
                        onChange={(e) => setDecimalPlaces(parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                      />
                      <span className="text-white font-bold">decimal places</span>
                    </div>
                    {decimalResult !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-green-600/30 rounded-lg border border-green-500"
                      >
                        <p className="text-green-200 text-sm sm:text-base text-center">
                          <strong>{decimalNumber}</strong> to <strong>{decimalPlaces} d.p.</strong> = <strong className="text-white">{decimalResult}</strong>
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stage 3: Significant Figures Interactive */}
            {stage === 3 && (
              <div className="mt-3 sm:mt-4">
                <div className="bg-gradient-to-b from-orange-900/50 to-yellow-900/50 rounded-lg p-4 mb-4">
                  <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Try Significant Figures:</p>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <input
                        type="text"
                        value={sigFigNumber}
                        onChange={(e) => setSigFigNumber(e.target.value)}
                        className="w-full sm:w-32 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                        placeholder="Enter number"
                      />
                      <span className="text-white font-bold">to</span>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={sigFigCount}
                        onChange={(e) => setSigFigCount(parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                      />
                      <span className="text-white font-bold">significant figures</span>
                    </div>
                    {sigFigResult !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-orange-600/30 rounded-lg border border-orange-500"
                      >
                        <p className="text-orange-200 text-sm sm:text-base text-center">
                          <strong>{sigFigNumber}</strong> to <strong>{sigFigCount} s.f.</strong> = <strong className="text-white">{sigFigResult}</strong>
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stage 4: Standard Form Interactive */}
            {stage === 4 && (
              <div className="mt-3 sm:mt-4">
                <div className="bg-gradient-to-b from-pink-900/50 to-red-900/50 rounded-lg p-4 mb-4">
                  <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Try Standard Form:</p>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <input
                        type="text"
                        value={standardFormNumber}
                        onChange={(e) => setStandardFormNumber(e.target.value)}
                        className="w-full sm:w-40 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                        placeholder="Enter number"
                      />
                      <span className="text-white font-bold">=</span>
                    </div>
                    {standardFormResult !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-pink-600/30 rounded-lg border border-pink-500"
                      >
                        <p className="text-pink-200 text-sm sm:text-base text-center font-mono">
                          <strong>{standardFormNumber}</strong> = <strong className="text-white">{standardFormResult}</strong>
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stage 5: Estimation Interactive */}
            {stage === 5 && (
              <div className="mt-3 sm:mt-4">
                <div className="bg-gradient-to-b from-cyan-900/50 to-blue-900/50 rounded-lg p-4 mb-4">
                  <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Try Estimation:</p>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 flex-wrap">
                      <input
                        type="text"
                        value={estimationNum1}
                        onChange={(e) => setEstimationNum1(e.target.value)}
                        className="w-24 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                        placeholder="Number 1"
                      />
                      <select
                        value={estimationOperation}
                        onChange={(e) => setEstimationOperation(e.target.value as typeof estimationOperation)}
                        className="px-3 py-2 bg-gray-700 text-white rounded-lg"
                      >
                        <option value="multiply">×</option>
                        <option value="divide">÷</option>
                        <option value="add">+</option>
                        <option value="subtract">-</option>
                      </select>
                      <input
                        type="text"
                        value={estimationNum2}
                        onChange={(e) => setEstimationNum2(e.target.value)}
                        className="w-24 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                        placeholder="Number 2"
                      />
                    </div>
                    {estimationResult !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-cyan-600/30 rounded-lg border border-cyan-500"
                      >
                        <p className="text-cyan-200 text-sm sm:text-base text-center">
                          Estimate: <strong>{estimationNum1}</strong> {estimationOperation === 'multiply' ? '×' : estimationOperation === 'divide' ? '÷' : estimationOperation === 'add' ? '+' : '-'} <strong>{estimationNum2}</strong> ≈ <strong className="text-white">{estimationResult.toLocaleString()}</strong>
                        </p>
                        <p className="text-cyan-300 text-xs mt-1 text-center">(Rounded to 1 significant figure first)</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Quick facts */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-blue-900/50 rounded-lg p-2 sm:p-3 text-center border border-blue-700">
            <ArrowUp className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-0.5 sm:mb-1" />
            <p className="text-blue-300 text-[10px] sm:text-sm">5 or More</p>
            <p className="text-white font-mono text-xs sm:text-base">Round Up</p>
          </div>
          <div className="bg-green-900/50 rounded-lg p-2 sm:p-3 text-center border border-green-700">
            <Ruler className="w-4 h-4 sm:w-6 sm:h-6 text-green-400 mx-auto mb-0.5 sm:mb-1" />
            <p className="text-green-300 text-[10px] sm:text-sm">d.p.</p>
            <p className="text-white font-mono text-xs sm:text-base">After Point</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-2 sm:p-3 text-center border border-purple-700">
            <Sigma className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-0.5 sm:mb-1" />
            <p className="text-purple-300 text-[10px] sm:text-sm">Standard Form</p>
            <p className="text-white font-mono text-xs sm:text-base">A × 10ⁿ</p>
          </div>
        </div>

        {/* Fixed Navigation - Compact mobile design */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/98 backdrop-blur-md px-2 sm:px-6 py-1.5 sm:py-4 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] sm:pb-4 border-t border-gray-700/50 z-[9999] shadow-2xl">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-0">
            {/* Stage indicators */}
            <div className="flex gap-1 sm:gap-2 overflow-x-auto flex-1 min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {stages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleStageChange(i)}
                  className={`flex-shrink-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                    i === stage ? 'bg-purple-400 ring-1 ring-purple-300' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to stage ${i + 1}`}
                />
              ))}
            </div>
            
            {/* Navigation buttons */}
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
                  className="px-2 py-1.5 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-500 active:bg-purple-400 rounded-lg text-white text-xs sm:text-base font-medium flex items-center justify-center shadow-lg shadow-purple-500/30"
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
                  className="px-2 py-1.5 sm:px-6 sm:py-2 bg-purple-600 hover:bg-purple-500 active:bg-purple-400 rounded-lg text-white text-xs sm:text-base font-medium flex items-center justify-center shadow-lg shadow-purple-500/30"
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

export default ApproximationEstimationIntro;
