'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Battery, Lightbulb, AlertTriangle, ArrowRight, Gauge, Thermometer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonIntroProps {
  onComplete?: () => void;
}

const ElectricityMagnetismConceptsIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [voltage, setVoltage] = useState(0);
  const [current, setCurrent] = useState(0);
  const [resistance, setResistance] = useState(10);
  const [chargeDemo, setChargeDemo] = useState<'neutral' | 'positive' | 'negative'>('neutral');
  const [electronPositions, setElectronPositions] = useState<number[]>([]);

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

  const stages = [
    {
      title: "⚡ Welcome to Electricity!",
      content: "Electricity powers our modern world - from your phone to Ghana's national grid!"
    },
    {
      title: "🔋 What is Electric Charge?",
      content: "All matter is made of atoms with positive protons and negative electrons."
    },
    {
      title: "⚡ Static vs Current",
      content: "Charges can stay still (static) or flow continuously (current electricity)."
    },
    {
      title: "📐 Ohm's Law",
      content: "V = IR - The most important equation in basic electricity!"
    }
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-yellow-900/30 via-gray-900 to-blue-900/30 rounded-2xl p-8 overflow-hidden">
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
        className="text-center mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <Zap className="w-10 h-10 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white">
            Electricity & Magnetism
          </h2>
          <Lightbulb className="w-10 h-10 text-yellow-300" />
        </div>
        <p className="text-yellow-200 text-lg">Charge, Current, Voltage & Resistance</p>
      </motion.div>

      {/* Stage content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-gray-800/80 rounded-xl p-6 mb-6"
        >
          <h3 className="text-2xl font-bold text-yellow-400 mb-3">{stages[stage].title}</h3>
          <p className="text-gray-200 text-lg mb-4">{stages[stage].content}</p>

          {/* Interactive demonstrations based on stage */}
          {stage === 1 && (
            <div className="mt-4">
              <p className="text-gray-300 mb-3">Click to charge the object:</p>
              <div className="flex items-center justify-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setChargeDemo('negative')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    chargeDemo === 'negative' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Add Electrons (−)
                </motion.button>
                <motion.div
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 ${
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
                  className={`px-4 py-2 rounded-lg font-medium ${
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
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-900/50 rounded-lg p-4 border border-purple-700">
                  <Zap className="w-8 h-8 text-purple-400 mb-2" />
                  <h4 className="text-purple-300 font-bold mb-2">Static Electricity</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Charges stay in place</li>
                    <li>• Brief discharge</li>
                    <li>• Lightning, shocks</li>
                  </ul>
                </div>
                <div className="bg-yellow-900/50 rounded-lg p-4 border border-yellow-700">
                  <Battery className="w-8 h-8 text-yellow-400 mb-2" />
                  <h4 className="text-yellow-300 font-bold mb-2">Current Electricity</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
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
                  <span className="text-3xl font-mono text-yellow-400">V = I × R</span>
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

      {/* Ghana safety notice */}
      <motion.div 
        className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-400 font-bold">⚠️ Safety in Ghana</h4>
            <p className="text-gray-300 text-sm">
              Ghana uses <strong>230V AC</strong> mains electricity - enough to be fatal!
              Always be careful around electrical installations. Report fallen power lines to ECG.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Key formulas */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-900/50 rounded-lg p-3 text-center border border-blue-700">
          <Gauge className="w-6 h-6 text-blue-400 mx-auto mb-1" />
          <p className="text-blue-300 text-sm">Current</p>
          <p className="text-white font-mono">I = Q/t</p>
        </div>
        <div className="bg-yellow-900/50 rounded-lg p-3 text-center border border-yellow-700">
          <Battery className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
          <p className="text-yellow-300 text-sm">Voltage</p>
          <p className="text-white font-mono">V = W/Q</p>
        </div>
        <div className="bg-orange-900/50 rounded-lg p-3 text-center border border-orange-700">
          <Thermometer className="w-6 h-6 text-orange-400 mx-auto mb-1" />
          <p className="text-orange-300 text-sm">Ohm&apos;s Law</p>
          <p className="text-white font-mono">V = IR</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {stages.map((_, i) => (
            <button
              key={i}
              onClick={() => setStage(i)}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === stage ? 'bg-yellow-400' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
        
        <div className="flex gap-3">
          {stage > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStage(stage - 1)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium"
            >
              Previous
            </motion.button>
          )}
          
          {stage < stages.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStage(stage + 1)}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white font-medium flex items-center gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium flex items-center gap-2"
            >
              Start Learning! <Zap className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElectricityMagnetismConceptsIntro;
