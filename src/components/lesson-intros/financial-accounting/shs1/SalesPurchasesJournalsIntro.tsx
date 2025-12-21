'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, FileText, ShoppingCart, Package, ChevronLeft, ChevronRight, CheckCircle, Sparkles, Play, Pause, Volume2, VolumeX, XCircle, TrendingUp, Calendar, DollarSign, Store, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '@/hooks/useLocalization';

interface LessonIntroProps {
  onComplete?: () => void;
}

const SalesPurchasesJournalsIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const { country, localizeContent } = useLocalization();
  
  const countryName = country?.name || 'Ghana';
  const currencySymbol = country?.currency?.symbol || '₵';

  // Interactive states
  const [journalChoice, setJournalChoice] = useState<'sales' | 'purchases' | null>(null);
  const [classifiedTxns, setClassifiedTxns] = useState<Record<number, string | null>>({});
  const [recordedEntries, setRecordedEntries] = useState<Set<number>>(new Set());
  const [revealedBenefits, setRevealedBenefits] = useState<Set<number>>(new Set());
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
      title: "📚 Books of Original Entry",
      icon: BookOpen,
      content: `Every transaction must be recorded somewhere FIRST before going into the main ledger. These are Books of Original Entry!`,
      narration: `Welcome to one of the most practical topics in accounting - Books of Original Entry! Let me explain what these are and why every business in ${countryName} uses them. Imagine you run a shop. Every single day, you make sales, you buy inventory, you pay expenses. Where do you record all these transactions FIRST? You can't just dump everything randomly into the ledger - that would be chaos! So we use special books called Books of Original Entry, also known as Day Books or Subsidiary Books. These are the FIRST place we record transactions before they go into the main ledger. Think of them like sorting bins - you sort your transactions into different books based on their type. For example, all credit sales go in one book, all credit purchases go in another book, all cash transactions go in yet another book. This makes accounting much more organized and efficient! In this lesson, we'll focus on two of the most important day books: the Sales Journal and the Purchases Journal. These two books handle credit transactions for buying and selling goods. By the end, you'll know exactly when to use each journal and how to record entries correctly. Let's start our journey into systematic bookkeeping!`,
      highlight: "These first records are called Books of Original Entry or Day Books - they organize transactions before the ledger.",
      highlightWords: [countryName, 'Books of Original Entry', 'Day Books', 'first', 'ledger'],
      color: "from-blue-500 to-indigo-600",
      interactive: 'journal-choice'
    },
    {
      title: "📗 The Sales Journal",
      icon: ShoppingCart,
      content: `When you sell goods on credit (customers pay later), the Sales Journal is where you record it!`,
      narration: `Now let me teach you about the Sales Journal - one of the most frequently used books in any trading business. The Sales Journal records only ONE specific type of transaction: credit sales of goods. What does this mean? When you sell goods to a customer and they promise to pay you later - maybe in thirty days or sixty days - that's a credit sale. You DON'T record cash sales here! Only credit sales. Why do we need a separate journal for this? Because businesses make many credit sales every day! Imagine shops like Melcom or Shoprite in ${countryName} - they sell to other businesses on credit constantly. If they recorded each sale individually in the ledger, they'd have hundreds of entries! With the Sales Journal, they record all credit sales in this one book first, then make just ONE total entry in the ledger at the end of the month. Much more efficient! Here's what you record in the Sales Journal: the date of sale, the customer's name, the invoice number for reference, and the amount in ${currencySymbol}. That's it! Very straightforward. At month-end, you add up all the credit sales and make one entry: Debit Debtors Account, Credit Sales Account. This shows who owes you money and how much you sold. Remember: Sales Journal is ONLY for credit sales of goods. Cash sales go in the Cash Book. Sales of assets like furniture go in the General Journal. Keep it specific!`,
      highlightWords: [countryName, currencySymbol, 'credit sales', 'Sales Journal', 'goods'],
      color: "from-green-500 to-emerald-600",
      transactions: [
        { id: 0, date: 'Jan 5', description: `Sold goods to Kofi Stores ${currencySymbol}5,000 on credit`, journal: 'Sales Journal' },
        { id: 1, date: 'Jan 7', description: `Received cash ${currencySymbol}2,000 from customer`, journal: 'Cash Book' },
        { id: 2, date: 'Jan 10', description: `Sold goods to Ama Trading ${currencySymbol}3,500 on credit`, journal: 'Sales Journal' },
        { id: 3, date: 'Jan 12', description: `Sold old computer ${currencySymbol}800 on credit`, journal: 'General Journal' }
      ],
      interactive: 'classify-sales'
    },
    {
      title: "📘 The Purchases Journal",
      icon: Package,
      content: `When you buy goods on credit (you pay the supplier later), the Purchases Journal is where you record it!`,
      narration: `Let's move to the Purchases Journal - the mirror image of the Sales Journal! This journal records only ONE specific type of transaction: credit purchases of goods for resale. When do you use it? When you buy inventory from a supplier and they allow you to pay later - maybe in thirty days or ninety days - that's a credit purchase. You record it in the Purchases Journal. Again, NOT cash purchases! Those go in the Cash Book. Why is this journal important? Because businesses in ${countryName} often buy inventory on credit to manage their cash flow. You don't always have the cash ready to pay immediately, so suppliers give you credit terms. The Purchases Journal helps you track all these credit purchases systematically. What information goes in the Purchases Journal? The date of purchase, the supplier's name, the invoice or reference number, and the amount in ${currencySymbol}. Simple and clear! At the end of the month, you total up all credit purchases and make one entry in the ledger: Debit Purchases Account, Credit Creditors Account. This shows how much inventory you bought and who you owe money to. Here's a key point to remember: Purchases Journal is ONLY for goods bought for resale. If you buy equipment, furniture, or other assets on credit, those DON'T go in the Purchases Journal - they go in the General Journal. Keep the Purchases Journal pure - only inventory for resale!`,
      highlightWords: [countryName, currencySymbol, 'credit purchases', 'Purchases Journal', 'inventory', 'resale'],
      color: "from-purple-500 to-pink-600",
      entries: [
        { 
          id: 0,
          icon: Truck,
          date: 'Jan 8',
          supplier: 'Wholesalers Ltd',
          details: `Bought inventory on credit`,
          amount: `three thousand five hundred cedis`,
          correct: true
        },
        { 
          id: 1,
          icon: Store,
          date: 'Jan 12',
          supplier: 'Tech Suppliers',
          details: `Purchased goods for resale`,
          amount: `four thousand cedis`,
          correct: true
        },
        { 
          id: 2,
          icon: Package,
          date: 'Jan 15',
          supplier: 'Import Trading Co',
          details: `Bought stock on credit`,
          amount: `six thousand cedis`,
          correct: true
        }
      ],
      interactive: 'record-entries'
    },
    {
      title: "🎯 Why Use These Journals?",
      icon: Sparkles,
      content: "Specialized journals like Sales and Purchases Journals save massive time and reduce errors!",
      narration: `Now let me explain WHY businesses use these specialized journals - what are the actual benefits? First and most important: EFFICIENCY! Imagine a business that makes two hundred credit sales per month. Without the Sales Journal, you'd make two hundred separate entries in the ledger - one for each sale. That's exhausting and time-consuming! With the Sales Journal, you record all two hundred sales in the journal, then make just ONE total entry in the ledger at month-end. You just saved yourself one hundred ninety-nine entries! Second benefit: GROUPING similar transactions together. All credit sales are in one place, all credit purchases in another place. This makes it super easy to find and verify transactions. If a customer disputes an invoice, you can quickly check the Sales Journal to confirm. Third benefit: FEWER ERRORS in the main ledger. When you make fewer entries, you make fewer mistakes! The ledger stays clean and accurate. Fourth benefit: BETTER CONTROL and audit trails. Managers and auditors can easily review all credit sales or all credit purchases in one book. It's transparent and well-organized. Fifth benefit: DIVISION OF LABOR. In bigger businesses, one person can handle the Sales Journal, another can handle the Purchases Journal. Specialized work means better quality! These journals aren't just theoretical concepts - they're practical tools that make accounting work MUCH easier in real ${countryName} businesses!`,
      highlightWords: [countryName, 'efficiency', 'grouping', 'errors', 'control', 'audit'],
      color: "from-orange-500 to-red-600",
      benefits: [
        { 
          id: 0,
          icon: TrendingUp,
          title: "Saves Time",
          description: "Group similar transactions together",
          detail: "Instead of hundreds of ledger entries, make just one total entry per month. Saves hours of work!"
        },
        { 
          id: 1,
          icon: FileText,
          title: "Fewer Ledger Entries",
          description: "Summarize before posting",
          detail: "The ledger stays clean with summary totals only, not every single transaction cluttering it up."
        },
        { 
          id: 2,
          icon: CheckCircle,
          title: "Easy Verification",
          description: "Find transactions quickly",
          detail: "Need to check a sale to Kofi Stores? Go straight to the Sales Journal - all sales are there!"
        },
        { 
          id: 3,
          icon: BookOpen,
          title: "Better Audit Trail",
          description: "Clear documentation",
          detail: "Auditors love organized books! Everything is systematic and easy to trace from invoice to journal to ledger."
        }
      ],
      interactive: 'reveal-benefits'
    },
    {
      title: "🚀 Ready to Master Journals?",
      icon: CheckCircle,
      content: `Test your understanding of Sales and Purchases Journals with this final quiz!`,
      narration: `Excellent work so far! You've learned what Books of Original Entry are, when to use the Sales Journal for credit sales, when to use the Purchases Journal for credit purchases, and why these journals make accounting so much more efficient. Now it's time to TEST your understanding! I've prepared five questions to check if you really grasp these concepts. Think carefully about each question. Remember: Sales Journal is for credit sales of goods only. Purchases Journal is for credit purchases of goods for resale only. Both journals save time by grouping similar transactions. And both create better organization than recording everything directly in the ledger. By the end of this lesson, you'll be able to confidently prepare both journals for any business in ${countryName}. You'll know exactly which transactions go in which journal, how to format the entries correctly, and how to post the totals to the ledger at month-end. These skills are essential for any accounting student or business owner! So take this quiz, see how well you've understood everything, and then we'll dive into the detailed lesson with lots of practice examples. You're going to master this topic completely! Let's see what you've learned!`,
      highlightWords: [countryName, 'Sales Journal', 'Purchases Journal', 'credit sales', 'credit purchases'],
      color: "from-teal-500 to-cyan-600",
      quizQuestions: [
        { question: "The Sales Journal records all credit sales of goods", correct: true },
        { question: "Cash sales should be recorded in the Sales Journal", correct: false },
        { question: "The Purchases Journal is for buying goods for resale on credit", correct: true },
        { question: "Buying equipment on credit goes in the Purchases Journal", correct: false },
        { question: "Journals reduce the number of entries in the main ledger", correct: true }
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
    setJournalChoice(null);
    setClassifiedTxns({});
    setRecordedEntries(new Set());
    setRevealedBenefits(new Set());
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
    setJournalChoice(null);
    setClassifiedTxns({});
    setRecordedEntries(new Set());
    setRevealedBenefits(new Set());
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

                {/* Interactive: Journal Choice (Stage 0) */}
                {currentStage.interactive === 'journal-choice' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 sm:mt-8"
                  >
                    <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                      👆 Which journal would you use for credit sales of goods?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setJournalChoice('sales')}
                        className={`p-4 sm:p-6 rounded-xl font-medium text-sm sm:text-base transition-all border-2 ${
                          journalChoice === 'sales'
                            ? 'bg-green-500/30 border-green-400 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-gray-200 border-transparent'
                        }`}
                      >
                        <div className="text-2xl mb-2">📗</div>
                        <div className="font-bold mb-1">Sales Journal</div>
                        <div className="text-xs sm:text-sm opacity-80">For credit sales of goods</div>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setJournalChoice('purchases')}
                        className={`p-4 sm:p-6 rounded-xl font-medium text-sm sm:text-base transition-all border-2 ${
                          journalChoice === 'purchases'
                            ? 'bg-red-500/30 border-red-400 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-gray-200 border-transparent'
                        }`}
                      >
                        <div className="text-2xl mb-2">📘</div>
                        <div className="font-bold mb-1">Purchases Journal</div>
                        <div className="text-xs sm:text-sm opacity-80">For credit purchases of goods</div>
                      </motion.button>
                    </div>
                    
                    {journalChoice && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`mt-4 p-4 sm:p-6 rounded-xl ${
                          journalChoice === 'sales'
                            ? 'bg-green-500/20 border border-green-500/40'
                            : 'bg-red-500/20 border border-red-500/40'
                        }`}
                      >
                        {journalChoice === 'sales' ? (
                          <div className="text-center">
                            <p className="text-lg sm:text-xl font-bold text-green-300 mb-2">🎉 Perfect! Sales Journal it is!</p>
                            <p className="text-sm sm:text-base text-gray-200">
                              The <strong>Sales Journal</strong> records all credit sales of goods. 
                              When customers buy now and pay later, that's where it goes!
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-lg sm:text-xl font-bold text-red-300 mb-2">🤔 Not quite!</p>
                            <p className="text-sm sm:text-base text-gray-200">
                              Purchases Journal is for buying goods on credit. For SELLING goods on credit, 
                              use the <strong>Sales Journal</strong>!
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Interactive: Classify Sales (Stage 1) */}
                {currentStage.interactive === 'classify-sales' && currentStage.transactions && (
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
                        Which journal should each transaction go in?
                      </p>
                    </div>

                    <div className="space-y-3">
                      {currentStage.transactions.map((txn) => {
                        const userAnswer = classifiedTxns[txn.id];
                        const isAnswered = userAnswer !== null && userAnswer !== undefined;
                        const isCorrect = isAnswered && userAnswer === txn.journal;
                        
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
                              <strong>{txn.date}:</strong> {txn.description}
                            </p>
                            
                            {!isAnswered ? (
                              <button
                                onClick={() => setClassifiedTxns(prev => ({ ...prev, [txn.id]: txn.journal }))}
                                className="w-full py-2 px-3 bg-blue-500/30 hover:bg-blue-500/50 rounded-lg text-xs sm:text-sm font-medium text-white transition"
                              >
                                Show Answer
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="text-xs sm:text-sm font-medium text-green-300">
                                  ✓ {txn.journal}
                                </span>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Interactive: Record Entries (Stage 2) */}
                {currentStage.interactive === 'record-entries' && currentStage.entries && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 sm:mt-8"
                  >
                    <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                      👆 Click to record each purchase in the Purchases Journal:
                    </p>
                    <div className="space-y-3">
                      {currentStage.entries.map((entry) => (
                        <motion.button
                          key={entry.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 + entry.id * 0.1 }}
                          onClick={() => {
                            const newRecorded = new Set(recordedEntries);
                            if (newRecorded.has(entry.id)) {
                              newRecorded.delete(entry.id);
                            } else {
                              newRecorded.add(entry.id);
                            }
                            setRecordedEntries(newRecorded);
                          }}
                          className={`w-full flex items-start gap-3 rounded-lg p-3 sm:p-4 text-left transition-all ${
                            recordedEntries.has(entry.id)
                              ? 'bg-purple-500/20 border-2 border-purple-500/40'
                              : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                          }`}
                        >
                          <entry.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors ${
                            recordedEntries.has(entry.id) ? 'text-purple-400' : 'text-gray-400'
                          }`} />
                          <div className="flex-1">
                            <div className="text-white text-xs sm:text-sm font-bold mb-1">
                              {entry.date} - {entry.supplier}
                            </div>
                            <div className="text-gray-300 text-xs mb-1">{entry.details}</div>
                            <div className="text-blue-400 text-xs italic">Amount: {entry.amount}</div>
                            {recordedEntries.has(entry.id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-xs text-purple-300 mt-2 border-t border-purple-500/30 pt-2"
                              >
                                ✅ Recorded in Purchases Journal
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {recordedEntries.size === currentStage.entries.length && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl text-center"
                      >
                        <p className="text-base sm:text-lg font-bold text-green-300">
                          🎉 All purchases recorded correctly!
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Interactive: Reveal Benefits (Stage 3) */}
                {currentStage.interactive === 'reveal-benefits' && currentStage.benefits && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 sm:mt-8"
                  >
                    <p className="text-sm sm:text-base text-gray-300 mb-4 text-center">
                      👆 Click each benefit to learn why journals are so valuable:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {currentStage.benefits.map((benefit) => (
                        <motion.button
                          key={benefit.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + benefit.id * 0.1 }}
                          onClick={() => {
                            const newRevealed = new Set(revealedBenefits);
                            if (newRevealed.has(benefit.id)) {
                              newRevealed.delete(benefit.id);
                            } else {
                              newRevealed.add(benefit.id);
                            }
                            setRevealedBenefits(newRevealed);
                          }}
                          className={`flex flex-col items-start gap-2 rounded-lg p-3 text-left transition-all ${
                            revealedBenefits.has(benefit.id)
                              ? 'bg-orange-500/20 border-2 border-orange-500/40'
                              : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <benefit.icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-colors ${
                              revealedBenefits.has(benefit.id) ? 'text-orange-400' : 'text-gray-400'
                            }`} />
                            <span className="text-white text-xs sm:text-sm font-bold">{benefit.title}</span>
                          </div>
                          <span className="text-gray-300 text-xs">{benefit.description}</span>
                          {revealedBenefits.has(benefit.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="text-xs text-orange-300 mt-2 border-t border-orange-500/30 pt-2"
                            >
                              {benefit.detail}
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
                        ⚡ Final Journals Check
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
                                {percentage === 100 ? '🎉 Perfect! You mastered Sales & Purchases Journals!' :
                                 percentage >= 80 ? '👍 Excellent! You understand journals well!' :
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

export default SalesPurchasesJournalsIntro;
