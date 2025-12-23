'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Trophy, Award, GripVertical, Sparkles, Zap, Battery, Activity, Cable } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { Slider } from '../ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Step = 'intro' | 'collect-supplies' | 'experiment' | 'results' | 'quiz' | 'complete';

interface CircuitReading {
    voltage: number;
    current: number;
    resistance: number;
}

export function OhmsLawLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Supplies tracking
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [batteryCollected, setBatteryCollected] = React.useState(false);
    const [resistorCollected, setResistorCollected] = React.useState(false);
    const [ammeterCollected, setAmmeterCollected] = React.useState(false);
    const [voltmeterCollected, setVoltmeterCollected] = React.useState(false);
    
    // Experiment state
    const [selectedResistor, setSelectedResistor] = React.useState<number>(10); // Ohms
    const [voltage, setVoltage] = React.useState<number>(5); // Volts
    const [readings, setReadings] = React.useState<CircuitReading[]>([]);
    const [currentReading, setCurrentReading] = React.useState<CircuitReading | null>(null);
    const [circuitActive, setCircuitActive] = React.useState(false);
    
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
    const labId = 'ohms-law';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to Ohm's Law Lab! We'll explore the relationship between voltage, current, and resistance. Ohm's Law states: V = I × R. Let's verify this experimentally!");
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setTeacherMessage("Great! Let's gather our circuit components. Start by clicking on the BATTERY - our voltage source!");
        setPendingTransition(() => () => {
            setCurrentStep('collect-supplies');
        });
    };
    
    const handleCollectBattery = () => {
        if (!batteryCollected) {
            setBatteryCollected(true);
            setTeacherMessage("Perfect! Now click on the RESISTOR - this will control the current flow!");
            toast({ title: '✅ Battery Collected' });
        }
    };
    
    const handleCollectResistor = () => {
        if (batteryCollected && !resistorCollected) {
            setResistorCollected(true);
            setTeacherMessage("Excellent! Now click on the AMMETER - we'll use this to measure current!");
            toast({ title: '✅ Resistor Collected' });
        }
    };
    
    const handleCollectAmmeter = () => {
        if (resistorCollected && !ammeterCollected) {
            setAmmeterCollected(true);
            setTeacherMessage("Good! Finally, click on the VOLTMETER - we'll measure the voltage across components!");
            toast({ title: '✅ Ammeter Collected' });
        }
    };
    
    const handleCollectVoltmeter = () => {
        if (ammeterCollected && !voltmeterCollected) {
            setVoltmeterCollected(true);
            setShowSupplies(false);
            setTeacherMessage("All components ready! Now let's build circuits and test Ohm's Law by varying voltage and resistance!");
            toast({ title: '✅ All Components Collected!' });
            setPendingTransition(() => () => {
                setCurrentStep('experiment');
            });
        }
    };
    
    const handleTakeReading = () => {
        // Calculate current using Ohm's Law: I = V / R
        const current = voltage / selectedResistor;
        const reading: CircuitReading = {
            voltage,
            current: Math.round(current * 1000) / 1000, // Round to 3 decimal places
            resistance: selectedResistor
        };
        
        setCurrentReading(reading);
        const newReadings = [...readings, reading];
        setReadings(newReadings);
        setCircuitActive(true);
        
        toast({ 
            title: '✅ Reading Recorded', 
            description: `V=${voltage}V, I=${reading.current}A, R=${selectedResistor}Ω` 
        });
        
        // Provide guidance based on number of readings
        if (newReadings.length === 1) {
            setTeacherMessage(`Great first reading! At ${voltage}V with ${selectedResistor}Ω resistance, current is ${reading.current}A. This follows Ohm's Law: V = I × R. Now try changing the voltage or resistance and take another reading to see how current changes!`);
        } else if (newReadings.length === 2) {
            setTeacherMessage(`Excellent! You've taken ${newReadings.length} readings. Take at least one more reading with different values to complete your data collection and analyze the relationship between V, I, and R.`);
        } else if (newReadings.length >= 3) {
            setTeacherMessage(`Perfect! You now have ${newReadings.length} readings. You can take more readings if you wish, or click 'View Results' to analyze your data and see the graph showing Ohm's Law in action!`);
        }
        
        setTimeout(() => setCircuitActive(false), 2000);
    };
    
    const handleTeacherComplete = () => {
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null);
            transition();
        }
    };

    const handleViewResults = () => {
        if (readings.length < 3) {
            toast({ title: 'Incomplete', description: 'Please take at least 3 readings', variant: 'destructive' });
            return;
        }
        setTeacherMessage("Excellent! You've collected multiple data points. Let's analyze the relationship between voltage, current, and resistance!");
        setPendingTransition(() => () => {
            setCurrentStep('results');
        });
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Let's test your understanding of Ohm's Law and electrical circuits!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
        });
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        if (quizAnswer1 === 'vir') correctCount++;
        if (quizAnswer2 === 'inversely') correctCount++;
        if (quizAnswer3 === 'double') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand Ohm's Law! +${earnedXP} XP`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Remember V = I × R.`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Review the relationship: Voltage = Current × Resistance.`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setShowSupplies(true);
        setBatteryCollected(false);
        setResistorCollected(false);
        setAmmeterCollected(false);
        setVoltmeterCollected(false);
        setSelectedResistor(10);
        setVoltage(5);
        setReadings([]);
        setCurrentReading(null);
        setCircuitActive(false);
        setQuizAnswer1(undefined);
        setQuizAnswer2(undefined);
        setQuizAnswer3(undefined);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setPendingTransition(null);
        setTeacherMessage("Ready to explore Ohm's Law again!");
    };

    return (
        <div className="space-y-6 pb-20">
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
            />

            {isCompleted && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
                            <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Lab Completed!</h3>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
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
                            <CardDescription>You've mastered Ohm's Law!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-yellow-600">
                                <Award className="h-8 w-8" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You understand electrical circuits!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-600" />
                        Ohm's Law Lab
                    </CardTitle>
                    <CardDescription>Explore the relationship between voltage, current, and resistance</CardDescription>
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
                                <p><strong>Ohm's Law</strong> is a fundamental principle in electrical circuits that relates voltage (V), current (I), and resistance (R).</p>
                                <p className="mt-2"><strong>The Formula:</strong></p>
                                <p className="font-mono bg-slate-100 dark:bg-slate-900 p-2 rounded text-center">V = I × R</p>
                                <p className="mt-2">Where:</p>
                                <ul>
                                    <li><strong>V (Voltage):</strong> Measured in Volts (V) - the electrical potential difference</li>
                                    <li><strong>I (Current):</strong> Measured in Amperes (A) - the flow of electric charge</li>
                                    <li><strong>R (Resistance):</strong> Measured in Ohms (Ω) - opposition to current flow</li>
                                </ul>
                                <p className="mt-2"><strong>Key Relationships:</strong></p>
                                <ul>
                                    <li>Current is <strong>directly proportional</strong> to voltage (at constant R)</li>
                                    <li>Current is <strong>inversely proportional</strong> to resistance (at constant V)</li>
                                    <li>Doubling voltage doubles current (if R stays constant)</li>
                                    <li>Doubling resistance halves current (if V stays constant)</li>
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
                                    <li>Always disconnect power before changing circuit connections</li>
                                    <li>Start with low voltages and gradually increase</li>
                                    <li>Check polarity before connecting meters</li>
                                    <li>Never exceed component ratings</li>
                                    <li>Avoid touching exposed wires when circuit is on</li>
                                    <li>Use insulated tools and probes</li>
                                    <li>Monitor for overheating components</li>
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
                                <CardTitle>Welcome to Ohm's Law Lab!</CardTitle>
                                <CardDescription>Discover the fundamental relationship in electrical circuits</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 p-6 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                                    <div className="flex items-start gap-4">
                                        <Zap className="w-16 h-16 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-yellow-900 dark:text-yellow-100">What You'll Learn:</h3>
                                            <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                                                <li>• How voltage, current, and resistance relate mathematically</li>
                                                <li>• Using ammeters and voltmeters correctly</li>
                                                <li>• Building and analyzing simple circuits</li>
                                                <li>• Applying Ohm's Law to solve problems</li>
                                                <li>• Understanding electrical safety principles</li>
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
                        <Card className="border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Sparkles className="h-5 w-5 text-yellow-600" />
                                    Circuit Components - Click to Collect
                                </CardTitle>
                                <CardDescription>Click on each item in order</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-6 justify-center flex-wrap">
                                    {/* Battery */}
                                    {!batteryCollected && (
                                        <motion.div
                                            onClick={handleCollectBattery}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-green-400 dark:border-green-600 hover:border-green-600 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Battery className="h-12 w-12 text-green-500" />
                                                <span className="text-sm font-medium">Battery</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Resistor */}
                                    {batteryCollected && !resistorCollected && (
                                        <motion.div
                                            onClick={handleCollectResistor}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-orange-400 dark:border-orange-600 hover:border-orange-600 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Cable className="h-12 w-12 text-orange-500" />
                                                <span className="text-sm font-medium">Resistor</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Ammeter */}
                                    {resistorCollected && !ammeterCollected && (
                                        <motion.div
                                            onClick={handleCollectAmmeter}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-blue-400 dark:border-blue-600 hover:border-blue-600 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Activity className="h-12 w-12 text-blue-500" />
                                                <span className="text-sm font-medium">Ammeter</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Voltmeter */}
                                    {ammeterCollected && !voltmeterCollected && (
                                        <motion.div
                                            onClick={handleCollectVoltmeter}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-purple-400 dark:border-purple-600 hover:border-purple-600 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Zap className="h-12 w-12 text-purple-500" />
                                                <span className="text-sm font-medium">Voltmeter</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Collected Items */}
                                    <div className="w-full mt-4 flex gap-4 justify-center flex-wrap">
                                        {batteryCollected && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <span className="text-sm">Battery</span>
                                            </motion.div>
                                        )}
                                        {resistorCollected && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900 px-4 py-2 rounded-full">
                                                <CheckCircle className="h-4 w-4 text-orange-600" />
                                                <span className="text-sm">Resistor</span>
                                            </motion.div>
                                        )}
                                        {ammeterCollected && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full">
                                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm">Ammeter</span>
                                            </motion.div>
                                        )}
                                        {voltmeterCollected && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 px-4 py-2 rounded-full">
                                                <CheckCircle className="h-4 w-4 text-purple-600" />
                                                <span className="text-sm">Voltmeter</span>
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
                        <Card className="border-2 border-yellow-200 dark:border-yellow-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-yellow-600" />
                                    Circuit Measurements
                                </CardTitle>
                                <CardDescription>Readings taken: {readings.length}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Circuit Controls */}
                                <div className="space-y-4">
                                    {/* Voltage Control */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-medium">Battery Voltage: {voltage}V</label>
                                            <Battery className="h-5 w-5 text-green-600" />
                                        </div>
                                        <Slider
                                            value={[voltage]}
                                            onValueChange={(val) => setVoltage(val[0])}
                                            min={1}
                                            max={12}
                                            step={1}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>1V</span>
                                            <span>12V</span>
                                        </div>
                                    </div>

                                    {/* Resistance Control */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-medium">Resistance: {selectedResistor}Ω</label>
                                            <Cable className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <Slider
                                            value={[selectedResistor]}
                                            onValueChange={(val) => setSelectedResistor(val[0])}
                                            min={5}
                                            max={100}
                                            step={5}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>5Ω</span>
                                            <span>100Ω</span>
                                        </div>
                                    </div>

                                    {/* Current Display */}
                                    {circuitActive && currentReading && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 rounded-lg border-2 border-yellow-300 dark:border-yellow-700"
                                        >
                                            <div className="grid grid-cols-3 gap-4 text-center">
                                                <div>
                                                    <div className="text-sm text-muted-foreground mb-1">Voltage</div>
                                                    <div className="text-2xl font-bold text-green-600">{currentReading.voltage}V</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground mb-1">Current</div>
                                                    <div className="text-2xl font-bold text-blue-600">{currentReading.current}A</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground mb-1">Resistance</div>
                                                    <div className="text-2xl font-bold text-orange-600">{currentReading.resistance}Ω</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Take Reading Button */}
                                <Button onClick={handleTakeReading} className="w-full" size="lg">
                                    <Activity className="h-5 w-5 mr-2" />
                                    Take Reading
                                </Button>

                                {/* Readings Table */}
                                {readings.length > 0 && (
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-slate-100 dark:bg-slate-900">
                                                <tr>
                                                    <th className="p-3 text-left text-sm font-medium">#</th>
                                                    <th className="p-3 text-left text-sm font-medium">Voltage (V)</th>
                                                    <th className="p-3 text-left text-sm font-medium">Current (A)</th>
                                                    <th className="p-3 text-left text-sm font-medium">Resistance (Ω)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {readings.map((reading, index) => (
                                                    <tr key={index} className="border-t">
                                                        <td className="p-3">{index + 1}</td>
                                                        <td className="p-3 text-green-600 font-medium">{reading.voltage}</td>
                                                        <td className="p-3 text-blue-600 font-medium">{reading.current}</td>
                                                        <td className="p-3 text-orange-600 font-medium">{reading.resistance}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleViewResults} disabled={readings.length < 3} className="w-full" size="lg">
                                    View Results ({readings.length}/3+ readings)
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
                        <Card className="border-2 border-yellow-200 dark:border-yellow-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-yellow-600" />
                                    Experimental Results & Analysis
                                </CardTitle>
                                <CardDescription>Data visualization and conclusions</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Graph */}
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={readings}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="voltage" label={{ value: 'Voltage (V)', position: 'insideBottom', offset: -5 }} />
                                            <YAxis label={{ value: 'Current (A)', angle: -90, position: 'insideLeft' }} />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={2} name="Current (A)" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 p-6 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Findings:</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Ohm's Law Verified:</strong> The relationship V = I × R holds true for all measurements. Current increases proportionally with voltage and inversely with resistance.
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Linear Relationship:</strong> The graph shows current increases linearly with voltage (at constant resistance), confirming the direct proportionality.
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Practical Application:</strong> Understanding this relationship helps design circuits, choose components, and troubleshoot electrical systems.
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                    <h3 className="font-semibold mb-2">Real-World Applications:</h3>
                                    <ul className="text-sm space-y-2">
                                        <li>• <strong>Circuit Design:</strong> Selecting appropriate resistors for desired current</li>
                                        <li>• <strong>Power Distribution:</strong> Calculating voltage drops in transmission lines</li>
                                        <li>• <strong>Electronics:</strong> Determining LED current-limiting resistors</li>
                                        <li>• <strong>Safety:</strong> Understanding electrical hazards and fuse ratings</li>
                                        <li>• <strong>Troubleshooting:</strong> Diagnosing circuit problems using measurements</li>
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
                                <CardDescription>Test your understanding of Ohm's Law</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. What is the correct formula for Ohm's Law?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'vir', label: 'V = I × R', isCorrect: true },
                                            { value: 'vir2', label: 'V = I / R' },
                                            { value: 'v2ir', label: 'V² = I × R' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer1(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer1 === option.value && !quizSubmitted && "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
                                                    quizAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer1 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer1 === option.value && !quizSubmitted && "border-yellow-500 bg-yellow-500",
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
                                    <p className="font-medium">2. If voltage stays constant, how does current change when resistance increases?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'inversely', label: 'Current decreases (inversely proportional)', isCorrect: true },
                                            { value: 'directly', label: 'Current increases (directly proportional)' },
                                            { value: 'constant', label: 'Current stays the same' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer2(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer2 === option.value && !quizSubmitted && "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
                                                    quizAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer2 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer2 === option.value && !quizSubmitted && "border-yellow-500 bg-yellow-500",
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
                                    <p className="font-medium">3. If you double the voltage across a resistor, what happens to the current?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'half', label: 'Current is halved' },
                                            { value: 'double', label: 'Current doubles', isCorrect: true },
                                            { value: 'same', label: 'Current stays the same' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer3(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer3 === option.value && !quizSubmitted && "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
                                                    quizAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer3 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer3 === option.value && !quizSubmitted && "border-yellow-500 bg-yellow-500",
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
                                            quizFeedback.includes('Good') ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100" :
                                            "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100"
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
                        <Card className="border-2 border-yellow-200 dark:border-yellow-800">
                            <CardHeader className="text-center">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="flex justify-center mb-4"
                                >
                                    <Trophy className="h-16 w-16 text-yellow-500" />
                                </motion.div>
                                <CardTitle>Lab Complete!</CardTitle>
                                <CardDescription>You've mastered Ohm's Law!</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 p-6 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            <span>The fundamental relationship V = I × R</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            <span>Using electrical meters correctly and safely</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            <span>Analyzing circuit behavior mathematically</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            <span>Applying Ohm's Law to real-world problems</span>
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
