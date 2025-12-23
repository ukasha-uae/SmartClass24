'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Flame, BookOpen, Shield, Sparkles, Trophy, Award, GripVertical, Thermometer, Wind, Zap } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';

type Step = 'intro' | 'collect-supplies' | 'conduction' | 'convection' | 'radiation' | 'results' | 'quiz' | 'complete';

export function HeatTransferLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Supplies tracking
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [metalRodCollected, setMetalRodCollected] = React.useState(false);
    const [beakerCollected, setBeakerCollected] = React.useState(false);
    const [infraredSourceCollected, setInfraredSourceCollected] = React.useState(false);
    const [thermometerCollected, setThermometerCollected] = React.useState(false);
    
    // Experiment state
    const [suppliesReady, setSuppliesReady] = React.useState(false);
    const [conductionTested, setConductionTested] = React.useState(false);
    const [conductionHeating, setConductionHeating] = React.useState(false);
    const [conductionTemp, setConductionTemp] = React.useState(20);
    const [convectionTested, setConvectionTested] = React.useState(false);
    const [convectionHeating, setConvectionHeating] = React.useState(false);
    const [radiationTested, setRadiationTested] = React.useState(false);
    const [radiationHeating, setRadiationHeating] = React.useState(false);
    
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
    const labId = 'heat-transfer';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    // Draggable teacher position
    const [teacherPosition, setTeacherPosition] = React.useState({ x: 0, y: 0 });

    // Intro message
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Heat Transfer Lab! Heat travels from hot objects to cold ones in three ways: Conduction (direct contact), Convection (through fluids), and Radiation (through space). We'll demonstrate all three! Let's start by gathering our supplies.");
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setTeacherMessage("Great! Let's gather our supplies. Start by clicking on the METAL ROD - we'll use it to demonstrate conduction!");
        setPendingTransition(() => () => {
            setCurrentStep('collect-supplies');
        });
    };
    
    const handleCollectMetalRod = () => {
        if (!metalRodCollected) {
            setMetalRodCollected(true);
            setTeacherMessage("Perfect! Now click on the BEAKER with water - we'll use it to show convection!");
            toast({ title: '✅ Metal Rod Collected' });
        }
    };
    
    const handleCollectBeaker = () => {
        if (metalRodCollected && !beakerCollected) {
            setBeakerCollected(true);
            setTeacherMessage("Good! Now click on the INFRARED HEAT SOURCE - this shows radiation!");
            toast({ title: '✅ Beaker Collected' });
        }
    };
    
    const handleCollectInfrared = () => {
        if (beakerCollected && !infraredSourceCollected) {
            setInfraredSourceCollected(true);
            setTeacherMessage("Excellent! Finally, click on the THERMOMETER - we need this to measure temperature changes!");
            toast({ title: '✅ Infrared Source Collected' });
        }
    };
    
    const handleCollectThermometer = () => {
        if (infraredSourceCollected && !thermometerCollected) {
            setThermometerCollected(true);
            setShowSupplies(false);
            setSuppliesReady(true);
            setTeacherMessage("All supplies ready! Now we'll test each method of heat transfer. Let's start with conduction!");
            toast({ title: '✅ All Supplies Collected!' });
            setPendingTransition(() => () => {
                setCurrentStep('conduction');
            });
        }
    };
    
    const handleTestConduction = () => {
        if (conductionTested || conductionHeating) return;
        
        setConductionHeating(true);
        setTeacherMessage("Testing conduction! Heat is traveling through the metal rod from the hot end to the cold end by direct contact. Watch the temperature rise!");
        
        let currentTemp = conductionTemp;
        const interval = setInterval(() => {
            currentTemp += 5;
            setConductionTemp(currentTemp);
            
            if (currentTemp >= 80) {
                clearInterval(interval);
                setConductionHeating(false);
                setConductionTested(true);
                setTeacherMessage("Excellent! The metal rod conducted heat efficiently from one end to the other through direct contact of particles!");
                toast({ title: '✅ Conduction Demonstrated!' });
                
                setTimeout(() => {
                    setTeacherMessage("Now let's test convection with the water beaker!");
                    setPendingTransition(() => () => {
                        setCurrentStep('convection');
                    });
                }, 1500);
            }
        }, 200);
    };
    
    const handleTestConvection = () => {
        if (convectionTested || convectionHeating) return;
        
        setConvectionHeating(true);
        setTeacherMessage("Testing convection! Heat is warming the water at the bottom. Watch as hot, less dense water rises and cool water sinks, creating a circular current!");
        
        setTimeout(() => {
            setConvectionHeating(false);
            setConvectionTested(true);
            setTeacherMessage("Perfect! Convection happens in liquids and gases when heated fluid rises and cooler fluid sinks!");
            toast({ title: '✅ Convection Demonstrated!' });
            
            setTimeout(() => {
                setTeacherMessage("Now let's test radiation through empty space!");
                setPendingTransition(() => () => {
                    setCurrentStep('radiation');
                });
            }, 1500);
        }, 2000);
    };
    
    const handleTestRadiation = () => {
        if (radiationTested || radiationHeating) return;
        
        setRadiationHeating(true);
        setTeacherMessage("Testing radiation! Heat is traveling through empty space as infrared radiation waves. It can reach through air without heating it directly!");
        
        setTimeout(() => {
            setRadiationHeating(false);
            setRadiationTested(true);
            setTeacherMessage("Excellent! Radiation is how the sun warms Earth across the vacuum of space!");
            toast({ title: '✅ Radiation Demonstrated!' });
            
            setTimeout(() => {
                setTeacherMessage("You've demonstrated all three heat transfer methods! Now let's test your knowledge with the quiz!");
                setPendingTransition(() => () => {
                    setCurrentStep('results');
                });
            }, 1500);
        }, 2000);
    };
    
    const handleTeacherComplete = () => {
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null);
            transition();
        }
    };

    const handleViewResults = () => {
        setTeacherMessage("You've successfully demonstrated conduction, convection, and radiation! These three mechanisms work together to transfer heat throughout our world. Now test your understanding!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
        });
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        if (selectedAnswer1 === 'radiation') correctCount++;
        if (selectedAnswer2 === 'particles') correctCount++;
        if (selectedAnswer3 === 'less-dense') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand heat transfer! +${earnedXP} XP`);
            setTeacherMessage(`Outstanding! Perfect score! 🎉 You've completely mastered all three heat transfer methods! Let me summarize: (1) CONDUCTION - heat travels through direct contact. The hot metal rod transfers energy to adjacent particles. Solids conduct best because particles are tightly packed. Metals are excellent conductors due to free electrons. (2) CONVECTION - heat travels through fluid (liquid/gas) movement. When water is heated, hot water becomes less dense and rises, cooler water sinks and replaces it, creating a circulation pattern called a convection current. This only works in fluids where particles can move freely. (3) RADIATION - heat travels through electromagnetic waves (infrared). No medium needed! The Sun heats Earth through radiation across empty space. All objects above absolute zero emit thermal radiation. You understand that conduction needs particles touching, convection needs particle movement, and radiation needs nothing - just waves! Real applications: cooking (all three), heating systems, insulation, space travel. Perfect understanding! +${earnedXP} XP earned!`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Think about how heat travels!`);
            setTeacherMessage(`Good effort! You got 2 out of 3 correct. Let me clarify the key concepts: RADIATION is how the Sun transfers heat to Earth - through electromagnetic waves (infrared light) that travel through empty space. No particles needed! CONDUCTION uses direct contact between particles - energy transfers from hot to cold through collisions. CONVECTION uses fluid movement - hot fluid rises (less dense), cold fluid sinks (more dense), creating currents. Remember: conduction = contact, convection = circulation, radiation = waves. Review the lab and watch each method carefully!`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: conduction needs contact, convection needs movement, radiation travels through space!`);
            setTeacherMessage(`Keep trying! You got ${correctCount} correct. Let me help you understand the three methods: (1) The Sun heats Earth through RADIATION - electromagnetic waves (infrared) that travel through the vacuum of space. No medium needed! (2) The metal rod transfers heat through CONDUCTION - direct contact between PARTICLES. Heat flows from hot end to cold end as particles collide and transfer kinetic energy. (3) Hot water rises because it's LESS DENSE than cold water. This creates CONVECTION currents - circular flow patterns in fluids. Watch each experiment again and observe how heat travels differently in each case!`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setShowSupplies(true);
        setMetalRodCollected(false);
        setBeakerCollected(false);
        setInfraredSourceCollected(false);
        setThermometerCollected(false);
        setSuppliesReady(false);
        setConductionTested(false);
        setConductionHeating(false);
        setConductionTemp(20);
        setConvectionTested(false);
        setConvectionHeating(false);
        setRadiationTested(false);
        setRadiationHeating(false);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setPendingTransition(null);
        setTeacherMessage("Welcome back! Ready to explore heat transfer again? Let's gather our supplies!");
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Teacher Voice */}
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
                emotion={currentStep === 'complete' ? 'celebrating' : currentStep === 'conduction' || currentStep === 'convection' || currentStep === 'radiation' ? 'explaining' : 'happy'}
                context={{
                    attempts: (conductionTested ? 1 : 0) + (convectionTested ? 1 : 0) + (radiationTested ? 1 : 0),
                    correctStreak: conductionTested && convectionTested && radiationTested ? 100 : 0
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
                    className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full">
                            <Trophy className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-orange-900 dark:text-orange-100">Lab Completed!</h3>
                            <p className="text-sm text-orange-700 dark:text-orange-300">
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
                            <CardDescription>You've completed the Heat Transfer Lab!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-orange-600">
                                <Award className="h-8 w-8" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You've mastered heat transfer!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-600" />
                        Heat Transfer
                    </CardTitle>
                    <CardDescription>Explore conduction, convection, and radiation</CardDescription>
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
                                <p><strong>Heat Transfer</strong> is the movement of thermal energy from a hotter object to a colder one. There are three main mechanisms:</p>
                                <p><strong>1. Conduction:</strong> Heat transfer through direct contact. Common in solids where vibrating particles pass energy to neighboring particles. Example: heating a metal rod.</p>
                                <p><strong>2. Convection:</strong> Heat transfer through movement of fluids (liquids or gases). Heated fluid becomes less dense and rises, while cooler denser fluid sinks, creating circular currents. Example: heating water in a beaker.</p>
                                <p><strong>3. Radiation:</strong> Heat transfer through electromagnetic waves, no medium needed. Can travel through vacuum. Example: sunlight heating Earth.</p>
                                <p><strong>Real-world applications:</strong></p>
                                <ul>
                                    <li>Conduction: Heat sinks in computers, cooking with metal pans</li>
                                    <li>Convection: Heating systems, ocean currents, weather patterns</li>
                                    <li>Radiation: Solar energy, infrared thermometers, microwave ovens</li>
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
                                    <li>Always wear safety goggles when working with heat sources</li>
                                    <li>Never touch heated materials directly - use tongs or heat-resistant gloves</li>
                                    <li>Keep flammable materials away from heat sources</li>
                                    <li>Allow equipment to cool before handling</li>
                                    <li>Be aware of steam from boiling water - it can cause burns</li>
                                    <li>Work in a well-ventilated area</li>
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
                                <CardTitle>Welcome to the Heat Transfer Lab!</CardTitle>
                                <CardDescription>Discover how heat travels through conduction, convection, and radiation</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-6 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                                    <div className="flex items-start gap-4">
                                        <Flame className="w-16 h-16 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-orange-900 dark:text-orange-100">What We'll Discover:</h3>
                                            <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
                                                <li>• Conduction: Heat transfer through direct contact</li>
                                                <li>• Convection: Heat transfer through fluid movement</li>
                                                <li>• Radiation: Heat transfer through electromagnetic waves</li>
                                                <li>• Real-world applications of each method</li>
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
                                                <div className="w-4 h-24 bg-gradient-to-r from-gray-400 to-gray-600 rounded-sm" />
                                                <span className="text-sm font-medium">Metal Rod</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Beaker */}
                                    {metalRodCollected && !beakerCollected && (
                                        <motion.div
                                            onClick={handleCollectBeaker}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-16 h-24 border-2 border-blue-400 rounded-lg bg-blue-100/50 dark:bg-blue-900/50">
                                                    <div className="w-full h-1/2 bg-blue-400/60 rounded-b-lg mt-2" />
                                                </div>
                                                <span className="text-sm font-medium">Beaker</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Infrared Source */}
                                    {beakerCollected && !infraredSourceCollected && (
                                        <motion.div
                                            onClick={handleCollectInfrared}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-red-300 dark:border-red-700 hover:border-red-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Zap className="h-12 w-12 text-red-500" />
                                                <span className="text-sm font-medium">Heat Source</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Thermometer */}
                                    {infraredSourceCollected && !thermometerCollected && (
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
                                        {beakerCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm">Beaker</span>
                                            </motion.div>
                                        )}
                                        {infraredSourceCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-red-100 dark:bg-red-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-red-600" />
                                                <span className="text-sm">Heat Source</span>
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

                {currentStep === 'conduction' && (
                    <motion.div
                        key="conduction"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-orange-200 dark:border-orange-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Thermometer className="h-5 w-5 text-gray-600" />
                                    Stage 1: Conduction
                                </CardTitle>
                                <CardDescription>Heat transfer through direct contact in solids</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex justify-center items-center">
                                    <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 p-8 min-h-[300px] md:min-h-[400px] flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="flex items-center gap-6">
                                                <div className="text-center">
                                                    <p className="text-xs md:text-sm font-medium mb-2">Cold End</p>
                                                    <div className="w-6 md:w-8 h-16 md:h-24 bg-blue-300 rounded-sm" />
                                                </div>
                                                
                                                <div className="flex-1 flex flex-col gap-2">
                                                    {Array.from({ length: 8 }).map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            animate={conductionHeating ? { 
                                                                backgroundColor: ['#9CA3AF', '#EF4444']
                                                            } : {}}
                                                            transition={{ duration: 0.5, delay: i * 0.1 }}
                                                            className="h-2 bg-gray-400 rounded-full"
                                                        />
                                                    ))}
                                                </div>
                                                
                                                <div className="text-center">
                                                    <p className="text-xs md:text-sm font-medium mb-2">Hot End</p>
                                                    {conductionHeating && <Flame className="h-6 md:h-8 w-6 md:w-8 mx-auto text-orange-500 animate-pulse" />}
                                                </div>
                                            </div>
                                            
                                            <div className="text-center">
                                                <p className="text-lg md:text-2xl font-bold text-gray-700 dark:text-gray-300">
                                                    {conductionTemp}°C
                                                </p>
                                                <p className="text-xs md:text-sm text-muted-foreground">Cold End Temperature</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button onClick={handleTestConduction} disabled={conductionTested || conductionHeating} size="lg" className="w-full">
                                    {conductionHeating ? 'Testing...' : conductionTested ? '✅ Conduction Complete' : 'Test Conduction'}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'convection' && (
                    <motion.div
                        key="convection"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-orange-200 dark:border-orange-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Wind className="h-5 w-5 text-blue-600" />
                                    Stage 2: Convection
                                </CardTitle>
                                <CardDescription>Heat transfer through fluid movement</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex justify-center items-center">
                                    <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 p-8 min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="w-24 md:w-32 h-40 md:h-48 border-2 border-blue-400 rounded-lg bg-gradient-to-b from-blue-100/50 to-blue-200/50 dark:from-blue-900/50 dark:to-blue-800/50 relative overflow-hidden">
                                                {/* Water visualization */}
                                                <div className="absolute inset-0 bg-blue-400/20 dark:bg-blue-500/20" />
                                                
                                                {/* Convection current animation */}
                                                {convectionHeating && (
                                                    <>
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <motion.div
                                                                key={i}
                                                                animate={{
                                                                    y: [-60, 60],
                                                                    x: [0, 10, 0]
                                                                }}
                                                                transition={{
                                                                    duration: 2,
                                                                    delay: i * 0.3,
                                                                    repeat: Infinity
                                                                }}
                                                                className="absolute w-2 h-2 bg-red-400 rounded-full"
                                                                style={{ left: `${20 + i * 15}%` }}
                                                            />
                                                        ))}
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <motion.div
                                                                key={`cool-${i}`}
                                                                animate={{
                                                                    y: [60, -60],
                                                                    x: [0, -10, 0]
                                                                }}
                                                                transition={{
                                                                    duration: 2,
                                                                    delay: i * 0.3 + 1,
                                                                    repeat: Infinity
                                                                }}
                                                                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                                                                style={{ right: `${20 + i * 15}%` }}
                                                            />
                                                        ))}
                                                    </>
                                                )}
                                                
                                                <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-semibold text-red-600">
                                                    {convectionHeating ? '🔥' : ''}
                                                </p>
                                            </div>
                                            
                                            <p className="text-sm text-center text-muted-foreground">
                                                {convectionHeating ? 'Hot water rises, cool water sinks' : 'Click to start heating'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Button onClick={handleTestConvection} disabled={convectionTested || convectionHeating} size="lg" className="w-full">
                                    {convectionHeating ? 'Testing...' : convectionTested ? '✅ Convection Complete' : 'Test Convection'}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'radiation' && (
                    <motion.div
                        key="radiation"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-orange-200 dark:border-orange-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-yellow-600" />
                                    Stage 3: Radiation
                                </CardTitle>
                                <CardDescription>Heat transfer through electromagnetic waves</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex justify-center items-center">
                                    <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 p-8 min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="flex items-center justify-around w-full">
                                                <div className="flex flex-col items-center">
                                                    <Flame className="h-12 md:h-16 w-12 md:w-16 text-orange-500 mb-2" />
                                                    <p className="text-xs md:text-sm font-medium">Heat Source</p>
                                                </div>
                                                
                                                <div className="flex-1 relative h-16 md:h-24 flex items-center justify-center">
                                                    {radiationHeating && (
                                                        <>
                                                            {Array.from({ length: 6 }).map((_, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    animate={{
                                                                        opacity: [0.8, 0],
                                                                        scale: [0, 1]
                                                                    }}
                                                                    transition={{
                                                                        duration: 1.5,
                                                                        delay: i * 0.2,
                                                                        repeat: Infinity
                                                                    }}
                                                                    className="absolute w-8 h-8 md:w-12 md:h-12 border-2 border-yellow-400 rounded-full"
                                                                />
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                                
                                                <div className="flex flex-col items-center">
                                                    <motion.div
                                                        animate={radiationHeating ? { 
                                                            color: ['#6B7280', '#EF4444']
                                                        } : {}}
                                                        transition={{ duration: 1 }}
                                                        className="text-3xl md:text-5xl font-bold mb-2"
                                                    >
                                                        🖐️
                                                    </motion.div>
                                                    <p className="text-xs md:text-sm font-medium">Hand/Detector</p>
                                                </div>
                                            </div>
                                            
                                            <p className="text-sm text-center text-muted-foreground">
                                                {radiationHeating ? 'Heat reaches across empty space!' : 'No physical contact needed'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Button onClick={handleTestRadiation} disabled={radiationTested || radiationHeating} size="lg" className="w-full">
                                    {radiationHeating ? 'Testing...' : radiationTested ? '✅ Radiation Complete' : 'Test Radiation'}
                                </Button>
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
                        <Card className="border-2 border-orange-200 dark:border-orange-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                    Experiment Results
                                </CardTitle>
                                <CardDescription>Summary of heat transfer mechanisms</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-6 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Observations:</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Conduction:</strong> Heat traveled through the metal rod by particle vibrations, passing energy from one end to the other through direct contact
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Convection:</strong> Hot water rose and cool water sank, creating circulation currents that distribute heat throughout the liquid
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Radiation:</strong> Heat traveled through empty space as electromagnetic waves, requiring no medium between the source and detector
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                                    <h3 className="font-semibold mb-2">Real-World Applications:</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Conduction heats cooking pans, convection drives weather patterns and heating systems, and radiation brings sunlight to Earth. 
                                        Understanding these three mechanisms helps us design better heating systems, insulation, and even predict climate patterns.
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
                                <CardDescription>Answer these questions about heat transfer</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. Which method of heat transfer works through empty space?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'conduction', label: 'Conduction' },
                                            { value: 'convection', label: 'Convection' },
                                            { value: 'radiation', label: 'Radiation', isCorrect: true }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setSelectedAnswer1(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    selectedAnswer1 === option.value && !quizSubmitted && "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
                                                    selectedAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    selectedAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    selectedAnswer1 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        selectedAnswer1 === option.value && !quizSubmitted && "border-orange-500 bg-orange-500",
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
                                    <p className="font-medium">2. Why is metal a good conductor of heat?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'color', label: 'Because it is shiny' },
                                            { value: 'particles', label: 'Because its particles are closely packed and vibrate easily', isCorrect: true },
                                            { value: 'weight', label: 'Because it is heavy' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setSelectedAnswer2(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    selectedAnswer2 === option.value && !quizSubmitted && "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
                                                    selectedAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    selectedAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    selectedAnswer2 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        selectedAnswer2 === option.value && !quizSubmitted && "border-orange-500 bg-orange-500",
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
                                    <p className="font-medium">3. In convection, why does heated fluid rise?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'more-dense', label: 'It becomes more dense' },
                                            { value: 'less-dense', label: 'It becomes less dense', isCorrect: true },
                                            { value: 'color', label: 'It changes color' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setSelectedAnswer3(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    selectedAnswer3 === option.value && !quizSubmitted && "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
                                                    selectedAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    selectedAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    selectedAnswer3 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        selectedAnswer3 === option.value && !quizSubmitted && "border-orange-500 bg-orange-500",
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
                                            quizFeedback.includes('Good') ? "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-100" :
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
                        <Card className="border-2 border-orange-200 dark:border-orange-800">
                            <CardHeader className="text-center">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="flex justify-center mb-4"
                                >
                                    <Trophy className="h-16 w-16 text-yellow-500" />
                                </motion.div>
                                <CardTitle>Lab Complete!</CardTitle>
                                <CardDescription>You've mastered heat transfer</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-6 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <span>Conduction: Heat transfer through direct contact in solids</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <span>Convection: Heat transfer through fluid movement</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <span>Radiation: Heat transfer through electromagnetic waves</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <span>Real-world applications in heating, cooking, and climate</span>
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
