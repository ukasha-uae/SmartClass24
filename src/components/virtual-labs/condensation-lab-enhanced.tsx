'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Flame, Droplets, BookOpen, Shield, Sparkles, Trophy, Award, Thermometer, GripVertical } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';

type Step = 'intro' | 'collect-supplies' | 'add-water' | 'heat-water' | 'place-lid' | 'observe' | 'results' | 'quiz' | 'complete';

// Professional Kettle Component
const ProfessionalKettle = ({ waterLevel = 0, isHeating = false }: { waterLevel?: number; isHeating?: boolean }) => (
    <div className="relative w-32 h-40">
        {/* Kettle Base */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-gradient-to-b from-gray-400 to-gray-500 rounded-b-lg shadow-md" />
        
        {/* Kettle Body */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-28 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 rounded-t-3xl rounded-b-xl border-4 border-gray-400 shadow-xl overflow-hidden">
            {/* Water inside kettle */}
            {waterLevel > 0 && (
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${waterLevel}%` }}
                    className={cn(
                        "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-400 to-blue-300 dark:from-blue-600 dark:to-blue-500",
                        isHeating && "animate-pulse"
                    )}
                    style={{
                        borderRadius: '0 0 8px 8px'
                    }}
                >
                    {/* Water surface ripples when heating */}
                    {isHeating && (
                        <motion.div
                            className="absolute top-0 left-0 right-0 h-2 bg-blue-200/50"
                            animate={{
                                scaleX: [1, 1.1, 1],
                                scaleY: [1, 0.8, 1]
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    )}
                </motion.div>
            )}
            
            {/* Glass reflection effect */}
            <div className="absolute top-2 left-2 w-8 h-12 bg-white/30 rounded-full blur-sm" />
        </div>
        
        {/* Kettle Handle */}
        <div className="absolute bottom-8 right-0 w-8 h-16 border-4 border-gray-400 rounded-r-full bg-gradient-to-br from-gray-300 to-gray-400" />
        
        {/* Kettle Spout */}
        <div className="absolute bottom-10 -left-2 w-6 h-8">
            <div className="w-full h-full bg-gradient-to-l from-gray-300 to-gray-400 border-2 border-gray-500" 
                 style={{ 
                     clipPath: 'polygon(100% 0%, 0% 50%, 100% 100%)',
                     borderRadius: '0 4px 4px 0'
                 }} 
            />
        </div>
        
        {/* Kettle Lid/Cap */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-6">
            <div className="w-full h-4 bg-gradient-to-b from-gray-400 to-gray-500 rounded-t-lg border-2 border-gray-600" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-3 bg-gray-600 rounded-t-md" />
        </div>
    </div>
);

export function CondensationLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Supplies tracking
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [kettleCollected, setKettleCollected] = React.useState(false);
    const [waterCollected, setWaterCollected] = React.useState(false);
    const [heatSourceCollected, setHeatSourceCollected] = React.useState(false);
    const [lidCollected, setLidCollected] = React.useState(false);
    
    // Experiment state
    const [waterAdded, setWaterAdded] = React.useState(false);
    const [isHeating, setIsHeating] = React.useState(false);
    const [steamVisible, setSteamVisible] = React.useState(false);
    const [lidPlaced, setLidPlaced] = React.useState(false);
    const [dropletsFormed, setDropletsFormed] = React.useState(0);
    
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
        if (currentStep === 'heat-water') {
            const timer = setTimeout(() => {
                setSteamVisible(true);
                setTeacherMessage("Look! The water is boiling and creating steam! Steam is water in its gas form (water vapor). Now click on the cold lid to place it over the steam!");
                setPendingTransition(() => () => {
                    setCurrentStep('place-lid');
                });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    // Droplet formation and observation complete
    React.useEffect(() => {
        if (currentStep === 'observe' && dropletsFormed < 5) {
            const timer = setInterval(() => {
                setDropletsFormed(prev => prev + 1);
            }, 800);
            return () => clearInterval(timer);
        } else if (currentStep === 'observe' && dropletsFormed === 5) {
            // All droplets formed - show completion message
            const messageTimer = setTimeout(() => {
                setTeacherMessage("Amazing! Look at all those water droplets! The steam has turned back into liquid water. This same process creates dew on grass and fog on mirrors!");
                setPendingTransition(() => () => {
                    setCurrentStep('results');
                });
            }, 500);
            return () => clearTimeout(messageTimer);
        }
    }, [currentStep, dropletsFormed]);

    const handleStartExperiment = () => {
        setTeacherMessage("Perfect! Let's gather our supplies. Start by clicking on the KETTLE - we'll use this to heat the water!");
        setPendingTransition(() => () => {
            setCurrentStep('collect-supplies');
        });
    };
    
    const handleCollectKettle = () => {
        if (!kettleCollected) {
            setKettleCollected(true);
            setTeacherMessage("Great! You collected the kettle. This is our container for heating water. The kettle's metal body conducts heat well, allowing water to boil quickly. Now click on the WATER to collect it!");
            toast({ title: '✅ Kettle Collected', description: 'Container ready for heating' });
        }
    };
    
    const handleCollectWater = () => {
        if (kettleCollected && !waterCollected) {
            setWaterCollected(true);
            setTeacherMessage("Perfect! Water collected. Water is made of H₂O molecules. When we heat it, these molecules gain energy and turn into water vapor (steam). Click on the HEAT SOURCE next!");
            toast({ title: '✅ Water Collected', description: 'Ready to fill the kettle' });
        }
    };
    
    const handleCollectHeatSource = () => {
        if (waterCollected && !heatSourceCollected) {
            setHeatSourceCollected(true);
            setTeacherMessage("Excellent! Heat source ready. This will provide thermal energy to boil the water and create steam. Finally, we need a COLD LID with ice - the cold surface is key for condensation!");
            toast({ title: '✅ Heat Source Collected', description: 'Energy source ready' });
        }
    };
    
    const handleCollectLid = () => {
        if (heatSourceCollected && !lidCollected) {
            setLidCollected(true);
            setShowSupplies(false);
            setTeacherMessage("Perfect! All supplies collected! The ice on the lid will create a cold surface. Now let's start the experiment - click on the kettle to add water into it. Watch carefully as the water goes inside!");
            toast({ title: '✅ All Supplies Collected!', description: 'Ready to begin experiment' });
            setPendingTransition(() => () => {
                setCurrentStep('add-water');
            });
        }
    };
    
    const handleAddWater = () => {
        if (!waterAdded) {
            setWaterAdded(true);
            setTeacherMessage("Great! Water is now inside the kettle - see how it's contained in the bottom? The water molecules are in liquid form, moving around but staying together. Now we need to HEAT the water to boil it and create steam. Click on the flame below!");
            toast({ title: '✅ Water Added to Kettle', description: 'Water safely contained inside' });
            setPendingTransition(() => () => {
                setCurrentStep('heat-water');
            });
        }
    };
    
    const handleStartHeating = () => {
        if (waterAdded && !isHeating) {
            setIsHeating(true);
            setTeacherMessage("Excellent! The flame is heating the water. Watch the water level - as it heats up, the molecules gain kinetic energy and move faster. In a few seconds, it will reach 100°C and boil, turning into steam (water vapor). This phase change is called evaporation!");
            toast({ title: '🔥 Heating Water...', description: 'Temperature rising to 100°C' });
        }
    };
    
    const handlePlaceLid = () => {
        if (!lidPlaced) {
            setLidPlaced(true);
            setTeacherMessage("Perfect! Lid placed over the steam! The ice on top keeps the lid cold. Now watch carefully - as hot steam (100°C) touches the cold lid surface, it loses heat energy rapidly. The water vapor molecules slow down and come together, changing back to liquid water. This is CONDENSATION! Count the droplets forming...");
            toast({ title: '❄️ Cold Lid Placed', description: 'Condensation beginning...' });
            setPendingTransition(() => () => {
                setCurrentStep('observe');
                setDropletsFormed(0);
            });
        }
    };
    
    const handleTeacherComplete = () => {
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null);
            transition();
        }
    };

    const handleViewResults = () => {
        setTeacherMessage("Excellent work! You've successfully demonstrated condensation. Now let's test your understanding with a quiz!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
        });
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
            setTeacherMessage(`Outstanding! Perfect score! You've mastered condensation completely. You understand that water vapor (gas) turns to liquid when it loses heat energy on a cold surface. This process happens everywhere - in clouds, on cold windows, and even in your breath on a cold day. Excellent work! +${earnedXP} XP earned!`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Review the phase change from gas to liquid and try again!`);
            setTeacherMessage(`Good effort! You got ${correctCount} out of 3 correct. Remember the key points: condensation is gas → liquid, it requires a cold surface, and it's how clouds form in nature. Review your observations from the experiment and try again!`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: condensation is when water vapor (gas) turns into liquid water when cooled!`);
            setTeacherMessage(`Keep trying! You got ${correctCount} correct. Let me help: Condensation happens when water vapor (gas at 100°C) touches a cold surface and loses heat energy, turning back into liquid water. Think about the droplets that formed on our cold lid - that's condensation! Review the experiment steps and give it another go!`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setShowSupplies(true);
        setKettleCollected(false);
        setWaterCollected(false);
        setHeatSourceCollected(false);
        setLidCollected(false);
        setWaterAdded(false);
        setIsHeating(false);
        setSteamVisible(false);
        setLidPlaced(false);
        setDropletsFormed(0);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setPendingTransition(null);
        setTeacherMessage("Welcome back! Ready to explore condensation again? Let's observe how cooling causes water vapor to become liquid!");
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Teacher Voice */}
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
                emotion={currentStep === 'complete' ? 'celebrating' : currentStep === 'observe' ? 'happy' : 'explaining'}
                context={{
                    attempts: dropletsFormed,
                    correctStreak: dropletsFormed
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
                            <CardDescription>You've completed the Condensation Lab!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-blue-600">
                                <Award className="h-8 w-8" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You've mastered phase changes!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-600" />
                        Condensation of Water Vapor
                    </CardTitle>
                    <CardDescription>Observe how water vapor turns back into liquid</CardDescription>
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
                                    <div className="flex items-start gap-4">
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
                                    {/* Kettle */}
                                    {!kettleCollected && (
                                        <motion.div
                                            onClick={handleCollectKettle}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-gray-300 dark:border-gray-700 hover:border-gray-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-20 h-20 flex items-center justify-center">
                                                    <ProfessionalKettle waterLevel={0} isHeating={false} />
                                                </div>
                                                <span className="text-sm font-medium">Kettle</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Water */}
                                    {kettleCollected && !waterCollected && (
                                        <motion.div
                                            onClick={handleCollectWater}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Droplets className="h-20 w-20 text-blue-500" />
                                                <span className="text-sm font-medium">Water</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Heat Source */}
                                    {waterCollected && !heatSourceCollected && (
                                        <motion.div
                                            onClick={handleCollectHeatSource}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-red-300 dark:border-red-700 hover:border-red-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Flame className="h-20 w-20 text-red-600" />
                                                <span className="text-sm font-medium">Heat Source</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Cold Lid with Ice */}
                                    {heatSourceCollected && !lidCollected && (
                                        <motion.div
                                            onClick={handleCollectLid}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-cyan-300 dark:border-cyan-700 hover:border-cyan-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="relative w-24 h-16">
                                                    <div className="absolute bottom-0 w-full h-6 bg-gray-300 dark:bg-gray-600 rounded-md border-2 border-gray-400" />
                                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
                                                        <div className="w-3 h-3 bg-cyan-200 dark:bg-cyan-400 rounded-sm transform skew-x-12" />
                                                        <div className="w-4 h-4 bg-cyan-200 dark:bg-cyan-400 rounded-sm" />
                                                        <div className="w-3 h-3 bg-cyan-200 dark:bg-cyan-400 rounded-sm transform -skew-x-12" />
                                                    </div>
                                                </div>
                                                <span className="text-sm font-medium">Cold Lid with Ice</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Collected Items Display */}
                                    <div className="w-full mt-4 flex gap-4 justify-center flex-wrap">
                                        {kettleCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-gray-600" />
                                                <span className="text-sm">Kettle</span>
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
                                        {heatSourceCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-red-100 dark:bg-red-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-red-600" />
                                                <span className="text-sm">Heat Source</span>
                                            </motion.div>
                                        )}
                                        {lidCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-cyan-100 dark:bg-cyan-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-cyan-600" />
                                                <span className="text-sm">Cold Lid</span>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
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
                        <Card className="border-2 border-blue-200 dark:border-blue-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Thermometer className="h-5 w-5 text-red-600" />
                                    Interactive Experiment
                                </CardTitle>
                                <CardDescription>Click to perform each step</CardDescription>
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
                                                
                                                {/* Water droplets on lid */}
                                                {lidPlaced && dropletsFormed > 0 && (
                                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                                                        {[...Array(dropletsFormed)].map((_, i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="w-2 h-3 bg-blue-400 rounded-full"
                                                                style={{ 
                                                                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                                                                    marginLeft: i * -3
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {currentStep === 'place-lid' && (
                                                <p className="text-center mt-2 font-medium bg-cyan-100 dark:bg-cyan-900 px-3 py-1 rounded text-sm">
                                                    Click to Place Cold Lid
                                                </p>
                                            )}
                                        </motion.div>
                                    )}
                                    
                                    {/* Kettle */}
                                    <motion.div
                                        onClick={currentStep === 'add-water' ? handleAddWater : undefined}
                                        whileHover={currentStep === 'add-water' ? { scale: 1.05 } : {}}
                                        className={cn(
                                            "absolute bottom-16 md:bottom-24 left-1/2 -translate-x-1/2",
                                            currentStep === 'add-water' && "cursor-pointer"
                                        )}
                                    >
                                        <div className="relative">
                                            <ProfessionalKettle 
                                                waterLevel={waterAdded ? (isHeating ? 70 : 60) : 0}
                                                isHeating={isHeating}
                                            />
                                            
                                            {/* Steam */}
                                            {steamVisible && (
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20">
                                                    {[...Array(8)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="absolute w-3 h-3 bg-white/70 dark:bg-gray-300/70 rounded-full blur-sm"
                                                            animate={{
                                                                y: [0, -80],
                                                                x: [(i - 4) * 4, (i - 4) * 10],
                                                                opacity: [0.8, 0],
                                                                scale: [0.5, 2]
                                                            }}
                                                            transition={{
                                                                duration: 2.5,
                                                                repeat: Infinity,
                                                                delay: i * 0.15,
                                                                ease: "easeOut"
                                                            }}
                                                            style={{ left: '50%' }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {currentStep === 'add-water' && (
                                            <p className="text-center mt-4 font-medium bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-lg text-sm shadow-lg">
                                                💧 Click to Pour Water Into Kettle
                                            </p>
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
                                <CardDescription>Answer these questions about condensation</CardDescription>
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
                                <CardDescription>You've mastered condensation</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Condensation is the phase change from gas to liquid</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Cooling water vapor causes condensation</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Condensation is essential for cloud formation and the water cycle</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Water molecules lose energy and slow down during condensation</span>
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
