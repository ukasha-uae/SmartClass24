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
import { LabSupplies, SupplyItem } from '@/components/virtual-labs/LabSupplies';
import { useLabProgress } from '@/stores/lab-progress-store';
import confetti from 'canvas-confetti';

type FoodType = 'Bread' | 'Egg White' | 'Milk' | 'Groundnut Paste';
type ReagentType = 'Iodine Solution' | "Benedict's Solution" | 'Biuret Solution' | 'Ethanol';
type TestStep = 'intro' | 'collect-supplies' | 'select-food' | 'select-reagent' | 'add-reagent' | 'heating' | 'observe' | 'result' | 'quiz' | 'complete';

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
    const [collectedItems, setCollectedItems] = React.useState<string[]>([]);
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [colorChangeProgress, setColorChangeProgress] = React.useState(0); // 0-1 for gradual color change
    
    const allSuppliesNotifiedRef = React.useRef(false);

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
        // Only run if all conditions are met and we're actually heating
        if (temperature >= 100 && 
            currentStep === 'heating' && 
            selectedFood !== null && 
            selectedReagent !== null && 
            isHeating) {
            
            setIsHeating(false);
            const testResult = resultsMap[selectedFood][selectedReagent];
            setResult(testResult);
            
            // Start gradual color change animation during heating completion
            setColorChangeProgress(0);
            const colorChangeDuration = 3000; // 3 seconds
            const startTime = Date.now();
            
            const animateColor = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / colorChangeDuration, 1);
                setColorChangeProgress(progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animateColor);
                } else {
                    setCurrentStep('observe');
                    setTeacherMessage(`The heating is complete! The color has changed to ${testResult.colorChange}. This indicates ${testResult.nutrient}! Click "View Test Result" to see the details.`);
                }
            };
            
            setTimeout(() => {
                requestAnimationFrame(animateColor);
            }, 500);
        }
    }, [temperature, currentStep, selectedFood, selectedReagent, isHeating]);

    // Teacher message callbacks
    const handleTeacherComplete = React.useCallback(() => {
        // All transitions now happen immediately, no pending transitions needed
        // This callback is kept for compatibility but doesn't block anything
    }, []);

    // Initial intro
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage('Welcome to the Food Test Laboratory! Today, we will learn how to identify different nutrients in food samples using chemical reagents. Are you ready to become a food scientist? Click Start Experiment!');
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        // Transition to supplies collection first
        setCurrentStep('collect-supplies');
        setTeacherMessage('Before we begin, let\'s collect all the supplies we need for the experiment. Click on each item to collect it!');
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
        setTeacherMessage('Excellent! All supplies collected. Now let\'s choose a food sample to test. We have bread, egg white, milk, and groundnut paste. Each food contains different nutrients. Which one would you like to test?');
        setCurrentStep('select-food');
}, [toast]);

    // Define lab supplies
    const supplies: SupplyItem[] = [
        { id: 'test-tubes', name: 'Test Tubes', emoji: '🧪', description: 'For holding food samples and reagents', required: true },
        { id: 'iodine', name: 'Iodine Solution', emoji: '🧴', description: 'Tests for starch', required: true },
        { id: 'benedict', name: "Benedict's Solution", emoji: '🧪', description: 'Tests for reducing sugars', required: true },
        { id: 'biuret', name: 'Biuret Solution', emoji: '💧', description: 'Tests for proteins', required: true },
        { id: 'ethanol', name: 'Ethanol', emoji: '🍶', description: 'Tests for fats', required: true },
        { id: 'water-bath', name: 'Water Bath', emoji: '🔥', description: 'For heating tests', required: true },
        { id: 'pipette', name: 'Pipette', emoji: '🔬', description: 'For adding reagents', required: true },
    ];

    const handleFoodSelect = (food: FoodType) => {
        setSelectedFood(food);
        
        const messages: Record<FoodType, string> = {
            'Bread': 'Excellent choice! Bread is made from flour, which comes from wheat. Now select a reagent to test for a specific nutrient.',
            'Egg White': 'Great selection! Egg white is known for being rich in protein. Now choose which reagent you want to use for testing.',
            'Milk': 'Good choice! Milk is a complete food with multiple nutrients. Pick a reagent to test for a specific nutrient.',
            'Groundnut Paste': 'Interesting choice! Groundnuts are very nutritious. Now select a reagent to identify what nutrients it contains.'
        };
        
        setTeacherMessage(messages[food]);
        // Transition immediately to reagent selection
        setCurrentStep('select-reagent');
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
        // Auto-scroll to action button after a brief delay
        setTimeout(() => {
            const actionButton = document.querySelector('[data-action-button]');
            actionButton?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const handleAddReagent = () => {
        if (!selectedFood || !selectedReagent) return;
        
        setCurrentStep('add-reagent');
        setShowDroplets(true);
        setColorChangeProgress(0); // Reset color change progress
        setTeacherMessage(`Adding ${selectedReagent} to ${selectedFood}... Watch carefully as the reagent mixes with the food sample.`);
        
        // Calculate result but don't show color immediately
        const testResult = resultsMap[selectedFood][selectedReagent];
        setResult(testResult);
        
        setTimeout(() => {
            setShowDroplets(false);
            
            // Start gradual color change animation (simulate real lab reaction)
            const needsHeat = selectedReagent === "Benedict's Solution";
            
            if (needsHeat) {
                setCurrentStep('heating');
                setTeacherMessage("Benedict's test requires heating! Click the Start Heating button to heat the test tube in a water bath to about 100 degrees Celsius.");
                // Color will change during heating
            } else {
                // For non-heating tests, animate color change gradually over 3 seconds
                const colorChangeDuration = 3000; // 3 seconds
                const startTime = Date.now();
                
                const animateColor = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / colorChangeDuration, 1);
                    setColorChangeProgress(progress);
                    
                    if (progress < 1) {
                        requestAnimationFrame(animateColor);
                    } else {
                        setCurrentStep('observe');
                        setTeacherMessage(`Now observe the test tube carefully. The color has changed to show ${testResult.colorChange}. This indicates ${testResult.nutrient}! Click "View Test Result" to see the details.`);
                    }
                };
                
                requestAnimationFrame(animateColor);
            }
        }, 2500);
    };

    const handleStartHeating = () => {
        setIsHeating(true);
        setTeacherMessage('Heating the test tube... Watch the temperature rise and look for color changes. Safety first - in a real lab, always use a water bath and never heat directly over a flame!');
    };

    const handleShowResult = () => {
        if (!selectedFood || !selectedReagent) return;
        
        // Result should already be set from handleAddReagent or heating completion
        const testResult = result || resultsMap[selectedFood][selectedReagent];
        if (!result) {
            setResult(testResult);
        }
        
        setCurrentStep('result');
        
        const isPositive = !testResult.nutrient.includes('No ') && !testResult.nutrient.includes('trace');
        
        if (isPositive) {
            setTeacherMessage(`Test complete! The ${selectedReagent} has reacted positively, showing ${testResult.colorChange}. This confirms the presence of ${testResult.nutrient}. Excellent observation! Now let's test your knowledge with a quiz.`);
        } else {
            setTeacherMessage(`Test complete! The ${selectedReagent} shows ${testResult.colorChange}. This means ${testResult.nutrient} in this food sample. Good work! Now try the quiz to check your understanding.`);
        }
    };

    const handleViewQuiz = () => {
        setCurrentStep('quiz');
        setTimeout(() => {
            const quizSection = document.querySelector('[data-quiz-section]');
            quizSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
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
                setCurrentStep('complete');
                
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
        setCollectedItems([]);
        setShowSupplies(true);
        setColorChangeProgress(0);
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
        <div className="space-y-6 pb-20 relative">
            {/* Premium animated background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-green-300/20 via-amber-300/20 to-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-orange-300/20 via-amber-300/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            
            {/* Premium Completion Badge */}
            {hasCompleted && labProgress && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative p-6 bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl border-2 border-amber-400/50 dark:border-amber-600/50 shadow-2xl overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/30 to-yellow-400/30 rounded-full blur-3xl"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl shadow-lg">
                                <Trophy className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <div className="font-bold text-xl bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">Lab Completed!</div>
                                <div className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                                    Score: <span className="font-bold">{labProgress.score}%</span>
                                </div>
                            </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0 shadow-lg px-4 py-2 text-base font-bold">
                            <Award className="h-4 w-4 mr-2" />
                            {labProgress.xpEarned} XP
                        </Badge>
                    </div>
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
                            label: '❓ Need help choosing?',
                            onClick: () => {
                                setTeacherMessage('Try bread if you want to test for starch, egg white for protein, milk for multiple nutrients, or groundnut paste for fats!');
                                setTeacherEmotion('happy');
                            }
                        }] : []),
                        ...(currentStep === 'observe' ? [{
                            label: '👁️ Show result',
                            onClick: handleShowResult
                        }] : []),
                        ...(currentStep === 'result' ? [{
                            label: '→ Start quiz',
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

            {/* Premium Objective Card */}
            <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-purple-300/50 dark:border-purple-700/50 shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-pink-400/5 to-indigo-400/5"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full blur-3xl"></div>
                <CardHeader className="relative z-10 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-950/40 dark:to-indigo-950/40 border-b border-purple-200/50 dark:border-purple-800/50">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg">
                            <span className="text-2xl">🎯</span>
                        </div>
                        <span className="bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">Objective</span>
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mt-2">
                        {objectiveText}
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Premium Lab Information Card */}
            {currentStep === 'intro' && (
                <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-purple-300/50 dark:border-purple-700/50 shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-indigo-400/5 to-purple-400/5"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
                    <CardHeader className="relative z-10 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 border-b border-blue-200/50 dark:border-blue-800/50">
                        <CardTitle className="flex items-center gap-3 text-xl font-bold">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                                <span className="text-2xl">📚</span>
                            </div>
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Lab Information</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 pt-6">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1" className="border-2 border-purple-200/30 dark:border-purple-800/30 rounded-xl mb-3 px-4">
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg">
                                            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">Background Theory</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                                    <p>{theoryText}</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-2 border-green-200/30 dark:border-green-800/30 rounded-xl px-4">
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                                            <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">Safety Precautions</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                                    <p>{safetyText}</p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            )}

            {/* Premium Main Lab Interface */}
            <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-purple-300/50 dark:border-purple-700/50 shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-violet-400/5 to-indigo-400/5"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full blur-3xl"></div>
                <CardHeader className="relative z-10 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-950/40 dark:to-indigo-950/40 border-b border-purple-200/50 dark:border-purple-800/50">
                    <CardTitle className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg">
                                <span className="text-3xl">🧪</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Interactive Food Test Lab</span>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowSafetyGear(!showSafetyGear)}
                            className={cn(
                                "transition-all hover:scale-105 border-2 font-semibold",
                                showSafetyGear 
                                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500 text-green-700 dark:text-green-400" 
                                    : "border-slate-300 dark:border-slate-700"
                            )}
                        >
                            {showSafetyGear ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                            Safety {showSafetyGear ? 'ON' : 'OFF'}
                        </Button>
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400 text-base">Follow the teacher's guidance to perform food nutrient tests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                    {/* Premium Start Button (intro step) */}
                    {currentStep === 'intro' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-16 space-y-6 relative z-10"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                                <FlaskConical className="h-32 w-32 text-purple-600 dark:text-purple-400 relative z-10" />
                            </div>
                            <Button 
                                size="lg" 
                                onClick={handleStartExperiment}
                                className="text-lg px-10 py-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-bold relative z-10"
                            >
                                Start Experiment 🧪
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
                            description="Collect all the supplies needed for food testing experiments"
                        />
                    )}

                    {/* Premium Food Selection */}
                    {currentStep === 'select-food' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Label className="text-xl font-bold flex items-center gap-3 bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">
                                <Utensils className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
                                                className={cn(
                                                    "h-auto w-full flex-col gap-3 py-6 border-2 transition-all",
                                                    selectedFood === food
                                                        ? "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl"
                                                        : "text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-700 dark:hover:text-purple-300 border-slate-300 dark:border-slate-700"
                                                )}
                                            >
                                                <Icon className={cn(
                                                    "h-12 w-12",
                                                    selectedFood === food 
                                                        ? "text-white" 
                                                        : "text-slate-700 dark:text-slate-300"
                                                )} />
                                                <span className={cn(
                                                    "text-base font-semibold",
                                                    selectedFood === food 
                                                        ? "text-white" 
                                                        : "text-slate-700 dark:text-slate-300"
                                                )}>{food}</span>
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Premium Reagent Selection */}
                    {currentStep === 'select-reagent' && selectedFood && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-xl border-2 border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm">
                                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl">
                                    <FoodIcon className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Testing</div>
                                    <div className="font-bold text-lg bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">{selectedFood}</div>
                                </div>
                            </div>
                            
                            <Label className="text-xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                <Beaker className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                Select a Test Reagent
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reagentOptions.map(reagent => (
                                    <motion.div key={reagent} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button 
                                            variant={selectedReagent === reagent ? 'default' : 'outline'}
                                            onClick={() => handleReagentSelect(reagent)}
                                            className={cn(
                                                "h-auto w-full flex items-center gap-3 py-5 px-4 text-left border-2 transition-all",
                                                selectedReagent === reagent
                                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                                                    : "text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-700 dark:hover:text-blue-300"
                                            )}
                                        >
                                            <TestTube className="h-6 w-6 flex-shrink-0" />
                                            <span className="text-base font-semibold">{reagent}</span>
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
                                                        "absolute inset-x-2 bottom-2 rounded-b-2xl",
                                                        // Base color (initial amber)
                                                        'bg-gradient-to-b from-amber-100 to-amber-200'
                                                    )}
                                                >
                                                    {/* Overlay that gradually reveals the final color */}
                                                    {result && (
                                                        <motion.div
                                                            className={cn(
                                                                "absolute inset-0 rounded-b-2xl",
                                                                result.colorClass
                                                            )}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ 
                                                                opacity: colorChangeProgress
                                                            }}
                                                            transition={{ duration: 0.1, ease: "linear" }}
                                                        />
                                                    )}
                                                    
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

                    {/* Premium Result Display */}
                    <AnimatePresence>
                        {result && currentStep === 'result' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 sm:p-6 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl border-2 border-green-400/50 dark:border-green-600/50 shadow-2xl overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full blur-3xl"></div>
                                <div className="relative flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                                    {/* Icon - smaller on mobile, hidden on very small screens */}
                                    <div className="hidden sm:block p-3 sm:p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
                                        <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                                    </div>
                                    <div className="flex-1 w-full space-y-3 sm:space-y-4">
                                        <h3 className="font-bold text-lg sm:text-xl bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                            Test Complete! ✓
                                        </h3>
                                        <p className="text-green-800 dark:text-green-200 font-semibold text-sm sm:text-base leading-relaxed">
                                            {result.text}
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t-2 border-green-300/50 dark:border-green-700/50">
                                            <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200/50 dark:border-green-800/50">
                                                <div className="text-xs text-green-600 dark:text-green-400 font-bold mb-2">Nutrient Detected</div>
                                                <div className="text-sm sm:text-base font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{result.nutrient}</div>
                                            </div>
                                            <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200/50 dark:border-green-800/50">
                                                <div className="text-xs text-green-600 dark:text-green-400 font-bold mb-2">Color Change</div>
                                                <div className="text-sm sm:text-base font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{result.colorChange}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 relative z-10 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/30 dark:to-indigo-950/30 border-t border-purple-200/50 dark:border-purple-800/50">
                    {/* Premium Action buttons */}
                    {currentStep === 'select-reagent' && selectedReagent && (
                        <Button 
                            size="lg" 
                            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-bold py-6"
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
                            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-bold py-6"
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
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-bold py-6"
                            onClick={handleShowResult}
                            data-action-button
                        >
                            <Eye className="h-5 w-5 mr-2" />
                            View Test Result
                        </Button>
                    )}

                    {currentStep === 'result' && (
                        <Button 
                            size="lg" 
                            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-bold py-6"
                            onClick={handleViewQuiz}
                            data-action-button
                        >
                            <BookOpen className="h-5 w-5 mr-2" />
                            Take the Quiz
                        </Button>
                    )}
                    
                    {currentStep !== 'intro' && (
                        <Button 
                            variant="outline" 
                            onClick={handleReset}
                            className="w-full border-2 border-purple-300 dark:border-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-950/30 dark:hover:to-indigo-950/30 hover:text-purple-700 dark:hover:text-purple-300 font-semibold py-6 transition-all duration-300 text-slate-700 dark:text-slate-300"
                        >
                            Reset & Try Another Test
                        </Button>
                    )}
                    
                    {selectedReagent === "Benedict's Solution" && currentStep !== 'intro' && (
                        <div className="flex items-center gap-3 text-sm bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 px-5 py-3 rounded-xl border-2 border-orange-300/50 dark:border-orange-700/50 backdrop-blur-sm w-full">
                            <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                            <span className="font-semibold text-orange-700 dark:text-orange-300">Note: Benedict's test requires heating to 80-100°C</span>
                        </div>
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
                    <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-purple-300/50 dark:border-purple-700/50 shadow-2xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-pink-400/5 to-indigo-400/5"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full blur-3xl"></div>
                        <CardHeader className="relative z-10 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-950/40 dark:to-indigo-950/40 border-b border-purple-200/50 dark:border-purple-800/50">
                            <CardTitle className="text-2xl flex items-center gap-3 font-bold">
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg">
                                    <span className="text-2xl">📝</span>
                                </div>
                                <span className="bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">Post-Lab Quiz</span>
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400 text-base mt-2">Test your understanding of the experiment</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10 pt-6">
                            <p className="font-bold text-lg text-slate-700 dark:text-slate-300">
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
                                className="space-y-3"
                            >
                                {[
                                    { value: "Iodine Solution", label: "Iodine Solution (tests for starch)", id: "q-iodine" },
                                    { value: "Biuret Solution", label: "Biuret Solution (tests for proteins)", id: "q-biuret" },
                                    { value: "Benedict's Solution", label: "Benedict's Solution (tests for reducing sugars)", id: "q-benedict" },
                                    { value: "Ethanol", label: "Ethanol (tests for fats)", id: "q-ethanol" }
                                ].map((option) => (
                                    <motion.div 
                                        key={option.id}
                                        whileHover={{ scale: 1.02 }}
                                        className={cn(
                                            "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                                            quizAnswer === option.value
                                                ? "bg-gradient-to-r from-purple-500/20 to-violet-500/20 border-purple-400/50 dark:border-purple-600/50"
                                                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700"
                                        )}
                                        onClick={() => {
                                            if (quizIsCorrect === null) {
                                                setQuizAnswer(option.value);
                                                setQuizIsCorrect(null);
                                                setQuizFeedback(null);
                                            }
                                        }}
                                    >
                                        <RadioGroupItem value={option.value} id={option.id} className="border-2" />
                                        <Label htmlFor={option.id} className="cursor-pointer flex-1 font-medium text-slate-700 dark:text-slate-300">
                                            {option.label}
                                        </Label>
                                    </motion.div>
                                ))}
                            </RadioGroup>
                            
                            {quizFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={cn(
                                        "p-5 rounded-xl border-2 flex items-start gap-4 backdrop-blur-sm",
                                        quizIsCorrect 
                                            ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-400/50 dark:border-green-600/50"
                                            : quizIsCorrect === false
                                            ? "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-400/50 dark:border-red-600/50"
                                            : "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-400/50 dark:border-blue-600/50"
                                    )}
                                >
                                    {quizIsCorrect ? (
                                        <div className="text-3xl">✅</div>
                                    ) : quizIsCorrect === false ? (
                                        <div className="text-3xl">❌</div>
                                    ) : (
                                        <Sparkles className="h-6 w-6 flex-shrink-0 mt-0.5 text-blue-600" />
                                    )}
                                    <p className="text-base font-semibold flex-1">{quizFeedback}</p>
                                </motion.div>
                            )}
                        </CardContent>
                        <CardFooter className="relative z-10 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/30 dark:to-indigo-950/30 border-t border-purple-200/50 dark:border-purple-800/50">
                            <Button 
                                onClick={handleQuizSubmit} 
                                disabled={!quizAnswer || quizIsCorrect !== null}
                                size="lg"
                                className={cn(
                                    "w-full font-bold py-6 transition-all hover:scale-105 shadow-lg hover:shadow-xl text-white",
                                    quizIsCorrect === true
                                        ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                        : quizIsCorrect === false
                                        ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                                        : "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                                )}
                            >
                                {quizIsCorrect === true ? "Correct! ✓" : quizIsCorrect === false ? "Review Answer" : quizAttempts === 1 ? "Try Again" : "Submit Answer"}
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
                        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-purple-300/50 dark:border-purple-700/50 shadow-2xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-pink-400/5 to-indigo-400/5"></div>
                            <CardHeader className="text-center relative z-10 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-950/40 dark:to-indigo-950/40 border-b border-purple-200/50 dark:border-purple-800/50">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                    className="flex justify-center mb-4"
                                >
                                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-full shadow-2xl">
                                        <Trophy className="h-16 w-16 text-white" />
                                    </div>
                                </motion.div>
                                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    Lab Complete! 🎉
                                </CardTitle>
                                <CardDescription className="text-base mt-2">
                                    You've mastered food nutrient testing!
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 relative z-10 pt-6">
                                <div className="bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-indigo-50/80 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-indigo-950/30 p-6 rounded-xl border-2 border-purple-300/50 dark:border-purple-700/50 shadow-lg backdrop-blur-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-center text-lg mb-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                            What You've Learned:
                                        </h3>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-start gap-3">
                                                <div className="p-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mt-0.5 flex-shrink-0">
                                                    <CheckCircle className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-purple-800 dark:text-purple-200">How to use Iodine Solution to test for starch (blue-black color change)</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="p-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mt-0.5 flex-shrink-0">
                                                    <CheckCircle className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-purple-800 dark:text-purple-200">How to use Benedict's Solution to test for reducing sugars (requires heating)</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="p-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mt-0.5 flex-shrink-0">
                                                    <CheckCircle className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-purple-800 dark:text-purple-200">How to use Biuret Solution to test for proteins (purple color change)</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="p-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mt-0.5 flex-shrink-0">
                                                    <CheckCircle className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-purple-800 dark:text-purple-200">How to use Ethanol for the emulsion test to detect fats and oils</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="p-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mt-0.5 flex-shrink-0">
                                                    <CheckCircle className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-purple-800 dark:text-purple-200">How different foods contain different nutrients and how to identify them</span>
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
                            <CardFooter className="relative z-10 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/30 dark:to-indigo-950/30 border-t border-purple-200/50 dark:border-purple-800/50">
                                <Button 
                                    onClick={handleReset} 
                                    variant="outline" 
                                    className="w-full border-2 border-purple-300 dark:border-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-950/30 dark:hover:to-indigo-950/30 hover:text-purple-700 dark:hover:text-purple-300 text-slate-700 dark:text-slate-300 font-semibold transition-all duration-300" 
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
