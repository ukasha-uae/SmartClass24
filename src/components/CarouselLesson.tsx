'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Brain, 
  FileText, 
  Award, 
  ListChecks,
  CheckCircle,
  X,
  Lightbulb
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import LessonCompleteQuiz from './LessonCompleteQuiz';

interface CarouselLessonProps {
  lesson: any;
  subjectSlug: string;
  topicSlug: string;
  lessonSlug: string;
  educationLevel: 'Primary' | 'JHS' | 'SHS' | null;
  localQuizzes?: any[];
  introComponent?: React.ReactNode;
  onExit?: () => void;
  onSlideChange?: (slideIndex: number, totalSlides: number) => void;
}

export function CarouselLesson({
  lesson,
  subjectSlug,
  topicSlug,
  lessonSlug,
  educationLevel,
  localQuizzes,
  introComponent,
  onExit,
  onSlideChange
}: CarouselLessonProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [introCompleted, setIntroCompleted] = useState(false);

  // Build slides array
  const buildSlides = () => {
    const slides: any[] = [];

    // Slide 0: Objectives (if exists)
    if (lesson.objectives && lesson.objectives.length > 0) {
      slides.push({
        type: 'objectives',
        title: '🎯 Lesson Objectives',
        icon: Lightbulb,
        content: lesson.objectives
      });
    }

    // Slides: Key Concepts (each concept = 1 slide)
    if (lesson.keyConcepts && lesson.keyConcepts.length > 0) {
      lesson.keyConcepts.forEach((concept: any, i: number) => {
        slides.push({
          type: 'concept',
          title: concept.title,
          icon: Brain,
          content: concept.content,
          conceptIndex: i
        });
      });
    }

    // Slide: Summary
    if (lesson.summary) {
      slides.push({
        type: 'summary',
        title: 'Summary',
        icon: FileText,
        content: lesson.summary
      });
    }

    // Slides: WASSCE/BECE Past Questions (each question = 1 slide)
    if (lesson.pastQuestions && lesson.pastQuestions.length > 0) {
      lesson.pastQuestions.forEach((pq: any, i: number) => {
        slides.push({
          type: 'pastQuestion',
          title: `${educationLevel === 'SHS' ? 'WASSCE' : educationLevel === 'JHS' ? 'BECE' : 'Past'} Question ${i + 1}`,
          icon: Award,
          content: pq,
          questionIndex: i,
          totalQuestions: lesson.pastQuestions.length
        });
      });
    }

    // Slide: Practice Activities
    if (lesson.activities && lesson.activities.questions && lesson.activities.questions.length > 0) {
      slides.push({
        type: 'activities',
        title: 'Practice Activities',
        icon: ListChecks,
        content: lesson.activities.questions
      });
    }

    // Slide: End of Lesson Quiz
    if (localQuizzes && localQuizzes.length > 0) {
      slides.push({
        type: 'quiz',
        title: 'End of Lesson Quiz',
        icon: CheckCircle,
        content: localQuizzes
      });
    }

    return slides;
  };

  // Build slides to get total count
  const slides = buildSlides();
  const totalSlides = slides.length;

  // Notify parent of slide changes
  useEffect(() => {
    if (introCompleted && onSlideChange) {
      onSlideChange(currentSlideIndex, totalSlides);
    }
  }, [currentSlideIndex, introCompleted, totalSlides, onSlideChange]);

  // Enable immersive mode on mount, disable on unmount
  useEffect(() => {
    document.body.classList.add('immersive-lesson-mode');
    return () => {
      document.body.classList.remove('immersive-lesson-mode');
    };
  }, []);

  const handleNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleIntroComplete = () => {
    setIntroCompleted(true);
  };

  // Show intro first
  if (introComponent && !introCompleted) {
    return React.cloneElement(introComponent as React.ReactElement, {
      onComplete: handleIntroComplete,
      currentSlide: 0,
      totalSlides: totalSlides,
      isCarouselMode: true
    });
  }

  // Show lesson slides with teacher guidance
  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="immersive-container fixed inset-0 flex flex-col bg-background z-50">
      {/* Compact Header with Navigation */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-2 py-2 shadow-lg flex-shrink-0">
        <div className="flex items-center gap-1">
          {/* Exit button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="text-white hover:bg-white/20 p-1.5 h-8 w-8 flex-shrink-0"
            aria-label="Exit lesson"
          >
            <X className="h-5 w-5" />
          </Button>
          
          {/* Previous Arrow */}
          <button
            onClick={handlePrevious}
            disabled={currentSlideIndex === 0}
            className={`p-1.5 rounded-full flex-shrink-0 touch-manipulation ${currentSlideIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20 active:bg-white/30'}`}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          {/* Slide Title - centered, takes remaining space */}
          <div className="flex-1 text-center min-w-0 px-1">
            <h1 className="text-sm font-semibold truncate">{currentSlide.title}</h1>
            <p className="text-[10px] opacity-80">{currentSlideIndex + 1} of {totalSlides}</p>
          </div>
          
          {/* Next Arrow */}
          <button
            onClick={handleNext}
            disabled={currentSlideIndex === totalSlides - 1}
            className={`p-1.5 rounded-full flex-shrink-0 touch-manipulation ${currentSlideIndex === totalSlides - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20 active:bg-white/30'}`}
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          {/* Progress indicator - compact */}
          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
            <svg className="w-7 h-7 -rotate-90">
              <circle cx="14" cy="14" r="12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <circle cx="14" cy="14" r="12" fill="none" stroke="white" strokeWidth="2" strokeDasharray={`${((currentSlideIndex + 1) / totalSlides) * 75.4} 75.4`} strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content Area - Full Width */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            <Card className="border border-violet-200 dark:border-violet-800 shadow-sm h-full flex flex-col">
              {/* Card Header - only show icon and concept number */}
              {(currentSlide.type === 'concept' || currentSlide.type === 'pastQuestion') && (
                <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 p-2 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    {currentSlide.icon && (
                      <div className="p-1 rounded bg-gradient-to-br from-violet-500 to-purple-600 flex-shrink-0">
                        <currentSlide.icon className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                    <CardDescription className="text-xs">
                      {currentSlide.type === 'concept' 
                        ? `Concept ${currentSlide.conceptIndex + 1} of ${lesson.keyConcepts.length}`
                        : `Question ${currentSlide.questionIndex + 1} of ${currentSlide.totalQuestions}`
                      }
                    </CardDescription>
                  </div>
                </CardHeader>
              )}

              <CardContent className={`flex-1 overflow-y-auto ${currentSlide.type === 'concept' || currentSlide.type === 'pastQuestion' ? 'p-3' : 'p-3 pt-4'}`}>
                {/* Objectives */}
                {currentSlide.type === 'objectives' && (
                  <ul className="space-y-2">
                    {currentSlide.content.map((obj: string, i: number) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 p-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg"
                      >
                        <span className="text-violet-600 dark:text-violet-400 font-bold flex-shrink-0">•</span>
                        <span className="text-sm md:text-base">{obj}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {/* Key Concept */}
                {currentSlide.type === 'concept' && (
                  <div className="prose prose-sm md:prose dark:prose-invert max-w-none">
                    <MarkdownRenderer content={currentSlide.content} id={`concept-${currentSlide.conceptIndex}`} />
                  </div>
                )}

                {/* Summary */}
                {currentSlide.type === 'summary' && (
                  <div className="prose prose-sm md:prose dark:prose-invert max-w-none bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-3 md:p-5 rounded-lg border border-blue-200 dark:border-blue-800">
                    <MarkdownRenderer content={currentSlide.content} id="summary" />
                  </div>
                )}

                {/* Past Question */}
                {currentSlide.type === 'pastQuestion' && (
                  <div className="space-y-3">
                    <div className="p-3 md:p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-300 dark:border-amber-700">
                      <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 text-sm md:text-base">Question:</h4>
                      <div className="text-sm">
                        <MarkdownRenderer content={currentSlide.content.question} />
                      </div>
                    </div>
                    <details className="p-3 md:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-300 dark:border-green-700">
                      <summary className="cursor-pointer font-semibold text-green-900 dark:text-green-100 text-sm md:text-base hover:text-green-700 dark:hover:text-green-300">💡 View Solution</summary>
                      <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800 text-sm">
                        <p className="font-semibold text-green-800 dark:text-green-200 mb-2">Answer: {currentSlide.content.answer}</p>
                        <MarkdownRenderer content={currentSlide.content.explanation || currentSlide.content.solution} />
                      </div>
                    </details>
                  </div>
                )}

                {/* Practice Activities */}
                {currentSlide.type === 'activities' && (
                  <div>
                    <p className="text-muted-foreground mb-4 text-sm md:text-base">
                      Complete these {currentSlide.content.length} practice exercises to reinforce your understanding.
                    </p>
                    <LessonCompleteQuiz 
                      lessonId={`${lesson.id}-activities`}
                      subjectSlug={subjectSlug}
                      topicSlug={topicSlug}
                      lessonSlug={lessonSlug}
                      localQuizzes={currentSlide.content}
                    />
                  </div>
                )}

                {/* End of Lesson Quiz */}
                {currentSlide.type === 'quiz' && (
                  <div>
                    <p className="text-muted-foreground mb-4 text-sm md:text-base">
                      Complete this quiz to test your understanding and mark this lesson as complete.
                    </p>
                    <LessonCompleteQuiz 
                      lessonId={lesson.id}
                      subjectSlug={subjectSlug}
                      topicSlug={topicSlug}
                      lessonSlug={lessonSlug}
                      localQuizzes={currentSlide.content}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
