'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Trophy, Award, GripVertical, Sparkles, Target, Rocket, TrendingUp, Clock } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { Slider } from '../ui/slider';

type Step = 'intro' | 'setup' | 'experiment' | 'results' | 'quiz' | 'complete';

interface ProjectileData {
    angle: number;
    velocity: number;
    maxHeight: number;
    range: number;
    timeOfFlight: number;
    trajectory: { x: number; y: number }[];
}

const GRAVITY = 9.81; // m/s²
const SCALE = 4; // pixels per meter (increased for better visibility)
const CANVAS_HEIGHT = 384; // Height of the visualization canvas
const GROUND_LEVEL = 64; // Ground height from bottom

export function ProjectileMotionLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    
    // Experiment state
    const [angle, setAngle] = React.useState(45);
    const [velocity, setVelocity] = React.useState(20);
    const [launches, setLaunches] = React.useState<ProjectileData[]>([]);
    const [isLaunching, setIsLaunching] = React.useState(false);
    const [currentTrajectory, setCurrentTrajectory] = React.useState<{ x: number; y: number }[]>([]);
    const [animationProgress, setAnimationProgress] = React.useState(0);
    
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
    const labId = 'projectile-motion';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to Projectile Motion Lab! We'll launch projectiles at different angles and velocities to discover the laws of motion. Let's explore parabolic trajectories!");
        }
    }, [currentStep]);

    const calculateTrajectory = (angle: number, velocity: number): ProjectileData => {
        const angleRad = (angle * Math.PI) / 180;
        const vx = velocity * Math.cos(angleRad);
        const vy = velocity * Math.sin(angleRad);
        
        // Calculate physics values
        const timeOfFlight = (2 * vy) / GRAVITY;
        const maxHeight = (vy * vy) / (2 * GRAVITY);
        const range = vx * timeOfFlight;
        
        // Generate trajectory points
        const trajectory: { x: number; y: number }[] = [];
        const steps = 50;
        for (let i = 0; i <= steps; i++) {
            const t = (timeOfFlight * i) / steps;
            const x = vx * t;
            const y = vy * t - 0.5 * GRAVITY * t * t;
            if (y >= 0) {
                trajectory.push({ x, y });
            }
        }
        
        return {
            angle,
            velocity,
            maxHeight,
            range,
            timeOfFlight,
            trajectory
        };
    };

    const handleStartExperiment = () => {
        setTeacherMessage("Great! Let's set up our projectile launcher. We can adjust the angle and initial velocity to see how they affect the motion. Science in action!");
        setCurrentStep('setup');
    };

    const handleLaunch = () => {
        if (isLaunching) return;
        
        setIsLaunching(true);
        setTeacherMessage(`Launching at ${angle}° with velocity ${velocity} m/s... Watch the parabolic path!`);
        
        const data = calculateTrajectory(angle, velocity);
        setCurrentTrajectory(data.trajectory);
        
        // Animate the projectile
        let frame = 0;
        const totalFrames = 60;
        const animate = () => {
            frame++;
            const progress = frame / totalFrames;
            setAnimationProgress(progress);
            
            if (frame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                setLaunches(prev => [...prev, data]);
                setIsLaunching(false);
                setCurrentTrajectory([]);
                setAnimationProgress(0);
                
                if (launches.length === 0) {
                    setTeacherMessage(`Perfect first launch! Max height: ${data.maxHeight.toFixed(2)}m, Range: ${data.range.toFixed(2)}m. Try a different angle or velocity to compare!`);
                } else if (launches.length === 1) {
                    setTeacherMessage(`Second launch complete! Notice how changing the angle affects the trajectory. One more launch to see patterns!`);
                } else if (launches.length === 2) {
                    setTeacherMessage(`Excellent! You've completed 3 launches. Notice: 45° gives maximum range. Click 'View Results' to analyze all data!`);
                }
                
                toast({ 
                    title: '🚀 Launch Complete!', 
                    description: `Range: ${data.range.toFixed(1)}m, Height: ${data.maxHeight.toFixed(1)}m` 
                });
            }
        };
        requestAnimationFrame(animate);
    };

    const handleTeacherComplete = () => {
        // Direct state updates - no pending transitions
    };

    const handleViewResults = () => {
        if (launches.length < 3) {
            toast({ 
                title: 'Need More Data', 
                description: `Complete ${3 - launches.length} more launch(es)`,
                variant: 'destructive' 
            });
            return;
        }
        setTeacherMessage("Excellent data collection! Let's analyze the results and discover the relationships between angle, velocity, and motion!");
        setCurrentStep('results');
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Time to test your understanding of projectile motion!");
        setCurrentStep('quiz');
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        if (quizAnswer1 === '45') correctCount++;
        if (quizAnswer2 === 'parabola') correctCount++;
        if (quizAnswer3 === 'both') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand projectile motion! +${earnedXP} XP`);
            setTeacherMessage(
                "Outstanding work! 🎯 You've mastered projectile motion! Here's what makes this important: " +
                "A 45° angle maximizes range because it balances horizontal and vertical velocity components optimally. " +
                "The parabolic trajectory occurs because horizontal velocity remains constant (no air resistance) while " +
                "vertical velocity changes due to gravity's constant downward acceleration (-9.81 m/s²). " +
                "In real-world applications, this principle helps engineers design everything from water fountains to " +
                "missile defense systems. Athletes use it in sports like basketball, football, and javelin throwing. " +
                "Remember: range = (v²sin2θ)/g, maximum height = (v²sin²θ)/(2g), and time of flight = (2vsinθ)/g. " +
                "These equations work for ANY projectile in a vacuum! Keep exploring physics - you're doing brilliantly!"
            );
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Review the trajectory patterns.`);
            setTeacherMessage(
                "Good progress! You're on the right track. Let me clarify the key concepts: " +
                "The 45° angle is special because it gives equal time for the projectile to go up and come down " +
                "while maximizing horizontal distance. Think of it like this - too steep and it goes high but not far, " +
                "too shallow and it doesn't stay airborne long enough. The parabolic (curved) path happens because " +
                "gravity constantly pulls down while horizontal motion continues unchanged. Both components (angle AND velocity) " +
                "matter because a higher velocity increases both height and range. Try the experiment again and watch " +
                "how changing each variable affects the trajectory. You're almost there!"
            );
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: projectiles follow parabolic paths due to gravity.`);
            setTeacherMessage(
                "Let's review the fundamentals together. Projectile motion has two independent components: " +
                "horizontal (constant velocity) and vertical (accelerated by gravity). Here's what's crucial: " +
                "1) Gravity ONLY affects vertical motion, pulling down at 9.81 m/s². " +
                "2) Horizontal velocity stays constant because there's no horizontal force (ignoring air resistance). " +
                "3) These two motions combine to create a parabola - the curved path you observed. " +
                "The 45° angle maximizes range because it balances vertical and horizontal components perfectly. " +
                "Go back to the experiment: launch at 30°, then 45°, then 60° with the same velocity. " +
                "Notice which goes farthest? That's 45°! Both angle AND initial velocity determine the outcome. " +
                "Don't worry - this is challenging! Review the theory accordion and try again. You've got this!"
            );
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setAngle(45);
        setVelocity(20);
        setLaunches([]);
        setIsLaunching(false);
        setCurrentTrajectory([]);
        setAnimationProgress(0);
        setQuizAnswer1(undefined);
        setQuizAnswer2(undefined);
        setQuizAnswer3(undefined);
        setQuizFeedback('');
        setQuizSubmitted(false);
        setShowCelebration(false);
        setTeacherMessage("Ready to explore projectile motion again!");
    };

    const getProjectilePosition = () => {
        if (!isLaunching || currentTrajectory.length === 0) return null;
        const index = Math.floor(animationProgress * (currentTrajectory.length - 1));
        return currentTrajectory[index];
    };

    const bestLaunch = launches.length > 0 
        ? launches.reduce((best, current) => current.range > best.range ? current : best)
        : null;

    return (
        <div className="relative min-h-screen pb-20">
            {/* Premium Animated Background - Purple/Pink Physics Theme */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-indigo-950/30" />
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-purple-200/40 to-pink-300/40 dark:from-purple-800/20 dark:to-pink-900/20 blur-3xl"
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
            <TeacherVoice 
                message={teacherMessage}
                onComplete={handleTeacherComplete}
                emotion={currentStep === 'complete' ? 'celebrating' : launches.length >= 3 ? 'happy' : 'explaining'}
                context={{ attempts: launches.length, correctStreak: launches.length }}
                quickActions={[
                    {
                        label: 'Reset Lab',
                        onClick: () => {
                            setCurrentStep('intro');
                            setAngle(45);
                            setVelocity(20);
                            setLaunches([]);
                            setIsLaunching(false);
                            setCurrentTrajectory([]);
                            setAnimationProgress(0);
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

            {isCompleted && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4"
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
                    <Card className="w-full max-w-md mx-4 border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/95 to-purple-50/95 dark:from-gray-900/95 dark:to-purple-950/95 backdrop-blur-sm shadow-2xl">
                        <CardHeader className="text-center">
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                                className="flex justify-center mb-4"
                            >
                                <Trophy className="h-20 w-20 text-yellow-500" />
                            </motion.div>
                            <CardTitle className="text-2xl">Congratulations!</CardTitle>
                            <CardDescription className="text-base">You've mastered projectile motion!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                                <Award className="h-8 w-8 text-purple-500" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You understand parabolic trajectories!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Rocket className="h-6 w-6 text-purple-600" />
                            Projectile Motion Lab
                        </CardTitle>
                        <CardDescription className="text-base">Explore how angle and velocity affect projectile trajectories</CardDescription>
                    </CardHeader>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
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
                                <p><strong>Projectile Motion</strong> is the motion of an object thrown into the air, subject only to gravity.</p>
                                <p className="mt-2"><strong>Key Principles:</strong></p>
                                <ul>
                                    <li><strong>Horizontal Motion:</strong> Constant velocity (no acceleration)</li>
                                    <li><strong>Vertical Motion:</strong> Accelerated by gravity (9.81 m/s²)</li>
                                    <li><strong>Trajectory:</strong> Parabolic path</li>
                                    <li><strong>Independence:</strong> Horizontal and vertical motions are independent</li>
                                    <li><strong>Maximum Range:</strong> Achieved at 45° launch angle</li>
                                    <li><strong>Symmetry:</strong> Time up equals time down</li>
                                </ul>
                                <p className="mt-2"><strong>Key Equations:</strong></p>
                                <ul>
                                    <li>Range: R = (v²sin(2θ)) / g</li>
                                    <li>Max Height: H = (v²sin²(θ)) / (2g)</li>
                                    <li>Time of Flight: T = (2v·sin(θ)) / g</li>
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
                                    <li>Always launch projectiles in a safe, open area</li>
                                    <li>Ensure no people or obstacles in the landing zone</li>
                                    <li>Use soft projectiles (foam balls, bean bags)</li>
                                    <li>Wear safety goggles when operating launchers</li>
                                    <li>Never aim projectiles at people or animals</li>
                                    <li>Secure the launcher base to prevent tipping</li>
                                    <li>Check equipment for damage before each use</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
            </motion.div>

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
                                <CardTitle className="text-xl">Welcome to Projectile Motion Lab!</CardTitle>
                                <CardDescription className="text-base">Discover the physics of objects in flight</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                    <div className="flex items-start gap-4">
                                        <Rocket className="w-16 h-16 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-purple-900 dark:text-purple-100">What You'll Learn:</h3>
                                            <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                                                <li>• How launch angle affects projectile range and height</li>
                                                <li>• Why projectiles follow parabolic paths</li>
                                                <li>• The relationship between velocity and distance</li>
                                                <li>• How gravity affects motion in the vertical direction</li>
                                                <li>• Why 45° gives the maximum range</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleStartExperiment} 
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg" 
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
                        <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Target className="h-6 w-6 text-purple-600" />
                                    Projectile Launcher Setup
                                </CardTitle>
                                <CardDescription className="text-base">Launches completed: {launches.length}/3</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Launch Angle Control */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-base font-semibold">Launch Angle: {angle}°</div>
                                        <span className="text-sm text-muted-foreground">
                                            {angle < 30 ? 'Low angle - Long flat trajectory' : 
                                             angle < 60 ? 'Medium angle - Balanced trajectory' : 
                                             'High angle - Steep high arc'}
                                        </span>
                                    </div>
                                    <Slider
                                        value={[angle]}
                                        onValueChange={(values) => setAngle(values[0])}
                                        min={15}
                                        max={75}
                                        step={5}
                                        disabled={isLaunching}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>15° (Low)</span>
                                        <span>45° (Optimal)</span>
                                        <span>75° (High)</span>
                                    </div>
                                </div>

                                {/* Launch Velocity Control */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-base font-semibold">Initial Velocity: {velocity} m/s</div>
                                        <span className="text-sm text-muted-foreground">
                                            {velocity < 15 ? 'Slow launch' : 
                                             velocity < 25 ? 'Medium speed' : 
                                             'Fast launch'}
                                        </span>
                                    </div>
                                    <Slider
                                        value={[velocity]}
                                        onValueChange={(values) => setVelocity(values[0])}
                                        min={10}
                                        max={30}
                                        step={5}
                                        disabled={isLaunching}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>10 m/s</span>
                                        <span>20 m/s</span>
                                        <span>30 m/s</span>
                                    </div>
                                </div>

                                {/* Enhanced Realistic Visual Launcher */}
                                <div className="bg-gradient-to-b from-sky-100 via-blue-50 to-green-100 dark:from-sky-950/30 dark:via-blue-950/20 dark:to-green-950/30 p-8 rounded-lg border-2 border-blue-200/50 dark:border-blue-800/50 relative overflow-hidden h-96 shadow-inner">
                                    {/* Sky with clouds */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-sky-200/50 to-blue-100/50 dark:from-sky-900/30 dark:to-blue-950/30">
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute rounded-full bg-white/30 dark:bg-white/10 blur-xl"
                                                style={{
                                                    width: `${60 + i * 20}px`,
                                                    height: `${40 + i * 15}px`,
                                                    left: `${20 + i * 30}%`,
                                                    top: `${10 + i * 15}%`,
                                                }}
                                                animate={{
                                                    x: [0, 20, 0],
                                                }}
                                                transition={{
                                                    duration: 8 + i * 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                            />
                                        ))}
                                    </div>
                                    
                                    {/* Ground with texture */}
                                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-700 via-green-600 to-green-500 dark:from-green-900 dark:via-green-800 dark:to-green-700">
                                        {/* Ground texture lines */}
                                        <div className="absolute top-0 left-0 right-0 h-px bg-green-800/30 dark:bg-green-700/30"></div>
                                        <div className="absolute top-2 left-0 right-0 h-px bg-green-800/20 dark:bg-green-700/20"></div>
                                        {/* Grass details */}
                                        {[...Array(20)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute bottom-0 w-px bg-green-800/40 dark:bg-green-700/40"
                                                style={{
                                                    left: `${i * 5}%`,
                                                    height: `${8 + Math.random() * 4}px`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                    
                                    {/* Enhanced Launcher - Cannon style */}
                                    <div className="absolute bottom-16 left-12">
                                        {/* Launcher base */}
                                        <div className="absolute -bottom-2 -left-2 w-20 h-4 bg-gray-800 dark:bg-gray-600 rounded-sm shadow-lg"></div>
                                        {/* Launcher barrel */}
                                        <motion.div
                                            style={{ rotate: -angle }}
                                            className="origin-bottom-left relative"
                                        >
                                            {/* Barrel shadow */}
                                            <div className="absolute top-1 left-1 w-20 h-4 bg-black/20 rounded-r-full blur-sm"></div>
                                            {/* Barrel */}
                                            <div className="relative w-20 h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 dark:from-gray-500 dark:via-gray-400 dark:to-gray-500 rounded-r-full shadow-lg border border-gray-800/50 dark:border-gray-300/50">
                                                {/* Barrel rings */}
                                                <div className="absolute left-4 top-0 w-1 h-full bg-gray-800/50 dark:bg-gray-300/50"></div>
                                                <div className="absolute left-12 top-0 w-1 h-full bg-gray-800/50 dark:bg-gray-300/50"></div>
                                                {/* Muzzle flash effect when launching */}
                                                {isLaunching && (
                                                    <motion.div
                                                        initial={{ opacity: 1, scale: 0.5 }}
                                                        animate={{ opacity: 0, scale: 1.5 }}
                                                        className="absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-sm"
                                                    />
                                                )}
                                            </div>
                                        </motion.div>
                                        {/* Launcher pivot/base */}
                                        <div className="absolute -bottom-1 left-0 w-8 h-8 bg-gray-700 dark:bg-gray-500 rounded-full shadow-lg border-2 border-gray-800 dark:border-gray-300"></div>
                                    </div>

                                    {/* Previous Trajectory Paths - Enhanced */}
                                    {launches.map((launch, index) => (
                                        <svg key={index} className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                                            <defs>
                                                <linearGradient id={`trail-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor={index === 0 ? '#ef4444' : index === 1 ? '#3b82f6' : '#10b981'} stopOpacity="0.8" />
                                                    <stop offset="100%" stopColor={index === 0 ? '#ef4444' : index === 1 ? '#3b82f6' : '#10b981'} stopOpacity="0.2" />
                                                </linearGradient>
                                            </defs>
                                            <path
                                                d={`M ${48} ${CANVAS_HEIGHT - GROUND_LEVEL} ${launch.trajectory.map(p => 
                                                    `L ${48 + p.x * SCALE} ${CANVAS_HEIGHT - GROUND_LEVEL - p.y * SCALE}`
                                                ).join(' ')}`}
                                                fill="none"
                                                stroke={`url(#trail-${index})`}
                                                strokeWidth="3"
                                                strokeDasharray="5 5"
                                            />
                                        </svg>
                                    ))}

                                    {/* Current Trajectory - Enhanced with trail */}
                                    {isLaunching && currentTrajectory.length > 0 && (
                                        <>
                                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                                <defs>
                                                    <linearGradient id="current-trail" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
                                                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
                                                    </linearGradient>
                                                </defs>
                                                <path
                                                    d={`M ${48} ${CANVAS_HEIGHT - GROUND_LEVEL} ${currentTrajectory.slice(0, Math.floor(animationProgress * currentTrajectory.length)).map(p => 
                                                        `L ${48 + p.x * SCALE} ${CANVAS_HEIGHT - GROUND_LEVEL - p.y * SCALE}`
                                                    ).join(' ')}`}
                                                    fill="none"
                                                    stroke="url(#current-trail)"
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            {(() => {
                                                const pos = getProjectilePosition();
                                                if (!pos) return null;
                                                
                                                const x = 48 + pos.x * SCALE;
                                                const y = CANVAS_HEIGHT - GROUND_LEVEL - pos.y * SCALE;
                                                
                                                return (
                                                    <>
                                                        {/* Projectile shadow on ground */}
                                                        {y < CANVAS_HEIGHT - GROUND_LEVEL && (
                                                            <motion.div
                                                                className="absolute w-6 h-3 bg-black/20 dark:bg-black/40 rounded-full blur-sm"
                                                                style={{
                                                                    left: x - 12,
                                                                    top: CANVAS_HEIGHT - GROUND_LEVEL - 4,
                                                                    transform: `scale(${1 - (CANVAS_HEIGHT - GROUND_LEVEL - y) / 200})`,
                                                                }}
                                                            />
                                                        )}
                                                        {/* Projectile with rotation and trail */}
                                                        <motion.div
                                                            className="absolute"
                                                            style={{
                                                                left: x - 10,
                                                                top: y - 10,
                                                            }}
                                                            animate={{
                                                                rotate: [0, 360],
                                                            }}
                                                            transition={{
                                                                duration: 0.5,
                                                                repeat: Infinity,
                                                                ease: "linear",
                                                            }}
                                                        >
                                                            {/* Projectile body - 3D sphere */}
                                                            <div className="relative w-5 h-5">
                                                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-full shadow-lg border border-purple-700/50"></div>
                                                                <div className="absolute inset-0.5 bg-gradient-to-tr from-white/30 to-transparent rounded-full"></div>
                                                                {/* Highlight */}
                                                                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                                                            </div>
                                                        </motion.div>
                                                        {/* Motion blur trail */}
                                                        <motion.div
                                                            className="absolute w-3 h-3 bg-purple-400/50 rounded-full blur-sm"
                                                            style={{
                                                                left: x - 6,
                                                                top: y - 6,
                                                            }}
                                                            animate={{
                                                                scale: [1, 0.5, 0],
                                                                opacity: [0.5, 0.2, 0],
                                                            }}
                                                            transition={{
                                                                duration: 0.2,
                                                                repeat: Infinity,
                                                            }}
                                                        />
                                                    </>
                                                );
                                            })()}
                                        </>
                                    )}
                                    
                                    {/* Impact effect when projectile hits ground */}
                                    {!isLaunching && launches.length > 0 && (
                                        launches.map((launch, index) => {
                                            const impactX = 48 + launch.range * SCALE;
                                            const impactY = CANVAS_HEIGHT - GROUND_LEVEL;
                                            return (
                                                <motion.div
                                                    key={`impact-${index}`}
                                                    className="absolute w-8 h-8 rounded-full"
                                                    style={{
                                                        left: impactX - 16,
                                                        top: impactY - 16,
                                                    }}
                                                    initial={{ scale: 0, opacity: 0.8 }}
                                                    animate={{ scale: 1.5, opacity: 0 }}
                                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                                >
                                                    <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-md"></div>
                                                    <div className="absolute inset-2 bg-orange-500/20 rounded-full blur-sm"></div>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Launch Button */}
                                <Button 
                                    onClick={handleLaunch} 
                                    disabled={isLaunching}
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg disabled:opacity-50"
                                    size="lg"
                                >
                                    <Rocket className="h-5 w-5 mr-2" />
                                    {isLaunching ? 'Launching...' : 'Launch Projectile'}
                                </Button>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleViewResults} 
                                    disabled={launches.length < 3}
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    size="lg"
                                >
                                    View Results ({launches.length}/3 launches)
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
                        <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <TrendingUp className="h-6 w-6 text-purple-600" />
                                    Launch Results & Analysis
                                </CardTitle>
                                <CardDescription className="text-base">Compare your launches</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Results Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-2">Launch</th>
                                                <th className="text-left p-2">Angle</th>
                                                <th className="text-left p-2">Velocity</th>
                                                <th className="text-left p-2">Range</th>
                                                <th className="text-left p-2">Max Height</th>
                                                <th className="text-left p-2">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {launches.map((launch, index) => (
                                                <tr key={index} className="border-b">
                                                    <td className="p-2 font-semibold">#{index + 1}</td>
                                                    <td className="p-2">{launch.angle}°</td>
                                                    <td className="p-2">{launch.velocity} m/s</td>
                                                    <td className="p-2 font-semibold text-green-600">{launch.range.toFixed(2)} m</td>
                                                    <td className="p-2">{launch.maxHeight.toFixed(2)} m</td>
                                                    <td className="p-2">{launch.timeOfFlight.toFixed(2)} s</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Best Launch */}
                                {bestLaunch && (
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
                                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                            <Trophy className="h-5 w-5 text-yellow-500" />
                                            Best Launch (Maximum Range)
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <div className="text-xs text-muted-foreground">Angle</div>
                                                <div className="text-lg font-bold text-green-600">{bestLaunch.angle}°</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">Velocity</div>
                                                <div className="text-lg font-bold text-green-600">{bestLaunch.velocity} m/s</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">Range</div>
                                                <div className="text-lg font-bold text-green-600">{bestLaunch.range.toFixed(2)} m</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">Height</div>
                                                <div className="text-lg font-bold text-green-600">{bestLaunch.maxHeight.toFixed(2)} m</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Key Observations */}
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Observations:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>45° Launch Angle:</strong> Gives maximum range for a given velocity</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Higher Velocity:</strong> Increases both range and maximum height</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Parabolic Path:</strong> All projectiles follow curved trajectories due to gravity</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Complementary Angles:</strong> 30° and 60° give the same range</span>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleViewQuiz} 
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg" 
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
                        <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-xl">Knowledge Check</CardTitle>
                                <CardDescription className="text-base">Test your understanding of projectile motion</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. At what angle does a projectile achieve maximum range?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: '45', label: '45 degrees', isCorrect: true },
                                            { value: '30', label: '30 degrees' },
                                            { value: '60', label: '60 degrees' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer1(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer1 === option.value && !quizSubmitted && "border-purple-500 bg-purple-50 dark:bg-purple-950/20",
                                                    quizAnswer1 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer1 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer1 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer1 === option.value && !quizSubmitted && "border-purple-500 bg-purple-500",
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
                                    <p className="font-medium">2. What shape is the path of a projectile?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'parabola', label: 'Parabola (curved arc)', isCorrect: true },
                                            { value: 'straight', label: 'Straight line' },
                                            { value: 'circle', label: 'Circle' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer2(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer2 === option.value && !quizSubmitted && "border-purple-500 bg-purple-50 dark:bg-purple-950/20",
                                                    quizAnswer2 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer2 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer2 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer2 === option.value && !quizSubmitted && "border-purple-500 bg-purple-500",
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
                                    <p className="font-medium">3. What affects the range of a projectile?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'both', label: 'Both angle and velocity', isCorrect: true },
                                            { value: 'angle', label: 'Only angle' },
                                            { value: 'velocity', label: 'Only velocity' }
                                        ].map((option) => (
                                            <motion.div
                                                key={option.value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => !quizSubmitted && setQuizAnswer3(option.value)}
                                                className={cn(
                                                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                                                    quizAnswer3 === option.value && !quizSubmitted && "border-purple-500 bg-purple-50 dark:bg-purple-950/20",
                                                    quizAnswer3 === option.value && quizSubmitted && option.isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                                                    quizAnswer3 === option.value && quizSubmitted && !option.isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20",
                                                    quizAnswer3 !== option.value && "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                        quizAnswer3 === option.value && !quizSubmitted && "border-purple-500 bg-purple-500",
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
                                            quizFeedback.includes('Good') ? "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100" :
                                            "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100"
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
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg disabled:opacity-50"
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
                                        className="border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20"
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
                        <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
                            <CardHeader className="text-center">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 0.5 }}
                                    className="flex justify-center mb-4"
                                >
                                    <Trophy className="h-20 w-20 text-yellow-500" />
                                </motion.div>
                                <CardTitle className="text-2xl">Lab Complete! 🎉</CardTitle>
                                <CardDescription className="text-base">You've mastered projectile motion!</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {xpEarned > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-600 dark:to-pink-600 p-6 rounded-lg text-center"
                                    >
                                        <div className="flex items-center justify-center gap-3 text-3xl font-bold text-white">
                                            <Award className="h-8 w-8" />
                                            +{xpEarned} XP Earned!
                                        </div>
                                    </motion.div>
                                )}
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>45° launch angle gives maximum range</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>Projectiles follow parabolic paths due to gravity</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>Both angle and velocity affect range and height</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>Horizontal and vertical motions are independent</span>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleRestart} 
                                    variant="outline" 
                                    className="w-full border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20" 
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
