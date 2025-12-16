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
  Zap,
  Battery,
  Lightbulb,
  ToggleLeft,
  ToggleRight,
  Circle,
  AlertTriangle
} from 'lucide-react';

interface SimpleCircuitsIntroProps {
  onComplete?: () => void;
}

// Interactive Circuit Builder
const CircuitBuilder: React.FC = () => {
  const [switchOn, setSwitchOn] = useState(false);
  const [batteryVoltage, setBatteryVoltage] = useState(6);
  const [bulbResistance] = useState(3);
  
  const current = switchOn ? (batteryVoltage / bulbResistance).toFixed(2) : '0';
  const bulbBrightness = switchOn ? Math.min((batteryVoltage / 6) * 100, 100) : 0;
  
  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-xl p-4 border border-slate-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-yellow-400" />
        <h4 className="text-white font-medium">Build a Simple Circuit</h4>
      </div>
      
      {/* Circuit Diagram */}
      <div className="relative bg-black/40 rounded-lg p-4 mb-4">
        <svg viewBox="0 0 200 120" className="w-full h-32">
          {/* Battery */}
          <g transform="translate(20, 40)">
            <line x1="0" y1="20" x2="0" y2="0" stroke={switchOn ? "#fbbf24" : "#6b7280"} strokeWidth="2" />
            <line x1="-8" y1="0" x2="8" y2="0" stroke={switchOn ? "#fbbf24" : "#6b7280"} strokeWidth="3" />
            <line x1="-4" y1="-6" x2="4" y2="-6" stroke={switchOn ? "#fbbf24" : "#6b7280"} strokeWidth="2" />
            <text x="0" y="35" textAnchor="middle" fill="#9ca3af" fontSize="8">{batteryVoltage}V</text>
            <text x="0" y="-12" textAnchor="middle" fill="#fbbf24" fontSize="7">+</text>
          </g>
          
          {/* Top wire */}
          <motion.line 
            x1="20" y1="34" x2="90" y2="34" 
            stroke={switchOn ? "#fbbf24" : "#6b7280"} 
            strokeWidth="2"
            animate={{ pathLength: switchOn ? 1 : 0.5 }}
          />
          
          {/* Switch */}
          <g transform="translate(100, 34)">
            <circle cx="0" cy="0" r="3" fill={switchOn ? "#22c55e" : "#6b7280"} />
            <motion.line 
              x1="0" y1="0" 
              x2={switchOn ? "20" : "15"} 
              y2={switchOn ? "0" : "-10"} 
              stroke={switchOn ? "#22c55e" : "#6b7280"} 
              strokeWidth="2"
              animate={{ rotate: switchOn ? 0 : -30 }}
              style={{ originX: 0, originY: 0 }}
            />
            <circle cx="20" cy="0" r="3" fill={switchOn ? "#22c55e" : "#6b7280"} />
          </g>
          
          {/* Wire to bulb */}
          <line x1="120" y1="34" x2="160" y2="34" stroke={switchOn ? "#fbbf24" : "#6b7280"} strokeWidth="2" />
          
          {/* Bulb */}
          <g transform="translate(170, 55)">
            <motion.circle 
              cx="0" cy="0" r="15" 
              fill="none" 
              stroke={switchOn ? "#fbbf24" : "#6b7280"} 
              strokeWidth="2"
              animate={{ 
                filter: switchOn ? `drop-shadow(0 0 ${bulbBrightness/5}px #fbbf24)` : 'none'
              }}
            />
            <motion.line x1="-8" y1="-8" x2="8" y2="8" stroke={switchOn ? "#fbbf24" : "#6b7280"} strokeWidth="2" />
            <motion.line x1="-8" y1="8" x2="8" y2="-8" stroke={switchOn ? "#fbbf24" : "#6b7280"} strokeWidth="2" />
            {switchOn && (
              <motion.circle 
                cx="0" cy="0" r="10" 
                fill="#fbbf24"
                initial={{ opacity: 0 }}
                animate={{ opacity: bulbBrightness / 100 }}
              />
            )}
          </g>
          
          {/* Wire down from bulb */}
          <line x1="170" y1="70" x2="170" y2="90" stroke={switchOn ? "#fbbf24" : "#6b7280"} strokeWidth="2" />
          
          {/* Bottom wire */}
          <line x1="170" y1="90" x2="20" y2="90" stroke={switchOn ? "#fbbf24" : "#6b7280"} strokeWidth="2" />
          
          {/* Wire up to battery */}
          <line x1="20" y1="90" x2="20" y2="60" stroke={switchOn ? "#fbbf24" : "#6b7280"} strokeWidth="2" />
          
          {/* Current flow indicators */}
          {switchOn && (
            <>
              <motion.circle
                cx="0" cy="0"
                r="3"
                fill="#fbbf24"
                animate={{
                  cx: [20, 60, 100, 140, 170, 170, 100, 20, 20],
                  cy: [34, 34, 34, 34, 34, 90, 90, 90, 60]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle
                cx="0" cy="0"
                r="3"
                fill="#fbbf24"
                animate={{
                  cx: [170, 100, 20, 20, 60, 100, 140, 170, 170],
                  cy: [90, 90, 90, 60, 34, 34, 34, 34, 60]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
              />
            </>
          )}
        </svg>
      </div>
      
      {/* Controls */}
      <div className="space-y-3">
        {/* Switch Control */}
        <div className="flex items-center justify-between bg-black/20 p-2 rounded-lg">
          <span className="text-sm text-gray-300">Switch</span>
          <button
            onClick={() => setSwitchOn(!switchOn)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
              switchOn 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-600 text-gray-300'
            }`}
          >
            {switchOn ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            {switchOn ? 'ON' : 'OFF'}
          </button>
        </div>
        
        {/* Voltage Slider */}
        <div className="bg-black/20 p-2 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-300">Battery Voltage</span>
            <span className="text-sm text-yellow-400 font-bold">{batteryVoltage}V</span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            value={batteryVoltage}
            onChange={(e) => setBatteryVoltage(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
        </div>
        
        {/* Readings */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-900/30 p-2 rounded-lg text-center">
            <p className="text-xs text-blue-300">Current (I)</p>
            <p className="text-lg font-bold text-white">{current} A</p>
          </div>
          <div className="bg-purple-900/30 p-2 rounded-lg text-center">
            <p className="text-xs text-purple-300">Ohm's Law</p>
            <p className="text-sm font-mono text-white">I = V/R = {batteryVoltage}/{bulbResistance}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Series vs Parallel Circuit Demo
const CircuitTypesDemo: React.FC = () => {
  const [circuitType, setCircuitType] = useState<'series' | 'parallel'>('series');
  const [bulb1On, setBulb1On] = useState(true);
  const [bulb2On, setBulb2On] = useState(true);
  
  // In series: if one bulb is off, all are off
  // In parallel: each bulb works independently
  const seriesWorking = bulb1On && bulb2On;
  const parallelBulb1 = bulb1On;
  const parallelBulb2 = bulb2On;
  
  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 rounded-xl p-4 border border-indigo-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        <h4 className="text-white font-medium">Series vs Parallel</h4>
      </div>
      
      {/* Type Toggle */}
      <div className="flex justify-center mb-4">
        <div className="flex bg-black/30 rounded-lg p-1">
          <button
            onClick={() => setCircuitType('series')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${
              circuitType === 'series' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Series
          </button>
          <button
            onClick={() => setCircuitType('parallel')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${
              circuitType === 'parallel' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Parallel
          </button>
        </div>
      </div>
      
      {/* Visual */}
      <div className="bg-black/40 rounded-lg p-4 mb-4 min-h-[120px] flex items-center justify-center">
        {circuitType === 'series' ? (
          <div className="flex items-center gap-2">
            <Battery className="w-8 h-8 text-green-400" />
            <div className="w-8 h-0.5 bg-yellow-400" />
            <motion.div animate={{ opacity: seriesWorking ? 1 : 0.3 }}>
              <Lightbulb className={`w-8 h-8 ${seriesWorking ? 'text-yellow-400' : 'text-gray-600'}`} />
            </motion.div>
            <div className="w-8 h-0.5 bg-yellow-400" />
            <motion.div animate={{ opacity: seriesWorking ? 1 : 0.3 }}>
              <Lightbulb className={`w-8 h-8 ${seriesWorking ? 'text-yellow-400' : 'text-gray-600'}`} />
            </motion.div>
            <div className="w-8 h-0.5 bg-yellow-400" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Battery className="w-8 h-8 text-green-400" />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-yellow-400" />
                  <motion.div animate={{ opacity: parallelBulb1 ? 1 : 0.3 }}>
                    <Lightbulb className={`w-6 h-6 ${parallelBulb1 ? 'text-yellow-400' : 'text-gray-600'}`} />
                  </motion.div>
                  <div className="w-6 h-0.5 bg-yellow-400" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-yellow-400" />
                  <motion.div animate={{ opacity: parallelBulb2 ? 1 : 0.3 }}>
                    <Lightbulb className={`w-6 h-6 ${parallelBulb2 ? 'text-yellow-400' : 'text-gray-600'}`} />
                  </motion.div>
                  <div className="w-6 h-0.5 bg-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bulb Controls */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => setBulb1On(!bulb1On)}
          className={`p-2 rounded-lg text-sm transition-all ${
            bulb1On ? 'bg-yellow-600/50 text-white' : 'bg-gray-700 text-gray-400'
          }`}
        >
          Bulb 1: {bulb1On ? 'Working' : 'Broken'}
        </button>
        <button
          onClick={() => setBulb2On(!bulb2On)}
          className={`p-2 rounded-lg text-sm transition-all ${
            bulb2On ? 'bg-yellow-600/50 text-white' : 'bg-gray-700 text-gray-400'
          }`}
        >
          Bulb 2: {bulb2On ? 'Working' : 'Broken'}
        </button>
      </div>
      
      {/* Result */}
      <div className={`p-3 rounded-lg text-sm ${
        circuitType === 'series' 
          ? seriesWorking ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
          : 'bg-blue-900/30 text-blue-300'
      }`}>
        {circuitType === 'series' ? (
          seriesWorking 
            ? '✓ Both bulbs light - current flows through all' 
            : '✗ Circuit broken - one bulb off stops all current'
        ) : (
          `Each bulb works independently: Bulb 1 ${parallelBulb1 ? '✓' : '✗'}, Bulb 2 ${parallelBulb2 ? '✓' : '✗'}`
        )}
      </div>
    </div>
  );
};

// Circuit Components Reference
const CircuitComponents: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<number | null>(null);
  
  const components = [
    { name: 'Battery/Cell', symbol: '🔋', desc: 'Provides electrical energy (voltage)', symbol2: '─┤├─' },
    { name: 'Bulb/Lamp', symbol: '💡', desc: 'Converts electrical energy to light', symbol2: '⊗' },
    { name: 'Switch', symbol: '🔘', desc: 'Opens/closes circuit to control current', symbol2: '─/─' },
    { name: 'Resistor', symbol: '⚡', desc: 'Opposes current flow (measured in Ω)', symbol2: '─⋀⋀⋀─' },
    { name: 'Ammeter', symbol: '🅰️', desc: 'Measures current (in series)', symbol2: '(A)' },
    { name: 'Voltmeter', symbol: '🔴', desc: 'Measures voltage (in parallel)', symbol2: '(V)' }
  ];
  
  return (
    <div className="bg-gradient-to-br from-green-900/40 to-teal-900/30 rounded-xl p-4 border border-green-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Circle className="w-5 h-5 text-green-400" />
        <h4 className="text-white font-medium">Circuit Components</h4>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        {components.map((comp, i) => (
          <motion.button
            key={comp.name}
            onClick={() => setSelectedComponent(selectedComponent === i ? null : i)}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg text-center transition-all ${
              selectedComponent === i 
                ? 'bg-green-600/50 border-2 border-green-400' 
                : 'bg-black/30 border border-gray-700 hover:border-gray-500'
            }`}
          >
            <span className="text-xl">{comp.symbol}</span>
            <p className="text-xs text-white mt-1 truncate">{comp.name}</p>
          </motion.button>
        ))}
      </div>
      
      <AnimatePresence>
        {selectedComponent !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black/30 rounded-lg p-3"
          >
            <p className="text-sm text-white mb-1">
              <strong className="text-green-300">{components[selectedComponent].name}</strong>
            </p>
            <p className="text-xs text-gray-300 mb-2">{components[selectedComponent].desc}</p>
            <p className="text-xs text-gray-400 font-mono">
              Symbol: {components[selectedComponent].symbol2}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Ghana Safety Tips
const SafetyTips: React.FC = () => {
  const tips = [
    { icon: '⚠️', title: '230V Mains', desc: 'Ghana uses 230V AC - can be fatal!' },
    { icon: '💧', title: 'No Water', desc: 'Never use electrical appliances near water' },
    { icon: '🔌', title: 'Overloading', desc: 'Don\'t connect too many devices to one socket' },
    { icon: '⚡', title: 'ECG Lines', desc: 'Stay away from fallen power lines - call ECG' }
  ];
  
  return (
    <div className="bg-gradient-to-br from-red-900/40 to-orange-900/30 rounded-xl p-4 border border-red-500/30">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-red-400" />
        <h4 className="text-white font-medium">Ghana Electrical Safety</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {tips.map((tip) => (
          <div key={tip.title} className="bg-black/30 p-2 rounded-lg">
            <span className="text-lg">{tip.icon}</span>
            <p className="text-xs text-white font-medium">{tip.title}</p>
            <p className="text-xs text-gray-400">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Component
export default function SimpleCircuitsIntro({ onComplete }: SimpleCircuitsIntroProps) {
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());
  
  const stages = [
    {
      title: "What is a Circuit?",
      content: "An electrical circuit is a complete path through which electric current can flow. Just like water needs pipes to flow from a tank to your tap, electricity needs wires to flow from a battery or power source to devices like bulbs, fans, and phones. If there's any break in the path, current stops flowing.",
      visual: 'intro'
    },
    {
      title: "Build a Simple Circuit",
      content: "Every circuit needs three things: a power source like a battery that pushes electrons, a load like a bulb that uses the energy, and conductors like copper wires that connect everything. A switch lets you control when current flows. Try the interactive circuit below!",
      visual: 'builder'
    },
    {
      title: "Series vs Parallel",
      content: "Circuits can be connected in two ways. In a series circuit, components are connected in a single loop, so if one breaks, everything stops, like old Christmas lights. In a parallel circuit, each component has its own path, so if one fails, others keep working, like outlets in your home.",
      visual: 'types'
    },
    {
      title: "Circuit Components",
      content: "Circuit diagrams use standard symbols recognized worldwide. A battery is shown as long and short parallel lines, a bulb as a circle with an X, a resistor as a zigzag line, and meters as circles with letters. Learning these symbols helps you read and draw any circuit!",
      visual: 'components'
    },
    {
      title: "Stay Safe!",
      content: "Electricity in Ghana is 230 volts AC, which is very dangerous. Never touch exposed wires or overload sockets. Keep electrical devices away from water. If you see a fallen power line, stay far away and call ECG immediately. Safety first, always!",
      visual: 'safety'
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900/20 to-gray-900 text-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-800/80 to-orange-800/80 backdrop-blur-sm px-4 py-4 sticky top-0 z-40 border-b border-yellow-500/30">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Simple Circuits</h1>
              <p className="text-yellow-200 text-xs">Interactive Introduction</p>
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
                  i === stage ? 'bg-yellow-400' : i < stage ? 'bg-yellow-600' : 'bg-gray-700'
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
            <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {stages[stage].title}
            </h2>
            
            {/* Teacher Narration */}
            <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-xl p-4 mb-6 border border-yellow-500/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 flex items-center justify-center text-lg">
                  👨‍🔧
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-300 font-medium text-sm">Mr. Ampong (Electrician)</span>
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
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 rounded-xl p-6 border border-slate-500/30 text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <div className="flex items-center gap-4 justify-center">
                    <Battery className="w-12 h-12 text-green-400" />
                    <motion.div 
                      className="w-16 h-1 bg-yellow-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <Lightbulb className="w-12 h-12 text-yellow-400" />
                    <motion.div 
                      className="w-16 h-1 bg-yellow-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                    />
                  </div>
                </motion.div>
                
                <h3 className="text-xl font-bold text-white mb-2">Complete Path = Current Flows!</h3>
                <p className="text-gray-300 text-sm">Battery → Wire → Load → Wire → Battery</p>
                
                <div className="flex justify-center gap-4 mt-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto bg-green-600/50 rounded-full flex items-center justify-center mb-2">
                      <Battery className="w-6 h-6 text-green-300" />
                    </div>
                    <span className="text-xs text-gray-400">Power Source</span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto bg-yellow-600/50 rounded-full flex items-center justify-center mb-2">
                      <Lightbulb className="w-6 h-6 text-yellow-300" />
                    </div>
                    <span className="text-xs text-gray-400">Load (Device)</span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto bg-blue-600/50 rounded-full flex items-center justify-center mb-2">
                      <div className="w-6 h-0.5 bg-blue-300" />
                    </div>
                    <span className="text-xs text-gray-400">Conductors</span>
                  </div>
                </div>
              </div>
            )}
            
            {stages[stage].visual === 'builder' && (
              <CircuitBuilder />
            )}
            
            {stages[stage].visual === 'types' && (
              <CircuitTypesDemo />
            )}
            
            {stages[stage].visual === 'components' && (
              <CircuitComponents />
            )}
            
            {stages[stage].visual === 'safety' && (
              <SafetyTips />
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
                  i === stage ? 'bg-yellow-400 w-4' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
          
          <motion.button
            onClick={handleNext}
            whileTap={{ scale: 0.95 }}
            className="p-2 sm:px-6 sm:py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20"
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
