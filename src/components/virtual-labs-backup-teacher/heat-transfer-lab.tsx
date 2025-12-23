
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, Flame, BookOpen, Shield } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { useIsMobile } from '@/hooks/use-mobile'; // Import the hook
import { TeacherVoice } from './TeacherVoice';

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


type Stage = 'initial' | 'conduction' | 'convection' | 'radiation' | 'quiz' | 'complete';

const AnimatedHeatWaves = () => (
    <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-red-400 rounded-full animate-wave"
                 style={{ animationDelay: `${i * 0.2}s` }}/>
        ))}
    </div>
);

export function HeatTransferLab() {
    const { toast } = useToast();
    const isMobile = useIsMobile(); // Use the mobile hook
    const [stage, setStage] = React.useState<Stage>('initial');
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [isSimulating, setIsSimulating] = React.useState(false);
    const [simulatingTube, setSimulatingTube] = React.useState<'conduction' | 'convection' | 'radiation' | null>(null);
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);
    
    // State for each stage's simulation
    const [conductionHeated, setConductionHeated] = React.useState(false);
    const [convectionHeated, setConvectionHeated] = React.useState(false);
    const [radiationHeated, setRadiationHeated] = React.useState(false);

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

    const objectiveText = "To investigate and compare how heat is transferred through conduction, convection, and radiation.";
    const theoryText = "Heat transfer is the movement of thermal energy from a hotter object to a colder one. There are three main ways this happens: Conduction is heat transfer through direct contact, common in solids where particles vibrate and collide. Convection is heat transfer through the movement of fluids (liquids or gases), where hotter, less dense fluid rises, and cooler, denser fluid sinks, creating a current. Radiation is heat transfer through electromagnetic waves, which can travel through empty space, like how the sun's heat reaches Earth.";
    const safetyText = "While this is a simulation, always approach science with a safety-first mindset. In a real lab, never touch hot surfaces without proper equipment, always wear safety goggles when working with heat sources, and understand the procedure completely before starting any experiment.";

    const handleStageChange = (nextStage: Stage) => {
        setIsSimulating(false);
        setStage(nextStage);
    };
    
    const handleHeat = (type: 'conduction' | 'convection' | 'radiation') => {
        if (isSimulating) return;
        
        let isHeatedAlready = false;
        if (type === 'conduction') isHeatedAlready = conductionHeated;
        if (type === 'convection') isHeatedAlready = convectionHeated;
        if (type === 'radiation') isHeatedAlready = radiationHeated;
        
        if (isHeatedAlready) return;

        setIsSimulating(true);
        setSimulatingTube(type);
        toast({ title: "Applying Heat 🔥", description: `Observing ${type}...` });

        setTimeout(() => {
            if (type === 'conduction') setConductionHeated(true);
            if (type === 'convection') setConvectionHeated(true);
            if (type === 'radiation') setRadiationHeated(true);
            setIsSimulating(false);
            setSimulatingTube(null);
        }, 2000);
    };

    const handleReset = () => {
        setStage('initial');
        setConductionHeated(false);
        setConvectionHeated(false);
        setRadiationHeated(false);
        setIsSimulating(false);
        setSimulatingTube(null);
        setQuiz1Answer(undefined); setQuiz1Feedback(null); setQuiz1Attempts(0); setQuiz1IsCorrect(null);
        setQuiz2Answer(undefined); setQuiz2Feedback(null); setQuiz2Attempts(0); setQuiz2IsCorrect(null);
        setQuiz3Answer(undefined); setQuiz3Feedback(null); setQuiz3Attempts(0); setQuiz3IsCorrect(null);
        setHighlightInfo(null);
        toast({ title: 'Lab Reset', description: 'Ready for a new experiment.' });
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
    
    const quiz1 = createQuizHandler(setQuiz1Answer, setQuiz1Feedback, setQuiz1Attempts, setQuiz1IsCorrect, quiz1Answer, quiz1Attempts, quiz1IsCorrect, 'radiation', 'Correct! Radiation can travel through a vacuum. ✅', 'Conduction and convection need a medium. Try again! 🔄', 'Incorrect. The answer is Radiation. 🧠');
    const quiz2 = createQuizHandler(setQuiz2Answer, setQuiz2Feedback, setQuiz2Attempts, setQuiz2IsCorrect, quiz2Answer, quiz2Attempts, quiz2IsCorrect, 'particles', 'Correct! The closely packed particles in metal vibrate and transfer heat efficiently. ✅', 'Think about the structure of solids. Try again! 🔄', 'Incorrect. Closely packed particles are key to conduction. 🧠');
    const quiz3 = createQuizHandler(setQuiz3Answer, setQuiz3Feedback, setQuiz3Attempts, setQuiz3IsCorrect, quiz3Answer, quiz3Attempts, quiz3IsCorrect, 'less-dense', 'Correct! Heated fluid becomes less dense and rises. ✅', 'What happens to the density of most fluids when they get hot? Try again! 🔄', 'Incorrect. Heated fluid becomes less dense. 🧠');


    const handleGenerateReport = () => {
        if (stage !== 'quiz' && stage !== 'complete') {
            toast({ title: "Experiment Incomplete", description: "Please complete all stages and the quiz first.", variant: "destructive" });
            return;
        }
        toast({
            title: 'Lab Report Generated (Simulation)',
            description: `You observed Conduction in solids, Convection in liquids, and Radiation through space. Your quiz results were recorded.`,
        });
    };

    const renderStageContent = () => {
        const stageMap: Record<Stage, React.ReactNode> = {
            initial: (
                <div className="text-center">
                    <p className="mb-4 text-muted-foreground">Click below to begin the experiment by observing the solid.</p>
                    <Button onClick={() => setStage('conduction')}>Start Experiment</Button>
                </div>
            ),
            conduction: (
                <div className="flex flex-col items-center gap-4">
                     <h4 className="font-semibold">Stage 1: Conduction (Solid)</h4>
                    <div className="w-full h-24 p-4 flex items-center justify-center relative">
                        <div className="w-4/5 h-4 bg-gray-300 dark:bg-gray-600 rounded-full relative overflow-hidden">
                            <div className={cn("absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 transition-all duration-1000 ease-linear", conductionHeated ? "w-full" : "w-0")} />
                        </div>
                        <Thermometer className={cn("absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-1000", conductionHeated ? "text-red-500" : "text-blue-500")} />
                        <Thermometer className={cn("absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-1000", conductionHeated ? "text-red-500" : "text-blue-500")} />
                    </div>
                    <Button onClick={() => handleHeat('conduction')} disabled={isSimulating || conductionHeated}>
                        <Flame className="mr-2 h-4 w-4" /> 
                        {isSimulating && simulatingTube === 'conduction' ? 'Heating...' : (conductionHeated ? 'Completed' : 'Heat Metal Rod')}
                    </Button>
                </div>
            ),
            convection: (
                 <div className="flex flex-col items-center gap-4">
                    <style jsx global>{`
                        @keyframes convection-current {
                            0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                            20% { transform: translate(0, -40px) rotate(90deg); opacity: 1; }
                            80% { transform: translate(0, -40px) rotate(270deg); opacity: 1; }
                            100% { transform: translate(0, -80px) rotate(360deg); opacity: 0; }
                        }
                    `}</style>
                    <h4 className="font-semibold">Stage 2: Convection (Liquid)</h4>
                    <div className="w-32 h-40 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex items-end justify-center relative overflow-hidden">
                        <div className="w-full h-full bg-blue-500/20" />
                        <div className="absolute bottom-2 text-xs font-semibold text-red-600 dark:text-red-400">Hot Region</div>
                        <div className="absolute top-2 text-xs font-semibold text-blue-600 dark:text-blue-400">Cool Region</div>
                        {convectionHeated && (
                            <div className="absolute inset-0">
                                {Array.from({length: 8}).map((_, i) => (
                                     <div key={i} className="absolute bottom-10 left-1/2 -ml-1 w-2 h-2 rounded-full" style={{animation: `convection-current 4s linear infinite`, animationDelay: `${i*0.5}s`}}>
                                        <div className="w-full h-full bg-red-400 rounded-full" />
                                     </div>
                                ))}
                            </div>
                        )}
                    </div>
                     <Button onClick={() => handleHeat('convection')} disabled={isSimulating || convectionHeated}>
                        <Flame className="mr-2 h-4 w-4" /> 
                        {isSimulating && simulatingTube === 'convection' ? 'Heating...' : (convectionHeated ? 'Completed' : 'Heat Beaker')}
                    </Button>
                </div>
            ),
            radiation: (
                <div className="flex flex-col items-center gap-4">
                    <style jsx global>{`
                        @keyframes wave { 0% {transform: scale(0); opacity: 1;} 100% {transform: scale(1.5); opacity: 0;} }
                        .animate-wave { animation: wave 1.5s linear infinite; }
                    `}</style>
                    <h4 className="font-semibold">Stage 3: Radiation (Vacuum)</h4>
                    <div className="w-full h-24 p-4 flex items-center justify-around relative">
                        <Flame className="h-12 w-12 text-orange-500" />
                        <div className="relative w-12 h-12">
                            {radiationHeated && <AnimatedHeatWaves />}
                        </div>
                        <Hand className={cn("h-12 w-12 text-gray-500 transition-colors duration-1000", radiationHeated && "text-red-400")} />
                    </div>
                    <Button onClick={() => handleHeat('radiation')} disabled={isSimulating || radiationHeated}>
                        <Flame className="mr-2 h-4 w-4" /> 
                        {isSimulating && simulatingTube === 'radiation' ? 'Activating...' : (radiationHeated ? 'Completed' : 'Activate Heat Source')}
                    </Button>
                </div>
            ),
            quiz: (
                <div className="space-y-6 w-full max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-center">Post-Lab Quiz</h3>
                    <div>
                        <p className="mb-2 font-medium">1. Which method of heat transfer works through a vacuum (empty space)?</p>
                        <RadioGroup value={quiz1Answer} onValueChange={(v) => quiz1.handleChange(v)} disabled={quiz1IsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="conduction" id="q1-a"/><Label htmlFor="q1-a">Conduction</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="convection" id="q1-b"/><Label htmlFor="q1-b">Convection</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="radiation" id="q1-c"/><Label htmlFor="q1-c">Radiation</Label></div>
                        </RadioGroup>
                         {quiz1Feedback && <p className={cn("mt-2 text-sm flex items-center gap-2 p-2 rounded-md", quiz1IsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100", quiz1IsCorrect === null && "text-blue-700 bg-blue-100")}>{quiz1IsCorrect ? <CheckCircle className="h-4 w-4"/> : !quiz1IsCorrect && quiz1Attempts > 1 ? <XCircle className="h-4 w-4"/> : <RefreshCw className="h-4 w-4 animate-spin"/>}{quiz1Feedback}</p>}
                        <Button onClick={() => quiz1.handleSubmit(quiz1Answer, quiz1Attempts, quiz1IsCorrect)} size="sm" variant="outline" className="mt-2" disabled={!quiz1Answer || quiz1IsCorrect !== null}>Check Q1</Button>
                    </div>
                     <div>
                        <p className="mb-2 font-medium">2. Why does a metal rod conduct heat faster than a plastic rod?</p>
                        <RadioGroup value={quiz2Answer} onValueChange={(v) => quiz2.handleChange(v)} disabled={quiz2IsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="color" id="q2-a"/><Label htmlFor="q2-a">Because metal is shinier.</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="particles" id="q2-b"/><Label htmlFor="q2-b">Because its particles are closely packed.</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="shape" id="q2-c"/><Label htmlFor="q2-c">Because of its shape.</Label></div>
                        </RadioGroup>
                         {quiz2Feedback && <p className={cn("mt-2 text-sm flex items-center gap-2 p-2 rounded-md", quiz2IsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100", quiz2IsCorrect === null && "text-blue-700 bg-blue-100")}>{quiz2IsCorrect ? <CheckCircle className="h-4 w-4"/> : !quiz2IsCorrect && quiz2Attempts > 1 ? <XCircle className="h-4 w-4"/> : <RefreshCw className="h-4 w-4 animate-spin"/>}{quiz2Feedback}</p>}
                         <Button onClick={() => quiz2.handleSubmit(quiz2Answer, quiz2Attempts, quiz2IsCorrect)} size="sm" variant="outline" className="mt-2" disabled={!quiz2Answer || quiz2IsCorrect !== null}>Check Q2</Button>
                    </div>
                    <div>
                        <p className="mb-2 font-medium">3. Why does the heated fluid rise in convection?</p>
                         <RadioGroup value={quiz3Answer} onValueChange={(v) => quiz3.handleChange(v)} disabled={quiz3IsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="more-dense" id="q3-a" /><Label htmlFor="q3-a">It becomes more dense and heavier.</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="less-dense" id="q3-b" /><Label htmlFor="q3-b">It becomes less dense and lighter.</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="no-change" id="q3-c" /><Label htmlFor="q3-c">Its density does not change.</Label></div>
                        </RadioGroup>
                        {quiz3Feedback && <p className={cn("mt-2 text-sm flex items-center gap-2 p-2 rounded-md", quiz3IsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100", quiz3IsCorrect === null && "text-blue-700 bg-blue-100")}>{quiz3IsCorrect ? <CheckCircle className="h-4 w-4"/> : !quiz3IsCorrect && quiz3Attempts > 1 ? <XCircle className="h-4 w-4"/> : <RefreshCw className="h-4 w-4 animate-spin"/>}{quiz3Feedback}</p>}
                         <Button onClick={() => quiz3.handleSubmit(quiz3Answer, quiz3Attempts, quiz3IsCorrect)} size="sm" variant="outline" className="mt-2" disabled={!quiz3Answer || quiz3IsCorrect !== null}>Check Q3</Button>
                    </div>
                    {quiz1IsCorrect && quiz2IsCorrect && quiz3IsCorrect && stage === 'quiz' && (
                         <Button onClick={() => setStage('complete')} className="w-full mt-4">Complete Lab</Button>
                    )}
                     {stage === 'complete' && <div className="p-4 text-center bg-green-100 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-300 font-semibold flex items-center justify-center gap-2"><CheckCircle />Lab Complete! You can now generate your report.</div>}
                </div>
            ),
            complete: <div>Experiment Complete!</div> // Fallback
        };
        return stageMap[stage] || stageMap.initial;
    };

    return (
        <div className="space-y-6">
            <style jsx global>{`
                @keyframes wave { 0% {transform: scale(0); opacity: 1;} 100% {transform: scale(1.5); opacity: 0;} }
                .animate-wave { animation: wave 1.5s linear infinite; }
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
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    <span>Safety Precautions</span>
                                </div>
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


            <Card>
                <CardHeader>
                    <CardTitle>Experiment Simulation</CardTitle>
                    <CardDescription>Follow the stages to observe each type of heat transfer.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[300px] flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4">
                    {renderStageContent()}
                </CardContent>
                <CardFooter className="flex flex-wrap justify-center gap-4 pt-4">
                    <div className="flex flex-wrap justify-center gap-2">
                         <Button variant={stage === 'conduction' ? 'default' : 'outline'} size="sm" onClick={() => setStage('conduction')}>Conduction</Button>
                         <Button variant={stage === 'convection' ? 'default' : 'outline'} size="sm" onClick={() => setStage('convection')}>Convection</Button>
                         <Button variant={stage === 'radiation' ? 'default' : 'outline'} size="sm" onClick={() => setStage('radiation')}>Radiation</Button>
                         <Button variant={stage === 'quiz' ? 'default' : 'outline'} size="sm" onClick={() => setStage('quiz')} disabled={!conductionHeated || !convectionHeated || !radiationHeated}>Go to Quiz</Button>
                    </div>
                     <Button variant="destructive" size="sm" onClick={handleReset}>Reset Lab</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader><CardTitle>Lab Report</CardTitle><CardDescription>Generate a summary of your findings.</CardDescription></CardHeader>
                <CardFooter><Button variant="secondary" onClick={handleGenerateReport} disabled={stage !== 'quiz' && stage !== 'complete'}>Generate Report</Button></CardFooter>
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
