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
        setCurrentStep('setup');
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
        // Direct state updates - no pending transitions
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
        setCurrentStep('results');
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Time to test your understanding of refraction!");
        setCurrentStep('quiz');
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
            setTeacherMessage(
                "Exceptional! 💎 You've mastered Snell's Law and refraction! Here's the profound insight you've grasped: " +
                "Light bends when entering a different medium because it changes speed! In denser materials (glass, water), " +
                "light slows down and bends TOWARD the normal line. In less dense materials (air), it speeds up and bends " +
                "AWAY from the normal. Snell's Law (n₁sinθ₁ = n₂sinθ₂) quantifies this precisely. The refractive index (n) " +
                "tells us how much slower light travels compared to vacuum: glass (n≈1.5) slows light to 2/3 its vacuum speed, " +
                "water (n≈1.33) to 3/4 speed. This principle enables incredible technologies: eyeglasses correct vision by " +
                "refracting light to focus properly on the retina, cameras use multiple lenses to form sharp images, " +
                "fiber optic cables use total internal reflection (extreme refraction) to transmit internet data at light speed, " +
                "and prisms split white light into rainbows because different colors refract differently (dispersion). " +
                "Even the 'bent straw' illusion in water demonstrates this! You're thinking like a true physicist!"
            );
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Review Snell's Law.`);
            setTeacherMessage(
                "Great work! You understand most of refraction. Let me clarify the remaining concepts: " +
                "Refraction means light BENDS when crossing from one material to another - it doesn't just bounce like reflection. " +
                "The key rule: entering a DENSER medium (like going from air into glass or water), light bends TOWARD the normal. " +
                "Why? Because light slows down in denser materials. Think of it like a car driving from pavement onto sand - " +
                "one wheel hits sand first and slows down, causing the car to turn. Light does the same thing! " +
                "Snell's Law (n₁sinθ₁ = n₂sinθ₂) is the mathematical formula that predicts exactly how much bending occurs. " +
                "The refractive index (n) compares light's speed in a material to its speed in vacuum: nair = 1.0, nwater = 1.33, nglass = 1.5. " +
                "Go back to your data - notice how the refracted angle is always SMALLER than the incident angle when light enters " +
                "glass or water? That's bending toward the normal! Review and try again - you're almost there!"
            );
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: light bends toward the normal when entering a denser medium.`);
            setTeacherMessage(
                "Let's start with the basics of refraction - this is fascinating stuff! " +
                "When light crosses from one material to another (air to water, air to glass), two things can happen: " +
                "1) Reflection - some light bounces back " +
                "2) Refraction - most light BENDS and continues through at a different angle. " +
                "WHY does it bend? Because light travels at different speeds in different materials! " +
                "Fast in air (300,000 km/s), slower in water (225,000 km/s), even slower in glass (200,000 km/s). " +
                "The rule: entering a denser/slower medium → bends TOWARD the normal line. Entering a less dense/faster medium → bends AWAY. " +
                "The normal is that perpendicular reference line (just like in reflection). " +
                "Real example: Put a straw in water - it looks bent! That's refraction. Your eyes see the bent light rays. " +
                "Snell's Law is the formula scientists use: n₁sinθ₁ = n₂sinθ₂. Don't worry about the math yet - just remember " +
                "the concept: light bends because it changes speed. Go back to the experiment and watch carefully - " +
                "light enters at one angle and continues at a SMALLER angle. That's the bending! Keep practicing!"
            );
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
        <div className="relative min-h-screen pb-20">
            {/* Premium Animated Background - Blue/Cyan Physics Theme */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-indigo-950/30" />
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-blue-200/40 to-cyan-300/40 dark:from-blue-800/20 dark:to-cyan-900/20 blur-3xl"
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

            <div className="relative space-y-6">
            {/* TeacherVoice stays visible - provides experiment instructions */}
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
                emotion={currentStep === 'complete' ? 'celebrating' : measurements.length >= 3 ? 'happy' : 'explaining'}
                context={{ attempts: measurements.length, correctStreak: measurements.length }}
                quickActions={[
                    {
                        label: 'Reset Lab',
                        onClick: () => {
                            setCurrentStep('intro');
                            setIncidentAngle(30);
                            setMedium('air-to-glass');
                            setMeasurements([]);
                            setShowNormal(true);
                            setShowAngles(true);
                        },
                        icon: 'refresh'
                    },
                    {
                        label: 'View Theory',
                        onClick: () => {
                            const accordion = document.querySelector('[data-state="closed"]') as HTMLElement;
                            accordion?.click();
                        },
                        icon: 'book'
                    },
                    {
                        label: 'Safety Tips',
                        onClick: () => {
                            const safetyAccordion = document.querySelectorAll('[data-state="closed"]')[1] as HTMLElement;
                            safetyAccordion?.click();
                        },
                        icon: 'shield'
                    }
                ]}
            />

            {/* Hide completion status during active experiment */}
            {currentStep === 'intro' && isCompleted && (
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
                    <Card className="w-full max-w-md mx-4 border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-gray-900/95 dark:to-blue-950/95 backdrop-blur-sm shadow-2xl">
                        <CardHeader className="text-center">
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                                className="flex justify-center mb-4"
                            >
                                <Trophy className="h-20 w-20 text-yellow-500" />
                            </motion.div>
                            <CardTitle className="text-2xl">Congratulations!</CardTitle>
                            <CardDescription className="text-base">You've mastered refraction!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                                <Award className="h-8 w-8 text-blue-500" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You understand how light bends!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Hide title card and accordion when experiment is active */}
            {currentStep === 'intro' && (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Waves className="h-6 w-6 text-blue-600" />
                                    Refraction of Light Lab
                                </CardTitle>
                                <CardDescription className="text-base">Investigate how light bends when passing through different media</CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>

                    {currentStep === 'intro' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg">Lab Information</CardTitle>
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
                        </motion.div>
                    )}
                </>
            )}

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
                                <CardTitle className="text-xl">Welcome to Refraction Lab!</CardTitle>
                                <CardDescription className="text-base">Discover how light bends through different materials</CardDescription>
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
                                <Button 
                                    onClick={handleStartExperiment} 
                                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg" 
                                    size="lg"
                                >
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
                        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Lightbulb className="h-6 w-6 text-blue-600" />
                                    Refraction Apparatus
                                </CardTitle>
                                <CardDescription className="text-base">Measurements taken: {measurements.length}/3</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Medium Selection */}
                                <div className="space-y-3">
                                    <div className="text-base font-semibold">Medium Selection:</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            variant={medium === 'air-to-glass' ? 'default' : 'outline'}
                                            onClick={() => setMedium('air-to-glass')}
                                            className={cn(
                                                "h-auto py-4",
                                                medium === 'air-to-glass' && "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                                            )}
                                        >
                                            <div className="text-center">
                                                <div className="font-semibold">Glass Block</div>
                                                <div className="text-xs opacity-70">n = 1.5</div>
                                            </div>
                                        </Button>
                                        <Button
                                            variant={medium === 'air-to-water' ? 'default' : 'outline'}
                                            onClick={() => setMedium('air-to-water')}
                                            className={cn(
                                                "h-auto py-4",
                                                medium === 'air-to-water' && "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                                            )}
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

                                {/* Enhanced Realistic Visual Ray Diagram */}
                                <div className="bg-gradient-to-b from-slate-100 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-gray-900 dark:to-slate-950 p-6 rounded-lg border-2 border-blue-200/50 dark:border-blue-800/50 shadow-inner">
                                    <svg width={width} height={height} className="w-full h-auto">
                                        {/* Background grid */}
                                        <defs>
                                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                                            </pattern>
                                            <filter id="glow">
                                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur"/>
                                                    <feMergeNode in="SourceGraphic"/>
                                                </feMerge>
                                            </filter>
                                            <filter id="rayGlow">
                                                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur"/>
                                                    <feMergeNode in="SourceGraphic"/>
                                                </feMerge>
                                            </filter>
                                        </defs>
                                        <rect width={width} height={height} fill="url(#grid)" opacity="0.3" />
                                        
                                        {/* Enhanced Air region (top) with depth */}
                                        <rect x={0} y={0} width={width} height={boundary} fill="url(#airGradient)" />
                                        <rect x={0} y={0} width={width} height={boundary} fill="url(#airShine)" opacity="0.3" />
                                        <text x={10} y={20} fill="#1e40af" fontSize="13" fontWeight="bold" stroke="white" strokeWidth="0.5">AIR (n=1.0)</text>
                                        
                                        {/* Enhanced Medium region (bottom) with realistic appearance */}
                                        <rect x={0} y={boundary} width={width} height={height - boundary} fill={medium === 'air-to-glass' ? "url(#glassGradient)" : "url(#waterGradient)"} />
                                        {/* Medium depth effect */}
                                        <rect x={0} y={boundary} width={width} height={height - boundary} fill={medium === 'air-to-glass' ? "url(#glassShine)" : "url(#waterShine)"} opacity="0.4" />
                                        {/* Medium texture */}
                                        {medium === 'air-to-water' && (
                                            <>
                                                {[...Array(15)].map((_, i) => (
                                                    <motion.circle
                                                        key={i}
                                                        cx={20 + (i % 5) * 80}
                                                        cy={boundary + 30 + Math.floor(i / 5) * 40}
                                                        r="2"
                                                        fill="rgba(255,255,255,0.2)"
                                                        animate={{
                                                            cy: [boundary + 30 + Math.floor(i / 5) * 40, boundary + 50 + Math.floor(i / 5) * 40, boundary + 30 + Math.floor(i / 5) * 40],
                                                        }}
                                                        transition={{
                                                            duration: 3 + Math.random() * 2,
                                                            repeat: Infinity,
                                                            ease: "easeInOut",
                                                            delay: i * 0.1,
                                                        }}
                                                    />
                                                ))}
                                            </>
                                        )}
                                        <text x={10} y={boundary + 25} fill="white" fontSize="13" fontWeight="bold" stroke="#1e40af" strokeWidth="0.5">
                                            {medium === 'air-to-glass' ? 'GLASS (n=1.5)' : 'WATER (n=1.33)'}
                                        </text>
                                        
                                        {/* Enhanced Boundary line with 3D effect */}
                                        <line
                                            x1={0}
                                            y1={boundary}
                                            x2={width}
                                            y2={boundary}
                                            stroke="rgba(0,0,0,0.4)"
                                            strokeWidth="4"
                                        />
                                        <line
                                            x1={0}
                                            y1={boundary}
                                            x2={width}
                                            y2={boundary}
                                            stroke="rgba(255,255,255,0.6)"
                                            strokeWidth="2"
                                        />
                                        <line
                                            x1={0}
                                            y1={boundary}
                                            x2={width}
                                            y2={boundary}
                                            stroke="rgba(0,0,0,0.2)"
                                            strokeWidth="1"
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
                                        
                                        {/* Enhanced Incident ray with glow */}
                                        <motion.line
                                            x1={incidentStart.x}
                                            y1={incidentStart.y}
                                            x2={width / 2}
                                            y2={boundary}
                                            stroke="#ff6b6b"
                                            strokeWidth="8"
                                            opacity="0.3"
                                            filter="url(#glow)"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.8 }}
                                        />
                                        <motion.line
                                            x1={incidentStart.x}
                                            y1={incidentStart.y}
                                            x2={width / 2}
                                            y2={boundary}
                                            stroke="#ef4444"
                                            strokeWidth="4"
                                            filter="url(#rayGlow)"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 0.8 }}
                                        />
                                        {/* Enhanced Light source */}
                                        <motion.g
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                        >
                                            <circle
                                                cx={incidentStart.x}
                                                cy={incidentStart.y}
                                                r="12"
                                                fill="url(#lightSourceGradient)"
                                                filter="url(#glow)"
                                            />
                                            <circle
                                                cx={incidentStart.x}
                                                cy={incidentStart.y}
                                                r="8"
                                                fill="#ff4444"
                                            />
                                            <circle
                                                cx={incidentStart.x - 2}
                                                cy={incidentStart.y - 2}
                                                r="3"
                                                fill="white"
                                                opacity="0.9"
                                            />
                                        </motion.g>
                                        
                                        {/* Enhanced Refracted ray with glow */}
                                        <motion.line
                                            x1={width / 2}
                                            y1={boundary}
                                            x2={refractedEnd.x}
                                            y2={refractedEnd.y}
                                            stroke="#60a5fa"
                                            strokeWidth="8"
                                            opacity="0.3"
                                            filter="url(#glow)"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.8, delay: 0.3 }}
                                        />
                                        <motion.line
                                            x1={width / 2}
                                            y1={boundary}
                                            x2={refractedEnd.x}
                                            y2={refractedEnd.y}
                                            stroke="#3b82f6"
                                            strokeWidth="4"
                                            filter="url(#rayGlow)"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 0.8, delay: 0.3 }}
                                        />
                                        {/* Enhanced Refracted ray arrow */}
                                        <motion.g
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 1.1 }}
                                        >
                                            <polygon
                                                points={`${refractedEnd.x},${refractedEnd.y} ${refractedEnd.x - 10},${refractedEnd.y - 12} ${refractedEnd.x + 10},${refractedEnd.y - 12}`}
                                                fill="#3b82f6"
                                                filter="url(#glow)"
                                            />
                                            <polygon
                                                points={`${refractedEnd.x},${refractedEnd.y} ${refractedEnd.x - 6},${refractedEnd.y - 8} ${refractedEnd.x + 6},${refractedEnd.y - 8}`}
                                                fill="#60a5fa"
                                            />
                                        </motion.g>
                                        
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
                                        
                                        {/* Enhanced Refraction point with pulsing glow */}
                                        <motion.circle
                                            cx={width / 2}
                                            cy={boundary}
                                            r="8"
                                            fill="yellow"
                                            filter="url(#glow)"
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [0.8, 1, 0.8],
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        />
                                        <circle cx={width / 2} cy={boundary} r="5" fill="#ffd700" />
                                        
                                        {/* Enhanced Gradient definitions */}
                                        <defs>
                                            <linearGradient id="airGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.95" />
                                                <stop offset="50%" stopColor="#BAE6FD" stopOpacity="0.9" />
                                                <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.85" />
                                            </linearGradient>
                                            <linearGradient id="airShine" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                                            </linearGradient>
                                            <linearGradient id="glassGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.7" />
                                                <stop offset="50%" stopColor="#1e40af" stopOpacity="0.8" />
                                                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.9" />
                                            </linearGradient>
                                            <linearGradient id="glassShine" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                                                <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                                                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                                            </linearGradient>
                                            <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.7" />
                                                <stop offset="50%" stopColor="#0284c7" stopOpacity="0.8" />
                                                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
                                            </linearGradient>
                                            <linearGradient id="waterShine" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                                                <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
                                                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                                            </linearGradient>
                                            <radialGradient id="lightSourceGradient">
                                                <stop offset="0%" stopColor="#ff8888" stopOpacity="1" />
                                                <stop offset="50%" stopColor="#ff4444" stopOpacity="0.8" />
                                                <stop offset="100%" stopColor="#cc0000" stopOpacity="0.4" />
                                            </radialGradient>
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
                                        className={cn(
                                            "flex-1",
                                            showNormal && "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                                        )}
                                    >
                                        {showNormal ? 'Hide' : 'Show'} Normal
                                    </Button>
                                    <Button
                                        variant={showAngles ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setShowAngles(!showAngles)}
                                        className={cn(
                                            "flex-1",
                                            showAngles && "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                                        )}
                                    >
                                        {showAngles ? 'Hide' : 'Show'} Angles
                                    </Button>
                                </div>

                                {/* Measurement Button */}
                                <Button 
                                    onClick={handleTakeMeasurement}
                                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
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
                                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <CheckCircle className="h-6 w-6 text-blue-600" />
                                    Analysis & Results
                                </CardTitle>
                                <CardDescription className="text-base">Verification of Snell's Law</CardDescription>
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
                                <Button 
                                    onClick={handleViewQuiz} 
                                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg" 
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
                        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-xl">Knowledge Check</CardTitle>
                                <CardDescription className="text-base">Test your understanding of refraction</CardDescription>
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
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg disabled:opacity-50"
                                    size="lg"
                                >
                                    Submit Answers
                                </Button>
                                {quizSubmitted && !quizFeedback.includes('all 3') && (
                                    <Button 
                                        onClick={() => {
                                            setQuizAnswer1(undefined);
                                            setQuizAnswer2(undefined);
                                            setQuizAnswer3(undefined);
                                            setQuizFeedback('');
                                            setQuizSubmitted(false);
                                        }} 
                                        variant="outline" 
                                        size="lg"
                                        className="border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20"
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
                        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader className="text-center">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 0.5 }}
                                    className="flex justify-center mb-4"
                                >
                                    <Trophy className="h-20 w-20 text-yellow-500" />
                                </motion.div>
                                <CardTitle className="text-2xl">Lab Complete! 🎉</CardTitle>
                                <CardDescription className="text-base">You've mastered refraction!</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {xpEarned > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-600 dark:to-cyan-600 p-6 rounded-lg text-center"
                                    >
                                        <div className="flex items-center justify-center gap-3 text-3xl font-bold text-white">
                                            <Award className="h-8 w-8" />
                                            +{xpEarned} XP Earned!
                                        </div>
                                    </motion.div>
                                )}
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
                                <Button 
                                    onClick={handleRestart} 
                                    variant="outline" 
                                    className="w-full border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20" 
                                    size="lg"
                                >
                                    <RefreshCw className="h-5 w-5 mr-2" />
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
