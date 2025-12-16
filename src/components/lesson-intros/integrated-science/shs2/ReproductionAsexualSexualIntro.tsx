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
  Dna,
  Users,
  Zap,
  Leaf,
  Binary,
  Copy,
  Shuffle,
  Heart
} from 'lucide-react';

interface ReproductionAsexualSexualIntroProps {
  onComplete?: () => void;
}

// Interactive Binary Fission Animation
const BinaryFissionDemo: React.FC = () => {
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    if (isPlaying && stage < 4) {
      const timer = setTimeout(() => setStage(s => s + 1), 1200);
      return () => clearTimeout(timer);
    } else if (stage >= 4) {
      setIsPlaying(false);
    }
  }, [isPlaying, stage]);
  
  const stageLabels = [
    'Parent cell with DNA',
    'DNA replication',
    'Cell elongates',
    'Cell divides',
    'Two identical cells!'
  ];
  
  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 rounded-xl p-4 border border-indigo-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Binary className="w-5 h-5 text-indigo-400" />
        <h4 className="text-white font-medium">Binary Fission</h4>
      </div>
      
      {/* Animation Area */}
      <div className="relative h-32 bg-black/30 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.div
              key="stage0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-8 bg-purple-400 rounded-full" />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-blue-300">DNA</span>
            </motion.div>
          )}
          
          {stage === 1 && (
            <motion.div
              key="stage1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center gap-1">
                <motion.div 
                  className="w-4 h-8 bg-purple-400 rounded-full"
                  animate={{ x: -3 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div 
                  className="w-4 h-8 bg-purple-300 rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, x: 3 }}
                  transition={{ delay: 0.3 }}
                />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-purple-300">DNA copies</span>
            </motion.div>
          )}
          
          {stage === 2 && (
            <motion.div
              key="stage2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <motion.div 
                className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center gap-4"
                animate={{ width: 112, height: 72 }}
                transition={{ duration: 0.5 }}
                style={{ width: 80, height: 80 }}
              >
                <div className="w-4 h-8 bg-purple-400 rounded-full" />
                <div className="w-4 h-8 bg-purple-300 rounded-full" />
              </motion.div>
            </motion.div>
          )}
          
          {stage === 3 && (
            <motion.div
              key="stage3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex items-center"
            >
              <div className="relative w-28 h-20">
                <div className="absolute left-0 w-14 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-3 h-6 bg-purple-400 rounded-full" />
                </div>
                <motion.div 
                  className="absolute left-8 w-14 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center"
                  animate={{ left: 56 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="w-3 h-6 bg-purple-300 rounded-full" />
                </motion.div>
                <motion.div 
                  className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/50"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.3 }}
                />
              </div>
            </motion.div>
          )}
          
          {stage === 4 && (
            <motion.div
              key="stage4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-8"
            >
              <motion.div
                initial={{ x: 20 }}
                animate={{ x: 0 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center"
              >
                <div className="w-3 h-6 bg-purple-400 rounded-full" />
              </motion.div>
              <motion.div
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center"
              >
                <div className="w-3 h-6 bg-purple-400 rounded-full" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="text-center mb-3">
        <span className="text-sm text-blue-200">{stageLabels[stage]}</span>
      </div>
      
      {/* Controls */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => { setStage(0); setIsPlaying(true); }}
          className="px-3 py-1.5 bg-indigo-600/60 hover:bg-indigo-600 text-white text-xs rounded-lg transition-colors flex items-center gap-1"
        >
          <Play className="w-3 h-3" />
          {stage > 0 ? 'Replay' : 'Play'}
        </button>
      </div>
    </div>
  );
};

// Interactive Budding Demo
const BuddingDemo: React.FC = () => {
  const [budSize, setBudSize] = useState(0);
  const [detached, setDetached] = useState(false);
  
  const grow = () => {
    if (budSize < 100) {
      setBudSize(s => Math.min(100, s + 25));
    } else if (!detached) {
      setDetached(true);
    }
  };
  
  const reset = () => {
    setBudSize(0);
    setDetached(false);
  };
  
  return (
    <div className="bg-gradient-to-br from-green-900/40 to-teal-900/30 rounded-xl p-4 border border-green-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Copy className="w-5 h-5 text-green-400" />
        <h4 className="text-white font-medium">Budding (Yeast/Hydra)</h4>
      </div>
      
      <div className="relative h-32 bg-black/30 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
        {/* Parent */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full" />
          
          {/* Bud */}
          <AnimatePresence>
            {budSize > 0 && !detached && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: budSize / 100,
                  x: 0,
                  y: 0
                }}
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-green-300 to-green-500 rounded-full origin-left"
              />
            )}
          </AnimatePresence>
          
          {/* Detached bud */}
          {detached && (
            <motion.div
              initial={{ x: 0, y: 0 }}
              animate={{ x: 50, y: 20 }}
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-br from-green-300 to-green-500 rounded-full"
            />
          )}
        </div>
      </div>
      
      <div className="text-center text-sm text-green-200 mb-3">
        {budSize === 0 && 'Click Grow to start budding'}
        {budSize > 0 && budSize < 100 && `Bud growing: ${budSize}%`}
        {budSize >= 100 && !detached && 'Bud mature - click to detach'}
        {detached && 'New organism formed! 🎉'}
      </div>
      
      <div className="flex justify-center gap-2">
        <button
          onClick={grow}
          disabled={detached}
          className="px-3 py-1.5 bg-green-600/60 hover:bg-green-600 disabled:opacity-50 text-white text-xs rounded-lg transition-colors"
        >
          {budSize >= 100 ? 'Detach' : 'Grow'}
        </button>
        <button
          onClick={reset}
          className="px-3 py-1.5 bg-gray-600/60 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Reset
        </button>
      </div>
    </div>
  );
};

// Reproduction Type Comparison
const ReproductionComparison: React.FC = () => {
  const [mode, setMode] = useState<'asexual' | 'sexual'>('asexual');
  
  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-xl p-4 border border-slate-500/30">
      <h4 className="text-white font-medium mb-3 text-center">Compare Reproduction Types</h4>
      
      {/* Toggle */}
      <div className="flex justify-center mb-4">
        <div className="flex bg-black/30 rounded-lg p-1">
          <button
            onClick={() => setMode('asexual')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${
              mode === 'asexual' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Asexual
          </button>
          <button
            onClick={() => setMode('sexual')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${
              mode === 'sexual' 
                ? 'bg-pink-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sexual
          </button>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {mode === 'asexual' ? (
          <motion.div
            key="asexual"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-3"
          >
            {/* Visual */}
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-purple-500 rounded-full mb-1" />
                <span className="text-xs text-purple-300">Parent</span>
              </div>
              <ChevronRight className="w-6 h-6 text-purple-400" />
              <div className="flex gap-2">
                {[1, 2].map(i => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full mb-1" />
                    <span className="text-xs text-purple-300">Clone</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-purple-900/30 p-2 rounded">
                <span className="text-purple-300">Parents:</span>
                <span className="text-white ml-1">ONE</span>
              </div>
              <div className="bg-purple-900/30 p-2 rounded">
                <span className="text-purple-300">Speed:</span>
                <span className="text-white ml-1">FAST</span>
              </div>
              <div className="bg-purple-900/30 p-2 rounded">
                <span className="text-purple-300">Variation:</span>
                <span className="text-white ml-1">NONE</span>
              </div>
              <div className="bg-purple-900/30 p-2 rounded">
                <span className="text-purple-300">Offspring:</span>
                <span className="text-white ml-1">Identical</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="sexual"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-3"
          >
            {/* Visual */}
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-blue-500 rounded-full mb-1" />
                <span className="text-xs text-blue-300">Father</span>
              </div>
              <span className="text-pink-400 text-xl">+</span>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-pink-500 rounded-full mb-1" />
                <span className="text-xs text-pink-300">Mother</span>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-gradient-to-br from-blue-400 to-pink-400 rounded-full mb-1" />
                <span className="text-xs text-gray-300">Unique</span>
              </div>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-pink-900/30 p-2 rounded">
                <span className="text-pink-300">Parents:</span>
                <span className="text-white ml-1">TWO</span>
              </div>
              <div className="bg-pink-900/30 p-2 rounded">
                <span className="text-pink-300">Speed:</span>
                <span className="text-white ml-1">SLOWER</span>
              </div>
              <div className="bg-pink-900/30 p-2 rounded">
                <span className="text-pink-300">Variation:</span>
                <span className="text-white ml-1">HIGH</span>
              </div>
              <div className="bg-pink-900/30 p-2 rounded">
                <span className="text-pink-300">Offspring:</span>
                <span className="text-white ml-1">Unique</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Ghana Crops Propagation
const GhanaCropsPropagation: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<number | null>(null);
  
  const crops = [
    { name: 'Cassava', method: 'Stem Cuttings', type: 'asexual', emoji: '🌿', color: 'green' },
    { name: 'Plantain', method: 'Suckers', type: 'asexual', emoji: '🍌', color: 'yellow' },
    { name: 'Maize', method: 'Seeds', type: 'sexual', emoji: '🌽', color: 'amber' },
    { name: 'Cocoa', method: 'Seeds/Grafting', type: 'both', emoji: '🍫', color: 'orange' },
    { name: 'Pineapple', method: 'Crowns', type: 'asexual', emoji: '🍍', color: 'yellow' },
    { name: 'Yam', method: 'Tuber pieces', type: 'asexual', emoji: '🥔', color: 'brown' }
  ];
  
  return (
    <div className="bg-gradient-to-br from-amber-900/30 to-green-900/20 rounded-xl p-4 border border-amber-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Leaf className="w-5 h-5 text-green-400" />
        <h4 className="text-white font-medium">Ghana Crop Propagation</h4>
      </div>
      
      <p className="text-xs text-gray-300 mb-3">Tap a crop to see how Ghanaian farmers grow it:</p>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        {crops.map((crop, i) => (
          <motion.button
            key={crop.name}
            onClick={() => setSelectedCrop(selectedCrop === i ? null : i)}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-lg text-center transition-all ${
              selectedCrop === i 
                ? 'bg-amber-600/50 border-2 border-amber-400' 
                : 'bg-black/30 border border-gray-700 hover:border-gray-500'
            }`}
          >
            <span className="text-2xl">{crop.emoji}</span>
            <p className="text-xs text-white mt-1">{crop.name}</p>
          </motion.button>
        ))}
      </div>
      
      <AnimatePresence>
        {selectedCrop !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black/30 rounded-lg p-3"
          >
            <p className="text-sm text-white">
              <span className="text-2xl mr-2">{crops[selectedCrop].emoji}</span>
              <strong>{crops[selectedCrop].name}</strong> is propagated using{' '}
              <span className={`font-bold ${
                crops[selectedCrop].type === 'asexual' ? 'text-purple-400' :
                crops[selectedCrop].type === 'sexual' ? 'text-pink-400' :
                'text-orange-400'
              }`}>
                {crops[selectedCrop].method}
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Type: {crops[selectedCrop].type === 'both' ? 'Both methods' : 
                     crops[selectedCrop].type === 'asexual' ? 'Asexual reproduction' : 
                     'Sexual reproduction'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Advantages/Disadvantages Interactive
const AdvantagesDisadvantages: React.FC = () => {
  const [view, setView] = useState<'advantages' | 'disadvantages'>('advantages');
  const [type, setType] = useState<'asexual' | 'sexual'>('asexual');
  
  const data = {
    asexual: {
      advantages: [
        'Fast reproduction',
        'Only one parent needed',
        'No energy for finding mate',
        'Preserves good traits exactly',
        'Quick colonization'
      ],
      disadvantages: [
        'No genetic variation',
        'All vulnerable to same diseases',
        'Cannot adapt to changes',
        'Mutations accumulate'
      ]
    },
    sexual: {
      advantages: [
        'Genetic variation',
        'Adaptation to environment',
        'Disease resistance varies',
        'Enables evolution',
        'Hybrid vigor possible'
      ],
      disadvantages: [
        'Requires two parents',
        'Slower reproduction',
        'Energy for courtship',
        'Fewer offspring',
        'Good gene combos may be lost'
      ]
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-xl p-4 border border-slate-500/30">
      <h4 className="text-white font-medium mb-3 text-center">Pros & Cons</h4>
      
      {/* Type selector */}
      <div className="flex justify-center mb-3">
        <div className="flex bg-black/30 rounded-lg p-1">
          <button
            onClick={() => setType('asexual')}
            className={`px-3 py-1 rounded text-xs transition-all ${
              type === 'asexual' ? 'bg-purple-600 text-white' : 'text-gray-400'
            }`}
          >
            Asexual
          </button>
          <button
            onClick={() => setType('sexual')}
            className={`px-3 py-1 rounded text-xs transition-all ${
              type === 'sexual' ? 'bg-pink-600 text-white' : 'text-gray-400'
            }`}
          >
            Sexual
          </button>
        </div>
      </div>
      
      {/* View toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setView('advantages')}
          className={`flex-1 py-2 rounded-lg text-sm transition-all ${
            view === 'advantages' 
              ? 'bg-green-600/50 text-white border border-green-500' 
              : 'bg-black/20 text-gray-400'
          }`}
        >
          ✓ Advantages
        </button>
        <button
          onClick={() => setView('disadvantages')}
          className={`flex-1 py-2 rounded-lg text-sm transition-all ${
            view === 'disadvantages' 
              ? 'bg-red-600/50 text-white border border-red-500' 
              : 'bg-black/20 text-gray-400'
          }`}
        >
          ✗ Disadvantages
        </button>
      </div>
      
      <motion.div
        key={`${type}-${view}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-2"
      >
        {data[type][view].map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-2 p-2 rounded ${
              view === 'advantages' ? 'bg-green-900/20' : 'bg-red-900/20'
            }`}
          >
            <span className={view === 'advantages' ? 'text-green-400' : 'text-red-400'}>
              {view === 'advantages' ? '✓' : '✗'}
            </span>
            <span className="text-sm text-white">{item}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// Main Component
export default function ReproductionAsexualSexualIntro({ onComplete }: ReproductionAsexualSexualIntroProps) {
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());
  
  const stages = [
    {
      title: "What is Reproduction?",
      content: "Reproduction is the biological process by which living organisms produce offspring of the same species. Without reproduction, species would become extinct within a single generation. This fundamental process exists in two main forms: asexual and sexual reproduction.",
      visual: 'intro'
    },
    {
      title: "Asexual Reproduction",
      content: "Asexual reproduction involves only ONE parent and produces genetically identical offspring called clones. It's fast, efficient, and doesn't require finding a mate. Common types include binary fission in bacteria, budding in yeast and hydra, fragmentation in starfish, and vegetative propagation in plants.",
      visual: 'asexual'
    },
    {
      title: "Sexual Reproduction",
      content: "Sexual reproduction involves TWO parents whose gametes, which are sperm and egg cells, fuse during fertilization. The offspring are genetically unique, combining traits from both parents. This creates variation that helps species adapt to changing environments and resist diseases.",
      visual: 'sexual'
    },
    {
      title: "Ghana Agriculture",
      content: "Ghanaian farmers use both methods strategically. Cassava, plantain, and yam are propagated asexually to preserve good varieties. Cocoa and maize use sexual reproduction for new varieties, then superior plants are propagated asexually. This combines the benefits of both strategies!",
      visual: 'ghana'
    },
    {
      title: "Compare & Explore",
      content: "Now you understand both reproduction types! Asexual is fast but creates identical, vulnerable populations. Sexual is slower but produces variation for adaptation. Many organisms use both methods to get the best of both worlds. Let's explore their advantages and disadvantages!",
      visual: 'compare'
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800/80 to-pink-800/80 backdrop-blur-sm px-4 py-4 sticky top-0 z-40 border-b border-purple-500/30">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <Dna className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Reproduction: Asexual & Sexual</h1>
              <p className="text-purple-200 text-xs">Interactive Introduction</p>
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
                  i === stage ? 'bg-purple-400' : i < stage ? 'bg-purple-600' : 'bg-gray-700'
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
            <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {stages[stage].title}
            </h2>
            
            {/* Teacher Narration */}
            <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl p-4 mb-6 border border-purple-500/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 flex items-center justify-center text-lg">
                  👨‍🏫
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-300 font-medium text-sm">Teacher Kofi</span>
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
            {stages[stage].visual === 'intro' && (
              <div className="space-y-4">
                {/* Intro animation */}
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-xl p-6 border border-slate-500/30 text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block"
                  >
                    <Dna className="w-20 h-20 mx-auto text-purple-400 mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Life Continues Through Reproduction</h3>
                  <p className="text-gray-300 text-sm">Every living thing must reproduce to ensure their species survives</p>
                  
                  <div className="flex justify-center gap-8 mt-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-purple-600/50 rounded-full flex items-center justify-center mb-2">
                        <Copy className="w-8 h-8 text-purple-300" />
                      </div>
                      <span className="text-sm text-purple-300">Asexual</span>
                      <p className="text-xs text-gray-400">One parent</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-pink-600/50 rounded-full flex items-center justify-center mb-2">
                        <Heart className="w-8 h-8 text-pink-300" />
                      </div>
                      <span className="text-sm text-pink-300">Sexual</span>
                      <p className="text-xs text-gray-400">Two parents</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {stages[stage].visual === 'asexual' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <BinaryFissionDemo />
                <BuddingDemo />
              </div>
            )}
            
            {stages[stage].visual === 'sexual' && (
              <div className="space-y-4">
                <ReproductionComparison />
                
                {/* Gamete fusion animation */}
                <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-xl p-4 border border-pink-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Shuffle className="w-5 h-5 text-pink-400" />
                    <h4 className="text-white font-medium">Fertilization = Genetic Mixing</h4>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 py-4">
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-center"
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-full mx-auto mb-1 flex items-center justify-center text-xs">
                        🔵
                      </div>
                      <span className="text-xs text-blue-300">Sperm (n)</span>
                    </motion.div>
                    
                    <span className="text-2xl text-pink-400">+</span>
                    
                    <motion.div
                      animate={{ x: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-center"
                    >
                      <div className="w-14 h-14 bg-pink-500 rounded-full mx-auto mb-1 flex items-center justify-center text-xs">
                        🔴
                      </div>
                      <span className="text-xs text-pink-300">Egg (n)</span>
                    </motion.div>
                    
                    <span className="text-2xl text-gray-400">=</span>
                    
                    <div className="text-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full mx-auto mb-1 flex items-center justify-center text-xs">
                        ✨
                      </div>
                      <span className="text-xs text-purple-300">Zygote (2n)</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-center text-gray-400">
                    Half chromosomes from each parent combine to create a unique individual
                  </p>
                </div>
              </div>
            )}
            
            {stages[stage].visual === 'ghana' && (
              <GhanaCropsPropagation />
            )}
            
            {stages[stage].visual === 'compare' && (
              <AdvantagesDisadvantages />
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
                  i === stage ? 'bg-purple-400 w-4' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
          
          <motion.button
            onClick={handleNext}
            whileTap={{ scale: 0.95 }}
            className="p-2 sm:px-6 sm:py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
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
