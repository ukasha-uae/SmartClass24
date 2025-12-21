'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Users, Building2, UserCheck, TrendingUp, ShieldCheck, ArrowRight, CheckCircle, Sparkles, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, DollarSign, FileText, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '@/hooks/useLocalization';

interface LessonIntroProps {
  onComplete?: () => void;
}

const UsersOfInformationIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { country, localizeContent } = useLocalization();
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());
  
  const countryName = country?.name || 'Ghana';
  const currencySymbol = country?.currency?.symbol || '₵';
  const taxAuthority = localizeContent('{{business:tax-authority}}') || 'GRA';
  const majorCity = localizeContent('{{city:major}}') || 'Accra';
  const telecomCompany = localizeContent('{{business:company:1}}') || 'MTN';
  const localBank1 = localizeContent('{{business:bank:1}}') || 'GCB Bank';
  const localBank2 = localizeContent('{{business:bank:2}}') || 'Ecobank';

  const stages = [
    {
      title: "👥 Who Uses Accounting Information?",
      content: `Every business record has an audience waiting to read it!`,
      narration: `Welcome back, future accountants! Today we're answering a FASCINATING question - who actually uses all those accounting records we prepare? You see, when Maame Esi's chop bar in ${majorCity} closes for the day and she counts her money, when ${telecomCompany} ${countryName} publishes its annual report, when your neighborhood provision shop records its sales - all these records have AUDIENCES! People who desperately need this information to make important decisions! Some users work INSIDE the business, others work OUTSIDE. Some need detailed daily reports, others want yearly summaries. By the end of this lesson, you'll understand exactly WHO uses accounting information and WHY they need it. This knowledge is CRUCIAL because as an accountant, you'll be preparing different reports for different users!`,
      highlightWords: ['accounting information', 'users', 'inside', 'outside', 'reports', 'decisions']
    },
    {
      title: "🏢 Internal Users",
      content: "People working INSIDE the business who make daily decisions",
      narration: `Let's start with INTERNAL users - these are people who work IN or RUN the business. They have complete access to ALL the accounting records! Think about it - when Maame Akua runs her provision shop in ${countryName}, she needs to know: Did we make profit yesterday? Which products are selling fast? Can we afford to buy more stock? She checks her sales book, expense records, and cash balance EVERY single day! The OWNER is the primary internal user - every cedi matters to them! Then we have MANAGERS - they analyze cost reports to control expenses. The Finance Director studies cash flow to ensure the business doesn't run out of money. Department heads compare budgets to actual spending. EMPLOYEES also use accounting info - they check if the company is profitable because it affects their job security and bonuses! All these internal users need DETAILED, UP-TO-DATE information because they make decisions DAILY!`,
      highlightWords: ['internal users', 'owner', 'managers', 'employees', 'detailed', 'daily decisions', 'inside the business']
    },
    {
      title: "🌍 External Users", 
      content: "People OUTSIDE the business who need financial information",
      narration: `Now let's talk about EXTERNAL users - people who don't work in the business but absolutely NEED its financial information! These users don't have access to detailed records, so they rely on published financial statements. First, we have the ${taxAuthority} - the tax authority in ${countryName}. They need your income statement to calculate how much tax you owe. Every business MUST provide this! Next, BANKS and financial institutions. When ${localBank1} or ${localBank2} considers giving you a loan, they examine your balance sheet carefully. Can this business repay? Do they have enough assets? What's their profit trend? Then we have INVESTORS - people thinking of buying shares in your company. They study your financial statements to predict future returns. Will this business grow? Is it profitable? SUPPLIERS also check your finances before giving credit. If you want to buy goods and pay after 30 days, suppliers will verify you can actually pay! CREDITORS who already lent you money monitor your finances to ensure you'll repay. Even COMPETITORS study your published accounts to see how they compare! External users get SUMMARIZED information - usually annual reports!`,
      highlightWords: ['external users', taxAuthority, 'banks', 'investors', 'suppliers', 'creditors', 'outside the business', 'financial statements']
    },
    {
      title: "📊 Different Information Needs",
      content: "Why each user group needs DIFFERENT types of information",
      narration: `Here's where it gets REALLY interesting! Not everyone needs the SAME information from accounting records. Each user group has different questions, so they need different answers! Internal users like the owner need VERY DETAILED information - she wants to know exactly how much was spent on electricity THIS week, which specific customer owes money, what EACH product cost yesterday. She needs this information FREQUENTLY - sometimes even HOURLY for a busy shop! But external users get SUMMARIZED information - the ${taxAuthority} doesn't care about your daily electricity bill; they want to know your TOTAL profit for the ENTIRE year! Banks don't need to know each customer's payment; they want your TOTAL assets and liabilities. Investors study your profit TREND over 3 to 5 years, not daily sales! Let me give you an example from ${countryName}: When a business owner checks her cash book, she sees EVERY transaction - "${currencySymbol}50 for taxi, ${currencySymbol}200 for lunch, ${currencySymbol}15 for credit." But when she prepares accounts for ${taxAuthority}, she just reports "Transport expenses: ${currencySymbol}5,000" for the whole year! CREDITORS focus on one thing - your ability to PAY. They study your current assets versus current liabilities. Can you pay your debts? INVESTORS focus on PROFITABILITY - are you making enough profit to give them good returns? Each user has a different FOCUS!`,
      highlightWords: ['different needs', 'detailed', 'summarized', 'internal', 'external', 'focus', 'frequency']
    },
    {
      title: "🎯 Why This Matters to YOU!",
      content: "Understanding users makes you a better accountant",
      narration: `So why is all this important to YOU as a future accountant in ${countryName}? Because you'll be PREPARING these reports! You need to understand EXACTLY what each user needs! When the owner asks for a report, you know she wants DETAILED, DAILY information - you'll give her a list of all transactions. When ${taxAuthority} requires accounts, you know they want ANNUAL SUMMARIES following specific formats - you'll prepare proper Income Statement and Balance Sheet! When the bank requests information for a loan application, you know they're checking ABILITY TO REPAY - you'll highlight your assets, cash flow, and profit trends! Good accountants don't just record numbers - they UNDERSTAND who will READ those numbers and what decisions they'll make! This is why accounting is called the LANGUAGE OF BUSINESS - you're not just writing numbers, you're COMMUNICATING with multiple stakeholders! Master this, and you'll be an excellent accountant! You'll know what the business owner needs on Monday morning, what ${taxAuthority} expects by tax deadline, what banks require for loans. You'll be serving EVERYONE and helping businesses succeed in ${countryName}!`,
      highlightWords: ['future accountant', 'preparing reports', 'understand users', 'language of business', 'communicate', 'stakeholders']
    }
  ];

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
      setCurrentWordIndex(-1);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const togglePlayPause = () => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      speakNarration();
    }
  };

  const handleNext = () => {
    if (stage < stages.length - 1) {
      setStage(stage + 1);
      hasSpokenRef.current.delete(stage + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (stage > 0) {
      setStage(stage - 1);
    }
  };

  const internalUsers = [
    { name: 'Owner', icon: Building2, need: 'Daily profit & loss', color: 'from-blue-500 to-indigo-600' },
    { name: 'Managers', icon: BarChart3, need: 'Cost control reports', color: 'from-green-500 to-emerald-600' },
    { name: 'Employees', icon: Users, need: 'Company performance', color: 'from-purple-500 to-pink-600' }
  ];

  const externalUsers = [
    { name: taxAuthority, icon: ShieldCheck, need: 'Annual tax returns', color: 'from-red-500 to-orange-600' },
    { name: 'Banks', icon: DollarSign, need: 'Loan repayment ability', color: 'from-yellow-500 to-amber-600' },
    { name: 'Investors', icon: TrendingUp, need: 'Profitability trends', color: 'from-teal-500 to-cyan-600' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Audio Controls */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1.5 sm:gap-2 z-10">
        <button
          onClick={togglePlayPause}
          className="p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur transition"
        >
          {isSpeaking && !isPaused ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        <button
          onClick={toggleMute}
          className="p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur transition"
        >
          {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="h-full flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl w-full my-auto"
          >
            {/* Stage Content */}
            <div className="text-center mb-4 sm:mb-6 md:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-block p-3 sm:p-4 md:p-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-3 sm:mb-4 md:mb-6"
              >
                {stage === 0 && <Users className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />}
                {stage === 1 && <Building2 className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />}
                {stage === 2 && <UserCheck className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />}
                {stage === 3 && <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />}
                {stage === 4 && <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />}
              </motion.div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 px-2">
                {stages[stage].title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-4 sm:mb-6 md:mb-8 px-4">
                {stages[stage].content}
              </p>
            </div>

            {/* Interactive Demonstrations */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-16 sm:mb-20 md:mb-8">
              {stage === 1 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-white text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-center">Click to see what each internal user needs:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    {internalUsers.map((user) => {
                      const Icon = user.icon;
                      return (
                        <button
                          key={user.name}
                          onClick={() => setSelectedUser(user.name)}
                          className={`p-3 sm:p-4 md:p-6 rounded-xl transition ${
                            selectedUser === user.name
                              ? 'bg-white/30 ring-2 ring-white'
                              : 'bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3 text-white" />
                          <div className="text-white font-bold text-sm sm:text-base">{user.name}</div>
                          {selectedUser === user.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-200"
                            >
                              {user.need}
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-center text-white text-xs sm:text-sm mt-4 sm:mt-6 p-3 sm:p-4 bg-green-500/20 rounded-xl">
                    ✅ Internal users work IN the business • Get DETAILED daily reports
                  </div>
                </div>
              )}

              {stage === 2 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-white text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-center">Click to see what each external user needs:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    {externalUsers.map((user) => {
                      const Icon = user.icon;
                      return (
                        <button
                          key={user.name}
                          onClick={() => setSelectedUser(user.name)}
                          className={`p-3 sm:p-4 md:p-6 rounded-xl transition ${
                            selectedUser === user.name
                              ? 'bg-white/30 ring-2 ring-white'
                              : 'bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3 text-white" />
                          <div className="text-white font-bold text-sm sm:text-base">{user.name}</div>
                          {selectedUser === user.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-200"
                            >
                              {user.need}
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-center text-white text-xs sm:text-sm mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-500/20 rounded-xl">
                    🌍 External users work OUTSIDE the business • Get SUMMARIZED annual reports
                  </div>
                </div>
              )}

              {stage === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div className="bg-green-500/20 rounded-xl p-3 sm:p-4 md:p-6">
                      <div className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Internal Users</div>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-start gap-2 text-white text-xs sm:text-sm">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-green-400" />
                          <span>Need DETAILED reports</span>
                        </div>
                        <div className="flex items-start gap-2 text-white text-xs sm:text-sm">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-green-400" />
                          <span>Want FREQUENT updates (daily/weekly)</span>
                        </div>
                        <div className="flex items-start gap-2 text-white text-xs sm:text-sm">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-green-400" />
                          <span>Have FULL ACCESS to all records</span>
                        </div>
                        <div className="flex items-start gap-2 text-white text-xs sm:text-sm">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-green-400" />
                          <span>Make DAILY decisions</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-500/20 rounded-xl p-3 sm:p-4 md:p-6">
                      <div className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">External Users</div>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-start gap-2 text-white text-xs sm:text-sm">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-blue-400" />
                          <span>Need SUMMARIZED reports</span>
                        </div>
                        <div className="flex items-start gap-2 text-white text-xs sm:text-sm">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-blue-400" />
                          <span>Want ANNUAL statements</span>
                        </div>
                        <div className="flex items-start gap-2 text-white text-xs sm:text-sm">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-blue-400" />
                          <span>Have LIMITED ACCESS (published reports only)</span>
                        </div>
                        <div className="flex items-start gap-2 text-white text-xs sm:text-sm">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-blue-400" />
                          <span>Make STRATEGIC decisions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-white p-3 sm:p-4 bg-purple-500/20 rounded-xl">
                    <div className="font-bold mb-1 sm:mb-2 text-sm sm:text-base">Key Insight:</div>
                    <div className="text-xs sm:text-sm">Same business, DIFFERENT reports for DIFFERENT users!</div>
                  </div>
                </div>
              )}

              {(stage === 0 || stage === 4) && (
                <div className="text-center text-white text-sm sm:text-base md:text-lg leading-relaxed">
                  {isSpeaking && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-500/20 rounded-full mb-3 sm:mb-4 text-xs sm:text-sm"
                    >
                      🎤 Teacher is speaking...
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-2 sm:bottom-4 md:bottom-8 left-0 right-0 flex items-center justify-center gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4">
        <button
          onClick={handlePrevious}
          disabled={stage === 0}
          className="p-2 sm:p-3 md:p-4 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur transition disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        <div className="flex gap-1.5 sm:gap-2">
          {stages.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 sm:h-2 rounded-full transition-all ${
                idx === stage ? 'w-6 sm:w-8 bg-white' : 'w-1.5 sm:w-2 bg-white/30'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold transition shadow-lg text-sm sm:text-base"
        >
          {stage === stages.length - 1 ? 'Start Learning' : 'Next'}
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 inline ml-1 sm:ml-2" />
        </button>
      </div>
    </div>
  );
};

export default UsersOfInformationIntro;
