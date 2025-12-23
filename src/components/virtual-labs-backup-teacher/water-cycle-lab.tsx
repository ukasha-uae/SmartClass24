
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, Sun, CloudRain, Droplets, Waves, Mountain, BookOpen, Shield } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
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


export function WaterCycleLab() {
  const { toast } = useToast();
  const [step, setStep] = React.useState<'start' | 'evaporation' | 'condensation' | 'precipitation' | 'collection'>('start');
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
  const [cycleComplete, setCycleComplete] = React.useState(false);

  // Quiz State
  const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
  const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
  const [quizAttempts, setQuizAttempts] = React.useState(0);
  const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);
  const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

  const handleNextStep = () => {
    if (step === 'start') setStep('evaporation');
    else if (step === 'evaporation') setStep('condensation');
    else if (step === 'condensation') setStep('precipitation');
    else if (step === 'precipitation') {
      setStep('collection');
      setCycleComplete(true);
      toast({ title: 'Cycle Complete!', description: 'You have observed all stages of the water cycle.' });
    }
  };
  
  const handleReset = () => {
      setStep('start');
      setCycleComplete(false);
      setQuizAnswer(undefined);
      setQuizFeedback(null);
      setQuizAttempts(0);
      setQuizIsCorrect(null);
      setHighlightInfo(null);
      toast({ title: "Lab Reset", description: "The simulation has been reset." });
  }

  const handleReport = () => {
    toast({
      title: 'Lab Report Generated (Simulation)',
      description: 'You simulated all stages of the water cycle successfully, observing evaporation, condensation, precipitation, and collection.',
    });
  };
  
  const handleQuizSubmit = () => {
    if (quizIsCorrect !== null) return;
    const isCorrect = quizAnswer === 'condensation';
    const newAttempts = quizAttempts + 1;
    setQuizAttempts(newAttempts);
    if (isCorrect) {
      setQuizIsCorrect(true);
      setQuizFeedback("Correct! Condensation is the formation of clouds from water vapor. ✅");
    } else {
      if (newAttempts === 1) {
        setQuizFeedback("Not quite. Think about what happens right after water turns into vapor. Try again! 🔄");
      } else {
        setQuizIsCorrect(false);
        setQuizFeedback("Incorrect. Condensation follows evaporation. 🧠");
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
  
  const getStageDescription = () => {
    switch(step) {
      case 'start': return 'Click "Next Stage" to begin the water cycle.';
      case 'evaporation': return 'The sun heats the water, causing it to evaporate. See the water vapor rise.';
      case 'condensation': return 'As the water vapor rises, it cools and forms clouds. This process is called condensation.';
      case 'precipitation': return 'The cloud becomes heavy with water and releases it back to the earth as rain.';
      case 'collection': return 'The rainwater gathers in rivers, lakes, and oceans. This is called collection, and the cycle can begin again.';
      default: return '';
    }
  };

  const objectiveText = "To simulate the stages of the water cycle and observe how water moves through the environment.";
  const theoryText = "The water cycle, or hydrologic cycle, describes the continuous movement of water on, above, and below the surface of the Earth. This global cycle is essential for life. The main stages are: Evaporation, where liquid water turns into gas (water vapor). Condensation, where water vapor cools and turns back into liquid droplets, forming clouds. Precipitation, where water falls from clouds as rain, snow, or hail. And Collection, where water gathers in oceans, lakes, rivers, and underground.";
  const safetyText = "This is a safe, virtual simulation with no physical risks. In a real-world setting involving water experiments, one should always be mindful of slippery surfaces from spills, using clean water sources, and proper handling of any heating elements used to demonstrate evaporation.";


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
          <CardTitle>Water Cycle Simulation</CardTitle>
          <CardDescription>
            Click "Next Stage" to advance through the water cycle.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 bg-muted/30 p-4 rounded-lg text-center">
            {/* Enhanced Visual Area */}
            <div className="relative w-full h-64 bg-sky-100 dark:bg-sky-900/50 rounded-lg overflow-hidden border">
                {/* Sun */}
                <Sun className={cn(
                    "absolute top-4 left-4 h-12 w-12 text-yellow-400 transition-all duration-1000",
                    step === 'evaporation' && "animate-pulse drop-shadow-[0_0_8px_rgba(250,204,21,1)]"
                )} />

                {/* Land and Water */}
                <Mountain className="absolute bottom-0 right-0 h-32 w-48 text-green-800/80 dark:text-green-900/90" />
                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-blue-500/80 dark:bg-blue-700/80 flex items-center justify-center">
                   <Waves className="h-8 w-16 text-white/30" />
                </div>
                
                {/* Evaporation Animation */}
                <div className={cn("absolute bottom-[25%] left-[20%] transition-opacity duration-1000", step === 'evaporation' ? 'opacity-100' : 'opacity-0')}>
                   <Droplets className="h-4 w-4 text-blue-300 animate-bounce" style={{animationDuration: '2s'}}/>
                   <Droplets className="h-5 w-5 text-blue-300 animate-bounce ml-4" style={{animationDuration: '1.5s', animationDelay: '0.3s'}}/>
                   <Droplets className="h-4 w-4 text-blue-300 animate-bounce ml-8" style={{animationDuration: '1.8s', animationDelay: '0.6s'}}/>
                </div>
                
                {/* Condensation & Clouds */}
                <CloudRain className={cn(
                  "absolute top-10 right-10 h-16 w-16 text-gray-300 dark:text-gray-500 transition-all duration-1000 opacity-0 scale-50", 
                  (step === 'condensation' || step === 'precipitation' || step === 'collection') && "opacity-100 scale-125 text-white dark:text-gray-300 drop-shadow-lg"
                )} />

                {/* Precipitation Animation */}
                <div className={cn("absolute top-28 right-16 transition-opacity duration-1000", step === 'precipitation' ? 'opacity-100' : 'opacity-0')}>
                    <div className="absolute h-6 w-0.5 bg-blue-400 animate-pulse" style={{animationDuration: '0.5s', animationDelay: '0.1s'}}></div>
                    <div className="absolute h-6 w-0.5 bg-blue-400 animate-pulse ml-2" style={{animationDuration: '0.5s', animationDelay: '0.3s'}}></div>
                    <div className="absolute h-6 w-0.5 bg-blue-400 animate-pulse ml-4" style={{animationDuration: '0.5s', animationDelay: '0.2s'}}></div>
                </div>

                {/* Collection/Runoff Animation */}
                <div className={cn(
                    "absolute bottom-12 right-12 w-20 h-1 bg-blue-400/50 rounded-full transition-all duration-1000 -translate-x-full opacity-0",
                    step === 'collection' && "translate-x-0 opacity-100"
                )} style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)' }}></div>
            </div>
            
          <p className="font-semibold text-lg text-foreground mt-4">
            🔄 Current Stage: {step.charAt(0).toUpperCase() + step.slice(1)}
          </p>
          <p className="text-sm text-muted-foreground min-h-[40px]">
            {getStageDescription()}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={handleNextStep} disabled={cycleComplete}>
            {cycleComplete ? 'Cycle Completed' : 'Next Stage →'}
          </Button>
          <Button variant="outline" onClick={handleReset}>Reset Cycle</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Quiz</CardTitle>
          <CardDescription>Test your knowledge of the water cycle.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-2 font-medium">Which stage comes after evaporation?</p>
          <RadioGroup value={quizAnswer} onValueChange={handleQuizChange} disabled={quizIsCorrect !== null}>
              <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="collection" id="q-collection" /><Label htmlFor="q-collection">Collection</Label></div>
              <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="condensation" id="q-condensation" /><Label htmlFor="q-condensation">Condensation</Label></div>
              <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="precipitation" id="q-precipitation" /><Label htmlFor="q-precipitation">Precipitation</Label></div>
          </RadioGroup>
          {quizFeedback && <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", quizIsCorrect ? "text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300" : "text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300", quizIsCorrect === null && "text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300")}>{quizIsCorrect ? <CheckCircle className="h-4 w-4"/> : quizAttempts > 1 ? <XCircle className="h-4 w-4"/> : <RefreshCw className="h-4 w-4 animate-spin"/>}{quizFeedback}</p>}
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
          <CardDescription>Summarize what you’ve learned.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="secondary" onClick={handleReport}>Generate Report</Button>
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
