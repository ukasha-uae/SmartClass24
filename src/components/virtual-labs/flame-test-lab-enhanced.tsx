'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CheckCircle, XCircle, RefreshCw, BookOpen, Shield, Flame, Atom, Eye, EyeOff, Beaker, TestTube, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { TextToSpeech } from '../text-to-speech';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherVoice } from './TeacherVoice';

type TestStep = 'prepare' | 'load-sample' | 'heat' | 'observe' | 'complete';
type MetalSalt = 'Lithium Chloride' | 'Sodium Chloride' | 'Potassium Chloride' | 'Copper Sulfate' | 'Calcium Chloride' | 'Barium Chloride';

interface SaltInfo {
    name: MetalSalt;
    ion: string;
    colorName: string;
    flameColor: string; // Hex color
    spectralLine: number; // Wavelength in nm
    description: string;
}

const metalSalts: Record<MetalSalt, SaltInfo> = {
    'Lithium Chloride': { 
        name: 'Lithium Chloride', 
        ion: 'Li⁺', 
        colorName: 'Crimson Red', 
        flameColor: '#DC143C',
        spectralLine: 670,
        description: 'Bright red flame, easily identifiable'
    },
    'Sodium Chloride': { 
        name: 'Sodium Chloride', 
        ion: 'Na⁺', 
        colorName: 'Intense Yellow', 
        flameColor: '#FFD700',
        spectralLine: 589,
        description: 'Very bright yellow-orange, most intense'
    },
    'Potassium Chloride': { 
        name: 'Potassium Chloride', 
        ion: 'K⁺', 
        colorName: 'Lilac Purple', 
        flameColor: '#C084FC',
        spectralLine: 766,
        description: 'Pale violet, harder to see'
    },
    'Copper Sulfate': { 
        name: 'Copper Sulfate', 
        ion: 'Cu²⁺', 
        colorName: 'Blue-Green', 
        flameColor: '#14B8A6',
        spectralLine: 515,
        description: 'Distinctive blue-green color'
    },
    'Calcium Chloride': { 
        name: 'Calcium Chloride', 
        ion: 'Ca²⁺', 
        colorName: 'Orange-Red', 
        flameColor: '#FF4500',
        spectralLine: 622,
        description: 'Brick red-orange flame'
    },
    'Barium Chloride': { 
        name: 'Barium Chloride', 
        ion: 'Ba²⁺', 
        colorName: 'Pale Green', 
        flameColor: '#90EE90',
        spectralLine: 524,
        description: 'Yellowish-green flame'
    },
};

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

export function FlameTestLab() {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = React.useState<TestStep>('prepare');
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [selectedSalt, setSelectedSalt] = React.useState<MetalSalt | null>(null);
    const [currentFlame, setCurrentFlame] = React.useState<SaltInfo | null>(null);
    const [timer, setTimer] = React.useState(0);
    const [showSafetyGear, setShowSafetyGear] = React.useState(true);
    const [testHistory, setTestHistory] = React.useState<Partial<Record<MetalSalt, SaltInfo>>>({});
    const [showPractice, setShowPractice] = React.useState(false);
    const [practiceInteraction, setPracticeInteraction] = React.useState<'equipment' | 'metals' | 'colors' | 'mistakes' | null>(null);
    const [isHeating, setIsHeating] = React.useState(false);

    // Highlight state
    const [highlightInfo, setHighlightInfo] = React.useState<{ section: string; sentenceIndex: number } | null>(null);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<string | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    // Timer effect
    React.useEffect(() => {
        if (currentStep === 'heat' && isHeating) {
            const interval = setInterval(() => {
                setTimer(t => t + 1);
            }, 100);
            return () => clearInterval(interval);
        }
    }, [currentStep, isHeating]);

    const handleSelectSalt = (salt: MetalSalt) => {
        setSelectedSalt(salt);
        setCurrentStep('load-sample');
        setCurrentFlame(null);
        setTimer(0);
        toast({ 
            title: 'Metal Salt Selected', 
            description: `${salt} loaded on wire loop. Ready to test!`
        });
    };

    const handleStartHeating = () => {
        if (!selectedSalt) {
            toast({ 
                title: "No Sample!", 
                description: "Please select a metal salt first.", 
                variant: "destructive" 
            });
            return;
        }

        setCurrentStep('heat');
        setIsHeating(true);
        const saltInfo = metalSalts[selectedSalt];
        
        // Gradual flame color appearance
        setTimeout(() => {
            setCurrentFlame(saltInfo);
            setCurrentStep('observe');
        }, 1000);

        setTimeout(() => {
            setIsHeating(false);
            setCurrentStep('complete');
            setTestHistory(prev => ({
                ...prev,
                [selectedSalt]: saltInfo
            }));
            toast({
                title: 'Test Complete!',
                description: `${saltInfo.colorName} flame observed for ${saltInfo.ion}`
            });
        }, 5000);
    };

    const handleReset = () => {
        setCurrentStep('prepare');
        setSelectedSalt(null);
        setCurrentFlame(null);
        setTimer(0);
        setIsHeating(false);
        setTestHistory({} as Partial<Record<MetalSalt, SaltInfo>>);
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
        setHighlightInfo(null);
        toast({ title: 'Lab Reset', description: 'Ready for new tests.' });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null) return;
        const isCorrect = quizAnswer === 'Electrons moving between energy levels';
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback("Correct! When heated, electrons absorb energy and jump to higher energy levels. As they fall back, they emit light of specific wavelengths, producing characteristic colors. ✅");
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite right. Think about what happens to electrons when atoms are heated. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback("Incorrect. The colors result from electrons transitioning between energy levels, emitting photons of specific wavelengths. 🧠");
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

    // Define texts for TTS
    const objectiveText = "To identify different metal ions by observing the unique flame colors they produce when heated in a Bunsen burner flame.";
    const theoryText = "The flame test is a qualitative analytical technique used to detect metal ions based on their characteristic emission spectra. When metal salts are heated, their electrons absorb thermal energy and become excited to higher energy levels. As these electrons return to their ground state, they emit photons of specific wavelengths, producing distinct colors visible in the flame. Each metal has a unique electron configuration, resulting in a unique color signature.";
    const safetyText = "Safety is paramount in flame test experiments. Always wear safety goggles to protect eyes from flying particles and chemical splashes. Keep long hair tied back and remove loose clothing or jewelry. Handle the Bunsen burner with care, ensuring it's properly connected to the gas supply. The wire loop becomes extremely hot during testing - never touch it until it has cooled completely. Work in a well-ventilated area and know the location of fire extinguishers.";

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
                        <HighlightedText 
                            text={objectiveText} 
                            sectionId="objective" 
                            highlightedSentenceIndex={highlightInfo?.section === 'objective' ? highlightInfo.sentenceIndex : null} 
                        />
                    </CardDescription>
                </CardHeader>
            </Card>

            {currentStep === 'intro' && (
                <Card>
                    <CardHeader><CardTitle>Lab Information</CardTitle></CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="theory">
                                <AccordionTrigger><BookOpen className="h-4 w-4 mr-2"/>Background Theory</AccordionTrigger>
                                <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
                                    <div className="flex-grow">
                                        <p>
                                            <HighlightedText 
                                                text={theoryText} 
                                                sectionId="theory" 
                                                highlightedSentenceIndex={highlightInfo?.section === 'theory' ? highlightInfo.sentenceIndex : null} 
                                            />
                                        </p>
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
                                <AccordionTrigger><Shield className="h-4 w-4 mr-2"/>Safety Precautions</AccordionTrigger>
                                <AccordionContent className="prose prose-sm dark:prose-invert text-muted-foreground flex items-start gap-2">
                                    <div className="flex-grow">
                                        <p>
                                            <HighlightedText 
                                                text={safetyText} 
                                                sectionId="safety" 
                                                highlightedSentenceIndex={highlightInfo?.section === 'safety' ? highlightInfo.sentenceIndex : null} 
                                            />
                                        </p>
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
            )}

            {/* Practice Mode Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        🎓 Practice Mode
                        <span className="text-sm font-normal text-muted-foreground">(Recommended for first-time users)</span>
                    </CardTitle>
                    <CardDescription>
                        Familiarize yourself with equipment, metal salts, and expected flame colors before testing
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Click on each item to learn more:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Equipment Card */}
                            <motion.button
                                onClick={() => {
                                    setPracticeInteraction('equipment');
                                    setShowPractice(true);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "p-6 rounded-xl border-2 transition-all text-left",
                                    practiceInteraction === 'equipment' 
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" 
                                        : "border-border hover:border-blue-300"
                                )}
                            >
                                <Flame className="h-10 w-10 text-blue-500 mb-3" />
                                <h3 className="font-semibold mb-2">Equipment</h3>
                                <p className="text-sm text-muted-foreground">Bunsen burner & wire loop</p>
                            </motion.button>

                            {/* Metal Salts Card */}
                            <motion.button
                                onClick={() => {
                                    setPracticeInteraction('metals');
                                    setShowPractice(true);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "p-6 rounded-xl border-2 transition-all text-left",
                                    practiceInteraction === 'metals' 
                                        ? "border-green-500 bg-green-50 dark:bg-green-950/30" 
                                        : "border-border hover:border-green-300"
                                )}
                            >
                                <Beaker className="h-10 w-10 text-green-500 mb-3" />
                                <h3 className="font-semibold mb-2">Metal Salts</h3>
                                <p className="text-sm text-muted-foreground">Available test samples</p>
                            </motion.button>

                            {/* Flame Colors Card */}
                            <motion.button
                                onClick={() => {
                                    setPracticeInteraction('colors');
                                    setShowPractice(true);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "p-6 rounded-xl border-2 transition-all text-left",
                                    practiceInteraction === 'colors' 
                                        ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30" 
                                        : "border-border hover:border-purple-300"
                                )}
                            >
                                <Sparkles className="h-10 w-10 text-purple-500 mb-3" />
                                <h3 className="font-semibold mb-2">Flame Colors</h3>
                                <p className="text-sm text-muted-foreground">Color reference chart</p>
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
                                    {practiceInteraction === 'equipment' && (
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-lg flex items-center gap-2">
                                                <Flame className="h-5 w-5 text-blue-500" />
                                                Laboratory Equipment
                                            </h4>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2 text-sm">
                                                    <p className="font-semibold">Bunsen Burner:</p>
                                                    <p>• Produces high-temperature flame (up to 1,560°C)</p>
                                                    <p>• Blue cone = hottest part (complete combustion)</p>
                                                    <p>• Yellow flame = cooler, incomplete combustion</p>
                                                    <p>• Always use blue flame for testing</p>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <p className="font-semibold">Nichrome Wire Loop:</p>
                                                    <p>• Made of nichrome (nickel-chromium alloy)</p>
                                                    <p>• Doesn't produce its own flame color</p>
                                                    <p>• Must be cleaned in HCl between tests</p>
                                                    <p>• Heat until no color before next sample</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded">
                                                <p className="text-sm font-semibold">💡 Tip: Always clean the wire loop thoroughly to avoid contamination from previous tests.</p>
                                            </div>
                                        </div>
                                    )}

                                    {practiceInteraction === 'metals' && (
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-lg flex items-center gap-2">
                                                <Beaker className="h-5 w-5 text-green-500" />
                                                Metal Salts Available
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {Object.values(metalSalts).map((salt) => (
                                                    <div key={salt.name} className="p-3 border rounded-lg bg-card">
                                                        <p className="font-semibold">{salt.name}</p>
                                                        <p className="text-xs text-muted-foreground">Ion: {salt.ion}</p>
                                                        <p className="text-xs text-muted-foreground">Wavelength: {salt.spectralLine} nm</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <div 
                                                                className="w-6 h-6 rounded-full border-2 border-gray-300"
                                                                style={{ backgroundColor: salt.flameColor }}
                                                            />
                                                            <span className="text-sm">{salt.colorName}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {practiceInteraction === 'colors' && (
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-lg flex items-center gap-2">
                                                <Sparkles className="h-5 w-5 text-purple-500" />
                                                Flame Color Reference Chart
                                            </h4>
                                            <div className="space-y-2">
                                                {Object.values(metalSalts).map((salt) => (
                                                    <motion.div 
                                                        key={salt.name}
                                                        className="p-4 rounded-lg border"
                                                        style={{ 
                                                            backgroundColor: `${salt.flameColor}15`,
                                                            borderColor: salt.flameColor
                                                        }}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-semibold">{salt.ion} - {salt.colorName}</p>
                                                                <p className="text-xs text-muted-foreground">{salt.description}</p>
                                                            </div>
                                                            <motion.div
                                                                className="w-16 h-16 rounded-full"
                                                                style={{ 
                                                                    backgroundColor: salt.flameColor,
                                                                    boxShadow: `0 0 20px ${salt.flameColor}`
                                                                }}
                                                                animate={{
                                                                    boxShadow: [
                                                                        `0 0 20px ${salt.flameColor}`,
                                                                        `0 0 40px ${salt.flameColor}`,
                                                                        `0 0 20px ${salt.flameColor}`
                                                                    ]
                                                                }}
                                                                transition={{ duration: 2, repeat: Infinity }}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <div className="mt-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded">
                                                <p className="text-sm font-semibold">📊 Scientific Note: Each color corresponds to specific wavelengths of light emitted by excited electrons.</p>
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
                                                        Contaminated wire loop
                                                    </p>
                                                    <p className="text-xs mt-1 text-muted-foreground">Solution: Always clean loop in HCl and heat until no color appears before next test.</p>
                                                </div>
                                                <div className="p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded">
                                                    <p className="font-semibold text-sm flex items-center gap-2">
                                                        <XCircle className="h-4 w-4" />
                                                        Using yellow flame instead of blue
                                                    </p>
                                                    <p className="text-xs mt-1 text-muted-foreground">Solution: Adjust air hole on Bunsen burner to get hot blue flame for accurate results.</p>
                                                </div>
                                                <div className="p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded">
                                                    <p className="font-semibold text-sm flex items-center gap-2">
                                                        <XCircle className="h-4 w-4" />
                                                        Too much or too little sample
                                                    </p>
                                                    <p className="text-xs mt-1 text-muted-foreground">Solution: Use small amount - just enough to coat the loop. Excess can mask true color.</p>
                                                </div>
                                                <div className="p-3 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded">
                                                    <p className="font-semibold text-sm flex items-center gap-2">
                                                        <XCircle className="h-4 w-4" />
                                                        Testing in bright sunlight
                                                    </p>
                                                    <p className="text-xs mt-1 text-muted-foreground">Solution: Conduct tests in dim lighting for best visibility of flame colors.</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded border border-green-500">
                                                <p className="text-sm font-semibold flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    Pro Tips:
                                                </p>
                                                <ul className="text-xs mt-2 space-y-1 ml-6 list-disc">
                                                    <li>View flame from side, not directly above</li>
                                                    <li>Some colors (like potassium) are faint - look carefully</li>
                                                    <li>Record color immediately - some fade quickly</li>
                                                    <li>Use cobalt blue glass to filter out sodium yellow</li>
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
                        <span>🔥 Interactive Flame Test Lab</span>
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
                    <CardDescription>Select a metal salt, then heat it in the flame to observe its characteristic color</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        {[
                            { step: 'prepare', label: 'Prepare', icon: Shield },
                            { step: 'load-sample', label: 'Load Sample', icon: Beaker },
                            { step: 'heat', label: 'Heat', icon: Flame },
                            { step: 'observe', label: 'Observe', icon: Eye },
                            { step: 'complete', label: 'Complete', icon: CheckCircle },
                        ].map(({ step, label, icon: Icon }) => (
                            <div
                                key={step}
                                className={cn(
                                    "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all",
                                    currentStep === step
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                )}
                            >
                                <Icon className="h-3 w-3" />
                                {label}
                            </div>
                        ))}
                    </div>

                    {/* Safety Gear Display */}
                    <AnimatePresence>
                        {showSafetyGear && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center justify-center gap-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800"
                            >
                                <div className="text-4xl">🥽</div>
                                <div className="text-4xl">🧤</div>
                                <div className="text-4xl">🥼</div>
                                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                                    Safety equipment active: Goggles, Gloves, Lab Coat
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Metal Salt Selection */}
                    <div className="space-y-2">
                        <Label className="text-base font-semibold">1. Select Metal Salt Sample:</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.values(metalSalts).map((salt) => (
                                <Button
                                    key={salt.name}
                                    variant={selectedSalt === salt.name ? 'default' : 'outline'}
                                    onClick={() => handleSelectSalt(salt.name)}
                                    disabled={currentStep === 'heat' || isHeating}
                                    className="flex flex-col h-auto py-3"
                                >
                                    <span className="font-semibold text-sm">{salt.ion}</span>
                                    <span className="text-xs opacity-80">{salt.name}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Virtual Lab Visualization */}
                    <div className="relative min-h-[400px] bg-gradient-to-b from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 rounded-xl p-8 flex items-center justify-center">
                        {/* Wire Loop with Sample */}
                        <div className="absolute left-1/4 top-1/4">
                            <motion.div
                                animate={isHeating ? { x: [0, 50, 50], y: [0, 80, 80] } : {}}
                                transition={{ duration: 1, times: [0, 0.5, 1] }}
                                className="relative"
                            >
                                {/* Wire */}
                                <div className="relative w-2 h-32 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full mx-auto" />
                                {/* Loop */}
                                <div className="relative -mt-2">
                                    <div className={cn(
                                        "w-12 h-12 rounded-full border-4 border-gray-400 mx-auto transition-all",
                                        selectedSalt && "bg-gray-200 shadow-lg"
                                    )}>
                                        {selectedSalt && (
                                            <div className="text-[10px] font-bold text-center mt-2">
                                                {metalSalts[selectedSalt].ion}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Bunsen Burner with Animated Flame */}
                        <div className="relative flex flex-col items-center">
                            {/* Flame */}
                            <div className="relative w-32 h-48 mb-4">
                                <AnimatePresence>
                                    {currentFlame ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            className="absolute inset-0"
                                        >
                                            {/* Colored Flame */}
                                            <svg viewBox="0 0 100 150" className="w-full h-full">
                                                <defs>
                                                    <radialGradient id={`flameGradient-${currentFlame.ion}`}>
                                                        <stop offset="0%" style={{ stopColor: currentFlame.flameColor, stopOpacity: 1 }} />
                                                        <stop offset="100%" style={{ stopColor: currentFlame.flameColor, stopOpacity: 0.3 }} />
                                                    </radialGradient>
                                                </defs>
                                                <motion.path 
                                                    d="M 50 150 C 10 100, 10 50, 50 0 C 90 50, 90 100, 50 150" 
                                                    fill={`url(#flameGradient-${currentFlame.ion})`}
                                                    animate={{
                                                        d: [
                                                            "M 50 150 C 10 100, 10 50, 50 0 C 90 50, 90 100, 50 150",
                                                            "M 50 150 C 15 100, 15 50, 50 5 C 85 50, 85 100, 50 150",
                                                            "M 50 150 C 10 100, 10 50, 50 0 C 90 50, 90 100, 50 150"
                                                        ]
                                                    }}
                                                    transition={{ duration: 0.5, repeat: Infinity }}
                                                />
                                            </svg>
                                            {/* Glow Effect */}
                                            <motion.div
                                                className="absolute inset-0 blur-2xl"
                                                style={{ backgroundColor: currentFlame.flameColor }}
                                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            />
                                            {/* Sparks */}
                                            {[...Array(8)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute w-1 h-1 rounded-full"
                                                    style={{ backgroundColor: currentFlame.flameColor }}
                                                    initial={{ x: 60, y: 100, opacity: 1 }}
                                                    animate={{
                                                        x: 60 + (Math.random() - 0.5) * 80,
                                                        y: Math.random() * 50,
                                                        opacity: 0,
                                                        scale: [1, 2, 0]
                                                    }}
                                                    transition={{
                                                        duration: 1 + Math.random(),
                                                        repeat: Infinity,
                                                        delay: i * 0.2
                                                    }}
                                                />
                                            ))}
                                        </motion.div>
                                    ) : (
                                        // Default blue flame
                                        <motion.div className="absolute inset-0">
                                            <svg viewBox="0 0 100 150" className="w-full h-full">
                                                <defs>
                                                    <linearGradient id="blueFlame" x1="0%" y1="0%" x2="0%" y2="100%">
                                                        <stop offset="0%" style={{ stopColor: '#60A5FA', stopOpacity: 1 }} />
                                                        <stop offset="50%" style={{ stopColor: '#3B82F6', stopOpacity: 0.8 }} />
                                                        <stop offset="100%" style={{ stopColor: '#1E40AF', stopOpacity: 0.4 }} />
                                                    </linearGradient>
                                                </defs>
                                                <motion.path 
                                                    d="M 50 150 C 20 110, 20 60, 50 10 C 80 60, 80 110, 50 150" 
                                                    fill="url(#blueFlame)"
                                                    animate={{
                                                        d: [
                                                            "M 50 150 C 20 110, 20 60, 50 10 C 80 60, 80 110, 50 150",
                                                            "M 50 150 C 25 110, 25 60, 50 15 C 75 60, 75 110, 50 150",
                                                            "M 50 150 C 20 110, 20 60, 50 10 C 80 60, 80 110, 50 150"
                                                        ]
                                                    }}
                                                    transition={{ duration: 0.4, repeat: Infinity }}
                                                />
                                            </svg>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Burner Body */}
                            <div className="relative z-10">
                                <div className="w-24 h-32 bg-gradient-to-b from-gray-300 to-gray-500 dark:from-gray-600 dark:to-gray-800 rounded-lg shadow-xl">
                                    {/* Air holes */}
                                    <div className="flex justify-around pt-4">
                                        <div className="w-2 h-8 bg-gray-700 dark:bg-gray-900 rounded-full" />
                                        <div className="w-2 h-8 bg-gray-700 dark:bg-gray-900 rounded-full" />
                                        <div className="w-2 h-8 bg-gray-700 dark:bg-gray-900 rounded-full" />
                                    </div>
                                </div>
                                {/* Base */}
                                <div className="w-32 h-8 bg-gradient-to-b from-gray-400 to-gray-600 dark:from-gray-700 dark:to-gray-900 rounded-b-xl -mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* Current Observation */}
                    {currentFlame && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-lg border-2"
                            style={{ 
                                borderColor: currentFlame.flameColor,
                                backgroundColor: `${currentFlame.flameColor}10`
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-lg">
                                        Observation: <span style={{ color: currentFlame.flameColor }}>{currentFlame.colorName}</span> Flame
                                    </p>
                                    <p className="text-sm text-muted-foreground">{currentFlame.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Metal ion: {currentFlame.ion} | Wavelength: {currentFlame.spectralLine} nm | Time: {(timer / 10).toFixed(1)}s
                                    </p>
                                </div>
                                <motion.div
                                    className="w-16 h-16 rounded-full"
                                    style={{ 
                                        backgroundColor: currentFlame.flameColor,
                                        boxShadow: `0 0 30px ${currentFlame.flameColor}`
                                    }}
                                    animate={{
                                        boxShadow: [
                                            `0 0 20px ${currentFlame.flameColor}`,
                                            `0 0 40px ${currentFlame.flameColor}`,
                                            `0 0 20px ${currentFlame.flameColor}`
                                        ]
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Test History */}
                    {Object.keys(testHistory).length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-base font-semibold">Test Results Summary:</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {Object.values(testHistory).map((result) => (
                                    <div 
                                        key={result.name}
                                        className="p-2 rounded border text-center text-sm"
                                        style={{ borderColor: result.flameColor }}
                                    >
                                        <div className="font-semibold">{result.ion}</div>
                                        <div 
                                            className="w-8 h-8 rounded-full mx-auto my-1"
                                            style={{ backgroundColor: result.flameColor }}
                                        />
                                        <div className="text-xs text-muted-foreground">{result.colorName}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex gap-4">
                    <Button 
                        onClick={handleStartHeating}
                        disabled={!selectedSalt || isHeating || currentStep === 'complete'}
                        size="lg"
                        className="flex-1"
                    >
                        {isHeating ? (
                            <>
                                <Flame className="h-4 w-4 mr-2 animate-pulse" />
                                Heating...
                            </>
                        ) : (
                            <>
                                <Flame className="h-4 w-4 mr-2" />
                                2. Place in Flame
                            </>
                        )}
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
                    <CardDescription>Test your understanding of flame test principles</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="font-medium mb-3">What causes the different colors in a flame test?</p>
                    <RadioGroup 
                        value={quizAnswer} 
                        onValueChange={handleQuizChange} 
                        disabled={quizIsCorrect !== null}
                        className="space-y-2"
                    >
                        <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
                            <RadioGroupItem value="The salt itself is burning" id="q-burn" />
                            <Label htmlFor="q-burn" className="cursor-pointer flex-1">The metal salt itself is burning</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
                            <RadioGroupItem value="Electrons moving between energy levels" id="q-electrons" />
                            <Label htmlFor="q-electrons" className="cursor-pointer flex-1">Electrons moving between energy levels</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
                            <RadioGroupItem value="Reaction with air" id="q-air" />
                            <Label htmlFor="q-air" className="cursor-pointer flex-1">A chemical reaction with oxygen in the air</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
                            <RadioGroupItem value="Temperature of flame" id="q-temp" />
                            <Label htmlFor="q-temp" className="cursor-pointer flex-1">Different temperature regions of the flame</Label>
                        </div>
                    </RadioGroup>
                    {quizFeedback && (
                        <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "mt-4 text-sm flex items-start gap-2 p-3 rounded-md",
                                quizIsCorrect === true && "text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300",
                                quizIsCorrect === false && "text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300",
                                quizIsCorrect === null && quizAttempts === 1 && "text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
                            )}
                        >
                            {quizIsCorrect ? (
                                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            ) : !quizIsCorrect && quizAttempts > 1 ? (
                                <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            ) : (
                                <RefreshCw className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            )}
                            <span>{quizFeedback}</span>
                        </motion.p>
                    )}
                </CardContent>
                <CardFooter>
                    <Button 
                        onClick={handleQuizSubmit} 
                        disabled={!quizAnswer || quizIsCorrect !== null}
                        size="sm"
                    >
                        {quizIsCorrect === true ? "Correct! ✅" : 
                         quizIsCorrect === false ? "Answer Shown" : 
                         quizAttempts === 1 ? "Try Again" : 
                         "Check Answer"}
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
