'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Award, Trophy, Sparkles, ArrowDown, BarChart3, CheckCircle, XCircle, Move, Scale, Ruler, GripVertical } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Measurement {
  height: number;
  potentialEnergy: number;
  speed: number;
  kineticEnergy: number;
  time: number;
}

export function WorkEnergyLabEnhanced() {
  const { toast } = useToast();
  const [step, setStep] = React.useState<'intro' | 'collect-supplies' | 'setup' | 'experiment' | 'results' | 'quiz' | 'complete'>('intro');
  const [height, setHeight] = React.useState(5);
  const [mass, setMass] = React.useState(2);
  const [isRunning, setIsRunning] = React.useState(false);
  const [currentPosition, setCurrentPosition] = React.useState(100);
  const [currentSpeed, setCurrentSpeed] = React.useState(0);
  const [measurements, setMeasurements] = React.useState<Measurement[]>([]);
  const [quizAnswers, setQuizAnswers] = React.useState<Record<number, number>>({});
  const [showQuizFeedback, setShowQuizFeedback] = React.useState(false);
  const [quizScore, setQuizScore] = React.useState(0);

  // Teacher voice
  const [teacherMessage, setTeacherMessage] = React.useState('');
  const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
  const [teacherPosition, setTeacherPosition] = React.useState({ x: 0, y: 0 });

  // Supplies tracking
  const [rampCollected, setRampCollected] = React.useState(false);
  const [massesCollected, setMassesCollected] = React.useState(false);
  const [rulerCollected, setRulerCollected] = React.useState(false);
  const [stopwatchCollected, setStopwatchCollected] = React.useState(false);

  const { markLabComplete, isLabCompleted } = useLabProgress();
  const labId = 'work-energy';
  const isComplete = isLabCompleted(labId);

  const GRAVITY = 9.81;
  const animationRef = React.useRef<number>();

  const potentialEnergy = mass * GRAVITY * height;
  const maxSpeed = Math.sqrt(2 * GRAVITY * height);

  // Intro message
  React.useEffect(() => {
    if (step === 'intro') {
      setTeacherMessage("Welcome to the Work & Energy Lab! We'll explore the Law of Conservation of Energy by watching potential energy transform into kinetic energy as objects slide down a ramp. Energy can't be created or destroyed - only transformed. Let's discover this fundamental law together!");
    }
  }, [step]);

  const handleStartExperiment = () => {
    setTeacherMessage("Great! Let's gather our supplies. Start by clicking on the INCLINED RAMP - this is where our object will slide down!");
    setPendingTransition(() => () => {
      setStep('collect-supplies');
    });
  };

  const handleTeacherComplete = () => {
    if (pendingTransition) {
      pendingTransition();
      setPendingTransition(null);
    }
  };

  const handleCollectRamp = () => {
    if (!rampCollected) {
      setRampCollected(true);
      setTeacherMessage("Perfect! Now click on the MASSES - we'll use different masses to see if mass affects the final speed!");
      toast({ title: '✅ Ramp Collected' });
    }
  };

  const handleCollectMasses = () => {
    if (rampCollected && !massesCollected) {
      setMassesCollected(true);
      setTeacherMessage("Excellent! Now click on the RULER - we need to measure the height accurately!");
      toast({ title: '✅ Masses Collected' });
    }
  };

  const handleCollectRuler = () => {
    if (massesCollected && !rulerCollected) {
      setRulerCollected(true);
      setTeacherMessage("Great! Finally, click on the STOPWATCH - we'll measure the time it takes for the object to reach the bottom!");
      toast({ title: '✅ Ruler Collected' });
    }
  };

  const handleCollectStopwatch = () => {
    if (rulerCollected && !stopwatchCollected) {
      setStopwatchCollected(true);
      setTeacherMessage("Perfect! All supplies collected! Now let's set up our experiment. Click 'Continue to Setup' to begin!");
      toast({ title: '✅ Stopwatch Collected' });
    }
  };

  const handleContinueToSetup = () => {
    setTeacherMessage("Now you can adjust the mass and height using the sliders. Notice how potential energy changes with height. When you're ready, we'll release the object and watch energy transform!");
    setStep('setup');
  };

  const quizQuestions = [
    {
      question: "What happens to potential energy as an object falls?",
      options: [
        "It increases",
        "It stays the same",
        "It converts to kinetic energy",
        "It disappears"
      ],
      correct: 2,
    },
    {
      question: "At the bottom of the ramp, where is most of the energy?",
      options: [
        "Potential energy",
        "Kinetic energy",
        "Heat energy",
        "Lost to friction"
      ],
      correct: 1,
    },
    {
      question: "If you double the height, what happens to the final speed?",
      options: [
        "Doubles",
        "Quadruples",
        "Increases by √2",
        "Stays the same"
      ],
      correct: 2,
    },
  ];

  const runSimulation = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setTeacherMessage("Watch closely! The object is sliding down. Notice how the blue PE bar decreases while the red KE bar increases. But look - the total energy (purple) stays constant!");
    
    const startTime = Date.now();
    const duration = 2000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const newPosition = 100 - (easedProgress * 100);
      const speed = maxSpeed * easedProgress;

      setCurrentPosition(newPosition);
      setCurrentSpeed(speed);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
        const measurement: Measurement = {
          height,
          potentialEnergy,
          speed: maxSpeed,
          kineticEnergy: 0.5 * mass * maxSpeed * maxSpeed,
          time: duration / 1000,
        };
        setMeasurements(prev => {
          const newMeasurements = [...prev, measurement];
          if (newMeasurements.length === 1) {
            setTeacherMessage("Excellent! You've recorded your first measurement. Try different heights to see how it affects the final speed. Notice the formula v = √(2gh) - the speed depends on height, not mass!");
          } else if (newMeasurements.length === 2) {
            setTeacherMessage("Great work! Now you're collecting valuable data. Try one or two more measurements with different heights. Compare the final speeds!");
          } else if (newMeasurements.length >= 3) {
            setTeacherMessage("Perfect! You've collected enough data. Notice the pattern: higher starting point = greater final speed. When ready, click 'View Results' to analyze your findings!");
          }
          return newMeasurements;
        });
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.7 },
        });
      }
    };

    animate();
  };

  React.useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleReset = () => {
    setCurrentPosition(100);
    setCurrentSpeed(0);
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
      setTeacherMessage("Perfect score! You've mastered the Law of Conservation of Energy! You understand how PE transforms to KE while total energy stays constant. Excellent work!");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else if (score >= quizQuestions.length / 2) {
      setTeacherMessage(`Good effort! You got ${score} out of ${quizQuestions.length} correct. Review the explanations below and think about how energy transforms from PE to KE.`);
    } else {
      setTeacherMessage(`You got ${score} out of ${quizQuestions.length}. Don't worry! Review the concepts and try the experiment again to see how energy transforms.`);
    }
  };

  const handleComplete = () => {
    markLabComplete(labId, 100, 0);
    setStep('complete');
    setTeacherMessage("Congratulations on completing the Work & Energy Lab! You've learned one of the most fundamental laws in physics. This principle applies to everything from roller coasters to hydroelectric dams!");
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
    });
  };

  const resetLab = () => {
    setStep('intro');
    setHeight(5);
    setMass(2);
    setIsRunning(false);
    setCurrentPosition(100);
    setCurrentSpeed(0);
    setMeasurements([]);
    setQuizAnswers({});
    setShowQuizFeedback(false);
    setQuizScore(0);
    setRampCollected(false);
    setMassesCollected(false);
    setRulerCollected(false);
    setStopwatchCollected(false);
    setPendingTransition(null);
    setTeacherMessage("Ready to explore Work & Energy again!");
  };

  const currentKineticEnergy = 0.5 * mass * currentSpeed * currentSpeed;
  const currentPotentialEnergy = mass * GRAVITY * height * (currentPosition / 100);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Draggable Teacher Voice */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={{ left: -300, right: 300, top: -100, bottom: 400 }}
        onDragEnd={(_, info) => {
          setTeacherPosition({ x: info.offset.x, y: info.offset.y });
        }}
        initial={{ x: 0, y: 0 }}
        style={{ x: teacherPosition.x, y: teacherPosition.y }}
        className="fixed bottom-16 left-2 right-2 md:left-auto md:right-4 md:w-96 max-w-md z-50 touch-none"
      >
        <Card className="shadow-2xl border-2 border-purple-400 dark:border-purple-600 cursor-move">
          <CardHeader className="pb-2 py-2 md:py-4">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-xs md:text-sm">Teacher Guide (Drag to Move)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <TeacherVoice 
              message={teacherMessage}
              onComplete={handleTeacherComplete}
            />
          </CardContent>
        </Card>
      </motion.div>

      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Zap className="w-8 h-8 text-purple-600" />
            Work and Energy - Conservation of Energy
          </CardTitle>
          <CardDescription className="text-base">
            Explore how potential energy converts to kinetic energy
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
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-4">
                    <Zap className="w-16 h-16 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-purple-900 dark:text-purple-100">What You'll Learn:</h3>
                      <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                        <li>• The Law of Conservation of Energy</li>
                        <li>• How to calculate potential energy (PE = mgh)</li>
                        <li>• How to calculate kinetic energy (KE = ½mv²)</li>
                        <li>• Energy transformation from potential to kinetic</li>
                        <li>• The relationship: v = √(2gh) - final speed</li>
                        <li>• Why mass doesn't affect final speed</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                    The Law of Conservation of Energy
                  </h3>
                  <p>
                    Energy cannot be created or destroyed - it can only be transformed from one form to another. 
                    This fundamental law of physics governs everything from falling raindrops to rockets launching 
                    into space. When you push a car up a hill, that effort doesn't just disappear - it's stored 
                    as potential energy!
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 not-prose mt-6">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-5 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                        <ArrowDown className="w-7 h-7 text-blue-600 dark:text-blue-400 transform rotate-180" />
                      </div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Potential Energy (PE)
                      </h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                        Stored energy due to an object's position. The higher an object, the more potential 
                        energy it has. At Akosombo Dam, billions of liters of elevated water hold enormous 
                        potential energy, ready to power Ghana's cities!
                      </p>
                      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg font-mono text-sm text-center font-bold">
                        PE = mgh
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                        <strong>m</strong> = mass (kg) • <strong>g</strong> = 9.81 m/s² • <strong>h</strong> = height (m)
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 p-5 rounded-lg border-2 border-red-200 dark:border-red-800">
                      <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
                        <Zap className="w-7 h-7 text-red-600 dark:text-red-400" />
                      </div>
                      <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                        Kinetic Energy (KE)
                      </h4>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                        Energy of motion. Any moving object has kinetic energy. The faster it moves, 
                        the more kinetic energy it has. Note: velocity is <strong>squared</strong>, so 
                        doubling speed quadruples the energy!
                      </p>
                      <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg font-mono text-sm text-center font-bold">
                        KE = ½mv²
                      </div>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                        <strong>m</strong> = mass (kg) • <strong>v</strong> = velocity (m/s)
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 p-5 rounded-lg border-2 border-purple-200 dark:border-purple-800 mt-6">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Energy Transformation - The Beautiful Exchange
                    </h4>
                    <div className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                      <p>
                        <strong>At the top:</strong> Maximum PE (mgh), Zero KE → Total Energy = mgh
                      </p>
                      <p>
                        <strong>Halfway down:</strong> PE = mgh/2, KE = mgh/2 → Total Energy = mgh (still!)
                      </p>
                      <p>
                        <strong>At bottom:</strong> Zero PE, Maximum KE → Total Energy = mgh (constant!)
                      </p>
                      <p className="font-bold text-purple-900 dark:text-purple-100 pt-2">
                        The magic: PE + KE = constant throughout the motion!
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 p-5 rounded-lg border-l-4 border-green-500 mt-6">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                      💡 Fascinating Discovery:
                    </h4>
                    <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                      Final speed: <strong>v = √(2gh)</strong>
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Notice there's no mass (m) in this formula! A feather and a hammer dropped from the same 
                      height hit the ground at the same time (in a vacuum). Apollo 15 astronaut David Scott 
                      demonstrated this on the Moon. Mass affects the <strong>amount</strong> of energy, but 
                      not the final <strong>speed</strong>!
                    </p>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950 p-5 rounded-lg border-l-4 border-amber-500 mt-6">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                      🇬🇭 Real-World Applications in Ghana:
                    </h4>
                    <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-2">
                      <li>• <strong>Akosombo Dam:</strong> Water's PE at height converts to electrical energy powering homes</li>
                      <li>• <strong>Roller Coasters at Fantasy Dome:</strong> PE at peaks → thrilling KE in valleys</li>
                      <li>• <strong>Regenerative Brakes:</strong> Electric vehicles capture KE back to the battery</li>
                      <li>• <strong>Coconuts Falling:</strong> PE → KE (be careful under coconut trees!)</li>
                      <li>• <strong>Your Body:</strong> Food stores chemical PE that becomes KE when you run</li>
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={handleStartExperiment}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Experiment
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
              >
                <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="h-5 w-5 text-amber-600" />
                      Lab Supplies - Click to Collect
                    </CardTitle>
                    <CardDescription>Click on each item in order to collect them</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6 justify-center flex-wrap">
                      {/* Inclined Ramp */}
                      {!rampCollected && (
                        <motion.div
                          onClick={handleCollectRamp}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-purple-400 dark:border-purple-600 hover:border-purple-600 hover:shadow-xl transition-all"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <svg width="80" height="60" viewBox="0 0 80 60" className="text-purple-500">
                              <path d="M 10 50 L 70 10 L 70 50 Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2"/>
                              <line x1="10" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="3"/>
                            </svg>
                            <span className="text-sm font-medium">Inclined Ramp</span>
                            <span className="text-xs text-muted-foreground">Click to Collect</span>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Masses */}
                      {rampCollected && !massesCollected && (
                        <motion.div
                          onClick={handleCollectMasses}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-blue-400 dark:border-blue-600 hover:border-blue-600 hover:shadow-xl transition-all"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex gap-1">
                              {[0, 1, 2].map((i) => (
                                <div key={i} className="w-6 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-sm" />
                              ))}
                            </div>
                            <span className="text-sm font-medium">Masses (1-5 kg)</span>
                            <span className="text-xs text-muted-foreground">Click to Collect</span>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Ruler */}
                      {massesCollected && !rulerCollected && (
                        <motion.div
                          onClick={handleCollectRuler}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-green-400 dark:border-green-600 hover:border-green-600 hover:shadow-xl transition-all"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Ruler className="w-12 h-12 text-green-600" />
                            <span className="text-sm font-medium">Ruler (meters)</span>
                            <span className="text-xs text-muted-foreground">Click to Collect</span>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Stopwatch */}
                      {rulerCollected && !stopwatchCollected && (
                        <motion.div
                          onClick={handleCollectStopwatch}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-red-400 dark:border-red-600 hover:border-red-600 hover:shadow-xl transition-all"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <svg width="48" height="48" viewBox="0 0 48 48" className="text-red-600">
                              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>
                              <line x1="24" y1="24" x2="24" y2="10" stroke="currentColor" strokeWidth="2"/>
                              <line x1="24" y1="24" x2="34" y2="24" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <span className="text-sm font-medium">Stopwatch</span>
                            <span className="text-xs text-muted-foreground">Click to Collect</span>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Collected Items Display */}
                      <div className="w-full mt-4 flex gap-4 justify-center flex-wrap">
                        {rampCollected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 px-4 py-2 rounded-full"
                          >
                            <CheckCircle className="h-4 w-4 text-purple-600" />
                            <span className="text-sm">Ramp</span>
                          </motion.div>
                        )}
                        {massesCollected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full"
                          >
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">Masses</span>
                          </motion.div>
                        )}
                        {rulerCollected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Ruler</span>
                          </motion.div>
                        )}
                        {stopwatchCollected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2 bg-red-100 dark:bg-red-900 px-4 py-2 rounded-full"
                          >
                            <CheckCircle className="h-4 w-4 text-red-600" />
                            <span className="text-sm">Stopwatch</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  {stopwatchCollected && (
                    <CardFooter>
                      <Button onClick={handleContinueToSetup} className="w-full" size="lg">
                        Continue to Setup
                      </Button>
                    </CardFooter>
                  )}
                </Card>
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
                    <BarChart3 className="w-6 h-6 text-purple-500" />
                    Experiment Setup
                  </h3>

                  <div className="bg-blue-50 dark:bg-blue-950 p-5 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                      What You'll Do:
                    </h4>
                    <ol className="space-y-2 text-blue-800 dark:text-blue-200">
                      <li>
                        <strong>1. Adjust Parameters:</strong> Use sliders to set the mass of the object 
                        and the height from which it will slide down a ramp
                      </li>
                      <li>
                        <strong>2. Observe Energy Bars:</strong> Watch how potential energy (blue) and 
                        kinetic energy (red) change as the object moves
                      </li>
                      <li>
                        <strong>3. Release the Object:</strong> Click "Release" to watch the object slide 
                        down and see energy conversion in real-time
                      </li>
                      <li>
                        <strong>4. Collect Data:</strong> Record measurements of PE, KE, speed, and time 
                        for different heights
                      </li>
                      <li>
                        <strong>5. Analyze Results:</strong> Compare how changing height affects final 
                        speed and energy
                      </li>
                    </ol>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 p-5 rounded-lg mt-4">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                      📊 What to Observe:
                    </h4>
                    <ul className="space-y-2 text-green-800 dark:text-green-200">
                      <li>• As the object descends, PE decreases while KE increases</li>
                      <li>• The total energy (PE + KE) remains constant throughout</li>
                      <li>• Greater starting height means greater final speed</li>
                      <li>• Mass doesn't affect final speed, but does affect energy amounts</li>
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setStep('experiment');
                    setTeacherMessage("Now it's time for the experiment! Use the sliders to adjust mass and height. When ready, click 'Release Object' to watch the energy transformation. Try different combinations!");
                  }}
                  size="lg"
                  className="w-full"
                >
                  Begin Measurements
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
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Controls */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Mass: {mass} kg
                      </label>
                      <Slider
                        value={[mass]}
                        onValueChange={([v]) => !isRunning && setMass(v)}
                        min={1}
                        max={5}
                        step={0.5}
                        disabled={isRunning}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Height: {height} m
                      </label>
                      <Slider
                        value={[height]}
                        onValueChange={([v]) => {
                          if (!isRunning) {
                            setHeight(v);
                            setCurrentPosition(100);
                            setCurrentSpeed(0);
                          }
                        }}
                        min={1}
                        max={10}
                        step={0.5}
                        disabled={isRunning}
                      />
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Calculated Values:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Initial PE:</span>
                          <span className="font-bold">{potentialEnergy.toFixed(1)} J</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected Max Speed:</span>
                          <span className="font-bold">{maxSpeed.toFixed(2)} m/s</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected Final KE:</span>
                          <span className="font-bold">{(0.5 * mass * maxSpeed * maxSpeed).toFixed(1)} J</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={runSimulation}
                        disabled={isRunning}
                        className="flex-1"
                      >
                        <ArrowDown className="w-4 h-4 mr-2" />
                        Release
                      </Button>
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        disabled={isRunning}
                        className="flex-1"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>

                  {/* Visualization */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-b from-sky-200 to-green-100 dark:from-sky-900 dark:to-green-900 rounded-lg p-6 h-80 relative overflow-hidden border-2">
                      {/* Ramp */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                        <line
                          x1="20"
                          y1={200 - 20 - (height * 10)}
                          x2="180"
                          y2="180"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-gray-700 dark:text-gray-300"
                        />
                        <line
                          x1="20"
                          y1="180"
                          x2="180"
                          y2="180"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="text-gray-800 dark:text-gray-400"
                        />
                        
                        {/* Height marker */}
                        <line
                          x1="15"
                          y1={200 - 20 - (height * 10)}
                          x2="15"
                          y2="180"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeDasharray="3,3"
                          className="text-blue-500"
                        />
                        <text
                          x="8"
                          y={200 - 20 - (height * 5)}
                          className="text-xs fill-blue-600 dark:fill-blue-400"
                          fontSize="10"
                        >
                          {height}m
                        </text>
                      </svg>

                      {/* Object */}
                      <motion.div
                        className="absolute w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 shadow-lg flex items-center justify-center text-white font-bold border-2 border-red-700"
                        style={{
                          left: `${20 + (180 - 20) * (1 - currentPosition / 100)}%`,
                          top: `${20 + (height * 10) * (currentPosition / 100)}%`,
                        }}
                        animate={isRunning ? {
                          rotate: [0, 360],
                        } : {}}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      >
                        {mass}kg
                      </motion.div>

                      {/* Speed indicator */}
                      {currentSpeed > 0 && (
                        <motion.div
                          className="absolute bottom-6 right-6 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border-2 border-orange-400"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <div className="text-xs text-muted-foreground">Speed</div>
                          <div className="text-lg font-bold text-orange-600">
                            {currentSpeed.toFixed(2)} m/s
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Energy Bars */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">Potential Energy</span>
                          <span className="font-bold text-blue-600">{currentPotentialEnergy.toFixed(1)} J</span>
                        </div>
                        <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                            animate={{ width: `${(currentPotentialEnergy / potentialEnergy) * 100}%` }}
                            transition={{ duration: 0.1 }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">Kinetic Energy</span>
                          <span className="font-bold text-red-600">{currentKineticEnergy.toFixed(1)} J</span>
                        </div>
                        <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-red-400 to-red-600"
                            animate={{ width: `${(currentKineticEnergy / potentialEnergy) * 100}%` }}
                            transition={{ duration: 0.1 }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">Total Energy</span>
                          <span className="font-bold text-purple-600">
                            {(currentPotentialEnergy + currentKineticEnergy).toFixed(1)} J
                          </span>
                        </div>
                        <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full w-full bg-gradient-to-r from-purple-400 to-purple-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Measurements Table */}
                {measurements.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Recorded Measurements:</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="border p-2 text-sm">Height (m)</th>
                            <th className="border p-2 text-sm">Initial PE (J)</th>
                            <th className="border p-2 text-sm">Final Speed (m/s)</th>
                            <th className="border p-2 text-sm">Final KE (J)</th>
                            <th className="border p-2 text-sm">Time (s)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {measurements.map((m, idx) => (
                            <motion.tr
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <td className="border p-2 text-center">{m.height.toFixed(1)}</td>
                              <td className="border p-2 text-center">{m.potentialEnergy.toFixed(1)}</td>
                              <td className="border p-2 text-center">{m.speed.toFixed(2)}</td>
                              <td className="border p-2 text-center">{m.kineticEnergy.toFixed(1)}</td>
                              <td className="border p-2 text-center">{m.time.toFixed(2)}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {measurements.length >= 3 && (
                  <Button
                    onClick={() => {
                      setStep('results');
                      setTeacherMessage("Fantastic work! You've collected excellent data. Now let's analyze the results. Look at the graph - do you see the relationship between height and final speed? This proves the Law of Conservation of Energy!");
                    }}
                    size="lg"
                    className="w-full"
                  >
                    Analyze Results
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
                    <Sparkles className="w-7 h-7 text-purple-500" />
                    Energy Conservation Analysis
                  </h3>
                </div>

                {/* Data Visualization Graph */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                  <h4 className="text-lg font-semibold mb-4 text-center">Height vs Final Speed</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={measurements}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="height" 
                        label={{ value: 'Height (m)', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        label={{ value: 'Final Speed (m/s)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number, name: string) => {
                          if (name === 'speed') return [value.toFixed(2) + ' m/s', 'Final Speed'];
                          if (name === 'potentialEnergy') return [value.toFixed(1) + ' J', 'Initial PE'];
                          if (name === 'kineticEnergy') return [value.toFixed(1) + ' J', 'Final KE'];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="speed" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        name="Final Speed (m/s)"
                        dot={{ fill: '#ef4444', r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="potentialEnergy" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Initial PE (J)"
                        dot={{ fill: '#3b82f6', r: 4 }}
                        strokeDasharray="5 5"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="kineticEnergy" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        name="Final KE (J)"
                        dot={{ fill: '#8b5cf6', r: 4 }}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-center text-muted-foreground mt-4">
                    📈 Notice: As height increases, final speed increases (following v = √(2gh)). 
                    PE and KE values are equal at the bottom, proving energy conservation!
                  </p>
                </div>

                <div className="prose dark:prose-invert max-w-none space-y-6">
                  <div className="bg-purple-50 dark:bg-purple-950 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
                      ⚡ Key Observations:
                    </h4>
                    <div className="space-y-3 text-purple-800 dark:text-purple-200">
                      <p>
                        <strong>Energy Transformation:</strong> As the object descends, potential energy 
                        continuously converts to kinetic energy. The blue PE bar decreases while the red 
                        KE bar increases by the same amount.
                      </p>
                      <p>
                        <strong>Conservation Law:</strong> The total energy (PE + KE) remains constant 
                        throughout the motion. No energy is created or destroyed - it only changes form.
                      </p>
                      <p>
                        <strong>Speed Relationship:</strong> Final speed depends on height: v = √(2gh). 
                        Doubling the height doesn't double the speed - it increases it by √2 (about 1.41×).
                      </p>
                      <p>
                        <strong>Mass Independence:</strong> While mass affects the energy amounts (in Joules), 
                        it doesn't affect the final speed. A 1 kg and 5 kg object dropped from the same 
                        height hit the ground at the same speed!
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                      📊 Mathematical Relationships:
                    </h4>
                    <div className="space-y-3 text-blue-800 dark:text-blue-200">
                      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded">
                        <strong>At the top (maximum height):</strong><br />
                        PE = mgh (maximum)<br />
                        KE = 0 (not moving yet)<br />
                        Total Energy = mgh
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded">
                        <strong>At the bottom (ground level):</strong><br />
                        PE = 0 (no height)<br />
                        KE = ½mv² (maximum)<br />
                        Total Energy = ½mv²
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded">
                        <strong>Conservation equation:</strong><br />
                        mgh = ½mv²<br />
                        Solving for v: v = √(2gh)<br />
                        Notice: mass cancels out!
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                      🌍 Real-World Applications:
                    </h4>
                    <ul className="space-y-2 text-green-800 dark:text-green-200">
                      <li>
                        <strong>Roller Coasters:</strong> Engineers use energy conservation to design thrilling 
                        rides. The initial lift gives PE, which converts to KE on drops and back to PE on climbs.
                      </li>
                      <li>
                        <strong>Hydroelectric Dams:</strong> Water stored high up has enormous PE. As it falls 
                        through turbines, that energy converts to mechanical energy and then electricity.
                      </li>
                      <li>
                        <strong>Regenerative Braking:</strong> Electric vehicles convert KE back into electrical 
                        energy when braking, storing it in the battery for later use.
                      </li>
                      <li>
                        <strong>Sports:</strong> Pole vaulters convert their running KE into PE as they rise, 
                        allowing them to clear incredible heights.
                      </li>
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setStep('quiz');
                    setTeacherMessage("Time to test your understanding! Answer these questions based on what you observed in the experiment. Think about how PE and KE transformed. Good luck!");
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
                    Answer these questions about work and energy
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
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950'
                                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
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
                    className="text-center space-y-4"
                  >
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg border-2">
                      <h3 className="text-2xl font-bold mb-2">
                        Your Score: {quizScore} / {quizQuestions.length}
                      </h3>
                      <p className="text-muted-foreground">
                        {quizScore === quizQuestions.length
                          ? '🎉 Perfect! You understand energy conservation!'
                          : quizScore >= quizQuestions.length / 2
                          ? '👍 Good job! Review the material to improve.'
                          : '📚 Keep learning! Review the concepts and try again.'}
                      </p>
                    </div>

                    <Button
                      onClick={handleComplete}
                      size="lg"
                      className="w-full"
                    >
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
                    You've completed the Work & Energy Lab
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-purple-600">
                  <Award className="w-8 h-8" />
                  <span>+100 XP</span>
                </div>

                <div className="prose dark:prose-invert max-w-none text-left bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3">What You Learned:</h4>
                  <ul className="space-y-2">
                    <li>✓ Energy cannot be created or destroyed, only transformed</li>
                    <li>✓ Potential energy (PE = mgh) is stored energy due to position</li>
                    <li>✓ Kinetic energy (KE = ½mv²) is energy of motion</li>
                    <li>✓ As objects fall, PE converts to KE while total energy stays constant</li>
                    <li>✓ Final speed depends on height: v = √(2gh)</li>
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
