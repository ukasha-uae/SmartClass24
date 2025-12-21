'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GitBranch, FileText, Calculator, Scale, Search, ArrowRight, CheckCircle, TrendingUp, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Building2, Briefcase, DollarSign, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '@/hooks/useLocalization';

interface LessonIntroProps {
  onComplete?: () => void;
}

const BranchesOfAccountingIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
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
  const professionalBody = localizeContent('{{business:accounting-body}}') || 'ICAG';
  const majorFirm = localizeContent('{{business:audit-firm}}') || 'KPMG';
  const majorCity = localizeContent('{{city:major}}') || 'Accra';
  const capitalCity = localizeContent('{{city:capital}}') || 'Accra';
  const telecomCompany = localizeContent('{{business:company:1}}') || 'MTN';

  const stages = [
    {
      title: "🌳 The Accounting Family Tree",
      content: `Accounting is like a big tree with many branches - each serving different purposes!`,
      narration: `Welcome to an exciting exploration of accounting's many faces! You know what? When people say "I want to be an accountant," they're actually saying "I want to be ONE TYPE of accountant" - because accounting has MANY specialized branches, just like medicine has pediatricians, surgeons, and dentists! In ${countryName}, you could work as a Financial Accountant preparing company reports, a Tax Consultant helping businesses comply with ${taxAuthority} regulations, an Auditor verifying financial records at firms like ${majorFirm}, or a Management Accountant advising business owners on decisions! Each branch has its own focus, its own exciting challenges, and its own career path. Some accountants work with external reports, others with internal planning. Some hunt for fraud, others optimize costs! By understanding these branches, you'll discover where YOUR passion lies in this diverse profession. Let's explore this accounting family tree together!`,
      highlightWords: ['branches', 'specialized', 'Financial Accountant', 'Tax Consultant', 'Auditor', 'Management Accountant', 'career path']
    },
    {
      title: "📊 Financial Accounting",
      content: "The branch YOU'RE studying - preparing reports for external users!",
      narration: `Let's start with Financial Accounting - the subject of THIS course! This is the branch that prepares financial statements for EXTERNAL users - investors, banks, ${taxAuthority}, shareholders. Think about ${telecomCompany} ${countryName} publishing its annual report - that's financial accounting! When a company in ${countryName} wants a bank loan, the bank asks for audited financial statements - that's financial accounting! This branch follows STRICT rules - in ${countryName}, we use International Financial Reporting Standards, IFRS. Why? Because external users need COMPARABLE information! If every company used different rules, investors couldn't compare Company A with Company B! Financial accountants prepare three main statements: the Income Statement showing profit or loss, the Balance Sheet showing what the business owns and owes, and the Cash Flow Statement tracking money movement. This information is PUBLISHED - anyone can access it! It helps investors decide where to invest, helps ${taxAuthority} calculate taxes, helps banks assess loan applications. Financial accounting is about TRANSPARENCY and TRUST!`,
      highlightWords: ['Financial Accounting', 'external users', 'financial statements', 'IFRS', 'Income Statement', 'Balance Sheet', 'Cash Flow Statement', 'transparency']
    },
    {
      title: "💼 Management Accounting",
      content: "Internal accounting that helps managers make smart business decisions!",
      narration: `Now let's talk about Management Accounting - the INTERNAL cousin of financial accounting! This branch serves ONE audience - the company's OWN managers and owners. It's NOT published, NOT shared with outsiders, NOT governed by IFRS rules! Why? Because it contains COMPETITIVE secrets! Imagine a chop bar owner in ${majorCity} asking: "Should I add fried rice to my menu? Which products make the most profit? Can I afford to hire another worker?" Management accounting answers these questions! It prepares BUDGETS - planning how much to spend next month. It does COST ANALYSIS - calculating exactly how much each product costs to make. It creates VARIANCE REPORTS - comparing actual results to the budget. "We planned to spend ${currencySymbol}5,000 on ingredients but spent ${currencySymbol}6,500 - why?" Management accountants dig into these details! They help with PRICING decisions - "If we charge ${currencySymbol}20 per plate, we need to sell 50 plates daily to break even." They support STRATEGIC planning - "Should we open a second location? Buy a delivery van? Expand the menu?" Unlike financial accounting's yearly reports, management accounting provides information DAILY, WEEKLY, whenever managers need it! It's about DECISION SUPPORT!`,
      highlightWords: ['Management Accounting', 'internal', 'budgets', 'cost analysis', 'pricing decisions', 'strategic planning', 'decision support', 'competitive secrets']
    },
    {
      title: "🔍 Cost Accounting",
      content: "Tracking every cedi spent to make products efficiently!",
      narration: `Cost Accounting is a FASCINATING specialized branch! It focuses on one question: "How much does it REALLY cost to make this product?" In ${countryName}, manufacturing companies NEED cost accountants! Imagine a furniture factory in ${capitalCity}. To make one table, they need wood, nails, glue, worker wages, electricity, machine depreciation - cost accountants track ALL of this! They calculate: "One table costs ${currencySymbol}280 to make - ${currencySymbol}150 for materials, ${currencySymbol}80 for labor, ${currencySymbol}50 for overhead." This helps the owner set prices! If it costs ${currencySymbol}280 to make, you CAN'T sell for ${currencySymbol}250 - you'll lose money! Cost accountants also find WASTE - "We're throwing away 15 percent of wood as scraps - can we reduce that?" They compare different production methods - "Hand-making takes 4 hours per table, machine-making takes 1 hour - which is cheaper?" They help managers control costs and improve efficiency. Every successful manufacturer in ${countryName} relies on cost accounting!`,
      highlightWords: ['Cost Accounting', 'product cost', 'materials', 'labor', 'overhead', 'pricing', 'waste', 'efficiency', 'manufacturing']
    },
    {
      title: "💰 Tax Accounting & 🔎 Auditing",
      content: "Ensuring compliance and verifying accuracy!",
      narration: `Let's discuss TWO more critical branches! First, TAX ACCOUNTING - this branch focuses on tax compliance and planning! Every business in ${countryName} must file tax returns with ${taxAuthority}. Tax accountants ensure this is done CORRECTLY and on TIME! They calculate income tax, VAT, withholding tax, capital gains tax - ${countryName} has many types! But tax accountants don't just file returns - they also do TAX PLANNING. "If we buy equipment this year instead of next year, we'll save ${currencySymbol}50,000 in taxes because of the depreciation allowance!" They help businesses minimize tax LEGALLY. Tax laws are complex and always changing - tax accountants must stay updated! Now, AUDITING - this is about VERIFICATION! When a company prepares financial statements, auditors examine them to ensure they're ACCURATE and follow accounting standards. At firms like ${majorFirm} in ${countryName}, auditors visit companies, check their records, verify their numbers, and issue an audit report saying "These statements are reliable" or "We found problems!" Banks and investors DEMAND audited statements because they provide ASSURANCE. Auditors are like financial detectives - they investigate, question, verify everything!`,
      highlightWords: ['Tax Accounting', taxAuthority, 'tax compliance', 'tax planning', 'VAT', 'Auditing', 'verification', majorFirm, 'audit report', 'assurance']
    },
    {
      title: "🎯 Choose Your Path!",
      content: "So many exciting career opportunities in accounting!",
      narration: `Now you understand - accounting isn't ONE job, it's MANY careers! And here's the exciting part - you can specialize in what YOU love! Do you enjoy working with rules and external reporting? Financial accounting is for you! Love helping businesses make decisions and strategize? Try management accounting! Fascinated by manufacturing and cost control? Cost accounting awaits! Good with tax laws and regulations? Become a tax consultant! Want to investigate and verify? Auditing is your calling! In ${countryName}, ALL these branches are in HIGH demand! The ${professionalBody} - Institute of Chartered Accountants of ${countryName} - trains accountants in all these areas. You can work at BIG firms like ${majorFirm}, at banks and corporations, for government agencies, or start your own practice! The beauty is this: start with financial accounting foundations - that's what we're learning now - then SPECIALIZE later based on your interests! Some accountants even combine branches - a cost and management accountant, or a tax and audit specialist! The accounting profession offers FLEXIBILITY, VARIETY, and EXCELLENT career prospects in ${countryName}'s growing economy. Master the fundamentals now, explore the branches, then choose YOUR path to success!`,
      highlightWords: ['career opportunities', 'specialize', professionalBody, majorFirm, 'foundations', 'flexibility', 'variety', 'growing economy']
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

  const accountingBranches = [
    { 
      name: 'Financial', 
      icon: FileText, 
      focus: 'External reporting', 
      example: 'Preparing annual reports',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      name: 'Management', 
      icon: TrendingUp, 
      focus: 'Internal decisions', 
      example: 'Budgeting & forecasting',
      color: 'from-purple-500 to-pink-600'
    },
    { 
      name: 'Cost', 
      icon: Calculator, 
      focus: 'Product costing', 
      example: 'Manufacturing cost analysis',
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      name: 'Tax', 
      icon: DollarSign, 
      focus: 'Tax compliance', 
      example: `Filing with ${taxAuthority}`,
      color: 'from-yellow-500 to-amber-600'
    },
    { 
      name: 'Auditing', 
      icon: Search, 
      focus: 'Verification', 
      example: 'Checking financial accuracy',
      color: 'from-red-500 to-orange-600'
    },
    { 
      name: 'Forensic', 
      icon: ShieldAlert, 
      focus: 'Fraud investigation', 
      example: 'Detecting financial crimes',
      color: 'from-teal-500 to-cyan-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 overflow-hidden">
      {/* Audio Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={togglePlayPause}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur transition"
        >
          {isSpeaking && !isPaused ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={toggleMute}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur transition"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl w-full"
          >
            {/* Stage Content */}
            <div className="text-center mb-6 md:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-block p-4 md:p-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4 md:mb-6"
              >
                {stage === 0 && <GitBranch className="w-12 h-12 md:w-16 md:h-16 text-white" />}
                {stage === 1 && <FileText className="w-12 h-12 md:w-16 md:h-16 text-white" />}
                {stage === 2 && <Briefcase className="w-12 h-12 md:w-16 md:h-16 text-white" />}
                {stage === 3 && <Calculator className="w-12 h-12 md:w-16 md:h-16 text-white" />}
                {stage === 4 && <Scale className="w-12 h-12 md:w-16 md:h-16 text-white" />}
                {stage === 5 && <Building2 className="w-12 h-12 md:w-16 md:h-16 text-white" />}
              </motion.div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 px-2">
                {stages[stage].title}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8 px-4">
                {stages[stage].content}
              </p>
            </div>

            {/* Interactive Demonstrations */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
              {stage === 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {accountingBranches.map((branch, index) => {
                    const Icon = branch.icon;
                    return (
                      <motion.button
                        key={branch.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedBranch(branch.name)}
                        className={`p-3 md:p-4 rounded-xl transition ${
                          selectedBranch === branch.name
                            ? 'bg-white/30 ring-2 ring-white'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        <Icon className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 text-white" />
                        <div className="text-white font-bold text-xs sm:text-sm">{branch.name}</div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {stage === 1 && (
                <div className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    <div className="bg-green-500/20 rounded-xl p-4 md:p-6 text-center">
                      <FileText className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 text-white" />
                      <div className="text-white font-bold mb-1 md:mb-2 text-sm md:text-base">Income Statement</div>
                      <div className="text-xs md:text-sm text-gray-200">Shows profit/loss</div>
                    </div>
                    <div className="bg-blue-500/20 rounded-xl p-4 md:p-6 text-center">
                      <Scale className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 text-white" />
                      <div className="text-white font-bold mb-1 md:mb-2 text-sm md:text-base">Balance Sheet</div>
                      <div className="text-xs md:text-sm text-gray-200">Assets & liabilities</div>
                    </div>
                    <div className="bg-purple-500/20 rounded-xl p-4 md:p-6 text-center">
                      <TrendingUp className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 text-white" />
                      <div className="text-white font-bold mb-1 md:mb-2 text-sm md:text-base">Cash Flow</div>
                      <div className="text-xs md:text-sm text-gray-200">Money movement</div>
                    </div>
                  </div>
                  <div className="text-center text-white p-3 md:p-4 bg-green-500/20 rounded-xl">
                    <div className="font-bold mb-1 text-sm md:text-base">Key Point:</div>
                    <div className="text-xs md:text-sm">External users • IFRS standards • Published reports</div>
                  </div>
                </div>
              )}

              {stage === 2 && (
                <div className="space-y-4">
                  <div className="text-white text-base md:text-lg font-semibold mb-4 text-center">What Management Accountants Do:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-4 bg-purple-500/20 rounded-xl">
                      <CheckCircle className="w-6 h-6 flex-shrink-0 text-purple-400" />
                      <div className="text-white text-sm">Prepare monthly budgets for departments</div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-purple-500/20 rounded-xl">
                      <CheckCircle className="w-6 h-6 flex-shrink-0 text-purple-400" />
                      <div className="text-white text-sm">Analyze product profitability</div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-purple-500/20 rounded-xl">
                      <CheckCircle className="w-6 h-6 flex-shrink-0 text-purple-400" />
                      <div className="text-white text-sm">Support pricing decisions</div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-purple-500/20 rounded-xl">
                      <CheckCircle className="w-6 h-6 flex-shrink-0 text-purple-400" />
                      <div className="text-white text-sm">Help with strategic planning</div>
                    </div>
                  </div>
                  <div className="text-center text-white p-3 md:p-4 bg-purple-500/20 rounded-xl">
                    <div className="font-bold mb-1 text-sm md:text-base">Remember:</div>
                    <div className="text-xs md:text-sm">Internal users only • NO IFRS rules • Confidential info</div>
                  </div>
                </div>
              )}

              {stage === 3 && (
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-blue-500/20 rounded-xl p-4 md:p-6">
                    <div className="text-white font-bold text-center mb-3 md:mb-4 text-sm md:text-base">Example: Table Manufacturing</div>
                    <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
                      <div>
                        <div className="text-2xl md:text-3xl font-bold text-blue-400">{currencySymbol}150</div>
                        <div className="text-xs md:text-sm text-gray-200 mt-1">Materials</div>
                      </div>
                      <div>
                        <div className="text-2xl md:text-3xl font-bold text-green-400">{currencySymbol}80</div>
                        <div className="text-xs md:text-sm text-gray-200 mt-1">Labor</div>
                      </div>
                      <div>
                        <div className="text-2xl md:text-3xl font-bold text-purple-400">{currencySymbol}50</div>
                        <div className="text-xs md:text-sm text-gray-200 mt-1">Overhead</div>
                      </div>
                    </div>
                    <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/20 text-center">
                      <div className="text-white text-base md:text-lg">Total Cost: <span className="font-bold text-xl md:text-2xl text-yellow-400">{currencySymbol}280</span></div>
                    </div>
                  </div>
                  <div className="text-center text-white text-xs md:text-sm p-3 md:p-4 bg-blue-500/20 rounded-xl">
                    💡 If cost is {currencySymbol}280, selling price must be higher to make profit!
                  </div>
                </div>
              )}

              {stage === 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-yellow-500/20 rounded-xl p-4 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <DollarSign className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
                      <div className="text-white font-bold text-base md:text-lg">Tax Accounting</div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-200">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 text-yellow-400 mt-0.5" />
                        <span>File tax returns with {taxAuthority}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 text-yellow-400 mt-0.5" />
                        <span>Calculate income tax, VAT, WHT</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 text-yellow-400 mt-0.5" />
                        <span>Plan to minimize tax legally</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-500/20 rounded-xl p-4 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <Search className="w-8 h-8 md:w-10 md:h-10 text-red-400" />
                      <div className="text-white font-bold text-base md:text-lg">Auditing</div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-200">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                        <span>Verify financial statements</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                        <span>Ensure IFRS compliance</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                        <span>Issue audit opinion report</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {stage === 5 && (
                <div className="space-y-4">
                  <div className="text-white text-lg font-semibold mb-4 text-center">Career Paths in {countryName}:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div className="bg-white/10 rounded-xl p-4 text-white">
                      <div className="font-bold mb-2 text-base">🏢 Big Firms</div>
                      <div className="text-gray-200 text-sm leading-relaxed">{majorFirm}, Deloitte, PwC, EY</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-white">
                      <div className="font-bold mb-2 text-base">🏦 Banks & Corporations</div>
                      <div className="text-gray-200 text-sm leading-relaxed">Internal accounting departments</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-white">
                      <div className="font-bold mb-2 text-base">🏛️ Government</div>
                      <div className="text-gray-200 text-sm leading-relaxed">{taxAuthority}, Controller & Accountant General</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-white">
                      <div className="font-bold mb-2 text-base">👔 Private Practice</div>
                      <div className="text-gray-200 text-sm leading-relaxed">Start your own accounting firm!</div>
                    </div>
                  </div>
                  <div className="text-center text-white p-4 bg-green-500/20 rounded-xl">
                    <div className="font-bold mb-1">🎓 Professional Body:</div>
                    <div className="text-sm">{professionalBody} trains accountants across all branches!</div>
                  </div>
                </div>
              )}

              {isSpeaking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-4"
                >
                  <div className="inline-block px-4 py-2 bg-yellow-500/20 rounded-full text-white text-sm">
                    🎤 Teacher is speaking...
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex items-center justify-center gap-2 md:gap-4 px-4">
        <button
          onClick={handlePrevious}
          disabled={stage === 0}
          className="p-3 md:p-4 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur transition disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        
        <div className="flex gap-1.5 md:gap-2">
          {stages.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 md:h-2 rounded-full transition-all ${
                idx === stage ? 'w-6 md:w-8 bg-white' : 'w-1.5 md:w-2 bg-white/30'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="px-6 md:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold transition shadow-lg text-sm md:text-base"
        >
          {stage === stages.length - 1 ? 'Start Learning' : 'Next'}
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 inline ml-1 md:ml-2" />
        </button>
      </div>
    </div>
  );
};

export default BranchesOfAccountingIntro;
