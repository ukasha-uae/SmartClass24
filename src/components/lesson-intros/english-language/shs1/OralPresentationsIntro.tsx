'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Users, Brain, CheckCircle, XCircle,
  Play, Pause, VolumeX, Volume, Award, 
  ChevronLeft, ChevronRight, MessageCircle, Eye, Zap
} from 'lucide-react';
import { useLocalization } from '@/hooks/useLocalization';
import { localizeString } from '@/lib/localization/content-localizer';
import type { CountryConfig } from '@/lib/localization/country-config';

interface LessonIntroProps {
  onComplete?: () => void;
}

const OralPresentationsIntro: React.FC<LessonIntroProps> = ({ onComplete }) => {
  const { country } = useLocalization();
  const [stage, setStage] = useState(0);
  
  // Interactive state
  const [isAnimating, setIsAnimating] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Presentation delivery stages
  const deliveryStages = [
    { step: 1, name: 'Structure', icon: '📋', description: 'Introduction → Body → Conclusion', color: 'text-blue-500' },
    { step: 2, name: 'Audience', icon: '👥', description: 'Analyze and adapt to your listeners', color: 'text-purple-500' },
    { step: 3, name: 'Delivery', icon: '🎤', description: 'Voice, pace, gestures, presence', color: 'text-green-500' },
    { step: 4, name: 'Confidence', icon: '💪', description: 'Manage anxiety and build credibility', color: 'text-orange-500' },
    { step: 5, name: 'Engagement', icon: '🔄', description: 'Questions, interaction, connection', color: 'text-pink-500' }
  ];

  // Voice narration text for each stage
  const narrationText = [
    `Welcome to Oral Presentations and Discussions! Public speaking might seem intimidating, but it's a skill that can be learned and mastered. In {{country}}, we have a beautiful tradition of respected orators and communicators who have shaped our nation. Today, you'll join that tradition.`,
    
    `Public speaking is not just about speaking – it's about connecting with your audience. A successful presentation has clear structure: an engaging introduction that hooks your listeners, a well-organized body with supporting evidence and examples, and a powerful conclusion that motivates action.`,
    
    `Your voice is your most powerful tool. By varying your pace, you keep audiences interested. By using strategic pauses, you let important ideas sink in. By adjusting your volume, you emphasize key points. By controlling your pitch, you convey emotion and confidence. These vocal techniques transform ordinary words into compelling communication.`,
    
    `Your body speaks louder than your words. Eye contact builds trust. Purposeful gestures emphasize ideas. Confident posture signals credibility. Open body language shows approachability. In {{country:adjective}} culture, these nonverbal cues show respect and confidence. Master your body language, and your message becomes unstoppable.`,
    
    `Before every presentation, analyze your audience. Who are they? What do they already know? What matters to them? By understanding your listeners, you can adapt your examples, adjust your technical level, and connect authentically. A tailor-made presentation is far more powerful than generic content.`,
    
    `Handling questions confidently is a sign of true expertise. When someone asks a challenging question, stay calm. Thank them for the question. Think briefly. Then answer clearly and honestly. If you don't know the answer, say so and offer to follow up. This honesty builds credibility and trust.`,
    
    `Presentation anxiety is completely normal. Seventy-five percent of speakers feel nervous. But here's the secret: nervous energy is the same as excitement energy. The physical symptoms are identical. The difference is your mindset. With preparation and practice, you can channel that nervous energy into enthusiasm and engagement.`,
    
    `Are you ready to become a confident, engaging speaker? To master the art of connecting with audiences? To share your ideas with clarity and conviction? Let's dive into the comprehensive strategies and techniques that will transform you into a powerful communicator. Your journey to public speaking mastery begins now!`
  ];

  // Localize narration text based on country
  const localizedNarrationText = React.useMemo(() => {
    if (!country) return narrationText;
    return narrationText.map(text => localizeString(text, country as CountryConfig));
  }, [country]);

  // Localize UI strings
  const countryAdjective = React.useMemo(() => {
    if (!country) return "your nation's";
    return localizeString("{{country:adjective}}", country as CountryConfig);
  }, [country]);

  const countryContextLabel = React.useMemo(() => {
    if (!country) return "Cultural Context:";
    return localizeString("{{country:adjective}} Context:", country as CountryConfig);
  }, [country]);

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
    if (isAnimating) {
      speak(localizedNarrationText[stage]);
    }
  }, [stage, isAnimating, speak, localizedNarrationText]);

  const nextStage = () => {
    if (stage < 7) {
      setStage(stage + 1);
    } else {
      stopSpeaking();
      onComplete?.();
    }
  };

  const prevStage = () => {
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
    speak(localizedNarrationText[stage]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mic className="w-10 h-10 text-orange-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Oral Presentations and Discussions
            </h1>
            <Users className="w-10 h-10 text-red-600" />
          </div>
          <p className="text-lg text-gray-600">
            Master the Art of Public Speaking
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              SHS 1 - English Language
            </span>
            <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
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
                i === stage ? 'w-12 bg-orange-600' : i < stage ? 'w-8 bg-orange-400' : 'w-8 bg-gray-300'
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
                  <Mic className="w-32 h-32 mx-auto text-orange-500" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Welcome to Public Speaking!
                </h2>
                <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                  Join {countryAdjective}'s Tradition of Powerful Communicators
                </p>
                <div className="bg-orange-50 p-6 rounded-xl max-w-2xl mx-auto">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Public speaking is a skill that can be learned and mastered. In this lesson, you'll discover how to structure compelling presentations, connect authentically with your audience, deliver with confidence and passion, and engage listeners through meaningful dialogue. Whether in school, community, or career settings, these skills will transform your ability to share ideas and inspire action.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Stage 1: Presentation Structure */}
            {stage === 1 && (
              <motion.div
                key="stage1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Three Parts of a Great Presentation
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Introduction */}
                  <motion.div
                    className="bg-blue-50 p-6 rounded-xl border-2 border-blue-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-4xl mb-3">🎯</div>
                    <h3 className="text-xl font-bold text-blue-700 mb-2">Introduction</h3>
                    <p className="text-sm text-gray-600 mb-3">5-10% of time</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span>Hook your audience</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span>State your topic</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span>Preview main points</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span>Show why it matters</span>
                      </li>
                    </ul>
                  </motion.div>

                  {/* Body */}
                  <motion.div
                    className="bg-green-50 p-6 rounded-xl border-2 border-green-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-4xl mb-3">📚</div>
                    <h3 className="text-xl font-bold text-green-700 mb-2">Body</h3>
                    <p className="text-sm text-gray-600 mb-3">80-85% of time</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>3-5 main points</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Evidence & examples</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Clear transitions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Visual aids support</span>
                      </li>
                    </ul>
                  </motion.div>

                  {/* Conclusion */}
                  <motion.div
                    className="bg-purple-50 p-6 rounded-xl border-2 border-purple-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-4xl mb-3">🎬</div>
                    <h3 className="text-xl font-bold text-purple-700 mb-2">Conclusion</h3>
                    <p className="text-sm text-gray-600 mb-3">5-10% of time</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                        <span>Summarize points</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                        <span>Powerful takeaway</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                        <span>Call to action</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                        <span>Thank audience</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                <div className="mt-6 bg-yellow-50 p-6 rounded-xl">
                  <h4 className="font-bold text-yellow-800 mb-2">💡 Quick Tip:</h4>
                  <p className="text-gray-700">
                    For a 10-minute presentation: 1 minute intro, 8 minutes body, 1 minute conclusion. Structure creates confidence!
                  </p>
                </div>
              </motion.div>
            )}

            {/* Stage 2: Vocal Delivery */}
            {stage === 2 && (
              <motion.div
                key="stage2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Vocal Techniques: Your Voice as a Tool
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pace */}
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-bold text-blue-700">PACE</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">Speed of delivery</p>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Normal:</strong> 120-150 words per minute</li>
                      <li><strong>Presentation:</strong> 100-130 wpm (slower, clearer)</li>
                      <li><strong>Slow down</strong> for important points</li>
                      <li><strong>Speed up</strong> for transitions</li>
                    </ul>
                  </motion.div>

                  {/* Volume */}
                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Mic className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-bold text-green-700">VOLUME</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">Loudness and projection</p>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Project:</strong> Reach the back row</li>
                      <li><strong>Increase</strong> for main points</li>
                      <li><strong>Decrease</strong> for intimate moments</li>
                      <li><strong>Never</strong> shout – stay natural</li>
                    </ul>
                  </motion.div>

                  {/* Pitch */}
                  <motion.div
                    className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Brain className="w-6 h-6 text-purple-600" />
                      <h3 className="text-lg font-bold text-purple-700">PITCH</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">Highness or lowness</p>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Rising pitch</strong> = sounds like question (uncertain)</li>
                      <li><strong>Falling pitch</strong> = sounds confident (statement)</li>
                      <li><strong>Varied pitch</strong> = engaging and interesting</li>
                      <li><strong>Emotion:</strong> High = excited, Low = serious</li>
                    </ul>
                  </motion.div>

                  {/* Pauses */}
                  <motion.div
                    className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <MessageCircle className="w-6 h-6 text-orange-600" />
                      <h3 className="text-lg font-bold text-orange-700">PAUSES</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">Strategic silence</p>
                    <ul className="space-y-2 text-sm">
                      <li><strong>1-2 sec:</strong> Between thoughts</li>
                      <li><strong>2-3 sec:</strong> After key points</li>
                      <li><strong>3+ sec:</strong> Dramatic effect</li>
                      <li><strong>Never</strong> fill with "um," "uh," "like"</li>
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Stage 3: Body Language */}
            {stage === 3 && (
              <motion.div
                key="stage3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Body Language: Speaking Without Words
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Posture */}
                  <motion.div
                    className="bg-blue-50 p-6 rounded-xl border-2 border-blue-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-lg font-bold text-blue-700 mb-4">✓ PROFESSIONAL POSTURE</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span>Stand upright, shoulders back</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span>Weight evenly distributed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span>Feet shoulder-width apart</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span>Avoid swaying or pacing</span>
                      </li>
                    </ul>
                  </motion.div>

                  {/* Eye Contact */}
                  <motion.div
                    className="bg-green-50 p-6 rounded-xl border-2 border-green-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-lg font-bold text-green-700 mb-4">👀 EYE CONTACT</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>3-5 seconds per person</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Scan room: front, middle, back</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Include different sections</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Builds trust and connection</span>
                      </li>
                    </ul>
                  </motion.div>

                  {/* Gestures */}
                  <motion.div
                    className="bg-purple-50 p-6 rounded-xl border-2 border-purple-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-lg font-bold text-purple-700 mb-4">🤚 GESTURES</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                        <span>Emphasize key points</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                        <span>Chest to shoulder level</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                        <span>Match words and meaning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                        <span>Vary frequency and size</span>
                      </li>
                    </ul>
                  </motion.div>

                  {/* Facial Expressions */}
                  <motion.div
                    className="bg-orange-50 p-6 rounded-xl border-2 border-orange-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-lg font-bold text-orange-700 mb-4">😊 FACIAL EXPRESSIONS</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                        <span>Smile = warmth, confidence</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                        <span>Match emotion to content</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                        <span>Show genuine emotion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                        <span>Audiences detect fakeness</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-2">💡 Remember:</h4>
                  <p className="text-gray-700">
                    Communication is 55% body language, 38% tone of voice, and only 7% words. Your physical presence dramatically impacts your message!
                  </p>
                </div>
              </motion.div>
            )}

            {/* Stage 4: Audience Analysis */}
            {stage === 4 && (
              <motion.div
                key="stage4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Know Your Audience
                </h2>
                <div className="space-y-4">
                  {[
                    { q: 'WHO are they?', a: 'Age, education, background, culture', icon: '👥' },
                    { q: 'WHAT do they know?', a: 'Prior knowledge, interests, concerns', icon: '🧠' },
                    { q: 'WHAT do they expect?', a: 'Formality level, depth, time, participation', icon: '📋' },
                    { q: 'WHAT are their values?', a: 'Cultural, professional, social priorities', icon: '💎' }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{item.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold text-blue-800 mb-1">{item.q}</h3>
                          <p className="text-gray-700">{item.a}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-3">🎯 Adaptation Strategies:</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold">General Audience:</p>
                        <p className="text-gray-700">Explain jargon, use relatable examples</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Expert Audience:</p>
                        <p className="text-gray-700">Use technical terms, assume background</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold">{countryContextLabel}</p>
                        <p className="text-gray-700">Show respect for community values</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Mixed Audience:</p>
                        <p className="text-gray-700">Offer both overview and details</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stage 5: Handling Questions */}
            {stage === 5 && (
              <motion.div
                key="stage5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Handling Questions Like a Pro
                </h2>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">The SQA Technique</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl mb-3">😊</div>
                      <h4 className="font-bold text-lg mb-2">SMILE</h4>
                      <p className="text-gray-700">Appreciate the question</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl mb-3">🤐</div>
                      <h4 className="font-bold text-lg mb-2">QUIET</h4>
                      <p className="text-gray-700">Pause briefly to think</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl mb-3">💬</div>
                      <h4 className="font-bold text-lg mb-2">ANSWER</h4>
                      <p className="text-gray-700">Give clear response</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    className="bg-green-50 p-6 rounded-xl border-2 border-green-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="font-bold text-green-700 mb-3">✓ DO THIS</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Thank them for the question</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Listen fully before answering</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Paraphrase to confirm understanding</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Keep answers concise (1-2 minutes)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span>Be honest if you don't know</span>
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    className="bg-red-50 p-6 rounded-xl border-2 border-red-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="font-bold text-red-700 mb-3">✗ DON'T DO THIS</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                        <span>Dismiss or belittle questions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                        <span>Get defensive about challenges</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                        <span>Make up answers you don't know</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                        <span>Ramble or go off-topic</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                        <span>Ignore questions from some people</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Stage 6: Managing Anxiety */}
            {stage === 6 && (
              <motion.div
                key="stage6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Managing Presentation Anxiety
                </h2>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl mb-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">💡 Good News!</h3>
                  <p className="text-gray-700">
                    75% of people experience presentation anxiety. It's NORMAL and actually shows you care about doing well!
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <motion.div
                    className="bg-blue-50 p-6 rounded-xl border-2 border-blue-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="font-bold text-blue-700 mb-4">📋 BEFORE THE PRESENTATION</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span><strong>Prepare:</strong> Know content thoroughly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span><strong>Practice:</strong> 5-10 full run-throughs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span><strong>Visualize:</strong> Picture success</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span><strong>Sleep:</strong> 7-8 hours night before</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span><strong>Arrive early:</strong> Get comfortable with space</span>
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    className="bg-green-50 p-6 rounded-xl border-2 border-green-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="font-bold text-green-700 mb-4">⚡ DURING THE PRESENTATION</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span><strong>Breathe:</strong> Deep breaths calm nervous system</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span><strong>Reframe:</strong> Nervous = Excited</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span><strong>Focus:</strong> On message, not perfection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span><strong>Remember:</strong> Audience wants you to succeed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span><strong>Keep going:</strong> Small mistakes are invisible</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-3">🧠 Reframe Your Self-Talk</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="text-red-500">❌</span>
                      <div>
                        <p className="font-bold">"I'm going to mess up"</p>
                        <p className="text-gray-600">↓ Change to ↓</p>
                        <p className="font-bold text-green-700">✓ "I've prepared well and I can do this"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stage 7: Final Message */}
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
                  <Award className="w-32 h-32 mx-auto text-orange-600" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  You're Ready to Shine!
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  You've learned the structure, delivery techniques, and strategies that make presentations powerful. Now it's time to apply them!
                </p>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-xl max-w-3xl mx-auto">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">What You'll Master:</h3>
                  <div className="grid md:grid-cols-2 gap-3 text-left">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <span>Structuring compelling presentations</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <span>Using vocal variety and emphasis</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <span>Mastering body language and presence</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <span>Analyzing and adapting to audiences</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <span>Handling questions confidently</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                      <span>Managing anxiety and building confidence</span>
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
                <Volume className="w-6 h-6 text-orange-600" />
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
                <Play className="w-6 h-6 text-orange-600" />
              )}
            </button>
          </div>

          <button
            onClick={nextStage}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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

export default OralPresentationsIntro;
