'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Flame, Sparkles, Wind, TestTube2, Package } from 'lucide-react';
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
type TubeContent = 'Oxygen' | 'Air' | 'Carbon Dioxide';

interface TubeInfo {
    content: TubeContent;
    emoji: string;
    color: string;
    result: 'relight' | 'nothing' | 'extinguish';
    description: string;
}

const tubes: Record<TubeContent, TubeInfo> = {
    'Oxygen': { 
        content: 'Oxygen', 
        emoji: '💫', 
        color: 'cyan',
        result: 'relight',
        description: 'Test tube containing pure oxygen'
    },
    'Air': { 
        content: 'Air', 
        emoji: '🌬️', 
        color: 'gray',
        result: 'nothing',
        description: 'Test tube containing regular air'
    },
    'Carbon Dioxide': { 
        content: 'Carbon Dioxide', 
        emoji: '🫧', 
        color: 'purple',
        result: 'extinguish',
        description: 'Test tube containing carbon dioxide'
    },
};

export function OxygenTestLabEnhanced() {
    const { toast } = useToast();
    const { markLabComplete, isLabCompleted, totalXP } = useLabProgress();
    const [currentStep, setCurrentStep] = React.useState<TestStep>('intro');
    const [selectedTube, setSelectedTube] = React.useState<TubeContent | null>(null);
    const [testResult, setTestResult] = React.useState<'relight' | 'nothing' | 'extinguish' | null>(null);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [showPractice, setShowPractice] = React.useState(false);
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [practiceInteraction, setPracticeInteraction] = React.useState<'oxygen' | 'test' | 'safety' | null>(null);
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    const [startTime] = React.useState(Date.now());
    const [xpEarned, setXpEarned] = React.useState<number | null>(null);
    const [showCelebration, setShowCelebration] = React.useState(false);
    
    const labId = 'oxygen-test-lab';
    const alreadyCompleted = isLabCompleted(labId);

    // Quiz State - 3 questions
    const [quizAnswers, setQuizAnswers] = React.useState<{ [key: number]: string }>({});
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    // Text constants
    const objectiveText = "To confirm the presence of oxygen gas using the glowing splint test. When a glowing (not burning) splint is introduced into oxygen, it relights into a bright flame.";
    const theoryText = "Oxygen (O₂) is a colorless, odorless gas that makes up about 21% of Earth's atmosphere. It is essential for combustion and supports burning. When a glowing splint (ember) is placed in pure oxygen, the concentration is high enough to rekindle the flame. This distinguishes oxygen from regular air, where the splint would only continue to glow dimly.";
    const safetyText = "Always wear safety goggles. Be careful with the glowing splint - don't touch the hot end. Work in a well-ventilated area. Keep oxygen away from flammable materials as it accelerates burning. Never point the test tube at yourself or others when inserting the splint.";

    // Show welcome and step messages
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Oxygen Test Lab! Today we'll identify oxygen gas by watching what happens to a glowing splint. It's like magic - but it's science! Ready to begin?");
        } else if (currentStep === 'setup') {
            setTeacherMessage("Excellent! Look at these three test tubes. One contains pure oxygen. When we put a glowing splint inside, something amazing will happen!");
        } else if (currentStep === 'select-tube') {
            setTeacherMessage("Good choice! Now click 'Insert Glowing Splint' to perform the test. Watch the splint carefully - will it burst into flame?");
        } else if (currentStep === 'inserting') {
            setTeacherMessage("Watch closely! I'm inserting the glowing splint into the gas. Keep your eyes on the ember!");
        } else if (currentStep === 'result') {
            if (testResult === 'relight') {
                setTeacherMessage("🔥 Amazing! Did you see that?! The glowing splint burst back into bright flame! That's how we know this is pure oxygen. Oxygen loves fire - it's what makes things burn. This is the classic test for oxygen gas!");
            } else if (testResult === 'extinguish') {
                setTeacherMessage("💨 Oh, the splint went out completely! That means this is carbon dioxide gas, not oxygen. Carbon dioxide actually puts out fires - that's why it's used in fire extinguishers. If it were oxygen, the splint would have burst into flame. Try another tube!");
            } else {
                setTeacherMessage("🌬️ Hmm, the splint just kept glowing dimly. This is regular air - about 21% oxygen mixed with nitrogen. Not concentrated enough to relight the splint. If this were pure oxygen, you'd see a bright flame! Let's try another tube!");
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
            }, 1500);
        }
    }, [currentStep]);

    // Handle teacher voice completion - execute pending transition
    const handleTeacherComplete = () => {
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null);
            transition();
        }
    };

    const handleStartLab = () => {
        setCurrentStep('setup');
        setTeacherMessage("Perfect! See those three test tubes? One has pure oxygen. Let's test each one and find out which makes the splint burst into flame!");
    };

    const handleSelectTube = (tube: TubeContent) => {
        setSelectedTube(tube);
        setCurrentStep('select-tube');
        setShowSupplies(false);
        setTeacherMessage(`Great choice! You've selected the ${tube} tube. Now click 'Insert Glowing Splint' to test it. Watch carefully!`);
        toast({ title: `${tubes[tube].emoji} Tube Selected`, description: tubes[tube].description });
    };

    const handleInsertSplint = () => {
        if (!selectedTube) return;
        
        setCurrentStep('inserting');
        setIsAnimating(true);
        setTeacherMessage("Watch the glowing tip! I'm inserting the splint into the gas. Stay focused!");
        
        toast({ title: '✨ Inserting Splint...', description: 'Bringing the glowing splint close to the gas' });
        
        setTimeout(() => {
            setCurrentStep('result');
            const result = tubes[selectedTube].result;
            setTestResult(result);
            setIsAnimating(false);
            
            if (result === 'relight') {
                toast({ 
                    title: '🔥 Splint Relights!', 
                    description: 'The glowing splint bursts into bright flame - oxygen confirmed!',
                    className: 'bg-green-100 dark:bg-green-900 border-green-500'
                });
            } else if (result === 'extinguish') {
                toast({ 
                    title: '💨 Splint Goes Out!', 
                    description: 'The splint is extinguished - carbon dioxide present',
                    className: 'bg-purple-100 dark:bg-purple-900 border-purple-500'
                });
            } else {
                toast({ 
                    title: '🌬️ Continues Glowing', 
                    description: 'The splint continues to glow dimly - just regular air' 
                });
            }
            
            setPendingTransition(() => () => {
                setTimeout(() => {
                    setCurrentStep('complete');
                    setTeacherMessage("Excellent work on the experiment! Now let's check your understanding. Answer the quiz below - you've got this!");
                }, 800);
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
        setTeacherMessage("Ready to test another gas? Each one reacts differently! Remember - oxygen is the one that makes the splint burst into flame!");
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
            1: 'relight',
            2: 'supports',
            3: 'air'
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
            
            setTeacherMessage(`Outstanding! You earned ${earnedXP} XP - your total is now ${totalXP + earnedXP} XP! You've mastered the oxygen test. Well done!`);
        } else {
            if (newAttempts === 1) {
                setQuizFeedback(`You got ${correctCount} out of ${totalQuestions} correct. Review what you observed and try again! 🔄`);
                setTeacherMessage('Not quite there yet. Think about what happened when the glowing splint touched the gas. You can try again!');
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback(
                    `Correct answers: 1) Relights into flame 2) Supports combustion 3) About 21% in air. Study these key concepts! 🧠`
                );
                setTeacherMessage('Here are the correct answers. Make sure you understand WHY these are correct - this appears on exams!');
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
                            className="bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 text-white rounded-3xl p-8 shadow-2xl max-w-md mx-4"
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
            <Card className="border-2 border-cyan-200 dark:border-cyan-800">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Wind className="h-5 w-5 text-cyan-600" />
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
            <Card className="border-2 border-cyan-200 dark:border-cyan-800">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <CardTitle className="flex items-center gap-2">
                            <TestTube2 className="h-5 w-5 text-cyan-600" />
                            Interactive Oxygen Glowing Splint Test
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
                            <p className="text-muted-foreground mb-6">Follow the teacher's instructions to identify oxygen gas using the glowing splint test</p>
                            <Button 
                                onClick={handleStartLab}
                                size="lg"
                                className="bg-cyan-600 hover:bg-cyan-700"
                            >
                                Begin Experiment
                            </Button>
                        </motion.div>
                    )}

                    {/* Progress Steps */}
                    {currentStep !== 'intro' && (
                    <div className="flex items-center justify-between text-sm">
                        <div className={cn("flex items-center gap-2", (currentStep === 'setup' || currentStep === 'select-tube') && "text-cyan-600 font-semibold")}>
                            <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs", 
                                (currentStep === 'setup' || currentStep === 'select-tube') ? "bg-cyan-600 text-white" : currentStep === 'inserting' || currentStep === 'result' || currentStep === 'complete' ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                            )}>1</div>
                            <span className="hidden sm:inline">Select Gas</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2" />
                        <div className={cn("flex items-center gap-2", (currentStep === 'inserting' || currentStep === 'result') && "text-cyan-600 font-semibold")}>
                            <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs",
                                (currentStep === 'inserting' || currentStep === 'result' || currentStep === 'complete') ? "bg-cyan-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                            )}>2</div>
                            <span className="hidden sm:inline">Insert Splint</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2" />
                        <div className={cn("flex items-center gap-2", currentStep === 'complete' && "text-cyan-600 font-semibold")}>
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
                            <div className="text-center space-y-2 mb-6">
                                <h3 className="font-semibold text-xl">Step 1: Choose a Gas to Test</h3>
                                <p className="text-muted-foreground">Select a test tube to begin the glowing splint experiment</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {Object.values(tubes).map((tube) => (
                                    <motion.button
                                        key={tube.content}
                                        onClick={() => handleSelectTube(tube.content)}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-8 rounded-xl border-2 border-cyan-300 dark:border-cyan-700 bg-white dark:bg-gray-800 hover:border-cyan-500 hover:shadow-xl transition-all"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="text-5xl mb-2">{tube.emoji}</div>
                                            <div className="font-semibold text-lg">{tube.content}</div>
                                            <div className="text-sm text-muted-foreground text-center">{tube.description}</div>
                                            <div className="flex items-center gap-2 mt-2 text-cyan-600 dark:text-cyan-400 font-medium">
                                                <TestTube2 className="h-4 w-4" />
                                                <span className="text-sm">Click to Test</span>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Insert Glowing Splint */}
                    {(currentStep === 'select-tube' || currentStep === 'inserting' || currentStep === 'result' || currentStep === 'complete') && selectedTube && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">
                                    {currentStep === 'select-tube' && 'Step 2: Insert the Glowing Splint'}
                                    {currentStep === 'inserting' && 'Testing in Progress...'}
                                    {(currentStep === 'result' || currentStep === 'complete') && 'Test Complete!'}
                                </h3>
                                {currentStep === 'select-tube' && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-cyan-50 dark:bg-cyan-950 rounded-lg">
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
                                            <TestTube2 className="h-40 w-40 text-cyan-400" />
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">
                                                {tubes[selectedTube].emoji}
                                            </div>
                                        </div>
                                        <p className="text-sm mt-2 font-semibold">{selectedTube}</p>
                                    </motion.div>

                                    {/* Glowing Splint */}
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
                                                    {testResult === 'relight' && (currentStep === 'result' || currentStep === 'complete') ? (
                                                        <Flame className="absolute -top-8 left-1/2 -translate-x-1/2 h-10 w-10 text-orange-500" />
                                                    ) : (
                                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-red-600 animate-pulse" />
                                                    )}
                                                </div>
                                                <p className="text-xs mt-2">Glowing Splint</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Result Animation */}
                                    {testResult === 'relight' && (currentStep === 'result' || currentStep === 'complete') && (
                                        <motion.div
                                            className="absolute top-1/4 left-1/2 -translate-x-1/2"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
                                            transition={{ duration: 0.8 }}
                                        >
                                            <Flame className="h-20 w-20 text-orange-500" />
                                        </motion.div>
                                    )}
                                    
                                    {testResult === 'extinguish' && (currentStep === 'result' || currentStep === 'complete') && (
                                        <motion.div
                                            className="absolute top-1/4 left-1/2 -translate-x-1/2"
                                            initial={{ scale: 1, opacity: 1 }}
                                            animate={{ scale: 0, opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <div className="text-6xl">💨</div>
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
                                        <Sparkles className="h-4 w-4 text-cyan-600" />
                                        <span className="text-sm font-medium">Watch the splint...</span>
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
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Insert Glowing Splint
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

                    {/* Lab Supplies Drawer - Only shows when explicitly toggled */}
                    {showSupplies && currentStep !== 'intro' && currentStep !== 'complete' && currentStep !== 'setup' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Package className="h-5 w-5 text-amber-600" />
                                        Lab Supplies Reference
                                    </CardTitle>
                                    <CardDescription>Equipment information for the oxygen test</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {Object.values(tubes).map((tube) => (
                                                <div
                                                    key={tube.content}
                                                    className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700"
                                                >
                                                    <div className="flex flex-col items-center gap-2 text-center">
                                                        <div className="text-4xl">{tube.emoji}</div>
                                                        <span className="text-sm font-semibold">{tube.content}</span>
                                                        <span className="text-xs text-muted-foreground">{tube.description}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded">
                                            <strong>Tip:</strong> Pure oxygen will relight a glowing splint, while air (21% O₂) won't have enough oxygen to do so.
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </CardContent>
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
                                onClick={() => setPracticeInteraction('oxygen')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base">💫 About Oxygen</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {practiceInteraction === 'oxygen'
                                            ? "O₂ makes up 21% of air. Essential for life and combustion. Atomic number: 8. Used in hospitals, welding, and spacecraft!"
                                            : "Tap to learn about oxygen gas properties"}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card 
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setPracticeInteraction('test')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base">🔥 The Glowing Splint Test</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {practiceInteraction === 'test'
                                            ? "Pure oxygen relights a glowing splint because high O₂ concentration provides more oxidant for combustion. Air only has 21% O₂, not enough to relight!"
                                            : "Tap to understand why oxygen relights the splint"}
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
                                            ? "Oxygen accelerates burning! Keep it away from oils and flammable materials. Never smoke near oxygen cylinders!"
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
                                    <p className="text-base font-semibold mb-3">1. What happens when a glowing splint is placed in pure oxygen?</p>
                                    <RadioGroup 
                                        value={quizAnswers[1]} 
                                        onValueChange={(value) => handleAnswerChange(1, value)} 
                                        disabled={quizIsCorrect !== null}
                                    >
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="extinguish" id="q1-extinguish" />
                                            <Label htmlFor="q1-extinguish" className="flex-1 cursor-pointer">It goes out immediately</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="relight" id="q1-relight" />
                                            <Label htmlFor="q1-relight" className="flex-1 cursor-pointer">It relights into a bright flame</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="glow" id="q1-glow" />
                                            <Label htmlFor="q1-glow" className="flex-1 cursor-pointer">It continues to glow dimly</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="smoke" id="q1-smoke" />
                                            <Label htmlFor="q1-smoke" className="flex-1 cursor-pointer">It produces smoke</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Question 2 */}
                                <div>
                                    <p className="text-base font-semibold mb-3">2. What role does oxygen play in combustion?</p>
                                    <RadioGroup 
                                        value={quizAnswers[2]} 
                                        onValueChange={(value) => handleAnswerChange(2, value)} 
                                        disabled={quizIsCorrect !== null}
                                    >
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="prevents" id="q2-prevents" />
                                            <Label htmlFor="q2-prevents" className="flex-1 cursor-pointer">It prevents burning</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="supports" id="q2-supports" />
                                            <Label htmlFor="q2-supports" className="flex-1 cursor-pointer">It supports combustion</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="neutral" id="q2-neutral" />
                                            <Label htmlFor="q2-neutral" className="flex-1 cursor-pointer">It has no effect on burning</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="slows" id="q2-slows" />
                                            <Label htmlFor="q2-slows" className="flex-1 cursor-pointer">It slows down burning</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Question 3 */}
                                <div>
                                    <p className="text-base font-semibold mb-3">3. What percentage of oxygen is in regular air?</p>
                                    <RadioGroup 
                                        value={quizAnswers[3]} 
                                        onValueChange={(value) => handleAnswerChange(3, value)} 
                                        disabled={quizIsCorrect !== null}
                                    >
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="air" id="q3-air" />
                                            <Label htmlFor="q3-air" className="flex-1 cursor-pointer">About 21%</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="50" id="q3-50" />
                                            <Label htmlFor="q3-50" className="flex-1 cursor-pointer">About 50%</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="78" id="q3-78" />
                                            <Label htmlFor="q3-78" className="flex-1 cursor-pointer">About 78%</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <RadioGroupItem value="100" id="q3-100" />
                                            <Label htmlFor="q3-100" className="flex-1 cursor-pointer">100% (pure oxygen)</Label>
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
                    <Card className="border-2 border-cyan-200 dark:border-cyan-800">
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
                                    <span className="text-xl">🔥</span>
                                    <span><strong>Oxygen (O₂)</strong> relights a glowing splint by supporting combustion</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-xl">💫</span>
                                    <span>Pure oxygen has much higher concentration than air (100% vs 21%), enabling the relighting reaction</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-xl">⚠️</span>
                                    <span>Oxygen <strong>accelerates burning</strong> and must be kept away from flammable materials</span>
                                </li>
                            </ul>
                            <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg border border-cyan-200 dark:border-cyan-800">
                                <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400 mb-2">
                                    💡 Real-World Application
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    The glowing splint test is essential in chemistry labs to confirm oxygen production from reactions like 
                                    decomposition of hydrogen peroxide. Oxygen is used in hospitals for patients, in welding, and in spacecraft life support!
                                </p>
                            </div>
                            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">
                                    📝 Exam Tip
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Remember: <strong>Glowing splint relights = Oxygen gas</strong>. Don't confuse with hydrogen (gives a pop sound) 
                                    or carbon dioxide (extinguishes the splint). This is a very common exam question!
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
                            <LabNotes labId="oxygen-test-lab" labTitle="Oxygen Glowing Splint Test" />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>
        </div>
    );
}
