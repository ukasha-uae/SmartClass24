'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Building, Wallet, Coins, ArrowRight, CheckCircle, XCircle, Sparkles, AlertTriangle, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, User, Building2, Briefcase, Home, FileText, Scale, TrendingUp, BarChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '@/hooks/useLocalization';

interface LessonIntroProps {
  onComplete?: () => void;
}

const BusinessEntityIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [selectedExample, setSelectedExample] = useState<number | null>(null);
  const { country, localizeContent } = useLocalization();
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());
  
  // Interactive states
  const [mysteryAnswer, setMysteryAnswer] = useState<'yes' | 'no' | null>(null);
  const [revealedPoints, setRevealedPoints] = useState<Set<number>>(new Set());
  const [categorizedItems, setCategorizedItems] = useState<Record<number, 'business' | 'personal' | null>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  
  const countryName = country?.name || 'Ghana';
  const currencySymbol = country?.currency?.symbol || '₵';
  const taxAuthority = localizeContent('{{business:tax-authority}}') || 'GRA';
  const companiesAct = localizeContent('{{business:companies-act}}') || 'Companies Act';

  const stages = [
    {
      title: "🏪 The Market Shop Mystery",
      icon: Building,
      content: `Picture a busy provision shop in your neighborhood...`,
      narration: `Welcome to one of the MOST fundamental concepts in accounting - the Business Entity Concept! Let me tell you a story that happens EVERY day in ${countryName}. Grace runs a successful provision shop. One morning, she takes five hundred from her cash register to pay her daughter's school fees. Now here's the BIG question - should she record this as a business expense? Should it go into the shop's accounts? Most people would say YES because the money came from the shop, right? But WAIT - here's where accounting gets interesting! The answer is actually NO! This is a PERSONAL expense, not a business expense! But WHY? Because in accounting, we treat the business and its owner as TWO COMPLETELY SEPARATE entities! This is called the Business Entity Concept, and today, you're going to master it completely! By the end of this intro, you'll understand EXACTLY why we keep business and personal finances separate, and why it matters so much in ${countryName}'s business world!`,
      highlight: `Should Grace record the ${currencySymbol}500 school fees as a business expense?`,
      highlightWords: ['Business Entity Concept', 'separate', 'business', 'personal', 'expense'],
      color: "from-blue-500 to-indigo-600",
      interactive: 'mystery-question'
    },
    {
      title: "🔑 The Separation Principle",
      icon: Sparkles,
      content: `The business and its owner are SEPARATE entities—even if one person!`,
      narration: `Let's understand this CRUCIAL concept! In accounting, we use something called the BUSINESS ENTITY CONCEPT. This principle says that a business is treated as a SEPARATE PERSON from its owner - yes, a separate person! Even if Grace owns and runs the shop alone, in our accounting books, we treat "Grace's Shop" and "Grace the Person" as TWO different entities! Think about it like this - the shop has its OWN money, its OWN bank account, its OWN debts, its OWN assets. When Grace puts money into the shop, that's called CAPITAL - it's like she's lending money to a separate entity. When she takes money out, that's called DRAWINGS - she's taking money from that separate entity. This separation is NOT just an accounting trick - it's required by ${companiesAct} in ${countryName}! ${taxAuthority} expects you to keep separate records. Banks want to see BUSINESS finances when you apply for loans, NOT your personal shopping expenses! This concept applies whether you're running a small kiosk or managing a company listed on the stock exchange!`,
      highlight: `In accounting: Business = Separate "Person" from Owner`,
      highlightWords: ['SEPARATE', 'Business Entity Concept', 'Capital', 'Drawings', companiesAct, taxAuthority],
      keyPoints: [
        "Business treated as separate 'legal person'",
        "Owner's personal affairs ≠ Business affairs",
        "Only BUSINESS transactions recorded in books",
        "Owner's investment = Capital (business owes owner)",
        "Owner taking money out = Drawings (reduces owner's equity)"
      ],
      color: "from-green-500 to-emerald-600",
      interactive: 'reveal-points'
    },
    {
      title: "✅ Business vs ❌ Personal",
      icon: Wallet,
      content: "Let's practice identifying which transactions belong where!",
      narration: `Now let's get PRACTICAL! Understanding which transactions are BUSINESS and which are PERSONAL is absolutely critical for good accounting in ${countryName}! Let me give you some real-life examples you'll encounter. BUSINESS transactions: Buying goods to sell in your shop - YES, that's business! Paying rent for your shop space - YES, business expense! Paying your shop assistant's salary - YES, business! Buying fuel for your delivery van - YES, business! But here's where people make mistakes! PERSONAL transactions: Paying your children's school fees with shop money - NO, that's personal! It's DRAWINGS! Buying groceries for your family - NO, personal! Even if you use shop money, it's DRAWINGS! Paying your personal electricity bill at home - NO, personal! Taking money for medical treatment - NO, personal DRAWINGS! Here's the KEY principle: Ask yourself - does this transaction help the BUSINESS earn money? If YES, it's business. If NO, it's personal! When you mix these up, you can't tell if your business is REALLY profitable!`,
      highlightWords: ['BUSINESS', 'PERSONAL', 'DRAWINGS', 'expense', 'profit'],
      examples: [
        { business: true, text: "Buying inventory for the shop", icon: CheckCircle, color: "text-green-400", category: "Business Expense" },
        { business: false, text: "Paying children's school fees", icon: XCircle, color: "text-red-400", category: "Personal (Drawings)" },
        { business: true, text: "Paying shop rent", icon: CheckCircle, color: "text-green-400", category: "Business Expense" },
        { business: false, text: "Buying personal groceries", icon: XCircle, color: "text-red-400", category: "Personal (Drawings)" },
        { business: true, text: "Buying delivery van for business", icon: CheckCircle, color: "text-green-400", category: "Business Asset" },
        { business: false, text: "Owner's medical treatment", icon: XCircle, color: "text-red-400", category: "Personal (Drawings)" }
      ],
      color: "from-purple-500 to-pink-600",
      interactive: 'categorize'
    },
    {
      title: "💰 Capital & Drawings Explained",
      icon: Coins,
      content: "The two key terms connecting owner and business.",
      narration: `Let's dive DEEP into two super important terms you'll use throughout your accounting career - CAPITAL and DRAWINGS! First, CAPITAL. When Grace starts her shop and puts in ten thousand from her personal savings, that money becomes CAPITAL. It's recorded as "The business OWES the owner ten thousand." Yes, the business owes her! Because remember - they're separate entities! Capital can be money OR goods. If she brings a fridge from home to use in the shop, that's also capital! Capital INCREASES the owner's equity in the business. Now, DRAWINGS. Let's say after one month, Grace takes two thousand from the shop for personal use. That's DRAWINGS! It's NOT a business expense because it didn't help the business earn money - it's personal! Drawings REDUCE the owner's equity. Here's a formula you MUST remember: Capital plus Profit minus Drawings equals Owner's Equity at year-end. If she started with ten thousand capital, made five thousand profit, but took two thousand drawings, her equity is now thirteen thousand! Understanding this helps you know the TRUE value of an owner's stake in their business!`,
      highlightWords: ['CAPITAL', 'DRAWINGS', 'equity', 'profit', 'owner'],
      concepts: [
        { 
          term: "💵 Capital", 
          meaning: "Money or assets owner invests INTO the business", 
          example: `Owner starts with ${currencySymbol}10,000`,
          effect: "Increases Owner's Equity",
          icon: TrendingUp
        },
        { 
          term: "💸 Drawings", 
          meaning: "Money or assets owner takes OUT for personal use", 
          example: `Owner takes ${currencySymbol}2,000 for personal needs`,
          effect: "Decreases Owner's Equity",
          icon: User
        }
      ],
      formula: {
        title: "Owner's Equity Formula",
        equation: "Opening Capital + Net Profit - Drawings = Closing Equity"
      },
      color: "from-orange-500 to-red-600"
    },
    {
      title: "🎯 Why Separation Matters",
      icon: AlertTriangle,
      content: `The serious consequences of mixing business and personal finances!`,
      narration: `Now let me tell you WHY this concept is SO important in ${countryName}'s business environment! First, ${taxAuthority} REQUIRES accurate business-only records! When you file your tax return, they want to see BUSINESS income and BUSINESS expenses - not your personal shopping! If you mix them, you might pay too much tax OR get audited for under-declaring income! Second, BANKS need clear business records! When you apply for a business loan, the bank analyzes your BUSINESS assets and income - not your family's personal finances! If your records are mixed up, they'll reject your loan application! Third, you CAN'T measure true performance! If you treat personal expenses as business costs, your business might show a loss when it's actually profitable! You'll make wrong decisions based on wrong information! Fourth, LEGAL compliance! The ${companiesAct} requires separate business records. If you're sued or audited, mixed records can cause serious legal problems! Fifth, it's about PROFESSIONALISM! Serious businesses in ${countryName} keep proper records. If you want to grow from a small shop to a registered company, start with good habits NOW! Remember - whether you're running a provision shop or a construction company, the Business Entity Concept applies EQUALLY to everyone!`,
      highlightWords: [taxAuthority, 'tax', 'banks', 'loan', 'performance', companiesAct, 'legal', 'professional'],
      reasons: [
        { 
          title: `${taxAuthority} Tax Compliance`, 
          detail: "Accurate business-only records for proper tax assessment",
          icon: FileText,
          color: "text-blue-400"
        },
        { 
          title: "Bank Loan Applications", 
          detail: "Banks assess BUSINESS assets and income separately",
          icon: Building2,
          color: "text-green-400"
        },
        { 
          title: "True Performance Measurement", 
          detail: "Can't tell if business is profitable with mixed records",
          icon: BarChart,
          color: "text-purple-400"
        },
        { 
          title: `Legal Compliance (${companiesAct})`, 
          detail: "Law requires separation of business and personal finances",
          icon: Scale,
          color: "text-orange-400"
        },
        { 
          title: "Professional Business Growth", 
          detail: "Foundation for scaling from shop to registered company",
          icon: Briefcase,
          color: "text-teal-400"
        }
      ],
      quizQuestions: [
        { question: "Owner's school fees taken from shop cash is DRAWINGS, not business expense", correct: true },
        { question: "Business and owner should mix their bank accounts for convenience", correct: false },
        { question: "Capital increases owner's equity in the business", correct: true },
        { question: "All money taken from business should be recorded as business expenses", correct: false }
      ],
      color: "from-teal-500 to-cyan-600",
      interactive: 'quiz'
    }
  ];

  const currentStage = stages[stage];
  const isLastStage = stage === stages.length - 1;

  // Audio control functions
  const togglePlayPause = useCallback(() => {
    if (!window.speechSynthesis) return;
    
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      speakNarration();
    }
  }, [isSpeaking, isPaused]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    if (!isMuted && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isMuted, isSpeaking]);

  // Speak the current stage narration
  const speakNarration = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis || isMuted) return;
    
    window.speechSynthesis.cancel();
    
    const narration = currentStage.narration;
    if (!narration) return;
    
    const utterance = new SpeechSynthesisUtterance(narration);
    
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Google'))
    ) || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [stage, isMuted, currentStage]);

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

  const handleNext = () => {
    if (isLastStage && onComplete) {
      onComplete();
    } else {
      setStage(prev => Math.min(prev + 1, stages.length - 1));
      setSelectedExample(null);
      // Reset interactive states when moving to new stage
      setMysteryAnswer(null);
      setRevealedPoints(new Set());
      setCategorizedItems({});
      setQuizAnswers({});
      setShowQuizResults(false);
    }
  };

  const handlePrevious = () => {
    setStage(prev => Math.max(prev - 1, 0));
    setSelectedExample(null);
    // Reset interactive states when moving back
    setMysteryAnswer(null);
    setRevealedPoints(new Set());
    setCategorizedItems({});
    setQuizAnswers({});
    setShowQuizResults(false);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Audio Controls */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1.5 sm:gap-2 z-10">
        <button
          onClick={togglePlayPause}
          className="p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur transition"
          title={isSpeaking && !isPaused ? "Pause narration" : "Play narration"}
        >
          {isSpeaking && !isPaused ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        <button
          onClick={toggleMute}
          className="p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur transition"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
      </div>

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      {/* Main content */}
      <div className="relative max-w-4xl w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full my-auto"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-12 border border-white/10 shadow-2xl">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br ${currentStage.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg`}
              >
                <currentStage.icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-4 sm:mb-6 px-2"
              >
                {currentStage.title}
              </motion.h1>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-6 sm:mb-8 space-y-3 sm:space-y-4"
              >
                <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed px-2">
                  {currentStage.content}
                </p>
                
                {/* Teacher speaking indicator */}
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-500/20 rounded-full text-xs sm:text-sm text-yellow-100"
                  >
                    🎤 Teacher is speaking...
                  </motion.div>
                )}

              {currentStage.highlight && (
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-3 sm:p-4"
                >
                  <p className="text-sm sm:text-base md:text-lg text-yellow-100 font-medium">
                    {currentStage.highlight}
                  </p>
                </motion.div>
              )}

              {/* Interactive: Mystery Question (Stage 0) */}
              {currentStage.interactive === 'mystery-question' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 sm:mt-8"
                >
                  <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                    👆 Click your answer below:
                  </p>
                  <div className="flex gap-3 sm:gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMysteryAnswer('yes')}
                      className={`flex-1 max-w-[200px] py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg transition-all ${
                        mysteryAnswer === 'yes'
                          ? 'bg-red-500/80 border-2 border-red-300 text-white'
                          : 'bg-white/10 hover:bg-white/20 text-gray-200 border-2 border-transparent'
                      }`}
                    >
                      ✅ YES
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMysteryAnswer('no')}
                      className={`flex-1 max-w-[200px] py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg transition-all ${
                        mysteryAnswer === 'no'
                          ? 'bg-green-500/80 border-2 border-green-300 text-white'
                          : 'bg-white/10 hover:bg-white/20 text-gray-200 border-2 border-transparent'
                      }`}
                    >
                      ❌ NO
                    </motion.button>
                  </div>
                  
                  {mysteryAnswer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-4 p-4 sm:p-6 rounded-xl ${
                        mysteryAnswer === 'no'
                          ? 'bg-green-500/20 border border-green-500/40'
                          : 'bg-red-500/20 border border-red-500/40'
                      }`}
                    >
                      {mysteryAnswer === 'no' ? (
                        <div className="text-center">
                          <p className="text-lg sm:text-xl font-bold text-green-300 mb-2">🎉 Correct!</p>
                          <p className="text-sm sm:text-base text-gray-200">
                            The ${currencySymbol}500 school fees is a <strong>PERSONAL expense</strong>, not business! 
                            It's recorded as <strong>DRAWINGS</strong>. Keep exploring to learn why!
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-lg sm:text-xl font-bold text-red-300 mb-2">🤔 Not quite!</p>
                          <p className="text-sm sm:text-base text-gray-200">
                            Many people think this way! But in accounting, personal expenses are <strong>NOT</strong> business expenses.
                            Continue learning to discover the Business Entity Concept!
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Interactive: Reveal Points (Stage 1) */}
              {currentStage.interactive === 'reveal-points' && currentStage.keyPoints && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 sm:mt-8"
                >
                  <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                    👆 Click each point to reveal why it matters:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {currentStage.keyPoints.map((point, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        onClick={() => {
                          const newRevealed = new Set(revealedPoints);
                          if (newRevealed.has(index)) {
                            newRevealed.delete(index);
                          } else {
                            newRevealed.add(index);
                          }
                          setRevealedPoints(newRevealed);
                        }}
                        className={`flex items-start gap-2 rounded-lg p-2 sm:p-3 text-left transition-all ${
                          revealedPoints.has(index)
                            ? 'bg-green-500/20 border-2 border-green-500/40'
                            : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                        }`}
                      >
                        <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 transition-colors ${
                          revealedPoints.has(index) ? 'text-green-400' : 'text-gray-400'
                        }`} />
                        <div className="flex-1">
                          <span className="text-gray-200 text-xs sm:text-sm block">{point}</span>
                          {revealedPoints.has(index) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="text-xs text-green-300 mt-2 font-medium"
                            >
                              {index === 0 && "✓ Like a person with their own identity, rights, and obligations"}
                              {index === 1 && "✓ Owner can't mix home expenses with business records"}
                              {index === 2 && "✓ Keep it clean - only transactions that affect the business!"}
                              {index === 3 && "✓ Capital increases owner's equity - business owes the owner"}
                              {index === 4 && "✓ Drawings decrease equity - owner taking back their money"}
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Interactive: Categorize (Stage 2) */}
              {currentStage.interactive === 'categorize' && currentStage.examples && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 sm:mt-8"
                >
                  <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                    👆 Test yourself! Click each transaction to categorize it:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {currentStage.examples.map((example, index) => {
                      const userAnswer = categorizedItems[index];
                      const isCorrect = userAnswer === (example.business ? 'business' : 'personal');
                      const isAnswered = userAnswer !== null && userAnswer !== undefined;
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className={`rounded-lg p-3 sm:p-4 border-2 transition-all ${
                            isAnswered
                              ? isCorrect
                                ? 'bg-green-500/20 border-green-500/40'
                                : 'bg-red-500/20 border-red-500/40'
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-3">
                            {isAnswered && (
                              isCorrect
                                ? <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                : <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            )}
                            <span className="text-gray-200 text-xs sm:text-sm flex-1">{example.text}</span>
                          </div>
                          
                          {!isAnswered ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => setCategorizedItems(prev => ({ ...prev, [index]: 'business' }))}
                                className="flex-1 py-2 px-3 bg-blue-500/30 hover:bg-blue-500/50 rounded-lg text-xs sm:text-sm font-medium text-white transition"
                              >
                                Business
                              </button>
                              <button
                                onClick={() => setCategorizedItems(prev => ({ ...prev, [index]: 'personal' }))}
                                className="flex-1 py-2 px-3 bg-purple-500/30 hover:bg-purple-500/50 rounded-lg text-xs sm:text-sm font-medium text-white transition"
                              >
                                Personal
                              </button>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-300">
                              <strong className={isCorrect ? 'text-green-300' : 'text-red-300'}>
                                {isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}
                              </strong>
                              {example.category}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {Object.keys(categorizedItems).length === currentStage.examples.length && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl text-center"
                    >
                      <p className="text-base sm:text-lg font-bold text-green-300">
                        🎉 Great job practicing! You're getting the hang of this!
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {currentStage.concepts && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3 mt-4 sm:mt-6"
                >
                  {currentStage.concepts.map((concept, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="bg-white/5 rounded-lg p-3 sm:p-4 text-left border border-white/10"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {concept.icon && <concept.icon className="w-5 h-5 text-white" />}
                        <div className="font-bold text-white text-sm sm:text-base">{concept.term}</div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-300 mb-2">{concept.meaning}</div>
                      <div className="text-xs text-gray-400 italic">Example: {concept.example}</div>
                      {concept.effect && (
                        <div className="text-xs text-yellow-300 mt-1 font-medium">➜ {concept.effect}</div>
                      )}
                    </motion.div>
                  ))}
                  
                  {currentStage.formula && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 }}
                      className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-3 sm:p-4 mt-4"
                    >
                      <div className="text-center">
                        <div className="text-xs sm:text-sm text-blue-200 mb-2 font-semibold">{currentStage.formula.title}</div>
                        <div className="text-sm sm:text-base md:text-lg text-white font-mono">{currentStage.formula.equation}</div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {currentStage.reasons && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6"
                >
                  {currentStage.reasons.map((reason, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-start gap-2 bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10"
                    >
                      {reason.icon && <reason.icon className={`w-5 h-5 ${reason.color} flex-shrink-0 mt-0.5`} />}
                      <div className="flex-1">
                        <div className="text-white font-semibold text-xs sm:text-sm mb-1">{reason.title}</div>
                        <div className="text-gray-300 text-xs">{reason.detail}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Interactive: Quick Quiz (Stage 4) */}
              {currentStage.interactive === 'quiz' && currentStage.quizQuestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="mt-6 sm:mt-8"
                >
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 sm:p-6 mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-yellow-200 mb-2 text-center">
                      ⚡ Quick Knowledge Check
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 text-center">
                      Mark each statement as True ✅ or False ❌
                    </p>
                  </div>

                  <div className="space-y-3">
                    {currentStage.quizQuestions.map((q, index) => {
                      const userAnswer = quizAnswers[index];
                      const isAnswered = userAnswer !== undefined;
                      const isCorrect = isAnswered && userAnswer === q.correct;
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.3 + index * 0.1 }}
                          className={`rounded-lg p-3 sm:p-4 border-2 transition-all ${
                            showQuizResults
                              ? isCorrect
                                ? 'bg-green-500/20 border-green-500/40'
                                : 'bg-red-500/20 border-red-500/40'
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          <p className="text-gray-200 text-xs sm:text-sm mb-3">
                            <strong>Q{index + 1}:</strong> {q.question}
                          </p>
                          
                          {!showQuizResults ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => setQuizAnswers(prev => ({ ...prev, [index]: true }))}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition ${
                                  userAnswer === true
                                    ? 'bg-green-500/50 text-white ring-2 ring-green-400'
                                    : 'bg-white/10 hover:bg-white/20 text-gray-200'
                                }`}
                              >
                                ✅ TRUE
                              </button>
                              <button
                                onClick={() => setQuizAnswers(prev => ({ ...prev, [index]: false }))}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition ${
                                  userAnswer === false
                                    ? 'bg-red-500/50 text-white ring-2 ring-red-400'
                                    : 'bg-white/10 hover:bg-white/20 text-gray-200'
                                }`}
                              >
                                ❌ FALSE
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-400" />
                              )}
                              <span className={`text-xs sm:text-sm font-medium ${
                                isCorrect ? 'text-green-300' : 'text-red-300'
                              }`}>
                                {isCorrect ? 'Correct!' : `Incorrect. Answer is ${q.correct ? 'TRUE' : 'FALSE'}`}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {!showQuizResults && Object.keys(quizAnswers).length === currentStage.quizQuestions.length && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowQuizResults(true)}
                      className="w-full mt-4 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg"
                    >
                      Check My Answers 🎯
                    </motion.button>
                  )}

                  {showQuizResults && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-4 sm:p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl text-center"
                    >
                      {(() => {
                        const correctCount = currentStage.quizQuestions.filter((q, i) => quizAnswers[i] === q.correct).length;
                        const total = currentStage.quizQuestions.length;
                        const percentage = (correctCount / total) * 100;
                        
                        return (
                          <>
                            <p className="text-2xl sm:text-3xl font-bold text-white mb-2">
                              {correctCount}/{total} Correct
                            </p>
                            <p className="text-base sm:text-lg text-gray-200">
                              {percentage === 100 ? '🎉 Perfect! You mastered the Business Entity Concept!' :
                               percentage >= 75 ? '👍 Great job! You understand the core principles!' :
                               percentage >= 50 ? '👌 Good start! Review the material to strengthen your understanding.' :
                               '💪 Keep learning! Review the stages again to master this concept.'}
                            </p>
                          </>
                        );
                      })()}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Progress indicator */}
            <div className="flex justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
              {stages.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1.5 sm:h-2 rounded-full transition-all ${
                    index === stage
                      ? 'w-6 sm:w-8 bg-gradient-to-r ' + currentStage.color
                      : index < stage
                      ? 'w-1.5 sm:w-2 bg-green-500'
                      : 'w-1.5 sm:w-2 bg-white/20'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={stage === 0}
                className={`p-2 sm:px-4 sm:py-3 rounded-xl font-semibold transition-all flex items-center gap-1 sm:gap-2 ${
                  stage === 0
                    ? 'opacity-0 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <button
                onClick={handleNext}
                className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
                  isLastStage
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                    : 'bg-gradient-to-r ' + currentStage.color + ' text-white shadow-lg'
                }`}
              >
                <span>{isLastStage ? 'Start Lesson' : 'Next'}</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
  );
};

export default BusinessEntityIntro;
