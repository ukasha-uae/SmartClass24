'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Flame, Droplets, BookOpen, Shield, Sparkles, Trophy, Award, GripVertical, Thermometer } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';

type Step = 'intro' | 'collect-supplies' | 'setup' | 'heat-metal' | 'heat-water' | 'heat-alcohol' | 'results' | 'quiz' | 'complete';

export function ThermalExpansionLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Supplies tracking
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [metalRodCollected, setMetalRodCollected] = React.useState(false);
    const [waterCollected, setWaterCollected] = React.useState(false);
    const [alcoholCollected, setAlcoholCollected] = React.useState(false);
    const [thermometerCollected, setThermometerCollected] = React.useState(false);
    
    // Experiment state
    const [suppliesReady, setSuppliesReady] = React.useState(false);
    const [metalExpanded, setMetalExpanded] = React.useState(false);
    const [waterExpanded, setWaterExpanded] = React.useState(false);
    const [alcoholExpanded, setAlcoholExpanded] = React.useState(false);
    const [heatingMaterial, setHeatingMaterial] = React.useState<string | null>(null);
    
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
        setTeacherMessage("Great! Let's gather our supplies. Start by clicking on the METAL ROD - we'll heat this first!");
        setPendingTransition(() => () => {
            setCurrentStep('collect-supplies');
        });
    };
    
    const handleCollectMetalRod = () => {
        if (!metalRodCollected) {
            setMetalRodCollected(true);
            setTeacherMessage("Perfect! You collected the metal rod. Metal is a solid with atoms arranged in a tight, orderly structure. When we heat it, these atoms vibrate more, causing slight expansion. Solids expand the LEAST because their atoms are locked in fixed positions.");
            toast({ 
                title: '✅ Metal Rod Collected',
                description: 'Solid material with tightly packed atoms'
            });
        }
    };
    
    const handleCollectWater = () => {
        if (metalRodCollected && !waterCollected) {
            setWaterCollected(true);
            setTeacherMessage("Good! Water collected. H₂O molecules can slide past each other - that's what makes it a liquid. When heated, water molecules gain energy and push apart more than solid atoms can. Liquids expand MORE than solids!");
            toast({ 
                title: '✅ Water Collected',
                description: 'Liquid with molecules that can flow'
            });
        }
    };
    
    const handleCollectAlcohol = () => {
        if (waterCollected && !alcoholCollected) {
            setAlcoholCollected(true);
            setTeacherMessage("Excellent! Alcohol collected. Alcohol molecules have WEAKER intermolecular forces than water - they're held together less tightly. This means alcohol will expand even MORE than water when heated. Let's see this in action!");
            toast({ 
                title: '✅ Alcohol Collected',
                description: 'Liquid with weak intermolecular forces'
            });
        }
    };
    
    const handleCollectThermometer = () => {
        if (alcoholCollected && !thermometerCollected) {
            setThermometerCollected(true);
            setShowSupplies(false);
            setTeacherMessage("All supplies ready! The thermometer will measure how much thermal energy we add to each material. More heat = more molecular kinetic energy = more expansion. Now let's set up three containers - one for each material!");
            toast({ 
                title: '✅ All Supplies Collected!',
                description: 'Ready to compare expansion rates'
            });
            setPendingTransition(() => () => {
                setCurrentStep('setup');
            });
        }
    };
    
    const handleSetupComplete = () => {
        if (!suppliesReady) {
            setSuppliesReady(true);
            setTeacherMessage("Containers filled! Each material starts at room temperature (20°C). Now we'll heat them one by one and observe the expansion. Click the FLAME under the metal rod first - let's see how solids expand!");
            toast({ 
                title: '✅ Setup Complete',
                description: 'All materials at 20°C, ready to heat'
            });
            setPendingTransition(() => () => {
                setCurrentStep('heat-metal');
            });
        }
    };
    
    const handleHeatMaterial = (material: 'metal' | 'water' | 'alcohol') => {
        setHeatingMaterial(material);
        
        // Simulate heating
        const heatInterval = setInterval(() => {
            setTemperatures(prev => {
                const newTemp = prev[material] + 5;
                if (newTemp >= 80) {
                    clearInterval(heatInterval);
                    setHeatingMaterial(null);
                    
                    if (material === 'metal') {
                        setMetalExpanded(true);
                        setTeacherMessage("Wow! The metal rod expanded! Notice it grew slightly - from 20°C to 80°C, the solid expanded just a little. Why? Metal atoms are locked in a rigid crystal structure. When heated, they vibrate more but can't move far from their positions. The coefficient of thermal expansion for steel is about 0.000012/°C - very small! Now let's heat the water and compare!");
                        toast({
                            title: '🔥 Metal Expanded!',
                            description: 'Small expansion due to rigid atomic structure'
                        });
                        setPendingTransition(() => () => {
                            setCurrentStep('heat-water');
                        });
                    } else if (material === 'water') {
                        setWaterExpanded(true);
                        setTeacherMessage("The water expanded MORE than the metal! Watch the level rise - water molecules can slide past each other, so they push apart more easily when heated. Water's thermal expansion coefficient is about 0.00021/°C - that's 17 times larger than steel! Liquids expand more than solids because their particles have freedom to move. Now let's try alcohol!");
                        toast({
                            title: '🔥 Water Expanded!',
                            description: 'Larger expansion - molecules can slide freely'
                        });
                        setPendingTransition(() => () => {
                            setCurrentStep('heat-alcohol');
                        });
                    } else if (material === 'alcohol') {
                        setAlcoholExpanded(true);
                        setTeacherMessage("Amazing! Alcohol expanded the MOST! Its thermal expansion coefficient is about 0.0011/°C - that's 5 times more than water and 92 times more than steel! Why? Alcohol molecules have WEAK intermolecular forces (weaker than water's hydrogen bonds). They easily push apart when heated. This is why alcohol thermometers work so well - small temperature changes cause big volume changes that are easy to see. Different materials = different expansion rates!");
                        toast({
                            title: '🔥 Alcohol Expanded Most!',
                            description: 'Largest expansion - weakest intermolecular forces'
                        });
                        setPendingTransition(() => () => {
                            setCurrentStep('results');
                        });
                    }
                    return prev;
                }
                return { ...prev, [material]: newTemp };
            });
        }, 300);
        
        toast({ title: `🔥 Heating ${material}...` });
    };
    
    const handleTeacherComplete = () => {
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null);
            transition();
        }
    };

    const handleViewResults = () => {
        setTeacherMessage("Excellent work! You've seen how different materials expand differently when heated. Now let's test your knowledge!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
        });
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
            setTeacherMessage(`Outstanding! Perfect score! You've completely mastered thermal expansion! 🎉 You understand that alcohol expands the most because it has the weakest intermolecular forces. When heated, alcohol molecules gain kinetic energy and push apart more easily than water or metal atoms. In liquids, molecules can move more freely than in solids, so they expand more. The coefficient of thermal expansion quantifies this - alcohol has a higher coefficient than water, and water higher than steel! This is why thermometers use mercury or alcohol - they expand significantly with small temperature changes. You also know that real-world structures like bridges and railway tracks need expansion joints to prevent buckling when heated by the sun. Fantastic understanding of heat, molecular motion, and material properties! +${earnedXP} XP earned!`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Think about which material expanded the most and why!`);
            setTeacherMessage(`Good effort! You got 2 out of 3 correct. Let me clarify the key concepts: Remember that alcohol expanded the MOST because its molecules have weak intermolecular forces - they easily push apart when heated. Liquids generally expand MORE than solids because their molecules can move more freely. When we add heat, particles gain kinetic energy and vibrate faster, pushing neighbors away. Different materials have different expansion rates based on their molecular structure. Try the experiment again and watch carefully which material changes size the most!`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: different materials expand at different rates due to their molecular structure!`);
            setTeacherMessage(`Keep trying! You got ${correctCount} correct. Let me help you understand: When we heat materials, we add thermal energy, which increases molecular kinetic energy. Particles vibrate faster and push each other farther apart - that's expansion! The key points are: (1) Alcohol expanded the MOST - it has weak intermolecular forces, so molecules easily move apart. (2) Liquids expand MORE than solids because liquid molecules can slide past each other freely, while solid atoms are locked in place. (3) Heat gives particles kinetic energy - more heat means faster vibration and more expansion. Try the lab again and observe which container shows the biggest size change!`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setShowSupplies(true);
        setMetalRodCollected(false);
        setWaterCollected(false);
        setAlcoholCollected(false);
        setThermometerCollected(false);
        setSuppliesReady(false);
        setMetalExpanded(false);
        setWaterExpanded(false);
        setAlcoholExpanded(false);
        setHeatingMaterial(null);
        setTemperatures({ metal: 20, water: 20, alcohol: 20 });
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setPendingTransition(null);
        setTeacherMessage("Welcome back! Ready to explore thermal expansion again? Let's heat some materials!");
    };

    return (
        <div className="space-y-6 pb-20">
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
                emotion={currentStep === 'complete' ? 'celebrating' : currentStep === 'results' ? 'happy' : 'explaining'}
                context={{
                    attempts: temperatures.metal + temperatures.water + temperatures.alcohol - 60,
                    correctStreak: metalExpanded && waterExpanded && alcoholExpanded ? 100 : 0
                }}
                quickActions={[
                    { label: 'Reset Lab', onClick: handleRestart },
                    { label: 'View Theory', onClick: () => document.querySelector('[value="theory"]')?.parentElement?.click() },
                    { label: 'Safety Tips', onClick: () => document.querySelector('[value="safety"]')?.parentElement?.click() }
                ]}
            />

            {isCompleted && (
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

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Thermometer className="h-5 w-5 text-red-600" />
                        Thermal Expansion
                    </CardTitle>
                    <CardDescription>Observe how materials expand when heated</CardDescription>
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
                                <CardTitle>Welcome to the Thermal Expansion Lab!</CardTitle>
                                <CardDescription>Discover how heat changes material size</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-6 rounded-lg border-2 border-red-200 dark:border-red-800">
                                    <div className="flex items-start gap-4">
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
                                    {/* Metal Rod */}
                                    {!metalRodCollected && (
                                        <motion.div
                                            onClick={handleCollectMetalRod}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-gray-400 dark:border-gray-600 hover:border-gray-600 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-4 h-32 bg-gradient-to-r from-gray-400 to-gray-600 rounded-sm" />
                                                <span className="text-sm font-medium">Metal Rod</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Water */}
                                    {metalRodCollected && !waterCollected && (
                                        <motion.div
                                            onClick={handleCollectWater}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-16 h-24 border-2 border-blue-400 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                                                    <div className="w-full h-3/4 bg-blue-400/60 rounded-b-lg" />
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
                                                <div className="w-16 h-24 border-2 border-purple-400 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                                                    <div className="w-full h-3/4 bg-purple-400/60 rounded-b-lg" />
                                                </div>
                                                <span className="text-sm font-medium">Alcohol</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Thermometer */}
                                    {alcoholCollected && !thermometerCollected && (
                                        <motion.div
                                            onClick={handleCollectThermometer}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-red-300 dark:border-red-700 hover:border-red-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-3 h-20 bg-gradient-to-b from-white to-red-500 rounded-t-full border border-gray-400" />
                                                    <div className="w-6 h-4 bg-red-500 rounded-full border border-gray-400" />
                                                </div>
                                                <span className="text-sm font-medium">Thermometer</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Collected Items Display */}
                                    <div className="w-full mt-4 flex gap-4 justify-center flex-wrap">
                                        {metalRodCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-gray-600" />
                                                <span className="text-sm">Metal Rod</span>
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
                                        {thermometerCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-red-100 dark:bg-red-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-red-600" />
                                                <span className="text-sm">Thermometer</span>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {(currentStep === 'setup' || currentStep === 'heat-metal' || currentStep === 'heat-water' || currentStep === 'heat-alcohol') && (
                    <motion.div
                        key="experiment"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-red-200 dark:border-red-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Flame className="h-5 w-5 text-red-600" />
                                    Interactive Experiment
                                </CardTitle>
                                <CardDescription>Click to heat each material</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Setup Stage */}
                                {currentStep === 'setup' && !suppliesReady && (
                                    <div className="text-center space-y-4">
                                        <p className="text-lg font-medium">Click on the containers to fill them with materials</p>
                                        <Button onClick={handleSetupComplete} size="lg">
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
                                                    "flex flex-col items-center gap-2",
                                                    currentStep === 'heat-metal' && suppliesReady && !heatingMaterial && "cursor-pointer"
                                                )}
                                            >
                                                <span className="text-xs md:text-sm font-medium">Metal Rod</span>
                                                <div className="relative h-40 md:h-48 flex items-end">
                                                    <motion.div
                                                        animate={{ scaleX: metalExpanded ? 1.08 : 1 }}
                                                        transition={{ duration: 0.5 }}
                                                        className="w-4 md:w-6 h-32 md:h-40 bg-gradient-to-r from-gray-400 to-gray-600 rounded-sm origin-left"
                                                    />
                                                </div>
                                                {suppliesReady && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {temperatures.metal}°C
                                                    </div>
                                                )}
                                                {currentStep === 'heat-metal' && suppliesReady && !heatingMaterial && (
                                                    <p className="text-xs md:text-sm font-medium bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded">
                                                        Click to Heat
                                                    </p>
                                                )}
                                                {heatingMaterial === 'metal' && (
                                                    <Flame className="h-6 w-6 text-red-500 animate-pulse" />
                                                )}
                                            </motion.div>
                                            
                                            {/* Water Container */}
                                            <motion.div
                                                onClick={currentStep === 'heat-water' && suppliesReady ? () => handleHeatMaterial('water') : undefined}
                                                whileHover={currentStep === 'heat-water' && suppliesReady && !heatingMaterial ? { scale: 1.05 } : {}}
                                                className={cn(
                                                    "flex flex-col items-center gap-2",
                                                    currentStep === 'heat-water' && suppliesReady && !heatingMaterial && "cursor-pointer"
                                                )}
                                            >
                                                <span className="text-xs md:text-sm font-medium">Water</span>
                                                <div className="relative w-14 md:w-20 h-40 md:h-48 border-2 border-blue-400 rounded-lg bg-blue-50/30 dark:bg-blue-900/20 overflow-hidden">
                                                    {suppliesReady && (
                                                        <motion.div
                                                            className="absolute bottom-0 w-full bg-blue-400/70 dark:bg-blue-500/70"
                                                            animate={{ height: waterExpanded ? '75%' : '50%' }}
                                                            transition={{ duration: 0.8 }}
                                                        />
                                                    )}
                                                </div>
                                                {suppliesReady && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {temperatures.water}°C
                                                    </div>
                                                )}
                                                {currentStep === 'heat-water' && suppliesReady && !heatingMaterial && (
                                                    <p className="text-xs md:text-sm font-medium bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                                                        Click to Heat
                                                    </p>
                                                )}
                                                {heatingMaterial === 'water' && (
                                                    <Flame className="h-6 w-6 text-red-500 animate-pulse" />
                                                )}
                                            </motion.div>
                                            
                                            {/* Alcohol Container */}
                                            <motion.div
                                                onClick={currentStep === 'heat-alcohol' && suppliesReady ? () => handleHeatMaterial('alcohol') : undefined}
                                                whileHover={currentStep === 'heat-alcohol' && suppliesReady && !heatingMaterial ? { scale: 1.05 } : {}}
                                                className={cn(
                                                    "flex flex-col items-center gap-2",
                                                    currentStep === 'heat-alcohol' && suppliesReady && !heatingMaterial && "cursor-pointer"
                                                )}
                                            >
                                                <span className="text-xs md:text-sm font-medium">Alcohol</span>
                                                <div className="relative w-14 md:w-20 h-40 md:h-48 border-2 border-purple-400 rounded-lg bg-purple-50/30 dark:bg-purple-900/20 overflow-hidden">
                                                    {suppliesReady && (
                                                        <motion.div
                                                            className="absolute bottom-0 w-full bg-purple-400/70 dark:bg-purple-500/70"
                                                            animate={{ height: alcoholExpanded ? '85%' : '50%' }}
                                                            transition={{ duration: 0.8 }}
                                                        />
                                                    )}
                                                </div>
                                                {suppliesReady && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {temperatures.alcohol}°C
                                                    </div>
                                                )}
                                                {currentStep === 'heat-alcohol' && suppliesReady && !heatingMaterial && (
                                                    <p className="text-xs md:text-sm font-medium bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">
                                                        Click to Heat
                                                    </p>
                                                )}
                                                {heatingMaterial === 'alcohol' && (
                                                    <Flame className="h-6 w-6 text-red-500 animate-pulse" />
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
                        <Card className="border-2 border-red-200 dark:border-red-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-red-600" />
                                    Experiment Results
                                </CardTitle>
                                <CardDescription>Analysis of thermal expansion</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-6 rounded-lg border-2 border-red-200 dark:border-red-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Observations:</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Metal Rod expanded SLIGHTLY:</strong> Solids have tight atomic structure, so expansion is minimal (~5%)
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Water expanded MORE:</strong> Liquids have looser structure, allowing greater expansion (~25%)
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Alcohol expanded MOST:</strong> Weak intermolecular forces allow maximum expansion (~35%)
                                            </div>
                                        </li>
                                    </ul>
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
                                <CardDescription>Answer these questions about thermal expansion</CardDescription>
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
                        <Card className="border-2 border-red-200 dark:border-red-800">
                            <CardHeader className="text-center">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="flex justify-center mb-4"
                                >
                                    <Trophy className="h-16 w-16 text-yellow-500" />
                                </motion.div>
                                <CardTitle>Lab Complete!</CardTitle>
                                <CardDescription>You've mastered thermal expansion</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
