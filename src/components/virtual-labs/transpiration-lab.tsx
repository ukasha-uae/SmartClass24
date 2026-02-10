
'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, Sun, Wind, BookOpen, Shield, Move, Droplets, ArrowLeft } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

/**
 * Safe function to get URL search params without triggering React errors
 */
function getSafeSearchParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return new URLSearchParams(window.location.search).get(key);
  } catch {
    return null;
  }
}
import { TeacherVoice } from './TeacherVoice';

// --- SVG Icons for the Lab ---
const PottedPlantIcon = ({...props}) => (
    <div className="relative w-32 h-48" {...props}>
        {/* Pot */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-orange-700/80 rounded-t-lg" style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0% 100%)' }} />
        <div className="absolute bottom-16 left-0 w-full h-2 bg-orange-800/90 rounded-t-sm" />
        {/* Stem */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-2 h-20 bg-green-700" />
        {/* Leaves */}
        <div className="absolute top-8 left-1/2 w-12 h-12 bg-green-600 rounded-full" />
        <div className="absolute top-12 left-[calc(50%-1.5rem)] w-8 h-8 bg-green-600 rounded-full" />
        <div className="absolute top-12 left-[calc(50%+0.5rem)] w-10 h-10 bg-green-600 rounded-full" />
    </div>
);

const PlasticBagIcon = ({...props}) => (
    <svg viewBox="0 0 100 100" className="w-24 h-24 text-blue-200/50" {...props}>
        <path d="M 20 100 L 20 30 C 20 10, 80 10, 80 30 L 80 100" fill="currentColor" />
        <rect x="15" y="25" width="70" height="10" rx="5" fill="currentColor" />
    </svg>
);

const DropletParticle = ({ top, left, delay }: { top: number, left: number, delay: number }) => (
    <div
        className="absolute transition-opacity duration-1000"
        style={{ top: `${top}%`, left: `${left}%`, animationDelay: `${delay}s` }}
    >
        <Droplets className="h-3 w-3 text-blue-400" />
    </div>
);

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


export function TranspirationLab() {
    const { toast } = useToast();
    const [isBagPlaced, setIsBagPlaced] = React.useState(false);
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [isSimulating, setIsSimulating] = React.useState(false);
    const [isSunOn, setIsSunOn] = React.useState(false);
    const [isFanOn, setIsFanOn] = React.useState(false);
    const [timeElapsed, setTimeElapsed] = React.useState(0);
    const [dropletCount, setDropletCount] = React.useState(0);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);
    
    // Highlight state
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    const timerRef = React.useRef<NodeJS.Timeout | null>(null);
    
    // Back to lesson link params - use safe method
    const backToLessonSlug = getSafeSearchParam('lesson');
    const backToProgrammeSlug = getSafeSearchParam('p');
    const backToSubjectSlug = getSafeSearchParam('s');


    // Effect for simulation timer
    React.useEffect(() => {
        if (!isSimulating) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeElapsed(prev => {
                const newTime = prev + 1;
                if (newTime >= 60) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    setIsSimulating(false);
                    return 60;
                }
                return newTime;
            });
            
            setDropletCount(prev => {
                const baseRate = 0.5;
                const sunMultiplier = isSunOn ? 1.5 : 1;
                const fanMultiplier = isFanOn ? 1.5 : 1;
                return Math.min(100, prev + (baseRate * sunMultiplier * fanMultiplier));
            });

        }, 100);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isSimulating, isSunOn, isFanOn]);

    // Effect to show toast when simulation completes, preventing render errors.
    React.useEffect(() => {
        if (!isSimulating && timeElapsed >= 60) {
            toast({ title: "Observation Complete!", description: "Check the results of the experiment." });
        }
    }, [isSimulating, timeElapsed, toast]);


    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("text/plain", "bag");
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const item = e.dataTransfer.getData("text/plain");
        if (item === 'bag') {
            setIsBagPlaced(true);
            toast({ title: "Bag Placed!", description: "You can now start the simulation." });
        }
    };
    
    const handleStartSimulation = () => {
        if (!isBagPlaced) {
            toast({ title: "Setup Incomplete", description: "Please drag the plastic bag over the plant first.", variant: "destructive" });
            return;
        }
        setIsSimulating(true);
    };

    const handleReset = () => {
        setIsBagPlaced(false);
        setIsSimulating(false);
        setIsSunOn(false);
        setIsFanOn(false);
        setTimeElapsed(0);
        setDropletCount(0);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        if (timerRef.current) clearInterval(timerRef.current);
        setHighlightInfo(null);
        toast({ title: "Lab Reset", description: "Ready to start a new observation." });
    };
    
    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'c';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! The water droplets inside the bag are the evidence of transpiration. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite. What did you observe changing inside the bag? Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. The formation of water droplets is the key evidence. 🧠");
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

    const handleGenerateReport = () => {
        toast({
            title: 'Lab Report Generated (Simulation)',
            description: `You observed transpiration for ${timeElapsed}s. With Sunlight ${isSunOn ? 'ON' : 'OFF'} and Fan ${isFanOn ? 'ON' : 'OFF'}, the moisture level reached ${Math.round(dropletCount)}%.`,
        });
    };

    const dropletPositions = React.useMemo(() => {
        return Array.from({ length: 20 }).map(() => ({
            top: 10 + Math.random() * 60,
            left: 10 + Math.random() * 80,
            delay: Math.random() * 2,
        }));
    }, []);

    const objectiveText = "To demonstrate that plants release water vapor through their leaves via a process called transpiration.";
    const theoryText = "Transpiration is the process where plants absorb water through the roots and then give off water vapor through pores (stomata) in their leaves. It's essentially how plants 'sweat'. This process helps pull water up from the roots and also cools the plant. Factors like heat (sunlight) and wind can increase the rate of transpiration.";
    const safetyText = "This is a safe virtual simulation. In a real experiment, ensure the plastic bag does not suffocate the plant for extended periods and handle any light sources that produce heat with care.";

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
          
          {backToLessonSlug && backToProgrammeSlug && backToSubjectSlug && (
            <Button asChild variant="outline" className="mb-4">
                <Link href={`/lesson/${backToLessonSlug}?p=${backToProgrammeSlug}&s=${backToSubjectSlug}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Lesson
                </Link>
            </Button>
          )}

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
                  <CardTitle>Experiment Setup</CardTitle>
                  <CardDescription>Drag the plastic bag over the plant, set the conditions, and start the simulation.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row gap-6 items-center">
                  {/* Controls */}
                  <div className="space-y-4">
                      {!isBagPlaced && (
                          <div draggable onDragStart={handleDragStart} className="p-2 border bg-card rounded-lg cursor-grab active:cursor-grabbing flex flex-col items-center gap-2 text-sm shadow-sm">
                              <PlasticBagIcon />
                              <span>Drag Me</span>
                          </div>
                      )}
                      <div className="flex items-center space-x-2"><Switch id="sun-switch" checked={isSunOn} onCheckedChange={setIsSunOn} /><Label htmlFor="sun-switch"><Sun className="inline h-4 w-4 mr-1"/>Sunlight</Label></div>
                      <div className="flex items-center space-x-2"><Switch id="fan-switch" checked={isFanOn} onCheckedChange={setIsFanOn} /><Label htmlFor="fan-switch"><Wind className="inline h-4 w-4 mr-1"/>Fan</Label></div>
                  </div>

                  {/* Simulation Area */}
                  <div onDrop={handleDrop} onDragOver={handleDragOver} className="relative w-64 h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-transparent data-[drag-over=true]:border-accent" data-drag-over={!isBagPlaced}>
                      <PottedPlantIcon />
                      {isBagPlaced && (
                          <div className="absolute inset-0">
                              <PlasticBagIcon className="w-full h-full opacity-30" />
                              {/* Droplets */}
                              <div className="absolute inset-0">
                                  {dropletPositions.slice(0, Math.floor(dropletCount / 5)).map((pos, i) => (
                                      <DropletParticle key={i} {...pos} />
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
                  
                  {/* Progress Display */}
                  <div className="w-full md:w-1/3 space-y-2 text-center">
                        <Label>Time Elapsed</Label>
                        <p className="text-2xl font-mono">{timeElapsed}s / 60s</p>
                        <Label>Moisture Build-up</Label>
                        <Progress value={dropletCount} />
                  </div>
              </CardContent>
              <CardFooter className="flex justify-center gap-4">
                  <Button onClick={handleStartSimulation} disabled={!isBagPlaced || isSimulating}>
                      {isSimulating ? 'Simulating...' : 'Start Simulation'}
                  </Button>
                  <Button variant="outline" onClick={handleReset}>Reset</Button>
              </CardFooter>
          </Card>
          
          {timeElapsed >= 60 && (
             <Card>
                <CardHeader><CardTitle>Post-Lab Quiz</CardTitle></CardHeader>
                <CardContent>
                    <p className="mb-2 font-medium">What evidence indicates transpiration has occurred?</p>
                    <RadioGroup value={quizAnswer} onValueChange={(v) => { setQuizAnswer(v); setQuizIsCorrect(null); setQuizAttempts(0); setQuizFeedback(null); }} disabled={quizIsCorrect !== null}>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="a" id="q-a" /><Label htmlFor="q-a">The leaves changed color</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="b" id="q-b" /><Label htmlFor="q-b">The water level in the pot decreased</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="c" id="q-c" /><Label htmlFor="q-c">Water droplets formed inside the bag</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="d" id="q-d" /><Label htmlFor="q-d">The roots stopped absorbing water</Label></div>
                    </RadioGroup>
                    {quizFeedback && <p className={cn("mt-2 text-sm flex items-center gap-2", quizIsCorrect ? "text-green-600" : "text-red-600")}>{quizIsCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {quizFeedback}</p>}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleQuizSubmit} disabled={!quizAnswer || quizIsCorrect !== null}>Check Answer</Button>
                </CardFooter>
             </Card>
          )}

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
