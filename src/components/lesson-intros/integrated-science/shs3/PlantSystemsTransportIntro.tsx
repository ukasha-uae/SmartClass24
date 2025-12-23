'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Droplets, Leaf, TreePine, ArrowUp, ArrowDown, Play, Pause, Volume2, VolumeX, GraduationCap, Sun, Waves, Factory, ChevronLeft, ChevronRight, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '@/hooks/useLocalization';
import { localizeString } from '@/lib/localization/content-localizer';
import type { CountryConfig } from '@/lib/localization/country-config';

interface LessonIntroProps {
  onComplete?: () => void;
}

const PlantSystemsTransportIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const { country } = useLocalization();
  const [stage, setStage] = useState(0);
  
  // Interactive state for demonstrations
  const [waterLevel, setWaterLevel] = useState(0);
  const [sugarDirection, setSugarDirection] = useState<'up' | 'down'>('down');
  const [transpirationRate, setTranspirationRate] = useState(50);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  // Xylem transport stages
  const xylemStages = [
    { name: 'Root Uptake', emoji: '🌱', color: 'bg-amber-700', desc: 'Water enters roots by osmosis' },
    { name: 'Root → Stem', emoji: '💧', color: 'bg-blue-600', desc: 'Water moves through xylem' },
    { name: 'Stem → Leaves', emoji: '🌿', color: 'bg-green-500', desc: 'Cohesion pulls water up' },
    { name: 'Transpiration', emoji: '💨', color: 'bg-sky-400', desc: 'Water evaporates from stomata' },
  ];

  // Phloem transport stages
  const phloemStages = [
    { name: 'Source (Leaf)', emoji: '🍃', color: 'bg-green-500', desc: 'Sugar made by photosynthesis' },
    { name: 'Loading', emoji: '📥', color: 'bg-yellow-500', desc: 'Sugar pumped into phloem' },
    { name: 'Transport', emoji: '🔄', color: 'bg-orange-500', desc: 'Pressure drives flow' },
    { name: 'Sink (Root/Fruit)', emoji: '🥕', color: 'bg-amber-600', desc: 'Sugar unloaded for use' },
  ];

  // Transpiration factors
  const transpirationFactors = [
    { factor: 'Temperature', high: '🌡️ High = More', low: '❄️ Low = Less', icon: '🌡️' },
    { factor: 'Humidity', high: '💧 High = Less', low: '🏜️ Low = More', icon: '💨' },
    { factor: 'Wind', high: '🌬️ High = More', low: '🍃 Low = Less', icon: '🌬️' },
    { factor: 'Light', high: '☀️ High = More', low: '🌙 Low = Less', icon: '💡' },
  ];

  const stages = [
    {
      title: "🌳 The Plant's Plumbing System!",
      content: "How do plants move water 100 meters up without a heart? Let's find out!",
      narration: country ? localizeString("Welcome to the amazing world of plant transport! Imagine you're standing next to a giant odum tree in {{country}}. That tree might be 50 meters tall, yet water from its roots reaches every single leaf at the top. How? Plants don't have hearts to pump like we do. Instead, they use two incredible transport tissues: XYLEM carries water UP from roots to leaves, and PHLOEM carries sugars from leaves to wherever the plant needs them. This is essential knowledge for {{country:adjective}} farmers - understanding how water and nutrients move helps grow better cocoa, maize, and cassava!", country as CountryConfig) : "Welcome to the amazing world of plant transport! Imagine you're standing next to a giant tree. Plants don't have hearts to pump like we do. Instead, they use two incredible transport tissues: XYLEM carries water UP from roots to leaves, and PHLOEM carries sugars from leaves to wherever the plant needs them. Understanding plant transport is essential for farmers.",
      highlightWords: ['transport', 'xylem', 'phloem', 'water', 'sugars', 'roots', 'leaves', 'farmers']
    },
    {
      title: "💧 Xylem: The Water Highway",
      content: "Watch water travel from roots to leaves! Click stages to follow the journey.",
      narration: "Let's follow a water molecule on its incredible journey! It starts in the soil, where ROOT HAIRS absorb it by OSMOSIS - water moves from where there's more to where there's less. The water enters XYLEM vessels - these are like tiny pipes made of dead cells stacked end-to-end. Why dead? Because hollow tubes let water flow faster! The xylem walls are reinforced with LIGNIN to prevent collapse. Now here's the magic: as water EVAPORATES from leaves through tiny holes called STOMATA, it creates a pulling force. Water molecules stick together through COHESION - so when one is pulled up, the whole column follows like a chain!",
      highlightWords: ['osmosis', 'root hairs', 'xylem', 'dead cells', 'lignin', 'stomata', 'cohesion', 'evaporates']
    },
    {
      title: "⬆️ Cohesion-Tension Theory",
      content: "The secret to moving water against gravity! Adjust transpiration to see the effect.",
      narration: "The COHESION-TENSION theory explains the impossible - lifting water higher than any pump could! Here's how: When water evaporates from leaves, it creates TENSION or negative pressure. This tension PULLS on the water below. But why doesn't the water column break? COHESION! Water molecules are attracted to each other through hydrogen bonds - they hold hands like a chain. And ADHESION makes water stick to the xylem walls, preventing backflow. The higher the transpiration rate, the stronger the pull. On hot, dry, windy days, trees actually get THINNER because the water column is under such tension! Try the slider to see how transpiration affects the pull.",
      highlightWords: ['cohesion-tension', 'tension', 'negative pressure', 'cohesion', 'hydrogen bonds', 'adhesion', 'transpiration']
    },
    {
      title: "🍬 Phloem: The Sugar Delivery",
      content: "Sugars move from where they're made to where they're needed. See the flow!",
      narration: "Now let's explore PHLOEM - the plant's food delivery system! Unlike xylem, phloem cells are ALIVE. Here's why: moving sugar requires ENERGY! The process is called TRANSLOCATION. SOURCES are places that make or release sugar - mainly leaves doing photosynthesis. SINKS are places that use or store sugar - growing roots, developing fruits, seeds. Sugar is actively LOADED into phloem at sources - this takes ATP energy from companion cells. The high sugar concentration draws water in by osmosis, creating HIGH PRESSURE. At sinks, sugar is unloaded, water leaves, creating LOW PRESSURE. Sugar flows from high to low pressure - like squeezing a tube of toothpaste!",
      highlightWords: ['phloem', 'alive', 'energy', 'translocation', 'sources', 'sinks', 'loaded', 'pressure']
    },
    {
      title: country ? localizeString("🌾 Transport & {{country:adjective|uppercase=first}} Agriculture", country as CountryConfig) : "🌾 Transport & Agriculture",
      content: country ? localizeString("Why this knowledge matters for {{country:adjective}} farmers and the environment.", country as CountryConfig) : "Why this knowledge matters for farmers and the environment.",
      narration: country ? localizeString("Why should {{country:adjective}} farmers care about plant transport? WATER MANAGEMENT is crucial - knowing that transpiration increases in hot, dry conditions helps farmers time irrigation. When it's very hot, plants lose water faster than roots can absorb it, causing WILTING. Understanding xylem helps explain why cutting stems underwater keeps flowers fresh - no air bubbles break the water chain! For CROP YIELDS, remember that fruits are SINKS. The more efficiently a plant translocates sugars to its cocoa pods, mangoes, or cassava roots, the bigger your harvest! Plant hormones can even redirect sugar flow. Finally, DROUGHT-RESISTANT crops have special adaptations - smaller leaves, sunken stomata, and waxy coatings all reduce water loss. This knowledge is POWER for food security in {{country}}!", country as CountryConfig) : "Why should farmers care about plant transport? Water management is crucial for crop yields. Understanding plant transport helps grow food more efficiently and sustainably.",
      highlightWords: ['irrigation', 'transpiration', 'wilting', 'crop yields', 'sinks', 'drought-resistant', 'food security']
    }
  ];

  // Auto-animate water rise
  useEffect(() => {
    if (stage === 1 && isAnimating) {
      const interval = setInterval(() => {
        setWaterLevel(prev => (prev + 1) % 4);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [stage, isAnimating]);

  // Speak the current stage narration
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
    if (isMuted) {
      setIsMuted(false);
    } else {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      setIsMuted(true);
    }
  };

  const replayNarration = () => {
    hasSpokenRef.current.delete(stage);
    speakNarration();
  };

  const handleStageChange = (newStage: number) => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setCurrentWordIndex(-1);
    setStage(newStage);
    // Reset demos
    setWaterLevel(0);
    setIsAnimating(false);
  };

  const renderNarrationText = () => {
    const words = stages[stage].narration.split(/\s+/);
    const highlightWords = stages[stage].highlightWords;
    
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:'"]/g, '').toLowerCase();
      const isHighlightWord = highlightWords.some(hw => 
        cleanWord.includes(hw.toLowerCase()) || hw.toLowerCase().includes(cleanWord)
      );
      const isCurrentWord = index === currentWordIndex;
      
      return (
        <span
          key={index}
          className={`transition-all duration-150 ${
            isCurrentWord 
              ? 'bg-blue-400/40 text-white font-semibold px-0.5 rounded' 
              : isHighlightWord 
                ? 'text-blue-300 font-medium'
                : 'text-gray-300'
          }`}
        >
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-900/30 via-gray-900 to-green-900/30 rounded-2xl p-4 sm:p-6 md:p-8 pb-24 sm:pb-28 overflow-hidden">
      {/* Floating water droplets */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['💧', '🌱', '🍃', '☀️', '💨'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              x: [Math.random() * 100, Math.random() * 300],
              y: [Math.random() * 50, Math.random() * 200]
            }}
            transition={{ 
              duration: 4,
              delay: i * 1.5,
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
          <Droplets className="w-6 h-6 sm:w-10 sm:h-10 text-blue-400" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Plant Transport
          </h2>
          <Leaf className="w-6 h-6 sm:w-10 sm:h-10 text-green-400" />
        </div>
        <p className="text-blue-200 text-sm sm:text-lg">Xylem, Phloem & How Plants Move Water</p>
      </motion.div>

      {/* Teacher Avatar & Narration */}
      <motion.div 
        className="bg-gradient-to-r from-blue-900/40 to-green-900/40 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-700/50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-start gap-2 sm:gap-4">
          <div className="flex-shrink-0">
            <motion.div 
              className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-green-600 flex items-center justify-center ${
                isSpeaking && !isPaused ? 'ring-2 sm:ring-4 ring-blue-400/50' : ''
              }`}
              animate={isSpeaking && !isPaused ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            </motion.div>
            <p className="text-center text-[10px] sm:text-xs text-blue-300 mt-1 hidden sm:block">Dr. Flora</p>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm leading-relaxed max-h-16 sm:max-h-24 overflow-y-auto pr-1 sm:pr-2">
              {renderNarrationText()}
            </div>
          </div>

          <div className="flex flex-col gap-1 sm:gap-2">
            {isSpeaking ? (
              <button onClick={togglePause} className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors" title={isPaused ? "Resume" : "Pause"}>
                {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
              </button>
            ) : (
              <button onClick={replayNarration} className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors" title="Play narration">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            )}
            <button
              onClick={toggleMute}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${isMuted ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-600 hover:bg-gray-500'}`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stage Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-gray-800/80 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h3 className="text-lg sm:text-2xl font-bold text-blue-400 mb-2 sm:mb-3">{stages[stage].title}</h3>
          <p className="text-gray-200 text-sm sm:text-lg mb-3 sm:mb-4">{stages[stage].content}</p>

          {/* Stage 1: Xylem Water Transport Demo */}
          {stage === 1 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-sky-900/50 to-amber-900/50 rounded-lg p-4 mb-4 relative">
                {/* Sun */}
                <div className="flex justify-center mb-2">
                  <Sun className="w-8 h-8 text-yellow-400" />
                </div>
                
                {/* Plant with water transport visualization */}
                <div className="flex justify-center items-end h-40 sm:h-48 relative">
                  {/* Tree silhouette */}
                  <div className="relative">
                    <TreePine className="w-24 h-32 sm:w-32 sm:h-40 text-green-600" />
                    
                    {/* Animated water droplets rising */}
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute left-1/2 transform -translate-x-1/2 text-blue-400"
                        initial={{ bottom: 0, opacity: 0 }}
                        animate={{ 
                          bottom: ['0%', '100%'],
                          opacity: [0, 1, 1, 0]
                        }}
                        transition={{
                          duration: 3,
                          delay: i * 0.6,
                          repeat: Infinity,
                        }}
                      >
                        💧
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Ground with roots */}
                <div className="h-8 bg-amber-800 rounded-b-lg -mx-4 -mb-4 mt-2 flex items-center justify-center">
                  <span className="text-amber-600 text-sm">🌱 Roots absorbing water</span>
                </div>
              </div>
              
              {/* Xylem stage indicators */}
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-3">
                {xylemStages.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setWaterLevel(i)}
                    className={`px-2 py-1 rounded text-xs sm:text-sm transition-colors ${
                      i === waterLevel ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {s.emoji} {s.name}
                  </button>
                ))}
              </div>
              <div className="bg-blue-900/30 rounded-lg p-3 text-center">
                <p className="text-blue-300 text-sm">
                  <strong>Current Stage:</strong> {xylemStages[waterLevel].desc}
                </p>
              </div>
              <div className="flex justify-center gap-2 mt-3">
                <button
                  onClick={() => setWaterLevel(prev => (prev + 1) % xylemStages.length)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium"
                >
                  Next Stage →
                </button>
                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${isAnimating ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}
                >
                  {isAnimating ? '⏹ Stop' : '▶ Auto-Play'}
                </button>
              </div>
            </div>
          )}

          {/* Stage 2: Cohesion-Tension Interactive */}
          {stage === 2 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-sky-900/30 to-blue-900/30 rounded-lg p-4 mb-4">
                {/* Transpiration visualization */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Sun className="w-10 h-10 text-yellow-400 mx-auto" />
                    </motion.div>
                    <p className="text-xs text-gray-400 mt-1">Heat drives evaporation</p>
                  </div>
                  
                  {/* Water column visualization */}
                  <div className="flex-1 mx-4">
                    <div className="h-24 bg-amber-900/50 rounded-lg relative overflow-hidden border-2 border-amber-700">
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 bg-blue-500/70"
                        animate={{ height: `${100 - transpirationRate}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">
                          Xylem Column
                        </span>
                      </div>
                      {/* Upward arrows showing tension */}
                      <motion.div
                        className="absolute top-2 left-1/2 transform -translate-x-1/2"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <ArrowUp className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-2xl"
                    >
                      💨
                    </motion.div>
                    <p className="text-xs text-gray-400 mt-1">Water vapor escapes</p>
                  </div>
                </div>
                
                {/* Transpiration rate slider */}
                <div className="mt-4">
                  <label className="text-sm text-gray-300 block mb-2">
                    Transpiration Rate: <span className="text-blue-400 font-bold">{transpirationRate}%</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={transpirationRate}
                    onChange={(e) => setTranspirationRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low (humid day)</span>
                    <span>High (hot, dry, windy)</span>
                  </div>
                </div>
              </div>
              
              <p className="text-center text-blue-400 text-sm">
                <strong>Higher transpiration = Stronger pull!</strong> The tension pulls the cohesive water column up.
              </p>
            </div>
          )}

          {/* Stage 3: Phloem Transport Demo */}
          {stage === 3 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-green-900/30 to-amber-900/30 rounded-lg p-4 mb-4">
                {/* Source to Sink visualization */}
                <div className="flex justify-between items-center gap-2">
                  {/* Source (Leaf) */}
                  <div className="text-center flex-1">
                    <motion.div
                      className="text-4xl sm:text-5xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🍃
                    </motion.div>
                    <p className="text-green-400 text-xs sm:text-sm font-bold mt-1">SOURCE</p>
                    <p className="text-gray-400 text-xs">Makes sugar</p>
                  </div>
                  
                  {/* Phloem tube with sugar flowing */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="h-20 w-8 bg-orange-900/50 rounded-full relative overflow-hidden border-2 border-orange-600">
                      {/* Animated sugar particles */}
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full"
                          animate={{
                            top: sugarDirection === 'down' ? ['0%', '100%'] : ['100%', '0%'],
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.5,
                            repeat: Infinity,
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-orange-400 text-xs mt-1">Phloem</p>
                  </div>
                  
                  {/* Sink (Root/Fruit) */}
                  <div className="text-center flex-1">
                    <motion.div
                      className="text-4xl sm:text-5xl"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      🥕
                    </motion.div>
                    <p className="text-amber-400 text-xs sm:text-sm font-bold mt-1">SINK</p>
                    <p className="text-gray-400 text-xs">Uses/stores sugar</p>
                  </div>
                </div>
                
                {/* Toggle direction */}
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    onClick={() => setSugarDirection('down')}
                    className={`px-3 py-1.5 rounded-lg text-sm ${sugarDirection === 'down' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    🍃 Leaf → 🥕 Root
                  </button>
                  <button
                    onClick={() => setSugarDirection('up')}
                    className={`px-3 py-1.5 rounded-lg text-sm ${sugarDirection === 'up' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  >
                    🌱 Seed → 🌿 Shoot
                  </button>
                </div>
              </div>
              
              {/* Phloem stage indicators */}
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-3">
                {phloemStages.map((s, i) => (
                  <div
                    key={i}
                    className={`px-2 py-1 rounded text-xs sm:text-sm ${s.color} text-white`}
                  >
                    {s.emoji} {s.name}
                  </div>
                ))}
              </div>
              <p className="text-center text-green-400 text-sm">
                <strong>Pressure Flow:</strong> Sugar creates osmotic pressure - flows from high (source) to low (sink)!
              </p>
            </div>
          )}

          {/* Stage 4: Applications in Ghana */}
          {stage === 4 && (
            <div className="mt-3 sm:mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-blue-900/50 rounded-lg p-3 border border-blue-700">
                  <Droplets className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mb-2" />
                  <h4 className="text-blue-300 font-bold text-sm sm:text-base">Water Management</h4>
                  <ul className="text-gray-300 text-xs sm:text-sm space-y-1 mt-2">
                    <li>• Irrigate before peak heat</li>
                    <li>• Mulch to reduce evaporation</li>
                    <li>• Plant windbreaks</li>
                  </ul>
                </div>
                <div className="bg-green-900/50 rounded-lg p-3 border border-green-700">
                  <Factory className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mb-2" />
                  <h4 className="text-green-300 font-bold text-sm sm:text-base">Crop Yields</h4>
                  <ul className="text-gray-300 text-xs sm:text-sm space-y-1 mt-2">
                    <li>• More leaves = more sugar</li>
                    <li>• Healthy phloem = bigger fruits</li>
                    <li>• Time harvests right</li>
                  </ul>
                </div>
                <div className="bg-amber-900/50 rounded-lg p-3 border border-amber-700">
                  <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 mb-2" />
                  <h4 className="text-amber-300 font-bold text-sm sm:text-base">Drought Resistance</h4>
                  <ul className="text-gray-300 text-xs sm:text-sm space-y-1 mt-2">
                    <li>• Deep roots reach water</li>
                    <li>• Small leaves lose less</li>
                    <li>• Waxy coatings help</li>
                  </ul>
                </div>
              </div>
              
              {/* Transpiration factors */}
              <div className="mt-4 bg-gray-900/50 rounded-lg p-3">
                <h4 className="text-white font-bold text-sm mb-2 text-center">🌡️ Factors Affecting Transpiration</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {transpirationFactors.map((f, i) => (
                    <div key={i} className="bg-gray-800 rounded p-2 text-center">
                      <span className="text-lg">{f.icon}</span>
                      <p className="text-gray-300 font-medium">{f.factor}</p>
                      <p className="text-green-400">{f.high}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Quick facts */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-blue-900/50 rounded-lg p-2 sm:p-3 text-center border border-blue-700">
          <ArrowUp className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-blue-300 text-[10px] sm:text-sm">Xylem</p>
          <p className="text-white font-mono text-xs sm:text-base">Water ↑</p>
        </div>
        <div className="bg-green-900/50 rounded-lg p-2 sm:p-3 text-center border border-green-700">
          <ArrowDown className="w-4 h-4 sm:w-6 sm:h-6 text-green-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-green-300 text-[10px] sm:text-sm">Phloem</p>
          <p className="text-white font-mono text-xs sm:text-base">Sugar ↕</p>
        </div>
        <div className="bg-amber-900/50 rounded-lg p-2 sm:p-3 text-center border border-amber-700">
          <Waves className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-amber-300 text-[10px] sm:text-sm">Cohesion</p>
          <p className="text-white font-mono text-xs sm:text-base">H-bonds</p>
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
                  i === stage ? 'bg-blue-400' : 'bg-gray-600 hover:bg-gray-500'
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
                className="p-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
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
                <span className="hidden sm:inline">Start Lesson!</span>
                <Sprout className="w-5 h-5 sm:w-4 sm:h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantSystemsTransportIntro;
