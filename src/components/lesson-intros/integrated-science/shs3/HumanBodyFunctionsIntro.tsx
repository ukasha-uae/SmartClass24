'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Brain,
  Heart,
  Wind,
  Activity,
  Droplets,
  Shield,
  Dumbbell,
  Bone,
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Zap,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HumanBodyFunctionsIntroProps {
  onComplete?: () => void;
}

// Systems interaction data
const systemInteractions = [
  {
    id: 'nervous',
    name: 'Nervous',
    icon: Brain,
    color: '#FFD700',
    role: 'Fast Control',
    connects: ['endocrine', 'muscular', 'cardiovascular'],
    description: 'Sends electrical signals in milliseconds'
  },
  {
    id: 'endocrine',
    name: 'Endocrine',
    icon: Activity,
    color: '#9B59B6',
    role: 'Slow Control',
    connects: ['nervous', 'cardiovascular', 'digestive'],
    description: 'Releases hormones for long-term changes'
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular',
    icon: Heart,
    color: '#E74C3C',
    role: 'Transport',
    connects: ['respiratory', 'digestive', 'urinary', 'muscular'],
    description: 'Connects ALL systems through blood'
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    icon: Wind,
    color: '#87CEEB',
    role: 'Gas Exchange',
    connects: ['cardiovascular'],
    description: 'Provides oxygen, removes CO₂'
  },
  {
    id: 'digestive',
    name: 'Digestive',
    icon: Droplets,
    color: '#F39C12',
    role: 'Nutrients',
    connects: ['cardiovascular', 'urinary'],
    description: 'Breaks down food for energy'
  },
  {
    id: 'muscular',
    name: 'Muscular',
    icon: Dumbbell,
    color: '#D64545',
    role: 'Movement',
    connects: ['skeletal', 'nervous', 'cardiovascular'],
    description: 'Enables all body movement'
  },
  {
    id: 'skeletal',
    name: 'Skeletal',
    icon: Bone,
    color: '#E8E8E8',
    role: 'Support',
    connects: ['muscular'],
    description: 'Framework and protection'
  },
  {
    id: 'immune',
    name: 'Immune',
    icon: Shield,
    color: '#2ECC71',
    role: 'Defense',
    connects: ['cardiovascular'],
    description: 'Fights pathogens and disease'
  },
  {
    id: 'urinary',
    name: 'Urinary',
    icon: Droplets,
    color: '#3498DB',
    role: 'Excretion',
    connects: ['cardiovascular', 'digestive'],
    description: 'Filters blood, removes waste'
  }
];

// Oxygen pathway steps
const oxygenPathway = [
  { step: 1, location: 'Nose/Mouth', action: 'Air enters', icon: '👃' },
  { step: 2, location: 'Trachea', action: 'Air travels down', icon: '🫁' },
  { step: 3, location: 'Bronchi', action: 'Branches to lungs', icon: '🌲' },
  { step: 4, location: 'Alveoli', action: 'Gas exchange', icon: '🔵' },
  { step: 5, location: 'Blood', action: 'O₂ binds hemoglobin', icon: '❤️' },
  { step: 6, location: 'Heart', action: 'Pumps to body', icon: '💓' },
  { step: 7, location: 'Cells', action: 'Cellular respiration', icon: '⚡' }
];

// System interaction visualizer component
const SystemNetwork: React.FC<{ 
  activeSystem: string | null;
  onSelectSystem: (id: string) => void;
}> = ({ activeSystem, onSelectSystem }) => {
  const systems = systemInteractions.slice(0, 6); // Show first 6 for cleaner visualization
  
  return (
    <div className="relative w-full h-64">
      {/* Center cardiovascular (the connector) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.button
          onClick={() => onSelectSystem('cardiovascular')}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
            activeSystem === 'cardiovascular' ? 'ring-4 ring-white scale-110' : ''
          }`}
          style={{ backgroundColor: '#E74C3C' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart className="w-8 h-8 text-white" />
        </motion.button>
      </div>
      
      {/* Surrounding systems */}
      {systems.filter(s => s.id !== 'cardiovascular').map((system, index) => {
        const angle = (index * 72) * (Math.PI / 180); // 5 systems around
        const radius = 90;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const Icon = system.icon;
        
        return (
          <motion.button
            key={system.id}
            onClick={() => onSelectSystem(system.id)}
            className={`absolute w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
              activeSystem === system.id ? 'ring-4 ring-white scale-110' : ''
            }`}
            style={{ 
              backgroundColor: system.color,
              left: `calc(50% + ${x}px - 24px)`,
              top: `calc(50% + ${y}px - 24px)`
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.button>
        );
      })}
      
      {/* Connection lines */}
      <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
        {systems.filter(s => s.id !== 'cardiovascular').map((system, index) => {
          const angle = (index * 72) * (Math.PI / 180);
          const radius = 90;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <line
              key={system.id}
              x1="50%"
              y1="50%"
              x2={`calc(50% + ${x}px)`}
              y2={`calc(50% + ${y}px)`}
              stroke={activeSystem === system.id || activeSystem === 'cardiovascular' ? '#fff' : '#ffffff40'}
              strokeWidth="2"
              strokeDasharray={activeSystem === system.id ? '0' : '4'}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Oxygen pathway animation
const OxygenPathwayDemo: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % oxygenPathway.length);
    }, 1500);
    
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  return (
    <div className="relative">
      {/* Pathway visualization */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
        {oxygenPathway.map((step, index) => (
          <React.Fragment key={step.step}>
            <motion.div
              className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] ${
                index === currentStep ? 'bg-blue-500/50 scale-105' : 'bg-white/10'
              }`}
              animate={{
                scale: index === currentStep ? 1.05 : 1,
                backgroundColor: index === currentStep ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255,255,255,0.1)'
              }}
            >
              <span className="text-2xl">{step.icon}</span>
              <span className="text-xs font-medium mt-1">{step.location}</span>
            </motion.div>
            {index < oxygenPathway.length - 1 && (
              <ArrowRight className={`w-4 h-4 flex-shrink-0 ${
                index === currentStep ? 'text-blue-400' : 'text-white/40'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Current action description */}
      <motion.div 
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 text-center p-2 bg-blue-500/30 rounded-lg"
      >
        <p className="font-medium">{oxygenPathway[currentStep].action}</p>
      </motion.div>
    </div>
  );
};

// Exercise response demo
const ExerciseResponseDemo: React.FC = () => {
  const [isExercising, setIsExercising] = useState(false);
  const [heartRate, setHeartRate] = useState(70);
  const [breathRate, setBreathRate] = useState(12);
  
  useEffect(() => {
    if (isExercising) {
      const interval = setInterval(() => {
        setHeartRate(prev => Math.min(prev + 5, 150));
        setBreathRate(prev => Math.min(prev + 2, 40));
      }, 500);
      return () => clearInterval(interval);
    } else {
      const interval = setInterval(() => {
        setHeartRate(prev => Math.max(prev - 3, 70));
        setBreathRate(prev => Math.max(prev - 1, 12));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isExercising]);
  
  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExercising(!isExercising)}
        className={`w-full py-3 rounded-lg font-bold transition-all ${
          isExercising 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {isExercising ? '🏃 Stop Running' : '🚶 Start Running'}
      </button>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-500/30 p-4 rounded-lg text-center">
          <Heart className={`w-8 h-8 mx-auto mb-2 ${isExercising ? 'animate-pulse' : ''}`} />
          <div className="text-2xl font-bold">{heartRate}</div>
          <div className="text-sm opacity-80">bpm</div>
        </div>
        <div className="bg-blue-500/30 p-4 rounded-lg text-center">
          <Wind className={`w-8 h-8 mx-auto mb-2 ${isExercising ? 'animate-pulse' : ''}`} />
          <div className="text-2xl font-bold">{breathRate}</div>
          <div className="text-sm opacity-80">breaths/min</div>
        </div>
      </div>
      
      {isExercising && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm bg-yellow-500/30 p-3 rounded-lg"
        >
          <p className="font-medium">Systems responding:</p>
          <p>💪 Muscles contracting • ❤️ Heart pumping faster</p>
          <p>🫁 Breathing deeper • 💧 Sweating to cool</p>
        </motion.div>
      )}
    </div>
  );
};

// Comparison table component
const ComparisonDemo: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Nervous */}
        <div className="bg-yellow-500/30 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5" />
            <span className="font-bold">Nervous</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Electrical signals</span>
            </div>
            <div>⚡ Fast (ms)</div>
            <div>🎯 Specific targets</div>
            <div>⏱️ Short-lived</div>
          </div>
        </div>
        
        {/* Endocrine */}
        <div className="bg-purple-500/30 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5" />
            <span className="font-bold">Endocrine</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              <span>Chemical hormones</span>
            </div>
            <div>🐢 Slow (hrs/days)</div>
            <div>🌐 Widespread</div>
            <div>⏰ Long-lasting</div>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-all"
      >
        {showDetails ? 'Hide Example' : 'Show Working Together'}
      </button>
      
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gradient-to-r from-yellow-500/20 to-purple-500/20 p-3 rounded-lg text-sm"
        >
          <p className="font-medium mb-1">Example: Stress Response 😰</p>
          <p>1. Nervous: Instantly increases heart rate</p>
          <p>2. Endocrine: Adrenaline sustains the response</p>
          <p className="mt-2 opacity-80">Both work together via the hypothalamus!</p>
        </motion.div>
      )}
    </div>
  );
};

// Stage definitions
const stages = [
  {
    id: 'welcome',
    title: "System Functions",
    subtitle: "How Systems Work Together",
    bgGradient: "from-red-600 via-orange-600 to-amber-600"
  },
  {
    id: 'control',
    title: "Control Systems",
    subtitle: "Nervous vs Endocrine",
    bgGradient: "from-yellow-600 via-purple-600 to-pink-600"
  },
  {
    id: 'oxygen',
    title: "Oxygen Journey",
    subtitle: "From Air to Cells",
    bgGradient: "from-blue-600 via-cyan-600 to-teal-600"
  },
  {
    id: 'connections',
    title: "System Network",
    subtitle: "Everything is Connected",
    bgGradient: "from-red-600 via-pink-600 to-purple-600"
  },
  {
    id: 'exercise',
    title: "Exercise Response",
    subtitle: "Systems in Action",
    bgGradient: "from-green-600 via-emerald-600 to-teal-600"
  }
];

export default function HumanBodyFunctionsIntro({ onComplete }: HumanBodyFunctionsIntroProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [activeSystem, setActiveSystem] = useState<string | null>(null);
  const [isOxygenPlaying, setIsOxygenPlaying] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stageTexts = useMemo(() => [
    "Welcome back to Human Body Systems! In the last lesson, we met all 11 body systems. Now let's discover HOW they actually work and connect. Every breath you take, every beat of your heart - it's all about systems working together in perfect harmony!",
    "Your body has two control systems. The nervous system is like lightning - super fast electrical signals for instant responses. The endocrine system is like a slow river - hormones flowing through blood for long-lasting changes. Together, they coordinate everything!",
    "Follow the oxygen journey! Air enters your nose, travels down the trachea, branches into bronchi, and reaches tiny alveoli. There, oxygen diffuses into blood, binds to hemoglobin, gets pumped by the heart, and finally reaches every cell for energy production!",
    "The cardiovascular system is the ultimate connector! It's like a highway system linking all organs. Blood carries oxygen from lungs, nutrients from intestines, hormones from glands, and waste to kidneys. No system works alone - they all depend on each other!",
    "Now see systems in action! When you exercise, watch how multiple systems respond together. Muscles need more energy, so breathing increases, heart pumps faster, adrenaline releases, and you sweat to cool down. This is the amazing teamwork of your body!"
  ], []);

  // Chrome speech synthesis keep-alive
  const keepAlive = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
    
    resumeTimeoutRef.current = setTimeout(keepAlive, 10000);
  }, []);

  const speakText = useCallback((text: string, isAutoPlay = false) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // On mobile, don't auto-play speech - requires user interaction
    if (isAutoPlay && !hasUserInteracted) return;
    
    window.speechSynthesis.cancel();
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      keepAlive();
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [keepAlive, hasUserInteracted]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    setIsSpeaking(false);
  }, []);

  // Auto-speak when stage changes
  useEffect(() => {
    speakText(stageTexts[currentStage], true);
    return () => stopSpeaking();
  }, [currentStage, stageTexts, speakText, stopSpeaking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  const nextStage = () => {
    setHasUserInteracted(true);
    if (currentStage < stages.length - 1) {
      stopSpeaking();
      setCurrentStage(prev => prev + 1);
    }
  };

  const prevStage = () => {
    setHasUserInteracted(true);
    if (currentStage > 0) {
      stopSpeaking();
      setCurrentStage(prev => prev - 1);
    }
  };

  const renderStageContent = () => {
    switch (currentStage) {
      case 0: // Welcome
        return (
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl text-center mb-4"
            >
              🔗
            </motion.div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/20 p-3 rounded-lg text-center">
                <Brain className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                <p className="text-sm font-medium">Control</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg text-center">
                <Heart className="w-8 h-8 mx-auto mb-2 text-red-300" />
                <p className="text-sm font-medium">Transport</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg text-center">
                <Wind className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                <p className="text-sm font-medium">Exchange</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 text-green-300" />
                <p className="text-sm font-medium">Process</p>
              </div>
            </div>
            
            <div className="text-center text-sm opacity-80">
              <p>Today: Deep dive into HOW systems work!</p>
            </div>
          </div>
        );

      case 1: // Control Systems
        return <ComparisonDemo />;

      case 2: // Oxygen Journey
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Follow the O₂!</h3>
              <button
                onClick={() => setIsOxygenPlaying(!isOxygenPlaying)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30"
              >
                {isOxygenPlaying ? '⏸️' : '▶️'}
              </button>
            </div>
            <OxygenPathwayDemo isPlaying={isOxygenPlaying} />
          </div>
        );

      case 3: // System Network
        return (
          <div className="space-y-3">
            <SystemNetwork 
              activeSystem={activeSystem} 
              onSelectSystem={setActiveSystem}
            />
            {activeSystem && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/20 p-3 rounded-lg text-center"
              >
                <p className="font-bold">
                  {systemInteractions.find(s => s.id === activeSystem)?.name}
                </p>
                <p className="text-sm opacity-80">
                  {systemInteractions.find(s => s.id === activeSystem)?.description}
                </p>
              </motion.div>
            )}
            <p className="text-xs text-center opacity-70">
              Tap a system to see its role. Heart connects them all!
            </p>
          </div>
        );

      case 4: // Exercise Response
        return <ExerciseResponseDemo />;

      default:
        return null;
    }
  };

  const renderHighlightedText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={index} className="font-bold text-yellow-300">
            {part.slice(2, -2)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${stages[currentStage].bgGradient} text-white p-4 pb-24`}>
      {/* Header */}
      <div className="text-center mb-4">
        <motion.h1 
          key={currentStage}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold"
        >
          {stages[currentStage].title}
        </motion.h1>
        <p className="text-sm opacity-80">{stages[currentStage].subtitle}</p>
      </div>

      {/* Stage progress */}
      <div className="flex justify-center gap-2 mb-4">
        {stages.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentStage ? 'bg-white w-6' : 'bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-[280px] mb-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {renderStageContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Speech text display */}
      <div className="relative z-20 mt-2 p-3 bg-black/30 backdrop-blur rounded-lg">
        <p className="text-sm leading-relaxed">
          {renderHighlightedText(stageTexts[currentStage])}
        </p>
      </div>

      {/* Controls */}
      <div className="relative z-20 flex justify-between items-center mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevStage}
          disabled={currentStage === 0}
          className="text-white hover:bg-white/20"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setHasUserInteracted(true);
              if (isSpeaking) {
                stopSpeaking();
              } else {
                speakText(stageTexts[currentStage]);
              }
            }}
            className="text-white hover:bg-white/20"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { 
              setHasUserInteracted(true);
              stopSpeaking(); 
              speakText(stageTexts[currentStage]); 
            }}
            className="text-white hover:bg-white/20"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {currentStage === stages.length - 1 ? (
          <Button
            size="sm"
            onClick={() => {
              stopSpeaking();
              onComplete?.();
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            <Play className="w-4 h-4 mr-1" />
            Start Lesson
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={nextStage}
            className="text-white hover:bg-white/20"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
