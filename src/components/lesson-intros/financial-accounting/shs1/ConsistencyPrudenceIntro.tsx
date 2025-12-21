'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Scale, Shield, TrendingDown, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, Target, Sparkles, Play, Pause, Volume2, VolumeX, XCircle, Calendar, TrendingUp, DollarSign, Package, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '@/hooks/useLocalization';

interface LessonIntroProps {
  onComplete?: () => void;
}

const ConsistencyPrudenceIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const { country, localizeContent } = useLocalization();
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());
  
  // Interactive states
  const [ownerChoice, setOwnerChoice] = useState<'a' | 'b' | null>(null);
  const [revealedBenefits, setRevealedBenefits] = useState<Set<number>>(new Set());
  const [selectedRules, setSelectedRules] = useState<Set<number>>(new Set());
  const [matchedPairs, setMatchedPairs] = useState<Record<number, string | null>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  
  const countryName = country?.name || 'Ghana';
  const currencySymbol = country?.currency?.symbol || '₵';
  const capitalCity = localizeContent('{{city:capital}}') || 'capital city';
  const ifrsStandards = localizeContent('{{business:accounting-standards}}') || 'IFRS';
  const accountingBody = localizeContent('{{business:accounting-body}}') || 'ICAG';

  const stages = [
    {
      title: "🏪 Two Shop Owners - Who Would You Trust?",
      icon: Scale,
      content: `Two shop owners prepare their financial statements differently...`,
      narration: `Welcome to TWO incredibly important accounting concepts - Consistency and Prudence! Let me start with a story that happens all the time in ${countryName}. Imagine TWO shop owners preparing their year-end accounts. Owner A keeps CHANGING how he values his stock. Last year, he used FIFO method. This year, he switches to Average Cost. Next year, who knows? Maybe Weighted Average! Owner B is DIFFERENT. She chose FIFO method five years ago, and guess what? She STILL uses FIFO! Same method, year after year after year! Now, here's my QUESTION for you - if you're a bank manager deciding who gets a loan, whose financial statements would you TRUST more? Think about it! Owner A's profits jump up and down, but is it because his business is getting better or worse, OR is it just because he keeps changing methods? You can't tell! But Owner B? You can CLEARLY see if her business is growing or declining because she uses the SAME method every year! This is the CONSISTENCY CONCEPT - one of the fundamental principles of accounting! And today, you're also going to learn about PRUDENCE - being careful and cautious in accounting! By the end, you'll understand why EVERY accountant in ${countryName} MUST master these two concepts!`,
      highlight: `Two owners - one changes methods yearly, one stays consistent. Who would YOU trust?`,
      highlightWords: ['Consistency', 'Prudence', 'trust', 'same method', 'cautious'],
      color: "from-blue-500 to-indigo-600",
      interactive: 'owner-choice'
    },
    {
      title: "🔄 The Consistency Concept",
      icon: Target,
      content: `Use the SAME accounting methods year after year!`,
      narration: `Let me explain the CONSISTENCY CONCEPT in detail! This principle says that once you choose an accounting method or policy, you MUST apply it consistently from one period to the next! What does this mean in practice? If you choose FIFO for stock valuation this year, use FIFO next year! If you depreciate vehicles over 5 years, keep doing that - don't suddenly change to 8 years just because you want higher profits! This concept is CRUCIAL in ${countryName} because it's required by ${ifrsStandards} standards and enforced by ${accountingBody}! Why is consistency SO important? First, it enables COMPARISONS! Investors can look at your 2023 and 2024 accounts and see TRUE performance changes, not just accounting trick changes! Second, it prevents MANIPULATION! Without consistency, dishonest owners could switch methods whenever they want to show better profits! Third, it builds TRUST! Banks, investors, suppliers - they all trust consistent financial statements more! Fourth, it reveals TRENDS! You can see if your business is truly growing or declining over time! But WAIT - does this mean you can NEVER change a method? NO! You CAN change, but ONLY for a good reason, and you MUST disclose it in your financial statements! Let me show you the four KEY benefits you need to remember!`,
      highlight: `Same methods year after year = Comparable and trustworthy results!`,
      highlightWords: ['Consistency', 'same methods', 'comparable', ifrsStandards, accountingBody],
      benefits: [
        { title: "Year-to-Year Comparisons", detail: "See true trends, not just accounting changes", icon: Calendar },
        { title: "Prevents Profit Manipulation", detail: "Can't switch methods to inflate profits", icon: Shield },
        { title: "Builds Stakeholder Trust", detail: "Banks and investors trust consistent reporting", icon: Users },
        { title: "Shows True Performance Trends", detail: "Real growth or decline becomes visible", icon: TrendingUp }
      ],
      color: "from-green-500 to-emerald-600",
      interactive: 'reveal-benefits'
    },
    {
      title: "⚖️ The Prudence Concept",
      icon: Shield,
      content: `Be cautious! Never overstate - always understate if uncertain!`,
      narration: `Now let's learn about PRUDENCE - also called CONSERVATISM! This concept says: be CAUTIOUS in accounting! When you're uncertain, it's BETTER to underestimate profits than overestimate them! Why? Because overestimating gives false hope to investors, creditors, and owners! Let me give you the GOLDEN RULE of prudence in ${countryName}: Do NOT anticipate profits, but PROVIDE for all possible losses! What does this mean practically? First, don't count profits until they're CERTAIN! If you THINK you'll make a hundred thousand profit on a contract, don't record it until you're SURE! Second, provide for ALL known losses IMMEDIATELY! If you THINK you might have bad debts, create a provision RIGHT NOW! Don't wait! Third, value inventory at the LOWER of cost or net realizable value! If you bought goods for eighty thousand but can only sell them for sixty thousand, record sixty thousand! Take the loss NOW! Fourth, create provisions for doubtful debts! Not all customers will pay - be prudent, expect some losses! This concept protects everyone - owners, investors, creditors - from UNREALISTIC expectations! In ${countryName}, ${accountingBody} requires prudence in ALL financial reporting! Let me show you the four key rules you MUST follow!`,
      highlight: `Don't anticipate profits, but provide for ALL possible losses!`,
      highlightWords: ['Prudence', 'cautious', 'underestimate', 'losses', accountingBody],
      rules: [
        { title: "Don't Count Uncertain Profits", detail: "Only recognize profits when reasonably certain", icon: XCircle },
        { title: "Provide for All Known Losses", detail: "Record all possible losses immediately", icon: AlertTriangle },
        { title: "Value Stock Conservatively", detail: "Lower of cost or net realizable value", icon: Package },
        { title: "Expect Bad Debts", detail: "Create provisions for doubtful debts", icon: DollarSign }
      ],
      color: "from-purple-500 to-pink-600",
      interactive: 'reveal-rules'
    },
    {
      title: "🎯 Key Differences - Consistency vs Prudence",
      icon: TrendingDown,
      content: "Two different concepts serving complementary purposes!",
      narration: `Now let me show you the KEY differences between these TWO concepts, because students often confuse them! CONSISTENCY is about TIME and COMPARABILITY! It asks the question: Am I using the SAME method as I used last year? It's about being COMPARABLE across periods! If you depreciated buildings over forty years last year, do it again this year! Consistency helps investors SEE trends over time! But PRUDENCE is about UNCERTAINTY and CAUTION! It asks: What if things go WRONG? It's about being CAREFUL with estimates and valuations! Even if you're being consistent, you MUST still be prudent! For example, you can CONSISTENTLY use FIFO for inventory, but PRUDENTLY value that inventory at lower of cost or market! See the difference? Here's another way to think about it in ${countryName}: Consistency prevents you from MANIPULATING accounts by switching methods! Prudence prevents you from being OVER-OPTIMISTIC about values! They work TOGETHER to ensure financial statements are both comparable AND reliable! ${ifrsStandards} requires BOTH concepts! ${accountingBody} members must apply BOTH! Let me give you a matching exercise to test your understanding!`,
      highlightWords: ['Consistency', 'Prudence', 'TIME', 'UNCERTAINTY', 'comparability', 'caution'],
      scenarios: [
        { id: 1, text: "Using FIFO method every year for 5 years", correctConcept: "Consistency" },
        { id: 2, text: "Creating provision for bad debts at year-end", correctConcept: "Prudence" },
        { id: 3, text: "Depreciating vehicles over 5 years each year", correctConcept: "Consistency" },
        { id: 4, text: "Valuing closing stock at lower of cost or NRV", correctConcept: "Prudence" }
      ],
      color: "from-orange-500 to-red-600",
      interactive: 'match-concepts'
    },
    {
      title: "🎯 Why Both Matter Together",
      icon: Sparkles,
      content: `These concepts work together for reliable financial reporting!`,
      narration: `Finally, let me tell you why BOTH concepts matter SO MUCH together in ${countryName}'s business environment! First, they're REQUIRED by ${ifrsStandards} standards! Every set of financial statements prepared in ${countryName} MUST follow both principles! ${accountingBody} will discipline any accountant who ignores them! Second, they build INVESTOR CONFIDENCE! When investors in ${capitalCity} look at financial statements, they want to see consistent methods applied prudently! This combination gives them confidence to invest! Third, they're ESSENTIAL for bank loans! Banks in ${countryName} analyze financial statements before lending money. They look for consistency to see trends, and prudence to ensure values aren't overstated! Fourth, they protect ALL stakeholders! Owners see realistic profits! Creditors see safe asset values! Employees see if the business is truly secure! Together, these concepts create a foundation of TRUST in financial reporting! Without consistency, you can't compare! Without prudence, you might overstate! Together, they ensure financial statements are both COMPARABLE and RELIABLE! That's why EVERY professional accountant in ${countryName} must master BOTH concepts! Now, let's test your understanding with a final quiz!`,
      highlightWords: [ifrsStandards, accountingBody, capitalCity, 'trust', 'comparable', 'reliable'],
      quizQuestions: [
        { question: "Consistency means using the same accounting methods year after year", correct: true },
        { question: "Prudence allows you to recognize uncertain profits early", correct: false },
        { question: "You can never change an accounting method once chosen", correct: false },
        { question: "Inventory should be valued at lower of cost or net realizable value", correct: true },
        { question: "Consistency and Prudence work together to ensure reliable reporting", correct: true }
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
      // Reset interactive states
      setOwnerChoice(null);
      setRevealedBenefits(new Set());
      setSelectedRules(new Set());
      setMatchedPairs({});
      setQuizAnswers({});
      setShowQuizResults(false);
    }
  };

  const handlePrevious = () => {
    setStage(prev => Math.max(prev - 1, 0));
    // Reset interactive states
    setOwnerChoice(null);
    setRevealedBenefits(new Set());
    setSelectedRules(new Set());
    setMatchedPairs({});
    setQuizAnswers({});
    setShowQuizResults(false);
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

              {/* Interactive: Owner Choice (Stage 0) */}
              {currentStage.interactive === 'owner-choice' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 sm:mt-8"
                >
                  <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                    👆 Which owner's financial statements would you trust more?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setOwnerChoice('a')}
                      className={`p-4 sm:p-6 rounded-xl font-medium text-sm sm:text-base transition-all border-2 ${
                        ownerChoice === 'a'
                          ? 'bg-orange-500/30 border-orange-400 text-white'
                          : 'bg-white/10 hover:bg-white/20 text-gray-200 border-transparent'
                      }`}
                    >
                      <div className="text-2xl mb-2">🔄</div>
                      <div className="font-bold mb-1">Owner A</div>
                      <div className="text-xs sm:text-sm opacity-80">Changes stock valuation method every year</div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setOwnerChoice('b')}
                      className={`p-4 sm:p-6 rounded-xl font-medium text-sm sm:text-base transition-all border-2 ${
                        ownerChoice === 'b'
                          ? 'bg-green-500/30 border-green-400 text-white'
                          : 'bg-white/10 hover:bg-white/20 text-gray-200 border-transparent'
                      }`}
                    >
                      <div className="text-2xl mb-2">✅</div>
                      <div className="font-bold mb-1">Owner B</div>
                      <div className="text-xs sm:text-sm opacity-80">Uses same method consistently year after year</div>
                    </motion.button>
                  </div>
                  
                  {ownerChoice && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-4 p-4 sm:p-6 rounded-xl ${
                        ownerChoice === 'b'
                          ? 'bg-green-500/20 border border-green-500/40'
                          : 'bg-orange-500/20 border border-orange-500/40'
                      }`}
                    >
                      {ownerChoice === 'b' ? (
                        <div className="text-center">
                          <p className="text-lg sm:text-xl font-bold text-green-300 mb-2">🎉 Exactly right!</p>
                          <p className="text-sm sm:text-base text-gray-200">
                            Owner B's statements are trustworthy because of <strong>CONSISTENCY</strong>! 
                            You can compare year-to-year and see true trends!
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-lg sm:text-xl font-bold text-orange-300 mb-2">🤔 Think about it!</p>
                          <p className="text-sm sm:text-base text-gray-200">
                            Owner A keeps changing methods - you can't tell if profit changes are real or just accounting tricks!
                            Owner B uses <strong>CONSISTENT</strong> methods!
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Interactive: Reveal Benefits (Stage 1) */}
              {currentStage.interactive === 'reveal-benefits' && currentStage.benefits && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 sm:mt-8"
                >
                  <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                    👆 Click each benefit to learn why it matters:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {currentStage.benefits.map((benefit, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        onClick={() => {
                          const newRevealed = new Set(revealedBenefits);
                          if (newRevealed.has(index)) {
                            newRevealed.delete(index);
                          } else {
                            newRevealed.add(index);
                          }
                          setRevealedBenefits(newRevealed);
                        }}
                        className={`flex items-start gap-2 rounded-lg p-2 sm:p-3 text-left transition-all ${
                          revealedBenefits.has(index)
                            ? 'bg-green-500/20 border-2 border-green-500/40'
                            : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                        }`}
                      >
                        <benefit.icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 transition-colors ${
                          revealedBenefits.has(index) ? 'text-green-400' : 'text-gray-400'
                        }`} />
                        <div className="flex-1">
                          <span className="text-gray-200 text-xs sm:text-sm block font-medium">{benefit.title}</span>
                          {revealedBenefits.has(index) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="text-xs text-green-300 mt-2"
                            >
                              {benefit.detail}
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Interactive: Reveal Rules (Stage 2) */}
              {currentStage.interactive === 'reveal-rules' && currentStage.rules && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 sm:mt-8"
                >
                  <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                    👆 Click each rule to understand the prudence principle:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {currentStage.rules.map((rule, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        onClick={() => {
                          const newSelected = new Set(selectedRules);
                          if (newSelected.has(index)) {
                            newSelected.delete(index);
                          } else {
                            newSelected.add(index);
                          }
                          setSelectedRules(newSelected);
                        }}
                        className={`flex items-start gap-2 rounded-lg p-2 sm:p-3 text-left transition-all ${
                          selectedRules.has(index)
                            ? 'bg-purple-500/20 border-2 border-purple-500/40'
                            : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                        }`}
                      >
                        <rule.icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 transition-colors ${
                          selectedRules.has(index) ? 'text-purple-400' : 'text-gray-400'
                        }`} />
                        <div className="flex-1">
                          <span className="text-gray-200 text-xs sm:text-sm block font-medium">{rule.title}</span>
                          {selectedRules.has(index) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="text-xs text-purple-300 mt-2"
                            >
                              {rule.detail}
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Interactive: Match Concepts (Stage 3) */}
              {currentStage.interactive === 'match-concepts' && currentStage.scenarios && (
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
                      Match each scenario to either Consistency or Prudence
                    </p>
                  </div>

                  <div className="space-y-3">
                    {currentStage.scenarios.map((scenario) => {
                      const userAnswer = matchedPairs[scenario.id];
                      const isAnswered = userAnswer !== null && userAnswer !== undefined;
                      const isCorrect = isAnswered && userAnswer === scenario.correctConcept;
                      
                      return (
                        <motion.div
                          key={scenario.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + scenario.id * 0.1 }}
                          className={`rounded-lg p-3 sm:p-4 border-2 transition-all ${
                            isAnswered
                              ? isCorrect
                                ? 'bg-green-500/20 border-green-500/40'
                                : 'bg-red-500/20 border-red-500/40'
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          <p className="text-gray-200 text-xs sm:text-sm mb-3">
                            <strong>Scenario {scenario.id}:</strong> {scenario.text}
                          </p>
                          
                          {!isAnswered ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => setMatchedPairs(prev => ({ ...prev, [scenario.id]: 'Consistency' }))}
                                className="flex-1 py-2 px-3 bg-blue-500/30 hover:bg-blue-500/50 rounded-lg text-xs sm:text-sm font-medium text-white transition"
                              >
                                Consistency
                              </button>
                              <button
                                onClick={() => setMatchedPairs(prev => ({ ...prev, [scenario.id]: 'Prudence' }))}
                                className="flex-1 py-2 px-3 bg-purple-500/30 hover:bg-purple-500/50 rounded-lg text-xs sm:text-sm font-medium text-white transition"
                              >
                                Prudence
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
                                {isCorrect ? `✓ Correct! It's ${scenario.correctConcept}` : `✗ Incorrect. Answer is ${scenario.correctConcept}`}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {Object.keys(matchedPairs).length === currentStage.scenarios.length && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl text-center"
                    >
                      <p className="text-base sm:text-lg font-bold text-green-300">
                        🎉 Exercise complete! You're understanding the differences!
                      </p>
                    </motion.div>
                  )}
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
                      ⚡ Final Knowledge Check
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
                              {percentage === 100 ? '🎉 Perfect! You mastered Consistency & Prudence!' :
                               percentage >= 80 ? '👍 Excellent! You understand these concepts well!' :
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

export default ConsistencyPrudenceIntro;
