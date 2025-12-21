'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, Zap, Receipt, ChevronLeft, ChevronRight, CheckCircle, DollarSign, Clock, AlertCircle, Play, Pause, Volume2, VolumeX, XCircle, TrendingUp, Users, Package, ShoppingBag, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '@/hooks/useLocalization';

interface LessonIntroProps {
  onComplete?: () => void;
}

const AccrualConceptIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const { country, localizeContent } = useLocalization();
  
  // Interactive states
  const [scenarioChoice, setScenarioChoice] = useState<'accrual' | 'cash' | null>(null);
  const [revealedBases, setRevealedBases] = useState<Set<number>>(new Set());
  const [matchedExamples, setMatchedExamples] = useState<Record<number, string | null>>({});
  const [selectedAdjustments, setSelectedAdjustments] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  
  // Audio states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());
  
  const countryName = country?.name || 'Ghana';
  const currencySymbol = country?.currency?.symbol || '₵';
  const ifrsStandards = localizeContent('{{business:accounting-standards}}') || 'IFRS';
  const companiesAct = localizeContent('{{business:companies-act}}') || 'Companies Act';

  const stages = [
    {
      title: "⚡ The December Electricity Dilemma",
      icon: Zap,
      content: `A shop uses electricity all December, but the bill arrives in January. Should we ignore this expense in December?`,
      narration: `Welcome! Let me tell you about one of the most important concepts in accounting - the Accrual Concept. Picture this scenario: Your shop uses electricity throughout December. The lights are on, the fans are running, the computers are working. But here's the thing - the electricity bill only arrives in January! Now, should you record this expense in December when you used the electricity, or in January when you receive the bill? This is the key question the Accrual Concept answers. The answer is DECEMBER! Why? Because the Accrual Concept says we should record income when it is EARNED and expenses when they are INCURRED, not when cash changes hands. This means you record the electricity expense in December because that's when you actually used the electricity, even though you haven't paid for it yet. This is different from just recording when money moves in or out. The accrual concept gives us a TRUE picture of what happened in each period. So remember: it's about when the transaction happens, not when the cash moves!`,
      highlight: "Record income when EARNED and expenses when INCURRED—not when cash moves!",
      highlightWords: [currencySymbol, countryName, ifrsStandards, 'accrual', 'earned', 'incurred'],
      color: "from-blue-500 to-indigo-600",
      interactive: 'scenario-choice'
    },
    {
      title: "📅 Two Different Approaches",
      icon: Calendar,
      content: `There are two ways to record transactions—Accrual Basis and Cash Basis. But only one shows the TRUE financial picture!`,
      narration: `Now let me explain the two different approaches businesses can use to record their transactions. First is the ACCRUAL BASIS - this is what we just talked about. Under accrual basis, you record transactions when they happen, when the service is provided or received, when goods are sold or bought, regardless of when money changes hands. For example, if you sell goods in December but the customer pays in January, you record the sale in December under accrual basis. The second approach is CASH BASIS - this is simpler but less accurate. Under cash basis, you only record transactions when cash is paid or received. Using our example, that December sale would only be recorded in January when cash arrives. Now here's the important part: Accrual basis is MORE ACCURATE because it shows what truly happened in each period. It's required by ${ifrsStandards} standards for most businesses in ${countryName}. Cash basis is less accurate - it can distort your profit figures because it ignores transactions where cash hasn't moved yet. Cash basis is only suitable for very small businesses. So remember: Accrual basis gives the true picture, Cash basis only shows cash movements. Big difference!`,
      highlightWords: [ifrsStandards, countryName, 'accrual', 'cash', 'accurate'],
      color: "from-green-500 to-emerald-600",
      bases: [
        { 
          id: 0,
          icon: CheckCircle,
          title: "Accrual Basis",
          when: "When earned/incurred",
          detail: "Records transactions when they happen, giving a TRUE picture of business performance. Required by IFRS standards."
        },
        { 
          id: 1,
          icon: XCircle,
          title: "Cash Basis",
          when: "When cash paid/received",
          detail: "Only records when cash moves. Simpler but can distort profit figures. Only for very small businesses."
        }
      ],
      interactive: 'reveal-bases'
    },
    {
      title: "🔄 The Matching Principle",
      icon: Receipt,
      content: "The Matching Principle is the heart of accrual accounting—match expenses WITH the revenue they help generate!",
      narration: `Let me teach you about the Matching Principle - this is the HEART of accrual accounting. The matching principle says you should match expenses with the revenues they helped generate, in the SAME accounting period. Why does this matter? Because it gives you the TRUE profit or loss for that period. Imagine you pay three thousand cedis rent in January for January, February, and March. If you recorded all three thousand as January expense, your January profit would look terrible, and February and March would look amazing! But that's NOT the true picture! The matching principle says: spread that three thousand over the three months - one thousand in January, one thousand in February, one thousand in March. Now each month shows its fair share of the expense. Another example: You use electricity in December to sell goods in December. Even if the bill comes in January, you match that electricity expense with December's sales because that's when it helped generate revenue. This matching gives you ACCURATE profit figures for each period. Without matching, your financial statements would be misleading and useless for making decisions. Remember: match the expense with the revenue it helped create, in the same period!`,
      highlight: "This ensures each accounting period shows TRUE profit or loss, not distorted figures.",
      highlightWords: [currencySymbol, 'matching', 'revenue', 'expense', 'period'],
      color: "from-purple-500 to-pink-600",
      examples: [
        { id: 0, transaction: "December electricity helps December sales", match: "December" },
        { id: 1, transaction: "Three months rent paid in advance", match: "Spread over 3 months" },
        { id: 2, transaction: "Goods sold in December on credit", match: "December" },
        { id: 3, transaction: "December salary for December work", match: "December" }
      ],
      interactive: 'match-examples'
    },
    {
      title: "📊 Four Types of Adjustments",
      icon: DollarSign,
      content: "To apply the accrual concept correctly, accountants make four types of adjustments. Click each to learn!",
      narration: `Now I'll teach you the FOUR types of adjustments we make to apply the accrual concept correctly. These adjustments are how we actually implement accrual accounting in practice. First: ACCRUED EXPENSES - these are expenses you've incurred but haven't paid yet. Example: You used eight hundred cedis of electricity in December but the bill comes in January. You make an adjustment to record that eight hundred cedis expense in December. Second: PREPAID EXPENSES - these are expenses you've paid in advance. Example: You paid six thousand cedis rent for three months ahead. You adjust to spread this over three months, not all at once. Third: ACCRUED INCOME - this is income you've earned but haven't received yet. Example: You earned five hundred cedis interest in December but the bank only pays it in January. You adjust to record that five hundred cedis income in December. Fourth: DEFERRED INCOME - this is income you received in advance but haven't earned yet. Example: A tenant paid you three thousand cedis rent for future months. You adjust to recognize it gradually as you earn it each month. These four adjustments are the TOOLS that make accrual accounting work. Without them, your financial statements would be wrong! Master these four types and you'll understand accrual accounting completely!`,
      highlightWords: [currencySymbol, 'accrued', 'prepaid', 'deferred', 'adjustment'],
      color: "from-orange-500 to-red-600",
      adjustments: [
        { 
          id: 0,
          icon: Clock,
          type: "Accrued Expenses",
          meaning: "Expenses incurred but not yet paid",
          example: `Electricity used: eight hundred cedis`,
          detail: "Record the expense now even though you'll pay later. This matches the expense to the period when you used the service."
        },
        { 
          id: 1,
          icon: Calendar,
          type: "Prepaid Expenses",
          meaning: "Expenses paid in advance",
          example: `Rent paid for 3 months: six thousand cedis`,
          detail: "Spread the expense over the periods that benefit. Don't record it all at once just because you paid it all at once."
        },
        { 
          id: 2,
          icon: TrendingUp,
          type: "Accrued Income",
          meaning: "Income earned but not yet received",
          example: `Interest earned: five hundred cedis`,
          detail: "Record the income now even though you'll receive payment later. You earned it, so it belongs in this period."
        },
        { 
          id: 3,
          icon: FileText,
          type: "Deferred Income",
          meaning: "Income received in advance",
          example: `Rent received ahead: three thousand cedis`,
          detail: "Don't record it all as income yet. Recognize it gradually as you earn it each period."
        }
      ],
      interactive: 'reveal-adjustments'
    },
    {
      title: "🎯 Why It Matters in " + countryName,
      icon: AlertCircle,
      content: `The accrual concept is mandatory for most businesses and absolutely critical for accurate financial reporting!`,
      narration: `Finally, let me tell you why the accrual concept is so important, especially here in ${countryName}. First and most important: it's REQUIRED by ${ifrsStandards} standards! This means if your business prepares financial statements according to international standards, you MUST use accrual accounting. It's not optional. The ${companiesAct} also requires it for most registered companies. But beyond just following the law, accrual accounting shows TRUE PROFITABILITY for each period. Without it, you wouldn't know if December was really profitable or if January was really bad - the cash movements would confuse everything. Accrual accounting also enables FAIR COMPARISONS between different time periods. You can compare December 2024 with December 2023 accurately because both are recorded on the same basis - when transactions happened, not when cash moved. This helps businesses make better decisions about their future. Banks, investors, and tax authorities all rely on accrual-based financial statements because they're more accurate and reliable. So remember: accrual accounting isn't just a fancy technique - it's the foundation of trustworthy, accurate financial reporting that helps businesses succeed!`,
      highlightWords: [ifrsStandards, companiesAct, countryName, 'required', 'mandatory', 'accurate'],
      color: "from-teal-500 to-cyan-600",
      quizQuestions: [
        { question: "Accrual basis records transactions when they happen, not when cash moves", correct: true },
        { question: "Cash basis is more accurate than accrual basis", correct: false },
        { question: "Accrued expenses are expenses incurred but not yet paid", correct: true },
        { question: "The matching principle says record everything when cash is paid", correct: false },
        { question: "IFRS standards require accrual accounting for most businesses", correct: true }
      ],
      interactive: 'quiz'
    }
  ];

  const currentStage = stages[stage];
  const isLastStage = stage === stages.length - 1;

  // Audio control functions
  const togglePlayPause = useCallback(() => {
    if (!isSpeaking) {
      speakNarration(currentStage.narration);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSpeaking, isPaused]);

  const toggleMute = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      hasSpokenRef.current.delete(stage);
    }
    setIsMuted(prev => !prev);
  }, [isSpeaking, stage]);

  const speakNarration = useCallback((text: string) => {
    if (isMuted || !text) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || voice.name.includes('Google')
    );
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      hasSpokenRef.current.add(stage);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isMuted, stage]);

  // Auto-speak narration when stage changes (only once per stage)
  useEffect(() => {
    if (!isMuted && currentStage.narration && !hasSpokenRef.current.has(stage)) {
      const timer = setTimeout(() => {
        speakNarration(currentStage.narration);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stage, currentStage.narration, speakNarration, isMuted]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleNext = () => {
    // Reset interactive states
    setScenarioChoice(null);
    setRevealedBases(new Set());
    setMatchedExamples({});
    setSelectedAdjustments(new Set());
    setQuizAnswers({});
    setShowQuizResults(false);
    
    if (isLastStage && onComplete) {
      onComplete();
    } else {
      setStage(prev => Math.min(prev + 1, stages.length - 1));
    }
  };

  const handlePrevious = () => {
    // Reset interactive states
    setScenarioChoice(null);
    setRevealedBases(new Set());
    setMatchedExamples({});
    setSelectedAdjustments(new Set());
    setQuizAnswers({});
    setShowQuizResults(false);
    
    setStage(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Audio controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={togglePlayPause}
          className="p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur transition"
          title={isSpeaking ? (isPaused ? "Resume" : "Pause") : "Play"}
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
      <div className="relative max-w-4xl w-full h-full flex flex-col items-center p-3 sm:p-6 md:p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full my-auto py-4 sm:py-8"
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

                {/* Interactive: Scenario Choice (Stage 0) */}
                {currentStage.interactive === 'scenario-choice' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 sm:mt-8"
                  >
                    <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                      👆 When should you record the December electricity expense?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setScenarioChoice('accrual')}
                        className={`p-4 sm:p-6 rounded-xl font-medium text-sm sm:text-base transition-all border-2 ${
                          scenarioChoice === 'accrual'
                            ? 'bg-green-500/30 border-green-400 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-gray-200 border-transparent'
                        }`}
                      >
                        <div className="text-2xl mb-2">✅</div>
                        <div className="font-bold mb-1">December (Accrual)</div>
                        <div className="text-xs sm:text-sm opacity-80">Record when electricity was used</div>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setScenarioChoice('cash')}
                        className={`p-4 sm:p-6 rounded-xl font-medium text-sm sm:text-base transition-all border-2 ${
                          scenarioChoice === 'cash'
                            ? 'bg-red-500/30 border-red-400 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-gray-200 border-transparent'
                        }`}
                      >
                        <div className="text-2xl mb-2">❌</div>
                        <div className="font-bold mb-1">January (Cash)</div>
                        <div className="text-xs sm:text-sm opacity-80">Record when bill arrives and is paid</div>
                      </motion.button>
                    </div>
                    
                    {scenarioChoice && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`mt-4 p-4 sm:p-6 rounded-xl ${
                          scenarioChoice === 'accrual'
                            ? 'bg-green-500/20 border border-green-500/40'
                            : 'bg-red-500/20 border border-red-500/40'
                        }`}
                      >
                        {scenarioChoice === 'accrual' ? (
                          <div className="text-center">
                            <p className="text-lg sm:text-xl font-bold text-green-300 mb-2">🎉 Perfect! That's the Accrual Concept!</p>
                            <p className="text-sm sm:text-base text-gray-200">
                              You record the expense in <strong>DECEMBER</strong> because that's when you USED the electricity, 
                              even though you haven't paid yet. This shows the TRUE cost of December's operations!
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-lg sm:text-xl font-bold text-red-300 mb-2">🤔 Not quite!</p>
                            <p className="text-sm sm:text-base text-gray-200">
                              Recording in January (when paid) is Cash Basis - it's simpler but LESS accurate. 
                              Accrual Concept says record in <strong>DECEMBER</strong> when you actually used the electricity!
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Interactive: Reveal Bases (Stage 1) */}
                {currentStage.interactive === 'reveal-bases' && currentStage.bases && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 sm:mt-8"
                  >
                    <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                      👆 Click each basis to understand the difference:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentStage.bases.map((basis) => (
                        <motion.button
                          key={basis.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + basis.id * 0.15 }}
                          onClick={() => {
                            const newRevealed = new Set(revealedBases);
                            if (newRevealed.has(basis.id)) {
                              newRevealed.delete(basis.id);
                            } else {
                              newRevealed.add(basis.id);
                            }
                            setRevealedBases(newRevealed);
                          }}
                          className={`flex flex-col items-start gap-2 rounded-lg p-3 sm:p-4 text-left transition-all ${
                            revealedBases.has(basis.id)
                              ? basis.id === 0
                                ? 'bg-green-500/20 border-2 border-green-500/40'
                                : 'bg-red-500/20 border-2 border-red-500/40'
                              : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <basis.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                              revealedBases.has(basis.id) 
                                ? basis.id === 0 ? 'text-green-400' : 'text-red-400'
                                : 'text-gray-400'
                            }`} />
                            <span className="text-white text-sm sm:text-base font-bold">{basis.title}</span>
                          </div>
                          <span className="text-gray-300 text-xs sm:text-sm">{basis.when}</span>
                          {revealedBases.has(basis.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className={`text-xs sm:text-sm mt-2 ${
                                basis.id === 0 ? 'text-green-300' : 'text-red-300'
                              }`}
                            >
                              {basis.detail}
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Interactive: Match Examples (Stage 2) */}
                {currentStage.interactive === 'match-examples' && currentStage.examples && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 sm:mt-8"
                  >
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 sm:p-6 mb-4">
                      <h3 className="text-base sm:text-lg font-bold text-yellow-200 mb-2 text-center">
                        🎯 Matching Exercise
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-300 text-center">
                        Match each transaction with the correct period to record it
                      </p>
                    </div>

                    <div className="space-y-3">
                      {currentStage.examples.map((example) => {
                        const userAnswer = matchedExamples[example.id];
                        const isAnswered = userAnswer !== null && userAnswer !== undefined;
                        const isCorrect = isAnswered && userAnswer === example.match;
                        
                        return (
                          <motion.div
                            key={example.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + example.id * 0.1 }}
                            className={`rounded-lg p-3 sm:p-4 border-2 transition-all ${
                              isAnswered
                                ? isCorrect
                                  ? 'bg-green-500/20 border-green-500/40'
                                  : 'bg-red-500/20 border-red-500/40'
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            <p className="text-gray-200 text-xs sm:text-sm mb-3">
                              <strong>Transaction:</strong> {example.transaction}
                            </p>
                            
                            {!isAnswered ? (
                              <button
                                onClick={() => setMatchedExamples(prev => ({ ...prev, [example.id]: example.match }))}
                                className="w-full py-2 px-3 bg-blue-500/30 hover:bg-blue-500/50 rounded-lg text-xs sm:text-sm font-medium text-white transition"
                              >
                                Show Answer
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="text-xs sm:text-sm font-medium text-green-300">
                                  ✓ Record in: <strong>{example.match}</strong>
                                </span>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {Object.keys(matchedExamples).length === currentStage.examples.length && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl text-center"
                      >
                        <p className="text-base sm:text-lg font-bold text-green-300">
                          🎉 You understand the Matching Principle!
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Interactive: Reveal Adjustments (Stage 3) */}
                {currentStage.interactive === 'reveal-adjustments' && currentStage.adjustments && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 sm:mt-8"
                  >
                    <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                      👆 Click each adjustment type to learn how it works:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {currentStage.adjustments.map((adj) => (
                        <motion.button
                          key={adj.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 + adj.id * 0.1 }}
                          onClick={() => {
                            const newSelected = new Set(selectedAdjustments);
                            if (newSelected.has(adj.id)) {
                              newSelected.delete(adj.id);
                            } else {
                              newSelected.add(adj.id);
                            }
                            setSelectedAdjustments(newSelected);
                          }}
                          className={`flex flex-col items-start gap-2 rounded-lg p-3 text-left transition-all ${
                            selectedAdjustments.has(adj.id)
                              ? 'bg-purple-500/20 border-2 border-purple-500/40'
                              : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <adj.icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-colors ${
                              selectedAdjustments.has(adj.id) ? 'text-purple-400' : 'text-gray-400'
                            }`} />
                            <span className="text-white text-xs sm:text-sm font-bold">{adj.type}</span>
                          </div>
                          <span className="text-gray-300 text-xs">{adj.meaning}</span>
                          <span className="text-blue-400 text-xs italic">{adj.example}</span>
                          {selectedAdjustments.has(adj.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="text-xs text-purple-300 mt-2 border-t border-purple-500/30 pt-2"
                            >
                              {adj.detail}
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Interactive: Quiz (Stage 4) */}
                {currentStage.interactive === 'quiz' && currentStage.quizQuestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 sm:mt-8"
                  >
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 sm:p-6 mb-4">
                      <h3 className="text-base sm:text-lg font-bold text-yellow-200 mb-2 text-center">
                        ⚡ Final Accrual Concept Check
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-300 text-center">
                        Test your mastery - mark each as True ✅ or False ❌
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
                            transition={{ delay: 0.7 + index * 0.1 }}
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
                                {percentage === 100 ? '🎉 Perfect! You mastered the Accrual Concept!' :
                                 percentage >= 80 ? '👍 Excellent! You understand accrual accounting well!' :
                                 percentage >= 60 ? '👌 Good job! Review to strengthen your understanding.' :
                                 '💪 Keep learning! Go through the stages again.'}
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

export default AccrualConceptIntro;
