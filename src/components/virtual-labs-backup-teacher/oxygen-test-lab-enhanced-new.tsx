'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, CheckCircle, XCircle, TestTube, BookOpen, Shield, Package, Zap, RefreshCw } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Alert, AlertDescription } from '../ui/alert';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { LabNotes } from './LabNotes';
import { useToast } from '@/hooks/use-toast';

type TestStep = 'intro' | 'setup' | 'prepare-splint' | 'testing' | 'result' | 'complete';

export function OxygenTestLabEnhanced() {
  const { toast } = useToast();
  const { markLabComplete, isLabCompleted, totalXP } = useLabProgress();
  const [currentStep, setCurrentStep] = React.useState<TestStep>('intro');
  const [selectedGas, setSelectedGas] = React.useState<'oxygen' | 'air' | null>(null);
  const [splintReady, setSplintReady] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [showPractice, setShowPractice] = React.useState(false);
  const [showSupplies, setShowSupplies] = React.useState(true);
  const [practiceInteraction, setPracticeInteraction] = React.useState<'oxygen' | 'splint' | 'safety' | null>(null);
  const [teacherMessage, setTeacherMessage] = React.useState('');
  const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
  const [startTime] = React.useState(Date.now());
  const [xpEarned, setXpEarned] = React.useState<number | null>(null);
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [testResult, setTestResult] = React.useState<'relit' | 'extinguished' | null>(null);
  
  const labId = 'oxygen-test-lab';
  const alreadyCompleted = isLabCompleted(labId);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = React.useState<{ [key: number]: string }>({});
  const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
  const [quizAttempts, setQuizAttempts] = React.useState(0);
  const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

  // Text constants
  const objectiveText = "To identify oxygen gas using the glowing splint test - observing how a glowing splint relights in the presence of pure oxygen.";
  const theoryText = "Oxygen (O₂) is a colorless, odorless gas that supports combustion. It makes up 21% of Earth's atmosphere. While oxygen itself doesn't burn, it helps other things burn more vigorously. When a glowing wooden splint (with a red ember but no flame) is placed in pure oxygen, the splint will relight with a bright flame. This happens because oxygen supports combustion so effectively that it can reignite the ember.";
  const safetyText = "Always wear safety goggles when working with flames. Tie back long hair. Work in a well-ventilated area. Keep oxygen containers away from oils and greases. Never point test tubes at yourself or others. Have a fire extinguisher nearby. Handle glowing splints carefully to avoid burns.";

  // Teacher guidance messages
  React.useEffect(() => {
    if (currentStep === 'intro') {
      setTeacherMessage("Welcome to the Oxygen Test Lab! Today we'll learn how to identify oxygen gas using a glowing splint. This is one of the most important gas tests in chemistry. Ready to light things up?");
    } else if (currentStep === 'setup') {
      setTeacherMessage("Great! First, we need to prepare our test tube with oxygen gas. Click on it from the supplies below to get started!");
    } else if (currentStep === 'prepare-splint') {
      setTeacherMessage("Good! Now we need to prepare a glowing splint. Remember - it must be GLOWING (red ember), not flaming. Click 'Prepare Glowing Splint' when ready!");
    } else if (currentStep === 'testing') {
      setTeacherMessage("Watch closely! I'm inserting the glowing splint into the gas. Keep your eyes on what happens...");
    } else if (currentStep === 'result') {
      if (testResult === 'relit') {
        setTeacherMessage("🔥 Did you see that?! The splint burst back into flame! That's the classic sign of oxygen gas. Oxygen supports combustion so well that it can relight a glowing ember. This is how we identify O₂!");
      } else {
        setTeacherMessage("🌬️ Interesting! The splint just continued glowing and then went out. That's because regular air only has 21% oxygen - not concentrated enough to relight the splint. Only pure oxygen can do that!");
      }
    }
  }, [currentStep, testResult]);

  // Scroll to quiz
  React.useEffect(() => {
    if (currentStep === 'complete') {
      setTimeout(() => {
        const quizElement = document.getElementById('quiz-section');
        if (quizElement) {
          quizElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1500);
    }
  }, [currentStep]);

  const handleTeacherComplete = () => {
    if (pendingTransition) {
      const transition = pendingTransition;
      setPendingTransition(null);
      transition();
    }
  };

  const handleStartLab = () => {
    setCurrentStep('setup');
    setTeacherMessage("Perfect! Let's select a gas to test. We have oxygen and air available. Choose one!");
  };

  const handleSelectGas = (gas: 'oxygen' | 'air') => {
    setSelectedGas(gas);
    setCurrentStep('prepare-splint');
    setShowSupplies(false);
    const gasName = gas === 'oxygen' ? 'pure oxygen' : 'regular air';
    setTeacherMessage(`Excellent choice! You've selected ${gasName}. Now let's prepare our glowing splint. Click the button below to light and prepare it!`);
    toast({ title: `${gas === 'oxygen' ? '💨' : '🌬️'} Gas Selected`, description: `Testing ${gasName}` });
  };

  const handlePrepareSplint = () => {
    setSplintReady(true);
    setTeacherMessage("Perfect! The splint is now glowing with a red ember. Now click 'Insert Glowing Splint' to perform the test!");
    toast({ title: '✨ Splint Ready', description: 'Glowing ember visible - ready to test!' });
  };

  const handleInsertSplint = () => {
    if (!selectedGas) return;
    
    setCurrentStep('testing');
    setIsAnimating(true);
    setTeacherMessage("Watch carefully! Inserting the glowing splint now...");
    
    toast({ title: '🧪 Testing in Progress...', description: 'Observing the reaction' });
    
    setTimeout(() => {
      setCurrentStep('result');
      const result = selectedGas === 'oxygen' ? 'relit' : 'extinguished';
      setTestResult(result);
      setIsAnimating(false);
      
      if (result === 'relit') {
        toast({ 
          title: '🔥 Splint Relights!', 
          description: 'The glowing splint burst into flame - oxygen confirmed!',
          className: 'bg-green-100 dark:bg-green-900 border-green-500'
        });
      } else {
        toast({ 
          title: '😌 Splint Goes Out', 
          description: 'Not enough oxygen to relight the splint',
          className: 'bg-blue-100 dark:bg-blue-900 border-blue-500'
        });
      }
      
      setPendingTransition(() => () => {
        setTimeout(() => {
          setCurrentStep('complete');
          setTeacherMessage("Excellent work! You've completed the oxygen test. Now let's see how well you understood what happened. Take the quiz below!");
        }, 800);
      });
    }, 2500);
  };

  const handleReset = () => {
    setCurrentStep('setup');
    setSelectedGas(null);
    setSplintReady(false);
    setTestResult(null);
    setIsAnimating(false);
    setShowSupplies(true);
    setQuizAnswers({});
    setQuizFeedback(null);
    setQuizIsCorrect(null);
    setQuizAttempts(0);
    setPendingTransition(null);
    setTeacherMessage("Ready to test the other gas? Let's see how it compares!");
    toast({ title: '🔄 Lab Reset', description: 'Ready to test another gas' });
  };

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const handleQuizSubmit = () => {
    if (quizIsCorrect !== null) return;
    
    const correctAnswers: { [key: number]: string } = {
      1: 'relights',
      2: 'supports',
      3: 'extinguishes'
    };
    
    const totalQuestions = 3;
    const correctCount = Object.keys(correctAnswers).filter(
      key => quizAnswers[parseInt(key)] === correctAnswers[parseInt(key)]
    ).length;
    
    const isCorrect = correctCount === totalQuestions;
    const newAttempts = quizAttempts + 1;
    setQuizAttempts(newAttempts);
    
    if (isCorrect) {
      setQuizIsCorrect(true);
      setQuizFeedback(`Perfect! You got all ${totalQuestions} questions correct! 🎉`);
      
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const score = newAttempts === 1 ? 100 : newAttempts === 2 ? 80 : 60;
      const earnedXP = markLabComplete(labId, score, timeSpent);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setXpEarned(earnedXP);
      setShowCelebration(true);
      
      setTimeout(() => setShowCelebration(false), 5000);
      
      setTeacherMessage(`Fantastic work! You earned ${earnedXP} XP - your total is now ${totalXP + earnedXP} XP! You've mastered the oxygen test!`);
    } else {
      if (newAttempts === 1) {
        setQuizFeedback(`You got ${correctCount} out of ${totalQuestions} correct. Think about what you observed and try again! 🔄`);
        setTeacherMessage('Not all answers are correct. Review what happened during the test - how the splint behaved. You can try again!');
      } else {
        setQuizIsCorrect(false);
        setQuizFeedback(
          `Correct answers: 1) Relights 2) Supports combustion 3) Extinguishes. Review these key concepts! 🧠`
        );
        setTeacherMessage('Here are the correct answers. Make sure you understand WHY oxygen relights the splint - this is crucial for exams!');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* XP Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && xpEarned !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              className="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 text-white rounded-3xl p-8 shadow-2xl max-w-md mx-4"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2
                }}
                className="text-8xl text-center mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold text-center mb-2">Lab Completed!</h2>
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-6xl font-black mb-2"
                >
                  +{xpEarned} XP
                </motion.div>
                <p className="text-xl opacity-90">Total XP: {totalXP + xpEarned}</p>
                {!alreadyCompleted && (
                  <p className="text-sm mt-2 opacity-75">First time completion bonus!</p>
                )}
              </div>
              <div className="flex gap-2 justify-center mt-4">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      delay: i * 0.1,
                      repeat: Infinity,
                      duration: 1.5
                    }}
                    className="text-3xl"
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teacher Voice */}
      <TeacherVoice message={teacherMessage} onComplete={handleTeacherComplete} />

      {/* Lab Objective */}
      <Card className="border-2 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Lab Objective
            </CardTitle>
            <TextToSpeech textToSpeak={objectiveText} />
          </div>
          <CardDescription>{objectiveText}</CardDescription>
        </CardHeader>
      </Card>

      {/* Theory & Safety */}
      <Card>
        <CardHeader>
          <CardTitle>Lab Information</CardTitle>
          <CardDescription>Essential background and safety guidelines</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="theory">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Background Theory</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="flex-grow">{theoryText}</div>
                  <TextToSpeech textToSpeak={theoryText} className="flex-shrink-0" />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="safety">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Safety Precautions</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="flex-grow">{safetyText}</div>
                  <TextToSpeech textToSpeak={safetyText} className="flex-shrink-0" />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Main Experiment */}
      <Card className="border-2 border-violet-200 dark:border-violet-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-violet-600" />
              Interactive Oxygen Test
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSupplies(!showSupplies)}
                className="text-xs sm:text-sm"
              >
                <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {showSupplies ? 'Hide' : 'Show'} Supplies
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPractice(!showPractice)}
                className="text-xs sm:text-sm"
              >
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {showPractice ? 'Hide' : 'Show'} Practice
              </Button>
            </div>
          </div>
          <CardDescription>Click equipment to perform the experiment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Start Button */}
          {currentStep === 'intro' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-2xl font-bold mb-3">Ready to Start?</h3>
              <p className="text-muted-foreground mb-6">Follow the teacher's instructions to perform the glowing splint test for oxygen</p>
              <Button 
                onClick={handleStartLab}
                size="lg"
                className="bg-violet-600 hover:bg-violet-700"
              >
                Begin Experiment
              </Button>
            </motion.div>
          )}

          {/* Progress Steps */}
          {currentStep !== 'intro' && (
            <div className="flex items-center justify-between text-sm">
              <div className={cn("flex items-center gap-2", (currentStep === 'setup' || currentStep === 'prepare-splint') && "text-violet-600 font-semibold")}>
                <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs", 
                  (currentStep === 'setup' || currentStep === 'prepare-splint' || currentStep === 'testing' || currentStep === 'result' || currentStep === 'complete') ? "bg-violet-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                )}>1</div>
                <span className="hidden sm:inline">Select Gas</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2" />
              <div className={cn("flex items-center gap-2", currentStep === 'testing' && "text-violet-600 font-semibold")}>
                <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs",
                  (currentStep === 'testing' || currentStep === 'result' || currentStep === 'complete') ? "bg-violet-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                )}>2</div>
                <span className="hidden sm:inline">Insert Splint</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2" />
              <div className={cn("flex items-center gap-2", currentStep === 'complete' && "text-violet-600 font-semibold")}>
                <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs",
                  currentStep === 'complete' ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                )}>3</div>
                <span className="hidden sm:inline">Observe Result</span>
              </div>
            </div>
          )}

          {/* Lab content - continuing in next message due to length */}
        </CardContent>
      </Card>
    </div>
  );
}
