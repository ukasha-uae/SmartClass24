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

type Step = 'intro' | 'collect-supplies' | 'experiment' | 'results' | 'quiz' | 'complete';

export function NeutralizationReactionLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Supplies tracking
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [beakerCollected, setBeakerCollected] = React.useState(false);
    const [hclCollected, setHclCollected] = React.useState(false);
    const [naohCollected, setNaohCollected] = React.useState(false);
    const [thermometerCollected, setThermometerCollected] = React.useState(false);
    
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

    // Draggable teacher
    const [teacherPosition, setTeacherPosition] = React.useState({ x: 0, y: 0 });

    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to Neutralization Reaction Lab! When an acid and a base mix, they neutralize each other in an exothermic reaction. We'll observe HCl (hydrochloric acid) reacting with NaOH (sodium hydroxide) to produce salt and water. Let's gather our supplies first!");
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setTeacherMessage("Great! Let's gather our supplies. Start by clicking on the BEAKER - this is where our reaction will happen!");
        setPendingTransition(() => () => {
            setCurrentStep('collect-supplies');
        });
    };
    
    const handleCollectBeaker = () => {
        if (!beakerCollected) {
            setBeakerCollected(true);
            setTeacherMessage("Perfect! Now click on the HCl (hydrochloric acid) - this is our first reactant!");
            toast({ title: '✅ Beaker Collected' });
        }
    };
    
    const handleCollectHCl = () => {
        if (beakerCollected && !hclCollected) {
            setHclCollected(true);
            setTeacherMessage("Excellent! Now click on the NaOH (sodium hydroxide) - our second reactant!");
            toast({ title: '✅ HCl Collected' });
        }
    };
    
    const handleCollectNaOH = () => {
        if (hclCollected && !naohCollected) {
            setNaohCollected(true);
            setTeacherMessage("Almost done! Finally, click on the THERMOMETER - we need to measure the temperature change during this exothermic reaction!");
            toast({ title: '✅ NaOH Collected' });
        }
    };
    
    const handleCollectThermometer = () => {
        if (naohCollected && !thermometerCollected) {
            setThermometerCollected(true);
            setShowSupplies(false);
            setTeacherMessage("All supplies ready! Now we'll combine these reactants and observe the neutralization reaction. Watch for the temperature increase!");
            toast({ title: '✅ All Supplies Collected!' });
            setPendingTransition(() => () => {
                setCurrentStep('experiment');
            });
        }
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
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null);
            transition();
        }
    };

    const handleViewResults = () => {
        setTeacherMessage("Excellent work! You successfully demonstrated a neutralization reaction. HCl + NaOH → NaCl + H₂O. The temperature increased from 20°C to 45°C, and the pH changed to 7 (neutral). Now let's test your understanding!");
        setPendingTransition(() => () => {
            setCurrentStep('results');
        });
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Let's test your understanding of neutralization reactions with these questions!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
        });
    };

    const handleQuizSubmit = () => {
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
        setShowSupplies(true);
        setBeakerCollected(false);
        setHclCollected(false);
        setNaohCollected(false);
        setThermometerCollected(false);
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
        setPendingTransition(null);
        setTeacherMessage("Ready to explore neutralization reactions again!");
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Draggable Teacher Voice */}
            <motion.div
                drag
                dragMomentum={false}
                dragElastic={0}
                dragConstraints={{ left: -300, right: 300, top: -100, bottom: 400 }}
                onDragEnd={(_, info) => {
                    setTeacherPosition({ x: info.offset.x, y: info.offset.y });
                }}
                initial={{ x: 0, y: 0 }}
                style={{ x: teacherPosition.x, y: teacherPosition.y }}
                className="fixed bottom-16 left-2 right-2 md:left-auto md:right-4 md:w-96 max-w-md z-50 touch-none"
            >
                <Card className="shadow-2xl border-2 border-purple-400 dark:border-purple-600 cursor-move">
                    <CardHeader className="pb-2 py-2 md:py-4">
                        <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-xs md:text-sm">Teacher Guide (Drag to Move)</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <TeacherVoice 
                            message={teacherMessage}
                            onComplete={handleTeacherComplete}
                        />
                    </CardContent>
                </Card>
            </motion.div>

            {isCompleted && (
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

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Beaker className="h-5 w-5 text-purple-600" />
                        Neutralization Reaction Lab
                    </CardTitle>
                    <CardDescription>Observe acid-base reactions and pH changes</CardDescription>
                </CardHeader>
            </Card>

            <Card>
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Welcome to Neutralization Reaction Lab!</CardTitle>
                                <CardDescription>Discover how acids and bases neutralize each other</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                    <div className="flex items-start gap-4">
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
                                <Button onClick={handleStartExperiment} className="w-full" size="lg">
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
                        <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Sparkles className="h-5 w-5 text-amber-600" />
                                    Lab Supplies - Click to Collect
                                </CardTitle>
                                <CardDescription>Click on each item in order to collect them</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-6 justify-center flex-wrap">
                                    {/* Beaker */}
                                    {!beakerCollected && (
                                        <motion.div
                                            onClick={handleCollectBeaker}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-gray-400 dark:border-gray-600 hover:border-gray-600 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Beaker className="h-12 w-12 text-gray-600" />
                                                <span className="text-sm font-medium">Beaker</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* HCl */}
                                    {beakerCollected && !hclCollected && (
                                        <motion.div
                                            onClick={handleCollectHCl}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <TestTube className="h-12 w-12 text-blue-500" />
                                                <span className="text-sm font-medium">HCl (Acid)</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* NaOH */}
                                    {hclCollected && !naohCollected && (
                                        <motion.div
                                            onClick={handleCollectNaOH}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-red-300 dark:border-red-700 hover:border-red-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <TestTube className="h-12 w-12 text-red-500" />
                                                <span className="text-sm font-medium">NaOH (Base)</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Thermometer */}
                                    {naohCollected && !thermometerCollected && (
                                        <motion.div
                                            onClick={handleCollectThermometer}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-orange-300 dark:border-orange-700 hover:border-orange-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Thermometer className="h-12 w-12 text-orange-500" />
                                                <span className="text-sm font-medium">Thermometer</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Collected Items */}
                                    <div className="w-full mt-4 flex gap-4 justify-center flex-wrap">
                                        {beakerCollected && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-full">
                                                <CheckCircle className="h-4 w-4 text-gray-600" />
                                                <span className="text-sm">Beaker</span>
                                            </motion.div>
                                        )}
                                        {hclCollected && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full">
                                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm">HCl</span>
                                            </motion.div>
                                        )}
                                        {naohCollected && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 bg-red-100 dark:bg-red-900 px-4 py-2 rounded-full">
                                                <CheckCircle className="h-4 w-4 text-red-600" />
                                                <span className="text-sm">NaOH</span>
                                            </motion.div>
                                        )}
                                        {thermometerCollected && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900 px-4 py-2 rounded-full">
                                                <CheckCircle className="h-4 w-4 text-orange-600" />
                                                <span className="text-sm">Thermometer</span>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'experiment' && (
                    <motion.div
                        key="experiment"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-purple-200 dark:border-purple-800">
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
                                    className="flex-1"
                                >
                                    {reactants === 'idle' ? 'Perform Reaction' : 'Reacting...'}
                                </Button>
                                <Button 
                                    onClick={handleViewResults} 
                                    disabled={reactants !== 'complete'}
                                    size="lg"
                                    variant="outline"
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
                        <Card className="border-2 border-purple-200 dark:border-purple-800">
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
                                <Button onClick={handleViewQuiz} className="w-full" size="lg">
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Knowledge Check</CardTitle>
                                <CardDescription>Test your understanding of neutralization reactions</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. What are the products of a neutralization reaction?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'acid-base', label: 'More acid and more base' },
                                            { value: 'salt-water', label: 'Salt and water', isCorrect: true },
                                            { value: 'gas-liquid', label: 'Gas and liquid' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer1(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer1 === option.value && !quizSubmitted && "border-purple-500 bg-purple-50 dark:bg-purple-950/20",
                                                    quizAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer1 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer1 === option.value && !quizSubmitted && "border-purple-500 bg-purple-500",
                                                        quizAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-500",
                                                        quizAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-500",
                                                        quizAnswer1 !== option.value && "border-gray-300"
                                                    )}>
                                                        {quizAnswer1 === option.value && (
                                                            <div className="w-2 h-2 bg-white rounded-full" />
                                                        )}
                                                    </div>
                                                    <span>{option.label}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Question 2 */}
                                <div className="space-y-3">
                                    <p className="font-medium">2. What type of reaction is neutralization in terms of energy?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'endothermic', label: 'Endothermic (absorbs heat)' },
                                            { value: 'exothermic', label: 'Exothermic (releases heat)', isCorrect: true },
                                            { value: 'isothermal', label: 'Isothermal (no change)' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer2(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer2 === option.value && !quizSubmitted && "border-purple-500 bg-purple-50 dark:bg-purple-950/20",
                                                    quizAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer2 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer2 === option.value && !quizSubmitted && "border-purple-500 bg-purple-500",
                                                        quizAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-500",
                                                        quizAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-500",
                                                        quizAnswer2 !== option.value && "border-gray-300"
                                                    )}>
                                                        {quizAnswer2 === option.value && (
                                                            <div className="w-2 h-2 bg-white rounded-full" />
                                                        )}
                                                    </div>
                                                    <span>{option.label}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Question 3 */}
                                <div className="space-y-3">
                                    <p className="font-medium">3. What is the pH of the product in a complete neutralization?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'acidic', label: 'Acidic (pH < 7)' },
                                            { value: 'neutral', label: 'Neutral (pH = 7)', isCorrect: true },
                                            { value: 'basic', label: 'Basic (pH > 7)' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer3(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer3 === option.value && !quizSubmitted && "border-purple-500 bg-purple-50 dark:bg-purple-950/20",
                                                    quizAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer3 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer3 === option.value && !quizSubmitted && "border-purple-500 bg-purple-500",
                                                        quizAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-500",
                                                        quizAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-500",
                                                        quizAnswer3 !== option.value && "border-gray-300"
                                                    )}>
                                                        {quizAnswer3 === option.value && (
                                                            <div className="w-2 h-2 bg-white rounded-full" />
                                                        )}
                                                    </div>
                                                    <span>{option.label}</span>
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
                                            "p-4 rounded-lg border-2",
                                            quizFeedback.includes('Perfect') || quizFeedback.includes('all 3') ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100" :
                                            quizFeedback.includes('Good') ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100" :
                                            "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-100"
                                        )}
                                    >
                                        {quizFeedback}
                                    </motion.div>
                                )}
                            </CardContent>
                            <CardFooter className="flex gap-3">
                                <Button 
                                    onClick={handleQuizSubmit} 
                                    disabled={!quizAnswer1 || !quizAnswer2 || !quizAnswer3 || quizSubmitted}
                                    className="flex-1"
                                    size="lg"
                                >
                                    Submit Answers
                                </Button>
                                {quizSubmitted && !quizFeedback.includes('all 3') && (
                                    <Button onClick={() => {
                                        setQuizAnswer1(undefined);
                                        setQuizAnswer2(undefined);
                                        setQuizAnswer3(undefined);
                                        setQuizFeedback('');
                                        setQuizSubmitted(false);
                                    }} variant="outline" size="lg">
                                        Try Again
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-purple-200 dark:border-purple-800">
                            <CardHeader className="text-center">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="flex justify-center mb-4"
                                >
                                    <Trophy className="h-16 w-16 text-yellow-500" />
                                </motion.div>
                                <CardTitle>Lab Complete!</CardTitle>
                                <CardDescription>You've mastered neutralization reactions!</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>Neutralization reactions: Acid + Base → Salt + Water</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>These reactions are exothermic (release heat energy)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>pH changes to 7 (neutral) during complete neutralization</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>Real-world applications: antacids, waste treatment, cooking</span>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleRestart} variant="outline" className="w-full" size="lg">
                                    Restart Lab
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
