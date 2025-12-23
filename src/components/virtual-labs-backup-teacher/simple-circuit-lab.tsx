
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Lightbulb, Battery, Zap, BookOpen, Shield, CheckCircle, XCircle, RefreshCw, Power } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Slider } from '../ui/slider';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

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


// --- Reusable SVG Components for Circuit ---

const BatteryIcon = () => <Battery className="h-16 w-16 text-accent" />;
const BulbIcon = ({ isLit, brightness = 1 }: { isLit: boolean; brightness?: number; }) => (
    <div className="flex flex-col items-center">
        <Lightbulb style={{ opacity: isLit ? brightness : 0.4 }} className={cn(
            "h-12 w-12 transition-all duration-300",
            isLit ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,1)]" : "text-muted-foreground"
        )} />
        <span className="text-xs mt-1">{isLit ? 'On' : 'Off'}</span>
    </div>
);
const ResistorIcon = () => (
    <svg viewBox="0 0 100 20" className="h-8 w-24">
        <path d="M0 10 H20 L25 5 L35 15 L45 5 L55 15 L65 5 L75 15 L80 10 H100" stroke="currentColor" fill="none" strokeWidth="2" className="text-muted-foreground" />
    </svg>
);


export function SimpleCircuitLab() {
    const { toast } = useToast();
    
    // Level 1 State
    const [isLevel1SwitchOn, setIsLevel1SwitchOn] = React.useState(false);
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');

    // Level 2 State
    const [isLevel2SwitchOn, setIsLevel2SwitchOn] = React.useState(false);
    const [resistance, setResistance] = React.useState(50); // From 0 to 100
    
    // Level 3 State
    const [isSeriesOn, setIsSeriesOn] = React.useState(false);
    const [isParallelOn, setIsParallelOn] = React.useState(false);
    const [isSeriesBulbBroken, setIsSeriesBulbBroken] = React.useState(false);
    const [isParallelBulbBroken, setIsParallelBulbBroken] = React.useState(false);
    
    // Quiz State
    const [quizAnswer1, setQuizAnswer1] = React.useState<string | undefined>();
    const [quizFeedback1, setQuizFeedback1] = React.useState<string | null>(null);
    const [quizAttempts1, setQuizAttempts1] = React.useState(0);
    const [quizIsCorrect1, setQuizIsCorrect1] = React.useState<boolean | null>(null);

    const [quizAnswer2, setQuizAnswer2] = React.useState<string | undefined>();
    const [quizFeedback2, setQuizFeedback2] = React.useState<string | null>(null);
    const [quizAttempts2, setQuizAttempts2] = React.useState(0);
    const [quizIsCorrect2, setQuizIsCorrect2] = React.useState<boolean | null>(null);
    
    // Highlight state
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    const handleQuiz1Submit = () => {
        if (quizIsCorrect1 !== null) return;
        const isCorrect = quizAnswer1 === 'a';
        const newAttempts = quizAttempts1 + 1;
        setQuizAttempts1(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect1(true);
            setQuizFeedback1("Correct! A closed circuit provides a complete path. ✅");
        } else {
            if (newAttempts === 1) { setQuizFeedback1("Think about what's needed for current to flow. Try again! 🔄"); } 
            else { setQuizIsCorrect1(false); setQuizFeedback1("Incorrect. A closed circuit is required. 🧠"); }
        }
    };
    
    const handleQuiz2Submit = () => {
        if (quizIsCorrect2 !== null) return;
        const isCorrect = quizAnswer2 === 'b';
        const newAttempts = quizAttempts2 + 1;
        setQuizAttempts2(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect2(true);
            setQuizFeedback2("Correct! In a parallel circuit, other bulbs stay lit. ✅");
        } else {
            if (newAttempts === 1) { setQuizFeedback2("Which circuit has multiple paths? Try again! 🔄"); } 
            else { setQuizIsCorrect2(false); setQuizFeedback2("Incorrect. Parallel circuits keep working. 🧠"); }
        }
    };
    
    const bulbBrightness = 1 - (resistance / 120); // Scale brightness from 0 to 1 based on resistance
    
    const handleGenerateReport = () => {
        toast({
            title: "Lab Report Generated (Simulation)",
            description: "You have explored basic, resistor-based, series, and parallel circuits.",
        });
    };
    
    const handleReset = () => {
        setIsLevel1SwitchOn(false);
        setIsLevel2SwitchOn(false);
        setResistance(50);
        setIsSeriesOn(false);
        setIsParallelOn(false);
        setIsSeriesBulbBroken(false);
        setIsParallelBulbBroken(false);
        setQuizAnswer1(undefined);
        setQuizFeedback1(null);
        setQuizAttempts1(0);
        setQuizIsCorrect1(null);
        setQuizAnswer2(undefined);
        setQuizFeedback2(null);
        setQuizAttempts2(0);
        setQuizIsCorrect2(null);
        setHighlightInfo(null);
        toast({ title: 'Lab Reset' });
    };
    
    const objectiveText = "To understand how electricity flows in different circuit configurations and the effect of components like resistors.";
    const theoryText = "An electric circuit is a path for current. Key concepts include: Closed Circuit, which is an unbroken path allowing current to flow. Resistor, a component that resists the flow of current, often converting electrical energy to heat. Series Circuit, where components are connected in a single path. If one breaks, the circuit is open. Parallel Circuit, where components are connected in multiple paths. If one path breaks, others can still function.";
    const safetyText = "In a real lab: Never use high-voltage sources without supervision. Ensure hands are dry when handling components. Resistors and bulbs can get very hot.";

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
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger><BookOpen className="h-4 w-4 mr-2" />Background Theory</AccordionTrigger>
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
                         <AccordionItem value="item-2">
                            <AccordionTrigger><Shield className="h-4 w-4 mr-2" />Safety Precautions</AccordionTrigger>
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
                    <CardTitle>Circuit Builder</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="level1" className="w-full">
                        <TabsList className="grid w-full h-auto grid-cols-1 sm:grid-cols-3 gap-2">
                            <TabsTrigger value="level1">Level 1: Basic</TabsTrigger>
                            <TabsTrigger value="level2">Level 2: Resistor</TabsTrigger>
                            <TabsTrigger value="level3">Level 3: Series/Parallel</TabsTrigger>
                        </TabsList>
                        
                        {/* Level 1 Content */}
                        <TabsContent value="level1" className="mt-4">
                            <Card className="bg-muted/30">
                                <CardHeader><CardDescription>Use the switch to see a basic circuit in action.</CardDescription></CardHeader>
                                <CardContent className="flex flex-col items-center justify-center gap-4 min-h-[250px]">
                                    <BulbIcon isLit={isLevel1SwitchOn} />
                                    <div className="flex items-center space-x-2"><Label>Off</Label><Switch checked={isLevel1SwitchOn} onCheckedChange={setIsLevel1SwitchOn} /><Label>On</Label></div>
                                    <BatteryIcon />
                                    <p className="font-semibold">{isLevel1SwitchOn ? "Circuit is CLOSED" : "Circuit is OPEN"}</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Level 2 Content */}
                        <TabsContent value="level2" className="mt-4">
                           <Card className="bg-muted/30">
                                <CardHeader><CardDescription>Use the slider to change the resistance and observe the bulb's brightness.</CardDescription></CardHeader>
                                <CardContent className="flex flex-col items-center justify-center gap-6 min-h-[250px]">
                                    <BulbIcon isLit={isLevel2SwitchOn} brightness={bulbBrightness} />
                                    <div className="w-full max-w-xs flex flex-col items-center gap-2">
                                        <div className="flex items-center gap-4">
                                            <ResistorIcon />
                                            <div className="flex items-center space-x-2"><Label>Off</Label><Switch checked={isLevel2SwitchOn} onCheckedChange={setIsLevel2SwitchOn} /><Label>On</Label></div>
                                        </div>
                                        <Slider value={[resistance]} onValueChange={(v) => setResistance(v[0])} max={100} step={1} className="w-[80%]" />
                                        <Label className="text-xs">{resistance} Ω Resistance</Label>
                                    </div>
                                    <BatteryIcon />
                                </CardContent>
                           </Card>
                        </TabsContent>

                        {/* Level 3 Content */}
                        <TabsContent value="level3" className="mt-4">
                             <div className="grid md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Series Circuit</CardTitle>
                                        <CardDescription className="text-xs">A single path for current.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center justify-center gap-4 min-h-[250px] p-4">
                                        <div className="flex items-center gap-2">
                                            <BatteryIcon />
                                            <div className="w-4 h-1 bg-muted-foreground"></div>
                                            <BulbIcon isLit={isSeriesOn && !isSeriesBulbBroken} />
                                            <div className="w-4 h-1 bg-muted-foreground"></div>
                                            <BulbIcon isLit={isSeriesOn && !isSeriesBulbBroken} />
                                            <div className="w-4 h-1 bg-muted-foreground"></div>
                                            <div className="flex flex-col items-center gap-1">
                                                <Switch checked={isSeriesOn} onCheckedChange={setIsSeriesOn} id="series-switch" />
                                                <Label htmlFor="series-switch" className="text-xs">Switch</Label>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="destructive" onClick={() => setIsSeriesBulbBroken(!isSeriesBulbBroken)}>{isSeriesBulbBroken ? 'Fix Bulb' : 'Break Bulb 1'}</Button>
                                        {isSeriesOn && isSeriesBulbBroken && <p className="text-xs text-red-500 font-medium text-center">The entire circuit is broken because there is only one path.</p>}
                                    </CardContent>
                                </Card>
                                 <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Parallel Circuit</CardTitle>
                                        <CardDescription className="text-xs">Multiple paths for current.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center justify-center gap-4 min-h-[250px] p-4">
                                        <div className="flex items-center gap-4">
                                            <BatteryIcon />
                                            <div className="w-2 h-16 bg-muted-foreground"></div>
                                            <div className="flex flex-col gap-2">
                                                {/* Top Branch */}
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-1 bg-muted-foreground"></div>
                                                    <BulbIcon isLit={isParallelOn && !isParallelBulbBroken} />
                                                    <div className="w-4 h-1 bg-muted-foreground"></div>
                                                </div>
                                                {/* Bottom Branch */}
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-1 bg-muted-foreground"></div>
                                                    <BulbIcon isLit={isParallelOn} />
                                                    <div className="w-4 h-1 bg-muted-foreground"></div>
                                                </div>
                                            </div>
                                            <div className="w-2 h-16 bg-muted-foreground"></div>
                                             <div className="flex flex-col items-center gap-1">
                                                <Switch checked={isParallelOn} onCheckedChange={setIsParallelOn} id="parallel-switch" />
                                                <Label htmlFor="parallel-switch" className="text-xs">Switch</Label>
                                             </div>
                                        </div>
                                        <Button size="sm" variant="destructive" onClick={() => setIsParallelBulbBroken(!isParallelBulbBroken)}>{isParallelBulbBroken ? 'Fix Bulb' : 'Break Bulb 1'}</Button>
                                         {isParallelOn && isParallelBulbBroken && <p className="text-xs text-green-600 font-medium text-center">The second bulb stays lit because it has its own path.</p>}
                                    </CardContent>
                                </Card>
                             </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                 <CardFooter>
                    <Button variant="outline" onClick={handleReset} className="w-full">Reset All Levels</Button>
                </CardFooter>
            </Card>
            
             <Card>
                <CardHeader><CardTitle>Post-Lab Quiz</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <p className="mb-2 font-medium">1. For a bulb to light up, the circuit must be...</p>
                        <RadioGroup value={quizAnswer1} onValueChange={(v) => {setQuizAnswer1(v); setQuizIsCorrect1(null); setQuizAttempts1(0); setQuizFeedback1(null);}} disabled={quizIsCorrect1 !== null}>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="q1-a"/><Label htmlFor="q1-a">A closed circuit</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="b" id="q1-b"/><Label htmlFor="q1-b">An open circuit</Label></div>
                             <div className="flex items-center space-x-2"><RadioGroupItem value="c" id="q1-c"/><Label htmlFor="q1-c">A short circuit</Label></div>
                        </RadioGroup>
                         {quizFeedback1 && <p className={cn("mt-2 text-sm flex items-center gap-2", quizIsCorrect1 ? "text-green-600" : "text-red-600")}>{quizIsCorrect1 ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {quizFeedback1}</p>}
                         <Button onClick={handleQuiz1Submit} size="sm" variant="outline" className="mt-2" disabled={!quizAnswer1 || quizIsCorrect1 !== null}>Check Q1</Button>
                    </div>
                     <div>
                        <p className="mb-2 font-medium">2. In which circuit do other bulbs stay lit if one breaks?</p>
                        <RadioGroup value={quizAnswer2} onValueChange={(v) => {setQuizAnswer2(v); setQuizIsCorrect2(null); setQuizAttempts2(0); setQuizFeedback2(null);}} disabled={quizIsCorrect2 !== null}>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="q2-a"/><Label htmlFor="q2-a">Series</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="b" id="q2-b"/><Label htmlFor="q2-b">Parallel</Label></div>
                        </RadioGroup>
                        {quizFeedback2 && <p className={cn("mt-2 text-sm flex items-center gap-2", quizIsCorrect2 ? "text-green-600" : "text-red-600")}>{quizIsCorrect2 ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {quizFeedback2}</p>}
                        <Button onClick={handleQuiz2Submit} size="sm" variant="outline" className="mt-2" disabled={!quizAnswer2 || quizIsCorrect2 !== null}>Check Q2</Button>
                    </div>
                </CardContent>
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
