'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Trophy, Award, GripVertical, Sparkles, Zap, Lightbulb, Battery, BatteryCharging, Minus, CircleDot, ToggleRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { LabSupplies, SupplyItem } from './LabSupplies';

type Step = 'intro' | 'collect-supplies' | 'experiment' | 'results' | 'quiz' | 'complete';

interface CircuitConfiguration {
    name: string;
    type: 'series' | 'parallel';
    bulbs: number;
    switches: number;
    brightness: number; // 0-100
    allLit: boolean;
}

export function SimpleCircuitLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Supplies tracking - using standardized component
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [collectedItems, setCollectedItems] = React.useState<string[]>([]);
    
    // Define supplies for the lab
    const supplies: SupplyItem[] = [
        {
            id: 'battery',
            name: 'Battery',
            emoji: '🔋',
            description: 'Power source for the circuit',
            required: true
        },
        {
            id: 'bulbs',
            name: 'Light Bulbs',
            emoji: '💡',
            description: 'For observing current flow',
            required: true
        },
        {
            id: 'wires',
            name: 'Connecting Wires',
            emoji: '⚡',
            description: 'Complete the circuit path',
            required: true
        },
        {
            id: 'switches',
            name: 'Switches',
            emoji: '🔌',
            description: 'Control current flow',
            required: true
        }
    ];
    
    // Experiment state
    const [circuits, setCircuits] = React.useState<CircuitConfiguration[]>([
        {
            name: 'Series Circuit',
            type: 'series',
            bulbs: 0,
            switches: 0,
            brightness: 0,
            allLit: false
        },
        {
            name: 'Parallel Circuit',
            type: 'parallel',
            bulbs: 0,
            switches: 0,
            brightness: 0,
            allLit: false
        }
    ]);
    const [activeCircuit, setActiveCircuit] = React.useState<number | null>(null);
    const [circuitActive, setCircuitActive] = React.useState(false);
    const [completedCircuits, setCompletedCircuits] = React.useState(0);
    const [seriesBrokenBulbs, setSeriesBrokenBulbs] = React.useState<number[]>([]);
    const [parallelBrokenBulbs, setParallelBrokenBulbs] = React.useState<number[]>([]);
    
    // Quiz state
    const [quizAnswer1, setQuizAnswer1] = React.useState<string | undefined>();
    const [quizAnswer2, setQuizAnswer2] = React.useState<string | undefined>();
    const [quizAnswer3, setQuizAnswer3] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState('');
    const [quizSubmitted, setQuizSubmitted] = React.useState(false);
    
    // XP and completion
    const [xpEarned, setXpEarned] = React.useState(0);
    const [showCelebration, setShowCelebration] = React.useState(false);
    const { markLabComplete, isLabCompleted, getLabCompletion } = useLabProgress();
    const labId = 'simple-circuits';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to Simple Circuits Lab! We'll build and compare series and parallel circuits to understand how they work differently. Let's explore!");
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setTeacherMessage("Great! Let's gather our components. Start by clicking on the BATTERY - our power source!");
        setPendingTransition(() => () => {
            setCurrentStep('collect-supplies');
        });
    };
    
    // Standardized supplies collection handler
    const handleCollect = (itemId: string) => {
        if (!collectedItems.includes(itemId)) {
            const newCollected = [...collectedItems, itemId];
            setCollectedItems(newCollected);
            
            const supply = supplies.find(s => s.id === itemId);
            toast({ title: `✅ ${supply?.name} Collected` });
            
            // Update teacher message based on collection order
            if (itemId === 'battery') {
                setTeacherMessage("Perfect! Now click on the LIGHT BULBS - we'll use these to see current flowing!");
            } else if (itemId === 'bulbs') {
                setTeacherMessage("Great! Now click on the CONNECTING WIRES - these complete our circuit!");
            } else if (itemId === 'wires') {
                setTeacherMessage("Excellent! Finally, click on the SWITCHES - we'll control current with these!");
            }
        }
    };
    
    const handleAllSuppliesCollected = () => {
        setShowSupplies(false);
        setTeacherMessage("All components ready! Now let's build a series circuit first, then compare it to a parallel circuit!");
        toast({ title: '🎉 All Supplies Collected!', description: 'Ready to start the experiment!' });
        setPendingTransition(() => () => {
            setCurrentStep('experiment');
        });
    };
    
    // Check if all supplies collected (for backward compatibility with experiment logic)
    const batteryCollected = collectedItems.includes('battery');
    const bulbsCollected = collectedItems.includes('bulbs');
    const wiresCollected = collectedItems.includes('wires');
    const switchesCollected = collectedItems.includes('switches');
    
    const handleBreakSeriesBulb = (bulbIndex: number) => {
        if (!seriesBrokenBulbs.includes(bulbIndex)) {
            setSeriesBrokenBulbs([...seriesBrokenBulbs, bulbIndex]);
            setTeacherMessage(`Bulb ${bulbIndex} broken! ⚠️ In a series circuit, the entire circuit stops working because there's only ONE path for current. All bulbs go out!`);
            toast({ title: '💥 Bulb Broken!', description: 'Series circuit interrupted - all bulbs off', variant: 'destructive' });
        } else {
            setSeriesBrokenBulbs(seriesBrokenBulbs.filter(b => b !== bulbIndex));
            setTeacherMessage(`Bulb ${bulbIndex} replaced! ✅ Circuit restored - all bulbs light up again.`);
            toast({ title: '✅ Bulb Replaced', description: 'Series circuit working again' });
        }
    };
    
    const handleBreakParallelBulb = (bulbIndex: number) => {
        if (!parallelBrokenBulbs.includes(bulbIndex)) {
            setParallelBrokenBulbs([...parallelBrokenBulbs, bulbIndex]);
            setTeacherMessage(`Bulb ${bulbIndex} broken! ✅ In a parallel circuit, the other bulbs STAY LIT because current can flow through alternate paths. This is why homes use parallel circuits!`);
            toast({ title: '💥 Bulb Broken!', description: 'Other bulbs still working - parallel advantage!' });
        } else {
            setParallelBrokenBulbs(parallelBrokenBulbs.filter(b => b !== bulbIndex));
            setTeacherMessage(`Bulb ${bulbIndex} replaced! All bulbs working again.`);
            toast({ title: '✅ Bulb Replaced', description: 'All bulbs operational' });
        }
    };
    
    const handleBuildSeries = () => {
        setActiveCircuit(0);
        setTeacherMessage("Building series circuit... In a series circuit, all components are connected in a single loop. Current flows through one component after another. Let's add components!");
        
        // Simulate building the circuit
        setTimeout(() => {
            const updated = [...circuits];
            updated[0] = {
                ...updated[0],
                bulbs: 3,
                switches: 1,
                brightness: 100,
                allLit: true
            };
            setCircuits(updated);
            setTeacherMessage("Series circuit complete! Notice: All 3 bulbs are lit, but they're dimmer. 💡 TIP: Click on any bulb to break it and see what happens!");
            setCompletedCircuits(prev => prev + 1);
            setActiveCircuit(null);
            toast({ title: '✅ Series Circuit Built', description: 'Click a bulb to test circuit behavior!' });
        }, 1500);
    };
    
    const handleBuildParallel = () => {
        setActiveCircuit(1);
        setTeacherMessage("Building parallel circuit... In a parallel circuit, components are connected along separate branches. Current can flow through multiple paths. Let's add components!");
        
        // Simulate building the circuit
        setTimeout(() => {
            const updated = [...circuits];
            updated[1] = {
                ...updated[1],
                bulbs: 3,
                switches: 3,
                brightness: 100,
                allLit: true
            };
            setCircuits(updated);
            setTeacherMessage("Parallel circuit complete! Notice: All 3 bulbs are BRIGHTER than in the series circuit because each gets full voltage. 💡 TIP: Click on any bulb to break it and compare with series!");
            setCompletedCircuits(prev => prev + 1);
            setActiveCircuit(null);
            toast({ title: '✅ Parallel Circuit Built', description: '3 bulbs on separate branches' });
        }, 1500);
    };
    
    const handleTeacherComplete = () => {
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null);
            transition();
        }
    };

    const handleViewResults = () => {
        if (completedCircuits < 2) {
            toast({ title: 'Incomplete', description: 'Please build both circuits first', variant: 'destructive' });
            return;
        }
        setTeacherMessage("Excellent! You've built and compared series and parallel circuits. Let's analyze the key differences and why they matter!");
        setPendingTransition(() => () => {
            setCurrentStep('results');
        });
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Let's test your understanding of series and parallel circuits!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
        });
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        if (quizAnswer1 === 'single') correctCount++;
        if (quizAnswer2 === 'brightest') correctCount++;
        if (quizAnswer3 === 'stays') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand circuit configurations! +${earnedXP} XP`);
            setTeacherMessage(
                "Outstanding! ⚡ You've mastered series and parallel circuits! Here's why this knowledge is crucial: " +
                "SERIES circuits have ONE path for current - all components share the same current, like water flowing through " +
                "a single pipe. If one bulb breaks, the circuit opens and ALL bulbs go out. Current: I = I₁ = I₂ = I₃. " +
                "Voltage splits across components: Vtotal = V₁ + V₂ + V₃. This means more bulbs = dimmer light (voltage divides). " +
                "PARALLEL circuits have MULTIPLE paths - current splits at junctions like a river branching into streams. " +
                "If one bulb breaks, others stay lit because current has alternate paths! Each bulb gets full battery voltage, " +
                "so they shine BRIGHTEST. Voltage: V = V₁ = V₂ = V₃. Current splits: Itotal = I₁ + I₂ + I₃. " +
                "Real-world applications: Home wiring uses parallel circuits so turning off one light doesn't affect others! " +
                "Holiday lights are series (one breaks, all go dark - frustrating!). Car headlights are parallel (safety requirement). " +
                "This fundamental principle powers everything from smartphones to power grids. Excellent understanding!"
            );
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Review the differences between series and parallel circuits.`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: series = one loop, parallel = multiple branches.`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setShowSupplies(true);
        setCollectedItems([]);
        setCircuits([
            { name: 'Series Circuit', type: 'series', bulbs: 0, switches: 0, brightness: 0, allLit: false },
            { name: 'Parallel Circuit', type: 'parallel', bulbs: 0, switches: 0, brightness: 0, allLit: false }
        ]);
        setActiveCircuit(null);
        setCircuitActive(false);
        setCompletedCircuits(0);
        setSeriesBrokenBulbs([]);
        setParallelBrokenBulbs([]);
        setQuizAnswer1(undefined);
        setQuizAnswer2(undefined);
        setQuizAnswer3(undefined);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setPendingTransition(null);
        setTeacherMessage("Ready to build circuits again!");
    };

    return (
        <div className="space-y-6 pb-20 relative">
            {/* Premium animated background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-300/20 via-purple-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-300/20 via-violet-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
                emotion={currentStep === 'complete' ? 'celebrating' : completedCircuits >= 2 ? 'happy' : 'explaining'}
                context={{ attempts: completedCircuits, correctStreak: completedCircuits }}
                quickActions={[
                    {
                        label: 'Reset Lab',
                        onClick: () => {
                            setCurrentStep('intro');
                            setCollectedItems([]);
                            setCircuits([
                                { name: 'Series Circuit', type: 'series', bulbs: 0, switches: 0, brightness: 0, allLit: false },
                                { name: 'Parallel Circuit', type: 'parallel', bulbs: 0, switches: 0, brightness: 0, allLit: false }
                            ]);
                            setActiveCircuit(null);
                            setCompletedCircuits(0);
                        },
                        icon: 'refresh'
                    },
                    {
                        label: 'View Theory',
                        onClick: () => {
                            const accordion = document.querySelector('[data-state="closed"]') as HTMLElement;
                            accordion?.click();
                        },
                        icon: 'book'
                    },
                    {
                        label: 'Safety Tips',
                        onClick: () => {
                            const safetyAccordion = document.querySelectorAll('[data-state="closed"]')[1] as HTMLElement;
                            safetyAccordion?.click();
                        },
                        icon: 'shield'
                    }
                ]}
            />

            {isCompleted && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-indigo-950/30 border-2 border-purple-300/50 dark:border-purple-700/50 rounded-xl p-5 backdrop-blur-sm shadow-xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-indigo-400/10 animate-pulse"></div>
                    <div className="relative flex items-center gap-4">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-full shadow-lg">
                            <Trophy className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
                                Lab Completed! 🎉
                            </h3>
                            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                                Completed: {new Date(completion?.completedAt || '').toLocaleDateString()} • 
                                <span className="font-semibold ml-1">Total XP: {completion?.xpEarned || 0}</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {showCelebration && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Card className="w-full max-w-md mx-4 bg-gradient-to-br from-white via-purple-50/50 to-indigo-50/50 dark:from-gray-900 dark:via-purple-950/50 dark:to-indigo-950/50 border-2 border-purple-300/50 dark:border-purple-700/50 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-indigo-400/10 animate-pulse"></div>
                            <CardHeader className="text-center relative z-10">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                    className="flex justify-center mb-4"
                                >
                                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-full shadow-2xl">
                                        <Trophy className="h-16 w-16 text-white" />
                                    </div>
                                </motion.div>
                                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    Congratulations! 🎉
                                </CardTitle>
                                <CardDescription className="text-base mt-2">
                                    You've mastered circuit configurations!
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center space-y-4 relative z-10">
                                <div className="flex items-center justify-center gap-3 text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    <Award className="h-10 w-10 text-yellow-500" />
                                    +{xpEarned} XP
                                </div>
                                <p className="text-sm text-muted-foreground font-medium">
                                    You understand series and parallel circuits!
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            )}

            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-purple-200/30 dark:border-purple-800/30 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/30 dark:to-indigo-950/30 border-b border-purple-200/50 dark:border-purple-800/50">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg">
                            <Zap className="h-6 w-6 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                            Simple Circuits Lab
                        </span>
                    </CardTitle>
                    <CardDescription className="text-base mt-2">Build and compare series and parallel circuits</CardDescription>
                </CardHeader>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-purple-200/30 dark:border-purple-800/30 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/30 dark:to-indigo-950/30 border-b border-purple-200/50 dark:border-purple-800/50">
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        Lab Information
                    </CardTitle>
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
                                <p><strong>Electric Circuits</strong> are closed loops through which electric current flows. There are two main types:</p>
                                <p className="mt-2"><strong>Series Circuits:</strong></p>
                                <ul>
                                    <li>Components connected in a single loop</li>
                                    <li>Current flows through one component after another</li>
                                    <li>Same current through all components</li>
                                    <li>Voltages add up to total voltage</li>
                                    <li>If one component breaks, the circuit breaks (all components stop working)</li>
                                    <li>More resistors = dimmer lights</li>
                                </ul>
                                <p className="mt-2"><strong>Parallel Circuits:</strong></p>
                                <ul>
                                    <li>Components connected on separate branches</li>
                                    <li>Current can flow through multiple paths</li>
                                    <li>Same voltage across all components</li>
                                    <li>Currents add up to total current</li>
                                    <li>If one component breaks, others keep working</li>
                                    <li>More branches = brighter lights overall</li>
                                </ul>
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
                                <ul>
                                    <li>Always disconnect circuits before making changes</li>
                                    <li>Use low voltage sources (batteries, not mains electricity)</li>
                                    <li>Check for loose connections or exposed wires</li>
                                    <li>Don't create short circuits across batteries</li>
                                    <li>Allow bulbs to cool before touching them</li>
                                    <li>Disconnect immediately if wires become hot</li>
                                    <li>Keep circuits away from water</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <AnimatePresence mode="wait">
                {currentStep === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-purple-300/50 dark:border-purple-700/50 shadow-2xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-pink-400/5 to-indigo-400/5"></div>
                            <CardHeader className="relative z-10 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-950/40 dark:to-indigo-950/40 border-b border-purple-200/50 dark:border-purple-800/50">
                                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    Welcome to Simple Circuits Lab! ⚡
                                </CardTitle>
                                <CardDescription className="text-base mt-2">
                                    Learn the difference between series and parallel circuits
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 relative z-10 pt-6">
                                <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-indigo-950/30 p-6 rounded-xl border-2 border-purple-300/50 dark:border-purple-700/50 shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
                                    <div className="relative flex items-start gap-4">
                                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg flex-shrink-0">
                                            <Lightbulb className="w-12 h-12 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
                                                What You'll Learn:
                                            </h3>
                                            <ul className="space-y-2.5 text-sm text-purple-800 dark:text-purple-200">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-purple-600 dark:text-purple-400 font-bold mt-0.5">•</span>
                                                    <span>How to build a series circuit with bulbs in one loop</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-purple-600 dark:text-purple-400 font-bold mt-0.5">•</span>
                                                    <span>How to build a parallel circuit with separate branches</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-purple-600 dark:text-purple-400 font-bold mt-0.5">•</span>
                                                    <span>Why bulbs are brighter/dimmer in different configurations</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-purple-600 dark:text-purple-400 font-bold mt-0.5">•</span>
                                                    <span>Why parallel circuits are used in real buildings</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-purple-600 dark:text-purple-400 font-bold mt-0.5">•</span>
                                                    <span>Understanding current and voltage distribution</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="relative z-10 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/30 dark:to-indigo-950/30 border-t border-purple-200/50 dark:border-purple-800/50">
                                <Button 
                                    onClick={handleStartExperiment} 
                                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold py-6" 
                                    size="lg"
                                >
                                    <Zap className="h-5 w-5 mr-2" />
                                    Start Experiment
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'collect-supplies' && (
                    <LabSupplies
                        supplies={supplies}
                        collectedItems={collectedItems}
                        onCollect={handleCollect}
                        showSupplies={showSupplies}
                        title="Circuit Components - Click to Collect"
                        description="Click on each component in order to collect them for building circuits"
                        requiredCount={supplies.length}
                        onAllCollected={handleAllSuppliesCollected}
                    />
                )}

                {currentStep === 'experiment' && (
                    <motion.div
                        key="experiment"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-purple-300/50 dark:border-purple-700/50 shadow-2xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-indigo-400/5 to-blue-400/5"></div>
                            <CardHeader className="relative z-10 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-950/40 dark:to-indigo-950/40 border-b border-purple-200/50 dark:border-purple-800/50">
                                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                    <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg">
                                        <Lightbulb className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                        Build Circuits
                                    </span>
                                </CardTitle>
                                <CardDescription className="text-base mt-2">
                                    Completed circuits: <span className="font-semibold text-purple-600 dark:text-purple-400">{completedCircuits}/2</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Series Circuit */}
                                <motion.div
                                    className="p-6 rounded-xl border-2 border-blue-300/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-indigo-950/30 backdrop-blur-sm shadow-lg relative overflow-hidden"
                                    whileHover={!circuits[0].allLit ? { scale: 1.02 } : {}}
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                            Series Circuit
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4">All components in one loop - current flows through each one after another</p>
                                        
                                        {!circuits[0].allLit ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <Button 
                                                    onClick={handleBuildSeries} 
                                                    disabled={activeCircuit !== null} 
                                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                                                >
                                                    <Zap className="h-4 w-4 mr-2" />
                                                    Build Series Circuit
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="space-y-4"
                                        >
                                            {/* Visual Circuit Diagram */}
                                            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
                                                {/* Battery at top */}
                                                <div className="flex justify-center mb-4">
                                                    <div className="flex flex-col items-center p-3 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl border-2 border-red-200/50 dark:border-red-800/50">
                                                        <BatteryCharging className="h-10 w-10 text-red-500" />
                                                        <span className="text-xs font-bold mt-1 text-red-600 dark:text-red-400">6V</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Top wire */}
                                                <div className="flex justify-center">
                                                    <div className="h-8 w-0.5 bg-blue-500"></div>
                                                </div>
                                                
                                                {/* Series connection - all bulbs in one line */}
                                                <div className="flex flex-col items-center gap-2">
                                                    {/* Bulb 1 */}
                                                    <motion.div 
                                                        className="flex flex-col items-center cursor-pointer"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleBreakSeriesBulb(1)}
                                                    >
                                                        <motion.div
                                                            animate={seriesBrokenBulbs.length === 0 && !seriesBrokenBulbs.includes(1) ? { opacity: [0.6, 0.9, 0.6] } : {}}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                            className="relative"
                                                        >
                                                            {seriesBrokenBulbs.includes(1) ? (
                                                                <>
                                                                    <Lightbulb className="h-14 w-14 text-gray-400 fill-gray-300" />
                                                                    <XCircle className="h-6 w-6 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                                                </>
                                                            ) : seriesBrokenBulbs.length > 0 ? (
                                                                <Lightbulb className="h-14 w-14 text-gray-400 fill-gray-300" />
                                                            ) : (
                                                                <>
                                                                    <Lightbulb className="h-14 w-14 text-yellow-400 fill-yellow-200" />
                                                                    <div className="absolute inset-0 bg-yellow-300 blur-xl opacity-40 rounded-full"></div>
                                                                </>
                                                            )}
                                                        </motion.div>
                                                        <span className="text-xs font-medium">{seriesBrokenBulbs.includes(1) ? 'Bulb 1 (Broken)' : seriesBrokenBulbs.length > 0 ? 'Bulb 1 (Off)' : 'Bulb 1 (Dim)'}</span>
                                                        <span className="text-xs text-muted-foreground">Click to {seriesBrokenBulbs.includes(1) ? 'fix' : 'break'}</span>
                                                    </motion.div>
                                                    
                                                    {/* Wire between */}
                                                    <div className={cn("h-6 w-0.5", seriesBrokenBulbs.length > 0 ? "bg-gray-400" : "bg-blue-500")}></div>
                                                    
                                                    {/* Bulb 2 */}
                                                    <motion.div 
                                                        className="flex flex-col items-center cursor-pointer"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleBreakSeriesBulb(2)}
                                                    >
                                                        <motion.div
                                                            animate={seriesBrokenBulbs.length === 0 && !seriesBrokenBulbs.includes(2) ? { opacity: [0.6, 0.9, 0.6] } : {}}
                                                            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                                                            className="relative"
                                                        >
                                                            {seriesBrokenBulbs.includes(2) ? (
                                                                <>
                                                                    <Lightbulb className="h-14 w-14 text-gray-400 fill-gray-300" />
                                                                    <XCircle className="h-6 w-6 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                                                </>
                                                            ) : seriesBrokenBulbs.length > 0 ? (
                                                                <Lightbulb className="h-14 w-14 text-gray-400 fill-gray-300" />
                                                            ) : (
                                                                <>
                                                                    <Lightbulb className="h-14 w-14 text-yellow-400 fill-yellow-200" />
                                                                    <div className="absolute inset-0 bg-yellow-300 blur-xl opacity-40 rounded-full"></div>
                                                                </>
                                                            )}
                                                        </motion.div>
                                                        <span className="text-xs font-medium">{seriesBrokenBulbs.includes(2) ? 'Bulb 2 (Broken)' : seriesBrokenBulbs.length > 0 ? 'Bulb 2 (Off)' : 'Bulb 2 (Dim)'}</span>
                                                        <span className="text-xs text-muted-foreground">Click to {seriesBrokenBulbs.includes(2) ? 'fix' : 'break'}</span>
                                                    </motion.div>
                                                    
                                                    {/* Wire between */}
                                                    <div className={cn("h-6 w-0.5", seriesBrokenBulbs.length > 0 ? "bg-gray-400" : "bg-blue-500")}></div>
                                                    
                                                    {/* Bulb 3 */}
                                                    <motion.div 
                                                        className="flex flex-col items-center cursor-pointer"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleBreakSeriesBulb(3)}
                                                    >
                                                        <motion.div
                                                            animate={seriesBrokenBulbs.length === 0 && !seriesBrokenBulbs.includes(3) ? { opacity: [0.6, 0.9, 0.6] } : {}}
                                                            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                                                            className="relative"
                                                        >
                                                            {seriesBrokenBulbs.includes(3) ? (
                                                                <>
                                                                    <Lightbulb className="h-14 w-14 text-gray-400 fill-gray-300" />
                                                                    <XCircle className="h-6 w-6 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                                                </>
                                                            ) : seriesBrokenBulbs.length > 0 ? (
                                                                <Lightbulb className="h-14 w-14 text-gray-400 fill-gray-300" />
                                                            ) : (
                                                                <>
                                                                    <Lightbulb className="h-14 w-14 text-yellow-400 fill-yellow-200" />
                                                                    <div className="absolute inset-0 bg-yellow-300 blur-xl opacity-40 rounded-full"></div>
                                                                </>
                                                            )}
                                                        </motion.div>
                                                        <span className="text-xs font-medium">{seriesBrokenBulbs.includes(3) ? 'Bulb 3 (Broken)' : seriesBrokenBulbs.length > 0 ? 'Bulb 3 (Off)' : 'Bulb 3 (Dim)'}</span>
                                                        <span className="text-xs text-muted-foreground">Click to {seriesBrokenBulbs.includes(3) ? 'fix' : 'break'}</span>
                                                    </motion.div>
                                                </div>
                                                
                                                {/* Bottom wire back to battery */}
                                                <div className="flex justify-center mt-2">
                                                    <div className={cn("h-8 w-0.5", seriesBrokenBulbs.length > 0 ? "bg-gray-400" : "bg-blue-500")}></div>
                                                </div>
                                                
                                                {/* Current flow indicator */}
                                                <div className="flex items-center justify-center gap-2 mt-4 text-xs">
                                                    <CircleDot className={cn("h-4 w-4", seriesBrokenBulbs.length > 0 ? "text-gray-400" : "text-blue-500")} />
                                                    <span className={cn("font-medium", seriesBrokenBulbs.length > 0 ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400")}>
                                                        {seriesBrokenBulbs.length > 0 ? "⚠️ Circuit broken! No current flows" : "Current flows through each bulb sequentially"}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className={cn("p-4 rounded-xl text-sm font-bold text-center shadow-lg border-2", 
                                                seriesBrokenBulbs.length > 0 
                                                    ? "bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 text-red-900 dark:text-red-100 border-red-300/50 dark:border-red-700/50" 
                                                    : "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-900 dark:text-green-100 border-green-300/50 dark:border-green-700/50"
                                            )}>
                                                {seriesBrokenBulbs.length > 0 
                                                    ? "🔴 Circuit interrupted! All bulbs are off because there's no complete path." 
                                                    : "✅ Series circuit built! All bulbs share the voltage (2V each)"}
                                            </div>
                                        </motion.div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Parallel Circuit */}
                                <motion.div
                                    className="p-6 rounded-xl border-2 border-green-300/50 dark:border-green-700/50 bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-teal-50/80 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 backdrop-blur-sm shadow-lg relative overflow-hidden"
                                    whileHover={!circuits[1].allLit ? { scale: 1.02 } : {}}
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-2xl"></div>
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                            Parallel Circuit
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4">Components on separate branches - current can flow through multiple paths</p>
                                        
                                        {!circuits[1].allLit ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <Button 
                                                    onClick={handleBuildParallel} 
                                                    disabled={activeCircuit !== null} 
                                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                                                >
                                                    <Zap className="h-4 w-4 mr-2" />
                                                    Build Parallel Circuit
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="space-y-4"
                                            >
                                                {/* Visual Circuit Diagram */}
                                                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm">
                                                    {/* Battery at top */}
                                                    <div className="flex justify-center mb-4">
                                                        <div className="flex flex-col items-center p-3 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl border-2 border-red-200/50 dark:border-red-800/50">
                                                            <BatteryCharging className="h-10 w-10 text-red-500" />
                                                            <span className="text-xs font-bold mt-1 text-red-600 dark:text-red-400">6V</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Junction point (positive) */}
                                                    <div className="flex justify-center">
                                                        <div className="w-48 h-0.5 bg-blue-500"></div>
                                                    </div>
                                                    
                                                    {/* Three parallel branches */}
                                                    <div className="flex justify-center gap-8 mt-2">
                                                    {/* Branch 1 */}
                                                    <motion.div 
                                                        className="flex flex-col items-center gap-2 cursor-pointer"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleBreakParallelBulb(1)}
                                                    >
                                                        <div className={cn("h-6 w-0.5", parallelBrokenBulbs.includes(1) ? "bg-gray-400" : "bg-blue-500")}></div>
                                                        <motion.div
                                                            animate={!parallelBrokenBulbs.includes(1) ? { opacity: [0.9, 1, 0.9] } : {}}
                                                            transition={{ duration: 1.5, repeat: Infinity }}
                                                            className="relative"
                                                        >
                                                            {parallelBrokenBulbs.includes(1) ? (
                                                                <>
                                                                    <Lightbulb className="h-14 w-14 text-gray-400 fill-gray-300" />
                                                                    <XCircle className="h-6 w-6 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Lightbulb className="h-14 w-14 text-yellow-500 fill-yellow-300" />
                                                                    <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-60 rounded-full"></div>
                                                                </>
                                                            )}
                                                        </motion.div>
                                                        <span className="text-xs font-medium">{parallelBrokenBulbs.includes(1) ? 'Bulb 1 (Broken)' : 'Bulb 1 (Bright)'}</span>
                                                        <span className="text-xs text-muted-foreground">Click to {parallelBrokenBulbs.includes(1) ? 'fix' : 'break'}</span>
                                                        <div className={cn("h-6 w-0.5", parallelBrokenBulbs.includes(1) ? "bg-gray-400" : "bg-blue-500")}></div>
                                                    </motion.div>
                                                    
                                                    {/* Branch 2 */}
                                                    <motion.div 
                                                        className="flex flex-col items-center gap-2 cursor-pointer"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleBreakParallelBulb(2)}
                                                    >
                                                        <div className={cn("h-6 w-0.5", parallelBrokenBulbs.includes(2) ? "bg-gray-400" : "bg-blue-500")}></div>
                                                        <motion.div
                                                            animate={!parallelBrokenBulbs.includes(2) ? { opacity: [0.9, 1, 0.9] } : {}}
                                                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                                                            className="relative"
                                                        >
                                                            {parallelBrokenBulbs.includes(2) ? (
                                                                <>
                                                                    <Lightbulb className="h-14 w-14 text-gray-400 fill-gray-300" />
                                                                    <XCircle className="h-6 w-6 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Lightbulb className="h-14 w-14 text-yellow-500 fill-yellow-300" />
                                                                    <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-60 rounded-full"></div>
                                                                </>
                                                            )}
                                                        </motion.div>
                                                        <span className="text-xs font-medium">{parallelBrokenBulbs.includes(2) ? 'Bulb 2 (Broken)' : 'Bulb 2 (Bright)'}</span>
                                                        <span className="text-xs text-muted-foreground">Click to {parallelBrokenBulbs.includes(2) ? 'fix' : 'break'}</span>
                                                        <div className={cn("h-6 w-0.5", parallelBrokenBulbs.includes(2) ? "bg-gray-400" : "bg-blue-500")}></div>
                                                    </motion.div>
                                                    
                                                    {/* Branch 3 */}
                                                    <motion.div 
                                                        className="flex flex-col items-center gap-2 cursor-pointer"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleBreakParallelBulb(3)}
                                                    >
                                                        <div className={cn("h-6 w-0.5", parallelBrokenBulbs.includes(3) ? "bg-gray-400" : "bg-blue-500")}></div>
                                                        <motion.div
                                                            animate={!parallelBrokenBulbs.includes(3) ? { opacity: [0.9, 1, 0.9] } : {}}
                                                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                                                            className="relative"
                                                        >
                                                            {parallelBrokenBulbs.includes(3) ? (
                                                                <>
                                                                    <Lightbulb className="h-14 w-14 text-gray-400 fill-gray-300" />
                                                                    <XCircle className="h-6 w-6 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Lightbulb className="h-14 w-14 text-yellow-500 fill-yellow-300" />
                                                                    <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-60 rounded-full"></div>
                                                                </>
                                                            )}
                                                        </motion.div>
                                                        <span className="text-xs font-medium">{parallelBrokenBulbs.includes(3) ? 'Bulb 3 (Broken)' : 'Bulb 3 (Bright)'}</span>
                                                        <span className="text-xs text-muted-foreground">Click to {parallelBrokenBulbs.includes(3) ? 'fix' : 'break'}</span>
                                                        <div className={cn("h-6 w-0.5", parallelBrokenBulbs.includes(3) ? "bg-gray-400" : "bg-blue-500")}></div>
                                                    </motion.div>
                                                </div>
                                                
                                                {/* Junction point (negative) */}
                                                <div className="flex justify-center">
                                                    <div className="w-48 h-0.5 bg-blue-500"></div>
                                                </div>
                                                
                                                {/* Current flow indicator */}
                                                <div className="flex items-center justify-center gap-2 mt-4 text-xs">
                                                    <CircleDot className="h-4 w-4 text-blue-500" />
                                                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                        {parallelBrokenBulbs.length === 3 
                                                            ? "All bulbs broken - no current flows" 
                                                            : parallelBrokenBulbs.length > 0 
                                                                ? `Working bulbs still get full voltage via ${3 - parallelBrokenBulbs.length} active path(s)` 
                                                                : "Current splits into 3 paths - each bulb gets full voltage"}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className={cn("p-4 rounded-xl text-sm font-bold text-center shadow-lg border-2",
                                                parallelBrokenBulbs.length === 3
                                                    ? "bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 text-red-900 dark:text-red-100 border-red-300/50 dark:border-red-700/50"
                                                    : parallelBrokenBulbs.length > 0
                                                        ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-900 dark:text-green-100 border-green-300/50 dark:border-green-700/50"
                                                        : "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-900 dark:text-green-100 border-green-300/50 dark:border-green-700/50"
                                            )}>
                                                {parallelBrokenBulbs.length === 3
                                                    ? "🔴 All bulbs broken - complete failure"
                                                    : parallelBrokenBulbs.length > 0
                                                        ? `✅ ${3 - parallelBrokenBulbs.length} bulb(s) still working! Other paths keep circuit alive.`
                                                        : "✅ Parallel circuit built! Each bulb gets full 6V independently"}
                                            </div>
                                        </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            </CardContent>
                            <CardFooter className="relative z-10 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/30 dark:to-indigo-950/30 border-t border-purple-200/50 dark:border-purple-800/50">
                                <Button 
                                    onClick={handleViewResults} 
                                    disabled={completedCircuits < 2} 
                                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold" 
                                    size="lg"
                                >
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    View Results ({completedCircuits}/2 circuits)
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'results' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-purple-300/50 dark:border-purple-700/50 shadow-2xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-pink-400/5 to-indigo-400/5"></div>
                            <CardHeader className="relative z-10 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-950/40 dark:to-indigo-950/40 border-b border-purple-200/50 dark:border-purple-800/50">
                                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                    <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                        Circuit Comparison & Analysis
                                    </span>
                                </CardTitle>
                                <CardDescription className="text-base mt-2">Key differences between circuit types</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 relative z-10 pt-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Series */}
                                    <div className="p-5 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-2 border-blue-300/50 dark:border-blue-700/50 rounded-xl shadow-lg backdrop-blur-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl"></div>
                                        <div className="relative z-10">
                                            <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Series Circuit</h3>
                                        <ul className="text-sm space-y-2 text-blue-800 dark:text-blue-200">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                                <span>One loop for current</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                                <span>Same current everywhere</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                                <span>Bulbs are dimmer</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <XCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                                <span>If one breaks, all stop</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                                <span>Voltage divides</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Parallel */}
                                    <div className="p-5 bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-teal-50/80 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-2 border-green-300/50 dark:border-green-700/50 rounded-xl shadow-lg backdrop-blur-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-2xl"></div>
                                        <div className="relative z-10">
                                            <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">Parallel Circuit</h3>
                                        <ul className="text-sm space-y-2 text-green-800 dark:text-green-200">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                                <span>Multiple branches</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                                <span>Current splits at junctions</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                                <span>Bulbs are brighter</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                                <span>If one breaks, others work</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                                <span>Same voltage everywhere</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-indigo-50/80 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-indigo-950/30 p-6 rounded-xl border-2 border-purple-300/50 dark:border-purple-700/50 shadow-lg backdrop-blur-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Real-World Applications:</h3>
                                    <ul className="text-sm space-y-2">
                                        <li>• <strong>Home Wiring:</strong> Parallel circuits - each outlet has full voltage, and one broken circuit doesn't affect others</li>
                                        <li>• <strong>Holiday Lights:</strong> Series strings vs parallel lights explain why old strings went dark when one broke</li>
                                        <li>• <strong>Battery-Powered Devices:</strong> Batteries in series add voltage; parallel adds capacity</li>
                                        <li>• <strong>Car Lights:</strong> Parallel circuits ensure all lights stay on if one fails</li>
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter className="relative z-10 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/30 dark:to-indigo-950/30 border-t border-purple-200/50 dark:border-purple-800/50">
                                <Button 
                                    onClick={handleViewQuiz} 
                                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold" 
                                    size="lg"
                                >
                                    <BookOpen className="h-5 w-5 mr-2" />
                                    Take the Quiz
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'quiz' && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-purple-300/50 dark:border-purple-700/50 shadow-2xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-pink-400/5 to-indigo-400/5"></div>
                            <CardHeader className="relative z-10 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-950/40 dark:to-indigo-950/40 border-b border-purple-200/50 dark:border-purple-800/50">
                                <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    Knowledge Check 📝
                                </CardTitle>
                                <CardDescription className="text-base mt-2">Test your understanding of circuits</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3 relative z-10">
                                    <p className="font-bold text-base bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                        1. In a series circuit, how is current distributed?
                                    </p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'single', label: 'All current flows through each component in one path', isCorrect: true },
                                            { value: 'split', label: 'Current splits into different branches' },
                                            { value: 'variable', label: 'Current changes at each component' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer1(option.value)}
                                                className={cn(
                                                    "p-4 rounded-xl border-2 cursor-pointer transition-all shadow-md hover:shadow-lg",
                                                    quizAnswer1 === option.value && !quizSubmitted && "border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 shadow-lg",
                                                    quizAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 shadow-lg",
                                                    quizAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 shadow-lg",
                                                    quizAnswer1 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/20"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer1 === option.value && !quizSubmitted && "border-purple-500 bg-purple-500",
                                                        quizAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-500",
                                                        quizAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-500",
                                                        quizAnswer1 !== option.value && "border-gray-300"
                                                    )}>
                                                        {quizAnswer1 === option.value && (
                                                            <div className="w-2 h-2 bg-white rounded-full" />
                                                        )}
                                                    </div>
                                                    <span>{option.label}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Question 2 */}
                                <div className="space-y-3 relative z-10">
                                    <p className="font-bold text-base bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                        2. In a parallel circuit, which bulbs are brightest?
                                    </p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'brightest', label: 'All bulbs are bright and equal', isCorrect: true },
                                            { value: 'first', label: 'The first bulb is brightest' },
                                            { value: 'dimmer', label: 'All bulbs are dimmer than in series' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer2(option.value)}
                                                className={cn(
                                                    "p-4 rounded-xl border-2 cursor-pointer transition-all shadow-md hover:shadow-lg",
                                                    quizAnswer2 === option.value && !quizSubmitted && "border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 shadow-lg",
                                                    quizAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 shadow-lg",
                                                    quizAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 shadow-lg",
                                                    quizAnswer2 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/20"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer2 === option.value && !quizSubmitted && "border-purple-500 bg-purple-500",
                                                        quizAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-500",
                                                        quizAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-500",
                                                        quizAnswer2 !== option.value && "border-gray-300"
                                                    )}>
                                                        {quizAnswer2 === option.value && (
                                                            <div className="w-2 h-2 bg-white rounded-full" />
                                                        )}
                                                    </div>
                                                    <span>{option.label}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Question 3 */}
                                <div className="space-y-3 relative z-10">
                                    <p className="font-bold text-base bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                        3. If one bulb breaks in a parallel circuit, what happens?
                                    </p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'stays', label: 'Other bulbs stay lit - current finds alternate paths', isCorrect: true },
                                            { value: 'alloff', label: 'All bulbs go out' },
                                            { value: 'dimmer', label: 'Other bulbs become dimmer' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer3(option.value)}
                                                className={cn(
                                                    "p-4 rounded-xl border-2 cursor-pointer transition-all shadow-md hover:shadow-lg",
                                                    quizAnswer3 === option.value && !quizSubmitted && "border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 shadow-lg",
                                                    quizAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 shadow-lg",
                                                    quizAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 shadow-lg",
                                                    quizAnswer3 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/50 dark:hover:bg-purple-950/20"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer3 === option.value && !quizSubmitted && "border-purple-500 bg-purple-500",
                                                        quizAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-500",
                                                        quizAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-500",
                                                        quizAnswer3 !== option.value && "border-gray-300"
                                                    )}>
                                                        {quizAnswer3 === option.value && (
                                                            <div className="w-2 h-2 bg-white rounded-full" />
                                                        )}
                                                    </div>
                                                    <span>{option.label}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {quizFeedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "p-5 rounded-xl border-2 shadow-lg font-semibold relative overflow-hidden",
                                            quizFeedback.includes('Perfect') || quizFeedback.includes('all 3') ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-300/50 dark:border-green-700/50 text-green-900 dark:text-green-100" :
                                            quizFeedback.includes('Good') ? "bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-purple-300/50 dark:border-purple-700/50 text-purple-900 dark:text-purple-100" :
                                            "bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-purple-300/50 dark:border-purple-700/50 text-purple-900 dark:text-purple-100"
                                        )}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                        <div className="relative z-10">{quizFeedback}</div>
                                    </motion.div>
                                )}
                            </CardContent>
                            <CardFooter className="relative z-10 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/30 dark:to-indigo-950/30 border-t border-purple-200/50 dark:border-purple-800/50 flex gap-3">
                                <Button 
                                    onClick={handleQuizSubmit} 
                                    disabled={!quizAnswer1 || !quizAnswer2 || !quizAnswer3 || quizSubmitted}
                                    className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                                    size="lg"
                                >
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    Submit Answers
                                </Button>
                                {quizSubmitted && !quizFeedback.includes('all 3') && (
                                    <Button 
                                        onClick={() => {
                                            setQuizAnswer1(undefined);
                                            setQuizAnswer2(undefined);
                                            setQuizAnswer3(undefined);
                                            setQuizFeedback('');
                                            setQuizSubmitted(false);
                                        }} 
                                        variant="outline" 
                                        className="border-2 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30 font-semibold"
                                        size="lg"
                                    >
                                        <RefreshCw className="h-5 w-5 mr-2" />
                                        Try Again
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-purple-200 dark:border-purple-800">
                            <CardHeader className="text-center">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="flex justify-center mb-4"
                                >
                                    <Trophy className="h-16 w-16 text-yellow-500" />
                                </motion.div>
                                <CardTitle>Lab Complete!</CardTitle>
                                <CardDescription>You've mastered circuit configurations!</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>How series circuits work and their limitations</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>How parallel circuits work and their advantages</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>Why homes use parallel wiring</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>Current and voltage distribution in circuits</span>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleRestart} variant="outline" className="w-full" size="lg">
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
