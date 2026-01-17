'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Lightbulb, BookOpen, Shield, Sparkles, RefreshCw, Trophy, Award, Beaker, Droplets, Eye, EyeOff } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { LabSupplies, SupplyItem } from './LabSupplies';

// Simple SVG for an aquatic plant
const AquaticPlantIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M50 95V70" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 75C50 75 65 65 65 55C65 45 50 35 50 35" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 75C50 75 35 65 35 55C35 45 50 35 50 35" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 60C50 60 70 50 70 40C70 30 50 20 50 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 60C50 60 30 50 30 40C30 30 50 20 50 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
);

// Bubble component for animation
const Bubble = ({ delay, speed }: { delay: number; speed: number }) => (
    <motion.div
        className="absolute w-2 h-2 bg-blue-300/70 rounded-full"
        initial={{ y: 0, opacity: 1, x: 0 }}
        animate={{ 
            y: -150, 
            opacity: 0,
            x: (Math.random() - 0.5) * 20
        }}
        transition={{
            duration: speed,
            delay: delay,
            repeat: Infinity,
            ease: "linear"
        }}
        style={{
            left: `${45 + Math.random() * 10}%`,
            bottom: '10%'
        }}
    />
);

type Step = 'intro' | 'collect-supplies' | 'select-intensity' | 'running' | 'observe' | 'quiz' | 'complete';

export function PhotosynthesisLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [lightIntensity, setLightIntensity] = React.useState<'low' | 'medium' | 'high' | null>(null);
    const [observationTime, setObservationTime] = React.useState(0);
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Track tested light intensities
    const [testedIntensities, setTestedIntensities] = React.useState<Set<string>>(new Set());
    
    // Supplies tracking
    const [collectedItems, setCollectedItems] = React.useState<string[]>([]);
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [plantPlaced, setPlantPlaced] = React.useState(false);
    const [bubbleCount, setBubbleCount] = React.useState(0);
    const [showSafety, setShowSafety] = React.useState(true);
    
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
    const labId = 'photosynthesis';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    // Show intro message on mount
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Photosynthesis Lab! Today we'll explore how plants make their own food using light energy. We'll observe how light intensity affects the rate of oxygen production in an aquatic plant. Ready to discover how plants breathe life into our world? When you're ready, click the START EXPERIMENT button below to begin!");
        }
    }, [currentStep]);

    // Observation timer and bubble counting
    React.useEffect(() => {
        if (currentStep === 'running' && lightIntensity) {
            const interval = setInterval(() => {
                setObservationTime(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        handleObservationComplete();
                        return 100;
                    }
                    return prev + 2;
                });
                
                // Count bubbles based on intensity
                const bubbleRate = lightIntensity === 'low' ? 0.1 : lightIntensity === 'medium' ? 0.25 : 0.5;
                setBubbleCount(prev => prev + bubbleRate);
            }, 100);
            return () => clearInterval(interval);
        }
    }, [currentStep, lightIntensity]);

    const handleStartExperiment = () => {
        setCurrentStep('collect-supplies');
        setTeacherMessage('Before we begin, let\'s collect all the supplies we need for the photosynthesis experiment. Click on each item to collect it!');
    };

    const handleCollect = (itemId: string) => {
        setCollectedItems((prev) => [...prev, itemId]);
    };

    const handleAllSuppliesCollected = () => {
        setShowSupplies(false);
        setTeacherMessage('Excellent! All supplies collected. Now choose a light intensity to test. Low intensity simulates cloudy conditions, medium is partial sunlight, and high is bright sunlight. Which would you like to test first?');
        setCurrentStep('select-intensity');
    };

    // Define lab supplies
    const supplies: SupplyItem[] = [
        { id: 'aquatic-plant', name: 'Aquatic Plant (Hydrilla)', emoji: '🌿', description: 'Plant for photosynthesis', required: true, icon: Lightbulb },
        { id: 'beaker', name: 'Beaker with Water', emoji: '🥛', description: 'Container for the plant', required: true, icon: Beaker },
        { id: 'light-source', name: 'Light Source', emoji: '💡', description: 'Energy for photosynthesis', required: true, icon: Lightbulb },
        { id: 'timer', name: 'Timer', emoji: '⏱️', description: 'To measure bubble rate', required: true, icon: BookOpen },
    ];

    const handleSelectIntensity = (intensity: 'low' | 'medium' | 'high') => {
        setLightIntensity(intensity);
        setPlantPlaced(true);
        setBubbleCount(0);
        setObservationTime(0);
        setTeacherMessage(`Great choice! ${intensity === 'high' ? 'Bright sunlight' : intensity === 'medium' ? 'Partial sunlight' : 'Cloudy conditions'}. The plant is now in the beaker with ${intensity} light. Watch carefully as oxygen bubbles are produced!`);
        setCurrentStep('running');
    };



    const handleObservationComplete = () => {
        const bubbleRates = {
            low: "few bubbles slowly rising",
            medium: "a steady stream of bubbles",
            high: "many bubbles rapidly rising"
        };
        
        // Mark this intensity as tested
        setTestedIntensities(prev => new Set(prev).add(lightIntensity!));
        
        const numTested = testedIntensities.size + 1;
        const suggestion = numTested < 2 
            ? ` Would you like to test another light intensity to compare the results? Or proceed to the quiz?` 
            : ` You can test another intensity or proceed to the quiz to test your knowledge!`;
        
        setTeacherMessage(`Observation complete! At ${lightIntensity} intensity, we observed ${Math.round(bubbleCount)} bubbles in total - ${bubbleRates[lightIntensity!]}. This shows us that light intensity directly affects the rate of photosynthesis. More light = more energy = more oxygen produced!${suggestion}`);
        setCurrentStep('observe');
    };

    const handleProceedToQuiz = () => {
        setTeacherMessage("Time to test what you've learned! Answer these questions about photosynthesis and light intensity. Think carefully about what we observed!");
        setCurrentStep('quiz');
        setTimeout(() => {
            document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleQuizSubmit = () => {
        const correct1 = selectedAnswer1 === 'oxygen';
        const correct2 = selectedAnswer2 === 'light';
        const correct3 = selectedAnswer3 === 'increases';
        
        const correctCount = [correct1, correct2, correct3].filter(Boolean).length;
        const score = Math.round((correctCount / 3) * 100);
        
        setQuizSubmitted(true);
        
        if (correctCount === 3) {
            setQuizFeedback("🎉 Perfect! You got all answers correct! You understand how photosynthesis works and how light affects it.");
            
            // Calculate XP (100 for first completion, 75 for subsequent)
            const earnedXP = completion ? 75 : 100;
            setXpEarned(earnedXP);
            
            // Mark lab as complete
            markLabComplete(labId, score, observationTime);
            
            // Show celebration
            setShowCelebration(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            
            // 3-tier feedback: Perfect score
            setTeacherMessage(`Outstanding! Perfect score! 🎉 You've completely mastered photosynthesis!`);
            setTimeout(() => {
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            // Good effort - 2 out of 3 correct
            setQuizFeedback(`Good effort! You got ${correctCount} out of 3 correct. Review the feedback and try again to master photosynthesis!`);
            setTeacherMessage(`Good try! You got 2 out of 3 correct. Let me clarify the key points: (1) Plants produce OXYGEN (O₂) during photosynthesis - those bubbles you saw were oxygen gas! Plants take in CO₂ and release O₂. (2) We varied LIGHT INTENSITY in this experiment - low, medium, and high light levels. Light is the ENERGY source for photosynthesis. Chlorophyll in chloroplasts captures light photons. (3) When light intensity INCREASES, the rate of photosynthesis INCREASES. More light = more energy = faster reactions = more bubbles! Up to a limiting point. Think about what you observed: high light produced many rapid bubbles, low light produced few slow bubbles. That's the relationship between light and photosynthesis rate. The formula is 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂. Review your observations and try the quiz again!`);
        } else {
            // Needs work - 0 or 1 correct
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Don't worry! Review the experiment and try again. Think about how light helps plants make food.`);
            setTeacherMessage(`Keep trying! You got ${correctCount} answer${correctCount === 1 ? '' : 's'} correct. Let me explain photosynthesis carefully: PHOTOSYNTHESIS is how plants make food (glucose) using light energy. The word breaks down: "photo" = light, "synthesis" = to make. Here's what happens: Plants absorb LIGHT ENERGY with chlorophyll (green pigment) in chloroplasts. They take in CARBON DIOXIDE (CO₂) from air through stomata and WATER (H₂O) from roots. Using light energy, they combine these to make GLUCOSE (C₆H₁₂O₆) - their food. OXYGEN (O₂) is released as waste - those bubbles you saw! The equation: 6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂. Key points: (1) The GAS in bubbles is OXYGEN - we breathe it! (2) We tested LIGHT INTENSITY - how bright the light was. (3) MORE LIGHT = FASTER photosynthesis = MORE BUBBLES. When you increased light from low to high, did you see more bubbles? That's because light provides energy! Without enough light, photosynthesis slows down. Review the experiment, watch the bubbles, and think about what causes them. Then try the quiz again!`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setLightIntensity(null);
        setObservationTime(0);
        setBubbleCount(0);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setXpEarned(0);
        setShowCelebration(false);
        setCollectedItems([]);
        setShowSupplies(true);
        setPlantPlaced(false);
        setTestedIntensities(new Set());
        setTeacherMessage("Welcome back! Ready to explore photosynthesis again? Let's discover more about how plants use light to make food!");
    };

    const numBubbles = lightIntensity === 'low' ? 3 : lightIntensity === 'medium' ? 6 : 12;
    const bubbleSpeed = lightIntensity === 'low' ? 3 : lightIntensity === 'medium' ? 2 : 1.5;

    return (
        <div className="relative min-h-screen pb-20 overflow-hidden">
            {/* Premium Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20" />
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-r from-green-200/30 to-emerald-200/30 dark:from-green-800/20 dark:to-emerald-800/20 blur-3xl"
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
                <style jsx global>{`
                    @keyframes bubble {
                        0% { transform: translateY(0); opacity: 1; }
                        100% { transform: translateY(-150px); opacity: 0; }
                    }
                    .animate-bubble {
                        animation: bubble linear infinite;
                    }
                `}</style>

                <TeacherVoice 
                    message={teacherMessage}
                    onComplete={() => {}}
                    emotion={currentStep === 'complete' ? 'celebrating' : plantPlaced ? 'happy' : 'explaining'}
                    context={{
                        attempts: testedIntensities.size,
                        correctStreak: testedIntensities.size
                    }}
                    quickActions={[
                        {
                            label: 'Reset Lab',
                            icon: '🔄',
                            onClick: handleRestart
                        },
                        {
                            label: 'View Theory',
                            icon: '📖',
                            onClick: () => {
                                const theorySection = document.querySelector('[data-theory-section]');
                                theorySection?.scrollIntoView({ behavior: 'smooth' });
                            }
                        },
                        {
                            label: 'Safety Tips',
                            icon: '🛡️',
                            onClick: () => {
                                const safetySection = document.querySelector('[data-safety-section]');
                                safetySection?.scrollIntoView({ behavior: 'smooth' });
                            }
                        }
                    ]}
                />

            {currentStep === 'intro' && isCompleted && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-4"
                >
                    <div className="flex items-center gap-3">
                        <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
                        <div>
                            <h3 className="font-semibold text-green-900 dark:text-green-100">Lab Completed!</h3>
                            <p className="text-sm text-green-700 dark:text-green-300">
                                Score: {completion?.score}% | XP Earned: {completion?.xpEarned} | Time: {Math.round((completion?.timeSpent || 0) / 60)}min
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Premium Header Card */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <Card className="border-2 border-green-300/50 dark:border-green-700/50 bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-teal-50/80 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 backdrop-blur-sm shadow-xl">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            🌱 Photosynthesis Lab - Light & Oxygen Production
                        </CardTitle>
                        <CardDescription className="text-base">
                            Discover how light intensity affects the rate of oxygen production during photosynthesis in aquatic plants.
                        </CardDescription>
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
                <Card className="border-2 border-blue-300/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50/80 via-cyan-50/80 to-sky-50/80 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-sky-950/30 backdrop-blur-sm shadow-lg">
                    <CardHeader className="relative z-10 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 dark:from-blue-900/30 dark:to-cyan-900/30 border-b border-blue-200/50 dark:border-blue-800/50">
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            Lab Information
                        </CardTitle>
                        <CardDescription>Background theory and safety tips for this experiment.</CardDescription>
                    </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" data-theory-section>
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    <span>Background Theory</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                                <p><strong>Photosynthesis</strong> is the process by which plants convert light energy into chemical energy (glucose). The equation is:</p>
                                <p className="text-center font-mono text-sm bg-muted p-2 rounded my-2">
                                    6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂
                                </p>
                                <p>Plants use carbon dioxide from the air and water from the soil, with light energy captured by chlorophyll in chloroplasts, to produce glucose (food) and oxygen as a byproduct.</p>
                                <p className="mt-2"><strong>Light Intensity:</strong> One of the key factors affecting photosynthesis rate. More light provides more energy for the light-dependent reactions, leading to faster oxygen production—up to a point where other factors become limiting.</p>
                                <p className="mt-2"><strong>Aquatic Plants:</strong> Plants like Hydrilla are ideal for studying photosynthesis because the oxygen they produce appears as visible bubbles in water, making it easy to measure the rate of photosynthesis.</p>
                                <p className="mt-2"><strong>Why It Matters:</strong> Photosynthesis is the foundation of most food chains and produces the oxygen we breathe. Understanding how environmental factors affect it helps us appreciate plant life and address environmental challenges.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" data-safety-section>
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    <span>Safety Precautions</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>In a real lab, be extremely careful when using electrical light sources near water—risk of electric shock.</li>
                                    <li>Handle glassware (beakers, test tubes) with care to prevent breakage and cuts.</li>
                                    <li>Aquatic plants like Hydrilla should be handled gently to avoid damaging their delicate tissues.</li>
                                    <li>If using bright light sources, avoid looking directly at them to protect your eyes.</li>
                                    <li>Keep water away from electrical outlets and cords.</li>
                                    <li>Clean up any water spills immediately to prevent slipping hazards.</li>
                                    <li>Wash hands after handling plants and lab equipment.</li>
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
                        <Card className="border-2 border-green-300/50 dark:border-green-700/50 bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-teal-50/80 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 backdrop-blur-sm shadow-xl">
                            <CardHeader className="relative z-10 bg-gradient-to-r from-green-100/50 to-emerald-100/50 dark:from-green-900/30 dark:to-emerald-900/30 border-b border-green-200/50 dark:border-green-800/50">
                                <CardTitle className="text-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    Welcome to the Photosynthesis Lab!
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Let's explore how plants convert light into life-giving oxygen
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10 space-y-4 pt-6">
                                <div className="bg-gradient-to-r from-green-100/60 to-emerald-100/60 dark:from-green-900/30 dark:to-emerald-900/30 p-6 rounded-xl border-2 border-green-300/50 dark:border-green-700/50 shadow-lg">
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                        <motion.div
                                            animate={{ 
                                                scale: [1, 1.1, 1],
                                                rotate: [0, 5, -5, 0]
                                            }}
                                            transition={{ 
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <AquaticPlantIcon className="w-20 h-20 text-green-600 dark:text-green-400 flex-shrink-0 drop-shadow-lg" />
                                        </motion.div>
                                        <div>
                                            <h3 className="font-semibold text-xl mb-3 text-green-900 dark:text-green-100">What We'll Discover:</h3>
                                            <ul className="space-y-2 text-base text-green-800 dark:text-green-200">
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                                    <span>How light intensity affects oxygen production</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                                    <span>The role of light energy in photosynthesis</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                                    <span>Why plants are essential for life on Earth</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                                    <span>How to measure photosynthesis rate using bubbles</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="relative z-10 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30 border-t border-green-200/50 dark:border-green-800/50">
                                <Button 
                                    onClick={handleStartExperiment} 
                                    className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold" 
                                    size="lg"
                                >
                                    Start Experiment
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {/* Supplies Collection Step */}
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
                            onAllCollected={handleAllSuppliesCollected}
                            showSupplies={showSupplies}
                            title="Lab Supplies - Click to Collect"
                            description="Click on each item to collect it. We need all supplies to conduct the photosynthesis experiment."
                        />
                    </motion.div>
                )}

                {/* Light Intensity Selection Step */}
                {currentStep === 'select-intensity' && (
                    <motion.div
                        key="select-intensity"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-yellow-300/50 dark:border-yellow-700/50 bg-gradient-to-br from-yellow-50/80 via-amber-50/80 to-orange-50/80 dark:from-yellow-950/30 dark:via-amber-950/30 dark:to-orange-950/30 backdrop-blur-sm shadow-lg">
                            <CardHeader className="relative z-10 bg-gradient-to-r from-yellow-100/50 to-amber-100/50 dark:from-yellow-900/30 dark:to-amber-900/30 border-b border-yellow-200/50 dark:border-yellow-800/50">
                                <CardTitle className="flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                    Choose Light Intensity
                                </CardTitle>
                                <CardDescription>Select a light intensity to test. You can test different intensities to compare results.</CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10 space-y-4 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {(['low', 'medium', 'high'] as const).map((intensity) => (
                                        <motion.button
                                            key={intensity}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleSelectIntensity(intensity)}
                                            className={cn(
                                                "p-6 rounded-xl border-2 transition-all shadow-lg",
                                                "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900",
                                                "border-yellow-300 dark:border-yellow-700",
                                                "hover:border-yellow-500 hover:shadow-xl",
                                                "text-slate-700 dark:text-slate-300",
                                                "hover:text-slate-900 dark:hover:text-slate-100"
                                            )}
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <Lightbulb 
                                                    className={cn(
                                                        "h-16 w-16",
                                                        intensity === 'low' && "text-yellow-400 opacity-40",
                                                        intensity === 'medium' && "text-yellow-400 opacity-70",
                                                        intensity === 'high' && "text-yellow-300"
                                                    )} 
                                                />
                                                <div>
                                                    <p className="font-semibold text-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100">
                                                        {intensity.charAt(0).toUpperCase() + intensity.slice(1)} Light
                                                    </p>
                                                    <p className="text-sm text-muted-foreground mt-1 hover:text-slate-600 dark:hover:text-slate-400">
                                                        {intensity === 'low' && 'Cloudy conditions'}
                                                        {intensity === 'medium' && 'Partial sunlight'}
                                                        {intensity === 'high' && 'Bright sunlight'}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {(currentStep === 'running' || currentStep === 'observe') && (
                    <motion.div
                        key="running"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-blue-300/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50/80 via-cyan-50/80 to-sky-50/80 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-sky-950/30 backdrop-blur-sm shadow-xl">
                            <CardHeader className="relative z-10 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 dark:from-blue-900/30 dark:to-cyan-900/30 border-b border-blue-200/50 dark:border-blue-800/50">
                                <CardTitle className="flex items-center gap-2">
                                    <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    Observe Oxygen Production
                                </CardTitle>
                                <CardDescription>Watch the bubbles! Each bubble represents oxygen produced by photosynthesis.</CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10 space-y-6 pt-6">
                                {/* Enhanced Experiment Visualization */}
                                <div className="relative w-full max-w-2xl mx-auto h-96 bg-gradient-to-b from-sky-100 via-blue-200 to-cyan-300 dark:from-sky-950/40 dark:via-blue-900/60 dark:to-cyan-900/40 rounded-2xl p-6 flex items-center justify-center overflow-hidden border-2 border-blue-400/50 dark:border-blue-600/50 shadow-2xl">
                                    {/* Light Source with Glow */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ 
                                            scale: [1, 1.1, 1],
                                            opacity: 1,
                                        }}
                                        transition={{
                                            scale: {
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }
                                        }}
                                        className="absolute top-6 z-20"
                                        style={{
                                            filter: lightIntensity === 'high' ? 'drop-shadow(0 0 30px rgba(250,204,21,0.9))' : 
                                                    lightIntensity === 'medium' ? 'drop-shadow(0 0 20px rgba(250,204,21,0.6))' :
                                                    'drop-shadow(0 0 10px rgba(250,204,21,0.3))'
                                        }}
                                    >
                                        <Lightbulb 
                                            className={cn(
                                                "h-16 w-16 transition-all duration-500",
                                                lightIntensity === 'low' && "text-yellow-400 opacity-40",
                                                lightIntensity === 'medium' && "text-yellow-400 opacity-70",
                                                lightIntensity === 'high' && "text-yellow-300 opacity-100",
                                            )} 
                                        />
                                        <p className="text-xs text-center mt-1 font-semibold text-slate-700 dark:text-slate-300">
                                            {lightIntensity?.toUpperCase()} INTENSITY
                                        </p>
                                    </motion.div>

                                    {/* Beaker and Plant */}
                                    <motion.div 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="absolute bottom-8 h-56 w-44 border-x-4 border-b-4 border-gray-500 dark:border-gray-400 rounded-b-3xl flex items-end justify-center bg-gradient-to-b from-blue-100/40 to-blue-200/60 dark:from-blue-900/30 dark:to-blue-800/40 shadow-xl"
                                        style={{ clipPath: 'polygon(8% 0, 92% 0, 96% 100%, 4% 100%)' }}
                                    >
                                        {/* Water */}
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[88%] h-48 bg-gradient-to-b from-blue-300/60 to-cyan-400/40 dark:from-blue-600/40 dark:to-cyan-600/30 rounded-b-2xl" />
                                        
                                        {/* Plant */}
                                        <motion.div
                                            animate={{ 
                                                scale: [1, 1.03, 1],
                                                rotate: [0, 1, -1, 0]
                                            }}
                                            transition={{ 
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="relative z-10 mb-4"
                                        >
                                            <AquaticPlantIcon className="w-28 h-28 text-green-600 dark:text-green-400 drop-shadow-lg" />
                                        </motion.div>
                                        
                                        {/* Measurement marks */}
                                        {[100, 200, 300].map((ml) => (
                                            <div key={ml} className="absolute left-2 text-xs font-semibold text-slate-600 dark:text-slate-400" style={{ bottom: `${(ml/300)*48 + 8}px` }}>
                                                {ml}ml
                                            </div>
                                        ))}
                                    </motion.div>
                                    
                                    {/* Enhanced Bubbles */}
                                    {currentStep === 'running' && lightIntensity && Array.from({ length: numBubbles }).map((_, i) => (
                                        <Bubble key={i} delay={i * (bubbleSpeed / numBubbles)} speed={bubbleSpeed} />
                                    ))}

                                    {/* Bubble Counter Badge */}
                                    {currentStep === 'running' && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="absolute top-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 border-2 border-blue-300 dark:border-blue-700 shadow-lg z-30"
                                        >
                                            <div className="text-center">
                                                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Bubbles Counted</p>
                                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                    {Math.round(bubbleCount)}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Observation Progress */}
                                    {currentStep === 'running' && (
                                        <div className="absolute bottom-4 left-4 right-4 z-30">
                                            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-3 border-2 border-blue-300/50 dark:border-blue-700/50 shadow-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Observation Progress</p>
                                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{observationTime}%</p>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                                    <motion.div 
                                                        className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-3 rounded-full shadow-lg"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${observationTime}%` }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Enhanced Info Panel */}
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-5 rounded-xl border-2 border-blue-200/50 dark:border-blue-800/50 shadow-lg">
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                            <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-lg mb-2 text-slate-700 dark:text-slate-300">
                                                Light Intensity: <span className="text-blue-600 dark:text-blue-400 uppercase">{lightIntensity}</span>
                                            </h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                {lightIntensity === 'low' && "Fewer bubbles = slower photosynthesis with less light energy. The plant receives minimal photons, limiting the light-dependent reactions."}
                                                {lightIntensity === 'medium' && "Moderate bubbles = good photosynthesis rate. The plant receives adequate light for efficient energy conversion."}
                                                {lightIntensity === 'high' && "Many bubbles = rapid photosynthesis with abundant light! Maximum photon absorption leads to peak oxygen production."}
                                            </p>
                                            {currentStep === 'running' && (
                                                <div className="mt-3 flex items-center gap-2 text-sm">
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Bubble Rate:</span>
                                                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                                                        {lightIntensity === 'low' && '~2-3 bubbles/min'}
                                                        {lightIntensity === 'medium' && '~5-6 bubbles/min'}
                                                        {lightIntensity === 'high' && '~10-12 bubbles/min'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {currentStep === 'observe' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-3 gap-3">
                                            {(['low', 'medium', 'high'] as const).map((intensity) => (
                                                <Button
                                                    key={intensity}
                                                    onClick={() => {
                                                        setLightIntensity(intensity);
                                                        setPlantPlaced(false);
                                                        setObservationTime(0);
                                                        setBubbleCount(0);
                                                        setTeacherMessage(`Let's test ${intensity} light intensity! Watch how the bubble production changes.`);
                                                        setCurrentStep('select-intensity');
                                                    }}
                                                    variant={testedIntensities.has(intensity) ? "secondary" : "outline"}
                                                    size="sm"
                                                    className={cn(
                                                        "text-xs sm:text-sm",
                                                        "text-slate-700 dark:text-slate-300",
                                                        "hover:text-purple-700 dark:hover:text-purple-300",
                                                        "hover:bg-purple-50 dark:hover:bg-purple-950/20"
                                                    )}
                                                >
                                                    <span className="text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300">
                                                        {testedIntensities.has(intensity) && '✓ '}{intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                                                    </span>
                                                </Button>
                                            ))}
                                        </div>
                                        <Button 
                                            onClick={handleProceedToQuiz} 
                                            className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold" 
                                            size="lg"
                                        >
                                            Continue to Quiz
                                        </Button>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'quiz' && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        id="quiz-section"
                    >
                        <Card className="border-2 border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-indigo-50/80 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-indigo-950/30 backdrop-blur-sm shadow-xl">
                            <CardHeader className="relative z-10 bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-900/30 dark:to-pink-900/30 border-b border-purple-200/50 dark:border-purple-800/50">
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    Post-Lab Quiz
                                </CardTitle>
                                <CardDescription>Test your understanding of the experiment</CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10 space-y-6 pt-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-semibold text-lg text-slate-700 dark:text-slate-300">1. What gas is produced during photosynthesis that we observed as bubbles?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'oxygen', label: 'Oxygen (O₂)', isCorrect: true },
                                            { value: 'carbon-dioxide', label: 'Carbon Dioxide (CO₂)', isCorrect: false },
                                            { value: 'nitrogen', label: 'Nitrogen (N₂)', isCorrect: false },
                                        ].map((option) => (
                                            <motion.button
                                                key={option.value}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => !quizSubmitted && setSelectedAnswer1(option.value)}
                                                disabled={quizSubmitted}
                                                className={cn(
                                                    "w-full text-left p-4 rounded-xl border-2 transition-all shadow-sm",
                                                    selectedAnswer1 === option.value && !quizSubmitted && "border-purple-500 bg-purple-50 dark:bg-purple-950/20 shadow-md",
                                                    selectedAnswer1 !== option.value && !quizSubmitted && "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md",
                                                    quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizSubmitted && !option.isCorrect && selectedAnswer1 === option.value && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizSubmitted && !option.isCorrect && selectedAnswer1 !== option.value && "opacity-50",
                                                    "text-slate-700 dark:text-slate-300"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm sm:text-base font-medium">{option.label}</span>
                                                    {quizSubmitted && option.isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    {quizSubmitted && !option.isCorrect && selectedAnswer1 === option.value && <XCircle className="h-5 w-5 text-red-600" />}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                    {quizSubmitted && selectedAnswer1 !== 'oxygen' && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                            💡 Plants produce oxygen as a byproduct of photosynthesis. We breathe this oxygen!
                                        </p>
                                    )}
                                </div>

                                {/* Question 2 */}
                                <div className="space-y-3">
                                    <p className="font-semibold text-lg text-slate-700 dark:text-slate-300">2. Which factor did we vary in this experiment?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'light', label: 'Light Intensity', isCorrect: true },
                                            { value: 'temperature', label: 'Temperature', isCorrect: false },
                                            { value: 'water', label: 'Amount of Water', isCorrect: false },
                                        ].map((option) => (
                                            <motion.button
                                                key={option.value}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => !quizSubmitted && setSelectedAnswer2(option.value)}
                                                disabled={quizSubmitted}
                                                className={cn(
                                                    "w-full text-left p-4 rounded-xl border-2 transition-all shadow-sm",
                                                    selectedAnswer2 === option.value && !quizSubmitted && "border-purple-500 bg-purple-50 dark:bg-purple-950/20 shadow-md",
                                                    selectedAnswer2 !== option.value && !quizSubmitted && "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md",
                                                    quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizSubmitted && !option.isCorrect && selectedAnswer2 === option.value && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizSubmitted && !option.isCorrect && selectedAnswer2 !== option.value && "opacity-50",
                                                    "text-slate-700 dark:text-slate-300"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm sm:text-base font-medium">{option.label}</span>
                                                    {quizSubmitted && option.isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    {quizSubmitted && !option.isCorrect && selectedAnswer2 === option.value && <XCircle className="h-5 w-5 text-red-600" />}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                    {quizSubmitted && selectedAnswer2 !== 'light' && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                            💡 We changed the light intensity (low, medium, high) to see how it affects photosynthesis rate.
                                        </p>
                                    )}
                                </div>

                                {/* Question 3 */}
                                <div className="space-y-3">
                                    <p className="font-semibold text-lg text-slate-700 dark:text-slate-300">3. As light intensity increases, the rate of photosynthesis:</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'increases', label: 'Increases (more oxygen bubbles)', isCorrect: true },
                                            { value: 'decreases', label: 'Decreases (fewer oxygen bubbles)', isCorrect: false },
                                            { value: 'stays-same', label: 'Stays the same', isCorrect: false },
                                        ].map((option) => (
                                            <motion.button
                                                key={option.value}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => !quizSubmitted && setSelectedAnswer3(option.value)}
                                                disabled={quizSubmitted}
                                                className={cn(
                                                    "w-full text-left p-4 rounded-xl border-2 transition-all shadow-sm",
                                                    selectedAnswer3 === option.value && !quizSubmitted && "border-purple-500 bg-purple-50 dark:bg-purple-950/20 shadow-md",
                                                    selectedAnswer3 !== option.value && !quizSubmitted && "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md",
                                                    quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizSubmitted && !option.isCorrect && selectedAnswer3 === option.value && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizSubmitted && !option.isCorrect && selectedAnswer3 !== option.value && "opacity-50",
                                                    "text-slate-700 dark:text-slate-300"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm sm:text-base font-medium">{option.label}</span>
                                                    {quizSubmitted && option.isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    {quizSubmitted && !option.isCorrect && selectedAnswer3 === option.value && <XCircle className="h-5 w-5 text-red-600" />}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                    {quizSubmitted && selectedAnswer3 !== 'increases' && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                            💡 More light = more energy = faster photosynthesis = more oxygen bubbles produced!
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
                            <CardFooter className="relative z-10 flex flex-col gap-3 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/30 dark:to-indigo-950/30 border-t border-purple-200/50 dark:border-purple-800/50">
                                {!quizSubmitted && (
                                    <Button 
                                        onClick={handleQuizSubmit}
                                        disabled={!selectedAnswer1 || !selectedAnswer2 || !selectedAnswer3}
                                        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                                        size="lg"
                                    >
                                        Submit Quiz
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
                {/* Lab Complete Section */}
                {currentStep === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative z-10"
                    >
                        <Card className="border-2 border-green-400/50 dark:border-green-600/50 bg-gradient-to-br from-green-50/90 via-emerald-50/90 to-teal-50/90 dark:from-green-950/40 dark:via-emerald-950/40 dark:to-teal-950/40 backdrop-blur-sm shadow-2xl">
                            <CardContent className="p-8">
                                <div className="text-center space-y-6">
                                {/* Animated Trophy */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="flex justify-center"
                                >
                                    <Trophy className="h-24 w-24 text-yellow-500 drop-shadow-lg" />
                                </motion.div>

                                {/* Title */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent"
                                >
                                    Lab Complete! 🎉
                                </motion.h2>

                                {/* XP Display */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 px-6 py-3 rounded-full border-2 border-yellow-300 dark:border-yellow-700 shadow-lg"
                                >
                                    <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                    <span className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                                        +{xpEarned} XP Earned!
                                    </span>
                                </motion.div>

                                {/* What You've Learned */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border-2 border-green-200/50 dark:border-green-800/50 shadow-lg"
                                >
                                    <h3 className="font-semibold text-lg mb-4 text-slate-700 dark:text-slate-300">What You've Learned:</h3>
                                    <ul className="space-y-2 text-left text-slate-600 dark:text-slate-400">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span>How light intensity affects the rate of photosynthesis</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span>That oxygen (O₂) is produced as a byproduct of photosynthesis</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span>The relationship between light energy and oxygen production</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span>Why plants are essential for life on Earth</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span>How to measure photosynthesis rate using bubble counting</span>
                                        </li>
                                    </ul>
                                </motion.div>

                                {/* Restart Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Button
                                        onClick={handleRestart}
                                        className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                                        size="lg"
                                    >
                                        <RefreshCw className="mr-2 h-5 w-5" />
                                        Restart Lab
                                    </Button>
                                </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>

            {showCelebration && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                >
                    <div className="text-6xl">🌱✨</div>
                </motion.div>
            )}
        </div>
    );
}

