"use client";

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { getProgrammeBySlug } from '@/lib/shs-data';
import { useLocalization } from '@/hooks/useLocalization';
import { useLocalizedLesson } from '@/hooks/useLocalizedLesson';
import AccountingDefinitionIntro from '@/components/lesson-intros/financial-accounting/shs1/AccountingDefinitionIntro';
import SalesPurchasesJournalsIntro from '@/components/lesson-intros/financial-accounting/shs1/SalesPurchasesJournalsIntro';
import CashPettyCashBookWorkshop from '@/components/lesson-intros/financial-accounting/shs1/CashPettyCashBookWorkshop';
import UsersOfInformationIntro from '@/components/lesson-intros/financial-accounting/shs1/UsersOfInformationIntro';
import BranchesOfAccountingIntro from '@/components/lesson-intros/financial-accounting/shs1/BranchesOfAccountingIntro';
import BusinessEntityIntro from '@/components/lesson-intros/financial-accounting/shs1/BusinessEntityIntro';
import GoingConcernIntro from '@/components/lesson-intros/financial-accounting/shs1/GoingConcernIntro';
import AccrualConceptIntro from '@/components/lesson-intros/financial-accounting/shs1/AccrualConceptIntro';
import ConsistencyPrudenceIntro from '@/components/lesson-intros/financial-accounting/shs1/ConsistencyPrudenceIntro';
import { CarouselLesson } from '@/components/CarouselLesson';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Target, Lightbulb, Brain, ListChecks, FileText, Award, BookOpen, Clock, Sparkles, Bell } from 'lucide-react';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ReadAloud from '@/components/ReadAloud';
import LessonCompleteQuiz from '@/components/LessonCompleteQuiz';
import LessonVisual from '@/components/LessonVisual';
import { V1RouteGuard } from '@/components/V1RouteGuard';

// Coming Soon Component
function ComingSoonPage({ 
  topicName, 
  subjectName, 
  programmeName,
  backUrl 
}: { 
  topicName: string; 
  subjectName: string; 
  programmeName: string;
  backUrl: string;
}) {
  const { localizeContent } = useLocalization();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
            <Clock className="w-16 h-16 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="w-6 h-6 text-yellow-900" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Coming Soon! 🚀
        </h1>

        {/* Topic Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-purple-300 mb-2">
            {topicName}
          </h2>
          <p className="text-gray-300 mb-4">
            {subjectName} • {programmeName}
          </p>
          <p className="text-gray-400">
            Our team of educators is working hard to create engaging, interactive content for this topic. 
            Check back soon for an amazing learning experience!
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="w-10 h-10 mx-auto mb-2 bg-blue-500/20 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-sm text-gray-300">Interactive Lessons</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="w-10 h-10 mx-auto mb-2 bg-green-500/20 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-sm text-gray-300">Practice Quizzes</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="w-10 h-10 mx-auto mb-2 bg-orange-500/20 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-sm text-gray-300">{localizeContent('{{exam:secondary}}')} Prep</p>
          </div>
        </div>

        {/* Notify Me (placeholder) */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 mb-8 border border-purple-500/30">
          <div className="flex items-center justify-center gap-2 text-purple-300">
            <Bell className="w-5 h-5" />
            <span className="text-sm">Content is being developed by expert educators</span>
          </div>
        </div>

        {/* Back Button */}
        <Link href={backUrl}>
          <Button 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {subjectName}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ElectiveLessonPage({ 
  params 
}: { 
  params: { 
    programmeSlug: string; 
    subjectSlug: string; 
    lessonSlug: string 
  } 
}) {
  const [mounted, setMounted] = useState(false);
  const { programmeSlug, subjectSlug, lessonSlug } = params;
  const router = useRouter();
  
  // Get the localized lesson data at the top level (before any conditional logic)
  // This ensures hooks are always called in the same order
  const lesson = useLocalizedLesson(
    subjectSlug, 
    lessonSlug, 
    lessonSlug
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const programme = getProgrammeBySlug(programmeSlug);
  
  if (!programme) {
    notFound();
  }

  const subject = programme.electiveSubjects.find(s => s.slug === subjectSlug);

  if (!subject) {
    notFound();
  }

  // Find the topic to get its name for Coming Soon page
  const topic = subject.topics.find(t => t.slug === lessonSlug);

  // If lesson doesn't exist, show Coming Soon page instead of 404
  if (!lesson) {
    return (
      <ComingSoonPage
        topicName={topic?.name || lessonSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        subjectName={subject.name}
        programmeName={programme.name}
        backUrl={`/shs-programmes/${programmeSlug}/${subjectSlug}`}
      />
    );
  }

  // Check if this is a carousel-enabled lesson (lessons with full content from data files)
  const isCarouselLesson = lesson.keyConcepts && lesson.keyConcepts.length > 0;

  // Create custom intro component based on lesson slug
  const getIntroComponent = () => {
    // Financial Accounting SHS1 intros
    if (lessonSlug === 'facc-shs1-intro-definition-objectives') {
      return <AccountingDefinitionIntro onComplete={() => {}} />;
    }
    if (lessonSlug === 'facc-shs1-intro-users-information') {
      return <UsersOfInformationIntro onComplete={() => {}} />;
    }
    if (lessonSlug === 'facc-shs1-intro-branches') {
      return <BranchesOfAccountingIntro onComplete={() => {}} />;
    }
    if (lessonSlug === 'facc-shs1-concepts-business-entity') {
      return <BusinessEntityIntro onComplete={() => {}} />;
    }
    if (lessonSlug === 'facc-shs1-concepts-going-concern') {
      return <GoingConcernIntro onComplete={() => {}} />;
    }
    if (lessonSlug === 'facc-shs1-concepts-accrual') {
      return <AccrualConceptIntro onComplete={() => {}} />;
    }
    if (lessonSlug === 'facc-shs1-concepts-consistency-prudence') {
      return <ConsistencyPrudenceIntro onComplete={() => {}} />;
    }
    if (lessonSlug === 'facc-shs1-boe-sales-purchases-journals') {
      return <SalesPurchasesJournalsIntro onComplete={() => {}} />;
    }
    if (lessonSlug === 'facc-shs1-boe-cash-petty-cash-book') {
      return <CashPettyCashBookWorkshop onComplete={() => {}} />;
    }
    
    // Add more custom intros here as they're created
    // For now, return null for lessons without custom intros
    return null;
  };

  const customIntro = getIntroComponent();

  // Generate IDs for read-aloud
  const introductionId = `${lesson.id}-introduction`;

  return (
    <V1RouteGuard campus="shs" feature="lessons">
      <div className="min-h-screen bg-background">
      {isCarouselLesson ? (
        <CarouselLesson
          lesson={lesson}
          subjectSlug={subjectSlug}
          topicSlug={lessonSlug}
          lessonSlug={lessonSlug}
          educationLevel="SHS"
          localQuizzes={lesson.endOfLessonQuiz || []}
          introComponent={customIntro}
          onExit={() => router.push(`/shs-programmes/${programmeSlug}/${subjectSlug}`)}
        />
      ) : (
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <Link href={`/shs-programmes/${programmeSlug}/${subjectSlug}`}>
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {subject.name}
            </Button>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">{subject.name}</Badge>
              <Badge variant="outline">{programme.name}</Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">{lesson.title}</h1>
          </div>

          {/* Lesson Content */}
          <div className="space-y-8">
            {/* Objectives */}
            {lesson.objectives && lesson.objectives.length > 0 && (
              <LessonVisual>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Learning Objectives
                </h2>
                <ul className="space-y-2">
                  {lesson.objectives.map((obj: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </LessonVisual>
            )}

            {/* Introduction */}
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

            {/* Key Concepts */}
            {lesson.keyConcepts && lesson.keyConcepts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-primary" />
                    Key Concepts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {lesson.keyConcepts.map((concept: any, i: number) => {
                      const conceptId = `${lesson.id}-concept-${i}`;
                      return (
                        <AccordionItem key={i} value={`concept-${i}`}>
                          <AccordionTrigger className="text-left">
                            <span className="font-semibold">{concept.title}</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-2">
                              <MarkdownRenderer id={conceptId} content={concept.content} />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {/* Activities */}
            {lesson.activities && Array.isArray(lesson.activities) && lesson.activities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-primary" />
                    Practice Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {lesson.activities.map((activity: any, i: number) => (
                      <div key={i} className="border-l-4 border-primary pl-4">
                        <p className="font-semibold mb-2">Question {i + 1}:</p>
                        <p className="mb-3">{activity.question}</p>
                        {activity.sampleAnswer && (
                          <details className="text-sm text-muted-foreground">
                            <summary className="cursor-pointer hover:text-foreground">
                              View Sample Answer
                            </summary>
                            <div className="mt-2 p-3 bg-muted rounded-md">
                              <MarkdownRenderer content={activity.sampleAnswer} />
                            </div>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Past Questions */}
            {lesson.pastQuestions && lesson.pastQuestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Past Examination Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {lesson.pastQuestions.map((pq: any, i: number) => (
                      <div key={i} className="border-l-4 border-orange-500 pl-4">
                        <Badge variant="secondary" className="mb-2">{pq.year}</Badge>
                        <p className="font-semibold mb-2">{pq.question}</p>
                        <p className="text-sm text-muted-foreground mb-2">Marks: {pq.marks}</p>
                        <details className="text-sm">
                          <summary className="cursor-pointer hover:text-foreground font-medium">
                            View Model Answer
                          </summary>
                          <div className="mt-2 p-3 bg-muted rounded-md">
                            <MarkdownRenderer content={pq.modelAnswer} />
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Summary */}
            {lesson.summary && (
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Lesson Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MarkdownRenderer content={lesson.summary} />
                </CardContent>
              </Card>
            )}

            {/* End of Lesson Quiz */}
            {lesson.endOfLessonQuiz && lesson.endOfLessonQuiz.length > 0 && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-6 w-6 text-primary" />
                    End of Lesson Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Test your understanding with this comprehensive quiz. 
                    You must score at least 50% to pass.
                  </p>
                  <LessonCompleteQuiz 
                    lessonId={lesson.id}
                    subjectSlug={subjectSlug}
                    topicSlug="elective"
                    lessonSlug={lessonSlug}
                    localQuizzes={lesson.endOfLessonQuiz}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
      </div>
    </V1RouteGuard>
  );
}
