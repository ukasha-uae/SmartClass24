'use client';

import { useState, useEffect } from 'react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  Target,
  Lightbulb,
  SkipForward,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface IntroScene {
  id: number;
  icon: any;
  narration: string;
  visualContent: string;
  highlightWords: string[];
  teacherTip?: string;
}

interface IntelligentLessonIntroProps {
  lessonTitle: string;
  subject: string;
  scenes: IntroScene[];
  onComplete?: () => void;
}

export function IntelligentLessonIntro({ 
  lessonTitle,
  subject,
  scenes,
  onComplete 
}: IntelligentLessonIntroProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  // Safety check: ensure currentScene is valid
  const safeCurrentScene = Math.min(currentScene, scenes.length - 1);
  const currentNarration = scenes[safeCurrentScene];
  
  // Early return if no scenes
  if (!currentNarration) {
    return <div className="p-4 text-center">Loading intro...</div>;
  }
  
  const IconComponent = currentNarration.icon;

  // Split narration into sentences
  const sentences = currentNarration.narration.match(/[^.!?]+[.!?]+/g) || [currentNarration.narration];

  console.log('📖 Narration setup:', {
    sceneIndex: currentScene,
    sentenceCount: sentences.length,
    currentSentenceIndex,
    narrationLength: currentNarration.narration.length
  });

  const { speak, stop, isSpeaking, isSupported, currentCharIndex } = useSpeechSynthesis({
    text: currentNarration.narration,
    autoPlay: isAutoPlaying && hasStarted && !isTransitioning,
    rate: 0.92,
    pitch: 1.05,
    volume: 1,
    onBoundary: (charIndex) => {
      // Calculate which sentence we're currently in based on character index
      let charCount = 0;
      for (let i = 0; i < sentences.length; i++) {
        charCount += sentences[i].length;
        if (charIndex < charCount) {
          console.log('📖 Sentence index:', i, 'at char:', charIndex);
          setCurrentSentenceIndex(i);
          break;
        }
      }
    }
  });

  console.log('📖 Speech state:', { isSpeaking, isSupported, currentCharIndex, currentSentenceIndex });

  // Auto-advance to next scene when narration ends
  useEffect(() => {
    if (!isSpeaking && hasStarted && isAutoPlaying && currentScene < scenes.length - 1 && !isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentScene(prev => prev + 1);
          setShowTip(false);
          setIsTransitioning(false);
        }, 500); // Give time for transition
      }, 1500); // Increased pause so students can read the text
      return () => clearTimeout(timer);
    } else if (!isSpeaking && hasStarted && currentScene === scenes.length - 1) {
      setShowTip(true);
      // Don't auto-advance on final scene - let user click "Start Learning"
    }
  }, [isSpeaking, currentScene, hasStarted, isAutoPlaying, scenes.length, onComplete, isTransitioning]);

  // Show tip mid-narration
  useEffect(() => {
    if (isSpeaking && currentNarration.teacherTip) {
      const tipTimer = setTimeout(() => {
        setShowTip(true);
      }, 2500); // Show tip a bit later during narration
      return () => clearTimeout(tipTimer);
    }
  }, [currentScene, isSpeaking, currentNarration.teacherTip]);

  const handleStart = () => {
    setHasStarted(true);
    setIsAutoPlaying(true);
  };

  const handleNext = () => {
    stop();
    setIsTransitioning(true);
    setCurrentSentenceIndex(0);
    setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setCurrentScene(prev => prev + 1);
        setShowTip(false);
        setIsAutoPlaying(true);
        setIsTransitioning(false);
      } else {
        setIsTransitioning(false);
        onComplete?.();
      }
    }, 300);
  };

  const handlePrevious = () => {
    stop();
    setIsTransitioning(true);
    setCurrentSentenceIndex(0);
    setTimeout(() => {
      if (currentScene > 0) {
        setCurrentScene(prev => prev - 1);
        setShowTip(false);
        setIsAutoPlaying(true);
        setIsTransitioning(false);
      } else {
        setIsTransitioning(false);
      }
    }, 300);
  };

  const handleReset = () => {
    stop();
    setIsTransitioning(true);
    setCurrentSentenceIndex(0);
    setTimeout(() => {
      setCurrentScene(0);
      setShowTip(false);
      setIsAutoPlaying(false);
      setHasStarted(false);
      setIsTransitioning(false);
    }, 300);
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

  const renderHighlightedText = (text: string, highlights: string[]) => {
    // Split into sentences for progressive highlighting
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    return sentences.map((sentence, sentenceIdx) => {
      const words = sentence.trim().split(' ');
      const isCurrentSentence = isSpeaking && sentenceIdx === currentSentenceIndex;
      
      return (
        <motion.span
          key={sentenceIdx}
          initial={{ opacity: 0.6 }}
          animate={{ 
            opacity: isCurrentSentence ? 1 : 0.6,
          }}
          transition={{ duration: 0.3 }}
          className={`inline ${isCurrentSentence ? 'text-violet-900 dark:text-violet-100 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
        >
          {words.map((word, wordIdx) => {
            const isHighlighted = highlights.some(hw => 
              word.toLowerCase().replace(/[.,!?;:]/g, '').includes(hw.toLowerCase())
            );
            return (
              <motion.span
                key={`${sentenceIdx}-${wordIdx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: wordIdx * 0.03 }}
                className={isHighlighted ? 'font-bold text-violet-700 dark:text-violet-300' : ''}
              >
                {word}{' '}
              </motion.span>
            );
          })}
        </motion.span>
      );
    });
  };

  if (!hasStarted) {
    return (
      <Card className="border-2 border-violet-300 dark:border-violet-700 shadow-lg mb-4 md:mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="flex-shrink-0">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-xl"
              >
                <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-white" />
              </motion.div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2 md:space-y-3">
              <div className="space-y-1">
                <Badge variant="secondary" className="mb-1 md:mb-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Intelligent Voice Teacher
                </Badge>
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Ready to Learn {lessonTitle}?
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Let me introduce you to this topic with clear explanations and real-world examples
                </p>
              </div>

              <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                <Badge variant="outline" className="text-xs">
                  <Volume2 className="h-3 w-3 mr-1" />
                  Voice Guided
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Target className="h-3 w-3 mr-1" />
                  {scenes.length} Key Points
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Interactive
                </Badge>
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto">
              <Button 
                size="lg" 
                onClick={handleStart}
                className="w-full md:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg h-12 touch-manipulation select-none active:scale-95 transition-transform"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Lesson
              </Button>
            </div>
          </div>

          {!isSupported && (
            <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg border border-amber-300 dark:border-amber-700">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                ⚠️ Audio narration not supported in this browser. Visual content will still be displayed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const handleSkipIntro = () => {
    stop();
    onComplete?.();
  };

  return (
    <Card className="border-2 border-violet-300 dark:border-violet-700 shadow-lg mb-6 pb-20 sm:pb-6" data-skip-tts="true">
      <CardContent className="p-4 md:p-6 space-y-4">
        {/* Skip Intro Button */}
        <div className="flex justify-end -mt-2 -mr-2 relative z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkipIntro}
            className="text-muted-foreground hover:text-foreground text-xs touch-manipulation select-none active:scale-95 transition-transform min-h-[40px] px-3"
          >
            Skip Intro <SkipForward className="ml-1 h-3 w-3" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1 mb-4">
          {scenes.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                idx <= currentScene 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Icon and Title */}
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  scale: isSpeaking ? [1, 1.1, 1] : 1,
                  rotate: isSpeaking ? [0, 5, -5, 0] : 0
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: isSpeaking ? Infinity : 0
                }}
                className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg flex-shrink-0"
              >
                <IconComponent className="h-8 w-8 text-white" />
              </motion.div>

              <div className="flex-1">
                <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {currentNarration.visualContent}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Point {currentScene + 1} of {scenes.length}
                </p>
              </div>
            </div>

            {/* Narration Text */}
            <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg border-2 border-violet-200 dark:border-violet-700">
              <p className="text-base leading-relaxed">
                {renderHighlightedText(currentNarration.narration, currentNarration.highlightWords)}
              </p>
            </div>

            {/* Teacher Tip */}
            <AnimatePresence>
              {showTip && currentNarration.teacherTip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-3 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg border-2 border-amber-300 dark:border-amber-700"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                        Teacher's Tip:
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        {currentNarration.teacherTip}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Controls - Fixed on mobile */}
        <div className="hidden sm:flex gap-2 pt-2 relative z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAudio}
            disabled={!isSupported}
            className="h-10 md:h-9 touch-manipulation select-none active:scale-95 transition-transform"
          >
            {isSpeaking ? (
              <>
                <Pause className="h-4 w-4 md:mr-2" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                {isAutoPlaying ? <Volume2 className="h-4 w-4 md:mr-2" /> : <VolumeX className="h-4 w-4 md:mr-2" />}
                <span className="hidden sm:inline">{isAutoPlaying ? 'Resume' : 'Play'}</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentScene === 0}
            className="h-10 md:h-9 touch-manipulation select-none active:scale-95 transition-transform"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleNext}
            className={`flex-1 h-10 md:h-9 touch-manipulation select-none active:scale-95 transition-transform ${
              currentScene === scenes.length - 1 
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg animate-pulse'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700'
            }`}
          >
            {currentScene === scenes.length - 1 ? (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Start Lesson
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Next ({currentScene + 2}/{scenes.length})</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-10 md:h-9 px-2 touch-manipulation select-none active:scale-95 transition-transform"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Fixed Mobile Navigation */}
        <div className="fixed sm:hidden bottom-0 left-0 right-0 bg-white/98 dark:bg-gray-900/98 backdrop-blur-md px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] border-t border-gray-200 dark:border-gray-700 z-50 shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentScene === 0}
              className={`p-2 h-10 touch-manipulation select-none active:scale-95 transition-all ${
                currentScene === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAudio}
                disabled={!isSupported}
                className="p-2 h-10 touch-manipulation select-none active:scale-95 transition-transform"
              >
                {isSpeaking ? <Pause className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              
              <div className="flex gap-1">
                {scenes.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentScene 
                        ? 'bg-violet-600 w-4' 
                        : idx < currentScene 
                          ? 'bg-violet-400' 
                          : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={handleNext}
              className={`p-2 h-10 touch-manipulation select-none active:scale-95 transition-transform ${
                currentScene === scenes.length - 1 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg'
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600'
              }`}
            >
              {currentScene === scenes.length - 1 ? (
                <Play className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default IntelligentLessonIntro;
