'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Volume2, VolumeX, Sparkles, Target, Hand } from 'lucide-react';
import { TeacherVoice } from '@/components/virtual-labs/TeacherVoice';
import { CarouselLesson } from '@/components/CarouselLesson';

interface TeacherGuidedCarouselProps {
  lesson: any;
  subjectSlug: string;
  topicSlug: string;
  lessonSlug: string;
  educationLevel: 'Primary' | 'JHS' | 'SHS' | null;
  localQuizzes?: any[];
  introComponent: React.ReactElement;
  onExit?: () => void;
  lessonGuidance: Record<number, {
    message: string;
    action?: string;
    tip?: string;
  }>;
}

export function TeacherGuidedCarousel({
  lesson,
  subjectSlug,
  topicSlug,
  lessonSlug,
  educationLevel,
  localQuizzes,
  introComponent,
  onExit,
  lessonGuidance
}: TeacherGuidedCarouselProps) {
  const [teacherEnabled, setTeacherEnabled] = useState(true);
  const [currentTeacherMessage, setCurrentTeacherMessage] = useState('');
  const [currentAction, setCurrentAction] = useState('');
  const [currentTip, setCurrentTip] = useState('');
  const [showSelfReadingBanner, setShowSelfReadingBanner] = useState(false);
  const [showActionPrompt, setShowActionPrompt] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(-1);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isInIntro, setIsInIntro] = useState(true);
  
  // Intro guidance message
  const introGuidance = {
    message: "Welcome to this lesson! I'm your teacher, and I'll guide you through every step. The intro carousel will help you understand the basics. Click through each slide, and when you're ready, click 'Start Lesson' to begin the main content. I'll be with you every step of the way!",
    action: "Click through the intro carousel slides to learn the basics, then click 'Start Lesson' to begin.",
    tip: "Your teacher will explain every slide and tell you what to do!"
  };
  
  // Update guidance based on slide index
  const updateGuidance = useCallback((slideIndex: number, inIntro: boolean = false) => {
    if (!teacherEnabled) return;

    console.log('Updating guidance for slide:', slideIndex, 'inIntro:', inIntro);

    // If in intro, use intro guidance
    if (inIntro || slideIndex === -1) {
      setCurrentTeacherMessage(introGuidance.message);
      setCurrentAction(introGuidance.action);
      setCurrentTip(introGuidance.tip);
      setShowActionPrompt(true);
      setTimeout(() => setShowActionPrompt(false), 10000);
      return;
    }

    // Otherwise use lesson-specific guidance
    const guidance = lessonGuidance[slideIndex];
    if (guidance) {
      console.log('Setting guidance:', guidance);
      setCurrentTeacherMessage(guidance.message);
      setCurrentAction(guidance.action || '');
      setCurrentTip(guidance.tip || '');
      
      if (guidance.action) {
        setShowActionPrompt(true);
        setTimeout(() => setShowActionPrompt(false), 10000);
      }
    } else {
      console.warn('No guidance found for slide:', slideIndex);
    }
  }, [teacherEnabled, lessonGuidance, introGuidance]);

  // Initialize guidance on mount
  useEffect(() => {
    if (teacherEnabled && isInIntro) {
      console.log('Initial guidance - in intro');
      updateGuidance(-1, true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update guidance when slide changes
  useEffect(() => {
    if (teacherEnabled && !isInIntro && currentSlideIndex >= 0) {
      console.log('Slide changed to:', currentSlideIndex);
      updateGuidance(currentSlideIndex, false);
    }
  }, [currentSlideIndex, teacherEnabled, isInIntro, updateGuidance]);

  const toggleTeacher = () => {
    const newState = !teacherEnabled;
    setTeacherEnabled(newState);
    
    if (newState) {
      updateGuidance(currentSlideIndex, isInIntro);
      setShowSelfReadingBanner(false);
    } else {
      setShowSelfReadingBanner(true);
      setTimeout(() => setShowSelfReadingBanner(false), 3000);
    }
  };

  return (
    <div className="relative">
      {/* Self-Reading Mode Banner */}
      <AnimatePresence>
        {showSelfReadingBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span className="font-medium">Self-Reading Mode Active</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Prompt */}
      <AnimatePresence>
        {showActionPrompt && currentAction && teacherEnabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl max-w-md border-2 border-white/30"
          >
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-full mt-1">
                <Hand className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm mb-1 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  ACTION REQUIRED
                </div>
                <p className="text-sm leading-relaxed">{currentAction}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress & Tip Indicator */}
      {!isInIntro && currentSlideIndex >= 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-purple-600" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Slide {currentSlideIndex + 1} of {totalSlides}
              </span>
            </div>
            {currentTip && (
              <>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
                <div className="flex items-center gap-1.5 max-w-xs">
                  <span className="text-yellow-600">💡</span>
                  <span className="text-gray-600 dark:text-gray-400 truncate">{currentTip}</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Teacher Toggle Button */}
      <motion.button
        onClick={toggleTeacher}
        className={`fixed top-28 right-4 z-50 p-3 rounded-full shadow-2xl transition-all ${
          teacherEnabled 
            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' 
            : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={teacherEnabled ? 'Disable Teacher Guidance' : 'Enable Teacher Guidance'}
      >
        {teacherEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </motion.button>

      {/* Teacher Voice Component */}
      {teacherEnabled && currentTeacherMessage && (
        <TeacherVoice 
          message={currentTeacherMessage}
          autoPlay={true}
        />
      )}

      {/* Carousel Lesson with slide tracking */}
      <CarouselLesson
        lesson={lesson}
        subjectSlug={subjectSlug}
        topicSlug={topicSlug}
        lessonSlug={lessonSlug}
        educationLevel={educationLevel}
        localQuizzes={localQuizzes}
        introComponent={introComponent}
        onExit={onExit}
        onSlideChange={(index: number, total: number) => {
          console.log('Slide changed via callback:', index, 'of', total);
          setCurrentSlideIndex(index);
          setTotalSlides(total);
          setIsInIntro(false); // When slides change, we're definitely out of intro
          updateGuidance(index, false);
        }}
      />

      {/* First-time Help Tooltip */}
      <AnimatePresence>
        {isInIntro && teacherEnabled && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ delay: 2 }}
            className="fixed bottom-24 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-sm text-sm border-2 border-purple-200 dark:border-purple-800 z-50"
          >
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-purple-600 dark:text-purple-400 mb-1">Your Teacher is Here!</p>
                <p className="text-gray-700 dark:text-gray-300">
                  I'll guide you through every slide, explain what you're learning, and tell you exactly what actions to take. Watch for green prompts below!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
