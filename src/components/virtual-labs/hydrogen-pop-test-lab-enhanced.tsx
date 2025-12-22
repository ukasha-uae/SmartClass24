'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Flame, Sparkles, Zap, TestTube2, Volume2, Package, Droplets } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherVoice } from './TeacherVoice';
import { useLabProgress } from '@/stores/lab-progress-store';
import confetti from 'canvas-confetti';
import { LabNotes } from './LabNotes';
import { Alert, AlertDescription } from '../ui/alert';

type TestStep = 'intro' | 'setup' | 'select-tube' | 'inserting' | 'result' | 'complete';
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
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [practiceInteraction, setPracticeInteraction] = React.useState<'hydrogen' | 'test' | 'safety' | null>(null);
    const audioCtxRef = React.useRef<AudioContext | null>(null);
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
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

    // Handle teacher voice completion - execute pending transition
    const handleTeacherComplete = () => {
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null); // Clear BEFORE executing
            transition(); // Execute (may set a new pending transition)
        }
    };

    const handleStartLab = () => {
        setCurrentStep('setup');
        setTeacherMessage("Excellent! See those three test tubes? One of them contains hydrogen. Let's test each one and find out which makes that special popping sound!");
    };

    const handleSelectTube = (tube: TubeContent) => {
        setSelectedTube(tube);
        setCurrentStep('select-tube');
        setShowSupplies(false); // Hide supplies after selection
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
            
            // Wait for result to be observed, then transition to complete with quiz
            setPendingTransition(() => () => {
                setTimeout(() => {
                    setCurrentStep('complete');
                    setTeacherMessage("Great work on the experiment! Now let's see how well you understood what happened. Take the quiz below to test your knowledge!");
                }, 800); // Small delay for natural flow
            });
        }, 2000);
    };

    const handleReset = () => {
        setCurrentStep('setup');
        setSelectedTube(null);
        setTestResult(null);
        setIsAnimating(false);
        setShowSupplies(true);
        setQuizAnswers({});
        setQuizFeedback(null);
        setQuizIsCorrect(null);
        setQuizAttempts(0);
        setPendingTransition(null);
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
        if (quizIsCorrect !== null) return;
        
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
                            <TestTube2 className="h-5 w-5 text-violet-600" />
                            Interactive Hydrogen Pop Test
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
                            <p className="text-muted-foreground mb-6">Follow the teacher's instructions to identify hydrogen gas using the pop test</p>
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
                                        className="flex-1 bg-orange-600 hover:bg-orange-700"
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

                    {/* Lab Supplies Drawer */}
                    {showSupplies && currentStep !== 'intro' && currentStep !== 'complete' && currentStep === 'setup' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Package className="h-5 w-5 text-amber-600" />
                                        Lab Supplies - Click to Select
                                    </CardTitle>
                                    <CardDescription>Choose a test tube to begin the pop test</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-6 justify-center flex-wrap">
                                        {Object.values(tubes).map((tube) => (
                                            <motion.div
                                                key={tube.content}
                                                onClick={() => handleSelectTube(tube.content)}
                                                whileHover={{ scale: 1.05, y: -5 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-violet-300 dark:border-violet-700 hover:border-violet-500 hover:shadow-xl transition-all"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="text-5xl mb-2">{tube.emoji}</div>
                                                    <span className="text-sm font-medium">{tube.content}</span>
                                                    <span className="text-xs text-muted-foreground text-center">{tube.description}</span>
                                                    <span className="text-xs text-violet-600 dark:text-violet-400 font-semibold">Click to Test</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}                </CardContent>
            </Card>

            {/* Practice Mode */}
            {showPractice && (
                <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
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

            {/* Quiz */}
            {testResult && currentStep === 'complete' && (
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
                            <div className="space-y-6">
                                {/* Question 1 */}
                                <div>
                                    <p className="text-base font-semibold mb-3">1. What sound confirms the presence of hydrogen gas?</p>
                                    <RadioGroup 
                                        value={quizAnswers[1]} 
                                        onValueChange={(value) => handleAnswerChange(1, value)} 
                                        disabled={quizIsCorrect !== null}
                                    >
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="hiss" id="q1-hiss" />
                                            <Label htmlFor="q1-hiss" className="flex-1 cursor-pointer">Hiss</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="pop" id="q1-pop" />
                                            <Label htmlFor="q1-pop" className="flex-1 cursor-pointer">Pop</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="crackle" id="q1-crackle" />
                                            <Label htmlFor="q1-crackle" className="flex-1 cursor-pointer">Crackle</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="whistle" id="q1-whistle" />
                                            <Label htmlFor="q1-whistle" className="flex-1 cursor-pointer">Whistle</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Question 2 */}
                                <div>
                                    <p className="text-base font-semibold mb-3">2. What is produced when hydrogen burns in oxygen?</p>
                                    <RadioGroup 
                                        value={quizAnswers[2]} 
                                        onValueChange={(value) => handleAnswerChange(2, value)} 
                                        disabled={quizIsCorrect !== null}
                                    >
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="co2" id="q2-co2" />
                                            <Label htmlFor="q2-co2" className="flex-1 cursor-pointer">Carbon Dioxide (CO₂)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="h2o" id="q2-h2o" />
                                            <Label htmlFor="q2-h2o" className="flex-1 cursor-pointer">Water (H₂O)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="o3" id="q2-o3" />
                                            <Label htmlFor="q2-o3" className="flex-1 cursor-pointer">Ozone (O₃)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="h2o2" id="q2-h2o2" />
                                            <Label htmlFor="q2-h2o2" className="flex-1 cursor-pointer">Hydrogen Peroxide (H₂O₂)</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Question 3 */}
                                <div>
                                    <p className="text-base font-semibold mb-3">3. Which property of hydrogen makes the pop test dangerous if not done carefully?</p>
                                    <RadioGroup 
                                        value={quizAnswers[3]} 
                                        onValueChange={(value) => handleAnswerChange(3, value)} 
                                        disabled={quizIsCorrect !== null}
                                    >
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="heavy" id="q3-heavy" />
                                            <Label htmlFor="q3-heavy" className="flex-1 cursor-pointer">It is very heavy</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="flammable" id="q3-flammable" />
                                            <Label htmlFor="q3-flammable" className="flex-1 cursor-pointer">It is highly flammable</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="toxic" id="q3-toxic" />
                                            <Label htmlFor="q3-toxic" className="flex-1 cursor-pointer">It is toxic</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="radioactive" id="q3-radioactive" />
                                            <Label htmlFor="q3-radioactive" className="flex-1 cursor-pointer">It is radioactive</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>

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
                                disabled={Object.keys(quizAnswers).length < 3 || quizIsCorrect !== null}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {quizIsCorrect === true ? "✓ All Correct!" : quizIsCorrect === false ? "See Answers" : "Submit Answers"}
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
                    <Card className="border-2 border-violet-200 dark:border-violet-800">
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
            <Card className="border-2 border-amber-200 dark:border-amber-800">
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
        </div>
    );
}
