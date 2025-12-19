
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, Wind, TestTube, BookOpen, Shield } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';

// --- Visual Components ---
const Bubble = ({ delay, duration }: { delay: number; duration: number }) => (
    <div
        className="absolute bottom-0 w-2 h-2 bg-gray-400/50 rounded-full animate-bubble"
        style={{
            left: `${40 + Math.random() * 20}%`,
            animation: `bubble ${duration}s linear infinite`,
        }}
    />
);

const LimewaterBeaker = ({ stage }: { stage: 'clear' | 'milky' | 'simulating' }) => (
    <div className="relative w-32 h-40">
        <div className="absolute w-full h-full border-x-2 border-b-2 border-gray-400 dark:border-gray-600 rounded-b-xl" />
        <div className={cn(
            "absolute inset-x-2 bottom-2 top-12 rounded-b-lg transition-colors duration-1000",
            stage === 'clear' && 'bg-blue-200/30',
            stage === 'milky' && 'bg-white/80 backdrop-blur-sm',
            stage === 'simulating' && 'bg-blue-200/30'
        )} />
        {stage === 'simulating' && (
            <div className="absolute inset-0">
                {Array.from({ length: 5 }).map((_, i) => <Bubble key={i} delay={i * 0.4} duration={2} />)}
            </div>
        )}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-2 h-16 bg-gray-300 dark:bg-gray-500" />
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


export function LimewaterTestLab() {
    const { toast } = useToast();
    const [isSimulating, setIsSimulating] = React.useState(false);
    const [resultVisible, setResultVisible] = React.useState(false);

    // Highlight state
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    const handleStart = () => {
        setIsSimulating(true);
        setResultVisible(false);
        toast({ title: 'Experiment Started...', description: 'Bubbling exhaled air through the limewater.' });

        setTimeout(() => {
            setIsSimulating(false);
            setResultVisible(true);
            toast({ title: 'Observation Complete!', description: 'The limewater has turned milky.' });
        }, 2500);
    };

    const handleReset = () => {
        setIsSimulating(false);
        setResultVisible(false);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setHighlightInfo(null);
        toast({ title: 'Lab Reset', description: 'Ready for a new experiment.' });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'calcium_carbonate';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! The formation of insoluble calcium carbonate makes it milky. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite right. Think about what is formed when CO₂ reacts with limewater. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. The milky substance is calcium carbonate. 🧠");
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
            title: "Lab Report Generated (Simulation)",
            description: `Experiment: Test for CO₂. Result: Bubbling CO₂ through limewater caused it to turn milky due to the formation of calcium carbonate.`,
        });
    };
    
    const getBeakerStage = () => {
        if (resultVisible) return 'milky';
        if (isSimulating) return 'simulating';
        return 'clear';
    };

    const objectiveText = "To demonstrate the presence of carbon dioxide (CO₂) by observing its reaction with limewater.";
    const theoryText = "Limewater is the common name for a dilute solution of calcium hydroxide, Ca(OH)₂. When carbon dioxide (CO₂) gas is bubbled through it, a chemical reaction occurs. The product, calcium carbonate (CaCO₃), is a white solid that is insoluble in water. This makes the clear limewater appear milky or cloudy. The chemical equation is: CO₂ (gas) + Ca(OH)₂ (aq) → CaCO₃ (solid) + H₂O (liquid)";
    const safetyText = "In a real lab, it is important to wear safety goggles. Limewater can be an irritant, so avoid contact with skin and eyes. Also, be careful not to inhale substances directly from a test tube.";

    return (
        <div className="space-y-6">
            <style jsx global>{`
                @keyframes bubble {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(-100px); opacity: 0; }
                }
                .animate-bubble { animation: bubble linear infinite; }
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
                </CardHeader>
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
                                    onSentenceChange={(sentenceIndex) => setHighlightInfo({ section: 'theory', sentenceIndex })}
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
                    <CardDescription>Click the button to simulate bubbling exhaled air (containing CO₂) through the limewater.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[250px] flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <Wind className="h-12 w-12 text-gray-500"/>
                            <p className="text-xs">Exhaled Air</p>
                        </div>
                        <div className="text-center">
                            <LimewaterBeaker stage={getBeakerStage()} />
                            <p className="text-xs mt-1">Limewater</p>
                        </div>
                    </div>
                     {resultVisible && <p className="mt-4 font-semibold text-green-600">The limewater turned milky!</p>}
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button onClick={handleStart} disabled={isSimulating || resultVisible}>
                        {isSimulating ? 'Bubbling...' : 'Start Test'}
                    </Button>
                    <Button variant="outline" onClick={handleReset}>Reset</Button>
                </CardFooter>
            </Card>

            {resultVisible && (
                <Card>
                    <CardHeader>
                        <CardTitle>Post-Lab Quiz</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-2 font-medium">What is the milky substance that forms in the limewater?</p>
                        <RadioGroup value={quizAnswer} onValueChange={handleQuizChange} disabled={quizIsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="calcium_oxide" id="q-a" /><Label htmlFor="q-a">Calcium Oxide</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="calcium_carbonate" id="q-b" /><Label htmlFor="q-b">Calcium Carbonate</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="carbonic_acid" id="q-c" /><Label htmlFor="q-c">Carbonic Acid</Label></div>
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
                    <CardDescription>Generate a summary of your experiment findings.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button variant="secondary" onClick={handleGenerateReport}>Generate Report</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
