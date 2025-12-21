'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Flame, Droplets, Beaker, CheckCircle, XCircle, Award, Trophy, FlaskConical, TestTube, Wind, Sparkles, AlertTriangle, GripVertical } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLabProgress } from '@/stores/lab-progress-store';
import { TeacherVoice } from './TeacherVoice';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Technique = 'filtration' | 'evaporation' | 'decantation' | 'none';
type MixtureType = 'muddy-water' | 'salt-water' | 'oil-water' | 'none';

interface ExperimentResult {
  technique: Technique;
  mixture: MixtureType;
  observation: string;
  separated: string[];
}

export function SeparationTechniquesLabEnhanced() {
  const { toast } = useToast();
  // Enhanced with teacher voice and supply collection - Dec 21, 2025
  const [step, setStep] = React.useState<'intro' | 'collect-supplies' | 'setup' | 'experiment' | 'results' | 'quiz' | 'complete'>('intro');
  const [selectedTechnique, setSelectedTechnique] = React.useState<Technique>('none');
  const [selectedMixture, setSelectedMixture] = React.useState<MixtureType>('none');
  const [isSeparating, setIsSeparating] = React.useState(false);
  const [separationProgress, setSeparationProgress] = React.useState(0);
  const [experimentResults, setExperimentResults] = React.useState<ExperimentResult[]>([]);
  const [quizAnswers, setQuizAnswers] = React.useState<Record<number, number>>({});
  const [showQuizFeedback, setShowQuizFeedback] = React.useState(false);
  const [quizScore, setQuizScore] = React.useState(0);

  // Teacher voice
  const [teacherMessage, setTeacherMessage] = React.useState('');
  const [pendingTransition, setPendingTransition] = React.useState<(() => void) | null>(null);
  const [teacherPosition, setTeacherPosition] = React.useState({ x: 0, y: 0 });

  // Supplies tracking
  const [filterPaperCollected, setFilterPaperCollected] = React.useState(false);
  const [bunsenBurnerCollected, setBunsenBurnerCollected] = React.useState(false);
  const [beakersCollected, setBeakersCollected] = React.useState(false);
  const [funnelCollected, setFunnelCollected] = React.useState(false);

  const { markLabComplete, isLabCompleted } = useLabProgress();
  const labId = 'separation-techniques';
  const isComplete = isLabCompleted(labId);

  // Intro message
  React.useEffect(() => {
    if (step === 'intro') {
      setTeacherMessage("Welcome to the Separation Techniques Lab! In Ghana and around the world, we often need to separate mixtures into their pure components - from purifying water to extracting salt. You'll learn three key techniques: filtration, evaporation, and decantation. Let's gather our equipment!");
    }
  }, [step]);

  const handleStartExperiment = () => {
    setStep('collect-supplies');
    setTeacherMessage("Excellent! Let's collect our lab supplies. Start by clicking on the FILTER PAPER - we'll use this for filtration!");
  };

  const handleTeacherComplete = () => {
    if (pendingTransition) {
      pendingTransition();
      setPendingTransition(null);
    }
  };

  const handleCollectFilterPaper = () => {
    if (!filterPaperCollected) {
      setFilterPaperCollected(true);
      setTeacherMessage("Good! Now click on the BUNSEN BURNER - we need heat for evaporation!");
      toast({ title: '✅ Filter Paper Collected' });
    }
  };

  const handleCollectBunsenBurner = () => {
    if (filterPaperCollected && !bunsenBurnerCollected) {
      setBunsenBurnerCollected(true);
      setTeacherMessage("Perfect! Now click on the BEAKERS - we'll use these to hold our mixtures!");
      toast({ title: '✅ Bunsen Burner Collected' });
    }
  };

  const handleCollectBeakers = () => {
    if (bunsenBurnerCollected && !beakersCollected) {
      setBeakersCollected(true);
      setTeacherMessage("Excellent! Finally, click on the FUNNEL - this helps direct liquids during filtration and decantation!");
      toast({ title: '✅ Beakers Collected' });
    }
  };

  const handleCollectFunnel = () => {
    if (beakersCollected && !funnelCollected) {
      setFunnelCollected(true);
      setTeacherMessage("Wonderful! All equipment collected! Now you're ready to learn about the three separation techniques. Click 'Continue to Setup' to begin!");
      toast({ title: '✅ Funnel Collected' });
    }
  };

  const handleContinueToSetup = () => {
    setTeacherMessage("Now you'll learn about three separation techniques. Each technique works best for specific types of mixtures. Study them carefully, then we'll do experiments!");
    setStep('setup');
  };

  const techniques = {
    filtration: {
      name: 'Filtration',
      icon: Filter,
      color: 'from-blue-500 to-blue-600',
      description: 'Separates solid particles from liquid using filter paper',
      bestFor: 'Muddy water (insoluble solid + liquid)',
    },
    evaporation: {
      name: 'Evaporation',
      icon: Flame,
      color: 'from-orange-500 to-red-600',
      description: 'Heats liquid to vapor, leaving solid behind',
      bestFor: 'Salt water (soluble solid + liquid)',
    },
    decantation: {
      name: 'Decantation',
      icon: Beaker,
      color: 'from-purple-500 to-purple-600',
      description: 'Pours off liquid layer, leaving immiscible liquid behind',
      bestFor: 'Oil and water (immiscible liquids)',
    },
  };

  const mixtures = {
    'muddy-water': {
      name: 'Muddy Water',
      components: ['Water', 'Sand/Soil'],
      icon: '🪣',
      color: 'from-amber-700 to-amber-900',
      correctTechnique: 'filtration',
    },
    'salt-water': {
      name: 'Salt Water',
      components: ['Water', 'Salt'],
      icon: '🧂',
      color: 'from-blue-300 to-blue-400',
      correctTechnique: 'evaporation',
    },
    'oil-water': {
      name: 'Oil & Water',
      components: ['Water', 'Oil'],
      icon: '🛢️',
      color: 'from-yellow-400 to-yellow-600',
      correctTechnique: 'decantation',
    },
  };

  const quizQuestions = [
    {
      question: "Which separation technique is best for separating sand from water?",
      options: ["Evaporation", "Filtration", "Decantation", "Distillation"],
      correct: 1,
    },
    {
      question: "What happens to water during evaporation of salt water?",
      options: [
        "It remains in the dish",
        "It turns into vapor and escapes",
        "It mixes with salt",
        "It turns into ice"
      ],
      correct: 1,
    },
    {
      question: "Decantation works best for separating:",
      options: [
        "Salt from water",
        "Sand from water",
        "Oil from water",
        "Sugar from tea"
      ],
      correct: 2,
    },
  ];

  const handleSeparate = () => {
    if (selectedTechnique === 'none' || selectedMixture === 'none') return;

    const mixture = mixtures[selectedMixture];
    const isCorrect = mixture.correctTechnique === selectedTechnique;

    setIsSeparating(true);
    setSeparationProgress(0);

    // Animate progress
    const interval = setInterval(() => {
      setSeparationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    setTimeout(() => {
      let observation = '';
      let separated: string[] = [];

      if (selectedTechnique === 'filtration' && selectedMixture === 'muddy-water') {
        observation = 'The filter paper trapped the sand particles while clean water passed through. The filtrate (water) is now clear!';
        separated = ['Clean Water (filtrate)', 'Sand (residue on filter)'];
      } else if (selectedTechnique === 'evaporation' && selectedMixture === 'salt-water') {
        observation = 'The water heated up and turned into vapor, leaving white salt crystals in the dish. The water escaped as steam!';
        separated = ['Salt Crystals (solid)', 'Water Vapor (escaped)'];
      } else if (selectedTechnique === 'decantation' && selectedMixture === 'oil-water') {
        observation = 'Oil floated on top of water. We carefully poured off the top oil layer, leaving water at the bottom. The two liquids separated by density!';
        separated = ['Oil (top layer)', 'Water (bottom layer)'];
      } else {
        const correctTech = mixture.correctTechnique as 'filtration' | 'evaporation' | 'decantation';
        observation = `This technique didn't work well! ${mixture.name} requires ${techniques[correctTech].name} for effective separation.`;
        separated = ['Poor separation - wrong technique'];
      }

      const result: ExperimentResult = {
        technique: selectedTechnique,
        mixture: selectedMixture,
        observation,
        separated,
      };

      setExperimentResults((prev) => {
        const newResults = [...prev, result];
        if (newResults.length === 1) {
          if (isCorrect) {
            setTeacherMessage("Excellent choice! You matched the right technique to the mixture. Try the other combinations to see what works best for each mixture!");
          } else {
            setTeacherMessage("The separation wasn't optimal. Think about the properties of the mixture - is it soluble? Are the particles large or small? Try a different technique!");
          }
        } else if (newResults.length >= 3) {
          setTeacherMessage("Great work collecting data! You've tried multiple combinations. When ready, click 'View Results' to analyze which technique works best for each mixture!");
        }
        return newResults;
      });
      setIsSeparating(false);
      setSeparationProgress(0);
      setSelectedTechnique('none');
      setSelectedMixture('none');

      if (isCorrect) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    }, 2500);
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
      setTeacherMessage("Perfect score! You understand separation techniques perfectly! You know when to use filtration, evaporation, and decantation. Excellent work!");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else if (score >= quizQuestions.length / 2) {
      setTeacherMessage(`Good work! You got ${score} out of ${quizQuestions.length} correct. Review the techniques and think about which mixture properties each method separates best!`);
    } else {
      setTeacherMessage(`You got ${score} out of ${quizQuestions.length}. Remember: Filtration for large particles, Evaporation for dissolved solids, Decantation for liquids that don't mix. Try the experiments again!`);
    }
  };

  const handleComplete = () => {
    markLabComplete(labId, 100, 0);
    setStep('complete');
    setTeacherMessage("Congratulations! You've mastered separation techniques! These methods are used daily in Ghana - from water treatment plants to salt production. You now understand how to separate mixtures based on their physical properties!");
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
    });
  };

  const resetLab = () => {
    setStep('intro');
    setSelectedTechnique('none');
    setSelectedMixture('none');
    setIsSeparating(false);
    setSeparationProgress(0);
    setExperimentResults([]);
    setQuizAnswers({});
    setShowQuizFeedback(false);
    setQuizScore(0);
    setFilterPaperCollected(false);
    setBunsenBurnerCollected(false);
    setBeakersCollected(false);
    setFunnelCollected(false);
    setPendingTransition(null);
    setTeacherMessage("Ready to explore Separation Techniques again!");
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Draggable Teacher Voice Panel */}
      {teacherMessage && (
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={{
            left: -300,
            right: 300,
            top: -100,
            bottom: 400,
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-16 right-4 z-[60] cursor-move touch-none"
          style={{ x: teacherPosition.x, y: teacherPosition.y }}
          onDragEnd={(_, info) => {
            setTeacherPosition({
              x: teacherPosition.x + info.offset.x,
              y: teacherPosition.y + info.offset.y,
            });
          }}
        >
          <Card className="shadow-2xl border-2 border-purple-400 bg-white dark:bg-gray-900 max-w-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Teacher Guide (Drag to Move)</CardTitle>
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
      )}

      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FlaskConical className="w-8 h-8 text-purple-600" />
            Separation Techniques Lab
          </CardTitle>
          <CardDescription className="text-base">
            Learn how to separate different types of mixtures using filtration, evaporation, and decantation
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
                    <Sparkles className="w-6 h-6 text-purple-500" />
                    Understanding Separation Techniques
                  </h3>
                  <p>
                    In chemistry, we often need to separate mixtures into their individual components. 
                    Different types of mixtures require different separation techniques based on the 
                    properties of their components.
                  </p>

                  <h4 className="text-lg font-semibold mt-4">Three Main Techniques:</h4>
                  
                  <div className="grid md:grid-cols-3 gap-4 not-prose mt-4">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <Filter className="w-8 h-8 text-blue-600 mb-2" />
                      <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Filtration</h5>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Uses porous filter paper to trap solid particles while liquid passes through. 
                        Perfect for insoluble solids like sand in water.
                      </p>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                      <Flame className="w-8 h-8 text-orange-600 mb-2" />
                      <h5 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Evaporation</h5>
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        Heats the mixture so liquid turns to vapor, leaving solid behind. 
                        Used for soluble solids like salt dissolved in water.
                      </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                      <Beaker className="w-8 h-8 text-purple-600 mb-2" />
                      <h5 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Decantation</h5>
                      <p className="text-sm text-purple-800 dark:text-purple-200">
                        Carefully pours off one layer, leaving another behind. 
                        Works for immiscible liquids like oil and water.
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950 border-l-4 border-amber-500 p-4 mt-6 rounded">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-900 dark:text-amber-100">Safety First!</h4>
                        <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 mt-2">
                          <li>• Always wear safety goggles when working with chemicals</li>
                          <li>• Be careful with hot equipment during evaporation</li>
                          <li>• Pour slowly and steadily during decantation</li>
                          <li>• Use heat-resistant glassware for heating</li>
                          <li>• Never leave heating equipment unattended</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleStartExperiment}
                  size="lg"
                  className="w-full"
                >
                  Begin Experiments
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
                    <TestTube className="w-6 h-6 text-purple-500" />
                    Collect Laboratory Supplies
                  </h3>
                  <p className="text-muted-foreground">
                    Click on each item to collect it for your experiments
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Filter Paper */}
                  {!filterPaperCollected && (
                    <motion.button
                      onClick={handleCollectFilterPaper}
                      className="p-6 rounded-xl border-4 border-blue-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all cursor-pointer"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Filter className="w-16 h-16 text-blue-600" />
                        <h4 className="font-semibold text-lg">Filter Paper</h4>
                        <p className="text-sm text-muted-foreground">Click to collect</p>
                      </div>
                    </motion.button>
                  )}

                  {/* Bunsen Burner */}
                  {filterPaperCollected && !bunsenBurnerCollected && (
                    <motion.button
                      onClick={handleCollectBunsenBurner}
                      className="p-6 rounded-xl border-4 border-orange-300 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950 transition-all cursor-pointer"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Flame className="w-16 h-16 text-orange-600" />
                        <h4 className="font-semibold text-lg">Bunsen Burner</h4>
                        <p className="text-sm text-muted-foreground">Click to collect</p>
                      </div>
                    </motion.button>
                  )}

                  {/* Beakers */}
                  {bunsenBurnerCollected && !beakersCollected && (
                    <motion.button
                      onClick={handleCollectBeakers}
                      className="p-6 rounded-xl border-4 border-green-300 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950 transition-all cursor-pointer"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Beaker className="w-16 h-16 text-green-600" />
                        <h4 className="font-semibold text-lg">Beakers</h4>
                        <p className="text-sm text-muted-foreground">Click to collect</p>
                      </div>
                    </motion.button>
                  )}

                  {/* Funnel */}
                  {beakersCollected && !funnelCollected && (
                    <motion.button
                      onClick={handleCollectFunnel}
                      className="p-6 rounded-xl border-4 border-purple-300 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950 transition-all cursor-pointer"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <svg className="w-16 h-16 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 2h12v6l-6 10-6-10V2z" />
                          <line x1="6" y1="2" x2="18" y2="2" />
                          <line x1="12" y1="18" x2="12" y2="22" />
                        </svg>
                        <h4 className="font-semibold text-lg">Funnel</h4>
                        <p className="text-sm text-muted-foreground">Click to collect</p>
                      </div>
                    </motion.button>
                  )}
                </div>

                {/* Show collected items */}
                {(filterPaperCollected || bunsenBurnerCollected || beakersCollected || funnelCollected) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <h4 className="font-semibold mb-3 text-center">Collected Items:</h4>
                    <div className="flex gap-4 justify-center flex-wrap">
                      {filterPaperCollected && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium">Filter Paper</span>
                        </div>
                      )}
                      {bunsenBurnerCollected && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-orange-600" />
                          <span className="text-sm font-medium">Bunsen Burner</span>
                        </div>
                      )}
                      {beakersCollected && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium">Beakers</span>
                        </div>
                      )}
                      {funnelCollected && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-medium">Funnel</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {filterPaperCollected && bunsenBurnerCollected && beakersCollected && funnelCollected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-green-50 dark:bg-green-950 border-2 border-green-500 p-4 rounded-lg">
                      <p className="text-center font-semibold text-green-900 dark:text-green-100">
                        ✅ All supplies collected! You're ready to begin your experiments.
                      </p>
                    </div>
                    <Button
                      onClick={handleContinueToSetup}
                      size="lg"
                      className="w-full"
                    >
                      Continue to Setup
                    </Button>
                  </motion.div>
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
                    <TestTube className="w-6 h-6 text-purple-500" />
                    Choosing the Right Technique
                  </h3>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Key Principles:</h4>
                    <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                      <li>
                        <strong>Solubility matters:</strong> Can the solid dissolve in the liquid? 
                        Insoluble = Filtration, Soluble = Evaporation
                      </li>
                      <li>
                        <strong>Physical state:</strong> Are both liquids? Use decantation if they 
                        don't mix (immiscible)
                      </li>
                      <li>
                        <strong>Density differences:</strong> Denser materials sink, lighter ones float
                      </li>
                      <li>
                        <strong>Particle size:</strong> Large particles can be filtered, dissolved 
                        particles cannot
                      </li>
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setStep('experiment');
                    setTeacherMessage("Now select a mixture and technique to try separating it! Think carefully about which method works best for each mixture type.");
                  }}
                  size="lg"
                  className="w-full"
                >
                  Start Separating Mixtures
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
                  <h3 className="text-xl font-semibold">Select Mixture and Technique</h3>
                  <p className="text-muted-foreground">
                    Try separating at least 3 different mixtures using the appropriate techniques
                  </p>
                </div>

                {/* Mixture Selection */}
                <div>
                  <h4 className="font-semibold mb-3">Step 1: Choose a Mixture</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(Object.keys(mixtures) as MixtureType[]).filter(m => m !== 'none').map((mix) => {
                      const mixture = mixtures[mix];
                      return (
                        <motion.button
                          key={mix}
                          onClick={() => !isSeparating && setSelectedMixture(mix)}
                          disabled={isSeparating}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedMixture === mix
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-950 shadow-lg'
                              : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                          }`}
                          whileHover={{ scale: isSeparating ? 1 : 1.02 }}
                          whileTap={{ scale: isSeparating ? 1 : 0.98 }}
                        >
                          <div className="text-4xl mb-2">{mixture.icon}</div>
                          <h5 className="font-semibold mb-1">{mixture.name}</h5>
                          <p className="text-xs text-muted-foreground">
                            {mixture.components.join(' + ')}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Technique Selection */}
                <div>
                  <h4 className="font-semibold mb-3">Step 2: Choose a Separation Technique</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(Object.keys(techniques) as Technique[]).filter(t => t !== 'none').map((tech) => {
                      const technique = techniques[tech];
                      const Icon = technique.icon;
                      return (
                        <motion.button
                          key={tech}
                          onClick={() => !isSeparating && setSelectedTechnique(tech)}
                          disabled={isSeparating}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedTechnique === tech
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-lg'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                          }`}
                          whileHover={{ scale: isSeparating ? 1 : 1.02 }}
                          whileTap={{ scale: isSeparating ? 1 : 0.98 }}
                        >
                          <Icon className="w-10 h-10 mx-auto mb-2 text-blue-600" />
                          <h5 className="font-semibold mb-1">{technique.name}</h5>
                          <p className="text-xs text-muted-foreground">
                            {technique.description}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Visualization Area */}
                {selectedMixture !== 'none' && selectedTechnique !== 'none' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg"
                  >
                    <div className="flex flex-col items-center gap-6">
                      {/* Apparatus Visualization */}
                      {selectedTechnique === 'filtration' && (
                        <div className="relative">
                          {/* Filter funnel */}
                          <svg width="200" height="250" viewBox="0 0 200 250" className="mx-auto">
                            {/* Funnel */}
                            <path
                              d="M 40 30 L 160 30 L 100 150 Z"
                              fill="url(#funnelGradient)"
                              stroke="#666"
                              strokeWidth="2"
                            />
                            {/* Filter paper */}
                            <path
                              d="M 50 40 L 150 40 L 100 120 Z"
                              fill="white"
                              opacity="0.9"
                              stroke="#999"
                              strokeWidth="1"
                            />
                            {/* Residue on filter */}
                            {isSeparating && separationProgress > 20 && (
                              <circle cx="100" cy="80" r="15" fill="#8B4513" opacity="0.7" />
                            )}
                            {/* Beaker below */}
                            <rect
                              x="60"
                              y="160"
                              width="80"
                              height="80"
                              rx="5"
                              fill="url(#beakerGradient)"
                              stroke="#666"
                              strokeWidth="2"
                            />
                            {/* Filtered water */}
                            {isSeparating && separationProgress > 40 && (
                              <rect
                                x="65"
                                y={240 - separationProgress * 0.6}
                                width="70"
                                height={separationProgress * 0.6}
                                fill="#87CEEB"
                                opacity="0.7"
                              />
                            )}
                            {/* Droplets */}
                            {isSeparating && (
                              <>
                                <motion.circle
                                  cx="100"
                                  cy="140"
                                  r="3"
                                  fill="#4A90E2"
                                  animate={{ cy: [140, 160], opacity: [1, 0] }}
                                  transition={{ duration: 0.8, repeat: Infinity }}
                                />
                                <motion.circle
                                  cx="95"
                                  cy="145"
                                  r="2"
                                  fill="#4A90E2"
                                  animate={{ cy: [145, 165], opacity: [1, 0] }}
                                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                                />
                              </>
                            )}
                            <defs>
                              <linearGradient id="funnelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#E0E0E0" />
                                <stop offset="100%" stopColor="#B0B0B0" />
                              </linearGradient>
                              <linearGradient id="beakerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#F0F0F0" />
                                <stop offset="100%" stopColor="#D0D0D0" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      )}

                      {selectedTechnique === 'evaporation' && (
                        <div className="relative">
                          {/* Evaporating dish on flame */}
                          <svg width="200" height="250" viewBox="0 0 200 250" className="mx-auto">
                            {/* Dish */}
                            <ellipse cx="100" cy="100" rx="70" ry="20" fill="url(#dishGradient)" stroke="#666" strokeWidth="2" />
                            <path
                              d="M 30 100 L 30 110 Q 30 130, 50 130 L 150 130 Q 170 130, 170 110 L 170 100"
                              fill="url(#dishSideGradient)"
                              stroke="#666"
                              strokeWidth="2"
                            />
                            {/* Liquid in dish */}
                            {isSeparating && separationProgress < 80 && (
                              <ellipse
                                cx="100"
                                cy="110"
                                rx="65"
                                ry="15"
                                fill="#87CEEB"
                                opacity={1 - separationProgress / 100}
                              />
                            )}
                            {/* Salt crystals */}
                            {isSeparating && separationProgress > 60 && (
                              <>
                                {Array.from({ length: 12 }).map((_, i) => (
                                  <motion.rect
                                    key={i}
                                    x={60 + (i % 5) * 15}
                                    y={105 + Math.floor(i / 5) * 8}
                                    width="3"
                                    height="3"
                                    fill="white"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                  />
                                ))}
                              </>
                            )}
                            {/* Steam/vapor */}
                            {isSeparating && (
                              <>
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <motion.path
                                    key={i}
                                    d={`M ${80 + i * 10} 95 Q ${85 + i * 10} 80, ${90 + i * 10} 65`}
                                    stroke="#B0E0E6"
                                    strokeWidth="2"
                                    fill="none"
                                    opacity="0.6"
                                    animate={{
                                      y: [0, -30],
                                      opacity: [0.6, 0],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      delay: i * 0.3,
                                    }}
                                  />
                                ))}
                              </>
                            )}
                            {/* Flame */}
                            <g transform="translate(100, 180)">
                              <motion.ellipse
                                cx="0"
                                cy="0"
                                rx="40"
                                ry="50"
                                fill="url(#flameGradient)"
                                animate={{
                                  scale: [1, 1.1, 1],
                                  opacity: [0.8, 1, 0.8],
                                }}
                                transition={{
                                  duration: 0.5,
                                  repeat: Infinity,
                                }}
                              />
                              <motion.ellipse
                                cx="0"
                                cy="0"
                                rx="25"
                                ry="35"
                                fill="url(#flameInnerGradient)"
                                animate={{
                                  scale: [1, 1.15, 1],
                                }}
                                transition={{
                                  duration: 0.4,
                                  repeat: Infinity,
                                }}
                              />
                            </g>
                            <defs>
                              <linearGradient id="dishGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#F5F5DC" />
                                <stop offset="100%" stopColor="#D2B48C" />
                              </linearGradient>
                              <linearGradient id="dishSideGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#D2B48C" />
                                <stop offset="100%" stopColor="#A0826D" />
                              </linearGradient>
                              <radialGradient id="flameGradient">
                                <stop offset="0%" stopColor="#FFFF00" />
                                <stop offset="50%" stopColor="#FFA500" />
                                <stop offset="100%" stopColor="#FF4500" />
                              </radialGradient>
                              <radialGradient id="flameInnerGradient">
                                <stop offset="0%" stopColor="#FFFFFF" />
                                <stop offset="50%" stopColor="#FFFF00" />
                                <stop offset="100%" stopColor="#FFA500" />
                              </radialGradient>
                            </defs>
                          </svg>
                        </div>
                      )}

                      {selectedTechnique === 'decantation' && (
                        <div className="relative">
                          {/* Beaker with two layers */}
                          <svg width="200" height="250" viewBox="0 0 200 250" className="mx-auto">
                            {/* Beaker */}
                            <rect
                              x="40"
                              y="60"
                              width="120"
                              height="160"
                              rx="5"
                              fill="none"
                              stroke="#666"
                              strokeWidth="3"
                            />
                            {/* Water layer (bottom) */}
                            <rect
                              x="43"
                              y={isSeparating && separationProgress > 50 ? 140 : 160}
                              width="114"
                              height={isSeparating && separationProgress > 50 ? 77 : 57}
                              fill="#4A90E2"
                              opacity="0.7"
                            />
                            {/* Oil layer (top) */}
                            {(!isSeparating || separationProgress < 70) && (
                              <motion.rect
                                x="43"
                                y={isSeparating ? 60 + separationProgress * 0.5 : 100}
                                width="114"
                                height={isSeparating ? 60 - separationProgress * 0.4 : 60}
                                fill="#FFD700"
                                opacity={isSeparating ? 1 - separationProgress / 100 : 0.8}
                              />
                            )}
                            {/* Separation line */}
                            <line
                              x1="43"
                              y1={isSeparating && separationProgress > 50 ? 140 : 160}
                              x2="157"
                              y2={isSeparating && separationProgress > 50 ? 140 : 160}
                              stroke="#333"
                              strokeWidth="1"
                              strokeDasharray="3,3"
                            />
                            {/* Pouring beaker (during separation) */}
                            {isSeparating && separationProgress < 70 && (
                              <g transform={`translate(${150 + separationProgress * 0.5}, ${50 - separationProgress * 0.3})`}>
                                <rect
                                  x="0"
                                  y="0"
                                  width="40"
                                  height="50"
                                  rx="3"
                                  fill="none"
                                  stroke="#666"
                                  strokeWidth="2"
                                  transform="rotate(30, 20, 25)"
                                />
                                {/* Stream of oil */}
                                <motion.path
                                  d="M 15 40 Q 10 50, 5 60"
                                  stroke="#FFD700"
                                  strokeWidth="3"
                                  fill="none"
                                  animate={{
                                    opacity: [0.7, 1, 0.7],
                                  }}
                                  transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                  }}
                                />
                              </g>
                            )}
                          </svg>
                        </div>
                      )}

                      {/* Progress bar */}
                      {isSeparating && (
                        <div className="w-full max-w-md">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Separating...</span>
                            <span className="text-sm font-medium">{Math.round(separationProgress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                            <motion.div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${separationProgress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Separate Button */}
                {selectedMixture !== 'none' && selectedTechnique !== 'none' && !isSeparating && (
                  <Button
                    onClick={handleSeparate}
                    size="lg"
                    className="w-full"
                  >
                    Perform Separation
                  </Button>
                )}

                {/* Results Table */}
                {experimentResults.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Experiment Results:</h4>
                    {experimentResults.map((result, idx) => (
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
                              {result.technique !== 'none' && result.mixture !== 'none' && `${techniques[result.technique].name} on ${mixtures[result.mixture].name}`}
                            </h5>
                            <p className="text-sm text-muted-foreground mb-2">
                              {result.observation}
                            </p>
                            <div className="text-xs space-y-1">
                              <p className="font-medium">Components Separated:</p>
                              <ul className="list-disc list-inside">
                                {result.separated.map((component, i) => (
                                  <li key={i}>{component}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Continue Button */}
                {experimentResults.length >= 3 && (
                  <Button
                    onClick={() => {
                      setStep('results');
                      setTeacherMessage("Excellent work! Let's analyze your results. Notice which techniques worked best for each type of mixture. This is key to choosing the right separation method!");
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
                    <Sparkles className="w-7 h-7 text-purple-500" />
                    Understanding Separation Techniques
                  </h3>
                </div>

                <div className="prose dark:prose-invert max-w-none space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-950 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                      🔬 Key Principles:
                    </h4>
                    <div className="space-y-3 text-blue-800 dark:text-blue-200">
                      <div>
                        <strong>Filtration:</strong> Works because filter paper has tiny holes that allow 
                        liquid molecules to pass through but trap larger solid particles. The liquid that 
                        passes through is called the <em>filtrate</em>, and the solid left behind is the <em>residue</em>.
                      </div>
                      <div>
                        <strong>Evaporation:</strong> Uses heat to convert liquid into vapor (gas), which 
                        escapes into the air. The dissolved solid (like salt) cannot evaporate and remains 
                        as crystals. This only works for solutions where the solid is dissolved.
                      </div>
                      <div>
                        <strong>Decantation:</strong> Relies on density differences. Oil floats on water because 
                        it's less dense. By carefully pouring off the top layer, we can separate immiscible 
                        (non-mixing) liquids.
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                      🌍 Real-World Applications:
                    </h4>
                    <ul className="space-y-2 text-green-800 dark:text-green-200">
                      <li>
                        <strong>Water Treatment Plants:</strong> Use filtration to remove dirt, sand, and 
                        other particles from drinking water, making it safe to drink.
                      </li>
                      <li>
                        <strong>Salt Production:</strong> Seawater is evaporated in large shallow pools 
                        to produce salt, leaving behind valuable salt crystals.
                      </li>
                      <li>
                        <strong>Oil Spill Cleanup:</strong> Decantation and other separation techniques 
                        help remove oil from water after maritime accidents.
                      </li>
                      <li>
                        <strong>Coffee Making:</strong> Your coffee filter uses filtration to separate 
                        liquid coffee from ground coffee beans.
                      </li>
                      <li>
                        <strong>Kidney Function:</strong> Your kidneys filter blood, removing waste products 
                        while retaining useful substances.
                      </li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950 p-5 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
                      📊 Comparison Table:
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-purple-100 dark:bg-purple-900">
                          <tr>
                            <th className="p-2 text-left">Technique</th>
                            <th className="p-2 text-left">Best For</th>
                            <th className="p-2 text-left">Cannot Separate</th>
                          </tr>
                        </thead>
                        <tbody className="text-purple-800 dark:text-purple-200">
                          <tr className="border-b border-purple-200 dark:border-purple-800">
                            <td className="p-2">Filtration</td>
                            <td className="p-2">Insoluble solid + liquid</td>
                            <td className="p-2">Dissolved substances</td>
                          </tr>
                          <tr className="border-b border-purple-200 dark:border-purple-800">
                            <td className="p-2">Evaporation</td>
                            <td className="p-2">Soluble solid + liquid</td>
                            <td className="p-2">Two liquids</td>
                          </tr>
                          <tr>
                            <td className="p-2">Decantation</td>
                            <td className="p-2">Immiscible liquids</td>
                            <td className="p-2">Dissolved substances</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setStep('quiz');
                    setTeacherMessage("Time to test your understanding! Think about which technique works best for each mixture type. You've done the experiments, now show what you learned!");
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
                    Answer these questions about separation techniques
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
                          ? '🎉 Perfect! You mastered separation techniques!'
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
                    You've completed the Separation Techniques Lab
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-purple-600">
                  <Award className="w-8 h-8" />
                  <span>+100 XP</span>
                </div>

                <div className="prose dark:prose-invert max-w-none text-left bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3">What You Learned:</h4>
                  <ul className="space-y-2">
                    <li>✓ How to use filtration to separate insoluble solids from liquids</li>
                    <li>✓ How evaporation separates dissolved solids by removing the solvent</li>
                    <li>✓ How decantation separates immiscible liquids by density</li>
                    <li>✓ When to choose each technique based on mixture properties</li>
                    <li>✓ Real-world applications in water treatment, salt production, and more</li>
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
