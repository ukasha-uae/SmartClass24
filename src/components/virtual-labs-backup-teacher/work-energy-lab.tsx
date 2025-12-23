
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Move, ArrowDown, BarChart, Clock } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

// --- Constants ---
const GRAVITY = 9.81; // m/s^2
const MASS = 2; // kg, simplified
const MAX_HEIGHT_METERS = 10; // Max virtual height in meters
const SVG_WIDTH = 400;
const SVG_HEIGHT = 250;
const RAMP_START_X = 50;
const RAMP_END_X = 350;

// --- Helper Component for Highlighted Text ---
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


export function WorkEnergyLab() {
    const { toast } = useToast();
    const [isDragging, setIsDragging] = React.useState(false);
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [isRunning, setIsRunning] = React.useState(false);
    const [height, setHeight] = React.useState(5); // Initial height in meters
    
    // Animation state
    const [currentHeight, setCurrentHeight] = React.useState(height);
    const [results, setResults] = React.useState<{ time: number, maxSpeed: number } | null>(null);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    const animationFrameId = React.useRef<number>();

    // Derived values for physics and visuals
    const rampLength = Math.sqrt(Math.pow(RAMP_END_X - RAMP_START_X, 2) + Math.pow(height * 20, 2));
    const rampAngleRad = Math.asin((height * 20) / rampLength);
    const acceleration = GRAVITY * Math.sin(rampAngleRad);
    
    const maxPotentialEnergy = MASS * GRAVITY * height;
    const currentPotentialEnergy = MASS * GRAVITY * currentHeight;
    const currentKineticEnergy = isRunning ? maxPotentialEnergy - currentPotentialEnergy : 0;
    
    // --- Event Handlers for Dragging ---
    const svgRef = React.useRef<SVGSVGElement>(null);

    const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (isRunning) return;
        setIsDragging(true);
    };

    const handleInteractionMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !svgRef.current) return;
        const svg = svgRef.current;
        const pt = svg.createSVGPoint();

        if ('touches' in e) {
            pt.x = e.touches[0].clientX;
            pt.y = e.touches[0].clientY;
        } else {
            pt.x = e.clientX;
            pt.y = e.clientY;
        }

        const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
        const newPixelHeight = Math.max(0, Math.min(200, SVG_HEIGHT - 50 - svgP.y));
        const newMeters = (newPixelHeight / 200) * MAX_HEIGHT_METERS;
        setHeight(newMeters);
        setCurrentHeight(newMeters);
        setResults(null);
    };

    const handleInteractionEnd = () => {
        setIsDragging(false);
    };

    React.useEffect(() => {
        document.addEventListener('mouseup', handleInteractionEnd);
        document.addEventListener('touchend', handleInteractionEnd);
        return () => {
            document.removeEventListener('mouseup', handleInteractionEnd);
            document.removeEventListener('touchend', handleInteractionEnd);
        };
    }, []);

    // --- Simulation Logic ---
    const runSimulation = React.useCallback(() => {
        let startTime: number | null = null;
        let startHeight = height; // Capture initial height for this run
        
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const timeElapsed = (timestamp - startTime) / 1000;

            const distanceTravelled = 0.5 * acceleration * timeElapsed * timeElapsed;
            const proportionTravelled = distanceTravelled / rampLength;
            const newCurrentHeight = startHeight * (1 - proportionTravelled);

            if (newCurrentHeight > 0) {
                setCurrentHeight(newCurrentHeight);
                animationFrameId.current = requestAnimationFrame(animate);
            } else {
                setCurrentHeight(0);
                setIsRunning(false);
                const finalTime = Math.sqrt((2 * rampLength) / acceleration);
                const finalSpeed = acceleration * finalTime;
                setResults({ time: finalTime, maxSpeed: finalSpeed });
            }
        };

        animationFrameId.current = requestAnimationFrame(animate);
    }, [height, acceleration, rampLength]);

    React.useEffect(() => {
        if (isRunning) {
            runSimulation();
        }
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [isRunning, runSimulation]);
    
    const handleRelease = () => {
        if(height === 0) {
            toast({ title: "No Potential Energy!", description: "Raise the block to a height first.", variant: "destructive"});
            return;
        }
        setResults(null);
        setIsRunning(true);
    };

    const handleReset = () => {
        setIsRunning(false);
        setIsDragging(false);
        setHeight(5);
        setCurrentHeight(5);
        setResults(null);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setHighlightInfo(null);
        toast({ title: 'Lab Reset' });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'c';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! Kinetic energy (energy of motion) is greatest when the object is moving fastest, just before it stops. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite right. Where would the object be moving the fastest? Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. Kinetic energy is maximized at the bottom of the ramp. 🧠");
            }
        }
    };
    
    const handleGenerateReport = () => {
        if (!results) {
          toast({
            title: "No data to report",
            description: "Please run the simulation first.",
            variant: "destructive",
          });
          return;
        }
    
        toast({
          title: "Lab Report Generated (Simulation)",
          description: `The block was released from a height of ${height.toFixed(
            1
          )}m. It reached a maximum speed of ${results.maxSpeed.toFixed(
            2
          )} m/s at the bottom in ${results.time.toFixed(2)}s.`,
          duration: 9000,
        });
    };

     const objectiveText = "To demonstrate the conversion between potential energy and kinetic energy as an object moves down an inclined plane.";
     const theoryText = "The Law of Conservation of Energy states that energy cannot be created or destroyed, only transformed. Potential Energy (PE) is stored energy due to an object's position (PE = mgh). Kinetic Energy (KE) is the energy of motion (KE = ½mv²). As the block slides down the ramp, its potential energy is converted into kinetic energy. Ignoring friction, the total mechanical energy (PE + KE) remains constant.";
     const safetyText = "This is a virtual lab with no physical risks. In a real-world scenario, ensure the ramp is stable and the surrounding area is clear. Be mindful of the moving object.";

    const blockX = RAMP_END_X - ((currentHeight / height) * (RAMP_END_X - RAMP_START_X));
    const blockY = SVG_HEIGHT - 50 - currentHeight * 20;

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
              <CardHeader><CardTitle>Lab Information</CardTitle></CardHeader>
              <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="theory">
                          <AccordionTrigger><div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /><span>Background Theory</span></div></AccordionTrigger>
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
                          <AccordionTrigger><div className="flex items-center gap-2"><Shield className="h-4 w-4" /><span>Safety Precautions</span></div></AccordionTrigger>
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
                  <CardTitle>Work & Energy Simulation</CardTitle>
                  <CardDescription>Drag the block to set the height, then release it to observe energy conversion.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 relative w-full h-80 bg-muted/30 dark:bg-muted/50 rounded-lg p-2 border">
                      <svg ref={svgRef} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-full" onMouseMove={handleInteractionMove} onTouchMove={handleInteractionMove}>
                          <line x1="0" y1={SVG_HEIGHT - 50} x2={RAMP_END_X + 20} y2={SVG_HEIGHT - 50} stroke="hsl(var(--foreground))" strokeWidth="2" />
                          <line x1={RAMP_START_X} y1={SVG_HEIGHT - 50} x2={RAMP_END_X} y2={SVG_HEIGHT - 50 - height * 20} stroke="hsl(var(--foreground))" strokeWidth="2" />
                          <line x1={RAMP_END_X} y1={SVG_HEIGHT - 50} x2={RAMP_END_X} y2={SVG_HEIGHT - 50 - height * 20} stroke="hsl(var(--muted-foreground))" strokeDasharray="3,3" />
                          <text x={RAMP_END_X + 5} y={SVG_HEIGHT - 50 - height * 10} className="text-xs fill-muted-foreground">h = {height.toFixed(1)}m</text>
                          
                          <rect
                              x={blockX - 10}
                              y={blockY - 20}
                              width="20"
                              height="20"
                              className="fill-accent cursor-grab active:cursor-grabbing"
                              onMouseDown={handleInteractionStart}
                              onTouchStart={handleInteractionStart}
                          />
                      </svg>
                  </div>
                  <div className="space-y-4">
                      <h4 className="font-semibold">Energy Bars</h4>
                      <div className="space-y-2">
                          <Label>Potential Energy (PE)</Label>
                          <div className="w-full h-8 bg-muted rounded-md overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${(currentPotentialEnergy / maxPotentialEnergy) * 100}%` }}></div></div>
                          <span className="text-xs">{currentPotentialEnergy.toFixed(1)} J</span>
                      </div>
                       <div className="space-y-2">
                          <Label>Kinetic Energy (KE)</Label>
                          <div className="w-full h-8 bg-muted rounded-md overflow-hidden"><div className="h-full bg-red-500 transition-all duration-100" style={{ width: `${(currentKineticEnergy / maxPotentialEnergy) * 100}%` }}></div></div>
                           <span className="text-xs">{currentKineticEnergy.toFixed(1)} J</span>
                      </div>
                      {results && (
                          <div className="pt-4 border-t">
                              <h4 className="font-semibold">Results</h4>
                              <p className="text-sm">Max Speed: <span className="font-bold">{results.maxSpeed.toFixed(2)} m/s</span></p>
                              <p className="text-sm">Time Taken: <span className="font-bold">{results.time.toFixed(2)} s</span></p>
                          </div>
                      )}
                  </div>
              </CardContent>
              <CardFooter className="flex justify-center gap-4">
                  <Button onClick={handleRelease} disabled={isRunning}><ArrowDown className="mr-2 h-4 w-4"/>Release</Button>
                  <Button variant="outline" onClick={handleReset}>Reset</Button>
              </CardFooter>
          </Card>

           <Card>
              <CardHeader>
                  <CardTitle>Post-Lab Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="mb-2 font-medium">At what point on the ramp does the object have the most kinetic energy?</p>
                   <RadioGroup value={quizAnswer} onValueChange={(v) => {setQuizAnswer(v); if(quizIsCorrect !== null) { setQuizIsCorrect(null); setQuizAttempts(0); setQuizFeedback(null); }}}>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="q-a"/><Label htmlFor="q-a">At the top</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="b" id="q-b"/><Label htmlFor="q-b">Halfway down</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="c" id="q-c"/><Label htmlFor="q-c">Just before it reaches the bottom</Label></div>
                   </RadioGroup>
                   {quizFeedback && <p className={cn("mt-2 text-sm flex items-center gap-2", quizIsCorrect ? 'text-green-600' : 'text-red-600')}>{quizIsCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {quizFeedback}</p>}
              </CardContent>
              <CardFooter>
                  <Button onClick={handleQuizSubmit} size="sm" disabled={!quizAnswer || quizIsCorrect !== null}>Check Answer</Button>
              </CardFooter>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle>Lab Report</CardTitle>
              </CardHeader>
               <CardFooter>
                  <Button variant="secondary" disabled={!results} onClick={handleGenerateReport}>Generate Report</Button>
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
