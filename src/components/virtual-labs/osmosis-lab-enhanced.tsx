'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { 
    CheckCircle, XCircle, RefreshCw, BookOpen, Shield, 
    ArrowRightLeft, Droplets, Beaker, TestTube,
    Sparkles, Trophy, Award, Eye, EyeOff, Timer, FlaskConical
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherVoice } from './TeacherVoice';
import { LabSupplies, SupplyItem } from './LabSupplies';
import { useLabProgress } from '@/stores/lab-progress-store';
import confetti from 'canvas-confetti';

type TestStep = 'intro' | 'collect-supplies' | 'select-setup' | 'observing' | 'result' | 'quiz' | 'complete';
type SetupType = 'sugar-in-water' | 'water-in-sugar' | null;

export function OsmosisLabEnhanced() {
    const { toast } = useToast();
    
    // Lab state
    const [currentStep, setCurrentStep] = React.useState<TestStep>('intro');
    const [setup, setSetup] = React.useState<SetupType>(null);
    const [osmosisProgress, setOsmosisProgress] = React.useState(0);
    const [tubingScale, setTubingScale] = React.useState(1);
    const [showArrows, setShowArrows] = React.useState(false);
    const [showSafety, setShowSafety] = React.useState(true);
    const [collectedItems, setCollectedItems] = React.useState<string[]>([]);
    const [showSupplies, setShowSupplies] = React.useState(true);
    
    // Teacher voice
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const allSuppliesNotifiedRef = React.useRef(false);
    
    // Quiz
    const [selectedAnswer1, setSelectedAnswer1] = React.useState<string | null>(null);
    const [selectedAnswer2, setSelectedAnswer2] = React.useState<string | null>(null);
    const [selectedAnswer3, setSelectedAnswer3] = React.useState<string | null>(null);
    const [quizFeedback, setQuizFeedback] = React.useState<string>('');
    const [quizSubmitted, setQuizSubmitted] = React.useState(false);
    
    // XP & Celebration
    const { markLabComplete, isLabCompleted, getLabCompletion, totalXP } = useLabProgress();
    const [xpEarned, setXpEarned] = React.useState(0);
    const [showCelebration, setShowCelebration] = React.useState(false);
    const [startTime] = React.useState(Date.now());
    const hasCompleted = isLabCompleted('osmosis');
    const labProgress = getLabCompletion('osmosis');
    
    // Osmosis progress effect - slower for better observation
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (currentStep === 'observing' && osmosisProgress < 100) {
            interval = setInterval(() => {
                setOsmosisProgress(prev => Math.min(prev + 2, 100)); // Slower: 2% per interval instead of 5%
            }, 200); // Slightly slower: 200ms instead of 150ms
        }
        return () => clearInterval(interval);
    }, [currentStep, osmosisProgress]);

    // Update tubing scale based on setup - more dramatic changes
    React.useEffect(() => {
        if (currentStep === 'observing' && setup) {
            // More dramatic scale changes: 1.0 -> 1.4 for swelling, 1.0 -> 0.6 for shrinking
            const targetScale = setup === 'sugar-in-water' ? 1.4 : 0.6;
            const startScale = 1.0;
            const duration = 3000; // 3 seconds to reach target
            const startTime = Date.now();
            
            const scaleInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease-out animation for smooth transition
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const currentScale = startScale + (targetScale - startScale) * easedProgress;
                
                setTubingScale(currentScale);
                
                if (progress >= 1) {
                    clearInterval(scaleInterval);
                }
            }, 16); // ~60fps
            
            return () => clearInterval(scaleInterval);
        } else if (currentStep === 'intro' || currentStep === 'select-setup') {
            // Reset to normal size
            setTubingScale(1.0);
        }
    }, [currentStep, setup]);

    // Show arrows when osmosis progresses
    React.useEffect(() => {
        if (osmosisProgress > 20) {
            setShowArrows(true);
        }
    }, [osmosisProgress]);

    // Complete observation when progress reaches 100
    React.useEffect(() => {
        if (osmosisProgress >= 100 && currentStep === 'observing' && setup) {
            setTimeout(() => {
                setCurrentStep('result');
                const resultMessages = {
                    'sugar-in-water': 'Excellent observation! Water moved INTO the tubing by osmosis. The tubing swelled because water went from low solute concentration (pure water outside) to high solute concentration (sugar solution inside). The dialysis membrane let water pass but not sugar molecules!',
                    'water-in-sugar': 'Great observation! Water moved OUT OF the tubing by osmosis. The tubing shrank because water went from low solute concentration (pure water inside) to high solute concentration (sugar solution outside). This is what happens to cells in a hypertonic solution!'
                };
                setTeacherMessage(resultMessages[setup]);
            }, 500);
        }
    }, [osmosisProgress, currentStep, setup]);

    // Initial intro
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage('Welcome to the Osmosis Lab! Osmosis is the movement of WATER across a semi-permeable membrane. Water always moves from where there is MORE water (low solute) to where there is LESS water (high solute). Think of it like water trying to dilute concentrated solutions! Ready to see it happen?');
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setCurrentStep('collect-supplies');
        setTeacherMessage('Before we begin, let\'s collect all the supplies we need for the osmosis experiment. Click on each item to collect it!');
    };

    const handleCollect = (itemId: string) => {
        setCollectedItems((prev) => [...prev, itemId]);
    };

    const handleAllSuppliesCollected = React.useCallback(() => {
        if (!allSuppliesNotifiedRef.current) {
            allSuppliesNotifiedRef.current = true;
            toast({
                title: "All Supplies Collected!",
                description: "Great work! You have everything you need for the experiment.",
            });
        }
        setShowSupplies(false);
        setTeacherMessage('Excellent! All supplies collected. Now choose your experimental setup. Option 1: Sugar solution INSIDE the tubing, pure water OUTSIDE. Option 2: Pure water INSIDE the tubing, sugar solution OUTSIDE. Which setup do you want to observe?');
        setCurrentStep('select-setup');
}, [toast]);

    // Define lab supplies
    const supplies: SupplyItem[] = [
        { id: 'beaker', name: 'Beaker', emoji: '🥛', description: 'Container for solutions', required: true },
        { id: 'dialysis-tubing', name: 'Dialysis Tubing', emoji: '🔬', description: 'Semi-permeable membrane', required: true },
        { id: 'sugar-solution', name: 'Sugar Solution', emoji: '🍬', description: 'High solute concentration', required: true },
        { id: 'pure-water', name: 'Pure Water', emoji: '💧', description: 'Low solute concentration', required: true },
        { id: 'clips', name: 'Tubing Clips', emoji: '📎', description: 'To seal the tubing', required: true },
        { id: 'scale', name: 'Scale', emoji: '⚖️', description: 'To measure changes', required: true },
    ];

    const handleSelectSetup = (setupType: SetupType) => {
        if (!setupType) return;
        setSetup(setupType);
        
        const messages = {
            'sugar-in-water': 'Perfect! You have sugar solution inside the tubing and pure water in the beaker. The tubing membrane is semi-permeable - water can pass through, but sugar molecules are too big. Water will move to dilute the sugar. Ready to start?',
            'water-in-sugar': 'Excellent choice! You have pure water inside the tubing and sugar solution in the beaker. The membrane lets water pass but blocks sugar. Water will move out to dilute the sugar solution outside. Ready to observe?'
        };
        
        setTeacherMessage(messages[setupType]);
    };

    const handleStartOsmosis = () => {
        if (!setup) return;
        
        setCurrentStep('observing');
        setOsmosisProgress(0);
        setShowArrows(false);
        
        const messages = {
            'sugar-in-water': 'Osmosis is happening! Watch the tubing carefully. Water molecules from the beaker are passing through the membrane into the tubing. The tubing will swell as more water enters. This is because water moves from high water concentration (pure water) to low water concentration (sugar solution).',
            'water-in-sugar': 'Osmosis is in progress! Observe the tubing. Water molecules are leaving the tubing and entering the sugar solution in the beaker. The tubing will shrink as water moves out. Water always goes where it can dilute a concentrated solution!'
        };
        
        setTeacherMessage(messages[setup]);
    };

    const handleViewQuiz = () => {
        setCurrentStep('quiz');
        setTimeout(() => {
            const quizSection = document.querySelector('[data-quiz-section]');
            quizSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleQuizSubmit = () => {
        if (quizSubmitted) return;
        
        setQuizSubmitted(true);
        
        const correctAnswers = {
            q1: 'low-to-high',
            q2: 'semi-permeable',
            q3: setup === 'sugar-in-water' ? 'swelled' : 'shrank'
        };
        
        const isCorrect1 = selectedAnswer1 === correctAnswers.q1;
        const isCorrect2 = selectedAnswer2 === correctAnswers.q2;
        const isCorrect3 = selectedAnswer3 === correctAnswers.q3;
        const correctCount = [isCorrect1, isCorrect2, isCorrect3].filter(Boolean).length;
        
        if (correctCount === 3) {
            setQuizFeedback(`Perfect! You got all 3 correct! 🎉 Excellent understanding of osmosis!`);
            setTeacherMessage(`Outstanding! Perfect score! You truly understand OSMOSIS! 🎉`);
            
            if (!hasCompleted) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                const earnedXP = markLabComplete('osmosis', 100, timeSpent);
                
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                
                setXpEarned(earnedXP);
                setShowCelebration(true);
                setTimeout(() => {
                    setCurrentStep('complete');
                }, 2000);
            } else {
                setCurrentStep('complete');
            }
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Let me clarify the concepts you missed.`);
            setTeacherMessage(`Good effort! You got 2 out of 3 correct. Review the concepts and try again!`);
            
            if (!hasCompleted) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                const earnedXP = markLabComplete('osmosis', 75, timeSpent);
                setXpEarned(earnedXP);
                setShowCelebration(true);
                setTimeout(() => {
                    setCurrentStep('complete');
                }, 2000);
            } else {
                setCurrentStep('complete');
            }
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Don't worry! Let me explain osmosis from the beginning.`);
            setTeacherMessage(`Keep trying! Review the experiment and try the quiz again!`);
            
            if (!hasCompleted) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                const earnedXP = markLabComplete('osmosis', 50, timeSpent);
                setXpEarned(earnedXP);
                setShowCelebration(true);
                setTimeout(() => {
                    setCurrentStep('complete');
                }, 2000);
            } else {
                setCurrentStep('complete');
            }
        }
    };

    const handleReset = () => {
        setCurrentStep('intro');
        setSetup(null);
        setOsmosisProgress(0);
        setTubingScale(1);
        setShowArrows(false);
        setCollectedItems([]);
        setShowSupplies(true);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setXpEarned(0);
        setShowCelebration(false);
        setTeacherMessage('Ready to observe osmosis again? You can try both setups to see water movement in different directions! Click Start Experiment when ready.');
    };

    const objectiveText = "To observe osmosis through a semi-permeable membrane using dialysis tubing, demonstrating how water moves based on solute concentration gradients.";
    const theoryText = "Osmosis is the net movement of water molecules across a selectively permeable (semi-permeable) membrane from a region of HIGHER water concentration to a region of LOWER water concentration. This can also be described as movement from LOW solute concentration to HIGH solute concentration. The membrane allows water to pass freely but blocks larger solute molecules like sugar. This process is passive (requires no energy) and continues until equilibrium is reached. Osmosis is vital for life: plant cells use it to take up water from soil, animal cells regulate water balance through osmosis, and it's how kidneys filter blood. In this lab, dialysis tubing acts as an artificial semi-permeable membrane.";
    const safetyText = "In a real laboratory: Handle glassware (beakers, test tubes) carefully to prevent breakage and cuts. Ensure dialysis tubing is properly sealed with clips or ties to prevent leaks. Wipe up any water spills immediately to prevent slipping hazards. Wash hands before and after handling materials. If using starch or other indicators, avoid contact with eyes and mouth. Always wear safety goggles when working with liquids. Dispose of solutions properly according to lab protocols.";

    return (
        <div className="space-y-6 pb-20 relative">
            {/* Premium animated background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-300/20 via-cyan-300/20 to-teal-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-teal-300/20 via-cyan-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Completion Badge */}
            {hasCompleted && labProgress && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border-2 border-blue-300 dark:border-blue-700 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full shadow-lg">
                            <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-blue-900 dark:text-blue-100">Lab Completed!</div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                                Score: {labProgress.score}% • Completed: {new Date(labProgress.completedAt || '').toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-gradient-to-r from-blue-200 to-cyan-200 text-blue-900 border-blue-300">
                        <Award className="h-3 w-3 mr-1" />
                        {labProgress.xpEarned} XP
                    </Badge>
                </motion.div>
            )}

            {/* Teacher Voice */}
            {teacherMessage && (
                <TeacherVoice 
                    message={teacherMessage}
                    onComplete={() => {}}
                    emotion={currentStep === 'result' || quizSubmitted ? 'celebrating' : osmosisProgress > 50 ? 'happy' : 'explaining'}
                    context={{
                        attempts: osmosisProgress,
                        correctStreak: quizSubmitted ? 1 : 0
                    }}
                    quickActions={[
                        {
                            label: '🔄 Reset Lab',
                            onClick: handleReset
                        },
                        {
                            label: '📖 View Theory',
                            onClick: () => {
                                const theorySection = document.querySelector('[data-theory-section]');
                                theorySection?.scrollIntoView({ behavior: 'smooth' });
                            }
                        },
                        {
                            label: '🛡️ Safety Tips',
                            onClick: () => {
                                const safetySection = document.querySelector('[data-safety-section]');
                                safetySection?.scrollIntoView({ behavior: 'smooth' });
                            }
                        }
                    ]}
                />
            )}

            {/* Premium Objective Card */}
            <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-blue-300/50 dark:border-blue-700/50 shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-cyan-400/5 to-teal-400/5"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
                <CardHeader className="relative z-10 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-950/40 dark:to-cyan-950/40 border-b border-blue-200/50 dark:border-blue-800/50">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
                        Objective
                    </CardTitle>
                    <CardDescription className="text-base mt-2">{objectiveText}</CardDescription>
                </CardHeader>
            </Card>

            {/* Premium Lab Information Card */}
            {currentStep === 'intro' && (
                <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-blue-300/50 dark:border-blue-700/50 shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-cyan-400/5 to-teal-400/5"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
                    <CardHeader className="relative z-10 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-950/40 dark:to-cyan-950/40 border-b border-blue-200/50 dark:border-blue-800/50">
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
                            Lab Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 pt-6">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1" data-theory-section className="border-2 border-blue-200/30 dark:border-blue-800/30 rounded-xl mb-3 px-4">
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                                            <BookOpen className="h-5 w-5 text-white" />
                                        </div>
                                        <span className="font-semibold text-blue-900 dark:text-blue-100">Background Theory</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground pt-4">
                                    <p>{theoryText}</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" data-safety-section className="border-2 border-blue-200/30 dark:border-blue-800/30 rounded-xl px-4">
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                            <Shield className="h-5 w-5 text-white" />
                                        </div>
                                        <span className="font-semibold text-blue-900 dark:text-blue-100">Safety Precautions</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground pt-4">
                                    <p>{safetyText}</p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            )}

            {/* Premium Main Lab Interface */}
            <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-blue-300/50 dark:border-blue-700/50 shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-cyan-400/5 to-teal-400/5"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
                <CardHeader className="relative z-10 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-950/40 dark:to-cyan-950/40 border-b border-blue-200/50 dark:border-blue-800/50">
                    <CardTitle className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg">
                                <Droplets className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">Interactive Osmosis Experiment</span>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowSafety(!showSafety)}
                            className={cn(
                                "transition-all hover:scale-105 border-2 font-semibold",
                                showSafety 
                                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500 text-green-700 dark:text-green-400" 
                                    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                            )}
                        >
                            {showSafety ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                            Safety {showSafety ? 'ON' : 'OFF'}
                        </Button>
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400 text-base">Watch water move across a semi-permeable membrane</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                    {/* Premium Start Button */}
                    {currentStep === 'intro' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-16 space-y-6 relative z-10"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                                <Droplets className="h-32 w-32 text-blue-600 dark:text-blue-400 relative z-10" />
                            </div>
                            <Button 
                                size="lg" 
                                onClick={handleStartExperiment}
                                className="text-lg px-10 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-bold relative z-10"
                            >
                                Start Experiment 💧
                            </Button>
                        </motion.div>
                    )}

                    {/* Supplies Collection */}
                    {currentStep === 'collect-supplies' && (
                        <LabSupplies
                            supplies={supplies}
                            collectedItems={collectedItems}
                            onCollect={handleCollect}
                            onAllCollected={handleAllSuppliesCollected}
                            showSupplies={showSupplies}
                            title="Lab Supplies - Click to Collect"
                            description="Collect all the supplies needed for the osmosis experiment"
                        />
                    )}

                    {/* Premium Setup Selection */}
                    {currentStep === 'select-setup' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Label className="text-xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                                <TestTube className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                Select Experimental Setup
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button 
                                        variant={setup === 'sugar-in-water' ? 'default' : 'outline'}
                                        onClick={() => handleSelectSetup('sugar-in-water')}
                                        className={cn(
                                            "h-auto w-full flex-col gap-3 py-6 border-2 transition-all",
                                            setup === 'sugar-in-water'
                                                ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-700 dark:hover:text-blue-300 border-slate-300 dark:border-slate-700"
                                        )}
                                    >
                                        <div className="text-center">
                                            <div className="font-bold text-base mb-2">Setup A</div>
                                            <div className="text-sm">
                                                <div className={cn("font-semibold", setup === 'sugar-in-water' ? "text-white" : "text-blue-600 dark:text-blue-400")}>Tubing: Sugar Solution</div>
                                                <div className={cn("text-xs my-2", setup === 'sugar-in-water' ? "text-white/80" : "text-muted-foreground")}>↕️</div>
                                                <div className={cn("font-semibold", setup === 'sugar-in-water' ? "text-white" : "text-cyan-600 dark:text-cyan-400")}>Beaker: Pure Water</div>
                                            </div>
                                            <div className={cn("text-xs mt-3", setup === 'sugar-in-water' ? "text-white/90" : "text-muted-foreground")}>
                                                Water enters tubing → Swelling
                                            </div>
                                        </div>
                                    </Button>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button 
                                        variant={setup === 'water-in-sugar' ? 'default' : 'outline'}
                                        onClick={() => handleSelectSetup('water-in-sugar')}
                                        className={cn(
                                            "h-auto w-full flex-col gap-3 py-6 border-2 transition-all",
                                            setup === 'water-in-sugar'
                                                ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-700 dark:hover:text-blue-300 border-slate-300 dark:border-slate-700"
                                        )}
                                    >
                                        <div className="text-center">
                                            <div className="font-bold text-base mb-2">Setup B</div>
                                            <div className="text-sm">
                                                <div className={cn("font-semibold", setup === 'water-in-sugar' ? "text-white" : "text-cyan-600 dark:text-cyan-400")}>Tubing: Pure Water</div>
                                                <div className={cn("text-xs my-2", setup === 'water-in-sugar' ? "text-white/80" : "text-muted-foreground")}>↕️</div>
                                                <div className={cn("font-semibold", setup === 'water-in-sugar' ? "text-white" : "text-blue-600 dark:text-blue-400")}>Beaker: Sugar Solution</div>
                                            </div>
                                            <div className={cn("text-xs mt-3", setup === 'water-in-sugar' ? "text-white/90" : "text-muted-foreground")}>
                                                Water leaves tubing → Shrinking
                                            </div>
                                        </div>
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* Premium Osmosis Visualization */}
                    {(currentStep === 'observing' || currentStep === 'result') && setup && (
                        <div className="relative aspect-[4/3] max-w-2xl mx-auto bg-gradient-to-br from-blue-50/80 via-cyan-50/80 to-teal-50/80 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-teal-950/30 rounded-xl border-2 border-blue-300/50 dark:border-blue-700/50 p-4 sm:p-8 backdrop-blur-sm shadow-lg">
                            {/* Beaker */}
                            <div className="relative w-full h-full border-x-4 border-b-4 border-gray-400 rounded-b-3xl bg-gradient-to-b from-transparent to-blue-200/30 dark:to-blue-800/30 flex items-end justify-center pb-12 overflow-hidden">
                                {/* Water level */}
                                <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-blue-400/20 dark:bg-blue-600/20" />
                                
                                {/* Labels */}
                                <div className="absolute top-2 left-2 sm:left-4 bg-white/90 dark:bg-gray-800/90 px-2 sm:px-3 py-1 sm:py-2 rounded-lg border text-xs sm:text-sm shadow-md">
                                    <div className="font-semibold text-blue-600">Beaker:</div>
                                    <div className="text-[10px] sm:text-xs">{setup === 'sugar-in-water' ? 'Pure Water' : 'Sugar Solution'}</div>
                                </div>
                                
                                <div className="absolute top-2 right-2 sm:right-4 bg-white/90 dark:bg-gray-800/90 px-2 sm:px-3 py-1 sm:py-2 rounded-lg border text-xs sm:text-sm shadow-md">
                                    <div className="font-semibold text-purple-600">Tubing:</div>
                                    <div className="text-[10px] sm:text-xs">{setup === 'sugar-in-water' ? 'Sugar Solution' : 'Pure Water'}</div>
                                </div>

                                {/* Enhanced Dialysis Tubing with Measurement Scales */}
                                <div className="relative z-10 flex flex-col items-center">
                                    {/* Left Measurement Scale */}
                                    <div className="absolute -left-8 sm:-left-12 top-0 bottom-0 flex flex-col items-center justify-between py-2">
                                        <div className="text-[8px] sm:text-xs font-bold text-blue-600 dark:text-blue-400">100%</div>
                                        <div className="w-1 h-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-full relative">
                                            {/* Scale markers */}
                                            {[0, 25, 50, 75, 100].map((mark) => (
                                                <div 
                                                    key={mark}
                                                    className="absolute w-3 h-0.5 bg-blue-600 -left-1"
                                                    style={{ bottom: `${mark}%` }}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-[8px] sm:text-xs font-bold text-blue-600 dark:text-blue-400">0%</div>
                                    </div>
                                    
                                    {/* Before/After Size Indicator */}
                                    {currentStep === 'observing' && osmosisProgress > 10 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-gray-800/95 px-3 py-1.5 rounded-lg border-2 border-blue-400 shadow-lg backdrop-blur-sm z-20"
                                        >
                                            <div className="text-xs font-bold text-center">
                                                <div className={cn(
                                                    "text-sm",
                                                    setup === 'sugar-in-water' ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
                                                )}>
                                                    {setup === 'sugar-in-water' 
                                                        ? `Size: ${Math.round(tubingScale * 100)}% (Swelling!)` 
                                                        : `Size: ${Math.round(tubingScale * 100)}% (Shrinking!)`
                                                    }
                                                </div>
                                                <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
                                                    Original: 100%
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Comparison: Original Size Outline (ghost) */}
                                    {currentStep === 'observing' && osmosisProgress > 15 && (
                                        <div 
                                            className="absolute w-20 sm:w-32 h-36 sm:h-48 rounded-[3rem] border-2 border-dashed border-gray-400/50 flex items-center justify-center pointer-events-none"
                                            style={{ 
                                                transform: 'scale(1)',
                                                opacity: 0.4
                                            }}
                                        >
                                            <div className="text-[8px] sm:text-[10px] text-gray-500 text-center">
                                                Original<br/>Size
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Dialysis Tubing with dramatic animation */}
                                    <motion.div 
                                        className="relative w-20 sm:w-32 h-36 sm:h-48 rounded-[3rem] border-4 border-purple-500 bg-gradient-to-b from-purple-200/40 to-purple-300/40 dark:from-purple-800/40 dark:to-purple-900/40 flex items-center justify-center shadow-xl"
                                        animate={{ 
                                            scaleX: tubingScale,
                                            scaleY: tubingScale,
                                            // Add subtle pulse when changing
                                            boxShadow: currentStep === 'observing' && osmosisProgress > 20
                                                ? setup === 'sugar-in-water'
                                                    ? ['0 0 20px rgba(147, 51, 234, 0.3)', '0 0 30px rgba(147, 51, 234, 0.5)', '0 0 20px rgba(147, 51, 234, 0.3)']
                                                    : ['0 0 20px rgba(147, 51, 234, 0.3)', '0 0 15px rgba(147, 51, 234, 0.4)', '0 0 20px rgba(147, 51, 234, 0.3)']
                                                : '0 0 20px rgba(147, 51, 234, 0.2)'
                                        }}
                                        transition={{ 
                                            scaleX: { duration: 0.1 },
                                            scaleY: { duration: 0.1 },
                                            boxShadow: { duration: 1, repeat: Infinity }
                                        }}
                                    >
                                        <div className="text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300 text-center">
                                            Dialysis<br/>Tubing
                                        </div>
                                        
                                        {/* Semi-permeable membrane texture */}
                                        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] rounded-[3rem]" />
                                        
                                        {/* Visual indicator of water content */}
                                        {currentStep === 'observing' && (
                                            <motion.div
                                                className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-blue-400/30 to-cyan-400/30"
                                                animate={{
                                                    opacity: setup === 'sugar-in-water' 
                                                        ? [0.3, 0.6, 0.3] 
                                                        : [0.3, 0.1, 0.3]
                                                }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        )}
                                    </motion.div>
                                    
                                    {/* Right side measurement scale with dynamic marker */}
                                    <div className="absolute -right-8 sm:-right-12 top-0 bottom-0 flex flex-col items-center justify-between py-2">
                                        <div className="text-[8px] sm:text-xs font-bold text-purple-600 dark:text-purple-400">
                                            {setup === 'sugar-in-water' ? '↑ Swelling' : '↓ Shrinking'}
                                        </div>
                                        <div className="w-1 h-full bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 rounded-full relative">
                                            {/* Dynamic marker showing current size */}
                                            <motion.div
                                                className="absolute w-4 h-1 bg-red-500 -left-1.5 rounded-full shadow-lg z-10"
                                                animate={{
                                                    bottom: setup === 'sugar-in-water' 
                                                        ? `${Math.max(0, 100 - (tubingScale - 1) * 100)}%`
                                                        : `${Math.min(100, 100 - (1 - tubingScale) * 100)}%`
                                                }}
                                                transition={{ duration: 0.1 }}
                                            />
                                        </div>
                                        <div className="text-[8px] sm:text-xs font-bold text-purple-600 dark:text-purple-400">
                                            {Math.round(tubingScale * 100)}%
                                        </div>
                                    </div>
                                </div>

                                {/* Water movement arrows */}
                                <AnimatePresence>
                                    {showArrows && (
                                        <>
                                            {setup === 'sugar-in-water' && (
                                                <>
                                                    {[...Array(4)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, x: -50 }}
                                                            animate={{ 
                                                                opacity: [0, 1, 0],
                                                                x: [-50, 0, 0]
                                                            }}
                                                            transition={{
                                                                repeat: Infinity,
                                                                duration: 2,
                                                                delay: i * 0.5
                                                            }}
                                                            className="absolute left-[calc(50%-60px)] top-[calc(50%+20px)]"
                                                        >
                                                            <ArrowRightLeft className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                                                        </motion.div>
                                                    ))}
                                                </>
                                            )}
                                            {setup === 'water-in-sugar' && (
                                                <>
                                                    {[...Array(4)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, x: 0 }}
                                                            animate={{ 
                                                                opacity: [0, 1, 0],
                                                                x: [0, 50, 50]
                                                            }}
                                                            transition={{
                                                                repeat: Infinity,
                                                                duration: 2,
                                                                delay: i * 0.5
                                                            }}
                                                            className="absolute left-[calc(50%+30px)] top-[calc(50%+20px)]"
                                                        >
                                                            <ArrowRightLeft className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 rotate-180" />
                                                        </motion.div>
                                                    ))}
                                                </>
                                            )}
                                        </>
                                    )}
                                </AnimatePresence>

                                {/* Enhanced Progress indicator with size change visualization */}
                                {currentStep === 'observing' && (
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex flex-col gap-3 bg-white/95 dark:bg-gray-800/95 px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm border-2 border-blue-300/50 dark:border-blue-700/50">
                                            <div className="flex items-center gap-2">
                                                <Timer className="h-4 w-4 text-blue-600" />
                                                <div className="flex-1">
                                                    <div className="text-xs font-semibold mb-1 flex items-center justify-between">
                                                        <span>Osmosis Progress</span>
                                                        <span className="text-blue-600 font-bold">{osmosisProgress}%</span>
                                                    </div>
                                                    <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"
                                                            style={{ width: `${osmosisProgress}%` }}
                                                            transition={{ duration: 0.2 }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Size Change Indicator */}
                                            <div className="flex items-center justify-between pt-2 border-t border-blue-200/50 dark:border-blue-800/50">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "w-3 h-3 rounded-full",
                                                        setup === 'sugar-in-water' ? "bg-green-500 animate-pulse" : "bg-orange-500 animate-pulse"
                                                    )} />
                                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                        {setup === 'sugar-in-water' ? 'Tubing Swelling' : 'Tubing Shrinking'}
                                                    </span>
                                                </div>
                                                <div className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                    {setup === 'sugar-in-water' 
                                                        ? `+${Math.round((tubingScale - 1) * 100)}% size`
                                                        : `-${Math.round((1 - tubingScale) * 100)}% size`
                                                    }
                                                </div>
                                            </div>
                                            
                                            {/* Visual comparison bar */}
                                            <div className="flex items-center gap-2 pt-1">
                                                <div className="text-[10px] text-slate-600 dark:text-slate-400">Size:</div>
                                                <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
                                                    {/* Original size marker */}
                                                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 -translate-x-1/2 z-10" />
                                                    <div className="absolute left-1/2 -translate-x-1/2 -top-4 text-[8px] text-gray-500">100%</div>
                                                    
                                                    {/* Current size indicator */}
                                                    <motion.div
                                                        className={cn(
                                                            "absolute top-0 bottom-0 rounded-full",
                                                            setup === 'sugar-in-water' 
                                                                ? "bg-gradient-to-r from-green-400 to-green-600"
                                                                : "bg-gradient-to-r from-orange-400 to-orange-600"
                                                        )}
                                                        style={{
                                                            left: setup === 'sugar-in-water' ? '50%' : `${50 - (1 - tubingScale) * 50}%`,
                                                            width: setup === 'sugar-in-water' 
                                                                ? `${(tubingScale - 1) * 50}%`
                                                                : `${(1 - tubingScale) * 50}%`,
                                                        }}
                                                        transition={{ duration: 0.1 }}
                                                    />
                                                    
                                                    {/* Current size label */}
                                                    <motion.div
                                                        className="absolute -top-4 text-[8px] font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap"
                                                        style={{
                                                            left: setup === 'sugar-in-water' 
                                                                ? `${50 + (tubingScale - 1) * 25}%`
                                                                : `${50 - (1 - tubingScale) * 25}%`,
                                                            transform: 'translateX(-50%)'
                                                        }}
                                                        transition={{ duration: 0.1 }}
                                                    >
                                                        {Math.round(tubingScale * 100)}%
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Safety indicator */}
                                {showSafety && (
                                    <div className="absolute top-1/2 left-4 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg border border-green-500 flex items-center gap-2 shadow-md">
                                        <div className="text-2xl">🥽</div>
                                        <div className="text-xs font-semibold text-green-700 dark:text-green-400">Safety ON</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Premium Result Display */}
                    <AnimatePresence>
                        {currentStep === 'result' && setup && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 bg-gradient-to-br from-blue-50/80 via-cyan-50/80 to-teal-50/80 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-teal-950/30 rounded-xl border-2 border-blue-300/50 dark:border-blue-700/50 shadow-lg backdrop-blur-sm relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl"></div>
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex-shrink-0 shadow-lg">
                                        <CheckCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h3 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                                            Osmosis Complete! ✓
                                        </h3>
                                        <p className="font-medium text-blue-800 dark:text-blue-200">
                                            {setup === 'sugar-in-water' 
                                                ? 'The tubing SWELLED as water moved IN from the beaker'
                                                : 'The tubing SHRANK as water moved OUT into the beaker'
                                            }
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-200/50 dark:border-blue-800/50">
                                            <div>
                                                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Water Movement</div>
                                                <div className="text-sm font-bold text-blue-900 dark:text-blue-100">
                                                    {setup === 'sugar-in-water' ? 'Into Tubing' : 'Out of Tubing'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Result</div>
                                                <div className="text-sm font-bold text-blue-900 dark:text-blue-100">
                                                    {setup === 'sugar-in-water' ? 'Swelling' : 'Shrinking'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 relative z-10 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30 border-t border-blue-200/50 dark:border-blue-800/50">
                    {currentStep === 'select-setup' && setup && (
                        <Button 
                            size="lg" 
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-bold py-6"
                            onClick={handleStartOsmosis}
                            data-action-button
                        >
                            <Droplets className="h-5 w-5 mr-2" />
                            Begin Osmosis Observation
                        </Button>
                    )}
                    
                    {currentStep === 'result' && (
                        <Button 
                            size="lg" 
                            className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-bold py-6"
                            onClick={handleViewQuiz}
                            data-action-button
                        >
                            <BookOpen className="h-5 w-5 mr-2" />
                            Take the Quiz
                        </Button>
                    )}
                    
                    {currentStep !== 'intro' && currentStep !== 'complete' && (
                        <Button 
                            variant="outline" 
                            onClick={handleReset}
                            className="w-full border-2 border-blue-300 dark:border-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/30 dark:hover:to-cyan-950/30 hover:text-blue-700 dark:hover:text-blue-300 text-slate-700 dark:text-slate-300 font-semibold py-6 transition-all duration-300"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset & Try Other Setup
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {/* Premium Quiz Section */}
            {currentStep === 'quiz' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    data-quiz-section
                >
                    <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-blue-300/50 dark:border-blue-700/50 shadow-2xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-cyan-400/5 to-teal-400/5"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
                        <CardHeader className="relative z-10 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-950/40 dark:to-cyan-950/40 border-b border-blue-200/50 dark:border-blue-800/50">
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
                                Post-Lab Quiz
                            </CardTitle>
                            <CardDescription className="text-base">Test your understanding of osmosis</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10 pt-6">
                            {/* Question 1 */}
                            <div className="space-y-3">
                                <p className="font-medium text-lg">
                                    1. In osmosis, water moves from _______ solute concentration to _______ solute concentration.
                                </p>
                                <RadioGroup 
                                    value={selectedAnswer1 || ''} 
                                    onValueChange={setSelectedAnswer1}
                                    disabled={quizSubmitted}
                                >
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-blue-950/30 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                                        <RadioGroupItem value="low-to-high" id="q1-1" />
                                        <Label htmlFor="q1-1" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300">Low to High (more water → less water)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-blue-950/30 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                                        <RadioGroupItem value="high-to-low" id="q1-2" />
                                        <Label htmlFor="q1-2" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300">High to Low (less water → more water)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-blue-950/30 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                                        <RadioGroupItem value="no-movement" id="q1-3" />
                                        <Label htmlFor="q1-3" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300">No movement occurs</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            
                            {/* Question 2 */}
                            <div className="space-y-3">
                                <p className="font-medium text-lg">
                                    2. What type of membrane allows water to pass but blocks larger solute molecules?
                                </p>
                                <RadioGroup 
                                    value={selectedAnswer2 || ''} 
                                    onValueChange={setSelectedAnswer2}
                                    disabled={quizSubmitted}
                                >
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-blue-950/30 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                                        <RadioGroupItem value="fully-permeable" id="q2-1" />
                                        <Label htmlFor="q2-1" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300">Fully permeable membrane</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-blue-950/30 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                                        <RadioGroupItem value="semi-permeable" id="q2-2" />
                                        <Label htmlFor="q2-2" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300">Semi-permeable (selectively permeable) membrane</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-blue-950/30 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                                        <RadioGroupItem value="impermeable" id="q2-3" />
                                        <Label htmlFor="q2-3" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300">Impermeable membrane</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            
                            {/* Question 3 */}
                            <div className="space-y-3">
                                <p className="font-medium text-lg">
                                    3. In your experiment, what happened to the dialysis tubing?
                                </p>
                                <RadioGroup 
                                    value={selectedAnswer3 || ''} 
                                    onValueChange={setSelectedAnswer3}
                                    disabled={quizSubmitted}
                                >
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-blue-950/30 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                                        <RadioGroupItem value="swelled" id="q3-1" />
                                        <Label htmlFor="q3-1" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300">It swelled (increased in size)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-blue-950/30 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                                        <RadioGroupItem value="shrank" id="q3-2" />
                                        <Label htmlFor="q3-2" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300">It shrank (decreased in size)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-blue-950/30 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                                        <RadioGroupItem value="no-change" id="q3-3" />
                                        <Label htmlFor="q3-3" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300">No change in size</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            
                            {quizFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-5 rounded-xl border-2 shadow-lg font-semibold relative overflow-hidden bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-300/50 dark:border-blue-700/50 text-blue-900 dark:text-blue-100"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                    <div className="relative z-10 flex items-start gap-3">
                                        <Sparkles className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium">{quizFeedback}</p>
                                    </div>
                                </motion.div>
                            )}
                        </CardContent>
                        <CardFooter className="relative z-10 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30 border-t border-blue-200/50 dark:border-blue-800/50">
                            <Button 
                                onClick={handleQuizSubmit} 
                                disabled={!selectedAnswer1 || !selectedAnswer2 || !selectedAnswer3 || quizSubmitted}
                                className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                                size="lg"
                            >
                                {quizSubmitted ? "Quiz Completed ✓" : "Submit Answers"}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            )}

            {/* Lab Complete Section */}
            <AnimatePresence>
                {currentStep === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-blue-300/50 dark:border-blue-700/50 shadow-2xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-cyan-400/5 to-teal-400/5"></div>
                            <CardHeader className="text-center relative z-10 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-950/40 dark:to-cyan-950/40 border-b border-blue-200/50 dark:border-blue-800/50">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                    className="flex justify-center mb-4"
                                >
                                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-full shadow-2xl">
                                        <Trophy className="h-16 w-16 text-white" />
                                    </div>
                                </motion.div>
                                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
                                    Lab Complete! 🎉
                                </CardTitle>
                                <CardDescription className="text-base mt-2">
                                    You've mastered osmosis!
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 relative z-10 pt-6">
                                <div className="bg-gradient-to-br from-blue-50/80 via-cyan-50/80 to-teal-50/80 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-teal-950/30 p-6 rounded-xl border-2 border-blue-300/50 dark:border-blue-700/50 shadow-lg backdrop-blur-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl"></div>
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-center text-lg mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                                            What You've Learned:
                                        </h3>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-start gap-3">
                                                <div className="p-1 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full mt-0.5 flex-shrink-0">
                                                    <CheckCircle className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-blue-800 dark:text-blue-200">Osmosis is the movement of water from low solute concentration to high solute concentration</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="p-1 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full mt-0.5 flex-shrink-0">
                                                    <CheckCircle className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-blue-800 dark:text-blue-200">Semi-permeable membranes allow water to pass but block larger solute molecules</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="p-1 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full mt-0.5 flex-shrink-0">
                                                    <CheckCircle className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-blue-800 dark:text-blue-200">Water moves to dilute concentrated solutions, causing swelling or shrinking</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="p-1 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full mt-0.5 flex-shrink-0">
                                                    <CheckCircle className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-blue-800 dark:text-blue-200">Osmosis is essential for plant cells, animal cells, and kidney function</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                {xpEarned > 0 && (
                                    <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-xl border-2 border-amber-300/50 dark:border-amber-700/50">
                                        <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
                                            +{xpEarned} XP Earned!
                                        </div>
                                        <div className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                            Score: {labProgress?.score || 0}%
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="relative z-10 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30 border-t border-blue-200/50 dark:border-blue-800/50">
                                <Button 
                                    onClick={handleReset} 
                                    variant="outline" 
                                    className="w-full border-2 border-blue-300 dark:border-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/30 dark:hover:to-cyan-950/30 hover:text-blue-700 dark:hover:text-blue-300 text-slate-700 dark:text-slate-300 font-semibold transition-all duration-300" 
                                    size="lg"
                                >
                                    <Sparkles className="h-5 w-5 mr-2" />
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
