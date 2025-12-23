
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Move, Waves, Play, Pause, Send } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '@/lib/utils';
import { Slider } from '../ui/slider';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

// --- Type Definitions ---
type WaveMode = 'fixed' | 'loose';
type SimState = 'off' | 'wave' | 'pulse';

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


export function WavesOnAStringLab() {
    const { toast } = useToast();
    const [frequency, setFrequency] = React.useState(2); // Hz
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [amplitude, setAmplitude] = React.useState(20); // pixels
    const [simState, setSimState] = React.useState<SimState>('off');
    const [mode, setMode] = React.useState<WaveMode>('fixed');
    
    // SVG state and refs
    const svgRef = React.useRef<SVGSVGElement>(null);
    const pathRef = React.useRef<SVGPathElement>(null);
    const animationFrameId = React.useRef<number>();
    
    // Wave parameters
    const waveSpeed = 200; // pixels per second
    const svgWidth = 500;
    const svgHeight = 200;
    const wavelength = simState !== 'off' && frequency > 0 ? waveSpeed / frequency : 0;
    const angularFrequency = 2 * Math.PI * frequency;
    const waveNumber = wavelength > 0 ? 2 * Math.PI / wavelength : 0;

    const runAnimation = React.useCallback(() => {
        let startTime: number | null = null;
        let pulseTravelTime = 0;
        
        if (simState === 'pulse') {
             pulseTravelTime = svgWidth / waveSpeed;
        }

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const time = (timestamp - startTime) / 1000; // time in seconds

            if (!pathRef.current) return;

            if (simState === 'pulse' && time > pulseTravelTime * 2) { // Allow for reflection
                setSimState('off');
                return;
            }

            let d = `M 0 ${svgHeight / 2}`;
            for (let x = 0; x <= svgWidth; x++) {
                // Wave traveling to the right
                let yRight = amplitude * Math.sin(waveNumber * x - angularFrequency * time);

                // Reflected wave traveling to the left
                let yLeft = 0;
                const timeForReflection = (svgWidth - x) / waveSpeed;
                if (time > timeForReflection) {
                    const reflectionTime = time - timeForReflection;
                    const reflectionPhase = waveNumber * (svgWidth - x) + angularFrequency * reflectionTime;
                    yLeft = (mode === 'fixed' ? -amplitude : amplitude) * Math.sin(reflectionPhase);
                }
                
                // Pulse logic
                if (simState === 'pulse') {
                     const pulseWidth = waveSpeed * 0.2; // pulse lasts 0.2s
                     if (x > waveSpeed * time || x < waveSpeed * time - pulseWidth) {
                         yRight = 0;
                     }
                      if (x > svgWidth - (waveSpeed * (time - pulseTravelTime)) || x < svgWidth - (waveSpeed * (time - pulseTravelTime)) - pulseWidth) {
                         yLeft = 0;
                      }
                }

                const y = svgHeight / 2 - (yRight + yLeft);
                d += ` L ${x} ${y}`;
            }
            pathRef.current.setAttribute('d', d);
            animationFrameId.current = requestAnimationFrame(animate);
        };
        animationFrameId.current = requestAnimationFrame(animate);

    }, [amplitude, waveNumber, angularFrequency, simState, svgWidth, svgHeight, waveSpeed, mode]);

    React.useEffect(() => {
        if (simState === 'wave' || simState === 'pulse') {
            runAnimation();
        }
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [simState, runAnimation]);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);
    
    const handleReset = () => {
        setSimState('off');
        setFrequency(2);
        setAmplitude(20);
        setMode('fixed');
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setHighlightInfo(null);
        if (pathRef.current) pathRef.current.setAttribute('d', `M 0 ${svgHeight / 2} L ${svgWidth} ${svgHeight / 2}`);
        toast({ title: 'Simulation Reset' });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'decreases';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! Wavelength is inversely proportional to frequency (λ = v/f). ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite. Observe how the waves get tighter or looser when you change the frequency. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. As frequency increases, the wavelength decreases. 🧠");
            }
        }
    };

    const handleGenerateReport = () => {
        toast({
            title: "Lab Report Generated (Simulation)",
            description: `You observed wave motion with Frequency=${frequency}Hz, Amplitude=${amplitude}px. The calculated wavelength is ${wavelength.toFixed(1)}px.`,
        });
    };

    const objectiveText = "To investigate the properties of transverse waves on a string, including frequency, amplitude, wavelength, and reflection.";
    const theoryText = "A wave is a disturbance that transfers energy through a medium. In a transverse wave, the particles of the medium move perpendicular to the direction of energy transfer. Key properties include: Amplitude (maximum displacement), Frequency (number of waves per second), Wavelength (distance between two consecutive crests), and Speed (how fast the wave travels, v = fλ). When a wave hits a boundary, it reflects. Reflection from a fixed end inverts the wave, while reflection from a loose end does not.";
    const safetyText = "This is a virtual lab with no physical risks. A real experiment with a string under tension would require care to ensure the setup is secure.";

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
                            <AccordionTrigger><BookOpen className="h-4 w-4 mr-2"/>Background Theory</AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
                                <div className="flex-grow"><p><HighlightedText text={theoryText} sectionId="theory" highlightedSentenceIndex={highlightInfo?.section === 'theory' ? highlightInfo.sentenceIndex : null} /></p></div>
                                <TextToSpeech textToSpeak={theoryText} onSentenceChange={(i) => setHighlightInfo({ section: 'theory', sentenceIndex: i })} onStart={() => setHighlightInfo({ section: 'theory', sentenceIndex: 0 })} onEnd={() => setHighlightInfo(null)} className="flex-shrink-0" />
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="safety">
                            <AccordionTrigger><Shield className="h-4 w-4 mr-2"/>Safety Precautions</AccordionTrigger>
                             <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
                                <div className="flex-grow"><p><HighlightedText text={safetyText} sectionId="safety" highlightedSentenceIndex={highlightInfo?.section === 'safety' ? highlightInfo.sentenceIndex : null} /></p></div>
                                <TextToSpeech textToSpeak={safetyText} onSentenceChange={(i) => setHighlightInfo({ section: 'safety', sentenceIndex: i })} onStart={() => setHighlightInfo({ section: 'safety', sentenceIndex: 0 })} onEnd={() => setHighlightInfo(null)} className="flex-shrink-0" />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Wave Simulation</CardTitle>
                    <CardDescription>Adjust the settings and observe the wave's behavior.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Controls */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="space-y-2"><Label>Frequency: {frequency.toFixed(1)} Hz</Label><Slider min={1} max={10} step={0.5} value={[frequency]} onValueChange={(v) => setFrequency(v[0])} /></div>
                            <div className="space-y-2"><Label>Amplitude: {amplitude.toFixed(0)} px</Label><Slider min={10} max={50} step={5} value={[amplitude]} onValueChange={(v) => setAmplitude(v[0])} /></div>
                            <Tabs value={mode} onValueChange={(v) => setMode(v as WaveMode)} className="w-full">
                                <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="fixed">Fixed End</TabsTrigger><TabsTrigger value="loose">Loose End</TabsTrigger></TabsList>
                            </Tabs>
                            <div className="flex gap-2">
                                <Button onClick={() => setSimState('pulse')} className="flex-1"><Send className="mr-2 h-4 w-4" />Send Pulse</Button>
                                <Button onClick={() => setSimState(simState === 'wave' ? 'off' : 'wave')} className="flex-1" variant={simState === 'wave' ? 'destructive' : 'default'}>{simState === 'wave' ? <Pause/> : <Play/>} Wave</Button>
                            </div>
                        </div>
                        {/* Visual Area */}
                        <div className="lg:col-span-2 relative w-full h-64 bg-muted/30 dark:bg-muted/50 rounded-lg p-2 border">
                            <svg ref={svgRef} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
                                <path ref={pathRef} d={`M 0 ${svgHeight / 2} L ${svgWidth} ${svgHeight / 2}`} stroke="hsl(var(--accent))" fill="none" strokeWidth="2" />
                                <rect x={svgWidth} y="0" width="5" height={svgHeight} className="fill-muted-foreground/30" />
                                {mode === 'fixed' && <rect x={svgWidth} y={svgHeight/2 - 5} width="5" height="10" className="fill-foreground" />}
                                {mode === 'loose' && <circle cx={svgWidth} cy={pathRef.current ? pathRef.current.getPointAtLength(svgWidth).y : svgHeight / 2} r="5" className="fill-accent" />}
                            </svg>
                        </div>
                     </div>
                </CardContent>
                <CardFooter className="flex flex-wrap justify-around text-sm font-medium text-muted-foreground gap-x-6 gap-y-2 pt-4 border-t">
                    <p>Wavelength (λ): <span className="font-bold text-accent">{wavelength > 0 ? `${wavelength.toFixed(1)} px` : 'N/A'}</span></p>
                    <p>Speed (v): <span className="font-bold text-accent">{waveSpeed} px/s</span></p>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader><CardTitle>Post-Lab Quiz</CardTitle></CardHeader>
                <CardContent>
                    <p className="mb-2 font-medium">If you increase the frequency of the wave, what happens to the wavelength (assuming speed is constant)?</p>
                    <RadioGroup value={quizAnswer} onValueChange={(v) => {setQuizAnswer(v); if(quizIsCorrect !== null) { setQuizIsCorrect(null); setQuizAttempts(0); setQuizFeedback(null); }}}>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="increases" id="q-inc"/><Label htmlFor="q-inc">It increases</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="decreases" id="q-dec"/><Label htmlFor="q-dec">It decreases</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="same" id="q-same"/><Label htmlFor="q-same">It stays the same</Label></div>
                    </RadioGroup>
                    {quizFeedback && <p className={cn("mt-2 text-sm flex items-center gap-2", quizIsCorrect ? 'text-green-600' : 'text-red-600')}>{quizIsCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {quizFeedback}</p>}
                </CardContent>
                <CardFooter>
                     <Button onClick={handleQuizSubmit} size="sm" disabled={!quizAnswer || quizIsCorrect !== null}>Check Answer</Button>
                </CardFooter>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Lab Report</CardTitle></CardHeader>
                <CardFooter className="flex gap-4">
                    <Button variant="secondary" onClick={handleGenerateReport}>Generate Report</Button>
                    <Button variant="outline" onClick={handleReset}>Reset Lab</Button>
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
