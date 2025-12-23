
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Wind, Flame, Beaker } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
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


const evaporationRates = {
    Water: 0.1,
    Alcohol: 0.3,
    Oil: 0.02,
};

export function EvaporationLab() {
    const { toast } = useToast();
    const [selectedLiquid, setSelectedLiquid] = React.useState<'Water' | 'Alcohol' | 'Oil' | null>(null);
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [isFanOn, setIsFanOn] = React.useState(false);
    const [isHeatOn, setIsHeatOn] = React.useState(false);
    const [liquidLevel, setLiquidLevel] = React.useState(100);
    const [timer, setTimer] = React.useState(0);
    const [isTimerRunning, setIsTimerRunning] = React.useState(false);
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        if (!isTimerRunning || !selectedLiquid) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            setLiquidLevel(prevLevel => {
                if (prevLevel <= 0) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    setIsTimerRunning(false); // Stop the timer logic
                    return 0;
                }
                const baseRate = evaporationRates[selectedLiquid];
                const fanMultiplier = isFanOn ? 2 : 1;
                const heatMultiplier = isHeatOn ? 3 : 1;
                const currentRate = baseRate * fanMultiplier * heatMultiplier;
                return Math.max(0, prevLevel - currentRate);
            });
            setTimer(prev => prev + 1);
        }, 100);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTimerRunning, selectedLiquid, isFanOn, isHeatOn]);
    
    // This effect now correctly handles the toast message *after* the state has been updated and the timer has stopped.
    React.useEffect(() => {
        if (liquidLevel <= 0 && !isTimerRunning && selectedLiquid) {
             toast({
                title: 'Evaporation Complete!',
                description: `${selectedLiquid} has fully evaporated.`
            });
        }
    }, [liquidLevel, isTimerRunning, selectedLiquid, toast]);


    const handleSelectLiquid = (liquid: 'Water' | 'Alcohol' | 'Oil') => {
        setSelectedLiquid(liquid);
        handleReset(); // Reset conditions and timer when liquid changes
    };

    const handleStartStop = () => {
        if (!selectedLiquid) {
            toast({ title: 'Select a Liquid', description: 'Please choose a liquid to test.', variant: 'destructive' });
            return;
        }
        setIsTimerRunning(prev => !prev);
    };

    const handleReset = () => {
        setIsTimerRunning(false);
        setTimer(0);
        setLiquidLevel(100);
        setIsFanOn(false);
        setIsHeatOn(false);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setHighlightInfo(null);
    };
    
     const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'b';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! Increased air movement sweeps away vapor, encouraging more evaporation. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Think about how clothes dry faster on a windy day. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. Increased air movement increases evaporation. 🧠");
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
            title: 'Lab Report Generated (Simulation)',
            description: `You tested the evaporation of ${selectedLiquid || 'N/A'} under various conditions.`,
        });
    };

    const objectiveText = "To observe how different liquids evaporate and how factors like airflow and heat affect the rate of evaporation.";
    const theoryText = "Evaporation is a type of vaporization that occurs on the surface of a liquid as it changes into the gas phase. The rate of evaporation depends on several factors: Temperature increases kinetic energy allowing molecules to escape more easily. A larger Surface Area exposes more molecules to the air. Airflow or wind sweeps away vapor molecules, reducing humidity and encouraging more evaporation. Liquids with weaker Intermolecular Forces like alcohol evaporate faster than those with stronger bonds like water or oil.";
    const safetyText = "In a real lab, handle liquids like alcohol with care as they can be flammable. Work in a well-ventilated area, especially with volatile liquids. Use safety gear like goggles when handling heat sources.";

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
                    <div className="flex items-center justify-between">
                        <CardTitle>Objective</CardTitle>
                        <TextToSpeech
                            textToSpeak={objectiveText}
                            onSentenceChange={(sentenceIndex) => setHighlightInfo({ section: 'objective', sentenceIndex })}
                            onStart={() => setHighlightInfo({ section: 'objective', sentenceIndex: 0 })}
                            onEnd={() => setHighlightInfo(null)}
                            className="flex-shrink-0"
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
                                <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /><span>Background Theory</span></div>
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
                                <div className="flex items-center gap-2"><Shield className="h-4 w-4" /><span>Safety Precautions</span></div>
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
                    <CardDescription>Choose a liquid, apply conditions, and start the timer to observe evaporation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-wrap justify-center gap-2">
                        <Button variant={selectedLiquid === 'Water' ? 'default' : 'outline'} onClick={() => handleSelectLiquid('Water')}>Water</Button>
                        <Button variant={selectedLiquid === 'Alcohol' ? 'default' : 'outline'} onClick={() => handleSelectLiquid('Alcohol')}>Alcohol</Button>
                        <Button variant={selectedLiquid === 'Oil' ? 'default' : 'outline'} onClick={() => handleSelectLiquid('Oil')}>Oil</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        {/* Simulation Visual */}
                        <div className="md:col-span-2 relative w-full h-64 bg-muted/30 dark:bg-muted/50 rounded-lg p-4 flex items-center justify-center overflow-hidden">
                             <div className="absolute top-4 left-4 flex flex-col items-center gap-2 text-muted-foreground">
                                <Wind className={cn("h-8 w-8 transition-colors", isFanOn && "text-blue-500 animate-spin")} />
                                <span className="text-xs">Airflow</span>
                             </div>
                             <div className="absolute top-4 right-4 flex flex-col items-center gap-2 text-muted-foreground">
                                <Flame className={cn("h-8 w-8 transition-colors", isHeatOn && "text-red-500")} />
                                <span className="text-xs">Heat</span>
                             </div>
                             
                             <div className="relative w-24 h-52 flex flex-col items-center justify-end">
                                <div className="relative w-full h-48 bg-gray-200/50 dark:bg-gray-800/50 rounded-t-lg border-2 border-b-0 border-gray-300 dark:border-gray-600 flex flex-col justify-end">
                                    <div className="absolute inset-x-0 top-0 h-full bg-blue-500/20" style={{ clipPath: `inset(${100 - liquidLevel}% 0 0 0)` }}/>
                                    <p className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-medium">{selectedLiquid || 'Select Liquid'}</p>
                                </div>
                                {isHeatOn && (
                                    <div className="absolute -bottom-2 flex justify-center items-end h-10 w-full">
                                        <Flame className="w-6 h-6 text-orange-400 animate-pulse" style={{animationDelay: '0.2s', animationDuration: '1.5s'}} />
                                        <Flame className="w-8 h-8 text-red-500 animate-pulse" style={{animationDuration: '1.2s'}} />
                                        <Flame className="w-6 h-6 text-orange-400 animate-pulse" style={{animationDelay: '0.4s', animationDuration: '1.5s'}} />
                                    </div>
                                )}
                             </div>


                             <div className="absolute bottom-4 text-center">
                                 <p className="text-2xl font-mono tabular-nums">{timer}s</p>
                                 <p className="text-xs text-muted-foreground">Elapsed Time</p>
                             </div>
                        </div>

                        {/* Controls */}
                        <div className="space-y-4">
                            <Card className="bg-background">
                                <CardHeader className="p-4 pb-2"><CardTitle className="text-base">Conditions</CardTitle></CardHeader>
                                <CardContent className="p-4 pt-0 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="fan-switch">Fan (Airflow)</Label>
                                        <Switch id="fan-switch" checked={isFanOn} onCheckedChange={setIsFanOn} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="heat-switch">Heat Source</Label>
                                        <Switch id="heat-switch" checked={isHeatOn} onCheckedChange={setIsHeatOn} />
                                    </div>
                                </CardContent>
                            </Card>
                             <Button onClick={handleStartStop} className="w-full">
                                {isTimerRunning ? 'Stop Timer' : 'Start Timer'}
                             </Button>
                             <Button variant="outline" onClick={handleReset} className="w-full">Reset Conditions</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Post-Lab Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-2 font-medium">Which of the following will increase the rate of evaporation?</p>
                    <RadioGroup value={quizAnswer} onValueChange={handleQuizChange} disabled={quizIsCorrect !== null}>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="a" id="q-a"/><Label htmlFor="q-a">Lower temperature</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="b" id="q-b"/><Label htmlFor="q-b">Increased air movement</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="c" id="q-c"/><Label htmlFor="q-c">Decreased surface area</Label></div>
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
                    <CardDescription>Generate a summary of your experiment findings.</CardDescription>
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
