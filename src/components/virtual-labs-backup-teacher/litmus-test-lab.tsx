
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { TestTube, Droplets, CheckCircle, RefreshCw, XCircle, BookOpen, Shield } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { TextToSpeech } from '../text-to-speech';
import { TeacherVoice } from './TeacherVoice';

type Substance = 'Lemon Juice' | 'Soap Solution' | 'Vinegar' | 'Salty Water' | 'Milk of Magnesia' | 'Dilute HCl' | 'Dilute NaOH' | 'Banana (mashed)' | 'Tap Water' | 'Black Tea';
type LitmusPaper = 'Red' | 'Blue';
type ResultColor = 'Red' | 'Blue' | 'No Change';
type SubstanceCategory = 'Acid' | 'Base' | 'Neutral';

interface SubstanceInfo {
    type: SubstanceCategory;
    litmus: Record<LitmusPaper, ResultColor>;
}

const substances: Record<Substance, SubstanceInfo> = {
    'Lemon Juice': { type: 'Acid', litmus: { 'Red': 'No Change', 'Blue': 'Red' } },
    'Soap Solution': { type: 'Base', litmus: { 'Red': 'Blue', 'Blue': 'No Change' } },
    'Vinegar': { type: 'Acid', litmus: { 'Red': 'No Change', 'Blue': 'Red' } },
    'Salty Water': { type: 'Neutral', litmus: { 'Red': 'No Change', 'Blue': 'No Change' } },
    'Milk of Magnesia': { type: 'Base', litmus: { 'Red': 'Blue', 'Blue': 'No Change' } },
    'Dilute HCl': { type: 'Acid', litmus: { 'Red': 'No Change', 'Blue': 'Red' } },
    'Dilute NaOH': { type: 'Base', litmus: { 'Red': 'Blue', 'Blue': 'No Change' } },
    'Banana (mashed)': { type: 'Acid', litmus: { 'Red': 'No Change', 'Blue': 'Red' } }, // Simplified to Red
    'Tap Water': { type: 'Neutral', litmus: { 'Red': 'No Change', 'Blue': 'No Change' } },
    'Black Tea': { type: 'Acid', litmus: { 'Red': 'No Change', 'Blue': 'Red' } }, // Simplified to Red
};

export function LitmusTestLab() {
    const { toast } = useToast();
    const [selectedSubstance, setSelectedSubstance] = React.useState<Substance>('Lemon Juice');
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
    const [selectedPaper, setSelectedPaper] = React.useState<LitmusPaper>('Blue');
    const [result, setResult] = React.useState<ResultColor | null>(null);

    // Quiz State
    const [quizAnswer, setQuizAnswer] = React.useState<SubstanceCategory | undefined>();
    const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
    const [quizAttempts, setQuizAttempts] = React.useState(0);
    const [quizIsCorrect, setQuizIsCorrect] = React.useState<boolean | null>(null);

    const resetQuiz = () => {
        setQuizAnswer(undefined);
        setQuizFeedback(null);
        setQuizAttempts(0);
        setQuizIsCorrect(null);
    };

    const handleSubstanceChange = (val: Substance) => {
        setSelectedSubstance(val);
        setResult(null);
        resetQuiz();
    };

    const handlePaperChange = (val: LitmusPaper) => {
        setSelectedPaper(val);
        setResult(null);
        resetQuiz();
    };

    const handleTest = () => {
        const testResult = substances[selectedSubstance].litmus[selectedPaper];
        setResult(testResult);
        resetQuiz(); // Reset quiz every time a new test is run
        toast({
            title: "Test Complete!",
            description: `Testing ${selectedSubstance} with ${selectedPaper.toLowerCase()} litmus paper... Result: ${testResult}.`
        });
    };

    const handleReset = () => {
        setResult(null);
        resetQuiz();
        toast({ title: "Lab Reset", description: "Select a new substance and litmus paper to test." });
    };

    const handleQuizSubmit = () => {
        if (quizIsCorrect !== null || !result) return;
        const correctType = substances[selectedSubstance].type;
        const isCorrect = quizAnswer === correctType;
        const newAttempts = quizAttempts + 1;
        setQuizAttempts(newAttempts);
        if (isCorrect) {
            setQuizIsCorrect(true);
            setQuizFeedback(`Correct! ${selectedSubstance} is an ${correctType.toLowerCase()}. ✅`);
        } else {
            if (newAttempts === 1) {
                setQuizFeedback("Not quite right. Look at the color change again and think about the rules. Try again! 🔄");
            } else {
                setQuizIsCorrect(false);
                setQuizFeedback(`Incorrect. The correct answer is ${correctType}. Remember: Acids turn blue litmus red, bases turn red litmus blue. 🧠`);
            }
        }
    };
    
    const getResultColorClass = () => {
        if (!result) return 'bg-gray-200 dark:bg-gray-700'; // Neutral color
        if (result === 'Red') return 'bg-red-500';
        if (result === 'Blue') return 'bg-blue-500';
        // 'No Change' case
        return selectedPaper === 'Red' ? 'bg-red-300' : 'bg-blue-300';
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Objective</CardTitle>
                        <TextToSpeech textToSpeak="To use virtual litmus paper to determine if common substances are acidic, basic, or neutral." />
                    </div>
                    <CardDescription>To use virtual litmus paper to determine if common substances are acidic, basic, or neutral.</CardDescription>
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
                            <p>Acids and bases are two fundamental classes of chemical compounds. Their properties are often described using the pH scale. An <strong>indicator</strong> is a substance that changes color in the presence of an acid or a base.</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Litmus paper</strong> is a common indicator.</li>
                                <li><strong>Acids</strong> have a pH less than 7 and turn blue litmus paper <strong>red</strong>.</li>
                                <li><strong>Bases</strong> (or alkalis) have a pH greater than 7 and turn red litmus paper <strong>blue</strong>.</li>
                                <li><strong>Neutral</strong> substances have a pH of 7 and do not change the color of either litmus paper.</li>
                            </ul>
                        </div>
                        <TextToSpeech textToSpeak="Acids and bases are two fundamental classes of chemical compounds. An indicator is a substance that changes color in the presence of an acid or a base. Acids turn blue litmus paper red. Bases turn red litmus paper blue. Neutral substances do not change the color of either litmus paper." className="flex-shrink-0" />
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
                        <li>While this lab is virtual, in a real laboratory, always wear safety goggles and gloves when handling chemicals.</li>
                        <li>Never taste or smell chemicals directly to identify them.</li>
                        <li>Handle strong acids and bases with extreme care as they can be corrosive.</li>
                        <li>Always add acid to water, never the other way around, to prevent dangerous splashing.</li>
                        </ul>
                    </AccordionContent>
                    </AccordionItem>
                </Accordion>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Experiment Setup</CardTitle>
                    <CardDescription>Select a substance and a type of litmus paper, then press "Test".</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Select onValueChange={handleSubstanceChange} defaultValue={selectedSubstance}>
                            <SelectTrigger><SelectValue placeholder="Select Substance..." /></SelectTrigger>
                            <SelectContent>
                                {Object.keys(substances).map(sub => (
                                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={handlePaperChange} defaultValue={selectedPaper}>
                            <SelectTrigger><SelectValue placeholder="Select Litmus Paper..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Blue">Blue Litmus Paper</SelectItem>
                                <SelectItem value="Red">Red Litmus Paper</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex gap-4">
                            <Button onClick={handleTest} className="w-full">Test Substance</Button>
                            <Button variant="outline" onClick={handleReset} className="w-full">Reset</Button>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center min-h-[150px] bg-muted/30 rounded-lg p-4 space-y-4">
                        <div className="flex items-end gap-2">
                           <TestTube className="h-20 w-20 text-gray-400"/>
                           <div className="flex flex-col items-center">
                                <p className="text-sm font-medium">Result</p>
                                <div className={cn("w-6 h-12 rounded border border-foreground/20 transition-colors", getResultColorClass())} />
                                {result && <p className="text-xs mt-1">{result}</p>}
                           </div>
                        </div>
                         <p className="text-xs text-muted-foreground text-center">The litmus paper shows the result after being dipped in the substance.</p>
                    </div>
                </CardContent>
            </Card>
            
            {result && (
                <Card>
                    <CardHeader>
                        <CardTitle>Classify the Substance</CardTitle>
                        <CardDescription>Based on the litmus test result, what type of substance is {selectedSubstance}?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup value={quizAnswer} onValueChange={(v) => setQuizAnswer(v as SubstanceCategory)} disabled={quizIsCorrect !== null}>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Acid" id="q-acid" /><Label htmlFor="q-acid">Acid</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Base" id="q-base" /><Label htmlFor="q-base">Base</Label></div>
                            <div className="flex items-center space-x-2 py-1"><RadioGroupItem value="Neutral" id="q-neutral" /><Label htmlFor="q-neutral">Neutral</Label></div>
                        </RadioGroup>
                        {quizFeedback && <p className={cn("mt-3 text-sm flex items-center gap-2 p-2 rounded-md", quizIsCorrect === true && "text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300", quizIsCorrect === false && "text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300", quizIsCorrect === null && quizAttempts === 1 && "text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300")}>{quizIsCorrect === true ? <CheckCircle className="h-5 w-5"/> : !quizIsCorrect && quizAttempts > 1 ? <XCircle className="h-5 w-5"/> : <RefreshCw className="h-5 w-5 animate-spin"/>}{quizFeedback}</p>}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleQuizSubmit} disabled={!quizAnswer || quizIsCorrect !== null} size="sm">
                            {quizIsCorrect === true ? "Correct!" : quizIsCorrect === false ? "Answer Shown" : quizAttempts === 1 && quizIsCorrect === null ? "Try Again" : "Check Classification"}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Conclusion</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert text-muted-foreground">
                    <ul>
                        <li><strong>Acids</strong> turn blue litmus paper red.</li>
                        <li><strong>Bases (alkalis)</strong> turn red litmus paper blue.</li>
                        <li><strong>Neutral</strong> substances do not change the color of litmus paper.</li>
                    </ul>
                </CardContent>
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
