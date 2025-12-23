
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, Flame, BookOpen, Shield } from 'lucide-react';
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


// Bottle and Balloon SVG Component
const BottleWithBalloon = ({ inflated }: { inflated: boolean }) => (
    <svg viewBox="0 0 100 150" className="w-24 h-36">
        {/* Balloon */}
        <path
            d={inflated 
                ? "M 50 40 C 20 40, 20 0, 50 0 C 80 0, 80 40, 50 40" // Inflated path
                : "M 40 40 L 60 40 L 60 30 L 40 30 Z" // Deflated path
            }
            className={cn("fill-red-500/80 dark:fill-red-600/80 transition-all duration-1000 ease-out")}
        />
        {/* Bottle Neck */}
        <rect x="40" y="40" width="20" height="20" className="fill-gray-300/50 dark:fill-gray-600/50" />
        {/* Bottle Body */}
        <rect x="25" y="60" width="50" height="90" rx="5" className="fill-blue-200/40 dark:fill-blue-900/40" />
        {/* Water inside bottle body */}
         <rect x="26" y="110" width="48" height="40" rx="4" className="fill-blue-400/30 dark:fill-blue-800/30" />
    </svg>
);


export function ExpansionOfAirLab() {
    const { toast } = useToast();
    const [isHeated, setIsHeated] = React.useState(false);
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [isSimulating, setIsSimulating] = React.useState(false);
    
    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    // Highlight state
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    const handleHeat = () => {
        if (isSimulating || isHeated) return;
        setIsSimulating(true);
        toast({ title: 'Applying Heat...', description: 'Heating the water and observing the air inside the bottle.' });

        setTimeout(() => {
            setIsHeated(true);
            setIsSimulating(false);
            toast({ title: 'Observation Complete!', description: 'The balloon has inflated.' });
        }, 2000);
    };
    
    const handleReset = () => {
        setIsHeated(false);
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
            setQuizFeedback("Correct! The air particles inside the bottle gained energy, moved faster, spread out, and pushed the balloon outwards. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite. Think about what happened to the air when it was heated. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. The air inside the bottle expands when heated, causing the balloon to inflate. 🧠");
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
        if (!isHeated) {
            toast({ title: "Experiment Not Run", description: "Please run the simulation first to generate a report.", variant: "destructive" });
            return;
        }
        toast({
            title: 'Lab Report Generated (Simulation)',
            description: `Experiment: Expansion of Air. Result: When heat was applied, the balloon inflated, demonstrating that air (a gas) expands when heated. Quiz: ${quizIsCorrect === true ? 'Correct' : quizIsCorrect === false ? 'Incorrect' : 'Not Attempted'}.`
        });
    };

    const objectiveText = "To observe the expansion of air (a gas) when heated and understand how gases behave under temperature changes.";
    const theoryText = "According to the kinetic theory of matter, gases are composed of tiny particles that are in constant, random motion. When a gas is heated, its particles gain kinetic energy, move faster, and collide more frequently and forcefully. This increased movement causes the particles to spread out, occupying a larger volume. This is thermal expansion of gases.";
    const safetyText = "In a real lab, handle hot water with care. Wear safety goggles. Ensure the bottle can withstand temperature changes and is not sealed.";

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Objective</CardTitle>
                        <TextToSpeech
                            textToSpeak={objectiveText}
                            onSentenceChange={(sentenceIndex) => setHighlightInfo({ section: 'objective', sentenceIndex })}
                            onStart={() => setHighlightInfo({ section: 'objective', sentenceIndex: 0 })}
                            onEnd={() => setHighlightInfo(null)}
                            className="flex-shrink-0"
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
                    <CardDescription>Click the button to heat the water and observe the effect on the balloon.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[300px] flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
                    <div className="relative w-full h-48 flex items-end justify-center">
                        <div className="absolute w-40 h-24 bottom-0 bg-blue-200 dark:bg-blue-900/70 rounded-lg flex items-center justify-center border border-blue-300 dark:border-blue-800">
                           <p className="text-sm text-blue-800 dark:text-blue-200">{isHeated ? "Hot Water" : "Room Temp Water"}</p>
                           {isSimulating && <div className="absolute bottom-2 flex gap-1"><Flame className="w-5 h-5 text-orange-400 animate-pulse" /><Flame className="w-5 h-5 text-orange-400 animate-pulse" style={{animationDelay: '0.2s'}} /></div>}
                        </div>
                        <div className="relative z-10 flex flex-col items-center">
                           <span className="bg-background px-2 py-0.5 rounded-md text-xs text-muted-foreground shadow-sm mb-1">
                                Balloon
                           </span>
                           <BottleWithBalloon inflated={isHeated} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button onClick={handleHeat} disabled={isHeated || isSimulating}>
                        {isSimulating ? 'Heating...' : (isHeated ? 'Heated' : 'Heat Water')}
                    </Button>
                    <Button variant="outline" onClick={handleReset}>Reset</Button>
                </CardFooter>
            </Card>

            {isHeated && (
                <Card>
                    <CardHeader>
                        <CardTitle>Post-Lab Quiz</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="mb-2 font-medium">What caused the balloon to inflate?</p>
                         <RadioGroup value={quizAnswer} onValueChange={handleQuizChange} disabled={quizIsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="a" id="q-a"/><Label htmlFor="q-a">Water entered the balloon</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="b" id="q-b"/><Label htmlFor="q-b">The bottle expanded</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="c" id="q-c"/><Label htmlFor="q-c">The air inside expanded</Label></div>
                             <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="d" id="q-d"/><Label htmlFor="q-d">The balloon got lighter</Label></div>
                         </RadioGroup>
                         {quizFeedback && <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", quizIsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100", quizIsCorrect === null && "text-blue-700 bg-blue-100")}>{quizIsCorrect ? <CheckCircle/> : !quizIsCorrect && quizAttempts > 1 ? <XCircle/> : <RefreshCw className="animate-spin"/>}{quizFeedback}</p>}
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <Button onClick={handleQuizSubmit} disabled={!quizAnswer || quizIsCorrect !== null} size="sm">
                            {quizIsCorrect === true ? "Correct!" : quizIsCorrect === false ? "Answer Shown" : quizAttempts === 1 && quizIsCorrect === null ? "Try Again" : "Check Answer"}
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="link" className="text-xs p-0 h-auto">View Explanation</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Explanation</AlertDialogTitle><AlertDialogDescription>When the air inside the bottle is heated, its particles gain energy and move faster and further apart. This causes the air to expand and take up more space, pushing into the balloon and inflating it.</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>Got it</AlertDialogCancel></AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Lab Report</CardTitle>
                    <CardDescription>Generate a summary of your experiment findings.</CardDescription>
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
