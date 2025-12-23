
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Move, CircleDot } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

// --- Type Definitions ---
type Stage = 'initial' | 'tubeA' | 'tubeB' | 'tubeC' | 'quiz' | 'complete';
interface TubeResult {
    rusted: boolean;
    observed: boolean;
}

// --- SVG Icons ---
const IronNailIcon = ({ rusted, ...props }: React.SVGProps<SVGSVGElement> & { rusted?: boolean }) => (
    <svg width="32" height="96" viewBox="0 0 32 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-24" {...props}>
        {/* Nail Head */}
        <rect x="8" y="0" width="16" height="8" rx="2" className={cn(rusted ? "fill-orange-800" : "fill-gray-600")} />
        {/* Nail Body */}
        <path d="M12 8 L20 8 L18 92 C18 92 16 95 16 95 C16 95 14 92 14 92 L12 8 Z" className={cn(rusted ? "fill-orange-700" : "fill-gray-500")} />
        {/* Rust Spots */}
        {rusted && (
            <>
                <circle cx="16" cy="30" r="2" className="fill-orange-900/70" />
                <circle cx="15" cy="55" r="1.5" className="fill-orange-900/70" />
                <circle cx="17" cy="70" r="2" className="fill-orange-900/70" />
            </>
        )}
    </svg>
);

const DraggableNail = ({ onDragStart, onDragEnd }: { onDragStart: React.DragEventHandler, onDragEnd: React.DragEventHandler }) => (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="p-2 border bg-card rounded-lg cursor-grab active:cursor-grabbing flex items-center gap-2 text-sm shadow-sm"
    >
      <Move className="w-4 h-4 text-muted-foreground" />
      <span>Iron Nail</span>
    </div>
);

const TestTubeSetup = ({ title, description, children, onDrop, onDragOver, isTarget, isSimulating }: { title: string, description: string, children: React.ReactNode, onDrop: React.DragEventHandler, onDragOver: React.DragEventHandler, isTarget: boolean, isSimulating: boolean }) => (
    <div className="p-4 border rounded-lg bg-muted/20 text-center w-full max-w-xs">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mb-2">{description}</p>
        <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className={cn(
                "relative w-full h-48 mx-auto bg-gray-200/50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-transparent transition-colors",
                isTarget && !isSimulating && "border-accent animate-pulse",
                 isTarget && isSimulating && "border-muted-foreground"
            )}
        >
            {children}
        </div>
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


export function RustingLab() {
    const { toast } = useToast();
    const [stage, setStage] = React.useState<Stage>('initial');
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [results, setResults] = React.useState<Record<string, TubeResult>>({ A: { rusted: false, observed: false }, B: { rusted: false, observed: false }, C: { rusted: false, observed: false } });
    const [isSimulating, setIsSimulating] = React.useState(false);
    const [simulatingTube, setSimulatingTube] = React.useState<'A' | 'B' | 'C' | null>(null);
    const [draggedItem, setDraggedItem] = React.useState<string | null>(null);
    const [simulationDay, setSimulationDay] = React.useState(0);
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
    
    // Define texts for TTS and display
    const objectiveText = "To investigate the conditions necessary for the rusting of an iron nail by testing different environments.";
    const theoryText = "Rusting is the common term for the corrosion of iron and its alloys, such as steel. It is an oxidation process that occurs in the presence of two key ingredients: oxygen (from the air) and water. This experiment uses a control (Tube A) where both are present, and two other setups to isolate and remove one condition each: Tube B removes air/oxygen with boiled water and an oil layer, and Tube C removes water/moisture with a drying agent.";
    const safetyText = "While this is a simulation, in a real lab, you would handle glassware carefully. Boiling water requires a heat source; handle with care to avoid burns. Anhydrous calcium chloride is a drying agent and should not be ingested or handled with bare hands.";


    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: string) => {
        setDraggedItem(item);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    
    const handleDrop = (tubeId: 'A' | 'B' | 'C') => {
        if (draggedItem !== 'nail' || results[tubeId].observed) return;
        
        // Immediately place the nail in the tube (in its un-rusted state)
        setResults(prev => ({
            ...prev,
            [tubeId]: { ...prev[tubeId], observed: true }
        }));
        setDraggedItem(null); // Hide the draggable nail

        // Start the simulation process
        setIsSimulating(true);
        setSimulatingTube(tubeId);
        setSimulationDay(0);
        toast({ title: 'Simulating...', description: 'Observing changes over several days.' });

        // Sequence of timeouts for day counter
        setTimeout(() => setSimulationDay(1), 800);
        setTimeout(() => setSimulationDay(2), 1600);
        setTimeout(() => setSimulationDay(3), 2400);

        // Final result after simulation
        setTimeout(() => {
            const tubeShouldRust = tubeId === 'A';
            // Now, update the `rusted` property to trigger the color change
            setResults(prev => ({
                ...prev,
                [tubeId]: { ...prev[tubeId], rusted: tubeShouldRust }
            }));
            setIsSimulating(false);
            setSimulatingTube(null);
            setSimulationDay(0);
            toast({ title: 'Observation Complete!', description: `Check the result for Tube ${tubeId}.` });
        }, 3200);
    };

    const advanceStage = () => {
        if (stage === 'initial') setStage('tubeA');
        else if (stage === 'tubeA') setStage('tubeB');
        else if (stage === 'tubeB') setStage('tubeC');
        else if (stage === 'tubeC') setStage('quiz');
    };

    const handleReset = () => {
        setStage('initial');
        setResults({ A: { rusted: false, observed: false }, B: { rusted: false, observed: false }, C: { rusted: false, observed: false } });
        setIsSimulating(false);
        setSimulatingTube(null);
        setDraggedItem(null);
        setSimulationDay(0);
        // Reset quizzes
        setQuiz1Answer(undefined); setQuiz1Feedback(null); setQuiz1Attempts(0); setQuiz1IsCorrect(null);
        setQuiz2Answer(undefined); setQuiz2Feedback(null); setQuiz2Attempts(0); setQuiz2IsCorrect(null);
        toast({ title: 'Lab Reset', description: 'Ready for a new experiment.' });
    };

    const handleQuiz1Submit = () => {
        if (quiz1IsCorrect !== null) return;
        const isCorrect = quiz1Answer === 'a';
        const newAttempts = quiz1Attempts + 1;
        setQuiz1Attempts(newAttempts);
        if (isCorrect) {
            setQuiz1IsCorrect(true);
            setQuiz1Feedback('Correct! Only Tube A had both water and air. ✅');
        } else {
            if (newAttempts === 1) { setQuiz1Feedback('Review the results. Which nail changed color? Try again! 🔄'); } 
            else { setQuiz1IsCorrect(false); setQuiz1Feedback('Incorrect. Tube A is the correct answer. 🧠'); }
        }
    };
    const handleQuiz1Change = (value: string) => {
        setQuiz1Answer(value);
        if (quiz1IsCorrect !== null || (quiz1Attempts > 0 && quiz1IsCorrect === null)) {
            if (!(quiz1Attempts === 1 && quiz1IsCorrect === null)) { setQuiz1Attempts(0); setQuiz1Feedback(null); setQuiz1IsCorrect(null); }
        }
    };
    const handleQuiz2Submit = () => {
        if (quiz2IsCorrect !== null) return;
        const isCorrect = quiz2Answer === 'a';
        const newAttempts = quiz2Attempts + 1;
        setQuiz2Attempts(newAttempts);
        if (isCorrect) {
            setQuiz2IsCorrect(true);
            setQuiz2Feedback('Correct! The oil layer in Tube B prevented oxygen from reaching the nail. ✅');
        } else {
            if (newAttempts === 1) { setQuiz2Feedback('Look at the setups that prevented rust. What did they remove? Try again! 🔄'); } 
            else { setQuiz2IsCorrect(false); setQuiz2Feedback('Incorrect. The oil layer is a method shown to prevent rust. 🧠'); }
        }
    };
    const handleQuiz2Change = (value: string) => {
        setQuiz2Answer(value);
        if (quiz2IsCorrect !== null || (quiz2Attempts > 0 && quiz2IsCorrect === null)) {
             if (!(quiz2Attempts === 1 && quiz2IsCorrect === null)) { setQuiz2Attempts(0); setQuiz2Feedback(null); setQuiz2IsCorrect(null); }
        }
    };
    
    const handleGenerateReport = () => {
        if (stage !== 'quiz') {
            toast({ title: "Experiment Incomplete", description: "Please complete all stages of the experiment first.", variant: "destructive" });
            return;
        }
        toast({
            title: 'Lab Report Generated (Simulation)',
            description: 'Experiment: Rusting of Iron. Result: Rusting occurred only in Tube A, which contained both water and oxygen. This confirms both are necessary for corrosion.',
        });
    };
    
    const renderStageContent = () => {
        const stageMap: Record<Stage, React.ReactNode> = {
            initial: (
                <div className="text-center space-y-4">
                    <p>Click below to begin the experiment.</p>
                    <Button onClick={advanceStage}>Start Experiment</Button>
                </div>
            ),
            tubeA: (
                <div className="flex flex-col items-center gap-4">
                     {!results.A.observed && (
                        <div className="text-center space-y-2">
                            <DraggableNail onDragStart={(e) => handleDragStart(e, 'nail')} onDragEnd={handleDragEnd} />
                            <p className="text-xs text-muted-foreground">Drag the nail into the test tube to begin.</p>
                        </div>
                    )}
                    <TestTubeSetup title="Tube A" description="Iron nail in water, exposed to air." onDrop={() => handleDrop('A')} onDragOver={handleDragOver} isTarget={!results.A.observed} isSimulating={isSimulating}>
                        {results.A.observed && <IronNailIcon rusted={results.A.rusted} />}
                    </TestTubeSetup>
                    {isSimulating && simulatingTube === 'A' && <p className="text-accent font-bold animate-pulse text-xl tracking-wider">Day: {simulationDay}</p>}
                    {results.A.observed && !isSimulating && <Button onClick={advanceStage}>Next Stage</Button>}
                </div>
            ),
            tubeB: (
                 <div className="flex flex-col items-center gap-4">
                    {!results.B.observed && (
                        <div className="text-center space-y-2">
                            <DraggableNail onDragStart={(e) => handleDragStart(e, 'nail')} onDragEnd={handleDragEnd} />
                             <p className="text-xs text-muted-foreground">Drag the nail into the test tube to begin.</p>
                        </div>
                    )}
                    <TestTubeSetup title="Tube B" description="Nail in boiled water with an oil layer." onDrop={() => handleDrop('B')} onDragOver={handleDragOver} isTarget={!results.B.observed} isSimulating={isSimulating}>
                        <div className="absolute top-0 left-0 right-0 h-4 bg-yellow-200/50 dark:bg-yellow-800/50" />
                        {results.B.observed && <IronNailIcon rusted={results.B.rusted} />}
                    </TestTubeSetup>
                    {isSimulating && simulatingTube === 'B' && <p className="text-accent font-bold animate-pulse text-xl tracking-wider">Day: {simulationDay}</p>}
                    {results.B.observed && !isSimulating && <Button onClick={advanceStage}>Next Stage</Button>}
                </div>
            ),
            tubeC: (
                <div className="flex flex-col items-center gap-4">
                     {!results.C.observed && (
                        <div className="text-center space-y-2">
                            <DraggableNail onDragStart={(e) => handleDragStart(e, 'nail')} onDragEnd={handleDragEnd} />
                            <p className="text-xs text-muted-foreground">Drag the nail into the test tube to begin.</p>
                        </div>
                     )}
                    <TestTubeSetup title="Tube C" description="Nail with anhydrous calcium chloride (drying agent)." onDrop={() => handleDrop('C')} onDragOver={handleDragOver} isTarget={!results.C.observed} isSimulating={isSimulating}>
                         <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            <CircleDot className="h-2 w-2 text-gray-400" />
                            <CircleDot className="h-2 w-2 text-gray-400" />
                            <CircleDot className="h-2 w-2 text-gray-400" />
                        </div>
                        {results.C.observed && <IronNailIcon rusted={results.C.rusted} />}
                    </TestTubeSetup>
                    {isSimulating && simulatingTube === 'C' && <p className="text-accent font-bold animate-pulse text-xl tracking-wider">Day: {simulationDay}</p>}
                    {results.C.observed && !isSimulating && <Button onClick={advanceStage}>Proceed to Quiz</Button>}
                </div>
            ),
            quiz: (
                <div className="space-y-6 w-full max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-center">Post-Lab Quiz</h3>
                    <div>
                        <p className="mb-2 font-medium">1. In which tube did the iron nail rust?</p>
                        <RadioGroup value={quiz1Answer} onValueChange={handleQuiz1Change} disabled={quiz1IsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="a" id="q1-a"/><Label htmlFor="q1-a">Tube A</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="b" id="q1-b"/><Label htmlFor="q1-b">Tube B</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="c" id="q1-c"/><Label htmlFor="q1-c">Tube C</Label></div>
                        </RadioGroup>
                        {quiz1Feedback && <p className={cn("mt-2 text-sm flex items-center gap-2", quiz1IsCorrect ? "text-green-600" : "text-red-600")}>{quiz1IsCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {quiz1Feedback}</p>}
                        <Button onClick={handleQuiz1Submit} size="sm" variant="outline" className="mt-2" disabled={!quiz1Answer || quiz1IsCorrect !== null}>Check Q1</Button>
                    </div>
                     <div>
                        <p className="mb-2 font-medium">2. Which of these was shown to prevent rust?</p>
                        <RadioGroup value={quiz2Answer} onValueChange={handleQuiz2Change} disabled={quiz2IsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="a" id="q2-a"/><Label htmlFor="q2-a">Applying an oil layer</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="b" id="q2-b"/><Label htmlFor="q2-b">Adding more water</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="c" id="q2-c"/><Label htmlFor="q2-c">Exposing it to air</Label></div>
                        </RadioGroup>
                         {quiz2Feedback && <p className={cn("mt-2 text-sm flex items-center gap-2", quiz2IsCorrect ? "text-green-600" : "text-red-600")}>{quiz2Feedback}</p>}
                        <Button onClick={handleQuiz2Submit} size="sm" variant="outline" className="mt-2" disabled={!quiz2Answer || quiz2IsCorrect !== null}>Check Q2</Button>
                    </div>
                </div>
            ),
            complete: <div>Experiment Complete!</div> // Fallback
        };
        return stageMap[stage] || stageMap.initial;
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
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
                        <AccordionContent>
                           <div className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
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
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4" /> 
                                <span>Safety Precautions</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
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
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>Experiment Simulation</CardTitle>
                    <CardDescription>Follow the stages to observe the rusting process under different conditions.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[350px] flex flex-col items-center justify-center">
                    {renderStageContent()}
                </CardContent>
                <CardFooter className="justify-center">
                    <Button variant="outline" onClick={handleReset}>Reset Lab</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lab Report</CardTitle>
                    <CardDescription>Generate a summary of your findings.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button variant="secondary" onClick={handleGenerateReport} disabled={stage !== 'quiz'}>Generate Report</Button>
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
