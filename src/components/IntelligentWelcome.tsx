'use client';

import { useState, useEffect } from 'react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Brain, 
  Sparkles, 
  BookOpen, 
  Trophy,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface WelcomeScene {
  id: number;
  emoji: string;
  narration: string;
  visualContent: string;
  highlightWords: string[];
  teacherTip?: string;
}

interface IntelligentWelcomeProps {
  studentName?: string;
  campus?: 'JHS' | 'SHS' | 'Primary';
  onComplete?: () => void;
}

export function IntelligentWelcome({ 
  studentName = 'there',
  campus = 'JHS',
  onComplete 
}: IntelligentWelcomeProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showTip, setShowTip] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Get campus-specific content
  const getCampusSpecificScenes = (): WelcomeScene[] => {
    const baseScenes = {
      welcome: {
        id: 0,
        emoji: "👋",
        narration: `Hello ${studentName}! Welcome to SmartClass24, Ghana's most exciting learning adventure! I'm your AI teacher, and I'm absolutely thrilled to be your guide today.`,
        visualContent: "Welcome to Your Learning Journey!",
        highlightWords: ['Welcome', 'exciting', 'adventure'],
        teacherTip: "Get ready for an amazing experience!"
      },
      aiTeacher: {
        id: 2,
        emoji: "🧠",
        narration: `Here's something cool: I'll be speaking to you throughout your lessons, explaining concepts in a way that makes sense. Just like a real teacher, but I never get tired!`,
        visualContent: "Your Personal AI Teacher",
        highlightWords: ['AI Teacher', 'explaining', 'makes sense'],
        teacherTip: "I adapt to your learning style!"
      },
      visual: {
        id: 3,
        emoji: "✨",
        narration: `Watch animations come to life, see problems solved step by step, and hear clear explanations. Visual learning plus audio guidance equals super understanding!`,
        visualContent: "Visual + Audio = Success",
        highlightWords: ['animations', 'step by step', 'super understanding'],
        teacherTip: "Multiple ways to learn = better results!"
      }
    };

    // Campus-specific scenes
    if (campus === 'Primary') {
      return [
        baseScenes.welcome,
        {
          id: 1,
          emoji: "🎨",
          narration: `In Primary School, learning is fun and exciting! From Class 1 to Class 6, you'll build strong foundations in reading, math, science, and so much more. Every lesson is like a colorful adventure!`,
          visualContent: "Fun Learning for Primary Students",
          highlightWords: ['fun', 'exciting', 'strong foundations'],
          teacherTip: "Building blocks for future success!"
        },
        baseScenes.aiTeacher,
        baseScenes.visual,
        {
          id: 4,
          emoji: "🎮",
          narration: `Play learning games, collect stars, and watch your garden grow as you complete lessons! Parents can track your progress too. Learning feels like playing!`,
          visualContent: "Play, Learn & Grow",
          highlightWords: ['games', 'stars', 'progress'],
          teacherTip: "Learning should be fun!"
        },
        {
          id: 5,
          emoji: "🌟",
          narration: `Ready to start, young champion? Let's make learning the best part of your day! Remember: you're amazing, and I'm here to help you shine!`,
          visualContent: "Let's Learn Together!",
          highlightWords: ['champion', 'amazing', 'shine'],
          teacherTip: "You're going to do great things!"
        }
      ];
    } else if (campus === 'JHS') {
      return [
        baseScenes.welcome,
        {
          id: 1,
          emoji: "🎯",
          narration: `In JHS, we're preparing you for the BECE exam! From Form 1 to Form 3, you'll master all subjects through interactive lessons, school battles, and tons of practice. Your success story starts here!`,
          visualContent: "BECE Excellence Starts Here",
          highlightWords: ['BECE', 'interactive lessons', 'success'],
          teacherTip: "Every lesson brings you closer to your goals!"
        },
        baseScenes.aiTeacher,
        baseScenes.visual,
        {
          id: 4,
          emoji: "🏆",
          narration: `Challenge your classmates, join NSMQ-style school battles, climb leaderboards, and earn cool badges! Compete with schools from Accra to Kumasi. Are you ready to represent your school?`,
          visualContent: "School Battles & Competition",
          highlightWords: ['Challenge', 'school battles', 'represent'],
          teacherTip: "Your school is counting on you!"
        },
        {
          id: 5,
          emoji: "🚀",
          narration: `Alright BECE warrior, let's begin your journey to excellence! Remember: every expert was once a beginner. With hard work and smart study, you'll ace that exam!`,
          visualContent: "BECE Success Awaits!",
          highlightWords: ['BECE warrior', 'excellence', 'ace that exam'],
          teacherTip: "You've got what it takes!"
        }
      ];
    } else {
      // SHS
      return [
        baseScenes.welcome,
        {
          id: 1,
          emoji: "🎓",
          narration: `Welcome to Senior High! This is where you prepare for WASSCE and beyond. With advanced virtual labs, past questions, and NSMQ-style competitions, you're getting the complete SHS experience!`,
          visualContent: "WASSCE Excellence Journey",
          highlightWords: ['WASSCE', 'virtual labs', 'NSMQ'],
          teacherTip: "University dreams start here!"
        },
        baseScenes.aiTeacher,
        baseScenes.visual,
        {
          id: 4,
          emoji: "⚗️",
          narration: `Access virtual science labs, compete in NSMQ-style battles like the pros, solve past WASSCE questions, and track your progress across all your elective subjects. This is serious preparation for serious students!`,
          visualContent: "Professional Exam Preparation",
          highlightWords: ['virtual labs', 'NSMQ', 'WASSCE'],
          teacherTip: "Train like champions, perform like champions!"
        },
        {
          id: 5,
          emoji: "🚀",
          narration: `Ready to excel, future leader? Your WASSCE success and university admission start right here. Let's make your dreams a reality. Time to show Ghana what you're made of!`,
          visualContent: "Your Future Starts Now!",
          highlightWords: ['future leader', 'WASSCE success', 'dreams'],
          teacherTip: "The future is yours to create!"
        }
      ];
    }
  };

  const welcomeScenes = getCampusSpecificScenes();

  const currentNarration = welcomeScenes[currentScene];

  const { speak, stop, isSpeaking, isSupported } = useSpeechSynthesis({
    text: currentNarration.narration,
    autoPlay: isAutoPlaying && hasStarted,
    rate: 0.95,
    pitch: 1.1,
    volume: 1
  });

  // Auto-advance to next scene when narration ends
  useEffect(() => {
    if (!isSpeaking && hasStarted && isAutoPlaying && currentScene < welcomeScenes.length - 1) {
      const timer = setTimeout(() => {
        setCurrentScene(prev => prev + 1);
        setShowTip(false);
      }, 800); // Brief pause between scenes
      return () => clearTimeout(timer);
    } else if (!isSpeaking && hasStarted && currentScene === welcomeScenes.length - 1) {
      // Show the tip at the end
      setShowTip(true);
      // Auto-complete after final scene
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, 3000);
      return () => clearTimeout(completeTimer);
    }
  }, [isSpeaking, currentScene, hasStarted, isAutoPlaying, welcomeScenes.length, onComplete]);

  // Show tip mid-narration
  useEffect(() => {
    if (isSpeaking && currentNarration.teacherTip) {
      const tipTimer = setTimeout(() => {
        setShowTip(true);
      }, 1500);
      return () => clearTimeout(tipTimer);
    }
  }, [currentScene, isSpeaking, currentNarration.teacherTip]);

  const handleStart = () => {
    setHasStarted(true);
    setIsAutoPlaying(true);
  };

  const handleNext = () => {
    stop();
    if (currentScene < welcomeScenes.length - 1) {
      setCurrentScene(prev => prev + 1);
      setShowTip(false);
    } else {
      onComplete?.();
    }
  };

  const handleSkip = () => {
    stop();
    onComplete?.();
  };

  const toggleAudio = () => {
    if (isSpeaking) {
      stop();
      setIsAutoPlaying(false);
    } else {
      setIsAutoPlaying(true);
      speak();
    }
  };

  if (!hasStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-violet-500/20 via-indigo-500/20 to-purple-500/20 backdrop-blur-sm"
      >
        <Card className="max-w-lg mx-4 border-4 border-violet-500 shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="inline-block"
            >
              <GraduationCap className="h-20 w-20 text-violet-600 mx-auto" />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome to SmartClass24!
              </h2>
              <p className="text-muted-foreground">
                Get ready for an interactive learning experience with your AI teacher
              </p>
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
              <Badge variant="secondary" className="text-sm">
                <Volume2 className="h-3 w-3 mr-1" />
                Voice Guided
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                Interactive
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Brain className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>

            {!isSupported && (
              <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg border border-amber-300 dark:border-amber-700">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  ⚠️ Audio narration not supported in this browser. You'll still see visual content!
                </p>
              </div>
            )}

            <Button 
              size="lg" 
              onClick={handleStart}
              className="w-full text-lg font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              <Play className="h-5 w-5 mr-2" />
              Start My Journey
            </Button>

            <button 
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip introduction
            </button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-violet-500/20 via-indigo-500/20 to-purple-500/20 backdrop-blur-sm"
    >
      <Card className="max-w-2xl mx-4 border-4 border-violet-500 shadow-2xl">
        <CardContent className="p-8 space-y-6">
          {/* Progress Bar */}
          <div className="flex gap-1">
            {welcomeScenes.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all ${
                  idx <= currentScene 
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-4"
              >
                {/* Emoji Animation */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                  className="text-7xl"
                >
                  {currentNarration.emoji}
                </motion.div>

                {/* Visual Content */}
                <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {currentNarration.visualContent}
                </h2>

                {/* Narration Text */}
                <div className="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg border-2 border-violet-200 dark:border-violet-700">
                  <p className="text-lg leading-relaxed">
                    {currentNarration.narration.split(' ').map((word, idx) => {
                      const isHighlighted = currentNarration.highlightWords.some(hw => 
                        word.toLowerCase().includes(hw.toLowerCase())
                      );
                      return (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className={isHighlighted ? 'font-bold text-violet-700 dark:text-violet-300' : ''}
                        >
                          {word}{' '}
                        </motion.span>
                      );
                    })}
                  </p>
                </div>

                {/* Teacher Tip */}
                <AnimatePresence>
                  {showTip && currentNarration.teacherTip && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="p-3 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg border-2 border-amber-300 dark:border-amber-700"
                    >
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                        <Sparkles className="h-4 w-4 flex-shrink-0" />
                        <p className="text-sm font-medium">{currentNarration.teacherTip}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Decorative Elements */}
                <div className="flex justify-center gap-8 pt-4">
                  {isSpeaking && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        <BookOpen className="h-8 w-8 text-violet-400" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                      >
                        <Brain className="h-8 w-8 text-indigo-400" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                      >
                        <Trophy className="h-8 w-8 text-purple-400" />
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={toggleAudio}
              className="flex-1"
              disabled={!isSupported}
            >
              {isSpeaking ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Volume2 className="h-5 w-5 mr-2" />
                  {isAutoPlaying ? 'Resume' : 'Play'}
                </>
              )}
            </Button>

            <Button
              variant="default"
              size="lg"
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              {currentScene === welcomeScenes.length - 1 ? (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Let's Learn!
                </>
              ) : (
                <>
                  <SkipForward className="h-5 w-5 mr-2" />
                  Next
                </>
              )}
            </Button>
          </div>

          {/* Skip All */}
          <div className="text-center">
            <button 
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip introduction
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
