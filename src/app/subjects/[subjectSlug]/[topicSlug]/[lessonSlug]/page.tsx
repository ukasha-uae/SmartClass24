
'use client';

import { getSubjectBySlug } from '@/lib/jhs-data';
import { notFound, useParams } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Target, Lightbulb, ListChecks, FileText, BookOpen, Brain } from 'lucide-react';
import Link from 'next/link';
import ReadAloud from '@/components/ReadAloud';
import LessonCompleteQuiz from '@/components/LessonCompleteQuiz';
import LessonVisual, { ConceptCard, TipCard, ExampleCard, SuccessCard } from '@/components/LessonVisual';
import { IconGrid, FloatingIcon } from '@/components/AnimatedIcons';
import { useFirebase } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Lesson } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export default function LessonPage() {
  const params = useParams();
  const subjectSlug = params.subjectSlug as string;
  const topicSlug = params.topicSlug as string;
  const lessonSlug = params.lessonSlug as string;

  const { firestore } = useFirebase();
  const [firestoreLesson, setFirestoreLesson] = useState<Lesson | null>(null);
  const [isFirestoreLoading, setIsFirestoreLoading] = useState(true);
  
  const subjectInfo = getSubjectBySlug(subjectSlug);

  // Calculate local lesson synchronously
  const localTopic = subjectInfo?.curriculum
      .flatMap(c => c.topics)
      .find(t => t.slug === topicSlug);
  const localLesson = localTopic?.lessons.find(l => l.slug === lessonSlug) || null;

  // STABILITY FIX: If local lesson exists, use it immediately and ignore Firestore.
  // This prevents flickering and async state updates from interfering with local development.
  const lesson = localLesson || firestoreLesson;

  useEffect(() => {
    // If we already have the lesson locally, no need to fetch from Firestore.
    if (localLesson) {
        setIsFirestoreLoading(false);
        return;
    }

    const fetchFirestoreLesson = async () => {
      if (!firestore) {
        // Wait for firestore to initialize
        return;
      }

      try {
        const lessonsRef = collection(firestore, `subjects/${subjectSlug}/topics/${topicSlug}/lessons`);
        const lessonsSnapshot = await getDocs(lessonsRef);
        const lessons = lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
        const found = lessons.find(l => l.slug === lessonSlug) || null;
        if (found) {
            setFirestoreLesson(found);
        }
      } catch (error) {
        console.error("Error fetching lesson from Firestore:", error);
      } finally {
        setIsFirestoreLoading(false);
      }
    };

    fetchFirestoreLesson();
  }, [firestore, subjectSlug, topicSlug, lessonSlug, localLesson]);

  // Only show loading if we don't have a lesson AND we are still trying to fetch one
  if (!lesson && isFirestoreLoading && !localLesson) {
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    )
  }

  if (!lesson) {
    notFound();
  }
  
  if (!subjectInfo) {
      return <div>Subject not found</div>;
  }

  if (!lesson) {
    notFound();
  }
  
  if (!subjectInfo) {
      notFound();
  }

  const introductionId = `lesson-${lesson.slug}-intro`;
  const summaryId = `lesson-${lesson.slug}-summary`;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Link
        href={`/subjects/${subjectSlug}`}
        className="inline-flex items-center text-primary mb-4 hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to {subjectInfo.name}
      </Link>
      <div className="relative">
        <FloatingIcon icon="lightbulb" position="tr" size="lg" />
        <FloatingIcon icon="brain" position="br" size="md" />
        <h1 className="text-4xl font-bold font-headline mb-2">{lesson.title}</h1>
        <p className="text-lg text-muted-foreground mb-8">
          From topic: {topicSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {lesson.objectives && lesson.objectives.length > 0 && (
            <LessonVisual type="objective" title="🎯 Lesson Objectives" icon="target">
              <ul className="space-y-2">
                {lesson.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </LessonVisual>
          )}

          {lesson.introduction && (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                    <Lightbulb className="h-6 w-6 mr-3 text-primary" />
                    Introduction
                </CardTitle>
                <ReadAloud textId={introductionId} />
                </CardHeader>
                <CardContent>
                <MarkdownRenderer id={introductionId} content={lesson.introduction} className="leading-relaxed" />
                </CardContent>
            </Card>
          )}

          {lesson.keyConcepts && lesson.keyConcepts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                Key Concepts
              </h2>
              <div className="space-y-4">
                {lesson.keyConcepts.map((concept, i) => {
                  const conceptId = `${lesson.id}-concept-${i}`;
                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{concept.title}</h3>
                        <ReadAloud textId={conceptId} />
                      </div>
                      <ConceptCard title="" icon="brain">
                        <MarkdownRenderer id={conceptId} content={concept.content} />
                      </ConceptCard>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {lesson.activities && lesson.activities.questions && lesson.activities.questions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ListChecks className="h-6 w-6 text-primary" />
                Practice Activities
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5" />
                    {lesson.activities.questions.length} Interactive Practice Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Complete these practice exercises to reinforce your understanding of the concepts. 
                    These activities include multiple choice, fill-in-the-blank, matching, and other question types.
                  </p>
                  <LessonCompleteQuiz 
                    lessonId={`${lesson.id}-activities`}
                    subjectSlug={subjectSlug}
                    topicSlug={topicSlug}
                    lessonSlug={lessonSlug}
                    localQuizzes={lesson.activities.questions}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="space-y-6">
            {lesson.summary && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Summary
                  </h3>
                  <ReadAloud textId={summaryId} />
                </div>
                <LessonVisual type="summary" icon="fileText">
                  <MarkdownRenderer id={summaryId} content={lesson.summary} />
                </LessonVisual>
              </div>
            )}

            {lesson.pastQuestions && lesson.pastQuestions.length > 0 && (
                <Card className="bg-primary text-primary-foreground">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>BECE Past Questions</CardTitle>
                        <ReadAloud textId={`${lesson.id}-pastquestions`} />
                    </CardHeader>
                    <CardContent id={`${lesson.id}-pastquestions`}>
                        {lesson.pastQuestions.map((pq, i) => (
                            <div key={i} className="mb-4">
                                <p className="font-semibold">{pq.question}</p>
                                <details className="mt-1 text-sm">
                                    <summary className="cursor-pointer">View Solution</summary>
                                    <p className="pt-2">{pq.solution}</p>
                                </details>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

             <LessonCompleteQuiz 
                lessonId={lesson.id}
                subjectSlug={subjectSlug}
                topicSlug={topicSlug}
                lessonSlug={lessonSlug}
                localQuizzes={lesson.endOfLessonQuiz}
             />
        </div>
      </div>
    </div>
  );
}
