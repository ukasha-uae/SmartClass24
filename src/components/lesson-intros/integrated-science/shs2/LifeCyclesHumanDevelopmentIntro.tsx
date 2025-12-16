'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Baby, User, Heart, Users, Brain, Sparkles, Play, Pause, Volume2, VolumeX, GraduationCap, ArrowRight, ArrowUp, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonIntroProps {
  onComplete?: () => void;
}

const LifeCyclesHumanDevelopmentIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  
  // Interactive state for demonstrations
  const [lifeStage, setLifeStage] = useState(0);
  const [growthMetric, setGrowthMetric] = useState<'height' | 'brain' | 'skills'>('height');
  const [pubertySex, setPubertySex] = useState<'male' | 'female'>('male');
  
  // Teacher narration states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasSpokenRef = useRef<Set<number>>(new Set());

  // Life stages data with Ghana context
  const lifeStages = [
    { name: 'Prenatal', age: '0-9 months', emoji: '🤰', color: 'bg-pink-500', height: 0.5, brain: 25, desc: 'In the womb' },
    { name: 'Infancy', age: '0-2 years', emoji: '👶', color: 'bg-blue-400', height: 0.85, brain: 70, desc: 'Rapid growth' },
    { name: 'Early Childhood', age: '2-6 years', emoji: '🧒', color: 'bg-green-400', height: 1.1, brain: 90, desc: 'Learning basics' },
    { name: 'Middle Childhood', age: '6-12 years', emoji: '👦', color: 'bg-yellow-400', height: 1.4, brain: 95, desc: 'School years' },
    { name: 'Adolescence', age: '12-18 years', emoji: '🧑‍🎓', color: 'bg-purple-500', height: 1.65, brain: 98, desc: 'Puberty & growth' },
    { name: 'Adulthood', age: '18-65 years', emoji: '👨', color: 'bg-blue-600', height: 1.7, brain: 100, desc: 'Peak maturity' },
    { name: 'Old Age', age: '65+ years', emoji: '👴', color: 'bg-gray-500', height: 1.65, brain: 95, desc: 'Wisdom years' },
  ];

  // Puberty changes
  const pubertyChanges = {
    male: [
      { change: 'Voice deepens', icon: '🔊' },
      { change: 'Facial hair grows', icon: '🧔' },
      { change: 'Muscles develop', icon: '💪' },
      { change: 'Growth spurt', icon: '📈' },
      { change: 'Body hair', icon: '🦱' },
    ],
    female: [
      { change: 'Breast development', icon: '👚' },
      { change: 'Menstruation begins', icon: '🩸' },
      { change: 'Hips widen', icon: '🚶‍♀️' },
      { change: 'Growth spurt', icon: '📈' },
      { change: 'Body changes', icon: '✨' },
    ]
  };

  const stages = [
    {
      title: "❤️ The Human Journey",
      content: "From a single cell to YOU - explore the incredible stages of human life!",
      narration: "You are a MIRACLE of development! From the moment a sperm met an egg to create a single cell, you've undergone billions of cell divisions and countless transformations to become the person you are today. And you're STILL developing - your brain won't fully mature until your mid-twenties! Understanding human development helps you appreciate where you've been, understand where you are NOW in adolescence, and prepare for the stages ahead. In Ghana, this knowledge is essential for healthcare workers, teachers, parents, and for making smart decisions about your own health and future!",
      highlightWords: ['miracle', 'transformations', 'developing', 'adolescence', 'healthcare', 'Ghana']
    },
    {
      title: "🤰 Prenatal Development",
      content: "Nine months of incredible growth - from single cell to baby!",
      narration: "Life begins with FERTILIZATION - when a sperm cell from the father meets an egg cell from the mother. This single-celled ZYGOTE contains all your genetic information! Over nine months, it divides and develops through three stages. First, the GERMINAL stage where the cell divides and implants in the uterus. Then the EMBRYONIC stage where all major organs begin forming - this is why pregnant women must avoid alcohol, certain drugs, and malaria! Finally, the FETAL stage where everything grows and matures. In Ghana, antenatal care at clinics is CRUCIAL - regular checkups, proper nutrition, iron tablets, and malaria prevention save lives. A healthy pregnancy leads to a healthy baby!",
      highlightWords: ['fertilization', 'zygote', 'germinal', 'embryonic', 'fetal', 'antenatal', 'malaria']
    },
    {
      title: "📊 Growth Through Life",
      content: "Watch how height, brain size, and abilities change at each stage!",
      narration: "Growth isn't just getting taller! Your body, brain, and abilities all develop at different rates. In INFANCY, your brain grows incredibly fast - reaching seventy percent of adult size by age two! Your HEIGHT follows an S-shaped curve: slow before birth, rapid in infancy, steady in childhood, a GROWTH SPURT during puberty, then leveling off. Your SKILLS develop in sequence: first you learn to control your head, then sit, crawl, stand, walk, and finally run and jump. Each stage builds on the previous one. In Ghana, Child Welfare Clinics track these milestones to ensure children are developing normally. Use the buttons to explore how different metrics change across life stages!",
      highlightWords: ['brain', 'seventy percent', 'height', 'growth spurt', 'skills', 'milestones']
    },
    {
      title: "🧬 Puberty: Your Stage NOW!",
      content: "The dramatic changes of adolescence - hormones transform your body and mind!",
      narration: "PUBERTY is the bridge from childhood to adulthood, and YOU are living it right now! Hormones - chemical messengers in your blood - trigger dramatic changes. For males, TESTOSTERONE causes voice deepening, facial hair, muscle growth, and sperm production. For females, ESTROGEN and PROGESTERONE cause breast development, hip widening, and menstruation - the monthly cycle preparing the body for potential pregnancy. Both sexes experience growth spurts, body hair, and emotional intensity. These changes typically happen between ages nine and sixteen, but EVERYONE'S TIMELINE IS DIFFERENT - some develop early, some late, and both are perfectly normal! In Ghana, schools teach comprehensive sexuality education to help you understand these changes and make healthy choices.",
      highlightWords: ['puberty', 'hormones', 'testosterone', 'estrogen', 'menstruation', 'growth spurts', 'normal']
    },
    {
      title: "🧠 Brain Development",
      content: "Your brain is still under construction - and that's a good thing!",
      narration: "Here's something AMAZING: your brain won't be fully developed until around age twenty-five! During adolescence, your PREFRONTAL CORTEX - the part responsible for decision-making, impulse control, and understanding consequences - is still maturing. This explains why teenagers sometimes take risks or make emotional decisions. But this also means your brain is incredibly PLASTIC - it can learn and adapt like never before! The synapses you use get stronger, the ones you don't get pruned away. So what you learn NOW, the habits you form NOW, literally shape your brain for life. Use this time wisely! Study hard, learn skills, avoid harmful substances that can damage your developing brain. Your future self will thank you!",
      highlightWords: ['prefrontal cortex', 'decision-making', 'impulse control', 'plastic', 'synapses', 'developing brain']
    }
  ];

  // Speech synthesis functions
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
    setLifeStage(0);
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
              ? 'bg-pink-400/40 text-white font-semibold px-0.5 rounded' 
              : isHighlightWord 
                ? 'text-pink-300 font-medium'
                : 'text-gray-300'
          }`}
        >
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-pink-900/30 via-gray-900 to-purple-900/30 rounded-2xl p-4 sm:p-6 md:p-8 pb-24 sm:pb-28 overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['❤️', '🧬', '🧠', '✨', '👶'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0],
              x: [Math.random() * 100, Math.random() * 300],
              y: [Math.random() * 50, Math.random() * 200]
            }}
            transition={{ 
              duration: 5,
              delay: i * 1.2,
              repeat: Infinity,
              repeatDelay: 2
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
          <Heart className="w-6 h-6 sm:w-10 sm:h-10 text-pink-400" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Human Development
          </h2>
          <Baby className="w-6 h-6 sm:w-10 sm:h-10 text-pink-300" />
        </div>
        <p className="text-pink-200 text-sm sm:text-lg">From Conception to Old Age</p>
      </motion.div>

      {/* Teacher Avatar & Narration */}
      <motion.div 
        className="bg-gradient-to-r from-pink-900/40 to-purple-900/40 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-pink-700/50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-start gap-2 sm:gap-4">
          <div className="flex-shrink-0">
            <motion.div 
              className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center ${
                isSpeaking && !isPaused ? 'ring-2 sm:ring-4 ring-pink-400/50' : ''
              }`}
              animate={isSpeaking && !isPaused ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            </motion.div>
            <p className="text-center text-[10px] sm:text-xs text-pink-300 mt-1 hidden sm:block">Teacher</p>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm leading-relaxed max-h-16 sm:max-h-24 overflow-y-auto pr-1 sm:pr-2">
              {renderNarrationText()}
            </div>
          </div>

          <div className="flex flex-col gap-1 sm:gap-2">
            {isSpeaking ? (
              <button onClick={togglePause} className="p-1.5 sm:p-2 bg-pink-600 hover:bg-pink-500 rounded-lg transition-colors" title={isPaused ? "Resume" : "Pause"}>
                {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
              </button>
            ) : (
              <button onClick={replayNarration} className="p-1.5 sm:p-2 bg-pink-600 hover:bg-pink-500 rounded-lg transition-colors" title="Play narration">
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
          <h3 className="text-lg sm:text-2xl font-bold text-pink-400 mb-2 sm:mb-3">{stages[stage].title}</h3>
          <p className="text-gray-200 text-sm sm:text-lg mb-3 sm:mb-4">{stages[stage].content}</p>

          {/* Stage 1: Life Stages Timeline */}
          {stage === 0 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-lg p-4 mb-4">
                {/* Current stage display */}
                <div className="flex justify-center items-center h-24 sm:h-32 mb-4">
                  <motion.div
                    className="text-center"
                    key={lifeStage}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    <span className="text-5xl sm:text-7xl block">{lifeStages[lifeStage].emoji}</span>
                    <motion.div className={`mt-2 px-3 py-1 rounded-full text-white text-sm font-medium ${lifeStages[lifeStage].color}`}>
                      {lifeStages[lifeStage].name}
                    </motion.div>
                    <p className="text-gray-400 text-xs mt-1">{lifeStages[lifeStage].age}</p>
                  </motion.div>
                </div>
                
                {/* Timeline */}
                <div className="relative">
                  <div className="flex justify-between items-center">
                    {lifeStages.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setLifeStage(i)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl z-10 transition-all ${
                          i === lifeStage ? 'ring-2 ring-pink-400 scale-125 bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        {s.emoji}
                      </button>
                    ))}
                  </div>
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -z-0 transform -translate-y-1/2">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                      animate={{ width: `${(lifeStage / (lifeStages.length - 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-center text-pink-400 text-sm">Click any stage to explore! Each stage has unique characteristics.</p>
            </div>
          )}

          {/* Stage 2: Prenatal Development */}
          {stage === 1 && (
            <div className="mt-3 sm:mt-4">
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                {[
                  { name: 'Germinal', weeks: 'Weeks 1-2', emoji: '🔬', desc: 'Cell division & implantation' },
                  { name: 'Embryonic', weeks: 'Weeks 3-8', emoji: '🫀', desc: 'Organs begin forming' },
                  { name: 'Fetal', weeks: 'Weeks 9-40', emoji: '👶', desc: 'Growth & maturation' },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    className="bg-pink-900/40 rounded-lg p-3 text-center border border-pink-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                  >
                    <span className="text-3xl sm:text-4xl block mb-1">{s.emoji}</span>
                    <h4 className="text-pink-300 font-bold text-sm">{s.name}</h4>
                    <p className="text-gray-400 text-xs">{s.weeks}</p>
                    <p className="text-gray-300 text-xs mt-1">{s.desc}</p>
                  </motion.div>
                ))}
              </div>
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
                <p className="text-red-300 text-sm text-center">
                  <strong>⚠️ Critical:</strong> Avoid alcohol, harmful drugs, and malaria during pregnancy!
                </p>
              </div>
            </div>
          )}

          {/* Stage 3: Growth Charts Demo */}
          {stage === 2 && (
            <div className="mt-3 sm:mt-4">
              {/* Metric selector */}
              <div className="flex justify-center gap-2 mb-4 flex-wrap">
                {[
                  { key: 'height', label: '📏 Height', color: 'bg-blue-600' },
                  { key: 'brain', label: '🧠 Brain Size', color: 'bg-purple-600' },
                  { key: 'skills', label: '🎯 Skills', color: 'bg-green-600' },
                ].map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setGrowthMetric(m.key as 'height' | 'brain' | 'skills')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      growthMetric === m.key ? m.color + ' text-white' : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              
              {/* Growth visualization */}
              <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                <div className="flex items-end justify-between h-32 sm:h-40 gap-1">
                  {lifeStages.map((s, i) => {
                    const value = growthMetric === 'height' 
                      ? s.height / 1.7 
                      : growthMetric === 'brain' 
                        ? s.brain / 100 
                        : (i + 1) / lifeStages.length;
                    
                    return (
                      <motion.div
                        key={i}
                        className="flex-1 flex flex-col items-center"
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                      >
                        <motion.div
                          className={`w-full rounded-t ${s.color}`}
                          initial={{ height: 0 }}
                          animate={{ height: `${value * 100}%` }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          style={{ minHeight: '10%' }}
                        />
                        <span className="text-xs mt-1 text-center">{s.emoji}</span>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="text-center mt-2 text-gray-400 text-sm">
                  {growthMetric === 'height' && 'Average height from ~50cm at birth to ~170cm adult'}
                  {growthMetric === 'brain' && 'Brain reaches 70% adult size by age 2, 95% by age 6!'}
                  {growthMetric === 'skills' && 'Skills build progressively - each stage adds new abilities'}
                </div>
              </div>
            </div>
          )}

          {/* Stage 4: Puberty Changes */}
          {stage === 3 && (
            <div className="mt-3 sm:mt-4">
              {/* Sex selector */}
              <div className="flex justify-center gap-3 mb-4">
                <button
                  onClick={() => setPubertySex('male')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    pubertySex === 'male' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  👦 Male Changes
                </button>
                <button
                  onClick={() => setPubertySex('female')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    pubertySex === 'female' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  👧 Female Changes
                </button>
              </div>
              
              {/* Changes list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {pubertyChanges[pubertySex].map((item, i) => (
                  <motion.div
                    key={`${pubertySex}-${i}`}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      pubertySex === 'male' ? 'bg-blue-900/40 border border-blue-700' : 'bg-pink-900/40 border border-pink-700'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-200 text-sm">{item.change}</span>
                  </motion.div>
                ))}
              </div>
              <p className="text-center text-purple-400 text-sm mt-3">
                ✨ Everyone develops at their own pace - early or late is perfectly NORMAL!
              </p>
            </div>
          )}

          {/* Stage 5: Brain Development */}
          {stage === 4 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-purple-900/40 to-blue-900/40 rounded-lg p-4 mb-4">
                <div className="flex justify-center mb-4">
                  <motion.div
                    className="relative"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Brain className="w-20 h-20 sm:w-28 sm:h-28 text-purple-400" />
                    <motion.div
                      className="absolute -top-1 -right-1"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-purple-900/50 rounded-lg p-3 border border-purple-700">
                    <h4 className="text-purple-300 font-bold text-sm mb-2">🎯 Prefrontal Cortex</h4>
                    <p className="text-gray-300 text-xs">Decision-making, impulse control, planning - still developing until ~25!</p>
                  </div>
                  <div className="bg-blue-900/50 rounded-lg p-3 border border-blue-700">
                    <h4 className="text-blue-300 font-bold text-sm mb-2">🔌 Brain Plasticity</h4>
                    <p className="text-gray-300 text-xs">Your brain adapts rapidly - what you learn NOW shapes your future!</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
                <p className="text-green-300 text-sm text-center">
                  <strong>💡 Use it wisely:</strong> Study, learn skills, avoid substances that harm your developing brain!
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Quick facts */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-pink-900/50 rounded-lg p-2 sm:p-3 text-center border border-pink-700">
          <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-pink-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-pink-300 text-[10px] sm:text-sm">Prenatal</p>
          <p className="text-white font-mono text-xs sm:text-base">9 Months</p>
        </div>
        <div className="bg-purple-900/50 rounded-lg p-2 sm:p-3 text-center border border-purple-700">
          <Activity className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-purple-300 text-[10px] sm:text-sm">Puberty</p>
          <p className="text-white font-mono text-xs sm:text-base">9-16 yrs</p>
        </div>
        <div className="bg-blue-900/50 rounded-lg p-2 sm:p-3 text-center border border-blue-700">
          <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-0.5 sm:mb-1" />
          <p className="text-blue-300 text-[10px] sm:text-sm">Brain Mature</p>
          <p className="text-white font-mono text-xs sm:text-base">~25 yrs</p>
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
                  i === stage ? 'bg-pink-400' : 'bg-gray-600 hover:bg-gray-500'
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
                className="p-2 sm:px-4 sm:py-2 bg-pink-600 hover:bg-pink-500 rounded-lg text-white font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
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
                className="p-2 sm:px-6 sm:py-2 bg-pink-600 hover:bg-pink-500 rounded-lg text-white font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Start!</span>
                <Play className="w-5 h-5 sm:w-4 sm:h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeCyclesHumanDevelopmentIntro;
