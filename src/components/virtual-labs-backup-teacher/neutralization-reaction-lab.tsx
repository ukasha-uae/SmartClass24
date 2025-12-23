
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, FlaskConical, TestTube, Droplets, Wind, XCircle, RefreshCw, BookOpen, Shield } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

export function NeutralizationReactionLab() {
    const { toast } = useToast();
    const [mixed, setMixed] = React.useState(false);
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [showProducts, setShowProducts] = React.useState(false);
    
    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);
    
    const handleMix = () => {
        setMixed(true);
        toast({ title: "Mixing...", description: "HCl and NaOH are reacting." });
        setTimeout(() => {
            setShowProducts(true);
            toast({ title: "Reaction Complete!", description: "A neutralization reaction has occurred." });
        }, 2000);
    };

    const handleReset = () => {
        setMixed(false);
        setShowProducts(false);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
    };
    
    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'neutralization';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! Acid + Base → Salt + Water is a neutralization reaction. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite. Think about what happens when an acid and base cancel each other out. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. The reaction is called Neutralization. 🧠");
            }
        }
    };

    const handleQuizChange = (value: string) => {
        setQuizAnswer(value);
        if (quizIsCorrect !== null || (quizAttempts > 0 && quizIsCorrect === null)) {
            // Allow changing answer on first wrong attempt, otherwise reset
            if (!(quizAttempts === 1 && quizIsCorrect === null)) {
                setQuizAttempts(0);
                setQuizIsCorrect(null);
                setQuizFeedback(null);
            }
        }
    };
    
    const handleGenerateReport = () => {
        toast({
            title: "Lab Report Generated (Simulation)",
            description: "Experiment: Neutralization. Result: HCl and NaOH produced NaCl and H₂O. Quiz: " + (quizIsCorrect ? "Correct." : "Incorrect/Not attempted."),
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Objective</CardTitle>
                        <TextToSpeech textToSpeak="To visually simulate the neutralization reaction between Hydrochloric Acid (HCl) and Sodium Hydroxide (NaOH)." />
                    </div>
                    <CardDescription>To visually simulate the neutralization reaction between Hydrochloric Acid (HCl) and Sodium Hydroxide (NaOH).</CardDescription>
                </CardHeader>
                <CardContent>
                    <p><strong>Materials:</strong> Virtual Beaker, HCl solution, NaOH solution.</p>
                </CardContent>
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
                          <p>A <strong>neutralization reaction</strong> is a chemical reaction in which an acid and a base react quantitatively with each other. In a reaction in water, neutralization results in there being no excess of hydrogen or hydroxide ions present in the solution.</p>
                          <p className="font-mono mt-2">The general equation is: Acid + Base → Salt + Water</p>
                          <p className="font-mono mt-1">Example: HCl (acid) + NaOH (base) → NaCl (salt) + H₂O (water)</p>
                        </div>
                        <TextToSpeech textToSpeak="A neutralization reaction is a chemical reaction in which an acid and a base react. The general equation is: Acid plus Base produces Salt plus Water." className="flex-shrink-0" />
                    </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>Safety Precautions</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                        <ul className="list-disc pl-5 space-y-1">
                        <li>In a real lab, always wear safety goggles and a lab coat.</li>
                        <li>Acids and bases can be corrosive. Handle them with care and avoid contact with skin and eyes.</li>
                        <li>When diluting acids, always add acid slowly to water, never water to acid, to prevent a violent, exothermic reaction.</li>
                        <li>Work in a well-ventilated area.</li>
                        </ul>
                    </AccordionContent>
                    </AccordionItem>
                </Accordion>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Experiment Simulation</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 p-4 min-h-[250px] bg-muted/30 rounded-lg">
                        {/* Ingredients */}
                        <div className="flex items-center gap-4">
                            <div className={cn("text-center transition-opacity duration-500", mixed && "opacity-20")}>
                                <TestTube className="h-16 w-16 mx-auto text-blue-500"/>
                                <p className="font-medium">HCl (Acid)</p>
                            </div>
                            <p className={cn("text-2xl font-bold transition-opacity duration-500", mixed && "opacity-20")}>+</p>
                            <div className={cn("text-center transition-opacity duration-500", mixed && "opacity-20")}>
                                <TestTube className="h-16 w-16 mx-auto text-red-500"/>
                                <p className="font-medium">NaOH (Base)</p>
                            </div>
                        </div>
                        
                        {/* Reaction Beaker */}
                        <div className="text-center mx-4 relative">
                           <FlaskConical className={cn("h-24 w-24 mx-auto text-gray-400 transition-all duration-1000", mixed && "text-purple-500 scale-110")} />
                           {mixed && <Wind className="h-6 w-6 mx-auto text-gray-500/50 animate-ping absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-10"/>}
                        </div>

                        {/* Products */}
                        <div className="flex items-center gap-4">
                            <p className={cn("text-2xl font-bold transition-opacity duration-500", !showProducts && "opacity-0")}>→</p>
                            <div className={cn("text-center transition-opacity duration-500", !showProducts && "opacity-0")}>
                                <Droplets className="h-16 w-16 mx-auto text-cyan-500"/>
                                <p className="font-medium">H₂O (Water)</p>
                            </div>
                             <p className={cn("text-2xl font-bold transition-opacity duration-500", !showProducts && "opacity-0")}>+</p>
                             <div className={cn("text-center transition-opacity duration-500", !showProducts && "opacity-0")}>
                                <p className="text-4xl font-mono">NaCl</p>
                                <p className="font-medium">Salt</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button onClick={handleMix} disabled={mixed}>Mix Solutions</Button>
                    <Button variant="outline" onClick={handleReset}>Reset</Button>
                </CardFooter>
            </Card>

            {showProducts && (
                <Card>
                    <CardHeader>
                        <CardTitle>Post-Lab Quiz</CardTitle>
                        <CardDescription>What type of reaction did you just observe?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup value={quizAnswer} onValueChange={handleQuizChange} disabled={quizIsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="combustion" id="q-a" /><Label htmlFor="q-a">Combustion</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="neutralization" id="q-b" /><Label htmlFor="q-b">Neutralization</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="decomposition" id="q-c" /><Label htmlFor="q-c">Decomposition</Label></div>
                        </RadioGroup>
                        {quizFeedback && <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", quizIsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100", quizIsCorrect === null && "text-blue-700 bg-blue-100")}>{quizIsCorrect ? <CheckCircle/> : !quizIsCorrect && quizAttempts > 1 ? <XCircle/> : <RefreshCw className="animate-spin"/>}{quizFeedback}</p>}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleQuizSubmit} disabled={!quizAnswer || quizIsCorrect !== null} size="sm">Check Answer</Button>
                    </CardFooter>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Lab Report</CardTitle>
                    <CardDescription>Generate a summary of your experiment.</CardDescription>
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
