
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, ArrowRightLeft, BookOpen, Shield } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TeacherVoice } from './TeacherVoice';

export function OsmosisLab() {
  const { toast } = useToast();
  const [setup, setSetup] = React.useState<'none' | 'sugar-in-water' | 'water-in-sugar'>('none');
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
  const [resultText, setResultText] = React.useState('');
  const [showResult, setShowResult] = React.useState(false);
  const [isSimulating, setIsSimulating] = React.useState(false);

  // Quiz State
  const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
  const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
  const [quizAttempts, setQuizAttempts] = React.useState(0);
  const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

  const handleSetup = (type: 'sugar-in-water' | 'water-in-sugar') => {
    setSetup(type);
    setShowResult(false);
    setResultText('');
    resetQuiz();
  };

  const handleStart = () => {
    let outcome = '';
    if (setup === 'sugar-in-water') {
      outcome = 'Water moves into the tubing, causing it to swell.';
    } else if (setup === 'water-in-sugar') {
      outcome = 'Water moves out of the tubing, causing it to shrink.';
    } else {
      toast({ title: 'No setup selected', description: 'Please choose an experiment setup first.', variant: 'destructive' });
      return;
    }
    
    setIsSimulating(true);
    toast({ title: 'Experiment Running...', description: 'Observing water movement across the membrane.' });
    
    setTimeout(() => {
      setResultText(outcome);
      setShowResult(true);
      setIsSimulating(false);
    }, 2500);
  };
  
  const handleReset = () => {
    setSetup('none');
    setShowResult(false);
    setResultText('');
    resetQuiz();
    toast({ title: "Lab Reset", description: "Ready for a new experiment." });
  };

  const resetQuiz = () => {
      setQuizAnswer(undefined);
      setQuizFeedback(null);
      setQuizAttempts(0);
      setQuizIsCorrect(null);
  };

  const handleQuizSubmit = () => {
    if (quizIsCorrect !== null) return;
    const isCorrect = quizAnswer === 'low-to-high';
    const newAttempts = quizAttempts + 1;
    setQuizAttempts(newAttempts);
    if (isCorrect) {
      setQuizIsCorrect(true);
      setQuizFeedback("Correct! Osmosis is the movement of water from an area of low solute concentration to high solute concentration across a semi-permeable membrane. ✅");
    } else {
      if (newAttempts === 1) {
        setQuizFeedback("Not quite. Think about where the water wants to go to dilute the more concentrated solution. Try again! 🔄");
      } else {
        setQuizIsCorrect(false);
        setQuizFeedback("Incorrect. Water moves from low solute concentration (more water) to high solute concentration (less water). 🧠");
      }
    }
  };

  const handleQuizChange = (value: string) => {
    setQuizAnswer(value);
    if (quizIsCorrect !== null || (quizAttempts > 0 && quizIsCorrect === null)) {
      if (!(quizAttempts === 1 && quizIsCorrect === null)) {
        resetQuiz();
      }
    }
  };
  
  const handleGenerateReport = () => {
      toast({
        title: 'Lab Report Generated (Simulation)',
        description: `Setup: ${setup}. Result: ${resultText || 'Not run'}. Quiz: ${quizIsCorrect === true ? 'Correct' : quizIsCorrect === false ? 'Incorrect' : 'Not Attempted'}.`
      });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Objective</CardTitle>
          <CardDescription>To observe osmosis through a semi-permeable membrane using dialysis tubing, demonstrating water movement based on solute concentration.</CardDescription>
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
              <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                <p><strong>Osmosis</strong> is the net movement of water molecules across a <strong>selectively permeable membrane</strong> from a region of higher water concentration (lower solute concentration) to a region of lower water concentration (higher solute concentration).</p>
                <p className="mt-2">This process is crucial for living organisms, helping cells maintain their water balance. The dialysis tubing in this lab acts as an artificial semi-permeable membrane.</p>
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
                  <li>In a real lab, handle glassware like beakers with care to prevent breakage.</li>
                  <li>Ensure dialysis tubing is properly secured to prevent leaks.</li>
                  <li>Clean up any spills immediately to avoid slips.</li>
                  <li>While the substances here are safe (sugar, water), always treat lab materials with respect and follow instructions.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experiment Setup</CardTitle>
          <CardDescription>Choose a setup, then press "Start Experiment" to simulate osmosis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium">1. Choose Setup:</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant={setup === 'sugar-in-water' ? 'default' : 'outline'}
              onClick={() => handleSetup('sugar-in-water')}
              className="flex-1"
            >
              Tubing with Sugar Solution in Beaker of Water
            </Button>
            <Button
              variant={setup === 'water-in-sugar' ? 'default' : 'outline'}
              onClick={() => handleSetup('water-in-sugar')}
               className="flex-1"
            >
              Tubing with Water in Beaker of Sugar Solution
            </Button>
          </div>
          
           {/* Visual Simulation Area */}
          <div className="relative w-full max-w-sm mx-auto h-52 border-x-2 border-b-2 border-gray-300 dark:border-gray-600 rounded-b-xl bg-blue-100/20 dark:bg-blue-900/20 p-2 flex items-end justify-center overflow-hidden">
              {/* Water Level */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-blue-500/10"></div>
  
              {/* Labels for beaker and tubing */}
              <span className="absolute top-2 right-2 text-xs text-blue-800 dark:text-blue-300">
                  {setup === 'sugar-in-water' ? 'Beaker: Pure Water' : (setup === 'water-in-sugar' ? 'Beaker: Sugar Solution' : 'Beaker: ?')}
              </span>
              <span className="absolute top-2 left-2 text-xs text-red-800 dark:text-red-300">
                  {setup === 'sugar-in-water' ? 'Tubing: Sugar Solution' : (setup === 'water-in-sugar' ? 'Tubing: Pure Water' : 'Tubing: ?')}
              </span>
  
              {/* Dialysis Tubing */}
              <div className={cn(
                  "relative w-24 h-32 rounded-[2rem] border-2 border-red-500/50 bg-red-100/30 dark:bg-red-900/30 flex items-center justify-center transition-transform duration-1000",
                  showResult && setup === 'sugar-in-water' && "scale-110", // Swell
                  showResult && setup === 'water-in-sugar' && "scale-90" // Shrink
              )}>
                  <p className="text-xs font-medium text-red-800 dark:text-red-200">Tubing</p>
              </div>
  
              {/* Arrows for osmosis */}
              {showResult && setup === 'sugar-in-water' && (
                  <ArrowRightLeft className="absolute top-1/2 left-[calc(50%-70px)] -translate-y-1/2 h-8 w-8 text-blue-600 animate-pulse" aria-label="Water moving into tubing" />
              )}
              {showResult && setup === 'water-in-sugar' && (
                  <ArrowRightLeft className="absolute top-1/2 left-[calc(50%+40px)] -translate-y-1/2 h-8 w-8 text-red-600 animate-pulse" style={{transform: 'translateY(-50%) scaleX(-1)'}} aria-label="Water moving out of tubing" />
              )}
  
              {/* Text result overlay */}
              <div className="absolute bottom-2 w-full text-center">
                  {isSimulating ? (
                      <div className="flex items-center justify-center gap-2 text-primary">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Simulating...</span>
                      </div>
                  ) : showResult ? (
                      <p className="text-sm font-semibold text-foreground bg-background/80 px-2 py-1 rounded">🔬 {resultText}</p>
                  ) : setup === 'none' ? (
                      <p className="text-muted-foreground text-sm">Select a setup to begin.</p>
                  ) : (
                      <p className="text-muted-foreground text-sm">Press "Start Experiment".</p>
                  )}
              </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={handleStart} disabled={setup === 'none' || isSimulating}>
            {isSimulating ? 'Running...' : 'Start Experiment'}
          </Button>
           <Button variant="outline" onClick={handleReset}>Reset</Button>
        </CardFooter>
      </Card>

      {showResult && (
        <Card>
          <CardHeader>
            <CardTitle>Post-Lab Quiz</CardTitle>
            <CardDescription>Based on your observation, what is the rule for water movement in osmosis?</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={quizAnswer} onValueChange={handleQuizChange} disabled={quizIsCorrect !== null}>
              <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="low-to-high" id="q-a" /><Label htmlFor="q-a">Water moves from low solute concentration to high solute concentration.</Label></div>
              <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="high-to-low" id="q-b" /><Label htmlFor="q-b">Water moves from high solute concentration to low solute concentration.</Label></div>
              <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="no-move" id="q-c" /><Label htmlFor="q-c">Water does not move at all.</Label></div>
            </RadioGroup>
            {quizFeedback && <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", quizIsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100", quizIsCorrect === null && "text-blue-700 bg-blue-100")}>{quizIsCorrect ? <CheckCircle/> : quizAttempts > 1 ? <XCircle/> : <RefreshCw className="animate-spin"/>}{quizFeedback}</p>}
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
          <CardDescription>Generate a summary of your experiment configuration and results.</CardDescription>
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
