
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Move, Flame, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

// --- Type Definitions ---
type TubeContent = 'Hydrogen' | 'Air';
interface TubeResult {
    tested: boolean;
    reaction: 'pop' | 'none';
}

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


// --- Visual Components ---
const BurningSplintIcon = ({ ...props }) => (
    <div className="relative w-8 h-24" {...props}>
        <div className="absolute bottom-0 w-full h-full bg-orange-200 dark:bg-orange-900 rounded" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }} />
        <Flame className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 text-red-500" />
    </div>
);

const TestTubeSetup = ({ title, onDrop, onDragOver, onClick, isTarget, children }: { title: string; onDrop: React.DragEventHandler; onDragOver: React.DragEventHandler; onClick: React.MouseEventHandler; isTarget: boolean; children: React.ReactNode }) => (
    <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={onClick}
        className={cn(
            "p-4 border-2 border-dashed rounded-lg text-center space-y-2 w-full max-w-[150px] transition-colors",
            isTarget ? 'border-accent cursor-pointer animate-pulse' : 'border-muted-foreground/30'
        )}
    >
        <h3 className="font-semibold text-foreground">{title}</h3>
        <div className="relative w-20 h-40 mx-auto bg-gray-200/50 dark:bg-gray-800/50 rounded-t-lg border-x-2 border-t-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
            {children}
        </div>
    </div>
);


export function HydrogenPopTestLab() {
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const [results, setResults] = React.useState<Record<TubeContent, TubeResult>>({
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
        Hydrogen: { tested: false, reaction: 'none' },
        Air: { tested: false, reaction: 'none' }
    });
    const [isSimulating, setIsSimulating] = React.useState(false);
    const [draggedItem, setDraggedItem] = React.useState<string | null>(null);
    const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    // Reference to the Web Audio API context
    const audioCtxRef = React.useRef<AudioContext | null>(null);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);
    
    // Effect to clean up the AudioContext on unmount
    React.useEffect(() => {
        return () => {
            if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
                audioCtxRef.current.close();
            }
        };
    }, []);

    // Function to generate the "pop" sound
    const playPopSound = async () => {
        if (typeof window === 'undefined' || !window.AudioContext) return;
        
        if (!audioCtxRef.current) {
            audioCtxRef.current = new window.AudioContext();
        }
        const audioCtx = audioCtxRef.current;
        
        if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // A sharp sound envelope
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        
        // A quick frequency drop to create a "pop"
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.05);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.05);
    };

    const handleTest = (tube: TubeContent) => {
        if (isSimulating || results[tube].tested) return;

        setIsSimulating(true);
        toast({ title: "Testing...", description: `Inserting burning splint into tube with ${tube}.` });

        setTimeout(() => {
            const reactionResult = tube === 'Hydrogen' ? 'pop' : 'none';
            setResults(prev => ({...prev, [tube]: { tested: true, reaction: reactionResult }}));
            setIsSimulating(false);
            if (reactionResult === 'pop') {
                playPopSound(); // Play the sound
                toast({ title: "POP!", description: "A pop sound was heard, confirming hydrogen!", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" });
            } else {
                toast({ title: "No Reaction", description: "The splint continues to burn normally." });
            }
        }, 1500);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('text/plain', 'splint');
        setDraggedItem('splint');
    };
    const handleDragEnd = () => setDraggedItem(null);
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    
    const handleDrop = (tube: TubeContent) => {
        if (draggedItem === 'splint') {
            handleTest(tube);
        }
        setDraggedItem(null);
    };

    const handleMobileSelect = () => {
        if (!isMobile) return;
        setSelectedItem('splint');
        toast({ title: "Splint Selected", description: "Tap a test tube to insert." });
    };

    const handleMobileTubeTap = (tube: TubeContent) => {
        if (!isMobile || selectedItem !== 'splint') return;
        handleTest(tube);
        setSelectedItem(null);
    };

    const handleReset = () => {
        setResults({ Hydrogen: { tested: false, reaction: 'none' }, Air: { tested: false, reaction: 'none' } });
        setIsSimulating(false);
        setDraggedItem(null);
        setSelectedItem(null);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setHighlightInfo(null);
        toast({ title: "Lab Reset" });
    };
    
    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'b';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! The 'pop' sound is the characteristic test for hydrogen gas. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Think about the distinct sound hydrogen makes when it burns rapidly. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. The correct answer is 'Pop'. 🧠");
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
    
    const objectiveText = "To confirm the presence of hydrogen gas using the characteristic 'pop' sound produced when a burning splint is introduced.";
    const theoryText = "Hydrogen is a highly flammable gas. When a flame (like a burning splint) is introduced into a container of hydrogen, it reacts rapidly with the oxygen in the air. This miniature explosion produces a distinctive 'pop' sound. This test is a simple and reliable way to confirm the presence of hydrogen gas.";
    const safetyText = "In a real lab, always wear safety goggles. Hydrogen is flammable; handle with care away from other combustible materials. Perform the test on small quantities of gas to ensure the 'pop' is controlled.";

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
                            className="flex-shrink-0"
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
                            <AccordionTrigger><div className="flex items-center gap-2"><BookOpen className="h-4 w-4 mr-2"/>Background Theory</div></AccordionTrigger>
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
                            <AccordionTrigger><div className="flex items-center gap-2"><Shield className="h-4 w-4 mr-2"/>Safety Precautions</div></AccordionTrigger>
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
                    <CardDescription>{isMobile ? 'Tap the burning splint, then tap a test tube.' : 'Drag the burning splint into a test tube.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-center mb-8">
                        <div
                            draggable={!isMobile}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onClick={handleMobileSelect}
                            className={cn(
                                "p-2 border bg-card rounded-lg flex flex-col items-center gap-1 text-sm shadow-lg",
                                isMobile ? "cursor-pointer" : "cursor-grab active:cursor-grabbing",
                                selectedItem === 'splint' && "ring-2 ring-accent"
                            )}
                        >
                            <BurningSplintIcon />
                            <span className="text-xs">Burning Splint</span>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                        <TestTubeSetup title="Tube with Hydrogen" onDrop={() => handleDrop('Hydrogen')} onDragOver={handleDragOver} onClick={() => handleMobileTubeTap('Hydrogen')} isTarget={!!selectedItem}>
                            {results.Hydrogen.tested && results.Hydrogen.reaction === 'pop' && (
                                <Sparkles className="h-12 w-12 text-yellow-400" />
                            )}
                        </TestTubeSetup>
                        <TestTubeSetup title="Tube with Air" onDrop={() => handleDrop('Air')} onDragOver={handleDragOver} onClick={() => handleMobileTubeTap('Air')} isTarget={!!selectedItem}>
                             {/* No visual change for air */}
                        </TestTubeSetup>
                    </div>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button variant="outline" onClick={handleReset}>Reset Lab</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader><CardTitle>Post-Lab Quiz</CardTitle></CardHeader>
                <CardContent>
                     <p className="mb-2 font-medium">What sound confirms the presence of hydrogen gas when tested with a flame?</p>
                     <RadioGroup value={quizAnswer} onValueChange={handleQuizChange} disabled={quizIsCorrect !== null}>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="a" id="q-hiss"/><Label htmlFor="q-hiss">Hiss</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="b" id="q-pop"/><Label htmlFor="q-pop">Pop</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="c" id="q-crackle"/><Label htmlFor="q-crackle">Crackle</Label></div>
                     </RadioGroup>
                     {quizFeedback && <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", quizIsCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100", quizIsCorrect === null && "text-blue-700 bg-blue-100")}>{quizIsCorrect ? <CheckCircle/> : !quizIsCorrect && quizAttempts > 1 ? <XCircle/> : <RefreshCw className="animate-spin"/>}{quizFeedback}</p>}
                </CardContent>
                 <CardFooter>
                    <Button onClick={handleQuizSubmit} disabled={!quizAnswer || quizIsCorrect !== null} size="sm">
                        {quizIsCorrect === true ? "Correct!" : quizIsCorrect === false ? "Answer Shown" : quizAttempts === 1 && quizIsCorrect === null ? "Try Again" : "Check Answer"}
                    </Button>
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
