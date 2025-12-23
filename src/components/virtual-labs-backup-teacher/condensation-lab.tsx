
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, Flame, Droplets, BookOpen, Shield, Move } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
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


// --- SVG Icons ---
const KettleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M20 70H80V90H20V70Z" fill="#C0C0C0" />
        <path d="M25 40C25 25 75 25 75 40V70H25V40Z" fill="#E0E0E0" stroke="#A9A9A9" strokeWidth="2" />
        <path d="M75 50H90L85 60H75V50Z" fill="#E0E0E0" stroke="#A9A9A9" strokeWidth="2" />
        <path d="M50 25C55 20 45 20 50 25" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const LidWithIceIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <div className="relative w-24 h-12" {...props}>
        <div className="absolute bottom-0 w-full h-4 bg-gray-300 dark:bg-gray-600 rounded-md border border-gray-400"></div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
            <div className="w-3 h-3 bg-blue-200 dark:bg-blue-400 rounded-sm skew-x-12"></div>
            <div className="w-4 h-4 bg-blue-200 dark:bg-blue-400 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-200 dark:bg-blue-400 rounded-sm -skew-x-12"></div>
        </div>
    </div>
);

const SteamParticle = ({ delay, duration }: { delay: number; duration: number }) => (
    <div
      className="absolute bottom-0 left-1/2 w-1 h-1 bg-gray-400/50 rounded-full animate-steam"
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
);

export function CondensationLab() {
    const { toast } = useToast();
    const [isHeated, setIsHeated] = React.useState(false);
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [isLidPlaced, setIsLidPlaced] = React.useState(false);
    const [isSimulating, setIsSimulating] = React.useState(false);

    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);
    
    const [draggedItem, setDraggedItem] = React.useState<string | null>(null);
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    const handleHeat = () => {
        setIsHeated(true);
        toast({ title: "Heating...", description: "The water is turning into steam." });
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: string) => {
        if (!isHeated) {
            toast({ title: "Wait!", description: "Please heat the water first.", variant: "destructive" });
            e.preventDefault();
            return;
        }
        setDraggedItem(item);
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (draggedItem === 'lid') {
            setIsLidPlaced(true);
            toast({ title: "Condensation starting...", description: "Observe the droplets." });
        }
        setDraggedItem(null);
    };
    
    const handleReset = () => {
        setIsHeated(false);
        setIsLidPlaced(false);
        setIsSimulating(false);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setHighlightInfo(null);
        toast({ title: 'Lab Reset', description: 'Ready for a new experiment.' });
    };
    
    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'c';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! The cold surface caused the water vapor to turn back into liquid water. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite right. Think about what happens when steam hits a cool window. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. The correct answer is that it condenses into liquid. 🧠");
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
        if(!isLidPlaced) {
             toast({ title: 'Experiment Incomplete', description: 'Please complete the simulation first.', variant: 'destructive' });
            return;
        }
         toast({
            title: 'Lab Report Generated (Simulation)',
            description: 'Heated water to create steam, then exposed it to a cold surface. Observed condensation as droplets formed. This demonstrates how cooling water vapor turns it into liquid.',
        });
    };

    const objectiveText = "To observe how cooling causes water vapor to condense into liquid water, and understand how this process plays a role in the water cycle and daily weather phenomena.";
    const theoryText = "Condensation is the process where water vapor (a gas) becomes liquid. It's the reverse of evaporation. Condensation happens when water vapor in the air cools down and loses energy, causing its particles to slow down and come closer together, forming liquid droplets. This is a key stage in the water cycle, responsible for cloud formation. You also see it every day, like when a cold drink 'sweats' on a hot day, or when your bathroom mirror fogs up after a hot shower.";
    const safetyText = "In a real lab, handle hot kettles and steam with care to avoid burns. Wear safety goggles. Be cautious of wet surfaces.";

    return (
        <div className="space-y-6">
            <style jsx global>{`
                @keyframes steam-rise {
                    0% { transform: translateY(0) scale(0.5); opacity: 0.5; }
                    100% { transform: translateY(-80px) scale(1.5); opacity: 0; }
                }
                .animate-steam { animation: steam-rise linear infinite; }
            `}</style>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Objective</CardTitle>
                        <TextToSpeech
                            textToSpeak={objectiveText}
                            onSentenceChange={(sentenceIndex) => setHighlightInfo({ section: 'objective', sentenceIndex })}
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
                    <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
                        <div className="flex-grow">
                            <p><HighlightedText text={theoryText} sectionId="theory" highlightedSentenceIndex={highlightInfo?.section === 'theory' ? highlightInfo.sentenceIndex : null} /></p>
                        </div>
                        <TextToSpeech
                            textToSpeak={theoryText}
                            onSentenceChange={(sentenceIndex) => setHighlightInfo({ section: 'theory', sentenceIndex })}
                            onStart={() => setHighlightInfo({ section: 'theory', sentenceIndex: 0 })}
                            onEnd={() => setHighlightInfo(null)}
                            className="flex-shrink-0"
                        />
                    </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>Safety Precautions</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
                         <div className="flex-grow">
                             <p><HighlightedText text={safetyText} sectionId="safety" highlightedSentenceIndex={highlightInfo?.section === 'safety' ? highlightInfo.sentenceIndex : null} /></p>
                         </div>
                         <TextToSpeech
                            textToSpeak={safetyText}
                            onSentenceChange={(sentenceIndex) => setHighlightInfo({ section: 'safety', sentenceIndex })}
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
                    <CardTitle>Experiment Simulation</CardTitle>
                    <CardDescription>Follow the steps to observe condensation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="min-h-[200px] bg-muted/30 p-4 rounded-lg flex flex-col md:flex-row items-center justify-around">
                        {/* Draggable Lid */}
                        {!isLidPlaced && (
                             <div className="flex flex-col items-center gap-2">
                                <div draggable onDragStart={(e) => handleDragStart(e, 'lid')} className="cursor-grab active:cursor-grabbing">
                                    <LidWithIceIcon />
                                </div>
                                <p className="text-xs text-muted-foreground">Drag cold lid over steam</p>
                             </div>
                        )}
                        
                        {/* Kettle and Drop Zone */}
                        <div 
                            className="relative w-48 h-48 flex flex-col items-center justify-end"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {isLidPlaced && (
                                <div className="absolute top-0 z-10">
                                    <LidWithIceIcon />
                                    {/* Droplets forming */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex">
                                        <Droplets className="h-3 w-3 text-blue-400 animate-pulse" />
                                        <Droplets className="h-4 w-4 text-blue-400 animate-pulse" style={{animationDelay: '0.2s'}} />
                                    </div>
                                </div>
                            )}
                            <div className="relative">
                                <KettleIcon className="h-24 w-24 text-gray-500" />
                                {isHeated && (
                                    <div className="absolute top-0 left-12 w-12 h-16">
                                        <SteamParticle delay={0} duration={2} />
                                        <SteamParticle delay={0.5} duration={1.8} />
                                        <SteamParticle delay={1} duration={2.2} />
                                        <SteamParticle delay={1.5} duration={1.9} />
                                    </div>
                                )}
                            </div>
                            <Flame className={cn("h-8 w-8 transition-colors", isHeated ? 'text-red-500' : 'text-gray-400')} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button onClick={handleHeat} disabled={isHeated}>1. Heat Water</Button>
                    <Button variant="outline" onClick={handleReset}>Reset Lab</Button>
                </CardFooter>
            </Card>

            {isLidPlaced && (
                <Card>
                    <CardHeader>
                        <CardTitle>Post-Lab Quiz</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="mb-2 font-medium">What happens to water vapor when it comes into contact with a cold surface?</p>
                         <RadioGroup value={quizAnswer} onValueChange={handleQuizChange} disabled={quizIsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="a" id="q-a"/><Label htmlFor="q-a">It turns into ice</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="b" id="q-b"/><Label htmlFor="q-b">It evaporates further</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="c" id="q-c"/><Label htmlFor="q-c">It condenses into liquid</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="d" id="q-d"/><Label htmlFor="q-d">It disappears</Label></div>
                         </RadioGroup>
                         {quizFeedback && <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", quizIsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100", quizIsCorrect === null && "text-blue-700 bg-blue-100")}>{quizIsCorrect ? <CheckCircle/> : !quizIsCorrect && quizAttempts > 1 ? <XCircle/> : <RefreshCw className="animate-spin"/>}{quizFeedback}</p>}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleQuizSubmit} disabled={!quizAnswer || quizIsCorrect !== null} size="sm">
                            {quizIsCorrect === true ? "Correct!" : quizIsCorrect === false ? "Answer Shown" : quizAttempts === 1 && quizIsCorrect === null ? "Try Again" : "Check Answer"}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Lab Report</CardTitle>
                    <CardDescription>Generate a summary of your experiment.</CardDescription>
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
