'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Wind, Flame, Droplets, BookOpen, Shield, Sparkles, Trophy, Award, GripVertical } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';

type Step = 'intro' | 'collect-supplies' | 'setup-beakers' | 'select-liquid' | 'add-conditions' | 'observing' | 'results' | 'quiz' | 'complete';
type LiquidType = 'water' | 'alcohol' | 'oil' | null;

const evaporationRates = {
    water: 0.8,
    alcohol: 2.5,
    oil: 0.3,
};

export function EvaporationLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Supplies tracking
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [beakersCollected, setBeakersCollected] = React.useState(false);
    const [waterCollected, setWaterCollected] = React.useState(false);
    const [alcoholCollected, setAlcoholCollected] = React.useState(false);
    const [oilCollected, setOilCollected] = React.useState(false);
    
    // Experiment state
    const [selectedLiquid, setSelectedLiquid] = React.useState<LiquidType>(null);
    const [beakersFilled, setBeakersFilled] = React.useState(false);
    const [fanOn, setFanOn] = React.useState(false);
    const [heatOn, setHeatOn] = React.useState(false);
    const [observing, setObserving] = React.useState(false);
    const [liquidLevels, setLiquidLevels] = React.useState({ water: 100, alcohol: 100, oil: 100 });
    const [timeElapsed, setTimeElapsed] = React.useState(0);
    
    // Quiz state
    const [selectedAnswer1, setSelectedAnswer1] = React.useState<string | null>(null);
    const [selectedAnswer2, setSelectedAnswer2] = React.useState<string | null>(null);
    const [selectedAnswer3, setSelectedAnswer3] = React.useState<string | null>(null);
    const [quizFeedback, setQuizFeedback] = React.useState<string>('');
    const [quizSubmitted, setQuizSubmitted] = React.useState(false);
    
    // XP and completion
    const [xpEarned, setXpEarned] = React.useState(0);
    const [showCelebration, setShowCelebration] = React.useState(false);
    const { markLabComplete, isLabCompleted, getLabCompletion } = useLabProgress();
    const labId = 'evaporation-of-liquids';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    // Draggable teacher position
    const [teacherPosition, setTeacherPosition] = React.useState({ x: 0, y: 0 });

    // Intro message
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Evaporation Lab! Today we'll compare how fast different liquids evaporate. You'll see that alcohol evaporates quickly, water is medium, and oil is slow. Factors like heat and airflow will also affect the speed!");
        }
    }, [currentStep]);

    // Evaporation simulation
    React.useEffect(() => {
        if (currentStep === 'observing' && observing) {
            const interval = setInterval(() => {
                setLiquidLevels(prev => {
                    const fanMultiplier = fanOn ? 1.5 : 1;
                    const heatMultiplier = heatOn ? 2 : 1;
                    
                    const newWater = Math.max(0, prev.water - (evaporationRates.water * fanMultiplier * heatMultiplier));
                    const newAlcohol = Math.max(0, prev.alcohol - (evaporationRates.alcohol * fanMultiplier * heatMultiplier));
                    const newOil = Math.max(0, prev.oil - (evaporationRates.oil * fanMultiplier * heatMultiplier));
                    
                    // Check if all liquids have evaporated
                    if (newWater === 0 && newAlcohol === 0 && newOil === 0) {
                        setObserving(false);
                        setTeacherMessage("All liquids have evaporated! Notice that alcohol evaporated first, then water, and oil was slowest. This is because alcohol has weaker intermolecular forces!");
                        setPendingTransition(() => () => {
                            setCurrentStep('results');
                        });
                    }
                    
                    return { water: newWater, alcohol: newAlcohol, oil: newOil };
                });
                
                setTimeElapsed(prev => prev + 1);
            }, 500);
            
            return () => clearInterval(interval);
        }
    }, [currentStep, observing, fanOn, heatOn]);

    const handleStartExperiment = () => {
        setTeacherMessage("Great! Let's gather our supplies. Start by clicking on the THREE BEAKERS - we need one for each liquid!");
        setPendingTransition(() => () => {
            setCurrentStep('collect-supplies');
        });
    };
    
    const handleCollectBeakers = () => {
        if (!beakersCollected) {
            setBeakersCollected(true);
            setTeacherMessage("Perfect! You collected the beakers. These identical glass containers ensure we're comparing the liquids fairly - same surface area, same container. Now click on the WATER bottle. Water is our baseline liquid with medium evaporation rate!");
            toast({ title: '✅ Beakers Collected', description: 'Identical containers ready' });
        }
    };
    
    const handleCollectWater = () => {
        if (beakersCollected && !waterCollected) {
            setWaterCollected(true);
            setTeacherMessage("Good! Water collected. H₂O molecules have moderate intermolecular forces (hydrogen bonds). Now click on the ALCOHOL bottle - alcohol has much weaker forces, so molecules escape more easily into vapor!");
            toast({ title: '✅ Water Collected', description: 'Medium evaporation rate' });
        }
    };
    
    const handleCollectAlcohol = () => {
        if (waterCollected && !alcoholCollected) {
            setAlcoholCollected(true);
            setTeacherMessage("Excellent! Alcohol collected. Alcohol molecules have weak intermolecular forces - they need less energy to escape the liquid surface. This makes alcohol evaporate fastest! Finally, click on the OIL bottle - you'll see a big difference!");
            toast({ title: '✅ Alcohol Collected', description: 'Fast evaporation rate' });
        }
    };
    
    const handleCollectOil = () => {
        if (alcoholCollected && !oilCollected) {
            setOilCollected(true);
            setShowSupplies(false);
            setTeacherMessage("Perfect! Oil collected. Oil has the strongest intermolecular forces - large molecules hold together tightly, making it evaporate very slowly. All supplies ready! Now click on each beaker to fill it with its liquid. Watch how the liquids fill the containers!");
            toast({ title: '✅ All Supplies Collected!', description: 'Ready to compare evaporation' });
            setPendingTransition(() => () => {
                setCurrentStep('setup-beakers');
            });
        }
    };
    
    const handleFillBeakers = () => {
        if (!beakersFilled) {
            setBeakersFilled(true);
            setTeacherMessage("Beakers filled! Each has the same amount of liquid. Now you can control conditions to speed up evaporation. Try the FAN (increases airflow, removes vapor molecules) or HEAT (gives molecules more kinetic energy). Or try both together to see combined effects!");
            toast({ title: '✅ All Beakers Filled!', description: 'Equal volumes ready to compare' });
            setPendingTransition(() => () => {
                setCurrentStep('add-conditions');
            });
        }
    };
    
    const handleToggleFan = () => {
        const newFanState = !fanOn;
        setFanOn(newFanState);
        if (newFanState) {
            setTeacherMessage("Fan turned ON! Airflow removes water vapor molecules from above the liquid surface, allowing more molecules to escape. This speeds up evaporation significantly!");
        } else {
            setTeacherMessage("Fan turned OFF. Without airflow, vapor molecules stay near the liquid surface, slowing down evaporation.");
        }
        toast({ title: newFanState ? '💨 Fan Turned ON' : '💨 Fan Turned OFF', description: newFanState ? 'Airflow increases evaporation' : 'Still air slows evaporation' });
    };
    
    const handleToggleHeat = () => {
        const newHeatState = !heatOn;
        setHeatOn(newHeatState);
        if (newHeatState) {
            setTeacherMessage("Heat turned ON! Thermal energy increases molecular kinetic energy - molecules move faster and escape the liquid surface more easily. Notice how evaporation speeds up dramatically!");
        } else {
            setTeacherMessage("Heat turned OFF. Cooler molecules move slower and need more time to gain enough energy to escape.");
        }
        toast({ title: newHeatState ? '🔥 Heat Turned ON' : '🔥 Heat Turned OFF', description: newHeatState ? 'Higher temperature = faster evaporation' : 'Lower temperature = slower evaporation' });
    };
    
    const handleStartObservation = () => {
        setObserving(true);
        const conditions = [];
        if (fanOn) conditions.push('airflow');
        if (heatOn) conditions.push('heat');
        const conditionText = conditions.length > 0 ? ` with ${conditions.join(' and ')}` : ' at room conditions';
        setTeacherMessage(`Observation started${conditionText}! Watch the liquid levels carefully. Alcohol should disappear first (weak forces), then water (medium forces), and oil last (strong forces). The rate depends on intermolecular forces and the conditions you chose!`);
        toast({ title: '👁️ Observing Evaporation...', description: 'Watch the levels drop' });
        setPendingTransition(() => () => {
            setCurrentStep('observing');
        });
    };
    
    const handleTeacherComplete = () => {
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null);
            transition();
        }
    };

    const handleViewResults = () => {
        setTeacherMessage("Fantastic observations! You've seen how different liquids evaporate at different rates. Now let's test what you learned!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
        });
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        if (selectedAnswer1 === 'alcohol') correctCount++;
        if (selectedAnswer2 === 'heat') correctCount++;
        if (selectedAnswer3 === 'weak') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand evaporation! +${earnedXP} XP`);
            setTeacherMessage(`Outstanding! Perfect score! You've mastered evaporation completely! You understand that alcohol evaporates fastest due to weak intermolecular forces, heat increases molecular kinetic energy speeding up evaporation, and factors like temperature and airflow significantly affect evaporation rates. You observed alcohol evaporating first, then water, then oil - exactly as predicted by molecular theory. Excellent work! +${earnedXP} XP earned!`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Review which liquid evaporates fastest and try again!`);
            setTeacherMessage(`Good effort! You got ${correctCount} out of 3 correct. Remember the key concepts: Alcohol has the weakest intermolecular forces so it evaporates fastest. Heat increases kinetic energy, making molecules move faster and escape more easily. Review your observations - did you notice alcohol disappearing first? Try the quiz again!`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: alcohol has weak intermolecular forces, so it evaporates quickest!`);
            setTeacherMessage(`Keep trying! You got ${correctCount} correct. Let me help: Evaporation rate depends on intermolecular forces. Alcohol (weakest forces) > Water (medium) > Oil (strongest). Heat adds energy to molecules, helping them escape the liquid surface faster. Think about what you observed in the experiment - which liquid disappeared first? Give it another go!`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setShowSupplies(true);
        setBeakersCollected(false);
        setWaterCollected(false);
        setAlcoholCollected(false);
        setOilCollected(false);
        setSelectedLiquid(null);
        setBeakersFilled(false);
        setFanOn(false);
        setHeatOn(false);
        setObserving(false);
        setLiquidLevels({ water: 100, alcohol: 100, oil: 100 });
        setTimeElapsed(0);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setPendingTransition(null);
        setTeacherMessage("Welcome back! Ready to explore evaporation again? Let's compare how different liquids evaporate!");
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Teacher Voice */}
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
                emotion={currentStep === 'complete' ? 'celebrating' : currentStep === 'observing' ? 'explaining' : 'happy'}
                context={{
                    attempts: timeElapsed,
                    correctStreak: Math.round(100 - Math.min(liquidLevels.water, liquidLevels.alcohol, liquidLevels.oil))
                }}
                quickActions={[
                    { label: 'Reset Lab', icon: '🔄', onClick: handleRestart },
                    { label: 'View Theory', icon: '📖', onClick: () => document.querySelector('[value="theory"]')?.parentElement?.click() },
                    { label: 'Safety Tips', icon: '🛡️', onClick: () => document.querySelector('[value="safety"]')?.parentElement?.click() }
                ]}
            />

            {isCompleted && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                            <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Lab Completed!</h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
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
                            <CardDescription>You've completed the Evaporation Lab!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-blue-600">
                                <Award className="h-8 w-8" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You've mastered evaporation rates!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-600" />
                        Evaporation of Liquids
                    </CardTitle>
                    <CardDescription>Compare evaporation rates of different liquids</CardDescription>
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
                                <p><strong>Evaporation</strong> is when a liquid changes into a gas at its surface. Unlike boiling, evaporation happens at any temperature!</p>
                                <p><strong>Factors affecting evaporation:</strong></p>
                                <ul>
                                    <li><strong>Temperature:</strong> Heat gives molecules more energy to escape</li>
                                    <li><strong>Surface Area:</strong> Larger surface = more molecules can escape</li>
                                    <li><strong>Airflow:</strong> Wind removes vapor molecules, allowing more evaporation</li>
                                    <li><strong>Intermolecular Forces:</strong> Weaker bonds = faster evaporation</li>
                                </ul>
                                <p><strong>Why different rates?</strong> Alcohol has weak intermolecular forces (easy to escape), water has medium-strength hydrogen bonds, and oil has strong intermolecular forces (hard to escape).</p>
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
                                    <li>Alcohol is flammable - keep away from flames</li>
                                    <li>Work in a well-ventilated area</li>
                                    <li>Wear safety goggles</li>
                                    <li>Be careful with heat sources</li>
                                    <li>Do not inhale vapors directly</li>
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
                                <CardTitle>Welcome to the Evaporation Lab!</CardTitle>
                                <CardDescription>Discover how different liquids evaporate at different rates</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <div className="flex items-start gap-4">
                                        <Droplets className="w-16 h-16 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">What We'll Discover:</h3>
                                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                                <li>• How alcohol, water, and oil evaporate at different speeds</li>
                                                <li>• How heat affects evaporation rate</li>
                                                <li>• How airflow increases evaporation</li>
                                                <li>• Why intermolecular forces matter</li>
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
                                    {/* Beakers */}
                                    {!beakersCollected && (
                                        <motion.div
                                            onClick={handleCollectBeakers}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-gray-300 dark:border-gray-700 hover:border-gray-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="flex gap-2">
                                                    <div className="w-12 h-16 border-2 border-gray-400 rounded-b-lg bg-transparent" />
                                                    <div className="w-12 h-16 border-2 border-gray-400 rounded-b-lg bg-transparent" />
                                                    <div className="w-12 h-16 border-2 border-gray-400 rounded-b-lg bg-transparent" />
                                                </div>
                                                <span className="text-sm font-medium">3 Beakers</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Water */}
                                    {beakersCollected && !waterCollected && (
                                        <motion.div
                                            onClick={handleCollectWater}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="relative w-16 h-20 border-2 border-blue-400 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                                                    <div className="absolute bottom-0 w-full h-3/4 bg-blue-400/50 rounded-b-lg" />
                                                </div>
                                                <span className="text-sm font-medium">Water</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Alcohol */}
                                    {waterCollected && !alcoholCollected && (
                                        <motion.div
                                            onClick={handleCollectAlcohol}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-purple-300 dark:border-purple-700 hover:border-purple-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="relative w-16 h-20 border-2 border-purple-400 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                                                    <div className="absolute bottom-0 w-full h-3/4 bg-purple-400/50 rounded-b-lg" />
                                                </div>
                                                <span className="text-sm font-medium">Alcohol</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Oil */}
                                    {alcoholCollected && !oilCollected && (
                                        <motion.div
                                            onClick={handleCollectOil}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-yellow-300 dark:border-yellow-700 hover:border-yellow-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="relative w-16 h-20 border-2 border-yellow-600 rounded-lg bg-yellow-100 dark:bg-yellow-900/50">
                                                    <div className="absolute bottom-0 w-full h-3/4 bg-yellow-600/50 rounded-b-lg" />
                                                </div>
                                                <span className="text-sm font-medium">Oil</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Collected Items Display */}
                                    <div className="w-full mt-4 flex gap-4 justify-center flex-wrap">
                                        {beakersCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-gray-600" />
                                                <span className="text-sm">Beakers</span>
                                            </motion.div>
                                        )}
                                        {waterCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm">Water</span>
                                            </motion.div>
                                        )}
                                        {alcoholCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-purple-600" />
                                                <span className="text-sm">Alcohol</span>
                                            </motion.div>
                                        )}
                                        {oilCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-yellow-600" />
                                                <span className="text-sm">Oil</span>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {(currentStep === 'setup-beakers' || currentStep === 'add-conditions' || currentStep === 'observing') && (
                    <motion.div
                        key="experiment"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-blue-200 dark:border-blue-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Droplets className="h-5 w-5 text-blue-600" />
                                    Interactive Experiment
                                </CardTitle>
                                <CardDescription>
                                    {currentStep === 'setup-beakers' && 'Click beakers to fill them'}
                                    {currentStep === 'add-conditions' && 'Toggle fan/heat and start observation'}
                                    {currentStep === 'observing' && `Time: ${(timeElapsed / 2).toFixed(1)}s`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Control Panel */}
                                {(currentStep === 'add-conditions' || currentStep === 'observing') && (
                                    <div className="flex gap-4 justify-center flex-wrap">
                                        <Button
                                            onClick={handleToggleFan}
                                            variant={fanOn ? 'default' : 'outline'}
                                            disabled={observing}
                                            className="flex items-center gap-2"
                                        >
                                            <Wind className={cn("h-5 w-5", fanOn && "animate-spin")} />
                                            Fan {fanOn ? 'ON' : 'OFF'}
                                        </Button>
                                        <Button
                                            onClick={handleToggleHeat}
                                            variant={heatOn ? 'destructive' : 'outline'}
                                            disabled={observing}
                                            className="flex items-center gap-2"
                                        >
                                            <Flame className="h-5 w-5" />
                                            Heat {heatOn ? 'ON' : 'OFF'}
                                        </Button>
                                        {currentStep === 'add-conditions' && (
                                            <Button onClick={handleStartObservation} size="lg" className="flex items-center gap-2">
                                                Start Observation
                                            </Button>
                                        )}
                                    </div>
                                )}
                                
                                {/* Experiment Area */}
                                <div className="flex justify-center items-center">
                                    <div className="relative min-h-[400px] md:min-h-[500px] w-full max-w-3xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 p-4 md:p-8">
                                        {/* Three Beakers */}
                                        <div className="flex gap-8 md:gap-12 justify-center items-end h-full">
                                            {/* Water Beaker */}
                                            <motion.div
                                                onClick={currentStep === 'setup-beakers' && !beakersFilled ? handleFillBeakers : undefined}
                                                whileHover={currentStep === 'setup-beakers' && !beakersFilled ? { scale: 1.05 } : {}}
                                                className={cn(
                                                    "flex flex-col items-center gap-2",
                                                    currentStep === 'setup-beakers' && !beakersFilled && "cursor-pointer"
                                                )}
                                            >
                                                <span className="text-xs md:text-sm font-medium">Water</span>
                                                <div className="relative w-16 md:w-24 h-32 md:h-48 border-2 border-blue-400 rounded-b-lg bg-blue-50/30 dark:bg-blue-900/20 overflow-hidden">
                                                    {beakersFilled && (
                                                        <motion.div
                                                            className="absolute bottom-0 w-full bg-blue-400/70 dark:bg-blue-500/70"
                                                            style={{ height: `${liquidLevels.water}%` }}
                                                        />
                                                    )}
                                                </div>
                                                {beakersFilled && (
                                                    <span className="text-xs text-muted-foreground">{liquidLevels.water.toFixed(0)}%</span>
                                                )}
                                            </motion.div>
                                            
                                            {/* Alcohol Beaker */}
                                            <motion.div
                                                onClick={currentStep === 'setup-beakers' && !beakersFilled ? handleFillBeakers : undefined}
                                                whileHover={currentStep === 'setup-beakers' && !beakersFilled ? { scale: 1.05 } : {}}
                                                className={cn(
                                                    "flex flex-col items-center gap-2",
                                                    currentStep === 'setup-beakers' && !beakersFilled && "cursor-pointer"
                                                )}
                                            >
                                                <span className="text-xs md:text-sm font-medium">Alcohol</span>
                                                <div className="relative w-16 md:w-24 h-32 md:h-48 border-2 border-purple-400 rounded-b-lg bg-purple-50/30 dark:bg-purple-900/20 overflow-hidden">
                                                    {beakersFilled && (
                                                        <motion.div
                                                            className="absolute bottom-0 w-full bg-purple-400/70 dark:bg-purple-500/70"
                                                            style={{ height: `${liquidLevels.alcohol}%` }}
                                                        />
                                                    )}
                                                </div>
                                                {beakersFilled && (
                                                    <span className="text-xs text-muted-foreground">{liquidLevels.alcohol.toFixed(0)}%</span>
                                                )}
                                            </motion.div>
                                            
                                            {/* Oil Beaker */}
                                            <motion.div
                                                onClick={currentStep === 'setup-beakers' && !beakersFilled ? handleFillBeakers : undefined}
                                                whileHover={currentStep === 'setup-beakers' && !beakersFilled ? { scale: 1.05 } : {}}
                                                className={cn(
                                                    "flex flex-col items-center gap-2",
                                                    currentStep === 'setup-beakers' && !beakersFilled && "cursor-pointer"
                                                )}
                                            >
                                                <span className="text-xs md:text-sm font-medium">Oil</span>
                                                <div className="relative w-16 md:w-24 h-32 md:h-48 border-2 border-yellow-600 rounded-b-lg bg-yellow-50/30 dark:bg-yellow-900/20 overflow-hidden">
                                                    {beakersFilled && (
                                                        <motion.div
                                                            className="absolute bottom-0 w-full bg-yellow-600/70"
                                                            style={{ height: `${liquidLevels.oil}%` }}
                                                        />
                                                    )}
                                                </div>
                                                {beakersFilled && (
                                                    <span className="text-xs text-muted-foreground">{liquidLevels.oil.toFixed(0)}%</span>
                                                )}
                                            </motion.div>
                                        </div>
                                        
                                        {currentStep === 'setup-beakers' && !beakersFilled && (
                                            <p className="text-center mt-4 font-medium bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-lg">
                                                Click on beakers to fill them
                                            </p>
                                        )}
                                        
                                        {/* Environmental Indicators */}
                                        {(currentStep === 'add-conditions' || currentStep === 'observing') && (
                                            <div className="absolute top-4 right-4 flex gap-4">
                                                {fanOn && (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Wind className="h-6 md:h-8 w-6 md:w-8 text-blue-500 animate-pulse" />
                                                        <span className="text-xs text-blue-600">Wind</span>
                                                    </div>
                                                )}
                                                {heatOn && (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Flame className="h-6 md:h-8 w-6 md:w-8 text-red-500 animate-pulse" />
                                                        <span className="text-xs text-red-600">Heat</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
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
                        <Card className="border-2 border-blue-200 dark:border-blue-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                    Experiment Results
                                </CardTitle>
                                <CardDescription>Analysis of your observations</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Findings:</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Alcohol evaporated FASTEST:</strong> Weak intermolecular forces make it easy for molecules to escape
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Water evaporated at MEDIUM speed:</strong> Hydrogen bonds are stronger than alcohol's forces
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Oil evaporated SLOWEST:</strong> Strong intermolecular forces hold molecules together tightly
                                            </div>
                                        </li>
                                        {fanOn && (
                                            <li className="flex items-start gap-3">
                                                <Wind className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <strong>Fan Effect:</strong> Airflow swept away vapor molecules, speeding up evaporation by 50%
                                                </div>
                                            </li>
                                        )}
                                        {heatOn && (
                                            <li className="flex items-start gap-3">
                                                <Flame className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <strong>Heat Effect:</strong> Increased temperature gave molecules more energy, doubling evaporation rate
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div className="bg-cyan-50 dark:bg-cyan-950/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
                                    <h3 className="font-semibold mb-2">Scientific Explanation:</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Evaporation rate depends on <strong>intermolecular forces</strong>. Liquids with weaker forces (like alcohol) 
                                        have molecules that easily escape into the air. Heat adds energy to help molecules break free, while 
                                        airflow removes vapor molecules and allows more liquid to evaporate. This is why wet clothes dry faster 
                                        on hot, windy days!
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleViewResults} className="w-full" size="lg">
                                    Continue to Quiz
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
                                <CardDescription>Answer these questions about evaporation</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. Which liquid evaporated the fastest?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'water', label: 'Water' },
                                            { value: 'alcohol', label: 'Alcohol', isCorrect: true },
                                            { value: 'oil', label: 'Oil' },
                                            { value: 'same', label: 'All evaporated at the same rate' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setSelectedAnswer1(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    selectedAnswer1 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                                                    selectedAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    selectedAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    selectedAnswer1 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        selectedAnswer1 === option.value && !quizSubmitted && "border-blue-500 bg-blue-500",
                                                        selectedAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-500",
                                                        selectedAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-500",
                                                        selectedAnswer1 !== option.value && "border-gray-300"
                                                    )}>
                                                        {selectedAnswer1 === option.value && (
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
                                    <p className="font-medium">2. Which factor most increases evaporation rate?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'cold', label: 'Cooling the liquid' },
                                            { value: 'heat', label: 'Heating the liquid', isCorrect: true },
                                            { value: 'darkness', label: 'Keeping it in darkness' },
                                            { value: 'pressure', label: 'Increasing pressure' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setSelectedAnswer2(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    selectedAnswer2 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                                                    selectedAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    selectedAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    selectedAnswer2 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        selectedAnswer2 === option.value && !quizSubmitted && "border-blue-500 bg-blue-500",
                                                        selectedAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-500",
                                                        selectedAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-500",
                                                        selectedAnswer2 !== option.value && "border-gray-300"
                                                    )}>
                                                        {selectedAnswer2 === option.value && (
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
                                    <p className="font-medium">3. Why does alcohol evaporate faster than water?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'heavier', label: 'Alcohol molecules are heavier' },
                                            { value: 'weak', label: 'Alcohol has weaker intermolecular forces', isCorrect: true },
                                            { value: 'cold', label: 'Alcohol is colder' },
                                            { value: 'bigger', label: 'Alcohol molecules are bigger' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setSelectedAnswer3(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    selectedAnswer3 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                                                    selectedAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    selectedAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    selectedAnswer3 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        selectedAnswer3 === option.value && !quizSubmitted && "border-blue-500 bg-blue-500",
                                                        selectedAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-500",
                                                        selectedAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-500",
                                                        selectedAnswer3 !== option.value && "border-gray-300"
                                                    )}>
                                                        {selectedAnswer3 === option.value && (
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
                                            quizFeedback.includes('Perfect') ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100" :
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
                                    disabled={!selectedAnswer1 || !selectedAnswer2 || !selectedAnswer3 || quizSubmitted}
                                    className="flex-1"
                                    size="lg"
                                >
                                    Submit Answers
                                </Button>
                                {quizSubmitted && !quizFeedback.includes('Perfect') && (
                                    <Button onClick={() => {
                                        setSelectedAnswer1(null);
                                        setSelectedAnswer2(null);
                                        setSelectedAnswer3(null);
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
                        <Card className="border-2 border-blue-200 dark:border-blue-800">
                            <CardHeader className="text-center">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="flex justify-center mb-4"
                                >
                                    <Trophy className="h-16 w-16 text-yellow-500" />
                                </motion.div>
                                <CardTitle>Lab Complete!</CardTitle>
                                <CardDescription>You've mastered evaporation rates</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Different liquids evaporate at different rates</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Intermolecular forces determine evaporation speed</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Heat and airflow increase evaporation rates</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Alcohol evaporates fastest, oil slowest</span>
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
