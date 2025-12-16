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
  ArrowRight,
  Weight,
  Gauge,
  Zap,
  Timer,
  Move,
  TrendingUp
} from 'lucide-react';

interface ForceWorkPowerIntroProps {
  onComplete?: () => void;
}

// Interactive Force Demo
const ForceDemo: React.FC = () => {
  const [appliedForce, setAppliedForce] = useState(50);
  const [objectMass, setObjectMass] = useState(10);
  const [isMoving, setIsMoving] = useState(false);
  
  // F = ma, so a = F/m
  const acceleration = (appliedForce / objectMass).toFixed(2);
  const weight = (objectMass * 10).toFixed(0); // g ≈ 10 m/s²
  
  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/30 rounded-xl p-4 border border-blue-500/30">
      <div className="flex items-center gap-2 mb-3">
        <ArrowRight className="w-5 h-5 text-blue-400" />
        <h4 className="text-white font-medium">Force and Motion</h4>
      </div>
      
      {/* Visual Demo */}
      <div className="relative bg-black/40 rounded-lg p-4 mb-4 h-32 overflow-hidden">
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-800/60" />
        
        {/* Object (Box) */}
        <motion.div
          className="absolute bottom-2 flex flex-col items-center"
          animate={{
            x: isMoving ? [50, 200, 50] : 50,
          }}
          transition={{
            duration: 3,
            repeat: isMoving ? Infinity : 0,
            ease: "linear"
          }}
        >
          <div 
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
            style={{
              width: Math.max(40, objectMass * 3),
              height: Math.max(40, objectMass * 3),
            }}
          >
            {objectMass}kg
          </div>
          
          {/* Force Arrow */}
          {isMoving && (
            <motion.div
              className="absolute -right-16 top-1/2 -translate-y-1/2 flex items-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <div className="w-12 h-1 bg-blue-400" />
              <ArrowRight className="w-4 h-4 text-blue-400 -ml-1" />
              <span className="text-xs text-blue-300 ml-1">{appliedForce}N</span>
            </motion.div>
          )}
        </motion.div>
        
        {/* Weight Arrow (down) */}
        <div className="absolute bottom-14 left-[70px] flex flex-col items-center">
          <span className="text-xs text-green-300">{weight}N</span>
          <div className="w-0.5 h-6 bg-green-400" />
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-green-400" />
        </div>
      </div>
      
      {/* Controls */}
      <div className="space-y-3">
        <div className="bg-black/20 p-2 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-300">Applied Force</span>
            <span className="text-sm text-blue-400 font-bold">{appliedForce} N</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={appliedForce}
            onChange={(e) => setAppliedForce(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
        
        <div className="bg-black/20 p-2 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-300">Object Mass</span>
            <span className="text-sm text-orange-400 font-bold">{objectMass} kg</span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            value={objectMass}
            onChange={(e) => setObjectMass(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>
        
        <button
          onClick={() => setIsMoving(!isMoving)}
          className={`w-full py-2 rounded-lg font-medium transition-all ${
            isMoving 
              ? 'bg-red-600 hover:bg-red-500 text-white' 
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {isMoving ? 'Stop' : 'Apply Force'}
        </button>
        
        {/* Results */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-900/30 p-2 rounded-lg text-center">
            <p className="text-xs text-blue-300">Acceleration</p>
            <p className="text-lg font-bold text-white">{acceleration} m/s²</p>
            <p className="text-xs text-gray-400">a = F/m</p>
          </div>
          <div className="bg-green-900/30 p-2 rounded-lg text-center">
            <p className="text-xs text-green-300">Weight</p>
            <p className="text-lg font-bold text-white">{weight} N</p>
            <p className="text-xs text-gray-400">W = mg</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Work Calculator Demo
const WorkCalculator: React.FC = () => {
  const [force, setForce] = useState(100);
  const [distance, setDistance] = useState(5);
  const [angle, setAngle] = useState(0);
  
  // W = F × d × cos(θ)
  const angleRad = (angle * Math.PI) / 180;
  const work = (force * distance * Math.cos(angleRad)).toFixed(1);
  
  return (
    <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/30 rounded-xl p-4 border border-green-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Move className="w-5 h-5 text-green-400" />
        <h4 className="text-white font-medium">Work Done Calculator</h4>
      </div>
      
      {/* Visual */}
      <div className="bg-black/40 rounded-lg p-4 mb-4 flex items-center justify-center">
        <div className="relative">
          {/* Box */}
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
            <Weight className="w-8 h-8 text-white" />
          </div>
          
          {/* Force arrow at angle */}
          <motion.div
            className="absolute -right-20 top-1/2 origin-left"
            style={{ 
              transform: `translateY(-50%) rotate(-${angle}deg)`,
            }}
          >
            <div className="flex items-center">
              <div className="w-16 h-1 bg-yellow-400" />
              <ArrowRight className="w-4 h-4 text-yellow-400 -ml-1" />
            </div>
            <span className="text-xs text-yellow-300 absolute -top-4 left-4">{force}N</span>
          </motion.div>
          
          {/* Distance indicator */}
          <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center">
            <div className="w-24 h-0.5 bg-cyan-400" />
            <span className="text-xs text-cyan-300 ml-2">{distance}m</span>
          </div>
        </div>
      </div>
      
      {/* Inputs */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 w-16">Force:</span>
          <input
            type="range"
            min="10"
            max="200"
            value={force}
            onChange={(e) => setForce(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <span className="text-xs text-yellow-400 w-12">{force}N</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 w-16">Distance:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-xs text-cyan-400 w-12">{distance}m</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 w-16">Angle:</span>
          <input
            type="range"
            min="0"
            max="90"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-xs text-purple-400 w-12">{angle}°</span>
        </div>
      </div>
      
      {/* Result */}
      <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 p-3 rounded-lg text-center">
        <p className="text-xs text-green-300 mb-1">Work Done</p>
        <p className="text-2xl font-bold text-white">{work} J</p>
        <p className="text-xs text-gray-400 mt-1">W = F × d × cos(θ) = {force} × {distance} × cos({angle}°)</p>
      </div>
    </div>
  );
};

// Power Demo
const PowerDemo: React.FC = () => {
  const [work, setWork] = useState(500);
  const [time, setTime] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  
  const power = (work / time).toFixed(1);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && elapsed < time) {
      interval = setInterval(() => {
        setElapsed(prev => Math.min(prev + 0.1, time));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, elapsed, time]);
  
  const workDone = ((elapsed / time) * work).toFixed(0);
  const progress = (elapsed / time) * 100;
  
  const resetDemo = () => {
    setIsRunning(false);
    setElapsed(0);
  };
  
  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/30 rounded-xl p-4 border border-purple-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-purple-400" />
        <h4 className="text-white font-medium">Power = Work ÷ Time</h4>
      </div>
      
      {/* Progress Bar */}
      <div className="bg-black/40 rounded-lg p-4 mb-4">
        <div className="relative h-8 bg-gray-800 rounded-full overflow-hidden mb-2">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
            {workDone} J / {work} J
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-400">
          <span>0s</span>
          <span className="text-purple-300">{elapsed.toFixed(1)}s elapsed</span>
          <span>{time}s</span>
        </div>
      </div>
      
      {/* Inputs */}
      <div className="space-y-2 mb-4">
        <div className="bg-black/20 p-2 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-300">Total Work</span>
            <span className="text-sm text-green-400 font-bold">{work} J</span>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={work}
            onChange={(e) => { setWork(Number(e.target.value)); resetDemo(); }}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>
        
        <div className="bg-black/20 p-2 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-300">Time Period</span>
            <span className="text-sm text-blue-400 font-bold">{time} s</span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            value={time}
            onChange={(e) => { setTime(Number(e.target.value)); resetDemo(); }}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          disabled={elapsed >= time}
          className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            isRunning 
              ? 'bg-orange-600 hover:bg-orange-500 text-white' 
              : elapsed >= time
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : elapsed >= time ? 'Complete' : 'Start'}
        </button>
        <button
          onClick={resetDemo}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
        >
          Reset
        </button>
      </div>
      
      {/* Result */}
      <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 p-3 rounded-lg text-center">
        <p className="text-xs text-purple-300 mb-1">Power Output</p>
        <p className="text-2xl font-bold text-white">{power} W</p>
        <p className="text-xs text-gray-400 mt-1">P = W/t = {work}J ÷ {time}s</p>
      </div>
    </div>
  );
};

// Ghana Examples
const GhanaExamples: React.FC = () => {
  const examples = [
    { icon: '🚶', title: 'Carrying Water', desc: 'A woman carries 20kg water 100m. Work = mgh if lifted, or F×d if walking level.', formula: 'W = F × d' },
    { icon: '🚜', title: 'Farm Tractor', desc: 'A tractor pulling a plough does work against friction in the soil.', formula: 'P = W/t' },
    { icon: '💡', title: 'Light Bulb', desc: 'A 60W bulb uses 60 joules of energy every second.', formula: 'P = 60 J/s' },
    { icon: '🏗️', title: 'Construction Site', desc: 'Crane lifting cement blocks does work against gravity.', formula: 'W = mgh' },
  ];
  
  return (
    <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/30 rounded-xl p-4 border border-amber-500/30">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-amber-400" />
        <h4 className="text-white font-medium">Ghana Real-Life Examples</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {examples.map((ex) => (
          <div key={ex.title} className="bg-black/30 p-3 rounded-lg">
            <span className="text-2xl">{ex.icon}</span>
            <p className="text-sm text-white font-medium mt-1">{ex.title}</p>
            <p className="text-xs text-gray-400 mt-1">{ex.desc}</p>
            <p className="text-xs text-amber-400 font-mono mt-2">{ex.formula}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Component
export default function ForceWorkPowerIntro({ onComplete }: ForceWorkPowerIntroProps) {
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());
  
  const stages = [
    {
      title: "What is Force?",
      content: "Force is a push or pull that can change an object's motion, shape, or direction. In physics, we measure force in Newtons, named after Sir Isaac Newton. A force of one Newton is the force needed to accelerate a one kilogram mass at one meter per second squared. Forces are everywhere, from the gravity pulling you down to the friction helping you walk!",
      visual: 'force'
    },
    {
      title: "Work Done",
      content: "Work in physics is different from everyday work. Scientific work is done only when a force moves an object in the direction of the force. If you push a wall and it doesn't move, you've done zero work in physics terms! Work equals force multiplied by distance. The unit is Joules, where one Joule equals one Newton times one meter.",
      visual: 'work'
    },
    {
      title: "Power",
      content: "Power measures how quickly work is done or energy is transferred. A powerful machine does the same work in less time. Power equals work divided by time, measured in Watts. One Watt means one Joule of work per second. A 100-Watt light bulb uses 100 Joules of energy every second. That's why higher wattage appliances cost more to run!",
      visual: 'power'
    },
    {
      title: "Real-Life Applications",
      content: "In Ghana, we see force, work, and power everywhere. When a kayayo carries goods at Makola Market, she does work against gravity. When ECG measures your electricity bill in kilowatt-hours, they're measuring energy, which equals power times time. A tractor's power rating tells farmers how fast it can do work in the field.",
      visual: 'examples'
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-900/20 to-gray-900 text-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800/80 to-purple-800/80 backdrop-blur-sm px-4 py-4 sticky top-0 z-40 border-b border-indigo-500/30">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Force, Work & Power</h1>
              <p className="text-indigo-200 text-xs">Interactive Introduction</p>
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
                  i === stage ? 'bg-indigo-400' : i < stage ? 'bg-indigo-600' : 'bg-gray-700'
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
            <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {stages[stage].title}
            </h2>
            
            {/* Teacher Narration */}
            <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-xl p-4 mb-6 border border-indigo-500/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex-shrink-0 flex items-center justify-center text-lg">
                  👨‍🏫
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-indigo-300 font-medium text-sm">Mr. Mensah (Physics Teacher)</span>
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
                            ? 'text-indigo-300 font-medium' 
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
            {stages[stage].visual === 'force' && <ForceDemo />}
            {stages[stage].visual === 'work' && <WorkCalculator />}
            {stages[stage].visual === 'power' && <PowerDemo />}
            {stages[stage].visual === 'examples' && <GhanaExamples />}
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
                  i === stage ? 'bg-indigo-400 w-4' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
          
          <motion.button
            onClick={handleNext}
            whileTap={{ scale: 0.95 }}
            className="p-2 sm:px-6 sm:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
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
