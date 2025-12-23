'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Sun, Leaf, Fish, Recycle, TrendingDown, Zap, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '@/hooks/useLocalization';
import { localizeString } from '@/lib/localization/content-localizer';
import type { CountryConfig } from '@/lib/localization/country-config';

interface LessonIntroProps {
  onComplete?: () => void;
}

const EcosystemsEnergyFlowIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const { country } = useLocalization();
  const [stage, setStage] = useState(0);
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  const stages = useMemo(() => [
    {
      title: "🌞 The Sun: Ultimate Energy Source",
      content: "Every ecosystem's energy story begins with the sun!",
      narration: country ? localizeString("Welcome to one of nature's most POWERFUL stories - the journey of ENERGY through ecosystems! Look up at the SUN right now - every second, it bathes {{country}} in massive amounts of SOLAR ENERGY. This energy powers EVERYTHING - the trees in our forests, grains in savannas, and aquatic life in our waters. Have you ever wondered why there are MORE GRASSHOPPERS than BIRDS in a field? Or why LIONS need HUGE TERRITORIES to survive? The answer lies in how energy flows through nature. Unlike nutrients that CYCLE, energy flows ONE-WAY: from the sun through living things and finally out as HEAT. Understanding this flow is the key to understanding why ecosystems look the way they do! Today, we'll discover why food chains can't be infinitely long, why protecting forests means protecting entire food webs, and why overfishing threatens aquatic ecosystems.", country as CountryConfig) : "Welcome to one of nature's most powerful stories - the journey of energy through ecosystems! Energy flows ONE-WAY from the sun through living things and finally out as HEAT.",
      highlightWords: ['energy', 'sun', 'solar energy', 'one-way', 'heat', 'grasshoppers', 'birds', 'lions']
    },
    {
      title: "🌱 Producers: Nature's Solar Panels",
      content: "Plants capture sunlight and convert it to chemical energy through photosynthesis!",
      narration: country ? localizeString("Everything starts with PRODUCERS - and in {{country}} we have AMAZING producers! Picture trees in forests or grains in fields. Their leaves are like SOLAR PANELS, capturing sunlight energy through PHOTOSYNTHESIS. Six carbon dioxide molecules plus six water molecules, powered by sunlight, create ONE GLUCOSE molecule plus oxygen. That glucose stores CHEMICAL ENERGY from sunlight! Producers include all GREEN PLANTS, ALGAE in rivers and lakes, and even microscopic PHYTOPLANKTON. They're called AUTOTROPHS because they make their OWN food - 'auto' means self, 'troph' means feeding. Without producers, NO ECOSYSTEM could exist! They're the FOUNDATION of every food chain and food web. Producers are literally LIFE CREATORS!", country as CountryConfig) : "Everything starts with PRODUCERS. Their leaves are like SOLAR PANELS capturing sunlight through PHOTOSYNTHESIS. Producers include all GREEN PLANTS, ALGAE, and PHYTOPLANKTON. They're called AUTOTROPHS because they make their OWN food.",
      highlightWords: ['producers', 'photosynthesis', 'solar panels', 'autotrophs', 'glucose', 'chemical energy', 'foundation', 'phytoplankton']
    },
    {
      title: "🍃 The 10% Rule: Why Energy Decreases",
      content: "Only about 10% of energy transfers between trophic levels!",
      narration: "Here comes the MOST IMPORTANT concept - the TEN PERCENT RULE! When a GRASSHOPPER eats grass, does it get ALL the energy from that grass? NO! The grasshopper only gets about TEN PERCENT. Where does the other NINETY PERCENT go? Some grass parts aren't EATEN - like roots and tough stems. Some eaten food isn't DIGESTED - it comes out as WASTE. And most importantly, the grasshopper uses lots of energy for MOVEMENT, BODY HEAT, BREATHING, and GROWTH. That energy becomes HEAT and disappears! Now a LIZARD eats the grasshopper - again, only TEN PERCENT of energy transfers. Then a SNAKE eats the lizard - ten percent again! Then an EAGLE eats the snake - ten percent! This is why we draw PYRAMIDS - each level has WAY LESS ENERGY than the level below. It's also why food chains rarely have more than FOUR or FIVE LEVELS. The math simply doesn't work for longer chains - there's not enough energy left!",
      highlightWords: ['ten percent', '10%', 'energy', 'heat', 'grasshopper', 'pyramids', 'trophic levels', 'waste', 'movement']
    },
    {
      title: "🔗 Food Chains: Linear Energy Pathways",
      content: "Food chains show WHO EATS WHOM in a straight line!",
      narration: country ? localizeString("A FOOD CHAIN shows a simple, LINEAR pathway of energy flow. Let's trace a {{country:adjective|uppercase=first}} ecosystem's food chain. In savanna regions: GRASS grows using sunlight. A GRASSHOPPER eats the grass - it's a PRIMARY CONSUMER or HERBIVORE. Then a LIZARD eats the grasshopper - it's a SECONDARY CONSUMER or CARNIVORE. Next, a SNAKE eats the lizard - it's a TERTIARY CONSUMER. Finally, an EAGLE eats the snake - it's a QUATERNARY CONSUMER or TOP PREDATOR. We write this as: Grass → Grasshopper → Lizard → Snake → Eagle. The ARROWS show energy flow direction - they mean 'is eaten by.' In aquatic systems, a food chain might be: Algae → Small fish → Larger fish → Aquatic birds. Food chains are simple to understand but they're OVERSIMPLIFIED - real ecosystems are much more COMPLEX!", country as CountryConfig) : "A FOOD CHAIN shows a simple, LINEAR pathway of energy flow. GRASS → GRASSHOPPER → LIZARD → SNAKE → EAGLE. The ARROWS show energy flow direction - they mean 'is eaten by.'",
      highlightWords: ['food chain', 'linear', 'pathway', 'grass', 'grasshopper', 'lizard', 'snake', 'eagle', 'arrows', 'primary consumer', 'herbivore']
    },
    {
      title: "🕸️ Food Webs: The Complex Reality",
      content: "Real ecosystems have interconnected food webs, not simple chains!",
      narration: country ? localizeString("In REAL LIFE, organisms don't eat just ONE thing - they have VARIED DIETS! Animals in {{country}} forests don't just eat one food source - they also eat insects, leaves, and other items. Predators don't just hunt one prey - they catch various animals. This creates a FOOD WEB - multiple interconnected food chains forming a COMPLEX NETWORK. Food webs have HUGE ADVANTAGES! They provide STABILITY - if one food source disappears, organisms can switch to ALTERNATIVES. But food webs also create VULNERABILITY - remove too many species, especially TOP PREDATORS or KEY PRODUCERS, and the whole web can COLLAPSE! This is why BIODIVERSITY matters. The more species in a web, the more RESILIENT the ecosystem. {{country}}'s food webs include OMNIVORES like humans who eat both plants and animals, making webs even more complex!", country as CountryConfig) : "In REAL LIFE, organisms have VARIED DIETS! This creates a FOOD WEB - multiple interconnected food chains. Food webs provide STABILITY but create VULNERABILITY if species are removed.",
      highlightWords: ['food web', 'interconnected', 'complex', 'stability', 'alternatives', 'collapse', 'biodiversity', 'resilient', 'omnivores']
    },
    {
      title: "♻️ Decomposers: The Essential Recyclers",
      content: "Decomposers break down dead matter and return nutrients to soil!",
      narration: country ? localizeString("Every living thing eventually DIES - so what happens to all that dead matter? Enter the DECOMPOSERS - BACTERIA and FUNGI that break down dead organisms and waste! They're the CLEANUP CREW of ecosystems. When a tree dies in the forest, decomposers break it down into simple molecules - CARBON, NITROGEN, PHOSPHORUS, MINERALS - which return to the SOIL for plants to use again. Without decomposers, dead bodies would pile up EVERYWHERE, nutrients would be LOCKED in corpses forever, and soil would become DEPLETED. Farmers in {{country}} know this - they use COMPOSTING to let decomposers turn farm waste into rich FERTILIZER! Decomposers are HETEROTROPHS like consumers, but instead of eating living things, they feed on DEAD ORGANIC MATTER. They're found everywhere - in soil, water, even inside your body helping digest food! Decomposers complete the NUTRIENT CYCLE, allowing life to continue. Remember: energy flows ONE-WAY and exits as heat, but nutrients CYCLE thanks to decomposers!", country as CountryConfig) : "Every living thing eventually DIES. DECOMPOSERS - BACTERIA and FUNGI - break down dead organisms. Without decomposers, nutrients would be locked in corpses forever. Decomposers complete the NUTRIENT CYCLE.",
      highlightWords: ['decomposers', 'bacteria', 'fungi', 'recyclers', 'nutrients', 'cycle', 'composting', 'fertilizer', 'dead', 'soil']
    }
  ], [country]);

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
              ? 'bg-yellow-400/40 text-white font-semibold px-0.5 rounded' 
              : isHighlightWord 
                ? 'text-yellow-300 font-medium'
                : 'text-gray-300'
          }`}
        >
          {word}{' '}
        </span>
      );
    });
  };

  const stageIcons = [Sun, Leaf, TrendingDown, Fish, Zap, Recycle];
  const StageIcon = stageIcons[stage] || Sun;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-yellow-900 via-orange-900 to-amber-900 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: 0 
            }}
            animate={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [0, 1, 0],
              rotate: 360
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            {['☀️', '🌱', '🐛', '🦎', '🐍', '🦅', '♻️'][i % 7]}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-yellow-800/50 to-orange-800/50 backdrop-blur-sm px-4 py-3 border-b border-yellow-700/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-yellow-400/30">
              <GraduationCap className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Ecosystems: Energy Flow & Food Chains</h1>
              <p className="text-sm text-yellow-200">Integrated Science SHS 3 • Interactive Voice Lesson</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={replayNarration}
              disabled={isSpeaking}
              className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors disabled:opacity-50"
              title="Replay narration"
            >
              <Play className="w-5 h-5 text-yellow-300" />
            </button>
            <button
              onClick={togglePause}
              disabled={!isSpeaking}
              className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors disabled:opacity-50"
              title={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? <Play className="w-5 h-5 text-yellow-300" /> : <Pause className="w-5 h-5 text-yellow-300" />}
            </button>
            <button
              onClick={toggleMute}
              className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-yellow-300" /> : <Volume2 className="w-5 h-5 text-yellow-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-[calc(100vh-140px)] overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Stage Title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-yellow-400/30">
                  <StageIcon className="w-8 h-8 text-yellow-300" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{stages[stage].title}</h2>
                  <p className="text-yellow-200 mt-1">{stages[stage].content}</p>
                </div>
              </div>

              {/* Narration Text */}
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-yellow-300 mb-1">Teacher's Narration</h3>
                    <p className="text-sm text-gray-400">
                      {isSpeaking ? '🔊 Speaking...' : isMuted ? '🔇 Muted' : '🎙️ Ready'}
                    </p>
                  </div>
                </div>
                <div className="text-lg leading-relaxed">
                  {renderNarrationText()}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-r from-yellow-800/80 to-orange-800/80 backdrop-blur-md px-4 py-4 border-t border-yellow-700/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => handleStageChange(Math.max(0, stage - 1))}
            disabled={stage === 0}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {stages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStageChange(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === stage 
                    ? 'bg-yellow-400 w-8' 
                    : index < stage
                      ? 'bg-yellow-600'
                      : 'bg-gray-600'
                }`}
                title={`Stage ${index + 1}`}
              />
            ))}
          </div>

          {stage === stages.length - 1 ? (
            <button
              onClick={onComplete}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-all shadow-lg"
            >
              Start Lesson
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => handleStageChange(Math.min(stages.length - 1, stage + 1))}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl font-medium transition-all shadow-lg"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EcosystemsEnergyFlowIntro;
