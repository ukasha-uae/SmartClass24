'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, TestTube, Wind, Sparkles, Package, Eye, Droplets, Award, Trophy } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Alert, AlertDescription } from '../ui/alert';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherVoice } from './TeacherVoice';
import { useLabProgress } from '@/stores/lab-progress-store';
import confetti from 'canvas-confetti';
import { LabNotes } from './LabNotes';
import { LabSupplies, SupplyItem } from './LabSupplies';

type TestStep = 'intro' | 'collect-supplies' | 'setup' | 'exhale' | 'observe' | 'result' | 'quiz' | 'complete';

export function LimewaterTestLabEnhanced() {
    const { toast } = useToast();
    const { markLabComplete, isLabCompleted, totalXP } = useLabProgress();
    const [currentStep, setCurrentStep] = React.useState<TestStep>('intro');
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [showPractice, setShowPractice] = React.useState(false);
    const [practiceInteraction, setPracticeInteraction] = React.useState<'co2' | 'limewater' | 'uses' | null>(null);
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [gogglesWorn, setGogglesWorn] = React.useState(false);
    const [beakerPlaced, setBeakerPlaced] = React.useState(false);
    const [strawPlaced, setStrawPlaced] = React.useState(false);
    const [collectedSupplies, setCollectedSupplies] = React.useState<string[]>([]);
    
    const labSupplies: SupplyItem[] = [
        { id: 'safety-goggles', name: 'Safety Goggles', emoji: '🥽', description: 'Eye protection' },
        { id: 'limewater-beaker', name: 'Beaker with Limewater', emoji: '🧪', description: 'Ca(OH)₂ solution for testing' },
        { id: 'drinking-straw', name: 'Drinking Straw', emoji: '🥤', description: 'For breathing CO₂ into limewater' },
    ];
    const [startTime] = React.useState(Date.now());
    const [xpEarned, setXpEarned] = React.useState<number | null>(null);
    const [showCelebration, setShowCelebration] = React.useState(false);
    const [milkinessLevel, setMilkinessLevel] = React.useState(0); // 0-100
    const [bubbleCount, setBubbleCount] = React.useState(0);
    const [timer, setTimer] = React.useState(0);
    
    const labId = 'limewater-co2-test-lab';
    const alreadyCompleted = isLabCompleted(labId);

    // Quiz State
    const [quizAnswers, setQuizAnswers] = React.useState<{ [key: number]: string }>({});
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    // Show welcome message
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Limewater CO₂ Test Lab! Today we'll test for carbon dioxide by breathing into limewater and observing how it turns milky. Let's begin!");
        }
    }, [currentStep]);

    // Scroll to quiz when it appears
    React.useEffect(() => {
        if (currentStep === 'quiz') {
            setTimeout(() => {
                const quizElement = document.getElementById('quiz-section');
                if (quizElement) {
                    quizElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
        }
    }, [currentStep]);

    // Timer for exhaling step
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (currentStep === 'exhale' && strawPlaced) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
                setBubbleCount(prev => prev + 1);
                
                // Gradually increase milkiness
                setMilkinessLevel(prev => {
                    const newLevel = Math.min(prev + 2, 100);
                    return newLevel;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [currentStep, strawPlaced]);

    const handleStartLab = () => {
        setTeacherMessage("Great! Let's gather our supplies. Click on each item to collect them for your experiment!");
        setCurrentStep('collect-supplies');
    };

    const handleCollectSupply = (itemId: string) => {
        if (!collectedSupplies.includes(itemId)) {
            setCollectedSupplies(prev => {
                const newCollected = [...prev, itemId];
                if (newCollected.length === labSupplies.length) {
                    setTeacherMessage("Perfect! All supplies collected! Now let's set up our experiment. Click 'Continue to Setup' to begin!");
                }
                return newCollected;
            });
            toast({ title: `✅ ${labSupplies.find(s => s.id === itemId)?.name} Collected` });
        }
    };

    const handleAllSuppliesCollected = () => {
        setTeacherMessage("Perfect! All supplies collected! Now let's set up our experiment. Click 'Continue to Setup' to begin!");
    };

    const handleContinueToSetup = () => {
        setCurrentStep('setup');
        setTeacherMessage("Great! Now let's prepare our equipment. First, click the safety goggles to wear them for eye protection.");
    };

    const handleGogglesClick = () => {
        if (currentStep === 'setup' && !gogglesWorn) {
            setGogglesWorn(true);
            setTeacherMessage("Perfect! Safety first. Now click the beaker with limewater to place it on your desk.");
            toast({ 
                title: '🥽 Safety Goggles On', 
                description: 'Eye protection secured' 
            });
        }
    };

    const handleBeakerClick = () => {
        if (currentStep === 'setup' && gogglesWorn && !beakerPlaced) {
            setBeakerPlaced(true);
            setTeacherMessage("Excellent! You can see the clear limewater with measurement markings. Now click the straw to place it into the beaker.");
            toast({ 
                title: '🔬 Beaker Placed', 
                description: 'Limewater ready for testing' 
            });
        }
    };

    const handleStrawClick = () => {
        if (currentStep === 'setup' && gogglesWorn && beakerPlaced && !strawPlaced) {
            setStrawPlaced(true);
            setTeacherMessage("Perfect setup! Now click the 'Start Breathing' button and blow gently into the straw. Watch what happens to the limewater as you exhale carbon dioxide.");
            
            toast({ 
                title: '🥤 Straw Ready', 
                description: 'Now you can start breathing into the limewater' 
            });
        }
    };

    const handleStartBreathing = () => {
        if (currentStep === 'setup' && strawPlaced) {
            setCurrentStep('exhale');
            setIsAnimating(true);
            setTeacherMessage("Good! Keep breathing gently. Notice the bubbles forming as your breath passes through the limewater. Watch carefully as the clear solution begins to change...");
            
            toast({ 
                title: '💨 Breathing into Limewater', 
                description: 'CO₂ from your breath is reacting...' 
            });

            // Transition to observe step after breathing animation
            setTimeout(() => {
                setCurrentStep('observe');
                setTeacherMessage("Excellent observation! The limewater is turning milky white. This happens because the carbon dioxide in your breath is reacting with the calcium hydroxide in the limewater, forming calcium carbonate particles.");
                
                toast({ 
                    title: '🌫️ Limewater Turning Milky!', 
                    description: 'Chemical reaction in progress',
                    className: 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                });

                // Transition to result after observation
                setTimeout(() => {
                    setCurrentStep('result');
                    setTeacherMessage("Fantastic! The limewater has turned completely milky white! This is the positive test for carbon dioxide. The reaction is: CO₂ + Ca(OH)₂ → CaCO₃ + H₂O. Well done!");
                    
                    toast({ 
                        title: '✅ Test Complete!', 
                        description: 'CO₂ confirmed - Milky white precipitate formed',
                        className: 'bg-green-100 dark:bg-green-900 border-green-500'
                    });
                    setIsAnimating(false);

                    // Transition to quiz after showing result - give students time to observe
                    setTimeout(() => {
                        setCurrentStep('quiz');
                        setTeacherMessage("Excellent work! You have successfully tested for carbon dioxide using the limewater test. Now answer the quiz below to earn your XP!");
                    }, 8000); // 8 seconds to observe the milky result
                }, 4000); // 4 seconds for observation
            }, 5000); // 5 seconds of breathing animation
        }
    };

    const handleReset = () => {
        setCurrentStep('intro');
        setIsAnimating(false);
        setGogglesWorn(false);
        setBeakerPlaced(false);
        setStrawPlaced(false);
        setCollectedSupplies([]);
        setMilkinessLevel(0);
        setBubbleCount(0);
        setTimer(0);
        setQuizAnswers({});
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setTeacherMessage("Let's do the experiment again! I will guide you through each step. Click Begin Experiment when you are ready.");
        toast({ title: '🔄 Lab Reset', description: 'Ready to start fresh' });
    };

    const handleTeacherComplete = () => {
        // Direct state updates - no pending transitions
    };

    const handleQuizSubmit = () => {
        // If already correct, don't allow resubmission
        if (quizIsCorrect === true) return;
        
        // If wrong and showing answers, allow retry by resetting
        if (quizIsCorrect === false) {
            setQuizIsCorrect(null);
            setQuizFeedback(null);
            setQuizAnswers({});
            return;
        }
        
        const correctAnswers: { [key: number]: string } = {
            1: 'milky',
            2: 'caco3',
            3: 'caoh2'
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
            
            // Award XP
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
            
            // Transition to complete step after quiz is correct
            setTimeout(() => {
                setCurrentStep('complete');
            }, 2000);
        } else {
            if (newAttempts === 1) {
                setQuizFeedback(`You got ${correctCount} out of ${totalQuestions} correct. Review the experiment and try again! 🔄`);
                setTeacherMessage('Not all answers are correct. Think about what you observed in the experiment. You can try again!');
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback(`Correct answers: 1) Milky white 2) Calcium carbonate (CaCO₃) 3) Calcium hydroxide Ca(OH)₂. Review these key points! 🧠`);
                setTeacherMessage('Here are the correct answers. Make sure to review these concepts - they are important for your exams!');
            }
        }
    };

    const handleAnswerChange = (questionIndex: number, value: string) => {
        setQuizAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }));
    };

    const objectiveText = "To test for carbon dioxide (CO₂) gas by observing the effect of exhaled breath on limewater and the formation of a milky white precipitate.";
    const theoryText = "Limewater is a dilute solution of calcium hydroxide Ca(OH)₂. When carbon dioxide gas is bubbled through limewater, it reacts to form calcium carbonate (CaCO₃), which is insoluble in water and appears as a milky white precipitate. The chemical reaction is: CO₂ + Ca(OH)₂ → CaCO₃ + H₂O. This is a classic test for carbon dioxide. Our exhaled breath contains about 4% CO₂, which is produced by cellular respiration in our bodies.";
    const safetyText = "Wear safety goggles to protect your eyes. Do not drink the limewater - calcium hydroxide is caustic. Breathe gently through the straw to avoid inhaling liquid. Ensure good ventilation in the lab. Wash hands after the experiment. Do not share straws between students.";

    return (
        <div className="relative min-h-screen pb-20">
            {/* Premium Animated Background - Cyan/Blue CO2 Theme */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950/30 dark:via-blue-950/30 dark:to-indigo-950/30" />
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-cyan-200/40 to-blue-300/40 dark:from-cyan-800/20 dark:to-blue-900/20 blur-3xl"
                        style={{
                            width: `${200 + i * 50}px`,
                            height: `${200 + i * 50}px`,
                            left: `${(i * 12.5) % 100}%`,
                            top: `${(i * 15) % 100}%`,
                        }}
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <div className="relative max-w-5xl mx-auto p-4 space-y-6">
            {/* Celebration Overlay */}
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

            {/* Objective */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="border-2 border-cyan-200/50 dark:border-cyan-800/50 bg-gradient-to-br from-white/90 to-cyan-50/90 dark:from-gray-900/90 dark:to-cyan-950/90 backdrop-blur-sm shadow-xl">
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
            <Card className="border-2 border-cyan-200/50 dark:border-cyan-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
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
            <Card className="border-2 border-violet-200/50 dark:border-violet-800/50 bg-gradient-to-br from-white/90 to-violet-50/90 dark:from-gray-900/90 dark:to-violet-950/90 backdrop-blur-sm shadow-xl">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <CardTitle className="flex items-center gap-2">
                            <TestTube className="h-5 w-5 text-violet-600" />
                            Interactive Limewater CO₂ Test
                        </CardTitle>
                        <div className="flex gap-2 flex-wrap">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setShowPractice(!showPractice)}
                                className="text-xs sm:text-sm border-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/20"
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
                            <p className="text-muted-foreground mb-6">Follow the teacher's instructions to test for carbon dioxide</p>
                            <Button 
                                onClick={handleStartLab}
                                size="lg"
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg"
                            >
                                <Sparkles className="w-5 h-5 mr-2" />
                                Begin Experiment
                            </Button>
                        </motion.div>
                    )}

                    {/* Collect Supplies Step */}
                    {currentStep === 'collect-supplies' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <LabSupplies
                                supplies={labSupplies}
                                collectedItems={collectedSupplies}
                                onCollect={handleCollectSupply}
                                onAllCollected={handleAllSuppliesCollected}
                                requiredCount={labSupplies.length}
                            />
                            {collectedSupplies.length === labSupplies.length && (
                                <CardFooter className="mt-4">
                                    <Button 
                                        onClick={handleContinueToSetup} 
                                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg" 
                                        size="lg"
                                    >
                                        Continue to Setup
                                    </Button>
                                </CardFooter>
                            )}
                        </motion.div>
                    )}

                    {/* Progress Steps */}
                    {currentStep !== 'intro' && currentStep !== 'collect-supplies' && (
                        <div className="flex items-center justify-between text-sm">
                            <div className={cn("flex items-center gap-2", currentStep === 'setup' && "text-violet-600 font-semibold")}>
                                <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs", 
                                    currentStep === 'setup' ? "bg-violet-600 text-white" : 
                                    (currentStep === 'exhale' || currentStep === 'observe' || currentStep === 'result' || currentStep === 'complete') ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                                )}>1</div>
                                <span className="hidden sm:inline">Setup</span>
                            </div>
                            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2" />
                            <div className={cn("flex items-center gap-2", (currentStep === 'exhale' || currentStep === 'observe') && "text-violet-600 font-semibold")}>
                                <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs",
                                    (currentStep === 'exhale' || currentStep === 'observe' || currentStep === 'result' || currentStep === 'complete') ? "bg-violet-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                                )}>2</div>
                                <span className="hidden sm:inline">Exhale & Observe</span>
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
                        <div className="relative min-h-[500px] bg-gradient-to-b from-cyan-50 to-blue-100 dark:from-cyan-950 dark:to-blue-900 rounded-lg p-8 flex items-center justify-center overflow-hidden">
                            {/* Action hints */}
                            {currentStep === 'setup' && !gogglesWorn && (
                                <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5], scale: [0.98, 1.02, 0.98] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-20"
                                >
                                    👇 Click Safety Goggles below
                                </motion.div>
                            )}

                            {currentStep === 'setup' && gogglesWorn && !beakerPlaced && (
                                <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5], y: [-2, 2, -2] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-20"
                                >
                                    👇 Click the Beaker below
                                </motion.div>
                            )}

                            {currentStep === 'setup' && beakerPlaced && !strawPlaced && (
                                <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5], y: [-2, 2, -2] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-20"
                                >
                                    👇 Click the Straw below
                                </motion.div>
                            )}

                            {/* Safety Goggles - Clickable in setup */}
                            {currentStep === 'setup' && !gogglesWorn && (
                                <motion.div
                                    onClick={handleGogglesClick}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="absolute top-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
                                >
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="text-6xl"
                                    >
                                        🥽
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Safety Goggles (when worn) */}
                            {gogglesWorn && (
                                <motion.div
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="absolute top-8 left-1/2 -translate-x-1/2 z-10"
                                >
                                    <div className="text-4xl">🥽</div>
                                </motion.div>
                            )}

                            {/* Beaker - Clickable in setup */}
                            {currentStep === 'setup' && gogglesWorn && !beakerPlaced && (
                                <motion.div
                                    onClick={handleBeakerClick}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
                                >
                                    <motion.div
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    >
                                        <TestTube className="h-32 w-32 text-cyan-500" />
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Advanced Beaker with Measurements */}
                            {beakerPlaced && (
                                <motion.div
                                    className="relative flex flex-col items-center"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                >
                                    {/* Beaker Container */}
                                    <div className="relative w-48 h-72">
                                        {/* Beaker glass outline */}
                                        <div className="absolute inset-0 border-4 border-gray-400 dark:border-gray-300 rounded-b-3xl bg-transparent" 
                                             style={{ 
                                                 borderTopWidth: '2px',
                                                 clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
                                             }} 
                                        />
                                        
                                        {/* Measurement markings */}
                                        <div className="absolute left-2 top-[10%] text-xs font-mono text-gray-600 dark:text-gray-400">200mL</div>
                                        <div className="absolute left-2 top-[10%] w-6 h-px bg-gray-400" />
                                        
                                        <div className="absolute left-2 top-[32.5%] text-xs font-mono text-gray-600 dark:text-gray-400">150mL</div>
                                        <div className="absolute left-2 top-[32.5%] w-6 h-px bg-gray-400" />
                                        
                                        <div className="absolute left-2 top-[55%] text-xs font-mono text-gray-600 dark:text-gray-400">100mL</div>
                                        <div className="absolute left-2 top-[55%] w-6 h-px bg-gray-400" />
                                        
                                        <div className="absolute left-2 top-[77.5%] text-xs font-mono text-gray-600 dark:text-gray-400">50mL</div>
                                        <div className="absolute left-2 top-[77.5%] w-6 h-px bg-gray-400" />

                                        {/* Limewater liquid */}
                                        <div 
                                            className="absolute bottom-0 left-0 right-0 rounded-b-3xl transition-all duration-1000"
                                            style={{
                                                height: '67.5%',
                                                background: milkinessLevel < 30 
                                                    ? 'rgba(200, 240, 255, 0.6)' 
                                                    : milkinessLevel < 70
                                                    ? `linear-gradient(to top, rgba(255, 255, 255, ${milkinessLevel / 100}), rgba(200, 240, 255, 0.6))`
                                                    : 'rgba(255, 255, 255, 0.95)',
                                                border: '2px solid rgba(150, 150, 150, 0.3)'
                                            }}
                                        >
                                            {/* Milky particles */}
                                            {milkinessLevel > 20 && [...Array(Math.floor(milkinessLevel / 10))].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute w-2 h-2 bg-white rounded-full opacity-70"
                                                    style={{
                                                        left: `${20 + (i * 15) % 60}%`,
                                                        top: `${30 + (i * 20) % 50}%`
                                                    }}
                                                    animate={{
                                                        y: [0, -10, 0],
                                                        x: [0, Math.random() * 10 - 5, 0],
                                                        opacity: [0.7, 0.9, 0.7]
                                                    }}
                                                    transition={{
                                                        duration: 2 + Math.random(),
                                                        repeat: Infinity,
                                                        delay: i * 0.2
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Straw - Clickable in setup */}
                                        {currentStep === 'setup' && beakerPlaced && !strawPlaced && (
                                            <motion.div
                                                onClick={handleStrawClick}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="absolute left-1/2 -translate-x-1/2 top-0 w-3 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-t-lg z-20 cursor-pointer"
                                                style={{ height: '75%' }}
                                                initial={{ y: -100, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                            >
                                                <motion.div
                                                    animate={{ y: [0, -3, 0] }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                    className="absolute -top-1 left-0 right-0 h-2 bg-yellow-300 rounded-t-lg border border-yellow-500"
                                                />
                                            </motion.div>
                                        )}

                                        {/* Straw */}
                                        {strawPlaced && (
                                            <motion.div
                                                initial={{ y: -100, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="absolute left-1/2 -translate-x-1/2 top-0 w-3 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-t-lg z-20"
                                                style={{ height: '75%' }}
                                            >
                                                {/* Straw opening at top */}
                                                <div className="absolute -top-1 left-0 right-0 h-2 bg-yellow-300 rounded-t-lg border border-yellow-500" />
                                            </motion.div>
                                        )}

                                        {/* CO2 Bubbles rising */}
                                        {currentStep === 'exhale' && strawPlaced && [...Array(8)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute left-1/2 w-3 h-3 bg-cyan-400 dark:bg-cyan-300 rounded-full opacity-70 z-10"
                                                style={{ bottom: '10%' }}
                                                initial={{ y: 0, x: -6, scale: 0 }}
                                                animate={{
                                                    y: -180,
                                                    x: -6 + (Math.random() - 0.5) * 30,
                                                    scale: [0, 1, 0.8, 0],
                                                    opacity: [0, 0.7, 0.5, 0]
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    delay: i * 0.4,
                                                    ease: "easeOut"
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-sm mt-4 font-medium">
                                        {milkinessLevel < 30 ? 'Clear Limewater' : 
                                         milkinessLevel < 70 ? 'Turning Milky...' : 
                                         'Milky White - CO₂ Confirmed!'}
                                    </p>
                                    
                                    {/* Timer display */}
                                    {currentStep === 'exhale' && (
                                        <div className="mt-2 text-xs text-muted-foreground">
                                            ⏱️ {timer}s | 💨 {bubbleCount} bubbles
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Start Breathing Button */}
                            {currentStep === 'setup' && strawPlaced && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                                >
                                    <Button
                                        onClick={handleStartBreathing}
                                        size="lg"
                                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-xl"
                                    >
                                        <Wind className="mr-2 h-5 w-5" />
                                        Start Breathing
                                    </Button>
                                </motion.div>
                            )}

                            {/* Result indicator */}
                            {currentStep === 'result' && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="absolute top-20 right-8"
                                >
                                    <CheckCircle className="h-16 w-16 text-green-600" />
                                </motion.div>
                            )}
                        </div>
                    )}

                </CardContent>
            </Card>


            {/* Practice Mode */}
            {showPractice && (
                <Card className="border-2 border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-br from-white/90 to-amber-50/90 dark:from-gray-900/90 dark:to-amber-950/90 backdrop-blur-sm shadow-xl">
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
                                onClick={() => setPracticeInteraction('co2')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base">💨 About CO₂</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {practiceInteraction === 'co2'
                                            ? "CO₂ is colorless, odorless, and denser than air. Formula: CO₂. Produced by respiration and combustion. Exhaled breath contains ~4% CO₂."
                                            : "Tap to learn about carbon dioxide"}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card 
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setPracticeInteraction('limewater')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base">🧪 Limewater Test</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {practiceInteraction === 'limewater'
                                            ? "Limewater is Ca(OH)₂ solution. Reacts with CO₂ to form white CaCO₃ precipitate. This is the definitive test for CO₂!"
                                            : "Tap to understand the limewater test"}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card 
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setPracticeInteraction('uses')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base">🌍 Uses of CO₂</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {practiceInteraction === 'uses'
                                            ? "Used in fire extinguishers, carbonated drinks, photosynthesis by plants, dry ice for cooling, and preserving food."
                                            : "Tap to explore carbon dioxide uses"}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Lab Notes - Always Available */}
            <Card className="border-2 border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-br from-white/90 to-amber-50/90 dark:from-gray-900/90 dark:to-amber-950/90 backdrop-blur-sm shadow-xl">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="lab-notes" className="border-none">
                        <AccordionTrigger className="px-6 pt-6 hover:no-underline">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                                <BookOpen className="h-5 w-5 text-amber-600" />
                                Lab Notes
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                            <p className="text-sm text-muted-foreground mb-4">
                                Record your observations, findings, and questions as you work through the experiment
                            </p>
                            <Alert className="mb-4 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                                <BookOpen className="h-4 w-4 text-amber-600" />
                                <AlertDescription className="text-sm">
                                    <strong>📝 Exam Preparation Tip:</strong> Use digital notes to capture your observations quickly, 
                                    but <strong>remember to copy important points by hand</strong> into your notebook! Handwriting builds 
                                    muscle memory and prepares you for written exams.
                                </AlertDescription>
                            </Alert>
                            <LabNotes labId={labId} labTitle="Limewater CO₂ Test" />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>

            {/* Quiz Section */}
            {(currentStep === 'quiz' || currentStep === 'complete') && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="quiz-section"
                >
                    <Card className="border-2 border-green-200/50 dark:border-green-800/50 bg-gradient-to-br from-white/90 to-green-50/90 dark:from-gray-900/90 dark:to-green-950/90 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                Lab Quiz - Test Your Knowledge
                            </CardTitle>
                            <CardDescription>
                                Answer these questions to earn your XP points
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Question 1 */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">
                                    1. What color does limewater turn when carbon dioxide is bubbled through it?
                                </Label>
                                <div className="grid gap-3">
                                    {['clear', 'milky', 'blue', 'red'].map((option) => {
                                        const isSelected = quizAnswers[1] === option;
                                        const isCorrect = option === 'milky';
                                        return (
                                            <motion.div
                                                key={option}
                                                onClick={() => !quizIsCorrect && handleAnswerChange(1, option)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    isSelected && !quizIsCorrect && "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20",
                                                    quizIsCorrect === true && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizIsCorrect === true && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    !isSelected && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                                whileHover={!quizIsCorrect ? { scale: 1.02 } : {}}
                                                whileTap={!quizIsCorrect ? { scale: 0.98 } : {}}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                                        isSelected ? "border-cyan-500 bg-cyan-500" : "border-gray-300"
                                                    )}>
                                                        {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                                                    </div>
                                                    <Label className="cursor-pointer flex-1">
                                                        {option === 'clear' && 'It stays clear'}
                                                        {option === 'milky' && 'It turns milky white'}
                                                        {option === 'blue' && 'It turns blue'}
                                                        {option === 'red' && 'It turns red'}
                                                    </Label>
                                                    {quizIsCorrect === true && isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    {quizIsCorrect === true && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Question 2 */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">
                                    2. What substance is formed when CO₂ reacts with limewater, causing the milky appearance?
                                </Label>
                                <div className="grid gap-3">
                                    {[
                                        { value: 'caoh2', label: 'Calcium hydroxide (Ca(OH)₂)' },
                                        { value: 'caco3', label: 'Calcium carbonate (CaCO₃)' },
                                        { value: 'h2co3', label: 'Carbonic acid (H₂CO₃)' },
                                        { value: 'caco2', label: 'Calcium oxide (CaO)' }
                                    ].map((option) => {
                                        const isSelected = quizAnswers[2] === option.value;
                                        const isCorrect = option.value === 'caco3';
                                        return (
                                            <motion.div
                                                key={option.value}
                                                onClick={() => !quizIsCorrect && handleAnswerChange(2, option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    isSelected && !quizIsCorrect && "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20",
                                                    quizIsCorrect === true && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizIsCorrect === true && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    !isSelected && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                                whileHover={!quizIsCorrect ? { scale: 1.02 } : {}}
                                                whileTap={!quizIsCorrect ? { scale: 0.98 } : {}}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                                        isSelected ? "border-cyan-500 bg-cyan-500" : "border-gray-300"
                                                    )}>
                                                        {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                                                    </div>
                                                    <Label className="cursor-pointer flex-1">{option.label}</Label>
                                                    {quizIsCorrect === true && isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    {quizIsCorrect === true && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Question 3 */}
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">
                                    3. What is the chemical name of limewater?
                                </Label>
                                <div className="grid gap-3">
                                    {[
                                        { value: 'cao', label: 'Calcium oxide (CaO)' },
                                        { value: 'caoh2', label: 'Calcium hydroxide (Ca(OH)₂)' },
                                        { value: 'caco3', label: 'Calcium carbonate (CaCO₃)' },
                                        { value: 'cah2', label: 'Calcium hydride (CaH₂)' }
                                    ].map((option) => {
                                        const isSelected = quizAnswers[3] === option.value;
                                        const isCorrect = option.value === 'caoh2';
                                        return (
                                            <motion.div
                                                key={option.value}
                                                onClick={() => !quizIsCorrect && handleAnswerChange(3, option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    isSelected && !quizIsCorrect && "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20",
                                                    quizIsCorrect === true && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizIsCorrect === true && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    !isSelected && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                                whileHover={!quizIsCorrect ? { scale: 1.02 } : {}}
                                                whileTap={!quizIsCorrect ? { scale: 0.98 } : {}}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                                        isSelected ? "border-cyan-500 bg-cyan-500" : "border-gray-300"
                                                    )}>
                                                        {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                                                    </div>
                                                    <Label className="cursor-pointer flex-1">{option.label}</Label>
                                                    {quizIsCorrect === true && isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    {quizIsCorrect === true && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Feedback */}
                            {quizFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "p-4 rounded-lg border-2 bg-gradient-to-r",
                                        quizIsCorrect 
                                            ? "from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-500 text-green-700 dark:text-green-300"
                                            : "from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-500 text-amber-700 dark:text-amber-300"
                                    )}
                                >
                                    <div className="flex items-start gap-2">
                                        {quizIsCorrect ? (
                                            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                        )}
                                        <p className="text-sm font-medium">{quizFeedback}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <Button 
                                onClick={handleQuizSubmit} 
                                className={cn(
                                    "w-full shadow-lg",
                                    quizIsCorrect === false 
                                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                        : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                                )}
                                size="lg"
                                disabled={Object.keys(quizAnswers).length < 3 || quizIsCorrect === true}
                            >
                                {quizIsCorrect === true ? (
                                    <>
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        Quiz Completed
                                    </>
                                ) : quizIsCorrect === false ? (
                                    <>
                                        <RefreshCw className="mr-2 h-5 w-5" />
                                        Try Again
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        Submit Answers
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Lab Complete Section */}
            {currentStep === 'complete' && quizIsCorrect === true && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                >
                    <Card className="border-2 border-yellow-300 dark:border-yellow-700 bg-gradient-to-br from-yellow-50/90 via-orange-50/90 to-pink-50/90 dark:from-yellow-950/90 dark:via-orange-950/90 dark:to-pink-950/90 backdrop-blur-sm shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-pink-400/20 animate-pulse" />
                        <CardContent className="relative p-8 text-center space-y-6">
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ 
                                    repeat: Infinity,
                                    duration: 2
                                }}
                                className="text-8xl mb-4"
                            >
                                🏆
                            </motion.div>
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">
                                Lab Complete!
                            </h2>
                            {xpEarned !== null && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="flex items-center justify-center gap-2 text-3xl font-black text-cyan-600 dark:text-cyan-400"
                                >
                                    <Award className="h-8 w-8" />
                                    <span>+{xpEarned} XP</span>
                                </motion.div>
                            )}
                            <div className="space-y-4 pt-4">
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">What You Learned:</h3>
                                <ul className="text-left space-y-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>Limewater (Ca(OH)₂) turns milky white when CO₂ is bubbled through it</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>The milky appearance is due to the formation of calcium carbonate (CaCO₃) precipitate</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>Chemical reaction: CO₂ + Ca(OH)₂ → CaCO₃ + H₂O</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>This is the definitive test for carbon dioxide gas</span>
                                    </li>
                                </ul>
                            </div>
                            <Button 
                                onClick={handleReset} 
                                variant="outline" 
                                className="mt-6 border-2 border-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/20"
                                size="lg"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Restart Lab
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
            </div>
        </div>
    );
}
