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

type TestStep = 'intro' | 'select-food' | 'add-reagent' | 'observe' | 'result' | 'quiz';
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
    
    // Teacher voice
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Quiz
    const [quizAnswer, setQuizAnswer] = React.useState<string>('');
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);
    
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
        if (reactionProgress >= 100 && currentStep === 'observe' && selectedFood) {
            const proteinLevel = foodData[selectedFood].proteinLevel;
            setResult(proteinLevel);
            
            setTimeout(() => {
                setCurrentStep('result');
                const messages: Record<ProteinLevel, string> = {
                    'high': `Excellent observation! The solution turned deep purple, indicating HIGH protein content. ${selectedFood} is rich in proteins, which contain peptide bonds that react with copper ions in the Biuret reagent.`,
                    'medium': `Good! The solution turned purple, showing MODERATE protein levels. ${selectedFood} contains a decent amount of protein that reacted with the Biuret solution.`,
                    'low': `The solution shows a light blue-purple color, indicating LOW protein content. ${selectedFood} has some protein, but not much.`,
                    'none': `Notice the solution stayed blue with no color change. This means NO protein was detected in ${selectedFood}. The Biuret test is negative.`
                };
                setTeacherMessage(messages[proteinLevel]);
                
                setPendingTransition(() => () => {
                    setTimeout(() => {
                        const quizSection = document.querySelector('[data-quiz-section]');
                        quizSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                });
            }, 500);
        }
    }, [reactionProgress, currentStep, selectedFood]);

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
            setTeacherMessage('Welcome to the Biuret Test Laboratory! The Biuret test is used to detect proteins in food samples. When Biuret reagent reacts with peptide bonds in proteins, it changes from blue to purple. The deeper the purple, the more protein present. Ready to test some foods? Click Start Experiment!');
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setCurrentStep('select-food');
        setTeacherMessage('First, choose a food sample to test for protein. We have egg white, milk, bread, apple, and groundnut paste. Each food has different protein levels. Which one would you like to test?');
    };

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
        setPendingTransition(() => () => {
            setTimeout(() => {
                const actionButton = document.querySelector('[data-action-button]');
                actionButton?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
    };

    const handleAddReagent = () => {
        if (!selectedFood) return;
        
        setCurrentStep('add-reagent');
        setShowDroplets(true);
        setTeacherMessage(`Adding Biuret reagent to ${selectedFood}... Watch as the blue reagent mixes with the food sample. The copper ions in the reagent will react with any peptide bonds present.`);
        
        setTimeout(() => {
            setShowDroplets(false);
            setCurrentStep('observe');
            setReactionProgress(0);
            setTeacherMessage('The reagent is reacting! Watch carefully as the color changes. The intensity of the purple color tells us how much protein is present.');
        }, 2500);
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        
        const correctAnswer = 'Egg White';
        const isCorrect = quizAnswer === correctAnswer;
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Perfect! Egg white is almost pure protein (albumin) and gives the strongest purple color in the Biuret test. ✅");
            
            if (!hasCompleted) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                const score = newAttempts === 1 ? 100 : 75;
                const earnedXP = markLabComplete('biuret-test', score, timeSpent);
                
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                
                setXpEarned(earnedXP);
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 5000);
                
                setTeacherMessage(`Wonderful work! You've mastered the Biuret test and earned ${earnedXP} XP! You now have ${totalXP + earnedXP} total XP. Remember, the Biuret test detects peptide bonds in proteins!`);
            } else {
                setTeacherMessage('Correct! You clearly understand which foods are protein-rich. Well done!');
            }
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite. Think about which food is famous for being almost pure protein. Try again! 🔄");
                setTeacherMessage('Which food source is known for having the highest concentration of protein? Athletes often eat it for muscle building!');
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback(`The correct answer is ${correctAnswer}. Egg white contains about 90% protein and is one of the best protein sources. 🧠`);
                setTeacherMessage('Egg white is the champion! It contains albumin, a high-quality protein that gives the deepest purple color in the Biuret test.');
            }
        }
    };

    const handleReset = () => {
        setCurrentStep('intro');
        setSelectedFood(null);
        setResult(null);
        setShowDroplets(false);
        setReactionProgress(0);
        setQuizAnswer('');
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setXpEarned(0);
        setShowCelebration(false);
        setTeacherMessage('Welcome back! Ready to test another food for protein? Each one shows a different color intensity. Click Start Experiment when ready!');
    };

    const objectiveText = "To learn how to use the Biuret test to detect proteins in various food samples by observing characteristic color changes.";
    const theoryText = "The Biuret test is a chemical test used to detect the presence of proteins. Proteins contain peptide bonds (CO-NH) that link amino acids together. When Biuret reagent (which contains copper sulfate in alkaline solution) is added to a protein sample, the copper ions form a complex with the peptide bonds, producing a purple or violet color. The intensity of the color is proportional to the amount of protein present: no protein shows blue (no change), low protein shows light blue-purple, moderate protein shows purple, and high protein shows deep purple.";
    const safetyText = "Handle Biuret reagent with care as it contains sodium hydroxide, which is caustic and can burn skin. Always wear safety goggles and lab coat. Avoid contact with skin and eyes. If contact occurs, rinse immediately with plenty of water. Work in a well-ventilated area. Dispose of chemicals properly according to laboratory guidelines.";

    return (
        <div className="space-y-6">
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
                    onComplete={handleTeacherComplete}
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
                        <AccordionItem value="item-1">
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
                        <AccordionItem value="item-2">
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
                        <span>🧪 Interactive Biuret Test Lab</span>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowSafetyGear(!showSafetyGear)}
                            className={cn("transition-colors", showSafetyGear && "border-green-500 text-green-600")}
                        >
                            {showSafetyGear ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                            Safety {showSafetyGear ? 'ON' : 'OFF'}
                        </Button>
                    </CardTitle>
                    <CardDescription>Test foods for protein using the purple color reaction</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Start Button */}
                    {currentStep === 'intro' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-12 space-y-4"
                        >
                            <TestTube className="h-24 w-24 text-purple-500" />
                            <Button 
                                size="lg" 
                                onClick={handleStartExperiment}
                                className="text-lg px-8"
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
                            <Label className="text-lg font-semibold flex items-center gap-2">
                                <Utensils className="h-5 w-5" />
                                Select a Food Sample
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {foodOptions.map(food => {
                                    const foodInfo = foodData[food];
                                    const IconComponent = foodInfo.icon;
                                    return (
                                        <motion.div key={food} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button 
                                                variant={selectedFood === food ? 'default' : 'outline'}
                                                onClick={() => handleFoodSelect(food)}
                                                className="h-auto w-full flex-col gap-2 py-4"
                                            >
                                                <IconComponent className="h-8 w-8" />
                                                <span className="text-sm font-medium">{food}</span>
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Test Tube Visualization */}
                    {(currentStep === 'add-reagent' || currentStep === 'observe' || currentStep === 'result') && selectedFood && (
                        <div className="relative flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 min-h-[450px]">
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
                                                className={cn(
                                                    "absolute inset-x-2 bottom-2 rounded-b-2xl transition-all duration-2000",
                                                    result 
                                                        ? `bg-gradient-to-b ${foodData[selectedFood].colorFrom} ${foodData[selectedFood].colorTo}`
                                                        : 'bg-gradient-to-b from-blue-400 to-blue-500'
                                                )}
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
                                className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-xl border-2 border-purple-200 dark:border-purple-800"
                            >
                                <div className="flex items-start gap-4">
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
                <CardFooter className="flex flex-col gap-3">
                    {currentStep === 'select-food' && selectedFood && (
                        <Button 
                            size="lg" 
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            onClick={handleAddReagent}
                            data-action-button
                        >
                            <Droplets className="h-5 w-5 mr-2" />
                            Add Biuret Reagent
                        </Button>
                    )}
                    
                    {currentStep !== 'intro' && (
                        <Button 
                            variant="outline" 
                            onClick={handleReset}
                            className="w-full"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset & Try Another Food
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
                        <CardContent className="space-y-4">
                            <p className="font-medium">
                                Which food sample would show the DEEPEST purple color in the Biuret test?
                            </p>
                            <RadioGroup 
                                value={quizAnswer} 
                                onValueChange={setQuizAnswer}
                                disabled={quizIsCorrect !== null}
                            >
                                {foodOptions.map(food => (
                                    <div key={food} className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value={food} id={`q-${food}`} />
                                        <Label htmlFor={`q-${food}`} className="flex-1 cursor-pointer">{food}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                            
                            {quizFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={cn(
                                        "p-4 rounded-lg border-2 flex items-start gap-3",
                                        quizIsCorrect 
                                            ? "bg-green-50 dark:bg-green-950/30 border-green-500 text-green-900 dark:text-green-100"
                                            : quizIsCorrect === false
                                            ? "bg-red-50 dark:bg-red-950/30 border-red-500 text-red-900 dark:text-red-100"
                                            : "bg-blue-50 dark:bg-blue-950/30 border-blue-500 text-blue-900 dark:text-blue-100"
                                    )}
                                >
                                    {quizIsCorrect ? (
                                        <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    ) : quizIsCorrect === false ? (
                                        <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <Sparkles className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    )}
                                    <p className="text-sm font-medium">{quizFeedback}</p>
                                </motion.div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button 
                                onClick={handleQuizSubmit} 
                                disabled={!quizAnswer || quizIsCorrect !== null}
                                size="lg"
                            >
                                {quizIsCorrect === true ? "Correct! ✓" : quizIsCorrect === false ? "Review Answer" : quizAttempts === 1 ? "Try Again" : "Submit Answer"}
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
                        <div className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-300">
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
