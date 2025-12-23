
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Move, Flame, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

// --- Type Definitions ---
type TubeContent = 'Oxygen' | 'Air';
interface TubeResult {
    splintState: 'none' | 'glowing' | 'relit' | 'extinguished';
}

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


// --- Visual Components ---
const GlowingSplintIcon = ({ state }: { state: 'idle' | 'glowing' | 'relit' | 'extinguished' }) => {
    return (
        <div className="relative w-8 h-24">
            <div className="absolute bottom-0 w-full h-full bg-orange-200 dark:bg-orange-900 rounded" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }} />
            {state !== 'idle' && (
                <div className={cn(
                    "absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full",
                    state === 'glowing' && "bg-orange-500 animate-pulse shadow-[0_0_10px_3px_rgba(249,115,22,0.7)]",
                    state === 'relit' && "bg-yellow-400"
                )}>
                    {state === 'relit' && <Flame className="w-full h-full text-red-500" />}
                </div>
            )}
        </div>
    );
};

const TestTubeSetup = ({ title, onDrop, onDragOver, children, isTarget }: { title: string; onDrop: React.DragEventHandler; onDragOver: React.DragEventHandler; children: React.ReactNode; isTarget: boolean }) => (
    <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className={cn("p-4 border-2 border-dashed rounded-lg text-center space-y-2 w-full max-w-[150px] transition-colors", isTarget ? 'border-accent' : 'border-muted-foreground/30')}
    >
        <h3 className="font-semibold text-foreground">{title}</h3>
        <div className="relative w-20 h-40 mx-auto bg-gray-200/50 dark:bg-gray-800/50 rounded-t-lg border-x-2 border-t-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
            {children}
        </div>
    </div>
);


export function OxygenTestLab() {
    const { toast } = useToast();
    const [results, setResults] = React.useState<Record<TubeContent, TubeResult>>({
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
        Oxygen: { splintState: 'none' },
        Air: { splintState: 'none' }
    });
    const [isSimulating, setIsSimulating] = React.useState(false);
    const [draggedItem, setDraggedItem] = React.useState<string | null>(null);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    // Highlight state
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    const handleDrop = (tube: TubeContent) => {
        if (draggedItem !== 'splint' || isSimulating) return;
        
        setIsSimulating(true);
        setResults(prev => ({...prev, [tube]: { splintState: 'glowing' }}));
        toast({ title: "Testing...", description: `Inserting splint into Tube with ${tube}.` });

        setTimeout(() => {
            const newSplintState = tube === 'Oxygen' ? 'relit' : 'extinguished';
            setResults(prev => ({...prev, [tube]: { splintState: newSplintState }}));
            setIsSimulating(false);
            if (newSplintState === 'relit') {
                toast({ title: "It Relit!", description: "The glowing splint burst back into flame!", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" });
            } else {
                toast({ title: "No Change", description: "The splint's glow faded out." });
            }
        }, 1500);
    };
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('text/plain', 'splint');
        setDraggedItem('splint');
    };
    const handleDragEnd = () => setDraggedItem(null);
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    
    const handleReset = () => {
        setResults({ Oxygen: { splintState: 'none' }, Air: { splintState: 'none' } });
        setIsSimulating(false);
        setDraggedItem(null);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setHighlightInfo(null);
        toast({ title: "Lab Reset" });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'oxygen';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! Oxygen supports combustion and relights a glowing splint. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite right. Which gas is known to help things burn? Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. Oxygen is the gas that relights a glowing splint. 🧠");
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
            description: `A glowing splint was introduced to Oxygen (relit) and Air (extinguished), confirming Oxygen supports combustion. Quiz result: ${quizIsCorrect ? 'Correct' : 'Incorrect/Not attempted'}.`,
        });
    };
    
    // Define texts for TTS
    const objectiveText = "To learn how to test for oxygen gas by observing its ability to relight a glowing splint.";
    const theoryText = "Oxygen is a highly reactive gas that is essential for combustion (burning). A unique chemical test for oxygen involves a glowing splint — a wooden stick that has been lit and then blown out so it is still glowing red. When this glowing splint is inserted into a container of concentrated oxygen, the high oxygen level will cause the splint to burst back into flame. This 'relighting' is a positive test for oxygen.";
    const safetyText = "In a real lab, always wear safety goggles. Handle fire and glowing splints with extreme care. Be aware that pure oxygen can make things burn very intensely.";

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
                        <AccordionItem value="safety"><AccordionTrigger><Shield className="h-4 w-4 mr-2"/>Safety Precautions</AccordionTrigger>
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
                    <CardDescription>Drag the glowing splint into one of the test tubes to observe the reaction.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-center mb-8">
                         <div
                            draggable
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            className="p-2 border bg-card rounded-lg cursor-grab active:cursor-grabbing flex flex-col items-center gap-1 text-sm shadow-lg"
                         >
                            <GlowingSplintIcon state="glowing" />
                            <span className="text-xs">Glowing Splint</span>
                         </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                        <TestTubeSetup title="Tube with Oxygen" onDrop={() => handleDrop('Oxygen')} onDragOver={handleDragOver} isTarget={draggedItem === 'splint'}>
                           {results.Oxygen.splintState !== 'none' && <GlowingSplintIcon state={results.Oxygen.splintState} />}
                           {results.Oxygen.splintState === 'relit' && <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-yellow-300 animate-ping opacity-75" style={{ animationDuration: '0.8s' }} />}
                        </TestTubeSetup>
                        <TestTubeSetup title="Tube with Air" onDrop={() => handleDrop('Air')} onDragOver={handleDragOver} isTarget={draggedItem === 'splint'}>
                             {results.Air.splintState !== 'none' && <GlowingSplintIcon state={results.Air.splintState} />}
                        </TestTubeSetup>
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
                     <p className="mb-2 font-medium">What gas causes a glowing splint to relight?</p>
                     <RadioGroup value={quizAnswer} onValueChange={handleQuizChange} disabled={quizIsCorrect !== null}>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="hydrogen" id="q-h2" /><Label htmlFor="q-h2">Hydrogen</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="oxygen" id="q-o2" /><Label htmlFor="q-o2">Oxygen</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="co2" id="q-co2" /><Label htmlFor="q-co2">Carbon Dioxide</Label></div>
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
