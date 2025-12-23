
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Maximize, Send } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { Slider } from '../ui/slider';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

// --- Type Definitions ---
interface Point {
  x: number;
  y: number;
}
interface Metrics {
  maxHeight: number;
  range: number;
  timeOfFlight: number;
}

// --- Physics Constants ---
const GRAVITY = 9.81; // m/s^2

// --- Component for Rendering Highlighted Text ---
const HighlightedText = ({ text, sectionId, highlightedSentenceIndex }: {
  text: string;
  sectionId: string;
  highlightedSentenceIndex: number | null;
}) => {
  const sentences = React.useMemo(() => {
    if (!text) return [];
    const matches = text.match(/[^.!?]+[.!?]+(\s|$)/g);
    return matches ? matches.filter(s => s.trim().length > 0) : [text];
  }, [text]);

  if (highlightedSentenceIndex === null || sectionId === null) {
    return <>{text}</>;
  }

  return (
    <>
      {sentences.map((sentence, index) => (
        <span
          key={index}
          className={cn(
            "transition-colors duration-200",
            index === highlightedSentenceIndex && "bg-yellow-200 dark:bg-yellow-800/50 rounded"
          )}
        >
          {sentence}
        </span>
      ))}
    </>
  );
};


export function ProjectileMotionLab() {
    const { toast } = useToast();
    const [angle, setAngle] = React.useState(45);
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [speed, setSpeed] = React.useState(25);
    const [isLaunched, setIsLaunched] = React.useState(false);
    const [path, setPath] = React.useState<Point[]>([]);
    const [metrics, setMetrics] = React.useState<Metrics | null>(null);
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);
    
    const animationFrameId = React.useRef<number>();

    const runSimulation = React.useCallback(() => {
        let startTime: number | null = null;
        let localPath: Point[] = [];
        let maxH = 0;

        const angleRad = (angle * Math.PI) / 180;
        const v0x = speed * Math.cos(angleRad);
        const v0y = speed * Math.sin(angleRad);

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const timeElapsed = (timestamp - startTime) / 1000; // in seconds

            const x = v0x * timeElapsed;
            const y = v0y * timeElapsed - 0.5 * GRAVITY * timeElapsed * timeElapsed;

            if (y > maxH) {
                maxH = y;
            }

            if (y >= 0) {
                localPath.push({ x, y });
                setPath([...localPath]);
                animationFrameId.current = requestAnimationFrame(animate);
            } else {
                // Final calculation for more accuracy
                const timeOfFlight = (2 * v0y) / GRAVITY;
                const range = v0x * timeOfFlight;
                
                // Ensure the last point is exactly on the ground
                localPath.push({ x: range, y: 0 });
                setPath([...localPath]);

                setMetrics({ maxHeight: maxH, range: range, timeOfFlight: timeOfFlight });
                setIsLaunched(false);
            }
        };

        animationFrameId.current = requestAnimationFrame(animate);
    }, [angle, speed]);

    const handleLaunch = () => {
        if (isLaunched) return;
        setPath([]);
        setMetrics(null);
        setIsLaunched(true);
    };

    React.useEffect(() => {
        if (isLaunched) {
            runSimulation();
        }
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isLaunched, runSimulation]);

    const handleReset = () => {
        setIsLaunched(false);
        setAngle(45);
        setSpeed(25);
        setPath([]);
        setMetrics(null);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setHighlightInfo(null);
        toast({ title: "Simulation Reset" });
    };
    
    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'b';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! 45° gives the maximum range (in the absence of air resistance). ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite right. Try launching at different angles to see which one travels farthest. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. The optimal angle for maximum range is 45°. 🧠");
            }
        }
    };

    const handleQuizChange = (value: string) => {
        setQuizAnswer(value);
        if (quizIsCorrect !== null || (quizAttempts > 0 && quizIsCorrect === null)) {
            if (!(quizAttempts === 1 && quizIsCorrect === null)) {
                setQuizAttempts(0);
                setQuizIsCorrect(null);
                setQuizFeedback(null);
            }
        }
    };
    
    // --- SVG Coordinate Calculations ---
    const svgWidth = 500;
    const svgHeight = 300;
    const origin = { x: 20, y: svgHeight - 20 };
    const pathData = path.map(p => `${origin.x + p.x * 4},${origin.y - p.y * 4}`).join(' ');

    const objectiveText = "To investigate how launch angle and initial speed affect the trajectory, range, and maximum height of a projectile.";
    const theoryText = "Projectile motion is the motion of an object thrown or projected into the air, subject only to the acceleration of gravity. The path it follows is called a trajectory. Key principles are: 1. The horizontal motion is constant (ignoring air resistance). 2. The vertical motion is affected by gravity (an acceleration of -9.81 m/s²). 3. The horizontal and vertical motions are independent of each other.";
    const safetyText = "This is a virtual lab with no physical risks. In a real-world scenario, always ensure a clear and safe launch area when working with projectiles. Never aim a projectile at a person or animal. Wear safety goggles.";


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Objective</CardTitle>
                        <TextToSpeech
                            textToSpeak={objectiveText}
                            onSentenceChange={(i) => setHighlightInfo({ section: 'objective', sentenceIndex: i })}
                            onStart={() => setHighlightInfo({ section: 'objective', sentenceIndex: 0 })}
                            onEnd={() => setHighlightInfo(null)}
                        />
                    </div>
                    <CardDescription>
                        <HighlightedText text={objectiveText} sectionId="objective" highlightedSentenceIndex={highlightInfo?.section === 'objective' ? highlightInfo.sentenceIndex : null} />
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader><CardTitle>Lab Information</CardTitle></CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="theory">
                            <AccordionTrigger><div className="flex items-center gap-2"><BookOpen className="h-4 w-4"/><span>Background Theory</span></div></AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
                                <div className="flex-grow"><p><HighlightedText text={theoryText} sectionId="theory" highlightedSentenceIndex={highlightInfo?.section === 'theory' ? highlightInfo.sentenceIndex : null} /></p></div>
                                 <TextToSpeech
                                    textToSpeak={theoryText}
                                    onSentenceChange={(i) => setHighlightInfo({ section: 'theory', sentenceIndex: i })}
                                    onStart={() => setHighlightInfo({ section: 'theory', sentenceIndex: 0 })}
                                    onEnd={() => setHighlightInfo(null)}
                                    className="flex-shrink-0"
                                />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="safety">
                            <AccordionTrigger><div className="flex items-center gap-2"><Shield className="h-4 w-4"/><span>Safety Precautions</span></div></AccordionTrigger>
                             <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
                                <div className="flex-grow"><p><HighlightedText text={safetyText} sectionId="safety" highlightedSentenceIndex={highlightInfo?.section === 'safety' ? highlightInfo.sentenceIndex : null} /></p></div>
                                 <TextToSpeech
                                    textToSpeak={safetyText}
                                    onSentenceChange={(i) => setHighlightInfo({ section: 'safety', sentenceIndex: i })}
                                    onStart={() => setHighlightInfo({ section: 'safety', sentenceIndex: 0 })}
                                    onEnd={() => setHighlightInfo(null)}
                                    className="flex-shrink-0"
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Projectile Motion Simulator</CardTitle>
                    <CardDescription>Adjust the settings and launch the projectile.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Controls */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="angle-slider">Launch Angle: {angle}°</Label>
                            <Slider id="angle-slider" min={0} max={90} step={1} value={[angle]} onValueChange={(v) => setAngle(v[0])} disabled={isLaunched} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="speed-slider">Initial Speed: {speed} m/s</Label>
                            <Slider id="speed-slider" min={5} max={50} step={1} value={[speed]} onValueChange={(v) => setSpeed(v[0])} disabled={isLaunched} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button onClick={handleLaunch} disabled={isLaunched}><Send className="mr-2 h-4 w-4" />Launch</Button>
                            <Button variant="outline" onClick={handleReset}>Reset</Button>
                        </div>
                    </div>
                    {/* Visual Area */}
                    <div className="md:col-span-2 relative w-full h-80 bg-muted/30 dark:bg-muted/50 rounded-lg p-2 border">
                        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
                            {/* Grid Lines */}
                             <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                            <line x1={origin.x} y1="0" x2={origin.x} y2={origin.y} stroke="hsl(var(--foreground))" strokeWidth="1" />
                            <line x1={origin.x} y1={origin.y} x2={svgWidth} y2={origin.y} stroke="hsl(var(--foreground))" strokeWidth="1" />

                            {/* Launcher */}
                             <g transform={`translate(${origin.x}, ${origin.y}) rotate(${-angle})`}>
                                <rect x="0" y="-5" width="30" height="10" rx="3" fill="hsl(var(--primary-foreground))" />
                                <circle cx="0" cy="0" r="10" fill="hsl(var(--primary-foreground))" />
                             </g>
                             
                            {/* Projectile Path */}
                            <polyline points={pathData} fill="none" stroke="hsl(var(--accent))" strokeWidth="2" />

                             {/* Metrics Display */}
                            {metrics && (
                                <g className="text-xs fill-foreground pointer-events-none">
                                    {/* Max Height Line & Text */}
                                    <line 
                                        x1={origin.x + ((speed * Math.cos(angle * Math.PI / 180)) * (metrics.timeOfFlight / 2)) * 4} 
                                        y1={origin.y} 
                                        x2={origin.x + ((speed * Math.cos(angle * Math.PI / 180)) * (metrics.timeOfFlight / 2)) * 4} 
                                        y2={origin.y - metrics.maxHeight * 4}
                                        stroke="hsl(var(--destructive))" strokeDasharray="2 2" strokeWidth="1"
                                    />
                                    <circle cx={origin.x + ((speed * Math.cos(angle * Math.PI / 180)) * (metrics.timeOfFlight / 2)) * 4} cy={origin.y - metrics.maxHeight * 4} r="3" fill="hsl(var(--destructive))" />
                                    <text x={origin.x + ((speed * Math.cos(angle * Math.PI / 180)) * (metrics.timeOfFlight / 2)) * 4 + 5} y={origin.y - metrics.maxHeight * 4 + 4}>Max H: {metrics.maxHeight.toFixed(1)}m</text>
                                    
                                    {/* Range Line & Text */}
                                    <circle cx={origin.x + metrics.range * 4} cy={origin.y} r="3" fill="hsl(var(--destructive))" />
                                    <text x={origin.x + metrics.range * 4} y={origin.y - 10} textAnchor="end">Range: {metrics.range.toFixed(1)}m</text>
                                </g>
                            )}
                        </svg>
                    </div>
                </CardContent>
                {metrics && (
                     <CardFooter className="flex flex-wrap justify-around text-sm font-medium text-muted-foreground gap-x-6 gap-y-2 pt-4 border-t">
                         <p>Max Height: <span className="font-bold text-accent">{metrics.maxHeight.toFixed(2)} m</span></p>
                         <p>Range: <span className="font-bold text-accent">{metrics.range.toFixed(2)} m</span></p>
                         <p>Time of Flight: <span className="font-bold text-accent">{metrics.timeOfFlight.toFixed(2)} s</span></p>
                     </CardFooter>
                )}
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Post-Lab Quiz</CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="mb-2 font-medium">At which angle does a projectile travel the farthest (achieve maximum range)?</p>
                     <RadioGroup value={quizAnswer} onValueChange={(v) => {setQuizAnswer(v); if(quizIsCorrect !== null) { setQuizIsCorrect(null); setQuizAttempts(0); setQuizFeedback(null); }}}>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="q-a"/><Label htmlFor="q-a">30°</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="b" id="q-b"/><Label htmlFor="q-b">45°</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="c" id="q-c"/><Label htmlFor="q-c">60°</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="d" id="q-d"/><Label htmlFor="q-d">90°</Label></div>
                    </RadioGroup>
                    {quizFeedback && <p className={cn("mt-2 text-sm", quizIsCorrect ? 'text-green-600' : 'text-red-600')}>{quizFeedback}</p>}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleQuizSubmit} size="sm" disabled={!quizAnswer || quizIsCorrect !== null}>Check Answer</Button>
                </CardFooter>
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
