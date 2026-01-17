'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Sparkles, Trophy, Award, GripVertical, TestTube, Droplets, Beaker, Thermometer } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { LabSupplies, SupplyItem } from './LabSupplies';

type Step = 'intro' | 'collect-supplies' | 'experiment' | 'results' | 'quiz' | 'complete';

export function NeutralizationReactionLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [collectedSupplies, setCollectedSupplies] = React.useState<string[]>([]);
    
    const labSupplies: SupplyItem[] = [
        { id: 'beaker', name: 'Beaker', emoji: '🧪', description: 'Container for the reaction' },
        { id: 'hcl', name: 'HCl (Acid)', emoji: '⚗️', description: 'Hydrochloric acid' },
        { id: 'naoh', name: 'NaOH (Base)', emoji: '🧪', description: 'Sodium hydroxide' },
        { id: 'thermometer', name: 'Thermometer', emoji: '🌡️', description: 'Measure temperature change' },
    ];
    
    // Experiment state
    const [reactants, setReactants] = React.useState<'idle' | 'mixing' | 'reacting' | 'complete'>('idle');
    const [temperature, setTemperature] = React.useState(20);
    const [productShown, setProductShown] = React.useState(false);
    const [pH, setPH] = React.useState(7);
    const [trials, setTrials] = React.useState(0);
    
    // Quiz state
    const [quizAnswer1, setQuizAnswer1] = React.useState<string | undefined>();
    const [quizAnswer2, setQuizAnswer2] = React.useState<string | undefined>();
    const [quizAnswer3, setQuizAnswer3] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState('');
    const [quizSubmitted, setQuizSubmitted] = React.useState(false);
    
    // XP and completion
    const [xpEarned, setXpEarned] = React.useState(0);
    const [showCelebration, setShowCelebration] = React.useState(false);
    const { markLabComplete, isLabCompleted, getLabCompletion } = useLabProgress();
    const labId = 'neutralization-reaction';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to Neutralization Reaction Lab! When an acid and a base mix, they neutralize each other in an exothermic reaction. We'll observe HCl (hydrochloric acid) reacting with NaOH (sodium hydroxide) to produce salt and water. Let's gather our supplies first!");
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setTeacherMessage("Great! Let's gather our supplies. Click on each item to collect them for your experiment!");
        setCurrentStep('collect-supplies');
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
        setCurrentStep('experiment');
        setTeacherMessage("All supplies ready! Now we'll combine these reactants and observe the neutralization reaction. Watch for the temperature increase!");
    };
    
    const handlePerformReaction = () => {
        if (reactants !== 'idle') return;
        
        setReactants('mixing');
        setTrials(trials + 1);
        setTeacherMessage("Starting the reaction... HCl and NaOH are mixing!");
        
        setTimeout(() => {
            setReactants('reacting');
            let tempStep = 0;
            const tempInterval = setInterval(() => {
                tempStep++;
                setTemperature(prev => Math.min(prev + 4, 45));
                setPH(prev => Math.max(prev - 0.8, 7));
                
                if (tempStep >= 5) {
                    clearInterval(tempInterval);
                    setReactants('complete');
                    setProductShown(true);
                    setTeacherMessage("Perfect! The reaction is complete. Notice how the temperature increased - this is an exothermic reaction! The pH changed from acidic to neutral (pH 7), showing complete neutralization!");
                    toast({ title: '✅ Neutralization Complete!', description: `Final temp: 45°C, pH: 7 (neutral)` });
                }
            }, 300);
        }, 1000);
    };
    
    const handleTeacherComplete = () => {
        // Direct state updates - no pending transitions
    };

    const handleViewResults = () => {
        setTeacherMessage("Excellent work! You successfully demonstrated a neutralization reaction. HCl + NaOH → NaCl + H₂O. The temperature increased from 20°C to 45°C, and the pH changed to 7 (neutral). Now let's test your understanding!");
        setCurrentStep('results');
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Let's test your understanding of neutralization reactions with these questions!");
        // Transition to quiz after showing results - give students time to observe
        setTimeout(() => {
            setCurrentStep('quiz');
        }, 25000); // 25 seconds to allow teacher to finish explaining
    };

    const handleQuizSubmit = () => {
        // If already correct, don't allow resubmission
        if (quizSubmitted && quizFeedback.includes('all 3')) return;
        
        // If wrong and showing answers, allow retry by resetting
        if (quizSubmitted && !quizFeedback.includes('all 3')) {
            setQuizAnswer1(undefined);
            setQuizAnswer2(undefined);
            setQuizAnswer3(undefined);
            setQuizFeedback('');
            setQuizSubmitted(false);
            return;
        }
        
        let correctCount = 0;
        if (quizAnswer1 === 'salt-water') correctCount++;
        if (quizAnswer2 === 'exothermic') correctCount++;
        if (quizAnswer3 === 'neutral') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand neutralization! +${earnedXP} XP`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Remember: Acid + Base → Salt + Water.`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. A neutralization reaction produces salt and water, and it's exothermic (releases heat).`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setCollectedSupplies([]);
        setReactants('idle');
        setTemperature(20);
        setProductShown(false);
        setPH(7);
        setTrials(0);
        setQuizAnswer1(undefined);
        setQuizAnswer2(undefined);
        setQuizAnswer3(undefined);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setTeacherMessage("Ready to explore neutralization reactions again!");
    };

    return (
        <div className="relative min-h-screen pb-20">
            {/* Premium Animated Background - Purple/Pink Neutralization Theme */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-indigo-950/30" />
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-purple-200/40 to-pink-300/40 dark:from-purple-800/20 dark:to-pink-900/20 blur-3xl"
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
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
            />

            {currentStep === 'intro' && isCompleted && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                            <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-purple-900 dark:text-purple-100">Lab Completed!</h3>
                            <p className="text-sm text-purple-700 dark:text-purple-300">
                                Completed: {new Date(completion?.completedAt || '').toLocaleDateString()} • 
                                Total XP: {completion?.xpEarned || 0}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {showCelebration && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
                >
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader className="text-center">
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                                className="flex justify-center mb-4"
                            >
                                <Trophy className="h-20 w-20 text-yellow-500" />
                            </motion.div>
                            <CardTitle className="text-2xl">Congratulations!</CardTitle>
                            <CardDescription>You've mastered neutralization reactions!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-purple-600">
                                <Award className="h-8 w-8" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You understand acids, bases, and their reactions!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Beaker className="h-5 w-5 text-purple-600" />
                                Neutralization Reaction Lab
                            </CardTitle>
                            <CardDescription>Observe acid-base reactions and pH changes</CardDescription>
                        </CardHeader>
                    </Card>
                </motion.div>

                <Card className="border-2 border-cyan-200/50 dark:border-cyan-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle>Lab Information</CardTitle>
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
                                <p><strong>Neutralization Reaction</strong> is a chemical reaction where an acid and base react to form salt and water.</p>
                                <p className="font-mono bg-slate-100 dark:bg-slate-900 p-3 rounded mt-2">General Equation: Acid + Base → Salt + Water</p>
                                <p className="font-mono bg-slate-100 dark:bg-slate-900 p-3 rounded mt-2">Example: HCl + NaOH → NaCl + H₂O</p>
                                <p className="mt-3"><strong>Key Characteristics:</strong></p>
                                <ul>
                                    <li><strong>Exothermic:</strong> Releases heat (temperature increases)</li>
                                    <li><strong>pH Change:</strong> Starting materials have different pH values; product pH is neutral (pH 7)</li>
                                    <li><strong>Products:</strong> Salt and water are always produced</li>
                                    <li><strong>Ion Exchange:</strong> H⁺ from acid reacts with OH⁻ from base to form H₂O</li>
                                </ul>
                                <p className="mt-3"><strong>Real-world Applications:</strong></p>
                                <ul>
                                    <li>Antacids neutralizing stomach acid</li>
                                    <li>Treating acid spills with bases</li>
                                    <li>pH control in water treatment</li>
                                    <li>Baking: baking soda reacts with acidic ingredients</li>
                                </ul>
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
                                <ul>
                                    <li>Always wear safety goggles and lab coat when handling acids and bases</li>
                                    <li>Acids and bases are corrosive - avoid skin and eye contact</li>
                                    <li><strong>Never</strong> add water to acid; always add acid to water</li>
                                    <li>Work in a well-ventilated area or under a fume hood</li>
                                    <li>Dispose of waste according to laboratory procedures</li>
                                    <li>Keep first aid kit nearby - have eye wash station accessible</li>
                                    <li>When mixing, stir carefully and avoid splashing</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <AnimatePresence mode="wait">
                {currentStep === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle>Welcome to Neutralization Reaction Lab!</CardTitle>
                                <CardDescription>Discover how acids and bases neutralize each other</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                        <Beaker className="w-16 h-16 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-purple-900 dark:text-purple-100">What You'll Learn:</h3>
                                            <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                                                <li>• Acid-base chemistry and neutralization reactions</li>
                                                <li>• How pH changes during neutralization</li>
                                                <li>• Exothermic reactions and heat release</li>
                                                <li>• Products of acid-base reactions</li>
                                                <li>• Real-world applications of neutralization</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleStartExperiment} 
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg" 
                                    size="lg"
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Start Experiment
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'collect-supplies' && (
                    <motion.div
                        key="collect-supplies"
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
                                    onClick={handleContinueToExperiment} 
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg" 
                                    size="lg"
                                >
                                    Continue to Experiment
                                </Button>
                            </CardFooter>
                        )}
                    </motion.div>
                )}

                {currentStep === 'experiment' && (
                    <motion.div
                        key="experiment"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Beaker className="h-5 w-5 text-purple-600" />
                                    Neutralization Reaction
                                </CardTitle>
                                <CardDescription>Mix acid and base to observe neutralization</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Reaction Visualization */}
                                <div className="bg-muted/30 rounded-lg p-8 min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 w-full">
                                        {/* HCl */}
                                        <motion.div
                                            animate={reactants === 'mixing' ? { x: 40, opacity: 0.5 } : { x: 0, opacity: 1 }}
                                            transition={{ duration: 1 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="text-center">
                                                <p className="text-xs md:text-sm font-medium mb-2">HCl (Acid)</p>
                                                <div className="w-16 md:w-20 h-24 md:h-32 border-2 border-blue-400 rounded-lg bg-gradient-to-b from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-700 flex items-end justify-center p-1">
                                                    <div className="w-full h-2/3 bg-blue-400/60 rounded-sm" />
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Plus Sign */}
                                        <motion.p
                                            animate={reactants !== 'idle' ? { scale: 0.5, opacity: 0 } : { scale: 1, opacity: 1 }}
                                            className="text-2xl md:text-4xl font-bold text-muted-foreground"
                                        >
                                            +
                                        </motion.p>

                                        {/* NaOH */}
                                        <motion.div
                                            animate={reactants === 'mixing' ? { x: -40, opacity: 0.5 } : { x: 0, opacity: 1 }}
                                            transition={{ duration: 1 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="text-center">
                                                <p className="text-xs md:text-sm font-medium mb-2">NaOH (Base)</p>
                                                <div className="w-16 md:w-20 h-24 md:h-32 border-2 border-red-400 rounded-lg bg-gradient-to-b from-red-100 to-red-300 dark:from-red-900 dark:to-red-700 flex items-end justify-center p-1">
                                                    <div className="w-full h-2/3 bg-red-400/60 rounded-sm" />
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Arrow and Product */}
                                        <motion.div
                                            animate={reactants === 'reacting' ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                                            className="flex flex-col items-center"
                                        >
                                            <p className="text-2xl md:text-4xl font-bold text-purple-600 mb-4">→</p>
                                            <div className="text-center">
                                                <p className="text-xs md:text-sm font-medium mb-2">Product: NaCl + H₂O</p>
                                                <div className="w-16 md:w-20 h-24 md:h-32 border-2 border-green-400 rounded-lg bg-gradient-to-b from-green-100 to-green-300 dark:from-green-900 dark:to-green-700 flex items-end justify-center p-1">
                                                    <div className="w-full h-2/3 bg-green-400/60 rounded-sm" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Temperature and pH Display */}
                                    <motion.div
                                        animate={reactants !== 'idle' ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                        className="grid grid-cols-2 gap-6 mt-8 w-full max-w-md"
                                    >
                                        <div className="text-center">
                                            <p className="text-xs md:text-sm font-medium mb-2">Temperature</p>
                                            <p className="text-3xl md:text-4xl font-bold text-orange-600">{temperature}°C</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs md:text-sm font-medium mb-2">pH Level</p>
                                            <p className="text-3xl md:text-4xl font-bold text-purple-600">{pH.toFixed(1)}</p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Reaction Status */}
                                {reactants !== 'idle' && (
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {reactants === 'mixing' && 'Mixing reactants...'}
                                            {reactants === 'reacting' && 'Neutralization in progress...'}
                                            {reactants === 'complete' && 'Reaction complete! ✅'}
                                        </p>
                                    </div>
                                )}

                                {/* Trials Counter */}
                                <div className="text-center text-xs md:text-sm text-muted-foreground">
                                    Trials completed: {trials}
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-3 flex-wrap justify-center">
                                <Button 
                                    onClick={handlePerformReaction} 
                                    disabled={reactants !== 'idle'}
                                    size="lg"
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                                >
                                    {reactants === 'idle' ? 'Perform Reaction' : 'Reacting...'}
                                </Button>
                                <Button 
                                    onClick={handleViewResults} 
                                    disabled={reactants !== 'complete'}
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                                >
                                    View Results
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'results' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-purple-600" />
                                    Experiment Results
                                </CardTitle>
                                <CardDescription>Analysis of the neutralization reaction</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Observations:</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Chemical Equation:</strong> HCl + NaOH → NaCl + H₂O
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Exothermic Reaction:</strong> Temperature increased from 20°C to 45°C (25°C rise), releasing heat energy
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>pH Neutralization:</strong> pH changed to 7 (neutral), indicating complete neutralization
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Ionic Reaction:</strong> H⁺ ions from HCl combined with OH⁻ ions from NaOH to form H₂O
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                                    <h3 className="font-semibold mb-2">Real-World Examples:</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Neutralization reactions are common in everyday life:
                                    </p>
                                    <ul className="text-sm space-y-2">
                                        <li>• <strong>Antacids:</strong> Neutralize stomach acid to relieve heartburn</li>
                                        <li>• <strong>Industrial:</strong> Treating acidic waste water before discharge</li>
                                        <li>• <strong>Cooking:</strong> Baking soda (base) reacts with acidic ingredients</li>
                                        <li>• <strong>Spill Response:</strong> Using bases to neutralize acid spills</li>
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleViewQuiz} 
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg" 
                                    size="lg"
                                >
                                    Take the Quiz
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'quiz' && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-green-200/50 dark:border-green-800/50 bg-gradient-to-br from-white/90 to-green-50/90 dark:from-gray-900/90 dark:to-green-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    Knowledge Check
                                </CardTitle>
                                <CardDescription>Test your understanding of neutralization reactions</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">1. What are the products of a neutralization reaction?</Label>
                                    <div className="grid gap-3">
                                        {[
                                            { value: 'acid-base', label: 'More acid and more base' },
                                            { value: 'salt-water', label: 'Salt and water', isCorrect: true },
                                            { value: 'gas-liquid', label: 'Gas and liquid' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={!quizSubmitted ? { scale: 1.02 } : {}}
                                                whileTap={!quizSubmitted ? { scale: 0.98 } : {}}
                                                onClick={() => !quizSubmitted && setQuizAnswer1(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer1 === option.value && !quizSubmitted && "border-purple-500 bg-purple-50 dark:bg-purple-950/20",
                                                    quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizSubmitted && quizAnswer1 === option.value && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    !quizSubmitted && quizAnswer1 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer1 === option.value ? "border-purple-500 bg-purple-500" : "border-gray-300"
                                                    )}>
                                                        {quizAnswer1 === option.value && <div className="h-2 w-2 rounded-full bg-white" />}
                                                    </div>
                                                    <Label className="cursor-pointer flex-1">{option.label}</Label>
                                                    {quizSubmitted && option.isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    {quizSubmitted && quizAnswer1 === option.value && !option.isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Question 2 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">2. What type of reaction is neutralization in terms of energy?</Label>
                                    <div className="grid gap-3">
                                        {[
                                            { value: 'endothermic', label: 'Endothermic (absorbs heat)' },
                                            { value: 'exothermic', label: 'Exothermic (releases heat)', isCorrect: true },
                                            { value: 'isothermal', label: 'Isothermal (no change)' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={!quizSubmitted ? { scale: 1.02 } : {}}
                                                whileTap={!quizSubmitted ? { scale: 0.98 } : {}}
                                                onClick={() => !quizSubmitted && setQuizAnswer2(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer2 === option.value && !quizSubmitted && "border-purple-500 bg-purple-50 dark:bg-purple-950/20",
                                                    quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizSubmitted && quizAnswer2 === option.value && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    !quizSubmitted && quizAnswer2 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer2 === option.value ? "border-purple-500 bg-purple-500" : "border-gray-300"
                                                    )}>
                                                        {quizAnswer2 === option.value && <div className="h-2 w-2 rounded-full bg-white" />}
                                                    </div>
                                                    <Label className="cursor-pointer flex-1">{option.label}</Label>
                                                    {quizSubmitted && option.isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    {quizSubmitted && quizAnswer2 === option.value && !option.isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Question 3 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">3. What is the pH of the product in a complete neutralization?</Label>
                                    <div className="grid gap-3">
                                        {[
                                            { value: 'acidic', label: 'Acidic (pH < 7)' },
                                            { value: 'neutral', label: 'Neutral (pH = 7)', isCorrect: true },
                                            { value: 'basic', label: 'Basic (pH > 7)' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={!quizSubmitted ? { scale: 1.02 } : {}}
                                                whileTap={!quizSubmitted ? { scale: 0.98 } : {}}
                                                onClick={() => !quizSubmitted && setQuizAnswer3(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer3 === option.value && !quizSubmitted && "border-purple-500 bg-purple-50 dark:bg-purple-950/20",
                                                    quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizSubmitted && quizAnswer3 === option.value && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    !quizSubmitted && quizAnswer3 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer3 === option.value ? "border-purple-500 bg-purple-500" : "border-gray-300"
                                                    )}>
                                                        {quizAnswer3 === option.value && <div className="h-2 w-2 rounded-full bg-white" />}
                                                    </div>
                                                    <Label className="cursor-pointer flex-1">{option.label}</Label>
                                                    {quizSubmitted && option.isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    {quizSubmitted && quizAnswer3 === option.value && !option.isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {quizFeedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "p-4 rounded-lg border-2 bg-gradient-to-r",
                                            quizFeedback.includes('Perfect') || quizFeedback.includes('all 3') 
                                                ? "from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-500 text-green-700 dark:text-green-300"
                                                : quizFeedback.includes('Good') 
                                                ? "from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-500 text-blue-700 dark:text-blue-300"
                                                : "from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-500 text-amber-700 dark:text-amber-300"
                                        )}
                                    >
                                        <div className="flex items-start gap-2">
                                            {quizFeedback.includes('Perfect') || quizFeedback.includes('all 3') ? (
                                                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                            )}
                                            <p className="text-sm font-medium">{quizFeedback}</p>
                                        </div>
                                    </motion.div>
                                )}

                                <Button 
                                    onClick={handleQuizSubmit} 
                                    className={cn(
                                        "w-full shadow-lg",
                                        quizSubmitted && !quizFeedback.includes('all 3')
                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                    )}
                                    size="lg"
                                    disabled={!quizAnswer1 || !quizAnswer2 || !quizAnswer3 || (quizSubmitted && quizFeedback.includes('all 3'))}
                                >
                                    {quizSubmitted && quizFeedback.includes('all 3') ? (
                                        <>
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            Quiz Completed
                                        </>
                                    ) : quizSubmitted && !quizFeedback.includes('all 3') ? (
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

                {currentStep === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
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
                                {xpEarned > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="flex items-center justify-center gap-2 text-3xl font-black text-purple-600 dark:text-purple-400"
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
                                            <span>Neutralization reactions: Acid + Base → Salt + Water</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>These reactions are exothermic (release heat energy)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>pH changes to 7 (neutral) during complete neutralization</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>Real-world applications: antacids, waste treatment, cooking</span>
                                        </li>
                                    </ul>
                                </div>
                                <Button 
                                    onClick={handleRestart} 
                                    variant="outline" 
                                    className="mt-6 border-2 border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                                    size="lg"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Restart Lab
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            </div>
        </div>
    );
}

