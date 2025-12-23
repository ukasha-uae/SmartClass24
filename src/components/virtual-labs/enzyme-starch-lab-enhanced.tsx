'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Droplets, Clock, BookOpen, Shield, Sparkles, Trophy, Award, RefreshCw } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';

type Step = 'intro' | 'collect-supplies' | 'add-starch' | 'add-amylase' | 'waiting' | 'add-iodine' | 'results' | 'quiz' | 'complete';

export function EnzymeStarchLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Supplies tracking
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [tubeCollected, setTubeCollected] = React.useState(false);
    const [starchCollected, setStarchCollected] = React.useState(false);
    const [amylaseCollected, setAmylaseCollected] = React.useState(false);
    const [iodineCollected, setIodineCollected] = React.useState(false);
    
    // Experiment state
    const [starchAdded, setStarchAdded] = React.useState(false);
    const [amylaseAdded, setAmylaseAdded] = React.useState(false);
    const [timePassed, setTimePassed] = React.useState(0);
    const [iodineAdded, setIodineAdded] = React.useState(false);
    
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
    const labId = 'enzyme-starch';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    // Timer
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    // Intro message
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Enzyme Action Lab! Today we'll explore how enzymes work as biological catalysts. We'll observe how amylase (an enzyme in your saliva) breaks down starch into simple sugars. This is exactly what happens when you chew bread! Ready to see digestion in action?");
        }
    }, [currentStep]);

    // Timer effect
    React.useEffect(() => {
        if (currentStep === 'waiting') {
            timerRef.current = setInterval(() => {
                setTimePassed(prev => {
                    if (prev >= 10) {
                        clearInterval(timerRef.current!);
                        handleReactionComplete();
                        return 10;
                    }
                    return prev + 1;
                });
            }, 1000);
            return () => {
                if (timerRef.current) clearInterval(timerRef.current);
            };
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setTeacherMessage("Perfect! Let's gather our supplies. Start by clicking on the TEST TUBE - this will hold our experiment!");
        setPendingTransition(() => () => {
            setCurrentStep('collect-supplies');
        });
    };
    
    const handleCollectTube = () => {
        if (!tubeCollected) {
            setTubeCollected(true);
            setTeacherMessage("Great! Now click on the STARCH SOLUTION - starch is a complex carbohydrate found in foods like bread, rice, and potatoes.");
            toast({ title: '✅ Test Tube Collected' });
        }
    };
    
    const handleCollectStarch = () => {
        if (tubeCollected && !starchCollected) {
            setStarchCollected(true);
            setTeacherMessage("Excellent! Now click on AMYLASE - this is the enzyme that will break down the starch. It's found naturally in your saliva!");
            toast({ title: '✅ Starch Solution Collected' });
        }
    };
    
    const handleCollectAmylase = () => {
        if (starchCollected && !amylaseCollected) {
            setAmylaseCollected(true);
            setTeacherMessage("Perfect! Finally, click on IODINE - we'll use this to test whether starch is present. Iodine turns blue-black when it meets starch!");
            toast({ title: '✅ Amylase Enzyme Collected' });
        }
    };
    
    const handleCollectIodine = () => {
        if (amylaseCollected && !iodineCollected) {
            setIodineCollected(true);
            setShowSupplies(false);
            setTeacherMessage("All supplies collected! Now click on the test tube to pour in the starch solution first.");
            toast({ title: '✅ All Supplies Collected!' });
            setPendingTransition(() => () => {
                setCurrentStep('add-starch');
            });
        }
    };
    
    const handleAddStarch = () => {
        if (iodineCollected && !starchAdded) {
            setStarchAdded(true);
            setTeacherMessage("Good! The test tube now contains starch solution. Click the amylase dropper to add the enzyme!");
            toast({ title: '✅ Starch Added to Tube' });
            setPendingTransition(() => () => {
                setCurrentStep('add-amylase');
            });
        }
    };
    
    const handleAddAmylase = () => {
        if (starchAdded && !amylaseAdded) {
            setAmylaseAdded(true);
            setTeacherMessage("Excellent! The amylase enzyme is now breaking down the starch molecules into simpler sugars. This takes about 10 seconds in our simulation. Watch the timer!");
            toast({ title: '⏳ Enzyme Reaction Started!' });
            setPendingTransition(() => () => {
                setCurrentStep('waiting');
                setTimePassed(0);
            });
        }
    };
    
    const handleReactionComplete = () => {
        setTeacherMessage("Time's up! The enzyme has broken down most of the starch. Now click the iodine dropper to test if any starch remains!");
        setPendingTransition(() => () => {
            setCurrentStep('add-iodine');
        });
    };
    
    const handleAddIodine = () => {
        if (!iodineAdded) {
            setIodineAdded(true);
            setTeacherMessage("Look at that! The solution stayed orange/amber - no blue-black color! This proves the starch has been broken down by the enzyme. If starch was still there, we'd see a blue-black color. Enzymes are amazing catalysts!");
            toast({ title: '🎉 Experiment Complete!' });
            setPendingTransition(() => () => {
                setCurrentStep('results');
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
        setTeacherMessage("Great work! You've successfully demonstrated enzyme action. Now let's test your understanding with a quick quiz!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
        });
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        if (selectedAnswer1 === 'starch') correctCount++;
        if (selectedAnswer2 === 'amylase') correctCount++;
        if (selectedAnswer3 === 'iodine') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You've mastered enzyme action! +${earnedXP} XP`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            
            // 3-tier feedback: Perfect score
            setTeacherMessage(`Outstanding! Perfect score! 🎉 You've completely mastered enzyme action! Here's what you discovered: (1) STARCH is the SUBSTRATE - the complex carbohydrate molecule that gets broken down. Starch is a polysaccharide made of many glucose units linked together. It's found in foods like bread, rice, potatoes, and pasta. (2) AMYLASE is the ENZYME - the biological catalyst that speeds up the reaction. Amylase has an active site with a specific shape that binds to starch molecules. It breaks the glycosidic bonds between glucose units, splitting starch into MALTOSE (a disaccharide) and eventually GLUCOSE (a monosaccharide). Enzymes work by LOWERING the activation energy needed for the reaction - they make it easier for the reaction to happen! (3) IODINE is the INDICATOR - the chemical test for starch. Iodine (I₂) reacts with starch to form a blue-black starch-iodine complex. When starch is broken down into sugars, there's NO starch left to react with iodine, so the solution stays ORANGE/AMBER. This proves the enzyme worked! The key enzyme properties: (a) SPECIFIC - each enzyme only works on certain substrates (amylase only breaks down starch, not proteins or fats), (b) REUSABLE - enzymes aren't consumed in the reaction, they can be used again and again, (c) AFFECTED BY CONDITIONS - temperature and pH affect enzyme activity. This happens in YOUR MOUTH right now - salivary amylase begins digesting starch as soon as you chew bread! Enzymes are essential for life - they control ALL chemical reactions in cells. +${earnedXP} XP earned!`);
            setTimeout(() => {
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            // Good effort - 2 out of 3 correct
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Review the experiment and try again. Think about what each substance does!`);
            setTeacherMessage(`Good effort! You got 2 out of 3 correct. Let me clarify the roles of each substance in this experiment: (1) STARCH is the SUBSTRATE - the substance being broken down. Think of it as the raw material. Starch is a large, complex molecule (polysaccharide) made of many glucose units. Your body cannot absorb starch directly - it must be broken into simpler sugars first. (2) AMYLASE is the ENZYME - the biological catalyst. Enzymes are proteins with a specific 3D shape. The ACTIVE SITE of amylase has a shape that perfectly fits starch molecules (lock and key model). When starch binds to the active site, the enzyme CATALYZES the breakdown reaction, splitting starch into maltose and glucose. Enzymes speed up reactions WITHOUT being consumed! (3) IODINE is the INDICATOR - the chemical test. Iodine turns BLUE-BLACK when it meets starch. After the enzyme works, NO starch remains, so iodine stays ORANGE. This is proof that the substrate was broken down! The sequence: Starch (substrate) + Amylase (enzyme) → Maltose + Glucose (products). Then: Add iodine → stays orange (no starch) = enzyme worked! Review these roles and try the quiz again!`);
        } else {
            // Needs work - 0 or 1 correct
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Don't worry! Review how enzymes break down substrates and try again.`);
            setTeacherMessage(`Keep trying! You got ${correctCount} answer${correctCount === 1 ? '' : 's'} correct. Let me explain enzyme action from the beginning: ENZYMES are biological CATALYSTS - proteins that speed up chemical reactions in living organisms. Without enzymes, most reactions would be too slow to sustain life! In this experiment, we studied how AMYLASE (the enzyme) breaks down STARCH (the substrate). Here's the story: STARCH is a complex carbohydrate - a long chain of glucose molecules linked together. Your body needs to break it into simple sugars (glucose) to absorb it. This is where AMYLASE comes in! AMYLASE is an enzyme found in your SALIVA (salivary amylase) and PANCREATIC JUICE (pancreatic amylase). It has a special pocket called the ACTIVE SITE that's shaped perfectly to fit starch molecules - like a lock and key! When starch enters the active site, the enzyme CATALYZES (speeds up) the hydrolysis reaction that breaks the bonds between glucose units. The result? Starch → Maltose (2 glucose units) → Glucose (1 unit). The enzyme itself is NOT consumed - it's released and can work on another starch molecule! To prove this worked, we used IODINE - a chemical indicator. Iodine has a special property: it turns BLUE-BLACK when it meets starch (forms a starch-iodine complex). If there's NO starch present (because the enzyme broke it all down), iodine stays ORANGE/AMBER. In our experiment: (1) We started with STARCH in the tube (substrate). (2) We added AMYLASE enzyme - it immediately started breaking starch down. (3) After 10 seconds, most starch was broken into sugars. (4) We added IODINE - it stayed ORANGE! This proves NO starch remained = enzyme worked! Key points: Starch = substrate (what's broken down). Amylase = enzyme (the catalyst). Iodine = indicator (tests for starch). Review the experiment and think about what happened at each step. Try the quiz again!`);
        }
    };

    const handleRestart = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setCurrentStep('intro');
        setShowSupplies(true);
        setTubeCollected(false);
        setStarchCollected(false);
        setAmylaseCollected(false);
        setIodineCollected(false);
        setStarchAdded(false);
        setAmylaseAdded(false);
        setTimePassed(0);
        setIodineAdded(false);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setPendingTransition(null);
        setTeacherMessage("Welcome back! Ready to explore enzyme action again? Let's discover how enzymes speed up chemical reactions!");
    };

    const getVisualStage = () => {
        if (iodineAdded) return 'no-starch';
        if (amylaseAdded) return 'enzyme-working';
        if (starchAdded) return 'starch-only';
        return 'empty';
    };

    const stage = getVisualStage();

    return (
        <div className="space-y-6 pb-20">
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
                emotion={currentStep === 'complete' ? 'celebrating' : iodineAdded ? 'happy' : 'explaining'}
                context={{
                    attempts: timePassed,
                    correctStreak: timePassed
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
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                            <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-green-900 dark:text-green-100">Lab Completed!</h3>
                            <p className="text-sm text-green-700 dark:text-green-300">
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
                            <CardDescription>You've completed the Enzyme Action Lab!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-green-600">
                                <Award className="h-8 w-8" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You've mastered enzyme catalysis!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-green-600" />
                        Enzyme Action on Starch
                    </CardTitle>
                    <CardDescription>Observe how enzymes catalyze the breakdown of starch</CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lab Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="theory" data-theory-section>
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    <span>Background Theory</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                                <p>Enzymes are biological catalysts that speed up chemical reactions in living organisms. They work by lowering the activation energy needed for reactions to occur.</p>
                                <p><strong>Amylase</strong> is an enzyme found in saliva and pancreatic juice. It breaks down starch (a complex carbohydrate) into simpler sugars like maltose and glucose.</p>
                                <p><strong>Iodine test:</strong> Iodine solution turns blue-black in the presence of starch. If starch has been broken down, the solution stays orange/amber, proving the enzyme worked!</p>
                                <p><strong>Why this matters:</strong> This is the first step of digestion! When you chew bread, amylase in your saliva begins breaking down the starch immediately.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="safety" data-safety-section>
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    <span>Safety Precautions</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                                <ul>
                                    <li>Wear safety goggles when working with chemicals</li>
                                    <li>Iodine can stain skin and clothes - handle with care</li>
                                    <li>Never taste any laboratory substances</li>
                                    <li>Wash hands thoroughly after the experiment</li>
                                    <li>Dispose of chemicals properly as instructed</li>
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
                                <CardTitle>Welcome to the Enzyme Action Lab!</CardTitle>
                                <CardDescription>Discover how biological catalysts work</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-6 rounded-lg border-2 border-green-200 dark:border-green-800">
                                    <div className="flex items-start gap-4">
                                        <Droplets className="w-16 h-16 text-green-600 dark:text-green-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-green-900 dark:text-green-100">What We'll Discover:</h3>
                                            <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                                                <li>• How enzymes break down complex molecules</li>
                                                <li>• The role of amylase in digesting starch</li>
                                                <li>• How to test for starch using iodine</li>
                                                <li>• Why enzymes are essential for life processes</li>
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
                                    {/* Test Tube */}
                                    {!tubeCollected && (
                                        <motion.div
                                            onClick={handleCollectTube}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-gray-300 dark:border-gray-700 hover:border-gray-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-16 h-24 bg-gradient-to-b from-transparent to-gray-100 dark:to-gray-800/30 rounded-b-lg border-2 border-gray-400" />
                                                <span className="text-sm font-medium">Test Tube</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Starch Solution */}
                                    {tubeCollected && !starchCollected && (
                                        <motion.div
                                            onClick={handleCollectStarch}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="relative w-16 h-24">
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-100 to-blue-200 dark:from-transparent dark:via-blue-900 dark:to-blue-800 rounded-lg border-2 border-blue-400" />
                                                </div>
                                                <span className="text-sm font-medium">Starch Solution</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Amylase Enzyme */}
                                    {starchCollected && !amylaseCollected && (
                                        <motion.div
                                            onClick={handleCollectAmylase}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-green-300 dark:border-green-700 hover:border-green-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Droplets className="h-20 w-20 text-green-600" />
                                                <span className="text-sm font-medium">Amylase Enzyme</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Iodine */}
                                    {amylaseCollected && !iodineCollected && (
                                        <motion.div
                                            onClick={handleCollectIodine}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-amber-300 dark:border-amber-700 hover:border-amber-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Droplets className="h-20 w-20 text-amber-700" />
                                                <span className="text-sm font-medium">Iodine Solution</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Collected Items Display */}
                                    <div className="w-full mt-4 flex gap-4 justify-center flex-wrap">
                                        {tubeCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-gray-600" />
                                                <span className="text-sm">Test Tube</span>
                                            </motion.div>
                                        )}
                                        {starchCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm">Starch</span>
                                            </motion.div>
                                        )}
                                        {amylaseCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <span className="text-sm">Amylase</span>
                                            </motion.div>
                                        )}
                                        {iodineCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-amber-600" />
                                                <span className="text-sm">Iodine</span>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {(currentStep === 'add-starch' || currentStep === 'add-amylase' || currentStep === 'waiting' || currentStep === 'add-iodine') && (
                    <motion.div
                        key="experiment"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-blue-200 dark:border-blue-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Droplets className="h-5 w-5 text-blue-600" />
                                    Interactive Experiment
                                </CardTitle>
                                <CardDescription>Click on items to add them to the test tube</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Experiment Area */}
                                <div className="relative min-h-[500px] bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 p-8">
                                    {/* Test Tube */}
                                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                                        <motion.div
                                            onClick={currentStep === 'add-starch' ? handleAddStarch : undefined}
                                            whileHover={currentStep === 'add-starch' ? { scale: 1.05 } : {}}
                                            className={cn(
                                                "relative w-32 h-64",
                                                currentStep === 'add-starch' && "cursor-pointer"
                                            )}
                                        >
                                            {/* Tube body */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100/20 dark:to-gray-800/20 rounded-b-2xl border-4 border-gray-400" 
                                                 style={{ clipPath: 'polygon(15% 0, 85% 0, 90% 100%, 10% 100%)' }} />
                                            
                                            {/* Solution */}
                                            {starchAdded && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: '60%' }}
                                                    className={cn(
                                                        "absolute bottom-2 left-1/2 -translate-x-1/2 w-[75%] rounded-b-xl transition-colors duration-700",
                                                        stage === 'no-starch' && "bg-amber-300/70 dark:bg-amber-600/50",
                                                        stage === 'enzyme-working' && "bg-blue-200/70 dark:bg-blue-700/50",
                                                        stage === 'starch-only' && "bg-blue-300/70 dark:bg-blue-600/50"
                                                    )}
                                                >
                                                    {/* Bubbles during reaction */}
                                                    {currentStep === 'waiting' && (
                                                        <>
                                                            {[...Array(5)].map((_, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    className="absolute w-2 h-2 bg-white/60 rounded-full"
                                                                    animate={{
                                                                        y: [0, -100],
                                                                        opacity: [1, 0],
                                                                        x: [(i - 2) * 5, (i - 2) * 10]
                                                                    }}
                                                                    transition={{
                                                                        duration: 2,
                                                                        repeat: Infinity,
                                                                        delay: i * 0.2
                                                                    }}
                                                                    style={{ bottom: '10%', left: '50%' }}
                                                                />
                                                            ))}
                                                        </>
                                                    )}
                                                </motion.div>
                                            )}
                                            
                                            {currentStep === 'add-starch' && (
                                                <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center whitespace-nowrap font-medium bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded text-sm">
                                                    Click to Add Starch
                                                </p>
                                            )}
                                        </motion.div>
                                    </div>
                                    
                                    {/* Amylase Dropper */}
                                    {currentStep === 'add-amylase' && (
                                        <motion.div
                                            onClick={handleAddAmylase}
                                            whileHover={{ scale: 1.1, y: -5 }}
                                            whileTap={{ scale: 0.9 }}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute top-16 left-1/2 -translate-x-1/2 cursor-pointer"
                                        >
                                            <Droplets className="h-16 w-16 text-green-600" />
                                            <p className="text-center text-sm font-medium bg-green-100 dark:bg-green-900 px-3 py-1 rounded mt-2">
                                                Click to Add Enzyme
                                            </p>
                                        </motion.div>
                                    )}
                                    
                                    {/* Timer Display */}
                                    {currentStep === 'waiting' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="absolute top-8 left-8"
                                        >
                                            <Card className="bg-white/90 dark:bg-gray-900/90">
                                                <CardHeader className="p-3">
                                                    <CardTitle className="text-sm flex items-center gap-2">
                                                        <Clock className="h-4 w-4" />
                                                        Reaction Timer
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-3 pt-0">
                                                    <div className="text-3xl font-mono font-bold text-center">
                                                        {timePassed}s
                                                    </div>
                                                    <p className="text-xs text-center text-muted-foreground mt-1">
                                                        Enzyme working...
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )}
                                    
                                    {/* Iodine Dropper */}
                                    {currentStep === 'add-iodine' && (
                                        <motion.div
                                            onClick={handleAddIodine}
                                            whileHover={{ scale: 1.1, y: -5 }}
                                            whileTap={{ scale: 0.9 }}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute top-16 left-1/2 -translate-x-1/2 cursor-pointer"
                                        >
                                            <Droplets className="h-16 w-16 text-amber-700" />
                                            <p className="text-center text-sm font-medium bg-amber-100 dark:bg-amber-900 px-3 py-1 rounded mt-2">
                                                Click to Test with Iodine
                                            </p>
                                        </motion.div>
                                    )}
                                </div>
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
                        <Card className="border-2 border-green-200 dark:border-green-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    Experiment Results
                                </CardTitle>
                                <CardDescription>Analysis of your observations</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-6 rounded-lg border-2 border-green-200 dark:border-green-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Observations:</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Initial State:</strong> Test tube contained starch solution (blue color)
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Enzyme Added:</strong> Amylase enzyme began breaking down starch molecules
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Reaction Time:</strong> 10 seconds for enzyme to break down most starch
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Iodine Test Result:</strong> Orange/amber color - NO starch remaining!
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold mb-2">Scientific Explanation:</h3>
                                    <p className="text-sm text-muted-foreground">
                                        The enzyme <strong>amylase</strong> catalyzed the hydrolysis of starch (a polysaccharide) into simpler sugars. 
                                        The absence of blue-black color when iodine was added proves that the starch has been broken down. 
                                        This same process happens in your mouth when you chew starchy foods - saliva contains amylase that begins digestion immediately!
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
                                <CardDescription>Answer these questions about enzyme action</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. What substance does the enzyme amylase break down?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'protein', label: 'Protein' },
                                            { value: 'starch', label: 'Starch', isCorrect: true },
                                            { value: 'fat', label: 'Fat' },
                                            { value: 'cellulose', label: 'Cellulose' }
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
                                    <p className="font-medium">2. What is the role of an enzyme in a chemical reaction?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'provides-energy', label: 'It provides energy for the reaction' },
                                            { value: 'catalyst', label: 'It speeds up the reaction without being consumed', isCorrect: true },
                                            { value: 'substrate', label: 'It is the substance being broken down' },
                                            { value: 'product', label: 'It is the final product of the reaction' }
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
                                    <p className="font-medium">3. What does the iodine test detect?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'glucose', label: 'The presence of glucose' },
                                            { value: 'protein', label: 'The presence of protein' },
                                            { value: 'iodine', label: 'The presence of starch', isCorrect: true },
                                            { value: 'enzyme', label: 'The presence of enzymes' }
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
                        <Card className="border-2 border-green-200 dark:border-green-800">
                            <CardHeader className="text-center">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="flex justify-center mb-4"
                                >
                                    <Trophy className="h-16 w-16 text-yellow-500" />
                                </motion.div>
                                <CardTitle>Lab Complete!</CardTitle>
                                <CardDescription>You've mastered enzyme action</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg border-2 border-green-200 dark:border-green-800">
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span>Enzymes are biological catalysts that speed up reactions</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span>Amylase breaks down starch into simpler sugars</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span>Iodine test detects the presence of starch</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span>This process is essential for digestion in living organisms</span>
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
