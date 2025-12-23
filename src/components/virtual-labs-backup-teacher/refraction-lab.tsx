
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Thermometer, Table as TableIcon } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { Slider } from '../ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

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

interface DataPoint {
    i: number;
    r: number;
    e: number;
}

export function RefractionLab() {
    const { toast } = useToast();
    const [angleI, setAngleI] = React.useState(30); // Angle of incidence in degrees
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [recordedData, setRecordedData] = React.useState<DataPoint[]>([]);
    const [showTable, setShowTable] = React.useState(false);
    
    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    // Highlight state
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    const n_air = 1.0;
    const n_glass = 1.5;

    // Calculations using Snell's Law
    const i_rad = (angleI * Math.PI) / 180;
    const r_rad = Math.asin((n_air / n_glass) * Math.sin(i_rad));
    const angleR = (r_rad * 180) / Math.PI;
    const angleE = angleI; // For parallel surfaces, angle of emergence equals angle of incidence

    const handleAngleChange = (value: number[]) => {
        setAngleI(value[0]);
    };

    const handleRecordData = () => {
        const newDataPoint: DataPoint = {
            i: parseFloat(angleI.toFixed(1)),
            r: parseFloat(angleR.toFixed(1)),
            e: parseFloat(angleE.toFixed(1)),
        };
        // Avoid adding duplicate entries for the same angle
        if (!recordedData.some(d => d.i === newDataPoint.i)) {
            setRecordedData(prev => [...prev, newDataPoint].sort((a,b) => a.i - b.i));
            toast({ title: "Data Recorded", description: `Angles i=${newDataPoint.i}°, r=${newDataPoint.r}° added.` });
        } else {
             toast({ title: "Data Exists", description: `You have already recorded data for this angle.`, variant: 'destructive'});
        }
    };
    
    const handleReset = () => {
        setAngleI(30);
        setRecordedData([]);
        setShowTable(false);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setHighlightInfo(null);
        toast({ title: 'Lab Reset', description: 'Experiment has been reset to default values.' });
    };
    
    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'b';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! The ray bends towards the normal. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite right. Observe the diagram again. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. When entering a denser medium like glass, light slows down and bends towards the normal. 🧠");
            }
        }
    };

    const handleGenerateReport = () => {
        if (recordedData.length < 3) {
            toast({ title: 'Insufficient Data', description: 'Please record at least 3 data points before generating a report.', variant: 'destructive' });
            return;
        }
        toast({
            title: 'Lab Report Generated (Simulation)',
            description: `You observed that as the angle of incidence increases, the angle of refraction also increases. The ray bends towards the normal when entering glass and away when leaving.`,
        });
    };

    const objectiveText = "To observe how light bends when it passes from air into a glass block and emerges into air again, demonstrating refraction.";
    const theoryText = "Refraction is the bending of a wave when it enters a medium where its speed is different. The refraction of light when it passes from a fast medium to a slow medium bends the light ray toward the normal to the boundary between the two media. This relationship is described by Snell's Law: n₁sin(θ₁) = n₂sin(θ₂), where n is the refractive index and θ is the angle with respect to the normal.";
    const safetyText = "In a real lab, handle glass blocks with care to avoid breakage and sharp edges. When using light sources like lasers, never look directly into the beam. Ensure the workspace is stable and free of clutter.";

    // --- SVG Coordinate Calculations ---
    const width = 400;
    const height = 300;
    const block = { x: 150, y: 50, w: 100, h: 200 };
    const p1 = { x: block.x, y: height / 2 };
    
    const l1_end = {
        x: p1.x - 100 * Math.cos(i_rad),
        y: p1.y - 100 * Math.sin(i_rad)
    };

    const p2 = {
        x: block.x + block.w,
        y: p1.y + block.w * Math.tan(r_rad)
    };
    
    const l3_end = {
        x: p2.x + 100 * Math.cos(i_rad),
        y: p2.y + 100 * Math.sin(i_rad)
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
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
                            <AccordionTrigger><BookOpen className="h-4 w-4 mr-2" />Background Theory</AccordionTrigger>
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
                            <AccordionTrigger><Shield className="h-4 w-4 mr-2" />Safety Precautions</AccordionTrigger>
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
                    <CardTitle>Refraction Simulation</CardTitle>
                    <CardDescription>Drag the slider to change the angle of incidence.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="relative w-full max-w-lg mx-auto p-4 bg-muted/30 rounded-lg">
                        <svg viewBox={`0 0 ${width} ${height}`}>
                            {/* Glass Block */}
                            <rect x={block.x} y={block.y} width={block.w} height={block.h} fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary))" />
                            {/* Normals */}
                            <line x1={p1.x} y1={p1.y - 50} x2={p1.x} y2={p1.y + 50} stroke="hsl(var(--muted-foreground))" strokeDasharray="2,2" />
                            <line x1={p2.x} y1={p2.y - 50} x2={p2.x} y2={p2.y + 50} stroke="hsl(var(--muted-foreground))" strokeDasharray="2,2" />
                            {/* Light Rays */}
                            <line x1={l1_end.x} y1={l1_end.y} x2={p1.x} y2={p1.y} stroke="red" strokeWidth="2" />
                            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="red" strokeWidth="2" />
                            <line x1={p2.x} y1={p2.y} x2={l3_end.x} y2={l3_end.y} stroke="red" strokeWidth="2" />
                        </svg>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="angle-slider">Angle of Incidence (i): {angleI.toFixed(1)}°</Label>
                        <Slider id="angle-slider" min={0} max={80} step={1} value={[angleI]} onValueChange={handleAngleChange} />
                     </div>
                     <div className="flex justify-around text-sm font-medium">
                        <p>Angle of Refraction (r): <span className="text-accent font-bold">{angleR.toFixed(1)}°</span></p>
                        <p>Angle of Emergence (e): <span className="text-accent font-bold">{angleE.toFixed(1)}°</span></p>
                     </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                     <Button onClick={handleRecordData}><TableIcon className="mr-2 h-4 w-4" /> Record Data</Button>
                     <Button variant="outline" onClick={handleReset}>Reset</Button>
                </CardFooter>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Recorded Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Angle i (°)</TableHead><TableHead>Angle r (°)</TableHead><TableHead>Angle e (°)</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {recordedData.length > 0 ? recordedData.map(d => (
                                <TableRow key={d.i}><TableCell>{d.i}</TableCell><TableCell>{d.r}</TableCell><TableCell>{d.e}</TableCell></TableRow>
                            )) : <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No data recorded yet.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>

            <Card>
                <CardHeader><CardTitle>Post-Lab Quiz</CardTitle></CardHeader>
                <CardContent>
                    <p className="mb-2 font-medium">What happens to a light ray when it moves from a less dense medium (air) to a denser medium (glass)?</p>
                    <RadioGroup value={quizAnswer} onValueChange={(v) => { setQuizAnswer(v); if(quizIsCorrect !== null) { setQuizIsCorrect(null); setQuizAttempts(0); setQuizFeedback(null); }}} disabled={quizIsCorrect !== null}>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="q-a"/><Label htmlFor="q-a">It bends away from the normal</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="b" id="q-b"/><Label htmlFor="q-b">It bends toward the normal</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="c" id="q-c"/><Label htmlFor="q-c">It does not bend</Label></div>
                    </RadioGroup>
                    {quizFeedback && <p className={cn("mt-2 text-sm", quizIsCorrect ? 'text-green-600' : 'text-red-600')}>{quizFeedback}</p>}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleQuizSubmit} disabled={!quizAnswer || quizIsCorrect !== null}>Check Answer</Button>
                </CardFooter>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Lab Report</CardTitle></CardHeader>
                <CardFooter><Button variant="secondary" onClick={handleGenerateReport}>Generate Report</Button></CardFooter>
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
