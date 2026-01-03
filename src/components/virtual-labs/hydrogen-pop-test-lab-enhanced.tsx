'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Flame, Sparkles, Zap, TestTube2, Volume2, Package, Droplets, Award, Trophy } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherVoice } from './TeacherVoice';
import { useLabProgress } from '@/stores/lab-progress-store';
import confetti from 'canvas-confetti';
import { LabNotes } from './LabNotes';
import { Alert, AlertDescription } from '../ui/alert';
import { LabSupplies, SupplyItem } from './LabSupplies';

type TestStep = 'intro' | 'collect-supplies' | 'setup' | 'select-tube' | 'inserting' | 'result' | 'quiz' | 'complete';
type TubeContent = 'Hydrogen' | 'Air' | 'Oxygen';

interface TubeInfo {
    content: TubeContent;
    emoji: string;
    color: string;
    result: 'pop' | 'relight' | 'nothing';
    description: string;
}

const tubes: Record<TubeContent, TubeInfo> = {
    'Hydrogen': { 
        content: 'Hydrogen', 
        emoji: '💨', 
        color: 'blue',
        result: 'pop',
        description: 'Test tube containing hydrogen gas'
    },
    'Air': { 
        content: 'Air', 
        emoji: '🌬️', 
        color: 'gray',
        result: 'nothing',
        description: 'Test tube containing regular air'
    },
    'Oxygen': { 
        content: 'Oxygen', 
        emoji: '💫', 
        color: 'cyan',
        result: 'relight',
        description: 'Test tube containing pure oxygen'
    },
};

export function HydrogenPopTestLab() {
    const { toast } = useToast();
    const { markLabComplete, isLabCompleted, totalXP } = useLabProgress();
    const [currentStep, setCurrentStep] = React.useState<TestStep>('intro');
    const [selectedTube, setSelectedTube] = React.useState<TubeContent | null>(null);
    const [testResult, setTestResult] = React.useState<'pop' | 'relight' | 'nothing' | null>(null);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [showPractice, setShowPractice] = React.useState(false);
    const [collectedSupplies, setCollectedSupplies] = React.useState<string[]>([]);
    const [practiceInteraction, setPracticeInteraction] = React.useState<'hydrogen' | 'test' | 'safety' | null>(null);
    const audioCtxRef = React.useRef<AudioContext | null>(null);
    const [teacherMessage, setTeacherMessage] = React.useState('');
    
    const labSupplies: SupplyItem[] = [
        { id: 'test-tubes', name: 'Test Tubes', emoji: '🧪', description: 'Containers with different gases' },
        { id: 'burning-splint', name: 'Burning Splint', emoji: '🔥', description: 'Wooden splint with flame' },
        { id: 'safety-goggles', name: 'Safety Goggles', emoji: '🥽', description: 'Eye protection' },
    ];
    const [startTime] = React.useState(Date.now());
    const [xpEarned, setXpEarned] = React.useState<number | null>(null);
    const [showCelebration, setShowCelebration] = React.useState(false);
    
    const labId = 'hydrogen-pop-test-lab';
    const alreadyCompleted = isLabCompleted(labId);

    // Quiz State - 3 questions
    const [quizAnswers, setQuizAnswers] = React.useState<{ [key: number]: string }>({});
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    // Text constants
    const objectiveText = "To confirm the presence of hydrogen gas using the characteristic 'pop' sound produced when a burning splint is introduced into the gas.";
    const theoryText = "Hydrogen (H₂) is a highly flammable, colorless, odorless gas. When hydrogen comes into contact with a flame, it reacts explosively with oxygen in the air to form water (2H₂ + O₂ → 2H₂O). This rapid combustion produces a distinctive 'pop' or 'squeaky pop' sound, making it a reliable test for identifying hydrogen gas in the laboratory.";
    const safetyText = "Always wear safety goggles and work in a well-ventilated area. Hydrogen is extremely flammable - keep away from open flames except during the test. Only test small quantities of gas. Never test hydrogen in enclosed spaces. Ensure the burning splint is held at arm's length when testing.";

    // Clean up audio on unmount
    React.useEffect(() => {
        return () => {
            if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
                audioCtxRef.current.close();
            }
        };
    }, []);

    // Function to generate "pop" sound
    const playPopSound = async () => {
        if (typeof window === 'undefined' || !window.AudioContext) return;
        
        if (!audioCtxRef.current) {
            audioCtxRef.current = new window.AudioContext();
        }
        const audioCtx = audioCtxRef.current;
        
        if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.1);
    };

    // Show welcome and step messages
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Hydrogen Pop Test Lab! Today we'll identify hydrogen gas by listening for a special sound it makes. Ready to become a gas detective? Click 'Begin Experiment' when you're ready!");
        } else if (currentStep === 'setup') {
            setTeacherMessage("Great! Now choose one of the three test tubes. Each contains a different gas. When we test hydrogen with fire, you'll hear something interesting!");
        } else if (currentStep === 'select-tube') {
            setTeacherMessage("Perfect choice! Now click 'Insert Burning Splint' to perform the test. Keep your ears open - you might hear something!");
        } else if (currentStep === 'inserting') {
            setTeacherMessage("Watch and listen carefully... here we go!");
        } else if (currentStep === 'result') {
            if (testResult === 'pop') {
                setTeacherMessage("💥 Did you hear it?! That popping sound - like a mini explosion! That's how we know it's hydrogen. When hydrogen meets oxygen in the flame, they react instantly: 2H₂ + O₂ → 2H₂O. That 'pop' you heard is the sound of water being formed explosively!");
            } else if (testResult === 'relight') {
                setTeacherMessage("🔥 Oh, look at that! The splint burst back into flame. That means this is oxygen gas, not hydrogen. Oxygen loves to support burning. If it were hydrogen, you would've heard a loud popping sound instead. Let's try another tube!");
            } else {
                setTeacherMessage("🌬️ Hmm, nothing special happened. That's just regular air - mostly nitrogen and oxygen mixed together. If this were hydrogen, you would've heard a distinctive 'pop!' Let's try another tube to find it!");
            }
        }
    }, [currentStep, testResult]);

    // Scroll to quiz when it appears (after teacher finishes speaking)
    React.useEffect(() => {
        if (currentStep === 'complete') {
            setTimeout(() => {
                const quizElement = document.getElementById('quiz-section');
                if (quizElement) {
                    quizElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 1500); // Longer delay to let teacher message finish
        }
    }, [currentStep]);

    const handleTeacherComplete = () => {
        // Direct state updates - no pending transitions
    };

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
        setTeacherMessage("Excellent! See those three test tubes? One of them contains hydrogen. Let's test each one and find out which makes that special popping sound!");
    };

    const handleSelectTube = (tube: TubeContent) => {
        setSelectedTube(tube);
        setCurrentStep('select-tube');
        setTeacherMessage(`Good choice! You've selected the ${tube} tube. Now click 'Insert Burning Splint' to test it. Listen carefully!`);
        toast({ title: `${tubes[tube].emoji} Tube Selected`, description: tubes[tube].description });
    };

    const handleInsertSplint = () => {
        if (!selectedTube) return;
        
        setCurrentStep('inserting');
        setIsAnimating(true);
        setTeacherMessage("Watch carefully! I'm inserting the burning splint into the gas. Stay alert!");
        
        toast({ title: '🔥 Inserting Splint...', description: 'Bringing the burning splint close to the gas' });
        
        // Wait for animation, then show result
        setTimeout(() => {
            setCurrentStep('result');
            const result = tubes[selectedTube].result;
            setTestResult(result);
            setIsAnimating(false);
            
            // Play sound and show feedback based on result
            if (result === 'pop') {
                playPopSound();
                toast({ 
                    title: '💥 POP!', 
                    description: 'A loud pop sound confirms hydrogen gas!',
                    className: 'bg-green-100 dark:bg-green-900 border-green-500'
                });
            } else if (result === 'relight') {
                toast({ 
                    title: '🔥 Splint Relights!', 
                    description: 'The glowing splint bursts back into flame - oxygen present!',
                    className: 'bg-orange-100 dark:bg-orange-900 border-orange-500'
                });
            } else {
                toast({ 
                    title: '🌬️ No Reaction', 
                    description: 'The splint continues burning normally' 
                });
            }
            
            // Transition to quiz after showing result
            setTimeout(() => {
                setCurrentStep('quiz');
                setTeacherMessage("Great work on the experiment! Now let's see how well you understood what happened. Take the quiz below to test your knowledge!");
            }, 3000);
        }, 2000);
    };

    const handleReset = () => {
        setCurrentStep('setup');
        setSelectedTube(null);
        setTestResult(null);
        setIsAnimating(false);
        setCollectedSupplies([]);
        setQuizAnswers({});
        setQuizFeedback(null);
        setQuizIsCorrect(null);
        setQuizAttempts(0);
        setTeacherMessage("Ready to test another gas? Each one reacts differently! Remember - hydrogen is the one that goes 'pop!'");
        toast({ title: '🔄 Lab Reset', description: 'Ready to test another gas' });
    };

    const handleAnswerChange = (questionIndex: number, value: string) => {
        setQuizAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }));
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
            1: 'pop',
            2: 'h2o',
            3: 'flammable'
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
            
            // Show celebration
            setXpEarned(earnedXP);
            setShowCelebration(true);
            
            setTimeout(() => setShowCelebration(false), 5000);
            
            setTeacherMessage(`Fantastic work! You earned ${earnedXP} XP - your total is now ${totalXP + earnedXP} XP! You've really mastered the hydrogen pop test. Well done!`);
        } else {
            if (newAttempts === 1) {
                setQuizFeedback(`You got ${correctCount} out of ${totalQuestions} correct. Think about what you observed and try again! 🔄`);
                setTeacherMessage('Not all answers are correct. Review what happened during the test - the sound, the product, and the safety concerns. You can try again!');
            } else {
                setQuizIsCorrect(false);
                const incorrectAnswers = Object.keys(quizAnswers).filter(
                    (key) => quizAnswers[parseInt(key)] !== correctAnswers[parseInt(key)]
                );
                setQuizFeedback(
                    `Correct answers: 1) Pop sound 2) Water (H₂O) 3) Highly flammable. Review these key concepts! 🧠`
                );
                setTeacherMessage('Here are the correct answers. Make sure you understand WHY these are correct - this is important for your exams!');
            }
        }
    };

    return (
        <div className="relative min-h-screen pb-20">
            {/* Premium Animated Background - Orange/Red Fire Theme */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 dark:from-orange-950/30 dark:via-red-950/30 dark:to-amber-950/30" />
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-orange-200/40 to-red-300/40 dark:from-orange-800/20 dark:to-red-900/20 blur-3xl"
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
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
            <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-red-50/90 dark:from-gray-900/90 dark:to-red-950/90 backdrop-blur-sm shadow-xl">
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
                            <TestTube2 className="h-5 w-5 text-violet-600" />
                            Interactive Hydrogen Pop Test
                        </CardTitle>
                        <div className="flex gap-2 flex-wrap">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setShowPractice(!showPractice)}
                                className="text-xs sm:text-sm border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/20"
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
                            <p className="text-muted-foreground mb-6">Follow the teacher's instructions to identify hydrogen gas using the pop test</p>
                            <Button 
                                onClick={handleStartLab}
                                size="lg"
                                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
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
                                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg" 
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
                        <div className={cn("flex items-center gap-2", (currentStep === 'setup' || currentStep === 'select-tube') && "text-violet-600 font-semibold")}>
                            <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs", 
                                (currentStep === 'setup' || currentStep === 'select-tube') ? "bg-violet-600 text-white" : currentStep === 'inserting' || currentStep === 'result' || currentStep === 'complete' ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                            )}>1</div>
                            <span className="hidden sm:inline">Select Gas</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2" />
                        <div className={cn("flex items-center gap-2", (currentStep === 'inserting' || currentStep === 'result') && "text-violet-600 font-semibold")}>
                            <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs",
                                (currentStep === 'inserting' || currentStep === 'result' || currentStep === 'complete') ? "bg-violet-600 text-white" : "bg-gray-200 dark:bg-gray-700"
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

                    {/* Step 1: Select Gas Tube */}
                    {currentStep !== 'intro' && currentStep === 'setup' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <h3 className="font-semibold text-lg">Step 1: Choose a Gas to Test</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.values(tubes).map((tube) => (
                                    <Button
                                        key={tube.content}
                                        variant="outline"
                                        className="h-32 flex-col gap-3 hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950"
                                        onClick={() => handleSelectTube(tube.content)}
                                    >
                                        <TestTube2 className="h-12 w-12 text-violet-600" />
                                        <div className="text-center">
                                            <div className="text-2xl mb-1">{tube.emoji}</div>
                                            <div className="font-semibold">{tube.content}</div>
                                            <div className="text-xs text-muted-foreground">{tube.description}</div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Insert Burning Splint */}
                    {(currentStep === 'select-tube' || currentStep === 'inserting' || currentStep === 'result' || currentStep === 'complete') && selectedTube && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">
                                    {currentStep === 'select-tube' && 'Step 2: Insert the Burning Splint'}
                                    {currentStep === 'inserting' && 'Testing in Progress...'}
                                    {(currentStep === 'result' || currentStep === 'complete') && 'Test Complete!'}
                                </h3>
                                {currentStep === 'select-tube' && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                        <span className="text-xl">{tubes[selectedTube].emoji}</span>
                                        <span className="font-medium text-sm">{selectedTube}</span>
                                    </div>
                                )}
                            </div>

                            {/* Visual Test Area */}
                            <div className="relative min-h-[300px] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-8 flex items-center justify-center">
                                <div className="flex items-end gap-12">
                                    {/* Test Tube */}
                                    <motion.div
                                        className="flex flex-col items-center"
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                    >
                                        <div className="relative">
                                            <TestTube2 className="h-40 w-40 text-violet-400" />
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">
                                                {tubes[selectedTube].emoji}
                                            </div>
                                        </div>
                                        <p className="text-sm mt-2 font-semibold">{selectedTube}</p>
                                    </motion.div>

                                    {/* Burning Splint */}
                                    <AnimatePresence>
                                        {(currentStep === 'select-tube' || currentStep === 'inserting' || currentStep === 'result' || currentStep === 'complete') && (
                                            <motion.div
                                                className="flex flex-col items-center"
                                                initial={{ x: -100, opacity: 0 }}
                                                animate={{ 
                                                    x: currentStep === 'inserting' || currentStep === 'result' || currentStep === 'complete' ? 0 : -50,
                                                    y: currentStep === 'inserting' ? -20 : 0,
                                                    opacity: 1 
                                                }}
                                                transition={{ duration: 1 }}
                                            >
                                                <div className="relative">
                                                    <div className="w-4 h-32 bg-orange-200 dark:bg-orange-900 rounded-t-full" />
                                                    <Flame className="absolute -top-8 left-1/2 -translate-x-1/2 h-10 w-10 text-orange-500" />
                                                </div>
                                                <p className="text-xs mt-2">Burning Splint</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Result Animation */}
                                    {testResult === 'pop' && (currentStep === 'result' || currentStep === 'complete') && (
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: [0, 1.5, 0] }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <div className="text-6xl">💥</div>
                                        </motion.div>
                                    )}
                                    
                                    {testResult === 'relight' && (currentStep === 'result' || currentStep === 'complete') && (
                                        <motion.div
                                            className="absolute top-20 left-1/2 -translate-x-1/2"
                                            animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ repeat: 3, duration: 0.5 }}
                                        >
                                            <Flame className="h-16 w-16 text-orange-600" />
                                        </motion.div>
                                    )}
                                </div>

                                {/* Status Message */}
                                {currentStep === 'inserting' && (
                                    <motion.div
                                        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    >
                                        <Volume2 className="h-4 w-4 text-violet-600" />
                                        <span className="text-sm font-medium">Listen for the sound...</span>
                                    </motion.div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {currentStep === 'select-tube' && (
                                    <Button 
                                        onClick={handleInsertSplint}
                                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                                        disabled={isAnimating}
                                    >
                                        <Flame className="h-4 w-4 mr-2" />
                                        Insert Burning Splint
                                    </Button>
                                )}
                                {currentStep === 'complete' && (
                                    <Button onClick={handleReset} variant="outline" className="flex-1">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Test Another Gas (Try All 3!)
                                    </Button>
                                )}
                            </div>
                        </motion.div>
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
                        <CardDescription>Click on cards to learn more about the experiment</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            <Card 
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setPracticeInteraction('hydrogen')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base">💨 About Hydrogen</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {practiceInteraction === 'hydrogen'
                                            ? "H₂ is the lightest element, colorless, odorless, and highly flammable. Atomic number: 1. Used in fuel cells, rocket fuel, and clean energy!"
                                            : "Tap to learn about hydrogen gas properties"}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card 
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setPracticeInteraction('test')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base">🔥 The Pop Test</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {practiceInteraction === 'test'
                                            ? "The 'pop' sound happens when H₂ reacts with O₂: 2H₂ + O₂ → 2H₂O. This explosive reaction is characteristic of hydrogen!"
                                            : "Tap to understand why hydrogen pops"}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card 
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setPracticeInteraction('safety')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base">⚠️ Safety First</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {practiceInteraction === 'safety'
                                            ? "Always test small amounts! Hydrogen is explosive in air. The Hindenburg disaster showed hydrogen's dangers."
                                            : "Tap to learn safety precautions"}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Lab Complete Section */}
            {currentStep === 'complete' && (
                <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center space-y-6 py-8"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
                    </motion.div>

                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold">Congratulations! 🎉</h3>
                        <p className="text-xl text-muted-foreground">
                            You've completed the Hydrogen Pop Test Lab
                        </p>
                    </div>

                    {xpEarned !== null && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-r from-orange-400 to-red-400 dark:from-orange-600 dark:to-red-600 p-6 rounded-lg text-center"
                        >
                            <div className="flex items-center justify-center gap-3 text-3xl font-bold text-white">
                                <Award className="h-8 w-8" />
                                +{xpEarned} XP Earned!
                            </div>
                        </motion.div>
                    )}

                    <div className="prose dark:prose-invert max-w-none text-left bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 p-6 rounded-lg border-2 border-orange-200/50 dark:border-orange-800/50">
                        <h4 className="text-lg font-semibold mb-3">What You Learned:</h4>
                        <ul className="space-y-2">
                            <li>✓ Hydrogen (H₂) produces a characteristic 'pop' sound when tested with a burning splint</li>
                            <li>✓ The reaction produces water: 2H₂ + O₂ → 2H₂O</li>
                            <li>✓ Hydrogen is highly flammable and must be handled with caution</li>
                            <li>✓ The pop test is a reliable method to identify hydrogen gas</li>
                            <li>✓ Different gases react differently with a burning splint</li>
                        </ul>
                    </div>

                    <Button 
                        onClick={handleReset} 
                        size="lg" 
                        variant="outline"
                        className="border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                    >
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Restart Lab
                    </Button>
                </motion.div>
            )}

            {/* Quiz */}
            {(currentStep === 'quiz' || currentStep === 'complete') && testResult && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl scroll-mt-20" id="quiz-section">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shadow-lg">
                                    ?
                                </div>
                                <span>Post-Lab Quiz</span>
                            </CardTitle>
                            <CardDescription className="text-base">Test your understanding of the hydrogen pop test experiment</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Question 1 */}
                            <div className="p-5 bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-800 dark:to-orange-950/30 rounded-lg border-2 border-orange-200/50 dark:border-orange-800/50 shadow-sm">
                                <p className="text-base font-semibold mb-4 text-gray-900 dark:text-gray-100">1. What sound confirms the presence of hydrogen gas?</p>
                                <div className="space-y-2">
                                    {[
                                        { value: 'hiss', label: 'Hiss' },
                                        { value: 'pop', label: 'Pop', isCorrect: true },
                                        { value: 'crackle', label: 'Crackle' },
                                        { value: 'whistle', label: 'Whistle' }
                                    ].map((option) => (
                                        <motion.div
                                            key={option.value}
                                            whileHover={{ scale: 1.02, x: 4 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                if (quizIsCorrect === null) {
                                                    handleAnswerChange(1, option.value);
                                                }
                                            }}
                                            className={cn(
                                                "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                quizAnswers[1] === option.value && !quizIsCorrect && "border-orange-500 bg-orange-50 dark:bg-orange-950/20 shadow-md",
                                                quizAnswers[1] === option.value && quizIsCorrect === true && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                quizAnswers[1] === option.value && quizIsCorrect === false && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                quizAnswers[1] !== option.value && "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                                quizAnswers[1] === option.value && !quizIsCorrect && "border-orange-500 bg-orange-500",
                                                quizAnswers[1] === option.value && quizIsCorrect === true && option.isCorrect && "border-green-500 bg-green-500",
                                                quizAnswers[1] === option.value && quizIsCorrect === false && !option.isCorrect && "border-red-500 bg-red-500",
                                                quizAnswers[1] !== option.value && "border-gray-300 dark:border-gray-600"
                                            )}>
                                                {quizAnswers[1] === option.value && (
                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                )}
                                            </div>
                                            <Label htmlFor={`q1-${option.value}`} className="flex-1 cursor-pointer text-sm font-medium">
                                                {option.label}
                                            </Label>
                                            {quizIsCorrect !== null && option.isCorrect && (
                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                            )}
                                            {quizIsCorrect === false && quizAnswers[1] === option.value && !option.isCorrect && (
                                                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Question 2 */}
                            <div className="p-5 bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-800 dark:to-orange-950/30 rounded-lg border-2 border-orange-200/50 dark:border-orange-800/50 shadow-sm">
                                <p className="text-base font-semibold mb-4 text-gray-900 dark:text-gray-100">2. What is produced when hydrogen burns in oxygen?</p>
                                <div className="space-y-2">
                                    {[
                                        { value: 'co2', label: 'Carbon Dioxide (CO₂)' },
                                        { value: 'h2o', label: 'Water (H₂O)', isCorrect: true },
                                        { value: 'o3', label: 'Ozone (O₃)' },
                                        { value: 'h2o2', label: 'Hydrogen Peroxide (H₂O₂)' }
                                    ].map((option) => (
                                        <motion.div
                                            key={option.value}
                                            whileHover={{ scale: 1.02, x: 4 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                if (quizIsCorrect === null) {
                                                    handleAnswerChange(2, option.value);
                                                }
                                            }}
                                            className={cn(
                                                "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                quizAnswers[2] === option.value && !quizIsCorrect && "border-orange-500 bg-orange-50 dark:bg-orange-950/20 shadow-md",
                                                quizAnswers[2] === option.value && quizIsCorrect === true && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                quizAnswers[2] === option.value && quizIsCorrect === false && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                quizAnswers[2] !== option.value && "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                                quizAnswers[2] === option.value && !quizIsCorrect && "border-orange-500 bg-orange-500",
                                                quizAnswers[2] === option.value && quizIsCorrect === true && option.isCorrect && "border-green-500 bg-green-500",
                                                quizAnswers[2] === option.value && quizIsCorrect === false && !option.isCorrect && "border-red-500 bg-red-500",
                                                quizAnswers[2] !== option.value && "border-gray-300 dark:border-gray-600"
                                            )}>
                                                {quizAnswers[2] === option.value && (
                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                )}
                                            </div>
                                            <Label htmlFor={`q2-${option.value}`} className="flex-1 cursor-pointer text-sm font-medium">
                                                {option.label}
                                            </Label>
                                            {quizIsCorrect !== null && option.isCorrect && (
                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                            )}
                                            {quizIsCorrect === false && quizAnswers[2] === option.value && !option.isCorrect && (
                                                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Question 3 */}
                            <div className="p-5 bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-800 dark:to-orange-950/30 rounded-lg border-2 border-orange-200/50 dark:border-orange-800/50 shadow-sm">
                                <p className="text-base font-semibold mb-4 text-gray-900 dark:text-gray-100">3. Which property of hydrogen makes the pop test dangerous if not done carefully?</p>
                                <div className="space-y-2">
                                    {[
                                        { value: 'heavy', label: 'It is very heavy' },
                                        { value: 'flammable', label: 'It is highly flammable', isCorrect: true },
                                        { value: 'toxic', label: 'It is toxic' },
                                        { value: 'radioactive', label: 'It is radioactive' }
                                    ].map((option) => (
                                        <motion.div
                                            key={option.value}
                                            whileHover={{ scale: 1.02, x: 4 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                if (quizIsCorrect === null) {
                                                    handleAnswerChange(3, option.value);
                                                }
                                            }}
                                            className={cn(
                                                "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                quizAnswers[3] === option.value && !quizIsCorrect && "border-orange-500 bg-orange-50 dark:bg-orange-950/20 shadow-md",
                                                quizAnswers[3] === option.value && quizIsCorrect === true && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                quizAnswers[3] === option.value && quizIsCorrect === false && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                quizAnswers[3] !== option.value && "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                                quizAnswers[3] === option.value && !quizIsCorrect && "border-orange-500 bg-orange-500",
                                                quizAnswers[3] === option.value && quizIsCorrect === true && option.isCorrect && "border-green-500 bg-green-500",
                                                quizAnswers[3] === option.value && quizIsCorrect === false && !option.isCorrect && "border-red-500 bg-red-500",
                                                quizAnswers[3] !== option.value && "border-gray-300 dark:border-gray-600"
                                            )}>
                                                {quizAnswers[3] === option.value && (
                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                )}
                                            </div>
                                            <Label htmlFor={`q3-${option.value}`} className="flex-1 cursor-pointer text-sm font-medium">
                                                {option.label}
                                            </Label>
                                            {quizIsCorrect !== null && option.isCorrect && (
                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                            )}
                                            {quizIsCorrect === false && quizAnswers[3] === option.value && !option.isCorrect && (
                                                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Feedback Section */}
                            {quizFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={cn(
                                        "p-5 rounded-lg border-2 shadow-lg",
                                        quizIsCorrect === true && "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-300 dark:border-green-700",
                                        quizIsCorrect === false && "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-red-300 dark:border-red-700",
                                        quizIsCorrect === null && "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-300 dark:border-blue-700"
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        {quizIsCorrect === true ? (
                                            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                                        ) : quizIsCorrect === false ? (
                                            <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <RefreshCw className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
                                        )}
                                        <p className={cn(
                                            "text-sm font-medium flex-1",
                                            quizIsCorrect === true && "text-green-800 dark:text-green-200",
                                            quizIsCorrect === false && "text-red-800 dark:text-red-200",
                                            quizIsCorrect === null && "text-blue-800 dark:text-blue-200"
                                        )}>
                                            {quizFeedback}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button 
                                onClick={handleQuizSubmit} 
                                disabled={(quizIsCorrect === null && Object.keys(quizAnswers).length < 3) || quizIsCorrect === true}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                size="lg"
                            >
                                {quizIsCorrect === true ? (
                                    <>
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        All Correct! 🎉
                                    </>
                                ) : quizIsCorrect === false ? (
                                    <>
                                        <RefreshCw className="h-5 w-5 mr-2" />
                                        Try Again
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5 mr-2" />
                                        Submit Answers
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            )}

            {/* Conclusion - Only shows after quiz is answered */}
            {currentStep === 'complete' && quizIsCorrect !== null && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="border-2 border-violet-200/50 dark:border-violet-800/50 bg-gradient-to-br from-white/90 to-violet-50/90 dark:from-gray-900/90 dark:to-violet-950/90 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                Conclusion & Key Takeaways
                            </CardTitle>
                            <CardDescription>Summary of what you learned in this experiment</CardDescription>
                        </CardHeader>
                        <CardContent className="prose prose-sm dark:prose-invert">
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-xl">💥</span>
                                    <span><strong>Hydrogen (H₂)</strong> burns with a characteristic 'pop' sound when tested with a burning splint</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-xl">💧</span>
                                    <span>The reaction produces <strong>water (H₂O)</strong>: 2H₂ + O₂ → 2H₂O + Energy</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-xl">🔥</span>
                                    <span>Hydrogen is <strong>highly flammable</strong> and must be handled with extreme caution</span>
                                </li>
                            </ul>
                            <div className="mt-4 p-3 bg-violet-50 dark:bg-violet-950/30 rounded-lg border border-violet-200 dark:border-violet-800">
                                <p className="text-sm font-semibold text-violet-700 dark:text-violet-400 mb-2">
                                    💡 Real-World Application
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    The hydrogen pop test is crucial in chemistry labs to confirm hydrogen production from reactions like 
                                    acid + metal. Hydrogen is also used as clean fuel in vehicles and rocket propulsion!
                                </p>
                            </div>
                            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">
                                    📝 Exam Tip
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Remember: <strong>Pop sound = Hydrogen gas</strong>. Don't confuse with oxygen (relights a glowing splint). 
                                    Know the equation: 2H₂ + O₂ → 2H₂O. This is a common exam question!
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
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
                            <LabNotes labId="hydrogen-pop-test-lab" labTitle="Hydrogen Pop Test" />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>
            </motion.div>
            </div>
        </div>
    );
}
