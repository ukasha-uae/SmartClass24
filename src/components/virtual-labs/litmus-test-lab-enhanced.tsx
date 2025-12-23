'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, TestTube, BookOpen, Shield, Droplets, Beaker, Eye, Sparkles, Package, Zap, Star } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherVoice } from './TeacherVoice';
import { useLabProgress } from '@/stores/lab-progress-store';
import confetti from 'canvas-confetti';
import { LabNotes } from './LabNotes';
import { Alert, AlertDescription } from '../ui/alert';

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
    const { markLabComplete, isLabCompleted, totalXP } = useLabProgress();
    const [currentStep, setCurrentStep] = React.useState<TestStep>('select-substance');
    const [selectedSubstance, setSelectedSubstance] = React.useState<Substance | null>(null);
    const [selectedPaper, setSelectedPaper] = React.useState<LitmusPaper | null>(null);
    const [result, setResult] = React.useState<ResultColor | null>(null);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [showPractice, setShowPractice] = React.useState(false);
    const [practiceInteraction, setPracticeInteraction] = React.useState<'substances' | 'paper' | 'rules' | null>(null);
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
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
        if (currentStep === 'select-substance') {
            setTeacherMessage("Welcome to the Litmus Paper Lab! Today you'll learn how to identify acids and bases using colored paper. Let's start by choosing a substance to test. Pick any one that interests you!");
        }
    }, [currentStep]);

    // Scroll to quiz when complete
    React.useEffect(() => {
        if (currentStep === 'complete') {
            setTimeout(() => {
                const quizElement = document.getElementById('quiz-section');
                if (quizElement) {
                    quizElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 800);
        }
    }, [currentStep]);

    const handleTeacherComplete = () => {
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null);
            transition();
        }
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
                
                setPendingTransition(() => () => {
                    setCurrentStep('complete');
                    setIsAnimating(false);
                    setTeacherMessage("Excellent work! Now scroll down and answer the quiz question to test your understanding and earn XP!");
                });
            }
        }, 2000);
    };

    const handleReset = () => {
        setCurrentStep('select-substance');
        setSelectedSubstance(null);
        setSelectedPaper(null);
        setResult(null);
        setIsAnimating(false);
        setQuizAnswers({});
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setPendingTransition(null);
        setTeacherMessage("Great! Let's test another substance. Choose any substance you want to explore!");
        toast({ title: '🔄 Lab Reset', description: 'Start a new test' });
    };

    const handleAnswerChange = (questionIndex: number, value: string) => {
        setQuizAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }));
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null || !selectedSubstance || !result) return;
        
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
        <div className="space-y-6">
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
            <TeacherVoice 
                message={teacherMessage} 
                onComplete={handleTeacherComplete}
                emotion={currentStep === 'complete' ? 'celebrating' : quizIsCorrect ? 'happy' : 'explaining'}
                context={{
                    attempts: quizAttempts,
                    correctStreak: quizIsCorrect ? 1 : 0
                }}
                quickActions={[
                    { label: 'Reset Lab', icon: '🔄', onClick: handleReset },
                    { label: 'View Theory', icon: '📖', onClick: () => document.querySelector('[value="theory"]')?.parentElement?.click() },
                    { label: 'Safety Tips', icon: '🛡️', onClick: () => document.querySelector('[value="safety"]')?.parentElement?.click() }
                ]}
            />

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
                                            className="w-full h-24 flex-col gap-2 hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950 transition-all"
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
                                        className="w-full h-40 flex-col gap-3 hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
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
                                        className="w-full h-40 flex-col gap-3 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
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

            {/* Post-Lab Quiz */}
            {result && currentStep === 'complete' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                <Card id="quiz-section" className="border-2 border-green-200 dark:border-green-800">
                    <CardHeader>
                        <CardTitle>Post-Lab Assessment</CardTitle>
                        <CardDescription>Test your understanding of the litmus paper test</CardDescription>
                        </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Question 1 */}
                            <div>
                                <p className="text-base font-semibold mb-3">1. What type of substance is {selectedSubstance}?</p>
                                <RadioGroup 
                                    value={quizAnswers[1]} 
                                    onValueChange={(value) => handleAnswerChange(1, value)} 
                                    disabled={quizIsCorrect !== null}
                                >
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="acid" id="q1-acid" />
                                        <Label htmlFor="q1-acid" className="flex-1 cursor-pointer">Acid</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="base" id="q1-base" />
                                        <Label htmlFor="q1-base" className="flex-1 cursor-pointer">Base</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="neutral" id="q1-neutral" />
                                        <Label htmlFor="q1-neutral" className="flex-1 cursor-pointer">Neutral</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Question 2 */}
                            <div>
                                <p className="text-base font-semibold mb-3">2. When {selectedPaper?.toLowerCase()} litmus paper is dipped in {selectedSubstance?.toLowerCase()}, what happens?</p>
                                <RadioGroup 
                                    value={quizAnswers[2]} 
                                    onValueChange={(value) => handleAnswerChange(2, value)} 
                                    disabled={quizIsCorrect !== null}
                                >
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="turns-red" id="q2-red" />
                                        <Label htmlFor="q2-red" className="flex-1 cursor-pointer">Turns Red</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="turns-blue" id="q2-blue" />
                                        <Label htmlFor="q2-blue" className="flex-1 cursor-pointer">Turns Blue</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="no-change" id="q2-nochange" />
                                        <Label htmlFor="q2-nochange" className="flex-1 cursor-pointer">No Change</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="disappears" id="q2-disappears" />
                                        <Label htmlFor="q2-disappears" className="flex-1 cursor-pointer">Disappears</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Question 3 */}
                            <div>
                                <p className="text-base font-semibold mb-3">3. What is the general rule for litmus paper color changes?</p>
                                <RadioGroup 
                                    value={quizAnswers[3]} 
                                    onValueChange={(value) => handleAnswerChange(3, value)} 
                                    disabled={quizIsCorrect !== null}
                                >
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="acids-blue-red" id="q3-acids" />
                                        <Label htmlFor="q3-acids" className="flex-1 cursor-pointer">Acids turn blue litmus red</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="bases-red-blue" id="q3-bases" />
                                        <Label htmlFor="q3-bases" className="flex-1 cursor-pointer">Bases turn red litmus blue</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="both-rules" id="q3-both" />
                                        <Label htmlFor="q3-both" className="flex-1 cursor-pointer">Both rules apply</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <RadioGroupItem value="neither" id="q3-neither" />
                                        <Label htmlFor="q3-neither" className="flex-1 cursor-pointer">Neither rule applies</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

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
                            disabled={Object.keys(quizAnswers).length < 3 || quizIsCorrect !== null}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {quizIsCorrect === true ? "✓ All Correct!" : quizIsCorrect === false ? "See Answers" : "Submit Answers"}
                        </Button>
                    </CardFooter>
                </Card>
                </motion.div>
            )}

            {/* Conclusion - Only shows after quiz is answered */}
            {currentStep === 'complete' && quizIsCorrect !== null && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="border-2 border-green-200 dark:border-green-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                Key Learning Points
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <span className="text-xl">🔴</span>
                                    <span><strong>Acids</strong> turn <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded font-semibold">blue litmus</span> → <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded font-semibold">red</span></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-xl">🔵</span>
                                    <span><strong>Bases</strong> turn <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded font-semibold">red litmus</span> → <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded font-semibold">blue</span></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-xl">⚪</span>
                                    <span><strong>Neutral</strong> substances cause <strong>no color change</strong> in either litmus paper</span>
                                </li>
                            </ul>
                            <div className="mt-4 p-3 bg-violet-50 dark:bg-violet-950/30 rounded-lg border border-violet-200 dark:border-violet-800">
                                <p className="text-sm font-semibold text-violet-700 dark:text-violet-400 mb-2">
                                    💡 Did You Know?
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Litmus is extracted from lichens (organisms formed by algae and fungi living together). 
                                    The name comes from the Old Norse word "litmosi" meaning "dye moss"!
                                </p>
                            </div>
                            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">
                                    📝 Exam Tip
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Remember the rule: <strong>"Acids Redden Blue"</strong> and <strong>"Bases Bluen Red"</strong>. 
                                    This mnemonic helps you never forget which direction the color changes!
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Lab Notes - Always Available */}
            <Card className="border-2 border-amber-200 dark:border-amber-800">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="lab-notes" className="border-none">
                        <AccordionTrigger className="px-6 pt-6 hover:no-underline">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                                <BookOpen className="h-5 w-5 text-amber-600" />
                                Lab Notes
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                            <p className="text-sm text-muted-foreground mb-4">
                                Record your observations, findings, and questions as you work through the experiment
                            </p>
                            <Alert className="mb-4 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                                <BookOpen className="h-4 w-4 text-amber-600" />
                                <AlertDescription className="text-sm">
                                    <strong>📝 Exam Preparation Tip:</strong> Use digital notes to capture your observations quickly, 
                                    but <strong>remember to copy important points by hand</strong> into your notebook! Handwriting builds 
                                    muscle memory and prepares you for written exams.
                                </AlertDescription>
                            </Alert>
                            <LabNotes labId="litmus-test-lab" labTitle="Litmus Test for Acids and Bases" />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>
        </div>
    );
}
