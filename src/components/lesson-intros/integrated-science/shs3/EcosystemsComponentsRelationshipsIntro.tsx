'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Leaf, TreePine, Bug, Fish, Sun, Droplets, Wind, Mountain, Users, Zap, Heart, Skull, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonIntroProps {
  onComplete?: () => void;
}

const EcosystemsComponentsRelationshipsIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  
  // Interactive state
  const [selectedEcosystem, setSelectedEcosystem] = useState<'rainforest' | 'savanna' | 'aquatic'>('rainforest');
  const [selectedRelationship, setSelectedRelationship] = useState<'competition' | 'predation' | 'mutualism' | 'parasitism'>('mutualism');
  const [populationSize, setPopulationSize] = useState(50);
  const [showPredators, setShowPredators] = useState(true);
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  // Ghana ecosystems
  const ecosystems = {
    rainforest: {
      name: '🌳 Rainforest',
      location: 'Southwest Ghana',
      biotic: ['🌴 Mahogany trees', '🐒 Monkeys', '🦋 Butterflies', '🦜 Parrots', '🍄 Fungi'],
      abiotic: ['☀️ High rainfall', '🌡️ Warm 25-28°C', '💧 High humidity', '🌱 Acidic soil'],
      color: 'from-green-900 to-green-700'
    },
    savanna: {
      name: '🌾 Savanna',
      location: 'Northern Ghana',
      biotic: ['🌳 Baobab trees', '🦌 Antelopes', '🦅 Eagles', '🐜 Termites', '🌿 Grasses'],
      abiotic: ['☀️ Distinct dry season', '🔥 Natural fires', '🌡️ Hot days', '🏜️ Low rainfall'],
      color: 'from-amber-900 to-yellow-700'
    },
    aquatic: {
      name: '🌊 Lake Volta',
      location: 'Eastern Ghana',
      biotic: ['🐟 Tilapia', '🦆 Water birds', '🌿 Water plants', '🦐 Crustaceans', '🐊 Crocodiles'],
      abiotic: ['💧 Fresh water', '☀️ Sunlight penetration', '🌡️ Water temperature', '🪨 Minerals'],
      color: 'from-blue-900 to-cyan-700'
    }
  };

  // Relationship examples
  const relationships = {
    mutualism: {
      icon: '🤝',
      name: 'Mutualism',
      desc: 'Both organisms benefit',
      example: 'Nitrogen-fixing bacteria + Legumes',
      benefit1: 'Bacteria get sugars',
      benefit2: 'Plant gets nitrogen',
      emoji1: '🦠',
      emoji2: '🌱',
      color: 'bg-green-600'
    },
    commensalism: {
      icon: '➕',
      name: 'Commensalism',
      desc: 'One benefits, other unaffected',
      example: 'Orchid + Tree',
      benefit1: 'Orchid gets support',
      benefit2: 'Tree unaffected',
      emoji1: '🌸',
      emoji2: '🌳',
      color: 'bg-yellow-600'
    },
    parasitism: {
      icon: '🦟',
      name: 'Parasitism',
      desc: 'One benefits, other harmed',
      example: 'Mosquito + Human',
      benefit1: 'Mosquito gets blood',
      benefit2: 'Human loses blood/gets disease',
      emoji1: '🦟',
      emoji2: '😷',
      color: 'bg-red-600'
    },
    predation: {
      icon: '🦅',
      name: 'Predation',
      desc: 'Predator eats prey',
      example: 'Hawk + Mouse',
      benefit1: 'Hawk gets food',
      benefit2: 'Mouse dies',
      emoji1: '🦅',
      emoji2: '🐭',
      color: 'bg-orange-600'
    },
    competition: {
      icon: '⚔️',
      name: 'Competition',
      desc: 'Both need same resource',
      example: 'Two plants for sunlight',
      benefit1: 'Winner gets resource',
      benefit2: 'Loser weakens/dies',
      emoji1: '🌱',
      emoji2: '🌱',
      color: 'bg-purple-600'
    }
  };

  const stages = [
    {
      title: "🌍 What is an Ecosystem?",
      content: "A community of living things interacting with their environment!",
      narration: "Welcome to the fascinating world of ecosystems! Imagine you're standing in Kakum Forest in Ghana's Central Region. Look around - you see towering trees, colorful butterflies, singing birds, and busy ants. You feel the warm humid air, see sunlight filtering through leaves, and stand on rich forest soil. All of this together - the living organisms AND their physical environment - is an ECOSYSTEM. An ecosystem is like a giant web where everything is connected. The trees need sunlight and soil. The butterflies need flowers. The birds need insects. And when organisms die, decomposers return nutrients to the soil for trees to use again. From a small puddle to Lake Volta, from your school garden to Mole National Park - ecosystems exist at every scale in Ghana!",
      highlightWords: ['ecosystem', 'living organisms', 'physical environment', 'connected', 'Kakum Forest', 'Lake Volta', 'Mole National Park']
    },
    {
      title: "🌱 Biotic vs Abiotic Components",
      content: "Ecosystems have living (biotic) and non-living (abiotic) parts. Explore Ghana's ecosystems!",
      narration: "Every ecosystem has two types of components. BIOTIC components are all the living things - that's PRODUCERS like plants that make their own food, CONSUMERS like animals that eat other organisms, and DECOMPOSERS like bacteria and fungi that break down dead matter. Then we have ABIOTIC components - the non-living factors like SUNLIGHT for photosynthesis, TEMPERATURE that affects metabolic rates, WATER that all life needs, and SOIL that provides nutrients and support. Ghana has amazing diversity! Our southwestern RAINFOREST has high rainfall and dense vegetation. The northern SAVANNA has scattered trees and a long dry season with natural fires. And LAKE VOLTA, one of the world's largest artificial lakes, supports rich aquatic life. Each ecosystem's unique combination of biotic and abiotic factors creates different habitats for different species.",
      highlightWords: ['biotic', 'abiotic', 'producers', 'consumers', 'decomposers', 'sunlight', 'temperature', 'water', 'soil', 'rainforest', 'savanna', 'Lake Volta']
    },
    {
      title: "🤝 Symbiosis: Living Together",
      content: "Some organisms form close relationships. See the different types!",
      narration: "SYMBIOSIS means two different species living closely together for a long time. There are three main types. MUTUALISM is beautiful - both organisms win! Like nitrogen-fixing BACTERIA in root nodules of beans and groundnuts. The bacteria get sugars from the plant, and the plant gets nitrogen converted from air - this is why Ghanaian farmers rotate legumes to enrich soil! COMMENSALISM is where one benefits and the other isn't affected. Picture an ORCHID growing on a tree branch - the orchid gets support and light, but the tree neither gains nor loses. Finally, PARASITISM is when one benefits but the other suffers. A TAPEWORM in someone's intestine steals nutrients, causing illness. Or mistletoe on tree branches - it looks pretty but it's stealing water and minerals! Understanding these relationships helps us manage crops, control pests, and appreciate nature's complexity.",
      highlightWords: ['symbiosis', 'mutualism', 'bacteria', 'nitrogen', 'commensalism', 'orchid', 'parasitism', 'tapeworm', 'mistletoe']
    },
    {
      title: "⚔️ Competition & Predation",
      content: "Organisms compete for resources and hunt each other. Balance is key!",
      narration: "Life isn't always cooperative - organisms also COMPETE and hunt each other! COMPETITION happens when organisms need the same limited resource. INTRASPECIFIC competition is within the same species - like male antelopes fighting for territory. This is MOST INTENSE because they need exactly the same things. INTERSPECIFIC competition is between different species - like different birds eating insects from the same tree. Often they avoid competing by specializing - one eats from high branches, another from low branches. Then there's PREDATION - the hawk hunting a mouse, the snake catching a frog, the spider trapping a fly. Predators CONTROL prey populations, preventing overgrazing. And prey evolve defenses - speed, camouflage, warning colors, armor. Predator and prey numbers actually CYCLE together: more prey means more food for predators, so predators increase, but then they eat so many prey that prey decrease, then predators starve and decrease, then prey recover. It's a natural dance that maintains ecosystem balance!",
      highlightWords: ['competition', 'intraspecific', 'interspecific', 'predation', 'control', 'cycle', 'balance', 'defenses']
    },
    {
      title: "📊 Population Dynamics",
      content: "What determines how many organisms can live in an ecosystem?",
      narration: "How many grasscutters can live in a forest? How many tilapia in Lake Volta? This is determined by CARRYING CAPACITY - the maximum population an environment can support. It depends on available FOOD, WATER, SPACE, and other resources. Populations don't grow forever - they face LIMITING FACTORS. Some are DENSITY-DEPENDENT - they get worse as population increases. Like DISEASE spreading faster in crowded conditions, or COMPETITION intensifying when there are too many individuals. Others are DENSITY-INDEPENDENT - they affect populations regardless of size. Like DROUGHTS, FLOODS, or FIRES - a drought hurts populations whether they're big or small. In Ghana, understanding population dynamics helps farmers manage livestock - if you put too many goats in a small area, they'll overgraze, compete for food, spread disease, and damage the land. But maintain populations within carrying capacity, and the ecosystem stays healthy and productive! This knowledge is crucial for SUSTAINABLE AGRICULTURE and CONSERVATION.",
      highlightWords: ['carrying capacity', 'limiting factors', 'density-dependent', 'density-independent', 'disease', 'competition', 'drought', 'sustainable', 'conservation']
    }
  ];

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
      {/* Floating nature emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🌳', '🦋', '🐝', '🌺', '☀️', '💧'].map((emoji, i) => (
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
              duration: 5,
              delay: i * 1.2,
              repeat: Infinity,
              repeatDelay: 3
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
          <TreePine className="w-6 h-6 sm:w-10 sm:h-10 text-green-400" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Ecosystems
          </h2>
          <Leaf className="w-6 h-6 sm:w-10 sm:h-10 text-green-400" />
        </div>
        <p className="text-green-200 text-sm sm:text-lg">Components, Relationships & Balance</p>
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
              className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center ${
                isSpeaking && !isPaused ? 'ring-2 sm:ring-4 ring-green-400/50' : ''
              }`}
              animate={isSpeaking && !isPaused ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            </motion.div>
            <p className="text-center text-[10px] sm:text-xs text-green-300 mt-1 hidden sm:block">Dr. Eco</p>
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

          {/* Stage 0: Introduction with ecosystem diagram */}
          {stage === 0 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-br from-green-900/50 to-blue-900/50 rounded-lg p-6 relative">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-5xl mb-2">🌳</div>
                    <p className="text-green-400 text-sm font-bold">Producers</p>
                    <p className="text-gray-400 text-xs">Make food</p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl mb-2">🦌</div>
                    <p className="text-blue-400 text-sm font-bold">Consumers</p>
                    <p className="text-gray-400 text-xs">Eat others</p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl mb-2">🍄</div>
                    <p className="text-purple-400 text-sm font-bold">Decomposers</p>
                    <p className="text-gray-400 text-xs">Break down</p>
                  </div>
                </div>
                
                {/* Circular flow diagram */}
                <div className="relative h-32 flex items-center justify-center">
                  <motion.div
                    className="absolute"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="relative w-32 h-32">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl">☀️</div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-2xl">🌱</div>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl">💧</div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl">🪨</div>
                    </div>
                  </motion.div>
                  <div className="text-white text-center z-10 bg-gray-900/80 px-3 py-1 rounded">
                    <p className="text-xs font-bold">Everything Connected!</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-900/30 rounded p-2">
                  <p className="text-green-400 font-bold">✅ Biotic (Living)</p>
                  <p className="text-gray-300">Plants, Animals, Bacteria</p>
                </div>
                <div className="bg-blue-900/30 rounded p-2">
                  <p className="text-blue-400 font-bold">✅ Abiotic (Non-living)</p>
                  <p className="text-gray-300">Sun, Water, Soil, Air</p>
                </div>
              </div>
            </div>
          )}

          {/* Stage 1: Ghana Ecosystems Explorer */}
          {stage === 1 && (
            <div className="mt-3 sm:mt-4">
              <div className="flex justify-center gap-2 mb-4">
                {Object.entries(ecosystems).map(([key, eco]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedEcosystem(key as any)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedEcosystem === key ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {eco.name.split(' ')[0]}
                  </button>
                ))}
              </div>
              
              <motion.div
                key={selectedEcosystem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br ${ecosystems[selectedEcosystem].color} rounded-lg p-4`}
              >
                <h4 className="text-white text-xl font-bold mb-1">{ecosystems[selectedEcosystem].name}</h4>
                <p className="text-gray-200 text-sm mb-4">{ecosystems[selectedEcosystem].location}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-green-300 font-bold text-sm mb-2">🌱 Biotic Components:</p>
                    <ul className="space-y-1">
                      {ecosystems[selectedEcosystem].biotic.map((item, i) => (
                        <li key={i} className="text-white text-xs">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-blue-300 font-bold text-sm mb-2">🌍 Abiotic Components:</p>
                    <ul className="space-y-1">
                      {ecosystems[selectedEcosystem].abiotic.map((item, i) => (
                        <li key={i} className="text-white text-xs">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Stage 2: Symbiosis Relationships */}
          {stage === 2 && (
            <div className="mt-3 sm:mt-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {Object.entries(relationships).filter(([key]) => ['mutualism', 'commensalism', 'parasitism'].includes(key)).map(([key, rel]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedRelationship(key as any)}
                    className={`p-2 rounded-lg text-center transition-colors ${
                      selectedRelationship === key ? rel.color + ' text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{rel.icon}</div>
                    <p className="text-xs font-bold">{rel.name}</p>
                  </button>
                ))}
              </div>
              
              <motion.div
                key={selectedRelationship}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${relationships[selectedRelationship].color} rounded-lg p-4 text-white`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center flex-1">
                    <div className="text-5xl mb-2">{relationships[selectedRelationship].emoji1}</div>
                    <p className="text-sm">{relationships[selectedRelationship].benefit1}</p>
                  </div>
                  
                  <div className="text-4xl px-4">{relationships[selectedRelationship].icon}</div>
                  
                  <div className="text-center flex-1">
                    <div className="text-5xl mb-2">{relationships[selectedRelationship].emoji2}</div>
                    <p className="text-sm">{relationships[selectedRelationship].benefit2}</p>
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-lg p-3">
                  <p className="font-bold text-center mb-1">Example: {relationships[selectedRelationship].example}</p>
                  <p className="text-sm text-center">{relationships[selectedRelationship].desc}</p>
                </div>
              </motion.div>
            </div>
          )}

          {/* Stage 3: Competition & Predation */}
          {stage === 3 && (
            <div className="mt-3 sm:mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Competition */}
                <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">⚔️</span>
                    <h4 className="text-purple-300 font-bold">Competition</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="bg-purple-800/30 rounded p-2">
                      <p className="text-purple-200 font-bold">Intraspecific</p>
                      <p className="text-gray-300 text-xs">Same species: 🦌 vs 🦌</p>
                      <p className="text-gray-400 text-xs">Most intense!</p>
                    </div>
                    <div className="bg-purple-800/30 rounded p-2">
                      <p className="text-purple-200 font-bold">Interspecific</p>
                      <p className="text-gray-300 text-xs">Different species: 🦌 vs 🐐</p>
                      <p className="text-gray-400 text-xs">Less intense</p>
                    </div>
                  </div>
                </div>
                
                {/* Predation */}
                <div className="bg-orange-900/50 rounded-lg p-4 border border-orange-700">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">🦅</span>
                    <h4 className="text-orange-300 font-bold">Predation</h4>
                  </div>
                  <div className="relative h-32">
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2 text-4xl"
                      animate={{ y: [0, 60, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🦅
                    </motion.div>
                    <motion.div
                      className="absolute bottom-0 left-1/4 text-3xl"
                      animate={{ x: [0, 20, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      🐭
                    </motion.div>
                    <motion.div
                      className="absolute bottom-0 right-1/4 text-3xl"
                      animate={{ x: [0, -20, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      🐭
                    </motion.div>
                  </div>
                  <p className="text-orange-200 text-xs text-center mt-2">Predators control prey population</p>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-900/50 rounded-lg p-3">
                <p className="text-white text-sm text-center">
                  <strong>Both maintain ecosystem balance!</strong> Competition prevents dominance, predation prevents overpopulation.
                </p>
              </div>
            </div>
          )}

          {/* Stage 4: Population Dynamics */}
          {stage === 4 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-br from-cyan-900/50 to-purple-900/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-bold">Prey Population Size</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">Show Predators:</span>
                    <button
                      onClick={() => setShowPredators(!showPredators)}
                      className={`px-3 py-1 rounded text-xs font-bold ${showPredators ? 'bg-red-600' : 'bg-gray-600'}`}
                    >
                      {showPredators ? '🦅 ON' : 'OFF'}
                    </button>
                  </div>
                </div>
                
                {/* Visual representation of population */}
                <div className="bg-green-900/30 rounded-lg p-4 mb-3 min-h-32 flex flex-wrap gap-1 items-center justify-center">
                  {[...Array(Math.floor(populationSize / 2))].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-lg"
                    >
                      🐭
                    </motion.span>
                  ))}
                </div>
                
                {/* Population slider */}
                <div className="mb-3">
                  <label className="text-sm text-gray-300 block mb-2">
                    Population: <span className="text-cyan-400 font-bold">{populationSize} mice</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={populationSize}
                    onChange={(e) => setPopulationSize(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
                
                {/* Carrying capacity indicator */}
                <div className="bg-yellow-900/30 border border-yellow-700 rounded p-2">
                  <p className="text-yellow-300 text-xs text-center">
                    <strong>Carrying Capacity (K): 80</strong><br />
                    {populationSize > 80 ? '⚠️ Overpopulation! Resources scarce, disease spreads!' :
                     populationSize < 40 ? '✅ Plenty of resources, population can grow' :
                     '✅ Near carrying capacity, balanced!'}
                  </p>
                </div>
              </div>
              
              {/* Limiting factors */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-red-900/30 rounded p-2 border border-red-700">
                  <p className="text-red-300 font-bold mb-1">Density-Dependent</p>
                  <ul className="text-gray-300 space-y-1">
                    <li>🦠 Disease</li>
                    <li>⚔️ Competition</li>
                    <li>🦅 Predation</li>
                  </ul>
                  <p className="text-red-400 text-xs mt-1">Worse when crowded</p>
                </div>
                <div className="bg-blue-900/30 rounded p-2 border border-blue-700">
                  <p className="text-blue-300 font-bold mb-1">Density-Independent</p>
                  <ul className="text-gray-300 space-y-1">
                    <li>🌊 Floods</li>
                    <li>🔥 Fires</li>
                    <li>🏜️ Droughts</li>
                  </ul>
                  <p className="text-blue-400 text-xs mt-1">Affects all equally</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Quick facts */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-green-900/50 rounded-lg p-2 sm:p-3 text-center border border-green-700">
          <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-green-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-green-300 text-[10px] sm:text-sm">Mutualism</p>
          <p className="text-white font-mono text-xs sm:text-base">+/+</p>
        </div>
        <div className="bg-purple-900/50 rounded-lg p-2 sm:p-3 text-center border border-purple-700">
          <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-purple-300 text-[10px] sm:text-sm">Competition</p>
          <p className="text-white font-mono text-xs sm:text-base">-/-</p>
        </div>
        <div className="bg-orange-900/50 rounded-lg p-2 sm:p-3 text-center border border-orange-700">
          <Skull className="w-4 h-4 sm:w-6 sm:h-6 text-orange-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-orange-300 text-[10px] sm:text-sm">Predation</p>
          <p className="text-white font-mono text-xs sm:text-base">+/-</p>
        </div>
      </div>

      {/* Fixed Navigation */}
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
                <span className="hidden sm:inline">Start Lesson!</span>
                <Leaf className="w-5 h-5 sm:w-4 sm:h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcosystemsComponentsRelationshipsIntro;
