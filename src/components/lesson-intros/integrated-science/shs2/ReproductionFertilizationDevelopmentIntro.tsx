'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  ChevronRight,
  ChevronLeft,
  Baby,
  Heart,
  Droplets,
  Activity,
  Clock,
  ArrowRight
} from 'lucide-react';

interface ReproductionFertilizationDevelopmentIntroProps {
  onComplete?: () => void;
}

// Fertilization Animation
const FertilizationDemo: React.FC = () => {
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    if (isPlaying && stage < 4) {
      const timer = setTimeout(() => setStage(s => s + 1), 1500);
      return () => clearTimeout(timer);
    } else if (stage >= 4) {
      setIsPlaying(false);
    }
  }, [isPlaying, stage]);
  
  const stageLabels = [
    'Sperm approaches egg',
    'Sperm penetrates outer layer',
    'Nuclei begin to fuse',
    'Chromosomes combine (23 + 23)',
    'Zygote formed! (46 chromosomes)'
  ];
  
  return (
    <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/30 rounded-xl p-4 border border-pink-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-5 h-5 text-pink-400" />
        <h4 className="text-white font-medium">Fertilization Process</h4>
      </div>
      
      {/* Animation Area */}
      <div className="relative h-36 bg-black/30 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
        {/* Egg */}
        <motion.div
          className="relative"
          animate={{
            scale: stage >= 4 ? 1.1 : 1
          }}
        >
          {/* Outer zona pellucida */}
          <div className={`w-24 h-24 rounded-full border-4 ${
            stage >= 1 ? 'border-pink-400/50' : 'border-pink-300/70'
          } flex items-center justify-center transition-colors`}>
            {/* Egg cell */}
            <div className={`w-18 h-18 rounded-full ${
              stage >= 4 ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-pink-500/80'
            } flex items-center justify-center transition-all`}>
              {/* Nucleus */}
              <motion.div
                className={`w-6 h-6 rounded-full ${
                  stage >= 3 ? 'bg-purple-300' : 'bg-pink-300'
                }`}
                animate={{
                  scale: stage >= 4 ? 1.2 : 1
                }}
              />
            </div>
          </div>
          
          {/* Penetration point */}
          {stage >= 1 && stage < 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full"
            />
          )}
        </motion.div>
        
        {/* Sperm */}
        <AnimatePresence>
          {stage < 2 && (
            <motion.div
              initial={{ x: -80, opacity: 0 }}
              animate={{ 
                x: stage === 0 ? -40 : -20,
                opacity: 1 
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute left-1/4"
            >
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-400 rounded-full" />
                <div className="w-8 h-0.5 bg-blue-400/70" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Multiple sperm approaching */}
        {stage === 0 && (
          <>
            <motion.div
              animate={{ x: [-100, -60], opacity: [0, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute left-1/4 top-8"
            >
              <div className="flex items-center scale-75 opacity-50">
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
                <div className="w-6 h-0.5 bg-blue-400/50" />
              </div>
            </motion.div>
            <motion.div
              animate={{ x: [-90, -50], opacity: [0, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
              className="absolute left-1/4 bottom-8"
            >
              <div className="flex items-center scale-75 opacity-50">
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
                <div className="w-6 h-0.5 bg-blue-400/50" />
              </div>
            </motion.div>
          </>
        )}
        
        {/* Stage indicator */}
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <span className="text-xs text-pink-200 bg-black/50 px-2 py-1 rounded">
            {stageLabels[stage]}
          </span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => { setStage(0); setIsPlaying(true); }}
          className="px-3 py-1.5 bg-pink-600/60 hover:bg-pink-600 text-white text-xs rounded-lg transition-colors flex items-center gap-1"
        >
          <Play className="w-3 h-3" />
          {stage > 0 ? 'Replay' : 'Watch'}
        </button>
      </div>
    </div>
  );
};

// Development Timeline
const DevelopmentTimeline: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState(0);
  
  const stages = [
    { week: '1-2', name: 'Zygote & Cleavage', size: '0.1mm', desc: 'Single cell divides rapidly' },
    { week: '3-4', name: 'Implantation', size: '2mm', desc: 'Heart begins beating' },
    { week: '5-8', name: 'Embryo', size: '2.5cm', desc: 'All organs forming' },
    { week: '9-12', name: 'Early Fetus', size: '7.5cm', desc: 'Can move, fingernails grow' },
    { week: '13-26', name: 'Mid Fetus', size: '35cm', desc: 'Mother feels movement' },
    { week: '27-40', name: 'Late Fetus', size: '50cm', desc: 'Ready for birth!' }
  ];
  
  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/30 rounded-xl p-4 border border-blue-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-blue-400" />
        <h4 className="text-white font-medium">Development Timeline</h4>
      </div>
      
      {/* Timeline */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
        {stages.map((stage, i) => (
          <button
            key={i}
            onClick={() => setSelectedStage(i)}
            className={`flex-shrink-0 px-2 py-1 rounded text-xs transition-all ${
              selectedStage === i 
                ? 'bg-blue-600 text-white' 
                : 'bg-black/30 text-gray-400 hover:text-white'
            }`}
          >
            Week {stage.week}
          </button>
        ))}
      </div>
      
      {/* Stage details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-black/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-4">
            {/* Size visualization */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`rounded-full bg-gradient-to-br from-pink-400 to-purple-500 ${
                  selectedStage === 0 ? 'w-2 h-2' :
                  selectedStage === 1 ? 'w-3 h-3' :
                  selectedStage === 2 ? 'w-6 h-6' :
                  selectedStage === 3 ? 'w-10 h-10' :
                  selectedStage === 4 ? 'w-14 h-14' :
                  'w-18 h-18'
                }`}
              />
            </div>
            
            <div className="flex-1">
              <h5 className="text-white font-medium">{stages[selectedStage].name}</h5>
              <p className="text-sm text-gray-400">Size: {stages[selectedStage].size}</p>
              <p className="text-sm text-blue-300 mt-1">{stages[selectedStage].desc}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Placenta Functions
const PlacentaFunctions: React.FC = () => {
  const [selectedFunction, setSelectedFunction] = useState<number | null>(null);
  
  const functions = [
    { icon: '🍽️', name: 'Nutrition', desc: 'Transfers glucose, amino acids, vitamins from mother' },
    { icon: '💨', name: 'Gas Exchange', desc: 'Oxygen to baby, CO₂ to mother (like lungs)' },
    { icon: '🗑️', name: 'Waste Removal', desc: 'Removes urea and waste products' },
    { icon: '⚗️', name: 'Hormones', desc: 'Produces progesterone to maintain pregnancy' },
    { icon: '🛡️', name: 'Protection', desc: 'Barrier against some pathogens' },
    { icon: '💉', name: 'Immunity', desc: 'Transfers antibodies to protect baby' }
  ];
  
  return (
    <div className="bg-gradient-to-br from-green-900/40 to-teal-900/30 rounded-xl p-4 border border-green-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-5 h-5 text-green-400" />
        <h4 className="text-white font-medium">Placenta: The Lifeline</h4>
      </div>
      
      <p className="text-xs text-gray-400 mb-3">Tap to learn each function:</p>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        {functions.map((func, i) => (
          <motion.button
            key={func.name}
            onClick={() => setSelectedFunction(selectedFunction === i ? null : i)}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg text-center transition-all ${
              selectedFunction === i 
                ? 'bg-green-600/50 border-2 border-green-400' 
                : 'bg-black/30 border border-gray-700 hover:border-gray-500'
            }`}
          >
            <span className="text-xl">{func.icon}</span>
            <p className="text-xs text-white mt-1">{func.name}</p>
          </motion.button>
        ))}
      </div>
      
      <AnimatePresence>
        {selectedFunction !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black/30 rounded-lg p-3"
          >
            <p className="text-sm text-white">
              <span className="text-xl mr-2">{functions[selectedFunction].icon}</span>
              <strong className="text-green-300">{functions[selectedFunction].name}:</strong>{' '}
              {functions[selectedFunction].desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Fertilization Types Comparison
const FertilizationTypes: React.FC = () => {
  const [type, setType] = useState<'external' | 'internal'>('external');
  
  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-xl p-4 border border-slate-500/30">
      <h4 className="text-white font-medium mb-3 text-center">External vs Internal Fertilization</h4>
      
      {/* Toggle */}
      <div className="flex justify-center mb-4">
        <div className="flex bg-black/30 rounded-lg p-1">
          <button
            onClick={() => setType('external')}
            className={`px-3 py-1.5 rounded text-sm transition-all ${
              type === 'external' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🐟 External
          </button>
          <button
            onClick={() => setType('internal')}
            className={`px-3 py-1.5 rounded text-sm transition-all ${
              type === 'internal' 
                ? 'bg-pink-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🐐 Internal
          </button>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={type}
          initial={{ opacity: 0, x: type === 'external' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-2"
        >
          {type === 'external' ? (
            <>
              <div className="bg-blue-900/30 p-3 rounded-lg">
                <p className="text-sm text-blue-200"><strong>Location:</strong> Outside body, in water</p>
              </div>
              <div className="bg-blue-900/30 p-3 rounded-lg">
                <p className="text-sm text-blue-200"><strong>Eggs:</strong> Many (hundreds to thousands)</p>
              </div>
              <div className="bg-blue-900/30 p-3 rounded-lg">
                <p className="text-sm text-blue-200"><strong>Survival:</strong> Low - eggs vulnerable</p>
              </div>
              <div className="bg-blue-900/30 p-3 rounded-lg">
                <p className="text-sm text-blue-200"><strong>Ghana Examples:</strong> Tilapia, catfish, frogs</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-pink-900/30 p-3 rounded-lg">
                <p className="text-sm text-pink-200"><strong>Location:</strong> Inside female&apos;s body</p>
              </div>
              <div className="bg-pink-900/30 p-3 rounded-lg">
                <p className="text-sm text-pink-200"><strong>Eggs:</strong> Few (better protected)</p>
              </div>
              <div className="bg-pink-900/30 p-3 rounded-lg">
                <p className="text-sm text-pink-200"><strong>Survival:</strong> High - embryo protected</p>
              </div>
              <div className="bg-pink-900/30 p-3 rounded-lg">
                <p className="text-sm text-pink-200"><strong>Ghana Examples:</strong> Humans, goats, cattle, chickens</p>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Main Component
export default function ReproductionFertilizationDevelopmentIntro({ onComplete }: ReproductionFertilizationDevelopmentIntroProps) {
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());
  
  const stages = [
    {
      title: "The Miracle of Fertilization",
      content: "Fertilization is the moment new life begins, when a sperm cell fuses with an egg cell to form a zygote. This single cell contains all the genetic instructions to build a complete human being. Of 300 million sperm, only one will succeed in fertilizing the egg!",
      visual: 'fertilization'
    },
    {
      title: "External vs Internal",
      content: "Animals use two fertilization strategies. Fish like Ghana's tilapia release eggs and sperm into water, called external fertilization. Mammals, birds, and reptiles use internal fertilization, where sperm meets egg inside the female's body, providing better protection for the developing embryo.",
      visual: 'comparison'
    },
    {
      title: "Development Stages",
      content: "After fertilization, the zygote divides rapidly to form a ball of cells. It implants in the uterus and develops into an embryo. By week 8, all major organs have begun forming and it's called a fetus. Human pregnancy lasts about 40 weeks or 9 months.",
      visual: 'timeline'
    },
    {
      title: "The Placenta: Lifeline",
      content: "The placenta is the most amazing temporary organ! It connects mother and baby, providing oxygen and nutrition while removing waste. It produces hormones to maintain pregnancy and even transfers antibodies to protect the newborn. Mother and baby's blood never mix directly.",
      visual: 'placenta'
    },
    {
      title: "Ready to Learn More!",
      content: "Understanding fertilization and development helps us appreciate the miracle of life. In Ghana, this knowledge supports maternal health, family planning, and animal husbandry. Let's explore the complete journey from a single cell to a newborn baby!",
      visual: 'summary'
    }
  ];
  
  const words = stages[stage].content.split(' ');
  
  // Speech synthesis
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = isMuted ? 0 : 1;
    
    let wordIndex = 0;
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentWordIndex(wordIndex);
        wordIndex++;
      }
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentWordIndex(-1);
    };
    
    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentWordIndex(-1);
    };
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }, [isMuted]);
  
  // Auto-play narration on stage change
  useEffect(() => {
    if (!hasSpokenRef.current.has(stage) && !isMuted) {
      const timer = setTimeout(() => {
        speak(stages[stage].content);
        hasSpokenRef.current.add(stage);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stage, speak, isMuted, stages]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  const togglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
      setCurrentWordIndex(-1);
    } else {
      speak(stages[stage].content);
    }
  };
  
  const toggleMute = () => {
    if (!isMuted) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
      setCurrentWordIndex(-1);
    }
    setIsMuted(!isMuted);
  };
  
  const goToStage = (newStage: number) => {
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
    setCurrentWordIndex(-1);
    setStage(newStage);
  };
  
  const handleNext = () => {
    if (stage < stages.length - 1) {
      goToStage(stage + 1);
    } else {
      onComplete?.();
    }
  };
  
  const handleBack = () => {
    if (stage > 0) {
      goToStage(stage - 1);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-pink-900/20 to-gray-900 text-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-800/80 to-purple-800/80 backdrop-blur-sm px-4 py-4 sticky top-0 z-40 border-b border-pink-500/30">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
              <Baby className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Fertilization & Development</h1>
              <p className="text-pink-200 text-xs">Interactive Introduction</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleMute}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="bg-black/30 px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            {stages.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  i === stage ? 'bg-pink-400' : i < stage ? 'bg-pink-600' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center">Stage {stage + 1} of {stages.length}</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stage Title */}
            <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              {stages[stage].title}
            </h2>
            
            {/* Teacher Narration */}
            <div className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 rounded-xl p-4 mb-6 border border-pink-500/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 flex items-center justify-center text-lg">
                  👩‍⚕️
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-300 font-medium text-sm">Dr. Adwoa</span>
                    <motion.button
                      onClick={togglePlay}
                      whileTap={{ scale: 0.95 }}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </motion.button>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {words.map((word, i) => (
                      <span
                        key={i}
                        className={`transition-colors duration-150 ${
                          i === currentWordIndex 
                            ? 'text-yellow-300 font-medium' 
                            : i < currentWordIndex 
                              ? 'text-gray-300' 
                              : ''
                        }`}
                      >
                        {word}{' '}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Interactive Visual */}
            {stages[stage].visual === 'fertilization' && (
              <FertilizationDemo />
            )}
            
            {stages[stage].visual === 'comparison' && (
              <FertilizationTypes />
            )}
            
            {stages[stage].visual === 'timeline' && (
              <DevelopmentTimeline />
            )}
            
            {stages[stage].visual === 'placenta' && (
              <PlacentaFunctions />
            )}
            
            {stages[stage].visual === 'summary' && (
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-xl p-6 border border-slate-500/30 text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <Baby className="w-16 h-16 text-pink-400" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-white mb-4">Key Takeaways</h3>
                
                <div className="grid gap-3 text-left">
                  <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
                    <span className="text-2xl">🔬</span>
                    <span className="text-sm text-gray-200">Fertilization creates a unique individual with 46 chromosomes</span>
                  </div>
                  <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
                    <span className="text-2xl">🐟</span>
                    <span className="text-sm text-gray-200">External (water) vs Internal (body) fertilization strategies</span>
                  </div>
                  <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
                    <span className="text-2xl">👶</span>
                    <span className="text-sm text-gray-200">Development: Zygote → Embryo → Fetus → Baby (40 weeks)</span>
                  </div>
                  <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
                    <span className="text-2xl">❤️</span>
                    <span className="text-sm text-gray-200">Placenta provides nutrition, oxygen, and protection</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Fixed Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/98 backdrop-blur-md px-4 sm:px-6 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:py-4 border-t border-gray-700/50 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={handleBack}
            disabled={stage === 0}
            whileTap={{ scale: 0.95 }}
            className={`p-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              stage === 0
                ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            <ChevronLeft className="w-5 h-5 sm:hidden" />
            <span className="hidden sm:inline">Back</span>
          </motion.button>
          
          <div className="flex gap-1">
            {stages.map((_, i) => (
              <button
                key={i}
                onClick={() => goToStage(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === stage ? 'bg-pink-400 w-4' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
          
          <motion.button
            onClick={handleNext}
            whileTap={{ scale: 0.95 }}
            className="p-2 sm:px-6 sm:py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-pink-500/20"
          >
            {stage === stages.length - 1 ? (
              <>
                <Play className="w-5 h-5 sm:hidden" />
                <span className="hidden sm:inline">Start Lesson</span>
              </>
            ) : (
              <>
                <ChevronRight className="w-5 h-5 sm:hidden" />
                <span className="hidden sm:inline">Next</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
