"use client";

import { getVirtualLabBySlug } from '@/lib/virtual-labs-data';
import { useFirebase } from '@/firebase/provider';
import { isPremiumUser } from '@/lib/monetization';
import { ArrowLeft, FlaskConical, CheckCircle2, ArrowRight, Trophy, Star, Zap, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLabProgress } from '@/stores/lab-progress-store';
import { LabNotes } from '@/components/virtual-labs/LabNotes';
import confetti from 'canvas-confetti';
import { V1RouteGuard, useV1FeatureAccess } from '@/components/V1RouteGuard';
import { ShareVirtualLabDialog } from '@/components/virtual-labs/ShareVirtualLabDialog';
import { useTenantLink } from '@/hooks/useTenantLink';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function VirtualLabPage({ params }: { params: { labSlug: string } }) {
  // V1 Route Guard: Check if user has access to virtual labs
  const { hasAccess, campus } = useV1FeatureAccess('virtualLabs');
  const { user, isUserLoading } = useFirebase();
  const addTenantParam = useTenantLink();
  
  const { labSlug } = params;
  const [mounted, setMounted] = useState(false);
  const [experimentCompleted, setExperimentCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [labCompleted, setLabCompleted] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const { markLabComplete, isLabCompleted } = useLabProgress();

  useEffect(() => {
    setMounted(true);
    setStartTime(Date.now());
    
    // Track user interaction (scroll or click) to show completion controls
    const handleInteraction = () => {
      setUserInteracted(true);
    };
    
    window.addEventListener('scroll', handleInteraction, { once: true });
    window.addEventListener('click', handleInteraction, { once: true });
    
    return () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };
  }, []);

  // CRITICAL: Wait for both mount and auth state to be ready
  // This prevents checking lab access with 'guest' userId before user loads
  if (!mounted || isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading virtual lab...</p>
        </div>
      </div>
    );
  }

  const userId = user?.uid || 'guest';
  console.log('[Virtual Lab Page] Checking access with userId:', userId, 'isUserLoading:', isUserLoading);
  const experiment = getVirtualLabBySlug(labSlug, userId);
  
  if (!experiment) {
    notFound();
  }

  const LabComponent = experiment.component;
  
  // Check if this is a self-contained enhanced lab (has its own quiz/completion flow)
  const isEnhancedLab = LabComponent.name?.includes('Enhanced') || 
                        [
                          // Physics Labs
                          'hookes-law', 'simple-circuits', 'work-energy-inclined-plane', 'ohms-law', 
                          'heat-transfer', 'density-buoyancy', 'expansion-of-air', 'expansion-of-solids-liquids',
                          'reflection-of-light', 'refraction-of-light', 'projectile-motion', 'magnetic-field-mapping',
                          // Chemistry Labs
                          'separation-techniques', 'ammonia-test', 'hydrogen-pop-test', 'oxygen-test', 
                          'limewater-test-for-co2', 'litmus-test', 'neutralization-reaction', 
                          'rusting-of-iron', 'acid-base-neutralization', 'test-for-water', 
                          'flame-test', 'metal-acid-reaction', 'condensation', 'evaporation-of-liquids',
                          // Biology Labs
                          'food-tests', 'osmosis', 'photosynthesis-oxygen-production', 'biuret-test-for-protein',
                          'grease-spot-test-for-fats', 'cell-division-simulator', 'respiration-in-seeds',
                          'transpiration-in-plants', 'enzyme-starch-digestion'
                        ].includes(experiment.slug);

  const subjectColors = {
    Biology: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
    Chemistry: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30',
    Physics: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
    Science: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30'
  };

  const handleCompleteExperiment = () => {
    setExperimentCompleted(true);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  // Generic quiz questions for all labs (can be customized per lab in future)
  const quizQuestions: QuizQuestion[] = [
    {
      question: "What was the main objective of this experiment?",
      options: [
        "To observe the physical properties",
        "To test chemical reactions",
        "To understand scientific principles through hands-on exploration",
        "To collect data only"
      ],
      correctAnswer: 2,
      explanation: "Virtual lab experiments help students understand scientific principles through interactive exploration and observation."
    },
    {
      question: "Why is it important to follow the procedure carefully?",
      options: [
        "To save time",
        "To ensure accurate and reliable results",
        "To finish quickly",
        "To impress others"
      ],
      correctAnswer: 1,
      explanation: "Following experimental procedures carefully ensures that results are accurate, reliable, and can be reproduced."
    },
    {
      question: "What should you do after completing an experiment?",
      options: [
        "Forget about it immediately",
        "Only write down the final answer",
        "Analyze the results and draw conclusions",
        "Start a new experiment"
      ],
      correctAnswer: 2,
      explanation: "After an experiment, it's crucial to analyze results, compare with expected outcomes, and draw meaningful conclusions from the observations."
    }
  ];

  return (
    <V1RouteGuard campus={campus} feature="virtualLabs">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-purple-950/30 dark:to-indigo-950/30 relative overflow-hidden">
        {/* Premium Animated Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-300/20 via-violet-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-300/20 via-blue-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Premium Back Button */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <Link href={addTenantParam('/virtual-labs')}>
              <Button variant="ghost" className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-violet-500/10 border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:scale-105">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Virtual Labs
              </Button>
            </Link>
            {userId !== 'guest' && (
              <ShareVirtualLabDialog
                labTitle={experiment.title}
                labSlug={experiment.slug}
                subject={experiment.subject}
                userId={userId}
              />
            )}
          </div>

          {/* For enhanced labs, render directly without wrapper UI */}
          {isEnhancedLab ? (
            <>
              {/* Premium header for enhanced labs */}
              <Card className="mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-purple-200/30 dark:border-purple-800/30 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">🔬</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">{experiment.title}</h1>
                        <Badge className={`${subjectColors[experiment.subject as keyof typeof subjectColors]} border-2 font-semibold`}>
                          {experiment.subject}
                        </Badge>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{experiment.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Enhanced lab handles its own UI flow */}
              <LabComponent />
            </>
          ) : (
            <>
              {/* Premium wrapper UI for non-enhanced labs */}
              <Card className="mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-purple-200/30 dark:border-purple-800/30 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-5xl">🔬</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">{experiment.title}</h1>
                        <Badge className={`${subjectColors[experiment.subject as keyof typeof subjectColors]} border-2 font-semibold`}>
                          {experiment.subject}
                        </Badge>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{experiment.description}</p>
                    </div>
                  </div>

                  {/* Premium Progress Indicator */}
                  <div className="flex items-center gap-4">
                    <div className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${
                      !experimentCompleted 
                        ? 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 border-2 border-purple-400/50' 
                        : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400/50'
                    }`}>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold shadow-lg ${
                        !experimentCompleted 
                          ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white' 
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                      }`}>
                        {experimentCompleted ? <CheckCircle2 className="h-6 w-6" /> : '1'}
                      </div>
                      <span className={`font-semibold ${
                        !experimentCompleted 
                          ? 'bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent' 
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'
                      }`}>Experiment</span>
                    </div>
                    <div className="flex-1 h-2 bg-gradient-to-r from-purple-200 to-violet-200 dark:from-purple-800 dark:to-violet-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${
                        showQuiz 
                          ? 'w-full bg-gradient-to-r from-purple-600 to-violet-600' 
                          : experimentCompleted 
                            ? 'w-1/2 bg-gradient-to-r from-green-600 to-emerald-600' 
                            : 'w-0'
                      }`}></div>
                    </div>
                    <div className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${
                      showQuiz 
                        ? 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 border-2 border-purple-400/50' 
                        : 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700'
                    }`}>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold shadow-lg ${
                        showQuiz 
                          ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white' 
                          : 'bg-slate-400 dark:bg-slate-600 text-white'
                      }`}>
                        2
                      </div>
                      <span className={`font-semibold ${
                        showQuiz 
                          ? 'bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent' 
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>Post-Lab Quiz</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Premium Experiment Section */}
              {!showQuiz && (
                <>
                  <Card className="mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-purple-200/30 dark:border-purple-800/30 shadow-2xl">
                    <CardContent className="p-4 sm:p-6 min-h-[400px] sm:min-h-[500px]">
                      <LabComponent />
                    </CardContent>
                  </Card>

                  {/* Premium Complete Experiment Button - Only show after user interaction */}
                  {!experimentCompleted && userInteracted && (
                    <div className="mb-6 text-center">
                      <Button 
                        size="lg" 
                        onClick={handleCompleteExperiment} 
                        className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 px-8 py-6 text-lg font-bold"
                      >
                        Mark Experiment as Complete
                        <CheckCircle2 className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  )}

                  {/* Premium Post-Lab Quiz CTA */}
                  {experimentCompleted && (
                    <Card className="mb-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border-2 border-green-400/50 dark:border-green-600/50 shadow-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-3">
                            <div className="text-4xl">✅</div>
                            <div>
                              <p className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">Experiment Completed!</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">Test your understanding with the post-lab quiz.</p>
                            </div>
                          </div>
                          <Button 
                            onClick={handleStartQuiz} 
                            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                          >
                            Start Post-Lab Quiz
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Premium Lab Notes with Exam Practice Reminder - Only show after user interaction */}
                  {userInteracted && (
                    <>
                      <Card className="mb-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 backdrop-blur-xl border-2 border-amber-200/50 dark:border-amber-800/50 shadow-xl">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-3">
                            <div className="text-3xl">📝</div>
                            <div>
                              <p className="font-bold text-amber-900 dark:text-amber-100 mb-2">Exam Preparation Tip</p>
                              <p className="text-sm text-amber-800 dark:text-amber-200">
                                Use digital notes below to capture your observations quickly, 
                                but <strong>remember to copy important points by hand</strong> into your notebook! Handwriting builds 
                                muscle memory and prepares you for written exams.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <LabNotes labId={experiment.id} labTitle={experiment.title} />
                    </>
                  )}
                </>
              )}

              {/* Premium Post-Lab Quiz Section */}
              {showQuiz && (
                <Card className="mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-purple-200/30 dark:border-purple-800/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">Post-Lab Quiz</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">Test your understanding of the experiment.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {quizQuestions.map((q, index) => (
                      <Card 
                        key={index} 
                        className={`border-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm ${
                          quizAnswers[index] !== undefined 
                            ? quizAnswers[index] === q.correctAnswer 
                              ? 'border-green-400/50 dark:border-green-600/50 bg-green-500/10' 
                              : 'border-red-400/50 dark:border-red-600/50 bg-red-500/10'
                            : 'border-purple-200/30 dark:border-purple-800/30'
                        }`}
                      >
                        <CardHeader>
                          <CardTitle className="text-lg font-bold">
                            Question {index + 1}: {q.question}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {q.options.map((option, optionIndex) => (
                            <Button
                              key={optionIndex}
                              variant={quizAnswers[index] === optionIndex ? "default" : "outline"}
                              className={`w-full justify-start text-left h-auto py-4 px-4 text-base transition-all hover:scale-[1.02] ${
                                quizAnswers[index] !== undefined && optionIndex === q.correctAnswer
                                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg'
                                  : quizAnswers[index] === optionIndex && optionIndex !== q.correctAnswer
                                  ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg'
                                  : 'hover:bg-purple-50 dark:hover:bg-purple-950/30 border-2'
                              }`}
                              onClick={() => handleAnswerSelect(index, optionIndex)}
                              disabled={quizAnswers[index] !== undefined}
                            >
                              <span className="font-bold mr-3 text-lg">{String.fromCharCode(65 + optionIndex)}.</span>
                              {option}
                            </Button>
                          ))}
                          {quizAnswers[index] !== undefined && (
                            <Card className={`mt-4 ${
                              quizAnswers[index] === q.correctAnswer 
                                ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-400/50 dark:border-green-600/50' 
                                : 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-2 border-red-400/50 dark:border-red-600/50'
                            }`}>
                              <CardContent className="p-4">
                                {quizAnswers[index] === q.correctAnswer ? (
                                  <div className="flex items-start gap-2">
                                    <span className="text-2xl">✅</span>
                                    <div>
                                      <p className="font-bold text-green-700 dark:text-green-400 mb-1">Correct!</p>
                                      <p className="text-sm text-green-600 dark:text-green-300">{q.explanation}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-start gap-2">
                                    <span className="text-2xl">❌</span>
                                    <div>
                                      <p className="font-bold text-red-700 dark:text-red-400 mb-1">Incorrect. The correct answer is {String.fromCharCode(65 + q.correctAnswer)}.</p>
                                      <p className="text-sm text-red-600 dark:text-red-300">{q.explanation}</p>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {/* Premium Quiz Results */}
                    {quizAnswers.length === quizQuestions.length && !labCompleted && (() => {
                      const score = quizAnswers.filter((ans, idx) => ans === quizQuestions[idx].correctAnswer).length;
                      const timeSpent = Math.floor((Date.now() - startTime) / 60000); // minutes
                      const percentage = Math.round((score / quizQuestions.length) * 100);
                      
                      // Calculate and award XP
                      const earnedXP = markLabComplete(experiment.id, percentage, timeSpent);
                      
                      // Trigger completion state
                      setTimeout(() => {
                        setLabCompleted(true);
                        
                        // Trigger confetti celebration
                        confetti({
                          particleCount: 100,
                          spread: 70,
                          origin: { y: 0.6 }
                        });
                      }, 0);
                      
                      return (
                        <Card className="bg-gradient-to-br from-purple-500/20 via-violet-500/20 to-indigo-500/20 backdrop-blur-xl border-2 border-purple-400/50 dark:border-purple-600/50 shadow-2xl overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/30 to-yellow-400/30 rounded-full blur-3xl"></div>
                          <CardHeader className="relative z-10">
                            <CardTitle className="flex items-center gap-3 text-3xl">
                              <div className="text-4xl">🏆</div>
                              <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 dark:from-amber-400 dark:via-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">Lab Complete! 🎉</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6 relative z-10">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="group text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl border-2 border-green-200/30 dark:border-green-800/30 hover:scale-105 transition-all">
                                <CheckCircle2 className="h-8 w-8 mx-auto text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{percentage}%</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Score</p>
                              </div>
                              <div className="group text-center p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 backdrop-blur-sm rounded-xl border-2 border-yellow-200/30 dark:border-yellow-800/30 hover:scale-105 transition-all">
                                <Star className="h-8 w-8 mx-auto text-yellow-600 dark:text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
                                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">{score}/{quizQuestions.length}</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Correct</p>
                              </div>
                              <div className="group text-center p-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 backdrop-blur-sm rounded-xl border-2 border-purple-200/30 dark:border-purple-800/30 hover:scale-105 transition-all">
                                <Zap className="h-8 w-8 mx-auto text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">+{earnedXP}</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">XP Earned</p>
                              </div>
                              <div className="group text-center p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-xl border-2 border-blue-200/30 dark:border-blue-800/30 hover:scale-105 transition-all">
                                <FlaskConical className="h-8 w-8 mx-auto text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{timeSpent}</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Minutes</p>
                              </div>
                            </div>
                            
                            {percentage === 100 && (
                              <Card className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 backdrop-blur-xl border-2 border-amber-400/50 dark:border-amber-600/50">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="text-3xl">🏆</div>
                                    <div>
                                      <p className="font-bold text-amber-900 dark:text-amber-100">Perfect Score!</p>
                                      <p className="text-sm text-amber-800 dark:text-amber-200">You've mastered this lab. Bonus XP awarded! 🏆</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                            
                            <div className="flex gap-3 flex-wrap">
                              <Button 
                                onClick={() => setShowQuiz(false)} 
                                variant="outline"
                                className="border-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                Review Experiment
                              </Button>
                              <Button 
                                onClick={() => {
                                  setQuizAnswers([]);
                                  setLabCompleted(false);
                                  setStartTime(Date.now());
                                }}
                                variant="outline"
                                className="border-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                Retry Quiz
                              </Button>
                              <Link href={addTenantParam('/virtual-labs')} className="flex-1">
                                <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
                                  Back to Virtual Labs
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </V1RouteGuard>
  );
}
