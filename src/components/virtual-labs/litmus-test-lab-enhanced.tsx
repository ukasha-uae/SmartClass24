'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, TestTube, BookOpen, Shield, Droplets, Beaker, Eye, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { motion, AnimatePresence } from 'framer-motion';

type Substance = 'Lemon Juice' | 'Soap Solution' | 'Vinegar' | 'Milk of Magnesia' | 'Dilute HCl' | 'Dilute NaOH' | 'Tap Water';
type LitmusPaper = 'Red' | 'Blue';
type ResultColor = 'Red' | 'Blue' | 'No Change';
type SubstanceCategory = 'Acid' | 'Base' | 'Neutral';
type TestStep = 'select-substance' | 'select-paper' | 'dipping' | 'observing' | 'complete';

interface SubstanceInfo {
    type: SubstanceCategory;
    litmus: Record<LitmusPaper, ResultColor>;
    color: string;
    emoji: string;
}

const substances: Record<Substance, SubstanceInfo> = {
    'Lemon Juice': { type: 'Acid', litmus: { 'Red': 'No Change', 'Blue': 'Red' }, color: 'yellow', emoji: '🍋' },
    'Soap Solution': { type: 'Base', litmus: { 'Red': 'Blue', 'Blue': 'No Change' }, color: 'lightblue', emoji: '🧼' },
    'Vinegar': { type: 'Acid', litmus: { 'Red': 'No Change', 'Blue': 'Red' }, color: 'amber', emoji: '🥫' },
    'Milk of Magnesia': { type: 'Base', litmus: { 'Red': 'Blue', 'Blue': 'No Change' }, color: 'white', emoji: '🥛' },
    'Dilute HCl': { type: 'Acid', litmus: { 'Red': 'No Change', 'Blue': 'Red' }, color: 'transparent', emoji: '⚗️' },
    'Dilute NaOH': { type: 'Base', litmus: { 'Red': 'Blue', 'Blue': 'No Change' }, color: 'transparent', emoji: '🧪' },
    'Tap Water': { type: 'Neutral', litmus: { 'Red': 'No Change', 'Blue': 'No Change' }, color: 'clear', emoji: '💧' },
};

export function LitmusTestLab() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<TestStep>('select-substance');
    const [selectedSubstance, setSelectedSubstance] = React.useState<Substance | null>(null);
    const [selectedPaper, setSelectedPaper] = React.useState<LitmusPaper | null>(null);
    const [result, setResult] = React.useState<ResultColor | null>(null);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [showPractice, setShowPractice] = React.useState(false);
    const [practiceInteraction, setPracticeInteraction] = React.useState<'substances' | 'paper' | 'rules' | null>(null);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<SubstanceCategory | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    const handleSelectSubstance = (substance: Substance) => {
        setSelectedSubstance(substance);
        setCurrentStep('select-paper');
        toast({ title: `${substances[substance].emoji} Selected!`, description: `Testing ${substance}` });
    };

    const handleSelectPaper = (paper: LitmusPaper) => {
        setSelectedPaper(paper);
        setCurrentStep('dipping');
        setIsAnimating(true);
        
        toast({ title: '📄 Paper Selected', description: `Using ${paper.toLowerCase()} litmus paper` });
        
        // Simulate dipping animation
        setTimeout(() => {
            setCurrentStep('observing');
            if (selectedSubstance) {
                const testResult = substances[selectedSubstance].litmus[paper];
                setResult(testResult);
                
                toast({ 
                    title: '👀 Observe the Change', 
                    description: `The litmus paper turned ${testResult}!` 
                });
                
                setTimeout(() => {
                    setCurrentStep('complete');
                    setIsAnimating(false);
                }, 1500);
            }
        }, 2000);
    };

    const handleReset = () => {
        setCurrentStep('select-substance');
        setSelectedSubstance(null);
        setSelectedPaper(null);
        setResult(null);
        setIsAnimating(false);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        toast({ title: '🔄 Lab Reset', description: 'Start a new test' });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null || !result || !selectedSubstance) return;
        const correctType = substances[selectedSubstance].type;
        const isCorrect = quizAnswer === correctType;
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback(`Correct! ${selectedSubstance} is an ${correctType.toLowerCase()}. ✅`);
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite right. Think about how the litmus paper changed color. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback(`The correct answer is ${correctType}. Remember: Acids turn blue litmus red, bases turn red litmus blue. 🧠`);
            }
        }
    };

    const getResultColorClass = () => {
        if (!result) return 'bg-gray-200 dark:bg-gray-700';
        if (result === 'Red') return 'bg-red-500';
        if (result === 'Blue') return 'bg-blue-500';
        return selectedPaper === 'Red' ? 'bg-red-300' : 'bg-blue-300';
    };

    const objectiveText = "To use litmus paper to identify whether common substances are acidic, basic, or neutral by observing color changes.";
    const theoryText = "Litmus paper is a pH indicator made from lichens. Blue litmus paper turns red in acidic solutions (pH < 7). Red litmus paper turns blue in basic solutions (pH > 7). Neutral solutions (pH = 7) cause no color change in either type of litmus paper. This simple test is widely used in chemistry labs to quickly classify substances.";
    const safetyText = "Always wear safety goggles when working with chemicals. Handle acids and bases with care as they can be corrosive. Never taste unknown substances. Add acid to water, never water to acid. Wash hands thoroughly after the experiment.";

    return (
        <div className="space-y-6">
            {/* Objective Section */}
            <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-blue-600" />
                            Objective
                        </CardTitle>
                        <TextToSpeech textToSpeak={objectiveText} />
                    </div>
                    <CardDescription>{objectiveText}</CardDescription>
                </CardHeader>
            </Card>

            {/* Theory & Safety */}
            <Card>
                <CardHeader>
                    <CardTitle>Lab Information</CardTitle>
                    <CardDescription>Essential background and safety guidelines</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="theory">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    <span>Background Theory</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                                <div className="flex items-start gap-2">
                                    <div className="flex-grow">{theoryText}</div>
                                    <TextToSpeech textToSpeak={theoryText} className="flex-shrink-0" />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="safety">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    <span>Safety Precautions</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                                <div className="flex items-start gap-2">
                                    <div className="flex-grow">{safetyText}</div>
                                    <TextToSpeech textToSpeak={safetyText} className="flex-shrink-0" />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            {/* Main Experiment */}
            <Card className="border-2 border-violet-200 dark:border-violet-800">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <TestTube className="h-5 w-5 text-violet-600" />
                            Litmus Test Experiment
                        </CardTitle>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowPractice(!showPractice)}
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            {showPractice ? 'Hide' : 'Show'} Practice Mode
                        </Button>
                    </div>
                    <CardDescription>Follow the steps to test substances with litmus paper</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-between text-sm">
                        <div className={cn("flex items-center gap-2", currentStep === 'select-substance' && "text-violet-600 font-semibold")}>
                            <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs", 
                                currentStep === 'select-substance' ? "bg-violet-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                            )}>1</div>
                            <span className="hidden sm:inline">Select Substance</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2" />
                        <div className={cn("flex items-center gap-2", currentStep === 'select-paper' && "text-violet-600 font-semibold")}>
                            <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs",
                                currentStep === 'select-paper' || currentStep === 'dipping' || currentStep === 'observing' || currentStep === 'complete' 
                                ? "bg-violet-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                            )}>2</div>
                            <span className="hidden sm:inline">Select Paper</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2" />
                        <div className={cn("flex items-center gap-2", (currentStep === 'dipping' || currentStep === 'observing' || currentStep === 'complete') && "text-violet-600 font-semibold")}>
                            <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs",
                                currentStep === 'dipping' || currentStep === 'observing' || currentStep === 'complete'
                                ? "bg-violet-600 text-white" : "bg-gray-200 dark:bg-gray-700"
                            )}>3</div>
                            <span className="hidden sm:inline">Test & Observe</span>
                        </div>
                    </div>

                    {/* Step 1: Select Substance */}
                    {currentStep === 'select-substance' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <h3 className="font-semibold text-lg">Step 1: Choose a Substance to Test</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {Object.entries(substances).map(([name, info]) => (
                                    <Button
                                        key={name}
                                        variant="outline"
                                        className="h-24 flex-col gap-2 hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950"
                                        onClick={() => handleSelectSubstance(name as Substance)}
                                    >
                                        <span className="text-3xl">{info.emoji}</span>
                                        <span className="text-xs">{name}</span>
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Select Litmus Paper */}
                    {currentStep === 'select-paper' && selectedSubstance && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <h3 className="font-semibold text-lg">Step 2: Choose Litmus Paper Type</h3>
                            <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                <span className="text-2xl">{substances[selectedSubstance].emoji}</span>
                                <span className="font-medium">Testing: {selectedSubstance}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    className="h-32 flex-col gap-3 hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                    onClick={() => handleSelectPaper('Red')}
                                >
                                    <div className="w-16 h-20 bg-red-500 rounded border-2 border-red-700" />
                                    <span className="font-semibold">Red Litmus Paper</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-32 flex-col gap-3 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                                    onClick={() => handleSelectPaper('Blue')}
                                >
                                    <div className="w-16 h-20 bg-blue-500 rounded border-2 border-blue-700" />
                                    <span className="font-semibold">Blue Litmus Paper</span>
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Testing Animation */}
                    {(currentStep === 'dipping' || currentStep === 'observing' || currentStep === 'complete') && selectedSubstance && selectedPaper && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            <h3 className="font-semibold text-lg">Step 3: Testing in Progress...</h3>
                            <div className="relative min-h-[300px] bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-8 flex items-center justify-center">
                                <div className="flex items-end gap-8">
                                    {/* Beaker */}
                                    <motion.div
                                        className="flex flex-col items-center"
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                    >
                                        <Beaker className="h-32 w-32 text-gray-400" />
                                        <p className="text-sm mt-2">{selectedSubstance}</p>
                                    </motion.div>

                                    {/* Litmus Paper */}
                                    <AnimatePresence>
                                        <motion.div
                                            className="flex flex-col items-center"
                                            initial={{ y: -100, opacity: 0 }}
                                            animate={{ 
                                                y: currentStep === 'dipping' ? 20 : 0, 
                                                opacity: 1 
                                            }}
                                            transition={{ duration: 1.5 }}
                                        >
                                            <motion.div
                                                className={cn("w-12 h-32 rounded border-2", getResultColorClass())}
                                                animate={{
                                                    backgroundColor: result ? undefined : (selectedPaper === 'Red' ? '#ef4444' : '#3b82f6')
                                                }}
                                                transition={{ duration: 1 }}
                                            />
                                            {currentStep === 'dipping' && (
                                                <motion.div
                                                    className="mt-2 flex items-center gap-1"
                                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                >
                                                    <Droplets className="h-4 w-4 text-blue-600" />
                                                    <span className="text-sm">Dipping...</span>
                                                </motion.div>
                                            )}
                                            {(currentStep === 'observing' || currentStep === 'complete') && result && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-sm mt-2 font-semibold"
                                                >
                                                    Result: {result}
                                                </motion.p>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {currentStep === 'complete' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3"
                                >
                                    <Button onClick={handleReset} variant="outline" className="flex-1">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Test Another Substance
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </CardContent>
            </Card>

            {/* Practice Mode */}
            {showPractice && (
                <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-amber-600" />
                            Practice Mode - Explore & Learn
                        </CardTitle>
                        <CardDescription>Click on items to learn more about them</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            {/* Common Substances Card */}
                            <Card 
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setPracticeInteraction('substances')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <TestTube className="h-4 w-4" />
                                        Common Substances
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl mb-2">🧪</div>
                                    <p className="text-sm text-muted-foreground">
                                        {practiceInteraction === 'substances' 
                                            ? "Acids: Lemon juice, vinegar, HCl. Bases: Soap, NaOH, milk of magnesia. Neutral: Water."
                                            : "Tap to see examples of acids, bases, and neutral substances"}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Litmus Paper Types Card */}
                            <Card 
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setPracticeInteraction('paper')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-3 h-4 bg-red-500 rounded" />
                                            <div className="w-3 h-4 bg-blue-500 rounded" />
                                        </div>
                                        Litmus Paper Types
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl mb-2">📄</div>
                                    <p className="text-sm text-muted-foreground">
                                        {practiceInteraction === 'paper'
                                            ? "Red litmus turns blue in bases. Blue litmus turns red in acids. No change means neutral!"
                                            : "Tap to learn how different litmus papers work"}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Key Rules Card */}
                            <Card 
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setPracticeInteraction('rules')}
                            >
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" />
                                        Key Rules
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl mb-2">📚</div>
                                    <p className="text-sm text-muted-foreground">
                                        {practiceInteraction === 'rules'
                                            ? "Rule 1: Acids → Blue turns Red. Rule 2: Bases → Red turns Blue. Rule 3: Neutral → No color change."
                                            : "Tap to review the color change rules"}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Classification Quiz */}
            {result && currentStep === 'complete' && (
                <Card className="border-2 border-green-200 dark:border-green-800">
                    <CardHeader>
                        <CardTitle>Classify the Substance</CardTitle>
                        <CardDescription>Based on the litmus test result, what type of substance is {selectedSubstance}?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup value={quizAnswer} onValueChange={(v) => setQuizAnswer(v as SubstanceCategory)} disabled={quizIsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                <RadioGroupItem value="Acid" id="q-acid" />
                                <Label htmlFor="q-acid" className="flex-1 cursor-pointer">Acid (pH &lt; 7)</Label>
                            </div>
                            <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                <RadioGroupItem value="Base" id="q-base" />
                                <Label htmlFor="q-base" className="flex-1 cursor-pointer">Base (pH &gt; 7)</Label>
                            </div>
                            <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                <RadioGroupItem value="Neutral" id="q-neutral" />
                                <Label htmlFor="q-neutral" className="flex-1 cursor-pointer">Neutral (pH = 7)</Label>
                            </div>
                        </RadioGroup>
                        {quizFeedback && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "mt-4 text-sm flex items-center gap-2 p-3 rounded-lg",
                                    quizIsCorrect === true && "text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300",
                                    quizIsCorrect === false && "text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300",
                                    quizIsCorrect === null && "text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
                                )}
                            >
                                {quizIsCorrect === true ? <CheckCircle className="h-5 w-5" /> : 
                                 quizIsCorrect === false ? <XCircle className="h-5 w-5" /> :
                                 <RefreshCw className="h-5 w-5" />}
                                {quizFeedback}
                            </motion.p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button 
                            onClick={handleQuizSubmit} 
                            disabled={!quizAnswer || quizIsCorrect !== null}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {quizIsCorrect === true ? "✓ Correct!" : quizIsCorrect === false ? "Answer Shown" : "Check Answer"}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Conclusion */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Conclusion
                    </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert">
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded" />
                            <strong>Acids</strong> turn blue litmus paper red
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded" />
                            <strong>Bases</strong> turn red litmus paper blue
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-400 rounded" />
                            <strong>Neutral</strong> substances cause no color change
                        </li>
                    </ul>
                    <p className="mt-4 text-sm font-semibold text-violet-600 dark:text-violet-400">
                        💡 Tip: In a real lab, you can prepare your own litmus paper by extracting dyes from lichens!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
