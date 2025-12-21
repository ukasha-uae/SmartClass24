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
    Users, Dna, Play, Pause, SkipForward, RotateCcw,
    Sparkles, Trophy, Award, Microscope, Baby, Heart
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherVoice } from './TeacherVoice';
import { useLabProgress } from '@/stores/lab-progress-store';
import confetti from 'canvas-confetti';

type TestStep = 'intro' | 'selecting' | 'watching' | 'quiz';
type DivisionType = 'mitosis' | 'meiosis';
type MitosisStage = 0 | 1 | 2 | 3 | 4; // Prophase, Metaphase, Anaphase, Telophase, Result
type MeiosisStage = 0 | 1 | 2; // Meiosis I, Meiosis II, Result

const mitosisStageNames = ['Prophase', 'Metaphase', 'Anaphase', 'Telophase', 'Result (2 Cells)'];
const meiosisStageNames = ['Meiosis I', 'Meiosis II', 'Result (4 Gametes)'];

export function CellDivisionLabEnhanced() {
    const { toast } = useToast();
    
    // Lab state
    const [currentStep, setCurrentStep] = React.useState<TestStep>('intro');
    const [divisionType, setDivisionType] = React.useState<DivisionType | null>(null);
    const [currentStage, setCurrentStage] = React.useState(0);
    const [isPlaying, setIsPlaying] = React.useState(false);
    
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
    const hasCompleted = isLabCompleted('cell-division');
    const labProgress = getLabCompletion('cell-division');
    
    // Auto-play effect
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && divisionType) {
            const maxStage = divisionType === 'mitosis' ? 4 : 2;
            interval = setInterval(() => {
                setCurrentStage(prev => {
                    if (prev >= maxStage) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, divisionType]);

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
            setTeacherMessage('Welcome to Cell Division Lab! Cells reproduce by dividing. There are two main types: MITOSIS creates 2 identical cells for growth and repair. MEIOSIS creates 4 unique gametes for reproduction. Ready to watch cells divide?');
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setCurrentStep('selecting');
        setTeacherMessage('Choose which type of cell division you want to observe. Mitosis is for body cells - it makes identical copies. Meiosis is for sex cells - it creates genetic variety. Which one interests you?');
    };

    const handleSelectDivision = (type: DivisionType) => {
        setDivisionType(type);
        setCurrentStage(0);
        setCurrentStep('watching');
        
        const messages: Record<DivisionType, string> = {
            'mitosis': 'Excellent! Mitosis has 4 phases: Prophase (chromosomes condense), Metaphase (line up in middle), Anaphase (pull apart), and Telophase (two nuclei form). Use the controls to step through each phase!',
            'meiosis': 'Great choice! Meiosis happens in TWO divisions. First division separates homologous pairs, second division separates sister chromatids. This creates 4 gametes with half the chromosomes. Watch it happen!'
        };
        
        setTeacherMessage(messages[type]);
    };

    const handleNextStage = () => {
        if (!divisionType) return;
        const maxStage = divisionType === 'mitosis' ? 4 : 2;
        
        if (currentStage < maxStage) {
            setCurrentStage(prev => prev + 1);
            
            if (divisionType === 'mitosis') {
                const stageMessages = [
                    'Prophase: Chromosomes condense and become visible. The spindle fibers start forming.',
                    'Metaphase: Chromosomes line up at the cell equator. Notice how they align perfectly in the middle!',
                    'Anaphase: Sister chromatids are pulled apart to opposite poles. The cell is getting ready to split.',
                    'Telophase: Nuclear membranes reform around each set of chromosomes. Almost done!',
                    'Result: TWO identical daughter cells! Each has the same genetic information as the parent. Perfect for growth and repair!'
                ];
                setTeacherMessage(stageMessages[currentStage]);
            } else {
                const stageMessages = [
                    'Meiosis I: Homologous chromosomes pair up and separate. This is where crossing-over can occur, creating genetic variety!',
                    'Meiosis II: Similar to mitosis, sister chromatids separate. Now we have 4 cells forming.',
                    'Result: FOUR unique gametes! Each has HALF the chromosomes and different genetic combinations. Perfect for sexual reproduction!'
                ];
                setTeacherMessage(stageMessages[currentStage]);
            }
        }
        
        if (currentStage === maxStage - 1) {
            setPendingTransition(() => () => {
                setTimeout(() => {
                    setCurrentStep('quiz');
                    const quizSection = document.querySelector('[data-quiz-section]');
                    quizSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            });
        }
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        
        const correctAnswer = divisionType === 'mitosis' ? 'Two identical daughter cells' : 'Four unique gametes';
        const isCorrect = quizAnswer === correctAnswer;
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        
        if (isCorrect) {
            setQuizIsCorrect(true);
            const feedback = divisionType === 'mitosis' 
                ? "Perfect! Mitosis produces 2 identical daughter cells with the same chromosome number as the parent. ✅"
                : "Excellent! Meiosis produces 4 unique gametes, each with half the chromosomes of the parent cell. ✅";
            setQuizFeedback(feedback);
            
            if (!hasCompleted) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                const score = newAttempts === 1 ? 100 : 75;
                const earnedXP = markLabComplete('cell-division', score, timeSpent);
                
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                
                setXpEarned(earnedXP);
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 5000);
                
                setTeacherMessage(`Outstanding work! You've mastered cell division and earned ${earnedXP} XP! You now have ${totalXP + earnedXP} total XP. Remember: Mitosis = 2 identical, Meiosis = 4 unique!`);
            } else {
                setTeacherMessage('Correct! You clearly understand how cells reproduce. Well done!');
            }
        } else {
            if (newAttempts === 1) {
                const hint = divisionType === 'mitosis'
                    ? "Think about growth and repair - do you need identical copies or variety? Try again! 🔄"
                    : "Think about reproduction - genetic variety needs how many different cells? Try again! 🔄";
                setQuizFeedback(hint);
                setTeacherMessage(hint);
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback(`The correct answer is ${correctAnswer}. ${divisionType === 'mitosis' ? 'Mitosis creates identical twins of the parent cell.' : 'Meiosis creates diversity through two divisions.'} 🧠`);
                setTeacherMessage(`Remember: ${divisionType === 'mitosis' ? 'Mitosis = 2 identical for growth' : 'Meiosis = 4 unique for reproduction'}!`);
            }
        }
    };

    const handleReset = () => {
        setCurrentStep('intro');
        setDivisionType(null);
        setCurrentStage(0);
        setIsPlaying(false);
        setQuizAnswer('');
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setXpEarned(0);
        setShowCelebration(false);
        setTeacherMessage('Ready to observe cell division again? You can watch both mitosis and meiosis to compare them! Click Start Experiment when ready.');
    };

    const objectiveText = "To observe and understand the processes of mitosis and meiosis, including their phases, outcomes, and biological significance in growth, repair, and reproduction.";
    const theoryText = "Cell division is how living organisms grow, repair damaged tissues, and reproduce. MITOSIS occurs in body (somatic) cells and produces two genetically identical daughter cells. It has four phases: Prophase (chromatin condenses into chromosomes), Metaphase (chromosomes align at the cell's equator), Anaphase (sister chromatids separate and move to opposite poles), and Telophase (nuclear membranes reform). MEIOSIS occurs in reproductive cells to form gametes (sex cells). It involves TWO successive divisions: Meiosis I separates homologous chromosome pairs, and Meiosis II separates sister chromatids, resulting in four non-identical cells with half the chromosome number. This reduction is essential for sexual reproduction and creates genetic diversity through crossing-over and independent assortment.";
    const safetyText = "This is a simulation, so there are no physical safety concerns. In a real laboratory observing cells under a microscope: Always handle microscopes carefully with both hands. Clean slides and cover slips can have sharp edges. Biological stains may be toxic - avoid skin contact and never ingest. Wash hands after handling any biological specimens. Dispose of slides properly in designated containers.";

    const maxStage = divisionType === 'mitosis' ? 4 : 2;
    const stageNames = divisionType === 'mitosis' ? mitosisStageNames : meiosisStageNames;

    return (
        <div className="space-y-6">
            {/* Completion Badge */}
            {hasCompleted && labProgress && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-xl border-2 border-purple-300 dark:border-purple-700"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500 rounded-full">
                            <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-purple-900 dark:text-purple-100">Lab Completed!</div>
                            <div className="text-sm text-purple-700 dark:text-purple-300">
                                Score: {labProgress.score}%
                            </div>
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-purple-200 text-purple-900">
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
                    <CardTitle className="flex items-center gap-2">
                        <Microscope className="h-6 w-6" />
                        Interactive Cell Division Viewer
                    </CardTitle>
                    <CardDescription>Watch cells divide in real-time animation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Start Button */}
                    {currentStep === 'intro' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-12 space-y-6"
                        >
                            <div className="flex gap-8">
                                <div className="flex flex-col items-center">
                                    <Users className="h-20 w-20 text-purple-500 mb-2" />
                                    <span className="font-semibold">Mitosis</span>
                                    <span className="text-xs text-muted-foreground">2 Identical Cells</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Dna className="h-20 w-20 text-blue-500 mb-2" />
                                    <span className="font-semibold">Meiosis</span>
                                    <span className="text-xs text-muted-foreground">4 Unique Gametes</span>
                                </div>
                            </div>
                            <Button 
                                size="lg" 
                                onClick={handleStartExperiment}
                                className="text-lg px-8"
                            >
                                Start Experiment 🔬
                            </Button>
                        </motion.div>
                    )}

                    {/* Division Type Selection */}
                    {currentStep === 'selecting' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <Label className="text-lg font-semibold">Select Division Type</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button 
                                        variant="outline"
                                        onClick={() => handleSelectDivision('mitosis')}
                                        className="h-auto w-full flex-col gap-3 py-6"
                                    >
                                        <Users className="h-12 w-12 text-purple-500" />
                                        <div className="text-center">
                                            <div className="font-bold text-lg">Mitosis</div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                For growth & repair
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-2">
                                                <Heart className="h-3 w-3 inline mr-1" />
                                                Body cells → 2 identical cells
                                            </div>
                                        </div>
                                    </Button>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button 
                                        variant="outline"
                                        onClick={() => handleSelectDivision('meiosis')}
                                        className="h-auto w-full flex-col gap-3 py-6"
                                    >
                                        <Dna className="h-12 w-12 text-blue-500" />
                                        <div className="text-center">
                                            <div className="font-bold text-lg">Meiosis</div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                For reproduction
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-2">
                                                <Baby className="h-3 w-3 inline mr-1" />
                                                Sex cells → 4 unique gametes
                                            </div>
                                        </div>
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* Cell Division Animation */}
                    {currentStep === 'watching' && divisionType && (
                        <div className="space-y-4">
                            {/* Stage indicator */}
                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div>
                                    <div className="text-sm text-muted-foreground">Current Stage</div>
                                    <div className="font-bold text-lg">{stageNames[currentStage]}</div>
                                </div>
                                <Badge variant="outline" className="text-lg px-4 py-2">
                                    {currentStage + 1} / {maxStage + 1}
                                </Badge>
                            </div>

                            {/* Animated cell visualization */}
                            <div className="relative aspect-square max-w-md mx-auto bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-xl border-2 p-8">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`${divisionType}-${currentStage}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="w-full h-full flex items-center justify-center"
                                    >
                                        {divisionType === 'mitosis' ? (
                                            <MitosisAnimation stage={currentStage as MitosisStage} />
                                        ) : (
                                            <MeiosisAnimation stage={currentStage as MeiosisStage} />
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Controls */}
                            <div className="flex flex-wrap gap-2 justify-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePlayPause}
                                    disabled={currentStage >= maxStage}
                                >
                                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                                    {isPlaying ? 'Pause' : 'Auto-Play'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextStage}
                                    disabled={currentStage >= maxStage}
                                >
                                    <SkipForward className="h-4 w-4 mr-2" />
                                    Next Stage
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentStage(0)}
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Restart
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    {currentStep !== 'intro' && (
                        <Button 
                            variant="outline" 
                            onClick={handleReset}
                            className="w-full"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset & Try Other Type
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {/* Quiz Section */}
            {currentStep === 'quiz' && divisionType && (
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
                                What is the result of {divisionType}?
                            </p>
                            <RadioGroup 
                                value={quizAnswer} 
                                onValueChange={setQuizAnswer}
                                disabled={quizIsCorrect !== null}
                            >
                                <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <RadioGroupItem value="Two identical daughter cells" id="q-1" />
                                    <Label htmlFor="q-1" className="flex-1 cursor-pointer">Two identical daughter cells</Label>
                                </div>
                                <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <RadioGroupItem value="Four unique gametes" id="q-2" />
                                    <Label htmlFor="q-2" className="flex-1 cursor-pointer">Four unique gametes</Label>
                                </div>
                                <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <RadioGroupItem value="One large cell" id="q-3" />
                                    <Label htmlFor="q-3" className="flex-1 cursor-pointer">One large cell</Label>
                                </div>
                                <div className="flex items-center space-x-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <RadioGroupItem value="Eight cells" id="q-4" />
                                    <Label htmlFor="q-4" className="flex-1 cursor-pointer">Eight cells</Label>
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
                        <div className="bg-gradient-to-br from-purple-500 to-blue-600 text-white p-6 rounded-2xl shadow-2xl border-4 border-purple-300">
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

// Simplified chromosome components for animations
function MitosisAnimation({ stage }: { stage: MitosisStage }) {
    return (
        <div className="w-full h-full relative">
            {stage === 0 && ( // Prophase
                <motion.div className="w-full h-full flex items-center justify-center gap-4">
                    <ChromosomePair color="purple" />
                    <ChromosomePair color="blue" />
                </motion.div>
            )}
            {stage === 1 && ( // Metaphase
                <motion.div className="w-full h-full flex items-center justify-center">
                    <div className="flex gap-6">
                        <ChromosomePair color="purple" />
                        <ChromosomePair color="blue" />
                    </div>
                </motion.div>
            )}
            {stage === 2 && ( // Anaphase
                <motion.div className="w-full h-full flex items-center justify-between px-8">
                    <div className="flex flex-col gap-4">
                        <Chromatid color="purple" />
                        <Chromatid color="blue" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Chromatid color="purple" />
                        <Chromatid color="blue" />
                    </div>
                </motion.div>
            )}
            {stage === 3 && ( // Telophase
                <motion.div className="w-full h-full flex items-center justify-between gap-4">
                    <CellOutline>
                        <Chromatid color="purple" small />
                        <Chromatid color="blue" small />
                    </CellOutline>
                    <CellOutline>
                        <Chromatid color="purple" small />
                        <Chromatid color="blue" small />
                    </CellOutline>
                </motion.div>
            )}
            {stage === 4 && ( // Result
                <motion.div className="w-full h-full flex items-center justify-between gap-6">
                    <CellOutline>
                        <Chromatid color="purple" small />
                        <Chromatid color="blue" small />
                    </CellOutline>
                    <CellOutline>
                        <Chromatid color="purple" small />
                        <Chromatid color="blue" small />
                    </CellOutline>
                </motion.div>
            )}
        </div>
    );
}

function MeiosisAnimation({ stage }: { stage: MeiosisStage }) {
    return (
        <div className="w-full h-full relative">
            {stage === 0 && ( // Meiosis I
                <motion.div className="w-full h-full flex items-center justify-between gap-4">
                    <CellOutline>
                        <ChromosomePair color="purple" small />
                    </CellOutline>
                    <CellOutline>
                        <ChromosomePair color="blue" small />
                    </CellOutline>
                </motion.div>
            )}
            {stage === 1 && ( // Meiosis II
                <motion.div className="w-full h-full grid grid-cols-2 gap-3">
                    <CellOutline><Chromatid color="purple" tiny /></CellOutline>
                    <CellOutline><Chromatid color="purple" tiny /></CellOutline>
                    <CellOutline><Chromatid color="blue" tiny /></CellOutline>
                    <CellOutline><Chromatid color="blue" tiny /></CellOutline>
                </motion.div>
            )}
            {stage === 2 && ( // Result
                <motion.div className="w-full h-full grid grid-cols-2 gap-2">
                    <CellOutline><Chromatid color="purple" tiny /></CellOutline>
                    <CellOutline><Chromatid color="purple" tiny /></CellOutline>
                    <CellOutline><Chromatid color="blue" tiny /></CellOutline>
                    <CellOutline><Chromatid color="blue" tiny /></CellOutline>
                </motion.div>
            )}
        </div>
    );
}

function ChromosomePair({ color, small }: { color: string; small?: boolean }) {
    const sizeClass = small ? 'w-8 h-12' : 'w-12 h-16';
    const bgColor = color === 'purple' ? 'bg-purple-500' : 'bg-blue-500';
    return (
        <motion.div 
            className="flex gap-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
        >
            <div className={cn(sizeClass, bgColor, "rounded-full")} />
            <div className={cn(sizeClass, bgColor, "rounded-full")} />
        </motion.div>
    );
}

function Chromatid({ color, small, tiny }: { color: string; small?: boolean; tiny?: boolean }) {
    const sizeClass = tiny ? 'w-4 h-6' : small ? 'w-6 h-10' : 'w-8 h-12';
    const bgColor = color === 'purple' ? 'bg-purple-500' : 'bg-blue-500';
    return (
        <motion.div 
            className={cn(sizeClass, bgColor, "rounded-full")}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
        />
    );
}

function CellOutline({ children }: { children: React.ReactNode }) {
    return (
        <motion.div 
            className="border-4 border-gray-400 rounded-full w-full h-full flex flex-col items-center justify-center gap-2 p-4"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
}
