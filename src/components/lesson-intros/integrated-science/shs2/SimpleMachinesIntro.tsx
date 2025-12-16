'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronRight,
  ChevronLeft,
  Settings,
  ArrowUp,
  RotateCcw,
  Scissors,
  Triangle
} from 'lucide-react';

interface SimpleMachinesIntroProps {
  onComplete?: () => void;
}

// Interactive Lever Demo
const LeverDemo: React.FC = () => {
  const [effort, setEffort] = useState(50);
  const [effortArm, setEffortArm] = useState(80);
  const [loadArm, setLoadArm] = useState(40);
  
  // MA = Load Arm / Effort Arm (for load calculation)
  // Load that can be lifted = Effort × (Effort Arm / Load Arm)
  const loadLifted = ((effort * effortArm) / loadArm).toFixed(1);
  const mechanicalAdvantage = (effortArm / loadArm).toFixed(2);
  const velocityRatio = (effortArm / loadArm).toFixed(2);
  
  const leverAngle = Math.min(15, (effort / 100) * 15);
  
  return (
    <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/30 rounded-xl p-4 border border-amber-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Triangle className="w-5 h-5 text-amber-400" />
        <h4 className="text-white font-medium">First Class Lever</h4>
      </div>
      
      {/* Visual Demo */}
      <div className="relative bg-black/40 rounded-lg p-4 mb-4 h-40 overflow-hidden">
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-700" />
        
        {/* Fulcrum (Triangle) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-transparent border-b-amber-500" />
        </div>
        
        {/* Lever Bar */}
        <motion.div
          className="absolute bottom-[42px] left-1/2 -translate-x-1/2 w-64 h-2 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full origin-center"
          style={{
            transform: `translateX(-50%) rotate(${-leverAngle}deg)`,
          }}
        >
          {/* Effort side (left) */}
          <div 
            className="absolute -left-2 -top-6 flex flex-col items-center"
            style={{ left: `${100 - effortArm}%` }}
          >
            <span className="text-xs text-blue-300">{effort}N</span>
            <ArrowUp className="w-4 h-4 text-blue-400 rotate-180" />
          </div>
          
          {/* Load side (right) */}
          <div 
            className="absolute -top-10 flex flex-col items-center"
            style={{ left: `${50 + loadArm/2}%` }}
          >
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              {loadLifted}N
            </div>
          </div>
        </motion.div>
        
        {/* Labels */}
        <div className="absolute bottom-16 left-4 text-xs text-blue-300">Effort</div>
        <div className="absolute bottom-16 right-4 text-xs text-red-300">Load</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-amber-300 mt-1">Fulcrum</div>
      </div>
      
      {/* Controls */}
      <div className="space-y-3">
        <div className="bg-black/20 p-2 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-300">Effort Force</span>
            <span className="text-sm text-blue-400 font-bold">{effort} N</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={effort}
            onChange={(e) => setEffort(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black/20 p-2 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-300">Effort Arm</span>
              <span className="text-xs text-blue-400 font-bold">{effortArm} cm</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={effortArm}
              onChange={(e) => setEffortArm(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          
          <div className="bg-black/20 p-2 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-300">Load Arm</span>
              <span className="text-xs text-red-400 font-bold">{loadArm} cm</span>
            </div>
            <input
              type="range"
              min="20"
              max="80"
              value={loadArm}
              onChange={(e) => setLoadArm(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>
        </div>
        
        {/* Results */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-amber-900/30 p-2 rounded-lg text-center">
            <p className="text-xs text-amber-300">Mechanical Advantage</p>
            <p className="text-lg font-bold text-white">{mechanicalAdvantage}</p>
            <p className="text-xs text-gray-400">MA = EA/LA</p>
          </div>
          <div className="bg-green-900/30 p-2 rounded-lg text-center">
            <p className="text-xs text-green-300">Load Lifted</p>
            <p className="text-lg font-bold text-white">{loadLifted} N</p>
            <p className="text-xs text-gray-400">L = E × MA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pulley System Demo
const PulleyDemo: React.FC = () => {
  const [numPulleys, setNumPulleys] = useState(2);
  const [effort, setEffort] = useState(50);
  const [isPulling, setIsPulling] = useState(false);
  
  // For ideal pulley: MA = number of supporting ropes = numPulleys
  const loadLifted = effort * numPulleys;
  const ropeDistance = 100; // Distance pulled
  const loadRise = ropeDistance / numPulleys;
  
  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/30 rounded-xl p-4 border border-blue-500/30">
      <div className="flex items-center gap-2 mb-3">
        <RotateCcw className="w-5 h-5 text-blue-400" />
        <h4 className="text-white font-medium">Pulley System</h4>
      </div>
      
      {/* Visual Demo */}
      <div className="relative bg-black/40 rounded-lg p-4 mb-4 h-48 overflow-hidden">
        {/* Ceiling */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gray-600" />
        
        {/* Pulley wheels */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-4">
          {Array.from({ length: Math.min(numPulleys, 3) }).map((_, i) => (
            <motion.div
              key={i}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 border-4 border-gray-500 flex items-center justify-center"
              animate={{ rotate: isPulling ? 360 : 0 }}
              transition={{ duration: 1, repeat: isPulling ? Infinity : 0, ease: "linear" }}
            >
              <div className="w-2 h-2 rounded-full bg-gray-800" />
            </motion.div>
          ))}
        </div>
        
        {/* Rope */}
        <div className="absolute top-11 left-1/2 -translate-x-1/2 w-1 bg-amber-600" style={{ height: '80px' }} />
        
        {/* Load */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: isPulling ? -20 : 0 }}
          transition={{ duration: 0.5, repeat: isPulling ? Infinity : 0, repeatType: "reverse" }}
        >
          <div className="w-16 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
            {loadLifted}N
          </div>
        </motion.div>
        
        {/* Effort arrow */}
        <div className="absolute bottom-4 right-4 flex flex-col items-center">
          <span className="text-xs text-blue-300 mb-1">Pull: {effort}N</span>
          <motion.div
            animate={{ y: isPulling ? [0, 10, 0] : 0 }}
            transition={{ duration: 0.5, repeat: isPulling ? Infinity : 0 }}
          >
            <ArrowUp className="w-6 h-6 text-blue-400 rotate-180" />
          </motion.div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="space-y-3">
        <div className="bg-black/20 p-2 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-300">Number of Pulleys</span>
            <span className="text-sm text-cyan-400 font-bold">{numPulleys}</span>
          </div>
          <input
            type="range"
            min="1"
            max="4"
            value={numPulleys}
            onChange={(e) => setNumPulleys(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
        
        <div className="bg-black/20 p-2 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-300">Effort Force</span>
            <span className="text-sm text-blue-400 font-bold">{effort} N</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={effort}
            onChange={(e) => setEffort(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
        
        <button
          onClick={() => setIsPulling(!isPulling)}
          className={`w-full py-2 rounded-lg font-medium transition-all ${
            isPulling 
              ? 'bg-red-600 hover:bg-red-500 text-white' 
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {isPulling ? 'Stop Pulling' : 'Pull Rope'}
        </button>
        
        {/* Results */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-cyan-900/30 p-2 rounded-lg text-center">
            <p className="text-xs text-cyan-300">MA</p>
            <p className="text-lg font-bold text-white">{numPulleys}</p>
          </div>
          <div className="bg-green-900/30 p-2 rounded-lg text-center">
            <p className="text-xs text-green-300">Load</p>
            <p className="text-lg font-bold text-white">{loadLifted}N</p>
          </div>
          <div className="bg-purple-900/30 p-2 rounded-lg text-center">
            <p className="text-xs text-purple-300">Load Rise</p>
            <p className="text-lg font-bold text-white">{loadRise.toFixed(0)}cm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inclined Plane Demo
const InclinedPlaneDemo: React.FC = () => {
  const [angle, setAngle] = useState(30);
  const [load, setLoad] = useState(100);
  const [isMoving, setIsMoving] = useState(false);
  
  const height = 100; // Fixed height
  const length = height / Math.sin((angle * Math.PI) / 180);
  const effortRequired = (load * height) / length;
  const mechanicalAdvantage = length / height;
  
  return (
    <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/30 rounded-xl p-4 border border-green-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Triangle className="w-5 h-5 text-green-400 rotate-90" />
        <h4 className="text-white font-medium">Inclined Plane</h4>
      </div>
      
      {/* Visual Demo */}
      <div className="relative bg-black/40 rounded-lg p-4 mb-4 h-40 overflow-hidden">
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-700" />
        
        {/* Inclined Plane */}
        <div 
          className="absolute bottom-2 left-8 origin-bottom-left bg-gradient-to-r from-green-600 to-green-800 w-48 h-3 rounded"
          style={{ transform: `rotate(-${angle}deg)` }}
        >
          {/* Box on plane */}
          <motion.div
            className="absolute -top-8 bg-gradient-to-br from-orange-500 to-red-600 w-10 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
            animate={{ left: isMoving ? ['20%', '80%'] : '20%' }}
            transition={{ duration: 2, repeat: isMoving ? Infinity : 0 }}
          >
            {load}N
          </motion.div>
        </div>
        
        {/* Height marker */}
        <div className="absolute left-4 bottom-2 flex flex-col items-center">
          <span className="text-xs text-yellow-300">h</span>
          <div className="w-0.5 h-20 bg-yellow-400" />
        </div>
        
        {/* Angle marker */}
        <div className="absolute bottom-4 left-12">
          <span className="text-xs text-green-300">{angle}°</span>
        </div>
        
        {/* Force arrows */}
        <div className="absolute right-4 bottom-20 text-xs">
          <div className="text-blue-300">Effort: {effortRequired.toFixed(0)}N</div>
          <div className="text-green-300">MA: {mechanicalAdvantage.toFixed(1)}</div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="space-y-3">
        <div className="bg-black/20 p-2 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-300">Angle of Incline</span>
            <span className="text-sm text-green-400 font-bold">{angle}°</span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>
        
        <div className="bg-black/20 p-2 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-300">Load Weight</span>
            <span className="text-sm text-orange-400 font-bold">{load} N</span>
          </div>
          <input
            type="range"
            min="50"
            max="200"
            value={load}
            onChange={(e) => setLoad(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>
        
        <button
          onClick={() => setIsMoving(!isMoving)}
          className={`w-full py-2 rounded-lg font-medium transition-all ${
            isMoving 
              ? 'bg-red-600 hover:bg-red-500 text-white' 
              : 'bg-green-600 hover:bg-green-500 text-white'
          }`}
        >
          {isMoving ? 'Stop' : 'Push Up Plane'}
        </button>
        
        {/* Results */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-900/30 p-2 rounded-lg text-center">
            <p className="text-xs text-blue-300">Effort Required</p>
            <p className="text-lg font-bold text-white">{effortRequired.toFixed(0)} N</p>
            <p className="text-xs text-gray-400">(Less than {load}N!)</p>
          </div>
          <div className="bg-green-900/30 p-2 rounded-lg text-center">
            <p className="text-xs text-green-300">Mechanical Adv.</p>
            <p className="text-lg font-bold text-white">{mechanicalAdvantage.toFixed(1)}</p>
            <p className="text-xs text-gray-400">MA = L/h</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Ghana Applications
const GhanaApplications: React.FC = () => {
  const machines = [
    { icon: '🪓', name: 'Cutlass (Wedge)', desc: 'Farmers use cutlass to split wood and clear farms. The wedge shape multiplies force.', type: 'Wedge' },
    { icon: '🎣', name: 'Fishing Net Pulley', desc: 'Fishermen at Elmina use pulleys to lift heavy nets from the sea.', type: 'Pulley' },
    { icon: '🚲', name: 'Bicycle Gears', desc: 'Wheel and axle system - small gear effort moves large wheel.', type: 'Wheel & Axle' },
    { icon: '🪜', name: 'Loading Ramps', desc: 'Inclined planes at Tema Harbor make loading ships easier.', type: 'Inclined Plane' },
    { icon: '✂️', name: 'Scissors', desc: 'Two first-class levers joined together for cutting cloth at markets.', type: 'Lever' },
    { icon: '🔩', name: 'Screws & Bolts', desc: 'Used in construction throughout Ghana - inclined plane wrapped around cylinder.', type: 'Screw' },
  ];
  
  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/30 rounded-xl p-4 border border-purple-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Settings className="w-5 h-5 text-purple-400" />
        <h4 className="text-white font-medium">Simple Machines in Ghana</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {machines.map((m) => (
          <div key={m.name} className="bg-black/30 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{m.icon}</span>
              <span className="text-xs text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded">{m.type}</span>
            </div>
            <p className="text-sm text-white font-medium">{m.name}</p>
            <p className="text-xs text-gray-400 mt-1">{m.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 bg-gradient-to-r from-amber-900/30 to-orange-900/30 p-3 rounded-lg">
        <p className="text-sm text-amber-300 font-medium mb-1">💡 Key Insight</p>
        <p className="text-xs text-gray-300">
          Simple machines don&apos;t reduce the amount of work - they make work <strong className="text-white">easier</strong> by 
          reducing the force needed or changing the direction of force. The trade-off is usually moving 
          through a greater distance!
        </p>
      </div>
    </div>
  );
};

// Main Component
export default function SimpleMachinesIntro({ onComplete }: SimpleMachinesIntroProps) {
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());
  
  const stages = [
    {
      title: "What are Simple Machines?",
      content: "A simple machine is a basic mechanical device that makes work easier. They don't reduce the total work done, but they reduce the effort needed by increasing the distance moved. There are six types of simple machines: lever, pulley, wheel and axle, inclined plane, wedge, and screw. Every complex machine, from bicycles to cranes, is made of these simple machines working together!",
      visual: 'lever'
    },
    {
      title: "Pulleys - Lifting Made Easy",
      content: "A pulley is a wheel with a grooved rim for a rope. A single fixed pulley changes the direction of force, making it easier to lift by pulling down. A movable pulley actually reduces the effort needed! When we combine multiple pulleys into a block and tackle system, we can lift very heavy loads with little effort. The more pulleys, the greater the mechanical advantage!",
      visual: 'pulley'
    },
    {
      title: "Inclined Planes - Ramps",
      content: "An inclined plane is a flat surface tilted at an angle, like a ramp. Instead of lifting something straight up, we push it along the slope using less force. The gentler the slope, the less effort needed, but the longer the distance traveled. Loading ramps, staircases, and mountain roads are all inclined planes. A screw is actually an inclined plane wrapped around a cylinder!",
      visual: 'inclined'
    },
    {
      title: "Simple Machines in Ghana",
      content: "Simple machines are everywhere in Ghana! Farmers use cutlasses, which are wedges, to clear land. Fishermen at our coastal towns use pulleys to haul in heavy nets. Bicycle repairers understand wheel and axle systems. Construction workers at building sites use screws, levers, and pulleys daily. Even the oar used by a fisherman is a lever! Understanding these machines helps us work smarter, not harder.",
      visual: 'ghana'
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-amber-900/20 to-gray-900 text-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-800/80 to-orange-800/80 backdrop-blur-sm px-4 py-4 sticky top-0 z-40 border-b border-amber-500/30">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Simple Machines</h1>
              <p className="text-amber-200 text-xs">Interactive Introduction</p>
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
                  i === stage ? 'bg-amber-400' : i < stage ? 'bg-amber-600' : 'bg-gray-700'
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
            <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              {stages[stage].title}
            </h2>
            
            {/* Teacher Narration */}
            <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 rounded-xl p-4 mb-6 border border-amber-500/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 flex items-center justify-center text-lg">
                  👨‍🏫
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-300 font-medium text-sm">Mr. Asante (Physics Teacher)</span>
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
                            ? 'text-amber-300 font-medium' 
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
            {stages[stage].visual === 'lever' && <LeverDemo />}
            {stages[stage].visual === 'pulley' && <PulleyDemo />}
            {stages[stage].visual === 'inclined' && <InclinedPlaneDemo />}
            {stages[stage].visual === 'ghana' && <GhanaApplications />}
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
                  i === stage ? 'bg-amber-400 w-4' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
          
          <motion.button
            onClick={handleNext}
            whileTap={{ scale: 0.95 }}
            className="p-2 sm:px-6 sm:py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
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
