'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Sun, Wind, BookOpen, Shield, Sparkles, Droplets, Leaf, RefreshCw } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { LabSupplies, SupplyItem } from './LabSupplies';
import { Trophy, Award } from 'lucide-react';

type Step = 'intro' | 'collect-supplies' | 'place-bag' | 'tie-bag' | 'select-conditions' | 'observing' | 'results' | 'quiz' | 'complete';
const OBSERVATION_DURATION_SECONDS = 20;

export function TranspirationLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [collectedItems, setCollectedItems] = React.useState<string[]>([]);
    const [isBagPlaced, setIsBagPlaced] = React.useState(false);
    
    // Define supplies for the lab
    const supplies: SupplyItem[] = [
        {
            id: 'plastic-bag',
            name: 'Clear Plastic Bag',
            emoji: '📦',
            description: 'To trap water vapor',
            required: true
        },
        {
            id: 'string',
            name: 'String',
            emoji: '🎀',
            description: 'To tie the bag securely',
            required: true
        }
    ];
    const [sunlight, setSunlight] = React.useState(false);
    const [wind, setWind] = React.useState(false);
    const [observationTime, setObservationTime] = React.useState(0);
    const [waterDroplets, setWaterDroplets] = React.useState(0);
    const [teacherMessage, setTeacherMessage] = React.useState('');
    
    // Quiz state
    const [selectedAnswer1, setSelectedAnswer1] = React.useState<string | null>(null);
    const [selectedAnswer2, setSelectedAnswer2] = React.useState<string | null>(null);
    const [selectedAnswer3, setSelectedAnswer3] = React.useState<string | null>(null);
    const [quizFeedback, setQuizFeedback] = React.useState<string>('');
    const [quizSubmitted, setQuizSubmitted] = React.useState(false);
    
    // XP and completion state
    const [xpEarned, setXpEarned] = React.useState(0);
    const [showCelebration, setShowCelebration] = React.useState(false);
    const { markLabComplete, isLabCompleted, getLabCompletion } = useLabProgress();
    const labId = 'transpiration';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);
    const allSuppliesNotifiedRef = React.useRef(false);
    const observationProgressPercent = Math.min(
        100,
        Math.round((observationTime / OBSERVATION_DURATION_SECONDS) * 100)
    );

    // Show intro message on mount
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Transpiration Lab! Plants don't just sit there looking pretty—they're constantly moving water! Today we'll observe transpiration: the process where plants release water vapor through tiny pores in their leaves called stomata. It's like plants sweating! Ready to catch water vapor in action?");
        }
    }, [currentStep]);

    // Observation timer and droplet animation
    React.useEffect(() => {
        if (currentStep === 'observing') {
            const interval = setInterval(() => {
                setObservationTime(prev => {
                    if (prev >= OBSERVATION_DURATION_SECONDS) {
                        clearInterval(interval);
                        handleObservationComplete();
                        return OBSERVATION_DURATION_SECONDS;
                    }
                    return prev + 1;
                });
                
                // Calculate droplet accumulation based on conditions
                const baseRate = 2.5;
                const sunMultiplier = sunlight ? 2 : 1;
                const windMultiplier = wind ? 1.5 : 1;
                const totalRate = baseRate * sunMultiplier * windMultiplier;
                
                setWaterDroplets(prev => Math.min(100, prev + totalRate));
            }, 1000);
            
            return () => clearInterval(interval);
        }
    }, [currentStep, sunlight, wind]);

    const handleStartExperiment = () => {
        setCurrentStep('collect-supplies');
        setTeacherMessage("Great! First, we need to collect our supplies. We need a clear plastic bag to trap water vapor and a string to tie it securely. Click on each item to collect them!");
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
        setCurrentStep('place-bag');
        setTeacherMessage("Excellent! You now have both supplies. Now click on the plant's leafy branch to place the plastic bag over it.");
    }, [toast]);

    const handlePlaceBag = () => {
        if (!isBagPlaced) {
            setIsBagPlaced(true);
            setTeacherMessage("Good work! The plastic bag is now over the branch. Click the STRING at the bottom to tie it securely. This will seal the bag so water vapor can't escape!");
            setCurrentStep('tie-bag');
        }
    };

    const handleTieBag = () => {
        setTeacherMessage("Perfect seal! The bag will now trap water vapor from transpiration. Now we need to set environmental conditions. Will sunlight and wind affect how much water the plant releases? Let's choose!");
        setCurrentStep('select-conditions');
    };

    const handleSelectConditions = (sun: boolean, windOn: boolean) => {
        setSunlight(sun);
        setWind(windOn);
        
        let message = "Conditions set! ";
        if (sun && windOn) {
            message += "With BRIGHT SUNLIGHT and WIND, the plant will transpire rapidly! Heat opens stomata wider, and wind carries away moisture, encouraging more water release. Let's observe!";
        } else if (sun && !windOn) {
            message += "With SUNLIGHT but no wind, transpiration will be moderate. Heat increases water loss, but without wind, humidity builds up near leaves, slowing the process slightly.";
        } else if (!sun && windOn) {
            message += "With WIND but less light, transpiration will be moderate. Wind helps, but without strong light, stomata won't open as wide.";
        } else {
            message += "With LOW LIGHT and NO WIND, transpiration will be slow. Stomata stay partially closed in shade, and still air keeps humidity high around leaves.";
        }
        
        setTeacherMessage(message);
        setCurrentStep('observing');
        setObservationTime(0);
        setWaterDroplets(0);
    };

    const handleObservationComplete = () => {
        const dropletDescription = waterDroplets > 70 ? "LOTS of water droplets" : 
                                   waterDroplets > 40 ? "moderate water droplets" : 
                                   "some water droplets";
        
        setTeacherMessage(`Observation complete! Look at the bag—${dropletDescription} have collected inside! This water came from inside the plant's leaves through transpiration. The plant absorbed water from soil through roots, transported it up through xylem vessels, and released it as vapor through stomata. Now you can see what was invisible!`);
        setCurrentStep('results');
    };

    const handleProceedToQuiz = () => {
        setTeacherMessage("Excellent observations! Now let's test your understanding. Think about: Where did the water come from? How do environmental conditions affect transpiration? Why is this process important for plants?");
        setCurrentStep('quiz');
    };

    const handleQuizSubmit = () => {
        const correct1 = selectedAnswer1 === 'stomata';
        const correct2 = selectedAnswer2 === 'increase';
        const correct3 = selectedAnswer3 === 'evidence';
        
        const correctCount = [correct1, correct2, correct3].filter(Boolean).length;
        const score = Math.round((correctCount / 3) * 100);
        
        setQuizSubmitted(true);
        
        if (correctCount === 3) {
            setQuizFeedback("🎉 Perfect! You understand transpiration completely! You know about stomata, how conditions affect the rate, and how to detect this invisible process.");
            
            // Calculate XP (100 for first completion, 75 for subsequent)
            const earnedXP = completion ? 75 : 100;
            setXpEarned(earnedXP);
            
            // Mark lab as complete
            markLabComplete(labId, score, observationTime * 1000);
            
            // Show celebration
            setShowCelebration(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            
            setTeacherMessage(`Congratulations! You've completed the Transpiration Lab with a perfect score! You earned ${earnedXP} XP. You now understand how plants move water through transpiration—a process crucial for nutrient transport, cooling, and maintaining water flow from roots to leaves!`);
            setCurrentStep('complete');
        } else if (correctCount === 2) {
            setQuizFeedback(`Good effort! You got ${correctCount} out of 3 correct. Review how stomata work and the effects of environmental conditions!`);
            setTeacherMessage("Good work! You understood most concepts. Remember: stomata are the tiny pores in leaves where water vapor escapes. Heat and sunlight make stomata open wider, and wind carries moisture away, both increasing transpiration rate. Keep these principles in mind!");
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Think about the stomata in leaves and how heat and wind affect water vapor release. Try again!`);
            setTeacherMessage("Let's review the key concepts: Transpiration happens through stomata (tiny pores in leaves). Water evaporates from inside the leaf and exits through these pores. Sunlight opens stomata wider and provides heat for evaporation. Wind removes humid air near leaves, maintaining a steep water vapor gradient. Together, they dramatically increase transpiration rate!");
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setCollectedItems([]);
        setIsBagPlaced(false);
        setSunlight(false);
        setWind(false);
        setObservationTime(0);
        setWaterDroplets(0);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setXpEarned(0);
        setShowCelebration(false);
        allSuppliesNotifiedRef.current = false;
        setTeacherMessage("Welcome back! Ready to explore transpiration again? Let's discover how plants move water from roots to air!");
    };

    // Handle teacher voice completion
    const handleTeacherComplete = () => {
        // No pending transitions - immediate responsiveness
    };

    // Generate random droplet positions
    const dropletPositions = React.useMemo(() => {
        return Array.from({ length: 25 }).map((_, i) => ({
            top: 15 + Math.random() * 60,
            left: 15 + Math.random() * 70,
            delay: i * 0.1,
            size: 0.5 + Math.random() * 0.5
        }));
    }, []);

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
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
            />

            {currentStep === 'intro' && isCompleted && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4"
                >
                    <div className="flex items-center gap-3">
                        <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        <div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Lab Completed!</h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Score: {completion?.score}% | XP Earned: {completion?.xpEarned} | Time: {Math.round((completion?.timeSpent || 0) / 1000)}s
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
                            Transpiration Lab - Plants Releasing Water
                        </CardTitle>
                        <CardDescription className="text-blue-900/80 dark:text-blue-100/80">Observe how plants release water vapor through their leaves and detect factors affecting the rate.</CardDescription>
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
                        <CardDescription className="text-blue-900/80 dark:text-blue-100/80">Background theory and safety tips for this experiment.</CardDescription>
                    </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    <span>Background Theory</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                                <p><strong>Transpiration</strong> is the process by which water is absorbed by plant roots, transported through the plant, and released as water vapor through stomata (tiny pores) in the leaves.</p>
                                <p className="mt-2"><strong>The Process:</strong></p>
                                <ul className="list-disc pl-5 space-y-1 mt-2">
                                    <li><strong>Absorption:</strong> Roots absorb water and minerals from soil</li>
                                    <li><strong>Transport:</strong> Water moves up through xylem vessels (like tiny pipes)</li>
                                    <li><strong>Evaporation:</strong> Water evaporates from leaf cells into air spaces</li>
                                    <li><strong>Release:</strong> Water vapor exits through stomata pores</li>
                                </ul>
                                <p className="mt-2"><strong>Factors Affecting Transpiration Rate:</strong></p>
                                <ul className="list-disc pl-5 space-y-1 mt-2">
                                    <li><strong>Light Intensity:</strong> More light → stomata open wider → faster transpiration</li>
                                    <li><strong>Temperature:</strong> Higher temperature → more evaporation → faster rate</li>
                                    <li><strong>Wind:</strong> Wind removes moisture → maintains gradient → faster rate</li>
                                    <li><strong>Humidity:</strong> Dry air → greater gradient → faster transpiration</li>
                                </ul>
                                <p className="mt-2"><strong>Why It's Important:</strong> Transpiration creates a "pull" that draws water up from roots (like sucking through a straw), transports nutrients, and cools the plant. About 90% of water absorbed by plants is transpired!</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    <span>Safety Precautions</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Use a clear plastic bag to observe water droplet formation easily.</li>
                                    <li>Don't leave the bag on the plant for more than 24 hours—the plant needs to "breathe" normally.</li>
                                    <li>Tie the bag loosely to avoid damaging the stem or branch.</li>
                                    <li>Handle the plant gently to avoid breaking leaves or branches.</li>
                                    <li>If using a light source, ensure it doesn't overheat the plant or pose a fire risk.</li>
                                    <li>Choose a healthy plant for accurate results.</li>
                                    <li>Wash hands after handling plants and soil.</li>
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
                        description="Collect all the supplies needed to observe transpiration"
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
                                <CardTitle>Welcome to the Transpiration Lab!</CardTitle>
                                <CardDescription>Discover how plants move water from soil to air</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                        <Droplets className="w-16 h-16 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">What We'll Discover:</h3>
                                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                                <li>• How to make the invisible process of transpiration visible</li>
                                                <li>• The role of stomata in water vapor release</li>
                                                <li>• How sunlight and wind affect transpiration rate</li>
                                                <li>• Why transpiration is essential for plant survival</li>
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

                {(currentStep === 'place-bag' || currentStep === 'tie-bag') && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-green-200 dark:border-green-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Leaf className="h-5 w-5 text-green-600" />
                                    Interactive Experiment - Click to Use Items
                                </CardTitle>
                                <CardDescription>Follow the teacher's instructions and click on supplies to use them</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Experiment Area with Plant */}
                                <div className="relative min-h-[400px] bg-gradient-to-b from-sky-100 to-green-100 dark:from-sky-950/30 dark:to-green-950/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 p-8">
                                    {/* Plant */}
                                    <motion.div
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute bottom-8 left-1/2 -translate-x-1/2"
                                    >
                                        <div className="relative w-48 h-64">
                                            {/* Pot */}
                                            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-b from-orange-600 to-orange-800 rounded-b-lg" 
                                                 style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0% 100%)' }} />
                                            <div className="absolute bottom-20 w-full h-1 bg-amber-900" />
                                            {/* Stem */}
                                            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-3 h-32 bg-green-700 rounded-t-sm" />
                                            {/* Branch with leaves - CLICKABLE for bag placement */}
                                            <motion.div
                                                onClick={currentStep === 'place-bag' ? handlePlaceBag : undefined}
                                                whileHover={currentStep === 'place-bag' ? { scale: 1.05 } : {}}
                                                className={cn(
                                                    "absolute bottom-32 left-1/2 -translate-x-1/2 w-32 h-32",
                                                    currentStep === 'place-bag' && "cursor-pointer"
                                                )}
                                            >
                                                <Leaf className="absolute top-0 left-4 w-10 h-10 text-green-600 -rotate-12" />
                                                <Leaf className="absolute top-2 right-4 w-10 h-10 text-green-600 rotate-12" />
                                                <Leaf className="absolute top-6 left-8 w-12 h-12 text-green-500" />
                                                <Leaf className="absolute top-4 right-6 w-10 h-10 text-green-600" />
                                                
                                                {/* Bag placed over branch */}
                                                {isBagPlaced && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 0.4, scale: 1 }}
                                                        className="absolute -inset-6 bg-gradient-to-b from-blue-200/40 to-blue-300/50 dark:from-blue-400/20 dark:to-blue-500/30 rounded-t-full border-2 border-blue-300/60"
                                                    >
                                                        {/* Show water droplets after conditions are set */}
                                                        {currentStep === 'tie-bag' && (
                                                            <>
                                                                {[...Array(3)].map((_, i) => (
                                                                    <motion.div
                                                                        key={i}
                                                                        initial={{ opacity: 0, scale: 0 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        transition={{ delay: i * 0.3 }}
                                                                        className="absolute"
                                                                        style={{ 
                                                                            top: `${20 + i * 15}%`, 
                                                                            left: `${30 + i * 15}%` 
                                                                        }}
                                                                    >
                                                                        <Droplets className="h-3 w-3 text-blue-500" />
                                                                    </motion.div>
                                                                ))}
                                                            </>
                                                        )}
                                                    </motion.div>
                                                )}
                                                
                                                {/* String at bottom - CLICKABLE for tying */}
                                                {isBagPlaced && currentStep === 'tie-bag' && (
                                                    <motion.div
                                                        onClick={handleTieBag}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 cursor-pointer"
                                                        initial={{ opacity: 0, y: -20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                    >
                                                        <div className="w-16 h-1 bg-yellow-600 rounded-full border-2 border-yellow-800" />
                                                        <p className="text-xs text-center mt-1 font-medium bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
                                                            Click to Tie
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'select-conditions' && (
                    <motion.div
                        key="select-conditions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Step 2: Select Environmental Conditions</CardTitle>
                                <CardDescription>Choose light and wind conditions to test their effect</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Condition combinations */}
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleSelectConditions(true, true)}
                                        className="p-6 rounded-lg border-2 border-yellow-300 dark:border-yellow-700 bg-gradient-to-br from-yellow-50 to-blue-50 dark:from-yellow-950/20 dark:to-blue-950/20 hover:shadow-lg transition-all text-left"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <Sun className="h-8 w-8 text-yellow-500" />
                                            <Wind className="h-8 w-8 text-blue-500" />
                                        </div>
                                        <h3 className="font-semibold mb-2">Bright Sun + Wind</h3>
                                        <p className="text-sm text-muted-foreground">Maximum transpiration! Heat opens stomata, wind removes moisture.</p>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleSelectConditions(true, false)}
                                        className="p-6 rounded-lg border-2 border-yellow-300 dark:border-yellow-700 bg-gradient-to-br from-yellow-50 to-gray-50 dark:from-yellow-950/20 dark:to-gray-950/20 hover:shadow-lg transition-all text-left"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <Sun className="h-8 w-8 text-yellow-500" />
                                            <Wind className="h-8 w-8 text-gray-400 opacity-30" />
                                        </div>
                                        <h3 className="font-semibold mb-2">Bright Sun Only</h3>
                                        <p className="text-sm text-muted-foreground">Moderate transpiration. Heat helps, but no wind to remove moisture.</p>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleSelectConditions(false, true)}
                                        className="p-6 rounded-lg border-2 border-blue-300 dark:border-blue-700 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950/20 dark:to-blue-950/20 hover:shadow-lg transition-all text-left"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <Sun className="h-8 w-8 text-gray-400 opacity-30" />
                                            <Wind className="h-8 w-8 text-blue-500" />
                                        </div>
                                        <h3 className="font-semibold mb-2">Shade + Wind</h3>
                                        <p className="text-sm text-muted-foreground">Moderate transpiration. Wind helps, but less light keeps stomata narrower.</p>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleSelectConditions(false, false)}
                                        className="p-6 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/40 hover:shadow-lg transition-all text-left"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <Sun className="h-8 w-8 text-gray-400 opacity-30" />
                                            <Wind className="h-8 w-8 text-gray-400 opacity-30" />
                                        </div>
                                        <h3 className="font-semibold mb-2">Shade, No Wind</h3>
                                        <p className="text-sm text-muted-foreground">Slow transpiration. Stomata partially closed, humidity builds up.</p>
                                    </motion.button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {(currentStep === 'observing' || currentStep === 'results') && (
                    <motion.div
                        key="observing"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Step 3: Observation</CardTitle>
                                <CardDescription>Watch water droplets form inside the plastic bag</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                                    {/* Visual representation */}
                                    <div className="relative w-64 h-80 bg-gradient-to-b from-sky-100 to-green-100 dark:from-sky-950/30 dark:to-green-950/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 overflow-hidden">
                                        {/* Environmental indicators */}
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            {sunlight && (
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                                                    transition={{ duration: 3, repeat: Infinity }}
                                                >
                                                    <Sun className="h-8 w-8 text-yellow-400" />
                                                </motion.div>
                                            )}
                                            {wind && (
                                                <motion.div
                                                    animate={{ x: [0, 5, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                >
                                                    <Wind className="h-8 w-8 text-blue-400" />
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Plant with bag */}
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-64">
                                            {/* Pot */}
                                            <div className="absolute bottom-0 w-full h-16 bg-gradient-to-b from-orange-600 to-orange-800 rounded-b-lg" 
                                                 style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0% 100%)' }} />
                                            {/* Stem */}
                                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-2 h-24 bg-green-700" />
                                            {/* Branch with leaves */}
                                            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-32 h-32">
                                                <Leaf className="absolute top-0 left-4 w-10 h-10 text-green-600 -rotate-12" />
                                                <Leaf className="absolute top-2 right-4 w-10 h-10 text-green-600 rotate-12" />
                                                <Leaf className="absolute top-6 left-8 w-12 h-12 text-green-500" />
                                            </div>

                                            {/* Plastic bag with droplets */}
                                            {isBagPlaced && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 0.4, scale: 1 }}
                                                    className="absolute bottom-20 left-1/2 -translate-x-1/2 w-36 h-40 bg-gradient-to-b from-blue-200/30 to-blue-300/40 dark:from-blue-400/20 dark:to-blue-500/30 rounded-t-full border-2 border-blue-300/50"
                                                >
                                                    {/* Water droplets */}
                                                    {dropletPositions.slice(0, Math.floor(waterDroplets / 4)).map((pos, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, scale: 0 }}
                                                            animate={{ opacity: 1, scale: pos.size }}
                                                            transition={{ delay: pos.delay, duration: 0.5 }}
                                                            className="absolute"
                                                            style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                                                        >
                                                            <Droplets className="h-3 w-3 text-blue-500" />
                                                        </motion.div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Data display */}
                                    <div className="flex-1 space-y-4 max-w-xs">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <h4 className="font-semibold mb-2">Conditions:</h4>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Sun className={cn("h-4 w-4", sunlight ? "text-yellow-500" : "text-gray-400")} />
                                                <span className="text-sm">{sunlight ? "Bright Sunlight" : "Shade"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Wind className={cn("h-4 w-4", wind ? "text-blue-500" : "text-gray-400")} />
                                                <span className="text-sm">{wind ? "Windy" : "Still Air"}</span>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                                            <h4 className="font-semibold mb-2">Water Droplets:</h4>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                                                <motion.div 
                                                    className="bg-gradient-to-r from-blue-400 to-cyan-500 h-4 rounded-full flex items-center justify-end pr-2"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${waterDroplets}%` }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <span className="text-xs font-bold text-white">{Math.round(waterDroplets)}%</span>
                                                </motion.div>
                                            </div>
                                        </div>

                                        {currentStep === 'observing' && (
                                            <div className="p-4 bg-gray-50 dark:bg-gray-950/20 rounded-lg border border-gray-200 dark:border-gray-800">
                                                <h4 className="font-semibold mb-2">Time Elapsed:</h4>
                                                <p className="text-2xl font-mono">{observationTime}s ({observationProgressPercent}%)</p>
                                                <p className="text-xs text-muted-foreground mt-1">Simulating 4-hour observation</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {currentStep === 'results' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800"
                                    >
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            Results:
                                        </h4>
                                        <p className="text-sm">
                                            {waterDroplets > 70 && "Excellent transpiration rate! Many water droplets collected inside the bag, proving active water vapor release from leaves."}
                                            {waterDroplets > 40 && waterDroplets <= 70 && "Good transpiration rate! Moderate amount of water droplets show the plant is releasing water vapor through stomata."}
                                            {waterDroplets <= 40 && "Slow transpiration rate. Fewer water droplets collected, showing that environmental conditions significantly affect the process."}
                                        </p>
                                    </motion.div>
                                )}

                                {currentStep === 'results' && (
                                    <Button 
                                        onClick={handleProceedToQuiz} 
                                        className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold" 
                                        size="lg"
                                    >
                                        Continue to Quiz
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {(currentStep === 'quiz' || currentStep === 'complete') && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        id="quiz-section"
                    >
                        <Card className="border-2 border-blue-300/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50/80 via-cyan-50/80 to-teal-50/80 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-teal-950/30 backdrop-blur-sm shadow-lg">
                            <CardHeader className="relative z-10 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 dark:from-blue-900/30 dark:to-cyan-900/30 border-b border-blue-200/50 dark:border-blue-800/50">
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    Post-Lab Quiz
                                </CardTitle>
                                <CardDescription className="text-blue-900/80 dark:text-blue-100/80">Test your understanding of the experiment</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. Through which structures do plants release water vapor?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'roots', label: 'Roots', isCorrect: false },
                                            { value: 'stomata', label: 'Stomata (tiny pores in leaves)', isCorrect: true },
                                            { value: 'flowers', label: 'Flowers', isCorrect: false },
                                        ].map((option) => (
                                            <motion.button
                                                key={option.value}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => !quizSubmitted && setSelectedAnswer1(option.value)}
                                                disabled={quizSubmitted}
                                                className={cn(
                                                    "w-full text-left p-3 rounded-lg border-2 transition-all",
                                                    selectedAnswer1 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                                                    selectedAnswer1 !== option.value && !quizSubmitted && "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
                                                    quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizSubmitted && !option.isCorrect && selectedAnswer1 === option.value && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizSubmitted && !option.isCorrect && selectedAnswer1 !== option.value && "opacity-50"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm sm:text-base">{option.label}</span>
                                                    {quizSubmitted && option.isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    {quizSubmitted && !option.isCorrect && selectedAnswer1 === option.value && <XCircle className="h-5 w-5 text-red-600" />}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                    {quizSubmitted && selectedAnswer1 !== 'stomata' && (
                                        <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                                            💡 Stomata are tiny pores (mostly on the underside of leaves) that open and close to control water vapor release and gas exchange.
                                        </p>
                                    )}
                                </div>

                                {/* Question 2 */}
                                <div className="space-y-3">
                                    <p className="font-medium">2. How do sunlight and wind affect the rate of transpiration?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'decrease', label: 'They decrease the rate', isCorrect: false },
                                            { value: 'increase', label: 'They increase the rate', isCorrect: true },
                                            { value: 'no-effect', label: 'They have no effect', isCorrect: false },
                                        ].map((option) => (
                                            <motion.button
                                                key={option.value}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => !quizSubmitted && setSelectedAnswer2(option.value)}
                                                disabled={quizSubmitted}
                                                className={cn(
                                                    "w-full text-left p-3 rounded-lg border-2 transition-all",
                                                    selectedAnswer2 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                                                    selectedAnswer2 !== option.value && !quizSubmitted && "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
                                                    quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizSubmitted && !option.isCorrect && selectedAnswer2 === option.value && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizSubmitted && !option.isCorrect && selectedAnswer2 !== option.value && "opacity-50"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm sm:text-base">{option.label}</span>
                                                    {quizSubmitted && option.isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    {quizSubmitted && !option.isCorrect && selectedAnswer2 === option.value && <XCircle className="h-5 w-5 text-red-600" />}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                    {quizSubmitted && selectedAnswer2 !== 'increase' && (
                                        <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                                            💡 Sunlight warms leaves and opens stomata wider. Wind removes moist air around leaves, maintaining a concentration gradient that speeds up transpiration.
                                        </p>
                                    )}
                                </div>

                                {/* Question 3 */}
                                <div className="space-y-3">
                                    <p className="font-medium">3. What did the water droplets inside the bag prove?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'rain', label: 'Condensation from rain outside', isCorrect: false },
                                            { value: 'evidence', label: 'Water vapor released by the plant through transpiration', isCorrect: true },
                                            { value: 'leak', label: 'The bag was leaking water', isCorrect: false },
                                        ].map((option) => (
                                            <motion.button
                                                key={option.value}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => !quizSubmitted && setSelectedAnswer3(option.value)}
                                                disabled={quizSubmitted}
                                                className={cn(
                                                    "w-full text-left p-3 rounded-lg border-2 transition-all",
                                                    selectedAnswer3 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                                                    selectedAnswer3 !== option.value && !quizSubmitted && "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
                                                    quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizSubmitted && !option.isCorrect && selectedAnswer3 === option.value && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizSubmitted && !option.isCorrect && selectedAnswer3 !== option.value && "opacity-50"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm sm:text-base">{option.label}</span>
                                                    {quizSubmitted && option.isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    {quizSubmitted && !option.isCorrect && selectedAnswer3 === option.value && <XCircle className="h-5 w-5 text-red-600" />}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                    {quizSubmitted && selectedAnswer3 !== 'evidence' && (
                                        <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                                            💡 The bag trapped water vapor released by the plant. As it cooled, the vapor condensed into visible droplets—direct evidence of transpiration!
                                        </p>
                                    )}
                                </div>

                                {quizFeedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "p-4 rounded-lg border-2",
                                            quizFeedback.includes('Perfect') ? "bg-green-50 dark:bg-green-950/20 border-green-500" : "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500"
                                        )}
                                    >
                                        <p className="font-medium">{quizFeedback}</p>
                                    </motion.div>
                                )}
                            </CardContent>
                            <CardFooter className="relative z-10 flex flex-col gap-3 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30 border-t border-blue-200/50 dark:border-blue-800/50">
                                {!quizSubmitted && (
                                    <Button 
                                        onClick={handleQuizSubmit}
                                        disabled={!selectedAnswer1 || !selectedAnswer2 || !selectedAnswer3}
                                        className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                                        size="lg"
                                    >
                                        Submit Quiz
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
                                        You've mastered transpiration!
                                    </p>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
                                        <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        What You've Learned:
                                    </h3>
                                    <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                            <span>Plants release water vapor through stomata in their leaves</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                            <span>Sunlight and wind increase the rate of transpiration</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                            <span>Transpiration helps transport water and nutrients from roots to leaves</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                            <span>Water droplets in the bag prove transpiration is occurring</span>
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
                                    Try Different Conditions
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
                    <div className="text-6xl">💧🌿</div>
                </motion.div>
            )}
            </div>
        </div>
    );
}
