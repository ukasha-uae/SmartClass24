'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Flame, TestTube, Wind, Sparkles, Zap, Droplets, Package } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherVoice } from './TeacherVoice';
import { useLabProgress } from '@/stores/lab-progress-store';
import confetti from 'canvas-confetti';

type TestStep = 'intro' | 'setup' | 'heating' | 'gas-produced' | 'testing' | 'result' | 'complete';
type DragItem = 'bunsen' | 'litmus' | null;

export function AmmoniaTestLab() {
    const { toast } = useToast();
    const { markLabComplete, isLabCompleted, totalXP } = useLabProgress();
    const [currentStep, setCurrentStep] = React.useState<TestStep>('intro');
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [showPractice, setShowPractice] = React.useState(false);
    const [practiceInteraction, setPracticeInteraction] = React.useState<'ammonia' | 'litmus' | 'uses' | null>(null);
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [bunsenPlaced, setBunsenPlaced] = React.useState(false);
    const [litmusPlaced, setLitmusPlaced] = React.useState(false);
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    const [startTime] = React.useState(Date.now());
    const [xpEarned, setXpEarned] = React.useState<number | null>(null);
    const [showCelebration, setShowCelebration] = React.useState(false);
    
    const labId = 'ammonia-test-lab';
    const alreadyCompleted = isLabCompleted(labId);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    // Show welcome message
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Ammonia Test Lab! Today we'll test for ammonia gas by heating an ammonium compound. Let's begin by setting up your lab equipment!");
        }
    }, [currentStep]);

    // Scroll to quiz when it appears
    React.useEffect(() => {
        if (currentStep === 'complete') {
            setTimeout(() => {
                const quizElement = document.getElementById('quiz-section');
                if (quizElement) {
                    quizElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
        }
    }, [currentStep]);

    const handleStartLab = () => {
        setCurrentStep('setup');
        setTeacherMessage("Great! Now click the Bunsen burner from the supplies drawer to place it under the test tube and start heating.");
    };

    const handleBunsenDrop = () => {
        if (currentStep === 'setup' && !bunsenPlaced) {
            setBunsenPlaced(true);
            setShowSupplies(false); // Hide supplies drawer
            setTeacherMessage("Perfect! The Bunsen burner is now heating the ammonium chloride. Watch carefully as the compound decomposes and releases ammonia gas.");
            
            // Small delay before starting heating animation
            setTimeout(() => {
                setCurrentStep('heating');
                setIsAnimating(true);
                toast({ title: '🔥 Heating Started...', description: 'Ammonium compound is decomposing' });
            }, 500);
            
            // Set up the pending transition - will execute when teacher finishes speaking
            setPendingTransition(() => () => {
                setCurrentStep('gas-produced');
                setShowSupplies(true); // Show supplies again for litmus paper
                setTeacherMessage("Excellent observation! Ammonia gas is now being released with its characteristic pungent smell. Now click the red litmus paper to test the gas.");
                toast({ 
                    title: '💨 Ammonia Gas Produced!', 
                    description: 'You can smell the pungent odor',
                    className: 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                });
                setIsAnimating(false);
            });
        }
    };

    const handleLitmusDrop = () => {
        if (currentStep === 'gas-produced' && !litmusPlaced) {
            setLitmusPlaced(true);
            setCurrentStep('testing');
            setIsAnimating(true);
            setTeacherMessage("Good work! Now we are holding the moist red litmus paper in the ammonia fumes. Watch carefully what happens to the color.");
            
            toast({ title: '📄 Testing with Litmus...', description: 'Observing color change' });
            
            // Wait for teacher to finish, then transition to result
            setPendingTransition(() => () => {
                setCurrentStep('result');
                setTeacherMessage("Fantastic! The red litmus paper turned blue! This proves that ammonia is a BASE. Remember, bases turn red litmus blue. Well done!");
                toast({ 
                    title: '🔵 Color Change Observed!', 
                    description: 'Red litmus turned BLUE - Base confirmed!',
                    className: 'bg-green-100 dark:bg-green-900 border-green-500'
                });
                
                // Set up next transition after this message completes
                setPendingTransition(() => () => {
                    setCurrentStep('complete');
                    setTeacherMessage("Excellent work! You have successfully identified ammonia as a base. Now scroll down and try the quiz below to earn your XP!");
                    setIsAnimating(false);
                    setPendingTransition(null); // Clear pending transitions
                });
            });
        }
    };

    const handleReset = () => {
        setCurrentStep('intro');
        setIsAnimating(false);
        setBunsenPlaced(false);
        setLitmusPlaced(false);
        setShowSupplies(true);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setPendingTransition(null);
        setTeacherMessage("Let's do the experiment again! I will guide you through each step. Click Begin Experiment when you are ready.");
        toast({ title: '🔄 Lab Reset', description: 'Ready to start fresh' });
    };

    // Handle teacher voice completion - execute pending transition
    const handleTeacherComplete = () => {
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null); // Clear BEFORE executing
            transition(); // Execute (may set a new pending transition)
        }
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'base';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! Ammonia is a base, which is why it turns red litmus blue. ✅");
            
            // Award XP if not already completed
            if (!alreadyCompleted) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                const score = newAttempts === 1 ? 100 : newAttempts === 2 ? 80 : 60;
                const earnedXP = markLabComplete(labId, score, timeSpent);
                
                // Trigger confetti
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                
                // Show celebration and message
                setXpEarned(earnedXP);
                setShowCelebration(true);
                
                setTimeout(() => setShowCelebration(false), 5000);
                
                setTeacherMessage(`Outstanding! You earned ${earnedXP} XP! You now have ${totalXP + earnedXP} total XP. Keep up the great work!`);
            } else {
                setTeacherMessage('Excellent work! You got it right again. Understanding ammonia testing is crucial for chemistry!');
            }
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite right. Remember: what turns red litmus blue? Try again! 🔄");
                setTeacherMessage('Not quite right. Think about the properties of bases and how they react with litmus paper. Try again!');
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("The correct answer is Base. Ammonia (NH₃) is an alkaline gas that forms a basic solution in water. 🧠");
                setTeacherMessage('The correct answer is Base. Ammonia is alkaline, which means it turns red litmus paper blue. Remember this for your exams!');
            }
        }
    };

    const objectiveText = "To identify ammonia gas (NH₃) by observing its effect on moist red litmus paper and its characteristic pungent smell.";
    const theoryText = "Ammonia (NH₃) is a colorless alkaline gas with a characteristic pungent smell. When heated, ammonium salts decompose to release ammonia gas. Ammonia dissolves in water to form ammonium hydroxide (NH₄OH), a weak base. The alkaline nature of ammonia can be tested using red litmus paper, which turns blue in the presence of a base.";
    const safetyText = "Handle ammonia in a well-ventilated area or fume hood due to its strong, irritating odor. Wear safety goggles to protect your eyes. Avoid directly inhaling the gas. Handle heat sources with care. Do not heat ammonium compounds in closed containers as pressure may build up.";

    return (
        <div className="space-y-6">
            {/* Celebration Overlay */}
            <AnimatePresence>
                {showCelebration && xpEarned && (
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

            {/* Objective */}
            <Card className="border-2 border-cyan-200 dark:border-cyan-800">
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="flex items-center gap-2">
                            <Wind className="h-5 w-5 text-cyan-600" />
                            Objective
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            {alreadyCompleted && (
                                <span className="text-xs sm:text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                    Completed
                                </span>
                            )}
                            <TextToSpeech textToSpeak={objectiveText} />
                        </div>
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
                            Interactive Ammonia Test
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
                            <div className="text-6xl mb-4">🧪</div>
                            <h3 className="text-2xl font-bold mb-3">Ready to Start?</h3>
                            <p className="text-muted-foreground mb-6">Follow the teacher's instructions to perform the ammonia test</p>
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
                            <div className={cn("flex items-center gap-2", (currentStep === 'setup' || currentStep === 'heating') && "text-violet-600 font-semibold")}>
                                <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs", 
                                    (currentStep === 'setup' || currentStep === 'heating') ? "bg-violet-600 text-white" : 
                                    (currentStep === 'gas-produced' || currentStep === 'testing' || currentStep === 'result' || currentStep === 'complete') ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                                )}>1</div>
                                <span className="hidden sm:inline">Setup & Heat</span>
                            </div>
                            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2" />
                            <div className={cn("flex items-center gap-2", (currentStep === 'gas-produced' || currentStep === 'testing') && "text-violet-600 font-semibold")}>
                                <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs",
                                    (currentStep === 'gas-produced' || currentStep === 'testing' || currentStep === 'result' || currentStep === 'complete') ? "bg-violet-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                                )}>2</div>
                                <span className="hidden sm:inline">Test Gas</span>
                            </div>
                            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2" />
                            <div className={cn("flex items-center gap-2", (currentStep === 'result' || currentStep === 'complete') && "text-violet-600 font-semibold")}>
                                <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs",
                                    (currentStep === 'result' || currentStep === 'complete') ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                                )}>3</div>
                                <span className="hidden sm:inline">Result</span>
                            </div>
                        </div>
                    )}

                    {/* Experiment Visualization */}
                    {currentStep !== 'intro' && (
                        <div className="relative min-h-[400px] bg-gradient-to-b from-cyan-50 to-blue-100 dark:from-cyan-950 dark:to-blue-900 rounded-lg p-8 flex items-end justify-center overflow-hidden">
                            {/* Action hints */}
                            {currentStep === 'setup' && !bunsenPlaced && (
                                <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5], scale: [0.98, 1.02, 0.98] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                                >
                                    👇 Click the Bunsen Burner below
                                </motion.div>
                            )}

                            {currentStep === 'gas-produced' && !litmusPlaced && (
                                <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5], y: [-2, 2, -2] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                                >
                                    👇 Click the Litmus Paper below
                                </motion.div>
                            )}

                            {/* Test Tube with Ammonium Solution */}
                            <motion.div
                                className="relative flex flex-col items-center z-10"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                            >
                                <div className="relative">
                                    <TestTube className="h-48 w-48 text-gray-400" />
                                    
                                    {/* Liquid inside tube */}
                                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 h-24 bg-blue-200 dark:bg-blue-800 rounded-b-lg" />
                                    
                                    {/* Label */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                                        NH₄Cl
                                    </div>

                                    {/* Ammonia Gas Animation */}
                                    {(currentStep === 'gas-produced' || currentStep === 'testing' || currentStep === 'result' || currentStep === 'complete') && (
                                        <>
                                            {[...Array(6)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute top-0 left-1/2 w-3 h-3 bg-cyan-300 dark:bg-cyan-600 rounded-full opacity-60"
                                                    initial={{ y: 0, x: -6 }}
                                                    animate={{
                                                        y: -100,
                                                        x: -6 + (Math.random() - 0.5) * 40,
                                                        opacity: 0
                                                    }}
                                                    transition={{
                                                        duration: 2.5,
                                                        repeat: Infinity,
                                                        delay: i * 0.4,
                                                        ease: "easeOut"
                                                    }}
                                                />
                                            ))}
                                            <motion.div
                                                className="absolute -top-20 left-1/2 -translate-x-1/2 text-3xl"
                                                animate={{ scale: [1, 1.3, 1], rotate: [0, 5, -5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                💨
                                            </motion.div>
                                        </>
                                    )}
                                </div>

                                {/* Bunsen Burner (placed) */}
                                {bunsenPlaced && (
                                    <motion.div
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="mt-2"
                                    >
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 0.5, repeat: Infinity }}
                                        >
                                            <Flame className="h-14 w-14 text-orange-500" />
                                        </motion.div>
                                    </motion.div>
                                )}

                                <p className="text-sm mt-2 font-medium">Ammonium Chloride</p>
                            </motion.div>

                            {/* Litmus Paper (placed) */}
                            {litmusPlaced && (
                                <motion.div
                                    className="absolute top-20 right-20 flex flex-col items-center z-20"
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <motion.div
                                        className={cn(
                                            "w-8 h-28 rounded-sm border-2 transition-colors duration-1000",
                                            (currentStep === 'result' || currentStep === 'complete') 
                                                ? "bg-blue-500 border-blue-700" 
                                                : "bg-red-500 border-red-700"
                                        )}
                                        animate={{ 
                                            rotate: [-2, 2, -2],
                                            y: [0, -5, 0]
                                        }}
                                        transition={{ 
                                            repeat: Infinity,
                                            duration: 3
                                        }}
                                    />
                                    <div className="mt-2 flex items-center gap-1">
                                        <Droplets className="h-3 w-3 text-blue-600" />
                                        <span className="text-xs font-medium">
                                            {(currentStep === 'result' || currentStep === 'complete') ? 'Blue' : 'Red'} Litmus
                                        </span>
                                    </div>
                                    
                                    {(currentStep === 'result' || currentStep === 'complete') && (
                                        <motion.div
                                            className="absolute -right-12 top-1/2 -translate-y-1/2"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                        >
                                            <CheckCircle className="h-10 w-10 text-green-600" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Reset Button */}
                    {currentStep === 'complete' && (
                        <Button onClick={handleReset} variant="outline" className="w-full">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset and Try Again
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Lab Supplies Drawer */}
            {showSupplies && currentStep !== 'intro' && currentStep !== 'complete' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Package className="h-5 w-5 text-amber-600" />
                                Lab Supplies - Drag to Use
                            </CardTitle>
                            <CardDescription>Click and drag items to the experiment area</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-6 justify-center flex-wrap">
                                {/* Bunsen Burner */}
                                {!bunsenPlaced && currentStep === 'setup' && (
                                    <motion.div
                                        onClick={() => handleBunsenDrop()}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-orange-300 dark:border-orange-700 hover:border-orange-500 hover:shadow-xl transition-all"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <Flame className="h-16 w-16 text-orange-500" />
                                            <span className="text-sm font-medium">Bunsen Burner</span>
                                            <span className="text-xs text-muted-foreground">Click to Use</span>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Red Litmus Paper */}
                                {!litmusPlaced && currentStep === 'gas-produced' && (
                                    <motion.div
                                        onClick={() => handleLitmusDrop()}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-red-300 dark:border-red-700 hover:border-red-500 hover:shadow-xl transition-all"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-24 bg-red-500 rounded-sm border-2 border-red-700" />
                                            <span className="text-sm font-medium flex items-center gap-1">
                                                <Droplets className="h-3 w-3" />
                                                Moist Red Litmus
                                            </span>
                                            <span className="text-xs text-muted-foreground">Click to Use</span>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Placeholder when waiting */}
                                {(currentStep === 'heating' || (currentStep === 'testing')) && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="inline-block mb-2"
                                        >
                                            <Zap className="h-8 w-8" />
                                        </motion.div>
                                        <p className="text-sm">Wait for the reaction to complete...</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Practice Mode */}
            {showPractice && (
                <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-amber-600" />
                            Practice Mode - Explore & Learn
                        </CardTitle>
                        <CardDescription>Click on cards to learn more</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            <Card 
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setPracticeInteraction('ammonia')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base">💨 About Ammonia</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {practiceInteraction === 'ammonia'
                                            ? "NH₃ is colorless with a pungent smell. Formula: NH₃. Boiling point: -33°C. Very soluble in water forming NH₄OH."
                                            : "Tap to learn about ammonia properties"}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card 
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setPracticeInteraction('litmus')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base">📄 Litmus Test</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {practiceInteraction === 'litmus'
                                            ? "Red litmus turns blue in bases. Blue litmus turns red in acids. Moist litmus is more sensitive than dry!"
                                            : "Tap to understand the litmus test"}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card 
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setPracticeInteraction('uses')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base">🏭 Uses of Ammonia</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {practiceInteraction === 'uses'
                                            ? "Used in: Fertilizers (major use!), cleaning products, refrigeration, manufacturing of plastics and explosives."
                                            : "Tap to see ammonia's real-world uses"}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quiz */}
            {currentStep === 'complete' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="border-2 border-green-200 dark:border-green-800 scroll-mt-20" id="quiz-section">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold">
                                    ?
                                </div>
                                Post-Lab Quiz
                            </CardTitle>
                            <CardDescription>Test your understanding of the experiment</CardDescription>
                        </CardHeader>
                    <CardContent>
                        <RadioGroup value={quizAnswer} onValueChange={setQuizAnswer} disabled={quizIsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                <RadioGroupItem value="acid" id="q-acid" />
                                <Label htmlFor="q-acid" className="flex-1 cursor-pointer">Acid</Label>
                            </div>
                            <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                <RadioGroupItem value="base" id="q-base" />
                                <Label htmlFor="q-base" className="flex-1 cursor-pointer">Base</Label>
                            </div>
                            <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                <RadioGroupItem value="neutral" id="q-neutral" />
                                <Label htmlFor="q-neutral" className="flex-1 cursor-pointer">Neutral</Label>
                            </div>
                        </RadioGroup>
                        {quizFeedback && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "mt-4 text-sm flex items-center gap-2 p-3 rounded-lg",
                                    quizIsCorrect === true && "text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300",
                                    quizIsCorrect === false && "text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300",
                                    quizIsCorrect === null && "text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
                                )}
                            >
                                {quizIsCorrect === true ? <CheckCircle className="h-5 w-5" /> : 
                                 quizIsCorrect === false ? <XCircle className="h-5 w-5" /> :
                                 <RefreshCw className="h-5 w-5" />}
                                {quizFeedback}
                            </motion.p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button 
                            onClick={handleQuizSubmit} 
                            disabled={!quizAnswer || quizIsCorrect !== null}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {quizIsCorrect === true ? "✓ Correct!" : quizIsCorrect === false ? "Answer Shown" : "Check Answer"}
                        </Button>
                    </CardFooter>
                </Card>
                </motion.div>
            )}

            {/* Conclusion */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Conclusion
                    </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert">
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-xl">💨</span>
                            <span><strong>Ammonia (NH₃)</strong> is a colorless gas with a pungent, characteristic smell</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-xl">🔵</span>
                            <span>It turns <strong>moist red litmus paper blue</strong>, confirming it is a base</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-xl">⚗️</span>
                            <span>Chemical formula: <strong>NH₃</strong> | In water: <strong>NH₃ + H₂O → NH₄OH</strong></span>
                        </li>
                    </ul>
                    <p className="mt-4 text-sm font-semibold text-violet-600 dark:text-violet-400">
                        💡 Fun Fact: Ammonia is one of the most produced chemicals in the world, mainly used for fertilizers!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
