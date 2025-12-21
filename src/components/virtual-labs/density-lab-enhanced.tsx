'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Droplets, BookOpen, Shield, Sparkles, Trophy, Award, GripVertical, Scale } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';

type Step = 'intro' | 'collect-supplies' | 'fill-water' | 'test-materials' | 'results' | 'quiz' | 'complete';

interface Material {
    id: string;
    name: string;
    density: number;
    result: 'sinks' | 'floats';
    color: string;
    icon: React.ReactNode;
}

const materials: Material[] = [
    { id: 'cork', name: 'Cork', density: 0.24, result: 'floats', color: '#D2B48C', icon: '🪵' },
    { id: 'wood', name: 'Wood Block', density: 0.6, result: 'floats', color: '#8B4513', icon: '📦' },
    { id: 'plastic', name: 'Plastic', density: 0.9, result: 'floats', color: '#FF6B9D', icon: '🪣' },
    { id: 'rubber', name: 'Rubber', density: 1.3, result: 'sinks', color: '#333333', icon: '🫐' },
    { id: 'stone', name: 'Stone', density: 2.5, result: 'sinks', color: '#808080', icon: '⬜' },
    { id: 'metal', name: 'Metal', density: 7.8, result: 'sinks', color: '#C0C0C0', icon: '🔩' },
];

export function DensityLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Supplies tracking
    const [showSupplies, setShowSupplies] = React.useState(true);
    const [beakerCollected, setBeakerCollected] = React.useState(false);
    const [waterCollected, setWaterCollected] = React.useState(false);
    const [scaleCollected, setScaleCollected] = React.useState(false);
    const [materialsCollected, setMaterialsCollected] = React.useState(false);
    
    // Experiment state
    const [suppliesReady, setSuppliesReady] = React.useState(false);
    const [waterFilled, setWaterFilled] = React.useState(false);
    const [testedMaterials, setTestedMaterials] = React.useState<string[]>([]);
    const [currentTest, setCurrentTest] = React.useState<Material | null>(null);
    const [isDropping, setIsDropping] = React.useState(false);
    const [dropResult, setDropResult] = React.useState<'floats' | 'sinks' | null>(null);
    
    // Quiz state
    const [selectedAnswer1, setSelectedAnswer1] = React.useState<string | null>(null);
    const [selectedAnswer2, setSelectedAnswer2] = React.useState<string | null>(null);
    const [selectedAnswer3, setSelectedAnswer3] = React.useState<string | null>(null);
    const [quizFeedback, setQuizFeedback] = React.useState<string>('');
    const [quizSubmitted, setQuizSubmitted] = React.useState(false);
    
    // XP and completion
    const [xpEarned, setXpEarned] = React.useState(0);
    const [showCelebration, setShowCelebration] = React.useState(false);
    const { markLabComplete, isLabCompleted, getLabCompletion } = useLabProgress();
    const labId = 'density';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    // Draggable teacher position
    const [teacherPosition, setTeacherPosition] = React.useState({ x: 0, y: 0 });

    // Intro message
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Density Lab! Today we'll discover what determines whether objects float or sink. Density is a measure of how much mass is packed into a certain volume. Objects less dense than water float, while denser objects sink. Let's test different materials!");
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setTeacherMessage("Great! Let's gather our supplies. Start by clicking on the BEAKER - this is where we'll observe our materials!");
        setPendingTransition(() => () => {
            setCurrentStep('collect-supplies');
        });
    };
    
    const handleCollectBeaker = () => {
        if (!beakerCollected) {
            setBeakerCollected(true);
            setTeacherMessage("Perfect! Now click on the WATER container - we need this to fill our beaker!");
            toast({ title: '✅ Beaker Collected' });
        }
    };
    
    const handleCollectWater = () => {
        if (beakerCollected && !waterCollected) {
            setWaterCollected(true);
            setTeacherMessage("Good! Now click on the SCALE - we'll use this to understand mass and density!");
            toast({ title: '✅ Water Collected' });
        }
    };
    
    const handleCollectScale = () => {
        if (waterCollected && !scaleCollected) {
            setScaleCollected(true);
            setTeacherMessage("Excellent! Finally, click on the MATERIALS - these are what we'll test!");
            toast({ title: '✅ Scale Collected' });
        }
    };
    
    const handleCollectMaterials = () => {
        if (scaleCollected && !materialsCollected) {
            setMaterialsCollected(true);
            setShowSupplies(false);
            setTeacherMessage("All supplies ready! Now let's fill the beaker with water and start our investigation!");
            toast({ title: '✅ All Supplies Collected!' });
            setPendingTransition(() => () => {
                setCurrentStep('fill-water');
            });
        }
    };
    
    const handleFillWater = () => {
        if (!waterFilled) {
            setWaterFilled(true);
            setSuppliesReady(true);
            setTeacherMessage("Perfect! The beaker is filled with water. Now let's test our materials one by one. Click on any material to drop it into the water!");
            toast({ title: '✅ Water Filled' });
            setPendingTransition(() => () => {
                setCurrentStep('test-materials');
            });
        }
    };
    
    const handleTestMaterial = (material: Material) => {
        if (isDropping || testedMaterials.includes(material.id)) return;
        
        setCurrentTest(material);
        setIsDropping(true);
        setDropResult(null);
        
        setTeacherMessage(`Testing ${material.name}... It's being dropped into the water now!`);
        toast({ title: `🔬 Testing ${material.name}...` });
        
        setTimeout(() => {
            setDropResult(material.result);
            setIsDropping(false);
            setTestedMaterials([...testedMaterials, material.id]);
            
            if (material.result === 'floats') {
                setTeacherMessage(`${material.name} floats! Its density (${material.density} g/cm³) is less than water (1 g/cm³), so it stays on top!`);
            } else {
                setTeacherMessage(`${material.name} sinks! Its density (${material.density} g/cm³) is greater than water, so it goes down!`);
            }
            
            if (testedMaterials.length + 1 >= materials.length) {
                setTimeout(() => {
                    setTeacherMessage("Excellent! We've tested all the materials. Now let's analyze the results!");
                    setPendingTransition(() => () => {
                        setCurrentStep('results');
                    });
                }, 2000);
            }
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
        setTeacherMessage("You've completed the testing phase! Notice how materials with density less than 1 g/cm³ floated, and those greater than 1 g/cm³ sank. This follows Archimedes' Principle! Now test your knowledge with the quiz!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
        });
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        if (selectedAnswer1 === 'less') correctCount++;
        if (selectedAnswer2 === 'metal') correctCount++;
        if (selectedAnswer3 === 'archimedes') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand density and buoyancy! +${earnedXP} XP`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Think about buoyancy and density!`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: objects float if their density is less than the liquid!`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setShowSupplies(true);
        setBeakerCollected(false);
        setWaterCollected(false);
        setScaleCollected(false);
        setMaterialsCollected(false);
        setSuppliesReady(false);
        setWaterFilled(false);
        setTestedMaterials([]);
        setCurrentTest(null);
        setIsDropping(false);
        setDropResult(null);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setPendingTransition(null);
        setTeacherMessage("Welcome back! Ready to explore density again? Let's test more materials!");
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Draggable Teacher Voice */}
            <motion.div
                drag
                dragMomentum={false}
                dragElastic={0}
                dragConstraints={{ left: -300, right: 300, top: -100, bottom: 400 }}
                onDragEnd={(_, info) => {
                    setTeacherPosition({ x: info.offset.x, y: info.offset.y });
                }}
                initial={{ x: 0, y: 0 }}
                style={{ x: teacherPosition.x, y: teacherPosition.y }}
                className="fixed bottom-16 left-2 right-2 md:left-auto md:right-4 md:w-96 max-w-md z-50 touch-none"
            >
                <Card className="shadow-2xl border-2 border-blue-400 dark:border-blue-600 cursor-move">
                    <CardHeader className="pb-2 py-2 md:py-4">
                        <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-xs md:text-sm">Teacher Guide (Drag to Move)</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <TeacherVoice 
                            message={teacherMessage}
                            onComplete={handleTeacherComplete}
                        />
                    </CardContent>
                </Card>
            </motion.div>

            {isCompleted && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                            <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-purple-900 dark:text-purple-100">Lab Completed!</h3>
                            <p className="text-sm text-purple-700 dark:text-purple-300">
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
                            <CardDescription>You've completed the Density Lab!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-purple-600">
                                <Award className="h-8 w-8" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You've mastered density and buoyancy!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Scale className="h-5 w-5 text-purple-600" />
                        Density & Buoyancy
                    </CardTitle>
                    <CardDescription>Discover why objects float or sink</CardDescription>
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
                                <p><strong>Density:</strong> The amount of mass packed into a certain volume. Formula: Density = Mass / Volume</p>
                                <p><strong>Floating & Sinking:</strong> Objects float if their density is less than the liquid (usually water at 1 g/cm³). Objects sink if their density is greater than the liquid.</p>
                                <p><strong>Archimedes' Principle:</strong> An object immersed in a fluid experiences an upward force equal to the weight of the fluid displaced. This buoyant force determines if something floats or sinks.</p>
                                <p><strong>Examples:</strong></p>
                                <ul>
                                    <li>Cork (0.24 g/cm³) - Floats (less dense than water)</li>
                                    <li>Wood (0.6 g/cm³) - Floats (less dense than water)</li>
                                    <li>Plastic (0.9 g/cm³) - Floats (less dense than water)</li>
                                    <li>Rubber (1.3 g/cm³) - Sinks (more dense than water)</li>
                                    <li>Stone (2.5 g/cm³) - Sinks (more dense than water)</li>
                                    <li>Metal (7.8 g/cm³) - Sinks (more dense than water)</li>
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
                                    <li>Handle glassware carefully to avoid breakage</li>
                                    <li>Clean up spilled water immediately to prevent slipping</li>
                                    <li>Be careful with sharp-edged materials</li>
                                    <li>Never throw objects into the water - lower them gently</li>
                                    <li>Wear safety goggles when handling multiple materials</li>
                                    <li>Keep your work area organized</li>
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
                                <CardTitle>Welcome to the Density Lab!</CardTitle>
                                <CardDescription>Explore floating, sinking, and buoyancy</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                    <div className="flex items-start gap-4">
                                        <Scale className="w-16 h-16 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-purple-900 dark:text-purple-100">What We'll Discover:</h3>
                                            <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                                                <li>• Density = Mass / Volume</li>
                                                <li>• Why some objects float and others sink</li>
                                                <li>• Archimedes' Principle and buoyancy</li>
                                                <li>• Real-world applications of density</li>
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
                                    {/* Beaker */}
                                    {!beakerCollected && (
                                        <motion.div
                                            onClick={handleCollectBeaker}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-16 h-24 border-2 border-blue-400 rounded-lg bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50" />
                                                <span className="text-sm font-medium">Beaker</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Water */}
                                    {beakerCollected && !waterCollected && (
                                        <motion.div
                                            onClick={handleCollectWater}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-cyan-300 dark:border-cyan-700 hover:border-cyan-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Droplets className="h-12 w-12 text-cyan-500" />
                                                <span className="text-sm font-medium">Water</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Scale */}
                                    {waterCollected && !scaleCollected && (
                                        <motion.div
                                            onClick={handleCollectScale}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-purple-300 dark:border-purple-700 hover:border-purple-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Scale className="h-12 w-12 text-purple-500" />
                                                <span className="text-sm font-medium">Scale</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Materials */}
                                    {scaleCollected && !materialsCollected && (
                                        <motion.div
                                            onClick={handleCollectMaterials}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 hover:shadow-xl transition-all"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="flex gap-1 text-2xl">📦 ⬜ 🔩</div>
                                                <span className="text-sm font-medium">Materials</span>
                                                <span className="text-xs text-muted-foreground">Click to Collect</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Collected Items Display */}
                                    <div className="w-full mt-4 flex gap-4 justify-center flex-wrap">
                                        {beakerCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm">Beaker</span>
                                            </motion.div>
                                        )}
                                        {waterCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-cyan-100 dark:bg-cyan-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-cyan-600" />
                                                <span className="text-sm">Water</span>
                                            </motion.div>
                                        )}
                                        {scaleCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-purple-600" />
                                                <span className="text-sm">Scale</span>
                                            </motion.div>
                                        )}
                                        {materialsCollected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900 px-4 py-2 rounded-full"
                                            >
                                                <CheckCircle className="h-4 w-4 text-indigo-600" />
                                                <span className="text-sm">Materials</span>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'fill-water' && (
                    <motion.div
                        key="fill-water"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Fill the Beaker</CardTitle>
                                <CardDescription>Prepare your experimental setup</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex justify-center items-center">
                                    <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 p-8 min-h-[300px] flex items-center justify-center">
                                        <motion.div className="flex flex-col items-center gap-4">
                                            <div className="w-24 h-32 border-2 border-blue-400 rounded-lg bg-gradient-to-b from-blue-50/50 to-blue-200/50 dark:from-blue-900/50 dark:to-blue-800/50 flex items-center justify-center">
                                                <motion.div
                                                    animate={{ opacity: waterFilled ? 0.8 : 0 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="w-full h-3/4 bg-blue-400/70 dark:bg-blue-500/70 rounded-b-lg"
                                                />
                                            </div>
                                            <p className="text-center text-sm font-medium">
                                                {waterFilled ? '✅ Water Filled' : 'Ready to fill'}
                                            </p>
                                        </motion.div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-medium mb-4">Fill the beaker with water</p>
                                    <Button onClick={handleFillWater} size="lg" disabled={waterFilled}>
                                        {waterFilled ? '✅ Water Filled' : 'Fill Water'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'test-materials' && (
                    <motion.div
                        key="test-materials"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-2 border-purple-200 dark:border-purple-800">
                            <CardHeader>
                                <CardTitle>Test Materials</CardTitle>
                                <CardDescription>Drop materials into water and observe</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Beaker with Water */}
                                <div className="flex justify-center items-center">
                                    <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 p-8 min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
                                        {/* Water */}
                                        <motion.div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-32 h-64 border-2 border-blue-400 rounded-lg bg-gradient-to-b from-blue-50/50 to-blue-200/50 dark:from-blue-900/50 dark:to-blue-800/50 relative overflow-hidden">
                                                <motion.div className="absolute bottom-0 w-full h-1/2 bg-blue-400/70 dark:bg-blue-500/70 rounded-b-lg" />
                                                <motion.div className="absolute inset-0 flex items-center justify-center opacity-30">
                                                    <Droplets className="h-16 w-16 text-blue-500" />
                                                </motion.div>
                                                
                                                {/* Floating/Sinking Object */}
                                                {currentTest && (
                                                    <motion.div
                                                        key={currentTest.id}
                                                        animate={{
                                                            y: isDropping ? 0 : dropResult === 'floats' ? -80 : 60,
                                                            opacity: isDropping ? 1 : dropResult ? 1 : 0
                                                        }}
                                                        transition={{ duration: 1 }}
                                                        className="absolute w-12 h-12 flex items-center justify-center text-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                                    >
                                                        {currentTest.icon}
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Result Display */}
                                {dropResult && currentTest && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "p-4 rounded-lg border-2 text-center",
                                            dropResult === 'floats' 
                                                ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                                                : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                                        )}
                                    >
                                        <p className="font-semibold">
                                            {currentTest.name} <span className={dropResult === 'floats' ? 'text-green-600' : 'text-red-600'}>
                                                {dropResult.toUpperCase()}
                                            </span>
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Density: {currentTest.density} g/cm³
                                        </p>
                                    </motion.div>
                                )}

                                {/* Material Selection Buttons */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {materials.map((material) => (
                                        <motion.div
                                            key={material.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                onClick={() => handleTestMaterial(material)}
                                                disabled={isDropping || testedMaterials.includes(material.id)}
                                                className="w-full"
                                                variant={testedMaterials.includes(material.id) ? "secondary" : "outline"}
                                            >
                                                <span className="mr-2 text-xl">{material.icon}</span>
                                                <span className="text-xs md:text-sm">{material.name}</span>
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Progress */}
                                <div className="text-center text-sm text-muted-foreground">
                                    Tested: {testedMaterials.length} / {materials.length}
                                </div>
                            </CardContent>
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
                        <Card className="border-2 border-purple-200 dark:border-purple-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-purple-600" />
                                    Experiment Results
                                </CardTitle>
                                <CardDescription>Analysis of density and buoyancy</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Observations:</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Objects with density {`<`} 1 g/cm³ float:</strong> Cork, wood, and plastic floated because their density is less than water
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Objects with density {`>`} 1 g/cm³ sink:</strong> Rubber, stone, and metal sank because their density is greater than water
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Archimedes' Principle applies:</strong> The buoyant force equals the weight of displaced water
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                                    <h3 className="font-semibold mb-2">Scientific Explanation:</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Density determines whether an object floats or sinks. Water has a density of 1 g/cm³. Any object less dense than water will float because the buoyant force (upward force from water) exceeds the weight of the object. 
                                        Any object denser than water will sink because its weight exceeds the buoyant force. This principle is used in submarines, ships, and hot air balloons.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleViewResults} className="w-full" size="lg">
                                    Continue to Quiz
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
                                <CardDescription>Answer these questions about density</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. Objects float if their density is:</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'less', label: 'Less than the liquid', isCorrect: true },
                                            { value: 'greater', label: 'Greater than the liquid' },
                                            { value: 'equal', label: 'Equal to the liquid' },
                                            { value: 'unknown', label: 'Unknown' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setSelectedAnswer1(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    selectedAnswer1 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                                                    selectedAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    selectedAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    selectedAnswer1 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        selectedAnswer1 === option.value && !quizSubmitted && "border-blue-500 bg-blue-500",
                                                        selectedAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-500",
                                                        selectedAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-500",
                                                        selectedAnswer1 !== option.value && "border-gray-300"
                                                    )}>
                                                        {selectedAnswer1 === option.value && (
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
                                    <p className="font-medium">2. Which material will sink the fastest?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'plastic', label: 'Plastic (0.9 g/cm³)' },
                                            { value: 'rubber', label: 'Rubber (1.3 g/cm³)' },
                                            { value: 'stone', label: 'Stone (2.5 g/cm³)' },
                                            { value: 'metal', label: 'Metal (7.8 g/cm³)', isCorrect: true }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setSelectedAnswer2(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    selectedAnswer2 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                                                    selectedAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    selectedAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    selectedAnswer2 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        selectedAnswer2 === option.value && !quizSubmitted && "border-blue-500 bg-blue-500",
                                                        selectedAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-500",
                                                        selectedAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-500",
                                                        selectedAnswer2 !== option.value && "border-gray-300"
                                                    )}>
                                                        {selectedAnswer2 === option.value && (
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
                                    <p className="font-medium">3. What principle explains the buoyant force on submerged objects?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'newton', label: "Newton's Second Law" },
                                            { value: 'pascal', label: "Pascal's Principle" },
                                            { value: 'archimedes', label: "Archimedes' Principle", isCorrect: true },
                                            { value: 'bernoulli', label: "Bernoulli's Principle" }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setSelectedAnswer3(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    selectedAnswer3 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                                                    selectedAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    selectedAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    selectedAnswer3 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        selectedAnswer3 === option.value && !quizSubmitted && "border-blue-500 bg-blue-500",
                                                        selectedAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-500",
                                                        selectedAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-500",
                                                        selectedAnswer3 !== option.value && "border-gray-300"
                                                    )}>
                                                        {selectedAnswer3 === option.value && (
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
                                            quizFeedback.includes('Perfect') ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100" :
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
                                    disabled={!selectedAnswer1 || !selectedAnswer2 || !selectedAnswer3 || quizSubmitted}
                                    className="flex-1"
                                    size="lg"
                                >
                                    Submit Answers
                                </Button>
                                {quizSubmitted && !quizFeedback.includes('Perfect') && (
                                    <Button onClick={() => {
                                        setSelectedAnswer1(null);
                                        setSelectedAnswer2(null);
                                        setSelectedAnswer3(null);
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
                                <CardDescription>You've mastered density and buoyancy</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>Density = Mass / Volume determines if objects float or sink</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>Objects less dense than water ({`<`} 1 g/cm³) float</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>Objects more dense than water ({`>`} 1 g/cm³) sink</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>Archimedes' Principle explains buoyant forces</span>
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
