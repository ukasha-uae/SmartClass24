'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Cloud, CloudRain, Droplets, Waves, Wind, Award, Trophy, Sparkles, Mountain, Trees, CheckCircle, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';

type CycleStage = 'none' | 'evaporation' | 'condensation' | 'precipitation' | 'collection';

interface StageObservation {
  stage: CycleStage;
  description: string;
  timestamp: number;
}

export function WaterCycleLabEnhanced() {
  const [step, setStep] = React.useState<'intro' | 'setup' | 'experiment' | 'results' | 'quiz' | 'complete'>('intro');
  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\'s explore together.');
  const [currentStage, setCurrentStage] = React.useState<CycleStage>('none');
  const [observations, setObservations] = React.useState<StageObservation[]>([]);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [cycleCount, setCycleCount] = React.useState(0);
  const [quizAnswers, setQuizAnswers] = React.useState<Record<number, number>>({});
  const [showQuizFeedback, setShowQuizFeedback] = React.useState(false);
  const [quizScore, setQuizScore] = React.useState(0);

  const { markLabComplete, isLabCompleted } = useLabProgress();
  const labId = 'water-cycle';
  const isComplete = isLabCompleted(labId);

  const stages: Array<{ stage: CycleStage; name: string; description: string; icon: any }> = [
    {
      stage: 'evaporation',
      name: 'Evaporation',
      description: 'The sun heats water in oceans, lakes, and rivers. The water turns into water vapor (gas) and rises into the atmosphere.',
      icon: Sun,
    },
    {
      stage: 'condensation',
      name: 'Condensation',
      description: 'Water vapor rises and cools in the atmosphere. It condenses into tiny water droplets, forming clouds.',
      icon: Cloud,
    },
    {
      stage: 'precipitation',
      name: 'Precipitation',
      description: 'When clouds become heavy with water droplets, they release water as rain, snow, sleet, or hail.',
      icon: CloudRain,
    },
    {
      stage: 'collection',
      name: 'Collection',
      description: 'Precipitation falls to Earth and collects in oceans, rivers, lakes, and underground. The cycle begins again.',
      icon: Droplets,
    },
  ];

  const quizQuestions = [
    {
      question: "What is the first stage of the water cycle?",
      options: ["Condensation", "Evaporation", "Precipitation", "Collection"],
      correct: 1,
    },
    {
      question: "What provides the energy that drives the water cycle?",
      options: ["Wind", "The Sun", "Clouds", "Oceans"],
      correct: 1,
    },
    {
      question: "What process forms clouds?",
      options: ["Evaporation", "Precipitation", "Condensation", "Collection"],
      correct: 2,
    },
  ];

  const handleStageClick = (stage: CycleStage) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentStage(stage);

    const observation: StageObservation = {
      stage,
      description: stages.find(s => s.stage === stage)?.description || '',
      timestamp: Date.now(),
    };

    setObservations(prev => [...prev, observation]);

    setTimeout(() => {
      setIsAnimating(false);
      
      // Check if full cycle is complete
      if (stage === 'collection' && observations.length >= 3) {
        setCycleCount(prev => prev + 1);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    }, 3000);
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
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleComplete = () => {
    markLabComplete(labId, 100, 0);
    setStep('complete');
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
    });
  };

  const resetLab = () => {
    setStep('intro');
    setCurrentStage('none');
    setObservations([]);
    setIsAnimating(false);
    setCycleCount(0);
    setQuizAnswers({});
    setShowQuizFeedback(false);
    setQuizScore(0);
  };

  const resetCycle = () => {
    setCurrentStage('none');
    setObservations([]);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Droplets className="w-8 h-8 text-blue-600" />
            The Water Cycle - Hydrologic Cycle
          </CardTitle>
          <CardDescription className="text-base">
            Explore how water continuously moves through Earth's systems
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
                    <Sparkles className="w-6 h-6 text-blue-500" />
                    Understanding Earth's Water Cycle
                  </h3>
                  <p>
                    The water cycle, also called the <strong>hydrologic cycle</strong>, describes the continuous 
                    movement of water on, above, and below the surface of Earth. This global cycle is powered by 
                    the sun and is essential for all life on our planet.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 not-prose mt-6">
                    {stages.map(({ stage, name, description, icon: Icon }) => (
                      <div key={stage} className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-4 rounded-lg border">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                            {name}
                          </h4>
                        </div>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          {description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-lg font-semibold mt-6">Why Is the Water Cycle Important?</h4>
                  <ul className="space-y-2">
                    <li>🌍 <strong>Distributes Water:</strong> Moves water from oceans to land, providing fresh water for drinking, agriculture, and ecosystems</li>
                    <li>🌡️ <strong>Regulates Climate:</strong> Transports heat energy around the globe, affecting weather patterns and temperatures</li>
                    <li>🌱 <strong>Supports Life:</strong> All living organisms depend on water, and the cycle ensures water is available everywhere</li>
                    <li>🔄 <strong>Renewable Resource:</strong> The same water has been recycling for billions of years - we drink the same water as dinosaurs!</li>
                  </ul>

                  <div className="bg-cyan-50 dark:bg-cyan-950 p-4 rounded-lg border-l-4 border-cyan-500 mt-6">
                    <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">
                      💧 Fascinating Facts:
                    </h4>
                    <ul className="text-sm text-cyan-800 dark:text-cyan-200 space-y-1">
                      <li>• About 71% of Earth's surface is covered by water</li>
                      <li>• 97% of Earth's water is in oceans (salt water)</li>
                      <li>• Only 3% is fresh water, and most of that is frozen in ice caps</li>
                      <li>• Water spends an average of 9 days in the atmosphere</li>
                      <li>• A single drop can take 3,000 years to complete the full cycle</li>
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={() => setStep('setup')}
                  size="lg"
                  className="w-full"
                >
                  Begin Simulation
                </Button>
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
                    <Cloud className="w-6 h-6 text-blue-500" />
                    How to Use the Simulation
                  </h3>

                  <div className="bg-blue-50 dark:bg-blue-950 p-5 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                      Interactive Controls:
                    </h4>
                    <ol className="space-y-3 text-blue-800 dark:text-blue-200">
                      <li>
                        <strong>1. Click on Stage Buttons:</strong> Click each button in order to observe 
                        different stages of the water cycle
                      </li>
                      <li>
                        <strong>2. Watch Animations:</strong> Each stage shows animated water movement - 
                        evaporating water, forming clouds, falling rain, and collecting water
                      </li>
                      <li>
                        <strong>3. Complete the Cycle:</strong> Go through all four stages to see one complete 
                        water cycle
                      </li>
                      <li>
                        <strong>4. Observe Details:</strong> Notice how water changes form (liquid → gas → liquid) 
                        and moves between Earth's systems
                      </li>
                    </ol>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border-l-4 border-amber-500 mt-6">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                      🔑 Key Concepts to Observe:
                    </h4>
                    <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                      <li>• Energy from the sun drives evaporation</li>
                      <li>• Cooling causes condensation (gas → liquid)</li>
                      <li>• Gravity pulls precipitation downward</li>
                      <li>• Water collects and the cycle repeats endlessly</li>
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={() => setStep('experiment')}
                  size="lg"
                  className="w-full"
                >
                  Start Water Cycle
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
                  <h3 className="text-xl font-semibold">Interactive Water Cycle</h3>
                  <p className="text-muted-foreground">
                    Click the stage buttons to see each part of the cycle
                  </p>
                  {cycleCount > 0 && (
                    <div className="text-sm font-medium text-blue-600">
                      🔄 Complete Cycles: {cycleCount}
                    </div>
                  )}
                </div>

                {/* Animated Landscape */}
                <div className="relative w-full h-96 bg-gradient-to-b from-sky-300 to-sky-100 dark:from-sky-900 dark:to-sky-800 rounded-xl overflow-hidden border-4 border-blue-200 dark:border-blue-800 shadow-xl">
                  
                  {/* Sun */}
                  <motion.div
                    className="absolute top-6 right-8"
                    animate={currentStage === 'evaporation' ? {
                      scale: [1, 1.15, 1],
                      rotate: [0, 360],
                    } : {}}
                    transition={{ duration: 2, repeat: currentStage === 'evaporation' ? Infinity : 0 }}
                  >
                    <Sun className={`w-16 h-16 ${
                      currentStage === 'evaporation' 
                        ? 'text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,1)]' 
                        : 'text-yellow-300'
                    }`} />
                    {currentStage === 'evaporation' && (
                      <>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute top-1/2 left-1/2 w-1 h-8 bg-yellow-300"
                            style={{
                              transformOrigin: '0 0',
                              rotate: `${i * 30}deg`,
                            }}
                            animate={{
                              opacity: [0.3, 0.8, 0.3],
                              scaleY: [0.8, 1.2, 0.8],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </>
                    )}
                  </motion.div>

                  {/* Mountains and Trees */}
                  <div className="absolute bottom-24 right-8">
                    <Mountain className="w-32 h-32 text-green-700 dark:text-green-800 opacity-80" />
                  </div>
                  <div className="absolute bottom-24 right-32">
                    <Trees className="w-16 h-16 text-green-600 dark:text-green-700" />
                  </div>
                  <div className="absolute bottom-24 right-48">
                    <Trees className="w-12 h-12 text-green-600 dark:text-green-700" />
                  </div>

                  {/* Ocean/Lake */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800">
                    <Waves className="absolute bottom-2 left-4 w-20 h-8 text-blue-300 dark:text-blue-500 opacity-60" />
                    <Waves className="absolute bottom-2 right-16 w-24 h-8 text-blue-300 dark:text-blue-500 opacity-60" />
                  </div>

                  {/* Evaporation Animation */}
                  {currentStage === 'evaporation' && (
                    <>
                      {Array.from({ length: 15 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute"
                          initial={{
                            x: 50 + i * 30,
                            y: 340,
                            opacity: 0,
                          }}
                          animate={{
                            y: [340, 180, 120],
                            x: [50 + i * 30, 70 + i * 30, 90 + i * 30],
                            opacity: [0, 0.8, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        >
                          <Droplets className="w-4 h-4 text-blue-300" />
                        </motion.div>
                      ))}
                    </>
                  )}

                  {/* Clouds and Condensation */}
                  {(currentStage === 'condensation' || currentStage === 'precipitation' || currentStage === 'collection') && (
                    <>
                      <motion.div
                        className="absolute top-20 left-20"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1 }}
                      >
                        <Cloud className="w-24 h-24 text-gray-300 dark:text-gray-600 drop-shadow-lg" />
                        {currentStage === 'condensation' && (
                          <>
                            {Array.from({ length: 20 }).map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full"
                                style={{
                                  left: `${20 + Math.random() * 60}%`,
                                  top: `${30 + Math.random() * 40}%`,
                                }}
                                animate={{
                                  scale: [0, 1, 1],
                                  opacity: [0, 1, 0.6],
                                }}
                                transition={{
                                  duration: 1.5,
                                  delay: i * 0.1,
                                  repeat: Infinity,
                                }}
                              />
                            ))}
                          </>
                        )}
                      </motion.div>

                      <motion.div
                        className="absolute top-16 left-40"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                      >
                        <Cloud className="w-32 h-32 text-white dark:text-gray-500 drop-shadow-xl" />
                      </motion.div>

                      <motion.div
                        className="absolute top-28 left-64"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                      >
                        <Cloud className="w-20 h-20 text-gray-200 dark:text-gray-600 drop-shadow-lg" />
                      </motion.div>
                    </>
                  )}

                  {/* Precipitation Animation */}
                  {currentStage === 'precipitation' && (
                    <>
                      {Array.from({ length: 40 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-0.5 h-4 bg-blue-400 rounded-full"
                          style={{
                            left: `${15 + (i % 10) * 8}%`,
                            top: '30%',
                          }}
                          animate={{
                            y: [0, 280],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: (i % 10) * 0.1,
                          }}
                        />
                      ))}
                      <Wind className="absolute top-32 left-12 w-16 h-16 text-blue-200 opacity-40" />
                    </>
                  )}

                  {/* Collection Animation */}
                  {currentStage === 'collection' && (
                    <>
                      {/* River flow */}
                      <motion.div
                        className="absolute bottom-24 left-32 w-64 h-2"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 0.8 }}
                        transition={{ duration: 2 }}
                        style={{
                          background: 'linear-gradient(90deg, transparent, #60A5FA, #3B82F6)',
                          transformOrigin: 'left',
                        }}
                      />
                      
                      {/* Puddles forming */}
                      {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute bottom-28 rounded-full bg-blue-400/40"
                          style={{
                            left: `${40 + i * 12}%`,
                            width: `${20 + i * 5}px`,
                            height: `${8 + i * 2}px`,
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.2 }}
                        />
                      ))}
                    </>
                  )}

                  {/* Current Stage Label */}
                  {currentStage !== 'none' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-4 left-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg border-2 border-blue-400"
                    >
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {stages.find(s => s.stage === currentStage)?.name}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Stage Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stages.map(({ stage, name, icon: Icon }) => {
                    const isCompleted = observations.some(o => o.stage === stage);
                    return (
                      <motion.button
                        key={stage}
                        onClick={() => handleStageClick(stage)}
                        disabled={isAnimating}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          currentStage === stage
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-lg'
                            : isCompleted
                            ? 'border-green-400 bg-green-50 dark:bg-green-950'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }`}
                        whileHover={{ scale: isAnimating ? 1 : 1.05 }}
                        whileTap={{ scale: isAnimating ? 1 : 0.95 }}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${
                          isCompleted ? 'text-green-600' : 'text-blue-600'
                        }`} />
                        <p className="font-semibold text-sm">{name}</p>
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 mx-auto mt-2 text-green-600" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Observations */}
                {observations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Observations:</h4>
                    {observations.map((obs, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold capitalize text-blue-900 dark:text-blue-100">
                              {stages.find(s => s.stage === obs.stage)?.name}
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                              {obs.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {observations.length >= 4 && (
                    <Button
                      onClick={() => setStep('results')}
                      size="lg"
                      className="flex-1"
                    >
                      View Analysis
                    </Button>
                  )}
                  <Button
                    onClick={resetCycle}
                    size="lg"
                    variant="outline"
                    className="flex-1"
                  >
                    Reset Cycle
                  </Button>
                </div>
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
                    <Sparkles className="w-7 h-7 text-blue-500" />
                    Water Cycle Analysis
                  </h3>
                </div>

                <div className="prose dark:prose-invert max-w-none space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-950 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                      🌊 The Continuous Cycle:
                    </h4>
                    <div className="space-y-3 text-blue-800 dark:text-blue-200">
                      <p>
                        The water cycle has no beginning or end - it's a continuous process that has been 
                        operating for billions of years. Water constantly changes state and location, but 
                        the total amount of water on Earth remains nearly constant.
                      </p>
                      <p>
                        <strong>Energy Source:</strong> The sun provides the energy that drives evaporation, 
                        lifting water from Earth's surface into the atmosphere. Without solar energy, the 
                        water cycle would stop.
                      </p>
                      <p>
                        <strong>Gravity's Role:</strong> While the sun lifts water up through evaporation, 
                        gravity pulls it back down through precipitation. These opposing forces keep the 
                        cycle in motion.
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                      🌍 Global Impact:
                    </h4>
                    <ul className="space-y-2 text-green-800 dark:text-green-200">
                      <li>
                        <strong>Water Distribution:</strong> The cycle transports about 505,000 cubic 
                        kilometers of water annually. Oceans lose more water through evaporation than they 
                        gain from precipitation, while land receives more precipitation than it loses.
                      </li>
                      <li>
                        <strong>Climate Regulation:</strong> Water vapor is a greenhouse gas that helps 
                        regulate Earth's temperature. Evaporation cools surfaces, while condensation 
                        releases heat into the atmosphere.
                      </li>
                      <li>
                        <strong>Ecosystem Support:</strong> The cycle distributes nutrients, shapes landscapes 
                        through erosion, and provides the fresh water that all terrestrial life depends on.
                      </li>
                      <li>
                        <strong>Human Impact:</strong> Human activities affect the water cycle through 
                        deforestation (reduces transpiration), urbanization (increases runoff), and climate 
                        change (alters precipitation patterns).
                      </li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
                      💡 Additional Processes:
                    </h4>
                    <div className="space-y-3 text-purple-800 dark:text-purple-200">
                      <p>
                        The basic four-stage cycle includes additional processes:
                      </p>
                      <ul className="space-y-2">
                        <li>
                          <strong>Transpiration:</strong> Plants release water vapor through their leaves. 
                          Together with evaporation, this is called <em>evapotranspiration</em>.
                        </li>
                        <li>
                          <strong>Sublimation:</strong> Ice and snow can turn directly into water vapor 
                          without melting first, especially in cold, dry climates.
                        </li>
                        <li>
                          <strong>Infiltration:</strong> Water soaking into soil and rock, recharging 
                          underground aquifers that store vast amounts of fresh water.
                        </li>
                        <li>
                          <strong>Runoff:</strong> Water flowing over land surfaces into streams, rivers, 
                          and eventually back to oceans.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setStep('quiz')}
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
                    Answer these questions about the water cycle
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
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
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
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg border-2">
                      <h3 className="text-2xl font-bold mb-2">
                        Your Score: {quizScore} / {quizQuestions.length}
                      </h3>
                      <p className="text-muted-foreground">
                        {quizScore === quizQuestions.length
                          ? '🎉 Perfect! You understand the water cycle!'
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
                    You've completed the Water Cycle Lab
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-blue-600">
                  <Award className="w-8 h-8" />
                  <span>+100 XP</span>
                </div>

                <div className="prose dark:prose-invert max-w-none text-left bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3">What You Learned:</h4>
                  <ul className="space-y-2">
                    <li>✓ How evaporation moves water from Earth's surface into the atmosphere</li>
                    <li>✓ The process of condensation forming clouds from water vapor</li>
                    <li>✓ How precipitation returns water to Earth's surface</li>
                    <li>✓ The collection stage where water gathers in oceans, rivers, and lakes</li>
                    <li>✓ The water cycle is continuous and essential for all life on Earth</li>
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
