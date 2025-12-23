
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Move, TestTube, Flame } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

// --- Type Definitions ---
type Metal = 'Magnesium' | 'Zinc' | 'Copper';
type TubeId = 'A' | 'B' | 'C';
interface TubeState {
    metal: Metal | null;
    reactionRate: number; // 0 for no reaction, higher for faster
    isSimulating: boolean;
    isComplete: boolean;
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
const SelectableOrDraggableMetal = ({ metal, onDragStart, onClick, isSelected }: { metal: Metal; onDragStart: React.DragEventHandler; onClick: React.MouseEventHandler; isSelected: boolean }) => {
    const isMobile = useIsMobile();
    const colorClasses: Record<Metal, string> = {
        Magnesium: 'bg-gray-300',
        Zinc: 'bg-gray-500',
        Copper: 'bg-orange-400',
    };
    return (
        <div
            draggable={!isMobile}
            onDragStart={onDragStart}
            onClick={onClick}
            className={cn(
                "p-2 border bg-card rounded-lg flex items-center gap-2 text-sm shadow-sm",
                isMobile ? "cursor-pointer" : "cursor-grab active:cursor-grabbing",
                isSelected && "ring-2 ring-accent" // Highlight if selected on mobile
            )}
        >
            <Move className="w-4 h-4 text-muted-foreground" />
            <div className={cn("w-4 h-4 rounded", colorClasses[metal])} />
            <span>{metal}</span>
        </div>
    );
};

const Bubble = ({ duration, delay }: { duration: number, delay: number }) => (
    <div
      className="absolute bottom-1 w-1 h-1 bg-gray-400/50 rounded-full animate-bubble"
      style={{
        left: `${10 + Math.random() * 80}%`,
        animation: `bubble ${duration}s linear ${delay}s infinite`,
      }}
    />
);

const TestTubeVisual = ({ state }: { state: TubeState }) => (
    <div className="relative w-24 h-48 mx-auto flex items-end justify-center">
        <div className="absolute w-full h-full border-x-2 border-b-2 border-gray-400 dark:border-gray-600 rounded-b-xl" />
        <div className="w-[calc(100%-1rem)] h-1/2 bg-blue-200/30 dark:bg-blue-900/40 rounded-b-lg">
            {state.metal && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 rounded-sm bg-gray-500" />
            )}
        </div>
        {state.isSimulating && state.reactionRate > 0 && Array.from({ length: state.reactionRate * 2 }).map((_, i) => (
            <Bubble key={i} duration={3 / state.reactionRate} delay={i * (0.5 / state.reactionRate)} />
        ))}
    </div>
);


export function MetalAcidReactionLab() {
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const [tubes, setTubes] = React.useState<Record<TubeId, TubeState>>({
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
        A: { metal: null, reactionRate: 0, isSimulating: false, isComplete: false },
        B: { metal: null, reactionRate: 0, isSimulating: false, isComplete: false },
        C: { metal: null, reactionRate: 0, isSimulating: false, isComplete: false },
    });
    
    // Mobile-specific state
    const [selectedMetal, setSelectedMetal] = React.useState<Metal | null>(null);
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

    const [quiz3Answer, setQuiz3Answer] = React.useState<string | undefined>();
    const [quiz3Feedback, setQuiz3Feedback] = React.useState<string | null>(null);
    const [quiz3Attempts, setQuiz3Attempts] = React.useState(0);
    const [quiz3IsCorrect, setQuiz3IsCorrect] = React.useState<boolean | null>(null);
    
    // --- Universal Reaction Logic ---
    const startReaction = (metal: Metal, tubeId: TubeId) => {
        if (!metal || tubes[tubeId].metal) return;

        const rates: Record<Metal, number> = { Magnesium: 5, Zinc: 2, Copper: 0 };
        const newTubeState: TubeState = {
            metal: metal,
            reactionRate: rates[metal],
            isSimulating: true,
            isComplete: false,
        };
        setTubes(prev => ({ ...prev, [tubeId]: newTubeState }));
        
        toast({ title: "Reaction Started!", description: `${metal} is reacting with HCl in Tube ${tubeId}.` });

        setTimeout(() => {
            setTubes(prev => ({ ...prev, [tubeId]: { ...prev[tubeId], isSimulating: false, isComplete: true } }));
            toast({ title: "Reaction Complete", description: `Observation for Tube ${tubeId} is finished.` });
        }, 3000); // Simulate reaction for 3 seconds
    };

    // --- Desktop Drag-and-Drop Handlers ---
    const handleDragStart = (e: React.DragEvent, metal: Metal) => {
        if (isMobile) return;
        e.dataTransfer.setData('application/metal-type', metal);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, tubeId: TubeId) => {
        if (isMobile) return;
        e.preventDefault();
        const metal = e.dataTransfer.getData('application/metal-type') as Metal;
        startReaction(metal, tubeId);
    };

    // --- Mobile Tap Handlers ---
    const handleSelectMetal = (metal: Metal) => {
        if (!isMobile) return;
        setSelectedMetal(metal);
        toast({ title: `${metal} selected`, description: "Now tap an empty test tube." });
    };

    const handleTubeClick = (tubeId: TubeId) => {
        if (!isMobile || !selectedMetal || tubes[tubeId].metal) return;
        startReaction(selectedMetal, tubeId);
        setSelectedMetal(null);
    };

    const handleSplintTest = (tubeId: TubeId) => {
        const tube = tubes[tubeId];
        if (!tube.isComplete) {
            toast({ title: "Wait!", description: "The reaction is not yet complete.", variant: 'destructive' });
            return;
        }
        if (tube.reactionRate > 0) {
            toast({ title: "POP!", description: "A 'pop' sound is heard. Hydrogen gas is present!", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" });
        } else {
            toast({ title: "Nothing happens...", description: "No hydrogen gas was produced." });
        }
    };
    
    const handleReset = () => {
        setTubes({
            A: { metal: null, reactionRate: 0, isSimulating: false, isComplete: false },
            B: { metal: null, reactionRate: 0, isSimulating: false, isComplete: false },
            C: { metal: null, reactionRate: 0, isSimulating: false, isComplete: false },
        });
        setSelectedMetal(null);
        setQuiz1Answer(undefined); setQuiz1Feedback(null); setQuiz1Attempts(0); setQuiz1IsCorrect(null);
        setQuiz2Answer(undefined); setQuiz2Feedback(null); setQuiz2Attempts(0); setQuiz2IsCorrect(null);
        setQuiz3Answer(undefined); setQuiz3Feedback(null); setQuiz3Attempts(0); setQuiz3IsCorrect(null);
        setHighlightInfo(null);
        toast({ title: "Lab Reset" });
    };

    // Quiz Handlers
    const handleQuiz1Submit = () => {
        if (quiz1IsCorrect !== null) return;
        const isCorrect = quiz1Answer === 'Magnesium';
        const newAttempts = quiz1Attempts + 1;
        setQuiz1Attempts(newAttempts);
        if (isCorrect) {
            setQuiz1IsCorrect(true);
            setQuiz1Feedback("Correct! Magnesium is the most reactive of the three. ✅");
        } else {
            if (newAttempts === 1) { setQuiz1Feedback('Not quite. Check the observations again. 🔄'); } 
            else { setQuiz1IsCorrect(false); setQuiz1Feedback('Incorrect. Magnesium reacted fastest. 🧠'); }
        }
    };
    const handleQuiz1Change = (value: string) => { setQuiz1Answer(value); if (quiz1IsCorrect !== null) { setQuiz1IsCorrect(null); setQuiz1Feedback(null); setQuiz1Attempts(0); } };

    const handleQuiz2Submit = () => {
        if (quiz2IsCorrect !== null) return;
        const isCorrect = quiz2Answer === 'Copper';
        const newAttempts = quiz2Attempts + 1;
        setQuiz2Attempts(newAttempts);
        if (isCorrect) {
            setQuiz2IsCorrect(true);
            setQuiz2Feedback("Correct! Copper is below hydrogen in the reactivity series. ✅");
        } else {
            if (newAttempts === 1) { setQuiz2Feedback('Which tube showed no bubbles? Try again! 🔄'); } 
            else { setQuiz2IsCorrect(false); setQuiz2Feedback('Incorrect. Copper did not react. 🧠'); }
        }
    };
    const handleQuiz2Change = (value: string) => { setQuiz2Answer(value); if (quiz2IsCorrect !== null) { setQuiz2IsCorrect(null); setQuiz2Feedback(null); setQuiz2Attempts(0); } };
    
    const handleQuiz3Submit = () => {
        if (quiz3IsCorrect !== null) return;
        const isCorrect = quiz3Answer === 'Hydrogen';
        const newAttempts = quiz3Attempts + 1;
        setQuiz3Attempts(newAttempts);
        if (isCorrect) {
            setQuiz3IsCorrect(true);
            setQuiz3Feedback("Correct! The 'pop' sound is the classic test for hydrogen. ✅");
        } else {
            if (newAttempts === 1) { setQuiz3Feedback('Recall the products of a metal-acid reaction. Try again! 🔄'); } 
            else { setQuiz3IsCorrect(false); setQuiz3Feedback('Incorrect. Hydrogen gas was released. 🧠'); }
        }
    };
    const handleQuiz3Change = (value: string) => { setQuiz3Answer(value); if (quiz3IsCorrect !== null) { setQuiz3IsCorrect(null); setQuiz3Feedback(null); setQuiz3Attempts(0); } };

    const objectiveText = "To investigate the reactivity of different metals with dilute hydrochloric acid and test for hydrogen gas.";
    const theoryText = "Metals have different reactivities. More reactive metals will react more vigorously with acids to produce hydrogen gas and a salt. The general equation is: Metal + Acid → Salt + Hydrogen Gas. A common test for hydrogen gas is the 'pop' test, where a lit splint placed at the mouth of the test tube will extinguish with a characteristic pop sound.";
    const safetyText = "In a real lab, always wear safety goggles, as acids are corrosive. Handle chemicals in a well-ventilated area. Be cautious with the 'pop' test, as hydrogen is flammable.";

    return (
        <div className="space-y-6">
             <style jsx global>{`
                @keyframes bubble {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(-150px); opacity: 0; }
                }
            `}</style>
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
                    <CardTitle>Experiment Simulation</CardTitle>
                    <CardDescription>{isMobile ? 'Tap a metal, then tap an empty test tube.' : 'Drag a metal into one of the test tubes containing dilute HCl.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-center gap-4 p-4 border rounded-md bg-muted/20">
                        {['Magnesium', 'Zinc', 'Copper'].map(m => (
                            <SelectableOrDraggableMetal
                                key={m}
                                metal={m as Metal}
                                onDragStart={(e) => handleDragStart(e, m as Metal)}
                                onClick={() => handleSelectMetal(m as Metal)}
                                isSelected={isMobile && selectedMetal === m}
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(['A', 'B', 'C'] as TubeId[]).map(id => (
                            <div
                                key={id}
                                onDrop={(e) => handleDrop(e, id)}
                                onDragOver={handleDragOver}
                                onClick={() => handleTubeClick(id)}
                                className={cn(
                                    "p-4 border-2 border-dashed rounded-lg text-center space-y-2 transition-colors",
                                    isMobile && selectedMetal && !tubes[id].metal && "border-accent cursor-pointer animate-pulse",
                                    !isMobile && "border-muted-foreground/30"
                                )}
                            >
                                <h4 className="font-semibold">Test Tube {id}</h4>
                                <TestTubeVisual state={tubes[id]} />
                                <div className="h-10">
                                    {tubes[id].isComplete && (
                                        <Button size="sm" onClick={(e) => { e.stopPropagation(); handleSplintTest(id); }}>Light Splint</Button>
                                    )}
                                     {tubes[id].isSimulating && <p className="text-xs text-primary animate-pulse">Reacting...</p>}
                                </div>
                                 <div className="h-8 text-xs text-muted-foreground">
                                    {tubes[id].isComplete && `${tubes[id].metal} + HCl → ${tubes[id].metal}Chloride + ${tubes[id].reactionRate > 0 ? 'Hydrogen' : 'No Gas'}`}
                                 </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="justify-center"><Button variant="outline" onClick={handleReset}>Reset All Tubes</Button></CardFooter>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Post-Lab Quiz</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <p className="mb-2 font-medium">1. Which metal reacted the fastest with HCl?</p>
                        <RadioGroup value={quiz1Answer} onValueChange={handleQuiz1Change} disabled={quiz1IsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Magnesium" id="q1-mg"/><Label htmlFor="q1-mg">Magnesium</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Zinc" id="q1-zn"/><Label htmlFor="q1-zn">Zinc</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Copper" id="q1-cu"/><Label htmlFor="q1-cu">Copper</Label></div>
                        </RadioGroup>
                        {quiz1Feedback && <p className={cn("mt-2 text-sm flex items-center gap-2", quiz1IsCorrect ? "text-green-600" : "text-red-600")}>{quiz1IsCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {quiz1Feedback}</p>}
                        <Button onClick={handleQuiz1Submit} size="sm" variant="outline" className="mt-2" disabled={!quiz1Answer || quiz1IsCorrect !== null}>Check Q1</Button>
                    </div>
                    <div>
                        <p className="mb-2 font-medium">2. Which metal did not react with HCl?</p>
                        <RadioGroup value={quiz2Answer} onValueChange={handleQuiz2Change} disabled={quiz2IsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Magnesium" id="q2-mg"/><Label htmlFor="q2-mg">Magnesium</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Zinc" id="q2-zn"/><Label htmlFor="q2-zn">Zinc</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Copper" id="q2-cu"/><Label htmlFor="q2-cu">Copper</Label></div>
                        </RadioGroup>
                         {quiz2Feedback && <p className={cn("mt-2 text-sm", quiz2IsCorrect ? "text-green-600" : "text-red-600")}>{quiz2Feedback}</p>}
                        <Button onClick={handleQuiz2Submit} size="sm" variant="outline" className="mt-2" disabled={!quiz2Answer || quiz2IsCorrect !== null}>Check Q2</Button>
                    </div>
                    <div>
                        <p className="mb-2 font-medium">3. What gas was released during the reactions?</p>
                        <RadioGroup value={quiz3Answer} onValueChange={handleQuiz3Change} disabled={quiz3IsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Oxygen" id="q3-o2"/><Label htmlFor="q3-o2">Oxygen</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="CarbonDioxide" id="q3-co2"/><Label htmlFor="q3-co2">Carbon Dioxide</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Hydrogen" id="q3-h2"/><Label htmlFor="q3-h2">Hydrogen</Label></div>
                        </RadioGroup>
                        {quiz3Feedback && <p className={cn("mt-2 text-sm", quiz3IsCorrect ? "text-green-600" : "text-red-600")}>{quiz3Feedback}</p>}
                        <Button onClick={handleQuiz3Submit} size="sm" variant="outline" className="mt-2" disabled={!quiz3Answer || quiz3IsCorrect !== null}>Check Q3</Button>
                    </div>
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
