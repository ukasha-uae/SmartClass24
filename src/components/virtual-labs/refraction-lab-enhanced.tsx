'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Trophy, Award, GripVertical, Droplets, Lightbulb, Waves, Ruler } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { Slider } from '../ui/slider';

type Step = 'intro' | 'setup' | 'experiment' | 'results' | 'quiz' | 'complete';

interface RefractionMeasurement {
    incidentAngle: number;
    refractedAngle: number;
    medium: 'air-to-glass' | 'air-to-water';
    refractiveIndex: number;
}

export function RefractionLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Experiment state
    const [incidentAngle, setIncidentAngle] = React.useState(30);
    const [medium, setMedium] = React.useState<'air-to-glass' | 'air-to-water'>('air-to-glass');
    const [measurements, setMeasurements] = React.useState<RefractionMeasurement[]>([]);
    const [showNormal, setShowNormal] = React.useState(true);
    const [showAngles, setShowAngles] = React.useState(true);
    
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
    const labId = 'refraction';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    // Draggable teacher
    const [teacherPosition, setTeacherPosition] = React.useState({ x: 0, y: 0 });

    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Refraction Lab! We'll explore how light bends when it passes from one medium to another. Prepare to see light change direction!");
        }
    }, [currentStep]);

    // Snell's Law calculations
    const n1 = 1.0; // Air
    const n2 = medium === 'air-to-glass' ? 1.5 : 1.33; // Glass or Water
    
    const incidentRad = (incidentAngle * Math.PI) / 180;
    const refractedRad = Math.asin((n1 / n2) * Math.sin(incidentRad));
    const refractedAngle = isNaN(refractedRad) ? 0 : (refractedRad * 180) / Math.PI;

    const handleStartExperiment = () => {
        setTeacherMessage("Perfect! Let's set up our refraction apparatus. You'll see how light bends as it enters different materials!");
        setPendingTransition(() => () => {
            setCurrentStep('setup');
        });
    };

    const handleTakeMeasurement = () => {
        const measurement: RefractionMeasurement = {
            incidentAngle,
            refractedAngle: parseFloat(refractedAngle.toFixed(1)),
            medium,
            refractiveIndex: n2
        };
        
        setMeasurements(prev => [...prev, measurement]);
        
        if (measurements.length === 0) {
            setTeacherMessage(`First measurement recorded! Light bent from ${incidentAngle}° to ${refractedAngle.toFixed(1)}°. Try a different angle or medium!`);
        } else if (measurements.length === 1) {
            setTeacherMessage(`Great! Notice how the angle changes. Take one more measurement to see the pattern!`);
        } else if (measurements.length === 2) {
            setTeacherMessage(`Excellent! Three measurements complete. You've verified Snell's Law: light bends toward the normal when entering a denser medium!`);
        }
        
        toast({ 
            title: '📐 Measurement Recorded', 
            description: `i=${incidentAngle}°, r=${refractedAngle.toFixed(1)}° in ${medium}` 
        });
    };

    const handleTeacherComplete = () => {
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null);
            transition();
        }
    };

    const handleViewResults = () => {
        if (measurements.length < 3) {
            toast({ 
                title: 'Need More Measurements', 
                description: `Take ${3 - measurements.length} more measurement(s)`,
                variant: 'destructive' 
            });
            return;
        }
        setTeacherMessage("Perfect data! Let's analyze how light bends according to Snell's Law!");
        setPendingTransition(() => () => {
            setCurrentStep('results');
        });
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Time to test your understanding of refraction!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
        });
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        if (quizAnswer1 === 'bends') correctCount++;
        if (quizAnswer2 === 'towards') correctCount++;
        if (quizAnswer3 === 'snell') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand refraction! +${earnedXP} XP`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Review Snell's Law.`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: light bends toward the normal when entering a denser medium.`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setIncidentAngle(30);
        setMedium('air-to-glass');
        setMeasurements([]);
        setShowNormal(true);
        setShowAngles(true);
        setQuizAnswer1(undefined);
        setQuizAnswer2(undefined);
        setQuizAnswer3(undefined);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setPendingTransition(null);
        setTeacherMessage("Ready to explore refraction again!");
    };

    // SVG calculations for ray diagram
    const width = 400;
    const height = 350;
    const boundary = height * 0.4; // Air-medium boundary
    
    const rayLength = 140;
    
    const incidentStart = {
        x: width / 2 - rayLength * Math.sin(incidentRad),
        y: boundary - rayLength * Math.cos(incidentRad)
    };
    
    const refractedEnd = {
        x: width / 2 + rayLength * Math.sin(refractedRad),
        y: boundary + rayLength * Math.cos(refractedRad)
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
                    className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4"
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
                            <CardDescription>You've mastered refraction!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-blue-600">
                                <Award className="h-8 w-8" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You understand how light bends!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Waves className="h-5 w-5 text-blue-600" />
                        Refraction of Light Lab
                    </CardTitle>
                    <CardDescription>Investigate how light bends when passing through different media</CardDescription>
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
                                <p><strong>Refraction</strong> is the bending of light as it passes from one medium to another with a different optical density.</p>
                                <p className="mt-2"><strong>Snell's Law states:</strong></p>
                                <ul>
                                    <li>n₁ sin(θ₁) = n₂ sin(θ₂)</li>
                                    <li>Where n is the refractive index and θ is the angle from the normal</li>
                                    <li>Light bends toward the normal when entering a denser medium</li>
                                    <li>Light bends away from the normal when entering a less dense medium</li>
                                </ul>
                                <p className="mt-2"><strong>Key Concepts:</strong></p>
                                <ul>
                                    <li><strong>Refractive Index (n):</strong> Measure of how much light slows down in a medium</li>
                                    <li><strong>Air:</strong> n ≈ 1.0</li>
                                    <li><strong>Water:</strong> n ≈ 1.33</li>
                                    <li><strong>Glass:</strong> n ≈ 1.5</li>
                                    <li><strong>Critical Angle:</strong> Angle beyond which total internal reflection occurs</li>
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
                                    <li>Never shine bright lights directly into eyes</li>
                                    <li>Use only low-power laser pointers (Class 2 or below)</li>
                                    <li>Handle glass blocks carefully to avoid cuts</li>
                                    <li>Keep water containers stable to prevent spills</li>
                                    <li>Clean up water spills immediately</li>
                                    <li>Work in a well-lit room</li>
                                    <li>Report any broken glass immediately</li>
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
                                <CardTitle>Welcome to Refraction Lab!</CardTitle>
                                <CardDescription>Discover how light bends through different materials</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <div className="flex items-start gap-4">
                                        <Droplets className="w-16 h-16 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">What You'll Learn:</h3>
                                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                                <li>• How light bends when entering different materials</li>
                                                <li>• The relationship between incident and refracted angles</li>
                                                <li>• Snell's Law and refractive indices</li>
                                                <li>• Why light bends toward the normal in denser media</li>
                                                <li>• Real-world applications like lenses and fiber optics</li>
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
                        <Card className="border-2 border-blue-200 dark:border-blue-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-blue-600" />
                                    Refraction Apparatus
                                </CardTitle>
                                <CardDescription>Measurements taken: {measurements.length}/3</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Medium Selection */}
                                <div className="space-y-3">
                                    <div className="text-base font-semibold">Medium Selection:</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            variant={medium === 'air-to-glass' ? 'default' : 'outline'}
                                            onClick={() => setMedium('air-to-glass')}
                                            className="h-auto py-4"
                                        >
                                            <div className="text-center">
                                                <div className="font-semibold">Glass Block</div>
                                                <div className="text-xs opacity-70">n = 1.5</div>
                                            </div>
                                        </Button>
                                        <Button
                                            variant={medium === 'air-to-water' ? 'default' : 'outline'}
                                            onClick={() => setMedium('air-to-water')}
                                            className="h-auto py-4"
                                        >
                                            <div className="text-center">
                                                <div className="font-semibold">Water</div>
                                                <div className="text-xs opacity-70">n = 1.33</div>
                                            </div>
                                        </Button>
                                    </div>
                                </div>

                                {/* Angle Control */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-base font-semibold">Incident Angle: {incidentAngle}°</div>
                                        <div className="text-sm text-muted-foreground">
                                            Refracted Angle: {refractedAngle.toFixed(1)}°
                                        </div>
                                    </div>
                                    <Slider
                                        value={[incidentAngle]}
                                        onValueChange={(values) => setIncidentAngle(values[0])}
                                        min={10}
                                        max={80}
                                        step={5}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>10° (Small bend)</span>
                                        <span>45° (Medium bend)</span>
                                        <span>80° (Large bend)</span>
                                    </div>
                                </div>

                                {/* Visual Ray Diagram */}
                                <div className="bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-950/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                                    <svg width={width} height={height} className="w-full h-auto">
                                        {/* Air region (top) */}
                                        <rect x={0} y={0} width={width} height={boundary} fill="url(#airGradient)" />
                                        <text x={10} y={20} fill="gray" fontSize="12" fontWeight="bold">AIR (n=1.0)</text>
                                        
                                        {/* Medium region (bottom) */}
                                        <rect x={0} y={boundary} width={width} height={height - boundary} fill={medium === 'air-to-glass' ? "url(#glassGradient)" : "url(#waterGradient)"} />
                                        <text x={10} y={boundary + 25} fill="white" fontSize="12" fontWeight="bold">
                                            {medium === 'air-to-glass' ? 'GLASS (n=1.5)' : 'WATER (n=1.33)'}
                                        </text>
                                        
                                        {/* Boundary line */}
                                        <line
                                            x1={0}
                                            y1={boundary}
                                            x2={width}
                                            y2={boundary}
                                            stroke="black"
                                            strokeWidth="3"
                                            strokeDasharray="8,4"
                                        />
                                        
                                        {/* Normal line */}
                                        {showNormal && (
                                            <line
                                                x1={width / 2}
                                                y1={boundary - 100}
                                                x2={width / 2}
                                                y2={boundary + 100}
                                                stroke="gray"
                                                strokeWidth="2"
                                                strokeDasharray="5,5"
                                            />
                                        )}
                                        
                                        {/* Incident ray */}
                                        <motion.line
                                            x1={incidentStart.x}
                                            y1={incidentStart.y}
                                            x2={width / 2}
                                            y2={boundary}
                                            stroke="#ef4444"
                                            strokeWidth="3"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                        <motion.circle
                                            cx={incidentStart.x}
                                            cy={incidentStart.y}
                                            r="6"
                                            fill="#ef4444"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: [0, 1.2, 1] }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                        />
                                        
                                        {/* Refracted ray */}
                                        <motion.line
                                            x1={width / 2}
                                            y1={boundary}
                                            x2={refractedEnd.x}
                                            y2={refractedEnd.y}
                                            stroke="#3b82f6"
                                            strokeWidth="3"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.5, delay: 0.5 }}
                                        />
                                        <motion.polygon
                                            points={`${refractedEnd.x},${refractedEnd.y} ${refractedEnd.x - 8},${refractedEnd.y - 10} ${refractedEnd.x + 8},${refractedEnd.y - 10}`}
                                            fill="#3b82f6"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: [0, 1.2, 1] }}
                                            transition={{ duration: 0.5, delay: 0.8 }}
                                        />
                                        
                                        {/* Angle arcs */}
                                        {showAngles && (
                                            <>
                                                {/* Incident angle arc */}
                                                <path
                                                    d={`M ${width/2} ${boundary - 40} A 40 40 0 0 1 ${width/2 - 40 * Math.sin(incidentRad)} ${boundary - 40 * Math.cos(incidentRad)}`}
                                                    fill="none"
                                                    stroke="#ef4444"
                                                    strokeWidth="2"
                                                />
                                                <text
                                                    x={width/2 - 55}
                                                    y={boundary - 45}
                                                    fill="#ef4444"
                                                    fontSize="14"
                                                    fontWeight="bold"
                                                >
                                                    i={incidentAngle}°
                                                </text>
                                                
                                                {/* Refracted angle arc */}
                                                <path
                                                    d={`M ${width/2} ${boundary + 40} A 40 40 0 0 0 ${width/2 + 40 * Math.sin(refractedRad)} ${boundary + 40 * Math.cos(refractedRad)}`}
                                                    fill="none"
                                                    stroke="#3b82f6"
                                                    strokeWidth="2"
                                                />
                                                <text
                                                    x={width/2 + 35}
                                                    y={boundary + 50}
                                                    fill="#3b82f6"
                                                    fontSize="14"
                                                    fontWeight="bold"
                                                >
                                                    r={refractedAngle.toFixed(1)}°
                                                </text>
                                            </>
                                        )}
                                        
                                        {/* Refraction point */}
                                        <circle cx={width / 2} cy={boundary} r="5" fill="yellow" />
                                        
                                        {/* Gradient definitions */}
                                        <defs>
                                            <linearGradient id="airGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#E0F2FE" />
                                                <stop offset="100%" stopColor="#BAE6FD" />
                                            </linearGradient>
                                            <linearGradient id="glassGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.6" />
                                                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.8" />
                                            </linearGradient>
                                            <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.6" />
                                                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    
                                    {/* Legend */}
                                    <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-0.5 bg-red-500"></div>
                                            <span>Incident Ray</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-0.5 bg-blue-500"></div>
                                            <span>Refracted Ray</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-0.5 bg-gray-400 border-dashed border"></div>
                                            <span>Normal</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Snell's Law Calculation */}
                                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <h4 className="font-semibold mb-2">Snell's Law Calculation:</h4>
                                    <div className="text-sm space-y-1">
                                        <p>n₁ sin(θ₁) = n₂ sin(θ₂)</p>
                                        <p>{n1.toFixed(2)} × sin({incidentAngle}°) = {n2.toFixed(2)} × sin({refractedAngle.toFixed(1)}°)</p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Light bends {refractedAngle < incidentAngle ? 'toward' : 'away from'} the normal
                                        </p>
                                    </div>
                                </div>

                                {/* Toggle Controls */}
                                <div className="flex gap-4">
                                    <Button
                                        variant={showNormal ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setShowNormal(!showNormal)}
                                        className="flex-1"
                                    >
                                        {showNormal ? 'Hide' : 'Show'} Normal
                                    </Button>
                                    <Button
                                        variant={showAngles ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setShowAngles(!showAngles)}
                                        className="flex-1"
                                    >
                                        {showAngles ? 'Hide' : 'Show'} Angles
                                    </Button>
                                </div>

                                {/* Measurement Button */}
                                <Button 
                                    onClick={handleTakeMeasurement}
                                    className="w-full"
                                    size="lg"
                                >
                                    <Ruler className="h-5 w-5 mr-2" />
                                    Take Measurement
                                </Button>

                                {/* Measurements Table */}
                                {measurements.length > 0 && (
                                    <div className="border rounded-lg p-4">
                                        <h4 className="font-semibold mb-2">Recorded Measurements:</h4>
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left p-2">#</th>
                                                    <th className="text-left p-2">Medium</th>
                                                    <th className="text-left p-2">Incident (i)</th>
                                                    <th className="text-left p-2">Refracted (r)</th>
                                                    <th className="text-left p-2">n</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {measurements.map((m, idx) => (
                                                    <tr key={idx} className="border-b">
                                                        <td className="p-2">{idx + 1}</td>
                                                        <td className="p-2 text-xs">{m.medium === 'air-to-glass' ? 'Glass' : 'Water'}</td>
                                                        <td className="p-2 font-semibold">{m.incidentAngle}°</td>
                                                        <td className="p-2 font-semibold">{m.refractedAngle}°</td>
                                                        <td className="p-2">{m.refractiveIndex}</td>
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
                                    disabled={measurements.length < 3}
                                    variant="outline"
                                    className="w-full"
                                    size="lg"
                                >
                                    View Results ({measurements.length}/3 measurements)
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
                                    Analysis & Results
                                </CardTitle>
                                <CardDescription>Verification of Snell's Law</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Results Summary */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg border-2 border-green-200 dark:border-green-800">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        Snell's Law Verified!
                                    </h3>
                                    <p className="text-sm mb-4">
                                        All {measurements.length} measurements confirm: <strong>n₁ sin(θ₁) = n₂ sin(θ₂)</strong>
                                    </p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {measurements.map((m, idx) => (
                                            <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded">
                                                <div className="text-xs text-muted-foreground">Measurement {idx + 1} - {m.medium === 'air-to-glass' ? 'Glass' : 'Water'}</div>
                                                <div className="text-sm font-semibold text-green-600">
                                                    {m.incidentAngle}° → {m.refractedAngle}° (bent toward normal)
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Key Observations */}
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Observations:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Bending Toward Normal:</strong> Light bends toward normal when entering denser medium</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Snell's Law:</strong> Relationship between angles follows n₁sin(θ₁) = n₂sin(θ₂)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Refractive Index:</strong> Higher n means greater bending</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Speed Change:</strong> Light slows down in denser media</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Real-World Applications */}
                                <div className="border-2 border-blue-200 dark:border-blue-800 p-6 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-4">Real-World Applications:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• <strong>Eyeglasses:</strong> Lenses use refraction to correct vision</li>
                                        <li>• <strong>Cameras:</strong> Multiple lenses refract light to form sharp images</li>
                                        <li>• <strong>Fiber Optics:</strong> Total internal reflection transmits data at light speed</li>
                                        <li>• <strong>Prisms:</strong> Separate white light into rainbow colors</li>
                                        <li>• <strong>Diamonds:</strong> High refractive index creates brilliant sparkle</li>
                                        <li>• <strong>Mirages:</strong> Atmospheric refraction creates optical illusions</li>
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
                                <CardDescription>Test your understanding of refraction</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. When light enters a denser medium, it:</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'bends', label: 'Bends toward the normal', isCorrect: true },
                                            { value: 'away', label: 'Bends away from the normal' },
                                            { value: 'straight', label: 'Continues straight without bending' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer1(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer1 === option.value && !quizSubmitted && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                                                    quizAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer1 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer1 === option.value && !quizSubmitted && "border-blue-500 bg-blue-500",
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
                                    <p className="font-medium">2. In refraction, light bends:</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'towards', label: 'Toward the normal when entering a denser medium', isCorrect: true },
                                            { value: 'same', label: 'The same amount regardless of the medium' },
                                            { value: 'away-dense', label: 'Away from the normal when entering a denser medium' }
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
                                    <p className="font-medium">3. Which law describes the relationship between incident and refracted angles?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'snell', label: "Snell's Law", isCorrect: true },
                                            { value: 'newton', label: "Newton's Law" },
                                            { value: 'hooke', label: "Hooke's Law" }
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
                                            "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100"
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
                                <CardDescription>You've mastered refraction!</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Light bends toward the normal when entering a denser medium</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Snell's Law: n₁sin(θ₁) = n₂sin(θ₂)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>Refractive index determines how much light bends</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span>How lenses, fiber optics, and prisms work</span>
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
