
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Move } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { Slider } from '../ui/slider';
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


export function ReflectionLab() {
    const { toast } = useToast();
    const [angleI, setAngleI] = React.useState(40); // Angle of incidence in degrees
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [isVerified, setIsVerified] = React.useState(false);
    
    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    // Highlight state
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    const angleR = angleI; // First Law of Reflection
    const i_rad = (angleI * Math.PI) / 180;
    const r_rad = (angleR * Math.PI) / 180;
    
    // SVG Coordinate Calculations
    const width = 400;
    const height = 300;
    const origin = { x: width / 2, y: height - 50 };
    const rayLength = 120;
    
    const incidentRayEnd = {
        x: origin.x - rayLength * Math.sin(i_rad),
        y: origin.y - rayLength * Math.cos(i_rad)
    };

    const reflectedRayEnd = {
        x: origin.x + rayLength * Math.sin(r_rad),
        y: origin.y - rayLength * Math.cos(r_rad)
    };

    const handleAngleChange = (value: number[]) => {
        setAngleI(value[0]);
        setIsVerified(false); // Reset verification if angle changes
    };

    const handleVerify = () => {
        setIsVerified(true);
        toast({ title: "Law Verified!", description: "You have confirmed that θᵢ = θᵣ." });
    };

    const handleReset = () => {
        setAngleI(40);
        setIsVerified(false);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setHighlightInfo(null);
        toast({ title: 'Lab Reset', description: 'Experiment has been reset.' });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'b';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! The law of reflection states that the angle of incidence equals the angle of reflection. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite right. Recall the relationship you just verified. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. The Law of Reflection is θᵢ = θᵣ. 🧠");
            }
        }
    };
    
    const handleGenerateReport = () => {
        toast({
            title: 'Lab Report Generated (Simulation)',
            description: `You observed the Law of Reflection, verifying that the angle of incidence (${angleI}°) equals the angle of reflection (${angleR}°).`,
        });
    };

    const objectiveText = "To verify the laws of reflection using a virtual ray diagram setup with a plane mirror.";
    const theoryText = "The Law of Reflection governs how light bounces off smooth surfaces. It consists of two parts: 1. The angle of incidence (θᵢ) is equal to the angle of reflection (θᵣ). 2. The incident ray, the reflected ray, and the normal to the surface all lie in the same plane. The angles are always measured from the normal, which is an imaginary line perpendicular to the mirror at the point of incidence.";
    const safetyText = "In a real laboratory setting, be cautious with glass mirrors to avoid breakage and sharp edges. When using light sources like ray boxes or lasers, never look directly into the beam as it can cause eye damage.";

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
                            <AccordionTrigger><div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /><span>Background Theory</span></div></AccordionTrigger>
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
                            <AccordionTrigger><div className="flex items-center gap-2"><Shield className="h-4 w-4" /><span>Safety Precautions</span></div></AccordionTrigger>
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
                    <CardTitle>Reflection Simulation</CardTitle>
                    <CardDescription>Drag the slider to change the angle of incidence and observe the reflected ray.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="angle-slider">Angle of Incidence (θᵢ): {angleI.toFixed(1)}°</Label>
                            <Slider id="angle-slider" min={0} max={85} step={1} value={[angleI]} onValueChange={handleAngleChange} />
                        </div>
                        <Card className="bg-muted/30">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-base">Observations</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-2">
                                <p className="text-sm">θᵢ = <span className="font-bold">{angleI.toFixed(1)}°</span></p>
                                <p className="text-sm">θᵣ = <span className="font-bold">{angleR.toFixed(1)}°</span></p>
                                {isVerified && <div className="flex items-center gap-2 text-green-600 font-semibold"><CheckCircle className="h-4 w-4" /><span>Law Verified!</span></div>}
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Button size="sm" onClick={handleVerify} disabled={isVerified}>Verify Law</Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Visual Area */}
                    <div className="lg:col-span-2 relative w-full h-80 bg-background dark:bg-muted/30 rounded-lg border flex items-center justify-center overflow-hidden">
                        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                            {/* Mirror */}
                            <line x1="0" y1={origin.y} x2={width} y2={origin.y} stroke="hsl(var(--primary))" strokeWidth="4" />
                            <text x="10" y={origin.y - 10} className="text-xs fill-muted-foreground">Mirror</text>
                            
                            {/* Normal */}
                            <line x1={origin.x} y1={origin.y} x2={origin.x} y2={origin.y - rayLength - 10} stroke="hsl(var(--muted-foreground))" strokeDasharray="4,4" strokeWidth="1" />
                            <text x={origin.x + 5} y={origin.y - rayLength} className="text-xs fill-muted-foreground">Normal</text>

                            {/* Incident Ray */}
                            <line x1={incidentRayEnd.x} y1={incidentRayEnd.y} x2={origin.x} y2={origin.y} stroke="hsl(var(--destructive))" strokeWidth="2.5" markerEnd="url(#arrow)" />
                             <text x={incidentRayEnd.x - 10} y={incidentRayEnd.y - 5} className="text-[10px] fill-destructive">Incident Ray</text>

                            {/* Reflected Ray */}
                            <line x1={origin.x} y1={origin.y} x2={reflectedRayEnd.x} y2={reflectedRayEnd.y} stroke="hsl(var(--destructive))" strokeWidth="2.5" markerEnd="url(#arrow)" />
                            <text x={reflectedRayEnd.x} y={reflectedRayEnd.y - 5} className="text-[10px] fill-destructive">Reflected Ray</text>

                            {/* Angle Arcs and Labels */}
                            <path d={`M ${origin.x - 30 * Math.sin(i_rad/2)} ${origin.y - 30 * Math.cos(i_rad/2)} A 30 30 0 0 1 ${origin.x} ${origin.y - 30}`} fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
                            <text x={origin.x - 20} y={origin.y - 20} className="text-[10px] fill-foreground">θᵢ</text>

                            <path d={`M ${origin.x} ${origin.y - 30} A 30 30 0 0 1 ${origin.x + 30 * Math.sin(r_rad/2)} ${origin.y - 30 * Math.cos(r_rad/2)}`} fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
                             <text x={origin.x + 15} y={origin.y - 20} className="text-[10px] fill-foreground">θᵣ</text>

                            <defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--destructive))" /></marker></defs>
                        </svg>
                    </div>
                </CardContent>
                 <CardFooter className="justify-center">
                    <Button variant="outline" onClick={handleReset}>Reset Lab</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Post-Lab Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-2 font-medium">What does the Law of Reflection state?</p>
                    <RadioGroup value={quizAnswer} onValueChange={(v) => { setQuizAnswer(v); if(quizIsCorrect !== null) { setQuizIsCorrect(null); setQuizAttempts(0); setQuizFeedback(null); }}}>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="q-a" /><Label htmlFor="q-a">Angle of incidence = angle of refraction</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="b" id="q-b" /><Label htmlFor="q-b">Angle of incidence = angle of reflection</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="c" id="q-c" /><Label htmlFor="q-c">Light always bends in glass</Label></div>
                    </RadioGroup>
                    {quizFeedback && <p className={cn("mt-2 text-sm flex items-center gap-2", quizIsCorrect ? 'text-green-600' : 'text-red-600')}>{quizIsCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {quizFeedback}</p>}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleQuizSubmit} size="sm" disabled={!quizAnswer || quizIsCorrect !== null}>Check Answer</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lab Report</CardTitle>
                </CardHeader>
                <CardFooter>
                    <Button variant="secondary" onClick={handleGenerateReport}>Generate Report</Button>
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

