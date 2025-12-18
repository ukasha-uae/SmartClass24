'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Calculator, TrendingUp, FileText, DollarSign, ArrowRight, BookOpen, Building2, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '@/hooks/useLocalization';

interface LessonIntroProps {
  onComplete?: () => void;
}

const AccountingDefinitionIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const { country, localizeContent } = useLocalization();
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  const profit = revenue - expenses;
  const countryName = country?.name || 'Ghana';
  const currencySymbol = country?.currency?.symbol || '₵';

  const stages = [
    {
      title: "📚 Welcome to Financial Accounting!",
      content: `The language of business - essential for every entrepreneur in ${countryName}!`,
      narration: `Welcome, future business leaders! Today we begin an exciting journey into Financial Accounting - the language of business! Whether you dream of running your own provision shop in Makola Market, managing a bank like Ecobank, or building the next big tech startup in ${countryName}, accounting is your ESSENTIAL tool. Every successful business from small chop bars to MTN ${countryName} relies on accounting to track money, make decisions, and grow. By the end of this lesson, you will understand why accounting is called the backbone of every business!`,
      highlightWords: ['Financial Accounting', 'language of business', 'entrepreneur', 'Makola Market', 'bank', countryName]
    },
    {
      title: "🔍 What is Accounting?",
      content: "Recording, classifying, and analyzing financial transactions",
      narration: `So what exactly is accounting? Think of it as keeping a detailed diary of ALL the money coming in and going out of a business. The official definition says accounting is the systematic process of recording, classifying, summarizing, analyzing, and interpreting financial transactions. Let me break that down! Recording means writing down EVERY sale, purchase, payment. Classifying means organizing them into categories. Summarizing creates totals. Analyzing finds patterns. And interpreting explains what it all means! Watch the demonstration - see how each transaction gets recorded and builds up a complete financial picture!`,
      highlightWords: ['accounting', 'recording', 'classifying', 'summarizing', 'analyzing', 'interpreting', 'transactions']
    },
    {
      title: "💼 The Accounting Equation",
      content: "Assets = Liabilities + Capital",
      narration: `Now here is the FOUNDATION of all accounting - the Accounting Equation! Assets equals Liabilities plus Capital. This simple equation never breaks! Assets are what the business OWNS - cash, inventory, equipment. Liabilities are what it OWES to others - loans, debts. Capital is the owner's investment. Every transaction affects this equation, but it always stays balanced! If you buy inventory for cash, your assets stay the same but change form. If you borrow money, both assets and liabilities increase equally. Understanding this equation is like understanding gravity in physics - it is the fundamental law!`,
      highlightWords: ['Accounting Equation', 'Assets', 'Liabilities', 'Capital', 'owns', 'owes', 'balanced']
    },
    {
      title: "💰 Profit vs Loss",
      content: "The ultimate question: Is the business making money?",
      narration: `Every business owner wants to know ONE thing - are we making money or losing it? This is where accounting shines! We compare Revenue with Expenses. Revenue is money earned from sales. Expenses are costs of running the business. If revenue is GREATER than expenses - congratulations, you have PROFIT! Your business is successful. But if expenses exceed revenue - you have a LOSS. The business is losing money. Try the interactive calculator! Adjust revenue and expenses to see profit or loss. In ${countryName}, the Ghana Revenue Authority uses these numbers to calculate taxes. Master this and you master business success!`,
      highlightWords: ['Profit', 'Loss', 'Revenue', 'Expenses', 'making money', 'successful business', 'Ghana Revenue Authority']
    },
    {
      title: "🎯 Why Accounting Matters",
      content: "Decision making, legal compliance, and preventing fraud",
      narration: `Why is accounting so important? Three BIG reasons! First, DECISION MAKING - should we expand? Can we afford new equipment? Accounting provides the data to decide confidently. Second, LEGAL COMPLIANCE - in ${countryName}, the Companies Act requires proper records. The GRA needs accurate information for taxes. Good accounting keeps you legal! Third, FRAUD PREVENTION - systematic records make it hard for dishonest people to steal. When every cedi is tracked, theft gets caught! Plus accounting helps attract investors, get loans from banks, and plan for growth. It truly is the backbone of business!`,
      highlightWords: ['decision making', 'legal compliance', 'fraud prevention', 'GRA', 'investors', 'backbone of business']
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

  const addTransaction = (type: 'revenue' | 'expense') => {
    setTransactionCount(transactionCount + 1);
    if (type === 'revenue') {
      setRevenue(revenue + Math.floor(Math.random() * 500) + 100);
    } else {
      setExpenses(expenses + Math.floor(Math.random() * 300) + 50);
    }
  };

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
      <div className="h-full flex flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl w-full"
          >
            {/* Stage Content */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-block p-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-6"
              >
                {stage === 0 && <BookOpen className="w-16 h-16 text-white" />}
                {stage === 1 && <FileText className="w-16 h-16 text-white" />}
                {stage === 2 && <Calculator className="w-16 h-16 text-white" />}
                {stage === 3 && <TrendingUp className="w-16 h-16 text-white" />}
                {stage === 4 && <Building2 className="w-16 h-16 text-white" />}
              </motion.div>
              
              <h1 className="text-5xl font-bold text-white mb-4">
                {stages[stage].title}
              </h1>
              <p className="text-2xl text-gray-200 mb-8">
                {stages[stage].content}
              </p>
            </div>

            {/* Interactive Demonstrations */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8">
              {stage === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => addTransaction('revenue')}
                      className="p-6 bg-green-500/20 hover:bg-green-500/30 rounded-xl text-white transition"
                    >
                      <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center text-3xl font-bold">{currencySymbol}</div>
                      <div className="text-sm">Record Sale</div>
                    </button>
                    <button
                      onClick={() => addTransaction('expense')}
                      className="p-6 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-white transition"
                    >
                      <FileText className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm">Record Expense</div>
                    </button>
                  </div>
                  <div className="text-center text-white">
                    <div className="text-4xl font-bold">{transactionCount}</div>
                    <div className="text-sm opacity-80">Transactions Recorded</div>
                  </div>
                </div>
              )}

              {stage === 2 && (
                <div className="space-y-6">
                  <div className="text-center text-white text-3xl font-bold">
                    Assets = Liabilities + Capital
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-500/20 rounded-xl p-6">
                      <div className="text-white text-lg">Assets</div>
                      <div className="text-white text-3xl font-bold mt-2">{currencySymbol}10,000</div>
                    </div>
                    <div className="text-white text-4xl flex items-center justify-center">=</div>
                    <div className="space-y-2">
                      <div className="bg-orange-500/20 rounded-xl p-4">
                        <div className="text-white text-sm">Liabilities</div>
                        <div className="text-white text-2xl font-bold">{currencySymbol}3,000</div>
                      </div>
                      <div className="bg-green-500/20 rounded-xl p-4">
                        <div className="text-white text-sm">Capital</div>
                        <div className="text-white text-2xl font-bold">{currencySymbol}7,000</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {stage === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/20 rounded-xl p-6">
                      <div className="text-white text-sm mb-2">Revenue</div>
                      <div className="text-white text-4xl font-bold">{currencySymbol}{revenue}</div>
                    </div>
                    <div className="bg-red-500/20 rounded-xl p-6">
                      <div className="text-white text-sm mb-2">Expenses</div>
                      <div className="text-white text-4xl font-bold">{currencySymbol}{expenses}</div>
                    </div>
                  </div>
                  <div className={`text-center p-6 rounded-xl ${profit >= 0 ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
                    <div className="text-white text-lg mb-2">{profit >= 0 ? '🎉 Profit!' : '⚠️ Loss'}</div>
                    <div className="text-white text-5xl font-bold">{currencySymbol}{Math.abs(profit)}</div>
                  </div>
                  <button
                    onClick={() => addTransaction(Math.random() > 0.5 ? 'revenue' : 'expense')}
                    className="w-full py-4 bg-white/20 hover:bg-white/30 rounded-xl text-white transition"
                  >
                    Add Random Transaction
                  </button>
                </div>
              )}

              {(stage === 0 || stage === 4) && (
                <div className="text-center text-white text-lg leading-relaxed">
                  {isSpeaking && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="inline-block px-4 py-2 bg-yellow-500/20 rounded-full mb-4"
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
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={stage === 0}
          className="p-4 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur transition disabled:opacity-30"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex gap-2">
          {stages.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === stage ? 'w-8 bg-white' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold transition shadow-lg"
        >
          {stage === stages.length - 1 ? 'Start Learning' : 'Next'}
          <ArrowRight className="w-5 h-5 inline ml-2" />
        </button>
      </div>
    </div>
  );
};

export default AccountingDefinitionIntro;
