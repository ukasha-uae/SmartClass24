'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Trophy, Award, TestTube, Flame, Droplets, Sparkles, AlertTriangle, Package, Zap, Wind } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { TextToSpeech } from '../text-to-speech';
import { LabNotes } from './LabNotes';

type Step = 'intro' | 'setup' | 'experiment' | 'results' | 'quiz' | 'complete';
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
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
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
    
    // XP and completion
    const [xpEarned, setXpEarned] = React.useState(0);
    const [showCelebration, setShowCelebration] = React.useState(false);
    const { markLabComplete, isLabCompleted, getLabCompletion, totalXP } = useLabProgress();
    const labId = 'metal-acid-reaction';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);
    const alreadyCompleted = completion !== null;

    // UI state
    const [showSupplies, setShowSupplies] = React.useState(false);
    const [showPractice, setShowPractice] = React.useState(false);
    const [practiceInteraction, setPracticeInteraction] = React.useState<string | null>(null);

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
        setTeacherMessage("Perfect! Let's begin! You'll test metals with hydrochloric acid. Select a metal, add it to the acid, and observe carefully. Look for bubbles (that's hydrogen gas!), heat production, and how fast the metal dissolves. This reveals the reactivity series!");
        setPendingTransition(() => () => {
            setCurrentStep('setup');
        });
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
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null);
            transition();
        }
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
        setPendingTransition(() => () => {
            setCurrentStep('results');
        });
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Time to test your understanding of metal reactivity!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
        });
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        if (quizAnswer1 === 'hydrogen') correctCount++;
        if (quizAnswer2 === 'magnesium') correctCount++;
        if (quizAnswer3 === 'copper') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand metal reactivity! +${earnedXP} XP`);
            setTeacherMessage(`Outstanding! Perfect score! You've mastered the reactivity series. You understand why magnesium reacts vigorously, why copper doesn't react, and how hydrogen gas is produced. Excellent work! +${earnedXP} XP earned!`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Review the reactivity series.`);
            setTeacherMessage(`Good effort! You got ${correctCount} out of 3 correct. Remember: more reactive metals like magnesium displace hydrogen from acids, while less reactive metals like copper don't react. Review your observations and try again!`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: more reactive metals displace hydrogen from acids.`);
            setTeacherMessage(`Keep trying! You got ${correctCount} correct. Let me help: The reactivity series goes Magnesium > Zinc > Iron > Copper. Reactive metals produce hydrogen gas (H₂) when added to acid. Review your experiment observations and give it another go!`);
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
        setShowCelebration(false);
        setPendingTransition(null);
        setTeacherMessage("Welcome back! Let's explore metal reactivity again. Remember what you learned: the reactivity series, hydrogen gas production, and why different metals behave differently with acids. Ready to start?");
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Teacher Voice */}
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
                emotion={currentStep === 'complete' ? 'celebrating' : observations.length >= 3 ? 'happy' : 'explaining'}
                context={{
                    attempts: observations.length,
                    correctStreak: observations.filter(obs => obs.bubbles).length
                }}
                quickActions={[
                    { label: 'Reset Lab', icon: '🔄', onClick: handleRestart },
                    { label: 'View Theory', icon: '📖', onClick: () => document.querySelector('[value="theory"]')?.parentElement?.click() },
                    { label: 'Safety Tips', icon: '🛡️', onClick: () => document.querySelector('[value="safety"]')?.parentElement?.click() }
                ]}
            />

            {isCompleted && (
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
                            className="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 text-white rounded-3xl p-8 shadow-2xl max-w-md mx-4"
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
                                🎉
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

            <Card className="border-2 border-orange-200 dark:border-orange-800">
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="flex items-center gap-2">
                            <TestTube className="h-5 w-5 text-orange-600" />
                            Objective
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            {alreadyCompleted && (
                                <span className="text-xs sm:text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                    Completed
                                </span>
                            )}
                            <TextToSpeech textToSpeak="To investigate and observe how different metals react with hydrochloric acid and understand the reactivity series of metals." />
                        </div>
                    </div>
                    <CardDescription>To investigate and observe how different metals react with hydrochloric acid and understand the reactivity series of metals.</CardDescription>
                </CardHeader>
            </Card>

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
                                <Button onClick={handleStartExperiment} className="w-full" size="lg">
                                    Start Experiment
                                </Button>
                            </CardFooter>
                        </Card>
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
                        <Card className="border-2 border-orange-200 dark:border-orange-800">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <TestTube className="h-5 w-5 text-orange-600" />
                                            Test Metal Reactivity
                                        </CardTitle>
                                        <CardDescription>Metals tested: {observations.length}/3+</CardDescription>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => setShowSupplies(!showSupplies)}
                                            className="text-xs sm:text-sm"
                                        >
                                            <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                            {showSupplies ? 'Hide' : 'Show'} Supplies
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => setShowPractice(!showPractice)}
                                            className="text-xs sm:text-sm"
                                        >
                                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                            {showPractice ? 'Hide' : 'Show'} Practice
                                        </Button>
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
                                    className="w-full"
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
                                    variant="outline"
                                    className="w-full"
                                    size="lg"
                                >
                                    View Results ({observations.length}/3 metals tested)
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Lab Supplies Drawer */}
                        {showSupplies && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Package className="h-5 w-5 text-amber-600" />
                                            Lab Supplies - Equipment Information
                                        </CardTitle>
                                        <CardDescription>Learn about the equipment used in this experiment</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-2 border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <TestTube className="h-8 w-8 text-blue-600" />
                                                    <h4 className="font-semibold">Test Tubes</h4>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Glass containers for holding small amounts of chemicals during reactions. Resistant to heat and most acids.
                                                </p>
                                            </div>
                                            
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-2 border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Droplets className="h-8 w-8 text-blue-400" />
                                                    <h4 className="font-semibold">Hydrochloric Acid (HCl)</h4>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    A strong acid that reacts with most metals to produce hydrogen gas and metal salts. Handle with care!
                                                </p>
                                            </div>

                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-2 border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Shield className="h-8 w-8 text-orange-600" />
                                                    <h4 className="font-semibold">Safety Goggles</h4>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Essential eye protection when working with acids. Protects against splashes and fumes.
                                                </p>
                                            </div>

                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-2 border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Wind className="h-8 w-8 text-cyan-600" />
                                                    <h4 className="font-semibold">Fume Hood</h4>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Ventilation system that removes harmful fumes and gases from the work area. Always work in a ventilated space!
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Practice Mode */}
                        {showPractice && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className="border-2 border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-violet-600" />
                                            Practice Mode - Explore & Learn
                                        </CardTitle>
                                        <CardDescription>Click on cards to learn more about metal reactivity</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <Card 
                                                className="cursor-pointer hover:shadow-lg transition-shadow border-2"
                                                onClick={() => setPracticeInteraction('reactivity')}
                                            >
                                                <CardHeader>
                                                    <CardTitle className="text-base">⚡ Reactivity Series</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground">
                                                        {practiceInteraction === 'reactivity'
                                                            ? "The reactivity series ranks metals from most to least reactive. Magnesium > Zinc > Iron > Copper. More reactive metals displace less reactive metals from solutions!"
                                                            : "Tap to learn about metal reactivity order"}
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card 
                                                className="cursor-pointer hover:shadow-lg transition-shadow border-2"
                                                onClick={() => setPracticeInteraction('hydrogen')}
                                            >
                                                <CardHeader>
                                                    <CardTitle className="text-base">💨 Hydrogen Gas (H₂)</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground">
                                                        {practiceInteraction === 'hydrogen'
                                                            ? "Hydrogen gas is produced when reactive metals displace hydrogen from acids. It's colorless, odorless, and highly flammable! The 'pop test' confirms its presence."
                                                            : "Tap to learn about hydrogen gas"}
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card 
                                                className="cursor-pointer hover:shadow-lg transition-shadow border-2"
                                                onClick={() => setPracticeInteraction('realworld')}
                                            >
                                                <CardHeader>
                                                    <CardTitle className="text-base">🌍 Real-World Applications</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground">
                                                        {practiceInteraction === 'realworld'
                                                            ? "Reactivity series explains why: copper pots are used in cooking (safe with acidic foods), zinc is used for galvanization, and magnesium is used in fireworks!"
                                                            : "Tap to see practical applications"}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {currentStep === 'results' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-orange-200 dark:border-orange-800">
                            <CardHeader>
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
                                <Button onClick={handleViewQuiz} className="w-full" size="lg">
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Knowledge Check</CardTitle>
                                <CardDescription>Test your understanding of metal reactivity</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. What gas is produced when a metal reacts with acid?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'hydrogen', label: 'Hydrogen (H₂)', isCorrect: true },
                                            { value: 'oxygen', label: 'Oxygen (O₂)' },
                                            { value: 'carbon', label: 'Carbon Dioxide (CO₂)' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer1(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer1 === option.value && !quizSubmitted && "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
                                                    quizAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer1 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer1 === option.value && !quizSubmitted && "border-orange-500 bg-orange-500",
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
                                <div className="space-y-3">
                                    <p className="font-medium">2. Which metal reacts most vigorously with dilute hydrochloric acid?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'magnesium', label: 'Magnesium', isCorrect: true },
                                            { value: 'zinc', label: 'Zinc' },
                                            { value: 'copper', label: 'Copper' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer2(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer2 === option.value && !quizSubmitted && "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
                                                    quizAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer2 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer2 === option.value && !quizSubmitted && "border-orange-500 bg-orange-500",
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
                                <div className="space-y-3">
                                    <p className="font-medium">3. Which metal does NOT react with dilute hydrochloric acid?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'copper', label: 'Copper', isCorrect: true },
                                            { value: 'magnesium2', label: 'Magnesium' },
                                            { value: 'iron', label: 'Iron' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer3(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer3 === option.value && !quizSubmitted && "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
                                                    quizAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer3 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer3 === option.value && !quizSubmitted && "border-orange-500 bg-orange-500",
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
                                    disabled={!quizAnswer1 || !quizAnswer2 || !quizAnswer3 || quizSubmitted}
                                    className="flex-1"
                                    size="lg"
                                >
                                    Submit Answers
                                </Button>
                                {quizSubmitted && !quizFeedback.includes('all 3') && (
                                    <Button onClick={() => {
                                        setQuizAnswer1(undefined);
                                        setQuizAnswer2(undefined);
                                        setQuizAnswer3(undefined);
                                        setQuizFeedback('');
                                        setQuizSubmitted(false);
                                    }} variant="outline" size="lg">
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
                        <Card className="border-2 border-orange-200 dark:border-orange-800">
                            <CardHeader className="text-center">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="flex justify-center mb-4"
                                >
                                    <Trophy className="h-16 w-16 text-yellow-500" />
                                </motion.div>
                                <CardTitle>Lab Complete!</CardTitle>
                                <CardDescription>You've mastered metal reactivity!</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 p-6 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <span>The reactivity series of metals (Mg {">"} Zn {">"} Fe {">"} Cu)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <span>Reactive metals displace hydrogen from acids</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <span>Hydrogen gas (H₂) is produced in metal-acid reactions</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <span>Why copper cooking vessels are safe with acidic foods</span>
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

                        {/* Lab Notes */}
                        <LabNotes labId="metal-acid-reaction-lab" labTitle="Metal-Acid Reaction Lab" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
