'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeftRight, Plus, Minus, X, Divide, Calculator, Trophy, Play, Pause, Volume2, VolumeX, GraduationCap, ChevronLeft, ChevronRight, Thermometer, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountryProperties } from '@/hooks/useCountryConfig';

interface LessonIntroProps {
  onComplete?: () => void;
}

const DirectedNumbersIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const { currencyName } = useCountryProperties();
  const [stage, setStage] = useState(0);
  
  // Interactive state for demonstrations
  const [selectedOperation, setSelectedOperation] = useState<'add' | 'subtract' | 'multiply' | 'divide' | null>(null);
  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [result, setResult] = useState<number | null>(null);
  const [numberLinePosition, setNumberLinePosition] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  const stages = [
    {
      title: "➡️⬅️ Directed Numbers - Positive & Negative!",
      content: "Numbers with direction! Temperature, money, elevation - all use directed numbers.",
      narration: `Welcome to directed numbers! These are numbers that have both size and direction - positive or negative. Think about temperature: when it's hot, we say 30 degrees, which is positive. But in a freezer, it might be negative 5 degrees! Think about money: if you have ${currencyName} in your account, that's positive. But if you owe money, that's negative! Think about elevation: a mountain is above sea level - positive. A submarine is below sea level - negative. Directed numbers are everywhere in real life, and mastering them is essential for algebra, science, and your WASSCE examinations!`,
      highlightWords: ['directed numbers', 'positive', 'negative', 'temperature', 'money', 'elevation', 'WASSCE']
    },
    {
      title: "📏 The Number Line - Visual Guide",
      content: "The number line shows positive numbers to the right and negative numbers to the left!",
      narration: `The number line is a powerful visual tool! Zero is in the middle - it's neither positive nor negative. Positive numbers go to the right: 1, 2, 3, 4, 5, and so on. Negative numbers go to the left: negative 1, negative 2, negative 3, negative 4, negative 5, and so on. As you move right, numbers get larger. As you move left, numbers get smaller. So negative 5 is smaller than negative 2, even though 5 looks bigger than 2! This is because negative 5 is further to the left on the number line. Understanding the number line helps you compare numbers, add, subtract, and visualize all operations with directed numbers!`,
      highlightWords: ['number line', 'zero', 'positive', 'negative', 'right', 'left', 'larger', 'smaller', 'compare']
    },
    {
      title: "➕ Addition Rules - Same or Different Signs?",
      content: "Adding directed numbers: same signs add, different signs subtract!",
      narration: `Adding directed numbers follows clear rules! When both numbers have the SAME sign - both positive or both negative - you ADD the numbers and KEEP the sign. For example, positive 5 plus positive 3 equals positive 8. Negative 5 plus negative 3 equals negative 8. When the numbers have DIFFERENT signs - one positive and one negative - you SUBTRACT the smaller number from the larger number, and take the SIGN of the larger number. For example, negative 7 plus positive 3: subtract 3 from 7 to get 4, and since negative 7 is larger, the answer is negative 4. Think of it like money: if you owe 7 ${currencyName} and someone gives you 3 ${currencyName}, you still owe 4 ${currencyName}!`,
      highlightWords: ['addition', 'same signs', 'different signs', 'add', 'subtract', 'keep the sign', 'larger number']
    },
    {
      title: "➖ Subtraction - Adding the Opposite!",
      content: "Subtracting means adding the opposite! Use KCF: Keep, Change, Flip!",
      narration: `Subtracting directed numbers is easy once you learn the trick! Subtracting is the same as adding the opposite. The rule is KCF: Keep the first number, Change the minus to plus, and Flip the sign of the second number. For example, positive 5 minus negative 3 becomes positive 5 plus positive 3, which equals 8! Another example: negative 4 minus positive 2 becomes negative 4 plus negative 2, which equals negative 6. Think of it this way: subtracting a negative is like removing a debt, which is the same as gaining money! So subtracting negative 3 is like adding positive 3. Master this rule and subtraction becomes as easy as addition!`,
      highlightWords: ['subtraction', 'adding the opposite', 'KCF', 'Keep', 'Change', 'Flip', 'minus', 'plus']
    },
    {
      title: "✖️➗ Multiplication & Division - Sign Rules!",
      content: "Same signs = positive, different signs = negative! Simple rule!",
      narration: `Multiplying and dividing directed numbers follows a simple sign rule! When the signs are the SAME - both positive or both negative - the answer is POSITIVE. Positive times positive equals positive. Negative times negative also equals positive! When the signs are DIFFERENT - one positive and one negative - the answer is NEGATIVE. Positive times negative equals negative. Negative times positive equals negative. The same rules apply to division! For example, negative 6 divided by negative 2 equals positive 3. Negative 8 divided by positive 4 equals negative 2. Remember: same signs positive, different signs negative! This rule works for all multiplication and division with directed numbers!`,
      highlightWords: ['multiplication', 'division', 'same signs', 'different signs', 'positive', 'negative', 'rule']
    },
    {
      title: "🌍 Real-World Applications",
      content: "Directed numbers are everywhere - temperature, money, elevation, and more!",
      narration: `Directed numbers appear everywhere in real life! In WEATHER, temperature can be positive 30 degrees Celsius on a hot day, or negative 5 degrees in a freezer. In BUSINESS, profit is positive - you gain money. Loss is negative - you lose money. In BANKING, a credit balance is positive, while debt or overdraft is negative. In GEOGRAPHY, elevation above sea level is positive, while depth below sea level is negative. In ELEVATORS, ground floor is zero, floors above are positive, and basement floors are negative. In SPORTS, points scored are positive, while penalties are negative. Understanding directed numbers helps you make sense of all these real-world situations and solve practical problems!`,
      highlightWords: ['real-world', 'temperature', 'business', 'banking', 'elevation', 'elevators', 'sports', 'practical']
    },
    {
      title: "🎯 WASSCE Success - Master the Rules!",
      content: "WASSCE loves testing directed numbers! Practice these key rules.",
      narration: `WASSCE examinations frequently test directed number operations! Here are key tips for success: Always watch your signs carefully in every step of your calculation. Use brackets to avoid confusion, especially with multiple operations. Remember the addition rule: same signs add and keep sign, different signs subtract and take larger sign. Remember the subtraction rule: KCF - Keep, Change, Flip. Remember the multiplication and division rule: same signs positive, different signs negative. When solving complex expressions, follow BODMAS order of operations. Always check your answer makes logical sense - if you're losing money, your balance should become more negative, not positive! Practice these rules until they become automatic, and you'll score easy marks in WASSCE!`,
      highlightWords: ['WASSCE', 'signs', 'brackets', 'addition', 'subtraction', 'KCF', 'multiplication', 'division', 'BODMAS', 'check']
    }
  ];

  // Auto-animate number line on stage 1
  useEffect(() => {
    if (stage === 1 && isAnimating) {
      let direction = 1;
      const interval = setInterval(() => {
        setNumberLinePosition(prev => {
          if (prev >= 5) direction = -1;
          if (prev <= -5) direction = 1;
          return prev + direction * 0.5;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [stage, isAnimating]);

  // Calculate result when numbers change
  useEffect(() => {
    if (selectedOperation && firstNumber !== null && secondNumber !== null) {
      let calculatedResult: number;
      switch (selectedOperation) {
        case 'add':
          calculatedResult = firstNumber + secondNumber;
          break;
        case 'subtract':
          calculatedResult = firstNumber - secondNumber;
          break;
        case 'multiply':
          calculatedResult = firstNumber * secondNumber;
          break;
        case 'divide':
          calculatedResult = secondNumber !== 0 ? firstNumber / secondNumber : 0;
          break;
        default:
          calculatedResult = 0;
      }
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [selectedOperation, firstNumber, secondNumber]);

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
    setSelectedOperation(null);
    setFirstNumber(0);
    setSecondNumber(0);
    setResult(null);
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

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    return num > 0 ? `+${num}` : `${num}`;
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
      <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-orange-900/30 via-gray-900 to-red-900/30 rounded-2xl p-4 sm:p-6 md:p-8 pb-20 sm:pb-28 overflow-hidden">
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['+', '-', '0', '±', '='].map((symbol, i) => {
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
                className={`absolute text-2xl text-orange-400/30 float-anim-${i}`}
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
            <ArrowLeftRight className="w-6 h-6 sm:w-10 sm:h-10 text-orange-400" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Directed Numbers
            </h2>
            <Calculator className="w-6 h-6 sm:w-10 sm:h-10 text-orange-300" />
          </div>
          <p className="text-orange-200 text-sm sm:text-lg">Positive, Negative & The Number Line</p>
        </motion.div>

        {/* Teacher Avatar & Narration */}
        <motion.div 
          className="bg-gradient-to-r from-orange-900/40 to-red-900/40 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-orange-700/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-start gap-2 sm:gap-4">
            <div className="flex-shrink-0">
              <div 
                className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center transition-all ${
                  isSpeaking && !isPaused ? 'ring-2 sm:ring-4 ring-orange-400/50 animate-pulse' : ''
                }`}
              >
                <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
              </div>
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

            {/* Stage 1: Number Line Visualization */}
            {stage === 1 && (
              <div className="mt-3 sm:mt-4">
                <div className="bg-gradient-to-b from-blue-900/50 to-indigo-900/50 rounded-lg p-4 mb-4">
                  <p className="text-center text-gray-200 mb-4 text-sm sm:text-base">Interactive Number Line:</p>
                  <div className="relative h-32 sm:h-40 bg-gray-800 rounded-lg overflow-hidden border-2 border-blue-700">
                    {/* Number line */}
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600"></div>
                    </div>
                    
                    {/* Numbers */}
                    {Array.from({ length: 21 }, (_, i) => i - 10).map((num) => {
                      const distance = Math.abs(num - numberLinePosition);
                      const isNear = distance <= 0.5;
                      const isAt = Math.abs(num - numberLinePosition) < 0.1;
                      
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
                              isAt ? 'bg-yellow-400' : isNear ? 'bg-blue-400' : num === 0 ? 'bg-white' : 'bg-gray-400'
                            }`}
                          />
                          <div 
                            className={`text-xs sm:text-sm mt-1 transform -translate-x-1/2 font-bold transition-colors ${
                              isAt ? 'text-yellow-300 scale-125' : isNear ? 'text-blue-300' : num === 0 ? 'text-white' : 'text-gray-300'
                            }`}
                            style={{ marginLeft: '50%' }}
                          >
                            {num}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Moving indicator */}
                    <div
                      className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all ${
                        isAnimating ? 'animate-bounce' : ''
                      }`}
                      style={{ left: `${((numberLinePosition + 10) / 20) * 100}%` }}
                    >
                      {isAnimating && (
                        <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-50 animate-ping" />
                      )}
                      <div className="relative w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full border-2 border-white shadow-lg">
                        {isAnimating && (
                          <div className="absolute inset-0 bg-blue-300 rounded-full opacity-75 animate-pulse" />
                        )}
                      </div>
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
                </div>
              </div>
            )}

            {/* Stage 2-4: Operation Demonstrations */}
            {(stage === 2 || stage === 3 || stage === 4) && (
              <div className="mt-3 sm:mt-4">
                <div className="bg-gradient-to-b from-green-900/50 to-blue-900/50 rounded-lg p-4 mb-4">
                  <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">
                    {stage === 2 && 'Try Addition:'}
                    {stage === 3 && 'Try Subtraction:'}
                    {stage === 4 && 'Try Multiplication/Division:'}
                  </p>
                  
                  {/* Operation buttons */}
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {stage === 2 && (
                      <button
                        onClick={() => {
                          setSelectedOperation('add');
                          setFirstNumber(5);
                          setSecondNumber(3);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedOperation === 'add' ? 'bg-green-600 ring-2 ring-green-400' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        Addition
                      </button>
                    )}
                    {stage === 3 && (
                      <button
                        onClick={() => {
                          setSelectedOperation('subtract');
                          setFirstNumber(5);
                          setSecondNumber(-3);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedOperation === 'subtract' ? 'bg-green-600 ring-2 ring-green-400' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        Subtraction
                      </button>
                    )}
                    {(stage === 4) && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedOperation('multiply');
                            setFirstNumber(-3);
                            setSecondNumber(-2);
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedOperation === 'multiply' ? 'bg-green-600 ring-2 ring-green-400' : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          Multiply
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOperation('divide');
                            setFirstNumber(-6);
                            setSecondNumber(-2);
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedOperation === 'divide' ? 'bg-green-600 ring-2 ring-green-400' : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          Divide
                        </button>
                      </>
                    )}
                  </div>

                  {/* Number inputs */}
                  {selectedOperation && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="number"
                          value={firstNumber}
                          onChange={(e) => setFirstNumber(parseInt(e.target.value) || 0)}
                          className="w-20 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                        />
                        <span className="text-2xl font-bold text-white">
                          {stage === 2 && '+'}
                          {stage === 3 && '-'}
                          {stage === 4 && (selectedOperation === 'multiply' ? '×' : '÷')}
                        </span>
                        <input
                          type="number"
                          value={secondNumber}
                          onChange={(e) => setSecondNumber(parseInt(e.target.value) || 0)}
                          className="w-20 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                        />
                        <span className="text-2xl font-bold text-white">=</span>
                        <div className="w-20 px-3 py-2 bg-green-600 text-white rounded-lg text-center font-bold">
                          {result !== null ? formatNumber(result) : '?'}
                        </div>
                      </div>
                      
                      {result !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 p-3 bg-green-600/30 rounded-lg border border-green-500"
                        >
                          <p className="text-green-200 text-sm sm:text-base text-center">
                            <strong>{formatNumber(firstNumber)}</strong> {stage === 2 && '+'} {stage === 3 && '-'} {stage === 4 && (selectedOperation === 'multiply' ? '×' : '÷')} <strong>{formatNumber(secondNumber)}</strong> = <strong className="text-white">{formatNumber(result)}</strong>
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stage 5: Real-world examples */}
            {stage === 5 && (
              <div className="mt-3 sm:mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Thermometer, title: 'Temperature', example: '+30°C (hot) or -5°C (freezer)', bgClass: 'from-red-900/50 to-red-800/50', borderClass: 'border-red-700', iconClass: 'text-red-400', textClass: 'text-red-300' },
                    { icon: TrendingUp, title: 'Business', example: `+${currencyName}500 (profit) or -${currencyName}200 (loss)`, bgClass: 'from-green-900/50 to-green-800/50', borderClass: 'border-green-700', iconClass: 'text-green-400', textClass: 'text-green-300' },
                    { icon: TrendingDown, title: 'Banking', example: `+${currencyName}1000 (credit) or -${currencyName}500 (debt)`, bgClass: 'from-blue-900/50 to-blue-800/50', borderClass: 'border-blue-700', iconClass: 'text-blue-400', textClass: 'text-blue-300' },
                    { icon: ArrowLeftRight, title: 'Elevation', example: '+885m (mountain) or -100m (submarine)', bgClass: 'from-purple-900/50 to-purple-800/50', borderClass: 'border-purple-700', iconClass: 'text-purple-400', textClass: 'text-purple-300' }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className={`bg-gradient-to-br ${item.bgClass} rounded-lg p-3 sm:p-4 border ${item.borderClass}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.iconClass}`} />
                        <div className={`${item.textClass} font-bold text-sm sm:text-base`}>{item.title}</div>
                      </div>
                      <div className="text-white text-xs sm:text-sm">{item.example}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Quick facts */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-green-900/50 rounded-lg p-2 sm:p-3 text-center border border-green-700">
            <Plus className="w-4 h-4 sm:w-6 sm:h-6 text-green-400 mx-auto mb-0.5 sm:mb-1" />
            <p className="text-green-300 text-[10px] sm:text-sm">Same Signs</p>
            <p className="text-white font-mono text-xs sm:text-base">Add & Keep</p>
          </div>
          <div className="bg-red-900/50 rounded-lg p-2 sm:p-3 text-center border border-red-700">
            <Minus className="w-4 h-4 sm:w-6 sm:h-6 text-red-400 mx-auto mb-0.5 sm:mb-1" />
            <p className="text-red-300 text-[10px] sm:text-sm">KCF Rule</p>
            <p className="text-white font-mono text-xs sm:text-base">Keep Change Flip</p>
          </div>
          <div className="bg-blue-900/50 rounded-lg p-2 sm:p-3 text-center border border-blue-700">
            <X className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-0.5 sm:mb-1" />
            <p className="text-blue-300 text-[10px] sm:text-sm">Sign Rules</p>
            <p className="text-white font-mono text-xs sm:text-base">Same +, Diff -</p>
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
                    i === stage ? 'bg-orange-400 ring-1 ring-orange-300' : 'bg-gray-600 hover:bg-gray-500'
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
    </>
  );
};

export default DirectedNumbersIntro;
