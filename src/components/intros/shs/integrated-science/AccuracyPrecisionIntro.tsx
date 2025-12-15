'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ChevronRight, X } from 'lucide-react';

interface AccuracyPrecisionIntroProps {
  onComplete?: () => void;
  className?: string;
}

const scenes = [
  {
    id: 1,
    title: "The Quest for Perfect Measurements!",
    narration: "Imagine you're measuring the length of a pencil. You try three times and get fifteen centimeters, fifteen point one centimeters, and fourteen point nine centimeters. Are these good measurements? How close are they to the TRUE length? Today, you'll learn the difference between ACCURACY and PRECISION - two concepts every scientist must master!",
    bgGradient: "from-blue-600 via-purple-600 to-pink-600",
    emoji: "🎯",
    visual: 'intro',
  },
  {
    id: 2,
    title: "Accuracy: Hitting the Target",
    narration: "ACCURACY tells us how close a measurement is to the TRUE or ACCEPTED value. Think of archery - accuracy means hitting the bullseye! If a thermometer shows ninety-nine degrees Celsius for boiling water, it's accurate because boiling water is actually one hundred degrees. The closer to the true value, the more accurate!",
    bgGradient: "from-green-500 via-emerald-500 to-teal-500",
    emoji: "🎯",
    visual: 'accuracy',
  },
  {
    id: 3,
    title: "Precision: Consistency Matters",
    narration: "PRECISION tells us how close multiple measurements are TO EACH OTHER. Precise measurements are consistent and reproducible, even if they're not accurate! In archery, precision means all arrows landing close together - they might miss the bullseye, but they're grouped tightly. Precision shows the reliability of your technique!",
    bgGradient: "from-orange-500 via-amber-500 to-yellow-500",
    emoji: "🔄",
    visual: 'precision',
  },
  {
    id: 4,
    title: "The Four Combinations",
    narration: "Measurements can be: accurate AND precise - the best! Accurate but not precise - hit the bullseye sometimes. Precise but not accurate - consistent but wrong. Neither accurate nor precise - scattered everywhere! The goal of science is to achieve BOTH high accuracy AND high precision through proper technique and calibrated instruments!",
    bgGradient: "from-indigo-500 via-blue-500 to-cyan-500",
    emoji: "⚡",
    visual: 'combinations',
  },
  {
    id: 5,
    title: "Sources of Error",
    narration: "Errors affect our measurements! Systematic errors consistently push measurements in one direction - like a ruler that starts at one instead of zero. Random errors vary unpredictably - like shaky hands while measuring. Zero errors occur when instruments don't start at zero. Parallax error happens when you read a scale from an angle instead of eye level!",
    bgGradient: "from-red-500 via-rose-500 to-pink-500",
    emoji: "⚠️",
    visual: 'errors',
  },
  {
    id: 6,
    title: "Ready to Measure with Confidence!",
    narration: "Now you understand the foundations of quality measurement! You'll learn to distinguish accuracy from precision, identify and minimize errors, report measurements with appropriate significant figures, and evaluate the reliability of experimental data. These skills are essential for every scientist. Let's master measurement!",
    bgGradient: "from-violet-600 via-purple-500 to-indigo-600",
    emoji: "🏆",
    visual: 'ready',
  },
];

const targetScenarios = {
  accurate: { label: 'Accurate', description: 'Close to bullseye', positions: [[50, 50], [48, 52], [52, 48], [49, 51]], color: '#22c55e' },
  precise: { label: 'Precise', description: 'Grouped together', positions: [[25, 25], [27, 23], [24, 26], [26, 24]], color: '#f59e0b' },
  both: { label: 'Accurate & Precise', description: 'Best result!', positions: [[50, 50], [51, 49], [49, 51], [50, 51]], color: '#3b82f6' },
  neither: { label: 'Neither', description: 'Scattered', positions: [[20, 80], [75, 25], [30, 40], [60, 70]], color: '#ef4444' },
};

const errorTypes = [
  { type: 'Systematic', emoji: '📉', desc: 'Consistent offset', example: 'Uncalibrated scale' },
  { type: 'Random', emoji: '🎲', desc: 'Varies unpredictably', example: 'Shaky hands' },
  { type: 'Zero Error', emoji: '0️⃣', desc: 'Wrong starting point', example: 'Meter rule worn' },
  { type: 'Parallax', emoji: '👁️', desc: 'Wrong reading angle', example: 'Eye not at level' },
];

export default function AccuracyPrecisionIntro({ onComplete, className }: AccuracyPrecisionIntroProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [animatedIndex, setAnimatedIndex] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentSceneRef = useRef(currentScene);

  useEffect(() => { currentSceneRef.current = currentScene; }, [currentScene]);
  useEffect(() => { const interval = setInterval(() => setAnimatedIndex(prev => (prev + 1) % 4), 800); return () => clearInterval(interval); }, []);

  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; utterance.pitch = 1; utterance.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;
    utteranceRef.current = utterance;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => { setIsSpeaking(false); if (isPlaying && currentSceneRef.current < scenes.length - 1) setTimeout(() => setCurrentScene(p => p + 1), 1500); };
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [isMuted, isPlaying]);

  useEffect(() => { if (typeof window !== 'undefined' && window.speechSynthesis) { window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices(); } }, []);
  useEffect(() => { if (isPlaying) speakText(scenes[currentScene].narration); return () => { if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel(); }; }, [currentScene, isPlaying, speakText]);

  const handleNext = () => { if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel(); if (currentScene < scenes.length - 1) setCurrentScene(p => p + 1); else onComplete?.(); };
  const handlePrev = () => { if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel(); if (currentScene > 0) setCurrentScene(p => p - 1); };
  const handleSkipIntro = () => { if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel(); onComplete?.(); };
  const togglePlayPause = () => { if (isPlaying && typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel(); setIsPlaying(!isPlaying); };
  const toggleMute = () => { if (!isMuted && typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel(); setIsMuted(!isMuted); };

  const scene = scenes[currentScene];

  const TargetBoard = ({ scenario }: { scenario: keyof typeof targetScenarios }) => {
    const { positions, color, label, description } = targetScenarios[scenario];
    return (
      <div className="relative">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/30 relative" style={{ background: 'radial-gradient(circle, #fff 0%, #fff 20%, #ef4444 20%, #ef4444 40%, #fff 40%, #fff 50%, #ef4444 50%, #ef4444 70%, #fff 70%)' }}>
          {positions.map((pos, i) => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.15 }} className="absolute w-3 h-3 rounded-full" style={{ left: `${pos[0]}%`, top: `${pos[1]}%`, transform: 'translate(-50%, -50%)', backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
          ))}
        </div>
        <div className="text-white text-sm mt-2 font-bold">{label}</div>
        <div className="text-white/70 text-xs">{description}</div>
      </div>
    );
  };

  return (
    <div className={`relative w-full min-h-[500px] md:min-h-[600px] rounded-2xl overflow-hidden ${className}`}>
      <motion.div key={scene.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`absolute inset-0 bg-gradient-to-br ${scene.bgGradient}`} />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🎯', '📏', '📐', '⚖️', '🔬', '📊', '✅', '❌'].map((emoji, i) => (
          <motion.div key={i} className="absolute text-2xl md:text-3xl opacity-20" initial={{ x: Math.random() * 100 + '%', y: '100%' }} animate={{ y: '-10%', x: `${Math.random() * 100}%` }} transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, delay: i * 2, ease: 'linear' }}>{emoji}</motion.div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div key={scene.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="text-center max-w-4xl w-full">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="text-6xl md:text-8xl mb-4">{scene.emoji}</motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg px-4">{scene.title}</motion.h2>

            {scene.visual === 'intro' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6 px-4">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                  <div className="flex justify-center gap-6 mb-3">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-center">
                      <div className="text-4xl">📏</div>
                      <div className="text-white text-sm">15 cm</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="text-center">
                      <div className="text-4xl">📏</div>
                      <div className="text-white text-sm">15.1 cm</div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="text-center">
                      <div className="text-4xl">📏</div>
                      <div className="text-white text-sm">14.9 cm</div>
                    </motion.div>
                  </div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="bg-purple-500/40 text-white font-bold py-2 px-4 rounded-full inline-block">🤔 Are these measurements good?</motion.div>
                </div>
              </motion.div>
            )}

            {scene.visual === 'accuracy' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6 px-4">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                  <div className="flex justify-center mb-3">
                    <TargetBoard scenario="accurate" />
                  </div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-green-500/30 rounded-lg p-2"><span className="text-white text-sm">✅ True value: 100°C</span></div>
                    <div className="bg-green-500/30 rounded-lg p-2"><span className="text-white text-sm">✅ Measured: 99°C (Accurate!)</span></div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {scene.visual === 'precision' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6 px-4">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                  <div className="flex justify-center mb-3">
                    <TargetBoard scenario="precise" />
                  </div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="bg-orange-500/30 rounded-lg p-2">
                    <span className="text-white text-sm">🔄 All arrows grouped together - consistent but missed bullseye!</span>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {scene.visual === 'combinations' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6 px-4">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(Object.keys(targetScenarios) as Array<keyof typeof targetScenarios>).map((key, i) => (
                      <motion.div key={key} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: animatedIndex === i ? 1.05 : 1 }} transition={{ delay: 0.4 + i * 0.1 }}>
                        <TargetBoard scenario={key} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {scene.visual === 'errors' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6 px-4">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {errorTypes.map((error, i) => (
                      <motion.div key={error.type} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, scale: animatedIndex === i ? 1.08 : 1 }} transition={{ delay: 0.4 + i * 0.1 }} className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-2xl mb-1">{error.emoji}</div>
                        <div className="text-white font-bold text-sm">{error.type}</div>
                        <div className="text-white/80 text-xs">{error.desc}</div>
                        <div className="text-white/60 text-xs mt-1 italic">{error.example}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {scene.visual === 'ready' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6 px-4">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {['✅ Distinguish accuracy & precision', '✅ Identify error types', '✅ Minimize measurement errors', '✅ Report significant figures', '✅ Evaluate data reliability', '✅ Improve experiment quality'].map((item, i) => (
                      <motion.div key={item} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="bg-white/20 rounded-lg p-2 text-white text-sm text-left">{item}</motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-white/90 text-sm md:text-lg px-4 max-w-2xl mx-auto leading-relaxed">{scene.narration}</motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute top-4 left-4 right-16 flex gap-1 pointer-events-none">{scenes.map((_, index) => (<div key={index} className={`h-1 flex-1 rounded-full transition-all ${index <= currentScene ? 'bg-white' : 'bg-white/30'}`} />))}</div>
      <Button onClick={(e) => { e.stopPropagation(); handleSkipIntro(); }} variant="ghost" size="sm" className="absolute top-4 right-4 text-white hover:!text-white bg-transparent hover:!bg-white/20 active:!bg-white/30 rounded-full px-3 py-1 text-sm z-50">Skip Intro <X className="ml-1 h-4 w-4" /></Button>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-50">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} className="text-white hover:!text-white bg-transparent hover:!bg-white/20 active:!bg-white/30 rounded-full">{isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}</Button>
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toggleMute(); }} className="text-white hover:!text-white bg-transparent hover:!bg-white/20 active:!bg-white/30 rounded-full">{isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handlePrev(); }} disabled={currentScene === 0} className="text-white hover:!text-white bg-transparent hover:!bg-white/20 active:!bg-white/30 rounded-full px-3 disabled:opacity-40"><SkipBack className="mr-1 h-4 w-4" /> Prev</Button>
          <span className="text-white/80 text-sm min-w-[50px] text-center">{currentScene + 1} / {scenes.length}</span>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleNext(); }} className="text-white hover:!text-white bg-transparent hover:!bg-white/20 active:!bg-white/30 rounded-full px-3">{currentScene < scenes.length - 1 ? (<>Next <SkipForward className="ml-1 h-4 w-4" /></>) : (<>Start Learning <ChevronRight className="ml-1 h-4 w-4" /></>)}</Button>
        </div>
      </div>

      {isSpeaking && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-12 right-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 pointer-events-none"><motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-green-400 rounded-full" /><span className="text-white text-xs">Speaking...</span></motion.div>)}
    </div>
  );
}
