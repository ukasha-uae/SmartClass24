'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Droplets, BookOpen, Shield, Sparkles, Trophy, Award, Scale, RefreshCw } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { LabSupplies, SupplyItem } from './LabSupplies';

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
    
    // Supplies tracking
    const [collectedSupplies, setCollectedSupplies] = React.useState<string[]>([]);
    
    // Experiment state
    const [suppliesReady, setSuppliesReady] = React.useState(false);
    const [waterFilled, setWaterFilled] = React.useState(false);
    const [testedMaterials, setTestedMaterials] = React.useState<string[]>([]);
    const [currentTest, setCurrentTest] = React.useState<Material | null>(null);
    const [isDropping, setIsDropping] = React.useState(false);
    const [dropResult, setDropResult] = React.useState<'floats' | 'sinks' | null>(null);
    const [allMaterialsTested, setAllMaterialsTested] = React.useState(false);
    
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
    const allSuppliesNotifiedRef = React.useRef(false);

    // Supplies definition
    const supplies: SupplyItem[] = [
        { id: 'beaker', name: 'Beaker', emoji: '🧪', description: 'Container for water' },
        { id: 'water', name: 'Water', emoji: '💧', description: 'Liquid for testing' },
        { id: 'scale', name: 'Scale', emoji: '⚖️', description: 'Measure mass' },
        { id: 'materials', name: 'Test Materials', emoji: '📦', description: 'Objects to test' },
    ];

    // Intro message
    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Density Lab! Today we'll discover what determines whether objects float or sink. Density is a measure of how much mass is packed into a certain volume. Objects less dense than water float, while denser objects sink. Let's test different materials!");
        }
    }, [currentStep]);

    const handleStartExperiment = () => {
        setTeacherMessage("Great! Let's gather our supplies. Click on each item to collect them for your experiment!");
        setCurrentStep('collect-supplies');
    };

    const handleCollectSupply = (itemId: string) => {
        if (!collectedSupplies.includes(itemId)) {
            setCollectedSupplies(prev => [...prev, itemId]);
            toast({ title: `✅ ${supplies.find(s => s.id === itemId)?.name} Collected` });
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
        setTeacherMessage("All supplies ready! Now let's fill the beaker with water and start our investigation!");
        setCurrentStep('fill-water');
}, [toast]);

    const handleFillWater = () => {
        if (!waterFilled) {
            setWaterFilled(true);
            setSuppliesReady(true);
            setTeacherMessage("Perfect! The beaker is filled with water. Now let's test our materials one by one. Click on any material to drop it into the water!");
            setCurrentStep('test-materials');
            toast({ title: '✅ Water Filled' });
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
            const newTested = [...testedMaterials, material.id];
            setTestedMaterials(newTested);
            
            if (material.result === 'floats') {
                setTeacherMessage(`${material.name} floats! Its density (${material.density} g/cm³) is less than water (1 g/cm³), so it stays on top!`);
            } else {
                setTeacherMessage(`${material.name} sinks! Its density (${material.density} g/cm³) is greater than water, so it goes down!`);
            }
            
            if (newTested.length >= materials.length) {
                setAllMaterialsTested(true);
                setTimeout(() => {
                    setTeacherMessage("Excellent! We've tested all the materials. Click 'View Results' when you're ready to analyze!");
                }, 2000);
            }
        }, 1500);
    };

    const handleViewResults = () => {
        setTeacherMessage("You've completed the testing phase! Notice how materials with density less than 1 g/cm³ floated, and those greater than 1 g/cm³ sank. This follows Archimedes' Principle!");
        setCurrentStep('results');
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Now let's test your knowledge! Answer the questions about density and buoyancy.");
        setCurrentStep('quiz');
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
        setCollectedSupplies([]);
        setSuppliesReady(false);
        setWaterFilled(false);
        setTestedMaterials([]);
        setCurrentTest(null);
        setIsDropping(false);
        setDropResult(null);
        setAllMaterialsTested(false);
        setSelectedAnswer1(null);
        setSelectedAnswer2(null);
        setSelectedAnswer3(null);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setTeacherMessage("Welcome back! Ready to explore density again? Let's test more materials!");
        allSuppliesNotifiedRef.current = false;
    };

    return (
        <div className="relative min-h-screen pb-20">
            {/* Premium Animated Background - Physics Theme (Purple/Blue) */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30" />
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-purple-200/40 via-blue-200/40 to-indigo-200/40 dark:from-purple-800/20 dark:via-blue-800/20 dark:to-indigo-800/20 blur-3xl"
                        style={{
                            width: `${200 + i * 50}px`,
                            height: `${200 + i * 50}px`,
                            left: `${(i * 12.5) % 100}%`,
                            top: `${(i * 15) % 100}%`,
                        }}
                        animate={{
                            x: [0, 50, -50, 0],
                            y: [0, 30, -30, 0],
                            scale: [1, 1.2, 0.8, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5,
                        }}
                    />
                ))}
            </div>

            <div className="relative space-y-6">
                {/* Teacher Voice */}
                <TeacherVoice 
                    message={teacherMessage}
                    onComplete={() => {}}
                    emotion={currentStep === 'complete' ? 'celebrating' : (currentStep === 'test-materials' || currentStep === 'results') ? 'explaining' : 'happy'}
                    quickActions={[
                        { label: 'Reset Lab', icon: '🔄', onClick: handleRestart },
                        { label: 'View Theory', icon: '📖', onClick: () => {} },
                        { label: 'Safety Tips', icon: '🛡️', onClick: () => {} }
                    ]}
                />

                {currentStep === 'intro' && isCompleted && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4 backdrop-blur-sm shadow-lg"
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
                        <Card className="w-full max-w-md mx-4 border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 shadow-2xl">
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

                {/* Objective Card - Premium Design */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50/80 via-blue-50/80 to-indigo-50/80 dark:from-purple-950/40 dark:via-blue-950/40 dark:to-indigo-950/40 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Scale className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                Density & Buoyancy
                            </CardTitle>
                            <CardDescription className="text-base">Discover why objects float or sink</CardDescription>
                        </CardHeader>
                    </Card>
                </motion.div>

                {/* Lab Information Card - Premium Design */}
                {currentStep === 'intro' && (
<motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-purple-600" />
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
                </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {currentStep === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl">Welcome to the Density Lab!</CardTitle>
                                    <CardDescription>Explore floating, sinking, and buoyancy</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                        <div className="flex flex-col sm:flex-row items-start gap-4">
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
                                    <Button 
                                        onClick={handleStartExperiment} 
                                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg" 
                                        size="lg"
                                    >
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
                                supplies={supplies}
                                collectedItems={collectedSupplies}
                                onCollect={handleCollectSupply}
                                onAllCollected={handleAllSuppliesCollected}
                                showSupplies={true}
                            />
                        </motion.div>
                    )}

                    {currentStep === 'fill-water' && (
                        <motion.div
                            key="fill-water"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl">Fill the Beaker</CardTitle>
                                    <CardDescription>Prepare your experimental setup</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex justify-center items-center">
                                        <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 p-8 min-h-[300px] flex items-center justify-center">
                                            <motion.div className="flex flex-col items-center gap-4">
                                                <div className="relative w-24 h-32 border-2 border-blue-400 rounded-lg bg-gradient-to-b from-blue-50/50 to-blue-200/50 dark:from-blue-900/50 dark:to-blue-800/50 flex items-center justify-center overflow-hidden shadow-lg">
                                                    {/* Water fill animation */}
                                                    <motion.div
                                                        animate={{ 
                                                            height: waterFilled ? '75%' : '0%',
                                                            opacity: waterFilled ? 0.8 : 0
                                                        }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                        className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500 rounded-b-lg"
                                                    />
                                                    {/* Water shine effect */}
                                                    {waterFilled && (
                                                        <motion.div
                                                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                            className="absolute top-2 left-2 right-2 h-4 bg-white/30 rounded-full blur-sm"
                                                        />
                                                    )}
                                                </div>
                                                <p className="text-center text-sm font-medium">
                                                    {waterFilled ? '✅ Water Filled' : 'Ready to fill'}
                                                </p>
                                            </motion.div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-medium mb-4">Fill the beaker with water</p>
                                        <Button 
                                            onClick={handleFillWater} 
                                            size="lg" 
                                            disabled={waterFilled}
                                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg disabled:opacity-50"
                                        >
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
                            <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl">Test Materials</CardTitle>
                                    <CardDescription>Drop materials into water and observe</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Enhanced Beaker with Water */}
                                    <div className="flex justify-center items-center">
                                        <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 p-8 min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
                                            {/* Enhanced Beaker */}
                                            <motion.div className="relative flex items-center justify-center">
                                                <div className="relative w-32 h-64 border-2 border-blue-400 rounded-lg bg-gradient-to-b from-blue-50/80 to-blue-200/80 dark:from-blue-900/80 dark:to-blue-800/80 shadow-xl overflow-hidden">
                                                    {/* Water */}
                                                    <motion.div 
                                                        className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300 dark:from-blue-600 dark:via-blue-500 dark:to-blue-400 rounded-b-lg"
                                                        animate={{ opacity: [0.9, 1, 0.9] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    />
                                                    {/* Water surface shine */}
                                                    <div className="absolute top-1/2 left-0 right-0 h-2 bg-white/40 blur-sm" />
                                                    
                                                    {/* Floating/Sinking Object with enhanced animation */}
                                                    {currentTest && (
                                                        <motion.div
                                                            key={currentTest.id}
                                                            initial={{ y: -100, opacity: 0, scale: 0.5 }}
                                                            animate={{
                                                                y: isDropping ? 0 : dropResult === 'floats' ? -80 : 60,
                                                                opacity: isDropping ? 1 : dropResult ? 1 : 0,
                                                                scale: isDropping ? 1 : dropResult ? 1 : 0.5,
                                                                rotate: isDropping ? [0, 10, -10, 0] : 0,
                                                            }}
                                                            transition={{ 
                                                                duration: isDropping ? 1 : 0.5,
                                                                ease: isDropping ? "easeIn" : "easeOut"
                                                            }}
                                                            className="absolute w-12 h-12 flex items-center justify-center text-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                                                            style={{
                                                                filter: dropResult === 'floats' ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                                                            }}
                                                        >
                                                            {currentTest.icon}
                                                        </motion.div>
                                                    )}
                                                    
                                                    {/* Ripples effect when dropping */}
                                                    {isDropping && (
                                                        <motion.div
                                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-blue-400 rounded-full"
                                                            initial={{ scale: 0, opacity: 0.8 }}
                                                            animate={{ scale: 2, opacity: 0 }}
                                                            transition={{ duration: 1 }}
                                                        />
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
                                                "p-4 rounded-lg border-2 text-center shadow-lg",
                                                dropResult === 'floats' 
                                                    ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800"
                                                    : "bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-800"
                                            )}
                                        >
                                            <p className="font-semibold text-lg">
                                                {currentTest.name} <span className={dropResult === 'floats' ? 'text-green-600' : 'text-red-600'}>
                                                    {dropResult.toUpperCase()}
                                                </span>
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Density: {currentTest.density} g/cm³ {dropResult === 'floats' ? '(less than water)' : '(greater than water)'}
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* Material Selection Buttons - Enhanced */}
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
                                                    className={cn(
                                                        "w-full border-2 transition-all",
                                                        testedMaterials.includes(material.id)
                                                            ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-400 text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200"
                                                            : "bg-gradient-to-r from-white to-purple-50 dark:from-gray-800 dark:to-purple-950/30 border-purple-300 dark:border-purple-700 hover:border-purple-500 hover:shadow-md text-gray-900 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-100"
                                                    )}
                                                    variant={testedMaterials.includes(material.id) ? "secondary" : "outline"}
                                                >
                                                    <span className="mr-2 text-xl">{material.icon}</span>
                                                    <span className="text-xs md:text-sm font-medium">{material.name}</span>
                                                    {testedMaterials.includes(material.id) && (
                                                        <CheckCircle className="ml-2 h-4 w-4" />
                                                    )}
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Progress */}
                                    <div className="text-center">
                                        <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full">
                                            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                                                Tested: {testedMaterials.length} / {materials.length}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Continue Button after all materials tested */}
                                    {allMaterialsTested && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex justify-center"
                                        >
                                            <Button 
                                                onClick={handleViewResults}
                                                size="lg"
                                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                                            >
                                                View Results
                                            </Button>
                                        </motion.div>
                                    )}
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
                            <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <CheckCircle className="h-6 w-6 text-purple-600" />
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
                                    <Button 
                                        onClick={handleViewQuiz} 
                                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg" 
                                        size="lg"
                                    >
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
                            <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl">Knowledge Check</CardTitle>
                                    <CardDescription>Answer these questions about density</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Question 1 */}
                                    <div className="space-y-3">
                                        <p className="font-medium text-lg">1. Objects float if their density is:</p>
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
                                                        selectedAnswer1 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md",
                                                        selectedAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20 shadow-md",
                                                        selectedAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20 shadow-md",
                                                        selectedAnswer1 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:shadow-sm"
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
                                        <p className="font-medium text-lg">2. Which material will sink the fastest?</p>
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
                                                        selectedAnswer2 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md",
                                                        selectedAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20 shadow-md",
                                                        selectedAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20 shadow-md",
                                                        selectedAnswer2 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:shadow-sm"
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
                                        <p className="font-medium text-lg">3. What principle explains the buoyant force on submerged objects?</p>
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
                                                        selectedAnswer3 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md",
                                                        selectedAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20 shadow-md",
                                                        selectedAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20 shadow-md",
                                                        selectedAnswer3 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:shadow-sm"
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
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg disabled:opacity-50"
                                        size="lg"
                                    >
                                        Submit Answers
                                    </Button>
                                    {quizSubmitted && !quizFeedback.includes('Perfect') && (
                                        <Button 
                                            onClick={() => {
                                                setSelectedAnswer1(null);
                                                setSelectedAnswer2(null);
                                                setSelectedAnswer3(null);
                                                setQuizFeedback('');
                                                setQuizSubmitted(false);
                                            }} 
                                            variant="outline" 
                                            size="lg"
                                            className="border-2"
                                        >
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
                            <Card className="border-2 border-yellow-400/50 dark:border-yellow-600/50 bg-gradient-to-br from-yellow-50/90 via-orange-50/90 to-amber-50/90 dark:from-yellow-950/40 dark:via-orange-950/40 dark:to-amber-950/40 backdrop-blur-sm shadow-2xl">
                                <CardHeader className="text-center">
                                    <motion.div
                                        animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                        transition={{ duration: 0.5 }}
                                        className="flex justify-center mb-4"
                                    >
                                        <Trophy className="h-20 w-20 text-yellow-500" />
                                    </motion.div>
                                    <CardTitle className="text-2xl">Lab Complete!</CardTitle>
                                    <CardDescription className="text-base">You've mastered density and buoyancy</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                        <div className="flex items-center justify-center gap-2 mb-4">
                                            <Award className="h-8 w-8 text-purple-600" />
                                            <span className="text-2xl font-bold text-purple-600">+{xpEarned} XP</span>
                                        </div>
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
                                    <Button 
                                        onClick={handleRestart} 
                                        variant="outline" 
                                        className="w-full border-2 bg-white/50 hover:bg-white/80 dark:bg-gray-900/50 dark:hover:bg-gray-900/80" 
                                        size="lg"
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Restart Lab
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

