'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, Cloud, Sun, TreeDeciduous, Mountain, Waves,
  Play, Pause, Volume2, VolumeX, GraduationCap, 
  ChevronLeft, ChevronRight, ArrowDown, Wind
} from 'lucide-react';

interface LessonIntroProps {
  onComplete?: () => void;
}

interface WaterStage {
  id: string;
  name: string;
  icon: string;
  description: string;
  location: string;
  color: string;
}

const waterStages: WaterStage[] = [
  { 
    id: 'evaporation', 
    name: 'Evaporation', 
    icon: '☀️', 
    description: 'Sun heats water in oceans, lakes, and rivers. Water molecules gain energy and escape into the air as vapor.',
    location: 'Oceans, Lakes, Rivers',
    color: 'bg-orange-100'
  },
  { 
    id: 'transpiration', 
    name: 'Transpiration', 
    icon: '🌳', 
    description: 'Plants release water vapor through tiny pores (stomata) in their leaves. One large tree can release 200 liters daily!',
    location: 'Plants and Trees',
    color: 'bg-green-100'
  },
  { 
    id: 'condensation', 
    name: 'Condensation', 
    icon: '☁️', 
    description: 'Water vapor rises and cools. When it reaches the dew point, it transforms back into tiny water droplets, forming clouds.',
    location: 'Atmosphere',
    color: 'bg-blue-100'
  },
  { 
    id: 'precipitation', 
    name: 'Precipitation', 
    icon: '🌧️', 
    description: 'Cloud droplets combine and grow. When heavy enough, they fall as rain, drizzle, or in cold regions, snow and hail.',
    location: 'Falling from Clouds',
    color: 'bg-indigo-100'
  },
  { 
    id: 'infiltration', 
    name: 'Infiltration', 
    icon: '💧', 
    description: 'Some rainwater soaks into the ground, moving through soil to become groundwater that can stay underground for years.',
    location: 'Soil and Aquifers',
    color: 'bg-amber-100'
  },
  { 
    id: 'runoff', 
    name: 'Runoff', 
    icon: '🏞️', 
    description: 'Water that does not soak in flows over land into streams, rivers, and eventually back to the ocean. The cycle repeats!',
    location: 'Rivers and Streams',
    color: 'bg-cyan-100'
  }
];

const WaterCycleIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  
  // Interactive state
  const [waterStep, setWaterStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [sunIntensity, setSunIntensity] = useState(50);
  const [treeCount, setTreeCount] = useState(3);
  const [showRain, setShowRain] = useState(false);
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  const stages = [
    {
      title: "💧 The Water Cycle",
      content: "Earth's life support system",
      narration: "Water is essential for all life on Earth. Right now, the water in your body might have once been in a cloud over Kumasi, a river in the Volta Basin, or even a dinosaur millions of years ago! Water continuously cycles through our world in an endless journey called the hydrological cycle.",
      highlightWords: ['essential', 'life', 'cycles', 'journey', 'hydrological']
    },
    {
      title: "☀️ Evaporation & Transpiration",
      content: "Water rises to the sky",
      narration: "The sun is the engine of the water cycle. It heats water in oceans, lakes, and rivers, turning liquid water into invisible vapor that rises into the sky. Plants also release water vapor through their leaves in a process called transpiration. Ghana's forests are like giant humidifiers, adding moisture to our air!",
      highlightWords: ['sun', 'engine', 'vapor', 'transpiration', 'forests']
    },
    {
      title: "☁️ Condensation & Clouds",
      content: "Vapor becomes visible",
      narration: "As water vapor rises high into the atmosphere, it cools down. Cool air cannot hold as much moisture, so the vapor transforms back into tiny water droplets around dust particles. Billions of these droplets together form the clouds we see in the sky. When enough moisture gathers, rain is on the way!",
      highlightWords: ['cools', 'droplets', 'clouds', 'moisture', 'rain']
    },
    {
      title: "🌧️ Precipitation & Return",
      content: "Water falls back to Earth",
      narration: "When cloud droplets combine and grow too heavy, they fall as precipitation. In Ghana, this is usually rain since we're in the tropics. Some water soaks into the ground to become groundwater. The rest flows as runoff into streams and rivers, eventually returning to the ocean. And the cycle begins again!",
      highlightWords: ['precipitation', 'rain', 'groundwater', 'runoff', 'ocean']
    },
    {
      title: "🇬🇭 Water in Ghana",
      content: "Our precious resource",
      narration: "Ghana depends on the water cycle for agriculture, drinking water, and hydroelectric power at Akosombo Dam. Our rainy seasons from March to July and September to November are controlled by this cycle. But deforestation and climate change are disrupting it. Understanding the water cycle helps us protect this vital resource!",
      highlightWords: ['agriculture', 'Akosombo', 'rainy', 'deforestation', 'protect']
    }
  ];

  // Auto-advance water cycle animation
  useEffect(() => {
    if (stage === 1 || stage === 2 || stage === 3) {
      if (isAnimating) {
        const interval = setInterval(() => {
          setWaterStep((prev) => (prev + 1) % waterStages.length);
        }, 2500);
        return () => clearInterval(interval);
      }
    }
  }, [stage, isAnimating]);

  // Rain animation for stage 3
  useEffect(() => {
    if (stage === 3) {
      const timer = setTimeout(() => setShowRain(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowRain(false);
    }
  }, [stage]);

  // Speech synthesis
  const speakNarration = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis || isMuted) return;
    
    window.speechSynthesis.cancel();
    
    const narration = stages[stage].narration;
    const utterance = new SpeechSynthesisUtterance(narration);
    
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google'))
    ) || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    let wordIndex = 0;
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentWordIndex(wordIndex);
        wordIndex++;
      }
    };
    
    utterance.onstart = () => { setIsSpeaking(true); setIsPaused(false); };
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); setCurrentWordIndex(-1); };
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false); };
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [stage, isMuted, stages]);

  useEffect(() => {
    if (!hasSpokenRef.current.has(stage) && !isMuted) {
      const timer = setTimeout(() => {
        speakNarration();
        hasSpokenRef.current.add(stage);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stage, speakNarration, isMuted]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const togglePause = () => {
    if (!window.speechSynthesis) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const toggleMute = () => {
    if (!isMuted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
    hasSpokenRef.current.clear();
  };

  const handleStageChange = (newStage: number) => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setCurrentWordIndex(-1);
    setStage(newStage);
  };

  const renderHighlightedText = () => {
    const words = stages[stage].narration.split(' ');
    const highlightWords = stages[stage].highlightWords;
    
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?]/g, '').toLowerCase();
      const isHighlightWord = highlightWords.some(hw => cleanWord.includes(hw.toLowerCase()));
      const isCurrentWord = index === currentWordIndex;
      
      return (
        <span
          key={index}
          className={`transition-all duration-150 ${
            isCurrentWord 
              ? 'bg-blue-400/40 text-white font-semibold px-0.5 rounded' 
              : isHighlightWord 
                ? 'text-cyan-300 font-medium'
                : 'text-gray-300'
          }`}
        >
          {word}{' '}
        </span>
      );
    });
  };

  // Interactive Water Cycle Visualization
  const renderWaterCycle = () => (
    <div className="relative bg-gradient-to-b from-blue-900 via-blue-800 to-green-900 rounded-xl p-4 min-h-[220px] sm:min-h-[280px] overflow-hidden">
      {/* Sun */}
      <motion.div
        className="absolute top-2 right-4"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: sunIntensity / 100
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sun className="w-10 h-10 sm:w-14 sm:h-14 text-yellow-400" />
      </motion.div>

      {/* Clouds */}
      <motion.div
        className="absolute top-4 left-1/4"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Cloud className="w-12 h-12 sm:w-16 sm:h-16 text-white/90" />
      </motion.div>

      {/* Rain drops */}
      {showRain && (
        <div className="absolute top-16 left-1/4 w-16">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-blue-300"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 100, opacity: 0 }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.3,
                ease: "linear"
              }}
              style={{ left: `${i * 12}px` }}
            >
              💧
            </motion.div>
          ))}
        </div>
      )}

      {/* Mountains */}
      <div className="absolute bottom-12 left-0 right-0">
        <Mountain className="w-20 h-20 sm:w-28 sm:h-28 text-gray-600 absolute left-4" />
        <Mountain className="w-16 h-16 sm:w-24 sm:h-24 text-gray-700 absolute left-16" />
      </div>

      {/* Trees */}
      <div className="absolute bottom-8 left-1/3 flex gap-2">
        {[...Array(treeCount)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          >
            <TreeDeciduous className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
          </motion.div>
        ))}
      </div>

      {/* Evaporation arrows */}
      <motion.div
        className="absolute bottom-20 right-1/4"
        animate={{ y: [-5, -15, -5], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center text-cyan-300">
          <span className="text-xs">↑</span>
          <span className="text-xs">↑</span>
          <span className="text-xs">↑</span>
        </div>
      </motion.div>

      {/* Ocean */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-blue-600/80 rounded-b-xl flex items-center justify-center">
        <Waves className="w-6 h-6 text-blue-300 animate-pulse" />
        <span className="text-xs text-blue-200 ml-2">Ocean</span>
      </div>

      {/* Current process label */}
      <div className="absolute bottom-12 right-2 bg-black/50 rounded-lg px-2 py-1">
        <p className="text-[10px] sm:text-xs text-white">
          {waterStages[waterStep].name}
        </p>
      </div>
    </div>
  );

  // Interactive Demo: Sun & Evaporation
  const renderEvaporationDemo = () => (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-blue-900/30 rounded-xl p-3 sm:p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs sm:text-sm text-gray-300">Sun Intensity</span>
          <span className="text-xs font-mono text-yellow-400">{sunIntensity}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={sunIntensity}
          onChange={(e) => setSunIntensity(parseInt(e.target.value))}
          className="w-full h-2 bg-blue-900 rounded-lg appearance-none cursor-pointer accent-yellow-400"
        />
        <p className="text-xs text-gray-400 mt-2 text-center">
          {sunIntensity > 70 
            ? '☀️ High evaporation rate!' 
            : sunIntensity > 40 
            ? '🌤️ Moderate evaporation' 
            : '🌥️ Low evaporation'}
        </p>
      </div>

      <div className="bg-green-900/30 rounded-xl p-3 sm:p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs sm:text-sm text-gray-300">Trees (Transpiration)</span>
          <span className="text-xs font-mono text-green-400">{treeCount} trees</span>
        </div>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setTreeCount(n)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all ${
                n <= treeCount 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-500'
              }`}
            >
              🌳
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          {treeCount >= 4 
            ? '🌲 High transpiration - more clouds!' 
            : treeCount >= 2 
            ? '🌿 Moderate transpiration' 
            : '🏜️ Low transpiration - deforestation!'}
        </p>
      </div>
    </div>
  );

  // Water Cycle Process Selector
  const renderProcessSelector = () => (
    <div className="space-y-3">
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {waterStages.map((ws, index) => (
          <button
            key={ws.id}
            onClick={() => { setWaterStep(index); setIsAnimating(false); }}
            className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
              waterStep === index
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {ws.icon} <span className="hidden sm:inline">{ws.name}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={waterStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`${waterStages[waterStep].color} rounded-xl p-3 sm:p-4`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{waterStages[waterStep].icon}</span>
            <h4 className="font-bold text-gray-800">{waterStages[waterStep].name}</h4>
          </div>
          <p className="text-xs sm:text-sm text-gray-700">{waterStages[waterStep].description}</p>
          <p className="text-xs text-gray-500 mt-2">📍 {waterStages[waterStep].location}</p>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => setIsAnimating(!isAnimating)}
        className="w-full py-2 bg-cyan-900/50 text-cyan-300 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-cyan-900/70"
      >
        {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {isAnimating ? 'Pause Cycle' : 'Animate Cycle'}
      </button>
    </div>
  );

  // Ghana Water Facts
  const renderGhanaFacts = () => (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      <div className="bg-blue-900/40 rounded-lg p-2 sm:p-3 text-center border border-blue-700/50">
        <span className="text-xl sm:text-2xl">🌊</span>
        <p className="text-[10px] sm:text-xs text-blue-300 mt-1">Lake Volta</p>
        <p className="text-xs sm:text-sm text-white font-bold">8,500 km²</p>
        <p className="text-[10px] text-gray-400">World's largest artificial lake</p>
      </div>
      <div className="bg-green-900/40 rounded-lg p-2 sm:p-3 text-center border border-green-700/50">
        <span className="text-xl sm:text-2xl">🌧️</span>
        <p className="text-[10px] sm:text-xs text-green-300 mt-1">Annual Rainfall</p>
        <p className="text-xs sm:text-sm text-white font-bold">800-2000mm</p>
        <p className="text-[10px] text-gray-400">Varies by region</p>
      </div>
      <div className="bg-yellow-900/40 rounded-lg p-2 sm:p-3 text-center border border-yellow-700/50">
        <span className="text-xl sm:text-2xl">⚡</span>
        <p className="text-[10px] sm:text-xs text-yellow-300 mt-1">Akosombo Dam</p>
        <p className="text-xs sm:text-sm text-white font-bold">1,020 MW</p>
        <p className="text-[10px] text-gray-400">Hydroelectric power</p>
      </div>
      <div className="bg-red-900/40 rounded-lg p-2 sm:p-3 text-center border border-red-700/50">
        <span className="text-xl sm:text-2xl">🌳</span>
        <p className="text-[10px] sm:text-xs text-red-300 mt-1">Forest Loss</p>
        <p className="text-xs sm:text-sm text-white font-bold">1.7M ha</p>
        <p className="text-[10px] text-gray-400">Lost in 30 years</p>
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-900/30 via-gray-900 to-cyan-900/30 rounded-2xl p-4 sm:p-6 md:p-8 pb-24 sm:pb-28 overflow-hidden">
      {/* Floating water drops */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['💧', '☁️', '🌧️', '🌊', '💦'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0],
              x: [Math.random() * 100, Math.random() * 300],
              y: [Math.random() * 50, Math.random() * 200]
            }}
            transition={{ 
              duration: 4,
              delay: i * 1.2,
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.div 
        className="text-center mb-4 sm:mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
          <Droplets className="w-6 h-6 sm:w-10 sm:h-10 text-cyan-400" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            {stages[stage].title}
          </h2>
        </div>
        <p className="text-cyan-300 text-sm sm:text-lg">{stages[stage].content}</p>
      </motion.div>

      {/* Teacher Avatar & Controls */}
      <motion.div 
        className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-cyan-700/50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-start gap-2 sm:gap-4">
          <div className="flex-shrink-0">
            <motion.div 
              className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center ${
                isSpeaking && !isPaused ? 'ring-2 sm:ring-4 ring-cyan-400/50' : ''
              }`}
              animate={isSpeaking && !isPaused ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            </motion.div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-cyan-400 font-semibold text-sm sm:text-base">Ms. Abena</span>
              <div className="flex gap-1">
                <button 
                  onClick={togglePause}
                  disabled={!isSpeaking}
                  className="p-1 rounded-full bg-cyan-900/50 hover:bg-cyan-900 disabled:opacity-50"
                >
                  {isPaused ? <Play className="w-3 h-3 text-cyan-400" /> : <Pause className="w-3 h-3 text-cyan-400" />}
                </button>
                <button 
                  onClick={toggleMute}
                  className="p-1 rounded-full bg-cyan-900/50 hover:bg-cyan-900"
                >
                  {isMuted ? <VolumeX className="w-3 h-3 text-cyan-400" /> : <Volume2 className="w-3 h-3 text-cyan-400" />}
                </button>
              </div>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              {renderHighlightedText()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stage-specific content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {stage === 0 && (
            <>
              {renderWaterCycle()}
              <div className="mt-3 text-center">
                <p className="text-xs sm:text-sm text-gray-400">
                  ☀️ Sun powers the cycle → 💧 Water rises as vapor → ☁️ Forms clouds → 🌧️ Falls as rain → 🏞️ Returns to ocean
                </p>
              </div>
            </>
          )}
          {stage === 1 && (
            <>
              {renderWaterCycle()}
              <div className="mt-4">
                {renderEvaporationDemo()}
              </div>
            </>
          )}
          {stage === 2 && (
            <>
              {renderWaterCycle()}
              <div className="mt-4">
                {renderProcessSelector()}
              </div>
            </>
          )}
          {stage === 3 && (
            <>
              {renderWaterCycle()}
              <div className="mt-4">
                {renderProcessSelector()}
              </div>
            </>
          )}
          {stage === 4 && (
            <>
              {renderGhanaFacts()}
              <div className="mt-4 bg-cyan-900/30 rounded-xl p-3 sm:p-4 border border-cyan-700/50">
                <h4 className="text-cyan-400 font-semibold text-sm mb-2">🌍 Why It Matters</h4>
                <ul className="text-xs sm:text-sm text-gray-300 space-y-1">
                  <li>• Major rainy season: March - July</li>
                  <li>• Minor rainy season: September - November</li>
                  <li>• Northern Ghana: Only ONE rainy season</li>
                  <li>• Climate change: More unpredictable rainfall</li>
                </ul>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Key info cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6">
        <div className="bg-blue-900/50 rounded-lg p-2 sm:p-3 text-center border border-blue-700">
          <Cloud className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-blue-300 text-[10px] sm:text-sm">Atmosphere</p>
          <p className="text-white font-mono text-xs sm:text-base">~9 days</p>
        </div>
        <div className="bg-cyan-900/50 rounded-lg p-2 sm:p-3 text-center border border-cyan-700">
          <Waves className="w-4 h-4 sm:w-6 sm:h-6 text-cyan-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-cyan-300 text-[10px] sm:text-sm">Oceans</p>
          <p className="text-white font-mono text-xs sm:text-base">97.5%</p>
        </div>
        <div className="bg-green-900/50 rounded-lg p-2 sm:p-3 text-center border border-green-700">
          <Droplets className="w-4 h-4 sm:w-6 sm:h-6 text-green-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-green-300 text-[10px] sm:text-sm">Freshwater</p>
          <p className="text-white font-mono text-xs sm:text-base">2.5%</p>
        </div>
      </div>

      {/* Fixed Navigation - Mobile friendly */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/98 backdrop-blur-md px-4 sm:px-6 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:py-4 border-t border-gray-700/50 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex gap-1.5 sm:gap-2">
            {stages.map((_, i) => (
              <button
                key={i}
                onClick={() => handleStageChange(i)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
                  i === stage ? 'bg-cyan-400' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-2 sm:gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStageChange(stage - 1)}
              disabled={stage === 0}
              className={`p-2 sm:px-4 sm:py-2 rounded-lg font-medium text-sm sm:text-base transition-all ${
                stage === 0 
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <ChevronLeft className="w-5 h-5 sm:hidden" />
              <span className="hidden sm:inline">Back</span>
            </motion.button>
            
            {stage < stages.length - 1 ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStageChange(stage + 1)}
                className="p-2 sm:px-4 sm:py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  onComplete?.();
                }}
                className="p-2 sm:px-6 sm:py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Start!</span>
                <Play className="w-5 h-5 sm:w-4 sm:h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterCycleIntro;
