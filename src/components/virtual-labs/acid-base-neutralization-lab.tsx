'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Trophy, Award, GripVertical, Sparkles, Zap, Beaker, Droplet, TestTube } from 'lucide-react';
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

interface TitrationResult {
    acidVolume: number;
    baseVolume: number;
    equivalencePoint: number;
    completed: boolean;
}

export function AcidBaseNeutralizationLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [collectedSupplies, setCollectedSupplies] = React.useState<string[]>([]);
    
    const labSupplies: SupplyItem[] = [
        { id: 'hcl', name: 'HCl Solution', emoji: '⚗️', description: 'Hydrochloric acid' },
        { id: 'naoh', name: 'NaOH Solution', emoji: '🧪', description: 'Sodium hydroxide' },
        { id: 'indicator', name: 'pH Indicator', emoji: '💧', description: 'To detect equivalence point' },
        { id: 'burette', name: 'Burette', emoji: '🔬', description: 'For precise measurement' },
    ];
    
    // Experiment state
    const [titrations, setTitrations] = React.useState<Record<string, TitrationResult>>({
        '1': { acidVolume: 0, baseVolume: 0, equivalencePoint: 0, completed: false },
        '2': { acidVolume: 0, baseVolume: 0, equivalencePoint: 0, completed: false },
        '3': { acidVolume: 0, baseVolume: 0, equivalencePoint: 0, completed: false }
    });
    const [activeTitration, setActiveTitration] = React.useState<string | null>(null);
    const [titrationStage, setTitrationStage] = React.useState(0); // 0: setup, 1: adding base, 2: color change, 3: complete
    const [completedTitrations, setCompletedTitrations] = React.useState(0);
    const [baseAdded, setBaseAdded] = React.useState(0);
    const [currentColor, setCurrentColor] = React.useState('red');
    const [phValue, setPhValue] = React.useState(1);
    
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
    const labId = 'acid-base-neutralization';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to Acid-Base Neutralization Lab! We'll perform titration - the process of adding one solution to another until they're perfectly balanced. This teaches us about acids, bases, and chemical equilibrium. Let's get started!");
        } else if (currentStep === 'complete') {
            setTeacherMessage("Fantastic work! You've mastered titration and neutralization reactions. This skill is fundamental in chemistry, used in medicine, environmental testing, and industrial processes. Your precision and understanding are impressive!");
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

    const handleAllSuppliesCollected = () => {
        setTeacherMessage("Perfect! All supplies collected! Now let's start the experiment. Click 'Continue to Experiment' to begin!");
    };

    const handleContinueToExperiment = () => {
        setCurrentStep('experiment');
        setTeacherMessage("All supplies ready! Now we'll perform titration - carefully adding base to acid and watching for the color change that indicates neutralization!");
    };
    
    const handleStartTitration = (titrationNum: string) => {
        if (activeTitration) return;
        
        setActiveTitration(titrationNum);
        setTitrationStage(0);
        setBaseAdded(0);
        setCurrentColor('red');
        setPhValue(1);
        setTeacherMessage(`Starting Titration ${titrationNum}. We have 25mL of hydrochloric acid in the flask. Watch the indicator carefully as we add sodium hydroxide drop by drop. The color will change when we reach the equivalence point!`);
        
        setTimeout(() => {
            setTitrationStage(1);
            setTeacherMessage(`Now adding NaOH slowly from the burette. Notice how the red color shows the solution is acidic. Keep adding base gradually...`);
        }, 4500);
    };
    
    const handleAddBase = () => {
        if (titrationStage === 1) {
            const increment = 1; // Add 1mL at a time
            const newBaseVolume = baseAdded + increment;
            setBaseAdded(newBaseVolume);
            
            // Simulate color change as we approach equivalence point
            const equivalencePoint = 25; // mL for perfect neutralization
            if (newBaseVolume < equivalencePoint - 5) {
                setPhValue(Math.min(7 - ((equivalencePoint - newBaseVolume) / 20), 7));
                setCurrentColor('red');
                if (newBaseVolume === 10) {
                    setTeacherMessage(`Good progress! We've added ${newBaseVolume}mL. The solution is still strongly acidic - notice the red color persists.`);
                }
            } else if (newBaseVolume < equivalencePoint) {
                setPhValue(Math.min(7, 1 + (newBaseVolume / 10)));
                setCurrentColor('orange');
                if (newBaseVolume === equivalencePoint - 3) {
                    setTeacherMessage(`We're getting close! The color is starting to change to orange - approaching neutralization. Add carefully now!`);
                }
            } else if (newBaseVolume === equivalencePoint) {
                setPhValue(7);
                setCurrentColor('yellow');
                setTeacherMessage(`Perfect! Equivalence point reached at ${newBaseVolume}mL! The solution is now perfectly neutral at pH 7. The acid and base have completely reacted to form salt and water!`);
                setTitrationStage(2);
            } else {
                setPhValue(Math.min(13, 7 + ((newBaseVolume - equivalencePoint) / 15)));
                setCurrentColor('green');
                if (newBaseVolume === equivalencePoint + 1) {
                    setTeacherMessage(`Notice the solution turned green - we've gone past the equivalence point into basic territory. This shows us the importance of precision in titration!`);
                    setTitrationStage(3);
                }
            }
        }
    };
    
    const handleCompleteTitration = () => {
        if (titrationStage === 3 || (titrationStage === 2 && baseAdded === 25)) {
            const result: TitrationResult = {
                acidVolume: 25,
                baseVolume: baseAdded,
                equivalencePoint: baseAdded === 25 ? 25 : Math.round(baseAdded * 100) / 100,
                completed: true
            };
            
            setTitrations(prev => ({
                ...prev,
                [activeTitration!]: result
            }));
            
            setCompletedTitrations(prev => prev + 1);
            setActiveTitration(null);
            setTeacherMessage(`Titration ${activeTitration} complete! Base used: ${baseAdded}mL`);
            toast({ title: `✅ Titration ${activeTitration} Complete!`, description: `${baseAdded}mL of base used` });
        }
    };
    
    const handleTeacherComplete = () => {
        // Direct state updates - no pending transitions
    };

    const handleViewResults = () => {
        if (completedTitrations < 3) {
            toast({ title: 'Incomplete', description: 'Please complete all three titrations first', variant: 'destructive' });
            return;
        }
        setTeacherMessage("Excellent! You've completed all three titrations. Notice how the results are consistent - each time using approximately 25mL of NaOH to neutralize 25mL of HCl. Let's analyze the results!");
        setCurrentStep('results');
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Let's test your understanding of acid-base chemistry and titration!");
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
        if (quizAnswer2 === 'indicator') correctCount++;
        if (quizAnswer3 === 'colorless') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand acid-base chemistry! +${earnedXP} XP`);
            setTeacherMessage(`Brilliant! All three answers correct! You've mastered titration and neutralization reactions. You earned ${earnedXP} XP! Understanding these concepts is crucial for pharmacy, environmental science, and industrial chemistry. Excellent work!`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Remember the key concepts of neutralization.`);
            setTeacherMessage(`Nice effort! You got ${correctCount} out of 3. You're close to mastering this! Remember: neutralization produces salt and water, and indicators help us detect the equivalence point. Review the titration process and try again!`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Acids and bases react to form salt and water.`);
            setTeacherMessage(`Keep trying! You got ${correctCount} out of 3. The key concept: when acids and bases react, they neutralize each other forming salt and water. The indicator changes color at the equivalence point. Review your titrations and try again - you've got this!`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setCollectedSupplies([]);
        setTitrations({
            '1': { acidVolume: 0, baseVolume: 0, equivalencePoint: 0, completed: false },
            '2': { acidVolume: 0, baseVolume: 0, equivalencePoint: 0, completed: false },
            '3': { acidVolume: 0, baseVolume: 0, equivalencePoint: 0, completed: false }
        });
        setActiveTitration(null);
        setTitrationStage(0);
        setCompletedTitrations(0);
        setBaseAdded(0);
        setCurrentColor('red');
        setPhValue(1);
        setQuizAnswer1(undefined);
        setQuizAnswer2(undefined);
        setQuizAnswer3(undefined);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setTeacherMessage("Wonderful! Let's perform the titration again. Each repetition helps you understand the precision and technique needed for accurate neutralization. Watch how the color changes as you approach the equivalence point!");
    };

    return (
        <div className="relative min-h-screen pb-20">
            {/* Premium Animated Background - Blue/Purple Acid-Base Theme */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-indigo-950/30" />
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-blue-200/40 to-purple-300/40 dark:from-blue-800/20 dark:to-purple-900/20 blur-3xl"
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

            {isCompleted && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                            <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Lab Completed!</h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
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
                    <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-blue-600" />
                                Acid-Base Neutralization Lab
                            </CardTitle>
                            <CardDescription>Master titration and learn about chemical neutralization</CardDescription>
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
                                <p><strong>Titration</strong> is a laboratory method used to determine the concentration of a solution by reacting it with a solution of known concentration.</p>
                                <p className="mt-2"><strong>The pH Scale:</strong></p>
                                <ul>
                                    <li><strong>pH 0-6:</strong> Acidic solutions (more H⁺ ions)</li>
                                    <li><strong>pH 7:</strong> Neutral solution</li>
                                    <li><strong>pH 8-14:</strong> Basic/Alkaline solutions (more OH⁻ ions)</li>
                                </ul>
                                <p className="mt-2"><strong>Neutralization Reaction:</strong></p>
                                <p className="font-mono bg-slate-100 dark:bg-slate-900 p-2 rounded">Acid + Base → Salt + Water<br />HCl + NaOH → NaCl + H₂O</p>
                                <p className="mt-2"><strong>Equivalence Point:</strong></p>
                                <p>The point at which the acid and base are completely neutralized - moles of acid = moles of base.</p>
                                <p className="mt-2"><strong>Indicators:</strong></p>
                                <ul>
                                    <li>Phenolphthalein: Red in basic, colorless in acidic</li>
                                    <li>Methyl orange: Red in acidic, yellow in basic</li>
                                    <li>pH paper: Shows exact pH with color scale</li>
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
                                    <li>Always wear safety goggles - acid and base splashes cause eye damage</li>
                                    <li>Wear laboratory coat and nitrile gloves</li>
                                    <li>If acid or base contacts skin, wash immediately with running water</li>
                                    <li>Work with dilute solutions (1M or less) in this lab</li>
                                    <li>Never add water to acid - always add acid to water</li>
                                    <li>Keep spill kits nearby</li>
                                    <li>Work in a well-ventilated area</li>
                                    <li>Handle burettes carefully - they can break if dropped</li>
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
                        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle>Welcome to Acid-Base Neutralization Lab!</CardTitle>
                                <CardDescription>Learn about titration and chemical neutralization</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <div className="flex items-start gap-4">
                                        <Zap className="w-16 h-16 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">What You'll Learn:</h3>
                                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                                <li>• How to perform acid-base titration with precision</li>
                                                <li>• Understanding the pH scale and neutralization</li>
                                                <li>• Using indicators to detect equivalence points</li>
                                                <li>• Calculating concentration from titration data</li>
                                                <li>• Real-world applications of titration</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleStartExperiment} 
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg" 
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
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg" 
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
                        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Beaker className="h-5 w-5 text-blue-600" />
                                    Perform Titrations
                                </CardTitle>
                                <CardDescription>Completed titrations: {completedTitrations}/3</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {activeTitration && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border-2 border-blue-300 dark:border-blue-700"
                                    >
                                        <h3 className="font-semibold text-lg mb-4">Titration {activeTitration} in Progress</h3>
                                        
                                        <div className="space-y-4">
                                            {/* Color indicator */}
                                            <div className="flex items-center gap-4">
                                                <div className="text-sm font-medium min-w-fit">Solution Color:</div>
                                                <motion.div
                                                    animate={{ scale: [1, 1.05, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                    className={cn(
                                                        "w-20 h-20 rounded-full border-4 transition-all",
                                                        currentColor === 'red' && "bg-red-400 border-red-600",
                                                        currentColor === 'orange' && "bg-orange-400 border-orange-600",
                                                        currentColor === 'yellow' && "bg-yellow-400 border-yellow-600",
                                                        currentColor === 'green' && "bg-green-400 border-green-600"
                                                    )}
                                                />
                                            </div>
                                            
                                            {/* pH display */}
                                            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="text-sm text-muted-foreground mb-2">pH: {phValue.toFixed(1)}</div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                                        style={{ width: `${(phValue / 14) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Volume display */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                                    <div className="text-xs text-muted-foreground">HCl Volume</div>
                                                    <div className="text-lg font-bold">25.0 mL</div>
                                                </div>
                                                <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                                    <div className="text-xs text-muted-foreground">NaOH Added</div>
                                                    <div className="text-lg font-bold">{baseAdded.toFixed(1)} mL</div>
                                                </div>
                                            </div>
                                            
                                            {/* Stage indicator */}
                                            <div className={cn("text-sm text-center p-3 rounded-lg border-2", 
                                                titrationStage === 0 && "text-muted-foreground border-gray-300 dark:border-gray-700",
                                                titrationStage === 1 && "text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30",
                                                titrationStage === 2 && "text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 font-semibold",
                                                titrationStage === 3 && "text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30 font-semibold"
                                            )}>
                                                {titrationStage === 0 && "Setting up..."}
                                                {titrationStage === 1 && "Click 'Add Base' to continue - watch for color change!"}
                                                {titrationStage === 2 && "🎯 Perfect! Equivalence point reached! Click 'Complete Titration' button now →"}
                                                {titrationStage === 3 && "⚠️ Past equivalence point! Click 'Complete Titration' to finish →"}
                                            </div>
                                        </div>
                        
                                        <div className="flex gap-3 mt-6">
                                            <Button onClick={handleAddBase} disabled={titrationStage !== 1} className="flex-1">
                                                Add Base (1mL)
                                            </Button>
                                            <Button 
                                                onClick={handleCompleteTitration} 
                                                disabled={titrationStage < 2} 
                                                variant={titrationStage >= 2 ? "default" : "outline"}
                                                className={cn("flex-1", titrationStage >= 2 && "animate-pulse bg-green-600 hover:bg-green-700")}
                                            >
                                                {titrationStage >= 2 ? "✓ Complete Titration" : "Complete"}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                                
                                {!activeTitration && (
                                    <>
                                        {[1, 2, 3].map((num) => (
                                            <motion.div
                                                key={num}
                                                className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/30"
                                                whileHover={!titrations[num.toString()].completed ? { scale: 1.02 } : {}}
                                            >
                                                <h3 className="font-semibold mb-2">Titration {num}</h3>
                                                <p className="text-sm text-muted-foreground mb-4">25mL of HCl solution - titrate with NaOH</p>
                                                {!titrations[num.toString()].completed ? (
                                                    <Button onClick={() => handleStartTitration(num.toString())} disabled={activeTitration !== null}>
                                                        Start Titration {num}
                                                    </Button>
                                                ) : (
                                                    <div className="p-3 rounded text-sm font-medium bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100">
                                                        ✅ Complete: {titrations[num.toString()].baseVolume.toFixed(1)}mL used
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleViewResults} 
                                    disabled={completedTitrations < 3} 
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg disabled:opacity-50" 
                                    size="lg"
                                >
                                    View Results ({completedTitrations}/3)
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
                        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                    Titration Results & Analysis
                                </CardTitle>
                                <CardDescription>Summary of all three titrations</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <h3 className="font-semibold">Individual Titration Results:</h3>
                                    {[1, 2, 3].map((num) => (
                                        <motion.div
                                            key={num}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: num * 0.1 }}
                                            className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Titration {num}:</span>
                                                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{titrations[num.toString()].baseVolume.toFixed(1)} mL NaOH</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Findings:</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Consistent Results:</strong> All three titrations used approximately the same volume of NaOH, showing reproducibility in the experiment.
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Equivalence Point:</strong> The solution's color changed from red (acidic) to yellow (neutral) at approximately 25mL, indicating the equivalence point where moles of acid = moles of base.
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Neutralization Verified:</strong> The indicator color change confirms the reaction: HCl + NaOH → NaCl + H₂O
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>1:1 Molar Ratio:</strong> Since both solutions are 1M, and equal volumes neutralized, this demonstrates the stoichiometry of the neutralization reaction.
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold mb-2">Real-World Applications:</h3>
                                    <ul className="text-sm space-y-2">
                                        <li>• <strong>Water Testing:</strong> Measuring acid/base content in water samples</li>
                                        <li>• <strong>Pharmaceutical Industry:</strong> Quality control of medications</li>
                                        <li>• <strong>Environmental Monitoring:</strong> Testing pH of soil and water</li>
                                        <li>• <strong>Food Industry:</strong> Determining acidity in wines and beverages</li>
                                        <li>• <strong>Laboratory Analysis:</strong> Determining unknown concentrations</li>
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleViewQuiz} 
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg" 
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
                                <CardDescription>Test your understanding of acid-base chemistry</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">1. In neutralization reactions, what reacts with the acid?</Label>
                                    <div className="grid gap-3">
                                        {[
                                            { value: 'both', label: 'Both a base and water to form salt and water', isCorrect: true },
                                            { value: 'water', label: 'Only water molecules' },
                                            { value: 'salt', label: 'Another acid to form a salt' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={!quizSubmitted ? { scale: 1.02 } : {}}
                                                whileTap={!quizSubmitted ? { scale: 0.98 } : {}}
                                                onClick={() => !quizSubmitted && setQuizAnswer1(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer1 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                                                    quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizSubmitted && quizAnswer1 === option.value && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    !quizSubmitted && quizAnswer1 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer1 === option.value ? "border-blue-500 bg-blue-500" : "border-gray-300"
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
                                    <Label className="text-base font-semibold">2. Why is a pH indicator essential in titration?</Label>
                                    <div className="grid gap-3">
                                        {[
                                            { value: 'indicator', label: 'To visibly show when equivalence point is reached', isCorrect: true },
                                            { value: 'speed', label: 'To make the reaction happen faster' },
                                            { value: 'temp', label: 'To control the temperature of the solution' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={!quizSubmitted ? { scale: 1.02 } : {}}
                                                whileTap={!quizSubmitted ? { scale: 0.98 } : {}}
                                                onClick={() => !quizSubmitted && setQuizAnswer2(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer2 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                                                    quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizSubmitted && quizAnswer2 === option.value && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    !quizSubmitted && quizAnswer2 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer2 === option.value ? "border-blue-500 bg-blue-500" : "border-gray-300"
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
                                    <Label className="text-base font-semibold">3. What is the color of phenolphthalein in the acidic solution before neutralization?</Label>
                                    <div className="grid gap-3">
                                        {[
                                            { value: 'pink', label: 'Pink/Red' },
                                            { value: 'colorless', label: 'Colorless', isCorrect: true },
                                            { value: 'blue', label: 'Blue' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={!quizSubmitted ? { scale: 1.02 } : {}}
                                                whileTap={!quizSubmitted ? { scale: 0.98 } : {}}
                                                onClick={() => !quizSubmitted && setQuizAnswer3(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer3 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                                                    quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizSubmitted && quizAnswer3 === option.value && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    !quizSubmitted && quizAnswer3 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer3 === option.value ? "border-blue-500 bg-blue-500" : "border-gray-300"
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
                                            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
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
                        <Card className="border-2 border-yellow-300 dark:border-yellow-700 bg-gradient-to-br from-yellow-50/90 via-blue-50/90 to-purple-50/90 dark:from-yellow-950/90 dark:via-blue-950/90 dark:to-purple-950/90 backdrop-blur-sm shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-blue-400/20 to-purple-400/20 animate-pulse" />
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
                                <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Lab Complete!
                                </h2>
                                {xpEarned > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="flex items-center justify-center gap-2 text-3xl font-black text-blue-600 dark:text-blue-400"
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
                                            <span>How to accurately perform titration</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>Understanding pH and neutralization reactions</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>Using indicators to detect equivalence points</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span>Stoichiometry and molar ratios in reactions</span>
                                        </li>
                                    </ul>
                                </div>
                                <Button 
                                    onClick={handleRestart} 
                                    variant="outline" 
                                    className="mt-6 border-2 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20"
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
