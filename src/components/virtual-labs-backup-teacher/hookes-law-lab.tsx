
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Move, Scale } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

// --- Type Definitions ---
interface DataPoint {
    mass: number;
    force: number;
    extension: number;
}
type MassValue = 50 | 100 | 150 | 200 | 250;
const masses: MassValue[] = [50, 100, 150, 200, 250];

// --- Constants ---
const SPRING_CONSTANT_K = 0.5; // N/cm
const GRAVITY_g = 10; // m/s^2, simplified for easier calculations

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


// --- Visual Components ---
const SpringVisual = ({ extensionCm }: { extensionCm: number }) => {
    const baseHeight = 80; // px
    const stretchPerCm = 10; // px stretch per cm
    const totalHeight = baseHeight + (extensionCm * stretchPerCm);

    return (
        <div className="w-24 flex flex-col items-center">
            <div className="w-full h-2 bg-gray-500 rounded-t-lg" />
            <svg
                width="24"
                height={totalHeight}
                viewBox={`0 0 24 ${totalHeight}`}
                className="transition-all duration-500 ease-out"
            >
                <path
                    d={`M 12 0 
                       C 4 ${totalHeight * 0.1}, 20 ${totalHeight * 0.1}, 12 ${totalHeight * 0.2}
                       C 4 ${totalHeight * 0.3}, 20 ${totalHeight * 0.3}, 12 ${totalHeight * 0.4}
                       C 4 ${totalHeight * 0.5}, 20 ${totalHeight * 0.5}, 12 ${totalHeight * 0.6}
                       C 4 ${totalHeight * 0.7}, 20 ${totalHeight * 0.7}, 12 ${totalHeight * 0.8}
                       C 4 ${totalHeight * 0.9}, 20 ${totalHeight * 0.9}, 12 ${totalHeight}`}
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    className="text-gray-400"
                />
            </svg>
        </div>
    );
};

const MassBlock = ({ mass, onDragStart, onClick, isSelected }: { mass: MassValue; onDragStart: React.DragEventHandler; onClick: React.MouseEventHandler; isSelected: boolean }) => {
    const isMobile = useIsMobile();
    return (
        <div
            draggable={!isMobile}
            onDragStart={onDragStart}
            onClick={onClick}
            className={cn(
                "p-2 border bg-card rounded-lg flex items-center gap-2 text-sm shadow-md",
                isMobile ? "cursor-pointer" : "cursor-grab active:cursor-grabbing",
                isSelected && "ring-2 ring-accent"
            )}
        >
            <Move className="h-4 w-4 text-muted-foreground" />
            <Scale className="h-4 w-4 text-accent" />
            <span>{mass}g</span>
        </div>
    );
};

export function HookesLawLab() {
    const { toast } = useToast();
    const [data, setData] = React.useState<DataPoint[]>([]);
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [totalMass, setTotalMass] = React.useState(0);
    const [isSimulating, setIsSimulating] = React.useState(false);
    const [draggedMass, setDraggedMass] = React.useState<MassValue | null>(null);
    const [selectedMass, setSelectedMass] = React.useState<MassValue | null>(null);

    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);
    
    const isMobile = useIsMobile();
    
    const currentExtension = totalMass > 0 ? (totalMass / 1000 * GRAVITY_g) / SPRING_CONSTANT_K : 0;
    const currentForce = totalMass / 1000 * GRAVITY_g;

    const handleAddMass = (mass: MassValue) => {
        setIsSimulating(true);
        const newTotalMass = totalMass + mass;
        const force = newTotalMass / 1000 * GRAVITY_g;
        const extension = force / SPRING_CONSTANT_K;

        toast({ title: `Added ${mass}g mass...`, description: 'Observing new extension.' });

        setTimeout(() => {
            setTotalMass(newTotalMass);
            setData(prevData => [...prevData, { mass: newTotalMass, force: parseFloat(force.toFixed(2)), extension: parseFloat(extension.toFixed(2)) }].sort((a,b) => a.mass - b.mass));
            setIsSimulating(false);
            setSelectedMass(null);
        }, 1000);
    };

    const handleDragStart = (e: React.DragEvent, mass: MassValue) => {
        if (isMobile) return;
        setDraggedMass(mass);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = () => {
        if (draggedMass) {
            handleAddMass(draggedMass);
            setDraggedMass(null);
        }
    };
    
    const handleMobileSelect = (mass: MassValue) => {
        if (!isMobile) return;
        setSelectedMass(mass);
    };

    const handleSpringClick = () => {
        if (isMobile && selectedMass) {
            handleAddMass(selectedMass);
        }
    };

    const handleReset = () => {
        setData([]);
        setTotalMass(0);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setHighlightInfo(null);
        toast({ title: "Lab Reset", description: "Ready for a new experiment." });
    };
    
    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === '0.5';
        setQuizAttempts(prev => prev + 1);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! The spring constant k = Force / extension = 2N / 4cm = 0.5 N/cm. ✅");
        } else {
            if (quizAttempts < 1) {
                setQuizFeedback("Not quite. Remember, k = F / x. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. The spring constant k = 2N / 4cm = 0.5 N/cm. 🧠");
            }
        }
    };
    
    const handleGenerateReport = () => {
        if (data.length === 0) {
            toast({ title: "No data collected", variant: "destructive" });
            return;
        }
        const kValues = data.map(d => d.force / d.extension);
        const avgK = kValues.reduce((a, b) => a + b, 0) / kValues.length;
        toast({
            title: "Lab Report Generated",
            description: `You collected ${data.length} data points. The average calculated spring constant was approximately ${avgK.toFixed(2)} N/cm, confirming a linear relationship between force and extension as stated by Hooke's Law.`,
            duration: 9000
        });
    };
    
    const objectiveText = "To determine the relationship between the force applied to a spring and its extension, and to verify Hooke's Law (F = kx).";
    const theoryText = "Hooke's Law states that the force (F) needed to extend or compress a spring by some distance (x) is directly proportional to that distance. The formula is F = kx, where 'k' is the spring constant, a measure of the spring's stiffness. The negative sign in F = -kx indicates that the restoring force is in the opposite direction of the displacement. In this experiment, we will apply a force (via mass) and measure the resulting extension.";
    const safetyText = "In a real laboratory setting, always wear safety goggles. Be careful not to overload the spring, as this can cause it to exceed its elastic limit and deform permanently or snap, which can be dangerous.";

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
                        <AccordionItem value="theory"><AccordionTrigger><BookOpen className="h-4 w-4 mr-2" />Background Theory</AccordionTrigger>
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
                        <AccordionItem value="safety"><AccordionTrigger><Shield className="h-4 w-4 mr-2" />Safety Precautions</AccordionTrigger>
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
                    <CardDescription>{isMobile ? 'Tap a mass, then tap the spring area to add it.' : 'Drag a mass block and drop it onto the spring.'}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-4">
                        <p className="font-semibold">Available Masses:</p>
                        <div className="flex flex-wrap gap-2">
                            {masses.map(mass => (
                                <MassBlock key={mass} mass={mass} onDragStart={(e) => handleDragStart(e, mass)} onClick={() => handleMobileSelect(mass)} isSelected={selectedMass === mass} />
                            ))}
                        </div>
                    </div>
                     <div className="md:col-span-2 min-h-[350px] bg-muted/30 rounded-lg p-4 flex flex-col items-center justify-center" onDragOver={handleDragOver} onDrop={handleDrop} onClick={handleSpringClick}>
                        <div className="flex w-full items-start justify-center gap-8">
                            {/* Spring Column */}
                            <div className="relative flex flex-col items-center">
                                {/* The spring itself */}
                                <SpringVisual extensionCm={currentExtension} />
                                
                                {/* The mass block attached to the spring */}
                                <div
                                    className="absolute top-0 left-1/2 transition-all duration-500 ease-out"
                                    style={{
                                        transform: `translate(-50%, ${80 + currentExtension * 10}px)`,
                                        opacity: totalMass > 0 && !isSimulating ? 1 : 0,
                                    }}
                                >
                                     <div className="w-12 h-10 bg-gray-700 dark:bg-gray-600 rounded-md shadow-lg flex flex-col items-center justify-center p-1">
                                         <Scale className="h-3 w-3 text-white/70" />
                                         <span className="text-white font-bold text-xs">{totalMass}g</span>
                                     </div>
                                </div>
                            </div>

                            {/* Data Display Column */}
                            <div className="pt-8">
                                <p className="text-sm font-medium">Extension (x): <span className="font-bold text-accent">{currentExtension.toFixed(2)} cm</span></p>
                                <p className="text-sm font-medium">Force (F = mg): <span className="font-bold text-accent">{currentForce.toFixed(2)} N</span></p>
                            </div>
                        </div>
                        {isSimulating && <RefreshCw className="h-6 w-6 text-primary animate-spin my-4" />}
                    </div>
                </CardContent>
                 <CardFooter className="justify-center">
                    <Button variant="outline" onClick={handleReset}>Reset Experiment</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader><CardTitle>Data & Graph</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Table>
                        <TableHeader><TableRow><TableHead>Mass (g)</TableHead><TableHead>Force (N)</TableHead><TableHead>Extension (cm)</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {data.map((point, index) => (
                                <TableRow key={index}><TableCell>{point.mass}</TableCell><TableCell>{point.force}</TableCell><TableCell>{point.extension}</TableCell></TableRow>
                            ))}
                             {data.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No data yet.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="extension" type="number" name="Extension" unit="cm" domain={[0, 'dataMax + 1']} />
                                <YAxis dataKey="force" type="number" name="Force" unit="N" domain={[0, 'dataMax + 0.5']} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend />
                                <Line type="monotone" dataKey="force" stroke="#8884d8" activeDot={{ r: 8 }} name="Force (N)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Post-Lab Quiz</CardTitle></CardHeader>
                <CardContent>
                    <p className="mb-2 font-medium">If a force of 2 N causes a spring to extend by 4 cm, what is the spring constant (k)?</p>
                     <RadioGroup value={quizAnswer} onValueChange={(v) => {setQuizAnswer(v); if(quizIsCorrect !== null) { setQuizIsCorrect(null); setQuizAttempts(0); setQuizFeedback(null); }}}>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="0.5" id="q-0.5"/><Label htmlFor="q-0.5">0.5 N/cm</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="2" id="q-2"/><Label htmlFor="q-2">2 N/cm</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="8" id="q-8"/><Label htmlFor="q-8">8 N/cm</Label></div>
                     </RadioGroup>
                     {quizFeedback && <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", quizIsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100", quizIsCorrect === null && "text-blue-700 bg-blue-100")}>{quizIsCorrect ? <CheckCircle/> : quizAttempts > 1 ? <XCircle/> : <RefreshCw className="animate-spin"/>}{quizFeedback}</p>}
                </CardContent>
                 <CardFooter><Button onClick={handleQuizSubmit} disabled={!quizAnswer || quizIsCorrect !== null}>Check Answer</Button></CardFooter>
            </Card>
            
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
