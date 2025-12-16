'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart,
  Brain,
  Bone,
  Activity,
  Wind,
  Droplets,
  Shield,
  Dumbbell,
  Baby,
  Thermometer,
  Utensils,
  Volume2,
  VolumeX,
  RotateCcw,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Body system data
const bodySystems = [
  { id: 'integumentary', name: 'Integumentary', icon: '🧥', color: '#F5D0C5', function: 'Protection', organs: 'Skin, Hair, Nails' },
  { id: 'skeletal', name: 'Skeletal', icon: '🦴', color: '#E8E8E8', function: 'Support', organs: '206 Bones' },
  { id: 'muscular', name: 'Muscular', icon: '💪', color: '#D64545', function: 'Movement', organs: '~600 Muscles' },
  { id: 'nervous', name: 'Nervous', icon: '🧠', color: '#FFD700', function: 'Control', organs: 'Brain, Nerves' },
  { id: 'endocrine', name: 'Endocrine', icon: '🧪', color: '#9B59B6', function: 'Hormones', organs: 'Glands' },
  { id: 'cardiovascular', name: 'Cardiovascular', icon: '❤️', color: '#E74C3C', function: 'Transport', organs: 'Heart, Vessels' },
  { id: 'lymphatic', name: 'Lymphatic/Immune', icon: '🛡️', color: '#2ECC71', function: 'Defense', organs: 'Lymph Nodes' },
  { id: 'respiratory', name: 'Respiratory', icon: '🫁', color: '#87CEEB', function: 'Gas Exchange', organs: 'Lungs' },
  { id: 'digestive', name: 'Digestive', icon: '🍽️', color: '#F39C12', function: 'Nutrition', organs: 'Stomach, Intestines' },
  { id: 'urinary', name: 'Urinary', icon: '🚰', color: '#3498DB', function: 'Excretion', organs: 'Kidneys, Bladder' },
  { id: 'reproductive', name: 'Reproductive', icon: '👶', color: '#FF69B4', function: 'Reproduction', organs: 'Gonads' },
];

// Hierarchy of organization
const organizationLevels = [
  { level: 1, name: 'Chemical', example: 'Atoms, Molecules', icon: '⚛️' },
  { level: 2, name: 'Cellular', example: 'Cells', icon: '🔬' },
  { level: 3, name: 'Tissue', example: '4 Types', icon: '🧫' },
  { level: 4, name: 'Organ', example: 'Heart, Lungs', icon: '❤️' },
  { level: 5, name: 'Organ System', example: '11 Systems', icon: '🏥' },
  { level: 6, name: 'Organism', example: 'You!', icon: '🧍' },
];

// Interactive human body silhouette component
const HumanBodyDiagram: React.FC<{ selectedSystem: string | null; onSelectSystem: (id: string) => void }> = ({ 
  selectedSystem, 
  onSelectSystem 
}) => {
  return (
    <div className="relative w-48 h-72 mx-auto">
      {/* Body outline */}
      <svg viewBox="0 0 100 150" className="w-full h-full">
        {/* Head */}
        <ellipse cx="50" cy="15" rx="12" ry="14" fill="#FFE4C4" stroke="#333" strokeWidth="1" />
        {/* Neck */}
        <rect x="45" y="28" width="10" height="8" fill="#FFE4C4" stroke="#333" strokeWidth="1" />
        {/* Torso */}
        <path d="M30 36 L70 36 L72 90 L28 90 Z" fill="#FFE4C4" stroke="#333" strokeWidth="1" />
        {/* Arms */}
        <path d="M30 38 L15 70 L18 72 L32 42" fill="#FFE4C4" stroke="#333" strokeWidth="1" />
        <path d="M70 38 L85 70 L82 72 L68 42" fill="#FFE4C4" stroke="#333" strokeWidth="1" />
        {/* Legs */}
        <path d="M35 90 L32 140 L38 140 L42 90" fill="#FFE4C4" stroke="#333" strokeWidth="1" />
        <path d="M65 90 L68 140 L62 140 L58 90" fill="#FFE4C4" stroke="#333" strokeWidth="1" />
        
        {/* Clickable system areas */}
        {/* Brain - Nervous */}
        <circle 
          cx="50" cy="12" r="8" 
          fill={selectedSystem === 'nervous' ? '#FFD700' : 'transparent'} 
          fillOpacity="0.6"
          className="cursor-pointer hover:fill-yellow-300 hover:fill-opacity-40"
          onClick={() => onSelectSystem('nervous')}
        />
        {/* Heart - Cardiovascular */}
        <circle 
          cx="45" cy="50" r="6" 
          fill={selectedSystem === 'cardiovascular' ? '#E74C3C' : 'transparent'} 
          fillOpacity="0.6"
          className="cursor-pointer hover:fill-red-400 hover:fill-opacity-40"
          onClick={() => onSelectSystem('cardiovascular')}
        />
        {/* Lungs - Respiratory */}
        <ellipse 
          cx="50" cy="48" rx="15" ry="10" 
          fill={selectedSystem === 'respiratory' ? '#87CEEB' : 'transparent'} 
          fillOpacity="0.4"
          className="cursor-pointer hover:fill-blue-300 hover:fill-opacity-40"
          onClick={() => onSelectSystem('respiratory')}
        />
        {/* Stomach - Digestive */}
        <ellipse 
          cx="50" cy="68" rx="12" ry="8" 
          fill={selectedSystem === 'digestive' ? '#F39C12' : 'transparent'} 
          fillOpacity="0.6"
          className="cursor-pointer hover:fill-orange-400 hover:fill-opacity-40"
          onClick={() => onSelectSystem('digestive')}
        />
        {/* Kidneys - Urinary */}
        <ellipse 
          cx="40" cy="72" rx="4" ry="5" 
          fill={selectedSystem === 'urinary' ? '#3498DB' : 'transparent'} 
          fillOpacity="0.6"
          className="cursor-pointer hover:fill-blue-500 hover:fill-opacity-40"
          onClick={() => onSelectSystem('urinary')}
        />
        <ellipse 
          cx="60" cy="72" rx="4" ry="5" 
          fill={selectedSystem === 'urinary' ? '#3498DB' : 'transparent'} 
          fillOpacity="0.6"
          className="cursor-pointer hover:fill-blue-500 hover:fill-opacity-40"
          onClick={() => onSelectSystem('urinary')}
        />
      </svg>
    </div>
  );
};

// Homeostasis demo component
const HomeostasisDemo: React.FC = () => {
  const [temperature, setTemperature] = useState(37);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startDemo = () => {
    setIsRunning(true);
    // Simulate temperature fluctuation and regulation
    let temp = 37;
    let direction = 1;
    intervalRef.current = setInterval(() => {
      temp += direction * 0.2;
      if (temp > 38) direction = -1;
      if (temp < 36.5) direction = 1;
      setTemperature(parseFloat(temp.toFixed(1)));
    }, 500);
  };

  const stopDemo = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTemperature(37);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const getStatus = () => {
    if (temperature > 37.5) return { text: 'Too Hot! 🥵 Sweating...', color: 'text-red-500' };
    if (temperature < 36.5) return { text: 'Too Cold! 🥶 Shivering...', color: 'text-blue-500' };
    return { text: 'Normal ✅', color: 'text-green-500' };
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-950 dark:to-orange-950 rounded-xl p-4">
      <h4 className="font-bold text-center mb-3">🌡️ Temperature Homeostasis</h4>
      
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="text-center">
          <div className="text-4xl font-bold">{temperature}°C</div>
          <div className={`text-sm font-medium ${getStatus().color}`}>
            {getStatus().text}
          </div>
        </div>
        
        {/* Thermometer visual */}
        <div className="relative w-8 h-32 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute bottom-0 w-full rounded-full"
            style={{
              backgroundColor: temperature > 37.5 ? '#EF4444' : temperature < 36.5 ? '#3B82F6' : '#22C55E',
            }}
            animate={{
              height: `${((temperature - 35) / 5) * 100}%`
            }}
            transition={{ duration: 0.3 }}
          />
          {/* Scale marks */}
          <div className="absolute inset-0 flex flex-col justify-between py-1 px-1">
            <span className="text-[8px] text-gray-600">40°</span>
            <span className="text-[8px] text-gray-600">37°</span>
            <span className="text-[8px] text-gray-600">35°</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2">
        {!isRunning ? (
          <Button size="sm" onClick={startDemo} className="bg-green-600 hover:bg-green-700">
            ▶️ Start Demo
          </Button>
        ) : (
          <Button size="sm" variant="destructive" onClick={stopDemo}>
            ⏹️ Reset
          </Button>
        )}
      </div>

      <p className="text-xs text-center mt-3 text-muted-foreground">
        The body maintains ~37°C through negative feedback
      </p>
    </div>
  );
};

// Organization hierarchy visualization
const OrganizationPyramid: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState(0);

  return (
    <div className="space-y-2">
      <h4 className="font-bold text-center mb-3">📊 Levels of Organization</h4>
      {organizationLevels.map((level, index) => (
        <motion.div
          key={level.level}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
            activeLevel === index 
              ? 'bg-primary text-primary-foreground scale-105' 
              : 'bg-muted hover:bg-muted/80'
          }`}
          style={{ marginLeft: `${index * 8}px`, marginRight: `${(5 - index) * 8}px` }}
          onClick={() => setActiveLevel(index)}
        >
          <span className="text-xl">{level.icon}</span>
          <div className="flex-1">
            <div className="font-medium text-sm">{level.name}</div>
            <div className="text-xs opacity-80">{level.example}</div>
          </div>
          <span className="text-xs font-bold">L{level.level}</span>
        </motion.div>
      ))}
    </div>
  );
};

// Systems grid component
const SystemsGrid: React.FC<{ onSelectSystem: (id: string) => void }> = ({ onSelectSystem }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {bodySystems.map((system, index) => (
        <motion.div
          key={system.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="p-2 rounded-lg text-center cursor-pointer hover:scale-105 transition-transform"
          style={{ backgroundColor: `${system.color}30` }}
          onClick={() => onSelectSystem(system.id)}
        >
          <div className="text-2xl mb-1">{system.icon}</div>
          <div className="text-[10px] font-medium leading-tight">{system.name}</div>
          <div className="text-[8px] text-muted-foreground">{system.function}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Stage content definitions
const stages = [
  {
    id: 1,
    title: "Welcome to Human Body Systems!",
    subtitle: "Discover the Amazing Machine That Is YOU",
    bgGradient: "from-pink-500 via-red-500 to-orange-500"
  },
  {
    id: 2,
    title: "Levels of Organization",
    subtitle: "From Atoms to Organism",
    bgGradient: "from-purple-500 via-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "The 11 Body Systems",
    subtitle: "Working Together for Life",
    bgGradient: "from-green-500 via-teal-500 to-blue-500"
  },
  {
    id: 4,
    title: "Homeostasis",
    subtitle: "Maintaining Balance",
    bgGradient: "from-orange-500 via-red-500 to-pink-500"
  },
  {
    id: 5,
    title: "Explore the Body",
    subtitle: "Interactive Discovery",
    bgGradient: "from-indigo-500 via-purple-500 to-pink-500"
  }
];

interface HumanBodySystemsOverviewIntroProps {
  onComplete?: () => void;
}

export default function HumanBodySystemsOverviewIntro({ onComplete }: HumanBodySystemsOverviewIntroProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentWord, setCurrentWord] = useState(-1);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep stageTexts stable with useMemo
  const stageTexts = useMemo(() => [
    "Welcome to the fascinating world of Human Body Systems! Your body is made up of trillions of cells organized into eleven amazing systems. Each system has a special job, but they all work together to keep you alive and healthy. Let's explore how this incredible machine works!",
    "The human body is organized from simple to complex. It starts with tiny atoms and molecules, which form cells. Similar cells group together as tissues. Tissues combine to form organs. Organs work together as organ systems. And all systems together make you - the organism!",
    "There are eleven major body systems. The integumentary system is your skin. The skeletal system has 206 bones. The muscular system has about 600 muscles. The nervous and endocrine systems control everything. The cardiovascular system pumps blood. And there's more - respiratory, digestive, urinary, immune, and reproductive systems!",
    "Homeostasis means keeping your body balanced. Your body automatically regulates temperature, blood sugar, water levels, and more. When you're too hot, you sweat. When blood sugar rises, insulin is released. These negative feedback loops keep everything just right!",
    "Now it's your turn to explore! Click on different parts of the body diagram to learn about each system. Understanding your body helps you make better health decisions and prepares you for WASSCE Biology and healthcare careers!"
  ], []);

  // Chrome has a bug where speech stops after ~15 seconds
  // This workaround keeps it alive by pausing/resuming
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
    if (isAutoPlay && !hasUserInteracted) {
      return;
    }
    
    // Clear any existing timeouts
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    // Select a voice (prefer English)
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    const words = text.split(' ');
    let wordIndex = 0;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentWord(wordIndex);
        wordIndex++;
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentWord(-1);
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };

    utterance.onerror = (e) => {
      // Don't treat 'interrupted' as an error (happens on cancel)
      if (e.error !== 'interrupted') {
        console.error('Speech error:', e.error);
      }
      setIsSpeaking(false);
      setCurrentWord(-1);
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };

    speechRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
    
    // Start the keep-alive timer for Chrome
    resumeTimeoutRef.current = setTimeout(keepAlive, 10000);
  }, [keepAlive, hasUserInteracted]);

  const stopSpeaking = useCallback(() => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentWord(-1);
  }, []);

  const nextStage = () => {
    setHasUserInteracted(true);
    stopSpeaking();
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
    }
  };

  const prevStage = () => {
    setHasUserInteracted(true);
    stopSpeaking();
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  };

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  // Load voices on mount (needed for some browsers)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Trigger voice loading
      window.speechSynthesis.getVoices();
      
      // Some browsers need this event
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Auto-speak on stage change - only triggered by currentStage
  useEffect(() => {
    // Small delay to ensure component is ready
    const timer = setTimeout(() => {
      if (stageTexts[currentStage]) {
        speakText(stageTexts[currentStage], true); // true = isAutoPlay
      }
    }, 600);
    
    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStage]);

  const renderHighlightedText = (text: string) => {
    const words = text.split(' ');
    return words.map((word, index) => (
      <span
        key={index}
        className={`transition-colors duration-200 ${
          index === currentWord ? 'text-yellow-300 font-bold' : ''
        }`}
      >
        {word}{' '}
      </span>
    ));
  };

  const renderStageContent = () => {
    switch (currentStage) {
      case 0:
        return (
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="text-8xl mb-4"
            >
              🧬
            </motion.div>
            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
              {['❤️', '🧠', '🫁', '🦴', '💪', '🛡️', '🧪', '👶'].map((emoji, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-3xl"
                >
                  {emoji}
                </motion.span>
              ))}
            </div>
          </div>
        );
      
      case 1:
        return <OrganizationPyramid />;
      
      case 2:
        return <SystemsGrid onSelectSystem={setSelectedSystem} />;
      
      case 3:
        return <HomeostasisDemo />;
      
      case 4:
        return (
          <div className="space-y-3">
            <div className="flex justify-center">
              <HumanBodyDiagram 
                selectedSystem={selectedSystem} 
                onSelectSystem={setSelectedSystem} 
              />
            </div>
            {selectedSystem && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/20 backdrop-blur rounded-lg p-3 text-center max-w-xs mx-auto"
              >
                <div className="text-2xl mb-1">
                  {bodySystems.find(s => s.id === selectedSystem)?.icon}
                </div>
                <div className="font-bold">
                  {bodySystems.find(s => s.id === selectedSystem)?.name} System
                </div>
                <div className="text-sm opacity-90">
                  Function: {bodySystems.find(s => s.id === selectedSystem)?.function}
                </div>
                <div className="text-xs opacity-80">
                  {bodySystems.find(s => s.id === selectedSystem)?.organs}
                </div>
              </motion.div>
            )}
            {!selectedSystem && (
              <p className="text-center text-sm opacity-80">
                👆 Click on different body parts above to explore!
              </p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-[500px] rounded-2xl bg-gradient-to-br ${stages[currentStage].bgGradient} p-4 text-white relative overflow-hidden`}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-white/10"
            initial={{ x: Math.random() * 400, y: Math.random() * 400 }}
            animate={{
              x: Math.random() * 400,
              y: Math.random() * 400,
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-4">
        <motion.h2 
          key={currentStage}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-bold"
        >
          {stages[currentStage].title}
        </motion.h2>
        <motion.p
          key={`sub-${currentStage}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm opacity-90"
        >
          {stages[currentStage].subtitle}
        </motion.p>
      </div>

      {/* Stage progress */}
      <div className="flex justify-center gap-2 mb-4 relative z-10">
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
      <div className="relative z-10 min-h-[250px] mb-2">
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
