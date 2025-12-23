
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Move, Droplets, Clock, TestTube } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

// --- Type Definitions ---
type QuizState = 'not-answered' | 'correct' | 'incorrect-first' | 'incorrect-final';
type DraggableItem = 'amylase' | 'iodine';

// --- Visual Components ---
const TestTubeVisual = ({ stage, isHeated }: { stage: 'initial' | 'amylase_added' | 'iodine_before' | 'iodine_after', isHeated: boolean }) => {
    let bgColor = 'bg-blue-100/30 dark:bg-blue-900/40'; // Default starch solution
    if (stage === 'iodine_before') {
        bgColor = 'bg-indigo-900 dark:bg-indigo-700'; // Starch + Iodine
    } else if (stage === 'iodine_after') {
        bgColor = 'bg-amber-300 dark:bg-amber-600'; // Iodine color, no starch
    }

    return (
        <div className="relative w-24 h-48 mx-auto flex items-end justify-center">
            <div className="absolute w-full h-full border-x-2 border-b-2 border-gray-400 dark:border-gray-600 rounded-b-xl" />
            <div className={cn("w-[calc(100%-1rem)] h-1/2 transition-colors duration-500 rounded-b-lg", bgColor)} />
            {stage === 'initial' && (
                <div className="absolute bottom-10 text-xs font-medium text-black/60 dark:text-white/60">Starch Solution</div>
            )}
        </div>
    );
};

const DraggableDropper = ({ type, onDragStart, onClick, isSelected }: { type: DraggableItem, onDragStart: React.DragEventHandler<HTMLDivElement>, onClick: React.MouseEventHandler<HTMLDivElement>, isSelected: boolean }) => {
    const isMobile = useIsMobile();
    return (
        <div
            draggable={!isMobile}
            onDragStart={onDragStart}
            onClick={onClick}
            className={cn(
                "p-1 border bg-card rounded-lg flex flex-col items-center gap-0.5 text-sm shadow-sm hover:bg-muted transition-all",
                isSelected ? "ring-2 ring-accent" : "",
                isMobile ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
            )}
        >
            <Droplets className={cn("w-5 h-5", type === 'amylase' ? 'text-green-500' : 'text-amber-700')} />
            <span className="text-xs capitalize">{type}</span>
        </div>
    )
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


export function EnzymeStarchLab() {
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const [amylaseAdded, setAmylaseAdded] = React.useState(false);
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [timerStarted, setTimerStarted] = React.useState(false);
    const [timePassed, setTimePassed] = React.useState(0);
    const [reactionComplete, setReactionComplete] = React.useState(false);
    const [iodineAdded, setIodineAdded] = React.useState(false);
    const [draggedItem, setDraggedItem] = React.useState<DraggableItem | null>(null);
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);
    const [selectedItem, setSelectedItem] = React.useState<DraggableItem | null>(null);

    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    // Quiz States
    const [quiz1Answer, setQuiz1Answer] = React.useState<string | undefined>();
    const [quiz1Feedback, setQuiz1Feedback] = React.useState<string | null>(null);
    const [quiz1Attempts, setQuiz1Attempts] = React.useState(0);
    const [quiz1IsCorrect, setQuiz1IsCorrect] = React.useState<boolean | null>(null);
    
    const [quiz2Answer, setQuiz2Answer] = React.useState<string | undefined>();
    const [quiz2Feedback, setQuiz2Feedback] = React.useState<string | null>(null);
    const [quiz2Attempts, setQuiz2Attempts] = React.useState(0);
    const [quiz2IsCorrect, setQuiz2IsCorrect] = React.useState<boolean | null>(null);
    
    const startTimer = React.useCallback(() => {
        setTimerStarted(true);
        setTimePassed(0);
        setReactionComplete(false);
        setIodineAdded(false);
        
        timerRef.current = setInterval(() => {
            setTimePassed(prev => prev + 1);
        }, 1000);
    }, []);

    React.useEffect(() => {
        if (timePassed >= 10 && timerRef.current) {
            clearInterval(timerRef.current);
            setReactionComplete(true);
            toast({ title: 'Reaction Complete!', description: 'The starch has been broken down. You can now test with iodine.' });
        }
    }, [timePassed, toast]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: DraggableItem) => {
        if (isMobile) return;
        setDraggedItem(item);
    };

    const runReactionStep = (item: DraggableItem) => {
        if (item === 'amylase' && !amylaseAdded) {
            setAmylaseAdded(true);
            toast({ title: '⏳ Reaction started!', description: 'Tracking starch breakdown...' });
            startTimer();
        } else if (item === 'iodine' && amylaseAdded && !iodineAdded) {
            setIodineAdded(true);
            toast({ title: 'Iodine Added!', description: 'Observing the color change.' });
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (draggedItem) {
            runReactionStep(draggedItem);
        }
        setDraggedItem(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleMobileSelect = (item: DraggableItem) => {
        if (!isMobile) return;
        setSelectedItem(item);
        toast({ title: `${item} selected`, description: `Now tap the test tube to add it.` });
    };

    const handleMobileTubeTap = () => {
        if (!isMobile || !selectedItem) return;
        runReactionStep(selectedItem);
        setSelectedItem(null);
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
        if (timerRef.current) clearInterval(timerRef.current);
        setAmylaseAdded(false);
        setTimerStarted(false);
        setTimePassed(0);
        setReactionComplete(false);
        setIodineAdded(false);
        setSelectedItem(null);
        setHighlightInfo(null);
        resetQuiz();
        toast({ title: 'Lab Reset', description: 'Ready to start over.' });
    };

    const createQuizHandler = (
        setAnswer: React.Dispatch<React.SetStateAction<string | undefined>>,
        setFeedback: React.Dispatch<React.SetStateAction<string | null>>,
        setAttempts: React.Dispatch<React.SetStateAction<number>>,
        setIsCorrect: React.Dispatch<React.SetStateAction<boolean | null>>,
        currentAnswer: string | undefined,
        currentAttempts: number,
        currentIsCorrect: boolean | null,
        correctOption: string,
        correctFeedbackText: string,
        tryAgainFeedbackText: string,
        finalIncorrectFeedbackText: string
    ) => {
        const handleSubmit = () => {
            if (currentIsCorrect !== null) return;
            const isCorrect = currentAnswer === correctOption;
            const newAttempts = currentAttempts + 1;
            setAttempts(newAttempts);
            if (isCorrect) {
                setIsCorrect(true);
                setFeedback(correctFeedbackText);
            } else {
                if (newAttempts === 1) {
                    setFeedback(tryAgainFeedbackText);
                } else {
                    setIsCorrect(false);
                    setFeedback(finalIncorrectFeedbackText);
                }
            }
        };
        const handleChange = (value: string) => {
            setAnswer(value);
            if (currentIsCorrect !== null || (currentAttempts > 0 && currentIsCorrect === null)) {
                if (!(currentAttempts === 1 && currentIsCorrect === null)) {
                    setAttempts(0);
                    setIsCorrect(null);
                    setFeedback(null);
                }
            }
        };
        return { handleSubmit, handleChange };
    };

    const quiz1 = createQuizHandler(setQuiz1Answer, setQuiz1Feedback, setQuiz1Attempts, setQuiz1IsCorrect, quiz1Answer, quiz1Attempts, quiz1IsCorrect, 'Starch', 'Correct! ✅', 'Not quite. Think about the name of the lab. Try again! 🔄', 'Incorrect. The answer is Starch. 🧠');
    const quiz2 = createQuizHandler(setQuiz2Answer, setQuiz2Feedback, setQuiz2Attempts, setQuiz2IsCorrect, quiz2Answer, quiz2Attempts, quiz2IsCorrect, 'Iodine', 'Correct! ✅', 'Recall the common chemical used to identify starch. Try again! 🔄', 'Incorrect. The answer is Iodine. 🧠');
    
    const getVisualStage = () => {
        if (iodineAdded) {
            return reactionComplete ? 'iodine_after' : 'iodine_before';
        }
        return amylaseAdded ? 'amylase_added' : 'initial';
    };

    const objectiveText = "To observe how the enzyme amylase breaks down starch into simple sugars, simulating part of the digestion process.";
    const theoryText = "Enzymes are biological catalysts that speed up chemical reactions. Amylase is an enzyme found in saliva that begins the digestion of starch (a complex carbohydrate) by breaking it down into smaller, simpler sugars. Iodine is an indicator that turns blue-black in the presence of starch. If the starch is broken down, iodine will not cause a color change.";
    const safetyText = "In a real lab, wear safety goggles. Iodine can stain skin and clothes; handle it with care. Never taste any substances used in a laboratory setting.";

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
                <CardHeader><CardTitle>Lab Information</CardTitle></CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger><BookOpen className="h-4 w-4 mr-2"/>Background Theory</AccordionTrigger>
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
                             <AccordionTrigger><Shield className="h-4 w-4 mr-2"/>Safety Precautions</AccordionTrigger>
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
                    <CardDescription>{isMobile ? 'Tap an item to select it, then tap the test tube area.' : 'Drag an item to the test tube to run the experiment.'}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Controls */}
                    <div className="md:col-span-1 flex flex-col gap-4">
                        <Card className="bg-background">
                            <CardHeader className="p-2 pb-1">
                                <CardTitle className="text-sm text-center">Available Items</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2 flex flex-wrap justify-center gap-4">
                                 <div className={cn("transition-opacity", amylaseAdded && "opacity-30")}>
                                    <DraggableDropper type="amylase" onDragStart={(e) => handleDragStart(e, 'amylase')} onClick={() => handleMobileSelect('amylase')} isSelected={selectedItem === 'amylase'} />
                                 </div>
                                 <div className={cn("transition-opacity", (!amylaseAdded || iodineAdded) && "opacity-30")}>
                                     <DraggableDropper type="iodine" onDragStart={(e) => handleDragStart(e, 'iodine')} onClick={() => handleMobileSelect('iodine')} isSelected={selectedItem === 'iodine'} />
                                 </div>
                            </CardContent>
                        </Card>
                         <Card className="bg-background">
                            <CardHeader className="p-2 pb-1">
                                <CardTitle className="text-sm text-center">Timer</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2 text-center">
                                 <p className="text-2xl font-mono tabular-nums">{timePassed}s</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Simulation Viewer */}
                    <div 
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={handleMobileTubeTap}
                        className={cn(
                            "md:col-span-2 min-h-[300px] flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg border-2 border-dashed border-transparent transition-colors",
                            !isMobile && draggedItem && "border-accent",
                            isMobile && selectedItem && "border-accent animate-pulse"
                        )}
                        data-drag-over={!!draggedItem}
                    >
                         <TestTubeVisual stage={getVisualStage()} isHeated={false} />
                         <div className="mt-4 text-center h-10 px-4">
                            {!amylaseAdded && <p className="text-muted-foreground text-sm">{isMobile ? 'Tap amylase, then tap here.' : 'Drag amylase to start.'}</p>}
                            {amylaseAdded && !reactionComplete && <p className="text-primary animate-pulse flex items-center gap-2"><Clock className="h-4 w-4"/>Enzyme is breaking down starch...</p>}
                            {reactionComplete && !iodineAdded && <p className="font-semibold text-accent">{isMobile ? 'Tap iodine, then tap here.' : 'Drag iodine to test.'}</p>}
                            {reactionComplete && iodineAdded && (
                                <p className="font-semibold text-green-600">No color change - Starch has been broken down!</p>
                            )}
                            {!reactionComplete && iodineAdded && (
                                <p className="font-semibold text-indigo-700">Blue-black color - Starch is still present.</p>
                            )}
                        </div>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button variant="outline" onClick={handleReset} className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4"/> Reset Lab
                    </Button>
                </CardFooter>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>Post-Lab Quiz</CardTitle>
                    <CardDescription>Test your understanding of the experiment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <p className="font-medium mb-2">1. What does amylase break down?</p>
                        <RadioGroup value={quiz1Answer} onValueChange={quiz1.handleChange} disabled={quiz1IsCorrect !== null}>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Protein" id="q1-prot"/> <Label htmlFor="q1-prot">Protein</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Starch" id="q1-starch"/> <Label htmlFor="q1-starch">Starch</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Fats" id="q1-fats"/> <Label htmlFor="q1-fats">Fats</Label></div>
                        </RadioGroup>
                        {quiz1Feedback && <p className={cn("mt-2 text-sm flex items-center gap-2 p-2 rounded-md", quiz1IsCorrect === true && "text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300", quiz1IsCorrect === false && "text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300", quiz1IsCorrect === null && "text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300")}>{quiz1IsCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {quiz1Feedback}</p>}
                        <Button size="sm" variant="outline" className="mt-2" onClick={quiz1.handleSubmit} disabled={!quiz1Answer || quiz1IsCorrect !== null}>Check Q1</Button>
                    </div>
                     <div>
                        <p className="font-medium mb-2">2. What is used to test for the presence of starch?</p>
                        <RadioGroup value={quiz2Answer} onValueChange={quiz2.handleChange} disabled={quiz2IsCorrect !== null}>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Benedict's solution" id="q2-ben"/> <Label htmlFor="q2-ben">Benedict’s solution</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Iodine" id="q2-iodine"/> <Label htmlFor="q2-iodine">Iodine</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="Biuret reagent" id="q2-biuret"/> <Label htmlFor="q2-biuret">Biuret reagent</Label></div>
                        </RadioGroup>
                         {quiz2Feedback && <p className={cn("mt-2 text-sm flex items-center gap-2 p-2 rounded-md", quiz2IsCorrect === true && "text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300", quiz2IsCorrect === false && "text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300", quiz2IsCorrect === null && "text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300")}>{quiz2IsCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {quiz2Feedback}</p>}
                        <Button size="sm" variant="outline" className="mt-2" onClick={quiz2.handleSubmit} disabled={!quiz2Answer || quiz2IsCorrect !== null}>Check Q2</Button>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Lab Report</CardTitle>
                    <CardDescription>A summary of your observations.</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                    <ul>
                        <li><strong>Enzyme Used:</strong> Amylase</li>
                        <li><strong>Substrate:</strong> Starch Solution</li>
                        <li><strong>Indicator:</strong> Iodine</li>
                        <li><strong>Outcome:</strong> {iodineAdded ? (reactionComplete ? 'After the reaction, iodine test was negative (no blue-black color), indicating starch was broken down.' : 'Before the reaction was complete, iodine test was positive (blue-black color), indicating starch was present.') : 'Awaiting iodine test...'}</li>
                    </ul>
                </CardContent>
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
