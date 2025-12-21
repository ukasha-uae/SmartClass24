'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Flame, Sparkles, Zap, TestTube2, Volume2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { motion, AnimatePresence } from 'framer-motion';

type TestStep = 'setup' | 'select-tube' | 'inserting' | 'result' | 'complete';
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
    const [currentStep, setCurrentStep] = React.useState<TestStep>('setup');
    const [selectedTube, setSelectedTube] = React.useState<TubeContent | null>(null);
    const [testResult, setTestResult] = React.useState<'pop' | 'relight' | 'nothing' | null>(null);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [showPractice, setShowPractice] = React.useState(false);
    const [practiceInteraction, setPracticeInteraction] = React.useState<'hydrogen' | 'test' | 'safety' | null>(null);
    const audioCtxRef = React.useRef<AudioContext | null>(null);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

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

    const handleSelectTube = (tube: TubeContent) => {
        setSelectedTube(tube);
        setCurrentStep('select-tube');
        toast({ title: `${tubes[tube].emoji} Tube Selected`, description: tubes[tube].description });
    };

    const handleInsertSplint = () => {
        if (!selectedTube) return;
        
        setCurrentStep('inserting');
        setIsAnimating(true);
        
        toast({ title: '🔥 Inserting Splint...', description: 'Bringing the burning splint close to the gas' });
        
        setTimeout(() => {
            setCurrentStep('result');
            const result = tubes[selectedTube].result;
            setTestResult(result);
            
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
            
            setTimeout(() => {
                setCurrentStep('complete');
                setIsAnimating(false);
            }, 1500);
        }, 2000);
    };

    const handleReset = () => {
        setCurrentStep('setup');
        setSelectedTube(null);
        setTestResult(null);
        setIsAnimating(false);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        toast({ title: '🔄 Lab Reset', description: 'Try testing another gas' });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'pop';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! The 'pop' sound is the characteristic test for hydrogen gas. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Think about the distinct sound hydrogen makes when it burns. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("The correct answer is 'Pop'. Hydrogen burns rapidly with oxygen, producing a characteristic popping sound. 🧠");
            }
        }
    };

    const objectiveText = "To confirm the presence of hydrogen gas using the characteristic 'pop' sound produced when a burning splint is introduced into the gas.";
    const theoryText = "Hydrogen (H₂) is a highly flammable, colorless, odorless gas. When hydrogen comes into contact with a flame, it reacts explosively with oxygen in the air to form water (2H₂ + O₂ → 2H₂O). This rapid combustion produces a distinctive 'pop' or 'squeaky pop' sound, making it a reliable test for identifying hydrogen gas in the laboratory.";
    const safetyText = "Always wear safety goggles and work in a well-ventilated area. Hydrogen is extremely flammable - keep away from open flames except during the test. Only test small quantities of gas. Never test hydrogen in enclosed spaces. Ensure the burning splint is held at arm's length when testing.";

    return (
        <div className="space-y-6">
            {/* Objective */}
            <Card className="border-2 border-orange-200 dark:border-orange-800">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-orange-600" />
                            Objective
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
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <TestTube2 className="h-5 w-5 text-violet-600" />
                            Hydrogen Pop Test Experiment
                        </CardTitle>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowPractice(!showPractice)}
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            {showPractice ? 'Hide' : 'Show'} Practice Mode
                        </Button>
                    </div>
                    <CardDescription>Test different gases with a burning splint</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Progress Steps */}
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

                    {/* Step 1: Select Gas Tube */}
                    {(currentStep === 'setup') && (
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
                                        Test Another Gas
                                    </Button>
                                )}
                            </div>
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
                            Practice Mode - Learn More
                        </CardTitle>
                        <CardDescription>Click on cards to explore</CardDescription>
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
                                            ? "H₂ is the lightest element, colorless, odorless, and highly flammable. Used in fuel cells and as rocket fuel!"
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
                <Card className="border-2 border-green-200 dark:border-green-800">
                    <CardHeader>
                        <CardTitle>Knowledge Check</CardTitle>
                        <CardDescription>What sound confirms the presence of hydrogen gas?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup value={quizAnswer} onValueChange={setQuizAnswer} disabled={quizIsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                <RadioGroupItem value="hiss" id="q-hiss" />
                                <Label htmlFor="q-hiss" className="flex-1 cursor-pointer">Hiss</Label>
                            </div>
                            <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                <RadioGroupItem value="pop" id="q-pop" />
                                <Label htmlFor="q-pop" className="flex-1 cursor-pointer">Pop</Label>
                            </div>
                            <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                <RadioGroupItem value="crackle" id="q-crackle" />
                                <Label htmlFor="q-crackle" className="flex-1 cursor-pointer">Crackle</Label>
                            </div>
                            <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                <RadioGroupItem value="whistle" id="q-whistle" />
                                <Label htmlFor="q-whistle" className="flex-1 cursor-pointer">Whistle</Label>
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
                            <span className="text-xl">💥</span>
                            <span><strong>Hydrogen</strong> burns with a characteristic 'pop' sound when tested with a burning splint</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-xl">🔥</span>
                            <span><strong>Oxygen</strong> relights a glowing splint</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-xl">🌬️</span>
                            <span><strong>Air</strong> shows no special reaction</span>
                        </li>
                    </ul>
                    <p className="mt-4 text-sm font-semibold text-violet-600 dark:text-violet-400">
                        💡 Remember: 2H₂ + O₂ → 2H₂O + Energy (with a pop!)
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
