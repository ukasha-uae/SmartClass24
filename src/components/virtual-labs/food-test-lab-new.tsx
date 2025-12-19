'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Flame, TestTube, Utensils, Egg, Milk, Leaf, Droplets, ThermometerSun, Clock, Beaker, FlaskConical, EyeOff, Eye } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { motion, AnimatePresence } from 'framer-motion';

// --- Type Definitions ---
type FoodType = 'Bread' | 'Egg White' | 'Milk' | 'Groundnut Paste';
type ReagentType = 'Iodine Solution' | "Benedict's Solution" | 'Biuret Solution' | 'Ethanol';
type TestStep = 'prepare' | 'add-reagent' | 'heating' | 'observe' | 'complete';
type Result = {
    colorClass: string;
    text: string;
    nutrient: string;
    colorChange: string;
};

// --- Data ---
const foodOptions: FoodType[] = ['Bread', 'Egg White', 'Milk', 'Groundnut Paste'];
const reagentOptions: ReagentType[] = ['Iodine Solution', "Benedict's Solution", 'Biuret Solution', 'Ethanol'];
const foodIcons: Record<FoodType, React.ElementType> = {
    'Bread': Utensils,
    'Egg White': Egg,
    'Milk': Milk,
    'Groundnut Paste': Leaf,
};

const resultsMap: Record<FoodType, Partial<Record<ReagentType, Result>>> = {
    'Bread': {
        'Iodine Solution': { 
            colorClass: 'bg-gradient-to-b from-blue-900 via-indigo-950 to-black', 
            text: 'Blue-black color observed. Starch is present.',
            nutrient: 'Starch (Carbohydrate)',
            colorChange: 'Brown → Blue-black'
        },
        "Benedict's Solution": { 
            colorClass: 'bg-gradient-to-b from-orange-600 via-red-600 to-orange-800', 
            text: 'Brick-red precipitate formed. Reducing sugar is present.',
            nutrient: 'Reducing Sugar',
            colorChange: 'Blue → Green → Yellow → Orange → Brick-red'
        },
    },
    'Egg White': {
        'Biuret Solution': { 
            colorClass: 'bg-gradient-to-b from-purple-500 via-purple-600 to-purple-700', 
            text: 'Purple/Violet color formed. Protein is present.',
            nutrient: 'Protein',
            colorChange: 'Blue → Purple'
        },
    },
    'Milk': {
        "Benedict's Solution": { 
            colorClass: 'bg-gradient-to-b from-orange-400 via-orange-600 to-red-500', 
            text: 'Orange-red precipitate formed. Reducing sugar is present.',
            nutrient: 'Reducing Sugar (Lactose)',
            colorChange: 'Blue → Green → Orange-red'
        },
        'Biuret Solution': { 
            colorClass: 'bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600', 
            text: 'Violet color formed. Protein is present.',
            nutrient: 'Protein (Casein)',
            colorChange: 'Blue → Violet'
        },
        'Ethanol': { 
            colorClass: 'bg-white/95 backdrop-blur-md border-2 border-gray-300', 
            text: 'Cloudy white emulsion formed. Fats/Oils are present.',
            nutrient: 'Fats/Lipids',
            colorChange: 'Clear → Cloudy white'
        },
    },
    'Groundnut Paste': {
        'Ethanol': { 
            colorClass: 'bg-white/98 backdrop-blur-lg border-2 border-gray-400', 
            text: 'Cloudy white emulsion formed. Fats/Oils are present.',
            nutrient: 'Fats/Lipids',
            colorChange: 'Clear → Milky white'
        },
        'Biuret Solution': { 
            colorClass: 'bg-gradient-to-b from-purple-300 via-purple-400 to-purple-500', 
            text: 'Light violet color formed. Protein is present.',
            nutrient: 'Protein',
            colorChange: 'Blue → Light violet'
        },
    }
};

const defaultResult: Result = { 
    colorClass: 'bg-gradient-to-b from-blue-100 to-blue-200', 
    text: 'No significant reaction observed.',
    nutrient: 'None detected',
    colorChange: 'No change'
};

// --- Component for Rendering Highlighted Text ---
const HighlightedText = ({ text, sectionId, highlightedSentenceIndex }: {
  text: string;
  sectionId: string;
  highlightedSentenceIndex: number | null;
}) => {
  const sentences = React.useMemo(() => {
    if (!text) return [];
    const matches = text.match(/[^.!?]+[.!?]+(\s|$)/g);
    return matches ? matches.filter(s => s.trim().length > 0) : [text];
  }, [text]);

  if (highlightedSentenceIndex === null || sectionId === null) {
    return <>{text}</>;
  }

  return (
    <>
      {sentences.map((sentence, index) => (
        <span
          key={index}
          className={cn(
            "transition-colors duration-200",
            index === highlightedSentenceIndex && "bg-yellow-200 dark:bg-yellow-800/50 rounded"
          )}
        >
          {sentence}
        </span>
      ))}
    </>
  );
};


export function FoodTestLab() {
    const { toast } = useToast();
    const [selectedFood, setSelectedFood] = React.useState<FoodType | null>(null);
    const [selectedReagent, setSelectedReagent] = React.useState<ReagentType | null>(null);
    const [currentStep, setCurrentStep] = React.useState<TestStep>('prepare');
    const [result, setResult] = React.useState<Result | null>(null);
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);
    const [showDroplets, setShowDroplets] = React.useState(false);
    const [temperature, setTemperature] = React.useState(20);
    const [timer, setTimer] = React.useState(0);
    const [isHeating, setIsHeating] = React.useState(false);
    const [showSafetyGear, setShowSafetyGear] = React.useState(true);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    // Timer effect
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (currentStep === 'heating' || currentStep === 'observe') {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [currentStep]);

    // Heating simulation
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHeating && temperature < 100) {
            interval = setInterval(() => {
                setTemperature(prev => Math.min(prev + 5, 100));
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isHeating, temperature]);

    const handleStartTest = () => {
        if (!selectedFood || !selectedReagent) {
            toast({ title: 'Setup Incomplete', description: 'Please select both a food sample and a reagent.', variant: 'destructive' });
            return;
        }

        if (!showSafetyGear) {
            toast({ title: 'Safety First! 🥽', description: 'Remember to wear safety goggles in a real lab!', variant: 'destructive' });
            return;
        }

        setCurrentStep('prepare');
        setResult(null);
        setTimer(0);
        setTemperature(20);
        toast({ 
            title: 'Preparing Test...', 
            description: `Testing ${selectedFood} with ${selectedReagent}` 
        });

        // Step 1: Prepare sample
        setTimeout(() => {
            setCurrentStep('add-reagent');
            setShowDroplets(true);
            toast({ title: 'Adding Reagent', description: `Adding ${selectedReagent} to the sample...` });
        }, 1500);

        // Step 2: Add reagent
        setTimeout(() => {
            setShowDroplets(false);
            const needsHeat = selectedReagent === "Benedict's Solution";
            
            if (needsHeat) {
                setCurrentStep('heating');
                setIsHeating(true);
                toast({ title: 'Heating Required', description: 'Applying heat to the test tube...' });
            } else {
                setCurrentStep('observe');
                toast({ title: 'Observing Changes', description: 'Watch carefully for color changes...' });
            }
        }, 3000);

        // Step 3: Heat if needed
        const needsHeat = selectedReagent === "Benedict's Solution";
        setTimeout(() => {
            if (needsHeat) {
                setIsHeating(false);
                setCurrentStep('observe');
                toast({ title: 'Heating Complete', description: 'Now observe the result...' });
            }
        }, needsHeat ? 6000 : 0);

        // Step 4: Show result
        setTimeout(() => {
            const outcome = resultsMap[selectedFood]?.[selectedReagent] || defaultResult;
            setResult(outcome);
            setCurrentStep('complete');
            toast({ 
                title: 'Test Complete! ✅', 
                description: outcome.nutrient + ' detected'
            });
        }, needsHeat ? 8000 : 5000);
    };

    const handleReset = () => {
        setSelectedFood(null);
        setSelectedReagent(null);
        setCurrentStep('prepare');
        setResult(null);
        setShowDroplets(false);
        setTemperature(20);
        setTimer(0);
        setIsHeating(false);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        toast({ title: 'Lab Reset', description: 'Ready for a new experiment.' });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'Biuret Solution';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! Biuret solution is used to test for proteins. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite. Think about which reagent reacts with protein bonds. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. The correct answer is Biuret Solution. 🧠");
            }
        }
    };
    
    const handleGenerateReport = () => {
        if (!selectedFood || !selectedReagent || !result) {
            toast({ title: "Experiment Not Run", description: "Please complete a test to generate a report.", variant: "destructive" });
            return;
        }
         toast({
            title: 'Lab Report Generated (Simulation)',
            description: `Test: ${selectedReagent} on ${selectedFood}. Result: ${result.text}`,
        });
    };

    const FoodIcon = selectedFood ? foodIcons[selectedFood] : Utensils;
    
    const objectiveText = "To learn how to use chemical reagents to test for the presence of carbohydrates (starch and reducing sugars), proteins, and fats in various food samples.";
    const theoryText = "Different foods are made of different nutrients. We can use specific chemical tests to find out which nutrients are present. Iodine Solution tests for starch, turning blue-black if present. Benedict's Solution tests for reducing sugars like glucose and requires heating, changing color from blue to brick-red. Biuret Solution tests for proteins, turning from blue to purple. The Ethanol Emulsion Test is used for fats and oils, forming a cloudy white emulsion.";
    const safetyText = "In a real lab, always wear safety goggles. Handle chemical reagents with care. Biuret and Benedict's solutions can be irritants. Be cautious when using a heat source for the Benedict's test.";


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Objective</CardTitle>
                        <TextToSpeech 
                            textToSpeak={objectiveText}
                            onSentenceChange={(i) => setHighlightInfo({ section: 'objective', sentenceIndex: i })}
                            onStart={() => setHighlightInfo({ section: 'objective', sentenceIndex: 0 })}
                            onEnd={() => setHighlightInfo(null)}
                        />
                    </div>
                    <CardDescription>
                        <HighlightedText text={objectiveText} sectionId="objective" highlightedSentenceIndex={highlightInfo?.section === 'objective' ? highlightInfo.sentenceIndex : null} />
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
                                <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /><span>Background Theory</span></div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
                                <div className="flex-grow">
                                    <p><HighlightedText text={theoryText} sectionId="theory" highlightedSentenceIndex={highlightInfo?.section === 'theory' ? highlightInfo.sentenceIndex : null} /></p>
                                </div>
                                <TextToSpeech 
                                    textToSpeak={theoryText}
                                    onSentenceChange={(i) => setHighlightInfo({ section: 'theory', sentenceIndex: i })}
                                    onStart={() => setHighlightInfo({ section: 'theory', sentenceIndex: 0 })}
                                    onEnd={() => setHighlightInfo(null)}
                                    className="flex-shrink-0"
                                />
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-2">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2"><Shield className="h-4 w-4" /><span>Safety Precautions</span></div>
                            </AccordionTrigger>
                             <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
                                <div className="flex-grow">
                                    <p><HighlightedText text={safetyText} sectionId="safety" highlightedSentenceIndex={highlightInfo?.section === 'safety' ? highlightInfo.sentenceIndex : null} /></p>
                                </div>
                                <TextToSpeech 
                                    textToSpeak={safetyText}
                                    onSentenceChange={(i) => setHighlightInfo({ section: 'safety', sentenceIndex: i })}
                                    onStart={() => setHighlightInfo({ section: 'safety', sentenceIndex: 0 })}
                                    onEnd={() => setHighlightInfo(null)}
                                    className="flex-shrink-0"
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

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
                            Safety Gear {showSafetyGear ? 'ON' : 'OFF'}
                        </Button>
                    </CardTitle>
                    <CardDescription>Experience realistic lab procedures with step-by-step guidance and visual feedback</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Lab Equipment Setup */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Food Sample Selection */}
                        <div className="space-y-3">
                            <Label className="font-semibold flex items-center gap-2">
                                <Utensils className="h-4 w-4" />
                                1. Food Sample
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                {foodOptions.map(food => {
                                    const Icon = foodIcons[food];
                                    return (
                                        <Button 
                                            key={food} 
                                            variant={selectedFood === food ? 'default' : 'outline'}
                                            onClick={() => setSelectedFood(food)}
                                            disabled={currentStep !== 'prepare'}
                                            className="h-auto flex-col gap-2 py-3"
                                        >
                                            <Icon className="h-6 w-6" />
                                            <span className="text-xs">{food}</span>
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Reagent Selection */}
                        <div className="space-y-3">
                            <Label className="font-semibold flex items-center gap-2">
                                <Beaker className="h-4 w-4" />
                                2. Test Reagent
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                {reagentOptions.map(reagent => (
                                    <Button 
                                        key={reagent} 
                                        variant={selectedReagent === reagent ? 'default' : 'outline'}
                                        onClick={() => setSelectedReagent(reagent)}
                                        disabled={currentStep !== 'prepare'}
                                        className="h-auto flex-col gap-2 py-3 text-xs"
                                    >
                                        <TestTube className="h-6 w-6" />
                                        {reagent}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Lab Status Panel */}
                        <div className="space-y-3">
                            <Label className="font-semibold flex items-center gap-2">
                                <FlaskConical className="h-4 w-4" />
                                Lab Status
                            </Label>
                            <div className="space-y-2 p-4 bg-muted/30 rounded-lg border">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Step:</span>
                                    <span className="font-semibold capitalize">{currentStep.replace('-', ' ')}</span>
                                </div>
                                {(currentStep === 'heating' || currentStep === 'observe' || currentStep === 'complete') && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            Time:
                                        </span>
                                        <span className="font-mono">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                                    </div>
                                )}
                                {selectedReagent === "Benedict's Solution" && currentStep !== 'prepare' && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-1">
                                            <ThermometerSun className="h-3 w-3" />
                                            Temp:
                                        </span>
                                        <span className={cn("font-mono", temperature >= 80 && "text-orange-600 font-bold")}>
                                            {temperature}°C
                                        </span>
                                    </div>
                                )}
                                {result && (
                                    <div className="pt-2 border-t mt-2">
                                        <div className="text-xs font-semibold text-green-600 mb-1">✓ Test Complete</div>
                                        <div className="text-xs text-muted-foreground">{result.nutrient}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Realistic Test Tube Visualization */}
                    <div className="relative flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 min-h-[400px]">
                        {/* Lab Bench Surface */}
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-amber-900/20 to-transparent" />
                        
                        {/* Test Tube Holder */}
                        <div className="relative">
                            {/* Test Tube Stand */}
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-3 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 rounded-full shadow-lg" />
                            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-24 h-6 bg-gradient-to-b from-gray-500 to-gray-600 rounded-t-full" />

                            {/* Test Tube */}
                            <motion.div 
                                className="relative w-28 h-80"
                                animate={isHeating ? { y: [0, -2, 0] } : {}}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                {/* Test Tube Glass */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/40 via-white/20 to-blue-50/40 rounded-t-full rounded-b-3xl border-4 border-gray-300/50 shadow-2xl backdrop-blur-sm">
                                    {/* Liquid Solution with Color Change Animation */}
                                    <AnimatePresence>
                                        {selectedFood && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ 
                                                    height: result ? '70%' : currentStep !== 'prepare' ? '60%' : '50%',
                                                    opacity: 1
                                                }}
                                                className={cn(
                                                    "absolute inset-x-2 bottom-2 rounded-b-2xl transition-all duration-2000",
                                                    result ? result.colorClass : 'bg-gradient-to-b from-amber-100 to-amber-200'
                                                )}
                                            >
                                                {/* Food particles */}
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

                                                {/* Bubbles during heating */}
                                                {isHeating && (
                                                    <div className="absolute inset-0">
                                                        {[...Array(8)].map((_, i) => (
                                                            <motion.div
                                                                key={i}
                                                                className="absolute w-2 h-2 bg-white/60 rounded-full"
                                                                initial={{ x: 20 + Math.random() * 60, y: '100%' }}
                                                                animate={{ 
                                                                    y: '-20%',
                                                                    scale: [1, 1.5, 0.5]
                                                                }}
                                                                transition={{
                                                                    repeat: Infinity,
                                                                    duration: 2 + Math.random(),
                                                                    delay: i * 0.3
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Reagent Drops Animation */}
                                    <AnimatePresence>
                                        {showDroplets && (
                                            <>
                                                {[...Array(6)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ y: -20, opacity: 1, scale: 0 }}
                                                        animate={{ 
                                                            y: 200,
                                                            scale: [0, 1, 0.5],
                                                            opacity: [1, 1, 0]
                                                        }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 1, delay: i * 0.2 }}
                                                        className="absolute left-1/2 -translate-x-1/2"
                                                    >
                                                        <Droplets className="h-4 w-4 text-blue-600" />
                                                    </motion.div>
                                                ))}
                                            </>
                                        )}
                                    </AnimatePresence>

                                    {/* Glass reflection */}
                                    <div className="absolute inset-y-0 left-1 w-4 bg-gradient-to-r from-white/40 to-transparent rounded-l-full" />
                                </div>

                                {/* Test Tube Label */}
                                {selectedFood && (
                                    <div className="absolute -right-20 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-3 py-2 rounded shadow-lg border text-xs">
                                        <div className="font-semibold">{selectedFood}</div>
                                        {selectedReagent && (
                                            <div className="text-muted-foreground mt-1">+ {selectedReagent}</div>
                                        )}
                                    </div>
                                )}
                            </motion.div>

                            {/* Bunsen Burner (when heating) */}
                            <AnimatePresence>
                                {isHeating && selectedReagent === "Benedict's Solution" && (
                                    <motion.div 
                                        className="absolute -bottom-16 left-1/2 -translate-x-1/2"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {/* Flame */}
                                        <motion.div
                                            animate={{ 
                                                scale: [1, 1.1, 0.9, 1],
                                                rotate: [0, -5, 5, 0]
                                            }}
                                            transition={{ repeat: Infinity, duration: 0.5 }}
                                            className="relative"
                                        >
                                            <Flame className="h-16 w-16 text-orange-500" />
                                            <Flame className="h-16 w-16 text-yellow-400 absolute inset-0 opacity-60" />
                                            <Flame className="h-12 w-12 text-blue-400 absolute inset-0 m-auto opacity-80" />
                                        </motion.div>
                                        {/* Burner base */}
                                        <div className="w-16 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-xl mx-auto border-t-2 border-gray-500" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Safety Equipment Indicator */}
                        {showSafetyGear && (
                            <div className="absolute top-4 left-4 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg border border-green-500 flex items-center gap-2">
                                <div className="text-2xl">🥽</div>
                                <div className="text-xs font-semibold text-green-700 dark:text-green-400">Safety ON</div>
                            </div>
                        )}

                        {/* Current Step Indicator */}
                        <div className="absolute top-4 right-4 bg-primary/10 px-4 py-2 rounded-lg border border-primary/30">
                            <div className="text-xs font-semibold text-primary capitalize">{currentStep.replace('-', ' ')}</div>
                        </div>
                    </div>

                    {/* Observation Results */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-green-200 dark:border-green-800"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-500 rounded-full">
                                        <CheckCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <h3 className="font-bold text-lg text-green-900 dark:text-green-100">
                                            Test Result: Positive ✓
                                        </h3>
                                        <p className="text-green-800 dark:text-green-200 font-medium">
                                            {result.text}
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                                            <div>
                                                <div className="text-xs text-green-600 dark:text-green-400 font-semibold">Nutrient Detected</div>
                                                <div className="text-sm font-bold text-green-900 dark:text-green-100">{result.nutrient}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-green-600 dark:text-green-400 font-semibold">Color Change</div>
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
                    <div className="flex w-full gap-3">
                        <Button 
                            onClick={handleStartTest} 
                            disabled={!selectedFood || !selectedReagent || currentStep !== 'prepare'} 
                            className="flex-1"
                            size="lg"
                        >
                            {currentStep !== 'prepare' ? 'Testing in Progress...' : 'Start Test 🧪'}
                        </Button>
                        <Button variant="outline" onClick={handleReset} size="lg" className="flex-1">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset Lab
                        </Button>
                    </div>
                    {selectedReagent === "Benedict's Solution" && (
                        <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-800 w-full">
                           <Flame className="h-4 w-4" />
                           <span className="font-medium">Note: This test requires heating to 80-100°C in a water bath</span>
                        </div>
                    )}
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Post-Lab Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-2 font-medium">Which reagent is used to test for the presence of protein?</p>
                    <RadioGroup value={quizAnswer} onValueChange={(v) => {setQuizAnswer(v); setQuizIsCorrect(null); setQuizAttempts(0); setQuizFeedback(null);}} disabled={quizIsCorrect !== null}>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Iodine Solution" id="q-iodine" /><Label htmlFor="q-iodine">Iodine Solution</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Biuret Solution" id="q-biuret" /><Label htmlFor="q-biuret">Biuret Solution</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Ethanol" id="q-ethanol" /><Label htmlFor="q-ethanol">Ethanol</Label></div>
                    </RadioGroup>
                     {quizFeedback && <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", quizIsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100", quizIsCorrect === null && "text-blue-700 bg-blue-100")}>{quizIsCorrect ? <CheckCircle /> : !quizIsCorrect && quizAttempts > 1 ? <XCircle /> : <RefreshCw className="animate-spin" />}{quizFeedback}</p>}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleQuizSubmit} disabled={!quizAnswer || quizIsCorrect !== null} size="sm">
                        {quizIsCorrect === true ? "Correct!" : quizIsCorrect === false ? "Answer Shown" : quizAttempts === 1 && quizIsCorrect === null ? "Try Again" : "Check Answer"}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader><CardTitle>Lab Report</CardTitle></CardHeader>
                <CardFooter><Button variant="secondary" onClick={handleGenerateReport}>Generate Report</Button></CardFooter>
            </Card>
        </div>
    );
}
