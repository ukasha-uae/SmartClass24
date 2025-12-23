'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, CheckCircle, XCircle, Award, Trophy, TestTube, Sparkles, AlertTriangle, Beaker } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { useLocalization } from '@/hooks/useLocalization';

type TestType = 'copper-sulfate' | 'cobalt-chloride' | 'none';

interface TestResult {
  testType: TestType;
  observation: string;
  conclusion: string;
}

export function WaterTestLabEnhanced() {
  const [step, setStep] = React.useState<'intro' | 'collect-supplies' | 'setup' | 'experiment' | 'results' | 'quiz' | 'complete'>('intro');
  const [selectedTest, setSelectedTest] = React.useState<TestType>('none');
  const [isTesting, setIsTesting] = React.useState(false);
  const [testResults, setTestResults] = React.useState<TestResult[]>([]);
  const [copperSulfateColor, setCopperSulfateColor] = React.useState<'white' | 'blue'>('white');
  const [cobaltPaperColor, setCobaltPaperColor] = React.useState<'blue' | 'pink'>('blue');
  const [quizAnswers, setQuizAnswers] = React.useState<Record<number, number>>({});
  const [showQuizFeedback, setShowQuizFeedback] = React.useState(false);
  const [quizScore, setQuizScore] = React.useState(0);
  const [teacherMessage, setTeacherMessage] = React.useState('');
  const [currentObservation, setCurrentObservation] = React.useState('');
  const [suppliesCollected, setSuppliesCollected] = React.useState<string[]>([]);

  const { markLabComplete, isLabCompleted } = useLabProgress();
  const { country } = useLocalization();
  const labId = 'water-test';
  const isComplete = isLabCompleted(labId);

  React.useEffect(() => {
    setTeacherMessage(`Welcome to the Water Testing Lab! Today we'll learn two chemical tests that scientists in ${country.name} and worldwide use to detect water. These tests are important for quality control in industries, laboratories, and even in everyday products. Let's discover how chemical color changes can reveal the presence of water!`);
  }, [country.name]);

  const tests = {
    'copper-sulfate': {
      name: 'Anhydrous Copper(II) Sulfate Test',
      icon: '⚗️',
      description: 'White powder that turns blue in the presence of water',
      chemical: 'CuSO₄',
    },
    'cobalt-chloride': {
      name: 'Cobalt(II) Chloride Paper Test',
      icon: '📄',
      description: 'Blue paper that turns pink when water is present',
      chemical: 'CoCl₂',
    },
  };

  const quizQuestions = [
    {
      question: "What color does anhydrous copper(II) sulfate turn in the presence of water?",
      options: ["Remains white", "Turns blue", "Turns green", "Turns red"],
      correct: 1,
    },
    {
      question: "What does 'anhydrous' mean?",
      options: [
        "Contains water",
        "Without water",
        "Dissolved in water",
        "Frozen water"
      ],
      correct: 1,
    },
    {
      question: "Cobalt chloride paper changes from blue to which color when water is present?",
      options: ["Green", "Yellow", "Pink", "Red"],
      correct: 2,
    },
  ];

  const handleTest = () => {
    if (selectedTest === 'none') return;

    setIsTesting(true);
    setCurrentObservation('Adding water to the sample...');

    setTimeout(() => {
      if (selectedTest === 'copper-sulfate') {
        setCurrentObservation('The powder is absorbing water molecules...');
      } else {
        setCurrentObservation('Water droplets spreading on the paper...');
      }
    }, 800);

    setTimeout(() => {
      let observation = '';
      let conclusion = '';

      if (selectedTest === 'copper-sulfate') {
        setTimeout(() => setTeacherMessage('Watch carefully as we add water to the white powder...'), 500);
        setTimeout(() => setTeacherMessage('Excellent! The dramatic color change from white to blue is our chemical proof that water is present. This happens because the copper sulfate molecules are binding with water molecules!'), 1500);
        setCopperSulfateColor('blue');
        observation = 'The white anhydrous copper(II) sulfate powder immediately turns bright blue when water is added!';
        conclusion = 'The color change from white to blue confirms the presence of water. The anhydrous (water-free) form absorbs water and becomes hydrated copper(II) sulfate (CuSO₄·5H₂O).';
      } else if (selectedTest === 'cobalt-chloride') {
        setTimeout(() => setTeacherMessage('Notice how sensitive this test is - even a single drop causes the color change...'), 500);
        setTimeout(() => setTeacherMessage('Perfect! The blue paper turning pink is another reliable indicator of water. This test is so sensitive it can even detect moisture in the air!'), 1500);
        setCobaltPaperColor('pink');
        observation = 'The blue cobalt(II) chloride paper turns pink when touched with water droplets!';
        conclusion = 'The color change from blue to pink confirms water is present. Blue anhydrous cobalt chloride absorbs water to form pink hydrated cobalt chloride.';
      }

      const result: TestResult = {
        testType: selectedTest,
        observation,
        conclusion,
      };

      setTestResults((prev) => {
        const newResults = [...prev, result];
        if (newResults.length === 1) {
          setTimeout(() => setTeacherMessage('Great work on your first test! Now try the other test to see a different color change reaction.'), 2500);
        } else if (newResults.length === 2) {
          setTimeout(() => setTeacherMessage("Excellent! You've completed both water tests successfully. You now know two reliable methods chemists use to detect water. Let's analyze what we learned!"), 2500);
        }
        return newResults;
      });
      setIsTesting(false);
      setCurrentObservation('');

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }, 2000);
  };

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) {
        score++;
      }
    });
    setQuizScore(score);
    setShowQuizFeedback(true);

    if (score === quizQuestions.length) {
      setTimeout(() => setTeacherMessage("Perfect score! You've mastered water testing methods. You understand both the practical techniques and the chemistry behind them. Excellent work!"), 500);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else if (score >= 2) {
      setTimeout(() => setTeacherMessage('Good effort! You got most of the answers correct. Review the explanations to strengthen your understanding of water tests.'), 500);
    } else {
      setTimeout(() => setTeacherMessage('Keep learning! Review the color changes and chemical reactions. Understanding these tests takes practice.'), 500);
    }
  };

  const handleComplete = () => {
    markLabComplete(labId, 100, 0);
    setStep('complete');
    setTeacherMessage(`Congratulations! You've successfully completed the Water Testing Lab. You now know how to detect water using chemical tests - skills that scientists and quality control experts in ${country.name} and around the world use every day. Well done!`);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
    });
  };

  const resetLab = () => {
    setStep('intro');
    setSelectedTest('none');
    setIsTesting(false);
    setTestResults([]);
    setCopperSulfateColor('white');
    setCobaltPaperColor('blue');
    setQuizAnswers({});
    setShowQuizFeedback(false);
    setQuizScore(0);
    setCurrentObservation('');
    setSuppliesCollected([]);
    setTeacherMessage(`Welcome to the Water Testing Lab! Today we'll learn two chemical tests that scientists in ${country.name} and worldwide use to detect water. These tests are important for quality control in industries, laboratories, and even in everyday products. Let's discover how chemical color changes can reveal the presence of water!`);
  };

  const resetTest = () => {
    setSelectedTest('none');
    setCopperSulfateColor('white');
    setCobaltPaperColor('blue');
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Teacher Voice */}
      {teacherMessage && (
        <TeacherVoice 
          message={teacherMessage}
          theme="science"
          teacherName="Lab Instructor"
          emotion={step === 'complete' ? 'celebrating' : testResults.length >= 2 ? 'happy' : 'explaining'}
          context={{
              attempts: testResults.length,
              correctStreak: testResults.filter((t: any) => t.colorChangeObserved).length
          }}
          quickActions={[
              { label: 'Reset Lab', icon: '🔄', onClick: () => window.location.reload() },
              { label: 'View Theory', icon: '📖', onClick: () => document.querySelector('[value="theory"]')?.parentElement?.click() },
              { label: 'Safety Tips', icon: '🛡️', onClick: () => document.querySelector('[value="safety"]')?.parentElement?.click() }
          ]}
        />
      )}

      {/* Progress Indicator */}
      {step !== 'intro' && step !== 'complete' && (
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              {[
                { key: 'collect-supplies', label: 'Supplies', icon: Beaker },
                { key: 'setup', label: 'Setup', icon: TestTube },
                { key: 'experiment', label: 'Testing', icon: Droplets },
                { key: 'results', label: 'Analysis', icon: Sparkles },
                { key: 'quiz', label: 'Quiz', icon: Award },
              ].map((s, idx) => {
                const StepIcon = s.icon;
                const isActive = step === s.key;
                const isCompleted = ['collect-supplies', 'setup', 'experiment', 'results', 'quiz'].indexOf(step) > 
                                   ['collect-supplies', 'setup', 'experiment', 'results', 'quiz'].indexOf(s.key);
                return (
                  <div key={s.key} className="flex items-center gap-2">
                    <div className={`flex flex-col items-center gap-1 ${isActive ? 'scale-110' : ''} transition-transform`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        isCompleted ? 'bg-green-500 border-green-500 text-white' :
                        isActive ? 'bg-cyan-500 border-cyan-500 text-white' :
                        'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                      </div>
                      <span className={`text-xs font-medium ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-500'}`}>
                        {s.label}
                      </span>
                    </div>
                    {idx < 4 && (
                      <div className={`hidden md:block h-0.5 w-8 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Droplets className="w-8 h-8 text-cyan-600" />
            Testing for Water - Chemical Tests
          </CardTitle>
          <CardDescription className="text-base">
            Learn how to detect the presence of water using chemical indicators
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {/* INTRODUCTION STEP */}
            {step === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-cyan-500" />
                    Chemical Tests for Water
                  </h3>
                  <p>
                    Water is essential for life and is present in many substances. Sometimes we need to 
                    chemically confirm whether water is present in a sample. Two reliable chemical tests 
                    can identify water through observable color changes.
                  </p>

                  <h4 className="text-lg font-semibold mt-4">Two Main Tests:</h4>

                  <div className="grid md:grid-cols-2 gap-4 not-prose mt-4">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <div className="text-3xl mb-2">⚗️</div>
                      <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Anhydrous Copper(II) Sulfate
                      </h5>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        White powder (CuSO₄) that turns <strong>bright blue</strong> when water is added. 
                        "Anhydrous" means "without water" - the test works because the chemical absorbs 
                        water and becomes hydrated.
                      </p>
                      <div className="mt-3 text-xs">
                        <strong>Reaction:</strong> CuSO₄ + 5H₂O → CuSO₄·5H₂O
                      </div>
                    </div>

                    <div className="bg-pink-50 dark:bg-pink-950 p-4 rounded-lg">
                      <div className="text-3xl mb-2">📄</div>
                      <h5 className="font-semibold text-pink-900 dark:text-pink-100 mb-2">
                        Cobalt(II) Chloride Paper
                      </h5>
                      <p className="text-sm text-pink-800 dark:text-pink-200">
                        Blue paper (CoCl₂) that turns <strong>pink</strong> when water touches it. 
                        This is a very sensitive test - even small amounts of water cause the color change.
                      </p>
                      <div className="mt-3 text-xs">
                        <strong>Change:</strong> Blue (anhydrous) → Pink (hydrated)
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950 border-l-4 border-amber-500 p-4 mt-6 rounded">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-900 dark:text-amber-100">Safety Precautions!</h4>
                        <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 mt-2">
                          <li>• Wear safety goggles - copper sulfate can irritate eyes</li>
                          <li>• Avoid skin contact with chemicals</li>
                          <li>• Cobalt compounds are toxic - do not ingest</li>
                          <li>• Wash hands thoroughly after the experiment</li>
                          <li>• Use small amounts of chemicals</li>
                          <li>• Work in a well-ventilated area</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold mt-6">Why These Tests Work:</h4>
                  <p>
                    Both tests rely on <strong>hydration</strong> - the process where water molecules 
                    bind to other molecules. When anhydrous (water-free) chemicals absorb water, their 
                    crystal structure changes, which alters the way they absorb and reflect light. 
                    This structural change creates the visible color change we observe.
                  </p>
                </div>

                <Button
                  onClick={() => {
                    setStep('collect-supplies');
                    setTeacherMessage("Before we begin testing, let's gather all the materials we'll need for both water tests. Click each item to collect it!");
                  }}
                  size="lg"
                  className="w-full"
                >
                  Begin Testing
                </Button>
              </motion.div>
            )}

            {/* COLLECT SUPPLIES STEP */}
            {step === 'collect-supplies' && (
              <motion.div
                key="collect-supplies"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
                    <Beaker className="w-6 h-6 text-cyan-500" />
                    Gather Your Supplies
                  </h3>
                  <p className="text-muted-foreground">
                    Click on each item to collect it for your experiments
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { id: 'copper-sulfate', name: 'Anhydrous Copper Sulfate', icon: '⚗️', emoji: '🤍' },
                    { id: 'cobalt-paper', name: 'Cobalt Chloride Paper', icon: '📄', emoji: '💙' },
                    { id: 'dropper', name: 'Water Dropper', icon: '💧', emoji: '💧' },
                    { id: 'test-tubes', name: 'Test Tubes', icon: '🧪', emoji: '🧪' },
                    { id: 'water', name: 'Distilled Water', icon: '💦', emoji: '💦' },
                    { id: 'goggles', name: 'Safety Goggles', icon: '🥽', emoji: '🥽' },
                  ].map((supply) => {
                    const collected = suppliesCollected.includes(supply.id);
                    return (
                      <motion.button
                        key={supply.id}
                        onClick={() => {
                          if (!collected) {
                            setSuppliesCollected((prev) => [...prev, supply.id]);
                            confetti({
                              particleCount: 30,
                              spread: 50,
                              origin: { y: 0.6 },
                            });
                          }
                        }}
                        disabled={collected}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          collected
                            ? 'border-green-500 bg-green-50 dark:bg-green-950'
                            : 'border-gray-200 dark:border-gray-700 hover:border-cyan-300 hover:shadow-lg'
                        }`}
                        whileHover={{ scale: collected ? 1 : 1.05 }}
                        whileTap={{ scale: collected ? 1 : 0.95 }}
                      >
                        <div className="text-4xl mb-2">{supply.emoji}</div>
                        <h4 className="font-semibold text-sm mb-1">{supply.name}</h4>
                        {collected && (
                          <div className="flex items-center justify-center gap-1 text-green-600 text-sm mt-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Collected</span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {suppliesCollected.length === 6 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Button
                      onClick={() => {
                        setStep('setup');
                        setTeacherMessage("Perfect! Now that we have all our supplies, let's review the testing procedures. Both tests rely on hydration - when water molecules bind to anhydrous chemicals, changing their structure and color.");
                      }}
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      All Supplies Collected - Continue
                    </Button>
                  </motion.div>
                )}

                {suppliesCollected.length < 6 && (
                  <div className="text-center text-sm text-muted-foreground">
                    {suppliesCollected.length}/6 supplies collected
                  </div>
                )}
              </motion.div>
            )}

            {/* SETUP STEP */}
            {step === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <TestTube className="w-6 h-6 text-cyan-500" />
                    Preparing Your Tests
                  </h3>

                  <div className="bg-cyan-50 dark:bg-cyan-950 p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold text-cyan-900 dark:text-cyan-100">Materials Needed:</h4>
                    <ul className="space-y-2 text-cyan-800 dark:text-cyan-200">
                      <li>• Anhydrous copper(II) sulfate powder (white)</li>
                      <li>• Cobalt(II) chloride paper (blue)</li>
                      <li>• Dropper or pipette</li>
                      <li>• Small test tubes or watch glasses</li>
                      <li>• Distilled water sample</li>
                      <li>• Safety goggles and gloves</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Procedure:</h4>
                    <ol className="space-y-2 text-blue-800 dark:text-blue-200">
                      <li><strong>Test 1 - Copper Sulfate:</strong> Place a small amount of white anhydrous 
                      copper sulfate in a test tube or on a watch glass. Add 1-2 drops of water and observe.</li>
                      <li><strong>Test 2 - Cobalt Chloride:</strong> Touch a drop of water to the blue 
                      cobalt chloride paper using a dropper. Observe the color change.</li>
                    </ol>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setStep('experiment');
                    setTeacherMessage('Now for the exciting part! Select a test and add water to observe the chemical color change. Remember to observe carefully!');
                  }}
                  size="lg"
                  className="w-full"
                >
                  Perform Tests
                </Button>
              </motion.div>
            )}

            {/* EXPERIMENT STEP */}
            {step === 'experiment' && (
              <motion.div
                key="experiment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Select a Test to Perform</h3>
                  <p className="text-muted-foreground">
                    Try both tests to see the different color changes
                  </p>
                </div>

                {/* Test Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(Object.keys(tests) as Array<keyof typeof tests>).map((test) => {
                    const testInfo = tests[test];
                    const alreadyTested = testResults.some(r => r.testType === test);
                    return (
                      <motion.button
                        key={test}
                        onClick={() => !isTesting && setSelectedTest(test)}
                        disabled={isTesting || alreadyTested}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          selectedTest === test
                            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700 hover:border-cyan-300'
                        } ${
                          alreadyTested ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        whileHover={{ scale: isTesting || alreadyTested ? 1 : 1.02 }}
                        whileTap={{ scale: isTesting || alreadyTested ? 1 : 0.98 }}
                      >
                        <div className="text-4xl mb-3">{testInfo.icon}</div>
                        <h4 className="font-semibold mb-2">{testInfo.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {testInfo.description}
                        </p>
                        <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {testInfo.chemical}
                        </div>
                        {alreadyTested && (
                          <div className="mt-3 flex items-center justify-center gap-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Visualization Area */}
                {selectedTest !== 'none' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg"
                  >
                    <div className="flex flex-col items-center gap-6">
                      {/* Copper Sulfate Test */}
                      {selectedTest === 'copper-sulfate' && (
                        <div className="relative">
                          <div className="flex items-center gap-8">
                            {/* Test tube with powder */}
                            <div className="flex flex-col items-center gap-2">
                              <p className="text-sm font-medium">Anhydrous CuSO₄</p>
                              <div className="relative">
                                <svg width="80" height="160" viewBox="0 0 80 160" className="mx-auto">
                                  {/* Test tube */}
                                  <rect
                                    x="20"
                                    y="10"
                                    width="40"
                                    height="140"
                                    rx="5"
                                    fill="none"
                                    stroke="#999"
                                    strokeWidth="3"
                                  />
                                  {/* Powder */}
                                  <rect
                                    x="23"
                                    y="120"
                                    width="34"
                                    height="27"
                                    fill={copperSulfateColor === 'white' ? '#F5F5F5' : '#4A90E2'}
                                    className="transition-colors duration-1000"
                                  />
                                  {/* Powder particles */}
                                  {Array.from({ length: 8 }).map((_, i) => (
                                    <circle
                                      key={i}
                                      cx={28 + (i % 4) * 8}
                                      cy={125 + Math.floor(i / 4) * 8}
                                      r="2"
                                      fill={copperSulfateColor === 'white' ? '#E0E0E0' : '#2171C9'}
                                      className="transition-colors duration-1000"
                                    />
                                  ))}
                                </svg>
                                
                                {/* Water droplet animation */}
                                {isTesting && (
                                  <motion.div
                                    className="absolute top-0 left-1/2 -translate-x-1/2"
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 100, opacity: [0, 1, 1, 0] }}
                                    transition={{ duration: 1.5 }}
                                  >
                                    <Droplets className="w-8 h-8 text-blue-400" />
                                  </motion.div>
                                )}
                              </div>
                              <div className={`text-sm font-medium px-3 py-1 rounded ${
                                copperSulfateColor === 'white' 
                                  ? 'bg-gray-200 dark:bg-gray-700' 
                                  : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                              }`}>
                                {copperSulfateColor === 'white' ? 'White' : 'Blue ✓'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Cobalt Chloride Test */}
                      {selectedTest === 'cobalt-chloride' && (
                        <div className="relative">
                          <div className="flex flex-col items-center gap-4">
                            <p className="text-sm font-medium">Cobalt Chloride Paper</p>
                            
                            {/* Paper strip */}
                            <div className="relative">
                              <motion.div
                                className={`w-32 h-48 rounded-lg border-4 transition-all duration-1000 ${
                                  cobaltPaperColor === 'blue'
                                    ? 'bg-blue-400 border-blue-600'
                                    : 'bg-pink-400 border-pink-600'
                                }`}
                                animate={isTesting ? {
                                  scale: [1, 1.05, 1],
                                } : {}}
                                transition={{ duration: 0.5, repeat: isTesting ? 3 : 0 }}
                              >
                                {/* Water spot spreading */}
                                {cobaltPaperColor === 'pink' && (
                                  <motion.div
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-pink-500 rounded-full"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1.5, opacity: 0.3 }}
                                    transition={{ duration: 1.5 }}
                                  />
                                )}
                              </motion.div>

                              {/* Water droplet animation */}
                              {isTesting && (
                                <motion.div
                                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8"
                                  initial={{ y: -20, opacity: 0 }}
                                  animate={{ y: 80, opacity: [0, 1, 1, 0] }}
                                  transition={{ duration: 1.5 }}
                                >
                                  <Droplets className="w-8 h-8 text-blue-400" />
                                </motion.div>
                              )}
                            </div>

                            <div className={`text-sm font-medium px-3 py-1 rounded ${
                              cobaltPaperColor === 'blue'
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                : 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300'
                            }`}>
                              {cobaltPaperColor === 'blue' ? 'Blue (dry)' : 'Pink (wet) ✓'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Current Observation Display */}
                {currentObservation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800 p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        {currentObservation}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Test Button */}
                {selectedTest !== 'none' && !isTesting && !testResults.some(r => r.testType === selectedTest) && (
                  <div className="space-y-3">
                    <Button
                      onClick={handleTest}
                      size="lg"
                      className="w-full"
                    >
                      <Droplets className="w-5 h-5 mr-2" />
                      Add Water to Test
                    </Button>
                    <Button
                      onClick={resetTest}
                      size="lg"
                      variant="outline"
                      className="w-full"
                    >
                      Try Different Test
                    </Button>
                  </div>
                )}

                {/* Results Display */}
                {testResults.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Test Results:</h4>
                    {testResults.map((result, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h5 className="font-semibold capitalize mb-1">
                              {result.testType === 'copper-sulfate' ? 'Copper Sulfate Test' : 'Cobalt Chloride Test'}
                            </h5>
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>Observation:</strong> {result.observation}
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              <strong>Conclusion:</strong> {result.conclusion}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Continue Button */}
                {testResults.length >= 2 && (
                  <Button
                    onClick={() => {
                      setStep('results');
                      setTeacherMessage("Outstanding work! Let's dive deeper into the chemistry behind these tests and explore their real-world applications.");
                    }}
                    size="lg"
                    className="w-full"
                  >
                    View Analysis
                  </Button>
                )}
              </motion.div>
            )}

            {/* RESULTS STEP */}
            {step === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Sparkles className="w-7 h-7 text-cyan-500" />
                    Understanding Water Tests
                  </h3>
                </div>

                <div className="prose dark:prose-invert max-w-none space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-950 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                      🧪 Chemical Principles:
                    </h4>
                    <div className="space-y-3 text-blue-800 dark:text-blue-200">
                      <div>
                        <strong>Anhydrous vs Hydrated:</strong> "Anhydrous" means "without water." 
                        When anhydrous compounds absorb water, they become "hydrated" and their properties 
                        change, including color.
                      </div>
                      <div>
                        <strong>Copper Sulfate Reaction:</strong> White anhydrous copper(II) sulfate 
                        (CuSO₄) combines with water to form blue hydrated copper(II) sulfate (CuSO₄·5H₂O). 
                        Each molecule binds with 5 water molecules in its crystal structure.
                      </div>
                      <div>
                        <strong>Cobalt Chloride Change:</strong> Blue anhydrous cobalt(II) chloride 
                        absorbs water to become pink hydrated cobalt(II) chloride. This test is so 
                        sensitive it can detect moisture in the air!
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                      🌍 Real-World Applications:
                    </h4>
                    <ul className="space-y-2 text-green-800 dark:text-green-200">
                      <li>
                        <strong>Silica Gel Packets:</strong> Those little packets in shoe boxes contain 
                        silica gel with cobalt chloride. The indicator changes color to show when the 
                        gel has absorbed moisture and needs replacement.
                      </li>
                      <li>
                        <strong>Quality Control in {country.name}:</strong> Industries across {country.name} use these tests to ensure products 
                        are properly dried before packaging. Moisture can spoil electronics, medications, 
                        and food products.
                      </li>
                      <li>
                        <strong>Chemical Labs:</strong> Chemists use these tests to check if their 
                        solvents contain water contamination, which could affect experimental results.
                      </li>
                      <li>
                        <strong>Weather Instruments:</strong> Hygrometers (humidity measurers) use 
                        cobalt chloride to indicate moisture levels in the air.
                      </li>
                      <li>
                        <strong>Leak Detection:</strong> These tests can identify water leaks in sealed 
                        containers or systems by detecting even small amounts of moisture.
                      </li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
                      ⚗️ Why Color Changes Occur:
                    </h4>
                    <div className="text-purple-800 dark:text-purple-200 space-y-2">
                      <p>
                        Color in chemicals is caused by how electrons absorb and reflect light. When 
                        water molecules bind to anhydrous compounds, they change the electronic structure 
                        around the metal ions (copper or cobalt).
                      </p>
                      <p>
                        This structural change affects which wavelengths of light are absorbed. The light 
                        that isn't absorbed is reflected to our eyes as the color we see. That's why 
                        copper sulfate changes from white (reflects all colors) to blue (absorbs red/yellow, 
                        reflects blue).
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setStep('quiz');
                    setTeacherMessage('Time to test your understanding! These questions will check if you grasp the chemistry behind water detection.');
                  }}
                  size="lg"
                  className="w-full"
                >
                  Take the Quiz
                </Button>
              </motion.div>
            )}

            {/* QUIZ STEP */}
            {step === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">Test Your Knowledge</h3>
                  <p className="text-muted-foreground">
                    Answer these questions about water tests
                  </p>
                </div>

                <div className="space-y-6">
                  {quizQuestions.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className="p-5 bg-gray-50 dark:bg-gray-900 rounded-lg border-2"
                    >
                      <h4 className="font-semibold mb-3">
                        {qIdx + 1}. {q.question}
                      </h4>
                      <div className="space-y-2">
                        {q.options.map((option, oIdx) => (
                          <label
                            key={oIdx}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              quizAnswers[qIdx] === oIdx
                                ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950'
                                : 'border-gray-200 dark:border-gray-700 hover:border-cyan-300'
                            } ${
                              showQuizFeedback
                                ? oIdx === q.correct
                                  ? 'border-green-500 bg-green-50 dark:bg-green-950'
                                  : quizAnswers[qIdx] === oIdx
                                  ? 'border-red-500 bg-red-50 dark:bg-red-950'
                                  : ''
                                : ''
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${qIdx}`}
                              checked={quizAnswers[qIdx] === oIdx}
                              onChange={() => {
                                if (!showQuizFeedback) {
                                  setQuizAnswers((prev) => ({
                                    ...prev,
                                    [qIdx]: oIdx,
                                  }));
                                }
                              }}
                              disabled={showQuizFeedback}
                              className="w-4 h-4"
                            />
                            <span className="flex-1">{option}</span>
                            {showQuizFeedback && oIdx === q.correct && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                            {showQuizFeedback &&
                              quizAnswers[qIdx] === oIdx &&
                              oIdx !== q.correct && (
                                <XCircle className="w-5 h-5 text-red-600" />
                              )}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {!showQuizFeedback && (
                  <Button
                    onClick={handleQuizSubmit}
                    size="lg"
                    className="w-full"
                    disabled={
                      Object.keys(quizAnswers).length < quizQuestions.length
                    }
                  >
                    Submit Answers
                  </Button>
                )}

                {showQuizFeedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <Card className={`border-2 ${
                      quizScore === quizQuestions.length 
                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950'
                        : quizScore >= 2
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950'
                        : 'border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950'
                    }`}>
                      <CardContent className="p-6 text-center space-y-3">
                        <div className="text-6xl mb-2">
                          {quizScore === quizQuestions.length ? '🏆' : quizScore >= 2 ? '👍' : '📚'}
                        </div>
                        <h3 className="text-3xl font-bold">
                          {quizScore} / {quizQuestions.length}
                        </h3>
                        <p className="text-lg font-medium">
                          {quizScore === quizQuestions.length
                            ? 'Perfect Score! Outstanding!'
                            : quizScore >= 2
                            ? 'Good Work! Almost There!'
                            : 'Keep Practicing!'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {quizScore === quizQuestions.length
                            ? "You've mastered water testing methods and chemistry!"
                            : quizScore >= 2
                            ? 'Review the explanations to strengthen your understanding.'
                            : 'Take time to review the concepts and try again.'}
                        </p>
                      </CardContent>
                    </Card>

                    <Button
                      onClick={handleComplete}
                      size="lg"
                      className="w-full"
                    >
                      <Trophy className="w-5 h-5 mr-2" />
                      Complete Lab
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* COMPLETE STEP */}
            {step === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-6 py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
                </motion.div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-bold">Congratulations! 🎉</h3>
                  <p className="text-xl text-muted-foreground">
                    You've completed the Water Test Lab
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-cyan-600">
                  <Award className="w-8 h-8" />
                  <span>+100 XP</span>
                </div>

                <div className="prose dark:prose-invert max-w-none text-left bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3">What You Learned:</h4>
                  <ul className="space-y-2">
                    <li>✓ How to use anhydrous copper sulfate to test for water (white → blue)</li>
                    <li>✓ How cobalt chloride paper detects water (blue → pink)</li>
                    <li>✓ The difference between anhydrous and hydrated compounds</li>
                    <li>✓ Why chemical color changes occur during hydration</li>
                    <li>✓ Real-world applications in quality control and moisture detection</li>
                  </ul>
                </div>

                <Button onClick={resetLab} size="lg" variant="outline">
                  Try Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
