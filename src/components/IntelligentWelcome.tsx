'use client';

import { useState, useEffect, useRef } from 'react';
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
  SkipForward,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/hooks/useTenant';

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
  const { branding } = useTenant();
  const [currentScene, setCurrentScene] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showTip, setShowTip] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [direction, setDirection] = useState(0);

  // Swipe detection
  const dragX = useMotionValue(0);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    
    if (info.offset.x > swipeThreshold && currentScene > 0) {
      // Swipe right - go to previous
      handlePrevious();
    } else if (info.offset.x < -swipeThreshold && currentScene < welcomeScenes.length - 1) {
      // Swipe left - go to next
      handleNext();
    }
  };

  // Get campus-specific content - Brief 3-scene intro
  const getCampusSpecificScenes = (): WelcomeScene[] => {
    const brandingName = branding?.name || 'SmartClass24';

    // Brief, focused intro - only 3 key scenes
    const commonScenes = {
      welcome: {
        id: 0,
        emoji: "👋",
        narration: `Welcome to ${brandingName}! I'm your AI teacher, here to make learning interactive and fun. Let's explore what you can do here!`,
        visualContent: `Welcome to ${brandingName}!`,
        highlightWords: ['Welcome', 'AI teacher', 'interactive'],
        teacherTip: "Personalized learning awaits!"
      },
      features: {
        id: 1,
        emoji: "✨",
        narration: `Learn with AI-guided lessons, interactive quizzes, and instant feedback. Track your progress, compete with friends, and earn achievements as you master each subject!`,
        visualContent: "Learn, Practice & Achieve",
        highlightWords: ['AI-guided', 'interactive', 'achievements'],
        teacherTip: "Everything you need in one place!"
      },
      ready: {
        id: 2,
        emoji: "🚀",
        narration: `Ready to start your learning journey? Let's make today count! Your success story begins now.`,
        visualContent: "Let's Get Started!",
        highlightWords: ['learning journey', 'success', 'now'],
        teacherTip: "You've got this!"
      }
    };

    // Return same 3 scenes for all campus types (tenant-customizable later)
    return [
      commonScenes.welcome,
      commonScenes.features,
      commonScenes.ready
    ];
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
    setDirection(1);
    if (currentScene < welcomeScenes.length - 1) {
      setCurrentScene(prev => prev + 1);
      setShowTip(false);
    } else {
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    stop();
    setDirection(-1);
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
      setShowTip(false);
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-violet-600/30 via-indigo-600/30 to-purple-600/30 backdrop-blur-md p-3 sm:p-4"
      >
        <Card className="max-w-lg w-full border-2 sm:border-4 border-violet-500 shadow-2xl bg-white/95 dark:bg-gray-900/95">
          <CardContent className="p-4 sm:p-8 text-center space-y-4 sm:space-y-6">
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
              <div className="relative">
                <GraduationCap className="h-16 w-16 sm:h-24 sm:w-24 text-violet-600 mx-auto drop-shadow-lg" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
                </motion.div>
              </div>
            </motion.div>

            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to {branding.name}!
              </h2>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed px-2">
                Interactive learning with your personal AI teacher
              </p>
            </div>

            <div className="flex gap-2 justify-center flex-wrap px-2">
              <Badge variant="secondary" className="text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3 bg-violet-100 dark:bg-violet-900/30 border-violet-300">
                <Volume2 className="h-3 w-3 mr-1" />
                Audio
              </Badge>
              <Badge variant="secondary" className="text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3 bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300">
                <Sparkles className="h-3 w-3 mr-1" />
                Interactive
              </Badge>
              <Badge variant="secondary" className="text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3 bg-purple-100 dark:bg-purple-900/30 border-purple-300">
                <Brain className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>

            {!isSupported && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-2 border-amber-300 dark:border-amber-700 mx-2"
              >
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 font-medium">
                  ⚠️ Audio narration not available in this browser
                </p>
              </motion.div>
            )}

            <Button 
              size="lg" 
              onClick={handleStart}
              className="w-full text-base sm:text-lg font-semibold bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 py-5 sm:py-6"
            >
              <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Start Learning Journey
            </Button>

            <button 
              onClick={handleSkip}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
            >
              Skip and start learning
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-violet-600/30 via-indigo-600/30 to-purple-600/30 backdrop-blur-md p-3 sm:p-4 overflow-hidden"
    >
      <Card className="max-w-3xl w-full border-2 sm:border-4 border-violet-500 shadow-2xl bg-white/95 dark:bg-gray-900/95 max-h-[95vh] sm:max-h-none overflow-y-auto">
        <CardContent className="p-4 sm:p-8 space-y-4 sm:space-y-6">
          {/* Progress Bar */}
          <div className="flex gap-1.5 sm:gap-2">
            {welcomeScenes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  stop();
                  setDirection(idx > currentScene ? 1 : -1);
                  setCurrentScene(idx);
                  setShowTip(false);
                }}
                className={`h-1.5 sm:h-2 flex-1 rounded-full transition-all duration-500 ${
                  idx <= currentScene 
                    ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 shadow-md' 
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Scene Counter */}
          <div className="text-center">
            <Badge variant="outline" className="text-xs px-2 sm:px-3 py-1">
              {currentScene + 1} of {welcomeScenes.length}
            </Badge>
          </div>

          {/* Main Content - Swipeable */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentScene}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="text-center space-y-4 sm:space-y-6 cursor-grab active:cursor-grabbing"
              >
                {/* Emoji Animation */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 0.3
                  }}
                  className="text-6xl sm:text-8xl drop-shadow-2xl"
                >
                  {currentNarration.emoji}
                </motion.div>

                {/* Visual Content */}
                <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight px-2">
                  {currentNarration.visualContent}
                </h2>

                {/* Narration Text */}
                <div className="p-4 sm:p-6 bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 dark:from-violet-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl border-2 border-violet-200 dark:border-violet-700 shadow-lg mx-2 sm:mx-0">
                  <p className="text-base sm:text-xl leading-relaxed">
                    {currentNarration.narration.split(' ').map((word, idx) => {
                      const isHighlighted = currentNarration.highlightWords.some(hw => 
                        word.toLowerCase().includes(hw.toLowerCase())
                      );
                      return (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          className={isHighlighted ? 'font-bold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-800/30 px-1 rounded' : ''}
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
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-3 sm:p-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-amber-900/30 rounded-xl border-2 border-amber-300 dark:border-amber-700 shadow-md mx-2 sm:mx-0"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 text-amber-900 dark:text-amber-100">
                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-amber-500" />
                        <p className="text-sm sm:text-base font-semibold">{currentNarration.teacherTip}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Swipe Hint (Mobile Only) */}
                {currentScene === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground sm:hidden"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Swipe to navigate
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
            {/* Previous Button (Hidden on first scene) */}
            {currentScene > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevious}
                className="flex-none border-2 hover:bg-violet-50 dark:hover:bg-violet-900/20 px-3 sm:px-4"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline ml-1">Back</span>
              </Button>
            )}

            {/* Audio Control */}
            <Button
              variant="outline"
              size="lg"
              onClick={toggleAudio}
              className="flex-1 border-2 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-sm sm:text-base"
              disabled={!isSupported}
            >
              {isSpeaking ? (
                <>
                  <Pause className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Pause</span>
                  <span className="sm:hidden">Pause</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{isAutoPlaying ? 'Resume' : 'Play'}</span>
                  <span className="sm:hidden">Play</span>
                </>
              )}
            </Button>

            {/* Next/Start Button */}
            <Button
              variant="default"
              size="lg"
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
            >
              {currentScene === welcomeScenes.length - 1 ? (
                <>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  Start!
                </>
              ) : (
                <>
                  <span className="hidden sm:inline mr-1 sm:mr-2">Continue</span>
                  <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
                </>
              )}
            </Button>
          </div>

          {/* Skip All */}
          <div className="text-center pt-1 sm:pt-2">
            <button 
              onClick={handleSkip}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
            >
              Skip and start learning
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
