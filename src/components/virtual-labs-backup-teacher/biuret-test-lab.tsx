
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Move, Droplets, Egg, Milk, Leaf, Utensils } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

// --- Type Definitions ---
type FoodSample = 'Egg White' | 'Milk' | 'Bread' | 'Apple' | 'Groundnut Paste';
type ProteinLevel = 'none' | 'low' | 'medium' | 'high';
interface FoodInfo {
    proteinLevel: ProteinLevel;
    icon: React.ElementType;
}
type ResultState = 'initial' | 'simulating' | ProteinLevel;

const foodData: Record<FoodSample, FoodInfo> = {
    'Egg White': { proteinLevel: 'high', icon: Egg },
    'Milk': { proteinLevel: 'medium', icon: Milk },
    'Bread': { proteinLevel: 'low', icon: Utensils },
    'Apple': { proteinLevel: 'none', icon: Leaf },
    'Groundnut Paste': { proteinLevel: 'medium', icon: Leaf },
};

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


export function BiuretTestLab() {
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
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);


    const handleSelectFood = (food: FoodSample) => {
        setSelectedFood(food);
        setResult('initial');
        toast({ title: `${food} selected.` });
    };

    const handleAddReagent = () => {
        if (!selectedFood) {
            toast({ title: 'No food selected', description: 'Please select a food sample first.', variant: 'destructive' });
            return;
        }
        setIsSimulating(true);
        setResult('simulating');
        toast({ title: 'Adding Biuret Solution...', description: 'Observing reaction...' });

        setTimeout(() => {
            const proteinLevel = foodData[selectedFood].proteinLevel;
            setResult(proteinLevel);
            setIsSimulating(false);
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
        toast({ title: 'Lab Reset', description: 'Ready for a new experiment.' });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'Egg White';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! Egg white is a rich source of protein and showed the strongest reaction. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite. Which of these is best known for its high protein content? Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. Egg white is the sample with the highest protein content here. 🧠");
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
        if (!selectedFood || result === 'initial' || result === 'simulating') {
            toast({
                title: 'Experiment Not Complete',
                description: 'Please run a test to completion before generating a report.',
                variant: 'destructive',
            });
            return;
        }

        const outcomeTextMap: Record<ProteinLevel, string> = {
            'high': 'High protein was detected.',
            'medium': 'Medium protein was detected.',
            'low': 'Trace protein was detected.',
            'none': 'No protein was detected.',
        };
        const outcomeText = outcomeTextMap[result];

        toast({
            title: 'Lab Report Generated (Simulation)',
            description: `Test: Biuret Solution on ${selectedFood}. Result: ${outcomeText}`,
        });
    };
    
    const getTubeColorClass = () => {
        switch (result) {
            case 'high': return 'bg-purple-600';
            case 'medium': return 'bg-purple-500';
            case 'low': return 'bg-purple-400';
            case 'none': return 'bg-blue-400';
            case 'simulating':
            case 'initial':
            default: return 'bg-blue-200/50';
        }
    };

    const FoodIcon = selectedFood ? foodData[selectedFood].icon : Utensils;
    
    const objectiveText = "To test for the presence of proteins in different food samples using the Biuret test.";
    const theoryText = "The Biuret test is a chemical test used for detecting the presence of peptide bonds, which are the bonds between amino acids in proteins. In an alkaline environment, copper(II) ions in the Biuret solution form a purple-colored coordination complex with these peptide bonds. A positive result turns the solution from blue to purple or violet. The intensity of the purple color is proportional to the concentration of protein in the sample.";
    const safetyText = "In a real lab, always wear safety goggles. Biuret solution contains sodium hydroxide, which is corrosive and should be handled with care to avoid skin contact. Copper(II) sulfate is also harmful if ingested. Handle all chemicals with appropriate caution.";

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Objective: Test for Proteins</CardTitle>
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
                <CardHeader><CardTitle>Lab Information</CardTitle></CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4"/>
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
                                    <Shield className="h-4 w-4"/>
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
                    <CardDescription>Select a food sample and add the Biuret solution to test for protein.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Controls */}
                    <div className="space-y-4">
                        <Label className="font-semibold">1. Select Food Sample</Label>
                        <div className="grid grid-cols-3 gap-2">
                           {Object.keys(foodData).map(food => (
                                <Button key={food} variant={selectedFood === food ? 'default' : 'outline'} onClick={() => handleSelectFood(food as FoodSample)}>
                                    {food}
                                </Button>
                           ))}
                        </div>
                         <Button onClick={handleAddReagent} disabled={!selectedFood || isSimulating || (result !== 'initial' && result !== 'simulating')} className="w-full">
                            <Droplets className="mr-2 h-4 w-4" /> 
                            {isSimulating ? 'Reacting...' : '2. Add Biuret Solution'}
                        </Button>
                    </div>

                    {/* Simulation Viewer */}
                     <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg min-h-[250px] space-y-4">
                         <div className="relative h-32 w-24 text-center">
                            <div className="absolute w-full h-full border-x-2 border-b-2 border-gray-400 dark:border-gray-600 rounded-b-xl" />
                             <div className={cn("absolute inset-x-2 bottom-2 top-8 rounded-b-lg transition-colors duration-1000", getTubeColorClass())} />
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <FoodIcon className={cn("h-8 w-8", selectedFood ? "text-black/20 dark:text-white/20" : "text-transparent")} />
                             </div>
                              {selectedFood && (
                                <div className="absolute bottom-4 w-full px-1">
                                    <p className="text-xs font-medium text-black/60 dark:text-white/60 truncate">{selectedFood}</p>
                                </div>
                             )}
                         </div>
                         <div className="h-8 text-center">
                            {result === 'high' && <p className="font-semibold text-purple-700">Strong Protein Reaction!</p>}
                            {result === 'medium' && <p className="font-semibold text-purple-600">Protein Detected.</p>}
                            {result === 'low' && <p className="font-semibold text-purple-500">Trace Protein Detected.</p>}
                            {result === 'none' && <p className="font-semibold text-blue-600">No Protein Detected.</p>}
                            {isSimulating && <p className="text-muted-foreground animate-pulse">Observing...</p>}
                         </div>
                    </div>
                </CardContent>
                 <CardFooter>
                     <Button variant="outline" onClick={handleReset} className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset Lab
                    </Button>
                </CardFooter>
            </Card>

            {result !== 'initial' && result !== 'simulating' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Post-Lab Quiz</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-2 font-medium">Which sample contains the most protein?</p>
                        <RadioGroup value={quizAnswer} onValueChange={handleQuizChange} disabled={quizIsCorrect !== null}>
                             <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Bread" id="q-bread" /><Label htmlFor="q-bread">Bread</Label></div>
                             <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Egg White" id="q-egg" /><Label htmlFor="q-egg">Egg White</Label></div>
                             <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Apple" id="q-apple" /><Label htmlFor="q-apple">Apple</Label></div>
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
