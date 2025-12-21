'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrendingUp, Building2, DollarSign, ChevronLeft, ChevronRight, CheckCircle, Clock, Sparkles, Info, Play, Pause, Volume2, VolumeX, AlertTriangle, XCircle, Truck, Store, ShoppingCart, Factory } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '@/hooks/useLocalization';

interface LessonIntroProps {
  onComplete?: () => void;
}

const GoingConcernIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const { country, localizeContent } = useLocalization();
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());
  
  // Interactive states
  const [mysteryChoice, setMysteryChoice] = useState<'healthy' | 'closing' | null>(null);
  const [revealedPoints, setRevealedPoints] = useState<Set<number>>(new Set());
  const [selectedAssets, setSelectedAssets] = useState<Record<number, string | null>>({});
  const [selectedEffects, setSelectedEffects] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  
  const countryName = country?.name || 'Ghana';
  const currencySymbol = country?.currency?.symbol || '₵';
  const companiesAct = localizeContent('{{business:companies-act}}') || 'Companies Act';
  const accountingBody = localizeContent('{{business:accounting-body}}') || 'ICAG';

  const stages = [
    {
      title: "🏪 The Business Valuation Mystery",
      icon: Building2,
      content: `Imagine you want to buy a provision shop in your neighborhood...`,
      narration: `Welcome to another CRITICAL accounting concept - the Going Concern Concept! Let me ask you a question that will reveal everything. Imagine there are TWO provision shops for sale in your neighborhood in ${countryName}. Shop A - the owner says "I'm selling because I'm moving abroad, but this shop has been profitable for 10 years and will keep running!" Shop B - the owner says "I need to close this shop next month, everything must go, quick sale!" Now HERE'S the question - would you pay the SAME price for both shops? Of course NOT! Shop A is worth MORE because it will continue operating! This is the GOING CONCERN CONCEPT - one of the most fundamental assumptions in accounting! Today, you're going to master this concept that affects EVERY financial statement prepared in ${countryName}! By the end, you'll understand why accountants assume businesses will continue forever, and what happens when they won't!`,
      highlight: `Two shops - one closing next month, one operating for years. Which would you pay more for?`,
      highlightWords: ['Going Concern', 'continue operating', 'financial statement', 'assumption'],
      color: "from-blue-500 to-indigo-600",
      interactive: 'mystery-choice'
    },
    {
      title: "⏰ The Going Concern Assumption",
      icon: Clock,
      content: `We assume the business will continue operating indefinitely!`,
      narration: `Let me explain this powerful assumption! The GOING CONCERN CONCEPT says that when we prepare financial statements, we ASSUME the business will continue operating for the foreseeable future - that means at least the next 12 months, but usually MUCH longer! We assume it indefinitely! Think about what this means. We're assuming the shop will keep selling goods, the factory will keep producing, the company will keep serving customers - not just tomorrow, not just next year, but for MANY years to come! This assumption is SO important that it's required by ${accountingBody} in ${countryName} and by international accounting standards worldwide! But WHY does this matter? Because this ONE assumption affects EVERYTHING - how we value assets, how we record expenses, how we calculate depreciation, EVERYTHING! If a business is NOT a going concern - if it's closing down - we have to prepare the accounts COMPLETELY differently! Let me show you the four key parts of this assumption that you MUST understand!`,
      highlight: `We assume businesses will continue for at least 12 months, usually indefinitely!`,
      highlightWords: ['Going Concern', 'continue operating', 'assumption', '12 months', accountingBody],
      keyPoints: [
        "Business will keep operating normally - no plans to close",
        "No intention to liquidate or significantly reduce operations",
        "Assets will be used for their intended purposes over useful life",
        "Liabilities will be settled in the normal course of business"
      ],
      color: "from-green-500 to-emerald-600",
      interactive: 'reveal-points'
    },
    {
      title: "💰 Impact on Asset Values",
      icon: DollarSign,
      content: "Going concern DRAMATICALLY affects how we value assets!",
      narration: `Now let's see the HUGE impact this concept has on asset values! Imagine a delivery truck. In ${countryName}, a good delivery truck might cost eighty thousand to buy new. But here's where going concern makes a MASSIVE difference! If the business is a GOING CONCERN - continuing to operate - we value that truck at its NORMAL value. After 2 years of use, maybe it's worth sixty thousand. We depreciate it gradually because the business will USE it for its full useful life of maybe 10 years! But WAIT - what if the business is NOT a going concern? What if it's liquidating, closing down? Now that SAME truck might only be worth thirty five thousand! Why? Because it's a FORCED SALE! The owner needs money FAST! They can't wait for the right buyer! The truck has to be sold QUICKLY, so the value DROPS dramatically! This applies to EVERYTHING - buildings, equipment, inventory, furniture! Going concern value versus liquidation value can differ by FIFTY PERCENT or more! That's why this assumption is SO critical for accurate financial reporting!`,
      highlightWords: ['asset values', 'going concern', 'liquidation', 'depreciation', 'forced sale'],
      assetExamples: [
        { name: "Delivery Truck", icon: Truck, goingValue: 60000, liquidationValue: 35000 },
        { name: "Shop Equipment", icon: Store, goingValue: 45000, liquidationValue: 22000 },
        { name: "Inventory Stock", icon: ShoppingCart, goingValue: 80000, liquidationValue: 50000 },
        { name: "Factory Machinery", icon: Factory, goingValue: 150000, liquidationValue: 75000 }
      ],
      color: "from-purple-500 to-pink-600",
      interactive: 'compare-assets'
    },
    {
      title: "📊 Financial Statement Effects",
      icon: TrendingUp,
      content: "This concept affects MANY accounting treatments!",
      narration: `Let me show you HOW MANY things in accounting depend on the going concern assumption! This is absolutely CRUCIAL to understand! First, DEPRECIATION. When we assume going concern, we spread the cost of assets over their FULL useful life. A building might depreciate over 40 years! But if the business is closing? No depreciation - we value everything at quick sale prices! Second, PREPAYMENTS. If you paid rent for next year, we record it as an asset because the business will BE there next year to use it! Not a going concern? That prepaid rent might be LOST! Third, INVENTORY valuation. Going concern means we value stock at cost or net realizable value. Liquidation? Forced sale prices - usually MUCH lower! Fourth, LONG-TERM contracts. Going concern lets us recognize revenue over time as we complete projects. Not going concern? We might have to cancel contracts and take losses immediately! In ${countryName}, understanding these effects is essential for preparing accurate financial statements according to ${accountingBody} standards!`,
      highlightWords: ['Depreciation', 'Prepayments', 'Inventory', 'Long-term contracts', accountingBody],
      effects: [
        { title: "Depreciation", detail: "Spread over full useful life, not forced sale", icon: Clock },
        { title: "Prepayments", detail: "Recorded as assets (rent, insurance paid in advance)", icon: CheckCircle },
        { title: "Inventory Valuation", detail: "Cost or net realizable value, not distress prices", icon: ShoppingCart },
        { title: "Long-term Contracts", detail: "Revenue recognized over time as completed", icon: TrendingUp }
      ],
      color: "from-orange-500 to-red-600",
      interactive: 'reveal-effects'
    },
    {
      title: "🎯 Why It Matters in Practice",
      icon: Info,
      content: `Understanding going concern is crucial for everyone in business!`,
      narration: `Now let me tell you WHY this concept matters SO much in ${countryName}'s business world! First, DIRECTORS have a LEGAL responsibility! Under the ${companiesAct}, company directors MUST assess whether their business is a going concern when preparing financial statements. If they have doubts, they MUST disclose them! It's the LAW! Second, AUDITORS are required to evaluate it! When ${accountingBody} members audit financial statements, they MUST form an opinion on going concern. If they have doubts, they MUST report it! This can affect the entire audit opinion! Third, INVESTORS and CREDITORS rely on this! When someone wants to invest in a business or lend it money, they look at the financial statements. If it's NOT a going concern, those statements are almost USELESS for decision making! Banks won't lend! Investors won't invest! Suppliers won't give credit! The business can collapse! Fourth, employees and customers need to know! If a business is closing, employees need other jobs! Customers need other suppliers! Going concern affects EVERYONE! That's why understanding this concept is absolutely ESSENTIAL for any accountant, business owner, auditor, or investor in ${countryName}!`,
      highlightWords: [companiesAct, accountingBody, 'directors', 'auditors', 'investors', 'financial statements'],
      quizQuestions: [
        { question: "Going concern assumes business will continue for at least 12 months", correct: true },
        { question: "Liquidation values are usually HIGHER than going concern values", correct: false },
        { question: "Directors must assess going concern when preparing financial statements", correct: true },
        { question: "Going concern assumption affects depreciation calculations", correct: true },
        { question: "If a business is closing, we still use normal accounting methods", correct: false }
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
      setMysteryChoice(null);
      setRevealedPoints(new Set());
      setSelectedAssets({});
      setSelectedEffects(new Set());
      setQuizAnswers({});
      setShowQuizResults(false);
    }
  };

  const handlePrevious = () => {
    setStage(prev => Math.max(prev - 1, 0));
    // Reset interactive states
    setMysteryChoice(null);
    setRevealedPoints(new Set());
    setSelectedAssets({});
    setSelectedEffects(new Set());
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

              {/* Interactive: Mystery Choice (Stage 0) */}
              {currentStage.interactive === 'mystery-choice' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 sm:mt-8"
                >
                  <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                    👆 Which shop would you pay MORE for?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setMysteryChoice('healthy')}
                      className={`p-4 sm:p-6 rounded-xl font-medium text-sm sm:text-base transition-all border-2 ${
                        mysteryChoice === 'healthy'
                          ? 'bg-green-500/30 border-green-400 text-white'
                          : 'bg-white/10 hover:bg-white/20 text-gray-200 border-transparent'
                      }`}
                    >
                      <div className="text-2xl mb-2">🏪</div>
                      <div className="font-bold mb-1">Shop A</div>
                      <div className="text-xs sm:text-sm opacity-80">Profitable for 10 years, will continue operating</div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setMysteryChoice('closing')}
                      className={`p-4 sm:p-6 rounded-xl font-medium text-sm sm:text-base transition-all border-2 ${
                        mysteryChoice === 'closing'
                          ? 'bg-red-500/30 border-red-400 text-white'
                          : 'bg-white/10 hover:bg-white/20 text-gray-200 border-transparent'
                      }`}
                    >
                      <div className="text-2xl mb-2">🚪</div>
                      <div className="font-bold mb-1">Shop B</div>
                      <div className="text-xs sm:text-sm opacity-80">Closing next month, everything must go!</div>
                    </motion.button>
                  </div>
                  
                  {mysteryChoice && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-4 p-4 sm:p-6 rounded-xl ${
                        mysteryChoice === 'healthy'
                          ? 'bg-green-500/20 border border-green-500/40'
                          : 'bg-orange-500/20 border border-orange-500/40'
                      }`}
                    >
                      {mysteryChoice === 'healthy' ? (
                        <div className="text-center">
                          <p className="text-lg sm:text-xl font-bold text-green-300 mb-2">🎉 Exactly right!</p>
                          <p className="text-sm sm:text-base text-gray-200">
                            Shop A is worth MORE because it's a <strong>GOING CONCERN</strong> - it will continue operating! 
                            This assumption affects EVERYTHING in accounting!
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-lg sm:text-xl font-bold text-orange-300 mb-2">🤔 Think again!</p>
                          <p className="text-sm sm:text-base text-gray-200">
                            Shop B is closing, so it's worth LESS! Shop A is the better value because it's a 
                            <strong> GOING CONCERN</strong> - continuing to operate. This is what we'll learn about!
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
                    👆 Click each assumption to understand it better:
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
                              {index === 0 && "✓ No shutdown plans - business continues day-to-day operations"}
                              {index === 1 && "✓ Not being sold off or wound down - staying in business"}
                              {index === 2 && "✓ Equipment used for full useful life - not quick disposal"}
                              {index === 3 && "✓ Debts paid normally over time - not forced immediate payment"}
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Interactive: Compare Assets (Stage 2) */}
              {currentStage.interactive === 'compare-assets' && currentStage.assetExamples && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 sm:mt-8"
                >
                  <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                    👆 Click each asset to see the value difference:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentStage.assetExamples.map((asset, index) => {
                      const isRevealed = selectedAssets[index] !== null && selectedAssets[index] !== undefined;
                      
                      return (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          onClick={() => setSelectedAssets(prev => ({ ...prev, [index]: 'revealed' }))}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            isRevealed
                              ? 'bg-purple-500/20 border-purple-500/40'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <asset.icon className="w-8 h-8 text-purple-400" />
                            <div className="font-bold text-white text-sm sm:text-base">{asset.name}</div>
                          </div>
                          
                          {!isRevealed ? (
                            <div className="text-xs sm:text-sm text-gray-400">Click to compare values</div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-2 text-xs sm:text-sm"
                            >
                              <div className="flex justify-between items-center p-2 bg-green-500/20 rounded">
                                <span className="text-gray-300">Going Concern:</span>
                                <span className="font-bold text-green-400">{currencySymbol}{asset.goingValue.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-red-500/20 rounded">
                                <span className="text-gray-300">Liquidation:</span>
                                <span className="font-bold text-red-400">{currencySymbol}{asset.liquidationValue.toLocaleString()}</span>
                              </div>
                              <div className="text-center text-yellow-300 font-medium mt-2">
                                {Math.round(((asset.goingValue - asset.liquidationValue) / asset.goingValue) * 100)}% difference!
                              </div>
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  {Object.keys(selectedAssets).length === currentStage.assetExamples.length && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-center"
                    >
                      <p className="text-base sm:text-lg font-bold text-purple-300">
                        💡 See the huge difference? Going concern values are much higher!
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Interactive: Reveal Effects (Stage 3) */}
              {currentStage.interactive === 'reveal-effects' && currentStage.effects && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 sm:mt-8"
                >
                  <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                    👆 Click each effect to learn how going concern impacts it:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentStage.effects.map((effect, index) => {
                      const isSelected = selectedEffects.has(index);
                      
                      return (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          onClick={() => {
                            const newSelected = new Set(selectedEffects);
                            if (newSelected.has(index)) {
                              newSelected.delete(index);
                            } else {
                              newSelected.add(index);
                            }
                            setSelectedEffects(newSelected);
                          }}
                          className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                            isSelected
                              ? 'bg-orange-500/20 border-orange-500/40'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <effect.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isSelected ? 'text-orange-400' : 'text-gray-400'}`} />
                            <div className="flex-1">
                              <div className="font-semibold text-white text-xs sm:text-sm mb-1">{effect.title}</div>
                              {isSelected && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="text-xs text-gray-300 mt-1"
                                >
                                  {effect.detail}
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
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
                      ⚡ Final Knowledge Check
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 text-center">
                      Test your understanding - mark each as True ✅ or False ❌
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
                              {percentage === 100 ? '🎉 Perfect! You mastered the Going Concern Concept!' :
                               percentage >= 80 ? '👍 Excellent! You understand going concern well!' :
                               percentage >= 60 ? '👌 Good job! Review to strengthen your understanding.' :
                               '💪 Keep learning! Go through the stages again to master this.'}
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

export default GoingConcernIntro;
