'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Trophy, Award, GripVertical, Magnet, Compass, RotateCw, Move, Zap } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { Switch } from '../ui/switch';

type Step = 'intro' | 'setup' | 'experiment' | 'results' | 'quiz' | 'complete';

interface MagnetData {
    id: string;
    x: number;
    y: number;
    rotation: number;
    flipped: boolean;
}

export function MagneticFieldLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Experiment state
    const [showFieldLines, setShowFieldLines] = React.useState(true);
    const [magnet1, setMagnet1] = React.useState<MagnetData>({ id: 'magnet1', x: 150, y: 200, rotation: 0, flipped: false });
    const [magnet2, setMagnet2] = React.useState<MagnetData>({ id: 'magnet2', x: 350, y: 200, rotation: 0, flipped: false });
    const [compassPositions, setCompassPositions] = React.useState<Array<{ x: number, y: number, angle: number }>>([]);
    const [interactionType, setInteractionType] = React.useState<'attract' | 'repel' | 'none'>('none');
    const [observationsCount, setObservationsCount] = React.useState(0);
    
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
    const labId = 'magnetic-field';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    // Draggable teacher
    const [teacherPosition, setTeacherPosition] = React.useState({ x: 0, y: 0 });

    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Magnetic Field Lab! We'll explore the invisible force fields around magnets and see how they attract and repel. Let's dive into magnetism!");
        }
    }, [currentStep]);

    // Calculate magnetic interaction
    React.useEffect(() => {
        const distance = Math.sqrt(Math.pow(magnet2.x - magnet1.x, 2) + Math.pow(magnet2.y - magnet1.y, 2));
        
        if (distance < 150) {
            // Check if poles are facing each other
            const m1NorthSide = magnet1.flipped ? 'left' : 'right';
            const m2NorthSide = magnet2.flipped ? 'left' : 'right';
            const areFacing = Math.abs(magnet1.x - magnet2.x) > 50;
            
            if (areFacing) {
                if (m1NorthSide === m2NorthSide) {
                    setInteractionType('repel');
                } else {
                    setInteractionType('attract');
                }
            } else {
                setInteractionType('none');
            }
        } else {
            setInteractionType('none');
        }
    }, [magnet1, magnet2]);

    const handleStartExperiment = () => {
        setTeacherMessage("Perfect! Let's set up our magnetic field apparatus. You can drag magnets, flip their poles, and place compasses to see the field!");
        setPendingTransition(() => () => {
            setCurrentStep('setup');
        });
    };

    const handleFlipMagnet = (magnetId: string) => {
        if (magnetId === 'magnet1') {
            setMagnet1(prev => ({ ...prev, flipped: !prev.flipped }));
        } else {
            setMagnet2(prev => ({ ...prev, flipped: !prev.flipped }));
        }
        toast({ title: '🧲 Magnet Flipped', description: 'North and South poles swapped!' });
    };

    const handleRotateMagnet = (magnetId: string) => {
        if (magnetId === 'magnet1') {
            setMagnet1(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
        } else {
            setMagnet2(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
        }
        toast({ title: '🔄 Magnet Rotated', description: '90° rotation applied' });
    };

    const handlePlaceCompass = () => {
        const x = 250 + Math.random() * 100 - 50;
        const y = 150 + Math.random() * 100 - 50;
        const angle = calculateCompassAngle(x, y);
        
        setCompassPositions(prev => [...prev, { x, y, angle }]);
        setObservationsCount(prev => prev + 1);
        
        if (observationsCount === 0) {
            setTeacherMessage("First compass placed! It points along the magnetic field. Try different positions to map the field!");
        } else if (observationsCount === 2) {
            setTeacherMessage("Great work! You're mapping the magnetic field. See how compasses align with invisible field lines!");
        }
        
        toast({ title: '🧭 Compass Placed', description: 'Observing field direction' });
    };

    const handleRecordObservation = () => {
        if (observationsCount < 3) {
            toast({ 
                title: 'Need More Observations', 
                description: `Place ${3 - observationsCount} more compass(es)`,
                variant: 'destructive' 
            });
            return;
        }
        
        setTeacherMessage("Excellent observations! You've mapped the magnetic field. Let's analyze your findings!");
        setPendingTransition(() => () => {
            setCurrentStep('results');
        });
    };

    const calculateCompassAngle = (x: number, y: number): number => {
        // Simple field calculation based on closest magnet
        const dist1 = Math.sqrt(Math.pow(x - magnet1.x, 2) + Math.pow(y - magnet1.y, 2));
        const dist2 = Math.sqrt(Math.pow(x - magnet2.x, 2) + Math.pow(y - magnet2.y, 2));
        
        const closestMagnet = dist1 < dist2 ? magnet1 : magnet2;
        const northSide = closestMagnet.flipped ? -1 : 1;
        
        let angle = Math.atan2(y - closestMagnet.y, (x - closestMagnet.x) * northSide) * 180 / Math.PI;
        return angle + closestMagnet.rotation;
    };

    const handleTeacherComplete = () => {
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null);
            transition();
        }
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Time to test your understanding of magnetic fields!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
        });
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        if (quizAnswer1 === 'opposite') correctCount++;
        if (quizAnswer2 === 'same') correctCount++;
        if (quizAnswer3 === 'north') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand magnetism! +${earnedXP} XP`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Review magnetic poles.`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: opposite poles attract, same poles repel.`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setMagnet1({ id: 'magnet1', x: 150, y: 200, rotation: 0, flipped: false });
        setMagnet2({ id: 'magnet2', x: 350, y: 200, rotation: 0, flipped: false });
        setCompassPositions([]);
        setInteractionType('none');
        setObservationsCount(0);
        setShowFieldLines(true);
        setQuizAnswer1(undefined);
        setQuizAnswer2(undefined);
        setQuizAnswer3(undefined);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setPendingTransition(null);
        setTeacherMessage("Ready to explore magnetism again!");
    };

    const generateFieldLines = () => {
        const lines: JSX.Element[] = [];
        
        // Generate field lines from North pole of magnet1 to South pole of magnet2
        for (let i = -2; i <= 2; i++) {
            const startX = magnet1.flipped ? magnet1.x - 40 : magnet1.x + 40;
            const startY = magnet1.y + i * 15;
            const endX = magnet2.flipped ? magnet2.x + 40 : magnet2.x - 40;
            const endY = magnet2.y + i * 15;
            
            const controlX1 = startX + (endX - startX) * 0.3;
            const controlY1 = startY + (i * 30);
            const controlX2 = startX + (endX - startX) * 0.7;
            const controlY2 = endY + (i * 30);
            
            lines.push(
                <motion.path
                    key={`line-${i}`}
                    d={`M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    opacity={0.6}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                />
            );
        }
        
        return lines;
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
                <Card className="shadow-2xl border-2 border-red-400 dark:border-red-600 cursor-move">
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
                    className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                            <Trophy className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-900 dark:text-red-100">Lab Completed!</h3>
                            <p className="text-sm text-red-700 dark:text-red-300">
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
                            <CardDescription>You've mastered magnetic fields!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-red-600">
                                <Award className="h-8 w-8" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You understand how magnets work!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Magnet className="h-5 w-5 text-red-600" />
                        Magnetic Field Lab
                    </CardTitle>
                    <CardDescription>Explore invisible magnetic force fields and interactions between magnets</CardDescription>
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
                                <p><strong>Magnetism</strong> is a force that can attract or repel magnetic materials.</p>
                                <p className="mt-2"><strong>Key Concepts:</strong></p>
                                <ul>
                                    <li>Every magnet has two poles: North (N) and South (S)</li>
                                    <li>Opposite poles attract (N-S)</li>
                                    <li>Same poles repel (N-N or S-S)</li>
                                    <li>Magnetic field is the region around a magnet where magnetic force acts</li>
                                    <li>Field lines go from North to South pole</li>
                                    <li>Closer field lines mean stronger magnetic field</li>
                                </ul>
                                <p className="mt-2"><strong>Magnetic Field Properties:</strong></p>
                                <ul>
                                    <li>Invisible but can be detected using iron filings or compasses</li>
                                    <li>Field strength decreases with distance from the magnet</li>
                                    <li>Field lines never cross each other</li>
                                    <li>Field is strongest at the poles</li>
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
                                    <li>Keep magnets away from electronic devices (phones, computers, credit cards)</li>
                                    <li>Strong magnets can pinch fingers - handle carefully</li>
                                    <li>Store magnets with keepers to preserve magnetism</li>
                                    <li>Don't drop magnets - can lose magnetization</li>
                                    <li>Keep magnets away from pacemakers and medical devices</li>
                                    <li>Supervise children when using strong magnets</li>
                                    <li>Clean up iron filings carefully to avoid skin irritation</li>
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
                                <CardTitle>Welcome to Magnetic Field Lab!</CardTitle>
                                <CardDescription>Discover the invisible forces around magnets</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-red-200 dark:border-red-800">
                                    <div className="flex items-start gap-4">
                                        <Magnet className="w-16 h-16 text-red-600 dark:text-red-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-red-900 dark:text-red-100">What You'll Learn:</h3>
                                            <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                                                <li>• How to visualize invisible magnetic fields</li>
                                                <li>• Why opposite poles attract and same poles repel</li>
                                                <li>• How to map magnetic field lines using compasses</li>
                                                <li>• The shape and direction of magnetic fields</li>
                                                <li>• Real-world applications of magnetism</li>
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

                {currentStep === 'setup' && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <Card className="border-2 border-red-200 dark:border-red-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Magnet className="h-5 w-5 text-red-600" />
                                    Interactive Magnetic Field
                                </CardTitle>
                                <CardDescription>Compasses placed: {observationsCount}/3</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Interaction Display */}
                                {interactionType !== 'none' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={cn(
                                            "p-4 rounded-lg border-2 font-semibold text-center",
                                            interactionType === 'attract' && "bg-green-50 dark:bg-green-950/20 border-green-500 text-green-700 dark:text-green-300",
                                            interactionType === 'repel' && "bg-red-50 dark:bg-red-950/20 border-red-500 text-red-700 dark:text-red-300"
                                        )}
                                    >
                                        {interactionType === 'attract' ? '⬅️ ATTRACTION ➡️ Opposite poles pulling together!' : '⬅️ REPULSION ➡️ Same poles pushing apart!'}
                                    </motion.div>
                                )}

                                {/* SVG Canvas */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                                    <svg width="500" height="400" className="w-full h-auto" viewBox="0 0 500 400">
                                        {/* Background */}
                                        <rect width="500" height="400" fill="transparent" />
                                        
                                        {/* Field Lines */}
                                        {showFieldLines && generateFieldLines()}
                                        
                                        {/* Magnet 1 */}
                                        <g transform={`translate(${magnet1.x},${magnet1.y}) rotate(${magnet1.rotation})`}>
                                            <rect x="-40" y="-10" width="80" height="20" rx="3" stroke="black" strokeWidth="2" />
                                            <rect 
                                                x={magnet1.flipped ? 0 : -40} 
                                                y="-10" 
                                                width="40" 
                                                height="20" 
                                                rx="3" 
                                                fill={magnet1.flipped ? "#3b82f6" : "#ef4444"} 
                                            />
                                            <rect 
                                                x={magnet1.flipped ? -40 : 0} 
                                                y="-10" 
                                                width="40" 
                                                height="20" 
                                                rx="3" 
                                                fill={magnet1.flipped ? "#ef4444" : "#3b82f6"} 
                                            />
                                            <text x={magnet1.flipped ? 20 : -20} y="5" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">N</text>
                                            <text x={magnet1.flipped ? -20 : 20} y="5" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">S</text>
                                        </g>
                                        
                                        {/* Magnet 2 */}
                                        <g transform={`translate(${magnet2.x},${magnet2.y}) rotate(${magnet2.rotation})`}>
                                            <rect x="-40" y="-10" width="80" height="20" rx="3" stroke="black" strokeWidth="2" />
                                            <rect 
                                                x={magnet2.flipped ? 0 : -40} 
                                                y="-10" 
                                                width="40" 
                                                height="20" 
                                                rx="3" 
                                                fill={magnet2.flipped ? "#3b82f6" : "#ef4444"} 
                                            />
                                            <rect 
                                                x={magnet2.flipped ? -40 : 0} 
                                                y="-10" 
                                                width="40" 
                                                height="20" 
                                                rx="3" 
                                                fill={magnet2.flipped ? "#ef4444" : "#3b82f6"} 
                                            />
                                            <text x={magnet2.flipped ? 20 : -20} y="5" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">N</text>
                                            <text x={magnet2.flipped ? -20 : 20} y="5" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">S</text>
                                        </g>
                                        
                                        {/* Compasses */}
                                        {compassPositions.map((compass, idx) => (
                                            <g key={idx} transform={`translate(${compass.x},${compass.y})`}>
                                                <circle cx="0" cy="0" r="15" fill="white" stroke="gray" strokeWidth="2" />
                                                <g transform={`rotate(${compass.angle})`}>
                                                    <path d="M 0 -12 L 5 0 L 0 4 L -5 0 Z" fill="#ef4444" />
                                                    <path d="M 0 12 L 5 0 L 0 4 L -5 0 Z" fill="gray" />
                                                </g>
                                            </g>
                                        ))}
                                    </svg>
                                </div>

                                {/* Controls */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm">Magnet 1 Controls:</h4>
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleFlipMagnet('magnet1')} size="sm" variant="outline" className="flex-1">
                                                <RotateCw className="h-4 w-4 mr-1" />
                                                Flip Poles
                                            </Button>
                                            <Button onClick={() => handleRotateMagnet('magnet1')} size="sm" variant="outline" className="flex-1">
                                                <Move className="h-4 w-4 mr-1" />
                                                Rotate
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm">Magnet 2 Controls:</h4>
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleFlipMagnet('magnet2')} size="sm" variant="outline" className="flex-1">
                                                <RotateCw className="h-4 w-4 mr-1" />
                                                Flip Poles
                                            </Button>
                                            <Button onClick={() => handleRotateMagnet('magnet2')} size="sm" variant="outline" className="flex-1">
                                                <Move className="h-4 w-4 mr-1" />
                                                Rotate
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Field Lines Toggle */}
                                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <span className="text-sm font-medium">Show Magnetic Field Lines</span>
                                    <Switch checked={showFieldLines} onCheckedChange={setShowFieldLines} />
                                </div>

                                {/* Place Compass Button */}
                                <Button 
                                    onClick={handlePlaceCompass}
                                    className="w-full"
                                    size="lg"
                                >
                                    <Compass className="h-5 w-5 mr-2" />
                                    Place Compass
                                </Button>

                                {/* Instructions */}
                                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                    <h4 className="font-semibold text-sm mb-2">Instructions:</h4>
                                    <ul className="text-sm space-y-1">
                                        <li>• Flip magnet poles to see attraction/repulsion</li>
                                        <li>• Rotate magnets to change field orientation</li>
                                        <li>• Place 3+ compasses to map the field</li>
                                        <li>• Watch how compasses align with field lines</li>
                                        <li>• Red end of compass points to North</li>
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleRecordObservation} 
                                    disabled={observationsCount < 3}
                                    variant="outline"
                                    className="w-full"
                                    size="lg"
                                >
                                    Record Observations ({observationsCount}/3 compasses)
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
                        <Card className="border-2 border-red-200 dark:border-red-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-red-600" />
                                    Analysis & Results
                                </CardTitle>
                                <CardDescription>Magnetic Field Observations</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Results Summary */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg border-2 border-green-200 dark:border-green-800">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        Magnetic Fields Mapped!
                                    </h3>
                                    <p className="text-sm mb-4">
                                        You successfully mapped the magnetic field using {compassPositions.length} compass observations!
                                    </p>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded">
                                        <p className="text-sm"><strong>Compasses Placed:</strong> {compassPositions.length}</p>
                                        <p className="text-sm"><strong>Field Lines:</strong> {showFieldLines ? 'Visible' : 'Hidden'}</p>
                                        <p className="text-sm"><strong>Magnet Configuration:</strong> {magnet1.flipped === magnet2.flipped ? 'Same poles facing' : 'Opposite poles facing'}</p>
                                    </div>
                                </div>

                                {/* Key Observations */}
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-red-200 dark:border-red-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Observations:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Opposite Poles Attract:</strong> North and South poles pull together</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Same Poles Repel:</strong> North-North or South-South push apart</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Field Lines:</strong> Go from North to South pole</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Compass Alignment:</strong> Needle aligns with field direction</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Real-World Applications */}
                                <div className="border-2 border-red-200 dark:border-red-800 p-6 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-4">Real-World Applications:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• <strong>Compasses:</strong> Navigate using Earth's magnetic field</li>
                                        <li>• <strong>Electric Motors:</strong> Use magnetic forces to create rotation</li>
                                        <li>• <strong>Generators:</strong> Convert motion into electricity using magnetism</li>
                                        <li>• <strong>MRI Machines:</strong> Use strong magnetic fields for medical imaging</li>
                                        <li>• <strong>Magnetic Levitation:</strong> Trains float using magnetic repulsion</li>
                                        <li>• <strong>Data Storage:</strong> Hard drives use magnetism to store information</li>
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
                                <CardDescription>Test your understanding of magnetism</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. What happens when opposite magnetic poles are brought together?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'opposite', label: 'They attract each other', isCorrect: true },
                                            { value: 'repel', label: 'They repel each other' },
                                            { value: 'nothing', label: 'Nothing happens' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer1(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer1 === option.value && !quizSubmitted && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer1 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer1 === option.value && !quizSubmitted && "border-red-500 bg-red-500",
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
                                    <p className="font-medium">2. What happens when two North poles are brought together?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'same', label: 'They repel each other', isCorrect: true },
                                            { value: 'attract', label: 'They attract each other' },
                                            { value: 'cancel', label: 'They cancel each other out' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer2(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer2 === option.value && !quizSubmitted && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer2 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer2 === option.value && !quizSubmitted && "border-red-500 bg-red-500",
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
                                    <p className="font-medium">3. Magnetic field lines go from:</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'north', label: 'North pole to South pole', isCorrect: true },
                                            { value: 'south', label: 'South pole to North pole' },
                                            { value: 'center', label: 'Center outward in all directions' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer3(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer3 === option.value && !quizSubmitted && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer3 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer3 === option.value && !quizSubmitted && "border-red-500 bg-red-500",
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
                                            quizFeedback.includes('Good') ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100" :
                                            "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100"
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
                        <Card className="border-2 border-red-200 dark:border-red-800">
                            <CardHeader className="text-center">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="flex justify-center mb-4"
                                >
                                    <Trophy className="h-16 w-16 text-yellow-500" />
                                </motion.div>
                                <CardTitle>Lab Complete!</CardTitle>
                                <CardDescription>You've mastered magnetic fields!</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-red-200 dark:border-red-800">
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span>Opposite magnetic poles attract each other</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span>Same magnetic poles repel each other</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span>Magnetic field lines go from North to South</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                            <span>How compasses detect and align with magnetic fields</span>
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
