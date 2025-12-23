
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, FlaskConical, Droplets, Filter, Flame, ArrowRight, Beaker, BookOpen, Shield, Move, Wind } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

// --- Reusable SVG Icons ---
const FilterFunnelIcon = ({ isFiltered, residuePresent }: { isFiltered: boolean, residuePresent: boolean }) => (
    <div className="relative w-24 h-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-gray-200/50 dark:bg-gray-800/50" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}/>
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[72px] h-[72px] bg-white dark:bg-gray-300" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 50%)' }} />
        {residuePresent && <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-4 bg-orange-900/50 rounded-full" />}
        {isFiltered && <Droplets className="absolute top-20 left-1/2 -translate-x-1/2 h-5 w-5 text-blue-400 animate-pulse" />}
    </div>
);

const EvaporatingDishIcon = ({ isEvaporated, hasLiquid }: { isEvaporated: boolean, hasLiquid: boolean }) => (
    <div className="relative w-32 h-16">
        <div className="absolute bottom-0 w-full h-12 bg-gray-200/50 dark:bg-gray-700/50 rounded-t-full border-2 border-gray-300 dark:border-gray-600" />
        {hasLiquid && !isEvaporated && <div className="absolute bottom-1 w-full h-8 bg-blue-400/30 rounded-t-full" />}
        {isEvaporated && (
            <div className="absolute inset-x-4 bottom-1 flex justify-center gap-1.5 flex-wrap p-1">
                {Array.from({length: 12}).map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-white/90 rounded-full shadow-sm" />)}
            </div>
        )}
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


export function SeparationTechniquesLab() {
    const { toast } = useToast();
    const [draggedItem, setDraggedItem] = React.useState<string | null>(null);
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');

    // Stage states
    const [muddyWaterDropped, setMuddyWaterDropped] = React.useState(false);
    const [saltWaterDropped, setSaltWaterDropped] = React.useState(false);
    const [isHeated, setIsHeated] = React.useState(false);
    const [isDecanted, setIsDecanted] = React.useState(false);
    const [isSimulating, setIsSimulating] = React.useState(false);

    // Quiz states
    const [filtrationQuiz, setFiltrationQuiz] = React.useState<{ answer?: string; isCorrect?: boolean | null }>({});
    const [evaporationQuiz, setEvaporationQuiz] = React.useState<{ answer?: string; isCorrect?: boolean | null }>({});
    const [decantationQuiz, setDecantationQuiz] = React.useState<{ answer?: string; isCorrect?: boolean | null }>({});
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: string) => setDraggedItem(item);
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDragEnd = () => setDraggedItem(null);

    const handleDrop = (target: 'funnel' | 'dish') => {
        if (target === 'funnel' && draggedItem === 'muddyWater') {
            setMuddyWaterDropped(true);
            toast({ title: "Filtration Complete", description: "Clean water has passed through." });
        }
        if (target === 'dish' && draggedItem === 'saltWater') {
            setSaltWaterDropped(true);
            toast({ title: "Ready for Heating", description: "Salt water is in the dish. Now apply heat." });
        }
        setDraggedItem(null);
    };

    const handleHeat = () => {
        if (!saltWaterDropped) {
            toast({ title: "Setup Incomplete", description: "Please drag the salt water into the dish first.", variant: 'destructive'});
            return;
        }
        setIsSimulating(true);
        setTimeout(() => {
            setIsHeated(true);
            toast({ title: "Evaporation Complete", description: "Salt crystals have formed." });
            setIsSimulating(false);
        }, 2000);
    };
    
    const handleDecant = () => setIsDecanted(true);

    const handleQuizSubmit = (quiz: 'filtration' | 'evaporation' | 'decantation') => {
        if (quiz === 'filtration') {
            const isCorrect = filtrationQuiz.answer === 'insoluble';
            setFiltrationQuiz(prev => ({ ...prev, isCorrect }));
        } else if (quiz === 'evaporation') {
            const isCorrect = evaporationQuiz.answer === 'boiling';
            setEvaporationQuiz(prev => ({ ...prev, isCorrect }));
        } else if (quiz === 'decantation') {
            const isCorrect = decantationQuiz.answer === 'density';
            setDecantationQuiz(prev => ({ ...prev, isCorrect }));
        }
    };
    
    const handleReset = () => {
        setMuddyWaterDropped(false);
        setSaltWaterDropped(false);
        setIsHeated(false);
        setIsDecanted(false);
        setFiltrationQuiz({});
        setEvaporationQuiz({});
        setDecantationQuiz({});
        setDraggedItem(null);
        setIsSimulating(false);
        setHighlightInfo(null);
        toast({ title: "Lab Reset" });
    };

    const handleGenerateReport = () => {
        toast({
            title: "Lab Report Generated (Simulation)",
            description: "You have successfully simulated filtration, evaporation, and decantation.",
        });
    };
    
    const objectiveText = "To demonstrate common physical separation techniques including filtration, evaporation, and decantation.";
    const theoryText = "Separation techniques are physical methods used to separate a mixture into its individual components. Filtration separates an insoluble solid from a liquid using a filter medium that allows the liquid to pass but not the solid. Evaporation separates a soluble solid from a liquid by heating the solution to remove the liquid as vapor, leaving the solid behind. Decantation carefully pours off a liquid from a solid or another immiscible liquid that has settled at the bottom.";
    const safetyText = "In a real lab, always wear safety goggles. Handle hot evaporating dishes with tongs. Be careful when pouring liquids to avoid spills. Dispose of separated materials as instructed by your teacher.";


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
                    <CardDescription>Background theory and safety tips for these techniques.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="theory">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /><span>Background Theory</span></div>
                            </AccordionTrigger>
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
                            <AccordionTrigger>
                                <div className="flex items-center gap-2"><Shield className="h-4 w-4" /><span>Safety Precautions</span></div>
                            </AccordionTrigger>
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


            <Tabs defaultValue="filtration" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-auto">
                    <TabsTrigger value="filtration">Filtration</TabsTrigger>
                    <TabsTrigger value="evaporation">Evaporation</TabsTrigger>
                    <TabsTrigger value="decantation">Decantation</TabsTrigger>
                </TabsList>

                <TabsContent value="filtration">
                    <Card><CardHeader><CardTitle className="text-lg">Filtration</CardTitle><CardDescription>Separating an insoluble solid (mud) from a liquid (water).</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 min-h-[300px]">
                            {!muddyWaterDropped && (
                                <div className="text-center">
                                    <div draggable onDragStart={(e) => handleDragStart(e, 'muddyWater')} className="cursor-grab p-2 border rounded-lg bg-card active:cursor-grabbing"><Beaker className="h-20 w-20 text-orange-900/50" /><p className="text-xs">Muddy Water</p></div>
                                </div>
                            )}
                            <ArrowRight className="h-8 w-8 text-muted-foreground hidden md:block" />
                            <div onDrop={() => handleDrop('funnel')} onDragOver={handleDragOver} className={cn("p-2 border-2 border-dashed rounded-lg flex flex-col items-center", draggedItem === 'muddyWater' && "border-accent")}>
                                {!muddyWaterDropped && <p className="text-sm text-muted-foreground p-8">Drag beaker here</p>}
                                {muddyWaterDropped && (
                                    <>
                                        <FilterFunnelIcon isFiltered={muddyWaterDropped} residuePresent={muddyWaterDropped} />
                                        <div className="relative h-20 w-20">
                                            <Beaker className="h-full w-full text-blue-400/50" />
                                            <div className="absolute bottom-0 left-0 w-full rounded-b-lg bg-blue-400 transition-all duration-1000" style={{ height: '50%' }}/>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        {muddyWaterDropped && <p className="text-center font-semibold text-green-600">Filtration complete! Residue is on the filter paper, filtrate is in the beaker.</p>}
                        <div className="mt-4 border-t pt-4">
                            <p className="font-medium">Quiz: Which type of mixture is best separated by filtration?</p>
                            <RadioGroup onValueChange={(v) => setFiltrationQuiz(prev => ({ ...prev, answer: v }))} value={filtrationQuiz.answer}><div className="flex items-center space-x-2"><RadioGroupItem value="insoluble" id="f-q1"/><Label htmlFor="f-q1">Insoluble solid in a liquid</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="soluble" id="f-q2"/><Label htmlFor="f-q2">Soluble solid in a liquid</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="liquids" id="f-q3"/><Label htmlFor="f-q3">Two liquids</Label></div></RadioGroup>
                            {filtrationQuiz.isCorrect === true && <p className="text-green-600 text-sm mt-2">Correct!</p>}
                            {filtrationQuiz.isCorrect === false && <p className="text-red-600 text-sm mt-2">Incorrect.</p>}
                            <Button onClick={() => handleQuizSubmit('filtration')} size="sm" variant="outline" className="mt-2" disabled={!filtrationQuiz.answer || filtrationQuiz.isCorrect !== undefined}>Check</Button>
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="evaporation">
                    <Card><CardHeader><CardTitle className="text-lg">Evaporation</CardTitle><CardDescription>Separating a soluble solid (salt) from a liquid (water).</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 min-h-[300px]">
                             {!saltWaterDropped && (
                                <div className="text-center">
                                    <div draggable onDragStart={(e) => handleDragStart(e, 'saltWater')} className="cursor-grab p-2 border rounded-lg bg-card active:cursor-grabbing"><Beaker className="h-20 w-20 text-blue-400/50" /><p className="text-xs">Salt Water</p></div>
                                </div>
                            )}
                            <ArrowRight className="h-8 w-8 text-muted-foreground hidden md:block" />
                            <div onDrop={() => handleDrop('dish')} onDragOver={handleDragOver} className={cn("p-2 border-2 border-dashed rounded-lg flex flex-col items-center", draggedItem === 'saltWater' && "border-accent")}>
                                {!saltWaterDropped && <p className="text-sm text-muted-foreground p-8">Drag beaker here</p>}
                                {saltWaterDropped && (
                                    <>
                                        <EvaporatingDishIcon isEvaporated={isHeated} hasLiquid={saltWaterDropped}/>
                                        {isSimulating && <div className="absolute top-0 flex flex-col items-center"><Wind className="h-6 w-6 text-gray-400/50 animate-pulse" style={{animationDelay: '0.2s'}}/><Wind className="h-6 w-6 text-gray-400/50 animate-pulse" style={{animationDelay: '0.4s'}}/></div>}
                                        <Flame className={cn("h-8 w-8 mt-2", isSimulating ? "text-red-500 animate-pulse" : "text-gray-400")} />
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="text-center"><Button onClick={handleHeat} disabled={isHeated || !saltWaterDropped || isSimulating}>{isSimulating ? 'Heating...' : (isHeated ? 'Completed' : 'Apply Heat')}</Button></div>
                        {isHeated && <p className="text-center font-semibold text-green-600">Evaporation complete! Salt crystals remain.</p>}
                        <div className="mt-4 border-t pt-4">
                            <p className="font-medium">Quiz: Evaporation works because of differences in...?</p>
                             <RadioGroup onValueChange={(v) => setEvaporationQuiz(prev => ({ ...prev, answer: v }))} value={evaporationQuiz.answer}><div className="flex items-center space-x-2"><RadioGroupItem value="density" id="e-q1"/><Label htmlFor="e-q1">Density</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="boiling" id="e-q2"/><Label htmlFor="e-q2">Boiling points</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="color" id="e-q3"/><Label htmlFor="e-q3">Color</Label></div></RadioGroup>
                            {evaporationQuiz.isCorrect === true && <p className="text-green-600 text-sm mt-2">Correct!</p>}
                            {evaporationQuiz.isCorrect === false && <p className="text-red-600 text-sm mt-2">Incorrect.</p>}
                            <Button onClick={() => handleQuizSubmit('evaporation')} size="sm" variant="outline" className="mt-2" disabled={!evaporationQuiz.answer || evaporationQuiz.isCorrect !== undefined}>Check</Button>
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="decantation">
                     <Card><CardHeader><CardTitle className="text-lg">Decantation</CardTitle><CardDescription>Separating immiscible liquids with different densities (e.g., oil and water).</CardDescription></CardHeader>
                     <CardContent className="space-y-4 text-center">
                        <div className="flex items-center justify-center min-h-[300px] gap-8">
                           <div className={cn("relative w-32 h-48 border-2 border-gray-400 rounded-lg p-1 transition-transform duration-700", isDecanted && "rotate-[-45deg]")}>
                                <div className="absolute top-0 left-0 w-full h-1/2 bg-yellow-400/50 rounded-t-lg"></div>
                                <div className={cn("absolute bottom-0 left-0 w-full h-1/2 bg-blue-400/50 rounded-b-lg transition-all duration-700", isDecanted && "h-0")}></div>
                                {isDecanted && <div className="absolute bottom-[-2rem] left-[-2rem] w-12 h-8 bg-blue-400/50 rounded-lg -rotate-12 transition-opacity duration-500"></div>}
                           </div>
                           <div className="relative w-32 h-48 border-2 border-gray-400 rounded-lg p-1">
                                <div className={cn("absolute bottom-0 left-0 w-full bg-blue-400/50 rounded-lg transition-all duration-1000", isDecanted ? "h-1/2" : "h-0")}></div>
                           </div>
                        </div>
                        <Button onClick={handleDecant} disabled={isDecanted}>Tilt to Pour</Button>
                        {isDecanted && <p className="font-semibold text-green-600">Decantation complete! The denser liquid (water) has been poured into the second beaker.</p>}
                        <div className="mt-4 border-t pt-4">
                            <p className="font-medium">Quiz: What property allows decantation to work?</p>
                             <RadioGroup onValueChange={(v) => setDecantationQuiz(prev => ({ ...prev, answer: v }))} value={decantationQuiz.answer}><div className="flex items-center space-x-2"><RadioGroupItem value="density" id="d-q1"/><Label htmlFor="d-q1">Density</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="solubility" id="d-q2"/><Label htmlFor="d-q2">Solubility</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="color" id="d-q3"/><Label htmlFor="d-q3">Color</Label></div></RadioGroup>
                            {decantationQuiz.isCorrect === true && <p className="text-green-600 text-sm mt-2">Correct!</p>}
                            {decantationQuiz.isCorrect === false && <p className="text-red-600 text-sm mt-2">Incorrect.</p>}
                            <Button onClick={() => handleQuizSubmit('decantation')} size="sm" variant="outline" className="mt-2" disabled={!decantationQuiz.answer || decantationQuiz.isCorrect !== undefined}>Check</Button>
                        </div>
                     </CardContent></Card>
                </TabsContent>
            </Tabs>

            <Card>
                <CardHeader><CardTitle>Real-Life Applications</CardTitle></CardHeader>
                <CardContent><ul className="list-disc pl-5 text-muted-foreground"><li><strong>Filtration:</strong> Water purifiers, coffee makers.</li><li><strong>Evaporation:</strong> Salt production from sea water, drying clothes.</li><li><strong>Decantation:</strong> Separating oil from water in cooking.</li></ul></CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Lab Report</CardTitle></CardHeader>
                <CardFooter>
                    <Button variant="secondary" onClick={handleGenerateReport}>Generate Report</Button>
                    <Button variant="outline" onClick={handleReset} className="ml-4">Reset Lab</Button>
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
