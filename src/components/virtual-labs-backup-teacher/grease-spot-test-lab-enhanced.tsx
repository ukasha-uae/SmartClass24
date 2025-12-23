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
    Utensils, Leaf, Newspaper, Droplets, Eye, EyeOff,
    Sparkles, Trophy, Award, Sun, Clock
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherVoice } from './TeacherVoice';
import { useLabProgress } from '@/stores/lab-progress-store';
import confetti from 'canvas-confetti';

type TestStep = 'intro' | 'select-food' | 'apply' | 'wait' | 'observe' | 'result' | 'quiz';
type FoodSample = 'Groundnut Paste' | 'Bread' | 'Boiled Rice' | 'Water';

interface FoodInfo {
    hasFat: boolean;
    fatLevel: 'high' | 'low' | 'none';
    icon: React.ElementType;
    description: string;
    result: string;
}

const foodData: Record<FoodSample, FoodInfo> = {
    'Groundnut Paste': { 
        hasFat: true, 
        fatLevel: 'high', 
        icon: Leaf,
        description: 'Very translucent grease spot - HIGH fat content',
        result: 'A large, very translucent grease spot appeared! Groundnut paste is rich in oils and fats.'
    },
    'Bread': { 
        hasFat: true, 
        fatLevel: 'low', 
        icon: Utensils,
        description: 'Small, faint grease spot - LOW fat content',
        result: 'A small, faint translucent spot appeared. Bread contains some fat from butter or oil, but not much.'
    },
    'Boiled Rice': { 
        hasFat: false, 
        fatLevel: 'none', 
        icon: Utensils,
        description: 'No grease spot - NO fat detected',
        result: 'The paper stayed opaque with no translucent spot. Boiled rice contains almost no fat.'
    },
    'Water': { 
        hasFat: false, 
        fatLevel: 'none', 
        icon: Droplets,
        description: 'No grease spot - NO fat (negative control)',
        result: 'The paper dried completely with no translucent spot. Water is our negative control - it contains no fat.'
    },
};

const foodOptions: FoodSample[] = ['Groundnut Paste', 'Bread', 'Boiled Rice', 'Water'];

export function GreaseSpotTestLabEnhanced() {
    const { toast } = useToast();
    
    // Lab state
    const [currentStep, setCurrentStep] = React.useState<TestStep>('intro');
    const [selectedFood, setSelectedFood] = React.useState<FoodSample | null>(null);
    const [isApplying, setIsApplying] = React.useState(false);
    const [dryProgress, setDryProgress] = React.useState(0);
    const [showSafety, setShowSafety] = React.useState(true);
    
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
    const hasCompleted = isLabCompleted('grease-spot-test');
    const labProgress = getLabCompletion('grease-spot-test');
    
    // Drying progress effect
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (currentStep === 'wait' && dryProgress < 100) {
            interval = setInterval(() => {
                setDryProgress(prev => Math.min(prev + 5, 100));
            }, 150);
        }
        return () => clearInterval(interval);
    }, [currentStep, dryProgress]);

    // Complete drying when progress reaches 100
    React.useEffect(() => {
        if (dryProgress >= 100 && currentStep === 'wait') {
            setTimeout(() => {
                setCurrentStep('observe');
                setTeacherMessage('The paper has dried! Now, hold it up to the light. Can you see a translucent spot where the food was rubbed? A translucent grease spot means fat is present!');
            }, 300);
        }
    }, [dryProgress, currentStep]);

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
            setTeacherMessage('Welcome to the Grease Spot Test! This is one of the simplest tests to detect fats and oils in food. We rub food on brown paper, let it dry, then hold it up to light. If we see a translucent greasy spot, fats are present! Ready to start?');
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setCurrentStep('select-food');
        setTeacherMessage('Choose a food sample to test. We have groundnut paste (very oily), bread (small amount of fat), boiled rice (almost no fat), and water as our negative control. Which one would you like to test first?');
    };

    const handleFoodSelect = (food: FoodSample) => {
        setSelectedFood(food);
        
        const messages: Record<FoodSample, string> = {
            'Groundnut Paste': 'Excellent choice! Groundnut paste is made from peanuts, which are about 50% fat by weight. This should give us a very clear grease spot. Click Rub on Paper to apply it!',
            'Bread': 'Good choice! Bread contains some fat from butter or oil used in baking, but not a lot. Click Rub on Paper to test it!',
            'Boiled Rice': 'Interesting! Boiled rice is mostly carbohydrate (starch) with very little fat. This is a good test to see a negative result. Click Rub on Paper!',
            'Water': 'Smart thinking! Water is our negative control - it contains absolutely no fat. This will show us what a negative result looks like. Click Rub on Paper!'
        };
        
        setTeacherMessage(messages[food]);
        setPendingTransition(() => () => {
            setTimeout(() => {
                const actionButton = document.querySelector('[data-action-button]');
                actionButton?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
    };

    const handleApply = () => {
        if (!selectedFood) return;
        
        setIsApplying(true);
        setCurrentStep('apply');
        setTeacherMessage(`Rubbing ${selectedFood} onto the brown paper... We want to create a nice spot where the food touches the paper. Any oils or fats will be absorbed into the paper fibers.`);
        
        setTimeout(() => {
            setIsApplying(false);
            setCurrentStep('wait');
            setDryProgress(0);
            setTeacherMessage('Good! Now we need to let the paper dry completely. Any water from the food will evaporate, but fats and oils will remain in the paper. Watch as it dries...');
        }, 2500);
    };

    const handleShowResult = () => {
        if (!selectedFood) return;
        
        setCurrentStep('result');
        const foodInfo = foodData[selectedFood];
        
        setTeacherMessage(foodInfo.result);
        setPendingTransition(() => () => {
            setTimeout(() => {
                const quizSection = document.querySelector('[data-quiz-section]');
                quizSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        
        const correctAnswer = 'Groundnut Paste';
        const isCorrect = quizAnswer === correctAnswer;
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Perfect! Groundnut paste has the highest fat content (about 50%) and produces the most obvious translucent grease spot. ✅");
            
            if (!hasCompleted) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                const score = newAttempts === 1 ? 100 : 75;
                const earnedXP = markLabComplete('grease-spot-test', score, timeSpent);
                
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                
                setXpEarned(earnedXP);
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 5000);
                
                setTeacherMessage(`Excellent work! You've mastered the grease spot test and earned ${earnedXP} XP! You now have ${totalXP + earnedXP} total XP. Remember, translucent spots mean fats are present!`);
            } else {
                setTeacherMessage('Correct! You clearly understand how to identify high-fat foods. Well done!');
            }
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite. Think about which food is made almost entirely from nuts, which are very high in oil. Try again! 🔄");
                setTeacherMessage('Which food sample would leave the largest, most visible translucent spot? Think about nut oils!');
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback(`The correct answer is ${correctAnswer}. Nuts like groundnuts (peanuts) are extremely high in healthy fats and oils. 🧠`);
                setTeacherMessage('Groundnut paste wins! Peanuts are about 50% fat, making them one of the richest sources of healthy oils.');
            }
        }
    };

    const handleReset = () => {
        setCurrentStep('intro');
        setSelectedFood(null);
        setIsApplying(false);
        setDryProgress(0);
        setQuizAnswer('');
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setXpEarned(0);
        setShowCelebration(false);
        setTeacherMessage('Ready to test another food? The grease spot test is quick and simple - perfect for identifying fatty foods! Click Start Experiment when ready.');
    };

    const objectiveText = "To learn how to test for the presence of fats and oils in different food samples using the simple grease spot test.";
    const theoryText = "The grease spot test is a simple physical method to detect fats and oils in food. Fats and oils are lipids that are hydrophobic (water-repelling) but readily absorbed by paper. When a food containing fat is rubbed onto brown paper, the fat soaks into the paper fibers. After the paper dries, any water evaporates, but the fat remains. Fat makes the paper translucent (allows light to pass through), creating a characteristic 'grease spot' that persists even when dry. The size and intensity of the spot indicate the amount of fat present.";
    const safetyText = "The grease spot test is very safe and can be done at home. Key precautions: Handle food samples hygienically and wash hands before and after. Do not eat any food samples used in experiments unless specifically designated as edible. Use clean brown paper or paper bags. Work on a clean surface. If testing unknown substances, avoid contact with skin and eyes. Clean up spills immediately to prevent slipping hazards.";

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
                        <span>📄 Interactive Grease Spot Test</span>
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
                    <CardDescription>Test foods for fats using translucent grease spots</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Start Button */}
                    {currentStep === 'intro' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-12 space-y-4"
                        >
                            <Newspaper className="h-24 w-24 text-amber-600" />
                            <Button 
                                size="lg" 
                                onClick={handleStartExperiment}
                                className="text-lg px-8"
                            >
                                Start Experiment 📄
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
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                                                <span className="text-xs sm:text-sm font-medium text-center">{food}</span>
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Brown Paper Visualization */}
                    {(currentStep === 'apply' || currentStep === 'wait' || currentStep === 'observe' || currentStep === 'result') && selectedFood && (
                        <div className="relative flex items-center justify-center p-8 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border-2 min-h-[450px]">
                            {/* Light source */}
                            {(currentStep === 'observe' || currentStep === 'result') && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute top-8 right-8"
                                >
                                    <Sun className="h-16 w-16 text-yellow-500" />
                                    <motion.div
                                        animate={{ 
                                            opacity: [0.3, 0.6, 0.3],
                                            scale: [1, 1.2, 1]
                                        }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute inset-0 bg-yellow-300 rounded-full blur-2xl"
                                    />
                                </motion.div>
                            )}

                            {/* Brown Paper */}
                            <motion.div 
                                className="relative w-64 h-80 sm:w-80 sm:h-96 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg shadow-2xl border-4 border-amber-800"
                                animate={
                                    currentStep === 'observe' || currentStep === 'result'
                                        ? { rotateY: [0, 10, -10, 0] }
                                        : {}
                                }
                                transition={{ duration: 2, repeat: currentStep === 'observe' ? Infinity : 0 }}
                            >
                                {/* Paper texture */}
                                <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiAvPjwvc3ZnPg==')] rounded-lg" />
                                
                                {/* Grease spot */}
                                <AnimatePresence>
                                    {(currentStep === 'apply' || currentStep === 'wait' || currentStep === 'observe' || currentStep === 'result') && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ 
                                                scale: 1,
                                                opacity: foodData[selectedFood].fatLevel === 'high' ? 0.7 :
                                                        foodData[selectedFood].fatLevel === 'low' ? 0.35 : 0.05
                                            }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                        >
                                            <div 
                                                className={cn(
                                                    "rounded-full blur-sm transition-all duration-1000",
                                                    foodData[selectedFood].fatLevel === 'high' 
                                                        ? "w-32 h-32 sm:w-40 sm:h-40 bg-yellow-200/60" 
                                                        : foodData[selectedFood].fatLevel === 'low'
                                                        ? "w-20 h-20 sm:w-24 sm:h-24 bg-yellow-200/40"
                                                        : "w-8 h-8 bg-gray-400/10"
                                                )}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Applying hand animation */}
                                {isApplying && (
                                    <motion.div
                                        initial={{ x: -100, y: -100, rotate: -45 }}
                                        animate={{ 
                                            x: [20, 60, 40, 80, 20],
                                            y: [20, 60, 80, 40, 20],
                                            rotate: [-45, -30, -60, -45]
                                        }}
                                        transition={{ duration: 2, repeat: 1 }}
                                        className="absolute text-6xl"
                                    >
                                        ✋
                                    </motion.div>
                                )}

                                {/* Drying indicator */}
                                {currentStep === 'wait' && (
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg">
                                            <Clock className="h-4 w-4 text-blue-600" />
                                            <div className="flex-1">
                                                <div className="text-xs font-semibold mb-1">Drying...</div>
                                                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        className="h-full bg-blue-500"
                                                        style={{ width: `${dryProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Label */}
                                <div className="absolute -left-4 sm:-left-28 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg border text-xs">
                                    <div className="font-bold text-xs sm:text-sm">{selectedFood}</div>
                                    <div className="text-muted-foreground mt-1 text-[10px] sm:text-xs">Brown Paper</div>
                                    {(currentStep === 'result') && (
                                        <div className="mt-2 font-semibold text-amber-600 capitalize text-[10px] sm:text-xs">
                                            {foodData[selectedFood].fatLevel} Fat
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Safety indicator */}
                            {showSafety && (
                                <div className="absolute top-4 left-4 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg border border-green-500 flex items-center gap-2">
                                    <div className="text-2xl">🧤</div>
                                    <div className="text-xs font-semibold text-green-700 dark:text-green-400">Clean Hands</div>
                                </div>
                            )}

                            {/* Step indicator */}
                            <div className="absolute top-4 right-4 bg-primary/10 px-4 py-2 rounded-lg border border-primary/30">
                                <div className="text-xs font-semibold text-primary capitalize">{currentStep}</div>
                            </div>
                        </div>
                    )}

                    {/* Result Display */}
                    <AnimatePresence>
                        {currentStep === 'result' && selectedFood && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-xl border-2 border-amber-200 dark:border-amber-800"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-amber-500 rounded-full flex-shrink-0">
                                        <CheckCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h3 className="font-bold text-lg text-amber-900 dark:text-amber-100">
                                            Test Complete! ✓
                                        </h3>
                                        <p className="font-medium text-amber-800 dark:text-amber-200">
                                            {foodData[selectedFood].description}
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-amber-200 dark:border-amber-800">
                                            <div>
                                                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">Food Sample</div>
                                                <div className="text-sm font-bold text-amber-900 dark:text-amber-100">{selectedFood}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">Fat Content</div>
                                                <div className="text-sm font-bold text-amber-900 dark:text-amber-100 capitalize">
                                                    {foodData[selectedFood].fatLevel}
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
                    {currentStep === 'select-food' && selectedFood && (
                        <Button 
                            size="lg" 
                            className="w-full bg-amber-600 hover:bg-amber-700"
                            onClick={handleApply}
                            data-action-button
                        >
                            <Newspaper className="h-5 w-5 mr-2" />
                            Rub on Brown Paper
                        </Button>
                    )}
                    
                    {currentStep === 'observe' && (
                        <Button 
                            size="lg" 
                            className="w-full"
                            onClick={handleShowResult}
                            data-action-button
                        >
                            <Eye className="h-5 w-5 mr-2" />
                            View Result Analysis
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
                                Which food sample produces the MOST obvious translucent grease spot?
                            </p>
                            <RadioGroup 
                                value={quizAnswer} 
                                onValueChange={setQuizAnswer}
                                disabled={quizIsCorrect !== null}
                            >
                                {foodOptions.filter(f => f !== 'Water').map(food => (
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
