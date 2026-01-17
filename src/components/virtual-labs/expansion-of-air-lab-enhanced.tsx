'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Flame, Droplets, BookOpen, Shield, Sparkles, Trophy, Award, Wind, RefreshCw, Thermometer } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { LabSupplies, SupplyItem } from './LabSupplies';

type Step = 'intro' | 'collect-supplies' | 'setup' | 'heat-air' | 'results' | 'quiz' | 'complete';

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

export function ExpansionOfAirLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    
    // Supplies tracking
    const [collectedSupplies, setCollectedSupplies] = React.useState<string[]>([]);
    
    // Experiment state
    const [suppliesReady, setSuppliesReady] = React.useState(false);
    const [balloonInflating, setBalloonInflating] = React.useState(false);
    const [balloonInflated, setBalloonInflated] = React.useState(false);
    const [heatingActive, setHeatingActive] = React.useState(false);
    const [temperature, setTemperature] = React.useState(20);
    const [balloonSize, setBalloonSize] = React.useState(0); // 0-100
    const [heatingComplete, setHeatingComplete] = React.useState(false);
    
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
    const allSuppliesNotifiedRef = React.useRef(false);

    // Supplies definition
    const supplies: SupplyItem[] = [
        { id: 'bottle', name: 'Bottle', emoji: '🍼', description: 'Container for air' },
        { id: 'water', name: 'Hot Water', emoji: '💧', description: 'Heat source' },
        { id: 'balloon', name: 'Balloon', emoji: '🎈', description: 'Expansion indicator' },
        { id: 'thermometer', name: 'Thermometer', emoji: '🌡️', description: 'Temperature measurement' },
    ];

    // Intro message
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Expansion of Air Lab! Today we'll discover how gases expand when heated. We'll use a balloon attached to a bottle filled with air. When we heat the air inside, it will gain energy and expand, inflating the balloon. Ready to explore gas behavior?");
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

    const handleAllSuppliesCollected = React.useCallback(() => {
        if (!allSuppliesNotifiedRef.current) {
            allSuppliesNotifiedRef.current = true;
            toast({
                title: "All Supplies Collected!",
                description: "Great work! You have everything you need for the experiment.",
            });
        }
        setTeacherMessage("All supplies ready! Now we'll set up the bottle with the balloon attached. Click 'Setup Complete' when ready!");
        setCurrentStep('setup');
}, [toast]);

    const handleSetupComplete = () => {
        setSuppliesReady(true);
        setTeacherMessage("Perfect! The balloon is now attached to the bottle. The air inside will expand when heated. Click 'Heat the Air' to start!");
        setCurrentStep('heat-air');
        toast({ title: '✅ Setup Complete' });
    };

    const handleHeatAir = () => {
        if (heatingActive || balloonInflated) return;
        
        setHeatingActive(true);
        setBalloonInflating(true);
        setTeacherMessage("Applying heat! Watch the air particles gain energy and spread out. The balloon is filling up!");
        toast({ title: '🔥 Heating the air...' });
        
        // Heating simulation - slower and more visible
        let currentTemp = temperature;
        let currentSize = 0;
        
        const heatInterval = setInterval(() => {
            currentTemp += 2;
            currentSize += 3;
            
            setTemperature(currentTemp);
            setBalloonSize(currentSize);
            
            if (currentTemp >= 80 || currentSize >= 95) {
                clearInterval(heatInterval);
                setHeatingActive(false);
                setBalloonInflated(true);
                setBalloonInflating(false);
                setHeatingComplete(true);
                setTeacherMessage("Wow! The balloon is fully inflated! The air expanded significantly when heated. This demonstrates Charles's Law - gases expand with temperature! Click 'Continue to Results' when you're ready.");
                toast({ title: '✅ Experiment Complete!', description: 'Balloon fully inflated!' });
            }
        }, 200);
    };

    const handleContinueToResults = () => {
        setTeacherMessage("You've observed gas expansion firsthand! The air particles moved faster and spread out when heated. Let's analyze the results!");
        setCurrentStep('results');
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Now let's test your understanding! Answer the questions about gas expansion.");
        setCurrentStep('quiz');
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
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Think about gas behavior and Charles's Law!`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: gases expand when heated and contract when cooled!`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setCollectedSupplies([]);
        setSuppliesReady(false);
        setBalloonInflating(false);
        setBalloonInflated(false);
        setHeatingActive(false);
        setTemperature(20);
        setBalloonSize(0);
        setHeatingComplete(false);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setTeacherMessage("Welcome back! Ready to explore air expansion again? Let's heat some gas!");
        allSuppliesNotifiedRef.current = false;
    };

    return (
        <div className="relative min-h-screen pb-20">
            {/* Premium Animated Background - Physics Theme (Blue/Cyan) */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-sky-950/30" />
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-blue-200/40 via-cyan-200/40 to-sky-200/40 dark:from-blue-800/20 dark:via-cyan-800/20 dark:to-sky-800/20 blur-3xl"
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
                    emotion={currentStep === 'complete' ? 'celebrating' : (currentStep === 'heat-air' || currentStep === 'results') ? 'explaining' : 'happy'}
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
                        className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4 backdrop-blur-sm shadow-lg"
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

                {/* Objective Card - Premium Design */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-50/80 via-cyan-50/80 to-sky-50/80 dark:from-blue-950/40 dark:via-cyan-950/40 dark:to-sky-950/40 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Wind className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                Expansion of Air
                            </CardTitle>
                            <CardDescription className="text-base">Observe how gases expand when heated</CardDescription>
                        </CardHeader>
                    </Card>
                </motion.div>

                {/* Lab Information Card - Premium Design */}
                {currentStep === 'intro' && (
<motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-blue-600" />
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
                            <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl">Welcome to the Expansion of Air Lab!</CardTitle>
                                    <CardDescription>Discover how gases expand when heated</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                        <div className="flex flex-col sm:flex-row items-start gap-4">
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
                                    <Button 
                                        onClick={handleStartExperiment} 
                                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg" 
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

                    {(currentStep === 'setup' || currentStep === 'heat-air') && (
                        <motion.div
                            key="experiment"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Flame className="h-6 w-6 text-orange-600" />
                                        Interactive Experiment
                                    </CardTitle>
                                    <CardDescription>Click to heat the air inside the bottle</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {currentStep === 'setup' && !suppliesReady && (
                                        <div className="text-center space-y-4">
                                            <p className="text-lg font-medium">Click to attach the balloon to the bottle</p>
                                            <Button 
                                                onClick={handleSetupComplete} 
                                                size="lg"
                                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                                            >
                                                Setup Complete
                                            </Button>
                                        </div>
                                    )}
                                    
                                    {/* Experiment Area */}
                                    <div className="flex justify-center items-center">
                                        <div className="relative min-h-[400px] md:min-h-[500px] w-full max-w-3xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 p-4 md:p-8 flex items-end justify-center">
                                            {/* Hot Water Container with Enhanced Flame */}
                                            {suppliesReady && (
                                                <motion.div
                                                    className="absolute bottom-20 md:bottom-32 left-4 md:left-8"
                                                    animate={{ boxShadow: heatingActive ? '0 0 30px rgba(255, 127, 39, 0.5)' : '0 0 0px transparent' }}
                                                >
                                                    <div className="relative w-20 md:w-32 h-24 md:h-32 border-2 border-red-400 rounded-lg bg-gradient-to-b from-orange-200/50 to-red-400/50 dark:from-orange-900/50 dark:to-red-900/50 flex items-center justify-center">
                                                        <p className="text-xs md:text-sm text-red-700 dark:text-red-300 font-medium text-center z-10">
                                                            {temperature}°C
                                                        </p>
                                                        {heatingActive && (
                                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                                                                <EnhancedFlame isHeating={heatingActive} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                            
                                            {/* Bottle with Enhanced Balloon */}
                                            <motion.div
                                                className="flex flex-col items-center gap-4"
                                            >
                                                {/* Enhanced Balloon */}
                                                <motion.div
                                                    animate={{ 
                                                        scale: 0.5 + (balloonSize / 100) * 1.5,
                                                        opacity: suppliesReady ? 1 : 0.3
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                    className="relative"
                                                >
                                                    <div className="relative w-24 md:w-32 h-32 md:h-40 bg-gradient-to-br from-red-400 via-red-500 to-red-600 dark:from-red-600 dark:via-red-700 dark:to-red-800 rounded-full border-2 border-red-600 dark:border-red-800 flex items-center justify-center shadow-xl">
                                                        {/* Balloon shine effect */}
                                                        <div className="absolute top-4 left-4 w-8 h-8 bg-white/30 rounded-full blur-sm" />
                                                        <span className="text-white text-xs md:text-sm font-bold z-10">
                                                            {Math.round(balloonSize)}%
                                                        </span>
                                                    </div>
                                                </motion.div>
                                                
                                                {/* Connection Point */}
                                                <div className="h-4 md:h-6 w-1 md:w-2 bg-gray-400 dark:bg-gray-600 rounded-full" />
                                                
                                                {/* Enhanced Bottle */}
                                                <div className="flex flex-col items-center">
                                                    <div className="w-12 md:w-16 h-6 md:h-8 border-2 border-blue-400 bg-gradient-to-b from-blue-100/80 to-blue-200/80 dark:from-blue-900/80 dark:to-blue-800/80 rounded-full shadow-md" />
                                                    <div className="relative w-16 md:w-24 h-28 md:h-36 border-2 border-blue-400 rounded-lg bg-gradient-to-b from-blue-100/80 to-blue-200/80 dark:from-blue-900/80 dark:to-blue-800/80 flex items-center justify-center shadow-lg">
                                                        {/* Bottle shine */}
                                                        <div className="absolute top-2 left-2 w-4 h-8 bg-white/20 rounded-full blur-sm" />
                                                        <div className="text-center z-10">
                                                            <p className="text-xs md:text-sm font-medium text-blue-800 dark:text-blue-200">Air</p>
                                                            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">{temperature}°C</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Heat Button */}
                                    {suppliesReady && !heatingComplete && (
                                        <div className="flex justify-center">
                                            <Button 
                                                onClick={handleHeatAir}
                                                disabled={balloonInflated || heatingActive}
                                                size="lg"
                                                className="gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg disabled:opacity-50"
                                            >
                                                <Flame className="h-5 w-5" />
                                                {balloonInflated ? 'Fully Inflated' : heatingActive ? 'Heating...' : 'Heat the Air'}
                                            </Button>
                                        </div>
                                    )}

                                    {/* Continue Button after heating */}
                                    {heatingComplete && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex justify-center"
                                        >
                                            <Button 
                                                onClick={handleContinueToResults}
                                                size="lg"
                                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                                            >
                                                Continue to Results
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
                            <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <CheckCircle className="h-6 w-6 text-blue-600" />
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
                                                    <strong>Charles's Law demonstrated:</strong> Volume increased proportionally with temperature increase (from {temperature - 60}°C to {temperature}°C)
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
                                    <Button 
                                        onClick={handleViewQuiz} 
                                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg" 
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
                            <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl">Knowledge Check</CardTitle>
                                    <CardDescription>Answer these questions about gas expansion</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Question 1 */}
                                    <div className="space-y-3">
                                        <p className="font-medium text-lg">1. What caused the balloon to inflate in this experiment?</p>
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
                                                        selectedAnswer1 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md",
                                                        selectedAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20 shadow-md",
                                                        selectedAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20 shadow-md",
                                                        selectedAnswer1 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:shadow-sm"
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
                                        <p className="font-medium text-lg">2. What happens to gas particles when heat is applied?</p>
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
                                                        selectedAnswer2 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md",
                                                        selectedAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20 shadow-md",
                                                        selectedAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20 shadow-md",
                                                        selectedAnswer2 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:shadow-sm"
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
                                        <p className="font-medium text-lg">3. What law describes the relationship between gas volume and temperature?</p>
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
                                                        selectedAnswer3 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md",
                                                        selectedAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20 shadow-md",
                                                        selectedAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20 shadow-md",
                                                        selectedAnswer3 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:shadow-sm"
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
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg disabled:opacity-50"
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
                                            className="border-2"
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
                                    <CardDescription className="text-base">You've mastered air expansion</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                        <div className="flex items-center justify-center gap-2 mb-4">
                                            <Award className="h-8 w-8 text-blue-600" />
                                            <span className="text-2xl font-bold text-blue-600">+{xpEarned} XP</span>
                                        </div>
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

