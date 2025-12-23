'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { 
    Utensils, TestTube, Beaker, FlaskConical, Flame, Droplets, 
    Eye, EyeOff, Shield, BookOpen, Clock, ThermometerSun,
    CheckCircle, XCircle, Wheat, Egg, Milk, Nut, 
    Sparkles, Trophy, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { TeacherVoice } from '@/components/virtual-labs/TeacherVoice';
import { useLabProgress } from '@/stores/lab-progress-store';
import confetti from 'canvas-confetti';

type FoodType = 'Bread' | 'Egg White' | 'Milk' | 'Groundnut Paste';
type ReagentType = 'Iodine Solution' | "Benedict's Solution" | 'Biuret Solution' | 'Ethanol';
type TestStep = 'intro' | 'select-food' | 'select-reagent' | 'add-reagent' | 'heating' | 'observe' | 'result' | 'quiz';

interface TestResult {
    nutrient: string;
    colorChange: string;
    text: string;
    colorClass: string;
}

const foodIcons: Record<FoodType, typeof Utensils> = {
    'Bread': Wheat,
    'Egg White': Egg,
    'Milk': Milk,
    'Groundnut Paste': Nut,
};

const foodOptions: FoodType[] = ['Bread', 'Egg White', 'Milk', 'Groundnut Paste'];
const reagentOptions: ReagentType[] = ['Iodine Solution', "Benedict's Solution", 'Biuret Solution', 'Ethanol'];

// Results map for all food + reagent combinations
const resultsMap: Record<FoodType, Record<ReagentType, TestResult>> = {
    'Bread': {
        'Iodine Solution': {
            nutrient: 'Starch',
            colorChange: 'Brown → Blue-Black',
            text: 'The solution turned blue-black, indicating the presence of starch.',
            colorClass: 'bg-gradient-to-b from-blue-900 to-black'
        },
        "Benedict's Solution": {
            nutrient: 'Reducing Sugars',
            colorChange: 'Blue → Brick Red',
            text: 'The solution changed from blue to brick-red, indicating reducing sugars.',
            colorClass: 'bg-gradient-to-b from-orange-700 to-red-800'
        },
        'Biuret Solution': {
            nutrient: 'Protein (trace)',
            colorChange: 'Blue → Light Purple',
            text: 'Slight purple tint observed, indicating trace amounts of protein.',
            colorClass: 'bg-gradient-to-b from-purple-300 to-purple-400'
        },
        'Ethanol': {
            nutrient: 'Fats (trace)',
            colorChange: 'Clear → Slight Cloudiness',
            text: 'Minimal cloudiness, indicating trace fats.',
            colorClass: 'bg-gradient-to-b from-gray-200 to-gray-300'
        }
    },
    'Egg White': {
        'Iodine Solution': {
            nutrient: 'No Starch',
            colorChange: 'Brown (no change)',
            text: 'No color change. Starch is not present.',
            colorClass: 'bg-gradient-to-b from-amber-700 to-amber-800'
        },
        "Benedict's Solution": {
            nutrient: 'No Reducing Sugars',
            colorChange: 'Blue (no change)',
            text: 'Solution remained blue. No reducing sugars detected.',
            colorClass: 'bg-gradient-to-b from-blue-400 to-blue-600'
        },
        'Biuret Solution': {
            nutrient: 'Protein (high)',
            colorChange: 'Blue → Deep Purple',
            text: 'The solution turned deep purple, confirming high protein content.',
            colorClass: 'bg-gradient-to-b from-purple-600 to-purple-900'
        },
        'Ethanol': {
            nutrient: 'No Fats',
            colorChange: 'Clear (no change)',
            text: 'No emulsion formed. Fats are absent.',
            colorClass: 'bg-gradient-to-b from-gray-100 to-white'
        }
    },
    'Milk': {
        'Iodine Solution': {
            nutrient: 'No Starch',
            colorChange: 'Brown (no change)',
            text: 'No color change. Starch is not present.',
            colorClass: 'bg-gradient-to-b from-amber-700 to-amber-800'
        },
        "Benedict's Solution": {
            nutrient: 'Reducing Sugars (Lactose)',
            colorChange: 'Blue → Orange',
            text: 'The solution turned orange, indicating the presence of lactose (milk sugar).',
            colorClass: 'bg-gradient-to-b from-orange-400 to-orange-600'
        },
        'Biuret Solution': {
            nutrient: 'Protein (moderate)',
            colorChange: 'Blue → Purple',
            text: 'The solution turned purple, indicating protein content.',
            colorClass: 'bg-gradient-to-b from-purple-400 to-purple-700'
        },
        'Ethanol': {
            nutrient: 'Fats (present)',
            colorChange: 'Clear → Milky White',
            text: 'A milky white emulsion formed, confirming the presence of fats.',
            colorClass: 'bg-gradient-to-b from-white to-gray-200'
        }
    },
    'Groundnut Paste': {
        'Iodine Solution': {
            nutrient: 'No Starch',
            colorChange: 'Brown (no change)',
            text: 'No color change. Starch is not present.',
            colorClass: 'bg-gradient-to-b from-amber-700 to-amber-800'
        },
        "Benedict's Solution": {
            nutrient: 'No Reducing Sugars',
            colorChange: 'Blue (no change)',
            text: 'Solution remained blue. No reducing sugars detected.',
            colorClass: 'bg-gradient-to-b from-blue-400 to-blue-600'
        },
        'Biuret Solution': {
            nutrient: 'Protein (high)',
            colorChange: 'Blue → Purple',
            text: 'The solution turned purple, indicating high protein content in groundnuts.',
            colorClass: 'bg-gradient-to-b from-purple-500 to-purple-800'
        },
        'Ethanol': {
            nutrient: 'Fats (very high)',
            colorChange: 'Clear → Dense White',
            text: 'A thick white emulsion formed, confirming very high fat content.',
            colorClass: 'bg-gradient-to-b from-white to-gray-300'
        }
    }
};

export function FoodTestLabEnhanced() {
    const { toast } = useToast();
    
    // Lab state
    const [currentStep, setCurrentStep] = React.useState<TestStep>('intro');
    const [selectedFood, setSelectedFood] = React.useState<FoodType | null>(null);
    const [selectedReagent, setSelectedReagent] = React.useState<ReagentType | null>(null);
    const [result, setResult] = React.useState<TestResult | null>(null);
    const [showDroplets, setShowDroplets] = React.useState(false);
    const [temperature, setTemperature] = React.useState(20);
    const [isHeating, setIsHeating] = React.useState(false);
    const [showSafetyGear, setShowSafetyGear] = React.useState(true);
    
    // Teacher voice
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    const [teacherEmotion, setTeacherEmotion] = React.useState<'happy' | 'explaining' | 'concerned' | 'celebrating' | 'thinking'>('explaining');
    const [studentContext, setStudentContext] = React.useState<{ quizScore?: number; attempts?: number; correctStreak?: number }>({});
    
    // Quiz
    const [quizAnswer, setQuizAnswer] = React.useState<string>('');
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);
    
    // XP & Celebration
    const { markLabComplete, completedLabs, isLabCompleted, getLabCompletion } = useLabProgress();
    const [xpEarned, setXpEarned] = React.useState(0);
    const [showCelebration, setShowCelebration] = React.useState(false);
    const hasCompleted = isLabCompleted('food-tests');
    const labProgress = getLabCompletion('food-tests');
    
    // Heating timer effect
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHeating && temperature < 100) {
            interval = setInterval(() => {
                setTemperature(prev => Math.min(prev + 8, 100));
            }, 400);
        }
        return () => clearInterval(interval);
    }, [isHeating, temperature]);

    // Complete heating when temp reaches 100
    React.useEffect(() => {
        if (temperature >= 100 && currentStep === 'heating') {
            setIsHeating(false);
            setTimeout(() => {
                setCurrentStep('observe');
                setTeacherMessage('The heating is complete! Now carefully observe any color changes in the test tube. What do you see?');
            }, 500);
        }
    }, [temperature, currentStep]);

    // Teacher message callbacks
    const handleTeacherComplete = React.useCallback(() => {
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null); // Clear BEFORE executing
            transition();
        }
    }, [pendingTransition]);

    // Initial intro
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage('Welcome to the Food Test Laboratory! Today, we will learn how to identify different nutrients in food samples using chemical reagents. Are you ready to become a food scientist? Click Start Experiment!');
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setCurrentStep('select-food');
        setTeacherMessage('First, choose a food sample you want to test. We have bread, egg white, milk, and groundnut paste. Each food contains different nutrients. Which one would you like to test?');
    };

    const handleFoodSelect = (food: FoodType) => {
        setSelectedFood(food);
        
        const messages: Record<FoodType, string> = {
            'Bread': 'Excellent choice! Bread is made from flour, which comes from wheat. Now select a reagent to test for a specific nutrient.',
            'Egg White': 'Great selection! Egg white is known for being rich in protein. Now choose which reagent you want to use for testing.',
            'Milk': 'Good choice! Milk is a complete food with multiple nutrients. Pick a reagent to test for a specific nutrient.',
            'Groundnut Paste': 'Interesting choice! Groundnuts are very nutritious. Now select a reagent to identify what nutrients it contains.'
        };
        
        setTeacherMessage(messages[food]);
        setPendingTransition(() => () => {
            setCurrentStep('select-reagent');
        });
    };

    const handleReagentSelect = (reagent: ReagentType) => {
        setSelectedReagent(reagent);
        
        const messages: Record<ReagentType, string> = {
            'Iodine Solution': 'Iodine solution tests for starch. It turns blue-black when starch is present. Click Add Reagent to proceed.',
            "Benedict's Solution": "Benedict's solution tests for reducing sugars like glucose. It changes from blue to brick-red when heated with sugar. Click Add Reagent to start the test.",
            'Biuret Solution': 'Biuret solution tests for proteins. It turns from blue to purple in the presence of protein molecules. Click Add Reagent to continue.',
            'Ethanol': 'Ethanol is used for the emulsion test to detect fats and oils. It forms a cloudy white layer when fats are present. Click Add Reagent to proceed.'
        };
        
        setTeacherMessage(messages[reagent]);
        setPendingTransition(() => () => {
            // Auto-scroll to action button
            setTimeout(() => {
                const actionButton = document.querySelector('[data-action-button]');
                actionButton?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
    };

    const handleAddReagent = () => {
        setCurrentStep('add-reagent');
        setShowDroplets(true);
        setTeacherMessage(`Adding ${selectedReagent} to ${selectedFood}... Watch carefully as the reagent mixes with the food sample.`);
        
        setTimeout(() => {
            setShowDroplets(false);
            
            // Check if heating is needed
            const needsHeat = selectedReagent === "Benedict's Solution";
            
            if (needsHeat) {
                setCurrentStep('heating');
                setTeacherMessage("Benedict's test requires heating! Click the Start Heating button to heat the test tube in a water bath to about 100 degrees Celsius.");
            } else {
                setCurrentStep('observe');
                setTeacherMessage('Now observe the test tube carefully. Do you see any color changes? This is the key to identifying which nutrient is present!');
            }
        }, 2500);
    };

    const handleStartHeating = () => {
        setIsHeating(true);
        setTeacherMessage('Heating the test tube... Watch the temperature rise and look for color changes. Safety first - in a real lab, always use a water bath and never heat directly over a flame!');
    };

    const handleShowResult = () => {
        if (!selectedFood || !selectedReagent) return;
        
        const testResult = resultsMap[selectedFood][selectedReagent];
        setResult(testResult);
        setCurrentStep('result');
        
        const isPositive = !testResult.nutrient.includes('No ') && !testResult.nutrient.includes('trace');
        
        if (isPositive) {
            setTeacherMessage(`Test complete! The ${selectedReagent} has reacted positively, showing ${testResult.colorChange}. This confirms the presence of ${testResult.nutrient}. Excellent observation! Now let's test your knowledge with a quiz.`);
        } else {
            setTeacherMessage(`Test complete! The ${selectedReagent} shows ${testResult.colorChange}. This means ${testResult.nutrient} in this food sample. Good work! Now try the quiz to check your understanding.`);
        }
        
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
            setTimeout(() => {
                const quizSection = document.querySelector('[data-quiz-section]');
                quizSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        
        const correctAnswer = 'Biuret Solution';
        const isCorrect = quizAnswer === correctAnswer;
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Perfect! Biuret solution is indeed used to test for proteins. It turns purple when protein peptide bonds are present. ✅");
            
            // Calculate XP and score
            const baseXP = 100;
            const attemptBonus = newAttempts === 1 ? 50 : 0;
            const totalXP = baseXP + attemptBonus;
            const score = newAttempts === 1 ? 100 : 75;
            
            // Update context and emotion
            setStudentContext({ quizScore: score, attempts: newAttempts });
            setTeacherEmotion(score >= 90 ? 'celebrating' : 'happy');
            
            setTeacherMessage(`Congratulations! You've completed the Food Test Lab and earned ${totalXP} XP! ${attemptBonus > 0 ? 'Perfect score on first try!' : 'Well done!'} You now understand how to identify nutrients in foods using chemical tests.`);
            
            setTimeout(() => {
                markLabComplete('food-tests', score, 180);
                setXpEarned(totalXP);
                setShowCelebration(true);
                
                // Confetti
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }, 1500);
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite right. Think about which reagent specifically reacts with protein molecules and causes a purple color change. Try again! 🔄");
                setTeacherEmotion('concerned');
                setStudentContext({ attempts: newAttempts });
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback(`The correct answer is ${correctAnswer}. Biuret solution contains copper ions that react with peptide bonds in proteins, producing a purple color. 🧠`);
                setTeacherEmotion('explaining');
                
                setTimeout(() => {
                    const score = 50;
                    setStudentContext({ quizScore: score, attempts: newAttempts });
                    markLabComplete('food-tests', score, 180);
                    setXpEarned(100);
                    setShowCelebration(true);
                }, 1500);
            }
        }
    };

    const handleReset = () => {
        setCurrentStep('intro');
        setSelectedFood(null);
        setSelectedReagent(null);
        setResult(null);
        setShowDroplets(false);
        setTemperature(20);
        setIsHeating(false);
        setQuizAnswer('');
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setXpEarned(0);
        setShowCelebration(false);
        setTeacherMessage('Welcome back! Ready to test another food sample? Click Start Experiment when you\'re ready!');
    };

    const objectiveText = "To learn how to use chemical reagents to test for the presence of carbohydrates (starch and reducing sugars), proteins, and fats in various food samples.";
    const theoryText = "Different foods contain different nutrients. We can use specific chemical tests to identify which nutrients are present. Iodine Solution tests for starch, turning blue-black if present. Benedict's Solution tests for reducing sugars like glucose and requires heating, changing color from blue to brick-red. Biuret Solution tests for proteins, turning from blue to purple. The Ethanol Emulsion Test is used for fats and oils, forming a cloudy white emulsion.";
    const safetyText = "In a real lab, always wear safety goggles and lab coat. Handle chemical reagents with care. Biuret and Benedict's solutions can be irritants. Be cautious when heating - always use a water bath, never heat directly. Wash hands thoroughly after the experiment.";

    const FoodIcon = selectedFood ? foodIcons[selectedFood] : Utensils;

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
                    theme="science"
                    teacherName="Lab Instructor"
                    emotion={teacherEmotion}
                    context={studentContext}
                    quickActions={[
                        ...(currentStep === 'select-food' ? [{
                            label: 'Need help choosing?',
                            icon: '❓',
                            onClick: () => {
                                setTeacherMessage('Try bread if you want to test for starch, egg white for protein, milk for multiple nutrients, or groundnut paste for fats!');
                                setTeacherEmotion('happy');
                            }
                        }] : []),
                        ...(currentStep === 'observe' ? [{
                            label: 'Show result',
                            icon: '👁️',
                            onClick: handleShowResult
                        }] : []),
                        ...(currentStep === 'result' ? [{
                            label: 'Start quiz',
                            icon: '→',
                            onClick: () => {
                                setCurrentStep('quiz');
                                setTimeout(() => {
                                    const quizSection = document.querySelector('[data-quiz-section]');
                                    quizSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }, 100);
                            }
                        }] : []),
                    ]}
                    onHintRequest={() => {
                        if (currentStep === 'select-food') {
                            setTeacherMessage('Hint: Think about what each food is commonly known for. Bread comes from wheat grains, eggs have protein, milk is a complete food, and nuts have oils.');
                        } else if (currentStep === 'select-reagent') {
                            setTeacherMessage('Hint: Iodine tests starch, Benedict tests sugars, Biuret tests protein, and Ethanol tests fats.');
                        } else if (currentStep === 'quiz') {
                            setTeacherMessage('Hint: Remember which reagent turned purple when testing for proteins in our experiment.');
                        }
                    }}
                />
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Objective</CardTitle>
                    <CardDescription>
                        {objectiveText}
                    </CardDescription>
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
                        <span>🧪 Interactive Food Test Lab</span>
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
                    <CardDescription>Follow the teacher's guidance to perform food nutrient tests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Start Button (intro step) */}
                    {currentStep === 'intro' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-12 space-y-4"
                        >
                            <FlaskConical className="h-24 w-24 text-primary" />
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
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {foodOptions.map(food => {
                                    const Icon = foodIcons[food];
                                    return (
                                        <motion.div key={food} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button 
                                                variant={selectedFood === food ? 'default' : 'outline'}
                                                onClick={() => handleFoodSelect(food)}
                                                className="h-auto w-full flex-col gap-3 py-6"
                                            >
                                                <Icon className="h-10 w-10" />
                                                <span className="text-sm font-medium">{food}</span>
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Reagent Selection */}
                    {currentStep === 'select-reagent' && selectedFood && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border">
                                <FoodIcon className="h-8 w-8 text-primary" />
                                <div>
                                    <div className="text-sm text-muted-foreground">Testing</div>
                                    <div className="font-bold">{selectedFood}</div>
                                </div>
                            </div>
                            
                            <Label className="text-lg font-semibold flex items-center gap-2">
                                <Beaker className="h-5 w-5" />
                                Select a Test Reagent
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {reagentOptions.map(reagent => (
                                    <motion.div key={reagent} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button 
                                            variant={selectedReagent === reagent ? 'default' : 'outline'}
                                            onClick={() => handleReagentSelect(reagent)}
                                            className="h-auto w-full flex-col gap-2 py-4 text-left"
                                        >
                                            <div className="flex items-center gap-2 w-full">
                                                <TestTube className="h-6 w-6" />
                                                <span className="text-sm font-medium">{reagent}</span>
                                            </div>
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Test Tube Visualization */}
                    {(currentStep === 'add-reagent' || currentStep === 'heating' || currentStep === 'observe' || currentStep === 'result') && (
                        <div className="relative flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 min-h-[450px]">
                            {/* Lab Bench */}
                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-amber-900/20 to-transparent" />
                            
                            {/* Test Tube */}
                            <div className="relative">
                                {/* Stand */}
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-3 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 rounded-full shadow-lg" />
                                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-24 h-6 bg-gradient-to-b from-gray-500 to-gray-600 rounded-t-full" />

                                <motion.div 
                                    className="relative w-28 h-80"
                                    animate={isHeating ? { y: [0, -3, 0] } : {}}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                >
                                    {/* Glass tube */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/40 via-white/20 to-blue-50/40 rounded-t-full rounded-b-3xl border-4 border-gray-300/50 shadow-2xl backdrop-blur-sm">
                                        {/* Liquid */}
                                        <AnimatePresence>
                                            {selectedFood && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ 
                                                        height: result ? '70%' : '60%',
                                                        opacity: 1
                                                    }}
                                                    className={cn(
                                                        "absolute inset-x-2 bottom-2 rounded-b-2xl transition-all duration-2000",
                                                        result ? result.colorClass : 'bg-gradient-to-b from-amber-100 to-amber-200'
                                                    )}
                                                >
                                                    {/* Particles */}
                                                    <div className="absolute inset-0 overflow-hidden rounded-b-2xl">
                                                        {[...Array(5)].map((_, i) => (
                                                            <motion.div
                                                                key={i}
                                                                className="absolute w-2 h-2 bg-black/20 rounded-full"
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

                                                    {/* Heating bubbles */}
                                                    {isHeating && (
                                                        <div className="absolute inset-0">
                                                            {[...Array(10)].map((_, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    className="absolute w-2 h-2 bg-white/70 rounded-full"
                                                                    initial={{ x: 20 + Math.random() * 60, y: '100%' }}
                                                                    animate={{ 
                                                                        y: '-20%',
                                                                        scale: [1, 1.5, 0.5]
                                                                    }}
                                                                    transition={{
                                                                        repeat: Infinity,
                                                                        duration: 1.5 + Math.random(),
                                                                        delay: i * 0.2
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
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
                                    {selectedFood && selectedReagent && (
                                        <div className="absolute -right-24 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-lg border text-xs whitespace-nowrap">
                                            <div className="font-bold text-sm">{selectedFood}</div>
                                            <div className="text-muted-foreground mt-1">+ {selectedReagent}</div>
                                            {currentStep === 'heating' && (
                                                <div className="text-orange-600 font-mono mt-1">{temperature}°C</div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>

                                {/* Bunsen Burner */}
                                <AnimatePresence>
                                    {isHeating && (
                                        <motion.div 
                                            className="absolute -bottom-20 left-1/2 -translate-x-1/2"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <motion.div
                                                animate={{ 
                                                    scale: [1, 1.1, 0.9, 1],
                                                    rotate: [0, -5, 5, 0]
                                                }}
                                                transition={{ repeat: Infinity, duration: 0.5 }}
                                                className="relative"
                                            >
                                                <Flame className="h-20 w-20 text-orange-500" />
                                                <Flame className="h-20 w-20 text-yellow-400 absolute inset-0 opacity-60" />
                                                <Flame className="h-14 w-14 text-blue-400 absolute inset-0 m-auto opacity-80" />
                                            </motion.div>
                                            <div className="w-20 h-10 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-xl mx-auto border-t-2 border-gray-500" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Safety gear indicator */}
                            {showSafetyGear && (
                                <div className="absolute top-4 left-4 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg border border-green-500 flex items-center gap-2">
                                    <div className="text-2xl">🥽</div>
                                    <div className="text-xs font-semibold text-green-700 dark:text-green-400">Safety ON</div>
                                </div>
                            )}

                            {/* Step indicator */}
                            <div className="absolute top-4 right-4 bg-primary/10 px-4 py-2 rounded-lg border border-primary/30">
                                <div className="text-xs font-semibold text-primary capitalize">{currentStep.replace('-', ' ')}</div>
                            </div>
                        </div>
                    )}

                    {/* Result Display */}
                    <AnimatePresence>
                        {result && currentStep === 'result' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-green-200 dark:border-green-800"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-500 rounded-full flex-shrink-0">
                                        <CheckCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h3 className="font-bold text-lg text-green-900 dark:text-green-100">
                                            Test Complete! ✓
                                        </h3>
                                        <p className="text-green-800 dark:text-green-200 font-medium">
                                            {result.text}
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                                            <div>
                                                <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">Nutrient Detected</div>
                                                <div className="text-sm font-bold text-green-900 dark:text-green-100">{result.nutrient}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">Color Change</div>
                                                <div className="text-sm font-bold text-green-900 dark:text-green-100">{result.colorChange}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    {/* Action buttons */}
                    {currentStep === 'select-reagent' && selectedReagent && (
                        <Button 
                            size="lg" 
                            className="w-full"
                            onClick={handleAddReagent}
                            data-action-button
                        >
                            <Droplets className="h-5 w-5 mr-2" />
                            Add Reagent to Test Tube
                        </Button>
                    )}
                    
                    {currentStep === 'heating' && !isHeating && (
                        <Button 
                            size="lg" 
                            className="w-full bg-orange-600 hover:bg-orange-700"
                            onClick={handleStartHeating}
                            data-action-button
                        >
                            <Flame className="h-5 w-5 mr-2" />
                            Start Heating
                        </Button>
                    )}
                    
                    {currentStep === 'observe' && !isHeating && (
                        <Button 
                            size="lg" 
                            className="w-full"
                            onClick={handleShowResult}
                            data-action-button
                        >
                            <Eye className="h-5 w-5 mr-2" />
                            View Test Result
                        </Button>
                    )}
                    
                    {currentStep !== 'intro' && (
                        <Button 
                            variant="outline" 
                            onClick={handleReset}
                            className="w-full"
                        >
                            Reset & Try Another Test
                        </Button>
                    )}
                    
                    {selectedReagent === "Benedict's Solution" && currentStep !== 'intro' && (
                        <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-800 w-full">
                            <Flame className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium">Note: Benedict's test requires heating to 80-100°C</span>
                        </div>
                    )}
                </CardFooter>
            </Card>

            {/* Quiz Section */}
            {currentStep === 'quiz' && (
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
                                Which reagent is specifically used to test for the presence of proteins in a food sample?
                            </p>
                            <RadioGroup 
                                value={quizAnswer} 
                                onValueChange={(v) => {
                                    setQuizAnswer(v);
                                    setQuizIsCorrect(null);
                                    setQuizFeedback(null);
                                }} 
                                disabled={quizIsCorrect !== null}
                            >
                                <div className="flex items-center space-x-2 py-2">
                                    <RadioGroupItem value="Iodine Solution" id="q-iodine" />
                                    <Label htmlFor="q-iodine" className="cursor-pointer">Iodine Solution (tests for starch)</Label>
                                </div>
                                <div className="flex items-center space-x-2 py-2">
                                    <RadioGroupItem value="Biuret Solution" id="q-biuret" />
                                    <Label htmlFor="q-biuret" className="cursor-pointer">Biuret Solution (tests for proteins)</Label>
                                </div>
                                <div className="flex items-center space-x-2 py-2">
                                    <RadioGroupItem value="Benedict's Solution" id="q-benedict" />
                                    <Label htmlFor="q-benedict" className="cursor-pointer">Benedict's Solution (tests for reducing sugars)</Label>
                                </div>
                                <div className="flex items-center space-x-2 py-2">
                                    <RadioGroupItem value="Ethanol" id="q-ethanol" />
                                    <Label htmlFor="q-ethanol" className="cursor-pointer">Ethanol (tests for fats)</Label>
                                </div>
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
