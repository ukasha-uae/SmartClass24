
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Move, Users, Dna, RotateCw, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { EssayGrader } from '../essay-grader';
import Link from 'next/link';
import { TeacherVoice } from './TeacherVoice';

// --- Helper Component for Highlighted Text ---
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


// --- SVG Visual Components ---
const Chromosome = ({ x, y, angle = 0, color = 'text-blue-500', isSingle = false }: { x: number; y: number; angle?: number; color?: string; isSingle?: boolean }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`} className={cn("transition-all duration-500", color)}>
    {isSingle ? (
      <path d="M -2 -8 Q 0 -10, 2 -8 L 2 8 Q 0 10, -2 8 Z" stroke="currentColor" fill="currentColor" strokeWidth="0.5" />
    ) : (
      <>
        <path d="M -5 -8 Q -3 -10, -1 -8 L -1 8 Q -3 10, -5 8 Z" stroke="currentColor" fill="currentColor" strokeWidth="0.5" />
        <path d="M 1 -8 Q 3 -10, 5 -8 L 5 8 Q 3 10, 1 8 Z" stroke="currentColor" fill="currentColor" strokeWidth="0.5" />
      </>
    )}
  </g>
);

const CellVisual = ({ children, isSplitting = false }: { children: React.ReactNode; isSplitting?: boolean }) => (
  <div className="w-full aspect-square max-w-sm bg-background border rounded-lg flex items-center justify-center relative overflow-hidden">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse
        cx="50"
        cy="50"
        rx={isSplitting ? 48 : 45}
        ry={isSplitting ? 35 : 45}
        className={cn("fill-muted/30 stroke-2 stroke-muted-foreground/50 transition-all duration-500")}
      />
      {children}
    </svg>
  </div>
);


// Mitosis Visuals
const MitosisProphase = () => ( <CellVisual><Chromosome x={45} y={50} angle={30} /><Chromosome x={55} y={50} angle={-30} color="text-red-500" /></CellVisual> );
const MitosisMetaphase = () => ( <CellVisual><Chromosome x={50} y={40} angle={90} /><Chromosome x={50} y={60} angle={90} color="text-red-500" /></CellVisual> );
const MitosisAnaphase = () => (
  <CellVisual isSplitting>
    <Chromosome x={30} y={40} angle={90} isSingle /><Chromosome x={30} y={60} angle={90} isSingle color="text-red-500" />
    <Chromosome x={70} y={40} angle={90} isSingle /><Chromosome x={70} y={60} angle={90} isSingle color="text-red-500" />
  </CellVisual>
);
const MitosisTelophase = () => (
  <CellVisual isSplitting>
    <g transform="translate(-25, 0)"><Chromosome x={30} y={45} angle={-30} isSingle /><Chromosome x={30} y={55} angle={30} isSingle color="text-red-500" /></g>
    <g transform="translate(25, 0)"><Chromosome x={70} y={45} angle={30} isSingle /><Chromosome x={70} y={55} angle={-30} isSingle color="text-red-500" /></g>
  </CellVisual>
);
const MitosisResult = () => (
    <div className="flex gap-2 w-full h-full items-center justify-center">
      <div className="w-1/2 h-full"><CellVisual><Chromosome x={45} y={50} isSingle /><Chromosome x={55} y={50} isSingle color="text-red-500" /></CellVisual></div>
      <div className="w-1/2 h-full"><CellVisual><Chromosome x={45} y={50} isSingle /><Chromosome x={55} y={50} isSingle color="text-red-500" /></CellVisual></div>
    </div>
);

// Meiosis Visuals
const MeiosisI = () => (<CellVisual><Chromosome x={45} y={50} /><Chromosome x={55} y={50} color="text-red-500" /></CellVisual>);
const MeiosisII = () => (
    <div className="flex gap-2 w-full h-full items-center justify-center">
      <div className="w-1/2 h-full"><CellVisual isSplitting><Chromosome x={30} y={50} angle={90} isSingle /><Chromosome x={70} y={50} angle={90} isSingle /></CellVisual></div>
      <div className="w-1/2 h-full"><CellVisual isSplitting><Chromosome x={30} y={50} angle={90} isSingle color="text-red-500" /><Chromosome x={70} y={50} angle={90} isSingle color="text-red-500" /></CellVisual></div>
    </div>
);
const MeiosisResult = () => (
    <div className="grid grid-cols-2 gap-1 w-full h-full p-4">
        <CellVisual><Chromosome x={50} y={50} isSingle /></CellVisual>
        <CellVisual><Chromosome x={50} y={50} isSingle /></CellVisual>
        <CellVisual><Chromosome x={50} y={50} isSingle color="text-red-500"/></CellVisual>
        <CellVisual><Chromosome x={50} y={50} isSingle color="text-red-500"/></CellVisual>
    </div>
);


const mitosisVisuals = [MitosisProphase, MitosisMetaphase, MitosisAnaphase, MitosisTelophase, MitosisResult];
const meiosisVisuals = [MeiosisI, MeiosisII, MeiosisResult];


// --- New Interactive Header ---
const InteractiveHeader = () => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-sky-100 dark:from-purple-900/30 dark:to-sky-900/30 p-4">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-center">
                <div className="flex items-center gap-2 transition-transform hover:scale-105">
                    <div className="p-3 bg-background/70 rounded-full shadow-md">
                        <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-semibold text-sm">Mitosis</span>
                        <span className="text-xs text-muted-foreground">(2 Identical Cells)</span>
                    </div>
                </div>

                <RotateCw className="w-6 h-6 text-muted-foreground hidden md:block" />

                 <div className="flex items-center gap-2 transition-transform hover:scale-105">
                     <div className="p-3 bg-background/70 rounded-full shadow-md">
                        <Dna className="w-6 h-6 text-sky-600" />
                    </div>
                     <div className="flex flex-col items-center">
                        <span className="font-semibold text-sm">Meiosis</span>
                        <span className="text-xs text-muted-foreground">(4 Varied Cells)</span>
                    </div>
                </div>
            </div>
            <p className="absolute bottom-2 text-xs text-muted-foreground">Cell division creates new cells for growth and reproduction.</p>
        </div>
    );
};

// --- Type Definitions ---
type MitosisStage = 'Prophase' | 'Metaphase' | 'Anaphase' | 'Telophase';
type MitosisDescription = 'Chromosomes condense, spindle forms' | 'Chromosomes line up at the equator' | 'Sister chromatids pulled apart' | 'Nuclear membrane reforms';

const mitosisStages: MitosisStage[] = ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'];
const mitosisDescriptions: MitosisDescription[] = ['Chromosomes condense, spindle forms', 'Chromosomes line up at the equator', 'Sister chromatids pulled apart', 'Nuclear membrane reforms'];
const correctMitosisMatches: Record<MitosisStage, MitosisDescription> = {
    Prophase: 'Chromosomes condense, spindle forms',
    Metaphase: 'Chromosomes line up at the equator',
    Anaphase: 'Sister chromatids pulled apart',
    Telophase: 'Nuclear membrane reforms',
};


export function CellDivisionLab() {
    const { toast } = useToast();
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [simulationState, setSimulationState] = React.useState<{ type: 'mitosis' | 'meiosis', stage: number }>({ type: 'mitosis', stage: 0 });

    const [mcq1Answer, setMcq1Answer] = React.useState<string | undefined>();
    const [mcq1Feedback, setMcq1Feedback] = React.useState<string | null>(null);
    const [mcq1Attempts, setMcq1Attempts] = React.useState(0);
    const [mcq1IsCorrect, setMcq1IsCorrect] = React.useState<boolean | null>(null);

    const [mcq2Answer, setMcq2Answer] = React.useState<string | undefined>();
    const [mcq2Feedback, setMcq2Feedback] = React.useState<string | null>(null);
    const [mcq2Attempts, setMcq2Attempts] = React.useState(0);
    const [mcq2IsCorrect, setMcq2IsCorrect] = React.useState<boolean | null>(null);

    const [matchState, setMatchState] = React.useState<Record<string, MitosisDescription | ''>>({});
    const [matchFeedback, setMatchFeedback] = React.useState<string | null>(null);
    const [matchIsCorrect, setMatchIsCorrect] = React.useState<boolean | null>(null);
    
    const [pastWaecMcqAnswer, setPastWaecMcqAnswer] = React.useState<string | undefined>();
    const [pastWaecMcqFeedback, setPastWaecMcqFeedback] = React.useState<string | null>(null);
    const [pastWaecMcqAttempts, setPastWaecMcqAttempts] = React.useState(0);
    const [pastWaecMcqIsCorrect, setPastWaecMcqIsCorrect] = React.useState<boolean | null>(null);
    
    const mitosisStagesData = ['Prophase', 'Metaphase', 'Anaphase', 'Telophase', 'Result'];
    const meiosisStagesData = ['Meiosis I', 'Meiosis II', 'Result'];
    
    const handleNextStage = () => {
        setSimulationState(prev => {
            const maxStages = prev.type === 'mitosis' ? mitosisVisuals.length - 1 : meiosisVisuals.length - 1;
            const nextStageIndex = prev.stage < maxStages ? prev.stage + 1 : prev.stage;
            return { ...prev, stage: nextStageIndex };
        });
    };

     React.useEffect(() => {
        const { type, stage } = simulationState;
        const maxStages = type === 'mitosis' ? mitosisVisuals.length - 1 : meiosisVisuals.length - 1;
        if (stage === maxStages) {
            toast({ title: 'Simulation Complete', description: 'Reset the simulation to start again.' });
        }
    }, [simulationState, toast]);

    const handleResetSim = () => {
        setSimulationState(prev => ({ type: prev.type, stage: 0 }));
    };

    // Handlers
    const createRadioQuizHandler = (
        setAnswer: React.Dispatch<React.SetStateAction<string | undefined>>,
        setFeedback: React.Dispatch<React.SetStateAction<string | null>>,
        setAttempts: React.Dispatch<React.SetStateAction<number>>,
        setIsCorrect: React.Dispatch<React.SetStateAction<boolean | null>>,
        correctOption: string,
        correctFeedbackText: string,
        tryAgainFeedbackText: string,
        finalIncorrectFeedbackText: string
    ) => (answer: string | undefined, attempts: number, isCorrect: boolean | null) => {
        const handleSubmit = () => {
            if (isCorrect !== null) return;
            const isAnsCorrect = answer === correctOption;
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            if (isAnsCorrect) {
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
            if (isCorrect !== null || (attempts > 0 && isCorrect === null)) {
                if (!(attempts === 1 && isCorrect === null)) {
                    setAttempts(0);
                    setIsCorrect(null);
                    setFeedback(null);
                }
            }
        };
        return { handleSubmit, handleChange };
    };

    const mcq1Handler = createRadioQuizHandler(setMcq1Answer, setMcq1Feedback, setMcq1Attempts, setMcq1IsCorrect, 'b', 'Correct! Mitosis produces two identical daughter cells. ✅', 'Think about which process is for growth and repair. Try again! 🔄', 'Incorrect. The answer is Two identical daughter cells. 🧠');
    const mcq2Handler = createRadioQuizHandler(setMcq2Answer, setMcq2Feedback, setMcq2Attempts, setMcq2IsCorrect, 'c', 'Correct! Chromosomes align at the equator during Metaphase. ✅', 'Remember the "M" for Middle. Try again! 🔄', 'Incorrect. The answer is Metaphase. 🧠');
    const pastWaecMcqHandler = createRadioQuizHandler(setPastWaecMcqAnswer, setPastWaecMcqFeedback, setPastWaecMcqAttempts, setPastWaecMcqIsCorrect, 'c', 'Correct! Gametes (sex cells) are formed through meiosis. ✅', 'Gametes are for sexual reproduction. Which process is that? Try again! 🔄', 'Incorrect. Meiosis is the process for forming gametes. 🧠');
    
    const handleMatchChange = (stage: string, value: MitosisDescription) => {
        setMatchState(prev => ({...prev, [stage]: value}));
        if(matchIsCorrect !== null) {
            setMatchIsCorrect(null);
            setMatchFeedback(null);
        }
    };
    
    const checkMatch = () => {
        if(matchIsCorrect !== null) return;
        const allCorrect = mitosisStages.every(stage => matchState[stage] === correctMitosisMatches[stage]);
        if(allCorrect) {
            setMatchIsCorrect(true);
            setMatchFeedback("Perfect! All stages matched correctly. ✅");
        } else {
            setMatchIsCorrect(false);
            setMatchFeedback("Some are incorrect. Review the process and try again! 🧠");
        }
    };
    
    const allMatched = React.useMemo(() => Object.keys(matchState).length === mitosisStages.length, [matchState]);
    
    const objectivesText = "Describe the process of cell division through mitosis and meiosis. Differentiate between mitosis and meiosis based on phases, purpose, and outcome. Explain the importance of cell division in growth, repair, and reproduction.";
    const theoryText = "Cell division is a biological process where a parent cell divides into two or more daughter cells. The two major types are mitosis and meiosis. Mitosis occurs in somatic (body) cells and results in two identical daughter cells. It is used for growth, repair, and asexual reproduction. Meiosis occurs in reproductive cells and produces four non-identical daughter cells (gametes), each with half the number of chromosomes. It is essential for sexual reproduction. Each type goes through specific phases: Mitosis includes prophase, metaphase, anaphase, and telophase, followed by cytokinesis. Meiosis occurs in two stages — Meiosis I and Meiosis II — and involves homologous chromosomes pairing and exchanging genetic material, increasing genetic diversity.";
    const summaryText = "Mitosis results in 2 identical cells; meiosis results in 4 unique gametes. Mitosis is for growth and repair; meiosis is for reproduction. Mitosis has 1 division cycle; meiosis has 2. Crossing-over occurs in meiosis but not in mitosis.";
    
    const CurrentMitosisVisual = mitosisVisuals[simulationState.stage];
    const CurrentMeiosisVisual = meiosisVisuals[simulationState.stage];
    
    return (
        <div className="space-y-6">
             <InteractiveHeader />

             <Card>
                <CardHeader>
                     <div className="flex items-center justify-between">
                        <CardTitle>Objective</CardTitle>
                         <TextToSpeech
                            textToSpeak={objectivesText}
                            onSentenceChange={(i) => setHighlightInfo({ section: 'objectives', sentenceIndex: i })}
                            onStart={() => setHighlightInfo({ section: 'objectives', sentenceIndex: 0 })}
                            onEnd={() => setHighlightInfo(null)}
                            className="flex-shrink-0"
                        />
                    </div>
                    <CardDescription>
                         <HighlightedText text={objectivesText} sectionId="objectives" highlightedSentenceIndex={highlightInfo?.section === 'objectives' ? highlightInfo.sentenceIndex : null} />
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
                             <AccordionTrigger><div className="flex items-center gap-2"><BookOpen className="h-4 w-4"/><span>Background Theory</span></div></AccordionTrigger>
                             <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
                                <div className="flex-grow">
                                    <p><HighlightedText text={theoryText} sectionId="theory" highlightedSentenceIndex={highlightInfo?.section === 'theory' ? highlightInfo.sentenceIndex : null} /></p>
                                </div>
                                <TextToSpeech textToSpeak={theoryText} onSentenceChange={(i) => setHighlightInfo({ section: 'theory', sentenceIndex: i })} onStart={() => setHighlightInfo({ section: 'theory', sentenceIndex: 0 })} onEnd={() => setHighlightInfo(null)} className="flex-shrink-0"/>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Cell Division Viewer</CardTitle>
                    <CardDescription>Select a process and use the buttons to step through the stages.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={simulationState.type} onValueChange={(v) => setSimulationState({ type: v as 'mitosis' | 'meiosis', stage: 0 })} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="mitosis"><Users className="mr-2"/>Mitosis</TabsTrigger>
                            <TabsTrigger value="meiosis"><Dna className="mr-2"/>Meiosis</TabsTrigger>
                        </TabsList>
                        <TabsContent value="mitosis" className="mt-4">
                            <div className="p-4 bg-muted/30 rounded-lg flex flex-col items-center">
                                <h3 className="font-semibold text-lg mb-2">
                                    Stage: {mitosisStagesData[simulationState.stage]}
                                </h3>
                                <div className="min-h-[250px] w-full flex items-center justify-center">
                                    {CurrentMitosisVisual && <CurrentMitosisVisual />}
                                </div>
                            </div>
                        </TabsContent>
                         <TabsContent value="meiosis" className="mt-4">
                            <div className="p-4 bg-muted/30 rounded-lg flex flex-col items-center">
                                <h3 className="font-semibold text-lg mb-2">
                                    Stage: {meiosisStagesData[simulationState.stage]}
                                </h3>
                                <div className="min-h-[250px] w-full flex items-center justify-center">
                                    {CurrentMeiosisVisual && <CurrentMeiosisVisual />}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button variant="outline" onClick={handleResetSim}>Reset</Button>
                    <Button onClick={handleNextStage}>Next Stage</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Interactive Checks</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle className="text-base">Quiz 1</CardTitle><CardDescription>What is the end result of mitosis?</CardDescription></CardHeader>
                            <CardContent>
                                <RadioGroup onValueChange={mcq1Handler(mcq1Answer, mcq1Attempts, mcq1IsCorrect).handleChange} value={mcq1Answer} disabled={mcq1IsCorrect !== null}>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="mcq1-a" /><Label htmlFor="mcq1-a">Four gametes</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="b" id="mcq1-b" /><Label htmlFor="mcq1-b">Two identical daughter cells</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="c" id="mcq1-c" /><Label htmlFor="mcq1-c">Two varied cells</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="d" id="mcq1-d" /><Label htmlFor="mcq1-d">One large cell</Label></div>
                                </RadioGroup>
                                {mcq1Feedback && <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", mcq1IsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100", mcq1IsCorrect === null && "text-blue-700 bg-blue-100")}>{mcq1IsCorrect ? <CheckCircle/> : !mcq1IsCorrect && mcq1Attempts > 1 ? <XCircle/> : <RefreshCw className="animate-spin" />}{mcq1Feedback}</p>}
                            </CardContent>
                            <CardFooter><Button onClick={mcq1Handler(mcq1Answer, mcq1Attempts, mcq1IsCorrect).handleSubmit} disabled={!mcq1Answer || mcq1IsCorrect !== null}>Check</Button></CardFooter>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle className="text-base">Quiz 2</CardTitle><CardDescription>What occurs during metaphase?</CardDescription></CardHeader>
                            <CardContent>
                                <RadioGroup onValueChange={mcq2Handler(mcq2Answer, mcq2Attempts, mcq2IsCorrect).handleChange} value={mcq2Answer} disabled={mcq2IsCorrect !== null}>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="mcq2-a" /><Label htmlFor="mcq2-a">Chromosomes condense</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="b" id="mcq2-b" /><Label htmlFor="mcq2-b">Nuclear membrane reforms</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="c" id="mcq2-c" /><Label htmlFor="mcq2-c">Chromosomes align at the equator</Label></div>
                                     <div className="flex items-center space-x-2"><RadioGroupItem value="d" id="mcq2-d" /><Label htmlFor="mcq2-d">Chromatids separate</Label></div>
                                </RadioGroup>
                                {mcq2Feedback && <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", mcq2IsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100", mcq2IsCorrect === null && "text-blue-700 bg-blue-100")}>{mcq2IsCorrect ? <CheckCircle/> : !mcq2IsCorrect && mcq2Attempts > 1 ? <XCircle/> : <RefreshCw className="animate-spin" />}{mcq2Feedback}</p>}
                            </CardContent>
                            <CardFooter><Button onClick={mcq2Handler(mcq2Answer, mcq2Attempts, mcq2IsCorrect).handleSubmit} disabled={!mcq2Answer || mcq2IsCorrect !== null}>Check</Button></CardFooter>
                        </Card>
                         <Card>
                             <CardHeader><CardTitle className="text-base">Matching Game</CardTitle><CardDescription>Match the stage of mitosis to its description.</CardDescription></CardHeader>
                             <CardContent className="space-y-4">
                                 {mitosisStages.map(stage => (
                                     <div key={stage}>
                                         <Label htmlFor={`match-${stage}`}>{stage}:</Label>
                                         <Select onValueChange={(v) => handleMatchChange(stage, v as MitosisDescription)} value={matchState[stage] || ""}>
                                             <SelectTrigger id={`match-${stage}`}><SelectValue placeholder="Select description..."/></SelectTrigger>
                                             <SelectContent>{mitosisDescriptions.map(desc => <SelectItem key={desc} value={desc}>{desc}</SelectItem>)}</SelectContent>
                                         </Select>
                                     </div>
                                 ))}
                                 {matchFeedback && <p className={cn("mt-3 text-sm p-2 rounded-md text-center", matchIsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100")}>{matchIsCorrect ? <CheckCircle className="inline mr-1"/> : <XCircle className="inline mr-1"/>}{matchFeedback}</p>}
                             </CardContent>
                             <CardFooter><Button onClick={checkMatch} disabled={!allMatched || matchIsCorrect === true} size="sm">Check Matches</Button></CardFooter>
                         </Card>
                     </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Past WAEC Questions</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="space-y-6">
                        <Card>
                             <CardHeader><CardTitle className="text-base">WAEC May/June 2019 (MCQ)</CardTitle><CardDescription>Which of the following processes results in the formation of gametes?</CardDescription></CardHeader>
                             <CardContent>
                                <RadioGroup onValueChange={pastWaecMcqHandler(pastWaecMcqAnswer, pastWaecMcqAttempts, pastWaecMcqIsCorrect).handleChange} value={pastWaecMcqAnswer} disabled={pastWaecMcqIsCorrect !== null}>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="waec-a" /><Label htmlFor="waec-a">Binary fission</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="b" id="waec-b" /><Label htmlFor="waec-b">Mitosis</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="c" id="waec-c" /><Label htmlFor="waec-c">Meiosis</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="d" id="waec-d" /><Label htmlFor="waec-d">Budding</Label></div>
                                </RadioGroup>
                                 {pastWaecMcqFeedback && <p className={cn("mt-3 text-sm p-2 rounded-md", pastWaecMcqIsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100", pastWaecMcqIsCorrect === null && "text-blue-700 bg-blue-100")}>{pastWaecMcqIsCorrect ? <CheckCircle/> : !pastWaecMcqIsCorrect && pastWaecMcqAttempts > 1 ? <XCircle/> : <RefreshCw className="animate-spin" />}{pastWaecMcqFeedback}</p>}
                             </CardContent>
                            <CardFooter><Button onClick={pastWaecMcqHandler(pastWaecMcqAnswer, pastWaecMcqAttempts, pastWaecMcqIsCorrect).handleSubmit} disabled={!pastWaecMcqAnswer || pastWaecMcqIsCorrect !== null} size="sm">Check WAEC Question</Button></CardFooter>
                        </Card>
                        <EssayGrader
                            question="WAEC May/June 2017 – Paper 2 – Essay Q4: Differentiate between mitosis and meiosis under the following headings: (a) Number of division stages (b) Number of daughter cells produced (c) Genetic similarity of daughter cells (d) Site of occurrence in organisms (e) Significance"
                            gradingRubric="Award 1 mark for each correct comparison point under the five subheadings. Total = 5 marks."
                            modelAnswer="(a) Mitosis has one division; meiosis has two. (b) Mitosis produces 2 cells; meiosis produces 4. (c) Mitosis yields identical cells; meiosis yields genetically different cells. (d) Mitosis occurs in somatic cells; meiosis in reproductive cells. (e) Mitosis aids growth and repair; meiosis produces gametes for reproduction."
                        />
                     </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Summary</CardTitle>
                </CardHeader>
                 <CardContent className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground flex items-start gap-2">
                        <div className="flex-grow">
                             <p><HighlightedText text={summaryText} sectionId="summary" highlightedSentenceIndex={highlightInfo?.section === 'summary' ? highlightInfo.sentenceIndex : null} /></p>
                        </div>
                        <TextToSpeech textToSpeak={summaryText} onSentenceChange={(i) => setHighlightInfo({ section: 'summary', sentenceIndex: i })} onStart={() => setHighlightInfo({ section: 'summary', sentenceIndex: 0 })} onEnd={() => setHighlightInfo(null)} className="flex-shrink-0"/>
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
