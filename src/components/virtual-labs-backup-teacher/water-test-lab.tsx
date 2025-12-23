
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, Droplets, BookOpen, Shield } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

// --- Visual Components ---

const PetriDish = ({ color, children }: { color: string, children: React.ReactNode }) => (
    <div className="relative w-24 h-24">
        <div className={cn("w-full h-full rounded-full border-2", color)}>
            <div className="w-full h-full rounded-full bg-white/50 dark:bg-gray-800/50 flex items-center justify-center">
                {children}
            </div>
        </div>
    </div>
);

const CobaltPaper = ({ color }: { color: 'blue' | 'pink' }) => (
    <div className={cn("w-24 h-12 rounded-lg border-2 transition-colors duration-500", 
        color === 'blue' ? 'bg-blue-300 border-blue-500' : 'bg-pink-300 border-pink-500'
    )}></div>
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


export function WaterTestLab() {
    const { toast } = useToast();
    const [copperSulfateState, setCopperSulfateState] = React.useState<'initial' | 'tested'>('initial');
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [cobaltChlorideState, setCobaltChlorideState] = React.useState<'initial' | 'tested'>('initial');
    
    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    // Highlight state
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    const handleTest = (testType: 'copper' | 'cobalt') => {
        if (testType === 'copper') {
            setCopperSulfateState('tested');
            toast({ title: "Observation", description: "The white anhydrous copper(II) sulfate turned blue." });
        } else {
            setCobaltChlorideState('tested');
            toast({ title: "Observation", description: "The blue cobalt(II) chloride paper turned pink." });
        }
    };

    const handleReset = () => {
        setCopperSulfateState('initial');
        setCobaltChlorideState('initial');
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setHighlightInfo(null);
        toast({ title: 'Lab Reset', description: 'Ready for a new experiment.' });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'both';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! Both are standard chemical tests for water. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite right. Both experiments you just did are valid tests. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. Both anhydrous copper(II) sulfate and cobalt(II) chloride paper are used to test for water. 🧠");
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
            description: `Test for Water: Anhydrous copper(II) sulfate turned from white to blue. Cobalt(II) chloride paper turned from blue to pink. Both tests confirm the presence of water.`,
        });
    };
    
    // Define texts for TTS
    const objectiveText = "To chemically test for the presence of water using anhydrous copper(II) sulfate and cobalt(II) chloride paper.";
    const theoryText = "Two common chemical tests can confirm the presence of water. Anhydrous Copper(II) Sulfate is a white powder. When it comes into contact with water, it becomes hydrated and turns a distinct blue color. Cobalt(II) Chloride Paper is a blue paper. In the presence of water, it turns pink. This reaction is reversible with heat.";
    const safetyText = "In a real lab: Wear safety goggles. Handle chemicals with care. Copper(II) sulfate is harmful if ingested. Cobalt(II) chloride is a potential carcinogen and should be handled with gloves.";

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
                            className="flex-shrink-0"
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
                            <AccordionTrigger><Shield className="h-4 w-4 mr-2"/>Safety Precautions</AccordionTrigger>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Test 1: Copper(II) Sulfate</CardTitle>
                        <CardDescription>Click the button to add water to the powder.</CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-[150px] flex flex-col items-center justify-center gap-4">
                        <PetriDish color={copperSulfateState === 'initial' ? 'border-gray-300' : 'border-blue-500'}>
                            <p className={cn("text-xl font-bold transition-colors duration-500", copperSulfateState === 'initial' ? 'text-gray-500' : 'text-blue-600')}>
                                {copperSulfateState === 'initial' ? 'CuSO₄' : 'CuSO₄·5H₂O'}
                            </p>
                        </PetriDish>
                        {copperSulfateState === 'tested' && <p className="text-sm font-semibold text-green-600">Powder turned blue!</p>}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleTest('copper')} disabled={copperSulfateState === 'tested'} className="w-full">Add Water</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Test 2: Cobalt(II) Chloride Paper</CardTitle>
                        <CardDescription>Click the button to add water to the paper.</CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-[150px] flex flex-col items-center justify-center gap-4">
                        <CobaltPaper color={cobaltChlorideState === 'initial' ? 'blue' : 'pink'} />
                        {cobaltChlorideState === 'tested' && <p className="text-sm font-semibold text-green-600">Paper turned pink!</p>}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleTest('cobalt')} disabled={cobaltChlorideState === 'tested'} className="w-full">Add Water</Button>
                    </CardFooter>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Post-Lab Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-2 font-medium">Which of these can be used to test for water?</p>
                    <RadioGroup value={quizAnswer} onValueChange={handleQuizChange} disabled={quizIsCorrect !== null}>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="litmus" id="q-a" /><Label htmlFor="q-a">Litmus Paper only</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="copper_sulfate" id="q-b" /><Label htmlFor="q-b">Anhydrous Copper(II) Sulfate only</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="both" id="q-c" /><Label htmlFor="q-c">Both Copper(II) Sulfate and Cobalt(II) Chloride paper</Label></div>
                    </RadioGroup>
                    {quizFeedback && <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", quizIsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100", quizIsCorrect === null && "text-blue-700 bg-blue-100")}>{quizIsCorrect ? <CheckCircle/> : !quizIsCorrect && quizAttempts > 1 ? <XCircle/> : <RefreshCw className="animate-spin"/>}{quizFeedback}</p>}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleQuizSubmit} disabled={!quizAnswer || quizIsCorrect !== null} size="sm">
                        {quizIsCorrect === true ? "Correct!" : quizIsCorrect === false ? "Answer Shown" : quizAttempts === 1 && quizIsCorrect === null ? "Try Again" : "Check Answer"}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lab Report</CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-center gap-4">
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
