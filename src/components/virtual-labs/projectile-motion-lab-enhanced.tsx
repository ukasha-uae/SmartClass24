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
const SCALE = 3; // pixels per meter

export function ProjectileMotionLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
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
        setPendingTransition(() => () => {
            setCurrentStep('setup');
        });
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
        if (pendingTransition) {
            const transition = pendingTransition;
            setPendingTransition(null);
            transition();
        }
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
        setPendingTransition(() => () => {
            setCurrentStep('results');
        });
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Time to test your understanding of projectile motion!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
        });
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
        setPendingTransition(null);
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
        <div className="space-y-6 pb-20">
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
                            <CardDescription>You've mastered projectile motion!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-purple-600">
                                <Award className="h-8 w-8" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You understand parabolic trajectories!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-purple-600" />
                        Projectile Motion Lab
                    </CardTitle>
                    <CardDescription>Explore how angle and velocity affect projectile trajectories</CardDescription>
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
                                <CardTitle>Welcome to Projectile Motion Lab!</CardTitle>
                                <CardDescription>Discover the physics of objects in flight</CardDescription>
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
                        <Card className="border-2 border-purple-200 dark:border-purple-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-purple-600" />
                                    Projectile Launcher Setup
                                </CardTitle>
                                <CardDescription>Launches completed: {launches.length}/3</CardDescription>
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

                                {/* Visual Launcher */}
                                <div className="bg-gradient-to-b from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 p-8 rounded-lg border-2 border-blue-200 dark:border-blue-800 relative overflow-hidden h-64">
                                    {/* Ground */}
                                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-green-600 dark:bg-green-800"></div>
                                    
                                    {/* Launcher */}
                                    <div className="absolute bottom-8 left-12">
                                        <motion.div
                                            style={{ rotate: -angle }}
                                            className="origin-bottom-left"
                                        >
                                            <div className="w-16 h-3 bg-gray-700 dark:bg-gray-300 rounded-r-full"></div>
                                        </motion.div>
                                        <div className="w-6 h-6 bg-gray-600 dark:bg-gray-400 rounded-full -mt-1"></div>
                                    </div>

                                    {/* Trajectory Path */}
                                    {launches.map((launch, index) => (
                                        <svg key={index} className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                                            <path
                                                d={`M ${48} ${256 - 32} ${launch.trajectory.map(p => 
                                                    `L ${48 + p.x * SCALE} ${256 - 32 - p.y * SCALE}`
                                                ).join(' ')}`}
                                                fill="none"
                                                stroke={index === 0 ? '#ef4444' : index === 1 ? '#3b82f6' : '#10b981'}
                                                strokeWidth="2"
                                                strokeDasharray="4 4"
                                            />
                                        </svg>
                                    ))}

                                    {/* Current Trajectory */}
                                    {isLaunching && currentTrajectory.length > 0 && (
                                        <>
                                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                                <path
                                                    d={`M ${48} ${256 - 32} ${currentTrajectory.slice(0, Math.floor(animationProgress * currentTrajectory.length)).map(p => 
                                                        `L ${48 + p.x * SCALE} ${256 - 32 - p.y * SCALE}`
                                                    ).join(' ')}`}
                                                    fill="none"
                                                    stroke="#8b5cf6"
                                                    strokeWidth="3"
                                                />
                                            </svg>
                                            {(() => {
                                                const pos = getProjectilePosition();
                                                return pos ? (
                                                    <motion.div
                                                        className="absolute w-4 h-4 bg-purple-600 rounded-full shadow-lg"
                                                        style={{
                                                            left: 48 + pos.x * SCALE - 8,
                                                            top: 256 - 32 - pos.y * SCALE - 8
                                                        }}
                                                    />
                                                ) : null;
                                            })()}
                                        </>
                                    )}
                                </div>

                                {/* Launch Button */}
                                <Button 
                                    onClick={handleLaunch} 
                                    disabled={isLaunching}
                                    className="w-full"
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
                                    variant="outline"
                                    className="w-full"
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
                        <Card className="border-2 border-purple-200 dark:border-purple-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-purple-600" />
                                    Launch Results & Analysis
                                </CardTitle>
                                <CardDescription>Compare your launches</CardDescription>
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
                                <CardDescription>Test your understanding of projectile motion</CardDescription>
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
                                <CardDescription>You've mastered projectile motion!</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
