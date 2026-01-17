'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Wind, Flame, Droplets, BookOpen, Shield, Sparkles, Trophy, Award, GripVertical, RefreshCw } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { LabSupplies, SupplyItem } from './LabSupplies';

type Step = 'intro' | 'collect-supplies' | 'setup-beakers' | 'select-liquid' | 'add-conditions' | 'observing' | 'results' | 'quiz' | 'complete';
type LiquidType = 'water' | 'alcohol' | 'oil' | null;

// Base evaporation rates at room temperature (very slow - natural evaporation)
const baseEvaporationRates = {
    water: 0.1,      // Very slow at room temperature
    alcohol: 0.5,    // Faster than water due to weaker intermolecular forces
    oil: 0.05,       // Very slow - strong intermolecular forces
};

// Multipliers for different conditions
const EVAPORATION_MULTIPLIERS = {
    heat: 8,         // Heat dramatically increases evaporation (8x faster)
    fan: 2.5,        // Fan increases evaporation (2.5x faster)
    heatAndFan: 15,  // Combined effect is even stronger (15x faster)
};

// Enhanced Flame Component - Premium Design
const EnhancedFlame = ({ isActive }: { isActive: boolean }) => {
    if (!isActive) return null;
    
    return (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center gap-8 md:gap-12">
            {[0, 1, 2].map((index) => (
                <div key={index} className="relative" style={{ width: '64px', height: '80px' }}>
                    {/* Heat shimmer effect above flame */}
                    <motion.div
                        className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-8"
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scaleY: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <div className="w-full h-full bg-gradient-to-b from-transparent via-yellow-200/40 to-transparent blur-sm" />
                    </motion.div>
                    
                    {/* Main flame body */}
                    <div className="relative w-full h-full">
                        {/* Outer flame - orange/red */}
                        <motion.div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-20"
                            animate={{
                                scaleX: [1, 1.1, 0.9, 1],
                                scaleY: [1, 1.15, 0.95, 1],
                                x: [0, -2, 2, 0],
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{
                                background: 'radial-gradient(ellipse at center bottom, #ff6b35 0%, #ff8c42 30%, #ffa500 60%, transparent 100%)',
                                clipPath: 'polygon(30% 100%, 50% 0%, 70% 100%)',
                                filter: 'blur(1px)',
                            }}
                        />
                        
                        {/* Middle flame - yellow/orange */}
                        <motion.div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10"
                            style={{ height: '72px' }}
                            animate={{
                                scaleX: [1, 1.15, 0.85, 1],
                                scaleY: [1, 1.2, 0.9, 1],
                                x: [0, 1, -1, 0],
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.1
                            }}
                            style={{
                                background: 'radial-gradient(ellipse at center bottom, #ffd700 0%, #ffa500 40%, #ff6b35 80%, transparent 100%)',
                                clipPath: 'polygon(35% 100%, 50% 0%, 65% 100%)',
                                filter: 'blur(0.5px)',
                            }}
                        />
                        
                        {/* Inner core - bright yellow/white */}
                        <motion.div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-14"
                            animate={{
                                scaleX: [1, 1.2, 0.8, 1],
                                scaleY: [1, 1.25, 0.85, 1],
                                x: [0, -1, 1, 0],
                            }}
                            transition={{
                                duration: 0.4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.2
                            }}
                            style={{
                                background: 'radial-gradient(ellipse at center bottom, #fff 0%, #ffd700 50%, #ffa500 100%)',
                                clipPath: 'polygon(40% 100%, 50% 0%, 60% 100%)',
                            }}
                        />
                        
                        {/* Flickering particles */}
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                                style={{
                                    bottom: `${10 + i * 8}%`,
                                    left: `${45 + (i % 3 - 1) * 5}%`,
                                }}
                                animate={{
                                    y: [0, -15, 0],
                                    x: [(i % 3 - 1) * 3, (i % 3 - 1) * 6, (i % 3 - 1) * 3],
                                    opacity: [0.8, 0.3, 0.8],
                                    scale: [0.8, 1.2, 0.8],
                                }}
                                transition={{
                                    duration: 0.5 + i * 0.1,
                                    repeat: Infinity,
                                    ease: "easeOut",
                                    delay: i * 0.1
                                }}
                            />
                        ))}
                    </div>
                    
                    {/* Base glow */}
                    <motion.div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full"
                        animate={{
                            opacity: [0.6, 0.9, 0.6],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            background: 'radial-gradient(ellipse, #ff6b35 0%, transparent 100%)',
                            filter: 'blur(4px)',
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export function EvaporationLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Supplies tracking - using standardized component
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [collectedItems, setCollectedItems] = React.useState<string[]>([]);
    
    // Define supplies for the lab
    const supplies: SupplyItem[] = [
        {
            id: 'beakers',
            name: '3 Beakers',
            emoji: '🧪',
            description: 'Containers for liquids',
            required: true
        },
        {
            id: 'water',
            name: 'Water',
            emoji: '💧',
            description: 'First test liquid',
            required: true
        },
        {
            id: 'alcohol',
            name: 'Alcohol',
            emoji: '🧪',
            description: 'Second test liquid',
            required: true
        },
        {
            id: 'oil',
            name: 'Oil',
            emoji: '🛢️',
            description: 'Third test liquid',
            required: true
        }
    ];
    
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

    // Evaporation simulation - Only runs when observation is active
    React.useEffect(() => {
        if (currentStep === 'observing' && observing && beakersFilled) {
            const interval = setInterval(() => {
                setLiquidLevels(prev => {
                    // Calculate multiplier based on conditions
                    let multiplier = 1; // Base rate (room temperature - very slow)
                    
                    if (heatOn && fanOn) {
                        multiplier = EVAPORATION_MULTIPLIERS.heatAndFan;
                    } else if (heatOn) {
                        multiplier = EVAPORATION_MULTIPLIERS.heat;
                    } else if (fanOn) {
                        multiplier = EVAPORATION_MULTIPLIERS.fan;
                    }
                    // If neither heat nor fan is on, multiplier stays at 1 (natural slow evaporation)
                    
                    // Apply evaporation with appropriate rates
                    const newWater = Math.max(0, prev.water - (baseEvaporationRates.water * multiplier));
                    const newAlcohol = Math.max(0, prev.alcohol - (baseEvaporationRates.alcohol * multiplier));
                    const newOil = Math.max(0, prev.oil - (baseEvaporationRates.oil * multiplier));
                    
                    // Check if all liquids have evaporated
                    if (newWater === 0 && newAlcohol === 0 && newOil === 0) {
                        setObserving(false);
                        const conditionText = heatOn && fanOn ? "with heat and fan" : 
                                            heatOn ? "with heat" : 
                                            fanOn ? "with fan" : 
                                            "at room temperature";
                        setTeacherMessage(`All liquids have evaporated ${conditionText}! Notice that alcohol evaporated first, then water, and oil was slowest. This is because alcohol has weaker intermolecular forces!`);
                        // Give students time to observe before auto-transitioning
                        setTimeout(() => {
                            setCurrentStep('results');
                        }, 3000);
                    }
                    
                    return { water: newWater, alcohol: newAlcohol, oil: newOil };
                });
                
                setTimeElapsed(prev => prev + 1);
            }, 500);
            
            return () => clearInterval(interval);
        }
    }, [currentStep, observing, fanOn, heatOn, beakersFilled]);

    const handleStartExperiment = () => {
        setCurrentStep('collect-supplies');
        setTeacherMessage("Great! Let's gather our supplies. We need 3 beakers, water, alcohol, and oil. Click on each item to collect them!");
    };
    
    // Supplies collection handlers
    const handleCollect = React.useCallback((itemId: string) => {
        if (!collectedItems.includes(itemId)) {
            setCollectedItems(prev => [...prev, itemId]);
        }
    }, [collectedItems]);

    const handleAllSuppliesCollected = React.useCallback(() => {
        setCurrentStep('setup-beakers');
        setTeacherMessage("All supplies collected! Now click on each beaker to fill it with its liquid.");
    }, []);
    
    const handleFillBeakers = () => {
        if (!beakersFilled) {
            setBeakersFilled(true);
            setTeacherMessage("Beakers filled! Now you can choose conditions to test. Try turning on the FAN (airflow) or HEAT to see how they affect evaporation speed!");
            setCurrentStep('add-conditions');
        }
    };

    const handleToggleFan = () => {
        setFanOn(!fanOn);
    };

    const handleToggleHeat = () => {
        setHeatOn(!heatOn);
    };

    const handleStartObservation = () => {
        if (!beakersFilled) {
            setTeacherMessage("Please fill the beakers first before starting observation!");
            return;
        }
        
        setObserving(true);
        setCurrentStep('observing');
        
        // Provide context-aware message based on conditions
        if (!heatOn && !fanOn) {
            setTeacherMessage("Observation started at room temperature! Evaporation will be very slow - this is natural evaporation. Watch carefully as the liquid levels drop slowly. Alcohol will evaporate faster than water, and oil will be slowest. Try turning on heat or fan to see how they speed up evaporation!");
        } else if (heatOn && fanOn) {
            setTeacherMessage("Observation started with heat and fan! Watch how quickly the liquids evaporate now. The combination of heat and airflow dramatically speeds up evaporation. Notice which liquid disappears first!");
        } else if (heatOn) {
            setTeacherMessage("Observation started with heat! The increased temperature gives molecules more energy to escape. Watch how much faster evaporation happens compared to room temperature!");
        } else {
            setTeacherMessage("Observation started with fan! The airflow removes vapor molecules, allowing more liquid to evaporate. Notice how this speeds up the process!");
        }
    };

    const handleTeacherComplete = () => {
        // No pending transitions - immediate responsiveness
    };

    const handleViewResults = () => {
        setTeacherMessage("Fantastic observations! You've seen how different liquids evaporate at different rates. Now let's test what you learned!");
        setCurrentStep('quiz');
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
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setCurrentStep('complete');
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Review which liquid evaporates fastest and try again!`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: alcohol has weak intermolecular forces, so it evaporates quickest!`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setCollectedItems([]);
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
        setXpEarned(0);
        setTeacherMessage("Welcome back! Ready to explore evaporation again? Let's compare how different liquids evaporate!");
    };

    return (
        <div className="relative min-h-screen pb-20 overflow-hidden">
            {/* Premium Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-teal-950/20" />
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-r from-blue-200/30 to-cyan-200/30 dark:from-blue-800/20 dark:to-cyan-800/20 blur-3xl"
                        style={{
                            width: `${200 + i * 100}px`,
                            height: `${200 + i * 100}px`,
                            left: `${(i * 15) % 100}%`,
                            top: `${(i * 20) % 100}%`,
                        }}
                        animate={{
                            x: [0, 50, 0],
                            y: [0, 30, 0],
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

            <div className="relative z-10 space-y-6 pb-20">
            {/* Teacher Voice */}
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
                emotion={currentStep === 'complete' ? 'celebrating' : currentStep === 'observing' ? 'explaining' : 'happy'}
                quickActions={[
                    { label: 'Reset Lab', icon: '🔄', onClick: handleRestart },
                    { label: 'View Theory', icon: '📖', onClick: () => {} },
                    { label: 'Safety Tips', icon: '🛡️', onClick: () => {} }
                ]}
            />

            {currentStep === 'intro' && isCompleted && (
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

            {/* Premium Objective Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="border-2 border-blue-300/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50/80 via-cyan-50/80 to-teal-50/80 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-teal-950/30 backdrop-blur-sm shadow-lg">
                    <CardHeader className="relative z-10 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 dark:from-blue-900/30 dark:to-cyan-900/30 border-b border-blue-200/50 dark:border-blue-800/50">
                        <CardTitle className="flex items-center gap-2">
                            <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            Evaporation of Liquids
                        </CardTitle>
                        <CardDescription className="text-blue-900/80 dark:text-blue-100/80">Compare evaporation rates of different liquids</CardDescription>
                    </CardHeader>
                </Card>
            </motion.div>

            {/* Premium Lab Information Card */}
            {currentStep === 'intro' && (
<motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="border-2 border-blue-300/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50/80 via-cyan-50/80 to-teal-50/80 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-teal-950/30 backdrop-blur-sm shadow-lg">
                    <CardHeader className="relative z-10 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 dark:from-blue-900/30 dark:to-cyan-900/30 border-b border-blue-200/50 dark:border-blue-800/50">
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            Lab Information
                        </CardTitle>
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
            </motion.div>
)}


            {/* Supplies Collection Step */}
            {currentStep === 'collect-supplies' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <LabSupplies
                        supplies={supplies}
                        collectedItems={collectedItems}
                        onCollect={handleCollect}
                        showSupplies={showSupplies}
                        title="Lab Supplies - Click to Collect"
                        description="Collect all the supplies needed to compare evaporation rates"
                        onAllCollected={handleAllSuppliesCollected}
                    />
                </motion.div>
            )}

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
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
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
                                <Button 
                                    onClick={handleStartExperiment} 
                                    className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold" 
                                    size="lg"
                                >
                                    Start Experiment
                                </Button>
                            </CardFooter>
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
                        <Card className="border-2 border-blue-300/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50/80 via-cyan-50/80 to-teal-50/80 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-teal-950/30 backdrop-blur-sm shadow-lg">
                            <CardHeader className="relative z-10 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 dark:from-blue-900/30 dark:to-cyan-900/30 border-b border-blue-200/50 dark:border-blue-800/50">
                                <CardTitle className="flex items-center gap-2">
                                    <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    Interactive Experiment
                                </CardTitle>
                                <CardDescription className="text-blue-900/80 dark:text-blue-100/80">
                                    {currentStep === 'setup-beakers' && 'Click beakers to fill them'}
                                    {currentStep === 'add-conditions' && 'Toggle fan/heat and start observation'}
                                    {currentStep === 'observing' && (
                                        <div className="flex items-center gap-2">
                                            <span>Time: {(timeElapsed / 2).toFixed(1)}s</span>
                                            {!heatOn && !fanOn && (
                                                <span className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                                                    ⚡ Natural evaporation (slow)
                                                </span>
                                            )}
                                            {heatOn && (
                                                <span className="text-xs bg-red-100 dark:bg-red-900 px-2 py-1 rounded">
                                                    🔥 Heat: {EVAPORATION_MULTIPLIERS.heat}x faster
                                                </span>
                                            )}
                                            {fanOn && (
                                                <span className="text-xs bg-cyan-100 dark:bg-cyan-900 px-2 py-1 rounded">
                                                    💨 Fan: {EVAPORATION_MULTIPLIERS.fan}x faster
                                                </span>
                                            )}
                                            {heatOn && fanOn && (
                                                <span className="text-xs bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded">
                                                    ⚡ Combined: {EVAPORATION_MULTIPLIERS.heatAndFan}x faster
                                                </span>
                                            )}
                                        </div>
                                    )}
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
                                            className={cn(
                                                "flex items-center gap-2",
                                                fanOn ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg" : "text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20 border-blue-300 dark:border-blue-700"
                                            )}
                                        >
                                            <Wind className={cn("h-5 w-5", fanOn && "animate-spin")} />
                                            <span>Fan {fanOn ? 'ON' : 'OFF'}</span>
                                        </Button>
                                        <Button
                                            onClick={handleToggleHeat}
                                            variant={heatOn ? 'destructive' : 'outline'}
                                            disabled={observing}
                                            className={cn(
                                                "flex items-center gap-2",
                                                heatOn ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg" : "text-slate-700 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-300 dark:border-red-700"
                                            )}
                                        >
                                            <Flame className="h-5 w-5" />
                                            <span>Heat {heatOn ? 'ON' : 'OFF'}</span>
                                        </Button>
                                        {currentStep === 'add-conditions' && (
                                            <div className="flex flex-col items-center gap-2">
                                                <Button 
                                                    onClick={handleStartObservation} 
                                                    size="lg" 
                                                    disabled={!beakersFilled}
                                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Start Observation
                                                </Button>
                                                {!beakersFilled && (
                                                    <p className="text-xs text-muted-foreground">Fill beakers first</p>
                                                )}
                                                {beakersFilled && !heatOn && !fanOn && (
                                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                                        💡 Tip: Turn on heat or fan to see faster evaporation!
                                                    </p>
                                                )}
                                            </div>
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
                                        
                                        {/* Enhanced Flame Visualization */}
                                        {heatOn && beakersFilled && (
                                            <EnhancedFlame isActive={heatOn} />
                                        )}
                                        
                                        {/* Environmental Indicators */}
                                        {(currentStep === 'add-conditions' || currentStep === 'observing') && (
                                            <div className="absolute top-4 right-4 flex gap-4">
                                                {fanOn && (
                                                    <motion.div 
                                                        className="flex flex-col items-center gap-1"
                                                        animate={{ rotate: [0, 360] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <Wind className="h-6 md:h-8 w-6 md:w-8 text-blue-500" />
                                                        <span className="text-xs text-blue-600 font-medium">Wind</span>
                                                    </motion.div>
                                                )}
                                                {heatOn && (
                                                    <motion.div 
                                                        className="flex flex-col items-center gap-1"
                                                        animate={{ scale: [1, 1.1, 1] }}
                                                        transition={{ duration: 0.8, repeat: Infinity }}
                                                    >
                                                        <Flame className="h-6 md:h-8 w-6 md:w-8 text-red-500 drop-shadow-lg" />
                                                        <span className="text-xs text-red-600 font-medium">Heat</span>
                                                    </motion.div>
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
                        <Card className="border-2 border-blue-300/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50/80 via-cyan-50/80 to-teal-50/80 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-teal-950/30 backdrop-blur-sm shadow-lg">
                            <CardHeader className="relative z-10 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 dark:from-blue-900/30 dark:to-cyan-900/30 border-b border-blue-200/50 dark:border-blue-800/50">
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    Experiment Results
                                </CardTitle>
                                <CardDescription className="text-blue-900/80 dark:text-blue-100/80">Analysis of your observations</CardDescription>
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
                                <Button 
                                    onClick={handleViewResults} 
                                    className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold" 
                                    size="lg"
                                >
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
                        <Card className="border-2 border-blue-300/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50/80 via-cyan-50/80 to-teal-50/80 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-teal-950/30 backdrop-blur-sm shadow-lg">
                            <CardHeader className="relative z-10 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 dark:from-blue-900/30 dark:to-cyan-900/30 border-b border-blue-200/50 dark:border-blue-800/50">
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    Knowledge Check
                                </CardTitle>
                                <CardDescription className="text-blue-900/80 dark:text-blue-100/80">Answer these questions about evaporation</CardDescription>
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
                            <CardFooter className="relative z-10 flex gap-3 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30 border-t border-blue-200/50 dark:border-blue-800/50">
                                <Button 
                                    onClick={handleQuizSubmit} 
                                    disabled={!selectedAnswer1 || !selectedAnswer2 || !selectedAnswer3 || quizSubmitted}
                                    className="flex-1 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                                    size="lg"
                                >
                                    Submit Answers
                                </Button>
                                {quizSubmitted && !quizFeedback.includes('Perfect') && (
                                    <Button 
                                        onClick={() => {
                                            setSelectedAnswer1(null);
                                            setSelectedAnswer2(null);
                                            setSelectedAnswer3(null);
                                            setQuizFeedback('');
                                            setQuizSubmitted(false);
                                        }} 
                                        variant="outline" 
                                        size="lg"
                                        className="text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20 border-blue-300 dark:border-blue-700"
                                    >
                                        <span>Try Again</span>
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

            </AnimatePresence>

            {/* Lab Complete Section */}
            {currentStep === 'complete' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-2 border-blue-300/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50/95 via-cyan-50/95 to-teal-50/95 dark:from-blue-950/95 dark:via-cyan-950/95 dark:to-teal-950/95 backdrop-blur-md shadow-2xl max-w-2xl w-full mx-4">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <motion.div
                                        animate={{ 
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ 
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <Trophy className="h-20 w-20 text-blue-500 dark:text-blue-400" />
                                    </motion.div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                                        Lab Complete!
                                    </h2>
                                    <p className="text-lg text-blue-900/80 dark:text-blue-100/80">
                                        You've mastered evaporation rates!
                                    </p>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
                                        <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        What You've Learned:
                                    </h3>
                                    <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <span>Different liquids evaporate at different rates</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <span>Intermolecular forces determine evaporation speed</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <span>Heat and airflow increase evaporation rates</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <span>Alcohol evaporates fastest, oil slowest</span>
                                        </li>
                                    </ul>
                                </div>

                                {xpEarned > 0 && (
                                    <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg border border-blue-300/50 dark:border-blue-700/50">
                                        <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        <span className="text-xl font-bold text-blue-900 dark:text-blue-100">
                                            +{xpEarned} XP Earned!
                                        </span>
                                    </div>
                                )}

                                <Button
                                    onClick={handleRestart}
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                                >
                                    <RefreshCw className="h-5 w-5 mr-2" />
                                    Restart Lab
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            )}

            {showCelebration && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                >
                    <div className="text-6xl">💧✨</div>
                </motion.div>
            )}
            </div>
        </div>
    );
}

