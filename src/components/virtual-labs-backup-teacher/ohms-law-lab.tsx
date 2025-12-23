
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Zap, Battery, AlertTriangle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { Slider } from '../ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

// --- Reusable SVG Component for Resistor ---
const ResistorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M0 10 H20 L25 5 L35 15 L45 5 L55 15 L65 5 L75 15 L80 10 H100" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// --- Component for Rendering Highlighted Text ---
const HighlightedText = ({ text, sectionId, highlightedSentenceIndex }: {
  text: string;
  sectionId: string;
  highlightedSentenceIndex: number | null;
}) => {
  const sentences = React.useMemo(() => {
    if (!text) return [];
    // A more robust regex to handle various sentence-ending punctuation and spacing.
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

export function OhmsLawLab() {
    const { toast } = useToast();
    const [voltage, setVoltage] = React.useState(6); // Volts
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [resistance, setResistance] = React.useState(5); // Ohms
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    const current = voltage / resistance;

    // Data for the graph
    const graphData = React.useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => {
            const v = i + 1;
            return {
                voltage: v,
                current: v / resistance,
            };
        });
    }, [resistance]);

    const handleReset = () => {
        setVoltage(6);
        setResistance(5);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setHighlightInfo(null);
        toast({ title: "Lab Reset" });
    };
    
    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'decreases';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! According to I = V/R, if R increases, I must decrease. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite right. Think about what resistance does to the flow of current. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. Higher resistance makes it harder for current to flow, so it decreases. 🧠");
            }
        }
    };

    const objectiveText = "To investigate the relationship between voltage (V), current (I), and resistance (R) in a simple circuit, and to verify Ohm's Law (V = IR).";
    const theoryText = "Ohm's Law is a fundamental principle in electricity. It states that the current flowing through a conductor between two points is directly proportional to the voltage across the two points, provided the physical conditions and temperature remain constant. Mathematically, it is expressed as V = IR. This means if you increase the voltage (the 'push'), the current (the 'flow') will increase. If you increase the resistance (the 'obstacle'), the current will decrease.";
    const safetyText = "This is a virtual lab. In a real-world scenario, never use high-voltage sources without proper training and supervision. Resistors can become very hot when current passes through them. Always check circuit connections before applying power.";

    return (
        <div className="space-y-6">
            <style jsx global>{`
                @keyframes flow {
                    from { offset-distance: 0%; }
                    to { offset-distance: 100%; }
                }
            `}</style>
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
                                <div className="flex-grow">
                                     <p><HighlightedText text={theoryText} sectionId="theory" highlightedSentenceIndex={highlightInfo?.section === 'theory' ? highlightInfo.sentenceIndex : null} /></p>
                                </div>
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
                                <div className="flex-grow">
                                     <p><HighlightedText text={safetyText} sectionId="safety" highlightedSentenceIndex={highlightInfo?.section === 'safety' ? highlightInfo.sentenceIndex : null} /></p>
                                </div>
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
                    <CardTitle>Ohm's Law Simulator</CardTitle>
                    <CardDescription>Adjust the sliders to observe the changes in the circuit.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* Controls */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="voltage-slider">Voltage (V): {voltage} V</Label>
                            <Slider id="voltage-slider" min={1} max={12} step={0.5} value={[voltage]} onValueChange={(v) => setVoltage(v[0])} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="resistance-slider">Resistance (R): {resistance} Ω</Label>
                            <Slider id="resistance-slider" min={1} max={10} step={0.5} value={[resistance]} onValueChange={(v) => setResistance(v[0])} />
                        </div>
                         <Card className="bg-background text-center">
                            <CardHeader className="p-2 pb-0"><CardTitle className="text-base">Ammeter Reading</CardTitle></CardHeader>
                            <CardContent className="p-4">
                                <p className="text-3xl font-bold text-accent">{current.toFixed(2)} A</p>
                                <p className="text-sm text-muted-foreground">Current (I)</p>
                            </CardContent>
                         </Card>
                    </div>

                    {/* Circuit Visual */}
                    <div className="relative w-full h-64 bg-muted/30 dark:bg-muted/50 rounded-lg p-2 border flex items-center justify-center overflow-hidden">
                        <svg width="250" height="150" viewBox="0 0 250 150">
                            <path d="M 20 40 V 110 H 230 V 40 H 20 Z" stroke="currentColor" strokeWidth="2" fill="none" className="text-muted-foreground" />
                            <g transform="translate(50, 25)">
                                <Battery className="h-10 w-10 text-primary" />
                            </g>
                             <g transform="translate(150, 15)">
                                <ResistorIcon className="w-16 h-10 text-primary" />
                            </g>
                        </svg>
                        {/* Electron Flow Animation */}
                        <div className="absolute w-[210px] h-[70px] top-[40px] left-[20px]">
                            {Array.from({ length: Math.ceil(current * 2) }).map((_, i) => (
                                <Zap key={i} className="absolute h-3 w-3 text-yellow-400 opacity-70" style={{
                                    offsetPath: `path('M 0 0 V 70 H 210 V 0 H 0 Z')`,
                                    animationName: 'flow',
                                    animationDuration: `${10 / current}s`,
                                    animationTimingFunction: 'linear',
                                    animationIterationCount: 'infinite',
                                    animationDelay: `${(i * (10 / current)) / Math.ceil(current * 2)}s`,
                                } as React.CSSProperties} />
                            ))}
                        </div>
                    </div>
                </CardContent>
                 <CardFooter className="justify-center">
                    <Button variant="outline" onClick={handleReset}>Reset Controls</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Voltage vs. Current Graph</CardTitle>
                    <CardDescription>This graph shows how current changes with voltage at a constant resistance of {resistance} Ω.</CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={graphData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="voltage" type="number" name="Voltage" unit="V" label={{ value: 'Voltage (V)', position: 'insideBottom', offset: -5 }} />
                            <YAxis type="number" name="Current" unit="A" label={{ value: 'Current (A)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Line type="monotone" dataKey="current" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            
             <Card>
                <CardHeader>
                    <CardTitle>Post-Lab Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-2 font-medium">What happens to the current if you keep the voltage constant but increase the resistance?</p>
                     <RadioGroup value={quizAnswer} onValueChange={(v) => {setQuizAnswer(v); if(quizIsCorrect !== null) { setQuizIsCorrect(null); setQuizAttempts(0); setQuizFeedback(null); }}}>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="increases" id="q-a"/><Label htmlFor="q-a">It increases</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="decreases" id="q-b"/><Label htmlFor="q-b">It decreases</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="same" id="q-c"/><Label htmlFor="q-c">It stays the same</Label></div>
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
