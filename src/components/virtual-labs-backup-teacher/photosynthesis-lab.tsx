
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, Lightbulb, Sun, Sprout, BookOpen, Shield } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TeacherVoice } from './TeacherVoice';

// Simple SVG for an aquatic plant
const AquaticPlantIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M50 95V70" stroke="#34D399" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 75C50 75 65 65 65 55C65 45 50 35 50 35" stroke="#34D399" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 75C50 75 35 65 35 55C35 45 50 35 50 35" stroke="#34D399" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 60C50 60 70 50 70 40C70 30 50 20 50 20" stroke="#34D399" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 60C50 60 30 50 30 40C30 30 50 20 50 20" stroke="#34D399" strokeWidth="4" strokeLinecap="round"/>
    </svg>
);

// Bubble component for animation
const Bubble = ({ delay }: { delay: number }) => (
    <div
        className="absolute bottom-10 w-2 h-2 bg-blue-300/70 rounded-full animate-bubble"
        style={{
            left: `${40 + Math.random() * 20}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${2 + Math.random() * 2}s`
        }}
    />
);

export function PhotosynthesisLab() {
    const { toast } = useToast();
    const [lightIntensity, setLightIntensity] = React.useState<'off' | 'low' | 'medium' | 'high'>('off');
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [isRunning, setIsRunning] = React.useState(false);

    // Quiz State
    const [quiz1Answer, setQuiz1Answer] = React.useState<string | undefined>();
    const [quiz1Feedback, setQuiz1Feedback] = React.useState<string | null>(null);
    const [quiz1Attempts, setQuiz1Attempts] = React.useState(0);
    const [quiz1IsCorrect, setQuiz1IsCorrect] = React.useState<boolean | null>(null);

    const [quiz2Answer, setQuiz2Answer] = React.useState<string | undefined>();
    const [quiz2Feedback, setQuiz2Feedback] = React.useState<string | null>(null);
    const [quiz2Attempts, setQuiz2Attempts] = React.useState(0);
    const [quiz2IsCorrect, setQuiz2IsCorrect] = React.useState<boolean | null>(null);

    const resetQuiz = () => {
        setQuiz1Answer(undefined);
        setQuiz1Feedback(null);
        setQuiz1Attempts(0);
        setQuiz1IsCorrect(null);
        setQuiz2Answer(undefined);
        setQuiz2Feedback(null);
        setQuiz2Attempts(0);
        setQuiz2IsCorrect(null);
    };

    const handleStart = () => {
        if (lightIntensity === 'off') {
            toast({ title: 'No Light Source', description: 'Please select a light intensity to start the experiment.', variant: 'destructive' });
            return;
        }
        setIsRunning(true);
        toast({ title: 'Experiment Started', description: `Light set to ${lightIntensity} intensity.` });
    };

    const handleReset = () => {
        setIsRunning(false);
        setLightIntensity('off');
        resetQuiz();
        toast({ title: 'Lab Reset', description: 'Ready for a new experiment.' });
    };

    const handleQuiz1Submit = () => {
        if (quiz1IsCorrect !== null) return;
        const isCorrect = quiz1Answer === 'oxygen';
        const newAttempts = quiz1Attempts + 1;
        setQuiz1Attempts(newAttempts);
        if (isCorrect) {
            setQuiz1IsCorrect(true);
            setQuiz1Feedback("Correct! Oxygen is the gas produced. ✅");
        } else {
            if (newAttempts === 1) {
                setQuiz1Feedback("Not quite. Think about the gas we breathe out from plants. Try again! 🔄");
            } else {
                setQuiz1IsCorrect(false);
                setQuiz1Feedback("Incorrect. Oxygen is the gas produced. 🧠");
            }
        }
    };
    
    const handleQuiz2Submit = () => {
        if (quiz2IsCorrect !== null) return;
        const isCorrect = quiz2Answer === 'light';
        const newAttempts = quiz2Attempts + 1;
        setQuiz2Attempts(newAttempts);
        if (isCorrect) {
            setQuiz2IsCorrect(true);
            setQuiz2Feedback("Correct! Light, CO₂, and temperature are key factors. ✅");
        } else {
            if (newAttempts === 1) {
                setQuiz2Feedback("Think about what a plant needs to 'cook' its food. Try again! 🔄");
            } else {
                setQuiz2IsCorrect(false);
                setQuiz2Feedback("Incorrect. Light is a primary factor affecting the rate. 🧠");
            }
        }
    };

    const numBubbles = { off: 0, low: 2, medium: 5, high: 10 }[lightIntensity];

    return (
        <div className="space-y-6">
            <style jsx global>{`
                @keyframes bubble {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(-150px); opacity: 0; }
                }
                .animate-bubble {
                    animation: bubble linear infinite;
                }
            `}</style>
            <Card>
                <CardHeader>
                    <CardTitle>Objective</CardTitle>
                    <CardDescription>To demonstrate how light intensity affects the rate of oxygen production during photosynthesis in an aquatic plant.</CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Lab Information</CardTitle>
                <CardDescription>Background theory and safety tips for this experiment.</CardDescription>
                </CardHeader>
                <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>Background Theory</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                        <p><strong>Photosynthesis</strong> is the process plants use to convert light energy into chemical energy (food). The word equation is: Carbon Dioxide + Water → (in the presence of light & chlorophyll) → Glucose + Oxygen.</p>
                        <p className="mt-2">The rate of photosynthesis can be measured by the amount of oxygen produced. Factors like light intensity, carbon dioxide concentration, and temperature can affect this rate. In this lab, we control light intensity to see its effect.</p>
                    </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>Safety Precautions</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>While this is a simulation, always approach science with a safety-first mindset.</li>
                          <li>In a real lab, be careful when using electrical light sources near water.</li>
                          <li>Handle glassware like beakers with care to prevent breakage.</li>
                          <li>Aquatic plants like Hydrilla should be handled gently.</li>
                        </ul>
                    </AccordionContent>
                    </AccordionItem>
                </Accordion>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Experiment Setup</CardTitle>
                    <CardDescription>Adjust the light intensity and observe the rate of oxygen bubbles produced by the Hydrilla plant.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Light Intensity</Label>
                        <RadioGroup value={lightIntensity} onValueChange={(v) => { setLightIntensity(v as any); setIsRunning(false); }} className="flex gap-4 mt-2">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="off" id="off"/><Label htmlFor="off">Off</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="low" id="low"/><Label htmlFor="low">Low</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="medium" id="medium"/><Label htmlFor="medium">Medium</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="high" id="high"/><Label htmlFor="high">High</Label></div>
                        </RadioGroup>
                    </div>

                    <div className="relative w-full max-w-md mx-auto h-64 border bg-blue-100/30 dark:bg-blue-900/40 rounded-lg p-2 flex items-center justify-center overflow-hidden">
                        {/* Light Source */}
                        <Lightbulb className={cn(
                            "absolute top-4 h-12 w-12 text-gray-400 transition-all duration-500",
                            lightIntensity !== 'off' && "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,1)]",
                            lightIntensity === 'low' && "opacity-60",
                            lightIntensity === 'medium' && "opacity-80",
                            lightIntensity === 'high' && "opacity-100",
                        )} />

                        {/* Beaker and Plant */}
                        <div className="absolute bottom-4 h-40 w-32 border-x-2 border-b-2 border-gray-300 rounded-b-lg flex items-end justify-center">
                            <AquaticPlantIcon className="w-20 h-20 text-green-600 mb-1" />
                        </div>
                        
                        {/* Bubbles */}
                        {isRunning && Array.from({ length: numBubbles }).map((_, i) => (
                            <Bubble key={i} delay={i * (1 / numBubbles)} />
                        ))}
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                        {isRunning ? `Observing bubble rate at ${lightIntensity} intensity...` : 'Press "Start Experiment" to begin.'}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button onClick={handleStart} disabled={lightIntensity === 'off' || isRunning}>Start Experiment</Button>
                    <Button variant="outline" onClick={handleReset}>Reset</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Post-Lab Quiz</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <p className="mb-2 font-medium">1. What is the gas produced in the bubbles?</p>
                        <RadioGroup value={quiz1Answer} onValueChange={(v) => setQuiz1Answer(v)} disabled={quiz1IsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="co2" id="q1-co2"/><Label htmlFor="q1-co2">Carbon Dioxide</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="oxygen" id="q1-oxygen"/><Label htmlFor="q1-oxygen">Oxygen</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="nitrogen" id="q1-nitrogen"/><Label htmlFor="q1-nitrogen">Nitrogen</Label></div>
                        </RadioGroup>
                        {quiz1Feedback && <p className={cn("mt-2 text-sm flex items-center gap-2", quiz1IsCorrect ? 'text-green-600' : 'text-red-600')}>{quiz1IsCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {quiz1Feedback}</p>}
                        <Button onClick={handleQuiz1Submit} size="sm" variant="outline" className="mt-2" disabled={!quiz1Answer || quiz1IsCorrect !== null}>Check Q1</Button>
                    </div>
                     <div>
                        <p className="mb-2 font-medium">2. What factor were we changing in this experiment to affect the rate of photosynthesis?</p>
                        <RadioGroup value={quiz2Answer} onValueChange={(v) => setQuiz2Answer(v)} disabled={quiz2IsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="temp" id="q2-temp"/><Label htmlFor="q2-temp">Temperature</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="water" id="q2-water"/><Label htmlFor="q2-water">Water</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="light" id="q2-light"/><Label htmlFor="q2-light">Light Intensity</Label></div>
                        </RadioGroup>
                        {quiz2Feedback && <p className={cn("mt-2 text-sm flex items-center gap-2", quiz2IsCorrect ? 'text-green-600' : 'text-red-600')}>{quiz2IsCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {quiz2Feedback}</p>}
                         <Button onClick={handleQuiz2Submit} size="sm" variant="outline" className="mt-2" disabled={!quiz2Answer || quiz2IsCorrect !== null}>Check Q2</Button>
                    </div>
                </CardContent>
            </Card>

        {/* Enhanced Teacher Voice with Phase 2 Features */}
        <TeacherVoice 
          message={teacherMessage}
          autoPlay={true}
          theme="science"
          teacherName="Dr. Lab Instructor"
          emotion="explaining"
          quickActions={[
            {
              label: 'Reset Experiment',
              onClick: () => {
                // Add reset logic here
                setTeacherMessage('Experiment reset! Ready to start fresh.');
              }
            }
          ]}
        />

        </div>
    );
}
