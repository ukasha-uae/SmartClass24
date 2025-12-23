
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, Droplets, Box, Layers, Eraser, Cog, Diamond, BookOpen, Shield } from 'lucide-react';
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


// --- Define a simple SVG component for the Cork ---
const CorkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <ellipse cx="50" cy="20" rx="25" ry="10" fill="#D2B48C" stroke="#8B4513" strokeWidth="2" />
        <rect x="25" y="20" width="50" height="60" fill="#D2B48C" />
        <ellipse cx="50" cy="80" rx="25" ry="10" fill="#D2B48C" stroke="#8B4513" strokeWidth="2" />
    </svg>
);


interface Material {
    density: number;
    result: 'sinks' | 'floats';
    icon: React.ComponentType<{ className?: string }>;
}

const materials: Record<string, Material> = {
    Cork: { density: 0.24, result: 'floats', icon: (props) => <CorkIcon {...props} style={{ width: '100%', height: '100%' }} /> },
    Wood: { density: 0.6, result: 'floats', icon: Layers },
    Plastic: { density: 0.9, result: 'floats', icon: Box },
    Rubber: { density: 1.3, result: 'sinks', icon: Eraser },
    Stone: { density: 2.5, result: 'sinks', icon: Diamond },
    Metal: { density: 7.8, result: 'sinks', icon: Cog },
};

export function DensityLab() {
  const { toast } = useToast();
  const [selectedMaterial, setSelectedMaterial] = React.useState<string | null>(null);
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
  const [result, setResult] = React.useState<'sinks' | 'floats' | null>(null);
  const [isSimulating, setIsSimulating] = React.useState(false);

  // Quiz State
  const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
  const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
  const [quizAttempts, setQuizAttempts] = React.useState(0);
  const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);
  const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

  const resetQuiz = () => {
    setQuizAnswer(undefined);
    setQuizFeedback(null);
    setQuizAttempts(0);
    setQuizIsCorrect(null);
  };
  
  const handleDrop = (material: string) => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSelectedMaterial(material);
    setResult(null); // Hide previous result immediately
    resetQuiz();

    toast({ title: `Dropping ${material}...` });

    setTimeout(() => {
        const outcome = materials[material].result;
        setResult(outcome);
        setIsSimulating(false);
        toast({ title: 'Observation', description: `${material} ${outcome}!` });
    }, 1500);
  };

  const handleReport = () => {
    if (!selectedMaterial) {
        toast({ title: 'No Data', description: 'Please test a material first.', variant: 'destructive'});
        return;
    };
    const density = materials[selectedMaterial].density;
    toast({
      title: 'Lab Report Generated',
      description: `You tested ${selectedMaterial}. It ${result} because its density is ${density}g/cm³.`
    });
  };
  
  const handleResetLab = () => {
      setSelectedMaterial(null);
      setResult(null);
      resetQuiz();
      toast({ title: "Lab Reset", description: "Select a material to test." });
  };

  const handleQuizSubmit = () => {
    if (quizIsCorrect !== null) return;
    const isCorrect = quizAnswer === 'metal';
    const newAttempts = quizAttempts + 1;
    setQuizAttempts(newAttempts);
    if (isCorrect) {
      setQuizIsCorrect(true);
      setQuizFeedback("Correct! Metal is the densest among these options and will sink. ✅");
    } else {
      if (newAttempts === 1) {
        setQuizFeedback("Not quite. Think about which material is the heaviest for its size. Try again! 🔄");
      } else {
        setQuizIsCorrect(false);
        setQuizFeedback("Incorrect. Metal is the most likely to sink due to its high density. 🧠");
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
  
  const MaterialIcon = selectedMaterial ? materials[selectedMaterial].icon : Box;

  const objectiveText = "To investigate how the density of different materials determines whether they float or sink in water.";
  const theoryText = "Density is a measure of how much 'stuff' (mass) is packed into a certain space (volume). The formula is: Density = Mass / Volume. If an object's density is less than the density of water (approx. 1 g/cm³), it will float. If an object's density is greater than the density of water, it will sink. This principle is related to buoyancy and Archimedes' principle.";
  const safetyText = "While this is a simulation, always approach science with a safety-first mindset. In a real lab, handle materials carefully and be aware of any sharp edges on metal or stone samples. Avoid splashing water and keep your work area clean and dry. Always wash your hands after handling lab materials.";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Objective</CardTitle>
            <TextToSpeech
                textToSpeak={objectiveText}
                onSentenceChange={(sentenceIndex) => setHighlightInfo({ section: 'objective', sentenceIndex })}
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
                    onSentenceChange={(sentenceIndex) => setHighlightInfo({ section: 'theory', sentenceIndex })}
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
          <CardTitle>Sink or Float Simulation</CardTitle>
          <CardDescription>Select an object to drop it into the beaker of water.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm font-medium">
                {Object.keys(materials).map((material) => (
                <Button
                    key={material}
                    onClick={() => handleDrop(material)}
                    variant={selectedMaterial === material ? 'default' : 'outline'}
                    disabled={isSimulating}
                >
                    {material}
                </Button>
                ))}
            </div>

            {/* Visual Beaker Simulation */}
            <div className="relative w-full max-w-xs mx-auto h-52 border-x-2 border-b-2 border-gray-300 dark:border-gray-600 rounded-b-xl bg-blue-100/30 dark:bg-blue-900/40 p-2 flex items-end justify-center overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-full bg-blue-500/10 flex items-center justify-center">
                    <Droplets className="h-16 w-16 text-blue-500/20" />
                </div>
                 {selectedMaterial && (
                     <div className={cn(
                         "absolute w-12 h-12 flex items-center justify-center text-yellow-900/80 dark:text-yellow-300/80 transition-all duration-1000 ease-in-out",
                         isSimulating && "top-[-50px]", // Start above
                         !isSimulating && result === 'floats' && "top-[10%]", // Float position
                         !isSimulating && result === 'sinks' && "bottom-[5%]" // Sink position
                     )}>
                         <MaterialIcon className="w-10 h-10" />
                     </div>
                 )}
                 {isSimulating && <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary font-semibold">Dropping...</p>}
            </div>

            {result && !isSimulating && (
                <p className="mt-4 text-base text-center font-semibold text-foreground">
                🔬 Observation: {selectedMaterial} <span className={cn(result === 'floats' ? "text-green-600" : "text-red-600")}>{result}!</span>
                </p>
            )}

        </CardContent>
         <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={handleResetLab}>Reset Lab</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Post-Lab Quiz</CardTitle>
          <CardDescription>Check your understanding of density.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-2 font-medium">Which material is most likely to sink in water?</p>
            <RadioGroup value={quizAnswer} onValueChange={handleQuizChange} disabled={quizIsCorrect !== null}>
              <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="plastic" id="q-plastic" /><Label htmlFor="q-plastic">Plastic</Label></div>
              <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="metal" id="q-metal" /><Label htmlFor="q-metal">Metal</Label></div>
              <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="cork" id="q-cork" /><Label htmlFor="q-cork">Cork</Label></div>
            </RadioGroup>
            {quizFeedback && <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", quizIsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100", quizIsCorrect === null && "text-blue-700 bg-blue-100")}>{quizIsCorrect ? <CheckCircle/> : quizAttempts > 1 ? <XCircle/> : <RefreshCw className="animate-spin"/>}{quizFeedback}</p>}
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
          <CardDescription>Summarize your test and results.</CardDescription>
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
