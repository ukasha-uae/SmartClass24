'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, Play, Pause, Volume2, VolumeX, 
  Leaf, Cloud, Factory, Droplets, Thermometer, RefreshCw
} from 'lucide-react';
import Image from 'next/image';
import { useEducationLevels } from '@/hooks/useEducationLevels';

interface NutrientCyclesNitrogenCarbonIntroProps {
  onComplete?: () => void;
}

interface NitrogenStage {
  id: string;
  name: string;
  icon: string;
  description: string;
  chemicalFormula: string;
  location: string;
  color: string;
}

interface CarbonReservoir {
  id: string;
  name: string;
  icon: string;
  amount: string;
  carbonType: string;
}

const nitrogenStages: NitrogenStage[] = [
  { 
    id: 'atmosphere', 
    name: 'Atmosphere', 
    icon: '🌫️', 
    description: 'N₂ gas makes up 78% of air but can\'t be used directly by most organisms',
    chemicalFormula: 'N₂',
    location: 'Air around us',
    color: 'bg-blue-100'
  },
  { 
    id: 'fixation', 
    name: 'Nitrogen Fixation', 
    icon: '⚡', 
    description: 'Bacteria in root nodules or lightning convert N₂ to ammonia',
    chemicalFormula: 'N₂ → NH₃',
    location: 'Root nodules, Soil, Lightning',
    color: 'bg-purple-100'
  },
  { 
    id: 'nitrification', 
    name: 'Nitrification', 
    icon: '🦠', 
    description: 'Soil bacteria convert ammonia to nitrates plants can absorb',
    chemicalFormula: 'NH₃ → NO₂⁻ → NO₃⁻',
    location: 'Soil (aerobic)',
    color: 'bg-amber-100'
  },
  { 
    id: 'assimilation', 
    name: 'Assimilation', 
    icon: '🌱', 
    description: 'Plants absorb nitrates and build proteins for growth',
    chemicalFormula: 'NO₃⁻ → Proteins',
    location: 'Plant roots & tissues',
    color: 'bg-green-100'
  },
  { 
    id: 'ammonification', 
    name: 'Ammonification', 
    icon: '🍂', 
    description: 'Decomposers break down dead organisms back to ammonia',
    chemicalFormula: 'Proteins → NH₃',
    location: 'Soil (dead matter)',
    color: 'bg-orange-100'
  },
  { 
    id: 'denitrification', 
    name: 'Denitrification', 
    icon: '💨', 
    description: 'Bacteria in waterlogged soil return nitrogen to atmosphere',
    chemicalFormula: 'NO₃⁻ → N₂',
    location: 'Waterlogged soil',
    color: 'bg-slate-100'
  }
];

const carbonReservoirs: CarbonReservoir[] = [
  { id: 'atmosphere', name: 'Atmosphere', icon: '☁️', amount: '850 billion tons', carbonType: 'CO₂ gas' },
  { id: 'oceans', name: 'Oceans', icon: '🌊', amount: '38,000 billion tons', carbonType: 'Dissolved CO₂' },
  { id: 'biosphere', name: 'Living Things', icon: '🌿', amount: '560 billion tons', carbonType: 'Organic molecules' },
  { id: 'soil', name: 'Soil', icon: '🪱', amount: '1,500 billion tons', carbonType: 'Humus' },
  { id: 'fossil', name: 'Fossil Fuels', icon: '⛽', amount: '4,000 billion tons', carbonType: 'Coal, Oil, Gas' }
];

const introStages = [
  {
    id: 1,
    title: "Nature's Recycling System",
    narration: "Imagine you are a nitrogen atom. Today you're part of a protein in a bean plant growing in Kumasi. Last year, you were floating in the atmosphere. Next month, you might be in someone's muscle! Nutrients like nitrogen and carbon continuously cycle through our world, making life possible.",
    type: 'overview'
  },
  {
    id: 2,
    title: "The Nitrogen Cycle",
    narration: "Although nitrogen gas makes up 78% of our atmosphere, most organisms cannot use it directly. Special bacteria fix nitrogen into forms plants can absorb. Watch how nitrogen travels through the ecosystem in an endless loop.",
    type: 'nitrogen-cycle'
  },
  {
    id: 3,
    title: "Carbon: The Element of Life",
    narration: "Carbon is found in every living thing. It cycles between the atmosphere, oceans, living organisms, and the Earth. Photosynthesis removes carbon dioxide from the air, while respiration returns it. Let's explore where carbon is stored on Earth.",
    type: 'carbon-reservoirs'
  },
  {
    id: 4,
    title: "Photosynthesis vs Respiration",
    narration: "Plants capture carbon dioxide through photosynthesis, storing carbon in sugars. All living things release carbon dioxide through cellular respiration. In a healthy ecosystem, these processes balance each other perfectly.",
    type: 'carbon-balance'
  },
  {
    id: 5,
    title: "Human Impact on Cycles",
    narration: "Human activities are disrupting these natural cycles. Burning fossil fuels releases carbon stored for millions of years. Excess fertilizers pollute waterways. Understanding these cycles helps us protect our environment for future generations.",
    type: 'human-impact'
  }
];

export default function NutrientCyclesNitrogenCarbonIntro({ onComplete }: NutrientCyclesNitrogenCarbonIntroProps) {
  const { labels: educationLabels } = useEducationLevels();
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
  const [nitrogenStep, setNitrogenStep] = useState(0);
  const [carbonView, setCarbonView] = useState<'reservoirs' | 'cycle'>('reservoirs');
  const [photosynthesisRate, setPhotosynthesisRate] = useState(50);
  const [respirationRate, setRespirationRate] = useState(50);
  const [humanImpact, setHumanImpact] = useState<'none' | 'fertilizer' | 'fossil'>('none');
  const [isNitrogenAnimating, setIsNitrogenAnimating] = useState(true);
  
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Speech synthesis for teacher narration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speakNarration = useCallback((text: string) => {
    if (!synthRef.current || isMuted) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    const words = text.split(' ');
    let wordIndex = 0;
    
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setHighlightedWordIndex(wordIndex);
        wordIndex++;
      }
    };
    
    utterance.onend = () => {
      setHighlightedWordIndex(-1);
    };
    
    speechRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [isMuted]);

  useEffect(() => {
    if (isPlaying && !isMuted) {
      speakNarration(introStages[currentStage].narration);
    } else if (!isPlaying && synthRef.current) {
      synthRef.current.cancel();
    }
  }, [currentStage, isPlaying, isMuted, speakNarration]);

  // Auto-advance nitrogen cycle animation
  useEffect(() => {
    if (currentStage === 1 && isNitrogenAnimating) {
      const interval = setInterval(() => {
        setNitrogenStep((prev) => (prev + 1) % nitrogenStages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [currentStage, isNitrogenAnimating]);

  const handleNext = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (currentStage < introStages.length - 1) {
      setCurrentStage((prev) => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (currentStage > 0) {
      setCurrentStage((prev) => prev - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying && synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const renderHighlightedText = (text: string) => {
    const words = text.split(' ');
    return (
      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
        {words.map((word, index) => (
          <span
            key={index}
            className={`transition-colors duration-200 ${
              index === highlightedWordIndex
                ? 'bg-green-200 text-green-900 font-semibold px-1 rounded'
                : ''
            }`}
          >
            {word}{' '}
          </span>
        ))}
      </p>
    );
  };

  // Interactive: Nitrogen Cycle Visualization
  const renderNitrogenCycle = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {nitrogenStages.map((stage, index) => (
          <motion.button
            key={stage.id}
            onClick={() => {
              setNitrogenStep(index);
              setIsNitrogenAnimating(false);
            }}
            className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              nitrogenStep === index
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-1">{stage.icon}</span>
            <span className="hidden sm:inline">{stage.name}</span>
          </motion.button>
        ))}
      </div>

      <div className="relative bg-gradient-to-b from-blue-50 to-green-50 rounded-xl p-4 sm:p-6 min-h-[200px] sm:min-h-[250px]">
        {/* Animated cycle visualization */}
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* Atmosphere layer */}
          <div className="flex items-center gap-2 text-blue-600">
            <Cloud className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm font-medium">Atmosphere (78% N₂)</span>
            <motion.div
              animate={nitrogenStep === 0 || nitrogenStep === 5 ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.5, repeat: nitrogenStep === 0 || nitrogenStep === 5 ? Infinity : 0 }}
              className="text-lg sm:text-xl"
            >
              🌫️
            </motion.div>
          </div>

          {/* Arrow down for fixation */}
          <motion.div
            animate={nitrogenStep === 1 ? { y: [0, 5, 0], opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1, repeat: nitrogenStep === 1 ? Infinity : 0 }}
            className="text-purple-500 text-lg sm:text-xl"
          >
            ⬇️ ⚡
          </motion.div>

          {/* Soil layer */}
          <div className="bg-amber-100 rounded-lg p-3 sm:p-4 w-full max-w-md">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">🦠</span>
                <span className="text-xs sm:text-sm text-amber-800">Soil Bacteria</span>
              </div>
              <motion.div
                animate={nitrogenStep === 2 || nitrogenStep === 4 ? { rotate: [0, 360] } : {}}
                transition={{ duration: 2, repeat: nitrogenStep === 2 || nitrogenStep === 4 ? Infinity : 0 }}
                className="text-amber-600"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
            </div>
          </div>

          {/* Plant */}
          <motion.div
            animate={nitrogenStep === 3 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: nitrogenStep === 3 ? Infinity : 0 }}
            className="flex items-center gap-2"
          >
            <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            <span className="text-xs sm:text-sm text-green-700">Plants absorb nitrates (NO₃⁻)</span>
          </motion.div>
        </div>

        {/* Current stage info card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={nitrogenStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`absolute bottom-2 right-2 left-2 sm:left-auto sm:w-64 ${nitrogenStages[nitrogenStep].color} rounded-lg p-3 shadow-md`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{nitrogenStages[nitrogenStep].icon}</span>
              <h4 className="font-semibold text-sm">{nitrogenStages[nitrogenStep].name}</h4>
            </div>
            <p className="text-xs text-gray-700">{nitrogenStages[nitrogenStep].description}</p>
            <div className="mt-2 text-xs font-mono bg-white/50 rounded px-2 py-1">
              {nitrogenStages[nitrogenStep].chemicalFormula}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setIsNitrogenAnimating(!isNitrogenAnimating)}
          className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
        >
          {isNitrogenAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isNitrogenAnimating ? 'Pause Animation' : 'Play Animation'}
        </button>
      </div>
    </div>
  );

  // Interactive: Carbon Reservoirs
  const renderCarbonReservoirs = () => (
    <div className="space-y-4">
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setCarbonView('reservoirs')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            carbonView === 'reservoirs'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Carbon Reservoirs
        </button>
        <button
          onClick={() => setCarbonView('cycle')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            carbonView === 'cycle'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          View Cycle
        </button>
      </div>

      {carbonView === 'reservoirs' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {carbonReservoirs.map((reservoir, index) => (
            <motion.div
              key={reservoir.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-3 sm:p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl sm:text-3xl mb-2 text-center">{reservoir.icon}</div>
              <h4 className="font-semibold text-xs sm:text-sm text-center text-gray-800">{reservoir.name}</h4>
              <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-1">{reservoir.carbonType}</p>
              <div className="mt-2 bg-gray-100 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, parseInt(reservoir.amount) / 400)}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                />
              </div>
              <p className="text-[10px] text-gray-600 text-center mt-1">{reservoir.amount}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-b from-blue-100 to-green-100 rounded-xl p-4 sm:p-6 text-center">
          <div className="text-4xl mb-2">☁️</div>
          <p className="text-xs sm:text-sm text-gray-700 mb-3">CO₂ in Atmosphere</p>
          
          <div className="flex justify-center gap-4 sm:gap-8">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <div className="text-3xl">🌳</div>
              <p className="text-xs text-green-700 mt-1">Photosynthesis</p>
              <p className="text-xs text-gray-500">↑ Removes CO₂</p>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="text-center"
            >
              <div className="text-3xl">🐄</div>
              <p className="text-xs text-amber-700 mt-1">Respiration</p>
              <p className="text-xs text-gray-500">↓ Releases CO₂</p>
            </motion.div>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-600">Oceans absorb 30% of CO₂</span>
          </div>
        </div>
      )}
    </div>
  );

  // Interactive: Carbon Balance Demo
  const renderCarbonBalance = () => {
    const balance = photosynthesisRate - respirationRate;
    const co2Level = 400 + (respirationRate - photosynthesisRate) * 2;
    
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-50 to-amber-50 rounded-xl p-4 sm:p-6">
          <h4 className="font-semibold text-sm sm:text-base mb-4 text-center">Balance Photosynthesis and Respiration</h4>
          
          {/* Photosynthesis slider */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm text-green-700 flex items-center gap-1">
                <Leaf className="w-4 h-4" /> Photosynthesis
              </span>
              <span className="text-xs font-mono bg-green-100 px-2 py-0.5 rounded">{photosynthesisRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={photosynthesisRate}
              onChange={(e) => setPhotosynthesisRate(parseInt(e.target.value))}
              className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
          </div>
          
          {/* Respiration slider */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm text-amber-700 flex items-center gap-1">
                <Thermometer className="w-4 h-4" /> Respiration
              </span>
              <span className="text-xs font-mono bg-amber-100 px-2 py-0.5 rounded">{respirationRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={respirationRate}
              onChange={(e) => setRespirationRate(parseInt(e.target.value))}
              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>
          
          {/* CO2 Level indicator */}
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-inner">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm text-gray-600">Atmospheric CO₂ Level</span>
              <span className={`text-sm font-bold ${
                co2Level < 380 ? 'text-green-600' : co2Level > 420 ? 'text-red-600' : 'text-amber-600'
              }`}>
                {Math.round(co2Level)} ppm
              </span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${Math.min(100, (co2Level / 600) * 100)}%` }}
                className={`h-full ${
                  co2Level < 380 ? 'bg-green-500' : co2Level > 420 ? 'bg-red-500' : 'bg-amber-500'
                }`}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {balance > 10 
                ? '🌿 Carbon being absorbed - ecosystem healthy!' 
                : balance < -10 
                ? '⚠️ More CO₂ being released than absorbed!' 
                : '⚖️ Carbon cycle is balanced'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Interactive: Human Impact Demo
  const renderHumanImpact = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <button
          onClick={() => setHumanImpact('none')}
          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            humanImpact === 'none'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🌿 Natural State
        </button>
        <button
          onClick={() => setHumanImpact('fertilizer')}
          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            humanImpact === 'fertilizer'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🧪 Excess Fertilizer
        </button>
        <button
          onClick={() => setHumanImpact('fossil')}
          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            humanImpact === 'fossil'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ⛽ Fossil Fuels
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={humanImpact}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`rounded-xl p-4 sm:p-6 ${
            humanImpact === 'none' 
              ? 'bg-gradient-to-b from-green-50 to-blue-50' 
              : humanImpact === 'fertilizer'
              ? 'bg-gradient-to-b from-amber-50 to-green-50'
              : 'bg-gradient-to-b from-gray-100 to-amber-50'
          }`}
        >
          {humanImpact === 'none' && (
            <div className="text-center">
              <div className="text-4xl sm:text-5xl mb-3">🌳🦋🐟</div>
              <h4 className="font-semibold text-green-800 mb-2">Balanced Ecosystem</h4>
              <p className="text-xs sm:text-sm text-gray-700">
                In natural ecosystems, nutrient cycles are balanced. Plants fix carbon, 
                decomposers recycle nutrients, and nitrogen cycles continuously.
              </p>
              <div className="mt-3 flex justify-center gap-4">
                <div className="text-center">
                  <div className="text-2xl">🌿</div>
                  <p className="text-xs text-gray-600">Clean Water</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl">☁️</div>
                  <p className="text-xs text-gray-600">Clean Air</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl">🦌</div>
                  <p className="text-xs text-gray-600">Healthy Wildlife</p>
                </div>
              </div>
            </div>
          )}

          {humanImpact === 'fertilizer' && (
            <div className="text-center">
              <div className="text-4xl sm:text-5xl mb-3">🚜🧪💧</div>
              <h4 className="font-semibold text-amber-800 mb-2">Fertilizer Runoff</h4>
              <p className="text-xs sm:text-sm text-gray-700 mb-3">
                Excess nitrogen fertilizer washes into rivers and lakes, causing algal blooms 
                that deplete oxygen and kill fish (eutrophication).
              </p>
              <div className="bg-white/70 rounded-lg p-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl mb-2"
                >
                  🟢
                </motion.div>
                <p className="text-xs text-amber-700">Algal Bloom forming</p>
                <p className="text-xs text-gray-500 mt-1">Fish dying from lack of oxygen</p>
              </div>
            </div>
          )}

          {humanImpact === 'fossil' && (
            <div className="text-center">
              <div className="text-4xl sm:text-5xl mb-3">🏭🚗💨</div>
              <h4 className="font-semibold text-red-800 mb-2">Fossil Fuel Emissions</h4>
              <p className="text-xs sm:text-sm text-gray-700 mb-3">
                Burning fossil fuels releases carbon stored for millions of years, plus nitrogen 
                oxides that cause acid rain and smog.
              </p>
              <div className="bg-white/70 rounded-lg p-3">
                <div className="flex justify-center gap-2 mb-2">
                  <motion.span
                    animate={{ y: [-5, -15, -5], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-2xl"
                  >
                    💨
                  </motion.span>
                  <motion.span
                    animate={{ y: [-5, -15, -5], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="text-2xl"
                  >
                    💨
                  </motion.span>
                </div>
                <p className="text-xs text-red-700">CO₂ levels: 420 ppm (was 280 ppm in 1800)</p>
                <p className="text-xs text-gray-500 mt-1">Global temperatures rising</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const renderStageContent = () => {
    switch (introStages[currentStage].type) {
      case 'nitrogen-cycle':
        return renderNitrogenCycle();
      case 'carbon-reservoirs':
        return renderCarbonReservoirs();
      case 'carbon-balance':
        return renderCarbonBalance();
      case 'human-impact':
        return renderHumanImpact();
      default:
        return (
          <div className="bg-gradient-to-br from-green-100 via-blue-50 to-amber-100 rounded-xl p-6 sm:p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl sm:text-6xl mb-4"
            >
              🔄
            </motion.div>
            <div className="flex justify-center gap-4 text-3xl sm:text-4xl mb-4">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                🌱
              </motion.span>
              <motion.span
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ☁️
              </motion.span>
              <motion.span
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                🦠
              </motion.span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              Nutrient Cycles: Nitrogen & Carbon
            </h3>
            <p className="text-sm text-gray-600">
              Discover how atoms cycle endlessly through ecosystems
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-amber-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm p-3 sm:p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Image
                src="/icons/teacher-avatar.png"
                alt="Teacher"
                width={40}
                height={40}
                className="rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <span className="text-xl sm:text-2xl">👨‍🏫</span>
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-bold text-gray-800">
                Nutrient Cycles
              </h1>
              <p className="text-xs text-gray-500">{educationLabels.shs} 2 • Integrated Science</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white/50 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-1 py-2">
            {introStages.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  index <= currentStage ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 pb-24 sm:pb-28">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Stage title */}
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-xs sm:text-sm text-green-600 font-medium">
              Stage {currentStage + 1} of {introStages.length}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-1">
              {introStages[currentStage].title}
            </h2>
          </motion.div>

          {/* Narration box */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-md">
            {renderHighlightedText(introStages[currentStage].narration)}
          </div>

          {/* Interactive content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {renderStageContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed Navigation - Mobile friendly */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md border-t border-gray-200 px-3 sm:px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:py-4 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentStage === 0}
            className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm transition-all ${
              currentStage === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex-1 flex justify-center">
            <div className="flex gap-1.5">
              {introStages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (synthRef.current) synthRef.current.cancel();
                    setCurrentStage(index);
                  }}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    index === currentStage
                      ? 'bg-green-500 scale-125'
                      : index < currentStage
                      ? 'bg-green-300'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium text-sm bg-green-600 text-white hover:bg-green-700 transition-all shadow-md"
          >
            <span>{currentStage === introStages.length - 1 ? 'Start Lesson' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
