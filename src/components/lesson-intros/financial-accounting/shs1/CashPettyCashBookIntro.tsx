'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Wallet, BookOpen, Coins, ShoppingBag, ChevronLeft, ChevronRight, CheckCircle, Sparkles, Play, Pause, Volume2, VolumeX, XCircle, TrendingUp, Calendar, DollarSign, CreditCard, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '@/hooks/useLocalization';

interface LessonIntroProps {
  onComplete?: () => void;
}

const CashPettyCashBookIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const { country, localizeContent } = useLocalization();
  
  const countryName = country?.name || 'Ghana';
  const currencySymbol = country?.currency?.symbol || '₵';

  // Interactive states
  const [bookChoice, setBookChoice] = useState<'cash' | 'petty' | null>(null);
  const [classifiedTxns, setClassifiedTxns] = useState<Record<number, string | null>>({});
  const [revealedTypes, setRevealedTypes] = useState<Set<number>>(new Set());
  const [recordedExpenses, setRecordedExpenses] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  
  // Audio states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  const stages = [
    {
      title: "💰 The Lifeblood of Business",
      icon: Wallet,
      content: `Every business needs to track CASH—money coming in and going out. This is where the Cash Book comes in!`,
      narration: `Welcome to one of the most practical and important topics in accounting - the Cash Book and Petty Cash Book! Let me tell you why these books are absolutely crucial for every business in ${countryName}. Cash is the LIFEBLOOD of any business. Without proper cash tracking, a business can't survive. The Cash Book is where we record ALL cash and bank transactions. Every cedi that comes into your business, every cedi that goes out - it ALL passes through the Cash Book. What makes the Cash Book special is that it's unique in accounting. It serves BOTH as a book of original entry - where transactions are first recorded - AND as a ledger account - part of the double entry system. This dual function makes it super efficient! From the smallest street vendor to the biggest bank in ${countryName}, everyone needs to track cash carefully. In this lesson, you'll learn how to prepare different types of cash books - Single Column, Two-Column with discounts, and Three-Column with cash, bank, and discount. You'll also master the Petty Cash Book for handling small everyday expenses like transport fares, office supplies, and refreshments. By the end, you'll be able to track every cedi like a professional accountant! Let's start this journey!`,
      highlight: "The Cash Book is BOTH a book of original entry AND a ledger account—that makes it unique!",
      highlightWords: [countryName, currencySymbol, 'Cash Book', 'book of original entry', 'ledger account'],
      color: "from-blue-500 to-indigo-600",
      interactive: 'book-choice'
    },
    {
      title: "📘 The Cash Book Explained",
      icon: BookOpen,
      content: `The Cash Book records all receipts (money in) and payments (money out) through cash and bank. It's your financial diary!`,
      narration: `Now let me explain the Cash Book in detail. The Cash Book is organized like a traditional T-account with two sides. On the LEFT side, we record all RECEIPTS - money coming IN. This is called the debit side. On the RIGHT side, we record all PAYMENTS - money going OUT. This is called the credit side. Simple and logical! There are different types of Cash Books for different business needs. First, the SINGLE COLUMN Cash Book - this is the simplest type. It has just one money column on each side for recording cash transactions only. No bank transactions, no discounts. Just cash in and cash out. Second, the TWO-COLUMN or DOUBLE COLUMN Cash Book - this has two columns on each side: one for cash and one for discounts. Discounts allowed to customers are on the debit side, discounts received from suppliers are on the credit side. Third, the THREE-COLUMN Cash Book - this is the most complete type. It has three columns on each side: cash, bank, and discount. You can track cash transactions, bank transactions, and discounts all in one book! This is what most businesses in ${countryName} use. The Cash Book also handles CONTRA ENTRIES - these are transfers between cash and bank, like when you deposit cash into the bank or withdraw cash from the bank. Both sides get recorded! Understanding these different types helps you choose the right Cash Book for any business!`,
      highlightWords: [countryName, 'receipts', 'payments', 'debit', 'credit', 'contra entries'],
      color: "from-green-500 to-emerald-600",
      transactions: [
        { id: 0, description: `Received ${currencySymbol}5,000 cash from customer Kofi`, side: 'Debit (Receipts)' },
        { id: 1, description: `Paid ${currencySymbol}2,000 cash for rent`, side: 'Credit (Payments)' },
        { id: 2, description: `Deposited ${currencySymbol}3,000 cash into bank`, side: 'Both (Contra Entry)' },
        { id: 3, description: `Received ${currencySymbol}4,000 from Ama by cheque`, side: 'Debit (Receipts)' }
      ],
      interactive: 'classify-transactions'
    },
    {
      title: "📗 Types of Cash Books",
      icon: CreditCard,
      content: `From simple Single Column to comprehensive Three-Column Cash Books—learn which type suits different business needs!`,
      narration: `Let me teach you about the different types of Cash Books in more detail, so you know when to use each type. The SINGLE COLUMN Cash Book is perfect for small businesses that deal only in cash and don't have bank accounts yet. Maybe a small provision store or a market vendor in ${countryName}. They just need one column for cash receipts and one column for cash payments. Very straightforward! The TWO-COLUMN or DOUBLE COLUMN Cash Book adds discount columns. Why? Because businesses often give discounts to customers who pay quickly - this is called discount allowed. And businesses receive discounts from suppliers when they pay early - this is called discount received. Having separate discount columns lets you track these important amounts. The discount columns are NOT part of the cash or bank - they're just memorandum columns showing how much discount was involved in each transaction. Now, the THREE-COLUMN Cash Book is the most comprehensive and most commonly used. It has cash, bank, and discount columns on BOTH sides. This book lets you record cash transactions, bank transactions with cheques and deposits, and all discounts in one integrated book! When you deposit cash into the bank or withdraw cash from the bank, you use CONTRA ENTRIES - you write "C" for contra on both sides. This shows it's an internal transfer, not money coming from outside or going outside. Most medium and large businesses in ${countryName} use the three-column cash book because it gives complete cash and bank control!`,
      highlightWords: [countryName, 'Single Column', 'Two-Column', 'Three-Column', 'discount allowed', 'discount received'],
      color: "from-purple-500 to-pink-600",
      types: [
        { 
          id: 0,
          icon: Banknote,
          title: "Single Column Cash Book",
          columns: "1 cash column per side",
          detail: "Simplest type - only records cash transactions. No bank, no discounts. Perfect for small cash-only businesses like market vendors."
        },
        { 
          id: 1,
          icon: DollarSign,
          title: "Two-Column Cash Book",
          columns: "Cash + Discount columns",
          detail: "Adds discount columns to track discounts allowed to customers and discounts received from suppliers. Still no bank column."
        },
        { 
          id: 2,
          icon: CreditCard,
          title: "Three-Column Cash Book",
          columns: "Cash + Bank + Discount",
          detail: "Most complete! Records cash, bank (cheques/deposits), and discounts all together. Used by most medium and large businesses."
        }
      ],
      interactive: 'reveal-types'
    },
    {
      title: "🪙 The Petty Cash Book",
      icon: Coins,
      content: `Small expenses like transport, stationery, and tea—they all go in the Petty Cash Book using the Imprest System!`,
      narration: `Now let's talk about the Petty Cash Book - a very practical tool for managing small expenses. Imagine you're running a business. Every day, you have small expenses - transport fare for the messenger, stationery for the office, tea and biscuits for visitors, postage stamps, cleaning supplies. These are PETTY expenses - small, routine expenses. If you recorded each of these tiny amounts in the main Cash Book, it would become cluttered and messy! That's why we have the Petty Cash Book. The Petty Cash Book is maintained by a Petty Cashier - a junior employee who handles these small payments. The main Cashier gives the Petty Cashier a fixed amount at the beginning of each period - let's say five hundred cedis. This fixed amount is called the IMPREST. The Petty Cashier pays out small expenses during the period and records them in the Petty Cash Book with ANALYSIS COLUMNS - different columns for different types of expenses like transport, stationery, refreshments, cleaning, postage. At the end of the period, let's say the Petty Cashier spent three hundred cedis. The main Cashier gives the Petty Cashier exactly three hundred cedis to restore the imprest back to five hundred cedis. That's the IMPREST SYSTEM! It's brilliant because the Petty Cashier always starts each period with the same fixed amount, making cash control easy. Most businesses in ${countryName} use this system to manage small expenses efficiently while keeping the main Cash Book clean and focused on bigger transactions!`,
      highlightWords: [countryName, currencySymbol, 'Petty Cash Book', 'Imprest System', 'analysis columns', 'Petty Cashier'],
      color: "from-orange-500 to-red-600",
      expenses: [
        { 
          id: 0,
          icon: ShoppingBag,
          date: 'Jan 3',
          description: 'Transport for messenger',
          amount: 'twenty cedis',
          category: 'Transport'
        },
        { 
          id: 1,
          icon: BookOpen,
          date: 'Jan 5',
          description: 'Office stationery',
          amount: 'fifty cedis',
          category: 'Stationery'
        },
        { 
          id: 2,
          icon: Coins,
          date: 'Jan 8',
          description: 'Tea and biscuits for visitors',
          amount: 'thirty cedis',
          category: 'Refreshments'
        }
      ],
      interactive: 'record-expenses'
    },
    {
      title: "🚀 Master Cash Books!",
      icon: Sparkles,
      content: `Test your understanding of Cash Books and Petty Cash Books with this final quiz!`,
      narration: `Excellent progress! You've learned so much about Cash Books and Petty Cash Books. Let me review what you now know. You understand that the Cash Book is BOTH a book of original entry AND a ledger account - it has this unique dual function. You know the three types of Cash Books: Single Column for cash only, Two-Column adding discounts, and Three-Column with cash, bank, and discounts - the most complete version. You understand that receipts go on the debit side, payments go on the credit side. You've learned about contra entries when transferring money between cash and bank. You also understand the Petty Cash Book now - it handles small expenses using the Imprest System, with analysis columns to categorize different types of petty expenses. The Petty Cashier receives a fixed imprest amount and gets reimbursed for whatever was spent. This system keeps the main Cash Book clean while properly controlling small expenses. These skills are essential for anyone working in business or accounting in ${countryName}! Now let's test your understanding with five key questions. Think carefully about each one. Remember: Cash Book tracks ALL cash and bank, Petty Cash Book tracks SMALL expenses. Cash Book is a ledger account, Petty Cash Book uses the Imprest System. Both must balance correctly at the end of each period. Let's see how well you've grasped these concepts! After this quiz, you'll dive into the detailed lesson with lots of practice preparing actual cash books!`,
      highlightWords: [countryName, 'Cash Book', 'Petty Cash Book', 'Imprest System', 'dual function'],
      color: "from-teal-500 to-cyan-600",
      quizQuestions: [
        { question: "The Cash Book serves both as a book of original entry and a ledger account", correct: true },
        { question: "Petty Cash Book is maintained by the main Cashier", correct: false },
        { question: "The Imprest System restores petty cash to a fixed amount each period", correct: true },
        { question: "Contra entries are transfers between cash and bank within the Cash Book", correct: true },
        { question: "All business expenses should be recorded in the Petty Cash Book", correct: false }
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

  // Auto-speak narration when stage changes
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
    setBookChoice(null);
    setClassifiedTxns({});
    setRevealedTypes(new Set());
    setRecordedExpenses(new Set());
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
    setBookChoice(null);
    setClassifiedTxns({});
    setRevealedTypes(new Set());
    setRecordedExpenses(new Set());
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

                {/* Interactive: Book Choice (Stage 0) */}
                {currentStage.interactive === 'book-choice' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 sm:mt-8"
                  >
                    <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                      👆 Which book tracks ALL cash and bank transactions?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setBookChoice('cash')}
                        className={`p-4 sm:p-6 rounded-xl font-medium text-sm sm:text-base transition-all border-2 ${
                          bookChoice === 'cash'
                            ? 'bg-green-500/30 border-green-400 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-gray-200 border-transparent'
                        }`}
                      >
                        <div className="text-2xl mb-2">💰</div>
                        <div className="font-bold mb-1">Cash Book</div>
                        <div className="text-xs sm:text-sm opacity-80">Records all cash & bank transactions</div>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setBookChoice('petty')}
                        className={`p-4 sm:p-6 rounded-xl font-medium text-sm sm:text-base transition-all border-2 ${
                          bookChoice === 'petty'
                            ? 'bg-red-500/30 border-red-400 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-gray-200 border-transparent'
                        }`}
                      >
                        <div className="text-2xl mb-2">🪙</div>
                        <div className="font-bold mb-1">Petty Cash Book</div>
                        <div className="text-xs sm:text-sm opacity-80">Records small daily expenses only</div>
                      </motion.button>
                    </div>
                    
                    {bookChoice && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`mt-4 p-4 sm:p-6 rounded-xl ${
                          bookChoice === 'cash'
                            ? 'bg-green-500/20 border border-green-500/40'
                            : 'bg-red-500/20 border border-red-500/40'
                        }`}
                      >
                        {bookChoice === 'cash' ? (
                          <div className="text-center">
                            <p className="text-lg sm:text-xl font-bold text-green-300 mb-2">🎉 Perfect! The Cash Book!</p>
                            <p className="text-sm sm:text-base text-gray-200">
                              The <strong>Cash Book</strong> records ALL cash and bank transactions. 
                              It's both a book of original entry AND a ledger account!
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-lg sm:text-xl font-bold text-red-300 mb-2">🤔 Not quite!</p>
                            <p className="text-sm sm:text-base text-gray-200">
                              Petty Cash Book only handles SMALL expenses. For ALL cash and bank, 
                              use the <strong>Cash Book</strong>!
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Interactive: Classify Transactions (Stage 1) */}
                {currentStage.interactive === 'classify-transactions' && currentStage.transactions && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 sm:mt-8"
                  >
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 sm:p-6 mb-4">
                      <h3 className="text-base sm:text-lg font-bold text-yellow-200 mb-2 text-center">
                        📝 Classification Exercise
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-300 text-center">
                        Which side of the Cash Book does each transaction go?
                      </p>
                    </div>

                    <div className="space-y-3">
                      {currentStage.transactions.map((txn) => {
                        const userAnswer = classifiedTxns[txn.id];
                        const isAnswered = userAnswer !== null && userAnswer !== undefined;
                        const isCorrect = isAnswered && userAnswer === txn.side;
                        
                        return (
                          <motion.div
                            key={txn.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + txn.id * 0.1 }}
                            className={`rounded-lg p-3 sm:p-4 border-2 transition-all ${
                              isAnswered
                                ? isCorrect
                                  ? 'bg-green-500/20 border-green-500/40'
                                  : 'bg-red-500/20 border-red-500/40'
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            <p className="text-gray-200 text-xs sm:text-sm mb-2">
                              <strong>Transaction:</strong> {txn.description}
                            </p>
                            
                            {!isAnswered ? (
                              <button
                                onClick={() => setClassifiedTxns(prev => ({ ...prev, [txn.id]: txn.side }))}
                                className="w-full py-2 px-3 bg-blue-500/30 hover:bg-blue-500/50 rounded-lg text-xs sm:text-sm font-medium text-white transition"
                              >
                                Show Answer
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="text-xs sm:text-sm font-medium text-green-300">
                                  ✓ {txn.side}
                                </span>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Interactive: Reveal Types (Stage 2) */}
                {currentStage.interactive === 'reveal-types' && currentStage.types && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 sm:mt-8"
                  >
                    <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                      👆 Click each type to learn its features:
                    </p>
                    <div className="space-y-3">
                      {currentStage.types.map((type) => (
                        <motion.button
                          key={type.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 + type.id * 0.1 }}
                          onClick={() => {
                            const newRevealed = new Set(revealedTypes);
                            if (newRevealed.has(type.id)) {
                              newRevealed.delete(type.id);
                            } else {
                              newRevealed.add(type.id);
                            }
                            setRevealedTypes(newRevealed);
                          }}
                          className={`w-full flex items-start gap-3 rounded-lg p-3 sm:p-4 text-left transition-all ${
                            revealedTypes.has(type.id)
                              ? 'bg-purple-500/20 border-2 border-purple-500/40'
                              : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                          }`}
                        >
                          <type.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors ${
                            revealedTypes.has(type.id) ? 'text-purple-400' : 'text-gray-400'
                          }`} />
                          <div className="flex-1">
                            <div className="text-white text-xs sm:text-sm font-bold mb-1">{type.title}</div>
                            <div className="text-gray-300 text-xs mb-1">{type.columns}</div>
                            {revealedTypes.has(type.id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-xs text-purple-300 mt-2 border-t border-purple-500/30 pt-2"
                              >
                                {type.detail}
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Interactive: Record Expenses (Stage 3) */}
                {currentStage.interactive === 'record-expenses' && currentStage.expenses && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 sm:mt-8"
                  >
                    <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                      👆 Click to record each petty expense:
                    </p>
                    <div className="space-y-3">
                      {currentStage.expenses.map((expense) => (
                        <motion.button
                          key={expense.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + expense.id * 0.1 }}
                          onClick={() => {
                            const newRecorded = new Set(recordedExpenses);
                            if (newRecorded.has(expense.id)) {
                              newRecorded.delete(expense.id);
                            } else {
                              newRecorded.add(expense.id);
                            }
                            setRecordedExpenses(newRecorded);
                          }}
                          className={`w-full flex items-start gap-3 rounded-lg p-3 sm:p-4 text-left transition-all ${
                            recordedExpenses.has(expense.id)
                              ? 'bg-orange-500/20 border-2 border-orange-500/40'
                              : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                          }`}
                        >
                          <expense.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors ${
                            recordedExpenses.has(expense.id) ? 'text-orange-400' : 'text-gray-400'
                          }`} />
                          <div className="flex-1">
                            <div className="text-white text-xs sm:text-sm font-bold mb-1">
                              {expense.date} - {expense.description}
                            </div>
                            <div className="text-gray-300 text-xs mb-1">Amount: {expense.amount}</div>
                            <div className="text-blue-400 text-xs italic">Category: {expense.category}</div>
                            {recordedExpenses.has(expense.id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-xs text-orange-300 mt-2 border-t border-orange-500/30 pt-2"
                              >
                                ✅ Recorded in Petty Cash Book under {expense.category} column
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {recordedExpenses.size === currentStage.expenses.length && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl text-center"
                      >
                        <p className="text-base sm:text-lg font-bold text-green-300">
                          🎉 All petty expenses recorded with analysis columns!
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
                        ⚡ Final Cash Book Check
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
                                {percentage === 100 ? '🎉 Perfect! You mastered Cash Books!' :
                                 percentage >= 80 ? '👍 Excellent! You understand cash books well!' :
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

export default CashPettyCashBookIntro;
