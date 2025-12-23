'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Thermometer, Sprout, BookOpen, Shield, Sparkles, Droplet, RefreshCw } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';

// Simple SVG for seeds
const SeedIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M50 80C30 80 20 60 30 40C40 20 60 20 70 40C80 60 70 80 50 80Z" fill="currentColor" />
    </svg>
);

type Step = 'intro' | 'collect-supplies' | 'setup' | 'observing' | 'results' | 'quiz' | 'complete';

export function RespirationLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [observationProgress, setObservationProgress] = React.useState(0);
    const [temperatureA, setTemperatureA] = React.useState(50);
    const [limewaterA, setLimewaterA] = React.useState(0); // 0 = clear, 100 = milky
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Supplies tracking
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [flaskACollected, setFlaskACollected] = React.useState(false);
    const [flaskBCollected, setFlaskBCollected] = React.useState(false);
    const [thermometerCollected, setThermometerCollected] = React.useState(false);
    const [limewaterCollected, setLimewaterCollected] = React.useState(false);
    
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
    const labId = 'respiration';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    // Show intro message on mount
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Respiration Lab! Today we'll discover that living organisms breathe at the cellular level. We'll observe germinating seeds to detect two key products of respiration: heat energy and carbon dioxide gas. Ready to see life at work?");
        }
    }, [currentStep]);

    // Observation animation
    React.useEffect(() => {
        if (currentStep === 'observing') {
            const interval = setInterval(() => {
                setObservationProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        handleObservationComplete();
                        return 100;
                    }
                    
                    // Animate temperature rise
                    if (prev > 20) {
                        setTemperatureA(prevTemp => Math.min(80, prevTemp + 1));
                    }
                    
                    // Animate limewater turning milky
                    if (prev > 50) {
                        setLimewaterA(prevLime => Math.min(100, prevLime + 2));
                    }
                    
                    return prev + 1;
                });
            }, 50);
            
            return () => clearInterval(interval);
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setTeacherMessage("Great! Let's begin. First, we need to collect our supplies. Start by clicking on FLASK A with germinating seeds - these are living, growing seeds that are actively respiring!");
        setPendingTransition(() => () => {
            setCurrentStep('collect-supplies');
        });
    };
    
    const handleCollectFlaskA = () => {
        if (!flaskACollected) {
            setFlaskACollected(true);
            setTeacherMessage("Perfect! Now click on FLASK B with boiled seeds - these are dead seeds that serve as our control group to compare.");
            toast({ title: '✅ Flask A Collected - Living Seeds' });
        }
    };
    
    const handleCollectFlaskB = () => {
        if (flaskACollected && !flaskBCollected) {
            setFlaskBCollected(true);
            setTeacherMessage("Excellent! Now click on the THERMOMETER - we'll use this to detect heat energy produced by respiration.");
            toast({ title: '✅ Flask B Collected - Dead Seeds' });
        }
    };
    
    const handleCollectThermometer = () => {
        if (flaskBCollected && !thermometerCollected) {
            setThermometerCollected(true);
            setTeacherMessage("Great! Finally, click on the LIMEWATER tubes - limewater turns milky when carbon dioxide gas is present, proving respiration is occurring!");
            toast({ title: '✅ Thermometer Collected' });
        }
    };
    
    const handleCollectLimewater = () => {
        if (thermometerCollected && !limewaterCollected) {
            setLimewaterCollected(true);
            setShowSupplies(false);
            setTeacherMessage("Perfect! All supplies collected! Now let's set up the experiment and begin our 24-hour observation.");
            toast({ title: '✅ All Supplies Collected!' });
            setPendingTransition(() => () => {
                setCurrentStep('setup');
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

    const handleBeginObservation = () => {
        setTeacherMessage("Observation starting! We're monitoring both flasks over 24 hours (simulated as a few seconds here). Watch closely for changes in temperature and limewater color. Living seeds need energy to grow, so they respire!");
        setPendingTransition(() => () => {
            setCurrentStep('observing');
            setObservationProgress(0);
            setTemperatureA(50);
            setLimewaterA(0);
        });
    };

    const handleObservationComplete = () => {
        setTeacherMessage("Observation complete! Look at the results: Flask A (germinating seeds) shows temperature rise and milky limewater - clear evidence of respiration! Flask B (boiled seeds) shows NO changes - dead seeds don't respire. This proves that respiration is a life process!");
        setPendingTransition(() => () => {
            setCurrentStep('results');
        });
    };

    const handleProceedToQuiz = () => {
        setTeacherMessage("Excellent observations! Now let's test your understanding of cellular respiration. Think about what we saw: heat production, carbon dioxide release, and the difference between living and dead seeds.");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
            setTimeout(() => {
                document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });
    };

    const handleQuizSubmit = () => {
        const correct1 = selectedAnswer1 === 'flask-a';
        const correct2 = selectedAnswer2 === 'co2';
        const correct3 = selectedAnswer3 === 'energy';
        
        const correctCount = [correct1, correct2, correct3].filter(Boolean).length;
        const score = Math.round((correctCount / 3) * 100);
        
        setQuizSubmitted(true);
        
        if (correctCount === 3) {
            setQuizFeedback("🎉 Perfect! You understand cellular respiration completely! You know which seeds respire, what gas is produced, and why they release heat.");
            
            // Calculate XP (100 for first completion, 75 for subsequent)
            const earnedXP = completion ? 75 : 100;
            setXpEarned(earnedXP);
            
            // Mark lab as complete
            markLabComplete(labId, score, observationProgress * 50);
            
            // Show celebration
            setShowCelebration(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            
            // 3-tier feedback: Perfect score
            setTeacherMessage(`Outstanding! Perfect score! 🎉 You've completely mastered cellular respiration! Here's what you discovered: (1) FLASK A (germinating seeds) showed BOTH heat production and milky limewater - these are the two key products of respiration! Living seeds respire to release energy for growth. Flask B (boiled seeds) showed NO changes because boiling KILLED the seeds - dead cells cannot respire. (2) CARBON DIOXIDE (CO₂) is the gas that turned limewater milky. This is the waste product of respiration. The chemical test: Ca(OH)₂ + CO₂ → CaCO₃ (white precipitate) + H₂O. (3) Seeds release HEAT ENERGY during respiration because breaking down glucose releases energy in two forms: ATP (for cell work) and HEAT (thermal energy). The equation: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ENERGY (ATP + Heat). Germinating seeds use stored starch, convert it to glucose, and respire aerobically to fuel rapid cell division and growth. Temperature rose from 50°F to 80°F in Flask A! This same process happens in YOUR cells right now - you're respiring to power your muscles, brain, and heart. Every breath you take provides oxygen for respiration. Excellent work! +${earnedXP} XP earned!`);
            setPendingTransition(() => () => {
                setCurrentStep('complete');
            });
        } else if (correctCount === 2) {
            // Good effort - 2 out of 3 correct
            setQuizFeedback(`Good effort! You got ${correctCount} out of 3 correct. Review the experiment results and try again!`);
            setTeacherMessage(`Good try! You got 2 out of 3 correct. Let me clarify the key concepts of cellular respiration: (1) FLASK A with GERMINATING (living) seeds showed changes - temperature increased and limewater turned milky. Flask B with BOILED (dead) seeds showed NO changes. Why? Living cells respire, dead cells don't! Boiling denatures enzymes and kills cells. (2) The gas produced is CARBON DIOXIDE (CO₂). This is why limewater turned milky - CO₂ reacts with calcium hydroxide to form calcium carbonate (white precipitate). It's a classic chemical test for CO₂! (3) Seeds release HEAT because respiration breaks chemical bonds in glucose, releasing ENERGY. Some energy becomes ATP (used by cells), and some becomes HEAT (thermal energy) that we can measure with a thermometer. Think about what you observed: Flask A got warmer (heat production) and limewater turned white (CO₂ detection). These are the TWO key signs of respiration. Review the results and try again!`);
        } else {
            // Needs work - 0 or 1 correct
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Think about which flask had living seeds and what changes occurred. Try again!`);
            setTeacherMessage(`Keep trying! You got ${correctCount} answer${correctCount === 1 ? '' : 's'} correct. Let me explain cellular respiration from the beginning: RESPIRATION is how ALL living things (plants, animals, bacteria) release ENERGY from food. It's the opposite of photosynthesis! The equation: C₆H₁₂O₆ (glucose) + 6O₂ (oxygen) → 6CO₂ (carbon dioxide) + 6H₂O (water) + ENERGY (ATP + Heat). In our experiment: FLASK A had GERMINATING SEEDS - these are LIVING, growing seeds. They need energy to grow, so they respire actively. We saw TWO changes: (a) Temperature INCREASED from 50°F to 80°F - that's HEAT energy being released! (b) Limewater turned MILKY WHITE - that's CO₂ gas being produced! FLASK B had BOILED SEEDS - these are DEAD seeds. Boiling killed all the cells. Dead cells CANNOT respire, so we saw NO temperature change and NO milky limewater. This proves respiration is a LIFE PROCESS! Key points to remember: (1) Living seeds (Flask A) respire; dead seeds (Flask B) don't. (2) CO₂ is the gas produced - it turns limewater milky. (3) HEAT energy is released - that's why temperature rises. Germinating seeds use stored food (starch), break it down through respiration, and use the energy to grow roots and shoots. Review the experiment carefully and look at Flask A vs Flask B. What differences did you see? Try the quiz again!`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setObservationProgress(0);
        setTemperatureA(50);
        setLimewaterA(0);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setXpEarned(0);
        setShowCelebration(false);
        setShowSupplies(true);
        setFlaskACollected(false);
        setFlaskBCollected(false);
        setThermometerCollected(false);
        setLimewaterCollected(false);
        setPendingTransition(null);
        setTeacherMessage("Welcome back! Ready to explore cellular respiration again? Let's observe how living seeds release energy through respiration!");
    };

    return (
        <div className="space-y-6 pb-20">
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
                emotion={currentStep === 'complete' ? 'celebrating' : observationProgress > 50 ? 'happy' : 'explaining'}
                context={{
                    attempts: observationProgress,
                    correctStreak: observationProgress
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
                                Score: {completion?.score}% | XP Earned: {completion?.xpEarned} | Time: {Math.round((completion?.timeSpent || 0) / 1000)}s
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>🌱 Respiration Lab - Detecting Life's Energy</CardTitle>
                    <CardDescription>Observe how germinating seeds release heat and carbon dioxide during cellular respiration.</CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lab Information</CardTitle>
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
                                <p><strong>Cellular Respiration</strong> is the process by which living organisms convert biochemical energy from nutrients (like glucose) into ATP (adenosine triphosphate), the energy currency of cells.</p>
                                <p className="text-center font-mono text-sm bg-muted p-2 rounded my-2">
                                    C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy (Heat + ATP)
                                </p>
                                <p><strong>Key Products:</strong></p>
                                <ul className="list-disc pl-5 space-y-1 mt-2">
                                    <li><strong>Heat:</strong> Released as thermal energy - we can detect this with a thermometer</li>
                                    <li><strong>Carbon Dioxide (CO₂):</strong> A waste gas that turns limewater (calcium hydroxide) milky white</li>
                                    <li><strong>Water (H₂O):</strong> Released as a byproduct</li>
                                    <li><strong>ATP Energy:</strong> Used by cells for growth, movement, and other life processes</li>
                                </ul>
                                <p className="mt-2"><strong>Germinating Seeds:</strong> When seeds begin to grow, they need lots of energy. They use stored food (starch/glucose) and oxygen to produce ATP through respiration. This is why germinating seeds are perfect for observing respiration!</p>
                                <p className="mt-2"><strong>Control Experiment:</strong> We use boiled (dead) seeds as a control. Boiling kills the seeds, stopping all life processes including respiration. No respiration = no heat, no CO₂.</p>
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
                                    <li>Ensure flasks are properly sealed to prevent contamination and accurate results.</li>
                                    <li>Handle limewater (calcium hydroxide solution) with care - it can irritate skin and eyes. Wear gloves and goggles.</li>
                                    <li>Use sterilized equipment to prevent unwanted microbial growth.</li>
                                    <li>Handle thermometers carefully to prevent breakage and mercury exposure (if using mercury thermometers).</li>
                                    <li>When boiling seeds, use proper heat-resistant glassware and tongs.</li>
                                    <li>Allow boiled seeds to cool before handling.</li>
                                    <li>Dispose of limewater properly - do not pour down the drain without neutralization.</li>
                                    <li>Work in a well-ventilated area.</li>
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
                                <CardTitle>Welcome to the Respiration Lab!</CardTitle>
                                <CardDescription>Discover how living organisms release energy from food</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-6 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                                    <div className="flex items-start gap-4">
                                        <Thermometer className="w-16 h-16 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-orange-900 dark:text-orange-100">What We'll Discover:</h3>
                                            <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
                                                <li>• How living seeds produce heat energy through respiration</li>
                                                <li>• Detection of carbon dioxide gas using limewater test</li>
                                                <li>• Comparison between living (germinating) and dead (boiled) seeds</li>
                                                <li>• Why respiration is essential for all living organisms</li>
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
                                <CardDescription>Click on each item in order to collect them for the experiment</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-6 justify-center flex-wrap">
                                    {/* Flask A - Germinating Seeds */}
                                    {!flaskACollected && (
                                        <motion.div
                                            onClick={handleCollectFlaskA}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-green-300 dark:border-green-700 hover:border-green-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="relative w-20 h-24">
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-100 dark:to-green-900/30 rounded-lg border-2 border-green-400" />
                                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                                        <Sprout className="h-4 w-4 text-green-600" />
                                                        <Sprout className="h-4 w-4 text-green-600" />
                                                    </div>
                                                </div>
                                                <span className="text-sm font-medium">Flask A</span>
                                                <span className="text-xs text-green-600 font-medium">Germinating Seeds</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Flask B - Boiled Seeds */}
                                    {flaskACollected && !flaskBCollected && (
                                        <motion.div
                                            onClick={handleCollectFlaskB}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-gray-300 dark:border-gray-700 hover:border-gray-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="relative w-20 h-24">
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100 dark:to-gray-900/30 rounded-lg border-2 border-gray-400" />
                                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                                        <SeedIcon className="h-4 w-4 text-gray-600" />
                                                        <SeedIcon className="h-4 w-4 text-gray-600" />
                                                    </div>
                                                </div>
                                                <span className="text-sm font-medium">Flask B</span>
                                                <span className="text-xs text-gray-600 font-medium">Boiled Seeds (Control)</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Thermometer */}
                                    {flaskBCollected && !thermometerCollected && (
                                        <motion.div
                                            onClick={handleCollectThermometer}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-red-300 dark:border-red-700 hover:border-red-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Thermometer className="h-20 w-20 text-red-600" />
                                                <span className="text-sm font-medium">Thermometer</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Limewater */}
                                    {thermometerCollected && !limewaterCollected && (
                                        <motion.div
                                            onClick={handleCollectLimewater}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="flex gap-2">
                                                    <Droplet className="h-20 w-20 text-blue-400" />
                                                    <Droplet className="h-20 w-20 text-blue-400" />
                                                </div>
                                                <span className="text-sm font-medium">Limewater Tubes</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Collected Items Display */}
                                    <div className="w-full mt-4 flex gap-4 justify-center flex-wrap">
                                        {flaskACollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <span className="text-sm">Flask A Collected</span>
                                            </motion.div>
                                        )}
                                        {flaskBCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-gray-600" />
                                                <span className="text-sm">Flask B Collected</span>
                                            </motion.div>
                                        )}
                                        {thermometerCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-red-100 dark:bg-red-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-red-600" />
                                                <span className="text-sm">Thermometer Collected</span>
                                            </motion.div>
                                        )}
                                        {limewaterCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm">Limewater Collected</span>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'setup' && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Step 1: Experimental Setup</CardTitle>
                                <CardDescription>Two flasks with different seed conditions for comparison</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="p-6 rounded-lg border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <Sprout className="h-8 w-8 text-green-600 dark:text-green-400" />
                                            <h3 className="font-semibold text-lg">Flask A: Germinating Seeds</h3>
                                        </div>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span><strong>Living seeds</strong> - actively growing</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Thermometer to measure heat</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Connected to limewater tube</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span><strong>Expected:</strong> Respiration occurs!</span>
                                            </li>
                                        </ul>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="p-6 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/20"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <SeedIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                                            <h3 className="font-semibold text-lg">Flask B: Boiled Seeds</h3>
                                        </div>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-start gap-2">
                                                <XCircle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                                                <span><strong>Dead seeds</strong> - killed by boiling</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <XCircle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                                                <span>Thermometer to measure heat</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <XCircle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                                                <span>Connected to limewater tube</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <XCircle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                                                <span><strong>Expected:</strong> No respiration (control)</span>
                                            </li>
                                        </ul>
                                    </motion.div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleBeginObservation} className="w-full" size="lg">
                                    Begin Observation (24 hours)
                                </Button>
                            </CardFooter>
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
                                <CardTitle>Step 2: Observation & Results</CardTitle>
                                <CardDescription>Monitoring changes in temperature and limewater color</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Flask A - Germinating Seeds */}
                                    <div className="p-4 rounded-lg border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20">
                                        <h3 className="font-semibold text-center mb-4 text-green-900 dark:text-green-100">
                                            Flask A: Germinating Seeds
                                        </h3>
                                        <div className="relative h-64 flex justify-center items-center">
                                            {/* Thermometer */}
                                            <div className="absolute left-4 top-0 h-48 w-6 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-gray-400 overflow-hidden">
                                                <motion.div 
                                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-600 to-red-400 rounded-b-full"
                                                    initial={{ height: '50%' }}
                                                    animate={{ height: `${temperatureA}%` }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-800 dark:text-gray-200">
                                                    {Math.round(20 + (temperatureA - 50) * 0.6)}°C
                                                </div>
                                            </div>

                                            {/* Flask with seeds */}
                                            <motion.div 
                                                className="relative w-32 h-48"
                                                animate={{ scale: [1, 1.02, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <div className="absolute bottom-0 w-full h-24 bg-gradient-to-b from-transparent to-gray-300 dark:to-gray-700 rounded-full border-2 border-gray-400" />
                                                <div className="absolute bottom-16 w-full h-16 bg-gradient-to-b from-transparent to-gray-300 dark:to-gray-700" 
                                                     style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)' }} />
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 grid grid-cols-2 gap-1">
                                                    <Sprout className="w-6 h-6 text-green-600 dark:text-green-400" />
                                                    <SeedIcon className="w-5 h-5 text-amber-700" />
                                                    <SeedIcon className="w-5 h-5 text-amber-700" />
                                                    <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                </div>
                                            </motion.div>

                                            {/* Limewater tube */}
                                            <div className="absolute right-4 bottom-0 w-16 h-24 bg-gray-200 dark:bg-gray-700 rounded-t-lg border-2 border-gray-400 p-2 overflow-hidden">
                                                <motion.div 
                                                    className="w-full h-full rounded-md"
                                                    initial={{ backgroundColor: 'rgba(191, 219, 254, 0.5)' }}
                                                    animate={{ 
                                                        backgroundColor: limewaterA > 50 
                                                            ? 'rgba(255, 255, 255, 0.9)' 
                                                            : 'rgba(191, 219, 254, 0.5)' 
                                                    }}
                                                    transition={{ duration: 1 }}
                                                />
                                                <p className="text-[10px] text-center mt-1 font-medium">Limewater</p>
                                            </div>
                                        </div>

                                        {currentStep === 'results' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-4 p-3 bg-green-100 dark:bg-green-900/40 rounded-lg"
                                            >
                                                <p className="text-sm font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4" />
                                                    Respiration Detected!
                                                </p>
                                                <ul className="text-xs mt-2 space-y-1 text-green-800 dark:text-green-200">
                                                    <li>• Temperature rose from 20°C to 38°C</li>
                                                    <li>• Limewater turned milky white</li>
                                                    <li>• Proves: Heat + CO₂ produced</li>
                                                </ul>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Flask B - Boiled Seeds */}
                                    <div className="p-4 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/20">
                                        <h3 className="font-semibold text-center mb-4 text-gray-900 dark:text-gray-100">
                                            Flask B: Boiled Seeds (Control)
                                        </h3>
                                        <div className="relative h-64 flex justify-center items-center">
                                            {/* Thermometer - no change */}
                                            <div className="absolute left-4 top-0 h-48 w-6 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-gray-400 overflow-hidden">
                                                <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-red-600 to-red-400 rounded-b-full" />
                                                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-800 dark:text-gray-200">
                                                    20°C
                                                </div>
                                            </div>

                                            {/* Flask with dead seeds */}
                                            <div className="relative w-32 h-48">
                                                <div className="absolute bottom-0 w-full h-24 bg-gradient-to-b from-transparent to-gray-300 dark:to-gray-700 rounded-full border-2 border-gray-400" />
                                                <div className="absolute bottom-16 w-full h-16 bg-gradient-to-b from-transparent to-gray-300 dark:to-gray-700" 
                                                     style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)' }} />
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 grid grid-cols-2 gap-1 opacity-60">
                                                    <SeedIcon className="w-5 h-5 text-gray-600" />
                                                    <SeedIcon className="w-5 h-5 text-gray-600" />
                                                    <SeedIcon className="w-5 h-5 text-gray-600" />
                                                    <SeedIcon className="w-5 h-5 text-gray-600" />
                                                </div>
                                            </div>

                                            {/* Limewater tube - stays clear */}
                                            <div className="absolute right-4 bottom-0 w-16 h-24 bg-gray-200 dark:bg-gray-700 rounded-t-lg border-2 border-gray-400 p-2 overflow-hidden">
                                                <div className="w-full h-full rounded-md bg-blue-200/50 dark:bg-blue-900/30" />
                                                <p className="text-[10px] text-center mt-1 font-medium">Limewater</p>
                                            </div>
                                        </div>

                                        {currentStep === 'results' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-4 p-3 bg-gray-100 dark:bg-gray-900/40 rounded-lg"
                                            >
                                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                                    <XCircle className="h-4 w-4" />
                                                    No Changes Observed
                                                </p>
                                                <ul className="text-xs mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                                                    <li>• Temperature stayed at 20°C</li>
                                                    <li>• Limewater remained clear</li>
                                                    <li>• Proves: Dead seeds don't respire</li>
                                                </ul>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {currentStep === 'observing' && (
                                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <p className="text-sm text-center mb-2 font-medium">Observation in Progress...</p>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                            <motion.div 
                                                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${observationProgress}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                        <p className="text-xs text-center mt-2 text-muted-foreground">
                                            {observationProgress}% complete (24 virtual hours)
                                        </p>
                                    </div>
                                )}

                                {currentStep === 'results' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
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
                                    <p className="font-medium">1. Which flask showed signs of respiration?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'flask-a', label: 'Flask A (Germinating seeds)', isCorrect: true },
                                            { value: 'flask-b', label: 'Flask B (Boiled seeds)', isCorrect: false },
                                            { value: 'both', label: 'Both flasks', isCorrect: false },
                                            { value: 'neither', label: 'Neither flask', isCorrect: false },
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
                                    {quizSubmitted && selectedAnswer1 !== 'flask-a' && (
                                        <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                                            💡 Only living (germinating) seeds respire. Boiled seeds are dead and cannot carry out respiration.
                                        </p>
                                    )}
                                </div>

                                {/* Question 2 */}
                                <div className="space-y-3">
                                    <p className="font-medium">2. What gas turned the limewater milky?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'oxygen', label: 'Oxygen (O₂)', isCorrect: false },
                                            { value: 'co2', label: 'Carbon Dioxide (CO₂)', isCorrect: true },
                                            { value: 'nitrogen', label: 'Nitrogen (N₂)', isCorrect: false },
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
                                    {quizSubmitted && selectedAnswer2 !== 'co2' && (
                                        <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                                            💡 Carbon dioxide is a waste product of respiration. The limewater test (CO₂ + Ca(OH)₂ → CaCO₃) produces milky white calcium carbonate.
                                        </p>
                                    )}
                                </div>

                                {/* Question 3 */}
                                <div className="space-y-3">
                                    <p className="font-medium">3. Why did the temperature rise in Flask A?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'sunlight', label: 'Sunlight heating the flask', isCorrect: false },
                                            { value: 'energy', label: 'Heat energy released during respiration', isCorrect: true },
                                            { value: 'chemical', label: 'Chemical reaction with limewater', isCorrect: false },
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
                                    {quizSubmitted && selectedAnswer3 !== 'energy' && (
                                        <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                                            💡 Respiration releases energy in two forms: ATP (for cell work) and heat (thermal energy we can measure with a thermometer).
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
                                        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-2 border-orange-500 rounded-lg p-6 text-center mb-3">
                                            <Sparkles className="h-12 w-12 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
                                            <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100 mb-2">
                                                Lab Complete! 🎉
                                            </h3>
                                            <p className="text-orange-700 dark:text-orange-300 mb-3">
                                                You've mastered cellular respiration and earned <strong>{xpEarned} XP</strong>!
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                You now understand how living organisms release energy from food through respiration.
                                            </p>
                                        </div>
                                        <Button onClick={handleRestart} variant="outline" className="w-full">
                                            Restart Experiment
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
                    <div className="text-6xl">🌱🔥</div>
                </motion.div>
            )}
        </div>
    );
}
