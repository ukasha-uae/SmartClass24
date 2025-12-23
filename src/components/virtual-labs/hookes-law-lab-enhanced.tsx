'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Move, Scale, Trophy, Award, GripVertical, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';

interface DataPoint {
    mass: number;
    force: number;
    extension: number;
}

type MassValue = 50 | 100 | 150 | 200 | 250;
type Step = 'intro' | 'collect-supplies' | 'experiment' | 'results' | 'quiz' | 'complete';

const masses: MassValue[] = [50, 100, 150, 200, 250];

const SPRING_CONSTANT_K = 0.5;
const GRAVITY_g = 10;

export function HookesLawLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Supplies tracking
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [springCollected, setSpringCollected] = React.useState(false);
    const [massesCollected, setMassesCollected] = React.useState(false);
    const [rulerCollected, setRulerCollected] = React.useState(false);
    const [dataTableCollected, setDataTableCollected] = React.useState(false);
    
    // Experiment state
    const [data, setData] = React.useState<DataPoint[]>([]);
    const [totalMass, setTotalMass] = React.useState(0);
    const [isSimulating, setIsSimulating] = React.useState(false);
    const [selectedMass, setSelectedMass] = React.useState<MassValue | null>(null);
    
    // Quiz state
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizAnswer2, setQuizAnswer2] = React.useState<string | undefined>();
    const [quizAnswer3, setQuizAnswer3] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState('');
    const [quizSubmitted, setQuizSubmitted] = React.useState(false);
    
    // XP and completion
    const [xpEarned, setXpEarned] = React.useState(0);
    const [showCelebration, setShowCelebration] = React.useState(false);
    const { markLabComplete, isLabCompleted, getLabCompletion } = useLabProgress();
    const labId = 'hookes-law';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    // Draggable teacher
    const [teacherPosition, setTeacherPosition] = React.useState({ x: 0, y: 0 });

    const currentExtension = totalMass > 0 ? (totalMass / 1000 * GRAVITY_g) / SPRING_CONSTANT_K : 0;
    const currentForce = totalMass / 1000 * GRAVITY_g;

    // Intro message
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to Hooke's Law Lab! We'll explore the relationship between force and spring extension. Hooke's Law states that F = kx, where F is force, k is the spring constant, and x is the extension. Let's gather our supplies and verify this fundamental law!");
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setTeacherMessage("Great! Let's gather our supplies. Start by clicking on the SPRING - this is what we'll test!");
        setPendingTransition(() => () => {
            setCurrentStep('collect-supplies');
        });
    };
    
    const handleCollectSpring = () => {
        if (!springCollected) {
            setSpringCollected(true);
            setTeacherMessage("Perfect! Now click on the MASSES - we'll use these to apply different forces!");
            toast({ title: '✅ Spring Collected' });
        }
    };
    
    const handleCollectMasses = () => {
        if (springCollected && !massesCollected) {
            setMassesCollected(true);
            setTeacherMessage("Excellent! Now click on the RULER - we need to measure the extension accurately!");
            toast({ title: '✅ Masses Collected' });
        }
    };
    
    const handleCollectRuler = () => {
        if (massesCollected && !rulerCollected) {
            setRulerCollected(true);
            setTeacherMessage("Great! Finally, click on the DATA TABLE - we'll record our measurements!");
            toast({ title: '✅ Ruler Collected' });
        }
    };
    
    const handleCollectDataTable = () => {
        if (rulerCollected && !dataTableCollected) {
            setDataTableCollected(true);
            setShowSupplies(false);
            setTeacherMessage("Perfect! All supplies ready. Now we'll add masses to the spring and measure how far it extends. Let's verify Hooke's Law!");
            toast({ title: '✅ All Supplies Collected!' });
            setPendingTransition(() => () => {
                setCurrentStep('experiment');
            });
        }
    };
    
    const handleAddMass = (mass: MassValue) => {
        if (isSimulating || totalMass + mass > 250) return;
        
        setIsSimulating(true);
        setSelectedMass(null);
        const newTotalMass = totalMass + mass;
        const force = newTotalMass / 1000 * GRAVITY_g;
        const extension = force / SPRING_CONSTANT_K;
        
        setTeacherMessage(`Adding a ${mass}g mass... Watch the spring extend!`);
        
        setTimeout(() => {
            setTotalMass(newTotalMass);
            setData(prevData => 
                [...prevData, { 
                    mass: newTotalMass, 
                    force: parseFloat(force.toFixed(2)), 
                    extension: parseFloat(extension.toFixed(2)) 
                }].sort((a, b) => a.mass - b.mass)
            );
            setIsSimulating(false);
            toast({ title: `✅ ${mass}g Added`, description: `New extension: ${extension.toFixed(2)} cm` });
            setTeacherMessage(`The spring extended by ${extension.toFixed(2)} cm with ${mass}g added. Notice how the extension increases proportionally with the force!`);
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
        if (data.length === 0) {
            toast({ title: 'No Data', description: 'Please add at least one mass first', variant: 'destructive' });
            return;
        }
        setTeacherMessage("Excellent! You've collected data demonstrating Hooke's Law. Notice how the extension increases linearly with force - the spring constant remains constant! Now test your understanding with the quiz.");
        setPendingTransition(() => () => {
            setCurrentStep('results');
        });
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Let's test your understanding of Hooke's Law with these questions!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
        });
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        if (quizAnswer === '0.5') correctCount++;
        if (quizAnswer2 === 'linear') correctCount++;
        if (quizAnswer3 === 'stiffness') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand Hooke's Law! +${earnedXP} XP`);
            setTeacherMessage(`Outstanding! Perfect score! 🎉 You've completely mastered Hooke's Law! Let me explain what you discovered: HOOKE'S LAW states F = kx, where F is the applied force, x is extension, and k is the spring constant (stiffness). From your graph: when force doubled from 5N to 10N, extension doubled from 0.25m to 0.50m - that's LINEAR relationship! The spring constant k = F/x = 10N ÷ 0.50m = 20 N/m. This tells us how stiff the spring is. A stiffer spring (higher k) needs more force for the same extension. The relationship is LINEAR only in the elastic region - if you stretch too far, the spring deforms permanently (plastic deformation). Real applications: car suspension (springs absorb bumps), weighing scales (force stretches spring, scale measures extension), door closers, shock absorbers, trampolines. You understand force, extension, proportionality, and material properties! +${earnedXP} XP earned!`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Remember Hooke's Law: F = kx.`);
            setTeacherMessage(`Good effort! You got 2 out of 3 correct. Let me clarify Hooke's Law: The relationship between force and extension is LINEAR - when you double the force, extension doubles too. The formula is F = kx, where k is the spring constant (stiffness). From your data: extension = 0.50m when force = 10N, so k = F/x = 10N ÷ 0.50m = 20 N/m. The spring constant measures STIFFNESS - how much force is needed to stretch the spring by 1 meter. Higher k = stiffer spring. Plot your data and you'll see a straight line through the origin! Review the measurements and try again.`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. The spring constant k is a measure of stiffness - stiffer springs have larger k values.`);
            setTeacherMessage(`Keep trying! You got ${correctCount} correct. Let me help you understand Hooke's Law: When you applied 10N force, the spring extended 0.50m (50cm). That means k = F/x = 10N ÷ 0.50m = 20 N/m. The relationship is LINEAR - doubling force doubles extension. Plot force (y-axis) vs. extension (x-axis) and you get a straight line. The slope of this line is the spring constant k, which measures STIFFNESS. A stiff spring (high k) barely stretches under force. A soft spring (low k) stretches easily. This only works in the elastic limit - stretch too far and the spring breaks! Try calculating k from your measurements again.`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setShowSupplies(true);
        setSpringCollected(false);
        setMassesCollected(false);
        setRulerCollected(false);
        setDataTableCollected(false);
        setData([]);
        setTotalMass(0);
        setSelectedMass(null);
        setQuizAnswer(undefined);
        setQuizAnswer2(undefined);
        setQuizAnswer3(undefined);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setPendingTransition(null);
        setTeacherMessage("Ready to explore Hooke's Law again!");
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Teacher Voice */}
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
                emotion={currentStep === 'complete' ? 'celebrating' : data.length >= 3 ? 'happy' : 'explaining'}
                context={{
                    attempts: data.length
                }}
                quickActions={[
                    { label: 'Reset Lab', onClick: handleRestart },
                    { label: 'View Theory', onClick: () => document.querySelector('[value="theory"]')?.parentElement?.click() },
                    { label: 'Safety Tips', onClick: () => document.querySelector('[value="safety"]')?.parentElement?.click() }
                ]}
            />

            {isCompleted && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4"
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

            {showCelebration && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
                >
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader className="text-center">
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                                className="flex justify-center mb-4"
                            >
                                <Trophy className="h-20 w-20 text-yellow-500" />
                            </motion.div>
                            <CardTitle className="text-2xl">Congratulations!</CardTitle>
                            <CardDescription>You've mastered Hooke's Law!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-blue-600">
                                <Award className="h-8 w-8" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You understand the linear relationship between force and extension!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Scale className="h-5 w-5 text-blue-600" />
                        Hooke's Law Lab
                    </CardTitle>
                    <CardDescription>Explore the relationship between force and spring extension</CardDescription>
                </CardHeader>
            </Card>

            <Card>
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
                                <p><strong>Hooke's Law</strong> states that the force (F) needed to extend or compress a spring by a distance (x) is directly proportional to that distance: <strong>F = kx</strong></p>
                                <p>Where:</p>
                                <ul>
                                    <li><strong>F</strong> is the force applied (in Newtons)</li>
                                    <li><strong>k</strong> is the spring constant (a measure of stiffness)</li>
                                    <li><strong>x</strong> is the displacement or extension (in meters or centimeters)</li>
                                </ul>
                                <p>A stiffer spring has a larger spring constant (k). The negative sign in the full equation F = -kx indicates that the restoring force opposes the displacement.</p>
                                <p><strong>Real-world applications:</strong></p>
                                <ul>
                                    <li>Car suspension systems use springs to absorb shock</li>
                                    <li>Scales use springs to measure weight</li>
                                    <li>Pogo sticks and trampolines rely on spring mechanics</li>
                                    <li>Seismic monitoring uses springs in sensitive instruments</li>
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
                                    <li>Do not exceed a spring's elastic limit - it can permanently deform or break</li>
                                    <li>Wear safety goggles to protect against spring failure</li>
                                    <li>Be careful when releasing springs under tension</li>
                                    <li>Keep your fingers clear of the spring's path of motion</li>
                                    <li>Never hang from springs or apply sudden forces</li>
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Welcome to Hooke's Law Lab!</CardTitle>
                                <CardDescription>Discover the linear relationship between force and spring extension</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <div className="flex items-start gap-4">
                                        <Scale className="w-16 h-16 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">What You'll Learn:</h3>
                                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                                <li>• Hooke's Law: F = kx (the linear relationship)</li>
                                                <li>• Spring constant (k) as a measure of stiffness</li>
                                                <li>• How to experimentally verify Hooke's Law</li>
                                                <li>• Real-world applications of springs</li>
                                                <li>• Data collection and graphical analysis</li>
                                            </ul>
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

                {currentStep === 'collect-supplies' && (
                    <motion.div
                        key="collect-supplies"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Sparkles className="h-5 w-5 text-amber-600" />
                                    Lab Supplies - Click to Collect
                                </CardTitle>
                                <CardDescription>Click on each item in order to collect them</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-6 justify-center flex-wrap">
                                    {/* Spring */}
                                    {!springCollected && (
                                        <motion.div
                                            onClick={handleCollectSpring}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-blue-400 dark:border-blue-600 hover:border-blue-600 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <svg width="48" height="80" viewBox="0 0 48 80" className="text-blue-500">
                                                    <path d="M 24 0 C 16 8, 32 8, 24 16 C 16 24, 32 24, 24 32 C 16 40, 32 40, 24 48 C 16 56, 32 56, 24 64 M 24 64 L 24 80" stroke="currentColor" fill="none" strokeWidth="2"/>
                                                </svg>
                                                <span className="text-sm font-medium">Spring</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Masses */}
                                    {springCollected && !massesCollected && (
                                        <motion.div
                                            onClick={handleCollectMasses}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-amber-400 dark:border-amber-600 hover:border-amber-600 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="flex gap-1">
                                                    {[0, 1, 2].map((i) => (
                                                        <div key={i} className="w-6 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-sm" />
                                                    ))}
                                                </div>
                                                <span className="text-sm font-medium">Masses (50-250g)</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Ruler */}
                                    {massesCollected && !rulerCollected && (
                                        <motion.div
                                            onClick={handleCollectRuler}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-green-400 dark:border-green-600 hover:border-green-600 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-32 h-4 bg-yellow-100 border-2 border-yellow-800 rounded flex">
                                                    {Array.from({ length: 16 }).map((_, i) => (
                                                        <div key={i} className={cn("flex-1 border-r border-yellow-800", i % 4 === 0 && "h-full", i % 4 !== 0 && "h-2/3")} />
                                                    ))}
                                                </div>
                                                <span className="text-sm font-medium">Ruler (cm)</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Data Table */}
                                    {rulerCollected && !dataTableCollected && (
                                        <motion.div
                                            onClick={handleCollectDataTable}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-purple-400 dark:border-purple-600 hover:border-purple-600 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-24 space-y-1">
                                                    {Array.from({ length: 3 }).map((_, i) => (
                                                        <div key={i} className="w-full h-3 bg-purple-200 rounded-sm" />
                                                    ))}
                                                </div>
                                                <span className="text-sm font-medium">Data Table</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Collected Items Display */}
                                    <div className="w-full mt-4 flex gap-4 justify-center flex-wrap">
                                        {springCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm">Spring</span>
                                            </motion.div>
                                        )}
                                        {massesCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-amber-600" />
                                                <span className="text-sm">Masses</span>
                                            </motion.div>
                                        )}
                                        {rulerCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <span className="text-sm">Ruler</span>
                                            </motion.div>
                                        )}
                                        {dataTableCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-purple-600" />
                                                <span className="text-sm">Data Table</span>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'experiment' && (
                    <motion.div
                        key="experiment"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-blue-200 dark:border-blue-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Move className="h-5 w-5 text-blue-600" />
                                    Experiment: Add Masses to Spring
                                </CardTitle>
                                <CardDescription>Click each mass to add it to the spring and record the extension</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Mass Selection */}
                                    <div className="space-y-4">
                                        <p className="font-semibold">Available Masses:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {masses.map(mass => (
                                                <motion.div
                                                    key={mass}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => !isSimulating && totalMass + mass <= 250 && setSelectedMass(mass)}
                                                    className={cn(
                                                        "p-2 border bg-card rounded-lg flex items-center gap-2 text-sm shadow-md cursor-pointer transition-all",
                                                        selectedMass === mass && "ring-2 ring-accent",
                                                        totalMass + mass > 250 && "opacity-50 cursor-not-allowed"
                                                    )}
                                                >
                                                    <Scale className="h-4 w-4" />
                                                    <span>{mass}g</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                        <Button 
                                            onClick={() => selectedMass && handleAddMass(selectedMass)}
                                            disabled={!selectedMass || isSimulating || totalMass + (selectedMass || 0) > 250}
                                            className="w-full"
                                        >
                                            {isSimulating ? 'Adding...' : 'Add Selected Mass'}
                                        </Button>
                                    </div>

                                    {/* Spring Visualization */}
                                    <div className="flex flex-col items-center justify-center min-h-[400px] bg-muted/30 rounded-lg p-4 lg:col-span-2">
                                        <div className="flex items-start gap-8">
                                            <div className="flex flex-col items-center">
                                                <p className="text-xs md:text-sm font-medium mb-2">Spring with Load</p>
                                                {/* Fixed hook at top */}
                                                <div className="w-12 h-2 bg-gray-600 dark:bg-gray-400 rounded-sm mb-1" />
                                                
                                                {/* Spring coils */}
                                                <svg width="40" height={Math.max(100, 80 + currentExtension * 10)} viewBox={`0 0 40 ${Math.max(100, 80 + currentExtension * 10)}`} className="transition-all duration-500">
                                                    <path d={`M 20 0 C 12 ${Math.max(100, 80 + currentExtension * 10) * 0.1}, 28 ${Math.max(100, 80 + currentExtension * 10) * 0.1}, 20 ${Math.max(100, 80 + currentExtension * 10) * 0.2} C 12 ${Math.max(100, 80 + currentExtension * 10) * 0.3}, 28 ${Math.max(100, 80 + currentExtension * 10) * 0.3}, 20 ${Math.max(100, 80 + currentExtension * 10) * 0.4} C 12 ${Math.max(100, 80 + currentExtension * 10) * 0.5}, 28 ${Math.max(100, 80 + currentExtension * 10) * 0.5}, 20 ${Math.max(100, 80 + currentExtension * 10) * 0.6} C 12 ${Math.max(100, 80 + currentExtension * 10) * 0.7}, 28 ${Math.max(100, 80 + currentExtension * 10) * 0.7}, 20 ${Math.max(100, 80 + currentExtension * 10) * 0.8} C 12 ${Math.max(100, 80 + currentExtension * 10) * 0.9}, 28 ${Math.max(100, 80 + currentExtension * 10) * 0.9}, 20 ${Math.max(100, 80 + currentExtension * 10)}`} stroke="currentColor" fill="none" strokeWidth="2" className="text-blue-500"/>
                                                </svg>
                                                
                                                {/* Mass block at end of spring */}
                                                {totalMass > 0 && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 300 }}
                                                        className="mt-1 relative"
                                                    >
                                                        {/* Hook connecting spring to mass */}
                                                        <div className="w-1 h-3 bg-gray-400 dark:bg-gray-600 mx-auto mb-1" />
                                                        
                                                        {/* Mass block */}
                                                        <div className="relative">
                                                            <div 
                                                                className="w-16 h-16 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-lg shadow-2xl border-2 border-gray-800 dark:border-gray-400 flex flex-col items-center justify-center"
                                                                style={{
                                                                    transform: `scale(${Math.min(1 + totalMass / 500, 1.5)})`
                                                                }}
                                                            >
                                                                {/* Weight label */}
                                                                <div className="text-white text-xs font-bold">{totalMass}g</div>
                                                                <div className="text-white text-[10px] opacity-80">{currentForce.toFixed(2)}N</div>
                                                            </div>
                                                            
                                                            {/* Motion lines to show weight pulling down */}
                                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                                                <motion.div
                                                                    animate={{ 
                                                                        y: [0, 4, 0],
                                                                        opacity: [0.3, 0.7, 0.3]
                                                                    }}
                                                                    transition={{ 
                                                                        duration: 1.5,
                                                                        repeat: Infinity,
                                                                        ease: "easeInOut"
                                                                    }}
                                                                    className="w-0.5 h-3 bg-orange-500"
                                                                />
                                                                <motion.div
                                                                    animate={{ 
                                                                        y: [0, 4, 0],
                                                                        opacity: [0.3, 0.7, 0.3]
                                                                    }}
                                                                    transition={{ 
                                                                        duration: 1.5,
                                                                        repeat: Infinity,
                                                                        ease: "easeInOut",
                                                                        delay: 0.2
                                                                    }}
                                                                    className="w-0.5 h-3 bg-orange-500"
                                                                />
                                                                <motion.div
                                                                    animate={{ 
                                                                        y: [0, 4, 0],
                                                                        opacity: [0.3, 0.7, 0.3]
                                                                    }}
                                                                    transition={{ 
                                                                        duration: 1.5,
                                                                        repeat: Infinity,
                                                                        ease: "easeInOut",
                                                                        delay: 0.4
                                                                    }}
                                                                    className="w-0.5 h-3 bg-orange-500"
                                                                />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                                
                                                {/* Empty hook when no mass */}
                                                {totalMass === 0 && (
                                                    <div className="mt-1 w-6 h-6 border-2 border-gray-400 dark:border-gray-600 rounded-full" />
                                                )}
                                            </div>

                                            <div className="space-y-4 pt-4">
                                                <div>
                                                    <p className="text-xs md:text-sm font-medium">Total Mass (g):</p>
                                                    <p className="text-2xl font-bold text-blue-600">{totalMass}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs md:text-sm font-medium">Force (N):</p>
                                                    <p className="text-2xl font-bold text-purple-600">{currentForce.toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs md:text-sm font-medium">Extension (cm):</p>
                                                    <p className="text-2xl font-bold text-green-600">{currentExtension.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Data Table */}
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Mass (g)</TableHead>
                                                <TableHead>Force (N)</TableHead>
                                                <TableHead>Extension (cm)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.map((point, index) => (
                                                <motion.tr
                                                    key={index}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <TableCell>{point.mass}</TableCell>
                                                    <TableCell>{point.force}</TableCell>
                                                    <TableCell>{point.extension}</TableCell>
                                                </motion.tr>
                                            ))}
                                            {data.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                                        Add masses to collect data
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Graph */}
                                {data.length > 0 && (
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={data}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="extension" type="number" name="Extension" unit="cm" domain={[0, 'dataMax + 1']} />
                                                <YAxis dataKey="force" type="number" name="Force" unit="N" domain={[0, 'dataMax + 0.5']} />
                                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                                <Legend />
                                                <Line type="monotone" dataKey="force" stroke="#8884d8" name="Force (N)" strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex gap-3">
                                <Button onClick={handleViewResults} disabled={data.length === 0} className="flex-1">
                                    View Results
                                </Button>
                                <Button onClick={handleRestart} variant="outline">
                                    Reset
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
                        <Card className="border-2 border-blue-200 dark:border-blue-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                    Experiment Results & Analysis
                                </CardTitle>
                                <CardDescription>Summary of your Hooke's Law verification</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Findings:</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Linear Relationship:</strong> Your data shows a linear relationship between force and extension, confirming Hooke's Law
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Spring Constant:</strong> The slope of the force vs. extension graph is the spring constant (k = {(data.length > 1 ? ((data[data.length-1].force - data[0].force) / (data[data.length-1].extension - data[0].extension)) : 0.5).toFixed(2)} N/cm)
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Data Points Collected:</strong> You collected {data.length} data point{data.length !== 1 ? 's' : ''}, showing consistent behavior across the range
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold mb-2">Real-World Applications:</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Understanding Hooke's Law helps us design better:
                                    </p>
                                    <ul className="text-sm space-y-2">
                                        <li>• <strong>Vehicle Suspensions:</strong> Springs absorb shocks proportionally to force</li>
                                        <li>• <strong>Weighing Scales:</strong> Spring extension directly indicates weight</li>
                                        <li>• <strong>Seismic Sensors:</strong> Springs measure earth vibrations</li>
                                        <li>• <strong>Athletic Equipment:</strong> Shoes and padding use spring properties</li>
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
                                <CardDescription>Test your understanding of Hooke's Law</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. If a force of 2 N causes a spring to extend by 4 cm, what is the spring constant (k)?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: '0.5', label: '0.5 N/cm', isCorrect: true },
                                            { value: '2', label: '2 N/cm' },
                                            { value: '8', label: '8 N/cm' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                                                    quizAnswer === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer === option.value && !quizSubmitted && "border-blue-500 bg-blue-500",
                                                        quizAnswer === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-500",
                                                        quizAnswer === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-500",
                                                        quizAnswer !== option.value && "border-gray-300"
                                                    )}>
                                                        {quizAnswer === option.value && (
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
                                    <p className="font-medium">2. What type of relationship does Hooke's Law describe between force and extension?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'linear', label: 'Linear (proportional)', isCorrect: true },
                                            { value: 'exponential', label: 'Exponential' },
                                            { value: 'inverse', label: 'Inverse' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer2(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer2 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                                                    quizAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer2 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer2 === option.value && !quizSubmitted && "border-blue-500 bg-blue-500",
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
                                    <p className="font-medium">3. In the equation F = kx, what does "k" represent?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'distance', label: 'Distance' },
                                            { value: 'stiffness', label: 'Spring constant (stiffness)', isCorrect: true },
                                            { value: 'gravity', label: 'Gravitational acceleration' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer3(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer3 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                                                    quizAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer3 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer3 === option.value && !quizSubmitted && "border-blue-500 bg-blue-500",
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
                                            quizFeedback.includes('Good') ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100" :
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
                                    disabled={!quizAnswer || !quizAnswer2 || !quizAnswer3 || quizSubmitted}
                                    className="flex-1"
                                    size="lg"
                                >
                                    Submit Answers
                                </Button>
                                {quizSubmitted && !quizFeedback.includes('all 3') && (
                                    <Button onClick={() => {
                                        setQuizAnswer(undefined);
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
                        <Card className="border-2 border-blue-200 dark:border-blue-800">
                            <CardHeader className="text-center">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="flex justify-center mb-4"
                                >
                                    <Trophy className="h-16 w-16 text-yellow-500" />
                                </motion.div>
                                <CardTitle>Lab Complete!</CardTitle>
                                <CardDescription>You've mastered Hooke's Law!</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Hooke's Law: F = kx describes a linear relationship</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Spring constant (k) measures a spring's stiffness</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>How to experimentally verify a fundamental physics law</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Real-world applications in engineering and design</span>
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
