'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Flame, BookOpen, Shield, Sparkles, Trophy, Award, GripVertical, Thermometer, Wind, Zap, RefreshCw } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { LabSupplies, SupplyItem } from './LabSupplies';

type Step = 'intro' | 'collect-supplies' | 'conduction' | 'convection' | 'radiation' | 'results' | 'quiz' | 'complete';

// Enhanced Flame Component - Premium Design
function EnhancedFlame({ isHeating }: { isHeating: boolean }) {
    if (!isHeating) return null;
    return (
        <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-20"
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
            {/* Outer flame */}
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
            {/* Middle flame */}
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
            {/* Inner core */}
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
        </motion.div>
    );
}

export function HeatTransferLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    
    // Supplies tracking
    const [collectedSupplies, setCollectedSupplies] = React.useState<string[]>([]);
    
    // Computed supply checks (for compatibility)
    const metalRodCollected = collectedSupplies.includes('metal-rod');
    const beakerCollected = collectedSupplies.includes('beaker');
    const heatSourceCollected = collectedSupplies.includes('heat-source');
    const thermometerCollected = collectedSupplies.includes('thermometer');
    
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

    // Supplies definition
    const supplies: SupplyItem[] = [
        { id: 'metal-rod', name: 'Metal Rod', emoji: '🔩', description: 'For conduction test' },
        { id: 'beaker', name: 'Beaker with Water', emoji: '🧪', description: 'For convection test' },
        { id: 'heat-source', name: 'Heat Source', emoji: '🔥', description: 'For radiation test' },
        { id: 'thermometer', name: 'Thermometer', emoji: '🌡️', description: 'Measure temperature' },
    ];

    // Intro message
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Heat Transfer Lab! Heat travels from hot objects to cold ones in three ways: Conduction (direct contact), Convection (through fluids), and Radiation (through space). We'll demonstrate all three! Let's start by gathering our supplies.");
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setTeacherMessage("Great! Let's gather our supplies. Click on each item to collect them for your experiment!");
        setCurrentStep('collect-supplies');
    };

    const handleCollectSupply = (itemId: string) => {
        if (!collectedSupplies.includes(itemId)) {
            setCollectedSupplies(prev => [...prev, itemId]);
            toast({ title: `✅ ${supplies.find(s => s.id === itemId)?.name} Collected` });
        }
    };

    const handleAllSuppliesCollected = () => {
        setSuppliesReady(true);
        setTeacherMessage("All supplies ready! Now we'll test each method of heat transfer. Let's start with conduction!");
        setCurrentStep('conduction');
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
                    setTeacherMessage("Excellent! Conduction is complete. Click 'Continue to Convection' when you're ready to test the next method!");
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
                setTeacherMessage("Perfect! Convection is complete. Click 'Continue to Radiation' when you're ready to test the final method!");
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
                setTeacherMessage("Excellent! Radiation is complete. You've demonstrated all three heat transfer methods! Click 'View Results' when you're ready!");
            }, 1500);
        }, 2000);
    };
    
    const handleContinueToConvection = () => {
        setTeacherMessage("Now let's test convection with the water beaker!");
        setCurrentStep('convection');
    };

    const handleContinueToRadiation = () => {
        setTeacherMessage("Now let's test radiation through empty space!");
        setCurrentStep('radiation');
    };

    const handleViewResults = () => {
        setTeacherMessage("You've successfully demonstrated conduction, convection, and radiation! These three mechanisms work together to transfer heat throughout our world. Let's analyze the results!");
        setCurrentStep('results');
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Now let's test your understanding! Answer the questions about heat transfer.");
        setCurrentStep('quiz');
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
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Think about how heat travels!`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: conduction needs contact, convection needs movement, radiation travels through space!`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setCollectedSupplies([]);
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
        setTeacherMessage("Welcome back! Ready to explore heat transfer again? Let's gather our supplies!");
    };

    return (
        <div className="relative min-h-screen pb-20">
            {/* Premium Animated Background - Physics Theme (Orange/Red) */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 dark:from-orange-950/30 dark:via-red-950/30 dark:to-amber-950/30" />
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-orange-200/40 via-red-200/40 to-amber-200/40 dark:from-orange-800/20 dark:via-red-800/20 dark:to-amber-800/20 blur-3xl"
                        style={{
                            width: `${200 + i * 50}px`,
                            height: `${200 + i * 50}px`,
                            left: `${(i * 12.5) % 100}%`,
                            top: `${(i * 15) % 100}%`,
                        }}
                        animate={{
                            x: [0, 50, -50, 0],
                            y: [0, 30, -30, 0],
                            scale: [1, 1.2, 0.8, 1],
                            opacity: [0.3, 0.5, 0.3],
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

            <div className="relative space-y-6">
            {/* Teacher Voice */}
            <TeacherVoice 
                message={teacherMessage}
                onComplete={() => {}}
                emotion={currentStep === 'complete' ? 'celebrating' : (currentStep === 'conduction' || currentStep === 'convection' || currentStep === 'radiation') ? 'explaining' : 'happy'}
                quickActions={[
                    { label: 'Reset Lab', icon: '🔄', onClick: handleRestart },
                    { label: 'View Theory', icon: '📖', onClick: () => {} },
                    { label: 'Safety Tips', icon: '🛡️', onClick: () => {} }
                ]}
            />

            {isCompleted && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4 backdrop-blur-sm shadow-lg"
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
                    <Card className="w-full max-w-md mx-4 border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 shadow-2xl">
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

            {/* Objective Card - Premium Design */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-orange-50/80 via-red-50/80 to-amber-50/80 dark:from-orange-950/40 dark:via-red-950/40 dark:to-amber-950/40 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            Heat Transfer Mechanisms
                        </CardTitle>
                        <CardDescription className="text-base">Explore conduction, convection, and radiation</CardDescription>
                    </CardHeader>
                </Card>
            </motion.div>

            {/* Lab Information Card - Premium Design */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-orange-600" />
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
            </motion.div>

            <AnimatePresence mode="wait">
                {currentStep === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-xl">Welcome to the Heat Transfer Lab!</CardTitle>
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
                                <Button 
                                    onClick={handleStartExperiment} 
                                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg" 
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
                            collectedItems={collectedSupplies}
                            onCollect={handleCollectSupply}
                            onAllCollected={handleAllSuppliesCollected}
                            showSupplies={true}
                        />
                    </motion.div>
                )}


                {currentStep === 'conduction' && (
                    <motion.div
                        key="conduction"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Thermometer className="h-6 w-6 text-gray-600" />
                                    Stage 1: Conduction
                                </CardTitle>
                                <CardDescription className="text-base">Heat transfer through direct contact in solids</CardDescription>
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
                                                
                                                <div className="text-center relative">
                                                    <p className="text-xs md:text-sm font-medium mb-2">Hot End</p>
                                                    {conductionHeating && (
                                                        <div className="relative h-20 flex items-center justify-center">
                                                            <EnhancedFlame isHeating={conductionHeating} />
                                                        </div>
                                                    )}
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

                                {!conductionTested && (
                                    <Button 
                                        onClick={handleTestConduction} 
                                        disabled={conductionHeating} 
                                        size="lg" 
                                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg disabled:opacity-50"
                                    >
                                        {conductionHeating ? 'Testing...' : 'Test Conduction'}
                                    </Button>
                                )}

                                {conductionTested && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-3"
                                    >
                                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200 dark:border-green-800 rounded-lg text-center">
                                            <p className="font-semibold text-green-700 dark:text-green-300">✅ Conduction Complete!</p>
                                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">Temperature reached {conductionTemp}°C</p>
                                        </div>
                                        <Button 
                                            onClick={handleContinueToConvection} 
                                            size="lg" 
                                            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
                                        >
                                            Continue to Convection
                                        </Button>
                                    </motion.div>
                                )}
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
                        <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Wind className="h-6 w-6 text-blue-600" />
                                    Stage 2: Convection
                                </CardTitle>
                                <CardDescription className="text-base">Heat transfer through fluid movement</CardDescription>
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

                                {!convectionTested && (
                                    <Button 
                                        onClick={handleTestConvection} 
                                        disabled={convectionHeating} 
                                        size="lg" 
                                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg disabled:opacity-50"
                                    >
                                        {convectionHeating ? 'Testing...' : 'Test Convection'}
                                    </Button>
                                )}

                                {convectionTested && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-3"
                                    >
                                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200 dark:border-green-800 rounded-lg text-center">
                                            <p className="font-semibold text-green-700 dark:text-green-300">✅ Convection Complete!</p>
                                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">Circular currents observed</p>
                                        </div>
                                        <Button 
                                            onClick={handleContinueToRadiation} 
                                            size="lg" 
                                            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
                                        >
                                            Continue to Radiation
                                        </Button>
                                    </motion.div>
                                )}
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
                        <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Zap className="h-6 w-6 text-yellow-600" />
                                    Stage 3: Radiation
                                </CardTitle>
                                <CardDescription className="text-base">Heat transfer through electromagnetic waves</CardDescription>
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

                                {!radiationTested && (
                                    <Button 
                                        onClick={handleTestRadiation} 
                                        disabled={radiationHeating} 
                                        size="lg" 
                                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg disabled:opacity-50"
                                    >
                                        {radiationHeating ? 'Testing...' : 'Test Radiation'}
                                    </Button>
                                )}

                                {radiationTested && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-3"
                                    >
                                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200 dark:border-green-800 rounded-lg text-center">
                                            <p className="font-semibold text-green-700 dark:text-green-300">✅ Radiation Complete!</p>
                                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">Heat traveled through empty space</p>
                                        </div>
                                        <Button 
                                            onClick={handleViewResults} 
                                            size="lg" 
                                            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
                                        >
                                            View Results
                                        </Button>
                                    </motion.div>
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
                        <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <CheckCircle className="h-6 w-6 text-orange-600" />
                                    Experiment Results
                                </CardTitle>
                                <CardDescription className="text-base">Summary of heat transfer mechanisms</CardDescription>
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
                                <Button 
                                    onClick={handleViewQuiz} 
                                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg" 
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
                        <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-xl">Knowledge Check</CardTitle>
                                <CardDescription className="text-base">Answer these questions about heat transfer</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium text-lg">1. Which method of heat transfer works through empty space?</p>
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
                                                    selectedAnswer1 === option.value && !quizSubmitted && "border-orange-500 bg-orange-50 dark:bg-orange-950/20 shadow-md",
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
                                    <p className="font-medium text-lg">2. Why is metal a good conductor of heat?</p>
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
                                                    selectedAnswer2 === option.value && !quizSubmitted && "border-orange-500 bg-orange-50 dark:bg-orange-950/20 shadow-md",
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
                                    <p className="font-medium text-lg">3. In convection, why does heated fluid rise?</p>
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
                                                    selectedAnswer3 === option.value && !quizSubmitted && "border-orange-500 bg-orange-50 dark:bg-orange-950/20 shadow-md",
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
                                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg disabled:opacity-50"
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
                        <Card className="border-2 border-yellow-400/50 dark:border-yellow-600/50 bg-gradient-to-br from-yellow-50/90 via-orange-50/90 to-amber-50/90 dark:from-yellow-950/40 dark:via-orange-950/40 dark:to-amber-950/40 backdrop-blur-sm shadow-2xl">
                            <CardHeader className="text-center">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="flex justify-center mb-4"
                                >
                                    <Trophy className="h-20 w-20 text-yellow-500" />
                                </motion.div>
                                <CardTitle className="text-2xl">Lab Complete!</CardTitle>
                                <CardDescription className="text-base">You've mastered heat transfer</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-6 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <Award className="h-8 w-8 text-orange-600" />
                                        <span className="text-2xl font-bold text-orange-600">+{xpEarned} XP</span>
                                    </div>
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
                                <Button 
                                    onClick={handleRestart} 
                                    variant="outline" 
                                    className="w-full border-2 bg-white/50 hover:bg-white/80 dark:bg-gray-900/50 dark:hover:bg-gray-900/80" 
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
