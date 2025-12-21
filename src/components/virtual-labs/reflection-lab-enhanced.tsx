'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Trophy, Award, GripVertical, Sparkles, Eye, Sun, Scan, Ruler } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { Slider } from '../ui/slider';

type Step = 'intro' | 'setup' | 'experiment' | 'results' | 'quiz' | 'complete';

interface ReflectionMeasurement {
    incidentAngle: number;
    reflectedAngle: number;
    surfaceType: 'plane' | 'curved-concave' | 'curved-convex';
}

export function ReflectionLabEnhanced() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<Step>('intro');
    const [teacherMessage, setTeacherMessage] = React.useState('');
    const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
    
    // Experiment state
    const [incidentAngle, setIncidentAngle] = React.useState(30);
    const [surfaceType, setSurfaceType] = React.useState<'plane' | 'curved-concave' | 'curved-convex'>('plane');
    const [measurements, setMeasurements] = React.useState<ReflectionMeasurement[]>([]);
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
    const labId = 'reflection';
    const isCompleted = isLabCompleted(labId);
    const completion = getLabCompletion(labId);

    // Draggable teacher
    const [teacherPosition, setTeacherPosition] = React.useState({ x: 0, y: 0 });

    React.useEffect(() => {
        if (currentStep === 'intro') {
            setTeacherMessage("Welcome to the Reflection Lab! We'll explore how light bounces off different surfaces and discover the law of reflection. Let's shine some light!");
        }
    }, [currentStep]);

    const reflectedAngle = surfaceType === 'plane' ? incidentAngle : incidentAngle; // Simplified for demo

    const handleStartExperiment = () => {
        setTeacherMessage("Perfect! Let's set up our reflection apparatus. You'll control the angle of incoming light and observe how it reflects!");
        setPendingTransition(() => () => {
            setCurrentStep('setup');
        });
    };

    const handleTakeMeasurement = () => {
        const measurement: ReflectionMeasurement = {
            incidentAngle,
            reflectedAngle,
            surfaceType
        };
        
        setMeasurements(prev => [...prev, measurement]);
        
        if (measurements.length === 0) {
            setTeacherMessage(`First measurement recorded! Incident angle: ${incidentAngle}°, Reflected angle: ${reflectedAngle}°. Notice they're equal! Try a different angle.`);
        } else if (measurements.length === 1) {
            setTeacherMessage(`Second measurement done! The pattern continues - angle in equals angle out. Take one more measurement to confirm!`);
        } else if (measurements.length === 2) {
            setTeacherMessage(`Excellent! Three measurements complete. You've verified the Law of Reflection: angle of incidence = angle of reflection. View results!`);
        }
        
        toast({ 
            title: '📐 Measurement Recorded', 
            description: `i=${incidentAngle}°, r=${reflectedAngle}°` 
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
        setTeacherMessage("Perfect data! Let's analyze your measurements and see how reflection follows a simple mathematical law!");
        setPendingTransition(() => () => {
            setCurrentStep('results');
        });
    };

    const handleViewQuiz = () => {
        setTeacherMessage("Time to test your understanding of reflection!");
        setPendingTransition(() => () => {
            setCurrentStep('quiz');
        });
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        if (quizAnswer1 === 'equal') correctCount++;
        if (quizAnswer2 === 'normal') correctCount++;
        if (quizAnswer3 === 'plane') correctCount++;

        setQuizSubmitted(true);

        if (correctCount === 3) {
            const score = 100;
            const earnedXP = markLabComplete(labId, score, 0);
            setXpEarned(earnedXP);
            setQuizFeedback(`Perfect! 🎉 You got all 3 correct! You understand reflection! +${earnedXP} XP`);
            setShowCelebration(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
                setShowCelebration(false);
                setCurrentStep('complete');
            }, 2000);
        } else if (correctCount === 2) {
            setQuizFeedback(`Good job! You got ${correctCount} out of 3 correct. Review the law of reflection.`);
        } else {
            setQuizFeedback(`You got ${correctCount} out of 3 correct. Remember: angle in = angle out, measured from the normal.`);
        }
    };

    const handleRestart = () => {
        setCurrentStep('intro');
        setIncidentAngle(30);
        setSurfaceType('plane');
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
        setTeacherMessage("Ready to explore reflection again!");
    };

    // SVG calculations for ray diagram
    const width = 400;
    const height = 300;
    const origin = { x: width / 2, y: height / 2 };
    const rayLength = 120;
    
    const incidentRad = (incidentAngle * Math.PI) / 180;
    const reflectedRad = (reflectedAngle * Math.PI) / 180;
    
    const incidentStart = {
        x: origin.x - rayLength * Math.sin(incidentRad),
        y: origin.y - rayLength * Math.cos(incidentRad)
    };
    
    const reflectedEnd = {
        x: origin.x + rayLength * Math.sin(reflectedRad),
        y: origin.y - rayLength * Math.cos(reflectedRad)
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
                <Card className="shadow-2xl border-2 border-purple-400 dark:border-purple-600 cursor-move">
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
                            <CardDescription>You've mastered the law of reflection!</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-purple-600">
                                <Award className="h-8 w-8" />
                                +{xpEarned} XP
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You understand how light reflects!
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-purple-600" />
                        Reflection of Light Lab
                    </CardTitle>
                    <CardDescription>Investigate the law of reflection using light rays and mirrors</CardDescription>
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
                                <p><strong>Reflection</strong> is the bouncing back of light when it hits a surface.</p>
                                <p className="mt-2"><strong>The Law of Reflection states:</strong></p>
                                <ul>
                                    <li>The incident ray, reflected ray, and normal all lie in the same plane</li>
                                    <li>The angle of incidence equals the angle of reflection (∠i = ∠r)</li>
                                    <li>Both angles are measured from the normal (perpendicular line to the surface)</li>
                                </ul>
                                <p className="mt-2"><strong>Key Terms:</strong></p>
                                <ul>
                                    <li><strong>Incident Ray:</strong> Light approaching the surface</li>
                                    <li><strong>Reflected Ray:</strong> Light bouncing off the surface</li>
                                    <li><strong>Normal:</strong> Imaginary line perpendicular to the surface</li>
                                    <li><strong>Angle of Incidence (i):</strong> Angle between incident ray and normal</li>
                                    <li><strong>Angle of Reflection (r):</strong> Angle between reflected ray and normal</li>
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
                                    <li>Handle mirrors carefully to avoid cuts</li>
                                    <li>Secure mirrors to prevent falling</li>
                                    <li>Clean glass surfaces carefully</li>
                                    <li>Work in a well-lit room to avoid eye strain</li>
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
                                <CardTitle>Welcome to Reflection Lab!</CardTitle>
                                <CardDescription>Discover how light bounces off surfaces</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                    <div className="flex items-start gap-4">
                                        <Sun className="w-16 h-16 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2 text-purple-900 dark:text-purple-100">What You'll Learn:</h3>
                                            <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                                                <li>• How to measure angles of incidence and reflection</li>
                                                <li>• The relationship between incoming and outgoing light rays</li>
                                                <li>• Why angle of incidence equals angle of reflection</li>
                                                <li>• The role of the normal line in reflection</li>
                                                <li>• How mirrors work using the law of reflection</li>
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
                                    <Scan className="h-5 w-5 text-purple-600" />
                                    Reflection Apparatus
                                </CardTitle>
                                <CardDescription>Measurements taken: {measurements.length}/3</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Angle Control */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-base font-semibold">Incident Angle: {incidentAngle}°</div>
                                        <div className="text-sm text-muted-foreground">
                                            Reflected Angle: {reflectedAngle}°
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
                                        <span>10° (Grazing)</span>
                                        <span>45° (Medium)</span>
                                        <span>80° (Steep)</span>
                                    </div>
                                </div>

                                {/* Visual Ray Diagram */}
                                <div className="bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/20 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                                    <svg width={width} height={height} className="w-full h-auto">
                                        {/* Mirror surface */}
                                        <line
                                            x1={0}
                                            y1={origin.y}
                                            x2={width}
                                            y2={origin.y}
                                            stroke="silver"
                                            strokeWidth="8"
                                        />
                                        <line
                                            x1={0}
                                            y1={origin.y}
                                            x2={width}
                                            y2={origin.y}
                                            stroke="url(#mirrorGradient)"
                                            strokeWidth="4"
                                        />
                                        
                                        {/* Normal line */}
                                        {showNormal && (
                                            <line
                                                x1={origin.x}
                                                y1={origin.y - 140}
                                                x2={origin.x}
                                                y2={origin.y + 20}
                                                stroke="gray"
                                                strokeWidth="2"
                                                strokeDasharray="5,5"
                                            />
                                        )}
                                        
                                        {/* Incident ray */}
                                        <motion.line
                                            x1={incidentStart.x}
                                            y1={incidentStart.y}
                                            x2={origin.x}
                                            y2={origin.y}
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
                                        
                                        {/* Reflected ray */}
                                        <motion.line
                                            x1={origin.x}
                                            y1={origin.y}
                                            x2={reflectedEnd.x}
                                            y2={reflectedEnd.y}
                                            stroke="#3b82f6"
                                            strokeWidth="3"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.5, delay: 0.5 }}
                                        />
                                        <motion.polygon
                                            points={`${reflectedEnd.x},${reflectedEnd.y} ${reflectedEnd.x - 8},${reflectedEnd.y + 10} ${reflectedEnd.x + 8},${reflectedEnd.y + 10}`}
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
                                                    d={`M ${origin.x - 30} ${origin.y - 30} A 30 30 0 0 1 ${origin.x - 30 * Math.sin(incidentRad)} ${origin.y - 30 * Math.cos(incidentRad)}`}
                                                    fill="none"
                                                    stroke="#ef4444"
                                                    strokeWidth="2"
                                                />
                                                <text
                                                    x={origin.x - 45}
                                                    y={origin.y - 35}
                                                    fill="#ef4444"
                                                    fontSize="14"
                                                    fontWeight="bold"
                                                >
                                                    i={incidentAngle}°
                                                </text>
                                                
                                                {/* Reflected angle arc */}
                                                <path
                                                    d={`M ${origin.x + 30 * Math.sin(reflectedRad)} ${origin.y - 30 * Math.cos(reflectedRad)} A 30 30 0 0 1 ${origin.x + 30} ${origin.y - 30}`}
                                                    fill="none"
                                                    stroke="#3b82f6"
                                                    strokeWidth="2"
                                                />
                                                <text
                                                    x={origin.x + 35}
                                                    y={origin.y - 35}
                                                    fill="#3b82f6"
                                                    fontSize="14"
                                                    fontWeight="bold"
                                                >
                                                    r={reflectedAngle}°
                                                </text>
                                            </>
                                        )}
                                        
                                        {/* Reflection point */}
                                        <circle cx={origin.x} cy={origin.y} r="4" fill="yellow" />
                                        
                                        {/* Gradient definition */}
                                        <defs>
                                            <linearGradient id="mirrorGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                                                <stop offset="100%" stopColor="silver" stopOpacity="0.4" />
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
                                            <span>Reflected Ray</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-0.5 bg-gray-400 border-dashed border"></div>
                                            <span>Normal</span>
                                        </div>
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
                                                    <th className="text-left p-2">Incident (i)</th>
                                                    <th className="text-left p-2">Reflected (r)</th>
                                                    <th className="text-left p-2">i = r?</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {measurements.map((m, idx) => (
                                                    <tr key={idx} className="border-b">
                                                        <td className="p-2">{idx + 1}</td>
                                                        <td className="p-2 font-semibold">{m.incidentAngle}°</td>
                                                        <td className="p-2 font-semibold">{m.reflectedAngle}°</td>
                                                        <td className="p-2">
                                                            {m.incidentAngle === m.reflectedAngle ? (
                                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                            ) : (
                                                                <XCircle className="h-4 w-4 text-red-500" />
                                                            )}
                                                        </td>
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
                        <Card className="border-2 border-purple-200 dark:border-purple-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-purple-600" />
                                    Analysis & Results
                                </CardTitle>
                                <CardDescription>Verification of the Law of Reflection</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Results Summary */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg border-2 border-green-200 dark:border-green-800">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        Law of Reflection Verified!
                                    </h3>
                                    <p className="text-sm mb-4">
                                        All {measurements.length} measurements confirm: <strong>Angle of Incidence = Angle of Reflection</strong>
                                    </p>
                                    <div className="grid grid-cols-3 gap-4">
                                        {measurements.map((m, idx) => (
                                            <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded">
                                                <div className="text-xs text-muted-foreground">Measurement {idx + 1}</div>
                                                <div className="text-lg font-bold text-green-600">
                                                    {m.incidentAngle}° = {m.reflectedAngle}°
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Key Observations */}
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                    <h3 className="font-semibold text-lg mb-4">Key Observations:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Equal Angles:</strong> In every case, angle i = angle r</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Measured from Normal:</strong> Both angles measured from the perpendicular line</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Same Plane:</strong> Incident ray, reflected ray, and normal are coplanar</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span><strong>Universal Law:</strong> Works for all smooth reflecting surfaces</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Real-World Applications */}
                                <div className="border-2 border-blue-200 dark:border-blue-800 p-6 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-4">Real-World Applications:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• <strong>Mirrors:</strong> Flat mirrors use reflection to create exact images</li>
                                        <li>• <strong>Periscopes:</strong> Use two mirrors at 45° to see over obstacles</li>
                                        <li>• <strong>Telescopes:</strong> Reflect light to magnify distant objects</li>
                                        <li>• <strong>Solar panels:</strong> Position mirrors to reflect maximum sunlight</li>
                                        <li>• <strong>Fiber optics:</strong> Use total internal reflection for communication</li>
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
                                <CardDescription>Test your understanding of reflection</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question 1 */}
                                <div className="space-y-3">
                                    <p className="font-medium">1. According to the law of reflection, the angle of incidence is:</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'equal', label: 'Equal to the angle of reflection', isCorrect: true },
                                            { value: 'greater', label: 'Greater than the angle of reflection' },
                                            { value: 'less', label: 'Less than the angle of reflection' }
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
                                    <p className="font-medium">2. Angles of incidence and reflection are measured from:</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'normal', label: 'The normal (perpendicular to surface)', isCorrect: true },
                                            { value: 'surface', label: 'The reflecting surface' },
                                            { value: 'horizontal', label: 'The horizontal' }
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
                                    <p className="font-medium">3. Which type of surface gives the clearest reflection?</p>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'plane', label: 'Smooth plane mirror', isCorrect: true },
                                            { value: 'rough', label: 'Rough surface' },
                                            { value: 'curved', label: 'Any curved surface' }
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
                                <CardDescription>You've mastered the law of reflection!</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                                    <h3 className="font-semibold text-center text-lg mb-4">What You've Learned:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>Angle of incidence always equals angle of reflection</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>Angles are measured from the normal line</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>The law works for all smooth reflecting surfaces</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span>How mirrors and optical devices use reflection</span>
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
