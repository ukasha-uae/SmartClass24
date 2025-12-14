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
  Home,
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
}

export function CarouselLesson({
  lesson,
  subjectSlug,
  topicSlug,
  lessonSlug,
  educationLevel,
  localQuizzes,
  introComponent,
  onExit
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

  const slides = buildSlides();
  const currentSlide = slides[currentSlideIndex];
  const totalSlides = slides.length;

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
      onComplete: handleIntroComplete
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-3 md:p-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl font-bold truncate">{lesson.title}</h1>
              <p className="text-xs md:text-sm opacity-90">
                {currentSlideIndex + 1}/{totalSlides}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={onExit}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Home className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 dark:bg-gray-800">
        <div 
          className="h-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300"
          style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Slide Content */}
      <div className="flex-1 container mx-auto p-2 md:p-4 lg:p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Card className="h-full border-2 border-violet-200 dark:border-violet-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 p-3 md:p-6">
                <div className="flex items-center gap-2 md:gap-3">
                  {currentSlide.icon && (
                    <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg flex-shrink-0">
                      <currentSlide.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg md:text-2xl truncate md:whitespace-normal">{currentSlide.title}</CardTitle>
                    {currentSlide.type === 'concept' && (
                      <CardDescription>
                        Key Concept {currentSlide.conceptIndex + 1} of {lesson.keyConcepts.length}
                      </CardDescription>
                    )}
                    {currentSlide.type === 'pastQuestion' && (
                      <CardDescription>
                        Question {currentSlide.questionIndex + 1} of {currentSlide.totalQuestions}
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {currentSlideIndex + 1}/{totalSlides}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-3 md:p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                {/* Objectives */}
                {currentSlide.type === 'objectives' && (
                  <ul className="space-y-2 md:space-y-3">
                    {currentSlide.content.map((obj: string, i: number) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg"
                      >
                        <span className="text-violet-600 dark:text-violet-400 font-bold text-lg md:text-xl flex-shrink-0">•</span>
                        <span className="text-sm md:text-lg">{obj}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {/* Key Concept */}
                {currentSlide.type === 'concept' && (
                  <div className="prose dark:prose-invert max-w-none">
                    <MarkdownRenderer 
                      content={currentSlide.content}
                      id={`concept-${currentSlide.conceptIndex}`}
                    />
                  </div>
                )}

                {/* Summary */}
                {currentSlide.type === 'summary' && (
                  <div className="prose dark:prose-invert max-w-none bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                    <MarkdownRenderer 
                      content={currentSlide.content}
                      id="summary"
                    />
                  </div>
                )}

                {/* Past Question */}
                {currentSlide.type === 'pastQuestion' && (
                  <div className="space-y-3 md:space-y-4">
                    <div className="p-3 md:p-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg md:rounded-xl border-2 border-amber-300 dark:border-amber-700">
                      <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 md:mb-3 text-base md:text-lg">
                        Question:
                      </h4>
                      <div className="text-sm md:text-base">
                        <MarkdownRenderer content={currentSlide.content.question} />
                      </div>
                    </div>

                    <details className="p-3 md:p-6 bg-green-50 dark:bg-green-900/20 rounded-lg md:rounded-xl border-2 border-green-300 dark:border-green-700">
                      <summary className="cursor-pointer font-semibold text-green-900 dark:text-green-100 text-base md:text-lg hover:text-green-700 dark:hover:text-green-300">
                        💡 View Solution
                      </summary>
                      <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t-2 border-green-200 dark:border-green-800 text-sm md:text-base">
                        <MarkdownRenderer content={currentSlide.content.solution} />
                      </div>
                    </details>
                  </div>
                )}

                {/* Practice Activities */}
                {currentSlide.type === 'activities' && (
                  <div>
                    <p className="text-muted-foreground mb-6 text-lg">
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
                    <p className="text-muted-foreground mb-6 text-lg">
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

      {/* Floating Side Navigation Buttons (Tablet & Desktop) */}
      <div className="hidden md:block">
        {/* Previous Button - Left Side */}
        {currentSlideIndex > 0 && (
          <Button
            variant="default"
            size="lg"
            onClick={handlePrevious}
            className="fixed left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full bg-violet-600 hover:bg-violet-700 shadow-lg hover:shadow-xl transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        )}

        {/* Next Button - Right Side */}
        {currentSlideIndex < totalSlides - 1 && (
          <Button
            variant="default"
            size="lg"
            onClick={handleNext}
            className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full bg-violet-600 hover:bg-violet-700 shadow-lg hover:shadow-xl transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        )}
      </div>

      {/* Mobile Floating Navigation */}
      <div className="md:hidden fixed bottom-20 left-0 right-0 z-40 flex justify-between px-4">
        {currentSlideIndex > 0 ? (
          <Button
            variant="default"
            size="lg"
            onClick={handlePrevious}
            className="w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-700 shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-12" /> 
        )}
        
        {currentSlideIndex < totalSlides - 1 ? (
          <Button
            variant="default"
            size="lg"
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-700 shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-12" />
        )}
      </div>

      {/* Compact Bottom Progress Indicator */}
      <div className="sticky bottom-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t py-2 z-30">
        <p className="text-center text-xs text-muted-foreground">
          {currentSlideIndex + 1} of {totalSlides}
        </p>
      </div>
    </div>
  );
}
