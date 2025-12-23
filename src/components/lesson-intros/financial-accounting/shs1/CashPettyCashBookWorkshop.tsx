'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { TeacherVoice } from '@/components/virtual-labs/TeacherVoice';
import { useLocalization } from '@/hooks/useLocalization';
import { 
  Wallet, BookOpen, CheckCircle, XCircle, Trophy, Sparkles, 
  Calculator, DollarSign, TrendingUp, Clock, FileText, Award,
  ArrowLeft, ArrowRight, Info, Eye, EyeOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LessonIntroProps {
  onComplete?: () => void;
}

type Step = 
  | 'intro' 
  | 'identify-book-type'
  | 'classify-transactions'
  | 'prepare-cash-book'
  | 'prepare-petty-cash'
  | 'quiz'
  | 'complete';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type?: 'receipt' | 'payment' | 'contra';
  pettyCategory?: 'transport' | 'stationery' | 'refreshments' | 'cleaning';
}

export default function CashPettyCashBookWorkshop({ onComplete }: LessonIntroProps) {
  const { toast } = useToast();
  const { country } = useLocalization();
  
  // Localization
  const countryName = country?.name || 'Ghana';
  const currencySymbol = country?.currency?.symbol || '₵';
  const fullCurrencyName = country?.currency?.name || 'Cedis';
  const currencyName = fullCurrencyName.includes('Leone') ? 'Leone' : 
                       fullCurrencyName.includes('Naira') ? 'Naira' :
                       fullCurrencyName.includes('Cedis') ? 'Cedis' :
                       fullCurrencyName;

  // State management
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [teacherMessage, setTeacherMessage] = useState('');
  const [showReference, setShowReference] = useState(false);
  
  // Step 1: Identify book type
  const [selectedBookType, setSelectedBookType] = useState<'cash' | 'petty' | null>(null);
  
  // Step 2: Classify transactions
  const [classifiedTransactions, setClassifiedTransactions] = useState<Record<number, string>>({});
  const [classificationComplete, setClassificationComplete] = useState(false);
  
  // Step 3: Prepare cash book entries
  const [cashBookEntries, setCashBookEntries] = useState<Record<number, { debit: string; credit: string }>>({});
  const [cashBookComplete, setCashBookComplete] = useState(false);
  
  // Step 4: Prepare petty cash book
  const [pettyExpenses, setPettyExpenses] = useState<Record<number, string>>({});
  const [pettyComplete, setPettyComplete] = useState(false);
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  
  // XP and celebration
  const [xpEarned, setXpEarned] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Sample transactions for classification
  const transactions: Transaction[] = [
    { id: 0, date: 'Jan 1', description: `Cash received from sales`, amount: 5000, type: 'receipt' },
    { id: 1, date: 'Jan 2', description: `Paid rent by cash`, amount: 2000, type: 'payment' },
    { id: 2, date: 'Jan 3', description: `Deposited cash into bank`, amount: 1500, type: 'contra' },
    { id: 3, date: 'Jan 4', description: `Received cheque from customer`, amount: 3000, type: 'receipt' },
  ];

  // Petty cash expenses
  const pettyTransactions: Transaction[] = [
    { id: 0, date: 'Jan 5', description: 'Transport for messenger', amount: 20, pettyCategory: 'transport' },
    { id: 1, date: 'Jan 6', description: 'Office stationery', amount: 50, pettyCategory: 'stationery' },
    { id: 2, date: 'Jan 7', description: 'Tea and biscuits', amount: 30, pettyCategory: 'refreshments' },
  ];

  // Quiz questions
  const quizQuestions = [
    { id: 0, question: "The Cash Book serves both as a book of original entry and a ledger account", correct: true },
    { id: 1, question: "All business expenses should go in the Petty Cash Book", correct: false },
    { id: 2, question: "The Imprest System restores petty cash to a fixed amount each period", correct: true },
    { id: 3, question: "Contra entries appear on both sides of the Cash Book", correct: true },
    { id: 4, question: "Petty Cash Book is maintained by the main Cashier", correct: false },
  ];

  // Helper to convert numbers to words for speech
  const numberToWords = (num: number): string => {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    
    if (num === 0) return 'zero';
    if (num < 10) return ones[num];
    if (num >= 10 && num < 20) return teens[num - 10];
    if (num >= 20 && num < 100) {
      const ten = Math.floor(num / 10);
      const one = num % 10;
      return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
    }
    if (num >= 100 && num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      return ones[hundred] + ' hundred' + (remainder > 0 ? ' and ' + numberToWords(remainder) : '');
    }
    if (num >= 1000 && num < 10000) {
      const thousand = Math.floor(num / 1000);
      const remainder = num % 1000;
      return ones[thousand] + ' thousand' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
    }
    if (num >= 10000) {
      const thousand = Math.floor(num / 1000);
      const remainder = num % 1000;
      return numberToWords(thousand) + ' thousand' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
    }
    return num.toString();
  };

  // Initial teacher message
  useEffect(() => {
    if (currentStep === 'intro') {
      setTeacherMessage(`Welcome to the Cash and Petty Cash Book Workshop! I'm your accounting teacher, and today we're going to learn by DOING. In ${countryName}, every business needs to track cash properly. You'll learn to prepare actual Cash Books and Petty Cash Books step by step. By the end of this workshop, you'll be able to handle cash transactions like a professional accountant! Let's begin this practical journey together.`);
    }
  }, [currentStep, countryName]);

  // Step handlers
  const handleStartWorkshop = () => {
    setTeacherMessage(`Excellent! First, let's understand the TWO types of books for tracking money. The CASH BOOK records all cash and bank transactions - big amounts like sales, purchases, rent. The PETTY CASH BOOK records small daily expenses - things like transport fares, stationery, tea. Which one do you think we should use for recording five thousand ${currencyName} received from a customer?`);
    setTimeout(() => {
      setCurrentStep('identify-book-type');
    }, 1000);
  };

  const handleBookTypeSelection = (type: 'cash' | 'petty') => {
    setSelectedBookType(type);
    if (type === 'cash') {
      setTeacherMessage(`Perfect! Five thousand ${currencyName} is a large amount from sales, so it goes in the CASH BOOK, not the Petty Cash Book. Small expenses like twenty ${currencyName} for transport would go in Petty Cash. Now let's learn to classify cash book transactions into three types: RECEIPTS, that's money coming in and goes on the debit side. PAYMENTS, that's money going out and goes on the credit side. And CONTRA ENTRIES, those are transfers between cash and bank that appear on both sides. Click the correct classification for each transaction!`);
      toast({ title: '✅ Correct!', description: 'Large transactions go in Cash Book' });
      setTimeout(() => {
        setCurrentStep('classify-transactions');
        setSelectedBookType(null);
      }, 2000);
    } else {
      setTeacherMessage(`Not quite! Five thousand ${currencyName} is a LARGE amount, so it goes in the CASH BOOK. The Petty Cash Book is only for SMALL expenses like twenty ${currencyName} for transport or thirty ${currencyName} for tea. Remember: Cash Book equals big transactions, Petty Cash equals small expenses. Try again!`);
      toast({ title: '❌ Try Again', description: 'Think about the transaction amount', variant: 'destructive' });
    }
  };

  const handleClassifyTransaction = (transactionId: number, classification: string) => {
    const transaction = transactions[transactionId];
    const isCorrect = classification === transaction.type;
    
    setClassifiedTransactions(prev => ({ ...prev, [transactionId]: classification }));
    
    if (isCorrect) {
      toast({ title: '✅ Correct!', description: getClassificationFeedback(classification) });
    } else {
      toast({ title: '❌ Try Again', description: `This is a ${transaction.type} transaction`, variant: 'destructive' });
      return; // Don't check completion if answer is wrong
    }
    
    // Check if all are classified correctly
    const updatedClassifications = { ...classifiedTransactions, [transactionId]: classification };
    const allClassified = transactions.every(t => updatedClassifications[t.id] !== undefined);
    const allCorrect = transactions.every(t => updatedClassifications[t.id] === t.type);
    
    if (allClassified && allCorrect) {
      setClassificationComplete(true);
      setTeacherMessage(`Brilliant! You've classified all transactions correctly! Now comes the exciting part, let's actually PREPARE a Cash Book! You'll enter the amounts on the correct side. Receipts go on the DEBIT side, that's the left side. Payments go on the CREDIT side, that's the right side. For contra entries, you'll enter on BOTH sides because the money is moving between cash and bank. Let's practice with real entries!`);
    }
  };

  const getClassificationFeedback = (type: string) => {
    switch (type) {
      case 'receipt': return 'Receipts go on the DEBIT (left) side';
      case 'payment': return 'Payments go on the CREDIT (right) side';
      case 'contra': return 'Contra entries appear on BOTH sides';
      default: return '';
    }
  };

  const handleCashBookEntry = (transactionId: number, side: 'debit' | 'credit', value: string) => {
    setCashBookEntries(prev => ({
      ...prev,
      [transactionId]: {
        ...prev[transactionId],
        [side]: value
      }
    }));
  };

  const validateCashBookEntries = () => {
    let correct = 0;
    transactions.forEach(t => {
      const entry = cashBookEntries[t.id];
      if (!entry) return;
      
      if (t.type === 'receipt' && entry.debit === t.amount.toString() && !entry.credit) {
        correct++;
      } else if (t.type === 'payment' && entry.credit === t.amount.toString() && !entry.debit) {
        correct++;
      } else if (t.type === 'contra' && entry.debit === t.amount.toString() && entry.credit === t.amount.toString()) {
        correct++;
      }
    });
    
    if (correct === transactions.length) {
      setCashBookComplete(true);
      setTeacherMessage(`Outstanding! You've prepared a Cash Book correctly! You recorded receipts on the debit side, payments on the credit side, and contra entries on BOTH sides. Now let's move to the Petty Cash Book. Remember the IMPREST SYSTEM? The Petty Cashier gets a fixed amount, say five hundred ${currencyName}, and records small expenses using ANALYSIS COLUMNS to categorize them. Let's prepare a Petty Cash Book!`);
      toast({ title: '✅ Cash Book Complete!', description: 'All entries are correct!' });
      setTimeout(() => {
        setCurrentStep('prepare-petty-cash');
      }, 2000);
    } else {
      toast({ 
        title: '❌ Not quite right', 
        description: `${correct}/${transactions.length} entries correct. Check your amounts and sides!`, 
        variant: 'destructive' 
      });
    }
  };

  const handlePettyExpense = (expenseId: number, category: string) => {
    const expense = pettyTransactions[expenseId];
    const isCorrect = category === expense.pettyCategory;
    
    setPettyExpenses(prev => ({ ...prev, [expenseId]: category }));
    
    if (isCorrect) {
      toast({ title: '✅ Correct!', description: `${expense.description} → ${category.toUpperCase()}` });
    } else {
      toast({ title: '❌ Try Again', description: `Think about where this expense belongs`, variant: 'destructive' });
      return; // Don't check completion if wrong
    }
    
    // Check completion
    const updatedExpenses = { ...pettyExpenses, [expenseId]: category };
    const allCategorized = pettyTransactions.every(e => updatedExpenses[e.id] !== undefined);
    const allCorrect = pettyTransactions.every(e => updatedExpenses[e.id] === e.pettyCategory);
    
    if (allCategorized && allCorrect) {
      setPettyComplete(true);
      setTeacherMessage(`Perfect! You've categorized all petty expenses correctly using analysis columns! Transport goes in Transport column, stationery in Stationery column, refreshments in Refreshments column. At the end of the period, the main Cashier reimburses the Petty Cashier to restore the imprest. You now understand BOTH the Cash Book and Petty Cash Book! Let's test your knowledge with a final quiz!`);
    }
  };

  const handleQuizSubmit = () => {
    let correct = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correct) correct++;
    });
    
    setQuizScore(correct);
    setQuizSubmitted(true);
    
    if (correct === quizQuestions.length) {
      const earned = 150;
      setXpEarned(earned);
      setTeacherMessage(`EXCEPTIONAL WORK! You got all ${quizQuestions.length} questions correct! You truly understand Cash Books and Petty Cash Books. You can now handle cash transactions like a professional accountant in ${countryName}! You've earned one hundred and fifty experience points!`);
      setShowCelebration(true);
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      setTimeout(() => {
        setCurrentStep('complete');
        setShowCelebration(false);
      }, 3000);
    } else {
      const earned = Math.round((correct / quizQuestions.length) * 100);
      setXpEarned(earned);
      setTeacherMessage(`Good effort! You got ${correct} out of ${quizQuestions.length} correct. Review the concepts: Cash Book has dual function, it's a book of entry AND a ledger. Petty Cash uses Imprest System, contra entries go on both sides. You've earned ${earned} experience points.`);
    }
  };

  // Navigation helpers
  const canGoBack = currentStep !== 'intro' && currentStep !== 'complete';
  const canGoNext = () => {
    switch (currentStep) {
      case 'intro': return false;
      case 'identify-book-type': return selectedBookType === 'cash';
      case 'classify-transactions': return classificationComplete;
      case 'prepare-cash-book': return cashBookComplete;
      case 'prepare-petty-cash': return pettyComplete;
      case 'quiz': return quizSubmitted;
      case 'complete': return false;
      default: return false;
    }
  };

  const handleBack = () => {
    const steps: Step[] = ['intro', 'identify-book-type', 'classify-transactions', 'prepare-cash-book', 'prepare-petty-cash', 'quiz', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      setTeacherMessage(''); // Clear teacher message when navigating back
    }
  };

  const handleNext = () => {
    const steps: Step[] = ['intro', 'identify-book-type', 'classify-transactions', 'prepare-cash-book', 'prepare-petty-cash', 'quiz', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1 && canGoNext()) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      
      // Set appropriate message for next step
      if (nextStep === 'prepare-cash-book') {
        setTeacherMessage(`Now let's prepare the Cash Book! Enter the amounts on the correct side. Remember: Receipts on DEBIT, Payments on CREDIT, Contra on BOTH!`);
      } else if (nextStep === 'prepare-petty-cash') {
        setTeacherMessage(`Time for the Petty Cash Book! Categorize each expense into the correct analysis column.`);
      } else if (nextStep === 'quiz') {
        setTeacherMessage(`Final quiz time! Test your understanding of Cash Books and Petty Cash Books.`);
      }
    }
  };

  const handleSkipIntro = () => {
    setShowSkipConfirm(false);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Teacher Voice Component */}
        <AnimatePresence mode="wait">
          {teacherMessage && (
            <TeacherVoice 
              message={teacherMessage}
              autoPlay={true}
              theme="accounting"
              teacherName="Accounting Teacher"
            />
          )}
        </AnimatePresence>

        {/* Reference Panel Toggle */}
        {currentStep !== 'intro' && currentStep !== 'complete' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Button
              onClick={() => setShowReference(!showReference)}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {showReference ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showReference ? 'Hide' : 'Show'} Transaction Reference
            </Button>
          </motion.div>
        )}

        {/* Reference Panel */}
        <AnimatePresence>
          {showReference && currentStep !== 'intro' && currentStep !== 'complete' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    Transaction Reference Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-green-400">Cash Book Transactions:</h4>
                    <div className="space-y-2">
                      {transactions.map(t => (
                        <div key={t.id} className="bg-slate-800/50 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-gray-400">{t.date}</p>
                              <p className="font-semibold">{t.description}</p>
                              <p className="text-sm text-blue-300 capitalize">Type: {t.type}</p>
                            </div>
                            <p className="text-lg font-bold text-green-400">{currencySymbol}{t.amount.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-orange-400">Petty Cash Transactions:</h4>
                    <div className="space-y-2">
                      {pettyTransactions.map(e => (
                        <div key={e.id} className="bg-slate-800/50 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-gray-400">{e.date}</p>
                              <p className="font-semibold">{e.description}</p>
                              <p className="text-sm text-orange-300 capitalize">Category: {e.pettyCategory}</p>
                            </div>
                            <p className="text-lg font-bold text-orange-400">{currencySymbol}{e.amount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-400/30">
                    <h4 className="font-semibold mb-2">Quick Reference:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <span className="text-green-400">Receipt</span> = Money IN → Debit (Left) side</li>
                      <li>• <span className="text-orange-400">Payment</span> = Money OUT → Credit (Right) side</li>
                      <li>• <span className="text-purple-400">Contra</span> = Transfer between cash & bank → BOTH sides</li>
                      <li>• <span className="text-yellow-400">Imprest</span> = Fixed amount of {currencySymbol}500 for petty cash</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {/* INTRO STEP */}
          {currentStep === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[70vh]"
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white max-w-3xl">
                <CardHeader className="text-center pb-4">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                    <Wallet className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Cash & Petty Cash Book Workshop
                  </CardTitle>
                  <p className="text-xl text-gray-300">
                    Learn by Doing - Prepare Real Accounting Books!
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-400/30">
                      <BookOpen className="w-8 h-8 text-blue-400 mb-2" />
                      <h3 className="font-semibold text-lg mb-1">Cash Book</h3>
                      <p className="text-sm text-gray-300">Record all cash & bank transactions</p>
                    </div>
                    <div className="bg-orange-500/20 p-4 rounded-lg border border-orange-400/30">
                      <Calculator className="w-8 h-8 text-orange-400 mb-2" />
                      <h3 className="font-semibold text-lg mb-1">Petty Cash Book</h3>
                      <p className="text-sm text-gray-300">Track small daily expenses</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-400/30">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      What You'll Master:
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>Identify which book to use for different transactions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>Classify transactions as receipts, payments, or contra entries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>Prepare a complete Cash Book with debit and credit sides</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>Use the Imprest System and analysis columns in Petty Cash Book</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={handleStartWorkshop}
                      size="lg"
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold py-6 text-lg"
                    >
                      Start Workshop 🚀
                    </Button>
                    
                    <Button 
                      onClick={() => setShowSkipConfirm(true)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      Skip Interactive Intro →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 1: IDENTIFY BOOK TYPE */}
          {currentStep === 'identify-book-type' && (
            <motion.div
              key="identify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                    Step 1: Identify the Correct Book
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-500/10 p-6 rounded-lg border border-blue-400/30">
                    <h3 className="font-semibold text-xl mb-4">Transaction:</h3>
                    <p className="text-2xl font-bold mb-2">{currencySymbol}5,000 received from a customer</p>
                    <p className="text-gray-300">Which book should you use to record this?</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleBookTypeSelection('cash')}
                      className="p-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-400/40 hover:border-green-400 rounded-xl transition-all transform hover:scale-105"
                    >
                      <Wallet className="w-12 h-12 text-green-400 mx-auto mb-3" />
                      <h3 className="text-xl font-bold mb-2">Cash Book</h3>
                      <p className="text-sm text-gray-300">For all cash & bank transactions</p>
                    </button>

                    <button
                      onClick={() => handleBookTypeSelection('petty')}
                      className="p-8 bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-400/40 hover:border-orange-400 rounded-xl transition-all transform hover:scale-105"
                    >
                      <Calculator className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                      <h3 className="text-xl font-bold mb-2">Petty Cash Book</h3>
                      <p className="text-sm text-gray-300">For small daily expenses</p>
                    </button>
                  </div>

                  <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-400/30">
                    <p className="text-sm text-yellow-200">
                      💡 Hint: Think about the amount. Is {currencySymbol}5,000 a large transaction or a small expense?
                    </p>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between gap-4">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Intro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: CLASSIFY TRANSACTIONS */}
          {currentStep === 'classify-transactions' && (
            <motion.div
              key="classify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <FileText className="w-6 h-6 text-purple-400" />
                    Step 2: Classify Cash Book Transactions
                  </CardTitle>
                  <p className="text-gray-300 mt-2">
                    Click the correct classification for each transaction
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {transactions.map(t => (
                    <div key={t.id} className="bg-slate-800/50 p-6 rounded-lg border border-slate-600/50">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-400">{t.date}</p>
                          <p className="text-lg font-semibold">{t.description}</p>
                          <p className="text-2xl font-bold text-blue-400">{currencySymbol}{t.amount.toLocaleString()}</p>
                        </div>
                        {classifiedTransactions[t.id] === t.type && (
                          <CheckCircle className="w-8 h-8 text-green-400" />
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => handleClassifyTransaction(t.id, 'receipt')}
                          variant={classifiedTransactions[t.id] === 'receipt' ? 'default' : 'outline'}
                          className={`flex-1 min-w-[100px] text-xs sm:text-sm ${
                            classifiedTransactions[t.id] === 'receipt'
                              ? classifiedTransactions[t.id] === t.type
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'
                              : 'bg-blue-500/20 hover:bg-blue-500/40 border-blue-400/50'
                          }`}
                        >
                          <span className="hidden sm:inline">Receipt (Debit)</span>
                          <span className="sm:hidden">Receipt</span>
                        </Button>
                        <Button
                          onClick={() => handleClassifyTransaction(t.id, 'payment')}
                          variant={classifiedTransactions[t.id] === 'payment' ? 'default' : 'outline'}
                          className={`flex-1 min-w-[100px] text-xs sm:text-sm ${
                            classifiedTransactions[t.id] === 'payment'
                              ? classifiedTransactions[t.id] === t.type
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'
                              : 'bg-orange-500/20 hover:bg-orange-500/40 border-orange-400/50'
                          }`}
                        >
                          <span className="hidden sm:inline">Payment (Credit)</span>
                          <span className="sm:hidden">Payment</span>
                        </Button>
                        <Button
                          onClick={() => handleClassifyTransaction(t.id, 'contra')}
                          variant={classifiedTransactions[t.id] === 'contra' ? 'default' : 'outline'}
                          className={`flex-1 min-w-[100px] text-xs sm:text-sm ${
                            classifiedTransactions[t.id] === 'contra'
                              ? classifiedTransactions[t.id] === t.type
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'
                              : 'bg-purple-500/20 hover:bg-purple-500/40 border-purple-400/50'
                          }`}
                        >
                          <span className="hidden sm:inline">Contra (Both)</span>
                          <span className="sm:hidden">Contra</span>
                        </Button>
                      </div>
                    </div>
                  ))}

                  {classificationComplete && (
                    <div className="bg-green-500/20 p-6 rounded-lg border border-green-400/50 text-center">
                      <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                      <p className="text-xl font-bold text-green-400">All Correct! Ready for the next step!</p>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between gap-4 pt-4">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!classificationComplete}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Cash Book
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: PREPARE CASH BOOK */}
          {currentStep === 'prepare-cash-book' && (
            <motion.div
              key="prepare"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <DollarSign className="w-6 h-6 text-green-400" />
                    Step 3: Prepare the Cash Book
                  </CardTitle>
                  <p className="text-gray-300 mt-2">
                    Enter amounts on the correct side. Receipts → Debit (left), Payments → Credit (right), Contra → Both
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-white/30">
                          <th className="p-3 text-left text-green-400 font-bold" colSpan={2}>DEBIT SIDE (Receipts)</th>
                          <th className="p-3 text-left text-orange-400 font-bold" colSpan={2}>CREDIT SIDE (Payments)</th>
                        </tr>
                        <tr className="border-b border-white/20 bg-slate-800/50">
                          <th className="p-2 text-left text-sm">Description</th>
                          <th className="p-2 text-left text-sm">Amount ({currencySymbol})</th>
                          <th className="p-2 text-left text-sm">Description</th>
                          <th className="p-2 text-left text-sm">Amount ({currencySymbol})</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map(t => (
                          <tr key={t.id} className="border-b border-white/10">
                            <td className="p-3">
                              {(t.type === 'receipt' || t.type === 'contra') && (
                                <p className="text-sm">{t.description}</p>
                              )}
                            </td>
                            <td className="p-3">
                              {(t.type === 'receipt' || t.type === 'contra') && (
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={cashBookEntries[t.id]?.debit || ''}
                                  onChange={(e) => handleCashBookEntry(t.id, 'debit', e.target.value)}
                                  className="w-32 bg-slate-800 border-slate-600 text-white"
                                />
                              )}
                            </td>
                            <td className="p-3">
                              {(t.type === 'payment' || t.type === 'contra') && (
                                <p className="text-sm">{t.description}</p>
                              )}
                            </td>
                            <td className="p-3">
                              {(t.type === 'payment' || t.type === 'contra') && (
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={cashBookEntries[t.id]?.credit || ''}
                                  onChange={(e) => handleCashBookEntry(t.id, 'credit', e.target.value)}
                                  className="w-32 bg-slate-800 border-slate-600 text-white"
                                />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Button
                    onClick={validateCashBookEntries}
                    disabled={cashBookComplete}
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    {cashBookComplete ? '✅ Cash Book Complete!' : 'Validate Cash Book Entries'}
                  </Button>

                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-400/30">
                    <p className="text-sm text-blue-200">
                      💡 Remember: Receipts on DEBIT, Payments on CREDIT, Contra on BOTH!
                    </p>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between gap-4">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!cashBookComplete}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Petty Cash
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 4: PREPARE PETTY CASH BOOK */}
          {currentStep === 'prepare-petty-cash' && (
            <motion.div
              key="petty"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Calculator className="w-6 h-6 text-orange-400" />
                    Step 4: Prepare Petty Cash Book with Analysis Columns
                  </CardTitle>
                  <p className="text-gray-300 mt-2">
                    Categorize each small expense into the correct analysis column
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-400/30 mb-6">
                    <p className="font-semibold mb-2">Imprest Amount: {currencySymbol}500</p>
                    <p className="text-sm text-gray-300">The Petty Cashier starts with five hundred {currencyName} and will be reimbursed for expenses</p>
                  </div>

                  {pettyTransactions.map(expense => (
                    <div key={expense.id} className="bg-slate-800/50 p-6 rounded-lg border border-slate-600/50">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-400">{expense.date}</p>
                          <p className="text-lg font-semibold">{expense.description}</p>
                          <p className="text-xl font-bold text-orange-400">{currencySymbol}{expense.amount}</p>
                        </div>
                        {pettyExpenses[expense.id] === expense.pettyCategory && (
                          <CheckCircle className="w-8 h-8 text-green-400" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-3">Select the analysis column:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {['transport', 'stationery', 'refreshments', 'cleaning'].map(cat => (
                          <Button
                            key={cat}
                            onClick={() => handlePettyExpense(expense.id, cat)}
                            variant={pettyExpenses[expense.id] === cat ? 'default' : 'outline'}
                            className={`${
                              pettyExpenses[expense.id] === cat
                                ? pettyExpenses[expense.id] === expense.pettyCategory
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : 'bg-red-600 hover:bg-red-700'
                                : 'bg-orange-500/20 hover:bg-orange-500/40 border-orange-400/50'
                            } capitalize`}
                          >
                            {cat}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {pettyComplete && (
                    <div className="bg-green-500/20 p-6 rounded-lg border border-green-400/50 text-center">
                      <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                      <p className="text-xl font-bold text-green-400">Perfect! All expenses categorized correctly!</p>
                      <p className="text-sm text-gray-300 mt-2">
                        Total spent: {currencySymbol}{pettyTransactions.reduce((sum, e) => sum + e.amount, 0)} | 
                        Reimbursement needed: {currencySymbol}{pettyTransactions.reduce((sum, e) => sum + e.amount, 0)}
                      </p>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between gap-4">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!pettyComplete}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Quiz
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 5: QUIZ */}
          {currentStep === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    Final Quiz: Test Your Knowledge
                  </CardTitle>
                  <p className="text-gray-300 mt-2">
                    Mark each statement as True or False
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quizQuestions.map(q => (
                    <div key={q.id} className="bg-slate-800/50 p-6 rounded-lg border border-slate-600/50">
                      <p className="text-lg mb-4">{q.question}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: true }))}
                          variant={quizAnswers[q.id] === true ? 'default' : 'outline'}
                          disabled={quizSubmitted}
                          className={`${
                            quizSubmitted
                              ? quizAnswers[q.id] === true
                                ? q.correct === true
                                  ? 'bg-green-600'
                                  : 'bg-red-600'
                                : ''
                              : quizAnswers[q.id] === true
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-green-500/20 hover:bg-green-500/40 border-green-400/50'
                          }`}
                        >
                          {quizSubmitted && quizAnswers[q.id] === true ? (
                            q.correct === true ? <CheckCircle className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />
                          ) : null}
                          True
                        </Button>
                        <Button
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: false }))}
                          variant={quizAnswers[q.id] === false ? 'default' : 'outline'}
                          disabled={quizSubmitted}
                          className={`${
                            quizSubmitted
                              ? quizAnswers[q.id] === false
                                ? q.correct === false
                                  ? 'bg-green-600'
                                  : 'bg-red-600'
                                : ''
                              : quizAnswers[q.id] === false
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-red-500/20 hover:bg-red-500/40 border-red-400/50'
                          }`}
                        >
                          {quizSubmitted && quizAnswers[q.id] === false ? (
                            q.correct === false ? <CheckCircle className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />
                          ) : null}
                          False
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length < quizQuestions.length || quizSubmitted}
                    size="lg"
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                  >
                    {quizSubmitted ? `Score: ${quizScore}/${quizQuestions.length}` : 'Submit Quiz'}
                  </Button>

                  {/* Navigation Buttons */}
                  {quizSubmitted && (
                    <div className="flex justify-between gap-4">
                      <Button
                        onClick={handleBack}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Review Previous Steps
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* COMPLETE STEP */}
          {currentStep === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center min-h-[70vh]"
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white max-w-2xl">
                <CardContent className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    <Award className="w-32 h-32 mx-auto mb-6 text-yellow-400" />
                  </motion.div>
                  
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Workshop Complete!
                  </h2>
                  
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-lg border border-yellow-400/30 mb-6">
                    <p className="text-5xl font-bold text-yellow-400 mb-2">+{xpEarned} XP</p>
                    <p className="text-gray-300">Score: {quizScore}/{quizQuestions.length}</p>
                  </div>

                  <div className="space-y-3 text-left mb-8">
                    <div className="flex items-center gap-3 bg-green-500/10 p-3 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>Mastered Cash Book preparation</span>
                    </div>
                    <div className="flex items-center gap-3 bg-green-500/10 p-3 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>Understood transaction classification</span>
                    </div>
                    <div className="flex items-center gap-3 bg-green-500/10 p-3 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>Applied the Imprest System</span>
                    </div>
                    <div className="flex items-center gap-3 bg-green-500/10 p-3 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>Used analysis columns correctly</span>
                    </div>
                  </div>

                  <Button
                    onClick={onComplete}
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    Continue to Full Lesson 📚
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip Intro Confirmation Dialog */}
        {showSkipConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSkipConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Info className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Skip Interactive Workshop?</h3>
                <p className="text-gray-300">
                  The interactive workshop helps you practice preparing Cash Books and Petty Cash Books hands-on. 
                  Are you sure you want to skip to the lesson content?
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowSkipConfirm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Continue Workshop
                </Button>
                <Button
                  onClick={handleSkipIntro}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                >
                  Skip to Lesson
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
