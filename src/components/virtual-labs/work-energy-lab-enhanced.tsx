'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Award, Trophy, Sparkles, ArrowDown, BarChart3, CheckCircle, XCircle, Move, Scale, Ruler, GripVertical, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { LabSupplies, SupplyItem } from './LabSupplies';
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

  // Supplies tracking
  const [collectedSupplies, setCollectedSupplies] = React.useState<string[]>([]);
  
  const labSupplies: SupplyItem[] = [
    { id: 'ramp', name: 'Inclined Ramp', emoji: '📐', description: 'Ramp for the object to slide down' },
    { id: 'masses', name: 'Masses', emoji: '⚖️', description: 'Objects of different masses (1-5 kg)' },
    { id: 'ruler', name: 'Ruler', emoji: '📏', description: 'Measure height accurately' },
    { id: 'stopwatch', name: 'Stopwatch', emoji: '⏱️', description: 'Measure time of descent' },
  ];

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
    setTeacherMessage("Great! Let's gather our supplies. Click on each item to collect them for your experiment!");
    setStep('collect-supplies');
  };

  const handleTeacherComplete = () => {
    // Direct state updates - no pending transitions
  };

  const handleCollectSupply = (itemId: string) => {
    if (!collectedSupplies.includes(itemId)) {
      setCollectedSupplies(prev => {
        const newCollected = [...prev, itemId];
        if (newCollected.length === 1) {
          setTeacherMessage("Perfect! Now click on the MASSES - we'll use different masses to see if mass affects the final speed!");
        } else if (newCollected.length === 2) {
          setTeacherMessage("Excellent! Now click on the RULER - we need to measure the height accurately!");
        } else if (newCollected.length === 3) {
          setTeacherMessage("Great! Finally, click on the STOPWATCH - we'll measure the time it takes for the object to reach the bottom!");
        } else if (newCollected.length === 4) {
          setTeacherMessage("Perfect! All supplies collected! Now let's set up our experiment. Click 'Continue to Setup' to begin!");
        }
        return newCollected;
      });
      toast({ title: `✅ ${labSupplies.find(s => s.id === itemId)?.name} Collected` });
    }
  };

  const handleAllSuppliesCollected = () => {
    setTeacherMessage("Perfect! All supplies collected! Now let's set up our experiment. Click 'Continue to Setup' to begin!");
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
      setTeacherMessage(
        "Perfect score! 🏆 You've mastered the Law of Conservation of Energy - one of the most fundamental laws in all of physics! " +
        "Here's the profound truth you now understand: Energy cannot be created or destroyed, only transformed from one form to another. " +
        "In your experiment: Potential Energy (PE = mgh) at the top converted to Kinetic Energy (KE = ½mv²) at the bottom. " +
        "Total energy remained constant: PEinitial = KEfinal (ignoring friction). The beautiful formula v = √(2gh) emerges from this! " +
        "Notice something amazing: MASS DOESN'T AFFECT FINAL SPEED! A 1kg object and 10kg object reach the same speed from the same height. " +
        "Why? Because PE depends on mass (mgh) AND KE depends on mass (½mv²) - the mass cancels out mathematically! " +
        "Real-world applications everywhere: Roller coasters convert PE to KE for thrilling rides. Hydroelectric dams use falling water's " +
        "PE to spin turbines (KE) generating electricity. Pendulums swing by trading PE and KE back and forth. Even springs store elastic PE! " +
        "This law, established by Émilie du Châtelet and James Joule, governs everything from atomic reactions to the entire universe. " +
        "You're thinking like Einstein now! Phenomenal work!"
      );
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else if (score >= quizQuestions.length / 2) {
      setTeacherMessage(
        `Good effort! You got ${score} out of ${quizQuestions.length} correct. Let me clarify the core concepts: Conservation of Energy means the TOTAL energy stays constant - it just changes forms. In your experiment: At the TOP of the ramp: Maximum PE (mgh), Zero KE (object at rest, v=0). SLIDING DOWN: PE decreases (height decreasing), KE increases (speed increasing). Energy is transforming! At the BOTTOM: Zero PE (height=0), Maximum KE (fastest speed). All PE became KE! The formulas: PE = mgh (mass × gravity × height), KE = ½mv² (half × mass × velocity squared). Setting them equal: mgh = ½mv², we can solve for v: v = √(2gh). Notice mass (m) cancels! That's why a bowling ball and marble reach the same speed - height determines speed, not mass! In real life, friction converts some energy to heat (that's why surfaces warm up), but the TOTAL energy including heat is still conserved. Review your data: higher starting height → higher PE → higher final KE → faster speed. The relationship is mathematical and precise. Keep studying - you're close to mastery!`
      );
    } else {
      setTeacherMessage(
        `You got ${score} out of ${quizQuestions.length}. Don't worry - energy concepts take time to grasp! Let's start simple: ENERGY is the ability to do work or cause change. It comes in many forms: kinetic (motion), potential (position), thermal (heat), chemical (food, batteries), electrical, nuclear, etc. Two key types in this lab: POTENTIAL ENERGY (PE): Stored energy due to POSITION/HEIGHT. Formula: PE = mgh (mass × 9.81 × height in meters). Higher up = more PE. A book on a high shelf has more PE than on the floor. KINETIC ENERGY (KE): Energy of MOTION. Formula: KE = ½mv² (half × mass × velocity squared). Faster moving = more KE. A speeding car has more KE than a parked one. THE LAW: Energy cannot vanish or appear from nothing - it TRANSFORMS. Your experiment: Object starts HIGH (lots of PE, no KE) → slides down → ends LOW (no PE, lots of KE). The PE didn't disappear - it BECAME KE! That's why the object speeds up as it descends. Think of it like money: you can exchange dollars for euros, but the total value stays the same. Energy exchanges forms but the total amount is conserved. Watch the experiment again: as height (PE) decreases, speed (KE) increases proportionally. The energy is transforming before your eyes! This principle applies to EVERYTHING in the universe. Keep practicing - you're learning the most important law in physics!`
      );
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
    setCollectedSupplies([]);
    setTeacherMessage("Ready to explore Work & Energy again!");
  };

  const currentKineticEnergy = 0.5 * mass * currentSpeed * currentSpeed;
  const currentPotentialEnergy = mass * GRAVITY * height * (currentPosition / 100);

  return (
    <div className="relative min-h-screen pb-20">
      {/* Premium Animated Background - Purple/Blue Physics Theme */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30" />
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-purple-200/40 to-blue-300/40 dark:from-purple-800/20 dark:to-blue-900/20 blur-3xl"
            style={{
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              left: `${(i * 12.5) % 100}%`,
              top: `${(i * 15) % 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto p-4 space-y-6">
      <TeacherVoice 
        message={teacherMessage}
        onComplete={handleTeacherComplete}
        emotion={step === 'complete' ? 'celebrating' : measurements.length >= 3 ? 'happy' : 'explaining'}
        context={{ attempts: measurements.length, correctStreak: measurements.length }}
        quickActions={[
          {
            label: 'Reset Lab',
            onClick: () => {
              setStep('intro');
              setHeight(5);
              setMass(2);
              setMeasurements([]);
              setIsRunning(false);
              setCurrentPosition(100);
              setCollectedSupplies([]);
            },
            icon: 'refresh'
          },
          {
            label: 'View Theory',
            onClick: () => {
              const accordion = document.querySelector('[data-state="closed"]') as HTMLElement;
              accordion?.click();
            },
            icon: 'book'
          },
          {
            label: 'Safety Tips',
            onClick: () => {
              const safetyAccordion = document.querySelectorAll('[data-state="closed"]')[1] as HTMLElement;
              safetyAccordion?.click();
            },
            icon: 'shield'
          }
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl">
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
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
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
                <LabSupplies
                  supplies={labSupplies}
                  collectedItems={collectedSupplies}
                  onCollect={handleCollectSupply}
                  onAllCollected={handleAllSuppliesCollected}
                  requiredCount={4}
                />
                {collectedSupplies.length === 4 && (
                  <CardFooter className="mt-4">
                    <Button 
                      onClick={handleContinueToSetup} 
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg" 
                      size="lg"
                    >
                      Continue to Setup
                    </Button>
                  </CardFooter>
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
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
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
                        className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg disabled:opacity-50"
                      >
                        <ArrowDown className="w-4 h-4 mr-2" />
                        Release
                      </Button>
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        disabled={isRunning}
                        className="flex-1 border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>

                  {/* Enhanced Realistic Visualization */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-b from-sky-200 via-blue-100 to-green-100 dark:from-sky-900 dark:via-blue-900 dark:to-green-900 rounded-lg p-6 h-80 relative overflow-hidden border-2 border-purple-200/50 dark:border-purple-800/50 shadow-inner">
                      {/* Enhanced 3D Ramp */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                        <defs>
                          <linearGradient id="rampGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.9" />
                            <stop offset="50%" stopColor="#6b7280" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#4b5563" stopOpacity="0.9" />
                          </linearGradient>
                          <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#86efac" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#4ade80" stopOpacity="0.8" />
                          </linearGradient>
                          <filter id="shadow">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                            <feOffset dx="2" dy="2" result="offsetblur" />
                            <feComponentTransfer>
                              <feFuncA type="linear" slope="0.3" />
                            </feComponentTransfer>
                            <feMerge>
                              <feMergeNode />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        
                        {/* Ground */}
                        <rect x="0" y="180" width="200" height="20" fill="url(#groundGradient)" />
                        <rect x="0" y="180" width="200" height="2" fill="#22c55e" opacity="0.5" />
                        
                        {/* 3D Ramp surface */}
                        <path
                          d={`M 20 ${200 - 20 - (height * 10)} L 180 180 L 180 190 L 20 ${200 - 10 - (height * 10)} Z`}
                          fill="url(#rampGradient)"
                          stroke="#374151"
                          strokeWidth="1"
                        />
                        {/* Ramp top edge highlight */}
                        <line
                          x1="20"
                          y1={200 - 20 - (height * 10)}
                          x2="180"
                          y2="180"
                          stroke="#d1d5db"
                          strokeWidth="2"
                        />
                        {/* Ramp side shadow */}
                        <path
                          d={`M 180 180 L 180 190 L 20 ${200 - 10 - (height * 10)} L 20 ${200 - 20 - (height * 10)} Z`}
                          fill="#1f2937"
                          opacity="0.3"
                        />
                        
                        {/* Height marker with ruler */}
                        <line
                          x1="15"
                          y1={200 - 20 - (height * 10)}
                          x2="15"
                          y2="180"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          strokeDasharray="3,3"
                        />
                        <rect x="10" y={200 - 20 - (height * 10)} width="10" height="2" fill="#3b82f6" />
                        <rect x="10" y="178" width="10" height="2" fill="#3b82f6" />
                        <text
                          x="8"
                          y={200 - 20 - (height * 5)}
                          className="text-xs fill-blue-600 dark:fill-blue-400 font-bold"
                          fontSize="11"
                        >
                          {height}m
                        </text>
                      </svg>

                      {/* Enhanced 3D Object with shadow */}
                      <motion.div
                        className="absolute"
                        style={{
                          left: `${20 + (180 - 20) * (1 - currentPosition / 100)}%`,
                          top: `${20 + (height * 10) * (currentPosition / 100)}%`,
                        }}
                        animate={isRunning ? {
                          rotate: [0, 360],
                        } : {}}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      >
                        {/* Shadow */}
                        <motion.div
                          className="absolute w-10 h-4 bg-black rounded-full opacity-30 blur-sm"
                          style={{
                            left: '50%',
                            top: '100%',
                            transform: 'translateX(-50%)',
                            scale: 1 + (currentPosition / 100) * 0.3,
                          }}
                        />
                        {/* 3D Object */}
                        <div className="relative w-14 h-14 rounded-lg bg-gradient-to-br from-red-500 via-red-600 to-orange-600 shadow-xl flex items-center justify-center text-white font-bold border-2 border-red-700">
                          {/* Shine effect */}
                          <div className="absolute top-1 left-1 w-4 h-4 bg-white/30 rounded-full blur-sm" />
                          <div className="relative z-10 text-xs">{mass}kg</div>
                        </div>
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
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
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
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
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
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg disabled:opacity-50"
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
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg border-2 border-purple-200/50 dark:border-purple-800/50">
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
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
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

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-purple-400 to-blue-400 dark:from-purple-600 dark:to-blue-600 p-6 rounded-lg text-center"
                >
                  <div className="flex items-center justify-center gap-3 text-3xl font-bold text-white">
                    <Award className="h-8 w-8" />
                    +100 XP Earned!
                  </div>
                </motion.div>

                <div className="prose dark:prose-invert max-w-none text-left bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 p-6 rounded-lg border-2 border-purple-200/50 dark:border-purple-800/50">
                  <h4 className="text-lg font-semibold mb-3">What You Learned:</h4>
                  <ul className="space-y-2">
                    <li>✓ Energy cannot be created or destroyed, only transformed</li>
                    <li>✓ Potential energy (PE = mgh) is stored energy due to position</li>
                    <li>✓ Kinetic energy (KE = ½mv²) is energy of motion</li>
                    <li>✓ As objects fall, PE converts to KE while total energy stays constant</li>
                    <li>✓ Final speed depends on height: v = √(2gh)</li>
                  </ul>
                </div>

                <Button 
                  onClick={resetLab} 
                  size="lg" 
                  variant="outline"
                  className="border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Restart Lab
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      </motion.div>
      </div>
    </div>
  );
}
