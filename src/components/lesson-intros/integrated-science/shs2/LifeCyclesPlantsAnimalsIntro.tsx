'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sprout, Bug, Droplets, Leaf, Repeat, Play, Pause, Volume2, VolumeX, GraduationCap, ArrowRight, Sun, TreeDeciduous, Egg, Baby, Bird, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonIntroProps {
  onComplete?: () => void;
}

const LifeCyclesPlantsAnimalsIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  
  // Interactive state for demonstrations
  const [plantStage, setPlantStage] = useState(0);
  const [butterflyStage, setButterflyStage] = useState(0);
  const [frogStage, setFrogStage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  // Plant stages data
  const plantStages = [
    { name: 'Seed', emoji: '🌱', color: 'bg-amber-700', desc: 'Dormant seed' },
    { name: 'Germination', emoji: '🌿', color: 'bg-green-600', desc: 'Root emerges' },
    { name: 'Growth', emoji: '🌾', color: 'bg-green-500', desc: 'Leaves & stem grow' },
    { name: 'Flowering', emoji: '🌸', color: 'bg-pink-500', desc: 'Flowers bloom' },
    { name: 'Fruiting', emoji: '🌽', color: 'bg-yellow-500', desc: 'Fruit/seeds form' },
  ];

  // Butterfly stages data
  const butterflyStages = [
    { name: 'Egg', emoji: '🥚', color: 'bg-amber-200', desc: 'Laid on leaf' },
    { name: 'Larva', emoji: '🐛', color: 'bg-green-400', desc: 'Caterpillar eats' },
    { name: 'Pupa', emoji: '🫛', color: 'bg-amber-600', desc: 'Chrysalis forms' },
    { name: 'Adult', emoji: '🦋', color: 'bg-purple-500', desc: 'Butterfly emerges' },
  ];

  // Frog stages data
  const frogStages = [
    { name: 'Eggs', emoji: '🫧', color: 'bg-gray-300', desc: 'Spawn in water' },
    { name: 'Tadpole', emoji: '🐟', color: 'bg-blue-400', desc: 'Gills & tail' },
    { name: 'Tadpole with Legs', emoji: '🦎', color: 'bg-green-400', desc: 'Legs growing' },
    { name: 'Froglet', emoji: '🐸', color: 'bg-green-500', desc: 'Tail shrinking' },
    { name: 'Adult Frog', emoji: '🐸', color: 'bg-green-600', desc: 'Lives on land' },
  ];

  const stages = [
    {
      title: "🔄 The Circle of Life!",
      content: "Every living thing goes through changes from birth to death - this is called a life cycle!",
      narration: "Welcome to the fascinating world of life cycles! Look around you - every plant, every animal, every insect follows a pattern of birth, growth, reproduction, and death. In Ghana, farmers use this knowledge daily! When you see maize growing in fields, butterflies in your garden, or tadpoles in a pond, you're witnessing life cycles in action. Understanding these patterns helps us grow better crops, control pests, and protect our environment. Let's explore how different organisms complete their amazing journeys of life!",
      highlightWords: ['life cycles', 'birth', 'growth', 'reproduction', 'death', 'farmers', 'Ghana']
    },
    {
      title: "🌱 Plant Life Cycles",
      content: "Watch a plant grow from seed to seed! Click 'Next Stage' to see each step.",
      narration: "Let's follow a maize plant through its entire life cycle! It begins as a tiny seed buried in Ghanaian soil. When conditions are right - moisture, warmth, and oxygen - the seed GERMINATES. A root pushes down while a shoot pushes up. During GROWTH, leaves unfold to capture sunlight and the stem grows taller. At MATURITY, FLOWERS appear - these contain the reproductive parts. After POLLINATION by wind, the ovules develop into seeds inside the cob. These new seeds can start the whole cycle again! Ghanaian farmers know that maize takes about four months from planting to harvest. Try clicking through each stage!",
      highlightWords: ['seed', 'germinates', 'growth', 'flowers', 'pollination', 'seeds', 'harvest']
    },
    {
      title: "🦋 Complete Metamorphosis",
      content: "Butterflies transform through FOUR completely different stages! Click to see each one.",
      narration: "Now witness the MAGIC of complete metamorphosis! A butterfly's life begins as a tiny EGG laid on a leaf. When it hatches, out comes a CATERPILLAR or larva - a hungry eating machine! The caterpillar eats and grows, shedding its skin several times. When fully grown, it attaches to a branch and forms a PUPA or chrysalis. Inside this case, the caterpillar's body completely reorganizes - it literally turns to soup and rebuilds! Finally, a beautiful ADULT BUTTERFLY emerges with wings. This complete transformation happens in many insects including mosquitoes, beetles, and bees. In pest control, we can target the vulnerable larva stage!",
      highlightWords: ['metamorphosis', 'egg', 'caterpillar', 'larva', 'pupa', 'chrysalis', 'butterfly', 'pest control']
    },
    {
      title: "🐸 Amphibian Life Cycles",
      content: "Frogs live in BOTH water and land! Watch the incredible transformation.",
      narration: "Frogs are AMPHIBIANS - they live double lives! The cycle starts when a female lays hundreds of jelly-covered EGGS in a pond. These hatch into TADPOLES, which look like tiny fish with tails and gills for breathing underwater. As weeks pass, amazing changes occur: back legs appear first, then front legs. The tail is gradually absorbed, gills are replaced by LUNGS, and the mouth widens. Finally, a young FROGLET hops onto land! Adult frogs return to water to breed, completing the cycle. In Ghana, frogs are important pest controllers - they eat thousands of mosquitoes! Their presence indicates a healthy environment.",
      highlightWords: ['amphibians', 'eggs', 'tadpoles', 'gills', 'legs', 'lungs', 'froglet', 'mosquitoes']
    },
    {
      title: "🌾 Life Cycles in Ghana",
      content: "How do farmers and scientists use this knowledge?",
      narration: "Why does understanding life cycles matter in Ghana? In AGRICULTURE, farmers time their planting with the rains because seeds need moisture to germinate. They know when cocoa trees flower and when to harvest cassava at peak maturity. In PEST MANAGEMENT, knowing that mosquito larvae live in standing water helps us drain breeding sites BEFORE they become biting adults. Understanding the armyworm life cycle helps farmers spray at the caterpillar stage when they're most vulnerable. In CONSERVATION, protecting sea turtles means protecting their nesting beaches during breeding season. Even traditional Ghanaian farming wisdom - like planting by the moon or rotating crops - reflects generations of life cycle observations. This knowledge is POWER for food security!",
      highlightWords: ['agriculture', 'germinate', 'pest management', 'larvae', 'conservation', 'food security']
    }
  ];

  // Auto-animate demo on stage 1 (plants)
  useEffect(() => {
    if (stage === 1 && isAnimating) {
      const interval = setInterval(() => {
        setPlantStage(prev => (prev + 1) % plantStages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [stage, isAnimating, plantStages.length]);

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
    setPlantStage(0);
    setButterflyStage(0);
    setFrogStage(0);
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
              ? 'bg-green-400/40 text-white font-semibold px-0.5 rounded' 
              : isHighlightWord 
                ? 'text-green-300 font-medium'
                : 'text-gray-300'
          }`}
        >
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-green-900/30 via-gray-900 to-blue-900/30 rounded-2xl p-4 sm:p-6 md:p-8 pb-24 sm:pb-28 overflow-hidden">
      {/* Floating nature elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🌱', '🦋', '🐸', '🌸', '🍃'].map((emoji, i) => (
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
          <Repeat className="w-6 h-6 sm:w-10 sm:h-10 text-green-400" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Life Cycles
          </h2>
          <Sprout className="w-6 h-6 sm:w-10 sm:h-10 text-green-300" />
        </div>
        <p className="text-green-200 text-sm sm:text-lg">Plants, Animals & Metamorphosis</p>
      </motion.div>

      {/* Teacher Avatar & Narration */}
      <motion.div 
        className="bg-gradient-to-r from-green-900/40 to-blue-900/40 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-green-700/50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-start gap-2 sm:gap-4">
          <div className="flex-shrink-0">
            <motion.div 
              className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center ${
                isSpeaking && !isPaused ? 'ring-2 sm:ring-4 ring-green-400/50' : ''
              }`}
              animate={isSpeaking && !isPaused ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            </motion.div>
            <p className="text-center text-[10px] sm:text-xs text-green-300 mt-1 hidden sm:block">Teacher</p>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm leading-relaxed max-h-16 sm:max-h-24 overflow-y-auto pr-1 sm:pr-2">
              {renderNarrationText()}
            </div>
          </div>

          <div className="flex flex-col gap-1 sm:gap-2">
            {isSpeaking ? (
              <button onClick={togglePause} className="p-1.5 sm:p-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors" title={isPaused ? "Resume" : "Pause"}>
                {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
              </button>
            ) : (
              <button onClick={replayNarration} className="p-1.5 sm:p-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors" title="Play narration">
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
          <h3 className="text-lg sm:text-2xl font-bold text-green-400 mb-2 sm:mb-3">{stages[stage].title}</h3>
          <p className="text-gray-200 text-sm sm:text-lg mb-3 sm:mb-4">{stages[stage].content}</p>

          {/* Stage 1: Plant Life Cycle Demo */}
          {stage === 1 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-sky-900/50 to-amber-900/50 rounded-lg p-4 mb-4">
                {/* Sun */}
                <div className="flex justify-center mb-2">
                  <Sun className="w-8 h-8 text-yellow-400" />
                </div>
                
                {/* Plant visualization */}
                <div className="flex justify-center items-end h-32 sm:h-40 relative">
                  <motion.div
                    className="flex flex-col items-center"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-5xl sm:text-7xl">{plantStages[plantStage].emoji}</span>
                    <motion.div 
                      className={`mt-2 px-3 py-1 rounded-full text-white text-xs sm:text-sm font-medium ${plantStages[plantStage].color}`}
                      key={plantStage}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      {plantStages[plantStage].name}
                    </motion.div>
                    <p className="text-gray-400 text-xs mt-1">{plantStages[plantStage].desc}</p>
                  </motion.div>
                </div>
                
                {/* Ground */}
                <div className="h-4 bg-amber-800 rounded-b-lg -mx-4 -mb-4 mt-2"></div>
              </div>
              
              {/* Stage indicators & controls */}
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-3">
                {plantStages.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setPlantStage(i)}
                    className={`px-2 py-1 rounded text-xs sm:text-sm transition-colors ${
                      i === plantStage ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {s.emoji} {s.name}
                  </button>
                ))}
              </div>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPlantStage(prev => (prev + 1) % plantStages.length)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white text-sm font-medium"
                >
                  Next Stage →
                </button>
                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${isAnimating ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                >
                  {isAnimating ? '⏹ Stop' : '▶ Auto-Play'}
                </button>
              </div>
            </div>
          )}

          {/* Stage 2: Butterfly Metamorphosis Demo */}
          {stage === 2 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-purple-900/30 to-green-900/30 rounded-lg p-4 mb-4">
                <div className="flex justify-center items-center h-32 sm:h-40">
                  <motion.div
                    className="text-center"
                    key={butterflyStage}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <span className="text-6xl sm:text-8xl block">{butterflyStages[butterflyStage].emoji}</span>
                    <motion.div 
                      className={`mt-3 px-4 py-1.5 rounded-full text-white font-medium ${butterflyStages[butterflyStage].color}`}
                    >
                      {butterflyStages[butterflyStage].name}
                    </motion.div>
                    <p className="text-gray-400 text-sm mt-1">{butterflyStages[butterflyStage].desc}</p>
                  </motion.div>
                </div>
              </div>
              
              {/* Cycle visualization */}
              <div className="flex justify-center items-center gap-1 sm:gap-2 mb-3 flex-wrap">
                {butterflyStages.map((s, i) => (
                  <React.Fragment key={i}>
                    <button
                      onClick={() => setButterflyStage(i)}
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl transition-all ${
                        i === butterflyStage 
                          ? 'ring-4 ring-purple-400 scale-110 bg-gray-700' 
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {s.emoji}
                    </button>
                    {i < butterflyStages.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-center text-green-400 text-sm">
                <strong>Complete Metamorphosis:</strong> 4 distinct stages with total body transformation!
              </p>
            </div>
          )}

          {/* Stage 3: Frog Life Cycle Demo */}
          {stage === 3 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-blue-900/50 to-green-900/50 rounded-lg p-4 mb-4 relative overflow-hidden">
                {/* Water effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-blue-500/20 rounded-b-lg"></div>
                
                <div className="flex justify-center items-center h-32 sm:h-40 relative z-10">
                  <motion.div
                    className="text-center"
                    key={frogStage}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <span className="text-6xl sm:text-8xl block">{frogStages[frogStage].emoji}</span>
                    <motion.div 
                      className={`mt-3 px-4 py-1.5 rounded-full text-white font-medium ${frogStages[frogStage].color}`}
                    >
                      {frogStages[frogStage].name}
                    </motion.div>
                    <p className="text-gray-400 text-sm mt-1">{frogStages[frogStage].desc}</p>
                  </motion.div>
                </div>
              </div>
              
              {/* Progress bar style navigation */}
              <div className="relative mb-4">
                <div className="flex justify-between items-center">
                  {frogStages.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setFrogStage(i)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl z-10 transition-all ${
                        i <= frogStage 
                          ? 'bg-green-600 scale-110' 
                          : 'bg-gray-700'
                      }`}
                    >
                      {s.emoji}
                    </button>
                  ))}
                </div>
                {/* Progress line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -z-0 transform -translate-y-1/2">
                  <motion.div 
                    className="h-full bg-green-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(frogStage / (frogStages.length - 1)) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-center text-blue-400 text-sm">
                <strong>Amphibian Life:</strong> Water → Land transition with complete body changes!
              </p>
            </div>
          )}

          {/* Stage 4: Applications */}
          {stage === 4 && (
            <div className="mt-3 sm:mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-green-900/50 rounded-lg p-3 border border-green-700">
                  <TreeDeciduous className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mb-2" />
                  <h4 className="text-green-300 font-bold text-sm sm:text-base">Agriculture</h4>
                  <ul className="text-gray-300 text-xs sm:text-sm space-y-1 mt-2">
                    <li>• Time planting with rains</li>
                    <li>• Know harvest periods</li>
                    <li>• Optimize fertilizer timing</li>
                  </ul>
                </div>
                <div className="bg-red-900/50 rounded-lg p-3 border border-red-700">
                  <Bug className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 mb-2" />
                  <h4 className="text-red-300 font-bold text-sm sm:text-base">Pest Control</h4>
                  <ul className="text-gray-300 text-xs sm:text-sm space-y-1 mt-2">
                    <li>• Target larvae stages</li>
                    <li>• Drain mosquito sites</li>
                    <li>• Break pest cycles</li>
                  </ul>
                </div>
                <div className="bg-blue-900/50 rounded-lg p-3 border border-blue-700">
                  <Bird className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mb-2" />
                  <h4 className="text-blue-300 font-bold text-sm sm:text-base">Conservation</h4>
                  <ul className="text-gray-300 text-xs sm:text-sm space-y-1 mt-2">
                    <li>• Protect breeding sites</li>
                    <li>• Time interventions</li>
                    <li>• Save endangered species</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Quick facts */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-green-900/50 rounded-lg p-2 sm:p-3 text-center border border-green-700">
          <Sprout className="w-4 h-4 sm:w-6 sm:h-6 text-green-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-green-300 text-[10px] sm:text-sm">Plants</p>
          <p className="text-white font-mono text-xs sm:text-base">5 Stages</p>
        </div>
        <div className="bg-purple-900/50 rounded-lg p-2 sm:p-3 text-center border border-purple-700">
          <Bug className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-purple-300 text-[10px] sm:text-sm">Insects</p>
          <p className="text-white font-mono text-xs sm:text-base">4 Stages</p>
        </div>
        <div className="bg-blue-900/50 rounded-lg p-2 sm:p-3 text-center border border-blue-700">
          <Droplets className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-blue-300 text-[10px] sm:text-sm">Frogs</p>
          <p className="text-white font-mono text-xs sm:text-base">5 Stages</p>
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
                  i === stage ? 'bg-green-400' : 'bg-gray-600 hover:bg-gray-500'
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
                className="p-2 sm:px-4 sm:py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
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
                <Sprout className="w-5 h-5 sm:w-4 sm:h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeCyclesPlantsAnimalsIntro;
