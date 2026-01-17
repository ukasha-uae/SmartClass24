'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Flame, Droplets, BookOpen, Shield, Sparkles, Trophy, Award, Thermometer, GripVertical, RefreshCw } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { LabSupplies, SupplyItem } from './LabSupplies';

type Step = 'intro' | 'collect-supplies' | 'add-water' | 'heat-water' | 'place-lid' | 'observe' | 'results' | 'quiz' | 'complete';

// Enhanced Kettle Component
const EnhancedKettle = ({ 
    waterAdded, 
    isHeating, 
    steamVisible 
}: { 
    waterAdded: boolean; 
    isHeating: boolean; 
    steamVisible: boolean;
}) => {
    return (
        <div className="relative w-32 h-40 md:w-40 md:h-48">
            {/* Kettle Body - Premium Design */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Main Body */}
                <div className="relative w-28 h-36 md:w-36 md:h-44">
                    {/* Kettle Base */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-4 md:w-32 md:h-5 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full shadow-lg" />
                    
                    {/* Kettle Body */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-32 md:w-32 md:h-40 bg-gradient-to-b from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-t-3xl rounded-b-xl border-2 border-gray-300 dark:border-gray-600 shadow-xl">
                        {/* Kettle Spout */}
                        <div className="absolute top-8 right-0 w-8 h-6 md:w-10 md:h-8 bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-r-lg border-2 border-gray-300 dark:border-gray-600 transform -skew-y-12" />
                        
                        {/* Kettle Handle */}
                        <div className="absolute top-12 left-0 w-6 h-16 md:w-8 md:h-20 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-l-full border-2 border-gray-400 dark:border-gray-600 -translate-x-2" />
                        
                        {/* Kettle Lid */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3 md:w-28 md:h-4 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full border-2 border-gray-400 dark:border-gray-600" />
                        
                        {/* Lid Handle */}
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 md:w-3 md:h-3 bg-gray-500 dark:bg-gray-400 rounded-full" />
                        
                        {/* Water Inside Kettle */}
                        {waterAdded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ 
                                    height: isHeating ? '75%' : '60%',
                                    opacity: 1
                                }}
                                transition={{ duration: 0.5 }}
                                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] rounded-b-xl overflow-hidden"
                            >
                                {/* Water with gradient and shine */}
                                <div className="relative w-full h-full">
                                    {/* Water base */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 dark:from-blue-500 dark:via-blue-600 dark:to-blue-700 rounded-b-xl" />
                                    
                                    {/* Water shine/reflection */}
                                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-200/60 to-transparent rounded-t-xl" />
                                    
                                    {/* Bubbles when heating */}
                                    {isHeating && (
                                        <>
                                            {[...Array(8)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-white/70 rounded-full"
                                                    style={{
                                                        left: `${15 + (i % 4) * 20}%`,
                                                        bottom: `${10 + (i % 2) * 15}%`,
                                                    }}
                                                    animate={{
                                                        y: [0, -20, 0],
                                                        opacity: [0.7, 1, 0.7],
                                                        scale: [0.8, 1.2, 0.8],
                                                    }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                        delay: i * 0.2,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                            ))}
                                        </>
                                    )}
                                    
                                    {/* Water surface ripples */}
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-blue-300/80 to-transparent">
                                        {isHeating && (
                                            <motion.div
                                                className="absolute inset-0 border-t-2 border-blue-400/50"
                                                animate={{
                                                    scaleX: [1, 1.1, 1],
                                                }}
                                                transition={{
                                                    duration: 0.8,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Steam from Kettle */}
            {steamVisible && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 md:w-24">
                    {[...Array(7)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-3 h-8 md:w-4 md:h-10 bg-gradient-to-t from-gray-300/80 via-gray-200/60 to-transparent rounded-full blur-sm"
                            style={{ 
                                left: `${(i - 3) * 8}%`,
                                bottom: 0
                            }}
                            animate={{
                                y: [0, -80, -120],
                                x: [(i - 3) * 3, (i - 3) * 6, (i - 3) * 10],
                                opacity: [0.8, 0.6, 0],
                                scale: [0.8, 1.2, 1.5]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeOut"
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export function CondensationLabEnhanced() {
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
            id: 'kettle',
            name: 'Kettle',
            emoji: '🫖',
            description: 'Container for heating water',
            required: true
        },
        {
            id: 'water',
            name: 'Water',
            emoji: '💧',
            description: 'Liquid to be heated',
            required: true
        },
        {
            id: 'heat-source',
            name: 'Heat Source',
            emoji: '🔥',
            description: 'Bunsen burner for heating',
            required: true
        },
        {
            id: 'cold-lid',
            name: 'Cold Lid with Ice',
            emoji: '🧊',
            description: 'Cold surface for condensation',
            required: true
        }
    ];
    
    // Experiment state
    const [waterAdded, setWaterAdded] = React.useState(false);
    const [isHeating, setIsHeating] = React.useState(false);
    const [steamVisible, setSteamVisible] = React.useState(false);
    const [lidPlaced, setLidPlaced] = React.useState(false);
    const [dropletsFormed, setDropletsFormed] = React.useState(0);
    const [allDropletsComplete, setAllDropletsComplete] = React.useState(false);
    
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
    const labId = 'condensation';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);
    const allSuppliesNotifiedRef = React.useRef(false);

    // Draggable teacher position
    const [teacherPosition, setTeacherPosition] = React.useState({ x: 0, y: 0 });

    // Intro message
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Condensation Lab! Today we'll explore how water vapor changes back into liquid water when it cools. This is the opposite of evaporation! You see condensation every day - on cold drink glasses, foggy mirrors, and when clouds form. Ready to observe this important phase change?");
        }
    }, [currentStep]);

    // Heating simulation
    React.useEffect(() => {
        if (currentStep === 'heat-water' && isHeating) {
            const timer = setTimeout(() => {
                setSteamVisible(true);
                setTeacherMessage("Look! The water is boiling and creating steam! Steam is water in its gas form (water vapor). Now click on the cold lid to place it over the steam!");
                setCurrentStep('place-lid');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [currentStep, isHeating]);

    // Droplet formation and observation complete - SLOWED DOWN for better observation
    React.useEffect(() => {
        if (currentStep === 'observe' && lidPlaced && dropletsFormed < 10) {
            const timer = setInterval(() => {
                setDropletsFormed(prev => {
                    const newCount = prev + 1;
                    if (newCount === 10) {
                        setAllDropletsComplete(true);
                        setTeacherMessage("Amazing! Look at all those water droplets forming on the cold lid! The steam has turned back into liquid water through condensation. This same process creates dew on grass and fog on mirrors! Take a moment to observe the droplets before continuing.");
                    }
                    return newCount;
                });
            }, 1500); // Slowed from 800ms to 1500ms (1.5 seconds per droplet)
            return () => clearInterval(timer);
        }
    }, [currentStep, dropletsFormed, lidPlaced]);

    const handleStartExperiment = () => {
        setCurrentStep('collect-supplies');
        setTeacherMessage("Perfect! Let's gather our supplies. We need a kettle, water, a heat source, and a cold lid with ice. Click on each item to collect them!");
    };
    
    // Supplies collection handlers
    const handleCollect = React.useCallback((itemId: string) => {
        if (!collectedItems.includes(itemId)) {
            setCollectedItems(prev => [...prev, itemId]);
        }
    }, [collectedItems]);

    const handleAllSuppliesCollected = React.useCallback(() => {
        if (!allSuppliesNotifiedRef.current) {
            allSuppliesNotifiedRef.current = true;
            toast({
                title: "All Supplies Collected!",
                description: "Great work! You have everything you need for the experiment.",
            });
        }
        setCurrentStep('add-water');
        setTeacherMessage("All supplies collected! Now click on the kettle to pour water into it.");
}, [toast]);
    
    const handleAddWater = () => {
        if (collectedItems.includes('water') && !waterAdded) {
            setWaterAdded(true);
            setTeacherMessage("Water added! Now click the flame icon to turn on the heat and boil the water!");
            setCurrentStep('heat-water');
        }
    };

    const handleStartHeating = () => {
        if (waterAdded && !isHeating) {
            setIsHeating(true);
            setTeacherMessage("Heating started! Watch the water boil and create steam!");
        }
    };

    const handlePlaceLid = () => {
        if (!lidPlaced) {
            setLidPlaced(true);
            setTeacherMessage("Perfect! Watch carefully as the hot steam hits the cold lid and loses energy. The water vapor will cool down and turn back into liquid droplets - this is condensation! Watch the droplets form one by one...");
            setCurrentStep('observe');
            setDropletsFormed(0);
            setAllDropletsComplete(false);
        }
    };

    const handleContinueFromObservation = () => {
        if (allDropletsComplete) {
            setTeacherMessage("Excellent observation! You've seen how condensation works. The water vapor from the steam cooled down on the cold lid and turned back into liquid water droplets. Now let's analyze what happened!");
            setCurrentStep('results');
        }
    };

    const handleTeacherComplete = () => {
        // No pending transitions - immediate responsiveness
    };

    const handleViewResults = () => {
        setTeacherMessage("Excellent work! You've successfully demonstrated condensation. Now let's test your understanding with a quiz!");
        setCurrentStep('quiz');
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        if (selectedAnswer1 === 'gas-liquid') correctCount++;
        if (selectedAnswer2 === 'cold') correctCount++;
        if (selectedAnswer3 === 'clouds') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You've mastered condensation! +${earnedXP} XP`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setCurrentStep('complete');
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Review the phase change from gas to liquid and try again!`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: condensation is when water vapor (gas) turns into liquid water when cooled!`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setCollectedItems([]);
        setWaterAdded(false);
        setIsHeating(false);
        setSteamVisible(false);
        setLidPlaced(false);
        setDropletsFormed(0);
        setAllDropletsComplete(false);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setXpEarned(0);
        allSuppliesNotifiedRef.current = false;
        setTeacherMessage("Welcome back! Ready to explore condensation again? Let's observe how cooling causes water vapor to become liquid!");
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
                emotion={currentStep === 'complete' ? 'celebrating' : currentStep === 'observe' ? 'explaining' : 'happy'}
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
                            Condensation of Water Vapor
                        </CardTitle>
                        <CardDescription className="text-blue-900/80 dark:text-blue-100/80">Observe how water vapor turns back into liquid</CardDescription>
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
                                <p><strong>Condensation</strong> is the process where water vapor (gas) becomes liquid water. It's the reverse of evaporation.</p>
                                <p>Condensation happens when water vapor in the air cools down and loses energy. This causes the water molecules to slow down and come closer together, forming liquid droplets.</p>
                                <p><strong>In the water cycle:</strong> Condensation is how clouds form! Water vapor in the atmosphere rises, cools, and condenses into tiny water droplets that become clouds.</p>
                                <p><strong>Everyday examples:</strong></p>
                                <ul>
                                    <li>Water droplets on a cold drink glass on a hot day</li>
                                    <li>Foggy bathroom mirror after a hot shower</li>
                                    <li>Morning dew on grass</li>
                                    <li>Water droplets on cold windows</li>
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
                                    <li>Handle hot kettles and steam with extreme care to avoid burns</li>
                                    <li>Wear safety goggles to protect your eyes</li>
                                    <li>Keep hands away from steam - it can cause serious burns</li>
                                    <li>Be cautious of hot surfaces and wet surfaces</li>
                                    <li>Use heat-resistant gloves when handling hot equipment</li>
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
                        description="Collect all the supplies needed to observe condensation"
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
                                <CardTitle>Welcome to the Condensation Lab!</CardTitle>
                                <CardDescription>Discover how water vapor becomes liquid</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                        <Droplets className="w-16 h-16 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">What We'll Discover:</h3>
                                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                                <li>• How cooling causes water vapor to condense</li>
                                                <li>• The phase change from gas to liquid</li>
                                                <li>• Why droplets form on cold surfaces</li>
                                                <li>• How condensation relates to weather and the water cycle</li>
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


                {(currentStep === 'add-water' || currentStep === 'heat-water' || currentStep === 'place-lid' || currentStep === 'observe') && (
                    <motion.div
                        key="experiment"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-blue-300/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50/80 via-cyan-50/80 to-teal-50/80 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-teal-950/30 backdrop-blur-sm shadow-lg">
                            <CardHeader className="relative z-10 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 dark:from-blue-900/30 dark:to-cyan-900/30 border-b border-blue-200/50 dark:border-blue-800/50">
                                <CardTitle className="flex items-center gap-2">
                                    <Thermometer className="h-5 w-5 text-red-600 dark:text-red-400" />
                                    Interactive Experiment
                                </CardTitle>
                                <CardDescription className="text-blue-900/80 dark:text-blue-100/80">Click to perform each step</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Experiment Area */}
                                <div className="flex justify-center items-center">
                                <div className="relative min-h-[400px] md:min-h-[500px] w-full max-w-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 p-4 md:p-8">
                                    {/* Cold Lid */}
                                    {(currentStep === 'place-lid' || lidPlaced) && (
                                        <motion.div
                                            onClick={currentStep === 'place-lid' ? handlePlaceLid : undefined}
                                            whileHover={currentStep === 'place-lid' ? { scale: 1.05 } : {}}
                                            initial={{ y: -50, opacity: 0 }}
                                            animate={{ y: lidPlaced ? 60 : 30, opacity: 1 }}
                                            className={cn(
                                                "absolute top-12 md:top-20 left-1/2 -translate-x-1/2 z-20",
                                                currentStep === 'place-lid' && "cursor-pointer"
                                            )}
                                        >
                                            <div className="relative w-24 md:w-32">
                                                <div className="w-full h-6 bg-gray-300 dark:bg-gray-600 rounded-md border-2 border-gray-400" />
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
                                                    <div className="w-4 h-4 bg-cyan-200 dark:bg-cyan-400 rounded-sm transform skew-x-12" />
                                                    <div className="w-5 h-5 bg-cyan-200 dark:bg-cyan-400 rounded-sm" />
                                                    <div className="w-4 h-4 bg-cyan-200 dark:bg-cyan-400 rounded-sm transform -skew-x-12" />
                                                </div>
                                                
                                                {/* Water droplets on lid - Enhanced for better visibility */}
                                                {lidPlaced && dropletsFormed > 0 && (
                                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap gap-1.5 justify-center max-w-[120px]">
                                                        {[...Array(dropletsFormed)].map((_, i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ scale: 0, opacity: 0 }}
                                                                animate={{ 
                                                                    scale: [0, 1.2, 1],
                                                                    opacity: [0, 1, 1]
                                                                }}
                                                                transition={{
                                                                    duration: 0.6,
                                                                    ease: "easeOut"
                                                                }}
                                                                className="w-3 h-4 md:w-3.5 md:h-4.5 bg-gradient-to-b from-blue-300 via-blue-400 to-blue-500 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 rounded-full shadow-lg border border-blue-200 dark:border-blue-700"
                                                                style={{ 
                                                                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                                                                }}
                                                            >
                                                                {/* Shine effect on droplets */}
                                                                <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/60 rounded-full" />
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                )}
                                                
                                                {/* Observation complete indicator */}
                                                {allDropletsComplete && currentStep === 'observe' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="absolute -bottom-12 left-1/2 -translate-x-1/2"
                                                    >
                                                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 px-4 py-2 rounded-lg border-2 border-green-300 dark:border-green-700 shadow-lg">
                                                            <p className="text-sm font-semibold text-green-900 dark:text-green-100 text-center">
                                                                ✓ Condensation Complete!
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                            
                                            {currentStep === 'place-lid' && (
                                                <p className="text-center mt-2 font-medium bg-cyan-100 dark:bg-cyan-900 px-3 py-1 rounded text-sm">
                                                    Click to Place Cold Lid
                                                </p>
                                            )}
                                            
                                            {/* Continue button after observation */}
                                            {allDropletsComplete && currentStep === 'observe' && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 1 }}
                                                    className="absolute -bottom-20 left-1/2 -translate-x-1/2"
                                                >
                                                    <Button
                                                        onClick={handleContinueFromObservation}
                                                        className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6 py-3"
                                                        size="lg"
                                                    >
                                                        Continue to Results
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                    
                                    {/* Enhanced Kettle */}
                                    <motion.div
                                        onClick={currentStep === 'add-water' ? handleAddWater : undefined}
                                        whileHover={currentStep === 'add-water' ? { scale: 1.05, y: -5 } : {}}
                                        className={cn(
                                            "absolute bottom-16 md:bottom-24 left-1/2 -translate-x-1/2",
                                            currentStep === 'add-water' && "cursor-pointer"
                                        )}
                                    >
                                        <EnhancedKettle 
                                            waterAdded={waterAdded}
                                            isHeating={isHeating}
                                            steamVisible={steamVisible}
                                        />
                                        
                                        {currentStep === 'add-water' && (
                                            <motion.p 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-center mt-4 font-medium bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 px-4 py-2 rounded-lg text-sm shadow-md border border-blue-300 dark:border-blue-700"
                                            >
                                                Click to Add Water
                                            </motion.p>
                                        )}
                                    </motion.div>
                                    
                                    {/* Flame */}
                                    <motion.div
                                        onClick={currentStep === 'heat-water' ? handleStartHeating : undefined}
                                        whileHover={currentStep === 'heat-water' ? { scale: 1.1 } : {}}
                                        className={cn(
                                            "absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2",
                                            currentStep === 'heat-water' && "cursor-pointer"
                                        )}
                                    >
                                        <Flame 
                                            className={cn(
                                                "h-12 w-12 md:h-16 md:w-16 transition-all duration-500",
                                                isHeating ? "text-red-500 animate-pulse" : "text-gray-400"
                                            )} 
                                        />
                                        
                                        {currentStep === 'heat-water' && (
                                            <p className="text-center mt-2 font-medium bg-red-100 dark:bg-red-900 px-3 py-1 rounded text-sm whitespace-nowrap">
                                                Click to Start Heating
                                            </p>
                                        )}
                                    </motion.div>
                                </div>                                </div>                            </CardContent>
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
                                    <h3 className="font-semibold text-lg mb-4">Key Observations:</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Heating Phase:</strong> Water in the kettle was heated until it boiled, creating steam (water vapor)
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Cold Surface:</strong> The lid with ice provided a cold surface above the steam
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Condensation Occurred:</strong> Water droplets formed on the cold lid as steam cooled
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Phase Change:</strong> Water vapor (gas) changed back to liquid water
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-cyan-50 dark:bg-cyan-950/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
                                    <h3 className="font-semibold mb-2">Scientific Explanation:</h3>
                                    <p className="text-sm text-muted-foreground">
                                        When the hot steam (water vapor) contacted the cold lid, it lost heat energy. 
                                        As the water molecules cooled, they slowed down and moved closer together, changing from gas to liquid. 
                                        This is <strong>condensation</strong> - the reverse of evaporation. This same process happens in nature 
                                        when water vapor in the atmosphere cools and forms clouds, fog, or dew!
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
                                <CardDescription className="text-blue-900/80 dark:text-blue-100/80">Answer these questions about condensation</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. During condensation, water changes from which state to which state?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'solid-liquid', label: 'Solid to liquid' },
                                            { value: 'liquid-gas', label: 'Liquid to gas' },
                                            { value: 'gas-liquid', label: 'Gas to liquid', isCorrect: true },
                                            { value: 'solid-gas', label: 'Solid to gas' }
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
                                    <p className="font-medium">2. What condition is necessary for condensation to occur?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'heat', label: 'Adding heat' },
                                            { value: 'cold', label: 'Cooling the water vapor', isCorrect: true },
                                            { value: 'pressure', label: 'Increasing pressure' },
                                            { value: 'light', label: 'Adding light' }
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
                                    <p className="font-medium">3. Which of these is an example of condensation in nature?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'boiling', label: 'Water boiling in a pot' },
                                            { value: 'freezing', label: 'Ice forming on a lake' },
                                            { value: 'clouds', label: 'Clouds forming in the sky', isCorrect: true },
                                            { value: 'melting', label: 'Snow melting in spring' }
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
                                        You've mastered condensation!
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
                                            <span>Condensation is the phase change from gas to liquid</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <span>Cooling water vapor causes condensation</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <span>Condensation is essential for cloud formation and the water cycle</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <span>Water molecules lose energy and slow down during condensation</span>
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

