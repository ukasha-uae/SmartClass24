'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ear, Brain, Volume2, MessageCircle, CheckCircle, XCircle,
  Play, Pause, VolumeX, GraduationCap, 
  ChevronLeft, ChevronRight, Users, Target
} from 'lucide-react';
import { useEducationLevels } from '@/hooks/useEducationLevels';

interface LessonIntroProps {
  onComplete?: () => void;
}

interface ListeningType {
  id: string;
  name: string;
  icon: string;
  description: string;
  example: string;
  color: string;
}

const listeningTypes: ListeningType[] = [
  { 
    id: 'informational', 
    name: 'Informational Listening', 
    icon: '📚', 
    description: 'Listening to gain knowledge and understand information',
    example: 'Following a chemistry lecture on the periodic table',
    color: 'bg-blue-100'
  },
  { 
    id: 'critical', 
    name: 'Critical Listening', 
    icon: '🔍', 
    description: 'Analyzing and evaluating the message',
    example: 'Listening to a political campaign speech',
    color: 'bg-purple-100'
  },
  { 
    id: 'empathetic', 
    name: 'Empathetic Listening', 
    icon: '❤️', 
    description: 'Understanding feelings and providing emotional support',
    example: 'Listening to a friend share personal problems',
    color: 'bg-pink-100'
  },
  { 
    id: 'appreciative', 
    name: 'Appreciative Listening', 
    icon: '🎵', 
    description: 'Enjoying the experience and deriving pleasure',
    example: 'Listening to Ghanaian highlife music or Ananse stories',
    color: 'bg-green-100'
  },
  { 
    id: 'comprehensive', 
    name: 'Comprehensive Listening', 
    icon: '✅', 
    description: 'Fully understanding a message or procedure',
    example: 'Following a recipe or assembly instructions',
    color: 'bg-orange-100'
  }
];

const EffectiveListeningIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const { labels: educationLabels } = useEducationLevels();
  const [stage, setStage] = useState(0);
  
  // Interactive state
  const [listeningStep, setListeningStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Listening process stages
  const listeningProcess = [
    { step: 1, name: 'Receiving', icon: Ear, description: 'Sound waves enter your ears', color: 'text-blue-500' },
    { step: 2, name: 'Attending', icon: Target, description: 'You focus your attention', color: 'text-purple-500' },
    { step: 3, name: 'Understanding', icon: Brain, description: 'You interpret the meaning', color: 'text-green-500' },
    { step: 4, name: 'Responding', icon: MessageCircle, description: 'You provide feedback', color: 'text-orange-500' },
    { step: 5, name: 'Remembering', icon: CheckCircle, description: 'You store information', color: 'text-pink-500' }
  ];

  // Voice narration text for each stage
  const narrationText = [
    `Welcome to Effective Listening Strategies. In Ghana, we say "Tie wo to ma 'tie asɛm" - Lend your ears to hear the matter. Listening is one of the most powerful communication skills you can develop.`,
    
    `Listening is NOT the same as hearing. Hearing is passive - sound waves simply enter your ears. But listening is active - it requires concentration, interpretation, and response. We spend 45 to 50 percent of our communication time listening, yet it's rarely taught in schools.`,
    
    `There are five types of listening, each with different purposes. Informational listening helps you learn in lectures. Critical listening helps you evaluate persuasive speeches. Empathetic listening supports friends with problems. Appreciative listening helps you enjoy music and stories. And comprehensive listening helps you follow instructions.`,
    
    `Effective listening follows a five-stage process: First, receiving - sound waves enter your ears. Second, attending - you focus your attention on the speaker. Third, understanding - you interpret the message's meaning. Fourth, responding - you provide verbal or non-verbal feedback. Fifth, remembering - you store the information for later recall.`,
    
    `Many barriers can block effective listening. Physical barriers like noise and distractions. Psychological barriers like prejudice and emotions. Linguistic barriers like unfamiliar vocabulary. And behavioral barriers like interrupting or faking attention. Recognizing these barriers is the first step to overcoming them.`,
    
    `To become an active listener, use the SOLER technique: Sit or stand at an appropriate angle. Keep an Open posture. Lean toward the speaker. Maintain Eye contact respectfully. And Relax - stay calm and avoid fidgeting. These body language cues show you're truly engaged.`,
    
    `In Ghanaian culture, listening shows respect - especially to elders and teachers. During traditional storytelling, we listen patiently without interruption. In community meetings, we wait our turn to speak. Understanding when to listen and when to speak is a sign of wisdom and maturity.`,
    
    `Are you ready to transform from a passive hearer into an active, strategic listener? Let's begin this comprehensive lesson on effective listening strategies!`
  ];

  // Speak function with TTS
  const speak = useCallback((text: string) => {
    if (isMuted) return;
    
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Try to use a clear English voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en-') && 
        (voice.name.includes('Female') || voice.name.includes('Google'))
      ) || voices.find(voice => voice.lang.startsWith('en-'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, [isMuted]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Auto-play narration when stage changes
  useEffect(() => {
    if (stage < narrationText.length) {
      const timer = setTimeout(() => {
        speak(narrationText[stage]);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stage, speak]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  // Auto-advance listening process animation
  useEffect(() => {
    if (stage === 3 && isAnimating) {
      const interval = setInterval(() => {
        setListeningStep((prev) => (prev + 1) % listeningProcess.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [stage, isAnimating, listeningProcess.length]);

  const nextStage = () => {
    stopSpeaking();
    if (stage < 7) {
      setStage(stage + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const prevStage = () => {
    stopSpeaking();
    if (stage > 0) {
      setStage(stage - 1);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      stopSpeaking();
    }
  };

  const replayAudio = () => {
    speak(narrationText[stage]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Ear className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Effective Listening Strategies
            </h1>
            <Brain className="w-10 h-10 text-purple-600" />
          </div>
          <p className="text-lg text-gray-600">
            Master the Art of Active Listening
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {educationLabels.shs} 1 - English Language
            </span>
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              Listening & Speaking
            </span>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full ${
                i === stage ? 'w-12 bg-blue-600' : i < stage ? 'w-8 bg-blue-400' : 'w-8 bg-gray-300'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>

        {/* Main content area */}
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AnimatePresence mode="wait">
            {/* Stage 0: Welcome */}
            {stage === 0 && (
              <motion.div
                key="stage0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="mb-8"
                >
                  <Ear className="w-32 h-32 mx-auto text-blue-500" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Welcome to Effective Listening!
                </h2>
                <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                  &quot;Tie wo to ma &apos;tie asɛm&quot; (Twi: Lend your ears to hear the matter)
                </p>
                <div className="bg-blue-50 p-6 rounded-xl max-w-2xl mx-auto">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Listening is one of the most powerful communication skills you can develop. 
                    In this lesson, you&apos;ll learn the difference between hearing and listening, 
                    master active listening strategies, and discover how to overcome barriers 
                    that prevent effective communication.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Stage 1: Hearing vs Listening */}
            {stage === 1 && (
              <motion.div
                key="stage1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Hearing vs. Listening
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Hearing */}
                  <motion.div
                    className="bg-gray-50 p-6 rounded-xl border-2 border-gray-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Volume2 className="w-8 h-8 text-gray-500" />
                      <h3 className="text-xl font-bold text-gray-700">HEARING</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                        <span>Passive, automatic process</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                        <span>Physical reception of sound waves</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                        <span>No conscious effort required</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                        <span className="italic">Example: Hearing traffic noise while studying</span>
                      </li>
                    </ul>
                  </motion.div>

                  {/* Listening */}
                  <motion.div
                    className="bg-blue-50 p-6 rounded-xl border-2 border-blue-400"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Brain className="w-8 h-8 text-blue-600" />
                      <h3 className="text-xl font-bold text-blue-700">LISTENING</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <span>Active, intentional process</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <span>Mental interpretation and understanding</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <span>Requires focus, attention, cognitive effort</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <span className="italic">Example: Following your teacher&apos;s explanation</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                <div className="mt-6 bg-purple-50 p-6 rounded-xl">
                  <h4 className="font-bold text-purple-800 mb-2">Did You Know?</h4>
                  <p className="text-gray-700">
                    We spend <span className="font-bold text-purple-700">45-50%</span> of our communication time listening 
                    - more than speaking, reading, or writing combined!
                  </p>
                </div>
              </motion.div>
            )}

            {/* Stage 2: Types of Listening */}
            {stage === 2 && (
              <motion.div
                key="stage2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Five Types of Listening
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {listeningTypes.map((type, index) => (
                    <motion.div
                      key={type.id}
                      className={`${type.color} p-4 rounded-xl border-2 border-gray-200`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-4xl">{type.icon}</span>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 mb-1">{type.name}</h3>
                          <p className="text-gray-700 mb-2">{type.description}</p>
                          <p className="text-sm text-gray-600 italic">
                            <span className="font-semibold">Example:</span> {type.example}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Stage 3: Listening Process */}
            {stage === 3 && (
              <motion.div
                key="stage3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  The 5-Stage Listening Process
                </h2>
                <div className="space-y-4">
                  {listeningProcess.map((process, index) => {
                    const Icon = process.icon;
                    const isActive = index === listeningStep;
                    const isPast = index < listeningStep;
                    
                    return (
                      <motion.div
                        key={process.step}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          isActive 
                            ? 'bg-blue-50 border-blue-500 shadow-lg' 
                            : isPast
                            ? 'bg-green-50 border-green-400'
                            : 'bg-gray-50 border-gray-300'
                        }`}
                        animate={{
                          scale: isActive ? 1.02 : 1,
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                            isActive ? 'bg-blue-200' : isPast ? 'bg-green-200' : 'bg-gray-200'
                          }`}>
                            <Icon className={`w-6 h-6 ${process.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-600">Step {process.step}:</span>
                              <h3 className="text-xl font-bold text-gray-800">{process.name}</h3>
                            </div>
                            <p className="text-gray-700">{process.description}</p>
                          </div>
                          {isActive && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <CheckCircle className="w-8 h-8 text-blue-600" />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Stage 4: Barriers to Listening */}
            {stage === 4 && (
              <motion.div
                key="stage4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Barriers to Effective Listening
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-6 rounded-xl border-2 border-red-300">
                    <h3 className="text-lg font-bold text-red-700 mb-4">🚧 Physical Barriers</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Environmental noise</li>
                      <li>• Physical discomfort</li>
                      <li>• Poor acoustics</li>
                      <li>• Visual distractions</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-xl border-2 border-orange-300">
                    <h3 className="text-lg font-bold text-orange-700 mb-4">🧠 Psychological Barriers</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Prejudice/bias</li>
                      <li>• Emotional reactions</li>
                      <li>• Daydreaming</li>
                      <li>• Preoccupation</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-300">
                    <h3 className="text-lg font-bold text-yellow-700 mb-4">🗣️ Linguistic Barriers</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Unfamiliar vocabulary</li>
                      <li>• Accent differences</li>
                      <li>• Fast speaking rate</li>
                      <li>• Code-switching</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-300">
                    <h3 className="text-lg font-bold text-purple-700 mb-4">❌ Behavioral Barriers</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Interrupting speakers</li>
                      <li>• Selective listening</li>
                      <li>• Faking attention</li>
                      <li>• Planning response</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 p-6 rounded-xl">
                  <p className="text-gray-700 text-center">
                    <span className="font-bold text-blue-800">Key Point:</span> Recognizing these barriers is the first step to becoming a better listener!
                  </p>
                </div>
              </motion.div>
            )}

            {/* Stage 5: SOLER Technique */}
            {stage === 5 && (
              <motion.div
                key="stage5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Active Listening: The SOLER Technique
                </h2>
                <div className="space-y-4">
                  {[
                    { letter: 'S', word: 'Sit/Stand', description: 'At an appropriate angle (face the speaker)', color: 'bg-red-100 text-red-700' },
                    { letter: 'O', word: 'Open', description: 'Posture (uncross arms, lean slightly forward)', color: 'bg-orange-100 text-orange-700' },
                    { letter: 'L', word: 'Lean', description: 'Toward the speaker (shows interest)', color: 'bg-yellow-100 text-yellow-700' },
                    { letter: 'E', word: 'Eye', description: 'Contact (maintain respectful eye contact)', color: 'bg-green-100 text-green-700' },
                    { letter: 'R', word: 'Relax', description: 'Stay calm, avoid fidgeting', color: 'bg-blue-100 text-blue-700' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.letter}
                      className={`${item.color} p-6 rounded-xl border-2`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl font-bold">
                          {item.letter}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{item.word}</h3>
                          <p className="text-gray-700">{item.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Stage 6: Cultural Context */}
            {stage === 6 && (
              <motion.div
                key="stage6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Listening in Ghanaian Culture
                </h2>
                <div className="space-y-6">
                  <div className="bg-green-50 p-6 rounded-xl border-2 border-green-300">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">📖</span>
                      <h3 className="text-xl font-bold text-green-800">Traditional Storytelling</h3>
                    </div>
                    <p className="text-gray-700">
                      During Ananse stories and folk tales, listeners show respect by being patient, 
                      using their imagination, and not interrupting until the story concludes.
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-300">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">💬</span>
                      <h3 className="text-xl font-bold text-yellow-800">Proverbs & Indirect Communication</h3>
                    </div>
                    <p className="text-gray-700 mb-2">
                      Ghanaian communication often uses proverbs and indirect language. Good listeners:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Don&apos;t take proverbs literally</li>
                      <li>Consider context and cultural background</li>
                      <li>Ask for clarification if unsure</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-300">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">🤝</span>
                      <h3 className="text-xl font-bold text-purple-800">Respect & Hierarchy</h3>
                    </div>
                    <p className="text-gray-700">
                      In community meetings and when speaking with elders, younger people typically 
                      listen more and speak less. Learn polite ways to seek clarification: 
                      &quot;Excuse me, sir/madam, may I ask a question?&quot;
                    </p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-300">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">🔄</span>
                      <h3 className="text-xl font-bold text-blue-800">Code-Switching</h3>
                    </div>
                    <p className="text-gray-700">
                      Many Ghanaians switch between English and local languages (Twi, Ga, Ewe, Hausa). 
                      Build vocabulary in both languages and don&apos;t be afraid to ask for clarification politely.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stage 7: Ready to Begin */}
            {stage === 7 && (
              <motion.div
                key="stage7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                  className="mb-8"
                >
                  <GraduationCap className="w-32 h-32 mx-auto text-blue-600" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Ready to Become a Master Listener?
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  You&apos;ve learned the fundamentals of effective listening. Now let&apos;s dive deep 
                  into practical strategies, cultural contexts, and real-world applications!
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl max-w-3xl mx-auto">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">What You&apos;ll Master:</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <span>Active listening techniques</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <span>Overcoming barriers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <span>Note-taking strategies</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <span>Cultural listening protocols</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <span>WASSCE exam preparation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <span>Real-world applications</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation and controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStage}
            disabled={stage === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleMute}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-gray-600" />
              ) : (
                <Volume2 className="w-6 h-6 text-blue-600" />
              )}
            </button>

            <button
              onClick={replayAudio}
              disabled={isSpeaking}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
              title="Replay audio"
            >
              {isSpeaking ? (
                <Pause className="w-6 h-6 text-gray-600" />
              ) : (
                <Play className="w-6 h-6 text-blue-600" />
              )}
            </button>
          </div>

          <button
            onClick={nextStage}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {stage === 7 ? 'Start Lesson' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer note */}
        <motion.p
          className="text-center text-gray-500 text-sm mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Interactive lesson intro with voice narration • {stage + 1} of 8
        </motion.p>
      </div>
    </div>
  );
};

export default EffectiveListeningIntro;
