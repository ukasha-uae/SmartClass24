
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Flame, TestTube, Wind, Move } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

// --- Visual Components ---
const TestTubeWithLiquid = ({ children }: { children?: React.ReactNode }) => (
    <div className="relative w-24 h-48 mx-auto flex items-end justify-center">
        <div className="absolute w-full h-full border-x-2 border-b-2 border-gray-400 dark:border-gray-600 rounded-b-xl" />
        <div className="w-[calc(100%-1rem)] h-1/2 bg-blue-200/30 dark:bg-blue-900/40 rounded-b-lg" />
        {children}
    </div>
);

const FumesAnimation = () => (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-24 flex justify-center items-end pointer-events-none">
        {Array.from({ length: 3 }).map((_, i) => (
            <div
                key={i}
                className="absolute bottom-0 w-1 h-1 bg-gray-400/50 rounded-full"
                style={{
                    animation: `fume-rise 3s ease-out infinite`,
                    animationDelay: `${i * 0.7}s`,
                    left: `${30 + i * 20}%`
                }}
            />
        ))}
    </div>
);

const LitmusPaperIcon = ({ color }: { color: 'red' | 'blue' }) => (
    <div className={cn("w-4 h-12 border-2 rounded-sm", color === 'red' ? 'bg-red-400 border-red-600' : 'bg-blue-400 border-blue-600')} />
);

export function AmmoniaTestLab() {
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const [isHeated, setIsHeated] = React.useState(false);
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [isLitmusTested, setIsLitmusTested] = React.useState(false);
    const [isSimulating, setIsSimulating] = React.useState(false);
    
    // For mobile tap interaction
    const [selectedItem, setSelectedItem] = React.useState<string | null>(null);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    const handleHeat = () => {
        if (isSimulating || isHeated) return;
        setIsSimulating(true);
        toast({ title: "Heating...", description: "Ammonia gas is being produced." });
        setTimeout(() => {
            setIsHeated(true);
            setIsSimulating(false);
            toast({ title: "Gas Produced!", description: "Now test the gas with litmus paper." });
        }, 2000);
    };
    
    const handleLitmusTest = () => {
        if (!isHeated) {
            toast({ title: "Heat First!", description: "You need to heat the solution to produce ammonia gas.", variant: "destructive" });
            return;
        }
        setIsLitmusTested(true);
        toast({ title: "Test Complete!", description: "The moist red litmus paper turned blue." });
    };
    
    // --- Combined Handlers for Drag & Mobile Tap ---
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        if (isMobile) return;
        e.dataTransfer.setData('text/plain', 'litmus');
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (isMobile) return;
        e.preventDefault();
        const item = e.dataTransfer.getData('text/plain');
        if (item === 'litmus') {
            handleLitmusTest();
        }
    };
    const handleMobileSelect = () => {
        if (!isMobile) return;
        setSelectedItem('litmus');
        toast({ title: "Litmus Paper Selected", description: "Now tap the test tube to test the gas." });
    };
    const handleMobileTubeTap = () => {
        if (!isMobile || selectedItem !== 'litmus') return;
        handleLitmusTest();
        setSelectedItem(null);
    };


    const handleReset = () => {
        setIsHeated(false);
        setIsLitmusTested(false);
        setIsSimulating(false);
        setSelectedItem(null);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        toast({ title: "Lab Reset" });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'base';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! Ammonia is a base, which is why it turns red litmus blue. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite right. Remember what type of substance turns red litmus blue. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. Ammonia is a base. 🧠");
            }
        }
    };

    const handleQuizChange = (value: string) => {
        setQuizAnswer(value);
        if (quizIsCorrect !== null) { setQuizIsCorrect(null); setQuizFeedback(null); setQuizAttempts(0); }
    };
    
    const handleGenerateReport = () => {
        if (!isLitmusTested) {
            toast({
                title: "Experiment Not Complete",
                description: "Please run the test to completion before generating a report.",
                variant: "destructive",
            });
            return;
        }

        const quizResultText = quizIsCorrect === true ? 'Correct' : (quizIsCorrect === false ? 'Incorrect' : 'Not attempted');

        toast({
            title: 'Lab Report Generated (Simulation)',
            description: `Test: Moist red litmus paper on gas from heated ammonium compound. Result: Litmus turned blue. Conclusion: Ammonia gas is basic. Quiz result: ${quizResultText}.`
        });
    };
    
    return (
        <div className="space-y-6">
            <style jsx global>{`
                @keyframes fume-rise {
                    0% { transform: translateY(0) scale(0.5); opacity: 0.5; }
                    100% { transform: translateY(-50px) scale(1.5); opacity: 0; }
                }
            `}</style>
            <Card>
                <CardHeader>
                    <CardTitle>Objective</CardTitle>
                    <CardDescription>To identify ammonia gas (NH₃) by its characteristic smell and its effect on moist red litmus paper.</CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lab Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="theory"><AccordionTrigger><div className="flex items-center gap-2"><BookOpen className="h-4 w-4"/><span>Background Theory</span></div></AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
                                <div className="flex-grow">
                                    <p>Ammonia (NH₃) is a common alkaline (basic) gas. When it dissolves in water, it forms ammonium hydroxide, which is a weak base. A key test for ammonia is its ability to turn moist red litmus paper blue. It also has a characteristic pungent smell.</p>
                                </div>
                                <TextToSpeech textToSpeak="Ammonia is a common alkaline gas. When it dissolves in water, it forms ammonium hydroxide, a weak base. A key test is its ability to turn moist red litmus paper blue. It also has a characteristic pungent smell." className="flex-shrink-0" />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="safety"><AccordionTrigger><div className="flex items-center gap-2"><Shield className="h-4 w-4"/><span>Safety Precautions</span></div></AccordionTrigger>
                            <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
                                <div className="flex-grow">
                                    <ul className="list-disc pl-5">
                                        <li>In a real lab, ammonia should be handled in a well-ventilated area or fume hood due to its strong smell.</li>
                                        <li>Wear safety goggles to protect your eyes.</li>
                                        <li>Handle heat sources with care.</li>
                                    </ul>
                                </div>
                                <TextToSpeech textToSpeak="In a real lab, ammonia should be handled in a well-ventilated area. Wear safety goggles. Handle heat sources with care." className="flex-shrink-0" />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Experiment Simulation</CardTitle>
                    <CardDescription>{isMobile ? '1. Heat the tube. 2. Tap the litmus paper, then tap the tube.' : '1. Heat the tube. 2. Drag the litmus paper to the tube.'}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center justify-center gap-8 min-h-[300px] p-4 bg-muted/30 rounded-lg">
                    {/* Controls & Litmus Paper */}
                     <div className="flex flex-col items-center gap-4">
                        <Button onClick={handleHeat} disabled={isHeated || isSimulating}>
                            {isSimulating ? "Heating..." : (isHeated ? "Heated" : "1. Apply Heat")}
                        </Button>
                        <div
                            draggable={!isMobile}
                            onDragStart={handleDragStart}
                            onClick={handleMobileSelect}
                            className={cn(
                                "p-2 border bg-card rounded-lg flex items-center gap-2 text-sm shadow-sm",
                                isHeated && !isLitmusTested ? (isMobile ? "cursor-pointer ring-2 ring-accent" : "cursor-grab active:cursor-grabbing") : "cursor-not-allowed opacity-50"
                            )}
                        >
                            <Move className="w-4 h-4 text-muted-foreground" />
                            <LitmusPaperIcon color="red" />
                            <span className="text-xs">Moist Red Litmus</span>
                        </div>
                    </div>

                    {/* Simulation Area */}
                    <div className="relative flex flex-col items-center">
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={handleMobileTubeTap}
                            className={cn(
                                "relative transition-colors",
                                isHeated && !isLitmusTested && isMobile && selectedItem === 'litmus' && "animate-pulse"
                            )}
                        >
                            <TestTubeWithLiquid>
                                {isHeated && <FumesAnimation />}
                                {isLitmusTested && (
                                    <div className="absolute top-[-1rem] left-1/2 -translate-x-1/2">
                                        <LitmusPaperIcon color="blue" />
                                    </div>
                                )}
                            </TestTubeWithLiquid>
                        </div>
                        {isHeated && (
                            <div className="absolute -bottom-8 flex justify-center items-end h-10 w-full">
                                <Flame className="w-8 h-8 text-orange-400" />
                            </div>
                        )}
                        {isLitmusTested && <p className="mt-8 text-sm font-semibold text-green-600">Litmus paper turned blue!</p>}
                    </div>
                </CardContent>
            </Card>

            {isLitmusTested && (
                <Card>
                    <CardHeader>
                        <CardTitle>Post-Lab Quiz</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-2 font-medium">Based on the result, is ammonia an acid, a base, or neutral?</p>
                        <RadioGroup value={quizAnswer} onValueChange={handleQuizChange} disabled={quizIsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="acid" id="q-acid"/><Label htmlFor="q-acid">Acid</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="base" id="q-base"/><Label htmlFor="q-base">Base</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="neutral" id="q-neutral"/><Label htmlFor="q-neutral">Neutral</Label></div>
                        </RadioGroup>
                        {quizFeedback && <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", quizIsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100", quizIsCorrect === null && "text-blue-700 bg-blue-100")}>{quizIsCorrect ? <CheckCircle/> : !quizIsCorrect && quizAttempts > 1 ? <XCircle/> : <RefreshCw className="animate-spin"/>}{quizFeedback}</p>}
                    </CardContent>
                     <CardFooter>
                        <Button onClick={handleQuizSubmit} disabled={!quizAnswer || quizIsCorrect !== null} size="sm">
                            {quizIsCorrect === true ? "Correct!" : quizIsCorrect === false ? "Answer Shown" : quizAttempts === 1 && quizIsCorrect === null ? "Try Again" : "Check Answer"}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Lab Report</CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-center gap-4">
                     <Button variant="secondary" onClick={handleGenerateReport} disabled={!isLitmusTested}>Generate Report</Button>
                     <Button variant="outline" onClick={handleReset}>Reset Lab</Button>
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
