'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Flame, Droplets, BookOpen, Shield, Sparkles, Trophy, Award, GripVertical, Thermometer, RefreshCw } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { LabSupplies, SupplyItem } from './LabSupplies';

type Step = 'intro' | 'collect-supplies' | 'setup' | 'heat-metal' | 'heat-water' | 'heat-alcohol' | 'results' | 'quiz' | 'complete';

// Enhanced Flame Component - Premium Design
function EnhancedFlame({ isHeating }: { isHeating: boolean }) {
    if (!isHeating) return null;
    return (
        <motion.div
            className="relative w-16 h-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
        >
            {/* Heat shimmer effect */}
            <motion.div
                className="absolute inset-x-0 -top-8 h-16 bg-gradient-to-b from-red-300/30 to-transparent blur-xl"
                animate={{
                    scaleY: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Outer flame - red/orange */}
            <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-20"
                animate={{
                    scaleX: [1, 1.05, 0.95, 1],
                    scaleY: [1, 1.1, 0.9, 1],
                    y: [0, -2, 0],
                    x: [0, 0.5, -0.5, 0],
                }}
                transition={{
                    duration: 0.7,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    background: 'radial-gradient(ellipse at center bottom, #ff4500 0%, #ff8c00 50%, transparent 100%)',
                    clipPath: 'polygon(30% 100%, 50% 0%, 70% 100%)',
                    filter: 'blur(1px)',
                }}
            />

            {/* Middle flame - yellow/orange */}
            <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-16"
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
        </motion.div>
    );
}

export function ThermalExpansionLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    
    // Supplies tracking - using standardized component
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [collectedItems, setCollectedItems] = React.useState<string[]>([]);
    
    // Define supplies for the lab
    const supplies: SupplyItem[] = [
        {
            id: 'metal-rod',
            name: 'Metal Rod',
            emoji: '🔩',
            description: 'Solid material to test expansion',
            required: true
        },
        {
            id: 'water',
            name: 'Water',
            emoji: '💧',
            description: 'Liquid for expansion comparison',
            required: true
        },
        {
            id: 'alcohol',
            name: 'Alcohol',
            emoji: '🧪',
            description: 'Liquid with different expansion rate',
            required: true
        },
        {
            id: 'thermometer',
            name: 'Thermometer',
            emoji: '🌡️',
            description: 'Temperature measurement device',
            required: true
        }
    ];
    
    // Experiment state
    const [suppliesReady, setSuppliesReady] = React.useState(false);
    const [metalExpanded, setMetalExpanded] = React.useState(false);
    const [waterExpanded, setWaterExpanded] = React.useState(false);
    const [alcoholExpanded, setAlcoholExpanded] = React.useState(false);
    const [heatingMaterial, setHeatingMaterial] = React.useState<string | null>(null);
    const [metalHeatingComplete, setMetalHeatingComplete] = React.useState(false);
    const [waterHeatingComplete, setWaterHeatingComplete] = React.useState(false);
    const [alcoholHeatingComplete, setAlcoholHeatingComplete] = React.useState(false);
    
    // Temperature tracking
    const [temperatures, setTemperatures] = React.useState({
        metal: 20,
        water: 20,
        alcohol: 20
    });
    
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
    const labId = 'thermal-expansion';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    // Intro message
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Thermal Expansion Lab! When we heat materials, their particles move more and spread apart. We'll test a metal rod, water, and alcohol to see how much each expands. Which will expand the most?");
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setCurrentStep('collect-supplies');
        setTeacherMessage("Perfect! Let's gather our supplies. We need a metal rod, water, alcohol, and a thermometer. Click on each item to collect them!");
    };
    
    // Supplies collection handlers
    const handleCollect = React.useCallback((itemId: string) => {
        if (!collectedItems.includes(itemId)) {
            setCollectedItems(prev => [...prev, itemId]);
        }
    }, [collectedItems]);

    const handleAllSuppliesCollected = React.useCallback(() => {
        setShowSupplies(false);
        setCurrentStep('setup');
        setTeacherMessage("All supplies ready! Now we'll set up three containers and heat each one. Watch what happens to each material!");
    }, []);
    
    const handleSetupComplete = () => {
        if (!suppliesReady) {
            setSuppliesReady(true);
            setTeacherMessage("Containers filled! Now let's start heating. Click the FLAME under the metal rod first!");
            toast({ title: '✅ Setup Complete' });
            setCurrentStep('heat-metal');
        }
    };
    
    const handleHeatMaterial = (material: 'metal' | 'water' | 'alcohol') => {
        setHeatingMaterial(material);
        
        // Simulate gradual heating with visible expansion
        const heatInterval = setInterval(() => {
            setTemperatures(prev => {
                const newTemp = prev[material] + 2; // Slower temperature increase for visibility
                
                // Trigger expansion at certain temperatures for visual effect
                if (material === 'metal' && newTemp >= 50 && !metalExpanded) {
                    setMetalExpanded(true);
                } else if (material === 'water' && newTemp >= 50 && !waterExpanded) {
                    setWaterExpanded(true);
                } else if (material === 'alcohol' && newTemp >= 50 && !alcoholExpanded) {
                    setAlcoholExpanded(true);
                }
                
                if (newTemp >= 80) {
                    clearInterval(heatInterval);
                    setHeatingMaterial(null);
                    
                    if (material === 'metal') {
                        setMetalHeatingComplete(true);
                        setTeacherMessage("Wow! The metal rod expanded by 15%! Notice how it grew. Solids expand the least. Take your time to observe, then click 'Continue' when ready!");
                    } else if (material === 'water') {
                        setWaterHeatingComplete(true);
                        setTeacherMessage("The water expanded by 30%! Much more than the metal! Liquids expand more than solids. Observe the difference, then click 'Continue' when ready!");
                    } else if (material === 'alcohol') {
                        setAlcoholHeatingComplete(true);
                        setTeacherMessage("Amazing! Alcohol expanded by 40% - the MOST! This clearly shows different materials have different expansion rates! Take your time to observe all three materials, then click 'Continue to Results' when ready!");
                    }
                    return prev;
                }
                return { ...prev, [material]: newTemp };
            });
        }, 200); // Slower interval for more visible changes
        
        toast({ title: `🔥 Heating ${material}... Watch it expand!` });
    };
    
    const handleViewResults = () => {
        setTeacherMessage("Excellent work! You've seen how different materials expand differently when heated. Now let's test your knowledge!");
        setCurrentStep('quiz');
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        if (selectedAnswer1 === 'alcohol') correctCount++;
        if (selectedAnswer2 === 'liquid') correctCount++;
        if (selectedAnswer3 === 'kinetic') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand thermal expansion! +${earnedXP} XP`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Think about which material expanded the most and why!`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: different materials expand at different rates due to their molecular structure!`);
        }
    };

    const handleContinueAfterMetal = () => {
        setMetalHeatingComplete(false);
        setCurrentStep('heat-water');
        setTeacherMessage("Great! Now let's heat the water and see how much it expands!");
    };

    const handleContinueAfterWater = () => {
        setWaterHeatingComplete(false);
        setCurrentStep('heat-alcohol');
        setTeacherMessage("Excellent! Now let's heat the alcohol - it should expand even more!");
    };

    const handleContinueAfterAlcohol = () => {
        setAlcoholHeatingComplete(false);
        setCurrentStep('results');
        setTeacherMessage("Perfect! You've observed all three materials. Let's review the results!");
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setShowSupplies(true);
        setCollectedItems([]);
        setSuppliesReady(false);
        setMetalExpanded(false);
        setWaterExpanded(false);
        setAlcoholExpanded(false);
        setHeatingMaterial(null);
        setMetalHeatingComplete(false);
        setWaterHeatingComplete(false);
        setAlcoholHeatingComplete(false);
        setTemperatures({ metal: 20, water: 20, alcohol: 20 });
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setTeacherMessage("Welcome back! Ready to explore thermal expansion again? Let's heat some materials!");
    };

    return (
        <div className="relative min-h-screen pb-20">
            {/* Premium Animated Background - Physics Theme */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20" />
                {/* Animated orbs */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-red-200/40 via-orange-200/40 to-yellow-200/40 dark:from-red-800/20 dark:via-orange-800/20 dark:to-yellow-800/20 blur-3xl"
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
                            delay: i * 0.5,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 space-y-6">
            <TeacherVoice 
                message={teacherMessage}
            />

            {currentStep === 'intro' && isCompleted && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                            <Trophy className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-900 dark:text-red-100">Lab Completed!</h3>
                            <p className="text-sm text-red-700 dark:text-red-300">
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
                            <CardDescription>You've completed the Thermal Expansion Lab!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-red-600">
                                <Award className="h-8 w-8" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You've mastered thermal expansion!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="bg-gradient-to-br from-white/80 via-red-50/50 to-orange-50/50 dark:from-gray-900/80 dark:via-red-950/30 dark:to-orange-950/30 backdrop-blur-sm border-2 border-red-200/50 dark:border-red-800/50 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-red-100/50 to-orange-100/50 dark:from-red-900/20 dark:to-orange-900/20 border-b border-red-200/50 dark:border-red-800/50">
                        <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-red-700 to-orange-700 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                            <Thermometer className="h-6 w-6 text-red-600 dark:text-red-400" />
                            Thermal Expansion
                        </CardTitle>
                        <CardDescription className="text-base mt-2">Observe how materials expand when heated</CardDescription>
                    </CardHeader>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="bg-gradient-to-br from-white/80 via-red-50/50 to-orange-50/50 dark:from-gray-900/80 dark:via-red-950/30 dark:to-orange-950/30 backdrop-blur-sm border-2 border-red-200/50 dark:border-red-800/50 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-red-100/50 to-orange-100/50 dark:from-red-900/20 dark:to-orange-900/20 border-b border-red-200/50 dark:border-red-800/50">
                        <CardTitle className="text-xl bg-gradient-to-r from-red-700 to-orange-700 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">Lab Information</CardTitle>
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
                                <p><strong>Thermal expansion</strong> is when materials increase in size when heated.</p>
                                <p><strong>Why does this happen?</strong> When heat is added, particles gain energy and vibrate faster, pushing each other further apart.</p>
                                <p><strong>Different rates:</strong></p>
                                <ul>
                                    <li>Solids expand slightly (tight structure)</li>
                                    <li>Liquids expand more than solids (loose structure)</li>
                                    <li>Different liquids expand at different rates</li>
                                    <li>Described by the <strong>coefficient of thermal expansion</strong></li>
                                </ul>
                                <p><strong>Real-world applications:</strong></p>
                                <ul>
                                    <li>Bridge expansion joints allow for movement</li>
                                    <li>Glass thermometers use mercury expansion</li>
                                    <li>Metal railway tracks need gaps</li>
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
                                    <li>Wear safety goggles when using heat sources</li>
                                    <li>Use heat-resistant gloves to handle hot objects</li>
                                    <li>Never touch hot materials directly</li>
                                    <li>Use tongs to handle metal rods</li>
                                    <li>Be careful when heating liquids - they can splatter</li>
                                    <li>Never leave heat sources unattended</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
            </motion.div>

            <AnimatePresence mode="wait">
                {currentStep === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="bg-gradient-to-br from-white/90 via-red-50/70 to-orange-50/70 dark:from-gray-900/90 dark:via-red-950/40 dark:to-orange-950/40 backdrop-blur-sm border-2 border-red-200/50 dark:border-red-800/50 shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-red-100/50 to-orange-100/50 dark:from-red-900/20 dark:to-orange-900/20 border-b border-red-200/50 dark:border-red-800/50">
                                <CardTitle className="text-2xl bg-gradient-to-r from-red-700 to-orange-700 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">Welcome to the Thermal Expansion Lab!</CardTitle>
                                <CardDescription className="text-base">Discover how heat changes material size</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-6 rounded-lg border-2 border-red-200 dark:border-red-800">
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                        <Thermometer className="w-16 h-16 text-red-600 dark:text-red-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-red-900 dark:text-red-100">What We'll Discover:</h3>
                                            <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                                                <li>• How heat causes materials to expand</li>
                                                <li>• Compare expansion of solid vs liquid</li>
                                                <li>• See which material expands the most</li>
                                                <li>• Understand the coefficient of thermal expansion</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20 border-t border-red-200/50 dark:border-red-800/50">
                                <Button 
                                    onClick={handleStartExperiment} 
                                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                                    size="lg"
                                >
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
                            supplies={supplies}
                            collectedItems={collectedItems}
                            onCollect={handleCollect}
                            showSupplies={showSupplies}
                            onAllCollected={handleAllSuppliesCollected}
                        />
                    </motion.div>
                )}

                {(currentStep === 'setup' || currentStep === 'heat-metal' || currentStep === 'heat-water' || currentStep === 'heat-alcohol') && (
                    <motion.div
                        key="experiment"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="bg-gradient-to-br from-white/90 via-red-50/70 to-orange-50/70 dark:from-gray-900/90 dark:via-red-950/40 dark:to-orange-950/40 backdrop-blur-sm border-2 border-red-200/50 dark:border-red-800/50 shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-red-100/50 to-orange-100/50 dark:from-red-900/20 dark:to-orange-900/20 border-b border-red-200/50 dark:border-red-800/50">
                                <CardTitle className="flex items-center gap-2 text-xl bg-gradient-to-r from-red-700 to-orange-700 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                                    <Flame className="h-6 w-6 text-red-600 dark:text-red-400" />
                                    Interactive Experiment
                                </CardTitle>
                                <CardDescription className="text-base">Click to heat each material</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                {/* Setup Stage */}
                                {currentStep === 'setup' && !suppliesReady && (
                                    <div className="text-center space-y-4">
                                        <p className="text-lg font-medium">Click on the containers to fill them with materials</p>
                                        <Button 
                                            onClick={handleSetupComplete} 
                                            size="lg"
                                            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            Setup Containers
                                        </Button>
                                    </div>
                                )}
                                
                                {/* Experiment Area */}
                                <div className="flex justify-center items-center">
                                    <div className="relative min-h-[400px] md:min-h-[500px] w-full max-w-3xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 p-4 md:p-8">
                                        {/* Three Containers */}
                                        <div className="flex gap-6 md:gap-10 justify-center items-end h-full">
                                            {/* Metal Rod */}
                                            <motion.div
                                                onClick={currentStep === 'heat-metal' && suppliesReady ? () => handleHeatMaterial('metal') : undefined}
                                                whileHover={currentStep === 'heat-metal' && suppliesReady && !heatingMaterial ? { scale: 1.05 } : {}}
                                                className={cn(
                                                    "relative flex flex-col items-center gap-2",
                                                    currentStep === 'heat-metal' && suppliesReady && !heatingMaterial && "cursor-pointer"
                                                )}
                                            >
                                                <span className="text-xs md:text-sm font-medium">Metal Rod</span>
                                                <div className="relative h-40 md:h-48 flex items-end justify-center">
                                                    {/* Measurement Ruler Scale */}
                                                    <div className="absolute -left-12 top-0 bottom-0 w-8 flex flex-col items-center">
                                                        {/* Ruler background */}
                                                        <div className="w-6 h-full bg-white dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-sm shadow-md" />
                                                        {/* Ruler markings */}
                                                        {[...Array(9)].map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className="absolute left-0 w-6 flex items-center justify-between px-1"
                                                                style={{ top: `${(i * 12.5)}%` }}
                                                            >
                                                                <div className="w-2 h-0.5 bg-gray-600 dark:bg-gray-400" />
                                                                <span className="text-[8px] font-bold text-gray-700 dark:text-gray-300">
                                                                    {8 - i}
                                                                </span>
                                                                <div className="w-2 h-0.5 bg-gray-600 dark:bg-gray-400" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    {/* Metal rod - 3D cylindrical design */}
                                                    <div className="relative flex items-end">
                                                        {/* Rod shadow/ground */}
                                                        <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gray-800/30 dark:bg-gray-200/30 rounded-full blur-sm" />
                                                        
                                                        {/* Metal rod with expansion */}
                                                        <motion.div
                                                            animate={{ 
                                                                scaleX: metalExpanded ? 1.15 : 1,
                                                                width: metalExpanded ? '120%' : '100%'
                                                            }}
                                                            transition={{ duration: 2, ease: "easeOut" }}
                                                            className="relative origin-left"
                                                            style={{ width: '60px', height: '160px' }}
                                                        >
                                                            {/* 3D Cylindrical Rod */}
                                                            <div className="relative w-full h-full">
                                                                {/* Main cylinder body */}
                                                                <div className="absolute inset-0 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-full shadow-xl" />
                                                                
                                                                {/* Top cap */}
                                                                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-300 to-gray-500 dark:from-gray-500 dark:to-gray-700 rounded-t-full" />
                                                                
                                                                {/* Bottom cap */}
                                                                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-600 to-gray-400 dark:from-gray-700 dark:to-gray-500 rounded-b-full" />
                                                                
                                                                {/* Shine/highlight */}
                                                                <div className="absolute top-2 left-2 right-4 h-3/4 bg-gradient-to-r from-white/40 to-transparent rounded-full" />
                                                                
                                                                {/* Metallic rings */}
                                                                {[...Array(3)].map((_, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="absolute left-0 right-0 h-0.5 bg-gray-600/50 dark:bg-gray-400/50"
                                                                        style={{ top: `${25 + i * 25}%` }}
                                                                    />
                                                                ))}
                                                            </div>
                                                            
                                                            {/* Expansion indicator */}
                                                            {metalExpanded && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    className="absolute -right-12 top-1/2 -translate-y-1/2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10"
                                                                >
                                                                    +15%
                                                                </motion.div>
                                                            )}
                                                            
                                                            {/* Length measurement line */}
                                                            <div className="absolute -bottom-6 left-0 right-0 flex items-center justify-center">
                                                                <div className="relative">
                                                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500" />
                                                                    <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-red-500" />
                                                                    <div className="absolute inset-x-0 top-0 h-0.5 bg-red-500" />
                                                                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-red-500" />
                                                                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400 px-1 bg-white dark:bg-gray-800">
                                                                        {metalExpanded ? '115mm' : '100mm'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                </div>
                                                {suppliesReady && (
                                                    <div className="text-sm font-semibold bg-red-100 dark:bg-red-900 px-2 py-1 rounded">
                                                        {temperatures.metal}°C
                                                    </div>
                                                )}
                                                {currentStep === 'heat-metal' && suppliesReady && !heatingMaterial && !metalHeatingComplete && (
                                                    <p className="text-xs md:text-sm font-medium bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded">
                                                        Click to Heat
                                                    </p>
                                                )}
                                                {heatingMaterial === 'metal' && (
                                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                                                        <EnhancedFlame isHeating={true} />
                                                    </div>
                                                )}
                                                {metalHeatingComplete && currentStep === 'heat-metal' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mt-3 w-full"
                                                    >
                                                        <Button
                                                            onClick={handleContinueAfterMetal}
                                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
                                                            size="lg"
                                                        >
                                                            Continue to Water
                                                        </Button>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                            
                                            {/* Water Container */}
                                            <motion.div
                                                onClick={currentStep === 'heat-water' && suppliesReady ? () => handleHeatMaterial('water') : undefined}
                                                whileHover={currentStep === 'heat-water' && suppliesReady && !heatingMaterial ? { scale: 1.05 } : {}}
                                                className={cn(
                                                    "relative flex flex-col items-center gap-2",
                                                    currentStep === 'heat-water' && suppliesReady && !heatingMaterial && "cursor-pointer"
                                                )}
                                            >
                                                <span className="text-xs md:text-sm font-medium">Water</span>
                                                <div className="relative w-14 md:w-20 h-40 md:h-48 border-2 border-blue-400 rounded-lg bg-blue-50/30 dark:bg-blue-900/20 overflow-visible">
                                                    {/* Measurement Ruler Scale */}
                                                    <div className="absolute -left-12 top-0 bottom-0 w-8 flex flex-col items-center">
                                                        {/* Ruler background */}
                                                        <div className="w-6 h-full bg-white dark:bg-gray-800 border-2 border-blue-400 dark:border-blue-600 rounded-sm shadow-md" />
                                                        {/* Ruler markings */}
                                                        {[...Array(9)].map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className="absolute left-0 w-6 flex items-center justify-between px-1"
                                                                style={{ top: `${(i * 12.5)}%` }}
                                                            >
                                                                <div className="w-2 h-0.5 bg-blue-600 dark:bg-blue-400" />
                                                                <span className="text-[8px] font-bold text-blue-700 dark:text-blue-300">
                                                                    {8 - i}
                                                                </span>
                                                                <div className="w-2 h-0.5 bg-blue-600 dark:bg-blue-400" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    {suppliesReady && (
                                                        <>
                                                            {/* Initial level marker */}
                                                            <div className="absolute left-0 right-0 h-0.5 bg-blue-600/50 dark:bg-blue-400/50" style={{ bottom: '50%' }} />
                                                            
                                                            {/* Water level with dramatic expansion */}
                                                            <motion.div
                                                                className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-700 dark:to-blue-500 rounded-b-lg shadow-inner"
                                                                animate={{ 
                                                                    height: waterExpanded ? '80%' : '50%',
                                                                }}
                                                                transition={{ duration: 2, ease: "easeOut" }}
                                                            >
                                                                {/* Water surface shine */}
                                                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-blue-200/80 to-transparent" />
                                                            </motion.div>
                                                            
                                                            {/* Expansion indicator */}
                                                            {waterExpanded && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className="absolute -right-12 top-1/2 -translate-y-1/2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10"
                                                                >
                                                                    +30%
                                                                </motion.div>
                                                            )}
                                                            
                                                            {/* Level measurement */}
                                                            <div className="absolute -right-16 top-0 bottom-0 flex flex-col items-center justify-between py-2">
                                                                <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 px-1 rounded">
                                                                    {waterExpanded ? '80%' : '50%'}
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                {suppliesReady && (
                                                    <div className="text-sm font-semibold bg-red-100 dark:bg-red-900 px-2 py-1 rounded">
                                                        {temperatures.water}°C
                                                    </div>
                                                )}
                                                {currentStep === 'heat-water' && suppliesReady && !heatingMaterial && !waterHeatingComplete && (
                                                    <p className="text-xs md:text-sm font-medium bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                                                        Click to Heat
                                                    </p>
                                                )}
                                                {heatingMaterial === 'water' && (
                                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                                                        <EnhancedFlame isHeating={true} />
                                                    </div>
                                                )}
                                                {waterHeatingComplete && currentStep === 'heat-water' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mt-3 w-full"
                                                    >
                                                        <Button
                                                            onClick={handleContinueAfterWater}
                                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
                                                            size="lg"
                                                        >
                                                            Continue to Alcohol
                                                        </Button>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                            
                                            {/* Alcohol Container */}
                                            <motion.div
                                                onClick={currentStep === 'heat-alcohol' && suppliesReady ? () => handleHeatMaterial('alcohol') : undefined}
                                                whileHover={currentStep === 'heat-alcohol' && suppliesReady && !heatingMaterial ? { scale: 1.05 } : {}}
                                                className={cn(
                                                    "relative flex flex-col items-center gap-2",
                                                    currentStep === 'heat-alcohol' && suppliesReady && !heatingMaterial && "cursor-pointer"
                                                )}
                                            >
                                                <span className="text-xs md:text-sm font-medium">Alcohol</span>
                                                <div className="relative w-14 md:w-20 h-40 md:h-48 border-2 border-purple-400 rounded-lg bg-purple-50/30 dark:bg-purple-900/20 overflow-visible">
                                                    {/* Measurement Ruler Scale */}
                                                    <div className="absolute -left-12 top-0 bottom-0 w-8 flex flex-col items-center">
                                                        {/* Ruler background */}
                                                        <div className="w-6 h-full bg-white dark:bg-gray-800 border-2 border-purple-400 dark:border-purple-600 rounded-sm shadow-md" />
                                                        {/* Ruler markings */}
                                                        {[...Array(9)].map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className="absolute left-0 w-6 flex items-center justify-between px-1"
                                                                style={{ top: `${(i * 12.5)}%` }}
                                                            >
                                                                <div className="w-2 h-0.5 bg-purple-600 dark:bg-purple-400" />
                                                                <span className="text-[8px] font-bold text-purple-700 dark:text-purple-300">
                                                                    {8 - i}
                                                                </span>
                                                                <div className="w-2 h-0.5 bg-purple-600 dark:bg-purple-400" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    {suppliesReady && (
                                                        <>
                                                            {/* Initial level marker */}
                                                            <div className="absolute left-0 right-0 h-0.5 bg-purple-600/50 dark:bg-purple-400/50" style={{ bottom: '50%' }} />
                                                            
                                                            {/* Alcohol level with most dramatic expansion */}
                                                            <motion.div
                                                                className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-purple-400 dark:from-purple-700 dark:to-purple-500 rounded-b-lg shadow-inner"
                                                                animate={{ 
                                                                    height: alcoholExpanded ? '90%' : '50%',
                                                                }}
                                                                transition={{ duration: 2, ease: "easeOut" }}
                                                            >
                                                                {/* Liquid surface shine */}
                                                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-purple-200/80 to-transparent" />
                                                            </motion.div>
                                                            
                                                            {/* Expansion indicator */}
                                                            {alcoholExpanded && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className="absolute -right-12 top-1/2 -translate-y-1/2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10"
                                                                >
                                                                    +40%
                                                                </motion.div>
                                                            )}
                                                            
                                                            {/* Level measurement */}
                                                            <div className="absolute -right-16 top-0 bottom-0 flex flex-col items-center justify-between py-2">
                                                                <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800 px-1 rounded">
                                                                    {alcoholExpanded ? '90%' : '50%'}
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                {suppliesReady && (
                                                    <div className="text-sm font-semibold bg-red-100 dark:bg-red-900 px-2 py-1 rounded">
                                                        {temperatures.alcohol}°C
                                                    </div>
                                                )}
                                                {currentStep === 'heat-alcohol' && suppliesReady && !heatingMaterial && !alcoholHeatingComplete && (
                                                    <p className="text-xs md:text-sm font-medium bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">
                                                        Click to Heat
                                                    </p>
                                                )}
                                                {heatingMaterial === 'alcohol' && (
                                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                                                        <EnhancedFlame isHeating={true} />
                                                    </div>
                                                )}
                                                {alcoholHeatingComplete && currentStep === 'heat-alcohol' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mt-2"
                                                    >
                                                        <Button
                                                            onClick={handleContinueAfterAlcohol}
                                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
                                                            size="lg"
                                                        >
                                                            Continue to Results
                                                        </Button>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        </div>
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
                        <Card className="bg-gradient-to-br from-white/90 via-red-50/70 to-orange-50/70 dark:from-gray-900/90 dark:via-red-950/40 dark:to-orange-950/40 backdrop-blur-sm border-2 border-red-200/50 dark:border-red-800/50 shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-red-100/50 to-orange-100/50 dark:from-red-900/20 dark:to-orange-900/20 border-b border-red-200/50 dark:border-red-800/50">
                                <CardTitle className="flex items-center gap-2 text-xl bg-gradient-to-r from-red-700 to-orange-700 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                                    <CheckCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                    Experiment Results
                                </CardTitle>
                                <CardDescription className="text-base">Analysis of thermal expansion</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-6 rounded-lg border-2 border-red-200 dark:border-red-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Observations:</h3>
                                    <div className="space-y-4">
                                        <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600">
                                            <div className="flex items-center gap-3 mb-2">
                                                <CheckCircle className="h-6 w-6 text-gray-600 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <strong className="text-lg">Metal Rod expanded by 15%</strong>
                                                    <p className="text-sm text-muted-foreground">Solids have tight atomic structure, so expansion is minimal</p>
                                                </div>
                                                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-bold text-gray-700 dark:text-gray-300">
                                                    15%
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border-2 border-blue-300 dark:border-blue-600">
                                            <div className="flex items-center gap-3 mb-2">
                                                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <strong className="text-lg">Water expanded by 30%</strong>
                                                    <p className="text-sm text-muted-foreground">Liquids have looser structure, allowing greater expansion</p>
                                                </div>
                                                <div className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full font-bold text-blue-700 dark:text-blue-300">
                                                    30%
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border-2 border-purple-300 dark:border-purple-600">
                                            <div className="flex items-center gap-3 mb-2">
                                                <CheckCircle className="h-6 w-6 text-purple-600 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <strong className="text-lg">Alcohol expanded by 40% - MOST!</strong>
                                                    <p className="text-sm text-muted-foreground">Weak intermolecular forces allow maximum expansion</p>
                                                </div>
                                                <div className="bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded-full font-bold text-purple-700 dark:text-purple-300">
                                                    40%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                                    <h3 className="font-semibold mb-2">Scientific Explanation:</h3>
                                    <p className="text-sm text-muted-foreground">
                                        When heated, particles gain kinetic energy and vibrate faster, pushing each other apart. The amount of expansion depends on 
                                        how tightly bound the particles are. Solids have strong atomic bonds, so they expand minimally. Liquids have weaker 
                                        intermolecular forces, so they expand more. The coefficient of thermal expansion describes how much each material expands per degree.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20 border-t border-red-200/50 dark:border-red-800/50">
                                <Button 
                                    onClick={handleViewResults} 
                                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
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
                        <Card className="bg-gradient-to-br from-white/90 via-red-50/70 to-orange-50/70 dark:from-gray-900/90 dark:via-red-950/40 dark:to-orange-950/40 backdrop-blur-sm border-2 border-red-200/50 dark:border-red-800/50 shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-red-100/50 to-orange-100/50 dark:from-red-900/20 dark:to-orange-900/20 border-b border-red-200/50 dark:border-red-800/50">
                                <CardTitle className="text-xl bg-gradient-to-r from-red-700 to-orange-700 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">Knowledge Check</CardTitle>
                                <CardDescription className="text-base">Answer these questions about thermal expansion</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. Which material expanded the most when heated?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'metal', label: 'Metal Rod' },
                                            { value: 'water', label: 'Water' },
                                            { value: 'alcohol', label: 'Alcohol', isCorrect: true }
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
                                    <p className="font-medium">2. Why do liquids expand more than solids when heated?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'heavier', label: 'Liquids are heavier' },
                                            { value: 'liquid', label: 'Liquids have looser intermolecular structure', isCorrect: true },
                                            { value: 'cold', label: 'Liquids are colder' },
                                            { value: 'flow', label: 'Liquids can flow' }
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
                                    <p className="font-medium">3. What causes thermal expansion at the molecular level?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'gravity', label: 'Gravity becomes stronger' },
                                            { value: 'color', label: 'The material changes color' },
                                            { value: 'kinetic', label: 'Particles gain energy and vibrate faster', isCorrect: true },
                                            { value: 'density', label: 'Density increases' }
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
                            <CardFooter className="flex gap-3 bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20 border-t border-red-200/50 dark:border-red-800/50">
                                <Button 
                                    onClick={handleQuizSubmit} 
                                    disabled={!selectedAnswer1 || !selectedAnswer2 || !selectedAnswer3 || quizSubmitted}
                                    className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
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
                                        className="border-2 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                    >
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
                        <Card className="bg-gradient-to-br from-white/90 via-red-50/70 to-orange-50/70 dark:from-gray-900/90 dark:via-red-950/40 dark:to-orange-950/40 backdrop-blur-sm border-2 border-red-200/50 dark:border-red-800/50 shadow-xl">
                            <CardHeader className="text-center bg-gradient-to-r from-red-100/50 to-orange-100/50 dark:from-red-900/20 dark:to-orange-900/20 border-b border-red-200/50 dark:border-red-800/50">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.5 }}
                                    className="flex justify-center mb-4"
                                >
                                    <Trophy className="h-20 w-20 text-yellow-500" />
                                </motion.div>
                                <CardTitle className="text-2xl bg-gradient-to-r from-red-700 to-orange-700 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">Lab Complete!</CardTitle>
                                <CardDescription className="text-base">You've mastered thermal expansion</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-6 rounded-lg border-2 border-red-200 dark:border-red-800">
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span>Heat causes materials to expand due to particle motion</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span>Liquids expand more than solids</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span>Different materials have different expansion rates</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span>Thermal expansion has practical applications</span>
                                        </li>
                                    </ul>
                                </div>
                                {xpEarned > 0 && (
                                    <div className="flex items-center justify-center gap-2 text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                        <Award className="h-8 w-8 text-yellow-500" />
                                        +{xpEarned} XP
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20 border-t border-red-200/50 dark:border-red-800/50">
                                <Button 
                                    onClick={handleRestart} 
                                    variant="outline" 
                                    className="w-full border-2 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/30" 
                                    size="lg"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Restart Lab
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
        </div>
    );
}

