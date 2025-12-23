
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Utensils, Leaf, Newspaper, Droplets } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

// --- Type Definitions ---
type FoodSample = 'Groundnut Paste' | 'Bread' | 'Boiled Rice' | 'Water';
interface FoodInfo {
    hasFat: boolean;
    fatLevel: 'high' | 'low' | 'none';
    icon: React.ElementType;
}
type ResultState = 'initial' | 'testing' | 'fat_present' | 'fat_absent';

const foodData: Record<FoodSample, FoodInfo> = {
    'Groundnut Paste': { hasFat: true, fatLevel: 'high', icon: Leaf },
    'Bread': { hasFat: true, fatLevel: 'low', icon: Utensils },
    'Boiled Rice': { hasFat: false, fatLevel: 'none', icon: Utensils },
    'Water': { hasFat: false, fatLevel: 'none', icon: Droplets }, // Control
};

const PaperVisual = ({ result, food }: { result: ResultState, food: FoodSample | null }) => {
    let opacityClass = 'opacity-0';
    if (result === 'fat_present' && food && foodData[food]?.fatLevel === 'high') {
        opacityClass = 'opacity-50';
    } else if (result === 'fat_present' && food && foodData[food]?.fatLevel === 'low') {
        opacityClass = 'opacity-25';
    }

    return (
        <div className="relative w-48 h-48 bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-200 dark:border-amber-800 rounded-lg flex items-center justify-center">
            <Newspaper className="w-24 h-24 text-gray-400/30" />
            <div className={cn("absolute w-16 h-16 bg-amber-700/50 rounded-full transition-opacity duration-1000", opacityClass)} />
            <span className="absolute bottom-2 text-xs text-muted-foreground">Brown Paper</span>
        </div>
    );
};

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


export function GreaseSpotTestLab() {
    const { toast } = useToast();
    const [selectedFood, setSelectedFood] = React.useState<FoodSample | null>(null);
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [result, setResult] = React.useState<ResultState>('initial');
    const [isSimulating, setIsSimulating] = React.useState(false);
    
    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    // Highlight state
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);
    
    const handleApply = () => {
        if (!selectedFood) {
            toast({ title: 'Select a food sample', description: 'Choose a food to test for fat.', variant: 'destructive' });
            return;
        }
        
        setIsSimulating(true);
        setResult('testing');
        toast({ title: "Applying sample...", description: `Rubbing ${selectedFood} on the paper.` });

        setTimeout(() => {
            const hasFat = foodData[selectedFood].hasFat;
            setResult(hasFat ? 'fat_present' : 'fat_absent');
            setIsSimulating(false);
            toast({
                title: "Observation Complete!",
                description: hasFat ? "A translucent grease spot was observed." : "No change was observed."
            });
        }, 2000);
    };

    const handleReset = () => {
        setSelectedFood(null);
        setResult('initial');
        setIsSimulating(false);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setHighlightInfo(null);
        toast({ title: 'Lab Reset', description: 'Ready to test another food sample.' });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'Groundnut Paste';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! Groundnut paste has a high fat content and would leave a very obvious grease spot. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite. Think about which food is known for its high oil/fat content. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. Groundnut paste is the correct answer due to its high fat content. 🧠");
            }
        }
    };
    
    const handleQuizChange = (value: string) => {
        setQuizAnswer(value);
        if (quizIsCorrect !== null || (quizAttempts > 0 && quizIsCorrect === null)) {
            if (!(quizAttempts === 1 && quizIsCorrect === null)) {
                setQuizAttempts(0);
                setQuizFeedback(null);
                setQuizIsCorrect(null);
            }
        }
    };
    
    const handleGenerateReport = () => {
        if (result === 'initial') {
            toast({ title: "Experiment not performed.", variant: "destructive" });
            return;
        }
        toast({
            title: "Lab Report Generated",
            description: `Food Tested: ${selectedFood}. Result: ${result === 'fat_present' ? 'Translucent spot observed (Fat Present).' : 'No change observed (Fat Absent).'}`
        });
    };

    const objectiveText = "To test for the presence of fats/oils in different food samples using the simple grease spot test.";
    const theoryText = "The grease spot test is a simple method to detect the presence of fats and oils in a food sample. Fats and oils are lipids that are insoluble in water. When a food sample containing fat is rubbed onto a piece of paper (like brown paper), it leaves behind a translucent spot. This spot appears greasy and allows more light to pass through it than the rest of the paper. This translucency is the positive result for the presence of fats or oils.";
    const safetyText = "This is a very safe experiment, even in a real lab. Key points: Handle food samples hygienically. If any food sample is not for consumption, do not eat it. Clean your workspace after the experiment.";

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
                <CardHeader>
                    <CardTitle>Lab Information</CardTitle>
                </CardHeader>
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

            <Card>
                <CardHeader>
                    <CardTitle>Experiment Simulation</CardTitle>
                    <CardDescription>Select a food sample and apply it to the brown paper to see the result.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-6 items-center">
                    {/* Controls */}
                    <div className="w-full md:w-1/3 space-y-4">
                        <Label>1. Select Food Sample</Label>
                        <RadioGroup value={selectedFood || ''} onValueChange={(v) => setSelectedFood(v as FoodSample)}>
                            {Object.keys(foodData).map(food => (
                                <div key={food} className="flex items-center space-x-2"><RadioGroupItem value={food} id={food} /><Label htmlFor={food}>{food}</Label></div>
                            ))}
                        </RadioGroup>
                        <Button onClick={handleApply} disabled={!selectedFood || isSimulating} className="w-full">
                            {isSimulating ? 'Applying...' : '2. Apply to Paper'}
                        </Button>
                    </div>
                    {/* Visual Area */}
                    <div className="w-full md:w-2/3 flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg min-h-[250px]">
                        <PaperVisual result={result} food={selectedFood} />
                        <div className="h-8 mt-4 text-center">
                            {result === 'fat_present' && <p className="font-semibold text-green-600">Translucent spot observed (Fat Present)</p>}
                            {result === 'fat_absent' && <p className="font-semibold text-muted-foreground">No change observed (No Fat)</p>}
                            {isSimulating && <p className="text-primary animate-pulse">Observing...</p>}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" onClick={handleReset} className="w-full">Reset</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Post-Lab Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-2 font-medium">Which food sample will produce the most obvious grease spot?</p>
                    <RadioGroup value={quizAnswer} onValueChange={handleQuizChange} disabled={quizIsCorrect !== null}>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Bread" id="q-bread" /><Label htmlFor="q-bread">Bread</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Groundnut Paste" id="q-gnut" /><Label htmlFor="q-gnut">Groundnut Paste</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Boiled Rice" id="q-rice" /><Label htmlFor="q-rice">Boiled Rice</Label></div>
                    </RadioGroup>
                    {quizFeedback && <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", quizIsCorrect === true && "text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300", quizIsCorrect === false && "text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300", quizIsCorrect === null && quizAttempts === 1 && "text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300")}>{quizIsCorrect ? <CheckCircle /> : !quizIsCorrect && quizAttempts > 1 ? <XCircle /> : <RefreshCw className="animate-spin" />}{quizFeedback}</p>}
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
