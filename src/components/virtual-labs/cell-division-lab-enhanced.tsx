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
import { LabSupplies, SupplyItem } from './LabSupplies';

type TestStep = 'intro' | 'collect-supplies' | 'selecting' | 'watching' | 'quiz' | 'complete';
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
    
    // Supplies tracking
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [collectedItems, setCollectedItems] = React.useState<string[]>([]);
    
    // Define supplies for the lab
    const supplies: SupplyItem[] = [
        {
            id: 'microscope',
            name: 'Microscope',
            emoji: '🔬',
            description: 'To observe cell division',
            required: true
        },
        {
            id: 'cell-samples',
            name: 'Cell Samples',
            emoji: '🧬',
            description: 'Prepared cell slides',
            required: true
        },
        {
            id: 'stain',
            name: 'Cell Stain',
            emoji: '🎨',
            description: 'To visualize chromosomes',
            required: true
        },
        {
            id: 'timer',
            name: 'Timer',
            emoji: '⏱️',
            description: 'To track division stages',
            required: true
        }
    ];
    
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
        // No pending transitions - immediate responsiveness
    }, []);

    // Supplies collection handlers
    const handleCollect = React.useCallback((itemId: string) => {
        if (!collectedItems.includes(itemId)) {
            setCollectedItems(prev => [...prev, itemId]);
        }
    }, [collectedItems]);

    const handleAllSuppliesCollected = React.useCallback(() => {
        setCurrentStep('selecting');
        setTeacherMessage('Great! Now choose which type of cell division you want to observe. Mitosis is for body cells - it makes identical copies. Meiosis is for sex cells - it creates genetic variety. Which one interests you?');
    }, []);

    // Initial intro
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage('Welcome to Cell Division Lab! Cells reproduce by dividing. There are two main types: MITOSIS creates 2 identical cells for growth and repair. MEIOSIS creates 4 unique gametes for reproduction. Ready to watch cells divide?');
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setCurrentStep('collect-supplies');
        setTeacherMessage('First, let\'s gather our supplies. We need a microscope to observe cells, prepared cell samples, cell stain to visualize chromosomes, and a timer to track the division stages. Click on each item to collect them!');
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
            setTimeout(() => {
                setCurrentStep('quiz');
            }, 500);
        }
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleQuizSubmit = () => {
        if (quizSubmitted) return;
        
        setQuizSubmitted(true);
        
        const correctAnswers = {
            q1: divisionType === 'mitosis' ? 'two-identical' : 'four-gametes',
            q2: divisionType === 'mitosis' ? 'growth-repair' : 'reproduction',
            q3: divisionType === 'mitosis' ? 'same' : 'half'
        };
        
        const isCorrect1 = selectedAnswer1 === correctAnswers.q1;
        const isCorrect2 = selectedAnswer2 === correctAnswers.q2;
        const isCorrect3 = selectedAnswer3 === correctAnswers.q3;
        const correctCount = [isCorrect1, isCorrect2, isCorrect3].filter(Boolean).length;
        
        if (correctCount === 3) {
            // Perfect - all 3 correct
            setQuizFeedback(`Perfect! You got all 3 correct! 🎉 Excellent understanding of ${divisionType}!`);
            
            if (!hasCompleted) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                const earnedXP = markLabComplete('cell-division', 100, timeSpent);
                
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                
                setXpEarned(earnedXP);
                setCurrentStep('complete');
                
                if (divisionType === 'mitosis') {
                    setTeacherMessage(`Outstanding! Perfect understanding of MITOSIS! 🎉 You watched the cell go through Prophase (chromatin condenses), Metaphase (chromosomes align), Anaphase (chromatids separate), and Telophase (nuclear membranes reform). The result: 2 IDENTICAL daughter cells with the SAME chromosome number (diploid). This is how your body grows, heals wounds, and replaces dead cells. Every cell in your skin, muscles, and organs was created through mitosis! Mitosis is used for GROWTH and REPAIR - maintaining genetic stability with no variation. +${earnedXP} XP earned!`);
                } else {
                    setTeacherMessage(`Excellent work! You've mastered MEIOSIS! 🎉 You observed TWO successive divisions: Meiosis I (homologous pairs separate) and Meiosis II (sister chromatids separate). The result: 4 UNIQUE gametes with HALF the chromosomes (haploid). This is how sperm and egg cells are made! Meiosis is used for SEXUAL REPRODUCTION - creating genetic diversity. When two gametes fuse during fertilization, the diploid number is restored. Meiosis creates variation through crossing-over and independent assortment - that's why siblings look different! +${earnedXP} XP earned!`);
                }
            } else {
                setTeacherMessage('Correct! You clearly understand how cells reproduce. Well done!');
            }
        } else if (correctCount === 2) {
            // Good effort - 2 out of 3 correct
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Let me clarify the concepts you missed.`);
            if (divisionType === 'mitosis') {
                setTeacherMessage(`Good effort! You got 2 out of 3 correct about MITOSIS. Let me clarify: (1) RESULT: Mitosis produces 2 IDENTICAL daughter cells - exact clones with the same DNA. Not 4 cells (that's meiosis). (2) PURPOSE: Mitosis is used for GROWTH and REPAIR in your body. When you grow taller, your cells divide by mitosis. When you cut your finger and it heals, mitosis replaces damaged cells. NOT for reproduction - that needs different cells (gametes from meiosis). (3) CHROMOSOME NUMBER: The daughter cells have the SAME number of chromosomes as the parent cell. If the parent is diploid (46 chromosomes in humans), both daughters are also diploid (46). This maintains genetic stability! Think: Mitosis = 2 identical cells, same chromosomes, for growth/repair. Review the animation and try the quiz again!`);
            } else {
                setTeacherMessage(`Good try! You got 2 out of 3 correct about MEIOSIS. Let me clarify: (1) RESULT: Meiosis produces 4 UNIQUE gametes (sex cells) - not 2 like mitosis. You saw TWO divisions: Meiosis I and Meiosis II. Each produces more cells, ending with 4 total. (2) PURPOSE: Meiosis is used for SEXUAL REPRODUCTION - making sperm in males and eggs in females. NOT for growth or repair (that's mitosis). Sexual reproduction needs special cells (gametes) with half the chromosomes. (3) CHROMOSOME NUMBER: Gametes have HALF the chromosomes of the parent cell. If the parent is diploid (46), each gamete is haploid (23). When sperm meets egg, 23 + 23 = 46, restoring the diploid number! This is why you inherit half your DNA from each parent. Meiosis also creates genetic variation through crossing-over. Review the stages and try again!`);
            }
            
            if (!hasCompleted) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                const earnedXP = markLabComplete('cell-division', 75, timeSpent);
                setXpEarned(earnedXP);
                setCurrentStep('complete');
            }
        } else {
            // Needs work - 0 or 1 correct
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Don't worry! Let me explain ${divisionType} from the beginning.`);
            if (divisionType === 'mitosis') {
                setTeacherMessage(`Keep trying! You got ${correctCount} answer${correctCount === 1 ? '' : 's'} correct about MITOSIS. Let me break it down from the very beginning: MITOSIS is the process by which ONE parent cell divides to create TWO IDENTICAL daughter cells. Here's how it works step by step: STEP 1: The parent cell copies its DNA (chromosomes duplicate) - now there are TWO copies of everything. STEP 2: The cell goes through 4 phases you observed: PROPHASE - chromatin condenses into visible X-shaped chromosomes (each X is 2 sister chromatids joined at the centromere). METAPHASE - chromosomes line up along the cell's equator (middle). Nuclear membrane disappears. ANAPHASE - sister chromatids separate and move to opposite poles. Now you have two sets of chromosomes. TELOPHASE - nuclear membranes reform around each set. Cell membrane pinches in (cytokinesis). RESULT: 2 IDENTICAL daughter cells! Each has the SAME number of chromosomes as the parent (diploid = 46 in humans). They're genetic clones - perfect copies! PURPOSE: GROWTH and REPAIR. Your body uses mitosis to: grow from baby to adult (add more cells), replace dead skin cells every few weeks, heal wounds (make new tissue), replace red blood cells. KEY POINTS: 1 parent → 2 daughters. Same chromosomes (diploid). Identical copies. Used for growth/repair. NO genetic variation! Review the animation stages and understand that mitosis maintains genetic stability. Try the quiz again!`);
            } else {
                setTeacherMessage(`Keep learning! You got ${correctCount} answer${correctCount === 1 ? '' : 's'} correct about MEIOSIS. Let me explain this important process from scratch: MEIOSIS is the process by which ONE parent cell divides TWICE to create FOUR UNIQUE gametes (sex cells). This is more complex than mitosis! Here's the full story: STARTING POINT: One diploid parent cell (46 chromosomes in humans) in reproductive organs (testes or ovaries). MEIOSIS I (First Division): Homologous pairs separate. Prophase I - chromosomes pair up (synapsis). CROSSING-OVER occurs - segments swap between paired chromosomes! This creates new genetic combinations. Metaphase I - pairs line up at equator. Anaphase I - WHOLE chromosomes (not chromatids) separate. Telophase I → Result: 2 cells with HALF the chromosomes (23 in humans). MEIOSIS II (Second Division): Sister chromatids separate. Similar to mitosis but starting with half the chromosomes. Prophase II → Metaphase II → Anaphase II → Telophase II. Result: Each of the 2 cells divides → creates 4 total cells. FINAL COUNT: 1 parent → 2 after Meiosis I → 4 after Meiosis II. FINAL RESULT: 4 UNIQUE GAMETES! Each has HALF the chromosomes (haploid = 23 in humans). All four are genetically DIFFERENT due to crossing-over and independent assortment! PURPOSE: SEXUAL REPRODUCTION. Makes sperm (males) and eggs (females). When sperm meets egg: 23 + 23 = 46 chromosomes restored! You inherit 23 from mom, 23 from dad. This is why you're unique (except identical twins). Meiosis creates genetic DIVERSITY - that's why siblings look different! KEY POINTS: 1 parent → 4 gametes. Half chromosomes (haploid). Unique (variation). Used for reproduction. Creates diversity! Review the two divisions and understand that meiosis creates new combinations. Try again!`);
            }
            
            if (!hasCompleted) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                const earnedXP = markLabComplete('cell-division', 50, timeSpent);
                setXpEarned(earnedXP);
                setCurrentStep('complete');
            }
        }
    };

    const handleReset = () => {
        setCurrentStep('intro');
        setDivisionType(null);
        setCurrentStage(0);
        setIsPlaying(false);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setXpEarned(0);
        setShowCelebration(false);
        setCollectedItems([]);
        setTeacherMessage('Ready to observe cell division again? You can watch both mitosis and meiosis to compare them! Click Start Experiment when ready.');
    };
    
    const handleViewQuiz = () => {
        setCurrentStep('quiz');
    };

    const objectiveText = "To observe and understand the processes of mitosis and meiosis, including their phases, outcomes, and biological significance in growth, repair, and reproduction.";
    const theoryText = "Cell division is how living organisms grow, repair damaged tissues, and reproduce. MITOSIS occurs in body (somatic) cells and produces two genetically identical daughter cells. It has four phases: Prophase (chromatin condenses into chromosomes), Metaphase (chromosomes align at the cell's equator), Anaphase (sister chromatids separate and move to opposite poles), and Telophase (nuclear membranes reform). MEIOSIS occurs in reproductive cells to form gametes (sex cells). It involves TWO successive divisions: Meiosis I separates homologous chromosome pairs, and Meiosis II separates sister chromatids, resulting in four non-identical cells with half the chromosome number. This reduction is essential for sexual reproduction and creates genetic diversity through crossing-over and independent assortment.";
    const safetyText = "This is a simulation, so there are no physical safety concerns. In a real laboratory observing cells under a microscope: Always handle microscopes carefully with both hands. Clean slides and cover slips can have sharp edges. Biological stains may be toxic - avoid skin contact and never ingest. Wash hands after handling any biological specimens. Dispose of slides properly in designated containers.";

    const maxStage = divisionType === 'mitosis' ? 4 : 2;
    const stageNames = divisionType === 'mitosis' ? mitosisStageNames : meiosisStageNames;

    return (
        <div className="relative min-h-screen pb-20 overflow-hidden">
            {/* Premium Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20" />
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-r from-purple-200/30 to-blue-200/30 dark:from-purple-800/20 dark:to-blue-800/20 blur-3xl"
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
                    emotion={currentStep === 'quiz' && quizSubmitted ? 'celebrating' : divisionType ? 'happy' : 'explaining'}
                    context={{
                        attempts: currentStage,
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

            {/* Premium Objective Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="border-2 border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-br from-purple-50/80 via-blue-50/80 to-indigo-50/80 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm shadow-lg">
                    <CardHeader className="relative z-10 bg-gradient-to-r from-purple-100/50 to-blue-100/50 dark:from-purple-900/30 dark:to-blue-900/30 border-b border-purple-200/50 dark:border-purple-800/50">
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            Objective
                        </CardTitle>
                        <CardDescription className="text-purple-900/80 dark:text-purple-100/80">{objectiveText}</CardDescription>
                    </CardHeader>
                </Card>
            </motion.div>

            {/* Premium Lab Information Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="border-2 border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-br from-purple-50/80 via-blue-50/80 to-indigo-50/80 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm shadow-lg">
                    <CardHeader className="relative z-10 bg-gradient-to-r from-purple-100/50 to-blue-100/50 dark:from-purple-900/30 dark:to-blue-900/30 border-b border-purple-200/50 dark:border-purple-800/50">
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
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

            {/* Supplies Collection Step */}
            {currentStep === 'collect-supplies' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <LabSupplies
                        supplies={supplies}
                        collectedItems={collectedItems}
                        onCollect={handleCollect}
                        showSupplies={showSupplies}
                        title="Lab Supplies - Click to Collect"
                        description="Collect all the supplies needed to observe cell division"
                        onAllCollected={handleAllSuppliesCollected}
                    />
                </motion.div>
            )}

            {/* Main Lab Interface */}
            {(currentStep !== 'collect-supplies' && currentStep !== 'complete') && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="border-2 border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-br from-purple-50/80 via-blue-50/80 to-indigo-50/80 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm shadow-lg">
                        <CardHeader className="relative z-10 bg-gradient-to-r from-purple-100/50 to-blue-100/50 dark:from-purple-900/30 dark:to-blue-900/30 border-b border-purple-200/50 dark:border-purple-800/50">
                            <CardTitle className="flex items-center gap-2">
                                <Microscope className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                Interactive Cell Division Viewer
                            </CardTitle>
                            <CardDescription className="text-purple-900/80 dark:text-purple-100/80">Watch cells divide in real-time animation</CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10 space-y-6 pt-6">
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
                                className="text-lg px-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
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
                                        className="h-auto w-full flex-col gap-3 py-6 text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20 border-purple-300 dark:border-purple-700 transition-all duration-300"
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
                                        className="h-auto w-full flex-col gap-3 py-6 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20 border-blue-300 dark:border-blue-700 transition-all duration-300"
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
                                    className="text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20 border-purple-300 dark:border-purple-700"
                                >
                                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                                    <span>{isPlaying ? 'Pause' : 'Auto-Play'}</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextStage}
                                    disabled={currentStage >= maxStage}
                                    className="text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20 border-purple-300 dark:border-purple-700"
                                >
                                    <SkipForward className="h-4 w-4 mr-2" />
                                    <span>Next Stage</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentStage(0)}
                                    className="text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20 border-purple-300 dark:border-purple-700"
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    <span>Restart</span>
                                </Button>
                            </div>
                        </div>
                    )}
                        </CardContent>
                        <CardFooter className="relative z-10 flex flex-col gap-3 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-950/30 dark:to-blue-950/30 border-t border-purple-200/50 dark:border-purple-800/50">
                            {currentStep === 'watching' && currentStage >= maxStage && (
                                <Button 
                                    size="lg" 
                                    className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                                    onClick={handleViewQuiz}
                                >
                                    <BookOpen className="h-5 w-5 mr-2" />
                                    Take Quiz
                                </Button>
                            )}
                            {currentStep !== 'intro' && currentStep !== 'collect-supplies' && (
                                <Button 
                                    variant="outline" 
                                    onClick={handleReset}
                                    className="w-full text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20 border-purple-300 dark:border-purple-700"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    <span>Reset & Try Other Type</span>
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </motion.div>
            )}

            {/* Quiz Section */}
            {currentStep === 'quiz' && divisionType && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    data-quiz-section
                >
                    <Card className="border-2 border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-br from-purple-50/80 via-blue-50/80 to-indigo-50/80 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm shadow-lg">
                        <CardHeader className="relative z-10 bg-gradient-to-r from-purple-100/50 to-blue-100/50 dark:from-purple-900/30 dark:to-blue-900/30 border-b border-purple-200/50 dark:border-purple-800/50">
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Post-Lab Quiz
                            </CardTitle>
                            <CardDescription className="text-purple-900/80 dark:text-purple-100/80">Test your understanding of the experiment</CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10 space-y-6 pt-6">
                            {/* Question 1 */}
                            <div className="space-y-3">
                                <p className="font-medium">
                                    1. What is the result of {divisionType}?
                                </p>
                                <RadioGroup 
                                    value={selectedAnswer1 || ''} 
                                    onValueChange={setSelectedAnswer1}
                                    disabled={quizSubmitted}
                                >
                                    <div className="flex items-center space-x-2 py-3 px-4 rounded-lg border-2 border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-200">
                                        <RadioGroupItem value="two-identical" id="q1-1" className="border-purple-400 dark:border-purple-600" />
                                        <Label htmlFor="q1-1" className="flex-1 cursor-pointer text-purple-900 dark:text-purple-100 font-medium">Two identical daughter cells</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-3 px-4 rounded-lg border-2 border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-200">
                                        <RadioGroupItem value="four-gametes" id="q1-2" className="border-purple-400 dark:border-purple-600" />
                                        <Label htmlFor="q1-2" className="flex-1 cursor-pointer text-purple-900 dark:text-purple-100 font-medium">Four unique gametes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-3 px-4 rounded-lg border-2 border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-200">
                                        <RadioGroupItem value="one-large" id="q1-3" className="border-purple-400 dark:border-purple-600" />
                                        <Label htmlFor="q1-3" className="flex-1 cursor-pointer text-purple-900 dark:text-purple-100 font-medium">One large cell</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            
                            {/* Question 2 */}
                            <div className="space-y-3">
                                <p className="font-medium">
                                    2. What is the primary purpose of {divisionType}?
                                </p>
                                <RadioGroup 
                                    value={selectedAnswer2 || ''} 
                                    onValueChange={setSelectedAnswer2}
                                    disabled={quizSubmitted}
                                >
                                    <div className="flex items-center space-x-2 py-3 px-4 rounded-lg border-2 border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-200">
                                        <RadioGroupItem value="growth-repair" id="q2-1" className="border-purple-400 dark:border-purple-600" />
                                        <Label htmlFor="q2-1" className="flex-1 cursor-pointer text-purple-900 dark:text-purple-100 font-medium">Growth and repair of body tissues</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-3 px-4 rounded-lg border-2 border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-200">
                                        <RadioGroupItem value="reproduction" id="q2-2" className="border-purple-400 dark:border-purple-600" />
                                        <Label htmlFor="q2-2" className="flex-1 cursor-pointer text-purple-900 dark:text-purple-100 font-medium">Sexual reproduction (making sex cells)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-3 px-4 rounded-lg border-2 border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-200">
                                        <RadioGroupItem value="digestion" id="q2-3" className="border-purple-400 dark:border-purple-600" />
                                        <Label htmlFor="q2-3" className="flex-1 cursor-pointer text-purple-900 dark:text-purple-100 font-medium">Digestion of food</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            
                            {/* Question 3 */}
                            <div className="space-y-3">
                                <p className="font-medium">
                                    3. How many chromosomes do the daughter cells have compared to the parent cell?
                                </p>
                                <RadioGroup 
                                    value={selectedAnswer3 || ''} 
                                    onValueChange={setSelectedAnswer3}
                                    disabled={quizSubmitted}
                                >
                                    <div className="flex items-center space-x-2 py-3 px-4 rounded-lg border-2 border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-200">
                                        <RadioGroupItem value="same" id="q3-1" className="border-purple-400 dark:border-purple-600" />
                                        <Label htmlFor="q3-1" className="flex-1 cursor-pointer text-purple-900 dark:text-purple-100 font-medium">Same number (diploid)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-3 px-4 rounded-lg border-2 border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-200">
                                        <RadioGroupItem value="half" id="q3-2" className="border-purple-400 dark:border-purple-600" />
                                        <Label htmlFor="q3-2" className="flex-1 cursor-pointer text-purple-900 dark:text-purple-100 font-medium">Half the number (haploid)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 py-3 px-4 rounded-lg border-2 border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-200">
                                        <RadioGroupItem value="double" id="q3-3" className="border-purple-400 dark:border-purple-600" />
                                        <Label htmlFor="q3-3" className="flex-1 cursor-pointer text-purple-900 dark:text-purple-100 font-medium">Double the number</Label>
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
                        <CardFooter className="relative z-10 flex flex-col gap-3 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-950/30 dark:to-blue-950/30 border-t border-purple-200/50 dark:border-purple-800/50">
                            <Button 
                                onClick={handleQuizSubmit} 
                                disabled={!selectedAnswer1 || !selectedAnswer2 || !selectedAnswer3 || quizSubmitted}
                                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-2 border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-br from-purple-50/95 via-blue-50/95 to-indigo-50/95 dark:from-purple-950/95 dark:via-blue-950/95 dark:to-indigo-950/95 backdrop-blur-md shadow-2xl max-w-2xl w-full mx-4">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <motion.div
                                        animate={{ 
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ 
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <Trophy className="h-20 w-20 text-purple-500 dark:text-purple-400" />
                                    </motion.div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        Lab Complete!
                                    </h2>
                                    <p className="text-lg text-purple-900/80 dark:text-purple-100/80">
                                        You've mastered {divisionType === 'mitosis' ? 'mitosis' : 'meiosis'}!
                                    </p>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-purple-200 dark:border-purple-800">
                                    <h3 className="font-semibold text-lg text-purple-900 dark:text-purple-100 flex items-center gap-2">
                                        <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        What You've Learned:
                                    </h3>
                                    <ul className="space-y-2 text-purple-800 dark:text-purple-200">
                                        {divisionType === 'mitosis' ? (
                                            <>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                                    <span>Mitosis produces 2 identical daughter cells with the same chromosome number</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                                    <span>The four phases: Prophase, Metaphase, Anaphase, and Telophase</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                                    <span>Mitosis is used for growth and repair of body tissues</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                                    <span>Daughter cells are genetic clones of the parent cell</span>
                                                </li>
                                            </>
                                        ) : (
                                            <>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                                    <span>Meiosis produces 4 unique gametes with half the chromosome number</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                                    <span>Meiosis involves two divisions: Meiosis I and Meiosis II</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                                    <span>Meiosis is used for sexual reproduction</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                                    <span>Crossing-over creates genetic diversity in gametes</span>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>

                                {xpEarned > 0 && (
                                    <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-100/50 to-blue-100/50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg border border-purple-300/50 dark:border-purple-700/50">
                                        <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                        <span className="text-xl font-bold text-purple-900 dark:text-purple-100">
                                            +{xpEarned} XP Earned!
                                        </span>
                                    </div>
                                )}

                                <Button
                                    onClick={handleReset}
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                                >
                                    <RefreshCw className="h-5 w-5 mr-2" />
                                    Restart Lab
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            )}

            {showCelebration && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                >
                    <div className="text-6xl">🧬✨</div>
                </motion.div>
            )}
            </div>
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
