'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Trophy, Award, GripVertical, Sparkles, Flame, Droplets, Wind, Beaker } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { LabSupplies, SupplyItem } from './LabSupplies';

type Step = 'intro' | 'collect-supplies' | 'experiment' | 'results' | 'quiz' | 'complete';

interface TubeResult {
    collected: boolean;
    observed: boolean;
    rusted: boolean;
}

export function RustingLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [collectedSupplies, setCollectedSupplies] = React.useState<string[]>([]);
    
    const labSupplies: SupplyItem[] = [
        { id: 'nails', name: 'Iron Nails', emoji: '🔩', description: 'Test specimens for rusting' },
        { id: 'water', name: 'Water', emoji: '💧', description: 'One condition for rusting' },
        { id: 'oil', name: 'Oil Layer', emoji: '🛢️', description: 'To exclude oxygen' },
        { id: 'drying-agent', name: 'Drying Agent', emoji: '🧪', description: 'To remove moisture' },
    ];
    
    // Experiment state
    const [tubeResults, setTubeResults] = React.useState<Record<string, TubeResult>>({
        A: { collected: false, observed: false, rusted: false },
        B: { collected: false, observed: false, rusted: false },
        C: { collected: false, observed: false, rusted: false }
    });
    const [activeSimulation, setActiveSimulation] = React.useState<string | null>(null);
    const [simulationDay, setSimulationDay] = React.useState(0);
    const [completedTubes, setCompletedTubes] = React.useState(0);
    
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
    const labId = 'rusting-of-iron';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);
    const allSuppliesNotifiedRef = React.useRef(false);

    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to Rusting of Iron Lab! Rust is the common oxidation of iron that requires both water and oxygen. We'll test three different conditions to see what's needed for rust to form. Let's gather our supplies!");
        } else if (currentStep === 'complete') {
            setTeacherMessage("Congratulations on completing the Rusting of Iron Lab! You've learned one of chemistry's most important real-world processes. This knowledge helps us protect valuable materials and infrastructure. Keep up the excellent work, and feel free to restart the lab anytime to review!");
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setTeacherMessage("Great! Let's gather our supplies. Click on each item to collect them for your experiment!");
        setCurrentStep('collect-supplies');
    };

    const handleCollectSupply = (itemId: string) => {
        if (!collectedSupplies.includes(itemId)) {
            setCollectedSupplies(prev => {
                const newCollected = [...prev, itemId];
                if (newCollected.length === labSupplies.length) {
                    setTeacherMessage("Perfect! All supplies collected! Now let's start the experiment. Click 'Continue to Experiment' to begin!");
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
        setTeacherMessage("Perfect! All supplies collected! Now let's start the experiment. Click 'Continue to Experiment' to begin!");
}, [toast]);

    const handleContinueToExperiment = () => {
        setCurrentStep('experiment');
        setTeacherMessage("All supplies ready! Now we'll set up three different tubes to test what causes rusting. Let's discover which conditions allow rust to form!");
        allSuppliesNotifiedRef.current = false;
    };
    
    const handleSetupTube = (tubeId: string, conditions: string) => {
        if (activeSimulation) return;
        
        setActiveSimulation(tubeId);
        
        // Initial setup message
        if (tubeId === 'A') {
            setTeacherMessage(`Setting up Tube A - the control tube. We're placing an iron nail in water with air exposure. Both water and oxygen are present, so let's observe what happens over time...`);
        } else if (tubeId === 'B') {
            setTeacherMessage(`Setting up Tube B with boiled water and an oil layer on top. The oil will prevent oxygen from reaching the water. Let's see if rust forms without oxygen...`);
        } else {
            setTeacherMessage(`Setting up Tube C with a drying agent (calcium chloride). This will remove moisture from the air, leaving only oxygen. Can rust form without water?`);
        }
        
        // Wait for initial message to complete, then start experiment
        setTimeout(() => {
            setTubeResults(prev => ({
                ...prev,
                [tubeId]: { ...prev[tubeId], collected: true }
            }));
            
            setTeacherMessage(`Tube ${tubeId} is now set up. We're monitoring the nail over several days. Oxidation is a gradual process - watch carefully for any color changes...`);
            
            // Start simulation after setup message
            setTimeout(() => {
                let day = 0;
                const dayInterval = setInterval(() => {
                    day++;
                    setSimulationDay(day);
                    
                    // Progressive observations with proper timing
                    if (day === 2) {
                        if (tubeId === 'A') {
                            setTeacherMessage(`Day ${day}: I'm starting to notice some changes in Tube A. The surface of the nail looks slightly different...`);
                        } else {
                            setTeacherMessage(`Day ${day}: So far, the nail in Tube ${tubeId} appears unchanged. No visible oxidation yet.`);
                        }
                    } else if (day === 4) {
                        if (tubeId === 'A') {
                            setTeacherMessage(`Day ${day}: The changes are becoming more obvious in Tube A! The nail is definitely changing color as oxidation occurs.`);
                        } else {
                            setTeacherMessage(`Day ${day}: Still no rust formation in Tube ${tubeId}. The nail remains in its original condition.`);
                        }
                    }
                    
                    if (day >= 5) {
                        clearInterval(dayInterval);
                        
                        // Determine rusting result
                        const shouldRust = tubeId === 'A'; // Only Tube A has both water and oxygen
                        setTubeResults(prev => ({
                            ...prev,
                            [tubeId]: { ...prev[tubeId], observed: true, rusted: shouldRust }
                        }));
                        
                        setActiveSimulation(null);
                        setSimulationDay(0);
                        setCompletedTubes(prev => prev + 1);
                        
                        // Final observation with delay for smooth transition
                        setTimeout(() => {
                            if (shouldRust) {
                                toast({ title: `✅ Tube ${tubeId}: Rust Observed!` });
                                setTeacherMessage(`Excellent observation! Tube A shows clear rust formation - that reddish-brown coating is iron oxide. This proves that rust needs BOTH water and oxygen. The iron atoms combined with oxygen in the presence of water to form Fe₂O₃·nH₂O.`);
                            } else {
                                toast({ title: `✅ Tube ${tubeId}: No Rust` });
                                if (tubeId === 'B') {
                                    setTeacherMessage(`Perfect! Tube B shows no rusting at all. Even though water was present, the oil layer blocked oxygen from reaching the nail. This proves that oxygen is essential for rust formation.`);
                                } else {
                                    setTeacherMessage(`Exactly as expected! Tube C shows no rust formation. Even with oxygen present, the drying agent removed all moisture. This proves that water is essential for the rusting process.`);
                                }
                            }
                        }, 1000);
                    }
                }, 3500);
            }, 4500);
        }, 5000);
    };
    
    const handleTeacherComplete = () => {
        // Direct state updates - no pending transitions
    };

    const handleViewResults = () => {
        if (completedTubes < 3) {
            toast({ title: 'Incomplete', description: 'Please complete all three tubes first', variant: 'destructive' });
            return;
        }
        setTeacherMessage("Excellent! You've tested all three conditions. The results show that rust only forms when BOTH water AND oxygen are present. Now let's test your understanding!");
        setCurrentStep('results');
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Let's test your understanding of rusting and corrosion!");
        // Transition to quiz after showing results - give students time to observe
        setTimeout(() => {
            setCurrentStep('quiz');
        }, 25000); // 25 seconds to allow teacher to finish explaining
    };

    const handleQuizSubmit = () => {
        // If already correct, don't allow resubmission
        if (quizSubmitted && quizFeedback.includes('all 3')) return;
        
        // If wrong and showing answers, allow retry by resetting
        if (quizSubmitted && !quizFeedback.includes('all 3')) {
            setQuizAnswer1(undefined);
            setQuizAnswer2(undefined);
            setQuizAnswer3(undefined);
            setQuizFeedback('');
            setQuizSubmitted(false);
            return;
        }
        
        let correctCount = 0;
        if (quizAnswer1 === 'both') correctCount++;
        if (quizAnswer2 === 'oxygen') correctCount++;
        if (quizAnswer3 === 'oil') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand rust formation! +${earnedXP} XP`);
            setTeacherMessage(`Outstanding work! You answered all three questions correctly! You truly understand the rusting process and the conditions needed for oxidation. You've earned ${earnedXP} XP! This knowledge will help you understand corrosion in real life - from protecting cars to maintaining bridges. Well done, scientist!`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Rust requires specific conditions.`);
            setTeacherMessage(`Good effort! You got ${correctCount} out of 3 correct. You're very close to mastering this! Remember, rust formation requires BOTH water AND oxygen working together. Review the tube results and try again - you can do this!`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: rust needs BOTH water and oxygen.`);
            setTeacherMessage(`Don't worry - learning takes practice! You got ${correctCount} out of 3. The key concept is that rust needs BOTH conditions: water AND oxygen. Look back at Tube A (rusted) versus Tubes B and C (no rust). Each tube was missing one condition. Take your time, review the results, and try again!`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setCollectedSupplies([]);
        setTubeResults({
            A: { collected: false, observed: false, rusted: false },
            B: { collected: false, observed: false, rusted: false },
            C: { collected: false, observed: false, rusted: false }
        });
        setActiveSimulation(null);
        setSimulationDay(0);
        setCompletedTubes(0);
        setQuizAnswer1(undefined);
        setQuizAnswer2(undefined);
        setQuizAnswer3(undefined);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setTeacherMessage("Great! Let's explore the rusting process again. Repetition is an excellent way to reinforce your understanding. Notice how each tube teaches us something different about the conditions needed for oxidation. Ready when you are!");
        allSuppliesNotifiedRef.current = false;
    };

    return (
        <div className="relative min-h-screen pb-20">
            {/* Premium Animated Background - Orange/Red Rusting Theme */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 dark:from-orange-950/30 dark:via-red-950/30 dark:to-amber-950/30" />
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-orange-200/40 to-red-300/40 dark:from-orange-800/20 dark:to-red-900/20 blur-3xl"
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
            {/* Teacher Voice */}
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
            />

            {currentStep === 'intro' && isCompleted && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full">
                            <Trophy className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-orange-900 dark:text-orange-100">Lab Completed!</h3>
                            <p className="text-sm text-orange-700 dark:text-orange-300">
                                Completed: {new Date(completion?.completedAt || '').toLocaleDateString()} • 
                                Total XP: {completion?.xpEarned || 0}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Flame className="h-5 w-5 text-orange-600" />
                                Rusting of Iron Lab
                            </CardTitle>
                            <CardDescription>Investigate the conditions necessary for iron to rust</CardDescription>
                        </CardHeader>
                    </Card>
                </motion.div>

                <Card className="border-2 border-cyan-200/50 dark:border-cyan-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle>Lab Information</CardTitle>
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
                                <p><strong>Rusting</strong> is the oxidation of iron and its alloys (like steel), forming iron oxide compounds. It's a chemical process that requires specific conditions.</p>
                                <p className="mt-2"><strong>Necessary Conditions for Rusting:</strong></p>
                                <ul>
                                    <li><strong>Oxygen (O₂):</strong> From air - rusting cannot occur in its absence</li>
                                    <li><strong>Water (H₂O):</strong> Acts as an electrolyte, enabling electron transfer</li>
                                    <li><strong>Time:</strong> Oxidation is gradual, requiring days or weeks</li>
                                </ul>
                                <p className="mt-2"><strong>The Rusting Process:</strong></p>
                                <p className="font-mono bg-slate-100 dark:bg-slate-900 p-2 rounded">4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃ (rust)</p>
                                <p className="mt-2"><strong>Prevention Methods:</strong></p>
                                <ul>
                                    <li>Applying oil or paint layers to exclude oxygen</li>
                                    <li>Using protective coatings (galvanizing, plating)</li>
                                    <li>Removing moisture through drying</li>
                                    <li>Using alloys like stainless steel that resist corrosion</li>
                                </ul>
                                <p className="mt-2"><strong>Real-world Impact:</strong></p>
                                <ul>
                                    <li>Costs billions annually in infrastructure maintenance</li>
                                    <li>Affects vehicles, bridges, pipelines, ships, and tools</li>
                                    <li>Environmental impact from corrosion control chemicals</li>
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
                                    <li>Handle iron nails carefully - avoid puncture wounds</li>
                                    <li>Wear safety goggles when handling containers</li>
                                    <li>Be cautious with boiling water - risk of burns</li>
                                    <li>Anhydrous calcium chloride (drying agent) should not contact skin or eyes</li>
                                    <li>Handle oil carefully to avoid spills</li>
                                    <li>Work in a well-ventilated area</li>
                                    <li>Wash hands thoroughly after handling all materials</li>
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
                        <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle>Welcome to Rusting of Iron Lab!</CardTitle>
                                <CardDescription>Discover what conditions cause iron to rust</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-6 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                        <Flame className="w-16 h-16 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-orange-900 dark:text-orange-100">What You'll Learn:</h3>
                                            <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
                                                <li>• The conditions necessary for rusting (oxygen and water)</li>
                                                <li>• How to prevent corrosion through various methods</li>
                                                <li>• The chemistry of oxidation reactions</li>
                                                <li>• Real-world applications and costs of rust</li>
                                                <li>• Experimental design and observation techniques</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleStartExperiment} 
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg" 
                                    size="lg"
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Start Experiment
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'collect-supplies' && (
                    <motion.div
                        key="collect-supplies"
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
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg" 
                                    size="lg"
                                >
                                    Continue to Experiment
                                </Button>
                            </CardFooter>
                        )}
                    </motion.div>
                )}

                {currentStep === 'experiment' && (
                    <motion.div
                        key="experiment"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Beaker className="h-5 w-5 text-orange-600" />
                                    Set Up Test Tubes
                                </CardTitle>
                                <CardDescription>Completed tubes: {completedTubes}/3</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Tube A */}
                                <motion.div
                                    className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/30"
                                    whileHover={!tubeResults.A.observed ? { scale: 1.02 } : {}}
                                >
                                    <h3 className="font-semibold mb-2">Tube A: Water + Oxygen (CONTROL)</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Iron nail in water, exposed to air - both water and oxygen present</p>
                                    
                                    {/* Visual Diagram for Tube A */}
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="relative w-32 h-64 bg-gradient-to-b from-transparent via-sky-100/40 to-sky-200/60 border-4 border-gray-600 rounded-b-3xl shadow-lg">
                                            {/* Air space */}
                                            <div className="absolute top-0 left-0 right-0 h-20 flex items-center justify-center">
                                                <div className="flex gap-1">
                                                    <Wind className="h-4 w-4 text-blue-300 animate-pulse" />
                                                    <span className="text-xs text-blue-600 font-medium">O₂</span>
                                                </div>
                                            </div>
                                            {/* Water */}
                                            <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-b from-blue-200/70 to-blue-400/70 rounded-b-3xl">
                                                <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                                                    <Droplets className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <span className="absolute top-10 left-1/2 transform -translate-x-1/2 text-xs text-blue-700 font-medium">H₂O</span>
                                            </div>
                                            {/* Iron Nail */}
                                            <motion.div
                                                className={cn("absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-24 rounded-full", 
                                                    tubeResults.A.rusted ? "bg-gradient-to-b from-orange-800 to-red-700" : "bg-gradient-to-b from-gray-400 to-gray-600"
                                                )}
                                                animate={tubeResults.A.rusted ? { scale: [1, 1.05, 1] } : {}}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                {tubeResults.A.rusted && (
                                                    <motion.div
                                                        className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-red-500/30 rounded-full blur-sm"
                                                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                    />
                                                )}
                                            </motion.div>
                                        </div>
                                    </div>
                                    
                                    {!tubeResults.A.collected ? (
                                        <Button onClick={() => handleSetupTube('A', 'Setting up tube with nail in water exposed to air...')} disabled={activeSimulation !== null}>
                                            Set Up Tube A
                                        </Button>
                                    ) : (
                                        <div className="space-y-2">
                                            {activeSimulation === 'A' && (
                                                <motion.p animate={{ scale: [1, 1.1, 1] }} className="text-sm font-medium text-orange-600">
                                                    Day {simulationDay}/5...
                                                </motion.p>
                                            )}
                                            {tubeResults.A.observed && (
                                                <div className={cn("p-3 rounded text-sm font-medium", tubeResults.A.rusted ? "bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100" : "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100")}>
                                                    {tubeResults.A.rusted ? '🔴 Result: RUSTED - Both water and oxygen present' : '✅ Result: No rust'}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>

                                {/* Tube B */}
                                <motion.div
                                    className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/30"
                                    whileHover={!tubeResults.B.observed ? { scale: 1.02 } : {}}
                                >
                                    <h3 className="font-semibold mb-2">Tube B: Water + Oil Layer (NO OXYGEN)</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Boiled water with oil layer - oxygen removed, water present</p>
                                    
                                    {/* Visual Diagram for Tube B */}
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="relative w-32 h-64 bg-gradient-to-b from-transparent via-sky-100/40 to-sky-200/60 border-4 border-gray-600 rounded-b-3xl shadow-lg">
                                            {/* Air space (minimal) */}
                                            <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-center">
                                                <span className="text-xs text-gray-400">Air</span>
                                            </div>
                                            {/* Oil Layer */}
                                            <motion.div 
                                                className="absolute top-12 left-0 right-0 h-16 bg-gradient-to-b from-yellow-300/80 to-yellow-400/90 border-y-2 border-yellow-500/50"
                                                animate={{ opacity: [0.8, 1, 0.8] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
                                                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                                                    <span className="text-xs text-yellow-800 font-medium">Oil</span>
                                                </div>
                                                <div className="absolute bottom-1 right-2 text-xs text-yellow-700 font-bold">🚫 O₂</div>
                                            </motion.div>
                                            {/* Water */}
                                            <div className="absolute top-28 left-0 right-0 bottom-0 bg-gradient-to-b from-blue-200/70 to-blue-400/70 rounded-b-3xl">
                                                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                                                    <Droplets className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <span className="absolute top-12 left-1/2 transform -translate-x-1/2 text-xs text-blue-700 font-medium">H₂O</span>
                                            </div>
                                            {/* Iron Nail (not rusted) */}
                                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-24 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full">
                                                {tubeResults.B.observed && !tubeResults.B.rusted && (
                                                    <motion.div
                                                        className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-green-500/30 rounded-full blur-sm"
                                                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {!tubeResults.B.collected ? (
                                        <Button onClick={() => handleSetupTube('B', 'Setting up tube with boiled water and oil layer...')} disabled={activeSimulation !== null}>
                                            Set Up Tube B
                                        </Button>
                                    ) : (
                                        <div className="space-y-2">
                                            {activeSimulation === 'B' && (
                                                <motion.p animate={{ scale: [1, 1.1, 1] }} className="text-sm font-medium text-orange-600">
                                                    Day {simulationDay}/5...
                                                </motion.p>
                                            )}
                                            {tubeResults.B.observed && (
                                                <div className={cn("p-3 rounded text-sm font-medium", tubeResults.B.rusted ? "bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100" : "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100")}>
                                                    {tubeResults.B.rusted ? '🔴 Result: RUSTED' : '✅ Result: NO RUST - Oxygen excluded by oil layer'}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>

                                {/* Tube C */}
                                <motion.div
                                    className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/30"
                                    whileHover={!tubeResults.C.observed ? { scale: 1.02 } : {}}
                                >
                                    <h3 className="font-semibold mb-2">Tube C: Dry Environment (NO WATER)</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Drying agent present - water removed, oxygen present</p>
                                    
                                    {/* Visual Diagram for Tube C */}
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="relative w-32 h-64 bg-gradient-to-b from-transparent via-gray-50 to-gray-100 border-4 border-gray-600 rounded-b-3xl shadow-lg">
                                            {/* Air with oxygen */}
                                            <div className="absolute top-0 left-0 right-0 h-32 flex flex-col items-center justify-center gap-1">
                                                <Wind className="h-5 w-5 text-blue-400 animate-pulse" />
                                                <span className="text-xs text-blue-600 font-medium">O₂ Present</span>
                                            </div>
                                            {/* Drying Agent (crystals) */}
                                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-200/60 to-purple-400/70 rounded-b-3xl">
                                                <div className="absolute inset-0 flex flex-wrap gap-1 p-2 justify-center items-end">
                                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="w-3 h-3 bg-purple-600 rotate-45"
                                                            animate={{ scale: [1, 1.1, 1] }}
                                                            transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-center">
                                                    <span className="text-xs text-purple-900 font-medium">CaCl₂</span>
                                                    <div className="text-xs text-purple-700 font-bold">🚫 H₂O</div>
                                                </div>
                                            </div>
                                            {/* Iron Nail (dry, not rusted) */}
                                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-24 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full">
                                                {tubeResults.C.observed && !tubeResults.C.rusted && (
                                                    <motion.div
                                                        className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-green-500/30 rounded-full blur-sm"
                                                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {!tubeResults.C.collected ? (
                                        <Button onClick={() => handleSetupTube('C', 'Setting up tube with drying agent...')} disabled={activeSimulation !== null}>
                                            Set Up Tube C
                                        </Button>
                                    ) : (
                                        <div className="space-y-2">
                                            {activeSimulation === 'C' && (
                                                <motion.p animate={{ scale: [1, 1.1, 1] }} className="text-sm font-medium text-orange-600">
                                                    Day {simulationDay}/5...
                                                </motion.p>
                                            )}
                                            {tubeResults.C.observed && (
                                                <div className={cn("p-3 rounded text-sm font-medium", tubeResults.C.rusted ? "bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100" : "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100")}>
                                                    {tubeResults.C.rusted ? '🔴 Result: RUSTED' : '✅ Result: NO RUST - Moisture removed by drying agent'}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleViewResults} 
                                    disabled={completedTubes < 3} 
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg disabled:opacity-50" 
                                    size="lg"
                                >
                                    View Results ({completedTubes}/3)
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
                        <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                    Experiment Results
                                </CardTitle>
                                <CardDescription>Analysis of rusting conditions</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-6 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Findings:</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Tube A Results:</strong> Only this tube showed rust formation. It contained BOTH water and oxygen.
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Tube B Results:</strong> No rust formed. The oil layer excluded oxygen, proving oxygen is necessary.
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Tube C Results:</strong> No rust formed. The drying agent removed moisture, proving water is necessary.
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Conclusion:</strong> Rusting requires BOTH water AND oxygen. Neither alone is sufficient.
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                                    <h3 className="font-semibold mb-2">Prevention Strategies:</h3>
                                    <ul className="text-sm space-y-2">
                                        <li>• <strong>Oil/Grease:</strong> Forms a barrier to exclude oxygen</li>
                                        <li>• <strong>Painting:</strong> Seals the surface from both water and oxygen</li>
                                        <li>• <strong>Galvanizing:</strong> Coating iron with zinc for protection</li>
                                        <li>• <strong>Drying:</strong> Keeping surfaces dry in humid environments</li>
                                        <li>• <strong>Alloys:</strong> Using stainless steel resists corrosion</li>
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleViewQuiz} 
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg" 
                                    size="lg"
                                >
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
                        <Card className="border-2 border-green-200/50 dark:border-green-800/50 bg-gradient-to-br from-white/90 to-green-50/90 dark:from-gray-900/90 dark:to-green-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    Knowledge Check
                                </CardTitle>
                                <CardDescription>Test your understanding of rusting</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">1. For rust to form on iron, what two conditions are necessary?</Label>
                                    <div className="grid gap-3">
                                        {[
                                            { value: 'both', label: 'Both water and oxygen', isCorrect: true },
                                            { value: 'oxygen', label: 'Only oxygen' },
                                            { value: 'water', label: 'Only water' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={!quizSubmitted ? { scale: 1.02 } : {}}
                                                whileTap={!quizSubmitted ? { scale: 0.98 } : {}}
                                                onClick={() => !quizSubmitted && setQuizAnswer1(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer1 === option.value && !quizSubmitted && "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
                                                    quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizSubmitted && quizAnswer1 === option.value && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    !quizSubmitted && quizAnswer1 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer1 === option.value ? "border-orange-500 bg-orange-500" : "border-gray-300"
                                                    )}>
                                                        {quizAnswer1 === option.value && <div className="h-2 w-2 rounded-full bg-white" />}
                                                    </div>
                                                    <Label className="cursor-pointer flex-1">{option.label}</Label>
                                                    {quizSubmitted && option.isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    {quizSubmitted && quizAnswer1 === option.value && !option.isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Question 2 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">2. Which element in Tube B was excluded to prevent rusting?</Label>
                                    <div className="grid gap-3">
                                        {[
                                            { value: 'oxygen', label: 'Oxygen', isCorrect: true },
                                            { value: 'nitrogen', label: 'Nitrogen' },
                                            { value: 'hydrogen', label: 'Hydrogen' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={!quizSubmitted ? { scale: 1.02 } : {}}
                                                whileTap={!quizSubmitted ? { scale: 0.98 } : {}}
                                                onClick={() => !quizSubmitted && setQuizAnswer2(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer2 === option.value && !quizSubmitted && "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
                                                    quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizSubmitted && quizAnswer2 === option.value && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    !quizSubmitted && quizAnswer2 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer2 === option.value ? "border-orange-500 bg-orange-500" : "border-gray-300"
                                                    )}>
                                                        {quizAnswer2 === option.value && <div className="h-2 w-2 rounded-full bg-white" />}
                                                    </div>
                                                    <Label className="cursor-pointer flex-1">{option.label}</Label>
                                                    {quizSubmitted && option.isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    {quizSubmitted && quizAnswer2 === option.value && !option.isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Question 3 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">3. Which method prevents rust by excluding oxygen?</Label>
                                    <div className="grid gap-3">
                                        {[
                                            { value: 'drying', label: 'Using a drying agent' },
                                            { value: 'oil', label: 'Applying an oil layer', isCorrect: true },
                                            { value: 'heating', label: 'Heating the metal' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={!quizSubmitted ? { scale: 1.02 } : {}}
                                                whileTap={!quizSubmitted ? { scale: 0.98 } : {}}
                                                onClick={() => !quizSubmitted && setQuizAnswer3(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer3 === option.value && !quizSubmitted && "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
                                                    quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizSubmitted && quizAnswer3 === option.value && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    !quizSubmitted && quizAnswer3 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer3 === option.value ? "border-orange-500 bg-orange-500" : "border-gray-300"
                                                    )}>
                                                        {quizAnswer3 === option.value && <div className="h-2 w-2 rounded-full bg-white" />}
                                                    </div>
                                                    <Label className="cursor-pointer flex-1">{option.label}</Label>
                                                    {quizSubmitted && option.isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    {quizSubmitted && quizAnswer3 === option.value && !option.isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
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
                                            "p-4 rounded-lg border-2 bg-gradient-to-r",
                                            quizFeedback.includes('Perfect') || quizFeedback.includes('all 3') 
                                                ? "from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-500 text-green-700 dark:text-green-300"
                                                : quizFeedback.includes('Good') 
                                                ? "from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-blue-500 text-blue-700 dark:text-blue-300"
                                                : "from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-500 text-amber-700 dark:text-amber-300"
                                        )}
                                    >
                                        <div className="flex items-start gap-2">
                                            {quizFeedback.includes('Perfect') || quizFeedback.includes('all 3') ? (
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
                                        quizSubmitted && !quizFeedback.includes('all 3')
                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                            : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                                    )}
                                    size="lg"
                                    disabled={!quizAnswer1 || !quizAnswer2 || !quizAnswer3 || (quizSubmitted && quizFeedback.includes('all 3'))}
                                >
                                    {quizSubmitted && quizFeedback.includes('all 3') ? (
                                        <>
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            Quiz Completed
                                        </>
                                    ) : quizSubmitted && !quizFeedback.includes('all 3') ? (
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
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative"
                    >
                        <Card className="border-2 border-yellow-300 dark:border-yellow-700 bg-gradient-to-br from-yellow-50/90 via-orange-50/90 to-red-50/90 dark:from-yellow-950/90 dark:via-orange-950/90 dark:to-red-950/90 backdrop-blur-sm shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 animate-pulse" />
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
                                <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                                    Lab Complete!
                                </h2>
                                {xpEarned > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="flex items-center justify-center gap-2 text-3xl font-black text-orange-600 dark:text-orange-400"
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
                                            <span>Rusting requires both water and oxygen</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>Oxidation is an essential chemical reaction</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>Multiple strategies prevent corrosion</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>Control experiments isolate variables</span>
                                        </li>
                                    </ul>
                                </div>
                                <Button 
                                    onClick={handleRestart} 
                                    variant="outline" 
                                    className="mt-6 border-2 border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                                    size="lg"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Restart Lab
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
        </div>
    );
}

