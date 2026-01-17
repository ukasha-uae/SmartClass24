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
    Droplets, Egg, Milk, Utensils, Apple, Nut, TestTube,
    Sparkles, Trophy, Award, Eye, EyeOff 
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherVoice } from './TeacherVoice';
import { useLabProgress } from '@/stores/lab-progress-store';
import confetti from 'canvas-confetti';
import { LabSupplies, SupplyItem } from './LabSupplies';

type TestStep = 'intro' | 'collect-supplies' | 'select-food' | 'add-reagent' | 'observe' | 'result' | 'quiz' | 'complete';
type FoodSample = 'Egg White' | 'Milk' | 'Bread' | 'Apple' | 'Groundnut Paste';
type ProteinLevel = 'none' | 'low' | 'medium' | 'high';

interface FoodInfo {
    proteinLevel: ProteinLevel;
    icon: React.ElementType;
    colorFrom: string;
    colorTo: string;
    description: string;
}

const foodData: Record<FoodSample, FoodInfo> = {
    'Egg White': { 
        proteinLevel: 'high', 
        icon: Egg,
        colorFrom: 'from-blue-400',
        colorTo: 'to-purple-700',
        description: 'Deep purple color - High protein content'
    },
    'Milk': { 
        proteinLevel: 'medium', 
        icon: Milk,
        colorFrom: 'from-blue-400',
        colorTo: 'to-purple-400',
        description: 'Purple color - Moderate protein content'
    },
    'Bread': { 
        proteinLevel: 'low', 
        icon: Utensils,
        colorFrom: 'from-blue-400',
        colorTo: 'to-blue-500',
        description: 'Light blue-purple - Low protein content'
    },
    'Apple': { 
        proteinLevel: 'none', 
        icon: Apple,
        colorFrom: 'from-blue-400',
        colorTo: 'to-blue-400',
        description: 'Blue (no change) - No protein detected'
    },
    'Groundnut Paste': { 
        proteinLevel: 'medium', 
        icon: Nut,
        colorFrom: 'from-blue-400',
        colorTo: 'to-purple-500',
        description: 'Purple color - Moderate protein content'
    },
};

const foodOptions: FoodSample[] = ['Egg White', 'Milk', 'Bread', 'Apple', 'Groundnut Paste'];

export function BiuretTestLabEnhanced() {
    const { toast } = useToast();
    
    // Lab state
    const [currentStep, setCurrentStep] = React.useState<TestStep>('intro');
    const [selectedFood, setSelectedFood] = React.useState<FoodSample | null>(null);
    const [result, setResult] = React.useState<ProteinLevel | null>(null);
    const [showDroplets, setShowDroplets] = React.useState(false);
    const [reactionProgress, setReactionProgress] = React.useState(0);
    const [showSafetyGear, setShowSafetyGear] = React.useState(true);
    const [collectedItems, setCollectedItems] = React.useState<string[]>([]);
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [currentColor, setCurrentColor] = React.useState({ r: 59, g: 130, b: 246 }); // Blue-500
    const [targetColor, setTargetColor] = React.useState({ r: 59, g: 130, b: 246 });
    const [isColorAnimating, setIsColorAnimating] = React.useState(false);
    
    // Teacher voice
    const [teacherMessage, setTeacherMessage] = React.useState('');
    
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
    const hasCompleted = isLabCompleted('biuret-test');
    const labProgress = getLabCompletion('biuret-test');
    
    // Reaction progress effect
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (currentStep === 'observe' && reactionProgress < 100) {
            interval = setInterval(() => {
                setReactionProgress(prev => Math.min(prev + 10, 100));
            }, 200);
        }
        return () => clearInterval(interval);
    }, [currentStep, reactionProgress]);

    // Complete reaction when progress reaches 100
    React.useEffect(() => {
        if (reactionProgress >= 100 && currentStep === 'observe' && selectedFood && !result) {
            const proteinLevel = foodData[selectedFood].proteinLevel;
            setResult(proteinLevel);
            
            // Ensure color is set to final target
            const targetColors: Record<ProteinLevel, { r: number; g: number; b: number }> = {
                'none': { r: 59, g: 130, b: 246 }, // Blue-500
                'low': { r: 99, g: 102, b: 241 }, // Indigo-500
                'medium': { r: 147, g: 51, b: 234 }, // Purple-600
                'high': { r: 126, g: 34, b: 206 }, // Purple-700
            };
            setCurrentColor(targetColors[proteinLevel]);
            
            setTimeout(() => {
                setCurrentStep('result');
                const messages: Record<ProteinLevel, string> = {
                    'high': `Excellent observation! The solution turned deep purple, indicating HIGH protein content. ${selectedFood} is rich in proteins, which contain peptide bonds that react with copper ions in the Biuret reagent.`,
                    'medium': `Good! The solution turned purple, showing MODERATE protein levels. ${selectedFood} contains a decent amount of protein that reacted with the Biuret solution.`,
                    'low': `The solution shows a light blue-purple color, indicating LOW protein content. ${selectedFood} has some protein, but not much.`,
                    'none': `Notice the solution stayed blue with no color change. This means NO protein was detected in ${selectedFood}. The Biuret test is negative.`
                };
                setTeacherMessage(messages[proteinLevel]);
            }, 500);
        }
    }, [reactionProgress, currentStep, selectedFood, result]);


    // Initial intro
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage('Welcome to the Biuret Test Laboratory! The Biuret test is used to detect proteins in food samples. When Biuret reagent reacts with peptide bonds in proteins, it changes from blue to purple. The deeper the purple, the more protein present. Ready to test some foods? Click Start Experiment!');
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setCurrentStep('collect-supplies');
        setTeacherMessage('Before we begin, let\'s collect all the supplies we need for the Biuret test. Click on each item to collect it!');
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
        setTeacherMessage('Excellent! All supplies collected. Now choose a food sample to test for protein. We have egg white, milk, bread, apple, and groundnut paste. Each food has different protein levels. Which one would you like to test?');
        setCurrentStep('select-food');
}, [toast]);

    // Define lab supplies
    const supplies: SupplyItem[] = [
        { id: 'test-tubes', name: 'Test Tubes', emoji: '🧪', description: 'Containers for food samples', required: true },
        { id: 'biuret-reagent', name: 'Biuret Reagent', emoji: '💧', description: 'Blue solution for protein detection', required: true },
        { id: 'food-samples', name: 'Food Samples', emoji: '🍽️', description: 'Various foods to test', required: true },
        { id: 'pipette', name: 'Pipette', emoji: '🔬', description: 'For adding reagent', required: true },
        { id: 'safety-gear', name: 'Safety Gear', emoji: '🥽', description: 'Goggles and lab coat', required: true },
    ];

    const handleFoodSelect = (food: FoodSample) => {
        setSelectedFood(food);
        
        const messages: Record<FoodSample, string> = {
            'Egg White': 'Excellent choice! Egg white is almost pure protein - albumin. It should give a strong purple color. Click Add Biuret Reagent to test it.',
            'Milk': 'Good selection! Milk contains proteins like casein and whey. It should show a moderate purple reaction. Click Add Biuret Reagent to proceed.',
            'Bread': 'Interesting! Bread is mainly carbohydrate from wheat flour, with some protein from gluten. Click Add Biuret Reagent to see the result.',
            'Apple': 'Great for comparison! Apples are mostly water, sugar, and fiber with very little protein. Click Add Biuret Reagent to test.',
            'Groundnut Paste': 'Nice choice! Groundnuts (peanuts) are known for protein and healthy fats. Click Add Biuret Reagent to see the color change.'
        };
        
        setTeacherMessage(messages[food]);
    };

    const handleAddReagent = () => {
        if (!selectedFood) return;
        
        setCurrentStep('add-reagent');
        setShowDroplets(true);
        setTeacherMessage(`Adding Biuret reagent to ${selectedFood}... Watch as the blue reagent mixes with the food sample. The copper ions in the reagent will react with any peptide bonds present.`);
        
        // Set target color based on protein level
        const proteinLevel = foodData[selectedFood].proteinLevel;
        const targetColors: Record<ProteinLevel, { r: number; g: number; b: number }> = {
            'none': { r: 59, g: 130, b: 246 }, // Blue-500
            'low': { r: 99, g: 102, b: 241 }, // Indigo-500
            'medium': { r: 147, g: 51, b: 234 }, // Purple-600
            'high': { r: 126, g: 34, b: 206 }, // Purple-700
        };
        setTargetColor(targetColors[proteinLevel]);
        
        setTimeout(() => {
            setShowDroplets(false);
            setCurrentStep('observe');
            setReactionProgress(0);
            setIsColorAnimating(true);
            setTeacherMessage('The reagent is reacting! Watch carefully as the color changes. The intensity of the purple color tells us how much protein is present.');
        }, 2500);
    };

    // Gradual color change animation
    React.useEffect(() => {
        if (currentStep === 'observe' && selectedFood && !result && isColorAnimating) {
            const startColor = { r: 59, g: 130, b: 246 }; // Blue-500
            const duration = 3000; // 3 seconds
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const r = Math.round(startColor.r + (targetColor.r - startColor.r) * progress);
                const g = Math.round(startColor.g + (targetColor.g - startColor.g) * progress);
                const b = Math.round(startColor.b + (targetColor.b - startColor.b) * progress);
                
                setCurrentColor({ r, g, b });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setIsColorAnimating(false);
                }
            };
            
            requestAnimationFrame(animate);
        }
    }, [currentStep, selectedFood, targetColor, result, isColorAnimating]);

    const handleQuizSubmit = () => {
        if (quizSubmitted) return;
        
        setQuizSubmitted(true);
        
        const isCorrect1 = selectedAnswer1 === 'Egg White';
        const isCorrect2 = selectedAnswer2 === 'peptide-bonds';
        const isCorrect3 = selectedAnswer3 === 'deep-purple';
        const correctCount = [isCorrect1, isCorrect2, isCorrect3].filter(Boolean).length;
        
        if (correctCount === 3) {
            // Perfect - all 3 correct
            setQuizFeedback(`Perfect! You got all 3 correct! 🎉 Excellent understanding of the Biuret test!`);
            setTeacherMessage(`Outstanding! Perfect score! You truly understand the BIURET TEST! 🎉 Let me summarize what you learned: (1) EGG WHITE has the highest protein content - it's almost pure ALBUMIN protein. That's why it shows the DEEPEST purple color in the test. Other high-protein foods: meat, fish, milk, groundnuts. (2) The Biuret reagent reacts with PEPTIDE BONDS - the links between amino acids in protein chains. When copper(II) ions (Cu²⁺) in the blue Biuret solution meet peptide bonds, they form a COMPLEX that appears PURPLE. No protein = no peptide bonds = stays blue! (3) DEEP PURPLE color indicates HIGH protein content. The color intensity is directly proportional to protein concentration: No color change (blue) = no protein. Light purple = low protein. Purple = moderate protein. Deep/dark purple = high protein! This is a QUALITATIVE test - we see if protein is present and estimate how much. The Biuret test is named after biuret (a compound formed when urea is heated), which was the first substance shown to give this reaction. In real labs, this test helps detect proteins in food, urine samples, and biological experiments. You've mastered protein detection!`);
            
            if (!hasCompleted) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                const earnedXP = markLabComplete('biuret-test', 100, timeSpent);
                
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                
                setXpEarned(earnedXP);
                setShowCelebration(true);
                setTimeout(() => {
                    setShowCelebration(false);
                    setCurrentStep('complete');
                }, 2000);
            } else {
                setCurrentStep('complete');
            }
        } else if (correctCount === 2) {
            // Good effort - 2 out of 3 correct
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Let me clarify the concepts you missed.`);
            setTeacherMessage(`Good effort! You got 2 out of 3 correct about the Biuret test. Let me clarify: (1) HIGHEST PROTEIN: Egg white (albumin) has the HIGHEST protein concentration - almost 90% protein! It's used as a positive control in protein tests. Milk has moderate protein (3-4%). Groundnut paste has good protein but also lots of fat. Bread has some gluten protein but mostly carbs. Apple has almost NO protein. Rank: Egg white > Groundnut paste > Milk > Bread > Apple. (2) WHAT BIURET REAGENT DETECTS: The reagent specifically reacts with PEPTIDE BONDS - the chemical bonds (C-N) that link amino acids together in protein chains. Proteins are made of amino acids: Amino acid 1 - PEPTIDE BOND - Amino acid 2 - PEPTIDE BOND - Amino acid 3... The copper(II) ions (Cu²⁺) in the blue alkaline solution form a VIOLET COMPLEX with these bonds. At least 2 peptide bonds are needed for the reaction (so at least 3 amino acids linked). It does NOT detect individual amino acids, fats, or carbohydrates! (3) COLOR INTERPRETATION: DEEP/DARK PURPLE = HIGH protein. The more protein present, the more peptide bonds, the more copper complexes formed, the deeper the purple color! Blue (no change) = no protein. Light blue-purple = traces. Purple = moderate protein. Deep purple = high protein. This is a SEMI-QUANTITATIVE test - we can estimate "how much" by color intensity. Review these concepts and try the quiz again!`);
            
            if (!hasCompleted) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                const earnedXP = markLabComplete('biuret-test', 75, timeSpent);
                setXpEarned(earnedXP);
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 5000);
            }
        } else {
            // Needs work - 0 or 1 correct
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Don't worry! Let me explain the Biuret test from the beginning.`);
            setTeacherMessage(`Keep trying! You got ${correctCount} answer${correctCount === 1 ? '' : 's'} correct. Let me explain the BIURET TEST step by step: The Biuret test detects PROTEINS by reacting with PEPTIDE BONDS. WHAT IS PROTEIN? Large molecules made of AMINO ACIDS linked like a chain. The links = PEPTIDE BONDS. Examples: enzymes, antibodies, hair (keratin), muscle (myosin), egg white (albumin). BIURET REAGENT contains copper(II) sulfate (blue) + sodium hydroxide (alkaline). HOW IT WORKS: Add reagent to sample. If protein present, Cu²⁺ ions react with peptide bonds forming a PURPLE COMPLEX. Color changes blue → purple. RESULTS: Blue (no change) = NO protein (Apple). Light purple = LOW protein (Bread). Purple = MODERATE protein (Milk, Groundnut). Deep purple = HIGH protein (Egg white - 90% pure albumin!). KEY POINTS: (1) EGG WHITE shows DEEPEST purple - almost pure protein! (2) Reagent detects PEPTIDE BONDS - links between amino acids. NOT fats or carbs! (3) DEEP PURPLE = HIGH protein. Color intensity = protein amount. The test is named after biuret compound. Used in food testing, medical labs, research. Try again!`);
            
            if (!hasCompleted) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                const earnedXP = markLabComplete('biuret-test', 50, timeSpent);
                setXpEarned(earnedXP);
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 5000);
            }
        }
    };

    const handleReset = () => {
        setCurrentStep('intro');
        setSelectedFood(null);
        setResult(null);
        setShowDroplets(false);
        setReactionProgress(0);
        setCollectedItems([]);
        setShowSupplies(true);
        setCurrentColor({ r: 59, g: 130, b: 246 });
        setTargetColor({ r: 59, g: 130, b: 246 });
        setIsColorAnimating(false);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setXpEarned(0);
        setShowCelebration(false);
        setTeacherMessage('Welcome back! Ready to test another food for protein? Each one shows a different color intensity. Click Start Experiment when ready!');
    };

    const objectiveText = "To learn how to use the Biuret test to detect proteins in various food samples by observing characteristic color changes.";
    const theoryText = "The Biuret test is a chemical test used to detect the presence of proteins. Proteins contain peptide bonds (CO-NH) that link amino acids together. When Biuret reagent (which contains copper sulfate in alkaline solution) is added to a protein sample, the copper ions form a complex with the peptide bonds, producing a purple or violet color. The intensity of the color is proportional to the amount of protein present: no protein shows blue (no change), low protein shows light blue-purple, moderate protein shows purple, and high protein shows deep purple.";
    const safetyText = "Handle Biuret reagent with care as it contains sodium hydroxide, which is caustic and can burn skin. Always wear safety goggles and lab coat. Avoid contact with skin and eyes. If contact occurs, rinse immediately with plenty of water. Work in a well-ventilated area. Dispose of chemicals properly according to laboratory guidelines.";

    return (
        <div className="relative min-h-screen pb-20 overflow-hidden">
            {/* Premium Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-950/20 dark:via-violet-950/20 dark:to-indigo-950/20" />
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-r from-purple-200/30 to-violet-200/30 dark:from-purple-800/20 dark:to-violet-800/20 blur-3xl"
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
            {/* Completion Badge */}
            {hasCompleted && labProgress && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-xl border-2 border-amber-300 dark:border-amber-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500 rounded-full">
                            <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-amber-900 dark:text-amber-100">Lab Completed!</div>
                            <div className="text-sm text-amber-700 dark:text-amber-300">
                                Score: {labProgress.score}%
                            </div>
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-amber-200 text-amber-900">
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
                    emotion={currentStep === 'complete' || currentStep === 'result' || quizSubmitted ? 'celebrating' : result ? 'happy' : 'explaining'}
                    context={{
                        attempts: reactionProgress,
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

            {/* Premium Header Card */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="border-2 border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-br from-purple-50/80 via-violet-50/80 to-indigo-50/80 dark:from-purple-950/30 dark:via-violet-950/30 dark:to-indigo-950/30 backdrop-blur-sm shadow-xl">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            🧪 Biuret Test for Protein
                        </CardTitle>
                        <CardDescription className="text-base">
                            {objectiveText}
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
                        description="Click on each item to collect it. We need all supplies to conduct the Biuret test."
                    />
                </motion.div>
            )}

            {/* Main Lab Interface */}
            <AnimatePresence mode="wait">
                {(currentStep === 'intro' || currentStep === 'select-food' || currentStep === 'add-reagent' || currentStep === 'observe' || currentStep === 'result') && (
                    <motion.div
                        key="main-lab"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-br from-purple-50/80 via-violet-50/80 to-indigo-50/80 dark:from-purple-950/30 dark:via-violet-950/30 dark:to-indigo-950/30 backdrop-blur-sm shadow-xl">
                            <CardHeader className="relative z-10 bg-gradient-to-r from-purple-100/50 to-violet-100/50 dark:from-purple-900/30 dark:to-violet-900/30 border-b border-purple-200/50 dark:border-purple-800/50">
                                <CardTitle className="flex items-center justify-between">
                                    <span className="text-xl">🧪 Interactive Biuret Test Lab</span>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setShowSafetyGear(!showSafetyGear)}
                                        className={cn(
                                            "transition-colors",
                                            showSafetyGear && "border-green-500 text-green-600",
                                            "text-slate-700 dark:text-slate-300",
                                            "hover:text-green-700 dark:hover:text-green-300"
                                        )}
                                    >
                                        {showSafetyGear ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                                        Safety {showSafetyGear ? 'ON' : 'OFF'}
                                    </Button>
                                </CardTitle>
                                <CardDescription>Test foods for protein using the purple color reaction</CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10 space-y-6 pt-6">
                                {/* Start Button */}
                                {currentStep === 'intro' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-12 space-y-4"
                                    >
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
                                            <TestTube className="h-24 w-24 text-purple-500 drop-shadow-lg" />
                                        </motion.div>
                                        <Button 
                                            size="lg" 
                                            onClick={handleStartExperiment}
                                            className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg px-8"
                                        >
                                            Start Experiment 🧪
                                        </Button>
                                    </motion.div>
                                )}

                                {/* Food Selection */}
                                {currentStep === 'select-food' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-4"
                                    >
                                        <Label className="text-lg font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                            <Utensils className="h-5 w-5" />
                                            Select a Food Sample
                                        </Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {foodOptions.map(food => {
                                                const foodInfo = foodData[food];
                                                const IconComponent = foodInfo.icon;
                                                return (
                                                    <motion.button
                                                        key={food}
                                                        whileHover={{ scale: 1.05, y: -5 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleFoodSelect(food)}
                                                        className={cn(
                                                            "h-auto w-full flex-col gap-2 py-4 rounded-xl border-2 transition-all shadow-lg",
                                                            selectedFood === food
                                                                ? "bg-gradient-to-br from-purple-600 to-violet-600 text-white border-purple-700 shadow-xl"
                                                                : "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-purple-300 dark:border-purple-700 hover:border-purple-500 hover:shadow-xl text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300"
                                                        )}
                                                    >
                                                        <IconComponent className="h-8 w-8" />
                                                        <span className="text-sm font-medium">{food}</span>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Test Tube Visualization */}
                                {(currentStep === 'add-reagent' || currentStep === 'observe' || currentStep === 'result') && selectedFood && (
                                    <div className="relative flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-purple-950/30 rounded-xl border-2 border-purple-200/50 dark:border-purple-800/50 min-h-[450px] shadow-xl">
                            {/* Lab Bench */}
                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-amber-900/20 to-transparent" />
                            
                            {/* Test Tube */}
                            <div className="relative">
                                {/* Stand */}
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-3 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 rounded-full shadow-lg" />
                                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-24 h-6 bg-gradient-to-b from-gray-500 to-gray-600 rounded-t-full" />

                                <motion.div className="relative w-28 h-80">
                                    {/* Glass tube */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/40 via-white/20 to-blue-50/40 rounded-t-full rounded-b-3xl border-4 border-gray-300/50 shadow-2xl backdrop-blur-sm">
                                        {/* Liquid */}
                                        <AnimatePresence>
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ 
                                                    height: '60%',
                                                    opacity: 1
                                                }}
                                                className="absolute inset-x-2 bottom-2 rounded-b-2xl transition-all duration-2000"
                                                style={{
                                                    background: selectedFood && (currentStep === 'observe' || currentStep === 'result')
                                                        ? `linear-gradient(to bottom, rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b}), rgb(${Math.max(0, currentColor.r - 30)}, ${Math.max(0, currentColor.g - 30)}, ${Math.max(0, currentColor.b - 30)}))`
                                                        : 'linear-gradient(to bottom, rgb(59, 130, 246), rgb(37, 99, 235))'
                                                }}
                                            >
                                                {/* Particles */}
                                                <div className="absolute inset-0 overflow-hidden rounded-b-2xl">
                                                    {[...Array(5)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="absolute w-2 h-2 bg-white/30 rounded-full"
                                                            initial={{ x: Math.random() * 80, y: 0 }}
                                                            animate={{ 
                                                                y: [0, 100, 0],
                                                                x: Math.random() * 80
                                                            }}
                                                            transition={{
                                                                repeat: Infinity,
                                                                duration: 3 + Math.random() * 2,
                                                                delay: i * 0.5
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>

                                        {/* Reagent droplets */}
                                        <AnimatePresence>
                                            {showDroplets && (
                                                <>
                                                    {[...Array(8)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ y: -20, opacity: 1, scale: 0 }}
                                                            animate={{ 
                                                                y: 220,
                                                                scale: [0, 1, 0.5],
                                                                opacity: [1, 1, 0]
                                                            }}
                                                            exit={{ opacity: 0 }}
                                                            transition={{ duration: 1.2, delay: i * 0.15 }}
                                                            className="absolute left-1/2 -translate-x-1/2"
                                                        >
                                                            <Droplets className="h-4 w-4 text-blue-600" />
                                                        </motion.div>
                                                    ))}
                                                </>
                                            )}
                                        </AnimatePresence>

                                        {/* Glass shine */}
                                        <div className="absolute inset-y-0 left-1 w-4 bg-gradient-to-r from-white/40 to-transparent rounded-l-full" />
                                    </div>

                                    {/* Label */}
                                    <div className="absolute -right-4 sm:-right-24 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg border text-xs">
                                        <div className="font-bold text-xs sm:text-sm whitespace-nowrap">{selectedFood}</div>
                                        <div className="text-muted-foreground mt-1 text-[10px] sm:text-xs">+ Biuret Reagent</div>
                                        {result && (
                                            <div className="mt-2 font-semibold text-purple-600 capitalize text-[10px] sm:text-xs">{result} Protein</div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Safety gear indicator */}
                            {showSafetyGear && (
                                <div className="absolute top-4 left-4 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg border border-green-500 flex items-center gap-2">
                                    <div className="text-2xl">🥽</div>
                                    <div className="text-xs font-semibold text-green-700 dark:text-green-400">Safety ON</div>
                                </div>
                            )}

                            {/* Progress indicator */}
                            {currentStep === 'observe' && (
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                                    <div className="text-xs font-semibold mb-1">Reaction Progress</div>
                                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div 
                                            className="h-full bg-purple-500"
                                            style={{ width: `${reactionProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                                {/* Result Display */}
                                <AnimatePresence>
                                    {result && currentStep === 'result' && selectedFood && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-6 bg-gradient-to-br from-purple-100/60 to-violet-100/60 dark:from-purple-900/30 dark:to-violet-900/30 rounded-xl border-2 border-purple-300/50 dark:border-purple-700/50 shadow-lg"
                                        >
                                <div className="flex flex-col sm:flex-row items-start gap-4">
                                    <div className="p-3 bg-purple-500 rounded-full flex-shrink-0">
                                        <CheckCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h3 className="font-bold text-lg text-purple-900 dark:text-purple-100">
                                            Biuret Test Complete! ✓
                                        </h3>
                                        <p className="font-medium text-purple-800 dark:text-purple-200">
                                            {foodData[selectedFood].description}
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
                                            <div>
                                                <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Food Sample</div>
                                                <div className="text-sm font-bold text-purple-900 dark:text-purple-100">{selectedFood}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Protein Level</div>
                                                <div className="text-sm font-bold text-purple-900 dark:text-purple-100 capitalize">{result}</div>
                                            </div>
                                        </div>
                                    </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            </CardContent>
                            <CardFooter className="relative z-10 flex flex-col gap-3 bg-gradient-to-r from-purple-50/50 to-violet-50/50 dark:from-purple-950/30 dark:to-violet-950/30 border-t border-purple-200/50 dark:border-purple-800/50">
                                {currentStep === 'select-food' && selectedFood && (
                                    <Button 
                                        size="lg" 
                                        className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                                        onClick={handleAddReagent}
                                        data-action-button
                                    >
                                        <Droplets className="h-5 w-5 mr-2" />
                                        Add Biuret Reagent
                                    </Button>
                                )}
                                
                                {currentStep !== 'intro' && currentStep !== 'complete' && (
                                    <Button 
                                        variant="outline" 
                                        onClick={handleReset}
                                        className="w-full text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300"
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Reset & Try Another Food
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quiz Section */}
            {currentStep === 'result' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    data-quiz-section
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
                                <p className="font-semibold text-lg text-slate-700 dark:text-slate-300">
                                    1. Which food sample would show the DEEPEST purple color in the Biuret test?
                                </p>
                                <RadioGroup 
                                    value={selectedAnswer1 || ''} 
                                    onValueChange={setSelectedAnswer1}
                                    disabled={quizSubmitted}
                                >
                                    {foodOptions.map(food => (
                                        <div key={food} className="flex items-center space-x-2 py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all shadow-sm hover:shadow-md">
                                            <RadioGroupItem value={food} id={`q1-${food}`} />
                                            <Label htmlFor={`q1-${food}`} className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">{food}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                            
                            {/* Question 2 */}
                            <div className="space-y-3">
                                <p className="font-semibold text-lg text-slate-700 dark:text-slate-300">
                                    2. What does the Biuret reagent specifically react with to detect proteins?
                                </p>
                                <RadioGroup 
                                    value={selectedAnswer2 || ''} 
                                    onValueChange={setSelectedAnswer2}
                                    disabled={quizSubmitted}
                                >
                                    <div className="flex items-center space-x-2 py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all shadow-sm hover:shadow-md">
                                        <RadioGroupItem value="peptide-bonds" id="q2-1" />
                                        <Label htmlFor="q2-1" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">Peptide bonds between amino acids</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all shadow-sm hover:shadow-md">
                                        <RadioGroupItem value="carbohydrates" id="q2-2" />
                                        <Label htmlFor="q2-2" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">Carbohydrates and sugars</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all shadow-sm hover:shadow-md">
                                        <RadioGroupItem value="fats" id="q2-3" />
                                        <Label htmlFor="q2-3" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">Fats and lipids</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            
                            {/* Question 3 */}
                            <div className="space-y-3">
                                <p className="font-semibold text-lg text-slate-700 dark:text-slate-300">
                                    3. What color indicates HIGH protein content in the Biuret test?
                                </p>
                                <RadioGroup 
                                    value={selectedAnswer3 || ''} 
                                    onValueChange={setSelectedAnswer3}
                                    disabled={quizSubmitted}
                                >
                                    <div className="flex items-center space-x-2 py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all shadow-sm hover:shadow-md">
                                        <RadioGroupItem value="blue" id="q3-1" />
                                        <Label htmlFor="q3-1" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">Blue (no color change)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all shadow-sm hover:shadow-md">
                                        <RadioGroupItem value="light-purple" id="q3-2" />
                                        <Label htmlFor="q3-2" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">Light purple</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all shadow-sm hover:shadow-md">
                                        <RadioGroupItem value="deep-purple" id="q3-3" />
                                        <Label htmlFor="q3-3" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">Deep/dark purple</Label>
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
                        <CardFooter className="relative z-10 flex flex-col gap-3 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/30 dark:to-indigo-950/30 border-t border-purple-200/50 dark:border-purple-800/50">
                            <Button 
                                onClick={handleQuizSubmit} 
                                disabled={!selectedAnswer1 || !selectedAnswer2 || !selectedAnswer3 || quizSubmitted}
                                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                                size="lg"
                            >
                                {quizSubmitted ? "Quiz Completed ✓" : "Submit Answers"}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            )}

            {/* Lab Complete Section */}
            {currentStep === 'complete' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="relative z-10"
                >
                    <Card className="border-2 border-purple-400/50 dark:border-purple-600/50 bg-gradient-to-br from-purple-50/90 via-violet-50/90 to-indigo-50/90 dark:from-purple-950/40 dark:via-violet-950/40 dark:to-indigo-950/40 backdrop-blur-sm shadow-2xl">
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
                                    className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent"
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
                                    className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-200/50 dark:border-purple-800/50 shadow-lg"
                                >
                                    <h3 className="font-semibold text-lg mb-4 text-slate-700 dark:text-slate-300">What You've Learned:</h3>
                                    <ul className="space-y-2 text-left text-slate-600 dark:text-slate-400">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>How to use the Biuret test to detect proteins in food samples</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>That Biuret reagent reacts with peptide bonds in proteins</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>How to interpret color changes: blue = no protein, purple = protein present</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>That deeper purple indicates higher protein content</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>Which foods are high in protein (egg white) vs low (apple)</span>
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
                                        onClick={handleReset}
                                        className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
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

            {showCelebration && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                >
                    <div className="text-6xl">🧪✨</div>
                </motion.div>
            )}
            </div>
        </div>
    );
}

