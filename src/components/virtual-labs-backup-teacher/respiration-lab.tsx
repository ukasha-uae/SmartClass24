
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, Thermometer, TestTube, Sprout, BookOpen, Shield } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
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


// Simple SVG for seeds
const SeedIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M50 80C30 80 20 60 30 40C40 20 60 20 70 40C80 60 70 80 50 80Z" fill="#A0522D" />
    </svg>
);

export function RespirationLab() {
    const { toast } = useToast();
    const [isSimulating, setIsSimulating] = React.useState(false);
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [resultVisible, setResultVisible] = React.useState(false);
    
    // Highlight state
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    // Quiz States
    const [quiz1Answer, setQuiz1Answer] = React.useState<string | undefined>();
    const [quiz1Feedback, setQuiz1Feedback] = React.useState<string | null>(null);
    const [quiz1Attempts, setQuiz1Attempts] = React.useState(0);
    const [quiz1IsCorrect, setQuiz1IsCorrect] = React.useState<boolean | null>(null);

    const [quiz2Answer, setQuiz2Answer] = React.useState<string | undefined>();
    const [quiz2Feedback, setQuiz2Feedback] = React.useState<string | null>(null);
    const [quiz2Attempts, setQuiz2Attempts] = React.useState(0);
    const [quiz2IsCorrect, setQuiz2IsCorrect] = React.useState<boolean | null>(null);

    const handleStart = () => {
        setIsSimulating(true);
        setResultVisible(false);
        toast({ title: 'Observation Started...', description: 'Monitoring tubes for 24 virtual hours.' });

        setTimeout(() => {
            setIsSimulating(false);
            setResultVisible(true);
            toast({ title: 'Observation Complete!', description: 'Check the results in the flasks.' });
        }, 3000);
    };
    
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

    const handleReset = () => {
        setIsSimulating(false);
        setResultVisible(false);
        resetQuiz();
        setHighlightInfo(null); // Reset highlight info
        toast({ title: 'Lab Reset', description: 'Ready for a new experiment.' });
    };
    
    const handleQuiz1Submit = () => {
        if (quiz1IsCorrect !== null) return;
        const isCorrect = quiz1Answer === 'a';
        const newAttempts = quiz1Attempts + 1;
        setQuiz1Attempts(newAttempts);
        if (isCorrect) {
            setQuiz1IsCorrect(true);
            setQuiz1Feedback('Correct! Tube A with living seeds shows respiration. ✅');
        } else {
            if (newAttempts === 1) {
                setQuiz1Feedback('Which tube contains the living, active seeds? Try again! 🔄');
            } else {
                setQuiz1IsCorrect(false);
                setQuiz1Feedback('Incorrect. Tube A is the correct answer. 🧠');
            }
        }
    };
    const handleQuiz1Change = (value: string) => {
        setQuiz1Answer(value);
        if (quiz1IsCorrect !== null || (quiz1Attempts > 0 && quiz1IsCorrect === null)) {
            if (!(quiz1Attempts === 1 && quiz1IsCorrect === null)) {
                setQuiz1Attempts(0);
                setQuiz1IsCorrect(null);
                setQuiz1Feedback(null);
            }
        }
    };

    const handleQuiz2Submit = () => {
        if (quiz2IsCorrect !== null) return;
        const isCorrect = quiz2Answer === 'b';
        const newAttempts = quiz2Attempts + 1;
        setQuiz2Attempts(newAttempts);
        if (isCorrect) {
            setQuiz2IsCorrect(true);
            setQuiz2Feedback('Correct! Carbon dioxide (CO₂) turns limewater milky. ✅');
        } else {
            if (newAttempts === 1) {
                setQuiz2Feedback('Which gas is a product of respiration? Try again! 🔄');
            } else {
                setQuiz2IsCorrect(false);
                setQuiz2Feedback('Incorrect. Carbon dioxide is the gas that turns limewater milky. 🧠');
            }
        }
    };
    const handleQuiz2Change = (value: string) => {
        setQuiz2Answer(value);
        if (quiz2IsCorrect !== null || (quiz2Attempts > 0 && quiz2IsCorrect === null)) {
             if (!(quiz2Attempts === 1 && quiz2IsCorrect === null)) {
                setQuiz2Attempts(0);
                setQuiz2IsCorrect(null);
                setQuiz2Feedback(null);
            }
        }
    };

    const handleGenerateReport = () => {
        toast({
            title: 'Lab Report Generated (Simulation)',
            description: 'Experiment: Respiration in Germinating Seeds. Result: Tube A (Germinating seeds) showed an increase in temperature and produced CO₂, turning limewater milky. Tube B (Boiled seeds) showed no change.',
        });
    };
    
    const objectiveText = "To demonstrate that germinating seeds release heat and carbon dioxide as products of cellular respiration.";
    const theoryText = "Cellular Respiration is the process by which living organisms convert biochemical energy from nutrients into ATP (energy), and then release waste products. The general equation for aerobic respiration is: Glucose + Oxygen → Carbon Dioxide + Water + Energy (Heat). Germinating seeds are actively respiring to get energy for growth. This experiment aims to detect two products of this process: heat and carbon dioxide.";
    const safetyText = "In a real lab, ensure flasks are properly sealed to prevent contamination. Handle limewater (calcium hydroxide solution) with care as it can be an irritant. Use sterilized equipment to prevent microbial growth from interfering with the results.";

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
                    <CardTitle>Experiment Setup</CardTitle>
                    <CardDescription>Two flasks are set up. Press "Start Observation" to simulate the experiment over a period of time.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tube A */}
                        <div className="p-4 border rounded-lg bg-muted/20">
                            <h3 className="font-semibold text-center text-foreground">Tube A: Germinating Seeds</h3>
                            <div className="relative w-full h-48 mt-2 flex justify-center items-center">
                                {/* Thermometer */}
                                <div className="absolute left-2 top-0 h-40 w-4 bg-gray-300 rounded-full border">
                                    <div className={cn("absolute bottom-0 left-0 right-0 bg-red-500 rounded-b-full transition-all duration-1000 ease-in-out", resultVisible ? 'h-3/5' : 'h-1/2')} />
                                </div>
                                {/* Flask */}
                                <div className="relative w-24 h-32">
                                    <div className="absolute bottom-0 w-full h-20 bg-gray-200/50 dark:bg-gray-700/50 rounded-full" />
                                    <div className="absolute bottom-10 w-full h-12 bg-gray-200/50 dark:bg-gray-700/50" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }} />
                                    <div className="flex flex-wrap gap-1 p-2 absolute bottom-2 left-1/2 -translate-x-1/2">
                                        <Sprout className="w-5 h-5 text-green-600"/>
                                        <SeedIcon className="w-4 h-4"/>
                                        <Sprout className="w-4 h-4 text-green-600"/>
                                    </div>
                                </div>
                                {/* Limewater */}
                                <div className="absolute right-2 bottom-0 w-12 h-16 bg-gray-200/50 dark:bg-gray-700/50 rounded-t-md p-1">
                                    <div className={cn("w-full h-full rounded-md transition-colors duration-1000", resultVisible ? 'bg-white/80' : 'bg-blue-200/50')}></div>
                                    <p className="text-xs text-center mt-1">Limewater</p>
                                </div>
                            </div>
                            {resultVisible && <p className="text-center text-sm font-medium text-green-600 mt-2">Temp rose, Limewater turned milky.</p>}
                        </div>

                        {/* Tube B */}
                        <div className="p-4 border rounded-lg bg-muted/20">
                            <h3 className="font-semibold text-center text-foreground">Tube B: Boiled (Dead) Seeds</h3>
                             <div className="relative w-full h-48 mt-2 flex justify-center items-center">
                                {/* Thermometer */}
                                <div className="absolute left-2 top-0 h-40 w-4 bg-gray-300 rounded-full border">
                                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-red-500 rounded-b-full" />
                                </div>
                                {/* Flask */}
                                <div className="relative w-24 h-32">
                                    <div className="absolute bottom-0 w-full h-20 bg-gray-200/50 dark:bg-gray-700/50 rounded-full" />
                                    <div className="absolute bottom-10 w-full h-12 bg-gray-200/50 dark:bg-gray-700/50" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }} />
                                    <div className="flex flex-wrap gap-1 p-2 absolute bottom-2 left-1/2 -translate-x-1/2">
                                         <SeedIcon className="w-4 h-4 opacity-70"/>
                                         <SeedIcon className="w-4 h-4 opacity-70"/>
                                         <SeedIcon className="w-4 h-4 opacity-70"/>
                                    </div>
                                </div>
                                {/* Limewater */}
                                <div className="absolute right-2 bottom-0 w-12 h-16 bg-gray-200/50 dark:bg-gray-700/50 rounded-t-md p-1">
                                    <div className="w-full h-full rounded-md bg-blue-200/50"></div>
                                    <p className="text-xs text-center mt-1">Limewater</p>
                                </div>
                            </div>
                            {resultVisible && <p className="text-center text-sm font-medium text-muted-foreground mt-2">No change observed.</p>}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button onClick={handleStart} disabled={isSimulating || resultVisible}>
                        {isSimulating ? 'Observing...' : 'Start Observation'}
                    </Button>
                    <Button variant="outline" onClick={handleReset}>Reset</Button>
                </CardFooter>
            </Card>

            {resultVisible && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Post-Lab Quiz</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <p className="mb-2 font-medium">1. Which tube shows signs of respiration?</p>
                            <RadioGroup value={quiz1Answer} onValueChange={handleQuiz1Change} disabled={quiz1IsCorrect !== null}>
                                <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="a" id="q1-a"/><Label htmlFor="q1-a">Tube A</Label></div>
                                <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="b" id="q1-b"/><Label htmlFor="q1-b">Tube B</Label></div>
                                <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="c" id="q1-c"/><Label htmlFor="q1-c">Both</Label></div>
                                <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="d" id="q1-d"/><Label htmlFor="q1-d">None</Label></div>
                            </RadioGroup>
                            {quiz1Feedback && <p className={cn("mt-2 text-sm flex items-center gap-2 p-2 rounded-md", quiz1IsCorrect === true && "text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300", quiz1IsCorrect === false && "text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300", quiz1IsCorrect === null && "text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300")}>{quiz1IsCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {quiz1Feedback}</p>}
                            <Button onClick={handleQuiz1Submit} size="sm" variant="outline" className="mt-2" disabled={!quiz1Answer || quiz1IsCorrect !== null}>Check Q1</Button>
                        </div>
                         <div>
                            <p className="mb-2 font-medium">2. What gas turns limewater milky?</p>
                            <RadioGroup value={quiz2Answer} onValueChange={handleQuiz2Change} disabled={quiz2IsCorrect !== null}>
                                <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="a" id="q2-a"/><Label htmlFor="q2-a">Oxygen</Label></div>
                                <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="b" id="q2-b"/><Label htmlFor="q2-b">Carbon Dioxide</Label></div>
                                <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="c" id="q2-c"/><Label htmlFor="q2-c">Nitrogen</Label></div>
                            </RadioGroup>
                             {quiz2Feedback && <p className={cn("mt-2 text-sm flex items-center gap-2 p-2 rounded-md", quiz2IsCorrect === true && "text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300", quiz2IsCorrect === false && "text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300", quiz2IsCorrect === null && "text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300")}>{quiz2IsCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {quiz2Feedback}</p>}
                            <Button onClick={handleQuiz2Submit} size="sm" variant="outline" className="mt-2" disabled={!quiz2Answer || quiz2IsCorrect !== null}>Check Q2</Button>
                        </div>
                    </CardContent>
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
