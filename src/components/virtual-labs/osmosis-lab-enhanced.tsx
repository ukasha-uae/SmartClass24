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
    Sparkles, Trophy, Award, Eye, EyeOff, Timer
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherVoice } from './TeacherVoice';
import { useLabProgress } from '@/stores/lab-progress-store';
import confetti from 'canvas-confetti';

type TestStep = 'intro' | 'select-setup' | 'observing' | 'result' | 'quiz';
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
    
    // Teacher voice
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
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
    
    // Osmosis progress effect
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (currentStep === 'observing' && osmosisProgress < 100) {
            interval = setInterval(() => {
                setOsmosisProgress(prev => Math.min(prev + 5, 100));
            }, 150);
        }
        return () => clearInterval(interval);
    }, [currentStep, osmosisProgress]);

    // Update tubing scale based on setup
    React.useEffect(() => {
        if (currentStep === 'observing' && setup) {
            const targetScale = setup === 'sugar-in-water' ? 1.15 : 0.85;
            const scaleInterval = setInterval(() => {
                setTubingScale(prev => {
                    const diff = targetScale - prev;
                    if (Math.abs(diff) < 0.01) {
                        clearInterval(scaleInterval);
                        return targetScale;
                    }
                    return prev + diff * 0.1;
                });
            }, 50);
            return () => clearInterval(scaleInterval);
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
                
                setPendingTransition(() => () => {
                    setTimeout(() => {
                        const quizSection = document.querySelector('[data-quiz-section]');
                        quizSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                });
            }, 500);
        }
    }, [osmosisProgress, currentStep, setup]);

    // Teacher message callbacks
    const handleTeacherComplete = React.useCallback(() => {
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null);
            transition();
        }
    }, [pendingTransition]);

    // Initial intro
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage('Welcome to the Osmosis Lab! Osmosis is the movement of WATER across a semi-permeable membrane. Water always moves from where there is MORE water (low solute) to where there is LESS water (high solute). Think of it like water trying to dilute concentrated solutions! Ready to see it happen?');
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setCurrentStep('select-setup');
        setTeacherMessage('Choose your experimental setup. Option 1: Sugar solution INSIDE the tubing, pure water OUTSIDE. Option 2: Pure water INSIDE the tubing, sugar solution OUTSIDE. Which setup do you want to observe?');
    };

    const handleSelectSetup = (setupType: SetupType) => {
        if (!setupType) return;
        setSetup(setupType);
        
        const messages = {
            'sugar-in-water': 'Perfect! You have sugar solution inside the tubing and pure water in the beaker. The tubing membrane is semi-permeable - water can pass through, but sugar molecules are too big. Water will move to dilute the sugar. Ready to start?',
            'water-in-sugar': 'Excellent choice! You have pure water inside the tubing and sugar solution in the beaker. The membrane lets water pass but blocks sugar. Water will move out to dilute the sugar solution outside. Ready to observe?'
        };
        
        setTeacherMessage(messages[setupType]);
        setPendingTransition(() => () => {
            setTimeout(() => {
                const actionButton = document.querySelector('[data-action-button]');
                actionButton?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
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
            // Perfect - all 3 correct
            setQuizFeedback(`Perfect! You got all 3 correct! 🎉 Excellent understanding of osmosis!`);
            setTeacherMessage(`Outstanding! Perfect score! You truly understand OSMOSIS! 🎉 Let me summarize what you learned: (1) Water moves from LOW solute concentration (more water) to HIGH solute concentration (less water) - this is the fundamental rule of osmosis! Water goes where it can DILUTE concentrated solutions. (2) The SEMI-PERMEABLE MEMBRANE (dialysis tubing) has tiny pores that let water molecules pass through but block larger solute molecules like sugar. This selective permeability is KEY to osmosis! (3) In your experiment, ${setup === 'sugar-in-water' ? 'the tubing SWELLED because water moved from the beaker (pure water = low solute) INTO the tubing (sugar solution = high solute)' : 'the tubing SHRANK because water moved from inside the tubing (pure water = low solute) OUT to the beaker (sugar solution = high solute)'}. This demonstrates TURGOR PRESSURE in plant cells (swelling) and PLASMOLYSIS (shrinking) when cells lose water. Osmosis is essential for life: plants absorb water from soil, kidneys filter blood, cells maintain water balance. You've mastered this concept!`);
            
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
                setTimeout(() => setShowCelebration(false), 5000);
            }
        } else if (correctCount === 2) {
            // Good effort - 2 out of 3 correct
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Let me clarify the concepts you missed.`);
            setTeacherMessage(`Good effort! You got 2 out of 3 correct. Let me clarify the key concepts: (1) DIRECTION OF WATER MOVEMENT: Water moves from LOW solute concentration (where there's MORE water) to HIGH solute concentration (where there's LESS water). Think of it as water trying to EQUALIZE concentrations - it goes where it can dilute! Pure water = 100% water (LOW solute). Sugar solution = maybe 90% water + 10% sugar (HIGH solute). Water moves from pure → sugar solution. (2) SEMI-PERMEABLE MEMBRANE: The dialysis tubing (or cell membrane in living organisms) has microscopic PORES that allow SMALL molecules like water (H₂O) to pass through but BLOCK LARGE molecules like sugar (C₁₂H₂₂O₁₁). This selective permeability is what makes osmosis possible! Without it, sugar would also move and there'd be no NET water movement. (3) RESULT: ${setup === 'sugar-in-water' ? 'When sugar solution is INSIDE the tubing and pure water is OUTSIDE, water moves INTO the tubing. More water inside = tubing SWELLS (increases in size). This is like plant cells in pure water - they swell with turgor pressure!' : 'When pure water is INSIDE the tubing and sugar solution is OUTSIDE, water moves OUT of the tubing. Less water inside = tubing SHRINKS (decreases in size). This is like plant cells in salt water - they lose water and wilt!'}. Review these concepts and try the quiz again!`);
            
            if (!hasCompleted) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                const earnedXP = markLabComplete('osmosis', 75, timeSpent);
                setXpEarned(earnedXP);
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 5000);
            }
        } else {
            // Needs work - 0 or 1 correct
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Don't worry! Let me explain osmosis from the beginning.`);
            setTeacherMessage(`Keep trying! You got ${correctCount} answer${correctCount === 1 ? '' : 's'} correct. Let me explain OSMOSIS step by step from the very beginning: OSMOSIS is the NET movement of WATER across a SEMI-PERMEABLE MEMBRANE from HIGH water concentration to LOW water concentration. But here's the trick that confuses many students - we often describe it using SOLUTE concentration instead of water concentration! Here's the key relationship: HIGH water concentration = LOW solute concentration (not much dissolved stuff - mostly water). LOW water concentration = HIGH solute concentration (lots of dissolved stuff - less water). So water moves from LOW solute → HIGH solute. Why does this happen? The MEMBRANE has tiny pores that let water molecules through but block larger solute molecules (like sugar, salt, starch). Water molecules are always moving randomly (kinetic energy), but there's a NET flow in one direction. Where there's MORE water (low solute), more water molecules bump into the membrane and cross through. Where there's LESS water (high solute), fewer water molecules are available to cross back. The result? NET movement of water from low solute → high solute until concentrations equalize! It's like a crowded room (high water) where people spread out to an empty room (low water) through a doorway (membrane). In your experiment: You ${setup === 'sugar-in-water' ? 'put sugar solution INSIDE the tubing and pure water OUTSIDE in the beaker' : 'put pure water INSIDE the tubing and sugar solution OUTSIDE in the beaker'}. The dialysis tubing acted as a SEMI-PERMEABLE MEMBRANE - water could pass through but sugar could not (sugar molecules are too big for the pores). Pure water = 100% water = LOW solute concentration. Sugar solution = maybe 90% water + 10% sugar = HIGH solute concentration. NET movement of water? From low solute → high solute. ${setup === 'sugar-in-water' ? 'Water moved from the beaker (low solute) INTO the tubing (high solute). Result: tubing SWELLED because it gained water!' : 'Water moved from inside the tubing (low solute) OUT to the beaker (high solute). Result: tubing SHRANK because it lost water!'}. Real-world applications: PLANT CELLS in pure water swell with turgor pressure (keeps plants firm). PLANT CELLS in salty water shrink and wilt (plasmolysis). KIDNEY CELLS filter blood using osmosis. RED BLOOD CELLS maintain shape through osmotic balance. Remember: Water goes where it can DILUTE - from low solute → high solute. The membrane blocks solute but allows water. Review the experiment and try the quiz again!`);
            
            if (!hasCompleted) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                const earnedXP = markLabComplete('osmosis', 50, timeSpent);
                setXpEarned(earnedXP);
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 5000);
            }
        }
    };

    const handleReset = () => {
        setCurrentStep('intro');
        setSetup(null);
        setOsmosisProgress(0);
        setTubingScale(1);
        setShowArrows(false);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setXpEarned(0);
        setShowCelebration(false);
        setPendingTransition(null);
        setTeacherMessage('Ready to observe osmosis again? You can try both setups to see water movement in different directions! Click Start Experiment when ready.');
    };

    const objectiveText = "To observe osmosis through a semi-permeable membrane using dialysis tubing, demonstrating how water moves based on solute concentration gradients.";
    const theoryText = "Osmosis is the net movement of water molecules across a selectively permeable (semi-permeable) membrane from a region of HIGHER water concentration to a region of LOWER water concentration. This can also be described as movement from LOW solute concentration to HIGH solute concentration. The membrane allows water to pass freely but blocks larger solute molecules like sugar. This process is passive (requires no energy) and continues until equilibrium is reached. Osmosis is vital for life: plant cells use it to take up water from soil, animal cells regulate water balance through osmosis, and it's how kidneys filter blood. In this lab, dialysis tubing acts as an artificial semi-permeable membrane.";
    const safetyText = "In a real laboratory: Handle glassware (beakers, test tubes) carefully to prevent breakage and cuts. Ensure dialysis tubing is properly sealed with clips or ties to prevent leaks. Wipe up any water spills immediately to prevent slipping hazards. Wash hands before and after handling materials. If using starch or other indicators, avoid contact with eyes and mouth. Always wear safety goggles when working with liquids. Dispose of solutions properly according to lab protocols.";

    return (
        <div className="space-y-6">
            {/* Completion Badge */}
            {hasCompleted && labProgress && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border-2 border-blue-300 dark:border-blue-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-full">
                            <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-blue-900 dark:text-blue-100">Lab Completed!</div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                                Score: {labProgress.score}%
                            </div>
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-200 text-blue-900">
                        <Award className="h-3 w-3 mr-1" />
                        {labProgress.xpEarned} XP
                    </Badge>
                </motion.div>
            )}

            {/* Teacher Voice */}
            {teacherMessage && (
                <TeacherVoice 
                    message={teacherMessage}
                    onComplete={handleTeacherComplete}
                    emotion={currentStep === 'result' || quizSubmitted ? 'celebrating' : osmosisProgress > 50 ? 'happy' : 'explaining'}
                    context={{
                        attempts: osmosisProgress,
                        correctStreak: quizSubmitted ? 1 : 0
                    }}
                    quickActions={[
                        {
                            label: 'Reset Lab',
                            icon: '🔄',
                            onClick: handleReset
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
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Objective</CardTitle>
                    <CardDescription>{objectiveText}</CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lab Information</CardTitle>
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
                                <p>{theoryText}</p>
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
                                <p>{safetyText}</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            {/* Main Lab Interface */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Droplets className="h-6 w-6" />
                            Interactive Osmosis Experiment
                        </span>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowSafety(!showSafety)}
                            className={cn("transition-colors", showSafety && "border-green-500 text-green-600")}
                        >
                            {showSafety ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                            Safety {showSafety ? 'ON' : 'OFF'}
                        </Button>
                    </CardTitle>
                    <CardDescription>Watch water move across a semi-permeable membrane</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Start Button */}
                    {currentStep === 'intro' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-12 space-y-4"
                        >
                            <Beaker className="h-24 w-24 text-blue-500" />
                            <Button 
                                size="lg" 
                                onClick={handleStartExperiment}
                                className="text-lg px-8"
                            >
                                Start Experiment 💧
                            </Button>
                        </motion.div>
                    )}

                    {/* Setup Selection */}
                    {currentStep === 'select-setup' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <Label className="text-lg font-semibold flex items-center gap-2">
                                <TestTube className="h-5 w-5" />
                                Select Experimental Setup
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button 
                                        variant={setup === 'sugar-in-water' ? 'default' : 'outline'}
                                        onClick={() => handleSelectSetup('sugar-in-water')}
                                        className="h-auto w-full flex-col gap-3 py-6"
                                    >
                                        <div className="text-center">
                                            <div className="font-bold text-base mb-2">Setup A</div>
                                            <div className="text-sm">
                                                <div className="text-blue-600 dark:text-blue-400 font-semibold">Tubing: Sugar Solution</div>
                                                <div className="text-muted-foreground text-xs my-2">↕️</div>
                                                <div className="text-cyan-600 dark:text-cyan-400 font-semibold">Beaker: Pure Water</div>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-3">
                                                Water enters tubing → Swelling
                                            </div>
                                        </div>
                                    </Button>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button 
                                        variant={setup === 'water-in-sugar' ? 'default' : 'outline'}
                                        onClick={() => handleSelectSetup('water-in-sugar')}
                                        className="h-auto w-full flex-col gap-3 py-6"
                                    >
                                        <div className="text-center">
                                            <div className="font-bold text-base mb-2">Setup B</div>
                                            <div className="text-sm">
                                                <div className="text-cyan-600 dark:text-cyan-400 font-semibold">Tubing: Pure Water</div>
                                                <div className="text-muted-foreground text-xs my-2">↕️</div>
                                                <div className="text-blue-600 dark:text-blue-400 font-semibold">Beaker: Sugar Solution</div>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-3">
                                                Water leaves tubing → Shrinking
                                            </div>
                                        </div>
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* Osmosis Visualization */}
                    {(currentStep === 'observing' || currentStep === 'result') && setup && (
                        <div className="relative aspect-[4/3] max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border-2 p-4 sm:p-8">
                            {/* Beaker */}
                            <div className="relative w-full h-full border-x-4 border-b-4 border-gray-400 rounded-b-3xl bg-gradient-to-b from-transparent to-blue-200/30 dark:to-blue-800/30 flex items-end justify-center pb-12 overflow-hidden">
                                {/* Water level */}
                                <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-blue-400/20 dark:bg-blue-600/20" />
                                
                                {/* Labels */}
                                <div className="absolute top-2 left-2 sm:left-4 bg-white/90 dark:bg-gray-800/90 px-2 sm:px-3 py-1 sm:py-2 rounded-lg border text-xs sm:text-sm">
                                    <div className="font-semibold text-blue-600">Beaker:</div>
                                    <div className="text-[10px] sm:text-xs">{setup === 'sugar-in-water' ? 'Pure Water' : 'Sugar Solution'}</div>
                                </div>
                                
                                <div className="absolute top-2 right-2 sm:right-4 bg-white/90 dark:bg-gray-800/90 px-2 sm:px-3 py-1 sm:py-2 rounded-lg border text-xs sm:text-sm">
                                    <div className="font-semibold text-purple-600">Tubing:</div>
                                    <div className="text-[10px] sm:text-xs">{setup === 'sugar-in-water' ? 'Sugar Solution' : 'Pure Water'}</div>
                                </div>

                                {/* Dialysis Tubing */}
                                <motion.div 
                                    className="relative w-20 sm:w-32 h-36 sm:h-48 rounded-[3rem] border-4 border-purple-500 bg-gradient-to-b from-purple-200/40 to-purple-300/40 dark:from-purple-800/40 dark:to-purple-900/40 flex items-center justify-center z-10"
                                    animate={{ 
                                        scaleX: tubingScale,
                                        scaleY: tubingScale
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300">
                                        Dialysis<br/>Tubing
                                    </div>
                                    
                                    {/* Semi-permeable membrane texture */}
                                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')] rounded-[3rem]" />
                                </motion.div>

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

                                {/* Progress indicator */}
                                {currentStep === 'observing' && (
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg">
                                            <Timer className="h-4 w-4 text-blue-600" />
                                            <div className="flex-1">
                                                <div className="text-xs font-semibold mb-1">Osmosis Progress</div>
                                                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        className="h-full bg-blue-500"
                                                        style={{ width: `${osmosisProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Safety indicator */}
                                {showSafety && (
                                    <div className="absolute top-1/2 left-4 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg border border-green-500 flex items-center gap-2">
                                        <div className="text-2xl">🥽</div>
                                        <div className="text-xs font-semibold text-green-700 dark:text-green-400">Safety ON</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Result Display */}
                    <AnimatePresence>
                        {currentStep === 'result' && setup && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-500 rounded-full flex-shrink-0">
                                        <CheckCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100">
                                            Osmosis Complete! ✓
                                        </h3>
                                        <p className="font-medium text-blue-800 dark:text-blue-200">
                                            {setup === 'sugar-in-water' 
                                                ? 'The tubing SWELLED as water moved IN from the beaker'
                                                : 'The tubing SHRANK as water moved OUT into the beaker'
                                            }
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
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
                <CardFooter className="flex flex-col gap-3">
                    {currentStep === 'select-setup' && setup && (
                        <Button 
                            size="lg" 
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={handleStartOsmosis}
                            data-action-button
                        >
                            <Droplets className="h-5 w-5 mr-2" />
                            Begin Osmosis Observation
                        </Button>
                    )}
                    
                    {currentStep !== 'intro' && (
                        <Button 
                            variant="outline" 
                            onClick={handleReset}
                            className="w-full"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset & Try Other Setup
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {/* Quiz Section */}
            {currentStep === 'result' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    data-quiz-section
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Post-Lab Quiz</CardTitle>
                            <CardDescription>Test your understanding of the experiment</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Question 1 */}
                            <div className="space-y-3">
                                <p className="font-medium">
                                    1. In osmosis, water moves from _______ solute concentration to _______ solute concentration.
                                </p>
                                <RadioGroup 
                                    value={selectedAnswer1 || ''} 
                                    onValueChange={setSelectedAnswer1}
                                    disabled={quizSubmitted}
                                >
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="low-to-high" id="q1-1" />
                                        <Label htmlFor="q1-1" className="flex-1 cursor-pointer">Low to High (more water → less water)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="high-to-low" id="q1-2" />
                                        <Label htmlFor="q1-2" className="flex-1 cursor-pointer">High to Low (less water → more water)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="no-movement" id="q1-3" />
                                        <Label htmlFor="q1-3" className="flex-1 cursor-pointer">No movement occurs</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            
                            {/* Question 2 */}
                            <div className="space-y-3">
                                <p className="font-medium">
                                    2. What type of membrane allows water to pass but blocks larger solute molecules?
                                </p>
                                <RadioGroup 
                                    value={selectedAnswer2 || ''} 
                                    onValueChange={setSelectedAnswer2}
                                    disabled={quizSubmitted}
                                >
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="fully-permeable" id="q2-1" />
                                        <Label htmlFor="q2-1" className="flex-1 cursor-pointer">Fully permeable membrane</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="semi-permeable" id="q2-2" />
                                        <Label htmlFor="q2-2" className="flex-1 cursor-pointer">Semi-permeable (selectively permeable) membrane</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="impermeable" id="q2-3" />
                                        <Label htmlFor="q2-3" className="flex-1 cursor-pointer">Impermeable membrane</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            
                            {/* Question 3 */}
                            <div className="space-y-3">
                                <p className="font-medium">
                                    3. In your experiment, what happened to the dialysis tubing?
                                </p>
                                <RadioGroup 
                                    value={selectedAnswer3 || ''} 
                                    onValueChange={setSelectedAnswer3}
                                    disabled={quizSubmitted}
                                >
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="swelled" id="q3-1" />
                                        <Label htmlFor="q3-1" className="flex-1 cursor-pointer">It swelled (increased in size)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="shrank" id="q3-2" />
                                        <Label htmlFor="q3-2" className="flex-1 cursor-pointer">It shrank (decreased in size)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="no-change" id="q3-3" />
                                        <Label htmlFor="q3-3" className="flex-1 cursor-pointer">No change in size</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            
                            {quizFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 rounded-lg border-2 flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border-blue-500 text-blue-900 dark:text-blue-100"
                                >
                                    <Sparkles className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm font-medium">{quizFeedback}</p>
                                </motion.div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button 
                                onClick={handleQuizSubmit} 
                                disabled={!selectedAnswer1 || !selectedAnswer2 || !selectedAnswer3 || quizSubmitted}
                                className="w-full"
                                size="lg"
                            >
                                {quizSubmitted ? "Quiz Completed ✓" : "Submit Answers"}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            )}

            {/* XP Celebration */}
            <AnimatePresence>
                {showCelebration && xpEarned > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed bottom-8 right-8 z-50"
                    >
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 rounded-2xl shadow-2xl border-4 border-blue-300">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-full">
                                    <Sparkles className="h-8 w-8" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">+{xpEarned} XP</div>
                                    <div className="text-sm opacity-90">Lab Complete!</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
