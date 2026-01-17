'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Trophy, Award, TestTube, Flame, Droplets, Sparkles, AlertTriangle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { TextToSpeech } from '../text-to-speech';
import { LabSupplies, SupplyItem } from './LabSupplies';

type Step = 'intro' | 'collect-supplies' | 'setup' | 'experiment' | 'results' | 'quiz' | 'complete';
type Metal = 'Magnesium' | 'Zinc' | 'Iron' | 'Copper';

interface Observation {
    metal: Metal;
    reactionSpeed: 'very-fast' | 'fast' | 'slow' | 'no-reaction';
    bubbles: boolean;
    heat: boolean;
    description: string;
}

export function MetalAcidReactionLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [collectedSupplies, setCollectedSupplies] = React.useState<string[]>([]);
    
    const labSupplies: SupplyItem[] = [
        { id: 'hcl', name: 'Hydrochloric Acid', emoji: '⚗️', description: 'Dilute HCl solution' },
        { id: 'test-tubes', name: 'Test Tubes', emoji: '🧪', description: 'To hold reactions' },
        { id: 'metals', name: 'Metal Samples', emoji: '🔩', description: 'Mg, Zn, Fe, Cu' },
        { id: 'goggles', name: 'Safety Goggles', emoji: '🥽', description: 'Eye protection' },
    ];
    
    // Experiment state
    const [selectedMetal, setSelectedMetal] = React.useState<Metal | null>(null);
    const [isReacting, setIsReacting] = React.useState(false);
    const [observations, setObservations] = React.useState<Observation[]>([]);
    const [bubbleCount, setBubbleCount] = React.useState(0);
    
    // Quiz state
    const [quizAnswer1, setQuizAnswer1] = React.useState<string | undefined>();
    const [quizAnswer2, setQuizAnswer2] = React.useState<string | undefined>();
    const [quizAnswer3, setQuizAnswer3] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState('');
    const [quizSubmitted, setQuizSubmitted] = React.useState(false);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);
    
    // XP and completion
    const [xpEarned, setXpEarned] = React.useState(0);
    const { markLabComplete, isLabCompleted, getLabCompletion } = useLabProgress();
    const labId = 'metal-acid-reaction';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Metal-Acid Reaction Lab! We'll explore how different metals react with hydrochloric acid. Safety first - always handle acids carefully!");
        }
    }, [currentStep]);

    const metalReactivity: Record<Metal, { speed: Observation['reactionSpeed'], bubbles: boolean, heat: boolean, description: string }> = {
        Magnesium: {
            speed: 'very-fast',
            bubbles: true,
            heat: true,
            description: 'Vigorous reaction! Metal dissolves rapidly with lots of bubbling and heat.'
        },
        Zinc: {
            speed: 'fast',
            bubbles: true,
            heat: true,
            description: 'Steady reaction. Metal dissolves with continuous bubbling and moderate heat.'
        },
        Iron: {
            speed: 'slow',
            bubbles: true,
            heat: false,
            description: 'Slow reaction. Metal dissolves gradually with occasional bubbles.'
        },
        Copper: {
            speed: 'no-reaction',
            bubbles: false,
            heat: false,
            description: 'No visible reaction. Copper is too unreactive to displace hydrogen from acid.'
        }
    };

    const handleStartExperiment = () => {
        setCurrentStep('collect-supplies');
        setTeacherMessage("Before we begin, let's gather all the equipment we'll need for the metal-acid reaction experiment. Click each item to collect it!");
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

    const handleAllSuppliesCollected = () => {
        setTeacherMessage("Perfect! All supplies collected! Now let's start the experiment. Click 'Continue to Experiment' to begin!");
    };

    const handleContinueToExperiment = () => {
        setCurrentStep('setup');
        setTeacherMessage("Perfect! Let's begin! You'll test metals with hydrochloric acid. Select a metal, add it to the acid, and observe carefully. Look for bubbles (that's hydrogen gas!), heat production, and how fast the metal dissolves. This reveals the reactivity series!");
    };

    const handleSelectMetal = (metal: Metal) => {
        if (isReacting) {
            toast({ title: 'Wait', description: 'Current reaction in progress', variant: 'destructive' });
            return;
        }
        
        setSelectedMetal(metal);
        
        // Teacher provides context about the selected metal
        const metalInfo = {
            Magnesium: "Good choice! Magnesium is a very reactive metal. Watch for vigorous bubbling and heat!",
            Zinc: "Excellent! Zinc is moderately reactive. You'll see steady bubbling as hydrogen gas is released.",
            Iron: "Interesting! Iron reacts slowly with acid. Be patient and watch for gradual changes.",
            Copper: "Smart selection! Copper is below hydrogen in the reactivity series. Let's see what happens!"
        };
        
        setTeacherMessage(metalInfo[metal]);
        toast({ title: '🔬 Metal Selected', description: `${metal} ready to test` });
    };

    const handleAddMetal = () => {
        if (!selectedMetal) {
            toast({ title: 'Select Metal First', description: 'Choose a metal to add', variant: 'destructive' });
            return;
        }
        
        if (observations.some(obs => obs.metal === selectedMetal)) {
            // Find untested metals
            const allMetals: Metal[] = ['Magnesium', 'Zinc', 'Iron', 'Copper'];
            const untestedMetals = allMetals.filter(m => !observations.some(obs => obs.metal === m));
            const untestedList = untestedMetals.length > 0 
                ? ` Try ${untestedMetals.join(', ')} to compare!` 
                : '';
            
            toast({ 
                title: '🔬 Already Explored!', 
                description: `You've tested ${selectedMetal}.${untestedList}`,
                duration: 4000
            });
            setTeacherMessage(`Good observation! You've already tested ${selectedMetal}. ${untestedMetals.length > 0 ? `Let's explore ${untestedMetals.length === 1 ? untestedMetals[0] : 'different metals'} to see how reactivity varies!` : 'You\'ve tested all metals - great job!'}`);
            return;
        }
        
        setIsReacting(true);
        const reaction = metalReactivity[selectedMetal];
        
        // Teacher announces reaction start
        setTeacherMessage(`Watch carefully! Adding ${selectedMetal} to hydrochloric acid. Observe the bubbles, heat, and how fast the metal dissolves!`);
        
        // Animate reaction
        const duration = reaction.speed === 'very-fast' ? 2000 : 
                        reaction.speed === 'fast' ? 3000 : 
                        reaction.speed === 'slow' ? 4000 : 1000;
        
        if (reaction.bubbles) {
            const bubbleInterval = setInterval(() => {
                setBubbleCount(prev => prev + 1);
            }, 100);
            
            setTimeout(() => {
                clearInterval(bubbleInterval);
                setBubbleCount(0);
            }, duration);
        }
        
        setTimeout(() => {
            const observation: Observation = {
                metal: selectedMetal,
                reactionSpeed: reaction.speed,
                bubbles: reaction.bubbles,
                heat: reaction.heat,
                description: reaction.description
            };
            
            setObservations(prev => [...prev, observation]);
            setIsReacting(false);
            
            if (observations.length === 0) {
                setTeacherMessage(`Excellent first observation! ${selectedMetal} shows ${reaction.speed.replace('-', ' ')} reaction. ${reaction.description} Now try a different metal to compare reactivity!`);
            } else if (observations.length === 1) {
                setTeacherMessage(`Good progress! You've tested 2 metals now. Notice the differences in reaction speeds? This is the reactivity series in action! Test one more to complete your analysis.`);
            } else if (observations.length === 2) {
                setTeacherMessage(`Fantastic! You've tested 3 metals! You can see clear patterns now. ${reaction.description} Ready to analyze your results? Or test another metal if you're curious!`);
            } else {
                setTeacherMessage(`Another excellent observation! ${reaction.description} You're building a comprehensive understanding of metal reactivity!`);
            }
            
            toast({ 
                title: '📊 Observation Recorded', 
                description: `${selectedMetal}: ${reaction.speed.replace('-', ' ')}`
            });
        }, duration);
    };

    const handleTeacherComplete = () => {
        // Direct state updates - no pending transitions
    };

    const handleViewResults = () => {
        if (observations.length < 3) {
            toast({ 
                title: 'Need More Tests', 
                description: `Test ${3 - observations.length} more metal(s)`,
                variant: 'destructive' 
            });
            return;
        }
        
        setTeacherMessage("Excellent observations! Now let's analyze your results. You'll see the reactivity series clearly: more reactive metals produce more vigorous reactions and bubbles of hydrogen gas. This explains why some metals are used in batteries and why copper is safe for cooking pots!");
        setCurrentStep('results');
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Time to test your understanding of metal reactivity!");
        // Transition to quiz after showing results - give students time to observe
        setTimeout(() => {
            setCurrentStep('quiz');
        }, 25000); // 25 seconds to allow teacher to finish explaining
    };

    const handleQuizSubmit = () => {
        // If already submitted and incorrect, allow retry by resetting
        if (quizSubmitted && quizIsCorrect === false) {
            setQuizAnswer1(undefined);
            setQuizAnswer2(undefined);
            setQuizAnswer3(undefined);
            setQuizFeedback('');
            setQuizSubmitted(false);
            setQuizIsCorrect(null);
            return;
        }
        
        if (quizSubmitted) return;
        
        let correctCount = 0;
        if (quizAnswer1 === 'hydrogen') correctCount++;
        if (quizAnswer2 === 'magnesium') correctCount++;
        if (quizAnswer3 === 'copper') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            setQuizIsCorrect(true);
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand metal reactivity! +${earnedXP} XP`);
            setTeacherMessage(`Outstanding! Perfect score! You've mastered the reactivity series. You understand why magnesium reacts vigorously, why copper doesn't react, and how hydrogen gas is produced. Excellent work! +${earnedXP} XP earned!`);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setCurrentStep('complete');
            }, 2000);
        } else {
            setQuizIsCorrect(false);
            if (correctCount === 2) {
                setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Review the reactivity series.`);
                setTeacherMessage(`Good effort! You got ${correctCount} out of 3 correct. Remember: more reactive metals like magnesium displace hydrogen from acids, while less reactive metals like copper don't react. Review your observations and try again!`);
            } else {
                setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: more reactive metals displace hydrogen from acids.`);
                setTeacherMessage(`Keep trying! You got ${correctCount} correct. Let me help: The reactivity series goes Magnesium > Zinc > Iron > Copper. Reactive metals produce hydrogen gas (H₂) when added to acid. Review your experiment observations and give it another go!`);
            }
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setSelectedMetal(null);
        setIsReacting(false);
        setObservations([]);
        setBubbleCount(0);
        setQuizAnswer1(undefined);
        setQuizAnswer2(undefined);
        setQuizAnswer3(undefined);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setQuizIsCorrect(null);
        setXpEarned(0);
        setCollectedSupplies([]);
        setTeacherMessage("Welcome back! Let's explore metal reactivity again. Remember what you learned: the reactivity series, hydrogen gas production, and why different metals behave differently with acids. Ready to start?");
    };

    return (
        <div className="relative min-h-screen pb-20">
            {/* Premium Animated Background - Orange/Red Acid Theme */}
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
                        className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4"
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
                        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <CardTitle className="flex items-center gap-2">
                                    <TestTube className="h-5 w-5 text-orange-600" />
                                    Objective
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <TextToSpeech textToSpeak="To investigate and observe how different metals react with hydrochloric acid and understand the reactivity series of metals." />
                                </div>
                            </div>
                            <CardDescription>To investigate and observe how different metals react with hydrochloric acid and understand the reactivity series of metals.</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
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
                                    <div className="flex-grow">
                                        <p><strong>Metal-Acid Reactions</strong> occur when reactive metals displace hydrogen from acids.</p>
                                        <p className="mt-2"><strong>General Equation:</strong></p>
                                        <p className="font-mono text-xs">Metal + Acid → Salt + Hydrogen Gas</p>
                                        <p className="mt-2"><strong>The Reactivity Series (Most to Least Reactive):</strong></p>
                                        <ul>
                                            <li><strong>Potassium:</strong> Most reactive</li>
                                            <li><strong>Sodium:</strong> Very reactive</li>
                                            <li><strong>Calcium:</strong> Very reactive</li>
                                            <li><strong>Magnesium:</strong> Reactive (vigorous with acids)</li>
                                            <li><strong>Zinc:</strong> Moderately reactive</li>
                                            <li><strong>Iron:</strong> Slowly reactive</li>
                                            <li><strong>Lead:</strong> Very slowly reactive</li>
                                            <li><strong>Copper:</strong> Does not react with dilute acids</li>
                                            <li><strong>Silver, Gold:</strong> Least reactive</li>
                                        </ul>
                                        <p className="mt-2"><strong>Key Observations:</strong></p>
                                        <ul>
                                            <li>More reactive metals produce more vigorous reactions</li>
                                            <li>Hydrogen gas bubbles are produced in successful reactions</li>
                                            <li>Heat is often released (exothermic reaction)</li>
                                            <li>A salt is formed when the metal dissolves</li>
                                        </ul>
                                    </div>
                                    <TextToSpeech 
                                        textToSpeak="Metal-Acid Reactions occur when reactive metals displace hydrogen from acids. The general equation is: Metal plus Acid gives Salt plus Hydrogen Gas. The Reactivity Series from most to least reactive: Potassium, Sodium, Calcium, Magnesium, Zinc, Iron, Lead, Copper, Silver, Gold. Key observations: More reactive metals produce more vigorous reactions, hydrogen gas bubbles are produced, heat is released, and a salt is formed."
                                        className="flex-shrink-0" 
                                    />
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
                                    <div className="flex-grow">
                                        <ul>
                                            <li><strong>CRITICAL:</strong> Always wear safety goggles - acids can cause eye damage</li>
                                            <li>Wear protective gloves when handling acids</li>
                                            <li>Work in a well-ventilated area or fume hood</li>
                                            <li>Never add water to concentrated acid - add acid to water</li>
                                            <li>If acid spills on skin, rinse immediately with lots of water</li>
                                            <li>Keep long hair tied back</li>
                                            <li>Hydrogen gas is flammable - keep away from flames</li>
                                            <li>Dispose of chemicals properly - never pour down sink without permission</li>
                                            <li>Report any accidents immediately to teacher</li>
                                        </ul>
                                    </div>
                                    <TextToSpeech 
                                        textToSpeak="Safety precautions: Always wear safety goggles as acids can cause eye damage. Wear protective gloves when handling acids. Work in a well-ventilated area. Never add water to concentrated acid, add acid to water instead. If acid spills on skin, rinse immediately with lots of water. Keep long hair tied back. Hydrogen gas is flammable, keep away from flames. Dispose of chemicals properly. Report any accidents immediately to teacher."
                                        className="flex-shrink-0" 
                                    />
                                </div>
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Welcome to Metal-Acid Reaction Lab!</CardTitle>
                                <CardDescription>Discover which metals react with acids</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 p-6 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                                    <div className="flex items-start gap-4">
                                        <TestTube className="w-16 h-16 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-orange-900 dark:text-orange-100">What You'll Learn:</h3>
                                            <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
                                                <li>• How different metals react with hydrochloric acid</li>
                                                <li>• The reactivity series of metals</li>
                                                <li>• Why some metals produce bubbles (hydrogen gas)</li>
                                                <li>• How to identify exothermic reactions</li>
                                                <li>• Which metals are safe for use in cooking vessels</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border-2 border-red-200 dark:border-red-800">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">Safety Warning</h4>
                                            <p className="text-sm text-red-800 dark:text-red-200">
                                                This experiment uses hydrochloric acid. Always wear safety goggles and gloves. Work in a ventilated area.
                                            </p>
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

                {/* Collect Supplies Step */}
                {currentStep === 'collect-supplies' && (
                    <motion.div
                        key="collect-supplies"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <LabSupplies
                            supplies={labSupplies}
                            collectedItems={collectedSupplies}
                            onCollect={handleCollectSupply}
                            onAllCollected={handleAllSuppliesCollected}
                            requiredCount={labSupplies.length}
                        />
                        {collectedSupplies.length === labSupplies.length && (
                            <Button
                                onClick={handleContinueToExperiment}
                                size="lg"
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                            >
                                Continue to Experiment
                            </Button>
                        )}
                    </motion.div>
                )}

                {currentStep === 'setup' && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <TestTube className="h-5 w-5 text-orange-600" />
                                            Test Metal Reactivity
                                        </CardTitle>
                                        <CardDescription>Metals tested: {observations.length}/3+</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Metal Selection */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold">Select Metal to Test:</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {(['Magnesium', 'Zinc', 'Iron', 'Copper'] as Metal[]).map((metal) => {
                                            const tested = observations.some(obs => obs.metal === metal);
                                            const metalColors = {
                                                Magnesium: 'from-gray-200 to-gray-300',
                                                Zinc: 'from-gray-400 to-gray-500',
                                                Iron: 'from-gray-600 to-gray-700',
                                                Copper: 'from-orange-400 to-orange-500'
                                            };
                                            
                                            return (
                                                <Button
                                                    key={metal}
                                                    variant={selectedMetal === metal ? 'default' : 'outline'}
                                                    onClick={() => handleSelectMetal(metal)}
                                                    disabled={tested || isReacting}
                                                    className="h-auto py-4 flex flex-col gap-2"
                                                >
                                                    <div className={cn("w-8 h-8 rounded-full bg-gradient-to-br", metalColors[metal])} />
                                                    <span className="text-xs">{metal}</span>
                                                    {tested && <span className="text-xs text-green-600">✓ Tested</span>}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Test Tube Visual */}
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-blue-950/20 p-8 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                                    <div className="flex justify-center items-end gap-8">
                                        {/* Test Tube */}
                                        <div className="relative">
                                            <div className="text-center mb-2 text-sm font-semibold">
                                                {selectedMetal ? selectedMetal : 'No Metal'}
                                            </div>
                                            <div className="relative w-24 h-48 mx-auto">
                                                {/* Glass tube */}
                                                <div className="absolute inset-0 border-4 border-gray-400 dark:border-gray-600 border-t-0 rounded-b-3xl bg-gradient-to-b from-transparent to-blue-100/20" />
                                                
                                                {/* Acid */}
                                                <div className="absolute bottom-0 left-1 right-1 h-32 bg-gradient-to-b from-blue-200/60 to-blue-300/60 dark:from-blue-400/40 dark:to-blue-500/40 rounded-b-3xl">
                                                    {/* Bubbles */}
                                                    {isReacting && selectedMetal && metalReactivity[selectedMetal].bubbles && (
                                                        <>
                                                            {Array.from({ length: 20 }).map((_, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    className="absolute w-2 h-2 bg-white/60 rounded-full"
                                                                    initial={{ bottom: 10, left: `${20 + Math.random() * 60}%`, opacity: 0.8 }}
                                                                    animate={{ 
                                                                        bottom: 120, 
                                                                        opacity: 0,
                                                                        scale: [1, 1.5, 0.5]
                                                                    }}
                                                                    transition={{ 
                                                                        duration: 1 + Math.random(),
                                                                        repeat: Infinity,
                                                                        delay: i * 0.1
                                                                    }}
                                                                />
                                                            ))}
                                                        </>
                                                    )}
                                                    
                                                    {/* Metal piece at bottom */}
                                                    {selectedMetal && (
                                                        <motion.div
                                                            className={cn(
                                                                "absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-3 rounded",
                                                                selectedMetal === 'Magnesium' && "bg-gray-300",
                                                                selectedMetal === 'Zinc' && "bg-gray-500",
                                                                selectedMetal === 'Iron' && "bg-gray-700",
                                                                selectedMetal === 'Copper' && "bg-orange-500"
                                                            )}
                                                            animate={isReacting && metalReactivity[selectedMetal].speed !== 'no-reaction' ? {
                                                                scale: [1, 0.8, 0.6, 0.4, 0.2],
                                                                opacity: [1, 0.8, 0.6, 0.3, 0]
                                                            } : {}}
                                                            transition={{ duration: 3 }}
                                                        />
                                                    )}
                                                </div>
                                                
                                                {/* Heat indicator */}
                                                {isReacting && selectedMetal && metalReactivity[selectedMetal].heat && (
                                                    <motion.div
                                                        className="absolute -right-8 top-1/2 -translate-y-1/2"
                                                        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                                                        transition={{ duration: 0.5, repeat: Infinity }}
                                                    >
                                                        <Flame className="h-6 w-6 text-orange-500" />
                                                    </motion.div>
                                                )}
                                            </div>
                                            
                                            <div className="text-center mt-2 text-xs text-muted-foreground">
                                                Dilute HCl
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Reaction Status */}
                                    {isReacting && selectedMetal && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-orange-300 dark:border-orange-700 text-center"
                                        >
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <Sparkles className="h-5 w-5 text-orange-600 animate-pulse" />
                                                <span className="font-semibold text-orange-900 dark:text-orange-100">
                                                    Reaction in Progress...
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {metalReactivity[selectedMetal].description}
                                            </p>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Add Metal Button */}
                                <Button 
                                    onClick={handleAddMetal}
                                    disabled={!selectedMetal || isReacting}
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                                    size="lg"
                                >
                                    <Droplets className="h-5 w-5 mr-2" />
                                    Add Metal to Acid
                                </Button>

                                {/* Observations Table */}
                                {observations.length > 0 && (
                                    <div className="border rounded-lg p-4">
                                        <h4 className="font-semibold mb-3">Recorded Observations:</h4>
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left p-2">Metal</th>
                                                    <th className="text-left p-2">Speed</th>
                                                    <th className="text-center p-2">Bubbles</th>
                                                    <th className="text-center p-2">Heat</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {observations.map((obs, idx) => (
                                                    <tr key={idx} className="border-b">
                                                        <td className="p-2 font-semibold">{obs.metal}</td>
                                                        <td className="p-2 text-xs">{obs.reactionSpeed.replace('-', ' ')}</td>
                                                        <td className="p-2 text-center">
                                                            {obs.bubbles ? <CheckCircle className="h-4 w-4 text-green-500 inline" /> : <XCircle className="h-4 w-4 text-red-500 inline" />}
                                                        </td>
                                                        <td className="p-2 text-center">
                                                            {obs.heat ? <Flame className="h-4 w-4 text-orange-500 inline" /> : <span className="text-gray-400">-</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleViewResults} 
                                    disabled={observations.length < 3}
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg disabled:opacity-50"
                                    size="lg"
                                >
                                    View Results ({observations.length}/3 metals tested)
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
                            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-orange-600" />
                                    Analysis & Results
                                </CardTitle>
                                <CardDescription>Metal Reactivity Series Verified</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Results Summary */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg border-2 border-green-200 dark:border-green-800">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        Reactivity Series Confirmed!
                                    </h3>
                                    <p className="text-sm mb-4">
                                        You tested {observations.length} metals and observed their different reaction rates with acid.
                                    </p>
                                    <div className="space-y-2">
                                        {observations
                                            .sort((a, b) => {
                                                const order = { 'very-fast': 0, 'fast': 1, 'slow': 2, 'no-reaction': 3 };
                                                return order[a.reactionSpeed] - order[b.reactionSpeed];
                                            })
                                            .map((obs, idx) => (
                                                <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded flex items-center justify-between">
                                                    <span className="font-semibold">{obs.metal}</span>
                                                    <span className={cn(
                                                        "text-sm px-3 py-1 rounded-full",
                                                        obs.reactionSpeed === 'very-fast' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
                                                        obs.reactionSpeed === 'fast' && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
                                                        obs.reactionSpeed === 'slow' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
                                                        obs.reactionSpeed === 'no-reaction' && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                                    )}>
                                                        {obs.reactionSpeed.replace('-', ' ')}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Key Observations */}
                                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 p-6 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Observations:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Reactivity Order:</strong> Magnesium {">"} Zinc {">"} Iron {">"} Copper</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Hydrogen Gas:</strong> Reactive metals produced bubbles of hydrogen gas (H₂)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Exothermic:</strong> Reactions released heat energy</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Copper:</strong> No reaction - below hydrogen in reactivity series</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Chemical Equations */}
                                <div className="border-2 border-blue-200 dark:border-blue-800 p-6 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-4">Chemical Equations:</h3>
                                    <div className="space-y-3 text-sm font-mono">
                                        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded">
                                            <p className="text-xs text-muted-foreground mb-1">Magnesium + Hydrochloric Acid:</p>
                                            <p>Mg + 2HCl → MgCl₂ + H₂↑</p>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded">
                                            <p className="text-xs text-muted-foreground mb-1">Zinc + Hydrochloric Acid:</p>
                                            <p>Zn + 2HCl → ZnCl₂ + H₂↑</p>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded">
                                            <p className="text-xs text-muted-foreground mb-1">Iron + Hydrochloric Acid:</p>
                                            <p>Fe + 2HCl → FeCl₂ + H₂↑</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Real-World Applications */}
                                <div className="border-2 border-orange-200 dark:border-orange-800 p-6 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-4">Real-World Applications:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• <strong>Cooking Utensils:</strong> Copper/stainless steel used because they don't react with acidic foods</li>
                                        <li>• <strong>Batteries:</strong> Zinc used in batteries due to its reactivity</li>
                                        <li>• <strong>Galvanizing:</strong> Zinc coating protects iron from corrosion</li>
                                        <li>• <strong>Antacids:</strong> Magnesium compounds neutralize stomach acid</li>
                                        <li>• <strong>Metal Extraction:</strong> More reactive metals need more energy to extract from ores</li>
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
                        <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                                <CardTitle>Knowledge Check</CardTitle>
                                <CardDescription>Test your understanding of metal reactivity</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm">
                                                1
                                            </span>
                                            What gas is produced when a metal reacts with acid?
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-3">
                                            {[
                                                { value: 'hydrogen', label: 'Hydrogen (H₂)', isCorrect: true },
                                                { value: 'oxygen', label: 'Oxygen (O₂)' },
                                                { value: 'carbon', label: 'Carbon Dioxide (CO₂)' }
                                            ].map((option, idx) => {
                                                const isSelected = quizAnswer1 === option.value;
                                                const isCorrect = option.isCorrect;
                                                const showFeedback = quizSubmitted;
                                                const isWrong = showFeedback && isSelected && !isCorrect;
                                                
                                                return (
                                                    <motion.button
                                                        key={idx}
                                                        onClick={() => !quizSubmitted && setQuizAnswer1(option.value)}
                                                        disabled={quizSubmitted}
                                                        className={cn(
                                                            "relative p-4 rounded-lg border-2 text-left transition-all",
                                                            "disabled:cursor-not-allowed",
                                                            !showFeedback && isSelected && "border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 shadow-md",
                                                            !showFeedback && !isSelected && "border-gray-200 dark:border-gray-700 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/50",
                                                            showFeedback && isCorrect && "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 shadow-md",
                                                            showFeedback && isWrong && "border-red-500 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 shadow-md",
                                                            showFeedback && !isSelected && !isCorrect && "border-gray-200 dark:border-gray-700 opacity-60"
                                                        )}
                                                        whileHover={!showFeedback ? { scale: 1.02, y: -2 } : {}}
                                                        whileTap={!showFeedback ? { scale: 0.98 } : {}}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "flex items-center justify-center w-6 h-6 rounded-full border-2 flex-shrink-0",
                                                                isSelected && !showFeedback && "border-orange-500 bg-orange-500",
                                                                showFeedback && isCorrect && "border-green-500 bg-green-500",
                                                                showFeedback && isWrong && "border-red-500 bg-red-500",
                                                                !isSelected && !showFeedback && "border-gray-300 dark:border-gray-600"
                                                            )}>
                                                                {isSelected && (
                                                                    <div className="w-3 h-3 rounded-full bg-white" />
                                                                )}
                                                            </div>
                                                            <span className="flex-1 font-medium">{option.label}</span>
                                                            {showFeedback && isCorrect && (
                                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                            )}
                                                            {showFeedback && isWrong && (
                                                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                                            )}
                                                        </div>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Question 2 */}
                                <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm">
                                                2
                                            </span>
                                            Which metal reacts most vigorously with dilute hydrochloric acid?
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-3">
                                            {[
                                                { value: 'magnesium', label: 'Magnesium', isCorrect: true },
                                                { value: 'zinc', label: 'Zinc' },
                                                { value: 'copper', label: 'Copper' }
                                            ].map((option, idx) => {
                                                const isSelected = quizAnswer2 === option.value;
                                                const isCorrect = option.isCorrect;
                                                const showFeedback = quizSubmitted;
                                                const isWrong = showFeedback && isSelected && !isCorrect;
                                                
                                                return (
                                                    <motion.button
                                                        key={idx}
                                                        onClick={() => !quizSubmitted && setQuizAnswer2(option.value)}
                                                        disabled={quizSubmitted}
                                                        className={cn(
                                                            "relative p-4 rounded-lg border-2 text-left transition-all",
                                                            "disabled:cursor-not-allowed",
                                                            !showFeedback && isSelected && "border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 shadow-md",
                                                            !showFeedback && !isSelected && "border-gray-200 dark:border-gray-700 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/50",
                                                            showFeedback && isCorrect && "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 shadow-md",
                                                            showFeedback && isWrong && "border-red-500 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 shadow-md",
                                                            showFeedback && !isSelected && !isCorrect && "border-gray-200 dark:border-gray-700 opacity-60"
                                                        )}
                                                        whileHover={!showFeedback ? { scale: 1.02, y: -2 } : {}}
                                                        whileTap={!showFeedback ? { scale: 0.98 } : {}}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "flex items-center justify-center w-6 h-6 rounded-full border-2 flex-shrink-0",
                                                                isSelected && !showFeedback && "border-orange-500 bg-orange-500",
                                                                showFeedback && isCorrect && "border-green-500 bg-green-500",
                                                                showFeedback && isWrong && "border-red-500 bg-red-500",
                                                                !isSelected && !showFeedback && "border-gray-300 dark:border-gray-600"
                                                            )}>
                                                                {isSelected && (
                                                                    <div className="w-3 h-3 rounded-full bg-white" />
                                                                )}
                                                            </div>
                                                            <span className="flex-1 font-medium">{option.label}</span>
                                                            {showFeedback && isCorrect && (
                                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                            )}
                                                            {showFeedback && isWrong && (
                                                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                                            )}
                                                        </div>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Question 3 */}
                                <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm">
                                                3
                                            </span>
                                            Which metal does NOT react with dilute hydrochloric acid?
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-3">
                                            {[
                                                { value: 'copper', label: 'Copper', isCorrect: true },
                                                { value: 'magnesium2', label: 'Magnesium' },
                                                { value: 'iron', label: 'Iron' }
                                            ].map((option, idx) => {
                                                const isSelected = quizAnswer3 === option.value;
                                                const isCorrect = option.isCorrect;
                                                const showFeedback = quizSubmitted;
                                                const isWrong = showFeedback && isSelected && !isCorrect;
                                                
                                                return (
                                                    <motion.button
                                                        key={idx}
                                                        onClick={() => !quizSubmitted && setQuizAnswer3(option.value)}
                                                        disabled={quizSubmitted}
                                                        className={cn(
                                                            "relative p-4 rounded-lg border-2 text-left transition-all",
                                                            "disabled:cursor-not-allowed",
                                                            !showFeedback && isSelected && "border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 shadow-md",
                                                            !showFeedback && !isSelected && "border-gray-200 dark:border-gray-700 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/50",
                                                            showFeedback && isCorrect && "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 shadow-md",
                                                            showFeedback && isWrong && "border-red-500 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 shadow-md",
                                                            showFeedback && !isSelected && !isCorrect && "border-gray-200 dark:border-gray-700 opacity-60"
                                                        )}
                                                        whileHover={!showFeedback ? { scale: 1.02, y: -2 } : {}}
                                                        whileTap={!showFeedback ? { scale: 0.98 } : {}}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "flex items-center justify-center w-6 h-6 rounded-full border-2 flex-shrink-0",
                                                                isSelected && !showFeedback && "border-orange-500 bg-orange-500",
                                                                showFeedback && isCorrect && "border-green-500 bg-green-500",
                                                                showFeedback && isWrong && "border-red-500 bg-red-500",
                                                                !isSelected && !showFeedback && "border-gray-300 dark:border-gray-600"
                                                            )}>
                                                                {isSelected && (
                                                                    <div className="w-3 h-3 rounded-full bg-white" />
                                                                )}
                                                            </div>
                                                            <span className="flex-1 font-medium">{option.label}</span>
                                                            {showFeedback && isCorrect && (
                                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                            )}
                                                            {showFeedback && isWrong && (
                                                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                                            )}
                                                        </div>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>

                                {quizFeedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "p-4 rounded-lg border-2",
                                            quizFeedback.includes('Perfect') || quizFeedback.includes('all 3') ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100" :
                                            quizFeedback.includes('Good') ? "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-100" :
                                            "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-100"
                                        )}
                                    >
                                        {quizFeedback}
                                    </motion.div>
                                )}
                            </CardContent>
                            <CardFooter className="flex gap-3">
                                <Button 
                                    onClick={handleQuizSubmit} 
                                    disabled={(!quizAnswer1 || !quizAnswer2 || !quizAnswer3) && !quizSubmitted}
                                    className={cn(
                                        "flex-1 shadow-lg",
                                        quizIsCorrect === false
                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                            : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                                    )}
                                    size="lg"
                                >
                                    {quizSubmitted ? (
                                        quizIsCorrect ? (
                                            <>
                                                <CheckCircle className="mr-2 h-5 w-5" />
                                                Quiz Completed
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="mr-2 h-5 w-5" />
                                                Try Again
                                            </>
                                        )
                                    ) : (
                                        <>
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            Submit Answers
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {quizFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "p-4 rounded-lg border-2",
                            quizFeedback.includes('Perfect') || quizFeedback.includes('all 3') ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100" :
                            quizFeedback.includes('Good') ? "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-100" :
                            "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-100"
                        )}
                    >
                        {quizFeedback}
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
                                            <span>The reactivity series of metals (Mg {">"} Zn {">"} Fe {">"} Cu)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>Reactive metals displace hydrogen from acids</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>Hydrogen gas (H₂) is produced in metal-acid reactions</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>Why copper cooking vessels are safe with acidic foods</span>
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
                                    Try Again
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
