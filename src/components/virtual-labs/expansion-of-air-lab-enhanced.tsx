'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Flame, Droplets, BookOpen, Shield, Sparkles, Trophy, Award, GripVertical, Wind } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';

type Step = 'intro' | 'collect-supplies' | 'setup' | 'add-water' | 'attach-balloon' | 'heat-air' | 'results' | 'quiz' | 'complete';

export function ExpansionOfAirLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Supplies tracking
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [bottleCollected, setBottleCollected] = React.useState(false);
    const [waterCollected, setWaterCollected] = React.useState(false);
    const [balloonCollected, setBalloonCollected] = React.useState(false);
    const [thermometerCollected, setThermometerCollected] = React.useState(false);
    
    // Experiment state
    const [suppliesReady, setSuppliesReady] = React.useState(false);
    const [balloonInflating, setBalloonInflating] = React.useState(false);
    const [balloonInflated, setBalloonInflated] = React.useState(false);
    const [heatingActive, setHeatingActive] = React.useState(false);
    const [temperature, setTemperature] = React.useState(20);
    const [balloonSize, setBalloonSize] = React.useState(0); // 0-100
    
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
    const labId = 'expansion-of-air';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    // Draggable teacher position
    const [teacherPosition, setTeacherPosition] = React.useState({ x: 0, y: 0 });

    // Intro message
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Expansion of Air Lab! Today we'll discover how gases expand when heated. We'll use a balloon attached to a bottle filled with air. When we heat the air inside, it will gain energy and expand, inflating the balloon. Ready to explore gas behavior?");
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setTeacherMessage("Great! Let's gather our supplies. Start by clicking on the BOTTLE - this is where our air will expand from!");
        setPendingTransition(() => () => {
            setCurrentStep('collect-supplies');
        });
    };
    
    const handleCollectBottle = () => {
        if (!bottleCollected) {
            setBottleCollected(true);
            setTeacherMessage("Perfect! You collected the bottle. This sealed container holds air at room temperature. Inside are billions of gas molecules moving randomly and colliding with the walls. When we heat this air, those molecules will gain energy and push harder - causing expansion!");
            toast({ 
                title: '✅ Bottle Collected',
                description: 'Sealed container with air molecules inside'
            });
        }
    };
    
    const handleCollectWater = () => {
        if (bottleCollected && !waterCollected) {
            setWaterCollected(true);
            setTeacherMessage("Good! Hot water collected. We'll use this to heat the air inside the bottle. Heat transfers from hot water to the bottle, then to the air molecules inside. As molecules gain thermal energy, they move faster and need more space!");
            toast({ 
                title: '✅ Water Collected',
                description: 'Heat source to increase air temperature'
            });
        }
    };
    
    const handleCollectBalloon = () => {
        if (waterCollected && !balloonCollected) {
            setBalloonCollected(true);
            setTeacherMessage("Excellent! Balloon collected. This elastic balloon will be our expansion indicator. When attached to the bottle, the balloon will inflate as the air inside expands. The more the air expands, the bigger the balloon grows - it's a visual proof of gas expansion!");
            toast({ 
                title: '✅ Balloon Collected',
                description: 'Visual indicator for gas expansion'
            });
        }
    };
    
    const handleCollectThermometer = () => {
        if (balloonCollected && !thermometerCollected) {
            setThermometerCollected(true);
            setShowSupplies(false);
            setTeacherMessage("All supplies ready! The thermometer will measure how much we increase the temperature. Starting at 20°C (room temperature), we'll heat the air and observe the relationship between temperature and volume. Charles' Law states: V ∝ T. Let's test it!");
            toast({ 
                title: '✅ All Supplies Collected!',
                description: 'Ready to demonstrate Charles\' Law'
            });
            setPendingTransition(() => () => {
                setCurrentStep('setup');
            });
        }
    };
    
    const handleSetupComplete = () => {
        if (!suppliesReady) {
            setSuppliesReady(true);
            setTeacherMessage("Perfect! The balloon is now attached to the bottle opening - it forms an airtight seal. Air molecules inside can't escape, so when they expand, they'll push the balloon outward. Temperature starts at 20°C. Click the FLAME to start heating and watch the balloon inflate as the air expands!");
            toast({ 
                title: '✅ Setup Complete',
                description: 'Sealed system ready for heating'
            });
            setPendingTransition(() => () => {
                setCurrentStep('add-water');
            });
        }
    };
    
    const handleHeatAir = () => {
        if (heatingActive || balloonInflated) return;
        
        setHeatingActive(true);
        setBalloonInflating(true);
        setTeacherMessage("Applying heat! Watch carefully - as thermal energy transfers to air molecules, they gain kinetic energy and move faster. Faster molecules collide with more force and push apart, increasing the pressure inside. Since the balloon is elastic, the expanding air pushes it outward. Temperature and volume are rising together - that's Charles' Law in action!");
        toast({ 
            title: '🔥 Heating the air...',
            description: 'Molecules gaining kinetic energy and expanding'
        });
        
        // Heating simulation
        let currentTemp = temperature;
        let currentSize = 0;
        
        const heatInterval = setInterval(() => {
            currentTemp += 8;
            currentSize += 12;
            
            setTemperature(currentTemp);
            setBalloonSize(currentSize);
            
            if (currentTemp >= 80 || currentSize >= 95) {
                clearInterval(heatInterval);
                setHeatingActive(false);
                setBalloonInflated(true);
                setBalloonInflating(false);
                setTeacherMessage("Wow! The balloon is fully inflated! From 20°C to 80°C, the air volume increased dramatically! This perfectly demonstrates Charles's Law: V ∝ T (at constant pressure, volume is directly proportional to absolute temperature). We heated the air from 293K to 353K - about 20% increase in Kelvin temperature, so the volume increased by roughly 20% too! The expanding gas pushed the elastic balloon outward. In Kelvin: (V₁/T₁) = (V₂/T₂). Real-world examples: hot air balloons, tire pressure changes, and why spray cans warn against heat!");
                toast({ 
                    title: '✅ Experiment Complete!', 
                    description: 'Charles\' Law demonstrated - V ∝ T!' 
                });
                setPendingTransition(() => () => {
                    setCurrentStep('results');
                });
            }
        }, 300);
    };
    
    const handleTeacherComplete = () => {
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null);
            transition();
        }
    };

    const handleViewResults = () => {
        setTeacherMessage("You've observed gas expansion firsthand! The air particles moved faster and spread out when heated. Now let's test your understanding!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
        });
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        if (selectedAnswer1 === 'air') correctCount++;
        if (selectedAnswer2 === 'kinetic') correctCount++;
        if (selectedAnswer3 === 'charles') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand gas expansion! +${earnedXP} XP`);
            setTeacherMessage(`Outstanding! Perfect score! 🎉 You've completely mastered gas expansion and Charles' Law! You understand that when we heated the air inside the bottle, we increased the kinetic energy of air molecules. Faster-moving molecules collide with more force and push outward more strongly, causing the gas to expand. The balloon inflated because the expanding air needed more space! This demonstrates Charles' Law: at constant pressure, the volume of a gas is directly proportional to its temperature (V ∝ T). If we doubled the Kelvin temperature, the volume would double too! In real life, this is why hot air balloons rise (heated air expands, becomes less dense, and floats), why tires can burst in hot weather (air inside expands), and why we shouldn't heat sealed containers (expanding gas creates pressure). You've mastered temperature, kinetic energy, and gas behavior! +${earnedXP} XP earned!`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Think about gas behavior and Charles's Law!`);
            setTeacherMessage(`Good effort! You got 2 out of 3 correct. Let me clarify: When we heat air, we add thermal energy. This makes air molecules move faster - that's increased kinetic energy. Faster molecules push harder on the container walls, so the gas expands. The balloon inflated because the air needed more room. This is Charles' Law: V ∝ T (volume is proportional to temperature at constant pressure). Remember: heat → faster molecules → more force → expansion. Try the experiment again and watch how temperature affects the balloon size!`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: gases expand when heated and contract when cooled!`);
            setTeacherMessage(`Keep trying! You got ${correctCount} correct. Let me help you understand: Gases expand when heated because heat gives molecules kinetic energy. Key points: (1) The AIR inside the bottle expanded when heated - gas particles move faster and push apart. (2) Heat increases molecular KINETIC energy - particles vibrate and move faster. (3) This follows CHARLES' LAW - at constant pressure, gas volume increases with temperature (V ∝ T). Watch the balloon carefully - it inflates because expanding air needs more space. Try again and observe how heating affects the gas!`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setShowSupplies(true);
        setBottleCollected(false);
        setWaterCollected(false);
        setBalloonCollected(false);
        setThermometerCollected(false);
        setSuppliesReady(false);
        setBalloonInflating(false);
        setBalloonInflated(false);
        setHeatingActive(false);
        setTemperature(20);
        setBalloonSize(0);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setPendingTransition(null);
        setTeacherMessage("Welcome back! Ready to explore air expansion again? Let's heat some gas!");
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Teacher Voice */}
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
                emotion={currentStep === 'complete' ? 'celebrating' : currentStep === 'heat-air' ? 'explaining' : 'happy'}
                context={{
                    attempts: temperature - 20,
                    correctStreak: balloonInflated ? 100 : 0
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
                            <CardDescription>You've completed the Expansion of Air Lab!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-blue-600">
                                <Award className="h-8 w-8" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You've mastered gas expansion!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wind className="h-5 w-5 text-blue-600" />
                        Expansion of Air
                    </CardTitle>
                    <CardDescription>Observe how gases expand when heated</CardDescription>
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
                                <p><strong>Gas Expansion:</strong> Gases expand when heated and contract when cooled.</p>
                                <p><strong>Why?</strong> According to kinetic theory, gas particles move constantly. When heated, particles gain energy, move faster, and collide more forcefully, pushing outward and occupying more space.</p>
                                <p><strong>Charles's Law:</strong> For a gas at constant pressure, volume is directly proportional to absolute temperature: V/T = constant</p>
                                <p><strong>Real-world applications:</strong></p>
                                <ul>
                                    <li>Hot air balloons rise because heated air is less dense</li>
                                    <li>Weather balloons expand as they rise to cooler altitudes</li>
                                    <li>Gas thermometers measure temperature based on gas expansion</li>
                                    <li>Steam engines use gas expansion for power</li>
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
                                    <li>Always use safety goggles to protect your eyes</li>
                                    <li>Handle hot water with heat-resistant gloves</li>
                                    <li>Use tongs to place bottles in hot water</li>
                                    <li>Ensure bottles are not sealed - allow air to escape</li>
                                    <li>Never heat sealed containers - they may burst</li>
                                    <li>Wait for water to cool before touching</li>
                                    <li>Clean up spilled water immediately</li>
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
                                <CardTitle>Welcome to the Expansion of Air Lab!</CardTitle>
                                <CardDescription>Discover how gases expand when heated</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <div className="flex items-start gap-4">
                                        <Wind className="w-16 h-16 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">What We'll Discover:</h3>
                                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                                <li>• How heat affects gas particles</li>
                                                <li>• Why gases expand when heated</li>
                                                <li>• Understanding Charles's Law</li>
                                                <li>• Real-world applications of gas expansion</li>
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
                                    {/* Bottle */}
                                    {!bottleCollected && (
                                        <motion.div
                                            onClick={handleCollectBottle}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-16 h-24 border-2 border-blue-400 rounded-lg bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50" />
                                                <span className="text-sm font-medium">Bottle</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Water */}
                                    {bottleCollected && !waterCollected && (
                                        <motion.div
                                            onClick={handleCollectWater}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-cyan-300 dark:border-cyan-700 hover:border-cyan-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Droplets className="h-12 w-12 text-cyan-500" />
                                                <span className="text-sm font-medium">Hot Water</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Balloon */}
                                    {waterCollected && !balloonCollected && (
                                        <motion.div
                                            onClick={handleCollectBalloon}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-red-300 dark:border-red-700 hover:border-red-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-16 bg-red-400 rounded-full" />
                                                <span className="text-sm font-medium">Balloon</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Thermometer */}
                                    {balloonCollected && !thermometerCollected && (
                                        <motion.div
                                            onClick={handleCollectThermometer}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-orange-300 dark:border-orange-700 hover:border-orange-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-3 h-20 bg-gradient-to-b from-white to-orange-500 rounded-t-full border border-gray-400" />
                                                    <div className="w-6 h-4 bg-orange-500 rounded-full border border-gray-400" />
                                                </div>
                                                <span className="text-sm font-medium">Thermometer</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Collected Items Display */}
                                    <div className="w-full mt-4 flex gap-4 justify-center flex-wrap">
                                        {bottleCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm">Bottle</span>
                                            </motion.div>
                                        )}
                                        {waterCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-cyan-100 dark:bg-cyan-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-cyan-600" />
                                                <span className="text-sm">Hot Water</span>
                                            </motion.div>
                                        )}
                                        {balloonCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-red-100 dark:bg-red-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-red-600" />
                                                <span className="text-sm">Balloon</span>
                                            </motion.div>
                                        )}
                                        {thermometerCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900 px-4 py-2 rounded-full"
                                            >
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

                {(currentStep === 'setup' || currentStep === 'heat-air') && (
                    <motion.div
                        key="experiment"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-blue-200 dark:border-blue-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Flame className="h-5 w-5 text-orange-600" />
                                    Interactive Experiment
                                </CardTitle>
                                <CardDescription>Click to heat the air inside the bottle</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {currentStep === 'setup' && !suppliesReady && (
                                    <div className="text-center space-y-4">
                                        <p className="text-lg font-medium">Click to attach the balloon to the bottle</p>
                                        <Button onClick={handleSetupComplete} size="lg">
                                            Setup Complete
                                        </Button>
                                    </div>
                                )}
                                
                                {/* Experiment Area */}
                                <div className="flex justify-center items-center">
                                    <div className="relative min-h-[400px] md:min-h-[500px] w-full max-w-3xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 p-4 md:p-8 flex items-end justify-center">
                                        {/* Hot Water Container */}
                                        {suppliesReady && (
                                            <motion.div
                                                className="absolute bottom-20 md:bottom-32 left-4 md:left-8"
                                                animate={{ boxShadow: heatingActive ? '0 0 30px rgba(255, 127, 39, 0.5)' : '0 0 0px transparent' }}
                                            >
                                                <div className="w-20 md:w-32 h-24 md:h-32 border-2 border-red-400 rounded-lg bg-gradient-to-b from-orange-200/50 to-red-400/50 dark:from-orange-900/50 dark:to-red-900/50 flex items-center justify-center">
                                                    <p className="text-xs md:text-sm text-red-700 dark:text-red-300 font-medium text-center">
                                                        {temperature}°C
                                                    </p>
                                                </div>
                                                {heatingActive && (
                                                    <div className="flex gap-1 justify-center mt-2">
                                                        <Flame className="h-4 w-4 md:h-6 md:w-6 text-orange-500 animate-pulse" />
                                                        <Flame className="h-4 w-4 md:h-6 md:w-6 text-orange-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                        
                                        {/* Bottle with Balloon */}
                                        <motion.div
                                            className="flex flex-col items-center gap-4"
                                        >
                                            {/* Balloon */}
                                            <motion.div
                                                animate={{ 
                                                    scale: 0.5 + (balloonSize / 100) * 1.5,
                                                    opacity: suppliesReady ? 1 : 0.3
                                                }}
                                                transition={{ duration: 0.3 }}
                                                className="relative"
                                            >
                                                <div className="w-24 md:w-32 h-32 md:h-40 bg-red-400 dark:bg-red-600 rounded-full border-2 border-red-600 dark:border-red-800 flex items-center justify-center shadow-lg">
                                                    <span className="text-white text-xs md:text-sm font-medium">
                                                        {Math.round(balloonSize)}%
                                                    </span>
                                                </div>
                                            </motion.div>
                                            
                                            {/* Connection Point */}
                                            <div className="h-4 md:h-6 w-1 md:w-2 bg-gray-400 dark:bg-gray-600" />
                                            
                                            {/* Bottle */}
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 md:w-16 h-6 md:h-8 border-2 border-blue-400 bg-blue-100/50 dark:bg-blue-900/50 rounded-full" />
                                                <div className="w-16 md:w-24 h-28 md:h-36 border-2 border-blue-400 rounded-lg bg-gradient-to-b from-blue-100/50 to-blue-200/50 dark:from-blue-900/50 dark:to-blue-800/50 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <p className="text-xs md:text-sm font-medium text-blue-800 dark:text-blue-200">Air</p>
                                                        <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">Room Temp</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Heat Button */}
                                {suppliesReady && (
                                    <div className="flex justify-center">
                                        <Button 
                                            onClick={handleHeatAir}
                                            disabled={balloonInflated || heatingActive}
                                            size="lg"
                                            className="gap-2"
                                        >
                                            <Flame className="h-5 w-5" />
                                            {balloonInflated ? 'Fully Inflated' : heatingActive ? 'Heating...' : 'Heat the Air'}
                                        </Button>
                                    </div>
                                )}
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
                                <CardDescription>Analysis of air expansion</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Observations:</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Balloon inflated:</strong> The air expanded significantly when heated, proving that gases expand with temperature
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Particle movement:</strong> Heat gave air particles kinetic energy, causing them to move faster and spread apart
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Charles's Law demonstrated:</strong> Volume increased proportionally with temperature increase
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-cyan-50 dark:bg-cyan-950/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
                                    <h3 className="font-semibold mb-2">Scientific Explanation:</h3>
                                    <p className="text-sm text-muted-foreground">
                                        According to Charles's Law, the volume of a gas is directly proportional to its absolute temperature (in Kelvin) at constant pressure. 
                                        When we heated the air in the bottle, each air molecule gained kinetic energy and moved faster. With more energetic movement, molecules collided 
                                        with greater force, pushing the balloon outward. This demonstrates that gases are highly responsive to temperature changes compared to solids and liquids.
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
                                <CardDescription>Answer these questions about gas expansion</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. What caused the balloon to inflate in this experiment?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'water', label: 'Water entering the balloon' },
                                            { value: 'pressure', label: 'External air pressure' },
                                            { value: 'air', label: 'The air inside expanded when heated', isCorrect: true },
                                            { value: 'balloon', label: 'The balloon stretched' }
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
                                    <p className="font-medium">2. What happens to gas particles when heat is applied?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'slower', label: 'They slow down' },
                                            { value: 'kinetic', label: 'They gain kinetic energy and move faster', isCorrect: true },
                                            { value: 'contract', label: 'They contract' },
                                            { value: 'nothing', label: 'They don\'t change' }
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
                                    <p className="font-medium">3. What law describes the relationship between gas volume and temperature?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'boyle', label: "Boyle's Law (Pressure-Volume)" },
                                            { value: 'charles', label: "Charles's Law (Volume-Temperature)", isCorrect: true },
                                            { value: 'ideal', label: 'Ideal Gas Law' },
                                            { value: 'dalton', label: "Dalton's Law (Partial Pressure)" }
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
                                <CardDescription>You've mastered air expansion</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Heat causes gas particles to move faster and occupy more space</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Charles's Law relates gas volume directly to temperature</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Gases are highly responsive to temperature changes</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>This principle applies to hot air balloons and many technologies</span>
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
