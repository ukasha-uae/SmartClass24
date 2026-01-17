'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, TestTube, BookOpen, Shield, Droplets, Beaker, Eye, Sparkles, Package, Zap, Star, Award, Trophy } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherVoice } from './TeacherVoice';
import { useLabProgress } from '@/stores/lab-progress-store';
import confetti from 'canvas-confetti';
import { Alert, AlertDescription } from '../ui/alert';
import { LabSupplies, SupplyItem } from './LabSupplies';

type Substance = 'Lemon Juice' | 'Soap Solution' | 'Vinegar' | 'Milk of Magnesia' | 'Dilute HCl' | 'Dilute NaOH' | 'Tap Water';
type LitmusPaper = 'Red' | 'Blue';
type ResultColor = 'Red' | 'Blue' | 'No Change';
type SubstanceCategory = 'Acid' | 'Base' | 'Neutral';
type TestStep = 'intro' | 'collect-supplies' | 'select-substance' | 'select-paper' | 'dipping' | 'observing' | 'quiz' | 'complete';

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
    const { markLabComplete, isLabCompleted, totalXP } = useLabProgress();
    const [currentStep, setCurrentStep] = React.useState<TestStep>('intro');
    const [selectedSubstance, setSelectedSubstance] = React.useState<Substance | null>(null);
    const [selectedPaper, setSelectedPaper] = React.useState<LitmusPaper | null>(null);
    const [result, setResult] = React.useState<ResultColor | null>(null);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [showPractice, setShowPractice] = React.useState(false);
    const [practiceInteraction, setPracticeInteraction] = React.useState<'substances' | 'paper' | 'rules' | null>(null);
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [collectedSupplies, setCollectedSupplies] = React.useState<string[]>([]);
    
    const labSupplies: SupplyItem[] = [
        { id: 'litmus-papers', name: 'Litmus Papers', emoji: '📄', description: 'Red and blue litmus papers' },
        { id: 'test-substances', name: 'Test Substances', emoji: '🧪', description: 'Various acids, bases, and neutral solutions' },
        { id: 'safety-goggles', name: 'Safety Goggles', emoji: '🥽', description: 'Eye protection' },
    ];
    const [startTime] = React.useState(Date.now());
    const [xpEarned, setXpEarned] = React.useState<number | null>(null);
    const [showCelebration, setShowCelebration] = React.useState(false);
    
    const labId = 'litmus-test-lab';
    const alreadyCompleted = isLabCompleted(labId);

    // Quiz State - 3 questions
    const [quizAnswers, setQuizAnswers] = React.useState<{ [key: number]: string }>({});
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    // Show welcome message and guide through steps
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Litmus Paper Lab! Today you'll learn how to identify acids and bases using colored paper. Let's gather our supplies first!");
        } else if (currentStep === 'select-substance') {
            setTeacherMessage("Great! Now let's start by choosing a substance to test. Pick any one that interests you!");
        }
    }, [currentStep]);

    // Scroll to quiz when it appears
    React.useEffect(() => {
        if (currentStep === 'quiz') {
            setTimeout(() => {
                const quizElement = document.getElementById('quiz-section');
                if (quizElement) {
                    quizElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
        }
    }, [currentStep]);

    const handleStartLab = () => {
        setTeacherMessage("Great! Let's gather our supplies. Click on each item to collect them for your experiment!");
        setCurrentStep('collect-supplies');
    };

    const handleCollectSupply = (itemId: string) => {
        if (!collectedSupplies.includes(itemId)) {
            setCollectedSupplies(prev => {
                const newCollected = [...prev, itemId];
                if (newCollected.length === labSupplies.length) {
                    setTeacherMessage("Perfect! All supplies collected! Now let's start testing. Click 'Continue to Experiment' to begin!");
                }
                return newCollected;
            });
            toast({ title: `✅ ${labSupplies.find(s => s.id === itemId)?.name} Collected` });
        }
    };

    const handleAllSuppliesCollected = React.useCallback(() => {
        if (!allSuppliesNotifiedRef.current) {
            allSuppliesNotifiedRef.current = true;
            toast({
                title: "All Supplies Collected!",
                description: "Great work! You have everything you need for the experiment.",
            });
        }
        setTeacherMessage("Perfect! All supplies collected! Now let's start testing. Click 'Continue to Experiment' to begin!");
}, [toast]);

    const handleContinueToExperiment = () => {
        setCurrentStep('select-substance');
        setTeacherMessage("Great! Now let's start by choosing a substance to test. Pick any one that interests you!");
    };

    const handleTeacherComplete = () => {
        // Direct state updates - no pending transitions
    };

    const handleSelectSubstance = (substance: Substance) => {
        setSelectedSubstance(substance);
        setCurrentStep('select-paper');
        setTeacherMessage(`Great choice! ${substance} ${substances[substance].emoji} - Now you need to select the type of litmus paper. Red or blue? Choose wisely!`);
        toast({ title: `${substances[substance].emoji} Selected!`, description: `Testing ${substance}` });
    };

    const handleSelectPaper = (paper: LitmusPaper) => {
        setSelectedPaper(paper);
        setCurrentStep('dipping');
        setIsAnimating(true);
        setTeacherMessage(`Perfect! You chose ${paper.toLowerCase()} litmus paper. Now watch carefully as we dip it into the ${selectedSubstance}. Pay attention to any color changes!`);
        
        toast({ title: '📄 Paper Selected', description: `Using ${paper.toLowerCase()} litmus paper` });
        
        // Simulate dipping animation with teacher narration
        setTimeout(() => {
            setCurrentStep('observing');
            if (selectedSubstance) {
                const testResult = substances[selectedSubstance].litmus[paper];
                setResult(testResult);
                
                let message = '';
                if (testResult === 'Red') {
                    message = `Look at that! The paper turned RED! ${selectedSubstance} is an ACID. Acids turn blue litmus paper red. Remember this rule!`;
                } else if (testResult === 'Blue') {
                    message = `Amazing! The paper turned BLUE! ${selectedSubstance} is a BASE. Bases turn red litmus paper blue. That's chemistry!`;
                } else {
                    message = `Interesting! The paper didn't change color at all. This means ${selectedSubstance} is NEUTRAL - it's neither acidic nor basic.`;
                }
                setTeacherMessage(message);
                
                toast({ 
                    title: '👀 Observe the Change', 
                    description: `The litmus paper turned ${testResult}!` 
                });
                
                // Transition to quiz after showing result - wait for teacher to finish explaining
                setTimeout(() => {
                    setCurrentStep('quiz');
                    setIsAnimating(false);
                    setTeacherMessage("Excellent work! Now answer the quiz below to test your understanding and earn XP!");
                }, 25000); // 25 seconds to allow teacher to finish explaining the observation
            }
        }, 2000);
    };

    const handleReset = () => {
        setCurrentStep('intro');
        setSelectedSubstance(null);
        setSelectedPaper(null);
        setResult(null);
        setIsAnimating(false);
        setCollectedSupplies([]);
        setQuizAnswers({});
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setTeacherMessage("Great! Let's start over. Click 'Begin Experiment' when you're ready!");
        toast({ title: '🔄 Lab Reset', description: 'Start a new test' });
    };

    const handleAnswerChange = (questionIndex: number, value: string) => {
        setQuizAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }));
    };

    const handleQuizSubmit = () => {
        // If already correct, don't allow resubmission
        if (quizIsCorrect === true) return;
        
        // If wrong and showing answers, allow retry by resetting
        if (quizIsCorrect === false) {
            setQuizIsCorrect(null);
            setQuizFeedback(null);
            setQuizAnswers({});
            return;
        }
        
        if (!selectedSubstance || !result) return;
        
        // Determine correct answers based on actual results
        const substanceType = substances[selectedSubstance].type.toLowerCase();
        const colorChange = result === 'Red' ? 'turns-red' : result === 'Blue' ? 'turns-blue' : 'no-change';
        
        const correctAnswers: { [key: number]: string } = {
            1: substanceType,
            2: colorChange,
            3: 'both-rules' // The general rule that both acid and base rules always apply
        };
        
        const totalQuestions = 3;
        const correctCount = Object.keys(correctAnswers).filter(
            key => quizAnswers[parseInt(key)] === correctAnswers[parseInt(key)]
        ).length;
        
        const isCorrect = correctCount === totalQuestions;
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback(`Perfect! You got all ${totalQuestions} questions correct! 🎉`);
            
            // Award XP
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            const score = newAttempts === 1 ? 100 : newAttempts === 2 ? 80 : 60;
            const earnedXP = markLabComplete(labId, score, timeSpent);
            
            // Trigger confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            
            // Show celebration
            setXpEarned(earnedXP);
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 5000);
            
            setTeacherMessage(`Outstanding! You earned ${earnedXP} XP! You now have ${totalXP + earnedXP} total XP. Keep experimenting!`);
            
            // Transition to complete step after quiz is correct
            setTimeout(() => {
                setCurrentStep('complete');
            }, 2000);
        } else {
            if (newAttempts === 1) {
                setQuizFeedback(`You got ${correctCount} out of ${totalQuestions} correct. Review the experiment and try again! 🔄`);
                setTeacherMessage('Not all answers are correct. Think about what you observed in the experiment. You can try again!');
            } else {
                setQuizIsCorrect(false);
                const colorText = colorChange === 'turns-red' ? 'Turns Red' : colorChange === 'turns-blue' ? 'Turns Blue' : 'No Change';
                const typeText = substanceType.charAt(0).toUpperCase() + substanceType.slice(1);
                setQuizFeedback(`Correct answers: 1) ${typeText} 2) ${colorText} 3) Both rules apply (acids turn blue→red, bases turn red→blue). Review these key points! 🧠`);
                setTeacherMessage('Here are the correct answers. Make sure to review these concepts - they are important for your exams!');
            }
        }
    };

    // No longer needed - using direct className logic

    const objectiveText = "To use litmus paper to identify whether common substances are acidic, basic, or neutral by observing color changes.";
    const theoryText = "Litmus paper is a pH indicator made from lichens. Blue litmus paper turns red in acidic solutions (pH < 7). Red litmus paper turns blue in basic solutions (pH > 7). Neutral solutions (pH = 7) cause no color change in either type of litmus paper. This simple test is widely used in chemistry labs to quickly classify substances.";
    const safetyText = "Always wear safety goggles when working with chemicals. Handle acids and bases with care as they can be corrosive. Never taste unknown substances. Add acid to water, never water to acid. Wash hands thoroughly after the experiment.";

    return (
        <div className="relative min-h-screen pb-20">
            {/* Premium Animated Background - Violet/Purple Litmus Theme */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-pink-950/30" />
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-violet-200/40 to-purple-300/40 dark:from-violet-800/20 dark:to-purple-900/20 blur-3xl"
                        style={{
                            width: `${200 + i * 50}px`,
                            height: `${200 + i * 50}px`,
                            left: `${(i * 12.5) % 100}%`,
                            top: `${(i * 15) % 100}%`,
                        }}
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
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

            <div className="relative max-w-5xl mx-auto p-4 space-y-6">
            {/* Celebration Overlay */}
            <AnimatePresence>
                {showCelebration && xpEarned !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.5, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0.5, rotate: 10 }}
                            className="bg-gradient-to-br from-violet-400 via-purple-500 to-pink-500 text-white rounded-3xl p-8 shadow-2xl max-w-md mx-4"
                        >
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ 
                                    repeat: Infinity,
                                    duration: 2
                                }}
                                className="text-8xl text-center mb-4"
                            >
                                🧪
                            </motion.div>
                            <h2 className="text-3xl font-bold text-center mb-2">Lab Completed!</h2>
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="text-6xl font-black mb-2"
                                >
                                    +{xpEarned} XP
                                </motion.div>
                                <p className="text-xl opacity-90">Total XP: {totalXP + xpEarned}</p>
                                {!alreadyCompleted && (
                                    <p className="text-sm mt-2 opacity-75">First time completion bonus!</p>
                                )}
                            </div>
                            <div className="flex gap-2 justify-center mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <motion.span
                                        key={i}
                                        animate={{ 
                                            y: [0, -20, 0],
                                            rotate: [0, 360]
                                        }}
                                        transition={{ 
                                            delay: i * 0.1,
                                            repeat: Infinity,
                                            duration: 1.5
                                        }}
                                        className="text-3xl"
                                    >
                                        ⭐
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Teacher Voice */}
            <TeacherVoice message={teacherMessage} onComplete={handleTeacherComplete} />

                {/* Objective Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
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
                </motion.div>

                {/* Theory & Safety */}
                {currentStep === 'intro' && (
                    <Card className="border-2 border-cyan-200/50 dark:border-cyan-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
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
                )}

                {/* Main Experiment */}
                <Card className="border-2 border-violet-200/50 dark:border-violet-800/50 bg-gradient-to-br from-white/90 to-violet-50/90 dark:from-gray-900/90 dark:to-violet-950/90 backdrop-blur-sm shadow-xl">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <CardTitle className="flex items-center gap-2">
                            <TestTube className="h-5 w-5 text-violet-600" />
                            Interactive Litmus Test
                        </CardTitle>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowPractice(!showPractice)}
                            className="text-xs sm:text-sm"
                        >
                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            {showPractice ? 'Hide' : 'Show'} Practice Mode
                        </Button>
                    </div>
                    <CardDescription>Click substances and litmus paper to perform the test</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Intro Step */}
                    {currentStep === 'intro' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <div className="text-6xl mb-4">🧪</div>
                            <h3 className="text-2xl font-bold mb-3">Ready to Start?</h3>
                            <p className="text-muted-foreground mb-6">Follow the teacher's instructions to test substances with litmus paper</p>
                            <Button 
                                onClick={handleStartLab}
                                size="lg"
                                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg"
                            >
                                <Sparkles className="w-5 h-5 mr-2" />
                                Begin Experiment
                            </Button>
                        </motion.div>
                    )}

                    {/* Collect Supplies Step */}
                    {currentStep === 'collect-supplies' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <LabSupplies
                                supplies={labSupplies}
                                collectedItems={collectedSupplies}
                                onCollect={handleCollectSupply}
                                onAllCollected={handleAllSuppliesCollected}
                                requiredCount={labSupplies.length}
                            />
                            {collectedSupplies.length === labSupplies.length && (
                                <CardFooter className="mt-4">
                                    <Button 
                                        onClick={handleContinueToExperiment} 
                                        className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg" 
                                        size="lg"
                                    >
                                        Continue to Experiment
                                    </Button>
                                </CardFooter>
                            )}
                        </motion.div>
                    )}

                    {/* Progress Steps */}
                    {currentStep !== 'intro' && currentStep !== 'collect-supplies' && (
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
                    )}

                    {/* Step 1: Select Substance */}
                    {currentStep === 'select-substance' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="bg-violet-50 dark:bg-violet-950/30 p-4 rounded-lg border border-violet-200 dark:border-violet-800">
                                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                    <Beaker className="h-5 w-5 text-violet-600" />
                                    Step 1: Choose a Substance to Test
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Click on any substance below to test if it's an acid, base, or neutral
                                </p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {Object.entries(substances).map(([name, info]) => (
                                    <motion.div 
                                        key={name}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            variant="outline"
                                            className="w-full h-24 flex-col gap-2 hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950 transition-all border-2"
                                            onClick={() => handleSelectSubstance(name as Substance)}
                                        >
                                            <span className="text-3xl">{info.emoji}</span>
                                            <span className="text-xs font-medium text-center">{name}</span>
                                        </Button>
                                    </motion.div>
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
                            <div className="bg-violet-50 dark:bg-violet-950/30 p-4 rounded-lg border border-violet-200 dark:border-violet-800">
                                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                    <Droplets className="h-5 w-5 text-violet-600" />
                                    Step 2: Choose Litmus Paper Type
                                </h3>
                                <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-900 rounded-lg mt-3">
                                    <span className="text-2xl">{substances[selectedSubstance].emoji}</span>
                                    <div>
                                        <p className="font-medium text-sm">Testing: {selectedSubstance}</p>
                                        <p className="text-xs text-muted-foreground">Select red or blue litmus paper</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Button
                                        variant="outline"
                                        className="w-full h-40 flex-col gap-3 hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-all border-2"
                                        onClick={() => handleSelectPaper('Red')}
                                    >
                                        <div className="w-16 h-20 bg-red-500 rounded border-2 border-red-700 shadow-lg" />
                                        <div className="text-center">
                                            <p className="font-semibold text-sm">Red Litmus Paper</p>
                                            <p className="text-xs text-muted-foreground mt-1">Turns blue in bases</p>
                                        </div>
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Button
                                        variant="outline"
                                        className="w-full h-40 flex-col gap-3 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all border-2"
                                        onClick={() => handleSelectPaper('Blue')}
                                    >
                                        <div className="w-16 h-20 bg-blue-500 rounded border-2 border-blue-700 shadow-lg" />
                                        <div className="text-center">
                                            <p className="font-semibold text-sm">Blue Litmus Paper</p>
                                            <p className="text-xs text-muted-foreground mt-1">Turns red in acids</p>
                                        </div>
                                    </Button>
                                </motion.div>
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
                                                className={cn(
                                                    "w-12 h-32 rounded border-2 transition-all duration-1000",
                                                    !result && selectedPaper === 'Red' && "bg-red-500 border-red-700",
                                                    !result && selectedPaper === 'Blue' && "bg-blue-500 border-blue-700",
                                                    result === 'Red' && "bg-red-500 border-red-700 shadow-[0_0_20px_rgba(239,68,68,0.6)]",
                                                    result === 'Blue' && "bg-blue-500 border-blue-700 shadow-[0_0_20px_rgba(59,130,246,0.6)]",
                                                    result === 'No Change' && selectedPaper === 'Red' && "bg-red-500 border-red-700",
                                                    result === 'No Change' && selectedPaper === 'Blue' && "bg-blue-500 border-blue-700"
                                                )}
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
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-3 space-y-2"
                                                >
                                                    <div className="flex items-center gap-2 justify-center">
                                                        <span className="text-xs font-medium text-muted-foreground">Result:</span>
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-full text-sm font-bold",
                                                            result === 'Red' && "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
                                                            result === 'Blue' && "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
                                                            result === 'No Change' && "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                                        )}>
                                                            {result}
                                                        </span>
                                                    </div>
                                                    {result !== 'No Change' && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="text-center"
                                                        >
                                                            <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
                                                        </motion.div>
                                                    )}
                                                </motion.div>
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
                                    <Button onClick={handleReset} variant="outline" className="flex-1 border-2 border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/20">
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
                    <Card className="border-2 border-amber-200/50 dark:border-amber-800/50 bg-gradient-to-br from-white/90 to-amber-50/90 dark:from-gray-900/90 dark:to-amber-950/90 backdrop-blur-sm shadow-xl">
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

                {/* Post-Lab Quiz */}
                {result && (currentStep === 'quiz' || currentStep === 'complete') && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card id="quiz-section" className="border-2 border-green-200/50 dark:border-green-800/50 bg-gradient-to-br from-white/90 to-green-50/90 dark:from-gray-900/90 dark:to-green-950/90 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                Post-Lab Assessment
                            </CardTitle>
                            <CardDescription>Test your understanding of the litmus paper test</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">1. What type of substance is {selectedSubstance}?</Label>
                                    <div className="grid gap-3">
                                        {['acid', 'base', 'neutral'].map((option) => {
                                            const isSelected = quizAnswers[1] === option;
                                            const isCorrect = selectedSubstance ? option === substances[selectedSubstance].type.toLowerCase() : false;
                                            return (
                                                <motion.div
                                                    key={option}
                                                    onClick={() => !quizIsCorrect && handleAnswerChange(1, option)}
                                                    className={cn(
                                                        "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                        isSelected && !quizIsCorrect && "border-violet-500 bg-violet-50 dark:bg-violet-950/20",
                                                        quizIsCorrect === true && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                        quizIsCorrect === true && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                        !isSelected && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                    )}
                                                    whileHover={!quizIsCorrect ? { scale: 1.02 } : {}}
                                                    whileTap={!quizIsCorrect ? { scale: 0.98 } : {}}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                                            isSelected ? "border-violet-500 bg-violet-500" : "border-gray-300"
                                                        )}>
                                                            {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                                                        </div>
                                                        <Label className="cursor-pointer flex-1 capitalize">{option}</Label>
                                                        {quizIsCorrect === true && isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                        {quizIsCorrect === true && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Question 2 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">2. When {selectedPaper?.toLowerCase()} litmus paper is dipped in {selectedSubstance?.toLowerCase()}, what happens?</Label>
                                    <div className="grid gap-3">
                                        {[
                                            { value: 'turns-red', label: 'Turns Red' },
                                            { value: 'turns-blue', label: 'Turns Blue' },
                                            { value: 'no-change', label: 'No Change' },
                                            { value: 'disappears', label: 'Disappears' }
                                        ].map((option) => {
                                            const isSelected = quizAnswers[2] === option.value;
                                            const correctColorChange = result === 'Red' ? 'turns-red' : result === 'Blue' ? 'turns-blue' : 'no-change';
                                            const isCorrect = option.value === correctColorChange;
                                            return (
                                                <motion.div
                                                    key={option.value}
                                                    onClick={() => !quizIsCorrect && handleAnswerChange(2, option.value)}
                                                    className={cn(
                                                        "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                        isSelected && !quizIsCorrect && "border-violet-500 bg-violet-50 dark:bg-violet-950/20",
                                                        quizIsCorrect === true && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                        quizIsCorrect === true && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                        !isSelected && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                    )}
                                                    whileHover={!quizIsCorrect ? { scale: 1.02 } : {}}
                                                    whileTap={!quizIsCorrect ? { scale: 0.98 } : {}}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                                            isSelected ? "border-violet-500 bg-violet-500" : "border-gray-300"
                                                        )}>
                                                            {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                                                        </div>
                                                        <Label className="cursor-pointer flex-1">{option.label}</Label>
                                                        {quizIsCorrect === true && isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                        {quizIsCorrect === true && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Question 3 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">3. What is the general rule for litmus paper color changes?</Label>
                                    <div className="grid gap-3">
                                        {[
                                            { value: 'acids-blue-red', label: 'Acids turn blue litmus red' },
                                            { value: 'bases-red-blue', label: 'Bases turn red litmus blue' },
                                            { value: 'both-rules', label: 'Both rules apply' },
                                            { value: 'neither', label: 'Neither rule applies' }
                                        ].map((option) => {
                                            const isSelected = quizAnswers[3] === option.value;
                                            const isCorrect = option.value === 'both-rules';
                                            return (
                                                <motion.div
                                                    key={option.value}
                                                    onClick={() => !quizIsCorrect && handleAnswerChange(3, option.value)}
                                                    className={cn(
                                                        "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                        isSelected && !quizIsCorrect && "border-violet-500 bg-violet-50 dark:bg-violet-950/20",
                                                        quizIsCorrect === true && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                        quizIsCorrect === true && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                        !isSelected && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                    )}
                                                    whileHover={!quizIsCorrect ? { scale: 1.02 } : {}}
                                                    whileTap={!quizIsCorrect ? { scale: 0.98 } : {}}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                                            isSelected ? "border-violet-500 bg-violet-500" : "border-gray-300"
                                                        )}>
                                                            {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                                                        </div>
                                                        <Label className="cursor-pointer flex-1">{option.label}</Label>
                                                        {quizIsCorrect === true && isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                        {quizIsCorrect === true && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {quizFeedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "p-4 rounded-lg border-2 bg-gradient-to-r",
                                            quizIsCorrect === true 
                                                ? "from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-500 text-green-700 dark:text-green-300"
                                                : "from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-500 text-amber-700 dark:text-amber-300"
                                        )}
                                    >
                                        <div className="flex items-start gap-2">
                                            {quizIsCorrect === true ? (
                                                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                            )}
                                            <p className="text-sm font-medium">{quizFeedback}</p>
                                        </div>
                                    </motion.div>
                                )}

                                <Button 
                                    onClick={handleQuizSubmit} 
                                    className={cn(
                                        "w-full shadow-lg",
                                        quizIsCorrect === false 
                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                            : "bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                                    )}
                                    size="lg"
                                    disabled={Object.keys(quizAnswers).length < 3 || quizIsCorrect === true}
                                >
                                    {quizIsCorrect === true ? (
                                        <>
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            Quiz Completed
                                        </>
                                    ) : quizIsCorrect === false ? (
                                        <>
                                            <RefreshCw className="mr-2 h-5 w-5" />
                                            Try Again
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            Submit Answers
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Lab Complete Section */}
                {currentStep === 'complete' && quizIsCorrect === true && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <Card className="border-2 border-yellow-300 dark:border-yellow-700 bg-gradient-to-br from-yellow-50/90 via-orange-50/90 to-pink-50/90 dark:from-yellow-950/90 dark:via-orange-950/90 dark:to-pink-950/90 backdrop-blur-sm shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-pink-400/20 animate-pulse" />
                            <CardContent className="relative p-8 text-center space-y-6">
                                <motion.div
                                    animate={{ 
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ 
                                        repeat: Infinity,
                                        duration: 2
                                    }}
                                    className="text-8xl mb-4"
                                >
                                    🏆
                                </motion.div>
                                <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">
                                    Lab Complete!
                                </h2>
                                {xpEarned !== null && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="flex items-center justify-center gap-2 text-3xl font-black text-violet-600 dark:text-violet-400"
                                    >
                                        <Award className="h-8 w-8" />
                                        <span>+{xpEarned} XP</span>
                                    </motion.div>
                                )}
                                <div className="space-y-4 pt-4">
                                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">What You Learned:</h3>
                                    <ul className="text-left space-y-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>Acids turn blue litmus paper red</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>Bases turn red litmus paper blue</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>Neutral substances cause no color change</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>Litmus paper is a simple pH indicator made from lichens</span>
                                        </li>
                                    </ul>
                                </div>
                                <Button 
                                    onClick={handleReset} 
                                    variant="outline" 
                                    className="mt-6 border-2 border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/20"
                                    size="lg"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Restart Lab
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

            </div>
        </div>
    );
}
