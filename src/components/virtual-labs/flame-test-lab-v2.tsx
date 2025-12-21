'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { 
    CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Flame, 
    Atom, Eye, EyeOff, Beaker, TestTube, Sparkles, Trophy, Award 
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherVoice } from './TeacherVoice';
import { useLabProgress } from '@/stores/lab-progress-store';
import confetti from 'canvas-confetti';

type TestStep = 'intro' | 'select-salt' | 'load-sample' | 'heating' | 'observe' | 'result' | 'quiz';
type MetalSalt = 'Lithium Chloride' | 'Sodium Chloride' | 'Potassium Chloride' | 'Copper Sulfate' | 'Calcium Chloride' | 'Barium Chloride';

interface SaltInfo {
    name: MetalSalt;
    ion: string;
    colorName: string;
    flameColor: string;
    spectralLine: number;
    description: string;
}

const metalSalts: Record<MetalSalt, SaltInfo> = {
    'Lithium Chloride': { 
        name: 'Lithium Chloride', 
        ion: 'Li⁺', 
        colorName: 'Crimson Red', 
        flameColor: '#DC143C',
        spectralLine: 670,
        description: 'Bright crimson red flame, easily identifiable'
    },
    'Sodium Chloride': { 
        name: 'Sodium Chloride', 
        ion: 'Na⁺', 
        colorName: 'Intense Yellow', 
        flameColor: '#FFD700',
        spectralLine: 589,
        description: 'Very bright yellow-orange, most intense'
    },
    'Potassium Chloride': { 
        name: 'Potassium Chloride', 
        ion: 'K⁺', 
        colorName: 'Lilac Purple', 
        flameColor: '#C084FC',
        spectralLine: 766,
        description: 'Pale violet-purple, harder to see'
    },
    'Copper Sulfate': { 
        name: 'Copper Sulfate', 
        ion: 'Cu²⁺', 
        colorName: 'Blue-Green', 
        flameColor: '#14B8A6',
        spectralLine: 515,
        description: 'Distinctive blue-green color'
    },
    'Calcium Chloride': { 
        name: 'Calcium Chloride', 
        ion: 'Ca²⁺', 
        colorName: 'Orange-Red', 
        flameColor: '#FF4500',
        spectralLine: 622,
        description: 'Brick orange-red flame'
    },
    'Barium Chloride': { 
        name: 'Barium Chloride', 
        ion: 'Ba²⁺', 
        colorName: 'Pale Green', 
        flameColor: '#90EE90',
        spectralLine: 524,
        description: 'Yellowish-green flame'
    },
};

const saltOptions: MetalSalt[] = ['Lithium Chloride', 'Sodium Chloride', 'Potassium Chloride', 'Copper Sulfate', 'Calcium Chloride', 'Barium Chloride'];

export function FlameTestLabEnhanced() {
    const { toast } = useToast();
    
    // Lab state
    const [currentStep, setCurrentStep] = React.useState<TestStep>('intro');
    const [selectedSalt, setSelectedSalt] = React.useState<MetalSalt | null>(null);
    const [currentFlame, setCurrentFlame] = React.useState<SaltInfo | null>(null);
    const [showSafetyGear, setShowSafetyGear] = React.useState(true);
    const [isHeating, setIsHeating] = React.useState(false);
    const [flameIntensity, setFlameIntensity] = React.useState(0);
    
    // Teacher voice
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Quiz
    const [quizAnswer, setQuizAnswer] = React.useState<string>('');
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);
    
    // XP & Celebration
    const { markLabComplete, isLabCompleted, getLabCompletion, totalXP } = useLabProgress();
    const [xpEarned, setXpEarned] = React.useState(0);
    const [showCelebration, setShowCelebration] = React.useState(false);
    const [startTime] = React.useState(Date.now());
    const hasCompleted = isLabCompleted('flame-test');
    const labProgress = getLabCompletion('flame-test');
    
    // Heating animation effect
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHeating && flameIntensity < 100) {
            interval = setInterval(() => {
                setFlameIntensity(prev => Math.min(prev + 5, 100));
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isHeating, flameIntensity]);

    // Complete heating when intensity reaches 100
    React.useEffect(() => {
        if (flameIntensity >= 100 && currentStep === 'heating' && selectedSalt) {
            const saltInfo = metalSalts[selectedSalt];
            setCurrentFlame(saltInfo);
            setIsHeating(false);
            
            setTimeout(() => {
                setCurrentStep('observe');
                setTeacherMessage(`Beautiful! Look at that ${saltInfo.colorName} flame! This color is produced by ${saltInfo.ion} ions. ${saltInfo.description}. When you're ready, click to see the detailed result.`);
            }, 500);
        }
    }, [flameIntensity, currentStep, selectedSalt]);

    // Teacher message callbacks
    const handleTeacherComplete = React.useCallback(() => {
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null);
            transition();
        }
    }, [pendingTransition]);

    // Initial intro
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage('Welcome to the Flame Test Laboratory! Today we will identify different metal ions by observing the beautiful colors they produce when heated. Each metal has a unique color signature. Ready to see some chemistry magic? Click Start Experiment!');
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setCurrentStep('select-salt');
        setTeacherMessage('First, choose a metal salt to test. We have six different metal salts: Lithium, Sodium, Potassium, Copper, Calcium, and Barium. Each one will produce a different colored flame. Which one would you like to test first?');
    };

    const handleSaltSelect = (salt: MetalSalt) => {
        setSelectedSalt(salt);
        const saltInfo = metalSalts[salt];
        
        const messages: Record<MetalSalt, string> = {
            'Lithium Chloride': `Great choice! Lithium chloride contains lithium ions, Li plus. It's known for producing a beautiful crimson red flame at 670 nanometers. Click Load Sample to prepare it.`,
            'Sodium Chloride': `Excellent! Sodium chloride is common table salt! It contains sodium ions, Na plus, which produce the most intense yellow flame at 589 nanometers. Click Load Sample to continue.`,
            'Potassium Chloride': `Interesting selection! Potassium chloride has potassium ions, K plus. It produces a pale lilac or purple flame at 766 nanometers. This one can be tricky to see! Click Load Sample.`,
            'Copper Sulfate': `Perfect! Copper sulfate contains copper two plus ions. It's famous for its distinctive blue-green flame at 515 nanometers. Very beautiful! Click Load Sample to proceed.`,
            'Calcium Chloride': `Good choice! Calcium chloride has calcium ions, Ca two plus. It produces a brick orange-red flame at 622 nanometers. Click Load Sample to get started.`,
            'Barium Chloride': `Nice! Barium chloride contains barium ions, Ba two plus. It produces a yellowish-green flame at 524 nanometers. Click Load Sample to prepare the test.`
        };
        
        setTeacherMessage(messages[salt]);
        setPendingTransition(() => () => {
            setTimeout(() => {
                const actionButton = document.querySelector('[data-action-button="load"]');
                actionButton?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
    };

    const handleLoadSample = () => {
        if (!selectedSalt) return;
        
        setCurrentStep('load-sample');
        setTeacherMessage(`Loading ${selectedSalt} onto the nichrome wire loop... In a real lab, you would dip the wire into the salt solution. The wire must be clean to avoid contamination. Now we're ready to heat it!`);
        
        setTimeout(() => {
            setCurrentStep('heating');
            setTeacherMessage('Click the Start Heating button to place the wire in the Bunsen burner flame. Watch carefully as the salt begins to glow with its characteristic color!');
        }, 2500);
    };

    const handleStartHeating = () => {
        setIsHeating(true);
        setFlameIntensity(0);
        setTeacherMessage('Heating the sample... Watch as the electrons in the metal ions absorb energy and become excited! As they return to ground state, they emit light of specific wavelengths, creating the colored flame you see.');
    };

    const handleShowResult = () => {
        if (!currentFlame) return;
        
        setCurrentStep('result');
        setTeacherMessage(`Test complete! The ${currentFlame.colorName} flame confirms the presence of ${currentFlame.ion} ions. This color occurs at a wavelength of ${currentFlame.spectralLine} nanometers. Each metal has a unique electron configuration, producing its own color signature. Ready to test your knowledge with a quiz?`);
        
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
            setTimeout(() => {
                const quizSection = document.querySelector('[data-quiz-section]');
                quizSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        
        const correctAnswer = 'Electrons moving between energy levels';
        const isCorrect = quizAnswer === correctAnswer;
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Perfect! When heated, electrons absorb thermal energy and jump to higher energy levels. As they fall back down, they emit photons of specific wavelengths, producing the characteristic colors we observe. ✅");
            
            if (!hasCompleted) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                const score = newAttempts === 1 ? 100 : 75;
                const earnedXP = markLabComplete('flame-test', score, timeSpent);
                
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                
                setXpEarned(earnedXP);
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 5000);
                
                setTeacherMessage(`Excellent work! You've mastered flame tests and earned ${earnedXP} XP! You now have ${totalXP + earnedXP} total XP. Remember, flame tests are used by chemists to identify unknown substances!`);
            } else {
                setTeacherMessage('Correct! You clearly understand the quantum mechanics behind flame colors. Great job!');
            }
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite. Think about what happens inside atoms when they are heated. What happens to the electrons? Try again! 🔄");
                setTeacherMessage('Think about the electrons in the metal atoms. When you heat them, they gain energy. What do they do with that energy, and what happens when they release it?');
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback(`The correct answer is ${correctAnswer}. When electrons transition between energy levels, they emit photons with specific wavelengths that correspond to the colors we see. 🧠`);
                setTeacherMessage('The key is electron transitions. When electrons fall from higher to lower energy levels, they release energy as light. The energy difference determines the color we observe.');
            }
        }
    };

    const handleReset = () => {
        setCurrentStep('intro');
        setSelectedSalt(null);
        setCurrentFlame(null);
        setIsHeating(false);
        setFlameIntensity(0);
        setQuizAnswer('');
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setXpEarned(0);
        setShowCelebration(false);
        setTeacherMessage('Welcome back! Ready to test another metal salt? Each one produces a different color. Click Start Experiment when ready!');
    };

    const objectiveText = "To identify different metal ions by observing the unique flame colors they produce when heated in a Bunsen burner flame.";
    const theoryText = "The flame test is a qualitative analytical technique used to detect metal ions based on their characteristic emission spectra. When metal salts are heated, their electrons absorb thermal energy and become excited to higher energy levels. As these electrons return to their ground state, they emit photons of specific wavelengths, producing distinct colors visible in the flame. Each metal has a unique electron configuration, resulting in a unique color signature.";
    const safetyText = "Safety is paramount in flame test experiments. Always wear safety goggles to protect eyes from flying particles and chemical splashes. Keep long hair tied back and remove loose clothing or jewelry. Handle the Bunsen burner with care, ensuring it's properly connected to the gas supply. The wire loop becomes extremely hot during testing - never touch it until it has cooled completely. Work in a well-ventilated area and know the location of fire extinguishers.";

    return (
        <div className="space-y-6">
            {/* Completion Badge */}
            {hasCompleted && labProgress && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-xl border-2 border-amber-300 dark:border-amber-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500 rounded-full">
                            <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-amber-900 dark:text-amber-100">Lab Completed!</div>
                            <div className="text-sm text-amber-700 dark:text-amber-300">
                                Score: {labProgress.score}%
                            </div>
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-amber-200 text-amber-900">
                        <Award className="h-3 w-3 mr-1" />
                        {labProgress.xpEarned} XP
                    </Badge>
                </motion.div>
            )}

            {/* Teacher Voice */}
            {teacherMessage && (
                <TeacherVoice 
                    message={teacherMessage}
                    onComplete={handleTeacherComplete}
                />
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Objective</CardTitle>
                    <CardDescription>{objectiveText}</CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lab Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    <span>Background Theory</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                                <p>{theoryText}</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    <span>Safety Precautions</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                                <p>{safetyText}</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            {/* Main Lab Interface */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>🔥 Interactive Flame Test Lab</span>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowSafetyGear(!showSafetyGear)}
                            className={cn("transition-colors", showSafetyGear && "border-green-500 text-green-600")}
                        >
                            {showSafetyGear ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                            Safety {showSafetyGear ? 'ON' : 'OFF'}
                        </Button>
                    </CardTitle>
                    <CardDescription>Discover the rainbow of flame colors produced by different metal ions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Start Button */}
                    {currentStep === 'intro' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-12 space-y-4"
                        >
                            <Flame className="h-24 w-24 text-orange-500" />
                            <Button 
                                size="lg" 
                                onClick={handleStartExperiment}
                                className="text-lg px-8"
                            >
                                Start Experiment 🔥
                            </Button>
                        </motion.div>
                    )}

                    {/* Salt Selection */}
                    {currentStep === 'select-salt' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <Label className="text-lg font-semibold flex items-center gap-2">
                                <Beaker className="h-5 w-5" />
                                Select a Metal Salt
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {saltOptions.map(salt => {
                                    const saltInfo = metalSalts[salt];
                                    return (
                                        <motion.div key={salt} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button 
                                                variant={selectedSalt === salt ? 'default' : 'outline'}
                                                onClick={() => handleSaltSelect(salt)}
                                                className="h-auto w-full flex-col gap-2 py-4"
                                            >
                                                <div 
                                                    className="w-8 h-8 rounded-full border-2"
                                                    style={{ 
                                                        backgroundColor: saltInfo.flameColor,
                                                        boxShadow: `0 0 15px ${saltInfo.flameColor}` 
                                                    }}
                                                />
                                                <div className="text-center">
                                                    <div className="text-xs font-bold">{saltInfo.ion}</div>
                                                    <div className="text-xs opacity-75">{salt}</div>
                                                </div>
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Flame Visualization */}
                    {(currentStep === 'load-sample' || currentStep === 'heating' || currentStep === 'observe' || currentStep === 'result') && (
                        <div className="relative flex items-center justify-center p-8 bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl border-2 min-h-[500px]">
                            {/* Lab bench */}
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-900/30 to-transparent" />
                            
                            {/* Bunsen Burner & Flame */}
                            <div className="relative flex flex-col items-center">
                                {/* Wire loop with sample */}
                                {selectedSalt && (
                                    <motion.div
                                        className="absolute -top-20 left-1/2 -translate-x-1/2"
                                        animate={isHeating ? { 
                                            y: [0, -5, 0],
                                            rotate: [0, 2, -2, 0]
                                        } : {}}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    >
                                        <div className="relative">
                                            {/* Wire loop */}
                                            <div className="w-2 h-16 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full mx-auto" />
                                            <div className="w-12 h-12 border-4 border-gray-400 rounded-full mx-auto -mt-2" />
                                            {/* Salt sample */}
                                            <div 
                                                className="absolute top-12 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
                                                style={{ 
                                                    backgroundColor: metalSalts[selectedSalt].flameColor,
                                                    opacity: currentFlame ? 0.8 : 0.3
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Flame */}
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative"
                                    >
                                        {/* Base flame (always blue/orange) */}
                                        <motion.div
                                            animate={{ 
                                                scale: [1, 1.1, 0.95, 1],
                                                rotate: [0, -3, 3, 0]
                                            }}
                                            transition={{ repeat: Infinity, duration: 0.8 }}
                                            className="relative"
                                        >
                                            <Flame className="h-32 w-32 text-orange-500" />
                                            <Flame className="h-32 w-32 text-yellow-400 absolute inset-0 opacity-60" />
                                            <Flame className="h-24 w-24 text-blue-400 absolute inset-0 m-auto opacity-80" />
                                        </motion.div>

                                        {/* Colored flame overlay */}
                                        {currentFlame && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ 
                                                    opacity: flameIntensity / 100,
                                                    scale: 1
                                                }}
                                                className="absolute inset-0 flex items-center justify-center"
                                            >
                                                <motion.div
                                                    animate={{ 
                                                        scale: [1, 1.2, 0.9, 1],
                                                        rotate: [0, -5, 5, 0]
                                                    }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                    style={{ filter: 'blur(15px)' }}
                                                >
                                                    <div 
                                                        className="h-40 w-40 rounded-full"
                                                        style={{ 
                                                            backgroundColor: currentFlame.flameColor,
                                                            boxShadow: `0 0 80px 40px ${currentFlame.flameColor}`
                                                        }}
                                                    />
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Burner base */}
                                <div className="w-24 h-12 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-xl border-t-2 border-gray-500" />
                                <div className="w-20 h-3 bg-gray-700 rounded-full mt-1" />
                            </div>

                            {/* Safety gear indicator */}
                            {showSafetyGear && (
                                <div className="absolute top-4 left-4 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg border border-green-500 flex items-center gap-2">
                                    <div className="text-2xl">🥽</div>
                                    <div className="text-xs font-semibold text-green-700 dark:text-green-400">Safety ON</div>
                                </div>
                            )}

                            {/* Color info */}
                            {currentFlame && (
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border-2" style={{ borderColor: currentFlame.flameColor }}>
                                    <div className="font-bold text-lg" style={{ color: currentFlame.flameColor }}>
                                        {currentFlame.colorName}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {currentFlame.ion} • {currentFlame.spectralLine} nm
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Result Display */}
                    <AnimatePresence>
                        {currentFlame && currentStep === 'result' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 rounded-xl border-2"
                                style={{ 
                                    background: `linear-gradient(to bottom right, ${currentFlame.flameColor}15, ${currentFlame.flameColor}25)`,
                                    borderColor: currentFlame.flameColor
                                }}
                            >
                                <div className="flex items-start gap-4">
                                    <div 
                                        className="p-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: currentFlame.flameColor }}
                                    >
                                        <CheckCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h3 className="font-bold text-lg">
                                            Flame Test Result ✓
                                        </h3>
                                        <p className="font-medium">
                                            {currentFlame.description}
                                        </p>
                                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                                            <div>
                                                <div className="text-xs font-semibold opacity-75 mb-1">Metal Ion</div>
                                                <div className="text-sm font-bold">{currentFlame.ion}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold opacity-75 mb-1">Flame Color</div>
                                                <div className="text-sm font-bold">{currentFlame.colorName}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold opacity-75 mb-1">Wavelength</div>
                                                <div className="text-sm font-bold">{currentFlame.spectralLine} nm</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    {currentStep === 'select-salt' && selectedSalt && (
                        <Button 
                            size="lg" 
                            className="w-full"
                            onClick={handleLoadSample}
                            data-action-button="load"
                        >
                            <TestTube className="h-5 w-5 mr-2" />
                            Load Sample onto Wire
                        </Button>
                    )}
                    
                    {currentStep === 'heating' && !isHeating && (
                        <Button 
                            size="lg" 
                            className="w-full bg-orange-600 hover:bg-orange-700"
                            onClick={handleStartHeating}
                            data-action-button="heat"
                        >
                            <Flame className="h-5 w-5 mr-2" />
                            Start Heating
                        </Button>
                    )}
                    
                    {currentStep === 'heating' && isHeating && (
                        <div className="w-full space-y-2">
                            <div className="text-sm text-center font-medium">Heating... {Math.round(flameIntensity)}%</div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-orange-500"
                                    style={{ width: `${flameIntensity}%` }}
                                />
                            </div>
                        </div>
                    )}
                    
                    {currentStep === 'observe' && currentFlame && (
                        <Button 
                            size="lg" 
                            className="w-full"
                            onClick={handleShowResult}
                            data-action-button="result"
                        >
                            <Eye className="h-5 w-5 mr-2" />
                            View Detailed Result
                        </Button>
                    )}
                    
                    {currentStep !== 'intro' && (
                        <Button 
                            variant="outline" 
                            onClick={handleReset}
                            className="w-full"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset & Try Another Salt
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {/* Quiz Section */}
            {currentStep === 'quiz' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    data-quiz-section
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Knowledge Check Quiz</CardTitle>
                            <CardDescription>Test your understanding of flame tests</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="font-medium">
                                What causes the different colors observed in flame tests?
                            </p>
                            <RadioGroup 
                                value={quizAnswer} 
                                onValueChange={setQuizAnswer}
                                disabled={quizIsCorrect !== null}
                            >
                                <div className="flex items-center space-x-2 py-2">
                                    <RadioGroupItem value="The metal burning" id="q-burning" />
                                    <Label htmlFor="q-burning" className="cursor-pointer">The metal burning at different temperatures</Label>
                                </div>
                                <div className="flex items-center space-x-2 py-2">
                                    <RadioGroupItem value="Electrons moving between energy levels" id="q-electrons" />
                                    <Label htmlFor="q-electrons" className="cursor-pointer">Electrons moving between energy levels</Label>
                                </div>
                                <div className="flex items-center space-x-2 py-2">
                                    <RadioGroupItem value="Chemical reactions with oxygen" id="q-oxygen" />
                                    <Label htmlFor="q-oxygen" className="cursor-pointer">Chemical reactions with oxygen in the air</Label>
                                </div>
                                <div className="flex items-center space-x-2 py-2">
                                    <RadioGroupItem value="Reflection of light" id="q-reflection" />
                                    <Label htmlFor="q-reflection" className="cursor-pointer">Reflection of light by metal crystals</Label>
                                </div>
                            </RadioGroup>
                            
                            {quizFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={cn(
                                        "p-4 rounded-lg border-2 flex items-start gap-3",
                                        quizIsCorrect 
                                            ? "bg-green-50 dark:bg-green-950/30 border-green-500 text-green-900 dark:text-green-100"
                                            : quizIsCorrect === false
                                            ? "bg-red-50 dark:bg-red-950/30 border-red-500 text-red-900 dark:text-red-100"
                                            : "bg-blue-50 dark:bg-blue-950/30 border-blue-500 text-blue-900 dark:text-blue-100"
                                    )}
                                >
                                    {quizIsCorrect ? (
                                        <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    ) : quizIsCorrect === false ? (
                                        <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <Sparkles className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    )}
                                    <p className="text-sm font-medium">{quizFeedback}</p>
                                </motion.div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button 
                                onClick={handleQuizSubmit} 
                                disabled={!quizAnswer || quizIsCorrect !== null}
                                size="lg"
                            >
                                {quizIsCorrect === true ? "Correct! ✓" : quizIsCorrect === false ? "Review Answer" : quizAttempts === 1 ? "Try Again" : "Submit Answer"}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            )}

            {/* XP Celebration */}
            <AnimatePresence>
                {showCelebration && xpEarned > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed bottom-8 right-8 z-50"
                    >
                        <div className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-300">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-full">
                                    <Sparkles className="h-8 w-8" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">+{xpEarned} XP</div>
                                    <div className="text-sm opacity-90">Lab Complete!</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
