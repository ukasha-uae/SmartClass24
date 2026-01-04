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
import { LabSupplies, SupplyItem } from './LabSupplies';

type TestStep = 'intro' | 'collect-supplies' | 'select-salt' | 'load-sample' | 'heating' | 'observe' | 'result' | 'quiz' | 'complete';
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
    const [collectedSupplies, setCollectedSupplies] = React.useState<string[]>([]);
    
    const labSupplies: SupplyItem[] = [
        { id: 'bunsen-burner', name: 'Bunsen Burner', emoji: '🔥', description: 'Heat source' },
        { id: 'wire-loop', name: 'Nichrome Wire Loop', emoji: '🔬', description: 'To hold samples' },
        { id: 'safety-goggles', name: 'Safety Goggles', emoji: '🥽', description: 'Eye protection' },
        { id: 'metal-salts', name: 'Metal Salts', emoji: '⚗️', description: 'Test samples' },
    ];
    
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
        // Direct state updates - no pending transitions
    }, []);

    // Initial intro
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage('Welcome to the Flame Test Laboratory! Today we will identify different metal ions by observing the beautiful colors they produce when heated. Each metal has a unique color signature. Ready to see some chemistry magic? Click Start Experiment!');
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setCurrentStep('collect-supplies');
        setTeacherMessage("Before we begin, let's gather all the equipment we'll need for the flame test. Click each item to collect it!");
    };

    const handleCollectSupply = (itemId: string) => {
        if (!collectedSupplies.includes(itemId)) {
            setCollectedSupplies(prev => {
                const newCollected = [...prev, itemId];
                if (newCollected.length === labSupplies.length) {
                    setTeacherMessage("Perfect! All supplies collected! Now let's start the experiment. Click 'Continue to Experiment' to begin!");
                }
                return newCollected;
            });
            toast({ title: `✅ ${labSupplies.find(s => s.id === itemId)?.name} Collected` });
        }
    };

    const handleAllSuppliesCollected = () => {
        setTeacherMessage("Perfect! All supplies collected! Now let's start the experiment. Click 'Continue to Experiment' to begin!");
    };

    const handleContinueToExperiment = () => {
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
        
        // Transition to quiz after showing results - give students time to observe
        setTimeout(() => {
            setCurrentStep('quiz');
        }, 25000); // 25 seconds to allow teacher to finish explaining
    };

    const handleQuizSubmit = () => {
        // If already showing feedback and incorrect, allow retry by resetting
        if (quizIsCorrect === false) {
            setQuizAnswer('');
            setQuizFeedback(null);
            setQuizAttempts(0);
            setQuizIsCorrect(null);
            return;
        }
        
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
                setTimeout(() => {
                    setShowCelebration(false);
                    setCurrentStep('complete');
                }, 5000);
                
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
        setCollectedSupplies([]);
        setTeacherMessage('Welcome back! Ready to test another metal salt? Each one produces a different color. Click Start Experiment when ready!');
    };

    const objectiveText = "To identify different metal ions by observing the unique flame colors they produce when heated in a Bunsen burner flame.";
    const theoryText = "The flame test is a qualitative analytical technique used to detect metal ions based on their characteristic emission spectra. When metal salts are heated, their electrons absorb thermal energy and become excited to higher energy levels. As these electrons return to their ground state, they emit photons of specific wavelengths, producing distinct colors visible in the flame. Each metal has a unique electron configuration, resulting in a unique color signature.";
    const safetyText = "Safety is paramount in flame test experiments. Always wear safety goggles to protect eyes from flying particles and chemical splashes. Keep long hair tied back and remove loose clothing or jewelry. Handle the Bunsen burner with care, ensuring it's properly connected to the gas supply. The wire loop becomes extremely hot during testing - never touch it until it has cooled completely. Work in a well-ventilated area and know the location of fire extinguishers.";

    return (
        <div className="relative min-h-screen pb-20">
            {/* Premium Animated Background - Orange/Red Flame Theme */}
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
                {/* Teacher Voice */}
                <TeacherVoice 
                    message={teacherMessage}
                    onComplete={handleTeacherComplete}
                />

                {/* Completion Badge */}
                {hasCompleted && labProgress && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full">
                                <Trophy className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-orange-900 dark:text-orange-100">Lab Completed!</h3>
                                <p className="text-sm text-orange-700 dark:text-orange-300">
                                    Completed: {new Date(labProgress.completedAt || '').toLocaleDateString()} • 
                                    Total XP: {labProgress.xpEarned || 0}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                            <CardTitle className="flex items-center gap-2">
                                <Flame className="w-6 h-6 text-orange-600" />
                                Objective
                            </CardTitle>
                            <CardDescription>{objectiveText}</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
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
                    <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">🔥 Interactive Flame Test Lab</span>
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
                                        className="text-lg px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                                    >
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Start Experiment 🔥
                                    </Button>
                                </motion.div>
                            )}

                            {/* Collect Supplies Step */}
                            {currentStep === 'collect-supplies' && (
                                <motion.div
                                    key="collect-supplies"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    <LabSupplies
                                        supplies={labSupplies}
                                        collectedItems={collectedSupplies}
                                        onCollect={handleCollectSupply}
                                        onAllCollected={handleAllSuppliesCollected}
                                        requiredCount={labSupplies.length}
                                    />
                                    {collectedSupplies.length === labSupplies.length && (
                                        <Button
                                            onClick={handleContinueToExperiment}
                                            size="lg"
                                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                                        >
                                            Continue to Experiment
                                        </Button>
                                    )}
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
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
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
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
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
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                                    onClick={handleShowResult}
                                    data-action-button="result"
                                >
                                    <Eye className="h-5 w-5 mr-2" />
                                    View Detailed Result
                                </Button>
                            )}
                            
                            {currentStep !== 'intro' && currentStep !== 'collect-supplies' && currentStep !== 'complete' && (
                                <Button 
                                    variant="outline" 
                                    onClick={handleReset}
                                    className="w-full border-2 border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Reset & Try Another Salt
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </motion.div>

                {/* Quiz Section */}
                {currentStep === 'quiz' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        data-quiz-section
                    >
                        <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                                <CardTitle>Knowledge Check Quiz</CardTitle>
                                <CardDescription>Test your understanding of flame tests</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="font-medium text-lg">
                                    What causes the different colors observed in flame tests?
                                </p>
                                <div className="grid gap-3">
                                    {[
                                        { value: "The metal burning", label: "The metal burning at different temperatures" },
                                        { value: "Electrons moving between energy levels", label: "Electrons moving between energy levels", isCorrect: true },
                                        { value: "Chemical reactions with oxygen", label: "Chemical reactions with oxygen in the air" },
                                        { value: "Reflection of light", label: "Reflection of light by metal crystals" },
                                    ].map((option, idx) => {
                                        const isSelected = quizAnswer === option.value;
                                        const isCorrect = option.isCorrect;
                                        const showFeedback = quizIsCorrect !== null;
                                        const isWrong = showFeedback && isSelected && !isCorrect;
                                        
                                        return (
                                            <motion.button
                                                key={idx}
                                                onClick={() => {
                                                    if (quizIsCorrect === null) {
                                                        setQuizAnswer(option.value);
                                                    }
                                                }}
                                                disabled={showFeedback}
                                                className={cn(
                                                    "relative p-4 rounded-lg border-2 text-left transition-all",
                                                    "disabled:cursor-not-allowed",
                                                    !showFeedback && isSelected && "border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 shadow-md",
                                                    !showFeedback && !isSelected && "border-gray-200 dark:border-gray-700 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/50",
                                                    showFeedback && isCorrect && "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 shadow-md",
                                                    showFeedback && isWrong && "border-red-500 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 shadow-md",
                                                    showFeedback && !isSelected && !isCorrect && "border-gray-200 dark:border-gray-700 opacity-60"
                                                )}
                                                whileHover={!showFeedback ? { scale: 1.02, y: -2 } : {}}
                                                whileTap={!showFeedback ? { scale: 0.98 } : {}}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "flex items-center justify-center w-6 h-6 rounded-full border-2 flex-shrink-0",
                                                        isSelected && !showFeedback && "border-orange-500 bg-orange-500",
                                                        showFeedback && isCorrect && "border-green-500 bg-green-500",
                                                        showFeedback && isWrong && "border-red-500 bg-red-500",
                                                        !isSelected && !showFeedback && "border-gray-300 dark:border-gray-600"
                                                    )}>
                                                        {isSelected && (
                                                            <div className="w-3 h-3 rounded-full bg-white" />
                                                        )}
                                                    </div>
                                                    <span className="flex-1 font-medium">{option.label}</span>
                                                    {showFeedback && isCorrect && (
                                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                    )}
                                                    {showFeedback && isWrong && (
                                                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                                    )}
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                                
                                {quizFeedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
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
                                    disabled={!quizAnswer && quizIsCorrect === null}
                                    size="lg"
                                    className={cn(
                                        "w-full shadow-lg",
                                        quizIsCorrect === false
                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                            : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                                    )}
                                >
                                    {quizIsCorrect === true ? (
                                        <>
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            Correct! ✓
                                        </>
                                    ) : quizIsCorrect === false ? (
                                        <>
                                            <RefreshCw className="mr-2 h-5 w-5" />
                                            Try Again
                                        </>
                                    ) : quizAttempts === 1 ? (
                                        <>
                                            <RefreshCw className="mr-2 h-5 w-5" />
                                            Try Again
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            Submit Answer
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {/* Complete Step */}
                {currentStep === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative"
                    >
                        <Card className="border-2 border-yellow-300 dark:border-yellow-700 bg-gradient-to-br from-yellow-50/90 via-orange-50/90 to-red-50/90 dark:from-yellow-950/90 dark:via-orange-950/90 dark:to-red-950/90 backdrop-blur-sm shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 animate-pulse" />
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
                                <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                                    Lab Complete!
                                </h2>
                                {xpEarned > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="flex items-center justify-center gap-2 text-3xl font-black text-orange-600 dark:text-orange-400"
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
                                            <span>How to identify metal ions using flame tests</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>The unique flame colors produced by different metals</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>How electron transitions cause colored flames</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>The relationship between wavelength and flame color</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>Safety procedures for working with flames</span>
                                        </li>
                                    </ul>
                                </div>
                                <Button 
                                    onClick={handleReset} 
                                    variant="outline" 
                                    className="mt-6 border-2 border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                                    size="lg"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Try Again
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

            </div>
        </div>
    );
}
