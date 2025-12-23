'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Lightbulb, BookOpen, Shield, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';

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

type Step = 'intro' | 'setup' | 'place-plant' | 'select-intensity' | 'running' | 'observe' | 'quiz' | 'complete';

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
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [plantCollected, setPlantCollected] = React.useState(false);
    const [beakerCollected, setBeakerCollected] = React.useState(false);
    const [lightCollected, setLightCollected] = React.useState(false);
    const [plantPlaced, setPlantPlaced] = React.useState(false);
    
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

    // Observation timer
    React.useEffect(() => {
        if (currentStep === 'running') {
            const interval = setInterval(() => {
                setObservationTime(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        handleObservationComplete();
                        return 100;
                    }
                    return prev + 2;
                });
            }, 100);
            return () => clearInterval(interval);
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setTeacherMessage("Great! Let's begin. First, collect the supplies from the drawer. Start by clicking on the AQUATIC PLANT - our green friend that will show us photosynthesis in action!");
        setPendingTransition(() => () => {
            setCurrentStep('setup');
        });
    };
    
    const handleCollectPlant = () => {
        if (!plantCollected) {
            setPlantCollected(true);
            setTeacherMessage("Perfect! Now click on the BEAKER filled with water - our plant needs a home to perform photosynthesis.");
            toast({ title: '✅ Aquatic Plant Collected' });
        }
    };
    
    const handleCollectBeaker = () => {
        if (plantCollected && !beakerCollected) {
            setBeakerCollected(true);
            setTeacherMessage("Excellent! Now click on a LIGHT SOURCE - this is the energy that powers photosynthesis. Choose the intensity you want to test!");
            toast({ title: '✅ Beaker Collected' });
        }
    };
    
    const handleCollectLight = (intensity: 'low' | 'medium' | 'high') => {
        if (beakerCollected && !lightCollected) {
            setLightCollected(true);
            setLightIntensity(intensity);
            setShowSupplies(false);
            setTeacherMessage(`Great choice! ${intensity === 'high' ? 'Bright sunlight' : intensity === 'medium' ? 'Partial sunlight' : 'Cloudy conditions'} - now click on the beaker to place your plant inside and start the experiment!`);
            toast({ title: `✅ ${intensity.charAt(0).toUpperCase() + intensity.slice(1)} Intensity Light Collected` });
            setPendingTransition(() => () => {
                setCurrentStep('place-plant');
            });
        }
    };
    
    const handlePlacePlant = () => {
        if (lightCollected && !plantPlaced) {
            setPlantPlaced(true);
            setTeacherMessage("Perfect setup! The plant is now in the water with light shining on it. Let's observe the oxygen bubbles being produced as the plant photosynthesizes!");
            toast({ title: '✅ Experiment Started!' });
            setPendingTransition(() => () => {
                setCurrentStep('running');
                setObservationTime(0);
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



    const handleObservationComplete = () => {
        const bubbleRates = {
            low: "few bubbles slowly rising",
            medium: "a steady stream of bubbles",
            high: "many bubbles rapidly rising"
        };
        
        // Mark this intensity as tested
        setTestedIntensities(prev => new Set(prev).add(lightIntensity!));
        
        const numTested = testedIntensities.size + 1; // +1 for current
        const suggestion = numTested < 2 
            ? ` Would you like to test another light intensity to compare the results? Or proceed to the quiz?` 
            : ` You can test another intensity or proceed to the quiz to test your knowledge!`;
        
        setTeacherMessage(`Observation complete! At ${lightIntensity} intensity, we saw ${bubbleRates[lightIntensity!]}. This shows us that light intensity directly affects the rate of photosynthesis. More light = more energy = more oxygen produced!${suggestion}`);
        setPendingTransition(() => () => {
            setCurrentStep('observe');
        });
    };

    const handleProceedToQuiz = () => {
        setTeacherMessage("Time to test what you've learned! Answer these questions about photosynthesis and light intensity. Think carefully about what we observed!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
            setTimeout(() => {
                document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });
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
            
            setTeacherMessage(`Congratulations! You've completed the Photosynthesis Lab with a perfect score! You earned ${earnedXP} XP. You now understand how plants use light energy to produce oxygen through photosynthesis. This process is essential for all life on Earth!`);
            setPendingTransition(() => () => {
                setCurrentStep('complete');
            });
        } else if (correctCount === 2) {
            setQuizFeedback(`Good effort! You got ${correctCount} out of 3 correct. Review the feedback and try again to master photosynthesis!`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Don't worry! Review the experiment and try again. Think about how light helps plants make food.`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setLightIntensity(null);
        setObservationTime(0);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setXpEarned(0);
        setShowCelebration(false);
        setShowSupplies(true);
        setPlantCollected(false);
        setBeakerCollected(false);
        setLightCollected(false);
        setPlantPlaced(false);
        setPendingTransition(null);
        setTestedIntensities(new Set());
        setTeacherMessage("Welcome back! Ready to explore photosynthesis again? Let's discover more about how plants use light to make food!");
    };

    const numBubbles = lightIntensity === 'low' ? 3 : lightIntensity === 'medium' ? 6 : 12;
    const bubbleSpeed = lightIntensity === 'low' ? 3 : lightIntensity === 'medium' ? 2 : 1.5;

    return (
        <div className="space-y-6 pb-20">
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
                onComplete={handleTeacherComplete}
            />

            {isCompleted && (
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

            <Card>
                <CardHeader>
                    <CardTitle>🌱 Photosynthesis Lab - Light & Oxygen Production</CardTitle>
                    <CardDescription>Discover how light intensity affects the rate of oxygen production during photosynthesis in aquatic plants.</CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lab Information</CardTitle>
                    <CardDescription>Background theory and safety tips for this experiment.</CardDescription>
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
                        <AccordionItem value="item-2">
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
                                <CardTitle>Welcome to the Photosynthesis Lab!</CardTitle>
                                <CardDescription>Let's explore how plants convert light into life-giving oxygen</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg border-2 border-green-200 dark:border-green-800">
                                    <div className="flex items-start gap-4">
                                        <AquaticPlantIcon className="w-16 h-16 text-green-600 dark:text-green-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-green-900 dark:text-green-100">What We'll Discover:</h3>
                                            <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                                                <li>• How light intensity affects oxygen production</li>
                                                <li>• The role of light energy in photosynthesis</li>
                                                <li>• Why plants are essential for life on Earth</li>
                                                <li>• How to measure photosynthesis rate using bubbles</li>
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

                {(currentStep === 'setup' || currentStep === 'place-plant') && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-green-200 dark:border-green-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AquaticPlantIcon className="h-5 w-5 text-green-600" />
                                    Interactive Experiment - Collect & Place Items
                                </CardTitle>
                                <CardDescription>Follow the teacher's instructions and click on supplies to use them</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Experiment Area with Beaker */}
                                <div className="relative min-h-[400px] bg-gradient-to-b from-sky-100 to-blue-200 dark:from-sky-950/30 dark:to-blue-950/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 p-8">
                                    {/* Beaker - Clickable when plant is placed */}
                                    <motion.div
                                        onClick={currentStep === 'place-plant' ? handlePlacePlant : undefined}
                                        whileHover={currentStep === 'place-plant' ? { scale: 1.05 } : {}}
                                        className={cn(
                                            "absolute bottom-8 left-1/2 -translate-x-1/2",
                                            currentStep === 'place-plant' && "cursor-pointer"
                                        )}
                                    >
                                        <div className="relative w-40 h-56">
                                            {/* Beaker body */}
                                            <div className="absolute bottom-0 w-full h-48 bg-gradient-to-b from-blue-100/40 to-blue-200/60 dark:from-blue-900/20 dark:to-blue-800/30 rounded-b-2xl border-2 border-gray-400" 
                                                 style={{ clipPath: 'polygon(10% 0, 90% 0, 95% 100%, 5% 100%)' }} />
                                            
                                            {/* Water level */}
                                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[85%] h-40 bg-blue-300/50 dark:bg-blue-600/30 rounded-b-xl" />
                                            
                                            {/* Plant in water */}
                                            {plantPlaced && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.5, y: -20 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    className="absolute bottom-6 left-1/2 -translate-x-1/2"
                                                >
                                                    <AquaticPlantIcon className="w-20 h-20 text-green-600 dark:text-green-400" />
                                                </motion.div>
                                            )}
                                            
                                            {/* Measurement marks */}
                                            {[100, 200, 300].map((ml) => (
                                                <div key={ml} className="absolute left-2 text-xs text-gray-600" style={{ bottom: `${(ml/300)*40 + 10}px` }}>
                                                    {ml}ml
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {currentStep === 'place-plant' && !plantPlaced && (
                                            <p className="text-center mt-2 font-medium bg-green-100 dark:bg-green-900 px-3 py-2 rounded text-sm">
                                                Click Beaker to Place Plant
                                            </p>
                                        )}
                                    </motion.div>
                                    
                                    {/* Light source above beaker */}
                                    {lightCollected && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute top-4 left-1/2 -translate-x-1/2"
                                        >
                                            <Lightbulb 
                                                className={cn(
                                                    "h-16 w-16",
                                                    lightIntensity === 'low' && "text-yellow-400 opacity-40",
                                                    lightIntensity === 'medium' && "text-yellow-400 opacity-70",
                                                    lightIntensity === 'high' && "text-yellow-400"
                                                )} 
                                            />
                                            <p className="text-xs text-center mt-1 font-medium">
                                                {lightIntensity?.toUpperCase()} Intensity
                                            </p>
                                        </motion.div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        
                        {/* Lab Supplies Drawer */}
                        {showSupplies && currentStep === 'setup' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
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
                                            {/* Aquatic Plant */}
                                            {!plantCollected && (
                                                <motion.div
                                                    onClick={handleCollectPlant}
                                                    whileHover={{ scale: 1.05, y: -5 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-green-300 dark:border-green-700 hover:border-green-500 hover:shadow-xl transition-all"
                                                >
                                                    <div className="flex flex-col items-center gap-2">
                                                        <AquaticPlantIcon className="w-20 h-20 text-green-600 dark:text-green-400" />
                                                        <span className="text-sm font-medium">Aquatic Plant</span>
                                                        <span className="text-xs text-muted-foreground">Click to Collect</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                            
                                            {/* Beaker with Water */}
                                            {plantCollected && !beakerCollected && (
                                                <motion.div
                                                    onClick={handleCollectBeaker}
                                                    whileHover={{ scale: 1.05, y: -5 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 hover:shadow-xl transition-all"
                                                >
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="w-16 h-20 bg-gradient-to-b from-blue-100/40 to-blue-200/60 rounded-b-lg border-2 border-gray-400"
                                                             style={{ clipPath: 'polygon(15% 0, 85% 0, 95% 100%, 5% 100%)' }} />
                                                        <span className="text-sm font-medium">Beaker with Water</span>
                                                        <span className="text-xs text-muted-foreground">Click to Collect</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                            
                                            {/* Light Sources */}
                                            {beakerCollected && !lightCollected && (
                                                <>
                                                    <motion.div
                                                        onClick={() => handleCollectLight('low')}
                                                        whileHover={{ scale: 1.05, y: -5 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-yellow-200 dark:border-yellow-800 hover:border-yellow-400 hover:shadow-xl transition-all"
                                                    >
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Lightbulb className="h-16 w-16 text-yellow-400 opacity-40" />
                                                            <span className="text-sm font-medium">Low Light</span>
                                                            <span className="text-xs text-muted-foreground">Cloudy conditions</span>
                                                        </div>
                                                    </motion.div>
                                                    
                                                    <motion.div
                                                        onClick={() => handleCollectLight('medium')}
                                                        whileHover={{ scale: 1.05, y: -5 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-yellow-300 dark:border-yellow-700 hover:border-yellow-500 hover:shadow-xl transition-all"
                                                    >
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Lightbulb className="h-16 w-16 text-yellow-400 opacity-70" />
                                                            <span className="text-sm font-medium">Medium Light</span>
                                                            <span className="text-xs text-muted-foreground">Partial sunlight</span>
                                                        </div>
                                                    </motion.div>
                                                    
                                                    <motion.div
                                                        onClick={() => handleCollectLight('high')}
                                                        whileHover={{ scale: 1.05, y: -5 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-yellow-400 dark:border-yellow-600 hover:border-yellow-500 hover:shadow-xl transition-all"
                                                    >
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Lightbulb className="h-16 w-16 text-yellow-400" />
                                                            <span className="text-sm font-medium">Bright Light</span>
                                                            <span className="text-xs text-muted-foreground">Full sunlight</span>
                                                        </div>
                                                    </motion.div>
                                                </>
                                            )}
                                            
                                            {/* Collected Items Display */}
                                            <div className="w-full mt-4 flex gap-4 justify-center flex-wrap">
                                                {plantCollected && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="flex items-center gap-2 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full"
                                                    >
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                        <span className="text-sm">Plant Collected</span>
                                                    </motion.div>
                                                )}
                                                {beakerCollected && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full"
                                                    >
                                                        <CheckCircle className="h-4 w-4 text-blue-600" />
                                                        <span className="text-sm">Beaker Collected</span>
                                                    </motion.div>
                                                )}
                                                {lightCollected && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900 px-4 py-2 rounded-full"
                                                    >
                                                        <CheckCircle className="h-4 w-4 text-yellow-600" />
                                                        <span className="text-sm">Light Collected</span>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {(currentStep === 'running' || currentStep === 'observe') && (
                    <motion.div
                        key="running"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Step 2: Observe Oxygen Production</CardTitle>
                                <CardDescription>Watch the bubbles! Each bubble represents oxygen produced by photosynthesis.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative w-full max-w-md mx-auto h-80 bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-950/40 dark:to-blue-900/60 rounded-lg p-4 flex items-center justify-center overflow-hidden border-2 border-blue-300 dark:border-blue-700">
                                    {/* Light Source */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ 
                                            scale: 1, 
                                            opacity: 1,
                                            filter: lightIntensity === 'high' ? 'drop-shadow(0 0 20px rgba(250,204,21,0.8))' : 
                                                    lightIntensity === 'medium' ? 'drop-shadow(0 0 12px rgba(250,204,21,0.5))' :
                                                    'drop-shadow(0 0 6px rgba(250,204,21,0.3))'
                                        }}
                                        className="absolute top-4"
                                    >
                                        <Lightbulb 
                                            className={cn(
                                                "h-12 w-12 transition-all duration-500",
                                                lightIntensity === 'low' && "text-yellow-400 opacity-40",
                                                lightIntensity === 'medium' && "text-yellow-400 opacity-70",
                                                lightIntensity === 'high' && "text-yellow-300 opacity-100",
                                            )} 
                                        />
                                    </motion.div>

                                    {/* Beaker and Plant */}
                                    <motion.div 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="absolute bottom-4 h-48 w-36 border-x-4 border-b-4 border-gray-400 dark:border-gray-600 rounded-b-2xl flex items-end justify-center bg-blue-100/30 dark:bg-blue-900/20"
                                    >
                                        <motion.div
                                            animate={{ 
                                                scale: [1, 1.02, 1],
                                                rotate: [0, 1, -1, 0]
                                            }}
                                            transition={{ 
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <AquaticPlantIcon className="w-24 h-24 text-green-600 dark:text-green-400 mb-2" />
                                        </motion.div>
                                    </motion.div>
                                    
                                    {/* Bubbles */}
                                    {currentStep === 'running' && lightIntensity && Array.from({ length: numBubbles }).map((_, i) => (
                                        <Bubble key={i} delay={i * (bubbleSpeed / numBubbles)} speed={bubbleSpeed} />
                                    ))}

                                    {/* Observation Progress */}
                                    {currentStep === 'running' && (
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-2">
                                                <p className="text-xs text-center mb-1">Observing bubbles...</p>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <motion.div 
                                                        className="bg-green-500 h-2 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${observationTime}%` }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4" />
                                        Light Intensity: <span className="text-blue-600 dark:text-blue-400 uppercase">{lightIntensity}</span>
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {lightIntensity === 'low' && "Fewer bubbles = slower photosynthesis with less light energy"}
                                        {lightIntensity === 'medium' && "Moderate bubbles = good photosynthesis rate"}
                                        {lightIntensity === 'high' && "Many bubbles = rapid photosynthesis with abundant light!"}
                                    </p>
                                </div>

                                {currentStep === 'observe' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-3"
                                    >
                                        <div className="grid grid-cols-3 gap-2">
                                            {(['low', 'medium', 'high'] as const).map((intensity) => (
                                                <Button
                                                    key={intensity}
                                                    onClick={() => {
                                                        setLightIntensity(intensity);
                                                        setLightCollected(false);
                                                        setPlantPlaced(false);
                                                        setObservationTime(0);
                                                        setTeacherMessage(`Let's test ${intensity} light intensity! Watch how the bubble production changes.`);
                                                        setPendingTransition(() => () => {
                                                            setLightCollected(true);
                                                            setCurrentStep('place-plant');
                                                        });
                                                    }}
                                                    variant={testedIntensities.has(intensity) ? "secondary" : "outline"}
                                                    size="sm"
                                                    className="text-xs sm:text-sm"
                                                >
                                                    {testedIntensities.has(intensity) && '✓ '}{intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button onClick={handleProceedToQuiz} className="w-full" size="lg">
                                            Continue to Quiz
                                        </Button>
                                    </motion.div>
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Post-Lab Quiz</CardTitle>
                                <CardDescription>Test your understanding of the experiment</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. What gas is produced during photosynthesis that we observed as bubbles?</p>
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
                                    {quizSubmitted && selectedAnswer1 !== 'oxygen' && (
                                        <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                                            💡 Plants produce oxygen as a byproduct of photosynthesis. We breathe this oxygen!
                                        </p>
                                    )}
                                </div>

                                {/* Question 2 */}
                                <div className="space-y-3">
                                    <p className="font-medium">2. Which factor did we vary in this experiment?</p>
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
                                    {quizSubmitted && selectedAnswer2 !== 'light' && (
                                        <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                                            💡 We changed the light intensity (low, medium, high) to see how it affects photosynthesis rate.
                                        </p>
                                    )}
                                </div>

                                {/* Question 3 */}
                                <div className="space-y-3">
                                    <p className="font-medium">3. As light intensity increases, the rate of photosynthesis:</p>
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
                                    {quizSubmitted && selectedAnswer3 !== 'increases' && (
                                        <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
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
                            <CardFooter className="flex flex-col gap-3">
                                {!quizSubmitted && (
                                    <Button 
                                        onClick={handleQuizSubmit}
                                        disabled={!selectedAnswer1 || !selectedAnswer2 || !selectedAnswer3}
                                        className="w-full"
                                        size="lg"
                                    >
                                        Submit Quiz
                                    </Button>
                                )}
                                {currentStep === 'complete' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="w-full"
                                    >
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-500 rounded-lg p-6 text-center mb-3">
                                            <Sparkles className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
                                            <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                                                Lab Complete! 🎉
                                            </h3>
                                            <p className="text-green-700 dark:text-green-300 mb-3">
                                                You've mastered photosynthesis and earned <strong>{xpEarned} XP</strong>!
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                You now understand how plants use light to produce the oxygen we breathe.
                                            </p>
                                        </div>
                                        <Button onClick={handleRestart} variant="outline" className="w-full">
                                            Try Different Light Intensity
                                        </Button>
                                    </motion.div>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

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
