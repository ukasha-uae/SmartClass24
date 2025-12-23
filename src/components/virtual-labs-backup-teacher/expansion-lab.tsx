
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

type Stage = 'initial' | 'solid' | 'water' | 'alcohol' | 'quiz' | 'complete';

export function ExpansionLab() {
  const { toast } = useToast();

  const [stage, setStage] = React.useState<Stage>('initial');
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
  const [heated, setHeated] = React.useState({ solid: false, water: false, alcohol: false });
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [simulatingTube, setSimulatingTube] = React.useState<'solid' | 'water' | 'alcohol' | null>(null);

  // Quiz State
  const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
  const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
  const [quizAttempts, setQuizAttempts] = React.useState(0);
  const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

  const handleHeat = (material: keyof typeof heated) => {
    if (isSimulating || heated[material]) return;
    
    setIsSimulating(true);
    setSimulatingTube(material);
    toast({
      title: "Applying Heat 🔥",
      description: `Observing the expansion of the ${material}.`
    });

    setTimeout(() => {
        setHeated(prev => ({ ...prev, [material]: true }));
        setIsSimulating(false);
        setSimulatingTube(null);
    }, 1500);
  };

  const handleNextStage = () => {
    if (stage === 'solid') setStage('water');
    else if (stage === 'water') setStage('alcohol');
    else if (stage === 'alcohol') setStage('quiz');
  };

  const handleReset = () => {
    setStage('initial');
    setHeated({ solid: false, water: false, alcohol: false });
    setIsSimulating(false);
    setSimulatingTube(null);
    setQuizAnswer(undefined);
    setQuizFeedback(null);
    setQuizAttempts(0);
    setQuizIsCorrect(null);
    toast({ title: "Lab Reset", description: "Ready for a new experiment." });
  };
  
  const handleQuizSubmit = () => {
    if (quizIsCorrect !== null) return;
    const isCorrect = quizAnswer === 'alcohol';
    const newAttempts = quizAttempts + 1;
    setQuizAttempts(newAttempts);
    if (isCorrect) {
      setQuizIsCorrect(true);
      setQuizFeedback("Correct! Alcohol expanded the most due to its properties. ✅");
    } else {
      if (newAttempts === 1) {
        setQuizFeedback("Not quite. Compare the final values. Which one increased the most? Try again! 🔄");
      } else {
        setQuizIsCorrect(false);
        setQuizFeedback("Incorrect. Alcohol has a higher coefficient of thermal expansion than water. 🧠");
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
    if (stage !== 'quiz' && stage !== 'complete') {
      toast({ title: 'Experiment Incomplete', description: 'Please complete all stages first.', variant: 'destructive' });
      return;
    }
    toast({
      title: "Lab Report Generated (Simulation)",
      description: `After heating, the Metal rod expanded slightly. Water expanded more than the solid, and Alcohol expanded the most. This demonstrates that liquids generally expand more than solids, and different liquids expand at different rates.`
    });
  };

  const renderStageContent = () => {
    switch (stage) {
      case 'initial':
        return (
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">Click below to begin the experiment by observing the solid.</p>
            <Button onClick={() => setStage('solid')}>Start Experiment</Button>
          </div>
        );
      case 'solid':
      case 'water':
      case 'alcohol':
        const materialData = {
          solid: { title: 'Solid (Metal Rod)', initial: '10.00 cm', final: '~10.05 cm', component: <div className="h-24 flex items-center justify-center"><div className={cn("h-3 w-2/3 bg-gray-500 dark:bg-gray-400 rounded-full origin-left transition-transform duration-1000 ease-in-out", heated.solid ? 'scale-x-105' : 'scale-x-100')} /></div> },
          water: { title: 'Liquid (Water)', initial: '100.0 ml', final: '~101.5 ml', component: <div className="h-24 w-12 mx-auto mt-2 bg-gray-200 dark:bg-gray-700 rounded-t-lg relative border-x border-t border-gray-300 dark:border-gray-600"><div className={cn("absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-md transition-all duration-1000 ease-in-out", heated.water ? "h-[60%]" : "h-[50%]")} /></div> },
          alcohol: { title: 'Liquid (Alcohol)', initial: '100.0 ml', final: '~105.8 ml', component: <div className="h-24 w-12 mx-auto mt-2 bg-gray-200 dark:bg-gray-700 rounded-t-lg relative border-x border-t border-gray-300 dark:border-gray-600"><div className={cn("absolute bottom-0 left-0 right-0 bg-purple-500 rounded-t-md transition-all duration-1000 ease-in-out", heated.alcohol ? "h-[90%]" : "h-[50%]")} /></div> },
        }[stage];

        return (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 border bg-background rounded-lg shadow-sm w-full max-w-sm text-center">
              <h3 className="font-semibold text-foreground">{materialData.title}</h3>
              {materialData.component}
              <p className="text-sm text-muted-foreground">Initial: {materialData.initial}</p>
              <p className="text-sm font-semibold text-accent h-5">{heated[stage] ? `Final: ${materialData.final}` : ''}</p>
            </div>

            {isSimulating && (
                <div className="flex justify-center items-center h-10">
                    <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                    <Flame className="w-10 h-10 text-red-500 animate-pulse" style={{animationDelay: '0.2s'}} />
                    <Flame className="w-8 h-8 text-orange-500 animate-pulse" style={{animationDelay: '0.4s'}} />
                </div>
            )}
            
            {!heated[stage] && (
                <Button onClick={() => handleHeat(stage)} disabled={isSimulating}>
                    {isSimulating ? "Heating..." : "Apply Heat"}
                </Button>
            )}
             {heated[stage] && !isSimulating && (
                <Button onClick={handleNextStage}>
                   {stage === 'alcohol' ? 'Proceed to Quiz' : 'Next Stage →'}
                </Button>
            )}
          </div>
        );
      
      case 'quiz':
      case 'complete':
        return (
          <div className="w-full max-w-md mx-auto">
            <p className="mb-2 font-medium">Which of the following expanded the most after heating?</p>
            <RadioGroup value={quizAnswer} onValueChange={handleQuizChange} disabled={quizIsCorrect !== null}>
                <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="metal" id="q-metal" /><Label htmlFor="q-metal">Metal Rod</Label></div>
                <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="water" id="q-water" /><Label htmlFor="q-water">Water</Label></div>
                <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="alcohol" id="q-alcohol" /><Label htmlFor="q-alcohol">Alcohol</Label></div>
            </RadioGroup>
            {quizFeedback && (
              <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", quizIsCorrect === true && "text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300", quizIsCorrect === false && "text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300", quizIsCorrect === null && quizAttempts === 1 && "text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300")}>
                {quizIsCorrect === true && <CheckCircle className="h-5 w-5" />}
                {quizIsCorrect === false && <XCircle className="h-5 w-5" />}
                {quizIsCorrect === null && quizAttempts === 1 && <RefreshCw className="h-5 w-5 animate-spin" />}
                {quizFeedback}
              </p>
            )}
            <div className="mt-4">
                <Button onClick={handleQuizSubmit} disabled={!quizAnswer || quizIsCorrect !== null} size="sm">
                {quizIsCorrect === true ? "Correct!" : quizIsCorrect === false ? "Answer Shown" : quizAttempts === 1 && quizIsCorrect === null ? "Try Again" : "Check Answer"}
                </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Objective</CardTitle>
            <TextToSpeech textToSpeak="To investigate and compare how heat affects the expansion of different states of matter." />
          </div>
          <CardDescription>To investigate and compare how heat affects the expansion of different states of matter.</CardDescription>
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
                  <p>Thermal expansion is the tendency of matter to change its shape, area, volume, and density in response to a change in temperature. According to the kinetic theory of matter, when a substance is heated, its particles gain kinetic energy and move more vigorously, pushing each other further apart.</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>In <strong>solids</strong>, this causes a slight increase in length, area, or volume.</li>
                    <li>In <strong>liquids</strong>, the expansion is generally more noticeable than in solids because particles are less tightly bound.</li>
                    <li>Different materials expand at different rates, a property described by their <strong>coefficient of thermal expansion</strong>.</li>
                  </ul>
                </div>
                <TextToSpeech textToSpeak="Thermal expansion is the tendency of matter to change its shape, area, volume, and density in response to a change in temperature. When a substance is heated, its particles gain kinetic energy and move more vigorously, pushing each other further apart." className="flex-shrink-0" />
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
                  <ul className="list-disc pl-5 space-y-1">
                    <li>In a real lab, always wear safety goggles when working with heat sources.</li>
                    <li>Use tongs or heat-resistant gloves to handle hot objects like the metal rod.</li>
                    <li>Be cautious when heating liquids to avoid boiling over and splashes.</li>
                    <li>Never leave a heat source unattended.</li>
                  </ul>
                </div>
                <TextToSpeech textToSpeak="In a real lab, always wear safety goggles when working with heat sources. Use tongs or heat-resistant gloves to handle hot objects. Be cautious when heating liquids to avoid boiling over. Never leave a heat source unattended." className="flex-shrink-0" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experiment Simulation</CardTitle>
          <CardDescription>Follow the stages to observe the effects of heat on each material.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg">
          {renderStageContent()}
        </CardContent>
         <CardFooter className="flex flex-wrap justify-center gap-4 pt-4">
          <div className="flex flex-wrap justify-center gap-2">
               <Button variant="outline" size="sm" onClick={() => setStage('solid')} disabled={stage === 'solid'}>Conduction</Button>
               <Button variant="outline" size="sm" onClick={() => setStage('water')} disabled={stage === 'water'}>Convection</Button>
               <Button variant="outline" size="sm" onClick={() => setStage('alcohol')} disabled={stage === 'alcohol'}>Radiation</Button>
               <Button variant="default" size="sm" onClick={() => setStage('quiz')} disabled={!heated.solid || !heated.water || !heated.alcohol}>Go to Quiz</Button>
          </div>
           <Button variant="destructive" size="sm" onClick={handleReset}>Reset Lab</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lab Report</CardTitle>
          <CardDescription>Generate a summary of your findings after completing the experiment.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="secondary" onClick={handleGenerateReport} disabled={stage !== 'quiz' && stage !== 'complete'}>Generate Report</Button>
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
