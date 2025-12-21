'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, ArrowDown, ArrowUp, Scale, Gauge, 
  Play, Pause, Volume2, VolumeX, GraduationCap,
  ChevronLeft, ChevronRight
} from 'lucide-react'

interface LessonIntroProps {
  onComplete?: () => void
}

const WorkEnergyIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0)
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const hasSpokenRef = useRef<Set<number>>(new Set())

  const stages = [
    {
      title: "⚡ Work & Energy",
      content: "Nature's accounting system",
      narration: "Imagine pushing a car up a hill. That effort you put in doesn't just disappear - it's stored as energy! Energy is nature's currency, constantly transforming from one form to another but never created or destroyed. This fundamental principle, the Law of Conservation of Energy, governs everything from falling raindrops to rockets launching into space.",
      highlightWords: ['energy', 'stored', 'transforming', 'Conservation', 'fundamental']
    },
    {
      title: "🏔️ Potential Energy",
      content: "Energy of position",
      narration: "When you lift an object high, you're giving it potential energy - stored energy waiting to be released. The formula PE equals m g h tells us that heavier objects or greater heights mean more stored energy. At Akosombo Dam, billions of liters of elevated water hold enormous potential energy, ready to power Ghana's cities!",
      highlightWords: ['potential', 'stored', 'height', 'Akosombo', 'power']
    },
    {
      title: "💨 Kinetic Energy",
      content: "Energy of motion",
      narration: "Once that object starts falling, its potential energy transforms into kinetic energy - the energy of motion. The formula KE equals one-half m v squared shows something fascinating: doubling the speed quadruples the kinetic energy! This is why car crashes at high speeds are so devastating, and why engineers carefully design brakes and safety systems.",
      highlightWords: ['kinetic', 'motion', 'speed', 'quadruples', 'engineers']
    },
    {
      title: "🔄 Energy Transformation",
      content: "The beautiful exchange",
      narration: "Watch a roller coaster: at the peak, it's all potential energy. As it plunges down, that potential converts to kinetic, making riders scream with excitement! But here's the magic - the total energy stays constant. PE plus KE always equals the same value. Energy isn't lost, it just changes costume!",
      highlightWords: ['transforms', 'converts', 'constant', 'magic', 'changes']
    },
    {
      title: "🎢 Real Applications",
      content: "Energy in our world",
      narration: "This principle powers our daily lives. Hydroelectric dams convert water's potential energy to electricity. Regenerative brakes in electric vehicles capture kinetic energy. Even the food you eat stores chemical potential energy that becomes kinetic energy when you run. Understanding energy conservation is key to solving Ghana's energy challenges and building a sustainable future!",
      highlightWords: ['hydroelectric', 'electricity', 'vehicles', 'sustainable', 'future']
    }
  ]

  // Speech synthesis
  const speakNarration = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis || isMuted) return
    
    window.speechSynthesis.cancel()
    
    const narration = stages[stage].narration
    const utterance = new SpeechSynthesisUtterance(narration)
    
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1.0
    
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google'))
    ) || voices.find(v => v.lang.startsWith('en'))
    if (preferredVoice) utterance.voice = preferredVoice
    
    let wordIndex = 0
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentWordIndex(wordIndex)
        wordIndex++
      }
    }
    
    utterance.onstart = () => { setIsSpeaking(true); setIsPaused(false) }
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); setCurrentWordIndex(-1) }
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false) }
    
    speechRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [stage, isMuted, stages])

  useEffect(() => {
    if (!hasSpokenRef.current.has(stage) && !isMuted) {
      const timer = setTimeout(() => {
        speakNarration()
        hasSpokenRef.current.add(stage)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [stage, speakNarration, isMuted])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const togglePause = () => {
    if (!window.speechSynthesis) return
    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    } else {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }

  const toggleMute = () => {
    if (!isMuted && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
    setIsMuted(!isMuted)
    hasSpokenRef.current.clear()
  }

  const handleStageChange = (newStage: number) => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
    setCurrentWordIndex(-1)
    setStage(newStage)
  }

  const renderHighlightedText = () => {
    const words = stages[stage].narration.split(' ')
    const highlightWords = stages[stage].highlightWords
    
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?]/g, '').toLowerCase()
      const isHighlightWord = highlightWords.some(hw => cleanWord.includes(hw.toLowerCase()))
      const isCurrentWord = index === currentWordIndex
      
      return (
        <span
          key={index}
          className={`transition-all duration-150 ${
            isCurrentWord 
              ? 'bg-blue-400/40 text-white font-semibold px-0.5 rounded' 
              : isHighlightWord 
                ? 'text-cyan-300 font-medium'
                : 'text-gray-300'
          }`}
        >
          {word}{' '}
        </span>
      )
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Teacher Narration Panel */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-6 text-white"
        >
          <div className="flex items-start gap-4">
            <motion.div
              animate={isSpeaking ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex-shrink-0"
            >
              <div className="bg-white/20 backdrop-blur p-3 rounded-full">
                <GraduationCap className="w-8 h-8" />
              </div>
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">Your Teacher</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePause}
                    disabled={!isSpeaking}
                    className="p-2 hover:bg-white/20 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title={isPaused ? "Resume" : "Pause"}
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-2 hover:bg-white/20 rounded-lg transition"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="text-sm sm:text-base leading-relaxed">
                {renderHighlightedText()}
              </div>
              
              {isSpeaking && (
                <motion.div
                  className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-full bg-cyan-300"
                    animate={{ width: ["0%", "100%"] }}
                    transition={{ duration: 15, ease: "linear" }}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stage Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex items-center justify-between bg-white rounded-xl shadow-lg p-4"
        >
          <button
            onClick={() => handleStageChange(Math.max(0, stage - 1))}
            disabled={stage === 0}
            className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-gray-800">{stages[stage].title}</div>
            <div className="text-sm text-gray-600">{stages[stage].content}</div>
            <div className="flex justify-center gap-2 mt-2">
              {stages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStageChange(idx)}
                  className={`w-2 h-2 rounded-full transition ${
                    idx === stage ? 'bg-purple-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <button
            onClick={() => {
              if (stage === stages.length - 1 && onComplete) {
                onComplete()
              } else {
                handleStageChange(Math.min(stages.length - 1, stage + 1))
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </motion.div>

        {/* Hero Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block p-4 bg-purple-100 rounded-full mb-4"
            >
              <Zap className="w-16 h-16 text-purple-600" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Work & Energy on an Inclined Plane
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the Law of Conservation of Energy as potential energy transforms into kinetic energy
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Interactive Visual Component */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            {/* Energy Transformation Animation - Stage 0 */}
            {stage === 0 && (
              <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/30 rounded-2xl p-8 border border-purple-500/30">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Energy Transformation
                </h2>
                
                <div className="relative h-64 bg-black/40 rounded-xl p-4 overflow-hidden mb-6">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    {/* Ramp */}
                    <defs>
                      <linearGradient id="rampGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    <path d="M 50 50 L 350 180" stroke="#6366F1" strokeWidth="4" fill="none" />
                    <path d="M 50 50 L 350 180 L 350 185 L 50 185 Z" fill="url(#rampGradient)" />
                    <line x1="0" y1="185" x2="400" y2="185" stroke="#9CA3AF" strokeWidth="2" />

                    {/* Animated Ball */}
                    <motion.circle
                      cx={50} cy={50} r={12} fill="#EF4444"
                      animate={{ cx: [50, 350], cy: [50, 180] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeIn" }}
                    />

                    {/* PE Label */}
                    <motion.g
                      animate={{ opacity: [1, 1, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, times: [0, 0.3, 1] }}
                    >
                      <rect x="20" y="20" width="60" height="25" fill="#8B5CF6" rx="4" />
                      <text x="50" y="37" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">Max PE</text>
                    </motion.g>

                    {/* KE Label */}
                    <motion.g
                      animate={{ opacity: [0, 0, 1, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, times: [0, 0.7, 0.85, 1] }}
                    >
                      <rect x="310" y="155" width="60" height="25" fill="#EF4444" rx="4" />
                      <text x="340" y="172" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">Max KE</text>
                    </motion.g>

                    <line x1="30" y1="50" x2="30" y2="185" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4 4" />
                    <text x="25" y="125" fontSize="11" fill="#9CA3AF">h</text>
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                    <ArrowUp className="w-6 h-6 text-purple-400 mb-2" />
                    <h3 className="font-bold text-white mb-1">Potential Energy</h3>
                    <p className="text-sm text-gray-300 mb-2">Energy of position</p>
                    <div className="bg-black/40 rounded px-3 py-2 font-mono text-purple-300">PE = mgh</div>
                  </div>
                  <div className="bg-red-900/30 p-4 rounded-lg border border-red-500/30">
                    <Gauge className="w-6 h-6 text-red-400 mb-2" />
                    <h3 className="font-bold text-white mb-1">Kinetic Energy</h3>
                    <p className="text-sm text-gray-300 mb-2">Energy of motion</p>
                    <div className="bg-black/40 rounded px-3 py-2 font-mono text-red-300">KE = ½mv²</div>
                  </div>
                </div>
              </div>
            )}

            {/* Potential Energy Demo - Stage 1 */}
            {stage === 1 && (
              <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Potential Energy Calculator
                </h2>
                
                <div className="bg-black/40 rounded-xl p-6 mb-4">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-white text-sm mb-2">Mass (kg)</p>
                      <div className="bg-purple-600 rounded-lg p-4">
                        <Scale className="w-8 h-8 mx-auto text-white mb-1" />
                        <p className="text-2xl font-bold text-white">2.0</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-white text-sm mb-2">Height (m)</p>
                      <div className="bg-blue-600 rounded-lg p-4">
                        <ArrowUp className="w-8 h-8 mx-auto text-white mb-1" />
                        <p className="text-2xl font-bold text-white">5.0</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-white text-sm mb-2">PE (J)</p>
                      <div className="bg-indigo-600 rounded-lg p-4">
                        <Zap className="w-8 h-8 mx-auto text-white mb-1" />
                        <p className="text-2xl font-bold text-white">98</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 font-mono">PE = mgh = 2.0 × 9.81 × 5.0 = 98 J</p>
                  </div>
                </div>
                <p className="text-white text-center">
                  At Akosombo Dam, billions of liters hold enormous potential energy!
                </p>
              </div>
            )}

            {/* Kinetic Energy Demo - Stage 2 */}
            {stage === 2 && (
              <div className="bg-gradient-to-br from-red-900/40 to-orange-900/30 rounded-2xl p-8 border border-red-500/30">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Kinetic Energy & Speed
                </h2>
                
                <div className="bg-black/40 rounded-xl p-6 mb-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-red-900/30 p-4 rounded-lg">
                      <span className="text-white">Speed: 10 m/s</span>
                      <span className="text-red-300 font-bold">KE = 100 J</span>
                    </div>
                    <div className="flex items-center justify-between bg-orange-900/30 p-4 rounded-lg border-2 border-yellow-500">
                      <span className="text-white">Speed: 20 m/s (2× speed)</span>
                      <span className="text-yellow-300 font-bold">KE = 400 J (4× energy!)</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-gray-300 font-mono mb-2">KE = ½mv²</p>
                    <p className="text-yellow-300 text-sm">Doubling speed quadruples the energy!</p>
                  </div>
                </div>
                <p className="text-white text-center">
                  This is why car crashes at high speeds are so devastating
                </p>
              </div>
            )}

            {/* Energy Conservation Demo - Stage 3 */}
            {stage === 3 && (
              <div className="bg-gradient-to-br from-green-900/40 to-cyan-900/30 rounded-2xl p-8 border border-green-500/30">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Conservation in Action
                </h2>
                
                <div className="bg-black/40 rounded-xl p-6 mb-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-purple-900/30 rounded-lg">
                      <span className="text-white">At Top:</span>
                      <span className="text-purple-300">PE = 100 J, KE = 0 J</span>
                      <span className="text-cyan-300 font-bold">Total = 100 J</span>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center justify-between p-4 bg-blue-900/30 rounded-lg"
                    >
                      <span className="text-white">Halfway:</span>
                      <span className="text-blue-300">PE = 50 J, KE = 50 J</span>
                      <span className="text-cyan-300 font-bold">Total = 100 J</span>
                    </motion.div>
                    <div className="flex items-center justify-between p-4 bg-red-900/30 rounded-lg">
                      <span className="text-white">At Bottom:</span>
                      <span className="text-red-300">PE = 0 J, KE = 100 J</span>
                      <span className="text-cyan-300 font-bold">Total = 100 J</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-cyan-300 font-bold">PE + KE = Constant</p>
                  </div>
                </div>
                <p className="text-white text-center">
                  Energy transforms but the total never changes!
                </p>
              </div>
            )}

            {/* Real Applications - Stage 4 */}
            {stage === 4 && (
              <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 rounded-2xl p-8 border border-indigo-500/30">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Energy in Ghana
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-4 rounded-lg">
                    <span className="text-3xl">💧</span>
                    <h3 className="text-white font-bold mt-2">Hydroelectric</h3>
                    <p className="text-sm text-gray-300">Akosombo Dam converts water's PE to electricity</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg">
                    <span className="text-3xl">🚗</span>
                    <h3 className="text-white font-bold mt-2">Regenerative Brakes</h3>
                    <p className="text-sm text-gray-300">Electric vehicles capture KE back to battery</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg">
                    <span className="text-3xl">🍎</span>
                    <h3 className="text-white font-bold mt-2">Food Energy</h3>
                    <p className="text-sm text-gray-300">Chemical PE becomes KE when you run</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg">
                    <span className="text-3xl">🌱</span>
                    <h3 className="text-white font-bold mt-2">Sustainable Future</h3>
                    <p className="text-sm text-gray-300">Understanding energy solves Ghana's challenges</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Key Concepts Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
          >
            <Scale className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Conservation Law</h3>
            <p className="text-purple-100">
              Total energy remains constant. PE + KE = constant throughout the motion.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
          >
            <ArrowDown className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Energy Transform</h3>
            <p className="text-blue-100">
              As height decreases, PE converts to KE. The object speeds up as it descends.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
          >
            <Zap className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Final Speed</h3>
            <p className="text-indigo-100">
              Final speed v = √(2gh) depends only on height, not mass!
            </p>
          </motion.div>
        </div>

        {/* Learning Objectives */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            What You'll Learn
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Understand the Law of Conservation of Energy",
              "Calculate potential energy using PE = mgh",
              "Calculate kinetic energy using KE = ½mv²",
              "Observe energy transformation from PE to KE",
              "Analyze how height affects final speed",
              "Recognize that total mechanical energy stays constant"
            ].map((objective, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700">{objective}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Real-World Applications */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-6">Real-World Applications</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <h3 className="font-bold mb-2">🎢 Roller Coasters</h3>
              <p className="text-sm text-purple-100">
                Engineers use energy conservation to design thrilling rides that convert PE at peaks into exciting KE in valleys.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <h3 className="font-bold mb-2">💧 Hydroelectric Dams</h3>
              <p className="text-sm text-purple-100">
                Water's PE at height is converted to KE, spinning turbines to generate electricity for cities.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <h3 className="font-bold mb-2">🪂 Skydiving</h3>
              <p className="text-sm text-purple-100">
                Skydivers convert gravitational PE into KE, reaching terminal velocity when air resistance balances gravity.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Formula Reference Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8 bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Key Formulas
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
              <h3 className="font-bold text-purple-900 mb-3">Potential Energy</h3>
              <div className="text-2xl font-mono font-bold text-purple-700 mb-2">
                PE = mgh
              </div>
              <p className="text-sm text-gray-600">
                m = mass (kg)<br />
                g = 9.81 m/s²<br />
                h = height (m)
              </p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-xl border-2 border-red-200">
              <h3 className="font-bold text-red-900 mb-3">Kinetic Energy</h3>
              <div className="text-2xl font-mono font-bold text-red-700 mb-2">
                KE = ½mv²
              </div>
              <p className="text-sm text-gray-600">
                m = mass (kg)<br />
                v = velocity (m/s)
              </p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
              <h3 className="font-bold text-blue-900 mb-3">Final Speed</h3>
              <div className="text-2xl font-mono font-bold text-blue-700 mb-2">
                v = √(2gh)
              </div>
              <p className="text-sm text-gray-600">
                g = 9.81 m/s²<br />
                h = height (m)<br />
                Independent of mass!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Ready to Experiment */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-8 text-center p-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Ready to Explore?
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            In this interactive lab, you'll adjust mass and height to see how energy transforms in real-time!
          </p>
          <div className="flex items-center justify-center gap-2 text-purple-700 font-semibold">
            <Zap className="w-5 h-5" />
            <span>Click "Continue to Lesson" to begin your energy experiment</span>
            <Zap className="w-5 h-5" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default WorkEnergyIntro
