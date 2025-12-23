'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, Wind, TestTube, BookOpen, Shield, Droplets, Clock, FlaskConical, Beaker, Eye, EyeOff, Waves } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherVoice } from './TeacherVoice';

type TestStep = 'prepare' | 'exhale' | 'bubbling' | 'observe' | 'complete';

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


export function LimewaterTestLab() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<TestStep>('prepare');
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [timer, setTimer] = React.useState(0);
    const [co2Bubbles, setCo2Bubbles] = React.useState(0);
    const [showSafetyGear, setShowSafetyGear] = React.useState(true);
    const [milkiness, setMilkiness] = React.useState(0); // 0-100 scale
    const [showPractice, setShowPractice] = React.useState(false);
    const [practiceInteraction, setPracticeInteraction] = React.useState<'limewater' | 'co2' | 'result' | 'mistakes' | null>(null);

    // Highlight state
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    // Timer effect
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (currentStep === 'bubbling' || currentStep === 'observe') {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [currentStep]);

    // Bubble counter effect
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (currentStep === 'bubbling') {
            interval = setInterval(() => {
                setCo2Bubbles(prev => prev + 1);
                setMilkiness(prev => Math.min(prev + 3, 100));
            }, 300);
        }
        return () => clearInterval(interval);
    }, [currentStep]);

    const handleStart = () => {
        if (!showSafetyGear) {
            toast({ title: 'Safety First! 🥽', description: 'Remember to wear safety goggles in a real lab!', variant: 'destructive' });
            return;
        }

        setCurrentStep('prepare');
        setTimer(0);
        setCo2Bubbles(0);
        setMilkiness(0);
        toast({ title: 'Preparing Test...', description: 'Setting up limewater solution' });

        // Step 1: Prepare
        setTimeout(() => {
            setCurrentStep('exhale');
            toast({ title: 'Ready to Test', description: 'Breathe out through the straw...' });
        }, 1500);

        // Step 2: Start exhaling
        setTimeout(() => {
            setCurrentStep('bubbling');
            toast({ title: 'CO₂ Detected!', description: 'Carbon dioxide is reacting with limewater...' });
        }, 3000);

        // Step 3: Continue bubbling
        setTimeout(() => {
            setCurrentStep('observe');
            toast({ title: 'Chemical Reaction Occurring', description: 'Watch the color change carefully...' });
        }, 6000);

        // Step 4: Complete
        setTimeout(() => {
            setCurrentStep('complete');
            toast({ 
                title: 'Test Complete! ✅', 
                description: 'Calcium carbonate precipitate formed'
            });
        }, 9000);
    };

    const handleReset = () => {
        setCurrentStep('prepare');
        setTimer(0);
        setCo2Bubbles(0);
        setMilkiness(0);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setHighlightInfo(null);
        toast({ title: 'Lab Reset', description: 'Ready for a new experiment.' });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'calcium_carbonate';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! Carbon dioxide reacts with calcium hydroxide to form calcium carbonate, which makes the water cloudy. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite. Think about what white precipitate forms when CO₂ reacts with Ca(OH)₂. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("The correct answer is Calcium Carbonate (CaCO₃). The equation is: Ca(OH)₂ + CO₂ → CaCO₃ + H₂O 🧠");
            }
        }
    };
    
    const objectiveText = "To test for the presence of carbon dioxide gas by observing the characteristic milky appearance when CO₂ is bubbled through clear limewater solution.";
    const theoryText = "Limewater is a dilute solution of calcium hydroxide Ca(OH)₂. When carbon dioxide CO₂ is bubbled through it, a chemical reaction occurs: Ca(OH)₂ + CO₂ → CaCO₃ + H₂O. The calcium carbonate CaCO₃ formed is insoluble and appears as a milky white precipitate, turning the clear limewater cloudy. This is a definitive test for CO₂ presence in exhaled breath, combustion products, or any gas sample.";
    const safetyText = "Always wear safety goggles when working with chemicals. Handle glassware carefully. Do not drink the limewater solution. If using a straw, ensure it's clean and for single use only. Wash hands after the experiment.";

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
                                    onSentenceChange={(i) => setHighlightInfo({ section: 'theory', sentenceIndex: i })}
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

            {/* Practice Mode Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        🎓 Practice Mode
                        <span className="text-sm font-normal text-muted-foreground">(Recommended for first-time users)</span>
                    </CardTitle>
                    <CardDescription>
                        Learn about the equipment and expected observations before running the actual test
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Click on each item to learn more about it and what to observe during the test:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Limewater Card */}
                            <motion.button
                                onClick={() => {
                                    setPracticeInteraction('limewater');
                                    setShowPractice(true);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "p-6 rounded-xl border-2 transition-all text-left",
                                    practiceInteraction === 'limewater' 
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" 
                                        : "border-border hover:border-blue-300"
                                )}
                            >
                                <Beaker className="h-10 w-10 text-blue-500 mb-3" />
                                <h3 className="font-semibold mb-2">Limewater</h3>
                                <p className="text-sm text-muted-foreground">Learn about Ca(OH)₂ solution</p>
                            </motion.button>

                            {/* CO2 Bubbles Card */}
                            <motion.button
                                onClick={() => {
                                    setPracticeInteraction('co2');
                                    setShowPractice(true);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "p-6 rounded-xl border-2 transition-all text-left",
                                    practiceInteraction === 'co2' 
                                        ? "border-green-500 bg-green-50 dark:bg-green-950/30" 
                                        : "border-border hover:border-green-300"
                                )}
                            >
                                <Waves className="h-10 w-10 text-green-500 mb-3" />
                                <h3 className="font-semibold mb-2">CO₂ Bubbles</h3>
                                <p className="text-sm text-muted-foreground">See how CO₂ looks</p>
                            </motion.button>

                            {/* Expected Result Card */}
                            <motion.button
                                onClick={() => {
                                    setPracticeInteraction('result');
                                    setShowPractice(true);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "p-6 rounded-xl border-2 transition-all text-left",
                                    practiceInteraction === 'result' 
                                        ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30" 
                                        : "border-border hover:border-purple-300"
                                )}
                            >
                                <FlaskConical className="h-10 w-10 text-purple-500 mb-3" />
                                <h3 className="font-semibold mb-2">Expected Result</h3>
                                <p className="text-sm text-muted-foreground">What you should observe</p>
                            </motion.button>

                            {/* Common Mistakes Card */}
                            <motion.button
                                onClick={() => {
                                    setPracticeInteraction('mistakes');
                                    setShowPractice(true);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "p-6 rounded-xl border-2 transition-all text-left",
                                    practiceInteraction === 'mistakes' 
                                        ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30" 
                                        : "border-border hover:border-orange-300"
                                )}
                            >
                                <Shield className="h-10 w-10 text-orange-500 mb-3" />
                                <h3 className="font-semibold mb-2">Common Mistakes</h3>
                                <p className="text-sm text-muted-foreground">Avoid these errors</p>
                            </motion.button>
                        </div>

                        {/* Practice Content Display */}
                        <AnimatePresence>
                            {showPractice && practiceInteraction && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 p-6 rounded-lg border-2 border-primary/20 bg-muted/30"
                                >
                                    {practiceInteraction === 'limewater' && (
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-lg flex items-center gap-2">
                                                <Beaker className="h-5 w-5 text-blue-500" />
                                                About Limewater
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <p>• <strong>Chemical Name:</strong> Calcium hydroxide solution, Ca(OH)₂</p>
                                                <p>• <strong>Appearance:</strong> Clear, colorless liquid (like water)</p>
                                                <p>• <strong>Purpose:</strong> Reacts with CO₂ to form white precipitate</p>
                                                <p>• <strong>Safety:</strong> Mildly alkaline - handle with care, don't drink</p>
                                            </div>
                                            <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded">
                                                <p className="text-sm font-semibold">💡 Tip: In the real lab, you can prepare limewater by dissolving calcium hydroxide powder in water and filtering it.</p>
                                            </div>
                                        </div>
                                    )}

                                    {practiceInteraction === 'co2' && (
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-lg flex items-center gap-2">
                                                <Waves className="h-5 w-5 text-green-500" />
                                                Carbon Dioxide Bubbles
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <p>• <strong>Source:</strong> From exhaled breath (humans breathe out CO₂)</p>
                                                <p>• <strong>What to look for:</strong> Small bubbles rising through the solution</p>
                                                <p>• <strong>Speed:</strong> Bubbles appear continuously while breathing out</p>
                                                <p>• <strong>Sound:</strong> You may hear gentle bubbling/fizzing</p>
                                            </div>
                                            <div className="mt-4 flex items-center justify-center p-4 bg-green-100 dark:bg-green-900/30 rounded">
                                                <div className="relative w-32 h-32">
                                                    {[...Array(8)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="absolute w-4 h-4 bg-white/80 rounded-full border-2 border-green-400"
                                                            initial={{ x: 60, y: 120 }}
                                                            animate={{ 
                                                                y: -20,
                                                                x: 60 + (Math.random() - 0.5) * 40,
                                                                scale: [0.5, 1, 0.3]
                                                            }}
                                                            transition={{
                                                                repeat: Infinity,
                                                                duration: 2,
                                                                delay: i * 0.25
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {practiceInteraction === 'result' && (
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-lg flex items-center gap-2">
                                                <FlaskConical className="h-5 w-5 text-purple-500" />
                                                Expected Observation
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <p>• <strong>Initial state:</strong> Clear limewater (transparent)</p>
                                                <p>• <strong>During reaction:</strong> Gradually becomes cloudy/milky</p>
                                                <p>• <strong>Final result:</strong> Opaque white/milky appearance</p>
                                                <p>• <strong>Why?</strong> Calcium carbonate (CaCO₃) precipitate forms</p>
                                            </div>
                                            <div className="mt-4 grid grid-cols-3 gap-3">
                                                <div className="text-center p-3 rounded bg-blue-100 dark:bg-blue-900/30">
                                                    <div className="w-full h-20 bg-gradient-to-b from-blue-100 to-blue-200 rounded mb-2"></div>
                                                    <p className="text-xs font-semibold">Clear (Start)</p>
                                                </div>
                                                <div className="text-center p-3 rounded bg-gray-100 dark:bg-gray-800">
                                                    <div className="w-full h-20 bg-gradient-to-b from-white/60 to-gray-200 rounded mb-2"></div>
                                                    <p className="text-xs font-semibold">Cloudy (During)</p>
                                                </div>
                                                <div className="text-center p-3 rounded bg-white dark:bg-gray-700">
                                                    <div className="w-full h-20 bg-gradient-to-b from-white to-gray-300 rounded mb-2"></div>
                                                    <p className="text-xs font-semibold">Milky (End)</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded">
                                                <p className="text-sm font-semibold">✅ Success: When the solution turns completely milky white, CO₂ is confirmed!</p>
                                            </div>
                                        </div>
                                    )}

                                    {practiceInteraction === 'mistakes' && (
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-lg flex items-center gap-2">
                                                <Shield className="h-5 w-5 text-orange-500" />
                                                Common Mistakes to Avoid
                                            </h4>
                                            <div className="space-y-3">
                                                <div className="p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded">
                                                    <p className="font-semibold text-sm flex items-center gap-2">
                                                        <XCircle className="h-4 w-4" />
                                                        Not blowing hard enough
                                                    </p>
                                                    <p className="text-xs mt-1 text-muted-foreground">Solution: Breathe out steadily through the straw. You should see continuous bubbles.</p>
                                                </div>
                                                <div className="p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded">
                                                    <p className="font-semibold text-sm flex items-center gap-2">
                                                        <XCircle className="h-4 w-4" />
                                                        Stopping too early
                                                    </p>
                                                    <p className="text-xs mt-1 text-muted-foreground">Solution: Continue exhaling for 30-60 seconds until cloudiness is clearly visible.</p>
                                                </div>
                                                <div className="p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded">
                                                    <p className="font-semibold text-sm flex items-center gap-2">
                                                        <XCircle className="h-4 w-4" />
                                                        Using old/weak limewater
                                                    </p>
                                                    <p className="text-xs mt-1 text-muted-foreground">Solution: Prepare fresh limewater for best results. Old solutions react slower.</p>
                                                </div>
                                                <div className="p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded">
                                                    <p className="font-semibold text-sm flex items-center gap-2">
                                                        <XCircle className="h-4 w-4" />
                                                        Not using safety goggles
                                                    </p>
                                                    <p className="text-xs mt-1 text-muted-foreground">Solution: Always wear goggles - limewater is alkaline and can irritate eyes.</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded border border-green-500">
                                                <p className="text-sm font-semibold flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    Pro Tips:
                                                </p>
                                                <ul className="text-xs mt-2 space-y-1 ml-6 list-disc">
                                                    <li>Use a white background to see cloudiness better</li>
                                                    <li>Take a deep breath before exhaling for stronger CO₂ concentration</li>
                                                    <li>Compare with a control sample of untreated limewater</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setShowPractice(false)}
                                        className="mt-4"
                                    >
                                        Close
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>🧪 Interactive CO₂ Detection Lab</span>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowSafetyGear(!showSafetyGear)}
                            className={cn("transition-colors", showSafetyGear && "border-green-500 text-green-600")}
                        >
                            {showSafetyGear ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                            Safety Gear {showSafetyGear ? 'ON' : 'OFF'}
                        </Button>
                    </CardTitle>
                    <CardDescription>Ready to run the test? Make sure you've reviewed the practice section above!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Lab Status Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border">
                        <div>
                            <Label className="text-xs text-muted-foreground">Current Step</Label>
                            <div className="font-semibold capitalize">{currentStep.replace('-', ' ')}</div>
                        </div>
                        {(currentStep === 'bubbling' || currentStep === 'observe' || currentStep === 'complete') && (
                            <>
                                <div>
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Time Elapsed
                                    </Label>
                                    <div className="font-mono font-semibold">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Waves className="h-3 w-3" />
                                        CO₂ Bubbles
                                    </Label>
                                    <div className="font-mono font-semibold">{co2Bubbles}</div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Realistic Limewater Beaker Visualization */}
                    <div className="relative flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 min-h-[450px]">
                        {/* Lab Bench Surface */}
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-amber-900/20 to-transparent" />
                        
                        {/* Beaker Setup */}
                        <div className="relative">
                            {/* Beaker */}
                            <motion.div 
                                className="relative w-40 h-64"
                                animate={currentStep === 'bubbling' ? { y: [0, -1, 0] } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                {/* Glass Beaker */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-white/10 to-blue-50/30 border-4 border-gray-300/60 rounded-b-2xl shadow-2xl backdrop-blur-sm">
                                    {/* Limewater Solution */}
                                    <motion.div
                                        className={cn(
                                            "absolute inset-x-2 bottom-2 top-16 rounded-b-xl transition-all duration-1000",
                                            milkiness === 0 && "bg-gradient-to-b from-blue-100/40 to-blue-200/40",
                                            milkiness > 0 && milkiness < 50 && "bg-gradient-to-b from-white/50 to-gray-200/60",
                                            milkiness >= 50 && "bg-gradient-to-b from-white/90 to-gray-300/80 backdrop-blur-md"
                                        )}
                                        animate={{ opacity: [0.9, 1, 0.9] }}
                                        transition={{ repeat: Infinity, duration: 3 }}
                                    >
                                        {/* CO₂ Bubbles */}
                                        <AnimatePresence>
                                            {currentStep === 'bubbling' && (
                                                <div className="absolute inset-0 overflow-hidden rounded-b-xl">
                                                    {[...Array(15)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="absolute w-3 h-3 bg-white/80 rounded-full border border-blue-300"
                                                            initial={{ 
                                                                x: 60 + Math.random() * 20, 
                                                                y: '100%',
                                                                scale: 0.5
                                                            }}
                                                            animate={{ 
                                                                y: '-20%',
                                                                x: 60 + Math.random() * 20 + (Math.random() - 0.5) * 30,
                                                                scale: [0.5, 1.2, 0.3]
                                                            }}
                                                            transition={{
                                                                repeat: Infinity,
                                                                duration: 2 + Math.random() * 1.5,
                                                                delay: i * 0.15
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </AnimatePresence>

                                        {/* Calcium Carbonate Precipitate particles */}
                                        {milkiness > 20 && (
                                            <div className="absolute inset-0 rounded-b-xl overflow-hidden">
                                                {[...Array(Math.min(30, milkiness / 3))].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="absolute w-1 h-1 bg-white rounded-full"
                                                        initial={{ 
                                                            x: Math.random() * 120, 
                                                            y: 0,
                                                            opacity: 0.8
                                                        }}
                                                        animate={{ 
                                                            y: [0, 180, 0],
                                                            x: Math.random() * 120,
                                                            opacity: [0.8, 1, 0.6]
                                                        }}
                                                        transition={{
                                                            repeat: Infinity,
                                                            duration: 4 + Math.random() * 3,
                                                            delay: i * 0.1
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Glass reflection */}
                                    <div className="absolute inset-y-0 left-1 w-6 bg-gradient-to-r from-white/50 to-transparent rounded-l-2xl" />
                                    
                                    {/* Measurement marks */}
                                    <div className="absolute left-2 top-20 space-y-8">
                                        {[100, 75, 50, 25].map((ml) => (
                                            <div key={ml} className="flex items-center gap-1">
                                                <div className="w-3 h-px bg-gray-400" />
                                                <span className="text-[8px] text-gray-500 font-mono">{ml}ml</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Straw for breathing */}
                                <motion.div 
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-32 bg-gradient-to-b from-gray-200 to-gray-300 rounded-full shadow-lg"
                                    animate={currentStep === 'exhale' || currentStep === 'bubbling' ? { 
                                        scaleY: [1, 1.02, 1]
                                    } : {}}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                />

                                {/* Breath indicator */}
                                <AnimatePresence>
                                    {(currentStep === 'exhale' || currentStep === 'bubbling') && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -40 }}
                                            animate={{ opacity: [0, 0.6, 0], y: -60 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute -top-16 left-1/2 -translate-x-1/2"
                                        >
                                            <Wind className="h-8 w-8 text-blue-400" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Label */}
                                <div className="absolute -right-28 top-1/3 bg-white dark:bg-gray-800 px-3 py-2 rounded shadow-lg border text-xs">
                                    <div className="font-semibold">Limewater</div>
                                    <div className="text-muted-foreground">Ca(OH)₂</div>
                                    {milkiness > 0 && (
                                        <div className="text-green-600 dark:text-green-400 mt-1 font-semibold">
                                            {milkiness}% Milky
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Safety Equipment Indicator */}
                        {showSafetyGear && (
                            <div className="absolute top-4 left-4 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg border border-green-500 flex items-center gap-2">
                                <div className="text-2xl">🥽</div>
                                <div className="text-xs font-semibold text-green-700 dark:text-green-400">Safety ON</div>
                            </div>
                        )}

                        {/* Current Step Indicator */}
                        <div className="absolute top-4 right-4 bg-primary/10 px-4 py-2 rounded-lg border border-primary/30">
                            <div className="text-xs font-semibold text-primary capitalize">{currentStep.replace('-', ' ')}</div>
                        </div>
                    </div>

                    {/* Chemical Equation and Results */}
                    <AnimatePresence>
                        {currentStep === 'complete' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {/* Chemical Equation */}
                                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                    <div className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Chemical Reaction:</div>
                                    <div className="font-mono text-center text-lg">
                                        Ca(OH)₂<sub>(aq)</sub> + CO₂<sub>(g)</sub> → CaCO₃<sub>(s)</sub> + H₂O<sub>(l)</sub>
                                    </div>
                                    <div className="text-xs text-center text-muted-foreground mt-2">
                                        Calcium hydroxide + Carbon dioxide → Calcium carbonate + Water
                                    </div>
                                </div>

                                {/* Results */}
                                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-green-200 dark:border-green-800">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-green-500 rounded-full">
                                            <CheckCircle className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <h3 className="font-bold text-lg text-green-900 dark:text-green-100">
                                                Test Result: Positive for CO₂ ✓
                                            </h3>
                                            <p className="text-green-800 dark:text-green-200">
                                                The limewater has turned milky white, confirming the presence of carbon dioxide in the exhaled breath.
                                            </p>
                                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                                                <div>
                                                    <div className="text-xs text-green-600 dark:text-green-400 font-semibold">Gas Detected</div>
                                                    <div className="text-sm font-bold text-green-900 dark:text-green-100">Carbon Dioxide (CO₂)</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-green-600 dark:text-green-400 font-semibold">Precipitate Formed</div>
                                                    <div className="text-sm font-bold text-green-900 dark:text-green-100">Calcium Carbonate</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
                <CardFooter className="flex gap-3">
                    <Button 
                        onClick={handleStart} 
                        disabled={currentStep !== 'prepare'} 
                        className="flex-1"
                        size="lg"
                    >
                        {currentStep !== 'prepare' ? 'Test in Progress...' : 'Start Test 🧪'}
                    </Button>
                    <Button variant="outline" onClick={handleReset} size="lg" className="flex-1">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset Lab
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Post-Lab Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-2 font-medium">What compound is formed when CO₂ reacts with limewater, making it milky?</p>
                    <RadioGroup value={quizAnswer} onValueChange={(v) => {setQuizAnswer(v); setQuizIsCorrect(null); setQuizAttempts(0); setQuizFeedback(null);}} disabled={quizIsCorrect !== null}>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="calcium_hydroxide" id="q-hydroxide" /><Label htmlFor="q-hydroxide">Calcium Hydroxide</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="calcium_carbonate" id="q-carbonate" /><Label htmlFor="q-carbonate">Calcium Carbonate</Label></div>
                        <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="carbon_monoxide" id="q-monoxide" /><Label htmlFor="q-monoxide">Carbon Monoxide</Label></div>
                    </RadioGroup>
                    {quizFeedback && <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", quizIsCorrect ? "text-green-700 bg-green-100 dark:bg-green-900/30" : "text-red-700 bg-red-100 dark:bg-red-900/30", quizIsCorrect === null && "text-blue-700 bg-blue-100")}>{quizIsCorrect ? <CheckCircle className="h-4 w-4" /> : !quizIsCorrect && quizAttempts > 1 ? <XCircle className="h-4 w-4" /> : <RefreshCw className="h-4 w-4 animate-spin" />}{quizFeedback}</p>}
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
