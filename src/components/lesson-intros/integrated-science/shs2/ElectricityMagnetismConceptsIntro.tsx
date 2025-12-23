'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Zap, Battery, Lightbulb, AlertTriangle, ArrowRight, Gauge, Thermometer, Play, Pause, Volume2, VolumeX, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '@/hooks/useLocalization';
import { localizeString } from '@/lib/localization/content-localizer';
import type { CountryConfig } from '@/lib/localization/country-config';

interface LessonIntroProps {
  onComplete?: () => void;
}

const ElectricityMagnetismConceptsIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const { country } = useLocalization();
  const [stage, setStage] = useState(0);
  const [voltage, setVoltage] = useState(0);
  const [current, setCurrent] = useState(0);
  const [resistance, setResistance] = useState(10);
  const [chargeDemo, setChargeDemo] = useState<'neutral' | 'positive' | 'negative'>('neutral');
  const [electronPositions, setElectronPositions] = useState<number[]>([]);
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Animate flowing electrons
    if (voltage > 0) {
      const interval = setInterval(() => {
        setElectronPositions(prev => {
          const newPositions = prev.map(p => (p + 2) % 100);
          return newPositions;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [voltage]);

  useEffect(() => {
    // Initialize electron positions
    setElectronPositions([0, 20, 40, 60, 80]);
  }, []);

  useEffect(() => {
    // Calculate current using Ohm's Law
    setCurrent(voltage / resistance);
  }, [voltage, resistance]);

  const maintsVoltage = React.useMemo(() => {
    // Use localized template variable for voltage
    return localizeString("{{country}}'s mains voltage", country as CountryConfig);
  }, [country]);

  const stages = React.useMemo(() => [
    {
      title: " Welcome to Electricity!",
      content: localizeString("Electricity powers our modern world - from your phone to {{country}}'s national grid!", country as CountryConfig),
      narration: localizeString("Welcome, brilliant student! Today we enter the electrifying world of electricity and magnetism! Look around you - every phone charging, every light bulb glowing, every fan spinning uses electricity. In {{country}}, our national grid delivers power to homes across the country. But what IS electricity really? How does current flow through wires? Why does your body get shocked if you touch exposed wires? By the end of this lesson, you will understand the invisible force that powers our modern world!", country as CountryConfig),
      highlightWords: ['electricity', 'magnetism', 'phone', 'light bulb', 'current', 'wires', 'shocked']
    },
    {
      title: " What is Electric Charge?",
      content: "All matter is made of atoms with positive protons and negative electrons.",
      narration: localizeString("Let us start at the atomic level! Every atom has a nucleus with positive protons, surrounded by negative electrons orbiting like planets. When an object has equal protons and electrons, it is neutral - no charge! But when electrons move from one object to another, magic happens! Lose electrons and you become positive. Gain electrons and you become negative. Try the demonstration - click to add or remove electrons and watch the charge change! This is the foundation of ALL electricity. When you rub your feet on a carpet and touch a door handle - ZAP - that is electrons jumping!", country as CountryConfig),
      highlightWords: ['atom', 'nucleus', 'protons', 'electrons', 'neutral', 'positive', 'negative', 'charge', 'electrons jumping']
    },
    {
      title: " Static vs Current Electricity",
      content: "Charges can stay still (static) or flow continuously (current electricity).",
      narration: localizeString("Now here is a crucial distinction! Static electricity is when charges build up and stay in one place - like lightning in the rainy season, or the shock from touching metal after walking on tiles. But CURRENT electricity is different - charges flow continuously through a conductor, like water through a pipe! This flowing electricity powers everything - your TV, refrigerator, and the fans in your classroom. Current is measured in AMPERES. One ampere means about six quintillion electrons passing a point every second! That is a six followed by eighteen zeros. Incredible, right?", country as CountryConfig),
      highlightWords: ['static electricity', 'lightning', 'shock', 'current electricity', 'conductor', 'amperes', 'six quintillion', 'electrons']
    },
    {
      title: " Ohm's Law: V = IR",
      content: "The most important equation in basic electricity - try it yourself!",
      narration: localizeString("Now for the GOLDEN RULE of electricity - Ohm's Law! Voltage equals Current times Resistance. V equals I times R. Think of it like water in a pipe. Voltage is the PRESSURE pushing electrons - measured in volts. Current is how MANY electrons flow - measured in amperes. Resistance is how much the wire OPPOSES the flow - measured in ohms. Use the sliders to experiment! Increase voltage and watch current increase. Increase resistance and current decreases. {{country}}'s mains supply is 230 volts - very dangerous! This formula helps engineers design safe circuits. Master this equation and you have mastered the basics of electricity!", country as CountryConfig),
      highlightWords: ['Ohm\'s Law', 'Voltage', 'Current', 'Resistance', 'volts', 'amperes', 'ohms', 'safe circuits']
    }
  ], [country]);

  // Speak the current stage narration
  const speakNarration = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis || isMuted) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const narration = stages[stage].narration;
    const utterance = new SpeechSynthesisUtterance(narration);
    
    // Configure voice
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to find a good English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google'))
    ) || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    // Word boundary tracking for highlighting
    const words = narration.split(/\s+/);
    let wordIndex = 0;
    
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentWordIndex(wordIndex);
        wordIndex++;
      }
    };
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [stage, isMuted, stages]);

  // Auto-speak when stage changes
  useEffect(() => {
    if (!hasSpokenRef.current.has(stage) && !isMuted) {
      // Small delay to let the UI update first
      const timer = setTimeout(() => {
        speakNarration();
        hasSpokenRef.current.add(stage);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stage, speakNarration, isMuted]);

  // Cleanup on unmount
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

  // Render highlighted narration text
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

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-yellow-900/30 via-gray-900 to-blue-900/30 rounded-2xl p-4 sm:p-6 md:p-8 pb-24 sm:pb-28 overflow-hidden">
      {/* Electric bolts background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              x: [Math.random() * 100, Math.random() * 400],
              y: [Math.random() * 100, Math.random() * 300]
            }}
            transition={{ 
              duration: 0.3,
              delay: i * 2 + Math.random() * 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Zap className="w-6 h-6 text-yellow-400" />
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
          <Zap className="w-6 h-6 sm:w-10 sm:h-10 text-yellow-400" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Electricity & Magnetism
          </h2>
          <Lightbulb className="w-6 h-6 sm:w-10 sm:h-10 text-yellow-300" />
        </div>
        <p className="text-yellow-200 text-sm sm:text-lg">Charge, Current, Voltage & Resistance</p>
      </motion.div>

      {/* Teacher Avatar & Narration Controls */}
      <motion.div 
        className="bg-gradient-to-r from-yellow-900/40 to-blue-900/40 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-yellow-700/50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-start gap-2 sm:gap-4">
          {/* Teacher Avatar */}
          <div className="flex-shrink-0">
            <motion.div 
              className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center ${
                isSpeaking && !isPaused ? 'ring-2 sm:ring-4 ring-yellow-400/50' : ''
              }`}
              animate={isSpeaking && !isPaused ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            </motion.div>
            <p className="text-center text-[10px] sm:text-xs text-yellow-300 mt-1 hidden sm:block">Teacher</p>
          </div>

          {/* Narration Text */}
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm leading-relaxed max-h-16 sm:max-h-24 overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-yellow-600">
              {renderNarrationText()}
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex flex-col gap-1 sm:gap-2">
            {isSpeaking ? (
              <button
                onClick={togglePause}
                className="p-1.5 sm:p-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg transition-colors"
                title={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
              </button>
            ) : (
              <button
                onClick={replayNarration}
                className="p-1.5 sm:p-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
                title="Play narration"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            )}
            <button
              onClick={toggleMute}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                isMuted ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-600 hover:bg-gray-500'
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stage content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-gray-800/80 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h3 className="text-lg sm:text-2xl font-bold text-yellow-400 mb-2 sm:mb-3">{stages[stage].title}</h3>
          <p className="text-gray-200 text-sm sm:text-lg mb-3 sm:mb-4">{stages[stage].content}</p>

          {/* Interactive demonstrations based on stage */}
          {stage === 1 && (
            <div className="mt-3 sm:mt-4">
              <p className="text-gray-300 mb-2 sm:mb-3 text-sm sm:text-base">Click to charge the object:</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
                <div className="flex gap-2 sm:hidden">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChargeDemo('negative')}
                    className={`px-3 py-1.5 rounded-lg font-medium text-sm ${
                      chargeDemo === 'negative' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    − Add e⁻
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChargeDemo('positive')}
                    className={`px-3 py-1.5 rounded-lg font-medium text-sm ${
                      chargeDemo === 'positive' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    + Remove e⁻
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setChargeDemo('negative')}
                  className={`hidden sm:block px-4 py-2 rounded-lg font-medium ${
                    chargeDemo === 'negative' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Add Electrons (−)
                </motion.button>
                <motion.div
                  className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold border-4 ${
                    chargeDemo === 'neutral' ? 'bg-gray-600 border-gray-500' :
                    chargeDemo === 'positive' ? 'bg-red-600 border-red-400' :
                    'bg-blue-600 border-blue-400'
                  }`}
                  animate={{ 
                    scale: chargeDemo !== 'neutral' ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {chargeDemo === 'neutral' ? '⚪' : chargeDemo === 'positive' ? '+' : '−'}
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setChargeDemo('positive')}
                  className={`hidden sm:block px-4 py-2 rounded-lg font-medium ${
                    chargeDemo === 'positive' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Remove Electrons (+)
                </motion.button>
              </div>
              <p className="text-center text-gray-400 mt-3 text-sm">
                {chargeDemo === 'neutral' && 'Neutral: Equal protons and electrons'}
                {chargeDemo === 'positive' && 'Positive: Lost electrons (more protons)'}
                {chargeDemo === 'negative' && 'Negative: Gained electrons (more electrons)'}
              </p>
            </div>
          )}

          {stage === 2 && (
            <div className="mt-3 sm:mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-purple-900/50 rounded-lg p-3 sm:p-4 border border-purple-700">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mb-1 sm:mb-2" />
                  <h4 className="text-purple-300 font-bold mb-1 sm:mb-2 text-sm sm:text-base">Static Electricity</h4>
                  <ul className="text-gray-300 text-xs sm:text-sm space-y-0.5 sm:space-y-1">
                    <li>• Charges stay in place</li>
                    <li>• Brief discharge</li>
                    <li>• Lightning, shocks</li>
                  </ul>
                </div>
                <div className="bg-yellow-900/50 rounded-lg p-3 sm:p-4 border border-yellow-700">
                  <Battery className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mb-1 sm:mb-2" />
                  <h4 className="text-yellow-300 font-bold mb-1 sm:mb-2 text-sm sm:text-base">Current Electricity</h4>
                  <ul className="text-gray-300 text-xs sm:text-sm space-y-0.5 sm:space-y-1">
                    <li>• Charges flow continuously</li>
                    <li>• Sustained flow</li>
                    <li>• Powers all devices</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {stage === 3 && (
            <div className="mt-4">
              {/* Interactive Ohm's Law demo */}
              <div className="bg-gray-900/80 rounded-lg p-4">
                <div className="text-center mb-4">
                  <span className="text-3xl font-mono text-yellow-400">V = I  R</span>
                </div>
                
                {/* Circuit visualization */}
                <div className="relative h-32 bg-gray-950 rounded-lg mb-4 overflow-hidden">
                  {/* Battery */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
                    <Battery className="w-10 h-10 text-green-500" />
                    <span className="text-green-400 text-sm">{voltage}V</span>
                  </div>
                  
                  {/* Wire with flowing electrons */}
                  <svg className="absolute inset-0" viewBox="0 0 400 128">
                    {/* Wire path */}
                    <path
                      d="M 60 64 H 150 L 160 54 L 180 74 L 200 54 L 220 74 L 240 54 L 250 64 H 340"
                      fill="none"
                      stroke="#4B5563"
                      strokeWidth="4"
                    />
                    
                    {/* Flowing electrons */}
                    {voltage > 0 && electronPositions.map((pos, i) => (
                      <motion.circle
                        key={i}
                        r="4"
                        fill="#3B82F6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <animateMotion
                          dur={`${3 / (current + 0.1)}s`}
                          repeatCount="indefinite"
                          begin={`${i * 0.3}s`}
                        >
                          <mpath href="#electronPath" />
                        </animateMotion>
                      </motion.circle>
                    ))}
                    <path
                      id="electronPath"
                      d="M 60 64 H 150 L 160 54 L 180 74 L 200 54 L 220 74 L 240 54 L 250 64 H 340"
                      fill="none"
                      stroke="none"
                    />
                  </svg>
                  
                  {/* Light bulb */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
                    <Lightbulb 
                      className={`w-10 h-10 transition-colors duration-300 ${
                        current > 0 ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                      style={{
                        filter: current > 0 ? `drop-shadow(0 0 ${current * 10}px #FBBF24)` : 'none'
                      }}
                    />
                    <span className="text-blue-400 text-sm">{current.toFixed(2)}A</span>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 text-sm block mb-1">
                      Voltage (V): {voltage}V
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      step="1"
                      value={voltage}
                      onChange={(e) => setVoltage(Number(e.target.value))}
                      className="w-full accent-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm block mb-1">
                      Resistance (Ω): {resistance}Ω
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={resistance}
                      onChange={(e) => setResistance(Number(e.target.value))}
                      className="w-full accent-orange-500"
                    />
                  </div>
                </div>
                
                <div className="text-center mt-3 text-gray-300">
                  I = V/R = {voltage}/{resistance} = <span className="text-yellow-400 font-bold">{current.toFixed(2)}A</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Safety notice */}
      <motion.div 
        className="bg-red-900/30 border border-red-700 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start gap-2 sm:gap-3">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-400 font-bold text-sm sm:text-base">⚠️ Electrical Safety</h4>
            <p className="text-gray-300 text-xs sm:text-sm">
              Your country uses <strong>230V AC</strong> mains electricity - enough to be fatal!
              Always be careful around electrical installations. Report hazards to local authorities.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Key formulas */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-blue-900/50 rounded-lg p-2 sm:p-3 text-center border border-blue-700">
          <Gauge className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-blue-300 text-[10px] sm:text-sm">Current</p>
          <p className="text-white font-mono text-xs sm:text-base">I = Q/t</p>
        </div>
        <div className="bg-yellow-900/50 rounded-lg p-2 sm:p-3 text-center border border-yellow-700">
          <Battery className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-yellow-300 text-[10px] sm:text-sm">Voltage</p>
          <p className="text-white font-mono text-xs sm:text-base">V = W/Q</p>
        </div>
        <div className="bg-orange-900/50 rounded-lg p-2 sm:p-3 text-center border border-orange-700">
          <Thermometer className="w-4 h-4 sm:w-6 sm:h-6 text-orange-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-orange-300 text-[10px] sm:text-sm">Ohm&apos;s Law</p>
          <p className="text-white font-mono text-xs sm:text-base">V = IR</p>
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
                  i === stage ? 'bg-yellow-400' : 'bg-gray-600 hover:bg-gray-500'
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
                className="p-2 sm:px-4 sm:py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
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
                <Zap className="w-5 h-5 sm:w-4 sm:h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricityMagnetismConceptsIntro;
