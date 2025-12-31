'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Grid3X3, Divide, Combine, Calculator, Trophy, Play, Pause, Volume2, VolumeX, GraduationCap, ChevronLeft, ChevronRight, Hash, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountryProperties } from '@/hooks/useCountryConfig';

interface LessonIntroProps {
  onComplete?: () => void;
}

const FactorsMultiplesIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const { currencySymbol } = useCountryProperties();
  const [stage, setStage] = useState(0);
  
  // Interactive state for demonstrations
  const [factorNumber, setFactorNumber] = useState<string>('12');
  const [factors, setFactors] = useState<number[]>([]);
  
  const [multipleNumber, setMultipleNumber] = useState<string>('3');
  const [multiples, setMultiples] = useState<number[]>([]);
  
  const [primeCheckNumber, setPrimeCheckNumber] = useState<string>('7');
  const [isPrime, setIsPrime] = useState<boolean | null>(null);
  
  const [primeFactorNumber, setPrimeFactorNumber] = useState<string>('60');
  const [primeFactors, setPrimeFactors] = useState<string>('');
  
  const [hcfNum1, setHcfNum1] = useState<string>('12');
  const [hcfNum2, setHcfNum2] = useState<string>('18');
  const [hcfResult, setHcfResult] = useState<number | null>(null);
  
  const [lcmNum1, setLcmNum1] = useState<string>('4');
  const [lcmNum2, setLcmNum2] = useState<string>('6');
  const [lcmResult, setLcmResult] = useState<number | null>(null);
  
  const [divisibilityNumber, setDivisibilityNumber] = useState<string>('123');
  const [divisibilityRules, setDivisibilityRules] = useState<Record<number, boolean>>({});
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  const stages = [
    {
      title: "🔢 Factors & Multiples - Building Blocks!",
      content: "Factors divide evenly, multiples are times tables! Master these to unlock arithmetic.",
      narration: `Welcome to factors and multiples! These are the building blocks of arithmetic. A factor is a number that divides another number exactly with no remainder. For example, factors of 12 are 1, 2, 3, 4, 6, and 12. A multiple is a number obtained by multiplying a number by an integer. Multiples of 3 are 3, 6, 9, 12, 15, and so on forever. Remember: factors are finite - they have an end. Multiples are infinite - they go on forever! Factors help us break down numbers, simplify fractions, and solve many mathematical problems. Understanding factors and multiples is essential for finding HCF, LCM, and working with fractions!`,
      highlightWords: ['factors', 'multiples', 'divides exactly', 'no remainder', 'finite', 'infinite', 'HCF', 'LCM']
    },
    {
      title: "🔐 Prime Numbers - Special Numbers!",
      content: "Prime numbers have exactly two factors: 1 and themselves!",
      narration: `Prime numbers are special numbers that have exactly two factors: 1 and themselves. Examples of prime numbers are 2, 3, 5, 7, 11, 13, 17, 19, and so on. Important note: 1 is NOT a prime number because it only has one factor - itself! Numbers with more than two factors are called composite numbers. For example, 4 has factors 1, 2, and 4 - that's three factors, so 4 is composite. 6 has factors 1, 2, 3, and 6 - that's four factors, so 6 is composite. Remember: 2 is the only even prime number! All other even numbers are composite because they're divisible by 2. Prime numbers are the building blocks of all other numbers through prime factorization!`,
      highlightWords: ['prime numbers', 'two factors', '1 and themselves', 'NOT prime', 'composite', 'more than two', 'only even prime']
    },
    {
      title: "🌳 Prime Factorization - Breaking Down Numbers!",
      content: "Every number can be written as a product of prime numbers!",
      narration: `Prime factorization breaks numbers into their prime building blocks! Every composite number can be written as a product of prime numbers, and this is unique for every number. Use factor trees or repeated division. For example, 60 equals 2 times 30, then 2 times 2 times 15, then 2 times 2 times 3 times 5. Write this as 2 squared times 3 times 5, or 2 to the power 2 times 3 times 5. Another method is repeated division: divide 60 by 2 to get 30, divide 30 by 2 to get 15, divide 15 by 3 to get 5, divide 5 by 5 to get 1. The prime factors are 2, 2, 3, and 5. Prime factorization is essential for finding HCF and LCM efficiently!`,
      highlightWords: ['prime factorization', 'product of primes', 'factor trees', 'repeated division', 'unique', 'HCF', 'LCM']
    },
    {
      title: "📊 HCF - Highest Common Factor!",
      content: "HCF is the largest number that divides two or more numbers exactly!",
      narration: `HCF stands for Highest Common Factor, also called Greatest Common Divisor or GCD. It's the largest number that divides two or more numbers exactly. To find HCF, you can list all factors and find the common ones, then pick the highest. For example, factors of 12 are 1, 2, 3, 4, 6, 12. Factors of 18 are 1, 2, 3, 6, 9, 18. Common factors are 1, 2, 3, and 6. The highest is 6, so HCF is 6. A better method for large numbers is using prime factorization: find common primes and take the lowest power of each. For example, HCF of 60 and 72: 60 is 2 squared times 3 times 5, 72 is 2 cubed times 3 squared. Common primes are 2 and 3. Lowest power of 2 is 2 squared, lowest power of 3 is 3 to the power 1. HCF equals 2 squared times 3, which is 4 times 3, equals 12!`,
      highlightWords: ['HCF', 'Highest Common Factor', 'largest number', 'divides exactly', 'common factors', 'prime factorization', 'lowest power']
    },
    {
      title: "📈 LCM - Least Common Multiple!",
      content: "LCM is the smallest number that is a multiple of two or more numbers!",
      narration: `LCM stands for Least Common Multiple. It's the smallest number that is a multiple of two or more numbers. To find LCM, you can list multiples and find the common ones, then pick the lowest. For example, multiples of 4 are 4, 8, 12, 16, 20. Multiples of 6 are 6, 12, 18, 24. Common multiples are 12, 24, and so on. The lowest is 12, so LCM is 12. A better method is using prime factorization: take all primes and use the highest power of each. For example, LCM of 60 and 72: 60 is 2 squared times 3 times 5, 72 is 2 cubed times 3 squared. All primes are 2, 3, and 5. Highest power of 2 is 2 cubed, highest power of 3 is 3 squared, highest power of 5 is 5 to the power 1. LCM equals 2 cubed times 3 squared times 5, which is 8 times 9 times 5, equals 360!`,
      highlightWords: ['LCM', 'Least Common Multiple', 'smallest number', 'multiple', 'common multiples', 'prime factorization', 'highest power']
    },
    {
      title: "✅ Divisibility Rules - Quick Checks!",
      content: "Learn these rules to quickly check if a number is divisible by 2, 3, 4, 5, 6, 8, 9, or 10!",
      narration: `Divisibility rules help you quickly check if a number is divisible by another without doing long division! Divisible by 2: last digit is even - 0, 2, 4, 6, or 8. Divisible by 3: sum of all digits is divisible by 3. For example, 123: 1 plus 2 plus 3 equals 6, and 6 is divisible by 3, so 123 is divisible by 3. Divisible by 4: last two digits form a number divisible by 4. Divisible by 5: last digit is 0 or 5. Divisible by 6: divisible by both 2 and 3. Divisible by 8: last three digits divisible by 8. Divisible by 9: sum of digits is divisible by 9. Divisible by 10: last digit is 0. These rules save time in calculations and help you work faster in WASSCE examinations!`,
      highlightWords: ['divisibility rules', 'quick check', 'last digit', 'sum of digits', 'divisible by 2', 'divisible by 3', 'WASSCE']
    },
    {
      title: "🌍 Real-World Applications!",
      content: "HCF and LCM solve real problems - tiling floors, scheduling events, and more!",
      narration: `HCF and LCM solve many real-world problems! HCF is used when you need the largest possible size. For example, tiling a floor with the largest possible square tiles without cutting, or dividing items into equal gift bags of the largest possible size. LCM is used when you need to find when events happen together. For example, if two bells ring every 12 minutes and 15 minutes, they'll ring together at the LCM of 12 and 15, which is 60 minutes. Traffic lights synchronizing, buses arriving at the same time, or events repeating together all use LCM. Understanding these applications helps you recognize when to use HCF or LCM in word problems, which is frequently tested in WASSCE examinations!`,
      highlightWords: ['real-world', 'HCF', 'LCM', 'largest possible', 'together', 'synchronizing', 'word problems', 'WASSCE']
    },
    {
      title: "🏆 WASSCE Success - Master the Methods!",
      content: "WASSCE tests HCF, LCM, and divisibility rules! Practice these techniques.",
      narration: `WASSCE examinations frequently test factors, multiples, HCF, and LCM! Here are key tips for success: For word problems, look for keywords - "largest", "maximum", "greatest", "divide equally" means HCF. Keywords like "smallest", "minimum", "next time together", "simultaneously" mean LCM. Always show your prime factorization method for full marks. Use divisibility rules to check your answers quickly. Remember the relationship: HCF times LCM equals the product of the two numbers - use this to verify your answers! Practice identifying prime numbers quickly. Master factor trees and repeated division methods. Show all your working clearly, and always check if your answer makes logical sense in the context of the problem!`,
      highlightWords: ['WASSCE', 'word problems', 'keywords', 'largest', 'smallest', 'together', 'prime factorization', 'divisibility rules', 'verify']
    }
  ];

  // Calculate factors
  useEffect(() => {
    if (factorNumber && !isNaN(parseInt(factorNumber))) {
      const num = parseInt(factorNumber);
      if (num > 0) {
        const factorList: number[] = [];
        for (let i = 1; i <= num; i++) {
          if (num % i === 0) {
            factorList.push(i);
          }
        }
        setFactors(factorList);
      } else {
        setFactors([]);
      }
    }
  }, [factorNumber]);

  // Calculate multiples
  useEffect(() => {
    if (multipleNumber && !isNaN(parseInt(multipleNumber))) {
      const num = parseInt(multipleNumber);
      if (num > 0) {
        const multipleList: number[] = [];
        for (let i = 1; i <= 10; i++) {
          multipleList.push(num * i);
        }
        setMultiples(multipleList);
      } else {
        setMultiples([]);
      }
    }
  }, [multipleNumber]);

  // Check if prime
  useEffect(() => {
    if (primeCheckNumber && !isNaN(parseInt(primeCheckNumber))) {
      const num = parseInt(primeCheckNumber);
      if (num <= 1) {
        setIsPrime(false);
      } else if (num === 2) {
        setIsPrime(true);
      } else {
        let isPrimeNum = true;
        for (let i = 2; i <= Math.sqrt(num); i++) {
          if (num % i === 0) {
            isPrimeNum = false;
            break;
          }
        }
        setIsPrime(isPrimeNum);
      }
    }
  }, [primeCheckNumber]);

  // Calculate prime factors
  useEffect(() => {
    if (primeFactorNumber && !isNaN(parseInt(primeFactorNumber))) {
      const num = parseInt(primeFactorNumber);
      if (num > 1) {
        const factors: number[] = [];
        let n = num;
        let divisor = 2;
        
        while (n > 1) {
          if (n % divisor === 0) {
            factors.push(divisor);
            n /= divisor;
          } else {
            divisor++;
          }
        }
        
        // Group and format
        const grouped: Record<number, number> = {};
        factors.forEach(f => {
          grouped[f] = (grouped[f] || 0) + 1;
        });
        
        const formatted = Object.entries(grouped)
          .map(([prime, power]) => power === 1 ? prime : `${prime}^${power}`)
          .join(' × ');
        
        setPrimeFactors(formatted);
      } else {
        setPrimeFactors('');
      }
    }
  }, [primeFactorNumber]);

  // Calculate HCF
  useEffect(() => {
    if (hcfNum1 && hcfNum2 && !isNaN(parseInt(hcfNum1)) && !isNaN(parseInt(hcfNum2))) {
      const a = parseInt(hcfNum1);
      const b = parseInt(hcfNum2);
      
      // Euclidean algorithm
      let x = Math.abs(a);
      let y = Math.abs(b);
      while (y !== 0) {
        const temp = y;
        y = x % y;
        x = temp;
      }
      setHcfResult(x);
    }
  }, [hcfNum1, hcfNum2]);

  // Calculate LCM
  useEffect(() => {
    if (lcmNum1 && lcmNum2 && !isNaN(parseInt(lcmNum1)) && !isNaN(parseInt(lcmNum2))) {
      const a = parseInt(lcmNum1);
      const b = parseInt(lcmNum2);
      
      // LCM = (a * b) / HCF
      let x = Math.abs(a);
      let y = Math.abs(b);
      const originalX = x;
      const originalY = y;
      while (y !== 0) {
        const temp = y;
        y = x % y;
        x = temp;
      }
      const hcf = x;
      const lcm = (originalX * originalY) / hcf;
      setLcmResult(lcm);
    }
  }, [lcmNum1, lcmNum2]);

  // Check divisibility rules
  useEffect(() => {
    if (divisibilityNumber && !isNaN(parseInt(divisibilityNumber))) {
      const num = parseInt(divisibilityNumber);
      const numStr = num.toString();
      const digits = numStr.split('').map(Number);
      const sum = digits.reduce((a, b) => a + b, 0);
      
      setDivisibilityRules({
        2: digits[digits.length - 1] % 2 === 0,
        3: sum % 3 === 0,
        4: parseInt(numStr.slice(-2)) % 4 === 0,
        5: digits[digits.length - 1] === 0 || digits[digits.length - 1] === 5,
        6: digits[digits.length - 1] % 2 === 0 && sum % 3 === 0,
        8: parseInt(numStr.slice(-3)) % 8 === 0,
        9: sum % 9 === 0,
        10: digits[digits.length - 1] === 0
      });
    }
  }, [divisibilityNumber]);

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
              ? 'bg-teal-400/40 text-white font-semibold px-0.5 rounded' 
              : isHighlightWord 
                ? 'text-teal-300 font-medium'
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
      <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-teal-900/30 via-gray-900 to-cyan-900/30 rounded-2xl p-4 sm:p-6 md:p-8 pb-20 sm:pb-28 overflow-hidden">
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['×', '÷', '=', '²', '³'].map((symbol, i) => {
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
                className={`absolute text-2xl text-teal-400/30 float-anim-${i}`}
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
            <Grid3X3 className="w-6 h-6 sm:w-10 sm:h-10 text-teal-400" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Factors, Multiples & Divisibility
            </h2>
            <Divide className="w-6 h-6 sm:w-10 sm:h-10 text-teal-300" />
          </div>
          <p className="text-teal-200 text-sm sm:text-lg">HCF, LCM, Prime Numbers & Divisibility Rules</p>
        </motion.div>

        {/* Teacher Avatar & Narration */}
        <motion.div 
          className="bg-gradient-to-r from-teal-900/40 to-cyan-900/40 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-teal-700/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-start gap-2 sm:gap-4">
            <div className="flex-shrink-0">
              <div 
                className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center transition-all ${
                  isSpeaking && !isPaused ? 'ring-2 sm:ring-4 ring-teal-400/50 animate-pulse' : ''
                }`}
              >
                <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
              </div>
              <p className="text-center text-[10px] sm:text-xs text-teal-300 mt-1 hidden sm:block">Teacher</p>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm leading-relaxed max-h-16 sm:max-h-24 overflow-y-auto pr-1 sm:pr-2">
                {renderNarrationText()}
              </div>
            </div>

            <div className="flex flex-col gap-1 sm:gap-2">
              {isSpeaking ? (
                <button onClick={togglePause} className="p-1.5 sm:p-2 bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors" title={isPaused ? "Resume" : "Pause"}>
                  {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                </button>
              ) : (
                <button onClick={replayNarration} className="p-1.5 sm:p-2 bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors" title="Play narration">
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
            <h3 className="text-lg sm:text-2xl font-bold text-teal-400 mb-2 sm:mb-3">{stages[stage].title}</h3>
            <p className="text-gray-200 text-sm sm:text-lg mb-3 sm:mb-4">{stages[stage].content}</p>

            {/* Stage 0: Factors Interactive */}
            {stage === 0 && (
              <div className="mt-3 sm:mt-4">
                <div className="bg-gradient-to-b from-blue-900/50 to-indigo-900/50 rounded-lg p-4 mb-4">
                  <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Find Factors:</p>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <span className="text-white font-bold">Factors of</span>
                      <input
                        type="number"
                        min="1"
                        value={factorNumber}
                        onChange={(e) => setFactorNumber(e.target.value)}
                        className="w-24 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                      />
                    </div>
                    {factors.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-blue-600/30 rounded-lg border border-blue-500"
                      >
                        <p className="text-blue-200 text-sm sm:text-base text-center mb-2">
                          Factors of <strong>{factorNumber}</strong>:
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {factors.map((factor, i) => (
                            <motion.span
                              key={factor}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold text-sm sm:text-base"
                            >
                              {factor}
                            </motion.span>
                          ))}
                        </div>
                        <p className="text-blue-300 text-xs mt-2 text-center">
                          Total: {factors.length} factors
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gradient-to-b from-green-900/50 to-emerald-900/50 rounded-lg p-4">
                  <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Find Multiples:</p>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <span className="text-white font-bold">Multiples of</span>
                      <input
                        type="number"
                        min="1"
                        value={multipleNumber}
                        onChange={(e) => setMultipleNumber(e.target.value)}
                        className="w-24 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                      />
                    </div>
                    {multiples.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-green-600/30 rounded-lg border border-green-500"
                      >
                        <p className="text-green-200 text-sm sm:text-base text-center mb-2">
                          First 10 multiples of <strong>{multipleNumber}</strong>:
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {multiples.map((multiple, i) => (
                            <motion.span
                              key={multiple}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg font-bold text-sm sm:text-base"
                            >
                              {multiple}
                            </motion.span>
                          ))}
                        </div>
                        <p className="text-green-300 text-xs mt-2 text-center">
                          Multiples go on forever...
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stage 1: Prime Check Interactive */}
            {stage === 1 && (
              <div className="mt-3 sm:mt-4">
                <div className="bg-gradient-to-b from-purple-900/50 to-pink-900/50 rounded-lg p-4 mb-4">
                  <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Check if Prime:</p>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={primeCheckNumber}
                        onChange={(e) => setPrimeCheckNumber(e.target.value)}
                        className="w-32 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                        placeholder="Enter number"
                      />
                    </div>
                    {isPrime !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-3 p-4 rounded-lg border ${
                          isPrime 
                            ? 'bg-green-600/30 border-green-500' 
                            : 'bg-red-600/30 border-red-500'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2 mb-2">
                          {isPrime ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-400" />
                          )}
                          <p className={`text-sm sm:text-base font-bold text-center ${
                            isPrime ? 'text-green-200' : 'text-red-200'
                          }`}>
                            <strong>{primeCheckNumber}</strong> is {isPrime ? 'PRIME' : 'NOT PRIME'}
                          </p>
                        </div>
                        {!isPrime && parseInt(primeCheckNumber) > 1 && (
                          <p className="text-red-300 text-xs text-center">
                            It has more than 2 factors (composite number)
                          </p>
                        )}
                        {parseInt(primeCheckNumber) === 1 && (
                          <p className="text-red-300 text-xs text-center">
                            1 is NOT prime - it only has 1 factor
                          </p>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stage 2: Prime Factorization Interactive */}
            {stage === 2 && (
              <div className="mt-3 sm:mt-4">
                <div className="bg-gradient-to-b from-orange-900/50 to-yellow-900/50 rounded-lg p-4 mb-4">
                  <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Prime Factorization:</p>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <input
                        type="number"
                        min="2"
                        value={primeFactorNumber}
                        onChange={(e) => setPrimeFactorNumber(e.target.value)}
                        className="w-32 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                        placeholder="Enter number"
                      />
                    </div>
                    {primeFactors && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-4 bg-orange-600/30 rounded-lg border border-orange-500"
                      >
                        <p className="text-orange-200 text-sm sm:text-base text-center font-mono">
                          <strong>{primeFactorNumber}</strong> = <strong className="text-white">{primeFactors}</strong>
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stage 3: HCF Interactive */}
            {stage === 3 && (
              <div className="mt-3 sm:mt-4">
                <div className="bg-gradient-to-b from-red-900/50 to-pink-900/50 rounded-lg p-4 mb-4">
                  <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Find HCF:</p>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <span className="text-white font-bold">HCF of</span>
                      <input
                        type="number"
                        min="1"
                        value={hcfNum1}
                        onChange={(e) => setHcfNum1(e.target.value)}
                        className="w-24 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                      />
                      <span className="text-white font-bold">and</span>
                      <input
                        type="number"
                        min="1"
                        value={hcfNum2}
                        onChange={(e) => setHcfNum2(e.target.value)}
                        className="w-24 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                      />
                    </div>
                    {hcfResult !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-4 bg-red-600/30 rounded-lg border border-red-500"
                      >
                        <p className="text-red-200 text-sm sm:text-base text-center">
                          HCF of <strong>{hcfNum1}</strong> and <strong>{hcfNum2}</strong> = <strong className="text-white text-lg">{hcfResult}</strong>
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stage 4: LCM Interactive */}
            {stage === 4 && (
              <div className="mt-3 sm:mt-4">
                <div className="bg-gradient-to-b from-cyan-900/50 to-blue-900/50 rounded-lg p-4 mb-4">
                  <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Find LCM:</p>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <span className="text-white font-bold">LCM of</span>
                      <input
                        type="number"
                        min="1"
                        value={lcmNum1}
                        onChange={(e) => setLcmNum1(e.target.value)}
                        className="w-24 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                      />
                      <span className="text-white font-bold">and</span>
                      <input
                        type="number"
                        min="1"
                        value={lcmNum2}
                        onChange={(e) => setLcmNum2(e.target.value)}
                        className="w-24 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                      />
                    </div>
                    {lcmResult !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-4 bg-cyan-600/30 rounded-lg border border-cyan-500"
                      >
                        <p className="text-cyan-200 text-sm sm:text-base text-center">
                          LCM of <strong>{lcmNum1}</strong> and <strong>{lcmNum2}</strong> = <strong className="text-white text-lg">{lcmResult}</strong>
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stage 5: Divisibility Rules Interactive */}
            {stage === 5 && (
              <div className="mt-3 sm:mt-4">
                <div className="bg-gradient-to-b from-indigo-900/50 to-purple-900/50 rounded-lg p-4 mb-4">
                  <p className="text-center text-gray-200 mb-3 text-sm sm:text-base">Check Divisibility:</p>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <input
                        type="number"
                        value={divisibilityNumber}
                        onChange={(e) => setDivisibilityNumber(e.target.value)}
                        className="w-32 px-3 py-2 bg-gray-700 text-white rounded-lg text-center font-bold"
                        placeholder="Enter number"
                      />
                    </div>
                    {Object.keys(divisibilityRules).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-4 bg-indigo-600/30 rounded-lg border border-indigo-500"
                      >
                        <p className="text-indigo-200 text-sm sm:text-base text-center mb-3">
                          Divisibility of <strong>{divisibilityNumber}</strong>:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[2, 3, 4, 5, 6, 8, 9, 10].map((divisor) => {
                            const isDivisible = divisibilityRules[divisor as keyof typeof divisibilityRules];
                            return (
                              <div
                                key={divisor}
                                className={`p-2 rounded-lg text-center ${
                                  isDivisible ? 'bg-green-600/50' : 'bg-gray-700/50'
                                }`}
                              >
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  {isDivisible ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-gray-400" />
                                  )}
                                  <span className={`text-xs sm:text-sm font-bold ${
                                    isDivisible ? 'text-green-300' : 'text-gray-400'
                                  }`}>
                                    {divisor}
                                  </span>
                                </div>
                                <p className={`text-[10px] ${
                                  isDivisible ? 'text-green-200' : 'text-gray-500'
                                }`}>
                                  {isDivisible ? 'Yes' : 'No'}
                                </p>
                              </div>
                            );
                          })}
                        </div>
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
            <Hash className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-0.5 sm:mb-1" />
            <p className="text-blue-300 text-[10px] sm:text-sm">Factors</p>
            <p className="text-white font-mono text-xs sm:text-base">Finite</p>
          </div>
          <div className="bg-green-900/50 rounded-lg p-2 sm:p-3 text-center border border-green-700">
            <Grid3X3 className="w-4 h-4 sm:w-6 sm:h-6 text-green-400 mx-auto mb-0.5 sm:mb-1" />
            <p className="text-green-300 text-[10px] sm:text-sm">Multiples</p>
            <p className="text-white font-mono text-xs sm:text-base">Infinite</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-2 sm:p-3 text-center border border-purple-700">
            <Divide className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-0.5 sm:mb-1" />
            <p className="text-purple-300 text-[10px] sm:text-sm">Prime</p>
            <p className="text-white font-mono text-xs sm:text-base">2 Factors</p>
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
                    i === stage ? 'bg-teal-400 ring-1 ring-teal-300' : 'bg-gray-600 hover:bg-gray-500'
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
                  className="px-2 py-1.5 sm:px-4 sm:py-2 bg-teal-600 hover:bg-teal-500 active:bg-teal-400 rounded-lg text-white text-xs sm:text-base font-medium flex items-center justify-center shadow-lg shadow-teal-500/30"
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
                  className="px-2 py-1.5 sm:px-6 sm:py-2 bg-teal-600 hover:bg-teal-500 active:bg-teal-400 rounded-lg text-white text-xs sm:text-base font-medium flex items-center justify-center shadow-lg shadow-teal-500/30"
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

export default FactorsMultiplesIntro;
